// Neon Database Service - Replaces Airtable for CMS data
// This service handles all database operations for properties, amenities, reviews, and blog posts.

import { query, queryOne, execute } from './client';
import type {
  Property,
  Amenity,
  Review,
  BlogPost,
} from '@/lib/airtable/types';

function parseJsonArray(value: unknown): any[] {
  if (Array.isArray(value)) return value;
  if (typeof value === 'string') {
    try {
      return JSON.parse(value);
    } catch {
      return [];
    }
  }
  return [];
}

function normalizeProperty(row: any): Property {
  return {
    id: String(row.id ?? ''),
    name: String(row.name ?? ''),
    slug: String(row.slug ?? ''),
    tagline: String(row.tagline ?? ''),
    description: String(row.description ?? ''),
    longDescription: String(row.long_description ?? row.longDescription ?? ''),
    type: (row.property_type ?? row.type ?? 'apartment') as Property['type'],
    badge: (row.badge ?? '') as Property['badge'],
    isLive: Boolean(row.is_live ?? row.isLive ?? false),
    featured: Boolean(row.is_featured ?? row.featured ?? false),
    location: {
      city: String(row.city ?? row.location?.city ?? ''),
      area: String(row.area ?? row.location?.area ?? ''),
      country: String(row.country ?? row.location?.country ?? ''),
    },
    pricing: {
      perNight: Number(row.price_per_night ?? row.price ?? 0),
      perNightGHS: row.price_per_night_ghs ?? row.priceGHS ?? undefined,
      currency: 'USD',
      minNights: row.min_nights ?? undefined,
      cleaningFee: row.cleaning_fee ?? undefined,
      serviceFee: row.service_fee ?? undefined,
      perWeek: row.per_week ?? undefined,
      perMonth: row.per_month ?? undefined,
    },
    capacity: {
      guests: Number(row.max_guests ?? row.capacity?.guests ?? 0),
      bedrooms: Number(row.bedrooms ?? row.capacity?.bedrooms ?? 0),
      bathrooms: Number(row.bathrooms ?? row.capacity?.bathrooms ?? 0),
      beds: Number(row.beds ?? 0),
    },
    images: {
      hero: row.hero_image ? { url: String(row.hero_image), alt: String(row.hero_image_alt ?? row.name ?? '') } : undefined,
      gallery: parseJsonArray(row.gallery).map((item: any) => ({
        url: String(item?.url ?? ''),
        alt: String(item?.alt ?? ''),
        category: String(item?.category ?? ''),
      })),
    },
    amenities: parseJsonArray(row.amenities).map(String),
    features: parseJsonArray(row.features).map(String),
    houseRules: parseJsonArray(row.house_rules).map(String),
    checkInTime: String(row.check_in_time ?? ''),
    checkOutTime: String(row.check_out_time ?? ''),
    rating: Number(row.rating ?? 0),
    reviewCount: Number(row.review_count ?? row.reviewCount ?? 0),
    coordinates: row.lat && row.lng ? { lat: Number(row.lat), lng: Number(row.lng) } : undefined,
  };
}

function normalizeReview(row: any): Review {
  return {
    id: String(row.id ?? ''),
    propertyId: String(row.property_id ?? row.propertyId ?? ''),
    author: String(row.author ?? ''),
    authorAvatar: String(row.author_image ?? row.authorImage ?? ''),
    country: String(row.country ?? ''),
    rating: Number(row.rating ?? 0),
    date: String(row.date ?? ''),
    stayDuration: String(row.stay_duration ?? row.stayDuration ?? ''),
    comment: String(row.comment ?? row.content ?? ''),
    aspects: row.aspects ?? undefined,
    isVerified: Boolean(row.is_verified ?? row.isVerified ?? false),
    propertyName: String(row.property_name ?? row.propertyName ?? ''),
  };
}

