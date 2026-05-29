"use client";
import { useEffect, useRef, useState } from "react";

// Pass 58: New England maple sugaring — sugarhouse, evaporator pans, animated steam, sap buckets, snow

const W = 1440, H = 560;
const FLOOR_Y = 468; // ground / snow surface
const HORIZON_Y = 228;

// ─── Sky: late-winter pale blue-grey ─────────────────────────────────────

// ─── Background maple trees ───────────────────────────────────────────────
// Late winter / early spring — bare branches, maybe a blush of buds
type MapleTree = {
  cx: number; cy: number;
  trunkH: number; trunkW: number;
  branches: [number, number, number, number][]; // x1,y1,x2,y2
  color: string;
};

// Helper to build branch lines radiating from trunk top
function makeTree(cx: number, baseY: number, h: number, w: number, col: string): MapleTree {
  const ty = baseY - h;
  const brs: [number, number, number, number][] = [
    [cx, ty,          cx - w * 1.1, ty - h * 0.42],
    [cx, ty,          cx + w * 1.3, ty - h * 0.38],
    [cx, ty,          cx - w * 0.5, ty - h * 0.58],
    [cx, ty,          cx + w * 0.4, ty - h * 0.52],
    [cx, ty,          cx,           ty - h * 0.62],
    [cx - w * 0.6, ty - h * 0.28,  cx - w * 1.6, ty - h * 0.54],
    [cx + w * 0.5, ty - h * 0.24,  cx + w * 1.8, ty - h * 0.48],
    [cx - w * 0.3, ty - h * 0.40,  cx - w * 0.9, ty - h * 0.72],
    [cx + w * 0.2, ty - h * 0.36,  cx + w * 0.8, ty - h * 0.68],
  ];
  return { cx, cy: ty, trunkH: h, trunkW: w, branches: brs, color: col };
}

const BG_TREES: MapleTree[] = [
  makeTree(62,  FLOOR_Y, 148, 6, "#5a3c20"),
  makeTree(148, FLOOR_Y, 164, 7, "#4a3018"),
  makeTree(244, FLOOR_Y, 156, 6, "#5a3c20"),
  makeTree(342, FLOOR_Y, 172, 8, "#4a3018"),
  makeTree(1060, FLOOR_Y, 152, 6, "#5a3c20"),
  makeTree(1152, FLOOR_Y, 168, 7, "#4a3018"),
  makeTree(1248, FLOOR_Y, 160, 6, "#5a3c20"),
  makeTree(1344, FLOOR_Y, 176, 8, "#4a3018"),
  makeTree(1406, FLOOR_Y, 148, 5, "#5a3c20"),
];

// Sap collection buckets hung on trees
type SapBucket = [number, number]; // cx, y of top
const SAP_BUCKETS: SapBucket[] = [
  [62,  FLOOR_Y - 62],
  [148, FLOOR_Y - 66],
  [244, FLOOR_Y - 60],
  [342, FLOOR_Y - 68],
  [1060,FLOOR_Y - 62],
  [1152,FLOOR_Y - 66],
  [1248,FLOOR_Y - 60],
  [1344,FLOOR_Y - 68],
];

// Sap tap spout
const SPOUTS: [number, number][] = SAP_BUCKETS.map(([bx, by]) => [bx, by - 16]);

// Sap line (tubing) connecting trees to a central collection point
const SAP_LINE_D_LEFT =
  `M 62,${FLOOR_Y - 56} C 142,${FLOOR_Y - 52} 224,${FLOOR_Y - 56} 342,${FLOOR_Y - 56}` +
  ` L 420,${FLOOR_Y - 42}`;
const SAP_LINE_D_RIGHT =
  `M 1060,${FLOOR_Y - 56} C 1140,${FLOOR_Y - 52} 1220,${FLOOR_Y - 56} 1344,${FLOOR_Y - 56}` +
  ` L 1018,${FLOOR_Y - 42}`;

