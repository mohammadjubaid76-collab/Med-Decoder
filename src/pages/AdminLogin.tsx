import React, { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { AlertCircle, Lock, Mail, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';

export const AdminLogin: React.FC = () => {
  const { loginAsAdmin, currentUser, role, authError, clearAuthError } = useAuth();
  const { showToast } = useApp();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (currentUser && role === 'admin') return <Navigate to="/admin/dashboard" replace />;

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    clearAuthError();
    if (!email.trim() || !password) {
      setError('Enter an admin email and password.');
      return;
    }
    setSubmitting(true);
    try {
      await loginAsAdmin(email.trim(), password);
      showToast('Administrator access verified.', 'success');
      navigate('/admin/dashboard', { replace: true });
    } catch (err: any) {
      setError(err?.message || 'Admin login failed.');
    } finally {
      setSubmitting(false);
    }
  };

  const visibleError = error || authError;

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden">
        <div className="bg-[#123B66] px-8 py-7 text-white">
          <Link to="/" className="inline-flex items-center gap-2 text-sm font-bold">
            <Shield className="w-5 h-5" />
            Med-Decoder Admin
          </Link>
          <h1 className="mt-5 text-2xl font-bold">Administrator Login</h1>
          <p className="mt-1 text-xs text-blue-100">Restricted access for authorized personnel only.</p>
        </div>
        <form onSubmit={handleSubmit} className="p-8 space-y-5">
          {visibleError && (
            <div className="flex gap-2 rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-3 text-xs text-rose-800">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{visibleError}</span>
            </div>
          )}
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-700">Admin email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-3 text-xs outline-none focus:border-blue-500" placeholder="admin@example.com" />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-700">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-3 text-xs outline-none focus:border-blue-500" placeholder="Password" />
            </div>
          </div>
          <button disabled={submitting} className="w-full rounded-xl bg-[#123B66] py-3 text-xs font-semibold text-white hover:bg-[#1a4a7d] disabled:opacity-60">
            {submitting ? 'Verifying access...' : 'Sign in as Admin'}
          </button>
          <Link to="/login" className="block text-center text-xs font-semibold text-slate-500 hover:text-slate-900">Return to patient login</Link>
        </form>
      </div>
    </div>
  );
};
