'use client';

import { useState, useEffect } from 'react';
import { X, Calendar, User, Mail, Phone, MessageSquare, CreditCard, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type Step = 'details' | 'payment' | 'success';

interface BookingForm {
  name: string;
  email: string;
  phone: string;
  checkIn: string;
  checkOut: string;
  guests: string;
  specialRequests: string;
}

interface PaymentForm {
  cardNumber: string;
  cardName: string;
  expiry: string;
  cvv: string;
}

export default function BookingModal({ isOpen, onClose }: BookingModalProps) {
  const [step, setStep] = useState<Step>('details');
  const [paymentLoading, setPaymentLoading] = useState(false);

  const [form, setForm] = useState<BookingForm>({
    name: '', email: '', phone: '', checkIn: '', checkOut: '',
    guests: '1', specialRequests: '',
  });

  const [payment, setPayment] = useState<PaymentForm>({
    cardNumber: '', cardName: '', expiry: '', cvv: '',
  });

  const [errors, setErrors] = useState<Partial<BookingForm>>({});

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setStep('details');
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const validate = () => {
    const e: Partial<BookingForm> = {};
    if (!form.name.trim())    e.name = 'Full name is required';
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Valid email required';
    if (!form.phone.trim())   e.phone = 'Phone number is required';
    if (!form.checkIn)        e.checkIn = 'Check-in date required';
    if (!form.checkOut)       e.checkOut = 'Check-out date required';
    if (form.checkIn && form.checkOut && form.checkIn >= form.checkOut) e.checkOut = 'Check-out must be after check-in';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const getNights = () => {
    if (!form.checkIn || !form.checkOut) return 0;
    const diff = new Date(form.checkOut).getTime() - new Date(form.checkIn).getTime();
    return Math.max(0, Math.round(diff / (1000 * 60 * 60 * 24)));
  };

  const nights = getNights();
  const ratePerNight = 250;
  const cleaningFee = 30;
  const total = nights * ratePerNight + cleaningFee;

  const handleDetails = () => {
    if (!validate()) return;
    setStep('payment');
  };

  const sendWhatsApp = () => {
    const msg = encodeURIComponent(
      `🌴 *New Booking Request — The Palm, Ayi Mensah*\n\n` +
      `*Guest:* ${form.name}\n` +
      `*Email:* ${form.email}\n` +
      `*Phone:* ${form.phone}\n` +
      `*Check-in:* ${form.checkIn}\n` +
      `*Check-out:* ${form.checkOut}\n` +
      `*Guests:* ${form.guests}\n` +
      `*Nights:* ${nights}\n` +
      `*Total:* GHS ${(total * 15.8).toLocaleString()} / $${total}\n` +
      `${form.specialRequests ? `*Special Requests:* ${form.specialRequests}` : ''}`
    );
    window.open(`https://wa.me/233541988383?text=${msg}`, '_blank');
  };

  const handlePayment = async () => {
    setPaymentLoading(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setPaymentLoading(false);
    setStep('success');
    sendWhatsApp();
  };

  const formatCardNumber = (value: string) => {
    return value.replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim().slice(0, 19);
  };

  const formatExpiry = (value: string) => {
    return value.replace(/\D/g, '').replace(/(\d{2})(\d)/, '$1/$2').slice(0, 5);
  };

  if (!isOpen) return null;

  // Step indicator helper
  const stepOrder: Step[] = ['details', 'payment', 'success'];
  const currentStepIndex = stepOrder.indexOf(step);

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      style={{ animation: 'fadeIn 0.2s ease' }}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-obsidian/90 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto bg-[var(--surface)] border border-[var(--border)] shadow-2xl"
        style={{ animation: 'slideUp 0.35s cubic-bezier(0.4, 0, 0.2, 1)' }}
        role="dialog"
        aria-modal="true"
        aria-label="Booking form"
      >
        {/* Header */}
        <div className="sticky top-0 bg-[var(--surface)] z-10 px-6 pt-6 pb-4 border-b border-[var(--border)] flex items-center justify-between">
          <div>
            {/* Step indicators */}
            <div className="flex items-center gap-2 mb-1">
              {stepOrder.map((s, i) => {
                const isDone = i < currentStepIndex;
                const isCurrent = i === currentStepIndex;
                return (
                  <div key={s} className="flex items-center gap-2">
                    <div className={cn(
                      'w-5 h-5 rounded-full flex items-center justify-center text-[0.6rem] font-bold transition-all duration-300',
                      isCurrent ? 'bg-[var(--gold)] text-obsidian' :
                      isDone    ? 'bg-[var(--gold)]/30 text-[var(--gold)]' :
                                  'bg-[var(--surface-3)] text-[var(--text-subtle)]',
                    )}>
                      {isDone ? '✓' : i + 1}
                    </div>
                    {i < stepOrder.length - 1 && (
                      <div className={cn(
                        'w-6 h-px transition-colors duration-300',
                        i < currentStepIndex ? 'bg-[var(--gold)]' : 'bg-[var(--border)]',
                      )} />
                    )}
                  </div>
                );
              })}
            </div>
            <h2 className="font-serif text-xl font-light text-white">
              {step === 'details' ? 'Reserve Your Stay' : step === 'payment' ? 'Secure Payment' : 'Booking Confirmed!'}
            </h2>
            <p className="text-[var(--text-muted)] text-xs mt-0.5">The Palm 🌴 · Ayi Mensah, Accra</p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close booking form"
            className="w-8 h-8 flex items-center justify-center border border-[var(--border)] text-[var(--text-muted)] hover:text-white hover:border-[var(--gold)] transition-colors duration-200"
          >
            <X size={14} />
          </button>
        </div>

        <div className="p-6">

          {/* ── STEP 1: Details ── */}
          {step === 'details' && (
            <div className="space-y-4">

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[0.65rem] tracking-widest uppercase text-[var(--gold)] mb-1.5">Full Name *</label>
                  <div className="relative">
                    <User size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-subtle)]" />
                    <input
                      type="text"
                      className={cn('input-luxury pl-9', errors.name && 'border-red-500/60')}
                      placeholder="John Mensah"
                      value={form.name}
                      onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    />
                  </div>
                  {errors.name && <p className="text-red-400 text-[0.65rem] mt-1">{errors.name}</p>}
                </div>
                <div>
                  <label className="block text-[0.65rem] tracking-widest uppercase text-[var(--gold)] mb-1.5">Email *</label>
                  <div className="relative">
                    <Mail size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-subtle)]" />
                    <input
                      type="email"
                      className={cn('input-luxury pl-9', errors.email && 'border-red-500/60')}
                      placeholder="john@example.com"
                      value={form.email}
                      onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                    />
                  </div>
                  {errors.email && <p className="text-red-400 text-[0.65rem] mt-1">{errors.email}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[0.65rem] tracking-widest uppercase text-[var(--gold)] mb-1.5">Phone *</label>
                  <div className="relative">
                    <Phone size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-subtle)]" />
                    <input
                      type="tel"
                      className={cn('input-luxury pl-9', errors.phone && 'border-red-500/60')}
                      placeholder="+233 XX XXX XXXX"
                      value={form.phone}
                      onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                    />
                  </div>
                  {errors.phone && <p className="text-red-400 text-[0.65rem] mt-1">{errors.phone}</p>}
                </div>
                <div>
                  <label className="block text-[0.65rem] tracking-widest uppercase text-[var(--gold)] mb-1.5">Guests</label>
                  <select
                    className="input-luxury"
                    value={form.guests}
                    onChange={e => setForm(f => ({ ...f, guests: e.target.value }))}
                  >
                    {[1,2,3,4].map(n => (
                      <option key={n} value={n}>{n} Guest{n > 1 ? 's' : ''}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[0.65rem] tracking-widest uppercase text-[var(--gold)] mb-1.5">Check-In *</label>
                  <div className="relative">
                    <Calendar size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-subtle)]" />
                    <input
                      type="date"
                      className={cn('input-luxury pl-9', errors.checkIn && 'border-red-500/60')}
                      min={new Date().toISOString().split('T')[0]}
                      value={form.checkIn}
                      onChange={e => setForm(f => ({ ...f, checkIn: e.target.value }))}
                    />
                  </div>
                  {errors.checkIn && <p className="text-red-400 text-[0.65rem] mt-1">{errors.checkIn}</p>}
                </div>
                <div>
                  <label className="block text-[0.65rem] tracking-widest uppercase text-[var(--gold)] mb-1.5">Check-Out *</label>
                  <div className="relative">
                    <Calendar size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-subtle)]" />
                    <input
                      type="date"
                      className={cn('input-luxury pl-9', errors.checkOut && 'border-red-500/60')}
                      min={form.checkIn || new Date().toISOString().split('T')[0]}
                      value={form.checkOut}
                      onChange={e => setForm(f => ({ ...f, checkOut: e.target.value }))}
                    />
                  </div>
                  {errors.checkOut && <p className="text-red-400 text-[0.65rem] mt-1">{errors.checkOut}</p>}
                </div>
              </div>

              <div>
                <label className="block text-[0.65rem] tracking-widest uppercase text-[var(--gold)] mb-1.5">Special Requests</label>
                <div className="relative">
                  <MessageSquare size={13} className="absolute left-3 top-3.5 text-[var(--text-subtle)]" />
                  <textarea
                    className="input-luxury pl-9 resize-none"
                    rows={3}
                    placeholder="Any special arrangements, early check-in, dietary needs..."
                    value={form.specialRequests}
                    onChange={e => setForm(f => ({ ...f, specialRequests: e.target.value }))}
                  />
                </div>
              </div>

              {nights > 0 && (
                <div className="bg-[var(--surface-2)] border border-[var(--border)] p-4 space-y-2">
                  <p className="section-label">Price Summary</p>
                  <div className="space-y-1.5 mt-2">
                    <div className="flex justify-between text-sm text-[var(--text-muted)]">
                      <span>${ratePerNight} × {nights} night{nights > 1 ? 's' : ''}</span>
                      <span>${nights * ratePerNight}</span>
                    </div>
                    <div className="flex justify-between text-sm text-[var(--text-muted)]">
                      <span>Cleaning fee</span>
                      <span>${cleaningFee}</span>
                    </div>
                    <div className="flex justify-between text-white font-medium border-t border-[var(--border)] pt-2 mt-2">
                      <span>Total</span>
                      <span className="text-[var(--gold)]">
                        ${total}{' '}
                        <span className="text-[var(--text-muted)] text-xs font-normal">
                          ≈ GHS {(total * 15.8).toLocaleString()}
                        </span>
                      </span>
                    </div>
                  </div>
                </div>
              )}

              <button onClick={handleDetails} className="btn-gold w-full justify-center mt-2">
                Continue to Payment
              </button>
            </div>
          )}

          {/* ── STEP 2: Payment ── */}
          {step === 'payment' && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 bg-[var(--surface-2)] border border-[var(--border)] px-4 py-3">
                <div className="w-8 h-5 bg-[#00C3F7] flex items-center justify-center rounded-sm">
                  <span className="text-white text-[0.5rem] font-black">P</span>
                </div>
                <span className="text-[var(--text-muted)] text-xs">Secured by <strong className="text-white">Paystack</strong></span>
                <div className="ml-auto flex items-center gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
                  <span className="text-green-400 text-[0.6rem]">Encrypted</span>
                </div>
              </div>

              <div className="text-center py-2">
                <p className="text-[var(--text-muted)] text-xs">Amount due</p>
                <p className="font-serif text-3xl font-light text-white">
                  ${total} <span className="text-[var(--gold)] text-lg">/ GHS {(total * 15.8).toLocaleString()}</span>
                </p>
                <p className="text-[var(--text-muted)] text-xs mt-1">
                  {nights} night{nights > 1 ? 's' : ''} · {form.checkIn} → {form.checkOut}
                </p>
              </div>

              <div>
                <label className="block text-[0.65rem] tracking-widest uppercase text-[var(--gold)] mb-1.5">Card Number</label>
                <div className="relative">
                  <CreditCard size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-subtle)]" />
                  <input
                    type="text"
                    className="input-luxury pl-9"
                    placeholder="1234 5678 9012 3456"
                    value={payment.cardNumber}
                    onChange={e => setPayment(p => ({ ...p, cardNumber: formatCardNumber(e.target.value) }))}
                    maxLength={19}
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-1">
                    {['VISA', 'MC'].map(brand => (
                      <span key={brand} className="text-[0.5rem] border border-[var(--border)] px-1 py-0.5 text-[var(--text-subtle)]">{brand}</span>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[0.65rem] tracking-widest uppercase text-[var(--gold)] mb-1.5">Name on Card</label>
                <input
                  type="text"
                  className="input-luxury"
                  placeholder="John Mensah"
                  value={payment.cardName}
                  onChange={e => setPayment(p => ({ ...p, cardName: e.target.value }))}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[0.65rem] tracking-widest uppercase text-[var(--gold)] mb-1.5">Expiry</label>
                  <input
                    type="text"
                    className="input-luxury"
                    placeholder="MM/YY"
                    value={payment.expiry}
                    onChange={e => setPayment(p => ({ ...p, expiry: formatExpiry(e.target.value) }))}
                    maxLength={5}
                  />
                </div>
                <div>
                  <label className="block text-[0.65rem] tracking-widest uppercase text-[var(--gold)] mb-1.5">CVV</label>
                  <input
                    type="password"
                    className="input-luxury"
                    placeholder="• • •"
                    value={payment.cvv}
                    onChange={e => setPayment(p => ({ ...p, cvv: e.target.value.slice(0, 4) }))}
                    maxLength={4}
                  />
                </div>
              </div>

              <p className="text-[var(--text-subtle)] text-[0.65rem] text-center">
                🔒 This is a simulation. No real charge will be made.
              </p>

              <div className="flex gap-3 mt-2">
                <button onClick={() => setStep('details')} className="btn-ghost flex-1 justify-center">
                  Back
                </button>
                <button
                  onClick={handlePayment}
                  disabled={paymentLoading}
                  className="btn-gold flex-1 justify-center"
                >
                  {paymentLoading ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                      </svg>
                      Processing...
                    </span>
                  ) : `Pay $${total}`}
                </button>
              </div>
            </div>
          )}

          {/* ── STEP 3: Success ── */}
          {step === 'success' && (
            <div className="text-center py-6 space-y-5">
              <div className="flex justify-center">
                <div className="w-16 h-16 rounded-full bg-green-500/15 border border-green-500/30 flex items-center justify-center">
                  <CheckCircle size={32} className="text-green-400" />
                </div>
              </div>
              <div>
                <h3 className="font-serif text-2xl font-light text-white mb-2">Booking Confirmed!</h3>
                <p className="text-[var(--text-muted)] text-sm leading-relaxed">
                  Thank you, <strong className="text-white">{form.name}</strong>! Your reservation at The Palm has been received.
                </p>
              </div>
              <div className="bg-[var(--surface-2)] border border-[var(--border)] p-4 text-left space-y-2">
                <p className="section-label mb-2">Booking Summary</p>
                {[
                  ['Check-in',   form.checkIn],
                  ['Check-out',  form.checkOut],
                  ['Guests',     form.guests],
                  ['Total Paid', `$${total}`],
                ].map(([label, value]) => (
                  <div key={label} className="flex justify-between text-sm">
                    <span className="text-[var(--text-muted)]">{label}</span>
                    <span className="text-white">{value}</span>
                  </div>
                ))}
              </div>
              <p className="text-[var(--text-muted)] text-xs">
                A confirmation has been sent to <strong className="text-white">{form.email}</strong>.
                Our team will contact you on WhatsApp within 15 minutes.
              </p>
              <div className="flex flex-col gap-3">
                <a
                  href={`https://wa.me/233541988383?text=${encodeURIComponent(`Hi! I just booked The Palm for ${form.checkIn} - ${form.checkOut}. My name is ${form.name}.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-gold w-full justify-center gap-2"
                >
                  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  Chat on WhatsApp
                </a>
                <button onClick={onClose} className="btn-ghost w-full justify-center">
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
