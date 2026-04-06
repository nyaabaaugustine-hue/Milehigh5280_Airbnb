import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Star, MapPin, Users, Bed, Bath, ArrowRight, Clock } from 'lucide-react';
import { properties, formatCurrency } from '@/lib/data';

export const metadata: Metadata = {
  title: 'Properties — The Palm & Milehigh Properties',
  description: 'Browse our curated collection of premium private apartments and villas across Accra, Ghana — by Milehigh Properties.',
};

const typeLabels: Record<string, string> = {
  villa:     'Private Villa',
  penthouse: 'Penthouse',
  estate:    'Private Estate',
  cottage:   'Luxury Cottage',
  mansion:   'Private Mansion',
  apartment: 'Private Apartment',
};

const badgeColors: Record<string, string> = {
  'Editors Choice': 'bg-[var(--gold)] text-[#080808]',
  'Most Booked':    'bg-white/10 text-white border border-white/20',
  'New Arrival':    'bg-[var(--surface-3)] text-[var(--gold)] border border-[var(--border)]',
  'Exclusive':      'bg-[var(--gold)] text-[#080808]',
};

export default function PropertiesPage() {
  return (
    <>
      {/* ── Page Hero ── */}
      <section className="relative pt-40 pb-20 px-6 lg:px-12 border-b border-[var(--border)]">
        <div className="max-w-[1440px] mx-auto">
          <p className="section-label mb-4">Our Portfolio</p>
          <h1 className="font-serif font-light text-white leading-tight mb-4">
            All <span className="italic text-gold-gradient">Properties</span>
          </h1>
          <p className="text-[var(--text-muted)] max-w-xl leading-relaxed">
            Every property managed by Milehigh Properties to the highest standards of Ghanaian
            luxury hospitality — private, secure, and beautifully maintained.
          </p>
        </div>
      </section>

      {/* ── Properties Grid ── */}
      <section className="py-24 px-6 lg:px-12 max-w-[1440px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {properties.map((property) => {
            const heroImage = property.images.find(i => i.category === 'hero') || property.images[0];
            const isLive = property.isLive !== false;

            return (
              <div
                key={property.id}
                className="property-card group relative"
              >
                {/* Coming Soon ribbon */}
                {!isLive && (
                  <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-center gap-2 bg-[#080808]/80 backdrop-blur-sm border-b border-[var(--gold)]/40 py-2.5">
                    <Clock size={11} className="text-[var(--gold)]" />
                    <span className="text-[var(--gold)] text-[0.6rem] tracking-[0.3em] uppercase font-semibold">Coming Soon</span>
                  </div>
                )}

                {/* ── Image ── */}
                <div className={`card-image relative h-72 overflow-hidden bg-[var(--surface-2)] ${!isLive ? 'grayscale-[0.6]' : ''}`}>
                  <Image
                    src={heroImage.url}
                    alt={heroImage.alt}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-obsidian/80 via-transparent to-transparent" />

                  {property.badge && (
                    <div className={`absolute top-4 left-4 text-[0.6rem] tracking-widest uppercase px-3 py-1.5 font-sans font-medium ${badgeColors[property.badge] ?? 'bg-[var(--gold)] text-[#080808]'} ${!isLive ? 'mt-8' : ''}`}>
                      {property.badge}
                    </div>
                  )}

                  <div className="absolute bottom-4 right-4 bg-obsidian/80 backdrop-blur-sm border border-[var(--border)] px-3 py-2">
                    <span className="font-serif text-lg font-light text-white">
                      {formatCurrency(property.pricing.perNight)}
                    </span>
                    <span className="text-[var(--text-muted)] text-xs"> / night</span>
                  </div>

                  <div className="absolute bottom-4 left-4 flex items-center gap-1.5">
                    <Star size={12} className="fill-[var(--gold)] text-[var(--gold)]" />
                    <span className="text-white text-xs font-medium">{property.rating}</span>
                    <span className="text-[var(--text-muted)] text-xs">({property.reviewCount})</span>
                  </div>
                </div>

                {/* ── Content ── */}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1.5">
                      <MapPin size={11} className="text-[var(--gold)]" />
                      <span className="text-[var(--text-muted)] text-xs tracking-widest uppercase">
                        {property.location.city}
                      </span>
                    </div>
                    <span className="text-[0.6rem] tracking-widest uppercase text-[var(--text-subtle)] border border-[var(--border)] px-2 py-1">
                      {typeLabels[property.type] ?? property.type}
                    </span>
                  </div>

                  <h3 className={`font-serif text-2xl font-light mb-1 transition-colors duration-300 ${isLive ? 'text-white group-hover:text-[var(--gold)]' : 'text-[var(--text-muted)]'}`}>
                    {property.name}
                  </h3>
                  <p className="text-[var(--text-muted)] text-sm leading-relaxed mb-5 line-clamp-2">
                    {property.tagline}
                  </p>

                  <div className="flex items-center gap-4 text-xs text-[var(--text-muted)] border-t border-[var(--border)] pt-4 mb-4">
                    <div className="flex items-center gap-1.5">
                      <Users size={12} className="text-[var(--gold)]" />
                      <span>{property.capacity.guests} guests</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Bed size={12} className="text-[var(--gold)]" />
                      <span>{property.capacity.bedrooms} beds</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Bath size={12} className="text-[var(--gold)]" />
                      <span>{property.capacity.bathrooms} baths</span>
                    </div>
                  </div>

                  {isLive ? (
                    <Link
                      href={`/properties/${property.slug}`}
                      className="flex items-center justify-center gap-2 btn-ghost w-full text-[0.7rem] py-3"
                    >
                      View Property
                      <ArrowRight size={12} />
                    </Link>
                  ) : (
                    <div className="space-y-2">
                      {/* Coming Soon overlay card */}
                      <div className="border border-[var(--gold)]/30 bg-[rgba(201,150,58,0.04)] p-4 text-center">
                        <div className="flex items-center justify-center gap-2 mb-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-[var(--gold)] animate-pulse" />
                          <span className="text-[var(--gold)] text-[0.6rem] tracking-[0.25em] uppercase font-semibold">Opening Soon</span>
                          <div className="w-1.5 h-1.5 rounded-full bg-[var(--gold)] animate-pulse" />
                        </div>
                        <p className="text-[var(--text-muted)] text-xs leading-relaxed">
                          This property is currently being prepared to our luxury standard.
                          Register your interest to get notified first.
                        </p>
                      </div>
                      <Link
                        href={`/contact?property=${property.slug}`}
                        className="flex items-center justify-center gap-2 btn-ghost w-full text-[0.7rem] py-3 opacity-80 hover:opacity-100"
                      >
                        Enquire Now
                        <ArrowRight size={12} />
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
}
