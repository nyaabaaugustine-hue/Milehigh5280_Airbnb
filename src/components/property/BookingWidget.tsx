'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Users, Calendar, ChevronDown, Minus, Plus, Shield, Phone, CheckCircle, Lock, Star, Zap } from 'lucide-react';
import { calculatePrice, formatCurrency, CONTACT_INFO } from '@/lib/data';
import type { Property, Currency } from '@/types';
import { cn } from '@/lib/utils';

// ─── Simulated blocked dates (unavailable) ────────────────────────────────────
// In production these would come from an API / calendar sync
function getBlockedDates(): Date[] {
  const today = new Date();
  const blocked: Date[] = [];
  // Simulate a few booked windows
  const ranges = [
    [3, 5], [12, 14], [20, 22], [28, 30],
  ];
  ranges.forEach(([start, end]) => {
    for (let d = start; d <= end; d++) {
      const date = new Date(today);
      date.setDate(today.getDate() + d);
      blocked.push(date);
    }
  });
  return blocked;
}

// ─── Trust Badges (Feature 18) ────────────────────────────────────────────────
function TrustBadges() {
  const badges = [
    { icon: <Lock size={13} className="text-[var(--gold)]" />,         label: 'Secure Booking' },
    { icon: <CheckCircle size={13} className="text-[var(--gold)]" />,  label: 'Verified Host' },
    { icon: <Zap size={13} className="text-[var(--gold)]" />,          label: 'Instant Confirm' },
    { icon: <Star size={13} className="text-[var(--gold)]" />,         label: '4.9★ Rated' },
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

interface Props {
  property: Property;
}

export default function BookingWidget({ property }: Props) {
  const [checkIn,   setCheckIn]   = useState<Date | null>(null);
  const [checkOut,  setCheckOut]  = useState<Date | null>(null);
  const [guests,    setGuests]    = useState(2);
  const [currency,  setCurrency]  = useState<Currency>('USD');
  const [guestsOpen, setGuestsOpen] = useState(false);
  const [sticky,    setSticky]    = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [pendingAction, setPendingAction] = useState<'reserve' | 'whatsapp' | null>(null);
  const router = useRouter();

  // Feature #1: availability calendar blocked dates
  const blockedDates = useMemo(() => getBlockedDates(), []);

  useEffect(() => {
    const onScroll = () => setSticky(window.scrollY > 500);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const pricing = checkIn && checkOut
    ? calculatePrice(property, checkIn, checkOut, currency)
    : null;

  const changeGuests = (delta: number) => {
    setGuests(g => Math.max(1, Math.min(property.capacity.guests, g + delta)));
  };

  const handleCheckInChange = (date: Date | null) => {
    setCheckIn(date);
    // If checkout is before new checkin, clear it
    if (date && checkOut && checkOut <= date) setCheckOut(null);
  };

  return (
    <div
      className={cn(
        'bg-[var(--surface)] border border-[var(--border)] transition-all duration-500',
        sticky ? 'lg:shadow-dark lg:border-[var(--border-bright)]' : '',
      )}
    >
      {/* ── Header ── */}
      <div className="p-6 border-b border-[var(--border)]">
        <div className="flex items-baseline justify-between gap-2">
          <div>
            <span className="font-serif text-3xl font-light text-white">
              {formatCurrency(property.pricing[currency === 'GHS' ? 'perNightGHS' : 'perNight'], currency)}
            </span>
            <span className="text-[var(--text-muted)] text-sm"> / night</span>
          </div>
          {/* Currency toggle */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrency(c => c === 'USD' ? 'GHS' : 'USD')}
              className="text-[0.65rem] tracking-widest uppercase border border-[var(--border)] px-3 py-1.5 text-[var(--gold)] hover:border-[var(--gold)] transition-colors duration-300"
            >
              {currency === 'USD' ? '$ USD' : '₵ GHS'}
            </button>
            <span className="text-base" title="Ghana">🇬🇭</span>
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
          <span className="flex items-center gap-1.5">
            <span className="inline-block w-3 h-3 rounded-full bg-[var(--gold)]/30" />Selected
          </span>
        </div>

        {/* ── Date Inputs ── */}
        <div className="grid grid-cols-2 gap-2">
          {/* Check-in */}
          <div className="flex flex-col gap-1">
            <label className="section-label text-[0.55rem]">Check-in</label>
            <div className="relative">
              <DatePicker
                selected={checkIn}
                onChange={handleCheckInChange}
                selectsStart
                startDate={checkIn}
                endDate={checkOut}
                minDate={new Date()}
                excludeDates={blockedDates}
                placeholderText="Select date"
                dateFormat="dd MMM yyyy"
                className="input-luxury text-sm cursor-pointer w-full"
                wrapperClassName="w-full"
                calendarClassName="!font-sans"
                dayClassName={(date) => {
                  const isBlocked = blockedDates.some(
                    b => b.toDateString() === date.toDateString()
                  );
                  return isBlocked ? '!bg-red-900/60 !text-red-300 !cursor-not-allowed' : '';
                }}
              />
              <Calendar size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--gold)] pointer-events-none" />
            </div>
          </div>

          {/* Check-out */}
          <div className="flex flex-col gap-1">
            <label className="section-label text-[0.55rem]">Check-out</label>
            <div className="relative">
              <DatePicker
                selected={checkOut}
                onChange={(date) => setCheckOut(date)}
                selectsEnd
                startDate={checkIn}
                endDate={checkOut}
                minDate={checkIn ? new Date(checkIn.getTime() + 86400000 * property.pricing.minNights) : new Date()}
                excludeDates={blockedDates}
                placeholderText="Select date"
                dateFormat="dd MMM yyyy"
                className="input-luxury text-sm cursor-pointer w-full"
                wrapperClassName="w-full"
                dayClassName={(date) => {
                  const isBlocked = blockedDates.some(
                    b => b.toDateString() === date.toDateString()
                  );
                  return isBlocked ? '!bg-red-900/60 !text-red-300 !cursor-not-allowed' : '';
                }}
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
            aria-expanded={guestsOpen}
          >
            <div className="flex items-center gap-2">
              <Users size={13} className="text-[var(--gold)]" />
              <span>{guests} guest{guests > 1 ? 's' : ''}</span>
            </div>
            <ChevronDown
              size={14}
              className={`text-[var(--gold)] transition-transform duration-200 ${guestsOpen ? 'rotate-180' : ''}`}
            />
          </button>

          {/* Guests dropdown */}
          {guestsOpen && (
            <div className="border border-[var(--border)] bg-[var(--surface-2)] p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white text-sm font-medium">Guests</p>
                  <p className="text-[var(--text-muted)] text-xs">Max {property.capacity.guests}</p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => changeGuests(-1)}
                    disabled={guests <= 1}
                    className="w-8 h-8 border border-[var(--border)] flex items-center justify-center text-white hover:border-[var(--gold)] disabled:opacity-30 transition-colors"
                    aria-label="Decrease guests"
                  >
                    <Minus size={13} />
                  </button>
                  <span className="text-white w-4 text-center font-medium">{guests}</span>
                  <button
                    onClick={() => changeGuests(1)}
                    disabled={guests >= property.capacity.guests}
                    className="w-8 h-8 border border-[var(--border)] flex items-center justify-center text-white hover:border-[var(--gold)] disabled:opacity-30 transition-colors"
                    aria-label="Increase guests"
                  >
                    <Plus size={13} />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ── Price Breakdown ── */}
        {pricing && (
          <div className="border border-[var(--border)] p-4 space-y-3 bg-[var(--surface-2)]"
            style={{ animation: 'fadeIn 0.4s ease' }}>
            <div className="flex justify-between text-sm text-[var(--text-muted)]">
              <span>
                {formatCurrency(pricing.nightlyRate, currency)} × {pricing.nights} night{pricing.nights > 1 ? 's' : ''}
              </span>
              <span className="text-white">{formatCurrency(pricing.nightsTotal, currency)}</span>
            </div>
            <div className="flex justify-between text-sm text-[var(--text-muted)]">
              <span>Cleaning fee</span>
              <span className="text-white">{formatCurrency(pricing.cleaningFee, currency)}</span>
            </div>
            <div className="flex justify-between text-sm text-[var(--text-muted)]">
              <span>Service fee</span>
              <span className="text-white">{formatCurrency(pricing.serviceFee, currency)}</span>
            </div>
            <div className="border-t border-[var(--border)] pt-3 flex justify-between">
              <span className="text-white font-medium">Total</span>
              <span className="font-serif text-xl text-white">
                {formatCurrency(pricing.total, currency)}
              </span>
            </div>
          </div>
        )}

        {/* ── CTA Buttons ── */}
        <div className="space-y-3">
          <button
            onClick={() => {
              setPendingAction('reserve');
              setShowWarning(true);
            }}
            className="btn-gold w-full justify-center"
          >
            {checkIn && checkOut ? 'Reserve Now' : 'Check Availability'}
          </button>
          <button
            onClick={() => {
              setPendingAction('whatsapp');
              setShowWarning(true);
            }}
            className="btn-ghost w-full justify-center"
          >
            <Phone size={13} />
            Book via WhatsApp
          </button>
        </div>

        {/* Feature #18: Trust Badges */}
        <TrustBadges />

        <p className="text-[var(--text-subtle)] text-[0.6rem] text-center leading-relaxed">
          No charge until confirmed · Free cancellation 7+ days before check-in
        </p>
      </div>

      {/* ── Burgundy Warning Modal ── */}
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
                I Understand & Proceed
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
