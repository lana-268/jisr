import { ClipboardList, Headphones, LayoutDashboard, LogOut, Settings, Store, UsersRound, X } from 'lucide-react';
import { useEffect } from 'react';
import { JisrBrand } from '../../../shared/components/JisrBrand';
import type { AdminProfile } from '../types/admin';

export type AdminNavAction = 'overview' | 'customers' | 'providers' | 'orders' | 'support' | 'settings' | 'logout';

export interface AdminNavigationProps {
  profile: AdminProfile;
  active: AdminNavAction;
  onAction: (action: AdminNavAction) => void;
  mobile?: boolean;
  open?: boolean;
  onClose?: () => void;
}

const navigationItems: { label: string; action: AdminNavAction; icon: typeof LayoutDashboard }[] = [
  { label: 'Overview', action: 'overview', icon: LayoutDashboard },
  { label: 'Customers', action: 'customers', icon: UsersRound },
  { label: 'Providers', action: 'providers', icon: Store },
  { label: 'Orders', action: 'orders', icon: ClipboardList },
  { label: 'Support', action: 'support', icon: Headphones },
  { label: 'Settings', action: 'settings', icon: Settings },
];

export function AdminNavigation({ profile, active, onAction, mobile = false, open = true, onClose }: AdminNavigationProps) {
  useEffect(() => {
    if (!mobile || !open) return;
    const previousOverflow = document.body.style.overflow;
    const onKeyDown = (event: KeyboardEvent) => { if (event.key === 'Escape') onClose?.(); };
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [mobile, onClose, open]);

  const select = (action: AdminNavAction) => {
    onAction(action);
    onClose?.();
  };

  const content = <aside role={mobile ? 'dialog' : undefined} aria-modal={mobile || undefined} aria-label={mobile ? 'Admin navigation' : undefined} className={`flex h-full flex-col border-r border-border bg-surface ${mobile ? 'w-[min(330px,88vw)] shadow-popover' : 'w-60'}`}>
    <div className="flex h-16 items-center justify-between border-b border-border px-5 lg:h-[72px] lg:px-6">
      <JisrBrand to="/" />
      {mobile && <button type="button" aria-label="Close navigation" onClick={onClose} className="icon-button"><X className="h-5 w-5" /></button>}
    </div>
    <div className="mx-3 mt-5 rounded-xl border border-primary/10 bg-primary-soft p-3">
      <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-primary">Admin workspace</p>
      <p className="mt-1 truncate text-sm font-semibold text-heading">{profile.name}</p>
      <p className="text-xs text-muted">{profile.role === 'SUPER_ADMIN' ? 'Super administrator' : 'Support administrator'}</p>
    </div>
    <nav aria-label="Admin dashboard" className="flex-1 space-y-1 overflow-y-auto px-3 py-5">
      {navigationItems.map(({ label, action, icon: Icon }) => <button key={action} type="button" onClick={() => select(action)} aria-current={active === action ? 'page' : undefined} className={`flex min-h-11 w-full items-center gap-3 rounded-lg px-3 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${active === action ? 'bg-primary-soft text-primary-hover' : 'text-body hover:bg-page hover:text-heading'}`}><Icon className="h-[18px] w-[18px]" aria-hidden="true" />{label}</button>)}
    </nav>
    <div className="border-t border-border p-3">
      <button type="button" onClick={() => select('logout')} className="flex min-h-11 w-full items-center gap-3 rounded-lg px-3 text-sm font-medium text-danger transition-colors hover:bg-red-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-danger"><LogOut className="h-[18px] w-[18px]" aria-hidden="true" />Log out</button>
      <p className="mt-3 px-3 text-xs leading-5 text-muted">Secure administration · Local demo</p>
    </div>
  </aside>;

  if (!mobile) return <div className="fixed inset-y-0 left-0 z-30 hidden lg:block">{content}</div>;
  if (!open) return null;
  return <div className="fixed inset-0 z-50 bg-heading/30 lg:hidden" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose?.(); }}>{content}</div>;
}
