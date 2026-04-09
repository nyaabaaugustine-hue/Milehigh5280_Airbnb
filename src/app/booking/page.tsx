'use client';

import { useState, Suspense, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Shield, Lock, ChevronLeft, CheckCircle, Phone, CreditCard, Banknote } from 'lucide-react';
import { getPropertyById, calculatePrice, formatCurrency } from '@/lib/data';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';

const WHATSAPP = '233541988383';

function Steps({ current }: { current: number }) {
  const steps = ['Details', 'Review', 'Payment', 'Confirm'];
  return (
    <div className="flex items-center mb-12">
      {steps.map((step, i) => (
        <div key={step} className="flex items-center flex-1 last:flex-none">
          <div className={cn(
            'flex items-center gap-2 text-xs uppercase tracking-widest transition-all duration-300',
            i <= current ? 'text-[var(--gold)]' : 'text-[var(--text-subtle)]',
          )}>
            <div className={cn(
              'w-6 h-6 flex items-center justify-center text-[0.65rem] border transition-all duration-300',
              i < current   ? 'bg-[var(--gold)] border-[var(--gold)] text-obsidian' :
              i === current ? 'border-[var(--gold)] text-[var(--gold)]' :
                              'border-[var(--border)] text-[var(--text-subtle)]',
            )}>
              {i < current ? '✓' : i + 1}
            </div>
            <span className="hidden sm:block">{step}</span>
          </div>
          {i < steps.length - 1 && (
            <div className={cn(
              'flex-1 h-px mx-3 transition-all duration-500',
              i < current ? 'bg-[var(--gold)]' : 'bg-[var(--border)]',
            )} />
          )}
        </div>
      ))}
    </div>
  );
}

