'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { AdminProvider, useAdmin } from '@/lib/admin-context';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import MobileDrawer from '@/components/admin/MobileDrawer';

function AdminShell({ children }) {
  const pathname = usePathname();
  const { sidebarCollapsed } = useAdmin();
  const isLoginPage = pathname === '/admin/login';

  if (isLoginPage) {
    return <main className="min-h-screen bg-slate-900 text-slate-100">{children}</main>;
  }

  return (
    <div className="min-h-screen bg-[#F6F8FA] text-[#17212F] flex flex-col antialiased w-full min-w-0 overflow-x-hidden">
      {/* Desktop Persistent Sidebar */}
      <div className="hidden lg:block">
        <AdminSidebar />
      </div>

      {/* Mobile Drawer */}
      <MobileDrawer />

      {/* Top Header */}
      <AdminHeader />

      {/* Main Content Area */}
      <main
        className={`flex-1 transition-all duration-300 pt-16 min-w-0 w-full ${
          sidebarCollapsed ? 'lg:pl-20' : 'lg:pl-72'
        }`}
      >
        <div className="p-4 sm:p-6 lg:p-8 max-w-[1600px] mx-auto min-h-[calc(100vh-4rem)] min-w-0 w-full">
          {children}
        </div>
      </main>
    </div>
  );
}

export default function AdminLayout({ children }) {
  return (
    <AdminProvider>
      <AdminShell>{children}</AdminShell>
    </AdminProvider>
  );
}
