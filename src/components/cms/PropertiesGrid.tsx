'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Star, MapPin, Users, Bed, Bath, ArrowRight, Clock } from 'lucide-react';
import { useProperties } from '@/hooks/useCmsData';
import type { Property } from '@/lib/airtable/types';
import type { Property as DbProperty } from '@/lib/cms/db';

const typeLabels: Record<string, string> = {
  villa: 'Private Villa',
  penthouse: 'Penthouse',
  estate: 'Private Estate',
  cottage: 'Luxury Cottage',
  mansion: 'Private Mansion',
  apartment: 'Private Apartment',
};

const badgeColors: Record<string, string> = {
  'Editors Choice': 'bg-[var(--gold)] text-[#080808]',
  'Most Booked': 'bg-white/10 text-white border border-white/20',
  'New Arrival': 'bg-[var(--surface-3)] text-[var(--gold)] border border-[var(--border)]',
  'Exclusive': 'bg-[var(--gold)] text-[#080808]',
};

function formatCurrency(price: number, currency: string = 'USD'): string {
  if (currency === 'GHS') {
    return `GH₵ ${price.toLocaleString()}`;
  }
  return `$${price.toLocaleString()}`;
}

interface PropertiesGridProps {
  dbProperties?: DbProperty[];
}

export default function PropertiesGrid({ dbProperties }: PropertiesGridProps) {
  // If we have DB properties from ISR, use those; otherwise fallback to CMS
  const { data: cmsProperties, loading, error } = useProperties(true);
  
  // Prefer DB properties if available (from ISR)
  const properties = dbProperties && dbProperties.length > 0 
    ? dbProperties.map(p => ({
        id: p.id,
        name: p.name,
        slug: p.slug,
        tagline: p.tagline || '',
        description: p.description || '',
        type: p.property_type as Property['type'],
        badge: p.badge as Property['badge'],
        isLive: p.is_live,
        featured: false,
        location: { city: p.city, area: p.area, country: p.country },
        pricing: { perNight: p.price_per_night, perNightGHS: p.price_per_night_ghs || 0, currency: p.currency as 'USD' | 'GHS', minNights: 1 },
        capacity: { guests: p.max_guests, bedrooms: p.bedrooms, bathrooms: p.bathrooms, beds: p.bedrooms },
        images: { hero: { url: p.hero_image || '', alt: p.name }, gallery: [] },
        amenities: [],
        features: [],
        houseRules: [],
        checkInTime: '',
        checkOutTime: '',
        rating: 0,
        reviewCount: 0,
      }))
    : cmsProperties;

  const [filter, setFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('default');

  const filteredAndSorted = useMemo(() => {
    if (!properties) return [];

    let result = [...properties];

    // Filter
    if (filter !== 'all') {
      result = result.filter(p => p.type === filter);
    }

    // Sort
    switch (sortBy) {
      case 'price-low':
        result.sort((a, b) => a.pricing.perNight - b.pricing.perNight);
        break;
      case 'price-high':
        result.sort((a, b) => b.pricing.perNight - a.pricing.perNight);
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'guests':
        result.sort((a, b) => b.capacity.guests - a.capacity.guests);
        break;
    }

    return result;
  }, [properties, filter, sortBy]);

  if (loading) {
    return (
      <div className="py-24 px-6 lg:px-12 max-w-[1440px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map(i => (
            <div key={i} className="animate-pulse">
              <div className="h-72 bg-[var(--surface-2)] rounded-sm mb-4" />
              <div className="h-4 bg-[var(--surface-2)] rounded w-3/4 mb-2" />
              <div className="h-4 bg-[var(--surface-2)] rounded w-1/2" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-24 px-6 lg:px-12 max-w-[1440px] mx-auto text-center">
        <p className="text-red-400 mb-4">Failed to load properties</p>
        <p className="text-[var(--text-muted)] text-sm">{error}</p>
      </div>
    );
  }

  if (!properties || properties.length === 0) {
    return (
      <div className="py-24 px-6 lg:px-12 max-w-[1440px] mx-auto text-center">
        <p className="text-[var(--text-muted)]">No properties available at the moment.</p>
      </div>
    );
  }

  return (
    <>
      {/* Filters */}
      <div className="py-8 px-6 lg:px-12 max-w-[1440px] mx-auto">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="flex flex-wrap gap-2">
            {[
              { value: 'all', label: 'All' },
              { value: 'apartment', label: 'Apartments' },
              { value: 'villa', label: 'Villas' },
              { value: 'penthouse', label: 'Penthouses' },
              { value: 'estate', label: 'Estates' },
            ].map(f => (
              <button
                key={f.value}
                onClick={() => setFilter(f.value)}
                className={`px-4 py-2 text-xs uppercase tracking-widest border transition-colors ${
                  filter === f.value
                    ? 'bg-[var(--gold)] text-[#080808] border-[var(--gold)]'
                    : 'border-[var(--border)] text-[var(--text-muted)] hover:border-[var(--gold)] hover:text-[var(--gold)]'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            className="input-luxury text-xs w-auto"
          >
            <option value="default">Default</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
            <option value="guests">Most Guests</option>
          </select>
        </div>
      </div>

      {/* Properties Grid */}
      <div className="pb-24 px-6 lg:px-12 max-w-[1440px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredAndSorted.map(property => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>

        {filteredAndSorted.length === 0 && (
          <div className="text-center py-12">
            <p className="text-[var(--text-muted)]">No properties match your filter.</p>
          </div>
        )}
      </div>
    </>
  );
}

function PropertyCard({ property }: { property: Property }) {
  const heroImage = property.images?.hero?.url || property.images?.gallery?.[0]?.url;
  const isLive = property.isLive !== false;

  return (
    <div className="property-card group relative">
      {/* Coming Soon ribbon */}
      {!isLive && (
        <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-center gap-2 bg-[#080808]/80 backdrop-blur-sm border-b border-[var(--gold)]/40 py-2.5">
          <Clock size={11} className="text-[var(--gold)]" />
          <span className="text-[var(--gold)] text-[0.6rem] tracking-[0.3em] uppercase font-semibold">Coming Soon</span>
        </div>
      )}

      {/* Image */}
      <div className={`card-image relative h-72 overflow-hidden bg-[var(--surface-2)] ${!isLive ? 'grayscale-[0.6]' : ''}`}>
        {heroImage && (
          <Image
            src={heroImage}
            alt={property.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-obsidian/80 via-transparent to-transparent" />

        {property.badge && (
          <div className={`absolute top-4 left-4 text-[0.6rem] tracking-widest uppercase px-3 py-1.5 font-sans font-medium ${badgeColors[property.badge] ?? 'bg-[var(--gold)] text-[#080808]'} ${!isLive ? 'mt-8' : ''}`}>
            {property.badge}
          </div>
        )}

        <div className="absolute bottom-4 right-4 bg-obsidian/80 backdrop-blur-sm border border-[var(--border)] px-3 py-2">
          <span className="font-serif text-lg font-light text-white">
            {formatCurrency(property.pricing.perNight, property.pricing.currency)}
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
              {property.location.area}
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
            <div className="border border-[var(--gold)]/30 bg-[rgba(201,150,58,0.04)] p-4 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[var(--gold)] animate-pulse" />
                <span className="text-[var(--gold)] text-[0.6rem] tracking-[0.25em] uppercase font-semibold">Opening Soon</span>
                <div className="w-1.5 h-1.5 rounded-full bg-[var(--gold)] animate-pulse" />
              </div>
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
}