function normalizeBlogPost(row: any): BlogPost {
  return {
    id: String(row.id ?? ''),
    slug: String(row.slug ?? ''),
    title: String(row.title ?? ''),
    excerpt: String(row.excerpt ?? ''),
    content: String(row.content ?? ''),
    author: String(row.author ?? ''),
    authorAvatar: String(row.author_avatar ?? row.authorAvatar ?? ''),
    category: String(row.category ?? ''),
    tag: String(row.tag ?? ''),
    image: String(row.image ?? ''),
    date: String(row.date ?? ''),
    readTime: String(row.read_time ?? row.readTime ?? ''),
    isPublished: Boolean(row.is_published ?? row.isPublished ?? false),
    featured: Boolean(row.featured ?? false),
  };
}

export async function ensureFormSubmissionsTable(): Promise<void> {
  try {
    await execute(`
      CREATE TABLE IF NOT EXISTS form_submissions (
        id BIGSERIAL PRIMARY KEY,
        created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
        page TEXT NOT NULL,
        form_name TEXT NOT NULL,
        action TEXT NOT NULL,
        payload JSONB NOT NULL
      );
    `);
  } catch (err) {
    console.error('[Neon] Failed to ensure form_submissions table:', err);
  }
}

export async function logFormSubmissionNeon(
  page: string,
  formName: string,
  action: string,
  payload: unknown
): Promise<boolean> {
  try {
    await ensureFormSubmissionsTable();
    const result = await queryOne<{ id: number }>(
      `INSERT INTO form_submissions (page, form_name, action, payload)
       VALUES ($1, $2, $3, $4)
       RETURNING id`,
      [page, formName, action, payload]
    );
    return Boolean(result?.id);
  } catch (err) {
    console.error('[Neon] Failed to log form submission:', err);
    return false;
  }
}

// ─── PROPERTIES ─────────────────────────────────────────────────────────────

export async function getAllPropertiesNeon(): Promise<Property[]> {
  try {
    const results = await query(
      `SELECT
        id,
        name,
        slug,
        tagline,
        description,
        long_description,
        property_type,
        badge,
        price_per_night,
        price_per_night_ghs,
        is_live,
        is_featured,
        rating,
        review_count,
        hero_image,
        hero_image_alt,
        gallery,
        amenities,
        bedrooms,
        bathrooms,
        beds,
        max_guests,
        city,
        area,
        country,
        check_in_time,
        check_out_time,
        features,
        house_rules,
        created_at,
        updated_at
      FROM properties
      ORDER BY created_at DESC`
    );

    return (results || []).map(normalizeProperty);
  } catch (err) {
    console.error('[Neon] Failed to fetch properties:', err);
    return [];
  }
}

export async function getPropertyNeon(id: string): Promise<Property | null> {
  try {
    const result = await queryOne(
      `SELECT
        id,
        name,
        slug,
        tagline,
        description,
        long_description,
        property_type,
        badge,
        price_per_night,
        price_per_night_ghs,
        is_live,
        is_featured,
        rating,
        review_count,
        hero_image,
        hero_image_alt,
        gallery,
        amenities,
        bedrooms,
        bathrooms,
        beds,
        max_guests,
        city,
        area,
        country,
        check_in_time,
        check_out_time,
        features,
        house_rules,
        created_at,
        updated_at
      FROM properties
      WHERE id = $1`,
      [id]
    );

    return result ? normalizeProperty(result) : null;
  } catch (err) {
    console.error('[Neon] Failed to fetch property:', err);
    return null;
  }
}

export async function getPropertyBySlugNeon(slug: string): Promise<Property | null> {
  try {
    const result = await queryOne(
      `SELECT
        id,
        name,
        slug,
        tagline,
        description,
        long_description,
        property_type,
        badge,
        price_per_night,
        price_per_night_ghs,
        is_live,
        is_featured,
        rating,
        review_count,
        hero_image,
        hero_image_alt,
        gallery,
        amenities,
        bedrooms,
        bathrooms,
        beds,
        max_guests,
        city,
        area,
        country,
        check_in_time,
        check_out_time,
        features,
        house_rules,
        created_at,
        updated_at
      FROM properties
      WHERE slug = $1`,
      [slug]
    );

    return result ? normalizeProperty(result) : null;
  } catch (err) {
    console.error('[Neon] Failed to fetch property by slug:', err);
    return null;
  }
}

