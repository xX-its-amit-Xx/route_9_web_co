"use client";
import { useEffect, useRef, useState } from "react";

const W = 1440;
const H = 560;

// ─── Ground plane ─────────────────────────────────────────────────────────────
const GROUND_Y = 380;
const HORIZON_Y = 195;

// ─── Carousel ─────────────────────────────────────────────────────────────────
const CAR_CX = 720;
const CAR_CY = 282;
const CAR_R_OUT = 88;   // canopy radius
const CAR_R_IN  = 22;   // hub radius
const CAR_POSTS = 10;   // number of swing rods

type CarPod = { angle: number; color: string; label: string };
const CAR_PODS: CarPod[] = [
  { angle:   0, color: "#c8283c", label: "A" },
  { angle:  36, color: "#e8a020", label: "B" },
  { angle:  72, color: "#2a6e3a", label: "C" },
  { angle: 108, color: "#1a4a8c", label: "D" },
  { angle: 144, color: "#8b2a8b", label: "E" },
  { angle: 180, color: "#c8283c", label: "F" },
  { angle: 216, color: "#e8a020", label: "G" },
  { angle: 252, color: "#2a6e3a", label: "H" },
  { angle: 288, color: "#1a4a8c", label: "I" },
  { angle: 324, color: "#8b2a8b", label: "J" },
];

// ─── Vendor tents ─────────────────────────────────────────────────────────────
type Tent = {
  x: number; y: number; w: number; h: number;
  color1: string; color2: string; label: string; subLabel: string;
};
const TENTS: Tent[] = [
  { x: 90,  y: 270, w: 220, h: 120, color1: "#c83228", color2: "#f0e8d0", label: "APPLE CIDER", subLabel: "Fresh Pressed Daily" },
  { x: 340, y: 280, w: 190, h: 108, color1: "#1a4a8c", color2: "#f0e8d0", label: "PIE JUDGING", subLabel: "Enter by 2 o'clock" },
  { x: 960, y: 275, w: 200, h: 115, color1: "#2a6e3a", color2: "#f0e8d0", label: "PUMPKINS & GOURDS", subLabel: "Pick Your Own" },
  { x: 1170,y: 268, w: 215, h: 122, color1: "#8b5a1a", color2: "#f0e8d0", label: "MAPLE SYRUP", subLabel: "Route 9 Farm" },
];

// ─── Pumpkin display ──────────────────────────────────────────────────────────
type Pumpkin = { cx: number; cy: number; rx: number; ry: number; color: string; stemH: number };
const PUMPKINS: Pumpkin[] = [
  { cx: 580, cy: 415, rx: 38, ry: 30, color: "#c85a10", stemH: 12 },
  { cx: 628, cy: 420, rx: 28, ry: 22, color: "#d4780c", stemH:  9 },
  { cx: 664, cy: 418, rx: 32, ry: 26, color: "#b84c0c", stemH: 11 },
  { cx: 700, cy: 416, rx: 42, ry: 32, color: "#c86010", stemH: 13 },
  { cx: 752, cy: 420, rx: 26, ry: 20, color: "#d47210", stemH:  8 },
  { cx: 784, cy: 415, rx: 35, ry: 28, color: "#b85010", stemH: 10 },
  { cx: 820, cy: 419, rx: 22, ry: 18, color: "#e07820", stemH:  7 },
  // gourds
  { cx: 850, cy: 421, rx: 14, ry: 22, color: "#8a9a2a", stemH:  8 },
  { cx: 870, cy: 418, rx: 16, ry: 25, color: "#6a8a1a", stemH:  9 },
  { cx: 888, cy: 420, rx: 12, ry: 20, color: "#c8b020", stemH:  7 },
];

// ─── Hay bales ────────────────────────────────────────────────────────────────
type HayBale = { x: number; y: number; w: number; h: number };
const HAY_BALES: HayBale[] = [
  { x: 68,  y: 398, w: 58, h: 38 },
  { x: 118, y: 398, w: 58, h: 38 },
  { x: 93,  y: 362, w: 58, h: 38 },  // stacked
  { x: 910, y: 398, w: 55, h: 36 },
  { x: 958, y: 398, w: 55, h: 36 },
  { x: 933, y: 364, w: 55, h: 36 },
];

