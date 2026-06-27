import { createClient } from "@supabase/supabase-js";

export function createServerClient() {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Use service_role key if available, fall back to anon key
  const key = serviceRoleKey || anonKey;

  if (!key) {
    console.error("[createServerClient] No Supabase key found! SUPABASE_SERVICE_ROLE_KEY and NEXT_PUBLIC_SUPABASE_ANON_KEY are both missing.");
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
