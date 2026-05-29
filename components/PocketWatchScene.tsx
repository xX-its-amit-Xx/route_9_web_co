"use client";

// PocketWatchScene ─────────────────────────────────────────────────────────────
//
// Full-section antique brass pocket watch set to 9:00 (Route 9 reference).
// Features: engraved case with sunburst guilloché, ivory dial with Roman
// numerals and chapter ring, blued-steel hands, sub-seconds register at VI,
// sweeping red second hand, winding crown at III, crystal glass highlight.
// Caption: "YOUR DEADLINE IS OUR DEADLINE".
// Placed between Telegrapher and SealPress.

import { useEffect, useRef, useState } from "react";

const CX  = 720;
const CY  = 296;

const R_OT = 194;   // outer case edge
const R_CF = 184;   // case face ledge
const R_BZ = 174;   // bezel inner ring
const R_FC = 169;   // face fill radius
const R_CH = 154;   // chapter ring outer
const R_CI = 148;   // chapter ring inner
const R_NM = 132;   // numeral position radius
const R_TK = 150;   // tick outer edge

// 60 minute/second tick marks on chapter ring
const TICKS = Array.from({ length: 60 }, (_, i) => {
  const ang    = (i * 6 - 90) * Math.PI / 180;
  const maj    = i % 5 === 0;
  const rInner = maj ? R_TK - 14 : R_TK - 5;
  return {
    x1: (CX + rInner * Math.cos(ang)).toFixed(1),
    y1: (CY + rInner * Math.sin(ang)).toFixed(1),
    x2: (CX + R_TK   * Math.cos(ang)).toFixed(1),
    y2: (CY + R_TK   * Math.sin(ang)).toFixed(1),
    maj,
  };
});

// Roman numerals × 12 hour positions
const NUMERALS = ["XII","I","II","III","IV","V","VI","VII","VIII","IX","X","XI"] as const;

// Sub-seconds register at 6 o'clock
const SB_CX = CX;
const SB_CY = CY + 94;
const SB_R  = 28;

const SB_TICKS = Array.from({ length: 60 }, (_, i) => {
  const a  = (i * 6 - 90) * Math.PI / 180;
  const r1 = SB_R - (i % 5 === 0 ? 5 : 2.5);
  return {
    x1: (SB_CX + r1   * Math.cos(a)).toFixed(1),
    y1: (SB_CY + r1   * Math.sin(a)).toFixed(1),
    x2: (SB_CX + SB_R * Math.cos(a)).toFixed(1),
    y2: (SB_CY + SB_R * Math.sin(a)).toFixed(1),
  };
});

// 120 guilloché engraving rays in case band between R_CF and R_OT
const RAYS = Array.from({ length: 120 }, (_, i) => {
  const a = (i * 3) * Math.PI / 180;
  return {
    x1: (CX + (R_CF + 2) * Math.cos(a)).toFixed(1),
    y1: (CY + (R_CF + 2) * Math.sin(a)).toFixed(1),
    x2: (CX + (R_OT - 2) * Math.cos(a)).toFixed(1),
    y2: (CY + (R_OT - 2) * Math.sin(a)).toFixed(1),
  };
});

// Hand paths — all drawn pointing UP (toward 12 o'clock), then SVG-rotated
const HOUR_D = `M ${CX} ${CY-108} L ${CX+7} ${CY-72} L ${CX+5} ${CY-14} L ${CX+3} ${CY+14} L ${CX} ${CY+18} L ${CX-3} ${CY+14} L ${CX-5} ${CY-14} L ${CX-7} ${CY-72} Z`;
const MIN_D  = `M ${CX} ${CY-148} L ${CX+5} ${CY-108} L ${CX+3.5} ${CY-20} L ${CX+2.5} ${CY+14} L ${CX} ${CY+18} L ${CX-2.5} ${CY+14} L ${CX-3.5} ${CY-20} L ${CX-5} ${CY-108} Z`;
const SEC_D  = `M ${CX} ${CY-142} L ${CX+1.5} ${CY-24} L ${CX+4.5} ${CY+38} L ${CX} ${CY+44} L ${CX-4.5} ${CY+38} L ${CX-1.5} ${CY-24} Z`;
const SUB_D  = `M ${SB_CX} ${SB_CY-21} L ${SB_CX+1} ${SB_CY} L ${SB_CX+2.5} ${SB_CY+8} L ${SB_CX} ${SB_CY+10} L ${SB_CX-2.5} ${SB_CY+8} L ${SB_CX-1} ${SB_CY} Z`;

