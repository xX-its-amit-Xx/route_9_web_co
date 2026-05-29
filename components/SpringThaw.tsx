"use client";
import { useEffect, useRef, useState } from "react";

const W = 1440;
const H = 520;

// ─── Scene geometry ───────────────────────────────────────────────────────────
const HORIZON_Y = 218;
const ROAD_CX   = 720;
const ROAD_FAR_L = 652;
const ROAD_FAR_R = 788;
const ROAD_NEAR_L = 370;
const ROAD_NEAR_R = 1070;

// VP for road perspective
const VP_X = ROAD_CX;
const VP_Y = HORIZON_Y + 14;

// ─── Road path ────────────────────────────────────────────────────────────────
const ROAD_PATH = `M${ROAD_FAR_L},${VP_Y + 10} L${ROAD_FAR_R},${VP_Y + 10} L${ROAD_NEAR_R},${H} L${ROAD_NEAR_L},${H} Z`;

// ─── Mud ruts ─────────────────────────────────────────────────────────────────
type RutLine = { x1: number; y1: number; x2: number; y2: number; w: number };
const RUTS: RutLine[] = [
  { x1: VP_X - 60, y1: VP_Y + 14, x2: ROAD_NEAR_L + 160, y2: H - 10, w: 3.5 },
  { x1: VP_X - 25, y1: VP_Y + 14, x2: ROAD_NEAR_L + 260, y2: H - 10, w: 2.5 },
  { x1: VP_X + 22, y1: VP_Y + 14, x2: ROAD_NEAR_R - 260, y2: H - 10, w: 2.5 },
  { x1: VP_X + 58, y1: VP_Y + 14, x2: ROAD_NEAR_R - 160, y2: H - 10, w: 3.5 },
];

// ─── Puddles / flooded spots ──────────────────────────────────────────────────
type Puddle = { cx: number; cy: number; rx: number; ry: number; delay: number };
const PUDDLES: Puddle[] = [
  { cx: ROAD_CX - 80, cy: H - 80,  rx: 58, ry: 18, delay: 0   },
  { cx: ROAD_CX + 60, cy: H - 140, rx: 42, ry: 14, delay: 0.6 },
  { cx: ROAD_CX - 20, cy: H - 210, rx: 36, ry: 11, delay: 1.2 },
  { cx: ROAD_CX + 110,cy: H - 280, rx: 28, ry:  9, delay: 0.4 },
  { cx: ROAD_CX - 110,cy: H - 320, rx: 24, ry:  8, delay: 1.8 },
];

// ─── Brook (runs left of road, sweeps under it) ────────────────────────────────
// Brook banks as two parallel wavy paths
const BROOK_LEFT = `
  M 62,${H}
  Q 88,${H - 60}  100,${H - 120}
  Q 114,${H - 185} 128,${H - 230}
  Q 148,${HORIZON_Y + 52} 180,${HORIZON_Y + 30}
  Q 220,${HORIZON_Y + 16} 260,${HORIZON_Y + 22}
`;
const BROOK_RIGHT = `
  M 118,${H}
  Q 148,${H - 58}  162,${H - 118}
  Q 178,${H - 182} 192,${H - 225}
  Q 212,${HORIZON_Y + 48} 244,${HORIZON_Y + 28}
  Q 276,${HORIZON_Y + 18} 320,${HORIZON_Y + 24}
`;

// ─── Brook water ripples ──────────────────────────────────────────────────────
type BrookRipple = { cx: number; cy: number; rx: number; ry: number; delay: number };
const BROOK_RIPPLES: BrookRipple[] = [
  { cx: 88,  cy: H - 50,  rx: 18, ry: 4, delay: 0   },
  { cx: 112, cy: H - 130, rx: 14, ry: 3, delay: 0.5 },
  { cx: 132, cy: H - 200, rx: 12, ry: 3, delay: 1.0 },
  { cx: 155, cy: H - 255, rx: 10, ry: 2, delay: 0.3 },
  { cx: 190, cy: HORIZON_Y + 40, rx: 8,  ry: 2, delay: 0.8 },
];

