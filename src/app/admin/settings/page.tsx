'use client';

import { useState, useEffect } from 'react';
import type { Metadata } from 'next';
import { Settings, Phone, Mail, MapPin, Globe, CreditCard, Link as LinkIcon, Clock, Save } from 'lucide-react';
import type { BlogPost } from '@/lib/airtable/types';

export const metadata: Metadata = {
  title: 'Settings | Admin Dashboard',
  robots: 'noindex, nofollow',
};

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    phone: '',
    whatsapp: '',
    email: '',
    address: '',
    facebook: '',
    instagram: '',
    twitter: '',
    youtube: '',
  });

  useEffect(() => {
    fetch('/api/admin/settings')
      .then(res => res.json())
      .then(data => {
        if (data) {
          setSettings({
            phone: data.phone || '',
            whatsapp: data.whatsapp || '',
            email: data.email || '',
            address: data.address || '',
            facebook: data.socialLinks?.facebook || '',
            instagram: data.socialLinks?.instagram || '',
            twitter: data.socialLinks?.twitter || '',
            youtube: data.socialLinks?.youtube || '',
          });
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: settings.phone,
          whatsapp: settings.whatsapp,
          email: settings.email,
          address: settings.address,
          socialLinks: {
            facebook: settings.facebook,
            instagram: settings.instagram,
            twitter: settings.twitter,
            youtube: settings.youtube,
          },
        }),
      });
      if (!res.ok) throw new Error('Failed to save');
      alert('Settings saved successfully!');
    } catch (err) {
      console.error('Save settings error:', err);
      alert('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl text-white mb-1">Settings</h1>
          <p className="text-[var(--text-muted)] text-sm">
            Manage site settings, contact info, and integrations
          </p>
        </div>
        <button onClick={handleSave} disabled={saving} className="btn-gold text-xs">
          <Save size={14} />
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      {/* Settings Grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Contact Information */}
        <div className="bg-[var(--surface-2)] border border-[var(--border)] p-6">
          <h2 className="font-serif text-xl text-white mb-4 flex items-center gap-2">
            <Phone size={18} className="text-[var(--gold)]" />
            Contact Information
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-[var(--text-subtle)] text-xs uppercase mb-1">Phone</label>
              <input
                type="text"
                value={settings.phone}
                onChange={e => setSettings({ ...settings, phone: e.target.value })}
                className="w-full bg-[var(--surface)] border border-[var(--border)] rounded px-3 py-2 text-white"
                placeholder="+233 XX XXX XXXX"
              />
            </div>
            <div>
              <label className="block text-[var(--text-subtle)] text-xs uppercase mb-1">WhatsApp</label>
              <input
                type="text"
                value={settings.whatsapp}
                onChange={e => setSettings({ ...settings, whatsapp: e.target.value })}
                className="w-full bg-[var(--surface)] border border-[var(--border)] rounded px-3 py-2 text-white"
                placeholder="+233 XX XXX XXXX"
              />
            </div>
            <div>
              <label className="block text-[var(--text-subtle)] text-xs uppercase mb-1">Email</label>
              <input
                type="email"
                value={settings.email}
                onChange={e => setSettings({ ...settings, email: e.target.value })}
                className="w-full bg-[var(--surface)] border border-[var(--border)] rounded px-3 py-2 text-white"
                placeholder="info@milehigh5280.com"
              />
            </div>
            <div>
              <label className="block text-[var(--text-subtle)] text-xs uppercase mb-1">Address</label>
              <textarea
                value={settings.address}
                onChange={e => setSettings({ ...settings, address: e.target.value })}
                className="w-full bg-[var(--surface)] border border-[var(--border)] rounded px-3 py-2 text-white"
                rows={2}
                placeholder="Ayi Mensah, Accra, Ghana"
              />
            </div>
          </div>
        </div>

        {/* Social Media */}
        <div className="bg-[var(--surface-2)] border border-[var(--border)] p-6">
          <h2 className="font-serif text-xl text-white mb-4 flex items-center gap-2">
            <Globe size={18} className="text-[var(--gold)]" />
            Social Media
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-[var(--text-subtle)] text-xs uppercase mb-1">Facebook</label>
              <input
                type="text"
                value={settings.facebook}
                onChange={e => setSettings({ ...settings, facebook: e.target.value })}
                className="w-full bg-[var(--surface)] border border-[var(--border)] rounded px-3 py-2 text-white"
                placeholder="https://facebook.com/..."
              />
            </div>
            <div>
              <label className="block text-[var(--text-subtle)] text-xs uppercase mb-1">Instagram</label>
              <input
                type="text"
                value={settings.instagram}
                onChange={e => setSettings({ ...settings, instagram: e.target.value })}
                className="w-full bg-[var(--surface)] border border-[var(--border)] rounded px-3 py-2 text-white"
                placeholder="https://instagram.com/..."
              />
            </div>
            <div>
              <label className="block text-[var(--text-subtle)] text-xs uppercase mb-1">Twitter/X</label>
              <input
                type="text"
                value={settings.twitter}
                onChange={e => setSettings({ ...settings, twitter: e.target.value })}
                className="w-full bg-[var(--surface)] border border-[var(--border)] rounded px-3 py-2 text-white"
                placeholder="https://twitter.com/..."
              />
            </div>
            <div>
              <label className="block text-[var(--text-subtle)] text-xs uppercase mb-1">YouTube</label>
              <input
                type="text"
                value={settings.youtube}
                onChange={e => setSettings({ ...settings, youtube: e.target.value })}
                className="w-full bg-[var(--surface)] border border-[var(--border)] rounded px-3 py-2 text-white"
                placeholder="https://youtube.com/..."
              />
            </div>
          </div>
        </div>
      </div>

      {/* Info Banner */}
      <div className="bg-[var(--surface-2)] border border-[var(--border)] p-4">
        <p className="text-[var(--text-muted)] text-sm">
          <strong className="text-[var(--gold)]">Note:</strong> Settings are stored in the Neon Postgres database and synced to the live site.
        </p>
      </div>
    </div>
  );
}