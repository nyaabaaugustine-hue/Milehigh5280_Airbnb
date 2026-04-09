// Airtable CMS Types for Milehigh5280

export interface Property {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  type: 'villa' | 'penthouse' | 'estate' | 'cottage' | 'mansion' | 'apartment';
  badge?: 'Editors Choice' | 'Most Booked' | 'New Arrival' | 'Exclusive';
  isLive: boolean;
  location: {
    city: string;
    area: string;
    country: string;
  };
  pricing: {
    perNight: number;
    perWeek?: number;
    perMonth?: number;
    currency: 'USD' | 'GHS';
  };
  capacity: {
    guests: number;
    bedrooms: number;
    bathrooms: number;
    beds: number;
  };
  images: {
    hero: { url: string; alt: string };
    gallery: Array<{ url: string; alt: string; category: string }>;
  };
  amenities: string[]; // Airtable record IDs
  features: string[];
  houseRules: string[];
  checkInTime: string;
  checkOutTime: string;
  rating: number;
  reviewCount: number;
  coordinates?: {
    lat: number;
    lng: number;
  };
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

export interface Review {
  id: string;
  propertyId: string;
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
}

// Normalized types (with resolved relationships)
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
