import type { ProviderStatus, CustomerStatus } from '../../types';

type StatusVariant = ProviderStatus | CustomerStatus | 'OPEN' | 'CLOSED';

const styles: Record<string, string> = {
  APPROVED: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
  ACTIVE: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
  OPEN: 'bg-blue-50 text-blue-700 border border-blue-200',
  PENDING_APPROVAL: 'bg-amber-50 text-amber-700 border border-amber-200',
  BLOCKED: 'bg-red-50 text-red-700 border border-red-200',
  CLOSED: 'bg-slate-100 text-slate-600 border border-slate-200',
};

const labels: Record<string, string> = {
  APPROVED: 'Approved',
  ACTIVE: 'Active',
  OPEN: 'Open',
  PENDING_APPROVAL: 'Pending Approval',
  BLOCKED: 'Blocked',
  CLOSED: 'Closed',
};

const dots: Record<string, string> = {
  APPROVED: 'bg-emerald-500',
  ACTIVE: 'bg-emerald-500',
  OPEN: 'bg-blue-500',
  PENDING_APPROVAL: 'bg-amber-500',
  BLOCKED: 'bg-red-500',
  CLOSED: 'bg-slate-400',
};

interface StatusBadgeProps {
  status: StatusVariant;
  size?: 'sm' | 'md';
}

export function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  const cls = styles[status] ?? 'bg-slate-100 text-slate-600 border border-slate-200';
  const dot = dots[status] ?? 'bg-slate-400';
  const label = labels[status] ?? status;
  const padding = size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs';

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full font-medium ${padding} ${cls}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
      {label}
    </span>
  );
}
