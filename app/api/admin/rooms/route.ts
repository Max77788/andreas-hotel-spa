import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAuth } from "@/lib/api-auth";
import { supabaseHeaders, supabaseUrl } from "@/lib/admin-api";

export async function GET(req: NextRequest) {
  const auth = await requireAuth(req);
  if (auth instanceof NextResponse) return auth;
  try {
    const res = await fetch(supabaseUrl("rooms?select=*&order=sort_order"), { headers: supabaseHeaders() });
    return NextResponse.json(await res.json());
  } catch (e: any) { return NextResponse.json({ error: e.message }, { status: 500 }); }
}

export async function POST(req: NextRequest) {
  const auth = await requireAuth(req);
  if (auth instanceof NextResponse) return auth;
  const body = await req.json();
  const clean: any = { id: body.id, slug: body.slug, name: body.name, badge: body.badge, short_description: body.short_description, long_description: body.long_description, bed: body.bed, guests: body.guests, sqft: body.sqft, price: body.price, amenities: body.amenities, extras: body.extras, image_url: body.image_url, gallery_urls: body.gallery_urls, sort_order: body.sort_order, is_published: body.is_published };
  if (!clean.id) delete clean.id;
  try {
  const method = clean.id ? "PATCH" : "POST";
  const endpoint = clean.id ? supabaseUrl(`rooms?id=eq.${clean.id}`) : supabaseUrl("rooms");
  const h = { ...supabaseHeaders(), "Content-Type": "application/json", "Content-Profile": "andreas_website", Prefer: "return=representation" };
    const res = await fetch(endpoint, { method, headers: h, body: JSON.stringify(clean) });
    if (!res.ok) { const err = await res.text(); return NextResponse.json({ error: err }, { status: 400 }); }
    const data = await res.json();
    revalidatePath("/");
    revalidatePath("/rooms");
    return NextResponse.json(Array.isArray(data) ? data[0] : data);
  } catch (e: any) { return NextResponse.json({ error: e.message }, { status: 500 }); }
}

export async function DELETE(req: NextRequest) {
  const auth = await requireAuth(req);
  if (auth instanceof NextResponse) return auth;
  const { id } = await req.json();
  try {
    await fetch(supabaseUrl(`rooms?id=eq.${id}`), { method: "DELETE", headers: supabaseHeaders() });
    revalidatePath("/");
    revalidatePath("/rooms");
    return NextResponse.json({ success: true });
  } catch (e: any) { return NextResponse.json({ error: e.message }, { status: 500 }); }
}
