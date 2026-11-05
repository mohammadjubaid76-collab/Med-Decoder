/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { LabReport } from '../types';

export const sampleReports: LabReport[] = [
  {
    id: 'rep-cbc-001',
    patientName: 'Ramesh Patel',
    patientAge: 46,
    patientGender: 'Male',
    labName: 'Metropolis Healthcare Diagnostics, Mumbai',
    collectionDate: '2026-10-24',
    reportDate: '2026-10-25',
    testCategory: 'CBC',
    status: 'Attention Needed',
    isDemo: true,
    reportTitle: {
      en: 'Complete Blood Count (CBC) with Differential',
      hi: 'कम्प्लीट ब्लड काउंट (CBC) रक्त जांच',
      mr: 'संपूर्ण रक्त तपासणी (CBC) अहवाल',
    },
    summary: {
      en: 'Your hemoglobin level is slightly low (11.2 g/dL), indicating mild anemia which may cause fatigue. Your white blood cells and platelets are within the normal safe range.',
      hi: 'आपका हीमोग्लोबिन स्तर थोड़ा कम (11.2 g/dL) है, जो हल्के एनीमिया (खून की कमी) का संकेत देता है जिससे थकान हो सकती है। सफेद रक्त कोशिकाएं (WBC) और प्लेटलेट्स सामान्य हैं।',
      mr: 'आपले हिमोग्लोबिन प्रमाण थोडे कमी (11.2 g/dL) आहे, जे सौम्य ॲनिमिया (रक्ताची कमतरता) दर्शवते, ज्यामुळे थकवा जाणवू शकतो. पांढऱ्या पेशी आणि प्लेटलेट्स सामान्य आहेत.',
    },
    tests: [
      {
        id: 't-hb',
        name: {
          en: 'Hemoglobin (Hb)',
          hi: 'हीमोग्लोबिन (खून की मात्रा)',
          mr: 'हिमोग्लोबिन (रक्तातील प्रमाण)',
        },
        category: 'Red Blood Cells',
        value: 11.2,
        unit: 'g/dL',
        referenceRange: { min: 13.5, max: 17.5, display: '13.5 - 17.5 g/dL' },
        status: 'low',
        vernacularExplanation: {
          en: 'Hemoglobin carries oxygen from your lungs to the rest of your body. A lower value means your tissues may receive less oxygen, leading to tiredness or mild breathlessness.',
          hi: 'हीमोग्लोबिन फेफड़ों से शरीर के सभी अंगों तक ऑक्सीजन पहुंचाता है। कम मान होने पर शरीर को पर्याप्त ऑक्सीजन नहीं मिलती, जिससे कमजोरी व थकान महसूस हो सकती है।',
          mr: 'हिमोग्लोबिन फुफ्फुसातून संपूर्ण शरीराला ऑक्सिजन पुरवते. प्रमाण कमी असल्यास शरीराला कमी ऑक्सिजन मिळतो, ज्यामुळे अशक्तपणा व दम लागल्यासारखे वाटते.',
        },
        lifestyleTip: {
          en: 'Consider discussing iron-rich foods (spinach, beetroot, lentils, pomegranate) with your doctor or clinical nutritionist.',
          hi: 'आयरन युक्त आहार (पालक, चुकंदर, दालें, अनार, गुड़) के बारे में अपने डॉक्टर से सलाह लें।',
          mr: 'लोहयुक्त आहार (पालक, बीट, डाळी, डाळिंब, गूळ) सुरू करण्याबाबत डॉक्टरांशी चर्चा करा.',
        },
      },
      {
        id: 't-rbc',
        name: {
          en: 'Total RBC Count',
          hi: 'कुल लाल रक्त कोशिकाएं (RBC)',
          mr: 'एकूण तांबड्या पेशी (RBC)',
        },
        category: 'Red Blood Cells',
        value: 4.1,
        unit: 'million/mcL',
        referenceRange: { min: 4.5, max: 5.9, display: '4.5 - 5.9 million/mcL' },
        status: 'borderline',
        vernacularExplanation: {
          en: 'Red blood cells produce hemoglobin. Your count is slightly below the lower normal boundary.',
          hi: 'लाल रक्त कोशिकाएं शरीर में खून का मुख्य हिस्सा हैं। आपका स्तर सामान्य सीमा से थोड़ा ही नीचे है।',
          mr: 'तांबड्या पेशी रक्तातील प्रमुख घटक आहेत. आपले प्रमाण सामान्य मर्यादेपेक्षा थोडे कमी आहे.',
        },
      },
      {
        id: 't-wbc',
        name: {
          en: 'Total Leukocyte Count (TLC / WBC)',
          hi: 'सफेद रक्त कोशिकाएं (रोग प्रतिरोधक पेशियां)',
          mr: 'पांढऱ्या रक्त पेशी (रोगप्रतिकारक पेशी)',
        },
        category: 'Immunity',
        value: 7800,
        unit: 'cells/mcL',
        referenceRange: { min: 4000, max: 11000, display: '4,000 - 11,000 cells/mcL' },
        status: 'normal',
        vernacularExplanation: {
          en: 'WBCs are your body\'s defense soldiers fighting infections. Your count is completely normal and healthy.',
          hi: 'सफेद रक्त कोशिकाएं बीमारियों और संक्रमण से लड़ने वाले सिपाही हैं। आपकी गिनती बिल्कुल सामान्य व स्वस्थ है।',
          mr: 'पांढऱ्या पेशी संसर्गाविरुद्ध लढतात. आपली संख्या पूर्णपणे सामान्य आणि निरोगी आहे.',
        },
      },
      {
        id: 't-platelets',
        name: {
          en: 'Platelet Count',
          hi: 'प्लेटलेट्स (रक्त का थक्का बनाने वाले कण)',
          mr: 'प्लेटलेट्स (रक्त गोठवणारे घटक)',
        },
        category: 'Clotting',
        value: 245000,
        unit: '/mcL',
        referenceRange: { min: 150000, max: 450000, display: '150,000 - 450,000 /mcL' },
        status: 'normal',
        vernacularExplanation: {
          en: 'Platelets help prevent excessive bleeding by clotting blood when you get an injury. Your platelets are well within safe range.',
          hi: 'प्लेटलेट्स चोट लगने पर खून का बहना रोकती हैं। आपका स्तर पूरी तरह सुरक्षित और सामान्य है।',
          mr: 'जखम झाल्यास रक्तस्त्राव थांबवण्यासाठी प्लेटलेट्स मदत करतात. आपले प्रमाण योग्य मर्यादेत आहे.',
        },
      },
      {
        id: 't-mcv',
        name: {
          en: 'Mean Corpuscular Volume (MCV)',
          hi: 'एमसीवी (लाल रक्त कणिकाओं का आकार)',
          mr: 'एमसीव्ही (तांबड्या पेशींचा आकार)',
        },
        category: 'RBC Indices',
        value: 74,
        unit: 'fL',
        referenceRange: { min: 80, max: 100, display: '80 - 100 fL' },
        status: 'low',
        vernacularExplanation: {
          en: 'MCV measures the average size of your red blood cells. A low MCV often suggests iron deficiency (microcytic anemia).',
          hi: 'यह जांच लाल रक्त कोशिकाओं का आकार बताती है। कम मान आमतौर पर शरीर में आयरन (लोहा) की कमी की ओर इशारा करता है।',
          mr: 'हे तांबड्या पेशींचा सरासरी आकार दर्शवते. कमी आकार सामान्यतः लोहाच्या (Iron) कमतरतेचे लक्षण असते.',
        },
      },
    ],
    doctorQuestions: [
      {
        id: 'dq-1',
        question: {
          en: 'My hemoglobin and MCV are low. Does this confirm iron deficiency anemia, or could there be another cause?',
          hi: 'मेरा हीमोग्लोबिन और एमसीवी कम है। क्या यह आयरन की कमी से होने वाला एनीमिया है, या कोई अन्य कारण हो सकता है?',
          mr: 'माझे हिमोग्लोबिन आणि एमसीव्ही कमी आले आहे. हा लोहाच्या कमतरतेमुळे झालेला ॲनिमिया आहे का, की इतर काही कारण असू शकते?',
        },
        context: {
          en: 'Helps doctor evaluate if serum ferritin, vitamin B12, or iron profile tests are needed.',
          hi: 'डॉक्टर को सीरम फेरिटिन या विटामिन बी१२ जांच कराने का निर्णय लेने में मदद मिलेगी।',
          mr: 'डॉक्टरांना सीरम फेरिटिन किंवा व्हिटॅमिन बी१२ तपासणीची गरज आहे का हे ठरवता येईल.',
        },
      },
      {
        id: 'dq-2',
        question: {
          en: 'Do you recommend starting oral iron supplements, or should I first adjust my diet?',
          hi: 'क्या मुझे आयरन की गोलियां शुरू करनी चाहिए, या सिर्फ खान-पान में बदलाव से यह ठीक हो जाएगा?',
          mr: 'मला लोहाच्या गोळ्या सुरू कराव्या लागतील का, की केवळ आहारात बदल करून हे भरून निघेल?',
        },
        context: {
          en: 'Clarifies whether medical supplementation is urgently required based on clinical symptoms.',
          hi: 'यह स्पष्ट करता है कि क्या दवा की तत्काल आवश्यकता है या केवल पोषण से सुधार संभव है।',
          mr: 'लक्षणे पाहून तात्काळ औषधोपचार आवश्यक आहे का हे स्पष्ट होते.',
        },
      },
      {
        id: 'dq-3',
        question: {
          en: 'When should I repeat this CBC test to verify if my blood count is improving?',
          hi: 'मुझे यह जांच कितने समय (महीने) बाद दोबारा करानी चाहिए ताकि सुधार का पता चल सके?',
          mr: 'रक्तातील प्रमाण सुधारत आहे की नाही हे तपासण्यासाठी ही टेस्ट पुन्हा केव्हा करावी लागेल?',
        },
        context: {
          en: 'Usually repeated after 6 to 8 weeks of dietary modification or iron treatment.',
          hi: 'आमतौर पर आहार सुधार या इलाज के ६ से ८ सप्ताह बाद दोबारा जांच की जाती है।',
          mr: 'आहार किंवा उपचार सुरू केल्यानंतर साधारण ६ ते ८ आठवड्यांनी तपासणी केली जाते.',
        },
      },
    ],
  },
  {
    id: 'rep-lipid-002',
    patientName: 'Sunita Deshmukh',
    patientAge: 52,
    patientGender: 'Female',
    labName: 'Dr. Lal PathLabs, Pune',
    collectionDate: '2026-10-26',
    reportDate: '2026-10-27',
    testCategory: 'Lipid Profile',
    status: 'Attention Needed',
    isDemo: true,
    reportTitle: {
      en: 'Comprehensive Lipid & Cholesterol Profile',
      hi: 'लिपिड एवं कोलेस्ट्रॉल प्रोफाइल जांच',
      mr: 'लिपिड आणि कोलेस्टेरॉल प्रोफाइल अहवाल',
    },
    summary: {
      en: 'Your Total Cholesterol (228 mg/dL) and Triglycerides (195 mg/dL) are elevated above the recommended safe boundaries. Your good HDL cholesterol is in healthy range.',
      hi: 'आपका कुल कोलेस्ट्रॉल (228 mg/dL) और ट्राइग्लिसराइड्स (195 mg/dL) सुरक्षित सीमा से अधिक हैं। हालांकि अच्छा कोलेस्ट्रॉल (HDL) सुरक्षित स्तर पर है।',
      mr: 'आपले एकूण कोलेस्टेरॉल (228 mg/dL) आणि ट्रायग्लिसराइड्स (195 mg/dL) सामान्य मर्यादेपेक्षा जास्त आहेत. चांगले कोलेस्टेरॉल (HDL) समाधानकारक आहे.',
    },
    tests: [
      {
        id: 't-chol',
        name: {
          en: 'Total Cholesterol',
          hi: 'कुल कोलेस्ट्रॉल',
          mr: 'एकूण कोलेस्टेरॉल',
        },
        category: 'Lipids',
        value: 228,
        unit: 'mg/dL',
        referenceRange: { max: 200, display: '< 200 mg/dL' },
        status: 'high',
        vernacularExplanation: {
          en: 'Total cholesterol represents the overall fatty substances in your bloodstream. High values over time can lead to arterial plaque buildup.',
          hi: 'यह खून में मौजूद कुल वसा की मात्रा है। लंबे समय तक इसका उच्च स्तर धमनियों में रुकावट पैदा कर सकता है।',
          mr: 'हे रक्तातील एकूण चरबीचे प्रमाण दर्शवते. प्रमाण दीर्घकाळ जास्त राहिल्यास रक्तवाहिन्यांमध्ये अडथळा निर्माण होऊ शकतो.',
        },
      },
      {
        id: 't-trig',
        name: {
          en: 'Triglycerides',
          hi: 'ट्राइग्लिसराइड्स (रक्त में वसा)',
          mr: 'ट्रायग्लिसराइड्स (रक्तातील मेद)',
        },
        category: 'Lipids',
        value: 195,
        unit: 'mg/dL',
        referenceRange: { max: 150, display: '< 150 mg/dL' },
        status: 'high',
        vernacularExplanation: {
          en: 'Triglycerides are fats stored from excess calories, especially refined sugars and fried foods.',
          hi: 'यह अतिरिक्त कैलोरी, तले हुए भोजन और अत्यधिक मीठे से बनने वाली वसा है।',
          mr: 'जास्त गोड, तळलेले पदार्थ आणि अतिरिक्त कॅलरीजमुळे ही चरबी वाढते.',
        },
      },
      {
        id: 't-hdl',
        name: {
          en: 'HDL Cholesterol (Good Cholesterol)',
          hi: 'एचडीएल (अच्छा / रक्षक कोलेस्ट्रॉल)',
          mr: 'एचडीएल (चांगले / उपयुक्त कोलेस्टेरॉल)',
        },
        category: 'Lipids',
        value: 54,
        unit: 'mg/dL',
        referenceRange: { min: 50, display: '> 50 mg/dL (Female)' },
        status: 'normal',
        vernacularExplanation: {
          en: 'HDL helps scavenge bad cholesterol out of your blood vessels and carries it back to the liver.',
          hi: 'यह अच्छा कोलेस्ट्रॉल है जो रक्त वाहिकाओं से हानिकारक वसा को साफ करने में मदद करता है।',
          mr: 'हे चांगले कोलेस्टेरॉल असून रक्तवाहिन्यांमधील घाण व मेद कमी करण्याचे काम करते.',
        },
      },
      {
        id: 't-ldl',
        name: {
          en: 'LDL Cholesterol (Bad Cholesterol)',
          hi: 'एलडीएल (खराब / हानिकारक कोलेस्ट्रॉल)',
          mr: 'एलडीएल (वाईट कोलेस्टेरॉल)',
        },
        category: 'Lipids',
        value: 135,
        unit: 'mg/dL',
        referenceRange: { max: 100, display: '< 100 mg/dL' },
        status: 'borderline',
        vernacularExplanation: {
          en: 'LDL can slowly build up on artery walls. Keeping this in check protects heart and cardiovascular health.',
          hi: 'यह नसों में जमने वाला कोलेस्ट्रॉल है। इसे नियंत्रित रखना दिल की सेहत के लिए बहुत जरूरी है।',
          mr: 'हे रक्तवाहिन्यांमध्ये साचू शकणारे कोलेस्टेरॉल आहे. हृदयाच्या आरोग्यासाठी हे नियंत्रणात असणे गरजेचे आहे.',
        },
      },
    ],
    doctorQuestions: [
      {
        id: 'dq-lip-1',
        question: {
          en: 'My Total Cholesterol and Triglycerides are above normal. What dietary changes should I prioritize first?',
          hi: 'मेरा कोलेस्ट्रॉल और ट्राइग्लिसराइड्स बढ़ा हुआ है। मुझे खान-पान में सबसे पहले क्या बदलाव करने चाहिए?',
          mr: 'माझे कोलेस्टेरॉल आणि ट्रायग्लिसराइड्स वाढले आहेत. मी आहारात सर्वात आधी कोणते बदल करावेत?',
        },
        context: {
          en: 'Helps identify specific dietary triggers such as deep-fried items, trans fats, or high refined carb intake.',
          hi: 'तले-भुने भोजन व रिफाइंड तेल कम करने की दिशा तय करता है।',
          mr: 'तळलेले अन्न व गोड पदार्थ कमी करण्याबाबत मार्गदर्शन मिळते.',
        },
      },
      {
        id: 'dq-lip-2',
        question: {
          en: 'Do my current values warrant lipid-lowering medication (statins), or can we try lifestyle changes for 3 months?',
          hi: 'क्या मुझे दवा (स्टेटिन्स) लेने की जरूरत है, या पहले ३ महीने व्यायाम व खान-पान से सुधार देखा जा सकता है?',
          mr: 'मला लगेच औषध सुरू करावे लागेल की ३ महिने व्यायाम व आहाराद्वारे हे कमी करता येईल?',
        },
        context: {
          en: 'Assesses cardiovascular risk profile and medication necessity.',
          hi: 'हृदय स्वास्थ्य जोखिम और दवा की अनिवार्यता तय करता है।',
          mr: 'हृदयाच्या आरोग्याची जोखीम तपासून औषधांची गरज निश्चित करतो.',
        },
      },
      {
        id: 'dq-lip-3',
        question: {
          en: 'Would you recommend any additional tests, such as an ECG or fasting blood sugar check?',
          hi: 'क्या मुझे ईसीजी (ECG) या फास्टिंग ब्लड शुगर जैसी कोई अतिरिक्त जांच करानी चाहिए?',
          mr: 'मला ईसीजी (ECG) किंवा रक्तातील साखरेची काही अतिरिक्त तपासणी करावी लागेल का?',
        },
        context: {
          en: 'Lipid elevation often correlates with metabolic syndrome or glucose tolerance changes.',
          hi: 'कोलेस्ट्रॉल का संबंध अक्सर डायबिटीज और दिल की धड़कन से भी होता है।',
          mr: 'कोलेस्टेरॉलचा संबंध बऱ्याचदा मधुमेह आणि रक्तदाबाशी असू शकतो.',
        },
      },
    ],
  },
  {
    id: 'rep-diabetes-003',
    patientName: 'Anand Kulkarni',
    patientAge: 58,
    patientGender: 'Male',
    labName: 'SRL Diagnostics, Nagpur',
    collectionDate: '2026-10-22',
    reportDate: '2026-10-23',
    testCategory: 'Diabetic Panel (HbA1c)',
    status: 'Critical Review',
    isDemo: true,
    reportTitle: {
      en: 'Glycated Hemoglobin (HbA1c) & Fasting Plasma Glucose',
      hi: 'ग्लाइकेटेड हीमोग्लोबिन (HbA1c) एवं शुगर जांच',
      mr: 'ग्लायकेटेड हिमोग्लोबिन (HbA1c) व साखर अहवाल',
    },
    summary: {
      en: 'Your HbA1c is 7.8%, reflecting elevated average blood sugar over the preceding 90 days. Fasting blood glucose is also high at 148 mg/dL. Prompt consultation with your physician is recommended.',
      hi: 'आपका HbA1c 7.8% है, जो पिछले ३ महीनों में रक्त में चीनी का औसत स्तर अधिक होने का संकेत देता है। खाली पेट शुगर भी 148 mg/dL है। डॉक्टर से तुरंत सलाह लें।',
      mr: 'आपले HbA1c ७.८% आहे, जे मागील ३ महिन्यांत रक्तातील साखरेचे सरासरी प्रमाण जास्त असल्याचे दर्शवते. उपाशीपोटी साखरही १४८ mg/dL आहे. डॉक्टरांचा तातडीने सल्ला घ्यावा.',
    },
    tests: [
      {
        id: 't-hba1c',
        name: {
          en: 'Glycated Hemoglobin (HbA1c)',
          hi: 'एचबीए१सी (३ महीने का औसत शुगर स्तर)',
          mr: 'HbA1c (३ महिन्यांची सरासरी साखर)',
        },
        category: 'Diabetes',
        value: 7.8,
        unit: '%',
        referenceRange: { max: 5.7, display: '< 5.7% (Normal)' },
        status: 'high',
        vernacularExplanation: {
          en: 'HbA1c shows your blood sugar control over the last 2 to 3 months. Above 6.5% indicates diabetes needing active management.',
          hi: 'यह जांच बताती है कि पिछले ९० दिनों में शुगर कितनी रही। ६.५% से ऊपर का मान डायबिटीज की स्थिति दर्शाता है जिसे नियंत्रित करना आवश्यक है।',
          mr: 'ही चाचणी मागील २ ते ३ महिन्यांतील साखरेचे सरासरी प्रमाण दाखवते. ६.५% पेक्षा जास्त प्रमाण मधुमेह दर्शवते.',
        },
      },
      {
        id: 't-fbs',
        name: {
          en: 'Fasting Blood Sugar (FBS)',
          hi: 'फास्टिंग ब्लड शुगर (खाली पेट की शुगर)',
          mr: 'उपाशीपोटी रक्तातील साखर (FBS)',
        },
        category: 'Diabetes',
        value: 148,
        unit: 'mg/dL',
        referenceRange: { min: 70, max: 100, display: '70 - 100 mg/dL' },
        status: 'high',
        vernacularExplanation: {
          en: 'Measured after an overnight fast (8-10 hours). Values above 126 mg/dL on multiple tests confirm diabetes.',
          hi: 'रात भर बिना कुछ खाए सुबह की गई जांच। १२६ से अधिक का मान अनियंत्रित शुगर का संकेत है।',
          mr: 'रात्री ८ ते १० तास काही न खाता केलेली तपासणी. १२६ पेक्षा जास्त मूल्य अनियंत्रित साखरेचे लक्षण आहे.',
        },
      },
      {
        id: 't-eag',
        name: {
          en: 'Estimated Average Glucose (eAG)',
          hi: 'अनुमानित औसत ग्लूकोज स्तर',
          mr: 'अंदाजित सरासरी साखर स्तर',
        },
        category: 'Diabetes',
        value: 177,
        unit: 'mg/dL',
        referenceRange: { max: 126, display: '< 126 mg/dL' },
        status: 'high',
        vernacularExplanation: {
          en: 'The calculated daily average glucose level corresponding to your HbA1c.',
          hi: 'आपके HbA1c के आधार पर दिन भर का औसत शुगर स्तर।',
          mr: 'तुमच्या HbA1c वरून काढलेली दिवसभरातील सरासरी साखरेची पातळी.',
        },
      },
    ],
    doctorQuestions: [
      {
        id: 'dq-dia-1',
        question: {
          en: 'Given my HbA1c is 7.8%, do I need a dose adjustment of my diabetes medication?',
          hi: 'मेरा HbA1c 7.8% है। क्या मुझे अपनी शुगर की दवा की खुराक बदलने की आवश्यकता है?',
          mr: 'माझे HbA1c ७.८% आहे, मला सध्याच्या गोळ्यांचा डोस वाढवण्याची गरज आहे का?',
        },
        context: {
          en: 'Targets personalized glycemic control.',
          hi: 'व्यक्तिगत शुगर नियंत्रण योजना तय करने के लिए।',
          mr: 'साखरेचे योग्य व्यवस्थापन करण्यासाठी मदत होते.',
        },
      },
      {
        id: 'dq-dia-2',
        question: {
          en: 'Should I test my urine microalbumin or kidney function to ensure early organ protection?',
          hi: 'क्या मुझे किडनी और पेशाब की सुरक्षा जांच (माइक्रोएल्बुमिन) करानी चाहिए?',
          mr: 'किडनीचे आरोग्य तपासण्यासाठी युरिन मायक्रोअल्ब्युमिन टेस्ट करावी लागेल का?',
        },
        context: {
          en: 'Standard preventive screening for diabetes management.',
          hi: 'डायबिटीज के मरीजों के लिए नियमित सुरक्षा जांच।',
          mr: 'मधुमेहामध्ये अवयवांचे संरक्षण करण्यासाठी महत्त्वाची चाचणी.',
        },
      },
      {
        id: 'dq-dia-3',
        question: {
          en: 'What daily carbohydrate intake and walking regimen would you recommend for me?',
          hi: 'मेरे लिए रोजाना टहलने (वॉक) का समय और भोजन में क्या सावधानी जरूरी है?',
          mr: 'माझ्यासाठी दररोज चालण्याचा योग्य वेळ आणि आहाराचे काय नियम असावेत?',
        },
        context: {
          en: 'Concrete lifestyle guidelines from treating physician.',
          hi: 'डॉक्टर द्वारा प्रमाणित दैनिक दिनचर्या और आहार नियम।',
          mr: 'डॉक्टरांकडून अचूक जीवनशैली मार्गदर्शन मिळवण्यासाठी उपयुक्त.',
        },
      },
    ],
  },
];
