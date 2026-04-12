// Airtable CMS Types for Milehigh5280 - Complete Admin Dashboard

// ─── Properties ─────────────────────────────────────────────────────────────────

export interface Property {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  longDescription?: string;
  type: 'villa' | 'penthouse' | 'estate' | 'cottage' | 'mansion' | 'apartment';
  badge?: 'Editors Choice' | 'Most Booked' | 'New Arrival' | 'Exclusive' | '';
  isLive: boolean;
  featured: boolean;
  location: {
    city: string;
    area: string;
    country: string;
  };
  pricing: {
    perNight: number;
    perNightGHS?: number;
    perWeek?: number;
    perMonth?: number;
    cleaningFee?: number;
    serviceFee?: number;
    currency: 'USD' | 'GHS' | 'EUR' | 'GBP';
    minNights?: number;
  };
  capacity: {
    guests: number;
    bedrooms: number;
    bathrooms: number;
    beds: number;
  };
  images: {
    hero?: { url: string; alt: string };
    gallery?: Array<{ url: string; alt: string; category: string }>;
  };
  amenities: string[];
  features: string[];
  houseRules: string[];
  checkInTime: string;
  checkOutTime: string;
  rating: number;
  reviewCount: number;
  coordinates?: { lat: number; lng: number };
}

export interface Amenity {
  id: string;
  name: string;
  icon: string;
  category: 'essential' | 'comfort' | 'safety' | 'entertainment' | 'outdoor';
}

export interface Room {
  id: string;
  propertyId: string;
  name: string;
  type: 'bedroom' | 'living' | 'dining' | 'kitchen' | 'bathroom' | 'outdoor';
  description: string;
  features: string[];
  images: Array<{ url: string; alt: string }>;
}

// ─── Reviews ────────────────────────────────────────────────────────────────────

export interface Review {
  id: string;
  propertyId: string;
  propertyName?: string;
  author: string;
  authorAvatar?: string;
  country: string;
  rating: number;
  date: string;
  stayDuration: string;
  comment: string;
  aspects?: {
    cleanliness?: number;
    location?: number;
    value?: number;
    communication?: number;
  };
  isVerified: boolean;
}

// ─── Blog Posts ────────────────────────────────────────────────────────────────

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  authorAvatar?: string;
  category: string;
  tag: string;
  image: string;
  date: string;
  readTime: string;
  isPublished: boolean;
  featured?: boolean;
}

// ─── Site Content (Pages: About, Contact, Ghana Guide, etc.) ───────────────────

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  image: string;
  order: number;
}

export interface Milestone {
  id: string;
  year: string;
  event: string;
  order: number;
}

export interface Value {
  id: string;
  title: string;
  description: string;
  icon: string;
  order: number;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: 'general' | 'booking' | 'payment' | 'property' | 'cancellation';
  order: number;
}

export interface TourOperator {
  id: string;
  name: string;
  duration: string;
  highlights: string;
  price: string;
  image: string;
  isActive: boolean;
  order: number;
}

export interface Language {
  id: string;
  language: string;
  note: string;
  order: number;
}

export interface Currency {
  id: string;
  code: string;
  symbol: string;
  rate: string;
  note: string;
}

export interface Experience {
  id: string;
  title: string;
  description: string;
  icon: string;
  order: number;
}

export interface DiasporaTestimonial {
  id: string;
  quote: string;
  name: string;
  country: string;
  avatar: string;
  order: number;
}

export interface CorporatePricing {
  id: string;
  period: string;
  rate: string;
}

export interface SiteContent {
  id: string;
  section: 'about' | 'contact' | 'ghana-guide' | 'home';
  teamMembers: TeamMember[];
  milestones: Milestone[];
  values: Value[];
  faqs: FAQ[];
  tourOperators: TourOperator[];
  languages: Language[];
  currencies: Currency[];
  experiences: Experience[];
  diasporaTestimonials: DiasporaTestimonial[];
  corporatePricing: CorporatePricing[];
  stats: Array<{ id: string; value: string; label: string; section: string }>;
}

// ─── Settings ─────────────────────────────────────────────────────────────────

export interface ContactInfo {
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  mapUrl?: string;
}

export interface SocialLink {
  id: string;
  platform: 'instagram' | 'facebook' | 'twitter' | 'youtube' | 'linkedin' | 'tiktok';
  url: string;
  label: string;
  isActive: boolean;
}

export interface NavLink {
  id: string;
  href: string;
  label: string;
  order: number;
  section: 'properties' | 'company' | 'legal';
}

export interface PromoCode {
  id: string;
  code: string;
  discount: number;
  type: 'percentage' | 'fixed';
  label: string;
  description: string;
  isActive: boolean;
  expiresAt?: string;
}

export interface ConciergeHours {
  day: string;
  hours: string;
}

export interface Settings {
  contact: ContactInfo;
  socials: SocialLink[];
  navLinks: NavLink[];
  promoCodes: PromoCode[];
  conciergeHours: ConciergeHours[];
  siteName: string;
  siteDescription: string;
  logoUrl: string;
}

export interface HeroSlide {
  id: string;
  image: string;
  order: number;
}

// ─── Translations ──────────────────────────────────────────────────────────────

export interface Translation {
  language: string;
  code: string;
  guideHeroTitle: string;
  guideHeroSubtitle: string;
  guideHeroDesc: string;
  labels: {
    travelIntel: string;
    airport: string;
    visa: string;
    safety: string;
    tours: string;
    currency: string;
    accessibility: string;
    booking: string;
  };
}

export interface LanguageConfig {
  code: string;
  label: string;
  flag: string;
  isActive: boolean;
}

// ─── Combined Types ────────────────────────────────────────────────────────────

export interface PropertyWithDetails extends Property {
  amenitiesData: Amenity[];
  roomsData: Room[];
  reviewsData: Review[];
}

export interface ReviewSubmission {
  propertyId: string;
  author: string;
  email: string;
  country?: string;
  rating: number;
  stayDuration?: string;
  comment: string;
  aspects?: {
    cleanliness?: number;
    location?: number;
    value?: number;
    communication?: number;
  };
}

// ─── Admin Dashboard Types ──────────────────────────────────────────────────────

export type ContentType = 
  | 'properties'
  | 'amenities'
  | 'rooms'
  | 'reviews'
  | 'blog'
  | 'site-content'
  | 'settings'
  | 'translations';

export interface AdminStats {
  totalProperties: number;
  liveProperties: number;
  totalReviews: number;
  totalBlogPosts: number;
  publishedPosts: number;
  pendingReviews: number;
}

export interface CmsRecord {
  id: string;
  fields: Record<string, unknown>;
  createdTime: string;
}

export interface CmsResponse {
  records: CmsRecord[];
  offset?: string;
}
