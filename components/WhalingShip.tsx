"use client";
import { useEffect, useRef, useState } from "react";

const W = 1440;
const H = 560;

// ─── Horizon & sea ────────────────────────────────────────────────────────────
const HORIZON_Y = 230;
const SEA_TOP   = HORIZON_Y - 4;

// Ship pivot (hull center)
const SHIP_BASE_X = 560;
const SHIP_BASE_Y = HORIZON_Y - 12;  // waterline

// ─── Hull geometry ────────────────────────────────────────────────────────────
const HULL_W  = 300;
const HULL_H  = 52;
const HULL_CX = SHIP_BASE_X;
const HULL_Y  = SHIP_BASE_Y - HULL_H + 8;

// Hull strake positions (horizontal planking lines)
const HULL_STRAKES = Array.from({ length: 6 }, (_, i) => ({
  y: HULL_Y + 8 + i * (HULL_H - 10) / 6,
  opacity: 0.25 + i * 0.04,
}));

// Gun ports (closed) — two rows
const GUN_PORTS = Array.from({ length: 5 }, (_, i) => ({
  x: HULL_CX - HULL_W * 0.38 + i * (HULL_W * 0.76 / 5),
  y: HULL_Y + 14,
  w: 12,
  h: 10,
}));

// ─── Deck ─────────────────────────────────────────────────────────────────────
const DECK_Y   = HULL_Y - 2;
const DECK_L   = HULL_CX - HULL_W * 0.46;
const DECK_R   = HULL_CX + HULL_W * 0.46;

// Bulwark rail
const RAIL_H = 14;

// ─── Masts ────────────────────────────────────────────────────────────────────
// Three masts: fore, main, mizzen
type Mast = {
  id: string; x: number;
  baseY: number; tipY: number;
  yards: { y: number; halfW: number; id: string }[];    // square yards
  stays: { x2: number; y2: number }[];                  // fore-stays
};

const MAST_FORE: Mast = {
  id: "fore",
  x: HULL_CX - 88,
  baseY: DECK_Y,
  tipY: DECK_Y - 340,
  yards: [
    { y: DECK_Y - 72,  halfW: 90, id: "fore-lower"  },
    { y: DECK_Y - 148, halfW: 72, id: "fore-top"    },
    { y: DECK_Y - 210, halfW: 54, id: "fore-tgal"   },
    { y: DECK_Y - 258, halfW: 36, id: "fore-royal"  },
  ],
  stays: [{ x2: HULL_CX - HULL_W * 0.46 - 20, y2: SHIP_BASE_Y - 6 }],
};

const MAST_MAIN: Mast = {
  id: "main",
  x: HULL_CX,
  baseY: DECK_Y,
  tipY: DECK_Y - 380,
  yards: [
    { y: DECK_Y - 80,  halfW: 105, id: "main-lower" },
    { y: DECK_Y - 165, halfW:  82, id: "main-top"   },
    { y: DECK_Y - 238, halfW:  60, id: "main-tgal"  },
    { y: DECK_Y - 290, halfW:  40, id: "main-royal" },
  ],
  stays: [],
};

const MAST_MIZZ: Mast = {
  id: "mizz",
  x: HULL_CX + 95,
  baseY: DECK_Y,
  tipY: DECK_Y - 280,
  yards: [
    { y: DECK_Y - 60,  halfW: 72, id: "mizz-lower" },
    { y: DECK_Y - 130, halfW: 55, id: "mizz-top"   },
    { y: DECK_Y - 188, halfW: 40, id: "mizz-tgal"  },
  ],
  stays: [{ x2: HULL_CX + HULL_W * 0.46 + 8, y2: SHIP_BASE_Y - 4 }],
};

const ALL_MASTS = [MAST_FORE, MAST_MAIN, MAST_MIZZ];

// ─── Bowsprit ─────────────────────────────────────────────────────────────────
const BSP_X1 = HULL_CX - HULL_W * 0.46;
const BSP_Y1 = DECK_Y - 8;
const BSP_X2 = BSP_X1 - 155;
const BSP_Y2 = BSP_Y1 - 60;

