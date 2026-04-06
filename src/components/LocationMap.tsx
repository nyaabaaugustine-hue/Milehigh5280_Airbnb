'use client';

import { motion } from 'framer-motion';
import { MapPin, Navigation, ExternalLink } from 'lucide-react';

export default function LocationMap() {
  const address = "Ayi Mensah, Accra, Ghana";
  const mapUrl = "https://maps.google.com/maps?q=5.792905,-0.181711&t=&z=15&ie=UTF8&iwloc=&output=embed";

  return (
    <section className="py-24 px-6 lg:px-12 max-w-[1440px] mx-auto border-t border-[var(--border)] overflow-hidden">
      <div className="flex flex-col lg:flex-row gap-16 items-start">
        {/* Text Side */}
        <div className="lg:w-1/3 w-full">
          <p className="section-label mb-4">Location</p>
          <h2 className="font-serif text-4xl font-light text-white mb-6">
            Finding Your<br />
            <span className="italic text-gold-gradient">Sanctuary</span>
          </h2>
          <p className="text-[var(--text-muted)] text-sm leading-relaxed mb-8">
            Nestled at the base of the Aburi mountains, The Palm offers the perfect balance 
            of mountain serenity and city accessibility.
          </p>
          
          <div className="space-y-4">
            <div className="flex items-start gap-4 p-6 border border-[var(--border)] bg-[var(--surface)] group hover:border-[var(--gold)] transition-colors duration-500">
              <div className="w-10 h-10 flex items-center justify-center border border-[var(--border)] group-hover:border-[var(--gold)] transition-colors">
                <MapPin size={18} className="text-[var(--gold)]" />
              </div>
              <div>
                <p className="text-[var(--text-subtle)] text-[0.6rem] uppercase tracking-widest mb-1">Address</p>
                <p className="text-white text-sm">{address}</p>
              </div>
            </div>
            
            <a 
              href="https://maps.google.com/?q=5.792905,-0.181711"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-gold w-full justify-center gap-2"
            >
              <Navigation size={14} />
              Get Directions
            </a>
          </div>
        </div>

        {/* Map Side */}
        <div className="lg:w-2/3 w-full h-[450px] relative group border border-[var(--border)] overflow-hidden bg-[var(--surface-2)]">
          <iframe
            src={mapUrl}
            width="100%"
            height="100%"
            style={{ border: 0, filter: 'grayscale(1) invert(0.9) contrast(1.2) brightness(0.8)' }}
            allowFullScreen={true}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="transition-all duration-700 group-hover:filter-none opacity-80 group-hover:opacity-100"
          ></iframe>
          
          {/* Luxurious Overlay Frame */}
          <div className="absolute inset-0 pointer-events-none border-[12px] border-[var(--surface)] opacity-40" />
          <div className="absolute inset-4 pointer-events-none border border-[var(--gold)]/10" />
        </div>
      </div>
    </section>
  );
}