"use client";

// CelestialOrrery ─────────────────────────────────────────────────────────────
//
// Full-section animated brass orrery. Five orbital bodies (Design, Build,
// Launch, Grow, Maintain) circle a central Route 9 sun via CSS @keyframes
// rotation with transformOrigin at the centre sphere. Each arm+planet+label
// group orbits at period proportional to r (inner = faster). Decorative
// meridian ring with 36-tick bezel, arc text, equatorial cross, tripod stand,
// and deterministic star field behind the mechanism.
// Placed between NightSky and Lighthouse.

import { useEffect, useRef, useState } from "react";

const CX = 720;
const CY = 272;

type Body = {
  label: string;
  r: number;
  pr: number;
  a0: number;
  period: number;
  fill: string;
  edge: string;
};

const BODIES: Body[] = [
  { label: "DESIGN",   r:  88, pr: 13, a0:   0, period:  5.8, fill: "#dca830", edge: "#8a5e10" },
  { label: "BUILD",    r: 128, pr: 15, a0:  68, period:  9.4, fill: "#c88020", edge: "#7a5010" },
  { label: "LAUNCH",   r: 168, pr: 12, a0: 148, period: 13.8, fill: "#e09222", edge: "#9a6218" },
  { label: "GROW",     r: 206, pr: 14, a0: 228, period: 18.4, fill: "#c67818", edge: "#8a5010" },
  { label: "MAINTAIN", r: 244, pr: 11, a0: 308, period: 24.0, fill: "#b86e18", edge: "#7c4a10" },
];

// 36 meridian ticks every 10°
const TICKS = Array.from({ length: 36 }, (_, i) => {
  const deg = i * 10 - 90;
  const a   = deg * Math.PI / 180;
  const maj = i % 9 === 0;
  const r1  = maj ? 256 : 262;
  return {
    x1: (CX + r1  * Math.cos(a)).toFixed(1),
    y1: (CY + r1  * Math.sin(a)).toFixed(1),
    x2: (CX + 272 * Math.cos(a)).toFixed(1),
    y2: (CY + 272 * Math.sin(a)).toFixed(1),
    maj,
  };
});

const ARC_TEXT = "ROUTE 9 WEB CO. · SHREWSBURY MASSACHUSETTS ·";
const ARC_R    = 290;

// Tripod leg endpoints
const TRIPOD: [number, number][] = [
  [CX - 62, CY + 270],
  [CX + 62, CY + 270],
  [CX,      CY + 266],
];

// Corona ray count
const CORONA_COUNT = 12;

// Deterministic star field [x, y, r]
const STARS: [number, number, number][] = [
  [68,  42, 1.0], [132, 88, 0.7], [196, 32, 1.1], [254, 74, 0.8],
  [312, 46, 1.2], [376, 22, 0.6], [440, 58, 0.9], [508, 38, 1.1],
  [100, 148, 0.7], [168, 172, 1.0], [232, 126, 0.8], [296, 156, 0.6],
  [82,  238, 1.1], [148, 214, 0.7], [212, 248, 0.9], [276, 232, 0.6],
  [80,  348, 0.8], [144, 370, 1.0], [206, 330, 0.6], [268, 368, 1.1],
  [94,  448, 0.9], [158, 474, 0.7], [218, 438, 1.2], [276, 462, 0.8],
  [338, 492, 0.6], [398, 510, 1.0], [456, 480, 0.8], [514, 502, 0.7],
  [576, 24,  1.1], [632, 48, 0.8],  [692, 20,  0.7], [750, 28,  1.0],
  [806, 50,  0.8], [864, 24, 1.2],  [918, 44,  0.7], [974, 20,  0.9],
  [1028, 38, 1.0], [1082, 52, 0.7], [1134, 32, 1.1], [1188, 58, 0.8],
  [1246, 40, 0.9], [1302, 24, 0.7], [1360, 46, 1.2], [1404, 68, 0.8],
  [1142, 162, 0.7], [1200, 180, 1.0], [1262, 146, 0.8], [1324, 170, 0.6],
  [1110, 282, 1.1], [1164, 260, 0.7], [1224, 292, 0.9], [1284, 276, 0.6],
  [1110, 392, 0.8], [1170, 414, 0.7], [1230, 378, 1.0], [1290, 402, 0.6],
  [1140, 480, 0.9], [1196, 500, 0.7], [1254, 470, 1.1], [1310, 492, 0.8],
  [558,  484, 0.8], [610, 510, 0.7], [666, 488, 1.0], [778, 490, 0.9],
  [832,  514, 0.7], [886, 484, 1.1], [940, 504, 0.6], [994, 488, 0.8],
];

