import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Clock,
  MessageSquare,
  UserCog,
  LogOut,
  X,
  Building2,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { getInitials, formatAdminRole } from '../../utils/format';
import type { AdminType } from '../../types';

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  path: string;
  roles: AdminType[];
}

const navItems: NavItem[] = [
  { id: 'overview', label: 'Overview', icon: <LayoutDashboard size={18} />, path: 'overview', roles: ['SUPER_ADMIN', 'SUPPORT_ADMIN'] },
  { id: 'providers', label: 'Providers', icon: <Building2 size={18} />, path: 'providers', roles: ['SUPER_ADMIN'] },
  { id: 'pending', label: 'Pending Approvals', icon: <Clock size={18} />, path: 'pending', roles: ['SUPER_ADMIN', 'SUPPORT_ADMIN'] },
  { id: 'customers', label: 'Customers', icon: <Users size={18} />, path: 'customers', roles: ['SUPER_ADMIN'] },
  { id: 'chats', label: 'Support Chats', icon: <MessageSquare size={18} />, path: 'chats', roles: ['SUPER_ADMIN', 'SUPPORT_ADMIN'] },
  { id: 'support-admins', label: 'Support Admins', icon: <UserCog size={18} />, path: 'support-admins', roles: ['SUPER_ADMIN'] },
];

interface AdminSidebarProps {
  basePath: string;
  isOpen: boolean;
  onClose: () => void;
}

export function AdminSidebar({ basePath, isOpen, onClose }: AdminSidebarProps) {
  const { admin, logout } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const role = admin?.role ?? 'SUPPORT_ADMIN';
  const filtered = navItems.filter(item => item.roles.includes(role));

  async function handleLogout() {
    try {
      await logout();
      navigate('/login');
    } catch {
      addToast('error', 'Failed to log out');
    }
  }

  const sidebarContent = (
    <div className="flex flex-col h-full bg-white border-r border-slate-200">
      {/* Brand */}
      <div className="flex items-center justify-between px-5 py-5 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center shadow-sm">
            <Building2 size={18} className="text-white" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-900 leading-tight">MahalleHub</p>
            <p className="text-[11px] text-slate-500 font-medium">Admin Panel</p>
          </div>
        </div>
        {/* Close button (mobile only) */}
        <button
          onClick={onClose}
          className="lg:hidden text-slate-400 hover:text-slate-600 rounded-lg p-1.5 transition-colors"
          aria-label="Close navigation"
        >
          <X size={18} />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto scrollbar-thin" aria-label="Admin navigation">
        <div className="space-y-0.5">
          {filtered.map(item => (
            <NavLink
              key={item.id}
              to={`${basePath}/${item.path}`}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 ${
                  isActive
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span className={`shrink-0 transition-colors ${isActive ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600'}`}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </>
              )}
            </NavLink>
          ))}
        </div>
      </nav>

      {/* Profile / Logout */}
      <div className="px-3 pb-4 border-t border-slate-100 pt-4 space-y-1">
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-slate-50">
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
            {getInitials(admin?.fullName ?? 'A')}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-slate-900 truncate">{admin?.fullName ?? 'Admin'}</p>
            <p className="text-[11px] text-slate-500 truncate">{formatAdminRole(role)}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:bg-red-50 hover:text-red-600 transition-colors focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-1"
        >
          <LogOut size={16} />
          <span>Log Out</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:block w-64 shrink-0 sticky top-0 h-screen overflow-hidden">
        {sidebarContent}
      </aside>

      {/* Mobile drawer */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 z-40 flex">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
          <aside className="relative w-72 h-full shadow-2xl animate-in slide-in-from-left-5">
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  );
}
