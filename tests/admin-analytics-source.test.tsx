import { cleanup, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import AnalyticsPage from "@/app/admin/analytics/page";

vi.mock("recharts", () => ({
  Bar: () => null,
  BarChart: () => null,
  CartesianGrid: () => null,
  Line: () => null,
  LineChart: () => null,
  ResponsiveContainer: () => null,
  Tooltip: () => null,
  XAxis: () => null,
  YAxis: () => null,
}));

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe("admin analytics source", () => {
  it("loads GA4 by default and labels the property returned by the API", async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify({
      source: "ga4",
      propertyId: "557162533",
      days: 30,
      total: 42,
      sessions: 18,
      users: 15,
      pageViews: 27,
      byEvent: { page_view: 27 },
      topPages: [["/", 20]],
      daily: [],
      recent: [],
    }), { status: 200, headers: { "Content-Type": "application/json" } }));
    vi.stubGlobal("fetch", fetchMock);

    render(<AnalyticsPage />);

    await waitFor(() => expect(fetchMock).toHaveBeenCalledWith(
      "/api/analytics?source=ga4&days=30",
      expect.objectContaining({ signal: expect.any(AbortSignal) }),
    ));
    expect(await screen.findByText(/Property 557162533/)).toBeTruthy();
    expect(screen.getByText("18")).toBeTruthy();
    expect(screen.getByRole("tab", { name: "Google Analytics 4" }).getAttribute("aria-selected")).toBe("true");
    expect(screen.queryByRole("tab", { name: "Site events" })).toBeNull();
  });
});
