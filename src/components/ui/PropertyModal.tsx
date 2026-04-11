'use client';

import { Property } from '@/types';
import { X, MapPin, Users, BedDouble, Bath, Star, CheckCircle2, Phone } from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import SafeImage from '@/components/ui/SafeImage';
import { formatCurrency } from '@/lib/data';

interface PropertyModalProps {
  property: Property | null;
  isOpen: boolean;
  onClose: () => void;
  onBook: () => void;
}

export default function PropertyModal({ property, isOpen, onClose, onBook }: PropertyModalProps) {
  if (!property) return null;

  const heroImage = property.images?.hero?.url || property.hero_image || 'https://res.cloudinary.com/dwsl2ktt2/image/upload/v1775296671/5_yc05lt.jpg';
  const galleryImages = property.images?.gallery || property.gallery || [];
  const imgs = [
    { url: heroImage, alt: property.name },
    ...galleryImages.slice(0, 5),
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 lg:p-8">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-[#080808]/90 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="relative w-full max-w-4xl max-h-[90vh] bg-[var(--surface)] border border-[var(--border)] overflow-y-auto shadow-2xl"
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-50 w-9 h-9 flex items-center justify-center bg-[#080808]/60 hover:bg-[#080808] text-white border border-[var(--border)] transition-colors"
            >
              <X size={16} />
            </button>

            {/* Image Gallery */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-1 h-[240px] md:h-[360px] bg-[var(--surface-2)]">
              <div className="md:col-span-2 relative overflow-hidden group">
                <SafeImage 
                  src={imgs[0]?.url || heroImage} 
                  alt={property.name} 
                  fill 
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105" 
                />
              </div>
              {[1, 2].map(idx => (
                <div key={idx} className="hidden md:grid grid-rows-2 gap-1">
                  {[0, 1].map(sub => {
                    const imgIdx = idx === 1 ? sub + 1 : sub + 3;
                    const img = imgs[imgIdx] || imgs[0];
                    return (
                      <div key={sub} className="relative overflow-hidden group">
                        <SafeImage 
                          src={img?.url || heroImage} 
                          alt={property.name} 
                          fill 
                          sizes="25vw"
                          className="object-cover transition-transform duration-500 group-hover:scale-105" 
                        />
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>

            <div className="p-6 lg:p-8">
              {/* Badge + rating */}
              <div className="flex items-center gap-2 mb-4">
                {property.badge && (
                  <span className="px-2.5 py-1 bg-[rgba(201,150,58,0.1)] text-[var(--gold)] text-[0.6rem] uppercase tracking-widest border border-[var(--gold)]/20 font-medium">
                    {property.badge}
                  </span>
                )}
                <div className="flex items-center gap-1 ml-auto">
                  <Star size={13} className="fill-[var(--gold)] text-[var(--gold)]" />
                  <span className="text-[var(--text-primary)] text-sm font-medium">{property.rating}</span>
                  <span className="text-[var(--text-muted)] text-xs">({property.reviewCount} reviews)</span>
                </div>
              </div>

              <h2 className="font-serif text-3xl lg:text-4xl text-[var(--text-primary)] mb-2 font-light">{property.name}</h2>
              <div className="flex items-center gap-2 text-[var(--text-muted)] mb-6">
                <MapPin size={13} className="text-[var(--gold)] shrink-0" />
                <span className="text-sm">{property.location.address}</span>
              </div>

              {/* Specs */}
              <div className="grid grid-cols-4 border-y border-[var(--border)] py-4 mb-6">
                {[
                  { icon: <Users size={14} />,    label: 'Guests',    value: property.capacity.guests },
                  { icon: <BedDouble size={14} />, label: 'Bedrooms',  value: property.capacity.bedrooms },
                  { icon: <Bath size={14} />,      label: 'Bathrooms', value: property.capacity.bathrooms },
                  { icon: null,                    label: 'Type',      value: property.type },
                ].map(({ icon, label, value }, i, arr) => (
                  <div key={label} className={`text-center ${i < arr.length - 1 ? 'border-r border-[var(--border)]' : ''}`}>
                    <p className="text-[var(--text-subtle)] text-[0.6rem] uppercase tracking-tighter mb-1">{label}</p>
                    <div className="flex justify-center items-center gap-1 text-[var(--text-primary)]">
                      {icon}
                      <span className="text-sm capitalize">{value}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Description */}
              <p className="text-[var(--text-muted)] leading-relaxed mb-6 text-sm">{property.description}</p>

              {/* Amenities */}
              <h4 className="section-label mb-3">Amenities</h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-2.5 gap-x-4 mb-8">
                {property.amenities.slice(0, 9).map(a => (
                  <div key={a.id} className="flex items-center gap-2 text-sm text-[var(--text-muted)]">
                    <CheckCircle2 size={14} className="text-[var(--gold)] shrink-0 opacity-80" />
                    <span>{a.label}</span>
                  </div>
                ))}
              </div>

              {/* Price + CTA */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-[var(--border)] pt-5">
                <div>
                  <span className="font-serif text-3xl text-[var(--text-primary)] font-light">
                    {formatCurrency(property.pricing.perNight)}
                  </span>
                  <span className="text-[var(--text-muted)] text-sm"> / night</span>
                  <p className="text-[var(--text-subtle)] text-xs mt-0.5">
                    Min. {property.pricing.minNights} night{property.pricing.minNights > 1 ? 's' : ''}
                  </p>
                </div>
                <div className="flex gap-3 w-full sm:w-auto">
                  {property.isLive ? (
                    <button onClick={onBook} className="btn-gold flex-1 sm:flex-none justify-center gap-2">
                      <Phone size={13} />
                      Book Now
                    </button>
                  ) : (
                    <div className="flex flex-col items-end gap-1 flex-1 sm:flex-none">
                      <button disabled className="btn-gold opacity-50 cursor-not-allowed w-full justify-center grayscale">
                        PROPERTY COMING SOON
                      </button>
                      <Link href="/properties/the-palm-ayi-mensah" className="text-[0.6rem] text-[var(--gold)] underline tracking-widest uppercase font-bold hover:text-white transition-colors">
                        Book "Milehigh5280" Instead
                      </Link>
                    </div>
                  )}
                  <button onClick={onClose} className="btn-ghost flex-1 sm:flex-none justify-center">
                    Close
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
