/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Outlet, useLocation, Link } from 'react-router-dom';
import { Sidebar } from '../components/common/Sidebar';
import { ToastContainer } from '../components/common/Toast';
import { LanguageSelector } from '../components/common/LanguageSelector';
import { useApp } from '../context/AppContext';
import { Menu, Bell, Shield, ArrowUpRight, UploadCloud } from 'lucide-react';

import { AiAssistantModal } from '../components/assistant/AiAssistantModal';

export const DashboardLayout: React.FC = () => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const location = useLocation();
  const { t } = useApp();

  const getBreadcrumbTitle = () => {
    switch (location.pathname) {
      case '/dashboard':
        return t.navDashboard;
      case '/upload':
        return t.navUpload;
      case '/prescription':
        return t.navPrescription;
      case '/reports':
        return t.navMyReports;
      case '/settings':
        return t.navSettings;
      case '/help':
        return t.navHelp;
      default:
        if (location.pathname.startsWith('/report/')) return 'Report Analysis';
        return 'Med-Decoder';
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 overflow-hidden font-sans">
      {/* Sidebar */}
      <Sidebar
        mobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header Bar following Top Bar Contract for Dashboards */}
        <header className="h-16 bg-white border-b border-slate-200/80 px-4 sm:px-8 flex items-center justify-between gap-4 shrink-0 z-20">
          <div className="flex items-center gap-3 min-w-0">
            {/* Mobile Sidebar Hamburger */}
            <button
              type="button"
              onClick={() => setMobileSidebarOpen(true)}
              className="lg:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg"
              aria-label="Open sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Breadcrumb Trail */}
            <div className="flex items-center gap-2 text-xs text-slate-500 truncate font-medium">
              <Link to="/dashboard" className="hover:text-slate-900 transition-colors">
                Med-Decoder
              </Link>
              <span>/</span>
              <span className="text-slate-900 font-semibold truncate">
                {getBreadcrumbTitle()}
              </span>
            </div>
          </div>

          {/* Right Header Zone: Actions & Language */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="hidden sm:block">
              <LanguageSelector variant="segmented" />
            </div>

            <Link
              to="/upload"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-[#123B66] hover:bg-[#1a4a7d] rounded-lg shadow-2xs whitespace-nowrap"
            >
              <UploadCloud className="w-3.5 h-3.5" />
              <span>Upload</span>
            </Link>

            <Link
              to="/profile"
              className="text-xs font-semibold text-slate-700 hover:text-[#123B66] bg-slate-100 hover:bg-slate-200 px-2.5 py-1.5 rounded-lg transition-colors whitespace-nowrap"
            >
              Profile
            </Link>

            <Link
              to="/"
              className="text-xs font-medium text-slate-500 hover:text-slate-900 px-2 py-1 transition-colors"
            >
              Public Site
            </Link>
          </div>
        </header>

        {/* Scrollable Main Viewport */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-8">
          <Outlet />
        </main>
      </div>

      <ToastContainer />
      <AiAssistantModal />
    </div>
  );
};
