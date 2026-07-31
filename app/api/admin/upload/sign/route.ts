import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { requireAuth } from "@/lib/api-auth";

const IMAGE_CONTENT_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/avif",
]);

export async function POST(req: NextRequest) {
  const session = await requireAuth(req);
  if (session instanceof NextResponse) return session;

  const { fileName, contentType } = await req.json();
  if (typeof fileName !== "string" || !fileName.trim()) {
    return NextResponse.json({ error: "A file name is required." }, { status: 400 });
  }
  if (typeof contentType !== "string" || !IMAGE_CONTENT_TYPES.has(contentType)) {
    return NextResponse.json({ error: "Only JPEG, PNG, WebP, GIF, and AVIF images are accepted." }, { status: 400 });
  }

  const extension = fileName.split(".").pop()?.toLowerCase() || "image";
  const path = `${Date.now()}-${crypto.randomUUID()}.${extension}`;
  const supabase = createServerClient();
  const { data, error } = await supabase.storage
    .from("photos")
    .createSignedUploadUrl(path, { upsert: false });

  if (error || !data) {
    return NextResponse.json({ error: error?.message || "Could not prepare image upload." }, { status: 400 });
  }

  const { data: urlData } = supabase.storage.from("photos").getPublicUrl(path);
  return NextResponse.json({ path: data.path, token: data.token, url: urlData.publicUrl });
}
