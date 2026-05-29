"use client";
import { useEffect, useRef, useState } from "react";

// Pass 57: Lake Quinsigamond fishing pier at dawn — wooden dock, mist, bobbers, rowboat, cattails

const W = 1440, H = 560;
const HORIZON_Y = 218;
const WATER_Y = HORIZON_Y + 6;

// ─── Sky gradient ─────────────────────────────────────────────────────────
// Pre-dawn lavender bleeding into peach/rose at horizon

// ─── Far shore treeline ────────────────────────────────────────────────────
const SHORE_D =
  "M 0,206 " +
  "C 60,196 120,200 180,192 C 240,184 300,196 370,188 C 440,180 510,192 580,186 " +
  "C 650,180 720,188 800,182 C 880,176 960,186 1040,180 " +
  "C 1120,174 1200,184 1280,178 C 1340,174 1400,180 1440,176 " +
  "L 1440,226 L 0,226 Z";

// Silhouette trees on far shore
type FarTree = [number, number, number];
const FAR_TREES: FarTree[] = [
  [28,200,10],[58,194,12],[92,198,10],[128,192,14],[168,196,11],[206,190,13],
  [248,194,11],[292,188,12],[334,192,10],[378,186,13],[422,190,11],[468,184,12],
  [514,188,10],[562,182,13],[612,186,11],[664,180,12],[716,184,10],[770,178,13],
  [826,182,11],[884,176,12],[942,180,10],[1002,174,13],[1062,178,11],[1122,172,12],
  [1182,176,10],[1244,170,13],[1304,174,11],[1362,170,12],[1412,174,10],
];

// ─── Mist layers ──────────────────────────────────────────────────────────
type MistBand = { y: number; ry: number; opacity: number; delay: string };
const MIST_BANDS: MistBand[] = [
  { y: WATER_Y + 8,   ry: 18, opacity: 0.38, delay: "0s"   },
  { y: WATER_Y + 28,  ry: 22, opacity: 0.28, delay: "1.2s" },
  { y: WATER_Y + 52,  ry: 18, opacity: 0.22, delay: "0.6s" },
  { y: WATER_Y + 82,  ry: 14, opacity: 0.16, delay: "1.8s" },
  { y: WATER_Y + 116, ry: 12, opacity: 0.12, delay: "0.9s" },
];

// ─── Water ripple rings ───────────────────────────────────────────────────
type Ripple = { cx: number; cy: number; delay: string };
const RIPPLES: Ripple[] = [
  { cx: 320,  cy: WATER_Y + 68,  delay: "0s"   },
  { cx: 640,  cy: WATER_Y + 112, delay: "1.4s" },
  { cx: 980,  cy: WATER_Y + 86,  delay: "0.7s" },
  { cx: 1180, cy: WATER_Y + 148, delay: "2.1s" },
  { cx: 180,  cy: WATER_Y + 188, delay: "1.0s" },
];

// ─── Pier / dock ──────────────────────────────────────────────────────────
// The dock extends from the left shore into the lake, slightly angled
const DOCK_NEAR_X = 82,  DOCK_FAR_X  = 570;
const DOCK_NEAR_LY = 478, DOCK_NEAR_RY = 492; // near end (viewer side)
const DOCK_FAR_LY  = 320, DOCK_FAR_RY  = 330; // far end (into lake)

