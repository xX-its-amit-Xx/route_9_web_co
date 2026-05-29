"use client";
import { useEffect, useRef, useState } from "react";

const W = 1440;
const H = 540;

// ─── geometry ────────────────────────────────────────────────────────────────
const WATER_TOP = 290;
const WATER_BOT = H;
const BRIDGE_Y1 = 218;   // bottom chord (road deck)
const BRIDGE_Y0 = 130;   // top chord
const BRIDGE_L  = 560;   // total span
const BRIDGE_CX = 720;
const BL = BRIDGE_CX - BRIDGE_L / 2;   // 440
const BR = BRIDGE_CX + BRIDGE_L / 2;   // 1000

// Panel widths — 8 equal bays
const PANELS = 8;
const PANEL_W = BRIDGE_L / PANELS;  // 70

// Abutment geometry
const ABT_W = 90;
const ABT_H = 130;
const ABT_L_X = BL - ABT_W;
const ABT_R_X = BR;

// ─── Pratt truss chords and members ─────────────────────────────────────────
type Line = { x1: number; y1: number; x2: number; y2: number };

// Top chord panels
const TOP_CHORD: Line[] = Array.from({ length: PANELS + 1 }, (_, i) => ({
  x1: BL + i * PANEL_W - (i < PANELS ? 0 : 0),
  y1: BRIDGE_Y0,
  x2: BL + (i + 1) * PANEL_W,
  y2: BRIDGE_Y0,
})).slice(0, PANELS);

// Bottom chord panels
const BOT_CHORD: Line[] = Array.from({ length: PANELS }, (_, i) => ({
  x1: BL + i * PANEL_W,
  y1: BRIDGE_Y1,
  x2: BL + (i + 1) * PANEL_W,
  y2: BRIDGE_Y1,
}));

// Vertical posts (end + intermediate)
const VERTICALS: Line[] = Array.from({ length: PANELS + 1 }, (_, i) => ({
  x1: BL + i * PANEL_W,
  y1: BRIDGE_Y0,
  x2: BL + i * PANEL_W,
  y2: BRIDGE_Y1,
}));

// Pratt diagonals: tension members lean toward center (opposite in each half)
// Left half: lean right-upward; right half: lean left-upward
const DIAGONALS: Line[] = Array.from({ length: PANELS }, (_, i) => {
  const half = PANELS / 2;
  const x1 = BL + i * PANEL_W;
  const x2 = BL + (i + 1) * PANEL_W;
  if (i < half) {
    // left half: top-left to bottom-right
    return { x1, y1: BRIDGE_Y0, x2, y2: BRIDGE_Y1 };
  } else {
    // right half: bottom-left to top-right
    return { x1, y1: BRIDGE_Y1, x2, y2: BRIDGE_Y0 };
  }
});

// End portal struts at BL and BR (X bracing on end panels)
const PORTAL_L: Line[] = [
  { x1: BL, y1: BRIDGE_Y0, x2: BL + PANEL_W, y2: BRIDGE_Y1 },
  { x1: BL + PANEL_W, y1: BRIDGE_Y0, x2: BL, y2: BRIDGE_Y1 },
];
const PORTAL_R: Line[] = [
  { x1: BR - PANEL_W, y1: BRIDGE_Y0, x2: BR, y2: BRIDGE_Y1 },
  { x1: BR, y1: BRIDGE_Y0, x2: BR - PANEL_W, y2: BRIDGE_Y1 },
];

// Lateral bracing (top chord X-braces) — every 2 bays
const TOP_BRACE: Line[] = [2, 4, 6].flatMap(i => [
  { x1: BL + i * PANEL_W, y1: BRIDGE_Y0, x2: BL + (i + 1) * PANEL_W, y2: BRIDGE_Y0 - 8 },
  { x1: BL + (i + 1) * PANEL_W, y1: BRIDGE_Y0, x2: BL + i * PANEL_W, y2: BRIDGE_Y0 - 8 },
]);

// ─── Road deck planks ────────────────────────────────────────────────────────
const PLANK_COUNT = 28;
const PLANK_SPACING = BRIDGE_L / PLANK_COUNT;
type Plank = { x: number; w: number };
const PLANKS: Plank[] = Array.from({ length: PLANK_COUNT }, (_, i) => ({
  x: BL + i * PLANK_SPACING + 1,
  w: PLANK_SPACING - 2,
}));

