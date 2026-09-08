import { Facebook, Heart, HelpCircle, Instagram, LayoutDashboard, LogOut, Menu, MessageCircle, ShieldCheck, ShoppingBag, UserRound, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { buttonStyles } from '../components/Button';
import { ConfirmDialog } from '../components/Feedback';
import { JisrBrand } from '../components/JisrBrand';
import { clearDemoSession, getDemoSession } from '../utils/demoSession';

export function PublicBrand() {
  return <JisrBrand to="/"/>;
}

export interface PublicHeaderProps {
  mode?: 'landing' | 'catalog';
  onHelp: () => void;
  onFavorites?: () => void;
}

export function PublicHeader({ mode = 'landing', onHelp, onFavorites }: PublicHeaderProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const menuRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);
  const role = getDemoSession()?.role ?? null;

  const close = () => { setOpen(false); setProfileOpen(false); };
  const logout = () => { clearDemoSession(); setLogoutOpen(false); close(); navigate('/login', { replace: true }); };
  const openFavorites = () => { close(); if (onFavorites) onFavorites(); else navigate('/user?favorites=true'); };
  const openHelp = () => { close(); onHelp(); };

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = previous; };
  }, [open]);

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      if (open) setOpen(false);
      else setProfileOpen(false);
    };
    const handlePointer = (event: MouseEvent) => {
      if (profileOpen && menuRef.current && !menuRef.current.contains(event.target as Node)) setProfileOpen(false);
    };
    document.addEventListener('keydown', handleKey);
    document.addEventListener('mousedown', handlePointer);
    return () => { document.removeEventListener('keydown', handleKey); document.removeEventListener('mousedown', handlePointer); };
  }, [open, profileOpen]);

  const linkClass = ({ isActive }: { isActive: boolean }) => `relative flex min-h-11 items-center rounded-lg px-3 text-sm font-medium transition-colors hover:bg-page focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${isActive ? 'text-primary-hover after:absolute after:inset-x-3 after:bottom-0 after:h-0.5 after:rounded-full after:bg-primary' : 'text-body'}`;
  const accountLinks = <>
    {role === 'admin' ? <Link role="menuitem" onClick={close} to="/dashboard/admin" className="account-menu-item"><ShieldCheck className="h-4 w-4"/>Admin dashboard</Link> : role === 'provider' ? <Link role="menuitem" onClick={close} to="/dashboard/provider" className="account-menu-item"><LayoutDashboard className="h-4 w-4"/>Provider dashboard</Link> : <>
      <Link role="menuitem" onClick={close} to="/orders" className="account-menu-item"><ShoppingBag className="h-4 w-4"/>My requests</Link>
      <Link role="menuitem" onClick={close} to="/messages" className="account-menu-item"><MessageCircle className="h-4 w-4"/>Messages</Link>
      <button role="menuitem" onClick={openFavorites} className="account-menu-item w-full"><Heart className="h-4 w-4"/>My favorites</button>
    </>}
    <button role="menuitem" onClick={openHelp} className="account-menu-item w-full"><HelpCircle className="h-4 w-4"/>Get help</button>
    <button role="menuitem" onClick={() => { setProfileOpen(false); setLogoutOpen(true); }} className="account-menu-item w-full text-danger hover:bg-red-50"><LogOut className="h-4 w-4"/>Log out</button>
  </>;

  return <>
    <header className="sticky top-0 z-40 border-b border-border bg-surface">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:h-[72px] lg:px-8">
        <PublicBrand/>
        <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
          <NavLink to="/" className={linkClass}>Home</NavLink>
          <NavLink to="/user" className={linkClass}>Explore</NavLink>
          {mode === 'landing'
            ? location.pathname === '/'
              ? <button onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })} className="min-h-11 rounded-lg px-3 text-sm font-medium hover:bg-page focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">How It Works</button>
              : <Link to="/#how-it-works" className="flex min-h-11 items-center rounded-lg px-3 text-sm font-medium hover:bg-page focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">How It Works</Link>
            : <NavLink to="/orders" className={linkClass}>Requests</NavLink>}
          <button onClick={onHelp} className="min-h-11 rounded-lg px-3 text-sm font-medium hover:bg-page focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">Help</button>
        </nav>
        <div className="hidden items-center gap-2 md:flex">
          {role ? <>
            {role === 'customer' && <button aria-label="Show favorites" onClick={() => onFavorites ? onFavorites() : navigate('/user?favorites=true')} className="icon-button"><Heart className="h-5 w-5"/></button>}
            <div className="relative" ref={menuRef}>
              <button aria-label="Open user menu" aria-haspopup="menu" aria-expanded={profileOpen} onClick={() => setProfileOpen((value) => !value)} className="flex h-11 w-11 items-center justify-center rounded-full bg-primary-soft font-bold text-primary-hover ring-1 ring-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"><UserRound className="h-5 w-5"/></button>
              {profileOpen && <div role="menu" aria-label="Account menu" className="absolute end-0 top-12 w-56 rounded-xl border border-border bg-surface p-2 shadow-popover"><p className="px-3 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-muted">{role === 'admin' ? 'Admin account' : role === 'provider' ? 'Provider account' : 'Customer account'}</p>{accountLinks}</div>}
            </div>
          </> : <><Link to="/login" className={buttonStyles('ghost')}>Log In</Link><Link to="/register" className={buttonStyles('primary')}>Join Jisr</Link></>}
        </div>
        <button onClick={() => setOpen(true)} aria-label="Open navigation" aria-expanded={open} className="icon-button md:hidden"><Menu className="h-5 w-5"/></button>
      </div>
    </header>

    {open && <div className="fixed inset-0 z-50 min-h-[100dvh] bg-heading/30 md:hidden" onMouseDown={(event) => { if (event.target === event.currentTarget) close(); }}>
      <aside role="dialog" aria-modal="true" aria-label="Mobile navigation" className="ms-auto flex h-[100dvh] w-[min(330px,88vw)] flex-col overflow-y-auto border-s border-border bg-surface p-4 shadow-popover">
        <div className="flex items-center justify-between"><PublicBrand/><button onClick={close} aria-label="Close navigation" className="icon-button"><X className="h-5 w-5"/></button></div>
        <nav className="mt-7 space-y-1"><Link onClick={close} to="/" className="mobile-nav-item">Home</Link><Link onClick={close} to="/user" className="mobile-nav-item">Explore</Link>{role === 'customer' && <Link onClick={close} to="/orders" className="mobile-nav-item">Requests</Link>}<Link onClick={close} to="/#how-it-works" className="mobile-nav-item">How It Works</Link><button onClick={openHelp} className="mobile-nav-item w-full">Help</button></nav>
        <div role={role ? 'menu' : undefined} className="mt-auto grid gap-1 border-t border-border pt-5">{role ? <><p className="px-3 pb-1 text-xs font-semibold uppercase tracking-[0.12em] text-muted">{role === 'admin' ? 'Admin account' : role === 'provider' ? 'Provider account' : 'Customer account'}</p>{accountLinks}</> : <><Link onClick={close} to="/login" className={buttonStyles('outline', 'w-full')}>Log In</Link><Link onClick={close} to="/register" className={buttonStyles('primary', 'w-full')}>Join Jisr</Link></>}</div>
      </aside>
    </div>}

    <ConfirmDialog open={logoutOpen} onClose={() => setLogoutOpen(false)} onConfirm={logout} title="Log out of Jisr?" message="You’ll return to the login page. Your locally saved favorites and demo requests will stay on this device." confirmLabel="Log out"/>
  </>;
}

