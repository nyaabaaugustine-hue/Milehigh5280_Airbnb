'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, X, Phone, Sun, Moon } from 'lucide-react';
import { cn } from '@/lib/utils';

const navLinks = [
  { href: '/',           label: 'Home' },
  { href: '/properties', label: 'Properties' },
  { href: '/about',      label: 'Our Story' },
  { href: '/contact',    label: 'Concierge' },
];

interface NavbarProps {
  onBookNow?: () => void;
}

export default function Navbar({ onBookNow }: NavbarProps) {
  const [scrolled,    setScrolled]    = useState(false);
  const [menuOpen,    setMenuOpen]    = useState(false);
  const [theme,       setTheme]       = useState<'dark' | 'light'>('dark');
  const pathname = usePathname();

  const handleScroll = useCallback(() => {
    setScrolled(window.scrollY > 60);
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  useEffect(() => { setMenuOpen(false); }, [pathname]);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'dark' | 'light';
    if (savedTheme) setTheme(savedTheme);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    localStorage.setItem('theme', theme);
    if (theme === 'light') {
      root.setAttribute('data-theme', 'light');
    } else {
      root.setAttribute('data-theme', 'dark');
    }
  }, [theme]);

  const toggleTheme = () => setTheme(t => t === 'dark' ? 'light' : 'dark');

  return (
    <>
      <header
        role="banner"
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
          scrolled
            ? 'bg-obsidian/95 backdrop-blur-md border-b border-[var(--border)] py-3'
            : 'bg-[var(--surface)] border-b border-[var(--border)] py-4 shadow-lg',
        )}
      >
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12 flex items-center justify-between">

          {/* ── Logo ── */}
          <Link href="/" className="flex items-center gap-3 group" aria-label="Milehigh5280 - Ayi Mensah Home">
            <div className="relative w-11 h-11 rounded-full overflow-hidden border border-[var(--border-bright)] group-hover:border-[var(--gold)] transition-colors duration-300 shrink-0">
              <Image
                src="https://res.cloudinary.com/dwsl2ktt2/image/upload/v1775296671/logo_xcjkpn.jpg"
                alt="Milehigh5280 Logo"
                fill
                className="object-cover"
              />
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-serif text-[1.1rem] font-medium tracking-wide text-white group-hover:text-[var(--gold)] transition-colors duration-300">
                Milehigh5280 🌴
              </span>
              <span className="text-[0.48rem] tracking-[0.22em] uppercase text-[var(--gold)] font-sans font-medium mt-0.5">
                Ayi Mensah · Rehoboth Properties
              </span>
            </div>
          </Link>

          {/* ── Desktop Nav ── */}
          <nav aria-label="Main navigation" className="hidden lg:flex items-center gap-10">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  'text-[0.7rem] tracking-[0.18em] uppercase font-sans font-medium transition-colors duration-300 relative group',
                  pathname === href
                    ? 'text-[var(--gold)]'
                    : 'text-[var(--text-muted)] hover:text-white',
                )}
              >
                {label}
                <span className={cn(
                  'absolute -bottom-1 left-0 h-px bg-[var(--gold)] transition-all duration-300',
                  pathname === href ? 'w-full' : 'w-0 group-hover:w-full',
                )} />
              </Link>
            ))}
          </nav>

          {/* ── Right Controls ── */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              className="w-9 h-9 flex items-center justify-center border border-[var(--border)] text-[var(--gold)] hover:border-[var(--gold)] hover:bg-[rgba(201,150,58,0.08)] transition-colors duration-300"
            >
              {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
            </button>

            {/* Book Now CTA */}
            <button
              onClick={onBookNow}
              className="btn-gold text-[0.7rem] py-2.5 px-5"
            >
              <Phone size={12} />
              Book Now
            </button>
          </div>

          {/* ── Mobile Hamburger ── */}
          <button
            onClick={() => setMenuOpen(o => !o)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            className="lg:hidden text-white hover:text-[var(--gold)] transition-colors"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </header>

      {/* ── Mobile Menu ── */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
        className={cn(
          'fixed inset-0 z-40 lg:hidden flex flex-col bg-obsidian/98 backdrop-blur-xl transition-all duration-500',
          menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none',
        )}
      >
        <div className="h-20" />

        <nav className="flex flex-col justify-center flex-1 px-10 gap-2">
          {navLinks.map(({ href, label }, i) => (
            <Link
              key={href}
              href={href}
              className={cn(
                'font-serif text-5xl font-light py-3 border-b border-[var(--border)] transition-all duration-300',
                menuOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4',
                pathname === href ? 'text-[var(--gold)]' : 'text-white hover:text-[var(--gold)]',
              )}
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              {label}
            </Link>
          ))}

          <div className={cn(
            'mt-8 transition-all duration-500 delay-500',
            menuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          )}>
            <button
              onClick={() => { setMenuOpen(false); onBookNow?.(); }}
              className="btn-gold w-full py-4 text-sm flex items-center justify-center gap-2"
            >
              <Phone size={14} />
              Book Your Stay
            </button>
          </div>
        </nav>
      </div>
    </>
  );
}