import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Star, Award, Heart, Users, Globe, CheckCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Meet Your Host | Milehigh Properties',
  description: 'Meet Adwoa Mensah, Founder & CEO of Milehigh Properties — curating Ghana\'s finest luxury short-stay experiences in Ayi Mensah, Accra.',
  openGraph: {
    title: 'Meet Your Host — Adwoa Mensah | Milehigh Properties',
    description: 'The story behind Ghana\'s most personalised luxury rental experience.',
    url: 'https://thepalmayimensah.com/host',
    images: [{ url: 'https://res.cloudinary.com/dwsl2ktt2/image/upload/v1775440036/-1x-1_wipegu.webp', width: 800, height: 800 }],
  },
};

const stats = [
  { icon: Users,  value: '1,000+', label: 'Guests Hosted'          },
  { icon: Star,   value: '4.97 ★', label: 'Average Rating'         },
  { icon: Globe,  value: '6+',     label: 'Years Experience'        },
  { icon: Award,  value: 'GTA',    label: 'Ghana Tourism Certified' },
];

const values = [
  {
    icon: Heart,
    title: 'Genuine Hospitality',
    desc: 'Luxury is in the warmth of a welcome, the remembering of your name, and the quiet anticipation of every need. That philosophy drives everything we do.',
  },
  {
    icon: Globe,
    title: 'Ghana, Elevated',
    desc: 'We believe Ghana deserves world-class representation. Every property we curate showcases the beauty, richness, and modernity of this extraordinary country.',
  },
  {
    icon: Award,
    title: 'Uncompromising Standards',
    desc: 'Every linen, every amenity, every finish is chosen with intention. We do not cut corners — we add details that turn a stay into a memory.',
  },
  {
    icon: CheckCircle,
    title: 'Personal Accountability',
    desc: 'We are reachable, responsive, and personally invested in the quality of every single guest experience. Your satisfaction is our reputation.',
  },
];

const timeline = [
  { year: '2019', event: 'Founded Milehigh Properties with a single villa in Cantonments, Accra.' },
  { year: '2020', event: 'Expanded to 3 properties and launched our private concierge service.' },
  { year: '2022', event: 'Named "Best Luxury Accommodation" by Ghana Tourism Authority.' },
  { year: '2023', event: 'Opened The Palm at Ayi Mensah — our most intimate and cherished property.' },
  { year: '2024', event: 'Over 1,000 guests hosted. 4.97 average rating across all platforms.' },
  { year: '2025', event: 'Expanding into Cape Coast and Kumasi. More stories ahead.' },
];

