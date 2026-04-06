'use client';

import { useEffect, useState } from 'react';
import SafeImage from '@/components/ui/SafeImage';
import { motion } from 'framer-motion';
import { ArrowDown } from 'lucide-react';
import { CONTACT_INFO } from '@/lib/data';

const slides = [
  { src: 'https://res.cloudinary.com/dwsl2ktt2/image/upload/v1775380288/1_qwgwqd.png',   alt: 'The Palm - Premium Exterior' },
  { src: 'https://res.cloudinary.com/dwsl2ktt2/image/upload/v1775302732/A_3_dcbuqu.jpg', alt: 'The Palm - Luxury Detail' },
  { src: 'https://res.cloudinary.com/dwsl2ktt2/image/upload/v1775380667/ERR_jjr2hx.jpg', alt: 'The Palm - Scenic View' },
  { src: 'https://res.cloudinary.com/dwsl2ktt2/image/upload/v1775296671/5_yc05lt.jpg',   alt: 'The Palm - Stylish Living Room' },
  { src: 'https://res.cloudinary.com/dwsl2ktt2/image/upload/v1775296671/1_ijqfai.jpg',   alt: 'The Palm - Bedroom Suite' },
  { src: 'https://res.cloudinary.com/dwsl2ktt2/image/upload/v1775296671/3_wgur1l.jpg',   alt: 'The Palm - Dining Area' },
  { src: 'https://res.cloudinary.com/dwsl2ktt2/image/upload/v1775296671/2_xvzt1y.jpg',   alt: 'The Palm - Second Bedroom' },
  { src: 'https://res.cloudinary.com/dwsl2ktt2/image/upload/v1775296671/6_ffo1ly.jpg',   alt: 'The Palm - Lounge Area' },
];

const WA_TEXT = encodeURIComponent(
  "Hello, I'd like to enquire about The Palm apartment in Ayi Mensah",
);

interface HeroProps {
  onBookNow?: () => void;
}

export default function Hero({ onBookNow }: HeroProps) {
  const [loaded,  setLoaded]  = useState(false);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 100);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((c) => (c + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const scrollDown = () => {
    document.getElementById('featured')?.scrollIntoView({ behavior: 'smooth' });
  };

  const waLink = `https://wa.me/${CONTACT_INFO.whatsapp}?text=${WA_TEXT}`;

  return (
    <section
      className="relative min-h-[calc(100vh-72px)] mt-[72px] flex flex-col justify-end overflow-hidden"
      aria-label="Hero section"
    >
      {/* Background Slider */}
      <div className="absolute inset-0 overflow-hidden">
        {slides.map((slide, i) => (
          <div
            key={slide.src}
            className="absolute inset-0 transition-opacity duration-1000"
            style={{ opacity: i === current ? 1 : 0 }}
          >
            <SafeImage
              src={slide.src}
              alt={slide.alt}
              fill
              className="object-cover scale-105"
              priority={i === 0}
              sizes="100vw"
            />
          </div>
        ))}
        <div
          className="absolute inset-0 z-10"
          style={{
            background:
              'linear-gradient(to bottom, rgba(8,8,8,0.25) 0%, rgba(8,8,8,0.5) 50%, rgba(8,8,8,0.95) 100%)',
          }}
        />
        <div
          className="absolute inset-0 z-10"
          style={{
            background: 'linear-gradient(to right, rgba(8,8,8,0.65) 0%, transparent 60%)',
          }}
        />
      </div>

      {/* Slide dots */}
      <div className="absolute top-6 right-6 lg:right-12 z-20 flex gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            aria-label={`Go to slide ${i + 1}`}
            className="transition-all duration-300"
            style={{
              width:        i === current ? '24px' : '6px',
              height:       '6px',
              borderRadius: i === current ? '3px' : '50%',
              background:   i === current ? 'var(--gold)' : 'rgba(255,255,255,0.3)',
            }}
          />
        ))}
      </div>

      {/* Decorative side text */}
      <div className="absolute top-1/3 right-12 lg:right-24 hidden lg:flex flex-col items-center gap-4 z-20">
        <div className="w-px h-24 bg-gradient-to-b from-transparent via-[var(--gold)] to-transparent opacity-40" />
        <span className="section-label opacity-60" style={{ writingMode: 'vertical-rl' }}>
          Ayi Mensah &middot; Ghana
        </span>
        <div className="w-px h-24 bg-gradient-to-b from-transparent via-[var(--gold)] to-transparent opacity-40" />
      </div>

      {/* Main Content */}
      <div className="relative z-20 max-w-[1440px] mx-auto px-6 lg:px-12 pb-24 lg:pb-32">

        {/* Badge */}
        <div
          className={`inline-flex items-center gap-3 mb-8 transition-all duration-1000 ${
            loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
          style={{ transitionDelay: '200ms' }}
        >
          <div className="flex gap-1">
            {[0, 1, 2].map((i) => (
              <div key={i} className="w-1.5 h-1.5 rounded-full bg-[var(--gold)] opacity-80" />
            ))}
          </div>
          <span className="section-label">Premium Private Apartment &middot; Ayi Mensah, Accra</span>
        </div>

        {/* Headline */}
        <div className="overflow-hidden mb-6">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={loaded ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 0.4, ease: [0.21, 0.47, 0.32, 0.98] }}
          >
            <h1 className="font-serif font-light leading-[0.95] text-white text-[clamp(3rem,14vw,8rem)]">
              <span className="block">Your Private</span>
              <span className="block italic text-gold-gradient">Palm Retreat</span>
            </h1>
          </motion.div>
        </div>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={loaded ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 0.7 }}
          className="text-[var(--text-muted)] font-sans text-base md:text-lg max-w-md leading-relaxed mb-10"
        >
          A beautifully furnished private apartment nestled in the lush tranquility of
          Ayi Mensah &mdash; where comfort, elegance, and nature converge.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={loaded ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 0.9 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <button onClick={onBookNow} className="btn-gold">
            Book Your Stay
          </button>
          <a href={waLink} target="_blank" rel="noopener noreferrer" className="btn-ghost">
            <svg viewBox="0 0 24 24" className="w-3 h-3 fill-current" xmlns="http://www.w3.org/2000/svg">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            WhatsApp Us
          </a>
        </motion.div>

        {/* Stats */}
        <div
          className={`flex flex-wrap gap-x-10 gap-y-4 mt-16 pt-10 border-t border-[var(--border)] transition-all duration-1000 ${
            loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
          style={{ transitionDelay: '1100ms' }}
        >
          {[
            { value: '4.9★', label: 'Guest Rating' },
            { value: '1',    label: 'Private Apartment' },
            { value: '24/7', label: 'Support' },
            { value: '100%', label: 'Private & Secure' },
          ].map(({ value, label }) => (
            <div key={label} className="flex flex-col">
              <span className="font-serif text-3xl font-light text-white">{value}</span>
              <span className="text-[var(--text-subtle)] text-xs tracking-widest uppercase mt-0.5">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <button
        onClick={scrollDown}
        aria-label="Scroll to properties"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 text-[var(--text-subtle)] hover:text-[var(--gold)] transition-colors duration-300 group"
      >
        <span className="section-label text-[0.55rem]">Discover</span>
        <div className="w-px h-8 bg-gradient-to-b from-[var(--gold)] to-transparent group-hover:h-12 transition-all duration-500" />
        <ArrowDown size={14} className="animate-bounce" />
      </button>
    </section>
  );
}
