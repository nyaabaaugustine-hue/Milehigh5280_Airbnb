import type { Property } from '@/types';

export const USD_TO_GHS = 15.8;

export const properties: Property[] = [
  // ─── Property 1: Milehigh5280 Airbnb(YOUR REAL APARTMENT) ───────────────────────────
  {
    id: '1',
    slug: 'the-palm-ayi-mensah',
    name: 'Milehigh5280 Airbnb🌴',
    tagline: 'Your private sanctuary in the lush greenery of Ayi Mensah',
    description: 'A beautifully furnished private apartment nestled in the tranquil, tree-lined neighbourhood of Ayi Mensah — where nature, comfort, and elegance converge.',
    longDescription: `Milehigh5280 Airbnb is a meticulously designed private apartment that offers an unparalleled blend of modern luxury and tropical serenity in the sought-after Ayi Mensah area of Accra.

Step inside to discover a thoughtfully curated living space — warm tones, high-quality furnishings, and an abundance of natural light. Whether you're here for business, leisure, or a quiet getaway, Milehigh5280 Airbnbdelivers a hotel-quality experience with the warmth and privacy of your own home.

The property is managed by Rehoboth Properties, a trusted name in premium short-stay accommodation in Ghana. You'll be hosted with care, attentiveness, and the highest standards of hospitality from check-in to check-out.`,
    location: {
      city: 'Accra',
      region: 'Greater Accra',
      country: 'Ghana',
      coordinates: { lat: 5.792905, lng: -0.181711 },
      address: 'Ayi Mensah, Accra, Ghana',
    },
    pricing: {
      perNight: 250,
      perNightGHS: 3950,
      cleaningFee: 30,
      serviceFee: 25,
      minNights: 1,
    },
    capacity: {
      guests: 4,
      bedrooms: 2,
      beds: 2,
      bathrooms: 2,
    },
    images: [
      { id: '1-1', url: 'https://res.cloudinary.com/dwsl2ktt2/image/upload/v1775296671/5_yc05lt.jpg',  alt: 'Milehigh5280 Airbnb- Stylish living room', category: 'hero' },
      { id: '1-2', url: 'https://res.cloudinary.com/dwsl2ktt2/image/upload/v1775296671/1_ijqfai.jpg',  alt: 'Milehigh5280 Airbnb- Master bedroom', category: 'interior' },
      { id: '1-3', url: 'https://res.cloudinary.com/dwsl2ktt2/image/upload/v1775296671/3_wgur1l.jpg',  alt: 'Milehigh5280 Airbnb- Dining and kitchen area', category: 'interior' },
      { id: '1-4', url: 'https://res.cloudinary.com/dwsl2ktt2/image/upload/v1775296671/2_xvzt1y.jpg',  alt: 'Milehigh5280 Airbnb- Second bedroom', category: 'interior' },
      { id: '1-5', url: 'https://res.cloudinary.com/dwsl2ktt2/image/upload/v1775296671/6_ffo1ly.jpg',  alt: 'Milehigh5280 Airbnb- Lounge area', category: 'interior' },
      { id: '1-6', url: 'https://res.cloudinary.com/dwsl2ktt2/image/upload/v1775296671/4_xgzoyo.jpg',  alt: 'Milehigh5280 Airbnb- Bathroom', category: 'interior' },
      { id: '1-7', url: 'https://res.cloudinary.com/dwsl2ktt2/image/upload/v1775296670/7_wv1u9h.jpg',  alt: 'Milehigh5280 Airbnb- Exterior view', category: 'exterior' },
    ],
    amenities: [
      { id: 'a1', label: 'High-Speed WiFi', icon: 'Wifi', category: 'essential' },
      { id: 'a2', label: 'Air Conditioning', icon: 'Wind', category: 'essential' },
      { id: 'a3', label: 'Smart TV', icon: 'MonitorPlay', category: 'entertainment' },
      { id: 'a4', label: 'Fully Equipped Kitchen', icon: 'UtensilsCrossed', category: 'kitchen' },
      { id: 'a5', label: 'Private Parking', icon: 'Car', category: 'essential' },
      { id: 'a6', label: '24/7 Security', icon: 'Shield', category: 'essential' },
      { id: 'a7', label: 'Washing Machine', icon: 'Shirt', category: 'essential' },
      { id: 'a8', label: 'Backup Generator', icon: 'Zap', category: 'essential' },
      { id: 'a9', label: 'Tropical Garden', icon: 'TreePalm', category: 'outdoor' },
      { id: 'a10', label: 'Water Heater', icon: 'Droplets', category: 'essential' },
    ],
    features: [
      'Quiet, serene neighbourhood',
      'Easy access to Accra CBD',
      'Self check-in available',
      'Weekly housekeeping',
      'Host on-call support',
      'Pet-friendly on request',
    ],
    rating: 4.92,
    reviewCount: 38,
    reviews: [
      {
        id: 'r1', author: 'Kwame A.', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&q=80',
        country: 'Ghana', rating: 5, date: 'March 2025', stayDuration: '5 nights',
        comment: 'Milehigh5280 Airbnbexceeded all my expectations. The apartment is immaculate, modern, and so peaceful. Ayi Mensah is such a beautiful area — I woke up to birds every morning. Highly recommend Rehoboth Properties!',
      },
      {
        id: 'r2', author: 'Diana O.', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&q=80',
        country: 'United Kingdom', rating: 5, date: 'February 2025', stayDuration: '7 nights',
        comment: 'Coming back to Ghana to visit family and this was the perfect base. The neighbourhood is lush and green, the apartment feels like a proper home. The host was incredibly responsive and helpful.',
      },
    ],
    availability: [],
    type: 'apartment',
    badge: 'Editors Choice',
    featured: true,
  },

  // ─── Property 2: SIMULATED ─────────────────────────────────────────────────
  {
    id: '2',
    slug: 'jade-suite-east-legon',
    name: 'Jade Suite',
    tagline: 'Sleek urban luxury in the heart of East Legon',
    description: 'A refined studio-to-2-bed suite in a secure East Legon residence — ideal for executives, couples, and diaspora visitors seeking polished Accra living.',
    longDescription: `Jade Suite is your elevated urban retreat in East Legon, one of Accra's most vibrant and cosmopolitan neighbourhoods. The property features contemporary interiors with bold African accents — think kente-woven throw pillows, reclaimed teak furniture, and a statement gallery wall of Ghanaian photography.

Steps from the best restaurants on the East Legon strip, with quick access to Kotoka International Airport, the Jade Suite is designed for the modern traveller who wants style without compromise.

Managed by Rehoboth Properties with the same standard of care and professionalism as all our listings.`,
    location: {
      city: 'Accra',
      region: 'Greater Accra',
      country: 'Ghana',
      coordinates: { lat: 5.6395, lng: -0.1447 },
      address: 'East Legon, Accra, Ghana',
    },
    pricing: {
      perNight: 190,
      perNightGHS: 3002,
      cleaningFee: 25,
      serviceFee: 19,
      minNights: 2,
    },
    capacity: {
      guests: 3,
      bedrooms: 1,
      beds: 1,
      bathrooms: 1,
    },
    images: [
      { id: '2-1', url: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1600&q=90', alt: 'Jade Suite - Contemporary living room', category: 'hero' },
      { id: '2-2', url: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1200&q=85', alt: 'Jade Suite - Stylish bedroom', category: 'interior' },
      { id: '2-3', url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=85', alt: 'Jade Suite - Kitchen', category: 'interior' },
      { id: '2-4', url: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1200&q=85', alt: 'Jade Suite - Balcony view', category: 'exterior' },
    ],
    amenities: [
      { id: 'b1', label: 'High-Speed WiFi', icon: 'Wifi', category: 'essential' },
      { id: 'b2', label: 'Air Conditioning', icon: 'Wind', category: 'essential' },
      { id: 'b3', label: 'Smart TV', icon: 'MonitorPlay', category: 'entertainment' },
      { id: 'b4', label: 'Equipped Kitchen', icon: 'UtensilsCrossed', category: 'kitchen' },
      { id: 'b5', label: 'Gym Access', icon: 'Dumbbell', category: 'premium' },
      { id: 'b6', label: 'Private Parking', icon: 'Car', category: 'essential' },
      { id: 'b7', label: '24/7 Security', icon: 'Shield', category: 'essential' },
      { id: 'b8', label: 'City View Balcony', icon: 'Building2', category: 'outdoor' },
    ],
    features: [
      'Minutes from airport',
      'Walking distance to restaurants',
      'Smart home controls',
      'Concierge on call',
      'Secure parking',
    ],
    rating: 4.88,
    reviewCount: 24,
    reviews: [
      {
        id: 'r3', author: 'Marcus T.', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&q=80',
        country: 'United States', rating: 5, date: 'January 2025', stayDuration: '4 nights',
        comment: 'Perfect spot for a business trip. Clean, modern, close to everything in East Legon. The gym was a bonus and the WiFi was fast enough for video calls all day.',
      },
    ],
    availability: [],
    type: 'apartment',
    badge: 'Most Booked',
    featured: true,
  },

  // ─── Property 3: SIMULATED ─────────────────────────────────────────────────
  {
    id: '3',
    slug: 'serenity-villa-trasacco',
    name: 'Serenity Villa',
    tagline: 'Expansive family villa with pool in Trasacco Valley',
    description: 'A stunning 4-bedroom private villa within the prestigious Trasacco Valley estate — gated, staffed, and built for families and groups who want space and security.',
    longDescription: `Serenity Villa offers generous, resort-style living within the walled tranquility of Trasacco Valley, one of Accra's most coveted gated communities. Set on a landscaped plot with a private pool, outdoor dining pavilion, and lush tropical garden, this is the perfect setting for family holidays, reunion gatherings, or an extended executive stay.

Inside, you'll find four spacious en-suite bedrooms, a grand open-plan living and dining area, a fully equipped gourmet kitchen, and a dedicated home office for remote workers.

Rehoboth Properties provides a house manager, daily housekeeping, and airport pickup for all Serenity Villa guests.`,
    location: {
      city: 'Accra',
      region: 'Greater Accra',
      country: 'Ghana',
      coordinates: { lat: 5.6521, lng: -0.1635 },
      address: 'Trasacco Valley, East Legon Hills, Accra, Ghana',
    },
    pricing: {
      perNight: 480,
      perNightGHS: 7584,
      cleaningFee: 80,
      serviceFee: 48,
      minNights: 3,
    },
    capacity: {
      guests: 10,
      bedrooms: 4,
      beds: 5,
      bathrooms: 4,
    },
    images: [
      { id: '3-1', url: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=1600&q=90', alt: 'Serenity Villa - Exterior with pool', category: 'hero' },
      { id: '3-2', url: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&q=85', alt: 'Serenity Villa - Grand living room', category: 'interior' },
      { id: '3-3', url: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1200&q=85', alt: 'Serenity Villa - Master bedroom', category: 'interior' },
      { id: '3-4', url: 'https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=1200&q=85', alt: 'Serenity Villa - Private pool', category: 'amenity' },
      { id: '3-5', url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1200&q=85', alt: 'Serenity Villa - Kitchen', category: 'interior' },
    ],
    amenities: [
      { id: 'c1', label: 'Private Pool', icon: 'Waves', category: 'outdoor' },
      { id: 'c2', label: 'House Manager', icon: 'Bell', category: 'premium' },
      { id: 'c3', label: 'Private Chef (on request)', icon: 'ChefHat', category: 'premium' },
      { id: 'c4', label: 'Home Cinema', icon: 'MonitorPlay', category: 'entertainment' },
      { id: 'c5', label: 'High-Speed WiFi', icon: 'Wifi', category: 'essential' },
      { id: 'c6', label: 'Gated Estate', icon: 'Shield', category: 'essential' },
      { id: 'c7', label: 'Outdoor BBQ', icon: 'Flame', category: 'outdoor' },
      { id: 'c8', label: 'Air Conditioning', icon: 'Wind', category: 'essential' },
      { id: 'c9', label: 'Gym', icon: 'Dumbbell', category: 'premium' },
      { id: 'c10', label: 'Tropical Garden', icon: 'TreePalm', category: 'outdoor' },
    ],
    features: [
      'Gated Trasacco Valley estate',
      'Daily housekeeping included',
      'Airport pickup available',
      'Smart home system',
      'Great for family gatherings',
      'Home office included',
    ],
    rating: 4.95,
    reviewCount: 19,
    reviews: [
      {
        id: 'r4', author: 'Abena F.', avatar: 'https://images.unsplash.com/photo-1548142813-c348350df52b?w=80&q=80',
        country: 'Ghana', rating: 5, date: 'December 2024', stayDuration: '5 nights',
        comment: 'We used this for a family Christmas gathering and it was absolutely perfect. The pool was the highlight — kids loved it. The house manager Kofi was outstanding. Would book again in a heartbeat.',
      },
    ],
    availability: [],
    type: 'villa',
    badge: 'New Arrival',
    featured: true,
  },
];

// ─── Helper Functions ─────────────────────────────────────────────────────────
export const getFeaturedProperties = () => properties.filter(p => p.featured);
export const getPropertyById    = (id: string)   => properties.find(p => p.id === id);
export const getPropertyBySlug  = (slug: string) => properties.find(p => p.slug === slug);

export const formatCurrency = (amount: number, currency: 'USD' | 'GHS' = 'USD') => {
  if (currency === 'GHS') {
    return new Intl.NumberFormat('en-GH', { style: 'currency', currency: 'GHS', minimumFractionDigits: 0 }).format(amount);
  }
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(amount);
};

export const calculatePrice = (
  property: Property,
  checkIn: Date,
  checkOut: Date,
  currency: 'USD' | 'GHS' = 'USD',
) => {
  const msPerDay = 1000 * 60 * 60 * 24;
  const nights   = Math.max(1, Math.round((checkOut.getTime() - checkIn.getTime()) / msPerDay));
  const rate     = currency === 'GHS' ? property.pricing.perNightGHS : property.pricing.perNight;
  const cleaning = currency === 'GHS' ? property.pricing.cleaningFee * USD_TO_GHS : property.pricing.cleaningFee;
  const service  = currency === 'GHS' ? property.pricing.serviceFee * USD_TO_GHS  : property.pricing.serviceFee;
  return {
    nights,
    nightlyRate:  rate,
    nightsTotal:  rate * nights,
    cleaningFee:  cleaning,
    serviceFee:   service,
    total:        rate * nights + cleaning + service,
    currency,
  };
};
