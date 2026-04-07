'use client';

import { useEffect, useRef, useState } from 'react';

export default function CustomCursor() {
  const dotRef   = useRef<HTMLDivElement>(null);
  const ringRef  = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    // Only on non-touch devices
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(pointer: coarse)').matches) return;

    // Hide default cursor
    document.body.style.cursor = 'none';

    let mouseX = 0, mouseY = 0;
    let ringX  = 0, ringY  = 0;
    let rafId: number;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (dotRef.current) {
        dotRef.current.style.transform  = `translate(${mouseX - 4}px, ${mouseY - 4}px)`;
      }
    };

    const onMouseDown = () => setActive(true);
    const onMouseUp   = () => setActive(false);

    const handleHoverIn  = () => setActive(true);
    const handleHoverOut = () => setActive(false);

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    const animate = () => {
      ringX = lerp(ringX, mouseX, 0.12);
      ringY = lerp(ringY, mouseY, 0.12);
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${ringX - 14}px, ${ringY - 14}px)`;
      }
      rafId = requestAnimationFrame(animate);
    };

    rafId = requestAnimationFrame(animate);

    document.addEventListener('mousemove',   onMouseMove,  { passive: true });
    document.addEventListener('mousedown',   onMouseDown);
    document.addEventListener('mouseup',     onMouseUp);

    // Track hover on interactive elements
    const interactiveQuery = 'a, button, [role="button"], input, textarea, select, label[for], [tabindex]:not([tabindex="-1"])';
    const interactiveEls = document.querySelectorAll(interactiveQuery);
    interactiveEls.forEach(el => {
      el.addEventListener('mouseenter', handleHoverIn);
      el.addEventListener('mouseleave', handleHoverOut);
    });

    return () => {
      document.body.style.cursor = '';
      document.removeEventListener('mousemove',  onMouseMove);
      document.removeEventListener('mousedown',  onMouseDown);
      document.removeEventListener('mouseup',    onMouseUp);
      interactiveEls.forEach(el => {
        el.removeEventListener('mouseenter', handleHoverIn);
        el.removeEventListener('mouseleave', handleHoverOut);
      });
      cancelAnimationFrame(rafId);
    };
  }, []);

  // Don't render on server
  if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) {
    return null;
  }

  return (
    <>
      {/* Small gold dot — exact cursor position */}
      <div
        ref={dotRef}
        className="pointer-events-none fixed top-0 left-0 z-[9999] w-2 h-2 rounded-full transition-transform duration-75"
        style={{
          background: 'var(--gold)',
          transform: 'translate(-100px, -100px)',
          mixBlendMode: 'difference',
        }}
        aria-hidden="true"
      />
      {/* Larger ring — follows with lag */}
      <div
        ref={ringRef}
        className="pointer-events-none fixed top-0 left-0 z-[9998] w-7 h-7 rounded-full border border-[var(--gold)] transition-[width,height,opacity] duration-300"
        style={{
          transform: 'translate(-100px, -100px)',
          opacity: active ? 1 : 0.5,
          width:   active ? '48px' : '28px',
          height:  active ? '48px' : '28px',
          marginLeft: active ? '-10px' : '0',
          marginTop:  active ? '-10px' : '0',
        }}
        aria-hidden="true"
      />
    </>
  );
}
