"use client";
import { useEffect, useRef, useState } from "react";

const W = 1440;
const H = 560;

// ─── Scene geometry ─────────────────────────────────────────────────────────────
const HORIZON_Y  = 298;    // sea / land divide
const SKY_H      = HORIZON_Y;
const SHORE_Y    = HORIZON_Y + 42;    // tops of rocks / coastal bank

// ─── Storm cloud layers ────────────────────────────────────────────────────────
// Boiling dark stratocumulus — several overlapping blob bands
type CloudLayer = { y: number; blobs: [number, number, number][]; shade: string };
const CLOUD_LAYERS: CloudLayer[] = [
  {
    y:     60,
    shade: "#1a1e28",
    blobs: [
      [-40, 0, 88], [80, -22, 96], [210, 8, 80], [340, -18, 92],
      [480, 4, 84], [600, -14, 100], [740, 10, 88], [880, -8, 94],
      [1020, 6, 86], [1160, -16, 90], [1300, 4, 80], [1440, -10, 76],
    ],
  },
  {
    y:     112,
    shade: "#14181f",
    blobs: [
      [0, 0, 72], [120, -16, 88], [260, 12, 76], [400, -8, 90],
      [540, 6, 80], [680, -20, 92], [820, 8, 78], [960, -12, 86],
      [1100, 10, 74], [1240, -6, 84], [1380, 14, 70],
    ],
  },
  {
    y:     158,
    shade: "#1e2430",
    blobs: [
      [20, 0, 64], [160, -10, 76], [300, 14, 68], [440, -6, 80],
      [580, 10, 72], [720, -14, 84], [860, 6, 70], [1000, -8, 78],
      [1140, 12, 66], [1280, -4, 74], [1420, 8, 62],
    ],
  },
];

// ─── Rain streaks (deterministic, diagonal) ────────────────────────────────────
type RainStreak = { x: number; y: number; len: number; speed: number; delay: number };
const RAIN: RainStreak[] = Array.from({ length: 220 }, (_, i) => {
  const ang = i * 137.508 * Math.PI / 180;
  const rr  = Math.sqrt(i / 220);
  return {
    x:     ((W * 0.5 + Math.cos(ang) * rr * W) % W + W) % W,
    y:     ((H * 0.3 + Math.sin(ang) * H) % H + H) % H,
    len:   28 + (i % 6) * 8,
    speed: 14 + (i % 5) * 4,
    delay: (i * 0.22) % 2.4,
  };
});

// ─── Waves (whitecaps on heavy sea) ───────────────────────────────────────────
type Wave = { phase: number; yBase: number; amplitude: number; period: number };
const WAVES: Wave[] = Array.from({ length: 12 }, (_, i) => ({
  phase:     (i * 137.508 * Math.PI / 180) % (Math.PI * 2),
  yBase:     HORIZON_Y + 8 + i * 16,
  amplitude: 12 - i * 0.7,
  period:    0.6 + i * 0.12,
}));

// ─── Granite rocks on shore ───────────────────────────────────────────────────
type Rock = { x: number; y: number; w: number; h: number; shade: string };
const ROCKS: Rock[] = [
  { x: 28,   y: SHORE_Y,      w: 88,  h: 52,  shade: "#4a4e58" },
  { x: 88,   y: SHORE_Y + 14, w: 64,  h: 38,  shade: "#3a3e48" },
  { x: 150,  y: SHORE_Y + 6,  w: 96,  h: 58,  shade: "#525660" },
  { x: 228,  y: SHORE_Y + 20, w: 52,  h: 34,  shade: "#44484e" },
  { x: W - 220, y: SHORE_Y + 4,  w: 92,  h: 54,  shade: "#4a4e58" },
  { x: W - 148, y: SHORE_Y + 18, w: 68,  h: 40,  shade: "#3a3e48" },
  { x: W - 82,  y: SHORE_Y + 8,  w: 80,  h: 48,  shade: "#525660" },
  { x: 380,  y: SHORE_Y + 28, w: 44,  h: 28,  shade: "#3a3e48" },
];

// ─── Spray bursts on rocks ────────────────────────────────────────────────────
type SprayBurst = { x: number; y: number; phase: number };
const SPRAY_BURSTS: SprayBurst[] = [
  { x: 80,       y: SHORE_Y,      phase: 0    },
  { x: 195,      y: SHORE_Y + 4,  phase: 1.2  },
  { x: W - 170,  y: SHORE_Y + 6,  phase: 0.7  },
  { x: W - 80,   y: SHORE_Y + 10, phase: 1.9  },
];

