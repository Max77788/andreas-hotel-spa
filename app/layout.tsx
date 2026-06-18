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

        {/* Vapi widget — handles its own positioning at bottom-right */}
        {/* @ts-expect-error custom web component */}
        <vapi-widget
          class="vapi-widget-floating"
          public-key="a2166c04-eff0-4623-852e-93d4e7d54f7e"
          assistant-id="94338a77-21c7-49d4-b2c6-d3c23a9f6ee7"
          mode="chat"
          theme="dark"
          size="compact"
          position="bottom-right"
          radius="large"
          base-color="#2a2118"
          accent-color="#c9a96e"
          button-base-color="#2a2118"
          button-accent-color="#c9a96e"
          title="Talk with Andreas"
          empty-chat-message="Hi, Sam here! How can I help you today?"
        />
        <Script
          src="https://unpkg.com/@vapi-ai/client-sdk-react/dist/embed/widget.umd.js"
          strategy="afterInteractive"
        />

        {/* Permanent floating label — no shadow DOM tricks, just a real DOM element */}
        <a
          href="#"
          className="chat-pill"
          onClick={(e) => {
            e.preventDefault();
            // Click the Vapi bubble button through its shadow DOM
            const w = document.querySelector("vapi-widget") as any;
            if (w?.shadowRoot) {
              const btn = w.shadowRoot.querySelector(
                "button, [role='button'], [class*='button'], [class*='toggle'], [class*='trigger'], [class*='launcher']"
              );
              if (btn) (btn as HTMLElement).click();
            }
          }}
        >
          <span className="chat-pill-dot" />
          Talk with Andreas
        </a>

        <style dangerouslySetInnerHTML={{ __html: `
          .chat-pill {
            position: fixed;
            bottom: 36px;
            right: 84px;
            z-index: 9998;
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
            text-decoration: none;
            box-shadow:
              0 0 18px rgba(201, 169, 110, 0.35),
              0 0 50px rgba(201, 169, 110, 0.15),
              0 4px 16px rgba(0, 0, 0, 0.4);
            animation: pill-glow 2.5s ease-in-out infinite;
            cursor: pointer;
            transition: all 0.2s ease;
          }
          .chat-pill:hover {
            border-color: #c9a96e;
            box-shadow:
              0 0 28px rgba(201, 169, 110, 0.55),
              0 0 70px rgba(201, 169, 110, 0.25),
              0 6px 24px rgba(0, 0, 0, 0.5);
            transform: scale(1.03);
          }
          .chat-pill-dot {
            width: 10px;
            height: 10px;
            border-radius: 50%;
            background: #c9a96e;
            box-shadow: 0 0 8px #c9a96e;
            flex-shrink: 0;
          }
          @keyframes pill-glow {
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
          /* Hide pill when Vapi chat panel is open (JS adds .chat-open to body) */
          body.chat-open .chat-pill {
            opacity: 0;
            pointer-events: none;
          }
          /* Mobile: smaller pill */
          @media (max-width: 480px) {
            .chat-pill {
              right: 76px;
              bottom: 32px;
              padding: 10px 16px;
              font-size: 13px;
            }
          }
        `}} />

        {/* JS: detect when Vapi chat is open/closed, and click-to-open support */}
        <script dangerouslySetInnerHTML={{ __html: `
          (function(){
            var findHost = setInterval(function(){
              var host = document.querySelector('vapi-widget');
              if (!host || !host.shadowRoot) return;
              clearInterval(findHost);

              // Watch for chat panel appearing/disappearing
              var obs = new MutationObserver(function(){
                var panel = host.shadowRoot.querySelector('[class*="chat"],[class*="panel"],[class*="body"],[class*="conversation"]');
                if (panel && panel.offsetHeight > 40) {
                  document.body.classList.add('chat-open');
                } else {
                  document.body.classList.remove('chat-open');
                }
              });
              obs.observe(host.shadowRoot, {childList:true, subtree:true, attributes:true});

              // Initial check
              setTimeout(function(){
                var panel = host.shadowRoot.querySelector('[class*="chat"],[class*="panel"],[class*="body"],[class*="conversation"]');
                if (panel && panel.offsetHeight > 40) {
                  document.body.classList.add('chat-open');
                }
              }, 500);
            }, 300);
          })();
        `}} />
      </body>
    </html>
  );
}
