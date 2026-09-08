import { AlertCircle, ArrowRight, CheckCircle2, Headphones, ShieldCheck, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminHeader } from '../../features/admin/components/AdminHeader';
import { AdminNavigation } from '../../features/admin/components/AdminNavigation';
import type { AdminNavAction } from '../../features/admin/components/AdminNavigation';
import { AdminSummaryCards } from '../../features/admin/components/AdminSummaryCards';
import { CustomerManagement } from '../../features/admin/components/CustomerManagement';
import { OrderOversight } from '../../features/admin/components/OrderOversight';
import { ProviderManagement } from '../../features/admin/components/ProviderManagement';
import type { AdminRepository } from '../../features/admin/data/adminRepository';
import { useAdminDashboard } from '../../features/admin/hooks/useAdminDashboard';
import { formatAdminDate } from '../../features/admin/utils/adminDashboard';
import { Button } from '../../shared/components/Button';
import { ConfirmDialog, LoadingSkeleton, Toast } from '../../shared/components/Feedback';
import { Modal } from '../../shared/components/Modal';
import { Toggle } from '../../shared/components/Toggle';
import { clearDemoSession } from '../../shared/utils/demoSession';

export interface AdminDashboardProps {
  repository?: AdminRepository;
}

interface AdminSettingsPanelProps {
  onSaved: (message: string) => void;
  onClose: () => void;
}

function AdminSettingsPanel({ onSaved, onClose }: AdminSettingsPanelProps) {
  const [approvalAlerts, setApprovalAlerts] = useState(true);
  const [orderAlerts, setOrderAlerts] = useState(true);
  const [weeklyDigest, setWeeklyDigest] = useState(false);
  return <div className="space-y-3"><Toggle checked={approvalAlerts} onChange={setApprovalAlerts} label="Provider approval alerts" description="Notify me when a new provider applies." /><Toggle checked={orderAlerts} onChange={setOrderAlerts} label="Order risk alerts" description="Highlight cancellations and support escalations." /><Toggle checked={weeklyDigest} onChange={setWeeklyDigest} label="Weekly community digest" description="Receive a weekly summary of platform activity." /><div className="flex justify-end gap-3 pt-3"><Button variant="outline" onClick={onClose}>Cancel</Button><Button onClick={() => { onSaved('Admin preferences saved.'); onClose(); }}>Save preferences</Button></div></div>;
}

