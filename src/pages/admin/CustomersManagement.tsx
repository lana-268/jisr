import { useState, useMemo } from 'react';
import { Search, Users, ShieldOff, ShieldCheck } from 'lucide-react';
import { useCustomers } from '../../hooks/useCustomers';
import { StatusBadge } from '../../components/admin/StatusBadge';
import { ConfirmationModal } from '../../components/admin/ConfirmationModal';
import { TableSkeleton } from '../../components/admin/LoadingState';
import { EmptyState } from '../../components/admin/EmptyState';
import { blockCustomer, unblockCustomer } from '../../services/customerService';
import { useToast } from '../../contexts/ToastContext';
import { format } from '../../utils/date';
import type { Customer } from '../../types';

export function CustomersManagement() {
  const { customers, loading } = useCustomers();
  const { addToast } = useToast();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [blockConfirm, setBlockConfirm] = useState<{ type: 'block' | 'unblock'; customer: Customer } | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const filtered = useMemo(() => {
    return customers.filter(c => {
      const matchSearch = !search ||
        c.fullName.toLowerCase().includes(search.toLowerCase()) ||
        c.email.toLowerCase().includes(search.toLowerCase()) ||
        c.phone.includes(search);
      const matchStatus = statusFilter === 'ALL' || c.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [customers, search, statusFilter]);

  async function handleBlockAction() {
    if (!blockConfirm) return;
    setActionLoading(true);
    try {
      if (blockConfirm.type === 'block') {
        await blockCustomer(blockConfirm.customer.customerId);
        addToast('success', `${blockConfirm.customer.fullName} has been blocked`);
      } else {
        await unblockCustomer(blockConfirm.customer.customerId);
        addToast('success', `${blockConfirm.customer.fullName} has been unblocked`);
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
        <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
          <Users size={20} className="text-blue-600" />
        </div>
        <div>
          <h2 className="text-base font-semibold text-slate-900">Customers Management</h2>
          <p className="text-xs text-slate-500">{customers.length} total customers</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search customers..."
              className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="px-3 py-2.5 text-sm rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-700"
          >
            <option value="ALL">All Statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="BLOCKED">Blocked</option>
          </select>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <TableSkeleton cols={7} rows={6} />
      ) : filtered.length === 0 ? (
        <EmptyState icon={<Users size={28} />} title="No customers found" description="Try adjusting your search or filters." />
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  {['Customer', 'Email', 'Phone', 'District', 'Joined', 'Status', 'Actions'].map(h => (
                    <th key={h} className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map(c => (
                  <tr key={c.customerId} className="hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
                          {c.fullName.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-sm font-medium text-slate-900 whitespace-nowrap">{c.fullName}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-sm text-slate-600 whitespace-nowrap">{c.email}</td>
                    <td className="px-5 py-4 text-sm text-slate-600 whitespace-nowrap">{c.phone}</td>
                    <td className="px-5 py-4 text-sm text-slate-600 whitespace-nowrap">{c.district}</td>
                    <td className="px-5 py-4 text-sm text-slate-500 whitespace-nowrap">{format(c.createdAt)}</td>
                    <td className="px-5 py-4"><StatusBadge status={c.status} size="sm" /></td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1.5">
                        {c.status !== 'BLOCKED' ? (
                          <button
                            onClick={() => setBlockConfirm({ type: 'block', customer: c })}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-700 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                            aria-label={`Block ${c.fullName}`}
                          >
                            <ShieldOff size={13} /> Block
                          </button>
                        ) : (
                          <button
                            onClick={() => setBlockConfirm({ type: 'unblock', customer: c })}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors"
                            aria-label={`Unblock ${c.fullName}`}
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
            Showing {filtered.length} of {customers.length} customers
          </div>
        </div>
      )}

      <ConfirmationModal
        isOpen={!!blockConfirm}
        onClose={() => setBlockConfirm(null)}
        onConfirm={handleBlockAction}
        title={blockConfirm?.type === 'block' ? 'Block Customer' : 'Unblock Customer'}
        message={blockConfirm?.type === 'block'
          ? `Block ${blockConfirm?.customer.fullName}? They won't be able to use the platform.`
          : `Unblock ${blockConfirm?.customer.fullName}? They will regain full access.`
        }
        confirmLabel={blockConfirm?.type === 'block' ? 'Block Customer' : 'Unblock Customer'}
        confirmVariant={blockConfirm?.type === 'block' ? 'danger' : 'primary'}
        loading={actionLoading}
      />
    </div>
  );
}
