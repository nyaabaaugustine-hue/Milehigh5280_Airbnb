'use client';

import { useState, useEffect, useRef } from 'react';
import { Calculator, Calendar, Users, ArrowRight, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { USD_TO_GHS } from '@/lib/data';

const NIGHTLY_RATE_USD = 50;
const CLEANING_FEE_USD = 30;
const SERVICE_FEE_USD  = 25;

const SEASON_LABELS: Record<string, { label: string; color: string; mult: number }> = {
  peak:   { label: 'Peak Season',  color: 'text-red-400',   mult: 1.25 },
  high:   { label: 'High Season',  color: 'text-amber-400', mult: 1.10 },
  normal: { label: 'Standard',     color: 'text-green-400', mult: 1.00 },
  low:    { label: 'Low Season',   color: 'text-sky-400',   mult: 0.90 },
};

function getSeason(checkIn: string): keyof typeof SEASON_LABELS {
  if (!checkIn) return 'normal';
  const month = new Date(checkIn).getMonth() + 1;
  if ([12, 1].includes(month))  return 'peak';  // Christmas / New Year
  if ([7, 8].includes(month))   return 'high';  // Summer diaspora rush
  if ([4, 5].includes(month))   return 'low';   // Shoulder season
  return 'normal';
}

interface Props {
  onBookNow?: () => void;
}

export default function PriceCalculator({ onBookNow }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [vis,      setVis]      = useState(false);
  const [currency, setCurrency] = useState<'USD' | 'GHS'>('USD');
  const [checkIn,  setCheckIn]  = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests,   setGuests]   = useState(2);
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVis(true); observer.disconnect(); } },
      { threshold: 0.1 },
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const nights = (() => {
    if (!checkIn || !checkOut) return 0;
    const ms = new Date(checkOut).getTime() - new Date(checkIn).getTime();
    return Math.max(0, Math.round(ms / 86400000));
  })();

  const season      = getSeason(checkIn);
  const mult        = SEASON_LABELS[season].mult;
  const rate        = NIGHTLY_RATE_USD * mult;
  const nightsTotal = rate * nights;
  const subtotal    = nightsTotal + CLEANING_FEE_USD + SERVICE_FEE_USD;

  const fmt = (usd: number) =>
    currency === 'GHS'
      ? `GHS ${(usd * USD_TO_GHS).toLocaleString('en-GH', { maximumFractionDigits: 0 })}`
      : `$${usd.toFixed(2)}`;

  const reset = () => { setCheckIn(''); setCheckOut(''); setGuests(2); setAnimated(false); };

  useEffect(() => {
    if (nights > 0) {
      setAnimated(false);
      const t = setTimeout(() => setAnimated(true), 80);
      return () => clearTimeout(t);
    }
  }, [nights, currency, season]);

  const todayStr = new Date().toISOString().split('T')[0];

  return (
    <section
      ref={ref}
      className="py-24 lg:py-36 px-6 lg:px-12 max-w-[1440px] mx-auto"
      aria-label="Price Calculator"
    >
      {/* ── Header ── */}
      <div className={cn(
        'flex flex-col lg:flex-row items-start lg:items-end justify-between mb-16 gap-6 transition-all duration-700',
        vis ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8',
      )}>
        <div>
          <p className="section-label mb-4">Transparent Pricing</p>
          <h2 className="font-serif font-light text-white leading-tight">
            Live Price<br />
            <span className="italic text-gold-gradient">Calculator</span>
          </h2>
        </div>
        <p className="text-[var(--text-muted)] text-sm max-w-xs leading-relaxed">
          Enter your dates and see a real-time cost breakdown — with seasonal rates,
          cleaning, and service fees. No surprises at checkout.
        </p>
      </div>

      {/* ── Divider ── */}
      <div className="flex items-center gap-4 mb-16">
        <div className="flex-1 h-px bg-gradient-to-r from-transparent to-[var(--border)]" />
        <div className="w-2 h-2 rotate-45 border border-[var(--gold)] opacity-60" />
        <div className="flex-1 h-px bg-gradient-to-l from-transparent to-[var(--border)]" />
      </div>

      <div className={cn(
        'grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8 transition-all duration-700',
        vis ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8',
      )} style={{ transitionDelay: '150ms' }}>

        {/* ── Left: Inputs ── */}
        <div className="border border-[var(--border)] bg-[var(--surface)] p-8 space-y-6">
          <div className="flex items-center gap-3 mb-2">
            <Calculator size={16} className="text-[var(--gold)]" />
            <p className="section-label">Configure Your Stay</p>
          </div>

          {/* Currency Toggle */}
          <div className="flex items-center gap-4">
            <span className="text-[var(--text-muted)] text-xs uppercase tracking-widest shrink-0">Currency</span>
            <div className="flex border border-[var(--border)] overflow-hidden">
              {(['USD', 'GHS'] as const).map(c => (
                <button
                  key={c}
                  onClick={() => setCurrency(c)}
                  className={cn(
                    'px-5 py-2 text-[0.65rem] uppercase tracking-widest transition-all duration-200 font-medium',
                    currency === c
                      ? 'bg-[var(--gold)] text-[var(--obsidian)]'
                      : 'text-[var(--text-muted)] hover:text-white bg-transparent',
                  )}
                >
                  {c === 'USD' ? '$ USD' : '₵ GHS'}
                </button>
              ))}
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="section-label text-[0.55rem] flex items-center gap-1.5 mb-2">
                <Calendar size={10} />Check-In
              </label>
              <input
                type="date"
                value={checkIn}
                min={todayStr}
                onChange={e => {
                  setCheckIn(e.target.value);
                  if (checkOut && e.target.value >= checkOut) setCheckOut('');
                }}
                className="input-luxury w-full text-sm"
              />
            </div>
            <div>
              <label className="section-label text-[0.55rem] flex items-center gap-1.5 mb-2">
                <Calendar size={10} />Check-Out
              </label>
              <input
                type="date"
                value={checkOut}
                min={checkIn ? new Date(new Date(checkIn).getTime() + 86400000).toISOString().split('T')[0] : todayStr}
                onChange={e => setCheckOut(e.target.value)}
                className={cn('input-luxury w-full text-sm', !checkIn && 'opacity-50 cursor-not-allowed')}
                disabled={!checkIn}
              />
            </div>
          </div>

          {/* Guests */}
          <div>
            <label className="section-label text-[0.55rem] flex items-center gap-1.5 mb-2">
              <Users size={10} />Guests
            </label>
            <div className="flex border border-[var(--border)] overflow-hidden">
              {[1, 2, 3, 4].map(n => (
                <button
                  key={n}
                  onClick={() => setGuests(n)}
                  className={cn(
                    'flex-1 py-3 text-sm font-medium transition-all duration-200 border-r border-[var(--border)] last:border-r-0',
                    guests === n
                      ? 'bg-[var(--gold)] text-[var(--obsidian)]'
                      : 'text-[var(--text-muted)] hover:text-white bg-transparent',
                  )}
                >
                  {n}
                </button>
              ))}
            </div>
            <p className="text-[var(--text-subtle)] text-[0.6rem] mt-1.5">Max 4 guests · additional guests on request</p>
          </div>

          {/* Season indicator */}
          {checkIn && (
            <div className={cn(
              'flex items-start gap-3 border px-4 py-3 bg-[var(--surface-2)] transition-all duration-300',
              `border-current/20`,
            )}>
              <span className="text-xl shrink-0">📅</span>
              <div>
                <p className={cn('text-sm font-medium', SEASON_LABELS[season].color)}>
                  {SEASON_LABELS[season].label}
                </p>
                <p className="text-[var(--text-muted)] text-xs mt-0.5">
                  {mult > 1
                    ? `+${((mult - 1) * 100).toFixed(0)}% seasonal premium applies`
                    : mult < 1
                    ? `${((1 - mult) * 100).toFixed(0)}% off — great time to visit!`
                    : 'Standard nightly rate — year-round pricing'}
                </p>
              </div>
            </div>
          )}

          {/* Seasonal guide */}
          <div className="border border-[var(--border)] p-4 bg-[var(--surface-2)]">
            <p className="section-label text-[0.55rem] mb-3">Seasonal Pricing Guide</p>
            <div className="space-y-2">
              {Object.entries(SEASON_LABELS).map(([key, { label, color, mult: m }]) => (
                <div key={key} className="flex items-center justify-between text-xs">
                  <span className={cn('font-medium', color)}>{label}</span>
                  <span className="text-[var(--text-muted)]">
                    {fmt(NIGHTLY_RATE_USD * m)}/night
                    {m !== 1 && (
                      <span className={cn('ml-1.5 text-[0.6rem]', m > 1 ? 'text-red-400' : 'text-sky-400')}>
                        ({m > 1 ? '+' : ''}{((m - 1) * 100).toFixed(0)}%)
                      </span>
                    )}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <button onClick={reset} className="btn-ghost w-full justify-center gap-2 text-[0.65rem]">
            <RefreshCw size={12} /> Reset Dates
          </button>
        </div>

        {/* ── Right: Breakdown ── */}
        <div className="border border-[var(--border)] bg-[var(--surface)] p-8 flex flex-col">
          {nights === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center gap-5 py-8">
              <div className="w-20 h-20 border border-[var(--border)] flex items-center justify-center">
                <Calculator size={28} className="text-[var(--gold)] opacity-40" />
              </div>
              <div>
                <p className="text-white font-serif text-xl font-light mb-2">See Your Total</p>
                <p className="text-[var(--text-muted)] text-sm leading-relaxed max-w-[220px] mx-auto">
                  Select check-in and check-out dates to get your personalised price.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-2 w-full mt-4">
                {[
                  { label: 'From', value: `${fmt(NIGHTLY_RATE_USD)}/night` },
                  { label: 'Min Stay', value: '1 night' },
                  { label: 'Cleaning', value: fmt(CLEANING_FEE_USD) },
                  { label: 'Service', value: fmt(SERVICE_FEE_USD) },
                ].map(({ label, value }) => (
                  <div key={label} className="border border-[var(--border)] p-3 text-center">
                    <p className="text-[var(--text-subtle)] text-[0.55rem] uppercase tracking-widest">{label}</p>
                    <p className="text-white text-sm font-medium mt-0.5">{value}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className={cn(
              'flex-1 flex flex-col gap-5 transition-all duration-500',
              animated ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4',
            )}>
              <div className="flex items-center justify-between">
                <p className="section-label">Your Estimate</p>
                <span className={cn('text-[0.6rem] font-semibold uppercase tracking-widest px-2 py-1 border border-current/30', SEASON_LABELS[season].color)}>
                  {SEASON_LABELS[season].label}
                </span>
              </div>

              {/* Rate hero */}
              <div className="border border-[var(--gold)]/30 bg-[rgba(201,150,58,0.05)] p-5">
                <p className="text-[var(--text-muted)] text-[0.65rem] uppercase tracking-widest mb-1">Rate per night</p>
                <div className="flex items-baseline gap-3">
                  <p className="font-serif text-4xl font-light text-white">{fmt(rate)}</p>
                  {mult !== 1 && (
                    <p className="text-[var(--text-muted)] text-sm line-through">{fmt(NIGHTLY_RATE_USD)}</p>
                  )}
                </div>
              </div>

              {/* Line items */}
              <div className="space-y-3">
                {[
                  { label: `${fmt(rate)} × ${nights} night${nights > 1 ? 's' : ''}`, value: nightsTotal },
                  { label: 'Cleaning fee',  value: CLEANING_FEE_USD },
                  { label: 'Service fee',   value: SERVICE_FEE_USD },
                ].map(({ label, value }) => (
                  <div key={label} className="flex justify-between text-sm border-b border-[var(--border)] pb-3">
                    <span className="text-[var(--text-muted)]">{label}</span>
                    <span className="text-white">{fmt(value)}</span>
                  </div>
                ))}
              </div>

              {/* Total */}
              <div className="border-t border-[var(--border)] pt-4 flex justify-between items-end">
                <div>
                  <p className="text-[var(--text-subtle)] text-[0.6rem] uppercase tracking-widest">Total</p>
                  <p className="text-[var(--text-muted)] text-xs mt-0.5">
                    {nights} night{nights > 1 ? 's' : ''} · {guests} guest{guests > 1 ? 's' : ''}
                  </p>
                </div>
                <p className="font-serif text-3xl text-white font-light">{fmt(subtotal)}</p>
              </div>

              {/* Per-guest breakdown */}
              <div className="grid grid-cols-3 gap-2 border border-[var(--border)] p-4 bg-[var(--surface-2)]">
                {[
                  { label: 'Nights',    value: String(nights) },
                  { label: 'Guests',    value: String(guests) },
                  { label: 'Per Guest', value: fmt(subtotal / guests) },
                ].map(({ label, value }) => (
                  <div key={label} className="text-center">
                    <p className="font-serif text-lg text-white font-light">{value}</p>
                    <p className="text-[var(--text-subtle)] text-[0.55rem] uppercase tracking-widest mt-0.5">{label}</p>
                  </div>
                ))}
              </div>

              <button onClick={onBookNow} className="btn-gold w-full justify-center gap-2 mt-auto">
                Book These Dates
                <ArrowRight size={14} />
              </button>

              <p className="text-[var(--text-subtle)] text-[0.6rem] text-center">
                Estimate only · Exact price confirmed at checkout · No charge until confirmed
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
