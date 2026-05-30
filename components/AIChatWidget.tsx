"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { X, Send, MessageSquare, Sparkles, ArrowUpRight } from "lucide-react";

type Message = { role: "user" | "assistant"; content: string };

const QUICK_QUESTIONS = [
  "How much does a website cost?",
  "How fast can you launch?",
  "What's included in Starter?",
  "Can we meet at my shop?",
];

const WELCOME: Message = {
  role: "assistant",
  content:
    "Hey! I'm Amit's AI assistant for Route 9 Web. Ask me anything about pricing, what's included, timelines — or anything else. What's on your mind?",
};

function R9Badge({ size = 22 }: { size?: number }) {
  return (
    <div
      aria-hidden
      style={{
        width: size,
        height: size,
        borderRadius: Math.round(size * 0.32),
        background: "linear-gradient(145deg, #E07838 0%, #C05A20 55%, #A04010 100%)",
        boxShadow: "0 0 10px rgba(212,104,42,0.5), inset 0 1px 0 rgba(255,255,255,0.22)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "var(--font-display)",
        fontStyle: "italic",
        fontWeight: 800,
        fontSize: Math.round(size * 0.36),
        color: "white",
        flexShrink: 0,
      }}
    >
      R9
    </div>
  );
}

function TypingDots() {
  return (
    <span style={{ display: "inline-flex", gap: "3px", alignItems: "center", padding: "2px 0" }}>
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          style={{
            width: "4px",
            height: "4px",
            borderRadius: "50%",
            background: "rgba(212,104,42,0.7)",
            display: "inline-block",
            animation: `chat-dot 1.2s ease-in-out infinite`,
            animationDelay: `${i * 0.18}s`,
          }}
        />
      ))}
    </span>
  );
}

