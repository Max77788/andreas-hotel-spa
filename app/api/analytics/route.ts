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
  const daily = new Map<string, { date: string; total: number; pageViews: number; bookingClicks: number; chatStarts: number }>();
  for (let offset = days - 1; offset >= 0; offset -= 1) {
    const date = new Date(Date.now() - offset * 86400000).toISOString().slice(0, 10);
    daily.set(date, { date, total: 0, pageViews: 0, bookingClicks: 0, chatStarts: 0 });
  }
  for (const event of events) {
    byEvent[event.event_name] = (byEvent[event.event_name] || 0) + 1;
    byPage[event.page_path] = (byPage[event.page_path] || 0) + 1;
    const date = event.created_at.slice(0, 10);
    const point = daily.get(date);
    if (!point) continue;
    point.total += 1;
    if (event.event_name === "page_view") point.pageViews += 1;
    if (event.event_name === "booking_click") point.bookingClicks += 1;
    if (event.event_name === "chat_started") point.chatStarts += 1;
  }
  return NextResponse.json({ days, total: events.length, byEvent, topPages: Object.entries(byPage).sort((a, b) => b[1] - a[1]).slice(0, 10), daily: Array.from(daily.values()), recent: events.slice(0, 20) });
}
