import { ConvexHttpClient } from "convex/browser";

let _client: ConvexHttpClient | null = null;

/** Lazy Convex HTTP client - avoids initialization during build when env var is unset. */
export function getConvexClient(): ConvexHttpClient {
  if (!_client) {
    _client = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
  }
  return _client;
}