// ─── Rivet groups (decorative) — at each vertical post ──────────────────────
type Rivet = { cx: number; cy: number };
const RIVETS: Rivet[] = Array.from({ length: PANELS + 1 }, (_, i) => {
  const x = BL + i * PANEL_W;
  return [
    { cx: x, cy: BRIDGE_Y0 + 6 },
    { cx: x, cy: BRIDGE_Y0 + 16 },
    { cx: x, cy: BRIDGE_Y1 - 8 },
    { cx: x, cy: BRIDGE_Y1 - 18 },
  ];
}).flat();

// ─── Stone abutment details ───────────────────────────────────────────────────
type AbtStone = [number, number, number, number, string];
function makeAbutmentStones(baseX: number, flip: boolean): AbtStone[] {
  const rows = 5;
  const cols = 4;
  const sw = ABT_W / cols;
  const sh = ABT_H / rows;
  const shades = ["#8a7a6a","#7d6f60","#9a8b7c","#6d6055","#b0a090"];
  const stones: AbtStone[] = [];
  for (let r = 0; r < rows; r++) {
    const offset = r % 2 === 0 ? 0 : sw * 0.5;
    for (let c = 0; c < cols + 1; c++) {
      const sx = baseX + (flip ? ABT_W - (c * sw + offset) - sw * 0.9 : c * sw + offset);
      const sy = BRIDGE_Y1 + r * sh;
      if (sx >= baseX && sx + sw * 0.9 <= baseX + ABT_W) {
        stones.push([sx, sy, sw * 0.9, sh * 0.88, shades[(r * 3 + c) % shades.length] ?? "#8a7a6a"]);
      }
    }
  }
  return stones;
}
const L_STONES = makeAbutmentStones(ABT_L_X, false);
const R_STONES = makeAbutmentStones(ABT_R_X, true);

// ─── Rocky stream bank ────────────────────────────────────────────────────────
type BankRock = [number, number, number, number, string];
const BANK_ROCKS: BankRock[] = [
  [BL - 120, WATER_TOP + 8, 52, 22, "#6d6055"],
  [BL - 80,  WATER_TOP + 18, 38, 18, "#8a7a6a"],
  [BL - 50,  WATER_TOP + 4,  60, 24, "#7d6f60"],
  [BL - 20,  WATER_TOP + 14, 44, 20, "#9a8b7c"],
  [BR + 10,  WATER_TOP + 6,  55, 22, "#6d6055"],
  [BR + 50,  WATER_TOP + 16, 40, 19, "#8a7a6a"],
  [BR + 80,  WATER_TOP + 4,  62, 24, "#7d6f60"],
  [BR + 120, WATER_TOP + 12, 46, 21, "#9a8b7c"],
  // midstream rocks
  [BRIDGE_CX - 80, WATER_TOP + 60, 36, 14, "#5a4f45"],
  [BRIDGE_CX + 30, WATER_TOP + 80, 44, 16, "#6d6055"],
  [BRIDGE_CX - 20, WATER_TOP + 110, 28, 12, "#7d6f60"],
];

// ─── Stream ripples ───────────────────────────────────────────────────────────
type Ripple = { cx: number; cy: number; rx: number; ry: number; delay: number };
const RIPPLES: Ripple[] = [
  { cx: 540, cy: 340, rx: 60, ry: 10, delay: 0 },
  { cx: 680, cy: 370, rx: 45, ry:  8, delay: 0.4 },
  { cx: 820, cy: 320, rx: 70, ry: 11, delay: 0.9 },
  { cx: 740, cy: 420, rx: 50, ry:  9, delay: 1.4 },
  { cx: 620, cy: 460, rx: 55, ry: 10, delay: 0.6 },
  { cx: 900, cy: 390, rx: 40, ry:  7, delay: 1.1 },
];

// ─── Reflection lines (bridge bottom chord mirror) ────────────────────────────
const REFLECT_Y0 = WATER_TOP + (WATER_TOP - BRIDGE_Y1);  // = -228 (off screen, ok for effect)
// Simplified: just draw wavy horizontal bands at increasing opacity
type ReflBand = { y: number; opacity: number };
const REFL_BANDS: ReflBand[] = [
  { y: WATER_TOP + 10, opacity: 0.18 },
  { y: WATER_TOP + 22, opacity: 0.12 },
  { y: WATER_TOP + 36, opacity: 0.08 },
];

