"use client";

import { useEffect, useRef } from "react";

export default function VapiChatSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Ensure the script is loaded before trying to render the widget
    const script = document.querySelector(
      'script[src*="vapi-ai/client-sdk-react"]'
    );
    console.log("Vapi chat section mounted, script present:", !!script);
  }, []);

  return (
    <section className="bg-[var(--hotel-charcoal)] py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <p className="font-body text-[var(--hotel-gold)] text-[10px] tracking-[0.5em] uppercase mb-3">
              Concierge
            </p>
            <h2 className="font-display text-[var(--hotel-cream)] text-4xl md:text-5xl font-light leading-tight">
              Chat with Jessica
            </h2>
            <p className="font-body text-white/40 text-sm mt-3 max-w-sm leading-relaxed">
              Our AI concierge is available 24/7 to answer questions, help plan your stay, and assist with reservations.
            </p>
          </div>
          <a
            href="https://s005948.officialbookings.com/" target="_blank" rel="noopener noreferrer"
            className="inline-block bg-[var(--hotel-gold)] text-[var(--hotel-charcoal)] font-body text-xs tracking-[0.3em] uppercase px-6 py-3 hover:bg-[var(--hotel-terracotta)] hover:text-white transition-all duration-300 self-start md:self-auto"
          >
            Book Directly
          </a>
        </div>

        {/* Widget container */}
        <div
          ref={containerRef}
          className="w-full overflow-hidden"
          style={{
            height: "600px",
            borderRadius: "0px",
            border: "1px solid rgba(201,169,110,0.2)",
          }}
        >
          {/* @ts-expect-error custom web component */}
          <vapi-widget
            public-key="a2166c04-eff0-4623-852e-93d4e7d54f7e"
            assistant-id="94338a77-21c7-49d4-b2c6-d3c23a9f6ee7"
            mode="chat"
            theme="dark"
            size="full"
            radius="large"
            base-color="#2a2118"
            accent-color="#c9a96e"
            button-base-color="#2a2118"
            button-accent-color="#c9a96e"
            empty-chat-message="Hi, Sam here! How can I help you today?"
            style={{ width: "100%", height: "100%", display: "block" }}
          />
        </div>

        {/* Decorative note */}
        <p className="font-body text-white/20 text-[10px] tracking-widest text-center mt-6 uppercase">
          ✦ Available 24 hours a day · 7 days a week ✦
        </p>
      </div>
    </section>
  );
}
