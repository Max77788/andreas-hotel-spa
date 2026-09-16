"use client";

import { useEffect } from "react";
import VapiCustomChat from "@/components/vapi-custom-chat";

const PUBLIC_KEY = "a2166c04-eff0-4623-852e-93d4e7d54f7e";
const ASSISTANT_ID = "94338a77-21c7-49d4-b2c6-d3c23a9f6ee7";

interface AssistantChatPageProps {
  assistantName: string;
  firstMessage: string;
  placeholder: string;
}

export default function AssistantChatPage({ assistantName, firstMessage, placeholder }: AssistantChatPageProps) {
  useEffect(() => {
    document.body.classList.add("assistant-chat-route");
    return () => document.body.classList.remove("assistant-chat-route");
  }, []);

  return (
    <main className="min-h-screen bg-[var(--hotel-cream)] text-[var(--hotel-charcoal)] pt-28 md:pt-36 transition-colors">
      <div className="max-w-5xl mx-auto px-5 md:px-10 pb-16 md:pb-24">
        <div className="text-center mb-8 md:mb-10">
          <p className="font-body text-[var(--hotel-gold)] text-[10px] tracking-[0.5em] uppercase mb-3">
            Andreas Concierge
          </p>
          <h1 className="font-display text-[var(--hotel-charcoal)] text-4xl md:text-6xl font-light leading-tight">
            {`Chat with ${assistantName}`}
          </h1>
          <p className="font-body text-[var(--hotel-charcoal)]/70 text-sm md:text-base mt-4 max-w-xl mx-auto leading-relaxed">
            Ask about rooms, spa services, amenities, Palm Springs, or your reservation.
            Our concierge is available 24 hours a day.
          </p>
        </div>

        <div className="h-[min(680px,72vh)] min-h-[500px] w-full overflow-hidden border border-[var(--chat-gold-border)] bg-[var(--chat-bg)] shadow-[0_12px_50px_rgba(0,0,0,0.18)]">
          <VapiCustomChat
            publicKey={PUBLIC_KEY}
            assistantId={ASSISTANT_ID}
            assistantName={assistantName}
            firstMessage={firstMessage}
            placeholder={placeholder}
            className="h-full"
          />
        </div>

        <p className="font-body text-[var(--hotel-charcoal)]/50 text-[10px] tracking-[0.25em] text-center mt-5 uppercase">
          Private concierge chat · Available 24/7
        </p>
      </div>
    </main>
  );
}
