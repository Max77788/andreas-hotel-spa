"use client";

import { useState, useRef, useEffect, useCallback } from "react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

interface VapiCustomChatProps {
  firstMessage?: string;
  placeholder?: string;
  assistantId: string;
  publicKey: string;
  className?: string;
}

// ── Vapi streaming client ──
async function streamVapiChat(
  publicKey: string,
  assistantId: string,
  input: string | { role: string; content: string }[],
  sessionId: string | undefined,
  sessionEnd: boolean,
  onChunk: (text: string) => void,
  onComplete: () => void,
  onError: (err: Error) => void,
  signal: AbortSignal
): Promise<void> {
  const body: Record<string, unknown> = {
    input,
    assistantId,
    stream: true,
    sessionEnd,
  };
  if (sessionId) body.sessionId = sessionId;

  try {
    const res = await fetch("https://api.vapi.ai/chat/web", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${publicKey}`,
        "Content-Type": "application/json",
        "X-Client-ID": "andreas-hotel-custom",
      },
      body: JSON.stringify(body),
      signal,
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "Unknown error");
      throw new Error(`Vapi error ${res.status}: ${text}`);
    }

    const reader = res.body?.getReader();
    if (!reader) throw new Error("No response body");

    const decoder = new TextDecoder();
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() || "";

      for (const line of lines) {
        if (line.startsWith("data: ")) {
          const data = line.slice(6).trim();
          if (data === "[DONE]") continue;
          try {
            const parsed = JSON.parse(data);
            if (parsed.delta && parsed.path === "chat.output[0].content") {
              onChunk(parsed.delta);
            } else if (parsed.output) {
              onChunk(parsed.output);
            }
            if (parsed.sessionId) {
              // store sessionId if needed
            }
          } catch {}
        }
      }
    }

    onComplete();
  } catch (err: unknown) {
    if (err instanceof DOMException && err.name === "AbortError") {
      onComplete();
      return;
    }
    onError(err instanceof Error ? err : new Error(String(err)));
  }
}

// ── Markdown-like formatting (bold, italic, links) ──
function formatText(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(
      /\[(.+?)\]\((.+?)\)/g,
      '<a href="$2" target="_blank" rel="noopener noreferrer" style="color:#c9a96e;text-decoration:underline">$1</a>'
    )
    .replace(/\n/g, "<br />");
}

export default function VapiCustomChat({
  firstMessage = "Hi, I'm Jessica, your concierge at Andreas Hotel & Spa. How can I help you today?",
  placeholder = "Ask about rooms, amenities, or bookings...",
  assistantId,
  publicKey,
  className = "",
}: VapiCustomChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "assistant-0",
      role: "assistant",
      content: firstMessage,
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const sessionIdRef = useRef<string | undefined>(undefined);
  const abortRef = useRef<AbortController | null>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const sendMessage = useCallback(async () => {
    const text = input.trim();
    if (!text || isTyping) return;
    setInput("");

    // Add user message
    const userMsg: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: text,
    };
    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);
    setError(null);

    // Start streaming
    const abortCtrl = new AbortController();
    abortRef.current = abortCtrl;

    // Build the input for the API
    let apiInput: string | { role: string; content: string }[];
    const currentMessages = messages;
    if (
      currentMessages.length === 1 &&
      currentMessages[0].role === "assistant" &&
      currentMessages[0].content === firstMessage
    ) {
      // First user message - send both for context
      apiInput = [
        { role: "assistant", content: firstMessage },
        { role: "user", content: text },
      ];
    } else {
      apiInput = text;
    }

    let accumulated = "";

    await streamVapiChat(
      publicKey,
      assistantId,
      apiInput,
      sessionIdRef.current,
      false,
      (chunk: string) => {
        accumulated += chunk;
        setMessages((prev) => {
          const copy = [...prev];
          const last = copy[copy.length - 1];
          if (last?.role === "assistant" && last.id.startsWith("streaming-")) {
            copy[copy.length - 1] = { ...last, content: accumulated };
          } else {
            copy.push({
              id: `streaming-${Date.now()}`,
              role: "assistant",
              content: accumulated,
            });
          }
          return copy;
        });
      },
      () => {
        setIsTyping(false);
        if (accumulated) {
          setMessages((prev) => {
            const copy = [...prev];
            const last = copy[copy.length - 1];
            if (
              last?.role === "assistant" &&
              last.id.startsWith("streaming-")
            ) {
              copy[copy.length - 1] = {
                id: `assistant-${Date.now()}`,
                role: "assistant",
                content: accumulated,
              };
            }
            return copy;
          });
        }
      },
      (err) => {
        console.error("Vapi chat error:", err);
        setError("Connection issue. Please try again.");
        setIsTyping(false);
      },
      abortCtrl.signal
    );
  }, [input, isTyping, messages, publicKey, assistantId, firstMessage]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div
      className={`flex flex-col ${className}`}
      style={{
        backgroundColor: "#1a1511",
        borderRadius: "inherit",
        overflow: "hidden",
      }}
    >
      {/* ── Header ── */}
      <div
        className="flex items-center justify-between px-4 py-3 shrink-0"
        style={{
          borderBottom: "1px solid rgba(201,169,110,0.15)",
          background: "linear-gradient(135deg, #2a2118 0%, #1a1511 100%)",
        }}
      >
        <div className="flex items-center gap-2.5">
          <div
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: "#c9a96e" }}
          />
          <span
            className="text-sm font-medium"
            style={{
              color: "#c9a96e",
              fontFamily: "ui-serif, Georgia, serif",
            }}
          >
            Jessica
          </span>
          <span
            className="text-[10px] px-2 py-0.5 rounded-full"
            style={{
              backgroundColor: isTyping
                ? "rgba(201,169,110,0.15)"
                : "rgba(34,197,94,0.15)",
              color: isTyping ? "#c9a96e" : "#22c55e",
            }}
          >
            {isTyping ? "Typing..." : "Online"}
          </span>
        </div>
      </div>

      {/* ── Messages ── */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 scrollbar-thin">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className="flex"
            style={{
              justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
            }}
          >
            <div
              className="max-w-[85%] px-3.5 py-2.5 text-sm leading-relaxed"
              style={{
                borderRadius:
                  msg.role === "user"
                    ? "16px 16px 4px 16px"
                    : "16px 16px 16px 4px",
                backgroundColor:
                  msg.role === "user"
                    ? "rgba(201,169,110,0.15)"
                    : "rgba(255,255,255,0.06)",
                color: msg.role === "user" ? "#e8ddd0" : "#d4cdc4",
                border: `1px solid ${
                  msg.role === "user"
                    ? "rgba(201,169,110,0.2)"
                    : "rgba(255,255,255,0.08)"
                }`,
              }}
            >
              {msg.role === "assistant" ? (
                <span dangerouslySetInnerHTML={{ __html: formatText(msg.content) }} />
              ) : (
                msg.content
              )}
            </div>
          </div>
        ))}

        {isTyping && !messages[messages.length - 1]?.id.startsWith("streaming-") && (
          <div className="flex justify-start">
            <div
              className="flex items-center gap-1 px-3.5 py-3"
              style={{
                borderRadius: "16px 16px 16px 4px",
                backgroundColor: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full animate-bounce"
                style={{
                  backgroundColor: "#c9a96e",
                  animationDelay: "0ms",
                  opacity: 0.6,
                }}
              />
              <span
                className="w-1.5 h-1.5 rounded-full animate-bounce"
                style={{
                  backgroundColor: "#c9a96e",
                  animationDelay: "150ms",
                  opacity: 0.8,
                }}
              />
              <span
                className="w-1.5 h-1.5 rounded-full animate-bounce"
                style={{
                  backgroundColor: "#c9a96e",
                  animationDelay: "300ms",
                  opacity: 1,
                }}
              />
            </div>
          </div>
        )}

        {error && (
          <div
            className="text-xs text-center px-3 py-2 rounded-lg"
            style={{
              backgroundColor: "rgba(239,68,68,0.1)",
              color: "#ef4444",
              border: "1px solid rgba(239,68,68,0.2)",
            }}
          >
            {error}
          </div>
        )}

        <div ref={endRef} />
      </div>

      {/* ── Input ── */}
      <div
        className="shrink-0 px-3 py-3"
        style={{ borderTop: "1px solid rgba(201,169,110,0.1)" }}
      >
        <div
          className="flex items-center gap-2 rounded-xl px-3.5"
          style={{
            backgroundColor: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(201,169,110,0.15)",
          }}
        >
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={isTyping}
            className="flex-1 bg-transparent py-2.5 text-sm outline-none"
            style={{ color: "#e8ddd0" }}
            autoFocus
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim() || isTyping}
            className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200"
            style={{
              backgroundColor: input.trim() && !isTyping ? "#c9a96e" : "rgba(201,169,110,0.2)",
              color: input.trim() && !isTyping ? "#1a1511" : "rgba(201,169,110,0.4)",
              cursor: input.trim() && !isTyping ? "pointer" : "default",
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </button>
        </div>
        <p
          className="text-[10px] mt-1.5 text-center"
          style={{ color: "rgba(255,255,255,0.15)" }}
        >
          Powered by AI · Andreas Hotel Concierge
        </p>
      </div>
    </div>
  );
}
