import { generateKeyPairSync } from "node:crypto";
import { describe, expect, it, vi } from "vitest";
import { fetchGa4Analytics, getGoogleAnalyticsConfig } from "@/lib/google-analytics";

function jsonResponse(body: unknown) {
  return new Response(JSON.stringify(body), { status: 200, headers: { "Content-Type": "application/json" } });
}

describe("Google Analytics reporting", () => {
  it("requires a numeric GA4 property ID and server-side service account credentials", () => {
    expect(() => getGoogleAnalyticsConfig({})).toThrow("Set GA4_PROPERTY_ID");
    const validConfig = {
      GA4_PROPERTY_ID: "557162533",
      GA4_CLIENT_EMAIL: "analytics@example.iam.gserviceaccount.com",
      GA4_PRIVATE_KEY: "private-key",
    };
    expect(getGoogleAnalyticsConfig(validConfig)).toMatchObject({ propertyId: "557162533" });

    expect(() => getGoogleAnalyticsConfig({
      GA4_PROPERTY_ID: "G-KBM3RSK6HB",
      GA4_CLIENT_EMAIL: "analytics@example.iam.gserviceaccount.com",
      GA4_PRIVATE_KEY: "private-key",
    })).toThrow("numeric Google Analytics 4 property ID");
  });

  it("authenticates privately and maps GA4 summaries, trends, pages, and events", async () => {
    const { privateKey } = generateKeyPairSync("rsa", { modulusLength: 2048 });
    const config = {
      propertyId: "123456789",
      clientEmail: "analytics@example.iam.gserviceaccount.com",
      privateKey: privateKey.export({ type: "pkcs8", format: "pem" }).toString(),
    };
    const request = vi.fn()
      .mockResolvedValueOnce(jsonResponse({ access_token: "test-token" }))
      .mockResolvedValueOnce(jsonResponse({ rows: [{ metricValues: [{ value: "300" }, { value: "120" }, { value: "90" }, { value: "450" }] }] }))
      .mockResolvedValueOnce(jsonResponse({ rows: [
        { dimensionValues: [{ value: "20261001" }], metricValues: [{ value: "20" }, { value: "30" }] },
        { dimensionValues: [{ value: "20261002" }], metricValues: [{ value: "25" }, { value: "35" }] },
      ] }))
      .mockResolvedValueOnce(jsonResponse({ rows: [
        { dimensionValues: [{ value: "/rooms" }], metricValues: [{ value: "250" }] },
        { dimensionValues: [{ value: "/" }], metricValues: [{ value: "200" }] },
      ] }))
      .mockResolvedValueOnce(jsonResponse({ rows: [
        { dimensionValues: [{ value: "20261001" }, { value: "booking_click" }], metricValues: [{ value: "3" }] },
        { dimensionValues: [{ value: "20261002" }, { value: "chat_started" }], metricValues: [{ value: "4" }] },
      ] }));

    const result = await fetchGa4Analytics(30, config, request as unknown as typeof fetch);

    expect(request).toHaveBeenCalledTimes(5);
    expect(String(request.mock.calls[0][0])).toBe("https://oauth2.googleapis.com/token");
    const dailyRequest = JSON.parse(String(request.mock.calls[2][1]?.body));
    expect(dailyRequest.dateRanges).toEqual([{ startDate: "29daysAgo", endDate: "today" }]);
    expect(request.mock.calls.slice(1).every(([url]) => String(url).includes("properties/123456789:runReport"))).toBe(true);
    expect(result).toMatchObject({ source: "ga4", propertyId: "123456789", days: 30, total: 300, sessions: 120, users: 90, pageViews: 450 });
    expect(result.topPages).toEqual([["/rooms", 250], ["/", 200]]);
    expect(result.byEvent).toEqual({ booking_click: 3, chat_started: 4 });
    expect(result.daily).toEqual([
      { date: "2026-10-01", total: 20, pageViews: 30, bookingClicks: 3, chatStarts: 0 },
      { date: "2026-10-02", total: 25, pageViews: 35, bookingClicks: 0, chatStarts: 4 },
    ]);
  });
});
