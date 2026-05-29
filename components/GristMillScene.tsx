"use client";

// GristMillScene ─────────────────────────────────────────────────────────────
//
// Full-section New England grist mill illustration. Warm autumn afternoon:
// rolling hill treeline in orange/gold/rust, still mill pond, wooden mill-race
// trough, CSS-animated overshot water wheel (10 paddles, 5 spokes, 8s/rev),
// stone mill building with gabled roof, arched door, windows, lower stream
// channel with water splash, foreground bank with rocks and fallen leaves.
// Caption: "DRIVEN BY YOUR SUCCESS".
// Placed between BarnQuilt and ShrewsburyClockTower.

import { useEffect, useRef, useState } from "react";

// ── Water wheel ───────────────────────────────────────────────────────────────
const WHEEL_CX = 488, WHEEL_CY = 322, WHEEL_R = 80;
const BUCKET_D = 18, BUCKET_W = 20;   // bucket radial depth / tangential width
const HUB_R    = 10;

// 10 bucket (paddle) paths generated around the rim
const BUCKETS = Array.from({ length: 10 }, (_, i) => {
  const a   = (i * 36) * Math.PI / 180;
  const s   = Math.sin(a), c = Math.cos(a);
  const Ro  = WHEEL_R, Ri = WHEEL_R - BUCKET_D, hw = BUCKET_W / 2;
  return (
    `M ${(WHEEL_CX + Ri * c - hw * s).toFixed(1)},${(WHEEL_CY + Ri * s + hw * c).toFixed(1)}` +
    ` L ${(WHEEL_CX + Ro * c - hw * s).toFixed(1)},${(WHEEL_CY + Ro * s + hw * c).toFixed(1)}` +
    ` L ${(WHEEL_CX + Ro * c + hw * s).toFixed(1)},${(WHEEL_CY + Ro * s - hw * c).toFixed(1)}` +
    ` L ${(WHEEL_CX + Ri * c + hw * s).toFixed(1)},${(WHEEL_CY + Ri * s - hw * c).toFixed(1)} Z`
  );
});

// 5 spoke lines
const SPOKES = Array.from({ length: 5 }, (_, i) => {
  const a = (i * 72) * Math.PI / 180;
  return {
    x1: (WHEEL_CX + HUB_R * Math.cos(a)).toFixed(1),
    y1: (WHEEL_CY + HUB_R * Math.sin(a)).toFixed(1),
    x2: (WHEEL_CX + (WHEEL_R - BUCKET_D - 4) * Math.cos(a)).toFixed(1),
    y2: (WHEEL_CY + (WHEEL_R - BUCKET_D - 4) * Math.sin(a)).toFixed(1),
  };
});

// ── Mill building ─────────────────────────────────────────────────────────────
const MB_X1 = 578, MB_X2 = 878, MB_FLOOR = 386;
const MB_CX  = (MB_X1 + MB_X2) / 2;  // 728
const MB_WALL_TOP = 292;              // top of stone walls
const MB_ROOF_Y   = 210;             // gable roof peak y

// Stone wall texture: [x, y, w, h, shade_offset(-8..+6)]
const STONES: [number, number, number, number, number][] = [
  [582,296,34,20, 0],[618,298,28,18,-8],[648,294,32,22, 5],[682,296,24,20,-3],
  [708,298,36,18, 6],[746,296,28,20,-5],[776,294,32,22, 2],[810,296,26,20, 0],
  [838,298,34,18,-6],[874,296,28,20, 4],
  [582,318,30,20, 3],[614,320,36,18,-4],[652,318,24,22, 0],[678,320,32,18, 5],
  [712,318,28,20,-8],[742,320,34,18, 4],[778,318,26,22,-2],[806,320,32,18, 0],
  [840,318,30,20,-6],[872,320,28,18, 4],
  [582,342,34,20,-4],[618,344,26,18, 0],[646,342,30,22, 6],[678,344,34,18,-2],
  [714,342,28,20, 4],[744,344,32,18,-6],[778,342,26,22, 0],[806,344,34,18, 2],
  [842,342,28,20,-4],[872,344,30,18, 6],
  [582,364,30,22, 2],[614,366,34,18,-6],[650,364,28,22, 0],[680,366,32,18, 5],
  [714,364,26,20,-3],[742,366,36,18, 4],[780,364,28,22,-8],[810,366,34,18, 0],
  [846,364,26,20, 3],[874,366,32,18,-4],
];

