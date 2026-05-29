"use client";

// MatchbookCollection ─────────────────────────────────────────────────────────
//
// Six vintage illustrated matchbooks — one per Route 9 local business type —
// fanning out from a stack on scroll reveal via spring CSS transitions.
// Each cover has hand-drawn SVG art + strike strip at bottom.
// Placed between About and CorkBoard.

import { useEffect, useRef, useState } from "react";

// ── Types ─────────────────────────────────────────────────────────────────────

type Book = {
  label: string; sub: string;
  bg: string; dark: string; acc: string;
  tx: number; ty: number; rot: number; z: number;
};

// ── Data ──────────────────────────────────────────────────────────────────────

const BOOKS: Book[] = [
  { label: "ARTURO'S",   sub: "PIZZERIA",  bg: "#8c1410", dark: "#4e0c08", acc: "#f06020", tx: -215, ty: 28, rot: -28, z: 2 },
  { label: "MAIN ST.",   sub: "CAFÉ",      bg: "#1a4818", dark: "#0e2c0c", acc: "#68b830", tx: -128, ty:  9, rot: -17, z: 3 },
  { label: "LAKE SHORE", sub: "BARBERS",   bg: "#0c2a52", dark: "#081a32", acc: "#3888d0", tx:  -42, ty:  1, rot:  -6, z: 4 },
  { label: "RT. 9",      sub: "DINER",     bg: "#b41c0c", dark: "#6c1008", acc: "#f8c020", tx:   42, ty:  1, rot:   6, z: 5 },
  { label: "ROUTE 9",    sub: "INN",       bg: "#1a3c3c", dark: "#0e2424", acc: "#38bca0", tx:  128, ty:  9, rot:  17, z: 3 },
  { label: "ROUTE 9",    sub: "WEB CO.",   bg: "#221408", dark: "#120c04", acc: "#d06818", tx:  215, ty: 28, rot:  28, z: 2 },
];

// ── Cover art (viewBox 0 0 70 68 each) ───────────────────────────────────────

function ArtPizza({ acc, bg }: { acc: string; bg: string }) {
  return (
    <g>
      <circle cx="35" cy="35" r="20" fill={acc} opacity="0.58" />
      <line x1="35" y1="15" x2="35" y2="55" stroke={bg} strokeWidth="1.5" opacity="0.65" />
      <line x1="35" y1="15" x2="18" y2="47" stroke={bg} strokeWidth="1.5" opacity="0.65" />
      <line x1="35" y1="15" x2="52" y2="47" stroke={bg} strokeWidth="1.5" opacity="0.65" />
      <path d="M 35,35 L 35,15 A 20,20 0 0,1 52,47 Z" fill={bg} opacity="0.22" />
      <circle cx="31" cy="27" r="2.5" fill={bg} opacity="0.58" />
      <circle cx="42" cy="31" r="2"   fill={bg} opacity="0.50" />
      <circle cx="38" cy="22" r="1.8" fill={bg} opacity="0.44" />
      <ellipse cx="41" cy="23" rx="5" ry="3" fill="#208814" opacity="0.55"
        transform="rotate(-25 41 23)" />
    </g>
  );
}

function ArtCafe({ acc, bg }: { acc: string; bg: string }) {
  return (
    <g>
      {[0,1,2,3].map(n => (
        <line key={n} x1={n * 22 - 8} y1="0" x2={n * 22 + 52} y2="68"
          stroke={acc} strokeWidth="6" opacity="0.10" />
      ))}
      <rect x="18" y="30" width="34" height="24" rx="2" fill={acc} opacity="0.65" />
      <path d="M 52,36 Q 62,36 62,46 Q 62,56 52,56"
        fill="none" stroke={acc} strokeWidth="4" strokeLinecap="round" opacity="0.65" />
      <rect x="13" y="54" width="44" height="6" rx="2" fill={acc} opacity="0.45" />
      {["M 27,27 Q 30,17 27,9", "M 35,25 Q 38,14 35,6", "M 43,27 Q 46,17 43,9"].map((d, i) => (
        <path key={i} d={d} stroke={acc} strokeWidth="2"
          fill="none" strokeLinecap="round" opacity="0.55" />
      ))}
    </g>
  );
}

