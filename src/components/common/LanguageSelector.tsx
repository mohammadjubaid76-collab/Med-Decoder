/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useApp } from '../../context/AppContext';
import { Language } from '../../types';
import { Globe } from 'lucide-react';

interface LanguageSelectorProps {
  variant?: 'compact' | 'segmented';
  className?: string;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({ variant = 'segmented', className = '' }) => {
  const { language, setLanguage } = useApp();

  const options: { code: Language; label: string; native: string }[] = [
    { code: 'en', label: 'English', native: 'English' },
    { code: 'hi', label: 'Hindi', native: 'हिंदी' },
    { code: 'mr', label: 'Marathi', native: 'मराठी' },
  ];

  if (variant === 'compact') {
    return (
      <div className={`relative inline-flex items-center gap-1.5 ${className}`}>
        <Globe className="w-4 h-4 text-slate-500" />
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value as Language)}
          className="bg-transparent text-xs font-semibold text-slate-700 hover:text-slate-900 border-none outline-none cursor-pointer pr-2"
          aria-label="Select Language"
        >
          {options.map((opt) => (
            <option key={opt.code} value={opt.code} className="text-slate-900 bg-white">
              {opt.native} ({opt.label})
            </option>
          ))}
        </select>
      </div>
    );
  }

  return (
    <div
      role="group"
      aria-label="Language selection"
      className={`inline-flex items-center p-1 bg-slate-100 rounded-lg border border-slate-200/80 ${className}`}
    >
      {options.map((opt) => {
        const isActive = language === opt.code;
        return (
          <button
            key={opt.code}
            type="button"
            onClick={() => setLanguage(opt.code)}
            className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all whitespace-nowrap shrink-0 ${
              isActive
                ? 'bg-[#123B66] text-white shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <span>{opt.native}</span>
          </button>
        );
      })}
    </div>
  );
};
