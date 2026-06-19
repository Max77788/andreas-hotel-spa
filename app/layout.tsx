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

        {/* Vapi widget — native floating chat, we hide its button &amp; use our pill */}
        {/* @ts-expect-error custom web component */}
        <vapi-widget
          class="vapi-floating-host"
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
          empty-chat-message="Hi, I'm Jessica, your concierge at Andreas Hotel &amp; Spa. How can I help you today?"
        />

        {/* Our pill — the only visible trigger. Hover expands label; clicks Vapi's hidden launcher. */}
        <div className="vapi-pill">
          <span className="vapi-pill-spinner"><i></i><i></i><i></i><i></i></span>
          <span className="vapi-pill-text">Talk</span>
          <span className="vapi-pill-toggle"><span className="vapi-pill-toggle-dot" /></span>
        </div>

        <style dangerouslySetInnerHTML={{ __html: `
          /* Hide Vapi's own launcher button — we use our pill instead */
          vapi-widget.vapi-floating-host {
            --vapi-launcher-display: none;
          }

          /* Our custom pill */
          .vapi-pill {
            position: fixed;
            bottom: 28px;
            right: 28px;
            z-index: 9999;
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
          }

          .vapi-pill:hover {
            border-color: #c9a96e;
            box-shadow:
              0 0 28px rgba(201, 169, 110, 0.55),
              0 0 70px rgba(201, 169, 110, 0.25),
              0 6px 24px rgba(0, 0, 0, 0.5);
            transform: scale(1.03);
          }

          .vapi-pill-spinner {
            position: relative;
            width: 18px;
            height: 18px;
            flex-shrink: 0;
          }
          .vapi-pill-spinner i {
            position: absolute;
            top: 0; left: 50%;
            width: 3px; height: 3px;
            border-radius: 50%;
            background: #c9a96e;
            transform-origin: 50% 9px;
            animation: vapi-spin 1.2s linear infinite;
            opacity: 0.3;
          }
          .vapi-pill-spinner i:nth-child(2) { animation-delay: 0.3s; opacity: 0.5; }
          .vapi-pill-spinner i:nth-child(3) { animation-delay: 0.6s; opacity: 0.75; }
          .vapi-pill-spinner i:nth-child(4) { animation-delay: 0.9s; opacity: 1; }

          @keyframes vapi-spin {
            0%   { transform: rotate(0deg)   translateY(-8px) rotate(0deg); }
            100% { transform: rotate(360deg) translateY(-8px) rotate(-360deg); }
          }

          .vapi-pill-text {
            color: #c9a96e;
            font-size: 14px;
            font-weight: 600;
            user-select: none;
          }

          .vapi-pill-toggle {
            width: 22px;
            height: 22px;
            border-radius: 50%;
            border: 2px solid #c9a96e;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
            transition: all 0.2s ease;
          }
          .vapi-pill-toggle-dot {
            width: 10px;
            height: 10px;
            border-radius: 50%;
            background: #f0d060;
            box-shadow: 0 0 8px #f0d060, 0 0 20px rgba(240, 208, 96, 0.5);
            transition: all 0.2s ease;
          }
          .vapi-pill:hover .vapi-pill-toggle {
            border-color: #f0d060;
            box-shadow: 0 0 12px rgba(240, 208, 96, 0.4);
          }

          body.vapi-chat-open .vapi-pill {
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
            .vapi-pill {
              right: 20px;
              bottom: 24px;
              padding: 10px 16px;
              font-size: 13px;
            }
          }
        `}} />

        <Script
          src="https://unpkg.com/@vapi-ai/client-sdk-react/dist/embed/widget.umd.js"
          strategy="afterInteractive"
        />

        {/* Pill clicks Vapi's hidden launcher + detects chat-open state */}
        <script dangerouslySetInnerHTML={{ __html: `
          (function(){
            var pill = document.querySelector('.vapi-pill');
            var findHost = setInterval(function(){
              var host = document.querySelector('vapi-widget.vapi-floating-host');
              if (!host || !host.shadowRoot) return;
              clearInterval(findHost);

              // Hide Vapi's own launcher button
              var hideBtn = function(){
                var btn = host.shadowRoot.querySelector('button, [role="button"], [class*="button"], [class*="launcher"], [class*="toggle"]');
                if (btn) btn.style.display = 'none';
              };
              hideBtn();

              // Click Vapi's hidden launcher when our pill is clicked (not hover)
              if (pill) {
                pill.addEventListener('click', function(){
                  var btn = host.shadowRoot.querySelector('button, [role="button"], [class*="button"], [class*="launcher"], [class*="toggle"]');
                  if (btn) {
                    btn.style.display = ''; // unhide momentarily
                    btn.click();
                    btn.style.display = 'none'; // re-hide
                  }
                });
              }

              // Detect chat-open state from shadow DOM
              var obs = new MutationObserver(function(){
                var panel = host.shadowRoot.querySelector('[class*="chat"],[class*="panel"],[class*="body"],[class*="conversation"],[class*="messages"]');
                var isOpen = panel && panel.offsetHeight > 40;
                if (isOpen) {
                  document.body.classList.add('vapi-chat-open');
                } else {
                  document.body.classList.remove('vapi-chat-open');
                }
                // Re-hide button on any DOM change
                setTimeout(hideBtn, 50);
              });
              obs.observe(host.shadowRoot, {childList:true, subtree:true, attributes:true});
            }, 200);
          })();
        `}} />
      </body>
    </html>
  );
}
