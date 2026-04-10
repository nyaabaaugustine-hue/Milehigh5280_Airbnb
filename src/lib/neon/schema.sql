-- Neon Database Schema for Milehigh5280 Admin Dashboard
-- Run this in Neon SQL Editor

-- Users table for admin authentication
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  role VARCHAR(50) DEFAULT 'admin',
  is_active BOOLEAN DEFAULT true,
  last_login TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Properties table
CREATE TABLE properties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  tagline TEXT,
  description TEXT,
  property_type VARCHAR(50) DEFAULT 'apartment',
  badge VARCHAR(100),
  is_live BOOLEAN DEFAULT false,
  is_featured BOOLEAN DEFAULT false,
  price_per_night DECIMAL(10, 2) NOT NULL,
  price_per_night_ghs DECIMAL(10, 2),
  currency VARCHAR(10) DEFAULT 'USD',
  city VARCHAR(100) DEFAULT 'Accra',
  area VARCHAR(100) DEFAULT 'Ayi Mensah',
  country VARCHAR(100) DEFAULT 'Ghana',
  max_guests INTEGER DEFAULT 2,
  bedrooms INTEGER DEFAULT 1,
  bathrooms INTEGER DEFAULT 1,
  beds INTEGER DEFAULT 1,
  hero_image TEXT,
  gallery JSONB DEFAULT '[]',
  amenities JSONB DEFAULT '[]',
  features JSONB DEFAULT '[]',
  house_rules JSONB DEFAULT '[]',
  check_in_time VARCHAR(10) DEFAULT '14:00',
  check_out_time VARCHAR(10) DEFAULT '11:00',
  rating DECIMAL(3, 2) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Amenities table
CREATE TABLE amenities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  icon VARCHAR(50) DEFAULT '🏠',
  category VARCHAR(50) DEFAULT 'essential',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Reviews table
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author VARCHAR(255) NOT NULL,
  author_image TEXT,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  content TEXT NOT NULL,
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  is_verified BOOLEAN DEFAULT false,
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Blog posts table
CREATE TABLE blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT,
  author VARCHAR(100) DEFAULT 'Milehigh Properties',
  category VARCHAR(50) DEFAULT 'Travel',
  image TEXT,
  read_time VARCHAR(20) DEFAULT '5 min read',
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Site content table
CREATE TABLE site_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key VARCHAR(100) UNIQUE NOT NULL,
  value TEXT,
  section VARCHAR(50) DEFAULT 'general',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Settings table
CREATE TABLE settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type VARCHAR(50) NOT NULL,
  phone VARCHAR(50),
  whatsapp VARCHAR(50),
  email VARCHAR(255),
  address TEXT,
  social_links JSONB DEFAULT '{}',
  concierge_hours JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Action logs for AI Portal Manager
CREATE TABLE action_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tool VARCHAR(100) NOT NULL,
  input JSONB NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  executed_by VARCHAR(100),
  before_data JSONB,
  after_data JSONB,
  airtable_record_id VARCHAR(100),
  error TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default admin user (password: admin123)
INSERT INTO users (email, password_hash, first_name, last_name, role) VALUES 
('admin@milehigh5280.com', '$2a$10$YourHashHere', 'Admin', 'User', 'admin');

-- Insert sample property
INSERT INTO properties (name, slug, tagline, description, price_per_night, price_per_night_ghs, city, area, is_live, hero_image)
VALUES (
  'The Palm 🌴',
  'the-palm-ayi-mensah',
  'Your Luxury Escape in Ghana',
  'A beautifully furnished private apartment in the tranquil Ayi Mensah area of Accra, managed by Milehigh Properties.',
  75.00,
  1185.00,
  'Accra',
  'Ayi Mensah',
  true,
  'https://res.cloudinary.com/dwsl2ktt2/image/upload/v1775296671/5_yc05lt.jpg'
);

-- Insert sample amenities
INSERT INTO amenities (name, icon, category) VALUES 
('Air Conditioning', '❄️', 'essential'),
('WiFi', '📶', 'essential'),
('Pool', '🏊', 'premium'),
('Kitchen', '🍳', 'essential'),
('Parking', '🅿️', 'essential'),
('Security', '🔒', 'premium');

-- Insert sample site content
INSERT INTO site_content (key, value, section) VALUES 
('hero_title', 'Your Luxury Escape in Ghana', 'home'),
('hero_subtitle', 'Experience authentic Ghanaian hospitality at The Palm, Ayi Mensah', 'home'),
('about_text', 'Milehigh5280 offers premium short-stay accommodations in Accra, Ghana.', 'about'),
('contact_email', 'herbertprempeh@gmail.com', 'contact'),
('contact_phone', '+233 599 754 270', 'contact');
