import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Plus, Edit, Eye, EyeOff, Star, MapPin, DollarSign, Users } from 'lucide-react';
import { properties, formatCurrency } from '@/lib/data';

export const metadata: Metadata = {
  title: 'Properties | Admin Dashboard',
  robots: 'noindex, nofollow',
};

export default function AdminPropertiesPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl text-white mb-1">Properties</h1>
          <p className="text-[var(--text-muted)] text-sm">
            Manage your property listings — {properties.length} properties
          </p>
        </div>
        <button className="btn-gold text-xs">
          <Plus size={14} />
          Add Property
        </button>
      </div>

      {/* Properties Table */}
      <div className="bg-[var(--surface-2)] border border-[var(--border)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--border)]">
                <th className="text-left p-4 text-[var(--text-subtle)] text-xs uppercase tracking-wider font-medium">Property</th>
                <th className="text-left p-4 text-[var(--text-subtle)] text-xs uppercase tracking-wider font-medium">Location</th>
                <th className="text-left p-4 text-[var(--text-subtle)] text-xs uppercase tracking-wider font-medium">Price</th>
                <th className="text-left p-4 text-[var(--text-subtle)] text-xs uppercase tracking-wider font-medium">Capacity</th>
                <th className="text-left p-4 text-[var(--text-subtle)] text-xs uppercase tracking-wider font-medium">Status</th>
                <th className="text-left p-4 text-[var(--text-subtle)] text-xs uppercase tracking-wider font-medium">Rating</th>
                <th className="text-left p-4 text-[var(--text-subtle)] text-xs uppercase tracking-wider font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {properties.map((property) => {
                const heroImage = property.images.find(i => i.category === 'hero') || property.images[0];
                return (
                  <tr key={property.id} className="border-b border-[var(--border)] hover:bg-[var(--surface)] transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded overflow-hidden bg-[var(--surface-3)] shrink-0">
                          {heroImage?.url && (
                            <Image
                              src={heroImage.url}
                              alt={property.name}
                              width={48}
                              height={48}
                              className="w-full h-full object-cover"
                            />
                          )}
                        </div>
                        <div>
                          <p className="text-white font-medium text-sm">{property.name}</p>
                          <p className="text-[var(--text-subtle)] text-xs capitalize">{property.type}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1 text-[var(--text-muted)] text-sm">
                        <MapPin size={12} className="text-[var(--gold)]" />
                        {property.location.region}, {property.location.city}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1 text-white text-sm">
                        <DollarSign size={12} className="text-[var(--gold)]" />
                        ${property.pricing.perNight}/night
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1 text-[var(--text-muted)] text-sm">
                        <Users size={12} />
                        {property.capacity.guests} guests, {property.capacity.bedrooms} beds
                      </div>
                    </td>
                    <td className="p-4">
                      {property.isLive ? (
                        <span className="inline-flex items-center gap-1 text-green-400 bg-green-400/10 px-2 py-1 rounded text-xs">
                          <Eye size={10} />
                          Live
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-yellow-400 bg-yellow-400/10 px-2 py-1 rounded text-xs">
                          <EyeOff size={10} />
                          Coming Soon
                        </span>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1">
                        <Star size={12} className="text-[var(--gold)] fill-[var(--gold)]" />
                        <span className="text-white text-sm">{property.rating}</span>
                        <span className="text-[var(--text-subtle)] text-xs">({property.reviewCount})</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/properties/${property.slug}`}
                          className="p-2 border border-[var(--border)] hover:border-[var(--gold)] text-[var(--text-muted)] hover:text-[var(--gold)] transition-colors"
                          title="View on site"
                        >
                          <Eye size={14} />
                        </Link>
                        <button
                          className="p-2 border border-[var(--border)] hover:border-[var(--gold)] text-[var(--text-muted)] hover:text-[var(--gold)] transition-colors"
                          title="Edit property"
                        >
                          <Edit size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Note */}
      <div className="bg-[var(--surface-2)] border border-[var(--border)] p-4">
        <p className="text-[var(--text-muted)] text-sm">
          <strong className="text-[var(--gold)]">Note:</strong> Properties are managed in <code className="bg-[var(--surface-3)] px-1">src/lib/data.ts</code>. 
          Edit the file directly or connect Airtable for CMS management.
        </p>
      </div>
    </div>
  );
}
