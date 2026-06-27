import { createClient } from "@supabase/supabase-js";

export function createServerClient() {
  // Use anon key for most operations (works with andreas_website schema).
  // Service role key used as fallback for admin-only operations.
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!key) {
    console.error("[createServerClient] No Supabase key found!");
  }

  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    key!,
    { db: { schema: "andreas_website" } },
  );
}

export function createAnonClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { db: { schema: "andreas_website" } },
  );
}