export async function getLivePropertiesNeon(): Promise<Property[]> {
  try {
    const results = await query(
      `SELECT
        id,
        name,
        slug,
        tagline,
        description,
        long_description,
        property_type,
        badge,
        price_per_night,
        price_per_night_ghs,
        is_live,
        is_featured,
        rating,
        review_count,
        hero_image,
        hero_image_alt,
        gallery,
        amenities,
        bedrooms,
        bathrooms,
        beds,
        max_guests,
        city,
        area,
        country,
        check_in_time,
        check_out_time,
        features,
        house_rules,
        created_at,
        updated_at
      FROM properties
      WHERE is_live = true
      ORDER BY created_at DESC`
    );

    return (results || []).map(normalizeProperty);
  } catch (err) {
    console.error('[Neon] Failed to fetch live properties:', err);
    return [];
  }
}

export async function createPropertyNeon(data: Partial<Property>): Promise<Property | null> {
  try {
    const result = await queryOne(
      `INSERT INTO properties (
fe features         name, slug, tagline, description, long_description, property_type,
        badge, price_per_night, price_per_night_ghs, is_live, is_featured,
        bedrooms, bathrooms, beds, max_guests, city, area,
        country, hero_image, hero_image_alt, gallery, amenities,
        features, house_rules, check_in_time, check_out_time
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26)
      RETURNING *`,
      [
        data.name,
        data.slug || data.name?.toLowerCase().replace(/\s+/g, '-'),
        data.tagline,
        data.description,
        data.longDescription,
        data.type || 'apartment',
        data.badge || null,
        data.pricing?.perNight ?? 0,
        data.pricing?.perNightGHS ?? null,
        data.isLive ?? false,
        data.featured ?? false,
        data.capacity?.bedrooms ?? 1,
        data.capacity?.bathrooms ?? 1,
        data.capacity?.beds ?? 1,
        data.capacity?.guests ?? 2,
        data.location?.city ?? 'Accra',
        data.location?.area ?? 'Ayi Mensah',
        data.location?.country ?? 'Ghana',
        data.images?.hero?.url ?? null,
        data.images?.hero?.alt ?? null,
        JSON.stringify(data.images?.gallery ?? []),
        JSON.stringify(data.amenities ?? []),
        JSON.stringify(data.features ?? []),
        JSON.stringify(data.houseRules ?? []),
        data.checkInTime ?? null,
        data.checkOutTime ?? null,
      ]
    );

    return result ? normalizeProperty(result) : null;
  } catch (err) {
    console.error('[Neon] Failed to create property:', err);
    return null;
  }
}

