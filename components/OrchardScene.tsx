"use client";
import { useEffect, useRef, useState } from "react";

// Pass 61: New England hilltop apple orchard at harvest — rows of trees, stone wall, ladder, morning mist

const W = 1440, H = 540;
const HORIZON_Y = 192;
const GROUND_Y  = HORIZON_Y + 12;  // where ground color begins

// ─── Rolling hills (3 layers) ────────────────────────────────────────────
const HILL1_D =  // far-distance, blue-grey
  "M 0,188 C 120,174 280,182 440,170 C 580,160 720,172 880,164 " +
  "C 1040,156 1200,168 1440,158 L 1440,200 L 0,200 Z";

const HILL2_D =  // mid-distance, muted green-gold
  "M 0,210 C 160,196 320,208 500,198 C 660,190 820,204 1000,196 " +
  "C 1160,188 1300,200 1440,192 L 1440,240 L 0,240 Z";

const HILL3_D =  // near hills, warm autumn gold-green
  "M 0,268 C 200,248 400,264 640,252 C 800,244 960,256 1160,248 " +
  "C 1280,244 1380,252 1440,248 L 1440,300 L 0,300 Z";

// ─── Sky (crisp autumn morning) ───────────────────────────────────────────

// ─── Mist in valley (blurred soft ellipses) ──────────────────────────────
type MistPuff = { cx: number; cy: number; rx: number; ry: number; delay: string };
const VALLEY_MIST: MistPuff[] = [
  { cx: 220,  cy: 258, rx: 188, ry: 32, delay: "0s"    },
  { cx: 620,  cy: 270, rx: 224, ry: 28, delay: "1.4s"  },
  { cx: 1080, cy: 260, rx: 196, ry: 30, delay: "0.7s"  },
  { cx: 420,  cy: 282, rx: 148, ry: 22, delay: "2.1s"  },
  { cx: 860,  cy: 276, rx: 172, ry: 24, delay: "1.0s"  },
  { cx: 1280, cy: 264, rx: 140, ry: 26, delay: "1.7s"  },
];

// ─── Stone wall (foreground, right of frame) ─────────────────────────────
// Two-course rough fieldstone wall running diagonally
type Stone = [number, number, number, number, number]; // x,y,w,h,shade
const WALL_STONES: Stone[] = [
  // top course
  [888, 392, 52, 22, 0], [940, 388, 44, 24, 4], [984, 392, 56, 22, -3],
  [1040,390, 48, 24, 2], [1088,392, 54, 22, -2],[1142,388, 46, 26, 5],
  [1188,392, 52, 22, -1],[1240,390, 44, 24, 3], [1284,392, 56, 22, -4],
  [1340,388, 52, 24, 1], [1392,392, 48, 22, 2],
  // bottom course
  [882, 414, 56, 22, -2],[938, 412, 52, 24, 3], [990, 414, 48, 22, 0],
  [1038,412, 56, 24, -3],[1094,414, 44, 22, 4], [1138,412, 54, 24, -1],
  [1192,414, 48, 22, 2], [1240,412, 52, 24, -4],[1292,414, 46, 22, 1],
  [1338,412, 56, 24, -2],[1394,414, 46, 22, 3],
];
const WALL_CAP_D =
  "M 882,412 C 900,408 960,410 1020,408 C 1080,406 1140,410 1200,408 " +
  "C 1260,406 1320,410 1440,408 L 1440,414 L 882,414 Z";

// ─── Orchard tree rows ────────────────────────────────────────────────────
// Three rows of apple trees receding in perspective
// Each tree: trunk, spreading canopy with red apples dotted in
type AppleTree = {
  cx: number; groundY: number;
  trunkH: number; trunkW: number;
  canopyRx: number; canopyRy: number;
  shade: string;   // canopy color
  apples: [number, number, number][];  // cx, cy, r
};

