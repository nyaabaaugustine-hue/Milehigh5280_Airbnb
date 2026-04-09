import type { Metadata } from 'next';
import PropertiesGrid from '@/components/cms/PropertiesGrid';

const SITE_URL = 'https://thepalmayimensah.com';

export const metadata: Metadata = {
  title: 'Luxury Properties in Accra — The Palm & More | Milehigh Properties',
  description: 'Browse our curated collection of premium private apartments and villas in Ayi Mensah and Greater Accra, Ghana. All properties managed by Milehigh Properties with 5-star hospitality standards.',
  keywords: ['luxury accommodation Accra', 'private villa Ghana', 'Ayi Mensah apartments', 'Milehigh Properties', 'short stay Accra', 'Ghana luxury rentals', 'premium apartments Accra'],
  openGraph: {
    title: 'Luxury Properties in Accra | Milehigh Properties',
    description: 'Premium private apartments and villas across Accra, Ghana. Managed by Milehigh Properties.',
    url: 'https://thepalmayimensah.com/properties',
    images: [{ url: 'https://res.cloudinary.com/dwsl2ktt2/image/upload/v1775380667/ERR_jjr2hx.jpg', width: 1200, height: 630 }],
  },
};

export default function PropertiesPage() {
  return (
    <>
      {/* ── Page Hero ── */}
      <section className="relative pt-40 pb-20 px-6 lg:px-12 border-b border-[var(--border)]">
        <div className="max-w-[1440px] mx-auto">
          <p className="section-label mb-4">Our Portfolio</p>
          <h1 className="font-serif font-light text-white leading-tight mb-4">
            All <span className="italic text-gold-gradient">Properties</span>
          </h1>
          <p className="text-[var(--text-muted)] max-w-xl leading-relaxed">
            Every property managed by Milehigh Properties to the highest standards of Ghanaian
            luxury hospitality — private, secure, and beautifully maintained.
          </p>
        </div>
      </section>

      {/* ── Properties Grid (from Airtable CMS) ── */}
      <PropertiesGrid />
    </>
  );
}
