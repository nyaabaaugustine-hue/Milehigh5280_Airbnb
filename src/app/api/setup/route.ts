import { NextResponse } from 'next/server';
import { query, execute } from '@/lib/neon/client';

export async function POST() {
  try {
    // Create tables
    await execute(`CREATE TABLE IF NOT EXISTS properties (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name VARCHAR(255) NOT NULL,
      slug VARCHAR(255) UNIQUE NOT NULL,
      tagline TEXT,
      description TEXT,
      long_description TEXT,
      property_type VARCHAR(50) NOT NULL DEFAULT 'apartment',
      badge VARCHAR(100),
      is_live BOOLEAN NOT NULL DEFAULT false,
      is_featured BOOLEAN NOT NULL DEFAULT false,
      price_per_night DECIMAL(10,2) NOT NULL DEFAULT 0,
      price_per_night_ghs DECIMAL(10,2),
      currency VARCHAR(10) NOT NULL DEFAULT 'USD',
      city VARCHAR(100) NOT NULL DEFAULT 'Accra',
      area VARCHAR(100) NOT NULL DEFAULT 'Ayi Mensah',
      country VARCHAR(100) NOT NULL DEFAULT 'Ghana',
      max_guests INTEGER NOT NULL DEFAULT 2,
      bedrooms INTEGER NOT NULL DEFAULT 1,
      bathrooms INTEGER NOT NULL DEFAULT 1,
      beds INTEGER NOT NULL DEFAULT 1,
      hero_image TEXT,
      hero_image_alt TEXT,
      gallery JSONB NOT NULL DEFAULT '[]',
      amenities JSONB NOT NULL DEFAULT '[]',
      features JSONB NOT NULL DEFAULT '[]',
      house_rules JSONB NOT NULL DEFAULT '[]',
      check_in_time VARCHAR(10) NOT NULL DEFAULT '14:00',
      check_out_time VARCHAR(10) NOT NULL DEFAULT '11:00',
      rating DECIMAL(3,2) NOT NULL DEFAULT 0,
      review_count INTEGER NOT NULL DEFAULT 0,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )`);

    await execute(`CREATE TABLE IF NOT EXISTS amenities (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name VARCHAR(255) NOT NULL,
      icon VARCHAR(50) DEFAULT '✨',
      category VARCHAR(50) DEFAULT 'essential',
      description TEXT,
      is_active BOOLEAN DEFAULT true,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )`);

    await execute(`CREATE TABLE IF NOT EXISTS blog_posts (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      title VARCHAR(255) NOT NULL,
      slug VARCHAR(255) UNIQUE NOT NULL,
      excerpt TEXT,
      content TEXT,
      author VARCHAR(255) DEFAULT 'Admin',
      author_avatar TEXT,
      category VARCHAR(100) DEFAULT 'General',
      tag VARCHAR(100),
      image TEXT,
      date TIMESTAMPTZ,
      read_time VARCHAR(20),
      is_published BOOLEAN DEFAULT false,
      featured BOOLEAN DEFAULT false,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    )`);

    await execute(`CREATE TABLE IF NOT EXISTS reviews (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      author VARCHAR(255) NOT NULL,
      author_image TEXT,
      country VARCHAR(100),
      rating INTEGER NOT NULL DEFAULT 5,
      comment TEXT,
      stay_duration VARCHAR(50),
      property_id UUID,
      is_verified BOOLEAN DEFAULT false,
      is_featured BOOLEAN DEFAULT false,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )`);

    await execute(`CREATE TABLE IF NOT EXISTS settings (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      type VARCHAR(50) NOT NULL,
      phone VARCHAR(50),
      whatsapp VARCHAR(50),
      email VARCHAR(255),
      address TEXT,
      social_links JSONB DEFAULT '{}',
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    )`);

    // Check if property exists
    const existing = await query(`SELECT id FROM properties WHERE slug = 'the-palm' LIMIT 1`);
    
    if (existing.length === 0) {
      const pricePerNight = 150;
      const pricePerNightGhs = pricePerNight * 15.8;
      
      await execute(
        `INSERT INTO properties (
          name, slug, tagline, description, long_description, property_type, badge,
          price_per_night, price_per_night_ghs, is_live, is_featured, rating, review_count,
          hero_image, hero_image_alt, gallery, amenities, bedrooms, bathrooms, beds,
          max_guests, city, area, country
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24)`,
        [
          'The Palm',
          'the-palm',
          'Your Private Sanctuary in Ghana',
          'A beautifully furnished private apartment in the serene Ayi Mensah area of Accra.',
          'Welcome to The Palm, your home away from home. This luxury private apartment offers the perfect blend of modern comfort and authentic Ghanaian warmth.',
          'apartment',
          'Featured',
          pricePerNight,
          pricePerNightGhs,
          true,
          true,
          4.9,
          28,
          'https://res.cloudinary.com/dwsl2ktt2/image/upload/v1775296671/5_yc05lt.jpg',
          'The Palm - Luxury apartment',
          JSON.stringify([
            { url: 'https://res.cloudinary.com/dwsl2ktt2/image/upload/v1775296671/5_yc05lt.jpg', alt: 'Living room' },
            { url: 'https://res.cloudinary.com/dwsl2ktt2/image/upload/v1775411320/images_1_kilffq.jpg', alt: 'Bedroom' },
          ]),
          JSON.stringify(['wifi', 'air-conditioning', 'kitchen', 'parking', 'washer', 'tv']),
          2,
          1,
          1,
          4,
          'Ayi Mensah',
          'Accra',
          'Ghana',
        ]
      );
      
      return NextResponse.json({ success: true, message: 'Tables created and property seeded!' });
    }
    
    return NextResponse.json({ success: true, message: 'Property already exists' });
    
  } catch (err) {
    console.error('Setup error:', err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}