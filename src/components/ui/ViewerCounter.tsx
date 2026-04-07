'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ViewerCounter() {
  const [count,   setCount]   = useState(0);
  const [visible, setVisible] = useState(false);
  const [flash,   setFlash]   = useState(false);

  // Initialise with a random realistic number
  useEffect(() => {
    setCount(Math.floor(Math.random() * 26) + 18); // 18–43
  }, []);

  // Show after scroll
  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 300);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Occasionally increment
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() < 0.8) {
        setCount(c => c + 1);
        setFlash(true);
        setTimeout(() => setFlash(false), 600);
      }
    }, 12000);
    return () => clearInterval(interval);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 20, x: -10 }}
          animate={{ opacity: 1, y: 0,  x: 0  }}
          exit={{    opacity: 0, y: 20          }}
          transition={{ duration: 0.4 }}
          className="fixed bottom-24 left-5 z-40 flex items-center gap-2.5 px-4 py-2.5 bg-[var(--surface)] border border-[var(--border)] shadow-xl backdrop-blur-sm"
          aria-live="polite"
          aria-label="Property viewers"
        >
          {/* Pulsing red dot */}
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
          </span>

          <span className="text-[0.65rem] font-sans text-[var(--text-muted)] uppercase tracking-wider">
            <motion.span
              key={count}
              initial={{ scale: flash ? 1.4 : 1, color: flash ? 'var(--gold)' : 'inherit' }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3 }}
              className="font-semibold text-white"
            >
              {count}
            </motion.span>
            {' '}people viewing this week
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
