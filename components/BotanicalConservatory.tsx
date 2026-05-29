"use client";

// BotanicalConservatory ────────────────────────────────────────────────────────
//
// Full-section Victorian glass conservatory illustration. Evening setting:
// cool dark exterior vs warm amber interior glow visible through brass-framed
// glass panels. Barrel-vault roof, brass mullions and rails, tropical plant
// silhouettes (arching palm fronds, fern clusters, monstera leaves, flowering
// plants), condensation droplets on exterior glass, ornate entrance door.
// IntersectionObserver at 0.12 triggers staggered layer reveals.
// Placed between QualityPillars and ApothecaryShelf.

import { useEffect, useRef, useState } from "react";

const LEFT  = 278;
const RIGHT = 1162;
const FLOOR = 452;
const EAVE  = 172;
const CX    = 720;
const ARCH  = 88;   // barrel-vault control-point Y

const INTERIOR_PATH = `M ${LEFT} ${EAVE} Q ${CX} ${ARCH} ${RIGHT} ${EAVE} L ${RIGHT} ${FLOOR} L ${LEFT} ${FLOOR} Z`;

// Brass mullion X positions (15 evenly spaced, LEFT→RIGHT)
const MULLION_XS = Array.from({ length: 15 }, (_, i) =>
  LEFT + Math.round(i * (RIGHT - LEFT) / 14)
);

// Horizontal rail Y positions
const RAIL_YS = [EAVE, 248, 330, 410] as const;

// Glass condensation droplets [x, y, r]
const COND: [number, number, number][] = [
  [300, 238, 2.2], [316, 280, 1.5], [294, 316, 2.0], [332, 202, 1.8],
  [360, 258, 2.4], [386, 294, 1.6], [406, 222, 2.0], [426, 268, 1.4],
  [1082, 242, 2.2], [1068, 282, 1.5], [1094, 318, 1.8], [1106, 208, 2.0],
  [1050, 260, 2.4], [1032, 298, 1.6], [1018, 226, 2.0], [1002, 274, 1.4],
  [342, 354, 1.8], [382, 378, 2.0], [422, 338, 1.6], [1062, 358, 1.8],
  [1022, 382, 2.0], [982, 340, 1.6], [462, 206, 1.8], [482, 254, 2.2],
  [302, 390, 1.4], [1110, 380, 1.6], [950, 210, 1.5], [510, 230, 1.9],
];

// Palm fronds [path-d, stroke-color, strokeWidth]
const PALM_FRONDS: [string, string, number][] = [
  ["M 720 284 Q 600 242 480 270", "#6a8830", 7],
  ["M 720 284 Q 840 242 960 270", "#5e7c28", 7],
  ["M 720 284 Q 648 206 602 150", "#7a9838", 6],
  ["M 720 284 Q 792 206 838 150", "#6a8830", 6],
  ["M 720 284 Q 576 270 522 312", "#587224", 5],
  ["M 720 284 Q 864 270 918 312", "#527020", 5],
  ["M 720 284 Q 662 238 638 194", "#7a9838", 5],
  ["M 720 284 Q 778 238 802 194", "#6e9030", 5],
];

// Left fern strokes [path-d, color]
const FERN_L: [string, string][] = [
  ["M 452 450 Q 380 402 342 362", "#5c7828"],
  ["M 452 450 Q 402 390 392 332", "#507020"],
  ["M 452 450 Q 422 382 410 322", "#5c7828"],
  ["M 452 450 Q 470 380 482 318", "#507020"],
  ["M 452 450 Q 492 392 514 342", "#567424"],
  ["M 452 450 Q 362 412 312 382", "#4e6c1c"],
];

// Right fern strokes [path-d, color]
const FERN_R: [string, string][] = [
  ["M 988 450 Q 1058 402 1098 362", "#5c7828"],
  ["M 988 450 Q 1038 390 1048 332", "#507020"],
  ["M 988 450 Q 1018 382 1030 322", "#5c7828"],
  ["M 988 450 Q 970 380 958 318",  "#507020"],
  ["M 988 450 Q 948 392 926 342",  "#567424"],
  ["M 988 450 Q 1078 412 1128 382", "#4e6c1c"],
];

// Flowering plant clusters [cx, cy, petal-color]
const FLOWERS: [number, number, string][] = [
  [382, 440, "#e87820"], [420, 432, "#d46018"],
  [1020, 440, "#d88018"], [1058, 432, "#c86010"],
  [682, 420, "#e09828"], [758, 418, "#cc8020"],
];

// Roof arch mullions (9 lines along the arch)
const ARCH_MULLION_TS = Array.from({ length: 9 }, (_, i) => i / 8);

