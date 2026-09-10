"use client";

import { useEffect } from "react";

function track(event_name: string, metadata: Record<string, string> = {}) {
  const sessionId = sessionStorage.getItem("andreas_session") || crypto.randomUUID();
  sessionStorage.setItem("andreas_session", sessionId);
  const body = JSON.stringify({ event_name, page_path: window.location.pathname, session_id: sessionId, metadata });
  fetch("/api/analytics", { method: "POST", headers: { "Content-Type": "application/json" }, body, keepalive: true }).catch(() => {});
}

export default function AnalyticsTracker() {
  useEffect(() => {
    track("page_view");
    const onClick = (event: MouseEvent) => {
      const link = (event.target as HTMLElement).closest("a") as HTMLAnchorElement | null;
      if (!link) return;
      const href = link.getAttribute("href") || "";
      if (href.startsWith("/book") || href.includes("booking")) track("booking_click", { href });
      else if (href.startsWith("tel:")) track("phone_click", { href: "tel" });
      else if (href.startsWith("mailto:")) track("email_click", { href: "mailto" });
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);
  return null;
}
