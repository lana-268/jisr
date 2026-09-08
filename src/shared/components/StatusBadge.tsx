import { CheckCircle2, CircleX, Clock3, LoaderCircle } from 'lucide-react';
import type { OrderStatus, ProviderStatus } from '../../types';

export interface StatusBadgeProps { status: OrderStatus | ProviderStatus | 'AVAILABLE' | 'UNAVAILABLE' }
const config = {
  APPROVED: { label: 'Approved', classes: 'bg-sage-soft text-success', icon: CheckCircle2 },
  PENDING_APPROVAL: { label: 'Pending approval', classes: 'bg-amber-50 text-warning', icon: Clock3 },
  BLOCKED: { label: 'Blocked', classes: 'bg-red-50 text-danger', icon: CircleX },
  PENDING: { label: 'New request', classes: 'bg-amber-50 text-warning', icon: Clock3 },
  IN_PROGRESS: { label: 'In progress', classes: 'bg-blue-soft text-blue', icon: LoaderCircle },
  COMPLETED: { label: 'Completed', classes: 'bg-sage-soft text-success', icon: CheckCircle2 },
  CANCELLED: { label: 'Cancelled', classes: 'bg-red-50 text-danger', icon: CircleX },
  AVAILABLE: { label: 'Available', classes: 'bg-sage-soft text-success', icon: CheckCircle2 },
  UNAVAILABLE: { label: 'Unavailable', classes: 'bg-page text-muted', icon: CircleX },
};
export function StatusBadge({ status }: StatusBadgeProps) { const item = config[status]; const Icon = item.icon; return <span className={`inline-flex min-h-6 items-center gap-1 rounded-full px-2.5 text-xs font-semibold ${item.classes}`}><Icon className="h-3.5 w-3.5" aria-hidden="true" />{item.label}</span>; }
