/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { sampleReports } from '../data/sampleReports';
import { StatusBadge } from '../components/common/StatusBadge';
import { MedicalDisclaimer } from '../components/common/MedicalDisclaimer';
import {
  Shield,
  ArrowRight,
  FileText,
  FileSignature,
  Languages,
  Stethoscope,
  CheckCircle2,
  Sparkles,
  ArrowUpRight,
  Activity,
  HeartPulse,
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { t, language, setActiveReport } = useApp();
  const navigate = useNavigate();

  const handleQuickSample = (index: number) => {
    setActiveReport(sampleReports[index]);
    navigate(`/report/${sampleReports[index].id}`);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col selection:bg-blue-100 selection:text-[#123B66]">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-16 lg:pb-24 bg-gradient-to-b from-[#F0F7FD] via-white to-slate-50 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Headlines & Actions */}
            <div className="lg:col-span-7 space-y-6">
              {/* Hindi / Vernacular Subtitle Kicker */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-100/70 border border-blue-200/80 text-xs font-semibold text-[#123B66]">
                <HeartPulse className="w-3.5 h-3.5 text-[#2563EB]" />
                <span>{t.hindiTagline}</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.15] text-balance">
                {t.heroHeadline}
              </h1>

              {/* Description */}
              <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl">
                {t.heroDescription}
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
                <Link
                  to="/upload"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-semibold text-white bg-[#123B66] hover:bg-[#1a4a7d] active:bg-[#0e2c4d] rounded-xl shadow-sm hover:shadow transition-all group"
                >
                  <span>{t.decodeMyReport}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </Link>

                <a
                  href="#features"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-semibold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition-all"
                >
                  <span>{t.exploreFeatures}</span>
                </a>
              </div>

              {/* Quick Sample Selector */}
              <div className="pt-4 border-t border-slate-200/80">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2.5">
                  Try Sample Pathology Panels:
                </p>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => handleQuickSample(0)}
                    className="px-3 py-1.5 text-xs font-medium bg-white hover:bg-blue-50/80 border border-slate-200 hover:border-[#2563EB] text-slate-700 rounded-lg transition-all"
                  >
                    CBC (Complete Blood Count)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickSample(1)}
                    className="px-3 py-1.5 text-xs font-medium bg-white hover:bg-blue-50/80 border border-slate-200 hover:border-[#2563EB] text-slate-700 rounded-lg transition-all"
                  >
                    Lipid Profile (Cholesterol)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickSample(2)}
                    className="px-3 py-1.5 text-xs font-medium bg-white hover:bg-blue-50/80 border border-slate-200 hover:border-[#2563EB] text-slate-700 rounded-lg transition-all"
                  >
                    Diabetic Panel (HbA1c)
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column: Hero Visual Asset & Floating Preview Cards */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-2xl overflow-hidden border border-slate-200/90 shadow-xl bg-white group">
                <img
                  src="/src/assets/images/medical_hero_tech_1793444923078.jpg"
                  alt="Medical diagnostic report technology visualization"
                  referrerPolicy="no-referrer"
                  className="w-full h-80 sm:h-96 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-900/30 to-transparent flex flex-col justify-end p-6 text-white">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span className="text-xs font-semibold uppercase tracking-wider text-emerald-300">
                      Vernacular AI Translation
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-white">
                    Medical Reports in English, हिंदी, and मराठी
                  </h3>
                  <p className="text-xs text-slate-200 mt-1">
                    Complex parameters like Hb, TLC, LDL, and HbA1c explained with questions to ask your doctor.
                  </p>
                </div>
              </div>

              {/* Floating Mini Stat Card */}
              <div className="hidden sm:block absolute -bottom-6 -left-6 bg-white rounded-xl border border-slate-200 p-4 shadow-lg max-w-xs">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-teal-50 border border-teal-100 text-[#14B8A6] flex items-center justify-center shrink-0">
                    <Stethoscope className="w-5 h-5 text-[#14B8A6]" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-slate-900">Doctor-Prepared Questions</div>
                    <div className="text-[11px] text-slate-500">3 custom questions for every abnormal test</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Proof Strip */}
      <section className="py-8 bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center divide-y md:divide-y-0 md:divide-x divide-slate-100">
            <div className="p-2">
              <div className="text-2xl sm:text-3xl font-extrabold text-[#123B66] font-mono tabular-nums">
                12,500+
              </div>
              <p className="text-xs font-medium text-slate-500 mt-1">{t.statUploaded}</p>
            </div>
            <div className="p-2">
              <div className="text-2xl sm:text-3xl font-extrabold text-[#2563EB] font-mono tabular-nums">
                3 Languages
              </div>
              <p className="text-xs font-medium text-slate-500 mt-1">English · हिंदी · मराठी</p>
            </div>
            <div className="p-2">
              <div className="text-2xl sm:text-3xl font-extrabold text-[#14B8A6] font-mono tabular-nums">
                100% Free
              </div>
              <p className="text-xs font-medium text-slate-500 mt-1">Educational Health Literacy</p>
            </div>
            <div className="p-2">
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-800 font-mono tabular-nums">
                NABL
              </div>
              <p className="text-xs font-medium text-slate-500 mt-1">Calibrated Reference Ranges</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-16 sm:py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-[#2563EB]">
              Simplified In 3 Steps
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mt-1.5">
              How Med-Decoder Works
            </h2>
            <p className="text-sm text-slate-600 mt-2">
              From confusing pathology numbers to actionable understanding in your mother tongue.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs relative">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#2563EB] border border-blue-100 flex items-center justify-center font-bold text-sm mb-4">
                01
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">
                Upload Report or Prescription
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Take a photo or upload a PDF of your CBC, Lipid profile, LFT, KFT, or doctor prescription slip.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs relative">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100 flex items-center justify-center font-bold text-sm mb-4">
                02
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">
                Automated Clinical Normalization
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Our engine extracts parameters, checks normal reference intervals, and identifies abnormal values.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs relative">
              <div className="w-10 h-10 rounded-xl bg-teal-50 text-[#14B8A6] border border-teal-100 flex items-center justify-center font-bold text-sm mb-4">
                03
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">
                Understand in Hindi, Marathi & Ask Doctor
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Receive plain-language explanations and three specific questions to ask your doctor at your consultation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 sm:py-20 bg-white border-t border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-[#2563EB]">
              Core Capabilities
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mt-1.5">
              Built for Real Indian Healthcare Scenarios
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl border border-slate-200/90 bg-slate-50/50 hover:bg-white hover:border-[#2563EB] transition-all">
              <div className="w-10 h-10 rounded-xl bg-blue-100/60 text-[#2563EB] flex items-center justify-center mb-4">
                <FileText className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-slate-900 mb-1">Vernacular Lab Simplifier</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Breakdown of CBC, Liver, Kidney, and Diabetic tests into simple Hindi and Marathi terms.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-slate-200/90 bg-slate-50/50 hover:bg-white hover:border-[#2563EB] transition-all">
              <div className="w-10 h-10 rounded-xl bg-teal-100/60 text-[#14B8A6] flex items-center justify-center mb-4">
                <Stethoscope className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-slate-900 mb-1">Three Doctor Questions</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Pre-formulated intelligent questions tailored to your specific borderline or abnormal findings.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-slate-200/90 bg-slate-50/50 hover:bg-white hover:border-[#2563EB] transition-all">
              <div className="w-10 h-10 rounded-xl bg-amber-100/60 text-amber-700 flex items-center justify-center mb-4">
                <FileSignature className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-slate-900 mb-1">Prescription Decoder</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Transcribes doctor handwriting with safety checks and clear "Verify with pharmacist" callouts.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-slate-200/90 bg-slate-50/50 hover:bg-white hover:border-[#2563EB] transition-all">
              <div className="w-10 h-10 rounded-xl bg-indigo-100/60 text-indigo-700 flex items-center justify-center mb-4">
                <Languages className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-slate-900 mb-1">Instant Multilingual Switch</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Switch between English, हिंदी and मराठी at any time without re-uploading the file.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Prominent Safety & Educational Disclaimer */}
      <section className="py-12 bg-slate-50 border-t border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <MedicalDisclaimer isDemo={true} />
        </div>
      </section>
    </div>
  );
};