// Faint wood-grain table-surface lines behind the watch
const GRAIN: [number, number, number, number][] = [
  [0,  58, 1440,  63],
  [0, 118, 1440, 124],
  [0, 178, 1440, 183],
  [0, 238, 1440, 244],
  [0, 298, 1440, 302],
  [0, 358, 1440, 364],
  [0, 418, 1440, 423],
  [0, 478, 1440, 483],
  [0, 538, 1440, 544],
];

// Crown knurling x-offsets from case edge
const KNURL_XS = [4, 8, 12, 16, 20] as const;

export function PocketWatchScene() {
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
      background: "linear-gradient(180deg, #0d0904 0%, #1a1006 50%, #0d0904 100%)",
      position: "relative",
      overflow: "hidden",
    }}>
      <style>{`
        @keyframes pwsc-sweep {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes pwsc-sub {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
      `}</style>
      <svg
        viewBox="0 0 1440 580"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ display: "block", width: "100%", height: "auto" }}
        role="img"
        aria-label="Antique brass pocket watch set to nine o'clock — Route 9 Web Co. delivers every project on time"
      >
        <defs>
          <radialGradient id="pwsc-bg" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="rgba(230,168,48,.15)"/>
            <stop offset="100%" stopColor="rgba(0,0,0,0)"/>
          </radialGradient>
          <radialGradient id="pwsc-case" cx="38%" cy="28%" r="68%">
            <stop offset="0%"   stopColor="#f2dc72"/>
            <stop offset="42%"  stopColor="#c89830"/>
            <stop offset="100%" stopColor="#8a6010"/>
          </radialGradient>
          <radialGradient id="pwsc-bezel" cx="36%" cy="30%" r="70%">
            <stop offset="0%"   stopColor="#e8cc62"/>
            <stop offset="100%" stopColor="#7c5208"/>
          </radialGradient>
          <radialGradient id="pwsc-face" cx="40%" cy="34%" r="64%">
            <stop offset="0%"   stopColor="#f8f0dc"/>
            <stop offset="70%"  stopColor="#ece0be"/>
            <stop offset="100%" stopColor="#d6c69e"/>
          </radialGradient>
          <radialGradient id="pwsc-sub-face" cx="40%" cy="34%" r="64%">
            <stop offset="0%"   stopColor="#f0e8d0"/>
            <stop offset="100%" stopColor="#c8ba96"/>
          </radialGradient>
          <linearGradient id="pwsc-crystal" x1="0%" y1="0%" x2="70%" y2="90%">
            <stop offset="0%"   stopColor="rgba(255,255,255,.20)"/>
            <stop offset="60%"  stopColor="rgba(255,255,255,.07)"/>
            <stop offset="100%" stopColor="rgba(255,255,255,0)"/>
          </linearGradient>
        </defs>

        {/* ── AMBIENT GLOW ── */}
        <ellipse cx={CX} cy={CY} rx="420" ry="360"
          fill="url(#pwsc-bg)"
          style={{ opacity: active ? 1 : 0, transition: tr(0.0) }}/>

        {/* ── WOOD-GRAIN TABLE ── */}
        <g style={{ opacity: active ? 1 : 0, transition: tr(0.02) }}>
          {GRAIN.map(([x1, y1, x2, y2], i) => (
            <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
              stroke="rgba(200,140,38,.08)" strokeWidth="0.7"/>
          ))}
        </g>

        {/* ── CASE DROP-SHADOW ── */}
        <circle cx={CX + 7} cy={CY + 9} r={R_OT}
          fill="rgba(0,0,0,.40)"
          style={{ opacity: active ? 1 : 0, transition: tr(0.04) }}/>

        {/* ── OUTER CASE ── */}
        <circle cx={CX} cy={CY} r={R_OT}
          fill="url(#pwsc-case)"
          style={{ opacity: active ? 1 : 0, transition: tr(0.05) }}/>
        <circle cx={CX} cy={CY} r={R_OT}
          fill="none" stroke="rgba(255,224,80,.55)" strokeWidth="1.5"
          style={{ opacity: active ? 1 : 0, transition: tr(0.05) }}/>

        {/* ── GUILLOCHÉ ENGRAVING RAYS ── */}
        <g style={{ opacity: active ? 1 : 0, transition: tr(0.06) }}>
          {RAYS.map((r, i) => (
            <line key={i} x1={r.x1} y1={r.y1} x2={r.x2} y2={r.y2}
              stroke="rgba(110,72,4,.22)" strokeWidth="0.35"/>
          ))}
        </g>

        {/* ── CASE FACE LEDGE ── */}
        <circle cx={CX} cy={CY} r={R_CF}
          fill="url(#pwsc-bezel)"
          style={{ opacity: active ? 1 : 0, transition: tr(0.06) }}/>

        {/* ── BEZEL RING ── */}
        <circle cx={CX} cy={CY} r={R_BZ}
          fill="none" stroke="rgba(238,198,74,.64)" strokeWidth="2.2"
          style={{ opacity: active ? 1 : 0, transition: tr(0.07) }}/>

        {/* ── WATCH FACE (ivory) ── */}
        <circle cx={CX} cy={CY} r={R_FC}
          fill="url(#pwsc-face)"
          style={{ opacity: active ? 1 : 0, transition: tr(0.08) }}/>

        {/* ── CHAPTER RING ── */}
        <circle cx={CX} cy={CY} r={(R_CH + R_CI) / 2}
          fill="none" stroke="#c89818" strokeWidth={R_CH - R_CI}
          strokeOpacity="0.26"
          style={{ opacity: active ? 1 : 0, transition: tr(0.09) }}/>
        <circle cx={CX} cy={CY} r={R_CH}
          fill="none" stroke="rgba(178,128,26,.58)" strokeWidth="0.8"
          style={{ opacity: active ? 1 : 0, transition: tr(0.09) }}/>
        <circle cx={CX} cy={CY} r={R_CI}
          fill="none" stroke="rgba(178,128,26,.46)" strokeWidth="0.7"
          style={{ opacity: active ? 1 : 0, transition: tr(0.09) }}/>

        {/* ── MINUTE/HOUR TICKS ── */}
        <g style={{ opacity: active ? 1 : 0, transition: tr(0.10) }}>
          {TICKS.map((t, i) => (
            <line key={i} x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2}
              stroke={t.maj ? "rgba(68,42,8,.80)" : "rgba(68,42,8,.38)"}
              strokeWidth={t.maj ? 1.6 : 0.7}/>
          ))}
        </g>

        {/* ── ROMAN NUMERALS ── */}
        <g style={{ opacity: active ? 1 : 0, transition: tr(0.11) }}>
          {NUMERALS.map((num, i) => {
            const a   = (i * 30 - 90) * Math.PI / 180;
            const tx  = CX + R_NM * Math.cos(a);
            const ty  = CY + R_NM * Math.sin(a);
            const big = i === 0 || i === 3 || i === 6 || i === 9;
            return (
              <text key={i} x={tx} y={ty}
                textAnchor="middle" dominantBaseline="central"
                fill="rgba(56,32,8,.84)"
                fontSize={big ? "13" : "10.5"}
                fontFamily="Georgia,'Times New Roman',serif"
                fontWeight="bold">
                {num}
              </text>
            );
          })}
        </g>

        {/* ── DIAL MAKER'S TEXT ── */}
        <g style={{ opacity: active ? 1 : 0, transition: tr(0.13) }}>
          <text x={CX} y={CY - 52} textAnchor="middle"
            fill="rgba(78,48,12,.50)"
            fontSize="8.5" fontFamily="Georgia,serif"
            fontStyle="italic" letterSpacing="1.8">
            Route 9 Web Co.
          </text>
          <text x={CX} y={CY - 38} textAnchor="middle"
            fill="rgba(78,48,12,.30)"
            fontSize="6" fontFamily="monospace" letterSpacing="1.5">
            SHREWSBURY, MASSACHUSETTS
          </text>
        </g>

        {/* ── SUB-SECONDS DIAL (VI o'clock) ── */}
        <g style={{ opacity: active ? 1 : 0, transition: tr(0.12) }}>
          <circle cx={SB_CX} cy={SB_CY} r={SB_R + 6}
            fill="rgba(128,88,18,.10)"/>
          <circle cx={SB_CX} cy={SB_CY} r={SB_R}
            fill="url(#pwsc-sub-face)"
            stroke="rgba(158,108,18,.60)" strokeWidth="0.8"/>
          {SB_TICKS.map((t, i) => (
            <line key={i} x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2}
              stroke="rgba(68,42,8,.40)" strokeWidth="0.5"/>
          ))}
          <text x={SB_CX} y={SB_CY + 14} textAnchor="middle"
            fill="rgba(78,48,12,.28)" fontSize="5" fontFamily="monospace">
            SECONDS
          </text>
        </g>

        {/* ── SUB-SECOND HAND (sweeping, 10s/rev) ── */}
        <g style={{
          transformOrigin: `${SB_CX}px ${SB_CY}px`,
          animation: active ? "pwsc-sub 10s linear infinite" : "none",
          opacity: active ? 1 : 0,
          transition: tr(0.16),
        }}>
          <path d={SUB_D} fill="rgba(178,28,12,.74)"/>
          <circle cx={SB_CX} cy={SB_CY} r="2.2" fill="rgba(148,18,10,.82)"/>
        </g>

        {/* ── HOUR HAND at IX (rotate 270° from 12) ── */}
        <g transform={`rotate(270, ${CX}, ${CY})`}
          style={{ opacity: active ? 1 : 0, transition: tr(0.15) }}>
          <path d={HOUR_D} fill="#242040"/>
          <line x1={CX} y1={CY - 106} x2={CX} y2={CY + 16}
            stroke="rgba(130,110,190,.22)" strokeWidth="0.8"/>
        </g>

        {/* ── MINUTE HAND at XII (no rotation) ── */}
        <g style={{ opacity: active ? 1 : 0, transition: tr(0.15) }}>
          <path d={MIN_D} fill="#272244"/>
          <line x1={CX} y1={CY - 146} x2={CX} y2={CY + 16}
            stroke="rgba(130,110,190,.18)" strokeWidth="0.6"/>
        </g>

        {/* ── SECOND HAND (continuous sweep, 10s/rev) ── */}
        <g style={{
          transformOrigin: `${CX}px ${CY}px`,
          animation: active ? "pwsc-sweep 10s linear infinite" : "none",
          opacity: active ? 1 : 0,
          transition: tr(0.18),
        }}>
          <path d={SEC_D} fill="rgba(198,26,12,.92)"/>
          <circle cx={CX} cy={CY} r="5.5"
            fill="#b41e0c" stroke="rgba(255,178,98,.38)" strokeWidth="0.8"/>
        </g>

        {/* ── CENTER PIVOT CAP ── */}
        <circle cx={CX} cy={CY} r="3.8"
          fill="#d0a02e" stroke="rgba(255,220,78,.48)" strokeWidth="0.8"
          style={{ opacity: active ? 1 : 0, transition: tr(0.20) }}/>

        {/* ── CRYSTAL GLASS HIGHLIGHT ── */}
        <ellipse cx={CX - 46} cy={CY - 52} rx="60" ry="36"
          fill="url(#pwsc-crystal)"
          transform={`rotate(-36, ${CX - 46}, ${CY - 52})`}
          style={{ opacity: active ? 0.65 : 0, transition: tr(0.20) }}/>

        {/* ── OUTER CASE ACCENT RING ── */}
        <circle cx={CX} cy={CY} r={R_OT}
          fill="none" stroke="rgba(200,158,36,.24)" strokeWidth="0.6"
          style={{ opacity: active ? 1 : 0, transition: tr(0.07) }}/>

        {/* ── WINDING CROWN (III o'clock, right side) ── */}
        <g style={{ opacity: active ? 1 : 0, transition: tr(0.08) }}>
          <rect x={CX + R_OT - 2} y={CY - 11} width="30" height="22" rx="5"
            fill="url(#pwsc-case)"
            stroke="rgba(198,156,38,.50)" strokeWidth="0.8"/>
          {KNURL_XS.map((dx, i) => (
            <line key={i}
              x1={CX + R_OT + dx} y1={CY - 9}
              x2={CX + R_OT + dx} y2={CY + 9}
              stroke="rgba(118,78,4,.36)" strokeWidth="0.8"/>
          ))}
        </g>

        {/* ── HEADER ── */}
        <text x="720" y="36" textAnchor="middle"
          fill="rgba(198,156,46,.20)" fontSize="9"
          fontFamily="monospace" letterSpacing="5"
          style={{ opacity: active ? 1 : 0, transition: tr(0.04) }}>
          ROUTE 9 WEB CO. · PRECISION CRAFTSMANSHIP
        </text>

        {/* ── CAPTION ── */}
        <g style={{ opacity: active ? 1 : 0, transition: tr(0.85) }}>
          <text x="720" y="534" textAnchor="middle"
            fill="rgba(210,170,56,.42)" fontSize="12"
            fontFamily="Georgia,'Times New Roman',serif"
            fontWeight="bold" letterSpacing="3.5">
            YOUR DEADLINE IS OUR DEADLINE
          </text>
          <text x="720" y="553" textAnchor="middle"
            fill="rgba(178,140,46,.22)" fontSize="8.5"
            fontFamily="monospace" letterSpacing="2.5">
            EVERY PROJECT · EVERY DETAIL · DELIVERED ON TIME
          </text>
        </g>
      </svg>
    </div>
  );
}
