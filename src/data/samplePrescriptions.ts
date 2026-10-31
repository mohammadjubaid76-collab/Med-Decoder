/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { PrescriptionAnalysis } from '../types';

export const samplePrescriptions: PrescriptionAnalysis[] = [
  {
    id: 'rx-001',
    doctorName: 'Dr. Rajesh Sharma, MD (Medicine)',
    clinicHospital: 'Apollo Health City Clinic, Bandra',
    prescriptionDate: '2026-10-28',
    patientName: 'Ramesh Patel',
    overallClarityScore: 84,
    isDemo: true,
    notes: {
      en: 'Clear prescription for upper respiratory symptoms & mild fever. 3 medicines detected clearly; 1 cough syrup notation contains cursive handwriting requiring pharmacist confirmation.',
      hi: 'सर्दी, बुखार एवं गले की खराश के लिए पर्चा। ३ दवाइयां स्पष्ट रूप से पढ़ी गईं; कफ सिरप की लिखावट अस्पष्ट है जिसकी फार्मासिस्ट से जांच आवश्यक है।',
      mr: 'सर्दी, ताप आणि घशाच्या त्रासासाठीचे प्रिस्क्रिप्शन. ३ औषधे स्पष्टपणे वाचता आली; एका कफ सिरपचे अक्षर अस्पष्ट असल्याने फार्मासिस्टकडून खात्री करावी.',
    },
    medicines: [
      {
        id: 'med-1',
        name: 'Tab. Augmentin 625 Duo (Amoxicillin + Clavulanic Acid)',
        type: 'Tablet',
        detectedDosage: '625 mg',
        frequency: '1 tablet twice daily (1-0-1)',
        confidenceScore: 96,
        isHandwritingUnclear: false,
        verifyWithPharmacist: false,
        timing: {
          en: 'Take with or right after food for 5 complete days. Do not stop midway.',
          hi: 'खाना खाने के तुरंत बाद लें। पूरे ५ दिन का कोर्स पूरा करें, बीच में बंद न करें।',
          mr: 'जेवणानंतर लगेच घ्यावी. पूर्ण ५ दिवसांचा कोर्स पूर्ण करावा, मधेच थांबवू नये.',
        },
        clinicalPurpose: {
          en: 'Antibiotic for bacterial respiratory infection.',
          hi: 'बैक्टीरियल संक्रमण को रोकने वाली एंटीबायोटिक दवा।',
          mr: 'जिवाणू संसर्गावरील अँटीबायोटिक औषध.',
        },
      },
      {
        id: 'med-2',
        name: 'Tab. Dolo 650 (Paracetamol)',
        type: 'Tablet',
        detectedDosage: '650 mg',
        frequency: '1 tablet as needed (SOS) - max 3 times daily',
        confidenceScore: 98,
        isHandwritingUnclear: false,
        verifyWithPharmacist: false,
        timing: {
          en: 'Take only when fever or body ache exceeds 99°F, minimum 6 hours between doses.',
          hi: 'बुखार या बदन दर्द होने पर लें। दो खुराकों के बीच कम से कम ६ घंटे का अंतर रखें।',
          mr: 'ताप किंवा अंगदुखी असल्यास घ्यावी. दोन गोळ्यांमध्ये किमान ६ तासांचे अंतर ठेवावे.',
        },
        clinicalPurpose: {
          en: 'Fever reducer and analgesic body ache relief.',
          hi: 'बुखार कम करने एवं दर्द निवारक दवा।',
          mr: 'ताप व अंगदुखी कमी करणारी गोळी.',
        },
      },
      {
        id: 'med-3',
        name: 'Tab. Pantocid 40 (Pantoprazole)',
        type: 'Tablet',
        detectedDosage: '40 mg',
        frequency: '1 tablet daily in morning (1-0-0)',
        confidenceScore: 92,
        isHandwritingUnclear: false,
        verifyWithPharmacist: false,
        timing: {
          en: 'Take in the morning 30 minutes before breakfast with a glass of water.',
          hi: 'सुबह नाश्ते से ३० मिनट पहले खाली पेट एक गिलास पानी के साथ लें।',
          mr: 'सकाळी नाश्त्यापूर्वी ३० मिनिटे उपाशीपोटी पाण्यासोबत घ्यावी.',
        },
        clinicalPurpose: {
          en: 'Prevents stomach acid irritation from antibiotic.',
          hi: 'एंटीबायोटिक से होने वाली गैस और पेट की जलन रोकने के लिए।',
          mr: 'गोळ्यांमुळे होणारी पित्त व ॲसिडिटी रोखण्यासाठी.',
        },
      },
      {
        id: 'med-4',
        name: 'Syr. Ascoril-D / Alex Cough (Handwriting Unclear)',
        type: 'Syrup',
        detectedDosage: '10 ml (?)',
        frequency: 'Twice daily (?)',
        confidenceScore: 58,
        isHandwritingUnclear: true,
        verifyWithPharmacist: true,
        timing: {
          en: 'Exact syrup formulation cursive notation is uncertain. Verify exact bottle with dispensing chemist.',
          hi: 'कफ सिरप का नाम व सटीक मात्रा लिखावट में अस्पष्ट है। मेडिकल स्टोर वाले से पुष्टि कराएं।',
          mr: 'सिरपचे अचूक नाव व प्रमाण अस्पष्ट आहे. औषध विक्रेत्याकडून तपासून घ्यावे.',
        },
        clinicalPurpose: {
          en: 'Cough soothing formulation.',
          hi: 'खांसी में आराम देने वाला सिरप।',
          mr: 'खोकल्यावर आराम देणारे औषध.',
        },
      },
    ],
  },
  {
    id: 'rx-002',
    doctorName: 'Dr. Meera Vaidya, MD (Cardiology)',
    clinicHospital: 'Jupiter Hospital Speciality OPD, Thane',
    prescriptionDate: '2026-10-25',
    patientName: 'Sunita Deshmukh',
    overallClarityScore: 91,
    isDemo: true,
    notes: {
      en: 'Hypertension and cholesterol management regimen. Medicines clearly identified with designated schedules.',
      hi: 'उच्च रक्तचाप (बीपी) एवं कोलेस्ट्रॉल नियंत्रण का पर्चा। दवाइयां स्पष्ट हैं।',
      mr: 'उच्च रक्तदाब आणि कोलेस्टेरॉल नियंत्रणासाठीचे प्रिस्क्रिप्शन. औषधे स्पष्ट आहेत.',
    },
    medicines: [
      {
        id: 'med-c1',
        name: 'Tab. Telma 40 (Telmisartan)',
        type: 'Tablet',
        detectedDosage: '40 mg',
        frequency: '1 tablet once daily morning (1-0-0)',
        confidenceScore: 95,
        isHandwritingUnclear: false,
        verifyWithPharmacist: false,
        timing: {
          en: 'Take daily at fixed morning time, with or without food.',
          hi: 'रोजाना सुबह एक निश्चित समय पर लें, खाना खाने से पहले या बाद।',
          mr: 'दररोज सकाळी एकाच निश्चित वेळी घ्यावी, जेवणापूर्वी किंवा नंतर.',
        },
        clinicalPurpose: {
          en: 'Blood pressure regulation.',
          hi: 'ब्लड प्रेशर को सामान्य स्तर पर रखने के लिए।',
          mr: 'रक्तदाब नियंत्रित ठेवण्यासाठी.',
        },
      },
      {
        id: 'med-c2',
        name: 'Tab. Rosuvas 10 (Rosuvastatin)',
        type: 'Tablet',
        detectedDosage: '10 mg',
        frequency: '1 tablet once daily at night (0-0-1)',
        confidenceScore: 94,
        isHandwritingUnclear: false,
        verifyWithPharmacist: false,
        timing: {
          en: 'Take at night before sleeping.',
          hi: 'रात को सोने से पहले लें।',
          mr: 'रात्री झोपण्यापूर्वी घ्यावी.',
        },
        clinicalPurpose: {
          en: 'Lipid control and cardiovascular protection.',
          hi: 'कोलेस्ट्रॉल कम करने और दिल की सुरक्षा के लिए।',
          mr: 'कोलेस्टेरॉल कमी करून हृदयाचे संरक्षण करण्यासाठी.',
        },
      },
      {
        id: 'med-c3',
        name: 'Tab. Ecosprin 75 (Handwriting partially faded)',
        type: 'Tablet',
        detectedDosage: '75 mg (?)',
        frequency: '1 tablet after lunch (0-1-0)',
        confidenceScore: 72,
        isHandwritingUnclear: true,
        verifyWithPharmacist: true,
        timing: {
          en: 'After main meal. Confirm dosage (75mg vs 150mg) with pharmacist.',
          hi: 'दोपहर के खाने के बाद। सही खुराक (75mg अथवा 150mg) की मेडिकल स्टोर पर पुष्टि कराएं।',
          mr: 'दुपारच्या जेवणानंतर. ७५ मिग्रॅ की १५० मिग्रॅ याची फार्मासिस्टकडून खात्री करा.',
        },
        clinicalPurpose: {
          en: 'Blood thinner for circulation.',
          hi: 'खून को पतला रखने वाली सुरक्षात्मक दवा।',
          mr: 'रक्त पातळ ठेवणारे औषध.',
        },
      },
    ],
  },
];
