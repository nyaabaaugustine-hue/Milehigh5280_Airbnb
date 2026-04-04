'use client';

import Hero from '@/components/home/Hero';
import FeaturedProperties from '@/components/home/FeaturedProperties';
import Testimonials from '@/components/home/Testimonials';
import Experience from '@/components/home/Experience';
import Image from 'next/image';
import { useBooking } from '@/components/layout/ClientShell';
import { Phone, MapPin, Star } from 'lucide-react';

export default function HomePage() {
  const { openBooking, viewProperty } = useBooking();

  return (
    <>
      {/* ── 1. Hero Slider ── */}
      <Hero onBookNow={openBooking} />

      {/* ── 2. Featured Properties ── */}
      <FeaturedProperties onBookNow={openBooking} onViewProperty={viewProperty} />

      {/* ── 3. Experience Section ── */}
      <Experience />

      {/* ── 4. Mid-Page CTA Banner ── */}
      <section className="relative py-24 lg:py-36 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://res.cloudinary.com/dwsl2ktt2/image/upload/v1775296671/3_wgur1l.jpg"
            alt="The Palm apartment interior"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(8,8,8,0.92) 0%, rgba(8,8,8,0.78) 100%)' }} />
        </div>

        <div className="relative z-10 max-w-[1440px] mx-auto px-6 lg:px-12 text-center">
          <p className="section-label mb-6">Direct Booking</p>
          <h2 className="font-serif font-light text-white text-4xl lg:text-6xl mb-6">
            Ready for your <span className="italic text-gold-gradient">palm retreat?</span>
          </h2>
          <p className="text-[var(--text-muted)] max-w-xl mx-auto mb-10 leading-relaxed">
            Book directly with us for the best rates and a personal welcome.
            Our team is available around the clock to ensure your stay is perfect.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={openBooking} className="btn-gold">
              <Phone size={14} />
              Book Your Stay
            </button>
            <a
              href="https://wa.me/17207059849?text=Hello%2C%20I%27d%20like%20to%20book%20The%20Palm%20apartment"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost"
            >
              <svg viewBox="0 0 24 24" className="w-3 h-3 fill-current" xmlns="http://www.w3.org/2000/svg">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              WhatsApp Us
            </a>
          </div>
        </div>
      </section>

      {/* ── 5. Testimonials ── */}
      <Testimonials />

      {/* ── 6. Location & Google Maps ── */}
      <section className="py-24 lg:py-36 px-6 lg:px-12 max-w-[1440px] mx-auto">
        <div className="flex flex-col lg:flex-row items-start gap-16">

          {/* Text */}
          <div className="lg:w-2/5 lg:pt-4">
            <p className="section-label mb-4">Location</p>
            <h2 className="font-serif font-light text-white mb-6">
              Serenity in the<br />
              <span className="italic text-gold-gradient">Heart of Accra</span>
            </h2>
            <p className="text-[var(--text-muted)] leading-relaxed mb-6">
              Tucked away in the lush, tree-lined community of Ayi Mensah, The Palm offers
              the perfect balance of tranquil retreat and urban convenience — just 20 minutes
              from Accra&apos;s CBD and business districts.
            </p>
            <ul className="space-y-3 mb-8">
              {[
                '~20 min to Accra CBD & business hubs',
                'Close to shops, restaurants & supermarkets',
                'Easy access to Kotoka International Airport',
                'Quiet, secure, well-lit neighbourhood',
              ].map(item => (
                <li key={item} className="flex items-start gap-3 text-sm text-[var(--text-muted)]">
                  <span className="text-[var(--gold)] mt-0.5 shrink-0">◆</span>
                  {item}
                </li>
              ))}
            </ul>
            <div className="flex items-center gap-2 p-4 bg-[var(--surface-2)] border border-[var(--border)] mb-6">
              <MapPin size={16} className="text-[var(--gold)] shrink-0" />
              <div>
                <p className="text-white text-sm font-medium">The Palm 🌴</p>
                <p className="text-[var(--text-muted)] text-xs">Ayi Mensah, Accra, Ghana</p>
              </div>
              <div className="ml-auto flex items-center gap-1">
                <Star size={12} className="fill-[var(--gold)] text-[var(--gold)]" />
                <span className="text-white text-xs font-medium">4.92</span>
              </div>
            </div>
            <button onClick={openBooking} className="btn-gold">
              <Phone size={13} />
              Book This Property
            </button>
          </div>

          {/* Map */}
          <div className="lg:w-3/5 w-full">
            <div className="relative overflow-hidden border border-[var(--border)] shadow-2xl" style={{ borderRadius: '2px' }}>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15877.221588820084!2d-0.181711!3d5.792905!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xfdf79f749555555%3A0x1d5d1d5d1d5d1d5d!2sAyi%20Mensah%2C%20Accra!5e0!3m2!1sen!2sgh!4v1700000000000!5m2!1sen!2sgh"
                width="100%"
                height="500"
                style={{ border: 0, filter: 'grayscale(1) invert(0.9) contrast(1.2)' }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>

        </div>
      </section>
    </>
  );
}
