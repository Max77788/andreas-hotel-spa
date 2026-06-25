import "./globals.css";
import type { Metadata } from "next";
import Script from "next/script";
import { ThemeProvider } from "next-themes";

export const metadata: Metadata = {
  title: "The Andreas Hotel & Spa – Palm Springs, CA",
  description:
    "Ideally located in the heart of downtown Palm Springs, the Andreas Hotel & Spa brings modern style to a classic setting. Originally built in 1935, enjoy 25 luxurious guest rooms and suites, a full-service spa, and stunning pool courtyard.",
  icons: { icon: "/favicon.png" },
  openGraph: {
    title: "The Andreas Hotel & Spa – Palm Springs, CA",
    description:
      "A boutique adults-only hotel in downtown Palm Springs featuring 25 luxurious rooms, a full-service spa, heated pool, and courtyard fireplaces. Established 1935.",
    url: "https://andreashotel.com",
    siteName: "The Andreas Hotel & Spa",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning={true}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>

        {/* Vapi AI Agent — tiny dot expands to full chat panel on hover */}
        <div className="vapi-hover-container">
          {/* Trigger dot — tiny, always visible */}
          <div className="vapi-hover-trigger">
            <span className="vapi-hover-text">Chat with Jessica</span>
          </div>

          {/* Chat panel — expands on hover */}
          <div className="vapi-hover-panel">
            {/* @ts-expect-error custom web component */}
            <vapi-widget
              public-key="a2166c04-eff0-4623-852e-93d4e7d54f7e"
              assistant-id="94338a77-21c7-49d4-b2c6-d3c23a9f6ee7"
              mode="chat"
              theme="dark"
              size="compact"
              radius="large"
              base-color="#2a2118"
              accent-color="#c9a96e"
              button-base-color="#2a2118"
              button-accent-color="#c9a96e"
              start-on-launch="false"
              empty-chat-message="Hi, I'm Jessica, your concierge at Andreas Hotel &amp; Spa. How can I help you today?"
            />
          </div>
        </div>

        <style dangerouslySetInnerHTML={{ __html: `
          /* ── Hover-expand container ── */
          .vapi-hover-container {
            position: fixed;
            bottom: 28px;
            right: 28px;
            z-index: 9999;
            display: flex;
            flex-direction: column;
            align-items: flex-end;
          }

          /* Trigger dot — tiny, always visible */
          .vapi-hover-trigger {
            width: 14px;
            height: 14px;
            border-radius: 50%;
            background: #c9a96e;
            box-shadow:
              0 0 12px rgba(201, 169, 110, 0.45),
              0 2px 8px rgba(0, 0, 0, 0.3);
            cursor: pointer;
            position: relative;
            z-index: 2;
            transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1),
                        height 0.3s cubic-bezier(0.4, 0, 0.2, 1),
                        border-radius 0.3s ease,
                        box-shadow 0.3s ease,
                        background 0.3s ease;
            flex-shrink: 0;
          }

          .vapi-hover-text {
            position: absolute;
            white-space: nowrap;
            right: calc(100% + 12px);
            top: 50%;
            transform: translateY(-50%);
            font-family: ui-serif, Georgia, serif;
            font-size: 13px;
            color: #fff;
            background: rgba(42, 33, 24, 0.92);
            backdrop-filter: blur(4px);
            padding: 6px 14px;
            border-radius: 20px;
            border: 1px solid rgba(201, 169, 110, 0.3);
            opacity: 0;
            pointer-events: none;
            transition: opacity 0.25s ease, transform 0.25s ease;
          }

          /* Chat panel — collapsed by default, expands on hover */
          .vapi-hover-panel {
            position: absolute;
            bottom: 26px;
            right: 0;
            width: 380px;
            height: 620px;
            max-height: 75vh;
            max-width: calc(100vw - 40px);
            border-radius: 16px;
            overflow: hidden;
            opacity: 0;
            transform: scale(0.1);
            transform-origin: bottom right;
            transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1),
                        opacity 0.3s ease;
            pointer-events: none;
            box-shadow:
              0 8px 40px rgba(0, 0, 0, 0.5),
              0 2px 12px rgba(0, 0, 0, 0.3);
            border: 1px solid rgba(201, 169, 110, 0.3);
          }

          .vapi-hover-panel vapi-widget {
            width: 100%;
            height: 100%;
            display: block;
          }

          /* On container hover → expand the dot + text + panel */
          .vapi-hover-container:hover .vapi-hover-trigger {
            width: 120px;
            height: 32px;
            border-radius: 16px;
            background: #2a2118;
            border: 1px solid rgba(201, 169, 110, 0.4);
            box-shadow:
              0 0 20px rgba(201, 169, 110, 0.35),
              0 4px 16px rgba(0, 0, 0, 0.4);
          }

          .vapi-hover-container:hover .vapi-hover-text {
            opacity: 1;
          }

          .vapi-hover-container:hover .vapi-hover-panel {
            opacity: 1;
            transform: scale(1);
            pointer-events: auto;
          }

          /* Keep the chat panel open when hovering over the panel itself */
          .vapi-hover-panel:hover {
            opacity: 1;
            transform: scale(1);
            pointer-events: auto;
          }

          /* Mobile: click toggle + maintain text visible on expanded dot */
          @media (pointer: coarse) {
            .vapi-hover-panel {
              transition: opacity 0.25s ease, transform 0.25s ease;
            }
            .vapi-hover-panel.open {
              opacity: 1;
              transform: scale(1);
              pointer-events: auto;
            }
            .vapi-hover-trigger {
              cursor: pointer;
              -webkit-tap-highlight-color: transparent;
            }
            .vapi-hover-trigger.expanded {
              width: 120px;
              height: 32px;
              border-radius: 16px;
              background: #2a2118;
              border: 1px solid rgba(201, 169, 110, 0.4);
            }
            .vapi-hover-trigger.expanded + .vapi-hover-text,
            .vapi-hover-trigger.expanded .vapi-hover-text {
              opacity: 1;
            }
          }

          @media (max-width: 480px) {
            .vapi-hover-container {
              bottom: 20px;
              right: 16px;
            }
            .vapi-hover-trigger {
              width: 12px;
              height: 12px;
            }
            .vapi-hover-panel {
              bottom: 22px;
              width: calc(100vw - 32px);
              height: 60vh;
              border-radius: 12px;
            }
          }
        `}} />

        <Script
          src="https://unpkg.com/@vapi-ai/client-sdk-react/dist/embed/widget.umd.js"
          strategy="afterInteractive"
        />

        {/* Mobile: click-to-toggle handler */}
        <script dangerouslySetInnerHTML={{ __html: `
          (function(){
            var container = document.querySelector('.vapi-hover-container');
            if (!container || matchMedia('(hover: hover)').matches) return;
            var trigger = container.querySelector('.vapi-hover-trigger');
            var panel = container.querySelector('.vapi-hover-panel');
            if (!trigger || !panel) return;
            trigger.addEventListener('click', function(e) {
              e.stopPropagation();
              var isOpen = panel.classList.contains('open');
              panel.classList.toggle('open', !isOpen);
              trigger.classList.toggle('expanded', !isOpen);
            });
            // Close on click outside
            document.addEventListener('click', function(e) {
              if (!container.contains(e.target)) {
                panel.classList.remove('open');
                trigger.classList.remove('expanded');
              }
            });
          })();
        `}} />
      </body>
    </html>
  );
}