// Dock planks — drawn as quads with perspective
const PLANK_COUNT = 18;
const PLANK_DATA: { p1: [number,number]; p2: [number,number]; p3: [number,number]; p4: [number,number] }[] =
  Array.from({ length: PLANK_COUNT }, (_, i) => {
    const t1 = i / PLANK_COUNT, t2 = (i + 1) / PLANK_COUNT;
    const lx1 = Math.round(DOCK_NEAR_X + (DOCK_FAR_X - DOCK_NEAR_X) * t1);
    const lx2 = Math.round(DOCK_NEAR_X + (DOCK_FAR_X - DOCK_NEAR_X) * t2);
    const ly1 = Math.round(DOCK_NEAR_LY + (DOCK_FAR_LY - DOCK_NEAR_LY) * t1);
    const ly2 = Math.round(DOCK_NEAR_LY + (DOCK_FAR_LY - DOCK_NEAR_LY) * t2);
    const ry1 = Math.round(DOCK_NEAR_RY + (DOCK_FAR_RY - DOCK_NEAR_RY) * t1);
    const ry2 = Math.round(DOCK_NEAR_RY + (DOCK_FAR_RY - DOCK_NEAR_RY) * t2);
    return {
      p1: [lx1, ly1], p2: [lx2, ly2],
      p3: [lx2, ry2], p4: [lx1, ry1],
    };
  });

// Dock support pilings (vertical posts going into water)
const PILING_COUNT = 6;
const PILINGS = Array.from({ length: PILING_COUNT }, (_, i) => {
  const t = i / (PILING_COUNT - 1);
  const topX = Math.round(DOCK_NEAR_X + (DOCK_FAR_X - DOCK_NEAR_X) * t);
  const topY = Math.round(DOCK_NEAR_RY + (DOCK_FAR_RY - DOCK_NEAR_RY) * t);
  const botY = topY + Math.round(32 + (1 - t) * 48);  // deeper near viewer
  return { x: topX, topY, botY };
});

// Dock railings (right side)
const RAIL_Y_TOP = PLANK_DATA.map(p => Math.round((p.p1[1] + p.p4[1]) / 2 - 22));
const RAIL_X     = PLANK_DATA.map(p => p.p1[0]);

// ─── Fishing lines ────────────────────────────────────────────────────────
// Lines cast from the end of the dock
type FishLine = {
  rodX: number; rodY: number;
  bobX: number; bobY: number;
  delay: string;
};
const FISH_LINES: FishLine[] = [
  { rodX: 520, rodY: 330, bobX: 640, bobY: WATER_Y + 52, delay: "0s"   },
  { rodX: 548, rodY: 326, bobX: 720, bobY: WATER_Y + 68, delay: "0.8s" },
  { rodX: 496, rodY: 334, bobX: 560, bobY: WATER_Y + 44, delay: "1.6s" },
];

// Fishing rods (leaning against railing)
const RODS = [
  { x1: 524, y1: 336, x2: 582, y2: 298 },
  { x1: 550, y1: 330, x2: 614, y2: 290 },
];

// ─── Rowboat ──────────────────────────────────────────────────────────────
// Tied to the far end of the dock
const RB_CX = 492, RB_CY = WATER_Y + 88;
const ROWBOAT_HULL_D =
  `M ${RB_CX - 52},${RB_CY + 8} ` +
  `C ${RB_CX - 58},${RB_CY} ${RB_CX + 40},${RB_CY - 2} ${RB_CX + 56},${RB_CY + 8} ` +
  `L ${RB_CX + 48},${RB_CY + 20} L ${RB_CX - 44},${RB_CY + 20} Z`;
// Thwart seats
const THWARTS: [number, number, number][] = [
  [RB_CX - 22, RB_CY + 8, 44],
  [RB_CX + 10, RB_CY + 8, 40],
];
// Mooring rope
const ROPE_D = `M ${RB_CX + 56},${RB_CY + 14} C ${RB_CX + 68},${RB_CY + 18} ${DOCK_FAR_X + 8},${DOCK_FAR_RY + 14} ${DOCK_FAR_X + 12},${DOCK_FAR_RY + 18}`;
// Oars resting in boat
const OAR1_D = `M ${RB_CX - 44},${RB_CY + 14} L ${RB_CX + 38},${RB_CY + 6}`;
const OAR2_D = `M ${RB_CX - 38},${RB_CY + 16} L ${RB_CX + 32},${RB_CY + 9}`;