// ─── Bent trees (coastal evergreens, wind-trained) ────────────────────────────
type BentTree = { x: number; baseY: number; h: number; bendX: number; branches: [number, number, number][] };
function makeBentTree(x: number, baseY: number, h: number, bend: number): BentTree {
  return {
    x, baseY, h, bendX: bend,
    branches: Array.from({ length: 6 }, (_, i) => {
      const frac = 0.4 + i * 0.1;
      const bx = x + bend * frac;
      const by = baseY - h * frac;
      // All branches swept right (wind direction)
      return [bx, by, 28 + i * 6] as [number, number, number];
    }),
  };
}

const BENT_TREES: BentTree[] = [
  makeBentTree(320,  H - 28, 148, 88),
  makeBentTree(390,  H - 18, 168, 96),
  makeBentTree(W - 310, H - 24, 154, -82),
  makeBentTree(W - 368, H - 14, 178, -90),
  makeBentTree(W - 440, H - 30, 138, -72),
];

// ─── Coastal farmhouse (shuttered, one warm window) ───────────────────────────
const HOUSE_X = W * 0.5 - 60;
const HOUSE_Y = HORIZON_Y - 88;
const HOUSE_W = 124;
const HOUSE_H = 82;

// ─── Lightning bolt path ──────────────────────────────────────────────────────
// Jagged path from cloud to near-ground
const LIGHTNING_D = `
  M${W * 0.38},${80}
  L${W * 0.42},${148}
  L${W * 0.36},${196}
  L${W * 0.41},${244}
  L${W * 0.35},${292}
`;

// ─── Debris flying in wind (leaves, small items) ──────────────────────────────
type Debris = { cx: number; cy: number; size: number; rotSpeed: number; driftX: number };
const DEBRIS: Debris[] = Array.from({ length: 28 }, (_, i) => {
  const ang = i * 137.508 * Math.PI / 180;
  const rr  = Math.sqrt(i / 28) * 0.7;
  return {
    cx:       ((W * 0.55 + Math.cos(ang) * rr * W) % W + W) % W,
    cy:       HORIZON_Y - 40 - ((i * 18) % (HORIZON_Y - 60)),
    size:     4 + (i % 4) * 3,
    rotSpeed: 0.8 + (i % 5) * 0.4,
    driftX:   12 + (i % 6) * 8,
  };
});

