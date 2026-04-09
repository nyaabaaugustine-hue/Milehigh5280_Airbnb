import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Plus, Edit, Eye, EyeOff, Star, MapPin, DollarSign, Users } from 'lucide-react';
import { getAllProperties } from '@/lib/airtable/service';
import type { Property } from '@/lib/airtable/types';

export const metadata: Metadata = {
  title: 'Properties | Admin Dashboard',
  robots: 'noindex, nofollow',
};

export const revalidate = 60;

function formatCurrency(price: number, currency: string = 'USD'): string {
  if (currency === 'GHS') return `GH₵ ${price.toLocaleString()}`;
  return `$${price.toLocaleString()}`;
}

export default async function AdminPropertiesPage() {
  let properties: Property[] = [];
  
  try {
    properties = await getAllProperties();
  } catch {
    properties = [];
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl text-white mb-1">Properties</h1>
          <p className="text-[var(--text-muted)] text-sm">
            Manage your property listings
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

      {/* Info Banner */}
      <div className="bg-[var(--surface-2)] border border-[var(--border)] p-4">
        <p className="text-[var(--text-muted)] text-sm">
          <strong className="text-[var(--gold)]">Tip:</strong> Properties are managed in Airtable. 
          Click "Add in Airtable" to open your Airtable base and add new properties there.
        </p>
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
              {properties.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center">
                    <div className="text-[var(--text-muted)] mb-4">No properties found</div>
                    <a 
                      href="https://airtable.com" 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-gold text-xs"
                    >
                      Create First Property in Airtable
                    </a>
                  </td>
                </tr>
              ) : (
                properties.map((property) => (
                  <tr key={property.id} className="border-b border-[var(--border)] hover:bg-[var(--surface)] transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded overflow-hidden bg-[var(--surface-3)] shrink-0">
                          {property.images?.hero?.url ? (
                            <Image
                              src={property.images.hero.url}
                              alt={property.name}
                              width={48}
                              height={48}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-[var(--surface-3)]" />
                          )}
                        </div>
                        <div>
                          <p className="text-white font-medium text-sm">{property.name}</p>
                          <p className="text-[var(--text-subtle)] text-xs">{property.type}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1 text-[var(--text-muted)] text-sm">
                        <MapPin size={12} className="text-[var(--gold)]" />
                        {property.location.area}, {property.location.city}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1 text-white text-sm">
                        <DollarSign size={12} className="text-[var(--gold)]" />
                        {formatCurrency(property.pricing.perNight, property.pricing.currency)}/night
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1 text-[var(--text-muted)] text-sm">
                        <Users size={12} />
                        {property.capacity.guests} guests, {property.capacity.bedrooms} beds
                      </div>
                    </td>
                    <td className="p-4">
                      {property.isLive !== false ? (
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
                        <a
                          href={`/properties/${property.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 border border-[var(--border)] hover:border-[var(--gold)] text-[var(--text-muted)] hover:text-[var(--gold)] transition-colors"
                          title="View"
                        >
                          <Eye size={14} />
                        </a>
                        <a
                          href={`https://airtable.com`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 border border-[var(--border)] hover:border-[var(--gold)] text-[var(--text-muted)] hover:text-[var(--gold)] transition-colors"
                          title="Edit in Airtable"
                        >
                          <Edit size={14} />
                        </a>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Airtable Link */}
      <div className="text-center">
        <a 
          href="https://airtable.com" 
          target="_blank"
          rel="noopener noreferrer"
          className="text-[var(--text-muted)] text-sm hover:text-[var(--gold)]"
        >
          Open Airtable to manage properties →
        </a>
      </div>
    </div>
  );
}
