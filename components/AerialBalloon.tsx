"use client";
import { useEffect, useRef, useState } from "react";

const W = 1440;
const H = 620;

// ─── Scene geometry ────────────────────────────────────────────────────────────
const HORIZON_Y  = 340;          // far ground level
const VALLEY_MID = W * 0.46;    // balloon is left of center

// ─── Balloon envelope geometry ────────────────────────────────────────────────
const BAL_CX  = 580;
const BAL_CY  = 148;             // center of envelope
const BAL_RX  = 112;
const BAL_RY  = 148;

// 12 vertical gore panels, alternating colors
const GORE_COLORS = [
  "#c83228", "#f8e060", "#1a3a6a", "#e8a020",
  "#2a6838", "#c83228", "#f8e060", "#1a3a6a",
  "#e8a020", "#2a6838", "#c83228", "#f8e060",
];

// ─── Basket ────────────────────────────────────────────────────────────────────
const BASKET_CX = BAL_CX;
const BASKET_W  = 72;
const BASKET_H  = 48;
// Basket top attaches to BAL_CY + BAL_RY via ropes
const BASKET_TOP_Y = BAL_CY + BAL_RY + 28;

// ─── Suspension ropes from envelope to basket ─────────────────────────────────
// 4 ropes from load ring at envelope base to basket corners
const ROPE_ATTACH_Y = BAL_CY + BAL_RY - 8;
const ROPE_SPREAD   = 38;

// ─── Burner flame (animated) ──────────────────────────────────────────────────
const BURNER_CX = BAL_CX;
const BURNER_Y  = BASKET_TOP_Y;   // burner nozzle top

// ─── Distant hills — Route 9 valley / Shrewsbury hills ────────────────────────
// Rolling terrain layers from far to near
type HillLayer = { d: string; fill: string; opacity: number };
function hillPath(
  yBase: number, amplitude: number, freq: number, phase: number
): string {
  const pts: [number, number][] = [];
  for (let i = 0; i <= 40; i++) {
    const x = (i / 40) * W;
    const y = yBase
      + Math.sin((i / 40) * Math.PI * 2 * freq + phase) * amplitude
      + Math.sin((i / 40) * Math.PI * 2 * freq * 1.7 + phase * 0.6) * amplitude * 0.4;
    pts.push([x, y]);
  }
  const top = pts.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
  return `${top} L${W},${H} L0,${H} Z`;
}

const HILL_LAYERS: HillLayer[] = [
  { d: hillPath(HORIZON_Y - 28, 32, 1.2, 0),    fill: "#4a6838", opacity: 0.65 },
  { d: hillPath(HORIZON_Y + 14, 24, 0.9, 1.1),  fill: "#5a7840", opacity: 0.8  },
  { d: hillPath(HORIZON_Y + 48, 18, 1.4, 2.2),  fill: "#6a8848", opacity: 0.9  },
  { d: hillPath(HORIZON_Y + 88, 14, 1.8, 0.7),  fill: "#5a7030", opacity: 1.0  },
];

// ─── Lake Quinsigamond (far below, shimmer) ────────────────────────────────────
const LAKE_X  = W * 0.56;
const LAKE_Y  = HORIZON_Y + 38;
const LAKE_RX = 180;
const LAKE_RY = 28;

// ─── Route 9 road (visible in valley) ────────────────────────────────────────
// Perspective-foreshortened ribbon
const ROAD_D = `M${W * 0.28},${H} L${W * 0.34},${HORIZON_Y + 80} L${W * 0.52},${HORIZON_Y + 42} L${W * 0.7},${HORIZON_Y + 52} L${W * 0.88},${H} Z`;
const ROAD_CENTER = `M${W * 0.38},${H} Q${W * 0.52},${HORIZON_Y + 44} ${W * 0.78},${H}`;

// ─── Shrewsbury town steeple (tiny, below) ────────────────────────────────────
const STEEPLE_X  = W * 0.62;
const STEEPLE_BY = HORIZON_Y + 62;

// ─── Clouds (at balloon level, passing below) ─────────────────────────────────
type Cloud = { cx: number; cy: number; parts: [number, number, number][] };
const CLOUDS: Cloud[] = [
  { cx: 1080, cy: 118, parts: [[-50, 0, 38], [0, -18, 44], [48, 0, 34], [-18, 18, 26], [22, 16, 22]] },
  { cx: 260,  cy: 210, parts: [[-36, 0, 28], [0, -14, 36], [40, 0, 26], [14, 14, 20]] },
  { cx: 1280, cy: 280, parts: [[-28, 0, 22], [0, -12, 28], [32, 0, 20]] },
];

