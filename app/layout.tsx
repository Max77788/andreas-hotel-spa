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
        <div className="vapi-wrapper">
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
          <script dangerouslySetInnerHTML={{__html: `
            (function(){
              var w = document.querySelector('.vapi-widget-floating');
              if (w && window.innerWidth <= 410) {
                w.setAttribute('size', 'tiny');
              }
            })();
          `}} />
          <Script
            src="https://unpkg.com/@vapi-ai/client-sdk-react/dist/embed/widget.umd.js"
            strategy="afterInteractive"
          />
        </div>
        <style dangerouslySetInnerHTML={{__html: `
          .vapi-wrapper {
            z-index: 9999;
            --user-message-color: #000000;
            --vapi-user-message-color: #000000;
            transition: opacity 0.25s ease, transform 0.25s ease;
          }
          /* Collapse on hover — bubble shrinks and fades so it doesn't block UI */
          .vapi-wrapper:not(.vapi-expanded):hover {
            opacity: 0.18;
          }
          .vapi-wrapper:not(.vapi-expanded):hover vapi-widget {
            pointer-events: none;
          }
          vapi-widget {
            --user-message-color: #000000;
            --vapi-user-message-color: #000000;
          }
          vapi-widget::part(user-message) {
            color: #000000 !important;
          }
        `}} />
        <script dangerouslySetInnerHTML={{__html: `
          (function(){
            var observer = new MutationObserver(function(){
              var host = document.querySelector('vapi-widget');
              if (host && host.shadowRoot) {
                var style = document.createElement('style');
                style.id = 'hermes-user-color';
                style.textContent = '.user-message, [class*="user"], [data-role="user-message"] { color: #000000 !important; }';
                host.shadowRoot.appendChild(style);
                observer.disconnect();
                // Inject minimize toggle after chat panel appears
                setTimeout(injectMinimizeToggle, 1000);
                // Watch for chat panel open/close to toggle hover-collapse
                setTimeout(watchPanelState, 500);
              }
            });
            observer.observe(document.body, {childList: true, subtree: true});
            setTimeout(function(){
              var host = document.querySelector('vapi-widget');
              if (host && host.shadowRoot) {
                var style = document.createElement('style');
                style.id = 'hermes-user-color-2';
                style.textContent = '.user-message, [class*="user"], [data-role="user-message"] { color: #000000 !important; }';
                host.shadowRoot.appendChild(style);
              }
            }, 2000);

            function watchPanelState() {
              var host = document.querySelector('vapi-widget');
              var wrapper = document.querySelector('.vapi-wrapper');
              if (!host || !host.shadowRoot || !wrapper) { setTimeout(watchPanelState, 500); return; }
              var panelObserver = new MutationObserver(function() {
                // Vapi panel = expanded content area beyond the bubble
                var panel = host.shadowRoot.querySelector('[class*="chat"], [class*="panel"], [class*="expanded"], [class*="body"], [class*="conversation"]');
                var isExpanded = panel && panel.offsetHeight > 50;
                if (isExpanded) {
                  wrapper.classList.add('vapi-expanded');
                } else {
                  wrapper.classList.remove('vapi-expanded');
                }
              });
              panelObserver.observe(host.shadowRoot, {childList: true, subtree: true, attributes: true});
              // Initial check
              var panel = host.shadowRoot.querySelector('[class*="chat"], [class*="panel"], [class*="expanded"], [class*="body"], [class*="conversation"]');
              if (panel && panel.offsetHeight > 50) {
                wrapper.classList.add('vapi-expanded');
              }
            }

            function injectMinimizeToggle() {
              var host = document.querySelector('vapi-widget');
              if (!host || !host.shadowRoot) { setTimeout(injectMinimizeToggle, 500); return; }
              // Already injected?
              if (host.shadowRoot.querySelector('.hermes-minimize-btn')) return;
              // Watch for chat panel to appear
              var chatObserver = new MutationObserver(function() {
                var header = host.shadowRoot.querySelector('[class*="header"], [class*="Header"], [class*="chat-header"], [class*="title-bar"]');
                var closeBtn = host.shadowRoot.querySelector('[class*="close"], [class*="Close"], [aria-label*="close" i], [aria-label*="Close" i]');
                var chatBody = host.shadowRoot.querySelector('[class*="chat"], [class*="body"], [class*="messages"], [class*="conversation"]');
                if (header && !header.querySelector('.hermes-minimize-btn')) {
                  var btn = document.createElement('button');
                  btn.className = 'hermes-minimize-btn';
                  btn.innerHTML = '&#x2014;';
                  btn.title = 'Minimize';
                  btn.style.cssText = 'background:none;border:none;color:#c9a96e;font-size:20px;cursor:pointer;padding:0 8px;line-height:1;opacity:0.7;';
                  btn.addEventListener('click', function(e) {
                    e.stopPropagation();
                    var body = host.shadowRoot.querySelector('[class*="chat"], [class*="body"], [class*="messages"], [class*="conversation"]');
                    var footer = host.shadowRoot.querySelector('[class*="footer"], [class*="input"], [class*="composer"]');
                    var isMinimized = host.getAttribute('data-hermes-minimized') === 'true';
                    if (isMinimized) {
                      // Expand
                      if (body) body.style.display = '';
                      if (footer) footer.style.display = '';
                      btn.innerHTML = '&#x2014;';
                      btn.title = 'Minimize';
                      host.setAttribute('data-hermes-minimized', 'false');
                      host.style.height = '';
                      host.style.maxHeight = '';
                    } else {
                      // Minimize - keep only header
                      if (body) body.style.display = 'none';
                      if (footer) footer.style.display = 'none';
                      btn.innerHTML = '+';
                      btn.title = 'Expand';
                      host.setAttribute('data-hermes-minimized', 'true');
                      host.style.height = 'auto';
                      host.style.maxHeight = '60px';
                    }
                  });
                  // Insert before close button or at end of header
                  if (closeBtn) {
                    closeBtn.parentNode.insertBefore(btn, closeBtn);
                  } else {
                    header.appendChild(btn);
                  }
                  // Also add a header click to expand when minimized
                  header.style.cursor = 'pointer';
                  header.addEventListener('click', function(e) {
                    if (e.target.closest('.hermes-minimize-btn') || e.target.closest('[class*="close"]') || e.target.closest('[aria-label*="close" i]')) return;
                    if (host.getAttribute('data-hermes-minimized') === 'true') {
                      var b = host.shadowRoot.querySelector('.hermes-minimize-btn');
                      if (b) b.click();
                    }
                  });
                  chatObserver.disconnect();
                }
              });
              chatObserver.observe(host.shadowRoot, {childList: true, subtree: true});
            }
          })();
        `}} />
      </body>
    </html>
  );
}
