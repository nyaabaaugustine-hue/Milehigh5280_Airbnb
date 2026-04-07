'use client';

import { useState } from 'react';
import Image from 'next/image';
import { type Property } from '@/types';
import { formatCurrency } from '@/lib/data';

export default function PropertyCard({ property }: { property: Property }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className="group relative border rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 bg-white">
        <div className="relative h-72 w-full overflow-hidden">
          <Image 
            src={property.images[0].url} 
            alt={property.name} 
            fill 
            className="object-cover group-hover:scale-110 transition-transform duration-700"
          />
        </div>
        <div className="p-6">
          <h3 className="text-2xl font-semibold text-slate-900">{property.name}</h3>
          <p className="text-gray-500">{property.location.city}, {property.location.country}</p>
          <button 
            onClick={() => setIsOpen(true)}
            className="mt-4 w-full bg-slate-900 text-white py-3.5 rounded-xl font-medium hover:bg-slate-800 transition-colors shadow-sm"
          >
            View Property
          </button>
        </div>
      </div>

      {/* Premium Detail Popup */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
          <div className="relative bg-white rounded-[2rem] max-w-6xl w-full max-h-[90vh] overflow-hidden shadow-2xl flex flex-col md:flex-row animate-in zoom-in-95 duration-300">
            
            {/* Close Button */}
            <button 
              onClick={() => setIsOpen(false)}
              className="absolute top-6 right-6 bg-black/10 hover:bg-black/20 p-3 rounded-full text-slate-900 z-20 backdrop-blur-md transition-colors"
            >
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12"/></svg>
            </button>

            {/* Left: Visuals */}
            <div className="md:w-3/5 h-80 md:h-auto relative bg-slate-100">
              <Image src={property.images[0].url} alt={property.name} fill className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
            </div>

            {/* Right: Premium Details */}
            <div className="md:w-2/5 p-8 md:p-12 overflow-y-auto flex flex-col">
              <div className="mb-6">
                <span className="text-amber-600 font-bold tracking-widest text-xs uppercase bg-amber-50 px-3 py-1 rounded-full">Premium Listing</span>
                <h2 className="text-4xl font-serif font-bold text-slate-900 mt-4 mb-2">{property.name}</h2>
                <p className="text-gray-500 font-medium">{property.tagline}</p>
              </div>
              
              <p className="text-3xl font-light text-slate-900 mb-8">
                {formatCurrency(property.pricing.perNight)} <span className="text-lg text-gray-400">/ night</span>
              </p>
              
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <p className="text-gray-400 text-xs uppercase tracking-tight">Bedrooms</p>
                  <p className="font-bold text-slate-900 text-lg">{property.capacity.bedrooms}</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <p className="text-gray-400 text-xs uppercase tracking-tight">Bathrooms</p>
                  <p className="font-bold text-slate-900 text-lg">{property.capacity.bathrooms}</p>
                </div>
              </div>

              <p className="text-gray-600 leading-relaxed mb-8">
                {property.longDescription}
              </p>

              <button className="mt-auto bg-slate-900 text-white py-4 rounded-2xl font-bold text-lg hover:bg-slate-800 hover:shadow-xl transition-all active:scale-[0.98]">
                Inquire Availability
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}