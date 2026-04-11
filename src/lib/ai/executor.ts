// ─── AI Executor for Neon Postgres ───────────────────────────────────────────
// This replaces Airtable mutations with Neon database operations

import { updatePropertyNeon, createPropertyNeon, getAllPropertiesNeon, getAllBlogPostsNeon, updateBlogPostNeon } from '@/lib/neon/service';
import { query, execute } from '@/lib/neon/client';
import type { AIInterpretResponse } from './types';
import type { ActionLog, ExecutionResult } from './types';
import { markExecuted, markFailed } from './logger';

const USD_TO_GHS = 15.8;

export async function executeAction(log: ActionLog): Promise<ExecutionResult> {
  if (log.status !== 'approved') {
    return { success: false, logId: log.id, message: 'Action must be approved before execution.' };
  }

  try {
    const result = await dispatch(log);
    await markExecuted(log.id, {
      before: result.before,
      after: result.after,
    });
    return result;
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    await markFailed(log.id, msg);
    return { success: false, logId: log.id, message: `Execution failed: ${msg}` };
  }
}

async function dispatch(log: ActionLog): Promise<ExecutionResult> {
  const data = log.input as unknown as Record<string, unknown>;
  
  switch (log.tool) {
    case 'updateContent':
      return executeUpdateContent(log.id, data);
    case 'updateContactInfo':
      return executeUpdateContactInfo(log.id, data);
    case 'updateProperty':
      return executeUpdateProperty(log.id, data);
    case 'updatePropertyPrice':
      return executeUpdatePropertyPrice(log.id, data);
    case 'bulkUpdatePrices':
      return executeBulkUpdatePrices(log.id, data);
    case 'createProperty':
      return executeCreateProperty(log.id, data);
    case 'togglePropertyLive':
      return executeTogglePropertyLive(log.id, data);
    case 'publishBlogPost':
      return executePublishBlogPost(log.id, data, true);
    case 'unpublishBlogPost':
      return executePublishBlogPost(log.id, data, false);
    case 'createBlogPost':
      return executeCreateBlogPost(log.id, data);
    case 'updateBlogPost':
      return executeUpdateBlogPost(log.id, data);
    case 'createAmenity':
      return executeCreateAmenity(log.id, data);
    case 'updateAmenity':
      return executeUpdateAmenity(log.id, data);
    case 'deleteAmenity':
      return executeDeleteAmenity(log.id, data);
    case 'approveReview':
      return executeApproveReview(log.id, data);
    case 'updateSiteSettings':
      return executeUpdateSiteSettings(log.id, data);
    case 'createReview':
      return executeCreateReview(log.id, data);
    default:
      throw new Error(`Unknown tool: ${log.tool}`);
  }
}

async function executeUpdateContent(logId: string, input: Record<string, unknown>): Promise<ExecutionResult> {
  const key = input.key as string;
  const value = input.value as string;
  const section = input.section as string;
  
  // Update site_content table
  const result = await execute(
    `UPDATE site_content SET content = $1, updated_at = NOW() WHERE section = $2 AND content_key = $3`,
    [value, section, key]
  );

  if (result) {
    return {
      success: true,
      logId,
      message: `Updated "${key}" in section "${section}"`,
      before: {},
      after: { [key]: value },
    };
  }
  
  // Try insert if update didn't match
  await execute(
    `INSERT INTO site_content (content_key, content, section, created_at, updated_at) VALUES ($1, $2, $3, NOW(), NOW())`,
    [key, value, section]
  );

  return {
    success: true,
    logId,
    message: `Created content "${key}" in section "${section}"`,
    before: {},
    after: { [key]: value },
  };
}

async function executeUpdateContactInfo(logId: string, input: Record<string, unknown>): Promise<ExecutionResult> {
  const field = input.field as string;
  const value = input.value as string;
  
  const fieldMap: Record<string, string> = {
    phone: 'phone',
    whatsapp: 'whatsapp',
    email: 'email',
    location: 'location',
  };
  
  const dbField = fieldMap[field] || field;
  
  const result = await execute(
    `UPDATE settings SET value = $1, updated_at = NOW() WHERE key = $2`,
    [value, dbField]
  );

  if (result) {
    return {
      success: true,
      logId,
      message: `Contact ${field} updated to "${value}"`,
      before: {},
      after: { [field]: value },
    };
  }

  // Create if doesn't exist
  await execute(
    `INSERT INTO settings (key, value, category, created_at, updated_at) VALUES ($1, $2, 'contact', NOW(), NOW())`,
    [dbField, value]
  );

  return {
    success: true,
    logId,
    message: `Contact ${field} set to "${value}"`,
    before: {},
    after: { [field]: value },
  };
}

async function executeUpdateProperty(logId: string, input: Record<string, unknown>): Promise<ExecutionResult> {
  const propertyId = input.propertyId as string;
  const updates = input.updates as Record<string, unknown>;
  
  const result = await updatePropertyNeon(propertyId, updates as any);
  
  if (!result) {
    throw new Error(`Property not found: ${propertyId}`);
  }

  return {
    success: true,
    logId,
    message: `Property updated`,
    before: {},
    after: updates,
  };
}

