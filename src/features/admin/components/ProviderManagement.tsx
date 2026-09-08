import { Ban, Check, Eye, RotateCcw, SlidersHorizontal } from 'lucide-react';
import { useMemo, useState } from 'react';
import type { Provider, ProviderStatus, ProviderType } from '../../../types';
import { Button } from '../../../shared/components/Button';
import { ConfirmDialog, EmptyState } from '../../../shared/components/Feedback';
import { Input, Select } from '../../../shared/components/FormControls';
import { Modal } from '../../../shared/components/Modal';
import { StatusBadge } from '../../../shared/components/StatusBadge';
import { filterProviders, formatAdminDate, providerTypeName } from '../utils/adminDashboard';

type ModeratedProviderStatus = Extract<ProviderStatus, 'APPROVED' | 'BLOCKED'>;

export interface ProviderManagementProps {
  providers: Provider[];
  updatingId: string | null;
  onUpdateStatus: (providerId: string, status: ModeratedProviderStatus) => Promise<void>;
}

interface PendingProviderAction {
  provider: Provider;
  status: ModeratedProviderStatus;
}

export function ProviderManagement({ providers, updatingId, onUpdateStatus }: ProviderManagementProps) {
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState<'ALL' | ProviderStatus>('ALL');
  const [type, setType] = useState<'ALL' | ProviderType>('ALL');
  const [viewing, setViewing] = useState<Provider | null>(null);
  const [pendingAction, setPendingAction] = useState<PendingProviderAction | null>(null);
  const filteredProviders = useMemo(() => filterProviders(providers, { query, status, type }), [providers, query, status, type]);
  const resetFilters = () => { setQuery(''); setStatus('ALL'); setType('ALL'); };

  const confirmAction = async () => {
    if (!pendingAction) return;
    try {
      await onUpdateStatus(pendingAction.provider.providerId, pendingAction.status);
      setPendingAction(null);
    } catch {
      // The dashboard hook keeps the dialog open and surfaces the repository error in a toast.
    }
  };

  const actionButtons = (provider: Provider) => <div className="flex flex-wrap justify-end gap-2">
    <Button variant="ghost" className="!px-3" icon={<Eye className="h-4 w-4" />} onClick={() => setViewing(provider)}>View</Button>
    {provider.status === 'PENDING_APPROVAL' && <Button className="!px-3" icon={<Check className="h-4 w-4" />} disabled={Boolean(updatingId)} onClick={() => setPendingAction({ provider, status: 'APPROVED' })}>Approve</Button>}
    {provider.status === 'APPROVED' && <Button variant="ghost" className="!px-3 !text-danger hover:!bg-red-50" icon={<Ban className="h-4 w-4" />} disabled={Boolean(updatingId)} onClick={() => setPendingAction({ provider, status: 'BLOCKED' })}>Block</Button>}
    {provider.status === 'BLOCKED' && <Button variant="secondary" className="!px-3" icon={<RotateCcw className="h-4 w-4" />} disabled={Boolean(updatingId)} onClick={() => setPendingAction({ provider, status: 'APPROVED' })}>Unblock</Button>}
  </div>;

  return <section id="providers" className="scroll-mt-28 rounded-xl border border-border bg-surface shadow-card">
    <header className="border-b border-border p-5 sm:p-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">Marketplace partners</p><h2 className="mt-1 text-xl font-semibold text-heading sm:text-2xl">Provider management</h2><p className="mt-1 text-sm text-muted">Approve applications, review businesses, and protect marketplace trust.</p></div><p className="text-sm font-medium text-muted">{filteredProviders.length} of {providers.length} providers</p></div>
      <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-[minmax(0,1fr)_210px_210px]">
        <Input label="Search providers" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Business, email, district, or provider ID" autoComplete="off" />
        <Select label="Approval status" value={status} onChange={(event) => setStatus(event.target.value as 'ALL' | ProviderStatus)}><option value="ALL">All statuses</option><option value="PENDING_APPROVAL">Pending approval</option><option value="APPROVED">Approved</option><option value="BLOCKED">Blocked</option></Select>
        <Select label="Provider type" value={type} onChange={(event) => setType(event.target.value as 'ALL' | ProviderType)}><option value="ALL">All provider types</option><option value="HOME_PRODUCT">Home food</option><option value="GENERAL_SERVICE">General service</option></Select>
      </div>
    </header>
    {!filteredProviders.length ? <EmptyState title="No providers found" description="Try changing the search term, provider type, or approval status." action={<Button variant="outline" icon={<SlidersHorizontal className="h-4 w-4" />} onClick={resetFilters}>Clear filters</Button>} /> : <div className="p-3 sm:p-5">
      <div className="hidden overflow-x-auto rounded-xl border border-border xl:block" data-testid="admin-provider-table"><table className="w-full min-w-[1020px] text-left text-sm"><thead className="h-12 bg-page text-xs font-semibold uppercase tracking-wide text-muted"><tr><th className="px-4">Provider</th><th className="px-4">Type</th><th className="px-4">District</th><th className="px-4">Status</th><th className="px-4">Availability</th><th className="px-4">Applied</th><th className="px-4 text-right">Actions</th></tr></thead><tbody className="divide-y divide-border">{filteredProviders.map((provider) => <tr key={provider.providerId} className="hover:bg-page/70"><td className="px-4 py-4"><p className="font-semibold text-heading">{provider.businessName}</p><p className="mt-0.5 text-xs text-muted">{provider.email}</p></td><td className="px-4 py-4 text-body">{providerTypeName(provider.providerType)}</td><td className="px-4 py-4 text-body">{provider.district}</td><td className="px-4 py-4"><StatusBadge status={provider.status} /></td><td className="px-4 py-4"><span className={`inline-flex items-center gap-1.5 text-sm font-medium ${provider.isOnline ? 'text-success' : 'text-muted'}`}><span className={`h-2 w-2 rounded-full ${provider.isOnline ? 'bg-success' : 'bg-border-strong'}`} />{provider.isOnline ? 'Online' : 'Offline'}</span></td><td className="whitespace-nowrap px-4 py-4 text-muted">{formatAdminDate(provider.createdAt)}</td><td className="px-4 py-4">{actionButtons(provider)}</td></tr>)}</tbody></table></div>
      <div className="grid gap-3 sm:grid-cols-2 xl:hidden" data-testid="admin-provider-cards">{filteredProviders.map((provider) => <article key={provider.providerId} className="rounded-xl border border-border p-4"><div className="flex items-start justify-between gap-3"><div className="min-w-0"><p className="truncate font-semibold text-heading">{provider.businessName}</p><p className="mt-0.5 truncate text-sm text-muted">{provider.email}</p></div><StatusBadge status={provider.status} /></div><dl className="mt-4 grid grid-cols-2 gap-3 border-y border-border py-3 text-sm"><div><dt className="text-xs text-muted">Type</dt><dd className="mt-0.5 font-medium text-heading">{providerTypeName(provider.providerType)}</dd></div><div><dt className="text-xs text-muted">District</dt><dd className="mt-0.5 font-medium text-heading">{provider.district}</dd></div><div><dt className="text-xs text-muted">Availability</dt><dd className={`mt-0.5 font-medium ${provider.isOnline ? 'text-success' : 'text-muted'}`}>{provider.isOnline ? 'Online' : 'Offline'}</dd></div><div><dt className="text-xs text-muted">Applied</dt><dd className="mt-0.5 font-medium text-heading">{formatAdminDate(provider.createdAt)}</dd></div></dl><div className="mt-3">{actionButtons(provider)}</div></article>)}</div>
    </div>}
    <ConfirmDialog open={Boolean(pendingAction)} onClose={() => setPendingAction(null)} onConfirm={() => void confirmAction()} loading={Boolean(pendingAction && updatingId === pendingAction.provider.providerId)} danger={pendingAction?.status === 'BLOCKED'} title={pendingAction?.status === 'BLOCKED' ? 'Block this provider?' : pendingAction?.provider.status === 'PENDING_APPROVAL' ? 'Approve this provider?' : 'Restore this provider?'} message={pendingAction?.status === 'BLOCKED' ? `${pendingAction.provider.businessName} will be taken offline and its listings will be hidden from customers.` : `${pendingAction?.provider.businessName ?? 'This provider'} will be approved to publish available listings on Jisr.`} confirmLabel={pendingAction?.status === 'BLOCKED' ? 'Block provider' : pendingAction?.provider.status === 'PENDING_APPROVAL' ? 'Approve provider' : 'Restore provider'} />
    <Modal open={Boolean(viewing)} onClose={() => setViewing(null)} title="Provider details" description="Business profile and approval information">
      {viewing && <div><div className="rounded-xl bg-page p-4"><div className="flex items-start justify-between gap-3"><div><p className="font-semibold text-heading">{viewing.businessName}</p><p className="mt-0.5 text-sm text-muted">{viewing.providerId}</p></div><StatusBadge status={viewing.status} /></div></div><dl className="mt-5 grid gap-5 text-sm sm:grid-cols-2"><div><dt className="text-muted">Email</dt><dd className="mt-1 break-all font-medium text-heading">{viewing.email}</dd></div><div><dt className="text-muted">Phone</dt><dd className="mt-1 font-medium text-heading">{viewing.phone}</dd></div><div><dt className="text-muted">Provider type</dt><dd className="mt-1 font-medium text-heading">{providerTypeName(viewing.providerType)}</dd></div><div><dt className="text-muted">District</dt><dd className="mt-1 font-medium text-heading">{viewing.district}</dd></div><div><dt className="text-muted">Availability</dt><dd className={`mt-1 font-medium ${viewing.isOnline ? 'text-success' : 'text-muted'}`}>{viewing.isOnline ? 'Online' : 'Offline'}</dd></div><div><dt className="text-muted">Application date</dt><dd className="mt-1 font-medium text-heading">{formatAdminDate(viewing.createdAt)}</dd></div></dl></div>}
    </Modal>
  </section>;
}
