'use client';

import { Property } from '@/types';
import { X, MapPin, Users, BedDouble, Bath, Star, CheckCircle2, Phone } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { formatCurrency } from '@/lib/data';

interface PropertyModalProps {
  property: Property | null;
  isOpen: boolean;
  onClose: () => void;
  onBook: () => void;
}

export default function PropertyModal({ property, isOpen, onClose, onBook }: PropertyModalProps) {
  if (!property) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 lg:p-8">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-obsidian/90 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-6xl max-h-[90vh] bg-[var(--surface)] border border-[var(--border)] overflow-y-auto custom-scrollbar shadow-2xl"
          >
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 z-50 p-2 bg-obsidian/50 hover:bg-obsidian text-white border border-[var(--border)] transition-colors"
            >
              <X size={20} />
            </button>

            {/* Image Gallery Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-2 p-2 h-[300px] md:h-[450px]">
              <div className="md:col-span-2 relative overflow-hidden group">
                <Image src={property.images[0].url} alt={property.images[0].alt} fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
              </div>
              <div className="hidden md:grid grid-cols-1 grid-rows-2 gap-2">
                <div className="relative overflow-hidden"><Image src={property.images[1]?.url || property.images[0].url} alt="Interior" fill className="object-cover" /></div>
                <div className="relative overflow-hidden"><Image src={property.images[2]?.url || property.images[0].url} alt="Interior" fill className="object-cover" /></div>
              </div>
              <div className="hidden md:grid grid-cols-1 grid-rows-2 gap-2">
                <div className="relative overflow-hidden"><Image src={property.images[3]?.url || property.images[0].url} alt="Interior" fill className="object-cover" /></div>
                <div className="relative overflow-hidden"><Image src={property.images[4]?.url || property.images[0].url} alt="Interior" fill className="object-cover" /></div>
              </div>
            </div>

            <div className="p-6 lg:p-12">
              <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-12">
                {/* Left Content */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="px-2 py-0.5 bg-[rgba(201,150,58,0.1)] text-[var(--gold)] text-[0.6rem] uppercase tracking-widest border border-[var(--gold)]/20 font-medium">
                      {property.badge || 'Premium Stay'}
                    </span>
                    <div className="flex items-center gap-1 ml-auto lg:ml-4 text-[var(--gold)]">
                      <Star size={14} className="fill-current" />
                      <span className="text-sm font-medium">{property.rating}</span>
                    </div>
                  </div>

                  <h2 className="font-serif text-3xl lg:text-5xl text-white mb-2">{property.name}</h2>
                  <div className="flex items-center gap-2 text-[var(--text-muted)] mb-8">
                    <MapPin size={14} className="text-[var(--gold)]" />
                    <span className="text-sm">{property.location.address}</span>
                  </div>

                  <div className="grid grid-cols-4 border-y border-[var(--border)] py-6 mb-8">
                    <div className="text-center border-r border-[var(--border)]">
                      <p className="text-[var(--text-subtle)] text-[0.6rem] uppercase tracking-tighter mb-1">Guests</p>
                      <div className="flex justify-center gap-1 text-white"><Users size={14} /> <span className="text-sm">{property.capacity.guests}</span></div>
                    </div>
                    <div className="text-center border-r border-[var(--border)]">
                      <p className="text-[var(--text-subtle)] text-[0.6rem] uppercase tracking-tighter mb-1">Bedrooms</p>
                      <div className="flex justify-center gap-1 text-white"><BedDouble size={14} /> <span className="text-sm">{property.capacity.bedrooms}</span></div>
                    </div>
                    <div className="text-center border-r border-[var(--border)]">
                      <p className="text-[var(--text-subtle)] text-[0.6rem] uppercase tracking-tighter mb-1">Bathrooms</p>
                      <div className="flex justify-center gap-1 text-white"><Bath size={14} /> <span className="text-sm">{property.capacity.bathrooms}</span></div>
                    </div>
                    <div className="text-center">
                      <p className="text-[var(--text-subtle)] text-[0.6rem] uppercase tracking-tighter mb-1">Type</p>
                      <p className="text-white text-sm capitalize">{property.type}</p>
                    </div>
                  </div>

                  <p className="text-[var(--text-muted)] leading-relaxed mb-10 whitespace-pre-line">{property.longDescription}</p>

                  <h4 className="section-label mb-6">Amenities & Features</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-4 gap-x-8">
                    {property.amenities.map(amenity => (
                      <div key={amenity.id} className="flex items-center gap-3 text-sm text-white/80 group">
                        <CheckCircle2 size={16} className="text-[var(--gold)] shrink-0 opacity-60 group-hover:opacity-100 transition-opacity" />
                        <span>{amenity.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}