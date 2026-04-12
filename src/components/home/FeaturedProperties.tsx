'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Star, MapPin, Users, Bed, Bath, ArrowRight, Phone,
  ChevronLeft, ChevronRight, Wifi, Wind, Shield, Zap,
  TreePalm, UtensilsCrossed, Car, Tv, Check,
} from 'lucide-react';
import { getLivePropertiesNeon } from '@/lib/neon/service';
import { CONTACT_INFO } from '@/lib/data';
import { cn } from '@/lib/utils';
import type { Property } from '@/types';

// ─── Amenity labels & icons ──────────────────────────────────────────────────
const AMENITY_ICONS: Record<string, React.ElementType> = {
  wifi: Wifi,
  'air-conditioning': Wind,
  security: Shield,
  electricity: Zap,
  garden: TreePalm,
  kitchen: UtensilsCrossed,
  parking: Car,
  tv: Tv,
};
const AMENITY_LABEL: Record<string, string> = {
  wifi: 'Wi-Fi',
  'air-conditioning': 'Air Con',
  security: 'Security',
  electricity: '24h Power',
  garden: 'Garden',
  kitchen: 'Kitchen',
  parking: 'Parking',
  tv: 'Smart TV',
  pool: 'Pool',
  gym: 'Gym',
  bbq: 'BBQ',
  washer: 'Washer',
};

// ─── Static fallback (shown while fetching / on error) ──────────────────────
const STATIC: any = {
  id: '1',
  name: 'The Palm',
  slug: 'the-palm',
  tagline: 'Your Private Sanctuary in Ghana',
  description: 'A beautifully furnished private apartment in the serene Ayi Mensah area of Accra.',
  type: 'apartment',
  badge: 'Featured',
  isLive: true,
  featured: true,
  location: { city: 'Ayi Mensah', area: 'Accra', country: 'Ghana' },
  pricing: { perNight: 50, perNightGHS: 790, currency: 'USD' },
  capacity: { guests: 4, bedrooms: 2, bathrooms: 1, beds: 2 },
  images: {
    hero: { url: 'https://res.cloudinary.com/dwsl2ktt2/image/upload/v1775380667/ERR_jjr2hx.jpg', alt: 'The Palm' },
    gallery: [
      { url: 'https://res.cloudinary.com/dwsl2ktt2/image/upload/v1775548165/nwe1_vkdfe3.png', alt: 'Main Entrance' },
      { url: 'https://res.cloudinary.com/dwsl2ktt2/image/upload/v1775380667/ERR_jjr2hx.jpg', alt: 'Living Room' },
      { url: 'https://res.cloudinary.com/dwsl2ktt2/image/upload/v1775296671/1_ijqfai.jpg', alt: 'Primary Bedroom' },
      { url: 'https://res.cloudinary.com/dwsl2ktt2/image/upload/v1775296671/3_wgur1l.jpg', alt: 'Guest Room' },
      { url: 'https://res.cloudinary.com/dwsl2ktt2/image/upload/v1775296671/2_xvzt1y.jpg', alt: 'Balcony View' },
      { url: 'https://res.cloudinary.com/dwsl2ktt2/image/upload/v1775296671/6_ffo1ly.jpg', alt: 'Kitchen Area' },
    ],
  },
  amenities: ['wifi', 'air-conditioning', 'kitchen', 'parking', 'security', 'tv'],
  rating: 4.9,
  reviewCount: 28,
};

// ─── Animated Counter ────────────────────────────────────────────────────────
function Counter({ to, suffix = '' }: { to: number; suffix?: string }) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started.current) {
        started.current = true;
        const dur = 1600;
        const t0 = performance.now();
        const tick = (now: number) => {
          const p = Math.min((now - t0) / dur, 1);
          setVal(Math.round((1 - Math.pow(1 - p, 3)) * to));
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      }
    }, { threshold: 0.5 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [to]);
  return <span ref={ref}>{val}{suffix}</span>;
}

// ─── Props ────────────────────────────────────────────────────────────────────
interface Props {
  onBookNow?: () => void;
  onViewProperty?: (p: Property) => void;
}

