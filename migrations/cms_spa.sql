-- Run this in Supabase SQL Editor (https://supabase.com/dashboard/project/phgogybfgovrlcdmifpv/sql/new)
-- Schema: andreas_website

CREATE TABLE IF NOT EXISTS cms_spa (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('package', 'premium', 'massage', 'facial', 'body_treatment', 'addon')),
  description TEXT,
  price TEXT,
  price_50 TEXT,
  price_80 TEXT,
  duration TEXT,
  sort_order INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed existing data
DELETE FROM cms_spa;

-- Packages
INSERT INTO cms_spa (name, category, description, price, sort_order) VALUES
('Couples Getaway', 'package', 'Two 60-minute therapeutic massages, side by side, in our couples suite with a fireplace, a glass of champagne, and a 30-minute mineral soak in our whirlpool tub.', '$535', 1),
('Me Time', 'package', 'A 55-minute aromatherapy massage and a glass of champagne. The perfect solo escape.', '$99', 2),
('Summer Delight', 'package', 'A 55-minute Swedish massage, a 55-minute Vital-C facial, and a glass of champagne.', '$205', 3);

-- Premium packages
INSERT INTO cms_spa (name, category, description, price, duration, sort_order) VALUES
('Paradise for Two', 'premium', 'Relax and spend some time with that special someone bathing in warm essential oil infused mineral enhanced water. Hydrate in our oversized whirlpool tubs and enjoy champagne and seasonal fruit while melting away stress to prepare you both for luxurious 60-minute facials followed by a full body 60-minute therapeutic massage. A real couple''s spa day. Price for two.', '$550', '2.5 hrs', 1),
('The Every Inch', 'premium', 'Begin with a peaceful Canyon Clay Wrap that will detoxify and purify your inner body. Follow your wrap with a mind-calming therapeutic massage, then complete the experience with an exhilarating Vital-C facial that hydrates your skin to a perfect glow — plus scalp, neck, hand and foot massage.', '$375', '3 hrs', 2),
('Romance Andreas Style', 'premium', 'A mineral soak relaxes your muscles and opens your hearts as you spend quality time together before experiencing our Canyon Clay Body Mask and half-hour therapeutic massage. Price for two.', '$395', '2 hrs', 3),
('Lady''s Day', 'premium', 'A one-hour stress reducing massage followed by a one-hour cleansing and hydrating facial — the best of both worlds.', '$230', '2 hrs', 4),
('A Man''s Pairing', 'premium', 'A one-hour stress reducing massage followed by a one-hour cleansing and hydrating facial — the best of both worlds.', '$230', '2 hrs', 5);

-- Massages
INSERT INTO cms_spa (name, category, description, price_50, price_80, sort_order) VALUES
('Swedish Massage', 'massage', 'The classic oiled massage using long strokes, kneading and friction techniques. Relaxes, improves circulation and mobility.', '$125', '$175', 1),
('Aromatherapy Massage', 'massage', 'A light rhythmic massage utilizing the power of essential oils to enhance and calm. Pure healing heaven.', '$130', '$180', 2),
('Prenatal Massage', 'massage', 'Massage for pregnant women that reduces stress on weight-bearing joints, encourages blood and lymph circulation, and relaxes nervous tension.', '$145', NULL, 3),
('Therapeutic Massage', 'massage', 'A combination of Swedish and Deep Tissue work, with other modalities tailored to your individual constitution and needs.', '$135', '$190', 4),
('Deep Tissue', 'massage', 'A slow and firm technique designed to work out tighter spots in the body.', '$145', '$210', 5),
('Warm Stone Massage', 'massage', 'Warm smooth river rocks are placed along the spine and used to dissolve knots and release tension — a truly relaxing experience.', '$155', NULL, 6),
('Head to Toe', 'massage', 'A 30-minute pressure point reflexology session for hands and feet, followed by a 30-minute jojoba eucalyptus scalp massage. Don''t wash — let the oils soak in.', '$150', NULL, 7),
('Lymphatic Massage', 'massage', 'A very light touch massage designed to activate the lymphatic system to remove toxins from the body.', '$150', NULL, 8);

-- Facials
INSERT INTO cms_spa (name, category, description, price, sort_order) VALUES
('Vital-C', 'facial', 'The ultimate hydration facial — an antioxidant-rich vitamin C emollient formula that gently exfoliates, renews, and nourishes skin for a healthy, youthful glow and silky-smooth feel.', '$130', 1),
('Andreas Signature Ageless Facial', 'facial', 'A results-driven treatment using plant stem cell technology to preserve skin cells. With a highly concentrated blend of retinol and polypeptides — resurface, rejuvenate, and repair aging skin. AHA compounds strengthen collagen and increase cell turnover for visibly firmer, ageless skin.', '$155', 2),
('Gent''s Facial', 'facial', 'Especially for men — a deep pore cleanse with enzyme exfoliation and hydration treatment that reduces signs of aging and increases cell turnover while toning to reveal a smoother, more balanced complexion.', '$135', 3),
('Oxygen Facial', 'facial', 'Exfoliate, illuminate, and oxygenate with this invigorating treatment. Luxurious oxygen, plant-derived stem cells, peptides, and enzymatic botanicals are infused into the skin — leaving it luminous, refreshed, and rejuvenated. Inhale … exhale … beautiful skin.', '$140', 4),
('Desert Orange Blossom Buff', 'facial', 'Citrus essence and oils blend with stone fruit exfoliants, jojoba, and lecithin to scrub away dead skin, refine, smooth, and hydrate.', '$125', 5),
('Vitalizing Rosemary Mint Scrub', 'facial', 'Sea salts blended with invigorating peppermint and rosemary essential oils transport you while your skin is buffed and polished for a clean, fresh complexion. Perfect for warm days.', '$135', 6),
('The Facify Beauty Facial', 'facial', 'The Facify Beauty Wand takes your skin to the next level with deep cleansing, toning, circulation-boosting, smoothing, firming, and lymphatic massage functions. Innovative multifunctional technology for your best skin yet.', '$185', 7),
('Age Later Face Lift', 'facial', 'A revolutionary peel in four layers — high-dose Vitamin C, glycolic acid with active enzymes, and a mega-lightening treatment with lactic acid and brightening agents — to renew your complexion, leaving it silky smooth with a noticeable healthy glow.', '$165', 8),
('Back Facial', 'facial', 'An exfoliating treatment for hard-to-reach trouble spots — deep pore cleansing, steam, mask, and a light shoulder massage refresh while restoring nutrients for smooth, touchable skin.', '$95', 9);

-- Body Treatments
INSERT INTO cms_spa (name, category, description, price, sort_order) VALUES
('Canyon Clay Wrap', 'body_treatment', 'A detoxifying wrap that purifies the body''s outer surface while drawing out impurities. Leaves skin smooth and renewed.', '$120', 1),
('Canyon Clay Body Mask', 'body_treatment', 'A cocoon of rich red earth from the southwest deserts blended with ginger, turmeric, and other aromatics to soothe sensitive skin, relieve fatigue, and improve circulation. Nourishes and warms with scalp and foot rub as you take it in.', '$135', 2),
('Salt Scrub', 'body_treatment', 'An invigorating full-body exfoliation that removes dead skin cells and stimulates circulation for soft, glowing skin.', '$115', 3),
('Andreas Signature Scrub', 'body_treatment', 'With nourishing grape seed, jojoba, and shea butter oils plus supple fruit enzymes — this sensuous scrub is ideal for maintaining open pores and soft skin.', '$125', 4);

-- Add-ons
INSERT INTO cms_spa (name, category, description, sort_order) VALUES
('Half Hour Massage Add-On — $75', 'addon', NULL, 1),
('Half Hour Facial Add-On — $75', 'addon', NULL, 2),
('Half Hour Mineral Soak — $50', 'addon', NULL, 3),
('Hot Stone Application — $50', 'addon', NULL, 4),
('Moisturizing Hand Treatment — $55', 'addon', NULL, 5),
('Romantic Soak for Two w/ Champagne & Chocolates — $100', 'addon', NULL, 6),
('Champagne — $60', 'addon', NULL, 7),
('Bottle of Wine (House) — $50', 'addon', NULL, 8),
('Waxing — $25–$185', 'addon', NULL, 9),
('Signature Cocktails — $15+', 'addon', NULL, 10),
('Fruit & Cheese Plate — $45 / $65', 'addon', NULL, 11),
('Chocolate Covered Strawberries (6) — $55', 'addon', NULL, 12),
('Chocolates — $35', 'addon', NULL, 13),
('A Dozen Roses — $50 & up', 'addon', NULL, 14);

-- Moisturizing Hand Treatment (standalone massage entry)
INSERT INTO cms_spa (name, category, description, price, sort_order) VALUES
('Moisturizing Hand Treatment', 'addon', 'Can be added to any massage above.', '$45', 0);
