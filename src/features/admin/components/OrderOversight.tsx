import { Eye, SlidersHorizontal } from 'lucide-react';
import { useMemo, useState } from 'react';
import type { OrderStatus } from '../../../types';
import { Button } from '../../../shared/components/Button';
import { EmptyState } from '../../../shared/components/Feedback';
import { Input, Select } from '../../../shared/components/FormControls';
import { Modal } from '../../../shared/components/Modal';
import { StatusBadge } from '../../../shared/components/StatusBadge';
import type { AdminOrder } from '../types/admin';
import { filterAdminOrders, formatAdminCurrency, formatAdminDate } from '../utils/adminDashboard';

export interface OrderOversightProps {
  orders: AdminOrder[];
}

export function OrderOversight({ orders }: OrderOversightProps) {
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState<'ALL' | OrderStatus>('ALL');
  const [viewing, setViewing] = useState<AdminOrder | null>(null);
  const filteredOrders = useMemo(() => filterAdminOrders(orders, { query, status }), [orders, query, status]);
  const resetFilters = () => { setQuery(''); setStatus('ALL'); };
  const viewButton = (order: AdminOrder) => <Button variant="ghost" className="!px-3" icon={<Eye className="h-4 w-4" />} onClick={() => setViewing(order)}>View details</Button>;

  return <section id="orders" className="scroll-mt-28 rounded-xl border border-border bg-surface shadow-card">
    <header className="border-b border-border p-5 sm:p-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">Platform operations</p><h2 className="mt-1 text-xl font-semibold text-heading sm:text-2xl">Order oversight</h2><p className="mt-1 text-sm text-muted">Monitor requests across customers and providers without changing fulfillment progress.</p></div><p className="text-sm font-medium text-muted">{filteredOrders.length} of {orders.length} orders</p></div>
      <div className="mt-5 grid gap-3 md:grid-cols-[minmax(0,1fr)_220px]"><Input label="Search orders" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Order, customer, provider, or item" autoComplete="off" /><Select label="Order status" value={status} onChange={(event) => setStatus(event.target.value as 'ALL' | OrderStatus)}><option value="ALL">All statuses</option><option value="PENDING">New request</option><option value="IN_PROGRESS">In progress</option><option value="COMPLETED">Completed</option><option value="CANCELLED">Cancelled</option></Select></div>
    </header>
    {!filteredOrders.length ? <EmptyState title="No orders found" description="Try a different order reference, name, or status." action={<Button variant="outline" icon={<SlidersHorizontal className="h-4 w-4" />} onClick={resetFilters}>Clear filters</Button>} /> : <div className="p-3 sm:p-5">
      <div className="hidden overflow-x-auto rounded-xl border border-border xl:block" data-testid="admin-orders-table"><table className="w-full min-w-[1080px] text-left text-sm"><thead className="h-12 bg-page text-xs font-semibold uppercase tracking-wide text-muted"><tr><th className="px-4">Order</th><th className="px-4">Customer</th><th className="px-4">Provider</th><th className="px-4">Item / service</th><th className="px-4">Total</th><th className="px-4">Status</th><th className="px-4">Created</th><th className="px-4 text-right">Action</th></tr></thead><tbody className="divide-y divide-border">{filteredOrders.map((order) => <tr key={order.orderId} className="hover:bg-page/70"><td className="px-4 py-4 font-semibold text-heading">{order.orderId}</td><td className="px-4 py-4 text-body">{order.customerName}</td><td className="px-4 py-4 text-body">{order.providerName}</td><td className="px-4 py-4 text-body">{order.itemTitle}</td><td className="whitespace-nowrap px-4 py-4 font-semibold text-heading">{formatAdminCurrency(order.totalPrice)}</td><td className="px-4 py-4"><StatusBadge status={order.status} /></td><td className="whitespace-nowrap px-4 py-4 text-muted">{formatAdminDate(order.createdAt)}</td><td className="px-4 py-4 text-right">{viewButton(order)}</td></tr>)}</tbody></table></div>
      <div className="grid gap-3 sm:grid-cols-2 xl:hidden" data-testid="admin-order-cards">{filteredOrders.map((order) => <article key={order.orderId} className="rounded-xl border border-border p-4"><div className="flex items-start justify-between gap-3"><div><p className="text-xs font-semibold text-primary">{order.orderId}</p><h3 className="mt-1 font-semibold text-heading">{order.itemTitle}</h3></div><StatusBadge status={order.status} /></div><dl className="mt-4 space-y-2 border-y border-border py-3 text-sm"><div className="flex justify-between gap-3"><dt className="text-muted">Customer</dt><dd className="text-right font-medium text-heading">{order.customerName}</dd></div><div className="flex justify-between gap-3"><dt className="text-muted">Provider</dt><dd className="text-right font-medium text-heading">{order.providerName}</dd></div><div className="flex justify-between gap-3"><dt className="text-muted">Created</dt><dd className="font-medium text-heading">{formatAdminDate(order.createdAt)}</dd></div></dl><div className="mt-3 flex items-center justify-between gap-3"><p className="font-semibold text-heading">{formatAdminCurrency(order.totalPrice)}</p>{viewButton(order)}</div></article>)}</div>
    </div>}
    <Modal open={Boolean(viewing)} onClose={() => setViewing(null)} title="Order details" description="Read-only platform record">
      {viewing && <div><div className="flex items-center justify-between gap-3 rounded-xl bg-page p-4"><div><p className="text-xs font-semibold uppercase tracking-wide text-primary">Order reference</p><p className="mt-1 font-bold text-heading">{viewing.orderId}</p></div><StatusBadge status={viewing.status} /></div><dl className="mt-5 grid gap-5 text-sm sm:grid-cols-2"><div><dt className="text-muted">Customer</dt><dd className="mt-1 font-medium text-heading">{viewing.customerName}</dd></div><div><dt className="text-muted">Customer ID</dt><dd className="mt-1 font-medium text-heading">{viewing.customerId}</dd></div><div><dt className="text-muted">Provider</dt><dd className="mt-1 font-medium text-heading">{viewing.providerName}</dd></div><div><dt className="text-muted">Provider ID</dt><dd className="mt-1 font-medium text-heading">{viewing.providerId}</dd></div><div><dt className="text-muted">Item or service</dt><dd className="mt-1 font-medium text-heading">{viewing.itemTitle}</dd></div><div><dt className="text-muted">Total</dt><dd className="mt-1 font-medium text-heading">{formatAdminCurrency(viewing.totalPrice)}</dd></div><div className="sm:col-span-2"><dt className="text-muted">Created</dt><dd className="mt-1 font-medium text-heading">{formatAdminDate(viewing.createdAt)}</dd></div></dl></div>}
    </Modal>
  </section>;
}