export function NorEaster() {
  const ref = useRef<SVGSVGElement>(null);
  const [active, setActive]     = useState(false);
  const [phase, setPhase]       = useState(0);
  const [lightning, setLightning] = useState(false);

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
    let nextLightningAt = 4.0;
    const tick = setInterval(() => {
      t += 0.016;
      setPhase(t);

      // Trigger lightning flash at irregular intervals
      if (t >= nextLightningAt) {
        setLightning(true);
        setTimeout(() => setLightning(false), 120);
        // Next strike: 3.5–7 seconds from now (deterministic)
        nextLightningAt = t + 3.5 + ((Math.floor(t * 10) % 7) * 0.5);
      }
    }, 16);
    return () => clearInterval(tick);
  }, [active]);

  const tr = (d: number) =>
    active ? `opacity 0.6s ease ${d}s, transform 0.6s ease ${d}s` : "none";

  // Wave paths (built fresh each frame)
  const wavePaths = WAVES.map(wv => {
    const pts: [number, number][] = [];
    const STEPS = 48;
    for (let i = 0; i <= STEPS; i++) {
      const x = (i / STEPS) * W;
      const y = wv.yBase
        + Math.sin(i / STEPS * Math.PI * 6 + phase * wv.period + wv.phase) * wv.amplitude
        + Math.sin(i / STEPS * Math.PI * 9 + phase * wv.period * 1.6) * wv.amplitude * 0.4;
      pts.push([x, y]);
    }
    const d = pts.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
    return `${d} L${W},${H} L0,${H} Z`;
  });

  // Spray burst scale
  const sprayScale = (sb: SprayBurst) => {
    const t2 = (phase * 1.2 + sb.phase) % (Math.PI * 2);
    return Math.max(0, Math.sin(t2 * 0.5));
  };

  // Rain position (scrolling at angle)
  const rainOffset = (phase * 280) % H;

  // Debris drift
  const debrisPositions = DEBRIS.map(db => ({
    x:   ((db.cx - db.driftX * phase * 0.8) % W + W) % W,
    y:   db.cy + Math.sin(phase * db.rotSpeed) * 12,
    rot: phase * db.rotSpeed * 40,
  }));

  // Tree sway (wind gusts)
  const treeSway = Math.sin(phase * 0.9) * 4 + Math.sin(phase * 2.3) * 2;

  // Whitecap flicker
  const whitecapOpacity = 0.7 + Math.sin(phase * 3.2) * 0.2;

  return (
    <section style={{ background: "#070810", overflow: "hidden", position: "relative" }}>
      <style>{`
        @keyframes ne-rain-fall {
          from { transform: translateY(0) translateX(0); }
          to   { transform: translateY(${H}px) translateX(-${H * 0.55}px); }
        }
        @keyframes ne-window-flicker {
          0%,100% { opacity: 0.85; }
          20%     { opacity: 0.6; }
          45%     { opacity: 0.9; }
          72%     { opacity: 0.5; }
        }
        @keyframes ne-lightning-afterglow {
          from { opacity: 0.4; }
          to   { opacity: 0; }
        }
        .ne-window { animation: ne-window-flicker 6s ease-in-out infinite; }
      `}</style>

      <svg
        ref={ref}
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="xMidYMid slice"
        style={{ display: "block", width: "100%", height: "auto", minHeight: 320 }}
        aria-label="Nor'easter storm on the New England coast — dark rolling clouds, horizontal rain, crashing waves on granite rocks, bent trees, farmhouse with warm light in window"
        role="img"
      >
        <defs>
          {/* Dark storm sky */}
          <linearGradient id="ne-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#050608" />
            <stop offset="40%"  stopColor="#0c0e14" />
            <stop offset="80%"  stopColor="#141820" />
            <stop offset="100%" stopColor="#1c2230" />
          </linearGradient>
          {/* Lightning sky flash */}
          <linearGradient id="ne-flash" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#d8e8ff" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#8ab0e0" stopOpacity="0.1" />
          </linearGradient>
          {/* Sea */}
          <linearGradient id="ne-sea" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#1a2438" />
            <stop offset="40%"  stopColor="#0e1828" />
            <stop offset="100%" stopColor="#080e18" />
          </linearGradient>
          {/* Shore / ground */}
          <linearGradient id="ne-shore" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#3a3e48" />
            <stop offset="100%" stopColor="#2a2e38" />
          </linearGradient>
          {/* Window glow */}
          <radialGradient id="ne-window-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="#f8c040" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#e07010" stopOpacity="0"   />
          </radialGradient>
          {/* Spray burst */}
          <radialGradient id="ne-spray" cx="50%" cy="80%" r="50%">
            <stop offset="0%"   stopColor="white" stopOpacity="0.8" />
            <stop offset="100%" stopColor="white" stopOpacity="0"   />
          </radialGradient>
          <filter id="ne-blur-sm">
            <feGaussianBlur stdDeviation="3" />
          </filter>
          <filter id="ne-blur-md">
            <feGaussianBlur stdDeviation="8" />
          </filter>
          <clipPath id="ne-sky-clip">
            <rect x="0" y="0" width={W} height={SKY_H + 10} />
          </clipPath>
          <clipPath id="ne-sea-clip">
            <rect x="0" y={HORIZON_Y} width={W} height={H - HORIZON_Y} />
          </clipPath>
        </defs>

        {/* ── Storm sky background ── */}
        <rect x="0" y="0" width={W} height={H} fill="url(#ne-sky)" />

        {/* ── Lightning flash (full-sky illuminate) ── */}
        {lightning && (
          <rect x="0" y="0" width={W} height={H}
            fill="url(#ne-flash)"
            style={{ pointerEvents: "none" }}
          />
        )}

        {/* ── Storm clouds (layered boiling masses) ── */}
        {CLOUD_LAYERS.map((cl, li) => (
          <g key={li} style={{
            opacity: active ? 1 : 0,
            transform: active
              ? `translateX(${Math.sin(phase * 0.15 + li * 0.7) * 12}px)`
              : "translateX(-20px)",
            transition: active ? "none" : tr(0.06 + li * 0.03),
          }}
            clipPath="url(#ne-sky-clip)">
            {cl.blobs.map(([dx, dy, r], bi) => (
              <ellipse key={bi}
                cx={dx} cy={cl.y + dy}
                rx={r} ry={r * 0.52}
                fill={cl.shade}
              />
            ))}
          </g>
        ))}

        {/* ── Lightning bolt ── */}
        {lightning && (
          <g>
            {/* Wide glow behind bolt */}
            <path d={LIGHTNING_D}
              fill="none" stroke="#c8d8ff"
              strokeWidth="22" strokeLinecap="round"
              opacity="0.3"
              filter="url(#ne-blur-md)"
            />
            {/* Main bolt */}
            <path d={LIGHTNING_D}
              fill="none" stroke="white"
              strokeWidth="3.5" strokeLinecap="round"
            />
            {/* Inner core */}
            <path d={LIGHTNING_D}
              fill="none" stroke="#e8f0ff"
              strokeWidth="1.5" strokeLinecap="round"
              opacity="0.9"
            />
          </g>
        )}

        {/* ── Rain (diagonal streaks scrolling) ── */}
        <g style={{
          transform: `translateY(${-rainOffset}px) translateX(${rainOffset * 0.55}px)`,
          transition: "none",
          opacity: active ? 0.38 : 0,
        }}>
          {/* Two passes to tile vertically */}
          {[0, H].map(yOff => (
            <g key={yOff} style={{ transform: `translateY(${yOff}px)` }}>
              {RAIN.map((r, i) => (
                <line key={i}
                  x1={r.x} y1={r.y}
                  x2={r.x - r.len * 0.48} y2={r.y + r.len}
                  stroke="#8ab0d0"
                  strokeWidth={0.8 + (i % 3) * 0.4}
                  opacity={0.55 + (i % 4) * 0.1}
                />
              ))}
            </g>
          ))}
        </g>

        {/* ── Sea body ── */}
        <rect x="0" y={HORIZON_Y} width={W} height={H - HORIZON_Y}
          fill="url(#ne-sea)" />

        {/* ── Animated waves with whitecaps ── */}
        {WAVES.map((wv, i) => {
          const depth = i / WAVES.length;
          return (
            <g key={i} clipPath="url(#ne-sea-clip)">
              <path d={wavePaths[i] ?? ""}
                fill={`rgba(${14 + depth * 20}, ${24 + depth * 30}, ${40 + depth * 45}, 0.85)`}
                style={{ transition: "none" }}
              />
              {/* Whitecap foam on wave crest */}
              {i < 6 && (
                <path
                  d={wavePaths[i]?.split(" L")[0] ?? ""}
                  fill="none"
                  stroke="white"
                  strokeWidth={2.5 - i * 0.2}
                  opacity={whitecapOpacity * (1 - depth * 0.5)}
                  style={{ transition: "none" }}
                />
              )}
            </g>
          );
        })}

        {/* ── Spray bursts on rocks ── */}
        {SPRAY_BURSTS.map((sb, i) => {
          const sc = sprayScale(sb);
          return (
            <g key={i} style={{ opacity: active ? 1 : 0, transition: "none" }}>
              <ellipse cx={sb.x} cy={sb.y}
                rx={38 * sc} ry={52 * sc}
                fill="url(#ne-spray)"
                opacity={sc * 0.65}
              />
              {/* Individual spray droplets */}
              {Array.from({ length: 8 }, (_, di) => {
                const a2  = -Math.PI / 2 + (di - 4) * 0.22;
                const dr2 = sc * (32 + di * 6);
                return (
                  <circle key={di}
                    cx={sb.x + Math.cos(a2) * dr2}
                    cy={sb.y + Math.sin(a2) * dr2}
                    r={2.5 + (di % 3)}
                    fill="white"
                    opacity={sc * 0.55}
                  />
                );
              })}
            </g>
          );
        })}

        {/* ── Ground / shore ── */}
        <path
          d={`M0,${SHORE_Y + 18} Q${W * 0.25},${SHORE_Y + 8} ${W * 0.5},${SHORE_Y + 22} Q${W * 0.75},${SHORE_Y + 14} ${W},${SHORE_Y + 10} L${W},${H} L0,${H} Z`}
          fill="url(#ne-shore)"
        />

        {/* ── Granite rocks ── */}
        {ROCKS.map((rk, i) => (
          <g key={i} style={{ opacity: active ? 1 : 0, transition: tr(0.1 + i * 0.02) }}>
            <ellipse cx={rk.x + rk.w / 2} cy={rk.y + rk.h - 4}
              rx={rk.w * 0.55} ry={8}
              fill="#1a1e28" opacity="0.5" filter="url(#ne-blur-sm)"
            />
            <path
              d={`M${rk.x},${rk.y + rk.h} Q${rk.x + rk.w * 0.2},${rk.y} ${rk.x + rk.w * 0.5},${rk.y - 4} Q${rk.x + rk.w * 0.8},${rk.y} ${rk.x + rk.w},${rk.y + rk.h} Z`}
              fill={rk.shade}
            />
            {/* Rock surface cracks */}
            <path
              d={`M${rk.x + rk.w * 0.3},${rk.y + rk.h * 0.3} Q${rk.x + rk.w * 0.5},${rk.y + rk.h * 0.6} ${rk.x + rk.w * 0.6},${rk.y + rk.h * 0.8}`}
              fill="none" stroke="#2a2e38" strokeWidth="1.5" opacity="0.4"
            />
            {/* Wet sheen */}
            <path
              d={`M${rk.x + rk.w * 0.2},${rk.y + rk.h * 0.2} Q${rk.x + rk.w * 0.4},${rk.y + rk.h * 0.1} ${rk.x + rk.w * 0.6},${rk.y + rk.h * 0.25}`}
              fill="none" stroke="#5a7090" strokeWidth="2.5" opacity="0.3"
            />
          </g>
        ))}

        {/* ── Bent trees (wind-trained coastal evergreens) ── */}
        {BENT_TREES.map((bt, i) => {
          const sway = treeSway * (i % 2 === 0 ? 1 : -0.7);
          return (
            <g key={i}
              style={{
                transform: `rotate(${sway}deg)`,
                transformOrigin: `${bt.x}px ${bt.baseY}px`,
                opacity: active ? 1 : 0,
                transition: active ? "none" : tr(0.12 + i * 0.03),
              }}>
              {/* Main trunk (bent toward prevailing wind) */}
              <path
                d={`M${bt.x},${bt.baseY} Q${bt.x + bt.bendX * 0.5},${bt.baseY - bt.h * 0.5} ${bt.x + bt.bendX},${bt.baseY - bt.h}`}
                fill="none" stroke="#2a1a0a" strokeWidth="7" strokeLinecap="round"
              />
              {/* Branches (swept in wind direction) */}
              {bt.branches.map(([bx, by, len], bi) => (
                <g key={bi}>
                  <line
                    x1={bx} y1={by}
                    x2={bx + len * (bt.bendX > 0 ? 1 : -1)} y2={by - 8}
                    stroke="#2a2a1a" strokeWidth={4 - bi * 0.5} strokeLinecap="round"
                  />
                  {/* Needles (sparse, wind-stripped) */}
                  {Array.from({ length: 4 }, (_, ni) => {
                    const nx = bx + len * (bt.bendX > 0 ? 1 : -1) * (ni / 4);
                    const ny = by - 8 + ni * 2;
                    return (
                      <line key={ni}
                        x1={nx} y1={ny}
                        x2={nx + (bt.bendX > 0 ? 8 : -8)} y2={ny - 5}
                        stroke="#1a2818" strokeWidth="1.8" strokeLinecap="round"
                        opacity="0.8"
                      />
                    );
                  })}
                </g>
              ))}
            </g>
          );
        })}

        {/* ── Coastal farmhouse (shuttered, glowing window) ── */}
        <g style={{ opacity: active ? 1 : 0, transition: tr(0.14) }}>
          {/* House body */}
          <rect x={HOUSE_X} y={HOUSE_Y} width={HOUSE_W} height={HOUSE_H}
            fill="#2a2e38" stroke="#1a1e28" strokeWidth="2" />
          {/* Gabled roof */}
          <polygon
            points={`${HOUSE_X - 8},${HOUSE_Y} ${HOUSE_X + HOUSE_W / 2},${HOUSE_Y - 42} ${HOUSE_X + HOUSE_W + 8},${HOUSE_Y}`}
            fill="#1e222c"
          />
          {/* Clapboard lines */}
          {Array.from({ length: 7 }, (_, i) => (
            <line key={i}
              x1={HOUSE_X} y1={HOUSE_Y + 10 + i * 10}
              x2={HOUSE_X + HOUSE_W} y2={HOUSE_Y + 10 + i * 10}
              stroke="#1a1e28" strokeWidth="1" opacity="0.4"
            />
          ))}
          {/* Front door (shuttered) */}
          <rect x={HOUSE_X + HOUSE_W * 0.42} y={HOUSE_Y + HOUSE_H - 44}
            width={24} height={44}
            fill="#1a1e28" />
          {/* Windows (shuttered — dark except one) */}
          {[HOUSE_X + 14, HOUSE_X + HOUSE_W - 42].map((wx, wi) => (
            <g key={wi}>
              <rect x={wx} y={HOUSE_Y + 18} width={28} height={28}
                rx="1" fill={wi === 0 ? "#f8c040" : "#1a1e28"}
              />
              {wi === 0 ? (
                // Warm glowing window
                <>
                  <rect x={wx} y={HOUSE_Y + 18} width={28} height={28}
                    rx="1" fill="url(#ne-window-glow)" className="ne-window"
                  />
                  {/* Wide warm glow on wall/ground */}
                  <ellipse cx={wx + 14} cy={HOUSE_Y + 58}
                    rx={50} ry={28}
                    fill="#f8c040" opacity="0.12"
                    filter="url(#ne-blur-md)"
                  />
                  {/* Window pane cross */}
                  <line x1={wx + 14} y1={HOUSE_Y + 18} x2={wx + 14} y2={HOUSE_Y + 46}
                    stroke="#c89030" strokeWidth="1.5" opacity="0.6" />
                  <line x1={wx} y1={HOUSE_Y + 32} x2={wx + 28} y2={HOUSE_Y + 32}
                    stroke="#c89030" strokeWidth="1.5" opacity="0.6" />
                </>
              ) : (
                // Shuttered — board planks
                <>
                  <rect x={wx} y={HOUSE_Y + 18} width={12} height={28}
                    fill="#252930" stroke="#1a1e24" strokeWidth="1" />
                  <rect x={wx + 16} y={HOUSE_Y + 18} width={12} height={28}
                    fill="#252930" stroke="#1a1e24" strokeWidth="1" />
                </>
              )}
            </g>
          ))}
          {/* Chimney */}
          <rect x={HOUSE_X + HOUSE_W * 0.62} y={HOUSE_Y - 68}
            width={18} height={72}
            fill="#1e2228"
          />
          {/* Chimney cap */}
          <rect x={HOUSE_X + HOUSE_W * 0.62 - 4} y={HOUSE_Y - 70}
            width={26} height={6}
            fill="#2a2e38"
          />
        </g>

        {/* ── Flying debris (leaves, shingles) ── */}
        {debrisPositions.map((db, i) => (
          <g key={i} style={{
            transform: `translate(${db.x}px, ${db.y}px) rotate(${db.rot}deg)`,
            opacity: active ? 0.55 : 0,
            transition: active ? "none" : tr(0.16),
          }}>
            <ellipse cx="0" cy="0"
              rx={DEBRIS[i]?.size ?? 6} ry={(DEBRIS[i]?.size ?? 6) * 0.45}
              fill={i % 3 === 0 ? "#4a5828" : i % 3 === 1 ? "#3a2818" : "#2a3428"}
            />
          </g>
        ))}

        {/* ── Horizontal rain streaks (foreground, heavier) ── */}
        <g style={{
          transform: `translateX(${(phase * 120) % (W + 200) - 200}px)`,
          transition: "none",
          opacity: active ? 0.22 : 0,
        }}>
          {Array.from({ length: 24 }, (_, i) => (
            <line key={i}
              x1={i * 68} y1={80 + i * 18}
              x2={i * 68 + 120} y2={80 + i * 18}
              stroke="white" strokeWidth="1.2" opacity={0.3 + (i % 3) * 0.1}
            />
          ))}
        </g>

        {/* ── Moody scene label ── */}
        <g style={{
          opacity: active ? 1 : 0,
          transform: active ? "translateY(0)" : "translateY(-8px)",
          transition: tr(0.08),
        }}>
          <text x={W / 2} y={H - 14} textAnchor="middle"
            fontFamily="'Georgia', serif" fontSize="11" fill="#7090b0"
            letterSpacing="3" opacity="0.5">
            NEW ENGLAND COAST · NOR'EASTER · OCTOBER GALE
          </text>
        </g>
      </svg>
    </section>
  );
}