async function executeUpdatePropertyPrice(logId: string, input: Record<string, unknown>): Promise<ExecutionResult> {
  const propertyId = String(input.propertyId || '');
  const newPriceUSD = Number(input.newPriceUSD) || 0;
  const newPriceGHS = input.newPriceGHS ? Number(input.newPriceGHS) : Math.round(newPriceUSD * USD_TO_GHS);

  const result = await updatePropertyNeon(propertyId, {
    pricing: { perNight: newPriceUSD, perNightGHS: newPriceGHS, currency: 'USD' },
  });

  if (!result) {
    throw new Error(`Property not found: ${propertyId}`);
  }

  return {
    success: true,
    logId,
    message: `Price updated to $${newPriceUSD} / GHS ${newPriceGHS}`,
    before: {},
    after: { priceUSD: newPriceUSD, priceGHS: newPriceGHS },
  };
}

async function executeBulkUpdatePrices(logId: string, input: Record<string, unknown>): Promise<ExecutionResult> {
  const percentageChange = input.percentageChange as number;
  const multiplier = 1 + percentageChange / 100;

  const properties = await getAllPropertiesNeon();
  let updated = 0;

  for (const prop of properties) {
    const currentUSD = prop.pricing.perNight || 0;
    const newUSD = Math.round(currentUSD * multiplier);
    const newGHS = Math.round(newUSD * USD_TO_GHS);
    
    await updatePropertyNeon(prop.id, {
      pricing: { perNight: newUSD, perNightGHS: newGHS, currency: 'USD' },
    });
    updated++;
  }

  return {
    success: true,
    logId,
    message: `Bulk price ${percentageChange > 0 ? 'increase' : 'decrease'} of ${Math.abs(percentageChange)}% applied to ${updated} properties`,
    before: {},
    after: { updated: updated },
  };
}

async function executeCreateProperty(logId: string, input: Record<string, unknown>): Promise<ExecutionResult> {
  const name = input.name as string;
  const tagline = input.tagline as string;
  const description = input.description as string;
  const pricePerNight = input.pricePerNight as number;
  const location = input.location as string;
  const bedrooms = input.bedrooms as number;
  const bathrooms = input.bathrooms as number;
  const guests = input.guests as number;
  const type = input.type as string;

  const result = await createPropertyNeon({
    name,
    slug: name.toLowerCase().replace(/\s+/g, '-'),
    tagline,
    description,
    type: type as any,
    pricing: { perNight: pricePerNight, perNightGHS: Math.round(pricePerNight * USD_TO_GHS), currency: 'USD' },
    location: { city: location, area: location, country: 'Ghana' },
    capacity: { guests, bedrooms, bathrooms, beds: bedrooms },
    images: { hero: { url: '', alt: name }, gallery: [] },
    amenities: [],
    features: [],
    houseRules: [],
    checkInTime: '14:00',
    checkOutTime: '11:00',
    isLive: false,
    featured: false,
  });

  if (!result) {
    throw new Error('Failed to create property');
  }

  return {
    success: true,
    logId,
    message: `Property "${name}" created`,
    before: {},
    after: { name, pricePerNight },
  };
}

async function executeTogglePropertyLive(logId: string, input: Record<string, unknown>): Promise<ExecutionResult> {
  const propertyId = input.propertyId as string;
  const isLive = input.isLive as boolean;

  const result = await updatePropertyNeon(propertyId, { isLive });

  if (!result) {
    throw new Error(`Property not found: ${propertyId}`);
  }

  return {
    success: true,
    logId,
    message: `Property ${isLive ? 'published' : 'unpublished'}`,
    before: {},
    after: { isLive },
  };
}

async function executePublishBlogPost(logId: string, input: Record<string, unknown>, publish: boolean): Promise<ExecutionResult> {
  const postId = input.postId as string;
  
  let targetId = postId;
  if (postId === 'latest') {
    const posts = await getAllBlogPostsNeon();
    if (posts.length === 0) throw new Error('No blog posts found');
    targetId = posts[0].id;
  }

  const result = await updateBlogPostNeon(targetId, {
    isPublished: publish,
  });

  if (!result) {
    throw new Error(`Blog post not found: ${targetId}`);
  }

  return {
    success: true,
    logId,
    message: `Blog post ${publish ? 'published' : 'unpublished'}`,
    before: {},
    after: { isPublished: publish },
  };
}

