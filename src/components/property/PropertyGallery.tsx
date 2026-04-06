'use client';

import { useState, useCallback } from 'react';
import Image from 'next/image';
import { X, ChevronLeft, ChevronRight, Grid, Expand } from 'lucide-react';
import type { PropertyImage } from '@/types';
import { cn } from '@/lib/utils';

interface Props {
  images: PropertyImage[];
  propertyName: string;
}

export default function PropertyGallery({ images, propertyName }: Props) {
  const [lightboxOpen,  setLightboxOpen]  = useState(false);
  const [activeIndex,   setActiveIndex]   = useState(0);
  const [gridView,      setGridView]      = useState(false);

  const openLightbox = useCallback((idx: number) => {
    setActiveIndex(idx);
    setLightboxOpen(true);
    document.body.style.overflow = 'hidden';
  }, []);

  const closeLightbox = useCallback(() => {
    setLightboxOpen(false);
    document.body.style.overflow = '';
  }, []);

  const prev = useCallback(() =>
    setActiveIndex(i => (i - 1 + images.length) % images.length), [images.length]);
  const next = useCallback(() =>
    setActiveIndex(i => (i + 1) % images.length), [images.length]);

  // Keyboard navigation
  const handleKey = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft')  prev();
    if (e.key === 'ArrowRight') next();
    if (e.key === 'Escape')     closeLightbox();
  }, [prev, next, closeLightbox]);

  const hero     = images[0];
  const secondary = images.slice(1, 5);

  return (
    <>
      {/* ─── Main Gallery Grid ─────────────────────────────────────────────── */}
      <div className="relative">

        {/* Desktop: mosaic layout */}
        <div className="hidden lg:grid grid-cols-4 grid-rows-2 gap-2 h-[580px]">
          {/* Hero image — spans 2 cols x 2 rows */}
          <button
            onClick={() => openLightbox(0)}
            className="col-span-2 row-span-2 relative overflow-hidden group focus:outline-none"
            aria-label={`View photo: ${hero.alt}`}
          >
            <Image
              src={hero.url}
              alt={hero.alt}
              fill
              sizes="(max-width: 1440px) 50vw"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              priority
            />
            <div className="absolute inset-0 bg-obsidian/10 group-hover:bg-obsidian/0 transition-colors duration-500" />
          </button>

          {/* Secondary images — 2x2 grid */}
          {secondary.map((img, i) => (
            <button
              key={img.id}
              onClick={() => openLightbox(i + 1)}
              className="relative overflow-hidden group focus:outline-none"
              aria-label={`View photo: ${img.alt}`}
            >
              <Image
                src={img.url}
                alt={img.alt}
                fill
                sizes="25vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-obsidian/10 group-hover:bg-obsidian/0 transition-colors duration-500" />
            </button>
          ))}
        </div>

        {/* Mobile: single hero + thumbnails */}
        <div className="lg:hidden">
          <button
            onClick={() => openLightbox(0)}
            className="relative w-full h-72 overflow-hidden block focus:outline-none"
            aria-label={`View photo: ${hero.alt}`}
          >
            <Image src={hero.url} alt={hero.alt} fill className="object-cover" priority />
          </button>
          <div className="grid grid-cols-4 gap-1 mt-1">
            {secondary.map((img, i) => (
              <button
                key={img.id}
                onClick={() => openLightbox(i + 1)}
                className="relative h-20 overflow-hidden focus:outline-none"
                aria-label={`View photo: ${img.alt}`}
              >
                <Image src={img.url} alt={img.alt} fill className="object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Show all photos button */}
        <button
          onClick={() => { setGridView(true); setLightboxOpen(true); setActiveIndex(0); document.body.style.overflow = 'hidden'; }}
          className="absolute bottom-4 right-4 flex items-center gap-2 bg-obsidian/80 backdrop-blur-sm border border-[var(--border)] text-white text-xs uppercase tracking-widest px-4 py-2.5 hover:border-[var(--gold)] hover:text-[var(--gold)] transition-all duration-300"
        >
          <Grid size={13} />
          Show All {images.length} Photos
        </button>

        {/* Photo count */}
        <div className="absolute top-4 left-4 bg-obsidian/70 backdrop-blur-sm border border-[var(--border)] px-3 py-1.5">
          <span className="text-white text-xs">
            <span className="text-[var(--gold)]">{images.length}</span> Photos
          </span>
        </div>
      </div>

      {/* ─── Lightbox ──────────────────────────────────────────────────────── */}
      {lightboxOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Photo gallery"
          className="fixed inset-0 z-[9000] bg-obsidian/98 backdrop-blur-xl flex flex-col"
          onKeyDown={handleKey}
          tabIndex={0}
        >
          {/* Top bar */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border)] shrink-0">
            <div>
              <p className="font-serif text-lg text-white">{propertyName}</p>
              <p className="text-[var(--text-muted)] text-xs">
                {activeIndex + 1} / {images.length}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setGridView(g => !g)}
                className="text-[var(--text-muted)] hover:text-[var(--gold)] transition-colors p-2"
                aria-label="Toggle grid view"
              >
                <Grid size={18} />
              </button>
              <button
                onClick={closeLightbox}
                className="text-[var(--text-muted)] hover:text-white transition-colors p-2"
                aria-label="Close gallery"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {gridView ? (
            /* Grid mode */
            <div className="flex-1 overflow-y-auto p-6">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 max-w-6xl mx-auto">
                {images.map((img, i) => (
                  <button
                    key={img.id}
                    onClick={() => { setActiveIndex(i); setGridView(false); }}
                    className={cn(
                      'relative h-48 overflow-hidden focus:outline-none group border-2 transition-all duration-200',
                      i === activeIndex ? 'border-[var(--gold)]' : 'border-transparent hover:border-[var(--gold)]/50',
                    )}
                    aria-label={`Select photo: ${img.alt}`}
                  >
                    <Image src={img.url} alt={img.alt} fill className="object-cover" />
                    <div className="absolute inset-0 bg-obsidian/20 group-hover:bg-transparent transition-colors duration-300" />
                    <div className="absolute bottom-2 left-2 text-[0.6rem] uppercase tracking-widest text-white/60 bg-obsidian/60 px-2 py-0.5">
                      {img.category}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            /* Single view */
            <div className="flex-1 relative flex items-center justify-center">
              <div className="relative w-full max-w-5xl mx-auto px-16 h-full flex items-center">
                <div className="relative w-full" style={{ paddingBottom: '60%' }}>
                  <Image
                    key={activeIndex}
                    src={images[activeIndex].url}
                    alt={images[activeIndex].alt}
                    fill
                    className="object-contain"
                    style={{ animation: 'fadeIn 0.3s ease' }}
                  />
                </div>
              </div>

              {/* Nav arrows */}
              <button
                onClick={prev}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 border border-[var(--border)] flex items-center justify-center text-white hover:border-[var(--gold)] hover:text-[var(--gold)] transition-all duration-300 bg-obsidian/60"
                aria-label="Previous photo"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={next}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 border border-[var(--border)] flex items-center justify-center text-white hover:border-[var(--gold)] hover:text-[var(--gold)] transition-all duration-300 bg-obsidian/60"
                aria-label="Next photo"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          )}

          {/* Bottom thumbnails strip */}
          {!gridView && (
            <div className="shrink-0 px-6 py-4 border-t border-[var(--border)]">
              <div className="flex gap-2 overflow-x-auto pb-1">
                {images.map((img, i) => (
                  <button
                    key={img.id}
                    onClick={() => setActiveIndex(i)}
                    className={cn(
                      'relative shrink-0 w-16 h-12 overflow-hidden transition-all duration-200 border-2',
                      i === activeIndex ? 'border-[var(--gold)]' : 'border-transparent opacity-50 hover:opacity-80',
                    )}
                    aria-label={`Go to photo ${i + 1}`}
                  >
                    <Image src={img.url} alt="" fill className="object-cover" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}
