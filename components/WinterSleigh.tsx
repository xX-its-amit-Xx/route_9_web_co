"use client";
import { useEffect, useRef, useState } from "react";

const W = 1440;
const H = 520;

// ─── Scene geometry ──────────────────────────────────────────────────────────
const HORIZON_Y   = 210;
const ROAD_NEAR_Y = H - 40;
const ROAD_L_FAR  = 590;
const ROAD_R_FAR  = 850;

// One-point perspective vanishing point on road
const VP_X = 720;
const VP_Y = HORIZON_Y + 12;

// ─── Snow drifts (ground silhouette) ─────────────────────────────────────────
// Path: left edge → undulating snow surface → right edge → bottom
const SNOW_GROUND = `
  M0,${HORIZON_Y + 30}
  Q120,${HORIZON_Y + 18} 240,${HORIZON_Y + 38}
  Q360,${HORIZON_Y + 52} 480,${HORIZON_Y + 28}
  Q600,${HORIZON_Y + 20} 720,${HORIZON_Y + 32}
  Q840,${HORIZON_Y + 46} 960,${HORIZON_Y + 24}
  Q1080,${HORIZON_Y + 18} 1200,${HORIZON_Y + 36}
  Q1320,${HORIZON_Y + 50} 1440,${HORIZON_Y + 28}
  L1440,${H} L0,${H} Z
`;

// Foreground snowbank (near bottom)
const SNOW_FORE_L = `
  M0,${ROAD_NEAR_Y - 30}
  Q80,${ROAD_NEAR_Y - 55} 160,${ROAD_NEAR_Y - 40}
  Q220,${ROAD_NEAR_Y - 30} 280,${ROAD_NEAR_Y - 50}
  Q320,${ROAD_NEAR_Y - 60} 380,${ROAD_NEAR_Y - 35}
  L${ROAD_L_FAR - 30},${VP_Y + 80}
  L0,${VP_Y + 80} Z
`;
const SNOW_FORE_R = `
  M${W},${ROAD_NEAR_Y - 30}
  Q${W - 80},${ROAD_NEAR_Y - 55} ${W - 160},${ROAD_NEAR_Y - 40}
  Q${W - 220},${ROAD_NEAR_Y - 30} ${W - 280},${ROAD_NEAR_Y - 50}
  Q${W - 320},${ROAD_NEAR_Y - 60} ${W - 380},${ROAD_NEAR_Y - 35}
  L${ROAD_R_FAR + 30},${VP_Y + 80}
  L${W},${VP_Y + 80} Z
`;

// ─── Road (packed snow, slightly darker) ─────────────────────────────────────
const ROAD_PATH = `
  M${ROAD_L_FAR},${VP_Y + 80}
  L${ROAD_R_FAR},${VP_Y + 80}
  L${W * 0.72 + 260},${ROAD_NEAR_Y}
  L${W * 0.72 - 260},${ROAD_NEAR_Y} Z
`;

// Road ruts (perspective lines from VP)
type RutLine = { x1: number; y1: number; x2: number; y2: number };
function makeRut(offsetPct: number): RutLine {
  const farX = VP_X + offsetPct * (ROAD_R_FAR - ROAD_L_FAR) / 2 * (offsetPct > 0 ? 1 : -1);
  const nearX = VP_X + offsetPct * 220;
  return { x1: farX, y1: VP_Y + 88, x2: nearX, y2: ROAD_NEAR_Y - 4 };
}
const RUTS: RutLine[] = [makeRut(-0.6), makeRut(-0.25), makeRut(0.25), makeRut(0.6)];

// ─── Bare trees ───────────────────────────────────────────────────────────────
type BareTree = {
  cx: number; baseY: number; h: number;
  branches: [number, number, number, number][];  // [startFrac, sideX, sideY, subX]
  snow: boolean;
};

function makeTree(cx: number, baseY: number, h: number, lean: number, snow: boolean): BareTree {
  const branches: [number, number, number, number][] = [
    [0.65, cx + lean + 28, baseY - h * 0.62, cx + lean + 48],
    [0.65, cx + lean - 24, baseY - h * 0.60, cx + lean - 42],
    [0.78, cx + lean + 20, baseY - h * 0.72, cx + lean + 36],
    [0.78, cx + lean - 18, baseY - h * 0.70, cx + lean - 32],
    [0.88, cx + lean + 14, baseY - h * 0.84, cx + lean + 24],
    [0.88, cx + lean - 12, baseY - h * 0.82, cx + lean - 20],
  ];
  return { cx, baseY, h, branches, snow };
}

