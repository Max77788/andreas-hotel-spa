-- Create admin_users table in the andreas_website schema
-- Run this in the Supabase SQL Editor

CREATE SCHEMA IF NOT EXISTS andreas_website;

CREATE TABLE IF NOT EXISTS andreas_website.admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'editor')),
  password_hash TEXT NOT NULL,
  reset_token TEXT,
  reset_token_expires_at BIGINT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS but allow access via service_role key
ALTER TABLE andreas_website.admin_users ENABLE ROW LEVEL SECURITY;

-- Seed the initial admin user (password: admin123)
INSERT INTO andreas_website.admin_users (email, name, role, password_hash)
SELECT 'admin@stayatandreas.com', 'Admin', 'admin', '$2b$12$A9VYsV2Gid5X9D1nXUjH1ufIiHCJUfTwMmJyrKvC5HmF0aHkLi3Wm'
WHERE NOT EXISTS (SELECT 1 FROM andreas_website.admin_users WHERE email = 'admin@stayatandreas.com');
