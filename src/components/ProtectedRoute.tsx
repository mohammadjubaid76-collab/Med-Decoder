/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Shield } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { currentUser, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 text-slate-700">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-[#123B66] to-[#2563EB] flex items-center justify-center text-white shadow-md animate-pulse mb-4">
          <Shield className="w-6 h-6 stroke-white fill-white/20" />
        </div>
        <p className="text-xs font-semibold text-slate-600">
          Verifying Med-Decoder Authentication...
        </p>
      </div>
    );
  }

  if (!currentUser) {
    // Redirect unauthenticated users to /login and preserve destination
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};
