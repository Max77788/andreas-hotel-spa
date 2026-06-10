import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function GET() {
  const supabase = createServerClient();
  const { data } = await supabase.from("site_settings").select("*").single();
  return NextResponse.json(data ?? {});
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("site_settings")
    .upsert(body)
    .select()
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  revalidatePath("/");
  return NextResponse.json(data);
}