// ─── Corn stalks ──────────────────────────────────────────────────────────────
type CornStalk = { x: number; baseY: number; h: number; lean: number };
const CORN_STALKS: CornStalk[] = [
  { x: 52,  baseY: 440, h: 110, lean:  4 },
  { x: 72,  baseY: 438, h: 120, lean: -3 },
  { x: 92,  baseY: 442, h: 105, lean:  5 },
  { x: 112, baseY: 440, h: 115, lean: -2 },
  { x: 1328,baseY: 440, h: 112, lean:  3 },
  { x: 1348,baseY: 438, h: 118, lean: -4 },
  { x: 1368,baseY: 442, h: 108, lean:  4 },
  { x: 1388,baseY: 440, h: 122, lean: -3 },
];

// ─── Bunting flags ────────────────────────────────────────────────────────────
type BuntingPt = [number, number];
// Catenary curve from (80,160) → (720,140) → (1360,155)
const BUNTING_PTS_L: BuntingPt[] = [
  [80, 160], [160, 178], [240, 188], [320, 192], [400, 188],
  [480, 180], [560, 174], [640, 170], [720, 168],
];
const BUNTING_PTS_R: BuntingPt[] = [
  [720, 168], [800, 170], [880, 174], [960, 180],
  [1040, 188], [1120, 192], [1200, 188], [1280, 178], [1360, 162],
];
const BUNTING_COLORS = ["#c8283c","#1a4a8c","#2a6e3a","#e8a020","#8b2a8b","#c8283c","#1a4a8c"];
type BuntingFlag = { x1: number; y1: number; x2: number; y2: number; color: string };
function makeBunting(pts: BuntingPt[]): BuntingFlag[] {
  const flags: BuntingFlag[] = [];
  for (let i = 0; i < pts.length - 1; i++) {
    const [x1, y1] = pts[i] ?? [0, 0];
    const [x2, y2] = pts[i + 1] ?? [0, 0];
    const mid = Math.floor((pts.length - 1) / 2);
    const color = BUNTING_COLORS[(i + (i > mid ? 1 : 0)) % BUNTING_COLORS.length] ?? "#c8283c";
    flags.push({ x1, y1, x2, y2, color });
  }
  return flags;
}
const FLAGS_L = makeBunting(BUNTING_PTS_L);
const FLAGS_R = makeBunting(BUNTING_PTS_R);

// ─── Background trees ─────────────────────────────────────────────────────────
type BgTree = { cx: number; ty: number; th: number; cr: number; shade: string };
const BG_TREES: BgTree[] = [
  { cx: 38,   ty: 155, th: 80, cr: 28, shade: "#b85a10" },
  { cx: 78,   ty: 145, th: 95, cr: 32, shade: "#c86820" },
  { cx: 148,  ty: 160, th: 70, cr: 24, shade: "#d47820" },
  { cx: 1292, ty: 158, th: 75, cr: 26, shade: "#b85a10" },
  { cx: 1355, ty: 148, th: 90, cr: 30, shade: "#c86820" },
  { cx: 1408, ty: 162, th: 68, cr: 22, shade: "#d47820" },
  // far center trees
  { cx: 520,  ty: 170, th: 60, cr: 20, shade: "#8a5a30" },
  { cx: 558,  ty: 165, th: 68, cr: 22, shade: "#9a6838" },
  { cx: 880,  ty: 168, th: 62, cr: 21, shade: "#8a5a30" },
  { cx: 918,  ty: 172, th: 56, cr: 19, shade: "#9a6838" },
];

