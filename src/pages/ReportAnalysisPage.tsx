/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { ReportSummary } from '../components/report/ReportSummary';
import { TestResultTable } from '../components/report/TestResultTable';
import { DoctorQuestions } from '../components/report/DoctorQuestions';
import { MedicalDisclaimer } from '../components/common/MedicalDisclaimer';
import {
  Printer,
  Download,
  ArrowLeft,
  Share2,
  FileText,
  AlertCircle,
} from 'lucide-react';

export const ReportAnalysisPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { reports, activeReport, setActiveReport, showToast, t } = useApp();

  const report = reports.find((r) => r.id === id) || activeReport || reports[0];

  useEffect(() => {
    if (report && activeReport?.id !== report.id) {
      setActiveReport(report);
    }
  }, [report]);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPdf = () => {
    showToast('Preparing formatted clinical PDF with vernacular summary...', 'info');
    setTimeout(() => {
      window.print();
    }, 400);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: 'Med-Decoder Lab Report Summary',
          text: `Check out my simplified ${report.testCategory} report on Med-Decoder.`,
          url: window.location.href,
        })
        .catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToast('Report URL copied to clipboard!', 'success');
    }
  };

  if (!report) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-lg mx-auto">
        <AlertCircle className="w-12 h-12 text-slate-400 mx-auto mb-3" />
        <h3 className="text-lg font-bold text-slate-900">Report Not Found</h3>
        <p className="text-xs text-slate-500 mt-1">
          The requested report could not be found or has been removed.
        </p>
        <Link
          to="/upload"
          className="mt-4 inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-[#123B66] rounded-lg"
        >
          Upload New Report
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto print:max-w-none print:p-0">
      {/* Top Utility Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 print:hidden">
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </Link>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg transition-colors shadow-2xs"
          >
            <Share2 className="w-3.5 h-3.5 text-slate-500" />
            <span>Share</span>
          </button>
          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg transition-colors shadow-2xs"
          >
            <Printer className="w-3.5 h-3.5 text-slate-500" />
            <span>Print Report</span>
          </button>
          <button
            type="button"
            onClick={handleDownloadPdf}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-[#123B66] hover:bg-[#1a4a7d] rounded-lg transition-all shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{t.downloadPdf}</span>
          </button>
        </div>
      </div>

      {/* A. Report Summary */}
      <ReportSummary report={report} />

      {/* B & C. Test Results Table with Simple Explanations & Reference Range */}
      <TestResultTable tests={report.tests} />

      {/* E. Three Questions to Ask Your Doctor */}
      <DoctorQuestions questions={report.doctorQuestions} />

      {/* Safety and Medical Disclaimer */}
      <MedicalDisclaimer isDemo={report.isDemo} />
    </div>
  );
};
