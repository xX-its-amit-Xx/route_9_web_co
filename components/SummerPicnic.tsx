"use client";
import { useEffect, useRef, useState } from "react";

const W = 1440;
const H = 560;

// ─── Scene geometry ───────────────────────────────────────────────────────────
const HORIZON_Y = 215;
const GROUND_Y  = H;

// ─── Sky gradient stop values (golden-hour / dusk) ────────────────────────────
// Deep violet at top → rose-peach at horizon

// ─── Elm trees (large, spreading canopy) ──────────────────────────────────────
type ElmTree = {
  cx: number; baseY: number; trunkH: number; trunkW: number;
  canopies: [number, number, number, number, string][];  // [cx, cy, rx, ry, shade]
};

function makeElm(cx: number, baseY: number, trunkH: number, trunkW: number, lean: number, shade1: string, shade2: string): ElmTree {
  return {
    cx, baseY, trunkH, trunkW,
    canopies: [
      [cx + lean,           baseY - trunkH - 30, 62, 44, shade1],
      [cx + lean - 42,      baseY - trunkH + 4,  50, 36, shade2],
      [cx + lean + 44,      baseY - trunkH + 8,  52, 34, shade2],
      [cx + lean - 22,      baseY - trunkH - 60, 44, 30, shade1],
      [cx + lean + 26,      baseY - trunkH - 56, 42, 28, shade1],
      [cx + lean,           baseY - trunkH - 82, 36, 24, shade2],
    ],
  };
}

const ELM_TREES: ElmTree[] = [
  makeElm(82,  HORIZON_Y + 18, 182, 12,  -8, "#2e5820", "#3a6828"),
  makeElm(195, HORIZON_Y + 12, 195, 14,  -6, "#365e24", "#4a7030"),
  makeElm(320, HORIZON_Y + 16, 168, 10,  -4, "#2e5820", "#3a6828"),
  makeElm(1120,HORIZON_Y + 14, 172, 11,   5, "#2e5820", "#3a6828"),
  makeElm(1250,HORIZON_Y + 10, 196, 14,   7, "#365e24", "#4a7030"),
  makeElm(1370,HORIZON_Y + 16, 175, 12,   6, "#2e5820", "#3a6828"),
];

// ─── Dappled shadow patches under trees ───────────────────────────────────────
type Shadow = { cx: number; cy: number; rx: number; ry: number; opacity: number };
const SHADOWS: Shadow[] = [
  { cx: 145, cy: HORIZON_Y + 55, rx: 110, ry: 28, opacity: 0.18 },
  { cx: 195, cy: HORIZON_Y + 80, rx: 95,  ry: 22, opacity: 0.14 },
  { cx: 280, cy: HORIZON_Y + 60, rx: 85,  ry: 20, opacity: 0.12 },
  { cx: 1210,cy: HORIZON_Y + 52, rx: 100, ry: 26, opacity: 0.16 },
  { cx: 1310,cy: HORIZON_Y + 75, rx: 90,  ry: 22, opacity: 0.13 },
];

// ─── Picnic blankets ──────────────────────────────────────────────────────────
type Blanket = {
  x: number; y: number; w: number; h: number; skew: number;
  color1: string; color2: string;  // plaid colors
  stripes: number;
};
const BLANKETS: Blanket[] = [
  { x: 420, y: HORIZON_Y + 65, w: 148, h: 88, skew: -4, color1: "#c83228", color2: "#e8e0c8", stripes: 5 },
  { x: 590, y: HORIZON_Y + 80, w: 128, h: 76, skew:  6, color1: "#1a4a8c", color2: "#d8d0b8", stripes: 4 },
  { x: 780, y: HORIZON_Y + 70, w: 140, h: 82, skew: -3, color1: "#2a6838", color2: "#ece8d4", stripes: 5 },
  { x: 960, y: HORIZON_Y + 90, w: 112, h: 68, skew:  5, color1: "#8b4513", color2: "#e8e0c8", stripes: 4 },
];

// ─── Picnic food items on blankets ────────────────────────────────────────────
type FoodItem = { cx: number; cy: number; type: "basket" | "pie" | "bottle" | "bowl" };
const FOOD_ITEMS: FoodItem[] = [
  { cx: 496, cy: HORIZON_Y + 82,  type: "basket"  },
  { cx: 536, cy: HORIZON_Y + 92,  type: "pie"     },
  { cx: 654, cy: HORIZON_Y + 92,  type: "bottle"  },
  { cx: 686, cy: HORIZON_Y + 102, type: "bowl"    },
  { cx: 852, cy: HORIZON_Y + 85,  type: "basket"  },
  { cx: 888, cy: HORIZON_Y + 94,  type: "pie"     },
  { cx: 1014,cy: HORIZON_Y + 100, type: "bottle"  },
];