// ─── Stone wall (right of road) ───────────────────────────────────────────────
type WallStone = [number, number, number, number, string];
const WALL_STONES: WallStone[] = (() => {
  const stones: WallStone[] = [];
  const wallX = ROAD_NEAR_R + 18;
  const wallEndX = W - 10;
  const stoneW = 38;
  const shades = ["#8a7a6a","#7a6e5c","#9a8a78","#6a6050","#b0a090"];
  let x = wallX;
  let row = 0;
  while (x < wallEndX) {
    const sw = stoneW + (row * 7 + x * 3) % 16;
    const sh = 16 + (row + x) % 8;
    const sy = H - 80 - row * (sh + 1) + (x * 2) % 6;
    stones.push([x, sy, sw, sh, shades[(row * 3 + Math.floor(x / 40)) % shades.length] ?? "#8a7a6a"]);
    x += sw + 1.5;
    if (x > wallEndX - stoneW) { x = wallX + (row % 2 === 0 ? 18 : 0); row++; if (row > 2) break; }
  }
  return stones;
})();

// ─── Split-rail fence (left of road, near brook) ──────────────────────────────
// 3-rail fence posts, perspective-scaled from far to near
type FencePost = { x: number; y: number; h: number; w: number };
const FENCE_POSTS: FencePost[] = Array.from({ length: 9 }, (_, i) => {
  const t = i / 8;
  const fx = 340 + t * 48 + i * 32;
  const baseY = HORIZON_Y + 28 + t * (H - HORIZON_Y - 28 - 80);
  const postH = 28 + t * 42;
  const postW = 4 + t * 5;
  return { x: fx, y: baseY - postH, h: postH, w: postW };
});

// Rail positions (3 rails per bay)
type FenceRail = { x1: number; y1: number; x2: number; y2: number; w: number };
const FENCE_RAILS: FenceRail[] = FENCE_POSTS.slice(0, -1).flatMap((p, i) => {
  const p2 = FENCE_POSTS[i + 1] ?? p;
  return [0.25, 0.55, 0.82].map(frac => ({
    x1: p.x + p.w / 2,
    y1: p.y + p.h * frac,
    x2: p2.x + p2.w / 2,
    y2: p2.y + p2.h * frac,
    w: 1.5 + frac * 1.2,
  }));
});

// ─── Robin on fence post ──────────────────────────────────────────────────────
// Sits on post index 5
const ROBIN_POST = FENCE_POSTS[5] ?? { x: 500, y: 320, h: 55, w: 7 };
const ROBIN_X = ROBIN_POST.x + ROBIN_POST.w / 2;
const ROBIN_Y = ROBIN_POST.y - 2;

// ─── Maple trees (bare, red-budding tips) ────────────────────────────────────
type MapleTree = {
  cx: number; baseY: number; trunkH: number; trunkW: number;
  branches: [number, number, number, number, number][];  // [startFrac, dx, dy, len, angle]
  buds: [number, number][];  // bud positions [x,y]
};

function makeSpringMaple(cx: number, baseY: number, trunkH: number, trunkW: number, lean: number): MapleTree {
  const branches: [number, number, number, number, number][] = [
    [0.55, lean + 38, -trunkH * 0.54, 55, 30],
    [0.55, lean - 32, -trunkH * 0.52, 50, -28],
    [0.70, lean + 28, -trunkH * 0.69, 40, 22],
    [0.70, lean - 24, -trunkH * 0.67, 38, -20],
    [0.82, lean + 18, -trunkH * 0.80, 30, 15],
    [0.82, lean - 15, -trunkH * 0.78, 28, -14],
    [0.92, lean + 10, -trunkH * 0.90, 22, 10],
    [0.92, lean -  8, -trunkH * 0.88, 20, -9],
  ];
  // Buds at branch tips (golden-angle scatter around each tip)
  const buds: [number, number][] = branches.flatMap(([, dx, dy, len, angle]) => {
    const tipX = cx + dx + Math.cos(angle * Math.PI / 180) * len;
    const tipY = baseY + dy + Math.sin(angle * Math.PI / 180) * len;
    return Array.from({ length: 5 }, (_, bi) => {
      const ba = bi * 72 * Math.PI / 180;
      return [tipX + Math.cos(ba) * 6, tipY + Math.sin(ba) * 6] as [number, number];
    });
  });
  return { cx, baseY, trunkH, trunkW, branches, buds };
}

