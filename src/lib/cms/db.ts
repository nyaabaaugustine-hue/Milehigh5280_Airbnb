import { neon } from '@neondatabase/serverless';

const connectionString = process.env.DATABASE_URL;

export const sql = connectionString ? neon(connectionString) : null;

if (!sql) {
  console.warn('⚠️  DATABASE_URL not set. Using static fallback data.');
}

export async function query(text: string, params?: unknown[]): Promise<unknown[]> {
  if (!sql) return [];
  try {
    // @ts-expect-error - using neon tagged template
    return await sql(text, params);
  } catch (error) {
    console.error('Query error:', error);
    return [];
  }
}

export async function queryOne(text: string, params?: unknown[]): Promise<unknown | null> {
  const results = await query(text, params);
  return results[0] || null;
}

export interface Property {
  id: string;
  name: string;
  slug: string;
  tagline: string | null;
  description: string | null;
  property_type: string;
  badge: string | null;
  is_live: boolean;
  price_per_night: number;
  price_per_night_ghs: number | null;
  currency: string;
  city: string;
  area: string;
  country: string;
  max_guests: number;
  bedrooms: number;
  bathrooms: number;
  hero_image: string | null;
  created_at: string;
}

export async function getProperties(): Promise<Property[]> {
  if (!sql) return [];
  try {
    return await sql`SELECT * FROM properties WHERE is_live = true ORDER BY created_at DESC` as Property[];
  } catch {
    return [];
  }
}

export async function getPropertyBySlug(slug: string): Promise<Property | null> {
  if (!sql) return null;
  try {
    const result = await sql`SELECT * FROM properties WHERE slug = ${slug}`;
    return (result as Property[])[0] || null;
  } catch {
    return null;
  }
}