// ─── Sugarhouse ────────────────────────────────────────────────────────────
const SH_X = 428, SH_W = 584, SH_H = 264;
const SH_WALL_Y = FLOOR_Y - SH_H; // 204
const SH_RIDGE_X = SH_X + SH_W / 2; // 720
const SH_RIDGE_Y = SH_WALL_Y - 92;  // 112
// Roof polygon
const ROOF_POLY = `${SH_X - 8},${SH_WALL_Y} ${SH_RIDGE_X},${SH_RIDGE_Y} ${SH_X + SH_W + 8},${SH_WALL_Y}`;

// Sugarhouse siding boards (vertical)
const SH_BOARDS = Array.from({ length: 22 }, (_, i) =>
  Math.round(SH_X + i * SH_W / 21)
);

// Sugarhouse windows (two on front)
type SHWin = [number, number, number, number];
const SH_WINDOWS: SHWin[] = [
  [SH_X + 48,  SH_WALL_Y + 44, 72, 88],
  [SH_X + SH_W - 120, SH_WALL_Y + 44, 72, 88],
];

// Sugarhouse door
const SH_DOOR_X = SH_RIDGE_X - 32, SH_DOOR_W = 64;
const SH_DOOR_Y = SH_WALL_Y + 64, SH_DOOR_H = 136;

// Steam vent cupola on roof ridge
const CUPOLA_X = SH_RIDGE_X - 28, CUPOLA_W = 56;
const CUPOLA_Y = SH_RIDGE_Y - 42, CUPOLA_H = 42;
const CUPOLA_LOUVERS = Array.from({ length: 5 }, (_, i) => ({
  y: CUPOLA_Y + 6 + i * 7,
}));

// ─── Evaporator inside (seen through windows) ─────────────────────────────
// Glowing amber light through windows
const WIN_GLOW_COLOR = "#f0a830";

// ─── Steam puffs from cupola ─────────────────────────────────────────────
type SteamPuff = { cx: number; cy: number; r: number; delay: string };
const STEAM_PUFFS: SteamPuff[] = [
  { cx: SH_RIDGE_X - 6,  cy: CUPOLA_Y - 14, r: 16, delay: "0s"    },
  { cx: SH_RIDGE_X + 8,  cy: CUPOLA_Y - 34, r: 22, delay: "0.5s"  },
  { cx: SH_RIDGE_X - 10, cy: CUPOLA_Y - 58, r: 28, delay: "1.0s"  },
  { cx: SH_RIDGE_X + 14, cy: CUPOLA_Y - 86, r: 34, delay: "1.5s"  },
  { cx: SH_RIDGE_X - 4,  cy: CUPOLA_Y - 118,r: 40, delay: "2.0s"  },
  { cx: SH_RIDGE_X + 20, cy: CUPOLA_Y - 152,r: 46, delay: "2.5s"  },
  // Side vent (chimney pipe)
  { cx: SH_X + 88,       cy: SH_WALL_Y - 32, r: 12, delay: "0.3s" },
  { cx: SH_X + 82,       cy: SH_WALL_Y - 52, r: 18, delay: "1.1s" },
  { cx: SH_X + 94,       cy: SH_WALL_Y - 74, r: 24, delay: "1.8s" },
];

// Chimney pipe on left wall
const CHIM_X = SH_X + 80, CHIM_Y1 = SH_WALL_Y - 24, CHIM_Y2 = SH_WALL_Y + 28, CHIM_W = 16;

// ─── Evaporator pans (seen through window, simplified) ────────────────────
// Warm amber glow behind windows + silhouette of pans
const EV_X = SH_X + 164, EV_W = SH_W - 328;
const EV_Y = FLOOR_Y - 68;

// ─── Snow on ground ───────────────────────────────────────────────────────
// Snow surface with gentle undulation
const SNOW_D =
  `M 0,${FLOOR_Y} ` +
  `C 80,${FLOOR_Y - 12} 160,${FLOOR_Y - 4} 240,${FLOOR_Y - 10} ` +
  `C 320,${FLOOR_Y - 16} 400,${FLOOR_Y - 6} 480,${FLOOR_Y - 12} ` +
  `C 560,${FLOOR_Y - 18} 640,${FLOOR_Y - 8} 720,${FLOOR_Y - 14} ` +
  `C 800,${FLOOR_Y - 20} 880,${FLOOR_Y - 10} 960,${FLOOR_Y - 16} ` +
  `C 1040,${FLOOR_Y - 22} 1120,${FLOOR_Y - 12} 1200,${FLOOR_Y - 18} ` +
  `C 1280,${FLOOR_Y - 8} 1360,${FLOOR_Y - 14} 1440,${FLOOR_Y - 10} ` +
  `L 1440,${H} L 0,${H} Z`;

