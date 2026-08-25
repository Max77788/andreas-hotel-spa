const LOCAL_ROOM_IMAGES: Record<string, string> = {
  "andreas-villa-suite": "/hotel-photos/andreas-villa-suite-andreas-hotel-palm-springs-bedroom1-1.jpg",
  "executive-room": "/hotel-photos/room1.jpg",
  "deluxe-room": "/hotel-photos/room6.jpg",
  "1-bedroom-suite": "/hotel-photos/room7.jpg",
  "mobility-accessible-suite": "/hotel-photos/mobility-accessible-suite-andreas-hotel-palm-springs-bedroom1-1.jpg",
  "mobility-accessible-deluxe-room": "/hotel-photos/room6.jpg",
  "2-bed-1-bath-suite": "/hotel-photos/room5.jpg",
};

/** Resolve CMS image URLs after the retired Supabase project/domain migration. */
export function resolveCmsImageUrl(url: string | null | undefined, fallback = "/hotel-photos/room1.jpg") {
  const value = url?.trim();
  if (!value) return fallback;

  // These room URLs belong to the retired hosted Supabase project. The source
  // files are already shipped with the site, so use the matching local asset.
  if (value.includes("phgogybfgovrlcdmifpv.supabase.co")) return fallback;

  // Legacy gallery objects are valid in the new storage, but their old custom
  // domain has a broken TLS certificate. Keep the path and use the live domain.
  return value.replace("https://supabase.mom-ai-agency.site", "https://supabase.mom-ai-agency.com");
}

export function resolveRoomImageUrl(slug: string, url: string | null | undefined) {
  return resolveCmsImageUrl(url, LOCAL_ROOM_IMAGES[slug] || "/hotel-photos/room1.jpg");
}
