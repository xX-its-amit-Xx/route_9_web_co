"use client";

import { useEffect, useState } from "react";

type Props = {
  /** Reset to send another message. */
  onReset: () => void;
};

/**
 * Vintage thermal-printed paper receipt — used as the success state of
 * the contact form. The whole receipt "prints" out top-to-bottom on
 * mount, with one line revealed per ~120ms. Stamped "PAID" at the end.
 *
 * Under prefers-reduced-motion the receipt renders fully printed
 * immediately (no row-reveal stagger).
 */
export function VintageReceipt({ onReset }: Props) {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  // Today's date — formatted like a real cash register would print
  const now = new Date();
  const dateStr = now.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  }).toUpperCase();
  const timeStr = now.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  const orderNo = String(Math.floor(now.getTime() / 1000) % 100000).padStart(5, "0");

  const lines: { text: string; emphasis?: "header" | "bold" | "amount" | "rule" }[] = [
    { text: "ROUTE 9 WEB CO.", emphasis: "header" },
    { text: "SHREWSBURY · MASSACHUSETTS" },
    { text: "─────────────────────────────", emphasis: "rule" },
    { text: `${dateStr}   ${timeStr}` },
    { text: `ORDER # ${orderNo}` },
    { text: " " },
    { text: "TRANSACTION RECEIVED:", emphasis: "bold" },
    { text: " " },
    { text: "  CUSTOM WEBSITE INQUIRY .... $ 0.00" },
    { text: "  FREE PREVIEW MOCKUP ....... $ 0.00" },
    { text: "  ROUTE-9 NEIGHBOR DISCOUNT . $ 0.00" },
    { text: "─────────────────────────────", emphasis: "rule" },
    { text: "TOTAL DUE TODAY  ........... $ 0.00", emphasis: "amount" },
    { text: " " },
    { text: "WE'LL REPLY WITHIN A FEW HOURS." },
    { text: "REPLIES USUALLY UNDER 2 HRS." },
    { text: " " },
    { text: "THANK YOU FOR YOUR BUSINESS", emphasis: "bold" },
    { text: "✃  ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─", emphasis: "rule" },
  ];

  return (
    <div className="receipt-stage relative" role="status">
      {/* Cash-register slot above the receipt (visual flavor) */}
      <div
        aria-hidden
        className="absolute inset-x-0 mx-auto"
        style={{
          top: "-22px",
          width: "min(360px, 92%)",
          height: "22px",
          background:
            "linear-gradient(180deg, #2A1810 0%, #1C1209 60%, #0E0805 100%)",
          borderRadius: "6px 6px 0 0",
          boxShadow:
            "inset 0 -3px 6px rgba(0,0,0,0.7), 0 -2px 0 rgba(255,255,255,0.04) inset",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "10px",
            left: "16px",
            right: "16px",
            height: "5px",
            background: "#000",
            borderRadius: "3px",
            boxShadow: "inset 0 2px 3px rgba(0,0,0,0.9)",
          }}
        />
      </div>

      <div
        className="receipt-paper mx-auto"
        style={{
          width: "min(360px, 92%)",
          padding: "16px 18px 8px",
          background:
            "repeating-linear-gradient(180deg, #FDF6E8 0px, #FDF6E8 22px, #F9F0DE 22px, #F9F0DE 23px)",
          color: "#1C1209",
          fontFamily:
            "'Courier New', 'Courier', ui-monospace, SFMono-Regular, Menlo, monospace",
          fontSize: "12px",
          lineHeight: "22px",
          letterSpacing: "0.04em",
          borderLeft: "1px dashed rgba(28,18,9,0.18)",
          borderRight: "1px dashed rgba(28,18,9,0.18)",
          borderTop: "1px solid rgba(28,18,9,0.22)",
          boxShadow:
            "0 16px 36px rgba(28,18,9,0.32), 0 4px 12px rgba(28,18,9,0.22), inset 0 1px 0 rgba(255,255,255,0.4)",
          maskImage:
            "linear-gradient(to bottom, black 0%, black 96%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, black 0%, black 96%, transparent 100%)",
        }}
      >
        {lines.map((line, i) => {
          const style: React.CSSProperties = {
            opacity: reduced ? 1 : 0,
            animation: reduced
              ? "none"
              : `receipt-row 0.42s ease-out ${0.4 + i * 0.085}s forwards`,
            transform: "translateY(-2px)",
          };

          if (line.emphasis === "header") {
            return (
              <p
                key={i}
                style={{
                  ...style,
                  margin: 0,
                  fontSize: "16px",
                  fontWeight: 800,
                  letterSpacing: "0.16em",
                  textAlign: "center",
                  fontFamily:
                    "Georgia, 'Times New Roman', serif",
                  fontStyle: "italic",
                }}
              >
                {line.text}
              </p>
            );
          }
          if (line.emphasis === "rule") {
            return (
              <p
                key={i}
                style={{
                  ...style,
                  margin: 0,
                  textAlign: "center",
                  opacity: reduced ? 0.6 : undefined,
                  color: "rgba(28,18,9,0.6)",
                }}
              >
                {line.text}
              </p>
            );
          }
          if (line.emphasis === "amount") {
            return (
              <p
                key={i}
                style={{
                  ...style,
                  margin: 0,
                  fontWeight: 800,
                  letterSpacing: "0.06em",
                }}
              >
                {line.text}
              </p>
            );
          }
          if (line.emphasis === "bold") {
            return (
              <p
                key={i}
                style={{
                  ...style,
                  margin: 0,
                  fontWeight: 700,
                  textAlign: "center",
                  letterSpacing: "0.16em",
                }}
              >
                {line.text}
              </p>
            );
          }
          return (
            <p
              key={i}
              style={{
                ...style,
                margin: 0,
                textAlign: line.text.startsWith("  ") ? "left" : "center",
              }}
            >
              {line.text}
            </p>
          );
        })}

        {/* "PAID" stamp — angled, ink-blotted, appears at the end */}
        <div
          aria-hidden
          className="receipt-paid-stamp"
          style={{
            position: "absolute",
            top: "44%",
            right: "8%",
            padding: "6px 14px",
            border: "3px double #A84818",
            color: "#A84818",
            fontFamily: "Georgia, serif",
            fontStyle: "italic",
            fontWeight: 900,
            fontSize: "26px",
            letterSpacing: "0.14em",
            transform: "rotate(-14deg)",
            opacity: reduced ? 0.85 : 0,
            textShadow:
              "0 0 8px rgba(168,72,24,0.35), inset 0 0 0 1px rgba(168,72,24,0.35)",
            background:
              "radial-gradient(circle, rgba(168,72,24,0.06) 0%, transparent 70%)",
            animation: reduced
              ? "none"
              : "receipt-paid 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) 2.6s forwards",
          }}
        >
          PAID
        </div>
      </div>

      {/* "Send another" reset button under the receipt */}
      <div className="text-center mt-8">
        <button
          type="button"
          onClick={onReset}
          className="text-sm text-accent hover:underline"
        >
          Send another message
        </button>
      </div>
    </div>
  );
}
