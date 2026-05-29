"use client";
import { useEffect, useRef, useState } from "react";

// Pass 54: New England autumn cider press — wooden screw press, apple baskets, golden cider, weathered barn

const W = 1440, H = 560;
const FLOOR_Y = 468;
const HORIZON_Y = 210;

// Orchard background trees
type OTree = [number, number, number, string, string]; // cx, cy, r, trunk, canopy
const ORCHARD: OTree[] = [
  [68,  194, 32, "#5a3010", "#c84018"],
  [138, 188, 28, "#5a3010", "#d45010"],
  [204, 196, 34, "#4a2808", "#b83818"],
  [276, 186, 26, "#5a3010", "#e06028"],
  [344, 192, 30, "#4a2808", "#c84820"],
  [418, 188, 28, "#5a3010", "#d85c18"],
  [494, 194, 32, "#4a2808", "#c44018"],
  [566, 186, 24, "#5a3010", "#e06830"],
  [636, 192, 30, "#4a2808", "#b83010"],
  [704, 188, 26, "#5a3010", "#cc4c20"],
  [772, 194, 28, "#4a2808", "#d85818"],
  [112, 202, 22, "#5a3010", "#d86028"],
  [248, 200, 24, "#5a3010", "#c84018"],
  [382, 198, 20, "#4a2808", "#e07030"],
  [518, 202, 22, "#5a3010", "#bc3818"],
  [654, 200, 24, "#4a2808", "#d45820"],
  [1282, 200, 28, "#4a2808", "#c84020"],
  [1344, 192, 32, "#5a3010", "#d85010"],
  [1386, 198, 24, "#4a2808", "#e06030"],
];

// Fallen apples on ground
type Apple = [number, number, number, string];
const APPLES: Apple[] = [
  [310, FLOOR_Y - 6,  7, "#c83010"],
  [336, FLOOR_Y - 5,  6, "#d84818"],
  [358, FLOOR_Y - 6,  7, "#a82808"],
  [378, FLOOR_Y - 5,  5, "#c83c14"],
  [290, FLOOR_Y - 4,  5, "#d05020"],
  [924, FLOOR_Y - 6,  6, "#c02808"],
  [952, FLOOR_Y - 5,  7, "#d84010"],
  [974, FLOOR_Y - 4,  5, "#b83018"],
  [1004,FLOOR_Y - 6,  6, "#cc3c18"],
  [848, FLOOR_Y - 5,  5, "#d04820"],
];

// Apple baskets
type Basket = [number, number, number, number]; // x, y, w, h
const BASKETS: Basket[] = [
  [234, FLOOR_Y - 68, 72, 60],
  [820, FLOOR_Y - 64, 68, 56],
  [892, FLOOR_Y - 58, 60, 50],
  [1052, FLOOR_Y - 72, 76, 64],
];

// Apples in each basket (stacked mounds)
type BApple = [number, number, number, string];
const BASKET_APPLES: BApple[][] = [
  [[270,FLOOR_Y-78,9,"#c83010"],[282,FLOOR_Y-86,8,"#d84010"],[258,FLOOR_Y-72,8,"#a82808"],[294,FLOOR_Y-80,9,"#e05020"],[270,FLOOR_Y-96,8,"#c04018"]],
  [[856,FLOOR_Y-74,8,"#c82808"],[868,FLOOR_Y-82,9,"#d84818"],[844,FLOOR_Y-70,7,"#b83010"],[880,FLOOR_Y-76,8,"#e05428"],[856,FLOOR_Y-90,7,"#c03818"]],
  [[922,FLOOR_Y-68,7,"#d03010"],[912,FLOOR_Y-62,6,"#c82808"],[932,FLOOR_Y-62,6,"#b82808"],[922,FLOOR_Y-76,7,"#d84010"]],
  [[1090,FLOOR_Y-82,9,"#c83010"],[1078,FLOOR_Y-76,8,"#d84818"],[1102,FLOOR_Y-78,8,"#a82808"],[1090,FLOOR_Y-94,9,"#e05020"],[1078,FLOOR_Y-90,7,"#c04018"]],
];

