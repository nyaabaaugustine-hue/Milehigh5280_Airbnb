import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Star, Award, Heart, Users, Globe, CheckCircle, Phone } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Meet Your Host | Milehigh Properties',
  description: 'Meet Herbert Prempeh, founder of Milehigh Properties — curating Ghana\'s finest luxury short-stay experiences in Ayi Mensah, Accra.',
  openGraph: {
    title: 'Meet Your Host — Herbert Prempeh | Milehigh Properties',
    description: 'The story behind Ghana\'s most personalised luxury rental experience.',
    url: 'https://thepalmayimensah.com/host',
    images: [{ url: 'https://res.cloudinary.com/dwsl2ktt2/image/upload/v1775296671/logo_xcjkpn.jpg', width: 800, height: 800 }],
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
    desc: 'I am not a faceless corporation. I am reachable, responsive, and personally invested in the quality of every single guest experience.',
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
                Herbert<br />
                <span className="italic text-gold-gradient">Prempeh</span>
              </h1>
              <p className="text-[var(--text-muted)] text-lg font-light leading-relaxed mb-4">
                Founder &amp; Host, Milehigh Properties
              </p>
              <div className="divider-gold mb-8" />
              <p className="text-[var(--text-muted)] leading-relaxed max-w-xl">
                Born and raised in Accra, I have spent the better part of a decade curating stays that feel 
                less like rental accommodation and more like coming home to the best version of Ghana — 
                unhurried, beautifully designed, and deeply hospitable.
              </p>
            </div>

            {/* Photo */}
            <div className="relative h-[420px] lg:h-[560px] overflow-hidden">
              <Image
                src="https://res.cloudinary.com/dwsl2ktt2/image/upload/v1775296671/logo_xcjkpn.jpg"
                alt="Herbert Prempeh — Founder, Milehigh Properties"
                fill
                className="object-cover object-center"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--obsidian)]/60 via-transparent to-transparent" />
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
                className="flex flex-col items-center justify-center py-10 border-r border-b lg:border-b-0 border-[var(--border)] last:border-r-0 even:border-r-0 lg:even:border-r gap-3 hover:bg-[var(--surface-2)] transition-colors duration-300 group"
              >
                <Icon size={20} className="text-[var(--gold)] opacity-70 group-hover:opacity-100 transition-opacity" />
                <p className="font-serif text-3xl font-light text-white">{value}</p>
                <p className="section-label text-[0.55rem]">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Story ── */}
      <section className="py-24 lg:py-36 bg-[var(--obsidian)]">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-16">
            <div>
              <p className="section-label mb-4">The Story</p>
              <h2 className="font-serif text-4xl lg:text-5xl font-light text-white leading-tight">
                Why I Do<br /><span className="italic text-gold-gradient">This</span>
              </h2>
              <div className="divider-gold mt-6" />
            </div>
            <div className="space-y-6 text-[var(--text-muted)] leading-relaxed text-lg font-light">
              <p>
                Ghana is one of the most beautiful countries on earth — yet for too long, visitors arriving 
                with high expectations found accommodation that fell frustratingly short. I started Milehigh 
                Properties because I believed that was fixable.
              </p>
              <p>
                The Palm at Ayi Mensah is the embodiment of that belief. Nestled in the lush eastern hills 
                of Greater Accra, it offers the quietude of countryside living without sacrificing any of the 
                comforts a modern traveller expects — fast wifi, a fully equipped kitchen, premium linens, 
                curated local art on every wall.
              </p>
              <p>
                Every guest who stays with us is greeted as family. I personally review every booking, 
                respond to every inquiry, and ensure the property is presented immaculately before every 
                arrival. That level of care is not scalable — and that is exactly the point.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Values ── */}
      <section className="py-24 lg:py-32 bg-[var(--surface)] border-y border-[var(--border)]">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
            <p className="section-label mb-4">What I Stand For</p>
            <h2 className="font-serif text-4xl font-light text-white">
              Hosting <span className="italic text-gold-gradient">Philosophy</span>
            </h2>
            <div className="divider-gold mt-6" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {values.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="p-8 border border-[var(--border)] hover:border-[var(--gold)] transition-all duration-500 group bg-[var(--surface-2)]">
                <div className="w-12 h-12 border border-[var(--border)] group-hover:border-[var(--gold)] flex items-center justify-center mb-6 transition-colors duration-300">
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
      <section className="py-24 lg:py-32 bg-[var(--obsidian)]">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
            <p className="section-label mb-4">The Journey</p>
            <h2 className="font-serif text-4xl font-light text-white">
              Milehigh <span className="italic text-gold-gradient">Milestones</span>
            </h2>
          </div>
          <div className="max-w-2xl mx-auto space-y-0">
            {timeline.map(({ year, event }, i) => (
              <div key={year} className="flex gap-8 group">
                <div className="flex flex-col items-center">
                  <div className="w-3 h-3 rounded-full bg-[var(--gold)] mt-1.5 group-hover:scale-125 transition-transform duration-300 shrink-0" />
                  {i < timeline.length - 1 && <div className="w-px flex-1 bg-[var(--border)] mt-2" />}
                </div>
                <div className="pb-10">
                  <p className="section-label text-[0.55rem] mb-2">{year}</p>
                  <p className="text-[var(--text-muted)] leading-relaxed">{event}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 lg:py-32 bg-[var(--surface)] border-t border-[var(--border)] text-center">
        <div className="max-w-2xl mx-auto px-6">
          <p className="section-label mb-4">Ready to Visit?</p>
          <h2 className="font-serif text-4xl lg:text-5xl font-light text-white mb-6">
            I Would Love to <span className="italic text-gold-gradient">Host You</span>
          </h2>
          <p className="text-[var(--text-muted)] mb-10 leading-relaxed">
            Whether you are visiting Accra for business, leisure, or to reconnect with Ghana, 
            The Palm offers the warmest welcome in Ayi Mensah.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/booking" className="btn-gold">
              Reserve Your Stay
            </Link>
            <Link href="/contact" className="btn-ghost">
              <Phone size={14} />
              Get in Touch
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
