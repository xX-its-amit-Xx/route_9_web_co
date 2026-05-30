"use client";
import { useEffect, useRef, useState } from "react";

const W = 1440;
const H = 560;

// ─── Scene geometry ────────────────────────────────────────────────────────────
const HORIZON_Y   = 198;
const WATER_Y     = HORIZON_Y + 28;   // flooded bog surface starts here
const BOG_BOTTOM  = H - 44;
const SHORE_LEFT  = 48;
const SHORE_RIGHT = W - 48;

// ─── Sunrise sky gradient stops ───────────────────────────────────────────────
// Pre-dawn crimson → rose → pale gold → powder blue

// ─── Salt marsh grasses (far shore silhouette) ────────────────────────────────
// Built as a wavy band along the horizon
const MARSH_BAND_D = (() => {
  const pts: [number, number][] = [];
  for (let i = 0; i <= 72; i++) {
    const x = (i / 72) * W;
    const y = HORIZON_Y - 8 + Math.sin(i * 0.7) * 6 + Math.sin(i * 1.9) * 3;
    pts.push([x, y]);
  }
  const top = pts.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
  return `${top} L${W},${HORIZON_Y + 18} L0,${HORIZON_Y + 18} Z`;
})();

// ─── Marsh grass blade clusters ──────────────────────────────────────────────
type GrassCluster = { x: number; y: number; count: number; height: number; shade: string };
const GRASS_CLUSTERS: GrassCluster[] = Array.from({ length: 48 }, (_, i) => {
  const ang = i * 137.508 * Math.PI / 180;
  const spread = Math.sqrt(i / 48) * W;
  return {
    x:      ((W * 0.5 + Math.cos(ang) * spread) % W + W) % W,
    y:      HORIZON_Y - 4 + (i % 5) * 3,
    count:  3 + i % 4,
    height: 22 + (i % 14),
    shade:  i % 3 === 0 ? "#4a6030" : i % 3 === 1 ? "#5a7038" : "#3a5028",
  };
});

// ─── Cranberries floating on bog surface ──────────────────────────────────────
type Berry = { cx: number; cy: number; r: number; shade: string; waveOffset: number };
const BERRIES: Berry[] = Array.from({ length: 280 }, (_, i) => {
  const ang = i * 137.508 * Math.PI / 180;
  // Concentrate in the center-left bog area
  const spread = Math.sqrt(i / 280);
  const bx = 180 + spread * 820 * Math.abs(Math.cos(ang));
  const by = WATER_Y + 18 + spread * (BOG_BOTTOM - WATER_Y - 60) * Math.abs(Math.sin(ang));
  return {
    cx:  bx,
    cy:  by,
    r:   3.5 + (i % 3) * 1.2,
    shade: i % 4 === 0 ? "#c82020" : i % 4 === 1 ? "#e03030" : i % 4 === 2 ? "#a81818" : "#d42828",
    waveOffset: (i * 0.48) % (Math.PI * 2),
  };
});

// ─── Boom sections (wooden log booms corralling berries) ─────────────────────
// Each boom: array of log segment endpoints
type BoomLog = { x1: number; y1: number; x2: number; y2: number };
const BOOM_A: BoomLog[] = [
  { x1: 160, y1: WATER_Y + 42,  x2: 280,  y2: WATER_Y + 68  },
  { x1: 280, y1: WATER_Y + 68,  x2: 400,  y2: WATER_Y + 58  },
  { x1: 400, y1: WATER_Y + 58,  x2: 520,  y2: WATER_Y + 82  },
  { x1: 520, y1: WATER_Y + 82,  x2: 620,  y2: WATER_Y + 72  },
  { x1: 620, y1: WATER_Y + 72,  x2: 700,  y2: WATER_Y + 56  },
];
const BOOM_B: BoomLog[] = [
  { x1: 200, y1: WATER_Y + 160, x2: 360,  y2: WATER_Y + 148 },
  { x1: 360, y1: WATER_Y + 148, x2: 500,  y2: WATER_Y + 162 },
  { x1: 500, y1: WATER_Y + 162, x2: 660,  y2: WATER_Y + 144 },
  { x1: 660, y1: WATER_Y + 144, x2: 800,  y2: WATER_Y + 158 },
];

