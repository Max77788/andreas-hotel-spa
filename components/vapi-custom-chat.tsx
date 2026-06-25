"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { fetchEventSource } from "@microsoft/fetch-event-source";

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

const STORAGE_PREFIX = "vapi_jessica_";

function loadFromStorage(key: string): {
  messages: Message[];
  sessionId: string | undefined;
} {
  if (typeof window === "undefined") return { messages: [], sessionId: undefined };
  try {
    const raw = sessionStorage.getItem(STORAGE_PREFIX + key);
    if (raw) return JSON.parse(raw);
  } catch {}
  return { messages: [], sessionId: undefined };
}

function saveToStorage(key: string, data: { messages: Message[]; sessionId?: string }) {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(data));
  } catch {}
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
  signal: AbortSignal,
  onSessionId?: (id: string) => void
): Promise<void> {
  const body: Record<string, unknown> = {
    input,
    assistantId,
    stream: true,
    sessionEnd,
  };
  if (sessionId) body.sessionId = sessionId;

  try {
    await fetchEventSource("https://api.vapi.ai/chat/web", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${publicKey}`,
        "Content-Type": "application/json",
        "X-Client-ID": "andreas-hotel-custom",
      },
      body: JSON.stringify(body),
      signal,

      async onopen(response) {
        if (!response.ok) {
          const text = await response.text().catch(() => "Unknown error");
          throw new Error(`Vapi error ${response.status}: ${text}`);
        }
      },

      onmessage(event) {
        if (event.data === "[DONE]") return;
        try {
          const parsed = JSON.parse(event.data);
          if (parsed.delta && parsed.path === "chat.output[0].content") {
            onChunk(parsed.delta);
          } else if (parsed.output) {
            onChunk(parsed.output);
          }
          if (parsed.sessionId) {
            onSessionId?.(parsed.sessionId);
          }
        } catch {}
      },

      onclose() {
        onComplete();
      },

      onerror(err) {
        if (err instanceof Error && err.name === "AbortError") {
          onComplete();
          return; // stops retry
        }
        onError(err instanceof Error ? err : new Error(String(err)));
        // Returning non-undefined stops retries
        return;
      },
    });
  } catch (err) {
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
  const storageKey = `${assistantId}-${publicKey.slice(0, 8)}`;

  // Hydrate from sessionStorage on mount
  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = loadFromStorage(storageKey);
    if (saved.messages.length > 0) return saved.messages;
    return [
      {
        id: "assistant-0",
        role: "assistant",
        content: firstMessage,
      },
    ];
  });

  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const sessionIdRef = useRef<string | undefined>(undefined);

  // Hydrate sessionId from storage on mount
  useEffect(() => {
    const saved = loadFromStorage(storageKey);
    if (saved.sessionId) {
      sessionIdRef.current = saved.sessionId;
    }
  }, [storageKey]);
  const hasHydrated = useRef(false);
  const abortRef = useRef<AbortController | null>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesRef = useRef(messages);
  messagesRef.current = messages;

  // Persist messages + sessionId to sessionStorage whenever they change
  useEffect(() => {
    if (!hasHydrated.current) {
      hasHydrated.current = true;
      return;
    }
    saveToStorage(storageKey, {
      messages,
      sessionId: sessionIdRef.current,
    });
  }, [messages, storageKey]);

  const handleSessionId = useCallback((id: string) => {
    sessionIdRef.current = id;
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const newChat = useCallback(() => {
    abortRef.current?.abort();
    sessionIdRef.current = undefined;
    const initial = [
      {
        id: "assistant-0",
        role: "assistant" as const,
        content: firstMessage,
      },
    ];
    setMessages(initial);
    setInput("");
    setIsTyping(false);
    setError(null);
    try {
      sessionStorage.removeItem(STORAGE_PREFIX + storageKey);
    } catch {}
  }, [firstMessage, storageKey]);

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
    const msgsAfterUser = [...messagesRef.current, userMsg];
    setMessages(msgsAfterUser);
    setIsTyping(true);
    setError(null);

    // Start streaming
    const abortCtrl = new AbortController();
    abortRef.current = abortCtrl;

    // Build the input for the API
    let apiInput: string | { role: string; content: string }[];
    const currentMessages = messagesRef.current;
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
      abortCtrl.signal,
      handleSessionId
    );
  }, [input, isTyping, publicKey, assistantId, firstMessage, handleSessionId]);

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
        {messages.length > 1 && (
          <button
            onClick={newChat}
            className="text-[10px] px-2.5 py-1 rounded-full transition-colors"
            style={{
              color: "rgba(201,169,110,0.6)",
              border: "1px solid rgba(201,169,110,0.2)",
            }}
            title="Start new chat"
          >
            + New
          </button>
        )}
      </div>

      {/* ── Messages ── */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
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