export function AIChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([WELCOME]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [streamText, setStreamText] = useState("");
  const [showPing, setShowPing] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, streamText]);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 380);
      setShowPing(false);
    }
  }, [open]);

  const sendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || streaming) return;

      const newMessages: Message[] = [
        ...messages,
        { role: "user", content: trimmed },
      ];
      setMessages(newMessages);
      setInput("");
      setStreaming(true);
      setStreamText("");

      const ctrl = new AbortController();
      abortRef.current = ctrl;

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: newMessages.map((m) => ({
              role: m.role,
              content: m.content,
            })),
          }),
          signal: ctrl.signal,
        });

        if (!res.ok) {
          let errText =
            "Something went wrong. Please try again or contact us directly.";
          if (res.status === 503) {
            try {
              const j = await res.json();
              if (j.error) errText = j.error;
            } catch { /* ignore */ }
          } else if (res.status === 429) {
            errText =
              "You're sending messages quickly — give it a moment and try again!";
          }
          setMessages((prev) => [
            ...prev,
            { role: "assistant", content: errText },
          ]);
          setStreaming(false);
          return;
        }

        const reader = res.body?.getReader();
        if (!reader) return;

        const decoder = new TextDecoder();
        let full = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          full += decoder.decode(value, { stream: true });
          setStreamText(full);
        }

        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: full },
        ]);
        setStreamText("");
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          setMessages((prev) => [
            ...prev,
            {
              role: "assistant",
              content:
                "Something went wrong. Reach out to Amit directly at hello@route9web.com.",
            },
          ]);
        }
      } finally {
        setStreaming(false);
      }
    },
    [messages, streaming]
  );

  const handleKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const MSG_STYLE = {
    maxWidth: "84%",
    padding: "9px 13px",
    fontSize: "12.5px",
    lineHeight: 1.58,
    wordBreak: "break-word" as const,
    whiteSpace: "pre-wrap" as const,
  };

  return (
    <>
      {/* ── Toggle button ── */}
      <div
        className="fixed z-[9989]"
        style={{ bottom: "24px", left: "24px" }}
      >
        {showPing && (
          <span
            aria-hidden
            className="absolute inset-0 rounded-full animate-ping"
            style={{
              background: "rgba(212,104,42,0.38)",
              animationDuration: "2.2s",
            }}
          />
        )}
        <button
          onClick={() => setOpen((o) => !o)}
          aria-label={open ? "Close AI assistant" : "Open AI assistant"}
          aria-expanded={open}
          aria-haspopup="dialog"
          style={{
            width: "54px",
            height: "54px",
            borderRadius: "9999px",
            background:
              "linear-gradient(145deg, #E07838 0%, #D4682A 45%, #B85520 100%)",
            boxShadow:
              "0 6px 24px rgba(212,104,42,0.55), 0 0 0 1px rgba(212,104,42,0.45), inset 0 1.5px 0 rgba(255,220,140,0.28), inset 0 -1.5px 0 rgba(0,0,0,0.18)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            transition:
              "transform 0.22s cubic-bezier(0.22,1,0.36,1), box-shadow 0.22s",
            position: "relative",
            border: "none",
            cursor: "pointer",
          }}
          onMouseEnter={(e) => {
            const el = e.currentTarget as HTMLElement;
            el.style.transform = "scale(1.1)";
            el.style.boxShadow =
              "0 8px 32px rgba(212,104,42,0.70), 0 0 0 1px rgba(212,104,42,0.55), inset 0 1.5px 0 rgba(255,220,140,0.35), inset 0 -1.5px 0 rgba(0,0,0,0.2)";
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget as HTMLElement;
            el.style.transform = "";
            el.style.boxShadow =
              "0 6px 24px rgba(212,104,42,0.55), 0 0 0 1px rgba(212,104,42,0.45), inset 0 1.5px 0 rgba(255,220,140,0.28), inset 0 -1.5px 0 rgba(0,0,0,0.18)";
          }}
        >
          {open ? (
            <X size={20} strokeWidth={2.5} />
          ) : (
            <MessageSquare
              size={20}
              strokeWidth={2}
              fill="rgba(255,255,255,0.15)"
            />
          )}
          {!open && (
            <span
              aria-hidden
              style={{
                position: "absolute",
                top: "-3px",
                right: "-3px",
                width: "18px",
                height: "18px",
                borderRadius: "9999px",
                background: "linear-gradient(135deg, #FFD060, #FF9020)",
                border: "2.5px solid #0E0905",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "6.5px",
                fontWeight: 800,
                color: "#1C1209",
                letterSpacing: "0.02em",
              }}
            >
              AI
            </span>
          )}
        </button>
      </div>

      {/* ── Chat panel ── */}
      <div
        role="dialog"
        aria-label="Route 9 AI Assistant"
        aria-modal="false"
        style={{
          position: "fixed",
          bottom: "90px",
          left: "16px",
          width: "min(408px, calc(100vw - 32px))",
          maxHeight: "min(570px, 72vh)",
          zIndex: 9988,
          display: "flex",
          flexDirection: "column",
          background:
            "linear-gradient(145deg, rgba(10,6,3,0.98) 0%, rgba(18,11,6,0.97) 100%)",
          backdropFilter: "blur(28px)",
          WebkitBackdropFilter: "blur(28px)",
          border: "1px solid rgba(212,104,42,0.16)",
          borderRadius: "20px",
          boxShadow:
            "0 28px 64px rgba(0,0,0,0.78), 0 0 0 1px rgba(255,255,255,0.025), 0 8px 32px rgba(212,104,42,0.10)",
          overflow: "hidden",
          transformOrigin: "bottom left",
          transition:
            "transform 0.38s cubic-bezier(0.22,1,0.36,1), opacity 0.3s ease",
          transform: open
            ? "scale(1) translateY(0)"
            : "scale(0.86) translateY(18px)",
          opacity: open ? 1 : 0,
          pointerEvents: open ? "auto" : "none",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "13px 15px",
            background:
              "linear-gradient(135deg, rgba(30,18,9,0.92), rgba(20,12,6,0.88))",
            borderBottom: "1px solid rgba(212,104,42,0.12)",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            flexShrink: 0,
          }}
        >
          <R9Badge size={34} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                fontSize: "13px",
                fontWeight: 700,
                color: "#F3E9D5",
                display: "flex",
                alignItems: "center",
                gap: "5px",
                letterSpacing: "0.01em",
              }}
            >
              Route 9 AI
              <Sparkles size={11} color="#D4682A" />
            </div>
            <div
              style={{
                fontSize: "10px",
                color: "rgba(243,233,213,0.38)",
                letterSpacing: "0.05em",
                marginTop: "1px",
              }}
            >
              Ask anything · Powered by Claude
            </div>
          </div>
          <button
            onClick={() => setOpen(false)}
            aria-label="Close chat"
            style={{
              width: "28px",
              height: "28px",
              borderRadius: "8px",
              background: "rgba(255,255,255,0.055)",
              border: "1px solid rgba(255,255,255,0.07)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "rgba(243,233,213,0.45)",
              cursor: "pointer",
              flexShrink: 0,
              transition: "background 0.15s, color 0.15s",
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.background = "rgba(255,255,255,0.1)";
              el.style.color = "rgba(243,233,213,0.9)";
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.background = "rgba(255,255,255,0.055)";
              el.style.color = "rgba(243,233,213,0.45)";
            }}
          >
            <X size={12} strokeWidth={2.5} />
          </button>
        </div>

        {/* Messages */}
        <div
          ref={scrollRef}
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "14px 14px 6px",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            scrollbarWidth: "thin",
            scrollbarColor: "rgba(212,104,42,0.30) transparent",
          }}
        >
          {messages.map((msg, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                flexDirection: msg.role === "user" ? "row-reverse" : "row",
                alignItems: "flex-start",
                gap: "7px",
              }}
            >
              {msg.role === "assistant" && <R9Badge size={22} />}
              <div
                style={{
                  ...MSG_STYLE,
                  borderRadius:
                    msg.role === "user"
                      ? "14px 14px 4px 14px"
                      : "4px 14px 14px 14px",
                  background:
                    msg.role === "user"
                      ? "linear-gradient(135deg, rgba(212,104,42,0.90) 0%, rgba(165,68,18,0.94) 100%)"
                      : "rgba(212,104,42,0.07)",
                  border:
                    msg.role === "user"
                      ? "1px solid rgba(255,255,255,0.06)"
                      : "1px solid rgba(212,104,42,0.14)",
                  color:
                    msg.role === "user"
                      ? "rgba(255,255,255,0.95)"
                      : "rgba(243,233,213,0.88)",
                  marginTop: "2px",
                }}
              >
                {msg.content}
              </div>
            </div>
          ))}

          {/* Streaming */}
          {streaming && (
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "7px",
              }}
            >
              <R9Badge size={22} />
              <div
                style={{
                  ...MSG_STYLE,
                  borderRadius: "4px 14px 14px 14px",
                  background: "rgba(212,104,42,0.07)",
                  border: "1px solid rgba(212,104,42,0.14)",
                  color: "rgba(243,233,213,0.88)",
                  minWidth: "52px",
                  minHeight: "34px",
                  marginTop: "2px",
                }}
              >
                {streamText ? (
                  <>
                    {streamText}
                    <span
                      style={{
                        display: "inline-block",
                        width: "2px",
                        height: "0.82em",
                        background: "#D4682A",
                        verticalAlign: "middle",
                        marginLeft: "2px",
                        animation: "chat-cursor 0.75s step-end infinite",
                      }}
                    />
                  </>
                ) : (
                  <TypingDots />
                )}
              </div>
            </div>
          )}
        </div>

        {/* Quick questions — always visible so users can keep tapping follow-up prompts */}
        <div
          style={{
            padding: "4px 14px 8px",
            display: "flex",
            flexWrap: "wrap",
            gap: "5px",
            flexShrink: 0,
          }}
        >
          {QUICK_QUESTIONS.map((q) => (
            <button
              key={q}
              onClick={() => sendMessage(q)}
              disabled={streaming}
              style={{
                padding: "4px 10px",
                borderRadius: "9999px",
                background: "rgba(212,104,42,0.07)",
                border: "1px solid rgba(212,104,42,0.18)",
                color: "rgba(243,233,213,0.70)",
                fontSize: "10.5px",
                cursor: streaming ? "not-allowed" : "pointer",
                transition: "all 0.14s ease",
                fontWeight: 500,
                letterSpacing: "0.01em",
                fontFamily: "inherit",
              }}
              onMouseEnter={(e) => {
                if (streaming) return;
                const el = e.currentTarget as HTMLElement;
                el.style.background = "rgba(212,104,42,0.16)";
                el.style.borderColor = "rgba(212,104,42,0.36)";
                el.style.color = "rgba(243,233,213,0.95)";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.background = "rgba(212,104,42,0.07)";
                el.style.borderColor = "rgba(212,104,42,0.18)";
                el.style.color = "rgba(243,233,213,0.70)";
              }}
            >
              {q}
            </button>
          ))}
        </div>

        {/* Input */}
        <div
          style={{
            padding: "10px 12px",
            borderTop: "1px solid rgba(212,104,42,0.10)",
            background: "rgba(255,255,255,0.018)",
            display: "flex",
            alignItems: "flex-end",
            gap: "8px",
            flexShrink: 0,
          }}
        >
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Ask a question…"
            rows={1}
            disabled={streaming}
            aria-label="Message input"
            style={{
              flex: 1,
              background: "transparent",
              border: "none",
              outline: "none",
              resize: "none",
              color: "#F3E9D5",
              fontSize: "13px",
              lineHeight: 1.5,
              fontFamily: "inherit",
              maxHeight: "72px",
              overflowY: "auto",
              padding: "3px 0",
              scrollbarWidth: "none",
            }}
          />
          <button
            onClick={() => sendMessage(input)}
            disabled={!input.trim() || streaming}
            aria-label="Send message"
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "9px",
              flexShrink: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: input.trim() && !streaming ? "pointer" : "not-allowed",
              background:
                input.trim() && !streaming
                  ? "linear-gradient(145deg, #E07838 0%, #D4682A 45%, #B85520 100%)"
                  : "rgba(255,255,255,0.055)",
              color:
                input.trim() && !streaming
                  ? "white"
                  : "rgba(255,255,255,0.22)",
              border: "none",
              transition: "background 0.18s, color 0.18s, box-shadow 0.18s",
              boxShadow:
                input.trim() && !streaming
                  ? "0 3px 10px rgba(212,104,42,0.48)"
                  : "none",
            }}
          >
            <Send size={13} strokeWidth={2.5} />
          </button>
        </div>

        {/* Footer */}
        <div
          style={{
            padding: "6px 14px 10px",
            textAlign: "center",
            flexShrink: 0,
          }}
        >
          <a
            href="#contact"
            onClick={() => setOpen(false)}
            style={{
              fontSize: "9.5px",
              color: "rgba(212,104,42,0.48)",
              display: "inline-flex",
              alignItems: "center",
              gap: "3px",
              letterSpacing: "0.04em",
              textDecoration: "none",
              transition: "color 0.15s",
            }}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLElement).style.color =
                "rgba(212,104,42,0.8)")
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLElement).style.color =
                "rgba(212,104,42,0.48)")
            }
          >
            Prefer to talk to Amit directly?
            <ArrowUpRight size={9} />
          </a>
        </div>
      </div>
    </>
  );
}
