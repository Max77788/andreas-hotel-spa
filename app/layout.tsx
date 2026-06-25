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

        {/* Vapi AI Agent — expands on hover */}
        <div className="vapi-hover-container">
          <div className="vapi-hover-trigger">
            <svg class="vapi-dot-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="3" fill="currentColor"/>
              <path d="M12 9v3l2 2"/>
            </svg>
            <span className="vapi-dot-label">Chat with Jessica</span>
          </div>
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
              start-on-launch="true"
              empty-chat-message="Hi, I'm Jessica, your concierge at Andreas Hotel &amp; Spa. How can I help you today?"
            />
          </div>
        </div>

        <style dangerouslySetInnerHTML={{ __html: `
          /* ── Hover-expand widget ── */
          .vapi-hover-container {
            position: fixed;
            bottom: 28px;
            right: 28px;
            z-index: 9999;
            display: flex;
            flex-direction: column;
            align-items: flex-end;
          }

          /* Trigger — tiny dot by default, expands to pill on hover */
          .vapi-hover-trigger {
            width: 42px;
            height: 42px;
            border-radius: 50%;
            background: linear-gradient(135deg, #2a2118 0%, #3d3024 100%);
            border: 1.5px solid rgba(201, 169, 110, 0.5);
            box-shadow:
              0 0 14px rgba(201, 169, 110, 0.3),
              0 4px 12px rgba(0, 0, 0, 0.35);
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            position: relative;
            z-index: 2;
            transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1),
                        height 0.3s cubic-bezier(0.4, 0, 0.2, 1),
                        border-radius 0.3s ease,
                        box-shadow 0.3s ease,
                        gap 0.3s ease,
                        padding 0.3s ease;
            flex-shrink: 0;
            gap: 0;
            padding: 0;
          }

          .vapi-dot-icon {
            width: 18px;
            height: 18px;
            color: #c9a96e;
            flex-shrink: 0;
            transition: transform 0.3s ease;
            animation: vapi-pulse 3s ease-in-out infinite;
          }

          @keyframes vapi-pulse {
            0%, 100% { opacity: 0.7; transform: scale(1); }
            50% { opacity: 1; transform: scale(1.08); }
          }

          .vapi-dot-label {
            white-space: nowrap;
            font-family: ui-serif, Georgia, serif;
            font-size: 14px;
            color: #c9a96e;
            opacity: 0;
            max-width: 0;
            overflow: hidden;
            transition: opacity 0.25s ease, max-width 0.3s ease;
          }

          /* Chat panel — collapsed by default */
          .vapi-hover-panel {
            position: absolute;
            bottom: 50px;
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

          /* On hover: dot → pill, panel expands */
          .vapi-hover-container:hover .vapi-hover-trigger {
            width: auto;
            height: 42px;
            border-radius: 21px;
            gap: 8px;
            padding: 0 18px 0 14px;
            border-color: rgba(201, 169, 110, 0.6);
            box-shadow:
              0 0 24px rgba(201, 169, 110, 0.4),
              0 6px 20px rgba(0, 0, 0, 0.4);
          }

          .vapi-hover-container:hover .vapi-dot-icon {
            animation: none;
            transform: scale(1);
          }

          .vapi-hover-container:hover .vapi-dot-label {
            opacity: 1;
            max-width: 150px;
          }

          .vapi-hover-container:hover .vapi-hover-panel {
            opacity: 1;
            transform: scale(1);
            pointer-events: auto;
          }

          /* Keep panel open when hovering it */
          .vapi-hover-panel:hover {
            opacity: 1;
            transform: scale(1);
            pointer-events: auto;
          }

          /* Mobile: click toggle */
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
              -webkit-tap-highlight-color: transparent;
            }
            .vapi-hover-trigger.expanded {
              width: auto;
              height: 42px;
              border-radius: 21px;
              gap: 8px;
              padding: 0 18px 0 14px;
              border-color: rgba(201, 169, 110, 0.6);
              box-shadow:
                0 0 24px rgba(201, 169, 110, 0.4),
                0 6px 20px rgba(0, 0, 0, 0.4);
            }
            .vapi-hover-trigger.expanded .vapi-dot-label {
              opacity: 1;
              max-width: 150px;
            }
            .vapi-hover-trigger.expanded .vapi-dot-icon {
              animation: none;
            }
          }

          @media (max-width: 480px) {
            .vapi-hover-container {
              bottom: 20px;
              right: 16px;
            }
            .vapi-hover-trigger {
              width: 36px;
              height: 36px;
            }
            .vapi-dot-icon {
              width: 15px;
              height: 15px;
            }
            .vapi-hover-panel {
              bottom: 44px;
              width: calc(100vw - 32px);
              height: 60vh;
              border-radius: 12px;
            }
            .vapi-hover-container:hover .vapi-hover-trigger,
            .vapi-hover-trigger.expanded {
              height: 36px;
              padding: 0 14px 0 10px;
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
