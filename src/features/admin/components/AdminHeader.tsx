import { Bell, Menu, ShieldCheck } from 'lucide-react';
import type { AdminProfile } from '../types/admin';

export interface AdminHeaderProps {
  profile: AdminProfile;
  onMenu: () => void;
  onNotifications: () => void;
  onProfile: () => void;
}

export function AdminHeader({ profile, onMenu, onNotifications, onProfile }: AdminHeaderProps) {
  const initials = profile.name.split(' ').slice(0, 2).map((part) => part[0]).join('').toUpperCase();
  return <header className="sticky top-0 z-20 h-16 border-b border-border bg-surface lg:ml-60 lg:h-[72px]">
    <div className="mx-auto flex h-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
      <div className="flex min-w-0 items-center gap-3">
        <button type="button" aria-label="Open navigation" onClick={onMenu} className="icon-button shrink-0 lg:hidden"><Menu className="h-5 w-5" /></button>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-heading sm:text-base">Jisr administration</p>
          <p className="mt-0.5 hidden items-center gap-1 text-xs text-muted sm:flex"><ShieldCheck className="h-3.5 w-3.5 text-success" aria-hidden="true" />Community operations and account safety</p>
        </div>
      </div>
      <div className="flex items-center gap-1.5 sm:gap-3">
        <span className="hidden min-h-7 items-center rounded-full bg-sage-soft px-3 text-xs font-semibold text-success sm:inline-flex">{profile.role === 'SUPER_ADMIN' ? 'Super admin' : 'Support admin'}</span>
        <button type="button" aria-label="Open notifications" onClick={onNotifications} className="icon-button relative"><Bell className="h-5 w-5" /><span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-primary ring-2 ring-white" /></button>
        <button type="button" aria-label="Open admin profile" onClick={onProfile} className="flex h-11 w-11 items-center justify-center rounded-full bg-primary-soft text-sm font-bold text-primary ring-1 ring-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2">{initials}</button>
      </div>
    </div>
  </header>;
}
