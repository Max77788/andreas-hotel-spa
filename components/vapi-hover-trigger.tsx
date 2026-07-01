"use client";

import VapiHoverLabel from "@/components/vapi-hover-label";

/**
 * Renders hover trigger text for the Vapi chat widget.
 * Fetches the configured assistant name from /api/vapi-config
 * so it stays in sync with admin settings.
 */
export default function VapiHoverTrigger() {
  return <span className="vapi-dot-label">Chat with <VapiHoverLabel /></span>;
}
