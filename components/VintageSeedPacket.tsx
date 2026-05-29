"use client";

// VintageSeedPacket ─────────────────────────────────────────────────────────────
//
// Full-section Victorian seed packet illustration for "Route 9 Web Co.
// Digital Garden Seeds". Three-zone packet: dark forest-green header with
// gold "ROUTE 9 / WEB CO." display type; centre cream illustration area with
// hand-drawn flowering vine (stem, branches, leaves, 3 daisy flowers,
// terracotta pot); dark green info band listing the five seed varieties
// (Design, Build, Launch, Grow, Maintain).
// Scattered seed ovals and corner botanical sprigs surround the packet.
// Warm cream background, parchment texture stipple hints.
// Placed between WorkbenchTools and MatchbookCollection.

import { useEffect, useRef, useState } from "react";

// ── Packet geometry ───────────────────────────────────────────────────────────
const PX1 = 570, PX2 = 870;           // left / right  (width = 300)
const PY1 =  78, PY2 = 526;           // top  / bottom (height = 448)
const PCX = (PX1 + PX2) / 2;          // 720
const HDR_Y2 = 196;                    // header section bottom
const INF_Y1 = 404;                    // info section top

// Packet section paths (rounded only on the open end)
const HDR_PATH =
  `M ${PX1 + 4},${PY1} A 4,4 0 0,0 ${PX1},${PY1 + 4}` +
  ` L ${PX1},${HDR_Y2} L ${PX2},${HDR_Y2}` +
  ` L ${PX2},${PY1 + 4} A 4,4 0 0,0 ${PX2 - 4},${PY1} Z`;

const INF_PATH =
  `M ${PX1},${INF_Y1} L ${PX1},${PY2 - 4}` +
  ` A 4,4 0 0,0 ${PX1 + 4},${PY2} L ${PX2 - 4},${PY2}` +
  ` A 4,4 0 0,0 ${PX2},${PY2 - 4} L ${PX2},${INF_Y1} Z`;

// ── Botanical illustration ────────────────────────────────────────────────────
const STEM_D = `M 720 384 C 713 352 727 314 720 276 C 713 250 724 226 720 210`;

// Branch lines: [stem-x, stem-y, tip-x, tip-y]
const BRANCHES: [number, number, number, number][] = [
  [720, 338, 675, 322],
  [720, 290, 669, 273],
  [720, 334, 765, 320],
  [720, 286, 771, 269],
];

// Leaves: [cx, cy, rx, ry, rot_deg]
const LEAVES: [number, number, number, number, number][] = [
  [661, 318, 30, 13, -38],
  [656, 268, 26, 11, -48],
  [779, 315, 30, 13,  38],
  [784, 265, 26, 11,  50],
];

// Flowers: [cx, cy, petal_offset_r, center_r]
const FLOWERS: [number, number, number, number][] = [
  [700, 228,  7, 5],
  [740, 224,  7, 5],
  [720, 208,  9, 6],
];

// 5 petal angles (72° apart)
const PETAL_ANGS = [0, 72, 144, 216, 288] as const;

// Services listed in info section
const SERVICES = ["DESIGN","BUILD","LAUNCH","GROW","MAINTAIN"] as const;

// Scattered seed ovals: [cx, cy, rot_deg]
const SEEDS: [number, number, number][] = [
  [512, 148, 28], [538, 226, -18], [520, 318, 42],
  [506, 414, -25],[524, 500,  15],
  [928, 138,-32], [946, 232,  22], [916, 332,-14],
  [938, 428, 38], [644, 570,  20], [798, 572,-22],
];

// Corner ornament positions: [cx, cy]
const CORNERS: [number, number][] = [
  [PX1 + 16, PY1 + 16],
  [PX2 - 16, PY1 + 16],
  [PX1 + 16, PY2 - 16],
  [PX2 - 16, PY2 - 16],
];

