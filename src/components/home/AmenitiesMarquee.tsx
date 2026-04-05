'use client';

import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

const amenities = [
  {
    icon: '📶', label: 'High-Speed WiFi',        sub: 'Fibre connection',
    img: 'https://res.cloudinary.com/dwsl2ktt2/image/upload/v1775296671/5_yc05lt.jpg',
  },
  {
    icon: '❄️', label: 'Air Conditioning',        sub: 'Climate controlled',
    img: 'https://res.cloudinary.com/dwsl2ktt2/image/upload/v1775296671/1_ijqfai.jpg',
  },
  {
    icon: '📺', label: 'Smart TV',                sub: 'Netflix ready',
    img: 'https://res.cloudinary.com/dwsl2ktt2/image/upload/v1775296671/3_wgur1l.jpg',
  },
  {
    icon: '🍳', label: 'Fully Equipped Kitchen',  sub: 'Cook like home',
    img: 'https://res.cloudinary.com/dwsl2ktt2/image/upload/v1775296671/2_xvzt1y.jpg',
  },
  {
    icon: '🚗', label: 'Private Parking',         sub: 'Secure, on-site',
    img: 'https://res.cloudinary.com/dwsl2ktt2/image/upload/v1775296671/6_ffo1ly.jpg',
  },
  {
    icon: '🔒', label: '24/7 Security',           sub: 'Gated & guarded',
    img: 'https://res.cloudinary.com/dwsl2ktt2/image/upload/v1775296671/4_xgzoyo.jpg',
  },
  {
    icon: '🫧', label: 'Washing Machine',          sub: 'In-unit laundry',
    img: 'https://res.cloudinary.com/dwsl2ktt2/image/upload/v1775296670/7_wv1u9h.jpg',
  },
  {
    icon: '⚡', label: 'Backup Generator',         sub: 'Uninterrupted power',
    img: 'https://res.cloudinary.com/dwsl2ktt2/image/upload/v1775302731/A_2_kwg4sf.jpg',
  },
  {
    icon: '🌿', label: 'Tropical Garden',          sub: 'Peaceful outdoors',
    img: 'https://res.cloudinary.com/dwsl2ktt2/image/upload/v1775302731/A_4_pmp0ha.jpg',
  },
  {
    icon: '🚿', label: 'Hot Water',               sub: 'Instant heater',
    img: 'https://res.cloudinary.com/dwsl2ktt2/image/upload/v1775302732/A_5_q0jfae.jpg',
  },
  {
    icon: '🛏️', label: 'Premium Bedding',         sub: 'Hotel-quality linen',
    img: 'https://res.cloudinary.com/dwsl2ktt2/image/upload/v1775302732/A_3_dcbuqu.jpg',
  },
  {
    icon: '🪴', label: 'Nature Views',            sub: 'Lush surroundings',
    img: 'https://res.cloudinary.com/dwsl2ktt2/image/upload/v1775296671/5_yc05lt.jpg',
  },
  {
    icon: '🔑', label: 'Self Check-In',           sub: 'Flexible arrivals',
    img: 'https://res.cloudinary.com/dwsl2ktt2/image/upload/v1775296671/1_ijqfai.jpg',
  },
  {
    icon: '☕', label: 'Coffee & Tea Station',    sub: 'Morning essentials',
    img: 'https://res.cloudinary.com/dwsl2ktt2/image/upload/v1775296671/3_wgur1l.jpg',
  },
  {
    icon: '🛁', label: 'En-suite Bathrooms',      sub: 'Private & pristine',
    img: 'https://res.cloudinary.com/dwsl2ktt2/image/upload/v1775296671/4_xgzoyo.jpg',
  },
  {
    icon: '📍', label: 'Central Location',        sub: 'Ayi Mensah, Accra',
    img: 'https://res.cloudinary.com/dwsl2ktt2/image/upload/v1775296671/2_xvzt1y.jpg',
  },
  {
    icon: '🧹', label: 'Weekly Housekeeping',     sub: 'Fresh & tidy',
    img: 'https://res.cloudinary.com/dwsl2ktt2/image/upload/v1775302731/A_2_kwg4sf.jpg',
  },
  {
    icon: '🎵', label: 'Bluetooth Speaker',       sub: 'Premium audio',
    img: 'https://res.cloudinary.com/dwsl2ktt2/image/upload/v1775302732/A_3_dcbuqu.jpg',
  },
  {
    icon: '💡', label: 'Smart Lighting',          sub: 'Ambient control',
    img: 'https://res.cloudinary.com/dwsl2ktt2/image/upload/v1775296671/6_ffo1ly.jpg',
  },
  {
    icon: '🌙', label: 'Quiet Neighbourhood',     sub: 'Restful nights',
    img: 'https://res.cloudinary.com/dwsl2ktt2/image/upload/v1775296670/7_wv1u9h.jpg',
  },
];

const doubled  = [...amenities, ...amenities];
const reversed = [...doubled].reverse();

