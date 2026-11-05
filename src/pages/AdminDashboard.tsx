import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, LogOut, Shield, Trash2, Users } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { adminApiRequest } from '../services/adminApi';

interface AdminUser {
  uid: string;
  name?: string;
  email?: string;
  role?: string;
  disabled?: boolean;
  createdAt?: string;
}

interface AdminReport {
  id: string;
  userId?: string;
  patientName?: string;
  reportTitle?: { en?: string };
  reportDate?: string;
  status?: string;
}

export const AdminDashboard: React.FC = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [reports, setReports] = useState<AdminReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [usersData, reportsData] = await Promise.all([
        adminApiRequest<{ users: AdminUser[] }>('/api/admin/users'),
        adminApiRequest<{ reports: AdminReport[] }>('/api/admin/reports'),
      ]);
      setUsers(usersData.users || []);
      setReports(reportsData.reports || []);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Unable to load admin data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { void loadData(); }, [currentUser]);

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login', { replace: true });
  };

  const toggleUser = async (user: AdminUser) => {
    try {
      setError(null);
      await adminApiRequest(`/api/admin/users/${encodeURIComponent(user.uid)}`, {
        method: 'PATCH',
        body: JSON.stringify({ disabled: !user.disabled }),
      });
      await loadData();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Unable to update account status');
    }
  };

  const deleteReport = async (report: AdminReport) => {
    if (!report.userId) return;
    try {
      setError(null);
      await adminApiRequest(`/api/admin/users/${encodeURIComponent(report.userId)}/reports/${encodeURIComponent(report.id)}`, {
        method: 'DELETE',
      });
      await loadData();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Unable to delete report');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-900">
      <header className="h-16 bg-[#123B66] px-4 sm:px-8 flex items-center justify-between text-white">
        <div className="flex items-center gap-2.5 font-bold"><Shield className="w-5 h-5" /> Med-Decoder Admin</div>
        <div className="flex items-center gap-4 text-xs">
          <span className="hidden sm:inline text-blue-100">{currentUser?.email}</span>
          <button onClick={handleLogout} className="inline-flex items-center gap-2 rounded-lg bg-white/10 px-3 py-2 hover:bg-white/20"><LogOut className="w-4 h-4" /> Logout</button>
        </div>
      </header>
      <main className="mx-auto max-w-6xl p-4 sm:p-8 space-y-6">
        {loading ? (
          <div className="rounded-2xl bg-white p-8 text-center text-sm text-slate-500">Loading administration data...</div>
        ) : error ? (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 p-5 text-sm text-rose-800">{error}</div>
        ) : (
          <>
            <div className="grid gap-4 sm:grid-cols-3">
              <Stat icon={<Users />} label="Registered users" value={users.length} />
              <Stat icon={<FileText />} label="Uploaded reports" value={reports.length} />
              <Stat icon={<Shield />} label="Account status" value="Active" />
            </div>
            <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
              <div className="border-b border-slate-100 px-5 py-4 font-semibold text-slate-900">User management</div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500"><tr><th className="px-5 py-3">User</th><th className="px-5 py-3">Role</th><th className="px-5 py-3">Status</th><th className="px-5 py-3">Action</th></tr></thead>
                  <tbody>{users.map((user) => (
                    <tr key={user.uid} className="border-t border-slate-100">
                      <td className="px-5 py-3"><div className="font-semibold">{user.name || 'Unnamed user'}</div><div className="text-slate-500">{user.email}</div></td>
                      <td className="px-5 py-3">{user.role || 'user'}</td>
                      <td className="px-5 py-3">{user.disabled ? 'Disabled' : 'Active'}</td>
                      <td className="px-5 py-3"><button onClick={() => void toggleUser(user)} className="rounded-lg border border-slate-200 px-3 py-1.5 font-semibold hover:bg-slate-50">{user.disabled ? 'Enable' : 'Disable'}</button></td>
                    </tr>
                  ))}</tbody>
                </table>
              </div>
            </section>
            <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
              <div className="border-b border-slate-100 px-5 py-4 font-semibold text-slate-900">Recent reports</div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500"><tr><th className="px-5 py-3">Patient / Report</th><th className="px-5 py-3">Date</th><th className="px-5 py-3">Status</th><th className="px-5 py-3">Action</th></tr></thead>
                  <tbody>{reports.slice(0, 25).map((report) => (
                    <tr key={`${report.userId}-${report.id}`} className="border-t border-slate-100">
                      <td className="px-5 py-3"><div className="font-semibold">{report.reportTitle?.en || report.patientName || report.id}</div><div className="text-slate-500">{report.userId}</div></td>
                      <td className="px-5 py-3">{report.reportDate || '-'}</td>
                      <td className="px-5 py-3">{report.status || '-'}</td>
                      <td className="px-5 py-3"><button onClick={() => void deleteReport(report)} title="Delete report" className="text-rose-600"><Trash2 className="h-4 w-4" /></button></td>
                    </tr>
                  ))}</tbody>
                </table>
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
};

const Stat: React.FC<{ icon: React.ReactNode; label: string; value: string | number }> = ({ icon, label, value }) => (
  <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5">
    <div className="rounded-xl bg-blue-50 p-3 text-[#2563EB] [&>svg]:h-5 [&>svg]:w-5">{icon}</div>
    <div><div className="text-2xl font-bold">{value}</div><div className="text-xs text-slate-500">{label}</div></div>
  </div>
);
