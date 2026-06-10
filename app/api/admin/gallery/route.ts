import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function GET() {
  const supabase = createServerClient();
  const { data } = await supabase.from("gallery").select("*").order("sort_order");
  return NextResponse.json(data ?? []);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const supabase = createServerClient();
  const clean = {
    id: body.id, image_url: body.image_url, alt: body.alt,
    category: body.category, sort_order: body.sort_order,
  };
  if (!clean.id) delete clean.id;
  const { data, error } = await supabase.from("gallery").upsert(clean).select().single();
  if (error) return NextResponse.json({ error: error.message, code: error.code, details: error.details, hint: error.hint }, { status: 400 });
  revalidatePath("/");
  return NextResponse.json(data);
}

export async function DELETE(req: NextRequest) {
  const { id } = await req.json();
  const supabase = createServerClient();
  await supabase.from("gallery").delete().eq("id", id);
  revalidatePath("/");
  return NextResponse.json({ success: true });
}
