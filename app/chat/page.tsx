import type { Metadata } from "next";
import Nav from "@/components/nav";
import Footer from "@/components/footer";
import AssistantChatPage from "@/components/assistant-chat-page";
import { createServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Chat with Andreas | The Andreas Hotel & Spa",
  description: "Chat with the Andreas Hotel & Spa concierge about rooms, amenities, spa services, and reservations.",
};

const DEFAULTS = {
  name: "Andreas",
  greeting: "Hi, I'm Andreas, your receptionist at Andreas Hotel & Spa. How can I help you today?",
  placeholder: "Ask about rooms, amenities, or bookings...",
};

export default async function ChatPage() {
  let assistantName = DEFAULTS.name;
  let firstMessage = DEFAULTS.greeting;
  let placeholder = DEFAULTS.placeholder;

  try {
    const supabase = createServerClient();
    const { data } = await supabase
      .from("site_settings")
      .select("vapi_assistant_name, vapi_first_message, vapi_placeholder")
      .single();
    assistantName = data?.vapi_assistant_name || assistantName;
    firstMessage = data?.vapi_first_message || firstMessage;
    placeholder = data?.vapi_placeholder || placeholder;
  } catch (err) {
    console.error("Chat page CMS fetch failed:", err);
  }

  return (
    <>
      <Nav />
      <AssistantChatPage
        assistantName={assistantName}
        firstMessage={firstMessage}
        placeholder={placeholder}
      />
      <Footer />
    </>
  );
}
