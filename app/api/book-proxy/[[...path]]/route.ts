import { NextRequest, NextResponse } from "next/server";

const BOOKING_BASE = "https://s005948.officialbookings.com";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ path?: string[] }> }
) {
  const { path } = await params;
  const pathStr = (path && path.length > 0) ? path.join("/") : "";
  const query = req.nextUrl.search;
  const targetUrl = pathStr
    ? `${BOOKING_BASE}/${pathStr}${query}`
    : `${BOOKING_BASE}${query}`;

  try {
    const headers: Record<string, string> = {};
    req.headers.forEach((value, key) => {
      if (
        !["host", "origin", "referer", "x-forwarded-for", "x-forwarded-host"].includes(
          key.toLowerCase()
        )
      ) {
        headers[key] = value;
      }
    });

    const upstream = await fetch(targetUrl, {
      method: "GET",
      headers,
      redirect: "manual",
    });

    const contentType = upstream.headers.get("content-type") || "";
    const responseHeaders = new Headers();

    upstream.headers.forEach((value, key) => {
      const lower = key.toLowerCase();
      if (
        lower === "x-frame-options" ||
        lower === "content-security-policy" ||
        lower === "content-security-policy-report-only"
      ) {
        return;
      }
      responseHeaders.set(key, value);
    });

    if (contentType.includes("text/html")) {
      let html = await upstream.text();
      html = html.replace(/<meta[^>]*http-equiv=["']X-Frame-Options["'][^>]*>/gi, "");
      // Inject base tag
      html = html.replace("<head>", `<head><base href="${BOOKING_BASE}/">`);
      return new NextResponse(html, {
        status: upstream.status,
        headers: responseHeaders,
      });
    }

    return new NextResponse(upstream.body, {
      status: upstream.status,
      headers: responseHeaders,
    });
  } catch (err) {
    console.error("Proxy error:", err);
    return new NextResponse(`Proxy error: ${err instanceof Error ? err.message : String(err)}`, {
      status: 502,
    });
  }
}