// Parchment stipple dots: [cx, cy, r]
const STIPPLE: [number, number, number][] = [
  [108,88,1.0],[244,62,0.8],[388,112,0.9],[476,44,0.7],[604,72,1.1],
  [156,196,0.7],[302,172,1.0],[448,208,0.8],[540,164,0.6],
  [86,308,0.9],[214,336,0.7],[360,298,1.0],[500,348,0.8],
  [96,442,0.8],[228,472,1.0],[372,440,0.7],[498,486,0.9],
  [100,554,1.1],[246,528,0.8],[400,562,0.7],
  [932,88,1.0],[1076,64,0.8],[1212,108,0.9],[1324,46,0.7],
  [884,200,0.7],[1032,176,0.9],[1168,212,0.8],[1298,168,0.6],
  [904,312,1.0],[1044,342,0.7],[1184,304,0.9],[1316,352,0.8],
  [916,448,0.8],[1052,480,1.0],[1196,444,0.7],[1320,490,0.9],
  [920,556,1.1],[1060,530,0.8],[1202,560,0.7],[1334,526,0.6],
];

export function VintageSeedPacket() {
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
      background: "linear-gradient(180deg, #f0e7c8 0%, #f8f3e2 50%, #f0e7c8 100%)",
      position: "relative",
      overflow: "hidden",
    }}>
      <svg
        viewBox="0 0 1440 604"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ display: "block", width: "100%", height: "auto" }}
        role="img"
        aria-label="Vintage Route 9 Web Co. seed packet — Digital Garden Seeds: Design, Build, Launch, Grow, Maintain"
      >
        <defs>
          <linearGradient id="vsp-hdr" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%"   stopColor="#2e5018"/>
            <stop offset="100%" stopColor="#1c3a0c"/>
          </linearGradient>
          <linearGradient id="vsp-inf" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%"   stopColor="#1c3a0c"/>
            <stop offset="100%" stopColor="#2a4a18"/>
          </linearGradient>
          <radialGradient id="vsp-illus" cx="50%" cy="42%" r="58%">
            <stop offset="0%"   stopColor="#f6ecd0"/>
            <stop offset="100%" stopColor="#e6d8a8"/>
          </radialGradient>
        </defs>

        {/* ── PARCHMENT STIPPLE ── */}
        <g style={{ opacity: active ? 1 : 0, transition: tr(0.01) }}>
          {STIPPLE.map(([cx, cy, r], i) => (
            <circle key={i} cx={cx} cy={cy} r={r}
              fill="rgba(140,100,30,.14)"/>
          ))}
        </g>

        {/* ── SCATTERED SEEDS ── */}
        <g style={{ opacity: active ? 1 : 0, transition: tr(0.03) }}>
          {SEEDS.map(([cx, cy, rot], i) => (
            <ellipse key={i} cx={cx} cy={cy} rx="5" ry="9"
              transform={`rotate(${rot}, ${cx}, ${cy})`}
              fill="rgba(118,70,20,.22)"/>
          ))}
        </g>

        {/* ── DROP SHADOW ── */}
        <rect x={PX1 + 7} y={PY1 + 10} width={PX2 - PX1} height={PY2 - PY1}
          rx="5" fill="rgba(0,0,0,.18)"
          style={{ opacity: active ? 1 : 0, transition: tr(0.04) }}/>

        {/* ── PACKET BODY (cream base) ── */}
        <rect x={PX1} y={PY1} width={PX2 - PX1} height={PY2 - PY1}
          rx="4" fill="#f0e6c0"
          stroke="#4a7020" strokeWidth="1.5"
          style={{ opacity: active ? 1 : 0, transition: tr(0.05) }}/>

        {/* Inner rule border */}
        <rect x={PX1 + 7} y={PY1 + 7} width={PX2 - PX1 - 14} height={PY2 - PY1 - 14}
          rx="3" fill="none"
          stroke="#4a7020" strokeWidth="0.55"
          style={{ opacity: active ? 1 : 0, transition: tr(0.05) }}/>

        {/* ── CORNER ORNAMENTS ── */}
        <g style={{ opacity: active ? 1 : 0, transition: tr(0.06) }}>
          {CORNERS.map(([cx, cy], i) => (
            <g key={i}>
              <line x1={cx - 8} y1={cy} x2={cx + 8} y2={cy}
                stroke="#4a7020" strokeWidth="0.8"/>
              <line x1={cx} y1={cy - 8} x2={cx} y2={cy + 8}
                stroke="#4a7020" strokeWidth="0.8"/>
              <circle cx={cx} cy={cy} r="2.5" fill="#4a7020"/>
            </g>
          ))}
        </g>

        {/* ── HEADER (forest green) ── */}
        <path d={HDR_PATH}
          fill="url(#vsp-hdr)"
          style={{ opacity: active ? 1 : 0, transition: tr(0.06) }}/>

        {/* Header text */}
        <g style={{ opacity: active ? 1 : 0, transition: tr(0.08) }}>
          <line x1={PX1 + 18} y1={PY1 + 20} x2={PX2 - 18} y2={PY1 + 20}
            stroke="rgba(204,184,78,.42)" strokeWidth="0.55"/>
          <line x1={PX1 + 18} y1={PY1 + 23} x2={PX2 - 18} y2={PY1 + 23}
            stroke="rgba(204,184,78,.18)" strokeWidth="0.3"/>

          <text x={PCX} y={PY1 + 62} textAnchor="middle"
            fill="#e8d060"
            fontSize="38" fontFamily="Georgia,'Times New Roman',serif"
            fontWeight="bold" letterSpacing="7">
            ROUTE 9
          </text>

          <line x1={PX1 + 40} y1={PY1 + 79} x2={PCX - 22} y2={PY1 + 79}
            stroke="rgba(204,184,78,.32)" strokeWidth="0.5"/>
          <circle cx={PCX} cy={PY1 + 79} r="3" fill="rgba(204,184,78,.38)"/>
          <line x1={PCX + 22} y1={PY1 + 79} x2={PX2 - 40} y2={PY1 + 79}
            stroke="rgba(204,184,78,.32)" strokeWidth="0.5"/>

          <text x={PCX} y={PY1 + 107} textAnchor="middle"
            fill="rgba(222,202,88,.76)"
            fontSize="18" fontFamily="monospace" letterSpacing="12">
            WEB CO.
          </text>

          <text x={PCX} y={PY1 + 130} textAnchor="middle"
            fill="rgba(178,214,138,.52)"
            fontSize="8" fontFamily="monospace" letterSpacing="3.5">
            · DIGITAL GARDEN SEEDS ·
          </text>

          <line x1={PX1 + 18} y1={HDR_Y2 - 10} x2={PX2 - 18} y2={HDR_Y2 - 10}
            stroke="rgba(204,184,78,.22)" strokeWidth="0.5"/>
        </g>

        {/* ── ILLUSTRATION SECTION (cream) ── */}
        <rect x={PX1 + 1.5} y={HDR_Y2} width={PX2 - PX1 - 3} height={INF_Y1 - HDR_Y2}
          fill="url(#vsp-illus)"
          style={{ opacity: active ? 1 : 0, transition: tr(0.07) }}/>

        <text x={PCX} y={HDR_Y2 + 24} textAnchor="middle"
          fill="rgba(42,60,18,.36)"
          fontSize="7.5" fontFamily="monospace" letterSpacing="2.5"
          style={{ opacity: active ? 1 : 0, transition: tr(0.10) }}>
          SERVICES COLLECTION
        </text>

        {/* ── BOTANICAL ILLUSTRATION ── */}
        <g style={{ opacity: active ? 1 : 0, transition: tr(0.12) }}>
          {/* Pot */}
          <rect x="698" y="376" width="44" height="22" rx="3"
            fill="#8a5218" stroke="#6a3c10" strokeWidth="0.8"/>
          <rect x="694" y="372" width="52" height="8" rx="3"
            fill="#a06224" stroke="#7a4814" strokeWidth="0.8"/>
          <ellipse cx="720" cy="376" rx="20" ry="4" fill="#6a3c10"/>

          {/* Stem */}
          <path d={STEM_D}
            stroke="#2a5012" strokeWidth="2.5" strokeLinecap="round"/>

          {/* Branches */}
          {BRANCHES.map(([sx, sy, ex, ey], i) => (
            <line key={i} x1={sx} y1={sy} x2={ex} y2={ey}
              stroke="#2a5012" strokeWidth="1.4" strokeLinecap="round"/>
          ))}

          {/* Leaves */}
          {LEAVES.map(([cx, cy, rx, ry, rot], i) => {
            const r = rot * Math.PI / 180;
            return (
              <g key={i}>
                <ellipse cx={cx} cy={cy} rx={rx} ry={ry}
                  transform={`rotate(${rot}, ${cx}, ${cy})`}
                  fill="#3a6818" stroke="#2a500e" strokeWidth="0.7"/>
                <line
                  x1={cx - (rx - 3) * Math.cos(r)} y1={cy - (rx - 3) * Math.sin(r)}
                  x2={cx + (rx - 3) * Math.cos(r)} y2={cy + (rx - 3) * Math.sin(r)}
                  stroke="rgba(255,255,210,.28)" strokeWidth="0.5"/>
              </g>
            );
          })}

          {/* Flowers */}
          {FLOWERS.map(([cx, cy, pr, cr], i) => (
            <g key={i}>
              {PETAL_ANGS.map((ang, j) => {
                const a   = ang * Math.PI / 180;
                const pcx = cx + pr * Math.cos(a);
                const pcy = cy + pr * Math.sin(a);
                return (
                  <ellipse key={j}
                    cx={pcx} cy={pcy}
                    rx={pr * 0.88} ry={pr * 0.44}
                    transform={`rotate(${ang}, ${pcx}, ${pcy})`}
                    fill="#f0d040"
                    stroke="rgba(200,158,18,.38)" strokeWidth="0.4"/>
                );
              })}
              <circle cx={cx} cy={cy} r={cr}
                fill="#e88e10" stroke="rgba(190,112,8,.48)" strokeWidth="0.5"/>
            </g>
          ))}
        </g>

        {/* Illustration bottom rule */}
        <line x1={PX1 + 12} y1={INF_Y1 - 1} x2={PX2 - 12} y2={INF_Y1 - 1}
          stroke="rgba(58,88,22,.28)" strokeWidth="0.7"
          style={{ opacity: active ? 1 : 0, transition: tr(0.10) }}/>

        {/* ── INFO SECTION (forest green) ── */}
        <path d={INF_PATH}
          fill="url(#vsp-inf)"
          style={{ opacity: active ? 1 : 0, transition: tr(0.08) }}/>

        {/* Info text */}
        <g style={{ opacity: active ? 1 : 0, transition: tr(0.14) }}>
          <text x={PCX} y={INF_Y1 + 22} textAnchor="middle"
            fill="rgba(222,202,88,.70)"
            fontSize="8.5" fontFamily="monospace" letterSpacing="3">
            SEED VARIETIES INCLUDED:
          </text>

          {SERVICES.map((svc, i) => (
            <g key={i}>
              <circle cx={PX1 + 28} cy={INF_Y1 + 40 + i * 17} r="2.5"
                fill="rgba(178,222,98,.52)"/>
              <text x={PX1 + 38} y={INF_Y1 + 44 + i * 17}
                fill="rgba(202,232,162,.66)"
                fontSize="8.5" fontFamily="Georgia,serif" fontStyle="italic">
                {svc}
              </text>
            </g>
          ))}

          <line x1={PX1 + 18} y1={PY2 - 30} x2={PX2 - 18} y2={PY2 - 30}
            stroke="rgba(178,212,98,.20)" strokeWidth="0.5"/>

          <text x={PCX} y={PY2 - 16} textAnchor="middle"
            fill="rgba(178,212,108,.36)"
            fontSize="6.5" fontFamily="monospace" letterSpacing="1.5">
            CULTIVATED IN SHREWSBURY, MASSACHUSETTS
          </text>
          <text x={PCX} y={PY2 - 5} textAnchor="middle"
            fill="rgba(178,212,108,.22)"
            fontSize="6" fontFamily="monospace" letterSpacing="1">
            NET: 5 VARIETIES · GUARANTEED TO GROW
          </text>
        </g>

        {/* ── HEADER LABEL ── */}
        <text x="720" y="46" textAnchor="middle"
          fill="rgba(78,98,38,.20)"
          fontSize="9" fontFamily="monospace" letterSpacing="5"
          style={{ opacity: active ? 1 : 0, transition: tr(0.04) }}>
          ROUTE 9 WEB CO. · HAND-CULTIVATED DIGITAL SERVICES
        </text>

        {/* ── CAPTION ── */}
        <g style={{ opacity: active ? 1 : 0, transition: tr(0.85) }}>
          <text x="720" y="572" textAnchor="middle"
            fill="rgba(58,88,24,.46)"
            fontSize="12" fontFamily="Georgia,'Times New Roman',serif"
            fontWeight="bold" letterSpacing="3">
            CULTIVATED WITH CARE · BUILT TO BLOOM
          </text>
          <text x="720" y="591" textAnchor="middle"
            fill="rgba(58,78,20,.24)"
            fontSize="8.5" fontFamily="monospace" letterSpacing="2.5">
            EVERY WEB PROJECT IS A LIVING THING
          </text>
        </g>
      </svg>
    </div>
  );
}
