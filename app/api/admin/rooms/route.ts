import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function GET() {
  const supabase = createServerClient();
  const { data } = await supabase.from("rooms").select("*").order("sort_order");
  return NextResponse.json(data ?? []);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("rooms")
    .upsert(body)
    .select()
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  revalidatePath("/");
  revalidatePath("/rooms");
  revalidatePath(`/rooms/${body.slug}`);
  return NextResponse.json(data);
}

export async function DELETE(req: NextRequest) {
  const { id, slug } = await req.json();
  const supabase = createServerClient();
  await supabase.from("rooms").delete().eq("id", id);
  revalidatePath("/");
  revalidatePath("/rooms");
  if (slug) revalidatePath(`/rooms/${slug}`);
  return NextResponse.json({ success: true });
}