const TREES_L: BareTree[] = [
  makeTree(55,  HORIZON_Y + 30, 195, -6, true),
  makeTree(145, HORIZON_Y + 28, 170, -4, true),
  makeTree(240, HORIZON_Y + 32, 155, -5, true),
  makeTree(360, HORIZON_Y + 26, 130, -3, false),
  makeTree(460, HORIZON_Y + 30, 108, -2, false),
  makeTree(540, HORIZON_Y + 28, 84,  -2, false),
];
const TREES_R: BareTree[] = [
  makeTree(1385, HORIZON_Y + 30, 192,  5, true),
  makeTree(1295, HORIZON_Y + 28, 168,  4, true),
  makeTree(1200, HORIZON_Y + 32, 152,  4, true),
  makeTree(1080, HORIZON_Y + 26, 128,  3, false),
  makeTree(978,  HORIZON_Y + 30, 106,  2, false),
  makeTree(895,  HORIZON_Y + 28, 82,   2, false),
];
const ALL_TREES = [...TREES_L, ...TREES_R];

// ─── Gas lamps ────────────────────────────────────────────────────────────────
type GasLamp = { x: number; y: number; postH: number; side: "L" | "R" };
const GAS_LAMPS: GasLamp[] = [
  { x: 410,  y: HORIZON_Y + 32, postH: 105, side: "L" },
  { x: 190,  y: HORIZON_Y + 35, postH: 140, side: "L" },
  { x: 1030, y: HORIZON_Y + 32, postH: 108, side: "R" },
  { x: 1250, y: HORIZON_Y + 35, postH: 142, side: "R" },
];

// ─── Distant farmhouse ────────────────────────────────────────────────────────
const FARM_X = 640;
const FARM_Y = HORIZON_Y - 10;
const FARM_W = 80;
const FARM_H = 48;

// ─── Snowflakes (deterministic — golden angle spiral, two layers) ─────────────
type Snowflake = { cx: number; cy: number; r: number; speed: number; sway: number; delay: number };
const FLAKES: Snowflake[] = Array.from({ length: 72 }, (_, i) => {
  const angle = i * 137.508 * Math.PI / 180;
  const radius = Math.sqrt(i / 72) * W * 0.52;
  const cx = (W / 2 + Math.cos(angle) * radius + W / 2) % W;
  const cy = (i * 23) % H;
  const size = 0.8 + (i % 5) * 0.4;
  const speed = 6 + (i % 7) * 1.4;
  const sway = (i % 2 === 0 ? 1 : -1) * (8 + (i % 4) * 4);
  return { cx, cy, r: size, speed, sway, delay: -(i * 0.21) % speed };
});

// ─── Moon ─────────────────────────────────────────────────────────────────────
const MOON_CX = 1080;
const MOON_CY = 72;
const MOON_R  = 44;

// ─── Stars ────────────────────────────────────────────────────────────────────
type Star = { cx: number; cy: number; r: number; delay: number };
const STARS: Star[] = Array.from({ length: 48 }, (_, i) => {
  const angle = i * 137.508 * Math.PI / 180;
  const radius = (i / 48) * 680;
  return {
    cx: (MOON_CX - 380 + Math.cos(angle) * radius + W) % W,
    cy: Math.max(8, Math.min(HORIZON_Y - 18, (i * 17 + 22) % (HORIZON_Y - 18))),
    r: 0.6 + (i % 3) * 0.5,
    delay: (i * 0.31) % 3,
  };
});

// ─── Sleigh geometry (static base, horse at fixed position for initial render) ─
// Sleigh body center reference
const SL_CY = 342;  // vertical center of sleigh on road

