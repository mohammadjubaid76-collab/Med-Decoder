/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useApp } from '../../context/AppContext';
import { ShieldAlert, Info } from 'lucide-react';

interface MedicalDisclaimerProps {
  isDemo?: boolean;
  compact?: boolean;
  className?: string;
}

export const MedicalDisclaimer: React.FC<MedicalDisclaimerProps> = ({
  isDemo = false,
  compact = false,
  className = '',
}) => {
  const { t } = useApp();

  if (compact) {
    return (
      <div
        className={`flex items-start gap-2 p-3 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-600 ${className}`}
      >
        <ShieldAlert className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong className="font-semibold text-slate-800">Notice: </strong>
          {t.disclaimerText}
        </p>
      </div>
    );
  }

  return (
    <div
      role="note"
      aria-label="Medical safety disclaimer"
      className={`p-4 bg-amber-50/70 border border-amber-200/80 rounded-xl space-y-2 ${className}`}
    >
      <div className="flex items-center gap-2 text-amber-900">
        <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0" />
        <h4 className="text-xs font-bold uppercase tracking-wider">{t.disclaimerTitle}</h4>
        {isDemo && (
          <span className="ml-auto inline-flex items-center gap-1 text-[11px] font-semibold text-amber-900 bg-amber-100 border border-amber-300 px-2 py-0.5 rounded">
            <Info className="w-3 h-3 text-amber-800" />
            {t.demoDataNotice}
          </span>
        )}
      </div>
      <p className="text-xs text-amber-950/90 leading-relaxed font-normal">
        {t.disclaimerText}
      </p>
    </div>
  );
};