// ─── People on blankets (picnickers) ─────────────────────────────────────────
type Picnicker = { x: number; y: number; pose: "seated" | "reclining"; color: string };
const PICNICKERS: Picnicker[] = [
  { x: 448,  y: HORIZON_Y + 70,  pose: "seated",    color: "#2a1a0a" },
  { x: 472,  y: HORIZON_Y + 68,  pose: "reclining", color: "#8a2010" },
  { x: 618,  y: HORIZON_Y + 78,  pose: "seated",    color: "#1a3a6a" },
  { x: 640,  y: HORIZON_Y + 76,  pose: "reclining", color: "#3a2a1a" },
  { x: 808,  y: HORIZON_Y + 72,  pose: "seated",    color: "#2a1a0a" },
  { x: 834,  y: HORIZON_Y + 74,  pose: "seated",    color: "#8b3010" },
  { x: 992,  y: HORIZON_Y + 88,  pose: "reclining", color: "#2a3a1a" },
];

// ─── Kite ─────────────────────────────────────────────────────────────────────
const KITE_CX = 860;
const KITE_CY = 72;
const KITE_W  = 52;
const KITE_H  = 66;

// Kite string (catenary from kite to child's hand)
// Child stands at (750, HORIZON_Y + 42)
const KITE_STRING_PTS = [
  [KITE_CX, KITE_CY + KITE_H / 2],
  [KITE_CX - 22, KITE_CY + KITE_H / 2 + 40],
  [760, HORIZON_Y + 30],
  [748, HORIZON_Y + 42],
] as [number, number][];

// Kite tail (bow-tie ribbon bows)
type KiteTailBow = { x: number; y: number };
const KITE_TAIL: KiteTailBow[] = Array.from({ length: 6 }, (_, i) => ({
  x: KITE_CX - 2 + i * 4,
  y: KITE_CY + KITE_H / 2 + 14 + i * 18,
}));
const KITE_COLORS = ["#c83228", "#e8a020", "#1a4a8c", "#2a6838", "#8b2a8b"];

// ─── Child flying kite ────────────────────────────────────────────────────────
const CHILD_X = 748;
const CHILD_Y = HORIZON_Y + 42;

// ─── Lemonade stand ──────────────────────────────────────────────────────────
const LS_X = 1020;
const LS_Y = HORIZON_Y + 48;
const LS_W = 130;
const LS_H = 82;

// ─── Fireflies ────────────────────────────────────────────────────────────────
type Firefly = { cx: number; cy: number; delay: number; rx: number; ry: number };
const FIREFLIES: Firefly[] = Array.from({ length: 32 }, (_, i) => {
  const ang = i * 137.508 * Math.PI / 180;
  const r   = Math.sqrt(i / 32) * 580;
  return {
    cx:    ((600 + Math.cos(ang) * r) % W + W) % W,
    cy:    HORIZON_Y + 40 + (i * 23) % (H - HORIZON_Y - 60),
    delay: (i * 0.38) % 3.5,
    rx:    3 + i % 3,
    ry:    2 + i % 2,
  };
});

// ─── Background common (far park) ────────────────────────────────────────────
// Distant trees and gazebo on far edge of the common
const FAR_TREES_D = `
  M0,${HORIZON_Y + 5} Q180,${HORIZON_Y - 20} 360,${HORIZON_Y - 8}
  Q540,${HORIZON_Y + 2} 720,${HORIZON_Y - 14}
  Q900,${HORIZON_Y + 4} 1080,${HORIZON_Y - 18}
  Q1260,${HORIZON_Y + 0} 1440,${HORIZON_Y - 10}
  L1440,${HORIZON_Y + 14} L0,${HORIZON_Y + 14} Z
`;

// ─── Gazebo (far center) ──────────────────────────────────────────────────────
const GAZ_CX = 720;
const GAZ_Y  = HORIZON_Y - 4;
const GAZ_W  = 68;
const GAZ_H  = 52;

