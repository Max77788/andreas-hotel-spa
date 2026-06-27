import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/api-auth";

export async function GET(req: NextRequest) {
  const session = await requireAuth(req);
  if (session instanceof NextResponse) return session;

  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;

  const res = await fetch(`${url}/rest/v1/rooms?select=*&order=sort_order`, {
    headers: {
      apikey: key!,
      Authorization: `Bearer ${key}`,
      "Accept-Profile": "andreas_website",
    },
  });

  const data = await res.json();
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const session = await requireAuth(req);
  if (session instanceof NextResponse) return session;
  const body = await req.json();
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;

  const clean = {
    id: body.id, slug: body.slug, name: body.name, badge: body.badge,
    short_description: body.short_description, long_description: body.long_description,
    bed: body.bed, guests: body.guests, sqft: body.sqft, price: body.price,
    amenities: body.amenities, extras: body.extras,
    image_url: body.image_url, gallery_urls: body.gallery_urls,
    sort_order: body.sort_order, is_published: body.is_published,
  };
  if (!clean.id) delete clean.id;

  const method = clean.id ? "PATCH" : "POST";
  const endpoint = clean.id
    ? `${url}/rest/v1/rooms?id=eq.${clean.id}`
    : `${url}/rest/v1/rooms`;

  const res = await fetch(endpoint, {
    method,
    headers: {
      apikey: key!,
      Authorization: `Bearer ${key}`,
      "Accept-Profile": "andreas_website",
      "Content-Type": "application/json",
      Prefer: "return=representation",
    },
    body: JSON.stringify(clean),
  });

  if (!res.ok) {
    const err = await res.text();
    return NextResponse.json({ error: err }, { status: 400 });
  }

  const data = await res.json();
  return NextResponse.json(data);
}

export async function DELETE(req: NextRequest) {
  const session = await requireAuth(req);
  if (session instanceof NextResponse) return session;
  const { id } = await req.json();
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;

  await fetch(`${url}/rest/v1/rooms?id=eq.${id}`, {
    method: "DELETE",
    headers: {
      apikey: key!,
      Authorization: `Bearer ${key}`,
      "Accept-Profile": "andreas_website",
    },
  });

  return NextResponse.json({ success: true });
}
