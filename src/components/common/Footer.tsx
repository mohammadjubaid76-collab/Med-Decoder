/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Shield } from 'lucide-react';

export const Footer: React.FC = () => {
  const { t } = useApp();

  return (
    <footer className="bg-slate-900 text-slate-400 text-xs border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand info */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-md bg-[#2563EB] flex items-center justify-center text-white">
                <Shield className="w-4 h-4 fill-white/20 stroke-white" />
              </div>
              <span className="text-base font-bold text-white tracking-tight">
                Med-Decoder
              </span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              अब मेडिकल रिपोर्ट पढ़ना होगा आसान!
            </p>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Democratizing health laboratory literacy across India through vernacular AI explanation.
            </p>
          </div>

          {/* Quick Navigation */}
          <div>
            <h4 className="text-slate-200 font-semibold mb-3 text-xs uppercase tracking-wider">Platform</h4>
            <ul className="space-y-2">
              <li><Link to="/upload" className="hover:text-white transition-colors">{t.navUpload}</Link></li>
              <li><Link to="/prescription" className="hover:text-white transition-colors">{t.navPrescription}</Link></li>
              <li><Link to="/dashboard" className="hover:text-white transition-colors">{t.navDashboard}</Link></li>
              <li><Link to="/reports" className="hover:text-white transition-colors">{t.navMyReports}</Link></li>
            </ul>
          </div>

          {/* Supported Diagnostics */}
          <div>
            <h4 className="text-slate-200 font-semibold mb-3 text-xs uppercase tracking-wider">Test Decoders</h4>
            <ul className="space-y-2">
              <li>Complete Blood Count (CBC)</li>
              <li>Lipid & Cholesterol Profile</li>
              <li>Liver Function Tests (LFT)</li>
              <li>Kidney Function Tests (KFT)</li>
              <li>HbA1c & Fasting Glucose</li>
            </ul>
          </div>

          {/* Compliance & Safety */}
          <div>
            <h4 className="text-slate-200 font-semibold mb-3 text-xs uppercase tracking-wider">Safety & Privacy</h4>
            <p className="text-[11px] leading-relaxed text-slate-400 mb-2">
              Educational health literacy tool only. Does not replace professional clinical diagnosis.
            </p>
            <div className="text-[11px] text-slate-500">
              HIPAA-aligned client encryption design.
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <p>© {new Date().getFullYear()} Med-Decoder. All rights reserved. For national health literacy initiative.</p>
          <div className="flex items-center gap-4">
            <Link to="/help" className="hover:text-slate-300">Privacy Policy</Link>
            <span>·</span>
            <Link to="/help" className="hover:text-slate-300">Terms of Use</Link>
            <span>·</span>
            <Link to="/about" className="hover:text-slate-300">Doctor Advisory Panel</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
