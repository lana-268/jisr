import { ClipboardList, LayoutDashboard, LogOut, MessageCircle, Package, Settings, Store, UserRound, X } from 'lucide-react';
import { useEffect } from 'react';
import type { Provider } from '../../../types';
import { JisrBrand } from '../../../shared/components/JisrBrand';

export type NavAction = 'overview' | 'listings' | 'orders' | 'messages' | 'availability' | 'profile' | 'settings' | 'logout';

export interface ProviderSidebarProps {
  provider: Provider;
  mobile?: boolean;
  open?: boolean;
  onClose?: () => void;
  onAction: (action: NavAction) => void;
}

export function Brand() { return <JisrBrand to="/"/>; }

export function ProviderSidebar({ provider, mobile = false, open = true, onClose, onAction }: ProviderSidebarProps) {
  const itemLabel = provider.providerType === 'HOME_PRODUCT' ? 'Products' : 'Services';
  const items: { label: string; action: NavAction; icon: typeof LayoutDashboard }[] = [
    { label: 'Overview', action: 'overview', icon: LayoutDashboard },
    { label: itemLabel, action: 'listings', icon: Package },
    { label: 'Orders', action: 'orders', icon: ClipboardList },
    { label: 'Messages', action: 'messages', icon: MessageCircle },
    { label: 'Availability', action: 'availability', icon: Store },
    { label: 'Profile', action: 'profile', icon: UserRound },
    { label: 'Settings', action: 'settings', icon: Settings },
  ];

  useEffect(() => {
    if (!mobile || !open) return;
    const previous = document.body.style.overflow;
    const closeOnEscape = (event: KeyboardEvent) => { if (event.key === 'Escape') onClose?.(); };
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', closeOnEscape);
    return () => { document.body.style.overflow = previous; document.removeEventListener('keydown', closeOnEscape); };
  }, [mobile, onClose, open]);

  const select = (action: NavAction) => { onAction(action); onClose?.(); };
  const content = <aside role={mobile ? 'dialog' : undefined} aria-modal={mobile || undefined} aria-label={mobile ? 'Provider navigation' : undefined} className={`flex h-full flex-col border-r border-border bg-surface ${mobile ? 'w-[min(330px,88vw)] shadow-popover' : 'w-60'}`}>
    <div className="flex h-16 items-center justify-between border-b border-border px-5 lg:h-[72px] lg:px-6"><Brand/>{mobile && <button type="button" aria-label="Close navigation" onClick={onClose} className="icon-button"><X className="h-5 w-5"/></button>}</div>
    <nav aria-label="Provider dashboard" className="flex-1 space-y-1 overflow-y-auto px-3 py-6">{items.map(({ label, action, icon: Icon }, index) => <button key={action} type="button" onClick={() => select(action)} className={`flex min-h-11 w-full items-center gap-3 rounded-lg px-3 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${index === 0 ? 'bg-primary-soft text-primary-hover' : 'text-body hover:bg-page hover:text-heading'}`}><Icon className="h-[18px] w-[18px]"/>{label}</button>)}</nav>
    <div className="border-t border-border p-3"><button type="button" onClick={() => select('logout')} className="flex min-h-11 w-full items-center gap-3 rounded-lg px-3 text-sm font-medium text-danger hover:bg-red-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-danger"><LogOut className="h-[18px] w-[18px]"/>Log out</button><div className="mt-3 rounded-xl bg-page p-3"><p className="truncate text-sm font-semibold text-heading">{provider.businessName}</p><p className="mt-0.5 text-xs text-muted">{provider.district}, İstanbul</p></div></div>
  </aside>;

  if (!mobile) return <div className="fixed inset-y-0 left-0 z-30 hidden lg:block">{content}</div>;
  if (!open) return null;
  return <div className="fixed inset-0 z-50 bg-heading/30 lg:hidden" onMouseDown={(event) => { if (event.currentTarget === event.target) onClose?.(); }}>{content}</div>;
}
