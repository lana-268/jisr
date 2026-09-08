import { useState } from 'react';
import { Eye, CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react';
import { usePendingProviders } from '../../hooks/usePendingProviders';
import { StatusBadge } from '../../components/admin/StatusBadge';
import { ProviderReviewModal } from '../../components/admin/ProviderReviewModal';
import { ConfirmationModal } from '../../components/admin/ConfirmationModal';
import { TableSkeleton } from '../../components/admin/LoadingState';
import { EmptyState } from '../../components/admin/EmptyState';
import { approveProvider, rejectProvider } from '../../services/providerService';
import { useToast } from '../../contexts/ToastContext';
import { useAuth } from '../../contexts/AuthContext';
import { formatProviderType } from '../../utils/format';
import { format } from '../../utils/date';
import type { Provider } from '../../types';

export function PendingProviders() {
  const { providers, loading } = usePendingProviders();
  const { addToast } = useToast();
  const { admin } = useAuth();

  const [selected, setSelected] = useState<Provider | null>(null);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [quickConfirm, setQuickConfirm] = useState<{ type: 'approve' | 'reject'; provider: Provider } | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  function openReview(p: Provider) { setSelected(p); setReviewOpen(true); }

  async function handleQuickAction() {
    if (!quickConfirm || !admin) return;
    setActionLoading(true);
    try {
      if (quickConfirm.type === 'approve') {
        await approveProvider(quickConfirm.provider.providerId, admin.adminId);
        addToast('success', `${quickConfirm.provider.businessName} approved`);
      } else {
        await rejectProvider(quickConfirm.provider.providerId);
        addToast('success', `${quickConfirm.provider.businessName} rejected`);
      }
    } catch {
      addToast('error', 'Action failed. Please try again.');
    } finally {
      setActionLoading(false);
      setQuickConfirm(null);
    }
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center">
            <Clock size={20} className="text-amber-600" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-slate-900">Pending Approvals</h2>
            <p className="text-xs text-slate-500">{providers.length} provider{providers.length !== 1 ? 's' : ''} awaiting review</p>
          </div>
        </div>
        {providers.length > 0 && (
          <span className="bg-amber-100 text-amber-700 text-xs font-semibold px-3 py-1.5 rounded-full">
            {providers.length} Pending
          </span>
        )}
      </div>

      {/* Table */}
      {loading ? (
        <TableSkeleton cols={8} rows={5} />
      ) : providers.length === 0 ? (
        <EmptyState
          icon={<Clock size={28} />}
          title="No pending providers"
          description="All provider applications have been reviewed. New ones will appear here."
        />
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  {['Provider', 'Business', 'Type', 'District', 'Phone', 'Submitted', 'Status', 'Actions'].map(h => (
                    <th key={h} className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {providers.map(p => (
                  <tr key={p.providerId} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
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
                    <td className="px-5 py-4 text-sm text-slate-500 whitespace-nowrap">{p.phone}</td>
                    <td className="px-5 py-4 text-sm text-slate-500 whitespace-nowrap">{format(p.createdAt)}</td>
                    <td className="px-5 py-4"><StatusBadge status={p.status} size="sm" /></td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => openReview(p)}
                          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                          aria-label={`View ${p.businessName}`}
                        >
                          <Eye size={13} /> View
                        </button>
                        <button
                          onClick={() => setQuickConfirm({ type: 'approve', provider: p })}
                          className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors"
                          aria-label={`Approve ${p.businessName}`}
                        >
                          <CheckCircle size={13} />
                        </button>
                        <button
                          onClick={() => setQuickConfirm({ type: 'reject', provider: p })}
                          className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-red-700 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                          aria-label={`Reject ${p.businessName}`}
                        >
                          <XCircle size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
        isOpen={!!quickConfirm}
        onClose={() => setQuickConfirm(null)}
        onConfirm={handleQuickAction}
        title={quickConfirm?.type === 'approve' ? 'Approve Provider' : 'Reject Provider'}
        message={quickConfirm?.type === 'approve'
          ? `Approve ${quickConfirm?.provider.businessName}? They will be able to accept orders immediately.`
          : `Reject ${quickConfirm?.provider.businessName}? Their account will be blocked.`
        }
        confirmLabel={quickConfirm?.type === 'approve' ? 'Approve' : 'Reject'}
        confirmVariant={quickConfirm?.type === 'approve' ? 'primary' : 'danger'}
        loading={actionLoading}
        icon={quickConfirm?.type === 'approve' ? <CheckCircle size={22} /> : <AlertCircle size={22} />}
      />
    </div>
  );
}
