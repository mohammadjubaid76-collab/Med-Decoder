import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, HeartPulse, Shield, UserRound } from 'lucide-react';

export const AuthSelection: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-4xl">
        <div className="mb-8 text-center">
          <Link to="/" className="inline-flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#123B66] to-[#2563EB] text-white flex items-center justify-center">
              <Shield className="w-5 h-5" />
            </div>
            <span className="text-xl font-bold text-[#123B66]">Med<span className="text-[#2563EB]">-Decoder</span></span>
          </Link>
          <h1 className="mt-6 text-3xl font-bold tracking-tight text-slate-900">Choose Your Login Type</h1>
          <p className="mt-2 text-sm text-slate-500">Continue to the patient experience or administrator portal.</p>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <Link to="/login" className="group rounded-3xl border border-slate-200 bg-white p-7 shadow-sm transition-all hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl">
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-[#2563EB]">
              <UserRound className="h-6 w-6" />
            </div>
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-[#2563EB]">Patients & caregivers</p>
                <h2 className="mt-1 text-xl font-bold text-slate-900">User Login</h2>
                <p className="mt-2 text-xs leading-relaxed text-slate-500">Access your reports, prescriptions, profile, and personal dashboard.</p>
              </div>
              <HeartPulse className="h-5 w-5 shrink-0 text-teal-500 transition-transform group-hover:translate-x-1" />
            </div>
            <div className="mt-6 inline-flex items-center gap-2 text-xs font-semibold text-[#123B66]">
              Continue as patient <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </div>
          </Link>

          <Link to="/admin/login" className="group rounded-3xl border border-slate-800 bg-[#123B66] p-7 text-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl">
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-blue-100">
              <Shield className="h-6 w-6" />
            </div>
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-blue-200">Restricted access</p>
                <h2 className="mt-1 text-xl font-bold">Administrator Login</h2>
                <p className="mt-2 text-xs leading-relaxed text-blue-100">Manage authorized users and medical reports from the admin portal.</p>
              </div>
              <Shield className="h-5 w-5 shrink-0 text-teal-300 transition-transform group-hover:translate-x-1" />
            </div>
            <div className="mt-6 inline-flex items-center gap-2 text-xs font-semibold text-white">
              Continue as administrator <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};
