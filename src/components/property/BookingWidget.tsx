'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Users, Calendar, ChevronDown, Minus, Plus, Shield, Phone, CheckCircle, Lock, Star, Zap, Tag, CheckCircle2, XCircle } from 'lucide-react';
import { calculatePrice, formatCurrency, CONTACT_INFO } from '@/lib/data';
import { validatePromoCode, applyPromoCode, type PromoCode } from '@/lib/promoCodes';
import type { Property, Currency } from '@/types';
import { cn } from '@/lib/utils';

// ─── Currency helpers for EUR / GBP ──────────────────────────────────────────
const FX: Record<string, number> = { USD: 1, GHS: 15.8, EUR: 0.92, GBP: 0.79 };
const SYMBOLS: Record<string, string> = { USD: '$', GHS: '₵', EUR: '€', GBP: '£' };
const CURRENCY_OPTIONS: { code: Currency; flag: string; label: string }[] = [
  { code: 'USD', flag: '🇺🇸', label: 'USD' },
  { code: 'GHS', flag: '🇬🇭', label: 'GHS' },
  { code: 'EUR', flag: '🇪🇺', label: 'EUR' },
  { code: 'GBP', flag: '🇬🇧', label: 'GBP' },
];

function convertUSD(usdAmount: number, currency: Currency): number {
  return usdAmount * (FX[currency] ?? 1);
}
function fmtCurrency(amount: number, currency: Currency): string {
  return `${SYMBOLS[currency] ?? '$'}${Math.round(amount).toLocaleString('en-US')}`;
}
function displayPrice(property: Property, currency: Currency): string {
  if (currency === 'GHS') return formatCurrency(property.pricing.perNightGHS, 'GHS');
  if (currency === 'USD') return formatCurrency(property.pricing.perNight, 'USD');
  return fmtCurrency(convertUSD(property.pricing.perNight, currency), currency);
}

// ─── Simulated blocked dates ──────────────────────────────────────────────────
function getBlockedDates(): Date[] {
  const today = new Date();
  const blocked: Date[] = [];
  [[3,5],[12,14],[20,22],[28,30]].forEach(([start, end]) => {
    for (let d = start; d <= end; d++) {
      const date = new Date(today);
      date.setDate(today.getDate() + d);
      blocked.push(date);
    }
  });
  return blocked;
}

// ─── Trust Badges ─────────────────────────────────────────────────────────────
function TrustBadges() {
  const badges = [
    { icon: <Lock size={13} className="text-[var(--gold)]" />,        label: 'Secure Booking'  },
    { icon: <CheckCircle size={13} className="text-[var(--gold)]" />, label: 'Verified Host'   },
    { icon: <Zap size={13} className="text-[var(--gold)]" />,         label: 'Instant Confirm' },
    { icon: <Star size={13} className="text-[var(--gold)]" />,        label: '4.9★ Rated'     },
  ];
  return (
    <div className="grid grid-cols-2 gap-2 mt-4">
      {badges.map(({ icon, label }) => (
        <div key={label} className="flex items-center gap-2 border border-[var(--border)] px-3 py-2 bg-[var(--surface-2)]">
          {icon}
          <span className="text-[var(--text-muted)] text-[0.6rem] uppercase tracking-wider">{label}</span>
        </div>
      ))}
    </div>
  );
}

interface Props { property: Property }

