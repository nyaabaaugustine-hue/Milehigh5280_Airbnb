import type { Metadata } from 'next';
import { Globe, Users, FileText, HelpCircle, Map, Sparkles, MessageCircle } from 'lucide-react';
import { getAboutData, getFaqs, getTourOperators, getExperiences, getVisaInfo, getSafetyTips } from '@/lib/data';

export const metadata: Metadata = {
  title: 'Site Content | Admin Dashboard',
  robots: 'noindex, nofollow',
};

const sections = [
  {
    title: 'About Page',
    description: 'Team members, milestones, values, and company history',
    icon: Users,
    items: ['Team Members', 'Milestones', 'Company Values', 'Statistics'],
  },
  {
    title: 'Ghana Guide',
    description: 'Travel tips, visa info, tours, and local guides',
    icon: Map,
    items: ['Visa Requirements', 'Safety Tips', 'Tour Operators', 'Languages', 'Currency'],
  },
  {
    title: 'FAQs',
    description: 'Frequently asked questions and answers',
    icon: HelpCircle,
    items: ['General Questions', 'Booking', 'Payment', 'Cancellation Policy'],
  },
  {
    title: 'Homepage Sections',
    description: 'Hero, experiences, testimonials, and more',
    icon: Sparkles,
    items: ['Hero Slides', 'Experiences', 'Testimonials', 'Stats'],
  },
  {
    title: 'Contact Page',
    description: 'Contact info, concierge hours, and diaspora testimonials',
    icon: MessageCircle,
    items: ['Contact Info', 'Concierge Hours', 'Diaspora Stories'],
  },
];

