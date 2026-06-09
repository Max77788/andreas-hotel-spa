import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const BOOKING_BASE = "https://s005948.officialbookings.com";

export async function middleware(req: NextRequest) {
  // Extract path after /api/book-proxy/
  const url = new URL(req.url);
  const path = url.pathname.replace("/api/book-proxy", "") || "/";
  const targetUrl = `${BOOKING_BASE}${path}${url.search}`;

  try {
    const headers = new Headers(req.headers);
    headers.delete("host");
    headers.delete("origin");
    headers.set("User-Agent", "Mozilla/5.0");

    const upstream = await fetch(targetUrl, {
      method: req.method,
      headers,
      body: req.method !== "GET" && req.method !== "HEAD" ? req.body : undefined,
      redirect: "manual",
    });

    const contentType = upstream.headers.get("content-type") || "";

    if (contentType.includes("text/html")) {
      let html = await upstream.text();
      html = html.replace(/<meta[^>]*http-equiv=["']X-Frame-Options["'][^>]*>/gi, "");
      html = html.replace("<head>", `<head><base href="${BOOKING_BASE}/">`);
      html = html.split(BOOKING_BASE).join("/api/book-proxy");

      const resp = new NextResponse(html, { status: upstream.status });
      copyHeaders(upstream, resp);
      resp.headers.set("X-Frame-Options", "ALLOWALL");
      return resp;
    }

    const resp = new NextResponse(upstream.body, { status: upstream.status });
    copyHeaders(upstream, resp);
    resp.headers.set("X-Frame-Options", "ALLOWALL");
    return resp;
  } catch (err) {
    console.error("Proxy middleware error:", err);
    return new NextResponse("Booking unavailable", { status: 502 });
  }
}

function copyHeaders(from: Response, to: NextResponse) {
  from.headers.forEach((value, key) => {
    const lower = key.toLowerCase();
    if (
      lower === "x-frame-options" ||
      lower === "content-security-policy" ||
      lower === "content-security-policy-report-only"
    ) {
      return;
    }
    to.headers.set(key, value);
  });
}

export const config = {
  matcher: "/api/book-proxy/:path*",
};
