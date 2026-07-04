"use client";

import VapiHoverLabel from "@/components/vapi-hover-label";

interface Props {
  assistantName?: string;
}

export default function VapiHoverTrigger({ assistantName }: Props) {
  return <span className="vapi-dot-label">Chat with <VapiHoverLabel fallback={assistantName || "Andreas"} /></span>;
}
