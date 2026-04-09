// Airtable Data Transformers for Milehigh5280

import type { Property, Amenity, Room, Review, BlogPost, PropertyWithDetails } from './types';
import type { AirtableRecord } from './client';

// Property Transformer
export function transformProperty(record: AirtableRecord): Property {
  const f = record.fields;

  const images = {
    hero: {
      url: (f['Hero Image'] as string) || (f['Images'] as string[])?.[0] || '',
      alt: (f['Name'] as string) || '',
    },
    gallery: ((f['Gallery'] as string[]) || (f['Images'] as string[]) || []).map((url, i) => ({
      url: typeof url === 'string' ? url : url,
      alt: `${f['Name']} - Image ${i + 1}`,
      category: 'gallery',
    })),
  };

  return {
    id: record.id,
    name: (f['Name'] as string) || '',
    slug: (f['Slug'] as string) || record.id,
    tagline: (f['Tagline'] as string) || '',
    description: (f['Description'] as string) || '',
    type: (f['Type'] as Property['type']) || 'apartment',
    badge: f['Badge'] as Property['badge'],
    featured: f['Featured'] as boolean ?? false,
    isLive: f['Is Live'] !== false,
    location: {
      city: (f['City'] as string) || 'Accra',
      area: (f['Area'] as string) || 'Ayi Mensah',
      country: (f['Country'] as string) || 'Ghana',
    },
    pricing: {
      perNight: (f['Price per Night'] as number) || 0,
      perWeek: f['Price per Week'] as number,
      perMonth: f['Price per Month'] as number,
      currency: (f['Currency'] as 'USD' | 'GHS' | 'EUR' | 'GBP') || 'USD',
    },
    capacity: {
      guests: (f['Max Guests'] as number) || 2,
      bedrooms: (f['Bedrooms'] as number) || 1,
      bathrooms: (f['Bathrooms'] as number) || 1,
      beds: (f['Beds'] as number) || 1,
    },
    amenities: (f['Amenities'] as string[]) || [],
    images,
    features: (f['Features'] as string[]) || [],
    houseRules: (f['House Rules'] as string[]) || [],
    checkInTime: (f['Check-in Time'] as string) || '14:00',
    checkOutTime: (f['Check-out Time'] as string) || '11:00',
    rating: (f['Rating'] as number) || 0,
    reviewCount: (f['Review Count'] as number) || 0,
    coordinates: f['Coordinates'] as Property['coordinates'],
  };
}

// Amenity Transformer
export function transformAmenity(record: AirtableRecord): Amenity {
  const f = record.fields;
  return {
    id: record.id,
    name: (f['Name'] as string) || '',
    icon: (f['Icon'] as string) || '🏠',
    category: (f['Category'] as Amenity['category']) || 'essential',
  };
}

// Room Transformer
export function transformRoom(record: AirtableRecord): Room {
  const f = record.fields;
  return {
    id: record.id,
    propertyId: (f['Property'] as string[])?.[0] || '',
    name: (f['Name'] as string) || '',
    type: (f['Type'] as Room['type']) || 'bedroom',
    description: (f['Description'] as string) || '',
    features: (f['Features'] as string[]) || [],
    images: ((f['Images'] as string[]) || []).map(url => ({ url, alt: (f['Name'] as string) || '' })),
  };
}

// Review Transformer
export function transformReview(record: AirtableRecord): Review {
  const f = record.fields;
  return {
    id: record.id,
    propertyId: (f['Property'] as string[])?.[0] || '',
    author: (f['Author'] as string) || 'Anonymous',
    authorAvatar: f['Author Avatar'] as string,
    country: (f['Country'] as string) || '',
    rating: (f['Rating'] as number) || 5,
    date: (f['Date'] as string) || new Date().toISOString(),
    stayDuration: (f['Stay Duration'] as string) || '',
    comment: (f['Comment'] as string) || '',
    aspects: {
      cleanliness: f['Cleanliness'] as number,
      location: f['Location'] as number,
      value: f['Value'] as number,
      communication: f['Communication'] as number,
    },
    isVerified: f['Verified'] === true,
  };
}

// Blog Post Transformer
export function transformBlogPost(record: AirtableRecord): BlogPost {
  const f = record.fields;
  return {
    id: record.id,
    slug: (f['Slug'] as string) || record.id,
    title: (f['Title'] as string) || '',
    excerpt: (f['Excerpt'] as string) || '',
    content: (f['Content'] as string) || '',
    author: (f['Author'] as string) || 'Milehigh Team',
    authorAvatar: f['Author Avatar'] as string,
    category: (f['Category'] as string) || 'General',
    tag: (f['Tag'] as string) || '',
    image: ((f['Images'] as string[])?.[0]) || '',
    date: (f['Date'] as string) || new Date().toISOString(),
    readTime: (f['Read Time'] as string) || '5 min read',
    isPublished: f['Published'] !== false,
  };
}

// Property with full details (amenities, rooms, reviews resolved)
export async function enrichPropertyWithDetails(
  property: Property,
  amenitiesMap: Map<string, Amenity>,
  rooms: Room[],
  reviews: Review[]
): Promise<PropertyWithDetails> {
  return {
    ...property,
    amenitiesData: property.amenities
      .map(id => amenitiesMap.get(id))
      .filter((a): a is Amenity => a !== undefined),
    roomsData: rooms.filter(r => r.propertyId === property.id),
    reviewsData: reviews.filter(r => r.propertyId === property.id),
  };
}