export default function AdminSiteContentPage() {
  const aboutData = getAboutData();
  const faqs = getFaqs();
  const tourOperators = getTourOperators();
  const experiences = getExperiences();
  const visaInfo = getVisaInfo();
  const safetyTips = getSafetyTips();

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

      {/* Content Sections Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sections.map((section) => (
          <div
            key={section.title}
            className="bg-[var(--surface-2)] border border-[var(--border)] p-6"
          >
            <div className="flex items-start gap-4 mb-4">
              <div className="p-3 bg-[var(--gold)]/10 text-[var(--gold)]">
                <section.icon size={24} />
              </div>
              <div>
                <h3 className="text-white font-medium">{section.title}</h3>
                <p className="text-[var(--text-muted)] text-sm mt-1">{section.description}</p>
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
          </div>
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
                <div className="w-10 h-10 rounded-full bg-[var(--surface-3)] flex items-center justify-center text-[var(--gold)] font-medium">
                  {member.name.charAt(0)}
                </div>
                <div>
                  <p className="text-white text-sm">{member.name}</p>
                  <p className="text-[var(--text-subtle)] text-xs">{member.role}</p>
                </div>
                <button className="ml-auto text-[var(--gold)] text-xs hover:underline">Edit</button>
              </div>
            ))}
          </div>
        </div>

        {/* Milestones */}
        <div className="bg-[var(--surface-2)] border border-[var(--border)] p-6">
          <h2 className="font-serif text-xl text-white mb-4 flex items-center gap-2">
            <Sparkles size={18} className="text-[var(--gold)]" />
            Company Milestones ({aboutData.milestones.length})
          </h2>
          <div className="space-y-3">
            {aboutData.milestones.map((m) => (
              <div key={m.year} className="flex items-start gap-3 py-2 border-b border-[var(--border)]">
                <span className="text-[var(--gold)] font-serif text-sm shrink-0">{m.year}</span>
                <p className="text-[var(--text-muted)] text-sm">{m.event}</p>
                <button className="ml-auto text-[var(--gold)] text-xs hover:underline shrink-0">Edit</button>
              </div>
            ))}
          </div>
        </div>

        {/* FAQs */}
        <div className="bg-[var(--surface-2)] border border-[var(--border)] p-6">
          <h2 className="font-serif text-xl text-white mb-4 flex items-center gap-2">
            <HelpCircle size={18} className="text-[var(--gold)]" />
            FAQs ({faqs.length})
          </h2>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div key={i} className="py-2 border-b border-[var(--border)]">
                <p className="text-white text-sm font-medium">{faq.q}</p>
                <p className="text-[var(--text-subtle)] text-xs mt-1 line-clamp-2">{faq.a}</p>
                <button className="text-[var(--gold)] text-xs hover:underline mt-1">Edit</button>
              </div>
            ))}
          </div>
        </div>

        {/* Tour Operators */}
        <div className="bg-[var(--surface-2)] border border-[var(--border)] p-6">
          <h2 className="font-serif text-xl text-white mb-4 flex items-center gap-2">
            <Map size={18} className="text-[var(--gold)]" />
            Tour Operators ({tourOperators.length})
          </h2>
          <div className="space-y-3">
            {tourOperators.map((tour, i) => (
              <div key={i} className="py-2 border-b border-[var(--border)]">
                <p className="text-white text-sm font-medium">{tour.name}</p>
                <p className="text-[var(--text-muted)] text-xs mt-1">{tour.duration} • {tour.price}</p>
                <button className="text-[var(--gold)] text-xs hover:underline mt-1">Edit</button>
              </div>
            ))}
          </div>
        </div>

        {/* Experiences */}
        <div className="bg-[var(--surface-2)] border border-[var(--border)] p-6">
          <h2 className="font-serif text-xl text-white mb-4 flex items-center gap-2">
            <Sparkles size={18} className="text-[var(--gold)]" />
            Homepage Experiences ({experiences.length})
          </h2>
          <div className="space-y-3">
            {experiences.map((exp, i) => (
              <div key={i} className="py-2 border-b border-[var(--border)]">
                <p className="text-white text-sm font-medium">{exp.title}</p>
                <p className="text-[var(--text-subtle)] text-xs mt-1 line-clamp-1">{exp.desc}</p>
                <button className="text-[var(--gold)] text-xs hover:underline mt-1">Edit</button>
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="bg-[var(--surface-2)] border border-[var(--border)] p-6">
          <h2 className="font-serif text-xl text-white mb-4 flex items-center gap-2">
            <Globe size={18} className="text-[var(--gold)]" />
            Site Statistics
          </h2>
          <div className="grid grid-cols-2 gap-4">
            {aboutData.stats.map((stat, i) => (
              <div key={i} className="text-center p-4 bg-[var(--surface-3)] border border-[var(--border)]">
                <p className="font-serif text-2xl text-[var(--gold)]">{stat.value}</p>
                <p className="text-[var(--text-subtle)] text-xs mt-1">{stat.label}</p>
                <button className="text-[var(--gold)] text-xs hover:underline mt-2">Edit</button>
              </div>
            ))}
          </div>
        </div>

        {/* Visa Info */}
        <div className="bg-[var(--surface-2)] border border-[var(--border)] p-6">
          <h2 className="font-serif text-xl text-white mb-4 flex items-center gap-2">
            <FileText size={18} className="text-[var(--gold)]" />
            Visa Information ({visaInfo.length})
          </h2>
          <div className="space-y-3">
            {visaInfo.map((visa, i) => (
              <div key={i} className="py-2 border-b border-[var(--border)]">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{visa.flag}</span>
                  <p className="text-white text-sm font-medium">{visa.title}</p>
                </div>
                <p className="text-[var(--text-subtle)] text-xs mt-1 line-clamp-2">{visa.detail}</p>
                <button className="text-[var(--gold)] text-xs hover:underline mt-1">Edit</button>
              </div>
            ))}
          </div>
        </div>

        {/* Safety Tips */}
        <div className="bg-[var(--surface-2)] border border-[var(--border)] p-6">
          <h2 className="font-serif text-xl text-white mb-4 flex items-center gap-2">
            <HelpCircle size={18} className="text-[var(--gold)]" />
            Safety & Health Tips ({safetyTips.length})
          </h2>
          <div className="space-y-3">
            {safetyTips.map((tip, i) => (
              <div key={i} className="py-2 border-b border-[var(--border)]">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{tip.icon}</span>
                  <p className="text-white text-sm font-medium">{tip.title}</p>
                </div>
                <p className="text-[var(--text-subtle)] text-xs mt-1 line-clamp-2">{tip.detail}</p>
                <button className="text-[var(--gold)] text-xs hover:underline mt-1">Edit</button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Note */}
      <div className="bg-[var(--surface-2)] border border-[var(--border)] p-4">
        <p className="text-[var(--text-muted)] text-sm">
          <strong className="text-[var(--gold)]">Note:</strong> All site content is managed in <code className="bg-[var(--surface-3)] px-1">src/lib/data.ts</code>. 
          Click "Edit" buttons to modify content directly.
        </p>
      </div>
    </div>
  );
}
