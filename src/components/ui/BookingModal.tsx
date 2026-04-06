'use client';

import { useState, useEffect } from 'react';
import { X, Calendar, User, Mail, Phone, MessageSquare, CreditCard, CheckCircle, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';
import { USD_TO_GHS, CONTACT_INFO } from '@/lib/data';
import toast from 'react-hot-toast';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type Step = 'warning' | 'details' | 'payment' | 'success';
type PayMethod = 'card' | 'paypal';

interface BookingForm {
  name: string; email: string; phone: string;
  checkIn: string; checkOut: string; guests: string; specialRequests: string;
}
interface PaymentForm {
  cardNumber: string; cardName: string; expiry: string; cvv: string;
}

const WaIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" xmlns="http://www.w3.org/2000/svg">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

export default function BookingModal({ isOpen, onClose }: BookingModalProps) {
  const [step, setStep] = useState<Step>('warning');
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [payMethod, setPayMethod] = useState<PayMethod>('card');

  const [form, setForm] = useState<BookingForm>({
    name: '', email: '', phone: '', checkIn: '', checkOut: '', guests: '1', specialRequests: '',
  });
  const [payment, setPayment] = useState<PaymentForm>({
    cardNumber: '', cardName: '', expiry: '', cvv: '',
  });
  const [errors, setErrors] = useState<Partial<BookingForm>>({});

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setStep('warning');
      setPayMethod('card');
      setForm({ name: '', email: '', phone: '', checkIn: '', checkOut: '', guests: '1', specialRequests: '' });
      setErrors({});
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const validate = () => {
    const e: Partial<BookingForm> = {};
    if (!form.name.trim())  e.name = 'Full name is required';
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Valid email required';
    if (!form.phone.trim()) e.phone = 'Phone number is required';
    if (!form.checkIn)      e.checkIn = 'Check-in date required';
    if (!form.checkOut)     e.checkOut = 'Check-out date required';
    if (form.checkIn && form.checkOut && form.checkIn >= form.checkOut) e.checkOut = 'Check-out must be after check-in';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const getNights = () => {
    if (!form.checkIn || !form.checkOut) return 0;
    return Math.max(0, Math.round(
      (new Date(form.checkOut).getTime() - new Date(form.checkIn).getTime()) / 86400000
    ));
  };

  const nights       = getNights();
  const ratePerNight = 250;
  const cleaningFee  = 30;
  const total        = nights * ratePerNight + cleaningFee;
  const totalGHS     = Math.round(total * USD_TO_GHS);

  const handleDetails = () => { if (validate()) setStep('payment'); };

  // Send booking data to API (email to admin + guest auto-reply)
  const sendBookingEmail = async () => {
    const nameParts = form.name.trim().split(' ');
    const firstName = nameParts[0];
    const lastName  = nameParts.slice(1).join(' ') || '-';

    try {
      const res = await fetch('/api/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName,
          lastName,
          email:          form.email,
          phone:          form.phone,
          nationality:    '',
          specialRequests: form.specialRequests,
          propertyName:   'Milehigh5280 🌴 – Ayi Mensah',
          propertySlug:   'the-palm-ayi-mensah',
          checkIn:        form.checkIn,
          checkOut:       form.checkOut,
          guests:         Number(form.guests),
          nights,
          total:          `$${total} / GHS ${totalGHS.toLocaleString()}`,
          currency:       'USD',
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        console.warn('Booking email warning:', data.error);
        // Don't block success UX for email failures
      }
    } catch (err) {
      console.warn('Booking email failed (non-blocking):', err);
    }
  };

  // Also send via WhatsApp as backup
  const sendWhatsApp = () => {
    const msg = encodeURIComponent(
      `🌴 *New Booking — Milehigh5280, Ayi Mensah*\n\n` +
      `*Guest:* ${form.name}\n*Email:* ${form.email}\n*Phone:* ${form.phone}\n` +
      `*Check-in:* ${form.checkIn}\n*Check-out:* ${form.checkOut}\n` +
      `*Guests:* ${form.guests}\n*Nights:* ${nights}\n` +
      `*Total:* GHS ${totalGHS.toLocaleString()} ($${total})\n` +
      (form.specialRequests ? `*Requests:* ${form.specialRequests}` : '')
    );
    window.open(`https://wa.me/${CONTACT_INFO.whatsapp}?text=${msg}`, '_blank');
  };

  const handlePayment = async () => {
    setPaymentLoading(true);
    try {
      // Simulate payment processing (replace with real Paystack later)
      await new Promise(r => setTimeout(r, 2000));
      // Fire email notification (non-blocking)
      await sendBookingEmail();
      setStep('success');
      sendWhatsApp();
      toast.success('Booking confirmed! Check your email for details.');
    } catch {
      toast.error('Something went wrong. Please try WhatsApp instead.');
    } finally {
      setPaymentLoading(false);
    }
  };

  const formatCard   = (v: string) => v.replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim().slice(0, 19);
  const formatExpiry = (v: string) => v.replace(/\D/g, '').replace(/(\d{2})(\d)/, '$1/$2').slice(0, 5);

  if (!isOpen) return null;

  const visibleSteps: Step[] = ['details', 'payment', 'success'];

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      style={{ animation: 'fadeIn 0.2s ease' }}
    >
      <div className="absolute inset-0 bg-[#080808]/90 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />

      <div
        className="relative w-full max-w-lg max-h-[92vh] flex flex-col bg-[var(--surface)] border border-[var(--border)] shadow-2xl overflow-hidden"
        style={{ animation: 'slideUp 0.35s cubic-bezier(0.4,0,0.2,1)' }}
        role="dialog"
        aria-modal="true"
        aria-label="Booking form"
      >
        {/* ── Sticky Header ── */}
        {step !== 'warning' && (
          <div className="shrink-0 px-6 pt-5 pb-4 border-b border-[var(--border)] flex items-start justify-between bg-[var(--surface)]">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                {visibleSteps.map((s, i) => {
                  const idx = visibleSteps.indexOf(step);
                  const isDone    = i < idx;
                  const isCurrent = s === step;
                  return (
                    <div key={s} className="flex items-center gap-2">
                      <div className={cn(
                        'w-5 h-5 rounded-full flex items-center justify-center text-[0.6rem] font-bold transition-all duration-300',
                        isCurrent ? 'bg-[var(--gold)] text-[#080808]' :
                        isDone    ? 'bg-[var(--gold)]/30 text-[var(--gold)]' :
                                    'bg-[var(--surface-3)] text-[var(--text-subtle)]',
                      )}>
                        {isDone ? '✓' : i + 1}
                      </div>
                      {i < visibleSteps.length - 1 && (
                        <div className={cn('w-6 h-px transition-colors duration-300', isDone ? 'bg-[var(--gold)]' : 'bg-[var(--border)]')} />
                      )}
                    </div>
                  );
                })}
              </div>
              <h2 className="font-serif text-xl font-light text-[var(--text-primary)]">
                {step === 'details' ? 'Reserve Your Stay' : step === 'payment' ? 'Secure Payment' : 'Booking Confirmed!'}
              </h2>
              <p className="text-[var(--text-muted)] text-xs mt-0.5">Milehigh5280 🌴 · Ayi Mensah, Milehigh Properties</p>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center border border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:border-[var(--gold)] transition-colors duration-200 shrink-0 mt-1"
            >
              <X size={14} />
            </button>
          </div>
        )}

        {/* ── Scrollable Body ── */}
        <div className="overflow-y-auto flex-1">

          {/* STEP 0 — Warning */}
          {step === 'warning' && (
            <div className="bg-[#800020] p-8 lg:p-10 text-center text-white min-h-[360px] flex flex-col justify-center">
              <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center border border-white/20 text-white/60 hover:text-white transition-colors">
                <X size={14} />
              </button>
              <div className="w-16 h-16 border border-white/20 flex items-center justify-center mx-auto mb-6">
                <Shield size={32} />
              </div>
              <h3 className="font-serif text-2xl mb-4 font-light tracking-wide">Important Notice</h3>
              <p className="text-white/80 mb-8 leading-relaxed text-sm max-w-sm mx-auto">
                Please be advised that this property is available exclusively for long-term residential leasing. 
                A minimum mandatory residency period of 365 days (one year) applies to all agreements. 
                By proceeding, you formally acknowledge that full payment for the initial annual term is required 
                to secure and finalize your reservation.
              </p>
              <button
                onClick={() => setStep('details')}
                className="bg-white text-[#800020] w-full max-w-xs mx-auto py-4 text-xs font-bold uppercase tracking-[0.2em] hover:bg-white/90 transition-colors"
              >
                I Understand — Proceed
              </button>
            </div>
          )}

          {/* STEP 1 — Details */}
          {step === 'details' && (
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[0.65rem] tracking-widest uppercase text-[var(--gold)] mb-1.5">Full Name *</label>
                  <div className="relative">
                    <User size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-subtle)]" />
                    <input type="text" className={cn('input-luxury pl-9', errors.name && 'border-red-500/60')}
                      placeholder="John Mensah" value={form.name}
                      onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
                  </div>
                  {errors.name && <p className="text-red-400 text-[0.65rem] mt-1">{errors.name}</p>}
                </div>
                <div>
                  <label className="block text-[0.65rem] tracking-widest uppercase text-[var(--gold)] mb-1.5">Email *</label>
                  <div className="relative">
                    <Mail size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-subtle)]" />
                    <input type="email" className={cn('input-luxury pl-9', errors.email && 'border-red-500/60')}
                      placeholder="john@example.com" value={form.email}
                      onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
                  </div>
                  {errors.email && <p className="text-red-400 text-[0.65rem] mt-1">{errors.email}</p>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[0.65rem] tracking-widest uppercase text-[var(--gold)] mb-1.5">Phone *</label>
                  <div className="relative">
                    <Phone size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-subtle)]" />
                    <input type="tel" className={cn('input-luxury pl-9', errors.phone && 'border-red-500/60')}
                      placeholder="+233 XX XXX XXXX" value={form.phone}
                      onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
                  </div>
                  {errors.phone && <p className="text-red-400 text-[0.65rem] mt-1">{errors.phone}</p>}
                </div>
                <div>
                  <label className="block text-[0.65rem] tracking-widest uppercase text-[var(--gold)] mb-1.5">Guests</label>
                  <select className="input-luxury" value={form.guests}
                    onChange={e => setForm(f => ({ ...f, guests: e.target.value }))}>
                    {[1,2,3,4].map(n => <option key={n} value={n}>{n} Guest{n > 1 ? 's' : ''}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[0.65rem] tracking-widest uppercase text-[var(--gold)] mb-1.5">Check-In *</label>
                  <div className="relative">
                    <Calendar size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-subtle)]" />
                    <input type="date" className={cn('input-luxury pl-9', errors.checkIn && 'border-red-500/60')}
                      min={new Date().toISOString().split('T')[0]} value={form.checkIn}
                      onChange={e => setForm(f => ({ ...f, checkIn: e.target.value }))} />
                  </div>
                  {errors.checkIn && <p className="text-red-400 text-[0.65rem] mt-1">{errors.checkIn}</p>}
                </div>
                <div>
                  <label className="block text-[0.65rem] tracking-widest uppercase text-[var(--gold)] mb-1.5">Check-Out *</label>
                  <div className="relative">
                    <Calendar size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-subtle)]" />
                    <input type="date" className={cn('input-luxury pl-9', errors.checkOut && 'border-red-500/60')}
                      min={form.checkIn || new Date().toISOString().split('T')[0]} value={form.checkOut}
                      onChange={e => setForm(f => ({ ...f, checkOut: e.target.value }))} />
                  </div>
                  {errors.checkOut && <p className="text-red-400 text-[0.65rem] mt-1">{errors.checkOut}</p>}
                </div>
              </div>

              <div>
                <label className="block text-[0.65rem] tracking-widest uppercase text-[var(--gold)] mb-1.5">Special Requests</label>
                <div className="relative">
                  <MessageSquare size={13} className="absolute left-3 top-3.5 text-[var(--text-subtle)]" />
                  <textarea className="input-luxury pl-9 resize-none" rows={3}
                    placeholder="Early check-in, dietary needs, special arrangements..."
                    value={form.specialRequests}
                    onChange={e => setForm(f => ({ ...f, specialRequests: e.target.value }))} />
                </div>
              </div>

              {nights > 0 && (
                <div className="bg-[var(--surface-2)] border border-[var(--border)] p-4">
                  <p className="section-label mb-3">Price Summary</p>
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-sm text-[var(--text-muted)]">
                      <span>${ratePerNight} × {nights} night{nights > 1 ? 's' : ''}</span>
                      <span>${nights * ratePerNight}</span>
                    </div>
                    <div className="flex justify-between text-sm text-[var(--text-muted)]">
                      <span>Cleaning fee</span><span>${cleaningFee}</span>
                    </div>
                    <div className="flex justify-between font-medium border-t border-[var(--border)] pt-2 mt-2">
                      <span className="text-[var(--text-primary)]">Total</span>
                      <span className="text-[var(--gold)]">
                        ${total}{' '}
                        <span className="text-[var(--text-muted)] text-xs font-normal">≈ GHS {totalGHS.toLocaleString()}</span>
                      </span>
                    </div>
                  </div>
                </div>
              )}

              <button onClick={handleDetails} className="btn-gold w-full justify-center mt-2">
                Continue to Deposite
              </button>
            </div>
          )}

          {/* STEP 2 — Payment */}
          {step === 'payment' && (
            <div className="p-6 space-y-4">
              {/* Payment method tabs */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setPayMethod('card')}
                  className={cn(
                    'flex items-center justify-center gap-2 py-3 border text-xs font-medium uppercase tracking-widest transition-all duration-200',
                    payMethod === 'card'
                      ? 'border-[var(--gold)] bg-[rgba(201,150,58,0.08)] text-[var(--gold)]'
                      : 'border-[var(--border)] text-[var(--text-muted)] hover:border-[var(--gold)]/50',
                  )}
                >
                  <CreditCard size={13} />
                  Card
                </button>
                <button
                  onClick={() => setPayMethod('paypal')}
                  className={cn(
                    'flex items-center justify-center gap-2 py-3 border text-xs font-medium uppercase tracking-widest transition-all duration-200',
                    payMethod === 'paypal'
                      ? 'border-[#003087] bg-[rgba(0,48,135,0.12)] text-[#009CDE]'
                      : 'border-[var(--border)] text-[var(--text-muted)] hover:border-[#003087]/50',
                  )}
                >
                  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" xmlns="http://www.w3.org/2000/svg">
                    <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106zm14.146-14.42a3.35 3.35 0 0 0-.607-.541c-.013.076-.026.175-.041.254-.59 3.025-2.566 6.182-8.558 6.182H9.825l-1.353 8.563h3.918c.441 0 .817-.32.887-.757l.036-.189 1.398-8.859.089-.49c.07-.437.446-.757.887-.757h.558c3.617 0 6.445-1.469 7.273-5.718a4.96 4.96 0 0 0-.296-1.688z"/>
                  </svg>
                  PayPal
                </button>
              </div>

              {/* Amount due */}
              <div className="text-center py-2 border border-[var(--border)] bg-[var(--surface-2)]">
                <p className="text-[var(--text-muted)] text-xs">Amount due</p>
                <p className="font-serif text-3xl font-light text-[var(--text-primary)]">
                  ${total} <span className="text-[var(--gold)] text-lg">/ GHS {totalGHS.toLocaleString()}</span>
                </p>
                <p className="text-[var(--text-muted)] text-xs mt-1">
                  {nights} night{nights > 1 ? 's' : ''} · {form.checkIn} → {form.checkOut}
                </p>
              </div>

              {/* Card fields */}
              {payMethod === 'card' && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 bg-[var(--surface-2)] border border-[var(--border)] px-4 py-2.5">
                    <div className="w-7 h-5 bg-[#00C3F7] flex items-center justify-center rounded-sm shrink-0">
                      <span className="text-white text-[0.45rem] font-black">P</span>
                    </div>
                    <span className="text-[var(--text-muted)] text-xs">Secured by <strong className="text-[var(--text-primary)]">Paystack</strong></span>
                    <div className="ml-auto flex items-center gap-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
                      <span className="text-green-400 text-[0.6rem]">Encrypted</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-[0.65rem] tracking-widest uppercase text-[var(--gold)] mb-1.5">Card Number</label>
                    <div className="relative">
                      <CreditCard size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-subtle)]" />
                      <input type="text" className="input-luxury pl-9" placeholder="1234 5678 9012 3456"
                        value={payment.cardNumber} maxLength={19}
                        onChange={e => setPayment(p => ({ ...p, cardNumber: formatCard(e.target.value) }))} />
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-1">
                        {['VISA','MC'].map(b => (
                          <span key={b} className="text-[0.5rem] border border-[var(--border)] px-1 py-0.5 text-[var(--text-subtle)]">{b}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-[0.65rem] tracking-widest uppercase text-[var(--gold)] mb-1.5">Name on Card</label>
                    <input type="text" className="input-luxury" placeholder="John Mensah"
                      value={payment.cardName}
                      onChange={e => setPayment(p => ({ ...p, cardName: e.target.value }))} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[0.65rem] tracking-widest uppercase text-[var(--gold)] mb-1.5">Expiry</label>
                      <input type="text" className="input-luxury" placeholder="MM/YY"
                        value={payment.expiry} maxLength={5}
                        onChange={e => setPayment(p => ({ ...p, expiry: formatExpiry(e.target.value) }))} />
                    </div>
                    <div>
                      <label className="block text-[0.65rem] tracking-widest uppercase text-[var(--gold)] mb-1.5">CVV</label>
                      <input type="password" className="input-luxury" placeholder="• • •"
                        value={payment.cvv} maxLength={4}
                        onChange={e => setPayment(p => ({ ...p, cvv: e.target.value.slice(0, 4) }))} />
                    </div>
                  </div>
                  <p className="text-[var(--text-subtle)] text-[0.65rem] text-center">
                    🔒 Simulation only — no real charge will be made
                  </p>
                </div>
              )}

              {/* PayPal panel */}
              {payMethod === 'paypal' && (
                <div className="space-y-4">
                  <div className="border border-[#003087]/40 bg-[rgba(0,48,135,0.06)] p-5 text-center rounded-sm">
                    <div className="flex justify-center mb-3">
                      <svg viewBox="0 0 24 24" className="w-10 h-10" xmlns="http://www.w3.org/2000/svg">
                        <path fill="#003087" d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106z"/>
                        <path fill="#009CDE" d="M21.222 6.917a3.35 3.35 0 0 0-.607-.541c-.013.076-.026.175-.041.254-.59 3.025-2.566 6.182-8.558 6.182H9.825l-1.353 8.563h3.918c.441 0 .817-.32.887-.757l.036-.189 1.398-8.859.089-.49c.07-.437.446-.757.887-.757h.558c3.617 0 6.445-1.469 7.273-5.718a4.96 4.96 0 0 0-.296-1.688z"/>
                      </svg>
                    </div>
                    <p className="text-white font-medium mb-1">Pay with PayPal</p>
                    <p className="text-[var(--text-muted)] text-xs leading-relaxed mb-4">
                      You will be redirected to PayPal to securely complete your ${total} payment.
                    </p>
                    <div className="inline-flex items-center gap-2 bg-[var(--surface-3)] border border-[var(--border)] px-3 py-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
                      <span className="text-green-400 text-[0.6rem] uppercase tracking-widest">Demo Mode — No charge</span>
                    </div>
                  </div>
                  <p className="text-[var(--text-subtle)] text-[0.65rem] text-center">
                    After clicking Pay, a simulated PayPal redirect will process your booking.
                  </p>
                </div>
              )}

              <div className="flex gap-3 pt-1">
                <button onClick={() => setStep('details')} className="btn-ghost flex-1 justify-center">Back</button>
                <button onClick={handlePayment} disabled={paymentLoading} className="btn-gold flex-1 justify-center">
                  {paymentLoading ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                      </svg>
                      Processing...
                    </span>
                  ) : payMethod === 'paypal' ? `PayPal → ${total}` : `Pay ${total}`}
                </button>
              </div>
            </div>
          )}

          {/* STEP 3 — Success */}
          {step === 'success' && (
            <div className="p-6 text-center space-y-5 py-8">
              <div className="flex justify-center">
                <div className="w-16 h-16 rounded-full bg-green-500/15 border border-green-500/30 flex items-center justify-center">
                  <CheckCircle size={32} className="text-green-400" />
                </div>
              </div>
              <div>
                <h3 className="font-serif text-2xl font-light text-[var(--text-primary)] mb-2">Booking Confirmed!</h3>
                <p className="text-[var(--text-muted)] text-sm leading-relaxed">
                  Thank you, <strong className="text-[var(--text-primary)]">{form.name}</strong>!
                  Your reservation at Milehigh5280 has been received. A confirmation has been sent to{' '}
                  <strong className="text-[var(--text-primary)]">{form.email}</strong>.
                </p>
              </div>
              <div className="bg-[var(--surface-2)] border border-[var(--border)] p-4 text-left space-y-2">
                <p className="section-label mb-2">Booking Summary</p>
                {[
                  ['Check-in',  form.checkIn],
                  ['Check-out', form.checkOut],
                  ['Guests',    form.guests],
                  ['Total',     `$${total} / GHS ${totalGHS.toLocaleString()}`],
                ].map(([l, v]) => (
                  <div key={l} className="flex justify-between text-sm">
                    <span className="text-[var(--text-muted)]">{l}</span>
                    <span className="text-[var(--text-primary)]">{v}</span>
                  </div>
                ))}
              </div>
              <p className="text-[var(--text-muted)] text-xs">
                Our team will contact you on WhatsApp within 15 minutes to confirm all details.
              </p>
              <div className="flex flex-col gap-3">
                <a
                  href={`https://wa.me/${CONTACT_INFO.whatsapp}?text=${encodeURIComponent(`Hi! I booked Milehigh5280 for ${form.checkIn}–${form.checkOut}. Guest: ${form.name}.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-gold w-full justify-center gap-2"
                >
                  <WaIcon />
                  Chat on WhatsApp
                </a>
                <button onClick={onClose} className="btn-ghost w-full justify-center">Close</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