// ─── Workers in waders ────────────────────────────────────────────────────────
type Worker = { cx: number; cy: number; facingRight: boolean; vestColor: string; rakeAngle: number };
const WORKERS: Worker[] = [
  { cx: 340,  cy: WATER_Y + 96,  facingRight: true,  vestColor: "#c87828", rakeAngle: -18 },
  { cx: 460,  cy: WATER_Y + 88,  facingRight: false, vestColor: "#2a5a8a", rakeAngle:  22 },
  { cx: 560,  cy: WATER_Y + 112, facingRight: true,  vestColor: "#8a2a18", rakeAngle: -28 },
  { cx: 680,  cy: WATER_Y + 78,  facingRight: true,  vestColor: "#2a6838", rakeAngle:  12 },
  { cx: 790,  cy: WATER_Y + 102, facingRight: false, vestColor: "#c87828", rakeAngle: -20 },
  { cx: 920,  cy: WATER_Y + 68,  facingRight: false, vestColor: "#1a3a5a", rakeAngle:  30 },
];

// ─── Johnboat ────────────────────────────────────────────────────────────────
const BOAT_CX   = 1060;
const BOAT_Y    = WATER_Y + 52;
const BOAT_W    = 148;
const BOAT_H    = 32;

// ─── Far shore (opposite bank) trees ──────────────────────────────────────────
const FAR_TREES = Array.from({ length: 36 }, (_, i) => ({
  cx:     i * 42 - 8,
  h:      28 + (i * 7) % 22,
  shade:  i % 3 === 0 ? "#3a5028" : i % 3 === 1 ? "#2a4020" : "#4a6030",
}));

// ─── Mist bands rising off water ──────────────────────────────────────────────
type MistBand = { y: number; opacity: number; scaleX: number };
const MIST_BANDS: MistBand[] = [
  { y: WATER_Y + 14, opacity: 0.22, scaleX: 1.0 },
  { y: WATER_Y + 38, opacity: 0.16, scaleX: 0.88 },
  { y: WATER_Y + 62, opacity: 0.12, scaleX: 0.78 },
  { y: WATER_Y + 96, opacity: 0.09, scaleX: 0.92 },
];

// ─── Water ripple rings ────────────────────────────────────────────────────────
type Ripple = { cx: number; cy: number; phase: number };
const RIPPLES: Ripple[] = [
  { cx: 350, cy: WATER_Y + 90,  phase: 0    },
  { cx: 510, cy: WATER_Y + 108, phase: 1.1  },
  { cx: 680, cy: WATER_Y + 74,  phase: 2.2  },
  { cx: 820, cy: WATER_Y + 95,  phase: 0.6  },
  { cx: 940, cy: WATER_Y + 62,  phase: 1.8  },
];

// ─── Sun rising ───────────────────────────────────────────────────────────────
const SUN_CX = W * 0.72;
const SUN_CY = HORIZON_Y - 14;
const SUN_R  = 28;

// ─── Shore path (near) ────────────────────────────────────────────────────────
// Dike / earthen bank the workers walk on — right side
const DIKE_X = W - 180;

