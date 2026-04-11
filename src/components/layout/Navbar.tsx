'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, X, Sun, Moon, ChevronDown, User, LogIn, LayoutDashboard } from 'lucide-react';
import { cn } from '@/lib/utils';
import { LANGUAGES } from '@/lib/data';
import { useLanguage, Language } from '@/lib/LanguageContext';

interface NavbarProps {
  onBookNow?: () => void;
}

export default function Navbar({ onBookNow }: NavbarProps) {
  const [scrolled,  setScrolled]  = useState(false);
  const [menuOpen,  setMenuOpen]  = useState(false);
  const [langOpen,  setLangOpen]  = useState(false);
  const [theme,     setTheme]     = useState<'dark' | 'light'>('dark');
  const pathname = usePathname();
  const langRef = useRef<HTMLDivElement>(null);
  const { language, setLanguage } = useLanguage();

  const handleScroll = useCallback(() => setScrolled(window.scrollY > 60), []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  useEffect(() => { setMenuOpen(false); }, [pathname]);

  useEffect(() => {
    const saved = localStorage.getItem('theme') as 'dark' | 'light' | null;
    if (saved) setTheme(saved);
  }, []);

  useEffect(() => {
    localStorage.setItem('theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(event.target as Node)) {
        setLangOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleTheme = () => setTheme(t => t === 'dark' ? 'light' : 'dark');

  const currentLang = LANGUAGES.find(l => l.code === language) || LANGUAGES[0];

  // Check for admin session - use state to avoid hydration mismatch
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const session = localStorage.getItem('adminSession');
    setIsAdmin(!!session);
  }, []);

  return (
    <>
      <header
        role="banner"
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
          scrolled
            ? 'bg-[var(--surface)]/95 backdrop-blur-md border-b border-[var(--border)] py-3 shadow-lg'
            : 'bg-[var(--surface)] border-b border-[var(--border)] py-4',
        )}
      >
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12 flex items-center justify-between">

          {/* ── Logo ── */}
          <Link href="/" className="flex items-center gap-3 group" aria-label="The Palm Home">
            <div className="relative w-12 h-12 rounded-full overflow-hidden border border-[var(--border-bright)] group-hover:border-[var(--gold)] transition-colors duration-300 shrink-0">
              <Image
                src="https://res.cloudinary.com/dwsl2ktt2/image/upload/v1775296671/logo_xcjkpn.jpg"
                alt="The Palm Logo"
                fill
                className="object-cover"
                unoptimized
              />
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-serif text-xl font-medium tracking-wide text-[var(--text-primary)] group-hover:text-[var(--gold)] transition-colors duration-300">
                Milehigh5280 🌴
              </span>
              <span className="text-[0.55rem] tracking-[0.2em] uppercase text-[var(--gold)] font-sans font-medium mt-0.5">
                Ayi Mensah · Milehigh Properties
              </span>
            </div>
          </Link>

          {/* ── Desktop Menu ── */}
          <nav className="hidden lg:flex items-center gap-6">
            <Link href="/properties" className="text-sm font-medium text-[var(--text-muted)] hover:text-[var(--gold)] transition-colors">Properties</Link>
            <Link href="/amenities" className="text-sm font-medium text-[var(--text-muted)] hover:text-[var(--gold)] transition-colors">Amenities</Link>
            <Link href="/guide" className="text-sm font-medium text-[var(--text-muted)] hover:text-[var(--gold)] transition-colors">Travel Guide</Link>
            <Link href="/concierge" className="text-sm font-medium text-[var(--text-muted)] hover:text-[var(--gold)] transition-colors">Concierge</Link>
            <Link href="/about" className="text-sm font-medium text-[var(--text-muted)] hover:text-[var(--gold)] transition-colors">Our Story</Link>
          </nav>

          {/* ── Right Controls ── */}
          <div className="hidden lg:flex items-center gap-4">
            {/* Ghana Flag */}
            <div className="relative w-7 h-5 overflow-hidden rounded-sm border border-[var(--border)] opacity-80">
              <Image
                src="https://res.cloudinary.com/dwsl2ktt2/image/upload/v1775411320/images_1_kilffq.jpg"
                alt="Ghana"
                fill
                className="object-cover"
                unoptimized
              />
            </div>

            {/* Language Selector */}
            <div className="relative" ref={langRef}>
              <button
                onClick={() => setLangOpen(!langOpen)}
                className="flex items-center gap-1.5 px-3 py-2 border border-[var(--border)] hover:border-[var(--gold)] transition-colors duration-300 group"
              >
                <span className="text-base">{currentLang.flag}</span>
                <span className="text-xs uppercase tracking-widest font-medium text-[var(--text-muted)] group-hover:text-[var(--text-primary)] transition-colors">
                  {currentLang.code}
                </span>
                <ChevronDown size={12} className={cn("text-[var(--text-subtle)] transition-transform duration-300", langOpen && "rotate-180")} />
              </button>

              {langOpen && (
                <div className="absolute top-full right-0 mt-2 w-52 bg-[var(--surface)] border border-[var(--border)] shadow-2xl py-2 z-[60] animate-in fade-in slide-in-from-top-2 duration-300 max-h-[70vh] overflow-y-auto scrollbar-hide">
                  {LANGUAGES.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setLanguage(lang.code as Language);
                        setLangOpen(false);
                      }}
                      className={cn(
                        "w-full flex items-center gap-3 px-4 py-3 hover:bg-[rgba(201,150,58,0.08)] transition-colors text-left",
                        language === lang.code ? "bg-[rgba(201,150,58,0.05)]" : ""
                      )}
                    >
                      <span className="text-lg">{lang.flag}</span>
                      <span className={cn(
                        "text-sm uppercase tracking-[0.1em] font-medium",
                        language === lang.code ? "text-[var(--gold)]" : "text-[var(--text-muted)]"
                      )}>
                        {lang.label}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={toggleTheme}
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              className="w-10 h-10 flex items-center justify-center border border-[var(--border)] text-[var(--gold)] hover:border-[var(--gold)] hover:bg-[rgba(201,150,58,0.08)] transition-colors duration-300"
            >
              {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            </button>

            {/* Login / Dashboard for admins */}
            {isAdmin ? (
              <Link href="/admin" className="flex items-center gap-2 px-4 py-2.5 border border-[var(--gold)] bg-[var(--gold)] text-[#080808] hover:bg-[#E4B429] transition-all duration-300">
                <LayoutDashboard size={14} />
                <span className="text-xs font-bold uppercase tracking-wider">Dashboard</span>
              </Link>
            ) : (
              <Link href="/login" className="flex items-center gap-2 px-4 py-2.5 border border-[var(--border)] hover:border-[var(--gold)] text-[var(--text-muted)] hover:text-white transition-all duration-300">
                <LogIn size={14} />
                <span className="text-xs font-medium tracking-wider">Login</span>
              </Link>
            )}
          </div>

          {/* ── Mobile Hamburger ── */}
          <button
            onClick={() => setMenuOpen(o => !o)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            className="lg:hidden text-[var(--text-primary)] hover:text-[var(--gold)] transition-colors"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      {/* ── Mobile Menu Overlay ── */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
        className={cn(
          'fixed inset-0 z-40 lg:hidden flex flex-col backdrop-blur-xl transition-all duration-500',
          menuOpen
            ? 'opacity-100 pointer-events-auto bg-[var(--background)]/98'
            : 'opacity-0 pointer-events-none bg-[var(--background)]/98',
        )}
      >
        <div className="h-24" />
          <nav className="flex flex-col justify-center flex-1 px-10 gap-2">
            <Link href="/" className="font-serif text-4xl font-light py-4 border-b border-[var(--border)] text-white">Home</Link>
            <Link href="/properties" className="font-serif text-4xl font-light py-4 border-b border-[var(--border)] text-[var(--text-muted)]">Properties</Link>
            <Link href="/amenities" className="font-serif text-4xl font-light py-4 border-b border-[var(--border)] text-[var(--text-muted)]">Amenities</Link>
            <Link href="/guide" className="font-serif text-4xl font-light py-4 border-b border-[var(--border)] text-[var(--text-muted)]">Travel Guide</Link>
            <Link href="/concierge" className="font-serif text-4xl font-light py-4 border-b border-[var(--border)] text-[var(--text-muted)]">Concierge</Link>
            <Link href="/about" className="font-serif text-4xl font-light py-4 border-b border-[var(--border)] text-[var(--text-muted)]">Our Story</Link>
            <Link href="/login" className="font-serif text-4xl font-light py-4 border-b border-[var(--border)] text-[var(--text-muted)]">Login</Link>
            <Link href="/signup" className="font-serif text-4xl font-light py-4 border-b border-[var(--border)] text-[var(--gold)]">Sign Up</Link>
          
          <div className={cn(
            'mt-8 flex flex-col gap-3 transition-all duration-500',
            menuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4',
          )} style={{ transitionDelay: '350ms' }}>
            {/* Mobile Language Selector */}
            <div className="grid grid-cols-4 gap-2 mb-2">
              {LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setLanguage(lang.code as Language);
                  }}
                  className={cn(
                    "flex flex-col items-center justify-center py-3 border border-[var(--border)] transition-all",
                    language === lang.code ? "bg-[var(--gold)]/10 border-[var(--gold)]" : "bg-[var(--surface-2)]"
                  )}
                >
                  <span className="text-xl mb-1">{lang.flag}</span>
                  <span className={cn(
                    "text-[0.55rem] uppercase tracking-tighter font-bold",
                    language === lang.code ? "text-[var(--gold)]" : "text-[var(--text-subtle)]"
                  )}>
                    {lang.code}
                  </span>
                </button>
              ))}
            </div>

            <button onClick={toggleTheme} className="btn-ghost w-full justify-center gap-2">
              {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
              {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
            </button>
            <button onClick={() => { setMenuOpen(false); onBookNow?.(); }} className="btn-gold w-full justify-center py-4">
              Book Now
            </button>
          </div>
        </nav>
        <div className="px-10 py-8">
          <p className="section-label text-[var(--text-subtle)]">The Palm 🌴 · Ayi Mensah · Milehigh Properties</p>
        </div>
      </div>
    </>
  );
}
