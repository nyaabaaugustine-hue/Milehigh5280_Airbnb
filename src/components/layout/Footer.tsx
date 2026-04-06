import Link from 'next/link';
import Image from 'next/image';
import { Instagram, Facebook, MapPin, Phone, Mail, ArrowUpRight } from 'lucide-react';
import { CONTACT_INFO } from '@/lib/data';

const footerLinks = {
  Property: [
    { label: 'The Palm 🌴',         href: '/properties/the-palm-ayi-mensah' },
    { label: 'Jade Suite',          href: '/properties/jade-suite-east-legon' },
    { label: 'Serenity Villa',      href: '/properties/serenity-villa-trasacco' },
    { label: 'View All Properties', href: '/properties' },
  ],
  Company: [
    { label: 'Our Story',           href: '/about' },
    { label: 'Concierge Service',   href: '/contact' },
    { label: 'List Your Property',  href: '/contact#list' },
  ],
  Legal: [
    { label: 'Privacy Policy',      href: '/privacy' },
    { label: 'Terms of Service',    href: '/terms' },
    { label: 'Cancellation Policy', href: '/cancellation' },
  ],
};

const socials = [
  { Icon: Instagram, href: 'https://instagram.com', label: 'Instagram' },
  { Icon: Facebook,  href: 'https://facebook.com',  label: 'Facebook' },
];

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current" xmlns="http://www.w3.org/2000/svg">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

