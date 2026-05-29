"use client";

// NauticalCompass ─────────────────────────────────────────────────────────────
//
// Full-section animated compass rose on a deep navy chart background. Eight
// compass arms (4 cardinal + 4 ordinal) scale in from scale(0) in staggered
// sequence on scroll. Cardinals: ROUTE 9 (N), BUILD (E), LAUNCH (S), GROW (W).
// Ordinals: DESIGN, DEVELOP, MAINTAIN, OPTIMIZE.
// 32 bearing tick marks, outer arc text, concentric rings, center medallion.
// Placed between RoadAtlas and Process.

import { useEffect, useRef, useState } from "react";

const CX = 720;
const CY = 285;

type Needle = {
  angle: number;
  len:   number;
  len2:  number;
  w:     number;
  front: string;
  back:  string;
  label: string;
  delay: number;
};

const NEEDLES: Needle[] = [
  { angle:   0, len: 184, len2: 40, w: 13, front: "#e2d8b8", back: "#8c6820", label: "ROUTE 9",  delay: 0.08 },
  { angle:  45, len: 130, len2: 28, w:  8, front: "#c8a030", back: "#684810", label: "DESIGN",   delay: 0.20 },
  { angle:  90, len: 184, len2: 40, w: 13, front: "#e2d8b8", back: "#8c6820", label: "BUILD",    delay: 0.32 },
  { angle: 135, len: 130, len2: 28, w:  8, front: "#c8a030", back: "#684810", label: "DEVELOP",  delay: 0.44 },
  { angle: 180, len: 184, len2: 40, w: 13, front: "#e2d8b8", back: "#8c6820", label: "LAUNCH",   delay: 0.56 },
  { angle: 225, len: 130, len2: 28, w:  8, front: "#c8a030", back: "#684810", label: "MAINTAIN", delay: 0.68 },
  { angle: 270, len: 184, len2: 40, w: 13, front: "#e2d8b8", back: "#8c6820", label: "GROW",     delay: 0.80 },
  { angle: 315, len: 130, len2: 28, w:  8, front: "#c8a030", back: "#684810", label: "OPTIMIZE", delay: 0.92 },
];

// Needle kite polygon vertices — angle in degrees CW from North
function npts(angle: number, len: number, len2: number, w: number) {
  const θ   = angle * Math.PI / 180;
  const sin = Math.sin(θ);
  const cos = Math.cos(θ);
  const p   = (x: number, y: number) => `${x.toFixed(2)},${y.toFixed(2)}`;
  return {
    tip:   p(CX + len  * sin, CY - len  * cos),
    back:  p(CX - len2 * sin, CY + len2 * cos),
    left:  p(CX - w   * cos,  CY - w   * sin),
    right: p(CX + w   * cos,  CY + w   * sin),
  };
}

// 32 bearing tick marks — major every 45° (at compass arm positions)
const TICKS = Array.from({ length: 32 }, (_, i) => {
  const deg   = i * (360 / 32);
  const θ     = (deg - 90) * Math.PI / 180;
  const major = i % 4 === 0;
  const r1    = major ? 204 : 210;
  return {
    x1: (CX + r1  * Math.cos(θ)).toFixed(2),
    y1: (CY + r1  * Math.sin(θ)).toFixed(2),
    x2: (CX + 218 * Math.cos(θ)).toFixed(2),
    y2: (CY + 218 * Math.sin(θ)).toFixed(2),
    major,
  };
});

// Outer arc text: 49 chars evenly around r=232
const ARC_TEXT = "NAVIGATE YOUR DIGITAL PRESENCE · ROUTE 9 WEB CO ·";
const ARC_R    = 232;

// Center cross angles (degrees) for the 8-pointed star
const CROSS_ANGLES = [0, 45, 90, 135];