export function AdminDashboard({ repository }: AdminDashboardProps) {
  const dashboard = useAdminDashboard(repository);
  const navigate = useNavigate();
  const [activeNav, setActiveNav] = useState<AdminNavAction>('overview');
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [supportOpen, setSupportOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);

  if (dashboard.loading) return <LoadingSkeleton />;
  if (!dashboard.snapshot || !dashboard.statistics) return <main className="flex min-h-screen items-center justify-center bg-page px-4"><div className="w-full max-w-md rounded-xl border border-border bg-surface p-6 text-center shadow-card"><span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-danger"><AlertCircle className="h-6 w-6" /></span><h1 className="mt-4 text-xl font-bold text-heading">Admin dashboard unavailable</h1><p className="mt-2 text-sm text-muted">{dashboard.error ?? 'The dashboard could not be loaded.'}</p><Button className="mt-5 w-full" onClick={() => void dashboard.reload()}>Try again</Button></div></main>;

  const { profile, customers, providers, orders } = dashboard.snapshot;
  const scrollTo = (id: 'overview' | 'customers' | 'providers' | 'orders') => {
    setActiveNav(id);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };
  const onNavigation = (action: AdminNavAction) => {
    if (action === 'overview' || action === 'customers' || action === 'providers' || action === 'orders') scrollTo(action);
    else if (action === 'support') { setActiveNav(action); setSupportOpen(true); }
    else if (action === 'settings') { setActiveNav(action); setSettingsOpen(true); }
    else if (action === 'logout') setLogoutOpen(true);
  };

  const pendingProvider = providers.find((provider) => provider.status === 'PENDING_APPROVAL');

  return <div className="min-h-screen bg-page text-body">
    <AdminNavigation profile={profile} active={activeNav} onAction={onNavigation} />
    <AdminNavigation profile={profile} active={activeNav} onAction={onNavigation} mobile open={menuOpen} onClose={() => setMenuOpen(false)} />
    <AdminHeader profile={profile} onMenu={() => setMenuOpen(true)} onNotifications={() => dashboard.notify(`${dashboard.statistics?.pendingProviders ?? 0} provider applications are waiting for review.`)} onProfile={() => setProfileOpen(true)} />
    <main className="lg:ml-60">
      <div className="mx-auto max-w-7xl space-y-8 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <section id="overview" className="scroll-mt-28 grid gap-5 xl:grid-cols-[minmax(0,1fr)_390px] xl:items-end">
          <div><span className="inline-flex items-center gap-1.5 rounded-full bg-primary-soft px-3 py-1 text-xs font-semibold text-primary"><Sparkles className="h-3.5 w-3.5" aria-hidden="true" />Local trust, clearly managed</span><h1 className="mt-3 max-w-3xl text-[26px] font-bold leading-tight tracking-[-0.03em] text-heading sm:text-[32px]">Good morning, {profile.name}</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-muted sm:text-base">Here is what is happening across the Jisr community today. Review access, provider applications, and order activity from one calm workspace.</p></div>
          <div className="rounded-xl border border-border bg-surface p-4 shadow-card sm:p-5"><div className="flex items-start gap-3"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-warning"><ShieldCheck className="h-5 w-5" /></span><div><p className="font-semibold text-heading">Approval queue</p><p className="mt-0.5 text-sm text-muted">{dashboard.statistics.pendingProviders ? `${dashboard.statistics.pendingProviders} provider applications need a decision.` : 'All provider applications have been reviewed.'}</p></div></div><Button variant={dashboard.statistics.pendingProviders ? 'primary' : 'secondary'} className="mt-4 w-full" icon={dashboard.statistics.pendingProviders ? <ArrowRight className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />} onClick={() => scrollTo('providers')}>{dashboard.statistics.pendingProviders ? 'Review providers' : 'View providers'}</Button></div>
        </section>
        <AdminSummaryCards statistics={dashboard.statistics} />
        <CustomerManagement customers={customers} updatingId={dashboard.updatingId} onUpdateStatus={dashboard.updateCustomerStatus} />
        <ProviderManagement providers={providers} updatingId={dashboard.updatingId} onUpdateStatus={dashboard.updateProviderStatus} />
        <OrderOversight orders={orders} />
        <footer className="flex flex-col gap-3 border-t border-border pb-3 pt-6 text-sm text-muted sm:flex-row sm:items-center sm:justify-between"><p>© 2026 Jisr. Better neighbors, stronger communities.</p><p className="inline-flex items-center gap-1 font-medium text-success">Administered with local care <ShieldCheck className="h-4 w-4" /></p></footer>
      </div>
    </main>

    <Modal open={profileOpen} onClose={() => setProfileOpen(false)} title="Admin profile" description="Your Jisr administration identity">
      <div><div className="flex items-center gap-3 rounded-xl bg-page p-4"><span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-soft font-bold text-primary">{profile.name.split(' ').map((part) => part[0]).slice(0, 2).join('')}</span><div><p className="font-semibold text-heading">{profile.name}</p><p className="text-sm text-muted">{profile.role === 'SUPER_ADMIN' ? 'Super administrator' : 'Support administrator'}</p></div></div><dl className="mt-5 grid gap-5 text-sm sm:grid-cols-2"><div><dt className="text-muted">Admin ID</dt><dd className="mt-1 font-medium text-heading">{profile.adminId}</dd></div><div><dt className="text-muted">Email</dt><dd className="mt-1 break-all font-medium text-heading">{profile.email}</dd></div><div className="sm:col-span-2"><dt className="text-muted">Permissions</dt><dd className="mt-1 font-medium text-heading">Customer access, provider approvals, and platform oversight</dd></div></dl></div>
    </Modal>
    <Modal open={supportOpen} onClose={() => { setSupportOpen(false); setActiveNav('overview'); }} title="Support queue" description="Recent items that may need administrator attention" size="lg">
      <div className="space-y-3"><article className="flex flex-col gap-3 rounded-xl border border-border p-4 sm:flex-row sm:items-center"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-soft text-primary"><Headphones className="h-5 w-5" /></span><div className="flex-1"><p className="font-semibold text-heading">Provider application review</p><p className="mt-0.5 text-sm text-muted">{pendingProvider ? `${pendingProvider.businessName} applied on ${formatAdminDate(pendingProvider.createdAt)}.` : 'There are no pending applications.'}</p></div><Button variant="outline" onClick={() => { setSupportOpen(false); scrollTo('providers'); }}>Open reviews</Button></article><article className="flex flex-col gap-3 rounded-xl border border-border p-4 sm:flex-row sm:items-center"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-soft text-blue"><CheckCircle2 className="h-5 w-5" /></span><div className="flex-1"><p className="font-semibold text-heading">Order monitoring is clear</p><p className="mt-0.5 text-sm text-muted">No unresolved payment or safety escalation is present in this demo.</p></div><Button variant="ghost" onClick={() => { setSupportOpen(false); scrollTo('orders'); }}>View orders</Button></article></div>
    </Modal>
    <Modal open={settingsOpen} onClose={() => { setSettingsOpen(false); setActiveNav('overview'); }} title="Admin settings" description="Choose which operational updates you receive" size="lg"><AdminSettingsPanel onSaved={dashboard.notify} onClose={() => { setSettingsOpen(false); setActiveNav('overview'); }} /></Modal>
    <ConfirmDialog open={logoutOpen} onClose={() => setLogoutOpen(false)} title="Log out of Jisr admin?" message="You will return to the login page. Local demo data will remain available for the next session." confirmLabel="Log out" onConfirm={() => { clearDemoSession(); setLogoutOpen(false); navigate('/login', { replace: true }); }} />
    <Toast message={dashboard.toast?.message ?? null} tone={dashboard.toast?.tone} onClose={dashboard.clearToast} />
  </div>;
}
