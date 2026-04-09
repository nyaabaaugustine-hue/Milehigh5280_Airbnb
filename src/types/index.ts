export type PropertyType = 'villa' | 'penthouse' | 'estate' | 'cottage' | 'mansion' | 'apartment';

export interface Property {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  longDescription: string;
  location: {
    city: string;
    region: string;
    country: string;
    coordinates: { lat: number; lng: number };
    address: string;
  };
  pricing: {
    perNight: number;
    perNightGHS: number;
    cleaningFee: number;
    serviceFee: number;
    minNights: number;
  };
  capacity: {
    guests: number;
    bedrooms: number;
    beds: number;
    bathrooms: number;
  };
  images: PropertyImage[];
  amenities: Amenity[];
  features: string[];
  rating: number;
  reviewCount: number;
  reviews: Review[];
  availability: string[];
  type: PropertyType;
  badge?: 'Editors Choice' | 'Most Booked' | 'New Arrival' | 'Exclusive';
  featured: boolean;
  isLive?: boolean;
  virtualTourUrl?: string;
}

export interface PropertyImage {
  id: string;
  url: string;
  alt: string;
  category: 'hero' | 'interior' | 'exterior' | 'amenity' | 'view';
}

export interface Amenity {
  id: string;
  label: string;
  icon: string;
  category: 'essential' | 'premium' | 'outdoor' | 'kitchen' | 'entertainment';
}

export interface Review {
  id: string;
  author: string;
  avatar: string;
  country: string;
  rating: number;
  date: string;
  comment: string;
  stayDuration: string;
}

export interface BookingRequest {
  propertyId: string;
  checkIn: Date;
  checkOut: Date;
  guests: number;
  guestInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    nationality: string;
    specialRequests?: string;
  };
  currency: 'USD' | 'GHS';
  totalAmount: number;
}

export interface PriceBreakdown {
  nights: number;
  nightlyRate: number;
  nightsTotal: number;
  cleaningFee: number;
  serviceFee: number;
  total: number;
  currency: 'USD' | 'GHS';
}

export type Currency = 'USD' | 'GHS' | 'EUR' | 'GBP';

// ─── Blog / News ─────────────────────────────────────────────────────────────
export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  readTime: string;
  image: string;
  category: 'Travel' | 'Lifestyle' | 'Hosting' | 'Ghana';
  featured?: boolean;
}

// ─── Contact / Email ─────────────────────────────────────────────────────────
export interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  property: string;
  message: string;
  type: 'booking' | 'concierge' | 'event' | 'listing' | 'other';
}

export interface BookingEmailData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  nationality: string;
  specialRequests: string;
  propertyName: string;
  propertySlug: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  nights: number;
  total: string;
  currency: string;
}
