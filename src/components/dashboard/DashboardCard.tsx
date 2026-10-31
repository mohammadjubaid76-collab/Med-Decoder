/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { LucideIcon } from 'lucide-react';

interface DashboardCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    text: string;
    positive?: boolean;
  };
  accentColor?: 'blue' | 'navy' | 'teal' | 'amber';
}

export const DashboardCard: React.FC<DashboardCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  accentColor = 'blue',
}) => {
  const accentClasses = {
    blue: 'text-[#2563EB] bg-blue-50 border-blue-100',
    navy: 'text-[#123B66] bg-slate-100 border-slate-200',
    teal: 'text-[#14B8A6] bg-teal-50 border-teal-100',
    amber: 'text-amber-600 bg-amber-50 border-amber-100',
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-xs hover:border-slate-300 transition-all">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">{title}</p>
          <h3 className="text-2xl font-bold text-slate-900 mt-1 tabular-nums tracking-tight">
            {value}
          </h3>
          {subtitle && <p className="text-xs text-slate-500 mt-1">{subtitle}</p>}
        </div>
        <div className={`p-2.5 rounded-lg border ${accentClasses[accentColor]}`}>
          <Icon className="w-5 h-5 shrink-0" />
        </div>
      </div>
      {trend && (
        <div className="mt-3 pt-3 border-t border-slate-100 flex items-center gap-1.5 text-xs text-slate-600">
          <span className={`font-semibold ${trend.positive ? 'text-emerald-600' : 'text-slate-600'}`}>
            {trend.text}
          </span>
          <span className="text-slate-400">· updated real-time</span>
        </div>
      )}
    </div>
  );
};
