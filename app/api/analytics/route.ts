import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { requireAuth } from "@/lib/api-auth";

const ALLOWED_EVENTS = new Set(["page_view", "booking_click", "phone_click", "email_click", "chat_started", "offer_view", "room_view"]);

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const eventName = String(body.event_name || "");
  if (!ALLOWED_EVENTS.has(eventName)) return NextResponse.json({ error: "Unsupported event" }, { status: 400 });
  const pagePath = String(body.page_path || "/").slice(0, 300);
  const sessionId = String(body.session_id || "").slice(0, 80) || null;
  const metadata = body.metadata && typeof body.metadata === "object" ? body.metadata : {};
  const supabase = createServerClient();
  const { error } = await supabase.from("analytics_events").insert({ event_name: eventName, page_path: pagePath, session_id: sessionId, metadata });
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true }, { status: 201 });
}

export async function GET(req: NextRequest) {
  const session = await requireAuth(req);
  if (session instanceof NextResponse) return session;
  const days = Math.min(Math.max(Number(req.nextUrl.searchParams.get("days") || 30), 1), 90);
  const since = new Date(Date.now() - days * 86400000).toISOString();
  const supabase = createServerClient();
  const { data, error } = await supabase.from("analytics_events").select("event_name,page_path,created_at").gte("created_at", since).order("created_at", { ascending: false }).limit(10000);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  const events = data || [];
  const byEvent: Record<string, number> = {};
  const byPage: Record<string, number> = {};
  for (const event of events) { byEvent[event.event_name] = (byEvent[event.event_name] || 0) + 1; byPage[event.page_path] = (byPage[event.page_path] || 0) + 1; }
  return NextResponse.json({ days, total: events.length, byEvent, topPages: Object.entries(byPage).sort((a, b) => b[1] - a[1]).slice(0, 10), recent: events.slice(0, 20) });
}
