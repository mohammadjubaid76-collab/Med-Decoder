/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { TestResultItem, TestStatus } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { Info, Sparkles, Filter, ChevronDown, ChevronUp } from 'lucide-react';

interface TestResultTableProps {
  tests: TestResultItem[];
}

export const TestResultTable: React.FC<TestResultTableProps> = ({ tests }) => {
  const { language, t } = useApp();
  const [filter, setFilter] = useState<'all' | 'attention' | 'normal'>('all');
  const [expandedId, setExpandedId] = useState<string | null>(tests[0]?.id || null);

  const filteredTests = tests.filter((test) => {
    if (filter === 'attention') return test.status !== 'normal';
    if (filter === 'normal') return test.status === 'normal';
    return true;
  });

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  /**
   * Helper to compute percentage position on range bar
   */
  const getRangePercentage = (val: number | string, min?: number, max?: number) => {
    const num = typeof val === 'number' ? val : parseFloat(val);
    if (isNaN(num)) return 50;

    const lower = min !== undefined ? min : 0;
    const upper = max !== undefined ? max : lower * 2 || 100;
    const spread = upper - lower;
    if (spread <= 0) return 50;

    // Expand view by 25% on both ends to show out of bounds
    const extendedMin = lower - spread * 0.25;
    const extendedMax = upper + spread * 0.25;
    const totalRange = extendedMax - extendedMin;

    const percent = ((num - extendedMin) / totalRange) * 100;
    return Math.max(5, Math.min(95, percent));
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs space-y-4">
      {/* Header & Filter Controls */}
      <div className="px-6 pt-5 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100">
        <div>
          <h3 className="text-base font-bold text-slate-900 tracking-tight">
            {t.testResults}
          </h3>
          <p className="text-xs text-slate-500">
            {t.explanationCol} – click any parameter for expanded clinical meaning.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="inline-flex items-center p-1 bg-slate-100 rounded-lg self-start sm:self-center">
          <button
            type="button"
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all whitespace-nowrap ${
              filter === 'all'
                ? 'bg-white text-slate-900 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Tests ({tests.length})
          </button>
          <button
            type="button"
            onClick={() => setFilter('attention')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all whitespace-nowrap ${
              filter === 'attention'
                ? 'bg-white text-rose-700 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Attention Needed ({tests.filter((t) => t.status !== 'normal').length})
          </button>
          <button
            type="button"
            onClick={() => setFilter('normal')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all whitespace-nowrap ${
              filter === 'normal'
                ? 'bg-white text-emerald-700 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Normal ({tests.filter((t) => t.status === 'normal').length})
          </button>
        </div>
      </div>

      {/* Main Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-slate-600 uppercase font-semibold tracking-wider border-b border-slate-200">
            <tr>
              <th scope="col" className="px-6 py-3.5">Test Parameter</th>
              <th scope="col" className="px-6 py-3.5">Your Value</th>
              <th scope="col" className="px-6 py-3.5">Normal Reference Range</th>
              <th scope="col" className="px-6 py-3.5">Status</th>
              <th scope="col" className="px-6 py-3.5 text-right">Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredTests.map((test) => {
              const testTitle = test.name[language] || test.name.en;
              const explanation = test.vernacularExplanation[language] || test.vernacularExplanation.en;
              const lifestyle = test.lifestyleTip ? test.lifestyleTip[language] || test.lifestyleTip.en : null;
              const isExpanded = expandedId === test.id;
              const percent = getRangePercentage(test.value, test.referenceRange.min, test.referenceRange.max);

              return (
                <React.Fragment key={test.id}>
                  <tr
                    onClick={() => toggleExpand(test.id)}
                    className="hover:bg-blue-50/40 cursor-pointer transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="font-semibold text-slate-900 text-sm">{testTitle}</div>
                      <div className="text-[11px] text-slate-500">{test.category}</div>
                    </td>

                    <td className="px-6 py-4 font-mono tabular-nums">
                      <span className="text-sm font-bold text-slate-900">{test.value}</span>{' '}
                      <span className="text-slate-500 font-sans">{test.unit}</span>
                    </td>

                    <td className="px-6 py-4 font-mono tabular-nums text-slate-600">
                      {test.referenceRange.display}
                    </td>

                    <td className="px-6 py-4">
                      <StatusBadge status={test.status} size="sm" />
                    </td>

                    <td className="px-6 py-4 text-right">
                      <button
                        type="button"
                        aria-label="Toggle explanation row"
                        className="p-1 text-slate-400 hover:text-slate-600 transition-colors"
                      >
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                    </td>
                  </tr>

                  {/* Expanded Vernacular Explanation Row */}
                  {isExpanded && (
                    <tr className="bg-slate-50/70 border-b border-slate-200">
                      <td colSpan={5} className="px-6 py-4">
                        <div className="space-y-3">
                          {/* Visual Reference Spectrum Bar */}
                          <div className="p-3 bg-white rounded-lg border border-slate-200/80">
                            <div className="flex justify-between text-[11px] font-medium text-slate-500 mb-1">
                              <span>Low</span>
                              <span className="text-emerald-700 font-semibold">Standard Safe Zone</span>
                              <span>High</span>
                            </div>
                            <div className="relative w-full h-3 bg-slate-100 rounded-full overflow-hidden flex">
                              <div className="w-1/4 bg-amber-100 border-r border-white/60" />
                              <div className="w-1/2 bg-emerald-100 border-r border-white/60" />
                              <div className="w-1/4 bg-rose-100" />
                            </div>
                            {/* Pin Indicator */}
                            <div className="relative w-full h-4 mt-1">
                              <div
                                className="absolute -top-1 -translate-x-1/2 flex flex-col items-center"
                                style={{ left: `${percent}%` }}
                              >
                                <div className="w-2.5 h-2.5 bg-[#123B66] rotate-45 rounded-xs" />
                                <span className="text-[10px] font-mono font-bold text-[#123B66] mt-0.5 tabular-nums">
                                  You: {test.value} {test.unit}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Vernacular Explanation Callout */}
                          <div className="p-3.5 bg-blue-50/70 border border-blue-200/80 rounded-lg">
                            <div className="flex items-center gap-1.5 text-[#123B66] font-semibold text-xs mb-1">
                              <Sparkles className="w-3.5 h-3.5 text-[#2563EB]" />
                              <span>
                                {language === 'en'
                                  ? 'Simple Explanation'
                                  : language === 'hi'
                                  ? 'सरल भाषा में अर्थ'
                                  : 'याचा सोपा अर्थ'}
                              </span>
                            </div>
                            <p className="text-xs text-slate-700 leading-relaxed font-normal">
                              {explanation}
                            </p>
                            {lifestyle && (
                              <div className="mt-2 pt-2 border-t border-blue-100 text-[11px] text-slate-600">
                                <strong className="font-semibold text-slate-800">
                                  {language === 'en' ? 'Dietary / Care Note: ' : language === 'hi' ? 'आहार व देखरेख सुझाव: ' : 'आहार व काळजी सूचना: '}
                                </strong>
                                {lifestyle}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