export default function BookingWidget({ property }: Props) {
  const [checkIn,    setCheckIn]    = useState<Date | null>(null);
  const [checkOut,   setCheckOut]   = useState<Date | null>(null);
  const [guests,     setGuests]     = useState(2);
  const [currency,   setCurrency]   = useState<Currency>('USD');
  const [currOpen,   setCurrOpen]   = useState(false);
  const [guestsOpen, setGuestsOpen] = useState(false);
  const [sticky,     setSticky]     = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [pendingAction, setPendingAction] = useState<'reserve' | 'whatsapp' | null>(null);

  // Promo code state
  const [promoInput,  setPromoInput]  = useState('');
  const [appliedCode, setAppliedCode] = useState<PromoCode | null>(null);
  const [promoStatus, setPromoStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const router = useRouter();
  const blockedDates = useMemo(() => getBlockedDates(), []);

  useEffect(() => {
    const onScroll = () => setSticky(window.scrollY > 500);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Base pricing from data.ts (always in USD/GHS base)
  const basePricing = checkIn && checkOut
    ? calculatePrice(property, checkIn, checkOut, currency === 'GHS' ? 'GHS' : 'USD')
    : null;

  // Convert pricing to selected currency
  const pricing = useMemo(() => {
    if (!basePricing) return null;
    if (currency === 'USD' || currency === 'GHS') return basePricing;
    // EUR / GBP: convert from USD base
    const usdBase = calculatePrice(property, checkIn!, checkOut!, 'USD');
    return {
      nights:      usdBase.nights,
      nightlyRate: convertUSD(usdBase.nightlyRate, currency),
      nightsTotal: convertUSD(usdBase.nightsTotal, currency),
      cleaningFee: convertUSD(usdBase.cleaningFee, currency),
      serviceFee:  convertUSD(usdBase.serviceFee,  currency),
      total:       convertUSD(usdBase.total,        currency),
      currency,
    };
  }, [basePricing, currency, checkIn, checkOut, property]);

  // Promo-adjusted total
  const adjustedTotal = useMemo(() => {
    if (!pricing || !appliedCode) return pricing?.total ?? 0;
    return applyPromoCode(pricing.total, appliedCode).discountedTotal;
  }, [pricing, appliedCode]);

  const savings = useMemo(() => {
    if (!pricing || !appliedCode) return 0;
    return applyPromoCode(pricing.total, appliedCode).savings;
  }, [pricing, appliedCode]);

  const handleApplyPromo = () => {
    const code = validatePromoCode(promoInput);
    if (code) {
      setAppliedCode(code);
      setPromoStatus('success');
    } else {
      setAppliedCode(null);
      setPromoStatus('error');
    }
  };

  const changeGuests = (delta: number) =>
    setGuests(g => Math.max(1, Math.min(property.capacity.guests, g + delta)));

  const handleCheckInChange = (date: Date | null) => {
    setCheckIn(date);
    if (date && checkOut && checkOut <= date) setCheckOut(null);
  };

  const fmtAmt = (amount: number) =>
    (currency === 'USD' || currency === 'GHS')
      ? formatCurrency(amount, currency)
      : fmtCurrency(amount, currency);

  return (
    <div className={cn(
      'bg-[var(--surface)] border border-[var(--border)] transition-all duration-500',
      sticky ? 'lg:shadow-dark lg:border-[var(--border-bright)]' : '',
    )}>
      {/* ── Header ── */}
      <div className="p-6 border-b border-[var(--border)]">
        <div className="flex items-baseline justify-between gap-2">
          <div>
            <span className="font-serif text-3xl font-light text-white">
              {displayPrice(property, currency)}
            </span>
            <span className="text-[var(--text-muted)] text-sm"> / night</span>
          </div>

          {/* Currency selector */}
          <div className="relative">
            <button
              onClick={() => setCurrOpen(o => !o)}
              className="flex items-center gap-1.5 text-[0.65rem] tracking-widest uppercase border border-[var(--border)] px-3 py-1.5 text-[var(--gold)] hover:border-[var(--gold)] transition-colors duration-300"
            >
              {CURRENCY_OPTIONS.find(c => c.code === currency)?.flag}{' '}
              {currency}
              <ChevronDown size={10} className={cn('transition-transform duration-200', currOpen && 'rotate-180')} />
            </button>
            {currOpen && (
              <div className="absolute top-full right-0 mt-1 w-36 bg-[var(--surface)] border border-[var(--border)] z-30 shadow-xl">
                {CURRENCY_OPTIONS.map(({ code, flag, label }) => (
                  <button
                    key={code}
                    onClick={() => { setCurrency(code); setCurrOpen(false); }}
                    className={cn(
                      'w-full flex items-center gap-2 px-3 py-2 text-[0.65rem] uppercase tracking-widest hover:bg-[var(--surface-2)] transition-colors',
                      currency === code ? 'text-[var(--gold)]' : 'text-[var(--text-muted)]',
                    )}
                  >
                    <span>{flag}</span>
                    <span>{label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 mt-2">
          <span className="text-[var(--gold)] text-sm">★ {property.rating}</span>
          <span className="text-[var(--text-muted)] text-xs">· {property.reviewCount} reviews</span>
          <span className="text-[var(--text-subtle)] text-xs">· min {property.pricing.minNights} nights</span>
        </div>
      </div>

      <div className="p-6 space-y-4">
        {/* ── Availability Legend ── */}
        <div className="flex items-center gap-4 text-[0.6rem] text-[var(--text-muted)] border border-[var(--border)] px-3 py-2 bg-[var(--surface-2)]">
          <span className="flex items-center gap-1.5">
            <span className="inline-block w-3 h-3 rounded-full bg-[var(--gold)] opacity-80" />Available
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block w-3 h-3 rounded-full bg-red-800/80" />Unavailable
          </span>
        </div>

        {/* ── Date Inputs ── */}
        <div className="grid grid-cols-2 gap-2">
          <div className="flex flex-col gap-1">
            <label className="section-label text-[0.55rem]">Check-in</label>
            <div className="relative">
              <DatePicker
                selected={checkIn}
                onChange={handleCheckInChange}
                selectsStart startDate={checkIn} endDate={checkOut}
                minDate={new Date()} excludeDates={blockedDates}
                placeholderText="Select date" dateFormat="dd MMM yyyy"
                className="input-luxury text-sm cursor-pointer w-full"
                wrapperClassName="w-full"
              />
              <Calendar size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--gold)] pointer-events-none" />
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <label className="section-label text-[0.55rem]">Check-out</label>
            <div className="relative">
              <DatePicker
                selected={checkOut}
                onChange={(date) => setCheckOut(date)}
                selectsEnd startDate={checkIn} endDate={checkOut}
                minDate={checkIn ? new Date(checkIn.getTime() + 86400000 * property.pricing.minNights) : new Date()}
                excludeDates={blockedDates}
                placeholderText="Select date" dateFormat="dd MMM yyyy"
                className="input-luxury text-sm cursor-pointer w-full"
                wrapperClassName="w-full"
              />
              <Calendar size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--gold)] pointer-events-none" />
            </div>
          </div>
        </div>

        {/* ── Guests Selector ── */}
        <div className="flex flex-col gap-1">
          <label className="section-label text-[0.55rem]">Guests</label>
          <button
            onClick={() => setGuestsOpen(o => !o)}
            className="input-luxury flex items-center justify-between text-sm"
          >
            <div className="flex items-center gap-2">
              <Users size={13} className="text-[var(--gold)]" />
              <span>{guests} guest{guests > 1 ? 's' : ''}</span>
            </div>
            <ChevronDown size={14} className={`text-[var(--gold)] transition-transform duration-200 ${guestsOpen ? 'rotate-180' : ''}`} />
          </button>
          {guestsOpen && (
            <div className="border border-[var(--border)] bg-[var(--surface-2)] p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white text-sm font-medium">Guests</p>
                  <p className="text-[var(--text-muted)] text-xs">Max {property.capacity.guests}</p>
                </div>
                <div className="flex items-center gap-3">
                  <button onClick={() => changeGuests(-1)} disabled={guests <= 1}
                    className="w-8 h-8 border border-[var(--border)] flex items-center justify-center text-white hover:border-[var(--gold)] disabled:opacity-30 transition-colors">
                    <Minus size={13} />
                  </button>
                  <span className="text-white w-4 text-center font-medium">{guests}</span>
                  <button onClick={() => changeGuests(1)} disabled={guests >= property.capacity.guests}
                    className="w-8 h-8 border border-[var(--border)] flex items-center justify-center text-white hover:border-[var(--gold)] disabled:opacity-30 transition-colors">
                    <Plus size={13} />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ── Price Breakdown ── */}
        {pricing && (
          <div className="border border-[var(--border)] p-4 space-y-3 bg-[var(--surface-2)]" style={{ animation: 'fadeIn 0.4s ease' }}>
            <div className="flex justify-between text-sm text-[var(--text-muted)]">
              <span>{fmtAmt(pricing.nightlyRate)} × {pricing.nights} night{pricing.nights > 1 ? 's' : ''}</span>
              <span className="text-white">{fmtAmt(pricing.nightsTotal)}</span>
            </div>
            <div className="flex justify-between text-sm text-[var(--text-muted)]">
              <span>Cleaning fee</span>
              <span className="text-white">{fmtAmt(pricing.cleaningFee)}</span>
            </div>
            <div className="flex justify-between text-sm text-[var(--text-muted)]">
              <span>Service fee</span>
              <span className="text-white">{fmtAmt(pricing.serviceFee)}</span>
            </div>
            {appliedCode && savings > 0 && (
              <div className="flex justify-between text-sm text-emerald-400">
                <span>Promo: {appliedCode.label}</span>
                <span>−{fmtAmt(savings)}</span>
              </div>
            )}
            <div className="border-t border-[var(--border)] pt-3 flex justify-between">
              <span className="text-white font-medium">Total</span>
              <span className="font-serif text-xl text-white">
                {appliedCode ? fmtAmt(adjustedTotal) : fmtAmt(pricing.total)}
              </span>
            </div>
          </div>
        )}

        {/* ── Promo Code ── */}
        {pricing && (
          <div className="space-y-2">
            <label className="section-label text-[0.55rem] flex items-center gap-1.5">
              <Tag size={10} className="text-[var(--gold)]" />
              Promo Code
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={promoInput}
                onChange={e => { setPromoInput(e.target.value.toUpperCase()); setPromoStatus('idle'); }}
                placeholder="e.g. WELCOME10"
                className="input-luxury flex-1 text-xs uppercase tracking-wider"
                onKeyDown={e => e.key === 'Enter' && handleApplyPromo()}
              />
              <button
                onClick={handleApplyPromo}
                className="px-4 py-2 text-[0.65rem] uppercase tracking-widest border border-[var(--gold)] text-[var(--gold)] hover:bg-[rgba(201,150,58,0.1)] transition-colors duration-200 whitespace-nowrap"
              >
                Apply
              </button>
            </div>
            {promoStatus === 'success' && appliedCode && (
              <p className="text-emerald-400 text-[0.65rem] flex items-center gap-1.5">
                <CheckCircle2 size={11} />
                {appliedCode.label} applied — {appliedCode.description}
              </p>
            )}
            {promoStatus === 'error' && (
              <p className="text-red-400 text-[0.65rem] flex items-center gap-1.5">
                <XCircle size={11} />
                Invalid code. Try WELCOME10, GHANA20, MILEHIGH15 or SUMMER25.
              </p>
            )}
          </div>
        )}

        {/* ── CTA Buttons ── */}
        <div className="space-y-3">
          <button
            onClick={() => { setPendingAction('reserve'); setShowWarning(true); }}
            className="btn-gold w-full justify-center"
          >
            {checkIn && checkOut ? 'Reserve Now' : 'Check Availability'}
          </button>
          <button
            onClick={() => { setPendingAction('whatsapp'); setShowWarning(true); }}
            className="btn-ghost w-full justify-center"
          >
            <Phone size={13} />
            Book via WhatsApp
          </button>
        </div>

        <TrustBadges />

        <p className="text-[var(--text-subtle)] text-[0.6rem] text-center leading-relaxed">
          No charge until confirmed · Free cancellation 7+ days before check-in
        </p>
      </div>

      {/* ── Warning Modal ── */}
      {showWarning && (
        <div className="fixed inset-0 z-[500] flex items-center justify-center p-4 bg-obsidian/90 backdrop-blur-md">
          <div className="bg-[#800020] border border-white/10 p-8 max-w-md w-full text-center shadow-2xl animate-in fade-in zoom-in duration-300 rounded-[3%]">
            <div className="w-16 h-16 border border-white/20 flex items-center justify-center mx-auto mb-6">
              <Shield size={28} className="text-white" />
            </div>
            <h3 className="font-serif text-2xl text-white mb-4 font-light tracking-wide">Lease Requirement</h3>
            <p className="text-white/80 mb-8 leading-relaxed text-sm">
              Please be advised that this residency is available exclusively for long-term lease agreements.
              The initial mandatory term is 365 days (one year). Full payment for the annual term is required to secure the property.
            </p>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => {
                  setShowWarning(false);
                  if (pendingAction === 'reserve') {
                    router.push(`/booking?property=${property.id}&checkIn=${checkIn?.toISOString() ?? ''}&checkOut=${checkOut?.toISOString() ?? ''}&guests=${guests}`);
                  } else {
                    window.open(`https://wa.me/${CONTACT_INFO.whatsapp}?text=Hello%2C%20I%27d%20like%20to%20book%20${encodeURIComponent(property.name)}`, '_blank');
                  }
                }}
                className="bg-white text-[#800020] py-3 text-xs font-bold uppercase tracking-widest hover:bg-white/90 transition-colors"
              >
                I Understand &amp; Proceed
              </button>
              <button
                onClick={() => setShowWarning(false)}
                className="text-white/40 text-[0.65rem] uppercase tracking-widest hover:text-white transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
