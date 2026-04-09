// This is a server-safe data file. Do not add 'use client' here.

import type { Property, BlogPost } from '@/types';

export const USD_TO_GHS = 15.8;

export const LANGUAGES = [
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'es', label: 'Español', flag: '🇪🇸' },
  { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
  { code: 'zh', label: '中文', flag: '🇨🇳' },
  { code: 'ar', label: 'العربية', flag: '🇸🇦' },
  { code: 'pt', label: 'Português', flag: '🇵🇹' },
  { code: 'ja', label: '日本語', flag: '🇯🇵' },
  { code: 'ru', label: 'Русский', flag: '🇷🇺' },
  { code: 'it', label: 'Italiano', flag: '🇮🇹' },
  { code: 'ko', label: '한국어', flag: '🇰🇷' },
  { code: 'hi', label: 'हिन्दी', flag: '🇮🇳' },
] as const;

// ─── Contact Info — single source of truth ────────────────────────────────────
export const CONTACT_INFO = {
  phone:    '+233 059 975 4270',
  whatsapp: '233599754270',
  email:    'herbertprempeh@gmail.com',
  location: 'Ayi Mensah, Accra, Ghana',
};

// ─── Translation Dictionary ──────────────────────────────────────────────────
export const TRANSLATIONS = {
  en: {
    guideHeroTitle: "Your Complete",
    guideHeroSubtitle: "Ghana Guide",
    guideHeroDesc: "Everything a first-time or returning visitor needs — from visa applications to hidden waterfalls, currency tips to safety essentials. Curated by the Milehigh team.",
    labels: {
      travelIntel: "Travel Intelligence",
      airport: "Airport Transfer",
      visa: "Visa & Entry",
      safety: "Safety & Health",
      tours: "Tours & Day Trips",
      currency: "Currency",
      accessibility: "Accessibility",
      booking: "Booking Inquiry"
    }
  },
  fr: {
    guideHeroTitle: "Votre Complet",
    guideHeroSubtitle: "Guide du Ghana",
    guideHeroDesc: "Tout ce dont un visiteur a besoin — des demandes de visa aux cascades cachées, des conseils sur la devise aux essentiels de sécurité. Organisé par l'équipe Milehigh.",
    labels: {
      travelIntel: "Intelligence Voyage",
      airport: "Transfert Aéroport",
      visa: "Visa et Entrée",
      safety: "Santé et Sécurité",
      tours: "Tours et Excursions",
      currency: "Devise",
      accessibility: "Accessibilité",
      booking: "Demande de Réservation"
    }
  },
  es: {
    guideHeroTitle: "Su Guía",
    guideHeroSubtitle: "Completa de Ghana",
    guideHeroDesc: "Todo lo que un visitante necesita: desde solicitudes de visa hasta cascadas ocultas, consejos sobre moneda y elementos esenciales de seguridad.",
    labels: {
      travelIntel: "Inteligencia de Viaje",
      airport: "Traslado al Aeropuerto",
      visa: "Visa y Entrada",
      safety: "Seguridad y Salud",
      tours: "Tours y Excursions",
      currency: "Moneda",
      accessibility: "Accesibilidad",
      booking: "Consulta de Reserva"
    }
  },
  de: {
    guideHeroTitle: "Ihr Kompletter",
    guideHeroSubtitle: "Ghana Leitfaden",
    guideHeroDesc: "Alles, was ein Erstbesucher braucht – von Visumanträgen bis hin zu versteckten Wasserfällen, Währungstipps und Sicherheitsvorkehrungen.",
    labels: {
      travelIntel: "Reise-Informationen",
      airport: "Flughafentransfer",
      visa: "Visum & Einreise",
      safety: "Sicherheit & Gesundheit",
      tours: "Touren & Ausflüge",
      currency: "Währung",
      accessibility: "Barrierefreiheit",
      booking: "Buchungsanfrage"
    }
  },
  zh: {
    guideHeroTitle: "您的完整",
    guideHeroSubtitle: "加纳指南",
    guideHeroDesc: "首次或再次访问加纳的游客所需的一切——从签证申请到隐藏的瀑布，从货币提示到安全必备品。",
    labels: {
      travelIntel: "旅游情报",
      airport: "机场接送",
      visa: "签证和入境",
      safety: "安全与健康",
      tours: "旅行团和一日游",
      currency: "货币",
      accessibility: "无障碍设施",
      booking: "预订查询"
    }
  }
};

