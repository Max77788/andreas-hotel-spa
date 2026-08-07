-- CMS tables for Andreas Hotel & Spa
-- Schema: andreas_website

CREATE SCHEMA IF NOT EXISTS andreas_website;

-- Rooms
CREATE TABLE IF NOT EXISTS andreas_website.rooms (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  slug text UNIQUE NOT NULL,
  name text NOT NULL,
  badge text,
  short_description text,
  long_description text,
  bed text,
  guests text,
  sqft text,
  price text,
  amenities text[] DEFAULT '{}',
  extras jsonb DEFAULT '[]',
  image_url text,
  gallery_urls text[] DEFAULT '{}',
  sort_order integer DEFAULT 0,
  is_published boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Policies
CREATE TABLE IF NOT EXISTS andreas_website.policies (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  label text NOT NULL,
  detail text NOT NULL,
  sort_order integer DEFAULT 0,
  is_highlighted boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Offers
CREATE TABLE IF NOT EXISTS andreas_website.offers (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  description text,
  duration text,
  price text,
  category text DEFAULT 'one_night',
  sort_order integer DEFAULT 0,
  is_published boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Offer inclusions
CREATE TABLE IF NOT EXISTS andreas_website.offer_inclusions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  icon text NOT NULL,
  label text NOT NULL,
  detail text,
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Events
CREATE TABLE IF NOT EXISTS andreas_website.events (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  tag text,
  date_label text NOT NULL,
  title text NOT NULL,
  description text,
  image_url text,
  sort_order integer DEFAULT 0,
  is_published boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Gallery
CREATE TABLE IF NOT EXISTS andreas_website.gallery (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  image_url text NOT NULL,
  alt text,
  category text DEFAULT 'general',
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Site settings (single row)
CREATE TABLE IF NOT EXISTS andreas_website.site_settings (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  hotel_name text DEFAULT 'The Andreas Hotel & Spa',
  tagline text DEFAULT 'A Sanctuary of Italian-Inspired Elegance',
  address text DEFAULT '277 N. Indian Canyon Drive, Palm Springs, CA',
  phone text DEFAULT '(760) 327-5701',
  email text DEFAULT 'stay@andreashotel.com',
  booking_url text DEFAULT '/book',
  hero_video_url text DEFAULT '/hero-video.mp4',
  logo_dark_url text,
  logo_light_url text,
  updated_at timestamptz DEFAULT now()
);

-- RLS: public read, service_role write
ALTER TABLE andreas_website.rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE andreas_website.policies ENABLE ROW LEVEL SECURITY;
ALTER TABLE andreas_website.offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE andreas_website.offer_inclusions ENABLE ROW LEVEL SECURITY;
ALTER TABLE andreas_website.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE andreas_website.gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE andreas_website.site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public_read" ON andreas_website.rooms FOR SELECT USING (true);
CREATE POLICY "public_read" ON andreas_website.policies FOR SELECT USING (true);
CREATE POLICY "public_read" ON andreas_website.offers FOR SELECT USING (true);
CREATE POLICY "public_read" ON andreas_website.offer_inclusions FOR SELECT USING (true);
CREATE POLICY "public_read" ON andreas_website.events FOR SELECT USING (true);
CREATE POLICY "public_read" ON andreas_website.gallery FOR SELECT USING (true);
CREATE POLICY "public_read" ON andreas_website.site_settings FOR SELECT USING (true);
