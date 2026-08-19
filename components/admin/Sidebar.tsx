"use client";
import Link from 'next/link';
import clsx from 'clsx';

export default function Sidebar({ collapsed = false, open = false, onToggleCollapsed, onCloseMobile }: { collapsed?: boolean; open?: boolean; onToggleCollapsed?: () => void; onCloseMobile?: () => void; }) {
  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST', credentials: 'same-origin' });
    window.location.href = '/';
  }

  const base = clsx('bg-white border-r h-screen p-4 flex flex-col transition-all duration-200', {
    'w-64': !collapsed,
    'w-20': collapsed,
  });

  return (
    <>
      {/* Desktop / persistent sidebar */}
      <aside className={base + ' hidden md:flex'}>
        <div className="mb-6 flex items-center justify-between">
          <div className="text-lg font-semibold">{collapsed ? 'A' : 'Admin'}</div>
          <button onClick={onToggleCollapsed} aria-label="Toggle sidebar" className="text-sm text-gray-500">{collapsed ? '▶' : '◀'}</button>
        </div>
        <nav className="flex flex-col gap-1 text-sm">
          <Link href="/admin/dashboard" className="px-3 py-2 rounded hover:bg-gray-100">{!collapsed ? 'Dashboard' : 'D'}</Link>
          <Link href="/admin/dashboard/users" className="px-3 py-2 rounded hover:bg-gray-100">{!collapsed ? 'Users' : 'U'}</Link>
          <Link href="/admin/dashboard/posts" className="px-3 py-2 rounded hover:bg-gray-100">{!collapsed ? 'Posts' : 'P'}</Link>
          <Link href="/admin/dashboard/projects" className="px-3 py-2 rounded hover:bg-gray-100">{!collapsed ? 'Projects' : 'R'}</Link>
          <Link href="/admin/landing-pages" className="px-3 py-2 rounded hover:bg-gray-100">{!collapsed ? 'Landing Pages' : 'L'}</Link>
          <button onClick={handleLogout} className="text-left px-3 py-2 rounded hover:bg-gray-100">{!collapsed ? 'Sign out' : 'S'}</button>
        </nav>
      </aside>

      {/* Mobile overlay sidebar */}
      <div className={clsx('md:hidden fixed inset-0 z-50 transition-opacity', { 'pointer-events-auto': open, 'pointer-events-none': !open })} aria-hidden={!open}>
        <div className={clsx('absolute inset-0 bg-black/40', { 'opacity-100': open, 'opacity-0': !open })} onClick={onCloseMobile} />
        <aside className={clsx('absolute left-0 top-0 bottom-0 w-64 bg-white p-4 shadow', { 'translate-x-0': open, '-translate-x-full': !open })} style={{ transition: 'transform .2s ease' }}>
          <div className="mb-6 flex items-center justify-between">
            <div className="text-lg font-semibold">Admin</div>
            <button onClick={onCloseMobile} aria-label="Close sidebar" className="text-sm text-gray-500">✕</button>
          </div>
          <nav className="flex flex-col gap-1 text-sm">
            <Link href="/admin/dashboard" className="px-3 py-2 rounded hover:bg-gray-100">Dashboard</Link>
            <Link href="/admin/dashboard/users" className="px-3 py-2 rounded hover:bg-gray-100">Users</Link>
            <Link href="/admin/dashboard/posts" className="px-3 py-2 rounded hover:bg-gray-100">Posts</Link>
            <Link href="/admin/dashboard/projects" className="px-3 py-2 rounded hover:bg-gray-100">Projects</Link>
            <Link href="/admin/landing-pages" className="px-3 py-2 rounded hover:bg-gray-100">Landing Pages</Link>
            <button onClick={handleLogout} className="text-left px-3 py-2 rounded hover:bg-gray-100">Sign out</button>
          </nav>
        </aside>
      </div>
    </>
  );
}
