'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Wifi, Snowflake, UtensilsCrossed, Car, 
  WashingMachine, Tv, Share2, Heart, 
  MapPin, Users, Bed, Bath, Shield, Star,
  Plane, ExternalLink, Phone, X
} from 'lucide-react';

const ICON_MAP: Record<string, any> = {
  wifi: Wifi,
  'air-conditioning': Snowflake,
  kitchen: UtensilsCrossed,
  parking: Car,
  washer: WashingMachine,
  tv: Tv,
};

export default function PropertyDetailPage({ params }: { params: { slug: string } }) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Mock data for The Palm - in a real app fetch using params.slug
  const property = {
    name: 'The Palm',
    price: '$150',
    location: 'Ayi Mensah, Accra, Ghana',
    tagline: 'Your Private Sanctuary in Ghana',
    description: 'A beautifully furnished private apartment in the serene Ayi Mensah area of Accra, managed by Milehigh Properties — offering comfort, privacy, and premium hospitality.',
    longDescription: 'Welcome to The Palm, your home away from home in the heart of Ghana. This luxury private apartment offers the perfect blend of modern comfort and authentic Ghanaian warmth. Located in the peaceful Ayi Mensah area, just 30 minutes from Accra\'s bustling city center, The Palm provides a tranquil escape while remaining conveniently close to attractions, restaurants, and amenities.',
    specs: { guests: 4, bedrooms: 2, bathrooms: 1, beds: 2 },
    images: {
      hero: 'https://res.cloudinary.com/dwsl2ktt2/image/upload/v1775548165/nwe1_vkdfe3.png',
      gallery: [
        'https://res.cloudinary.com/dwsl2ktt2/image/upload/v1775548165/nwe1_vkdfe3.png',
        'https://res.cloudinary.com/dwsl2ktt2/image/upload/v1775380667/ERR_jjr2hx.jpg',
        'https://res.cloudinary.com/dwsl2ktt2/image/upload/v1775296671/1_ijqfai.jpg',
        'https://res.cloudinary.com/dwsl2ktt2/image/upload/v1775296671/3_wgur1l.jpg',
        'https://res.cloudinary.com/dwsl2ktt2/image/upload/v1775296671/2_xvzt1y.jpg',
        'https://res.cloudinary.com/dwsl2ktt2/image/upload/v1775296671/6_ffo1ly.jpg',
        'https://res.cloudinary.com/dwsl2ktt2/image/upload/v1775296671/4_xgzoyo.jpg'
      ]
    },
    amenities: ['wifi', 'air-conditioning', 'kitchen', 'parking', 'washer', 'tv'],
    rating: 4.9,
    reviews: 28
  };

  const openLightbox = (url: string) => {
    setSelectedImage(url);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setSelectedImage(null);
    document.body.style.overflow = 'auto';
  };

  return (
    <div className="min-h-screen bg-white text-[#080808]">
      {/* Header / Nav */}
      <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
        <Link href="/" className="text-sm font-medium text-gray-500 hover:text-black flex items-center gap-2 transition-colors">
          ← Back to Search
        </Link>
        <div className="flex gap-4">
          <button className="p-2 border border-gray-200 rounded-full hover:bg-gray-50 transition-colors">
            <Share2 size={18} />
          </button>
          <button className="p-2 border border-gray-200 rounded-full hover:bg-gray-50 transition-colors">
            <Heart size={18} />
          </button>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 mt-6 pb-20">
        {/* Hero Image Layout */}
        <div className="grid grid-cols-4 grid-rows-2 gap-4 h-[500px] mb-12 rounded-[2.5rem] overflow-hidden shadow-2xl">
          <div 
            className="col-span-2 row-span-2 group overflow-hidden cursor-pointer"
            onClick={() => openLightbox(property.images.hero)}
          >
            <img src={property.images.hero} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt={property.name} />
          </div>
          <div 
            className="col-span-2 row-span-1 group overflow-hidden cursor-pointer"
            onClick={() => openLightbox(property.images.gallery[1])}
          >
            <img src={property.images.gallery[1]} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt="Interior" />
          </div>
          <div 
            className="col-span-1 row-span-1 group overflow-hidden cursor-pointer"
            onClick={() => openLightbox(property.images.gallery[2])}
          >
            <img src={property.images.gallery[2]} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt="Kitchen" />
          </div>
          <div 
            className="col-span-1 row-span-1 bg-[#080808] flex items-center justify-center cursor-pointer hover:bg-gray-900 transition-colors"
            onClick={() => openLightbox(property.images.hero)}
          >
             <span className="text-white font-medium text-sm">+ See more</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          {/* Left Content */}
          <div className="lg:col-span-2 space-y-12">
            <div>
              <div className="flex items-center gap-2 mb-2 text-sm">
                <div className="flex items-center gap-1 text-[#D4AF37]">
                  <Star size={14} fill="currentColor" />
                  <span className="font-bold">{property.rating}</span>
                </div>
                <span className="text-gray-300">•</span>
                <span className="text-gray-500 underline underline-offset-4">{property.reviews} reviews</span>
              </div>
              <h1 className="text-5xl font-serif text-gray-900 mb-2 tracking-tight">{property.name}</h1>
              <p className="text-xl text-gray-400 font-light italic">{property.tagline}</p>
            </div>

            {/* Stats Bar */}
            <div className="flex flex-wrap gap-10 py-10 border-y border-gray-100">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gray-50 rounded-2xl"><Users size={22} className="text-gray-600" /></div>
                <div><p className="text-[10px] text-gray-400 uppercase tracking-widest font-black">Capacity</p><p className="text-lg font-bold">{property.specs.guests} Guests</p></div>
              </div>
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gray-50 rounded-2xl"><Bed size={22} className="text-gray-600" /></div>
                <div><p className="text-[10px] text-gray-400 uppercase tracking-widest font-black">Bedrooms</p><p className="text-lg font-bold">{property.specs.bedrooms}</p></div>
              </div>
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gray-50 rounded-2xl"><Bath size={22} className="text-gray-600" /></div>
                <div><p className="text-[10px] text-gray-400 uppercase tracking-widest font-black">Bathrooms</p><p className="text-lg font-bold">{property.specs.bathrooms}</p></div>
              </div>
            </div>

            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-gray-900 font-serif">About this sanctuary</h2>
              <p className="text-gray-600 text-lg leading-relaxed">{property.longDescription}</p>
            </div>

            {/* Amenities Section */}
            <div className="pt-8">
              <h2 className="text-2xl font-semibold mb-8 text-gray-900 font-serif">Included Amenities</h2>
              <div className="grid grid-cols-2 gap-y-8">
                {property.amenities.map(amenity => {
                  const Icon = ICON_MAP[amenity] || Shield;
                  return (
                    <div key={amenity} className="flex items-center gap-5 group">
                      <div className="p-2 rounded-lg bg-gray-50 group-hover:bg-[#D4AF37]/10 transition-colors">
                        <Icon size={22} className="text-gray-700 group-hover:text-[#D4AF37] transition-colors" />
                      </div>
                      <span className="text-gray-600 capitalize text-lg">{amenity.replace('-', ' ')}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Where We Are Section */}
            <div className="pt-12 border-t border-gray-100">
              <h2 className="text-3xl font-serif text-gray-900 mb-2">Where We Are</h2>
              <p className="text-gray-500 mb-8">Nestled in the serene, lush hills of Ayi Mensah — a hidden gem just 30 minutes from Accra city centre.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 bg-gray-50 rounded-[2.5rem] p-10">
                <div className="space-y-8">
                  <div className="flex items-start gap-4">
                    <MapPin className="text-[#D4AF37] mt-1" size={20} />
                    <div>
                      <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-1">Address</p>
                      <p className="text-lg font-medium">Ayi Mensah, Accra, Ghana</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <Phone className="text-[#D4AF37] mt-1" size={20} />
                    <div>
                      <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-1">Phone</p>
                      <p className="text-lg font-medium">+233 059 975 4270</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <Plane className="text-[#D4AF37] mt-1" size={20} />
                    <div>
                      <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-1">From Airport</p>
                      <p className="text-lg font-medium">~35 min drive</p>
                    </div>
                  </div>
                  <button className="flex items-center gap-2 text-[#D4AF37] font-bold hover:underline pt-2">
                    Open in Google Maps <ExternalLink size={16} />
                  </button>
                </div>
                <div className="h-64 md:h-full bg-gray-200 rounded-3xl overflow-hidden relative">
                  <img src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=800&q=80" className="w-full h-full object-cover opacity-80 grayscale" alt="Map Location" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="p-4 bg-white rounded-full shadow-2xl animate-bounce">
                      <MapPin size={32} className="text-[#D4AF37]" fill="#D4AF37" fillOpacity={0.2} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar / Booking */}
          <div className="lg:col-span-1">
            <div className="p-8 border border-gray-100 rounded-[2.5rem] shadow-xl sticky top-10 bg-white space-y-8">
              <div>
                <p className="text-[10px] text-gray-400 uppercase tracking-widest font-black mb-1">Per Night</p>
                <h3 className="text-5xl font-bold text-gray-900 font-serif">{property.price}</h3>
              </div>
              
              <div className="space-y-4">
                <button className="w-full py-5 bg-[#080808] text-white rounded-2xl font-bold hover:bg-gray-800 transition-all shadow-lg transform active:scale-[0.98]">
                  Reserve Sanctuary
                </button>
                <button className="w-full py-4 border border-gray-200 text-gray-900 rounded-2xl font-bold hover:bg-gray-50 transition-all">
                  Contact Concierge
                </button>
              </div>
              <p className="text-center text-xs text-gray-400 font-medium italic">Managed by Milehigh Properties</p>
            </div>
          </div>
        </div>
      </main>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/95 backdrop-blur-sm p-4 lg:p-12"
            onClick={closeLightbox}
          >
            <button 
              className="absolute top-8 right-8 text-white/70 hover:text-white transition-colors z-10"
              onClick={closeLightbox}
            >
              <X size={32} />
            </button>
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-full max-h-full flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <img 
                src={selectedImage} 
                className="max-w-full max-h-full object-contain rounded-lg shadow-2xl" 
                alt="Property detail zoom"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}