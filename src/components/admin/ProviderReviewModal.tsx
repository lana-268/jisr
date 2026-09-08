import { useState, useEffect } from 'react';
import { X, Building2, User, Phone, MapPin, Calendar, CheckCircle, XCircle, Loader2, Mail } from 'lucide-react';
import type { Provider } from '../../types';
import { StatusBadge } from './StatusBadge';
import { ConfirmationModal } from './ConfirmationModal';
import { approveProvider, rejectProvider } from '../../services/providerService';
import { useToast } from '../../contexts/ToastContext';
import { useAuth } from '../../contexts/AuthContext';
import { format, formatProviderType } from '../../utils/format';

interface Props {
  provider: Provider | null;
  isOpen: boolean;
  onClose: () => void;
  onAction: () => void;
}

export function ProviderReviewModal({ provider, isOpen, onClose, onAction }: Props) {
  const { admin } = useAuth();
  const { addToast } = useToast();
  const [confirm, setConfirm] = useState<'approve' | 'reject' | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !loading && !confirm) onClose();
    };
    if (isOpen) document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [isOpen, loading, confirm, onClose]);

  async function handleApprove() {
    if (!provider || !admin) return;
    setLoading(true);
    try {
      await approveProvider(provider.providerId, admin.adminId);
      addToast('success', `${provider.businessName} has been approved`);
      onAction();
      onClose();
    } catch {
      addToast('error', 'Failed to approve provider');
    } finally {
      setLoading(false);
      setConfirm(null);
    }
  }

  async function handleReject() {
    if (!provider) return;
    setLoading(true);
    try {
      await rejectProvider(provider.providerId);
      addToast('success', `${provider.businessName} has been rejected`);
      onAction();
      onClose();
    } catch {
      addToast('error', 'Failed to reject provider');
    } finally {
      setLoading(false);
      setConfirm(null);
    }
  }

  if (!isOpen || !provider) return null;

  return (
    <>
      <div className="fixed inset-0 z-40 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="review-title">
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={!loading ? onClose : undefined} />
        <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200">
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
            <div>
              <h2 id="review-title" className="text-base font-semibold text-slate-900">Provider Details</h2>
              <p className="text-xs text-slate-500 mt-0.5">Review information before approving or rejecting</p>
            </div>
            <button onClick={onClose} disabled={loading} className="text-slate-400 hover:text-slate-600 transition-colors rounded-lg p-1.5" aria-label="Close">
              <X size={18} />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Identity */}
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xl font-bold shrink-0">
                {provider.businessName.charAt(0).toUpperCase()}
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">{provider.businessName}</h3>
                <p className="text-sm text-slate-500">{provider.fullName}</p>
                <div className="mt-1.5"><StatusBadge status={provider.status} /></div>
              </div>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { icon: <User size={15} />, label: 'Full Name', value: provider.fullName },
                { icon: <Mail size={15} />, label: 'Email', value: provider.email },
                { icon: <Phone size={15} />, label: 'Phone', value: provider.phone },
                { icon: <MapPin size={15} />, label: 'District', value: provider.district },
                { icon: <Building2 size={15} />, label: 'Provider Type', value: formatProviderType(provider.providerType) },
                { icon: <Calendar size={15} />, label: 'Registered', value: format(provider.createdAt) },
              ].map(({ icon, label, value }) => (
                <div key={label} className="flex items-start gap-3 bg-slate-50 rounded-xl px-4 py-3">
                  <div className="mt-0.5 text-slate-400 shrink-0">{icon}</div>
                  <div>
                    <p className="text-xs text-slate-500 font-medium">{label}</p>
                    <p className="text-sm text-slate-900 font-medium mt-0.5">{value || '—'}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Description */}
            {provider.description && (
              <div>
                <p className="text-xs font-medium text-slate-500 mb-2">Description</p>
                <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 rounded-xl px-4 py-3">
                  {provider.description}
                </p>
              </div>
            )}

            {/* Image */}
            {provider.imageUrl && (
              <div>
                <p className="text-xs font-medium text-slate-500 mb-2">Uploaded Image</p>
                <img
                  src={provider.imageUrl}
                  alt="Provider uploaded document"
                  className="rounded-xl w-full max-h-64 object-cover border border-slate-200"
                />
              </div>
            )}
          </div>

          {/* Actions */}
          {provider.status === 'PENDING_APPROVAL' && (
            <div className="sticky bottom-0 bg-white border-t border-slate-100 px-6 py-4 flex items-center justify-end gap-3 rounded-b-2xl">
              <button
                onClick={() => setConfirm('reject')}
                disabled={loading}
                className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-red-700 bg-red-50 hover:bg-red-100 rounded-xl transition-colors disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-1"
              >
                <XCircle size={16} />
                Reject
              </button>
              <button
                onClick={() => setConfirm('approve')}
                disabled={loading}
                className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
              >
                {loading ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle size={16} />}
                Approve
              </button>
            </div>
          )}
        </div>
      </div>

      <ConfirmationModal
        isOpen={confirm === 'approve'}
        onClose={() => setConfirm(null)}
        onConfirm={handleApprove}
        title="Approve Provider"
        message={`Are you sure you want to approve ${provider.businessName}? They will be able to accept orders immediately.`}
        confirmLabel="Approve Provider"
        confirmVariant="primary"
        loading={loading}
        icon={<CheckCircle size={22} />}
      />

      <ConfirmationModal
        isOpen={confirm === 'reject'}
        onClose={() => setConfirm(null)}
        onConfirm={handleReject}
        title="Reject Provider"
        message={`Are you sure you want to reject ${provider.businessName}? Their account will be blocked.`}
        confirmLabel="Reject Provider"
        confirmVariant="danger"
        loading={loading}
        icon={<XCircle size={22} />}
      />
    </>
  );
}