// ─── Fisherman silhouette ─────────────────────────────────────────────────
// Seated at end of dock, legs dangling
const FM_X = 536, FM_Y = DOCK_FAR_LY + 2;

// ─── Cattails + reeds ─────────────────────────────────────────────────────
type Cattail = [number, number, number, number]; // x, stemH, puffW, puffH
const CATTAILS: Cattail[] = [
  // Left bank cluster
  [1042, 118, 7, 22], [1062, 108, 6, 20], [1078, 122, 7, 22],
  [1094, 112, 6, 18], [1108, 126, 8, 24], [1056, 96, 5, 16],
  [1122, 118, 6, 20], [1138, 108, 7, 22], [1148, 124, 5, 18],
  // Right bank cluster
  [1248, 114, 6, 20], [1264, 104, 7, 22], [1280, 118, 6, 20],
  [1296, 108, 5, 18], [1308, 122, 8, 24], [1318, 112, 6, 20],
  // Near bank reeds (smaller)
  [24,  82, 4, 14],  [38,  74, 3, 12], [52,  88, 4, 14],
  [64,  72, 3, 10],  [76,  84, 4, 14], [88,  68, 3, 12],
];

// ─── Water reflections ────────────────────────────────────────────────────
// Soft blurred color smears mirroring sky palette
type Refl = { cx: number; cy: number; rx: number; ry: number; color: string; opacity: number };
const REFLECTIONS: Refl[] = [
  { cx: 720, cy: WATER_Y + 48, rx: 280, ry: 36, color: "#d8b0c8", opacity: 0.18 },
  { cx: 720, cy: WATER_Y + 90, rx: 360, ry: 24, color: "#e8c0a0", opacity: 0.14 },
  { cx: 200, cy: WATER_Y + 70, rx: 120, ry: 18, color: "#c0a8c0", opacity: 0.12 },
  { cx: 1200,cy: WATER_Y + 80, rx: 140, ry: 20, color: "#d0b8c0", opacity: 0.10 },
];

// Dock reflection (faint vertical smear in water)
const DOCK_REFL_D =
  `M ${DOCK_FAR_X - 16},${DOCK_FAR_RY + 2} ` +
  `L ${DOCK_FAR_X + 16},${DOCK_FAR_RY + 2} ` +
  `L ${DOCK_FAR_X + 22},${DOCK_FAR_RY + 72} ` +
  `L ${DOCK_FAR_X - 10},${DOCK_FAR_RY + 72} Z`;

// ─── Lily pads ────────────────────────────────────────────────────────────
type Lily = [number, number, number]; // cx, cy, r
const LILY_PADS: Lily[] = [
  [860, WATER_Y + 138, 12], [882, WATER_Y + 148, 9],  [844, WATER_Y + 152, 10],
  [900, WATER_Y + 138, 8],  [820, WATER_Y + 162, 11], [870, WATER_Y + 168, 8],
  [1360,WATER_Y + 118, 10], [1380,WATER_Y + 130, 8],  [1348,WATER_Y + 136, 9],
];

// ─── Dragonfly ────────────────────────────────────────────────────────────
const DF_X = 780, DF_Y = WATER_Y + 32;

