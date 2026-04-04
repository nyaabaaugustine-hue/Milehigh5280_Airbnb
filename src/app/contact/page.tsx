'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Phone, Mail, MapPin, MessageCircle, Clock, Send, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { properties } from '@/lib/data';
import toast from 'react-hot-toast';

const FAQs = [
  {
    q: 'What is included in my stay?',
    a: 'All our properties include daily housekeeping, high-speed WiFi, air conditioning, and 24/7 concierge support. Premium services like private chef and airport transfer are available on request.',
  },
  {
    q: 'Can I pay in Ghanaian Cedis?',
    a: 'Yes. We accept both GHS and USD. For Ghanaian residents, payment via Paystack (mobile money, local bank card) is available.',
  },
  {
    q: 'What is your cancellation policy?',
    a: 'Full refund for cancellations 7 or more days before check-in. 50% refund for 3–6 days. No refund within 48 hours. We recommend travel insurance for international guests.',
  },
  {
    q: 'Do you host events and corporate retreats?',
    a: 'Absolutely. Several of our properties are designed for groups, retreats, and celebrations. Contact our concierge team to discuss bespoke packages.',
  },
  {
    q: 'Is airport transfer included?',
    a: 'Transfer from Kotoka International Airport can be arranged for all properties. It is included complimentary in some packages — ask your concierge.',
  },
];

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', property: '', message: '', type: 'booking',
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading,   setLoading]   = useState(false);
  const [openFaq,   setOpenFaq]   = useState<number | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setFormData(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast.error('Please fill in all required fields.');
      return;
    }
    setLoading(true);
    // Replace with real form submission (Formspree, EmailJS, etc.)
    await new Promise(r => setTimeout(r, 1500));
    setLoading(false);
    setSubmitted(true);
    toast.success('Message sent! We\'ll respond within 2 hours.');
  };

  return (
    <>
      {/* ── Hero ── */}
      <section className="relative pt-40 pb-20 px-6 lg:px-12 border-b border-[var(--border)]">
        <div className="max-w-[1440px] mx-auto">
          <p className="section-label mb-4">Get In Touch</p>
          <h1 className="font-serif font-light text-white leading-tight mb-4">
            Private <span className="italic text-gold-gradient">Concierge</span>
          </h1>
          <p className="text-[var(--text-muted)] max-w-xl leading-relaxed">
            Our concierge team is available 7 days a week to assist with bookings,
            bespoke requests, and any questions about your stay in Ghana.
          </p>
        </div>
      </section>

      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-16">

          {/* ── Contact Form ── */}
          <div>
            <h2 className="font-serif text-3xl font-light text-white mb-8">Send a Message</h2>

            {submitted ? (
              <div className="border border-[var(--gold)] bg-[rgba(201,150,58,0.05)] p-10 text-center"
                style={{ animation: 'fadeIn 0.5s ease' }}>
                <CheckCircle size={48} className="text-[var(--gold)] mx-auto mb-4" />
                <h3 className="font-serif text-2xl text-white mb-2">Message Received</h3>
                <p className="text-[var(--text-muted)] mb-6">
                  Thank you, <strong className="text-white">{formData.name}</strong>. We typically
                  respond within 2 hours — often sooner. Check your inbox at{' '}
                  <strong className="text-white">{formData.email}</strong>.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <button onClick={() => setSubmitted(false)} className="btn-ghost">Send Another</button>
                  <Link href="/properties" className="btn-gold">Browse Properties</Link>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                {/* Enquiry type */}
                <div>
                  <label className="section-label text-[0.55rem] block mb-2">Enquiry Type</label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    className="input-luxury"
                  >
                    <option value="booking">Property Booking</option>
                    <option value="concierge">Concierge Request</option>
                    <option value="event">Event / Group Stay</option>
                    <option value="listing">List My Property</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="section-label text-[0.55rem] block mb-2">Full Name *</label>
                    <input
                      name="name" value={formData.name} onChange={handleChange}
                      placeholder="Your name" className="input-luxury" required
                    />
                  </div>
                  <div>
                    <label className="section-label text-[0.55rem] block mb-2">Email *</label>
                    <input
                      type="email" name="email" value={formData.email} onChange={handleChange}
                      placeholder="your@email.com" className="input-luxury" required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="section-label text-[0.55rem] block mb-2">Phone / WhatsApp</label>
                    <input
                      name="phone" value={formData.phone} onChange={handleChange}
                      placeholder="+233 or international" className="input-luxury"
                    />
                  </div>
                  <div>
                    <label className="section-label text-[0.55rem] block mb-2">Property of Interest</label>
                    <select name="property" value={formData.property} onChange={handleChange} className="input-luxury">
                      <option value="">Any / Not Sure</option>
                    div>
                </div>

                <div>
                  <label className="section-label text-[0.55rem] block mb-2">Message *</label>
                  <textarea
                    name="message" value={formData.message} onChange={handleChange}
                    placeholder="Tell us about your plans, dates, group size, or any requests..."
                    rows={5} className="input-luxury resize-none" required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className={cn('btn-gold', loading && 'opacity-70 cursor-wait')}
                >
                  {loading ? 'Sending…' : (
                    <>
                      <Send size={13} />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            )}

            {/* ── FAQs ── */}
            <div className="mt-16">
              <h2 className="font-serif text-3xl font-light text-white mb-8">Frequently Asked</h2>
              <div className="space-y-0 border border-[var(--border)]">
                {FAQs.map((faq, i) => (
                  <div key={i} className="border-b border-[var(--border)] last:border-b-0">
                    <button
                      onClick={() => setOpenFaq(openFaq === i ? null : i)}
                      className="w-full flex items-start justify-between gap-4 p-5 text-left hover:bg-[var(--surface-2)] transition-colors duration-200"
                      aria-expanded={openFaq === i}
                    >
                      <span className="text-white text-sm font-medium pr-4">{faq.q}</span>
                      <span className={cn(
                        'text-[var(--gold)] shrink-0 transition-transform duration-300 text-lg leading-none',
                        openFaq === i ? 'rotate-45' : '',
                      )}>+</span>
                    </button>
                    {openFaq === i && (
                      <div className="px-5 pb-5" style={{ animation: 'fadeIn 0.3s ease' }}>
                        <p className="text-[var(--text-muted)] text-sm leading-relaxed">{faq.a}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Right: Contact Details ── */}
          <div className="space-y-6">

            {/* WhatsApp CTA — most important for Ghana */}
            <a
              href="https://wa.me/233000000000?text=Hello%2C%20I%27d%20like%20to%20enquire%20about%20your%20properties"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 bg-[#25D366]/10 border border-[#25D366]/30 p-5 hover:bg-[#25D366]/15 transition-colors duration-300 group"
            >
              <div className="w-12 h-12 bg-[#25D366] flex items-center justify-center shrink-0">
                <MessageCircle size={22} className="text-white" />
              </div>
              <div>
                <p className="text-white font-medium text-sm">Chat on WhatsApp</p>
                <p className="text-[var(--text-muted)] text-xs">Fastest response · Usually under 15 min</p>
              </div>
              <div className="ml-auto text-[#25D366] group-hover:translate-x-1 transition-transform duration-300">→</div>
            </a>

            {/* Contact details */}
            <div className="border border-[var(--border)] p-6 space-y-5">
              <h3 className="section-label mb-2">Contact Details</h3>
              {[
                { Icon: Phone,  label: 'Phone',   value: '+233 (0) 00 000 0000', href: 'tel:+233000000000' },
                { Icon: Mail,   label: 'Email',   value: 'concierge@luxeghanastays.com', href: 'mailto:concierge@luxeghanastays.com' },
                { Icon: MapPin, label: 'Office',  value: 'East Legon, Accra, Ghana', href: 'https://maps.google.com/?q=East+Legon+Accra' },
              ].map(({ Icon, label, value, href }) => (
                <a
                  key={label}
                  href={href}
                  target={href.startsWith('http') ? '_blank' : undefined}
                  rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  className="flex items-start gap-4 group"
                >
                  <div className="w-9 h-9 border border-[var(--border)] flex items-center justify-center shrink-0 group-hover:border-[var(--gold)] transition-colors duration-300">
                    <Icon size={14} className="text-[var(--gold)]" />
                  </div>
                  <div>
                    <p className="text-[var(--text-subtle)] text-xs uppercase tracking-widest">{label}</p>
                    <p className="text-white text-sm group-hover:text-[var(--gold)] transition-colors duration-200">{value}</p>
                  </div>
                </a>
              ))}
            </div>

            {/* Hours */}
            <div className="border border-[var(--border)] p-6">
              <div className="flex items-center gap-3 mb-4">
                <Clock size={16} className="text-[var(--gold)]" />
                <h3 className="section-label">Concierge Hours</h3>
              </div>
              <div className="space-y-2 text-sm">
                {[
                  { day: 'Monday – Friday', hrs: '7:00 AM – 10:00 PM GMT' },
                  { day: 'Saturday',        hrs: '8:00 AM – 9:00 PM GMT' },
                  { day: 'Sunday',          hrs: '9:00 AM – 7:00 PM GMT' },
                  { day: 'WhatsApp',        hrs: 'Available 24/7' },
                ].map(({ day, hrs }) => (
                  <div key={day} className="flex justify-between">
                    <span className="text-[var(--text-muted)]">{day}</span>
                    <span className="text-white">{hrs}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Google Map embed placeholder */}
            <div className="border border-[var(--border)] relative h-48 bg-[var(--surface-2)] overflow-hidden flex items-center justify-center group">
              <div className="absolute inset-0 opacity-5"
                style={{ backgroundImage: 'linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)', backgroundSize: '20px 20px' }}
              />
              <div className="relative z-10 text-center">
                <MapPin size={28} className="text-[var(--gold)] mx-auto mb-2" />
                <p className="text-[var(--text-muted)] text-xs">Accra, Ghana</p>
                <a
                  href="https://maps.google.com/?q=East+Legon+Accra+Ghana"
                  target="_blank" rel="noopener noreferrer"
                  className="text-[var(--gold)] text-xs hover:underline mt-1 block"
                >
                  Open Google Maps →
                </a>
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}
