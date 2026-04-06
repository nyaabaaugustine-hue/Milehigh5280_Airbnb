'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Map, Calendar, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function calculateTimeLeft(): TimeLeft {
  const diff = +new Date('2025-10-12T00:00:00') - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  return {
    days:    Math.floor(diff / 86400000),
    hours:   Math.floor((diff / 3600000) % 24),
    minutes: Math.floor((diff / 60000) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

export default function GhanaTourAd(): JSX.Element {
  const [isVisible, setIsVisible] = useState(false);
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft());

  useEffect(() => {
    const show = setTimeout(() => setIsVisible(true), 3000);
    const tick = setInterval(() => setTimeLeft(calculateTimeLeft()), 1000);
    return () => {
      clearTimeout(show);
      clearInterval(tick);
    };
  }, []);

  const hasTime =
    timeLeft.days > 0 ||
    timeLeft.hours > 0 ||
    timeLeft.minutes > 0 ||
    timeLeft.seconds > 0;

  const pad = (n: number) => String(n).padStart(2, '0');

  return (
    <AnimatePresence>
      {isVisible ? (
        <motion.div
          key="ghana-tour-ad"
          initial={{ x: 400, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 400, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 120 }}
          className="fixed bottom-4 right-4 md:bottom-8 md:right-8 z-[100] w-[calc(100%-2rem)] max-w-[320px] bg-[var(--obsidian)] border border-[var(--gold)] shadow-2xl overflow-hidden"
        >
          {/* Header image */}
          <div className="relative h-28 w-full">
            <Image
              src="https://res.cloudinary.com/dwsl2ktt2/image/upload/v1775380667/ERR_jjr2hx.jpg"
              alt="Ghana Heritage Tour"
              fill
              unoptimized
              className="object-cover opacity-60"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--obsidian)] to-transparent" />
            <button
              onClick={() => setIsVisible(false)}
              aria-label="Close"
              className="absolute top-2 right-2 p-1.5 bg-black/60 hover:bg-black text-white/70 hover:text-white transition-colors"
            >
              <X size={14} />
            </button>
            <div className="absolute bottom-3 left-4">
              <span className="bg-[var(--gold)] text-[var(--obsidian)] text-[0.6rem] font-bold px-2 py-0.5 uppercase tracking-widest">
                Limited Spots
              </span>
            </div>
          </div>

          {/* Body */}
          <div className="p-4">
            <h3 className="font-serif text-lg text-white mb-2 leading-tight">
              The Grand{' '}
              <span className="italic text-gold-gradient">Ghana Tour</span> 2025
            </h3>
            <p className="text-[var(--text-muted)] text-xs leading-relaxed mb-3">
              Join Milehigh Properties for an exclusive 10-day curated journey through
              West Africa. Luxury accommodation and private concierge included.
            </p>

            {/* Countdown */}
            {hasTime ? (
              <div className="flex items-center justify-center gap-3 border-y border-[var(--border)] py-3 mb-4">
                {timeLeft.days > 0 && (
                  <span className="text-white text-base font-bold">
                    {timeLeft.days}
                    <span className="text-[var(--text-muted)] text-[0.6rem] font-normal ml-0.5">D</span>
                  </span>
                )}
                <span className="text-white text-base font-bold">
                  {pad(timeLeft.hours)}
                  <span className="text-[var(--text-muted)] text-[0.6rem] font-normal ml-0.5">H</span>
                </span>
                <span className="text-white text-base font-bold">
                  {pad(timeLeft.minutes)}
                  <span className="text-[var(--text-muted)] text-[0.6rem] font-normal ml-0.5">M</span>
                </span>
                <span className="text-white text-base font-bold">
                  {pad(timeLeft.seconds)}
                  <span className="text-[var(--text-muted)] text-[0.6rem] font-normal ml-0.5">S</span>
                </span>
              </div>
            ) : (
              <p className="text-[var(--gold)] text-center text-sm font-bold mb-4">
                Tour has started!
              </p>
            )}

            {/* Details */}
            <div className="space-y-1.5 mb-4">
              <div className="flex items-center gap-2 text-[0.65rem] text-white/80">
                <Calendar size={11} className="text-[var(--gold)] shrink-0" />
                <span>October 12th — 22nd, 2025</span>
              </div>
              <div className="flex items-center gap-2 text-[0.65rem] text-white/80">
                <Map size={11} className="text-[var(--gold)] shrink-0" />
                <span>Accra · Kumasi · Cape Coast</span>
              </div>
            </div>

            {/* CTA */}
            <Link
              href="/contact?type=event"
              onClick={() => setIsVisible(false)}
              className="flex items-center justify-center gap-2 w-full bg-[var(--gold)] text-[var(--obsidian)] py-2.5 text-[0.6rem] font-bold uppercase tracking-widest hover:opacity-90 transition-opacity"
            >
              Secure Your Seat
              <ArrowRight size={11} />
            </Link>

            <p className="text-center text-[0.5rem] text-[var(--text-subtle)] mt-2 italic">
              *Managed by Milehigh Concierge Services
            </p>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