export function CelestialOrrery() {
  const [active, setActive] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e?.isIntersecting) { setActive(true); obs.disconnect(); } },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const tr = (d: number) => active ? `opacity 0.65s ease ${d}s` : "none";

  return (
    <div ref={ref} style={{
      background: "linear-gradient(180deg,#06080e 0%,#04060c 100%)",
      position: "relative",
      overflow: "hidden",
    }}>
      <style>{`
        @keyframes orb-cw { from { transform:rotate(0deg) } to { transform:rotate(360deg) } }
      `}</style>
      <svg
        viewBox="0 0 1440 556"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ display: "block", width: "100%", height: "auto" }}
        role="img"
        aria-label="Brass celestial orrery: Design, Build, Launch, Grow, and Maintain orbit the client as the central sun — Route 9 Web Co."
      >
        <defs>
          <radialGradient id="co-sun" cx="36%" cy="30%" r="66%">
            <stop offset="0%"   stopColor="#fff6c4"/>
            <stop offset="44%"  stopColor="#e8a434"/>
            <stop offset="100%" stopColor="#7c5012"/>
          </radialGradient>
          <radialGradient id="co-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="rgba(255,200,80,.30)"/>
            <stop offset="100%" stopColor="rgba(0,0,0,0)"/>
          </radialGradient>
          <radialGradient id="co-shine" cx="32%" cy="28%" r="70%">
            <stop offset="0%"   stopColor="rgba(255,235,140,.34)"/>
            <stop offset="100%" stopColor="rgba(0,0,0,0)"/>
          </radialGradient>
          <filter id="co-blur"><feGaussianBlur stdDeviation="20"/></filter>
        </defs>

        {/* ── STAR FIELD ── */}
        <g style={{ opacity: active ? 1 : 0, transition: tr(0.02) }}>
          {STARS.map(([x, y, r], i) => (
            <circle key={i} cx={x} cy={y} r={r}
              fill="rgba(255,248,220,.52)"
              opacity={0.38 + (i % 5) * 0.12}/>
          ))}
        </g>

        {/* ── SUN GLOW ── */}
        <circle cx={CX} cy={CY} r="200"
          fill="url(#co-glow)" filter="url(#co-blur)"
          style={{ opacity: active ? 1 : 0, transition: tr(0.04) }}/>

        {/* ── OUTER DECORATIVE RINGS ── */}
        <circle cx={CX} cy={CY} r="280"
          fill="none" stroke="rgba(196,148,40,.28)" strokeWidth="0.8"
          style={{ opacity: active ? 1 : 0, transition: tr(0.05) }}/>
        <circle cx={CX} cy={CY} r="274"
          fill="none" stroke="rgba(196,148,40,.14)" strokeWidth="0.4"
          style={{ opacity: active ? 1 : 0, transition: tr(0.05) }}/>

        {/* ── MERIDIAN TICKS ── */}
        <g style={{ opacity: active ? 1 : 0, transition: tr(0.06) }}>
          {TICKS.map((t, i) => (
            <line key={i}
              x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2}
              stroke={t.maj ? "rgba(196,148,40,.55)" : "rgba(196,148,40,.22)"}
              strokeWidth={t.maj ? 1.2 : 0.6}/>
          ))}
        </g>

        {/* ── ARC TEXT ── */}
        <g style={{ opacity: active ? 1 : 0, transition: tr(0.08) }}>
          {Array.from(ARC_TEXT).map((ch, i, arr) => {
            const angleDeg = (i / arr.length) * 360 - 90;
            const rad      = angleDeg * Math.PI / 180;
            const tx       = CX + ARC_R * Math.cos(rad);
            const ty       = CY + ARC_R * Math.sin(rad);
            return (
              <text key={i} x={tx} y={ty}
                transform={`rotate(${angleDeg + 90}, ${tx}, ${ty})`}
                textAnchor="middle" dominantBaseline="central"
                fill="rgba(196,148,40,.34)"
                fontSize="7.5" fontFamily="monospace">
                {ch}
              </text>
            );
          })}
        </g>

        {/* ── ORBITAL RINGS ── */}
        <g style={{ opacity: active ? 1 : 0, transition: tr(0.07) }}>
          {BODIES.map((b, i) => (
            <circle key={i} cx={CX} cy={CY} r={b.r}
              fill="none"
              stroke="rgba(196,148,40,.18)"
              strokeWidth="0.7"
              strokeDasharray={i % 2 === 0 ? undefined : "4,7"}/>
          ))}
        </g>

        {/* ── EQUATORIAL CROSS ── */}
        <g style={{ opacity: active ? 1 : 0, transition: tr(0.06) }}>
          <line x1={CX - 262} y1={CY} x2={CX + 262} y2={CY}
            stroke="rgba(196,148,40,.09)" strokeWidth="0.5"/>
          <line x1={CX} y1={CY - 262} x2={CX} y2={CY + 262}
            stroke="rgba(196,148,40,.09)" strokeWidth="0.5"/>
        </g>

        {/* ── ORRERY STAND ── */}
        <g style={{ opacity: active ? 1 : 0, transition: tr(0.10) }}>
          <line x1={CX} y1={CY + 32} x2={CX} y2={CY + 248}
            stroke="rgba(196,148,40,.50)" strokeWidth="5" strokeLinecap="round"/>
          {TRIPOD.map(([x2, y2], i) => (
            <line key={i}
              x1={CX} y1={CY + 248}
              x2={x2} y2={y2}
              stroke="rgba(196,148,40,.38)" strokeWidth="3.5" strokeLinecap="round"/>
          ))}
          <ellipse cx={CX} cy={CY + 270} rx="64" ry="10"
            fill="none" stroke="rgba(196,148,40,.26)" strokeWidth="1.4"/>
        </g>

        {/* ── ORBITAL BODIES ── */}
        {BODIES.map((b, i) => {
          const a0  = b.a0 * Math.PI / 180;
          const px  = CX + b.r * Math.cos(a0);
          const py  = CY + b.r * Math.sin(a0);
          return (
            <g key={i} style={{
              transformOrigin: `${CX}px ${CY}px`,
              animation: active
                ? `orb-cw ${b.period}s linear infinite`
                : "none",
              opacity: active ? 1 : 0,
              transition: tr(0.14 + i * 0.05),
            }}>
              {/* Arm */}
              <line x1={CX} y1={CY} x2={px} y2={py}
                stroke="rgba(196,148,40,.20)" strokeWidth="0.8"/>
              {/* Planet */}
              <circle cx={px} cy={py} r={b.pr}
                fill={b.fill} stroke={b.edge} strokeWidth="1.2"/>
              <circle cx={px} cy={py} r={b.pr}
                fill="url(#co-shine)"/>
              {/* Label */}
              <text x={px} y={py + b.pr + 13}
                textAnchor="middle"
                fill="rgba(218,176,68,.75)"
                fontSize="7.5" fontFamily="monospace" letterSpacing="1.5">
                {b.label}
              </text>
            </g>
          );
        })}

        {/* ── CENTRAL SUN ── */}
        <g style={{ opacity: active ? 1 : 0, transition: tr(0.12) }}>
          {/* Corona rays */}
          {Array.from({ length: CORONA_COUNT }, (_, i) => {
            const a  = (i * (360 / CORONA_COUNT) - 90) * Math.PI / 180;
            return (
              <line key={i}
                x1={(CX + 38 * Math.cos(a)).toFixed(1)}
                y1={(CY + 38 * Math.sin(a)).toFixed(1)}
                x2={(CX + 50 * Math.cos(a)).toFixed(1)}
                y2={(CY + 50 * Math.sin(a)).toFixed(1)}
                stroke="rgba(255,212,80,.36)" strokeWidth="1.3"/>
            );
          })}
          <circle cx={CX} cy={CY} r="34" fill="url(#co-sun)"/>
          <circle cx={CX} cy={CY} r="34"
            fill="none" stroke="rgba(255,218,100,.40)" strokeWidth="1.5"/>
          <text x={CX} y={CY - 3} textAnchor="middle"
            fill="rgba(255,242,180,.82)"
            fontSize="10" fontFamily="Georgia,serif"
            fontWeight="bold" fontStyle="italic" letterSpacing="0.5">
            R · 9
          </text>
          <text x={CX} y={CY + 12} textAnchor="middle"
            fill="rgba(255,222,140,.50)"
            fontSize="5.5" fontFamily="monospace" letterSpacing="1.2">
            CLIENT
          </text>
        </g>

        {/* ── HEADER ── */}
        <text x="720" y="34" textAnchor="middle"
          fill="rgba(196,148,40,.30)" fontSize="9"
          fontFamily="monospace" letterSpacing="5"
          style={{ opacity: active ? 1 : 0, transition: tr(0.04) }}>
          ROUTE 9 WEB CO. · CELESTIAL MECHANICS
        </text>

        {/* ── CAPTION ── */}
        <g style={{ opacity: active ? 1 : 0, transition: tr(0.90) }}>
          <text x="720" y="528" textAnchor="middle"
            fill="rgba(196,160,58,.38)" fontSize="11.5"
            fontFamily="Georgia,'Times New Roman',serif"
            fontWeight="bold" letterSpacing="3">
            YOUR BUSINESS IS THE CENTER OF OUR UNIVERSE
          </text>
          <text x="720" y="547" textAnchor="middle"
            fill="rgba(180,148,50,.20)" fontSize="8.5"
            fontFamily="monospace" letterSpacing="2.5">
            DESIGN · BUILD · LAUNCH · GROW · MAINTAIN
          </text>
        </g>
      </svg>
    </div>
  );
}
