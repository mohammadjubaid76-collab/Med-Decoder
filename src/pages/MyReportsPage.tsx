/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { LabReport } from '../types';
import { StatusBadge } from '../components/common/StatusBadge';
import { MedicalDisclaimer } from '../components/common/MedicalDisclaimer';
import {
  FileText,
  Search,
  Filter,
  Trash2,
  ArrowRight,
  UploadCloud,
  Calendar,
  User,
} from 'lucide-react';

export const MyReportsPage: React.FC = () => {
  const { reports, language, setActiveReport, deleteReport, t } = useApp();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const filteredReports = reports.filter((report) => {
    const title = (report.reportTitle[language] || report.reportTitle.en).toLowerCase();
    const patient = report.patientName.toLowerCase();
    const query = searchQuery.toLowerCase();
    const matchesSearch = title.includes(query) || patient.includes(query) || report.testCategory.toLowerCase().includes(query);
    const matchesCategory = categoryFilter === 'all' || report.testCategory === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleOpenReport = (report: LabReport) => {
    setActiveReport(report);
    navigate(`/report/${report.id}`);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            {t.navMyReports}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Access and review your previously simplified lab tests and health histories.
          </p>
        </div>

        <Link
          to="/upload"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold text-white bg-[#123B66] hover:bg-[#1a4a7d] shadow-xs transition-all"
        >
          <UploadCloud className="w-4 h-4" />
          <span>Upload Another Report</span>
        </Link>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by test name, patient, or lab..."
            className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-[#2563EB]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="text-xs font-medium border border-slate-200 rounded-lg px-3 py-2 bg-white text-slate-700 outline-none focus:border-[#2563EB]"
          >
            <option value="all">All Categories</option>
            <option value="CBC">Complete Blood Count (CBC)</option>
            <option value="Lipid Profile">Lipid Profile</option>
            <option value="Diabetic Panel (HbA1c)">Diabetic Panel (HbA1c)</option>
          </select>
        </div>
      </div>

      {/* Reports List */}
      <div className="space-y-4">
        {filteredReports.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
            <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-slate-800">No matching reports</h3>
            <p className="text-xs text-slate-500 mt-1">
              Try adjusting your search query or upload a new medical report.
            </p>
          </div>
        ) : (
          filteredReports.map((report) => {
            const localizedTitle = report.reportTitle[language] || report.reportTitle.en;
            const summary = report.summary[language] || report.summary.en;
            const statusMap = {
              'Normal': 'normal' as const,
              'Attention Needed': 'high' as const,
              'Critical Review': 'high' as const,
            };
            const mappedStatus = statusMap[report.status] || 'borderline';

            return (
              <div
                key={report.id}
                className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs hover:border-slate-300 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="space-y-1.5 min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <StatusBadge status={mappedStatus} size="sm" />
                    <span className="text-xs font-semibold text-[#2563EB]">
                      {report.testCategory}
                    </span>
                    <span className="text-slate-300">·</span>
                    <span className="text-xs text-slate-500 font-mono tabular-nums">
                      {report.reportDate}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 hover:text-[#2563EB] cursor-pointer transition-colors"
                    onClick={() => handleOpenReport(report)}
                  >
                    {localizedTitle}
                  </h3>

                  <p className="text-xs text-slate-600 line-clamp-2 max-w-3xl">
                    {summary}
                  </p>

                  <div className="flex items-center gap-3 text-[11px] text-slate-500 pt-1">
                    <span className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      {report.patientName} ({report.patientAge}y)
                    </span>
                    <span>·</span>
                    <span>{report.labName}</span>
                    <span>·</span>
                    <span className="text-teal-700 font-medium">
                      {report.doctorQuestions.length} Doctor Questions Generated
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                  <button
                    type="button"
                    onClick={() => handleOpenReport(report)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-[#123B66] bg-blue-50 hover:bg-[#123B66] hover:text-white rounded-lg transition-colors"
                  >
                    <span>View Analysis</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteReport(report.id)}
                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                    title="Delete report"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Safety Notice */}
      <MedicalDisclaimer isDemo={true} />
    </div>
  );
};
