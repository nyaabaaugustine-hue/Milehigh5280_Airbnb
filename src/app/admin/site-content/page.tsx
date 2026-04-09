import type { Metadata } from 'next';
import Link from 'next/link';
import { Globe, Users, FileText, HelpCircle, Map, DollarSign, Sparkles, MessageCircle } from 'lucide-react';
import { getSiteContent, getAboutData, getFaqs, getTourOperators } from '@/lib/data';

export const metadata: Metadata = {
  title: 'Site Content | Admin Dashboard',
  robots: 'noindex, nofollow',
};

const sections = [
  {
    title: 'About Page',
    description: 'Team members, milestones, values, and company history',
    icon: Users,
    href: '/admin/site-content/about',
    items: ['Team Members', 'Milestones', 'Company Values', 'Statistics'],
  },
  {
    title: 'Ghana Guide',
    description: 'Travel tips, visa info, tours, and local guides',
    icon: Map,
    href: '/admin/site-content/ghana-guide',
    items: ['Visa Requirements', 'Safety Tips', 'Tour Operators', 'Languages', 'Currency'],
  },
  {
    title: 'FAQs',
    description: 'Frequently asked questions and answers',
    icon: HelpCircle,
    href: '/admin/site-content/faqs',
    items: ['General Questions', 'Booking', 'Payment', 'Cancellation Policy'],
  },
  {
    title: 'Homepage Sections',
    description: 'Hero, experiences, testimonials, and more',
    icon: Sparkles,
    href: '/admin/site-content/homepage',
    items: ['Hero Slides', 'Experiences', 'Testimonials', 'Stats'],
  },
  {
    title: 'Contact Page',
    description: 'Contact info, concierge hours, and diaspora testimonials',
    icon: MessageCircle,
    href: '/admin/site-content/contact',
    items: ['Contact Info', 'Concierge Hours', 'Diaspora Stories'],
  },
];

