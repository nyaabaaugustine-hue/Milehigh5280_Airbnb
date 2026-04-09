'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import Link from 'next/link';
import SafeImage from '@/components/ui/SafeImage';
import {
  Star, MapPin, Users, Bed, Bath, Wifi, Wind, Shield,
  ArrowRight, Phone, ChevronLeft, ChevronRight, Check,
  Zap, TreePalm, UtensilsCrossed, Car,
} from 'lucide-react';
import { getLiveProperties, formatCurrency, CONTACT_INFO } from '@/lib/data';
import { cn } from '@/lib/utils';

// ─── Quick icon map ────────────────────────────────────────────────────────────
const ICON_MAP: Record<string, React.ElementType> = {
  Wifi, Wind, Shield, Zap, TreePalm, UtensilsCrossed, Car,
};

// ─── Animated counter ─────────────────────────────────────────────────────────
function Counter({ to, suffix = '' }: { to: number; suffix?: string }) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started.current) {
        started.current = true;
        const dur = 1400;
        const start = performance.now();
        const tick = (now: number) => {
          const p = Math.min((now - start) / dur, 1);
          const eased = 1 - Math.pow(1 - p, 3);
          setVal(Math.round(eased * to));
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      }
    }, { threshold: 0.5 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [to]);

  return <span ref={ref}>{val}{suffix}</span>;
}

interface Props {
  onBookNow?: () => void;
  onViewProperty?: (p: ReturnType<typeof getLiveProperties>[0]) => void;
}

