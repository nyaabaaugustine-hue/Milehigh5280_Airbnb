'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const symbols = [
  {
    name: 'Gye Nyame',
    meaning: 'Supremacy of God',
    url: 'https://res.cloudinary.com/dwsl2ktt2/image/upload/c_pad,b_white,w_400,h_400,e_brightness:30/v1775642580/gye_nyame_ajmocm.jpg',
  },
  {
    name: 'Sankofa',
    meaning: 'Return & Fetch It',
    url: 'https://res.cloudinary.com/dwsl2ktt2/image/upload/c_pad,b_white,w_400,h_400,e_brightness:30/v1775642579/sankofa_kuknsj.jpg',
  },
  {
    name: 'Dwennimmen',
    meaning: 'Humility & Strength',
    url: 'https://res.cloudinary.com/dwsl2ktt2/image/upload/c_pad,b_white,w_400,h_400/v1775643372/Vibrant_Adinkra_symbols_on_black_backdrop_ahymeb.png',
  },
  {
    name: 'Adinkrahene',
    meaning: 'Leadership',
    url: 'https://res.cloudinary.com/dwsl2ktt2/image/upload/c_pad,b_white,w_400,h_400,e_brightness:30/v1775642580/Adinkrahene_ek7egi.jpg',
  },
  {
    name: 'Nyame Biribi',
    meaning: 'Hope & Faith',
    url: 'https://res.cloudinary.com/dwsl2ktt2/image/upload/c_pad,b_white,w_400,h_400,e_brightness:30/v1775642580/Nyame_Biribi_ptiq72.jpg',
  },
  {
    name: 'Odo Nnyew',
    meaning: 'Power of Love',
    url: 'https://res.cloudinary.com/dwsl2ktt2/image/upload/c_pad,b_white,w_400,h_400,e_brightness:30/v1775643371/Odo_Nnyew_kp4n0j.jpg',
  },
];

const CARD_SIZE = 140;

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
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6 lg:gap-10 place-items-center">
          {symbols.map(({ name, meaning, url }, i) => (
            <motion.div
              key={name}
              className="flex flex-col items-center gap-4 group cursor-default"
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={inView ? { opacity: 1, scale: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
              whileHover={{ y: -4 }}
            >
              {/* Symbol container - light background so symbols appear clearly */}
              <div
                className="relative shrink-0 overflow-hidden border border-[var(--gold)]/30 group-hover:border-[var(--gold)] transition-all duration-500"
                style={{
                  width: CARD_SIZE,
                  height: CARD_SIZE,
                  borderRadius: '6%',
                  backgroundColor: '#F5F0E8',
                }}
              >
                {/* Glow effect on hover */}
                <motion.div
                  className="absolute inset-0 z-10 pointer-events-none"
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  style={{
                    background: 'radial-gradient(circle at center, rgba(201,150,58,0.2) 0%, transparent 70%)',
                  }}
                />

                {/* Symbol image */}
                <img
                  src={url}
                  alt={name}
                  width={CARD_SIZE}
                  height={CARD_SIZE}
                  className="absolute inset-0 w-full h-full object-contain p-3 transition-transform duration-500 group-hover:scale-110"
                  style={{ mixBlendMode: 'multiply' }}
                />

                {/* Animated gold border on hover */}
                <motion.div
                  className="absolute inset-0 border-2 border-transparent z-20 pointer-events-none"
                  initial={{ borderColor: 'transparent' }}
                  whileHover={{ borderColor: 'rgba(201,150,58,0.6)' }}
                  transition={{ duration: 0.3 }}
                  style={{ borderRadius: '6%' }}
                />

                {/* Corner accents */}
                <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[var(--gold)]/0 group-hover:border-[var(--gold)] transition-all duration-500 z-20" style={{ borderRadius: '6% 0 0 0' }} />
                <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-[var(--gold)]/0 group-hover:border-[var(--gold)] transition-all duration-500 z-20" style={{ borderRadius: '0 6% 0 0' }} />
                <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-[var(--gold)]/0 group-hover:border-[var(--gold)] transition-all duration-500 z-20" style={{ borderRadius: '0 0 0 6%' }} />
                <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[var(--gold)]/0 group-hover:border-[var(--gold)] transition-all duration-500 z-20" style={{ borderRadius: '0 0 6% 0' }} />
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
