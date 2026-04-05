'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

// ─── All amenities to showcase ────────────────────────────────────────────────
const amenities = [
  { icon: '📶', label: 'High-Speed WiFi',          sub: 'Fibre connection',      image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=1200&q=80' },
  { icon: '❄️', label: 'Air Conditioning',         sub: 'Climate controlled',    image: 'https://images.unsplash.com/photo-1591010892230-679904990c74?w=1200&q=80' },
  { icon: '📺', label: 'Smart TV',                 sub: 'Netflix ready',         image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=1200&q=80' },
  { icon: '🍳', label: 'Fully Equipped Kitchen',   sub: 'Cook like home',        image: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=1200&q=80' },
  { icon: '🚗', label: 'Private Parking',          sub: 'Secure, on-site',       image: 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?w=1200&q=80' },
  { icon: '🔒', label: '24 / 7 Security',          sub: 'Gated & guarded',       image: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=1200&q=80' },
  { icon: '🫧', label: 'Washing Machine',           sub: 'In-unit laundry',       image: 'https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?w=1200&q=80' },
  { icon: '⚡', label: 'Backup Generator',          sub: 'Uninterrupted power',   image: 'https://images.unsplash.com/photo-1620714223084-8fcacc6dfd8d?w=1200&q=80' },
  { icon: '🌿', label: 'Tropical Garden',           sub: 'Peaceful outdoors',     image: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=1200&q=80' },
  { icon: '🚿', label: 'Hot Water',                sub: 'Instant heater',        image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=1200&q=80' },
  { icon: '🛏️', label: 'Premium Bedding',          sub: 'Hotel-quality linen',   image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=1200&q=80' },
  { icon: '🪴', label: 'Nature Views',             sub: 'Lush surroundings',     image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200&q=80' },
  { icon: '🔑', label: 'Self Check-In',            sub: 'Flexible arrivals',     image: 'https://images.unsplash.com/photo-1563298723-dcfebaa392e3?w=1200&q=80' },
  { icon: '☕', label: 'Coffee & Tea Station',     sub: 'Morning essentials',    image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1200&q=80' },
  { icon: '🛁', label: 'En-suite Bathrooms',       sub: 'Private & pristine',    image: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=1200&q=80' },
  { icon: '📍', label: 'Central Location',         sub: 'Ayi Mensah, Accra',     image: 'https://images.unsplash.com/photo-1523217582562-09d0def993a6?w=1200&q=80' },
  { icon: '🧹', label: 'Weekly Housekeeping',      sub: 'Fresh & tidy',          image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6958?w=1200&q=80' },
  { icon: '🎵', label: 'Bluetooth Speaker',        sub: 'Premium audio',         image: 'https://images.unsplash.com/photo-1589003077984-844e34be084d?w=1200&q=80' },
  { icon: '💡', label: 'Smart Lighting',           sub: 'Ambient control',       image: 'https://images.unsplash.com/photo-1550537687-c91072c4792d?w=1200&q=80' },
  { icon: '🌙', label: 'Quiet Neighbourhood',      sub: 'Restful nights',        image: 'https://images.unsplash.com/photo-1531265726475-52ad602c96ec?w=1200&q=80' },
];

// Duplicate so the marquee loops seamlessly
const doubled = [...amenities, ...amenities];

export default function AmenitiesMarquee() {
  const ref = useRef<HTMLDivElement>(null);
  const [vis, setVis] = useState(false);
  const [selected, setSelected] = useState<typeof amenities[0] | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVis(true); observer.disconnect(); } },
      { threshold: 0.1 },
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const openModal = useCallback((item: typeof amenities[0]) => {
    setSelected(item);
    document.body.style.overflow = 'hidden';
  }, []);

  const closeModal = useCallback(() => {
    setSelected(null);
    document.body.style.overflow = '';
  }, []);

  return (
    <section
      ref={ref}
      className="py-24 lg:py-32 overflow-hidden border-t border-[var(--border)]"
      aria-label="Amenities"
    >
      {/* ── Section Header ── */}
      <div
        className={cn(
          'max-w-[1440px] mx-auto px-6 lg:px-12 mb-14 transition-all duration-700',
          vis ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6',
        )}
      >
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

        {/* Gold divider */}
        <div className="flex items-center gap-4 mt-10">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent to-[var(--border)]" />
          <div className="w-1.5 h-1.5 rotate-45 bg-[var(--gold)] opacity-60" />
          <div className="flex-1 h-px bg-gradient-to-l from-transparent to-[var(--border)]" />
        </div>
      </div>

      {/* ── Marquee Row 1 — left to right ── */}
      <div
        className={cn(
          'relative mb-5 transition-all duration-700 delay-200',
          vis ? 'opacity-100' : 'opacity-0',
        )}
      >
        {/* Left / right fade masks */}
        <div className="absolute left-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
          style={{ background: 'linear-gradient(to right, var(--background), transparent)' }} />
        <div className="absolute right-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
          style={{ background: 'linear-gradient(to left, var(--background), transparent)' }} />

        <div className="overflow-hidden">
          <div className="marquee-track">
            {doubled.map((a, i) => (
              <AmenityCard 
                key={`r1-${i}`} 
                icon={a.icon} 
                label={a.label} 
                sub={a.sub} 
                onClick={() => openModal(a)} 
              />
            ))}
          </div>
        </div>
      </div>

      {/* ── Marquee Row 2 — right to left (reverse) ── */}
      <div
        className={cn(
          'relative transition-all duration-700 delay-300',
          vis ? 'opacity-100' : 'opacity-0',
        )}
      >
        <div className="absolute left-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
          style={{ background: 'linear-gradient(to right, var(--background), transparent)' }} />
        <div className="absolute right-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
          style={{ background: 'linear-gradient(to left, var(--background), transparent)' }} />

        <div className="overflow-hidden">
          <div className="marquee-track" style={{ animationDirection: 'reverse', animationDuration: '50s' }}>
            {[...doubled].reverse().map((a, i) => (
              <AmenityCard 
                key={`r2-${i}`} 
                icon={a.icon} 
                label={a.label} 
                sub={a.sub} 
                gold 
                onClick={() => openModal(a)} 
              />
            ))}
          </div>
        </div>
      </div>

      {/* ── Bottom CTA ── */}
      <div
        className={cn(
          'max-w-[1440px] mx-auto px-6 lg:px-12 mt-14 text-center transition-all duration-700 delay-500',
          vis ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4',
        )}
      >
        <p className="text-[var(--text-muted)] text-sm">
          And much more — all included in your stay at no extra charge.
        </p>
      </div>

      {/* ── Lightbox Popup ── */}
      <AnimatePresence>
        {selected && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 lg:p-12">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeModal}
              className="absolute inset-0 bg-obsidian/95 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-4xl bg-[var(--surface)] border border-[var(--border)] shadow-2xl overflow-hidden"
            >
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center bg-obsidian/60 hover:bg-obsidian text-white border border-[var(--border)] transition-colors"
              >
                <X size={18} />
              </button>
              <div className="grid grid-cols-1 lg:grid-cols-2">
                <div className="relative h-64 lg:h-[500px] overflow-hidden">
                  <Image 
                    src={selected.image} 
                    alt={selected.label} 
                    fill 
                    className="object-cover" 
                    unoptimized
                  />
                </div>
                <div className="p-8 lg:p-12 flex flex-col justify-center">
                  <span className="text-4xl mb-6 inline-block">{selected.icon}</span>
                  <p className="section-label mb-2">Amenity Details</p>
                  <h3 className="font-serif text-4xl text-white mb-4">{selected.label}</h3>
                  <p className="text-[var(--text-muted)] text-lg leading-relaxed mb-8">
                    Experience the highest standard of {selected.label.toLowerCase()} at Milehigh5280. 
                    We prioritize your {selected.sub.toLowerCase()} to ensure a truly world-class stay.
                  </p>
                  <button onClick={closeModal} className="btn-gold w-full lg:w-max px-12">Close</button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}

// ─── Individual amenity card ───────────────────────────────────────────────────
function AmenityCard({ icon, label, sub, gold, onClick }: {
  icon: string; label: string; sub: string; gold?: boolean; onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'shrink-0 flex items-center gap-3 px-5 py-3.5 border transition-all duration-300 cursor-default group',
        gold
          ? 'border-[var(--border-bright)] bg-[var(--surface)] hover:border-[var(--gold)] hover:bg-[rgba(201,150,58,0.05)]'
          : 'border-[var(--border)] bg-[var(--surface-2)] hover:border-[var(--gold)] hover:bg-[var(--surface)]',
      )}
      style={{ minWidth: '220px' }}
    >
      <span
        className="text-2xl shrink-0 transition-transform duration-500 group-hover:scale-125"
        role="img"
        aria-hidden="true"
      >
        {icon}
      </span>
      <div className="flex flex-col leading-tight">
        <span className="text-[var(--text-primary)] text-sm font-medium font-sans">{label}</span>
        <span className="text-[var(--text-subtle)] text-[0.65rem] tracking-wide mt-0.5">{sub}</span>
      </div>
      {/* gold accent dot */}
      <div className="ml-auto w-1 h-1 rounded-full bg-[var(--gold)] opacity-0 group-hover:opacity-100 transition-opacity duration-300 shrink-0" />
    </button>
  );
}
