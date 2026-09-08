import { Facebook, Heart, HelpCircle, Instagram, LogOut, Menu, ShoppingBag, UserRound, X } from 'lucide-react';
import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { buttonStyles } from '../components/Button';
import { ConfirmDialog } from '../components/Feedback';

export function PublicBrand() {
  return <Link to="/" className="flex min-h-11 items-center gap-2.5 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-sage-soft text-success"><svg viewBox="0 0 32 32" className="h-6 w-6 fill-current" aria-hidden="true"><path d="M15.3 27.2c-1.4-7.7 1.2-14.4 8-20.2 1.4 7.4-1.1 14.2-8 20.2ZM13.5 24.1C7.1 21.7 4 16.6 4.2 8.7c6.8 2.8 9.9 7.9 9.3 15.4Z"/></svg></span>
    <span className="text-xl font-bold tracking-tight text-heading">Jisr</span>
  </Link>;
}

export interface PublicHeaderProps { mode?: 'landing' | 'catalog'; onHelp: () => void; onFavorites?: () => void }
export function PublicHeader({ mode = 'landing', onHelp, onFavorites }: PublicHeaderProps) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);
  const close = () => setOpen(false);
  const logout = () => { sessionStorage.removeItem('jisr-demo-session'); setLogoutOpen(false); setProfileOpen(false); close(); navigate('/login', { replace: true }); };
  const linkClass = ({ isActive }: { isActive: boolean }) => `flex min-h-11 items-center rounded-lg px-3 text-sm font-medium transition-colors hover:bg-page focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${isActive ? 'text-primary' : 'text-body'}`;
  const accountLinks = <>
    <Link onClick={close} to="/orders" className="flex min-h-11 items-center gap-2 rounded-lg px-3 text-sm hover:bg-page"><ShoppingBag className="h-4 w-4"/>My requests</Link>
    <button onClick={() => { close(); onFavorites?.(); }} className="flex min-h-11 w-full items-center gap-2 rounded-lg px-3 text-sm hover:bg-page"><Heart className="h-4 w-4"/>My favorites</button>
    <button onClick={() => { close(); onHelp(); }} className="flex min-h-11 w-full items-center gap-2 rounded-lg px-3 text-sm hover:bg-page"><HelpCircle className="h-4 w-4"/>Get help</button>
    <button onClick={() => setLogoutOpen(true)} className="flex min-h-11 w-full items-center gap-2 rounded-lg px-3 text-sm text-danger hover:bg-red-50"><LogOut className="h-4 w-4"/>Log out</button>
  </>;
  return <>
    <header className="sticky top-0 z-40 border-b border-border bg-surface/95 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:h-[72px] lg:px-8">
        <PublicBrand/>
        <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
          <NavLink to="/" className={linkClass}>Home</NavLink><NavLink to="/user" className={linkClass}>Explore</NavLink>
          {mode === 'landing' ? <button onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })} className="min-h-11 rounded-lg px-3 text-sm font-medium hover:bg-page focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">How It Works</button> : <NavLink to="/orders" className={linkClass}>Orders</NavLink>}
          <button onClick={onHelp} className="min-h-11 rounded-lg px-3 text-sm font-medium hover:bg-page focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">Help</button>
        </nav>
        <div className="hidden items-center gap-2 md:flex">
          {mode === 'catalog' ? <><button aria-label="Show favorites" onClick={onFavorites} className="flex h-11 w-11 items-center justify-center rounded-lg text-body hover:bg-page focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"><Heart className="h-5 w-5"/></button><div className="relative"><button aria-label="Open user menu" aria-expanded={profileOpen} onClick={() => setProfileOpen((value) => !value)} className="flex h-11 w-11 items-center justify-center rounded-full bg-primary-soft font-bold text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"><UserRound className="h-5 w-5"/></button>{profileOpen && <div className="absolute end-0 top-12 w-52 rounded-xl border border-border bg-surface p-2 shadow-lg"><p className="px-3 py-2 text-xs font-medium text-muted">Customer account</p>{accountLinks}</div>}</div></> : <><Link to="/login" className={buttonStyles('ghost')}>Log In</Link><Link to="/register" className={buttonStyles('primary')}>Join Jisr</Link></>}
        </div>
        <button onClick={() => setOpen(true)} aria-label="Open navigation" aria-expanded={open} className="flex h-11 w-11 items-center justify-center rounded-lg hover:bg-page focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary md:hidden"><Menu className="h-5 w-5"/></button>
      </div>
      {open && <div className="fixed inset-0 z-50 min-h-[100dvh] bg-heading/30 md:hidden" onMouseDown={(event) => { if (event.target === event.currentTarget) close(); }}><aside aria-label="Mobile navigation" className="ms-auto flex h-[100dvh] w-[min(310px,86vw)] flex-col overflow-y-auto bg-surface p-4 shadow-xl"><div className="flex items-center justify-between"><PublicBrand/><button onClick={close} aria-label="Close navigation" className="flex h-11 w-11 items-center justify-center rounded-lg hover:bg-page"><X className="h-5 w-5"/></button></div><nav className="mt-7 space-y-1"><Link onClick={close} to="/" className="flex min-h-12 items-center rounded-lg px-3 font-medium hover:bg-page">Home</Link><Link onClick={close} to="/user" className="flex min-h-12 items-center rounded-lg px-3 font-medium hover:bg-page">Explore</Link>{mode === 'catalog' && <Link onClick={close} to="/orders" className="flex min-h-12 items-center rounded-lg px-3 font-medium hover:bg-page">Orders</Link>}<button onClick={() => { close(); onHelp(); }} className="flex min-h-12 w-full items-center rounded-lg px-3 font-medium hover:bg-page">Help</button></nav><div className="mt-auto grid gap-1 pt-8">{mode === 'catalog' ? accountLinks : <><Link onClick={close} to="/login" className={buttonStyles('outline', 'w-full')}>Log In</Link><Link onClick={close} to="/register" className={buttonStyles('primary', 'w-full')}>Join Jisr</Link></>}</div></aside></div>}
    </header>
    <ConfirmDialog open={logoutOpen} onClose={() => setLogoutOpen(false)} onConfirm={logout} title="Log out of Jisr?" message="You’ll return to the login page. Your locally saved favorites and demo requests will stay on this device." confirmLabel="Log out"/>
  </>;
}