// ─── Crowd silhouettes ────────────────────────────────────────────────────────
type Person = { x: number; y: number; h: number; color: string };
const CROWD: Person[] = [
  { x: 210, y: 390, h: 52, color: "#2a1a0a" },
  { x: 228, y: 386, h: 56, color: "#3a2a1a" },
  { x: 246, y: 392, h: 50, color: "#1a1410" },
  { x: 460, y: 388, h: 54, color: "#2a1a0a" },
  { x: 478, y: 384, h: 58, color: "#3a2a1a" },
  { x: 496, y: 390, h: 52, color: "#1a1410" },
  { x: 514, y: 386, h: 56, color: "#2a1a0a" },
  // near carousel
  { x: 615, y: 382, h: 46, color: "#3a2a1a" },
  { x: 630, y: 380, h: 50, color: "#2a1a0a" },
  { x: 808, y: 384, h: 48, color: "#1a1410" },
  { x: 823, y: 380, h: 52, color: "#2a1a0a" },
];

// ─── Pennant strings (smaller flags on tents) ────────────────────────────────
type Pennant = { x: number; y: number; color: string };
function tentPennants(tent: Tent): Pennant[] {
  return Array.from({ length: 5 }, (_, i) => ({
    x: tent.x + 10 + i * (tent.w / 5),
    y: tent.y + 10,
    color: BUNTING_COLORS[i % BUNTING_COLORS.length] ?? "#c8283c",
  }));
}

// ─── Prize ribbon ─────────────────────────────────────────────────────────────
const RIBBON_CX = 430;
const RIBBON_CY = 385;

