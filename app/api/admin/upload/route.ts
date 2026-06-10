import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("file") as File;
  if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 });

  const supabase = createServerClient();
  const ext = file.name.split(".").pop();
  const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const { error } = await supabase.storage
    .from("photos")
    .upload(path, file, { upsert: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  const { data: urlData } = supabase.storage.from("photos").getPublicUrl(path);
  return NextResponse.json({ url: urlData.publicUrl });
}