// Jib sails
type JibSail = { x1: number; y1: number; x2: number; y2: number; x3: number; y3: number; shade: string };
const JIB_SAILS: JibSail[] = [
  { x1: BSP_X2,      y1: BSP_Y2,      x2: MAST_FORE.x, y2: MAST_FORE.tipY + 60, x3: MAST_FORE.x - 20, y3: DECK_Y - 30,  shade: "#e8dfc8" },
  { x1: BSP_X2 - 30, y1: BSP_Y2 - 18, x2: MAST_FORE.x, y2: MAST_FORE.tipY + 20, x3: MAST_FORE.x,      y3: MAST_FORE.tipY + 80, shade: "#ddd4bc" },
];

// ─── Fore-and-aft sails (between masts + driver on mizzen) ────────────────────
type ForeAftSail = { points: string; shade: string };
const FORE_AFT_SAILS: ForeAftSail[] = [
  // Staysail between fore and main
  {
    points: `${MAST_FORE.x},${MAST_FORE.tipY + 30} ${MAST_MAIN.x - 10},${MAST_MAIN.tipY + 40} ${MAST_MAIN.x - 8},${DECK_Y - 20}`,
    shade: "#ddd4bc",
  },
  // Driver (gaff sail) on mizzen
  {
    points: `${MAST_MIZZ.x},${DECK_Y - 100} ${MAST_MIZZ.x + 80},${DECK_Y - 88} ${MAST_MIZZ.x + 72},${DECK_Y - 22} ${MAST_MIZZ.x},${DECK_Y - 30}`,
    shade: "#e4dbc4",
  },
];

// ─── Ocean waves ─────────────────────────────────────────────────────────────
type Wave = { cx: number; y: number; rx: number; ry: number; phase: number; speed: number; layer: number };
const WAVES: Wave[] = Array.from({ length: 28 }, (_, i) => {
  const ang = i * 137.508 * Math.PI / 180;
  const layer = i % 3;
  return {
    cx:    ((W / 2 + Math.cos(ang) * W * 0.45) + W * 0.5) % W,
    y:     SEA_TOP + 18 + layer * 35 + (i % 5) * 22,
    rx:    55 + layer * 30 + (i % 4) * 18,
    ry:    8 + layer * 4,
    phase: (i * 0.42) % (Math.PI * 2),
    speed: 1.8 + layer * 0.6 + (i % 4) * 0.3,
    layer,
  };
});

// ─── Wake / foam behind ship ──────────────────────────────────────────────────
type WakeFoam = { x: number; y: number; rx: number; delay: number };
const WAKE_FOAM: WakeFoam[] = Array.from({ length: 12 }, (_, i) => ({
  x:     HULL_CX + HULL_W * 0.46 + 10 + i * 22,
  y:     SHIP_BASE_Y + 4 + (i % 3) * 5,
  rx:    8 + i * 3,
  delay: i * 0.18,
}));

// ─── Seagulls ─────────────────────────────────────────────────────────────────
type Gull = { x: number; y: number; scale: number; speed: number; delay: number };
const GULLS: Gull[] = [
  { x: -50,  y:  88, scale: 1.0,  speed: 18, delay: 0   },
  { x: -80,  y:  72, scale: 0.75, speed: 22, delay: 1.2 },
  { x: -30,  y: 104, scale: 0.85, speed: 16, delay: 2.8 },
  { x: -110, y:  56, scale: 0.6,  speed: 24, delay: 0.5 },
  { x: -60,  y: 120, scale: 0.7,  speed: 20, delay: 3.4 },
];

// ─── Lighthouse on headland ───────────────────────────────────────────────────
const LH_CX  = 1240;
const LH_Y   = HORIZON_Y - 52;
const LH_W   = 28;
const LH_H   = 105;
// Rocky headland
const HEAD_D = `M1080,${HORIZON_Y + 10} Q1140,${HORIZON_Y - 28} 1180,${HORIZON_Y - 42} Q1210,${HORIZON_Y - 52} ${LH_CX - LH_W / 2 - 12},${HORIZON_Y - 62} L${LH_CX + LH_W / 2 + 16},${HORIZON_Y - 62} Q1310,${HORIZON_Y - 45} 1360,${HORIZON_Y - 22} Q1420,${HORIZON_Y + 2} 1440,${HORIZON_Y + 8} L1440,${HORIZON_Y + 20} L1080,${HORIZON_Y + 20} Z`;

