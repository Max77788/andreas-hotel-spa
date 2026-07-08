/**
 * Shared admin API helpers for Andreas Hotel CMS.
 * Uses service_role key (bypasses RLS) with anon key fallback.
 *
 * IMPORTANT: All CMS tables live in the `andreas_website` schema (not `public`).
 * The headers include both Accept-Profile (for reads) and Content-Profile (for writes).
 * Without Content-Profile, POST/PATCH/DELETE silently target the `public` schema.
 */

export function supabaseHeaders() {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  return {
    apikey: key,
    Authorization: `Bearer ${key}`,
    "Accept-Profile": "andreas_website",
    "Content-Profile": "andreas_website",
    "Content-Type": "application/json",
  };
}

export function supabaseUrl(path: string) {
  return `${process.env.NEXT_PUBLIC_SUPABASE_URL!}/rest/v1/${path}`;
}
