'use client';

import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

const PRESS_MENTIONS = [
  { name: 'Ghana Business & Financial Times', abbr: 'B&FT',        emoji: '📰' },
  { name: 'CitiFM 97.3',                      abbr: 'CitiFM',      emoji: '📻' },
  { name: 'Joy News Ghana',                   abbr: 'Joy News',    emoji: '📺' },
  { name: 'The Ghana Report',                 abbr: 'Ghana Report',emoji: '🗞️' },
  { name: 'Forbes Africa',                    abbr: 'Forbes Africa',emoji: '🌍' },
  { name: 'CNN Travel',                       abbr: 'CNN Travel',   emoji: '✈️' },
];

export default function PressSection() {
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
    <section
      ref={ref}
      className="py-16 lg:py-24 border-b border-[var(--border)] bg-[var(--surface)]"
      aria-label="Press mentions"
    >
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">

        {/* Header */}
        <div className={cn(
          'text-center mb-12 transition-all duration-700',
          vis ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6',
        )}>
          <p className="section-label mb-3">As Seen In</p>
          <h2 className="font-serif text-2xl lg:text-3xl font-light text-white">
            Featured <span className="italic text-gold-gradient">In The Press</span>
          </h2>
          <div className="divider-gold mt-4" />
        </div>

        {/* Logos Row */}
        <div className="flex flex-wrap justify-center items-center gap-4 lg:gap-6">
          {PRESS_MENTIONS.map(({ name, abbr, emoji }, i) => (
            <div
              key={name}
              className={cn(
                'flex items-center gap-2.5 px-5 py-3 border border-[var(--border)] hover:border-[var(--gold)] transition-all duration-500 group cursor-default',
                vis ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4',
              )}
              style={{ transitionDelay: `${i * 80}ms` }}
              title={name}
            >
              <span className="text-lg" aria-hidden="true">{emoji}</span>
              <span className="text-[0.65rem] uppercase tracking-[0.18em] font-sans font-semibold text-[var(--text-muted)] group-hover:text-[var(--gold)] transition-colors duration-300 whitespace-nowrap">
                {abbr}
              </span>
            </div>
          ))}
        </div>

        <p className={cn(
          'text-center text-[0.6rem] uppercase tracking-widest text-[var(--text-subtle)] mt-8 transition-all duration-700',
          vis ? 'opacity-100' : 'opacity-0',
        )} style={{ transitionDelay: '500ms' }}>
          Recognised as Ghana&apos;s premier luxury short-stay experience
        </p>
      </div>
    </section>
  );
}