// ─── Rigging lines ────────────────────────────────────────────────────────────
// Shrouds (side stays from mast tips to deck rail edges)
type Shroud = { x1: number; y1: number; x2: number; y2: number };
const SHROUDS: Shroud[] = ALL_MASTS.flatMap(mast => {
  const spread = mast.id === "main" ? 65 : 45;
  return [
    { x1: mast.x, y1: mast.tipY + 10, x2: mast.x - spread, y2: DECK_Y - 2 },
    { x1: mast.x, y1: mast.tipY + 10, x2: mast.x + spread, y2: DECK_Y - 2 },
    // intermediate shrouds
    { x1: mast.x, y1: mast.tipY + 50, x2: mast.x - spread * 0.7, y2: DECK_Y - 2 },
    { x1: mast.x, y1: mast.tipY + 50, x2: mast.x + spread * 0.7, y2: DECK_Y - 2 },
  ];
});

// Backstays
const BACKSTAYS: Shroud[] = [
  { x1: MAST_FORE.x, y1: MAST_FORE.tipY + 8, x2: MAST_MAIN.x - 15, y2: DECK_Y - 4 },
  { x1: MAST_MAIN.x, y1: MAST_MAIN.tipY + 8, x2: MAST_MIZZ.x - 12, y2: DECK_Y - 4 },
  { x1: MAST_MIZZ.x, y1: MAST_MIZZ.tipY + 8, x2: DECK_R + 8, y2: DECK_Y - 4 },
];

// Forestays
const FORESTAYS: Shroud[] = [
  { x1: MAST_FORE.x, y1: MAST_FORE.tipY + 8, x2: BSP_X2 + 20, y2: BSP_Y2 - 8 },
  { x1: MAST_MAIN.x, y1: MAST_MAIN.tipY + 8, x2: MAST_FORE.x - 5, y2: MAST_FORE.baseY - 60 },
  { x1: MAST_MIZZ.x, y1: MAST_MIZZ.tipY + 8, x2: MAST_MAIN.x + 5, y2: MAST_MAIN.baseY - 50 },
];

// Buntlines (vertical ropes on sails) — 3 per sail on main mast
const BUNTLINES: Shroud[] = MAST_MAIN.yards.map(yr => ({
  x1: MAST_MAIN.x,
  y1: yr.y,
  x2: MAST_MAIN.x,
  y2: yr.y + 40,
}));

