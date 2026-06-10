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
  const clean = {
    id: body.id, hotel_name: body.hotel_name, tagline: body.tagline,
    address: body.address, phone: body.phone, email: body.email,
    booking_url: body.booking_url, hero_video_url: body.hero_video_url,
    logo_dark_url: body.logo_dark_url, logo_light_url: body.logo_light_url,
  };
  if (!clean.id) delete clean.id;
  const { data, error } = await supabase.from("site_settings").upsert(clean).select().single();
  if (error) return NextResponse.json({ error: error.message, code: error.code, details: error.details, hint: error.hint }, { status: 400 });
  revalidatePath("/");
  return NextResponse.json(data);
}
