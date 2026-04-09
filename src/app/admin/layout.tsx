'use client';

import { useState, useEffect, ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home, Building2, Star, FileText, Settings,
  Globe, LayoutDashboard, MessageSquare, Bell, Menu, Bot,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface AdminLayoutProps {
  children: ReactNode;
}

const navItems = [
  { href: '/admin',              label: 'Dashboard',      icon: LayoutDashboard, exact: true },
  { href: '/admin/chat',         label: 'AI Assistant',   icon: Bot,             badge: 'NEW' },
  { href: '/admin/properties',   label: 'Properties',     icon: Building2 },
  { href: '/admin/amenities',    label: 'Amenities',      icon: Star },
  { href: '/admin/reviews',      label: 'Reviews',        icon: MessageSquare },
  { href: '/admin/blog',         label: 'Blog Posts',     icon: FileText },
  { href: '/admin/site-content', label: 'Site Content',   icon: Globe },
  { href: '/admin/settings',     label: 'Settings',       icon: Settings },
];

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname    = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => { setMobileOpen(false); }, [pathname]);

  return (
    <div className="min-h-screen bg-[var(--surface)] flex">

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-[var(--obsidian)] border-r border-[var(--border)]">
        <AdminSidebar pathname={pathname} />
      </aside>

      {/* Mobile Sidebar overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/60" onClick={() => setMobileOpen(false)} />
          <aside className="relative w-72 bg-[var(--obsidian)] border-r border-[var(--border)] overflow-y-auto">
            <AdminSidebar pathname={pathname} />
          </aside>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">

        {/* Top bar */}
        <header className="h-16 bg-[var(--surface)] border-b border-[var(--border)] flex items-center justify-between px-4 lg:px-6 shrink-0">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-2 hover:bg-[var(--surface-2)] rounded text-[var(--text-muted)] hover:text-white transition-colors"
            >
              <Menu size={20} />
            </button>
            <Link href="/" className="text-sm text-[var(--text-muted)] hover:text-[var(--gold)] transition-colors">
              ← Back to Website
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <Bell size={18} className="text-[var(--text-muted)] cursor-pointer hover:text-[var(--gold)] transition-colors" />
            <div className="w-8 h-8 bg-[var(--gold)] flex items-center justify-center text-[#080808] font-bold text-sm">
              A
            </div>
          </div>
        </header>

        {/* Page */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

function AdminSidebar({ pathname }: { pathname: string }) {
  return (
    <>
      {/* Logo */}
      <div className="h-16 flex items-center gap-3 border-b border-[var(--border)] px-5">
        <div className="w-8 h-8 bg-[var(--gold)] flex items-center justify-center text-[#080808] font-bold text-sm">
          M
        </div>
        <div>
          <h1 className="font-serif text-white text-lg leading-tight">Admin</h1>
          <p className="text-[var(--text-subtle)] text-[0.55rem] uppercase tracking-widest">CMS Dashboard</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {navItems.map(item => {
          const isActive = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 transition-colors group relative',
                isActive
                  ? 'bg-[var(--gold)] text-[#080808]'
                  : 'text-[var(--text-muted)] hover:bg-[var(--surface-2)] hover:text-white',
              )}
            >
              <item.icon size={17} />
              <span className="text-sm font-medium flex-1">{item.label}</span>
              {'badge' in item && item.badge && !isActive && (
                <span className="text-[0.5rem] tracking-widest uppercase bg-[var(--gold)] text-[#080808] px-1.5 py-0.5 font-bold">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-[var(--border)]">
        <Link
          href="/"
          className="flex items-center gap-3 px-3 py-2 text-[var(--text-subtle)] hover:bg-[var(--surface-2)] hover:text-white transition-colors"
        >
          <Home size={17} />
          <span className="text-sm">Back to Site</span>
        </Link>
      </div>
    </>
  );
}
