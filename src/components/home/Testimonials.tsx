'use client';

import { useEffect, useRef, useState } from 'react';
import SafeImage from '@/components/ui/SafeImage';
import { Star, Quote, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import type { Review } from '@/lib/airtable/types';

const sampleReviews = [
  {
    id: '1',
    author: 'Sarah M.',
    country: 'United Kingdom',
    authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop',
    rating: 5,
    date: '2024-12-15',
    comment: 'Absolutely stunning property! The views of the surrounding hills were breathtaking. The villa was immaculate and the host was incredibly responsive.',
    stayDuration: '5 nights',
    propertyName: 'The Palm',
  },
  {
    id: '2',
    author: 'James K.',
    country: 'Germany',
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop',
    rating: 5,
    date: '2024-11-28',
    comment: 'Perfect escape from Accra. The peace and quiet here is exactly what we needed. The interior design is impeccable.',
    stayDuration: '7 nights',
    propertyName: 'The Palm',
  },
  {
    id: '3',
    author: 'Amara D.',
    country: 'USA',
    authorAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop',
    rating: 5,
    date: '2024-10-10',
    comment: 'Exceeded all expectations. The location is pristine, the amenities top-notch, and the hospitality unmatched. Will definitely return.',
    stayDuration: '3 nights',
    propertyName: 'The Palm',
  },
];

const GOOGLE_MAPS_URL = "https://www.google.com/maps/place/The+Palm+%F0%9F%8C%B4+Ayi+mensah+By+Rehoboth+Properties/@5.7928557,-0.1790786,15z/data=!4m8!3m7!1s0xfdf775ee9a8b2ad:0xbeeaf9c2791d4a48!8m2!3d5.7929052!4d-0.1791364!9m1!1b1!16s%2Fg%2F11q332fb_r?hl=en-US";

const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c1.08-1.01 1.71-2.5 1.71-4.26z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-1 .67-2.28 1.07-3.71 1.07-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 12-4.53z" fill="#EA4335"/>
  </svg>
);

export default function Testimonials() {
  const ref = useRef<HTMLDivElement>(null);
  const [vis, setVis] = useState(false);
  const [active, setActive] = useState(0);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [reviews] = useState<Review[]>(sampleReviews as unknown as Review[]);
  const [loading] = useState(false);

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
    if (reviews.length === 0) return;
    const t = setInterval(() => setActive(a => (a + 1) % reviews.length), 5500);
    return () => clearInterval(t);
  }, [reviews.length]);

  const handleGoogleReview = () => {
    setIsRedirecting(true);
    setTimeout(() => {
      if (typeof window === 'undefined') return;
      window.open(GOOGLE_MAPS_URL, '_blank');
      setIsRedirecting(false);
    }, 2200);
  };

  if (loading || reviews.length === 0) return null;

  const current = reviews[active];

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
              <SafeImage
                src={current.authorAvatar}
                alt={current.author}
                fill
                className="object-cover"
                sizes="48px"
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
          {reviews.map((_, i) => (
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

        {/* ── Google Review CTA ── */}
        <div className="mt-12 flex flex-col items-center">
          <button 
            onClick={handleGoogleReview}
            className="inline-flex items-center gap-3 px-8 py-4 border border-[var(--border)] hover:border-[var(--gold)] hover:bg-[var(--surface-2)] transition-all duration-500 group"
          >
            <GoogleIcon />
            <span className="text-[0.7rem] tracking-[0.22em] uppercase font-sans font-medium text-[var(--text-muted)] group-hover:text-white transition-colors">
              Leave a Google Review
            </span>
            <ExternalLink size={14} className="text-[var(--gold)] opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-500" />
          </button>
        </div>

        {/* ── Redirection Notice Overlay ── */}
        <AnimatePresence>
          {isRedirecting && (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-[1000] flex items-center justify-center bg-obsidian/90 backdrop-blur-md p-6"
            >
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                className="bg-[var(--surface)] border border-[var(--border)] p-8 lg:p-12 max-w-sm text-center shadow-2xl"
              >
                <div className="w-12 h-12 border border-[var(--gold)] flex items-center justify-center mx-auto mb-8 rotate-45">
                  <GoogleIcon />
                </div>
                <h3 className="font-serif text-2xl text-white mb-4 font-light">Visit Google Maps</h3>
                <p className="text-[var(--text-muted)] text-sm mb-8 leading-relaxed">
                  We are opening Google Maps so you can share your experience with Milehigh5280. We appreciate your support!
                </p>
                <div className="w-full h-px bg-[var(--border)] relative overflow-hidden">
                  <motion.div 
                    initial={{ x: '-100%' }} animate={{ x: '0%' }} transition={{ duration: 2, ease: "easeInOut" }}
                    className="absolute inset-0 bg-[var(--gold)]" 
                  />
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

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