export default function Footer() {
  const year = new Date().getFullYear();
  const waHref = `https://wa.me/${CONTACT_INFO.whatsapp}?text=${encodeURIComponent("Hello, I'd like to enquire about The Palm")}`;

  return (
    <footer className="bg-[var(--surface)] border-t border-[var(--border)] mt-24">

      {/* ── Google Map Section ── */}
      <div className="border-b border-[var(--border)]">
        <div className="max-w-[1440px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr]">

            {/* Info panel */}
            <div className="flex flex-col justify-center px-8 lg:px-12 py-12 border-b lg:border-b-0 lg:border-r border-[var(--border)] bg-[var(--surface-2)]">
              <p className="section-label mb-3">Where We Are</p>
              <h3 className="font-serif text-3xl font-light text-white mb-4">
                Find Us in <span className="italic text-gold-gradient">Ayi Mensah</span>
              </h3>
              <p className="text-[var(--text-muted)] text-sm leading-relaxed mb-6">
                Nestled in the serene, lush hills of Ayi Mensah — a hidden gem just 30 minutes from Accra city centre.
              </p>
              <div className="space-y-3 mb-6">
                {[
                  { label: 'Address',      value: 'Ayi Mensah, Accra, Ghana' },
                  { label: 'Phone',        value: CONTACT_INFO.phone },
                  { label: 'From Airport', value: '~35 min drive' },
                ].map(({ label, value }) => (
                  <div key={label} className="flex items-start gap-3 text-sm">
                    <span className="text-[var(--text-subtle)] min-w-[100px]">{label}</span>
                    <span className="text-white">{value}</span>
                  </div>
                ))}
              </div>
              <a
                href="https://maps.google.com/?q=5.792905,-0.181711"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-ghost text-[0.7rem] py-3 w-full justify-center"
              >
                Open in Google Maps
              </a>
            </div>

            {/* Map embed */}
            <div className="relative h-72 lg:h-auto min-h-[300px] overflow-hidden">
              <iframe
                src="https://www.google.com/maps?q=5.792905,-0.181711&z=15&output=embed"
                width="100%"
                height="100%"
                style={{
                  border: 0,
                  filter: 'grayscale(1) invert(0.88) contrast(1.15) brightness(0.82) sepia(0.2) hue-rotate(5deg)',
                  position: 'absolute',
                  inset: 0,
                }}
                allowFullScreen={true}
                loading="lazy"
                title="Milehigh5280 location map"
              />
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                <div className="w-4 h-4 bg-[var(--gold)] rounded-full shadow-[0_0_0_4px_rgba(201,150,58,0.3),0_0_0_8px_rgba(201,150,58,0.15)] z-10" />
              </div>
              <div
                className="absolute inset-0 pointer-events-none"
                style={{ background: 'linear-gradient(135deg, rgba(8,8,8,0.35) 0%, transparent 50%, rgba(8,8,8,0.35) 100%)' }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ── CTA Banner ── */}
      <div className="border-b border-[var(--border)] py-16 px-6 lg:px-12 max-w-[1440px] mx-auto">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
          <div>
            <p className="section-label mb-3">Your Stay Awaits</p>
            <h2 className="font-serif text-3xl lg:text-5xl font-light text-white">
              Ready for your <span className="italic text-gold-gradient">palm retreat?</span>
            </h2>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <Link href="/properties" className="btn-gold">
              Explore Properties
            </Link>
            <a href={waHref} target="_blank" rel="noopener noreferrer" className="btn-ghost">
              <WhatsAppIcon />
              WhatsApp Us
              <ArrowUpRight size={14} />
            </a>
          </div>
        </div>
      </div>

      {/* ── Main Footer Grid ── */}
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12">

          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-flex items-center gap-3 mb-6 group">
              <div className="relative w-10 h-10 rounded-full overflow-hidden border border-[var(--border-bright)]">
                <Image
                  src="https://res.cloudinary.com/dwsl2ktt2/image/upload/v1775296671/logo_xcjkpn.jpg"
                  alt="Milehigh Properties Logo"
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
              <div className="flex flex-col leading-none">
                <span className="font-serif text-xl font-light text-white group-hover:text-[var(--gold)] transition-colors">
                  Milehigh5280 🌴
                </span>
                <span className="text-[0.48rem] tracking-[0.22em] uppercase text-[var(--gold)] font-sans mt-0.5">
                  Ayi Mensah &middot; Milehigh Properties
                </span>
              </div>
            </Link>

            <p className="text-[var(--text-muted)] text-sm leading-relaxed mb-5 max-w-xs">
              A premium private apartment in Ayi Mensah, Accra &mdash; managed with care and warmth
              by Milehigh Properties. Your home away from home in Ghana.
            </p>

            {/* Contact info */}
            <div className="space-y-2 mb-6">
              {[
                { Icon: MapPin, text: 'Ayi Mensah, Accra, Greater Accra Region' },
                { Icon: Phone,  text: CONTACT_INFO.phone },
                { Icon: Mail,   text: CONTACT_INFO.email },
              ].map(({ Icon, text }) => (
                <div key={text} className="flex items-start gap-3 text-[var(--text-muted)] text-sm">
                  <Icon size={13} className="shrink-0 mt-0.5 text-[var(--gold)]" />
                  <span>{text}</span>
                </div>
              ))}
            </div>

            {/* Socials */}
            <div className="flex items-center gap-3">
              {socials.map(({ Icon, href, label }) => (
                <Link
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-9 h-9 border border-[var(--border)] flex items-center justify-center text-[var(--text-muted)] hover:border-[var(--gold)] hover:text-[var(--gold)] transition-all duration-300"
                >
                  <Icon size={14} />
                </Link>
              ))}
              <a
                href={`https://wa.me/${CONTACT_INFO.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="w-9 h-9 border border-[var(--border)] flex items-center justify-center text-[var(--text-muted)] hover:border-[#25D366] hover:text-[#25D366] transition-all duration-300"
              >
                <WhatsAppIcon />
              </a>
            </div>
          </div>

          {/* Link Columns */}
          {Object.entries(footerLinks).map(([group, links]) => (
            <div key={group}>
              <p className="section-label mb-5">{group}</p>
              <ul className="space-y-3">
                {links.map(({ label, href }) => (
                  <li key={label}>
                    <Link
                      href={href}
                      className="text-[var(--text-muted)] text-sm hover:text-[var(--gold)] transition-colors duration-300"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Trust & Payments Column */}
          <div className="flex flex-col">
            <p className="section-label mb-5">Trust &amp; Security</p>
            <div className="flex items-center gap-4 mb-8">
              <Image
                src="https://res.cloudinary.com/dwsl2ktt2/image/upload/v1775464415/download_4_oq9yab.jpg"
                alt="Verified & Trusted"
                width={48}
                height={48}
                className="rounded-full object-cover border border-[var(--border)]"
                unoptimized
              />
              <Image
                src="https://res.cloudinary.com/dwsl2ktt2/image/upload/v1775385071/download_zhjmpt.png"
                alt="Listed on Airbnb"
                width={80}
                height={24}
                className="object-contain"
                unoptimized
              />
            </div>
            
            <div className="mt-auto">
              <p className="text-[var(--text-subtle)] text-[0.6rem] uppercase tracking-widest mb-3">Secure Payments</p>
              <Image
                src="https://res.cloudinary.com/dwsl2ktt2/image/upload/v1775464512/images_2_aaxcyb.jpg"
                alt="Accepted payment methods"
                width={150}
                height={30}
                className="object-contain"
                unoptimized
              />
            </div>
          </div>

        </div>
      </div>

      {/* ── Bottom Bar ── */}
      <div className="border-t border-[var(--border)] px-6 lg:px-12 py-6 max-w-[1440px] mx-auto">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-[var(--text-subtle)] text-xs">
          <p className="text-[var(--gold)] font-medium">&copy; {year} Milehigh Properties &middot; All rights reserved</p>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            <span>Accepting bookings &middot; Ayi Mensah, Accra, Ghana 🇬🇭</span>
          </div>
          <div className="flex gap-4">
            {['Privacy', 'Terms'].map((item) => (
              <Link
                key={item}
                href={`/${item.toLowerCase()}`}
                className="hover:text-white transition-colors"
              >
                {item}
              </Link>
            ))}
          </div>
        </div>
      </div>

    </footer>
  );
}
