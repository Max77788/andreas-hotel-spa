import { createServerClient } from "@/lib/supabase/server";
import type { Room, EventItem, Offer, OfferInclusion, GalleryImage, SiteSettings } from "@/lib/cms/types";

export interface HomePageData {
  rooms: Room[];
  events: EventItem[];
  offers: { oneNight: Offer[]; twoNight: Offer[] };
  inclusions: OfferInclusion[];
  gallery: GalleryImage[];
  settings: SiteSettings | null;
}

export async function getHomePageData(): Promise<HomePageData> {
  const supabase = createServerClient();

  const [roomsRes, eventsRes, offersRes, inclusionsRes, galleryRes, settingsRes] = await Promise.all([
    supabase.from("rooms").select("*").eq("is_published", true).order("sort_order"),
    supabase.from("events").select("*").eq("is_published", true).order("sort_order"),
    supabase.from("offers").select("*").eq("is_published", true).order("sort_order"),
    supabase.from("offer_inclusions").select("*").order("sort_order"),
    supabase.from("gallery").select("*").order("sort_order"),
    supabase.from("site_settings").select("*").single(),
  ]);

  const offers = (offersRes.data as Offer[]) ?? [];
  return {
    rooms: (roomsRes.data as Room[]) ?? [],
    events: (eventsRes.data as EventItem[]) ?? [],
    offers: {
      oneNight: offers.filter((o) => o.category === "one_night"),
      twoNight: offers.filter((o) => o.category === "two_night"),
    },
    inclusions: (inclusionsRes.data as OfferInclusion[]) ?? [],
    gallery: (galleryRes.data as GalleryImage[]) ?? [],
    settings: (settingsRes.data as SiteSettings) ?? null,
  };
}
