import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Globe, Heart, Award } from 'lucide-react';
import AdinkraSection from '@/components/home/AdinkraSection';

export const metadata: Metadata = {
  title: 'Our Story | Milehigh5280 Airbnb',
  description: "The story behind Ghana's most exclusive luxury property collection in Ayi Mensah.",
  openGraph: {
    title: 'Milehigh5280 Airbnb | Luxury Stays in Accra',
    description: 'Experience premium private apartments in the lush greenery of Ayi Mensah, Ghana.',
    url: 'https://milehigh5280.com',
    siteName: 'Milehigh5280 Airbnb',
    images: [
      {
        url: 'https://res.cloudinary.com/dwsl2ktt2/image/upload/v1775296671/logo_xcjkpn.jpg',
        width: 1200,
        height: 630,
        alt: 'Milehigh5280 Logo',
      },
    ],
    locale: 'en_GH',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Milehigh5280 Airbnb | Luxury Stays in Accra',
    description: 'Experience premium private apartments in the lush greenery of Ayi Mensah, Ghana.',
    images: ['https://res.cloudinary.com/dwsl2ktt2/image/upload/v1775296671/logo_xcjkpn.jpg'],
  },
};

const milestones = [
  { year: '2019', event: 'Founded in Accra with a single villa in Cantonments.' },
  { year: '2020', event: 'Expanded to 3 properties. Launched our private concierge service.' },
  { year: '2022', event: 'Named "Best Luxury Accommodation" by Ghana Tourism Authority.' },
  { year: '2023', event: 'Lakeside Estate opened — our most ambitious property yet.' },
  { year: '2024', event: 'Over 1,000 guests hosted. 4.97 average rating across all platforms.' },
  { year: '2025', event: 'Pearl Mansion debut. Expansion into Cape Coast and Kumasi planned.' },
];

const values = [
  {
    Icon: Heart,
    title: 'Genuine Hospitality',
    desc: 'We believe luxury is not just in marble floors and infinity pools — it\'s in the warmth of a greeting, the remembering of your name, the anticipation of your needs.',
  },
  {
    Icon: Globe,
    title: 'Ghana, Elevated',
    desc: 'We are proudly Ghanaian. Our mission is to showcase our country at its most magnificent — to prove that world-class luxury exists right here in West Africa.',
  },
  {
    Icon: Award,
    title: 'Uncompromising Quality',
    desc: 'Every property, every amenity, every interaction is measured against global five-star hotel standards. We accept nothing less, and neither should you.',
  },
];

const team = [
  {
    name: 'Adwoa Mensah',
    role: 'Founder & CEO',
    bio: 'A hospitality veteran with 15 years across London, Dubai, and Accra. Adwoa\'s vision: to create the luxury Ghana deserves.',
    image: 'https://res.cloudinary.com/dwsl2ktt2/image/upload/v1775440036/-1x-1_wipegu.webp',
  },
  {
    name: 'Kwame Osei',
    role: 'Head of Properties',
    bio: 'Architect and interior designer who has curated every space with meticulous attention to both global luxury standards and Ghanaian cultural authenticity.',
    image: 'https://res.cloudinary.com/dwsl2ktt2/image/upload/v1775440120/dfff_wjh8fy.avif',
  },
  {
    name: 'Abena Darko',
    role: 'Chief Concierge',
    bio: 'Former luxury hotel concierge in Cape Town and Singapore. Abena\'s team handles everything — from airport transfers to private chef menus.',
    image: 'https://res.cloudinary.com/dwsl2ktt2/image/upload/v1771670757/cvA_ki5o4o.jpg',
  },
];

