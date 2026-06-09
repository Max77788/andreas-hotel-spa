import { NextRequest, NextResponse } from "next/server";

const BOOKING_BASE = "https://s005948.officialbookings.com";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ path?: string[] }> }
) {
  const { path } = await params;
  return handle(req, path, "GET");
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ path?: string[] }> }
) {
  const { path } = await params;
  return handle(req, path, "POST");
}

async function handle(
  req: NextRequest,
  path: string[] | undefined,
  method: string
) {
  const pathStr = (path && path.length > 0) ? `/${path.join("/")}` : "";
  const query = req.nextUrl.search;
  const targetUrl = `${BOOKING_BASE}${pathStr}${query}`;

  try {
    const headers: Record<string, string> = {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    };
    req.headers.forEach((value, key) => {
      if (
        !["host", "origin", "referer", "x-forwarded-for", "x-forwarded-host"].includes(
          key.toLowerCase()
        )
      ) {
        headers[key] = value;
      }
    });

    const fetchOpts: RequestInit = { method, headers, redirect: "manual" };
    if (method !== "GET" && method !== "HEAD") {
      fetchOpts.body = await req.text();
    }

    const upstream = await fetch(targetUrl, fetchOpts);

    // Handle redirects
    if (upstream.status >= 300 && upstream.status < 400) {
      const loc = upstream.headers.get("location");
      if (loc) {
        let newLoc = loc;
        if (loc.startsWith(BOOKING_BASE)) {
          newLoc = `/api/book-proxy${loc.slice(BOOKING_BASE.length)}`;
        } else if (loc.startsWith("/")) {
          newLoc = `/api/book-proxy${loc}`;
        }
        const resp = NextResponse.redirect(new URL(newLoc, req.url), upstream.status);
        upstream.headers.forEach((v, k) => {
          if (k.toLowerCase() === "set-cookie") resp.headers.set(k, v);
        });
        return resp;
      }
    }

    const contentType = upstream.headers.get("content-type") || "";

    if (contentType.includes("text/html")) {
      let html = await upstream.text();

      // Strip meta X-Frame-Options
      html = html.replace(/<meta[^>]*http-equiv=["']X-Frame-Options["'][^>]*>/gi, "");
      // Inject base tag for relative URLs
      html = html.replace("<head>", `<head><base href="${BOOKING_BASE}/">`);
      // Rewrite absolute booking URLs to our proxy
      html = html.split(BOOKING_BASE).join("/api/book-proxy");

      return new NextResponse(html, {
        status: upstream.status,
        headers: buildResponseHeaders(upstream),
      });
    }

    return new NextResponse(upstream.body, {
      status: upstream.status,
      headers: buildResponseHeaders(upstream),
    });
  } catch (err) {
    console.error("Proxy error:", err);
    return new NextResponse(
      `Booking engine temporarily unavailable: ${err instanceof Error ? err.message : "unknown error"}`,
      { status: 502 }
    );
  }
}

function buildResponseHeaders(upstream: Response): Headers {
  const h = new Headers();
  upstream.headers.forEach((value, key) => {
    const lower = key.toLowerCase();
    if (
      lower === "x-frame-options" ||
      lower === "content-security-policy" ||
      lower === "content-security-policy-report-only"
    ) {
      return;
    }
    h.set(key, value);
  });
  h.set("X-Frame-Options", "ALLOWALL");
  return h;
}