export function HarvestFair() {
  const ref = useRef<SVGSVGElement>(null);
  const [active, setActive] = useState(false);
  const [carAngle, setCarAngle] = useState(0);

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
    let a = 0;
    const tick = setInterval(() => {
      a = (a + 0.35) % 360;
      setCarAngle(a);
    }, 16);
    return () => clearInterval(tick);
  }, [active]);

  const tr = (d: number) =>
    active ? `opacity 0.7s ease ${d}s, transform 0.7s ease ${d}s` : "none";

  const toRad = (deg: number) => deg * Math.PI / 180;

  return (
    <section
      style={{
        background: "linear-gradient(180deg,#e8c878 0%,#d4b060 35%,#c8a050 100%)",
        overflow: "hidden",
        position: "relative",
      }}
    >
      <style>{`
        @keyframes hf-flag-wave {
          0%,100% { d: path("M0,0 L8,4 L0,8 Z"); }
          50%      { d: path("M0,0 L10,3 L2,8 Z"); }
        }
        @keyframes hf-sway {
          0%,100% { transform: rotate(-3deg); }
          50%     { transform: rotate(3deg); }
        }
        @keyframes hf-bounce {
          0%,100% { transform: translateY(0); }
          50%     { transform: translateY(-4px); }
        }
        @keyframes hf-smoke {
          0%   { transform: translateY(0) scale(1); opacity: 0.5; }
          100% { transform: translateY(-40px) scale(1.8); opacity: 0; }
        }
        .hf-sway  { animation: hf-sway 2.8s ease-in-out infinite; }
        .hf-smoke { animation: hf-smoke 3s ease-out infinite; }
      `}</style>
      <svg
        ref={ref}
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="xMidYMid slice"
        style={{ display: "block", width: "100%", height: "auto", minHeight: 320 }}
        aria-label="Shrewsbury town common harvest fair with carousel, vendor tents, and prize pumpkins"
        role="img"
      >
        <defs>
          <linearGradient id="hf-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#f0c060" />
            <stop offset="40%"  stopColor="#e8b050" />
            <stop offset="100%" stopColor="#dca040" />
          </linearGradient>
          <linearGradient id="hf-ground" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#7a8a3a" />
            <stop offset="50%"  stopColor="#6a7a30" />
            <stop offset="100%" stopColor="#4a5a20" />
          </linearGradient>
          <radialGradient id="hf-sun" cx="50%" cy="30%" r="30%">
            <stop offset="0%"   stopColor="#fff0a0" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#f0c060" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="hf-tent-shadow" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#000000" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0" />
          </linearGradient>
          <radialGradient id="hf-carousel-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="#fff8e0" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#fff8e0" stopOpacity="0" />
          </radialGradient>
          <clipPath id="hf-clip">
            <rect x="0" y="0" width={W} height={H} />
          </clipPath>
        </defs>

        {/* ── Sky ── */}
        <rect x="0" y="0" width={W} height={HORIZON_Y + 20} fill="url(#hf-sky)" />
        {/* Sun haze */}
        <ellipse cx={W * 0.62} cy={60} rx={180} ry={80} fill="url(#hf-sun)" />

        {/* ── Ground ── */}
        <rect x="0" y={GROUND_Y} width={W} height={H - GROUND_Y} fill="url(#hf-ground)" />
        {/* Mid-ground grass band */}
        <path
          d={`M0,${HORIZON_Y + 10} Q${W * 0.25},${HORIZON_Y + 5} ${W * 0.5},${HORIZON_Y + 8} Q${W * 0.75},${HORIZON_Y + 11} ${W},${HORIZON_Y + 6} L${W},${GROUND_Y} L0,${GROUND_Y} Z`}
          fill="#8a9a48"
        />
        {/* Near ground */}
        <path
          d={`M0,${GROUND_Y} Q${W * 0.3},${GROUND_Y - 8} ${W * 0.6},${GROUND_Y - 4} Q${W * 0.8},${GROUND_Y} ${W},${GROUND_Y - 6} L${W},${H} L0,${H} Z`}
          fill="#6a7a30"
        />

        {/* ── Background trees (autumn) ── */}
        {BG_TREES.map((bt, i) => (
          <g key={i}>
            <line x1={bt.cx} y1={bt.ty + bt.th} x2={bt.cx} y2={bt.ty + bt.th * 0.55}
              stroke="#5a3820" strokeWidth="7" strokeLinecap="round" />
            <ellipse cx={bt.cx} cy={bt.ty + bt.cr} rx={bt.cr * 1.1} ry={bt.cr}
              fill={bt.shade} opacity="0.88" />
            <ellipse cx={bt.cx - bt.cr * 0.4} cy={bt.ty + bt.cr * 0.6} rx={bt.cr * 0.7} ry={bt.cr * 0.5}
              fill={bt.shade} opacity="0.7" />
          </g>
        ))}

        {/* ── Bunting flags ── */}
        {/* Rope lines */}
        <polyline
          points={BUNTING_PTS_L.map(([x, y]) => `${x},${y}`).join(" ")}
          fill="none" stroke="#8a6830" strokeWidth="1.5" opacity="0.7"
        />
        <polyline
          points={BUNTING_PTS_R.map(([x, y]) => `${x},${y}`).join(" ")}
          fill="none" stroke="#8a6830" strokeWidth="1.5" opacity="0.7"
        />
        {/* Triangle flags */}
        {[...FLAGS_L, ...FLAGS_R].map((fl, i) => {
          const mx = (fl.x1 + fl.x2) / 2;
          const my = (fl.y1 + fl.y2) / 2 + 22;
          return (
            <polygon key={i}
              points={`${fl.x1},${fl.y1} ${fl.x2},${fl.y2} ${mx},${my}`}
              fill={fl.color} opacity="0.9" />
          );
        })}

        {/* ── Pole supports for bunting ── */}
        {[[80, 160], [720, 168], [1360, 162]].map(([px, py], i) => (
          <line key={i} x1={px} y1={py ?? 160} x2={px} y2={GROUND_Y}
            stroke="#8a7055" strokeWidth="6" strokeLinecap="round" />
        ))}

        {/* ── Vendor tents ── */}
        {TENTS.map((tent, i) => (
          <g key={i}
             style={{
               opacity: active ? 1 : 0,
               transform: active ? "translateY(0)" : "translateY(20px)",
               transition: tr(0.15 + i * 0.08),
             }}>
            {/* Shadow */}
            <ellipse cx={tent.x + tent.w / 2} cy={tent.y + tent.h + 8}
              rx={tent.w * 0.45} ry={12} fill="#000000" opacity="0.12" />
            {/* Tent body with alternating stripes */}
            {Array.from({ length: 6 }, (_, s) => (
              <rect key={s}
                x={tent.x + s * (tent.w / 6)} y={tent.y + 28}
                width={tent.w / 6} height={tent.h - 28}
                fill={s % 2 === 0 ? tent.color1 : tent.color2}
                opacity="0.95"
              />
            ))}
            {/* Tent roof */}
            <polygon
              points={`${tent.x - 12},${tent.y + 28} ${tent.x + tent.w / 2},${tent.y} ${tent.x + tent.w + 12},${tent.y + 28}`}
              fill={tent.color1}
            />
            {/* Roof scalloped edge */}
            {Array.from({ length: 7 }, (_, s) => {
              const sx = tent.x - 12 + s * ((tent.w + 24) / 6);
              return (
                <ellipse key={s} cx={sx} cy={tent.y + 28} rx={10} ry={8}
                  fill={tent.color2} />
              );
            })}
            {/* Counter surface */}
            <rect x={tent.x + 10} y={tent.y + tent.h - 28} width={tent.w - 20} height={14}
              rx="2" fill="#d4c090" stroke="#a08040" strokeWidth="1" />
            {/* Label */}
            <text x={tent.x + tent.w / 2} y={tent.y + 60}
              textAnchor="middle" fontFamily="'Georgia', serif"
              fontSize="12" fontWeight="bold" fill="#f8f0e0" letterSpacing="1">
              {tent.label}
            </text>
            <text x={tent.x + tent.w / 2} y={tent.y + 76}
              textAnchor="middle" fontFamily="'Georgia', serif"
              fontSize="9" fill="#f0e8d0" letterSpacing="0.5" opacity="0.85">
              {tent.subLabel}
            </text>
            {/* Pennants on tent */}
            {tentPennants(tent).map((pn, pi) => (
              <polygon key={pi}
                points={`${pn.x},${pn.y} ${pn.x + 8},${pn.y + 4} ${pn.x},${pn.y + 8}`}
                fill={pn.color} opacity="0.8"
                className="hf-sway"
                style={{ transformOrigin: `${pn.x}px ${pn.y}px`, animationDelay: `${pi * 0.18}s` }}
              />
            ))}
          </g>
        ))}

        {/* ── Cider press / barrel at left tent ── */}
        <g style={{
          opacity: active ? 1 : 0,
          transform: active ? "translateY(0)" : "translateY(12px)",
          transition: tr(0.5),
        }}>
          {/* Barrel */}
          <ellipse cx={188} cy={408} rx={24} ry={14} fill="#8a6030" />
          <rect x={164} y={380} width={48} height={30} fill="#9a7040" />
          <ellipse cx={188} cy={380} rx={24} ry={10} fill="#a07848" />
          {/* Barrel bands */}
          {[390, 400, 410].map((by, i) => (
            <line key={i} x1={164} y1={by} x2={212} y2={by}
              stroke="#5a3820" strokeWidth="2.5" />
          ))}
          {/* CIDER tap */}
          <rect x={208} y={397} width={12} height={6} rx="2" fill="#6a4820" />
          {/* Drip */}
          <ellipse cx={221} cy={406} rx={3} ry={4} fill="#c87020" opacity="0.7" />
          {/* Smoke from cider kettle */}
          {[0, 1, 2].map(i => (
            <ellipse key={i} cx={188 + i * 8 - 8} cy={365}
              rx={6} ry={8} fill="#d4c8a0" opacity="0.35"
              className="hf-smoke"
              style={{ animationDelay: `${i * 0.9}s` }} />
          ))}
        </g>

        {/* ── Pumpkins ── */}
        <g style={{
          opacity: active ? 1 : 0,
          transform: active ? "translateY(0)" : "translateY(14px)",
          transition: tr(0.4),
        }}>
          {PUMPKINS.map((pk, i) => (
            <g key={i}>
              {/* Pumpkin body (3 lobes) */}
              <ellipse cx={pk.cx - pk.rx * 0.3} cy={pk.cy} rx={pk.rx * 0.55} ry={pk.ry * 0.9}
                fill={pk.color} opacity="0.9" />
              <ellipse cx={pk.cx} cy={pk.cy} rx={pk.rx * 0.65} ry={pk.ry}
                fill={pk.color} />
              <ellipse cx={pk.cx + pk.rx * 0.3} cy={pk.cy} rx={pk.rx * 0.55} ry={pk.ry * 0.9}
                fill={pk.color} opacity="0.9" />
              {/* Rib lines */}
              <line x1={pk.cx} y1={pk.cy - pk.ry} x2={pk.cx} y2={pk.cy + pk.ry}
                stroke="#8a3808" strokeWidth="1.2" opacity="0.5" />
              {/* Stem */}
              <line x1={pk.cx} y1={pk.cy - pk.ry}
                x2={pk.cx + 3} y2={pk.cy - pk.ry - pk.stemH}
                stroke="#4a6820" strokeWidth="3" strokeLinecap="round" />
              {/* Highlight */}
              <ellipse cx={pk.cx - pk.rx * 0.25} cy={pk.cy - pk.ry * 0.3}
                rx={pk.rx * 0.2} ry={pk.ry * 0.18}
                fill="#ffffff" opacity="0.18" />
            </g>
          ))}
        </g>

        {/* ── Hay bales ── */}
        <g style={{
          opacity: active ? 1 : 0,
          transform: active ? "translateY(0)" : "translateY(10px)",
          transition: tr(0.35),
        }}>
          {HAY_BALES.map((hb, i) => (
            <g key={i}>
              <rect x={hb.x} y={hb.y} width={hb.w} height={hb.h}
                rx="4" fill="#d4a030" stroke="#a07820" strokeWidth="1.5" />
              {/* Twine */}
              <line x1={hb.x + hb.w * 0.33} y1={hb.y} x2={hb.x + hb.w * 0.33} y2={hb.y + hb.h}
                stroke="#8a6820" strokeWidth="2" />
              <line x1={hb.x + hb.w * 0.67} y1={hb.y} x2={hb.x + hb.w * 0.67} y2={hb.y + hb.h}
                stroke="#8a6820" strokeWidth="2" />
              {/* Texture lines */}
              {Array.from({ length: 4 }, (_, t) => (
                <line key={t} x1={hb.x + 4} y1={hb.y + 8 + t * 7} x2={hb.x + hb.w - 4} y2={hb.y + 8 + t * 7}
                  stroke="#b88a20" strokeWidth="1" opacity="0.5" />
              ))}
            </g>
          ))}
        </g>

        {/* ── Corn stalks ── */}
        {CORN_STALKS.map((cs, i) => (
          <g key={i}
             className="hf-sway"
             style={{ transformOrigin: `${cs.x}px ${cs.baseY}px`, animationDelay: `${i * 0.22}s` }}>
            <line x1={cs.x} y1={cs.baseY} x2={cs.x + cs.lean} y2={cs.baseY - cs.h}
              stroke="#7a8a30" strokeWidth="4" strokeLinecap="round" />
            {/* Leaves */}
            {[0.3, 0.55, 0.75].map((frac, li) => {
              const lx = cs.x + cs.lean * frac;
              const ly = cs.baseY - cs.h * frac;
              const side = li % 2 === 0 ? 1 : -1;
              return (
                <path key={li}
                  d={`M${lx},${ly} Q${lx + side * 28},${ly - 8} ${lx + side * 18},${ly + 14}`}
                  fill="#8a9a38" stroke="#6a7a28" strokeWidth="0.8" opacity="0.9" />
              );
            })}
            {/* Ear of corn */}
            <ellipse cx={cs.x + cs.lean * 0.65 + 4} cy={cs.baseY - cs.h * 0.65}
              rx={6} ry={14} fill="#e8c030" opacity="0.85" />
          </g>
        ))}

        {/* ── Carousel ── */}
        <g style={{
          opacity: active ? 1 : 0,
          transform: active ? "scale(1)" : "scale(0.85)",
          transformOrigin: `${CAR_CX}px ${CAR_CY}px`,
          transition: tr(0.25),
        }}>
          {/* Glow */}
          <circle cx={CAR_CX} cy={CAR_CY} r={CAR_R_OUT + 30} fill="url(#hf-carousel-glow)" />

          {/* Base platform */}
          <ellipse cx={CAR_CX} cy={GROUND_Y - 8} rx={CAR_R_OUT + 12} ry={22}
            fill="#5a3820" stroke="#3a2010" strokeWidth="2" />
          <ellipse cx={CAR_CX} cy={GROUND_Y - 14} rx={CAR_R_OUT + 8} ry={16}
            fill="#6a4828" />

          {/* Carousel spokes */}
          {CAR_PODS.map((pod, i) => {
            const ang = toRad(pod.angle + carAngle);
            const x2 = CAR_CX + Math.cos(ang) * (CAR_R_OUT - 16);
            const y2 = CAR_CY + Math.sin(ang) * (CAR_R_OUT - 16) * 0.45;
            return (
              <line key={i} x1={CAR_CX} y1={CAR_CY}
                x2={x2} y2={y2}
                stroke="#8a7055" strokeWidth="2" opacity="0.6" />
            );
          })}

          {/* Canopy */}
          <ellipse cx={CAR_CX} cy={CAR_CY - 8} rx={CAR_R_OUT} ry={CAR_R_OUT * 0.3}
            fill="#c83228" stroke="#8a1818" strokeWidth="2" />
          {/* Canopy stripes */}
          {Array.from({ length: 12 }, (_, i) => {
            const a1 = toRad(i * 30);
            const a2 = toRad(i * 30 + 15);
            return (
              <path key={i}
                d={`M${CAR_CX},${CAR_CY - 8} L${CAR_CX + Math.cos(a1) * CAR_R_OUT},${CAR_CY - 8 + Math.sin(a1) * CAR_R_OUT * 0.3} A${CAR_R_OUT},${CAR_R_OUT * 0.3} 0 0,1 ${CAR_CX + Math.cos(a2) * CAR_R_OUT},${CAR_CY - 8 + Math.sin(a2) * CAR_R_OUT * 0.3} Z`}
                fill={i % 2 === 0 ? "#f0e8d0" : "#c83228"} opacity="0.7" />
            );
          })}
          {/* Canopy scallop edge */}
          {Array.from({ length: 16 }, (_, i) => {
            const a = toRad(i * 22.5 + carAngle * 0.5);
            return (
              <ellipse key={i}
                cx={CAR_CX + Math.cos(a) * CAR_R_OUT}
                cy={CAR_CY - 8 + Math.sin(a) * CAR_R_OUT * 0.3}
                rx={9} ry={7} fill="#f0e8d0" opacity="0.85" />
            );
          })}

          {/* Top spire */}
          <line x1={CAR_CX} y1={CAR_CY - 8 - CAR_R_OUT * 0.3}
            x2={CAR_CX} y2={CAR_CY - 8 - CAR_R_OUT * 0.3 - 38}
            stroke="#8a1818" strokeWidth="5" />
          <polygon
            points={`${CAR_CX - 10},${CAR_CY - 8 - CAR_R_OUT * 0.3 - 38} ${CAR_CX + 10},${CAR_CY - 8 - CAR_R_OUT * 0.3 - 38} ${CAR_CX},${CAR_CY - 8 - CAR_R_OUT * 0.3 - 62}`}
            fill="#c83228" />
          {/* Spire flag */}
          <polygon
            points={`${CAR_CX},${CAR_CY - 8 - CAR_R_OUT * 0.3 - 62} ${CAR_CX + 22},${CAR_CY - 8 - CAR_R_OUT * 0.3 - 55} ${CAR_CX},${CAR_CY - 8 - CAR_R_OUT * 0.3 - 48}`}
            fill="#e8a020" className="hf-sway"
            style={{ transformOrigin: `${CAR_CX}px ${CAR_CY - 8 - CAR_R_OUT * 0.3 - 62}px` }}
          />

          {/* Carousel pods (rotating) */}
          {CAR_PODS.map((pod, i) => {
            const ang = toRad(pod.angle + carAngle);
            const px = CAR_CX + Math.cos(ang) * (CAR_R_OUT - 16);
            const py = CAR_CY + Math.sin(ang) * (CAR_R_OUT - 16) * 0.45;
            // Only show pods above the platform line
            if (py > GROUND_Y - 20) return null;
            return (
              <g key={i}>
                {/* Hanging rod */}
                <line x1={CAR_CX + Math.cos(ang) * (CAR_R_OUT - 30)} y1={CAR_CY + Math.sin(ang) * (CAR_R_OUT - 30) * 0.45}
                  x2={px} y2={py + 24}
                  stroke="#8a7055" strokeWidth="1.5" />
                {/* Car */}
                <rect x={px - 11} y={py + 24} width={22} height={16}
                  rx="3" fill={pod.color} stroke="#3a2010" strokeWidth="1" />
              </g>
            );
          })}

          {/* Center hub */}
          <circle cx={CAR_CX} cy={CAR_CY} r={CAR_R_IN}
            fill="#8a7055" stroke="#5a4030" strokeWidth="3" />
          <circle cx={CAR_CX} cy={CAR_CY} r={CAR_R_IN * 0.5}
            fill="#c8a040" />
        </g>

        {/* ── Prize ribbon at pie judging tent ── */}
        <g style={{
          opacity: active ? 1 : 0,
          transition: tr(0.6),
        }}>
          <circle cx={RIBBON_CX} cy={RIBBON_CY} r={18}
            fill="#c8283c" stroke="#8a1818" strokeWidth="2" />
          <text x={RIBBON_CX} y={RIBBON_CY + 5} textAnchor="middle"
            fontFamily="'Georgia', serif" fontSize="11" fontWeight="bold" fill="#f8f0d0">
            1st
          </text>
          {/* Ribbon tails */}
          {[-15, 15].map((tx, i) => (
            <path key={i}
              d={`M${RIBBON_CX + tx},${RIBBON_CY + 16} L${RIBBON_CX + tx - 5},${RIBBON_CY + 38} L${RIBBON_CX + tx + 8},${RIBBON_CY + 36} Z`}
              fill="#c8283c" />
          ))}
        </g>

        {/* ── Crowd silhouettes ── */}
        <g style={{
          opacity: active ? 1 : 0,
          transform: active ? "translateY(0)" : "translateY(8px)",
          transition: tr(0.55),
        }}>
          {CROWD.map((p, i) => (
            <g key={i}>
              {/* Body */}
              <rect x={p.x - 9} y={p.y - p.h + 16} width={18} height={p.h - 16}
                rx="2" fill={p.color} />
              {/* Head */}
              <circle cx={p.x} cy={p.y - p.h + 10} r={9} fill={p.color} />
              {/* Hat (some) */}
              {i % 3 === 0 && (
                <rect x={p.x - 8} y={p.y - p.h + 2} width={16} height={6}
                  rx="1" fill="#3a2010" />
              )}
            </g>
          ))}
        </g>

        {/* ── Sign / banner ── */}
        <g style={{
          opacity: active ? 1 : 0,
          transform: active ? "translateY(0)" : "translateY(-12px)",
          transition: tr(0.1),
        }}>
          <rect x={560} y={96} width={320} height={48} rx="4"
            fill="#2a1a08" stroke="#c8a040" strokeWidth="2.5" />
          <text x={720} y={118} textAnchor="middle"
            fontFamily="'Georgia', serif" fontSize="16" fontWeight="bold"
            fill="#c8a040" letterSpacing="3">
            SHREWSBURY HARVEST FAIR
          </text>
          <text x={720} y={135} textAnchor="middle"
            fontFamily="'Georgia', serif" fontSize="10" fill="#d4b870" letterSpacing="2">
            TOWN COMMON · ROUTE 9 · EST. 1844
          </text>
        </g>

        {/* ── Ground path / dirt track ── */}
        <ellipse cx={CAR_CX} cy={GROUND_Y + 10} rx={CAR_R_OUT + 40} ry={18}
          fill="#a09050" opacity="0.4" />
      </svg>
    </section>
  );
}
