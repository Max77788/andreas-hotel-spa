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
        <style dangerouslySetInnerHTML={{__html: `
          /* Chat bubble always visible with warm glow */
          vapi-widget::part(button) {
            box-shadow: 0 0 24px rgba(201,169,110,0.5), 0 0 60px rgba(201,169,110,0.25) !important;
            animation: vapi-pulse 2.5s ease-in-out infinite;
          }
          @keyframes vapi-pulse {
            0%, 100% { box-shadow: 0 0 24px rgba(201,169,110,0.5), 0 0 60px rgba(201,169,110,0.25); }
            50% { box-shadow: 0 0 36px rgba(201,169,110,0.7), 0 0 80px rgba(201,169,110,0.35); }
          }
          vapi-widget::part(button):hover {
            animation: none;
            box-shadow: 0 0 40px rgba(201,169,110,0.75), 0 0 90px rgba(201,169,110,0.4) !important;
            transform: scale(1.08) !important;
          }
        `}} />

        {/* JS: tiny-screen compact, hover label, minimize toggle */}
        <script dangerouslySetInnerHTML={{__html: `
          (function(){
            // ── Tiny screen → extra compact ──
            var w = document.querySelector('.vapi-widget-floating');
            if (w && window.innerWidth <= 410) {
              w.setAttribute('size', 'tiny');
            }

            // ── Hover label: inject a fixed-position pill next to the bubble ──
            var label = document.createElement('div');
            label.id = 'vapi-hover-label';
            label.textContent = 'Talk with Andreas';
            label.style.cssText = [
              'position:fixed','bottom:38px','right:90px','z-index:9998',
              'background:#2a2118','color:#c9a96e','font-size:14px','font-weight:600',
              'padding:10px 18px','border-radius:999px',
              'border:1px solid rgba(201,169,110,0.35)',
              'box-shadow:0 4px 20px rgba(0,0,0,0.35)',
              'opacity:0','pointer-events:none',
              'transition:opacity 0.2s ease,transform 0.2s ease',
              'transform:translateX(8px)'
            ].join(';');
            document.body.appendChild(label);

            // ── Show/hide label based on chat expanded state ──
            var showTimer = null;
            function showLabel(){
              clearTimeout(showTimer);
              var host = document.querySelector('vapi-widget');
              var expanded = host && host.getAttribute('data-hermes-minimized') !== 'true' &&
                host.shadowRoot && host.shadowRoot.querySelector('[class*="chat"]') &&
                host.shadowRoot.querySelector('[class*="chat"]').offsetHeight > 50;
              if (expanded) return; // don't show label when chat is open
              label.style.opacity = '1';
              label.style.transform = 'translateX(0)';
            }
            function hideLabel(){
              showTimer = setTimeout(function(){
                label.style.opacity = '0';
                label.style.transform = 'translateX(8px)';
              }, 300);
            }

            // ── Track mouse near the button area ──
            var isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
            var zone = document.createElement('div');
            zone.style.cssText = 'position:fixed;bottom:0;right:0;width:200px;height:120px;z-index:9997;pointer-events:none';
            document.body.appendChild(zone);

            // Mobile: always show the label (no hover on touch devices)
            if (isTouch) {
              label.style.opacity = '1';
              label.style.transform = 'translateX(0)';
              // Auto-hide after 5 seconds on mobile, then pulse back every 15s
              setInterval(function(){
                label.style.opacity = '1';
                label.style.transform = 'translateX(0)';
                setTimeout(function(){ label.style.opacity = '0.5'; }, 5000);
              }, 15000);
            } else {
              document.addEventListener('mousemove', function(e){
                var winW = window.innerWidth;
                var winH = window.innerHeight;
                if (winW - e.clientX < 220 && winH - e.clientY < 140) {
                  showLabel();
                } else {
                  hideLabel();
                }
              });
            }

            // ── Hide label when chat is open ──
            var hostObserver = new MutationObserver(function(){
              var host = document.querySelector('vapi-widget');
              if (!host || !host.shadowRoot) return;
              var panel = host.shadowRoot.querySelector('[class*="chat"], [class*="panel"], [class*="body"], [class*="conversation"]');
              if (panel && panel.offsetHeight > 50) {
                label.style.opacity = '0';
              }
            });

            var findHost = setInterval(function(){
              var host = document.querySelector('vapi-widget');
              if (host && host.shadowRoot) {
                clearInterval(findHost);
                hostObserver.observe(host.shadowRoot, {childList:true, subtree:true, attributes:true});
              }
            }, 300);

            // ── Minimize toggle button in chat header ──
            function injectMinimizeToggle(){
              var host = document.querySelector('vapi-widget');
              if (!host || !host.shadowRoot) { setTimeout(injectMinimizeToggle, 500); return; }
              if (host.shadowRoot.querySelector('.hermes-minimize-btn')) return;

              var chatObserver = new MutationObserver(function(){
                var header = host.shadowRoot.querySelector('[class*="header"],[class*="Header"],[class*="chat-header"],[class*="title-bar"]');
                var closeBtn = host.shadowRoot.querySelector('[class*="close"],[class*="Close"],[aria-label*="close" i]');
                if (header && !header.querySelector('.hermes-minimize-btn')) {
                  var btn = document.createElement('button');
                  btn.className = 'hermes-minimize-btn';
                  btn.innerHTML = '—';
                  btn.title = 'Minimize';
                  btn.style.cssText = 'background:none;border:none;color:#c9a96e;font-size:20px;cursor:pointer;padding:0 8px;line-height:1;opacity:0.7';
                  btn.addEventListener('click', function(e){
                    e.stopPropagation();
                    var body = host.shadowRoot.querySelector('[class*="chat"],[class*="body"],[class*="messages"],[class*="conversation"]');
                    var footer = host.shadowRoot.querySelector('[class*="footer"],[class*="input"],[class*="composer"]');
                    var min = host.getAttribute('data-hermes-minimized') === 'true';
                    if (min) {
                      if (body) body.style.display = '';
                      if (footer) footer.style.display = '';
                      btn.innerHTML = '—'; btn.title = 'Minimize';
                      host.setAttribute('data-hermes-minimized','false');
                      host.style.height = ''; host.style.maxHeight = '';
                    } else {
                      if (body) body.style.display = 'none';
                      if (footer) footer.style.display = 'none';
                      btn.innerHTML = '+'; btn.title = 'Expand';
                      host.setAttribute('data-hermes-minimized','true');
                      host.style.height = 'auto'; host.style.maxHeight = '60px';
                    }
                  });
                  if (closeBtn) closeBtn.parentNode.insertBefore(btn, closeBtn);
                  else header.appendChild(btn);
                  header.style.cursor = 'pointer';
                  header.addEventListener('click', function(e){
                    if (e.target.closest('.hermes-minimize-btn')||e.target.closest('[class*="close"]')||e.target.closest('[aria-label*="close" i]')) return;
                    if (host.getAttribute('data-hermes-minimized')==='true'){
                      var b = host.shadowRoot.querySelector('.hermes-minimize-btn');
                      if (b) b.click();
                    }
                  });
                  chatObserver.disconnect();
                }
              });
              chatObserver.observe(host.shadowRoot, {childList:true, subtree:true});
            }

            setTimeout(injectMinimizeToggle, 1000);
          })();
        `}} />
      </body>
    </html>
  );
}
