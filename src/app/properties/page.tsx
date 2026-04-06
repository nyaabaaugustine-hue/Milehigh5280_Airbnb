import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Star, MapPin, Users, Bed, Bath, ArrowRight } from 'lucide-react';
import { getLiveProperties, formatCurrency } from '@/lib/data';

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
          {getLiveProperties().map((property) => {
            const heroImage = property.images.find(i => i.category === 'hero') || property.images[0];
            return (
              <div key={property.id} className="property-card group">
                {/* Image */}
                <div className="card-image relative h-72 overflow-hidden bg-[var(--surface-2)]">
                  <Image
                    src={heroImage.url}
                    alt={heroImage.alt}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-obsidian/80 via-transparent to-transparent" />

                  {property.isLive === false && (
                    <div className="absolute top-4 left-4 bg-obsidian/80 backdrop-blur-sm border border-[var(--gold)] text-[var(--gold)] text-[0.6rem] uppercase tracking-widest px-3 py-1.5 font-semibold">
                      Coming Soon
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

                {/* Content */}
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

                  <h3 className="font-serif text-2xl font-light text-white mb-1 group-hover:text-[var(--gold)] transition-colors duration-300">
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

                  <Link
                    href={property.isLive === false ? '/contact' : `/properties/${property.slug}`}
                    className="flex items-center justify-center gap-2 btn-ghost w-full text-[0.7rem] py-3"
                  >
                    {property.isLive === false ? 'Enquire Now' : 'View Property'}
                    <ArrowRight size={12} />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
}