export default function AdminSiteContentPage() {
  const aboutData = getAboutData();
  const faqs = getFaqs();
  const tourOperators = getTourOperators();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl text-white mb-1">Site Content</h1>
          <p className="text-[var(--text-muted)] text-sm">
            Manage page content, FAQs, tours, and more
          </p>
        </div>
      </div>

      {/* Info Banner */}
      <div className="bg-[var(--surface-2)] border border-[var(--border)] p-4">
        <p className="text-[var(--text-muted)] text-sm">
          <strong className="text-[var(--gold)]">Note:</strong> Site content is managed in Airtable's <strong className="text-white">Site Content</strong> table. 
          Each section links to edit content directly in Airtable.
        </p>
      </div>

      {/* Content Sections Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sections.map((section) => (
          <a
            key={section.title}
            href="https://airtable.com"
            target="_blank"
            rel="noopener noreferrer"
            className="group bg-[var(--surface-2)] border border-[var(--border)] p-6 hover:border-[var(--gold)] transition-all"
          >
            <div className="flex items-start gap-4 mb-4">
              <div className="p-3 bg-[var(--gold)]/10 text-[var(--gold)]">
                <section.icon size={24} />
              </div>
              <div>
                <h3 className="text-white font-medium group-hover:text-[var(--gold)] transition-colors">
                  {section.title}
                </h3>
                <p className="text-[var(--text-muted)] text-sm mt-1">
                  {section.description}
                </p>
              </div>
            </div>
            <div className="space-y-1">
              {section.items.map((item) => (
                <div key={item} className="flex items-center gap-2 text-[var(--text-subtle)] text-xs">
                  <span className="w-1 h-1 bg-[var(--gold)] rounded-full" />
                  {item}
                </div>
              ))}
            </div>
            <div className="mt-4 text-[var(--gold)] text-xs group-hover:underline">
              Edit in Airtable →
            </div>
          </a>
        ))}
      </div>

      {/* Content Preview */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Team Members */}
        <div className="bg-[var(--surface-2)] border border-[var(--border)] p-6">
          <h2 className="font-serif text-xl text-white mb-4 flex items-center gap-2">
            <Users size={18} className="text-[var(--gold)]" />
            Team Members ({aboutData.team.length})
          </h2>
          <div className="space-y-3">
            {aboutData.team.map((member) => (
              <div key={member.name} className="flex items-center gap-3 py-2 border-b border-[var(--border)]">
                <div className="w-10 h-10 rounded-full bg-[var(--surface-3)] overflow-hidden">
                  {/* Avatar placeholder */}
                </div>
                <div>
                  <p className="text-white text-sm">{member.name}</p>
                  <p className="text-[var(--text-subtle)] text-xs">{member.role}</p>
                </div>
              </div>
            ))}
          </div>
          <a 
            href="https://airtable.com"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 text-[var(--gold)] text-xs hover:underline"
          >
            Edit in Airtable →
          </a>
        </div>

        {/* FAQs */}
        <div className="bg-[var(--surface-2)] border border-[var(--border)] p-6">
          <h2 className="font-serif text-xl text-white mb-4 flex items-center gap-2">
            <HelpCircle size={18} className="text-[var(--gold)]" />
            FAQs ({faqs.length})
          </h2>
          <div className="space-y-3">
            {faqs.slice(0, 4).map((faq, i) => (
              <div key={i} className="py-2 border-b border-[var(--border)]">
                <p className="text-white text-sm font-medium">{faq.q}</p>
                <p className="text-[var(--text-subtle)] text-xs mt-1 line-clamp-2">{faq.a}</p>
              </div>
            ))}
          </div>
          {faqs.length > 4 && (
            <p className="text-[var(--text-subtle)] text-xs mt-2">+{faqs.length - 4} more FAQs</p>
          )}
          <a 
            href="https://airtable.com"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 text-[var(--gold)] text-xs hover:underline"
          >
            Edit in Airtable →
          </a>
        </div>

        {/* Tour Operators */}
        <div className="bg-[var(--surface-2)] border border-[var(--border)] p-6">
          <h2 className="font-serif text-xl text-white mb-4 flex items-center gap-2">
            <Map size={18} className="text-[var(--gold)]" />
            Tour Operators ({tourOperators.length})
          </h2>
          <div className="space-y-3">
            {tourOperators.slice(0, 3).map((tour, i) => (
              <div key={i} className="py-2 border-b border-[var(--border)]">
                <p className="text-white text-sm font-medium">{tour.name}</p>
                <p className="text-[var(--text-subtle)] text-xs mt-1">{tour.duration} • {tour.price}</p>
              </div>
            ))}
          </div>
          <a 
            href="https://airtable.com"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 text-[var(--gold)] text-xs hover:underline"
          >
            Edit in Airtable →
          </a>
        </div>

        {/* Site Statistics */}
        <div className="bg-[var(--surface-2)] border border-[var(--border)] p-6">
          <h2 className="font-serif text-xl text-white mb-4 flex items-center gap-2">
            <Sparkles size={18} className="text-[var(--gold)]" />
            Homepage Stats
          </h2>
          <div className="grid grid-cols-2 gap-4">
            {aboutData.stats.map((stat, i) => (
              <div key={i} className="text-center p-4 bg-[var(--surface-3)] border border-[var(--border)]">
                <p className="font-serif text-2xl text-[var(--gold)]">{stat.value}</p>
                <p className="text-[var(--text-subtle)] text-xs mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
          <a 
            href="https://airtable.com"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 text-[var(--gold)] text-xs hover:underline"
          >
            Edit in Airtable →
          </a>
        </div>
      </div>

      {/* Airtable Setup Guide */}
      <div className="bg-[var(--gold)]/10 border border-[var(--gold)]/30 p-6">
        <h3 className="text-[var(--gold)] font-medium mb-2">Need to Set Up Site Content Tables?</h3>
        <p className="text-[var(--text-muted)] text-sm mb-4">
          Follow the Airtable setup guide to create tables for About, FAQs, Tours, and more.
        </p>
        <a 
          href="/AIRTABLE-SETUP.md"
          target="_blank"
          className="btn-gold text-xs"
        >
          View Airtable Setup Guide
        </a>
      </div>
    </div>
  );
}
