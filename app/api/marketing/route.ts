import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { requireAuth } from "@/lib/api-auth";

function clean(body: Record<string, unknown>) {
  return {
    name: String(body.name || "Untitled campaign").slice(0, 160),
    channel: String(body.channel || "organic").slice(0, 40),
    status: String(body.status || "draft"),
    objective: String(body.objective || "").slice(0, 500),
    audience: String(body.audience || "").slice(0, 500),
    start_date: body.start_date || null,
    end_date: body.end_date || null,
    budget_cents: body.budget_cents === "" || body.budget_cents == null ? null : Number(body.budget_cents),
    notes: String(body.notes || "").slice(0, 4000),
    updated_at: new Date().toISOString(),
  };
}

export async function GET(req: NextRequest) {
  const session = await requireAuth(req);
  if (session instanceof NextResponse) return session;
  const supabase = createServerClient();
  const { data, error } = await supabase.from("marketing_campaigns").select("*").order("start_date", { ascending: true, nullsFirst: false }).order("created_at", { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json(data || []);
}

export async function POST(req: NextRequest) {
  const session = await requireAuth(req);
  if (session instanceof NextResponse) return session;
  const body = await req.json().catch(() => ({}));
  const row = clean(body);
  if (!row.name.trim()) return NextResponse.json({ error: "Campaign name is required" }, { status: 400 });
  if (!["draft", "planned", "active", "paused", "complete"].includes(row.status)) return NextResponse.json({ error: "Invalid campaign status" }, { status: 400 });
  if (row.budget_cents !== null && (!Number.isInteger(row.budget_cents) || row.budget_cents < 0)) return NextResponse.json({ error: "Budget must be a non-negative integer in cents" }, { status: 400 });
  const supabase = createServerClient();
  const query = body.id ? supabase.from("marketing_campaigns").update(row).eq("id", String(body.id)) : supabase.from("marketing_campaigns").insert(row);
  const { data, error } = await query.select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json(data);
}

export async function DELETE(req: NextRequest) {
  const session = await requireAuth(req);
  if (session instanceof NextResponse) return session;
  const { id } = await req.json().catch(() => ({}));
  if (!id) return NextResponse.json({ error: "Campaign id is required" }, { status: 400 });
  const supabase = createServerClient();
  const { error } = await supabase.from("marketing_campaigns").delete().eq("id", String(id));
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ success: true });
}
