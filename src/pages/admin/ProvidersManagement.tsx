import { useState, useMemo } from 'react';
import { Search, Eye, ShieldOff, ShieldCheck, Building2 } from 'lucide-react';
import { useProviders } from '../../hooks/useProviders';
import { StatusBadge } from '../../components/admin/StatusBadge';
import { ConfirmationModal } from '../../components/admin/ConfirmationModal';
import { ProviderReviewModal } from '../../components/admin/ProviderReviewModal';
import { TableSkeleton } from '../../components/admin/LoadingState';
import { EmptyState } from '../../components/admin/EmptyState';
import { blockProvider, unblockProvider } from '../../services/providerService';
import { useToast } from '../../contexts/ToastContext';
import { formatProviderType } from '../../utils/format';
import { format } from '../../utils/date';
import type { Provider } from '../../types';

export function ProvidersManagement() {
  const { providers, loading } = useProviders();
  const { addToast } = useToast();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [selected, setSelected] = useState<Provider | null>(null);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [blockConfirm, setBlockConfirm] = useState<{ type: 'block' | 'unblock'; provider: Provider } | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const filtered = useMemo(() => {
    return providers.filter(p => {
      const matchSearch = !search ||
        p.fullName.toLowerCase().includes(search.toLowerCase()) ||
        p.businessName.toLowerCase().includes(search.toLowerCase()) ||
        p.email.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === 'ALL' || p.status === statusFilter;
      const matchType = typeFilter === 'ALL' || p.providerType === typeFilter;
      return matchSearch && matchStatus && matchType;
    });
  }, [providers, search, statusFilter, typeFilter]);

  async function handleBlockAction() {
    if (!blockConfirm) return;
    setActionLoading(true);
    try {
      if (blockConfirm.type === 'block') {
        await blockProvider(blockConfirm.provider.providerId);
        addToast('success', `${blockConfirm.provider.businessName} has been blocked`);
      } else {
        await unblockProvider(blockConfirm.provider.providerId);
        addToast('success', `${blockConfirm.provider.businessName} has been unblocked`);
      }
    } catch {
      addToast('error', 'Action failed. Please try again.');
    } finally {
      setActionLoading(false);
      setBlockConfirm(null);
    }
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-violet-50 rounded-xl flex items-center justify-center">
          <Building2 size={20} className="text-violet-600" />
        </div>
        <div>
          <h2 className="text-base font-semibold text-slate-900">Providers Management</h2>
          <p className="text-xs text-slate-500">{providers.length} total providers</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search providers..."
              className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          {/* Status filter */}
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="px-3 py-2.5 text-sm rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-700"
          >
            <option value="ALL">All Statuses</option>
            <option value="APPROVED">Approved</option>
            <option value="PENDING_APPROVAL">Pending</option>
            <option value="BLOCKED">Blocked</option>
          </select>
          {/* Type filter */}
          <select
            value={typeFilter}
            onChange={e => setTypeFilter(e.target.value)}
            className="px-3 py-2.5 text-sm rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-700"
          >
            <option value="ALL">All Types</option>
            <option value="HOME_PRODUCT">Home Products</option>
            <option value="GENERAL_SERVICE">General Services</option>
          </select>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <TableSkeleton cols={8} rows={6} />
      ) : filtered.length === 0 ? (
        <EmptyState icon={<Building2 size={28} />} title="No providers found" description="Try adjusting your search or filters." />
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  {['Provider', 'Business', 'Type', 'District', 'Online', 'Status', 'Joined', 'Actions'].map(h => (
                    <th key={h} className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map(p => (
                  <tr key={p.providerId} className="hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                          {p.businessName.charAt(0)}
                        </div>
                        <span className="text-sm font-medium text-slate-900 whitespace-nowrap">{p.fullName}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-sm text-slate-700 font-medium whitespace-nowrap">{p.businessName}</td>
                    <td className="px-5 py-4">
                      <span className="text-xs bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg font-medium whitespace-nowrap">
                        {formatProviderType(p.providerType)}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-sm text-slate-600 whitespace-nowrap">{p.district}</td>
                    <td className="px-5 py-4">
                      <span className={`flex items-center gap-1.5 text-xs font-medium whitespace-nowrap ${p.isOnline ? 'text-emerald-600' : 'text-slate-400'}`}>
                        <span className={`w-2 h-2 rounded-full ${p.isOnline ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                        {p.isOnline ? 'Online' : 'Offline'}
                      </span>
                    </td>
                    <td className="px-5 py-4"><StatusBadge status={p.status} size="sm" /></td>
                    <td className="px-5 py-4 text-sm text-slate-500 whitespace-nowrap">{format(p.createdAt)}</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => { setSelected(p); setReviewOpen(true); }}
                          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                          aria-label={`View ${p.businessName}`}
                        >
                          <Eye size={13} /> View
                        </button>
                        {p.status !== 'BLOCKED' ? (
                          <button
                            onClick={() => setBlockConfirm({ type: 'block', provider: p })}
                            className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-red-700 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                            aria-label={`Block ${p.businessName}`}
                          >
                            <ShieldOff size={13} /> Block
                          </button>
                        ) : (
                          <button
                            onClick={() => setBlockConfirm({ type: 'unblock', provider: p })}
                            className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors"
                            aria-label={`Unblock ${p.businessName}`}
                          >
                            <ShieldCheck size={13} /> Unblock
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-5 py-3 border-t border-slate-100 bg-slate-50 text-xs text-slate-500">
            Showing {filtered.length} of {providers.length} providers
          </div>
        </div>
      )}

      <ProviderReviewModal
        provider={selected}
        isOpen={reviewOpen}
        onClose={() => setReviewOpen(false)}
        onAction={() => {}}
      />

      <ConfirmationModal
        isOpen={!!blockConfirm}
        onClose={() => setBlockConfirm(null)}
        onConfirm={handleBlockAction}
        title={blockConfirm?.type === 'block' ? 'Block Provider' : 'Unblock Provider'}
        message={blockConfirm?.type === 'block'
          ? `Block ${blockConfirm?.provider.businessName}? They will not be able to access the platform.`
          : `Unblock ${blockConfirm?.provider.businessName}? They will regain access to the platform.`
        }
        confirmLabel={blockConfirm?.type === 'block' ? 'Block Provider' : 'Unblock Provider'}
        confirmVariant={blockConfirm?.type === 'block' ? 'danger' : 'primary'}
        loading={actionLoading}
      />
    </div>
  );
}
