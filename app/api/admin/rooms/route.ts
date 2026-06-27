import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/api-auth";

export const maxDuration = 30;

export async function GET(req: NextRequest) {
  try {
    const session = await requireAuth(req);
    if (session instanceof NextResponse) return session;

    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;

    if (!key || !url) {
      return NextResponse.json({ error: `Missing config: key=${!!key} url=${!!url}` }, { status: 500 });
    }

    const res = await fetch(`${url}/rest/v1/rooms?select=*&order=sort_order`, {
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
        "Accept-Profile": "andreas_website",
      },
      signal: AbortSignal.timeout(10000),
    });

    const text = await res.text();
    try {
      const data = JSON.parse(text);
      return NextResponse.json(data);
    } catch {
      return NextResponse.json({ error: "Invalid JSON from Supabase", raw: text.substring(0, 200) }, { status: 500 });
    }
  } catch (e: any) {
    return NextResponse.json({
      error: e.message || "Unknown error",
      cause: e.cause?.message || "",
      code: e.cause?.code || "",
    }, { status: 500 });
  }
}