// ─── Horse cart ───────────────────────────────────────────────────────────────
// Cart body center: starts off-screen left, crosses bridge
const CART_Y = BRIDGE_Y1 - 22;  // body bottom rests on deck

// ─── Foreground vegetation ────────────────────────────────────────────────────
type Cattail = { x: number; h: number; headY: number };
const CATTAILS: Cattail[] = [
  { x: 88,  h: 80, headY: H - 200 },
  { x: 112, h: 95, headY: H - 215 },
  { x: 140, h: 70, headY: H - 190 },
  { x: 168, h: 88, headY: H - 208 },
  { x: 1270, h: 82, headY: H - 195 },
  { x: 1298, h: 92, headY: H - 212 },
  { x: 1325, h: 74, headY: H - 198 },
  { x: 1350, h: 85, headY: H - 205 },
];

// ─── Foreground willow fronds ──────────────────────────────────────────────────
type WillowFrond = { cx: number; cy: number; pts: string; delay: number };
const WILLOWS: WillowFrond[] = [
  { cx: 52,  cy: 160, pts: "0,0 -24,70 -8,140 10,200", delay: 0 },
  { cx: 76,  cy: 140, pts: "0,0 -16,60 0,130 14,195",  delay: 0.3 },
  { cx: 100, cy: 155, pts: "0,0 -20,65 -4,135 12,198", delay: 0.6 },
  { cx: 1360,cy: 158, pts: "0,0 22,68 6,138 -12,202",  delay: 0.2 },
  { cx: 1385,cy: 145, pts: "0,0 18,58 2,128 -16,193",  delay: 0.5 },
  { cx: 1410,cy: 162, pts: "0,0 24,72 8,142 -10,206",  delay: 0.8 },
];

// ─── Birds ────────────────────────────────────────────────────────────────────
type Bird = { startX: number; y: number; speed: number; delay: number; scale: number };
const BIRDS: Bird[] = [
  { startX: -60,  y:  88, speed: 22, delay: 0,   scale: 1.0 },
  { startX: -120, y:  72, speed: 26, delay: 1.8,  scale: 0.75 },
  { startX: -40,  y: 106, speed: 20, delay: 3.5,  scale: 0.85 },
  { startX: -90,  y:  60, speed: 24, delay: 5.2,  scale: 0.65 },
];

// ─── Moss patches on abutments ────────────────────────────────────────────────
type Moss = { cx: number; cy: number; rx: number; ry: number };
const MOSS_L: Moss[] = [
  { cx: ABT_L_X + 20, cy: BRIDGE_Y1 + 28, rx: 18, ry: 8 },
  { cx: ABT_L_X + 50, cy: BRIDGE_Y1 + 55, rx: 22, ry: 9 },
  { cx: ABT_L_X + 14, cy: BRIDGE_Y1 + 80, rx: 15, ry: 7 },
];
const MOSS_R: Moss[] = [
  { cx: ABT_R_X + ABT_W - 22, cy: BRIDGE_Y1 + 34, rx: 19, ry: 8 },
  { cx: ABT_R_X + ABT_W - 54, cy: BRIDGE_Y1 + 60, rx: 20, ry: 9 },
  { cx: ABT_R_X + ABT_W - 16, cy: BRIDGE_Y1 + 86, rx: 14, ry: 7 },
];