export function SiteFooter() {
  const links = [['About','/about'],['Careers','/careers'],['Trust & Safety','/trust'],['Terms','/terms'],['Privacy','/privacy']];
  return <footer id="help" className="border-t border-border bg-surface"><div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-[1fr_auto] lg:px-8"><div><PublicBrand/><p className="mt-3 max-w-sm text-sm text-muted">Good people, closer neighborhoods. Discover trusted local food and everyday help across Istanbul.</p></div><nav aria-label="Footer" className="flex flex-wrap gap-x-2 text-sm">{links.map(([label,to]) => <Link key={to} to={to} className="inline-flex min-h-11 items-center rounded-lg px-2 hover:bg-page hover:text-primary">{label}</Link>)}<a href="mailto:hello@jisr.example" className="inline-flex min-h-11 items-center rounded-lg px-2 hover:bg-page hover:text-primary">Help</a></nav><div className="border-t border-border pt-5 text-xs text-muted md:col-span-2 md:flex md:items-center md:justify-between"><p>© {new Date().getFullYear()} Jisr. Built for Istanbul neighborhoods.</p><div className="mt-3 flex gap-2 md:mt-0"><a aria-label="Jisr on Instagram" href="https://instagram.com" target="_blank" rel="noreferrer" className="flex h-11 w-11 items-center justify-center rounded-lg hover:bg-page"><Instagram className="h-4 w-4"/></a><a aria-label="Jisr on Facebook" href="https://facebook.com" target="_blank" rel="noreferrer" className="flex h-11 w-11 items-center justify-center rounded-lg hover:bg-page"><Facebook className="h-4 w-4"/></a></div></div></div></footer>;
}