// ── Background trees (autumn foliage) ────────────────────────────────────────
// [cx, cy, r, color]
const BG_TREES: [number, number, number, string][] = [
  // Far layer (y≈168–188, r≈14–18)
  [58,176,14,"#d46010"],[108,170,16,"#e08828"],[160,178,14,"#c05008"],
  [210,172,17,"#e8a020"],[264,176,15,"#a84010"],[318,170,18,"#d46010"],
  [370,178,14,"#e08828"],[426,172,16,"#cc6018"],[482,176,15,"#d46010"],
  [540,170,18,"#e08828"],[596,178,14,"#a84010"],[650,172,16,"#d46010"],
  [708,176,17,"#e08828"],[764,168,15,"#c05008"],[822,176,14,"#e8a020"],
  [878,170,17,"#a84010"],[936,178,15,"#d46010"],[994,170,16,"#e08828"],
  [1050,176,14,"#cc6018"],[1110,170,17,"#c05008"],[1170,178,15,"#d46010"],
  [1228,170,16,"#e08828"],[1290,176,14,"#a84010"],[1350,170,17,"#e8a020"],
  [1410,178,14,"#d46010"],
  // Near layer (y≈196–218, r≈20–26)
  [40,208,20,"#c05008"],[94,198,24,"#e08828"],[150,210,22,"#d46010"],
  [204,200,26,"#a84010"],[260,208,20,"#e8a020"],[320,198,23,"#cc6018"],
  [380,210,22,"#d46010"],[440,200,25,"#e08828"],[506,208,21,"#c05008"],
  [564,198,23,"#d46010"],[630,210,22,"#a84010"],[694,200,26,"#e08828"],
  [760,208,20,"#cc6018"],[826,198,24,"#e8a020"],[894,210,22,"#d46010"],
  [960,200,25,"#a84010"],[1030,208,21,"#e08828"],[1100,198,23,"#c05008"],
  [1170,210,22,"#d46010"],[1244,198,24,"#e08828"],[1320,210,20,"#cc6018"],
  [1400,200,23,"#a84010"],
];

// ── Mill pond ─────────────────────────────────────────────────────────────────
const POND_X2 = 442, POND_Y1 = 240, POND_Y2 = 384;

// Shimmer lines: [x1,y1,x2,y2]
const POND_SHIMMER: [number, number, number, number][] = [
  [18, 266, 432, 268], [16, 292, 430, 294], [18, 318, 432, 316],
  [16, 344, 430, 346], [18, 370, 432, 368],
];

// Faint pond reflection blobs (inverted tree shapes)
const REFLECTIONS: [number, number, number, string][] = [
  [80, 360, 18, "rgba(180,90,18,.12)"],  [200, 368, 22, "rgba(190,100,20,.10)"],
  [330, 356, 18, "rgba(160,80,14,.12)"], [420, 364, 14, "rgba(170,90,16,.10)"],
];

// ── Lower stream (below wheel) ────────────────────────────────────────────────
// Splash droplets at wheel bottom: [cx, cy, r]
const SPLASH: [number, number, number][] = [
  [462, 408, 3], [488, 414, 4], [514, 406, 3],
  [474, 418, 2], [500, 422, 3], [486, 426, 2],
];

// Stream shimmer lines below wheel
const STREAM_SHIMMER: [number, number, number, number][] = [
  [446, 406, 582, 408], [448, 424, 580, 422], [446, 444, 582, 446],
];

// ── Foreground ────────────────────────────────────────────────────────────────
// Rocks: [cx, cy, rx, ry]
const ROCKS: [number, number, number, number][] = [
  [108, 462, 28, 16], [188, 470, 22, 13], [354, 448, 32, 17],
  [492, 466, 26, 15], [882, 452, 30, 17], [1062, 462, 24, 14],
  [1222, 458, 28, 16],
];