export async function updatePropertyNeon(id: string, data: Partial<Property>): Promise<Property | null> {
  try {
    const updates: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    if (data.name !== undefined) {
      updates.push(`name = $${paramCount++}`);
      values.push(data.name);
    }
    if (data.tagline !== undefined) {
      updates.push(`tagline = $${paramCount++}`);
      values.push(data.tagline);
    }
    if (data.description !== undefined) {
      updates.push(`description = $${paramCount++}`);
      values.push(data.description);
    }
    if (data.longDescription !== undefined) {
      updates.push(`long_description = $${paramCount++}`);
      values.push(data.longDescription);
    }
    if (data.type !== undefined) {
      updates.push(`property_type = $${paramCount++}`);
      values.push(data.type);
    }
    if (data.isLive !== undefined) {
      updates.push(`is_live = $${paramCount++}`);
      values.push(data.isLive);
    }
    if (data.featured !== undefined) {
      updates.push(`is_featured = $${paramCount++}`);
      values.push(data.featured);
    }
    if (data.pricing?.perNight !== undefined) {
      updates.push(`price_per_night = $${paramCount++}`);
      values.push(data.pricing.perNight);
    }
    if (data.pricing?.perNightGHS !== undefined) {
      updates.push(`price_per_night_ghs = $${paramCount++}`);
      values.push(data.pricing.perNightGHS);
    }
    if (data.pricing?.currency !== undefined) {
      updates.push(`currency = $${paramCount++}`);
      values.push(data.pricing.currency);
    }
    if (data.capacity?.bedrooms !== undefined) {
      updates.push(`bedrooms = $${paramCount++}`);
      values.push(data.capacity.bedrooms);
    }
    if (data.capacity?.bathrooms !== undefined) {
      updates.push(`bathrooms = $${paramCount++}`);
      values.push(data.capacity.bathrooms);
    }
    if (data.capacity?.beds !== undefined) {
      updates.push(`beds = $${paramCount++}`);
      values.push(data.capacity.beds);
    }
    if (data.capacity?.guests !== undefined) {
      updates.push(`max_guests = $${paramCount++}`);
      values.push(data.capacity.guests);
    }
    if (data.location?.city !== undefined) {
      updates.push(`city = $${paramCount++}`);
      values.push(data.location.city);
    }
    if (data.location?.area !== undefined) {
      updates.push(`area = $${paramCount++}`);
      values.push(data.location.area);
    }
    if (data.location?.country !== undefined) {
      updates.push(`country = $${paramCount++}`);
      values.push(data.location.country);
    }
    if (data.images?.hero?.url !== undefined) {
      updates.push(`hero_image = $${paramCount++}`);
      values.push(data.images.hero.url);
    }
    if (data.images?.hero?.alt !== undefined) {
      updates.push(`hero_image_alt = $${paramCount++}`);
      values.push(data.images.hero.alt);
    }
    if (data.amenities !== undefined) {
      updates.push(`amenities = $${paramCount++}`);
      values.push(JSON.stringify(data.amenities));
    }
    if (data.features !== undefined) {
      updates.push(`features = $${paramCount++}`);
      values.push(JSON.stringify(data.features));
    }
    if (data.houseRules !== undefined) {
      updates.push(`house_rules = $${paramCount++}`);
      values.push(JSON.stringify(data.houseRules));
    }
    if (data.checkInTime !== undefined) {
      updates.push(`check_in_time = $${paramCount++}`);
      values.push(data.checkInTime);
    }
    if (data.checkOutTime !== undefined) {
      updates.push(`check_out_time = $${paramCount++}`);
      values.push(data.checkOutTime);
    }

    if (!updates.length) {
      return getPropertyNeon(id);
    }

    updates.push(`updated_at = NOW()`);
    values.push(id);

    const result = await queryOne(
      `UPDATE properties
       SET ${updates.join(', ')}
       WHERE id = $${paramCount}
       RETURNING *`,
      values
    );

    return result ? normalizeProperty(result) : null;
  } catch (err) {
    console.error('[Neon] Failed to update property:', err);
    return null;
  }
}

export async function deletePropertyNeon(id: string): Promise<boolean> {
  try {
    const result = await queryOne(
      `DELETE FROM properties WHERE id = $1 RETURNING id`,
      [id]
    );
    return Boolean(result);
  } catch (err) {
    console.error('[Neon] Failed to delete property:', err);
    return false;
  }
}

// ─── AMENITIES ──────────────────────────────────────────────────────────────

export async function getAllAmenitiesNeon(): Promise<Amenity[]> {
  try {
    const results = await query(
      `SELECT
        id,
        name,
        icon,
        category,
        is_active as "isActive",
        created_at as "createdAt"
      FROM amenities
      WHERE is_active = true
      ORDER BY name ASC`
    );
    return (results as unknown[]) as Amenity[];
  } catch (err) {
    console.error('[Neon] Failed to fetch amenities:', err);
    return [];
  }
}