// ===================== CIDER PRESS =====================
// Wooden screw press centered at x=720
const PRESS_BASE_X = 618, PRESS_BASE_W = 204;
const PRESS_BASE_Y = FLOOR_Y - 24;
const PRESS_BED_Y  = FLOOR_Y - 80;
const PRESS_PLAT_Y = FLOOR_Y - 120; // pressing platform (bottom of screw block)
const PRESS_TOP_Y  = FLOOR_Y - 352;
const PRESS_CX     = 720;

// Press uprights (two thick wooden beams)
const UPR_W = 18;
const UPR_LX = PRESS_CX - 84;
const UPR_RX = PRESS_CX + 66;

// Cross beams
type Beam = [number, number, number, number]; // x, y, w, h
const BEAMS: Beam[] = [
  [UPR_LX - 6, PRESS_TOP_Y,     UPR_RX - UPR_LX + 30, 22], // top beam
  [UPR_LX - 4, PRESS_TOP_Y + 68, UPR_RX - UPR_LX + 26, 16], // second beam
  [UPR_LX - 2, PRESS_BED_Y - 16, UPR_RX - UPR_LX + 22, 14], // bed support
];

// Screw thread visual (helix marks on the central screw column)
const SCREW_CX = PRESS_CX + 6;
const SCREW_X1 = SCREW_CX - 10;
const SCREW_X2 = SCREW_CX + 10;
const SCREW_THREADS: [number][] = Array.from({ length: 18 }, (_, i) => [
  PRESS_TOP_Y + 28 + i * 14,
]);

// Pressing block (top of press, moves down)
const PBLK_Y  = PRESS_PLAT_Y - 28;
const PBLK_X  = PRESS_CX - 54;
const PBLK_W  = 108;
const PBLK_H  = 28;

// Pomace tray (pressed apple pulp)
const TRAY_X = PRESS_CX - 68, TRAY_W = 136;
const TRAY_Y_TOP = PRESS_BED_Y - 8;

// Cider drip path
const DRIP_X = PRESS_CX + 28;
const DRIP_Y1 = PRESS_BED_Y + 4;
// Collection barrel
const BAR_CX = PRESS_CX + 86, BAR_Y = FLOOR_Y - 104;
const BAR_W  = 64,  BAR_H = 96;

// Barrel staves
const STAVE_XS = Array.from({ length: 7 }, (_, i) =>
  Math.round(BAR_CX - BAR_W / 2 + 4 + i * (BAR_W - 8) / 6)
);

// Press handle / lever arm
const HDL_CX = PRESS_CX + 6;
const HDL_Y  = PRESS_TOP_Y + 14;
const HDL_R  = 62;

// Cider drip line coords
const DRIP_LINE = `M ${DRIP_X},${DRIP_Y1} C ${DRIP_X + 8},${DRIP_Y1 + 28} ${BAR_CX - 8},${BAR_Y - 12} ${BAR_CX},${BAR_Y}`;

// Wooden grain lines on press uprights
type Grain = [number, number, number, number];
const UPRIGHT_GRAIN: Grain[] = Array.from({ length: 8 }, (_, i) => [
  UPR_LX + 3, PRESS_TOP_Y + 24 + i * 40,
  UPR_LX + UPR_W - 3, PRESS_TOP_Y + 30 + i * 40,
] as Grain).concat(Array.from({ length: 8 }, (_, i) => [
  UPR_RX + 3, PRESS_TOP_Y + 24 + i * 40,
  UPR_RX + UPR_W - 3, PRESS_TOP_Y + 30 + i * 40,
] as Grain));

