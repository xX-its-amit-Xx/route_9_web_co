"use client";

// PinballMachine ─────────────────────────────────────────────────────────────
//
// Retro arcade pinball machine — the Route 9 "high score" table showing
// our value-props as pinball achievements.  All animation is SVG-native
// or CSS; no external deps beyond lucide (not used).
//
// Layering (back → front):
//   1. Section: dark arcade-parlor background
//   2. Cabinet outer frame (walnut gradient)
//   3. Backglass art panel: neon title + bumpers + score table
//   4. Score reels / LED readout
//   5. Lower control-panel strip with plunger & buttons

import { useEffect, useRef, useState } from "react";

// ── Data ──────────────────────────────────────────────────────────────────────

const HIGH_SCORES: readonly [string, number, string, string][] = [
  // [player, score, achievement, color]
  ["AMT1", 48000, "48-HOUR BUILD",   "#ff6a1a"],
  ["RTE9", 45800, "FREE PREVIEW",    "#ffd700"],
  ["SHRW", 44200, "ZERO LOCK-IN",    "#4de8d4"],
  ["LOC1", 42600, "MOBILE-FIRST",    "#ff6a1a"],
  ["FAST", 39999, "SAME-WEEK LIVE",  "#ffd700"],
] as const;

// Bumper circles: [cx, cy, r, color, label, blinkDelay]
const BUMPERS: readonly [number, number, number, string, string, string][] = [
  [148, 248, 28, "#ff1a5e", "SEO",      "0s"   ],
  [268, 216, 26, "#ffaa00", "MOBILE",   "0.5s" ],
  [388, 248, 28, "#00c8ff", "FAST",     "1.0s" ],
  [208, 302, 22, "#ff6a1a", "HOSTED",   "0.3s" ],
  [328, 302, 22, "#aa55ff", "SUPPORT",  "0.8s" ],
] as const;

// ── Component ─────────────────────────────────────────────────────────────────

