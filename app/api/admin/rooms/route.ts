import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/api-auth";

// Hardcoded because Vercel env has wrong URL (arwbiaxgoedumuoqztys — doesn't exist)
const SUPABASE_URL = "https://phgogybfgovrlcdmifpv.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBoZ29neWJmZ292cmxjZG1pZnB2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc4MTI5NzIsImV4cCI6MjA2MzM4ODk3Mn0.9KhBINQnZRXKc_HysHYOwY31kPF1bqknU8wBPEkv9tM";
const SCHEMA = "andreas_website";

function headers() { return { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}`, "Accept-Profile": SCHEMA }; }
function rest(path: string) { return `${SUPABASE_URL}/rest/v1/${path}`; }

export async function GET(req: NextRequest) {
  const auth = await requireAuth(req);
  if (auth instanceof NextResponse) return auth;
  try {
    const res = await fetch(rest("rooms?select=*&order=sort_order"), { headers: headers() });
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
    const endpoint = clean.id ? rest(`rooms?id=eq.${clean.id}`) : rest("rooms");
    const h = { ...headers(), "Content-Type": "application/json", Prefer: "return=representation" };
    const res = await fetch(endpoint, { method, headers: h, body: JSON.stringify(clean) });
    if (!res.ok) { const err = await res.text(); return NextResponse.json({ error: err }, { status: 400 }); }
    const data = await res.json();
    return NextResponse.json(Array.isArray(data) ? data[0] : data);
  } catch (e: any) { return NextResponse.json({ error: e.message }, { status: 500 }); }
}

export async function DELETE(req: NextRequest) {
  const auth = await requireAuth(req);
  if (auth instanceof NextResponse) return auth;
  const { id } = await req.json();
  try {
    await fetch(rest(`rooms?id=eq.${id}`), { method: "DELETE", headers: headers() });
    return NextResponse.json({ success: true });
  } catch (e: any) { return NextResponse.json({ error: e.message }, { status: 500 }); }
}
