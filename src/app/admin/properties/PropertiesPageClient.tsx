'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Plus, Edit, Eye, EyeOff, Star, MapPin, DollarSign, Users, Trash2 } from 'lucide-react';
import PropertyEditModal from '@/components/admin/PropertyEditModal';

const formatCurrency = (value: number) => `$${value.toFixed(2)}`;

interface Property {
  id: string;
  name: string;
  tagline: string;
  type: string;
  isLive: boolean;
  location: { region: string; city: string };
  pricing: { perNight: number };
  capacity: { guests: number; bedrooms: number; bathrooms: number };
  images: Array<{ category: string; url: string }>;
}

function normalizeProperty(property: any): Property {
  return {
    id: String(property.id ?? ''),
    name: String(property.name ?? ''),
    tagline: String(property.tagline ?? ''),
    type: String(property.type ?? 'apartment'),
    isLive: Boolean(property.isLive ?? property.is_live ?? false),
    location: {
      region: String(property.location?.area ?? property.location?.region ?? ''),
      city: String(property.location?.city ?? ''),
    },
    pricing: {
      perNight: Number(property.pricing?.perNight ?? property.price_per_night ?? 0),
    },
    capacity: {
      guests: Number(property.capacity?.guests ?? property.max_guests ?? 0),
      bedrooms: Number(property.capacity?.bedrooms ?? property.bedrooms ?? 0),
      bathrooms: Number(property.capacity?.bathrooms ?? property.bathrooms ?? 0),
    },
    images: Array.isArray(property.images)
      ? property.images
      : Array.isArray(property.images?.gallery)
      ? property.images.gallery
      : [],
  };
}

interface FormLogEntry {
  formName: string;
  action: 'create' | 'update' | 'delete';
  payload: Record<string, unknown>;
  timestamp: string;
}

const blankProperty: Property = {
  id: 'new',
  name: '',
  tagline: '',
  type: 'apartment',
  isLive: false,
  location: { region: 'Ayi Mensah', city: 'Accra' },
  pricing: { perNight: 0 },
  capacity: { guests: 2, bedrooms: 1, bathrooms: 1 },
  images: [],
};

export default function PropertiesPageClient({
  initialProperties,
}: {
  initialProperties: Property[];
}) {
  const [properties, setProperties] = useState(initialProperties.map(normalizeProperty));
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formLogs, setFormLogs] = useState<FormLogEntry[]>([]);

  const recordFormLog = (entry: Omit<FormLogEntry, 'timestamp'>) => {
    setFormLogs((prev) => [
      { ...entry, timestamp: new Date().toISOString() },
      ...prev,
    ]);
  };

  const handleEdit = (property: Property) => {
    setEditingProperty(property);
    setIsModalOpen(true);
  };

  const handleSave = (updated: Property) => {
    setProperties((prev) => {
      const exists = prev.some((p) => p.id === updated.id);
      const next = exists
        ? prev.map((p) => (p.id === updated.id ? updated : p))
        : [updated, ...prev];

      recordFormLog({
        formName: 'Property Form',
        action: exists ? 'update' : 'create',
        payload: updated as unknown as Record<string, unknown>,
      });

      return next;
    });
  };

  const handleCreate = () => {
    setEditingProperty(blankProperty);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm('Delete this property permanently?');
    if (!confirmed) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/admin/properties/${id}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        throw new Error('Failed to delete property');
      }

      setProperties((prev) => prev.filter((property) => property.id !== id));
      recordFormLog({
        formName: 'Property Delete',
        action: 'delete',
        payload: { id },
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="font-serif text-3xl text-white mb-1">Properties</h1>
          <p className="text-[var(--text-muted)] text-sm">
            Manage your property listings — {properties.length} properties
          </p>
        </div>
        <button
          onClick={handleCreate}
          disabled={loading}
          className="btn-gold text-xs disabled:opacity-50"
        >
          <Plus size={14} />
          Add Property
        </button>
      </div>

      <div className="flex items-center justify-between gap-4 px-4 py-3 bg-[var(--surface-2)] border border-[var(--border)] rounded-3xl text-sm text-[var(--text-muted)]">
        <span>{formLogs.length} form submission{formLogs.length === 1 ? '' : 's'} logged this session.</span>
        <span>Each property action is recorded to Neon.</span>
      </div>

      {/* Properties Table */}
      <div className="bg-[var(--surface-2)] border border-[var(--border)] overflow-hidden rounded-lg">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--border)] bg-[var(--surface)]">
                <th className="text-left p-4 text-[var(--text-subtle)] text-xs uppercase tracking-wider font-medium">
                  Property
                </th>
                <th className="text-left p-4 text-[var(--text-subtle)] text-xs uppercase tracking-wider font-medium">
                  Location
                </th>
                <th className="text-left p-4 text-[var(--text-subtle)] text-xs uppercase tracking-wider font-medium">
                  Price
                </th>
                <th className="text-left p-4 text-[var(--text-subtle)] text-xs uppercase tracking-wider font-medium">
                  Capacity
                </th>
                <th className="text-left p-4 text-[var(--text-subtle)] text-xs uppercase tracking-wider font-medium">
                  Status
                </th>
                <th className="text-left p-4 text-[var(--text-subtle)] text-xs uppercase tracking-wider font-medium">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {properties.map((property) => {
                const heroImage =
                  property.images.find((i) => i.category === 'hero') ||
                  property.images[0];
                return (
                  <tr
                    key={property.id}
                    className="border-b border-[var(--border)] hover:bg-[var(--surface)] transition-colors"
                  >
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
                          <p className="text-white font-medium text-sm">
                            {property.name}
                          </p>
                          <p className="text-[var(--text-subtle)] text-xs capitalize">
                            {property.type}
                          </p>
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
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEdit(property)}
                          className="p-2 hover:bg-[var(--surface-3)] text-[var(--text-muted)] hover:text-[var(--gold)] transition-colors rounded"
                          title="Edit property"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(property.id)}
                          disabled={loading}
                          className="p-2 hover:bg-red-500/10 text-red-400/60 hover:text-red-400 transition-colors rounded disabled:opacity-50"
                          title="Delete property"
                        >
                          <Trash2 size={16} />
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

      {/* Edit Modal */}
      {editingProperty && (
        <PropertyEditModal
          property={editingProperty}
          open={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setEditingProperty(null);
          }}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
