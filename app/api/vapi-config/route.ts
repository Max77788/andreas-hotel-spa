import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = createServerClient();
  const { data } = await supabase
    .from("site_settings")
    .select("vapi_assistant_name, vapi_first_message, vapi_placeholder")
    .single();
  return NextResponse.json(data ?? {});
}
