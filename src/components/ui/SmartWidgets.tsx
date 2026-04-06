'use client';

import { useState, useEffect } from 'react';
import { X, CheckCircle, Mail, Bell } from 'lucide-react';

// ─── Cookie Consent Banner (Feature 20) ──────────────────────────────────────
export function CookieConsent() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => {
      if (!localStorage.getItem('cookie_consent')) setShow(true);
    }, 2000);
    return () => clearTimeout(t);
  }, []);

  const accept = () => { localStorage.setItem('cookie_consent', 'accepted'); setShow(false); };
  const decline = () => { localStorage.setItem('cookie_consent', 'declined'); setShow(false); };

  if (!show) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[300] bg-[var(--surface)] border-t border-[var(--border)] px-6 py-4 shadow-2xl" style={{ animation: 'slideUp 0.4s ease' }}>
      <div className="max-w-[1440px] mx-auto flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between">
        <div className="flex items-start gap-3 flex-1">
          <span className="text-lg shrink-0">🍪</span>
          <p className="text-[var(--text-muted)] text-xs leading-relaxed">
            We use cookies to improve your experience, remember your preferences, and analyse site traffic.
            By continuing, you agree to our{' '}
            <a href="/privacy" className="text-[var(--gold)] hover:underline">Privacy Policy</a>.
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <button onClick={decline} className="text-[var(--text-muted)] text-xs uppercase tracking-widest hover:text-white transition-colors">
            Decline
          </button>
          <button onClick={accept} className="btn-gold text-[0.65rem] py-2.5 px-5">
            Accept All
          </button>
        </div>
        <button onClick={decline} className="absolute top-3 right-4 text-[var(--text-muted)] hover:text-white transition-colors sm:static sm:ml-2">
          <X size={14} />
        </button>
      </div>
    </div>
  );
}

// ─── Mailing List / Newsletter Signup (Feature 21) ───────────────────────────
export function NewsletterSignup() {
  const [email, setEmail] = useState('');
  const [done, setDone] = useState(false);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => {
      if (!localStorage.getItem('newsletter_dismissed')) setShow(true);
    }, 25000);
    return () => clearTimeout(t);
  }, []);

  const dismiss = () => { localStorage.setItem('newsletter_dismissed', '1'); setShow(false); };
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes('@')) return;
    setDone(true);
    setTimeout(dismiss, 3000);
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-24 left-6 z-[150] max-w-xs w-[calc(100vw-3rem)] bg-[var(--surface)] border border-[var(--gold)]/40 shadow-2xl" style={{ animation: 'slideUp 0.4s ease' }}>
      <div className="relative p-5">
        <button onClick={dismiss} className="absolute top-3 right-3 text-[var(--text-muted)] hover:text-white transition-colors">
          <X size={13} />
        </button>
        {done ? (
          <div className="text-center py-2">
            <CheckCircle size={32} className="text-[var(--gold)] mx-auto mb-2" />
            <p className="text-white text-sm font-medium">You&apos;re on the list! 🌴</p>
            <p className="text-[var(--text-muted)] text-xs mt-1">Your free Accra guide is on its way.</p>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-2 mb-3">
              <Bell size={14} className="text-[var(--gold)]" />
              <p className="section-label text-[0.55rem]">Free Accra Guide</p>
            </div>
            <h3 className="font-serif text-lg text-white leading-tight mb-2">
              Get our free <span className="italic text-gold-gradient">Visitor&apos;s Guide</span>
            </h3>
            <p className="text-[var(--text-muted)] text-xs leading-relaxed mb-4">
              Best restaurants, hidden beaches, safety tips, visa info — all curated by the Milehigh team.
            </p>
            <form onSubmit={submit} className="flex gap-2">
              <div className="flex items-center gap-2 flex-1 bg-[var(--surface-2)] border border-[var(--border)] px-3">
                <Mail size={12} className="text-[var(--gold)] shrink-0" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="bg-transparent text-[var(--text-primary)] text-xs py-2.5 w-full outline-none placeholder:text-[var(--text-subtle)]"
                  required
                />
              </div>
              <button type="submit" className="btn-gold text-[0.6rem] py-2.5 px-4 shrink-0">Go</button>
            </form>
            <p className="text-[var(--text-subtle)] text-[0.55rem] mt-2 text-center">No spam, ever. Unsubscribe anytime.</p>
          </>
        )}
      </div>
    </div>
  );
}

// ─── Social Proof Ticker (Feature 37) ─────────────────────────────────────────
const proofItems = [
  '✦ 3 guests are viewing Milehigh5280 right now',
  '✦ Last booked 2 hours ago from United Kingdom',
  '✦ 4 people added this to their wishlist today',
  '✦ 38 five-star reviews and counting 🌟',
  '✦ Check-in available as early as tomorrow',
  '✦ 2 bookings confirmed this week',
];

export function SocialProofTicker() {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIndex(i => (i + 1) % proofItems.length);
        setVisible(true);
      }, 400);
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-[var(--surface-2)] border-b border-[var(--border)] py-2 px-6 overflow-hidden">
      <div className="max-w-[1440px] mx-auto flex items-center justify-center gap-3">
        <div className="w-2 h-2 rounded-full bg-[var(--gold)] animate-pulse shrink-0" />
        <p
          className="text-[var(--text-muted)] text-[0.65rem] tracking-wider text-center transition-opacity duration-400"
          style={{ opacity: visible ? 1 : 0, transition: 'opacity 0.4s ease' }}
        >
          {proofItems[index]}
        </p>
      </div>
    </div>
  );
}
