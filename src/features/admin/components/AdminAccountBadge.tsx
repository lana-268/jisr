import { CheckCircle2, CircleX } from 'lucide-react';
import type { CustomerAccountStatus } from '../types/admin';

export interface AdminAccountBadgeProps {
  status: CustomerAccountStatus;
}

export function AdminAccountBadge({ status }: AdminAccountBadgeProps) {
  const active = status === 'ACTIVE';
  const Icon = active ? CheckCircle2 : CircleX;
  return <span className={`inline-flex min-h-6 items-center gap-1 rounded-full px-2.5 text-xs font-semibold ${active ? 'bg-sage-soft text-success' : 'bg-red-50 text-danger'}`}><Icon className="h-3.5 w-3.5" aria-hidden="true" />{active ? 'Active' : 'Blocked'}</span>;
}
