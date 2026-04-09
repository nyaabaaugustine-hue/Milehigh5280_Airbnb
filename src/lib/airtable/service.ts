// Airtable Data Service - Central hub for all CMS data operations

import { fetchAllRecords, getAirtableRecord } from './client';
import {
  transformProperty,
  transformAmenity,
  transformRoom,
  transformReview,
  transformBlogPost,
  enrichPropertyWithDetails,
} from './transformers';
import type {
  Property,
  Amenity,
  Room,
  Review,
  BlogPost,
  PropertyWithDetails,
} from './types';

// Cache for 5 minutes (300 seconds)
const CACHE_DURATION = 300;

let propertiesCache: { data: Property[]; timestamp: number } | null = null;
let amenitiesCache: { data: Amenity[]; timestamp: number } | null = null;
let roomsCache: { data: Room[]; timestamp: number } | null = null;
let reviewsCache: { data: Review[]; timestamp: number } | null = null;
let blogPostsCache: { data: BlogPost[]; timestamp: number } | null = null;

function isCacheValid<T>(cache: { data: T; timestamp: number } | null): boolean {
  if (!cache) return false;
  return Date.now() - cache.timestamp < CACHE_DURATION * 1000;
}

// ─── Properties ────────────────────────────────────────────────────────────────

export async function getAllProperties(): Promise<Property[]> {
  if (isCacheValid(propertiesCache)) {
    return propertiesCache!.data;
  }

  try {
    const records = await fetchAllRecords('Properties', {
      sort: [{ field: 'Name', direction: 'asc' }],
    });

    const properties = records.map(transformProperty);
    propertiesCache = { data: properties, timestamp: Date.now() };
    return properties;
  } catch (error) {
    console.error('Failed to fetch properties from Airtable:', error);
    // Return cached data if available, even if stale
    return propertiesCache?.data || [];
  }
}

export async function getPropertyBySlug(slug: string): Promise<Property | null> {
  const properties = await getAllProperties();
  return properties.find(p => p.slug === slug) || null;
}

export async function getPropertyById(id: string): Promise<Property | null> {
  const properties = await getAllProperties();
  return properties.find(p => p.id === id) || null;
}

export async function getLiveProperties(): Promise<Property[]> {
  const properties = await getAllProperties();
  return properties.filter(p => p.isLive !== false);
}

// ─── Amenities ────────────────────────────────────────────────────────────────

export async function getAllAmenities(): Promise<Amenity[]> {
  if (isCacheValid(amenitiesCache)) {
    return amenitiesCache!.data;
  }

  try {
    const records = await fetchAllRecords('Amenities', {
      sort: [{ field: 'Category', direction: 'asc' }, { field: 'Name', direction: 'asc' }],
    });

    const amenities = records.map(transformAmenity);
    amenitiesCache = { data: amenities, timestamp: Date.now() };
    return amenities;
  } catch (error) {
    console.error('Failed to fetch amenities from Airtable:', error);
    return amenitiesCache?.data || [];
  }
}

export async function getAmenitiesMap(): Promise<Map<string, Amenity>> {
  const amenities = await getAllAmenities();
  return new Map(amenities.map(a => [a.id, a]));
}

// ─── Rooms ────────────────────────────────────────────────────────────────────

export async function getAllRooms(): Promise<Room[]> {
  if (isCacheValid(roomsCache)) {
    return roomsCache!.data;
  }

  try {
    const records = await fetchAllRecords('Rooms', {
      sort: [{ field: 'Name', direction: 'asc' }],
    });

    const rooms = records.map(transformRoom);
    roomsCache = { data: rooms, timestamp: Date.now() };
    return rooms;
  } catch (error) {
    console.error('Failed to fetch rooms from Airtable:', error);
    return roomsCache?.data || [];
  }
}

// ─── Reviews ──────────────────────────────────────────────────────────────────

export async function getAllReviews(): Promise<Review[]> {
  if (isCacheValid(reviewsCache)) {
    return reviewsCache!.data;
  }

  try {
    const records = await fetchAllRecords('Reviews', {
      sort: [{ field: 'Date', direction: 'desc' }],
      filterByFormula: '{Verified} = 1',
    });

    const reviews = records.map(transformReview);
    reviewsCache = { data: reviews, timestamp: Date.now() };
    return reviews;
  } catch (error) {
    console.error('Failed to fetch reviews from Airtable:', error);
    return reviewsCache?.data || [];
  }
}

export async function getReviewsByPropertyId(propertyId: string): Promise<Review[]> {
  const reviews = await getAllReviews();
  return reviews.filter(r => r.propertyId === propertyId);
}

// ─── Blog Posts ────────────────────────────────────────────────────────────────

export async function getAllBlogPosts(): Promise<BlogPost[]> {
  if (isCacheValid(blogPostsCache)) {
    return blogPostsCache!.data;
  }

  try {
    const records = await fetchAllRecords('Blog Posts', {
      sort: [{ field: 'Date', direction: 'desc' }],
      filterByFormula: '{Published} = 1',
    });

    const posts = records.map(transformBlogPost);
    blogPostsCache = { data: posts, timestamp: Date.now() };
    return posts;
  } catch (error) {
    console.error('Failed to fetch blog posts from Airtable:', error);
    return blogPostsCache?.data || [];
  }
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  const posts = await getAllBlogPosts();
  return posts.find(p => p.slug === slug) || null;
}

// ─── Property with Full Details ────────────────────────────────────────────────

export async function getPropertyWithDetails(
  slugOrId: string
): Promise<PropertyWithDetails | null> {
  const property =
    (await getPropertyBySlug(slugOrId)) || (await getPropertyById(slugOrId));

  if (!property) return null;

  const [amenitiesMap, rooms, reviews] = await Promise.all([
    getAmenitiesMap(),
    getAllRooms(),
    getAllReviews(),
  ]);

  return enrichPropertyWithDetails(property, amenitiesMap, rooms, reviews);
}

// ─── Cache Management ─────────────────────────────────────────────────────────

export function clearAllCaches(): void {
  propertiesCache = null;
  amenitiesCache = null;
  roomsCache = null;
  reviewsCache = null;
  blogPostsCache = null;
}

// ─── Health Check ─────────────────────────────────────────────────────────────

export async function checkAirtableHealth(): Promise<{
  ok: boolean;
  message: string;
}> {
  try {
    await getAllProperties();
    return { ok: true, message: 'Airtable connection successful' };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : 'Connection failed',
    };
  }
}
