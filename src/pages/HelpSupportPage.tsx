/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { MedicalDisclaimer } from '../components/common/MedicalDisclaimer';
import {
  HelpCircle,
  PhoneCall,
  Mail,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  Send,
  CheckCircle2,
} from 'lucide-react';

export const HelpSupportPage: React.FC = () => {
  const { t, showToast } = useApp();
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [inquiryName, setInquiryName] = useState('');
  const [inquiryMsg, setInquiryMsg] = useState('');
  const [sent, setSent] = useState(false);

  const faqs = [
    {
      q: 'How does Med-Decoder determine what is "Normal" vs "High"?',
      a: 'We calibrate against standardized Indian clinical pathology reference ranges (e.g. NABL & ICMR standards). However, biological reference intervals can vary slightly between diagnostic laboratories based on machines and reagents used.',
    },
    {
      q: 'Does Med-Decoder replace my doctor\'s diagnosis?',
      a: 'No, absolutely not. Med-Decoder is strictly an educational health-literacy tool designed to help you and your family understand laboratory terms. Always consult a qualified medical professional for treatment.',
    },
    {
      q: 'Why does the prescription decoder say "Verify with pharmacist"?',
      a: 'Physicians often use cursive shorthand. In order to uphold absolute clinical safety, our model never guesses unreadable handwriting or ambiguous dosages. When clarity is below safe confidence thresholds, we mandate pharmacist cross-checking.',
    },
    {
      q: 'Are my uploaded blood reports and prescriptions kept private?',
      a: 'Yes. Med-Decoder uses client-side ephemeral processing. Your health records are never sold or shared with third parties.',
    },
    {
      q: 'Which medical tests are currently supported?',
      a: 'Complete Blood Count (CBC), Comprehensive Lipid Profile, Liver Function Tests (LFT), Kidney Function Tests (KFT), Fasting Blood Sugar, HbA1c, and general OPD prescription handwriting.',
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inquiryMsg.trim()) return;
    setSent(true);
    showToast('Your inquiry has been sent to our support desk!', 'success');
    setInquiryMsg('');
    setTimeout(() => setSent(false), 3000);
  };

  return (
    <div className="space-y-10 max-w-4xl mx-auto">
      {/* Header */}
      <div className="border-b border-slate-200 pb-5">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
          {t.navHelp}
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Frequently asked questions, pathology guidance, and support assistance.
        </p>
      </div>

      {/* Emergency Alert Banner */}
      <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-950 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-rose-700 shrink-0 mt-0.5" />
        <div>
          <strong className="font-bold uppercase tracking-wider text-[11px]">Emergency Notice:</strong>
          <p className="mt-0.5 leading-relaxed">
            If you or a family member are experiencing chest pain, severe shortness of breath, acute fainting, or bleeding, please call your local emergency service (e.g., <strong>112</strong> or <strong>108</strong> in India) or visit the nearest hospital emergency room immediately.
          </p>
        </div>
      </div>

      {/* FAQs */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
          Frequently Asked Questions
        </h3>
        <div className="divide-y divide-slate-100">
          {faqs.map((faq, index) => {
            const isOpen = openFaqIndex === index;
            return (
              <div key={index} className="py-3.5">
                <button
                  type="button"
                  onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                  className="w-full flex items-center justify-between text-left gap-4 text-xs font-bold text-slate-900 hover:text-[#2563EB] transition-colors"
                >
                  <span>{faq.q}</span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                  )}
                </button>
                {isOpen && (
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed animate-in fade-in duration-200">
                    {faq.a}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Contact Form */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
          Contact Med-Decoder Health Literacy Team
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Your Name
            </label>
            <input
              type="text"
              value={inquiryName}
              onChange={(e) => setInquiryName(e.target.value)}
              placeholder="e.g. Ramesh Patel"
              className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-[#2563EB]"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Question or Report Issue
            </label>
            <textarea
              rows={3}
              value={inquiryMsg}
              onChange={(e) => setInquiryMsg(e.target.value)}
              placeholder="Ask about a test parameter or give feedback..."
              className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-[#2563EB]"
              required
            />
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-[#123B66] hover:bg-[#1a4a7d] rounded-lg shadow-xs"
            >
              {sent ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Message Sent</span>
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Message</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      <MedicalDisclaimer isDemo={true} />
    </div>
  );
};
