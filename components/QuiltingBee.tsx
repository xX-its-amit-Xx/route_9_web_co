"use client";
import { useEffect, useRef, useState } from "react";

const W = 1440;
const H = 580;

// ─── Room geometry ─────────────────────────────────────────────────────────────
const FLOOR_Y   = H - 110;       // baseboard level
const WALL_Y    = 68;            // top of visible wall
const WINDOW_X  = W - 320;       // large window on right wall
const WINDOW_Y  = WALL_Y + 28;
const WINDOW_W  = 210;
const WINDOW_H  = 240;

// ─── Quilt frame (large, center-left) ─────────────────────────────────────────
const QF_X  = 210;               // top-left of frame
const QF_Y  = 220;
const QF_W  = 540;
const QF_H  = 320;
const QF_COLS = 9;
const QF_ROWS = 6;
const CELL_W = QF_W / QF_COLS;
const CELL_H = QF_H / QF_ROWS;

// ─── Quilt pattern blocks ──────────────────────────────────────────────────────
// Each block type: "pinwheel" | "log_cabin" | "nine_patch" | "flying_geese" | "star"
type BlockType = "pinwheel" | "log_cabin" | "nine_patch" | "flying_geese" | "star";

// Deterministic palette per cell — based on position
const QUILT_PALETTES: string[][] = [
  ["#c83228", "#f0e8d0", "#2a3a8a"],  // red / cream / navy
  ["#2a6838", "#f0e8d0", "#e8a020"],  // green / cream / gold
  ["#8b2a8b", "#f8f0e0", "#e08030"],  // purple / cream / orange
  ["#1a3a6a", "#f0e8d0", "#c83228"],  // navy / cream / red
];

function blockType(col: number, row: number): BlockType {
  const types: BlockType[] = ["pinwheel", "log_cabin", "nine_patch", "flying_geese", "star"];
  return types[(col * 3 + row * 7) % types.length] ?? "nine_patch";
}

function blockPalette(col: number, row: number): string[] {
  const p = QUILT_PALETTES[(col + row * 2) % QUILT_PALETTES.length] ?? QUILT_PALETTES[0] ?? [];
  return p;
}

// ─── Quilt block renderers (return SVG path strings relative to 0,0 cell) ──────
function pinwheelPaths(w: number, h: number, p: string[]): { d: string; fill: string }[] {
  const [c1, c2] = [p[0] ?? "#c83228", p[1] ?? "#f0e8d0"];
  return [
    { d: `M0,0 L${w * 0.5},${h * 0.5} L0,${h} Z`,        fill: c1 },
    { d: `M0,0 L${w},0 L${w * 0.5},${h * 0.5} Z`,         fill: c2 },
    { d: `M${w},0 L${w},${h} L${w * 0.5},${h * 0.5} Z`,   fill: c1 },
    { d: `M0,${h} L${w},${h} L${w * 0.5},${h * 0.5} Z`,   fill: c2 },
  ];
}

function logCabinPaths(w: number, h: number, p: string[]): { d: string; fill: string }[] {
  const [c1, c2, c3] = [p[0] ?? "#c83228", p[1] ?? "#f0e8d0", p[2] ?? "#2a3a8a"];
  const s = Math.min(w, h) * 0.25;
  return [
    { d: `M0,0 L${w},0 L${w},${s} L0,${s} Z`,                       fill: c1 },
    { d: `M${w - s},0 L${w},0 L${w},${h} L${w - s},${h} Z`,          fill: c2 },
    { d: `M0,${h - s} L${w},${h - s} L${w},${h} L0,${h} Z`,         fill: c3 },
    { d: `M0,0 L${s},0 L${s},${h} L0,${h} Z`,                       fill: c2 },
    { d: `M${s},${s} L${w - s},${s} L${w - s},${h - s} L${s},${h - s} Z`, fill: c1 },
  ];
}

function ninePatchPaths(w: number, h: number, p: string[]): { d: string; fill: string }[] {
  const [c1, c2] = [p[0] ?? "#c83228", p[1] ?? "#f0e8d0"];
  const tw = w / 3;
  const th = h / 3;
  const result: { d: string; fill: string }[] = [];
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 3; c++) {
      result.push({
        d: `M${c * tw},${r * th} L${(c + 1) * tw},${r * th} L${(c + 1) * tw},${(r + 1) * th} L${c * tw},${(r + 1) * th} Z`,
        fill: (r + c) % 2 === 0 ? c1 : c2,
      });
    }
  }
  return result;
}

function flyingGeesePaths(w: number, h: number, p: string[]): { d: string; fill: string }[] {
  const [c1, c2] = [p[0] ?? "#c83228", p[1] ?? "#f0e8d0"];
  const rows = 4;
  const rh = h / rows;
  const result: { d: string; fill: string }[] = [];
  for (let r = 0; r < rows; r++) {
    const y0 = r * rh;
    const ym = y0 + rh / 2;
    const y1 = y0 + rh;
    result.push({ d: `M${w * 0.5},${y0} L${w},${y1} L0,${y1} Z`, fill: c1 });
    result.push({ d: `M0,${y0} L${w * 0.5},${y0} L0,${y1} Z`,    fill: c2 });
    result.push({ d: `M${w * 0.5},${y0} L${w},${y0} L${w},${y1} Z`, fill: c2 });
    void ym;
  }
  return result;
}

