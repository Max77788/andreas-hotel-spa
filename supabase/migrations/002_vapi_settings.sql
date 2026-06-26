-- Vapi concierge settings for Andreas Hotel & Spa

ALTER TABLE andreas_website.site_settings
  ADD COLUMN IF NOT EXISTS vapi_assistant_name text DEFAULT 'Jessica',
  ADD COLUMN IF NOT EXISTS vapi_first_message text DEFAULT 'Hi, I''m Jessica, your concierge at Andreas Hotel & Spa. How can I help you today?',
  ADD COLUMN IF NOT EXISTS vapi_placeholder text DEFAULT 'Ask about rooms, amenities, or bookings...';

-- Update the seed row
INSERT INTO andreas_website.site_settings (
  hotel_name, tagline, address, phone, email, booking_url, hero_video_url,
  vapi_assistant_name, vapi_first_message, vapi_placeholder
) VALUES (
  'The Andreas Hotel & Spa',
  'A Sanctuary of Italian-Inspired Elegance',
  '277 N. Indian Canyon Drive, Palm Springs, CA',
  '(760) 327-5701',
  'stay@andreashotel.com',
  '/book',
  '/hero-video.mp4',
  'Jessica',
  'Hi, I''m Jessica, your concierge at Andreas Hotel & Spa. How can I help you today?',
  'Ask about rooms, amenities, or bookings...'
) ON CONFLICT DO NOTHING;
