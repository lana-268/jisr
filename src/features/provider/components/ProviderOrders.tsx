import { Check, Eye, Play, X } from 'lucide-react';
import { useState } from 'react';
import type { Order, OrderStatus } from '../../../types';
import { Button } from '../../../shared/components/Button';
import { ConfirmDialog, EmptyState } from '../../../shared/components/Feedback';
import { Modal } from '../../../shared/components/Modal';
import { StatusBadge } from '../../../shared/components/StatusBadge';
import { formatCurrency, formatDate } from '../utils/dashboard';

export interface ProviderOrdersProps {
  orders: Order[];
  updating: boolean;
  onUpdate: (orderId: string, status: OrderStatus) => Promise<void>;
}

type PendingAction = { order: Order; status: 'COMPLETED' | 'CANCELLED' } | null;

interface OrderActionsProps {
  order: Order;
  onStart: () => void;
  onConfirm: (status: 'COMPLETED' | 'CANCELLED') => void;
  onView: () => void;
}

function OrderActions({ order, onStart, onConfirm, onView }: OrderActionsProps) {
  if (order.status === 'PENDING') return <div className="flex flex-wrap justify-end gap-2"><Button className="!px-3" icon={<Play className="h-3.5 w-3.5"/>} onClick={onStart}>Start order</Button><Button variant="ghost" className="!px-3 !text-danger" icon={<X className="h-4 w-4"/>} onClick={() => onConfirm('CANCELLED')}>Cancel</Button></div>;
  if (order.status === 'IN_PROGRESS') return <div className="flex flex-wrap justify-end gap-2"><Button variant="secondary" className="!px-3" icon={<Check className="h-4 w-4"/>} onClick={() => onConfirm('COMPLETED')}>Mark completed</Button><Button variant="ghost" className="!px-3 !text-danger" onClick={() => onConfirm('CANCELLED')}>Cancel</Button></div>;
  return <Button variant="ghost" className="!px-3" icon={<Eye className="h-4 w-4"/>} onClick={onView}>View details</Button>;
}

export function ProviderOrders({ orders, updating, onUpdate }: ProviderOrdersProps) {
  const [pendingAction, setPendingAction] = useState<PendingAction>(null);
  const [viewing, setViewing] = useState<Order | null>(null);
  const update = async () => { if (!pendingAction) return; await onUpdate(pendingAction.order.orderId, pendingAction.status); setPendingAction(null); };
  const actions = (order: Order) => <OrderActions order={order} onStart={() => void onUpdate(order.orderId, 'IN_PROGRESS')} onConfirm={(status) => setPendingAction({ order, status })} onView={() => setViewing(order)}/>;

  return <section id="orders" className="scroll-mt-28 rounded-xl border border-border bg-surface shadow-card">
    <header className="border-b border-border p-5 sm:p-6"><p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">Stay on track</p><h2 className="mt-1 text-xl font-semibold text-heading sm:text-2xl">Incoming orders</h2><p className="mt-1 text-sm text-muted">Review requests and keep customers updated as work progresses.</p></header>
    {!orders.length ? <EmptyState title="No orders yet" description="New customer requests will appear here."/> : <div className="p-3 sm:p-5">
      <div className="hidden overflow-x-auto rounded-xl border border-border md:block" data-testid="desktop-orders-table">
        <table className="w-full min-w-[980px] text-left text-sm"><thead className="h-12 bg-page text-xs font-semibold uppercase tracking-wide text-muted"><tr><th className="px-4">Order</th><th className="px-4">Customer</th><th className="px-4">Item / service</th><th className="px-4">Total</th><th className="px-4">Status</th><th className="px-4">Date</th><th className="px-4 text-right">Actions</th></tr></thead><tbody className="divide-y divide-border">{orders.map((order) => <tr key={order.orderId} className="min-h-16"><td className="px-4 py-4 font-semibold text-heading">{order.orderId}</td><td className="px-4 py-4 text-body">{order.customerName}</td><td className="px-4 py-4 text-body">{order.itemTitle}</td><td className="whitespace-nowrap px-4 py-4 font-semibold text-heading">{formatCurrency(order.totalPrice)}</td><td className="px-4 py-4"><StatusBadge status={order.status}/></td><td className="whitespace-nowrap px-4 py-4 text-muted">{formatDate(order.createdAt)}</td><td className="px-4 py-4">{actions(order)}</td></tr>)}</tbody></table>
      </div>
      <div className="grid gap-3 md:hidden" data-testid="mobile-order-cards">{orders.map((order) => <article key={order.orderId} className="rounded-xl border border-border p-4"><div className="flex items-start justify-between gap-3"><div><p className="text-xs font-semibold text-primary">{order.orderId}</p><h3 className="mt-1 font-semibold text-heading">{order.itemTitle}</h3><p className="mt-0.5 text-sm text-muted">{order.customerName} · {formatDate(order.createdAt)}</p></div><StatusBadge status={order.status}/></div><div className="mt-4 flex flex-col gap-3 border-t border-border pt-3 min-[420px]:flex-row min-[420px]:items-center min-[420px]:justify-between"><p className="font-semibold text-heading">{formatCurrency(order.totalPrice)}</p>{actions(order)}</div></article>)}</div>
    </div>}
    <ConfirmDialog open={Boolean(pendingAction)} onClose={() => setPendingAction(null)} onConfirm={() => void update()} loading={updating} danger={pendingAction?.status === 'CANCELLED'} title={pendingAction?.status === 'COMPLETED' ? 'Complete this order?' : 'Cancel this order?'} message={pendingAction?.status === 'COMPLETED' ? `Confirm that ${pendingAction.order.itemTitle} for ${pendingAction.order.customerName} has been completed.` : `Cancel ${pendingAction?.order.orderId ?? 'this order'}? The customer will see it as cancelled.`} confirmLabel={pendingAction?.status === 'COMPLETED' ? 'Mark completed' : 'Cancel order'}/>
    <Modal open={Boolean(viewing)} onClose={() => setViewing(null)} title="Order details">{viewing && <dl className="grid grid-cols-2 gap-5 text-sm"><div><dt className="text-muted">Order</dt><dd className="mt-1 font-semibold text-heading">{viewing.orderId}</dd></div><div><dt className="text-muted">Status</dt><dd className="mt-1"><StatusBadge status={viewing.status}/></dd></div><div><dt className="text-muted">Customer</dt><dd className="mt-1 font-semibold text-heading">{viewing.customerName}</dd></div><div><dt className="text-muted">Total</dt><dd className="mt-1 font-semibold text-heading">{formatCurrency(viewing.totalPrice)}</dd></div><div className="col-span-2"><dt className="text-muted">Item or service</dt><dd className="mt-1 font-semibold text-heading">{viewing.itemTitle}</dd></div></dl>}</Modal>
  </section>;
}
