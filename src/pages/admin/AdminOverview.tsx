import { Users, Building2, Clock, MessageSquare, AlertCircle, RefreshCw } from 'lucide-react';
import { StatCard } from '../../components/admin/StatCard';
import { useDashboardStats } from '../../hooks/useDashboardStats';
import { usePendingProviders } from '../../hooks/usePendingProviders';
import { StatusBadge } from '../../components/admin/StatusBadge';
import { formatProviderType } from '../../utils/format';
import { format } from '../../utils/date';

export function AdminOverview() {
  const { stats, loading, error, refetch } = useDashboardStats();
  const { providers: pending } = usePendingProviders();

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Error banner */}
      {error && (
        <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
          <AlertCircle size={16} className="shrink-0" />
          <span>{error}</span>
          <button onClick={refetch} className="ml-auto flex items-center gap-1.5 text-red-600 hover:text-red-800 font-medium">
            <RefreshCw size={14} /> Retry
          </button>
        </div>
      )}

      {/* Stats */}
      <div>
        <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">Platform Overview</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <StatCard
            label="Total Customers"
            value={stats.totalCustomers}
            icon={<Users size={22} className="text-blue-600" />}
            iconBg="bg-blue-50"
            trend="All registered customers"
            trendColor="text-slate-500"
            loading={loading}
          />
          <StatCard
            label="Total Providers"
            value={stats.totalProviders}
            icon={<Building2 size={22} className="text-violet-600" />}
            iconBg="bg-violet-50"
            trend="All registered providers"
            trendColor="text-slate-500"
            loading={loading}
          />
          <StatCard
            label="Pending Approvals"
            value={stats.pendingApprovals}
            icon={<Clock size={22} className="text-amber-600" />}
            iconBg="bg-amber-50"
            trend={stats.pendingApprovals > 0 ? 'Requires attention' : 'All clear'}
            trendColor={stats.pendingApprovals > 0 ? 'text-amber-600' : 'text-emerald-600'}
            loading={loading}
          />
          <StatCard
            label="Active Chats"
            value={stats.activeChats}
            icon={<MessageSquare size={22} className="text-emerald-600" />}
            iconBg="bg-emerald-50"
            trend="Open conversations"
            trendColor="text-slate-500"
            loading={loading}
          />
        </div>
      </div>

      {/* Recent Pending */}
      {pending.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">
            Recent Pending Approvals
          </h2>
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    {['Provider', 'Business', 'Type', 'District', 'Submitted', 'Status'].map(h => (
                      <th key={h} className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide whitespace-nowrap">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {pending.slice(0, 5).map(p => (
                    <tr key={p.providerId} className="hover:bg-slate-50 transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                            {p.businessName.charAt(0)}
                          </div>
                          <span className="text-sm font-medium text-slate-900">{p.fullName}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-sm text-slate-600">{p.businessName}</td>
                      <td className="px-5 py-4">
                        <span className="text-xs bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg font-medium">
                          {formatProviderType(p.providerType)}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-sm text-slate-600">{p.district}</td>
                      <td className="px-5 py-4 text-sm text-slate-500 whitespace-nowrap">{format(p.createdAt)}</td>
                      <td className="px-5 py-4"><StatusBadge status={p.status} size="sm" /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