// ─── Birds (circling updraft beside balloon) ──────────────────────────────────
type Bird = { phase: number; orbitRX: number; orbitRY: number; speed: number };
const BIRDS: Bird[] = Array.from({ length: 7 }, (_, i) => ({
  phase:   (i / 7) * Math.PI * 2,
  orbitRX: 180 + i * 22,
  orbitRY: 60  + i * 8,
  speed:   0.4 + i * 0.08,
}));

// ─── Pennant flags hanging from basket corners ────────────────────────────────
const PENNANT_COLORS = ["#c83228", "#f8e060", "#1a3a6a", "#2a6838"];

// ─── Sandbag ballast (hanging from basket) ────────────────────────────────────
const SANDBAGS = [-22, 0, 22] as number[];

export function AerialBalloon() {
  const ref = useRef<SVGSVGElement>(null);
  const [active, setActive]       = useState(false);
  const [phase, setPhase]         = useState(0);

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
      t += 0.018;
      setPhase(t);
    }, 16);
    return () => clearInterval(tick);
  }, [active]);

  const tr = (d: number) =>
    active ? `opacity 0.8s ease ${d}s, transform 0.8s ease ${d}s` : "none";

  // Balloon gentle drift
  const driftX = Math.sin(phase * 0.38) * 8;
  const driftY = Math.sin(phase * 0.52) * 6;

  // Burner flame height (pulsing)
  const flameH = 38 + Math.sin(phase * 3.2) * 12 + Math.sin(phase * 5.8) * 6;
  const flameOpacity = 0.82 + Math.sin(phase * 4.1) * 0.14;

  // Bird positions
  const birdPositions = BIRDS.map(b => ({
    x: BAL_CX + Math.cos(phase * b.speed + b.phase) * b.orbitRX,
    y: BAL_CY + Math.sin(phase * b.speed + b.phase) * b.orbitRY,
    wingUp: Math.sin(phase * b.speed * 4 + b.phase) > 0,
  }));

  // Lake shimmer
  const lakeShimmer = 0.55 + Math.sin(phase * 1.4) * 0.18;

  // Cloud drift
  const cloudDx = (i: number) => phase * (4 + i * 0.8);

  return (
    <section style={{ background: "#0a0c18", overflow: "hidden", position: "relative" }}>
      <style>{`
        @keyframes ab-sky-fade {
          0%,100% { opacity: 1; }
          50%     { opacity: 0.92; }
        }
        @keyframes ab-lake-shimmer {
          0%,100% { opacity: 0.55; transform: scaleX(1); }
          40%     { opacity: 0.75; transform: scaleX(1.04); }
          70%     { opacity: 0.48; transform: scaleX(0.97); }
        }
        @keyframes ab-road-line {
          0%   { stroke-dashoffset: 0; }
          100% { stroke-dashoffset: -48; }
        }
        @keyframes ab-pennant {
          0%,100% { transform: rotate(-8deg); }
          50%     { transform: rotate(8deg); }
        }
        .ab-lake    { animation: ab-lake-shimmer 5s ease-in-out infinite; transform-origin: center; }
        .ab-road    { animation: ab-road-line 2s linear infinite; stroke-dasharray: 24 16; }
        .ab-pennant { animation: ab-pennant 2.8s ease-in-out infinite; }
      `}</style>

      <svg
        ref={ref}
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="xMidYMid slice"
        style={{ display: "block", width: "100%", height: "auto", minHeight: 360 }}
        aria-label="Hot air balloon rising over Route 9 valley — colorful gore panels, animated burner flame, Lake Quinsigamond below, Shrewsbury hills, soaring birds"
        role="img"
      >
        <defs>
          {/* High-altitude sky */}
          <linearGradient id="ab-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#08091a" />
            <stop offset="22%"  stopColor="#0e1438" />
            <stop offset="48%"  stopColor="#1a2860" />
            <stop offset="70%"  stopColor="#2a4888" />
            <stop offset="85%"  stopColor="#4a78b8" />
            <stop offset="100%" stopColor="#88b8e0" />
          </linearGradient>
          {/* Balloon envelope shadow side */}
          <radialGradient id="ab-env-shading" cx="30%" cy="40%" r="70%">
            <stop offset="0%"   stopColor="white"   stopOpacity="0.18" />
            <stop offset="60%"  stopColor="black"   stopOpacity="0"    />
            <stop offset="100%" stopColor="black"   stopOpacity="0.25" />
          </radialGradient>
          {/* Burner flame */}
          <radialGradient id="ab-flame" cx="50%" cy="90%" r="50%">
            <stop offset="0%"   stopColor="#ffffff" stopOpacity="0.95" />
            <stop offset="20%"  stopColor="#f8f060" stopOpacity="0.9"  />
            <stop offset="55%"  stopColor="#f86020" stopOpacity="0.8"  />
            <stop offset="100%" stopColor="#c02800" stopOpacity="0"    />
          </radialGradient>
          {/* Burner glow inside envelope */}
          <radialGradient id="ab-inner-glow" cx="50%" cy="85%" r="50%">
            <stop offset="0%"   stopColor="#f8c040" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#e06010" stopOpacity="0"    />
          </radialGradient>
          {/* Lake water */}
          <linearGradient id="ab-lake" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%"   stopColor="#4888c8" />
            <stop offset="50%"  stopColor="#2a6ab0" />
            <stop offset="100%" stopColor="#1a4888" />
          </linearGradient>
          {/* Road */}
          <linearGradient id="ab-road" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#5a5048" />
            <stop offset="100%" stopColor="#3a3028" />
          </linearGradient>
          {/* Basket weave */}
          <linearGradient id="ab-basket" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#d0a060" />
            <stop offset="100%" stopColor="#a07030" />
          </linearGradient>
          <filter id="ab-blur-sm">
            <feGaussianBlur stdDeviation="3" />
          </filter>
          <filter id="ab-blur-lg">
            <feGaussianBlur stdDeviation="18" />
          </filter>
          <filter id="ab-blur-xl">
            <feGaussianBlur stdDeviation="32" />
          </filter>
        </defs>

        {/* ── Sky background ── */}
        <rect x="0" y="0" width={W} height={H} fill="url(#ab-sky)" />

        {/* ── Stars (high altitude — faint) ── */}
        {Array.from({ length: 44 }, (_, i) => {
          const ang = i * 137.508 * Math.PI / 180;
          const r2  = Math.sqrt(i / 44) * W * 0.85;
          const sx  = ((W * 0.5 + Math.cos(ang) * r2) % W + W) % W;
          const sy  = ((H * 0.2 + Math.sin(ang) * r2 * 0.4) % (H * 0.45) + H * 0.45) % (H * 0.45);
          return (
            <circle key={i} cx={sx} cy={sy} r={0.8 + (i % 3) * 0.4}
              fill="white" opacity={0.12 + (i % 4) * 0.06}
            />
          );
        })}

        {/* ── Clouds (at balloon level) ── */}
        {CLOUDS.map((cl, i) => (
          <g key={i} style={{
            transform: `translateX(${-cloudDx(i) % (W + 200)}px)`,
            transition: "none",
            opacity: active ? 0.82 : 0,
          }}>
            {cl.parts.map(([dx, dy, r], pi) => (
              <ellipse key={pi}
                cx={cl.cx + dx} cy={cl.cy + dy}
                rx={r} ry={r * 0.48}
                fill="white" opacity={0.55 + pi * 0.04}
              />
            ))}
          </g>
        ))}

        {/* ── Distant hills ── */}
        {HILL_LAYERS.map((hl, i) => (
          <path key={i} d={hl.d} fill={hl.fill} opacity={hl.opacity}
            style={{ opacity: active ? hl.opacity : 0, transition: tr(0.06 + i * 0.03) }}
          />
        ))}

        {/* ── Lake Quinsigamond (shimmering) ── */}
        <g style={{ opacity: active ? 1 : 0, transition: tr(0.1) }}>
          {/* Main water body */}
          <ellipse cx={LAKE_X} cy={LAKE_Y} rx={LAKE_RX} ry={LAKE_RY}
            fill="url(#ab-lake)" className="ab-lake"
          />
          {/* Shimmer lines */}
          {Array.from({ length: 8 }, (_, i) => (
            <line key={i}
              x1={LAKE_X - LAKE_RX * 0.7 + i * 42} y1={LAKE_Y - 4 + i % 3}
              x2={LAKE_X - LAKE_RX * 0.4 + i * 42} y2={LAKE_Y - 4 + i % 3}
              stroke="white" strokeWidth="1.5"
              opacity={lakeShimmer * 0.5 * (1 - i * 0.06)}
              style={{ transition: "none" }}
            />
          ))}
          {/* Balloon reflection on lake */}
          <ellipse cx={LAKE_X - 80} cy={LAKE_Y + 8} rx={22} ry={10}
            fill="#c83228" opacity={lakeShimmer * 0.3} style={{ transition: "none" }}
          />
        </g>

        {/* ── Route 9 road in valley ── */}
        <g style={{ opacity: active ? 1 : 0, transition: tr(0.12) }}>
          <path d={ROAD_D} fill="url(#ab-road)" opacity="0.7" />
          {/* Center line (animated dashes) */}
          <path d={ROAD_CENTER} fill="none" stroke="#f8e090"
            strokeWidth="2" className="ab-road" opacity="0.45" />
        </g>

        {/* ── Shrewsbury steeple (tiny, distant) ── */}
        <g style={{ opacity: active ? 0.65 : 0, transition: tr(0.14) }}>
          <rect x={STEEPLE_X - 8} y={STEEPLE_BY - 22} width={16} height={22}
            fill="#d8d0c0" />
          <polygon
            points={`${STEEPLE_X - 8},${STEEPLE_BY - 22} ${STEEPLE_X},${STEEPLE_BY - 44} ${STEEPLE_X + 8},${STEEPLE_BY - 22}`}
            fill="#8a7060"
          />
          <line x1={STEEPLE_X} y1={STEEPLE_BY - 44} x2={STEEPLE_X} y2={STEEPLE_BY - 52}
            stroke="#5a3010" strokeWidth="1.5" />
          {/* Cross */}
          <line x1={STEEPLE_X - 4} y1={STEEPLE_BY - 50} x2={STEEPLE_X + 4} y2={STEEPLE_BY - 50}
            stroke="#5a3010" strokeWidth="1.5" />
        </g>

        {/* ── Balloon group (drifting) ── */}
        <g style={{
          transform: `translate(${driftX}px, ${driftY}px)`,
          transition: "none",
          opacity: active ? 1 : 0,
        }}>

          {/* ─ Inner envelope glow (burner light from below) ─ */}
          <ellipse cx={BAL_CX} cy={BAL_CY + BAL_RY * 0.4}
            rx={BAL_RX * 0.7} ry={BAL_RY * 0.55}
            fill="url(#ab-inner-glow)"
            style={{ opacity: flameOpacity * 0.7 }}
          />

          {/* ─ Envelope gore panels ─ */}
          {GORE_COLORS.map((col, i) => {
            // Each gore is a vertical wedge of the ellipse
            const a1 = (i / GORE_COLORS.length) * Math.PI * 2 - Math.PI / 2;
            const a2 = ((i + 1) / GORE_COLORS.length) * Math.PI * 2 - Math.PI / 2;
            const aMid = (a1 + a2) / 2;

            // Build a curved gore path using the ellipse equations
            // We draw the gore as a filled path with curved sides
            // Subdivide each gore arc into 6 steps
            const STEPS = 6;
            const outerPts: [number, number][] = [];
            const innerPts: [number, number][] = [];

            for (let s = 0; s <= STEPS; s++) {
              const a = a1 + (a2 - a1) * (s / STEPS);
              outerPts.push([
                BAL_CX + Math.cos(a) * BAL_RX,
                BAL_CY + Math.sin(a) * BAL_RY,
              ]);
            }
            // Inner edge is the gore spine (center seam line — just the center point)
            // Actually draw a filled gore as: outer arc, then line to center
            // Use a flattened inner width for the gore bulge effect
            const goreW = (BAL_RX * 0.12);
            for (let s = 0; s <= STEPS; s++) {
              const a = a1 + (a2 - a1) * (s / STEPS);
              const bulge = Math.cos((s / STEPS - 0.5) * Math.PI) * goreW;
              innerPts.push([
                BAL_CX + Math.cos(a) * (BAL_RX - bulge * 0.8),
                BAL_CY + Math.sin(a) * (BAL_RY - bulge * 0.8),
              ]);
            }
            void aMid;
            void innerPts;

            const d = [
              ...outerPts.map(([x, y], si) => `${si === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`),
              `L${BAL_CX.toFixed(1)},${BAL_CY.toFixed(1)}`,
              "Z",
            ].join(" ");

            return (
              <path key={i} d={d} fill={col} opacity="0.92"
                stroke={col} strokeWidth="0.5"
              />
            );
          })}

          {/* ─ Gore seam lines ─ */}
          {GORE_COLORS.map((_, i) => {
            const a = (i / GORE_COLORS.length) * Math.PI * 2 - Math.PI / 2;
            return (
              <line key={i}
                x1={BAL_CX} y1={BAL_CY}
                x2={BAL_CX + Math.cos(a) * BAL_RX}
                y2={BAL_CY + Math.sin(a) * BAL_RY}
                stroke="rgba(0,0,0,0.18)" strokeWidth="1.5"
              />
            );
          })}

          {/* ─ Envelope outline + shading ─ */}
          <ellipse cx={BAL_CX} cy={BAL_CY} rx={BAL_RX} ry={BAL_RY}
            fill="url(#ab-env-shading)" />
          <ellipse cx={BAL_CX} cy={BAL_CY} rx={BAL_RX} ry={BAL_RY}
            fill="none" stroke="rgba(0,0,0,0.22)" strokeWidth="2" />

          {/* ─ Equator band ─ */}
          <ellipse cx={BAL_CX} cy={BAL_CY} rx={BAL_RX} ry={BAL_RY * 0.06}
            fill="none" stroke="#2a1a0a" strokeWidth="3.5" opacity="0.4" />

          {/* ─ Load ring at base ─ */}
          <ellipse cx={BAL_CX} cy={BAL_CY + BAL_RY - 6}
            rx={BAL_RX * 0.28} ry={BAL_RY * 0.05}
            fill="none" stroke="#5a3810" strokeWidth="4"
          />

          {/* ─ Suspension ropes ─ */}
          {[
            [-ROPE_SPREAD, ROPE_ATTACH_Y, BASKET_CX - BASKET_W * 0.45, BASKET_TOP_Y],
            [ ROPE_SPREAD, ROPE_ATTACH_Y, BASKET_CX + BASKET_W * 0.45, BASKET_TOP_Y],
            [-ROPE_SPREAD * 0.5, ROPE_ATTACH_Y, BASKET_CX - BASKET_W * 0.2, BASKET_TOP_Y],
            [ ROPE_SPREAD * 0.5, ROPE_ATTACH_Y, BASKET_CX + BASKET_W * 0.2, BASKET_TOP_Y],
          ].map(([x1, y1, x2, y2], ri) => (
            <line key={ri}
              x1={BAL_CX + x1} y1={y1}
              x2={x2} y2={y2}
              stroke="#8a6030" strokeWidth="2" opacity="0.75"
            />
          ))}

          {/* ─ Burner flame ─ */}
          <ellipse cx={BURNER_CX} cy={BURNER_Y - flameH * 0.5}
            rx={12 + flameH * 0.18} ry={flameH}
            fill="url(#ab-flame)"
            opacity={flameOpacity}
            style={{ transition: "none" }}
          />
          {/* Inner flame core */}
          <ellipse cx={BURNER_CX} cy={BURNER_Y - flameH * 0.3}
            rx={6} ry={flameH * 0.5}
            fill="white" opacity={flameOpacity * 0.6}
            style={{ transition: "none" }}
          />
          {/* Burner nozzle */}
          <rect x={BURNER_CX - 8} y={BURNER_Y} width={16} height={12}
            rx="2" fill="#3a3a3a"
          />
          <rect x={BURNER_CX - 14} y={BURNER_Y + 8} width={28} height={8}
            rx="3" fill="#2a2a2a"
          />

          {/* ─ Basket ─ */}
          <rect x={BASKET_CX - BASKET_W / 2} y={BASKET_TOP_Y}
            width={BASKET_W} height={BASKET_H}
            rx="6" fill="url(#ab-basket)"
            stroke="#7a5020" strokeWidth="2"
          />
          {/* Basket weave pattern */}
          {Array.from({ length: 5 }, (_, i) => (
            <line key={i}
              x1={BASKET_CX - BASKET_W / 2} y1={BASKET_TOP_Y + i * (BASKET_H / 5) + 4}
              x2={BASKET_CX + BASKET_W / 2} y2={BASKET_TOP_Y + i * (BASKET_H / 5) + 4}
              stroke="#8a6030" strokeWidth="1.5" opacity="0.45"
            />
          ))}
          {Array.from({ length: 5 }, (_, i) => (
            <line key={i}
              x1={BASKET_CX - BASKET_W / 2 + i * (BASKET_W / 5) + 6} y1={BASKET_TOP_Y}
              x2={BASKET_CX - BASKET_W / 2 + i * (BASKET_W / 5) + 6} y2={BASKET_TOP_Y + BASKET_H}
              stroke="#8a6030" strokeWidth="1.5" opacity="0.35"
            />
          ))}
          {/* Basket rim */}
          <rect x={BASKET_CX - BASKET_W / 2 - 3} y={BASKET_TOP_Y - 4}
            width={BASKET_W + 6} height={10}
            rx="3" fill="#9a7038"
          />

          {/* ─ Passengers in basket (heads visible) ─ */}
          {[-18, 4, 22].map((px, pi) => (
            <g key={pi}>
              <circle cx={BASKET_CX + px} cy={BASKET_TOP_Y - 6} r={10}
                fill={["#d4a878", "#c8906a", "#d4a878"][pi] ?? "#d4a878"}
              />
              <ellipse cx={BASKET_CX + px} cy={BASKET_TOP_Y - 14} rx={9} ry={6}
                fill={["#2a1a0a", "#5a3820", "#3a2010"][pi] ?? "#2a1a0a"}
              />
              {/* Hat */}
              {pi === 0 && (
                <ellipse cx={BASKET_CX + px} cy={BASKET_TOP_Y - 18} rx={12} ry={4}
                  fill="#3a2a18"
                />
              )}
            </g>
          ))}

          {/* ─ Pennant flags on basket corners ─ */}
          {[BASKET_CX - BASKET_W / 2, BASKET_CX + BASKET_W / 2 - 8].map((px, pi) => (
            <polygon key={pi}
              points={`${px},${BASKET_TOP_Y} ${px + 10},${BASKET_TOP_Y + 4} ${px},${BASKET_TOP_Y + 18}`}
              fill={PENNANT_COLORS[pi] ?? "#c83228"}
              className="ab-pennant"
              style={{ animationDelay: `${pi * 0.4}s`,
                       transformOrigin: `${px}px ${BASKET_TOP_Y}px` }}
            />
          ))}

          {/* ─ Sandbag ballast ─ */}
          {SANDBAGS.map((sbx, si) => (
            <g key={si}>
              <line
                x1={BASKET_CX + sbx} y1={BASKET_TOP_Y + BASKET_H}
                x2={BASKET_CX + sbx} y2={BASKET_TOP_Y + BASKET_H + 22}
                stroke="#7a6030" strokeWidth="2"
              />
              <ellipse cx={BASKET_CX + sbx} cy={BASKET_TOP_Y + BASKET_H + 28}
                rx={9} ry={12}
                fill="#8a7040" stroke="#6a5028" strokeWidth="1.5"
              />
            </g>
          ))}
        </g>

        {/* ── Soaring birds (circling updraft) ── */}
        {birdPositions.map((bp, i) => (
          <g key={i} style={{
            transform: `translate(${bp.x}px, ${bp.y}px)`,
            opacity: active ? 0.7 : 0,
            transition: active ? "none" : tr(0.3),
          }}>
            {/* Simplified gull silhouette */}
            <path
              d={bp.wingUp
                ? `M-12,0 Q-4,-6 0,-2 Q4,-6 12,0`
                : `M-12,0 Q-4,4 0,2 Q4,4 12,0`}
              fill="none" stroke="#c8d8e8"
              strokeWidth="2" strokeLinecap="round"
            />
          </g>
        ))}

        {/* ── Scene label ── */}
        <g style={{
          opacity: active ? 1 : 0,
          transform: active ? "translateY(0)" : "translateY(-8px)",
          transition: tr(0.08),
        }}>
          <text x={W / 2} y={H - 14} textAnchor="middle"
            fontFamily="'Georgia', serif" fontSize="11" fill="#a8c8f0"
            letterSpacing="3" opacity="0.58">
            SHREWSBURY · LAKE QUINSIGAMOND VALLEY · ROUTE 9 BELOW
          </text>
        </g>
      </svg>
    </section>
  );
}