export default function AboutPage() {
  return (
    <>
      {/* ── Hero ── */}
      <section className="relative min-h-[70vh] flex items-end pt-24 pb-20 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://res.cloudinary.com/dwsl2ktt2/image/upload/v1775380667/ERR_jjr2hx.jpg"
            alt="Luxury villa — Luxe Ghana Stays"
            fill
            className="object-cover"
              unoptimized
            priority
          />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(8,8,8,0.4) 0%, rgba(8,8,8,0.95) 100%)' }} />
        </div>

        <div className="relative z-10 max-w-[1440px] mx-auto px-6 lg:px-12 w-full">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-12">
            <div>
              <p className="section-label mb-4 flex items-center gap-2">
                Our Story
                <Image
                  src="https://res.cloudinary.com/dwsl2ktt2/image/upload/v1775411320/images_1_kilffq.jpg"
                  alt="Ghana Flag"
                  width={20}
                  height={13}
                  className="rounded-sm"
                  unoptimized
                />
              </p>
              <h1 className="font-serif font-light text-white leading-tight mb-6">
                A Vision of<br />
                <span className="italic text-gold-gradient">Extraordinary</span>
              </h1>
              <p className="text-[var(--text-muted)] max-w-xl leading-relaxed">
                Born from a deep love of Ghana and a refusal to accept that world-class
                luxury could only exist abroad — Luxe Ghana Stays is our answer.
              </p>
            </div>
          </div>
        </div>

        {/* Minimal Kente Accent Line */}
        <div 
          className="absolute bottom-0 left-0 w-full h-[2px] opacity-30 z-20"
          style={{ backgroundImage: 'url(https://res.cloudinary.com/dwsl2ktt2/image/upload/v1775413445/kente-seamless-digital-paper-pattern_546783-186_kbgc49.jpg)', backgroundSize: '200px' }}
        />
      </section>


      {/* ── Adinkra Heritage Strip ── */}
      <AdinkraSection />

      {/* ── Origin Story ── */}
      <section className="py-24 px-6 lg:px-12 max-w-[1440px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <p className="section-label mb-4">How We Began</p>
            <h2 className="font-serif text-4xl font-light text-white mb-6">
              A gap in the market.<br />
              <span className="italic text-gold-gradient">An opportunity for Ghana.</span>
            </h2>
            <div className="space-y-4 text-[var(--text-muted)] leading-relaxed">
              <p>
                In 2019, our founder Adwoa Mensah returned to Accra after years in London&apos;s
                luxury hospitality industry. She brought friends and business colleagues to Ghana —
                only to find that the accommodation available simply did not match the quality
                of the country&apos;s people, cuisine, and spirit.
              </p>
              <p>
                She decided to change that. Starting with one villa in Cantonments and a team
                of three, Luxe Ghana Stays was born from a single conviction: <em>Ghana deserves
                luxury that rivals anywhere in the world.</em>
              </p>
              <p>
                Today, we manage a portfolio of handpicked private estates, penthouses, and villas —
                each one a testament to what is possible when Ghanaian warmth meets global luxury standards.
              </p>
            </div>
          </div>

          <div className="relative">
            <div className="grid grid-cols-2 gap-3">
              <div className="relative h-64 overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=600&q=80"
                  alt="Luxury interior detail"
                  unoptimized
                  fill className="object-cover"
                />
              </div>
              <div className="relative h-64 mt-8 overflow-hidden">
                <Image
                  src="https://res.cloudinary.com/dwsl2ktt2/image/upload/v1775380288/1_qwgwqd.png"
                  alt="The Palm exterior"
                  unoptimized
                  fill className="object-cover"
                />
              </div>
            </div>
            {/* Website Logo */}
            <div className="absolute -bottom-4 -left-4 w-24 h-24 border border-[var(--gold)]/60 z-10 overflow-hidden bg-[var(--obsidian)] shadow-lg">
              <Image
                src="https://res.cloudinary.com/dwsl2ktt2/image/upload/v1775296671/logo_xcjkpn.jpg"
                alt="Milehigh Properties Logo"
                fill
                className="object-cover"
                unoptimized
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── Values ── */}
      <section className="py-24 bg-[var(--surface)] border-y border-[var(--border)]">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
            <p className="section-label mb-4">What We Stand For</p>
            <h2 className="font-serif text-4xl font-light text-white">
              Our <span className="italic text-gold-gradient">Values</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map(({ Icon, title, desc }) => (
              <div key={title} className="border border-[var(--border)] p-8 hover:border-[var(--gold)] transition-colors duration-300 group">
                <div className="w-12 h-12 border border-[var(--border)] flex items-center justify-center mb-6 group-hover:border-[var(--gold)] transition-colors duration-300">
                  <Icon size={20} className="text-[var(--gold)]" />
                </div>
                <h3 className="font-serif text-xl font-light text-white mb-3">{title}</h3>
                <p className="text-[var(--text-muted)] text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Timeline ── */}
      <section className="py-24 px-6 lg:px-12 max-w-[1440px] mx-auto">
        <div className="text-center mb-16">
          <p className="section-label mb-4">Our Journey</p>
          <h2 className="font-serif text-4xl font-light text-white">
            Milestones
          </h2>
        </div>

        <div className="relative max-w-2xl mx-auto">
          {/* Vertical line */}
          <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-[var(--gold)] to-transparent opacity-30" />

          <div className="space-y-8">
            {milestones.map(({ year, event }, i) => (
              <div key={year} className="flex gap-8 group">
                <div className="shrink-0 flex flex-col items-center">
                  <div className="w-12 h-12 border border-[var(--border)] group-hover:border-[var(--gold)] flex items-center justify-center bg-[var(--surface)] transition-colors duration-300 relative z-10">
                    <span className="font-serif text-xs text-[var(--gold)]">{year}</span>
                  </div>
                </div>
                <div className="pt-3 pb-8">
                  <p className="text-white text-sm leading-relaxed">{event}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Team ── */}
      <section id="team" className="py-24 bg-[var(--surface)] border-y border-[var(--border)]">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
            <p className="section-label mb-4">The People Behind The Magic</p>
            <h2 className="font-serif text-4xl font-light text-white">
              Meet The <span className="italic text-gold-gradient">Team</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map(({ name, role, bio, image }) => (
              <div key={name} className="group">
                <div className="relative h-72 overflow-hidden mb-6 border border-[var(--border)] group-hover:border-[var(--gold)] transition-colors duration-500">
                  <Image
                    src={image}
                    alt={name}
                    fill
                    unoptimized
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-obsidian/80 to-transparent" />
                </div>
                <h3 className="font-serif text-xl text-white mb-1">{name}</h3>
                <p className="text-[var(--gold)] text-xs uppercase tracking-widest mb-3">{role}</p>
                <p className="text-[var(--text-muted)] text-sm leading-relaxed">{bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="py-24 px-6 lg:px-12 max-w-[1440px] mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { value: '1,000+', label: 'Happy Guests' },
            { value: '4.97',   label: 'Average Rating' },
            { value: '6',      label: 'Years of Excellence' },
            { value: '4',      label: 'Exclusive Properties' },
          ].map(({ value, label }) => (
            <div key={label} className="text-center border border-[var(--border)] p-8 hover:border-[var(--gold)] transition-colors duration-300">
              <p className="font-serif text-5xl font-light text-gold-gradient mb-2">{value}</p>
              <p className="section-label text-[0.6rem]">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-16 px-6 lg:px-12 max-w-[1440px] mx-auto text-center border-t border-[var(--border)]">
        <h2 className="font-serif text-4xl font-light text-white mb-4">
          Ready to experience <span className="italic text-gold-gradient">the difference</span>?
        </h2>
        <p className="text-[var(--text-muted)] mb-8 max-w-md mx-auto">
          Browse our collection of extraordinary properties and begin planning your perfect stay.
        </p>
        <Link href="/properties" className="btn-gold">
          View All Properties
          <ArrowRight size={14} />
        </Link>
      </section>
    </>
  );
}
