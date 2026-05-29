"use client";

// Typewriter ─────────────────────────────────────────────────────────────────
//
// Scroll-triggered vintage mechanical typewriter that types out a Route 9
// testimonial character-by-character on the paper. SVG machine illustration
// in hunter green / ivory / chrome. Per-character reveal via staggered
// setTimeout. Placed between Testimonials and ShrewsburyGazette.

import { useEffect, useRef, useState } from "react";

const QUOTE = [
  `"My shop was invisible online.`,
  ` Route 9 Web Co. fixed that in`,
  ` five days. Customers find us`,
  ` first now. Worth every cent."`,
  ``,
  `    — Maria, Shrewsbury Florist`,
].join("\n");

const TYPE_MS = 42;

const KEY_ROWS: string[] = ["1234567890", "QWERTYUIOP", "ASDFGHJKL", "ZXCVBNM"];
const KEY_Y:    number[] = [360, 395, 430, 465];
const KEY_XOFF: number[] = [0, 12, 22, 44]; // rightward stagger per row
const KEY_STEP  = 38;
const KEY_CX    = 450; // machine x-center

// Typebar guide positions (decorative, computed once)
const TYPEBAR_X: number[] = Array.from({ length: 22 }, (_, i) => 154 + i * 26);

// Ventilation slots on each side
const VENTS: number[] = [335, 352, 369, 386, 403];

