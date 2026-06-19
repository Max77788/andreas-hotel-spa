"use client";

export default function ChatPill() {
  return (
    <>
      <a
        href="#"
        className="chat-pill"
        onClick={(e) => {
          e.preventDefault();
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
        <span className="chat-pill-text">Talk with Andreas</span>
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
        .chat-pill-text {
          max-width: 0;
          overflow: hidden;
          white-space: nowrap;
          transition: max-width 0.3s ease;
          display: inline-block;
        }
        .chat-pill:hover .chat-pill-text {
          max-width: 160px;
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
        body.chat-open .chat-pill {
          opacity: 0;
          pointer-events: none;
        }
        @media (max-width: 480px) {
          .chat-pill {
            right: 76px;
            bottom: 32px;
            padding: 10px 16px;
            font-size: 13px;
          }
        }
      `}} />

      <script dangerouslySetInnerHTML={{ __html: `
        (function(){
          var findHost = setInterval(function(){
            var host = document.querySelector('vapi-widget');
            if (!host || !host.shadowRoot) return;
            clearInterval(findHost);
            var obs = new MutationObserver(function(){
              var panel = host.shadowRoot.querySelector('[class*="chat"],[class*="panel"],[class*="body"],[class*="conversation"]');
              if (panel && panel.offsetHeight > 40) {
                document.body.classList.add('chat-open');
              } else {
                document.body.classList.remove('chat-open');
              }
            });
            obs.observe(host.shadowRoot, {childList:true, subtree:true, attributes:true});
          }, 300);
        })();
      `}} />
    </>
  );
}
