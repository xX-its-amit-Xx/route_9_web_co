"use client";
import { useEffect, useRef, useState } from "react";

const W = 1440;
const H = 540;

// ─── Horizon & water geometry ─────────────────────────────────────────────────
const HORIZON_Y = 208;
const POND_TOP   = HORIZON_Y + 18;   // water surface starts here
const POND_BOT   = H;
const MILL_X     = 820;              // mill building left edge
const MILL_W     = 260;
const MILL_H     = 195;
const MILL_Y     = HORIZON_Y - MILL_H + 40;  // top of mill roof ridge

// ─── Water wheel (overshot) ───────────────────────────────────────────────────
const WH_CX = MILL_X - 18;           // wheel center x (left of mill)
const WH_CY = POND_TOP + 44;         // wheel center y (partly submerged)
const WH_R  = 68;                     // outer radius
const WH_SPOKES = 12;
const WH_BUCKETS = 12;

// ─── Stone dam ────────────────────────────────────────────────────────────────
const DAM_X1 = MILL_X - 18;
const DAM_Y1 = POND_TOP + WH_R + 8;
const DAM_X2 = MILL_X + MILL_W + 40;
const DAM_H  = 32;

type DamStone = [number, number, number, number, string];
const DAM_STONES: DamStone[] = (() => {
  const stones: DamStone[] = [];
  const rows = 3;
  const stoneW = 42;
  const stoneH = DAM_H / rows;
  const len = DAM_X2 - DAM_X1;
  const cols = Math.ceil(len / stoneW) + 1;
  const shades = ["#7a6e5c","#8a7e6c","#6a5e4c","#9a8e7c","#7a7060"];
  for (let r = 0; r < rows; r++) {
    const offset = r % 2 === 0 ? 0 : stoneW * 0.45;
    for (let c = 0; c < cols; c++) {
      const sx = DAM_X1 + c * stoneW + offset;
      const sy = DAM_Y1 + r * stoneH;
      stones.push([sx, sy, stoneW - 1.5, stoneH - 1.5, shades[(r * 4 + c) % shades.length] ?? "#7a6e5c"]);
    }
  }
  return stones;
})();

// ─── Mill building ────────────────────────────────────────────────────────────
// Stone walls — same pattern as dam but larger
type WallStone = [number, number, number, number, string];
const WALL_STONES: WallStone[] = (() => {
  const stones: WallStone[] = [];
  const stoneW = 36;
  const stoneH = 18;
  const wallW = MILL_W;
  const wallH = MILL_H - 44;  // below roof line
  const cols = Math.ceil(wallW / stoneW) + 1;
  const rows = Math.ceil(wallH / stoneH);
  const shades = ["#8a7e6c","#7a7060","#9a8e7c","#6a6050","#7a6e5c"];
  for (let r = 0; r < rows; r++) {
    const offset = r % 2 === 0 ? 0 : stoneW * 0.5;
    for (let c = 0; c < cols; c++) {
      const sx = MILL_X + c * stoneW + offset;
      const sy = (MILL_Y + 44) + r * stoneH;
      if (sx < MILL_X + wallW) {
        stones.push([sx, sy, stoneW - 1.2, stoneH - 1.2, shades[(r * 3 + c) % shades.length] ?? "#8a7e6c"]);
      }
    }
  }
  return stones;
})();

// ─── Mill windows (arched) ────────────────────────────────────────────────────
type MillWindow = { x: number; y: number; w: number; h: number; glowColor: string };
const MILL_WINDOWS: MillWindow[] = [
  { x: MILL_X + 32,  y: HORIZON_Y - 48, w: 32, h: 52, glowColor: "#f8d070" },
  { x: MILL_X + 100, y: HORIZON_Y - 48, w: 32, h: 52, glowColor: "#f8e080" },
  { x: MILL_X + 168, y: HORIZON_Y - 48, w: 32, h: 52, glowColor: "#f8d070" },
  // upper floor
  { x: MILL_X + 66,  y: MILL_Y + 56, w: 26, h: 38, glowColor: "#f0c860" },
  { x: MILL_X + 138, y: MILL_Y + 56, w: 26, h: 38, glowColor: "#f0c860" },
];

// ─── Millrace (water channel feeding wheel) ────────────────────────────────────
// Wooden flume from upper left to wheel
const FLUME_INSET = 14;

