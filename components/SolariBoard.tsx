"use client";

// SolariBoard ────────────────────────────────────────────────────────────────
//
// Vintage split-flap departure board ("Solari board") styled as the
// Route 9 Transit Co. arrivals/departures screen.  The four process
// steps are mapped to "destinations" — characters flip one-by-one
// on scroll reveal, cycling through the CHARSET before settling.
//
// No external deps. Animation uses staggered setTimeout + React state.

import { useEffect, useRef, useState } from "react";

// ── Data ─────────────────────────────────────────────────────────────────────

const CHARSET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 -·";

const ROWS: {
  dest: string; gate: string; status: string; departs: string;
  blink: boolean; color: string; sub: string; delay: number;
}[] = [
  { dest: "FREE DISCOVERY CALL",  gate: "A1", status: "NOW BOARDING", departs: "~20 MIN",
    blink: true,  color: "#ff6a1a", sub: "CONSULTATION · NO CHARGE",  delay: 0    },
  { dest: "SITE PREVIEW READY",   gate: "A2", status: "ON TIME",      departs: "2-3 DAYS",
    blink: false, color: "#ffd700", sub: "FULL DESIGN DRAFT · FREE",  delay: 440  },
  { dest: "LAUNCH TO LIVE",       gate: "A3", status: "ON SCHEDULE",  departs: "THIS WEEK",
    blink: false, color: "#4de8d4", sub: "SITE GOES LIVE",            delay: 880  },
  { dest: "ONGOING SUPPORT",      gate: "A4", status: "INDEFINITE",   departs: "ALWAYS",
    blink: false, color: "#aa66ff", sub: "MAINTENANCE · ALWAYS ON",   delay: 1320 },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

const FLIPS_PER_CHAR = 5;
const FLIP_MS        = 40;
const CHAR_GAP_MS    = 34;

function getFlipChar(charIdx: number, flipStep: number): string {
  return CHARSET.charAt((charIdx * 13 + flipStep * 9) % CHARSET.length);
}

// ── Sub-components ────────────────────────────────────────────────────────────

function FlipText({
  target,
  active,
  delay,
}: {
  target: string;
  active: boolean;
  delay: number;
}) {
  const [chars, setChars] = useState<string[]>(
    () => Array.from({ length: target.length }, () => "·")
  );

  useEffect(() => {
    if (!active) return;
    const timers: ReturnType<typeof setTimeout>[] = [];

    for (let ci = 0; ci < target.length; ci++) {
      const finalChar = target.charAt(ci) || " ";
      for (let flip = 0; flip <= FLIPS_PER_CHAR; flip++) {
        const t = delay + ci * CHAR_GAP_MS + flip * FLIP_MS;
        const c = flip < FLIPS_PER_CHAR ? getFlipChar(ci, flip) : finalChar;
        const capturedCi = ci;
        timers.push(
          setTimeout(() => {
            setChars(prev => {
              const next = [...prev];
              next[capturedCi] = c;
              return next;
            });
          }, t)
        );
      }
    }
    return () => timers.forEach(clearTimeout);
  }, [target, active, delay]);

  return (
    <>
      {chars.map((c, i) => (
        <span
          key={i}
          style={{
            display: "inline-block",
            minWidth: "0.62em",
            textAlign: "center",
            background: c !== " "
              ? "linear-gradient(180deg, rgba(255,255,255,0.07) 0%, rgba(0,0,0,0.05) 50%, rgba(0,0,0,0.18) 100%)"
              : "transparent",
            borderRadius: "2px",
            margin: "0 0.7px",
            verticalAlign: "middle",
            borderBottom: c !== " " ? "1px solid rgba(0,0,0,0.35)" : "none",
          }}
        >
          {c === " " ? " " : c}
        </span>
      ))}
    </>
  );
}

function BlinkStatus({ text, color }: { text: string; color: string }) {
  const [on, setOn] = useState(true);
  useEffect(() => {
    const id = setInterval(() => setOn(v => !v), 680);
    return () => clearInterval(id);
  }, []);
  return (
    <span style={{ color, opacity: on ? 1 : 0.22, transition: "opacity 0.07s" }}>
      {text}
    </span>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export function SolariBoard() {
  const [active, setActive] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setActive(true); obs.disconnect(); } },
      { threshold: 0.18 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{
        background: "linear-gradient(180deg, #060402 0%, #0a0603 100%)",
        padding: "5rem 1.5rem",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* ticker keyframe */}
      <style>{`@keyframes sb-ticker{from{transform:translateX(0)}to{transform:translateX(-50%)}}`}</style>

      {/* Ambient glow */}
      <div aria-hidden style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        background: "radial-gradient(ellipse at 50% 60%, rgba(212,104,42,0.055) 0%, transparent 60%)",
      }}/>

      {/* Label */}
      <p style={{
        textAlign: "center",
        fontSize: "9px", letterSpacing: "0.32em", textTransform: "uppercase",
        color: "rgba(212,104,42,0.38)", fontFamily: "monospace",
        marginBottom: "1.5rem",
        opacity: active ? 1 : 0,
        transition: "opacity 0.5s ease 0.1s",
      }}>
        Route 9 Transit Co. · All Departures On Schedule
      </p>

      {/* Board */}
      <div style={{
        maxWidth: "860px", margin: "0 auto",
        border: "2px solid rgba(160,120,50,0.28)",
        borderRadius: "10px",
        overflow: "hidden",
        boxShadow:
          "0 0 0 1px rgba(255,200,80,0.05) inset, " +
          "0 8px 48px rgba(0,0,0,0.7), " +
          "0 0 80px rgba(212,104,42,0.06)",
        opacity: active ? 1 : 0,
        transform: active ? "none" : "translateY(28px)",
        transition: "opacity 0.65s cubic-bezier(0.22,1,0.36,1) 0.15s, transform 0.65s cubic-bezier(0.22,1,0.36,1) 0.15s",
      }}>

        {/* ── Header bar ── */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          flexWrap: "wrap", gap: "8px",
          background: "linear-gradient(90deg, #180b03, #281505, #180b03)",
          borderBottom: "1px solid rgba(160,120,50,0.32)",
          padding: "13px 22px",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            {/* Bus icon */}
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" aria-hidden>
              <rect x="2" y="5" width="20" height="13" rx="2"
                stroke="#D4682A" strokeWidth="1.5"/>
              <path d="M2 10h20" stroke="#D4682A" strokeWidth="1"/>
              <circle cx="7"  cy="19" r="2" stroke="#D4682A" strokeWidth="1.5"/>
              <circle cx="17" cy="19" r="2" stroke="#D4682A" strokeWidth="1.5"/>
              <path d="M6 5V3M18 5V3" stroke="#D4682A" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <span style={{
              fontFamily: "monospace", fontWeight: "bold",
              fontSize: "13px", letterSpacing: "0.22em", color: "#D4682A",
            }}>
              ROUTE 9 TRANSIT CO.
            </span>
          </div>
          <span style={{
            fontFamily: "monospace", fontSize: "10px",
            letterSpacing: "0.18em", color: "rgba(255,215,0,0.55)",
          }}>
            DEPARTURES — SHREWSBURY, MA
          </span>
          <span style={{
            fontFamily: "monospace", fontSize: "9px",
            letterSpacing: "0.14em", color: "rgba(200,200,200,0.3)",
          }}>
            PLATFORM A · ROUTE 9
          </span>
        </div>

        {/* ── Column headers ── */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 88px 160px 120px",
          background: "rgba(22,14,6,0.96)",
          borderBottom: "1px solid rgba(90,60,20,0.28)",
          padding: "8px 22px",
          gap: "0",
        }}>
          {(["DESTINATION", "GATE", "STATUS", "DEPARTS"] as const).map(label => (
            <span key={label} style={{
              fontFamily: "monospace", fontSize: "8.5px",
              letterSpacing: "0.26em", textTransform: "uppercase",
              color: "rgba(255,255,255,0.22)",
            }}>
              {label}
            </span>
          ))}
        </div>

        {/* ── Departure rows ── */}
        {ROWS.map((row, i) => (
          <div key={i} style={{
            display: "grid",
            gridTemplateColumns: "1fr 88px 160px 120px",
            borderBottom: i < ROWS.length - 1 ? "1px solid rgba(60,40,12,0.4)" : "none",
            background: i % 2 === 0 ? "rgba(14,9,3,0.98)" : "rgba(10,6,2,0.98)",
            padding: "17px 22px",
            alignItems: "center",
            gap: "0",
          }}>

            {/* Destination */}
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "9px", marginBottom: "5px" }}>
                {/* Colored dot */}
                <span style={{
                  width: "7px", height: "7px", borderRadius: "50%", flexShrink: 0,
                  background: row.color,
                  boxShadow: `0 0 7px ${row.color}`,
                  display: "inline-block",
                }}/>
                <span style={{
                  fontFamily: "Courier New, monospace",
                  fontWeight: "bold", fontSize: "17px",
                  color: "#f5f0e0", letterSpacing: "0.03em",
                  lineHeight: 1,
                }}>
                  <FlipText target={row.dest} active={active} delay={row.delay} />
                </span>
              </div>
              <span style={{
                fontSize: "8.5px", letterSpacing: "0.18em",
                color: "rgba(255,255,255,0.18)", fontFamily: "monospace",
                paddingLeft: "16px",
              }}>
                {row.sub}
              </span>
            </div>

            {/* Gate */}
            <div>
              <span style={{
                display: "inline-block",
                padding: "4px 11px",
                background: "rgba(255,255,255,0.045)",
                border: `1px solid ${row.color}55`,
                borderRadius: "4px",
                fontFamily: "monospace", fontWeight: "bold",
                fontSize: "15px", color: row.color,
                letterSpacing: "0.1em",
              }}>
                {row.gate}
              </span>
            </div>

            {/* Status */}
            <div style={{
              fontFamily: "monospace", fontWeight: "bold",
              fontSize: "10.5px", letterSpacing: "0.07em",
            }}>
              {row.blink
                ? <BlinkStatus text={row.status} color={row.color} />
                : <span style={{ color: row.color }}>{row.status}</span>
              }
            </div>

            {/* Departs */}
            <div>
              <span style={{
                fontFamily: "Courier New, monospace",
                fontWeight: "bold", fontSize: "14px",
                color: "#f5f0e0", letterSpacing: "0.05em",
              }}>
                {row.departs}
              </span>
            </div>
          </div>
        ))}

        {/* ── Bottom ticker ── */}
        <div style={{
          background: "rgba(14,9,3,0.99)",
          borderTop: "1px solid rgba(90,60,20,0.28)",
          padding: "6px 0", overflow: "hidden",
        }}>
          <div style={{
            display: "inline-block", whiteSpace: "nowrap",
            animation: "sb-ticker 26s linear infinite",
            fontFamily: "monospace", fontSize: "9px",
            letterSpacing: "0.24em", color: "rgba(212,104,42,0.48)",
          }}>
            {[
              "· ROUTE 9 WEB CO.",
              "ALL DESTINATIONS DEPARTING ON SCHEDULE",
              "FREE DISCOVERY CALL AT YOUR SHOP",
              "SHREWSBURY · WESTBOROUGH · NORTHBOROUGH · WORCESTER",
              "NO LOCK-IN · NO DELAYS · MOBILE-FIRST",
              "BUILT BY A NEIGHBOR · MAINTAINED BY THE SAME ONE",
              "",
            ].join("    ").repeat(2)}
          </div>
        </div>
      </div>

      {/* Sub-caption */}
      <p style={{
        textAlign: "center", marginTop: "1.5rem",
        fontSize: "10px", letterSpacing: "0.16em",
        color: "rgba(243,233,213,0.2)", fontFamily: "monospace",
        opacity: active ? 1 : 0,
        transition: "opacity 0.5s ease 1s",
      }}>
        Every ticket is free until you decide to board.
      </p>
    </div>
  );
}
