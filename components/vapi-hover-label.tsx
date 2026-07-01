"use client";

import { useState, useEffect } from "react";

/**
 * Renders the configured Vapi assistant name.
 * Fetches from /api/vapi-config so it stays in sync with admin settings.
 * Falls back to "Jessica" if not configured or still loading.
 */
export default function VapiHoverLabel({ fallback = "Jessica" }: { fallback?: string }) {
  const [name, setName] = useState(fallback);

  useEffect(() => {
    fetch("/api/vapi-config")
      .then((r) => r.json())
      .then((d) => {
        if (d?.vapi_assistant_name) setName(d.vapi_assistant_name);
      })
      .catch(() => {});
  }, []);

  return <>{name}</>;
}
