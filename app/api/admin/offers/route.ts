import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/api-auth";

function headers() {
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  return { apikey: key, Authorization: `Bearer ${key}`, "Accept-Profile": "andreas_website" };
}
function rest(path: string) { return `${process.env.NEXT_PUBLIC_SUPABASE_URL!}/rest/v1/${path}`; }

export async function GET(req: NextRequest) {
  const a = await requireAuth(req); if (a instanceof NextResponse) return a;
  const [o, i] = await Promise.all([
    fetch(rest("offers?select=*&order=sort_order"), { headers: headers() }),
    fetch(rest("offer_inclusions?select=*&order=sort_order"), { headers: headers() }),
  ]);
  return NextResponse.json({ offers: (await o.json()) ?? [], inclusions: (await i.json()) ?? [] });
}

export async function POST(req: NextRequest) {
  const a = await requireAuth(req); if (a instanceof NextResponse) return a;
  const b = await req.json();
  const t = b.type === "inclusion" ? "offer_inclusions" : "offers";
  let c: any;
  if (t === "offer_inclusions") c = { id: b.id, icon: b.icon, label: b.label, detail: b.detail, sort_order: b.sort_order };
  else c = { id: b.id, title: b.title, description: b.description, duration: b.duration, price: b.price, category: b.category, sort_order: b.sort_order, is_published: b.is_published };
  if (!c.id) delete c.id;
  const m = c.id ? "PATCH" : "POST";
  const ep = c.id ? rest(`${t}?id=eq.${c.id}`) : rest(t);
  const r = await fetch(ep, { method: m, headers: { ...headers(), "Content-Type": "application/json", "Content-Profile": "andreas_website", Prefer: "return=representation" }, body: JSON.stringify(c) });
  if (!r.ok) return NextResponse.json({ error: await r.text() }, { status: 400 });
  const d = await r.json();
  return NextResponse.json(Array.isArray(d) ? d[0] : d);
}

export async function DELETE(req: NextRequest) {
  const a = await requireAuth(req); if (a instanceof NextResponse) return a;
  const { id, type } = await req.json();
  const t = type === "inclusion" ? "offer_inclusions" : "offers";
  await fetch(rest(`${t}?id=eq.${id}`), { method: "DELETE", headers: headers() });
  return NextResponse.json({ success: true });
}
