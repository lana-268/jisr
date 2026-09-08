import { useState } from 'react';
import { UserCog, Plus, Mail, Calendar, User } from 'lucide-react';
import { useSupportAdmins } from '../../hooks/useSupportAdmins';
import { AddSupportAdminModal } from '../../components/admin/AddSupportAdminModal';
import { TableSkeleton } from '../../components/admin/LoadingState';
import { EmptyState } from '../../components/admin/EmptyState';
import { format } from '../../utils/date';

export function SupportAdmins() {
  const { admins, loading } = useSupportAdmins();
  const [addOpen, setAddOpen] = useState(false);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center">
            <UserCog size={20} className="text-indigo-600" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-slate-900">Support Admins</h2>
            <p className="text-xs text-slate-500">{admins.length} support admin{admins.length !== 1 ? 's' : ''}</p>
          </div>
        </div>
        <button
          onClick={() => setAddOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 shadow-sm"
        >
          <Plus size={16} />
          <span className="hidden sm:inline">Add Support Admin</span>
          <span className="sm:hidden">Add</span>
        </button>
      </div>

      {/* Table */}
      {loading ? (
        <TableSkeleton cols={5} rows={4} />
      ) : admins.length === 0 ? (
        <EmptyState
          icon={<UserCog size={28} />}
          title="No support admins yet"
          description="Add a support admin to help manage customer conversations and provider approvals."
          action={
            <button onClick={() => setAddOpen(true)} className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors">
              <Plus size={16} /> Add Support Admin
            </button>
          }
        />
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  {['Admin', 'Email', 'Role', 'Created', 'Created By'].map(h => (
                    <th key={h} className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {admins.map(a => (
                  <tr key={a.adminId} className="hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold shrink-0">
                          {a.fullName.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-900">{a.fullName}</p>
                          <p className="text-xs text-slate-500">{a.adminId.slice(0, 8)}...</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Mail size={13} className="text-slate-400 shrink-0" />
                        {a.email}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="inline-flex items-center gap-1.5 bg-indigo-50 text-indigo-700 border border-indigo-200 text-xs font-medium px-2.5 py-1 rounded-full">
                        <User size={10} />
                        Support Admin
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2 text-sm text-slate-500">
                        <Calendar size={13} className="text-slate-400" />
                        {format(a.createdAt)}
                      </div>
                    </td>
                    <td className="px-5 py-4 text-sm text-slate-500">
                      {a.createdByAdminId ? (
                        <span className="text-xs bg-slate-100 px-2 py-1 rounded-lg font-mono">{a.createdByAdminId.slice(0, 8)}...</span>
                      ) : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <AddSupportAdminModal
        isOpen={addOpen}
        onClose={() => setAddOpen(false)}
        onCreated={() => {}}
      />
    </div>
  );
}
