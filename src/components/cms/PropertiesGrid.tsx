'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Star, MapPin, Users, Bed, Bath, ArrowRight, Wifi, Wind, Car, Waves } from 'lucide-react';
import { cn } from '@/lib/utils';

// ─── Type ───────────────────────────────────────────────────────────────────
interface Property {
  id: string;
  name: string;
  slug: string;
  tagline?: string;
  description?: string;
  property_type?: string;
  badge?: string | null;
  price_per_night?: number;
  price_per_night_ghs?: number;
  currency?: string;
  city?: string;
  area?: string;
  hero_image?: string;
  rating?: number;
  review_count?: number;
  max_guests?: number;
  bedrooms?: number;
  bathrooms?: number;
  amenities?: string[];
  // normalised (from Neon service)
  type?: string;
  pricing?: { perNight?: number; perNightGHS?: number; currency?: string };
  location?: { city?: string; area?: string };
  images?: { hero?: { url: string; alt?: string }; gallery?: Array<{ url: string; alt?: string }> };
  capacity?: { guests?: number; bedrooms?: number; bathrooms?: number };
  isLive?: boolean;
  featured?: boolean;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
function getPrice(p: Property): number {
  return p.pricing?.perNight ?? p.price_per_night ?? 0;
}
function getPriceGHS(p: Property): number {
  return p.pricing?.perNightGHS ?? p.price_per_night_ghs ?? Math.round(getPrice(p) * 15.8);
}
function getImage(p: Property): string {
  return (
    p.images?.hero?.url ||
    p.images?.gallery?.[0]?.url ||
    p.hero_image ||
    'https://res.cloudinary.com/dwsl2ktt2/image/upload/v1775296671/5_yc05lt.jpg'
  );
}
function getCity(p: Property): string {
  return p.location?.city ?? p.city ?? 'Accra';
}
function getArea(p: Property): string {
  return p.location?.area ?? p.area ?? 'Ghana';
}
function getType(p: Property): string {
  return p.type ?? p.property_type ?? 'apartment';
}
function getGuests(p: Property): number {
  return p.capacity?.guests ?? p.max_guests ?? 2;
}
function getBeds(p: Property): number {
  return p.capacity?.bedrooms ?? p.bedrooms ?? 1;
}
function getBaths(p: Property): number {
  return p.capacity?.bathrooms ?? p.bathrooms ?? 1;
}
function getRating(p: Property): number {
  return p.rating ?? 0;
}
function getReviewCount(p: Property): number {
  return p.review_count ?? 0;
}

const TYPE_LABELS: Record<string, string> = {
  villa: 'Private Villa',
  penthouse: 'Penthouse',
  estate: 'Private Estate',
  cottage: 'Luxury Cottage',
  mansion: 'Private Mansion',
  apartment: 'Private Apartment',
};

const STATIC_FALLBACK: Property[] = [
  {
    id: '1',
    name: 'The Palm',
    slug: 'the-palm',
    tagline: 'Your Private Sanctuary in Ghana',
    property_type: 'apartment',
    badge: 'Featured',
    price_per_night: 150,
    price_per_night_ghs: 2370,
    city: 'Ayi Mensah',
    area: 'Accra',
    hero_image: 'https://res.cloudinary.com/dwsl2ktt2/image/upload/v1775296671/5_yc05lt.jpg',
    rating: 4.9,
    review_count: 28,
    max_guests: 4,
    bedrooms: 2,
    bathrooms: 1,
  },
];

// ─── Property Card ────────────────────────────────────────────────────────────
function PropertyCard({ property, index }: { property: Property; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [currency, setCurrency] = useState<'USD' | 'GHS'>('USD');

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const price = currency === 'GHS' ? getPriceGHS(property) : getPrice(property);
  const priceLabel = currency === 'GHS'
    ? `GH₵ ${price.toLocaleString()}`
    : `$${price.toLocaleString()}`;
  const typeLabel = TYPE_LABELS[getType(property)] || getType(property);
  const rating = getRating(property);
  const reviews = getReviewCount(property);
  const isLive = property.isLive !== false;

  return (
    <div
      ref={ref}
      className={cn(
        'transition-all duration-700',
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10',
      )}
      style={{ transitionDelay: `${index * 80}ms` }}
    >
      <Link
        href={`/properties/${property.slug}`}
        className="group block bg-[var(--surface)] border border-[var(--border)] hover:border-[var(--gold)] transition-all duration-500 overflow-hidden hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(0,0,0,0.5)]"
      >
        {/* Image */}
        <div className="relative aspect-[4/3] overflow-hidden bg-[var(--surface-2)]">
          <Image
            src={getImage(property)}
            alt={property.name}
            fill
            className={cn(
              'object-cover group-hover:scale-105 transition-transform duration-700',
              imgLoaded ? 'opacity-100' : 'opacity-0',
            )}
            onLoad={() => setImgLoaded(true)}
          />

          {/* Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#080808]/60 via-[#080808]/10 to-transparent" />

          {/* Loading shimmer */}
          {!imgLoaded && (
            <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-[var(--surface-2)] via-[var(--surface)] to-[var(--surface-2)]" />
          )}

          {/* Badges */}
          <div className="absolute top-3 left-3 flex gap-2">
            {property.badge && (
              <span className="bg-[var(--gold)] text-[#080808] text-[0.6rem] font-bold uppercase tracking-wider px-2.5 py-1">
                {property.badge}
              </span>
            )}
            {!isLive && (
              <span className="bg-[#080808]/80 text-[var(--gold)] border border-[var(--gold)] text-[0.6rem] uppercase tracking-wider px-2.5 py-1">
                Coming Soon
              </span>
            )}
          </div>

          {/* Type pill */}
          <div className="absolute top-3 right-3">
            <span className="bg-black/50 backdrop-blur-sm text-white/80 text-[0.6rem] uppercase tracking-widest px-2.5 py-1 border border-white/10">
              {typeLabel}
            </span>
          </div>

          {/* Currency toggle — appears on hover */}
          <div
            className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            onClick={e => { e.preventDefault(); setCurrency(c => c === 'USD' ? 'GHS' : 'USD'); }}
          >
            <div className="flex bg-black/70 backdrop-blur-sm border border-white/10 overflow-hidden">
              <span className={cn(
                'px-2.5 py-1 text-[0.6rem] font-medium transition-colors cursor-pointer',
                currency === 'USD' ? 'bg-[var(--gold)] text-[#080808]' : 'text-white/60 hover:text-white'
              )}>USD</span>
              <span className={cn(
                'px-2.5 py-1 text-[0.6rem] font-medium transition-colors cursor-pointer',
                currency === 'GHS' ? 'bg-[var(--gold)] text-[#080808]' : 'text-white/60 hover:text-white'
              )}>GHS</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Rating */}
          {rating > 0 && (
            <div className="flex items-center gap-1.5 mb-3">
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map(s => (
                  <Star
                    key={s}
                    size={11}
                    className={s <= Math.round(rating) ? 'fill-[var(--gold)] text-[var(--gold)]' : 'text-[var(--border)]'}
                  />
                ))}
              </div>
              <span className="text-[var(--gold)] text-xs font-semibold">{rating}</span>
              {reviews > 0 && (
                <span className="text-[var(--text-muted)] text-xs">· {reviews} reviews</span>
              )}
            </div>
          )}

          {/* Name & location */}
          <h3 className="font-serif text-xl lg:text-2xl text-white mb-1 group-hover:text-[var(--gold)] transition-colors">
            {property.name}
          </h3>
          <div className="flex items-center gap-1.5 text-[var(--text-muted)] text-xs mb-3">
            <MapPin size={12} className="text-[var(--gold)]" />
            <span>{getCity(property)}, {getArea(property)}</span>
          </div>

          {property.tagline && (
            <p className="text-[var(--text-subtle)] text-sm leading-relaxed mb-4 line-clamp-2">
              {property.tagline}
            </p>
          )}

          {/* Capacity row */}
          <div className="flex items-center gap-4 text-[var(--text-muted)] text-xs mb-5 py-4 border-y border-[var(--border)]">
            <span className="flex items-center gap-1.5">
              <Users size={13} className="text-[var(--gold)]" /> {getGuests(property)} guests
            </span>
            <span className="flex items-center gap-1.5">
              <Bed size={13} className="text-[var(--gold)]" /> {getBeds(property)} bed{getBeds(property) !== 1 ? 's' : ''}
            </span>
            <span className="flex items-center gap-1.5">
              <Bath size={13} className="text-[var(--gold)]" /> {getBaths(property)} bath{getBaths(property) !== 1 ? 's' : ''}
            </span>
          </div>

          {/* Price & CTA */}
          <div className="flex items-center justify-between">
            <div>
              <span className="font-serif text-2xl text-white">{priceLabel}</span>
              <span className="text-[var(--text-muted)] text-xs"> / night</span>
            </div>
            <div className="w-9 h-9 border border-[var(--border)] flex items-center justify-center group-hover:bg-[var(--gold)] group-hover:border-[var(--gold)] transition-all duration-300">
              <ArrowRight size={15} className="text-[var(--text-muted)] group-hover:text-[#080808] group-hover:translate-x-0.5 transition-all duration-300" />
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}

// ─── Featured Card (large hero card for first property) ──────────────────────
function FeaturedCard({ property }: { property: Property }) {
  const [visible, setVisible] = useState(false);
  const [currency, setCurrency] = useState<'USD' | 'GHS'>('USD');
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold: 0.05 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const price = currency === 'GHS' ? getPriceGHS(property) : getPrice(property);
  const priceLabel = currency === 'GHS' ? `GH₵ ${price.toLocaleString()}` : `$${price.toLocaleString()}`;

  return (
    <div
      ref={ref}
      className={cn(
        'col-span-full transition-all duration-1000',
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12',
      )}
    >
      <Link
        href={`/properties/${property.slug}`}
        className="group relative block overflow-hidden border border-[var(--border)] hover:border-[var(--gold)] transition-all duration-500"
      >
        {/* Image */}
        <div className="relative h-[480px] lg:h-[580px] w-full overflow-hidden">
          <Image
            src={getImage(property)}
            alt={property.name}
            fill
            priority
            className="object-cover group-hover:scale-[1.03] transition-transform duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#080808]/90 via-[#080808]/50 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#080808]/60 to-transparent" />
        </div>

        {/* Overlay content */}
        <div className="absolute inset-0 flex flex-col justify-end p-8 lg:p-12">
          <div className="max-w-2xl">
            {/* Badges */}
            <div className="flex flex-wrap gap-2 mb-4">
              {property.badge && (
                <span className="bg-[var(--gold)] text-[#080808] text-[0.6rem] font-bold uppercase tracking-wider px-3 py-1">
                  {property.badge}
                </span>
              )}
              <span className="text-white/60 text-[0.6rem] uppercase tracking-widest border border-white/20 px-3 py-1 bg-black/30 backdrop-blur-sm">
                {TYPE_LABELS[getType(property)] || getType(property)}
              </span>
            </div>

            {getRating(property) > 0 && (
              <div className="flex items-center gap-2 mb-3">
                <div className="flex gap-0.5">
                  {[1,2,3,4,5].map(s => (
                    <Star key={s} size={12} className={s <= Math.round(getRating(property)) ? 'fill-[var(--gold)] text-[var(--gold)]' : 'text-white/30'} />
                  ))}
                </div>
                <span className="text-[var(--gold)] text-sm font-semibold">{property.rating}</span>
                <span className="text-white/50 text-xs">· {getReviewCount(property)} reviews</span>
              </div>
            )}

            <h2 className="font-serif text-4xl lg:text-5xl text-white font-light mb-3 leading-tight">
              {property.name}
            </h2>
            {property.tagline && (
              <p className="font-serif italic text-[var(--gold)] text-lg mb-4">{property.tagline}</p>
            )}

            <div className="flex items-center gap-1.5 text-white/70 text-sm mb-6">
              <MapPin size={14} className="text-[var(--gold)]" />
              {getCity(property)}, {getArea(property)}, Ghana
            </div>

            <div className="flex flex-wrap items-center gap-5">
              <div>
                <div
                  className="inline-flex bg-black/50 backdrop-blur-sm border border-white/10 overflow-hidden mb-1"
                  onClick={e => { e.preventDefault(); setCurrency(c => c === 'USD' ? 'GHS' : 'USD'); }}
                >
                  {(['USD', 'GHS'] as const).map(c => (
                    <span
                      key={c}
                      className={cn(
                        'px-3 py-1 text-xs font-medium cursor-pointer transition-colors',
                        currency === c ? 'bg-[var(--gold)] text-[#080808]' : 'text-white/60 hover:text-white'
                      )}
                    >
                      {c}
                    </span>
                  ))}
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="font-serif text-3xl text-white">{priceLabel}</span>
                  <span className="text-white/60 text-sm"> / night</span>
                </div>
              </div>

              <div className="flex items-center gap-5 text-white/60 text-sm">
                <span className="flex items-center gap-1.5"><Users size={14} /> {getGuests(property)}</span>
                <span className="flex items-center gap-1.5"><Bed size={14} /> {getBeds(property)}</span>
                <span className="flex items-center gap-1.5"><Bath size={14} /> {getBaths(property)}</span>
              </div>

              <div className="ml-auto hidden lg:flex items-center gap-2 text-[var(--gold)] font-medium group-hover:gap-3 transition-all">
                View Property
                <ArrowRight size={16} />
              </div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}

// ─── Filter Tab ───────────────────────────────────────────────────────────────
function FilterTab({
  label,
  active,
  count,
  onClick,
}: {
  label: string;
  active: boolean;
  count: number;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'px-5 py-2.5 text-sm border transition-all duration-200 flex items-center gap-2',
        active
          ? 'bg-[var(--gold)] text-[#080808] border-[var(--gold)] font-semibold'
          : 'border-[var(--border)] text-[var(--text-muted)] hover:border-[var(--gold)] hover:text-white bg-[var(--surface)]',
      )}
    >
      {label}
      <span className={cn(
        'text-xs px-1.5 py-0.5 rounded-full',
        active ? 'bg-[#080808]/20 text-[#080808]' : 'bg-[var(--surface-2)] text-[var(--text-subtle)]'
      )}>
        {count}
      </span>
    </button>
  );
}

