import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function GET() {
  const supabase = createServerClient();
  const { data } = await supabase.from("policies").select("*").order("sort_order");
  return NextResponse.json(data ?? []);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  console.log("[policies POST] body:", JSON.stringify(body));
  const supabase = createServerClient();
  if (!body.id) delete body.id;
  const { data, error } = await supabase
    .from("policies")
    .upsert(body)
    .select()
    .single();
  if (error) {
    console.error("[policies POST] error:", error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
  console.log("[policies POST] saved:", data?.id);
  revalidatePath("/policies");
  return NextResponse.json(data);
}

export async function DELETE(req: NextRequest) {
  const { id } = await req.json();
  const supabase = createServerClient();
  await supabase.from("policies").delete().eq("id", id);
  revalidatePath("/policies");
  return NextResponse.json({ success: true });
}
