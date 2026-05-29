"use client";

// CartographerDesk ─────────────────────────────────────────────────────────────
//
// Full-section overhead view of a cartographer's mahogany desk. Centrepiece:
// a parchment map of the Shrewsbury / Route 9 corridor, rotated -7°, showing
// the Route 9 highway in red, Lake Quinsigamond as a blue-tinted lake shape,
// tree clusters, side streets, Town Common dot, grid graticule, mini compass
// rose, and an ornate cartouche reading "Route 9 Web Co.".
// Desk also holds: brass compass rose (right), quill + brass inkwell (far
// right), wax seal "R9" (lower right), leather-rolled map tube (left edge),
// brass parallel rule (top).
// Caption: "WE KNOW THIS TERRITORY".
// Placed between RoadAtlas and NauticalCompass.

import { useEffect, useRef, useState } from "react";

// ── Map geometry (all coords in map-local space) ─────────────────────────────
const MAP_CX = 608, MAP_CY = 282;
const MAP_W  = 572, MAP_H  = 388;
const MAP_L  = MAP_CX - MAP_W / 2;   // 322
const MAP_R  = MAP_CX + MAP_W / 2;   // 894
const MAP_T  = MAP_CY - MAP_H / 2;   // 88
const MAP_B  = MAP_CY + MAP_H / 2;   // 476
const MAP_ROT = -7;

const RD_Y = 262;  // Route 9 runs E-W at this map-y

// Grid graticule
const GRID_XS = Array.from({ length: 6 }, (_, i) =>
  Math.round(MAP_L + (i + 1) * MAP_W / 7));
const GRID_YS = Array.from({ length: 4 }, (_, i) =>
  Math.round(MAP_T + (i + 1) * MAP_H / 5));

// Route 9 main road (gently curved E-W)
const RD_D = `M ${MAP_L + 8},${RD_Y} Q ${MAP_CX - 30},${RD_Y - 5} ${MAP_R - 8},${RD_Y + 4}`;

// Side streets: [x1,y1,x2,y2]
const STREETS: [number, number, number, number][] = [
  [442, RD_Y - 2, 444, RD_Y + 106],
  [514, RD_Y - 1, 515, RD_Y + 74],
  [590, RD_Y,     590, RD_Y + 64],
  [666, RD_Y + 2, 665, MAP_T + 52],
  [502, RD_Y - 4, 500, MAP_T + 54],
  [578, RD_Y - 2, 577, MAP_T + 66],
  [748, RD_Y + 1, 748, RD_Y + 82],
  [820, RD_Y - 2, 818, MAP_T + 58],
];

// Tree clusters: [cx, cy, r]
const TREES: [number, number, number][] = [
  [354, 162, 20], [836, 154, 18], [372, 408, 22],
  [808, 406, 16], [698, 174, 14], [706, 374, 13],
  [462, 154, 16], [644, 406, 12], [770, 200, 12],
];

// Lake Quinsigamond (irregular blob south of Route 9)
const LAKE_D = `M 430 324 C 418 346 414 374 420 400 C 426 426 442 448 462 458
  C 482 468 504 468 522 458 C 540 448 550 428 550 408
  C 550 388 542 366 530 348 C 518 330 502 318 484 316
  C 466 314 446 316 432 324 Z`;

// Cartouche: bottom-right of map
const CT_L = MAP_R - 152, CT_T = MAP_B - 102;
const CT_R = MAP_R - 14,  CT_B = MAP_B - 14;
const CT_CX = Math.round((CT_L + CT_R) / 2);   // 811
const CT_CY = Math.round((CT_T + CT_B) / 2);   // 418  (unused but kept for clarity)

// Cartouche corner ornament positions
const CT_CORNERS: [number, number][] = [
  [CT_L + 8, CT_T + 8],
  [CT_R - 8, CT_T + 8],
  [CT_L + 8, CT_B - 8],
  [CT_R - 8, CT_B - 8],
];

