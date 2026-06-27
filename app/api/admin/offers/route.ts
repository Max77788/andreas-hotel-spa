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

  const [offRes, incRes] = await Promise.all([
    fetch(`${url}/rest/v1/offers?select=*&order=sort_order`, { headers: h }),
    fetch(`${url}/rest/v1/offer_inclusions?select=*&order=sort_order`, { headers: h }),
  ]);
  const [offers, inclusions] = await Promise.all([offRes.json(), incRes.json()]);
  return NextResponse.json({ offers: offers ?? [], inclusions: inclusions ?? [] });
}

export async function POST(req: NextRequest) {
  const session = await requireAuth(req);
  if (session instanceof NextResponse) return session;
  const body = await req.json();
  const h = headers();
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;

  const table = body.type === "inclusion" ? "offer_inclusions" : "offers";

  let clean: any;
  if (table === "offer_inclusions") {
    clean = { id: body.id, icon: body.icon, label: body.label, detail: body.detail, sort_order: body.sort_order };
  } else {
    clean = { id: body.id, title: body.title, description: body.description, duration: body.duration, price: body.price, category: body.category, sort_order: body.sort_order, is_published: body.is_published };
  }
  if (!clean.id) delete clean.id;

  const method = clean.id ? "PATCH" : "POST";
  const endpoint = clean.id
    ? `${url}/rest/v1/${table}?id=eq.${clean.id}`
    : `${url}/rest/v1/${table}`;

  const res = await fetch(endpoint, {
    method,
    headers: { ...h, "Content-Type": "application/json", Prefer: "return=representation" },
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
  const { id, type } = await req.json();
  const h = headers();
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const table = type === "inclusion" ? "offer_inclusions" : "offers";

  await fetch(`${url}/rest/v1/${table}?id=eq.${id}`, { method: "DELETE", headers: h });
  return NextResponse.json({ success: true });
}
