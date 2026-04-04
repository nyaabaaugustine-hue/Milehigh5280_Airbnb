'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { Star, Quote } from 'lucide-react';
import { properties } from '@/lib/data';
import { cn } from '@/lib/utils';

// Gather all reviews
const allReviews = properties.flatMap(p =>
  p.reviews.map(r => ({ ...r, propertyName: p.name }))
);

export default function Testimonials() {
  const ref = useRef<HTMLDivElement>(null);
  const [vis, setVis] = useState(false);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVis(true); observer.disconnect(); } },
      { threshold: 0.1 },
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  // Auto-rotate
  useEffect(() => {
    const t = setInterval(() => setActive(a => (a + 1) % allReviews.length), 5500);
    return () => clearInterval(t);
  }, []);

  const current = allReviews[active];

  return (
    <section className="py-24 lg:py-36 bg-[var(--surface)] border-y border-[var(--border)]">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12" ref={ref}>

        {/* ── Header ── */}
        <div className={cn(
          'text-center mb-16 transition-all duration-700',
          vis ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8',
        )}>
          <p className="section-label mb-4">Guest Voices</p>
          <h2 className="font-serif font-light text-white">
            Words from <span className="italic text-gold-gradient">Our Guests</span>
          </h2>
          <div className="divider-gold mt-6" />
        </div>

        {/* ── Stars Row ── */}
        <div className={cn(
          'flex justify-center gap-1.5 mb-12 transition-all duration-700',
          vis ? 'opacity-100' : 'opacity-0',
        )} style={{ transitionDelay: '200ms' }}>
          {[1,2,3,4,5].map(i => (
            <Star key={i} size={20} className="fill-[var(--gold)] text-[var(--gold)]" />
          ))}
        </div>

        {/* ── Active Testimonial ── */}
        <div
          className={cn(
            'max-w-3xl mx-auto text-center transition-all duration-700',
            vis ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8',
          )}
          style={{ transitionDelay: '300ms' }}
          key={active}
        >
          <Quote size={36} className="text-[var(--gold)] opacity-30 mx-auto mb-6" />

          <blockquote className="font-serif text-xl lg:text-3xl font-light text-white leading-relaxed italic mb-8"
            style={{ animation: 'fadeIn 0.6s ease forwards' }}
          >
            &ldquo;{current.comment}&rdquo;
          </blockquote>

          {/* Author */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="relative w-12 h-12 rounded-full overflow-hidden border border-[var(--border-bright)]">
              <Image
                src={current.avatar}
                alt={current.author}
                fill
                className="object-cover"
              />
            </div>
            <div className="text-left">
              <p className="text-white font-medium text-sm">{current.author}</p>
              <p className="text-[var(--text-muted)] text-xs">{current.country} · {current.stayDuration} at {current.propertyName}</p>
            </div>
          </div>
        </div>

        {/* ── Dots Navigation ── */}
        <div className="flex justify-center gap-2">
          {allReviews.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              aria-label={`View review ${i + 1}`}
              className={cn(
                'transition-all duration-300',
                i === active
                  ? 'w-8 h-1.5 bg-[var(--gold)]'
                  : 'w-1.5 h-1.5 bg-[var(--surface-3)] hover:bg-[var(--gold)] opacity-60',
              )}
            />
          ))}
        </div>

        {/* ── Rating badges ── */}
        <div className={cn(
          'grid grid-cols-2 lg:grid-cols-4 gap-6 mt-16 pt-16 border-t border-[var(--border)] transition-all duration-700',
          vis ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8',
        )} style={{ transitionDelay: '500ms' }}>
          {[
            { label: 'Overall Rating',   value: '4.97 / 5' },
            { label: 'Cleanliness',      value: '5.0 / 5' },
            { label: 'Communication',    value: '4.9 / 5' },
            { label: 'Value',            value: '4.9 / 5' },
          ].map(({ label, value }) => (
            <div key={label} className="text-center p-6 border border-[var(--border)] hover:border-[var(--gold)] transition-colors duration-300">
              <p className="font-serif text-3xl font-light text-white mb-1">{value}</p>
              <p className="section-label text-[0.6rem]">{label}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
