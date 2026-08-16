"use client";

import React, { useEffect, useState } from "react";
import Sidebar from '@/components/admin/Sidebar';
import AdminHeader from '@/components/admin/Header';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const v = typeof window !== 'undefined' ? localStorage.getItem('admin_sidebar_collapsed') : null;
    if (v !== null) setCollapsed(v === '1');
  }, []);

  useEffect(() => {
    try { localStorage.setItem('admin_sidebar_collapsed', collapsed ? '1' : '0'); } catch {}
  }, [collapsed]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <Sidebar
          collapsed={collapsed}
          open={mobileOpen}
          onToggleCollapsed={() => setCollapsed((c) => !c)}
          onCloseMobile={() => setMobileOpen(false)}
        />
        <div className="flex-1 min-h-screen flex flex-col">
          <AdminHeader onOpenMobile={() => setMobileOpen(true)} onToggleCollapsed={() => setCollapsed((c) => !c)} collapsed={collapsed} />
          <main className="p-6 flex-1">{children}</main>
        </div>
      </div>
    </div>
  );
}
