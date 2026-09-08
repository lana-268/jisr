import { CheckCircle2, Clock3, Hourglass, WalletCards } from 'lucide-react';
import type { DashboardStatistics } from '../../../types';
import { formatCurrency } from '../utils/dashboard';

export interface DashboardStatCardProps {
  label: string;
  value: string | number;
  note: string;
  tone: 'primary' | 'sage' | 'blue' | 'warning';
  icon: React.ReactNode;
}

const tones = {
  primary: 'bg-primary-soft text-primary',
  sage: 'bg-sage-soft text-success',
  blue: 'bg-blue-soft text-blue',
  warning: 'bg-amber-50 text-warning',
};

export function DashboardStatCard({ label, value, note, tone, icon }: DashboardStatCardProps) {
  return <article className="min-h-28 rounded-xl border border-border bg-surface p-5 shadow-card">
    <div className="flex items-start justify-between gap-3"><div className="min-w-0"><p className="text-sm font-medium text-muted">{label}</p><p className="mt-2 break-words text-2xl font-bold leading-none tracking-tight text-heading sm:text-[28px]">{value}</p></div><span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${tones[tone]}`}>{icon}</span></div>
    <p className="mt-3 text-xs text-muted">{note}</p>
  </article>;
}

export interface ProviderSummaryCardsProps { statistics: DashboardStatistics }

export function ProviderSummaryCards({ statistics }: ProviderSummaryCardsProps) {
  return <div className="grid grid-cols-1 gap-3 min-[420px]:grid-cols-2 sm:gap-5 xl:grid-cols-4">
    <DashboardStatCard label="New Requests" value={statistics.pendingOrders} note="Waiting for your response" tone="primary" icon={<Clock3 className="h-5 w-5"/>}/>
    <DashboardStatCard label="In Progress" value={statistics.inProgressOrders} note="Currently being fulfilled" tone="blue" icon={<Hourglass className="h-5 w-5"/>}/>
    <DashboardStatCard label="Completed" value={statistics.completedOrders} note="Successfully delivered" tone="sage" icon={<CheckCircle2 className="h-5 w-5"/>}/>
    <DashboardStatCard label="Total Earnings" value={formatCurrency(statistics.totalEarnings)} note="From completed orders" tone="warning" icon={<WalletCards className="h-5 w-5"/>}/>
  </div>;
}
