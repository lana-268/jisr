import { Bell, Search, Menu } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { getInitials, formatAdminRole } from '../../utils/format';
import { usePendingProviders } from '../../hooks/usePendingProviders';

interface AdminHeaderProps {
  title: string;
  description?: string;
  onMenuClick: () => void;
}

export function AdminHeader({ title, description, onMenuClick }: AdminHeaderProps) {
  const { admin } = useAuth();
  const { providers: pending } = usePendingProviders();
  const badgeCount = pending.length;

  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200 px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4">
      {/* Left: Menu toggle + Title */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onMenuClick}
          className="lg:hidden shrink-0 w-9 h-9 rounded-xl border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Open navigation menu"
        >
          <Menu size={18} />
        </button>
        <div className="min-w-0">
          <h1 className="text-base font-bold text-slate-900 truncate">{title}</h1>
          {description && (
            <p className="text-xs text-slate-500 mt-0.5 hidden sm:block truncate">{description}</p>
          )}
        </div>
      </div>

      {/* Right: Search + Notifications + Profile */}
      <div className="flex items-center gap-2 shrink-0">
        {/* Search */}
        <div className="hidden md:flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-500">
          <Search size={15} className="text-slate-400" />
          <span className="hidden lg:inline text-xs">Search...</span>
        </div>

        {/* Notifications */}
        <button
          className="relative w-9 h-9 rounded-xl border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label={`${badgeCount} pending approvals`}
        >
          <Bell size={17} />
          {badgeCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center px-1">
              {badgeCount > 99 ? '99+' : badgeCount}
            </span>
          )}
        </button>

        {/* Admin Avatar */}
        <div className="flex items-center gap-2.5 pl-1">
          <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
            {getInitials(admin?.fullName ?? 'A')}
          </div>
          <div className="hidden sm:block">
            <p className="text-xs font-semibold text-slate-900 leading-tight">{admin?.fullName ?? 'Admin'}</p>
            <p className="text-[11px] text-slate-500">{formatAdminRole(admin?.role ?? '')}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