function makeRow(
  groundY: number,
  xPositions: number[],
  trunkH: number,
  trunkW: number,
  cRx: number,
  cRy: number,
  shade: string,
): AppleTree[] {
  return xPositions.map((cx, i) => {
    const appCount = 4 + (i * 3) % 5;
    const apples: [number, number, number][] = Array.from({ length: appCount }, (_, j) => {
      const aa = (j * 137.5 * Math.PI / 180);
      const ar = cRx * 0.55 + (j * 11) % (cRx * 0.35);
      const ax = cx + Math.round(ar * Math.cos(aa) * 0.9);
      const ay = groundY - trunkH - cRy * 0.5 + Math.round(ar * Math.sin(aa) * 0.65);
      return [ax, ay, 4 + (j % 3)];
    });
    return { cx, groundY, trunkH, trunkW, canopyRx: cRx, canopyRy: cRy, shade, apples };
  });
}

// Far row (small, distant)
const ROW_FAR = makeRow(
  298, [88, 196, 312, 436, 558, 672, 784, 898, 1012, 1128, 1240, 1356],
  36, 3, 28, 22, "#5a7828"
);
// Middle row
const ROW_MID = makeRow(
  352, [112, 254, 396, 532, 668, 804, 936, 1068, 1196, 1328],
  52, 5, 38, 30, "#6a8428"
);
// Near row (large, close)
const ROW_NEAR = makeRow(
  436, [62, 218, 382, 542, 696, 858],
  72, 8, 54, 44, "#4a6c1c"
);

const ALL_TREES: AppleTree[] = [...ROW_FAR, ...ROW_MID, ...ROW_NEAR];

// ─── Harvest ladder (leaning on near tree, left side) ─────────────────────
// Two rails + rungs
const LADDER_TREE_CX = ROW_NEAR[1]?.cx ?? 218;
const LADDER_TREE_GY = ROW_NEAR[1]?.groundY ?? 436;
const LADDER_TREE_H  = ROW_NEAR[1]?.trunkH  ?? 72;
const LADDER_TOP_X   = LADDER_TREE_CX + 20;
const LADDER_TOP_Y   = LADDER_TREE_GY - LADDER_TREE_H - 32;
const LADDER_BOT_X   = LADDER_TREE_CX - 28;
const LADDER_BOT_Y   = LADDER_TREE_GY - 4;
const LADDER_RUNGS   = 8;

// ─── Apple baskets on ground ──────────────────────────────────────────────
type Basket = [number, number, number]; // cx, groundY, r (half-width)
const BASKETS: Basket[] = [
  [LADDER_TREE_CX - 54, LADDER_TREE_GY, 22],
  [LADDER_TREE_CX - 14, LADDER_TREE_GY, 20],
  [ROW_NEAR[2]?.cx ?? 382, (ROW_NEAR[2]?.groundY ?? 436), 22],
  [ROW_NEAR[3]?.cx ? (ROW_NEAR[3].cx - 36) : 506, (ROW_NEAR[3]?.groundY ?? 436), 20],
];

// ─── Fallen apples on ground ──────────────────────────────────────────────
type FApple = [number, number, number, string];
const FALLEN_APPLES: FApple[] = [
  [LADDER_TREE_CX - 36, LADDER_TREE_GY - 5, 6, "#c02808"],
  [LADDER_TREE_CX + 18, LADDER_TREE_GY - 4, 5, "#d83010"],
  [LADDER_TREE_CX - 8,  LADDER_TREE_GY - 6, 7, "#b02008"],
  [180, 432, 5, "#c82810"],
  [234, 430, 6, "#d03018"],
  [390, 434, 5, "#c02808"],
  [412, 432, 7, "#d83010"],
  [700, 434, 6, "#b02008"],
  [728, 432, 5, "#c82810"],
  [862, 434, 6, "#d03018"],
];

// ─── Ground texture (grass tufts + shadow) ────────────────────────────────
const GROUND_TUFTS: [number, number][] = Array.from({ length: 28 }, (_, i) => [
  Math.round(28 + i * 52),
  GROUND_Y + 20 + (i % 4) * 12,
]);

