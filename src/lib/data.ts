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

export const properties: Property[] = [];

// ─── Blog Posts ───────────────────────────────────────────────────────────────
export const blogPosts: BlogPost[] = [];

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

// ─── About Page Data ─────────────────────────────────────────────────────────

export const getAboutData = () => ({
  team: [
    { name: 'Adwoa Mensah', role: 'Founder & CEO', bio: '15 years in luxury hospitality', image: '' },
    { name: 'Herbert Prempeh', role: 'Co-Founder', bio: 'Tech & Operations Lead', image: '' },
    { name: 'Abena Darko', role: 'Chief Concierge', bio: 'Guest Experience Specialist', image: '' },
  ],
  milestones: [
    { year: '2019', event: 'Founded in Accra with a single villa in Cantonments.' },
    { year: '2020', event: 'Expanded to 3 properties. Launched our private concierge service.' },
    { year: '2022', event: 'Named "Best Luxury Accommodation" by Ghana Tourism Authority.' },
    { year: '2023', event: 'Lakeside Estate opened — our most ambitious property yet.' },
    { year: '2024', event: 'Over 1,000 guests hosted. 4.97 average rating.' },
    { year: '2025', event: 'Pearl Mansion debut. Expansion planned.' },
  ],
  values: [
    { title: 'Genuine Hospitality', desc: 'Warmth of greeting, remembering your name.' },
    { title: 'Ghana, Elevated', desc: 'World-class luxury exists right here in West Africa.' },
    { title: 'Uncompromising Quality', desc: 'Global five-star hotel standards.' },
  ],
  stats: [
    { value: '1,000+', label: 'Happy Guests' },
    { value: '4.97', label: 'Average Rating' },
    { value: '6', label: 'Years of Excellence' },
    { value: '4', label: 'Exclusive Properties' },
  ],
});

// ─── Contact Page Data ───────────────────────────────────────────────────────

export const getFaqs = () => [
  { q: 'What is included in my stay?', a: 'Daily housekeeping, high-speed WiFi, air conditioning, and 24/7 concierge support.' },
  { q: 'Can I pay in Ghanaian Cedis?', a: 'Yes. We accept both GHS and USD. Paystack available for Ghanaian residents.' },
  { q: 'What is your cancellation policy?', a: 'Full refund for cancellations 7+ days before check-in. 50% refund for 3-6 days.' },
  { q: 'Do you host events and corporate retreats?', a: 'Absolutely. Several properties designed for groups and celebrations.' },
  { q: 'Is airport transfer included?', a: 'Transfer from Kotoka International Airport can be arranged. Complimentary in some packages.' },
];

export const getConciergeHours = () => [
  { day: 'Monday – Friday', hours: '7:00 AM – 10:00 PM GMT' },
  { day: 'Saturday', hours: '8:00 AM – 9:00 PM GMT' },
  { day: 'Sunday', hours: '9:00 AM – 7:00 PM GMT' },
  { day: 'WhatsApp', hours: 'Available 24/7' },
];

// ─── Social Links ────────────────────────────────────────────────────────────

export const getSocialLinks = () => [
  { platform: 'instagram', url: 'https://instagram.com/milehigh5280', label: 'Instagram' },
  { platform: 'facebook', url: 'https://facebook.com/milehigh5280', label: 'Facebook' },
];

// ─── Promo Codes ────────────────────────────────────────────────────────────

export const getPromoCodes = () => ({
  'WELCOME10': { discount: 10, type: 'percentage', label: 'Welcome Discount', description: '10% off your first booking' },
  'DIASPORA15': { discount: 15, type: 'percentage', label: 'Diaspora Discount', description: '15% off for returning visitors' },
});

// ─── Ghana Guide Data ────────────────────────────────────────────────────────

export const getTourOperators = () => [
  { name: 'Accra City Tour', duration: 'Full Day', highlights: 'Independence Square, Kwame Nkrumah Memorial', price: 'From $45/person', image: '' },
  { name: 'Cape Coast & Elmina Castle', duration: '2 Days', highlights: 'Elmina Slave Castle, Kakum Canopy Walk', price: 'From $120/person', image: '' },
  { name: 'Kumasi & Ashanti Kingdom', duration: '2 Days', highlights: 'Manhyia Palace, Kejetia Market', price: 'From $110/person', image: '' },
  { name: 'Boti Falls Day Trip', duration: 'Half Day', highlights: 'Twin waterfalls, jungle hiking', price: 'From $35/person', image: '' },
];

export const getVisaInfo = () => [
  { flag: '🌍', title: 'African Union Citizens', detail: 'Most AU countries enjoy visa-on-arrival or visa-free entry.' },
  { flag: '🇺🇸', title: 'USA / Canada / UK / EU', detail: 'Obtain Ghana e-Visa online before travel. Processing: 3-5 business days.' },
  { flag: '✈️', title: 'Visa on Arrival', detail: 'Some nationalities qualify for 30-day visa on arrival at KIA. Fee: ~$150 USD.' },
];

export const getSafetyTips = () => [
  { icon: '🏥', title: 'Nearest Hospital', detail: 'Millennium Medical Centre — 12 min from Milehigh5280.' },
  { icon: '💊', title: 'Health Precautions', detail: 'Yellow fever vaccination required. Malaria prophylaxis recommended.' },
  { icon: '💰', title: 'Currency & ATMs', detail: 'Ghana Cedi (GHS). USD widely accepted. ATMs at all major banks.' },
];

// ─── Homepage Content ────────────────────────────────────────────────────────

export const getExperiences = () => [
  { title: 'Private Chef Service', desc: 'Ghanaian cuisine prepared in your kitchen or garden', icon: 'ChefHat' },
  { title: 'Cultural Immersion', desc: 'Kente weaving, drumming, and local market tours', icon: 'Music' },
  { title: 'Wellness & Spa', desc: 'In-room massages, yoga sessions, meditation spaces', icon: 'Heart' },
  { title: 'Adventure Tours', desc: 'Waterfall hikes, canopy walks, castle visits', icon: 'Compass' },
  { title: 'Sunset Cruises', desc: 'Private boat trips on Lake Volta', icon: 'Ship' },
  { title: 'Diaspora Heritage', desc: 'Return home ceremonies, family tracing', icon: 'Home' },
];

// ─── Site Settings ──────────────────────────────────────────────────────────

export const getSiteContent = () => ({
  siteName: 'Milehigh5280',
  siteDescription: 'Luxury short-stay accommodation in Accra, Ghana',
  heroTitle: 'Your Private Sanctuary in Ghana',
  heroSubtitle: 'Luxury Stays · Authentic Experiences · Ghanaian Warmth',
});

// ─── Helper to get contact info as object ──────────────────────────────────

export const getContactInfo = () => CONTACT_INFO;
