/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { UploadBox } from '../components/report/UploadBox';
import { MedicalDisclaimer } from '../components/common/MedicalDisclaimer';
import { sampleReports } from '../data/sampleReports';
import { FileUp, Shield, HelpCircle, CheckCircle2 } from 'lucide-react';

export const UploadReportPage: React.FC = () => {
  const { t, setActiveReport, showToast } = useApp();
  const navigate = useNavigate();

  const handleDecodeComplete = (reportId: string) => {
    navigate(`/report/${reportId}`);
  };

  const handleQuickLoadSample = (reportIndex: number) => {
    const rep = sampleReports[reportIndex];
    setActiveReport(rep);
    showToast(`Loaded sample report: ${rep.testCategory}`, 'info');
    navigate(`/report/${rep.id}`);
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Page Header */}
      <div className="border-b border-slate-200 pb-5">
        <div className="flex items-center gap-2 text-xs font-semibold text-[#2563EB] uppercase tracking-wider mb-1">
          <FileUp className="w-4 h-4" />
          <span>Vernacular Medical Engine</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
          {t.navUpload}
        </h1>
        <p className="text-sm text-slate-600 mt-1 leading-relaxed">
          Upload your blood test, CBC, LFT, KFT, lipid panel, or other laboratory report to decode complex terms into plain Hindi, Marathi, or English.
        </p>
      </div>

      {/* Upload Component */}
      <UploadBox onDecodeComplete={handleDecodeComplete} />

      {/* Quick Demo Preloads */}
      <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-6 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              No medical report on hand? Try instant demo reports:
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Simulated clinical results with authentic reference ranges and doctor questions.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          <button
            type="button"
            onClick={() => handleQuickLoadSample(0)}
            className="p-3 text-left bg-white hover:bg-blue-50/70 border border-slate-200 hover:border-[#2563EB] rounded-xl text-xs transition-all shadow-2xs"
          >
            <div className="font-bold text-slate-900">CBC Blood Count</div>
            <div className="text-[11px] text-slate-500 mt-0.5">Mild Anemia & Low Hemoglobin</div>
            <div className="text-[11px] text-[#2563EB] font-semibold mt-2">Open Demo Analysis →</div>
          </button>

          <button
            type="button"
            onClick={() => handleQuickLoadSample(1)}
            className="p-3 text-left bg-white hover:bg-blue-50/70 border border-slate-200 hover:border-[#2563EB] rounded-xl text-xs transition-all shadow-2xs"
          >
            <div className="font-bold text-slate-900">Lipid Profile</div>
            <div className="text-[11px] text-slate-500 mt-0.5">Elevated Cholesterol & Triglycerides</div>
            <div className="text-[11px] text-[#2563EB] font-semibold mt-2">Open Demo Analysis →</div>
          </button>

          <button
            type="button"
            onClick={() => handleQuickLoadSample(2)}
            className="p-3 text-left bg-white hover:bg-blue-50/70 border border-slate-200 hover:border-[#2563EB] rounded-xl text-xs transition-all shadow-2xs"
          >
            <div className="font-bold text-slate-900">Diabetic Panel (HbA1c)</div>
            <div className="text-[11px] text-slate-500 mt-0.5">HbA1c 7.8% & Fasting Sugar 148 mg/dL</div>
            <div className="text-[11px] text-[#2563EB] font-semibold mt-2">Open Demo Analysis →</div>
          </button>
        </div>
      </div>

      {/* Safety Notice */}
      <MedicalDisclaimer isDemo={true} />
    </div>
  );
};
