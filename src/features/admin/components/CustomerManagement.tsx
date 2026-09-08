import { Ban, Eye, RotateCcw, SlidersHorizontal } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Button } from '../../../shared/components/Button';
import { ConfirmDialog, EmptyState } from '../../../shared/components/Feedback';
import { Input, Select } from '../../../shared/components/FormControls';
import { Modal } from '../../../shared/components/Modal';
import type { AdminCustomer, CustomerAccountStatus } from '../types/admin';
import { filterCustomers, formatAdminCurrency, formatAdminDate } from '../utils/adminDashboard';
import { AdminAccountBadge } from './AdminAccountBadge';

export interface CustomerManagementProps {
  customers: AdminCustomer[];
  updatingId: string | null;
  onUpdateStatus: (customer: AdminCustomer, status: CustomerAccountStatus) => Promise<void>;
}

interface PendingCustomerAction {
  customer: AdminCustomer;
  status: CustomerAccountStatus;
}

export function CustomerManagement({ customers, updatingId, onUpdateStatus }: CustomerManagementProps) {
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState<'ALL' | CustomerAccountStatus>('ALL');
  const [viewing, setViewing] = useState<AdminCustomer | null>(null);
  const [pendingAction, setPendingAction] = useState<PendingCustomerAction | null>(null);
  const filteredCustomers = useMemo(() => filterCustomers(customers, { query, status }), [customers, query, status]);
  const resetFilters = () => { setQuery(''); setStatus('ALL'); };

  const confirmAction = async () => {
    if (!pendingAction) return;
    try {
      await onUpdateStatus(pendingAction.customer, pendingAction.status);
      setPendingAction(null);
    } catch {
      // The dashboard hook keeps the dialog open and surfaces the repository error in a toast.
    }
  };

  const actionButtons = (customer: AdminCustomer) => <div className="flex flex-wrap justify-end gap-2">
    <Button variant="ghost" className="!px-3" icon={<Eye className="h-4 w-4" />} onClick={() => setViewing(customer)}>View</Button>
    {customer.status === 'ACTIVE'
      ? <Button variant="ghost" className="!px-3 !text-danger hover:!bg-red-50" icon={<Ban className="h-4 w-4" />} disabled={Boolean(updatingId)} onClick={() => setPendingAction({ customer, status: 'BLOCKED' })}>Block</Button>
      : <Button variant="secondary" className="!px-3" icon={<RotateCcw className="h-4 w-4" />} disabled={Boolean(updatingId)} onClick={() => setPendingAction({ customer, status: 'ACTIVE' })}>Unblock</Button>}
  </div>;

  return <section id="customers" className="scroll-mt-28 rounded-xl border border-border bg-surface shadow-card">
    <header className="border-b border-border p-5 sm:p-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div><p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">Community accounts</p><h2 className="mt-1 text-xl font-semibold text-heading sm:text-2xl">Customer management</h2><p className="mt-1 text-sm text-muted">Review customer activity and control account access.</p></div>
        <p className="text-sm font-medium text-muted">{filteredCustomers.length} of {customers.length} customers</p>
      </div>
      <div className="mt-5 grid gap-3 md:grid-cols-[minmax(0,1fr)_220px]">
        <Input label="Search customers" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Name, email, district, or customer ID" autoComplete="off" />
        <Select label="Account status" value={status} onChange={(event) => setStatus(event.target.value as 'ALL' | CustomerAccountStatus)}>
          <option value="ALL">All statuses</option><option value="ACTIVE">Active</option><option value="BLOCKED">Blocked</option>
        </Select>
      </div>
    </header>
    {!filteredCustomers.length ? <EmptyState title="No customers found" description="Try a different name, district, or account status." action={<Button variant="outline" icon={<SlidersHorizontal className="h-4 w-4" />} onClick={resetFilters}>Clear filters</Button>} /> : <div className="p-3 sm:p-5">
      <div className="hidden overflow-x-auto rounded-xl border border-border xl:block" data-testid="admin-customer-table">
        <table className="w-full min-w-[920px] text-left text-sm"><thead className="h-12 bg-page text-xs font-semibold uppercase tracking-wide text-muted"><tr><th className="px-4">Customer</th><th className="px-4">District</th><th className="px-4">Orders</th><th className="px-4">Total spent</th><th className="px-4">Status</th><th className="px-4">Joined</th><th className="px-4 text-right">Actions</th></tr></thead><tbody className="divide-y divide-border">{filteredCustomers.map((customer) => <tr key={customer.customerId} className="hover:bg-page/70"><td className="px-4 py-4"><p className="font-semibold text-heading">{customer.name}</p><p className="mt-0.5 text-xs text-muted">{customer.email}</p></td><td className="px-4 py-4 text-body">{customer.district}</td><td className="px-4 py-4 font-medium text-heading">{customer.orderCount}</td><td className="whitespace-nowrap px-4 py-4 font-semibold text-heading">{formatAdminCurrency(customer.totalSpent)}</td><td className="px-4 py-4"><AdminAccountBadge status={customer.status} /></td><td className="whitespace-nowrap px-4 py-4 text-muted">{formatAdminDate(customer.createdAt)}</td><td className="px-4 py-4">{actionButtons(customer)}</td></tr>)}</tbody></table>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 xl:hidden" data-testid="admin-customer-cards">{filteredCustomers.map((customer) => <article key={customer.customerId} className="rounded-xl border border-border p-4"><div className="flex items-start justify-between gap-3"><div className="min-w-0"><p className="truncate font-semibold text-heading">{customer.name}</p><p className="mt-0.5 truncate text-sm text-muted">{customer.email}</p></div><AdminAccountBadge status={customer.status} /></div><dl className="mt-4 grid grid-cols-2 gap-3 border-y border-border py-3 text-sm"><div><dt className="text-xs text-muted">District</dt><dd className="mt-0.5 font-medium text-heading">{customer.district}</dd></div><div><dt className="text-xs text-muted">Orders</dt><dd className="mt-0.5 font-medium text-heading">{customer.orderCount}</dd></div><div><dt className="text-xs text-muted">Total spent</dt><dd className="mt-0.5 font-medium text-heading">{formatAdminCurrency(customer.totalSpent)}</dd></div><div><dt className="text-xs text-muted">Joined</dt><dd className="mt-0.5 font-medium text-heading">{formatAdminDate(customer.createdAt)}</dd></div></dl><div className="mt-3">{actionButtons(customer)}</div></article>)}</div>
    </div>}
    <ConfirmDialog open={Boolean(pendingAction)} onClose={() => setPendingAction(null)} onConfirm={() => void confirmAction()} loading={Boolean(pendingAction && updatingId === pendingAction.customer.customerId)} danger={pendingAction?.status === 'BLOCKED'} title={pendingAction?.status === 'BLOCKED' ? 'Block this customer?' : 'Restore this customer?'} message={pendingAction?.status === 'BLOCKED' ? `${pendingAction.customer.name} will no longer be able to place orders or contact providers.` : `${pendingAction?.customer.name ?? 'This customer'} will regain access to the Jisr marketplace.`} confirmLabel={pendingAction?.status === 'BLOCKED' ? 'Block customer' : 'Restore access'} />
    <Modal open={Boolean(viewing)} onClose={() => setViewing(null)} title="Customer details" description="Account and marketplace activity">
      {viewing && <div><div className="flex items-center gap-3 rounded-xl bg-page p-4"><span className="flex h-11 w-11 items-center justify-center rounded-full bg-primary-soft font-bold text-primary">{viewing.name.split(' ').map((part) => part[0]).slice(0, 2).join('')}</span><div className="min-w-0"><p className="truncate font-semibold text-heading">{viewing.name}</p><p className="truncate text-sm text-muted">{viewing.customerId}</p></div><span className="ml-auto"><AdminAccountBadge status={viewing.status} /></span></div><dl className="mt-5 grid gap-5 text-sm sm:grid-cols-2"><div><dt className="text-muted">Email</dt><dd className="mt-1 break-all font-medium text-heading">{viewing.email}</dd></div><div><dt className="text-muted">Phone</dt><dd className="mt-1 font-medium text-heading">{viewing.phone}</dd></div><div><dt className="text-muted">District</dt><dd className="mt-1 font-medium text-heading">{viewing.district}</dd></div><div><dt className="text-muted">Joined</dt><dd className="mt-1 font-medium text-heading">{formatAdminDate(viewing.createdAt)}</dd></div><div><dt className="text-muted">Orders placed</dt><dd className="mt-1 font-medium text-heading">{viewing.orderCount}</dd></div><div><dt className="text-muted">Total spent</dt><dd className="mt-1 font-medium text-heading">{formatAdminCurrency(viewing.totalSpent)}</dd></div></dl></div>}
    </Modal>
  </section>;
}
