/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { MedicalDisclaimer } from '../components/common/MedicalDisclaimer';
import {
  User,
  Mail,
  Calendar,
  LogOut,
  ShieldCheck,
  AlertTriangle,
  RefreshCw,
  Clock,
  Shield,
  FileText,
} from 'lucide-react';

export const Profile: React.FC = () => {
  const { currentUser, logout, resendVerificationEmail } = useAuth();
  const { reports, prescriptions, showToast } = useApp();
  const navigate = useNavigate();

  const [isResending, setIsResending] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      showToast('You have been logged out.', 'info');
      navigate('/login');
    } catch (err) {
      showToast('Error logging out.', 'error');
    }
  };

  const handleResend = async () => {
    setIsResending(true);
    try {
      await resendVerificationEmail();
      showToast('Verification email resent! Please check your inbox.', 'success');
    } catch (err: any) {
      showToast(err.message || 'Could not send verification email.', 'error');
    } finally {
      setIsResending(false);
    }
  };

  const creationTime = currentUser?.metadata?.creationTime
    ? new Date(currentUser.metadata.creationTime).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : 'Recently';

  const lastSignIn = currentUser?.metadata?.lastSignInTime
    ? new Date(currentUser.metadata.lastSignInTime).toLocaleString()
    : 'Active now';

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="border-b border-slate-200 pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#2563EB]">
            Account Management
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mt-1">
            Patient Profile
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Firebase Authentication & Cloud Synchronization Details
          </p>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl transition-all self-start sm:self-center"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Log Out</span>
        </button>
      </div>

      {/* Main Profile Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          {currentUser?.photoURL ? (
            <img
              src={currentUser.photoURL}
              alt={currentUser.displayName || 'User'}
              className="w-20 h-20 rounded-2xl object-cover border-2 border-[#2563EB]/20 shadow-xs"
            />
          ) : (
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-[#123B66] to-[#2563EB] text-white flex items-center justify-center text-2xl font-bold shadow-xs">
              {currentUser?.displayName ? currentUser.displayName[0].toUpperCase() : 'U'}
            </div>
          )}

          <div className="space-y-1">
            <div className="flex items-center gap-3 flex-wrap">
              <h2 className="text-xl font-bold text-slate-900">
                {currentUser?.displayName || 'Med-Decoder Patient'}
              </h2>
              {currentUser?.emailVerified ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  Verified Patient
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                  Pending Email Verification
                </span>
              )}
            </div>

            <p className="text-xs text-slate-500 font-mono">
              UID: {currentUser?.uid}
            </p>
          </div>
        </div>

        {/* Verification Warning if not verified */}
        {!currentUser?.emailVerified && (
          <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-start gap-2.5 text-amber-900">
              <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <strong className="font-semibold">Verify your email address: </strong>
                <span>We sent a verification link to {currentUser?.email}.</span>
              </div>
            </div>
            <button
              type="button"
              disabled={isResending}
              onClick={handleResend}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-amber-300 text-amber-900 font-semibold text-xs hover:bg-amber-100/50 transition-colors whitespace-nowrap self-start sm:self-auto"
            >
              {isResending ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : null}
              <span>Resend Verification Email</span>
            </button>
          </div>
        )}

        {/* Metadata Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-100 text-xs">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
            <div className="flex items-center gap-1.5 text-slate-500 font-medium">
              <Mail className="w-3.5 h-3.5 text-[#2563EB]" />
              <span>Email Address</span>
            </div>
            <p className="font-semibold text-slate-900 truncate">
              {currentUser?.email || 'N/A'}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
            <div className="flex items-center gap-1.5 text-slate-500 font-medium">
              <Calendar className="w-3.5 h-3.5 text-[#14B8A6]" />
              <span>Account Created</span>
            </div>
            <p className="font-semibold text-slate-900 tabular-nums">
              {creationTime}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
            <div className="flex items-center gap-1.5 text-slate-500 font-medium">
              <Clock className="w-3.5 h-3.5 text-indigo-600" />
              <span>Last Active Session</span>
            </div>
            <p className="font-semibold text-slate-900 tabular-nums truncate">
              {lastSignIn}
            </p>
          </div>
        </div>

        {/* Cloud Records Summary */}
        <div className="p-5 rounded-2xl bg-gradient-to-r from-blue-50/80 to-teal-50/50 border border-blue-100 flex items-center justify-between">
          <div className="space-y-0.5">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Firebase Cloud Storage Sync
            </h4>
            <p className="text-xs text-slate-600">
              {reports.length} pathology reports & {prescriptions.length} prescriptions saved under your account.
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate('/reports')}
            className="px-3.5 py-1.5 text-xs font-semibold text-[#123B66] bg-white hover:bg-blue-50/80 border border-blue-200 rounded-lg shadow-2xs transition-colors"
          >
            Manage Records
          </button>
        </div>
      </div>

      <MedicalDisclaimer isDemo={true} />
    </div>
  );
};