export function IronBridge() {
  const ref = useRef<SVGSVGElement>(null);
  const [active, setActive] = useState(false);
  const [cartX, setCartX] = useState(BL - 180);

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

  // Animate horse cart across bridge
  useEffect(() => {
    if (!active) return;
    let x = BL - 180;
    const tick = setInterval(() => {
      x += 0.55;
      if (x > BR + 200) x = BL - 180;
      setCartX(x);
    }, 16);
    return () => clearInterval(tick);
  }, [active]);

  const tr = (d: number) =>
    active
      ? `opacity 0.65s ease ${d}s, transform 0.65s ease ${d}s`
      : "none";

  const cartBody = cartX;

  return (
    <section
      style={{
        background: "linear-gradient(180deg,#c9dce8 0%,#b8d0de 30%,#a0bece 100%)",
        overflow: "hidden",
        position: "relative",
      }}
    >
      <style>{`
        @keyframes irb-ripple {
          0%   { transform: scaleX(1) scaleY(1); opacity: var(--ro, 0.6); }
          100% { transform: scaleX(1.6) scaleY(1.4); opacity: 0; }
        }
        @keyframes irb-bird {
          from { transform: translateX(0); }
          to   { transform: translateX(${W + 140}px); }
        }
        @keyframes irb-willow {
          0%,100% { transform: rotate(-4deg); }
          50%     { transform: rotate(4deg); }
        }
        @keyframes irb-water-shimmer {
          0%,100% { opacity: 0.55; }
          50%     { opacity: 0.78; }
        }
        .irb-ripple   { animation: irb-ripple 2.8s ease-out infinite; }
        .irb-willow   { animation: irb-willow 3.5s ease-in-out infinite; transform-origin: top center; }
        .irb-shimmer  { animation: irb-water-shimmer 3s ease-in-out infinite; }
      `}</style>
      <svg
        ref={ref}
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="xMidYMid slice"
        style={{ display: "block", width: "100%", height: "auto", minHeight: 320 }}
        aria-label="Historic iron Pratt truss bridge spanning a rocky New England stream"
        role="img"
      >
        <defs>
          {/* Sky gradient */}
          <linearGradient id="irb-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#9bbdcf" />
            <stop offset="45%"  stopColor="#bfd6e4" />
            <stop offset="100%" stopColor="#d8e8ef" />
          </linearGradient>

          {/* Water gradient */}
          <linearGradient id="irb-water" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#6b9fb8" stopOpacity="0.95" />
            <stop offset="40%"  stopColor="#4a8099" stopOpacity="0.90" />
            <stop offset="100%" stopColor="#2a5a72" stopOpacity="0.85" />
          </linearGradient>

          {/* Stream bank soil */}
          <linearGradient id="irb-bank" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#6b7a4a" />
            <stop offset="40%"  stopColor="#5a6638" />
            <stop offset="100%" stopColor="#3d4728" />
          </linearGradient>

          {/* Iron patina — warm grey with rust tones */}
          <linearGradient id="irb-iron" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#4a4438" />
            <stop offset="50%"  stopColor="#3a342a" />
            <stop offset="100%" stopColor="#2c2820" />
          </linearGradient>

          {/* Iron deck */}
          <linearGradient id="irb-deck" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#7a6e5c" />
            <stop offset="100%" stopColor="#5a5040" />
          </linearGradient>

          {/* Rust accent */}
          <linearGradient id="irb-rust" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%"   stopColor="#8b4513" stopOpacity="0.15" />
            <stop offset="50%"  stopColor="#a0522d" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#8b4513" stopOpacity="0.15" />
          </linearGradient>

          {/* Tree foliage */}
          <radialGradient id="irb-leaf" cx="50%" cy="40%" r="55%">
            <stop offset="0%"   stopColor="#5a7a3a" />
            <stop offset="100%" stopColor="#3a5520" />
          </radialGradient>

          {/* Reflection shimmer */}
          <linearGradient id="irb-refl" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#8cb8cc" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#8cb8cc" stopOpacity="0" />
          </linearGradient>

          <clipPath id="irb-clip">
            <rect x="0" y="0" width={W} height={H} />
          </clipPath>
        </defs>

        {/* ── Sky ── */}
        <rect x="0" y="0" width={W} height={H} fill="url(#irb-sky)" />

        {/* ── Distant treeline ── */}
        {Array.from({ length: 36 }, (_, i) => {
          const tx = i * 42 - 10;
          const th = 55 + (i * 7) % 35;
          const ty = WATER_TOP - th - 8;
          const tw = 28 + (i * 5) % 18;
          const shade = i % 3 === 0 ? "#3e5530" : i % 3 === 1 ? "#4a6338" : "#526b3e";
          return (
            <ellipse key={i} cx={tx + tw / 2} cy={ty + th * 0.35} rx={tw / 2} ry={th * 0.55}
              fill={shade} opacity="0.6" />
          );
        })}

        {/* ── Stream bank (left & right) ── */}
        <path
          d={`M0,${WATER_TOP + 40} Q${BL - 80},${WATER_TOP - 10} ${BL - 20},${WATER_TOP + 20} L${BL - 20},${H} L0,${H} Z`}
          fill="url(#irb-bank)"
        />
        <path
          d={`M${W},${WATER_TOP + 40} Q${BR + 80},${WATER_TOP - 10} ${BR + 20},${WATER_TOP + 20} L${BR + 20},${H} L${W},${H} Z`}
          fill="url(#irb-bank)"
        />

        {/* ── Stream / water ── */}
        <rect x={BL - 40} y={WATER_TOP} width={BRIDGE_L + 80} height={H - WATER_TOP}
          fill="url(#irb-water)" />

        {/* ── Water shimmer overlay ── */}
        <rect x={BL - 40} y={WATER_TOP} width={BRIDGE_L + 80} height={60}
          fill="url(#irb-refl)" className="irb-shimmer" />

        {/* ── Reflection bands (iron bridge silhouette on water) ── */}
        {REFL_BANDS.map((rb, i) => (
          <rect key={i} x={BL} y={rb.y} width={BRIDGE_L} height={8}
            fill="#2a3a4a" opacity={rb.opacity} rx="2" />
        ))}

        {/* ── Bank rocks ── */}
        {BANK_ROCKS.map(([rx, ry, rw, rh, fill], i) => (
          <ellipse key={i} cx={rx + rw / 2} cy={ry + rh / 2} rx={rw / 2} ry={rh / 2}
            fill={fill} />
        ))}

        {/* ── Ripples ── */}
        {RIPPLES.map((rp, i) => (
          <ellipse key={i} className="irb-ripple" cx={rp.cx} cy={rp.cy} rx={rp.rx} ry={rp.ry}
            fill="none" stroke="#8cb8cc" strokeWidth="1.2"
            style={{ "--ro": "0.6", animationDelay: `${rp.delay}s` } as React.CSSProperties} />
        ))}

        {/* ── Left abutment ── */}
        <rect x={ABT_L_X} y={BRIDGE_Y1} width={ABT_W} height={ABT_H}
          fill="#8a7a6a" />
        {L_STONES.map(([sx, sy, sw, sh, fill], i) => (
          <rect key={i} x={sx} y={sy} width={sw} height={sh}
            fill={fill} stroke="#5a4f45" strokeWidth="0.5" />
        ))}
        {/* Wing wall left */}
        <polygon
          points={`${ABT_L_X - 50},${BRIDGE_Y1 + ABT_H} ${ABT_L_X},${BRIDGE_Y1} ${ABT_L_X},${BRIDGE_Y1 + ABT_H}`}
          fill="#7d6f60" />

        {/* ── Right abutment ── */}
        <rect x={ABT_R_X} y={BRIDGE_Y1} width={ABT_W} height={ABT_H}
          fill="#8a7a6a" />
        {R_STONES.map(([sx, sy, sw, sh, fill], i) => (
          <rect key={i} x={sx} y={sy} width={sw} height={sh}
            fill={fill} stroke="#5a4f45" strokeWidth="0.5" />
        ))}
        {/* Wing wall right */}
        <polygon
          points={`${ABT_R_X + ABT_W + 50},${BRIDGE_Y1 + ABT_H} ${ABT_R_X + ABT_W},${BRIDGE_Y1} ${ABT_R_X + ABT_W},${BRIDGE_Y1 + ABT_H}`}
          fill="#7d6f60" />

        {/* ── Moss patches ── */}
        {[...MOSS_L, ...MOSS_R].map((m, i) => (
          <ellipse key={i} cx={m.cx} cy={m.cy} rx={m.rx} ry={m.ry}
            fill="#4a6830" opacity="0.65" />
        ))}

        {/* ── Road deck ── */}
        <rect x={BL} y={BRIDGE_Y1 - 8} width={BRIDGE_L} height={14}
          fill="url(#irb-deck)" />
        {/* Deck planks */}
        {PLANKS.map((pl, i) => (
          <rect key={i} x={pl.x} y={BRIDGE_Y1 - 7} width={pl.w} height={12}
            fill={i % 2 === 0 ? "#6a5e4c" : "#5e5240"} opacity="0.85" />
        ))}
        {/* Guard rails (wood curb) */}
        <rect x={BL} y={BRIDGE_Y1 - 16} width={BRIDGE_L} height={8}
          fill="#8a7455" />
        <rect x={BL} y={BRIDGE_Y1 + 6} width={BRIDGE_L} height={6}
          fill="#8a7455" />

        {/* ── Truss: top chord ── */}
        {TOP_CHORD.map((ln, i) => (
          <line key={i} x1={ln.x1} y1={ln.y1} x2={ln.x2} y2={ln.y2}
            stroke="url(#irb-iron)" strokeWidth="9" strokeLinecap="square" />
        ))}
        {/* ── Truss: bottom chord ── */}
        {BOT_CHORD.map((ln, i) => (
          <line key={i} x1={ln.x1} y1={ln.y1} x2={ln.x2} y2={ln.y2}
            stroke="url(#irb-iron)" strokeWidth="9" strokeLinecap="square" />
        ))}
        {/* ── Truss: verticals ── */}
        {VERTICALS.map((ln, i) => (
          <line key={i} x1={ln.x1} y1={ln.y1} x2={ln.x2} y2={ln.y2}
            stroke="#3a342a" strokeWidth="7" strokeLinecap="square" />
        ))}
        {/* ── Truss: diagonals ── */}
        {DIAGONALS.map((ln, i) => (
          <line key={i} x1={ln.x1} y1={ln.y1} x2={ln.x2} y2={ln.y2}
            stroke="#2c2820" strokeWidth="5" strokeLinecap="round" />
        ))}
        {/* ── Portal bracing ── */}
        {[...PORTAL_L, ...PORTAL_R].map((ln, i) => (
          <line key={i} x1={ln.x1} y1={ln.y1} x2={ln.x2} y2={ln.y2}
            stroke="#2c2820" strokeWidth="4" strokeLinecap="round" opacity="0.7" />
        ))}

        {/* ── Rust overlay on truss ── */}
        <rect x={BL} y={BRIDGE_Y0} width={BRIDGE_L} height={BRIDGE_Y1 - BRIDGE_Y0}
          fill="url(#irb-rust)" />

        {/* ── Rivets ── */}
        {RIVETS.map((rv, i) => (
          <circle key={i} cx={rv.cx} cy={rv.cy} r="3.5"
            fill="#1a1610" stroke="#4a3a28" strokeWidth="0.8" />
        ))}

        {/* ── Horse cart crossing bridge ── */}
        <g clipPath="url(#irb-clip)"
           style={{
             transform: `translateX(${cartX - (BL - 180)}px)`,
             transition: "none",
           }}>
          {/* Horse body */}
          <ellipse cx={BL - 180 + 55} cy={CART_Y - 18} rx={40} ry={16}
            fill="#3a2a1a" />
          {/* Horse head + neck */}
          <ellipse cx={BL - 180 + 96} cy={CART_Y - 30} rx={14} ry={10}
            fill="#3a2a1a" />
          <line x1={BL - 180 + 88} y1={CART_Y - 22} x2={BL - 180 + 96} y2={CART_Y - 24}
            stroke="#3a2a1a" strokeWidth="10" />
          {/* Horse legs */}
          {[28, 38, 65, 75].map((ox, i) => (
            <line key={i}
              x1={BL - 180 + ox} y1={CART_Y - 4}
              x2={BL - 180 + ox + (i % 2 === 0 ? -3 : 3)} y2={CART_Y + 16}
              stroke="#2a1a0a" strokeWidth="5" strokeLinecap="round" />
          ))}
          {/* Cart body */}
          <rect x={BL - 180 - 30} y={CART_Y - 30} width={72} height={30}
            rx="3" fill="#8a6a3a" stroke="#5a4020" strokeWidth="1.5" />
          {/* Cart wheels */}
          {[-10, 30].map((ox, i) => (
            <g key={i}>
              <circle cx={BL - 180 + ox} cy={CART_Y + 4} r={18}
                fill="none" stroke="#5a4020" strokeWidth="4" />
              <circle cx={BL - 180 + ox} cy={CART_Y + 4} r={4}
                fill="#5a4020" />
              {[0, 45, 90, 135].map((angle, j) => (
                <line key={j}
                  x1={BL - 180 + ox} y1={CART_Y + 4}
                  x2={BL - 180 + ox + Math.cos(angle * Math.PI / 180) * 14}
                  y2={CART_Y + 4 + Math.sin(angle * Math.PI / 180) * 14}
                  stroke="#5a4020" strokeWidth="2.5" />
              ))}
            </g>
          ))}
          {/* Hay load */}
          <ellipse cx={BL - 180 + 6} cy={CART_Y - 32} rx={30} ry={12}
            fill="#c8a830" />
          <path d={`M${BL - 180 - 24},${CART_Y - 30} Q${BL - 180 + 6},${CART_Y - 50} ${BL - 180 + 36},${CART_Y - 30}`}
            fill="#d4b038" />
        </g>

        {/* ── Foreground willows ── */}
        {WILLOWS.map((wl, i) => (
          <polyline key={i} className="irb-willow"
            points={wl.pts.split(" ").map(pt => {
              const [dx, dy] = pt.split(",").map(Number);
              return `${wl.cx + (dx ?? 0)},${wl.cy + (dy ?? 0)}`;
            }).join(" ")}
            fill="none" stroke="#5a7a3a" strokeWidth="3"
            strokeLinecap="round"
            style={{ animationDelay: `${wl.delay}s` }} />
        ))}

        {/* ── Cattails ── */}
        {CATTAILS.map((ct, i) => (
          <g key={i}>
            <line x1={ct.x} y1={H} x2={ct.x} y2={H - ct.h}
              stroke="#5a4a2a" strokeWidth="2.5" />
            <ellipse cx={ct.x} cy={ct.headY} rx={4} ry={14}
              fill="#8b6914" />
          </g>
        ))}

        {/* ── Birds ── */}
        {BIRDS.map((bd, i) => (
          <g key={i}
             style={{
               animation: active
                 ? `irb-bird ${bd.speed}s linear ${bd.delay}s infinite`
                 : "none",
               transform: `scale(${bd.scale})`,
               transformOrigin: `${bd.startX}px ${bd.y}px`,
             }}>
            <path
              d={`M${bd.startX - 8},${bd.y} Q${bd.startX},${bd.y - 7} ${bd.startX + 8},${bd.y} Q${bd.startX + 16},${bd.y - 7} ${bd.startX + 22},${bd.y}`}
              fill="none" stroke="#2a3a2a" strokeWidth="1.8" />
          </g>
        ))}

        {/* ── Fade-in reveal groups ── */}
        {/* Sky text label */}
        <g style={{
          opacity: active ? 1 : 0,
          transform: active ? "translateY(0)" : "translateY(18px)",
          transition: tr(0.2),
        }}>
          <text x={BRIDGE_CX} y={BRIDGE_Y0 - 22} textAnchor="middle"
            fontFamily="'Georgia', serif" fontSize="13" fill="#2c2820" letterSpacing="3"
            opacity="0.6">
            IRON BRIDGE · SHREWSBURY, MA · c.1887
          </text>
        </g>

        {/* Bridge full reveal */}
        <g style={{
          opacity: active ? 1 : 0,
          transform: active ? "translateY(0)" : "translateY(24px)",
          transition: tr(0.35),
        }}>
          {/* Marker plaque */}
          <rect x={BRIDGE_CX - 70} y={BRIDGE_Y0 - 18} width={140} height={22}
            rx="3" fill="#2c2820" opacity="0.75" />
          <text x={BRIDGE_CX} y={BRIDGE_Y0 - 4} textAnchor="middle"
            fontFamily="'Georgia', serif" fontSize="10" fill="#c8a830" letterSpacing="1.5">
            ROUTE 9 CROSSING
          </text>
        </g>

        {/* Foreground elements reveal */}
        <g style={{
          opacity: active ? 1 : 0,
          transform: active ? "translateY(0)" : "translateY(10px)",
          transition: tr(0.5),
        }}>
          {/* Foreground grass tufts on bank */}
          {[120, 160, 200, 240, 1200, 1240, 1280, 1320].map((gx, i) => (
            <g key={i}>
              <line x1={gx} y1={WATER_TOP + 35} x2={gx - 8} y2={WATER_TOP + 12}
                stroke="#4a6028" strokeWidth="2.5" strokeLinecap="round" />
              <line x1={gx} y1={WATER_TOP + 35} x2={gx} y2={WATER_TOP + 8}
                stroke="#5a7030" strokeWidth="2" strokeLinecap="round" />
              <line x1={gx} y1={WATER_TOP + 35} x2={gx + 8} y2={WATER_TOP + 14}
                stroke="#4a6028" strokeWidth="2.5" strokeLinecap="round" />
            </g>
          ))}
        </g>
      </svg>
    </section>
  );
}
