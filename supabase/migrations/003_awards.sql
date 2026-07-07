-- Awards management for Andreas Hotel & Spa
-- Schema: andreas_website

ALTER TABLE andreas_website.site_settings
  ADD COLUMN IF NOT EXISTS awards jsonb DEFAULT '[]'::jsonb;

COMMENT ON COLUMN andreas_website.site_settings.awards IS
  'JSON array of award objects: [{ "image_url": "...", "link_url": "...", "alt_text": "..." }]';
