import { NextRequest, NextResponse } from "next/server";

const BOOKING_BASE = "https://us01.iqwebbook.com/AHSCA115";

export const dynamic = "force-dynamic";

async function proxyRequest(request: NextRequest) {
  let pathParts = request.nextUrl.pathname.replace("/api/book-proxy", "");
  // Clean and normalize path
  if (!pathParts) pathParts = "/";
  if (!pathParts.startsWith("/")) pathParts = "/" + pathParts;
  const query = request.nextUrl.search;
  const targetUrl = `${BOOKING_BASE}${pathParts}${query}`;

  try {
    const headers: Record<string, string> = {};
    // Forward relevant request headers
    request.headers.forEach((value, key) => {
      const lower = key.toLowerCase();
      if (
        lower === "host" ||
        lower === "origin" ||
        lower === "referer" ||
        lower === "connection" ||
        lower === "transfer-encoding"
      ) {
        return;
      }
      headers[key] = value;
    });

    // Set the correct host for the booking server
    headers.host = "us01.iqwebbook.com";
    headers.origin = "https://us01.iqwebbook.com";

    const fetchOptions: RequestInit = {
      method: request.method,
      headers,
      redirect: "manual" as RequestRedirect,
    };

    if (request.method !== "GET" && request.method !== "HEAD") {
      const contentType = request.headers.get("content-type") || "";
      if (contentType.includes("application/x-www-form-urlencoded")) {
        fetchOptions.body = await request.text();
      } else if (contentType.includes("multipart/form-data")) {
        fetchOptions.body = await request.formData();
      } else {
        fetchOptions.body = await request.text();
      }
    }

    const response = await fetch(targetUrl, fetchOptions);

    const body = await response.text();

    // Clone the response with stripped frame-blocking headers
    const proxyResponse = new NextResponse(body, {
      status: response.status,
      statusText: response.statusText,
    });

    // Forward response headers, stripping frame blockers
    response.headers.forEach((value, key) => {
      const lower = key.toLowerCase();
      // Strip headers that block iframe embedding
      if (
        lower === "x-frame-options" ||
        lower === "content-security-policy" ||
        lower === "x-content-security-policy" ||
        lower === "x-webkit-csp"
      ) {
        return;
      }
      // Strip Domain from Set-Cookie so cookies work on our domain
      if (lower === "set-cookie") {
        const cleaned = value
          .split(",")
          .map((cookie) =>
            cookie.replace(/\s*;\s*Domain=[^;]+/i, "").trim()
          )
          .join(", ");
        proxyResponse.headers.set(key, cleaned);
        return;
      }
      proxyResponse.headers.set(key, value);
    });

    // For HTML responses, inject a base tag so relative URLs route through our proxy
    const contentType = response.headers.get("content-type") || "";
    if (contentType.includes("text/html") && body.includes("<head")) {
      const modifiedBody = body.replace(
        "<head>",
        `<head><base href="/api/book-proxy/">`
      );
      return new NextResponse(modifiedBody, {
        status: proxyResponse.status,
        statusText: proxyResponse.statusText,
        headers: proxyResponse.headers,
      });
    }

    // Handle redirects
    if (
      response.status === 301 ||
      response.status === 302 ||
      response.status === 303 ||
      response.status === 307 ||
      response.status === 308
    ) {
      const location = response.headers.get("location");
      if (location) {
        let newLocation = location;
        if (location.startsWith(BOOKING_BASE)) {
          newLocation =
            "/api/book-proxy" + location.slice(BOOKING_BASE.length);
        } else if (
          location.startsWith("http") &&
          location.includes("iqwebbook.com")
        ) {
          const url = new URL(location);
          newLocation = "/api/book-proxy" + url.pathname + url.search;
        }
        proxyResponse.headers.set("Location", newLocation);
      }
    }

    return proxyResponse;
  } catch (error) {
    console.error("Proxy error:", error);
    return new NextResponse("Booking service temporarily unavailable", {
      status: 502,
    });
  }
}

export async function GET(request: NextRequest) {
  return proxyRequest(request);
}

export async function POST(request: NextRequest) {
  return proxyRequest(request);
}