// ─── Mist bands ──────────────────────────────────────────────────────────────
type MistBand = { cx: number; cy: number; rx: number; ry: number; delay: number; opacity: number };
const MIST_BANDS: MistBand[] = [
  { cx: 280,  cy: POND_TOP + 28, rx: 220, ry: 22, delay: 0,   opacity: 0.28 },
  { cx: 600,  cy: POND_TOP + 18, rx: 280, ry: 18, delay: 0.7, opacity: 0.22 },
  { cx: 950,  cy: POND_TOP + 32, rx: 200, ry: 20, delay: 1.4, opacity: 0.25 },
  { cx: 1260, cy: POND_TOP + 22, rx: 190, ry: 16, delay: 0.4, opacity: 0.20 },
  { cx: 420,  cy: POND_TOP + 48, rx: 160, ry: 14, delay: 1.1, opacity: 0.18 },
  { cx: 1100, cy: POND_TOP + 42, rx: 175, ry: 15, delay: 1.8, opacity: 0.20 },
];

// ─── Heron ────────────────────────────────────────────────────────────────────
const HERON_X = 420;
const HERON_Y = POND_TOP + 8;

// ─── Cattails ─────────────────────────────────────────────────────────────────
type Cattail = { x: number; h: number; lean: number; headColor: string };
const CATTAILS_L: Cattail[] = [
  { x: 62,  h: 110, lean: -4, headColor: "#5a3808" },
  { x: 90,  h: 124, lean:  3, headColor: "#6a4210" },
  { x: 118, h: 106, lean: -5, headColor: "#5a3808" },
  { x: 144, h: 118, lean:  2, headColor: "#6a4210" },
  { x: 172, h: 100, lean: -3, headColor: "#5a3808" },
  { x: 200, h: 112, lean:  4, headColor: "#6a4210" },
  { x: 228, h:  96, lean: -2, headColor: "#5a3808" },
];
const CATTAILS_R: Cattail[] = [
  { x: 1272, h: 108, lean:  3, headColor: "#5a3808" },
  { x: 1300, h: 120, lean: -4, headColor: "#6a4210" },
  { x: 1328, h: 104, lean:  4, headColor: "#5a3808" },
  { x: 1356, h: 116, lean: -3, headColor: "#6a4210" },
  { x: 1384, h:  98, lean:  5, headColor: "#5a3808" },
];
const ALL_CATTAILS = [...CATTAILS_L, ...CATTAILS_R];

// ─── Water lilies ─────────────────────────────────────────────────────────────
type WaterLily = { cx: number; cy: number; r: number; petalColor: string };
const LILIES: WaterLily[] = [
  { cx: 320, cy: POND_TOP + 55, r: 14, petalColor: "#f8f0e0" },
  { cx: 358, cy: POND_TOP + 80, r: 12, petalColor: "#f0e8d4" },
  { cx: 302, cy: POND_TOP + 105, r: 16, petalColor: "#f8f4e8" },
  { cx: 1100,cy: POND_TOP + 62, r: 13, petalColor: "#f0e8d4" },
  { cx: 1138,cy: POND_TOP + 88, r: 15, petalColor: "#f8f0e0" },
  { cx: 1082,cy: POND_TOP + 115, r: 11, petalColor: "#f8f4e8" },
];

// ─── Ripple rings (where wheel enters water) ──────────────────────────────────
type Ripple = { cx: number; cy: number; rx: number; ry: number; delay: number };
const RIPPLES: Ripple[] = [
  { cx: WH_CX,       cy: WH_CY + WH_R - 6, rx: 30, ry: 9, delay: 0 },
  { cx: WH_CX - 20,  cy: WH_CY + WH_R + 4, rx: 45, ry: 12, delay: 0.4 },
  { cx: WH_CX + 20,  cy: WH_CY + WH_R + 8, rx: 55, ry: 14, delay: 0.9 },
  { cx: WH_CX - 10,  cy: POND_TOP + 90, rx: 38, ry: 9, delay: 1.2 },
  { cx: 650,          cy: POND_TOP + 130, rx: 50, ry: 11, delay: 0.6 },
  { cx: 480,          cy: POND_TOP + 180, rx: 60, ry: 13, delay: 1.5 },
];

// ─── Reflection waviness offsets ─────────────────────────────────────────────
// We'll draw the mill reflection as a vertically-flipped, wavy distorted version
const REFL_WAVE_FREQ = 0.022;  // used in path computation