async function executeCreateBlogPost(logId: string, input: Record<string, unknown>): Promise<ExecutionResult> {
  const title = input.title as string;
  const excerpt = input.excerpt as string;
  const content = input.content as string;
  const category = input.category as string || 'Uncategorized';
  const tag = input.tag as string || '';
  const image = input.image as string || '';
  const author = input.author as string || 'Admin';
  
  const slug = title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  
  const result = await execute(
    `INSERT INTO blog_posts (title, slug, excerpt, content, category, tag, image, author, is_published, created_at, updated_at)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, false, NOW(), NOW())`,
    [title, slug, excerpt, content, category, tag, image, author]
  );

  if (!result) throw new Error('Failed to create blog post');

  return {
    success: true,
    logId,
    message: `Created new blog post: "${title}"`,
    before: {},
    after: { title, slug, category },
  };
}

async function executeUpdateBlogPost(logId: string, input: Record<string, unknown>): Promise<ExecutionResult> {
  const postId = input.postId as string;
  const updates: Record<string, unknown> = {};
  
  if (input.title) updates.title = input.title;
  if (input.excerpt) updates.excerpt = input.excerpt;
  if (input.content) updates.content = input.content;
  if (input.category) updates.category = input.category;
  if (input.tag) updates.tag = input.tag;
  if (input.image) updates.image = input.image;

  const result = await updateBlogPostNeon(postId, updates as any);
  if (!result) throw new Error(`Blog post not found: ${postId}`);

  return {
    success: true,
    logId,
    message: `Updated blog post`,
    before: {},
    after: updates,
  };
}

async function executeCreateAmenity(logId: string, input: Record<string, unknown>): Promise<ExecutionResult> {
  const name = input.name as string;
  const icon = input.icon as string || 'Star';
  const category = input.category as string || 'General';

  const result = await execute(
    `INSERT INTO amenities (name, icon, category, is_active, created_at)
     VALUES ($1, $2, $3, true, NOW())`,
    [name, icon, category]
  );

  if (!result) throw new Error('Failed to create amenity');

  return {
    success: true,
    logId,
    message: `Created new amenity: "${name}"`,
    before: {},
    after: { name, icon, category },
  };
}

async function executeUpdateAmenity(logId: string, input: Record<string, unknown>): Promise<ExecutionResult> {
  const amenityId = input.amenityId as string;
  const name = input.name as string;
  const icon = input.icon as string;
  const category = input.category as string;

  const result = await execute(
    `UPDATE amenities SET name = $1, icon = $2, category = $3 WHERE id = $4`,
    [name, icon, category, amenityId]
  );

  if (!result) throw new Error(`Amenity not found: ${amenityId}`);

  return {
    success: true,
    logId,
    message: `Updated amenity: "${name}"`,
    before: {},
    after: { name, icon, category },
  };
}

async function executeDeleteAmenity(logId: string, input: Record<string, unknown>): Promise<ExecutionResult> {
  const amenityId = input.amenityId as string;

  const result = await execute(
    `DELETE FROM amenities WHERE id = $1`,
    [amenityId]
  );

  if (!result) throw new Error(`Amenity not found: ${amenityId}`);

  return {
    success: true,
    logId,
    message: `Deleted amenity`,
    before: {},
    after: {},
  };
}

async function executeApproveReview(logId: string, input: Record<string, unknown>): Promise<ExecutionResult> {
  const reviewId = input.reviewId as string;

  const result = await execute(
    `UPDATE reviews SET is_verified = true WHERE id = $1`,
    [reviewId]
  );

  return {
    success: true,
    logId,
    message: `Approved review`,
    before: {},
    after: { isVerified: true },
  };
}

async function executeUpdateSiteSettings(logId: string, input: Record<string, unknown>): Promise<ExecutionResult> {
  const settings: Record<string, unknown> = {};
  
  if (input.currency) settings.currency = input.currency;
  if (input.timezone) settings.timezone = input.timezone;
  if (input.minNights) settings.min_nights = input.minNights;
  if (input.checkinTime) settings.checkin_time = input.checkinTime;
  if (input.checkoutTime) settings.checkout_time = input.checkoutTime;

  for (const [key, value] of Object.entries(settings)) {
    await execute(
      `INSERT INTO settings (key, value, category, created_at, updated_at)
       VALUES ($1, $2, 'site', NOW(), NOW())
       ON CONFLICT (key) DO UPDATE SET value = $2, updated_at = NOW()`,
      [key, value]
    );
  }

  return {
    success: true,
    logId,
    message: `Updated site settings`,
    before: {},
    after: settings,
  };
}

async function executeCreateReview(logId: string, input: Record<string, unknown>): Promise<ExecutionResult> {
  const author = input.author as string;
  const rating = input.rating as number;
  const comment = input.comment as string;
  const propertyId = input.propertyId as string || '1';
  const country = input.country as string || 'Guest';

  const result = await execute(
    `INSERT INTO reviews (author, country, rating, comment, property_id, is_verified, is_featured, created_at)
     VALUES ($1, $2, $3, $4, $5, false, false, NOW())`,
    [author, country, rating, comment, propertyId]
  );

  if (!result) throw new Error('Failed to create review');

  return {
    success: true,
    logId,
    message: `Created new review from ${author}`,
    before: {},
    after: { author, rating },
  };
}