'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Phone, Mail, MapPin, MessageCircle, Clock, Send, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { properties } from '@/lib/data';
import toast from 'react-hot-toast';
import type { ContactFormData } from '@/types';

const WHATSAPP_NUMBER = '233541988383';
const ADMIN_PHONE     = '+233 54 198 8383';
const ADMIN_EMAIL_DISPLAY = 'rehobothproperties@gmail.com';
const LOCATION        = 'Ayi Mensah, Accra, Ghana';

const FAQs = [
  {
    q: 'What is included in my stay?',
    a: 'All our properties include high-speed WiFi, air conditioning, a fully equipped kitchen, and parking. Weekly housekeeping is included and daily housekeeping is available on request. Our host team is on-call throughout your stay.',
  },
  {
    q: 'Can I pay in Ghanaian Cedis?',
    a: 'Yes. We accept both GHS and USD. For Ghanaian residents, payment via mobile money (MoMo), bank transfer, or local debit/credit card is welcome.',
  },
  {
    q: 'What is your cancellation policy?',
    a: 'Full refund for cancellations 7 or more days before check-in. 50% refund for cancellations 3–6 days before. No refund within 48 hours. We recommend travel insurance for international guests.',
  },
  {
    q: 'Do you host events and group stays?',
    a: 'Yes! Our Serenity Villa is ideal for family gatherings and corporate retreats. Please contact us to discuss bespoke packages and catering options.',
  },
  {
    q: 'Is airport transfer included?',
    a: 'Airport pickup from Kotoka International Airport (KIA) can be arranged for all properties. It is included complimentary in our Serenity Villa package — please ask your host.',
  },
  {
    q: 'Is self check-in available?',
    a: 'Yes, self check-in is available at Milehigh5280. We will share access details and a welcome guide prior to your arrival. Our host is always reachable via WhatsApp.',
  },
];