// ─── Background trees ─────────────────────────────────────────────────────────
type BgTree = {
  cx: number; baseY: number; trunkH: number;
  cr: number; shade: string; trunkColor: string;
};
const BG_TREES: BgTree[] = [
  { cx: 38,   baseY: HORIZON_Y + 5,  trunkH: 60, cr: 30, shade: "#4a6830", trunkColor: "#3a2a18" },
  { cx: 88,   baseY: HORIZON_Y + 2,  trunkH: 72, cr: 36, shade: "#3e5a28", trunkColor: "#3a2a18" },
  { cx: 152,  baseY: HORIZON_Y + 6,  trunkH: 55, cr: 26, shade: "#567038", trunkColor: "#3a2a18" },
  { cx: 260,  baseY: HORIZON_Y + 3,  trunkH: 48, cr: 22, shade: "#4a6430", trunkColor: "#3a2a18" },
  { cx: 368,  baseY: HORIZON_Y + 4,  trunkH: 42, cr: 19, shade: "#3e5a28", trunkColor: "#3a2a18" },
  // right of mill
  { cx: 1140, baseY: HORIZON_Y + 3,  trunkH: 52, cr: 24, shade: "#4a6830", trunkColor: "#3a2a18" },
  { cx: 1210, baseY: HORIZON_Y + 5,  trunkH: 66, cr: 32, shade: "#3e5a28", trunkColor: "#3a2a18" },
  { cx: 1295, baseY: HORIZON_Y + 2,  trunkH: 78, cr: 38, shade: "#567038", trunkColor: "#3a2a18" },
  { cx: 1370, baseY: HORIZON_Y + 6,  trunkH: 58, cr: 28, shade: "#4a6430", trunkColor: "#3a2a18" },
  { cx: 1420, baseY: HORIZON_Y + 3,  trunkH: 44, cr: 20, shade: "#3e5a28", trunkColor: "#3a2a18" },
];

// ─── Sunrise sky bands ────────────────────────────────────────────────────────
// Rendered as gradient — dawn palette: deep teal-blue to rose-peach horizon