export function SiteFooter() {
  const links = [['About', '/about'], ['Careers', '/careers'], ['Trust & Safety', '/trust'], ['Terms', '/terms'], ['Privacy', '/privacy']];
  return <footer id="help" className="border-t border-border bg-surface"><div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-[1fr_auto] lg:px-8"><div><PublicBrand/><p className="mt-3 max-w-sm text-sm text-muted">Good people, closer neighborhoods. Discover trusted local food and everyday help across Istanbul.</p></div><nav aria-label="Footer" className="flex flex-wrap gap-x-2 text-sm">{links.map(([label, to]) => <Link key={to} to={to} className="inline-flex min-h-11 items-center rounded-lg px-2 hover:bg-page hover:text-primary-hover">{label}</Link>)}<a href="mailto:hello@jisr.example" className="inline-flex min-h-11 items-center rounded-lg px-2 hover:bg-page hover:text-primary-hover">Help</a></nav><div className="border-t border-border pt-5 text-xs text-muted md:col-span-2 md:flex md:items-center md:justify-between"><p>© {new Date().getFullYear()} Jisr. Built for Istanbul neighborhoods.</p><div className="mt-3 flex gap-2 md:mt-0"><a aria-label="Jisr on Instagram" href="https://instagram.com" target="_blank" rel="noreferrer" className="icon-button"><Instagram className="h-4 w-4"/></a><a aria-label="Jisr on Facebook" href="https://facebook.com" target="_blank" rel="noreferrer" className="icon-button"><Facebook className="h-4 w-4"/></a></div></div></div></footer>;
}
