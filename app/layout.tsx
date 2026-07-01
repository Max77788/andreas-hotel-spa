import "./globals.css";
import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import VapiCustomChat from "@/components/vapi-custom-chat";
import VapiHoverTrigger from "@/components/vapi-hover-trigger";

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
            <svg className="vapi-dot-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3" fill="currentColor"/>
              <path d="M12 9v3l2 2"/>
            </svg>
            <VapiHoverTrigger />
          </div>
          <div className="vapi-hover-panel">
            <VapiCustomChat
              publicKey="a2166c04-eff0-4623-852e-93d4e7d54f7e"
              assistantId="94338a77-21c7-49d4-b2c6-d3c23a9f6ee7"
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
            bottom: 48px; /* sits flush against trigger (42px) with 6px overlap for mouse transition */
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

          .vapi-hover-panel > div {
            width: 100%;
            height: 100%;
            border-radius: inherit;
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

          /* Keep panel open when sticky (click-to-toggle) */
          .vapi-hover-container[data-sticky] .vapi-hover-panel {
            opacity: 1;
            transform: scale(1);
            pointer-events: auto;
          }
          .vapi-hover-container[data-sticky] .vapi-hover-trigger {
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
          .vapi-hover-container[data-sticky] .vapi-dot-label {
            opacity: 1;
            max-width: 150px;
          }
          .vapi-hover-container[data-sticky] .vapi-dot-icon {
            animation: none;
            transform: scale(1);
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

        {/* Click-to-toggle handler — all devices */}
        <script dangerouslySetInnerHTML={{ __html: `
          (function(){
            var container = document.querySelector('.vapi-hover-container');
            if (!container) return;
            var trigger = container.querySelector('.vapi-hover-trigger');
            var panel = container.querySelector('.vapi-hover-panel');
            if (!trigger || !panel) return;

            function open() {
              panel.classList.add('open');
              trigger.classList.add('expanded');
              container.setAttribute('data-sticky', 'true');
            }
            function close() {
              panel.classList.remove('open');
              trigger.classList.remove('expanded');
              container.removeAttribute('data-sticky');
            }

            trigger.addEventListener('click', function(e) {
              e.stopPropagation();
              if (panel.classList.contains('open')) {
                close();
              } else {
                open();
              }
            });

            document.addEventListener('click', function(e) {
              if (container.getAttribute('data-sticky') && !container.contains(e.target)) {
                close();
              }
            });

            /* Also open on hover — but don't close when sticky */
            container.addEventListener('mouseenter', function() {
              if (!container.getAttribute('data-sticky')) {
                open();
              }
            });
            container.addEventListener('mouseleave', function(e) {
              if (!container.getAttribute('data-sticky')) {
                close();
              }
            });
          })();
        `}} />
      </body>
    </html>
  );
}
