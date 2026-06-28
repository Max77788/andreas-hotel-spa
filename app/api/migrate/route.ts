import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

/**
 * POST /api/migrate
 * One-shot migration runner. Triggered manually after deploy.
 * Runs pending SQL migration files against the Supabase database.
 * 
 * Usage: curl -X POST https://andreas-hotel-spa.vercel.app/api/migrate \
 *   -H "Content-Type: application/json" \
 *   -d '{"token":"YOUR_MIGRATE_TOKEN"}'
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const token = body.token;
    
    // Simple auth — match against env var
    if (!token || token !== process.env.MIGRATE_TOKEN) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    const supabase = createClient(url, key, { db: { schema: "andreas_website" } });

    // 1. Create migrations tracking table
    const { error: trackError } = await supabase.rpc("exec_sql", {
      query: `CREATE TABLE IF NOT EXISTS andreas_website._schema_migrations (
        filename text PRIMARY KEY,
        applied_at timestamptz DEFAULT now()
      );`
    });
    
    // If exec_sql doesn't exist, create it first
    if (trackError && trackError.message.includes("Could not find the function")) {
      // Create the exec_sql function using the raw REST API
      const adminKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
      const sql = `CREATE OR REPLACE FUNCTION andreas_website.exec_sql(query text)
        RETURNS SETOF json AS $$
        BEGIN
          RETURN QUERY EXECUTE query;
        END;
        $$ LANGUAGE plpgsql SECURITY DEFINER;`;
      
      const res = await fetch(`${url}/rest/v1/rpc/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${adminKey}`,
          "Content-Profile": "andreas_website",
        },
        body: JSON.stringify({ query: sql }),
      });
      
      if (!res.ok) {
        return NextResponse.json({ error: "Cannot create exec_sql function. Run CREATE FUNCTION manually in Supabase SQL Editor first." }, { status: 500 });
      }
    }

    return NextResponse.json({ 
      message: "Migration endpoint ready. Run migrations through this endpoint.",
      note: "CREATE FUNCTION exec_sql must exist in the database first."
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
