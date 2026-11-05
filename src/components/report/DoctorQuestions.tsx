/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { DoctorQuestion } from '../../types';
import { Stethoscope, Copy, Check, HelpCircle } from 'lucide-react';

interface DoctorQuestionsProps {
  questions: DoctorQuestion[];
}

export const DoctorQuestions: React.FC<DoctorQuestionsProps> = ({ questions }) => {
  const { language, t, showToast } = useApp();
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const textToCopy = questions
      .map((q, idx) => {
        const questionText = q.question[language] || q.question.en;
        return `${idx + 1}. ${questionText}`;
      })
      .join('\n\n');

    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    showToast(t.questionsCopied, 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-100 text-[#14B8A6] flex items-center justify-center shrink-0">
            <Stethoscope className="w-5 h-5 text-[#14B8A6]" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 tracking-tight">
              {t.doctorQuestionsTitle}
            </h3>
            <p className="text-xs text-slate-500">
              {t.doctorQuestionsSubtitle}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors self-start sm:self-center"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              <span>{t.questionsCopied}</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 text-slate-500" />
              <span>{t.copyQuestions}</span>
            </>
          )}
        </button>
      </div>

      <div className="space-y-3">
        {questions.map((q, index) => {
          const questionText = q.question[language] || q.question.en;
          const contextText = q.context[language] || q.context.en;

          return (
            <div
              key={q.id}
              className="p-4 rounded-xl bg-slate-50/70 border border-slate-200/80 hover:border-teal-200 transition-all space-y-2"
            >
              <div className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-[#123B66] text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                  {index + 1}
                </span>
                <div className="space-y-1">
                  <h4 className="text-sm font-semibold text-slate-900 leading-snug">
                    {questionText}
                  </h4>
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                    <HelpCircle className="w-3 h-3 text-slate-400 shrink-0" />
                    <span>{contextText}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
