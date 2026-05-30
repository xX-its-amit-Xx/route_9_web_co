"use client";
import { useEffect, useRef, useState } from "react";

const W = 1440;
const H = 580;

// ─── Hill geometry ─────────────────────────────────────────────────────────────
const HILL_TOP_X = 180;
const HILL_TOP_Y = 62;
const HILL_BTM_X = W - 80;
const HILL_BTM_Y = H - 88;

const SLOPE_DX  = HILL_BTM_X - HILL_TOP_X;
const SLOPE_DY  = HILL_BTM_Y - HILL_TOP_Y;
const SLOPE_LEN = Math.sqrt(SLOPE_DX * SLOPE_DX + SLOPE_DY * SLOPE_DY);
const SLOPE_UX  = SLOPE_DX / SLOPE_LEN;
const SLOPE_UY  = SLOPE_DY / SLOPE_LEN;
const NORM_X    = -SLOPE_UY;
const NORM_Y    =  SLOPE_UX;
const SLOPE_DEG = Math.atan2(SLOPE_DY, SLOPE_DX) * 180 / Math.PI;
const SURF_OFF  = 20;    // px above the slope line = snow surface

// Helper: point on snow surface at slope fraction t
function surfPt(t: number, perpOff = SURF_OFF): [number, number] {
  return [
    HILL_TOP_X + SLOPE_DX * t + NORM_X * perpOff,
    HILL_TOP_Y + SLOPE_DY * t + NORM_Y * perpOff,
  ];
}

// ─── Sled dimensions (local coords — drawn at origin, rotated into place) ─────
const SLED_W = 66;
const SLED_H = 12;

// ─── Lanterns along slope ─────────────────────────────────────────────────────
const LANTERN_TS = [0.14, 0.32, 0.52, 0.70, 0.86];

// ─── Birch trees ──────────────────────────────────────────────────────────────
type BirchTree = {
  x: number; y: number; h: number; w: number; lean: number;
  branches: [number, number, number, number][];
};

function makeBirch(x: number, y: number, h: number, lean: number): BirchTree {
  const branches: [number, number, number, number][] = [];
  for (let i = 0; i < 5; i++) {
    const frac = 0.38 + i * 0.12;
    const bx = x + lean * frac;
    const by = y - h * frac;
    const side = i % 2 === 0 ? 1 : -1;
    branches.push([bx, by, side * (20 + i * 5), -(10 + i * 4)]);
  }
  return { x, y, h, w: 6 + h / 70, lean, branches };
}

const BIRCHES_L: BirchTree[] = [
  makeBirch(46,  H - 38, 256, -7),
  makeBirch(108, H - 55, 224, -4),
  makeBirch(18,  H - 26, 205, -12),
  makeBirch(158, H - 72, 188,  3),
];
const BIRCHES_R: BirchTree[] = [
  makeBirch(W - 50,  H - 36, 244, 10),
  makeBirch(W - 110, H - 58, 215,  6),
  makeBirch(W - 24,  H - 26, 198, 14),
  makeBirch(W - 168, H - 70, 180,  4),
];

// ─── Spectators at the base ───────────────────────────────────────────────────
const CROWD_COLORS = ["#c83228","#1a3a6a","#2a6838","#8b2a8b","#c87828","#2a1a0a"];
type Spectator = { x: number; y: number; color: string; h: number };
const SPECTATORS: Spectator[] = Array.from({ length: 30 }, (_, i) => ({
  x:     HILL_BTM_X - 450 + (i % 15) * 44,
  y:     HILL_BTM_Y + 20 + Math.floor(i / 15) * 24,
  color: CROWD_COLORS[i % CROWD_COLORS.length] ?? "#c83228",
  h:     36 + i % 12,
}));

// ─── Snowflakes ───────────────────────────────────────────────────────────────
type Flake = { cx: number; cy: number; r: number; speed: number; drift: number };
const FLAKES: Flake[] = Array.from({ length: 88 }, (_, i) => {
  const ang = i * 137.508 * Math.PI / 180;
  const rr  = Math.sqrt(i / 88);
  return {
    cx:    ((W * 0.5 + Math.cos(ang) * rr * W) % W + W) % W,
    cy:    ((H * 0.4 + Math.sin(ang) * H * 0.8) % H + H) % H,
    r:     1.2 + (i % 4) * 0.7,
    speed: 0.8 + (i % 5) * 0.35,
    drift: (i % 7) * 0.16 - 0.55,
  };
});

