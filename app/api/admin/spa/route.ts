import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { requireAuth } from "@/lib/api-auth";
import { revalidatePath } from "next/cache";

export async function GET(req: NextRequest) {
  const session = await requireAuth(req);
  if (session instanceof NextResponse) return session;
  const supabase = createServerClient();
  const { data } = await supabase.from("cms_spa").select("*").order("category").order("sort_order");
  return NextResponse.json(data ?? []);
}

export async function POST(req: NextRequest) {
  const session = await requireAuth(req);
  if (session instanceof NextResponse) return session;
  const body = await req.json();
  const supabase = createServerClient();
  const clean = {
    id: body.id,
    name: body.name,
    category: body.category,
    description: body.description || null,
    price: body.price || null,
    price_50: body.price_50 || null,
    price_80: body.price_80 || null,
    promo_price: body.promo_price || null,
    duration: body.duration || null,
    sort_order: body.sort_order ?? 0,
    is_published: body.is_published ?? true,
  };
  if (!clean.id) delete (clean as any).id;
  const { data, error } = await supabase.from("cms_spa").upsert(clean).select().single();
  if (error) return NextResponse.json({ error: error.message, code: error.code, details: error.details, hint: error.hint }, { status: 400 });
  revalidatePath("/spa");
  return NextResponse.json(data);
}

export async function DELETE(req: NextRequest) {
  const session = await requireAuth(req);
  if (session instanceof NextResponse) return session;
  const { id } = await req.json();
  const supabase = createServerClient();
  await supabase.from("cms_spa").delete().eq("id", id);
  revalidatePath("/spa");
  return NextResponse.json({ success: true });
}
