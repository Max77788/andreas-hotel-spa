-- Seed data for Andreas Hotel & Spa CMS
-- Schema: andreas_website
-- Run: supabase db seed (local) or direct SQL (production)

-- Site Settings (single row)
DELETE FROM andreas_website.site_settings;
INSERT INTO andreas_website.site_settings (
  hotel_name, tagline, address, phone, email, booking_url, hero_video_url
) VALUES (
  'The Andreas Hotel & Spa',
  'A Sanctuary of Italian-Inspired Elegance',
  '277 N. Indian Canyon Drive, Palm Springs, CA',
  '(760) 327-5701',
  'stay@andreashotel.com',
  '/book',
  '/hero-video.mp4'
);

-- Rooms
DELETE FROM andreas_website.rooms;
INSERT INTO andreas_website.rooms (slug, name, badge, short_description, long_description, bed, guests, sqft, price, amenities, extras, image_url, gallery_urls, sort_order, is_published) VALUES
  ('andreas-villa-suite', 'Andreas Villa Suite', 'VILLA', 'Our most prestigious suite: Italian Villa design, fireplace, private courtyard, king bedroom, separate living area.', NULL, 'King Bed', '4 Guests', '750 sq ft', '$599', ARRAY['Fireplace', 'Refrigerator', 'Microwave', 'Keurig', 'Sound Machine'], '[]'::jsonb, '/hotel-photos/andreas-villa-suite-andreas-hotel-palm-springs-bedroom1-1.jpg', '{}', 0, true),
  ('executive-room', 'Executive Room', 'EXECUTIVE', 'Italian furnishings, fireplace, dedicated workspace, refrigerator, microwave, Keurig.', NULL, 'King Bed', '2 Guests', '380 sq ft', '$289', ARRAY['Fireplace', 'Work Desk', 'King Bed'], '[]'::jsonb, '/hotel-photos/room1.jpg', '{}', 1, true),
  ('deluxe-room', 'Deluxe Room', 'DELUXE', 'Italian furnishings, fireplace, marble bathroom. The classic Andreas experience.', NULL, 'Queen Bed', '2 Guests', '340 sq ft', '$219', ARRAY['Fireplace', 'Marble Bath', 'Queen Bed'], '[]'::jsonb, '/hotel-photos/room6.jpg', '{}', 2, true),
  ('1-bedroom-suite', '1 Bedroom Suite', 'SUITE', 'Spacious suite with separate bedroom, fireplace, and Italian-inspired decor.', NULL, 'King Bed', '3 Guests', '500 sq ft', '$349', ARRAY['Fireplace', 'Separate Living Area', 'King Bed'], '[]'::jsonb, '/hotel-photos/room3.jpg', '{}', 3, true),
  ('2-bed-1-bath-suite', '2 Bed 1 Bath Suite', 'SUITE', 'Two-bedroom suite with shared bath. Ideal for small groups or families.', NULL, 'Queen Bed + Queen Bed', '4 Guests', '650 sq ft', '$449', ARRAY['Two Queen Beds', 'Shared Bath', 'Living Area'], '[]'::jsonb, '/hotel-photos/room4.jpg', '{}', 4, true),
  ('mobility-accessible-suite', 'Mobility Accessible 2 Bed Suite', 'ACCESSIBLE', 'ADA-compliant two-bedroom suite with roll-in shower and wide doorways.', NULL, 'King Bed + Queen Bed', '4 Guests', '700 sq ft', '$449', ARRAY['Roll-in Shower', 'Wide Doorways', 'ADA Compliant'], '[]'::jsonb, '/hotel-photos/room7.jpg', '{}', 5, true),
  ('mobility-accessible-deluxe-room', 'Mobility Accessible Deluxe Room', 'ACCESSIBLE', 'ADA-compliant deluxe room with accessible bath and comfortable queen bed.', NULL, 'Queen Bed', '2 Guests', '340 sq ft', '$219', ARRAY['Roll-in Shower', 'ADA Compliant', 'Queen Bed'], '[]'::jsonb, '/hotel-photos/room8.jpg', '{}', 6, true);

