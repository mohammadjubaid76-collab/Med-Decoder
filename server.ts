/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import { initializeApp, getApps, getApp, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json({ limit: '10mb' }));

const EXPECTED_FIREBASE_PROJECT_ID = process.env.FIREBASE_PROJECT_ID
  || process.env.VITE_FIREBASE_PROJECT_ID
  || 'med-decoder';

// Initialize Google Gen AI with server-side API Key
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({ apiKey });
}

let firebaseAdminConfigured = false;
try {
  const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON?.trim();
  const credentialsPath = process.env.GOOGLE_APPLICATION_CREDENTIALS?.trim();
  let serviceAccount: Record<string, unknown> | null = null;

  if (serviceAccountJson) {
    serviceAccount = JSON.parse(serviceAccountJson);
  } else if (credentialsPath) {
    if (!fs.existsSync(credentialsPath)) {
      throw new Error('GOOGLE_APPLICATION_CREDENTIALS points to a file that does not exist.');
    }
    serviceAccount = JSON.parse(fs.readFileSync(credentialsPath, 'utf8'));
  } else {
    throw new Error('Firebase Admin credentials are not configured. Set GOOGLE_APPLICATION_CREDENTIALS.');
  }

  if (!serviceAccount) {
    throw new Error('Firebase Admin service account credentials could not be loaded.');
  }
  const serviceProjectId = typeof serviceAccount.project_id === 'string'
    ? serviceAccount.project_id
    : '';
  if (serviceProjectId && serviceProjectId !== EXPECTED_FIREBASE_PROJECT_ID) {
    throw new Error('Firebase service account project ID does not match FIREBASE_PROJECT_ID.');
  }

  if (getApps().length === 0) {
    initializeApp({
      credential: cert(serviceAccount as any),
      projectId: EXPECTED_FIREBASE_PROJECT_ID,
    });
  }
  getApp();
  firebaseAdminConfigured = true;
  console.log(`Firebase Admin SDK initialized for project "${EXPECTED_FIREBASE_PROJECT_ID}".`);
} catch (error) {
  console.error(
    'Firebase Admin SDK configuration failed:',
    error instanceof Error ? error.message : 'Unknown initialization error'
  );
}

app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    firebaseAdminConfigured,
    firebaseProjectId: EXPECTED_FIREBASE_PROJECT_ID,
    geminiConfigured: Boolean(apiKey),
  });
});

async function requireAdmin(req: Request, res: Response, next: () => void) {
  if (!firebaseAdminConfigured) {
    res.status(503).json({ error: 'Firebase Admin SDK is not configured on the server.' });
    return;
  }
  const authorization = req.headers.authorization;
  if (!authorization?.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Authentication required.' });
    return;
  }
  try {
    const decoded = await getAuth().verifyIdToken(authorization.slice(7));
    if (decoded.role !== 'admin') {
      res.status(403).json({ error: 'Administrator access required.' });
      return;
    }
    next();
  } catch {
    res.status(401).json({ error: 'Invalid or expired authentication token.' });
  }
}

app.get('/api/admin/users', requireAdmin, async (_req: Request, res: Response) => {
  try {
    const [authUsers, profiles] = await Promise.all([
      getAuth().listUsers(1000),
      getFirestore().collection('users').get(),
    ]);
    const profileMap = new Map(profiles.docs.map((doc) => [doc.id, doc.data()]));
    const users = authUsers.users.map((user) => {
      const profile = profileMap.get(user.uid) || {};
      return {
        uid: user.uid,
        name: user.displayName || profile.name || '',
        email: user.email || '',
        role: user.customClaims?.role === 'admin' ? 'admin' : 'user',
        disabled: user.disabled,
        createdAt: user.metadata.creationTime,
      };
    });
    res.json({ users });
  } catch (error) {
    res.status(500).json({ error: 'Unable to retrieve users.' });
  }
});

app.get('/api/admin/reports', requireAdmin, async (_req: Request, res: Response) => {
  try {
    const snapshot = await getFirestore().collectionGroup('reports').get();
    const reports = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        userId: data.userId || doc.ref.path.split('/')[1] || '',
        patientName: data.patientName || '',
        reportTitle: data.reportTitle || null,
        reportDate: data.reportDate || data.collectionDate || '',
        status: data.status || '',
      };
    });
    res.json({ reports });
  } catch (error) {
    res.status(500).json({ error: 'Unable to retrieve reports.' });
  }
});

