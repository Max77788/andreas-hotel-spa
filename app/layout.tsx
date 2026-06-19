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

        {/* Foldable Vapi widget — collapsed pill at bottom-right, expands on hover */}
        <div className="vapi-foldable">
          {/* Inline trigger pill — visible when collapsed */}
          <div className="vapi-foldable-trigger">
            <span className="vapi-foldable-dot" />
            <span className="vapi-foldable-label">Talk with Jessica</span>
            <span className="vapi-foldable-close">✕</span>
          </div>
          {/* Chat panel — revealed on hover */}
          <div className="vapi-foldable-panel">
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
              empty-chat-message="Hi, I'm Jessica, your concierge at Andreas Hotel &amp; Spa. How can I help you today?"
              style={{ width: "100%", height: "100%", display: "block" }}
            />
          </div>
        </div>

        <style dangerouslySetInnerHTML={{ __html: `
          .vapi-foldable {
            position: fixed;
            bottom: 28px;
            right: 28px;
            z-index: 9999;
            display: flex;
            flex-direction: column;
            align-items: flex-end;
            gap: 8px;
          }

          .vapi-foldable-trigger {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            background: #2a2118;
            color: #c9a96e;
            font-size: 14px;
            font-weight: 600;
            padding: 11px 20px;
            border-radius: 999px;
            border: 2px solid rgba(201, 169, 110, 0.5);
            box-shadow:
              0 0 18px rgba(201, 169, 110, 0.35),
              0 0 50px rgba(201, 169, 110, 0.15),
              0 4px 16px rgba(0, 0, 0, 0.4);
            animation: vapi-pill-glow 2.5s ease-in-out infinite;
            cursor: pointer;
            transition: all 0.2s ease;
            z-index: 2;
            position: relative;
          }

          .vapi-foldable-trigger:hover {
            border-color: #c9a96e;
            box-shadow:
              0 0 28px rgba(201, 169, 110, 0.55),
              0 0 70px rgba(201, 169, 110, 0.25),
              0 6px 24px rgba(0, 0, 0, 0.5);
            transform: scale(1.03);
          }

          .vapi-foldable-dot {
            width: 10px;
            height: 10px;
            border-radius: 50%;
            background: #c9a96e;
            box-shadow: 0 0 8px #c9a96e;
            flex-shrink: 0;
          }

          .vapi-foldable-label {
            max-width: 0;
            overflow: hidden;
            white-space: nowrap;
            transition: max-width 0.3s ease;
            display: inline-block;
          }

          .vapi-foldable-trigger:hover .vapi-foldable-label,
          .vapi-foldable:hover .vapi-foldable-label {
            max-width: 160px;
          }

          .vapi-foldable-close {
            display: none;
            font-size: 14px;
            opacity: 0.6;
            transition: opacity 0.2s;
          }
          .vapi-foldable-close:hover { opacity: 1; }

          .vapi-foldable-panel {
            position: absolute;
            bottom: 64px;
            right: 0;
            width: 400px;
            height: 600px;
            max-height: calc(100vh - 120px);
            background: #1a1510;
            border: 1px solid rgba(201, 169, 110, 0.2);
            border-radius: 12px;
            overflow: hidden;
            box-shadow:
              0 0 30px rgba(0, 0, 0, 0.6),
              0 8px 32px rgba(0, 0, 0, 0.5);
            opacity: 0;
            visibility: hidden;
            transform: translateY(12px) scale(0.96);
            transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
            pointer-events: none;
          }

          .vapi-foldable:hover .vapi-foldable-panel {
            opacity: 1;
            visibility: visible;
            transform: translateY(0) scale(1);
            pointer-events: auto;
          }

          .vapi-foldable-opened .vapi-foldable-panel {
            opacity: 1;
            visibility: visible;
            transform: translateY(0) scale(1);
            pointer-events: auto;
          }

          .vapi-foldable-opened .vapi-foldable-trigger {
            opacity: 0;
            pointer-events: none;
          }

          @keyframes vapi-pill-glow {
            0%, 100% {
              box-shadow:
                0 0 18px rgba(201, 169, 110, 0.35),
                0 0 50px rgba(201, 169, 110, 0.15),
                0 4px 16px rgba(0, 0, 0, 0.4);
            }
            50% {
              box-shadow:
                0 0 26px rgba(201, 169, 110, 0.55),
                0 0 70px rgba(201, 169, 110, 0.25),
                0 4px 16px rgba(0, 0, 0, 0.4);
            }
          }

          @media (max-width: 480px) {
            .vapi-foldable {
              right: 20px;
              bottom: 24px;
            }
            .vapi-foldable-trigger {
              padding: 10px 16px;
              font-size: 13px;
            }
            .vapi-foldable-panel {
              width: calc(100vw - 40px);
              right: -12px;
            }
          }
        `}} />

        <Script
          src="https://unpkg.com/@vapi-ai/client-sdk-react/dist/embed/widget.umd.js"
          strategy="afterInteractive"
        />

        {/* Detect chat-open state from Vapi shadow DOM */}
        <script dangerouslySetInnerHTML={{ __html: `
          (function(){
            var findHost = setInterval(function(){
              var host = document.querySelector('.vapi-foldable-panel vapi-widget, vapi-widget');
              if (!host) return;
              // Try the foldable one first
              var foldableHost = document.querySelector('.vapi-foldable-panel vapi-widget');
              if (!foldableHost) foldableHost = host;
              if (!foldableHost.shadowRoot) return;
              clearInterval(findHost);
              var wrapper = document.querySelector('.vapi-foldable');
              var obs = new MutationObserver(function(){
                var panel = foldableHost.shadowRoot.querySelector('[class*="chat"],[class*="panel"],[class*="body"],[class*="conversation"]');
                if (panel && panel.offsetHeight > 40) {
                  wrapper && wrapper.classList.add('vapi-foldable-opened');
                } else {
                  wrapper && wrapper.classList.remove('vapi-foldable-opened');
                }
              });
              obs.observe(foldableHost.shadowRoot, {childList:true, subtree:true, attributes:true});
            }, 300);
          })();
        `}} />
      </body>
    </html>
  );
}
