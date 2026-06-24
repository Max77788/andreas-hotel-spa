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

        {/* Vapi AI Agent — compact circle expands to full chat panel on hover */}
        <div className="vapi-hover-container">
          {/* Trigger circle — always visible */}
          <div className="vapi-hover-trigger">
            <svg className="vapi-hover-icon" viewBox="0 0 24 24" fill="none">
              <rect x="2" y="2" width="20" height="16" rx="3" stroke="currentColor" strokeWidth="1.5" />
              <path d="M8 18v3l5-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="vapi-hover-label">Chat</span>
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

          /* Trigger circle — small, always visible */
          .vapi-hover-trigger {
            width: 56px;
            height: 56px;
            border-radius: 50%;
            background: linear-gradient(135deg, #2a2118 0%, #3d3024 100%);
            border: 2px solid rgba(201, 169, 110, 0.6);
            box-shadow:
              0 0 18px rgba(201, 169, 110, 0.35),
              0 4px 16px rgba(0, 0, 0, 0.4);
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            position: relative;
            z-index: 2;
            transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1),
                        box-shadow 0.3s ease,
                        border-color 0.3s ease;
            flex-shrink: 0;
          }

          .vapi-hover-icon {
            width: 22px;
            height: 22px;
            color: #c9a96e;
            transition: transform 0.3s ease;
          }

          .vapi-hover-label {
            font-size: 8px;
            font-weight: 700;
            color: #c9a96e;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-top: 1px;
            transition: opacity 0.2s ease;
          }

          /* Chat panel — collapsed by default, expands on hover */
          .vapi-hover-panel {
            position: absolute;
            bottom: 64px;
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

          /* On container hover → expand the panel + glow the trigger */
          .vapi-hover-container:hover .vapi-hover-panel {
            opacity: 1;
            transform: scale(1);
            pointer-events: auto;
          }

          .vapi-hover-container:hover .vapi-hover-trigger {
            transform: scale(1.1);
            border-color: #c9a96e;
            box-shadow:
              0 0 28px rgba(201, 169, 110, 0.55),
              0 6px 24px rgba(0, 0, 0, 0.5);
          }

          .vapi-hover-container:hover .vapi-hover-icon {
            transform: scale(1.1);
          }

          /* Keep the chat panel open when hovering over the panel itself */
          .vapi-hover-panel:hover {
            opacity: 1;
            transform: scale(1);
            pointer-events: auto;
          }

          /* Mobile: use click toggle instead of hover */
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
          }

          @media (max-width: 480px) {
            .vapi-hover-container {
              bottom: 20px;
              right: 16px;
            }
            .vapi-hover-trigger {
              width: 48px;
              height: 48px;
            }
            .vapi-hover-icon {
              width: 18px;
              height: 18px;
            }
            .vapi-hover-label {
              font-size: 7px;
            }
            .vapi-hover-panel {
              bottom: 56px;
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
            });
            // Close on click outside
            document.addEventListener('click', function(e) {
              if (!container.contains(e.target)) {
                panel.classList.remove('open');
              }
            });
          })();
        `}} />
      </body>
    </html>
  );
}