export function CranberryBog() {
  const ref = useRef<SVGSVGElement>(null);
  const [active, setActive]     = useState(false);
  const [wavePhase, setWavePhase] = useState(0);

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
      t += 0.037;
      setWavePhase(t);
    }, 33);
    return () => clearInterval(tick);
  }, [active]);

  const tr = (d: number) =>
    active ? `opacity 0.75s ease ${d}s, transform 0.75s ease ${d}s` : "none";

  // Berry drift on gentle wave
  const berryDx = (berry: Berry) =>
    Math.sin(wavePhase * 0.6 + berry.waveOffset) * 2.2;
  const berryDy = (berry: Berry) =>
    Math.cos(wavePhase * 0.4 + berry.waveOffset) * 1.4;

  // Worker rake arm sway
  const rakeSwing = (w: Worker, idx: number) =>
    w.rakeAngle + Math.sin(wavePhase * 1.4 + idx * 0.9) * 8;

  // Ripple scale
  const rippleScale = (r: Ripple) => {
    const t2 = (wavePhase * 0.8 + r.phase) % (Math.PI * 2);
    return 0.3 + (t2 / (Math.PI * 2)) * 0.7;
  };
  const rippleOpacity = (r: Ripple) => {
    const t2 = (wavePhase * 0.8 + r.phase) % (Math.PI * 2);
    return Math.max(0, 0.55 - (t2 / (Math.PI * 2)) * 0.55);
  };

  // Mist drift
  const mistDx = (i: number) =>
    Math.sin(wavePhase * 0.22 + i * 0.8) * 18;

  // Boat gentle rock
  const boatRock = Math.sin(wavePhase * 0.55) * 1.8;

  return (
    <section style={{ background: "#0e0a14", overflow: "hidden", position: "relative" }}>
      <style>{`
        @keyframes cb-sun-pulse {
          0%,100% { r: ${SUN_R}; opacity: 0.92; }
          50%     { r: ${SUN_R + 3}; opacity: 1; }
        }
        @keyframes cb-mist-drift {
          0%   { transform: translateX(0) scaleY(1); opacity: var(--cb-mo, 0.15); }
          50%  { transform: translateX(28px) scaleY(1.3); opacity: calc(var(--cb-mo, 0.15) * 0.6); }
          100% { transform: translateX(0) scaleY(1); opacity: var(--cb-mo, 0.15); }
        }
        @keyframes cb-water-shimmer {
          0%,100% { opacity: 0.18; }
          50%     { opacity: 0.32; }
        }
        @keyframes cb-grass-sway {
          0%,100% { transform: rotate(0deg); }
          50%     { transform: rotate(var(--cb-gs, 4deg)); }
        }
        .cb-mist  { animation: cb-mist-drift 8s ease-in-out infinite; transform-origin: center; }
        .cb-grass { animation: cb-grass-sway 4s ease-in-out infinite; transform-origin: bottom center; }
        .cb-shimmer { animation: cb-water-shimmer 3s ease-in-out infinite; }
      `}</style>

      <svg
        ref={ref}
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="xMidYMid slice"
        style={{ display: "block", width: "100%", height: "auto", minHeight: 320 }}
        aria-label="Cape Cod cranberry bog harvest at dawn — flooded crimson bog, workers in waders, wooden booms corralling berries, johnboat, salt marsh grasses, sunrise mist"
        role="img"
      >
        <defs>
          {/* Pre-dawn to sunrise sky */}
          <linearGradient id="cb-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#0a0818" />
            <stop offset="18%"  stopColor="#1a0c28" />
            <stop offset="38%"  stopColor="#5a1828" />
            <stop offset="58%"  stopColor="#c83828" />
            <stop offset="72%"  stopColor="#e86020" />
            <stop offset="84%"  stopColor="#f09040" />
            <stop offset="100%" stopColor="#f8c860" />
          </linearGradient>
          {/* Flooded bog water — deep crimson from berries */}
          <linearGradient id="cb-water" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#8a1818" />
            <stop offset="30%"  stopColor="#6a1010" />
            <stop offset="100%" stopColor="#3a0808" />
          </linearGradient>
          {/* Shore/dike earthen bank */}
          <linearGradient id="cb-shore" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#6a5030" />
            <stop offset="100%" stopColor="#4a3820" />
          </linearGradient>
          {/* Sun glow */}
          <radialGradient id="cb-sun-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="#f8e060" stopOpacity="0.9" />
            <stop offset="40%"  stopColor="#f09030" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#e05010" stopOpacity="0"   />
          </radialGradient>
          {/* Water sun reflection */}
          <radialGradient id="cb-sun-reflect" cx="50%" cy="10%" r="60%">
            <stop offset="0%"   stopColor="#f8d060" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#c84020" stopOpacity="0"    />
          </radialGradient>
          {/* Worker waders — rubber green/brown */}
          <linearGradient id="cb-waders" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#3a4a28" />
            <stop offset="100%" stopColor="#2a3818" />
          </linearGradient>
          <filter id="cb-blur-sm">
            <feGaussianBlur stdDeviation="3" />
          </filter>
          <filter id="cb-blur-lg">
            <feGaussianBlur stdDeviation="14" />
          </filter>
          <clipPath id="cb-water-clip">
            <rect x="0" y={WATER_Y} width={W} height={BOG_BOTTOM - WATER_Y} />
          </clipPath>
        </defs>

        {/* ── Sky ── */}
        <rect x="0" y="0" width={W} height={H} fill="url(#cb-sky)" />

        {/* ── Sun (rising at horizon) ── */}
        <g style={{ opacity: active ? 1 : 0, transition: tr(0.05) }}>
          {/* Wide glow corona */}
          <ellipse cx={SUN_CX} cy={SUN_CY} rx={140} ry={72}
            fill="url(#cb-sun-glow)" filter="url(#cb-blur-lg)" />
          {/* Sun disc */}
          <circle cx={SUN_CX} cy={SUN_CY} r={SUN_R} fill="#f8e060" />
          {/* Horizon cut (partially below) */}
          <circle cx={SUN_CX} cy={SUN_CY} r={SUN_R + 1} fill="#f8e060"
            clipPath="url(#cb-water-clip)" opacity="0" />
        </g>

        {/* ── Far treeline silhouette ── */}
        <g style={{ opacity: active ? 0.85 : 0, transition: tr(0.06) }}>
          {FAR_TREES.map((ft, i) => (
            <ellipse key={i}
              cx={ft.cx} cy={HORIZON_Y - ft.h * 0.5}
              rx={16 + i % 10} ry={ft.h * 0.55}
              fill={ft.shade}
            />
          ))}
        </g>

        {/* ── Marsh grass band (horizon silhouette) ── */}
        <path d={MARSH_BAND_D} fill="#2a3a18" opacity="0.92" />

        {/* ── Individual marsh grass clusters ── */}
        {GRASS_CLUSTERS.slice(0, 28).map((gc, i) => (
          <g key={i} className="cb-grass"
             style={{
               ["--cb-gs" as string]: `${i % 2 === 0 ? 5 : -4}deg`,
               animationDelay: `${(i * 0.3) % 3.2}s`,
             }}>
            {Array.from({ length: gc.count }, (_, bi) => {
              const bx = gc.x + bi * 5 - gc.count * 2.5;
              return (
                <line key={bi}
                  x1={bx} y1={gc.y}
                  x2={bx + (bi % 2 === 0 ? -3 : 3)} y2={gc.y - gc.height}
                  stroke={gc.shade} strokeWidth="2.5" strokeLinecap="round"
                />
              );
            })}
          </g>
        ))}

        {/* ── Flooded bog water ── */}
        <rect x="0" y={WATER_Y} width={W} height={BOG_BOTTOM - WATER_Y}
          fill="url(#cb-water)" />

        {/* ── Water shimmer lines ── */}
        {Array.from({ length: 14 }, (_, i) => (
          <line key={i}
            x1={i * 104} y1={WATER_Y + 8 + i * 14}
            x2={i * 104 + 88} y2={WATER_Y + 8 + i * 14}
            stroke="#c83030" strokeWidth="1.5"
            className="cb-shimmer"
            style={{ animationDelay: `${i * 0.22}s` }}
            opacity="0.22"
          />
        ))}

        {/* ── Sun reflection on water ── */}
        <ellipse cx={SUN_CX} cy={WATER_Y + 28} rx={120} ry={60}
          fill="url(#cb-sun-reflect)" />

        {/* ── Cranberries floating ── */}
        {BERRIES.map((b, i) => (
          <circle key={i}
            cx={b.cx + berryDx(b)}
            cy={b.cy + berryDy(b)}
            r={b.r}
            fill={b.shade}
            style={{ transition: "none", opacity: active ? 0.88 : 0 }}
          />
        ))}

        {/* ── Berry density highlight (red carpet effect) ── */}
        {/* Concentrated patch at center-left */}
        <ellipse cx={460} cy={WATER_Y + 110} rx={180} ry={62}
          fill="#c82020" opacity="0.22" style={{ filter: "blur(8px)" }}
        />
        <ellipse cx={580} cy={WATER_Y + 140} rx={160} ry={48}
          fill="#a81818" opacity="0.18" style={{ filter: "blur(6px)" }}
        />

        {/* ── Wooden boom logs ── */}
        {[...BOOM_A, ...BOOM_B].map((bl, i) => (
          <g key={i} style={{ opacity: active ? 1 : 0, transition: tr(0.18 + i * 0.02) }}>
            <line x1={bl.x1} y1={bl.y1} x2={bl.x2} y2={bl.y2}
              stroke="#8a6030" strokeWidth="9" strokeLinecap="round" />
            {/* Log texture grain */}
            <line x1={bl.x1 + 3} y1={bl.y1 + 2} x2={bl.x2 + 3} y2={bl.y2 + 2}
              stroke="#6a4820" strokeWidth="2.5" opacity="0.45" strokeLinecap="round" />
            {/* Rope tether marks */}
            <circle cx={bl.x1} cy={bl.y1} r={5} fill="#5a3810" />
            <circle cx={bl.x2} cy={bl.y2} r={5} fill="#5a3810" />
          </g>
        ))}

        {/* ── Water ripple rings (around worker feet) ── */}
        {RIPPLES.map((rp, i) => {
          const sc = rippleScale(rp);
          const op = rippleOpacity(rp);
          return (
            <g key={i}>
              <ellipse cx={rp.cx} cy={rp.cy}
                rx={14 * sc} ry={5 * sc}
                fill="none" stroke="#f0a060"
                strokeWidth="1.2"
                opacity={op * 0.6}
                style={{ transition: "none" }}
              />
              <ellipse cx={rp.cx} cy={rp.cy}
                rx={22 * sc} ry={8 * sc}
                fill="none" stroke="#c07040"
                strokeWidth="0.8"
                opacity={op * 0.4}
                style={{ transition: "none" }}
              />
            </g>
          );
        })}

        {/* ── Workers in waders ── */}
        {WORKERS.map((wk, i) => {
          const rk = rakeSwing(wk, i);
          const waterlineY = wk.cy + 28;   // where they're submerged
          return (
            <g key={i} style={{
              opacity: active ? 1 : 0,
              transform: active ? "translateY(0)" : "translateY(12px)",
              transition: tr(0.2 + i * 0.04),
            }}>
              {/* Waders (visible from waterline up) */}
              <rect x={wk.cx - 10} y={waterlineY - 52}
                width={20} height={54}
                rx="4" fill="url(#cb-waders)"
              />
              {/* Vest / jacket */}
              <rect x={wk.cx - 12} y={wk.cy - 54}
                width={24} height={28}
                rx="4" fill={wk.vestColor}
              />
              {/* Submerged lower body */}
              <rect x={wk.cx - 8} y={waterlineY}
                width={16} height={wk.cy + 42 - waterlineY}
                rx="2" fill="url(#cb-waders)" opacity="0.5"
              />
              {/* Head */}
              <circle cx={wk.cx} cy={wk.cy - 66} r={12} fill="#d4a878" />
              {/* Wide-brim hat */}
              <ellipse cx={wk.cx} cy={wk.cy - 76} rx={18} ry={5} fill="#5a3810" />
              <rect x={wk.cx - 10} y={wk.cy - 86} width={20} height={12}
                rx="4" fill="#6a4820" />
              {/* Rake arm (animated swing) */}
              <g style={{
                transform: `rotate(${rk}deg)`,
                transformOrigin: `${wk.cx + (wk.facingRight ? 12 : -12)}px ${wk.cy - 44}px`,
                transition: "none",
              }}>
                <path
                  d={`M${wk.cx + (wk.facingRight ? 12 : -12)},${wk.cy - 44} L${wk.cx + (wk.facingRight ? 52 : -52)},${wk.cy - 14}`}
                  fill="none" stroke="#8a6030" strokeWidth="5" strokeLinecap="round"
                />
                {/* Rake head tines */}
                {[-10, -5, 0, 5, 10].map(tx => (
                  <line key={tx}
                    x1={wk.cx + (wk.facingRight ? 52 + tx : -52 + tx)} y1={wk.cy - 14}
                    x2={wk.cx + (wk.facingRight ? 52 + tx : -52 + tx)} y2={wk.cy - 2}
                    stroke="#6a4018" strokeWidth="2.5" strokeLinecap="round"
                  />
                ))}
              </g>
            </g>
          );
        })}

        {/* ── Johnboat ── */}
        <g style={{
          opacity: active ? 1 : 0,
          transform: active
            ? `translateY(${boatRock}px) rotate(${boatRock * 0.4}deg)`
            : "translateY(12px)",
          transformOrigin: `${BOAT_CX}px ${BOAT_Y + BOAT_H}px`,
          transition: active ? "none" : tr(0.22),
        }}>
          {/* Hull */}
          <path
            d={`M${BOAT_CX - BOAT_W / 2 + 12},${BOAT_Y} L${BOAT_CX - BOAT_W / 2 - 4},${BOAT_Y + BOAT_H} L${BOAT_CX + BOAT_W / 2 + 4},${BOAT_Y + BOAT_H} L${BOAT_CX + BOAT_W / 2 - 8},${BOAT_Y} Z`}
            fill="#6a4820" stroke="#4a3010" strokeWidth="2"
          />
          {/* Hull interior */}
          <path
            d={`M${BOAT_CX - BOAT_W / 2 + 18},${BOAT_Y + 6} L${BOAT_CX - BOAT_W / 2 + 2},${BOAT_Y + BOAT_H - 4} L${BOAT_CX + BOAT_W / 2},${BOAT_Y + BOAT_H - 4} L${BOAT_CX + BOAT_W / 2 - 14},${BOAT_Y + 6} Z`}
            fill="#7a5428"
          />
          {/* Seat planks */}
          {[0.3, 0.6].map((t, si) => (
            <line key={si}
              x1={BOAT_CX - BOAT_W * 0.35 + t * BOAT_W * 0.1} y1={BOAT_Y + BOAT_H * 0.4}
              x2={BOAT_CX + BOAT_W * 0.35 - t * BOAT_W * 0.1} y2={BOAT_Y + BOAT_H * 0.4}
              stroke="#5a3818" strokeWidth="5" strokeLinecap="round"
            />
          ))}
          {/* Boat person with pole */}
          <rect x={BOAT_CX + 18} y={BOAT_Y - 48} width={16} height={44}
            rx="4" fill="#2a5a8a" />
          <circle cx={BOAT_CX + 26} cy={BOAT_Y - 60} r={11} fill="#d4a878" />
          {/* Pole */}
          <line x1={BOAT_CX + 34} y1={BOAT_Y - 52}
            x2={BOAT_CX + 44} y2={BOAT_Y + BOAT_H + 18}
            stroke="#8a6030" strokeWidth="4" strokeLinecap="round"
          />
          {/* Berry scoop / paddle at stern */}
          <path d={`M${BOAT_CX - 44},${BOAT_Y + 8} Q${BOAT_CX - 62},${BOAT_Y + 18} ${BOAT_CX - 52},${BOAT_Y + BOAT_H + 8}`}
            fill="none" stroke="#8a6030" strokeWidth="4" strokeLinecap="round"
          />
          {/* Berries collected in boat */}
          {[-22, -8, 6, 20, -14, 2].map((bx, bi) => (
            <circle key={bi}
              cx={BOAT_CX + bx} cy={BOAT_Y + BOAT_H - 8}
              r={3.5}
              fill={bi % 2 === 0 ? "#c82020" : "#e03030"}
            />
          ))}
        </g>

        {/* ── Earthen dike / right shore bank ── */}
        <path
          d={`M${DIKE_X - 28},${WATER_Y + 12} Q${DIKE_X},${WATER_Y} ${DIKE_X + 28},${WATER_Y + 6} L${W},${WATER_Y + 18} L${W},${H} L${DIKE_X - 38},${H} Z`}
          fill="url(#cb-shore)"
        />
        {/* Dike path / ruts */}
        {[12, 28].map((rx, ri) => (
          <line key={ri}
            x1={DIKE_X + rx} y1={WATER_Y + 20}
            x2={DIKE_X + rx + 8} y2={H}
            stroke="#3a2a12" strokeWidth="2.5" opacity="0.35"
          />
        ))}
        {/* Worker standing on dike right edge */}
        <g style={{ opacity: active ? 1 : 0, transition: tr(0.26) }}>
          <rect x={DIKE_X + 22} y={WATER_Y + 18} width={20} height={44} rx="4" fill="#c83228" />
          <circle cx={DIKE_X + 32} cy={WATER_Y + 8} r={12} fill="#d4a878" />
          <ellipse cx={DIKE_X + 30} cy={WATER_Y - 2} rx={17} ry={5} fill="#2a1a0a" />
          {/* Holding clipboard / manifest */}
          <rect x={DIKE_X + 36} y={WATER_Y + 26} width={18} height={22}
            rx="2" fill="#f0e8d0" stroke="#8a6830" strokeWidth="1.5" />
          <line x1={DIKE_X + 39} y1={WATER_Y + 32} x2={DIKE_X + 51} y2={WATER_Y + 32}
            stroke="#8a8060" strokeWidth="1" />
          <line x1={DIKE_X + 39} y1={WATER_Y + 36} x2={DIKE_X + 51} y2={WATER_Y + 36}
            stroke="#8a8060" strokeWidth="1" />
          <line x1={DIKE_X + 39} y1={WATER_Y + 40} x2={DIKE_X + 48} y2={WATER_Y + 40}
            stroke="#8a8060" strokeWidth="1" />
        </g>

        {/* ── Mist bands rising off water ── */}
        {MIST_BANDS.map((mb, i) => (
          <ellipse key={i}
            cx={W * 0.4 + mistDx(i)} cy={mb.y}
            rx={W * mb.scaleX * 0.55} ry={16 + i * 4}
            fill="#f0d0a0"
            className="cb-mist"
            style={{
              ["--cb-mo" as string]: mb.opacity,
              animationDelay: `${i * 1.4}s`,
              animationDuration: `${10 + i * 2}s`,
              filter: "blur(6px)",
            }}
            opacity={mb.opacity}
          />
        ))}

        {/* ── Foreground shore (near viewer) ── */}
        <path
          d={`M0,${BOG_BOTTOM} Q${W * 0.25},${BOG_BOTTOM - 12} ${W * 0.5},${BOG_BOTTOM - 6} Q${W * 0.75},${BOG_BOTTOM + 4} ${W},${BOG_BOTTOM - 8} L${W},${H} L0,${H} Z`}
          fill="#5a3a20"
        />
        {/* Shore grass clumps (foreground) */}
        {Array.from({ length: 18 }, (_, i) => {
          const gx = 40 + i * 80;
          const gy = BOG_BOTTOM + 2;
          return (
            <g key={i}>
              {[0, 5, 10].map(ox => (
                <line key={ox}
                  x1={gx + ox} y1={gy}
                  x2={gx + ox - 4 + i % 3} y2={gy - 24 - i % 12}
                  stroke="#4a6028" strokeWidth="2.5" strokeLinecap="round"
                />
              ))}
            </g>
          );
        })}

        {/* ── Scene label ── */}
        <g style={{
          opacity: active ? 1 : 0,
          transform: active ? "translateY(0)" : "translateY(-8px)",
          transition: tr(0.08),
        }}>
          <text x={W / 2} y={H - 14} textAnchor="middle"
            fontFamily="'Georgia', serif" fontSize="11" fill="#f0c060"
            letterSpacing="3" opacity="0.62">
            CAPE COD · CRANBERRY HARVEST · OCTOBER DAWN
          </text>
        </g>
      </svg>
    </section>
  );
}
