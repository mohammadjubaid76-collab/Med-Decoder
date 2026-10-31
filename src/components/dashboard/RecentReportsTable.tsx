/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { LabReport } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { FileText, ArrowRight, Calendar, User } from 'lucide-react';

interface RecentReportsTableProps {
  reports: LabReport[];
  limit?: number;
}

export const RecentReportsTable: React.FC<RecentReportsTableProps> = ({ reports, limit = 5 }) => {
  const { language, setActiveReport } = useApp();
  const navigate = useNavigate();

  const displayedReports = limit ? reports.slice(0, limit) : reports;

  const handleOpenReport = (report: LabReport) => {
    setActiveReport(report);
    navigate(`/report/${report.id}`);
  };

  if (displayedReports.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-8 text-center">
        <FileText className="w-10 h-10 text-slate-300 mx-auto mb-3" />
        <p className="text-sm font-medium text-slate-700">No reports uploaded yet</p>
        <p className="text-xs text-slate-500 mt-1">
          Upload a lab report or prescription to start vernacular analysis.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 overflow-hidden shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider">
            <tr>
              <th scope="col" className="px-5 py-3.5">Report & Test Category</th>
              <th scope="col" className="px-5 py-3.5">Patient Details</th>
              <th scope="col" className="px-5 py-3.5">Date</th>
              <th scope="col" className="px-5 py-3.5">Overall Status</th>
              <th scope="col" className="px-5 py-3.5 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {displayedReports.map((report) => {
              const localizedTitle = report.reportTitle[language] || report.reportTitle.en;
              const statusMap = {
                'Normal': 'normal' as const,
                'Attention Needed': 'high' as const,
                'Critical Review': 'high' as const,
              };
              const mappedStatus = statusMap[report.status] || 'borderline';

              return (
                <tr
                  key={report.id}
                  className="hover:bg-slate-50/70 transition-colors group cursor-pointer"
                  onClick={() => handleOpenReport(report)}
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#2563EB] flex items-center justify-center shrink-0 border border-blue-100">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900 group-hover:text-[#2563EB] transition-colors">
                          {localizedTitle}
                        </div>
                        <div className="text-[11px] text-slate-500 flex items-center gap-1.5 mt-0.5">
                          <span>{report.testCategory}</span>
                          <span>·</span>
                          <span>{report.labName}</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1.5 text-slate-800 font-medium">
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      <span>{report.patientName}</span>
                    </div>
                    <div className="text-[11px] text-slate-500">
                      {report.patientAge}y · {report.patientGender}
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1.5 text-slate-600 font-mono tabular-nums">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>{report.reportDate}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <StatusBadge status={mappedStatus} size="sm" />
                  </td>
                  <td className="px-5 py-4 text-right">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenReport(report);
                      }}
                      className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-[#123B66] hover:text-white bg-blue-50 hover:bg-[#123B66] rounded-md transition-colors whitespace-nowrap"
                    >
                      <span>View Analysis</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
