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

        {/* Custom AI chat pill — compact circle, extends on hover to reveal label */}
        <div className="vapi-pill">
          <span className="vapi-pill-dots"><i></i><i></i><i></i><i></i></span>
          <span className="vapi-pill-text">Chat with Jessica</span>
          <span className="vapi-pill-toggle"><span className="vapi-pill-toggle-dot" /></span>
        </div>

        <style dangerouslySetInnerHTML={{ __html: `
          /* Hide Vapi's own launcher button — we use our pill instead */
          vapi-widget.vapi-floating-host {
            --vapi-launcher-display: none;
          }

          /* Our custom pill — compact by default, extends on hover */
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
            padding: 11px 12px;
            border-radius: 999px;
            border: 2px solid rgba(201, 169, 110, 0.5);
            box-shadow:
              0 0 18px rgba(201, 169, 110, 0.35),
              0 0 50px rgba(201, 169, 110, 0.15),
              0 4px 16px rgba(0, 0, 0, 0.4);
            animation: vapi-pill-glow 2.5s ease-in-out infinite;
            cursor: pointer;
            width: 58px;
            overflow: hidden;
            transition: width 0.4s cubic-bezier(0.4, 0, 0.2, 1),
                        box-shadow 0.25s ease,
                        border-color 0.25s ease;
          }

          .vapi-pill:hover {
            width: 238px;
            border-color: #c9a96e;
            box-shadow:
              0 0 28px rgba(201, 169, 110, 0.55),
              0 0 70px rgba(201, 169, 110, 0.25),
              0 6px 24px rgba(0, 0, 0, 0.5);
          }

          .vapi-pill-dots {
            display: flex;
            align-items: center;
            gap: 3px;
            flex-shrink: 0;
            height: 18px;
          }
          .vapi-pill-dots i {
            display: block;
            border-radius: 50%;
            flex-shrink: 0;
          }
          .vapi-pill-dots i:nth-child(1) { width: 8px; height: 8px; background: #a0a0a0; }
          .vapi-pill-dots i:nth-child(2) { width: 5px; height: 5px; background: #777; }
          .vapi-pill-dots i:nth-child(3) { width: 5px; height: 5px; background: #8b5e3c; }
          .vapi-pill-dots i:nth-child(4) { width: 6px; height: 6px; background: #8b6b4a; }

          .vapi-pill-text {
            color: #fff;
            font-size: 14px;
            font-weight: 600;
            text-shadow: 0 1px 2px rgba(0,0,0,0.5);
            user-select: none;
            white-space: nowrap;
            opacity: 0;
            transition: opacity 0.3s ease 0.05s;
          }
          .vapi-pill:hover .vapi-pill-text {
            opacity: 1;
            transition: opacity 0.35s ease 0.18s;
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
              right: 16px;
              bottom: 20px;
              padding: 10px 10px;
              font-size: 13px;
              gap: 6px;
              width: 50px;
            }
            .vapi-pill:hover {
              width: 208px;
            }
            .vapi-pill-text {
              font-size: 13px;
            }
            .vapi-pill-dots i:nth-child(1) { width: 7px; height: 7px; }
            .vapi-pill-dots i:nth-child(2) { width: 4px; height: 4px; }
            .vapi-pill-dots i:nth-child(3) { width: 4px; height: 4px; }
            .vapi-pill-dots i:nth-child(4) { width: 5px; height: 5px; }
            .vapi-pill-toggle {
              width: 20px;
              height: 20px;
            }
            .vapi-pill-toggle-dot {
              width: 9px;
              height: 9px;
            }
          }

          /* Ensure pill stays above mobile nav overlay (z-[100] = 100) */
          @media (max-width: 768px) {
            .vapi-pill {
              z-index: 9999;
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
            if (!pill) return;

            var attempts = 0;
            var MAX_ATTEMPTS = 50; // 10 seconds

            var findHost = setInterval(function(){
              var host = document.querySelector('vapi-widget.vapi-floating-host');
              if (!host || !host.shadowRoot) {
                attempts++;
                if (attempts > MAX_ATTEMPTS) {
                  clearInterval(findHost);
                  // Fallback: show pill as static, Vapi didn't load
                  pill.style.opacity = '0.5';
                  pill.style.pointerEvents = 'none';
                }
                return;
              }
              clearInterval(findHost);

              // ── Hide Vapi's own launcher button (aggressive, multiple strategies) ──
              function hideVapiButton(){
                var selectors = [
                  'button',
                  '[role="button"]',
                  '[class*="button"]',
                  '[class*="launcher"]',
                  '[class*="toggle"]',
                  '[class*="trigger"]',
                  '[class*="fab"]',
                ];
                selectors.forEach(function(sel){
                  try {
                    var els = host.shadowRoot.querySelectorAll(sel);
                    els.forEach(function(el){ el.style.display = 'none'; });
                  } catch(e){}
                });
              }
              hideVapiButton();

              // ── Click Vapi's hidden launcher when our pill is clicked ──
              pill.addEventListener('click', function(e){
                e.preventDefault();
                // Try to find and click Vapi's hidden button
                var selectors = ['button', '[role="button"]'];
                for (var i = 0; i < selectors.length; i++){
                  try {
                    var btn = host.shadowRoot.querySelector(selectors[i]);
                    if (btn && btn.offsetParent !== null){
                      btn.click();
                      return;
                    }
                  } catch(e){}
                }
                // Fallback: try any clickable element
                try {
                  var any = host.shadowRoot.querySelector('*');
                  if (any) any.click();
                } catch(e){}
              });

              // ── Detect chat-open state from shadow DOM ──
              var obs = new MutationObserver(function(){
                var isOpen = false;
                try {
                  var panels = host.shadowRoot.querySelectorAll('[class*="chat"],[class*="panel"],[class*="body"],[class*="conversation"],[class*="messages"],[class*="content"],[class*="window"]');
                  panels.forEach(function(p){
                    if (p.offsetHeight > 60) isOpen = true;
                  });
                } catch(e){}
                if (isOpen) {
                  document.body.classList.add('vapi-chat-open');
                } else {
                  document.body.classList.remove('vapi-chat-open');
                }
                // Re-hide button on any DOM mutation
                setTimeout(hideVapiButton, 100);
              });
              try {
                obs.observe(host.shadowRoot, {childList:true, subtree:true, attributes:true});
              } catch(e){}

              // ── Also try hiding via CSS custom property ──
              try {
                var style = document.createElement('style');
                style.textContent = 'button, [role="button"], [class*="launcher"], [class*="fab"] { display: none !important; }';
                host.shadowRoot.appendChild(style);
              } catch(e){}

            }, 200);
          })();
        `}} />
      </body>
    </html>
  );
}
