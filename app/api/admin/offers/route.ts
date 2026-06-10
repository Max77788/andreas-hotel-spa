import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function GET() {
  const supabase = createServerClient();
  const { data: offers } = await supabase.from("offers").select("*").order("sort_order");
  const { data: inclusions } = await supabase.from("offer_inclusions").select("*").order("sort_order");
  return NextResponse.json({ offers: offers ?? [], inclusions: inclusions ?? [] });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const supabase = createServerClient();
  const table = body.type === "inclusion" ? "offer_inclusions" : "offers";
  const { data, error } = await supabase
    .from(table)
    .upsert(body)
    .select()
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  revalidatePath("/offers");
  return NextResponse.json(data);
}

export async function DELETE(req: NextRequest) {
  const { id, type } = await req.json();
  const supabase = createServerClient();
  const table = type === "inclusion" ? "offer_inclusions" : "offers";
  await supabase.from(table).delete().eq("id", id);
  revalidatePath("/offers");
  return NextResponse.json({ success: true });
}