export async function createAmenityNeon(data: Partial<Amenity>): Promise<Amenity | null> {
  try {
    const result = await queryOne(
      `INSERT INTO amenities (name, icon, category, is_active)
       VALUES ($1, $2, $3, true)
       RETURNING id, name, icon, category, is_active as "isActive", created_at as "createdAt"`,
      [data.name || 'New Amenity', data.icon || '✨', data.category || 'essential']
    );
    return result as unknown as Amenity;
  } catch (err) {
    console.error('[Neon] Failed to create amenity:', err);
    return null;
  }
}

export async function updateAmenityNeon(id: string, data: Partial<Amenity>): Promise<Amenity | null> {
  try {
    const updates: string[] = [];
    const values: unknown[] = [];
    let paramCount = 1;

    if (data.name !== undefined) {
      updates.push(`name = $${paramCount++}`);
      values.push(data.name);
    }
    if (data.icon !== undefined) {
      updates.push(`icon = $${paramCount++}`);
      values.push(data.icon);
    }
    if (data.category !== undefined) {
      updates.push(`category = $${paramCount++}`);
      values.push(data.category);
    }
    if (data.description !== undefined) {
      updates.push(`description = $${paramCount++}`);
      values.push(data.description);
    }
    if (data.isActive !== undefined) {
      updates.push(`is_active = $${paramCount++}`);
      values.push(data.isActive);
    }

    if (updates.length === 0) {
      return null;
    }

    values.push(id);
    const result = await queryOne(
      `UPDATE amenities SET ${updates.join(', ')} WHERE id = $${paramCount}
       RETURNING id, name, icon, category, is_active as "isActive", created_at as "createdAt"`,
      ...values
    );
    return result as unknown as Amenity;
  } catch (err) {
    console.error('[Neon] Failed to update amenity:', err);
    return null;
  }
}

export async function deleteAmenityNeon(id: string): Promise<boolean> {
  try {
    await execute(`DELETE FROM amenities WHERE id = $1`, [id]);
    return true;
  } catch (err) {
    console.error('[Neon] Failed to delete amenity:', err);
    return false;
  }
}

// ─── REVIEWS ────────────────────────────────────────────────────────────────

export async function getAllReviewsNeon(): Promise<Review[]> {
  try {
    const results = await query(
      `SELECT
        r.id,
        r.author,
        r.author_image as "authorImage",
        r.country,
        r.rating,
        r.date,
        r.stay_duration as "stayDuration",
        r.comment,
        r.property_id as "propertyId",
        r.is_verified as "isVerified",
        r.is_featured as "isFeatured",
        r.created_at as "createdAt",
        p.name as "property_name"
      FROM reviews r
      LEFT JOIN properties p ON r.property_id = p.id
      WHERE is_verified = true
      ORDER BY created_at DESC`
    );
    return (results || []).map(normalizeReview);
  } catch (err) {
    console.error('[Neon] Failed to fetch reviews:', err);
    return [];
  }
}

export async function getReviewsByPropertyIdNeon(propertyId: string): Promise<Review[]> {
  try {
    const results = await query(
      `SELECT
        id,
        author,
        author_image as "authorImage",
        country,
        rating,
        date,
        stay_duration as "stayDuration",
        comment,
        property_id as "propertyId",
        is_verified as "isVerified",
        is_featured as "isFeatured",
        created_at as "createdAt"
      FROM reviews
      WHERE property_id = $1
      ORDER BY created_at DESC`,
      [propertyId]
    );
    return (results || []).map(normalizeReview);
  } catch (err) {
    console.error('[Neon] Failed to fetch reviews by property:', err);
    return [];
  }
}

// ─── BLOG POSTS ──────────────────────────────────────────────────────────────

