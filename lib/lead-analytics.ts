import { createServerClient } from "@/lib/supabase/server";

/** Record a successful lead submission without storing form contents or PII. */
export async function recordLeadSubmission(eventName: "contact_form_submission" | "rfp_submission") {
  try {
    const { error } = await createServerClient().from("analytics_events").insert({
      event_name: eventName,
      page_path: eventName === "rfp_submission" ? "/group-booking" : "/",
      metadata: { source: eventName === "rfp_submission" ? "rfp" : "contact_form" },
    });

    if (error) {
      console.error(`[Analytics] Failed to record ${eventName}:`, error.message);
    }
  } catch (error) {
    // Analytics must never turn a successfully submitted lead into a 500.
    console.error(`[Analytics] Failed to record ${eventName}:`, error);
  }
}