export function WhalingShip() {
  const ref = useRef<SVGSVGElement>(null);
  const [active, setActive] = useState(false);
  const [wavePhase, setWavePhase] = useState(0);
  const [lightAngle, setLightAngle] = useState(0);

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
      t += 0.037;
      setWavePhase(t);
      setLightAngle((t * 28) % 360);
    }, 33);
    return () => clearInterval(tick);
  }, [active]);

  const tr = (d: number) =>
    active ? `opacity 0.7s ease ${d}s, transform 0.7s ease ${d}s` : "none";

  // Gentle ship roll
  const shipRoll = Math.sin(wavePhase * 0.55) * 2.2;

  return (
    <section style={{ background: "#1a3a5c", overflow: "hidden", position: "relative" }}>
      <style>{`
        @keyframes ws2-gull {
          from { transform: translateX(0); }
          to   { transform: translateX(${W + 160}px); }
        }
        @keyframes ws2-wake {
          0%   { transform: scaleX(1); opacity: 0.7; }
          100% { transform: scaleX(1.5); opacity: 0; }
        }
        @keyframes ws2-flag {
          0%,100% { d: path("M0,0 L28,-8 L22,6 Z"); }
          50%     { d: path("M0,0 L30,-4 L26,10 Z"); }
        }
        @keyframes ws2-lighthouse-sweep {
          0%   { opacity: 0.7; }
          12%  { opacity: 0.95; }
          24%  { opacity: 0.2; }
          100% { opacity: 0.2; }
        }
        .ws2-wake     { animation: ws2-wake 2.2s ease-out infinite; }
        .ws2-lh-sweep { animation: ws2-lighthouse-sweep 4s ease-in-out infinite; }
      `}</style>
      <svg
        ref={ref}
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="xMidYMid slice"
        style={{ display: "block", width: "100%", height: "auto", minHeight: 320 }}
        aria-label="New England whaling ship under full sail on open ocean with lighthouse in distance"
        role="img"
      >
        <defs>
          <linearGradient id="ws2-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#0c2040" />
            <stop offset="35%"  stopColor="#1a3a60" />
            <stop offset="68%"  stopColor="#2a5878" />
            <stop offset="100%" stopColor="#4a7898" />
          </linearGradient>
          <linearGradient id="ws2-sea" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#1a4868" stopOpacity="0.95" />
            <stop offset="35%"  stopColor="#0e2e4a" stopOpacity="0.98" />
            <stop offset="100%" stopColor="#081828" />
          </linearGradient>
          <linearGradient id="ws2-hull" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#2a1a10" />
            <stop offset="50%"  stopColor="#1a1008" />
            <stop offset="100%" stopColor="#0e0a06" />
          </linearGradient>
          <linearGradient id="ws2-sail-main" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%"   stopColor="#f0e8d0" />
            <stop offset="60%"  stopColor="#e4dac0" />
            <stop offset="100%" stopColor="#d0c8a8" />
          </linearGradient>
          <linearGradient id="ws2-sail-shadow" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%"   stopColor="#b8b098" />
            <stop offset="40%"  stopColor="#d8d0b8" />
            <stop offset="100%" stopColor="#c8c0a0" />
          </linearGradient>
          <radialGradient id="ws2-lh-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="#f8f0a0" stopOpacity="0.9" />
            <stop offset="40%"  stopColor="#f0d060" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#e0a020" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="ws2-sun" cx="50%" cy="80%" r="60%">
            <stop offset="0%"   stopColor="#f8e090" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#c08030" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="ws2-headland" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#2a3840" />
            <stop offset="100%" stopColor="#1a2830" />
          </linearGradient>
          <clipPath id="ws2-clip">
            <rect x="0" y="0" width={W} height={H} />
          </clipPath>
          <clipPath id="ws2-sea-clip">
            <rect x="0" y={SEA_TOP} width={W} height={H - SEA_TOP} />
          </clipPath>
        </defs>

        {/* ── Sky ── */}
        <rect x="0" y="0" width={W} height={H} fill="url(#ws2-sky)" />

        {/* ── Cloud streaks (high cirrus) ── */}
        {Array.from({ length: 12 }, (_, i) => (
          <ellipse key={i}
            cx={i * 130 + 40} cy={28 + (i % 4) * 18}
            rx={60 + i * 8} ry={5}
            fill="#4a6888" opacity={0.25 + (i % 3) * 0.08}
          />
        ))}

        {/* ── Sun / light on horizon ── */}
        <ellipse cx={800} cy={HORIZON_Y + 4} rx={300} ry={60} fill="url(#ws2-sun)" />
        <circle cx={800} cy={HORIZON_Y - 2} r={26} fill="#fff8e0" opacity="0.82" />

        {/* ── Rocky headland + lighthouse ── */}
        <g style={{
          opacity: active ? 1 : 0,
          transform: active ? "translateY(0)" : "translateY(8px)",
          transition: tr(0.25),
        }}>
          <path d={HEAD_D} fill="url(#ws2-headland)" />
          {/* Rock texture */}
          {[1100, 1140, 1170, 1310, 1350, 1400].map((rx, i) => (
            <ellipse key={i} cx={rx} cy={HORIZON_Y + 4 + (i % 3) * 6}
              rx={16 + i % 12} ry={6}
              fill="#1a2830" opacity="0.5" />
          ))}
          {/* Lighthouse tower */}
          <rect x={LH_CX - LH_W / 2} y={LH_Y - LH_H} width={LH_W} height={LH_H}
            rx="3" fill="#e8e0d0" stroke="#c0b8a8" strokeWidth="1.5" />
          {/* Lighthouse stripes */}
          {[0.2, 0.45, 0.7].map((t, i) => (
            <rect key={i}
              x={LH_CX - LH_W / 2} y={LH_Y - LH_H + LH_H * t}
              width={LH_W} height={LH_H * 0.12}
              fill="#c83228" />
          ))}
          {/* Lantern room */}
          <rect x={LH_CX - LH_W / 2 - 4} y={LH_Y - LH_H - 22} width={LH_W + 8} height={22}
            rx="2" fill="#2a2820" />
          <rect x={LH_CX - LH_W / 2 - 2} y={LH_Y - LH_H - 20} width={LH_W + 4} height={18}
            rx="1" fill="#f8f0a0" opacity="0.9"
            className="ws2-lh-sweep" />
          {/* Dome cap */}
          <path d={`M${LH_CX - LH_W / 2 - 5},${LH_Y - LH_H - 22} A${LH_W / 2 + 5},${LH_W / 2 + 5} 0 0,1 ${LH_CX + LH_W / 2 + 5},${LH_Y - LH_H - 22}`}
            fill="#1a1810" />
          {/* Light beam sweep */}
          <g style={{ transform: `rotate(${lightAngle}deg)`, transformOrigin: `${LH_CX}px ${LH_Y - LH_H - 12}px` }}>
            <path
              d={`M${LH_CX},${LH_Y - LH_H - 12} L${LH_CX - 180},${LH_Y - LH_H - 12 - 60} L${LH_CX - 140},${LH_Y - LH_H - 12 - 20}`}
              fill="#f8f0a0" opacity="0.18" />
          </g>
          <circle cx={LH_CX} cy={LH_Y - LH_H - 12} r={65}
            fill="url(#ws2-lh-glow)" className="ws2-lh-sweep" />
          {/* Keeper's cottage */}
          <rect x={LH_CX + LH_W / 2 + 6} y={HORIZON_Y - 62 + 20} width={56} height={36}
            fill="#c8c0a8" stroke="#a0988a" strokeWidth="1" />
          <polygon
            points={`${LH_CX + LH_W / 2 + 4},${HORIZON_Y - 62 + 20} ${LH_CX + LH_W / 2 + 34},${HORIZON_Y - 62 + 6} ${LH_CX + LH_W / 2 + 64},${HORIZON_Y - 62 + 20}`}
            fill="#3a3020" />
          <rect x={LH_CX + LH_W / 2 + 16} y={HORIZON_Y - 62 + 28} width={12} height={12}
            fill="#f0d060" opacity="0.7" />
        </g>

        {/* ── Sea surface ── */}
        <rect x="0" y={SEA_TOP} width={W} height={H - SEA_TOP} fill="url(#ws2-sea)" />

        {/* ── Animated ocean waves ── */}
        {WAVES.map((wv, i) => {
          const wobble = Math.sin(wavePhase * wv.speed + wv.phase) * 6;
          return (
            <ellipse key={i}
              cx={wv.cx} cy={wv.y + wobble}
              rx={wv.rx} ry={wv.ry}
              fill="none"
              stroke={wv.layer === 0 ? "#4a7890" : wv.layer === 1 ? "#3a6878" : "#2a5868"}
              strokeWidth={wv.layer === 0 ? 2.2 : wv.layer === 1 ? 1.6 : 1.2}
              opacity={0.55 - wv.layer * 0.08}
            />
          );
        })}

        {/* ── Wave foam crests ── */}
        {Array.from({ length: 14 }, (_, i) => {
          const wobble = Math.sin(wavePhase * 1.4 + i * 0.8) * 5;
          return (
            <ellipse key={i}
              cx={80 + i * 100} cy={SEA_TOP + 22 + (i % 3) * 28 + wobble}
              rx={22 + i % 12} ry={4}
              fill="#a0c8d8" opacity="0.25"
            />
          );
        })}

        {/* ── Full ship (rolls slightly on waves) ── */}
        <g clipPath="url(#ws2-clip)"
           style={{
             transform: `rotate(${shipRoll}deg)`,
             transformOrigin: `${HULL_CX}px ${SHIP_BASE_Y}px`,
             transition: "none",
           }}>

          {/* ── Rigging: shrouds (behind hull/sails) ── */}
          {SHROUDS.map((sh, i) => (
            <line key={i} x1={sh.x1} y1={sh.y1} x2={sh.x2} y2={sh.y2}
              stroke="#5a4828" strokeWidth="1.2" opacity="0.65" />
          ))}
          {FORESTAYS.map((fs, i) => (
            <line key={i} x1={fs.x1} y1={fs.y1} x2={fs.x2} y2={fs.y2}
              stroke="#5a4828" strokeWidth="1.5" opacity="0.7" />
          ))}
          {BACKSTAYS.map((bs, i) => (
            <line key={i} x1={bs.x1} y1={bs.y1} x2={bs.x2} y2={bs.y2}
              stroke="#5a4828" strokeWidth="1.3" opacity="0.55" />
          ))}

          {/* ── Square sails (billowing with wind) ── */}
          {ALL_MASTS.map(mast =>
            mast.yards.map((yr, yi) => {
              // Each sail is a quadrilateral with belly curve (wind-filled)
              const belly = 18 - yi * 3;  // less belly on higher sails
              const nextY = mast.yards[yi + 1]?.y ?? (yr.y - 48);
              const sailH = yr.y - nextY - 6;
              const shade = yi % 2 === 0 ? "#e8dec6" : "#dcd2ba";
              return (
                <g key={`${mast.id}-${yi}`}>
                  {/* Sail body with belly */}
                  <path
                    d={`M${mast.x - yr.halfW},${yr.y}
                       Q${mast.x - yr.halfW * 0.5},${yr.y + belly} ${mast.x},${yr.y + belly * 0.8}
                       Q${mast.x + yr.halfW * 0.5},${yr.y + belly} ${mast.x + yr.halfW},${yr.y}
                       L${mast.x + yr.halfW * 0.88},${yr.y - sailH}
                       Q${mast.x},${yr.y - sailH + belly * 0.3} ${mast.x - yr.halfW * 0.88},${yr.y - sailH}
                       Z`}
                    fill={shade}
                    opacity="0.92"
                  />
                  {/* Sail shadow (darker on right edge) */}
                  <path
                    d={`M${mast.x + yr.halfW * 0.6},${yr.y}
                       Q${mast.x + yr.halfW * 0.8},${yr.y + belly * 0.5} ${mast.x + yr.halfW},${yr.y}
                       L${mast.x + yr.halfW * 0.88},${yr.y - sailH}
                       Q${mast.x + yr.halfW * 0.7},${yr.y - sailH * 0.5} ${mast.x + yr.halfW * 0.6},${yr.y}
                       Z`}
                    fill="#9a9278" opacity="0.2"
                  />
                  {/* Yard (spar) */}
                  <line x1={mast.x - yr.halfW} y1={yr.y}
                    x2={mast.x + yr.halfW} y2={yr.y}
                    stroke="#3a2810" strokeWidth="4" strokeLinecap="round" />
                  {/* Buntlines */}
                  {[-0.4, 0, 0.4].map((fx, ri) => (
                    <line key={ri}
                      x1={mast.x + yr.halfW * fx} y1={yr.y}
                      x2={mast.x + yr.halfW * fx * 0.5} y2={yr.y + sailH * 0.7}
                      stroke="#6a5838" strokeWidth="1" opacity="0.4" />
                  ))}
                </g>
              );
            })
          )}

          {/* ── Jib sails ── */}
          {JIB_SAILS.map((js, i) => (
            <path key={i}
              d={`M${js.x1},${js.y1} L${js.x2},${js.y2} L${js.x3},${js.y3} Z`}
              fill={js.shade} opacity="0.88" />
          ))}

          {/* ── Fore-and-aft sails ── */}
          {FORE_AFT_SAILS.map((fa, i) => (
            <polygon key={i} points={fa.points} fill={fa.shade} opacity="0.82" />
          ))}

          {/* ── Bowsprit ── */}
          <line x1={BSP_X1} y1={BSP_Y1} x2={BSP_X2} y2={BSP_Y2}
            stroke="#2a1a0e" strokeWidth="7" strokeLinecap="round" />
          {/* Bobstay */}
          <line x1={BSP_X2} y1={BSP_Y2} x2={BSP_X1 - 10} y2={SHIP_BASE_Y + 2}
            stroke="#5a4828" strokeWidth="1.5" opacity="0.6" />

          {/* ── Masts ── */}
          {ALL_MASTS.map(mast => (
            <g key={mast.id}>
              {/* Lower mast */}
              <line x1={mast.x} y1={mast.baseY}
                x2={mast.x} y2={mast.yards[0]?.y ?? mast.tipY}
                stroke="#2a1a0e" strokeWidth="8" strokeLinecap="round" />
              {/* Top mast */}
              <line x1={mast.x} y1={(mast.yards[0]?.y ?? mast.tipY) - 8}
                x2={mast.x} y2={mast.tipY}
                stroke="#2e1e10" strokeWidth="5" strokeLinecap="round" />
              {/* Top gallant mast */}
              <line x1={mast.x} y1={mast.tipY + 30}
                x2={mast.x} y2={mast.tipY}
                stroke="#2e1e10" strokeWidth="3" strokeLinecap="round" />
              {/* Cap disc */}
              <ellipse cx={mast.x} cy={(mast.yards[0]?.y ?? mast.tipY) - 8}
                rx={7} ry={4} fill="#3a2810" />
            </g>
          ))}

          {/* ── Hull ── */}
          {/* Water line shadow */}
          <ellipse cx={HULL_CX} cy={SHIP_BASE_Y + 6} rx={HULL_W * 0.52} ry={12}
            fill="#0a1820" opacity="0.45" />
          {/* Hull body */}
          <path
            d={`M${HULL_CX - HULL_W * 0.46},${HULL_Y}
               L${HULL_CX - HULL_W * 0.5},${SHIP_BASE_Y - 6}
               Q${HULL_CX - HULL_W * 0.48},${SHIP_BASE_Y + 14} ${HULL_CX - HULL_W * 0.2},${SHIP_BASE_Y + 18}
               Q${HULL_CX},${SHIP_BASE_Y + 22} ${HULL_CX + HULL_W * 0.2},${SHIP_BASE_Y + 18}
               Q${HULL_CX + HULL_W * 0.44},${SHIP_BASE_Y + 14} ${HULL_CX + HULL_W * 0.5},${SHIP_BASE_Y - 2}
               L${HULL_CX + HULL_W * 0.46},${HULL_Y} Z`}
            fill="url(#ws2-hull)" />
          {/* Hull strakes */}
          {HULL_STRAKES.map((hs, i) => (
            <line key={i}
              x1={HULL_CX - HULL_W * 0.46 + i * 2} y1={hs.y}
              x2={HULL_CX + HULL_W * 0.46 - i * 2} y2={hs.y}
              stroke="#4a3020" strokeWidth="1.2" opacity={hs.opacity} />
          ))}
          {/* Copper sheathing (below waterline) */}
          <path
            d={`M${HULL_CX - HULL_W * 0.48},${SHIP_BASE_Y + 2}
               Q${HULL_CX - HULL_W * 0.46},${SHIP_BASE_Y + 14} ${HULL_CX - HULL_W * 0.2},${SHIP_BASE_Y + 18}
               Q${HULL_CX},${SHIP_BASE_Y + 22} ${HULL_CX + HULL_W * 0.2},${SHIP_BASE_Y + 18}
               Q${HULL_CX + HULL_W * 0.44},${SHIP_BASE_Y + 14} ${HULL_CX + HULL_W * 0.48},${SHIP_BASE_Y + 2} Z`}
            fill="#8a4818" opacity="0.65" />
          {/* Gun ports */}
          {GUN_PORTS.map((gp, i) => (
            <rect key={i} x={gp.x} y={gp.y} width={gp.w} height={gp.h}
              rx="1" fill="#0a0806" stroke="#3a2810" strokeWidth="0.8" />
          ))}
          {/* Wales (thick horizontal band) */}
          <rect x={HULL_CX - HULL_W * 0.46} y={HULL_Y + 6} width={HULL_W * 0.92} height={5}
            fill="#3a2810" />
          <rect x={HULL_CX - HULL_W * 0.46} y={HULL_Y + 24} width={HULL_W * 0.92} height={5}
            fill="#3a2810" />

          {/* Deck rail */}
          <rect x={DECK_L} y={DECK_Y - RAIL_H} width={DECK_R - DECK_L} height={RAIL_H}
            fill="#3a2810" />
          {/* Deck planking */}
          {Array.from({ length: 8 }, (_, i) => (
            <line key={i}
              x1={DECK_L} y1={DECK_Y - RAIL_H + 2 + i * (RAIL_H / 8)}
              x2={DECK_R} y2={DECK_Y - RAIL_H + 2 + i * (RAIL_H / 8)}
              stroke="#2a1a0e" strokeWidth="1" opacity="0.35" />
          ))}

          {/* ── Figurehead ── */}
          <path d={`M${BSP_X1 - 5},${BSP_Y1 - 4} Q${BSP_X1 - 22},${BSP_Y1 - 14} ${BSP_X1 - 28},${BSP_Y1 - 8}`}
            fill="#c8a860" stroke="#a88840" strokeWidth="1.5" />
          <circle cx={BSP_X1 - 28} cy={BSP_Y1 - 8} r={5} fill="#c8a860" />

          {/* ── Captain's flags (stern) ── */}
          <polygon
            points={`${MAST_MAIN.x},${MAST_MAIN.tipY} ${MAST_MAIN.x + 34},${MAST_MAIN.tipY + 8} ${MAST_MAIN.x},${MAST_MAIN.tipY + 18}`}
            fill="#c83228" />
          <polygon
            points={`${MAST_FORE.x},${MAST_FORE.tipY} ${MAST_FORE.x + 26},${MAST_FORE.tipY + 6} ${MAST_FORE.x},${MAST_FORE.tipY + 14}`}
            fill="#1a4a8c" />

          {/* ── Deck crew (silhouettes) ── */}
          {[HULL_CX - 40, HULL_CX + 20, HULL_CX + 60].map((px, i) => (
            <g key={i}>
              <rect x={px - 5} y={DECK_Y - RAIL_H - 32} width={10} height={22}
                rx="1" fill="#0a0806" />
              <circle cx={px} cy={DECK_Y - RAIL_H - 36} r={6} fill="#0a0806" />
            </g>
          ))}

          {/* ── Wake / foam trail ── */}
          {WAKE_FOAM.map((wf, i) => (
            <ellipse key={i} className="ws2-wake"
              cx={wf.x} cy={wf.y} rx={wf.rx} ry={5}
              fill="#8ac0d8" opacity="0.45"
              style={{ animationDelay: `${wf.delay}s` }} />
          ))}
          {/* Bow wave */}
          <path
            d={`M${HULL_CX - HULL_W * 0.5},${SHIP_BASE_Y + 4}
               Q${HULL_CX - HULL_W * 0.5 - 30},${SHIP_BASE_Y + 12} ${HULL_CX - HULL_W * 0.5 - 55},${SHIP_BASE_Y + 6}`}
            fill="none" stroke="#8ac0d8" strokeWidth="3.5" opacity="0.5" />
        </g>

        {/* ── Seagulls ── */}
        {GULLS.map((gl, i) => (
          <g key={i}
             style={{
               animation: active
                 ? `ws2-gull ${gl.speed}s linear ${gl.delay}s infinite`
                 : "none",
               transform: `scale(${gl.scale})`,
               transformOrigin: `${gl.x}px ${gl.y}px`,
             }}>
            <path
              d={`M${gl.x - 10},${gl.y} Q${gl.x},${gl.y - 8} ${gl.x + 10},${gl.y} Q${gl.x + 18},${gl.y - 7} ${gl.x + 24},${gl.y}`}
              fill="none" stroke="#c0c8d0" strokeWidth="2" />
          </g>
        ))}

        {/* ── Label ── */}
        <g style={{
          opacity: active ? 1 : 0,
          transform: active ? "translateY(0)" : "translateY(-8px)",
          transition: tr(0.12),
        }}>
          <text x={W / 2} y={H - 18} textAnchor="middle"
            fontFamily="'Georgia', serif" fontSize="11" fill="#7aa0b8"
            letterSpacing="3" opacity="0.65">
            NEW ENGLAND WHALER · LAKE QUINSIGAMOND PASSAGE · SHREWSBURY, MA
          </text>
        </g>
      </svg>
    </section>
  );
}