function starPaths(w: number, h: number, p: string[]): { d: string; fill: string }[] {
  const [c1, c2, c3] = [p[0] ?? "#c83228", p[1] ?? "#f0e8d0", p[2] ?? "#2a3a8a"];
  const cx = w / 2;
  const cy = h / 2;
  const r1 = Math.min(w, h) * 0.42;
  const r2 = Math.min(w, h) * 0.18;
  const pts8 = Array.from({ length: 8 }, (_, i) => {
    const a = (i * Math.PI * 2) / 8 - Math.PI / 2;
    const r = i % 2 === 0 ? r1 : r2;
    return [cx + Math.cos(a) * r, cy + Math.sin(a) * r] as [number, number];
  });
  const starD = pts8.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`).join(" ") + " Z";
  // Background corners
  const result: { d: string; fill: string }[] = [
    { d: `M0,0 L${w},0 L${w},${h} L0,${h} Z`, fill: c2 },
    { d: starD, fill: c1 },
  ];
  // Corner squares
  const sq = Math.min(w, h) * 0.22;
  [[0, 0], [w - sq, 0], [0, h - sq], [w - sq, h - sq]].forEach(([qx, qy]) => {
    result.push({ d: `M${qx},${qy} L${qx + sq},${qy} L${qx + sq},${qy + sq} L${qx},${qy + sq} Z`, fill: c3 });
  });
  return result;
}

// ─── Women seated around the frame ────────────────────────────────────────────
type Quilter = {
  x: number; y: number; side: "top" | "bottom" | "left" | "right";
  dress: string; hair: string; lean: number;
};

const QUILTERS: Quilter[] = [
  { x: QF_X + QF_W * 0.2,  y: QF_Y - 32,           side: "top",    dress: "#c83228", hair: "#2a1a0a", lean: -3  },
  { x: QF_X + QF_W * 0.5,  y: QF_Y - 32,           side: "top",    dress: "#1a3a6a", hair: "#5a3820", lean:  2  },
  { x: QF_X + QF_W * 0.78, y: QF_Y - 32,           side: "top",    dress: "#2a5a38", hair: "#2a1a0a", lean: -2  },
  { x: QF_X + QF_W * 0.18, y: QF_Y + QF_H + 28,    side: "bottom", dress: "#8b2a8b", hair: "#3a2010", lean:  4  },
  { x: QF_X + QF_W * 0.55, y: QF_Y + QF_H + 28,    side: "bottom", dress: "#c87828", hair: "#2a1a0a", lean: -3  },
  { x: QF_X - 42,           y: QF_Y + QF_H * 0.35,  side: "left",   dress: "#1a3a6a", hair: "#7a5030", lean:  5  },
  { x: QF_X - 42,           y: QF_Y + QF_H * 0.72,  side: "left",   dress: "#6a2818", hair: "#2a1a0a", lean: -4  },
];

// ─── Wood stove (left wall) ────────────────────────────────────────────────────
const STOVE_X = 68;
const STOVE_Y = FLOOR_Y - 140;
const STOVE_W = 88;
const STOVE_H = 128;

// ─── Sampler on wall ──────────────────────────────────────────────────────────
const SAM_X = 320;
const SAM_Y = WALL_Y + 18;
const SAM_W = 88;
const SAM_H = 72;

// Sampler cross-stitch pattern (row of motifs)
const SAMPLER_TEXT = "HOME IS WHERE THE HEART IS";
const SAMPLER_MOTIFS = [
  { x: 12, y: 14, type: "heart" },
  { x: 66, y: 14, type: "heart" },
] as { x: number; y: number; type: string }[];

// ─── Cat curled by stove ───────────────────────────────────────────────────────
const CAT_X = STOVE_X + STOVE_W + 18;
const CAT_Y = FLOOR_Y - 22;

// ─── Apple basket by door ─────────────────────────────────────────────────────
const BASKET_X = W - 110;
const BASKET_Y = FLOOR_Y - 28;

// ─── Candle holders on windowsill ─────────────────────────────────────────────
const CANDLE_XS = [WINDOW_X + 18, WINDOW_X + WINDOW_W - 28];

// ─── Fireflies / dust motes in window light ───────────────────────────────────
type DustMote = { cx: number; cy: number; delay: number; r: number };
const DUST_MOTES: DustMote[] = Array.from({ length: 22 }, (_, i) => {
  const ang = i * 137.508 * Math.PI / 180;
  const rr  = Math.sqrt(i / 22) * 90;
  return {
    cx:    WINDOW_X + WINDOW_W * 0.5 + Math.cos(ang) * rr,
    cy:    WINDOW_Y + WINDOW_H * 0.5 + Math.sin(ang) * rr * 0.6,
    delay: (i * 0.55) % 5,
    r:     1.5 + (i % 3) * 0.8,
  };
});

// ─── Needle positions (on quilt, animated dipping) ────────────────────────────
type Needle = { x: number; y: number; angle: number; color: string };
const NEEDLES: Needle[] = QUILTERS.slice(0, 4).map((q, i) => ({
  x: QF_X + (i % QF_COLS) * CELL_W * 2 + CELL_W,
  y: QF_Y + (i % QF_ROWS) * CELL_H * 1.5 + CELL_H,
  angle: -30 + i * 18,
  color: q.dress,
}));

// ─── Braided rug on floor ──────────────────────────────────────────────────────
const RUG_CX = QF_X + QF_W * 0.5;
const RUG_CY = FLOOR_Y - 18;
const RUG_RX = 200;
const RUG_RY = 42;
const RUG_RINGS = 5;

export function QuiltingBee() {
  const ref   = useRef<SVGSVGElement>(null);
  const [active, setActive]       = useState(false);
  const [stovePhase, setStovePhase]   = useState(0);  // ember flicker
  const [needlePhase, setNeedlePhase] = useState(0);  // needle dip

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e?.isIntersecting) setActive(true); },
      { threshold: 0.12 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!active) return;
    let t = 0;
    const tick = setInterval(() => {
      t += 0.025;
      setStovePhase(t);
      setNeedlePhase(t);
    }, 16);
    return () => clearInterval(tick);
  }, [active]);

  const tr = (d: number) =>
    active ? `opacity 0.75s ease ${d}s, transform 0.75s ease ${d}s` : "none";

  // Stove ember flicker
  const emberBright = 0.65 + Math.sin(stovePhase * 2.8) * 0.28 + Math.sin(stovePhase * 5.3) * 0.08;

  // Needle dip offsets (each needle slightly out of phase)
  const needleDips = NEEDLES.map((_, i) =>
    Math.sin(needlePhase * 1.6 + i * 1.1) * 5
  );

  // Smoke puffs from stove
  const smokeY = [
    STOVE_Y - 18 - ((stovePhase * 18) % 40),
    STOVE_Y - 26 - ((stovePhase * 18 + 14) % 40),
    STOVE_Y - 34 - ((stovePhase * 18 + 28) % 40),
  ];
  const smokeOpacity = smokeY.map(sy => {
    const age = (STOVE_Y - sy) / 40;
    return Math.max(0, 0.35 - age * 0.35);
  });

  return (
    <section style={{ background: "#2a1e14", overflow: "hidden", position: "relative" }}>
      <style>{`
        @keyframes qb-dust-float {
          0%   { transform: translate(0, 0); opacity: 0.05; }
          30%  { opacity: 0.45; }
          70%  { opacity: 0.3; }
          100% { transform: translate(var(--qb-dx, 8px), var(--qb-dy, -14px)); opacity: 0; }
        }
        @keyframes qb-candle-flicker {
          0%,100% { transform: scaleX(1) scaleY(1); opacity: 0.85; }
          25%     { transform: scaleX(0.8) scaleY(1.2); opacity: 0.95; }
          60%     { transform: scaleX(1.2) scaleY(0.88); opacity: 0.7; }
        }
        @keyframes qb-cat-breathe {
          0%,100% { transform: scaleY(1); }
          50%     { transform: scaleY(1.06); }
        }
        @keyframes qb-window-dust {
          0%   { transform: translateY(0) translateX(0); opacity: 0; }
          15%  { opacity: 0.55; }
          85%  { opacity: 0.35; }
          100% { transform: translateY(-22px) translateX(var(--qb-wx, 6px)); opacity: 0; }
        }
        .qb-candle-flame { animation: qb-candle-flicker 1.8s ease-in-out infinite; transform-origin: bottom center; }
        .qb-cat-body     { animation: qb-cat-breathe 3.8s ease-in-out infinite; transform-origin: center; }
        .qb-dust         { animation: qb-dust-float 6s ease-in-out infinite; }
        .qb-window-mote  { animation: qb-window-dust 8s ease-in infinite; }
      `}</style>

      <svg
        ref={ref}
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="xMidYMid slice"
        style={{ display: "block", width: "100%", height: "auto", minHeight: 340 }}
        aria-label="1800s New England quilting bee — women gathered around a large quilting frame, wood stove, sampler on wall, afternoon window light"
        role="img"
      >
        <defs>
          {/* Warm afternoon window light shaft */}
          <linearGradient id="qb-window-light" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%"   stopColor="#f8d880" stopOpacity="0"   />
            <stop offset="40%"  stopColor="#f8d880" stopOpacity="0.18"/>
            <stop offset="100%" stopColor="#f0c060" stopOpacity="0.08"/>
          </linearGradient>
          <linearGradient id="qb-wall" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#c8b898" />
            <stop offset="100%" stopColor="#b8a888" />
          </linearGradient>
          <linearGradient id="qb-floor" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#8a6030" />
            <stop offset="100%" stopColor="#6a4820" />
          </linearGradient>
          <radialGradient id="qb-stove-glow" cx="50%" cy="90%" r="50%">
            <stop offset="0%"   stopColor="#ff8820" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#e05010" stopOpacity="0"   />
          </radialGradient>
          <radialGradient id="qb-ember" cx="50%" cy="80%" r="50%">
            <stop offset="0%"   stopColor="#ff9820" />
            <stop offset="60%"  stopColor="#cc4010" />
            <stop offset="100%" stopColor="#660000" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="qb-candle-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="#f8d060" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#f0a020" stopOpacity="0"   />
          </radialGradient>
          <linearGradient id="qb-window-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#8ab8e8" />
            <stop offset="60%"  stopColor="#c8d8f0" />
            <stop offset="100%" stopColor="#f0e8c0" />
          </linearGradient>
          <linearGradient id="qb-rug-grad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%"   stopColor="#c83228" />
            <stop offset="25%"  stopColor="#1a3a6a" />
            <stop offset="50%"  stopColor="#2a6838" />
            <stop offset="75%"  stopColor="#8b2a8b" />
            <stop offset="100%" stopColor="#c87828" />
          </linearGradient>
          <filter id="qb-warm-blur" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="12" />
          </filter>
          <filter id="qb-soft-blur">
            <feGaussianBlur stdDeviation="2.5" />
          </filter>
          <clipPath id="qb-window-clip">
            <rect x={WINDOW_X} y={WINDOW_Y} width={WINDOW_W} height={WINDOW_H} />
          </clipPath>
          <clipPath id="qb-frame-clip">
            <rect x={QF_X} y={QF_Y} width={QF_W} height={QF_H} />
          </clipPath>
        </defs>

        {/* ── Plaster wall ── */}
        <rect x="0" y={WALL_Y} width={W} height={FLOOR_Y - WALL_Y} fill="url(#qb-wall)" />
        {/* Wall texture (faint horizontal grain lines) */}
        {Array.from({ length: 14 }, (_, i) => (
          <line key={i}
            x1="0" y1={WALL_Y + 22 + i * ((FLOOR_Y - WALL_Y - 44) / 14)}
            x2={W}  y2={WALL_Y + 22 + i * ((FLOOR_Y - WALL_Y - 44) / 14)}
            stroke="#a89870" strokeWidth="0.5" opacity="0.25"
          />
        ))}

        {/* ── Wainscoting (lower wall paneling) ── */}
        <rect x="0" y={FLOOR_Y - 90} width={W} height={92} fill="#a89060" />
        <rect x="0" y={FLOOR_Y - 92} width={W} height={4}  fill="#7a6040" />
        {/* Panel grooves */}
        {Array.from({ length: 18 }, (_, i) => (
          <rect key={i}
            x={i * 82 + 6} y={FLOOR_Y - 86} width={70} height={80}
            rx="2" fill="none" stroke="#7a6040" strokeWidth="1.5" opacity="0.5"
          />
        ))}

        {/* ── Hardwood floor ── */}
        <rect x="0" y={FLOOR_Y - 4} width={W} height={H - FLOOR_Y + 4} fill="url(#qb-floor)" />
        {/* Floorboard planks */}
        {Array.from({ length: 28 }, (_, i) => (
          <line key={i}
            x1={i * 52} y1={FLOOR_Y} x2={i * 52} y2={H}
            stroke="#5a3818" strokeWidth="1" opacity="0.5"
          />
        ))}
        {/* Horizontal board breaks */}
        {Array.from({ length: 6 }, (_, i) => (
          <line key={i}
            x1="0" y1={FLOOR_Y + 28 + i * 40} x2={W} y2={FLOOR_Y + 28 + i * 40}
            stroke="#5a3818" strokeWidth="0.7" opacity="0.3"
          />
        ))}

        {/* ── Braided rug under frame ── */}
        <g style={{ opacity: active ? 1 : 0, transition: tr(0.1) }}>
          {Array.from({ length: RUG_RINGS }, (_, ri) => {
            const scale = 1 - ri * (0.9 / RUG_RINGS);
            return (
              <ellipse key={ri}
                cx={RUG_CX} cy={RUG_CY}
                rx={RUG_RX * scale} ry={RUG_RY * scale}
                fill={ri % 2 === 0 ? "#c83228" : "#1a3a6a"}
                opacity={0.55 + ri * 0.06}
              />
            );
          })}
          {/* Rug braid texture arcs */}
          {Array.from({ length: 18 }, (_, i) => {
            const a1 = (i / 18) * Math.PI * 2;
            const a2 = ((i + 0.48) / 18) * Math.PI * 2;
            return (
              <path key={i}
                d={`M${RUG_CX + Math.cos(a1) * RUG_RX * 0.8},${RUG_CY + Math.sin(a1) * RUG_RY * 0.8}
                    Q${RUG_CX + Math.cos((a1 + a2) / 2) * RUG_RX * 0.88},${RUG_CY + Math.sin((a1 + a2) / 2) * RUG_RY * 0.88}
                    ${RUG_CX + Math.cos(a2) * RUG_RX * 0.8},${RUG_CY + Math.sin(a2) * RUG_RY * 0.8}`}
                fill="none" stroke="#8b2a8b" strokeWidth="2" opacity="0.3"
              />
            );
          })}
        </g>

        {/* ── Window (right wall) — looking out at autumn afternoon ── */}
        <g style={{ opacity: active ? 1 : 0, transition: tr(0.08) }}>
          {/* Window exterior sky + trees */}
          <rect x={WINDOW_X} y={WINDOW_Y} width={WINDOW_W} height={WINDOW_H}
            fill="url(#qb-window-sky)" />
          {/* Distant hills */}
          <path
            d={`M${WINDOW_X},${WINDOW_Y + WINDOW_H * 0.58} Q${WINDOW_X + 60},${WINDOW_Y + WINDOW_H * 0.42} ${WINDOW_X + WINDOW_W * 0.5},${WINDOW_Y + WINDOW_H * 0.5} Q${WINDOW_X + WINDOW_W * 0.78},${WINDOW_Y + WINDOW_H * 0.38} ${WINDOW_X + WINDOW_W},${WINDOW_Y + WINDOW_H * 0.52} L${WINDOW_X + WINDOW_W},${WINDOW_Y + WINDOW_H} L${WINDOW_X},${WINDOW_Y + WINDOW_H} Z`}
            fill="#6a8a40" clipPath="url(#qb-window-clip)"
          />
          {/* Autumn maples outside */}
          {[WINDOW_X + 30, WINDOW_X + WINDOW_W - 26].map((tx, ti) => (
            <g key={ti} clipPath="url(#qb-window-clip)">
              <line x1={tx} y1={WINDOW_Y + WINDOW_H}
                x2={tx} y2={WINDOW_Y + WINDOW_H * 0.42}
                stroke="#3a2010" strokeWidth="5" />
              {[[-18, 0, 28, 20], [0, -18, 24, 18], [16, -4, 22, 16]].map(([dx, dy, rx, ry], bi) => (
                <ellipse key={bi}
                  cx={tx + dx} cy={WINDOW_Y + WINDOW_H * 0.42 + dy}
                  rx={rx} ry={ry}
                  fill={ti === 0 ? "#c84818" : "#e07820"} opacity="0.88"
                />
              ))}
            </g>
          ))}
          {/* Window frame (muntins — 4 panes wide × 6 panes tall) */}
          {/* Horizontal bars */}
          {Array.from({ length: 5 }, (_, i) => (
            <line key={i}
              x1={WINDOW_X} y1={WINDOW_Y + (WINDOW_H / 6) * (i + 1)}
              x2={WINDOW_X + WINDOW_W} y2={WINDOW_Y + (WINDOW_H / 6) * (i + 1)}
              stroke="#c8b890" strokeWidth="4"
            />
          ))}
          {/* Vertical bars */}
          {Array.from({ length: 3 }, (_, i) => (
            <line key={i}
              x1={WINDOW_X + (WINDOW_W / 4) * (i + 1)} y1={WINDOW_Y}
              x2={WINDOW_X + (WINDOW_W / 4) * (i + 1)} y2={WINDOW_Y + WINDOW_H}
              stroke="#c8b890" strokeWidth="4"
            />
          ))}
          {/* Frame border */}
          <rect x={WINDOW_X - 6} y={WINDOW_Y - 6}
            width={WINDOW_W + 12} height={WINDOW_H + 12}
            rx="2" fill="none" stroke="#a89068" strokeWidth="8" />
          {/* Windowsill */}
          <rect x={WINDOW_X - 12} y={WINDOW_Y + WINDOW_H + 6}
            width={WINDOW_W + 24} height={18}
            rx="2" fill="#b8a878" />
          {/* Wavy glass glare */}
          {Array.from({ length: 3 }, (_, i) => (
            <path key={i}
              d={`M${WINDOW_X + 14 + i * 58},${WINDOW_Y + 12} Q${WINDOW_X + 26 + i * 58},${WINDOW_Y + 28} ${WINDOW_X + 14 + i * 58},${WINDOW_Y + 44}`}
              fill="none" stroke="white" strokeWidth="3" opacity={0.14 + i * 0.04}
              clipPath="url(#qb-window-clip)"
            />
          ))}
        </g>

        {/* ── Window light shaft (diagonal cone) ── */}
        <path
          d={`M${WINDOW_X},${WINDOW_Y + WINDOW_H * 0.2} L${WINDOW_X + WINDOW_W},${WINDOW_Y} L${QF_X + QF_W * 0.9},${FLOOR_Y} L${QF_X + QF_W * 0.45},${FLOOR_Y} Z`}
          fill="url(#qb-window-light)" opacity="0.7"
        />

        {/* ── Dust motes in window light ── */}
        {DUST_MOTES.map((dm, i) => (
          <circle key={i}
            cx={dm.cx} cy={dm.cy} r={dm.r}
            fill="#f8e8a0"
            className="qb-window-mote"
            style={{
              animationDelay: `${dm.delay}s`,
              animationDuration: `${7 + i % 4}s`,
              ["--qb-wx" as string]: `${-6 + (i % 5) * 3}px`,
            }}
          />
        ))}

        {/* ── Wood stove (cast iron, left wall) ── */}
        <g style={{ opacity: active ? 1 : 0, transition: tr(0.05) }}>
          {/* Stove glow on floor */}
          <ellipse cx={STOVE_X + STOVE_W * 0.5} cy={FLOOR_Y - 8} rx={62} ry={18}
            fill="#ff6010" opacity={emberBright * 0.28}
            style={{ filter: "blur(8px)" }}
          />
          {/* Body */}
          <rect x={STOVE_X} y={STOVE_Y} width={STOVE_W} height={STOVE_H}
            rx="4" fill="#2a2a2a" stroke="#1a1a1a" strokeWidth="2" />
          {/* Legs */}
          {[STOVE_X + 10, STOVE_X + STOVE_W - 14].map((lx, li) => (
            <rect key={li} x={lx} y={STOVE_Y + STOVE_H} width={8} height={18} rx="2" fill="#1a1a1a" />
          ))}
          {/* Fire door */}
          <rect x={STOVE_X + 14} y={STOVE_Y + STOVE_H - 58} width={STOVE_W - 28} height={44}
            rx="3" fill="#1a1a1a" stroke="#3a3a3a" strokeWidth="2" />
          {/* Ember glow through door */}
          <rect x={STOVE_X + 16} y={STOVE_Y + STOVE_H - 56} width={STOVE_W - 32} height={40}
            rx="2" fill="url(#qb-ember)" opacity={emberBright}
          />
          {/* Door latch */}
          <circle cx={STOVE_X + STOVE_W - 20} cy={STOVE_Y + STOVE_H - 36}
            r={4} fill="#8a8060" />
          {/* Top plate / cooktop */}
          <rect x={STOVE_X - 4} y={STOVE_Y - 8} width={STOVE_W + 8} height={12}
            rx="2" fill="#3a3a3a" />
          {/* Stovepipe */}
          <rect x={STOVE_X + STOVE_W * 0.5 - 10} y={WALL_Y - 4} width={20} height={STOVE_Y - WALL_Y + 12}
            fill="#2a2a2a" />
          {/* Pipe collar */}
          <ellipse cx={STOVE_X + STOVE_W * 0.5} cy={STOVE_Y - 2} rx={12} ry={6} fill="#3a3a3a" />
          {/* Smoke puffs */}
          {smokeY.map((sy, si) => (
            <circle key={si}
              cx={STOVE_X + STOVE_W * 0.5 + si * 3}
              cy={sy}
              r={6 + si * 2}
              fill="#a89880"
              opacity={smokeOpacity[si] ?? 0}
              style={{ filter: "blur(3px)" }}
            />
          ))}
          {/* Firewood stack beside stove */}
          {[0, 1, 2].map(li => (
            <g key={li}>
              <ellipse cx={STOVE_X - 22} cy={FLOOR_Y - 18 - li * 14} rx={16} ry={7}
                fill={["#5a3010", "#6a3818", "#4a2808"][li] ?? "#5a3010"} />
              <ellipse cx={STOVE_X - 22} cy={FLOOR_Y - 25 - li * 14} rx={7} ry={7}
                fill={["#7a4820", "#8a5828", "#6a3c18"][li] ?? "#7a4820"} />
            </g>
          ))}
        </g>

        {/* ── Sampler on wall ── */}
        <g style={{ opacity: active ? 1 : 0, transition: tr(0.22) }}>
          {/* Frame */}
          <rect x={SAM_X - 6} y={SAM_Y - 6} width={SAM_W + 12} height={SAM_H + 12}
            rx="2" fill="#8a6030" />
          <rect x={SAM_X} y={SAM_Y} width={SAM_W} height={SAM_H}
            fill="#f8f0d8" />
          {/* Cross-stitch grid background */}
          {Array.from({ length: 12 }, (_, r) =>
            Array.from({ length: 16 }, (_, c) => (
              <rect key={`${r}-${c}`}
                x={SAM_X + c * (SAM_W / 16)} y={SAM_Y + r * (SAM_H / 12)}
                width={SAM_W / 16 - 0.5} height={SAM_H / 12 - 0.5}
                fill="none" stroke="#d8c8a8" strokeWidth="0.4" opacity="0.6"
              />
            ))
          )}
          {/* Sampler text (tiny cross-stitch style) */}
          <text x={SAM_X + SAM_W * 0.5} y={SAM_Y + SAM_H * 0.52}
            textAnchor="middle"
            fontFamily="'Georgia', serif" fontSize="7.5" letterSpacing="1"
            fill="#8b2a2a" fontWeight="bold">
            {SAMPLER_TEXT.slice(0, 14)}
          </text>
          <text x={SAM_X + SAM_W * 0.5} y={SAM_Y + SAM_H * 0.68}
            textAnchor="middle"
            fontFamily="'Georgia', serif" fontSize="7.5" letterSpacing="1"
            fill="#8b2a2a" fontWeight="bold">
            {SAMPLER_TEXT.slice(14)}
          </text>
          {/* Heart motifs */}
          {SAMPLER_MOTIFS.map((sm, i) => (
            <path key={i}
              d={`M${SAM_X + sm.x + 4},${SAM_Y + sm.y + 2} C${SAM_X + sm.x + 4},${SAM_Y + sm.y} ${SAM_X + sm.x},${SAM_Y + sm.y} ${SAM_X + sm.x},${SAM_Y + sm.y + 3} C${SAM_X + sm.x},${SAM_Y + sm.y + 6} ${SAM_X + sm.x + 4},${SAM_Y + sm.y + 8} ${SAM_X + sm.x + 4},${SAM_Y + sm.y + 9} C${SAM_X + sm.x + 4},${SAM_Y + sm.y + 8} ${SAM_X + sm.x + 8},${SAM_Y + sm.y + 6} ${SAM_X + sm.x + 8},${SAM_Y + sm.y + 3} C${SAM_X + sm.x + 8},${SAM_Y + sm.y} ${SAM_X + sm.x + 4},${SAM_Y + sm.y} ${SAM_X + sm.x + 4},${SAM_Y + sm.y + 2} Z`}
              fill="#c83228"
            />
          ))}
          {/* Border (running stitch look) */}
          {Array.from({ length: 20 }, (_, i) => (
            <rect key={i}
              x={SAM_X + 3 + i * ((SAM_W - 6) / 20)} y={SAM_Y + 3}
              width={(SAM_W - 6) / 22} height={3}
              fill="#c83228" opacity={i % 2 === 0 ? 0.7 : 0.05}
            />
          ))}
        </g>

        {/* ── Quilt frame (large wooden stretcher) ── */}
        <g style={{
          opacity: active ? 1 : 0,
          transform: active ? "translateY(0)" : "translateY(18px)",
          transition: tr(0.15),
        }}>
          {/* Quilt blocks (clipped to frame) */}
          <g clipPath="url(#qb-frame-clip)">
            {Array.from({ length: QF_ROWS }, (_, row) =>
              Array.from({ length: QF_COLS }, (_, col) => {
                const bx = QF_X + col * CELL_W;
                const by = QF_Y + row * CELL_H;
                const type = blockType(col, row);
                const palette = blockPalette(col, row);
                let paths: { d: string; fill: string }[] = [];
                if (type === "pinwheel")      paths = pinwheelPaths(CELL_W, CELL_H, palette);
                else if (type === "log_cabin") paths = logCabinPaths(CELL_W, CELL_H, palette);
                else if (type === "nine_patch") paths = ninePatchPaths(CELL_W, CELL_H, palette);
                else if (type === "flying_geese") paths = flyingGeesePaths(CELL_W, CELL_H, palette);
                else                           paths = starPaths(CELL_W, CELL_H, palette);
                return (
                  <g key={`${row}-${col}`} transform={`translate(${bx},${by})`}>
                    {paths.map((pp, pi) => (
                      <path key={pi} d={pp.d} fill={pp.fill} />
                    ))}
                    {/* Cell border (seam) */}
                    <rect x="0.5" y="0.5" width={CELL_W - 1} height={CELL_H - 1}
                      fill="none" stroke="#c8b898" strokeWidth="0.7" opacity="0.5" />
                  </g>
                );
              })
            )}
          </g>
          {/* Frame rails (wooden) */}
          <rect x={QF_X - 14} y={QF_Y - 14} width={QF_W + 28} height={16} rx="6" fill="#8a5820" />
          <rect x={QF_X - 14} y={QF_Y + QF_H - 2}  width={QF_W + 28} height={16} rx="6" fill="#8a5820" />
          <rect x={QF_X - 14} y={QF_Y - 14} width={16} height={QF_H + 28} rx="6" fill="#7a4e18" />
          <rect x={QF_X + QF_W - 2}  y={QF_Y - 14} width={16} height={QF_H + 28} rx="6" fill="#7a4e18" />
          {/* Clamp pegs at corners */}
          {[
            [QF_X - 14, QF_Y - 14], [QF_X + QF_W - 2, QF_Y - 14],
            [QF_X - 14, QF_Y + QF_H - 2], [QF_X + QF_W - 2, QF_Y + QF_H - 2],
          ].map(([px, py], ci) => (
            <circle key={ci} cx={(px ?? 0) + 8} cy={(py ?? 0) + 8} r={8}
              fill="#5a3810" stroke="#3a2008" strokeWidth="2" />
          ))}
          {/* Frame shadow (quilt slightly elevated) */}
          <rect x={QF_X} y={QF_Y} width={QF_W} height={QF_H}
            fill="none" stroke="rgba(0,0,0,0.18)" strokeWidth="3" />
        </g>

        {/* ── Needles dipping into quilt ── */}
        {NEEDLES.map((nd, i) => {
          const dip = needleDips[i] ?? 0;
          return (
            <g key={i} style={{
              transform: `translate(${nd.x}px, ${nd.y + dip}px) rotate(${nd.angle}deg)`,
              transformOrigin: `${nd.x}px ${nd.y}px`,
              transition: "none",
              opacity: active ? 0.82 : 0,
            }}>
              <line x1="0" y1="-18" x2="0" y2="8"
                stroke="#c8c0a0" strokeWidth="1.5" strokeLinecap="round" />
              <ellipse cx="0" cy="-18" rx="2" ry="3" fill={nd.color} />
            </g>
          );
        })}

        {/* ── Quilters seated around frame ── */}
        {QUILTERS.map((qr, i) => (
          <g key={i} style={{
            opacity: active ? 1 : 0,
            transform: active ? "translateY(0)" : "translateY(16px)",
            transition: tr(0.2 + i * 0.04),
          }}>
            {/* Chair / stool */}
            {qr.side === "bottom" && (
              <ellipse cx={qr.x} cy={qr.y + 22} rx={18} ry={7} fill="#7a5020" />
            )}
            {/* Skirt / lower body */}
            <ellipse cx={qr.x + (qr.side === "left" ? 8 : 0)} cy={qr.y + 18}
              rx={22} ry={28}
              fill={qr.dress}
              style={{ transform: `rotate(${qr.lean}deg)`, transformOrigin: `${qr.x}px ${qr.y}px` }}
            />
            {/* Bodice */}
            <rect
              x={qr.x - 11 + (qr.side === "left" ? 8 : 0)} y={qr.y - 16}
              width={22} height={26}
              rx="4" fill={qr.dress}
              style={{ transform: `rotate(${qr.lean}deg)`, transformOrigin: `${qr.x}px ${qr.y}px` }}
            />
            {/* Arms reaching toward frame */}
            {qr.side === "top" && (
              <path d={`M${qr.x + 10},${qr.y} Q${qr.x + 22},${qr.y + 16} ${qr.x + 28},${qr.y + 38}`}
                fill="none" stroke={qr.dress} strokeWidth="9" strokeLinecap="round" />
            )}
            {qr.side === "bottom" && (
              <path d={`M${qr.x - 10},${qr.y} Q${qr.x - 22},${qr.y - 18} ${qr.x - 28},${qr.y - 40}`}
                fill="none" stroke={qr.dress} strokeWidth="9" strokeLinecap="round" />
            )}
            {qr.side === "left" && (
              <path d={`M${qr.x + 16},${qr.y - 4} Q${qr.x + 34},${qr.y + 4} ${qr.x + 48},${qr.y + 10}`}
                fill="none" stroke={qr.dress} strokeWidth="9" strokeLinecap="round" />
            )}
            {/* Head */}
            <circle cx={qr.x + (qr.side === "left" ? 6 : 0)} cy={qr.y - 24} r={12}
              fill="#d4a878" />
            {/* Hair bun */}
            <ellipse cx={qr.x + (qr.side === "left" ? 6 : 0)} cy={qr.y - 34}
              rx={10} ry={7}
              fill={qr.hair} />
            <circle cx={qr.x + (qr.side === "left" ? 12 : 4)} cy={qr.y - 36} r={5}
              fill={qr.hair} />
            {/* Apron (for those on top/bottom) */}
            {qr.side !== "left" && (
              <rect x={qr.x - 10} y={qr.y - 6} width={20} height={24}
                rx="2" fill="#f0e8d0" opacity="0.5" />
            )}
          </g>
        ))}

        {/* ── Cat curled by stove ── */}
        <g style={{
          opacity: active ? 1 : 0,
          transition: tr(0.32),
        }}>
          {/* Cat body (curled ellipse) */}
          <ellipse cx={CAT_X} cy={CAT_Y} rx={22} ry={12}
            fill="#c8a860" className="qb-cat-body" />
          {/* Tail */}
          <path d={`M${CAT_X + 18},${CAT_Y + 6} Q${CAT_X + 34},${CAT_Y + 2} ${CAT_X + 28},${CAT_Y - 8}`}
            fill="none" stroke="#c8a860" strokeWidth="8" strokeLinecap="round" />
          {/* Head */}
          <circle cx={CAT_X - 16} cy={CAT_Y - 8} r={10} fill="#c8a860" />
          {/* Ears */}
          <polygon points={`${CAT_X - 20},${CAT_Y - 17} ${CAT_X - 14},${CAT_Y - 22} ${CAT_X - 10},${CAT_Y - 17}`}
            fill="#b89050" />
          <polygon points={`${CAT_X - 11},${CAT_Y - 15} ${CAT_X - 7},${CAT_Y - 18} ${CAT_X - 4},${CAT_Y - 14}`}
            fill="#b89050" />
          {/* Eyes (closed — sleeping) */}
          <path d={`M${CAT_X - 20},${CAT_Y - 8} Q${CAT_X - 17},${CAT_Y - 10} ${CAT_X - 14},${CAT_Y - 8}`}
            fill="none" stroke="#5a3010" strokeWidth="1.5" />
          <path d={`M${CAT_X - 12},${CAT_Y - 8} Q${CAT_X - 9},${CAT_Y - 10} ${CAT_X - 6},${CAT_Y - 8}`}
            fill="none" stroke="#5a3010" strokeWidth="1.5" />
          {/* Whiskers */}
          {[[-4, -2], [-2, 0], [-4, 2]].map(([dy, dx], wi) => (
            <line key={wi}
              x1={CAT_X - 16} y1={CAT_Y + dy - 6}
              x2={CAT_X - 30 + dx * 2} y2={CAT_Y + dy - 6 + wi - 1}
              stroke="#c8c0a0" strokeWidth="0.8" opacity="0.7"
            />
          ))}
        </g>

        {/* ── Candles on windowsill ── */}
        {CANDLE_XS.map((cx, ci) => (
          <g key={ci} style={{ opacity: active ? 1 : 0, transition: tr(0.28) }}>
            {/* Glow halo */}
            <circle cx={cx} cy={WINDOW_Y + WINDOW_H + 2} r={28}
              fill="url(#qb-candle-glow)" opacity="0.6" />
            {/* Holder */}
            <ellipse cx={cx} cy={WINDOW_Y + WINDOW_H + 14} rx={10} ry={4} fill="#c8a860" />
            {/* Candle body */}
            <rect x={cx - 5} y={WINDOW_Y + WINDOW_H - 26} width={10} height={42}
              rx="2" fill="#f8f0d8" />
            {/* Drips */}
            <path d={`M${cx - 3},${WINDOW_Y + WINDOW_H - 26} Q${cx - 5},${WINDOW_Y + WINDOW_H - 18} ${cx - 4},${WINDOW_Y + WINDOW_H - 12}`}
              fill="none" stroke="#f8eecc" strokeWidth="3" />
            {/* Wick */}
            <line x1={cx} y1={WINDOW_Y + WINDOW_H - 28} x2={cx - 1} y2={WINDOW_Y + WINDOW_H - 32}
              stroke="#3a2010" strokeWidth="1.5" />
            {/* Flame */}
            <ellipse cx={cx - 1} cy={WINDOW_Y + WINDOW_H - 38} rx={5} ry={8}
              fill="#f8b020" className="qb-candle-flame" opacity="0.9" />
            <ellipse cx={cx - 1} cy={WINDOW_Y + WINDOW_H - 36} rx={3} ry={5}
              fill="#fff8a0" className="qb-candle-flame"
              style={{ animationDelay: "0.3s" }} opacity="0.95" />
          </g>
        ))}

        {/* ── Apple basket by door ── */}
        <g style={{ opacity: active ? 1 : 0, transition: tr(0.38) }}>
          {/* Basket body */}
          <path d={`M${BASKET_X - 28},${BASKET_Y} Q${BASKET_X - 32},${BASKET_Y + 28} ${BASKET_X - 28},${BASKET_Y + 42} L${BASKET_X + 28},${BASKET_Y + 42} Q${BASKET_X + 32},${BASKET_Y + 28} ${BASKET_X + 28},${BASKET_Y}`}
            fill="#a07040" stroke="#7a5020" strokeWidth="1.5" />
          {/* Weave bands */}
          {[8, 16, 24, 32].map(by => (
            <line key={by} x1={BASKET_X - 28 + by * 0.1} y1={BASKET_Y + by}
              x2={BASKET_X + 28 - by * 0.1} y2={BASKET_Y + by}
              stroke="#7a5020" strokeWidth="1.5" opacity="0.5"
            />
          ))}
          {/* Handle */}
          <path d={`M${BASKET_X - 20},${BASKET_Y} Q${BASKET_X},${BASKET_Y - 22} ${BASKET_X + 20},${BASKET_Y}`}
            fill="none" stroke="#8a6030" strokeWidth="5" strokeLinecap="round" />
          {/* Apples */}
          {[[-14, -6], [0, -10], [12, -8], [-6, -18], [8, -20]].map(([ax, ay], ai) => (
            <g key={ai}>
              <circle cx={BASKET_X + ax} cy={BASKET_Y + ay} r={9}
                fill={ai % 2 === 0 ? "#c83028" : "#e84818"} />
              <path d={`M${BASKET_X + ax},${BASKET_Y + ay - 9} Q${BASKET_X + ax + 2},${BASKET_Y + ay - 14} ${BASKET_X + ax + 4},${BASKET_Y + ay - 12}`}
                fill="none" stroke="#2a5a10" strokeWidth="2" />
            </g>
          ))}
        </g>

        {/* ── Scene label ── */}
        <g style={{
          opacity: active ? 1 : 0,
          transform: active ? "translateY(0)" : "translateY(-8px)",
          transition: tr(0.08),
        }}>
          <text x={W / 2} y={H - 12} textAnchor="middle"
            fontFamily="'Georgia', serif" fontSize="11" fill="#d4b880"
            letterSpacing="3" opacity="0.65">
            SHREWSBURY · QUILTING BEE · CIRCA 1858
          </text>
        </g>
      </svg>
    </section>
  );
}
