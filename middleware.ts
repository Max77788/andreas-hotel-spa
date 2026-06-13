import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const BOOKING_BASE = "https://s005948.officialbookings.com";

/**
 * Middleware: /api/book-proxy/:path*
 *
 * Proxies requests to the Kube booking engine, mapping Vercel's URL params
 * (arrival/departure/adults) to Kube's param names (checkin/checkout/adult_room1),
 * and adding all required static params. Strips X-Frame-Options so the booking
 * engine can be embedded in an iframe.
 */
export async function middleware(req: NextRequest) {
  const url = new URL(req.url);
  const path = url.pathname.replace("/api/book-proxy", "") || "/";

  // Build Kube URL with correct param mapping
  const kube = new URL(`${BOOKING_BASE}${path}`);

  // Map Vercel params → Kube params
  const arrival = url.searchParams.get("arrival");
  const departure = url.searchParams.get("departure");
  const adults = url.searchParams.get("adults") || "2";

  // Static Kube params (always set)
  kube.searchParams.set("channelId", "ibe");
  kube.searchParams.set("totalRooms", "1");
  kube.searchParams.set("language", "en");
  kube.searchParams.set("currencyCode", "USD");
  kube.searchParams.set("propertyCode", "S005948");
  kube.searchParams.set("widgetId", "BOOKINGWIDGET");
  kube.searchParams.set("widgetSection", "searchbar");
  kube.searchParams.set("activeBookingEngine", "KBE");
  kube.searchParams.set("priceType", "withInformativeTaxesAndFees");
  kube.searchParams.set("priceTimeBase", "stay");
  kube.searchParams.set("coupon", "");

  // Dynamic params
  if (arrival) kube.searchParams.set("checkin", arrival);
  if (departure) kube.searchParams.set("checkout", departure);
  kube.searchParams.set("adult_room1", adults);

  // Also forward any Kube-native params if passed directly
  for (const [key, value] of url.searchParams) {
    if (["arrival", "departure", "adults", "room"].includes(key)) continue;
    if (!kube.searchParams.has(key)) {
      kube.searchParams.set(key, value);
    }
  }

  try {
    const headers = new Headers(req.headers);
    headers.delete("host");
    headers.delete("origin");
    headers.set("User-Agent", "Mozilla/5.0");

    const upstream = await fetch(kube.toString(), {
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
