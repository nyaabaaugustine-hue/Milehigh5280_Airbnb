import type { Metadata } from 'next';
import { Settings, Phone, Mail, MapPin, Globe, CreditCard, Link as LinkIcon, Clock } from 'lucide-react';
import { getContactInfo, getSocialLinks, getConciergeHours, getPromoCodes } from '@/lib/data';

export const metadata: Metadata = {
  title: 'Settings | Admin Dashboard',
  robots: 'noindex, nofollow',
};

export default function AdminSettingsPage() {
  const contactInfo = getContactInfo();
  const socialLinks = getSocialLinks();
  const conciergeHours = getConciergeHours();
  const promoCodes = getPromoCodes();

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
      </div>

      {/* Info Banner */}
      <div className="bg-[var(--surface-2)] border border-[var(--border)] p-4">
        <p className="text-[var(--text-muted)] text-sm">
          <strong className="text-[var(--gold)]">Note:</strong> Settings are managed by the Neon backend and optionally by <code className="bg-[var(--surface-3)] px-1">src/lib/data.ts</code> for local defaults.
        </p>
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
            <div className="flex items-start gap-3">
              <Phone size={16} className="text-[var(--text-subtle)] mt-0.5" />
              <div>
                <p className="text-[var(--text-subtle)] text-xs uppercase tracking-wider">Phone</p>
                <p className="text-white">{contactInfo.phone}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Phone size={16} className="text-[var(--text-subtle)] mt-0.5" />
              <div>
                <p className="text-[var(--text-subtle)] text-xs uppercase tracking-wider">WhatsApp</p>
                <p className="text-white">{contactInfo.whatsapp}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Mail size={16} className="text-[var(--text-subtle)] mt-0.5" />
              <div>
                <p className="text-[var(--text-subtle)] text-xs uppercase tracking-wider">Email</p>
                <p className="text-white">{contactInfo.email}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <MapPin size={16} className="text-[var(--text-subtle)] mt-0.5" />
              <div>
                <p className="text-[var(--text-subtle)] text-xs uppercase tracking-wider">Address</p>
                <p className="text-white">{contactInfo.location}</p>
              </div>
            </div>
          </div>
          <div className="mt-4 text-[var(--text-muted)] text-xs">
            Managed through Neon Postgres or local config.
          </div>
        </div>

        {/* Concierge Hours */}
        <div className="bg-[var(--surface-2)] border border-[var(--border)] p-6">
          <h2 className="font-serif text-xl text-white mb-4 flex items-center gap-2">
            <Clock size={18} className="text-[var(--gold)]" />
            Concierge Hours
          </h2>
          <div className="space-y-2">
            {conciergeHours.map((item, i) => (
              <div key={i} className="flex justify-between py-2 border-b border-[var(--border)] last:border-0">
                <span className="text-[var(--text-muted)] text-sm">{item.day}</span>
                <span className="text-white text-sm">{item.hours}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 text-[var(--text-muted)] text-xs">
            Managed through Neon Postgres or local config.
          </div>
        </div>

        {/* Social Links */}
        <div className="bg-[var(--surface-2)] border border-[var(--border)] p-6">
          <h2 className="font-serif text-xl text-white mb-4 flex items-center gap-2">
            <Globe size={18} className="text-[var(--gold)]" />
            Social Media
          </h2>
          <div className="space-y-3">
            {socialLinks.map((social) => (
              <div key={social.platform} className="flex items-center justify-between py-2 border-b border-[var(--border)]">
                <div className="flex items-center gap-2">
                  <Globe size={14} className="text-[var(--text-subtle)]" />
                  <span className="text-white text-sm capitalize">{social.platform}</span>
                </div>
                <span className="text-[var(--text-muted)] text-xs truncate max-w-[200px]">{social.url}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 text-[var(--text-muted)] text-xs">
            Managed through Neon Postgres or local config.
          </div>
        </div>

        {/* Promo Codes */}
        <div className="bg-[var(--surface-2)] border border-[var(--border)] p-6">
          <h2 className="font-serif text-xl text-white mb-4 flex items-center gap-2">
            <CreditCard size={18} className="text-[var(--gold)]" />
            Promo Codes
          </h2>
          {Object.keys(promoCodes).length > 0 ? (
            <div className="space-y-3">
              {Object.entries(promoCodes).map(([code, details]) => (
                <div key={code} className="flex items-center justify-between py-2 border-b border-[var(--border)]">
                  <div>
                    <p className="text-white text-sm font-mono">{code}</p>
                    <p className="text-[var(--text-subtle)] text-xs">{details.description}</p>
                  </div>
                  <span className="text-[var(--gold)] font-medium">
                    {details.discount}% OFF
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-[var(--text-muted)] text-sm">No promo codes configured</p>
          )}
          <div className="mt-4 text-[var(--text-muted)] text-xs">
            Add promo codes through Neon Postgres or local config.
          </div>
        </div>
      </div>

      {/* Environment Variables */}
      <div className="bg-[var(--surface-2)] border border-[var(--border)] p-6">
        <h2 className="font-serif text-xl text-white mb-4 flex items-center gap-2">
          <Settings size={18} className="text-[var(--gold)]" />
          Environment Variables
        </h2>
        <p className="text-[var(--text-muted)] text-sm mb-4">
          Required environment variables for the application. Add these to your <code className="bg-[var(--surface-3)] px-1">.env.local</code> file or Vercel dashboard.
        </p>
        <div className="bg-[var(--obsidian)] border border-[var(--border)] p-4 overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-[var(--border)]">
                <th className="text-left py-2 text-[var(--text-subtle)] uppercase tracking-wider">Variable</th>
                <th className="text-left py-2 text-[var(--text-subtle)] uppercase tracking-wider">Value</th>
                <th className="text-left py-2 text-[var(--text-subtle)] uppercase tracking-wider">Required</th>
              </tr>
            </thead>
            <tbody className="font-mono">
              {envVars.map((envVar) => (
                <tr key={envVar.name} className="border-b border-[var(--border)] last:border-0">
                  <td className="py-2 text-green-400">{envVar.name}</td>
                  <td className="py-2 text-[var(--text-muted)]">{envVar.placeholder}</td>
                  <td className="py-2">
                    {envVar.required ? (
                      <span className="text-red-400">Yes</span>
                    ) : (
                      <span className="text-yellow-400">Optional</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Neon Setup */}
      <div className="bg-[var(--gold)]/10 border border-[var(--gold)]/30 p-6">
        <h3 className="text-[var(--gold)] font-medium mb-2">Need to Set Up Neon CMS?</h3>
        <p className="text-[var(--text-muted)] text-sm mb-4">
          Follow the Neon migration guide to connect your Postgres CMS and replace Airtable.
        </p>
        <a 
          href="/NEON-MIGRATION.md"
          target="_blank"
          rel="noreferrer"
          className="btn-gold text-xs"
        >
          View Neon Setup Guide
        </a>
      </div>
    </div>
  );
}

const envVars = [
  { name: 'NEON_DATABASE_URL', placeholder: 'postgres://user:pass@host:5432/dbname', required: true },
  { name: 'NEON_DATABASE_URL_READ_REPLICA', placeholder: 'postgres://user:pass@host:5432/dbname', required: false },
  { name: 'GROK_API_KEY', placeholder: 'sk-...', required: true },
  { name: 'GMAIL_USER', placeholder: 'your-email@gmail.com', required: true },
  { name: 'GMAIL_PASS', placeholder: '16-character-app-password', required: true },
  { name: 'ADMIN_EMAIL', placeholder: 'admin@example.com', required: true },
  { name: 'NEXT_PUBLIC_SITE_URL', placeholder: 'https://yoursite.com', required: true },
  { name: 'NEXT_PUBLIC_WHATSAPP_NUMBER', placeholder: '233XXXXXXXXX', required: true },
  { name: 'NEXT_PUBLIC_HOTJAR_ID', placeholder: 'XXXXXXXX', required: false },
  { name: 'NEXT_PUBLIC_CLARITY_ID', placeholder: 'XXXXXXXXXX', required: false },
];
