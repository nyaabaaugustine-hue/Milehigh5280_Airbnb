'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Star, MapPin, Users, Bed, ArrowRight, Phone } from 'lucide-react';
import { getFeaturedProperties, formatCurrency } from '@/lib/data';
import type { Property } from '@/types';
import { cn } from '@/lib/utils';

const badgeColors: Record<string, string> = {
  'Editors Choice': 'bg-[var(--gold)] text-obsidian',
  'Most Booked':    'bg-white/10 text-white border border-white/20',
  'New Arrival':    'bg-[var(--surface-3)] text-[var(--gold)] border border-[var(--border)]',
  'Exclusive':      'bg-[var(--gold)] text-obsidian',
};

interface PropertyCardProps {
  property: Property;
  index: number;
  onBookNow?: () => void;
}

function PropertyCard({ property, index, onBookNow }: PropertyCardProps) {
  const ref  = useRef<HTMLDivElement>(null);
  const [vis, setVis] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVis(true); observer.disconnect(); } },
      { threshold: 0.15 },
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const heroImage = property.images.find(i => i.category === 'hero') || property.images[0];

  return (
    <div
      ref={ref}
      className={cn(
        'property-card group cursor-pointer transition-all duration-700',
        vis ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10',
      )}
      style={{ transitionDelay: `${index * 150}ms` }}
    >
      {/* ── Image ── */}
      <div className="card-image relative h-72 lg:h-80 overflow-hidden bg-[var(--surface-2)]">
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
          <div className={cn(
            'absolute top-4 left-4 text-[0.6rem] tracking-widest uppercase px-3 py-1.5 font-sans font-medium',
            badgeColors[property.badge] ?? 'bg-[var(--gold)] text-obsidian',
          )}>
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
        <div className="flex items-center gap-1.5 mb-3">
          <MapPin size={11} className="text-[var(--gold)]" />
          <span className="text-[var(--text-muted)] text-xs tracking-widest uppercase">
            {property.location.city}, {property.location.region}
          </span>
        </div>

        <h3 className="font-serif text-2xl font-light text-white mb-1 group-hover:text-[var(--gold)] transition-colors duration-300">
          {property.name}
        </h3>
        <p className="text-[var(--text-muted)] text-sm leading-relaxed mb-5 line-clamp-2">
          {property.tagline}
        </p>

        <div className="flex items-center gap-5 text-xs text-[var(--text-muted)] border-t border-[var(--border)] pt-4 mb-4">
          <div className="flex items-center gap-1.5">
            <Users size={12} className="text-[var(--gold)]" />
            <span>{property.capacity.guests} guests</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Bed size={12} className="text-[var(--gold)]" />
            <span>{property.capacity.bedrooms} bed{property.capacity.bedrooms > 1 ? 's' : ''}</span>
          </div>
          <Link
            href={`/properties/${property.slug}`}
            className="ml-auto flex items-center gap-1 text-[var(--gold)] font-medium uppercase tracking-widest text-[0.65rem] hover:gap-2 transition-all duration-300"
          >
            View
            <ArrowRight size={12} />
          </Link>
        </div>

        {/* Book Now button */}
        <button
          onClick={onBookNow}
          className="btn-gold w-full justify-center gap-2 text-[0.7rem] py-3"
        >
          <Phone size={12} />
          Book Now
        </button>
      </div>
    </div>
  );
}

interface FeaturedPropertiesProps {
  onBookNow?: () => void;
}

export default function FeaturedProperties({ onBookNow }: FeaturedPropertiesProps) {
  const properties = getFeaturedProperties();
  const ref  = useRef<HTMLDivElement>(null);
  const [vis, setVis] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVis(true); observer.disconnect(); } },
      { threshold: 0.1 },
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="featured" className="py-24 lg:py-36 px-6 lg:px-12 max-w-[1440px] mx-auto">
      <div
        ref={ref}
        className={cn(
          'flex flex-col lg:flex-row items-start lg:items-end justify-between mb-16 transition-all duration-700 gap-6',
          vis ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8',
        )}
      >
        <div>
          <p className="section-label mb-4">Our Collection</p>
          <h2 className="font-serif font-light text-white leading-tight">
            Curated for the<br />
            <span className="italic text-gold-gradient">Discerning Few</span>
          </h2>
        </div>
        <div className="flex flex-col items-start lg:items-end gap-3">
          <p className="text-[var(--text-muted)] text-sm max-w-xs text-left lg:text-right leading-relaxed">
            Every property personally selected and managed by Rehoboth Properties to the highest
            standards of Ghanaian luxury hospitality.
          </p>
          <Link href="/properties" className="btn-ghost">
            View All Properties
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>

      <div className="flex items-center gap-4 mb-16">
        <div className="flex-1 h-px bg-gradient-to-r from-transparent to-[var(--border)]" />
        <div className="w-2 h-2 rotate-45 border border-[var(--gold)] opacity-60" />
        <div className="flex-1 h-px bg-gradient-to-l from-transparent to-[var(--border)]" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {properties.map((property, i) => (
          <PropertyCard key={property.id} property={property} index={i} onBookNow={onBookNow} />
        ))}
      </div>
    </section>
  );
}
