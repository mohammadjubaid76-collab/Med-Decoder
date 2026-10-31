/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useApp } from '../../context/AppContext';
import { PrescriptionAnalysis, PrescriptionMedicine } from '../../types';
import { LanguageSelector } from '../common/LanguageSelector';
import {
  Pill,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ShieldAlert,
  Percent,
  Sparkles,
  UserCheck,
} from 'lucide-react';

interface PrescriptionCardProps {
  prescription: PrescriptionAnalysis;
}

export const PrescriptionCard: React.FC<PrescriptionCardProps> = ({ prescription }) => {
  const { language, t } = useApp();

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-6">
      {/* Header and Doctor info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              {prescription.clinicHospital}
            </span>
            <span className="text-slate-300">·</span>
            <span className="text-[11px] font-semibold text-[#14B8A6]">
              Handwriting Analysis
            </span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            {prescription.doctorName}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Prescription Date: <span className="font-mono tabular-nums">{prescription.prescriptionDate}</span> · Patient: {prescription.patientName}
          </p>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-center">
          <div className="px-3 py-1.5 rounded-lg bg-blue-50 border border-blue-100 text-xs font-semibold text-[#123B66]">
            Overall Clarity: <span className="font-mono tabular-nums">{prescription.overallClarityScore}%</span>
          </div>
          <LanguageSelector variant="segmented" />
        </div>
      </div>

      {/* Safety warning */}
      <div className="p-4 bg-amber-50/80 border border-amber-200 rounded-xl flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
        <div className="space-y-0.5 text-xs text-amber-950">
          <strong className="font-bold uppercase tracking-wider text-[11px]">Pharmacist Verification Policy:</strong>
          <p className="leading-relaxed">
            {t.verifyPharmacistBanner}
          </p>
        </div>
      </div>

      {/* Extracted medicines grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            Detected Medications ({prescription.medicines.length})
          </h3>
          <span className="text-xs text-slate-500">
            Never guessing unreadable notation
          </span>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {prescription.medicines.map((med: PrescriptionMedicine) => {
            const timingText = med.timing[language] || med.timing.en;
            const purposeText = med.clinicalPurpose[language] || med.clinicalPurpose.en;

            return (
              <div
                key={med.id}
                className={`p-5 rounded-xl border transition-all ${
                  med.verifyWithPharmacist
                    ? 'bg-amber-50/40 border-amber-300 shadow-xs'
                    : 'bg-white border-slate-200/90 hover:border-slate-300'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  {/* Medicine Name and Tags */}
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2 py-0.5 text-[11px] font-semibold bg-slate-100 text-slate-700 rounded">
                        {med.type}
                      </span>
                      <h4 className="text-base font-bold text-slate-900">
                        {med.name}
                      </h4>
                    </div>
                    <p className="text-xs text-slate-600">
                      <strong className="font-medium text-slate-800">Target Condition: </strong>
                      {purposeText}
                    </p>
                  </div>

                  {/* Confidence & Badges */}
                  <div className="flex sm:flex-col items-end gap-2 shrink-0">
                    <div
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold ${
                        med.confidenceScore >= 90
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : med.confidenceScore >= 70
                          ? 'bg-blue-50 text-blue-800 border border-blue-200'
                          : 'bg-amber-100 text-amber-900 border border-amber-300'
                      }`}
                    >
                      <Percent className="w-3 h-3" />
                      <span className="font-mono tabular-nums">{med.confidenceScore}%</span>
                      <span className="text-[10px] uppercase ml-0.5">Clarity</span>
                    </div>

                    {med.verifyWithPharmacist && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-amber-200/80 text-amber-950 border border-amber-300">
                        <AlertTriangle className="w-3 h-3 text-amber-900" />
                        Verify with pharmacist
                      </span>
                    )}
                  </div>
                </div>

                {/* Dosage & Timing Card */}
                <div className="mt-4 pt-4 border-t border-slate-100/80 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/60">
                    <div className="flex items-center gap-1.5 text-slate-500 font-medium mb-1">
                      <Pill className="w-3.5 h-3.5 text-[#2563EB]" />
                      <span>{t.dosageTiming}</span>
                    </div>
                    <p className="font-semibold text-slate-900">{med.frequency}</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Detected Dosage: <span className="font-mono">{med.detectedDosage}</span>
                    </p>
                  </div>

                  <div className="p-3 rounded-lg bg-blue-50/50 border border-blue-100">
                    <div className="flex items-center gap-1.5 text-[#123B66] font-medium mb-1">
                      <Clock className="w-3.5 h-3.5 text-[#2563EB]" />
                      <span>
                        {language === 'en'
                          ? 'Schedule & Patient Instructions'
                          : language === 'hi'
                          ? 'दवा लेने का समय एवं निर्देश'
                          : 'वेळ आणि सूचना'}
                      </span>
                    </div>
                    <p className="text-slate-800 leading-snug font-normal">
                      {timingText}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
