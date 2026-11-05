/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { TestStatus } from '../../types';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, ArrowUpRight, ArrowDownRight, AlertCircle } from 'lucide-react';

interface StatusBadgeProps {
  status: TestStatus;
  size?: 'sm' | 'md';
  showIcon?: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'sm', showIcon = true }) => {
  const { t } = useApp();

  const configs: Record<
    TestStatus,
    {
      label: string;
      bg: string;
      text: string;
      border: string;
      icon: React.ReactNode;
    }
  > = {
    normal: {
      label: t.statusNormal,
      bg: 'bg-emerald-50',
      text: 'text-emerald-800',
      border: 'border-emerald-200',
      icon: <CheckCircle2 className={size === 'sm' ? 'w-3.5 h-3.5 text-emerald-600' : 'w-4 h-4 text-emerald-600'} />,
    },
    high: {
      label: t.statusHigh,
      bg: 'bg-rose-50',
      text: 'text-rose-800',
      border: 'border-rose-200',
      icon: <ArrowUpRight className={size === 'sm' ? 'w-3.5 h-3.5 text-rose-600' : 'w-4 h-4 text-rose-600'} />,
    },
    low: {
      label: t.statusLow,
      bg: 'bg-amber-50',
      text: 'text-amber-800',
      border: 'border-amber-200',
      icon: <ArrowDownRight className={size === 'sm' ? 'w-3.5 h-3.5 text-amber-600' : 'w-4 h-4 text-amber-600'} />,
    },
    borderline: {
      label: t.statusBorderline,
      bg: 'bg-yellow-50',
      text: 'text-yellow-800',
      border: 'border-yellow-200',
      icon: <AlertCircle className={size === 'sm' ? 'w-3.5 h-3.5 text-yellow-600' : 'w-4 h-4 text-yellow-600'} />,
    },
  };

  const config = configs[status] || configs.normal;

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium border rounded-md ${
        size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs'
      } ${config.bg} ${config.text} ${config.border} whitespace-nowrap`}
    >
      {showIcon && config.icon}
      <span>{config.label}</span>
    </span>
  );
};
