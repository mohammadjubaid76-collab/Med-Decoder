/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { LanguageSelector } from './LanguageSelector';
import {
  LayoutDashboard,
  FileUp,
  FileSignature,
  FileText,
  Settings,
  HelpCircle,
  Shield,
  HeartPulse,
  User,
} from 'lucide-react';

interface SidebarProps {
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ mobileOpen = false, onCloseMobile }) => {
  const { t, currentUser, signInWithGoogle, signOut } = useApp();

  const navigationItems = [
    { name: t.navDashboard, to: '/dashboard', icon: LayoutDashboard },
    { name: t.navUpload, to: '/upload', icon: FileUp },
    { name: t.navPrescription, to: '/prescription', icon: FileSignature },
    { name: t.navMyReports, to: '/reports', icon: FileText },
    { name: 'Patient Profile', to: '/profile', icon: User },
    { name: t.navSettings, to: '/settings', icon: Settings },
    { name: t.navHelp, to: '/help', icon: HelpCircle },
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full bg-white border-r border-slate-200">
      {/* Brand Header */}
      <div className="flex items-center justify-between px-6 h-16 border-b border-slate-200/80">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#123B66] flex items-center justify-center text-white shadow-xs">
            <Shield className="w-4 h-4 fill-white/20 stroke-white" />
          </div>
          <div>
            <span className="text-base font-bold tracking-tight text-[#123B66]">
              Med<span className="text-[#2563EB]">-Decoder</span>
            </span>
          </div>
        </Link>
      </div>

      {/* Language Switcher in Sidebar */}
      <div className="px-5 py-3 border-b border-slate-100 bg-slate-50/50">
        <div className="flex flex-col gap-1.5">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Language / भाषा
          </span>
          <LanguageSelector variant="segmented" className="w-full justify-between" />
        </div>
      </div>

      {/* Navigation links */}
      <div className="flex-1 px-4 py-4 space-y-1.5 overflow-y-auto">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onCloseMobile}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 text-xs font-medium rounded-lg transition-all ${
                  isActive
                    ? 'bg-[#EFF6FF] text-[#123B66] font-semibold shadow-xs border border-blue-100'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`
              }
            >
              <Icon className="w-4 h-4 shrink-0 text-[#2563EB]" />
              <span className="truncate">{item.name}</span>
            </NavLink>
          );
        })}
      </div>

      {/* Health Literacy & Firebase Cloud Sync Card */}
      <div className="p-4 m-4 rounded-xl bg-gradient-to-br from-[#123B66]/5 via-[#2563EB]/5 to-[#14B8A6]/5 border border-blue-100/70 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-[#123B66] font-semibold text-xs">
            <HeartPulse className="w-3.5 h-3.5 text-[#2563EB]" />
            <span>Vernacular Care</span>
          </div>
          <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded">
            med-decoder
          </span>
        </div>
        <p className="text-[11px] text-slate-500 leading-snug">
          Cloud database active on Firebase. Reports sync automatically when signed in.
        </p>
      </div>

      {/* User profile / Firebase auth footer */}
      <div className="p-4 border-t border-slate-200/80">
        {currentUser ? (
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5 min-w-0">
              {currentUser.photoURL ? (
                <img
                  src={currentUser.photoURL}
                  alt={currentUser.displayName || 'User'}
                  className="w-8 h-8 rounded-full border border-blue-200"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-blue-100 text-[#123B66] font-bold text-xs flex items-center justify-center border border-blue-200">
                  {currentUser.displayName ? currentUser.displayName[0] : 'U'}
                </div>
              )}
              <div className="min-w-0">
                <p className="text-xs font-semibold text-slate-900 truncate">
                  {currentUser.displayName || 'Firebase Patient'}
                </p>
                <p className="text-[10px] text-slate-500 truncate">{currentUser.email}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => signOut()}
              className="text-[11px] text-slate-500 hover:text-slate-800 p-1"
              title="Sign Out"
            >
              Sign out
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => signInWithGoogle()}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-all"
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Sign in with Google</span>
          </button>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden lg:block w-64 h-screen sticky top-0 shrink-0 z-30">
        {sidebarContent}
      </aside>

      {/* Mobile Backdrop & Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
          />
          <div className="relative w-72 max-w-[85vw] h-full shadow-2xl z-10 animate-in slide-in-from-left duration-200">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
