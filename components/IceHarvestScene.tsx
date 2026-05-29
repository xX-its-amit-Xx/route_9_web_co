"use client";

// IceHarvestScene ─────────────────────────────────────────────────────────────
//
// Full-section historical winter illustration: Lake Quinsigamond ice harvest,
// a real Shrewsbury industry of the 1800s. Dawn sky gradient, far-shore
// dark treeline + ice house silhouette, frozen lake surface, four perspective
// open-water channels (where ice blocks have been cut away), ice-section
// horizontal cut lines, surface shimmer, ice cracks, five worker silhouettes
// with pikes/saws, stacked ice blocks, horse-drawn sled, foreground snow bank,
// falling snowflakes.
// Caption: "BUILT FOR THE LONG HAUL".
// Placed between AutumnForestPath and BarnQuilt.

import { useEffect, useRef, useState } from "react";

const HORIZON = 212;
const VP_X    = 720;
const VP_Y    = 200;
const FG_Y    = 514;

// Perspective x of a channel line at scene-y
const pX = (fg_x: number, y: number) =>
  Math.round(VP_X + (fg_x - VP_X) * (y - VP_Y) / (FG_Y - VP_Y));

// ── Lake channels ─────────────────────────────────────────────────────────────
// Open water channels: [left_fg_x, right_fg_x] (4 dark water strips)
const OPEN_CH: [number, number][] = [
  [ 92, 280],
  [442, 582],
  [858, 1000],
  [1160, 1348],
];

// Solid ice sections between channels (3 areas)
const ICE_SEC: [number, number][] = [
  [280, 442],
  [582, 858],
  [1000, 1160],
];

// Horizontal ice cut y-levels (cross-cuts on solid sections)
const CUT_YS = [244, 278, 318, 364, 414, 464] as const;

// Ice shimmer lines (faint horizontal glints)
const SHIMMER_YS = [254, 296, 344, 394, 444, 486] as const;

// ── Far shore ─────────────────────────────────────────────────────────────────
// Irregular treeline: [x, y_top] (polyline of tree tops)
const TREELINE: [number, number][] = [
  [0,210],[48,198],[96,208],[142,196],[192,206],[240,197],[288,207],
  [336,196],[384,206],[432,197],[480,205],[528,195],[576,204],[624,196],
  [672,206],[720,198],[768,205],[816,196],[864,204],[912,198],[958,206],
  [1006,195],[1054,204],[1102,196],[1150,205],[1198,196],[1248,204],
  [1296,196],[1344,206],[1392,198],[1440,207],
];

// Treeline filled silhouette path (dark shape; close at y=HORIZON+6)
const TREELINE_D =
  `M 0,${HORIZON + 6} ` +
  TREELINE.map(([x, y]) => `L ${x},${y}`).join(" ") +
  ` L 1440,${HORIZON + 6} Z`;

// Ice house silhouette: [x1, x2, y_floor, y_eave, y_ridge]
const IH = { x1: 918, x2: 1068, floor: 218, eave: 196, ridge: 178 } as const;

// Ice house chimney
const CHIM = { x: 956, y1: 164, y2: 178, w: 12 } as const;

// ── Workers ───────────────────────────────────────────────────────────────────
// [cx, cy, scale, arm_dir] arm_dir=1 → arm extends right, 0 → left
const WORKERS: [number, number, number, number][] = [
  [472, 278, 0.74, 0],
  [558, 266, 0.70, 1],
  [874, 272, 0.72, 0],
  [964, 258, 0.68, 1],
  [634, 252, 0.64, 0],
];

// ── Ice blocks ────────────────────────────────────────────────────────────────
// [x, y, w, h] — rectangular ice block shapes
const BLOCKS: [number, number, number, number][] = [
  [386, 260, 28, 15], [416, 260, 28, 15],
  [386, 245, 28, 15], [416, 245, 28, 15],
  [401, 230, 28, 15],
  [360, 268, 24, 13],
];

// ── Horse + sled ──────────────────────────────────────────────────────────────
const HSE_X = 1070, HSE_Y = 292;

