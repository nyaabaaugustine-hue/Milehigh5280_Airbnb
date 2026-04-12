// Seed script to populate Neon database with initial content
// Run this once to sync existing data to Neon

import { execute, query } from '@/lib/neon/client';
import { CONTACT_INFO, getExperiences } from '@/lib/data';

const USD_TO_GHS = 15.8;

async function seedSettings() {
  console.log('Seeding settings...');
  
  // Check if settings exist
  const existing = await query(`SELECT id FROM settings WHERE type = 'site' LIMIT 1`);
  
  if (existing.length === 0) {
    await execute(
      `INSERT INTO settings (type, phone, whatsapp, email, address, social_links)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [
        'site',
        CONTACT_INFO.phone,
        CONTACT_INFO.whatsapp,
        CONTACT_INFO.email,
        CONTACT_INFO.location,
        JSON.stringify({
          facebook: 'https://facebook.com/milehigh5280',
          instagram: '',
          twitter: '',
          youtube: '',
        }),
      ]
    );
    console.log('Settings seeded');
  } else {
    console.log('Settings already exist');
  }
}

async function seedProperties() {
  console.log('Seeding properties...');
  
  const existing = await query(`SELECT id FROM properties LIMIT 1`);
  if (existing.length > 0) {
    console.log('Properties already exist');
    return;
  }

  // Seed main property - The Palm
  const pricePerNight = 50;
  const pricePerNightGhs = pricePerNight * USD_TO_GHS;
  
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
      'A beautifully furnished private apartment in the serene Ayi Mensah area of Accra, managed by Milehigh Properties — offering comfort, privacy, and premium hospitality.',
      'Welcome to The Palm, your home away from home in the heart of Ghana. This luxury private apartment offers the perfect blend of modern comfort and authentic Ghanaian warmth. Located in the peaceful Ayi Mensah area, just 30 minutes from Accra\'s bustling city center, The Palm provides a tranquil escape while remaining conveniently close to attractions, restaurants, and amenities.',
      'apartment',
      'Featured',
      pricePerNight,
      pricePerNightGhs,
      true,
      true,
      4.9,
      28,
      'https://res.cloudinary.com/dwsl2ktt2/image/upload/v1775380667/ERR_jjr2hx.jpg',
      'The Palm - Luxury apartment in Ayi Mensah',
      JSON.stringify([
        { url: 'https://res.cloudinary.com/dwsl2ktt2/image/upload/v1775296671/5_yc05lt.jpg', alt: 'Living room' },
        { url: 'https://res.cloudinary.com/dwsl2ktt2/image/upload/v1775411320/images_1_kilffq.jpg', alt: 'Bedroom' },
        { url: 'https://res.cloudinary.com/dwsl2ktt2/image/upload/v1775296671/logo_xcjkpn.jpg', alt: 'Kitchen' },
      ]),
      JSON.stringify(['wifi', 'air-conditioning', 'kitchen', 'parking', 'washer', 'tv', 'hot-tub', 'security']),
      2,
      1,
      1,
      4,
      'Ayi Mensah',
      'Accra',
      'Ghana',
    ]
  );
  console.log('Properties seeded');
}

async function seedAmenities() {
  console.log('Seeding amenities...');
  
  const existing = await query(`SELECT id FROM amenities LIMIT 1`);
  if (existing.length > 0) {
    console.log('Amenities already exist');
    return;
  }

  const amenities = [
    { name: 'High-Speed WiFi', icon: '📶', category: 'essential', description: 'Reliable internet for work and streaming' },
    { name: 'Air Conditioning', icon: '❄️', category: 'essential', description: 'Stay cool in Ghana\'s climate' },
    { name: 'Fully Equipped Kitchen', icon: '🍳', category: 'essential', description: 'Cook your favorite meals' },
    { name: 'Free Parking', icon: '🚗', category: 'essential', description: 'Secure on-site parking' },
    { name: 'Smart TV', icon: '📺', category: 'comfort', description: 'Streaming services included' },
    { name: 'Hot Tub', icon: '🧖', category: 'comfort', description: 'Relax in our private hot tub' },
    { name: 'Security System', icon: '🔐', category: 'safety', description: '24/7 security for your peace of mind' },
    { name: 'Washer & Dryer', icon: '🧺', category: 'essential', description: 'In-unit laundry facilities' },
    { name: 'Private Garden', icon: '🌳', category: 'outdoor', description: 'Serene outdoor space' },
    { name: 'Workspace', icon: '💼', category: 'essential', description: 'Dedicated work area with desk' },
  ];

  for (const a of amenities) {
    await execute(
      `INSERT INTO amenities (name, icon, category, description, is_active)
       VALUES ($1, $2, $3, $4, true)`,
      [a.name, a.icon, a.category, a.description]
    );
  }
  console.log('Amenities seeded');
}

async function seedBlogPosts() {
  console.log('Seeding blog posts...');
  
  const existing = await query(`SELECT id FROM blog_posts LIMIT 1`);
  if (existing.length > 0) {
    console.log('Blog posts already exist');
    return;
  }

  const posts = [
    {
      title: 'Discover Ayi Mensah: Ghana\'s Hidden Gem',
      slug: 'discover-ayi-mensah',
      excerpt: '30 minutes from Accra\'s hustle lies a lush, bird-filled hill town where luxury meets authenticity.',
      content: 'Ayi Mensah is a serene village located in the eastern region of Accra, Ghana. Known for its rolling hills, lush vegetation, and peaceful atmosphere, it offers visitors a unique blend of natural beauty and authentic Ghanaian hospitality...',
      author: 'Milehigh Team',
      category: 'Destination',
      image: 'https://res.cloudinary.com/dwsl2ktt2/image/upload/v1775296671/5_yc05lt.jpg',
      isPublished: true,
      featured: true,
    },
    {
      title: 'Top 5 Things to Do in Accra',
      slug: 'top-5-things-accra',
      excerpt: 'From cultural landmarks to hidden beaches, discover the best of Ghana\'s capital.',
      content: 'Accra is a vibrant city with something for everyone. Here are our top picks...',
      author: 'Augustine N.',
      category: 'Travel Tips',
      image: 'https://res.cloudinary.com/dwsl2ktt2/image/upload/v1775411320/images_1_kilffq.jpg',
      isPublished: true,
      featured: false,
    },
    {
      title: 'Why Ghana Should Be Your Next Destination',
      slug: 'why-ghana-next-destination',
      excerpt: 'From rich history to warm hospitality, Ghana offers an unforgettable experience.',
      content: 'Ghana has emerged as one of Africa\'s top travel destinations, and for good reason...',
      author: 'Herbert P.',
      category: 'Ghana Culture',
      image: 'https://res.cloudinary.com/dwsl2ktt2/image/upload/v1775296671/logo_xcjkpn.jpg',
      isPublished: true,
      featured: true,
    },
  ];

  for (const p of posts) {
    await execute(
      `INSERT INTO blog_posts (title, slug, excerpt, content, author, category, image, is_published, featured)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
      [p.title, p.slug, p.excerpt, p.content, p.author, p.category, p.image, p.isPublished, p.featured]
    );
  }
  console.log('Blog posts seeded');
}

async function main() {
  console.log('Starting seed...');
  
  try {
    await seedSettings();
    await seedProperties();
    await seedAmenities();
    await seedBlogPosts();
    
    console.log('Seed completed successfully!');
  } catch (err) {
    console.error('Seed failed:', err);
    throw err;
  }
}

main();