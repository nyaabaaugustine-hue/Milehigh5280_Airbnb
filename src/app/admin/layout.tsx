'use client';

import { useState, useEffect, ReactNode } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import {
  Home, Building2, Star, FileText, Settings,
  Globe, LayoutDashboard, Bot, Bell, Menu, MessageSquare, LogOut,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import AIPortalManager from '@/components/admin/AIPortalManager';

interface AdminLayoutProps {
  children: ReactNode;
}

const navItems = [
  { href: '/admin',              label: 'Dashboard',     icon: LayoutDashboard, exact: true },
  { href: '/admin/properties',  label: 'Properties',    icon: Building2 },
  { href: '/admin/amenities',   label: 'Amenities',     icon: Star },
  { href: '/admin/reviews',     label: 'Reviews',        icon: MessageSquare },
  { href: '/admin/blog',        label: 'Blog Posts',     icon: FileText },
  { href: '/admin/site-content',label: 'Site Content',  icon: Globe },
  { href: '/admin/settings',    label: 'Settings',       icon: Settings },
];

interface AdminSession {
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  loginTime: string;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [session, setSession] = useState<AdminSession | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check admin session
    const stored = localStorage.getItem('adminSession');
    if (stored) {
      try {
        setSession(JSON.parse(stored));
      } catch {
        localStorage.removeItem('adminSession');
      }
    }
    setLoading(false);
  }, []);

  useEffect(() => { setMobileOpen(false); }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem('adminSession');
    setSession(null);
    router.push('/login');
  };

  // Show loading while checking session
  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--surface)] flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  // Redirect to login if no session
  if (!session) {
    if (typeof window !== 'undefined') {
      router.push('/login');
    }
    return null;
  }

  const initials = session.firstName.charAt(0) + (session.lastName?.charAt(0) || '');

  return (
    <div className="min-h-screen bg-[var(--surface)] flex">

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-72 bg-[var(--obsidian)] border-r border-[var(--border)]">
        <AdminSidebar pathname={pathname} />
      </aside>

      {/* Mobile Sidebar overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/60" onClick={() => setMobileOpen(false)} />
          <aside className="relative w-80 bg-[var(--obsidian)] border-r border-[var(--border)] overflow-y-auto">
            <AdminSidebar pathname={pathname} />
          </aside>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">

        {/* Top bar */}
        <header className="h-18 bg-[var(--surface)] border-b border-[var(--border)] flex items-center justify-between px-5 lg:px-8 shrink-0">
          <div className="flex items-center gap-5">
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-2.5 hover:bg-[var(--surface-2)] rounded text-[var(--text-muted)] hover:text-white transition-colors"
            >
              <Menu size={22} />
            </button>
            <Link href="/" className="text-base text-[var(--text-muted)] hover:text-[var(--gold)] transition-colors font-medium">
              ← Back to Website
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={handleLogout}
              className="text-[var(--text-muted)] hover:text-[var(--gold)] transition-colors flex items-center gap-2 text-sm"
            >
              <LogOut size={18} />
              Logout
            </button>
            <Bell size={20} className="text-[var(--text-muted)] cursor-pointer hover:text-[var(--gold)] transition-colors" />
            <div className="w-10 h-10 bg-[var(--gold)] flex items-center justify-center text-[#080808] font-bold text-lg rounded-full">
              {initials || 'A'}
            </div>
          </div>
        </header>

        {/* Page */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          {children}
        </main>
      </div>

      {/* AI Portal Manager */}
      <AIPortalManager />
    </div>
  );
}

function AdminSidebar({ pathname }: { pathname: string }) {
  return (
    <>
      {/* Logo */}
      <div className="h-18 flex items-center gap-4 border-b border-[var(--border)] px-6">
        <div className="w-11 h-11 bg-[var(--gold)] flex items-center justify-center text-[#080808] font-bold text-xl rounded-full">
          M
        </div>
        <div>
          <h1 className="font-serif text-white text-xl leading-tight">Admin</h1>
          <p className="text-[var(--text-subtle)] text-sm uppercase tracking-wider">CMS Dashboard</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-5 px-4 space-y-1.5 overflow-y-auto">
        {navItems.map(item => {
          const isActive = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-4 px-4 py-3.5 transition-all duration-300 group relative text-base',
                isActive
                  ? 'bg-[var(--gold)] text-[#080808]'
                  : 'text-[var(--text-muted)] hover:bg-[var(--surface-2)] hover:text-white',
              )}
            >
              <item.icon size={20} />
              <span className="font-medium flex-1">{item.label}</span>
              {'badge' in item && (item as { badge?: string }).badge && !isActive && (
                <span className="text-xs tracking-widest uppercase bg-[var(--gold)] text-[#080808] px-2 py-1 font-bold">
                  {(item as { badge?: string }).badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>
    </>
  );
}
