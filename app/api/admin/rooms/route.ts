import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { requireAuth } from "@/lib/api-auth";
import { revalidatePath } from "next/cache";

export async function GET(req: NextRequest) {
  const session = await requireAuth(req);
  if (session instanceof NextResponse) return session;
  const supabase = createServerClient();
  const { data } = await supabase.from("rooms").select("*").order("sort_order");
  return NextResponse.json(data ?? []);
}

export async function POST(req: NextRequest) {
  const session = await requireAuth(req);
  if (session instanceof NextResponse) return session;
  const body = await req.json();
  const supabase = createServerClient();
  const clean = {
    id: body.id, slug: body.slug, name: body.name, badge: body.badge,
    short_description: body.short_description, long_description: body.long_description,
    bed: body.bed, guests: body.guests, sqft: body.sqft, price: body.price,
    amenities: body.amenities, extras: body.extras,
    image_url: body.image_url, gallery_urls: body.gallery_urls,
    sort_order: body.sort_order, is_published: body.is_published,
  };
  if (!clean.id) delete clean.id;
  const { data, error } = await supabase.from("rooms").upsert(clean).select().single();
  if (error) return NextResponse.json({ error: error.message, code: error.code, details: error.details, hint: error.hint }, { status: 400 });
  revalidatePath("/");
  revalidatePath("/rooms");
  revalidatePath(`/rooms/${body.slug}`);
  return NextResponse.json(data);
}

export async function DELETE(req: NextRequest) {
  const session = await requireAuth(req);
  if (session instanceof NextResponse) return session;
  const { id, slug } = await req.json();
  const supabase = createServerClient();
  await supabase.from("rooms").delete().eq("id", id);
  revalidatePath("/");
  revalidatePath("/rooms");
  if (slug) revalidatePath(`/rooms/${slug}`);
  return NextResponse.json({ success: true });
}
