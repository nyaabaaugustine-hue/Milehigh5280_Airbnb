# Airtable CMS Setup Guide

This document explains how to set up Airtable as a headless CMS for Milehigh5280.

## Overview

Airtable will serve as your content management system, allowing you to manage:
- **Properties** - Your rental listings
- **Amenities** - Features like WiFi, pool, parking
- **Rooms** - Individual rooms within properties
- **Reviews** - Guest testimonials
- **Blog Posts** - News and articles

## Step 1: Create Airtable Account

1. Go to [airtable.com](https://airtable.com) and sign up (free tier is sufficient)
2. Create a new Base called "Milehigh5280 CMS"

## Step 2: Create Tables

### Table: Properties

| Field Name | Type | Notes |
|------------|------|-------|
| Name | Single line text | Property title |
| Slug | Single line text | URL-friendly (e.g., "the-palm-ayi-mensah") |
| Tagline | Long text | Short description |
| Description | Long text | Full property description |
| Type | Single select | villa, penthouse, estate, cottage, mansion, apartment |
| Badge | Single select | Editors Choice, Most Booked, New Arrival, Exclusive |
| Is Live | Checkbox | Check when property is available |
| City | Single line text | e.g., "Accra" |
| Area | Single line text | e.g., "Ayi Mensah" |
| Country | Single line text | e.g., "Ghana" |
| Price per Night | Number | Base price |
| Price per Week | Number | Weekly rate (optional) |
| Price per Month | Number | Monthly rate (optional) |
| Currency | Single select | USD, GHS |
| Max Guests | Number | Maximum occupancy |
| Bedrooms | Number | Number of bedrooms |
| Bathrooms | Number | Number of bathrooms |
| Beds | Number | Total beds |
| Hero Image | Attachment | Main property photo |
| Gallery | Multiple attachments | Additional photos |
| Amenities | Linked records | Link to Amenities table |
| Features | Long text | List of features (one per line) |
| House Rules | Long text | List of rules (one per line) |
| Check-in Time | Single line text | e.g., "14:00" |
| Check-out Time | Single line text | e.g., "11:00" |
| Rating | Number | e.g., 4.92 |
| Review Count | Number | Total number of reviews |
| Latitude | Number | For map (optional) |
| Longitude | Number | For map (optional) |

### Table: Amenities

| Field Name | Type | Notes |
|------------|------|-------|
| Name | Single line text | e.g., "High-Speed WiFi" |
| Icon | Single line text | Emoji or icon name |
| Category | Single select | essential, comfort, safety, entertainment, outdoor |

### Table: Rooms

| Field Name | Type | Notes |
|------------|------|-------|
| Name | Single line text | e.g., "Master Bedroom" |
| Property | Linked records | Link to Properties table |
| Type | Single select | bedroom, living, dining, kitchen, bathroom, outdoor |
| Description | Long text | Room description |
| Features | Long text | List of features |
| Images | Multiple attachments | Room photos |

### Table: Reviews

| Field Name | Type | Notes |
|------------|------|-------|
| Author | Single line text | Guest name |
| Author Avatar | URL | Profile image |
| Country | Single line text | Guest's country |
| Property | Linked records | Link to Properties table |
| Rating | Number | 1-5 |
| Date | Single line text | e.g., "March 2026" |
| Stay Duration | Single line text | e.g., "5 nights" |
| Comment | Long text | Review text |
| Cleanliness | Number | 1-5 (optional) |
| Location | Number | 1-5 (optional) |
| Value | Number | 1-5 (optional) |
| Communication | Number | 1-5 (optional) |
| Verified | Checkbox | Check when verified |

### Table: Blog Posts

| Field Name | Type | Notes |
|------------|------|-------|
| Title | Single line text | Post title |
| Slug | Single line text | URL-friendly |
| Excerpt | Long text | Short summary |
| Content | Long text | Full article (Markdown supported) |
| Author | Single line text | Author name |
| Author Avatar | URL | Profile image |
| Category | Single select | Travel Tips, Ghana Culture, Host Spotlight, etc. |
| Tag | Single line text | e.g., "Local Guide" |
| Images | Multiple attachments | Featured image |
| Date | Single line text | Publication date |
| Read Time | Single line text | e.g., "5 min read" |
| Published | Checkbox | Check when published |

## Step 3: Get API Credentials

### Personal Access Token

1. Go to [airtable.com/create/tokens](https://airtable.com/create/tokens)
2. Click "Create token"
3. Name it "Milehigh5280 Website"
4. Scopes needed:
   - `data.records:read`
   - `data.records:write`
5. Add your base under "Access resources"
6. Copy the token

### Base ID

1. Open your base
2. Click "Help" → "API documentation"
3. Your Base ID is in the URL: `https://airtable.com/appXXXXXXXXXXXXXX/...`
4. The ID starts with `app`

## Step 4: Configure Environment Variables

Add to `.env.local`:

```env
AIRTABLE_API_KEY=patXXXXXXXXXXXXXX.XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
AIRTABLE_BASE_ID=appXXXXXXXXXXXXXX
```

For Vercel deployment, add these in your project settings under "Environment Variables".

## Step 5: Migrate Existing Data

If you have existing data in `src/lib/data.ts`:

1. Create records in Airtable for each property
2. Create linked amenities, rooms, and reviews
3. Test the API endpoints:
   - `/api/cms/health` - Check connection
   - `/api/cms/properties` - List all properties
   - `/api/cms/amenities` - List all amenities
   - `/api/cms/reviews` - List all reviews

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/cms/properties` | GET | List all properties |
| `/api/cms/properties?slug=xxx` | GET | Get single property |
| `/api/cms/properties?live=true` | GET | List live properties only |
| `/api/cms/amenities` | GET | List all amenities |
| `/api/cms/reviews` | GET | List all reviews |
| `/api/cms/reviews?propertyId=xxx` | GET | List reviews for property |
| `/api/cms/blog` | GET | List all blog posts |
| `/api/cms/blog?slug=xxx` | GET | Get single post |
| `/api/cms/health` | GET | Check Airtable connection |

## React Hooks

Use these hooks in your components:

```tsx
import { useProperties, useProperty, useAmenities, useReviews } from '@/hooks/useCmsData';

// Get all live properties
const { data: properties, loading, error } = useProperties(true);

// Get single property
const { data: property } = useProperty('the-palm-ayi-mensah');

// Get amenities
const { data: amenities } = useAmenities();

// Get reviews for a property
const { data: reviews } = useReviews('property-id');
```

## Caching

Data is cached for:
- Properties: 5 minutes
- Amenities: 10 minutes
- Reviews: 5 minutes
- Blog posts: 10 minutes

To clear cache, redeploy the application.

## Troubleshooting

### "Airtable not configured" error

1. Check that `AIRTABLE_API_KEY` and `AIRTABLE_BASE_ID` are set
2. Verify the Personal Access Token has correct permissions
3. Check that the Base ID is correct

### Data not showing

1. Check `/api/cms/health` endpoint
2. Verify table names match exactly (Properties, Amenities, Rooms, Reviews, Blog Posts)
3. Check field names for typos

### Images not loading

1. Ensure attachments are added to records
2. Check that Airtable attachments are public or use Cloudinary URLs

## Benefits of This Setup

1. **Non-technical updates** - You can update properties, prices, and content without touching code
2. **Instant deployment** - Changes reflect on next page load (5 min cache)
3. **Backup** - All content is safely stored in Airtable
4. **Scalability** - Easy to add new tables and fields
5. **Collaboration** - Multiple team members can edit content
6. **Free** - Airtable free tier supports this setup
