/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { DashboardCard } from '../components/dashboard/DashboardCard';
import { RecentReportsTable } from '../components/dashboard/RecentReportsTable';
import { MedicalDisclaimer } from '../components/common/MedicalDisclaimer';
import {
  FileText,
  FileCheck2,
  FileSignature,
  UploadCloud,
  ArrowRight,
  ShieldAlert,
  Sparkles,
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { t, reports, prescriptions } = useApp();
  const navigate = useNavigate();

  const totalUploaded = reports.length + 8; // Including historical batch
  const totalDecoded = reports.length + 8;
  const totalPrescriptions = prescriptions.length + 3;

  return (
    <div className="space-y-8">
      {/* Dashboard Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Welcome to Med-Decoder
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Vernacular health literacy engine · Now supporting English, हिंदी, and मराठी
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/upload"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold text-white bg-[#123B66] hover:bg-[#1a4a7d] shadow-xs transition-all"
          >
            <UploadCloud className="w-4 h-4" />
            <span>Upload New Report</span>
          </Link>
          <Link
            to="/prescription"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 shadow-xs transition-all"
          >
            <FileSignature className="w-4 h-4 text-[#14B8A6]" />
            <span>Scan Prescription</span>
          </Link>
        </div>
      </div>

      {/* Statistic Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <DashboardCard
          title={t.statUploaded}
          value={totalUploaded}
          subtitle="Pathology & blood panels"
          icon={FileText}
          accentColor="navy"
          trend={{ text: '+2 this week', positive: true }}
        />
        <DashboardCard
          title={t.statDecoded}
          value={totalDecoded}
          subtitle="Simplified into vernacular"
          icon={FileCheck2}
          accentColor="blue"
          trend={{ text: '100% processed', positive: true }}
        />
        <DashboardCard
          title={t.statPrescriptions}
          value={totalPrescriptions}
          subtitle="Handwriting scanned"
          icon={FileSignature}
          accentColor="teal"
          trend={{ text: 'Pharmacist-verified', positive: true }}
        />
      </div>

      {/* Quick Access Action Banners */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50/40 border border-blue-100 flex flex-col justify-between space-y-4">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#2563EB]">
              Lab Analysis
            </span>
            <h3 className="text-lg font-bold text-slate-900 mt-1">
              Have a recent Blood Test or CBC Report?
            </h3>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              Upload your PDF or scan to receive immediate normal vs abnormal parameter tags and 3 tailored questions for your doctor.
            </p>
          </div>
          <div>
            <Link
              to="/upload"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#123B66] hover:text-[#2563EB] group"
            >
              <span>Go to Report Upload</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-gradient-to-br from-teal-50 to-emerald-50/40 border border-teal-100 flex flex-col justify-between space-y-4">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#14B8A6]">
              Prescription Handwriting
            </span>
            <h3 className="text-lg font-bold text-slate-900 mt-1">
              Struggling to read a doctor's handwriting?
            </h3>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              Scan your prescription slip to transcribe medicines, timing schedules, and flag any cursive notations for pharmacist review.
            </p>
          </div>
          <div>
            <Link
              to="/prescription"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#123B66] hover:text-[#14B8A6] group"
            >
              <span>Launch Prescription Decoder</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Reports Table */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 tracking-tight">Recent Reports</h2>
            <p className="text-xs text-slate-500">Click any report to view comprehensive vernacular breakdown</p>
          </div>
          <Link
            to="/reports"
            className="text-xs font-semibold text-[#2563EB] hover:underline"
          >
            View All Reports ({reports.length})
          </Link>
        </div>

        <RecentReportsTable reports={reports} limit={5} />
      </div>

      {/* Safety Disclaimer */}
      <MedicalDisclaimer isDemo={true} />
    </div>
  );
};
