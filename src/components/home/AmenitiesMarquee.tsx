'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { X, Wifi, Wind, MonitorPlay, UtensilsCrossed, Car, Shield, Shirt, Zap, TreePalm, Droplets, Bed, Lamp, Coffee, Bath, MapPin, Sparkles, Music, Lightbulb, Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import SafeImage from '@/components/ui/SafeImage';

// ─── All amenities to showcase ────────────────────────────────────────────────
const amenities = [
  { Icon: Wifi,            label: 'High-Speed WiFi',          sub: 'Fibre connection',      image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=1200&q=80' },
  { Icon: Wind,            label: 'Air Conditioning',         sub: 'Climate controlled',    image: 'https://images.unsplash.com/photo-1591010892230-679904990c74?w=1200&q=80' },
  { Icon: MonitorPlay,     label: 'Smart TV',                 sub: 'Netflix ready',         image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=1200&q=80' },
  { Icon: UtensilsCrossed, label: 'Fully Equipped Kitchen',   sub: 'Cook like home',        image: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=1200&q=80' },
  { Icon: Car,             label: 'Private Parking',          sub: 'Secure, on-site',       image: 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?w=1200&q=80' },
  { Icon: Shield,          label: '24 / 7 Security',          sub: 'Gated & guarded',       image: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=1200&q=80' },
  { Icon: Shirt,           label: 'Washing Machine',           sub: 'In-unit laundry',       image: 'https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?w=1200&q=80' },
  { Icon: Zap,             label: 'Backup Generator',          sub: 'Uninterrupted power',   image: 'https://images.unsplash.com/photo-1620714223084-8fcacc6dfd8d?w=1200&q=80' },
  { Icon: TreePalm,        label: 'Tropical Garden',           sub: 'Peaceful outdoors',     image: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=1200&q=80' },
  { Icon: Droplets,        label: 'Hot Water',                sub: 'Instant heater',        image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=1200&q=80' },
  { Icon: Bed,             label: 'Premium Bedding',          sub: 'Hotel-quality linen',   image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=1200&q=80' },
  { Icon: Lamp,            label: 'Nature Views',             sub: 'Lush surroundings',     image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200&q=80' },
  { Icon: Sparkles,        label: 'Self Check-In',            sub: 'Flexible arrivals',     image: 'https://images.unsplash.com/photo-1563298723-dcfebaa392e3?w=1200&q=80' },
  { Icon: Coffee,          label: 'Coffee & Tea Station',     sub: 'Morning essentials',    image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1200&q=80' },
  { Icon: Bath,            label: 'En-suite Bathrooms',       sub: 'Private & pristine',    image: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=1200&q=80' },
  { Icon: MapPin,          label: 'Central Location',         sub: 'Ayi Mensah, Accra',     image: 'https://images.unsplash.com/photo-1523217582562-09d0def993a6?w=1200&q=80' },
  { Icon: Sparkles,        label: 'Weekly Housekeeping',      sub: 'Fresh & tidy',          image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6958?w=1200&q=80' },
  { Icon: Music,           label: 'Bluetooth Speaker',        sub: 'Premium audio',         image: 'https://images.unsplash.com/photo-1589003077984-844e34be084d?w=1200&q=80' },
  { Icon: Lightbulb,       label: 'Smart Lighting',           sub: 'Ambient control',       image: 'https://images.unsplash.com/photo-1550537687-c91072c4792d?w=1200&q=80' },
  { Icon: Moon,            label: 'Quiet Neighbourhood',      sub: 'Restful nights',        image: 'https://images.unsplash.com/photo-1531265726475-52ad602c96ec?w=1200&q=80' },
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
          <div className="marquee-track" style={{ animationDuration: '120s' }}> {/* Ensure duration is applied */}
            {doubled.map((a, i) => (
              <AmenityCard
                key={`r1-${i}`}
                Icon={a.Icon}
                label={a.label}
                sub={a.sub} 
                image={a.image}
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
          <div className="marquee-track" style={{ animationDirection: 'reverse', animationDuration: '120s' }}>
            {[...doubled].reverse().map((a, i) => (
              <AmenityCard
                key={`r2-${i}`}
                Icon={a.Icon}
                label={a.label}
                sub={a.sub}
                image={a.image}
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
              <div className="grid grid-cols-1 lg:grid-cols-2 items-stretch">
                <div className="relative h-64 lg:h-[500px] overflow-hidden">
                  <motion.div
                    initial={{ scale: 1.15 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 1.2, ease: [0.2, 0.8, 0.2, 1] }}
                    className="w-full h-full relative"
                  >
                    <SafeImage
                      src={selected.image}
                      alt={selected.label}
                      fill
                      className="object-cover"
                    />
                  </motion.div>
                </div>
                <div className="p-8 lg:p-12 flex flex-col justify-center">
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                  >
                    <selected.Icon size={40} className="text-[var(--gold)] mb-6" />
                    <p className="section-label mb-2">Amenity Details</p>
                    <h3 className="font-serif text-4xl text-white mb-4">{selected.label}</h3>
                    <p className="text-[var(--text-muted)] text-lg leading-relaxed mb-8">
                      Experience the highest standard of {selected.label.toLowerCase()} at Milehigh5280.
                      We prioritize {selected.sub.toLowerCase()} to ensure a truly world-class stay.
                    </p>
                    <button onClick={closeModal} className="btn-gold w-full lg:w-max px-12">Close</button>
                  </motion.div>
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
function AmenityCard({ Icon, label, sub, image, gold, onClick }: {
  Icon: any; label: string; sub: string; image: string; gold?: boolean; onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="shrink-0 relative w-72 h-44 overflow-hidden group border border-[var(--border)] hover:border-[var(--gold)] transition-colors duration-500"
    >
      <SafeImage 
        src={image} 
        alt={label} 
        fill 
        className="object-cover transition-transform duration-1000 group-hover:scale-110" 
      />
      <div className="absolute inset-0 bg-obsidian/65 group-hover:bg-obsidian/45 transition-colors duration-500" />
      
      <div className="absolute inset-0 p-6 flex flex-col justify-end items-start text-left">
        <div className="text-[var(--gold)] mb-3 transition-transform duration-500 group-hover:scale-110">
          <Icon size={24} />
        </div>
        <p className="text-white text-sm font-medium font-sans tracking-wide">{label}</p>
        <p className="text-white/60 text-[0.65rem] tracking-widest uppercase mt-1">{sub}</p>
      </div>
    </button>
  );
}
