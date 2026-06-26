export interface Room {
  id: string;
  slug: string;
  name: string;
  badge: string | null;
  short_description: string | null;
  long_description: string | null;
  bed: string | null;
  guests: string | null;
  sqft: string | null;
  price: string | null;
  amenities: string[];
  extras: { icon: string; label: string }[];
  image_url: string | null;
  gallery_urls: string[];
  sort_order: number;
  is_published: boolean;
}

export interface Policy {
  id: string;
  label: string;
  detail: string;
  sort_order: number;
  is_highlighted: boolean;
}

export interface Offer {
  id: string;
  title: string;
  description: string | null;
  duration: string | null;
  price: string | null;
  category: "one_night" | "two_night";
  sort_order: number;
  is_published: boolean;
}

export interface OfferInclusion {
  id: string;
  icon: string;
  label: string;
  detail: string | null;
  sort_order: number;
}

export interface EventItem {
  id: string;
  tag: string | null;
  date_label: string;
  title: string;
  description: string | null;
  image_url: string | null;
  sort_order: number;
  is_published: boolean;
}

export interface GalleryImage {
  id: string;
  image_url: string;
  alt: string | null;
  category: string;
  sort_order: number;
}

export interface SiteSettings {
  id: string;
  hotel_name: string;
  tagline: string;
  address: string;
  phone: string;
  email: string;
  booking_url: string;
  hero_video_url: string;
  logo_dark_url: string | null;
  logo_light_url: string | null;
  vapi_assistant_name: string;
  vapi_first_message: string;
  vapi_placeholder: string;
}