// ─── Foreground grassy path (center aisle between tree rows) ─────────────
const PATH_D =
  `M ${W / 2 - 180},${H} L ${W / 2 + 180},${H} ` +
  `L ${W / 2 + 12},360 L ${W / 2 - 12},360 Z`;

// ─── Sun (behind morning haze) ────────────────────────────────────────────
const SUN_CX = 824, SUN_CY = 132;

// ─── Birds in sky ─────────────────────────────────────────────────────────
type Bird = [number, number, number]; // cx, cy, scale
const BIRDS: Bird[] = [
  [480, 88, 1.0], [508, 76, 0.8], [528, 84, 0.9],
  [962, 104, 1.0], [984, 94, 0.8], [1006, 100, 0.9], [1022, 90, 0.7],
];

export function OrchardScene() {
  const ref = useRef<SVGSVGElement>(null);
  const [active, setActive] = useState(false);

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

  const tr = (d: number) =>
    active ? `opacity 0.7s ease ${d}s, transform 0.7s ease ${d}s` : "none";

  return (
    <section
      aria-label="New England hilltop apple orchard at harvest with morning mist"
      style={{ background: "#b8c8d8", overflow: "hidden" }}
    >
      <style>{`
        @keyframes orc-mist {
          0%,100% { transform: translateX(0px)   scaleX(1);    opacity: var(--mo); }
          40%      { transform: translateX(14px)  scaleX(1.05); opacity: calc(var(--mo) * 1.25); }
          70%      { transform: translateX(-10px) scaleX(0.96); opacity: calc(var(--mo) * 0.75); }
        }
        @keyframes orc-bird {
          0%,100% { transform: translateX(0px)  translateY(0px);  }
          25%      { transform: translateX(28px) translateY(-6px); }
          50%      { transform: translateX(56px) translateY(-2px); }
          75%      { transform: translateX(84px) translateY(-8px); }
        }
        @keyframes orc-sway {
          0%,100% { transform: rotate(0deg);    }
          50%      { transform: rotate(-1.2deg); }
        }
        .orc-bird  { animation: ${active ? "orc-bird 8s linear infinite" : "none"}; }
        .orc-sway  { animation: ${active ? "orc-sway 6s ease-in-out infinite" : "none"}; }
      `}</style>

      <svg
        ref={ref}
        viewBox={`0 0 ${W} ${H}`}
        width="100%"
        preserveAspectRatio="xMidYMid meet"
        aria-hidden="true"
        style={{ display: "block", maxHeight: 540 }}
      >
        <defs>
          {/* Crisp autumn sky */}
          <linearGradient id="orc-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#8ab4d0" />
            <stop offset="55%"  stopColor="#b8d0e0" />
            <stop offset="100%" stopColor="#d0dce8" />
          </linearGradient>
          {/* Far hill */}
          <linearGradient id="orc-hill1" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#6a8898" />
            <stop offset="100%" stopColor="#5a7888" />
          </linearGradient>
          {/* Mid hill */}
          <linearGradient id="orc-hill2" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#7a9048" />
            <stop offset="100%" stopColor="#5a7030" />
          </linearGradient>
          {/* Near hill */}
          <linearGradient id="orc-hill3" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#8a9838" />
            <stop offset="100%" stopColor="#6a7828" />
          </linearGradient>
          {/* Ground near */}
          <linearGradient id="orc-ground" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#9aac40" />
            <stop offset="100%" stopColor="#708230" />
          </linearGradient>
          {/* Path grass */}
          <linearGradient id="orc-path" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#b8c448" />
            <stop offset="100%" stopColor="#8a9838" />
          </linearGradient>
          {/* Apple basket wicker */}
          <linearGradient id="orc-basket" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#c89840" />
            <stop offset="100%" stopColor="#8a6018" />
          </linearGradient>
          {/* Mist */}
          <linearGradient id="orc-mist-g" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%"   stopColor="#e0e8f0" stopOpacity="0" />
            <stop offset="20%"  stopColor="#e0e8f0" stopOpacity="1" />
            <stop offset="80%"  stopColor="#e0e8f0" stopOpacity="1" />
            <stop offset="100%" stopColor="#e0e8f0" stopOpacity="0" />
          </linearGradient>
          {/* Sun glow */}
          <radialGradient id="orc-sun" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="#fff8d0" stopOpacity="0.85" />
            <stop offset="40%"  stopColor="#f8e080" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#e8c040" stopOpacity="0"   />
          </radialGradient>
          {/* Soft filter */}
          <filter id="orc-blur">
            <feGaussianBlur in="SourceGraphic" stdDeviation="6" />
          </filter>
          <filter id="orc-blur-sm">
            <feGaussianBlur in="SourceGraphic" stdDeviation="2.5" />
          </filter>
        </defs>

        {/* Sky */}
        <rect x={0} y={0} width={W} height={HORIZON_Y + 20} fill="url(#orc-sky)" />

        {/* Sun behind morning haze */}
        <circle cx={SUN_CX} cy={SUN_CY} r={56} fill="url(#orc-sun)"
          filter="url(#orc-blur)"
          style={{ opacity: active ? 1 : 0, transition: tr(0.06) }}
        />
        <circle cx={SUN_CX} cy={SUN_CY} r={26} fill="#fff8c0" opacity={0.7}
          style={{ opacity: active ? 0.7 : 0, transition: tr(0.07) }}
        />

        {/* Birds */}
        {BIRDS.map(([bx, by, bs], i) => (
          <g key={i}
            className="orc-bird"
            style={{
              animationDelay: `${i * 0.6}s`,
              transformOrigin: `${bx}px ${by}px`,
              opacity: active ? 0.7 : 0,
              transition: tr(0.1),
            }}
          >
            <path
              d={`M ${bx - 8 * bs},${by} Q ${bx - 4 * bs},${by - 5 * bs} ${bx},${by + 1 * bs} Q ${bx + 4 * bs},${by - 5 * bs} ${bx + 8 * bs},${by}`}
              fill="none" stroke="#4a5060" strokeWidth={1.5 * bs} strokeLinecap="round"
            />
          </g>
        ))}

        {/* Hill layers */}
        <path d={HILL1_D} fill="url(#orc-hill1)"
          style={{ opacity: active ? 1 : 0, transition: tr(0.07) }}
        />
        <path d={HILL2_D} fill="url(#orc-hill2)"
          style={{ opacity: active ? 1 : 0, transition: tr(0.08) }}
        />
        <path d={HILL3_D} fill="url(#orc-hill3)"
          style={{ opacity: active ? 1 : 0, transition: tr(0.09) }}
        />

        {/* Ground */}
        <rect x={0} y={300} width={W} height={H - 300} fill="url(#orc-ground)" />

        {/* Center path / grass aisle */}
        <path d={PATH_D} fill="url(#orc-path)"
          style={{ opacity: active ? 0.75 : 0, transition: tr(0.12) }}
        />

        {/* Valley mist bands */}
        {VALLEY_MIST.map((m, i) => (
          <ellipse key={i}
            cx={m.cx} cy={m.cy} rx={m.rx} ry={m.ry}
            fill="url(#orc-mist-g)"
            style={{
              ["--mo" as string]: 0.45,
              animation: active
                ? `orc-mist ${7 + i * 1.2}s ease-in-out ${m.delay} infinite`
                : "none",
              opacity: active ? 0.45 : 0,
              transition: tr(0.14 + i * 0.04),
            }}
          />
        ))}

        {/* ─── APPLE TREES ─── */}
        {ALL_TREES.map((tree, ti) => {
          const isFar  = ti < ROW_FAR.length;
          const isMid  = ti < ROW_FAR.length + ROW_MID.length && !isFar;
          const delay  = 0.08 + (isFar ? 0 : isMid ? 0.06 : 0.12) + (ti % 8) * 0.015;
          const baseOpacity = isFar ? 0.78 : isMid ? 0.88 : 0.96;
          return (
            <g key={ti}
              className={!isFar ? "orc-sway" : ""}
              style={{
                transformOrigin: `${tree.cx}px ${tree.groundY}px`,
                animationDelay: `${(ti * 0.4) % 3}s`,
                opacity: active ? baseOpacity : 0,
                transition: tr(delay),
              }}
            >
              {/* Trunk */}
              <line
                x1={tree.cx} y1={tree.groundY}
                x2={tree.cx + (ti % 5 - 2) * 2} y2={tree.groundY - tree.trunkH}
                stroke="#5a3010"
                strokeWidth={tree.trunkW}
                strokeLinecap="round"
              />
              {/* Canopy — layered ellipses for volume */}
              <ellipse
                cx={tree.cx - tree.canopyRx * 0.22}
                cy={tree.groundY - tree.trunkH - tree.canopyRy * 0.6}
                rx={tree.canopyRx * 0.75} ry={tree.canopyRy * 0.8}
                fill={tree.shade} opacity={0.82}
              />
              <ellipse
                cx={tree.cx + tree.canopyRx * 0.18}
                cy={tree.groundY - tree.trunkH - tree.canopyRy * 0.55}
                rx={tree.canopyRx * 0.7} ry={tree.canopyRy * 0.75}
                fill={tree.shade} opacity={0.78}
              />
              <ellipse
                cx={tree.cx}
                cy={tree.groundY - tree.trunkH - tree.canopyRy}
                rx={tree.canopyRx} ry={tree.canopyRy}
                fill={tree.shade}
              />
              {/* Highlight on top */}
              <ellipse
                cx={tree.cx - tree.canopyRx * 0.15}
                cy={tree.groundY - tree.trunkH - tree.canopyRy * 1.12}
                rx={tree.canopyRx * 0.4} ry={tree.canopyRy * 0.3}
                fill="#8ab838" opacity={0.38}
              />
              {/* Red apples */}
              {tree.apples.map(([ax, ay, ar], ai) => (
                <circle key={ai} cx={ax} cy={ay} r={ar}
                  fill={ai % 3 === 0 ? "#c02808" : ai % 3 === 1 ? "#d83010" : "#a02008"}
                  opacity={0.9}
                />
              ))}
            </g>
          );
        })}

        {/* ─── HARVEST LADDER ─── */}
        <g style={{ opacity: active ? 1 : 0, transition: tr(0.32) }}>
          {/* Left rail */}
          <line x1={LADDER_BOT_X - 8} y1={LADDER_BOT_Y}
            x2={LADDER_TOP_X - 8} y2={LADDER_TOP_Y}
            stroke="#8a5a20" strokeWidth={5} strokeLinecap="round"
          />
          {/* Right rail */}
          <line x1={LADDER_BOT_X + 8} y1={LADDER_BOT_Y}
            x2={LADDER_TOP_X + 8} y2={LADDER_TOP_Y}
            stroke="#7a4e18" strokeWidth={5} strokeLinecap="round"
          />
          {/* Rungs */}
          {Array.from({ length: LADDER_RUNGS }, (_, i) => {
            const t  = (i + 0.5) / LADDER_RUNGS;
            const lx = Math.round(LADDER_BOT_X - 8 + (LADDER_TOP_X - 8 - (LADDER_BOT_X - 8)) * t);
            const rx = Math.round(LADDER_BOT_X + 8 + (LADDER_TOP_X + 8 - (LADDER_BOT_X + 8)) * t);
            const ry = Math.round(LADDER_BOT_Y + (LADDER_TOP_Y - LADDER_BOT_Y) * t);
            return (
              <line key={i} x1={lx} y1={ry} x2={rx} y2={ry}
                stroke="#9a6828" strokeWidth={3} strokeLinecap="round"
              />
            );
          })}
        </g>

        {/* ─── APPLE BASKETS ─── */}
        {BASKETS.map(([bcx, bgy, br], i) => (
          <g key={i}
            style={{ opacity: active ? 0.92 : 0, transition: tr(0.28 + i * 0.05) }}
          >
            {/* Basket body */}
            <path
              d={`M ${bcx - br},${bgy - 4} L ${bcx - br + 4},${bgy - 28} L ${bcx + br - 4},${bgy - 28} L ${bcx + br},${bgy - 4} Z`}
              fill="url(#orc-basket)"
            />
            {/* Weave horizontal lines */}
            {[8, 16, 22].map((oy, wi) => (
              <line key={wi}
                x1={bcx - br + 3} y1={bgy - oy}
                x2={bcx + br - 3} y2={bgy - oy}
                stroke="#7a4818" strokeWidth={1.5} opacity={0.5}
              />
            ))}
            {/* Rim */}
            <line x1={bcx - br - 2} y1={bgy - 28} x2={bcx + br + 2} y2={bgy - 28}
              stroke="#c8a040" strokeWidth={3} />
            {/* Apples heaped on top */}
            {Array.from({ length: 5 }, (_, ai) => {
              const ax = bcx - br + 4 + ai * (br * 2 - 8) / 4;
              const ay = bgy - 28 - (ai % 2 === 0 ? 7 : 12);
              return (
                <circle key={ai} cx={ax} cy={ay} r={7 - (ai % 2)}
                  fill={ai % 3 === 0 ? "#c02808" : ai % 3 === 1 ? "#d83010" : "#a82010"}
                />
              );
            })}
          </g>
        ))}

        {/* ─── FALLEN APPLES ─── */}
        {FALLEN_APPLES.map(([ax, ay, ar, ac], i) => (
          <g key={i}
            style={{ opacity: active ? 0.88 : 0, transition: tr(0.3 + i * 0.02) }}
          >
            <circle cx={ax} cy={ay} r={ar} fill={ac} />
            <circle cx={ax - ar * 0.3} cy={ay - ar * 0.28} r={ar * 0.32}
              fill="#e84020" opacity={0.35} />
            <line x1={ax} y1={ay - ar} x2={ax + 2} y2={ay - ar - 4}
              stroke="#4a2808" strokeWidth={1} />
          </g>
        ))}

        {/* ─── STONE WALL ─── */}
        <g style={{ opacity: active ? 1 : 0, transition: tr(0.24) }}>
          {/* Wall base shadow */}
          <rect x={878} y={436} width={W - 878} height={8}
            fill="#1a1810" opacity={0.25}
          />
          {WALL_STONES.map(([sx, sy, sw, sh, shade], i) => (
            <rect key={i}
              x={sx + 1} y={sy + 1} width={sw - 2} height={sh - 2}
              fill={`rgb(${108 + shade * 3},${98 + shade * 2},${82 + shade})`}
              rx={2}
            />
          ))}
          {/* Mortar joints */}
          {WALL_STONES.map(([sx, sy, sw, sh], i) => (
            <rect key={`m${i}`}
              x={sx} y={sy} width={sw} height={sh}
              fill="none" stroke="#5a5040" strokeWidth={1.5} opacity={0.4}
            />
          ))}
          {/* Cap stones */}
          <path d={WALL_CAP_D} fill="#c0b0a0" opacity={0.7} />
        </g>

        {/* ─── GROUND TUFTS ─── */}
        {GROUND_TUFTS.map(([gx, gy], i) => (
          <ellipse key={i} cx={gx} cy={gy} rx={6 + (i % 3) * 2} ry={3}
            fill="#5a7028" opacity={0.5}
            style={{ opacity: active ? 0.5 : 0, transition: tr(0.1) }}
          />
        ))}

        {/* Caption */}
        <text
          x={W / 2} y={H - 14}
          textAnchor="middle"
          fontFamily="'Georgia', 'Times New Roman', serif"
          fontSize={11} fill="#4a6828"
          letterSpacing={5}
          style={{ opacity: active ? 0.65 : 0, transition: tr(1.0) }}
        >
          HARVEST SEASON · SHREWSBURY, MA · ROUTE 9 CORRIDOR
        </text>
      </svg>
    </section>
  );
}