export default function AmenitiesMarquee() {
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
      className="py-24 lg:py-32 overflow-hidden border-t border-[var(--border)]"
      aria-label="Amenities"
    >
      {/* ── Header ── */}
      <div className={cn(
        'max-w-[1440px] mx-auto px-6 lg:px-12 mb-14 transition-all duration-700',
        vis ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6',
      )}>
        <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-4">
          <div>
            <p className="section-label mb-3">Everything Included</p>
            <h2 className="font-serif font-light text-[var(--text-primary)] leading-tight">
              Amenities &amp;<br />
              <span className="italic text-gold-gradient">Comforts</span>
            </h2>
          </div>
          <p className="text-[var(--text-muted)] text-sm max-w-xs leading-relaxed">
            Every detail thoughtfully provided — so you can arrive, unwind, and feel instantly at home.
          </p>
        </div>
        <div className="flex items-center gap-4 mt-10">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent to-[var(--border)]" />
          <div className="w-1.5 h-1.5 rotate-45 bg-[var(--gold)] opacity-60" />
          <div className="flex-1 h-px bg-gradient-to-l from-transparent to-[var(--border)]" />
        </div>
      </div>

      {/* ── Row 1 — left to right ── */}
      <MarqueeRow
        items={doubled}
        rowKey="r1"
        reverse={false}
        visible={vis}
        delay="delay-200"
        gold={false}
      />

      {/* ── Row 2 — right to left ── */}
      <div className="mt-4">
        <MarqueeRow
          items={reversed}
          rowKey="r2"
          reverse={true}
          visible={vis}
          delay="delay-300"
          gold={true}
        />
      </div>

      {/* ── Row 3 — left to right slow ── */}
      <div className="mt-4">
        <MarqueeRow
          items={doubled}
          rowKey="r3"
          reverse={false}
          visible={vis}
          delay="delay-500"
          gold={false}
          slow
        />
      </div>

      {/* ── Bottom note ── */}
      <div className={cn(
        'max-w-[1440px] mx-auto px-6 lg:px-12 mt-14 text-center transition-all duration-700 delay-700',
        vis ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4',
      )}>
        <p className="text-[var(--text-muted)] text-sm italic">
          And much more — all included in your stay at no extra charge.
        </p>
      </div>
    </section>
  );
}

// ─── Marquee row ───────────────────────────────────────────────────────────────
function MarqueeRow({
  items, rowKey, reverse, visible, delay, gold, slow,
}: {
  items: typeof amenities;
  rowKey: string;
  reverse: boolean;
  visible: boolean;
  delay: string;
  gold: boolean;
  slow?: boolean;
}) {
  return (
    <div className={cn('relative transition-all duration-700', delay, visible ? 'opacity-100' : 'opacity-0')}>
      {/* Edge fade masks */}
      <div
        className="absolute left-0 top-0 bottom-0 w-32 z-10 pointer-events-none"
        style={{ background: 'linear-gradient(to right, var(--obsidian, #080808), transparent)' }}
      />
      <div
        className="absolute right-0 top-0 bottom-0 w-32 z-10 pointer-events-none"
        style={{ background: 'linear-gradient(to left, var(--obsidian, #080808), transparent)' }}
      />

      <div className="overflow-hidden">
        <div
          className="marquee-track"
          style={{
            animationDirection: reverse ? 'reverse' : 'normal',
            animationDuration: slow ? '80s' : '55s',
          }}
        >
          {items.map((a, i) => (
            <AmenityCard
              key={`${rowKey}-${i}`}
              icon={a.icon}
              label={a.label}
              sub={a.sub}
              img={a.img}
              gold={gold}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Individual card with background image ────────────────────────────────────
function AmenityCard({
  icon, label, sub, img, gold,
}: {
  icon: string; label: string; sub: string; img: string; gold?: boolean;
}) {
  return (
    <div
      className={cn(
        'shrink-0 relative overflow-hidden border transition-all duration-500 cursor-default group',
        gold
          ? 'border-[var(--border-bright)] hover:border-[var(--gold)]'
          : 'border-[var(--border)] hover:border-[var(--gold)]',
      )}
      style={{ minWidth: '240px', height: '110px' }}
    >
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
        style={{ backgroundImage: `url(${img})` }}
      />
      {/* Dark overlay — slightly lifted on hover */}
      <div className="absolute inset-0 bg-[#080808]/70 group-hover:bg-[#080808]/50 transition-colors duration-500" />
      {/* Gold shimmer line at top on hover */}
      <div className="absolute top-0 left-0 right-0 h-px bg-[var(--gold)] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Content */}
      <div className="relative z-10 h-full flex items-center gap-3 px-5">
        <span
          className="text-2xl shrink-0 drop-shadow-lg transition-transform duration-300 group-hover:scale-125"
          role="img"
          aria-hidden="true"
        >
          {icon}
        </span>
        <div className="flex flex-col leading-tight">
          <span className="text-white text-sm font-medium font-sans drop-shadow-sm">{label}</span>
          <span className="text-white/60 text-[0.65rem] tracking-wide mt-0.5 drop-shadow-sm">{sub}</span>
        </div>
        {/* Gold dot */}
        <div className="ml-auto w-1.5 h-1.5 rounded-full bg-[var(--gold)] opacity-0 group-hover:opacity-100 transition-opacity duration-300 shrink-0" />
      </div>
    </div>
  );
}
