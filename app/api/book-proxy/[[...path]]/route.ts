import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const upstream = await fetch("https://s005948.officialbookings.com/", {
      headers: { "User-Agent": "Mozilla/5.0" },
    });
    const html = await upstream.text();
    return new NextResponse(html, {
      status: 200,
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  } catch (err) {
    return new NextResponse(`Error: ${err instanceof Error ? err.message : String(err)}`, {
      status: 502,
    });
  }
}
