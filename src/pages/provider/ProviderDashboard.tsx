import { AlertCircle, ArrowRight, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { NavAction } from '../../features/provider/components/ProviderNavigation';
import { ProviderHeader } from '../../features/provider/components/ProviderHeader';
import { ProviderProfileCard } from '../../features/provider/components/ProviderProfileCard';
import { ListingSection } from '../../features/provider/components/ListingSection';
import { ProviderOrders } from '../../features/provider/components/ProviderOrders';
import { ProviderMessages } from '../../features/provider/components/ProviderMessages';
import { ProviderSidebar } from '../../features/provider/components/ProviderNavigation';
import { ProviderSettings } from '../../features/provider/components/ProviderSettings';
import { ProviderStatusToggle } from '../../features/provider/components/ProviderStatusToggle';
import { ProviderSummaryCards } from '../../features/provider/components/ProviderSummaryCards';
import { ProviderTypePreview } from '../../features/provider/components/ProviderTypePreview';
import { useProviderDashboard } from '../../features/provider/hooks/useProviderDashboard';
import { ConfirmDialog, LoadingSkeleton, Toast } from '../../shared/components/Feedback';
import { Modal } from '../../shared/components/Modal';
import { StatusBadge } from '../../shared/components/StatusBadge';
import { clearDemoSession } from '../../shared/utils/demoSession';

export function ProviderDashboard() {
  const dashboard = useProviderDashboard();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [messagesOpen, setMessagesOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  if (dashboard.loading || !dashboard.provider) return <LoadingSkeleton/>;
  const provider = dashboard.provider;
  const scroll = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  const navAction = (action: NavAction) => {
    if (action === 'overview') scroll('overview');
    else if (action === 'listings') scroll('listings');
    else if (action === 'orders') scroll('orders');
    else if (action === 'availability') { scroll('availability'); window.setTimeout(() => document.getElementById('availability')?.focus(), 400); }
    else if (action === 'messages') setMessagesOpen(true);
    else if (action === 'settings') setSettingsOpen(true);
    else if (action === 'profile') setProfileOpen(true);
    else if (action === 'logout') setLogoutOpen(true);
  };
  return <div className="min-h-screen bg-page text-body">
    <ProviderSidebar provider={provider} onAction={navAction}/><ProviderSidebar provider={provider} mobile open={menuOpen} onClose={() => setMenuOpen(false)} onAction={navAction}/>
    <ProviderHeader provider={provider} onMenu={() => setMenuOpen(true)} onNotify={() => dashboard.notify('You’re all caught up!')} onProfile={() => setProfileOpen(true)}/>
    <main className="lg:ml-60"><div className="mx-auto max-w-7xl space-y-8 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <ProviderTypePreview providers={dashboard.providers} selectedId={provider.providerId} disabled={dashboard.updating} onChange={(id) => void dashboard.switchProvider(id)}/>
      <section id="overview" className="scroll-mt-28 grid gap-5 xl:grid-cols-[1fr_390px] xl:items-end"><div><div className="mb-3 flex items-center gap-2"><span className="inline-flex items-center gap-1.5 rounded-full bg-primary-soft px-3 py-1 text-xs font-semibold text-primary"><Sparkles className="h-3.5 w-3.5"/>Your neighborhood business</span><span className="sm:hidden"><StatusBadge status={provider.status}/></span></div><h1 className="max-w-3xl text-[26px] font-bold leading-tight tracking-[-0.03em] text-heading sm:text-[32px]">Good morning, {provider.businessName}</h1><p className="mt-2 text-sm leading-6 text-muted sm:text-base">Here’s what’s happening with your business today. Stay on top of requests, listings, and customer updates.</p></div><ProviderStatusToggle provider={provider} updating={dashboard.updating} onChange={(checked) => void dashboard.updateOnline(checked)}/></section>
      {provider.status !== 'APPROVED' && <div className={`flex gap-3 rounded-xl border p-4 ${provider.status === 'BLOCKED' ? 'border-red-200 bg-red-50 text-danger' : 'border-amber-200 bg-amber-50 text-warning'}`}><AlertCircle className="mt-0.5 h-5 w-5 shrink-0"/><div><p className="font-semibold">{provider.status === 'BLOCKED' ? 'Your account is blocked' : 'Approval is still pending'}</p><p className="mt-1 text-sm">Your listings remain hidden until an administrator approves your provider account.</p></div></div>}
      <ProviderSummaryCards statistics={dashboard.statistics}/>
      <ListingSection kind={provider.providerType === 'HOME_PRODUCT' ? 'product' : 'service'} items={provider.providerType === 'HOME_PRODUCT' ? dashboard.products : dashboard.services} providerId={provider.providerId} saving={dashboard.updating} onSaveProduct={dashboard.saveProduct} onSaveService={dashboard.saveService} onPatchProduct={dashboard.patchProduct} onPatchService={dashboard.patchService} onDeleteProduct={dashboard.deleteProduct} onDeleteService={dashboard.deleteService} onViewRequests={() => scroll('orders')}/>
      <ProviderOrders orders={dashboard.orders} updating={dashboard.updating} onUpdate={dashboard.updateOrder}/>
      <footer className="flex flex-col gap-3 border-t border-border pb-3 pt-6 text-sm text-muted sm:flex-row sm:items-center sm:justify-between"><p>© 2026 Jisr. Better neighbors, stronger communities.</p><p className="inline-flex items-center gap-1 font-medium text-success">Built for local trust <ArrowRight className="h-4 w-4"/></p></footer>
    </div></main>
    <Modal open={profileOpen} onClose={() => setProfileOpen(false)} title="Provider profile" description="Information shown for your local business"><ProviderProfileCard key={provider.providerId} provider={provider} saving={dashboard.updating} onSave={dashboard.updateProfile} onClose={() => setProfileOpen(false)}/></Modal>
    <Modal open={messagesOpen} onClose={() => setMessagesOpen(false)} title="Messages" description="Chat with customers about active orders" size="lg"><ProviderMessages provider={provider} onMessageSent={dashboard.notify}/></Modal>
    <Modal open={settingsOpen} onClose={() => setSettingsOpen(false)} title="Settings" description={`Preferences for ${provider.businessName}`} size="lg"><ProviderSettings key={provider.providerId} provider={provider} onSaved={dashboard.notify}/></Modal>
    <ConfirmDialog open={logoutOpen} onClose={() => setLogoutOpen(false)} title="Log out of Jisr?" message="You’ll return to the login page. Local demo data will remain available when you come back." confirmLabel="Log out" onConfirm={() => { clearDemoSession(); setLogoutOpen(false); navigate('/login', { replace: true }); }}/>
    <Toast message={dashboard.toast?.message ?? null} tone={dashboard.toast?.tone} onClose={dashboard.clearToast}/>
  </div>;
}
