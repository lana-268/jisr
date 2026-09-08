import { Bell, MapPin, Menu } from 'lucide-react';
import type { Provider } from '../../../types';
import { StatusBadge } from '../../../shared/components/StatusBadge';

export interface ProviderHeaderProps {
  provider: Provider;
  onMenu: () => void;
  onNotify: () => void;
  onProfile: () => void;
}

export const providerTypeLabel = (provider: Provider) => provider.providerType === 'HOME_PRODUCT' ? 'Home-Based Food Seller' : 'General Service Provider';

export function ProviderHeader({ provider, onMenu, onNotify, onProfile }: ProviderHeaderProps) {
  const initials = provider.businessName.split(' ').slice(0, 2).map((part) => part[0]).join('').toUpperCase();
  return <header className="sticky top-0 z-20 h-16 border-b border-border bg-surface lg:ml-60 lg:h-[72px]">
    <div className="mx-auto flex h-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
      <div className="flex min-w-0 items-center gap-3">
        <button type="button" aria-label="Open navigation" onClick={onMenu} className="icon-button shrink-0 lg:hidden"><Menu className="h-5 w-5"/></button>
        <div className="min-w-0"><p className="truncate text-sm font-semibold text-heading sm:text-base">{provider.businessName}</p><div className="mt-0.5 flex items-center gap-2 text-xs text-muted"><span className="hidden sm:inline">{providerTypeLabel(provider)}</span><span className="hidden sm:inline">·</span><span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3"/>{provider.district}</span></div></div>
      </div>
      <div className="flex items-center gap-1.5 sm:gap-3"><span className="hidden sm:inline-flex"><StatusBadge status={provider.status}/></span><button type="button" aria-label="Notifications" onClick={onNotify} className="icon-button relative"><Bell className="h-5 w-5"/><span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-primary ring-2 ring-white"/></button><button type="button" aria-label="Open profile" onClick={onProfile} className="flex h-11 w-11 items-center justify-center rounded-full bg-primary-soft text-sm font-bold text-primary ring-1 ring-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2">{initials}</button></div>
    </div>
  </header>;
}