export async function getAllBlogPostsNeon(): Promise<BlogPost[]> {
  try {
    const results = await query(
      `SELECT
        id,
        title,
        slug,
        excerpt,
        content,
        author,
        author_avatar as "authorAvatar",
        category,
        tag,
        image,
        date,
        read_time as "readTime",
        is_published as "isPublished",
        featured,
        created_at as "createdAt",
        updated_at as "updatedAt"
      FROM blog_posts
      WHERE is_published = true
      ORDER BY created_at DESC`
    );
    return (results || []).map(normalizeBlogPost);
  } catch (err) {
    console.error('[Neon] Failed to fetch blog posts:', err);
    return [];
  }
}

export async function createBlogPostNeon(data: Partial<BlogPost>): Promise<BlogPost | null> {
  try {
    const result = await queryOne(
      `INSERT INTO blog_posts (title, slug, excerpt, content, author, category, image, is_published, featured)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`,
      [
        data.title || 'New Blog Post',
        data.slug || `blog-${Date.now()}`,
        data.excerpt || '',
        data.content || '',
        data.author || 'Admin',
        data.category || 'General',
        data.image || '',
        data.isPublished ?? false,
        data.featured ?? false,
      ]
    );
    return result ? normalizeBlogPost(result) : null;
  } catch (err) {
    console.error('[Neon] Failed to create blog post:', err);
    return null;
  }
}

export async function getBlogPostNeon(slug: string): Promise<BlogPost | null> {
  try {
    const result = await queryOne(
      `SELECT
        id,
        title,
        slug,
        excerpt,
        content,
        author,
        author_avatar as "authorAvatar",
        category,
        tag,
        image,
        date,
        read_time as "readTime",
        is_published as "isPublished",
        featured,
        created_at as "createdAt",
        updated_at as "updatedAt"
      FROM blog_posts
      WHERE slug = $1
      LIMIT 1`,
      [slug]
    );
    return result ? normalizeBlogPost(result) : null;
  } catch (err) {
    console.error('[Neon] Failed to fetch blog post:', err);
    return null;
  }
}

export async function updateBlogPostNeon(id: string, data: Partial<BlogPost>): Promise<BlogPost | null> {
  try {
    const updates: string[] = [];
    const values: unknown[] = [];
    let paramCount = 1;

    if (data.title !== undefined) {
      updates.push(`title = $${paramCount++}`);
      values.push(data.title);
    }
    if (data.excerpt !== undefined) {
      updates.push(`excerpt = $${paramCount++}`);
      values.push(data.excerpt);
    }
    if (data.content !== undefined) {
      updates.push(`content = $${paramCount++}`);
      values.push(data.content);
    }
    if (data.category !== undefined) {
      updates.push(`category = $${paramCount++}`);
      values.push(data.category);
    }
    if (data.image !== undefined) {
      updates.push(`image = $${paramCount++}`);
      values.push(data.image);
    }
    if (data.isPublished !== undefined) {
      updates.push(`is_published = $${paramCount++}`);
      values.push(data.isPublished);
    }
    if (data.featured !== undefined) {
      updates.push(`featured = $${paramCount++}`);
      values.push(data.featured);
    }

    if (updates.length === 0) return null;

    updates.push(`updated_at = NOW()`);
    values.push(id);

    await execute(
      `UPDATE blog_posts SET ${updates.join(', ')} WHERE id = $${paramCount}`,
      values
    );

    const result = await queryOne(
      `SELECT * FROM blog_posts WHERE id = $1`,
      [id]
    );
    return result ? normalizeBlogPost(result) : null;
  } catch (err) {
    console.error('[Neon] Failed to update blog post:', err);
    return null;
  }
}

export async function deleteBlogPostNeon(id: string): Promise<boolean> {
  try {
    await execute(`DELETE FROM blog_posts WHERE id = $1`, [id]);
    return true;
  } catch (err) {
    console.error('[Neon] Failed to delete blog post:', err);
    return false;
  }
}