export default function ContactPage() {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '', email: '', phone: '', property: '', message: '', type: 'booking',
  });
  const [submitted, setSubmitted]  = useState(false);
  const [loading,   setLoading]    = useState(false);
  const [openFaq,   setOpenFaq]    = useState<number | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => setFormData(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic client-side validation
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      toast.error('Please fill in your name, email, and message.');
      return;
    }
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email);
    if (!emailOk) {
      toast.error('Please enter a valid email address.');
      return;
    }

    setLoading(true);
    try {
      // POST to our own Next.js API route — delivers to nyaaba.augustine@gmail.com
      const res = await fetch('/api/contact', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(formData),
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error ?? 'Server error');
      }

      setSubmitted(true);
      toast.success("Message sent! We'll respond within 2 hours.");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      console.error('Contact form error:', msg);
      // Graceful fallback: direct WhatsApp
      toast.error(
        `Couldn't send via email. Please WhatsApp us at ${ADMIN_PHONE} directly.`,
        { duration: 6000 },
      );
    } finally {
      setLoading(false);
    }
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
            Our host team is available 7 days a week to assist with bookings,
            bespoke requests, and any questions about your stay in Accra.
          </p>
        </div>
      </section>

      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-16">

          {/* ── Contact Form ── */}
          <div>
            <h2 className="font-serif text-3xl font-light text-white mb-8">Send a Message</h2>

            {submitted ? (
              <div
                className="border border-[var(--gold)] bg-[rgba(201,150,58,0.05)] p-10 text-center"
                style={{ animation: 'fadeIn 0.5s ease' }}
              >
                <CheckCircle size={48} className="text-[var(--gold)] mx-auto mb-4" />
                <h3 className="font-serif text-2xl text-white mb-2">Message Received</h3>
                <p className="text-[var(--text-muted)] mb-2">
                  Thank you, <strong className="text-white">{formData.name.split(' ')[0]}</strong>.
                  We typically respond within 2 hours — often sooner.
                </p>
                <p className="text-[var(--text-muted)] text-sm mb-6">
                  Check your inbox at <strong className="text-white">{formData.email}</strong> for
                  an auto-confirmation email.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <button
                    onClick={() => { setSubmitted(false); setFormData({ name:'',email:'',phone:'',property:'',message:'',type:'booking' }); }}
                    className="btn-ghost"
                  >
                    Send Another
                  </button>
                  <Link href="/properties" className="btn-gold">Browse Properties</Link>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5" noValidate>

                {/* Enquiry type */}
                <div>
                  <label htmlFor="type" className="section-label text-[0.55rem] block mb-2">Enquiry Type</label>
                  <select
                    id="type"
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    className="input-luxury"
                  >
                    <option value="booking">Property Booking</option>
                    <option value="concierge">Concierge / Special Request</option>
                    <option value="event">Event / Group Stay</option>
                    <option value="listing">List My Property</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="section-label text-[0.55rem] block mb-2">Full Name *</label>
                    <input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Your full name"
                      className="input-luxury"
                      required
                      autoComplete="name"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="section-label text-[0.55rem] block mb-2">Email Address *</label>
                    <input
                      id="email"
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="your@email.com"
                      className="input-luxury"
                      required
                      autoComplete="email"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="phone" className="section-label text-[0.55rem] block mb-2">Phone / WhatsApp</label>
                    <input
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+233 or international"
                      className="input-luxury"
                      autoComplete="tel"
                    />
                  </div>
                  <div>
                    <label htmlFor="property" className="section-label text-[0.55rem] block mb-2">Property of Interest</label>
                    <select
                      id="property"
                      name="property"
                      value={formData.property}
                      onChange={handleChange}
                      className="input-luxury"
                    >
                      <option value="">Any / Not Sure</option>
                      {properties.map(p => (
                        <option key={p.id} value={p.name}>{p.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="message" className="section-label text-[0.55rem] block mb-2">Message *</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell us about your plans, dates, group size, or any special requests..."
                    rows={5}
                    className="input-luxury resize-none"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className={cn('btn-gold', loading && 'opacity-70 cursor-wait')}
                >
                  {loading ? (
                    <>
                      <span className="inline-block w-3 h-3 border border-current border-t-transparent rounded-full animate-spin mr-2" />
                      Sending…
                    </>
                  ) : (
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
              <div className="border border-[var(--border)]">
                {FAQs.map((faq, i) => (
                  <div key={i} className="border-b border-[var(--border)] last:border-b-0">
                    <button
                      onClick={() => setOpenFaq(openFaq === i ? null : i)}
                      className="w-full flex items-start justify-between gap-4 p-5 text-left hover:bg-[var(--surface-2)] transition-colors duration-200"
                      aria-expanded={openFaq === i}
                      aria-controls={`faq-answer-${i}`}
                    >
                      <span className="text-white text-sm font-medium pr-4">{faq.q}</span>
                      <span className={cn(
                        'text-[var(--gold)] shrink-0 transition-transform duration-300 text-xl leading-none mt-0.5',
                        openFaq === i ? 'rotate-45' : '',
                      )}>+</span>
                    </button>
                    {openFaq === i && (
                      <div
                        id={`faq-answer-${i}`}
                        className="px-5 pb-5"
                        style={{ animation: 'fadeIn 0.3s ease' }}
                      >
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

            {/* WhatsApp CTA — most important for Ghana market */}
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=Hello%2C%20I%27d%20like%20to%20enquire%20about%20your%20properties`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 bg-[#25D366]/10 border border-[#25D366]/30 p-5 hover:bg-[#25D366]/15 transition-colors duration-300 group"
              aria-label="Chat with us on WhatsApp"
            >
              <div className="w-12 h-12 bg-[#25D366] flex items-center justify-center shrink-0 rounded-full">
                <MessageCircle size={22} className="text-white" />
              </div>
              <div>
                <p className="text-white font-medium text-sm">Chat on WhatsApp</p>
                <p className="text-[var(--text-muted)] text-xs">Fastest response · Usually under 15 min</p>
              </div>
              <div className="ml-auto text-[#25D366] text-lg group-hover:translate-x-1 transition-transform duration-300">→</div>
            </a>

            {/* Contact details */}
            <div className="border border-[var(--border)] p-6 space-y-5">
              <h3 className="section-label">Contact Details</h3>
              {[
                { Icon: Phone,  label: 'Phone / WhatsApp', value: ADMIN_PHONE,          href: `tel:${ADMIN_PHONE.replace(/\s/g,'')}` },
                { Icon: Mail,   label: 'Email',            value: ADMIN_EMAIL_DISPLAY,   href: `mailto:${ADMIN_EMAIL_DISPLAY}` },
                { Icon: MapPin, label: 'Location',         value: LOCATION,              href: `https://maps.google.com/?q=${encodeURIComponent(LOCATION)}` },
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
                <h3 className="section-label">Response Hours</h3>
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
                    <span className={cn(
                      'text-sm',
                      day === 'WhatsApp' ? 'text-[#25D366]' : 'text-white',
                    )}>{hrs}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Map */}
            <div className="border border-[var(--border)] overflow-hidden">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15877.221588820084!2d-0.181711!3d5.792905!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xfdf79f749555555%3A0x1d5d1d5d1d5d1d5d!2sAyi%20Mensah%2C%20Accra!5e0!3m2!1sen!2sgh!4v1700000000000!5m2!1sen!2sgh"
                width="100%"
                height="220"
                style={{ border: 0, filter: 'grayscale(1) invert(0.9) contrast(1.2)', display: 'block' }}
                allowFullScreen
                loading="lazy"
                title="Ayi Mensah location map"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>

          </div>
        </div>
      </div>
    </>
  );
}
