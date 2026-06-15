import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { requireAuth } from "@/lib/api-auth";
import { revalidatePath } from "next/cache";

export async function GET(req: NextRequest) {
  const session = await requireAuth(req);
  if (session instanceof NextResponse) return session;
  const supabase = createServerClient();
  const { data: offers } = await supabase.from("offers").select("*").order("sort_order");
  const { data: inclusions } = await supabase.from("offer_inclusions").select("*").order("sort_order");
  return NextResponse.json({ offers: offers ?? [], inclusions: inclusions ?? [] });
}

export async function POST(req: NextRequest) {
  const session = await requireAuth(req);
  if (session instanceof NextResponse) return session;
  const body = await req.json();
  const supabase = createServerClient();
  const table = body.type === "inclusion" ? "offer_inclusions" : "offers";
  if (table === "offer_inclusions") {
    const clean = { id: body.id, icon: body.icon, label: body.label, detail: body.detail, sort_order: body.sort_order };
    if (!clean.id) delete clean.id;
    const { data, error } = await supabase.from(table).upsert(clean).select().single();
    if (error) return NextResponse.json({ error: error.message, code: error.code, details: error.details, hint: error.hint }, { status: 400 });
    revalidatePath("/offers");
    return NextResponse.json(data);
  }
  const clean = { id: body.id, title: body.title, description: body.description, duration: body.duration, price: body.price, category: body.category, sort_order: body.sort_order, is_published: body.is_published };
  if (!clean.id) delete clean.id;
  const { data, error } = await supabase.from(table).upsert(clean).select().single();
  if (error) return NextResponse.json({ error: error.message, code: error.code, details: error.details, hint: error.hint }, { status: 400 });
  revalidatePath("/offers");
  return NextResponse.json(data);
}

export async function DELETE(req: NextRequest) {
  const session = await requireAuth(req);
  if (session instanceof NextResponse) return session;
  const { id, type } = await req.json();
  const supabase = createServerClient();
  const table = type === "inclusion" ? "offer_inclusions" : "offers";
  await supabase.from(table).delete().eq("id", id);
  revalidatePath("/offers");
  return NextResponse.json({ success: true });
}
