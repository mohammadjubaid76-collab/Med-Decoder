/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type Language = 'en' | 'hi' | 'mr';

export type TestStatus = 'normal' | 'high' | 'low' | 'borderline';

export interface VernacularText {
  en: string;
  hi: string;
  mr: string;
}

export interface TestResultItem {
  id: string;
  name: VernacularText;
  category: string;
  value: number | string;
  unit: string;
  referenceRange: {
    min?: number;
    max?: number;
    display: string;
  };
  status: TestStatus;
  vernacularExplanation: VernacularText;
  lifestyleTip?: VernacularText;
}

export interface DoctorQuestion {
  id: string;
  question: VernacularText;
  context: VernacularText;
}

export interface LabReport {
  id: string;
  patientName: string;
  patientAge: number;
  patientGender: 'Male' | 'Female' | 'Other';
  reportTitle: VernacularText;
  testCategory: 'CBC' | 'Lipid Profile' | 'Liver Function (LFT)' | 'Kidney Function (KFT)' | 'Diabetic Panel (HbA1c)' | 'Thyroid Profile';
  labName: string;
  collectionDate: string;
  reportDate: string;
  status: 'Normal' | 'Attention Needed' | 'Critical Review';
  summary: VernacularText;
  tests: TestResultItem[];
  doctorQuestions: DoctorQuestion[];
  isDemo?: boolean;
}

export interface PrescriptionMedicine {
  id: string;
  name: string;
  type: 'Tablet' | 'Syrup' | 'Capsule' | 'Ointment' | 'Injection' | 'Drops';
  detectedDosage: string;
  timing: VernacularText;
  frequency: string;
  confidenceScore: number; // 0 - 100
  isHandwritingUnclear: boolean;
  verifyWithPharmacist: boolean;
  clinicalPurpose: VernacularText;
}

export interface PrescriptionAnalysis {
  id: string;
  doctorName: string;
  clinicHospital: string;
  prescriptionDate: string;
  patientName: string;
  medicines: PrescriptionMedicine[];
  overallClarityScore: number;
  notes: VernacularText;
  isDemo?: boolean;
}
