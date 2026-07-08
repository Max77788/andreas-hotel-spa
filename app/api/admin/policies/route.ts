import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/api-auth";
import { supabaseHeaders, supabaseUrl } from "@/lib/admin-api";

export async function GET(req: NextRequest) {
  const a = await requireAuth(req); if (a instanceof NextResponse) return a;
  const res = await fetch(supabaseUrl("policies?select=*&order=sort_order"), { headers: supabaseHeaders() });
  return NextResponse.json((await res.json()) ?? []);
}

export async function POST(req: NextRequest) {
  const a = await requireAuth(req); if (a instanceof NextResponse) return a;
  const b = await req.json();
  const c: any = { id: b.id, label: b.label, detail: b.detail, sort_order: b.sort_order, is_highlighted: b.is_highlighted };
  if (!c.id) delete c.id;
  const m = c.id ? "PATCH" : "POST";
  const ep = c.id ? supabaseUrl(`policies?id=eq.${c.id}`) : supabaseUrl("policies");
  const h = { ...supabaseHeaders(), Prefer: "return=representation" };
  const res = await fetch(ep, { method: m, headers: h, body: JSON.stringify(c) });
  if (!res.ok) return NextResponse.json({ error: await res.text() }, { status: 400 });
  const d = await res.json();
  return NextResponse.json(Array.isArray(d) ? d[0] : d);
}

export async function DELETE(req: NextRequest) {
  const a = await requireAuth(req); if (a instanceof NextResponse) return a;
  const { id } = await req.json();
  await fetch(supabaseUrl(`policies?id=eq.${id}`), { method: "DELETE", headers: supabaseHeaders() });
  return NextResponse.json({ success: true });
}
