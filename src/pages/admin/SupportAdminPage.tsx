import { Navigate, Route, Routes } from 'react-router-dom';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { AdminOverview } from './AdminOverview';
import { PendingProviders } from './PendingProviders';
import { SupportChats } from './SupportChats';
import { useAuth } from '../../contexts/AuthContext';

export function SupportAdminPage() {
  const { admin, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#F8FAFC]">
        <div className="flex flex-col items-center gap-4">
          <span className="w-10 h-10 border-4 border-blue-500/20 border-t-blue-600 rounded-full animate-spin" />
          <p className="text-sm text-slate-500">Loading...</p>
        </div>
      </div>
    );
  }

  if (!admin || admin.role !== 'SUPPORT_ADMIN') {
    return <Navigate to="/login" replace />;
  }

  return (
    <Routes>
      <Route element={<AdminLayout basePath="/admin/support" />}>
        <Route index element={<Navigate to="overview" replace />} />
        <Route path="overview" element={<AdminOverview />} />
        <Route path="pending" element={<PendingProviders />} />
        <Route path="chats" element={<SupportChats />} />
        {/* Redirect any super-admin only paths */}
        <Route path="*" element={<Navigate to="overview" replace />} />
      </Route>
    </Routes>
  );
}