export function MillPond() {
  const ref = useRef<SVGSVGElement>(null);
  const [active, setActive] = useState(false);
  const [wheelAngle, setWheelAngle] = useState(0);

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

  // Rotate water wheel
  useEffect(() => {
    if (!active) return;
    let a = 0;
    const tick = setInterval(() => {
      a = (a - 1.031) % 360;   // clockwise = negative for overshot (water pours over top)
      setWheelAngle(a);
    }, 33);
    return () => clearInterval(tick);
  }, [active]);

  const tr = (d: number) =>
    active ? `opacity 0.7s ease ${d}s, transform 0.7s ease ${d}s` : "none";

  const toRad = (deg: number) => (deg * Math.PI) / 180;

  // Build reflection wavy path for mill silhouette
  const reflPath = (() => {
    const mirror_y = (y: number) => POND_TOP + (POND_TOP - y) * 0.42;
    const waveY = (x: number, y: number) =>
      mirror_y(y) + Math.sin(x * REFL_WAVE_FREQ) * 3;
    const pts: string[] = [];
    // Left edge
    pts.push(`M${MILL_X},${POND_TOP}`);
    // Across water surface with wave
    for (let x = MILL_X; x <= MILL_X + MILL_W; x += 8) {
      pts.push(`L${x},${waveY(x, MILL_Y + MILL_H * 0.5)}`);
    }
    pts.push(`L${MILL_X + MILL_W},${POND_TOP}`);
    pts.push("Z");
    return pts.join(" ");
  })();

  return (
    <section style={{ background: "#0e1e30", overflow: "hidden", position: "relative" }}>
      <style>{`
        @keyframes mp-mist {
          0%,100% { transform: translateX(0) scaleX(1); opacity: var(--mo, 0.22); }
          50%     { transform: translateX(18px) scaleX(1.06); opacity: calc(var(--mo, 0.22) * 1.35); }
        }
        @keyframes mp-ripple {
          0%   { transform: scale(1); opacity: 0.55; }
          100% { transform: scale(1.8); opacity: 0; }
        }
        @keyframes mp-heron-step {
          0%,85%,100% { transform: translateY(0); }
          42%         { transform: translateY(-5px); }
        }
        @keyframes mp-water-shimmer {
          0%,100% { opacity: 0.5; }
          50%     { opacity: 0.7; }
        }
        @keyframes mp-window-flicker {
          0%,90%,100% { opacity: 0.85; }
          95%         { opacity: 0.55; }
        }
        @keyframes mp-sway {
          0%,100% { transform: rotate(-2.5deg); }
          50%     { transform: rotate(2.5deg); }
        }
        .mp-mist   { animation: mp-mist 5s ease-in-out infinite; }
        .mp-ripple { animation: mp-ripple 3s ease-out infinite; }
        .mp-shimmer{ animation: mp-water-shimmer 4s ease-in-out infinite; }
        .mp-flicker{ animation: mp-window-flicker 6s ease-in-out infinite; }
        .mp-sway   { animation: mp-sway 3.2s ease-in-out infinite; transform-origin: bottom center; }
      `}</style>
      <svg
        ref={ref}
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="xMidYMid slice"
        style={{ display: "block", width: "100%", height: "auto", minHeight: 320 }}
        aria-label="Dawn at a New England grist mill pond — water wheel turning, heron in mist, still reflections"
        role="img"
      >
        <defs>
          {/* Dawn sky gradient */}
          <linearGradient id="mp-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#0e1e38" />
            <stop offset="28%"  stopColor="#1e3254" />
            <stop offset="55%"  stopColor="#5a3848" />
            <stop offset="72%"  stopColor="#c07050" />
            <stop offset="86%"  stopColor="#d8a068" />
            <stop offset="100%" stopColor="#e8c090" />
          </linearGradient>
          {/* Sun disc glow at horizon */}
          <radialGradient id="mp-sun" cx="50%" cy="100%" r="60%">
            <stop offset="0%"   stopColor="#fff0a0" stopOpacity="0.85" />
            <stop offset="30%"  stopColor="#f0a040" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#c07050" stopOpacity="0" />
          </radialGradient>
          {/* Pond water */}
          <linearGradient id="mp-water" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#c07050" stopOpacity="0.85" />
            <stop offset="20%"  stopColor="#5a6878" stopOpacity="0.88" />
            <stop offset="55%"  stopColor="#2a3a50" stopOpacity="0.92" />
            <stop offset="100%" stopColor="#1a2838" stopOpacity="0.95" />
          </linearGradient>
          {/* Water shimmer layer */}
          <linearGradient id="mp-water-shine" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#e8b080" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#e8b080" stopOpacity="0" />
          </linearGradient>
          {/* Mill reflection */}
          <linearGradient id="mp-refl" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#7a6a50" stopOpacity="0.38" />
            <stop offset="100%" stopColor="#2a3040" stopOpacity="0.08" />
          </linearGradient>
          {/* Window glow */}
          <radialGradient id="mp-win-glow" cx="50%" cy="50%" r="60%">
            <stop offset="0%"   stopColor="#f8d070" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#f0a020" stopOpacity="0" />
          </radialGradient>
          {/* Mist fill */}
          <linearGradient id="mp-mist-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#d0d8e0" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#c0ccd8" stopOpacity="0" />
          </linearGradient>
          {/* Foreground bank */}
          <linearGradient id="mp-bank" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#4a5a30" />
            <stop offset="40%"  stopColor="#3a4a24" />
            <stop offset="100%" stopColor="#283418" />
          </linearGradient>
          <clipPath id="mp-clip">
            <rect x="0" y="0" width={W} height={H} />
          </clipPath>
          <clipPath id="mp-water-clip">
            <rect x="0" y={POND_TOP} width={W} height={H - POND_TOP} />
          </clipPath>
        </defs>

        {/* ── Dawn sky ── */}
        <rect x="0" y="0" width={W} height={H} fill="url(#mp-sky)" />
        {/* Sun glow at horizon */}
        <ellipse cx={W * 0.38} cy={HORIZON_Y} rx={360} ry={120} fill="url(#mp-sun)" />
        {/* Sun disc */}
        <circle cx={W * 0.38} cy={HORIZON_Y + 2} r={28}
          fill="#fff4c0" opacity="0.92" />
        <circle cx={W * 0.38} cy={HORIZON_Y + 2} r={22}
          fill="#fffce0" opacity="0.96" />

        {/* ── Background trees ── */}
        {BG_TREES.map((bt, i) => (
          <g key={i}>
            <line x1={bt.cx} y1={bt.baseY} x2={bt.cx} y2={bt.baseY - bt.trunkH}
              stroke={bt.trunkColor} strokeWidth={6} strokeLinecap="round" />
            <ellipse cx={bt.cx} cy={bt.baseY - bt.trunkH - bt.cr * 0.55}
              rx={bt.cr} ry={bt.cr * 0.75} fill={bt.shade} opacity="0.92" />
            <ellipse cx={bt.cx - bt.cr * 0.35} cy={bt.baseY - bt.trunkH - bt.cr * 0.25}
              rx={bt.cr * 0.65} ry={bt.cr * 0.5} fill={bt.shade} opacity="0.75" />
          </g>
        ))}

        {/* ── Pond water surface ── */}
        <rect x="0" y={POND_TOP} width={W} height={H - POND_TOP}
          fill="url(#mp-water)" />
        <rect x="0" y={POND_TOP} width={W} height={80}
          fill="url(#mp-water-shine)" className="mp-shimmer" />

        {/* ── Mill reflection (wavy silhouette on water) ── */}
        <path d={reflPath} fill="url(#mp-refl)" clipPath="url(#mp-water-clip)" />
        {/* Wheel reflection arc */}
        <ellipse cx={WH_CX} cy={POND_TOP + (POND_TOP - WH_CY) * 0.35}
          rx={WH_R * 0.7} ry={WH_R * 0.18}
          fill="#7a6050" opacity="0.18" />

        {/* ── Horizontal reflection shimmer lines ── */}
        {Array.from({ length: 18 }, (_, i) => {
          const ry = POND_TOP + 8 + i * 14;
          const rw = 180 + (i * 37) % 300;
          const rx = (i * 113) % (W - rw);
          return (
            <rect key={i} x={rx} y={ry} width={rw} height={2}
              fill="#e8b070" opacity={0.06 + (i % 4) * 0.02} rx="1" />
          );
        })}

        {/* ── Mill building ── */}
        <g style={{
          opacity: active ? 1 : 0,
          transform: active ? "translateY(0)" : "translateY(16px)",
          transition: tr(0.2),
        }}>
          {/* Stone wall */}
          {WALL_STONES.map(([sx, sy, sw, sh, fill], i) => (
            <rect key={i} x={sx} y={sy} width={sw} height={sh}
              fill={fill} stroke="#4a4030" strokeWidth="0.5" />
          ))}
          {/* Gable ends (triangles) */}
          <polygon
            points={`${MILL_X},${MILL_Y + 44} ${MILL_X + MILL_W / 2},${MILL_Y} ${MILL_X + MILL_W},${MILL_Y + 44}`}
            fill="#5a5040" />
          {/* Roof */}
          <polygon
            points={`${MILL_X - 6},${MILL_Y + 44} ${MILL_X + MILL_W / 2},${MILL_Y - 6} ${MILL_X + MILL_W + 6},${MILL_Y + 44}`}
            fill="#3a3228" />
          {/* Roof shingles (horizontal lines) */}
          {Array.from({ length: 10 }, (_, i) => {
            const t = (i + 1) / 11;
            const rx1 = MILL_X - 6 + (MILL_W / 2 + 6) * t;
            const rx2 = MILL_X + MILL_W / 2 + (MILL_W / 2 + 6) * t;
            const ry = MILL_Y - 6 + (MILL_Y + 44 - (MILL_Y - 6)) * t;
            return (
              <line key={i} x1={rx1} y1={ry} x2={rx2} y2={ry}
                stroke="#2a2420" strokeWidth="1.5" opacity="0.5" />
            );
          })}
          {/* Cupola / ventilator */}
          <rect x={MILL_X + MILL_W / 2 - 16} y={MILL_Y - 28} width={32} height={20}
            rx="2" fill="#2a2420" stroke="#1a1810" strokeWidth="1" />
          <polygon
            points={`${MILL_X + MILL_W / 2 - 18},${MILL_Y - 28} ${MILL_X + MILL_W / 2},${MILL_Y - 46} ${MILL_X + MILL_W / 2 + 18},${MILL_Y - 28}`}
            fill="#1a1810" />
          {/* Weathervane */}
          <line x1={MILL_X + MILL_W / 2} y1={MILL_Y - 46}
            x2={MILL_X + MILL_W / 2} y2={MILL_Y - 62}
            stroke="#6a5a30" strokeWidth="2.5" />
          <polygon
            points={`${MILL_X + MILL_W / 2 - 12},${MILL_Y - 58} ${MILL_X + MILL_W / 2 + 18},${MILL_Y - 62} ${MILL_X + MILL_W / 2 - 6},${MILL_Y - 66}`}
            fill="#8a7840" />

          {/* Sluice gate / headrace opening */}
          <rect x={MILL_X - 18} y={HORIZON_Y - 20} width={22} height={30}
            fill="#1a1408" stroke="#3a2a18" strokeWidth="1.5" />
          {/* Water cascade from sluice */}
          {[0, 1, 2].map(i => (
            <path key={i}
              d={`M${MILL_X - 14 + i * 5},${HORIZON_Y + 8} Q${MILL_X - 16 + i * 5},${WH_CY - WH_R + 12} ${MILL_X - 12 + i * 5},${WH_CY - WH_R + 24}`}
              fill="none" stroke="#9ab8d0" strokeWidth="2.5" opacity={0.5 - i * 0.12} />
          ))}
        </g>

        {/* ── Windows with glow ── */}
        {MILL_WINDOWS.map((mw, i) => (
          <g key={i} style={{ opacity: active ? 1 : 0, transition: tr(0.3 + i * 0.06) }}>
            {/* Glow halo */}
            <ellipse cx={mw.x + mw.w / 2} cy={mw.y + mw.h / 2}
              rx={mw.w * 1.4} ry={mw.h * 1.1}
              fill="url(#mp-win-glow)" className="mp-flicker"
              style={{ animationDelay: `${i * 0.8}s` }} />
            {/* Window body */}
            <rect x={mw.x} y={mw.y + mw.h * 0.35} width={mw.w} height={mw.h * 0.65}
              rx="1" fill={mw.glowColor} opacity="0.85" className="mp-flicker"
              style={{ animationDelay: `${i * 0.8 + 0.2}s` }} />
            {/* Arch */}
            <path d={`M${mw.x},${mw.y + mw.h * 0.35} A${mw.w / 2},${mw.h * 0.35} 0 0,1 ${mw.x + mw.w},${mw.y + mw.h * 0.35}`}
              fill={mw.glowColor} opacity="0.85" />
            {/* Muntin cross */}
            <line x1={mw.x + mw.w / 2} y1={mw.y} x2={mw.x + mw.w / 2} y2={mw.y + mw.h}
              stroke="#5a4020" strokeWidth="2" opacity="0.5" />
            <line x1={mw.x} y1={mw.y + mw.h * 0.6} x2={mw.x + mw.w} y2={mw.y + mw.h * 0.6}
              stroke="#5a4020" strokeWidth="2" opacity="0.5" />
          </g>
        ))}

        {/* ── Stone dam ── */}
        {DAM_STONES.map(([sx, sy, sw, sh, fill], i) => (
          <rect key={i} x={sx} y={sy} width={sw} height={sh}
            fill={fill} stroke="#3a2a18" strokeWidth="0.5" />
        ))}
        {/* Spillway water over dam */}
        <rect x={DAM_X1 + 30} y={DAM_Y1 - 4} width={DAM_X2 - DAM_X1 - 60} height={6}
          rx="1" fill="#7ab8d8" opacity="0.6" />
        {Array.from({ length: 5 }, (_, i) => (
          <path key={i}
            d={`M${DAM_X1 + 40 + i * 28},${DAM_Y1} Q${DAM_X1 + 44 + i * 28},${DAM_Y1 + 8} ${DAM_X1 + 48 + i * 28},${DAM_Y1 + 16}`}
            fill="none" stroke="#8ac8e0" strokeWidth="2" opacity="0.4" />
        ))}

        {/* ── Water wheel ── */}
        <g
          style={{
            transform: `translate(${WH_CX}px, ${WH_CY}px) rotate(${wheelAngle}deg)`,
            transition: "none",
          }}
        >
          {/* Outer rim */}
          <circle cx={0} cy={0} r={WH_R} fill="none"
            stroke="#5a3820" strokeWidth="9" />
          <circle cx={0} cy={0} r={WH_R - 9} fill="none"
            stroke="#4a2c18" strokeWidth="3" opacity="0.6" />
          {/* Spokes */}
          {Array.from({ length: WH_SPOKES }, (_, i) => {
            const a = toRad(i * (360 / WH_SPOKES));
            return (
              <line key={i}
                x1={0} y1={0}
                x2={Math.cos(a) * (WH_R - 5)} y2={Math.sin(a) * (WH_R - 5)}
                stroke="#4a3020" strokeWidth="5.5" strokeLinecap="round" />
            );
          })}
          {/* Hub */}
          <circle cx={0} cy={0} r={14} fill="#6a4828" stroke="#3a2010" strokeWidth="3" />
          <circle cx={0} cy={0} r={6}  fill="#3a2010" />
          {/* Buckets on rim */}
          {Array.from({ length: WH_BUCKETS }, (_, i) => {
            const a = toRad(i * (360 / WH_BUCKETS));
            const bx = Math.cos(a) * (WH_R - 4);
            const by = Math.sin(a) * (WH_R - 4);
            const ta = a - Math.PI / 2;
            return (
              <g key={i} style={{ transform: `translate(${bx}px, ${by}px) rotate(${a}rad)` }}>
                {/* Bucket board */}
                <rect x={-9} y={-16} width={18} height={16}
                  rx="2" fill="#5a3818" stroke="#3a2010" strokeWidth="1.2" />
                {/* Water in bucket (blue fill) at certain positions */}
                <rect x={-8} y={-14} width={16} height={8}
                  rx="1" fill="#4a8aaa" opacity="0.55" />
              </g>
            );
          })}
        </g>
        {/* Wheel axle bracket */}
        <rect x={WH_CX - 8} y={HORIZON_Y - 8} width={16} height={POND_TOP - HORIZON_Y + WH_CY - WH_R + 14}
          rx="3" fill="#4a3020" />

        {/* ── Mist bands ── */}
        {MIST_BANDS.map((mb, i) => (
          <ellipse key={i} className="mp-mist"
            cx={mb.cx} cy={mb.cy} rx={mb.rx} ry={mb.ry}
            fill="url(#mp-mist-fill)"
            style={{ "--mo": `${mb.opacity}`, animationDelay: `${mb.delay}s` } as React.CSSProperties} />
        ))}

        {/* ── Heron silhouette ── */}
        <g style={{
          opacity: active ? 1 : 0,
          transform: active ? "translateY(0)" : "translateY(10px)",
          transition: tr(0.55),
        }}>
          <g className="mp-sway" style={{ transformOrigin: `${HERON_X}px ${HERON_Y + 80}px` }}>
            {/* Legs */}
            <line x1={HERON_X - 4} y1={HERON_Y + 50} x2={HERON_X - 6} y2={HERON_Y + 80}
              stroke="#5a5838" strokeWidth="2.5" strokeLinecap="round" />
            <line x1={HERON_X + 4} y1={HERON_Y + 50} x2={HERON_X + 5} y2={HERON_Y + 80}
              stroke="#5a5838" strokeWidth="2.5" strokeLinecap="round" />
            {/* Feet */}
            <line x1={HERON_X - 6} y1={HERON_Y + 80} x2={HERON_X - 18} y2={HERON_Y + 84}
              stroke="#5a5838" strokeWidth="2" />
            <line x1={HERON_X - 6} y1={HERON_Y + 80} x2={HERON_X + 2}  y2={HERON_Y + 85}
              stroke="#5a5838" strokeWidth="2" />
            <line x1={HERON_X + 5}  y1={HERON_Y + 80} x2={HERON_X + 16} y2={HERON_Y + 84}
              stroke="#5a5838" strokeWidth="2" />
            {/* Body */}
            <ellipse cx={HERON_X} cy={HERON_Y + 34} rx={14} ry={20}
              fill="#3a3828" />
            {/* Neck */}
            <path d={`M${HERON_X - 4},${HERON_Y + 18} Q${HERON_X - 12},${HERON_Y + 4} ${HERON_X - 8},${HERON_Y - 12}`}
              fill="none" stroke="#3a3828" strokeWidth="8" strokeLinecap="round" />
            {/* Head */}
            <ellipse cx={HERON_X - 8} cy={HERON_Y - 16} rx={10} ry={7}
              fill="#3a3828" />
            {/* Beak */}
            <line x1={HERON_X - 4} y1={HERON_Y - 17} x2={HERON_X + 18} y2={HERON_Y - 19}
              stroke="#6a6028" strokeWidth="3" strokeLinecap="round" />
            {/* Plume */}
            <path d={`M${HERON_X + 4},${HERON_Y + 44} Q${HERON_X + 18},${HERON_Y + 58} ${HERON_X + 8},${HERON_Y + 70}`}
              fill="none" stroke="#4a4838" strokeWidth="3" strokeLinecap="round" />
            {/* Eye */}
            <circle cx={HERON_X - 5} cy={HERON_Y - 17} r={2.5} fill="#c8c040" />
          </g>
          {/* Heron reflection */}
          <g style={{ transform: `scaleY(-0.35) translateY(-${(POND_TOP - HERON_Y) * 2.86 + H * 0}px)`, opacity: 0.25 }}>
            <ellipse cx={HERON_X} cy={HERON_Y + 34} rx={14} ry={20} fill="#3a3828" />
            <line x1={HERON_X - 4} y1={HERON_Y + 50} x2={HERON_X - 6} y2={HERON_Y + 80}
              stroke="#5a5838" strokeWidth="2.5" />
            <line x1={HERON_X + 4} y1={HERON_Y + 50} x2={HERON_X + 5} y2={HERON_Y + 80}
              stroke="#5a5838" strokeWidth="2.5" />
          </g>
        </g>

        {/* ── Ripple rings ── */}
        {RIPPLES.map((rp, i) => (
          <ellipse key={i} className="mp-ripple"
            cx={rp.cx} cy={rp.cy} rx={rp.rx} ry={rp.ry}
            fill="none" stroke="#9ab8cc" strokeWidth="1.2"
            style={{ animationDelay: `${rp.delay}s` }} />
        ))}

        {/* ── Water lilies ── */}
        {LILIES.map((lily, i) => (
          <g key={i} style={{
            opacity: active ? 1 : 0,
            transition: tr(0.45 + i * 0.05),
          }}>
            {/* Pad */}
            <ellipse cx={lily.cx} cy={lily.cy} rx={lily.r} ry={lily.r * 0.55}
              fill="#3a5a20" opacity="0.85" />
            {/* Notch */}
            <path d={`M${lily.cx},${lily.cy - lily.r * 0.55} L${lily.cx},${lily.cy} L${lily.cx + lily.r * 0.3},${lily.cy - lily.r * 0.35}`}
              fill="#2a4a18" opacity="0.6" />
            {/* Flower */}
            {Array.from({ length: 8 }, (_, p) => {
              const pa = toRad(p * 45);
              return (
                <ellipse key={p}
                  cx={lily.cx + Math.cos(pa) * lily.r * 0.35}
                  cy={lily.cy - lily.r * 0.12 + Math.sin(pa) * lily.r * 0.18}
                  rx={lily.r * 0.22} ry={lily.r * 0.35}
                  fill={lily.petalColor} opacity="0.82"
                  style={{ transform: `rotate(${p * 45}deg)`, transformOrigin: `${lily.cx}px ${lily.cy - lily.r * 0.12}px` }}
                />
              );
            })}
            {/* Stamen */}
            <circle cx={lily.cx} cy={lily.cy - lily.r * 0.12} r={lily.r * 0.14}
              fill="#f8d060" />
          </g>
        ))}

        {/* ── Cattails (foreground) ── */}
        {ALL_CATTAILS.map((ct, i) => (
          <g key={i}
             className="mp-sway"
             style={{ transformOrigin: `${ct.x}px ${H}px`, animationDelay: `${i * 0.19}s` }}>
            <line x1={ct.x} y1={H} x2={ct.x + ct.lean} y2={H - ct.h}
              stroke="#5a4820" strokeWidth="2.8" strokeLinecap="round" />
            {/* Cattail head */}
            <rect x={ct.x + ct.lean - 4} y={H - ct.h + 8} width={8} height={22}
              rx="4" fill={ct.headColor} />
            {/* Leaf */}
            <path d={`M${ct.x},${H - ct.h * 0.3} Q${ct.x + ct.lean * 1.5 + 16},${H - ct.h * 0.55} ${ct.x + ct.lean * 1.2 + 10},${H - ct.h * 0.75}`}
              fill="none" stroke="#6a8028" strokeWidth="2.5" strokeLinecap="round" />
          </g>
        ))}

        {/* ── Foreground bank ── */}
        <path
          d={`M0,${H - 80} Q80,${H - 100} 160,${H - 88} Q240,${H - 78} 320,${H - 98} L320,${H} L0,${H} Z`}
          fill="url(#mp-bank)" />
        <path
          d={`M${W},${H - 82} Q${W - 80},${H - 102} ${W - 160},${H - 90} Q${W - 240},${H - 80} ${W - 320},${H - 100} L${W - 320},${H} L${W},${H} Z`}
          fill="url(#mp-bank)" />

        {/* ── Scene label ── */}
        <g style={{
          opacity: active ? 1 : 0,
          transform: active ? "translateY(0)" : "translateY(-10px)",
          transition: tr(0.1),
        }}>
          <text x={W / 2} y={H - 18} textAnchor="middle"
            fontFamily="'Georgia', serif" fontSize="11" fill="#a0b8c8"
            letterSpacing="3" opacity="0.6">
            MILL POND · SHREWSBURY, MA · DAWN
          </text>
        </g>
      </svg>
    </section>
  );
}
