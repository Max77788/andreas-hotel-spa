import { createClient } from "@supabase/supabase-js";

/** Browser uploads go directly to Supabase Storage, avoiding Vercel's request-body cap. */
export const MAX_ADMIN_IMAGE_BYTES = 50 * 1024 * 1024;

export type AdminImageUploadResult = {
  url: string | null;
  error: string | null;
};

export async function uploadAdminImage(file: File): Promise<AdminImageUploadResult> {
  if (!file.type.startsWith("image/")) {
    return { url: null, error: "Please select an image file." };
  }
  if (file.size > MAX_ADMIN_IMAGE_BYTES) {
    return { url: null, error: "Images must be 50 MB or smaller." };
  }

  try {
    const signResponse = await fetch("/api/admin/upload/sign", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fileName: file.name, contentType: file.type }),
    });
    const signed = await signResponse.json();
    if (!signResponse.ok || !signed.path || !signed.token || !signed.url) {
      return { url: null, error: signed.error || "Could not prepare image upload." };
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    );
    const { error } = await supabase.storage
      .from("photos")
      .uploadToSignedUrl(signed.path, signed.token, file, {
        cacheControl: "31536000",
        contentType: file.type,
        upsert: false,
      });
    if (error) return { url: null, error: error.message };

    return { url: signed.url, error: null };
  } catch (error) {
    return {
      url: null,
      error: error instanceof Error ? error.message : "Network error while uploading.",
    };
  }
}