export function PinballMachine() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible]   = useState(false);
  const [ballX,   setBallX]     = useState(268);
  const [ballY,   setBallY]     = useState(390);
  const [ballDir, setBallDir]   = useState<[number, number]>([1.4, -2.1]);
  const rafRef = useRef<number>(0);

  // Scroll reveal
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // Ball physics — simple AABB bounce inside playfield rect
  // playfield: x=60–476, y=185–430
  useEffect(() => {
    if (!visible) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const PL = 72, PR = 464, PT = 188, PB = 424;
    let x = 268, y = 390, dx = 1.4, dy = -2.1;
    const tick = () => {
      x += dx; y += dy;
      if (x <= PL + 8 || x >= PR - 8) dx = -dx;
      if (y <= PT + 8 || y >= PB - 8) dy = -dy;
      // Nudge away from bumpers
      BUMPERS.forEach(([bx, by, br]) => {
        const dist = Math.hypot(x - bx, y - by);
        if (dist < br + 9) {
          const ang = Math.atan2(y - by, x - bx);
          dx = Math.cos(ang) * 2.2;
          dy = Math.sin(ang) * 2.2;
        }
      });
      setBallX(Math.round(x));
      setBallY(Math.round(y));
      setBallDir([dx, dy]);
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [visible]);

  return (
    <section
      ref={sectionRef}
      aria-label="Route 9 Pinball — achievements"
      style={{
        background: "radial-gradient(ellipse at 50% 30%, #1a0530 0%, #0a0115 55%, #050010 100%)",
        padding: "5rem 1.5rem",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* Ambient neon floor glow */}
      <div aria-hidden style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        background: "radial-gradient(ellipse at 50% 100%, rgba(255,106,26,0.08) 0%, transparent 55%)",
      }} />

      {/* Section label */}
      <p aria-hidden style={{
        textAlign: "center",
        fontSize: "9px", letterSpacing: "0.28em", textTransform: "uppercase",
        color: "rgba(255,215,0,0.35)", marginBottom: "1.5rem",
        fontFamily: "monospace",
        opacity: visible ? 1 : 0,
        transition: "opacity 0.6s ease 0.2s",
      }}>
        Insert Coin · Route 9 Pinball Co.
      </p>

      {/* Cabinet */}
      <div style={{
        maxWidth: "560px", margin: "0 auto",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0) scale(1)" : "translateY(32px) scale(0.96)",
        transition: "opacity 0.7s cubic-bezier(0.22,1,0.36,1) 0.15s, transform 0.7s cubic-bezier(0.22,1,0.36,1) 0.15s",
      }}>
        <svg
          viewBox="0 0 536 660"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ display: "block", width: "100%", height: "auto" }}
          role="img"
          aria-label="Retro pinball machine high score screen"
        >
          <defs>
            {/* Cabinet wood */}
            <linearGradient id="pb-wood" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%"   stopColor="#1a0e06" />
              <stop offset="12%"  stopColor="#2c1a0a" />
              <stop offset="50%"  stopColor="#241508" />
              <stop offset="88%"  stopColor="#2c1a0a" />
              <stop offset="100%" stopColor="#1a0e06" />
            </linearGradient>
            {/* Backglass */}
            <linearGradient id="pb-glass" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"   stopColor="#0d0020" />
              <stop offset="100%" stopColor="#08001a" />
            </linearGradient>
            {/* Score panel */}
            <linearGradient id="pb-panel" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"   stopColor="#100008" />
              <stop offset="100%" stopColor="#08000c" />
            </linearGradient>
            {/* Chrome strip */}
            <linearGradient id="pb-chrome" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"   stopColor="#888" />
              <stop offset="50%"  stopColor="#ccc" />
              <stop offset="100%" stopColor="#666" />
            </linearGradient>
            {/* Neon glow filter */}
            <filter id="pb-neon" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="3.5" result="b" />
              <feMerge>
                <feMergeNode in="b" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            {/* Soft glow */}
            <filter id="pb-glow" x="-60%" y="-60%" width="220%" height="220%">
              <feGaussianBlur stdDeviation="6" result="b" />
              <feMerge>
                <feMergeNode in="b" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            {/* Bump glow */}
            <filter id="pb-bump" x="-40%" y="-40%" width="180%" height="180%">
              <feGaussianBlur stdDeviation="4" result="b" />
              <feMerge>
                <feMergeNode in="b" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            {/* LED scan-line */}
            <pattern id="pb-scan" x="0" y="0" width="1" height="3" patternUnits="userSpaceOnUse">
              <rect width="1" height="1" fill="rgba(0,0,0,0.25)" />
            </pattern>
            {/* Ball radial */}
            <radialGradient id="pb-ball" cx="35%" cy="30%" r="65%">
              <stop offset="0%"   stopColor="#fffbe0" />
              <stop offset="50%"  stopColor="#ffd700" />
              <stop offset="100%" stopColor="#b8860b" />
            </radialGradient>
          </defs>

          {/* ── CABINET OUTER ── */}
          <rect x="18" y="0"   width="500" height="660" rx="10" fill="url(#pb-wood)" />
          {/* Chrome edge strips */}
          <rect x="18" y="0"   width="8"   height="660" rx="4" fill="url(#pb-chrome)" opacity="0.6" />
          <rect x="510" y="0"  width="8"   height="660" rx="4" fill="url(#pb-chrome)" opacity="0.6" />
          {/* Top arch */}
          <path d="M 26,0 L 510,0 Q 518,0 518,10 L 518,30 Q 268,8 18,30 L 18,10 Q 18,0 26,0 Z"
            fill="#221408" />
          <rect x="18" y="28"  width="500" height="5" fill="url(#pb-chrome)" opacity="0.5" />

          {/* ── BACKGLASS ── */}
          <rect x="30" y="38"  width="476" height="400" rx="6" fill="url(#pb-glass)" />
          {/* Glass reflection */}
          <rect x="30" y="38"  width="476" height="400" rx="6" fill="url(#pb-scan)" opacity="0.4" />
          {/* Inner glow border */}
          <rect x="30" y="38"  width="476" height="400" rx="6"
            stroke="rgba(180,50,255,0.25)" strokeWidth="1.5" />

          {/* ── BACKGLASS ART: sky + road ── */}
          <rect x="30" y="38"  width="476" height="180" rx="6" fill="#0a0018" />
          {/* Stars */}
          {[
            [60,60],[120,50],[200,70],[300,45],[380,65],[450,55],[90,90],[170,80],
            [250,55],[340,80],[420,48],[480,75],[130,105],[310,95],[460,110],
          ].map(([sx,sy],i) => (
            <circle key={i} cx={sx} cy={sy} r={i%3===0?1.5:0.9}
              fill={`rgba(220,230,255,${0.4+(i%4)*0.1})`}>
              <animate attributeName="opacity"
                values={`${0.4+(i%4)*0.1};${0.7+(i%3)*0.1};${0.4+(i%4)*0.1}`}
                dur={`${2.8+(i%5)*0.4}s`} begin={`${(i*0.3)%2.5}s`} repeatCount="indefinite"/>
            </circle>
          ))}
          {/* Route 9 road receding to vanishing point */}
          <path d="M 268,218 L 180,218 L 50,360 L 486,360 L 355,218 Z" fill="#12001e" opacity="0.9"/>
          <path d="M 268,218 L 220,218 L 120,360 L 416,360 L 316,218 Z" fill="#0a0014" opacity="0.8"/>
          {/* Center line dashes */}
          {[0,1,2,3,4,5].map(i => {
            const t = (i + 0.5) / 6;
            const y1 = 218 + t * 142;
            const y2 = 218 + (t + 0.06) * 142;
            const x1 = 268 + (t - 0.5) * 8;
            return <line key={i} x1={x1} y1={y1} x2={x1} y2={y2}
              stroke="rgba(255,215,50,0.3)" strokeWidth="2" strokeLinecap="round"/>;
          })}

          {/* ── NEON TITLE ── */}
          {/* Glow halo */}
          <text x="268" y="108" textAnchor="middle"
            fill="rgba(255,80,200,0.22)"
            fontSize="46" fontFamily="Impact, Haettenschweiler, sans-serif"
            letterSpacing="4" filter="url(#pb-glow)">
            ROUTE 9
          </text>
          {/* Title text */}
          <text x="268" y="108" textAnchor="middle"
            fill="#ff40c8" fontSize="46"
            fontFamily="Impact, Haettenschweiler, sans-serif"
            letterSpacing="4" filter="url(#pb-neon)">
            ROUTE 9
            <animate attributeName="opacity" values="1;0.88;1;0.94;1"
              dur="3.2s" begin="0s" repeatCount="indefinite"/>
          </text>
          {/* Subtitle */}
          <text x="268" y="132" textAnchor="middle"
            fill="rgba(255,215,0,0.85)" fontSize="16"
            fontFamily="Impact, Haettenschweiler, sans-serif"
            letterSpacing="8" filter="url(#pb-neon)">
            PINBALL
            <animate attributeName="opacity" values="0.85;0.7;0.85"
              dur="4.1s" begin="0.3s" repeatCount="indefinite"/>
          </text>
          {/* Shrewsbury MA */}
          <text x="268" y="152" textAnchor="middle"
            fill="rgba(100,220,255,0.7)" fontSize="10"
            fontFamily="monospace" letterSpacing="5">
            SHREWSBURY · MASSACHUSETTS
          </text>

          {/* ── US ROUTE 9 SHIELD ── */}
          <g transform="translate(228,156)">
            <path d="M 0,0 L 40,0 L 40,38 Q 40,52 20,60 Q 0,52 0,38 Z"
              fill="#080018" stroke="rgba(100,220,255,0.5)" strokeWidth="1.5"/>
            <path d="M 4,4 L 36,4 L 36,38 Q 36,49 20,56 Q 4,49 4,38 Z"
              fill="#100025"/>
            <rect x="0" y="0" width="40" height="16" rx="3" fill="#080018"/>
            <text x="20" y="13" textAnchor="middle" fill="rgba(255,255,255,0.9)"
              fontSize="9" fontFamily="sans-serif" fontWeight="bold">US</text>
            <text x="20" y="42" textAnchor="middle" fill="rgba(255,255,255,0.95)"
              fontSize="22" fontFamily="Georgia, serif" fontWeight="bold">9</text>
          </g>

          {/* ── PLAYFIELD ── */}
          <rect x="60" y="220" width="416" height="218" rx="4" fill="#06000f"/>
          {/* Playfield border */}
          <rect x="60" y="220" width="416" height="218" rx="4"
            stroke="rgba(255,106,26,0.2)" strokeWidth="1"/>

          {/* Bumpers */}
          {BUMPERS.map(([bx, by, br, col, lbl, delay], i) => (
            <g key={i}>
              {/* Outer ring glow */}
              <circle cx={bx} cy={by} r={br + 8} fill={col} opacity="0.07">
                <animate attributeName="opacity" values="0.07;0.18;0.07"
                  dur={`${1.2+(i*0.22)%0.8}s`} begin={delay} repeatCount="indefinite"/>
              </circle>
              {/* Bumper body */}
              <circle cx={bx} cy={by} r={br} fill="#0a0020"
                stroke={col} strokeWidth="2.5" filter="url(#pb-bump)">
                <animate attributeName="stroke-opacity" values="0.8;1;0.8"
                  dur={`${1.2+(i*0.22)%0.8}s`} begin={delay} repeatCount="indefinite"/>
              </circle>
              {/* Inner dot */}
              <circle cx={bx} cy={by} r={br * 0.38} fill={col} opacity="0.75">
                <animate attributeName="opacity" values="0.6;1;0.6"
                  dur={`${1.2+(i*0.22)%0.8}s`} begin={delay} repeatCount="indefinite"/>
              </circle>
              {/* Label */}
              <text x={bx} y={by + 4} textAnchor="middle" fill="rgba(255,255,255,0.9)"
                fontSize="8" fontFamily="monospace" fontWeight="bold">{lbl}</text>
            </g>
          ))}

          {/* Flippers */}
          <g transform="translate(268,432)">
            {/* Left flipper */}
            <path d="M -90,0 L -20,-14 L -20,2 Z" fill="#ffd700"
              stroke="rgba(255,215,0,0.6)" strokeWidth="1.5">
              <animateTransform attributeName="transform" type="rotate"
                values="0;-28;0" dur="2.1s" begin="1.8s" repeatCount="indefinite"
                calcMode="spline" keySplines="0.4 0 0.6 1;0.4 0 0.6 1"/>
            </path>
            {/* Right flipper */}
            <path d="M 90,0 L 20,-14 L 20,2 Z" fill="#ffd700"
              stroke="rgba(255,215,0,0.6)" strokeWidth="1.5">
              <animateTransform attributeName="transform" type="rotate"
                values="0;28;0" dur="2.1s" begin="1.8s" repeatCount="indefinite"
                calcMode="spline" keySplines="0.4 0 0.6 1;0.4 0 0.6 1"/>
            </path>
          </g>

          {/* Ball */}
          <circle cx={ballX} cy={ballY} r="8" fill="url(#pb-ball)"
            filter="url(#pb-neon)"/>

          {/* ── SCORE TABLE PANEL ── */}
          <rect x="30" y="443" width="476" height="170" rx="4" fill="url(#pb-panel)"/>
          <rect x="30" y="443" width="476" height="170" rx="4"
            stroke="rgba(255,106,26,0.15)" strokeWidth="1"/>
          {/* Scan lines on score panel */}
          <rect x="30" y="443" width="476" height="170" rx="4"
            fill="url(#pb-scan)" opacity="0.5"/>

          {/* "HIGH SCORES" label */}
          <text x="268" y="466" textAnchor="middle"
            fill="rgba(255,215,0,0.9)" fontSize="11"
            fontFamily="monospace" letterSpacing="6" filter="url(#pb-neon)">
            HIGH  SCORES
            <animate attributeName="opacity" values="1;0.75;1"
              dur="1.6s" begin="0s" repeatCount="indefinite"/>
          </text>

          {/* Score entries */}
          {HIGH_SCORES.map(([code, pts, achievement, color], i) => (
            <g key={i}>
              {/* Row background on hover highlight — static alternating */}
              {i === 0 && (
                <rect x="38" y={477 + i * 24} width="460" height="22" rx="2"
                  fill="rgba(255,106,26,0.08)"/>
              )}
              {/* Rank */}
              <text x="58" y={493 + i * 24} textAnchor="middle"
                fill="rgba(255,215,0,0.55)" fontSize="10" fontFamily="monospace">
                {i + 1}
              </text>
              {/* Player code */}
              <text x="96" y={493 + i * 24} textAnchor="middle"
                fill="rgba(255,255,255,0.8)" fontSize="10"
                fontFamily="monospace" fontWeight="bold" letterSpacing="1">
                {code}
              </text>
              {/* Score */}
              <text x="220" y={493 + i * 24} textAnchor="end"
                fill={color} fontSize="11" fontFamily="monospace" fontWeight="bold"
                filter="url(#pb-neon)">
                {pts.toLocaleString()}
              </text>
              {/* Achievement label */}
              <text x="234" y={493 + i * 24} textAnchor="start"
                fill="rgba(200,200,255,0.65)" fontSize="9"
                fontFamily="monospace" letterSpacing="1">
                {achievement}
              </text>
            </g>
          ))}

          {/* "FREE GAME" blink */}
          <text x="268" y="603" textAnchor="middle"
            fill="#ff1a5e" fontSize="11" fontFamily="monospace"
            letterSpacing="5" filter="url(#pb-neon)">
            FREE GAME
            <animate attributeName="opacity" values="1;1;0;0;1;1"
              keyTimes="0;0.4;0.41;0.59;0.6;1"
              dur="1.8s" begin="0s" repeatCount="indefinite"/>
          </text>

          {/* ── CONTROL PANEL ── */}
          <rect x="18" y="614" width="500" height="46" rx="0" fill="#1a0e06"/>
          <rect x="18" y="614" width="500" height="5" fill="url(#pb-chrome)" opacity="0.5"/>
          {/* Player buttons */}
          <circle cx="90" cy="637" r="12" fill="#0a0008"
            stroke="rgba(255,106,26,0.5)" strokeWidth="2"/>
          <text x="90" y="641" textAnchor="middle" fill="rgba(255,106,26,0.8)"
            fontSize="7" fontFamily="monospace" letterSpacing="0.5">1 PLAYER</text>
          <circle cx="446" cy="637" r="12" fill="#0a0008"
            stroke="rgba(255,215,0,0.5)" strokeWidth="2"/>
          <text x="446" y="641" textAnchor="middle" fill="rgba(255,215,0,0.8)"
            fontSize="7" fontFamily="monospace" letterSpacing="0.5">2 PLAYER</text>
          {/* Plunger */}
          <rect x="260" y="622" width="16" height="24" rx="4" fill="#2a1a0a"
            stroke="rgba(200,200,200,0.3)" strokeWidth="1"/>
          <circle cx="268" cy="628" r="6" fill="#888"/>
          <circle cx="268" cy="628" r="3" fill="#ccc"/>
          {/* Score displays */}
          <rect x="120" y="622" width="110" height="20" rx="2" fill="#050010"/>
          <text x="175" y="636" textAnchor="middle" fill="rgba(255,106,26,0.9)"
            fontSize="10" fontFamily="monospace">00  48,000</text>
          <rect x="306" y="622" width="110" height="20" rx="2" fill="#050010"/>
          <text x="361" y="636" textAnchor="middle" fill="rgba(255,215,0,0.9)"
            fontSize="10" fontFamily="monospace">00  45,800</text>

          {/* Cabinet legs */}
          <rect x="52" y="652" width="16" height="8" rx="2" fill="#140c04"/>
          <rect x="468" y="652" width="16" height="8" rx="2" fill="#140c04"/>
        </svg>
      </div>

      {/* "How to win" caption */}
      <p style={{
        textAlign: "center", marginTop: "1.5rem",
        fontSize: "10px", letterSpacing: "0.18em",
        color: "rgba(255,215,0,0.28)", fontFamily: "monospace",
        opacity: visible ? 1 : 0,
        transition: "opacity 0.6s ease 0.8s",
      }}>
        Every achievement above is how Route 9 Web Co plays the game.
      </p>
    </section>
  );
}