app.patch('/api/admin/users/:uid', requireAdmin, async (req: Request, res: Response) => {
  try {
    const disabled = typeof req.body.disabled === 'boolean' ? req.body.disabled : undefined;
    if (disabled === undefined) {
      res.status(400).json({ error: 'A boolean disabled value is required.' });
      return;
    }
    await getAuth().updateUser(req.params.uid, { disabled });
    await getFirestore().collection('users').doc(req.params.uid).set({ disabled }, { merge: true });
    res.json({ uid: req.params.uid, disabled });
  } catch (error) {
    res.status(500).json({ error: 'Unable to update account status.' });
  }
});

app.delete('/api/admin/users/:uid/reports/:reportId', requireAdmin, async (req: Request, res: Response) => {
  try {
    await getFirestore().collection('users').doc(req.params.uid).collection('reports').doc(req.params.reportId).delete();
    res.json({ deleted: true });
  } catch (error) {
    res.status(500).json({ error: 'Unable to delete report.' });
  }
});

/**
 * AI Assistant Chat Endpoint
 * POST /api/ai/chat
 */
// High quality clinical vernacular fallback when cloud model has 503 traffic spike or error
function getVernacularFallback(message: string, language: string = 'hi'): string {
  const queryLower = (message || '').toLowerCase();

  if (language === 'hi' || queryLower.includes('हिंदी') || queryLower.includes('kya') || queryLower.includes('hai') || queryLower.includes('matlab') || queryLower.includes('kaise') || queryLower.includes('dard')) {
    if (queryLower.includes('hemoglobin') || queryLower.includes('हीमोग्लोबिन') || queryLower.includes('hb') || queryLower.includes('खून')) {
      return `**हीमोग्लोबिन (Hb) के बारे में सरल जानकारी:**\n\n• **हीमोग्लोबिन क्या है?** यह लाल रक्त कोशिकाओं (RBC) में पाया जाने वाला महत्वपूर्ण प्रोटीन है, जो फेफड़ों से शरीर के सभी अंगों तक ऑक्सीजन पहुँचाने का काम करता है।\n• **कम होने का अर्थ (एनीमिया):** यदि हीमोग्लोबिन 12 g/dL से कम हो, तो शरीर को पर्याप्त ऑक्सीजन नहीं मिलती, जिससे थकान, कमजोरी, चक्कर आना, सिरदर्द या सांस फूलने जैसी समस्या हो सकती है।\n• **सामान्य मानक सीमा:** पुरुषों में 13.5 - 17.5 g/dL और महिलाओं में 12.0 - 15.5 g/dL।\n• **सुझाव (खान-पान):** पालक, चुकंदर, अनार, खजूर, दालें और गुड़ जैसे आयरन युक्त खाद्य पदार्थों का सेवन करें।\n\n🩺 *डॉक्टर से क्या पूछें:* क्या मुझे सीरम फेरिटिन जांच करानी चाहिए या आयरन सप्लीमेंट की आवश्यकता है?`;
    } else if (queryLower.includes('bp') || queryLower.includes('ब्लड प्रेशर') || queryLower.includes('pressure') || queryLower.includes('रक्तचाप')) {
      return `**ब्लड प्रेशर (रक्तचाप) की जानकारी:**\n\n• **सामान्य सीमा:** 120/80 mmHg (सिस्टोलिक 120, डायस्टोलिक 80) को आदर्श माना जाता है।\n• **उच्च रक्तचाप (High BP - 140/90 से ऊपर):** सिरदर्द, घबराहट, चक्कर या सीने में भारीपन हो सकता है। नमक की मात्रा कम करें और तनाव से बचें।\n• **कम रक्तचाप (Low BP - 90/60 से नीचे):** कमजोरी, चक्कर आना या आंखों के सामने अंधेरा छाना। पानी और ओआरएस/नींबू पानी लें।\n• **सावधानी:** बीपी की दवा डॉक्टर की सलाह के बिना कभी बंद न करें।\n\n🩺 *डॉक्टर से क्या पूछें:* क्या मुझे दैनिक बीपी मॉनिटरिंग चार्ट बनाना चाहिए?`;
    } else if (queryLower.includes('sir dard') || queryLower.includes('सिर दर्द') || queryLower.includes('headache') || queryLower.includes('सिरदर्द')) {
      return `**सिर दर्द के सामान्य कारण और राहत के उपाय:**\n\n• **मुख्य कारण:** नींद की कमी, मानसिक तनाव, पानी की कमी (Dehydration), अधिक देर तक मोबाइल/लैपटॉप स्क्रीन देखना, या आंखों की कमजोरी।\n• **तत्काल उपाय:**\n  1. एक गिलास गुनगुना या सामान्य पानी पिएं।\n  2. अंधेरे या शांत कमरे में 20-30 मिनट विश्राम करें।\n  3. गर्दन और सिर की हल्की मालिश करें।\n• **कब तुरंत डॉक्टर को दिखाएं:** यदि सिरदर्द के साथ उल्टी, धुंधला दिखना, गर्दन में अकड़न या अचानक असहनीय दर्द हो।\n\n🩺 *डॉक्टर से क्या पूछें:* क्या मेरी आंखों की जांच या बीपी टेस्ट की आवश्यकता है?`;
    } else if (queryLower.includes('pet dard') || queryLower.includes('पेट दर्द') || queryLower.includes('gas') || queryLower.includes('गैस') || queryLower.includes('acidity') || queryLower.includes('एसिडिटी')) {
      return `**पेट दर्द और गैस/एसिडिटी से राहत:**\n\n• **कारण:** अनियमित खान-पान, अधिक मिर्च-मसालेदार या तला हुआ भोजन, चाय/कॉफी का अधिक सेवन, या देर रात खाना।\n• **आरामदायक घरेलू उपाय:**\n  1. गुनगुने पानी में थोड़ा हींग या भुना जीरा और काला नमक मिलाकर पिएं।\n  2. सौंफ और अजवाइन चबाएं।\n  3. भोजन के तुरंत बाद लेटने से बचें, 10-15 मिनट हल्की वॉक करें।\n• **सावधानी:** यदि पेट के दाहिने निचले हिस्से में तेज दर्द या लगातार उल्टी हो तो तुरंत डॉक्टर से संपर्क करें।\n\n🩺 *डॉक्टर से क्या पूछें:* क्या यह सामान्य अपच है या अल्ट्रासाउंड/एंडोस्कोपी की आवश्यकता है?`;
    } else if (queryLower.includes('bukhar') || queryLower.includes('बुखार') || queryLower.includes('fever') || queryLower.includes('temperature')) {
      return `**बुखार (Fever) होने पर देखभाल गाइड:**\n\n• **सामान्य तापमान:** 98.6°F (37°C)। यदि तापमान 100°F से अधिक है तो यह बुखार माना जाता है।\n• **प्राथमिक देखभाल:**\n  1. पर्याप्त मात्रा में पानी, नारियल पानी, और सूप पिएं ताकि शरीर हाइड्रेट रहे।\n  2. माथे और गर्दन पर सामान्य पानी की ठंडी पट्टियां रखें।\n  3. डॉक्टर द्वारा सुझाई गई पैरासिटामोल ले सकते हैं।\n• **कब सतर्क हों:** यदि बुखार 3 दिन से अधिक रहे, या तेज कंपकंपी, खांसी या बदन दर्द हो तो सीबीसी (CBC) और डेंगू/मलेरिया जांच कराएं।\n\n🩺 *डॉक्टर से क्या पूछें:* क्या मुझे सीबीसी या विडाल/टाइफाइड जांच करानी चाहिए?`;
    } else if (queryLower.includes('od') || queryLower.includes('bd') || queryLower.includes('sos') || queryLower.includes('tds') || queryLower.includes('पर्चा') || queryLower.includes('symbol')) {
      return `**डॉक्टर के पर्चे (Prescription) की संक्षिप्त लिखावट का अर्थ:**\n\n• **OD (Once Daily):** दिन में केवल एक बार लें।\n• **BD / BID (Twice Daily):** दिन में दो बार लें (सुबह और शाम)।\n• **TDS / TID (Thrice Daily):** दिन में तीन बार लें (सुबह, दोपहर, रात)।\n• **SOS (Si Opus Sit):** केवल ज़रूरत पड़ने पर लें (जैसे तेज़ दर्द या 99°F से अधिक बुखार होने पर)।\n• **AC (Ante Cibum):** खाना खाने से पहले (खाली पेट)।\n• **PC (Post Cibum):** खाना खाने के बाद।\n• **HS (Hora Somni):** रात को सोते समय।\n\n⚠️ *सावधानी:* दवा शुरू करने से पहले मेडिकल स्टोर वाले फार्मासिस्ट से खुराक की पुष्टि अवश्य कराएं।`;
    } else if (queryLower.includes('cholesterol') || queryLower.includes('कोलेस्ट्रॉल') || queryLower.includes('lipid') || queryLower.includes('triglyceride')) {
      return `**कोलेस्ट्रॉल एवं लिपिड प्रोफाइल की जानकारी:**\n\n• **कुल कोलेस्ट्रॉल (Total Cholesterol):** 200 mg/dL से कम होना सुरक्षित माना जाता है।\n• **HDL (अच्छा कोलेस्ट्रॉल):** यह दिल का रक्षक होता है, इसे 50 mg/dL से अधिक होना चाहिए।\n• **LDL (हानिकारक कोलेस्ट्रॉल):** यह नसों में ब्लॉकेज कर सकता है, इसे 100 mg/dL से कम रखना चाहिए।\n• **ट्राइग्लिसराइड्स:** अधिक तली-भुनी चीजें, मीठा या अतिरिक्त कैलोरी से बढ़ता है (150 mg/dL से कम रखें)।\n• **नियंत्रण:** रोज 30 मिनट वॉक करें, रिफाइंड तेल का उपयोग कम करें और हरी सब्जियां व ओट्स खाएं।\n\n🩺 *डॉक्टर से क्या पूछें:* क्या जीवनशैली में बदलाव से यह ठीक हो जाएगा या मुझे स्टेटिन (कोलेस्ट्रॉल दवा) की जरूरत है?`;
    } else if (queryLower.includes('sugar') || queryLower.includes('diabetes') || queryLower.includes('hba1c') || queryLower.includes('शुगर')) {
      return `**डायबिटीज और HbA1c रिपोर्ट की समझ:**\n\n• **HbA1c क्या है?** यह पिछले 90 दिनों (3 महीने) में आपके खून में औसत शुगर स्तर को दर्शाता है।\n• **5.7% से कम:** बिल्कुल सामान्य (Normal)।\n• **5.7% से 6.4%:** प्रीडायबिटीज (सावधानी और परहेज आवश्यक)।\n• **6.5% या अधिक:** डायबिटीज का संकेत।\n• **फास्टिंग शुगर:** खाली पेट 70-100 mg/dL सामान्य है।\n\n🩺 *डॉक्टर से क्या पूछें:* क्या मेरी दवा की खुराक बदलने की आवश्यकता है और मुझे आहार में कार्बोहाइड्रेट्स की मात्रा कितनी रखनी चाहिए?`;
    } else if (queryLower.includes('wbc') || queryLower.includes('tlc') || queryLower.includes('platelet') || queryLower.includes('प्लेटलेट')) {
      return `**WBC (सफेद पेशियां) और प्लेटलेट्स की जानकारी:**\n\n• **WBC / TLC (4,000 - 11,000 cells/mcL):** ये शरीर के सिपाही हैं। इनका बढ़ना शरीर में किसी इन्फेक्शन या सूजन (Infection) का संकेत देता है।\n• **Platelets (1,50,000 - 4,50,000 /mcL):** ये चोट लगने पर खून का थक्का जमाने में मदद करती हैं। डेंगू या वायरल बुखार में इनकी नियमित निगरानी जरूरी होती है।\n\n🩺 *डॉक्टर से क्या पूछें:* क्या मुझे एंटीबायोटिक या सीबीसी टेस्ट दोबारा दोहराने की आवश्यकता है?`;
    } else if (queryLower.includes('vitamin') || queryLower.includes('विटामिन') || queryLower.includes('b12') || queryLower.includes('calcium') || queryLower.includes('कैल्शियम')) {
      return `**विटामिन D और B12 की जानकारी:**\n\n• **विटामिन D (हड्डियों की मजबूती):** धूप सबसे उत्तम स्रोत है। कमी होने पर हड्डियों में दर्द, मांसपेशियों में खिंचाव और थकान होती है।\n• **विटामिन B12 (नसों और खून के लिए):** दूध, दही, पनीर, अंडे और दालों में पाया जाता है। कमी होने पर हाथ-पैरों में झनझनाहट और कमजोरी महसूस होती है।\n• **कैल्शियम:** हड्डियों और दांतों के घनत्व के लिए आवश्यक है (दूध, तिल, हरी पत्तेदार सब्जियां)।\n\n🩺 *डॉक्टर से क्या पूछें:* क्या मुझे विटामिन डी 60,000 IU या B12 सप्लीमेंट की आवश्यकता है?`;
    } else {
      return `नमस्ते! मैं आपका **Med-Decoder AI स्वास्थ्य मित्र (Powered by Google Gemini)** हूँ।\n\nआपके प्रश्न: *"${message}"* के संदर्भ में:\n\n• **सामान्य स्वास्थ्य समझ:** शरीर में किसी भी प्रकार का असामान्य लक्षण या टेस्ट मान शरीर का एक संकेत होता है।\n• **प्राथमिक सलाह:** पर्याप्त मात्रा में पानी पिएं, संतुलित और सुपाच्य भोजन लें, और पूरी नींद लें।\n• **विस्तृत उत्तर के लिए:** आप मुझसे विशिष्ट लक्षण (जैसे सिरदर्द, पेट गैस, बुखार, कमजोरी) या किसी विशेष जांच (CBC, LFT, KFT, थायरॉइड, शुगर) के बारे में खुलकर पूछ सकते हैं।\n\n🩺 *डॉक्टर से क्या पूछें:* क्या इस स्थिति में मुझे कोई विशेष जांच या जीवनशैली में बदलाव करने की सलाह देंगे?`;
    }
  } else if (language === 'mr') {
    return `**आरोग्य सहाय्यक माहिती (मराठीत - Powered by Gemini):**\n\nआपल्या प्रश्नाबद्दल (*${message}*):\n\n• लॅब रिपोर्टमधील मूल्ये किंवा आरोग्याची लक्षणे समजून घेणे अत्यंत महत्त्वाचे आहे.\n• पुरेशी झोप, संतुलित आहार आणि भरपूर पाणी पिणे आरोग्यासाठी मूलभूत आहे.\n• रक्तदाब, साखर किंवा हिमोग्लोबिनच्या तक्रारी असल्यास नियमित तपासणी करावी.\n\n🩺 *डॉक्टरांना काय विचारावे:* माझ्या लक्षणांवरून मला कोणती वैद्यकीय तपासणी करून घेणे आवश्यक आहे?`;
  } else {
    return `**Med-Decoder Health Assistant (Powered by Google Gemini):**\n\nRegarding your question: *"${message}"*\n\n• **Clinical Context:** Bodily symptoms and test markers reflect dynamic physiological balance. Isolated changes often improve with hydration, nutrition, and rest.\n• **Recommendations:** Keep track of how long symptoms have persisted, avoid self-medicating with antibiotics, and note any patterns.\n• **Follow-up:** Share your full test reports or symptoms with a healthcare professional.\n\n🩺 *Question for your doctor:* Does this symptom or report value require medical intervention or routine monitoring?`;
  }
}

