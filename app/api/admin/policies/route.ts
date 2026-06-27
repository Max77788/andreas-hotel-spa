import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/api-auth";

function getConfig() {
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  return {
    headers: {
      apikey: key!,
      Authorization: `Bearer ${key}`,
      "Accept-Profile": "andreas_website",
    },
  };
}

const TABLES = {
  policies: "policies",
  offers: "offers",
  offer_inclusions: "offer_inclusions",
  settings: "site_settings",
  events: "events",
  gallery: "gallery",
};

export async function GET(req: NextRequest) {
  const session = await requireAuth(req);
  if (session instanceof NextResponse) return session;
  const { headers } = getConfig();
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;

  const res = await fetch(`${url}/rest/v1/policies?select=*&order=sort_order`, { headers });
  const data = await res.json();
  return NextResponse.json(data ?? []);
}

export async function POST(req: NextRequest) {
  const session = await requireAuth(req);
  if (session instanceof NextResponse) return session;
  const body = await req.json();
  const { headers } = getConfig();
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;

  const clean = {
    id: body.id, label: body.label, detail: body.detail,
    sort_order: body.sort_order, is_highlighted: body.is_highlighted,
  };
  if (!clean.id) delete clean.id;

  const method = clean.id ? "PATCH" : "POST";
  const endpoint = clean.id
    ? `${url}/rest/v1/policies?id=eq.${clean.id}`
    : `${url}/rest/v1/policies`;

  const res = await fetch(endpoint, {
    method,
    headers: { ...headers, "Content-Type": "application/json", Prefer: "return=representation" },
    body: JSON.stringify(clean),
  });

  if (!res.ok) {
    const err = await res.text();
    return NextResponse.json({ error: err }, { status: 400 });
  }
  const data = await res.json();
  return NextResponse.json(Array.isArray(data) ? data[0] : data);
}

export async function DELETE(req: NextRequest) {
  const session = await requireAuth(req);
  if (session instanceof NextResponse) return session;
  const { id } = await req.json();
  const { headers } = getConfig();
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;

  await fetch(`${url}/rest/v1/policies?id=eq.${id}`, { method: "DELETE", headers });
  return NextResponse.json({ success: true });
}
