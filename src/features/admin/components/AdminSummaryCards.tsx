import { ClipboardCheck, Store, UserRoundCheck, UsersRound } from 'lucide-react';
import { DashboardStatCard } from '../../provider/components/ProviderSummaryCards';
import type { AdminStatistics } from '../types/admin';

export interface AdminSummaryCardsProps {
  statistics: AdminStatistics;
}

export function AdminSummaryCards({ statistics }: AdminSummaryCardsProps) {
  return <section aria-label="Platform summary" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4 xl:gap-5">
    <DashboardStatCard label="Customers" value={statistics.totalCustomers} note="Registered community members" tone="primary" icon={<UsersRound className="h-5 w-5" />} />
    <DashboardStatCard label="Active providers" value={statistics.activeProviders} note="Approved marketplace partners" tone="sage" icon={<UserRoundCheck className="h-5 w-5" />} />
    <DashboardStatCard label="Pending approvals" value={statistics.pendingProviders} note="Waiting for admin review" tone="warning" icon={<Store className="h-5 w-5" />} />
    <DashboardStatCard label="Live orders" value={statistics.liveOrders} note="New or currently in progress" tone="blue" icon={<ClipboardCheck className="h-5 w-5" />} />
  </section>;
}
