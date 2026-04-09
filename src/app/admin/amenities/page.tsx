import type { Metadata } from 'next';
import { Plus, Star } from 'lucide-react';
import { getAllAmenities } from '@/lib/airtable/service';
import type { Amenity } from '@/lib/airtable/types';

export const metadata: Metadata = {
  title: 'Amenities | Admin Dashboard',
  robots: 'noindex, nofollow',
};

export const revalidate = 60;

const categoryColors: Record<string, string> = {
  essential: 'bg-blue-400/10 text-blue-400',
  comfort: 'bg-purple-400/10 text-purple-400',
  safety: 'bg-green-400/10 text-green-400',
  entertainment: 'bg-orange-400/10 text-orange-400',
  outdoor: 'bg-emerald-400/10 text-emerald-400',
};

export default async function AdminAmenitiesPage() {
  let amenities: Amenity[] = [];
  
  try {
    amenities = await getAllAmenities();
  } catch {
    amenities = [];
  }

  const groupedAmenities = amenities.reduce((acc, amenity) => {
    const category = amenity.category || 'essential';
    if (!acc[category]) acc[category] = [];
    acc[category].push(amenity);
    return acc;
  }, {} as Record<string, Amenity[]>);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl text-white mb-1">Amenities</h1>
          <p className="text-[var(--text-muted)] text-sm">
            Manage property features and amenities
          </p>
        </div>
        <a 
          href="https://airtable.com" 
          target="_blank"
          rel="noopener noreferrer"
          className="btn-gold text-xs"
        >
          <Plus size={14} />
          Add in Airtable
        </a>
      </div>

      {/* Amenities by Category */}
      <div className="grid gap-8">
        {Object.entries(groupedAmenities).map(([category, items]) => (
          <div key={category} className="bg-[var(--surface-2)] border border-[var(--border)] p-6">
            <h2 className="font-serif text-xl text-white mb-4 capitalize flex items-center gap-2">
              <span className={`px-2 py-1 rounded text-xs uppercase ${categoryColors[category] || 'bg-gray-400/10 text-gray-400'}`}>
                {category}
              </span>
              <span className="text-[var(--text-muted)] text-sm font-sans">({items.length})</span>
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {items.map((amenity) => (
                <div 
                  key={amenity.id}
                  className="flex items-center gap-3 p-3 border border-[var(--border)] hover:border-[var(--gold)] transition-colors"
                >
                  <span className="text-2xl">{amenity.icon}</span>
                  <div>
                    <p className="text-white text-sm">{amenity.name}</p>
                    <a 
                      href="https://airtable.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[var(--text-subtle)] text-xs hover:text-[var(--gold)]"
                    >
                      Edit →
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {amenities.length === 0 && (
        <div className="bg-[var(--surface-2)] border border-[var(--border)] p-12 text-center">
          <Star size={48} className="text-[var(--text-subtle)] mx-auto mb-4" />
          <h3 className="text-white text-lg mb-2">No amenities yet</h3>
          <p className="text-[var(--text-muted)] text-sm mb-4">
            Create amenities in Airtable to display them on your properties
          </p>
          <a 
            href="https://airtable.com" 
            target="_blank"
            rel="noopener noreferrer"
            className="btn-gold text-xs"
          >
            Create First Amenity
          </a>
        </div>
      )}
    </div>
  );
}