// Snow drifts against sugarhouse base
const DRIFT_D =
  `M ${SH_X - 4},${FLOOR_Y} ` +
  `C ${SH_X + 32},${FLOOR_Y - 22} ${SH_X + 88},${FLOOR_Y - 18} ${SH_X + 148},${FLOOR_Y - 8} ` +
  `L ${SH_X + 148},${FLOOR_Y} Z`;
const DRIFT_D2 =
  `M ${SH_X + SH_W - 128},${FLOOR_Y} ` +
  `C ${SH_X + SH_W - 88},${FLOOR_Y - 16} ${SH_X + SH_W - 32},${FLOOR_Y - 20} ${SH_X + SH_W + 4},${FLOOR_Y} Z`;

// Snow on roof shingles
const ROOF_SNOW_D =
  `M ${SH_X + 4},${SH_WALL_Y + 2} L ${SH_RIDGE_X},${SH_RIDGE_Y + 4} L ${SH_X + SH_W - 4},${SH_WALL_Y + 2} ` +
  `L ${SH_X + SH_W - 4},${SH_WALL_Y - 6} C ${SH_X + SH_W - 60},${SH_WALL_Y - 16} ${SH_RIDGE_X + 40},${SH_RIDGE_Y - 4} ${SH_RIDGE_X},${SH_RIDGE_Y + 2} ` +
  `C ${SH_RIDGE_X - 40},${SH_RIDGE_Y - 4} ${SH_X + 60},${SH_WALL_Y - 16} ${SH_X + 4},${SH_WALL_Y - 6} Z`;

// Snow on tree branches
type BranchSnow = [number, number, number]; // cx, cy, length
const BRANCH_SNOWS: BranchSnow[] = [
  [62 - 8,  FLOOR_Y - 148 - 34, 28],
  [62 + 12, FLOOR_Y - 148 - 30, 22],
  [148 - 10,FLOOR_Y - 164 - 38, 26],
  [148 + 16,FLOOR_Y - 164 - 32, 24],
  [1152 - 8,FLOOR_Y - 168 - 36, 26],
  [1248 + 10,FLOOR_Y - 160 - 32, 24],
  [1344 - 12,FLOOR_Y - 176 - 40, 28],
];

// ─── Syrup drip from tap ──────────────────────────────────────────────────
// Animated golden drip from each tap spout into bucket
type Drip = [number, number, number]; // x, spoutY, bucketY
const DRIPS: Drip[] = [
  [62,  FLOOR_Y - 74, FLOOR_Y - 62],
  [148, FLOOR_Y - 78, FLOOR_Y - 66],
  [1060,FLOOR_Y - 74, FLOOR_Y - 62],
  [1344,FLOOR_Y - 80, FLOOR_Y - 68],
];

// ─── Firewood pile ────────────────────────────────────────────────────────
const FW_X = SH_X + SH_W + 14, FW_Y = FLOOR_Y - 8;
type Log = [number, number, number]; // x, y, w
const LOGS: Log[] = [
  [FW_X,      FW_Y - 0,  72], [FW_X + 4,  FW_Y - 0,  68],
  [FW_X + 2,  FW_Y - 12, 70], [FW_X + 6,  FW_Y - 12, 66],
  [FW_X + 4,  FW_Y - 24, 68], [FW_X + 8,  FW_Y - 24, 64],
  [FW_X + 2,  FW_Y - 36, 70], [FW_X + 6,  FW_Y - 36, 66],
];