// Stone floor tile dividers
const TILE_XS = Array.from({ length: 14 }, (_, i) => LEFT + 42 + i * 64);

export function BotanicalConservatory() {
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

  const tr = (d: number) => active ? `opacity 0.68s ease ${d}s` : "none";

  return (
    <div ref={ref} style={{
      background: "linear-gradient(180deg,#0a1020 0%,#0c1228 100%)",
      position: "relative",
      overflow: "hidden",
    }}>
      <svg
        viewBox="0 0 1440 560"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ display: "block", width: "100%", height: "auto" }}
        role="img"
        aria-label="Victorian botanical conservatory — brass-framed glass greenhouse glowing warmly with tropical plants inside, condensation on glass"
      >
        <defs>
          <radialGradient id="bc-glow" cx="50%" cy="58%" r="58%">
            <stop offset="0%"   stopColor="rgba(255,220,120,.94)"/>
            <stop offset="45%"  stopColor="rgba(230,170,70,.80)"/>
            <stop offset="100%" stopColor="rgba(180,118,28,.38)"/>
          </radialGradient>
          <linearGradient id="bc-glass-tint" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="rgba(180,210,255,.09)"/>
            <stop offset="100%" stopColor="rgba(140,180,220,.16)"/>
          </linearGradient>
          <linearGradient id="bc-ground" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#282c32"/>
            <stop offset="100%" stopColor="#1c2028"/>
          </linearGradient>
          <radialGradient id="bc-ext-glow" cx="50%" cy="100%" r="50%">
            <stop offset="0%"   stopColor="rgba(180,130,40,.28)"/>
            <stop offset="100%" stopColor="rgba(0,0,0,0)"/>
          </radialGradient>
          <filter id="bc-blur-glow"><feGaussianBlur stdDeviation="20"/></filter>
          <filter id="bc-cond-blur"><feGaussianBlur stdDeviation="0.9"/></filter>
          <clipPath id="bc-clip">
            <path d={INTERIOR_PATH}/>
          </clipPath>
        </defs>

        {/* ── EXTERIOR WARM LIGHT BLEED ── */}
        <ellipse cx={CX} cy={FLOOR} rx="520" ry="110"
          fill="url(#bc-ext-glow)" filter="url(#bc-blur-glow)"
          style={{ opacity: active ? 1 : 0, transition: tr(0.04) }}/>

        {/* ── GROUND TERRACE ── */}
        <rect x="0" y={FLOOR} width="1440" height={560 - FLOOR}
          fill="url(#bc-ground)"
          style={{ opacity: active ? 1 : 0, transition: tr(0.03) }}/>
        <line x1="0" y1={FLOOR} x2="1440" y2={FLOOR}
          stroke="rgba(80,80,70,.55)" strokeWidth="2"
          style={{ opacity: active ? 1 : 0, transition: tr(0.04) }}/>
        <g style={{ opacity: active ? 0.22 : 0, transition: tr(0.05) }}>
          {TILE_XS.map((x, i) => (
            <line key={i} x1={x} y1={FLOOR} x2={x} y2={FLOOR + 44}
              stroke="rgba(100,96,82,.40)" strokeWidth="1"/>
          ))}
        </g>

        {/* ── INTERIOR WARM GLOW ── */}
        <path d={INTERIOR_PATH}
          fill="url(#bc-glow)"
          style={{ opacity: active ? 1 : 0, transition: tr(0.06) }}/>

        {/* ══ PLANTS (clipped to interior) ══ */}
        <g clipPath="url(#bc-clip)"
          style={{ opacity: active ? 1 : 0, transition: tr(0.18) }}>

          {/* Areca palm trunk */}
          <path d="M 716 452 Q 714 382 720 286"
            stroke="#4a6824" strokeWidth="10" strokeLinecap="round" fill="none"/>

          {/* Palm fronds */}
          {PALM_FRONDS.map(([d, col, sw], i) => (
            <path key={i} d={d}
              stroke={col} strokeWidth={sw}
              strokeLinecap="round" fill="none"/>
          ))}

          {/* Left fern cluster */}
          {FERN_L.map(([d, col], i) => (
            <path key={i} d={d}
              stroke={col} strokeWidth="4.5"
              strokeLinecap="round" fill="none"/>
          ))}

          {/* Right fern cluster */}
          {FERN_R.map(([d, col], i) => (
            <path key={i} d={d}
              stroke={col} strokeWidth="4.5"
              strokeLinecap="round" fill="none"/>
          ))}

          {/* Left Monstera leaf */}
          <path d="M 572 450 Q 522 382 532 312 Q 562 252 622 272 Q 662 292 642 362 Q 622 412 572 450 Z"
            fill="#4e7020" opacity="0.84"/>
          <path d="M 572 450 Q 522 382 532 312"
            stroke="#3c5818" strokeWidth="2" fill="none"/>
          {/* Monstera leaf split holes */}
          <ellipse cx="562" cy="362" rx="8" ry="4"
            transform="rotate(-20,562,362)"
            fill="rgba(230,170,60,.35)"/>
          <ellipse cx="578" cy="326" rx="7" ry="3.5"
            transform="rotate(-10,578,326)"
            fill="rgba(230,170,60,.30)"/>

          {/* Right Monstera leaf */}
          <path d="M 868 450 Q 918 382 908 312 Q 878 252 818 272 Q 778 292 798 362 Q 818 412 868 450 Z"
            fill="#507420" opacity="0.80"/>
          <path d="M 868 450 Q 918 382 908 312"
            stroke="#3c5818" strokeWidth="2" fill="none"/>
          <ellipse cx="878" cy="362" rx="8" ry="4"
            transform="rotate(20,878,362)"
            fill="rgba(230,170,60,.30)"/>

          {/* Flowering plants */}
          {FLOWERS.map(([fx, fy, col], i) => (
            <g key={i}>
              <circle cx={fx}     cy={fy}      r="8"   fill={col}          opacity="0.74"/>
              <circle cx={fx - 8} cy={fy - 6}  r="5.5" fill={col}          opacity="0.64"/>
              <circle cx={fx + 7} cy={fy - 8}  r="6"   fill={col}          opacity="0.68"/>
              <circle cx={fx + 1} cy={fy - 14} r="4.5" fill="#f8c840"      opacity="0.58"/>
            </g>
          ))}

          {/* Planting bed soil mounds */}
          <ellipse cx={CX - 176} cy={FLOOR - 5} rx="92" ry="11" fill="rgba(72,46,18,.58)"/>
          <ellipse cx={CX}       cy={FLOOR - 5} rx="80" ry="10" fill="rgba(72,46,18,.52)"/>
          <ellipse cx={CX + 176} cy={FLOOR - 5} rx="92" ry="11" fill="rgba(72,46,18,.58)"/>
        </g>

        {/* ── GLASS TINT OVERLAY ── */}
        <path d={INTERIOR_PATH}
          fill="url(#bc-glass-tint)"
          style={{ opacity: active ? 1 : 0, transition: tr(0.07) }}/>

        {/* ── BRASS WALL MULLIONS & RAILS ── */}
        <g style={{ opacity: active ? 1 : 0, transition: tr(0.09) }}>
          {MULLION_XS.map((x, i) => (
            <line key={i}
              x1={x} y1={EAVE} x2={x} y2={FLOOR}
              stroke="rgba(196,148,40,.62)" strokeWidth="2"/>
          ))}
          {RAIL_YS.map((y, i) => (
            <line key={i}
              x1={LEFT} y1={y} x2={RIGHT} y2={y}
              stroke="rgba(196,148,40,.62)" strokeWidth="2"/>
          ))}
        </g>

        {/* ── BARREL VAULT ROOF ── */}
        <g style={{ opacity: active ? 1 : 0, transition: tr(0.08) }}>
          {/* Arch fill (glow leaks through roof) */}
          <path d={`M ${LEFT} ${EAVE} Q ${CX} ${ARCH} ${RIGHT} ${EAVE} L ${RIGHT + 14} ${EAVE + 20} Q ${CX} ${ARCH + 12} ${LEFT - 14} ${EAVE + 20} Z`}
            fill="rgba(200,158,50,.20)"/>
          {/* Roof mullion lines along arch curve */}
          {ARCH_MULLION_TS.map((t, i) => {
            const ax = LEFT + (RIGHT - LEFT) * t;
            // Quadratic bezier Y: (1-t)²·EAVE + 2t(1-t)·ARCH + t²·EAVE
            const ay = (1 - t) * (1 - t) * EAVE + 2 * t * (1 - t) * ARCH + t * t * EAVE;
            return (
              <line key={i}
                x1={ax.toFixed(1)} y1={ay.toFixed(1)}
                x2={ax.toFixed(1)} y2={EAVE.toString()}
                stroke="rgba(196,148,40,.32)" strokeWidth="1.2"/>
            );
          })}
          {/* Main arch ridge line (brass) */}
          <path d={`M ${LEFT} ${EAVE} Q ${CX} ${ARCH} ${RIGHT} ${EAVE}`}
            stroke="rgba(196,148,40,.85)" strokeWidth="3.5" fill="none"/>
          {/* Eave line */}
          <line x1={LEFT} y1={EAVE} x2={RIGHT} y2={EAVE}
            stroke="rgba(196,148,40,.65)" strokeWidth="3.5"/>
          {/* Ridge cap */}
          <path d={`M ${CX - 44} ${ARCH + 2} Q ${CX} ${ARCH - 6} ${CX + 44} ${ARCH + 2}`}
            stroke="rgba(196,148,40,.78)" strokeWidth="4.5" fill="none"/>
          {/* Finials */}
          <circle cx={CX}    cy={ARCH - 8} r="6.5"  fill="rgba(196,148,40,.74)"/>
          <circle cx={LEFT}  cy={EAVE}     r="5.5"  fill="rgba(196,148,40,.64)"/>
          <circle cx={RIGHT} cy={EAVE}     r="5.5"  fill="rgba(196,148,40,.64)"/>
        </g>

        {/* ── OUTER FRAME / PILASTERS ── */}
        <g style={{ opacity: active ? 1 : 0, transition: tr(0.08) }}>
          <line x1={LEFT}  y1={EAVE} x2={LEFT}  y2={FLOOR} stroke="rgba(196,148,40,.72)" strokeWidth="3.5"/>
          <line x1={RIGHT} y1={EAVE} x2={RIGHT} y2={FLOOR} stroke="rgba(196,148,40,.72)" strokeWidth="3.5"/>
          <line x1={LEFT}  y1={FLOOR} x2={RIGHT} y2={FLOOR} stroke="rgba(196,148,40,.58)" strokeWidth="4"/>
          <rect x={LEFT - 9}  y={EAVE} width="18" height={FLOOR - EAVE} rx="2"
            fill="rgba(196,148,40,.42)"/>
          <rect x={RIGHT - 9} y={EAVE} width="18" height={FLOOR - EAVE} rx="2"
            fill="rgba(196,148,40,.42)"/>
        </g>

        {/* ── ENTRANCE DOOR ── */}
        <g style={{ opacity: active ? 1 : 0, transition: tr(0.11) }}>
          <rect x={CX - 34} y={FLOOR - 112} width="68" height="112" rx="34"
            fill="none" stroke="rgba(196,148,40,.68)" strokeWidth="3"/>
          <rect x={CX - 30} y={FLOOR - 108} width="60" height="108" rx="30"
            fill="rgba(220,162,52,.52)"/>
          <circle cx={CX + 18} cy={FLOOR - 48} r="3.5"
            fill="rgba(196,148,40,.78)"/>
          {/* Transom */}
          <path d={`M ${CX - 34} ${FLOOR - 112} Q ${CX} ${FLOOR - 152} ${CX + 34} ${FLOOR - 112}`}
            fill="rgba(220,162,52,.42)"
            stroke="rgba(196,148,40,.54)" strokeWidth="2"/>
          {/* Door mullion bars */}
          <line x1={CX} y1={FLOOR - 108} x2={CX} y2={FLOOR}
            stroke="rgba(196,148,40,.38)" strokeWidth="1.2"/>
          <line x1={CX - 30} y1={FLOOR - 60} x2={CX + 30} y2={FLOOR - 60}
            stroke="rgba(196,148,40,.38)" strokeWidth="1.2"/>
        </g>

        {/* ── CONDENSATION DROPLETS ── */}
        <g filter="url(#bc-cond-blur)"
          style={{ opacity: active ? 1 : 0, transition: tr(0.13) }}>
          {COND.map(([x, y, r], i) => (
            <circle key={i} cx={x} cy={y} r={r}
              fill="rgba(255,255,255,.30)"/>
          ))}
        </g>

        {/* ── HEADER ── */}
        <text x="720" y="34" textAnchor="middle"
          fill="rgba(196,148,40,.28)" fontSize="9"
          fontFamily="monospace" letterSpacing="5"
          style={{ opacity: active ? 1 : 0, transition: tr(0.04) }}>
          ROUTE 9 WEB CO. · BOTANICAL CONSERVATORY
        </text>

        {/* ── CAPTION ── */}
        <g style={{ opacity: active ? 1 : 0, transition: tr(0.86) }}>
          <text x="720" y="506" textAnchor="middle"
            fill="rgba(196,168,70,.38)" fontSize="11.5"
            fontFamily="Georgia,'Times New Roman',serif"
            fontWeight="bold" letterSpacing="3">
            CULTIVATED WITH CARE · BUILT TO BLOOM
          </text>
          <text x="720" y="525" textAnchor="middle"
            fill="rgba(180,150,55,.20)" fontSize="8.5"
            fontFamily="monospace" letterSpacing="2.5">
            EVERY WEB PROJECT IS A LIVING THING
          </text>
        </g>
      </svg>
    </div>
  );
}
