import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/api-auth";

const U = "https://phgogybfgovrlcdmifpv.supabase.co";
const K = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBoZ29neWJmZ292cmxjZG1pZnB2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc4MTI5NzIsImV4cCI6MjA2MzM4ODk3Mn0.9KhBINQnZRXKc_HysHYOwY31kPF1bqknU8wBPEkv9tM";
const hdrs = () => ({ apikey: K, Authorization: `Bearer ${K}`, "Accept-Profile": "andreas_website" });
const rest = (p: string) => `${U}/rest/v1/${p}`;

export async function GET(req: NextRequest) {
  const a = await requireAuth(req); if (a instanceof NextResponse) return a;
  const res = await fetch(rest("policies?select=*&order=sort_order"), { headers: hdrs() });
  return NextResponse.json((await res.json()) ?? []);
}

export async function POST(req: NextRequest) {
  const a = await requireAuth(req); if (a instanceof NextResponse) return a;
  const b = await req.json();
  const c: any = { id: b.id, label: b.label, detail: b.detail, sort_order: b.sort_order, is_highlighted: b.is_highlighted };
  if (!c.id) delete c.id;
  const m = c.id ? "PATCH" : "POST";
  const ep = c.id ? rest(`policies?id=eq.${c.id}`) : rest("policies");
  const h = { ...hdrs(), "Content-Type": "application/json", Prefer: "return=representation" };
  const res = await fetch(ep, { method: m, headers: h, body: JSON.stringify(c) });
  if (!res.ok) return NextResponse.json({ error: await res.text() }, { status: 400 });
  const d = await res.json();
  return NextResponse.json(Array.isArray(d) ? d[0] : d);
}

export async function DELETE(req: NextRequest) {
  const a = await requireAuth(req); if (a instanceof NextResponse) return a;
  const { id } = await req.json();
  await fetch(rest(`policies?id=eq.${id}`), { method: "DELETE", headers: hdrs() });
  return NextResponse.json({ success: true });
}
