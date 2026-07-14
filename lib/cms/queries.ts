import { createServerClient } from "@/lib/supabase/server";
import type { Room, Policy, Offer, OfferInclusion, EventItem, GalleryImage, SiteSettings, SpaItem } from "./types";

export async function getRooms(): Promise<Room[]> {
  const supabase = createServerClient();
  const { data } = await supabase
    .from("rooms")
    .select("*")
    .eq("is_published", true)
    .order("sort_order");
  return (data as Room[]) ?? [];
}

export async function getRoomBySlug(slug: string): Promise<Room | null> {
  const supabase = createServerClient();
  const { data } = await supabase
    .from("rooms")
    .select("*")
    .eq("slug", slug)
    .single();
  return data as Room | null;
}

export async function getPolicies(): Promise<Policy[]> {
  const supabase = createServerClient();
  const { data } = await supabase
    .from("policies")
    .select("*")
    .order("sort_order");
  return (data as Policy[]) ?? [];
}

export async function getOffers(category?: string): Promise<Offer[]> {
  const supabase = createServerClient();
  let query = supabase.from("offers").select("*").eq("is_published", true);
  if (category) query = query.eq("category", category);
  const { data } = await query.order("sort_order");
  return (data as Offer[]) ?? [];
}

export async function getOfferInclusions(): Promise<OfferInclusion[]> {
  const supabase = createServerClient();
  const { data } = await supabase
    .from("offer_inclusions")
    .select("*")
    .order("sort_order");
  return (data as OfferInclusion[]) ?? [];
}

export async function getEvents(): Promise<EventItem[]> {
  const supabase = createServerClient();
  const { data } = await supabase
    .from("events")
    .select("*")
    .eq("is_published", true)
    .order("sort_order");
  return (data as EventItem[]) ?? [];
}

export async function getGallery(category?: string): Promise<GalleryImage[]> {
  const supabase = createServerClient();
  let query = supabase.from("gallery").select("*");
  if (category) query = query.eq("category", category);
  const { data } = await query.order("sort_order");
  return (data as GalleryImage[]) ?? [];
}

export async function getSiteSettings(): Promise<SiteSettings | null> {
  const supabase = createServerClient();
  const { data } = await supabase
    .from("site_settings")
    .select("*")
    .single();
  return data as SiteSettings | null;
}

export async function getSpaItems(): Promise<SpaItem[]> {
  const supabase = createServerClient();
  const { data } = await supabase
    .from("cms_spa")
    .select("*")
    .eq("is_published", true)
    .order("sort_order");
  return (data as SpaItem[]) ?? [];
}