// ===================== BARN =====================
const BARN_X = 940, BARN_W = 340;
const BARN_WALL_Y = 262;
const BARN_FLOOR_Y = FLOOR_Y;
const BARN_RIDGE_X = BARN_X + BARN_W / 2;
const BARN_RIDGE_Y = 164;
const BARN_ROOF_POLY = `${BARN_X},${BARN_WALL_Y} ${BARN_RIDGE_X},${BARN_RIDGE_Y} ${BARN_X + BARN_W},${BARN_WALL_Y}`;

// Barn siding boards (vertical)
const BARN_BOARDS = Array.from({ length: 20 }, (_, i) =>
  Math.round(BARN_X + i * BARN_W / 19)
);

// Barn windows
type BWindow = [number, number, number, number];
const BARN_WINDOWS: BWindow[] = [
  [BARN_X + 32,  BARN_WALL_Y + 28, 48, 56],
  [BARN_X + 254, BARN_WALL_Y + 28, 48, 56],
];

// Barn door (large double doors)
const BD_X = BARN_RIDGE_X - 36, BD_W = 72, BD_Y = BARN_WALL_Y + 24, BD_H = 148;

// Roof shingles (horizontal rows)
const SHINGLE_ROWS = Array.from({ length: 8 }, (_, i) => ({
  y: BARN_RIDGE_Y + 6 + i * 13,
  x1: BARN_X + (i * 8),
  x2: BARN_X + BARN_W - (i * 8),
}));

// ===================== FENCE =====================
const FENCE_POSTS: [number][] = Array.from({ length: 12 }, (_, i) => [
  Math.round(44 + i * 72),
]);

// Ground tufts
const TUFTS: [number, number][] = [
  [88,FLOOR_Y-2],[152,FLOOR_Y-3],[224,FLOOR_Y-2],[298,FLOOR_Y-4],
  [446,FLOOR_Y-2],[538,FLOOR_Y-3],[612,FLOOR_Y-2],[784,FLOOR_Y-3],
  [1148,FLOOR_Y-2],[1224,FLOOR_Y-3],[1308,FLOOR_Y-2],[1372,FLOOR_Y-3],
];

// Foreground leaves
type Leaf = [number, number, number, number, string];
const FG_LEAVES: Leaf[] = [
  [68, FLOOR_Y - 12, 12, 8, "#c84018"],
  [124, FLOOR_Y - 8, 10, 7, "#d85820"],
  [196, FLOOR_Y - 10, 11, 7, "#e06830"],
  [452, FLOOR_Y - 9, 10, 7, "#c04010"],
  [498, FLOOR_Y - 11, 12, 8, "#d84818"],
  [1168, FLOOR_Y - 10, 11, 8, "#c83010"],
  [1236, FLOOR_Y - 8, 10, 7, "#e06028"],
  [1314, FLOOR_Y - 11, 12, 8, "#d85020"],
  [1368, FLOOR_Y - 9, 10, 6, "#c84820"],
];

// Sky gradient stops
// (handled via SVG linearGradient)