// ─── Collection tank (outdoor holding tank) ──────────────────────────────
const TANK_X = SH_X - 88, TANK_W = 64, TANK_H = 52;
const TANK_Y = FLOOR_Y - TANK_H;

// ─── Rooftop shingle rows ─────────────────────────────────────────────────
const SHINGLE_ROWS_LEFT = Array.from({ length: 7 }, (_, i) => {
  const t = (i + 1) / 8;
  return {
    x1: Math.round(SH_X + (SH_RIDGE_X - SH_X) * t - 6),
    y1: Math.round(SH_WALL_Y + (SH_RIDGE_Y - SH_WALL_Y) * t),
    x2: Math.round(SH_X + (SH_RIDGE_X - SH_X) * (t - 0.08)),
    y2: Math.round(SH_WALL_Y + (SH_RIDGE_Y - SH_WALL_Y) * (t - 0.08) + 8),
  };
});

export function SugaringShack() {
  const ref = useRef<SVGSVGElement>(null);
  const [active, setActive] = useState(false);
  const [dripT, setDripT] = useState(0);

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

  useEffect(() => {
    if (!active) return;
    const id = setInterval(() => setDripT(d => (d + 1) % 72), 60);
    return () => clearInterval(id);
  }, [active]);

  const tr = (d: number) =>
    active ? `opacity 0.7s ease ${d}s, transform 0.7s ease ${d}s` : "none";

  return (
    <section
      aria-label="New England maple sugaring shack with steam, sap buckets, and snow"
      style={{ background: "#d4dce8", overflow: "hidden" }}
    >
      <style>{`
        @keyframes sgs-steam {
          0%   { transform: translateY(0px)   scale(1);    opacity: 0.68; }
          55%  { transform: translateY(-36px) scale(1.22); opacity: 0.38; }
          100% { transform: translateY(-68px) scale(1.5);  opacity: 0;    }
        }
        @keyframes sgs-sway {
          0%,100% { transform: rotate(-1.5deg); }
          50%      { transform: rotate(1.5deg);  }
        }
        @keyframes sgs-glow {
          0%,100% { opacity: 0.52; }
          50%      { opacity: 0.72; }
        }
        .sgs-bucket { animation: ${active ? "sgs-sway 3.8s ease-in-out infinite" : "none"}; }
        .sgs-glow   { animation: ${active ? "sgs-glow 2.6s ease-in-out infinite" : "none"};  }
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
          {/* Late-winter pale sky */}
          <linearGradient id="sgs-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#b8c8d8" />
            <stop offset="55%"  stopColor="#ccd8e4" />
            <stop offset="100%" stopColor="#e0dcd4" />
          </linearGradient>
          {/* Snow */}
          <linearGradient id="sgs-snow" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#e8eef4" />
            <stop offset="100%" stopColor="#c8d4e0" />
          </linearGradient>
          {/* Sugarhouse siding: weathered red */}
          <linearGradient id="sgs-siding" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#8a2810" />
            <stop offset="100%" stopColor="#5a1a08" />
          </linearGradient>
          {/* Roof shingles */}
          <linearGradient id="sgs-roof" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#4a3820" />
            <stop offset="100%" stopColor="#2a2010" />
          </linearGradient>
          {/* Syrup golden */}
          <linearGradient id="sgs-syrup" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#d89020" />
            <stop offset="100%" stopColor="#a86010" />
          </linearGradient>
          {/* Window amber glow */}
          <radialGradient id="sgs-win-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="#f8c040" stopOpacity="0.9" />
            <stop offset="60%"  stopColor="#e08020" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#c05810" stopOpacity="0.2" />
          </radialGradient>
          {/* Steam puffs */}
          <radialGradient id="sgs-steam-g" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="#f0ece8" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#d8d4d0" stopOpacity="0"    />
          </radialGradient>
          {/* Bucket wood */}
          <linearGradient id="sgs-bucket-g" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#8a6030" />
            <stop offset="100%" stopColor="#5a3c18" />
          </linearGradient>
          {/* Log end grain */}
          <radialGradient id="sgs-log" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="#9a7040" />
            <stop offset="70%"  stopColor="#6a4820" />
            <stop offset="100%" stopColor="#3a2810" />
          </radialGradient>
          {/* Soft filter for steam */}
          <filter id="sgs-blur">
            <feGaussianBlur in="SourceGraphic" stdDeviation="4" />
          </filter>
          <filter id="sgs-blur-sm">
            <feGaussianBlur in="SourceGraphic" stdDeviation="2" />
          </filter>
          {/* Collection tank */}
          <linearGradient id="sgs-tank" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%"   stopColor="#5a5050" />
            <stop offset="50%"  stopColor="#787070" />
            <stop offset="100%" stopColor="#4a4040" />
          </linearGradient>
        </defs>

        {/* Sky */}
        <rect x={0} y={0} width={W} height={HORIZON_Y + 20} fill="url(#sgs-sky)" />

        {/* Far horizon treeline (winter silhouette) */}
        {Array.from({ length: 34 }, (_, i) => {
          const tx = 24 + i * 42;
          const th = 32 + (i * 17) % 28;
          return (
            <line key={i} x1={tx} y1={HORIZON_Y} x2={tx} y2={HORIZON_Y - th}
              stroke="#5a4830" strokeWidth={2 + (i % 3)} opacity={0.4}
              style={{ opacity: active ? 0.4 : 0, transition: tr(0.05) }}
            />
          );
        })}
        {/* Horizon mist band */}
        <rect x={0} y={HORIZON_Y - 12} width={W} height={28}
          fill="#dce4ec" opacity={0.5} filter="url(#sgs-blur)"
          style={{ opacity: active ? 0.5 : 0, transition: tr(0.08) }}
        />

        {/* Ground / mid-distance */}
        <rect x={0} y={HORIZON_Y + 8} width={W} height={FLOOR_Y - HORIZON_Y - 8}
          fill="#cdd8e2" />

        {/* ─── BACKGROUND MAPLE TREES ─── */}
        {BG_TREES.map((tree, ti) => (
          <g key={ti}
            style={{ opacity: active ? 1 : 0, transition: tr(0.06 + ti * 0.02) }}
          >
            {/* Trunk */}
            <line
              x1={tree.cx} y1={FLOOR_Y}
              x2={tree.cx} y2={tree.cy}
              stroke={tree.color} strokeWidth={tree.trunkW}
              strokeLinecap="round"
            />
            {/* Branches */}
            {tree.branches.map((br, bi) => (
              <line key={bi}
                x1={br[0]} y1={br[1]} x2={br[2]} y2={br[3]}
                stroke={tree.color}
                strokeWidth={Math.max(1, tree.trunkW * 0.45 - bi * 0.3)}
                strokeLinecap="round"
                opacity={0.85}
              />
            ))}
            {/* Winter bud hints (tiny dots on branch tips) */}
            {tree.branches.slice(0, 5).map((br, bi) => (
              <circle key={bi} cx={br[2]} cy={br[3]} r={2}
                fill="#8a5a28" opacity={0.5} />
            ))}
          </g>
        ))}

        {/* Branch snow */}
        {BRANCH_SNOWS.map(([bx, by, blen], i) => (
          <line key={i}
            x1={bx - blen / 2} y1={by}
            x2={bx + blen / 2} y2={by + 2}
            stroke="#e8eef4" strokeWidth={4}
            strokeLinecap="round"
            opacity={0.8}
            style={{ opacity: active ? 0.8 : 0, transition: tr(0.1) }}
          />
        ))}

        {/* Sap lines (blue plastic tubing) */}
        <path d={SAP_LINE_D_LEFT} fill="none"
          stroke="#3860a8" strokeWidth={2.5} opacity={0.6}
          style={{ opacity: active ? 0.6 : 0, transition: tr(0.22) }}
        />
        <path d={SAP_LINE_D_RIGHT} fill="none"
          stroke="#3860a8" strokeWidth={2.5} opacity={0.6}
          style={{ opacity: active ? 0.6 : 0, transition: tr(0.22) }}
        />

        {/* ─── SUGARHOUSE ─── */}
        <g style={{ opacity: active ? 1 : 0, transition: tr(0.12) }}>

          {/* Wall */}
          <rect x={SH_X} y={SH_WALL_Y} width={SH_W} height={SH_H}
            fill="url(#sgs-siding)" />
          {/* Siding boards */}
          {SH_BOARDS.map((bx, i) => (
            <line key={i} x1={bx} y1={SH_WALL_Y} x2={bx} y2={FLOOR_Y}
              stroke="#3a0e04" strokeWidth={1.2} opacity={0.5} />
          ))}

          {/* Windows — amber glow behind */}
          {SH_WINDOWS.map(([wx, wy, ww, wh], i) => (
            <g key={i}>
              <rect x={wx} y={wy} width={ww} height={wh}
                fill="url(#sgs-win-glow)" className="sgs-glow" rx={2} />
              <rect x={wx} y={wy} width={ww} height={wh}
                fill="none" stroke="#2a0e04" strokeWidth={4} rx={2} />
              <line x1={wx + ww / 2} y1={wy} x2={wx + ww / 2} y2={wy + wh}
                stroke="#2a0e04" strokeWidth={2.5} />
              <line x1={wx} y1={wy + wh / 2} x2={wx + ww} y2={wy + wh / 2}
                stroke="#2a0e04" strokeWidth={2.5} />
            </g>
          ))}
          {/* Window glow halos */}
          {SH_WINDOWS.map(([wx, wy, ww, wh], i) => (
            <ellipse key={i}
              cx={wx + ww / 2} cy={wy + wh / 2}
              rx={ww * 0.9} ry={wh * 0.9}
              fill="#f0a030" opacity={0.08}
              filter="url(#sgs-blur)"
              className="sgs-glow"
            />
          ))}

          {/* Door */}
          <rect x={SH_DOOR_X} y={SH_DOOR_Y} width={SH_DOOR_W} height={SH_DOOR_H}
            fill="#2a1408" rx={2} />
          <rect x={SH_DOOR_X + 4} y={SH_DOOR_Y + 4} width={SH_DOOR_W - 8} height={SH_DOOR_H - 4}
            fill="#1a0c04" />
          {/* Door panels */}
          <rect x={SH_DOOR_X + 8} y={SH_DOOR_Y + 12} width={SH_DOOR_W - 16} height={42}
            fill="#241008" rx={1} />
          <rect x={SH_DOOR_X + 8} y={SH_DOOR_Y + 62} width={SH_DOOR_W - 16} height={42}
            fill="#241008" rx={1} />

          {/* Roof */}
          <polygon points={ROOF_POLY} fill="url(#sgs-roof)" />
          {/* Shingle rows (left slope) */}
          {SHINGLE_ROWS_LEFT.map((row, i) => (
            <line key={i} x1={row.x1} y1={row.y1} x2={row.x2} y2={row.y2}
              stroke="#1a1208" strokeWidth={3} opacity={0.4} />
          ))}

          {/* Snow on roof */}
          <path d={ROOF_SNOW_D} fill="url(#sgs-snow)" opacity={0.85} />

          {/* Roof ridge */}
          <line x1={SH_X - 8} y1={SH_WALL_Y} x2={SH_RIDGE_X} y2={SH_RIDGE_Y}
            stroke="#1a1208" strokeWidth={3} />
          <line x1={SH_X + SH_W + 8} y1={SH_WALL_Y} x2={SH_RIDGE_X} y2={SH_RIDGE_Y}
            stroke="#1a1208" strokeWidth={3} />

          {/* Cupola on ridge */}
          <rect x={CUPOLA_X} y={CUPOLA_Y} width={CUPOLA_W} height={CUPOLA_H}
            fill="#2a1e10" />
          {/* Cupola louvers */}
          {CUPOLA_LOUVERS.map((l, i) => (
            <line key={i} x1={CUPOLA_X + 4} y1={l.y}
              x2={CUPOLA_X + CUPOLA_W - 4} y2={l.y + 2}
              stroke="#1a1208" strokeWidth={2.5}
            />
          ))}
          {/* Cupola roof mini-triangle */}
          <polygon
            points={`${CUPOLA_X - 4},${CUPOLA_Y} ${CUPOLA_X + CUPOLA_W / 2},${CUPOLA_Y - 18} ${CUPOLA_X + CUPOLA_W + 4},${CUPOLA_Y}`}
            fill="#3a2c18"
          />

          {/* Chimney pipe */}
          <rect x={CHIM_X} y={CHIM_Y1} width={CHIM_W} height={CHIM_Y2 - CHIM_Y1}
            fill="#2a2828" />
          <rect x={CHIM_X - 3} y={CHIM_Y1 - 5} width={CHIM_W + 6} height={8}
            fill="#1a1818" />

          {/* Evaporator silhouette through windows (amber glow behind) */}
          {SH_WINDOWS.map(([wx, wy, ww, wh], i) => (
            <rect key={i}
              x={wx + 8} y={wy + wh - 22} width={ww - 16} height={14}
              fill="#1a0e04" opacity={0.7}
            />
          ))}

          {/* Evaporator pans (exterior view, simplified) */}
          <rect x={EV_X} y={EV_Y} width={EV_W} height={18}
            fill="#3a3020" rx={2} opacity={0.4}
          />
        </g>

        {/* ─── STEAM PUFFS from cupola + chimney ─── */}
        {STEAM_PUFFS.map((p, i) => (
          <circle key={i}
            cx={p.cx} cy={p.cy} r={p.r}
            fill="url(#sgs-steam-g)"
            style={{
              animation: active
                ? `sgs-steam ${2.8 + (i % 4) * 0.6}s ease-out ${p.delay} infinite`
                : "none",
              opacity: active ? 0.68 : 0,
              transition: tr(0.25),
            }}
          />
        ))}

        {/* ─── COLLECTION TANK ─── */}
        <g style={{ opacity: active ? 1 : 0, transition: tr(0.28) }}>
          <rect x={TANK_X} y={TANK_Y} width={TANK_W} height={TANK_H}
            fill="url(#sgs-tank)" rx={3} />
          {/* Tank hoops */}
          {[8, TANK_H / 2 - 2, TANK_H - 10].map((oy, i) => (
            <line key={i}
              x1={TANK_X} y1={TANK_Y + oy}
              x2={TANK_X + TANK_W} y2={TANK_Y + oy}
              stroke="#8a8080" strokeWidth={2.5} opacity={0.7}
            />
          ))}
          {/* Syrup level */}
          <rect x={TANK_X + 3} y={TANK_Y + TANK_H - 18}
            width={TANK_W - 6} height={15}
            fill="url(#sgs-syrup)" opacity={0.75} rx={1}
          />
        </g>

        {/* ─── SAP BUCKETS on trees ─── */}
        {SAP_BUCKETS.map(([bx, by], i) => (
          <g key={i}
            className="sgs-bucket"
            style={{
              transformOrigin: `${bx}px ${by - 8}px`,
              animationDelay: `${i * 0.4}s`,
              opacity: active ? 1 : 0,
              transition: tr(0.14 + i * 0.04),
            }}
          >
            {/* Bucket body (tapered trapezoid) */}
            <path
              d={`M ${bx - 11},${by} L ${bx - 9},${by + 28} L ${bx + 9},${by + 28} L ${bx + 11},${by} Z`}
              fill="url(#sgs-bucket-g)"
            />
            {/* Bucket rim */}
            <line x1={bx - 12} y1={by} x2={bx + 12} y2={by}
              stroke="#c8a050" strokeWidth={3} />
            {/* Bucket handle wire */}
            <path d={`M ${bx - 10},${by} C ${bx - 14},${by - 10} ${bx + 14},${by - 10} ${bx + 10},${by}`}
              fill="none" stroke="#8a7040" strokeWidth={1.5} />
            {/* Syrup in bucket */}
            <rect x={bx - 7} y={by + 18} width={14} height={8}
              fill="#d89020" opacity={0.7} rx={1} />
            {/* Spout (tap) */}
            <line x1={bx} y1={SPOUTS[i]?.[1] ?? by - 16} x2={bx} y2={by}
              stroke="#9a8050" strokeWidth={3} />
            <rect x={bx - 4} y={(SPOUTS[i]?.[1] ?? by - 16) - 4} width={8} height={8}
              fill="#7a6030" rx={1} />
            {/* Drip */}
            {i < DRIPS.length && (() => {
              const drip = DRIPS[i];
              if (!drip) return null;
              const [dx, dspoutY, dbucketY] = drip;
              const dropY = dspoutY + ((dripT / 72) * (dbucketY - dspoutY - 8));
              const dropAlpha = dripT < 56 ? 0.9 : 1 - ((dripT - 56) / 16);
              return (
                <ellipse
                  cx={dx} cy={dropY}
                  rx={2.5} ry={4}
                  fill="#d89020"
                  opacity={dropAlpha * (active ? 1 : 0)}
                />
              );
            })()}
          </g>
        ))}

        {/* ─── FIREWOOD PILE ─── */}
        <g style={{ opacity: active ? 1 : 0, transition: tr(0.3) }}>
          {LOGS.map(([lx, ly, lw], i) => (
            <g key={i}>
              <rect x={lx} y={ly - 10} width={lw} height={10}
                fill={`rgb(${100 + (i % 3) * 8},${72 + (i % 3) * 6},${40 + (i % 3) * 4})`}
                rx={3}
              />
              {/* Log end caps */}
              <ellipse cx={lx} cy={ly - 5} rx={5} ry={5}
                fill="url(#sgs-log)" />
              <ellipse cx={lx + lw} cy={ly - 5} rx={5} ry={5}
                fill="url(#sgs-log)" opacity={0.7} />
            </g>
          ))}
          {/* Snow on top of woodpile */}
          <path d={`M ${FW_X - 4},${FW_Y - 46} C ${FW_X + 18},${FW_Y - 52} ${FW_X + 52},${FW_Y - 50} ${FW_X + 78},${FW_Y - 44}`}
            fill="none" stroke="#e8eef4" strokeWidth={6} strokeLinecap="round" opacity={0.8}
          />
        </g>

        {/* ─── SNOW SURFACE ─── */}
        <path d={SNOW_D} fill="url(#sgs-snow)"
          style={{ opacity: active ? 1 : 0, transition: tr(0.08) }}
        />
        {/* Snow drifts at sugarhouse base */}
        <path d={DRIFT_D} fill="#e8eef4" opacity={0.7}
          style={{ opacity: active ? 0.7 : 0, transition: tr(0.1) }}
        />
        <path d={DRIFT_D2} fill="#e8eef4" opacity={0.7}
          style={{ opacity: active ? 0.7 : 0, transition: tr(0.1) }}
        />

        {/* ─── SIGN ─── */}
        <g style={{ opacity: active ? 1 : 0, transition: tr(0.55) }}>
          <rect x={SH_DOOR_X - 52} y={SH_WALL_Y - 36} width={172} height={36}
            fill="#2a1808" rx={3} />
          <text
            x={SH_DOOR_X + 34} y={SH_WALL_Y - 14}
            textAnchor="middle"
            fontFamily="'Georgia', serif"
            fontSize={13} fontWeight="700"
            fill="#f0c050" letterSpacing={3}
          >MAPLE SWEET &amp; CO.</text>
          <text
            x={SH_DOOR_X + 34} y={SH_WALL_Y - 2}
            textAnchor="middle"
            fontFamily="'Georgia', serif"
            fontSize={9}
            fill="#c8a040" letterSpacing={4}
          >SHREWSBURY, MA EST. 1887</text>
        </g>

        {/* Caption */}
        <text
          x={W / 2} y={H - 14}
          textAnchor="middle"
          fontFamily="'Georgia', 'Times New Roman', serif"
          fontSize={11} fill="#6a7888"
          letterSpacing={5}
          style={{ opacity: active ? 0.65 : 0, transition: tr(1.0) }}
        >
          MAPLE SUGARING SEASON · SHREWSBURY, MA · ROUTE 9 CORRIDOR
        </text>
      </svg>
    </section>
  );
}