export function WinterSleigh() {
  const ref = useRef<SVGSVGElement>(null);
  const [active, setActive] = useState(false);
  const [sleighX, setSleighX] = useState(-280);

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

  // Animate sleigh across scene
  useEffect(() => {
    if (!active) return;
    let x = -280;
    const tick = setInterval(() => {
      x += 1.444;
      if (x > W + 100) x = -280;
      setSleighX(x);
    }, 33);
    return () => clearInterval(tick);
  }, [active]);

  const tr = (d: number) =>
    active ? `opacity 0.75s ease ${d}s, transform 0.75s ease ${d}s` : "none";

  // Sleigh body reference x (moves with sleighX)
  const sx = sleighX;

  return (
    <section
      style={{
        background: "#0a1020",
        overflow: "hidden",
        position: "relative",
      }}
    >
      <style>{`
        @keyframes ws-snow {
          0%   { transform: translate(0, 0); opacity: 0.9; }
          100% { transform: translate(var(--sway), ${H + 20}px); opacity: 0.3; }
        }
        @keyframes ws-twinkle {
          0%,100% { opacity: 0.9; r: var(--sr); }
          50%     { opacity: 0.3; r: calc(var(--sr) * 0.5); }
        }
        @keyframes ws-lamp-glow {
          0%,100% { opacity: 0.55; }
          50%     { opacity: 0.75; }
        }
        @keyframes ws-breath {
          0%,100% { transform: scale(1) translateY(0); opacity: 0.7; }
          50%     { transform: scale(1.12) translateY(-3px); opacity: 0.5; }
        }
        @keyframes ws-bell {
          0%,100% { transform: rotate(-8deg); }
          25%     { transform: rotate(12deg); }
          75%     { transform: rotate(-12deg); }
        }
        .ws-twinkle { animation: ws-twinkle var(--sd, 2s) ease-in-out infinite; }
        .ws-lamp    { animation: ws-lamp-glow 2.4s ease-in-out infinite; }
        .ws-breath  { animation: ws-breath 3s ease-in-out infinite; }
        .ws-bell    { animation: ws-bell 0.6s ease-in-out infinite; transform-origin: top center; }
      `}</style>
      <svg
        ref={ref}
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="xMidYMid slice"
        style={{ display: "block", width: "100%", height: "auto", minHeight: 320 }}
        aria-label="Horse-drawn sleigh on a moonlit snow-covered Route 9 lane at night"
        role="img"
      >
        <defs>
          {/* Night sky gradient */}
          <linearGradient id="ws-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#050c1e" />
            <stop offset="55%"  stopColor="#0d1a38" />
            <stop offset="100%" stopColor="#1a2848" />
          </linearGradient>

          {/* Snow ground */}
          <linearGradient id="ws-snow-gnd" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#c8d8e8" />
            <stop offset="40%"  stopColor="#b0c4d8" />
            <stop offset="100%" stopColor="#8aa0b8" />
          </linearGradient>

          {/* Road snow */}
          <linearGradient id="ws-road" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#8896a8" />
            <stop offset="100%" stopColor="#6a7888" />
          </linearGradient>

          {/* Moon glow */}
          <radialGradient id="ws-moon-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="#f0eedc" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#f0eedc" stopOpacity="0" />
          </radialGradient>

          {/* Lamp halo (warm yellow) */}
          <radialGradient id="ws-lamp-halo" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="#f8d870" stopOpacity="0.55" />
            <stop offset="50%"  stopColor="#e0a830" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#c87810" stopOpacity="0" />
          </radialGradient>

          {/* Farmhouse window glow */}
          <radialGradient id="ws-farm-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="#f8d058" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#e09020" stopOpacity="0" />
          </radialGradient>

          {/* Foreground snow banks */}
          <linearGradient id="ws-snow-fore" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#d8e8f4" />
            <stop offset="100%" stopColor="#a8c0d4" />
          </linearGradient>

          <clipPath id="ws-clip">
            <rect x="0" y="0" width={W} height={H} />
          </clipPath>
        </defs>

        {/* ── Night sky ── */}
        <rect x="0" y="0" width={W} height={H} fill="url(#ws-sky)" />

        {/* ── Stars ── */}
        {STARS.map((st, i) => (
          <circle key={i} className="ws-twinkle" cx={st.cx} cy={st.cy} r={st.r}
            fill="#e8eef8"
            style={{ "--sr": `${st.r}`, "--sd": `${1.8 + st.delay}s`, animationDelay: `${st.delay}s` } as React.CSSProperties} />
        ))}

        {/* ── Moon ── */}
        <circle cx={MOON_CX} cy={MOON_CY} r={MOON_R + 60} fill="url(#ws-moon-glow)" />
        <circle cx={MOON_CX} cy={MOON_CY} r={MOON_R}
          fill="#f8f4e0" opacity="0.95" />
        {/* Moon craters */}
        <circle cx={MOON_CX + 12} cy={MOON_CY - 10} r={7} fill="#e8e0c0" opacity="0.4" />
        <circle cx={MOON_CX - 16} cy={MOON_CY + 12} r={5} fill="#e8e0c0" opacity="0.35" />
        <circle cx={MOON_CX + 6}  cy={MOON_CY + 18} r={4} fill="#e8e0c0" opacity="0.3" />
        {/* Moon halo ring */}
        <circle cx={MOON_CX} cy={MOON_CY} r={MOON_R + 22}
          fill="none" stroke="#f8f4e0" strokeWidth="1.5" opacity="0.12" />

        {/* ── Horizon glow (moon reflection on snow) ── */}
        <ellipse cx={MOON_CX * 0.7} cy={HORIZON_Y} rx={320} ry={40}
          fill="#8098b8" opacity="0.18" />

        {/* ── Mid-distance treeline silhouette ── */}
        {Array.from({ length: 44 }, (_, i) => {
          const tx = i * 34 - 10;
          const th = 38 + (i * 11) % 28;
          const ty = HORIZON_Y - th + 8;
          const tw = 14 + (i * 5) % 12;
          return (
            <ellipse key={i} cx={tx + tw / 2} cy={ty + th * 0.4} rx={tw / 2} ry={th * 0.6}
              fill="#0d1528" opacity="0.9" />
          );
        })}

        {/* ── Snow ground ── */}
        <path d={SNOW_GROUND} fill="url(#ws-snow-gnd)" />

        {/* ── Road (packed snow lane) ── */}
        <path d={ROAD_PATH} fill="url(#ws-road)" />

        {/* ── Road ruts ── */}
        {RUTS.map((rt, i) => (
          <line key={i} x1={rt.x1} y1={rt.y1} x2={rt.x2} y2={rt.y2}
            stroke="#5a6878" strokeWidth="1.5" opacity="0.5" />
        ))}

        {/* ── Route 9 centerline (snow-dusted dashes) ── */}
        {Array.from({ length: 10 }, (_, i) => {
          const t1 = (i) / 10;
          const t2 = (i + 0.5) / 10;
          const x1 = VP_X + (720 - VP_X) * (1 - t1);
          const y1 = VP_Y + 80 + (ROAD_NEAR_Y - VP_Y - 80) * t1;
          const x2 = VP_X + (720 - VP_X) * (1 - t2);
          const y2 = VP_Y + 80 + (ROAD_NEAR_Y - VP_Y - 80) * t2;
          return (
            <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
              stroke="#9aa8b8" strokeWidth={1 + t1 * 2} strokeDasharray="8,12" opacity="0.3" />
          );
        })}

        {/* ── Bare trees ── */}
        {ALL_TREES.map((tree, i) => (
          <g key={i}>
            {/* Main trunk */}
            <line x1={tree.cx} y1={tree.baseY}
              x2={tree.cx + Math.round(-tree.h * 0.06)} y2={tree.baseY - tree.h}
              stroke="#1a1e2a" strokeWidth={tree.h > 160 ? 7 : tree.h > 110 ? 5 : 3.5}
              strokeLinecap="round" />
            {/* Branches */}
            {tree.branches.map(([frac, bx, by, subX], bi) => {
              const bStartX = tree.cx + Math.round(-tree.h * 0.06 * frac);
              const bStartY = tree.baseY - tree.h * frac;
              return (
                <g key={bi}>
                  <line x1={bStartX} y1={bStartY} x2={bx} y2={by}
                    stroke="#1a1e2a" strokeWidth={tree.h > 140 ? 3 : 2}
                    strokeLinecap="round" />
                  <line x1={bx} y1={by} x2={subX} y2={by - tree.h * 0.08}
                    stroke="#1a1e2a" strokeWidth={1.5} strokeLinecap="round" />
                </g>
              );
            })}
            {/* Snow on branches (caps) */}
            {tree.snow && tree.branches.slice(0, 4).map(([, bx, by], bi) => (
              <ellipse key={bi} cx={bx} cy={by} rx={10} ry={4}
                fill="#c8d8e8" opacity="0.6" />
            ))}
            {/* Snow on trunk top */}
            {tree.snow && (
              <ellipse cx={tree.cx + Math.round(-tree.h * 0.06)} cy={tree.baseY - tree.h}
                rx={6} ry={3} fill="#d0e0f0" opacity="0.7" />
            )}
          </g>
        ))}

        {/* ── Gas lamps ── */}
        {GAS_LAMPS.map((lamp, i) => (
          <g key={i}>
            {/* Halo on snow */}
            <ellipse cx={lamp.x} cy={lamp.y + lamp.postH + 6} rx={55} ry={18}
              fill="url(#ws-lamp-halo)" className="ws-lamp"
              style={{ animationDelay: `${i * 0.5}s` }} />
            {/* Halo in air */}
            <circle cx={lamp.x + (lamp.side === "L" ? 14 : -14)} cy={lamp.y + 16}
              r={50} fill="url(#ws-lamp-halo)" className="ws-lamp"
              style={{ animationDelay: `${i * 0.5}s` }} />
            {/* Post */}
            <line x1={lamp.x} y1={lamp.y + lamp.postH}
              x2={lamp.x} y2={lamp.y + 30}
              stroke="#3a3020" strokeWidth="5" strokeLinecap="round" />
            {/* Arm bracket */}
            <path d={`M${lamp.x},${lamp.y + 30} Q${lamp.x + (lamp.side === "L" ? 20 : -20)},${lamp.y + 20} ${lamp.x + (lamp.side === "L" ? 18 : -18)},${lamp.y + 12}`}
              fill="none" stroke="#3a3020" strokeWidth="3.5" />
            {/* Lantern body */}
            <rect x={lamp.x + (lamp.side === "L" ? 8 : -26)} y={lamp.y + 4}
              width={18} height={22} rx="3"
              fill="#f8d870" stroke="#3a3020" strokeWidth="1.5" />
            {/* Lantern top cap */}
            <polygon
              points={`${lamp.x + (lamp.side === "L" ? 6 : -28)},${lamp.y + 4} ${lamp.x + (lamp.side === "L" ? 17 : -17)},${lamp.y - 4} ${lamp.x + (lamp.side === "L" ? 28 : -6)},${lamp.y + 4}`}
              fill="#3a3020" />
            {/* Snow on cap */}
            <ellipse cx={lamp.x + (lamp.side === "L" ? 17 : -17)} cy={lamp.y - 4}
              rx={8} ry={3} fill="#d0e0f0" opacity="0.8" />
            {/* Light glow core */}
            <circle cx={lamp.x + (lamp.side === "L" ? 17 : -17)} cy={lamp.y + 14}
              r={7} fill="#fff8c0" className="ws-lamp"
              style={{ animationDelay: `${i * 0.5 + 0.2}s` }} />
          </g>
        ))}

        {/* ── Distant farmhouse ── */}
        <g style={{
          opacity: active ? 1 : 0,
          transform: active ? "translateY(0)" : "translateY(10px)",
          transition: tr(0.3),
        }}>
          {/* House body */}
          <rect x={FARM_X} y={FARM_Y + FARM_H * 0.35} width={FARM_W} height={FARM_H * 0.65}
            fill="#141c2c" />
          {/* Roof */}
          <polygon
            points={`${FARM_X - 8},${FARM_Y + FARM_H * 0.35} ${FARM_X + FARM_W / 2},${FARM_Y} ${FARM_X + FARM_W + 8},${FARM_Y + FARM_H * 0.35}`}
            fill="#0e1422" />
          {/* Snow on roof */}
          <path d={`M${FARM_X - 8},${FARM_Y + FARM_H * 0.35} Q${FARM_X + FARM_W / 2},${FARM_Y + 4} ${FARM_X + FARM_W + 8},${FARM_Y + FARM_H * 0.35}`}
            fill="none" stroke="#c0d0e0" strokeWidth="3" />
          {/* Chimney */}
          <rect x={FARM_X + FARM_W * 0.6} y={FARM_Y - 16} width={10} height={20}
            fill="#0e1422" />
          {/* Chimney smoke */}
          {[0, 1, 2].map(i => (
            <ellipse key={i} cx={FARM_X + FARM_W * 0.6 + 5 + i * 4} cy={FARM_Y - 18 - i * 10}
              rx={4 + i * 2} ry={5 + i * 2} fill="#2a3448" opacity={0.35 - i * 0.08} />
          ))}
          {/* Glowing windows */}
          {[0.15, 0.55].map((wx, i) => (
            <g key={i}>
              <circle cx={FARM_X + FARM_W * (wx + 0.12)} cy={FARM_Y + FARM_H * 0.65}
                r={18} fill="url(#ws-farm-glow)" className="ws-lamp"
                style={{ animationDelay: `${i * 0.6}s` }} />
              <rect x={FARM_X + FARM_W * wx} y={FARM_Y + FARM_H * 0.5} width={FARM_W * 0.22} height={FARM_H * 0.3}
                rx="1" fill="#f0c040" opacity="0.85" className="ws-lamp"
                style={{ animationDelay: `${i * 0.6}s` }} />
            </g>
          ))}
          {/* Barn in background */}
          <rect x={FARM_X + FARM_W + 22} y={FARM_Y + FARM_H * 0.2} width={FARM_W * 0.7} height={FARM_H * 0.8}
            fill="#100e1a" />
          <polygon
            points={`${FARM_X + FARM_W + 18},${FARM_Y + FARM_H * 0.2} ${FARM_X + FARM_W + 22 + FARM_W * 0.35},${FARM_Y - 6} ${FARM_X + FARM_W + 22 + FARM_W * 0.7 + 4},${FARM_Y + FARM_H * 0.2}`}
            fill="#0a0c14" />
        </g>

        {/* ── Foreground snow banks ── */}
        <path d={SNOW_FORE_L} fill="url(#ws-snow-fore)" />
        <path d={SNOW_FORE_R} fill="url(#ws-snow-fore)" />

        {/* ── Snowflakes ── */}
        {FLAKES.map((fl, i) => (
          <circle key={i} cx={fl.cx} cy={fl.cy} r={fl.r}
            fill="#e8f0f8" opacity="0.85"
            style={{
              animation: active
                ? `ws-snow ${fl.speed}s linear ${fl.delay}s infinite`
                : "none",
              "--sway": `${fl.sway}px`,
            } as React.CSSProperties}
          />
        ))}

        {/* ── Horse-drawn sleigh (moving) ── */}
        <g clipPath="url(#ws-clip)">
          <g style={{ transform: `translateX(${sx}px)`, transition: "none" }}>
            {/* Lamp glow from sleigh lantern */}
            <ellipse cx={300} cy={SL_CY + 10} rx={70} ry={28}
              fill="#f8d060" opacity="0.14" />

            {/* ── Horse 1 (lead) ── */}
            <g>
              {/* Body */}
              <ellipse cx={330} cy={SL_CY - 18} rx={46} ry={17}
                fill="#2a1a10" />
              {/* Neck */}
              <path d="M372,337 Q386,322 396,316" fill="none" stroke="#2a1a10" strokeWidth="13" strokeLinecap="round" />
              {/* Head */}
              <ellipse cx={400} cy={311} rx={18} ry={11} fill="#2a1a10" />
              {/* Ear */}
              <polygon points="407,302 412,294 415,304" fill="#2a1a10" />
              {/* Eye */}
              <circle cx={407} cy={309} r={2.5} fill="#f8d060" opacity="0.8" />
              {/* Breath puff */}
              <ellipse cx={417} cy={315} rx={5} ry={4} fill="#c8d4e0" opacity="0.5"
                className="ws-breath" />
              {/* Mane */}
              {[0, 1, 2].map(mi => (
                <path key={mi}
                  d={`M${387 - mi * 5},${322 + mi * 3} Q${384 - mi * 4},${314 + mi * 2} ${382 - mi * 5},${320 + mi * 4}`}
                  fill="#1a0e08" stroke="#1a0e08" strokeWidth="2" />
              ))}
              {/* Legs — 4 legs with slight motion */}
              {[
                [308, SL_CY + 2, 300, SL_CY + 26],
                [320, SL_CY + 2, 316, SL_CY + 26],
                [345, SL_CY + 2, 350, SL_CY + 26],
                [358, SL_CY + 2, 362, SL_CY + 26],
              ].map(([x1, y1, x2, y2], li) => (
                <line key={li} x1={x1} y1={y1} x2={x2} y2={y2}
                  stroke="#1a0e08" strokeWidth="6" strokeLinecap="round" />
              ))}
              {/* Hoof snow impressions (ellipses on ground) */}
              {[300, 316, 350, 362].map((hx, hi) => (
                <ellipse key={hi} cx={hx} cy={SL_CY + 27} rx={5} ry={3}
                  fill="#8898a8" opacity="0.6" />
              ))}
              {/* Harness collar */}
              <ellipse cx={376} cy={320} rx={8} ry={10}
                fill="none" stroke="#8a6830" strokeWidth="4" />
            </g>

            {/* ── Horse 2 (slightly behind/to side) ── */}
            <g style={{ transform: "translateX(-18px) translateY(4px)" }}>
              <ellipse cx={330} cy={SL_CY - 18} rx={44} ry={16}
                fill="#241610" />
              <path d="M372,337 Q384,322 394,316" fill="none" stroke="#241610" strokeWidth="12" strokeLinecap="round" />
              <ellipse cx={398} cy={311} rx={17} ry={10} fill="#241610" />
              {[
                [308, SL_CY + 2, 302, SL_CY + 26],
                [322, SL_CY + 2, 318, SL_CY + 26],
                [348, SL_CY + 2, 352, SL_CY + 26],
                [360, SL_CY + 2, 364, SL_CY + 26],
              ].map(([x1, y1, x2, y2], li) => (
                <line key={li} x1={x1} y1={y1} x2={x2} y2={y2}
                  stroke="#160c06" strokeWidth="5.5" strokeLinecap="round" />
              ))}
            </g>

            {/* ── Harness traces ── */}
            <line x1={256} y1={SL_CY - 12} x2={374} y2={SL_CY - 14}
              stroke="#8a6830" strokeWidth="2.5" />
            <line x1={256} y1={SL_CY - 8}  x2={374} y2={SL_CY - 10}
              stroke="#8a6830" strokeWidth="2" opacity="0.7" />

            {/* ── Sleigh body ── */}
            {/* Main body shell */}
            <path d={`M158,${SL_CY - 22} Q180,${SL_CY - 42} 256,${SL_CY - 38} Q256,${SL_CY - 10} 256,${SL_CY - 10} Q200,${SL_CY - 6} 162,${SL_CY - 2} Z`}
              fill="#8b1a1a" stroke="#5a1010" strokeWidth="2" />
            {/* Rear panel */}
            <path d={`M158,${SL_CY - 22} Q148,${SL_CY - 16} 148,${SL_CY - 4} L162,${SL_CY - 2} Z`}
              fill="#6a1010" />
            {/* Decorative scroll on front */}
            <path d={`M172,${SL_CY - 38} Q164,${SL_CY - 50} 178,${SL_CY - 54} Q192,${SL_CY - 56} 196,${SL_CY - 44}`}
              fill="none" stroke="#c8a040" strokeWidth="2.5" />
            {/* Gold pinstripe */}
            <path d={`M162,${SL_CY - 26} Q200,${SL_CY - 44} 252,${SL_CY - 40}`}
              fill="none" stroke="#c8a040" strokeWidth="1.5" opacity="0.8" />

            {/* Runners */}
            <path d={`M145,${SL_CY + 4} Q168,${SL_CY + 14} 260,${SL_CY + 12}`}
              fill="none" stroke="#1a1a1a" strokeWidth="5" strokeLinecap="round" />
            <path d={`M148,${SL_CY + 6} Q170,${SL_CY + 16} 262,${SL_CY + 14}`}
              fill="none" stroke="#3a3a3a" strokeWidth="2" opacity="0.5" />
            {/* Runner curl front */}
            <path d={`M260,${SL_CY + 12} Q268,${SL_CY + 8} 266,${SL_CY + 2} Q264,${SL_CY - 4} 256,${SL_CY - 2}`}
              fill="none" stroke="#1a1a1a" strokeWidth="5" />
            {/* Runner curl back */}
            <path d={`M145,${SL_CY + 4} Q136,${SL_CY + 0} 138,${SL_CY - 6}`}
              fill="none" stroke="#1a1a1a" strokeWidth="5" />

            {/* Snow spray under runners */}
            {[150, 170, 190, 210, 230, 250].map((spx, spi) => (
              <ellipse key={spi} cx={spx} cy={SL_CY + 16 + (spi % 2) * 3}
                rx={4 + spi * 0.8} ry={2} fill="#c0d0e0" opacity={0.3 - spi * 0.03} />
            ))}

            {/* ── Occupants ── */}
            {/* Driver (front) */}
            <g>
              <circle cx={224} cy={SL_CY - 52} r={10} fill="#1a1a1a" />
              {/* Top hat */}
              <rect x={216} y={SL_CY - 64} width={16} height={10} rx="1" fill="#0a0a0a" />
              <rect x={213} y={SL_CY - 66} width={22} height={4} rx="1" fill="#0a0a0a" />
              <ellipse cx={224} cy={SL_CY - 64} rx={11} ry={3} fill="#0a0a0a" />
              {/* Coat */}
              <path d={`M214,${SL_CY - 44} Q224,${SL_CY - 38} 234,${SL_CY - 44} L236,${SL_CY - 28} Q224,${SL_CY - 24} 212,${SL_CY - 28} Z`}
                fill="#1a1a2a" />
              {/* Arm with reins */}
              <line x1={234} y1={SL_CY - 38} x2={272} y2={SL_CY - 22}
                stroke="#1a1a2a" strokeWidth="5" strokeLinecap="round" />
              {/* Reins */}
              <path d={`M272,${SL_CY - 20} Q330,${SL_CY - 22} 370,${SL_CY - 16}`}
                fill="none" stroke="#8a6830" strokeWidth="1.5" opacity="0.8" />
              <path d={`M272,${SL_CY - 18} Q330,${SL_CY - 20} 368,${SL_CY - 14}`}
                fill="none" stroke="#8a6830" strokeWidth="1.5" opacity="0.7" />
              {/* Whip */}
              <line x1={218} y1={SL_CY - 60} x2={230} y2={SL_CY - 94}
                stroke="#5a4020" strokeWidth="2" />
              <line x1={230} y1={SL_CY - 94} x2={248} y2={SL_CY - 108}
                stroke="#5a4020" strokeWidth="1.2" />
            </g>

            {/* Passenger (rear) */}
            <g>
              <circle cx={192} cy={SL_CY - 50} r={9} fill="#2a1a0a" />
              {/* Bonnet */}
              <path d={`M183,${SL_CY - 55} Q192,${SL_CY - 64} 201,${SL_CY - 55}`}
                fill="#8b1a1a" stroke="#6a1010" strokeWidth="1.5" />
              {/* Cape */}
              <path d={`M184,${SL_CY - 42} Q192,${SL_CY - 36} 200,${SL_CY - 42} L202,${SL_CY - 26} Q192,${SL_CY - 22} 182,${SL_CY - 26} Z`}
                fill="#8b1a1a" />
              {/* Muff */}
              <ellipse cx={192} cy={SL_CY - 30} rx={12} ry={7}
                fill="#c8a060" opacity="0.9" />
            </g>

            {/* ── Blanket / lap robe ── */}
            <path d={`M162,${SL_CY - 18} Q192,${SL_CY - 22} 240,${SL_CY - 20} L244,${SL_CY - 8} Q200,${SL_CY - 4} 162,${SL_CY - 6} Z`}
              fill="#1a2a1a" opacity="0.85" />
            {/* Blanket plaid pattern */}
            {[0, 1, 2, 3].map(pi => (
              <line key={pi}
                x1={172 + pi * 18} y1={SL_CY - 20}
                x2={170 + pi * 18} y2={SL_CY - 6}
                stroke="#2a4a2a" strokeWidth="1.5" opacity="0.6" />
            ))}

            {/* ── Sleigh bell ── */}
            <g style={{ transform: `translateX(264px) translateY(${SL_CY - 14}px)` }}>
              <g className="ws-bell">
                <circle cx={0} cy={0} r={5} fill="#c8a040" stroke="#8a7020" strokeWidth="1" />
                <circle cx={0} cy={0} r={2} fill="#8a7020" />
              </g>
              <g className="ws-bell" style={{ animationDelay: "0.15s", transform: "translateX(6px)" }}>
                <circle cx={0} cy={0} r={4} fill="#c8a040" stroke="#8a7020" strokeWidth="1" />
              </g>
            </g>

            {/* ── Lantern on sleigh front ── */}
            <g>
              <circle cx={264} cy={SL_CY - 46} r={22}
                fill="#f8d060" opacity="0.15" />
              <rect x={258} y={SL_CY - 54} width={12} height={16} rx="2"
                fill="#f8e080" stroke="#8a6020" strokeWidth="1.5" />
              <polygon points={`${257},${SL_CY - 54} ${264},${SL_CY - 61} ${271},${SL_CY - 54}`}
                fill="#6a4820" />
              <line x1={264} y1={SL_CY - 61} x2={264} y2={SL_CY - 38}
                stroke="#6a4820" strokeWidth="2" />
            </g>

            {/* ── Hoof prints in snow (trailing behind) ── */}
            {[-20, -50, -85, -120, -155, -190].map((offset, pi) => (
              <g key={pi} opacity={0.4 - pi * 0.05}>
                <ellipse cx={290 + offset} cy={SL_CY + 28} rx={5} ry={3}
                  fill="#7888a0" />
                <ellipse cx={302 + offset} cy={SL_CY + 29} rx={4} ry={2.5}
                  fill="#7888a0" />
              </g>
            ))}
          </g>
        </g>

        {/* ── Section label ── */}
        <g style={{
          opacity: active ? 1 : 0,
          transform: active ? "translateY(0)" : "translateY(-10px)",
          transition: tr(0.2),
        }}>
          <text x={W / 2} y={H - 22} textAnchor="middle"
            fontFamily="'Georgia', serif" fontSize="11" fill="#8898b8"
            letterSpacing="3" opacity="0.65">
            ROUTE 9 · SHREWSBURY · WINTER
          </text>
        </g>
      </svg>
    </section>
  );
}