export function CiderPressScene() {
  const ref = useRef<SVGSVGElement>(null);
  const [active, setActive] = useState(false);
  const [drip, setDrip] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setActive(true); obs.disconnect(); } },
      { threshold: 0.12 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // Animate drip droplets
  useEffect(() => {
    if (!active) return;
    const id = setInterval(() => setDrip(d => (d + 1) % 60), 80);
    return () => clearInterval(id);
  }, [active]);

  const tr = (d: number) =>
    active ? `opacity 0.7s ease ${d}s, transform 0.7s ease ${d}s` : "none";

  const dripY = DRIP_Y1 + ((drip / 60) * (BAR_Y - DRIP_Y1 - 8));
  const dripAlpha = drip < 48 ? 0.9 : 1 - ((drip - 48) / 12);

  return (
    <section
      aria-label="New England autumn cider press scene"
      style={{ background: "#1e1206", overflow: "hidden", position: "relative" }}
    >
      <style>{`
        @keyframes cps-handle {
          0%,100% { transform: rotate(-12deg); }
          50%      { transform: rotate(12deg); }
        }
        @keyframes cps-plat {
          0%,100% { transform: translateY(0px); }
          50%      { transform: translateY(6px); }
        }
        @keyframes cps-leaf-fall {
          0%   { transform: translate(0,0) rotate(0deg);   opacity: 1; }
          100% { transform: translate(18px,60px) rotate(180deg); opacity: 0; }
        }
        .cps-handle { animation: ${active ? "cps-handle 3.6s ease-in-out infinite" : "none"};
          transform-origin: ${HDL_CX}px ${HDL_Y}px; }
        .cps-plat   { animation: ${active ? "cps-plat 3.6s ease-in-out infinite" : "none"}; }
        .cps-leaf1  { animation: ${active ? "cps-leaf-fall 4.2s ease-in 0.8s infinite" : "none"}; }
        .cps-leaf2  { animation: ${active ? "cps-leaf-fall 5.1s ease-in 2.1s infinite" : "none"}; }
        .cps-leaf3  { animation: ${active ? "cps-leaf-fall 3.8s ease-in 3.5s infinite" : "none"}; }
      `}</style>

      <svg
        ref={ref}
        viewBox={`0 0 ${W} ${H}`}
        width="100%"
        preserveAspectRatio="xMidYMid meet"
        aria-hidden="true"
        style={{ display: "block", maxHeight: 560 }}
      >
        <defs>
          <linearGradient id="cps-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#f0a030" />
            <stop offset="40%"  stopColor="#e8783a" />
            <stop offset="100%" stopColor="#c04820" />
          </linearGradient>
          <linearGradient id="cps-ground" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#4a3018" />
            <stop offset="100%" stopColor="#2a1808" />
          </linearGradient>
          <linearGradient id="cps-wood" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%"   stopColor="#7a5028" />
            <stop offset="50%"  stopColor="#8a6030" />
            <stop offset="100%" stopColor="#6a4020" />
          </linearGradient>
          <linearGradient id="cps-wood-v" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#8a6030" />
            <stop offset="100%" stopColor="#5a3818" />
          </linearGradient>
          <linearGradient id="cps-barn" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#7a1808" />
            <stop offset="100%" stopColor="#5a1006" />
          </linearGradient>
          <linearGradient id="cps-barrel" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%"   stopColor="#5a3010" />
            <stop offset="50%"  stopColor="#7a4a20" />
            <stop offset="100%" stopColor="#4a2808" />
          </linearGradient>
          <linearGradient id="cps-cider" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#d48820" />
            <stop offset="100%" stopColor="#b86010" />
          </linearGradient>
          <filter id="cps-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          <filter id="cps-soft" x="-5%" y="-5%" width="110%" height="110%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="1.2" />
          </filter>
          <radialGradient id="cps-sun" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="#fff5c0" stopOpacity="0.9" />
            <stop offset="60%"  stopColor="#f0a030" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#e87030" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="cps-basket" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#c8902a" />
            <stop offset="100%" stopColor="#8a5a18" />
          </linearGradient>
        </defs>

        {/* Sky */}
        <rect x={0} y={0} width={W} height={HORIZON_Y + 40} fill="url(#cps-sky)" />

        {/* Sun */}
        <circle cx={820} cy={92} r={52} fill="url(#cps-sun)" opacity={0.85} />
        <circle cx={820} cy={92} r={28} fill="#fff8c0" opacity={0.7} />

        {/* Hazy sky glow */}
        <ellipse cx={820} cy={HORIZON_Y - 10} rx={360} ry={80}
          fill="#f0a830" opacity={0.22} filter="url(#cps-soft)" />

        {/* Ground */}
        <rect x={0} y={HORIZON_Y + 30} width={W} height={H - HORIZON_Y - 30} fill="url(#cps-ground)" />

        {/* Ground color band */}
        <rect x={0} y={FLOOR_Y - 8} width={W} height={H - FLOOR_Y + 8}
          fill="#3a2210" />

        {/* Orchard background */}
        {ORCHARD.map(([cx, cy, r, trunk, canopy], i) => (
          <g key={i} style={{ opacity: active ? 1 : 0, transition: tr(0.05 + i * 0.02) }}>
            <line x1={cx} y1={cy + r - 4} x2={cx} y2={FLOOR_Y}
              stroke={trunk} strokeWidth={Math.max(3, r / 10)} />
            <ellipse cx={cx} cy={cy} rx={r} ry={r * 0.88}
              fill={canopy} opacity={0.88} />
            {/* highlight */}
            <ellipse cx={cx - r * 0.22} cy={cy - r * 0.18} rx={r * 0.42} ry={r * 0.35}
              fill="#f0a030" opacity={0.18} />
          </g>
        ))}

        {/* Horizon mist band */}
        <rect x={0} y={HORIZON_Y + 10} width={W} height={28}
          fill="#d06820" opacity={0.18} filter="url(#cps-soft)" />

        {/* ============ BARN ============ */}
        <g style={{ opacity: active ? 1 : 0, transition: tr(0.1) }}>
          {/* Barn wall */}
          <rect x={BARN_X} y={BARN_WALL_Y} width={BARN_W} height={BARN_FLOOR_Y - BARN_WALL_Y}
            fill="url(#cps-barn)" />
          {/* Siding boards */}
          {BARN_BOARDS.map((bx, i) => (
            <line key={i} x1={bx} y1={BARN_WALL_Y} x2={bx} y2={BARN_FLOOR_Y}
              stroke="#3a0a04" strokeWidth={1.2} opacity={0.5} />
          ))}
          {/* Barn roof */}
          <polygon points={BARN_ROOF_POLY} fill="#5a1206" />
          {/* Shingles */}
          {SHINGLE_ROWS.map((row, i) => (
            <line key={i} x1={row.x1} y1={row.y} x2={row.x2} y2={row.y}
              stroke="#3a0c04" strokeWidth={2.5} opacity={0.6} />
          ))}
          {/* Roof ridge */}
          <line x1={BARN_X} y1={BARN_WALL_Y} x2={BARN_RIDGE_X} y2={BARN_RIDGE_Y}
            stroke="#3a0a04" strokeWidth={3} />
          <line x1={BARN_X + BARN_W} y1={BARN_WALL_Y} x2={BARN_RIDGE_X} y2={BARN_RIDGE_Y}
            stroke="#3a0a04" strokeWidth={3} />
          {/* Barn windows */}
          {BARN_WINDOWS.map(([wx, wy, ww, wh], i) => (
            <g key={i}>
              <rect x={wx} y={wy} width={ww} height={wh} fill="#c87a20" opacity={0.7} rx={2} />
              <rect x={wx} y={wy} width={ww} height={wh} fill="none"
                stroke="#2a0a04" strokeWidth={3} rx={2} />
              <line x1={wx + ww / 2} y1={wy} x2={wx + ww / 2} y2={wy + wh}
                stroke="#2a0a04" strokeWidth={2} />
              <line x1={wx} y1={wy + wh / 2} x2={wx + ww} y2={wy + wh / 2}
                stroke="#2a0a04" strokeWidth={2} />
            </g>
          ))}
          {/* Barn doors */}
          <rect x={BD_X} y={BD_Y} width={BD_W} height={BD_H}
            fill="#3a1408" stroke="#1a0804" strokeWidth={2} />
          <line x1={BD_X + BD_W / 2} y1={BD_Y} x2={BD_X + BD_W / 2} y2={BD_Y + BD_H}
            stroke="#1a0804" strokeWidth={2} />
          {/* Door handle hardware */}
          <circle cx={BD_X + BD_W / 2 - 6} cy={BD_Y + BD_H / 2} r={4} fill="#c89840" />
          <circle cx={BD_X + BD_W / 2 + 6} cy={BD_Y + BD_H / 2} r={4} fill="#c89840" />
        </g>

        {/* ============ FENCE (left) ============ */}
        {FENCE_POSTS.map(([fx], i) => (
          <g key={i} style={{ opacity: active ? 1 : 0, transition: tr(0.08 + i * 0.03) }}>
            <rect x={fx - 3} y={FLOOR_Y - 72} width={6} height={80}
              fill="#8a6030" />
            {/* top point */}
            <polygon points={`${fx},${FLOOR_Y - 82} ${fx - 4},${FLOOR_Y - 72} ${fx + 4},${FLOOR_Y - 72}`}
              fill="#9a7038" />
          </g>
        ))}
        {/* Fence rails */}
        {[FLOOR_Y - 52, FLOOR_Y - 30].map((ry, i) => (
          <line key={i} x1={40} y1={ry} x2={828} y2={ry}
            stroke="#7a5828" strokeWidth={4}
            style={{ opacity: active ? 1 : 0, transition: tr(0.2) }}
          />
        ))}

        {/* ============ CIDER PRESS ============ */}
        <g style={{ opacity: active ? 1 : 0, transition: tr(0.18) }}>

          {/* Press base platform */}
          <rect x={PRESS_BASE_X - 12} y={PRESS_BASE_Y - 14} width={PRESS_BASE_W + 24} height={14}
            fill="url(#cps-wood)" />
          <rect x={PRESS_BASE_X - 18} y={PRESS_BASE_Y} width={PRESS_BASE_W + 36} height={8}
            fill="#5a3818" />

          {/* Uprights */}
          {[UPR_LX, UPR_RX].map((ux, i) => (
            <rect key={i}
              x={ux} y={PRESS_TOP_Y + 18}
              width={UPR_W} height={PRESS_BASE_Y - PRESS_TOP_Y - 18}
              fill="url(#cps-wood-v)"
            />
          ))}

          {/* Grain lines on uprights */}
          {UPRIGHT_GRAIN.map(([x1, y1, x2, y2], i) => (
            <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
              stroke="#4a2808" strokeWidth={0.8} opacity={0.5} />
          ))}

          {/* Cross beams */}
          {BEAMS.map(([bx, by, bw, bh], i) => (
            <rect key={i} x={bx} y={by} width={bw} height={bh}
              fill="url(#cps-wood)" rx={2}
            />
          ))}

          {/* Screw column */}
          <rect x={SCREW_X1} y={PRESS_TOP_Y + 22} width={SCREW_X2 - SCREW_X1} height={PRESS_PLAT_Y - PRESS_TOP_Y - 22}
            fill="#6a4820" />
          {/* Thread marks */}
          {SCREW_THREADS.map(([ty], i) => (
            <line key={i}
              x1={SCREW_X1 + 1} y1={ty}
              x2={SCREW_X2 - 1} y2={ty + 5}
              stroke="#4a2e10" strokeWidth={1.5} opacity={0.7}
            />
          ))}

          {/* Pressing block (animated) */}
          <g className="cps-plat">
            <rect x={PBLK_X} y={PBLK_Y} width={PBLK_W} height={PBLK_H}
              fill="url(#cps-wood)" rx={2} />
            {/* Block grain */}
            {[8, 20, 32, 44, 56, 68, 80, 92].map((ox, i) => (
              <line key={i}
                x1={PBLK_X + ox} y1={PBLK_Y + 3}
                x2={PBLK_X + ox + 4} y2={PBLK_Y + PBLK_H - 3}
                stroke="#4a2808" strokeWidth={1} opacity={0.4}
              />
            ))}
          </g>

          {/* Pomace tray */}
          <rect x={TRAY_X} y={TRAY_Y_TOP} width={TRAY_W} height={16}
            fill="#5a3010" rx={2} />
          {/* Pomace fill (pressed apple pulp) */}
          <rect x={TRAY_X + 4} y={TRAY_Y_TOP + 3} width={TRAY_W - 8} height={8}
            fill="#a86028" rx={1} />

          {/* Handle lever arm (animated rotate) */}
          <g className="cps-handle">
            <line
              x1={HDL_CX - HDL_R} y1={HDL_Y + 6}
              x2={HDL_CX + HDL_R} y2={HDL_Y + 6}
              stroke="#8a5a28" strokeWidth={8} strokeLinecap="round"
            />
            {/* Handle knobs */}
            <circle cx={HDL_CX - HDL_R} cy={HDL_Y + 6} r={6} fill="#7a4e20" />
            <circle cx={HDL_CX + HDL_R} cy={HDL_Y + 6} r={6} fill="#7a4e20" />
          </g>

          {/* Top cap */}
          <rect x={PRESS_CX - 64} y={PRESS_TOP_Y} width={128} height={20}
            fill="url(#cps-wood)" rx={3} />
        </g>

        {/* ============ CIDER BARREL ============ */}
        <g style={{ opacity: active ? 1 : 0, transition: tr(0.3) }}>
          <rect x={BAR_CX - BAR_W / 2} y={BAR_Y} width={BAR_W} height={BAR_H}
            fill="url(#cps-barrel)" rx={4} />
          {/* Stave lines */}
          {STAVE_XS.map((sx, i) => (
            <line key={i} x1={sx} y1={BAR_Y + 4} x2={sx} y2={BAR_Y + BAR_H - 4}
              stroke="#3a2008" strokeWidth={1.2} opacity={0.5} />
          ))}
          {/* Barrel hoops */}
          {[BAR_Y + 12, BAR_Y + BAR_H / 2 - 4, BAR_Y + BAR_H - 14].map((hy, i) => (
            <line key={i}
              x1={BAR_CX - BAR_W / 2 + 2} y1={hy}
              x2={BAR_CX + BAR_W / 2 - 2} y2={hy}
              stroke="#8a7020" strokeWidth={3.5} opacity={0.85}
            />
          ))}
          {/* Cider level inside barrel (amber liquid) */}
          <rect x={BAR_CX - BAR_W / 2 + 3} y={BAR_Y + BAR_H - 28}
            width={BAR_W - 6} height={22}
            fill="url(#cps-cider)" opacity={0.8} rx={2}
          />
          {/* Cider surface highlight */}
          <ellipse cx={BAR_CX} cy={BAR_Y + BAR_H - 28}
            rx={BAR_W / 2 - 4} ry={5}
            fill="#f0c040" opacity={0.35}
          />
          {/* Barrel bung hole */}
          <circle cx={BAR_CX + 6} cy={BAR_Y + BAR_H / 2} r={4} fill="#2a1808" />
        </g>

        {/* ============ CIDER DRIP ============ */}
        <g style={{ opacity: active ? 1 : 0, transition: tr(0.35) }}>
          <path d={DRIP_LINE}
            fill="none" stroke="#d08820" strokeWidth={2.5} opacity={0.7}
            strokeDasharray="4 6"
          />
          {/* Animated drip droplet */}
          <ellipse
            cx={DRIP_X + 4}
            cy={dripY}
            rx={3.5} ry={5}
            fill="#d08820"
            opacity={dripAlpha * (active ? 1 : 0)}
            filter="url(#cps-glow)"
          />
        </g>

        {/* ============ APPLE BASKETS ============ */}
        {BASKETS.map(([bx, by, bw, bh], bi) => (
          <g key={bi} style={{ opacity: active ? 1 : 0, transition: tr(0.22 + bi * 0.06) }}>
            {/* Basket body */}
            <rect x={bx} y={by} width={bw} height={bh}
              fill="url(#cps-basket)" rx={3} />
            {/* Weave lines horizontal */}
            {Array.from({ length: 6 }, (_, i) => (
              <line key={i}
                x1={bx + 2} y1={by + 8 + i * (bh - 10) / 5}
                x2={bx + bw - 2} y2={by + 8 + i * (bh - 10) / 5}
                stroke="#7a4818" strokeWidth={1.2} opacity={0.5}
              />
            ))}
            {/* Weave lines vertical */}
            {Array.from({ length: 8 }, (_, i) => (
              <line key={i}
                x1={bx + 5 + i * (bw - 10) / 7} y1={by + 4}
                x2={bx + 5 + i * (bw - 10) / 7} y2={by + bh - 2}
                stroke="#7a4818" strokeWidth={1} opacity={0.35}
              />
            ))}
            {/* Basket rim */}
            <rect x={bx - 2} y={by - 5} width={bw + 4} height={7}
              fill="#c89030" rx={2} />
            {/* Apples in basket */}
            {(BASKET_APPLES[bi] ?? []).map(([ax, ay, ar, ac], ai) => (
              <circle key={ai} cx={ax} cy={ay} r={ar} fill={ac} />
            ))}
          </g>
        ))}

        {/* ============ FALLEN APPLES ============ */}
        {APPLES.map(([ax, ay, ar, ac], i) => (
          <g key={i} style={{ opacity: active ? 1 : 0, transition: tr(0.28 + i * 0.02) }}>
            <circle cx={ax} cy={ay} r={ar} fill={ac} />
            <circle cx={ax - ar * 0.28} cy={ay - ar * 0.24} r={ar * 0.32}
              fill="#f05830" opacity={0.35} />
            {/* stem */}
            <line x1={ax} y1={ay - ar} x2={ax + 2} y2={ay - ar - 5}
              stroke="#5a3010" strokeWidth={1.2} />
          </g>
        ))}

        {/* Ground tufts */}
        {TUFTS.map(([tx, ty], i) => (
          <ellipse key={i} cx={tx} cy={ty} rx={8} ry={3}
            fill="#5a4010" opacity={0.6}
            style={{ opacity: active ? 0.6 : 0, transition: tr(0.1) }}
          />
        ))}

        {/* Foreground fallen leaves */}
        {FG_LEAVES.map(([lx, ly, lrx, lry, lc], i) => (
          <ellipse key={i} cx={lx} cy={ly} rx={lrx} ry={lry}
            fill={lc} opacity={0.85}
            transform={`rotate(${(i * 37) % 180 - 90}, ${lx}, ${ly})`}
            style={{ opacity: active ? 0.85 : 0, transition: tr(0.12 + i * 0.03) }}
          />
        ))}

        {/* Falling leaves (CSS animated) */}
        <ellipse cx={686} cy={120} rx={10} ry={7} fill="#e05020" opacity={0.9}
          className="cps-leaf1"
          style={{ opacity: active ? 0.9 : 0, transition: tr(0.5) }}
        />
        <ellipse cx={752} cy={96} rx={8} ry={6} fill="#d84818" opacity={0.85}
          className="cps-leaf2"
          style={{ opacity: active ? 0.85 : 0, transition: tr(0.5) }}
        />
        <ellipse cx={820} cy={140} rx={9} ry={6} fill="#c84010" opacity={0.9}
          className="cps-leaf3"
          style={{ opacity: active ? 0.9 : 0, transition: tr(0.5) }}
        />

        {/* Caption */}
        <text
          x={W / 2} y={H - 14}
          textAnchor="middle"
          fontFamily="'Georgia', 'Times New Roman', serif"
          fontSize={11} fill="#c89040"
          letterSpacing={5}
          style={{ opacity: active ? 0.65 : 0, transition: tr(1.0) }}
        >
          HARVEST SEASON · SHREWSBURY, MA · ROUTE 9 CORRIDOR
        </text>
      </svg>
    </section>
  );
}