-- Policies
DELETE FROM andreas_website.policies;
INSERT INTO andreas_website.policies (label, detail, sort_order, is_highlighted) VALUES
  ('Check-in / Check-out', 'Check-in: 3 PM. Check-out: 11 AM.', 0, false),
  ('Hotel Parking', 'We offer complimentary parking for our guests.', 1, false),
  ('Age Requirement', 'Andreas Hotel & Spa is for adults 21 and over only. However, all ages are allowed on Easter weekend and the first Saturday of December for the annual Palm Springs light parade.', 2, false),
  ('Smoking', 'The Andreas Hotel is a non-smoking establishment. This includes, but is not limited to: cigars, e-cigarettes, vaping, and marijuana. Guests who do not comply will be charged a $300 smoking fee.', 3, false),
  ('Pets', 'Pets are not currently allowed at the Andreas.', 4, false),
  ('Resort Fee', 'A daily resort fee of $34.95 + tax per day will be added after check-in.', 5, false),
  ('Extra Guests', 'From $50/night (after 2 guests).', 6, false),
  ('Security Deposit', '$100/night.', 7, false),
  ('Rollaway Beds', 'Rollaway beds are $45/room per night. Rollaways are only available for Executive and 2 Bedroom Suites. Maximum 2 rollaways per room.', 8, false),
  ('Guarantee Policy', 'A guaranteed reservation assures you of a room even if you check in very late (after 6:00 PM). All reservations made through this website must be guaranteed to a major credit card.', 9, false),
  ('Cancellation Policy', 'Cancellations for a hotel room reservation must be received 14 days prior to arrival, not including the day of check-in. If cancellation of a guaranteed reservation is not received by the required date, you will be charged for half the stay or one night''s accommodation — whichever is greater.', 10, true);

-- Offers
DELETE FROM andreas_website.offers;
INSERT INTO andreas_website.offers (title, description, duration, price, category, sort_order, is_published) VALUES
  ('The Escape', 'Includes the Andreas signature scrub, 50 min Deep Tissue, 50 minute Aroma Therapy massage, and the Vital C Facial.', 'Includes a Deluxe Room Sunday-Thursday. Call for weekend rates. Valid May 15 - October 15.', '$630', 'one_night', 0, true),
  ('The Rejuvenate', 'Includes a 30 minute Mineral Soak, the Vital C Facial, Gentlemen''s Facial and two 50 minute Therapeutic massages.', 'Includes a Deluxe Room Sunday-Thursday. Call for weekend rates. Valid May 15 - October 15.', '$665', 'one_night', 1, true),
  ('The Oasis', 'Includes: The Andreas Signature Scrub, the Canyon Clay Body Mask, a 50 minute Swedish massage, and a 50 Minute Aromatherapy massage.', 'Includes a Deluxe Room Sunday-Thursday. Call for weekend rates. Valid May 15 - October 15.', '$745', 'two_night', 0, true),
  ('The Andreas Renewal', 'Includes: 30 min. Mineral Soak, Ageless Facial, and Rosemary Mint Scrub; 50 min. Deep Tissue & therapeutic massage.', 'Includes a Deluxe Room Sunday-Thursday. Call for weekend rates. Valid May 15 - October 15.', '$795', 'two_night', 1, true);

-- Offer inclusions
DELETE FROM andreas_website.offer_inclusions;
INSERT INTO andreas_website.offer_inclusions (icon, label, detail, sort_order) VALUES
  ('🛏', 'Luxury Accommodations', 'Your choice of room or suite in our Italian Villa-inspired hotel.', 0),
  ('💆', 'Spa Treatments', 'Massages, facials, body wraps, and scrubs by licensed therapists.', 1),
  ('🏊', 'Pool & Jacuzzi', 'Heated outdoor pool and Jacuzzi surrounded by manicured courtyard.', 2),
  ('🔥', 'Outdoor Fireplaces', 'Cozy gas fireplaces throughout the courtyard for evening relaxation.', 3),
  ('🍷', 'Welcome Amenity', 'A complimentary glass of champagne or sparkling apple cider on arrival.', 4),
  ('🅿', 'Free Parking', 'Complimentary on-site parking for the duration of your stay.', 5);