// Fallen leaves: [cx, cy, r, color]
const FORE_LEAVES: [number, number, number, string][] = [
  [146, 468, 8, "#d46010"], [224, 474, 7, "#e08828"], [306, 460, 8, "#a84010"],
  [420, 472, 9, "#cc6018"], [552, 464, 7, "#e8a020"], [682, 476, 8, "#d46010"],
  [760, 462, 9, "#c05008"], [852, 474, 7, "#e08828"], [950, 468, 8, "#a84010"],
  [1082, 472, 9, "#d46010"],[1202, 464, 7, "#cc6018"],[1314, 476, 8, "#e08828"],
];

export function GristMillScene() {
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
    <div ref={ref} style={{ background: "#8aaa78", position: "relative", overflow: "hidden" }}>
      <style>{`
        @keyframes gms-wheel {
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
        aria-label="New England grist mill with animated water wheel, mill pond, stone building, and autumn foliage"
      >
        <defs>
          <linearGradient id="gms-sky" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%"   stopColor="#7090b0"/>
            <stop offset="55%"  stopColor="#a0b8c8"/>
            <stop offset="100%" stopColor="#d8c8a0"/>
          </linearGradient>
          <linearGradient id="gms-pond" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%"   stopColor="#8ab0c4"/>
            <stop offset="100%" stopColor="#6898b4"/>
          </linearGradient>
          <linearGradient id="gms-stream" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%"   stopColor="#7aacbf"/>
            <stop offset="100%" stopColor="#5a8caa"/>
          </linearGradient>
          <linearGradient id="gms-ground" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%"   stopColor="#6a8858"/>
            <stop offset="100%" stopColor="#4a6838"/>
          </linearGradient>
          <linearGradient id="gms-roof" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%"   stopColor="#5a5446"/>
            <stop offset="100%" stopColor="#3e3a2e"/>
          </linearGradient>
          <radialGradient id="gms-wheel-hub" cx="40%" cy="35%" r="68%">
            <stop offset="0%"   stopColor="#c89030"/>
            <stop offset="100%" stopColor="#7a5410"/>
          </radialGradient>
        </defs>

        {/* ── SKY ── */}
        <rect width="1440" height="240" fill="url(#gms-sky)"
          style={{ opacity: active ? 1 : 0, transition: tr(0.0) }}/>

        {/* ── BACKGROUND HILL SILHOUETTE ── */}
        <path
          d="M 0,228 C 180,202 360,218 540,206 C 720,194 900,212 1080,200 C 1260,188 1360,208 1440,202 L 1440,580 L 0,580 Z"
          fill="rgba(48,64,32,.38)"
          style={{ opacity: active ? 1 : 0, transition: tr(0.02) }}/>

        {/* ── AUTUMN TREE CANOPY CLUSTERS ── */}
        <g style={{ opacity: active ? 1 : 0, transition: tr(0.04) }}>
          {BG_TREES.map(([cx, cy, r, col], i) => (
            <circle key={i} cx={cx} cy={cy} r={r} fill={col} opacity="0.82"/>
          ))}
        </g>

        {/* ── MILL POND ── */}
        <g style={{ opacity: active ? 1 : 0, transition: tr(0.06) }}>
          <rect x="0" y={POND_Y1} width={POND_X2} height={POND_Y2 - POND_Y1}
            fill="url(#gms-pond)"/>
          {/* Shimmer lines */}
          {POND_SHIMMER.map(([x1, y1, x2, y2], i) => (
            <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
              stroke="rgba(255,255,255,.18)" strokeWidth="0.6"/>
          ))}
          {/* Reflection blobs */}
          {REFLECTIONS.map(([cx, cy, r, col], i) => (
            <ellipse key={i} cx={cx} cy={cy} rx={r} ry={r * 0.4} fill={col}/>
          ))}
          {/* Pond edge / dam */}
          <line x1={POND_X2} y1={POND_Y1} x2={POND_X2} y2={POND_Y2}
            stroke="rgba(80,60,30,.50)" strokeWidth="4" strokeLinecap="round"/>
        </g>

        {/* ── MILL RACE (wooden trough from pond to wheel top) ── */}
        <g style={{ opacity: active ? 1 : 0, transition: tr(0.08) }}>
          <polygon
            points={`${POND_X2 - 2},${POND_Y1 + 8} ${WHEEL_CX},${WHEEL_CY - WHEEL_R - 2} ${WHEEL_CX},${WHEEL_CY - WHEEL_R + 14} ${POND_X2 - 2},${POND_Y1 + 24}`}
            fill="#8a6020" stroke="rgba(60,38,8,.50)" strokeWidth="0.8"/>
          {/* Water in race */}
          <polygon
            points={`${POND_X2 - 2},${POND_Y1 + 11} ${WHEEL_CX},${WHEEL_CY - WHEEL_R + 1} ${WHEEL_CX},${WHEEL_CY - WHEEL_R + 10} ${POND_X2 - 2},${POND_Y1 + 20}`}
            fill="rgba(90,160,200,.55)"/>
        </g>

        {/* ── LOWER STREAM (below wheel) ── */}
        <g style={{ opacity: active ? 1 : 0, transition: tr(0.07) }}>
          <rect x="408" y={WHEEL_CY + WHEEL_R - 4} width="188" height="72"
            fill="url(#gms-stream)"/>
          {STREAM_SHIMMER.map(([x1, y1, x2, y2], i) => (
            <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
              stroke="rgba(255,255,255,.16)" strokeWidth="0.6"/>
          ))}
          {/* Water splash at wheel base */}
          {SPLASH.map(([cx, cy, r], i) => (
            <circle key={i} cx={cx} cy={cy} r={r}
              fill="rgba(200,230,245,.55)"/>
          ))}
        </g>

        {/* ── STONE MILL BUILDING ── */}
        <g style={{ opacity: active ? 1 : 0, transition: tr(0.08) }}>
          {/* Wall base fill */}
          <rect x={MB_X1} y={MB_WALL_TOP} width={MB_X2 - MB_X1} height={MB_FLOOR - MB_WALL_TOP}
            fill="#8a8272"/>

          {/* Stone texture */}
          {STONES.map(([x, y, w, h, sh], i) => (
            <rect key={i} x={x} y={y} width={w} height={h} rx="1"
              fill={`rgb(${126 + sh},${122 + sh},${110 + sh})`}
              stroke="rgba(50,44,36,.22)" strokeWidth="0.5"/>
          ))}

          {/* Gable roof */}
          <polygon
            points={`${MB_X1},${MB_WALL_TOP} ${MB_CX},${MB_ROOF_Y} ${MB_X2},${MB_WALL_TOP}`}
            fill="url(#gms-roof)"
            stroke="rgba(30,24,16,.35)" strokeWidth="1"/>

          {/* Roof ridge cap */}
          <line x1={MB_X1} y1={MB_WALL_TOP} x2={MB_X2} y2={MB_WALL_TOP}
            stroke="rgba(30,24,16,.28)" strokeWidth="1.5"/>

          {/* Windows (2) */}
          {[640, 814].map((wx, i) => (
            <g key={i}>
              <rect x={wx - 12} y={316} width="24" height="30" rx="2"
                fill="rgba(180,160,100,.55)"
                stroke="rgba(50,38,14,.45)" strokeWidth="1.2"/>
              {/* Window frame cross */}
              <line x1={wx} y1={316} x2={wx} y2={346}
                stroke="rgba(50,38,14,.35)" strokeWidth="0.8"/>
              <line x1={wx - 12} y1={331} x2={wx + 12} y2={331}
                stroke="rgba(50,38,14,.35)" strokeWidth="0.8"/>
            </g>
          ))}

          {/* Arched door */}
          <path
            d={`M ${MB_CX - 14},${MB_FLOOR} L ${MB_CX - 14},${MB_FLOOR - 26} A 14,14 0 0,1 ${MB_CX + 14},${MB_FLOOR - 26} L ${MB_CX + 14},${MB_FLOOR} Z`}
            fill="rgba(40,28,12,.70)"/>
          {/* Door frame */}
          <path
            d={`M ${MB_CX - 14},${MB_FLOOR} L ${MB_CX - 14},${MB_FLOOR - 26} A 14,14 0 0,1 ${MB_CX + 14},${MB_FLOOR - 26} L ${MB_CX + 14},${MB_FLOOR}`}
            fill="none" stroke="rgba(80,60,20,.45)" strokeWidth="1.2"/>

          {/* Building base / foundation ledge */}
          <rect x={MB_X1 - 4} y={MB_FLOOR} width={MB_X2 - MB_X1 + 8} height="8"
            fill="rgba(100,90,78,.70)"/>
        </g>

        {/* ── ANIMATED WATER WHEEL ── */}
        <g style={{
          transformOrigin: `${WHEEL_CX}px ${WHEEL_CY}px`,
          animation: active ? "gms-wheel 8s linear infinite" : "none",
          opacity: active ? 1 : 0,
          transition: tr(0.10),
        }}>
          {/* Outer rim */}
          <circle cx={WHEEL_CX} cy={WHEEL_CY} r={WHEEL_R}
            fill="none" stroke="#6a4818" strokeWidth="5"/>
          {/* Inner rim */}
          <circle cx={WHEEL_CX} cy={WHEEL_CY} r={WHEEL_R - BUCKET_D}
            fill="none" stroke="#7a5420" strokeWidth="2.5"/>
          {/* Spokes */}
          {SPOKES.map((sp, i) => (
            <line key={i} x1={sp.x1} y1={sp.y1} x2={sp.x2} y2={sp.y2}
              stroke="#7a5218" strokeWidth="4.5" strokeLinecap="round"/>
          ))}
          {/* Buckets / paddles */}
          {BUCKETS.map((d, i) => (
            <path key={i} d={d}
              fill="#8a6020" stroke="#5a3c10" strokeWidth="0.8"/>
          ))}
          {/* Hub */}
          <circle cx={WHEEL_CX} cy={WHEEL_CY} r={HUB_R + 3}
            fill="url(#gms-wheel-hub)"
            stroke="rgba(200,160,40,.50)" strokeWidth="1.0"/>
          <circle cx={WHEEL_CX} cy={WHEEL_CY} r="5"
            fill="#4a3010"/>
        </g>

        {/* Wheel axle bracket (static, on building wall) */}
        <rect x={WHEEL_CX + 2} y={WHEEL_CY - 7} width={MB_X1 - WHEEL_CX - 2} height="14"
          fill="rgba(100,72,28,.55)"
          style={{ opacity: active ? 1 : 0, transition: tr(0.10) }}/>

        {/* ── GROUND / BANK ── */}
        <g style={{ opacity: active ? 1 : 0, transition: tr(0.12) }}>
          <path
            d="M 0,446 C 200,434 480,450 720,438 C 960,426 1200,444 1440,436 L 1440,580 L 0,580 Z"
            fill="url(#gms-ground)"/>
          {/* Stream bank edge detail */}
          <path
            d="M 404,436 C 440,420 520,416 596,432"
            stroke="rgba(80,60,30,.35)" strokeWidth="2" strokeLinecap="round"/>

          {/* Rocks */}
          {ROCKS.map(([cx, cy, rx, ry], i) => (
            <ellipse key={i} cx={cx} cy={cy} rx={rx} ry={ry}
              fill="rgba(140,130,116,.80)"
              stroke="rgba(80,70,58,.30)" strokeWidth="0.7"/>
          ))}

          {/* Fallen leaves */}
          {FORE_LEAVES.map(([cx, cy, r, col], i) => (
            <ellipse key={i} cx={cx} cy={cy} rx={r} ry={r * 0.55}
              fill={col} opacity="0.70"/>
          ))}
        </g>

        {/* ── HEADER ── */}
        <text x="720" y="28" textAnchor="middle"
          fill="rgba(200,180,120,.22)"
          fontSize="9" fontFamily="monospace" letterSpacing="5"
          style={{ opacity: active ? 1 : 0, transition: tr(0.04) }}>
          ROUTE 9 WEB CO. · NEW ENGLAND CRAFTSMANSHIP
        </text>

        {/* ── CAPTION ── */}
        <g style={{ opacity: active ? 1 : 0, transition: tr(0.85) }}>
          <text x="720" y="548" textAnchor="middle"
            fill="rgba(210,188,130,.46)"
            fontSize="12" fontFamily="Georgia,'Times New Roman',serif"
            fontWeight="bold" letterSpacing="3.5">
            DRIVEN BY YOUR SUCCESS
          </text>
          <text x="720" y="567" textAnchor="middle"
            fill="rgba(190,168,110,.24)"
            fontSize="8.5" fontFamily="monospace" letterSpacing="2.5">
            THE WHEEL KEEPS TURNING · ROUTE 9 WEB CO.
          </text>
        </g>
      </svg>
    </div>
  );
}