export default function FeaturedProperties({ onBookNow, onViewProperty }: Props) {
  const property = getLiveProperties()[0];
  const sectionRef = useRef<HTMLElement>(null);
  const [vis, setVis]         = useState(false);
  const [activeImg, setActiveImg] = useState(0);
  const [currency, setCurrency]   = useState<'USD' | 'GHS'>('USD');
  const [isAnimating, setIsAnimating] = useState(false);

  // Entrance animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVis(true); observer.disconnect(); } },
      { threshold: 0.08 },
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  // Auto-advance gallery
  useEffect(() => {
    if (!property) return;
    const t = setInterval(() => {
      setActiveImg(i => (i + 1) % property.images.length);
    }, 4200);
    return () => clearInterval(t);
  }, [property]);

  const goTo = useCallback((idx: number) => {
    if (isAnimating) return;
    setIsAnimating(true);
    setActiveImg(idx);
    setTimeout(() => setIsAnimating(false), 500);
  }, [isAnimating]);

  const prev = () => goTo((activeImg - 1 + (property?.images.length ?? 1)) % (property?.images.length ?? 1));
  const next = () => goTo((activeImg + 1) % (property?.images.length ?? 1));

  if (!property) return null;

  const price = currency === 'GHS'
    ? formatCurrency(property.pricing.perNightGHS, 'GHS')
    : formatCurrency(property.pricing.perNight, 'USD');

  const amenityIcons = [
    { Icon: Wifi,           label: 'High-Speed WiFi' },
    { Icon: Wind,           label: 'Air Conditioning' },
    { Icon: UtensilsCrossed,label: 'Full Kitchen' },
    { Icon: Shield,         label: '24/7 Security' },
    { Icon: Car,            label: 'Parking' },
    { Icon: Zap,            label: 'Generator' },
    { Icon: TreePalm,       label: 'Garden' },
  ];

  return (
    <section
      id="featured"
      ref={sectionRef}
      className="py-20 lg:py-32 overflow-hidden"
      aria-label="Featured property"
    >
      {/* ── Section label ── */}
      <div className={cn(
        'max-w-[1440px] mx-auto px-6 lg:px-12 mb-12 transition-all duration-700',
        vis ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6',
      )}>
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <p className="section-label mb-3">Our Signature Property</p>
            <h2 className="font-serif font-light text-white leading-tight">
              One Property.<br />
              <span className="italic text-gold-gradient">Infinite Comfort.</span>
            </h2>
          </div>
          {/* Currency toggle */}
          <button
            onClick={() => setCurrency(c => c === 'USD' ? 'GHS' : 'USD')}
            className="flex items-center gap-2 border border-[var(--border)] px-4 py-2 text-[var(--gold)] text-[0.7rem] tracking-widest uppercase hover:border-[var(--gold)] transition-colors duration-300"
          >
            <span className={cn('transition-opacity', currency === 'USD' ? 'opacity-100' : 'opacity-40')}>USD</span>
            <span className="text-[var(--text-subtle)]">/</span>
            <span className={cn('transition-opacity', currency === 'GHS' ? 'opacity-100' : 'opacity-40')}>GHS</span>
          </button>
        </div>
      </div>

      {/* ── Main feature block ── */}
      <div className={cn(
        'max-w-[1440px] mx-auto px-6 lg:px-12 transition-all duration-1000',
        vis ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12',
      )} style={{ transitionDelay: '150ms' }}>

        {/* ── Full-width editorial layout ── */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] xl:grid-cols-[1fr_480px] gap-0 border border-[var(--border)] bg-[var(--surface)]">

          {/* ── LEFT: Cinematic image gallery ── */}
          <div className="relative overflow-hidden" style={{ minHeight: '560px' }}>

            {/* Images */}
            {property.images.map((img, i) => (
              <div
                key={img.id}
                className="absolute inset-0 transition-opacity duration-700"
                style={{ opacity: i === activeImg ? 1 : 0 }}
                aria-hidden={i !== activeImg}
              >
                <SafeImage
                  src={img.url}
                  alt={img.alt}
                  fill
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  className="object-cover"
                  priority={i === 0}
                />
              </div>
            ))}

            {/* Dark gradient overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#080808]/90 via-[#080808]/20 to-transparent z-10 pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#080808]/30 to-transparent z-10 pointer-events-none" />

            {/* ── Editors Choice badge ── */}
            <div className="absolute top-6 left-6 z-20 flex items-center gap-2">
              <div className="bg-[var(--gold)] text-obsidian text-[0.6rem] tracking-[0.25em] uppercase font-bold px-3 py-1.5">
                Editor&apos;s Choice
              </div>
              <div className="flex items-center gap-1 bg-[#080808]/70 backdrop-blur-sm border border-[var(--border)] px-3 py-1.5">
                <Star size={11} className="fill-[var(--gold)] text-[var(--gold)]" />
                <span className="text-white text-[0.7rem] font-medium">{property.rating}</span>
                <span className="text-[var(--text-muted)] text-[0.65rem]">({property.reviewCount})</span>
              </div>
            </div>

            {/* ── Image counter ── */}
            <div className="absolute top-6 right-6 z-20 bg-[#080808]/70 backdrop-blur-sm border border-[var(--border)] px-3 py-1.5">
              <span className="text-[var(--gold)] text-[0.7rem] font-mono">{String(activeImg + 1).padStart(2, '0')}</span>
              <span className="text-[var(--text-subtle)] text-[0.7rem] font-mono"> / {String(property.images.length).padStart(2, '0')}</span>
            </div>

            {/* ── Bottom info overlaid on image ── */}
            <div className="absolute bottom-0 left-0 right-0 z-20 p-6 lg:p-8">

              {/* Location */}
              <div className="flex items-center gap-2 mb-3">
                <MapPin size={13} className="text-[var(--gold)]" />
                <span className="text-white/80 text-xs tracking-widest uppercase">{property.location.address}</span>
              </div>

              {/* Property name */}
              <h3 className="font-serif text-4xl lg:text-5xl font-light text-white mb-2 leading-tight">
                {property.name}
              </h3>
              <p className="text-white/60 text-sm mb-5 max-w-md leading-relaxed">
                {property.tagline}
              </p>

              {/* Quick specs row */}
              <div className="flex flex-wrap gap-4 mb-6">
                {[
                  { Icon: Users, val: `${property.capacity.guests} guests` },
                  { Icon: Bed,   val: `${property.capacity.bedrooms} bedrooms` },
                  { Icon: Bath,  val: `${property.capacity.bathrooms} bathrooms` },
                ].map(({ Icon, val }) => (
                  <div key={val} className="flex items-center gap-2 bg-[#080808]/60 backdrop-blur-sm border border-white/10 px-3 py-2">
                    <Icon size={13} className="text-[var(--gold)]" />
                    <span className="text-white text-xs">{val}</span>
                  </div>
                ))}
              </div>

              {/* Gallery nav + thumbnail strip */}
              <div className="flex items-center gap-3">
                <button
                  onClick={prev}
                  aria-label="Previous image"
                  className="w-9 h-9 flex items-center justify-center border border-white/20 text-white hover:border-[var(--gold)] hover:text-[var(--gold)] transition-all duration-300 bg-[#080808]/50 backdrop-blur-sm shrink-0"
                >
                  <ChevronLeft size={16} />
                </button>

                <div className="flex gap-1.5 overflow-x-auto flex-1" style={{ scrollbarWidth: 'none' }}>
                  {property.images.map((img, i) => (
                    <button
                      key={img.id}
                      onClick={() => goTo(i)}
                      aria-label={`View image ${i + 1}`}
                      className={cn(
                        'relative shrink-0 overflow-hidden border-2 transition-all duration-300',
                        i === activeImg
                          ? 'w-14 h-10 border-[var(--gold)] opacity-100'
                          : 'w-10 h-10 border-transparent opacity-50 hover:opacity-80 hover:border-white/30',
                      )}
                    >
                      <SafeImage src={img.url} alt="" fill className="object-cover" />
                    </button>
                  ))}
                </div>

                <button
                  onClick={next}
                  aria-label="Next image"
                  className="w-9 h-9 flex items-center justify-center border border-white/20 text-white hover:border-[var(--gold)] hover:text-[var(--gold)] transition-all duration-300 bg-[#080808]/50 backdrop-blur-sm shrink-0"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* ── RIGHT: Property detail panel ── */}
          <div className="flex flex-col border-t lg:border-t-0 lg:border-l border-[var(--border)] bg-[var(--surface)]">

            {/* Price header */}
            <div className="p-6 lg:p-8 border-b border-[var(--border)]">
              <div className="flex items-start justify-between gap-4 mb-1">
                <div>
                  <p className="section-label text-[0.55rem] mb-1">From</p>
                  <div className="font-serif text-4xl font-light text-white">
                    {price}
                    <span className="text-[var(--text-muted)] font-sans text-sm font-normal"> / night</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="section-label text-[0.55rem] mb-1">Min. Stay</p>
                  <p className="text-white text-lg font-serif font-light">{property.pricing.minNights} night</p>
                </div>
              </div>
              {/* Airbnb-style availability indicator */}
              <div className="flex items-center gap-2 mt-3">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-emerald-400 text-[0.65rem] tracking-widest uppercase font-medium">Available Now</span>
              </div>
            </div>

            {/* Stats — animated counters */}
            <div className="grid grid-cols-3 border-b border-[var(--border)]">
              {[
                { value: 38,  suffix: '+',  label: 'Reviews' },
                { value: 4,   suffix: '.9★', label: 'Rating' },
                { value: 100, suffix: '%',  label: 'Private' },
              ].map(({ value, suffix, label }, i) => (
                <div
                  key={label}
                  className={cn(
                    'py-5 text-center',
                    i < 2 && 'border-r border-[var(--border)]',
                  )}
                >
                  <p className="font-serif text-2xl text-white font-light">
                    <Counter to={value} suffix={suffix} />
                  </p>
                  <p className="section-label text-[0.55rem] mt-1">{label}</p>
                </div>
              ))}
            </div>

            {/* Description */}
            <div className="p-6 lg:p-8 border-b border-[var(--border)]">
              <p className="text-[var(--text-muted)] text-sm leading-relaxed">
                {property.description}
              </p>
            </div>

            {/* Amenities grid */}
            <div className="p-6 lg:p-8 border-b border-[var(--border)]">
              <p className="section-label text-[0.55rem] mb-4">What&apos;s Included</p>
              <div className="grid grid-cols-2 gap-2">
                {amenityIcons.map(({ Icon, label }) => (
                  <div key={label} className="flex items-center gap-2.5 group">
                    <div className="w-6 h-6 shrink-0 flex items-center justify-center border border-[var(--border)] group-hover:border-[var(--gold)] transition-colors duration-200">
                      <Icon size={11} className="text-[var(--gold)]" />
                    </div>
                    <span className="text-[var(--text-muted)] text-xs group-hover:text-white transition-colors duration-200">{label}</span>
                  </div>
                ))}
                <div className="flex items-center gap-2.5">
                  <div className="w-6 h-6 shrink-0 flex items-center justify-center border border-[var(--border)] border-dashed">
                    <span className="text-[var(--gold)] text-[0.6rem] font-bold">+3</span>
                  </div>
                  <span className="text-[var(--text-subtle)] text-xs">more included</span>
                </div>
              </div>
            </div>

            {/* Key features */}
            <div className="px-6 lg:px-8 pb-6 border-b border-[var(--border)]">
              <div className="flex flex-col gap-2 pt-5">
                {property.features.slice(0, 4).map(f => (
                  <div key={f} className="flex items-center gap-2.5">
                    <Check size={12} className="text-[var(--gold)] shrink-0" />
                    <span className="text-[var(--text-muted)] text-xs">{f}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* CTAs */}
            <div className="p-6 lg:p-8 mt-auto space-y-3">
              <button
                onClick={() => onViewProperty?.(property)}
                className="btn-gold w-full justify-center gap-2"
              >
                <Phone size={13} />
                Reserve Now
              </button>

              <Link
                href={`/properties/${property.slug}`}
                className="btn-ghost w-full justify-center gap-2"
              >
                View Full Details
                <ArrowRight size={13} />
              </Link>

              <a
                href={`https://wa.me/${CONTACT_INFO.whatsapp}?text=${encodeURIComponent("Hello, I'd like to book Milehigh5280 in Ayi Mensah")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-2 text-[0.65rem] tracking-widest uppercase text-[#25D366] hover:text-white transition-colors duration-300"
              >
                <svg viewBox="0 0 24 24" className="w-3 h-3 fill-current" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                Or enquire via WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* ── Bottom strip — horizontal scrolling detail bar ── */}
      <div className={cn(
        'max-w-[1440px] mx-auto px-6 lg:px-12 mt-4 transition-all duration-1000',
        vis ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8',
      )} style={{ transitionDelay: '400ms' }}>
        <div className="grid grid-cols-2 sm:grid-cols-4 border border-[var(--border)] border-t-0 bg-[var(--surface-2)]">
          {[
            { num: '2',    unit: 'Bedrooms',   icon: '🛏️' },
            { num: '1',    unit: 'Bathrooms',  icon: '🚿' },
            { num: '4',    unit: 'Max Guests', icon: '👥' },
            { num: '~20', unit: 'Min to CBD',  icon: '🚗' },
          ].map(({ num, unit, icon }, i) => (
            <div
              key={unit}
              className={cn(
                'flex items-center gap-4 px-6 py-5 group hover:bg-[var(--surface)] transition-colors duration-300',
                i < 3 && 'border-r border-[var(--border)]',
              )}
            >
              <span className="text-2xl shrink-0">{icon}</span>
              <div>
                <p className="font-serif text-2xl text-white font-light leading-none">{num}</p>
                <p className="section-label text-[0.55rem] mt-1">{unit}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </section>
  );
}
