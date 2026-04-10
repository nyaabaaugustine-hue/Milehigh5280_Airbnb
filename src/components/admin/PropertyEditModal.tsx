'use client';

import { useEffect, useState } from 'react';
import { X, Save, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

interface PropertyEditModalProps {
  property: {
    id: string;
    name: string;
    tagline: string;
    location: { city: string; region: string };
    pricing: { perNight: number };
    capacity: { bedrooms: number; bathrooms: number; guests: number };
    isLive: boolean;
    images?: Array<{ url: string; category: string }>;
  };
  open: boolean;
  onClose: () => void;
  onSave: (updated: any) => void;
}

export default function PropertyEditModal({
  property,
  open,
  onClose,
  onSave,
}: PropertyEditModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: property.name,
    tagline: property.tagline,
    price: property.pricing.perNight,
    bedrooms: property.capacity.bedrooms,
    bathrooms: property.capacity.bathrooms,
    guests: property.capacity.guests,
    city: property.location.city,
    region: property.location.region,
    isLive: property.isLive,
    heroImageUrl: property.images?.[0]?.url || '',
  });

  useEffect(() => {
    setFormData({
      name: property.name,
      tagline: property.tagline,
      price: property.pricing.perNight,
      bedrooms: property.capacity.bedrooms,
      bathrooms: property.capacity.bathrooms,
      guests: property.capacity.guests,
      city: property.location.city,
      region: property.location.region,
      isLive: property.isLive,
      heroImageUrl: property.images?.[0]?.url || '',
    });
  }, [property]);

  const isCreateMode = !property.id || property.id === 'new';
  const title = isCreateMode ? 'Create Property' : 'Edit Property';
  const submitLabel = isCreateMode ? 'Create Listing' : 'Save Changes';

  const handleSave = async () => {
    setLoading(true);
    try {
      const endpoint = isCreateMode
        ? '/api/admin/properties'
        : `/api/admin/properties/${property.id}`;
      const method = isCreateMode ? 'POST' : 'PATCH';
      const payload = {
        name: formData.name,
        tagline: formData.tagline,
        pricePerNight: formData.price,
        price: formData.price,
        bedrooms: formData.bedrooms,
        bathrooms: formData.bathrooms,
        guests: formData.guests,
        city: formData.city,
        area: formData.region,
        region: formData.region,
        isLive: formData.isLive,
        heroImageUrl: formData.heroImageUrl,
      };

      console.info('[Form] Property form submit', { mode: isCreateMode ? 'create' : 'update', payload });

      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || 'Failed to save property');
      }

      const updated = await res.json();
      toast.success(isCreateMode ? 'Property created successfully' : 'Property updated successfully');
      onSave(updated);
      onClose();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Save failed');
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />

      <div className="relative bg-[var(--surface)] border border-[var(--border)] rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-modal-in">
        <div className="flex items-center justify-between p-6 border-b border-[var(--border)] sticky top-0 bg-[var(--surface)] backdrop-blur-sm">
          <div>
            <p className="text-[var(--text-subtle)] text-xs uppercase tracking-[0.22em] mb-1">Property form</p>
            <h2 className="font-serif text-3xl text-white">{title}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-3 bg-[var(--surface-2)] rounded-2xl border border-[var(--border)] hover:bg-[var(--surface-3)] transition-colors"
          >
            <X size={20} className="text-[var(--text-muted)]" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          <div className="grid gap-4 lg:grid-cols-2">
            <label className="space-y-2 text-sm text-[var(--text-muted)]">
              Property Name
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-[var(--surface-2)] border border-[var(--border)] text-white px-4 py-3 rounded-2xl focus:border-[var(--gold)] outline-none transition-colors"
              />
            </label>
            <label className="space-y-2 text-sm text-[var(--text-muted)]">
              Tagline
              <input
                type="text"
                value={formData.tagline}
                onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                className="w-full bg-[var(--surface-2)] border border-[var(--border)] text-white px-4 py-3 rounded-2xl focus:border-[var(--gold)] outline-none transition-colors"
              />
            </label>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <label className="space-y-2 text-sm text-[var(--text-muted)]">
              Price Per Night (USD)
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                className="w-full bg-[var(--surface-2)] border border-[var(--border)] text-white px-4 py-3 rounded-2xl focus:border-[var(--gold)] outline-none transition-colors"
              />
            </label>

            <label className="space-y-2 text-sm text-[var(--text-muted)]">
              City
              <input
                type="text"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full bg-[var(--surface-2)] border border-[var(--border)] text-white px-4 py-3 rounded-2xl focus:border-[var(--gold)] outline-none transition-colors"
              />
            </label>
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            <label className="space-y-2 text-sm text-[var(--text-muted)]">
              Bedrooms
              <input
                type="number"
                value={formData.bedrooms}
                onChange={(e) => setFormData({ ...formData, bedrooms: parseInt(e.target.value) })}
                className="w-full bg-[var(--surface-2)] border border-[var(--border)] text-white px-4 py-3 rounded-2xl focus:border-[var(--gold)] outline-none transition-colors"
              />
            </label>
            <label className="space-y-2 text-sm text-[var(--text-muted)]">
              Bathrooms
              <input
                type="number"
                value={formData.bathrooms}
                onChange={(e) => setFormData({ ...formData, bathrooms: parseInt(e.target.value) })}
                className="w-full bg-[var(--surface-2)] border border-[var(--border)] text-white px-4 py-3 rounded-2xl focus:border-[var(--gold)] outline-none transition-colors"
              />
            </label>
            <label className="space-y-2 text-sm text-[var(--text-muted)]">
              Guests
              <input
                type="number"
                value={formData.guests}
                onChange={(e) => setFormData({ ...formData, guests: parseInt(e.target.value) })}
                className="w-full bg-[var(--surface-2)] border border-[var(--border)] text-white px-4 py-3 rounded-2xl focus:border-[var(--gold)] outline-none transition-colors"
              />
            </label>
          </div>

          <label className="space-y-2 text-sm text-[var(--text-muted)]">
            Region
            <input
              type="text"
              value={formData.region}
              onChange={(e) => setFormData({ ...formData, region: e.target.value })}
              className="w-full bg-[var(--surface-2)] border border-[var(--border)] text-white px-4 py-3 rounded-2xl focus:border-[var(--gold)] outline-none transition-colors"
            />
          </label>

          <label className="space-y-2 text-sm text-[var(--text-muted)]">
            Hero Image URL
            <input
              type="url"
              value={formData.heroImageUrl}
              onChange={(e) => setFormData({ ...formData, heroImageUrl: e.target.value })}
              placeholder="https://example.com/image.jpg"
              className="w-full bg-[var(--surface-2)] border border-[var(--border)] text-white px-4 py-3 rounded-2xl focus:border-[var(--gold)] outline-none transition-colors"
            />
          </label>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="isLive"
              checked={formData.isLive}
              onChange={(e) => setFormData({ ...formData, isLive: e.target.checked })}
              className="w-5 h-5 rounded border-[var(--border)] bg-[var(--surface-2)] text-[var(--gold)] cursor-pointer"
            />
            <label htmlFor="isLive" className="text-[var(--text-muted)] cursor-pointer">
              Make property live
            </label>
          </div>
        </div>

        <div className="flex flex-col gap-3 p-6 border-t border-[var(--border)] bg-[var(--surface-2)] lg:flex-row">
          <button
            onClick={onClose}
            className="w-full lg:w-auto flex-1 px-5 py-3 bg-[var(--surface)] border border-[var(--border)] text-white rounded-2xl hover:bg-[var(--surface-3)] transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            className="w-full lg:w-auto flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 bg-[var(--gold)] text-[#080808] rounded-2xl hover:bg-[#E4B429] transition-colors font-semibold disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save size={16} />
                {submitLabel}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
