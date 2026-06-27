import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/api-auth";

const U = "https://phgogybfgovrlcdmifpv.supabase.co";
const K = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBoZ29neWJmZ292cmxjZG1pZnB2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc4MTI5NzIsImV4cCI6MjA2MzM4ODk3Mn0.9KhBINQnZRXKc_HysHYOwY31kPF1bqknU8wBPEkv9tM";
const h = { apikey: K, Authorization: `Bearer ${K}`, "Accept-Profile": "andreas_website" };
const rest = (p: string) => `${U}/rest/v1/${p}`;

export async function GET(req: NextRequest) {
  const a = await requireAuth(req); if (a instanceof NextResponse) return a;
  const [o, i] = await Promise.all([
    fetch(rest("offers?select=*&order=sort_order"), { headers: h }),
    fetch(rest("offer_inclusions?select=*&order=sort_order"), { headers: h }),
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
  const r = await fetch(ep, { method: m, headers: { ...h, "Content-Type": "application/json", Prefer: "return=representation" }, body: JSON.stringify(c) });
  if (!r.ok) return NextResponse.json({ error: await r.text() }, { status: 400 });
  const d = await r.json();
  return NextResponse.json(Array.isArray(d) ? d[0] : d);
}

export async function DELETE(req: NextRequest) {
  const a = await requireAuth(req); if (a instanceof NextResponse) return a;
  const { id, type } = await req.json();
  const t = type === "inclusion" ? "offer_inclusions" : "offers";
  await fetch(rest(`${t}?id=eq.${id}`), { method: "DELETE", headers: h });
  return NextResponse.json({ success: true });
}
