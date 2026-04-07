import type { Property, BlogPost } from '@/types';

export const USD_TO_GHS = 15.8;

// ─── Contact Info — single source of truth ────────────────────────────────────
export const CONTACT_INFO = {
  phone:    '+17207059849',
  whatsapp: '17207059849',
  email:    'herbertprempeh@gmail.com',
  location: 'Ayi Mensah, Accra, Ghana',
};

export const properties: Property[] = [
  // ─── Milehigh5280 — The One & Only ────────────────────────────────────────
  {
    id: '1',
    slug: 'the-palm-ayi-mensah',
    name: 'Milehigh5280 🌴',
    tagline: 'Your private sanctuary in the lush greenery of Ayi Mensah',
    description: 'A beautifully furnished private apartment nestled in the tranquil, tree-lined neighbourhood of Ayi Mensah — where nature, comfort, and elegance converge.',
    longDescription: `Milehigh5280 is a meticulously designed private apartment that offers an unparalleled blend of modern luxury and tropical serenity in the sought-after Ayi Mensah area of Accra.

Step inside to discover a thoughtfully curated living space — warm tones, high-quality furnishings, and an abundance of natural light. Whether you're here for business, leisure, or a quiet getaway, Milehigh5280 delivers a hotel-quality experience with the warmth and privacy of your own home.

The property is managed by Milehigh Properties, a trusted name in premium short-stay accommodation in Ghana. You'll be hosted with care, attentiveness, and the highest standards of hospitality from check-in to check-out.`,
    location: {
      city: 'Accra',
      region: 'Greater Accra',
      country: 'Ghana',
      coordinates: { lat: 5.792905, lng: -0.181711 },
      address: 'Ayi Mensah, Accra, Ghana',
    },
    pricing: {
      perNight:    50,
      perNightGHS: 790,
      cleaningFee: 30,
      serviceFee:  25,
      minNights:   1,
    },
    capacity: {
      guests:    4,
      bedrooms:  2,
      beds:      2,
      bathrooms: 2,
    },
    images: [
      { id: '1-1',  url: 'https://res.cloudinary.com/dwsl2ktt2/image/upload/v1775380667/ERR_jjr2hx.jpg',   alt: 'Milehigh5280 - Scenic View',         category: 'hero' },
      { id: '1-2',  url: 'https://res.cloudinary.com/dwsl2ktt2/image/upload/v1775296671/1_ijqfai.jpg',     alt: 'Milehigh5280 - Master bedroom',      category: 'interior' },
      { id: '1-3',  url: 'https://res.cloudinary.com/dwsl2ktt2/image/upload/v1775296671/3_wgur1l.jpg',     alt: 'Milehigh5280 - Dining and kitchen',  category: 'interior' },
      { id: '1-4',  url: 'https://res.cloudinary.com/dwsl2ktt2/image/upload/v1775296671/2_xvzt1y.jpg',     alt: 'Milehigh5280 - Second bedroom',      category: 'interior' },
      { id: '1-5',  url: 'https://res.cloudinary.com/dwsl2ktt2/image/upload/v1775296671/6_ffo1ly.jpg',     alt: 'Milehigh5280 - Lounge area',         category: 'interior' },
      { id: '1-6',  url: 'https://res.cloudinary.com/dwsl2ktt2/image/upload/v1775296671/4_xgzoyo.jpg',     alt: 'Milehigh5280 - Bathroom',            category: 'interior' },
      { id: '1-7',  url: 'https://res.cloudinary.com/dwsl2ktt2/image/upload/v1775296670/7_wv1u9h.jpg',     alt: 'Milehigh5280 - Exterior view',       category: 'exterior' },
      { id: '1-8',  url: 'https://res.cloudinary.com/dwsl2ktt2/image/upload/v1775302731/A_2_kwg4sf.jpg',   alt: 'Milehigh5280 - Modern interior',     category: 'interior' },
      { id: '1-9',  url: 'https://res.cloudinary.com/dwsl2ktt2/image/upload/v1775380667/ERR_jjr2hx.jpg',   alt: 'Milehigh5280 - Bedroom view',        category: 'interior' },
      { id: '1-10', url: 'https://res.cloudinary.com/dwsl2ktt2/image/upload/v1775548165/nwe1_vkdfe3.png',   alt: 'Milehigh5280 - Premium amenity',     category: 'amenity' },
      { id: '1-11', url: 'https://res.cloudinary.com/dwsl2ktt2/image/upload/v1775302732/A_3_dcbuqu.jpg',   alt: 'Milehigh5280 - Interior detail',     category: 'amenity' },
    ],
    amenities: [
      { id: 'a1',  label: 'High-Speed WiFi',       icon: 'Wifi',            category: 'essential' },
      { id: 'a2',  label: 'Air Conditioning',       icon: 'Wind',            category: 'essential' },
      { id: 'a3',  label: 'Smart TV',               icon: 'MonitorPlay',     category: 'entertainment' },
      { id: 'a4',  label: 'Fully Equipped Kitchen', icon: 'UtensilsCrossed', category: 'kitchen' },
      { id: 'a5',  label: 'Private Parking',        icon: 'Car',             category: 'essential' },
      { id: 'a6',  label: '24/7 Security',          icon: 'Shield',          category: 'essential' },
      { id: 'a7',  label: 'Washing Machine',        icon: 'Shirt',           category: 'essential' },
      { id: 'a8',  label: 'Backup Generator',       icon: 'Zap',             category: 'essential' },
      { id: 'a9',  label: 'Tropical Garden',        icon: 'TreePalm',        category: 'outdoor' },
      { id: 'a10', label: 'Water Heater',           icon: 'Droplets',        category: 'essential' },
    ],
    features: [
      'Quiet, serene neighbourhood',
      'Easy access to Accra CBD',
      'Self check-in available',
      'Weekly housekeeping',
      'Host on-call support',
      'Pet-friendly on request',
    ],
    rating:      4.92,
    reviewCount: 38,
    reviews: [
      {
        id: 'r1', author: 'Kwame A.',
        avatar:       'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&q=80',
        country:      'Ghana',
        rating:       5,
        date:         'March 2025',
        stayDuration: '5 nights',
        comment:      'Milehigh5280 exceeded all my expectations. The apartment is immaculate, modern, and so peaceful. Ayi Mensah is such a beautiful area — I woke up to birds every morning. Highly recommend!',
      },
      {
        id: 'r2', author: 'Diana O.',
        avatar:       'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&q=80',
        country:      'United Kingdom',
        rating:       5,
        date:         'February 2025',
        stayDuration: '7 nights',
        comment:      'Coming back to Ghana to visit family and this was the perfect base. The neighbourhood is lush and green, the apartment feels like a proper home. The host was incredibly responsive and helpful.',
      },
    ],
    availability: [],
    type:     'apartment',
    badge:    'Editors Choice',
    featured: true,
    isLive:   true,
  },
];

