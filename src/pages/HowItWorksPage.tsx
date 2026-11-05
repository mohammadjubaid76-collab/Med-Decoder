/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { MedicalDisclaimer } from '../components/common/MedicalDisclaimer';
import {
  FileText,
  ScanLine,
  Languages,
  Stethoscope,
  ShieldCheck,
  CheckCircle2,
  Lock,
  ArrowRight,
} from 'lucide-react';

export const HowItWorksPage: React.FC = () => {
  const { t } = useApp();

  return (
    <div className="space-y-12 max-w-4xl mx-auto">
      {/* Header */}
      <div className="border-b border-slate-200 pb-5">
        <span className="text-xs font-bold uppercase tracking-wider text-[#2563EB]">
          Process & Architecture
        </span>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mt-1">
          How Med-Decoder Simplifies Medical Reports
        </h1>
        <p className="text-sm text-slate-600 mt-1 leading-relaxed">
          Learn how our clinical AI pipeline turns confusing pathology jargon into understandable Hindi, Marathi, and English terms with patient safety protocols.
        </p>
      </div>

      {/* 4 Pipeline Stages */}
      <div className="space-y-6">
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#2563EB] flex items-center justify-center shrink-0 font-bold">
            01
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-slate-900">
              High-Precision OCR & Document Layering
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              When you upload a photo or PDF, our optical engine segments laboratory header tables, identifying patient age, gender, test codes, and observed values without storing unnecessary metadata.
            </p>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-teal-50 text-[#14B8A6] flex items-center justify-center shrink-0 font-bold">
            02
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-slate-900">
              Standardized Normal Range Calibration
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Every pathology test is evaluated against Indian NABL & international clinical reference ranges. Tests are tagged as Normal, High, Low, or Borderline with accessible color indicators.
            </p>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 font-bold">
            03
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-slate-900">
              Vernacular Plain-Language Translation (हिंदी / मराठी / English)
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Instead of intimidating medical jargon like "Microcytic Hypochromic Anemia", users read "रक्तातील हिमोग्लोबिन कमी असल्यामुळे थकवा जाणवू शकतो". Language can be toggled in real time.
            </p>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0 font-bold">
            04
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-slate-900">
              Three Questions for Your Treating Physician
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Med-Decoder never attempts to self-treat. Instead, it formulates three targeted, medically grounded questions for the patient to ask their doctor at their next clinic visit.
            </p>
          </div>
        </div>
      </div>

      {/* Privacy & Safety Guarantee */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50/50 border border-blue-100 space-y-3">
        <div className="flex items-center gap-2 text-[#123B66]">
          <Lock className="w-4 h-4 text-[#2563EB]" />
          <h3 className="text-xs font-bold uppercase tracking-wider">
            Patient Data Privacy Model
          </h3>
        </div>
        <p className="text-xs text-slate-700 leading-relaxed">
          Your medical records remain your property. All document parsing operates with client-side isolation and ephemeral sessions. No personal health records are sold or used for ad profiling.
        </p>
      </div>

      {/* CTA */}
      <div className="text-center pt-2">
        <Link
          to="/upload"
          className="inline-flex items-center gap-2 px-6 py-3 text-xs font-semibold text-white bg-[#123B66] hover:bg-[#1a4a7d] rounded-xl shadow-xs"
        >
          <span>Try Med-Decoder on Your Lab Report</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <MedicalDisclaimer isDemo={true} />
    </div>
  );
};
