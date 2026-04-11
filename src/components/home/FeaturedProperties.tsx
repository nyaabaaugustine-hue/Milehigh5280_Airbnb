'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import Link from 'next/link';
import SafeImage from '@/components/ui/SafeImage';
import {
  Star, MapPin, Users, Bed, Bath, Wifi, Wind, Shield,
  ArrowRight, Phone, ChevronLeft, ChevronRight, Check,
  Zap, TreePalm, UtensilsCrossed, Car,
} from 'lucide-react';
import { getLivePropertiesNeon } from '@/lib/neon/service';
import { CONTACT_INFO } from '@/lib/data';
import { cn } from '@/lib/utils';
import type { Property } from '@/types';

const ICON_MAP: Record<string, React.ElementType> = {
  Wifi, Wind, Shield, Zap, TreePalm, UtensilsCrossed, Car,
};

const staticProperty = {
  id: '1',
  name: 'The Palm',
  slug: 'the-palm',
  tagline: 'Your Private Sanctuary in Ghana',
  description: 'A beautifully furnished private apartment in the serene Ayi Mensah area of Accra.',
  type: 'apartment' as const,
  badge: 'Featured' as const,
  isLive: true,
  featured: true,
  location: { city: 'Ayi Mensah', area: 'Accra', country: 'Ghana' },
  pricing: { perNight: 150, perNightGHS: 2370, currency: 'USD' as const },
  capacity: { guests: 4, bedrooms: 2, bathrooms: 1, beds: 2 },
  images: {
    hero: { url: 'https://res.cloudinary.com/dwsl2ktt2/image/upload/v1775296671/5_yc05lt.jpg', alt: 'The Palm' },
    gallery: [
      { url: 'https://res.cloudinary.com/dwsl2ktt2/image/upload/v1775296671/5_yc05lt.jpg', alt: 'Living room' },
      { url: 'https://res.cloudinary.com/dwsl2ktt2/image/upload/v1775411320/images_1_kilffq.jpg', alt: 'Bedroom' },
    ]
  },
  amenities: ['wifi', 'air-conditioning', 'kitchen', 'parking', 'washer', 'tv'],
  rating: 4.9,
  reviewCount: 28,
};

function Counter({ to, suffix = '' }: { to: number; suffix?: string }) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started.current) {
        started.current = true;
        const dur = 1400;
        const start = performance.now();
        const tick = (now: number) => {
          const p = Math.min((now - start) / dur, 1);
          const eased = 1 - Math.pow(1 - p, 3);
          setVal(Math.round(eased * to));
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      }
    }, { threshold: 0.5 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [to]);

  return <span ref={ref}>{val}{suffix}</span>;
}

interface Props {
  onBookNow?: () => void;
  onViewProperty?: (p: Property) => void;
}

