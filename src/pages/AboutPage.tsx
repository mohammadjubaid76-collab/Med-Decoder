/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useApp } from '../context/AppContext';
import { MedicalDisclaimer } from '../components/common/MedicalDisclaimer';
import {
  Shield,
  Heart,
  Globe2,
  Users2,
  CheckCircle2,
  Award,
  Sparkles,
} from 'lucide-react';

export const AboutPage: React.FC = () => {
  const { t } = useApp();

  return (
    <div className="space-y-10 max-w-4xl mx-auto">
      {/* Header */}
      <div className="border-b border-slate-200 pb-5">
        <span className="text-xs font-bold uppercase tracking-wider text-[#2563EB]">
          Health Literacy Mission
        </span>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mt-1">
          About Med-Decoder
        </h1>
        <p className="text-sm font-semibold text-[#123B66] mt-1">
          "अब मेडिकल रिपोर्ट पढ़ना होगा आसान!"
        </p>
        <p className="text-xs text-slate-600 mt-1 leading-relaxed">
          Democratizing health comprehension for millions of families across India through vernacular intelligence.
        </p>
      </div>

      {/* Mission Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#2563EB] flex items-center justify-center">
            <Globe2 className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900">The Vernacular Challenge</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            In India, over 80% of citizens speak and think in vernacular languages such as Hindi, Marathi, Bengali, and Tamil. Yet nearly 100% of diagnostic lab reports and hospital summaries are generated in dense technical English. This creates acute patient anxiety and communication barriers.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-teal-50 text-[#14B8A6] flex items-center justify-center">
            <Heart className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900">Our Clinical Philosophy</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Med-Decoder is not an autonomous diagnostic agent. It acts as an empathetic bridge. We provide accurate vernacular translations and generate three thoughtful questions for patients to ask their treating doctors, elevating the quality of clinical dialogue.
          </p>
        </div>
      </div>

      {/* Doctor Advisory Standards */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
          Clinical Safety Framework
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <strong className="font-semibold text-slate-800">Calibrated Reference Ranges:</strong>
              <p className="text-slate-600">Standardized against NABL laboratory guidelines for Indian adult and pediatric demographics.</p>
            </div>
          </div>
          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <strong className="font-semibold text-slate-800">Pharmacist Verification Flags:</strong>
              <p className="text-slate-600">Prescription OCR highlights cursive or ambiguous dosages with mandatory pharmacist verification notices.</p>
            </div>
          </div>
          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <strong className="font-semibold text-slate-800">Zero-Hallucination Guardrails:</strong>
              <p className="text-slate-600">Strictly bounds descriptions to verified lab ranges without fabricating speculative illnesses.</p>
            </div>
          </div>
          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <strong className="font-semibold text-slate-800">Full Vernacular Parity:</strong>
              <p className="text-slate-600">Equally rich clinical summaries across Hindi, Marathi, and English.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Safety Notice */}
      <MedicalDisclaimer isDemo={true} />
    </div>
  );
};
