'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

export default function SiteLoader() {
  const [done, setDone] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setDone(true), 2600);
    return () => clearTimeout(t);
  }, []);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          key="loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7, ease: 'easeInOut' }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#080808]"
        >
          {/* Corner accents */}
          <div className="absolute top-6 left-6 w-8 h-8 border-t border-l border-[var(--gold)] opacity-50" />
          <div className="absolute top-6 right-6 w-8 h-8 border-t border-r border-[var(--gold)] opacity-50" />
          <div className="absolute bottom-10 left-6 w-8 h-8 border-b border-l border-[var(--gold)] opacity-50" />
          <div className="absolute bottom-10 right-6 w-8 h-8 border-b border-r border-[var(--gold)] opacity-50" />

          {/* Ghana Map Heartbeat */}
          <div className="relative w-44 h-44 mb-8">
            {/* Echo ring */}
            <motion.div
              className="absolute inset-0"
              animate={{ scale: [1, 1.8], opacity: [0.35, 0] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: 'easeOut' }}
            >
              <Image
                src="https://res.cloudinary.com/dwsl2ktt2/image/upload/v1775411642/download_pixian_ai_gz0czv.png"
                alt=""
                fill
                unoptimized
                className="object-contain brightness-0 invert opacity-25"
              />
            </motion.div>

            {/* Main heartbeat pulse */}
            <motion.div
              className="relative w-full h-full"
              animate={{
                scale: [1, 1.07, 1, 1.12, 1],
                filter: [
                  'drop-shadow(0 0 0px rgba(201,150,58,0))',
                  'drop-shadow(0 0 16px rgba(201,150,58,0.55))',
                  'drop-shadow(0 0 0px rgba(201,150,58,0))',
                  'drop-shadow(0 0 26px rgba(201,150,58,0.9))',
                  'drop-shadow(0 0 0px rgba(201,150,58,0))',
                ],
              }}
              transition={{
                duration: 1.8,
                repeat: Infinity,
                ease: 'easeInOut',
                times: [0, 0.15, 0.3, 0.5, 1],
              }}
            >
              <Image
                src="https://res.cloudinary.com/dwsl2ktt2/image/upload/v1775411642/download_pixian_ai_gz0czv.png"
                alt="Ghana"
                fill
                unoptimized
                className="object-contain"
                priority
              />
            </motion.div>
          </div>

          {/* Brand name */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.7 }}
            className="text-center"
          >
            <p className="font-serif text-2xl font-light text-white tracking-wide mb-1">
              Milehigh5280 🌴
            </p>
            <p className="text-[0.55rem] tracking-[0.35em] uppercase text-[var(--gold)] font-sans">
              Ayi Mensah · Accra · Ghana
            </p>
          </motion.div>

          {/* Shimmer progress bar */}
          <div className="absolute bottom-14 left-1/2 -translate-x-1/2 w-32 h-px bg-[var(--border)] overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-transparent via-[var(--gold)] to-transparent"
              initial={{ x: '-100%' }}
              animate={{ x: '100%' }}
              transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
