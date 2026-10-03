import { NextRequest, NextResponse } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

const { requireAuthMock, fetchGa4AnalyticsMock, createServerClientMock } = vi.hoisted(() => ({
  requireAuthMock: vi.fn(),
  fetchGa4AnalyticsMock: vi.fn(),
  createServerClientMock: vi.fn(),
}));

vi.mock("@/lib/api-auth", () => ({ requireAuth: requireAuthMock }));
vi.mock("@/lib/google-analytics", () => ({
  fetchGa4Analytics: fetchGa4AnalyticsMock,
  Ga4AnalyticsError: class Ga4AnalyticsError extends Error {},
}));
vi.mock("@/lib/supabase/server", () => ({ createServerClient: createServerClientMock }));

import { GET } from "@/app/api/analytics/route";

describe("GET /api/analytics GA4 access", () => {
  beforeEach(() => vi.clearAllMocks());

  it("requires an authenticated admin session before contacting GA4", async () => {
    requireAuthMock.mockResolvedValueOnce(NextResponse.json({ error: "Unauthorized" }, { status: 401 }));
    const response = await GET(new NextRequest("https://stayatandreas.com/api/analytics?source=ga4"));
    expect(response.status).toBe(401);
    expect(fetchGa4AnalyticsMock).not.toHaveBeenCalled();
  });

  it("returns GA4 report data for an authenticated request and selected range", async () => {
    requireAuthMock.mockResolvedValueOnce({ role: "admin" });
    fetchGa4AnalyticsMock.mockResolvedValueOnce({ source: "ga4", days: 30, propertyId: "557162533" });
    const response = await GET(new NextRequest("https://stayatandreas.com/api/analytics?source=ga4&days=30"));
    expect(response.status).toBe(200);
    expect(fetchGa4AnalyticsMock).toHaveBeenCalledWith(30);
    expect(await response.json()).toMatchObject({ source: "ga4", propertyId: "557162533" });
  });

  it("does not expose unexpected provider or runtime errors to the client", async () => {
    requireAuthMock.mockResolvedValueOnce({ role: "admin" });
    fetchGa4AnalyticsMock.mockRejectedValueOnce(new Error("private provider detail"));
    const response = await GET(new NextRequest("https://stayatandreas.com/api/analytics?source=ga4"));
    expect(response.status).toBe(503);
    const body = await response.json();
    expect(body.error).toBe("Google Analytics could not be reached. Check the server configuration and try again.");
    expect(JSON.stringify(body)).not.toContain("private provider detail");
  });
});