export const properties: Property[] = [
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
      bathrooms: 1,
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
        date:         'March 2026',
        stayDuration: '5 nights',
        comment:      'Milehigh5280 exceeded all my expectations. The apartment is immaculate, modern, and so peaceful. Ayi Mensah is such a beautiful area — I woke up to birds every morning. Highly recommend!',
      },
      {
        id: 'r2', author: 'Diana O.',
        avatar:       'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&q=80',
        country:      'United Kingdom',
        rating:       5,
        date:         'February 2026',
        stayDuration: '7 nights',
        comment:      'Coming back to Ghana to visit family and this was the perfect base. The neighbourhood is lush and green, the apartment feels like a proper home. The host was incredibly responsive and helpful.',
      },
      {
        id: 'r3', author: 'James & Sarah M.',
        avatar:       'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&q=80',
        country:      'United States',
        rating:       5,
        date:         'January 2026',
        stayDuration: '14 nights',
        comment:      'We stayed for two weeks while working remotely and it was absolutely perfect. High-speed WiFi, quiet neighbourhood, and the garden view from the bedroom was stunning. The AC was powerful and the backup generator gave us complete peace of mind during the occasional outages.',
      },
      {
        id: 'r4', author: 'Fatima A.',
        avatar:       'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&q=80',
        country:      'United Arab Emirates',
        rating:       5,
        date:         'December 2025',
        stayDuration: '3 nights',
        comment:      'From the moment we arrived, we felt at home. The apartment is beautifully decorated with Ghanaian art and the neighbourhood is so safe. The concierge arranged a private tour of Cape Coast which was the highlight of our trip!',
      },
      {
        id: 'r5', author: 'Michael K.',
        avatar:       'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&q=80',
        country:      'Germany',
        rating:       4,
        date:         'November 2025',
        stayDuration: '10 nights',
        comment:      'Great apartment in a lovely area. Very clean, comfortable bed, and the washing machine was a lifesaver for my long stay. Only minor issue was the street noise on weekends but nothing serious. Would definitely stay again.',
      },
      {
        id: 'r6', author: 'Amara T.',
        avatar:       'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=80&q=80',
        country:      'Canada',
        rating:       5,
        date:         'October 2025',
        stayDuration: '21 nights',
        comment:      'As a diaspora returnee, I was looking for a place that felt like Ghana but with modern amenities. Milehigh5280 delivered exactly that. The host even arranged a welcome package with local snacks! The rooftop views at sunset are unforgettable.',
      },
      {
        id: 'r7', author: 'Chen W.',
        avatar:       'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=80&q=80',
        country:      'China',
        rating:       5,
        date:         'September 2025',
        stayDuration: '4 nights',
        comment:      'Excellent base for exploring Accra. The apartment is exactly as pictured and the kitchen is fully equipped which was great for preparing local ingredients we bought from the market. The security presence in the neighbourhood is very reassuring.',
      },
      {
        id: 'r8', author: 'Priya S.',
        avatar:       'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&q=80',
        country:      'India',
        rating:       5,
        date:         'August 2025',
        stayDuration: '6 nights',
        comment:      'I booked this for my parents anniversary and the team went above and beyond. They arranged a private dinner setup in the garden with Ghanaian cuisine. The attention to detail was remarkable. My parents still talk about it!',
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
    id: 'post-1', slug: 'hidden-gems-ayi-mensah',
    title:    'Ayi Mensah: The Hidden Gems of Greater Accra',
    excerpt:  'Discover why travelers are choosing the serene hills of Ayi Mensah over the busy city center.',
    content:  'Full article content goes here...',
    author:   'Milehigh Concierge',
    date:     'March 15, 2026',
    readTime: '5 min read',
    image:    'https://res.cloudinary.com/dwsl2ktt2/image/upload/v1775449500/download_2_yntthc.jpg',
    category: 'Ghana',
    featured: true,
  },
  {
    id: 'post-2', slug: 'accra-vs-cape-town-2025',
    title:    'Accra vs Cape Town: The 2025 Travel Guide',
    excerpt:  'Comparing the two most vibrant cities in Africa for your next luxury stay.',
    content:  'Full article content goes here...',
    author:   'Herbert Prempeh',
    date:     'March 10, 2026',
    readTime: '8 min read',
    image:    'https://res.cloudinary.com/dwsl2ktt2/image/upload/v1775449500/download_2_yntthc.jpg',
    category: 'Ghana',
  },
  {
    id: 'post-3', slug: 'inside-milehigh-properties',
    title:    'The Grand Ghana Heritage Tour 2026',
    excerpt:  'A preview of our exclusive 10-day curated journey through Accra, Kumasi, and Cape Coast.',
    content:  'Full article content goes here...',
    author:   'Milehigh Concierge',
    date:     'March 05, 2026',
    readTime: '6 min read',
    image:    'https://res.cloudinary.com/dwsl2ktt2/image/upload/v1775449500/gg_gq7hdb.jpg',
    category: 'Ghana',
  },
];

// ─── Helper Functions ─────────────────────────────────────────────────────────
export const posts = blogPosts;

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