// Mini compass rose on map: top-right corner
const MC_CX = MAP_R - 42, MC_CY = MAP_T + 42, MC_R = 18;

// Landmark labels: [cx, cy, text]
const LANDMARKS: [number, number, string][] = [
  [MAP_CX,       RD_Y - 60, "SHREWSBURY"],
  [486,          398,       "LAKE QUINSIGAMOND"],
  [MAP_CX - 58,  RD_Y - 34, "TOWN COMMON"],
];

// Map tape strips: [cx, cy, rot_deg]
const TAPE_STRIPS: [number, number, number][] = [
  [MAP_L + 44, MAP_T + 6, -20],
  [MAP_R - 52, MAP_T + 5,  18],
];

// ── Desk items ────────────────────────────────────────────────────────────────

// Large brass compass rose (right of map, on desk)
const CMP_CX = 1062, CMP_CY = 196, CMP_R = 52;

// 8 bearing line angles
const BEARINGS = [0, 45, 90, 135, 180, 225, 270, 315] as const;

// Cardinal directions with pre-computed angles (radians from SVG east)
const CARDINALS = [
  { lbl: "N", a: -Math.PI / 2 },
  { lbl: "E", a:  0           },
  { lbl: "S", a:  Math.PI / 2 },
  { lbl: "W", a:  Math.PI     },
] as const;

// Mini compass bearings: [0°,90°,180°,270°] and [45°,135°,225°,315°]
const MC_CARD_ANGS  = [0, 90, 180, 270] as const;
const MC_INTER_ANGS = [45, 135, 225, 315] as const;

// Inkwell
const IW_CX = 1188, IW_CY = 348, IW_R = 22;

// Quill feather outline (closed path, nib at lower-left, tip at upper-right)
const QUILL_D =
  `M ${IW_CX - 14},${IW_CY + 6}` +
  ` C ${IW_CX + 18},${IW_CY - 28} ${IW_CX + 82},${IW_CY - 92} ${IW_CX + 148},${IW_CY - 132}` +
  ` C ${IW_CX + 140},${IW_CY - 124} ${IW_CX + 74},${IW_CY - 78} ${IW_CX + 42},${IW_CY - 44}` +
  ` C ${IW_CX + 14},${IW_CY - 12} ${IW_CX - 8},${IW_CY + 10} ${IW_CX - 14},${IW_CY + 6} Z`;

// Wax seal position
const WS_CX = 1290, WS_CY = 445;

// Rolled map tube (left edge, vertical)
const TB_CX = 142, TB_CY = 292, TB_H = 116, TB_RX = 15, TB_RY = 5;

// Desk wood grain: [x1,y1,x2,y2]
const GRAIN: [number, number, number, number][] = [
  [0,  42, 1440,  40], [0,  88, 1440,  91], [0, 132, 1440, 134],
  [0, 178, 1440, 176], [0, 224, 1440, 226], [0, 270, 1440, 268],
  [0, 316, 1440, 318], [0, 362, 1440, 360], [0, 408, 1440, 411],
  [0, 454, 1440, 452], [0, 500, 1440, 502], [0, 546, 1440, 544],
];

// Ruler tick positions (33 marks, 20px apart)
const RULER_TICKS = Array.from({ length: 33 }, (_, i) => i);

// Void reference to silence TypeScript on unused variable
void CT_CY;