const MAPLES_L: MapleTree[] = [
  makeSpringMaple(52,  HORIZON_Y + 18, 188, 10, -6),
  makeSpringMaple(128, HORIZON_Y + 14, 210, 12, -8),
  makeSpringMaple(228, HORIZON_Y + 20, 172, 9,  -5),
];
const MAPLES_R: MapleTree[] = [
  makeSpringMaple(1212, HORIZON_Y + 16, 196, 11,  7),
  makeSpringMaple(1310, HORIZON_Y + 12, 218, 13,  8),
  makeSpringMaple(1400, HORIZON_Y + 18, 178, 10,  6),
];
// Smaller far-distance maples
const MAPLES_FAR: MapleTree[] = [
  makeSpringMaple(380, HORIZON_Y + 4,  98, 5, -3),
  makeSpringMaple(440, HORIZON_Y + 2, 108, 5, -4),
  makeSpringMaple(510, HORIZON_Y + 5,  92, 4, -2),
  makeSpringMaple(930, HORIZON_Y + 3, 102, 5,  3),
  makeSpringMaple(998, HORIZON_Y + 5,  96, 4,  4),
  makeSpringMaple(1062,HORIZON_Y + 2, 106, 5,  3),
];
const ALL_MAPLES = [...MAPLES_L, ...MAPLES_R, ...MAPLES_FAR];

// ─── Emerging grass / moss tufts ──────────────────────────────────────────────
type GrassTuft = { x: number; y: number; h: number; spread: number; color: string };
const GRASS_TUFTS: GrassTuft[] = [
  // Roadsides
  ...Array.from({ length: 22 }, (_, i) => ({
    x: ROAD_NEAR_R + 8 + i * 28,
    y: H - 72 + (i % 3) * 8,
    h: 18 + i % 8,
    spread: 6 + i % 5,
    color: i % 3 === 0 ? "#7a9a40" : i % 3 === 1 ? "#6a8a34" : "#8aaa48",
  })),
  ...Array.from({ length: 14 }, (_, i) => ({
    x: 150 + i * 14,
    y: H - 68 + (i % 3) * 6,
    h: 16 + i % 7,
    spread: 5 + i % 4,
    color: "#7a9a40",
  })),
];

// ─── Raindrops (light spring drizzle) ────────────────────────────────────────
type Raindrop = { x: number; y: number; speed: number; delay: number; len: number };
const RAINDROPS: Raindrop[] = Array.from({ length: 60 }, (_, i) => {
  const angle = i * 137.508 * Math.PI / 180;
  const radius = Math.sqrt(i / 60) * W * 0.52;
  return {
    x: ((W / 2 + Math.cos(angle) * radius) + W) % W,
    y: (i * 31) % H,
    speed: 1.4 + (i % 5) * 0.3,
    delay: -(i * 0.18) % 2.2,
    len: 10 + i % 8,
  };
});

// ─── Birds (V-shaped flock migrating north) ───────────────────────────────────
type FlockBird = { x: number; y: number; delay: number };
const FLOCK: FlockBird[] = [
  { x: -60,  y: 72,  delay: 0   },
  { x: -90,  y: 82,  delay: 0.1 },
  { x: -30,  y: 82,  delay: 0.1 },
  { x: -120, y: 95,  delay: 0.2 },
  { x:  0,   y: 95,  delay: 0.2 },
  { x: -150, y: 110, delay: 0.3 },
  { x:  28,  y: 110, delay: 0.3 },
];

