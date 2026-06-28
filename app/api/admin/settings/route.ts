import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/api-auth";

function headers() {
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  return {
    apikey: key,
    Authorization: `Bearer ${key}`,
    "Accept-Profile": "andreas_website",
  };
}

export async function GET(req: NextRequest) {
  const session = await requireAuth(req);
  if (session instanceof NextResponse) return session;
  const h = headers();
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const res = await fetch(`${url}/rest/v1/site_settings?select=*&limit=1`, { headers: h });
  const data = await res.json();
  return NextResponse.json(Array.isArray(data) ? data[0] ?? {} : data ?? {});
}

export async function POST(req: NextRequest) {
  const session = await requireAuth(req);
  if (session instanceof NextResponse) return session;
  const body = await req.json();
  const h = headers();
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;

  const clean = {
    id: body.id, hotel_name: body.hotel_name, tagline: body.tagline,
    address: body.address, phone: body.phone, email: body.email,
    booking_url: body.booking_url, hero_video_url: body.hero_video_url,
    logo_dark_url: body.logo_dark_url, logo_light_url: body.logo_light_url,
    vapi_assistant_name: body.vapi_assistant_name,
    vapi_first_message: body.vapi_first_message,
    vapi_placeholder: body.vapi_placeholder,
  };
  if (!clean.id) delete clean.id;

  const method = clean.id ? "PATCH" : "POST";
  const endpoint = clean.id
    ? `${url}/rest/v1/site_settings?id=eq.${clean.id}`
    : `${url}/rest/v1/site_settings`;

  const res = await fetch(endpoint, {
    method,
    headers: { ...headers(), "Content-Type": "application/json", "Content-Profile": "andreas_website", Prefer: "return=representation" },
    body: JSON.stringify(clean),
  });
  if (!res.ok) {
    const err = await res.text();
    return NextResponse.json({ error: err }, { status: 400 });
  }
  const data = await res.json();
  return NextResponse.json(Array.isArray(data) ? data[0] : data);
}
