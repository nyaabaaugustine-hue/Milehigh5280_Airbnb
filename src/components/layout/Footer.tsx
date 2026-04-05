import Link from 'next/link';
import Image from 'next/image';
import { Instagram, Facebook, MapPin, Phone, Mail, ArrowUpRight } from 'lucide-react';

const footerLinks = {
  Property: [
    { label: 'The Palm 🌴',           href: '/properties/the-palm-ayi-mensah' },
    { label: 'Jade Suite',            href: '/properties/jade-suite-east-legon' },
    { label: 'Serenity Villa',        href: '/properties/serenity-villa-trasacco' },
    { label: 'View All Properties',   href: '/properties' },
  ],
  Company: [
    { label: 'Our Story',             href: '/about' },
    { label: 'Concierge Service',     href: '/contact' },
    { label: 'List Your Property',    href: '/contact#list' },
  ],
  Legal: [
    { label: 'Privacy Policy',        href: '/privacy' },
    { label: 'Terms of Service',      href: '/terms' },
    { label: 'Cancellation Policy',   href: '/cancellation' },
  ],
};

const socials = [
  { Icon: Instagram, href: 'https://instagram.com', label: 'Instagram' },
  { Icon: Facebook,  href: 'https://facebook.com',  label: 'Facebook' },
];

const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current" xmlns="http://www.w3.org/2000/svg">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[var(--surface)] border-t border-[var(--border)] mt-24">

      {/* ── Top CTA Banner ── */}
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
            <a
              href="https://wa.me/233541988383?text=Hello%2C%20I%27d%20like%20to%20enquire%20about%20The%20Palm"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost"
            >
              <WhatsAppIcon />
              WhatsApp Us
              <ArrowUpRight size={14} />
            </a>
          </div>
        </div>
      </div>

      {/* ── Main Footer Grid ── */}
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">

          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-flex items-center gap-3 mb-6 group">
              <div className="relative w-10 h-10 rounded-full overflow-hidden border border-[var(--border-bright)]">
                <Image
                  src="https://res.cloudinary.com/dwsl2ktt2/image/upload/v1775296671/logo_xcjkpn.jpg"
                  alt="The Palm Logo"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex flex-col leading-none">
                <span className="font-serif text-xl font-light text-white group-hover:text-[var(--gold)] transition-colors">The Palm 🌴</span>
                <span className="text-[0.48rem] tracking-[0.22em] uppercase text-[var(--gold)] font-sans mt-0.5">Ayi Mensah · Milehigh Properties</span>
              </div>
            </Link>
            <p className="text-[var(--text-muted)] text-sm leading-relaxed mb-6 max-w-xs">
              A premium private apartment in Ayi Mensah, Accra — managed with care and warmth
              by Milehigh Properties. Your home away from home in Ghana.
            </p>

            {/* Contact Info */}
            <div className="space-y-3 mb-8">
              {[
                { Icon: MapPin, text: 'Ayi Mensah, Accra, Greater Accra Region' },
                { Icon: Phone, text: '+233 54 198 8383' },
                { Icon: Mail,  text: 'herbertprempeh@gmail.com' },
              ].map(({ Icon, text }) => (
                <div key={text} className="flex items-start gap-3 text-[var(--text-muted)] text-sm">
                  <Icon size={14} className="shrink-0 mt-0.5 text-[var(--gold)]" />
                  <span>{text}</span>
                </div>
              ))}
            </div>

            {/* Socials */}
            <div className="flex gap-3">
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
              {/* WhatsApp social */}
              <a
                href="https://wa.me/233541988383"
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
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="section-label mb-5">{category}</h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    {link.disabled ? (
                      <span className="text-sm text-[var(--text-subtle)] cursor-not-allowed">
                        {link.label}
                      </span>
                    ) : (
                      <Link
                        href={link.href}
                        className="text-sm text-[var(--text-muted)] hover:text-white transition-colors duration-200"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* ── Bottom Bar ── */}
      <div className="border-t border-[var(--border)] py-6 px-6 lg:px-12 max-w-[1440px] mx-auto">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[var(--text-subtle)] text-xs">
            &copy; {year} Milehigh Properties. All rights reserved.
          </p>
          <div className="flex items-center gap-1">
            <div className="divider-gold w-8" />
            <span className="text-[0.6rem] tracking-[0.3em] uppercase text-[var(--gold)] px-3">
              The Palm 🌴 · Ayi Mensah 🇬🇭
            </span>
            <div className="divider-gold w-8" />
          </div>
          <div className="flex gap-4">
            {['Privacy', 'Terms'].map(item => (
              <Link
                key={item}
                href={`/${item.toLowerCase()}`}
                className="text-[var(--text-subtle)] text-xs hover:text-white transition-colors"
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