export function FishingPierScene() {
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
      aria-label="Lake Quinsigamond fishing pier at dawn with mist and rowboat"
      style={{ background: "#18141e", overflow: "hidden" }}
    >
      <style>{`
        @keyframes fps-bobber {
          0%,100% { transform: translateY(0px);  }
          50%      { transform: translateY(4px);  }
        }
        @keyframes fps-mist {
          0%,100% { transform: translateX(0px)  scaleX(1);    opacity: var(--mo); }
          40%      { transform: translateX(12px) scaleX(1.04); opacity: calc(var(--mo) * 1.3); }
          70%      { transform: translateX(-8px) scaleX(0.97); opacity: calc(var(--mo) * 0.8); }
        }
        @keyframes fps-ripple {
          0%   { r: 4;  opacity: 0.6; }
          70%  { r: 28; opacity: 0.2; }
          100% { r: 36; opacity: 0;   }
        }
        @keyframes fps-bob {
          0%,100% { transform: translateY(0px) rotate(0deg); }
          50%      { transform: translateY(2.5px) rotate(0.4deg); }
        }
        @keyframes fps-dragonfly {
          0%,100% { transform: translate(0,0) rotate(0deg);   }
          25%      { transform: translate(18px,-8px) rotate(5deg);  }
          50%      { transform: translate(36px,2px) rotate(-3deg);  }
          75%      { transform: translate(20px,-12px) rotate(4deg); }
        }
        @keyframes fps-line-sway {
          0%,100% { transform: rotate(0deg);   }
          50%      { transform: rotate(1.2deg); }
        }
        .fps-bobber { animation: ${active ? "fps-bobber 2.4s ease-in-out infinite" : "none"}; }
        .fps-dock-bob { animation: ${active ? "fps-bob 5s ease-in-out infinite" : "none"}; }
        .fps-dragonfly { animation: ${active ? "fps-dragonfly 4.8s ease-in-out infinite" : "none"};
          transform-origin: ${DF_X}px ${DF_Y}px; }
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
          {/* Pre-dawn sky */}
          <linearGradient id="fps-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#1a1428" />
            <stop offset="30%"  stopColor="#3a2848" />
            <stop offset="65%"  stopColor="#9a5060" />
            <stop offset="85%"  stopColor="#d07868" />
            <stop offset="100%" stopColor="#e0a070" />
          </linearGradient>
          {/* Lake water */}
          <linearGradient id="fps-water" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#7a5868" />
            <stop offset="18%"  stopColor="#4a3850" />
            <stop offset="50%"  stopColor="#2a2438" />
            <stop offset="100%" stopColor="#14121e" />
          </linearGradient>
          {/* Dock wood */}
          <linearGradient id="fps-dock" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#7a6040" />
            <stop offset="100%" stopColor="#4a3820" />
          </linearGradient>
          {/* Dock side face (darker) */}
          <linearGradient id="fps-dock-side" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#4a3820" />
            <stop offset="100%" stopColor="#2a2010" />
          </linearGradient>
          {/* Rowboat */}
          <linearGradient id="fps-boat" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#5a3c1a" />
            <stop offset="100%" stopColor="#3a2410" />
          </linearGradient>
          {/* Mist */}
          <linearGradient id="fps-mist-g" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%"   stopColor="#e8d8e0" stopOpacity="0" />
            <stop offset="20%"  stopColor="#e8d8e0" stopOpacity="1" />
            <stop offset="80%"  stopColor="#e8d8e0" stopOpacity="1" />
            <stop offset="100%" stopColor="#e8d8e0" stopOpacity="0" />
          </linearGradient>
          {/* Soft blur for reflections + mist */}
          <filter id="fps-blur">
            <feGaussianBlur in="SourceGraphic" stdDeviation="6" />
          </filter>
          <filter id="fps-blur-sm">
            <feGaussianBlur in="SourceGraphic" stdDeviation="2.5" />
          </filter>
          {/* Sunrise glow */}
          <radialGradient id="fps-sunrise" cx="50%" cy="100%" r="70%">
            <stop offset="0%"   stopColor="#f0b060" stopOpacity="0.55" />
            <stop offset="50%"  stopColor="#c05858" stopOpacity="0.22" />
            <stop offset="100%" stopColor="#6a2060" stopOpacity="0"    />
          </radialGradient>
          {/* Cattail puff */}
          <radialGradient id="fps-cattail" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="#6a4a18" />
            <stop offset="100%" stopColor="#3a2a0c" />
          </radialGradient>
        </defs>

        {/* Sky */}
        <rect x={0} y={0} width={W} height={HORIZON_Y + 10} fill="url(#fps-sky)" />

        {/* Sunrise glow at horizon */}
        <ellipse cx={W / 2} cy={HORIZON_Y} rx={W * 0.55} ry={72}
          fill="url(#fps-sunrise)"
          filter="url(#fps-blur)"
          style={{ opacity: active ? 1 : 0, transition: tr(0.1) }}
        />

        {/* Stars (pre-dawn — faint, only near top) */}
        {[
          [88,28],[212,18],[348,36],[504,14],[672,28],[840,16],[1016,32],[1172,20],[1308,28],[1412,14],
          [144,52],[396,44],[628,58],[884,42],[1108,54],[1368,46],
        ].map(([sx, sy], i) => (
          <circle key={i} cx={sx} cy={sy} r={1.2}
            fill="#e8e0f0" opacity={0.5 + (i % 3) * 0.15}
            style={{ opacity: active ? 0.5 + (i % 3) * 0.15 : 0, transition: tr(0.05) }}
          />
        ))}

        {/* Far shore silhouette */}
        <path d={SHORE_D} fill="#1e1c28"
          style={{ opacity: active ? 1 : 0, transition: tr(0.08) }}
        />
        {FAR_TREES.map(([tx, ty, tr2], i) => (
          <ellipse key={i} cx={tx} cy={ty} rx={tr2} ry={tr2 * 0.7}
            fill="#1a1828"
            style={{ opacity: active ? 0.9 : 0, transition: tr(0.03 + i * 0.005) }}
          />
        ))}

        {/* Water */}
        <rect x={0} y={WATER_Y} width={W} height={H - WATER_Y} fill="url(#fps-water)" />

        {/* Sunrise reflection column */}
        <rect x={W / 2 - 48} y={WATER_Y} width={96} height={H - WATER_Y}
          fill="#e08040" opacity={0.07}
          filter="url(#fps-blur)"
          style={{ opacity: active ? 0.07 : 0, transition: tr(0.15) }}
        />

        {/* Sky color reflections */}
        {REFLECTIONS.map((r, i) => (
          <ellipse key={i} cx={r.cx} cy={r.cy} rx={r.rx} ry={r.ry}
            fill={r.color} opacity={r.opacity}
            filter="url(#fps-blur)"
            style={{ opacity: active ? r.opacity : 0, transition: tr(0.12 + i * 0.04) }}
          />
        ))}

        {/* Dock reflection */}
        <path d={DOCK_REFL_D}
          fill="#7a6040" opacity={0.12}
          filter="url(#fps-blur-sm)"
          style={{ opacity: active ? 0.12 : 0, transition: tr(0.3) }}
        />

        {/* Ripple rings */}
        {RIPPLES.map((rpl, i) => (
          <circle key={i}
            cx={rpl.cx} cy={rpl.cy} r={4}
            fill="none" stroke="#c8a8b8" strokeWidth={1}
            style={{
              animation: active
                ? `fps-ripple ${3.2 + (i % 3) * 0.9}s ease-out ${rpl.delay} infinite`
                : "none",
              opacity: active ? 0.5 : 0,
              transition: tr(0.2),
            }}
          />
        ))}

        {/* Mist bands */}
        {MIST_BANDS.map((mb, i) => (
          <ellipse key={i}
            cx={W / 2} cy={mb.y}
            rx={W * 0.52} ry={mb.ry}
            fill="url(#fps-mist-g)"
            style={{
              ["--mo" as string]: mb.opacity,
              animation: active
                ? `fps-mist ${6 + i * 1.1}s ease-in-out ${mb.delay} infinite`
                : "none",
              opacity: active ? mb.opacity : 0,
              transition: tr(0.18 + i * 0.06),
            }}
          />
        ))}

        {/* ─── DOCK ─── */}
        <g className="fps-dock-bob"
          style={{ opacity: active ? 1 : 0, transition: tr(0.2) }}
        >
          {/* Piling shadows in water */}
          {PILINGS.map((pl, i) => (
            <line key={i}
              x1={pl.x} y1={pl.topY}
              x2={pl.x + 2} y2={pl.botY}
              stroke="#2a1e10" strokeWidth={6 - i * 0.6}
              strokeLinecap="round"
            />
          ))}

          {/* Plank side faces (underside) */}
          {PLANK_DATA.map((plk, i) => (
            <polygon key={`s${i}`}
              points={`${plk.p4[0]},${plk.p4[1]} ${plk.p3[0]},${plk.p3[1]} ${plk.p3[0]},${plk.p3[1] + 8} ${plk.p4[0]},${plk.p4[1] + 8}`}
              fill="url(#fps-dock-side)"
              opacity={0.7}
            />
          ))}

          {/* Plank tops */}
          {PLANK_DATA.map((plk, i) => (
            <polygon key={`p${i}`}
              points={`${plk.p1[0]},${plk.p1[1]} ${plk.p2[0]},${plk.p2[1]} ${plk.p3[0]},${plk.p3[1]} ${plk.p4[0]},${plk.p4[1]}`}
              fill={`rgb(${108 + (i % 4) * 4},${86 + (i % 4) * 3},${52 + (i % 4) * 2})`}
            />
          ))}

          {/* Plank gaps (dark lines between planks) */}
          {PLANK_DATA.map((plk, i) => (
            <line key={`g${i}`}
              x1={plk.p1[0]} y1={plk.p1[1]}
              x2={plk.p4[0]} y2={plk.p4[1]}
              stroke="#2a1c0c" strokeWidth={1.5}
            />
          ))}

          {/* Railing posts (left side) */}
          {PLANK_DATA.filter((_, i) => i % 3 === 0).map((plk, i) => {
            const postH = 28 + i * 2;
            return (
              <line key={i}
                x1={plk.p1[0]} y1={plk.p1[1]}
                x2={plk.p1[0]} y2={plk.p1[1] - postH}
                stroke="#8a6840" strokeWidth={4}
                strokeLinecap="round"
              />
            );
          })}
          {/* Railing top rail */}
          <line
            x1={PLANK_DATA[0]?.p1[0] ?? DOCK_NEAR_X} y1={(PLANK_DATA[0]?.p1[1] ?? DOCK_NEAR_LY) - 28}
            x2={PLANK_DATA[PLANK_COUNT - 1]?.p1[0] ?? DOCK_FAR_X} y2={(PLANK_DATA[PLANK_COUNT - 1]?.p1[1] ?? DOCK_FAR_LY) - 42}
            stroke="#8a6840" strokeWidth={4}
          />
        </g>

        {/* ─── FISHING LINES ─── */}
        {FISH_LINES.map((fl, i) => (
          <g key={i} style={{ opacity: active ? 1 : 0, transition: tr(0.35 + i * 0.05) }}>
            {/* Line */}
            <line
              x1={fl.rodX} y1={fl.rodY}
              x2={fl.bobX} y2={fl.bobY}
              stroke="#a08858" strokeWidth={1}
              style={{
                animation: active ? `fps-line-sway ${2.8 + i * 0.6}s ease-in-out ${i * 0.4}s infinite` : "none",
                transformOrigin: `${fl.rodX}px ${fl.rodY}px`,
              }}
            />
            {/* Bobber */}
            <g className="fps-bobber" style={{ animationDelay: `${i * 0.7}s` }}>
              <ellipse cx={fl.bobX} cy={fl.bobY} rx={5} ry={7}
                fill="#e83820" />
              <ellipse cx={fl.bobX} cy={fl.bobY + 5} rx={5} ry={4}
                fill="#f8f8f0" />
              {/* Bobber stick */}
              <line x1={fl.bobX} y1={fl.bobY - 7} x2={fl.bobX} y2={fl.bobY - 14}
                stroke="#c8a050" strokeWidth={1.5} />
            </g>
          </g>
        ))}

        {/* Fishing rods */}
        {RODS.map((rod, i) => (
          <line key={i}
            x1={rod.x1} y1={rod.y1} x2={rod.x2} y2={rod.y2}
            stroke="#9a7040" strokeWidth={3} strokeLinecap="round"
            style={{ opacity: active ? 1 : 0, transition: tr(0.3) }}
          />
        ))}

        {/* ─── FISHERMAN SILHOUETTE ─── */}
        <g style={{ opacity: active ? 0.88 : 0, transition: tr(0.4) }}>
          {/* Body */}
          <ellipse cx={FM_X} cy={FM_Y + 14} rx={10} ry={16} fill="#1a1414" />
          {/* Head */}
          <circle cx={FM_X} cy={FM_Y - 2} r={9} fill="#1a1414" />
          {/* Hat brim */}
          <ellipse cx={FM_X} cy={FM_Y - 9} rx={13} ry={4} fill="#1a1414" />
          <rect x={FM_X - 7} y={FM_Y - 22} width={14} height={13} fill="#1a1414" rx={2} />
          {/* Dangling legs */}
          <line x1={FM_X - 6} y1={FM_Y + 28} x2={FM_X - 10} y2={FM_Y + 52}
            stroke="#1a1414" strokeWidth={5} strokeLinecap="round" />
          <line x1={FM_X + 4} y1={FM_Y + 28} x2={FM_X + 8} y2={FM_Y + 50}
            stroke="#1a1414" strokeWidth={5} strokeLinecap="round" />
          {/* Fishing rod held out */}
          <line x1={FM_X + 8} y1={FM_Y + 8} x2={FM_X + 52} y2={FM_Y - 14}
            stroke="#5a3c18" strokeWidth={3} strokeLinecap="round" />
          <line x1={FM_X + 52} y1={FM_Y - 14} x2={FM_X + 96} y2={WATER_Y + 38}
            stroke="#a08858" strokeWidth={1} />
          {/* Bobber from hand-held rod */}
          <g className="fps-bobber" style={{ animationDelay: "0.4s" }}>
            <ellipse cx={FM_X + 96} cy={WATER_Y + 38} rx={4} ry={6} fill="#e83820" />
            <ellipse cx={FM_X + 96} cy={WATER_Y + 43} rx={4} ry={3.5} fill="#f8f8f0" />
          </g>
        </g>

        {/* ─── ROWBOAT ─── */}
        <g className="fps-dock-bob"
          style={{ opacity: active ? 0.92 : 0, transition: tr(0.3) }}
        >
          {/* Boat shadow in water */}
          <ellipse cx={RB_CX} cy={RB_CY + 18} rx={56} ry={10}
            fill="#0a0810" opacity={0.35} filter="url(#fps-blur-sm)" />
          {/* Hull */}
          <path d={ROWBOAT_HULL_D} fill="url(#fps-boat)" stroke="#2a1808" strokeWidth={1.5} />
          {/* Thwarts */}
          {THWARTS.map(([tx, ty, tw], i) => (
            <rect key={i} x={tx - tw / 2} y={ty} width={tw} height={5}
              fill="#7a5a28" rx={1} />
          ))}
          {/* Oars */}
          <line x1={RB_CX - 44} y1={RB_CY + 12} x2={RB_CX + 38} y2={RB_CY + 4}
            stroke="#8a6030" strokeWidth={3.5} strokeLinecap="round" />
          <path d={OAR1_D} stroke="#8a6030" strokeWidth={3} fill="none" strokeLinecap="round" />
          <path d={OAR2_D} stroke="#6a4820" strokeWidth={2} fill="none" strokeLinecap="round" strokeDasharray="none" />
          {/* Mooring rope */}
          <path d={ROPE_D} fill="none" stroke="#8a7040" strokeWidth={1.5}
            strokeDasharray="3 3" opacity={0.7} />
        </g>

        {/* ─── CATTAILS ─── */}
        {CATTAILS.map(([cx2, stemH, pw, ph], i) => {
          const baseY = WATER_Y + 24 + (i % 3) * 8;
          return (
            <g key={i}
              style={{ opacity: active ? 0.82 : 0, transition: tr(0.1 + i * 0.02) }}
            >
              {/* Stem */}
              <line x1={cx2} y1={baseY} x2={cx2 + (i % 5 - 2) * 2} y2={baseY - stemH}
                stroke="#6a5828" strokeWidth={1.8} />
              {/* Cattail puff */}
              <ellipse
                cx={cx2 + (i % 5 - 2) * 2}
                cy={baseY - stemH}
                rx={pw / 2} ry={ph / 2}
                fill="url(#fps-cattail)"
              />
              {/* Leaf blade */}
              <path
                d={`M ${cx2},${baseY} C ${cx2 + 8 + (i % 3) * 4},${baseY - stemH * 0.4} ${cx2 + 12 + (i % 3) * 3},${baseY - stemH * 0.7} ${cx2 + 6},${baseY - stemH * 0.9}`}
                fill="none" stroke="#5a5020" strokeWidth={1.5} opacity={0.7}
              />
            </g>
          );
        })}

        {/* ─── LILY PADS ─── */}
        {LILY_PADS.map(([lx, ly, lr], i) => (
          <g key={i} style={{ opacity: active ? 0.72 : 0, transition: tr(0.25 + i * 0.03) }}>
            <ellipse cx={lx} cy={ly} rx={lr} ry={lr * 0.52}
              fill="#1a4010" />
            {/* Notch cut */}
            <path d={`M ${lx},${ly - lr * 0.5} L ${lx},${ly} L ${lx + lr * 0.55},${ly}`}
              fill="none" stroke="#122c08" strokeWidth={0.8} opacity={0.6} />
            {/* Tiny flower on some */}
            {i % 3 === 0 && (
              <circle cx={lx + 2} cy={ly - 4} r={3} fill="#e8b0c0" opacity={0.7} />
            )}
          </g>
        ))}

        {/* ─── DRAGONFLY ─── */}
        <g className="fps-dragonfly"
          style={{ opacity: active ? 0.75 : 0, transition: tr(0.6) }}
        >
          {/* Body */}
          <line x1={DF_X - 10} y1={DF_Y} x2={DF_X + 10} y2={DF_Y}
            stroke="#4a8060" strokeWidth={3} strokeLinecap="round" />
          {/* Wings */}
          <ellipse cx={DF_X - 4} cy={DF_Y - 1} rx={10} ry={4}
            fill="#a0c8e0" opacity={0.55} transform={`rotate(-18,${DF_X - 4},${DF_Y - 1})`} />
          <ellipse cx={DF_X + 6} cy={DF_Y - 1} rx={10} ry={4}
            fill="#a0c8e0" opacity={0.55} transform={`rotate(18,${DF_X + 6},${DF_Y - 1})`} />
          <ellipse cx={DF_X - 4} cy={DF_Y + 3} rx={8} ry={3}
            fill="#a0d0c8" opacity={0.45} transform={`rotate(-22,${DF_X - 4},${DF_Y + 3})`} />
          <ellipse cx={DF_X + 6} cy={DF_Y + 3} rx={8} ry={3}
            fill="#a0d0c8" opacity={0.45} transform={`rotate(22,${DF_X + 6},${DF_Y + 3})`} />
        </g>

        {/* Caption */}
        <text
          x={W / 2} y={H - 14}
          textAnchor="middle"
          fontFamily="'Georgia', 'Times New Roman', serif"
          fontSize={11} fill="#b89898"
          letterSpacing={5}
          style={{ opacity: active ? 0.6 : 0, transition: tr(1.0) }}
        >
          LAKE QUINSIGAMOND · SHREWSBURY, MA · DAWN
        </text>
      </svg>
    </section>
  );
}
