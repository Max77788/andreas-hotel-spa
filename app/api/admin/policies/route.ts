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
  console.log("[policies POST] raw body:", JSON.stringify(body));
  const supabase = createServerClient();
  if (!body.id) delete body.id;
  // Only allow known columns
  const clean = {
    id: body.id,
    label: body.label,
    detail: body.detail,
    sort_order: body.sort_order,
    is_highlighted: body.is_highlighted,
  };
  if (!clean.id) delete clean.id;
  const { data, error } = await supabase
    .from("policies")
    .upsert(clean)
    .select()
    .single();
  if (error) {
    console.error("[policies POST] raw error:", JSON.stringify(error));
    console.error("[policies POST] body sent:", JSON.stringify(body));
    return NextResponse.json({
      error: error.message,
      code: error.code,
      details: error.details,
      hint: error.hint,
    }, { status: 400 });
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
