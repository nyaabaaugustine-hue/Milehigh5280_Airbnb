'use client';

import { useEffect, useRef, useState } from 'react';
import { Waves, ChefHat, Shield, Star, Clock, Globe } from 'lucide-react';
import { cn } from '@/lib/utils';

const experiences = [
  {
    Icon: Waves,
    title: 'Private Infinity Pools',
    desc: 'Every villa features a private pool — no sharing, no schedules. Just you and the water.',
  },
  {
    Icon: ChefHat,
    title: 'Personal Chef Service',
    desc: 'On-demand private chefs preparing world-class cuisine with Ghanaian flair and global influence.',
  },
  {
    Icon: Shield,
    title: 'Gated & Secure',
    desc: 'Each property is fully gated with dedicated security staff, so you can relax completely.',
  },
  {
    Icon: Star,
    title: 'Curated Concierge',
    desc: 'Our 24/7 concierge team handles everything — transfers, experiences, reservations, and more.',
  },
  {
    Icon: Clock,
    title: 'Flexible Arrivals',
    desc: 'Late arrivals? Early departures? Our team works around your schedule, always.',
  },
  {
    Icon: Globe,
    title: 'Global Standards',
    desc: 'Every property is inspected, certified, and maintained to the standard of a five-star hotel.',
  },
];

export default function Experience() {
  const ref = useRef<HTMLDivElement>(null);
  const [vis, setVis] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVis(true); observer.disconnect(); } },
      { threshold: 0.1 },
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="py-24 lg:py-36 px-6 lg:px-12 max-w-[1440px] mx-auto">
      <div ref={ref}>

        {/* ── Header ── */}
        <div className={cn(
          'flex flex-col lg:flex-row gap-8 items-start mb-20 transition-all duration-700',
          vis ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8',
        )}>
          <div className="lg:w-1/2">
            <p className="section-label mb-4">The Luxe Difference</p>
            <h2 className="font-serif font-light text-white leading-tight">
              Every Stay,<br />
              <span className="italic text-gold-gradient">Exceptional</span>
            </h2>
          </div>
          <div className="lg:w-1/2 lg:pt-8">
            <p className="text-[var(--text-muted)] leading-relaxed">
              We don&apos;t simply rent properties — we deliver private luxury hospitality experiences.
              From the moment you enquire to the moment you depart, every detail is orchestrated
              with the precision and care you deserve.
            </p>
          </div>
        </div>

        {/* ── Features Grid ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-[var(--border)]">
          {experiences.map(({ Icon, title, desc }, i) => (
            <div
              key={title}
              className={cn(
                'bg-[var(--surface)] p-8 lg:p-10 group hover:bg-[var(--surface-2)] transition-all duration-500',
                vis ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8',
              )}
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              <div className="w-12 h-12 border border-[var(--border)] flex items-center justify-center mb-6 group-hover:border-[var(--gold)] transition-colors duration-300">
                <Icon size={18} className="text-[var(--gold)]" />
              </div>
              <h3 className="font-serif text-xl font-light text-white mb-3 group-hover:text-[var(--gold)] transition-colors duration-300">
                {title}
              </h3>
              <p className="text-[var(--text-muted)] text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>

        {/* ── Image Band ── */}
        <div className={cn(
          'mt-20 grid grid-cols-3 gap-2 h-48 lg:h-64 overflow-hidden transition-all duration-700',
          vis ? 'opacity-100' : 'opacity-0',
        )} style={{ transitionDelay: '700ms' }}>
          {[
            'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=600&q=80',
            'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600&q=80',
            'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=600&q=80',
          ].map((src, i) => (
            <div key={i} className="relative overflow-hidden group">
              <img
                src={src}
                alt="Luxury property detail"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-obsidian/40 group-hover:bg-obsidian/10 transition-colors duration-500" />
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