export function NauticalCompass() {
  const [active, setActive] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e?.isIntersecting) { setActive(true); obs.disconnect(); } },
      { threshold: 0.18 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const tr = (d: number) =>
    active ? `opacity 0.6s ease ${d}s` : "none";

  return (
    <div ref={ref} style={{
      background: "linear-gradient(180deg,#090e18 0%,#060a12 100%)",
      overflow: "hidden",
      position: "relative",
    }}>
      <svg
        viewBox="0 0 1440 570"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ display: "block", width: "100%", height: "auto" }}
        role="img"
        aria-label="Navigational compass rose: Route 9 Web Co. — design, build, launch, grow"
      >
        <defs>
          <radialGradient id="nc-center" cx="38%" cy="32%" r="62%">
            <stop offset="0%"   stopColor="#e8c860"/>
            <stop offset="100%" stopColor="#6a4810"/>
          </radialGradient>
          <radialGradient id="nc-bg" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="rgba(196,156,66,.06)"/>
            <stop offset="100%" stopColor="rgba(0,0,0,0)"/>
          </radialGradient>
        </defs>

        {/* Chart background glow */}
        <circle cx={CX} cy={CY} r="300" fill="url(#nc-bg)"
          style={{ opacity: active ? 1 : 0, transition: tr(0.04) }}/>

        {/* ── OUTER DECORATIVE RINGS ── */}
        <circle cx={CX} cy={CY} r="226"
          fill="none" stroke="rgba(196,156,66,.25)" strokeWidth="0.7"
          style={{ opacity: active ? 1 : 0, transition: tr(0.04) }}/>
        <circle cx={CX} cy={CY} r="220"
          fill="none" stroke="rgba(196,156,66,.16)" strokeWidth="0.4"
          style={{ opacity: active ? 1 : 0, transition: tr(0.04) }}/>
        <circle cx={CX} cy={CY} r="202"
          fill="none" stroke="rgba(196,156,66,.38)" strokeWidth="1.1"
          style={{ opacity: active ? 1 : 0, transition: tr(0.06) }}/>

        {/* ── 32 BEARING TICKS ── */}
        <g style={{ opacity: active ? 1 : 0, transition: tr(0.08) }}>
          {TICKS.map((t, i) => (
            <line key={i}
              x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2}
              stroke={t.major ? "rgba(196,156,66,.55)" : "rgba(196,156,66,.22)"}
              strokeWidth={t.major ? 1.2 : 0.7}/>
          ))}
        </g>

        {/* ── OUTER ARC TEXT ── */}
        <g style={{ opacity: active ? 1 : 0, transition: tr(0.10) }}>
          {Array.from(ARC_TEXT).map((ch, i, arr) => {
            const angleDeg = (i / arr.length) * 360 - 90;
            const rad = angleDeg * Math.PI / 180;
            const tx  = CX + ARC_R * Math.cos(rad);
            const ty  = CY + ARC_R * Math.sin(rad);
            return (
              <text key={i} x={tx} y={ty}
                transform={`rotate(${angleDeg + 90}, ${tx}, ${ty})`}
                textAnchor="middle" dominantBaseline="central"
                fill="rgba(196,156,66,.38)"
                fontSize="7.8" fontFamily="monospace">
                {ch}
              </text>
            );
          })}
        </g>

        {/* ── COMPASS ARMS ── */}
        {NEEDLES.map((n, i) => {
          const pts       = npts(n.angle, n.len, n.len2, n.w);
          const θN        = n.angle * Math.PI / 180;
          const lx        = CX + (n.len + 24) * Math.sin(θN);
          const ly        = CY - (n.len + 24) * Math.cos(θN);
          const isCardinal = n.len > 150;

          return (
            <g key={i} style={{
              transformOrigin: `${CX}px ${CY}px`,
              transform: active ? "scale(1)" : "scale(0)",
              transition: active
                ? `transform 0.52s cubic-bezier(.20,1.20,.40,1) ${n.delay}s`
                : "none",
            }}>
              {/* Front triangle: tip → left widest → right widest */}
              <polygon points={`${pts.tip} ${pts.left} ${pts.right}`}
                fill={n.front}/>
              {/* Back triangle: left widest → tail → right widest */}
              <polygon points={`${pts.left} ${pts.back} ${pts.right}`}
                fill={n.back}/>
              {/* Needle outline */}
              <polygon
                points={`${pts.tip} ${pts.left} ${pts.back} ${pts.right}`}
                fill="none" stroke="rgba(0,0,0,.28)" strokeWidth="0.5"/>
              {/* Arm label */}
              <text x={lx} y={ly}
                textAnchor="middle" dominantBaseline="central"
                fill={isCardinal
                  ? "rgba(226,216,184,.82)"
                  : "rgba(196,156,66,.60)"}
                fontSize={isCardinal ? 10 : 8}
                fontFamily="monospace"
                letterSpacing={isCardinal ? 2 : 1.2}>
                {n.label}
              </text>
            </g>
          );
        })}

        {/* ── INNER RINGS ── */}
        <circle cx={CX} cy={CY} r="70"
          fill="none" stroke="rgba(196,156,66,.35)" strokeWidth="1"
          style={{ opacity: active ? 1 : 0, transition: tr(0.06) }}/>
        <circle cx={CX} cy={CY} r="64"
          fill="none" stroke="rgba(196,156,66,.18)" strokeWidth="0.6"
          style={{ opacity: active ? 1 : 0, transition: tr(0.07) }}/>
        <circle cx={CX} cy={CY} r="30"
          fill="none" stroke="rgba(196,156,66,.28)" strokeWidth="0.8"
          style={{ opacity: active ? 1 : 0, transition: tr(0.08) }}/>

        {/* ── CENTER MEDALLION ── */}
        <circle cx={CX} cy={CY} r="22" fill="url(#nc-center)"
          style={{ opacity: active ? 1 : 0, transition: tr(0.12) }}/>
        <circle cx={CX} cy={CY} r="22"
          fill="none" stroke="rgba(0,0,0,.30)" strokeWidth="0.8"
          style={{ opacity: active ? 1 : 0, transition: tr(0.12) }}/>
        {/* 8-pointed cross-star inside center */}
        <g style={{ opacity: active ? 1 : 0, transition: tr(0.14) }}>
          {CROSS_ANGLES.map(deg => {
            const r3 = deg * Math.PI / 180;
            return (
              <line key={deg}
                x1={(CX + 16 * Math.cos(r3)).toFixed(2)}
                y1={(CY + 16 * Math.sin(r3)).toFixed(2)}
                x2={(CX - 16 * Math.cos(r3)).toFixed(2)}
                y2={(CY - 16 * Math.sin(r3)).toFixed(2)}
                stroke="rgba(0,0,0,.38)" strokeWidth="0.8"/>
            );
          })}
        </g>
        {/* Pivot dot */}
        <circle cx={CX} cy={CY} r="5" fill="rgba(8,12,20,.85)"
          style={{ opacity: active ? 1 : 0, transition: tr(0.15) }}/>
        <circle cx={CX} cy={CY} r="2.2" fill="rgba(196,156,66,.80)"
          style={{ opacity: active ? 1 : 0, transition: tr(0.16) }}/>

        {/* ── TOP HEADING & BOTTOM CAPTION ── */}
        <text x={CX} y="24" textAnchor="middle"
          fill="rgba(196,156,66,.22)" fontSize="9"
          fontFamily="monospace" letterSpacing="4"
          style={{ opacity: active ? 1 : 0, transition: tr(0.05) }}>
          SET YOUR COURSE
        </text>
        <text x={CX} y="558" textAnchor="middle"
          fill="rgba(196,156,66,.16)" fontSize="9"
          fontFamily="monospace" letterSpacing="2"
          style={{ opacity: active ? 1 : 0, transition: tr(1.10) }}>
          ROUTE 9 WEB CO. · SHREWSBURY, MASSACHUSETTS · TRUE NORTH
        </text>
      </svg>
    </div>
  );
}
