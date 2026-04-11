import 'dotenv/config';
import { query, execute } from './client';

async function main() {
  console.log('Seeding property...');
  console.log('DB connected:', !!query);
  
  const existing = await query(`SELECT id FROM properties WHERE is_live = true LIMIT 1`);
  if (existing.length > 0) {
    console.log('Live property already exists');
    console.log('Existing:', existing);
    return;
  }
  
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
      'https://res.cloudinary.com/dwsl2ktt2/image/upload/v1775296671/5_yc05lt.jpg',
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
  
  console.log('✅ Property seeded successfully!');
}

main().catch(console.error);