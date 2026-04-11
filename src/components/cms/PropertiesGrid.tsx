'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Star, MapPin, Users, Bed, Bath, ArrowRight, Clock } from 'lucide-react';

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
  'Featured': 'bg-[var(--gold)] text-[#080808]',
};

function formatCurrency(price: number, currency: string = 'USD'): string {
  if (currency === 'GHS') {
    return `GH₵ ${price.toLocaleString()}`;
  }
  return `$${price.toLocaleString()}`;
}

interface Property {
  id: string;
  name: string;
  slug: string;
  tagline?: string;
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
}

const staticProperties: Property[] = [
  {
    id: '1',
    name: 'The Palm',
    slug: 'the-palm',
    tagline: 'Your Private Sanctuary in Ghana',
    property_type: 'apartment',
    badge: 'Featured',
    price_per_night: 150,
    price_per_night_ghs: 2370,
    currency: 'USD',
    city: 'Ayi Mensah',
    area: 'Accra',
    hero_image: 'https://res.cloudinary.com/dwsl2ktt2/image/upload/v1775296671/5_yc05lt.jpg',
    rating: 4.9,
    review_count: 28,
    max_guests: 4,
    bedrooms: 2,
    bathrooms: 1,
  }
];

interface PropertiesGridProps {
  dbProperties?: Property[];
}

export default function PropertiesGrid({ dbProperties }: PropertiesGridProps) {
  const properties = (dbProperties && dbProperties.length > 0) ? dbProperties : staticProperties;
  const [filter, setFilter] = useState<string>('all');

  const filtered = filter === 'all' 
    ? properties 
    : properties.filter(p => p.property_type === filter);

  return (
    <div className="py-16 px-6 lg:px-12 max-w-[1440px] mx-auto">
      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-12">
        {['all', 'apartment', 'villa', 'penthouse'].map(type => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            className={`px-4 py-2 text-sm border transition-colors ${
              filter === type 
                ? 'bg-[var(--gold)] text-[#080808] border-[var(--gold)]' 
                : 'border-[var(--border)] text-[var(--text-muted)] hover:border-[var(--gold)]'
            }`}
          >
            {type === 'all' ? 'All Types' : typeLabels[type] || type}
          </button>
        ))}
      </div>

      {/* Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map(property => (
            <Link 
              key={property.id}
              href={`/properties/${property.slug}`}
              className="group block bg-[var(--surface-2)] border border-[var(--border)] hover:border-[var(--gold)] transition-all duration-300"
            >
              {/* Image */}
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={property.hero_image || 'https://res.cloudinary.com/dwsl2ktt2/image/upload/v1775296671/5_yc05lt.jpg'}
                  alt={property.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {property.badge && (
                  <span className={`absolute top-4 left-4 px-3 py-1 text-xs font-bold uppercase tracking-wider ${badgeColors[property.badge] || 'bg-white/10 text-white'}`}>
                    {property.badge}
                  </span>
                )}
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex items-center gap-2 mb-2">
                  {property.rating && (
                    <div className="flex items-center gap-1">
                      <Star size={14} className="text-[var(--gold)] fill-[var(--gold)]" />
                      <span className="text-sm font-medium">{property.rating}</span>
                      {property.review_count && (
                        <span className="text-xs text-[var(--text-muted)]">({property.review_count})</span>
                      )}
                    </div>
                  )}
                </div>

                <h3 className="font-serif text-xl text-white mb-1">{property.name}</h3>
                
                <div className="flex items-center gap-1 text-[var(--text-muted)] text-sm mb-3">
                  <MapPin size={14} />
                  <span>{property.city}, {property.area}</span>
                </div>

                {property.tagline && (
                  <p className="text-[var(--text-subtle)] text-sm mb-4 line-clamp-2">{property.tagline}</p>
                )}

                <div className="flex items-center gap-4 text-[var(--text-muted)] text-sm mb-4">
                  <div className="flex items-center gap-1">
                    <Users size={14} />
                    <span>{property.max_guests || 2}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Bed size={14} />
                    <span>{property.bedrooms || 1}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Bath size={14} />
                    <span>{property.bathrooms || 1}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-[var(--border)]">
                  <div>
                    <span className="font-serif text-2xl text-white">
                      {formatCurrency(property.price_per_night || 0, property.currency || 'USD')}
                    </span>
                    <span className="text-[var(--text-muted)] text-sm"> / night</span>
                  </div>
                  <ArrowRight size={18} className="text-[var(--gold)] group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-24">
          <p className="text-[var(--text-muted)]">No properties found matching your criteria.</p>
        </div>
      )}
    </div>
  );
}