export function Typewriter() {
  const [count,  setCount]  = useState(0);
  const [active, setActive] = useState(false);
  const [blink,  setBlink]  = useState(true);
  const ref = useRef<HTMLDivElement>(null);

  // Scroll trigger
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e?.isIntersecting) { setActive(true); obs.disconnect(); } },
      { threshold: 0.22 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // Per-character typing
  useEffect(() => {
    if (!active || count >= QUOTE.length) return;
    const id = setTimeout(() => setCount(c => c + 1), TYPE_MS);
    return () => clearTimeout(id);
  }, [active, count]);

  // Cursor blink
  useEffect(() => {
    const id = setInterval(() => setBlink(v => !v), 530);
    return () => clearInterval(id);
  }, []);

  const done  = count >= QUOTE.length;
  const lines = QUOTE.slice(0, count).split("\n");

  return (
    <div
      ref={ref}
      style={{
        background: "linear-gradient(180deg, #080503 0%, #0d0906 100%)",
        padding: "5rem 1.5rem 4rem",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* Warm ambient glow */}
      <div aria-hidden style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        background: "radial-gradient(ellipse at 50% 58%, rgba(40,90,16,0.07) 0%, transparent 62%)",
      }} />

      {/* Section label */}
      <p style={{
        textAlign: "center",
        fontSize: "9px", letterSpacing: "0.32em", textTransform: "uppercase",
        color: "rgba(212,104,42,0.38)", fontFamily: "monospace",
        marginBottom: "2rem",
        opacity: active ? 1 : 0,
        transition: "opacity 0.5s ease 0.1s",
      }}>
        Route 9 Web Co. · Neighbor Dispatch · Volume I
      </p>

      {/* Machine wrapper */}
      <div style={{
        maxWidth: "900px", margin: "0 auto",
        opacity: active ? 1 : 0,
        transform: active ? "translateY(0)" : "translateY(26px)",
        transition: "opacity 0.7s cubic-bezier(0.22,1,0.36,1) 0.15s, transform 0.7s cubic-bezier(0.22,1,0.36,1) 0.15s",
      }}>
        <svg
          viewBox="0 0 900 508"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ display: "block", width: "100%", height: "auto" }}
          role="img"
          aria-label="Vintage typewriter printing a customer testimonial"
        >
          <defs>
            <linearGradient id="tw-body" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"   stopColor="#243a14" />
              <stop offset="100%" stopColor="#192c0e" />
            </linearGradient>
            <linearGradient id="tw-face" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"   stopColor="#2e4a1c" />
              <stop offset="100%" stopColor="#223814" />
            </linearGradient>
            <linearGradient id="tw-platen" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"   stopColor="#182a0a" />
              <stop offset="60%"  stopColor="#0c1a06" />
              <stop offset="100%" stopColor="#081202" />
            </linearGradient>
            <radialGradient id="tw-key-shine" cx="32%" cy="28%" r="62%">
              <stop offset="0%"   stopColor="rgba(255,255,255,0.30)" />
              <stop offset="100%" stopColor="rgba(255,255,255,0)" />
            </radialGradient>
            <filter id="tw-drop" x="-10%" y="-8%" width="120%" height="135%">
              <feDropShadow dx="0" dy="14" stdDeviation="20"
                floodColor="rgba(0,0,0,0.82)" floodOpacity="1" />
            </filter>
          </defs>

          {/* ── PAPER ──────────────────────────────────────── */}
          <rect x="198" y="34" width="504" height="184" rx="2"
            fill="#fdf8ec" filter="url(#tw-drop)" />
          {/* Paper right shadow */}
          <rect x="699" y="38" width="4" height="176" rx="1"
            fill="rgba(0,0,0,0.07)" />
          {/* Ruled lines */}
          {[76, 93, 110, 127, 144, 161, 178, 196].map(ly => (
            <line key={ly} x1="202" y1={ly} x2="698" y2={ly}
              stroke="#ead2ba" strokeWidth="0.6" />
          ))}
          {/* Red margin line */}
          <line x1="236" y1="38" x2="236" y2="216"
            stroke="rgba(195,55,55,0.38)" strokeWidth="0.9" />
          {/* Punch holes */}
          {[70, 130, 190].map(py => (
            <circle key={py} cx="214" cy={py} r="3.5"
              fill="rgba(195,180,155,0.50)" />
          ))}

          {/* ── TYPED TEXT ────────────────────────────────── */}
          <text
            x="248"
            y="78"
            fontFamily='"Courier New", Courier, monospace'
            fontSize="13.5"
            fill="#2a1a08"
            style={{ userSelect: "none" } as React.CSSProperties}
          >
            {lines.map((line, li) => (
              <tspan key={li} x="248" dy={li === 0 ? "0" : "1.55em"}>
                {line === "" ? " " : line}
                {!done && li === lines.length - 1 && blink ? "▌" : ""}
              </tspan>
            ))}
          </text>

          {/* ── PLATEN (roller) ────────────────────────────── */}
          <rect x="144" y="202" width="612" height="48" rx="24"
            fill="url(#tw-platen)" filter="url(#tw-drop)" />
          {/* Platen highlight */}
          <rect x="148" y="210" width="604" height="7" rx="3"
            fill="rgba(70,120,36,0.22)" />
          {/* Left knob */}
          <circle cx="132" cy="226" r="19" fill="#545444" />
          <circle cx="132" cy="226" r="13" fill="#666454" />
          <circle cx="132" cy="226" r="5"  fill="#424232" />
          {[0,60,120,180,240,300].map(a => (
            <line key={a}
              x1={132 + 6 * Math.cos(a * Math.PI / 180)}
              y1={226 + 6 * Math.sin(a * Math.PI / 180)}
              x2={132 + 12 * Math.cos(a * Math.PI / 180)}
              y2={226 + 12 * Math.sin(a * Math.PI / 180)}
              stroke="rgba(0,0,0,0.3)" strokeWidth="1" />
          ))}
          {/* Right knob */}
          <circle cx="768" cy="226" r="19" fill="#545444" />
          <circle cx="768" cy="226" r="13" fill="#666454" />
          <circle cx="768" cy="226" r="5"  fill="#424232" />
          {[0,60,120,180,240,300].map(a => (
            <line key={a}
              x1={768 + 6 * Math.cos(a * Math.PI / 180)}
              y1={226 + 6 * Math.sin(a * Math.PI / 180)}
              x2={768 + 12 * Math.cos(a * Math.PI / 180)}
              y2={226 + 12 * Math.sin(a * Math.PI / 180)}
              stroke="rgba(0,0,0,0.3)" strokeWidth="1" />
          ))}
          {/* Paper guide clips */}
          <rect x="316" y="200" width="9" height="22" rx="2" fill="#888076" />
          <rect x="575" y="200" width="9" height="22" rx="2" fill="#888076" />

          {/* ── MACHINE BODY ───────────────────────────────── */}
          <rect x="116" y="248" width="668" height="244" rx="15"
            fill="url(#tw-body)" filter="url(#tw-drop)" />

          {/* ── TYPEBAR / RIBBON MECHANISM ─────────────────── */}
          <rect x="126" y="248" width="648" height="60" rx="9"
            fill="rgba(6,12,3,0.90)" />
          {/* Typebar guides */}
          {TYPEBAR_X.map(tx => (
            <rect key={tx} x={tx} y="250" width="2.8" height="54"
              fill="rgba(55,88,28,0.22)" />
          ))}
          {/* Ribbon spools */}
          {[300, 580].map(sx => (
            <g key={sx}>
              <rect x={sx} y="258" width="88" height="32" rx="4"
                fill="#18200c" stroke="rgba(110,130,60,0.22)" strokeWidth="1" />
              <circle cx={sx + 44} cy="274" r="15"
                fill="#221006" stroke="rgba(140,120,70,0.28)" strokeWidth="1" />
              <circle cx={sx + 44} cy="274" r="6" fill="#160c04" />
              {[0, 72, 144, 216, 288].map(a => (
                <line key={a}
                  x1={sx + 44 + 7 * Math.cos(a * Math.PI / 180)}
                  y1={274  + 7 * Math.sin(a * Math.PI / 180)}
                  x2={sx + 44 + 13 * Math.cos(a * Math.PI / 180)}
                  y2={274  + 13 * Math.sin(a * Math.PI / 180)}
                  stroke="rgba(0,0,0,0.35)" strokeWidth="1" />
              ))}
            </g>
          ))}
          {/* Ribbon thread */}
          <path d="M 344,274 Q 450,261 556,274"
            stroke="#7a1208" strokeWidth="3.5" strokeLinecap="round" fill="none" />

          {/* ── FRONT KEY FACE ─────────────────────────────── */}
          <rect x="126" y="308" width="648" height="180" rx="10"
            fill="url(#tw-face)" />

          {/* ── KEYS ───────────────────────────────────────── */}
          {KEY_ROWS.map((row, ri) => {
            const chars  = row.split("");
            const n      = chars.length;
            const ry     = KEY_Y[ri]    ?? 360;
            const xoff   = KEY_XOFF[ri] ?? 0;
            const startX = KEY_CX - (n - 1) * KEY_STEP / 2 + xoff;
            return (
              <g key={ri}>
                {chars.map((ch, ki) => {
                  const kx = startX + ki * KEY_STEP;
                  return (
                    <g key={ki}>
                      {/* Shadow */}
                      <circle cx={kx} cy={ry + 3} r="14.5"
                        fill="rgba(0,0,0,0.50)" />
                      {/* Key body */}
                      <circle cx={kx} cy={ry} r="14.5"
                        fill="#bfb69c" stroke="#9e957c" strokeWidth="1" />
                      {/* Key cap */}
                      <circle cx={kx} cy={ry - 1.5} r="12.5" fill="#ddd5bc" />
                      {/* Shine */}
                      <circle cx={kx} cy={ry - 1.5} r="12.5"
                        fill="url(#tw-key-shine)" />
                      {/* Letter */}
                      <text x={kx} y={ry + 3.8} textAnchor="middle"
                        fill="#28200e" fontSize="9.5"
                        fontFamily="monospace" fontWeight="bold">
                        {ch}
                      </text>
                    </g>
                  );
                })}
              </g>
            );
          })}

          {/* Space bar */}
          <rect x="300" y="480" width="300" height="22" rx="11"
            fill="#bfb69c" stroke="#9e957c" strokeWidth="1" />
          <rect x="302" y="479" width="296" height="18" rx="9" fill="#ddd5bc" />
          <rect x="302" y="479" width="296" height="18" rx="9"
            fill="url(#tw-key-shine)" />

          {/* ── CARRIAGE RETURN LEVER ──────────────────────── */}
          <path d="M 120,226 Q 100,212 92,198 Q 86,186 94,178"
            stroke="#989080" strokeWidth="5.5" strokeLinecap="round" fill="none" />
          <circle cx="94"  cy="175" r="8"  fill="#989080" />
          <circle cx="94"  cy="175" r="4.5" fill="#b8b0a0" />

          {/* ── SIDE VENTS ─────────────────────────────────── */}
          {VENTS.map(vy => (
            <g key={vy}>
              <line x1="120" y1={vy} x2="132" y2={vy}
                stroke="rgba(90,130,48,0.32)" strokeWidth="1.8" />
              <line x1="768" y1={vy} x2="780" y2={vy}
                stroke="rgba(90,130,48,0.32)" strokeWidth="1.8" />
            </g>
          ))}

          {/* ── BRAND PLATE ────────────────────────────────── */}
          <rect x="372" y="316" width="156" height="22" rx="3"
            fill="rgba(170,150,72,0.16)"
            stroke="rgba(170,150,72,0.34)" strokeWidth="0.7" />
          <text x="450" y="331" textAnchor="middle"
            fill="rgba(190,165,68,0.72)" fontSize="8.5"
            fontFamily="monospace" fontWeight="bold" letterSpacing="1.4">
            ROUTE 9 · SHREWSBURY
          </text>

          {/* ── CHROME BOTTOM TRIM ─────────────────────────── */}
          <rect x="126" y="483" width="648" height="6" rx="3"
            fill="#888070" opacity="0.45" />

          {/* ── RUBBER FEET ────────────────────────────────── */}
          <ellipse cx="202" cy="490" rx="24" ry="5.5" fill="#1a1208" />
          <ellipse cx="698" cy="490" rx="24" ry="5.5" fill="#1a1208" />
          <ellipse cx="202" cy="496" rx="16" ry="7"   fill="#0e0c06" />
          <ellipse cx="698" cy="496" rx="16" ry="7"   fill="#0e0c06" />
        </svg>
      </div>

      {/* Bottom caption */}
      <p style={{
        textAlign: "center", marginTop: "1.5rem",
        fontSize: "10px", letterSpacing: "0.14em",
        color: "rgba(243,233,213,0.18)", fontFamily: "monospace",
        opacity: active ? 1 : 0,
        transition: "opacity 0.5s ease 1.4s",
      }}>
        Every testimonial written by a Route 9 neighbor. Every word real.
      </p>
    </div>
  );
}