function ArtBarber({ acc, bg }: { acc: string; bg: string }) {
  return (
    <g>
      <circle cx="35" cy="38" r="9" fill="none" stroke={acc} strokeWidth="2.5" opacity="0.72" />
      {[["35,29","22,13"], ["35,29","48,13"], ["35,47","22,62"], ["35,47","48,62"]].map(([a, b], i) => (
        <line key={i} x1={a.split(",")[0]} y1={a.split(",")[1]}
          x2={b.split(",")[0]} y2={b.split(",")[1]}
          stroke={acc} strokeWidth="4.5" strokeLinecap="round" opacity="0.70" />
      ))}
      <rect x="7" y="10" width="32" height="5" rx="2" fill={acc} opacity="0.38" />
      {[0,1,2,3,4].map(n => (
        <line key={n} x1={9 + n * 6} y1="15" x2={9 + n * 6} y2="24"
          stroke={acc} strokeWidth="1.5" opacity="0.42" />
      ))}
    </g>
  );
}

function ArtDiner({ acc, bg }: { acc: string; bg: string }) {
  return (
    <g>
      {/* Fork */}
      <line x1="24" y1="57" x2="24" y2="14" stroke={acc} strokeWidth="3.5" strokeLinecap="round" opacity="0.75" />
      {[20, 24, 28].map(x => (
        <line key={x} x1={x} y1="14" x2={x} y2="28" stroke={acc} strokeWidth="1.8" strokeLinecap="round" opacity="0.55" />
      ))}
      {/* Knife */}
      <line x1="46" y1="57" x2="46" y2="14" stroke={acc} strokeWidth="3.5" strokeLinecap="round" opacity="0.75" />
      <path d="M 42,14 L 42,34 Q 44,42 46,46 Q 48,42 50,34 L 50,14 Z"
        fill={acc} opacity="0.42" />
      <text x="35" y="42" textAnchor="middle" fill={acc} fontSize="18" opacity="0.78">★</text>
    </g>
  );
}

function ArtInn({ acc, bg }: { acc: string; bg: string }) {
  return (
    <g>
      <circle cx="26" cy="28" r="13" fill="none" stroke={acc} strokeWidth="2.5" opacity="0.75" />
      <circle cx="26" cy="28" r="7"  fill="none" stroke={acc} strokeWidth="1.5" opacity="0.48" />
      <line x1="39" y1="28" x2="60" y2="28" stroke={acc} strokeWidth="3.5" strokeLinecap="round" opacity="0.75" />
      <line x1="53" y1="28" x2="53" y2="36" stroke={acc} strokeWidth="2.5" strokeLinecap="round" opacity="0.62" />
      <line x1="60" y1="28" x2="60" y2="36" stroke={acc} strokeWidth="2.5" strokeLinecap="round" opacity="0.62" />
      <polygon points="26,46 33,53 26,60 19,53"
        stroke={acc} strokeWidth="1.5" fill="none" opacity="0.50" />
      <text x="26" y="56" textAnchor="middle" fill={acc}
        fontSize="8" fontFamily="monospace" fontWeight="bold" opacity="0.70">9</text>
    </g>
  );
}

function ArtWeb({ acc, bg }: { acc: string; bg: string }) {
  return (
    <g>
      <path d="M 19,18 L 51,18 L 51,42 Q 51,58 35,65 Q 19,58 19,42 Z"
        fill={acc} opacity="0.58" />
      <rect x="19" y="18" width="32" height="12" rx="1" fill={bg} opacity="0.65" />
      <text x="35" y="28" textAnchor="middle" fill={acc}
        fontSize="7.5" fontFamily="serif" fontWeight="bold" opacity="0.90">US</text>
      <text x="35" y="56" textAnchor="middle" fill={bg}
        fontSize="24" fontFamily="Georgia, serif" fontWeight="bold" opacity="0.90">9</text>
      {([[10,10],[60,10],[10,62],[60,62]] as [number,number][]).map(([sx,sy],i) => (
        <text key={i} x={sx} y={sy + 4} textAnchor="middle"
          fill={acc} fontSize="10" opacity="0.32">★</text>
      ))}
    </g>
  );
}

function getCoverArt(i: number): (props: { acc: string; bg: string }) => React.ReactElement {
  if (i === 0) return ArtPizza;
  if (i === 1) return ArtCafe;
  if (i === 2) return ArtBarber;
  if (i === 3) return ArtDiner;
  if (i === 4) return ArtInn;
  return ArtWeb;
}

// ── Component ─────────────────────────────────────────────────────────────────

import React from "react";

