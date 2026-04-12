-- Seed Amenities
INSERT INTO amenities (name, icon, category) VALUES 
('High-Speed Wi-Fi', 'wifi', 'essential'),
('Air Conditioning', 'air-con', 'comfort'),
('Fully Equipped Kitchen', 'kitchen', 'essential'),
('Private Parking', 'parking', 'outdoor'),
('24/7 Security', 'security', 'safety'),
('Smart TV', 'tv', 'entertainment')
ON CONFLICT (name) DO NOTHING;

-- Seed "The Palm" Property
INSERT INTO properties (
    name, slug, tagline, description, type, badge, 
    city, area, country, price_per_night, currency, 
    max_guests, bedrooms, bathrooms, is_featured, hero_image, gallery, 
    rating, review_count, is_live
) VALUES (
    'The Palm', 
    'the-palm-ayi-mensah', 
    'Your Private Sanctuary in Ghana', 
    'Handpicked luxury accommodations in Ghana — private, secure, and beautifully maintained. Located at the foot of the Aburi mountains, offering serene views and modern luxury.', 
    'villa', 
    'Featured', 
    'Accra', 
    'Ayi Mensah', 
    'Ghana', 
    50.00, 
    'USD', 
    4, 
    2, 
    1, 
    true,
    'https://res.cloudinary.com/dwsl2ktt2/image/upload/v1775380667/ERR_jjr2hx.jpg',
    '[
        {"url": "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=800&q=80", "alt": "Living Room", "category": "interior"},
        {"url": "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=800&q=80", "alt": "Primary Bedroom", "category": "interior"},
        {"url": "https://images.unsplash.com/photo-1560185127-6ed189bf02f4?auto=format&fit=crop&w=800&q=80", "alt": "Guest Room", "category": "interior"},
        {"url": "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80", "alt": "Balcony View", "category": "exterior"},
        {"url": "https://images.unsplash.com/photo-1512918766671-ed6a07be0618?auto=format&fit=crop&w=800&q=80", "alt": "Kitchen", "category": "interior"}
    ]',
    4.9, 
    28, 
    true
) ON CONFLICT (slug) DO UPDATE SET 
    is_featured = EXCLUDED.is_featured,
    price_per_night = EXCLUDED.price_per_night,
    hero_image = EXCLUDED.hero_image,
    gallery = EXCLUDED.gallery,
    rating = EXCLUDED.rating,
    review_count = EXCLUDED.review_count;

-- Seed Sample Reviews for "The Palm"
-- Note: Adjust property_id based on the generated ID from the insert above
INSERT INTO reviews (
    property_id, author, author_image, country, rating, date, stay_duration, comment, is_verified
) 
SELECT 
    id, 'Sarah Johnson', 'https://i.pravatar.cc/150?u=sarah', 'United Kingdom', 5, 'March 2024', '5 nights', 'Absolutely stunning villa! The security was top-notch and the views of the mountains are breathtaking.', true
FROM properties WHERE slug = 'the-palm-ayi-mensah'
UNION ALL
SELECT 
    id, 'Kwame Mensah', 'https://i.pravatar.cc/150?u=kwame', 'Ghana', 5, 'February 2024', '3 nights', 'Best stay in Accra. Very clean, high-speed internet worked perfectly for my remote meetings.', true
FROM properties WHERE slug = 'the-palm-ayi-mensah'
UNION ALL
SELECT 
    id, 'Elena Rodriguez', 'https://i.pravatar.cc/150?u=elena', 'Spain', 4, 'January 2024', '1 week', 'Beautiful home. The location is peaceful and away from the city noise.', true
FROM properties WHERE slug = 'the-palm-ayi-mensah';