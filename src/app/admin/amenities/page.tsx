'use client';

import type { Metadata } from 'next';
import { useState, useEffect } from 'react';
import { Plus, Star, Edit, Trash2 } from 'lucide-react';
import { getAllAmenitiesNeon } from '@/lib/neon/service';
import type { Amenity } from '@/lib/airtable/types';

export const metadata: Metadata = {
  title: 'Amenities | Admin Dashboard',
  robots: 'noindex, nofollow',
};

const categoryColors: Record<string, string> = {
  essential: 'bg-blue-400/10 text-blue-400',
  comfort: 'bg-purple-400/10 text-purple-400',
  safety: 'bg-green-400/10 text-green-400',
  entertainment: 'bg-orange-400/10 text-orange-400',
  outdoor: 'bg-emerald-400/10 text-emerald-400',
};

const iconOptions = ['✨', '📶', '🍳', '🧺', '🚗', '🏊', '🏋️', '🌳', '🔐', '📺', '🧖', '🍽️', '🧊', '💼', '🛎️', '🐾', '🚭', '♿', '⏰', '🌡️'];

export default function AdminAmenitiesPage() {
  const [amenities, setAmenities] = useState<Amenity[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAmenity, setEditingAmenity] = useState<Amenity | null>(null);
  const [formData, setFormData] = useState({ name: '', icon: '✨', category: 'essential', description: '' });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const groupedAmenities = amenities.reduce((acc, amenity) => {
    const category = amenity.category || 'essential';
    if (!acc[category]) acc[category] = [];
    acc[category].push(amenity);
    return acc;
  }, {} as Record<string, Amenity[]>);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const totalAmenities = amenities.length;

  useEffect(() => {
    fetch('/api/admin/amenities')
      .then(res => res.json())
      .then(data => {
        setAmenities(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleOpenCreate = () => {
    setEditingAmenity(null);
    setFormData({ name: '', icon: '✨', category: 'essential', description: '' });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (amenity: Amenity) => {
    setEditingAmenity(amenity);
    setFormData({
      name: amenity.name || '',
      icon: amenity.icon || '✨',
      category: amenity.category || 'essential',
      description: (amenity as any).description || '',
    });
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    try {
      const url = editingAmenity ? `/api/admin/amenities/${editingAmenity.id}` : '/api/admin/amenities';
      const method = editingAmenity ? 'PATCH' : 'POST';
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error('Failed to save amenity');

      const saved = await res.json();
      
      if (editingAmenity) {
        setAmenities(prev => prev.map(a => a.id === saved.id ? saved : a));
      } else {
        setAmenities(prev => [...prev, saved]);
      }
      
      setIsModalOpen(false);
    } catch (err) {
      console.error('Save amenity error:', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this amenity?')) return;
    
    try {
      const res = await fetch(`/api/admin/amenities/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
      setAmenities(prev => prev.filter(a => a.id !== id));
    } catch (err) {
      console.error('Delete amenity error:', err);
    }
  };

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
        <button onClick={handleOpenCreate} className="btn-gold text-xs">
          <Plus size={14} />
          Add Amenity
        </button>
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
                <div key={amenity.id} className="flex items-center justify-between gap-3 p-3 border border-[var(--border)] hover:border-[var(--gold)] transition-colors group">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{amenity.icon}</span>
                    <p className="text-white text-sm">{amenity.name}</p>
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => handleOpenEdit(amenity)} className="p-1 hover:text-[var(--gold)]">
                      <Edit size={14} />
                    </button>
                    <button onClick={() => handleDelete(amenity.id)} className="p-1 hover:text-red-400">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {amenities.length === 0 && !loading && (
        <div className="bg-[var(--surface-2)] border border-[var(--border)] p-12 text-center">
          <Star size={48} className="text-[var(--text-subtle)] mx-auto mb-4" />
          <h3 className="text-white text-lg mb-2">No amenities yet</h3>
          <p className="text-[var(--text-muted)] text-sm mb-4">
            Create amenities to display them on your properties
          </p>
          <button onClick={handleOpenCreate} className="btn-gold text-xs">
            Create First Amenity
          </button>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50" onClick={() => setIsModalOpen(false)}>
          <div className="bg-[var(--surface-2)] border border-[var(--border)] p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
            <h3 className="font-serif text-xl text-white mb-4">{editingAmenity ? 'Edit Amenity' : 'Create Amenity'}</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-[var(--text-subtle)] text-xs uppercase mb-1">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-[var(--surface)] border border-[var(--border)] rounded px-3 py-2 text-white"
                  placeholder="e.g., High-Speed WiFi"
                />
              </div>
              
              <div>
                <label className="block text-[var(--text-subtle)] text-xs uppercase mb-1">Icon</label>
                <div className="flex flex-wrap gap-2">
                  {iconOptions.map(icon => (
                    <button
                      key={icon}
                      type="button"
                      onClick={() => setFormData({ ...formData, icon })}
                      className={`w-10 h-10 flex items-center justify-center text-xl border rounded ${formData.icon === icon ? 'border-[var(--gold)] bg-[var(--gold)]/10' : 'border-[var(--border)] hover:border-[var(--gold)]'}`}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[var(--text-subtle)] text-xs uppercase mb-1">Category</label>
                <select
                  value={formData.category}
                  onChange={e => setFormData({ ...formData, category: e.target.value })}
                  className="w-full bg-[var(--surface)] border border-[var(--border)] rounded px-3 py-2 text-white"
                >
                  <option value="essential">Essential</option>
                  <option value="comfort">Comfort</option>
                  <option value="safety">Safety</option>
                  <option value="entertainment">Entertainment</option>
                  <option value="outdoor">Outdoor</option>
                </select>
              </div>

              <div>
                <label className="block text-[var(--text-subtle)] text-xs uppercase mb-1">Description (optional)</label>
                <textarea
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-[var(--surface)] border border-[var(--border)] rounded px-3 py-2 text-white"
                  rows={2}
                  placeholder="Brief description..."
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button onClick={() => setIsModalOpen(false)} className="flex-1 px-4 py-2 border border-[var(--border)] text-white rounded hover:bg-[var(--surface)]">
                Cancel
              </button>
              <button onClick={handleSave} className="flex-1 btn-gold">
                {editingAmenity ? 'Save Changes' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
