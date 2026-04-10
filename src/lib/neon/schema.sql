-- ============================================================
-- Milehigh5280 — Neon Postgres Schema
-- Run this in the Neon SQL Editor (console.neon.tech)
-- ============================================================

-- ── Extensions ──────────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ── Users (admin auth) ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
  id            UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  email         VARCHAR(255)  UNIQUE NOT NULL,
  password_hash VARCHAR(255)  NOT NULL,
  first_name    VARCHAR(100),
  last_name     VARCHAR(100),
  role          VARCHAR(50)   NOT NULL DEFAULT 'admin',
  is_active     BOOLEAN       NOT NULL DEFAULT true,
  last_login    TIMESTAMPTZ,
  created_at    TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

-- ── Properties ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS properties (
  id                  UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  name                VARCHAR(255)  NOT NULL,
  slug                VARCHAR(255)  UNIQUE NOT NULL,
  tagline             TEXT,
  description         TEXT,
  long_description    TEXT,
  property_type       VARCHAR(50)   NOT NULL DEFAULT 'apartment',
  badge               VARCHAR(100),
  is_live             BOOLEAN       NOT NULL DEFAULT false,
  is_featured         BOOLEAN       NOT NULL DEFAULT false,
  price_per_night     DECIMAL(10,2) NOT NULL DEFAULT 0,
  price_per_night_ghs DECIMAL(10,2),
  currency            VARCHAR(10)   NOT NULL DEFAULT 'USD',
  city                VARCHAR(100)  NOT NULL DEFAULT 'Accra',
  area                VARCHAR(100)  NOT NULL DEFAULT 'Ayi Mensah',
  country             VARCHAR(100)  NOT NULL DEFAULT 'Ghana',
  max_guests          INTEGER       NOT NULL DEFAULT 2,
  bedrooms            INTEGER       NOT NULL DEFAULT 1,
  bathrooms           INTEGER       NOT NULL DEFAULT 1,
  beds                INTEGER       NOT NULL DEFAULT 1,
  hero_image          TEXT,
  hero_image_alt      TEXT,
  gallery             JSONB         NOT NULL DEFAULT '[]',
  amenities           JSONB         NOT NULL DEFAULT '[]',
  features            JSONB         NOT NULL DEFAULT '[]',
  house_rules         JSONB         NOT NULL DEFAULT '[]',
  check_in_time       VARCHAR(10)   NOT NULL DEFAULT '14:00',
  check_out_time      VARCHAR(10)   NOT NULL DEFAULT '11:00',
  rating              DECIMAL(3,2)  NOT NULL DEFAULT 0,
  review_count        INTEGER       NOT NULL DEFAULT 0,
  lat                 DECIMAL(9,6),
  lng                 DECIMAL(9,6),
  created_at          TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

-- ── Amenities ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS amenities (
  id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  name       VARCHAR(100) NOT NULL,
  icon       VARCHAR(50)  NOT NULL DEFAULT '🏠',
  category   VARCHAR(50)  NOT NULL DEFAULT 'essential',
  is_active  BOOLEAN      NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- ── Reviews ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS reviews (
  id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  author        VARCHAR(255) NOT NULL,
  author_image  TEXT,
  country       VARCHAR(100),
  rating        INTEGER      NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment       TEXT         NOT NULL,
  stay_duration VARCHAR(50),
  date          VARCHAR(30),
  property_id   UUID         REFERENCES properties(id) ON DELETE SET NULL,
  is_verified   BOOLEAN      NOT NULL DEFAULT false,
  is_featured   BOOLEAN      NOT NULL DEFAULT false,
  created_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- ── Blog Posts ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS blog_posts (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  title        VARCHAR(255) NOT NULL,
  slug         VARCHAR(255) UNIQUE NOT NULL,
  excerpt      TEXT,
  content      TEXT,
  author       VARCHAR(100) NOT NULL DEFAULT 'Milehigh Properties',
  author_avatar TEXT,
  category     VARCHAR(50)  NOT NULL DEFAULT 'Travel',
  tag          VARCHAR(50),
  image        TEXT,
  date         VARCHAR(30),
  read_time    VARCHAR(20)  NOT NULL DEFAULT '5 min read',
  is_published BOOLEAN      NOT NULL DEFAULT false,
  featured     BOOLEAN      NOT NULL DEFAULT false,
  created_at   TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- ── Site Content ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS site_content (
  id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  key        VARCHAR(100) UNIQUE NOT NULL,
  value      TEXT,
  section    VARCHAR(50)  NOT NULL DEFAULT 'general',
  updated_at TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- ── Settings ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS settings (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  type         VARCHAR(50)  NOT NULL,
  phone        VARCHAR(50),
  whatsapp     VARCHAR(50),
  email        VARCHAR(255),
  address      TEXT,
  social_links JSONB        NOT NULL DEFAULT '{}',
  created_at   TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- ── Bookings (form log) ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS bookings (
  id               UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name       VARCHAR(100) NOT NULL,
  last_name        VARCHAR(100) NOT NULL DEFAULT '',
  email            VARCHAR(255) NOT NULL,
  phone            VARCHAR(50)  NOT NULL DEFAULT '',
  property_name    VARCHAR(255) NOT NULL,
  check_in         VARCHAR(30)  NOT NULL,
  check_out        VARCHAR(30)  NOT NULL,
  guests           INTEGER      NOT NULL DEFAULT 1,
  nights           INTEGER,
  total_price      TEXT,
  currency         VARCHAR(10)  NOT NULL DEFAULT 'USD',
  special_requests TEXT,
  status           VARCHAR(50)  NOT NULL DEFAULT 'pending',
  created_at       TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- ── Contact Submissions ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS contact_submissions (
  id         UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  name       VARCHAR(255) NOT NULL,
  email      VARCHAR(255) NOT NULL,
  phone      VARCHAR(50),
  subject    VARCHAR(255),
  message    TEXT         NOT NULL,
  type       VARCHAR(50)  NOT NULL DEFAULT 'other',
  status     VARCHAR(50)  NOT NULL DEFAULT 'unread',
  created_at TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- ── Newsletter Subscriptions ─────────────────────────────────
CREATE TABLE IF NOT EXISTS newsletter_subscriptions (
  id            UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  email         VARCHAR(255) UNIQUE NOT NULL,
  is_active     BOOLEAN      NOT NULL DEFAULT true,
  subscribed_at TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- ── Form Submissions (generic catch-all) ────────────────────
CREATE TABLE IF NOT EXISTS form_submissions (
  id         BIGSERIAL    PRIMARY KEY,
  page       TEXT         NOT NULL,
  form_name  TEXT         NOT NULL,
  action     TEXT         NOT NULL,
  payload    JSONB        NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- ── Action Logs (AI Portal) ──────────────────────────────────
CREATE TABLE IF NOT EXISTS action_logs (
  id               UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  tool             VARCHAR(100) NOT NULL,
  input            JSONB        NOT NULL DEFAULT '{}',
  status           VARCHAR(50)  NOT NULL DEFAULT 'pending',
  executed_by      VARCHAR(100),
  before_data      JSONB,
  after_data       JSONB,
  error            TEXT,
  created_at       TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- ── Indexes ──────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_bookings_email      ON bookings(email);
CREATE INDEX IF NOT EXISTS idx_bookings_created    ON bookings(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contact_created     ON contact_submissions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contact_status      ON contact_submissions(status);
CREATE INDEX IF NOT EXISTS idx_newsletter_email    ON newsletter_subscriptions(email);
CREATE INDEX IF NOT EXISTS idx_form_sub_created    ON form_submissions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_properties_slug     ON properties(slug);
CREATE INDEX IF NOT EXISTS idx_properties_live     ON properties(is_live);
CREATE INDEX IF NOT EXISTS idx_reviews_property    ON reviews(property_id);
CREATE INDEX IF NOT EXISTS idx_blog_slug           ON blog_posts(slug);

-- ── Seed: default site content ───────────────────────────────
INSERT INTO site_content (key, value, section) VALUES
  ('contact_phone',    '+233 059 975 4270',       'contact'),
  ('contact_whatsapp', '233599754270',             'contact'),
  ('contact_email',    'herbertprempeh@gmail.com', 'contact'),
  ('hero_title',       'Your Private Palm Retreat','home'),
  ('site_name',        'Milehigh5280',             'general')
ON CONFLICT (key) DO NOTHING;

-- ── Seed: default settings row ───────────────────────────────
INSERT INTO settings (type, phone, whatsapp, email, address)
VALUES (
  'contact',
  '+233 059 975 4270',
  '233599754270',
  'herbertprempeh@gmail.com',
  'Ayi Mensah, Accra, Ghana'
) ON CONFLICT DO NOTHING;

-- ============================================================
-- ADMIN USER
-- Username : admin@milehigh5280.com
-- Password : Milehigh@2024!
--
-- The hash below was generated with bcrypt cost=10.
-- the password: Milehigh@2024!
-- ============================================================
INSERT INTO users (email, password_hash, first_name, last_name, role)
VALUES (
  'admin@milehigh5280.com',
  '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
  'Admin',
  'Milehigh',
  'admin'
) ON CONFLICT (email) DO NOTHING;