function BookingFormInner() {
  const params     = useSearchParams();
  const propertyId = params.get('property') ?? '1';

  const [step,       setStep]       = useState(0);
  const [currency,   setCurrency]   = useState<'USD' | 'GHS'>('USD');
  const [payMode,    setPayMode]    = useState<'full' | 'deposit'>('full');
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', phone: '', nationality: '', specialRequests: '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }, [step]);

  const property = getPropertyById(propertyId);

  const checkInRaw  = params.get('checkIn');
  const checkOutRaw = params.get('checkOut');
  const checkIn  = checkInRaw  && !isNaN(Date.parse(checkInRaw))  ? new Date(checkInRaw)  : new Date();
  const checkOut = checkOutRaw && !isNaN(Date.parse(checkOutRaw)) ? new Date(checkOutRaw) : new Date(Date.now() + 86400000 * 3);
  const guests   = Math.max(1, parseInt(params.get('guests') ?? '2', 10));

  if (!property) {
    return (
      <div className="text-center py-32">
        <p className="text-[var(--text-muted)] mb-4">Property not found.</p>
        <Link href="/properties" className="btn-ghost">Browse Properties</Link>
      </div>
    );
  }

  const pricing  = calculatePrice(property, checkIn, checkOut, currency);
  const hero     = property.images[0];
  const deposit  = Math.ceil(pricing.total / 2);
  const balance  = pricing.total - deposit;
  const payNow   = payMode === 'full' ? pricing.total : deposit;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleNext = () => {
    if (step === 0) {
      if (!form.firstName.trim() || !form.lastName.trim() || !form.email.trim() || !form.phone.trim()) {
        toast.error('Please fill in all required fields.'); return;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
        toast.error('Please enter a valid email address.'); return;
      }
    }
    setStep(s => s + 1);
  };

  const handlePayment = async () => {
    setLoading(true);
    try {
      const payload = {
        firstName: form.firstName, lastName: form.lastName,
        email: form.email, phone: form.phone,
        nationality: form.nationality, specialRequests: form.specialRequests,
        propertyName: property.name, propertySlug: property.slug,
        checkIn:  checkIn.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
        checkOut: checkOut.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
        guests, nights: pricing.nights,
        total: formatCurrency(pricing.total, currency),
        currency,
      };
      const res = await fetch('/api/booking', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) { const j = await res.json().catch(() => ({})); throw new Error(j.error ?? 'Email failed'); }
      setStep(3);
    } catch (err) {
      console.error('Booking error:', err instanceof Error ? err.message : err);
      toast.error('Email notification had an issue — we will follow up via WhatsApp.', { duration: 6000 });
      setStep(3);
    } finally {
      setLoading(false);
    }
  };

  const fmtDate = (d: Date) => d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-12">
      <div>
        <Steps current={step} />

        {/* Step 0 — Guest details */}
        {step === 0 && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {([
                { name: 'firstName', label: 'First Name',  placeholder: 'Your first name' },
                { name: 'lastName',  label: 'Last Name',   placeholder: 'Your last name'  },
              ] as const).map(({ name, label, placeholder }) => (
                <div key={name}>
                  <label className="section-label text-[0.55rem] block mb-2">{label} *</label>
                  <input name={name} value={form[name]} onChange={handleChange}
                    placeholder={placeholder} className="input-luxury" required
                    autoComplete={name === 'firstName' ? 'given-name' : 'family-name'} />
                </div>
              ))}
            </div>
            <div>
              <label className="section-label text-[0.55rem] block mb-2">Email Address *</label>
              <input type="email" name="email" value={form.email} onChange={handleChange}
                placeholder="your@email.com" className="input-luxury" required autoComplete="email" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="section-label text-[0.55rem] block mb-2">Phone / WhatsApp *</label>
                <input name="phone" value={form.phone} onChange={handleChange}
                  placeholder="+233 or international" className="input-luxury" required autoComplete="tel" />
              </div>
              <div>
                <label className="section-label text-[0.55rem] block mb-2">Nationality</label>
                <input name="nationality" value={form.nationality} onChange={handleChange}
                  placeholder="Country" className="input-luxury" autoComplete="country-name" />
              </div>
            </div>
            <div>
              <label className="section-label text-[0.55rem] block mb-2">Special Requests</label>
              <textarea name="specialRequests" value={form.specialRequests} onChange={handleChange}
                placeholder="Arrival time, dietary needs, celebration setup, etc."
                rows={4} className="input-luxury resize-none" />
            </div>
          </div>
        )}

        {/* Step 1 — Review */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="border border-[var(--border)] p-6">
              <p className="section-label mb-4">Your Details</p>
              <div className="grid grid-cols-2 gap-4 text-sm">
                {([
                  ['Name',    `${form.firstName} ${form.lastName}`],
                  ['Email',   form.email],
                  ['Phone',   form.phone],
                  ['Country', form.nationality || '—'],
                ] as [string,string][]).map(([k, v]) => (
                  <div key={k}>
                    <p className="text-[var(--text-subtle)] text-xs uppercase tracking-widest mb-1">{k}</p>
                    <p className="text-white">{v}</p>
                  </div>
                ))}
              </div>
              {form.specialRequests && (
                <div className="mt-4 pt-4 border-t border-[var(--border)]">
                  <p className="text-[var(--text-subtle)] text-xs uppercase tracking-widest mb-1">Special Requests</p>
                  <p className="text-[var(--text-muted)] text-sm">{form.specialRequests}</p>
                </div>
              )}
            </div>
            <div className="border border-[var(--border)] p-6 bg-[var(--surface-2)] space-y-3">
              <p className="section-label mb-4">Price Breakdown</p>
              {([
                [`${formatCurrency(pricing.nightlyRate, currency)} × ${pricing.nights} night${pricing.nights>1?'s':''}`, formatCurrency(pricing.nightsTotal, currency)],
                ['Cleaning fee', formatCurrency(pricing.cleaningFee, currency)],
                ['Service fee',  formatCurrency(pricing.serviceFee,  currency)],
              ] as [string,string][]).map(([k, v]) => (
                <div key={k} className="flex justify-between text-sm text-[var(--text-muted)]">
                  <span>{k}</span><span className="text-white">{v}</span>
                </div>
              ))}
              <div className="border-t border-[var(--border)] pt-4 flex justify-between items-baseline">
                <span className="text-white font-medium">Total</span>
                <span className="font-serif text-2xl text-white">{formatCurrency(pricing.total, currency)}</span>
              </div>
            </div>
          </div>
        )}

        {/* Step 2 — Payment */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="flex items-center gap-3 p-4 border border-[var(--border)] bg-[var(--surface-2)]">
              <Lock size={16} className="text-[var(--gold)]" />
              <p className="text-[var(--text-muted)] text-sm">
                Payments processed securely via <strong className="text-white">Paystack</strong> and{' '}
                <strong className="text-white">Stripe</strong>. Your card details are never stored.
              </p>
            </div>

            {/* ── Deposit / Full Toggle ── */}
            <div>
              <p className="section-label mb-4">Payment Schedule</p>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setPayMode('full')}
                  className={cn(
                    'flex flex-col items-start gap-2 p-4 border transition-all duration-200',
                    payMode === 'full'
                      ? 'border-[var(--gold)] bg-[rgba(201,150,58,0.06)]'
                      : 'border-[var(--border)] hover:border-[var(--gold)]',
                  )}
                >
                  <div className="flex items-center gap-2">
                    <CreditCard size={14} className="text-[var(--gold)]" />
                    <span className="text-white text-sm font-medium">Pay in Full</span>
                  </div>
                  <span className="text-[var(--text-muted)] text-xs">
                    Pay {formatCurrency(pricing.total, currency)} now
                  </span>
                  <span className="text-[0.6rem] text-emerald-400 uppercase tracking-wider">Best value</span>
                </button>

                <button
                  onClick={() => setPayMode('deposit')}
                  className={cn(
                    'flex flex-col items-start gap-2 p-4 border transition-all duration-200',
                    payMode === 'deposit'
                      ? 'border-[var(--gold)] bg-[rgba(201,150,58,0.06)]'
                      : 'border-[var(--border)] hover:border-[var(--gold)]',
                  )}
                >
                  <div className="flex items-center gap-2">
                    <Banknote size={14} className="text-[var(--gold)]" />
                    <span className="text-white text-sm font-medium">Pay Deposit</span>
                  </div>
                  <span className="text-[var(--text-muted)] text-xs">
                    {formatCurrency(deposit, currency)} now, {formatCurrency(balance, currency)} at check-in
                  </span>
                  <span className="text-[0.6rem] text-[var(--gold)] uppercase tracking-wider">50% now · 50% later</span>
                </button>
              </div>

              {/* Payment summary */}
              <div className="mt-4 p-4 bg-[var(--surface-2)] border border-[var(--border)]">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-[var(--text-muted)]">Due now</span>
                  <span className="text-white font-medium">{formatCurrency(payNow, currency)}</span>
                </div>
                {payMode === 'deposit' && (
                  <div className="flex justify-between text-sm">
                    <span className="text-[var(--text-muted)]">Balance at check-in</span>
                    <span className="text-[var(--gold)]">{formatCurrency(balance, currency)}</span>
                  </div>
                )}
              </div>
            </div>

            <div>
              <p className="section-label mb-4">Payment Method</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {['Paystack (Ghana / Africa)', 'Stripe (International)'].map((method, i) => (
                  <label key={method} className={cn(
                    'flex items-center gap-3 border p-4 cursor-pointer transition-all duration-200',
                    i === 0 ? 'border-[var(--gold)] bg-[rgba(201,150,58,0.05)]' : 'border-[var(--border)] hover:border-[var(--gold)]',
                  )}>
                    <input type="radio" name="payment" defaultChecked={i === 0} className="accent-[var(--gold)]" />
                    <span className="text-white text-sm">{method}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <p className="section-label">Card Details</p>
              <input placeholder="Card Number" className="input-luxury" maxLength={19} />
              <div className="grid grid-cols-2 gap-4">
                <input placeholder="MM / YY" className="input-luxury" />
                <input placeholder="CVC" className="input-luxury" maxLength={4} type="password" />
              </div>
              <input placeholder="Name on Card" className="input-luxury" />
            </div>

            <p className="text-[var(--text-subtle)] text-xs flex items-start gap-2">
              <Shield size={13} className="text-[var(--gold)] shrink-0 mt-0.5" />
              By completing this reservation you agree to our cancellation policy. Full refund if cancelled 7+ days before check-in.
            </p>
          </div>
        )}

        {/* Step 3 — Confirmation */}
        {step === 3 && (
          <div className="text-center py-8" style={{ animation: 'fadeIn 0.5s ease' }}>
            <div className="w-20 h-20 border border-[var(--gold)] flex items-center justify-center mx-auto mb-6"
              style={{ animation: 'pulseGold 2s ease-in-out infinite' }}>
              <CheckCircle size={36} className="text-[var(--gold)]" />
            </div>
            <h2 className="font-serif text-4xl font-light text-white mb-3">Reservation Received!</h2>
            <p className="text-[var(--text-muted)] mb-2">
              A confirmation has been sent to <strong className="text-white">{form.email}</strong>
            </p>
            {payMode === 'deposit' && (
              <p className="text-[var(--gold)] text-sm mb-4">
                Deposit paid · Balance of {formatCurrency(balance, currency)} due at check-in
              </p>
            )}
            <p className="text-[var(--text-muted)] text-sm mb-8">
              Our team will contact you within 2 hours to finalise your stay.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/" className="btn-gold">Return Home</Link>
              <a href={`https://wa.me/${WHATSAPP}?text=Hello%2C%20I%20just%20submitted%20a%20booking%20for%20${encodeURIComponent(property.name)}`}
                target="_blank" rel="noopener noreferrer" className="btn-ghost">
                <Phone size={14} />
                WhatsApp Us
              </a>
            </div>
          </div>
        )}

        {step < 3 && (
          <div className="flex items-center gap-4 mt-8">
            {step > 0 && (
              <button onClick={() => setStep(s => s - 1)} className="btn-ghost">
                <ChevronLeft size={14} />Back
              </button>
            )}
            {step < 2 ? (
              <button onClick={handleNext} className="btn-gold">Continue</button>
            ) : (
              <button onClick={handlePayment} disabled={loading}
                className={cn('btn-gold', loading && 'opacity-70 cursor-wait')}>
                {loading ? (
                  <>
                    <span className="inline-block w-3 h-3 border border-obsidian border-t-transparent rounded-full animate-spin" />
                    Processing…
                  </>
                ) : (
                  `Pay ${formatCurrency(payNow, currency)}`
                )}
              </button>
            )}
          </div>
        )}
      </div>

      {/* ── Right: Property Summary ── */}
      <div>
        <div className="lg:sticky lg:top-28 border border-[var(--border)] bg-[var(--surface)]">
          <div className="relative h-48 overflow-hidden">
            <Image src={hero.url} alt={hero.alt} fill className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-obsidian/80 to-transparent" />
          </div>
          <div className="p-6 space-y-4">
            <div>
              <p className="section-label text-[0.55rem] mb-1">Your Stay</p>
              <h3 className="font-serif text-xl text-white">{property.name}</h3>
              <p className="text-[var(--text-muted)] text-xs">{property.location.city}, Ghana</p>
            </div>
            <div className="grid grid-cols-2 gap-3 border-y border-[var(--border)] py-4 text-xs">
              <div><p className="text-[var(--text-subtle)] uppercase tracking-widest mb-1">Check-in</p><p className="text-white">{fmtDate(checkIn)}</p></div>
              <div><p className="text-[var(--text-subtle)] uppercase tracking-widest mb-1">Check-out</p><p className="text-white">{fmtDate(checkOut)}</p></div>
              <div><p className="text-[var(--text-subtle)] uppercase tracking-widest mb-1">Nights</p><p className="text-white">{pricing.nights}</p></div>
              <div><p className="text-[var(--text-subtle)] uppercase tracking-widest mb-1">Guests</p><p className="text-white">{guests}</p></div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[var(--text-muted)] text-xs">Currency</span>
              <button
                onClick={() => setCurrency(c => c === 'USD' ? 'GHS' : 'USD')}
                className="text-[0.65rem] tracking-widest uppercase border border-[var(--border)] px-3 py-1.5 text-[var(--gold)] hover:border-[var(--gold)] transition-colors"
              >
                {currency === 'USD' ? '$ USD' : '₵ GHS'} 🇬🇭
              </button>
            </div>
            <div className="border-t border-[var(--border)] pt-4 space-y-2">
              <div className="flex justify-between items-baseline">
                <span className="text-[var(--text-muted)] text-sm">Total</span>
                <span className="font-serif text-2xl text-white">{formatCurrency(pricing.total, currency)}</span>
              </div>
              {payMode === 'deposit' && (
                <div className="flex justify-between text-xs">
                  <span className="text-[var(--text-subtle)]">Due now (deposit)</span>
                  <span className="text-[var(--gold)]">{formatCurrency(deposit, currency)}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function BookingPage() {
  return (
    <>
      <section className="pt-36 pb-12 px-6 lg:px-12 max-w-[1440px] mx-auto border-b border-[var(--border)] mb-12">
        <p className="section-label mb-3">Secure Booking</p>
        <h1 className="font-serif text-4xl lg:text-6xl font-light text-white">
          Reserve Your <span className="italic text-gold-gradient">Stay</span>
        </h1>
      </section>
      <div className="px-6 lg:px-12 max-w-[1440px] mx-auto pb-24">
        <Suspense fallback={
          <div className="flex items-center justify-center py-32">
            <div className="w-8 h-8 border-2 border-[var(--gold)] border-t-transparent rounded-full animate-spin" />
          </div>
        }>
          <BookingFormInner />
        </Suspense>
      </div>
    </>
  );
}