// ─── Clouds (golden-hour lit) ─────────────────────────────────────────────────
type Cloud = { cx: number; cy: number; parts: [number, number, number][] };
const CLOUDS: Cloud[] = [
  { cx: 280,  cy: 62,  parts: [[-44,0,30],[0,-16,38],[46,0,28],[-18,16,22],[22,14,20]] },
  { cx: 1100, cy: 80,  parts: [[-32,0,26],[0,-14,32],[38,0,24],[12,12,18]]              },
  { cx: 680,  cy: 44,  parts: [[-26,0,20],[0,-12,26],[30,0,20],[8,10,16]]               },
];

export function SummerPicnic() {
  const ref = useRef<SVGSVGElement>(null);
  const [active, setActive] = useState(false);
  const [kitePhase, setKitePhase] = useState(0);
  const [fireflyPhase, setFireflyPhase] = useState(0);

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
    let t = 0;
    const tick = setInterval(() => {
      t += 0.045;
      setKitePhase(t);
      setFireflyPhase(t);
    }, 33);
    return () => clearInterval(tick);
  }, [active]);

  const tr = (d: number) =>
    active ? `opacity 0.7s ease ${d}s, transform 0.7s ease ${d}s` : "none";

  // Kite drift
  const kiteDx = Math.sin(kitePhase * 0.7) * 14;
  const kiteDy = Math.sin(kitePhase * 1.1) * 8;
  const kiteRot = Math.sin(kitePhase * 0.9) * 12;

  return (
    <section style={{ background: "#5a2840", overflow: "hidden", position: "relative" }}>
      <style>{`
        @keyframes sp-firefly {
          0%,100% { opacity: 0.05; r: 2; }
          40%,60% { opacity: 0.9;  r: 4; }
        }
        @keyframes sp-leaf-dapple {
          0%,100% { opacity: 0.14; }
          50%     { opacity: 0.22; }
        }
        @keyframes sp-flag-wave {
          0%,100% { transform: skewX(0deg); }
          50%     { transform: skewX(-8deg); }
        }
        @keyframes sp-cloud-drift {
          from { transform: translateX(0); }
          to   { transform: translateX(44px); }
        }
        @keyframes sp-lemonade-pour {
          0%,85%,100% { transform: translateY(0); opacity: 0; }
          88%         { transform: translateY(0); opacity: 0.7; }
          98%         { transform: translateY(20px); opacity: 0.5; }
        }
        .sp-leaf-dapple { animation: sp-leaf-dapple 4s ease-in-out infinite; }
        .sp-flag        { animation: sp-flag-wave 2.5s ease-in-out infinite; transform-origin: left center; }
        .sp-cloud       { animation: sp-cloud-drift 30s linear infinite; }
        .sp-lemonade    { animation: sp-lemonade-pour 3s ease-in infinite; }
      `}</style>
      <svg
        ref={ref}
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="xMidYMid slice"
        style={{ display: "block", width: "100%", height: "auto", minHeight: 320 }}
        aria-label="Shrewsbury town common summer picnic at golden-hour dusk with kite, fireflies, and lemonade stand"
        role="img"
      >
        <defs>
          {/* Dusk sky */}
          <linearGradient id="sp-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#2a1a38" />
            <stop offset="22%"  stopColor="#5a2848" />
            <stop offset="48%"  stopColor="#c85828" />
            <stop offset="68%"  stopColor="#e89040" />
            <stop offset="84%"  stopColor="#f0b860" />
            <stop offset="100%" stopColor="#f8d880" />
          </linearGradient>
          {/* Ground */}
          <linearGradient id="sp-ground" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#8aaa58" />
            <stop offset="35%"  stopColor="#7a9848" />
            <stop offset="100%" stopColor="#5a7830" />
          </linearGradient>
          {/* Ground in shadow */}
          <linearGradient id="sp-ground-shadow" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#6a8840" />
            <stop offset="100%" stopColor="#4a6824" />
          </linearGradient>
          {/* Firefly glow */}
          <radialGradient id="sp-ff-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="#d8f060" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#a8c020" stopOpacity="0" />
          </radialGradient>
          {/* Sun horizon glow */}
          <radialGradient id="sp-sun-glow" cx="50%" cy="100%" r="60%">
            <stop offset="0%"   stopColor="#f8d060" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#e06020" stopOpacity="0" />
          </radialGradient>
          {/* Lemonade yellow */}
          <linearGradient id="sp-lemon" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#f8e060" />
            <stop offset="100%" stopColor="#e8c020" />
          </linearGradient>
          <clipPath id="sp-clip">
            <rect x="0" y="0" width={W} height={H} />
          </clipPath>
        </defs>

        {/* ── Dusk sky ── */}
        <rect x="0" y="0" width={W} height={H} fill="url(#sp-sky)" />

        {/* ── Horizon sun glow ── */}
        <ellipse cx={W * 0.42} cy={HORIZON_Y + 2} rx={380} ry={88}
          fill="url(#sp-sun-glow)" />
        <circle cx={W * 0.42} cy={HORIZON_Y - 2} r={30}
          fill="#fff8c0" opacity="0.88" />

        {/* ── Golden clouds ── */}
        {CLOUDS.map((cl, i) => (
          <g key={i} className="sp-cloud"
             style={{ animationDelay: `${i * 8}s`, animationDuration: `${28 + i * 6}s` }}>
            {cl.parts.map(([dx, dy, r], pi) => (
              <ellipse key={pi} cx={cl.cx + dx} cy={cl.cy + dy} rx={r} ry={r * 0.52}
                fill="#f8d08a" opacity={0.65 + pi * 0.04} />
            ))}
            {/* Lit bottom edge */}
            {cl.parts.slice(0, 2).map(([dx, dy, r], pi) => (
              <ellipse key={`l-${pi}`} cx={cl.cx + dx} cy={cl.cy + dy + r * 0.38} rx={r * 0.88} ry={r * 0.22}
                fill="#fff0a0" opacity="0.35" />
            ))}
          </g>
        ))}

        {/* ── Far treeline silhouette ── */}
        {Array.from({ length: 42 }, (_, i) => {
          const tx = i * 36 - 10;
          const th = 28 + (i * 9) % 24;
          const shade = i % 3 === 0 ? "#2a4020" : i % 3 === 1 ? "#1e3018" : "#344828";
          return (
            <ellipse key={i} cx={tx + 10} cy={HORIZON_Y - th * 0.55}
              rx={14 + i % 10} ry={th * 0.6}
              fill={shade} opacity="0.82" />
          );
        })}

        {/* ── Gazebo (far center) ── */}
        <g style={{ opacity: active ? 0.7 : 0, transition: tr(0.3) }}>
          {/* Base */}
          <rect x={GAZ_CX - GAZ_W / 2} y={GAZ_Y - GAZ_H + 8} width={GAZ_W} height={GAZ_H - 8}
            fill="#d8d0c0" stroke="#a8a090" strokeWidth="1" />
          {/* Roof */}
          <polygon
            points={`${GAZ_CX - GAZ_W / 2 - 6},${GAZ_Y - GAZ_H + 8} ${GAZ_CX},${GAZ_Y - GAZ_H - 18} ${GAZ_CX + GAZ_W / 2 + 6},${GAZ_Y - GAZ_H + 8}`}
            fill="#8a7060" />
          {/* Columns */}
          {[GAZ_CX - 24, GAZ_CX, GAZ_CX + 24].map((gx, i) => (
            <line key={i} x1={gx} y1={GAZ_Y} x2={gx} y2={GAZ_Y - GAZ_H + 8}
              stroke="#c8c0b0" strokeWidth="4" />
          ))}
          {/* Railing */}
          <rect x={GAZ_CX - GAZ_W / 2} y={GAZ_Y - 18} width={GAZ_W} height={5}
            fill="#c0b8a8" />
          <text x={GAZ_CX} y={GAZ_Y - 22}
            textAnchor="middle" fontFamily="'Georgia', serif" fontSize="7"
            fill="#8a7060" opacity="0.6" letterSpacing="1">SHREWSBURY COMMON</text>
        </g>

        {/* ── Ground ── */}
        <rect x="0" y={HORIZON_Y + 14} width={W} height={H - HORIZON_Y - 14}
          fill="url(#sp-ground)" />
        {/* Ground color shift toward camera */}
        <path
          d={`M0,${HORIZON_Y + 60} Q${W / 2},${HORIZON_Y + 50} ${W},${HORIZON_Y + 58} L${W},${H} L0,${H} Z`}
          fill="url(#sp-ground-shadow)"
        />

        {/* ── Dappled shadows under trees ── */}
        {SHADOWS.map((sh, i) => (
          <ellipse key={i} cx={sh.cx} cy={sh.cy} rx={sh.rx} ry={sh.ry}
            fill="#2a4020" className="sp-leaf-dapple"
            style={{ animationDelay: `${i * 0.6}s`, opacity: sh.opacity }}
          />
        ))}
        {/* Additional scattered small dapple dots */}
        {Array.from({ length: 22 }, (_, i) => (
          <ellipse key={i}
            cx={88 + i * 14} cy={HORIZON_Y + 44 + (i % 4) * 16}
            rx={5 + i % 6} ry={3 + i % 3}
            fill="#2a4020" opacity={0.08 + (i % 3) * 0.03}
          />
        ))}

        {/* ── Elm trees (with glow at crowns from dusk light) ── */}
        {ELM_TREES.map((et, i) => (
          <g key={i} style={{
            opacity: active ? 1 : 0,
            transform: active ? "translateY(0)" : "translateY(14px)",
            transition: tr(0.18 + i * 0.04),
          }}>
            {/* Trunk */}
            <line x1={et.cx} y1={et.baseY} x2={et.cx} y2={et.baseY - et.trunkH}
              stroke="#2a1a0a" strokeWidth={et.trunkW} strokeLinecap="round" />
            {/* Fork */}
            <line x1={et.cx} y1={et.baseY - et.trunkH * 0.6}
              x2={et.cx - et.trunkW * 3} y2={et.baseY - et.trunkH * 0.88}
              stroke="#2a1a0a" strokeWidth={et.trunkW * 0.55} strokeLinecap="round" />
            <line x1={et.cx} y1={et.baseY - et.trunkH * 0.6}
              x2={et.cx + et.trunkW * 2.8} y2={et.baseY - et.trunkH * 0.85}
              stroke="#2a1a0a" strokeWidth={et.trunkW * 0.5} strokeLinecap="round" />
            {/* Canopy blobs */}
            {et.canopies.map(([ecx, ecy, erx, ery, shade], ci) => (
              <ellipse key={ci} cx={ecx} cy={ecy} rx={erx} ry={ery}
                fill={shade} opacity={ci < 2 ? 0.92 : 0.82} />
            ))}
            {/* Golden rim light on top of canopy */}
            <ellipse cx={et.cx + (et.cx > W / 2 ? 10 : -10)} cy={et.baseY - et.trunkH - 80}
              rx={28} ry={12}
              fill="#f0c060" opacity="0.22" />
          </g>
        ))}

        {/* ── Picnic blankets ── */}
        {BLANKETS.map((bl, i) => (
          <g key={i} style={{
            opacity: active ? 1 : 0,
            transform: active ? "translateY(0)" : "translateY(12px)",
            transition: tr(0.28 + i * 0.06),
          }}>
            {/* Blanket base */}
            <rect x={bl.x} y={bl.y} width={bl.w} height={bl.h}
              rx="3" fill={bl.color2}
              style={{ transform: `skewX(${bl.skew}deg)`, transformOrigin: `${bl.x + bl.w / 2}px ${bl.y + bl.h}px` }}
            />
            {/* Plaid stripes (vertical) */}
            {Array.from({ length: bl.stripes }, (_, si) => (
              <line key={si}
                x1={bl.x + (bl.w / bl.stripes) * (si + 0.5)} y1={bl.y}
                x2={bl.x + (bl.w / bl.stripes) * (si + 0.5) + bl.skew * bl.h / 80} y2={bl.y + bl.h}
                stroke={bl.color1} strokeWidth="5" opacity="0.45" />
            ))}
            {/* Plaid stripes (horizontal) */}
            {Array.from({ length: 3 }, (_, ri) => (
              <line key={ri}
                x1={bl.x + bl.skew * (bl.h / 3 * ri) / 100} y1={bl.y + (bl.h / 3) * (ri + 0.5)}
                x2={bl.x + bl.w + bl.skew * (bl.h / 3 * ri) / 100} y2={bl.y + (bl.h / 3) * (ri + 0.5)}
                stroke={bl.color1} strokeWidth="5" opacity="0.35" />
            ))}
            {/* Corner tassels */}
            {[0, bl.w].map((ox, ti) => (
              <g key={ti}>
                {[0, 6, 12].map(ty => (
                  <line key={ty}
                    x1={bl.x + ox} y1={bl.y + bl.h}
                    x2={bl.x + ox + (ti === 0 ? -5 : 5)} y2={bl.y + bl.h + 8 + ty}
                    stroke={bl.color1} strokeWidth="1.5" opacity="0.7" />
                ))}
              </g>
            ))}
          </g>
        ))}

        {/* ── Food items ── */}
        {FOOD_ITEMS.map((fi, i) => (
          <g key={i} style={{ opacity: active ? 1 : 0, transition: tr(0.35 + i * 0.04) }}>
            {fi.type === "basket" && (
              <g>
                <ellipse cx={fi.cx} cy={fi.cy + 8} rx={16} ry={10} fill="#8a6030" />
                <rect x={fi.cx - 14} y={fi.cy} width={28} height={12} rx="2" fill="#a07040" stroke="#7a5020" strokeWidth="1" />
                {/* Weave lines */}
                {[-8, 0, 8].map(bx => <line key={bx} x1={fi.cx + bx} y1={fi.cy} x2={fi.cx + bx} y2={fi.cy + 12} stroke="#7a5020" strokeWidth="1.5" opacity="0.5" />)}
                <path d={`M${fi.cx - 12},${fi.cy} Q${fi.cx},${fi.cy - 16} ${fi.cx + 12},${fi.cy}`} fill="none" stroke="#7a5020" strokeWidth="3" />
              </g>
            )}
            {fi.type === "pie" && (
              <g>
                <ellipse cx={fi.cx} cy={fi.cy + 5} rx={14} ry={9} fill="#c8902a" />
                <ellipse cx={fi.cx} cy={fi.cy} rx={14} ry={7} fill="#d8a840" />
                <ellipse cx={fi.cx} cy={fi.cy} rx={10} ry={5} fill="#e8b840" opacity="0.7" />
              </g>
            )}
            {fi.type === "bottle" && (
              <g>
                <rect x={fi.cx - 4} y={fi.cy - 16} width={8} height={24} rx="2" fill="#c8d860" stroke="#a8b840" strokeWidth="1" />
                <rect x={fi.cx - 3} y={fi.cy - 22} width={6} height={8} rx="1" fill="#a8c040" />
                <ellipse cx={fi.cx} cy={fi.cy + 8} rx={4} ry={2} fill="#d8e870" opacity="0.5" />
              </g>
            )}
            {fi.type === "bowl" && (
              <g>
                <ellipse cx={fi.cx} cy={fi.cy + 4} rx={16} ry={7} fill="#e8c880" />
                <ellipse cx={fi.cx} cy={fi.cy} rx={16} ry={7} fill="#f0d890" />
                <ellipse cx={fi.cx} cy={fi.cy} rx={12} ry={5} fill="#f8e8a0" opacity="0.7" />
              </g>
            )}
          </g>
        ))}

        {/* ── Picnickers ── */}
        {PICNICKERS.map((pc, i) => (
          <g key={i} style={{ opacity: active ? 1 : 0, transition: tr(0.3 + i * 0.04) }}>
            {pc.pose === "seated" ? (
              <g>
                {/* Body */}
                <ellipse cx={pc.x} cy={pc.y + 12} rx={11} ry={16} fill={pc.color} />
                {/* Head */}
                <circle cx={pc.x + 4} cy={pc.y - 6} r={10} fill={pc.color} />
                {/* Arm out */}
                <path d={`M${pc.x + 10},${pc.y + 4} Q${pc.x + 22},${pc.y + 10} ${pc.x + 18},${pc.y + 20}`}
                  fill="none" stroke={pc.color} strokeWidth="7" strokeLinecap="round" />
              </g>
            ) : (
              <g>
                {/* Reclining body */}
                <ellipse cx={pc.x + 16} cy={pc.y + 6} rx={26} ry={9} fill={pc.color} />
                {/* Head */}
                <circle cx={pc.x} cy={pc.y - 2} r={9} fill={pc.color} />
                {/* Raised arm */}
                <path d={`M${pc.x + 4},${pc.y + 2} Q${pc.x + 18},${pc.y - 14} ${pc.x + 26},${pc.y - 8}`}
                  fill="none" stroke={pc.color} strokeWidth="6" strokeLinecap="round" />
              </g>
            )}
          </g>
        ))}

        {/* ── Child flying kite ── */}
        <g style={{ opacity: active ? 1 : 0, transition: tr(0.38) }}>
          {/* Child body */}
          <rect x={CHILD_X - 6} y={CHILD_Y - 28} width={12} height={22} rx="2" fill="#1a4a8c" />
          <circle cx={CHILD_X} cy={CHILD_Y - 36} r={9} fill="#2a1a0a" />
          {/* Arm up holding string */}
          <line x1={CHILD_X + 8} y1={CHILD_Y - 26} x2={CHILD_X + 18} y2={CHILD_Y - 38}
            stroke="#1a4a8c" strokeWidth="6" strokeLinecap="round" />
          {/* Legs */}
          <line x1={CHILD_X - 3} y1={CHILD_Y - 6} x2={CHILD_X - 5} y2={CHILD_Y + 12}
            stroke="#c83228" strokeWidth="5" strokeLinecap="round" />
          <line x1={CHILD_X + 3} y1={CHILD_Y - 6} x2={CHILD_X + 6} y2={CHILD_Y + 12}
            stroke="#c83228" strokeWidth="5" strokeLinecap="round" />
        </g>

        {/* ── Kite string ── */}
        <polyline
          points={KITE_STRING_PTS.map(([x, y]) => `${x + kiteDx * 0.5},${y + kiteDy * 0.5}`).join(" ")}
          fill="none" stroke="#8a7050" strokeWidth="1.2" opacity="0.7"
          style={{ transition: "none" }}
        />

        {/* ── Kite (animated drift + tilt) ── */}
        <g style={{
          transform: `translate(${kiteDx}px, ${kiteDy}px) rotate(${kiteRot}deg)`,
          transformOrigin: `${KITE_CX}px ${KITE_CY + KITE_H / 2}px`,
          transition: "none",
        }}>
          {/* Diamond shape */}
          {KITE_COLORS.map((col, i) => {
            const q = i % 4;
            const qPts: [number, number][][] = [
              [[KITE_CX, KITE_CY], [KITE_CX - KITE_W / 2, KITE_CY + KITE_H * 0.4], [KITE_CX, KITE_CY + KITE_H * 0.4]],
              [[KITE_CX, KITE_CY], [KITE_CX + KITE_W / 2, KITE_CY + KITE_H * 0.4], [KITE_CX, KITE_CY + KITE_H * 0.4]],
              [[KITE_CX - KITE_W / 2, KITE_CY + KITE_H * 0.4], [KITE_CX, KITE_CY + KITE_H], [KITE_CX, KITE_CY + KITE_H * 0.4]],
              [[KITE_CX + KITE_W / 2, KITE_CY + KITE_H * 0.4], [KITE_CX, KITE_CY + KITE_H], [KITE_CX, KITE_CY + KITE_H * 0.4]],
            ];
            const pts = qPts[q] ?? qPts[0] ?? [];
            return (
              <polygon key={i}
                points={pts.map(([px, py]) => `${px},${py}`).join(" ")}
                fill={KITE_COLORS[q] ?? "#c83228"} opacity="0.9"
              />
            );
          })}
          {/* Frame spars */}
          <line x1={KITE_CX - KITE_W / 2} y1={KITE_CY + KITE_H * 0.4} x2={KITE_CX + KITE_W / 2} y2={KITE_CY + KITE_H * 0.4}
            stroke="#3a2810" strokeWidth="1.5" />
          <line x1={KITE_CX} y1={KITE_CY} x2={KITE_CX} y2={KITE_CY + KITE_H}
            stroke="#3a2810" strokeWidth="1.5" />
          {/* Tail bows */}
          {KITE_TAIL.map((tb, i) => (
            <g key={i}>
              <ellipse cx={tb.x} cy={tb.y} rx={8} ry={4}
                fill={KITE_COLORS[i % KITE_COLORS.length] ?? "#c83228"} opacity="0.8" />
            </g>
          ))}
        </g>

        {/* ── Lemonade stand ── */}
        <g style={{
          opacity: active ? 1 : 0,
          transform: active ? "translateY(0)" : "translateY(10px)",
          transition: tr(0.4),
        }}>
          {/* Stand frame */}
          <rect x={LS_X} y={LS_Y} width={LS_W} height={LS_H}
            fill="#c8a060" stroke="#8a6820" strokeWidth="1.5" />
          {/* Counter top */}
          <rect x={LS_X - 8} y={LS_Y} width={LS_W + 16} height={12}
            rx="2" fill="#d8b870" stroke="#9a7828" strokeWidth="1" />
          {/* Banner */}
          <rect x={LS_X - 4} y={LS_Y - 30} width={LS_W + 8} height={24}
            rx="3" fill="#f0e040" stroke="#c8b820" strokeWidth="1.5" />
          <text x={LS_X + LS_W / 2} y={LS_Y - 12}
            textAnchor="middle" fontFamily="'Georgia', serif"
            fontSize="12" fontWeight="bold" fill="#6a3810" letterSpacing="1">
            LEMONADE 5¢
          </text>
          {/* Pennant flags */}
          {Array.from({ length: 6 }, (_, i) => {
            const px = LS_X - 4 + i * (LS_W + 8) / 5;
            return (
              <polygon key={i}
                points={`${px},${LS_Y - 30} ${px + 10},${LS_Y - 30} ${px + 5},${LS_Y - 20}`}
                fill={KITE_COLORS[i % KITE_COLORS.length] ?? "#c83228"} className="sp-flag"
                style={{ animationDelay: `${i * 0.15}s` }} />
            );
          })}
          {/* Pitcher of lemonade */}
          <rect x={LS_X + 18} y={LS_Y - 24} width={22} height={30} rx="4"
            fill="url(#sp-lemon)" stroke="#c8a020" strokeWidth="1.5" />
          <ellipse cx={LS_X + 29} cy={LS_Y - 24} rx={11} ry={5} fill="#f8f0a0" />
          {/* Pour stream */}
          <rect x={LS_X + 27} y={LS_Y + 8} width={4} height={20} rx="2"
            fill="#f8e060" className="sp-lemonade" opacity="0.6" />
          {/* Glasses on counter */}
          {[60, 78, 96].map((gx, gi) => (
            <g key={gi}>
              <rect x={LS_X + gx} y={LS_Y - 20} width={12} height={18} rx="2"
                fill="#f8f0a0" stroke="#c8a820" strokeWidth="1" opacity="0.85" />
              <ellipse cx={LS_X + gx + 6} cy={LS_Y - 20} rx={6} ry={3} fill="#fffce0" />
            </g>
          ))}
          {/* Stand legs */}
          {[LS_X + 10, LS_X + LS_W - 10].map((lx, li) => (
            <line key={li} x1={lx} y1={LS_Y + LS_H} x2={lx} y2={LS_Y + LS_H + 28}
              stroke="#8a6820" strokeWidth="6" strokeLinecap="round" />
          ))}
          {/* Attendant child */}
          <rect x={LS_X + 50} y={LS_Y + 12} width={10} height={20} rx="1" fill="#8b2a8b" />
          <circle cx={LS_X + 55} cy={LS_Y + 4} r={9} fill="#2a1a0a" />
        </g>

        {/* ── Fireflies (twinkling) ── */}
        {FIREFLIES.map((ff, i) => {
          const glowing = Math.sin(fireflyPhase * 1.8 + ff.delay) > 0.5;
          return (
            <g key={i}>
              {/* Glow halo */}
              <ellipse cx={ff.cx} cy={ff.cy} rx={ff.rx * 4} ry={ff.ry * 4}
                fill="url(#sp-ff-glow)"
                style={{
                  opacity: glowing ? 0.5 : 0.03,
                  transition: "opacity 0.3s ease",
                }} />
              {/* Core dot */}
              <ellipse cx={ff.cx} cy={ff.cy} rx={ff.rx} ry={ff.ry}
                fill="#c8e820"
                style={{
                  opacity: glowing ? 0.92 : 0.05,
                  transition: "opacity 0.3s ease",
                }} />
            </g>
          );
        })}

        {/* ── Foreground grass (near) ── */}
        <path
          d={`M0,${H - 52} Q${W * 0.25},${H - 68} ${W * 0.5},${H - 55} Q${W * 0.75},${H - 44} ${W},${H - 60} L${W},${H} L0,${H} Z`}
          fill="#6a8840"
        />
        {/* Grass blades */}
        {Array.from({ length: 30 }, (_, i) => (
          <g key={i}>
            <line x1={i * 50 + 15} y1={H - 52} x2={i * 50 + 10} y2={H - 72 - i % 12}
              stroke="#7a9850" strokeWidth="2.5" strokeLinecap="round" />
            <line x1={i * 50 + 26} y1={H - 52} x2={i * 50 + 28} y2={H - 74 - i % 8}
              stroke="#6a8840" strokeWidth="2" strokeLinecap="round" />
          </g>
        ))}

        {/* ── Label ── */}
        <g style={{
          opacity: active ? 1 : 0,
          transform: active ? "translateY(0)" : "translateY(-8px)",
          transition: tr(0.12),
        }}>
          <text x={W / 2} y={H - 14} textAnchor="middle"
            fontFamily="'Georgia', serif" fontSize="11" fill="#f0c060"
            letterSpacing="3" opacity="0.65">
            SHREWSBURY TOWN COMMON · SUMMER EVENING
          </text>
        </g>
      </svg>
    </section>
  );
}