// ─── Blog Posts ───────────────────────────────────────────────────────────────
export const blogPosts: BlogPost[] = [
  {
    id: 'post-1', slug: 'exploring-ayi-mensah-hidden-gem',
    title:    'Ayi Mensah: The Hidden Gem of Greater Accra',
    excerpt:  'Discover why travelers are choosing the serene hills of Ayi Mensah over the busy city center.',
    content:  'Full article content goes here...',
    author:   'Milehigh Concierge',
    date:     'March 15, 2025',
    readTime: '5 min read',
    image:    'https://res.cloudinary.com/dwsl2ktt2/image/upload/v1775449500/download_2_yntthc.jpg',
    category: 'Ghana',
    featured: true,
  },
  {
    id: 'post-2', slug: 'top-restaurants-east-legon',
    title:    "A Foodie's Guide to East Legon",
    excerpt:  'From local Ghanaian flavors to international fine dining, these are the must-visit spots near Ayi Mensah.',
    content:  'Full article content goes here...',
    author:   'Herbert Prempeh',
    date:     'March 10, 2025',
    readTime: '8 min read',
    image:    'https://res.cloudinary.com/dwsl2ktt2/image/upload/v1775449500/download_2_yntthc.jpg',
    category: 'Travel',
  },
  {
    id: 'post-3', slug: 'ghana-heritage-tour-experience',
    title:    'The Grand Ghana Heritage Tour 2025',
    excerpt:  'A preview of our exclusive 10-day curated journey through Accra, Kumasi, and Cape Coast.',
    content:  'Full article content goes here...',
    author:   'Milehigh Concierge',
    date:     'March 05, 2025',
    readTime: '6 min read',
    image:    'https://res.cloudinary.com/dwsl2ktt2/image/upload/v1775449500/gg_gq7hdb.jpg',
    category: 'Ghana',
  },
];

// ─── Helper Functions ─────────────────────────────────────────────────────────
export const posts = blogPosts; // Alias for generateStaticParams compatibility

export const getLiveProperties     = () => properties.filter(p => p.isLive !== false);
export const getFeaturedProperties = () => properties.filter(p => p.featured);
export const getPropertyById       = (id: string)   => properties.find(p => p.id === id);
export const getPropertyBySlug     = (slug: string) => properties.find(p => p.slug === slug);

export const getLatestPosts  = (limit = 3) =>
  [...blogPosts]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, limit);
export const getPostBySlug   = (slug: string) => blogPosts.find(p => p.slug === slug);
export const getFeaturedPost = () => blogPosts.find(p => p.featured) ?? blogPosts[0];

export const formatCurrency = (amount: number, currency: 'USD' | 'GHS' = 'USD') => {
  if (currency === 'GHS') {
    return new Intl.NumberFormat('en-GH', { style: 'currency', currency: 'GHS', minimumFractionDigits: 0 }).format(amount);
  }
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(amount);
};

export const calculatePrice = (
  property: Property,
  checkIn:  Date,
  checkOut: Date,
  currency: 'USD' | 'GHS' = 'USD',
) => {
  const msPerDay = 1000 * 60 * 60 * 24;
  const nights   = Math.max(1, Math.round((checkOut.getTime() - checkIn.getTime()) / msPerDay));
  const rate     = currency === 'GHS' ? property.pricing.perNightGHS : property.pricing.perNight;
  const cleaning = currency === 'GHS' ? property.pricing.cleaningFee * USD_TO_GHS : property.pricing.cleaningFee;
  const service  = currency === 'GHS' ? property.pricing.serviceFee  * USD_TO_GHS : property.pricing.serviceFee;
  return { nights, nightlyRate: rate, nightsTotal: rate * nights, cleaningFee: cleaning, serviceFee: service, total: rate * nights + cleaning + service, currency };
};