export function SpringThaw() {
  const ref = useRef<SVGSVGElement>(null);
  const [active, setActive] = useState(false);
  const [brookFlow, setBrookFlow] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setActive(true); },
      { threshold: 0.12 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!active) return;
    let f = 0;
    const tick = setInterval(() => {
      f = (f + 1.2) % 360;
      setBrookFlow(f);
    }, 16);
    return () => clearInterval(tick);
  }, [active]);

  const tr = (d: number) =>
    active ? `opacity 0.7s ease ${d}s, transform 0.7s ease ${d}s` : "none";

  return (
    <section style={{ background: "#8cb0c8", overflow: "hidden", position: "relative" }}>
      <style>{`
        @keyframes st-rain {
          from { transform: translateY(0) translateX(0); opacity: 0.6; }
          to   { transform: translateY(${H + 20}px) translateX(12px); opacity: 0.2; }
        }
        @keyframes st-ripple {
          0%   { transform: scale(1); opacity: 0.7; }
          100% { transform: scale(2.2); opacity: 0; }
        }
        @keyframes st-robin-bob {
          0%,100% { transform: translateY(0) rotate(0deg); }
          30%     { transform: translateY(-4px) rotate(-5deg); }
          60%     { transform: translateY(-2px) rotate(3deg); }
        }
        @keyframes st-bud-swell {
          0%,100% { r: 2.5; }
          50%     { r: 3.4; }
        }
        @keyframes st-flock {
          from { transform: translateX(0); }
          to   { transform: translateX(${W + 200}px); }
        }
        @keyframes st-puddle-shimmer {
          0%,100% { opacity: 0.55; }
          50%     { opacity: 0.78; }
        }
        @keyframes st-brook-flow {
          0%   { stroke-dashoffset: 0; }
          100% { stroke-dashoffset: -80; }
        }
        .st-bud   { animation: st-bud-swell 2.5s ease-in-out infinite; }
        .st-robin { animation: st-robin-bob 3s ease-in-out infinite; }
        .st-ripple{ animation: st-ripple 2.4s ease-out infinite; }
        .st-puddle{ animation: st-puddle-shimmer 3.5s ease-in-out infinite; }
        .st-brook { animation: st-brook-flow 1.2s linear infinite; }
      `}</style>
      <svg
        ref={ref}
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="xMidYMid slice"
        style={{ display: "block", width: "100%", height: "auto", minHeight: 320 }}
        aria-label="Route 9 in early spring mud season — swollen brook, budding maples, robin on fence, puddles"
        role="img"
      >
        <defs>
          <linearGradient id="st-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#6888a8" />
            <stop offset="35%"  stopColor="#8aaac0" />
            <stop offset="70%"  stopColor="#a8c4d8" />
            <stop offset="100%" stopColor="#c0d8e8" />
          </linearGradient>
          <linearGradient id="st-ground" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#7a8a50" />
            <stop offset="40%"  stopColor="#6a7840" />
            <stop offset="100%" stopColor="#4a5828" />
          </linearGradient>
          <linearGradient id="st-road" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#7a6a50" />
            <stop offset="100%" stopColor="#5a4c38" />
          </linearGradient>
          <linearGradient id="st-brook" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%"   stopColor="#5888a8" />
            <stop offset="50%"  stopColor="#6898b8" />
            <stop offset="100%" stopColor="#4878a0" />
          </linearGradient>
          <linearGradient id="st-puddle" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#8ab0c8" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#6090b0" stopOpacity="0.7" />
          </linearGradient>
          <clipPath id="st-clip">
            <rect x="0" y="0" width={W} height={H} />
          </clipPath>
        </defs>

        {/* ── Overcast sky ── */}
        <rect x="0" y="0" width={W} height={H} fill="url(#st-sky)" />
        {/* Cloud layer (flat stratus, not fluffy) */}
        {Array.from({ length: 8 }, (_, i) => (
          <rect key={i}
            x={i * 200 - 40} y={20 + i * 8}
            width={220 + i * 30} height={18 + i * 4}
            rx="9" fill="#c8d8e4" opacity={0.35 + (i % 3) * 0.1}
          />
        ))}

        {/* ── Far treeline (bare) ── */}
        {Array.from({ length: 38 }, (_, i) => {
          const tx = i * 40 - 8;
          const th = 32 + (i * 9) % 22;
          const ty = HORIZON_Y - th + 4;
          return (
            <line key={i} x1={tx + 5} y1={HORIZON_Y + 4} x2={tx + 5} y2={ty}
              stroke="#3a3028" strokeWidth={2 + (i % 3)} opacity="0.5" />
          );
        })}

        {/* ── Ground ── */}
        <rect x="0" y={HORIZON_Y + 8} width={W} height={H - HORIZON_Y - 8} fill="url(#st-ground)" />
        {/* Patchy new green on ground */}
        {Array.from({ length: 18 }, (_, i) => (
          <ellipse key={i}
            cx={80 + i * 78} cy={HORIZON_Y + 30 + (i * 13) % 40}
            rx={22 + i % 18} ry={8 + i % 6}
            fill="#8aaa50" opacity={0.4 + (i % 3) * 0.1}
          />
        ))}

        {/* ── Road ── */}
        <path d={ROAD_PATH} fill="url(#st-road)" />
        {/* Road texture (muddy, slightly mottled) */}
        {Array.from({ length: 10 }, (_, i) => {
          const t = (i + 1) / 11;
          const cx = ROAD_CX + ((i % 2) * 2 - 1) * 40 * t;
          const cy = VP_Y + 10 + (H - VP_Y - 10) * t;
          const rw = 18 * t;
          const rh = 7 * t;
          return (
            <ellipse key={i} cx={cx} cy={cy} rx={rw} ry={rh}
              fill="#4a3c2a" opacity="0.22" />
          );
        })}
        {/* Mud ruts */}
        {RUTS.map((rt, i) => (
          <line key={i} x1={rt.x1} y1={rt.y1} x2={rt.x2} y2={rt.y2}
            stroke="#3a2c1a" strokeWidth={rt.w} opacity="0.4" />
        ))}

        {/* ── Puddles ── */}
        {PUDDLES.map((pd, i) => (
          <g key={i}>
            <ellipse cx={pd.cx} cy={pd.cy} rx={pd.rx} ry={pd.ry}
              fill="url(#st-puddle)" className="st-puddle"
              style={{ animationDelay: `${pd.delay}s` }} />
            {/* Sky reflection highlight */}
            <ellipse cx={pd.cx - pd.rx * 0.2} cy={pd.cy - pd.ry * 0.3}
              rx={pd.rx * 0.35} ry={pd.ry * 0.35}
              fill="#c0d8e8" opacity="0.4" />
            {/* Ripple in largest puddle */}
            {i === 0 && (
              <ellipse cx={pd.cx} cy={pd.cy} rx={pd.rx * 0.6} ry={pd.ry * 0.6}
                fill="none" stroke="#8ab0c8" strokeWidth="1.2"
                className="st-ripple" />
            )}
          </g>
        ))}

        {/* ── Brook ── */}
        {/* Brook bed (dark soil) */}
        <path d={BROOK_RIGHT} fill="none" stroke="#3a2a18" strokeWidth="32"
          strokeLinecap="round" />
        {/* Brook water */}
        <path d={BROOK_LEFT} fill="none" stroke="url(#st-brook)" strokeWidth="22"
          strokeLinecap="round" />
        {/* Brook flow lines (animated dashes) */}
        {[0, 1, 2].map(i => (
          <path key={i}
            d={`M ${82 + i * 8},${H - 20 - i * 5}
               Q ${105 + i * 5},${H - 80}  ${118 + i * 4},${H - 140}
               Q ${135 + i * 3},${H - 195} ${148 + i * 3},${H - 240}
               Q ${165 + i * 2},${HORIZON_Y + 52} ${195 + i * 4},${HORIZON_Y + 32}`}
            fill="none" stroke="#9ac4d8" strokeWidth={2 - i * 0.3}
            strokeDasharray="12,18" opacity={0.5 - i * 0.1}
            className="st-brook"
            style={{ animationDelay: `${i * 0.4}s` }}
          />
        ))}
        {/* Brook ripples */}
        {BROOK_RIPPLES.map((rp, i) => (
          <ellipse key={i} className="st-ripple" cx={rp.cx} cy={rp.cy} rx={rp.rx} ry={rp.ry}
            fill="none" stroke="#8ab8cc" strokeWidth="1.2"
            style={{ animationDelay: `${rp.delay}s` }} />
        ))}
        {/* Brook bank vegetation */}
        {[H - 40, H - 100, H - 170, H - 230].map((by, i) => (
          <g key={i}>
            <line x1={62 + i * 5} y1={by} x2={55 + i * 4} y2={by - 22 - i * 3}
              stroke="#6a8830" strokeWidth="2.5" strokeLinecap="round" />
            <line x1={66 + i * 5} y1={by} x2={72 + i * 4} y2={by - 18 - i * 2}
              stroke="#7a9838" strokeWidth="2" strokeLinecap="round" />
          </g>
        ))}

        {/* ── Maple trees ── */}
        {ALL_MAPLES.map((tree, ti) => (
          <g key={ti} style={{
            opacity: active ? 1 : 0,
            transform: active ? "translateY(0)" : "translateY(12px)",
            transition: tr(0.2 + (ti % 6) * 0.05),
          }}>
            {/* Trunk */}
            <line x1={tree.cx} y1={tree.baseY}
              x2={tree.cx} y2={tree.baseY - tree.trunkH}
              stroke="#2e2218" strokeWidth={tree.trunkW} strokeLinecap="round" />
            {/* Branches */}
            {tree.branches.map(([frac, dx, dy, len, angle], bi) => {
              const startX = tree.cx;
              const startY = tree.baseY - tree.trunkH * frac;
              const endX = startX + dx + Math.cos(angle * Math.PI / 180) * len * 0.4;
              const endY = startY + dy * 0.3;
              const tipX = startX + dx + Math.cos(angle * Math.PI / 180) * len;
              const tipY = startY + dy + Math.sin(angle * Math.PI / 180) * len * 0.5;
              const sw = Math.max(1.2, tree.trunkW * 0.28 - bi * 0.1);
              return (
                <path key={bi}
                  d={`M${startX},${startY} Q${endX},${endY} ${tipX},${tipY}`}
                  fill="none" stroke="#2e2218" strokeWidth={sw} strokeLinecap="round"
                />
              );
            })}
            {/* Red buds at tips (tiny circles) */}
            {tree.buds.map(([bx, by], bi) => (
              <circle key={bi} cx={bx} cy={by} r={tree.trunkW > 8 ? 2.8 : 1.8}
                fill="#9a2820" className="st-bud"
                style={{ animationDelay: `${(ti * 5 + bi) * 0.08}s` }} />
            ))}
          </g>
        ))}

        {/* ── Stone wall ── */}
        <g style={{
          opacity: active ? 1 : 0,
          transform: active ? "translateY(0)" : "translateY(8px)",
          transition: tr(0.38),
        }}>
          {WALL_STONES.map(([sx, sy, sw, sh, fill], i) => (
            <rect key={i} x={sx} y={sy} width={sw} height={sh}
              rx="2" fill={fill} stroke="#4a3a28" strokeWidth="0.6" />
          ))}
          {/* Cap stones */}
          <rect x={ROAD_NEAR_R + 14} y={H - 80 - 38} width={W - ROAD_NEAR_R - 20} height={9}
            rx="3" fill="#9a9080" stroke="#7a7068" strokeWidth="0.8" />
          {/* Moss on top */}
          {Array.from({ length: 8 }, (_, i) => (
            <ellipse key={i}
              cx={ROAD_NEAR_R + 30 + i * 56} cy={H - 80 - 36}
              rx={14 + i % 8} ry={5}
              fill="#6a8838" opacity="0.55" />
          ))}
        </g>

        {/* ── Split-rail fence ── */}
        <g style={{
          opacity: active ? 1 : 0,
          transform: active ? "translateY(0)" : "translateY(10px)",
          transition: tr(0.3),
        }}>
          {FENCE_POSTS.map((fp, i) => (
            <g key={i}>
              {/* Post with weathered texture */}
              <rect x={fp.x - fp.w / 2} y={fp.y} width={fp.w} height={fp.h}
                rx="1" fill="#7a6040" stroke="#5a4028" strokeWidth="0.8" />
              {/* Post cap (split/angled) */}
              <polygon
                points={`${fp.x - fp.w / 2},${fp.y} ${fp.x},${fp.y - fp.w * 0.8} ${fp.x + fp.w / 2},${fp.y}`}
                fill="#5a4028" />
            </g>
          ))}
          {FENCE_RAILS.map((fr, i) => (
            <line key={i} x1={fr.x1} y1={fr.y1} x2={fr.x2} y2={fr.y2}
              stroke="#6a5030" strokeWidth={fr.w} strokeLinecap="round" />
          ))}
        </g>

        {/* ── Robin on fence post ── */}
        <g style={{
          opacity: active ? 1 : 0,
          transform: active ? "translateY(0)" : "translateY(6px)",
          transition: tr(0.5),
        }}>
          <g className="st-robin"
             style={{ transformOrigin: `${ROBIN_X}px ${ROBIN_Y}px` }}>
            {/* Body */}
            <ellipse cx={ROBIN_X} cy={ROBIN_Y - 10} rx={9} ry={7}
              fill="#2a2820" />
            {/* Robin red breast */}
            <ellipse cx={ROBIN_X + 2} cy={ROBIN_Y - 8} rx={6} ry={5}
              fill="#c84820" opacity="0.92" />
            {/* Head */}
            <circle cx={ROBIN_X + 6} cy={ROBIN_Y - 17} r={6}
              fill="#1a1818" />
            {/* White eye ring */}
            <circle cx={ROBIN_X + 8} cy={ROBIN_Y - 18} r={2.5}
              fill="#f0e8d0" />
            <circle cx={ROBIN_X + 8} cy={ROBIN_Y - 18} r={1.5}
              fill="#1a1818" />
            {/* Beak */}
            <path d={`M${ROBIN_X + 12},${ROBIN_Y - 17} L${ROBIN_X + 18},${ROBIN_Y - 15} L${ROBIN_X + 12},${ROBIN_Y - 13}`}
              fill="#e8a020" />
            {/* Tail */}
            <path d={`M${ROBIN_X - 6},${ROBIN_Y - 7} L${ROBIN_X - 18},${ROBIN_Y - 3} L${ROBIN_X - 14},${ROBIN_Y - 11}`}
              fill="#2a2820" />
            {/* Legs */}
            <line x1={ROBIN_X - 1} y1={ROBIN_Y - 4} x2={ROBIN_X - 3} y2={ROBIN_Y + 1}
              stroke="#6a5020" strokeWidth="1.8" />
            <line x1={ROBIN_X + 3} y1={ROBIN_Y - 4} x2={ROBIN_X + 2} y2={ROBIN_Y + 1}
              stroke="#6a5020" strokeWidth="1.8" />
            {/* Feet */}
            <line x1={ROBIN_X - 3} y1={ROBIN_Y + 1} x2={ROBIN_X - 8} y2={ROBIN_Y + 3}
              stroke="#6a5020" strokeWidth="1.5" />
            <line x1={ROBIN_X + 2} y1={ROBIN_Y + 1} x2={ROBIN_X + 7} y2={ROBIN_Y + 3}
              stroke="#6a5020" strokeWidth="1.5" />
          </g>
        </g>

        {/* ── Grass tufts ── */}
        <g style={{ opacity: active ? 1 : 0, transition: tr(0.42) }}>
          {GRASS_TUFTS.map((gt, i) => (
            <g key={i}>
              <line x1={gt.x}              y1={gt.y} x2={gt.x - gt.spread} y2={gt.y - gt.h}
                stroke={gt.color} strokeWidth="2" strokeLinecap="round" />
              <line x1={gt.x + 4}          y1={gt.y} x2={gt.x + 4}        y2={gt.y - gt.h * 1.1}
                stroke={gt.color} strokeWidth="2.5" strokeLinecap="round" />
              <line x1={gt.x + gt.spread}  y1={gt.y} x2={gt.x + gt.spread * 1.5} y2={gt.y - gt.h * 0.9}
                stroke={gt.color} strokeWidth="2" strokeLinecap="round" />
            </g>
          ))}
        </g>

        {/* ── Migrating bird flock ── */}
        {FLOCK.map((bd, i) => (
          <g key={i}
             style={{
               animation: active
                 ? `st-flock ${18 + i * 0.5}s linear ${bd.delay}s infinite`
                 : "none",
             }}>
            <path
              d={`M${bd.x - 8},${bd.y} Q${bd.x},${bd.y - 6} ${bd.x + 8},${bd.y}`}
              fill="none" stroke="#1a2030" strokeWidth="1.8" opacity="0.7" />
          </g>
        ))}

        {/* ── Spring drizzle ── */}
        {RAINDROPS.map((rd, i) => (
          <line key={i}
            x1={rd.x} y1={rd.y}
            x2={rd.x + 4} y2={rd.y + rd.len}
            stroke="#9ab8cc" strokeWidth="0.8" opacity="0.45"
            style={{
              animation: active
                ? `st-rain ${rd.speed}s linear ${rd.delay}s infinite`
                : "none",
            }}
          />
        ))}

        {/* ── Foreground ground ── */}
        <path
          d={`M0,${H - 60} Q200,${H - 75} 360,${H - 62} Q520,${H - 50} 700,${H - 68} Q900,${H - 82} 1080,${H - 60} Q1260,${H - 45} 1440,${H - 64} L1440,${H} L0,${H} Z`}
          fill="#5a6830"
        />
        {/* Mud patches */}
        {[220, 460, 680, 900, 1140, 1340].map((mx, i) => (
          <ellipse key={i} cx={mx} cy={H - 38 + (i % 3) * 8}
            rx={28 + i * 4} ry={10}
            fill="#3a2e1e" opacity="0.35" />
        ))}

        {/* ── Section label ── */}
        <g style={{
          opacity: active ? 1 : 0,
          transform: active ? "translateY(0)" : "translateY(-8px)",
          transition: tr(0.12),
        }}>
          <text x={W / 2} y={H - 14} textAnchor="middle"
            fontFamily="'Georgia', serif" fontSize="11" fill="#6a7850"
            letterSpacing="3" opacity="0.65">
            ROUTE 9 · SHREWSBURY · MUD SEASON
          </text>
        </g>
      </svg>
    </section>
  );
}