export function CartographerDesk() {
  const [active, setActive] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e?.isIntersecting) { setActive(true); obs.disconnect(); } },
      { threshold: 0.12 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const tr = (d: number) => active ? `opacity 0.65s ease ${d}s` : "none";

  return (
    <div ref={ref} style={{ background: "#3a1a08", position: "relative", overflow: "hidden" }}>
      <svg
        viewBox="0 0 1440 560"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ display: "block", width: "100%", height: "auto" }}
        role="img"
        aria-label="Cartographer's desk: parchment map of Shrewsbury Route 9 corridor with compass, quill, and wax seal"
      >
        <defs>
          <linearGradient id="cad-desk" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%"   stopColor="#4a2410"/>
            <stop offset="50%"  stopColor="#3d1e0a"/>
            <stop offset="100%" stopColor="#321808"/>
          </linearGradient>
          <radialGradient id="cad-parch" cx="52%" cy="46%" r="58%">
            <stop offset="0%"   stopColor="#f2e4b6"/>
            <stop offset="100%" stopColor="#dcc880"/>
          </radialGradient>
          <radialGradient id="cad-brass" cx="36%" cy="30%" r="68%">
            <stop offset="0%"   stopColor="#f0d060"/>
            <stop offset="100%" stopColor="#8a6010"/>
          </radialGradient>
          <radialGradient id="cad-ink-jar" cx="38%" cy="28%" r="68%">
            <stop offset="0%"   stopColor="#2a2848"/>
            <stop offset="100%" stopColor="#080810"/>
          </radialGradient>
          <radialGradient id="cad-wax" cx="40%" cy="28%" r="66%">
            <stop offset="0%"   stopColor="#c82020"/>
            <stop offset="100%" stopColor="#6a0808"/>
          </radialGradient>
          <linearGradient id="cad-tube" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%"   stopColor="#6a3c10"/>
            <stop offset="50%"  stopColor="#8a5224"/>
            <stop offset="100%" stopColor="#6a3c10"/>
          </linearGradient>
          <filter id="cad-map-shd">
            <feDropShadow dx="4" dy="6" stdDeviation="10" floodColor="rgba(0,0,0,0.48)"/>
          </filter>
        </defs>

        {/* ── DESK SURFACE ── */}
        <rect width="1440" height="560" fill="url(#cad-desk)"
          style={{ opacity: active ? 1 : 0, transition: tr(0.0) }}/>
        <g style={{ opacity: active ? 1 : 0, transition: tr(0.01) }}>
          {GRAIN.map(([x1, y1, x2, y2], i) => (
            <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
              stroke="rgba(80,40,10,.10)" strokeWidth="0.7"/>
          ))}
        </g>

        {/* ── BRASS PARALLEL RULE (top of desk) ── */}
        <g style={{ opacity: active ? 1 : 0, transition: tr(0.03) }}>
          <rect x="218" y="28" width="664" height="14" rx="2"
            fill="url(#cad-brass)"
            stroke="rgba(200,160,40,.40)" strokeWidth="0.6"/>
          {RULER_TICKS.map((i) => (
            <line key={i}
              x1={218 + 20 * i} y1={28 + (i % 5 === 0 ? 2 : 4)}
              x2={218 + 20 * i} y2={28 + (i % 5 === 0 ? 12 : 9)}
              stroke="rgba(60,36,8,.40)" strokeWidth="0.5"/>
          ))}
        </g>

        {/* ── ROLLED MAP TUBE (left edge) ── */}
        <g style={{ opacity: active ? 1 : 0, transition: tr(0.05) }}>
          <rect x={TB_CX - TB_RX} y={TB_CY - TB_H / 2}
            width={TB_RX * 2} height={TB_H}
            fill="url(#cad-tube)"/>
          <ellipse cx={TB_CX} cy={TB_CY - TB_H / 2}
            rx={TB_RX} ry={TB_RY}
            fill="#9a6230" stroke="rgba(140,90,20,.50)" strokeWidth="0.8"/>
          <ellipse cx={TB_CX} cy={TB_CY + TB_H / 2}
            rx={TB_RX} ry={TB_RY}
            fill="#7a4c1e" stroke="rgba(140,90,20,.40)" strokeWidth="0.8"/>
          {/* Ribbon tie */}
          <line x1={TB_CX - TB_RX - 2} y1={TB_CY}
            x2={TB_CX + TB_RX + 2} y2={TB_CY}
            stroke="rgba(180,58,38,.60)" strokeWidth="2.5" strokeLinecap="round"/>
          <ellipse cx={TB_CX} cy={TB_CY} rx="4" ry="5"
            fill="rgba(198,68,38,.52)"/>
        </g>

        {/* ── MAP (rotated parchment) ── */}
        <g
          transform={`rotate(${MAP_ROT}, ${MAP_CX}, ${MAP_CY})`}
          style={{ opacity: active ? 1 : 0, transition: tr(0.05) }}
        >
          {/* Parchment base */}
          <rect x={MAP_L} y={MAP_T} width={MAP_W} height={MAP_H} rx="3"
            fill="url(#cad-parch)"
            stroke="rgba(108,78,16,.55)" strokeWidth="1.2"
            filter="url(#cad-map-shd)"/>

          {/* Aged-edge darkening */}
          <rect x={MAP_L} y={MAP_T} width={MAP_W} height={MAP_H} rx="3"
            fill="none" stroke="rgba(155,108,28,.18)" strokeWidth="9"/>

          {/* Tape strips at top corners */}
          {TAPE_STRIPS.map(([cx, cy, rot], i) => (
            <rect key={i}
              x={cx - 22} y={cy - 5} width="44" height="10" rx="1"
              transform={`rotate(${rot}, ${cx}, ${cy})`}
              fill="rgba(218,198,148,.48)"
              stroke="rgba(178,158,98,.28)" strokeWidth="0.4"/>
          ))}

          {/* Grid graticule */}
          <g opacity="0.13">
            {GRID_XS.map((x, i) => (
              <line key={i} x1={x} y1={MAP_T} x2={x} y2={MAP_B}
                stroke="#6a4c10" strokeWidth="0.5"/>
            ))}
            {GRID_YS.map((y, i) => (
              <line key={i} x1={MAP_L} y1={y} x2={MAP_R} y2={y}
                stroke="#6a4c10" strokeWidth="0.5"/>
            ))}
          </g>

          {/* Lake Quinsigamond */}
          <path d={LAKE_D}
            fill="rgba(78,136,176,.23)"
            stroke="rgba(38,78,120,.36)" strokeWidth="0.8"/>

          {/* Tree clusters (3-circle overlay) */}
          {TREES.map(([cx, cy, r], i) => (
            <g key={i}>
              <circle cx={cx} cy={cy} r={r}
                fill="rgba(56,92,26,.22)"
                stroke="rgba(36,68,16,.26)" strokeWidth="0.5"/>
              <circle cx={cx + r * 0.38} cy={cy - r * 0.12} r={r * 0.76}
                fill="rgba(50,86,22,.16)" stroke="none"/>
              <circle cx={cx - r * 0.32} cy={cy - r * 0.22} r={r * 0.66}
                fill="rgba(46,80,20,.14)" stroke="none"/>
            </g>
          ))}

          {/* Side streets */}
          {STREETS.map(([x1, y1, x2, y2], i) => (
            <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
              stroke="rgba(88,62,16,.40)" strokeWidth="1.3"/>
          ))}

          {/* Route 9 (red highlighted road) */}
          <path d={RD_D}
            stroke="rgba(165,36,16,.62)" strokeWidth="3.2"
            strokeLinecap="round"/>
          <path d={RD_D}
            stroke="rgba(218,196,138,.20)" strokeWidth="1.2"
            strokeDasharray="10,5" strokeLinecap="round"/>

          {/* Route 9 shield badge */}
          <circle cx={MAP_CX + 38} cy={RD_Y - 16} r="10"
            fill="rgba(165,36,16,.75)"/>
          <text x={MAP_CX + 38} y={RD_Y - 11} textAnchor="middle"
            fill="rgba(238,218,158,.90)"
            fontSize="8" fontFamily="monospace" fontWeight="bold">
            9
          </text>
          <circle cx={MAP_CX + 38} cy={RD_Y - 16} r="10"
            fill="none" stroke="rgba(238,218,158,.35)" strokeWidth="0.7"/>

          {/* Town Common dot */}
          <circle cx={MAP_CX - 58} cy={RD_Y - 22} r="4"
            fill="rgba(98,58,16,.50)"/>

          {/* Landmark labels */}
          {LANDMARKS.map(([cx, cy, label], i) => (
            <text key={i} x={cx} y={cy} textAnchor="middle"
              fill="rgba(54,34,8,.56)"
              fontSize="7" fontFamily="Georgia,serif"
              fontStyle="italic" letterSpacing="0.5">
              {label}
            </text>
          ))}

          {/* Mini compass rose (map top-right) */}
          <g>
            <circle cx={MC_CX} cy={MC_CY} r={MC_R}
              fill="rgba(218,188,118,.20)"
              stroke="rgba(98,68,18,.28)" strokeWidth="0.6"/>
            {MC_CARD_ANGS.map((ang, i) => {
              const a = (ang - 90) * Math.PI / 180;
              return (
                <line key={i}
                  x1={MC_CX} y1={MC_CY}
                  x2={MC_CX + MC_R * 0.82 * Math.cos(a)}
                  y2={MC_CY + MC_R * 0.82 * Math.sin(a)}
                  stroke="rgba(78,48,8,.55)" strokeWidth="1.1"/>
              );
            })}
            {MC_INTER_ANGS.map((ang, i) => {
              const a = (ang - 90) * Math.PI / 180;
              return (
                <line key={i}
                  x1={MC_CX} y1={MC_CY}
                  x2={MC_CX + MC_R * 0.54 * Math.cos(a)}
                  y2={MC_CY + MC_R * 0.54 * Math.sin(a)}
                  stroke="rgba(78,48,8,.32)" strokeWidth="0.6"/>
              );
            })}
            <text x={MC_CX} y={MC_CY - MC_R + 7} textAnchor="middle"
              fill="rgba(98,58,16,.65)"
              fontSize="6.5" fontFamily="Georgia,serif" fontWeight="bold">
              N
            </text>
          </g>

          {/* Cartouche (bottom-right of map) */}
          <rect x={CT_L} y={CT_T} width={CT_R - CT_L} height={CT_B - CT_T}
            rx="3" fill="rgba(208,178,108,.34)"
            stroke="rgba(98,68,16,.44)" strokeWidth="0.8"/>
          <rect x={CT_L + 5} y={CT_T + 5} width={CT_R - CT_L - 10} height={CT_B - CT_T - 10}
            rx="2" fill="none"
            stroke="rgba(98,68,16,.22)" strokeWidth="0.4"/>
          {CT_CORNERS.map(([cx, cy], i) => (
            <circle key={i} cx={cx} cy={cy} r="2.2"
              fill="rgba(98,68,16,.34)"/>
          ))}
          <text x={CT_CX} y={CT_T + 23} textAnchor="middle"
            fill="rgba(54,30,8,.72)"
            fontSize="11.5" fontFamily="Georgia,serif" fontWeight="bold" letterSpacing="1">
            ROUTE 9
          </text>
          <text x={CT_CX} y={CT_T + 40} textAnchor="middle"
            fill="rgba(54,30,8,.60)"
            fontSize="9.5" fontFamily="Georgia,serif" letterSpacing="0.8">
            WEB CO.
          </text>
          <line x1={CT_L + 12} y1={CT_T + 46} x2={CT_R - 12} y2={CT_T + 46}
            stroke="rgba(98,68,16,.26)" strokeWidth="0.5"/>
          <text x={CT_CX} y={CT_T + 59} textAnchor="middle"
            fill="rgba(54,30,8,.42)"
            fontSize="7" fontFamily="monospace" letterSpacing="0.6">
            SHREWSBURY, MA
          </text>
          <text x={CT_CX} y={CT_T + 72} textAnchor="middle"
            fill="rgba(54,30,8,.28)"
            fontSize="6" fontFamily="monospace" letterSpacing="0.4">
            ROUTE 9 CORRIDOR
          </text>
        </g>

        {/* ── LARGE COMPASS ROSE (off-map, desk right) ── */}
        <g style={{ opacity: active ? 1 : 0, transition: tr(0.08) }}>
          <circle cx={CMP_CX + 4} cy={CMP_CY + 5} r={CMP_R + 5}
            fill="rgba(0,0,0,.28)"/>
          <circle cx={CMP_CX} cy={CMP_CY} r={CMP_R + 5}
            fill="url(#cad-brass)"
            stroke="rgba(255,218,78,.44)" strokeWidth="1.2"/>
          <circle cx={CMP_CX} cy={CMP_CY} r={CMP_R}
            fill="rgba(238,228,208,.93)"
            stroke="rgba(158,118,28,.48)" strokeWidth="0.8"/>
          {/* Bearing lines */}
          {BEARINGS.map((ang, i) => {
            const a  = (ang - 90) * Math.PI / 180;
            const r1 = i % 2 === 0 ? 10 : 14;
            return (
              <line key={i}
                x1={CMP_CX + r1 * Math.cos(a)} y1={CMP_CY + r1 * Math.sin(a)}
                x2={CMP_CX + (CMP_R - 4) * Math.cos(a)}
                y2={CMP_CY + (CMP_R - 4) * Math.sin(a)}
                stroke="rgba(78,48,10,.44)"
                strokeWidth={i % 2 === 0 ? 1.0 : 0.5}/>
            );
          })}
          {/* N/E/S/W labels */}
          {CARDINALS.map(({ lbl, a }, i) => (
            <text key={i}
              x={CMP_CX + (CMP_R - 10) * Math.cos(a)}
              y={CMP_CY + (CMP_R - 10) * Math.sin(a)}
              textAnchor="middle" dominantBaseline="central"
              fill="rgba(54,30,8,.72)"
              fontSize={lbl === "N" ? 9 : 8}
              fontFamily="Georgia,serif" fontWeight="bold">
              {lbl}
            </text>
          ))}
          {/* North needle (red) */}
          <path d={`M ${CMP_CX},${CMP_CY - CMP_R + 13} L ${CMP_CX - 5},${CMP_CY} L ${CMP_CX + 5},${CMP_CY} Z`}
            fill="rgba(218,38,18,.80)" stroke="rgba(158,18,8,.48)" strokeWidth="0.4"/>
          {/* South needle (ivory) */}
          <path d={`M ${CMP_CX},${CMP_CY + CMP_R - 13} L ${CMP_CX - 5},${CMP_CY} L ${CMP_CX + 5},${CMP_CY} Z`}
            fill="rgba(238,234,218,.80)" stroke="rgba(118,88,18,.38)" strokeWidth="0.4"/>
          {/* Pivot jewel */}
          <circle cx={CMP_CX} cy={CMP_CY} r="4.5"
            fill="url(#cad-brass)" stroke="rgba(198,158,38,.50)" strokeWidth="0.6"/>
          <text x={CMP_CX} y={CMP_CY + CMP_R + 15} textAnchor="middle"
            fill="rgba(198,158,48,.42)"
            fontSize="7" fontFamily="monospace" letterSpacing="1.5">
            R · 9
          </text>
        </g>

        {/* ── INKWELL + QUILL ── */}
        <g style={{ opacity: active ? 1 : 0, transition: tr(0.10) }}>
          {/* Quill feather */}
          <path d={QUILL_D}
            fill="rgba(236,230,210,.86)"
            stroke="rgba(158,138,78,.38)" strokeWidth="0.5"/>
          {/* Quill shaft */}
          <line
            x1={IW_CX - 10} y1={IW_CY + 4}
            x2={IW_CX + 148} y2={IW_CY - 130}
            stroke="rgba(118,88,28,.48)" strokeWidth="1.0"/>
          {/* Nib */}
          <path d={`M ${IW_CX - 14},${IW_CY + 6} L ${IW_CX - 6},${IW_CY - 4} L ${IW_CX + 2},${IW_CY + 8} Z`}
            fill="rgba(28,18,8,.72)"/>
          {/* Inkwell shadow */}
          <ellipse cx={IW_CX + 3} cy={IW_CY + IW_R + 7} rx={IW_R + 4} ry="7"
            fill="rgba(0,0,0,.28)"/>
          {/* Inkwell brass collar */}
          <circle cx={IW_CX} cy={IW_CY} r={IW_R + 3}
            fill="url(#cad-brass)"
            stroke="rgba(178,138,28,.44)" strokeWidth="0.8"/>
          {/* Inkwell glass jar */}
          <circle cx={IW_CX} cy={IW_CY} r={IW_R}
            fill="url(#cad-ink-jar)"
            stroke="rgba(48,48,78,.58)" strokeWidth="0.6"/>
          {/* Ink highlight */}
          <ellipse cx={IW_CX - 7} cy={IW_CY - 7} rx="6" ry="4"
            fill="rgba(78,78,158,.18)"/>
          {/* Brass rim */}
          <ellipse cx={IW_CX} cy={IW_CY - IW_R + 3} rx={IW_R} ry="4"
            fill="url(#cad-brass)"/>
          {/* Ink drop on nib */}
          <circle cx={IW_CX - 12} cy={IW_CY + 9} r="2.5"
            fill="rgba(8,8,28,.70)"/>
        </g>

        {/* ── WAX SEAL ── */}
        <g style={{ opacity: active ? 1 : 0, transition: tr(0.12) }}>
          <ellipse cx={WS_CX + 3} cy={WS_CY + 5} rx="27" ry="9"
            fill="rgba(0,0,0,.26)"/>
          <circle cx={WS_CX} cy={WS_CY} r="24"
            fill="url(#cad-wax)"/>
          {/* Wax drip blobs */}
          <ellipse cx={WS_CX - 9} cy={WS_CY + 20} rx="7" ry="5"
            fill="rgba(158,18,18,.52)"/>
          <ellipse cx={WS_CX + 13} cy={WS_CY + 18} rx="5" ry="4"
            fill="rgba(158,18,18,.42)"/>
          {/* Seal ring impression */}
          <circle cx={WS_CX} cy={WS_CY} r="20"
            fill="none" stroke="rgba(238,178,138,.26)" strokeWidth="1.0"/>
          {/* Monogram */}
          <text x={WS_CX} y={WS_CY - 3} textAnchor="middle"
            fill="rgba(238,178,138,.68)"
            fontSize="9" fontFamily="Georgia,serif" fontWeight="bold">
            R9
          </text>
          <circle cx={WS_CX} cy={WS_CY} r="18"
            fill="none" stroke="rgba(238,178,138,.16)" strokeWidth="0.5"/>
        </g>

        {/* ── HEADER ── */}
        <text x="720" y="14" textAnchor="middle"
          fill="rgba(200,158,48,.20)"
          fontSize="9" fontFamily="monospace" letterSpacing="5"
          style={{ opacity: active ? 1 : 0, transition: tr(0.04) }}>
          ROUTE 9 WEB CO. · SHREWSBURY MASSACHUSETTS
        </text>

        {/* ── CAPTION ── */}
        <g style={{ opacity: active ? 1 : 0, transition: tr(0.85) }}>
          <text x="720" y="530" textAnchor="middle"
            fill="rgba(200,158,48,.44)"
            fontSize="12" fontFamily="Georgia,'Times New Roman',serif"
            fontWeight="bold" letterSpacing="3">
            WE KNOW THIS TERRITORY
          </text>
          <text x="720" y="549" textAnchor="middle"
            fill="rgba(178,138,38,.22)"
            fontSize="8.5" fontFamily="monospace" letterSpacing="2.5">
            CHARTING YOUR PATH ONLINE · ROUTE 9 CORRIDOR
          </text>
        </g>
      </svg>
    </div>
  );
}