export default function FeaturedProperties({ onBookNow, onViewProperty }: Props) {
  const [property, setProperty] = useState<typeof staticProperty | null>(staticProperty);
  const [loading, setLoading] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const [vis, setVis] = useState(false);
  const [activeImg, setActiveImg] = useState(0);
  const [currency, setCurrency] = useState<'USD' | 'GHS'>('USD');
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        setVis(true);
        observer.disconnect();
      }
    }, { threshold: 0.1 });
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    getLivePropertiesNeon()
      .then(data => {
        if (data.length > 0) setProperty(data[0] as any);
      })
      .catch(() => console.error('Failed to load properties'))
      .finally(() => setLoading(false));
  }, []);

  const formatCurrencyFn = (value: number, curr: string) => {
    const formatter = new Intl.NumberFormat(curr === 'GHS' ? 'en-GH' : 'en-US', {
      style: 'currency',
      currency: curr,
      minimumFractionDigits: 0,
    });
    return formatter.format(value);
  };

  const images = property?.images?.gallery || [];
  const price = currency === 'GHS' ? (property?.pricing?.perNightGHS || property?.pricing?.perNight || 0) : (property?.pricing?.perNight || 0);
  
  const scrollLeft = useCallback(() => {
    if (isAnimating) return;
    setIsAnimating(true);
    setActiveImg(i => (i === 0 ? images.length - 1 : i - 1));
    setTimeout(() => setIsAnimating(false), 300);
  }, [isAnimating, images.length]);

  const scrollRight = useCallback(() => {
    if (isAnimating) return;
    setIsAnimating(true);
    setActiveImg(i => (i === images.length - 1 ? 0 : i + 1));
    setTimeout(() => setIsAnimating(false), 300);
  }, [isAnimating, images.length]);

  if (!property) return null;

  return (
    <section
      ref={sectionRef}
      id="featured-properties"
      className="py-24 lg:py-32 bg-[var(--surface)]"
    >
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
        {/* Section Header */}
        <div className="mb-12 lg:mb-20">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <div className={cn('transition-all duration-1000', vis ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8')}>
              <h2 className="font-serif text-4xl lg:text-5xl text-[var(--text-primary)] mb-4">
                Featured Property
              </h2>
              <p className="text-[var(--text-muted)] text-lg max-w-xl">
                Experience luxury living at its finest in our handpicked selection of premium accommodations
              </p>
            </div>
            <div className={cn('transition-all duration-1000 delay-200', vis ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8')}>
              <Link href="/properties" className="btn-ghost">
                View All Properties <ArrowRight size={16} className="ml-2" />
              </Link>
            </div>
          </div>
        </div>

        {/* Property Card */}
        <div className={cn(
          'grid lg:grid-cols-2 gap-8 lg:gap-16 transition-all duration-1000 delay-300',
          vis ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
        )}>
          {/* Image Carousel */}
          <div className="relative aspect-[4/3] rounded-2xl overflow-hidden group">
            {images.length > 0 ? (
              <>
                <div className="absolute inset-0">
                  <SafeImage
                    src={images[activeImg]?.url || images[0]?.url || ''}
                    alt={property.name}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[var(--obsidian)]/60 via-transparent to-transparent" />
                </div>
                {/* Controls */}
                <button
                  onClick={scrollLeft}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center bg-[var(--surface)]/80 backdrop-blur-sm rounded-full text-[var(--text-primary)] hover:bg-[var(--gold)] hover:text-[#080808] transition-all duration-300 opacity-0 group-hover:opacity-100"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  onClick={scrollRight}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center bg-[var(--surface)]/80 backdrop-blur-sm rounded-full text-[var(--text-primary)] hover:bg-[var(--gold)] hover:text-[#080808] transition-all duration-300 opacity-0 group-hover:opacity-100"
                >
                  <ChevronRight size={20} />
                </button>
                {/* Dots */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                  {images.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImg(i)}
                      className={cn(
                        'w-2 h-2 rounded-full transition-all duration-300',
                        i === activeImg ? 'bg-[var(--gold)] w-6' : 'bg-white/50 hover:bg-white/80'
                      )}
                    />
                  ))}
                </div>
                {/* Badge */}
                {property.badge && (
                  <div className="absolute top-4 left-4 px-3 py-1.5 bg-[var(--gold)] text-[#080808] text-xs font-bold uppercase tracking-wider rounded">
                    {property.badge}
                  </div>
                )}
              </>
            ) : (
              <div className="w-full h-full bg-[var(--surface-2)] flex items-center justify-center">
                <span className="text-[var(--text-muted)]">No images available</span>
              </div>
            )}
          </div>

          {/* Property Info */}
          <div className="flex flex-col justify-center">
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-3">
                {property.rating && (
                  <div className="flex items-center gap-1.5">
                    <Star size={16} className="text-[var(--gold)] fill-[var(--gold)]" />
                    <span className="text-[var(--gold)] font-semibold">{property.rating}</span>
                    {property.reviewCount && (
                      <span className="text-[var(--text-muted)] text-sm">({property.reviewCount} reviews)</span>
                    )}
                  </div>
                )}
              </div>
              <h3 className="font-serif text-3xl lg:text-4xl text-[var(--text-primary)] mb-3">
                {property.name}
              </h3>
              <div className="flex items-center gap-2 text-[var(--text-muted)] mb-4">
                <MapPin size={16} />
                <span>{property.location.city}, {property.location.area}</span>
              </div>
              <p className="text-[var(--text-muted)] leading-relaxed max-w-lg">
                {property.tagline || property.description}
              </p>
            </div>

            {/* Capacity */}
            <div className="flex flex-wrap gap-6 mb-8 py-6 border-y border-[var(--border)]">
              <div className="flex items-center gap-2 text-[var(--text-muted)]">
                <Users size={18} />
                <span>{property.capacity?.guests || property.maxGuests || 2} Guests</span>
              </div>
              <div className="flex items-center gap-2 text-[var(--text-muted)]">
                <Bed size={18} />
                <span>{property.capacity?.bedrooms || property.bedrooms || 1} Bedroom</span>
              </div>
              <div className="flex items-center gap-2 text-[var(--text-muted)]">
                <Bath size={18} />
                <span>{property.capacity?.bathrooms || property.bathrooms || 1} Bathroom</span>
              </div>
            </div>

            {/* Amenities */}
            <div className="mb-8">
              <p className="text-[var(--text-subtle)] text-xs uppercase tracking-wider mb-4">Included Amenities</p>
              <div className="flex flex-wrap gap-3">
                {(property.amenities || []).slice(0, 6).map((a: string, i: number) => {
                  const Icon = ICON_MAP[a] || Check;
                  return (
                    <div key={i} className="flex items-center gap-2 px-3 py-2 bg-[var(--surface-2)] rounded-lg text-[var(--text-muted)] text-sm">
                      <Icon size={14} className="text-[var(--gold)]" />
                      <span className="capitalize">{a.replace('-', ' ')}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Price & CTA */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <div className="flex bg-[var(--surface-2)] rounded p-1">
                    <button
                      onClick={() => setCurrency('USD')}
                      className={cn(
                        'px-3 py-1 text-xs font-medium rounded transition-all',
                        currency === 'USD' ? 'bg-[var(--gold)] text-[#080808]' : 'text-[var(--text-muted)]'
                      )}
                    >
                      USD
                    </button>
                    <button
                      onClick={() => setCurrency('GHS')}
                      className={cn(
                        'px-3 py-1 text-xs font-medium rounded transition-all',
                        currency === 'GHS' ? 'bg-[var(--gold)] text-[#080808]' : 'text-[var(--text-muted)]'
                      )}
                    >
                      GHS
                    </button>
                  </div>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="font-serif text-3xl text-[var(--text-primary)]">
                    {formatCurrencyFn(price || 0, currency)}
                  </span>
                  <span className="text-[var(--text-muted)]">/ night</span>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => onViewProperty?.(property)}
                  className="btn-ghost"
                >
                  View Details
                </button>
                <button onClick={onBookNow} className="btn-gold">
                  Book Now
                </button>
              </div>
            </div>

            {/* Contact */}
            <div className="mt-8 pt-6 border-t border-[var(--border)]">
              <p className="text-[var(--text-muted)] text-sm mb-3">Prefer to call?</p>
              <a
                href={`tel:${CONTACT_INFO.phone}`}
                className="inline-flex items-center gap-2 text-[var(--gold)] hover:underline"
              >
                <Phone size={16} />
                {CONTACT_INFO.phone}
              </a>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className={cn(
          'grid grid-cols-2 lg:grid-cols-4 gap-6 mt-16 lg:mt-24 pt-16 border-t border-[var(--border)] transition-all duration-1000 delay-500',
          vis ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        )}>
          {[
            { label: 'Properties', value: 1 },
            { label: 'Happy Guests', value: 500, suffix: '+' },
            { label: '5-Star Reviews', value: 50, suffix: '+' },
            { label: 'Years Experience', value: 5, suffix: '+' },
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <div className="font-serif text-3xl lg:text-4xl text-[var(--text-primary)] mb-2">
                <Counter to={stat.value} suffix={stat.suffix || ''} />
              </div>
              <p className="text-[var(--text-muted)] text-sm">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}