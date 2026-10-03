import { createSign } from "node:crypto";

const TOKEN_URL = "https://oauth2.googleapis.com/token";
const REPORT_URL = "https://analyticsdata.googleapis.com/v1beta/properties";
const SCOPE = "https://www.googleapis.com/auth/analytics.readonly";

export class Ga4AnalyticsError extends Error {}

type ReportRow = { dimensionValues?: { value?: string }[]; metricValues?: { value?: string }[] };
type RunReportResponse = { rows?: ReportRow[]; rowCount?: number };
type GoogleAnalyticsConfig = { propertyId: string; clientEmail: string; privateKey: string };

export type Ga4Analytics = {
  source: "ga4";
  propertyId: string;
  days: number;
  total: number;
  sessions: number;
  users: number;
  pageViews: number;
  byEvent: Record<string, number>;
  topPages: [string, number][];
  daily: { date: string; total: number; pageViews: number; bookingClicks: number; chatStarts: number }[];
  recent: [];
};

export function getGoogleAnalyticsConfig(env: Record<string, string | undefined> = process.env): GoogleAnalyticsConfig {
  const propertyId = env.GA4_PROPERTY_ID?.trim();
  const clientEmail = env.GA4_CLIENT_EMAIL?.trim();
  const privateKey = env.GA4_PRIVATE_KEY?.replace(/\\n/g, "\n").trim();
  if (!propertyId || !clientEmail || !privateKey) {
    throw new Ga4AnalyticsError("Google Analytics reporting is not configured. Set GA4_PROPERTY_ID, GA4_CLIENT_EMAIL, and GA4_PRIVATE_KEY on the server.");
  }
  if (!/^\d+$/.test(propertyId)) throw new Ga4AnalyticsError("GA4_PROPERTY_ID must be the numeric Google Analytics 4 property ID, not the G- measurement ID.");
  return { propertyId, clientEmail, privateKey };
}

function base64url(value: string | Buffer) {
  return Buffer.from(value).toString("base64url");
}

async function getAccessToken(config: GoogleAnalyticsConfig, request: typeof fetch) {
  const now = Math.floor(Date.now() / 1000);
  const header = base64url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const claim = base64url(JSON.stringify({
    iss: config.clientEmail,
    scope: SCOPE,
    aud: TOKEN_URL,
    iat: now,
    exp: now + 3600,
  }));
  const unsigned = `${header}.${claim}`;
  const signer = createSign("RSA-SHA256");
  signer.update(unsigned);
  const assertion = `${unsigned}.${signer.sign(config.privateKey, "base64url")}`;
  const response = await request(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion,
    }),
    cache: "no-store",
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok || typeof payload.access_token !== "string") {
    throw new Ga4AnalyticsError("Google Analytics authentication failed. Check the service account key and its Viewer access to the GA4 property.");
  }
  return payload.access_token as string;
}

async function runReport(
  request: typeof fetch,
  propertyId: string,
  accessToken: string,
  days: number,
  dimensions: string[],
  metrics: string[],
): Promise<RunReportResponse> {
  const response = await request(`${REPORT_URL}/${propertyId}:runReport`, {
    method: "POST",
    headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      dateRanges: [{ startDate: days === 1 ? "today" : `${days - 1}daysAgo`, endDate: "today" }],
      ...(dimensions.length ? { dimensions: dimensions.map((name) => ({ name })) } : {}),
      metrics: metrics.map((name) => ({ name })),
      limit: 10000,
      keepEmptyRows: true,
    }),
    cache: "no-store",
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    const apiStatus = typeof payload.error?.status === "string" ? payload.error.status : "unknown";
    console.error("GA4 report request failed", { httpStatus: response.status, apiStatus });
    throw new Ga4AnalyticsError("Google Analytics report failed. Check that the Analytics Data API is enabled, the property ID is correct, and the service account has Viewer access.");
  }
  return payload as RunReportResponse;
}

const numberAt = (row: ReportRow | undefined, index: number) => Number(row?.metricValues?.[index]?.value || 0);

export async function fetchGa4Analytics(
  days: number,
  config = getGoogleAnalyticsConfig(),
  request: typeof fetch = fetch,
): Promise<Ga4Analytics> {
  const accessToken = await getAccessToken(config, request);
  const [summary, dailyReport, pagesReport, eventsReport] = await Promise.all([
    runReport(request, config.propertyId, accessToken, days, [], ["eventCount", "sessions", "totalUsers", "screenPageViews"]),
    runReport(request, config.propertyId, accessToken, days, ["date"], ["eventCount", "screenPageViews"]),
    runReport(request, config.propertyId, accessToken, days, ["pagePath"], ["screenPageViews"]),
    runReport(request, config.propertyId, accessToken, days, ["date", "eventName"], ["eventCount"]),
  ]);

  const daily = new Map<string, Ga4Analytics["daily"][number]>();
  for (const row of dailyReport.rows || []) {
    const rawDate = row.dimensionValues?.[0]?.value || "";
    const date = rawDate.length === 8 ? `${rawDate.slice(0, 4)}-${rawDate.slice(4, 6)}-${rawDate.slice(6, 8)}` : rawDate;
    if (!date) continue;
    daily.set(date, { date, total: numberAt(row, 0), pageViews: numberAt(row, 1), bookingClicks: 0, chatStarts: 0 });
  }

  const byEvent: Record<string, number> = {};
  for (const row of eventsReport.rows || []) {
    const dateRaw = row.dimensionValues?.[0]?.value || "";
    const eventName = row.dimensionValues?.[1]?.value || "(not set)";
    const count = numberAt(row, 0);
    byEvent[eventName] = (byEvent[eventName] || 0) + count;
    const date = dateRaw.length === 8 ? `${dateRaw.slice(0, 4)}-${dateRaw.slice(4, 6)}-${dateRaw.slice(6, 8)}` : dateRaw;
    const point = daily.get(date);
    if (point && eventName === "booking_click") point.bookingClicks += count;
    if (point && eventName === "chat_started") point.chatStarts += count;
  }

  const topPages = (pagesReport.rows || [])
    .map((row) => [row.dimensionValues?.[0]?.value || "(not set)", numberAt(row, 0)] as [string, number])
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);
  const totals = summary.rows?.[0];

  return {
    source: "ga4",
    propertyId: config.propertyId,
    days,
    total: numberAt(totals, 0),
    sessions: numberAt(totals, 1),
    users: numberAt(totals, 2),
    pageViews: numberAt(totals, 3),
    byEvent,
    topPages,
    daily: Array.from(daily.values()).sort((a, b) => a.date.localeCompare(b.date)),
    recent: [],
  };
}
