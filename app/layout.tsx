import "./globals.css";
import type { Metadata } from "next";
import Script from "next/script";
import { ThemeProvider } from "next-themes";

export const metadata: Metadata = {
  title: "The Andreas Hotel & Spa – Palm Springs, CA",
  description:
    "Ideally located in the heart of downtown Palm Springs, the Andreas Hotel & Spa brings modern style to a classic setting. Originally built in 1935, enjoy 25 luxurious guest rooms and suites, a full-service spa, and stunning pool courtyard.",
  icons: {
    icon: "/favicon.png",
  },
  openGraph: {
    title: "The Andreas Hotel & Spa – Palm Springs, CA",
    description:
      "A boutique adults-only hotel in downtown Palm Springs featuring 25 luxurious rooms, a full-service spa, heated pool, and courtyard fireplaces. Established 1935.",
    url: "https://andreashotel.com",
    siteName: "The Andreas Hotel & Spa",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
        {/* Vapi AI Chatbot Widget */}
        <div id="vapi-container" style={{position:"fixed" as const, bottom:16, right:16, zIndex:50}}>
          <Script
            src="https://unpkg.com/@vapi-ai/client-sdk-react/dist/embed/widget.umd.js"
            strategy="afterInteractive"
          />
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
          />
          <Script id="vapi-mobile-fix" strategy="lazyOnload">
            {`
              (function() {
                if (window.innerWidth > 768) return;
                var style = document.createElement('style');
                style.textContent = '
                  vapi-widget::part(chat-panel) { max-height: calc(100dvh - 60px) !important; max-width: 100vw !important; border-radius: 12px 12px 0 0 !important; }
                  @media (max-width: 768px) { vapi-widget { --vapi-max-height: calc(100dvh - 60px); } }
                ';
                document.head.appendChild(style);
                // Also try to constrain any iframe the widget creates
                var observer = new MutationObserver(function() {
                  var panels = document.querySelectorAll('[class*="vapi"], [class*="chat-panel"], vapi-widget iframe');
                  panels.forEach(function(el) {
                    if (el.tagName === 'IFRAME') {
                      var doc = el.contentDocument || el.contentWindow?.document;
                      if (doc) {
                        doc.documentElement.style.setProperty('max-height', 'calc(100dvh - 60px)', 'important');
                      }
                    }
                    el.style.setProperty('max-height', 'calc(100dvh - 60px)', 'important');
                    el.style.setProperty('max-width', '100vw', 'important');
                  });
                });
                observer.observe(document.body, { childList: true, subtree: true, attributes: true });
              })();
            `}
          </Script>
        </div>
      </body>
    </html>
  );
}
