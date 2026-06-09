import { NextRequest, NextResponse } from "next/server";

const BOOKING_BASE = "https://s005948.officialbookings.com";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  return proxyRequest(req, path, "GET");
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  return proxyRequest(req, path, "POST");
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  return proxyRequest(req, path, "PUT");
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  return proxyRequest(req, path, "DELETE");
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  return proxyRequest(req, path, "PATCH");
}

async function proxyRequest(
  req: NextRequest,
  path: string[],
  method: string
) {
  const proxyBase = `${req.nextUrl.protocol}//${req.nextUrl.host}/api/book-proxy`;
  const pathStr = path.join("/");
  const query = req.nextUrl.search;
  const targetUrl = `${BOOKING_BASE}/${pathStr}${query}`;

  try {
    const headers: Record<string, string> = {};
    req.headers.forEach((value, key) => {
      // Skip host/origin headers that would break the proxy
      if (
        !["host", "origin", "referer", "x-forwarded-for", "x-forwarded-host"].includes(
          key.toLowerCase()
        )
      ) {
        headers[key] = value;
      }
    });

    const fetchOpts: RequestInit = {
      method,
      headers,
      redirect: "manual",
    };

    if (method !== "GET" && method !== "HEAD") {
      const contentType = req.headers.get("content-type") || "";
      if (contentType.includes("application/x-www-form-urlencoded")) {
        fetchOpts.body = await req.text();
      } else if (contentType.includes("multipart/form-data")) {
        fetchOpts.body = await req.formData();
      } else {
        fetchOpts.body = await req.text();
      }
    }

    const upstream = await fetch(targetUrl, fetchOpts);

    // Handle redirects — rewrite Location header to go through proxy
    if (
      upstream.status >= 300 &&
      upstream.status < 400 &&
      upstream.headers.get("location")
    ) {
      const location = upstream.headers.get("location")!;
      let newLocation: string;
      if (location.startsWith(BOOKING_BASE)) {
        newLocation = location.replace(BOOKING_BASE, proxyBase);
      } else if (location.startsWith("/")) {
        newLocation = `${proxyBase}${location}`;
      } else if (location.startsWith("http")) {
        // External redirect — pass through
        newLocation = location;
      } else {
        newLocation = `${proxyBase}/${location}`;
      }

      return NextResponse.redirect(new URL(newLocation, req.url), {
        status: upstream.status,
        headers: {
          "set-cookie": upstream.headers.get("set-cookie") || "",
        },
      });
    }

    const contentType = upstream.headers.get("content-type") || "";
    let body: BodyInit | null = null;

    if (contentType.includes("text/html")) {
      let html = await upstream.text();

      // Strip X-Frame-Options from meta tags
      html = html.replace(
        /<meta[^>]*http-equiv=["']X-Frame-Options["'][^>]*>/gi,
        ""
      );

      // Inject base tag so relative URLs resolve to proxy
      html = html.replace(
        "<head>",
        `<head><base href="${BOOKING_BASE}/">`
      );

      // Rewrite absolute booking URLs to proxy
      html = html.replace(
        new RegExp(BOOKING_BASE.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g"),
        proxyBase
      );

      body = html;
    } else if (
      contentType.includes("text/css") ||
      contentType.includes("application/javascript") ||
      contentType.includes("application/x-javascript")
    ) {
      let text = await upstream.text();
      // Rewrite any absolute booking URLs in CSS/JS
      text = text.replace(
        new RegExp(BOOKING_BASE.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g"),
        proxyBase
      );
      body = text;
    } else {
      body = await upstream.arrayBuffer();
    }

    // Build response, stripping framing headers
    const responseHeaders = new Headers();
    upstream.headers.forEach((value, key) => {
      const lower = key.toLowerCase();
      if (
        lower === "x-frame-options" ||
        lower === "content-security-policy" ||
        lower === "content-security-policy-report-only" ||
        lower === "x-content-type-options" ||
        lower === "strict-transport-security"
      ) {
        return;
      }
      responseHeaders.set(key, value);
    });

    return new NextResponse(body, {
      status: upstream.status,
      statusText: upstream.statusText,
      headers: responseHeaders,
    });
  } catch (err) {
    console.error("Proxy error:", err);
    return new NextResponse("Booking engine temporarily unavailable", {
      status: 502,
    });
  }
}