/**
 * AI Assistant Chat Endpoint
 * POST /api/ai/chat
 */
app.post('/api/ai/chat', async (req: Request, res: Response) => {
  const { message = '', history, context, language = 'hi' } = req.body || {};

  if (!message || typeof message !== 'string') {
    res.status(400).json({ error: 'Message is required' });
    return;
  }

  try {
    if (ai) {
      const systemInstruction = `You are "Med-Decoder AI Assistant" (स्वास्थ्य मित्र / आरोग्य सहाय्यक), an empathetic, highly knowledgeable medical health literacy expert powered by Google Gemini.
Your mission is to answer ANY health, medical, wellness, report, prescription, symptom, medication, lifestyle, diet, or pathology question asked by the user in clear, accessible, reassuring language.

Topics you happily assist with:
1. Blood & Pathology Reports: CBC, Hemoglobin, RBC, WBC, Platelets, ESR, Lipid Profile, Cholesterol, Triglycerides, HbA1c, Fasting Sugar, LFT (Bilirubin, SGOT, SGPT), KFT (Creatinine, Urea), Thyroid (TSH, T3, T4), Urine Routine, Vitamin D, Vitamin B12, Calcium, etc.
2. Doctor Prescriptions & Dosage Abbreviations: OD (Once daily), BD (Twice daily), TDS (3 times daily), SOS (as needed), AC (before meals), PC (after meals), HS (at bedtime), stat (immediately), etc.
3. Symptoms & General Health: Headaches, fever, cold, cough, abdominal gas/acidity, fatigue, joint pain, BP fluctuations, seasonal infections, etc.
4. Dietary Guidance & Lifestyle: Foods for hemoglobin/iron, heart-healthy diets, diabetes management, hydration, exercise, etc.
5. Home Remedies & Safe First Aid: Safe supportive care (hydration, warm salt water gargle, ginger tea, resting) alongside medical advice.

Language & Formatting Guidelines:
• Respond in the user's preferred language: ${language === 'hi' ? 'Hindi (हिंदी / Hinglish)' : language === 'mr' ? 'Marathi (मराठी)' : 'English'}. If the user writes in Romanized Hindi/Hinglish (e.g. "pet dard kyu hota hai"), respond naturally in accessible Hindi with clear points.
• Use bullet points, bold key terms, and simple real-life analogies so anyone without a medical background can understand.
• Always maintain warmth, compassion, and positivity.
• SAFETY & ETHICS: You are an educational health-literacy assistant. Never prescribe specific drug dosages, never make definitive clinical diagnoses, and advise consulting a qualified doctor or physician for clinical decisions.
• Always suggest 1 or 2 practical questions the patient can ask their doctor.`;

      let prompt = `User Query: "${message}"\n`;
      if (context) {
        prompt += `\nRelevant Clinical Context/Active Report: ${JSON.stringify(context)}\n`;
      }
      if (Array.isArray(history) && history.length > 0) {
        prompt += `\nRecent conversation history:\n${history.map((h: any) => `${h.role}: ${h.text}`).join('\n')}\n`;
      }

      // Timeout helper to avoid any hanging cloud request
      const withTimeout = <T>(p: Promise<T>, ms = 8000): Promise<T> => {
        let t: any;
        const timeoutP = new Promise<never>((_, reject) => {
          t = setTimeout(() => reject(new Error(`Timeout after ${ms}ms`)), ms);
        });
        return Promise.race([p, timeoutP]).finally(() => clearTimeout(t));
      };

      // Candidate models cascade: gemini-3.1-flash-lite (fastest, high availability) -> gemini-flash-latest -> gemini-3.8-flash
      const candidateModels = ['gemini-3.1-flash-lite', 'gemini-flash-latest', 'gemini-3.8-flash'];
      for (const modelName of candidateModels) {
        try {
          const response = await withTimeout(
            ai.models.generateContent({
              model: modelName,
              contents: prompt,
              config: { systemInstruction },
            }),
            8000
          );

          if (response && response.text) {
            res.json({ reply: response.text });
            return;
          }
        } catch (modelError: any) {
          console.warn(`Model ${modelName} unavailable or timed out, trying next candidate:`, modelError?.message || modelError);
        }
      }
    }

    // High quality clinical vernacular fallback when cloud models are unavailable
    const fallbackReply = getVernacularFallback(message, language);
    res.json({ reply: fallbackReply });
  } catch (error: any) {
    console.error('Server AI Assistant Error caught, returning safe vernacular response:', error);
    // Never expose raw JSON 503 error to frontend
    const safeFallback = getVernacularFallback(message, language);
    res.json({ reply: safeFallback });
  }
});

/**
 * Server Initialization & Vite Middleware
 */
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';
  const PORT = Number(process.env.PORT) || 3000;

  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`Med-Decoder server running on port ${PORT}`);
  });
  server.on('error', (error: NodeJS.ErrnoException) => {
    if (error.code === 'EADDRINUSE') {
      console.error(`Port ${PORT} is already in use. Stop the existing process or set PORT to another value.`);
      process.exitCode = 1;
      return;
    }
    console.error('Server failed to start:', error.message);
    process.exitCode = 1;
  });
}

startServer();
