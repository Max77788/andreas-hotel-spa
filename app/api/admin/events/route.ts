import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function GET() {
  const supabase = createServerClient();
  const { data } = await supabase.from("events").select("*").order("sort_order");
  return NextResponse.json(data ?? []);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const supabase = createServerClient();
  const clean = {
    id: body.id, tag: body.tag, date_label: body.date_label, title: body.title,
    description: body.description, image_url: body.image_url,
    sort_order: body.sort_order, is_published: body.is_published,
  };
  if (!clean.id) delete clean.id;
  const { data, error } = await supabase.from("events").upsert(clean).select().single();
  if (error) return NextResponse.json({ error: error.message, code: error.code, details: error.details, hint: error.hint }, { status: 400 });
  revalidatePath("/");
  revalidatePath("/events");
  return NextResponse.json(data);
}

export async function DELETE(req: NextRequest) {
  const { id } = await req.json();
  const supabase = createServerClient();
  await supabase.from("events").delete().eq("id", id);
  revalidatePath("/");
  revalidatePath("/events");
  return NextResponse.json({ success: true });
}