// ─── Component ───────────────────────────────────────────────────────────────
export default function FeaturedProperties({ onBookNow, onViewProperty }: Props) {
  const [property, setProperty] = useState<any>(STATIC);
  const [allProperties, setAllProperties] = useState<any[]>([STATIC]);
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [vis, setVis] = useState(false);
  const [activeImg, setActiveImg] = useState(0);
  const [currency, setCurrency] = useState<'USD' | 'GHS'>('USD');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [imgVisible, setImgVisible] = useState(true);
  const sectionRef = useRef<HTMLElement>(null);

  // Intersection observer for section reveal
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVis(true); obs.disconnect(); } }, { threshold: 0.08 });
    if (sectionRef.current) obs.observe(sectionRef.current);
    return () => obs.disconnect();
  }, []);

  // Fetch from Neon
  useEffect(() => {
    getLivePropertiesNeon()
      .then(data => {
        if (data.length > 0) {
          setAllProperties(data);
          setProperty(data[0]);
          setSelectedIdx(0);
        }
      })
      .catch(() => {});
  }, []);

  // Switch property
  const selectProperty = useCallback((idx: number) => {
    if (idx === selectedIdx) return;
    setIsTransitioning(true);
    setImgVisible(false);
    setTimeout(() => {
      setSelectedIdx(idx);
      setProperty(allProperties[idx]);
      setActiveImg(0);
      setIsTransitioning(false);
      setImgVisible(true);
    }, 350);
  }, [selectedIdx, allProperties]);

  const images: Array<{ url: string; alt: string }> = (() => {
    const list: Array<{ url: string; alt: string }> = [];
    if (property?.images?.hero?.url) list.push(property.images.hero);
    (property?.images?.gallery || []).forEach((g: any) => {
      if (g?.url && !list.find(x => x.url === g.url)) list.push(g);
    });
    return list;
  })();

  const prevImg = useCallback(() => {
    setActiveImg(i => (i === 0 ? images.length - 1 : i - 1));
  }, [images.length]);

  const nextImg = useCallback(() => {
    setActiveImg(i => (i === images.length - 1 ? 0 : i + 1));
  }, [images.length]);

  const perNight = currency === 'GHS'
    ? (property?.pricing?.perNightGHS ?? Math.round((property?.pricing?.perNight ?? 0) * 15.8))
    : (property?.pricing?.perNight ?? 0);

  const priceLabel = currency === 'GHS'
    ? `GH₵ ${perNight.toLocaleString()}`
    : `$${perNight.toLocaleString()}`;

  const amenities: string[] = Array.isArray(property?.amenities) ? property.amenities : [];

  return (
    <section
      ref={sectionRef}
      id="featured-properties"
      className="py-24 lg:py-32 bg-[var(--surface)] overflow-hidden"
    >
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">

        {/* ── Section Header ── */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-14 lg:mb-20">
          <div className={cn(
            'transition-all duration-1000',
            vis ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          )}>
            <p className="section-label mb-3">Our Portfolio</p>
            <h2 className="font-serif text-4xl lg:text-5xl text-white font-light leading-tight">
              {allProperties.length > 1 ? 'Featured Properties' : 'Featured Property'}
            </h2>
            <p className="text-[var(--text-muted)] text-base mt-3 max-w-lg leading-relaxed">
              Handpicked luxury accommodations in Ghana — private, secure, and beautifully maintained.
            </p>
          </div>

          <div className={cn(
            'flex items-center gap-3 transition-all duration-1000 delay-200',
            vis ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          )}>
            <Link href="/properties" className="btn-ghost text-sm inline-flex items-center gap-2">
              View All Properties <ArrowRight size={15} />
            </Link>
          </div>
        </div>

        {/* ── Property Selector tabs (if multiple) ── */}
        {allProperties.length > 1 && (
          <div className={cn(
            'flex flex-wrap gap-3 mb-10 transition-all duration-1000 delay-100',
            vis ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          )}>
            {allProperties.map((p, i) => (
              <button
                key={p.id || i}
                onClick={() => selectProperty(i)}
                className={cn(
                  'px-4 py-2 text-sm border transition-all duration-200',
                  i === selectedIdx
                    ? 'bg-[var(--gold)] text-[#080808] border-[var(--gold)] font-semibold'
                    : 'border-[var(--border)] text-[var(--text-muted)] hover:border-[var(--gold)] hover:text-white bg-[var(--surface-2)]'
                )}
              >
                {p.name}
              </button>
            ))}
          </div>
        )}

        {/* ── Main Card ── */}
        <div
          className={cn(
            'grid lg:grid-cols-2 gap-8 lg:gap-14 xl:gap-20 transition-all duration-700',
            vis ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12',
            isTransitioning ? 'opacity-50 scale-[0.99]' : 'opacity-100 scale-100'
          )}
        >
          {/* ── Image carousel ── */}
          <div className="relative overflow-hidden group">
            {/* Main image */}
            <div className={cn(
              'relative aspect-[4/3] overflow-hidden transition-opacity duration-350',
              imgVisible ? 'opacity-100' : 'opacity-0'
            )}>
              {images.length > 0 ? (
                <>
                  <Image
                    src={images[activeImg]?.url || images[0]?.url}
                    alt={images[activeImg]?.alt || property?.name}
                    fill
                    className="object-cover"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#080808]/50 via-transparent to-transparent" />
                  <div className="absolute inset-0 bg-gradient-to-r from-[#080808]/20 to-transparent" />

                  {/* Badges */}
                  <div className="absolute top-4 left-4 flex gap-2 z-10">
                    {property?.badge && (
                      <span className="bg-[var(--gold)] text-[#080808] text-[0.6rem] font-bold uppercase tracking-wider px-3 py-1">
                        {property.badge}
                      </span>
                    )}
                    {property?.isLive === false && (
                      <span className="bg-[#080808]/80 text-[var(--gold)] border border-[var(--gold)] text-[0.6rem] uppercase tracking-wider px-3 py-1">
                        Coming Soon
                      </span>
                    )}
                  </div>

                  {/* Navigation arrows */}
                  {images.length > 1 && (
                    <>
                      <button
                        onClick={prevImg}
                        aria-label="Previous image"
                        className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-11 h-11 flex items-center justify-center bg-[#080808]/70 backdrop-blur-sm border border-white/10 text-white hover:bg-[var(--gold)] hover:text-[#080808] hover:border-[var(--gold)] transition-all duration-300 opacity-0 group-hover:opacity-100"
                      >
                        <ChevronLeft size={18} />
                      </button>
                      <button
                        onClick={nextImg}
                        aria-label="Next image"
                        className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-11 h-11 flex items-center justify-center bg-[#080808]/70 backdrop-blur-sm border border-white/10 text-white hover:bg-[var(--gold)] hover:text-[#080808] hover:border-[var(--gold)] transition-all duration-300 opacity-0 group-hover:opacity-100"
                      >
                        <ChevronRight size={18} />
                      </button>
                    </>
                  )}

                  {/* Image counter */}
                  <div className="absolute bottom-4 left-4 text-white/60 text-xs z-10 bg-black/40 backdrop-blur-sm px-2.5 py-1 border border-white/10">
                    {activeImg + 1} / {images.length}
                  </div>
                </>
              ) : (
                <div className="w-full h-full bg-[var(--surface-2)] flex items-center justify-center">
                  <span className="text-[var(--text-muted)] text-sm">No image available</span>
                </div>
              )}
            </div>

            {/* Dot navigation */}
            {images.length > 1 && (
              <div className="flex justify-center gap-2 mt-4">
                {images.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImg(i)}
                    aria-label={`Image ${i + 1}`}
                    className={cn(
                      'h-1.5 transition-all duration-300',
                      i === activeImg ? 'bg-[var(--gold)] w-8' : 'bg-[var(--border)] hover:bg-[var(--text-muted)] w-4'
                    )}
                  />
                ))}
              </div>
            )}

            {/* Thumbnail strip */}
            {images.length > 1 && (
              <div className="hidden lg:flex gap-2 mt-3">
                {images.slice(0, 5).map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImg(i)}
                    className={cn(
                      'relative flex-1 aspect-video overflow-hidden border-2 transition-all duration-200',
                      i === activeImg ? 'border-[var(--gold)]' : 'border-transparent hover:border-white/30'
                    )}
                  >
                    <Image src={img.url} alt={img.alt} fill className="object-cover" />
                    {i === activeImg && <div className="absolute inset-0 bg-[var(--gold)]/10" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── Property Info ── */}
          <div className="flex flex-col justify-center">
            {/* Header */}
            <div className="mb-6">
              {(property?.rating ?? 0) > 0 && (
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex gap-0.5">
                    {[1,2,3,4,5].map(s => (
                      <Star
                        key={s}
                        size={13}
                        className={s <= Math.round(property.rating) ? 'fill-[var(--gold)] text-[var(--gold)]' : 'text-[var(--border)]'}
                      />
                    ))}
                  </div>
                  <span className="text-[var(--gold)] font-semibold text-sm">{property.rating}</span>
                  <span className="text-[var(--text-muted)] text-sm">
                    ({property.reviewCount ?? 0} reviews)
                  </span>
                </div>
              )}

              <h3 className="font-serif text-3xl lg:text-4xl text-white font-light mb-2 leading-tight">
                {property?.name}
              </h3>
              {property?.tagline && (
                <p className="font-serif italic text-[var(--gold)] text-lg mb-3">{property.tagline}</p>
              )}
              <div className="flex items-center gap-1.5 text-[var(--text-muted)] text-sm mb-4">
                <MapPin size={14} className="text-[var(--gold)]" />
                {property?.location?.city ?? property?.city}, {property?.location?.area ?? property?.area}, Ghana
              </div>
              {property?.description && (
                <p className="text-[var(--text-muted)] leading-relaxed text-sm line-clamp-3">
                  {property.tagline || property.description}
                </p>
              )}
            </div>

            {/* Capacity */}
            <div className="flex flex-wrap gap-5 py-5 border-y border-[var(--border)] mb-6">
              {[
                { icon: <Users size={16} />, v: property?.capacity?.guests ?? property?.maxGuests ?? 2, label: 'Guests' },
                { icon: <Bed size={16} />, v: property?.capacity?.bedrooms ?? property?.bedrooms ?? 1, label: 'Bedrooms' },
                { icon: <Bath size={16} />, v: property?.capacity?.bathrooms ?? property?.bathrooms ?? 1, label: 'Bathrooms' },
              ].map(({ icon, v, label }) => (
                <div key={label} className="flex items-center gap-2 text-[var(--text-muted)] text-sm">
                  <span className="text-[var(--gold)]">{icon}</span>
                  <span className="text-white font-medium">{v}</span>
                  <span>{label}</span>
                </div>
              ))}
            </div>

            {/* Amenities chips */}
            {amenities.length > 0 && (
              <div className="mb-6">
                <p className="text-[var(--text-subtle)] text-[0.65rem] uppercase tracking-widest mb-3">
                  Amenities
                </p>
                <div className="flex flex-wrap gap-2">
                  {amenities.slice(0, 8).map((a, i) => {
                    const Icon = AMENITY_ICONS[a] || Check;
                    const label = AMENITY_LABEL[a] || a.replace(/-/g, ' ');
                    return (
                      <div
                        key={i}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-[var(--surface-2)] border border-[var(--border)] text-[var(--text-muted)] text-xs hover:border-[var(--gold)] transition-colors capitalize"
                      >
                        <Icon size={12} className="text-[var(--gold)]" />
                        {label}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Price + CTA */}
            <div className="flex flex-col sm:flex-row sm:items-end gap-5">
              <div>
                {/* Currency toggle */}
                <div className="inline-flex bg-[var(--surface-2)] border border-[var(--border)] overflow-hidden mb-2">
                  {(['USD', 'GHS'] as const).map(c => (
                    <button
                      key={c}
                      onClick={() => setCurrency(c)}
                      className={cn(
                        'px-3.5 py-1.5 text-xs font-medium transition-all',
                        currency === c
                          ? 'bg-[var(--gold)] text-[#080808]'
                          : 'text-[var(--text-muted)] hover:text-white'
                      )}
                    >
                      {c}
                    </button>
                  ))}
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="font-serif text-4xl text-white font-light">{priceLabel}</span>
                  <span className="text-[var(--text-muted)] text-sm"> / night</span>
                </div>
              </div>

              <div className="flex gap-3 pb-0.5">
                <Link
                  href={`/properties/${property?.slug}`}
                  className="btn-ghost text-sm py-3 px-5"
                >
                  View Details
                </Link>
                <button
                  onClick={onBookNow}
                  className="btn-gold text-sm py-3 px-5"
                >
                  Book Now
                </button>
              </div>
            </div>

            {/* Phone */}
            <div className="mt-6 pt-5 border-t border-[var(--border)]">
              <p className="text-[var(--text-muted)] text-xs mb-2 uppercase tracking-widest">Prefer to call?</p>
              <a
                href={`tel:${CONTACT_INFO.phone}`}
                className="inline-flex items-center gap-2 text-[var(--gold)] hover:underline text-sm"
              >
                <Phone size={14} /> {CONTACT_INFO.phone}
              </a>
            </div>
          </div>
        </div>

        {/* ── Stats Bar ── */}
        <div className={cn(
          'grid grid-cols-2 lg:grid-cols-4 gap-6 mt-20 pt-14 border-t border-[var(--border)] transition-all duration-1000 delay-500',
          vis ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        )}>
          {[
            { label: 'Properties', value: allProperties.length || 1 },
            { label: 'Happy Guests', value: 500, suffix: '+' },
            { label: '5-Star Reviews', value: 50, suffix: '+' },
            { label: 'Years Experience', value: 5, suffix: '+' },
          ].map((stat, i) => (
            <div key={i} className="text-center group">
              <div className="font-serif text-4xl lg:text-5xl text-white font-light mb-2 group-hover:text-[var(--gold)] transition-colors">
                <Counter to={stat.value} suffix={stat.suffix || ''} />
              </div>
              <p className="text-[var(--text-muted)] text-xs uppercase tracking-widest">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