// Horse body path (silhouette, facing left)
const HORSE_D =
  `M ${HSE_X + 44},${HSE_Y - 12}` +
  ` C ${HSE_X + 54},${HSE_Y - 22} ${HSE_X + 48},${HSE_Y - 38} ${HSE_X + 30},${HSE_Y - 42}` +
  ` C ${HSE_X + 10},${HSE_Y - 46} ${HSE_X - 18},${HSE_Y - 44} ${HSE_X - 44},${HSE_Y - 34}` +
  ` C ${HSE_X - 58},${HSE_Y - 26} ${HSE_X - 60},${HSE_Y - 14} ${HSE_X - 52},${HSE_Y - 4}` +
  ` L ${HSE_X - 46},${HSE_Y + 2}` +
  ` L ${HSE_X + 38},${HSE_Y + 2}` +
  ` C ${HSE_X + 42},${HSE_Y - 6} ${HSE_X + 44},${HSE_Y - 10} ${HSE_X + 44},${HSE_Y - 12} Z`;

// Horse legs: [x_top, y_top, x_bot, y_bot]
const HORSE_LEGS: [number, number, number, number][] = [
  [HSE_X - 34, HSE_Y + 2, HSE_X - 32, HSE_Y + 30],
  [HSE_X - 12, HSE_Y + 2, HSE_X -  8, HSE_Y + 30],
  [HSE_X + 12, HSE_Y + 2, HSE_X + 16, HSE_Y + 30],
  [HSE_X + 28, HSE_Y + 2, HSE_X + 26, HSE_Y + 30],
];

// Sled platform: [x1, x2, y_top, y_bot]
const SLD: [number, number, number, number] = [
  HSE_X - 148, HSE_X - 56, HSE_Y + 18, HSE_Y + 28,
];

// Sled runner lines: [x1, x2, y]
const RUNNERS: [number, number, number][] = [
  [HSE_X - 152, HSE_X - 50, HSE_Y + 28],
  [HSE_X - 150, HSE_X - 52, HSE_Y + 32],
];

// Sled ice cargo blocks
const SLED_BLOCKS: [number, number][] = [
  [HSE_X - 140, HSE_Y + 6],
  [HSE_X - 110, HSE_Y + 4],
  [HSE_X - 80,  HSE_Y + 7],
];

// ── Ice cracks ────────────────────────────────────────────────────────────────
// [x1,y1, x2,y2, x3,y3] — two-segment crack paths
const CRACKS: [number, number, number, number, number, number][] = [
  [402, 348, 392, 368, 380, 382],
  [702, 418, 722, 440, 708, 455],
  [1098, 308, 1090, 328, 1104, 346],
  [820, 376, 832, 396, 818, 410],
  [558, 436, 550, 456, 563, 470],
];

// ── Foreground snow bank ──────────────────────────────────────────────────────
// Bumps: [cx, ry] — ellipses along the bottom
const SNOW: [number, number][] = [
  [0, 58], [200, 68], [440, 52], [680, 62],
  [900, 55], [1140, 60], [1380, 54], [1440, 50],
];

// Snow tuft details: [x, y]
const SNOW_TUFTS: [number, number][] = [
  [148, 468], [326, 480], [562, 464], [788, 476], [1022, 466], [1268, 474],
];

// ── Falling snowflakes ────────────────────────────────────────────────────────
// [cx, cy, r] — small circles scattered across scene
const FLAKES: [number, number, number][] = [
  [68,  42, 1.0], [154, 88, 0.8], [248,  36, 1.2], [356, 74, 0.7],
  [458, 22, 0.9], [564, 58, 1.1], [672,  30, 0.8], [784, 52, 1.0],
  [888, 18, 0.9], [992, 44, 1.2], [1106, 28, 0.7],[1212, 60, 1.0],
  [1318, 34, 0.9],[1408, 72, 0.8],
  [122, 172, 0.7],[230, 148, 1.0],[338, 178, 0.8],[446, 152, 0.6],
  [554, 170, 0.9],[662, 144, 1.1],[770, 168, 0.7],[876, 146, 0.9],
  [986, 174, 0.8],[1094, 148, 1.0],[1202, 172, 0.7],[1310, 146, 0.9],
];

