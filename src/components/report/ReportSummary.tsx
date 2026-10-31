/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useApp } from '../../context/AppContext';
import { LabReport } from '../../types';
import { LanguageSelector } from '../common/LanguageSelector';
import { StatusBadge } from '../common/StatusBadge';
import { FileText, Calendar, Building2, User, Sparkles } from 'lucide-react';

interface ReportSummaryProps {
  report: LabReport;
}

export const ReportSummary: React.FC<ReportSummaryProps> = ({ report }) => {
  const { language, t } = useApp();

  const title = report.reportTitle[language] || report.reportTitle.en;
  const summaryText = report.summary[language] || report.summary.en;

  const statusMap = {
    'Normal': 'normal' as const,
    'Attention Needed': 'high' as const,
    'Critical Review': 'high' as const,
  };
  const badgeStatus = statusMap[report.status] || 'borderline';

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-6">
      {/* Top Bar with Language Selector and Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              {report.testCategory}
            </span>
            <span className="text-slate-300">·</span>
            <span className="text-[11px] font-semibold text-[#2563EB]">
              AI Simplification Engine
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            {title}
          </h2>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-center">
          <StatusBadge status={badgeStatus} size="md" />
          <LanguageSelector variant="segmented" />
        </div>
      </div>

      {/* Patient & Metadata details */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100 text-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-slate-500 font-medium">
            <User className="w-3.5 h-3.5" />
            <span>Patient</span>
          </div>
          <p className="font-semibold text-slate-900">{report.patientName}</p>
          <p className="text-[11px] text-slate-500">{report.patientAge} yrs · {report.patientGender}</p>
        </div>

        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-slate-500 font-medium">
            <Calendar className="w-3.5 h-3.5" />
            <span>Report Date</span>
          </div>
          <p className="font-semibold text-slate-900 font-mono tabular-nums">{report.reportDate}</p>
          <p className="text-[11px] text-slate-500">Collected: {report.collectionDate}</p>
        </div>

        <div className="space-y-1 sm:col-span-2">
          <div className="flex items-center gap-1.5 text-slate-500 font-medium">
            <Building2 className="w-3.5 h-3.5" />
            <span>Laboratory Facility</span>
          </div>
          <p className="font-semibold text-slate-900 truncate">{report.labName}</p>
          <p className="text-[11px] text-slate-500">NABL / ISO Calibrated Lab Standards</p>
        </div>
      </div>

      {/* Vernacular Summary Card */}
      <div className="p-5 rounded-xl bg-gradient-to-r from-blue-50/70 via-indigo-50/40 to-teal-50/50 border border-blue-100/80 space-y-2">
        <div className="flex items-center gap-2 text-[#123B66]">
          <Sparkles className="w-4 h-4 text-[#2563EB]" />
          <h3 className="text-xs font-bold uppercase tracking-wider">
            {t.reportSummary} ({language === 'en' ? 'English' : language === 'hi' ? 'हिंदी' : 'मराठी'})
          </h3>
        </div>
        <p className="text-sm text-slate-800 leading-relaxed font-normal">
          {summaryText}
        </p>
      </div>
    </div>
  );
};