// ─── Main Grid Component ──────────────────────────────────────────────────────
interface PropertiesGridProps {
  dbProperties?: Property[];
}

export default function PropertiesGrid({ dbProperties }: PropertiesGridProps) {
  const rawProperties = (dbProperties && dbProperties.length > 0) ? dbProperties : STATIC_FALLBACK;
  const [filter, setFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'default' | 'price-asc' | 'price-desc' | 'rating'>('default');

  // Derive available types
  const typeCounts = rawProperties.reduce<Record<string, number>>((acc, p) => {
    const t = getType(p);
    acc[t] = (acc[t] || 0) + 1;
    return acc;
  }, {});

  const activeTypes = Object.entries(typeCounts).filter(([, c]) => c > 0);

  // Filter
  let filtered = filter === 'all'
    ? rawProperties
    : rawProperties.filter(p => getType(p) === filter);

  // Sort
  filtered = [...filtered].sort((a, b) => {
    if (sortBy === 'price-asc') return getPrice(a) - getPrice(b);
    if (sortBy === 'price-desc') return getPrice(b) - getPrice(a);
    if (sortBy === 'rating') return getRating(b) - getRating(a);
    return 0;
  });

  // Split featured from rest
  const [featuredCard, ...gridCards] = filtered;

  return (
    <div className="py-12 px-6 lg:px-12 max-w-[1440px] mx-auto">

      {/* Filter & Sort Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-10">
        {/* Type filters */}
        <div className="flex flex-wrap gap-2">
          <FilterTab
            label="All Properties"
            active={filter === 'all'}
            count={rawProperties.length}
            onClick={() => setFilter('all')}
          />
          {activeTypes.map(([type, count]) => (
            <FilterTab
              key={type}
              label={TYPE_LABELS[type] || type}
              active={filter === type}
              count={count}
              onClick={() => setFilter(type)}
            />
          ))}
        </div>

        {/* Sort */}
        <div className="flex items-center gap-2">
          <span className="text-[var(--text-muted)] text-xs uppercase tracking-widest">Sort:</span>
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value as typeof sortBy)}
            className="bg-[var(--surface)] border border-[var(--border)] text-[var(--text-muted)] text-sm px-3 py-2 hover:border-[var(--gold)] transition-colors outline-none cursor-pointer"
          >
            <option value="default">Default</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating">Top Rated</option>
          </select>
        </div>
      </div>

      {/* Results count */}
      <p className="text-[var(--text-muted)] text-sm mb-8">
        Showing <span className="text-white font-medium">{filtered.length}</span> {filtered.length === 1 ? 'property' : 'properties'}
        {filter !== 'all' && <span> · <button onClick={() => setFilter('all')} className="text-[var(--gold)] hover:underline">Clear filter</button></span>}
      </p>

      {filtered.length === 0 ? (
        <div className="text-center py-24 border border-[var(--border)] bg-[var(--surface)]">
          <Waves size={40} className="text-[var(--gold)] mx-auto mb-4 opacity-50" />
          <p className="font-serif text-xl text-white mb-2">No Properties Found</p>
          <p className="text-[var(--text-muted)] text-sm mb-6">Try clearing the filter to see all available properties.</p>
          <button onClick={() => setFilter('all')} className="btn-ghost text-sm">
            View All Properties
          </button>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Featured hero card */}
          {featuredCard && (
            <div className="grid grid-cols-1">
              <FeaturedCard property={featuredCard} />
            </div>
          )}

          {/* Remaining cards grid */}
          {gridCards.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {gridCards.map((property, i) => (
                <PropertyCard key={property.id} property={property} index={i} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Bottom CTA */}
      <div className="mt-20 pt-12 border-t border-[var(--border)] text-center">
        <p className="section-label mb-4">Can&apos;t Find What You&apos;re Looking For?</p>
        <h3 className="font-serif text-2xl lg:text-3xl text-white font-light mb-4">
          Let us find your perfect stay
        </h3>
        <p className="text-[var(--text-muted)] max-w-md mx-auto mb-6 text-sm leading-relaxed">
          Our concierge team specialises in matching guests with the perfect property for their needs, budget, and occasion.
        </p>
        <Link href="/contact" className="btn-gold inline-flex">
          Contact Concierge
        </Link>
      </div>
    </div>
  );
}
