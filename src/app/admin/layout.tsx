'use client';

import { useState, useEffect, ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Home, Building2, Star, FileText, Settings, Users, 
  Globe, CreditCard, ChevronLeft, ChevronRight, Menu, X,
  LayoutDashboard, Image, Calendar, MessageSquare, Bell
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface AdminLayoutProps {
  children: ReactNode;
}

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/admin/properties', label: 'Properties', icon: Building2 },
  { href: '/admin/amenities', label: 'Amenities', icon: Star },
  { href: '/admin/reviews', label: 'Reviews', icon: MessageSquare },
  { href: '/admin/blog', label: 'Blog Posts', icon: FileText },
  { href: '/admin/site-content', label: 'Site Content', icon: Globe },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
];

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <div className="min-h-screen bg-[var(--surface)] flex">
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          'hidden lg:flex flex-col bg-[var(--obsidian)] border-r border-[var(--border)] transition-all duration-300',
          collapsed ? 'w-20' : 'w-64'
        )}
      >
        <AdminSidebar collapsed={collapsed} pathname={pathname} />
      </aside>

      {/* Mobile Sidebar */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
          <aside className="relative w-72 bg-[var(--obsidian)] border-r border-[var(--border)] overflow-y-auto">
            <AdminSidebar collapsed={false} pathname={pathname} />
          </aside>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="h-16 bg-[var(--surface)] border-b border-[var(--border)] flex items-center justify-between px-4 lg:px-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-2 hover:bg-[var(--surface-2)] rounded"
            >
              <Menu size={20} />
            </button>
            <Link href="/" className="text-sm text-[var(--text-muted)] hover:text-[var(--gold)]">
              ← Back to Website
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <Bell size={18} className="text-[var(--text-muted)] cursor-pointer hover:text-[var(--gold)]" />
            <div className="w-8 h-8 rounded-full bg-[var(--gold)] flex items-center justify-center text-[#080808] font-bold text-sm">
              A
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

function AdminSidebar({ 
  collapsed, 
  pathname 
}: { 
  collapsed: boolean; 
  pathname: string 
}) {
  return (
    <>
      {/* Logo */}
      <div className={cn(
        'h-16 flex items-center border-b border-[var(--border)] px-4',
        collapsed ? 'justify-center' : 'gap-3'
      )}>
        <div className="w-8 h-8 rounded bg-[var(--gold)] flex items-center justify-center text-[#080808] font-bold">
          M
        </div>
        {!collapsed && (
          <div>
            <h1 className="font-serif text-white text-lg">Admin</h1>
            <p className="text-[var(--text-subtle)] text-[0.6rem] uppercase tracking-widest">CMS Dashboard</p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
        {navItems.map(item => {
          const isActive = item.exact 
            ? pathname === item.href 
            : pathname.startsWith(item.href);
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded transition-colors',
                collapsed && 'justify-center',
                isActive 
                  ? 'bg-[var(--gold)] text-[#080808]' 
                  : 'text-[var(--text-muted)] hover:bg-[var(--surface-2)] hover:text-white'
              )}
              title={collapsed ? item.label : undefined}
            >
              <item.icon size={18} />
              {!collapsed && <span className="text-sm font-medium">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Collapse Toggle */}
      <div className="p-2 border-t border-[var(--border)]">
        <Link
          href="/"
          className={cn(
            'flex items-center gap-3 px-3 py-2 rounded text-[var(--text-subtle)] hover:bg-[var(--surface-2)] hover:text-white transition-colors',
            collapsed && 'justify-center'
          )}
        >
          <Home size={18} />
          {!collapsed && <span className="text-sm">Back to Site</span>}
        </Link>
      </div>
    </>
  );
}