// ─── SITE CONTENT ───────────────────────────────────────────────────────────

export async function getSiteContentNeon(key: string): Promise<string | null> {
  try {
    const result = await queryOne(
      `SELECT value FROM site_content WHERE key = $1`,
      [key]
    );
    return (result as any)?.value || null;
  } catch (err) {
    console.error('[Neon] Failed to fetch site content:', err);
    return null;
  }
}

export async function getAllSiteContentNeon(): Promise<Record<string, string>> {
  try {
    const results = await query(
      `SELECT key, value FROM site_content ORDER BY key ASC`
    );
    return (results || []).reduce((acc: Record<string, string>, row: any) => {
      if (row?.key) acc[String(row.key)] = String(row.value ?? '');
      return acc;
    }, {});
  } catch (err) {
    console.error('[Neon] Failed to fetch all site content:', err);
    return {};
  }
}

export async function updateSiteContentNeon(key: string, value: string): Promise<boolean> {
  try {
    await execute(
      `INSERT INTO site_content (key, value, section)
       VALUES ($1, $2, 'general')
       ON CONFLICT (key)
       DO UPDATE SET value = $2, updated_at = NOW()`,
      [key, value]
    );
    return true;
  } catch (err) {
    console.error('[Neon] Failed to update site content:', err);
    return false;
  }
}

// ─── SETTINGS ─────────────────────────────────────────────────────────────

export async function getSettingsNeon(): Promise<Record<string, unknown> | null> {
  try {
    const result = await queryOne(
      `SELECT * FROM settings WHERE type = 'site' LIMIT 1`
    );
    if (!result) return null;
    return {
      id: result.id,
      phone: result.phone,
      whatsapp: result.whatsapp,
      email: result.email,
      address: result.address,
      socialLinks: result.social_links,
    };
  } catch (err) {
    console.error('[Neon] Failed to fetch settings:', err);
    return null;
  }
}

export async function updateSettingsNeon(data: {
  phone?: string;
  whatsapp?: string;
  email?: string;
  address?: string;
  socialLinks?: Record<string, string>;
}): Promise<Record<string, unknown> | null> {
  try {
    const updates: string[] = [];
    const values: unknown[] = [];
    let paramCount = 1;

    if (data.phone !== undefined) {
      updates.push(`phone = $${paramCount++}`);
      values.push(data.phone);
    }
    if (data.whatsapp !== undefined) {
      updates.push(`whatsapp = $${paramCount++}`);
      values.push(data.whatsapp);
    }
    if (data.email !== undefined) {
      updates.push(`email = $${paramCount++}`);
      values.push(data.email);
    }
    if (data.address !== undefined) {
      updates.push(`address = $${paramCount++}`);
      values.push(data.address);
    }
    if (data.socialLinks !== undefined) {
      updates.push(`social_links = $${paramCount++}`);
      values.push(JSON.stringify(data.socialLinks));
    }

    if (updates.length === 0) return null;

    updates.push(`updated_at = NOW()`);

    const result = await queryOne(
      `UPDATE settings SET ${updates.join(', ')} WHERE type = 'site'
       RETURNING *`,
      ...values
    );
    return result;
  } catch (err) {
    console.error('[Neon] Failed to update settings:', err);
    return null;
  }
}

// ─── MIGRATION HELPER ───────────────────────────────────────────────────────

export async function initializeNeonDatabase(): Promise<boolean> {
  try {
    // Check if tables exist
    const tablesResult = await query(
      `SELECT table_name FROM information_schema.tables
       WHERE table_schema = 'public'`
    );
    
    if (tablesResult.length === 0) {
      console.log('[Neon] Database appears to be empty. Run migrations first.');
      return false;
    }

    console.log('[Neon] Database initialized with tables:', tablesResult.map((t: any) => t.table_name));
    return true;
  } catch (err) {
    console.error('[Neon] Failed to initialize database:', err);
    return false;
  }
}