export function IceHarvestScene() {
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
    <div ref={ref} style={{ background: "#7a9ab8", position: "relative", overflow: "hidden" }}>
      <svg
        viewBox="0 0 1440 560"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ display: "block", width: "100%", height: "auto" }}
        role="img"
        aria-label="Lake Quinsigamond ice harvest — workers cutting ice blocks on the frozen lake at dawn, Shrewsbury Massachusetts"
      >
        <defs>
          <linearGradient id="ihs-sky" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%"   stopColor="#6688a8"/>
            <stop offset="60%"  stopColor="#9ab4c8"/>
            <stop offset="100%" stopColor="#d8c8a8"/>
          </linearGradient>
          <linearGradient id="ihs-ice" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%"   stopColor="#ccdce8"/>
            <stop offset="100%" stopColor="#dce8f0"/>
          </linearGradient>
          <linearGradient id="ihs-water" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%"   stopColor="#1a3850"/>
            <stop offset="100%" stopColor="#243e56"/>
          </linearGradient>
          <linearGradient id="ihs-snow" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%"   stopColor="#e8eef4"/>
            <stop offset="100%" stopColor="#d0dce8"/>
          </linearGradient>
          <radialGradient id="ihs-glow" cx="50%" cy="100%" r="60%">
            <stop offset="0%"   stopColor="rgba(240,210,140,.30)"/>
            <stop offset="100%" stopColor="rgba(0,0,0,0)"/>
          </radialGradient>
        </defs>

        {/* ── DAWN SKY ── */}
        <rect width="1440" height={HORIZON + 6} fill="url(#ihs-sky)"
          style={{ opacity: active ? 1 : 0, transition: tr(0.0) }}/>
        {/* Horizon glow */}
        <rect y={HORIZON - 30} width="1440" height="60"
          fill="url(#ihs-glow)"
          style={{ opacity: active ? 1 : 0, transition: tr(0.02) }}/>

        {/* ── FALLING SNOWFLAKES ── */}
        <g style={{ opacity: active ? 0.55 : 0, transition: tr(0.04) }}>
          {FLAKES.map(([cx, cy, r], i) => (
            <circle key={i} cx={cx} cy={cy} r={r} fill="rgba(255,255,255,.70)"/>
          ))}
        </g>

        {/* ── FAR SHORE TREELINE ── */}
        <path d={TREELINE_D}
          fill="rgba(22,30,38,.72)"
          style={{ opacity: active ? 1 : 0, transition: tr(0.05) }}/>

        {/* ── ICE HOUSE ── */}
        <g style={{ opacity: active ? 1 : 0, transition: tr(0.05) }}>
          {/* Building */}
          <polygon
            points={`${IH.x1},${IH.floor} ${IH.x1},${IH.eave} ${(IH.x1+IH.x2)/2},${IH.ridge} ${IH.x2},${IH.eave} ${IH.x2},${IH.floor}`}
            fill="rgba(22,30,38,.78)"/>
          {/* Large door */}
          <rect x={(IH.x1+IH.x2)/2 - 14} y={IH.eave + 8} width="28" height={IH.floor - IH.eave - 8}
            fill="rgba(8,12,18,.60)"/>
          {/* Chimney */}
          <rect x={CHIM.x} y={CHIM.y1} width={CHIM.w} height={CHIM.y2 - CHIM.y1}
            fill="rgba(22,30,38,.78)"/>
          {/* Chimney smoke wisps */}
          <path d={`M ${CHIM.x + 6},${CHIM.y1} C ${CHIM.x + 14},${CHIM.y1 - 8} ${CHIM.x + 2},${CHIM.y1 - 18} ${CHIM.x + 10},${CHIM.y1 - 26}`}
            stroke="rgba(200,190,178,.22)" strokeWidth="3" strokeLinecap="round"/>
          {/* Label */}
          <text x={(IH.x1+IH.x2)/2} y={IH.eave - 6} textAnchor="middle"
            fill="rgba(180,170,148,.30)"
            fontSize="6.5" fontFamily="monospace" letterSpacing="0.8">
            ICE HOUSE
          </text>
        </g>

        {/* ── FROZEN LAKE SURFACE ── */}
        <rect x="0" y={HORIZON} width="1440" height={560 - HORIZON}
          fill="url(#ihs-ice)"
          style={{ opacity: active ? 1 : 0, transition: tr(0.06) }}/>

        {/* ── OPEN WATER CHANNELS ── */}
        <g style={{ opacity: active ? 1 : 0, transition: tr(0.07) }}>
          {OPEN_CH.map(([x1, x2], i) => (
            <polygon key={i}
              points={`
                ${pX(x1, HORIZON - 4)},${HORIZON - 4}
                ${pX(x2, HORIZON - 4)},${HORIZON - 4}
                ${pX(x2, FG_Y + 10)},${FG_Y + 10}
                ${pX(x1, FG_Y + 10)},${FG_Y + 10}
              `}
              fill="url(#ihs-water)"/>
          ))}
        </g>

        {/* ── ICE SHIMMER LINES ── */}
        <g style={{ opacity: active ? 0.60 : 0, transition: tr(0.08) }}>
          {SHIMMER_YS.map((y, i) => (
            <line key={i}
              x1={pX(ICE_SEC[0]?.[0] ?? 280, y)} y1={y}
              x2={pX(ICE_SEC[2]?.[1] ?? 1160, y)} y2={y}
              stroke="rgba(255,255,255,.38)" strokeWidth="0.5"/>
          ))}
        </g>

        {/* ── CROSS-CUT LINES ON ICE SECTIONS ── */}
        <g style={{ opacity: active ? 1 : 0, transition: tr(0.09) }}>
          {ICE_SEC.map(([x1, x2], si) => (
            <g key={si}>
              {CUT_YS.map((y, ci) => (
                <line key={ci}
                  x1={pX(x1, y)} y1={y}
                  x2={pX(x2, y)} y2={y}
                  stroke="rgba(60,90,120,.20)" strokeWidth="0.8"/>
              ))}
            </g>
          ))}
          {/* Longitudinal channel boundary lines */}
          {[...OPEN_CH.map(([x]) => x), ...OPEN_CH.map(([, x]) => x)].map((fg_x, i) => (
            <line key={i}
              x1={pX(fg_x, HORIZON)} y1={HORIZON}
              x2={pX(fg_x, FG_Y)}   y2={FG_Y}
              stroke="rgba(60,90,120,.25)" strokeWidth="0.6"/>
          ))}
        </g>

        {/* ── ICE SURFACE CRACKS ── */}
        <g style={{ opacity: active ? 1 : 0, transition: tr(0.10) }}>
          {CRACKS.map(([x1, y1, x2, y2, x3, y3], i) => (
            <polyline key={i}
              points={`${x1},${y1} ${x2},${y2} ${x3},${y3}`}
              stroke="rgba(100,140,180,.28)" strokeWidth="0.7"/>
          ))}
        </g>

        {/* ── STACKED ICE BLOCKS ── */}
        <g style={{ opacity: active ? 1 : 0, transition: tr(0.11) }}>
          {BLOCKS.map(([x, y, w, h], i) => (
            <g key={i}>
              <rect x={x} y={y} width={w} height={h} rx="1"
                fill="rgba(182,218,240,.70)"
                stroke="rgba(80,130,170,.50)" strokeWidth="0.8"/>
              {/* Top face highlight */}
              <rect x={x + 1} y={y + 1} width={w - 2} height={3}
                fill="rgba(240,248,255,.30)"/>
            </g>
          ))}
        </g>

        {/* ── WORKER SILHOUETTES ── */}
        <g style={{ opacity: active ? 1 : 0, transition: tr(0.12) }}>
          {WORKERS.map(([cx, cy, s, armR], i) => (
            <g key={i} fill="rgba(26,16,10,.72)">
              {/* Head */}
              <circle cx={cx} cy={cy - 12 * s} r={5 * s}/>
              {/* Body */}
              <rect x={cx - 3.5 * s} y={cy - 7 * s} width={7 * s} height={16 * s} rx={1.5 * s}/>
              {/* Legs */}
              <line x1={cx - 1.5 * s} y1={cy + 9 * s} x2={cx - 4.5 * s} y2={cy + 22 * s}
                stroke="rgba(26,16,10,.68)" strokeWidth={2.5 * s} strokeLinecap="round"/>
              <line x1={cx + 1.5 * s} y1={cy + 9 * s} x2={cx + 4.5 * s} y2={cy + 22 * s}
                stroke="rgba(26,16,10,.68)" strokeWidth={2.5 * s} strokeLinecap="round"/>
              {/* Tool arm (pike / ice saw) */}
              {armR === 1
                ? <line x1={cx + 4 * s} y1={cy - 2 * s} x2={cx + 18 * s} y2={cy + 20 * s}
                    stroke="rgba(26,16,10,.55)" strokeWidth={1.6 * s} strokeLinecap="round"/>
                : <line x1={cx - 4 * s} y1={cy - 2 * s} x2={cx - 18 * s} y2={cy + 20 * s}
                    stroke="rgba(26,16,10,.55)" strokeWidth={1.6 * s} strokeLinecap="round"/>}
              {/* Opposite arm */}
              {armR === 1
                ? <line x1={cx - 3 * s} y1={cy - 1 * s} x2={cx - 10 * s} y2={cy + 10 * s}
                    stroke="rgba(26,16,10,.45)" strokeWidth={1.4 * s} strokeLinecap="round"/>
                : <line x1={cx + 3 * s} y1={cy - 1 * s} x2={cx + 10 * s} y2={cy + 10 * s}
                    stroke="rgba(26,16,10,.45)" strokeWidth={1.4 * s} strokeLinecap="round"/>}
            </g>
          ))}
        </g>

        {/* ── HORSE + SLED ── */}
        <g style={{ opacity: active ? 1 : 0, transition: tr(0.13) }}>
          {/* Sled platform */}
          <rect x={SLD[0]} y={SLD[2]} width={SLD[1] - SLD[0]} height={SLD[3] - SLD[2]}
            fill="rgba(80,48,18,.72)" stroke="rgba(50,28,8,.50)" strokeWidth="0.8"/>
          {/* Sled runners */}
          {RUNNERS.map(([x1, x2, y], i) => (
            <line key={i} x1={x1} y1={y} x2={x2} y2={y}
              stroke="rgba(50,28,8,.65)" strokeWidth="2.5" strokeLinecap="round"/>
          ))}
          {/* Sled cargo blocks */}
          {SLED_BLOCKS.map(([bx, by], i) => (
            <rect key={i} x={bx} y={by} width="26" height="13" rx="1"
              fill="rgba(182,218,240,.65)"
              stroke="rgba(80,130,170,.42)" strokeWidth="0.7"/>
          ))}
          {/* Harness lines */}
          <line x1={HSE_X - 52} y1={HSE_Y - 2}
            x2={SLD[1]} y2={SLD[2] + 4}
            stroke="rgba(26,16,10,.40)" strokeWidth="1.4"/>
          {/* Horse body */}
          <path d={HORSE_D} fill="rgba(26,16,10,.72)"/>
          {/* Horse legs */}
          {HORSE_LEGS.map(([x1, y1, x2, y2], i) => (
            <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
              stroke="rgba(26,16,10,.68)" strokeWidth="3.5" strokeLinecap="round"/>
          ))}
          {/* Breath plume */}
          <path d={`M ${HSE_X + 46},${HSE_Y - 14} C ${HSE_X + 60},${HSE_Y - 20} ${HSE_X + 56},${HSE_Y - 28} ${HSE_X + 68},${HSE_Y - 32}`}
            stroke="rgba(220,220,220,.30)" strokeWidth="3" strokeLinecap="round"/>
        </g>

        {/* ── FOREGROUND SNOW BANK ── */}
        <g style={{ opacity: active ? 1 : 0, transition: tr(0.14) }}>
          {SNOW.map(([cx, ry], i) => (
            <ellipse key={i} cx={cx} cy={560} rx={160} ry={ry}
              fill="url(#ihs-snow)"/>
          ))}
          {/* Snow surface highlights */}
          {SNOW_TUFTS.map(([x, y], i) => (
            <ellipse key={i} cx={x} cy={y} rx="22" ry="8"
              fill="rgba(240,246,252,.55)"/>
          ))}
        </g>

        {/* ── HEADER ── */}
        <text x="720" y="26" textAnchor="middle"
          fill="rgba(210,220,228,.22)"
          fontSize="9" fontFamily="monospace" letterSpacing="5"
          style={{ opacity: active ? 1 : 0, transition: tr(0.04) }}>
          LAKE QUINSIGAMOND · SHREWSBURY · circa 1870
        </text>

        {/* ── CAPTION ── */}
        <g style={{ opacity: active ? 1 : 0, transition: tr(0.85) }}>
          <text x="720" y="530" textAnchor="middle"
            fill="rgba(210,224,236,.48)"
            fontSize="12" fontFamily="Georgia,'Times New Roman',serif"
            fontWeight="bold" letterSpacing="3.5">
            BUILT FOR THE LONG HAUL
          </text>
          <text x="720" y="549" textAnchor="middle"
            fill="rgba(190,206,220,.24)"
            fontSize="8.5" fontFamily="monospace" letterSpacing="2.5">
            SHREWSBURY'S ICE INDUSTRY · LAKE QUINSIGAMOND · ROUTE 9 WEB CO.
          </text>
        </g>
      </svg>
    </div>
  );
}