// ─── Snow spray offsets (static, applied relative to sled pos) ───────────────
type SprayPt = { dt: number; dn: number; opacity: number };
const SPRAY: SprayPt[] = Array.from({ length: 20 }, (_, i) => ({
  dt:      0.005 + (i % 5) * 0.006,
  dn:      (i % 6) * 0.01 - 0.03,
  opacity: 0.25 + (i % 4) * 0.12,
}));

export function TobogganRun() {
  const ref = useRef<SVGSVGElement>(null);
  const [active, setActive]   = useState(false);
  const [sledT, setSledT]     = useState(0);      // 0..1 along slope
  const [snowPh, setSnowPh]   = useState(0);

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
    const PERIOD = 3.0;
    const tick = setInterval(() => {
      t += 0.033;
      const tMod = t % PERIOD;
      const u    = tMod / PERIOD;
      // smoothstep for ease-in acceleration
      setSledT(u * u * (3 - 2 * u));
      setSnowPh(t);
    }, 33);
    return () => clearInterval(tick);
  }, [active]);

  const tr = (d: number) =>
    active ? `opacity 0.75s ease ${d}s, transform 0.75s ease ${d}s` : "none";

  const speed = sledT;     // use as 0..1 speed indicator

  // Sled surface point
  const [sx, sy] = surfPt(sledT);

  // Lantern flicker
  const lanternGlow = 0.6 + Math.sin(snowPh * 2.8) * 0.22 + Math.sin(snowPh * 5.3) * 0.08;

  // Snowflake positions
  const flakePos = FLAKES.map(fl => ({
    cx: ((fl.cx + fl.drift * snowPh * 28) % W + W) % W,
    cy: ((fl.cy + fl.speed * snowPh * 20) % H + H) % H,
    r:  fl.r,
  }));

  // Crowd bob when sled near finish
  const crowdBob = (i: number) =>
    sledT > 0.8 ? Math.sin(snowPh * 5.5 + i * 0.45) * 3.5 : 0;

  // Spray lines behind sled
  const sprayLines = SPRAY.map(sp => {
    const tTail = Math.max(0, sledT - sp.dt);
    const [sx2, sy2] = surfPt(sledT, SURF_OFF + sp.dn * 180);
    const [tx2, ty2] = surfPt(tTail, SURF_OFF + sp.dn * 180);
    return { x1: sx2, y1: sy2, x2: tx2, y2: ty2, opacity: sp.opacity * speed };
  });

  return (
    <section style={{ background: "#060810", overflow: "hidden", position: "relative" }}>
      <style>{`
        @keyframes tr-glint {
          0%,100% { opacity: 0.5; }
          50%     { opacity: 1; }
        }
        @keyframes tr-lantern-sway {
          0%,100% { transform: rotate(-4deg); }
          50%     { transform: rotate(5deg); }
        }
        .tr-glint   { animation: tr-glint 3.2s ease-in-out infinite; }
        .tr-lantern { animation: tr-lantern-sway 2.4s ease-in-out infinite; }
      `}</style>

      <svg
        ref={ref}
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="xMidYMid slice"
        style={{ display: "block", width: "100%", height: "auto", minHeight: 340 }}
        aria-label="Shrewsbury winter toboggan run — sled racing down snow-packed hill by moonlight, cheering spectators, birch trees, lanterns, falling snow"
        role="img"
      >
        <defs>
          <linearGradient id="tr-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#04060e" />
            <stop offset="38%"  stopColor="#0c1224" />
            <stop offset="78%"  stopColor="#182240" />
            <stop offset="100%" stopColor="#263a60" />
          </linearGradient>
          <linearGradient id="tr-snow-upper" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%"   stopColor="#dde8f4" />
            <stop offset="100%" stopColor="#b8cce0" />
          </linearGradient>
          <linearGradient id="tr-snow-lower" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%"   stopColor="#c8d8ea" />
            <stop offset="100%" stopColor="#98b4cc" />
          </linearGradient>
          <linearGradient id="tr-sled" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#d08030" />
            <stop offset="100%" stopColor="#9a5c18" />
          </linearGradient>
          <radialGradient id="tr-moon-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="#e8f0ff" stopOpacity="0.9" />
            <stop offset="55%"  stopColor="#c0d4f0" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#88aad8" stopOpacity="0"    />
          </radialGradient>
          <radialGradient id="tr-lantern-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="#f8c840" stopOpacity="0.88" />
            <stop offset="100%" stopColor="#e07010" stopOpacity="0"    />
          </radialGradient>
          <filter id="tr-glow">
            <feGaussianBlur stdDeviation="10" />
          </filter>
          <filter id="tr-speed-blur">
            <feGaussianBlur stdDeviation={`${speed * 4}`} in="SourceGraphic" />
          </filter>
        </defs>

        {/* ── Night sky ── */}
        <rect x="0" y="0" width={W} height={H} fill="url(#tr-sky)" />

        {/* ── Moon ── */}
        <g style={{ opacity: active ? 1 : 0, transition: tr(0.04) }}>
          <circle cx={W - 138} cy={68} r={44} fill="white"
            filter="url(#tr-glow)" opacity="0.22" />
          <circle cx={W - 138} cy={68} r={33} fill="url(#tr-moon-glow)" />
          <circle cx={W - 138} cy={68} r={31} fill="#e8f0ff" />
          <circle cx={W - 148} cy={62} r={5} fill="#d8e8f2" opacity="0.45" />
          <circle cx={W - 130} cy={74} r={3.5} fill="#d8e8f2" opacity="0.35" />
        </g>

        {/* ── Stars ── */}
        {Array.from({ length: 60 }, (_, i) => {
          const ang = i * 137.508 * Math.PI / 180;
          const rr  = Math.sqrt(i / 60);
          const cx2 = ((W * 0.38 + Math.cos(ang) * rr * W) % W + W) % W;
          const cy2 = ((H * 0.18 + Math.sin(ang) * rr * H * 0.38) % (H * 0.52)) % (H * 0.52);
          return (
            <circle key={i} cx={cx2} cy={cy2} r={0.6 + (i % 3) * 0.5}
              fill="white" opacity={0.12 + (i % 5) * 0.07}
              className={i % 6 === 0 ? "tr-glint" : undefined}
              style={i % 6 === 0 ? { animationDelay: `${i * 0.28}s` } : undefined}
            />
          );
        })}

        {/* ── Snow slope body ── */}
        <g style={{ opacity: active ? 1 : 0, transition: tr(0.05) }}>
          {/* Upper half (lit by moon) */}
          <path d={`M0,${H} L${HILL_TOP_X - 90},${HILL_TOP_Y} L${HILL_BTM_X + 90},${HILL_BTM_Y} L${W},${H} Z`}
            fill="url(#tr-snow-upper)" />
          {/* Shadow on lower-left */}
          <path d={`M0,${H} L${HILL_TOP_X - 90},${HILL_TOP_Y} L${HILL_TOP_X + 180},${HILL_TOP_Y + 220} L0,${H} Z`}
            fill="url(#tr-snow-lower)" opacity="0.6" />
        </g>

        {/* ── Track grooves (two parallel lines) ── */}
        <g style={{ opacity: active ? 0.55 : 0, transition: tr(0.08) }}>
          {[-14, 14].map((off, ti) => {
            const ptsList = Array.from({ length: 30 }, (_, i) => {
              const t2 = i / 29;
              const [px, py] = surfPt(t2);
              // lateral offset along normal
              const perpX = -NORM_Y * off;  // track width is perpendicular to NORM
              const perpY =  NORM_X * off;
              return `${i === 0 ? "M" : "L"}${(px + perpX).toFixed(1)},${(py + perpY).toFixed(1)}`;
            });
            return <path key={ti} d={ptsList.join(" ")} fill="none"
              stroke="#8ab0cc" strokeWidth="2.5" opacity="0.55" />;
          })}
          {/* Glint sparkles on packed ice */}
          {Array.from({ length: 10 }, (_, i) => {
            const [gx, gy] = surfPt(0.08 + i * 0.09);
            return <circle key={i} cx={gx} cy={gy} r={2.5} fill="white"
              className="tr-glint"
              style={{ animationDelay: `${i * 0.25}s` }}
              opacity="0.6" />;
          })}
        </g>

        {/* ── Lantern poles ── */}
        {LANTERN_TS.map((lt, i) => {
          const [lx, ly] = surfPt(lt, SURF_OFF + 52);
          return (
            <g key={i} style={{ opacity: active ? 1 : 0, transition: tr(0.1 + i * 0.03) }}>
              {/* Floor glow */}
              <ellipse cx={lx} cy={ly + 14} rx={38} ry={12}
                fill="#f8c840" opacity={lanternGlow * 0.18}
                style={{ filter: "blur(6px)", transition: "none" }}
              />
              {/* Pole */}
              <line x1={lx} y1={ly + 18} x2={lx} y2={ly - 62}
                stroke="#3a2a18" strokeWidth="4" />
              <g className="tr-lantern"
                style={{ animationDelay: `${i * 0.55}s`,
                         transformOrigin: `${lx}px ${ly - 58}px` }}>
                <line x1={lx} y1={ly - 58} x2={lx + 18} y2={ly - 52}
                  stroke="#3a2a18" strokeWidth="3" />
                <circle cx={lx + 18} cy={ly - 40} r={22}
                  fill="url(#tr-lantern-glow)" opacity={lanternGlow * 0.65}
                  filter="url(#tr-glow)"
                  style={{ transition: "none" }}
                />
                <rect x={lx + 9} y={ly - 52} width={18} height={24}
                  rx="3" fill="#2a1a08" stroke="#4a3010" strokeWidth="1.5" />
                <rect x={lx + 11} y={ly - 50} width={14} height={20}
                  rx="2" fill="#f8c840" opacity={lanternGlow * 0.82}
                  style={{ transition: "none" }}
                />
                <polygon
                  points={`${lx + 7},${ly - 52} ${lx + 29},${ly - 52} ${lx + 18},${ly - 64}`}
                  fill="#2a1a08"
                />
              </g>
            </g>
          );
        })}

        {/* ── Birch trees (left) ── */}
        {BIRCHES_L.map((bt, i) => (
          <g key={i} style={{ opacity: active ? 1 : 0, transition: tr(0.07 + i * 0.03) }}>
            <line x1={bt.x} y1={bt.y} x2={bt.x + bt.lean * 0.5} y2={bt.y - bt.h}
              stroke="white" strokeWidth={bt.w} />
            {Array.from({ length: 7 }, (_, mi) => {
              const mt = 0.1 + mi * 0.12;
              const mx = bt.x + bt.lean * mt;
              const my = bt.y - bt.h * mt;
              return <line key={mi} x1={mx - bt.w * 0.7} y1={my}
                x2={mx + bt.w * 0.7} y2={my}
                stroke="#1e2c3c" strokeWidth="1.5" opacity="0.5" />;
            })}
            {bt.branches.map(([bx, by, dx, dy], bi) => (
              <g key={bi}>
                <line x1={bx} y1={by} x2={bx + dx} y2={by + dy}
                  stroke="white" strokeWidth={bt.w * 0.35} strokeLinecap="round" />
                <line x1={bx + dx * 0.3} y1={by + dy * 0.3 - 4}
                  x2={bx + dx * 0.9} y2={by + dy * 0.9 - 4}
                  stroke="#e4eef6" strokeWidth="3.5" strokeLinecap="round" opacity="0.6" />
              </g>
            ))}
            <ellipse cx={bt.x + bt.lean * 0.5} cy={bt.y - bt.h}
              rx={bt.w * 2.2} ry={bt.w}
              fill="white" opacity="0.8" />
          </g>
        ))}

        {/* ── Birch trees (right) ── */}
        {BIRCHES_R.map((bt, i) => (
          <g key={i} style={{ opacity: active ? 1 : 0, transition: tr(0.07 + i * 0.03) }}>
            <line x1={bt.x} y1={bt.y} x2={bt.x + bt.lean * 0.5} y2={bt.y - bt.h}
              stroke="white" strokeWidth={bt.w} />
            {Array.from({ length: 7 }, (_, mi) => {
              const mt = 0.1 + mi * 0.12;
              const mx = bt.x + bt.lean * mt;
              const my = bt.y - bt.h * mt;
              return <line key={mi} x1={mx - bt.w * 0.7} y1={my}
                x2={mx + bt.w * 0.7} y2={my}
                stroke="#1e2c3c" strokeWidth="1.5" opacity="0.5" />;
            })}
            {bt.branches.map(([bx, by, dx, dy], bi) => (
              <g key={bi}>
                <line x1={bx} y1={by} x2={bx + dx} y2={by + dy}
                  stroke="white" strokeWidth={bt.w * 0.35} strokeLinecap="round" />
                <line x1={bx + dx * 0.3} y1={by + dy * 0.3 - 4}
                  x2={bx + dx * 0.9} y2={by + dy * 0.9 - 4}
                  stroke="#e4eef6" strokeWidth="3.5" strokeLinecap="round" opacity="0.6" />
              </g>
            ))}
            <ellipse cx={bt.x + bt.lean * 0.5} cy={bt.y - bt.h}
              rx={bt.w * 2.2} ry={bt.w}
              fill="white" opacity="0.8" />
          </g>
        ))}

        {/* ── Snow spray behind sled ── */}
        {sprayLines.map((sp, i) => (
          <line key={i}
            x1={sp.x1} y1={sp.y1} x2={sp.x2} y2={sp.y2}
            stroke="white" strokeWidth="1.8"
            opacity={sp.opacity}
            style={{ transition: "none" }}
          />
        ))}

        {/* ── Toboggan sled (rendered at sled position, rotated to slope angle) ── */}
        <g
          transform={`translate(${sx}, ${sy}) rotate(${SLOPE_DEG})`}
          style={{
            opacity: active ? 1 : 0,
            transition: active ? "none" : tr(0.14),
          }}
        >
          {/* Speed ghost (blur effect as extra translucent sled behind) */}
          {speed > 0.3 && (
            <g opacity={speed * 0.3}>
              <rect x={-SLED_W / 2 - 8} y={-SLED_H - 2} width={SLED_W + 14} height={SLED_H + 4}
                rx="4" fill="#d08030" />
            </g>
          )}
          {/* Sled board */}
          <rect x={-SLED_W / 2} y={-SLED_H} width={SLED_W} height={SLED_H}
            rx="4" fill="url(#tr-sled)" />
          {/* Runners */}
          {([-7, 7] as number[]).map((ry, ri) => (
            <line key={ri}
              x1={-SLED_W / 2 - 4} y1={ry * 0.35}
              x2={ SLED_W / 2 + 4} y2={ry * 0.35}
              stroke="#2a2a2a" strokeWidth="3" strokeLinecap="round"
            />
          ))}
          {/* Riders — 3 people stacked */}
          {([-20, 0, 20] as number[]).map((rx, ri) => (
            <g key={ri}>
              <ellipse cx={rx} cy={-SLED_H - 16} rx={9} ry={14}
                fill={["#c83228","#1a3a6a","#2a6838"][ri] ?? "#c83228"} />
              <circle cx={rx + 4} cy={-SLED_H - 32} r={9} fill="#d4a878" />
              {/* Hat */}
              <ellipse cx={rx + 4} cy={-SLED_H - 40} rx={12} ry={4.5}
                fill={["#2a1a0a","#8a2020","#1a3a6a"][ri] ?? "#2a1a0a"} />
              <rect x={rx - 4} y={-SLED_H - 52} width={16} height={13}
                rx="3" fill={["#2a1a0a","#8a2020","#1a3a6a"][ri] ?? "#2a1a0a"} />
              {/* Scarf streaming backward (speed) */}
              <path
                d={`M${rx + 4},${-SLED_H - 36} Q${rx - 6},${-SLED_H - 28} ${rx - 18 - speed * 16},${-SLED_H - 22}`}
                fill="none"
                stroke={["#f0e040","#f8c060","#c0e040"][ri] ?? "#f0e040"}
                strokeWidth="4" strokeLinecap="round"
                opacity={0.5 + speed * 0.45}
                style={{ transition: "none" }}
              />
            </g>
          ))}
        </g>

        {/* ── Spectators (crowd at base of hill) ── */}
        {SPECTATORS.map((sp, i) => (
          <g key={i} style={{
            opacity: active ? 0.9 : 0,
            transform: `translateY(${crowdBob(i)}px)`,
            transition: active ? "none" : tr(0.2 + i * 0.01),
          }}>
            <ellipse cx={sp.x} cy={sp.y - sp.h * 0.38} rx={10} ry={sp.h * 0.52}
              fill={sp.color} />
            <circle cx={sp.x} cy={sp.y - sp.h - 8} r={9} fill="#d4a878" />
            <ellipse cx={sp.x} cy={sp.y - sp.h - 16} rx={10} ry={4} fill={sp.color} />
            <rect x={sp.x - 7} y={sp.y - sp.h - 27} width={14} height={12}
              rx="2" fill={sp.color} />
            <circle cx={sp.x} cy={sp.y - sp.h - 29} r={3.5} fill="white" opacity="0.8" />
            {/* Raised arms when sled near */}
            {sledT > 0.75 && (
              <>
                <path d={`M${sp.x - 8},${sp.y - sp.h} Q${sp.x - 18},${sp.y - sp.h - 14} ${sp.x - 14},${sp.y - sp.h - 22}`}
                  fill="none" stroke={sp.color} strokeWidth="7" strokeLinecap="round" />
                <path d={`M${sp.x + 8},${sp.y - sp.h} Q${sp.x + 18},${sp.y - sp.h - 14} ${sp.x + 14},${sp.y - sp.h - 22}`}
                  fill="none" stroke={sp.color} strokeWidth="7" strokeLinecap="round" />
              </>
            )}
          </g>
        ))}

        {/* ── Falling snowflakes ── */}
        {flakePos.map((fl, i) => (
          <circle key={i}
            cx={fl.cx} cy={fl.cy} r={fl.r}
            fill="white" opacity={0.5 + (i % 3) * 0.14}
            style={{ transition: "none" }}
          />
        ))}

        {/* ── Foreground snow bank ── */}
        <path
          d={`M0,${H} L0,${H - 40} Q${W * 0.25},${H - 56} ${W * 0.5},${H - 46} Q${W * 0.75},${H - 58} ${W},${H - 42} L${W},${H} Z`}
          fill="white" opacity="0.88"
        />
        {Array.from({ length: 14 }, (_, i) => (
          <circle key={i}
            cx={60 + i * 102} cy={H - 44 + (i % 3) * 6} r={2.5}
            fill="white" className="tr-glint"
            style={{ animationDelay: `${i * 0.22}s` }}
          />
        ))}

        {/* ── Sign at top of hill ── */}
        <g style={{ opacity: active ? 1 : 0, transition: tr(0.12) }}>
          <rect x={HILL_TOP_X + 22} y={HILL_TOP_Y - 56} width={148} height={40}
            rx="4" fill="#1a3a6a" stroke="#2a5a9a" strokeWidth="2" />
          <text x={HILL_TOP_X + 96} y={HILL_TOP_Y - 32} textAnchor="middle"
            fontFamily="'Georgia', serif" fontSize="12" fontWeight="bold"
            fill="#f8e090" letterSpacing="1">SHREWSBURY HILL</text>
          <text x={HILL_TOP_X + 96} y={HILL_TOP_Y - 16} textAnchor="middle"
            fontFamily="'Georgia', serif" fontSize="9"
            fill="#c8d8f0" letterSpacing="1" opacity="0.75">TOBOGGAN RUN · 1908</text>
        </g>

        {/* ── Scene label ── */}
        <g style={{
          opacity: active ? 1 : 0,
          transform: active ? "translateY(0)" : "translateY(-8px)",
          transition: tr(0.08),
        }}>
          <text x={W / 2} y={H - 14} textAnchor="middle"
            fontFamily="'Georgia', serif" fontSize="11" fill="#b8d0ee"
            letterSpacing="3" opacity="0.6">
            SHREWSBURY · MOONLIT TOBOGGAN RUN · WINTER EVENING
          </text>
        </g>
      </svg>
    </section>
  );
}
