'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const symbols = [
  {
    name: 'Gye Nyame',
    meaning: 'Supremacy of God',
    url: 'https://res.cloudinary.com/dwsl2ktt2/image/upload/v1775642580/gye_nyame_ajmocm.jpg',
  },
  {
    name: 'Sankofa',
    meaning: 'Return & Fetch It',
    url: 'https://res.cloudinary.com/dwsl2ktt2/image/upload/v1775642579/sankofa_kuknsj.jpg',
  },
  {
    name: 'Dwennimmen',
    meaning: 'Humility & Strength',
    url: 'https://res.cloudinary.com/dwsl2ktt2/image/upload/v1775642580/Dwennimmen_j3vort.jpg',
  },
  {
    name: 'Adinkrahene',
    meaning: 'Leadership',
    url: 'https://res.cloudinary.com/dwsl2ktt2/image/upload/v1775642580/Adinkrahene_ek7egi.jpg',
  },
  {
    name: 'Nyame Biribi',
    meaning: 'Hope & Faith',
    url: 'https://res.cloudinary.com/dwsl2ktt2/image/upload/v1775642580/Nyame_Biribi_ptiq72.jpg',
  },
  {
    name: 'Odo Nnyew',
    meaning: 'Power of Love',
    url: 'https://res.cloudinary.com/dwsl2ktt2/image/upload/v1775642579/Odo_Nnyew_nlemky.jpg',
  },
];

export default function AdinkraSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section
      ref={ref}
      className="py-20 bg-[var(--obsidian)] border-y border-[var(--gold)]/20 overflow-hidden"
    >
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
        {/* Header */}
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <p className="section-label mb-3">Rooted in Heritage</p>
          <h2 className="font-serif text-3xl lg:text-4xl font-light text-white">
            The <span className="italic text-gold-gradient">Adinkra</span> Symbols That Guide Us
          </h2>
          <p className="text-[var(--text-muted)] text-sm mt-4 max-w-lg mx-auto leading-relaxed">
            Ancient Ghanaian wisdom woven into every experience we create — these symbols
            represent the values at the heart of Milehigh Properties.
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6 lg:gap-8">
          {symbols.map(({ name, meaning, url }, i) => (
            <motion.div
              key={name}
              className="flex flex-col items-center gap-4 group cursor-default"
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.08 }}
            >
              {/* Image card */}
              <div className="relative w-24 h-24 lg:w-28 lg:h-28 overflow-hidden border border-[var(--border)] group-hover:border-[var(--gold)] transition-all duration-500 group-hover:scale-105 bg-white/5">
                {/* Gold shimmer on hover */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-[var(--gold)]/10 to-transparent z-10 pointer-events-none" />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={url}
                  alt={name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  style={{ filter: 'brightness(0.95) contrast(1.1)' }}
                />
                {/* Bottom gold line reveal on hover */}
                <div className="absolute bottom-0 left-0 w-0 group-hover:w-full h-[2px] bg-[var(--gold)] transition-all duration-500" />
              </div>

              {/* Label */}
              <div className="text-center">
                <p className="font-serif text-white text-sm leading-tight group-hover:text-[var(--gold)] transition-colors duration-300">
                  {name}
                </p>
                <p className="text-[var(--gold)] text-[0.58rem] uppercase tracking-widest mt-1 opacity-60 group-hover:opacity-100 transition-opacity duration-300">
                  {meaning}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Kente border accent */}
        <div
          className="mt-14 h-[3px] w-full opacity-20"
          style={{
            backgroundImage:
              'url(https://res.cloudinary.com/dwsl2ktt2/image/upload/v1775413445/kente-seamless-digital-paper-pattern_546783-186_kbgc49.jpg)',
            backgroundSize: '300px',
          }}
        />
      </div>
    </section>
  );
}
