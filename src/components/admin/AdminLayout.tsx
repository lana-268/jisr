import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { AdminSidebar } from './AdminSidebar';
import { AdminHeader } from './AdminHeader';
import { Toast } from './Toast';

const PAGE_META: Record<string, { title: string; description: string }> = {
  overview: { title: 'Dashboard', description: "Welcome back. Here's what's happening today." },
  providers: { title: 'Providers', description: 'Manage all registered service and product providers.' },
  pending: { title: 'Pending Approvals', description: 'Review and approve new provider applications.' },
  customers: { title: 'Customers', description: 'View and manage all registered customers.' },
  chats: { title: 'Support Chats', description: 'Monitor and respond to customer and provider conversations.' },
  'support-admins': { title: 'Support Admins', description: 'Manage support admin accounts.' },
};

interface AdminLayoutProps {
  basePath: string;
}

export function AdminLayout({ basePath }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  // Determine current page from URL
  const segments = location.pathname.split('/');
  const currentPage = segments[segments.length - 1] ?? 'overview';
  const meta = PAGE_META[currentPage] ?? { title: 'Admin', description: '' };

  return (
    <div className="flex h-screen overflow-hidden bg-[#F8FAFC]">
      <AdminSidebar
        basePath={basePath}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <AdminHeader
          title={meta.title}
          description={meta.description}
          onMenuClick={() => setSidebarOpen(true)}
        />

        {/* Scrollable content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>

      <Toast />
    </div>
  );
}