export default function HostPage() {
  return (
    <>
      {/* ── Hero ── */}
      <section className="pt-36 pb-0 bg-[var(--obsidian)] border-b border-[var(--border)] overflow-hidden">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-end">

            {/* Text */}
            <div className="pb-16 lg:pb-24">
              <p className="section-label mb-4">Your Host</p>
              <h1 className="font-serif text-5xl lg:text-7xl font-light text-white leading-tight mb-6">
                Adwoa<br />
                <span className="italic text-gold-gradient">Mensah</span>
              </h1>
              <p className="text-[var(--text-muted)] text-lg font-light leading-relaxed mb-4">
                Founder &amp; CEO, Milehigh Properties
              </p>
              <div className="divider-gold mb-8" />
              <p className="text-[var(--text-muted)] leading-relaxed max-w-xl">
                Born and raised in Accra, Adwoa returned from 15 years in London&apos;s luxury 
                hospitality industry with a singular vision: to prove that world-class luxury 
                could exist right here in Ghana — warm, beautifully designed, and deeply personal.
              </p>
            </div>

            {/* Photo */}
            <div className="relative h-[420px] lg:h-[560px] overflow-hidden">
              <Image
                src="https://res.cloudinary.com/dwsl2ktt2/image/upload/v1775440036/-1x-1_wipegu.webp"
                alt="Adwoa Mensah — Founder & CEO, Milehigh Properties"
                fill
                className="object-cover object-top"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
                unoptimized
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--obsidian)]/60 via-transparent to-transparent" />
              {/* Name card overlay */}
              <div className="absolute bottom-6 left-6 bg-[var(--obsidian)]/80 backdrop-blur-sm border border-[var(--gold)]/30 px-4 py-3">
                <p className="font-serif text-white text-lg font-light">Adwoa Mensah</p>
                <p className="text-[var(--gold)] text-[0.6rem] uppercase tracking-widest mt-0.5">Founder &amp; CEO</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="py-0 bg-[var(--surface)] border-b border-[var(--border)]">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-2 lg:grid-cols-4">
            {stats.map(({ icon: Icon, value, label }, i) => (
              <div
                key={label}
                className={`flex flex-col items-center justify-center py-8 gap-2 ${i < stats.length - 1 ? 'border-r border-[var(--border)]' : ''}`}
              >
                <Icon size={16} className="text-[var(--gold)]" />
                <p className="font-serif text-3xl font-light text-gold-gradient">{value}</p>
                <p className="section-label text-[0.55rem]">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Story ── */}
      <section className="py-24 px-6 lg:px-12 max-w-[1440px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <div>
            <p className="section-label mb-4">The Story</p>
            <h2 className="font-serif text-4xl font-light text-white mb-8">
              A life spent in<br />
              <span className="italic text-gold-gradient">pursuit of excellence</span>
            </h2>
            <div className="space-y-4 text-[var(--text-muted)] leading-relaxed text-sm">
              <p>
                Adwoa Mensah spent 15 years working in luxury hospitality across London, 
                Dubai, and Singapore before returning to Accra with a clear mission: 
                Ghana deserved better. Not just better accommodation — but the kind of 
                thoughtful, immersive hospitality experience she had witnessed globally.
              </p>
              <p>
                Starting with one villa in Cantonments and a team of three, she built 
                Milehigh Properties from the ground up — hand-selecting every piece of 
                furniture, personally curating every guest experience, and refusing to 
                compromise on a single detail.
              </p>
              <p>
                Today, The Palm at Ayi Mensah stands as her proudest achievement — 
                a serene, beautifully crafted home where the lush hills of Ghana 
                meet world-class luxury hospitality.
              </p>
            </div>
          </div>

          {/* Timeline */}
          <div className="relative">
            <div className="absolute left-[22px] top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-[var(--gold)] to-transparent opacity-30" />
            <div className="space-y-6">
              {timeline.map(({ year, event }) => (
                <div key={year} className="flex gap-6 group">
                  <div className="shrink-0 w-11 h-11 border border-[var(--border)] group-hover:border-[var(--gold)] flex items-center justify-center bg-[var(--surface)] relative z-10 transition-colors duration-300">
                    <span className="font-serif text-[0.6rem] text-[var(--gold)]">{year}</span>
                  </div>
                  <div className="pt-2.5">
                    <p className="text-white text-sm leading-relaxed">{event}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Values ── */}
      <section className="py-24 bg-[var(--surface)] border-y border-[var(--border)]">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
            <p className="section-label mb-4">What Drives Us</p>
            <h2 className="font-serif text-4xl font-light text-white">
              Our <span className="italic text-gold-gradient">Philosophy</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="border border-[var(--border)] p-6 hover:border-[var(--gold)] transition-colors duration-300 group">
                <Icon size={18} className="text-[var(--gold)] mb-4" />
                <h3 className="font-serif text-lg text-white mb-3">{title}</h3>
                <p className="text-[var(--text-muted)] text-xs leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20 px-6 lg:px-12 max-w-[1440px] mx-auto text-center">
        <p className="section-label mb-4">Begin Your Stay</p>
        <h2 className="font-serif text-4xl font-light text-white mb-4">
          Experience the <span className="italic text-gold-gradient">difference</span>
        </h2>
        <p className="text-[var(--text-muted)] mb-8 max-w-md mx-auto text-sm">
          Every stay at Milehigh Properties is a personal promise from Adwoa and her team — 
          that you will leave having experienced Ghana at its absolute finest.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/properties" className="btn-gold">Explore Properties</Link>
          <Link href="/contact" className="btn-ghost">Get in Touch</Link>
        </div>
      </section>
    </>
  );
}