export function MatchbookCollection() {
  const [revealed, setRevealed] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e?.isIntersecting) { setRevealed(true); obs.disconnect(); } },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{
        background: "linear-gradient(180deg, #060402 0%, #0e0905 100%)",
        padding: "5rem 1.5rem 4rem",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* Warm glow */}
      <div aria-hidden style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        background: "radial-gradient(ellipse at 50% 66%, rgba(180,80,18,0.065) 0%, transparent 62%)",
      }} />

      {/* Labels */}
      <p style={{
        textAlign: "center",
        fontSize: "9px", letterSpacing: "0.32em", textTransform: "uppercase",
        color: "rgba(212,104,42,0.38)", fontFamily: "monospace",
        marginBottom: "0.4rem",
        opacity: revealed ? 1 : 0,
        transition: "opacity 0.5s ease 0.1s",
      }}>
        Route 9 Matchbook Collection · Shrewsbury, MA
      </p>
      <p style={{
        textAlign: "center", marginBottom: "2rem",
        fontSize: "11px", letterSpacing: "0.06em",
        color: "rgba(243,233,213,0.22)",
        fontFamily: "var(--font-display, Georgia), Georgia, serif",
        fontStyle: "italic",
        opacity: revealed ? 1 : 0,
        transition: "opacity 0.5s ease 0.18s",
      }}>
        The neighbors we&apos;re proud to work beside
      </p>

      {/* Fan stage */}
      <div style={{
        position: "relative",
        height: "350px",
        maxWidth: "720px",
        margin: "0 auto",
      }}>
        {BOOKS.map((book, i) => {
          const Art = getCoverArt(i);
          const STRIKE_LINES = Array.from({ length: 9 }, (_, n) => n);
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                bottom: "62px",
                left: "50%",
                width: "70px",
                height: "110px",
                transformOrigin: "35px 110px",
                transform: revealed
                  ? `translateX(calc(-50% + ${book.tx}px)) translateY(${-book.ty}px) rotate(${book.rot}deg)`
                  : `translateX(-50%) translateY(0px) rotate(0deg)`,
                opacity: revealed ? 1 : 0,
                transition: [
                  `transform 0.78s cubic-bezier(0.34,1.4,0.64,1) ${0.06 + i * 0.075}s`,
                  `opacity 0.4s ease ${i * 0.052}s`,
                ].join(", "),
                zIndex: book.z,
              }}
            >
              <svg
                viewBox="0 0 70 110"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                style={{
                  display: "block", width: "100%", height: "100%",
                  filter: "drop-shadow(0 5px 14px rgba(0,0,0,0.72))",
                }}
                aria-label={`${book.label} ${book.sub} matchbook`}
              >
                {/* Cover face */}
                <rect width="70" height="95" rx="2" fill={book.bg} />

                {/* Inner border */}
                <rect x="3" y="3" width="64" height="63" rx="1.5"
                  fill="none" stroke="rgba(255,255,255,0.09)" strokeWidth="1" />

                {/* Cover art */}
                <svg viewBox="0 0 70 68" x="0" y="2" width="70" height="66">
                  <Art acc={book.acc} bg={book.bg} />
                </svg>

                {/* Label band */}
                <rect x="0" y="68" width="70" height="27" fill={book.dark} opacity="0.88" />
                <text x="35" y="80" textAnchor="middle"
                  fill="rgba(255,255,255,0.92)" fontSize="8"
                  fontFamily="monospace" fontWeight="bold" letterSpacing="0.5">
                  {book.label}
                </text>
                <text x="35" y="91" textAnchor="middle"
                  fill={book.acc} fontSize="6.5" fontFamily="monospace" letterSpacing="0.3">
                  {book.sub}
                </text>

                {/* Outer edge highlight */}
                <rect x="0.5" y="0.5" width="69" height="94" rx="1.5"
                  fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="1" />

                {/* Strike strip */}
                <rect x="0" y="95" width="70" height="15" fill="#7a5020" />
                {STRIKE_LINES.map(n => (
                  <line key={n} x1={n * 9} y1="95" x2={n * 9 + 7} y2="110"
                    stroke="rgba(0,0,0,0.18)" strokeWidth="2.5" />
                ))}
                <text x="35" y="105.5" textAnchor="middle"
                  fill="rgba(255,255,255,0.44)" fontSize="5.5"
                  fontFamily="monospace" letterSpacing="0.4">
                  STRIKE HERE
                </text>
              </svg>
            </div>
          );
        })}
      </div>

      {/* Caption */}
      <p style={{
        textAlign: "center", marginTop: "0.75rem",
        fontSize: "10px", letterSpacing: "0.14em",
        color: "rgba(243,233,213,0.18)", fontFamily: "monospace",
        opacity: revealed ? 1 : 0,
        transition: "opacity 0.5s ease 0.85s",
      }}>
        Close-knit. Hand-picked. All on Route 9.
      </p>
    </div>
  );
}
