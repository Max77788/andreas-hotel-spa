import type { Metadata } from "next";
import Nav from "@/components/nav";
import Footer from "@/components/footer";
import AssistantChatPage from "@/components/assistant-chat-page";

export const metadata: Metadata = {
  title: "Chat with Andreas | The Andreas Hotel & Spa",
  description: "Chat with the Andreas Hotel & Spa concierge about rooms, amenities, spa services, and reservations.",
};

export default function ChatPage() {
  return (
    <>
      <Nav />
      <AssistantChatPage />
      <Footer />
    </>
  );
}
