"use client";
import { useEffect, useRef, useState } from "react";

const W = 1280, H = 520;
const GY = 462;
const HZ = 288;

// ── ferris wheel ──────────────────────────────────────────────────────────────
const FW_CX = 942;
const FW_CY = 254;
const FW_OR = 162;
const FW_IR = 106;
const FW_HUB = 22;
const FW_N  = 12;

// ── tent ──────────────────────────────────────────────────────────────────────
const T_X1   = 72;
const T_X2   = 636;
const T_CX   = (T_X1 + T_X2) / 2;   // 354
const T_PEAK = GY - 256;              // 206
const T_EAVE = GY - 128;             // 334

// scallop valance (module-level, no animation)
const SCALLOP: string = (() => {
  const n  = 10;
  const sw = (T_X2 - T_X1) / n;
  let d    = `M${T_X1},${T_EAVE}`;
  for (let i = 0; i < n; i++) {
    const x2 = T_X1 + (i + 1) * sw;
    const xm = T_X1 + (i + 0.5) * sw;
    d += ` Q${xm},${T_EAVE + 28} ${x2},${T_EAVE}`;
  }
  return d;
})();

// ── pennants on tent ridgeline ────────────────────────────────────────────────
type PN3 = [number, number, number]; // x, y, colorIdx
const PENNANTS: PN3[] = (() => {
  const arr: PN3[] = [];
  for (let i = 0; i < 22; i++) {
    const t  = i / 21;
    const px = T_X1 + t * (T_X2 - T_X1);
    const py = t < 0.5
      ? T_PEAK + (T_EAVE - T_PEAK) * (t * 2)
      : T_EAVE - (T_EAVE - T_PEAK) * ((t - 0.5) * 2);
    arr.push([px, py, i % 6]);
  }
  return arr;
})();

// ── prize ribbons in tent ─────────────────────────────────────────────────────
type RIB3 = [number, number, number]; // x, y, colorIdx
const RIBBONS: RIB3[] = [
  [130, T_EAVE + 20, 0],[176, T_EAVE + 24, 1],[220, T_EAVE + 16, 2],
  [266, T_EAVE + 22, 0],[312, T_EAVE + 18, 1],[358, T_EAVE + 22, 2],
  [402, T_EAVE + 20, 0],[448, T_EAVE + 24, 1],
];

// ── judging table ─────────────────────────────────────────────────────────────
const TBL_X1 = 110;
const TBL_X2 = 388;
const TBL_Y  = GY - 66;

// ── string lights (tent eave → FW base pole) ──────────────────────────────────
type SL3 = [number, number, number]; // x, y, phase
const SLING: SL3[] = (() => {
  const arr: SL3[] = [];
  const lx1 = T_X2 - 12, lx2 = FW_CX - 80;
  const ly1 = T_EAVE - 16, ly2 = T_EAVE - 10;
  for (let i = 0; i < 16; i++) {
    const t  = i / 15;
    const sx = lx1 + (lx2 - lx1) * t;
    const sy = ly1 + (ly2 - ly1) * t + Math.sin(t * Math.PI) * 46;
    arr.push([sx, sy, i * 0.42]);
  }
  return arr;
})();

// ── midway crowd ──────────────────────────────────────────────────────────────
type CR4 = [number, number, number, number]; // x, y, scale, phase
const CROWD: CR4[] = (() => {
  const arr: CR4[] = [];
  for (let i = 0; i < 18; i++) {
    arr.push([
      446 + (i * 36) % 432,
      GY - (i % 4) * 6,
      0.70 + (i % 5) * 0.08,
      i * 0.44,
    ]);
  }
  return arr;
})();
const CSHIRTS = ["#d04820","#208040","#2050a0","#a02060","#d09020","#402880"] as const;
const CHAIRS  = ["#1a0c08","#6a3810","#2a2418","#8a5c28","#1a1a28"] as const;

// ── dusk clouds ───────────────────────────────────────────────────────────────
type CL3 = [number, number, number]; // x, y, scale
const CLOUDS: CL3[] = [[180,50,1.1],[530,36,0.85],[900,58,1.3]];

// ── rim lights on wheel base ──────────────────────────────────────────────────
const RIM_LX = [FW_CX - 52, FW_CX - 26, FW_CX, FW_CX + 26, FW_CX + 52] as const;

export function CountyFair() {
  const ref = useRef<HTMLDivElement>(null);
  const [vis, setVis] = useState(false);
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e?.isIntersecting) setVis(true); },
      { threshold: 0.12 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!vis) return;
    const id = setInterval(() => setPhase(p => p + 0.016), 16);
    return () => clearInterval(id);
  }, [vis]);

  const fwAngle   = (phase * 0.32) % (Math.PI * 2);
  const glowPulse = 0.7 + Math.sin(phase * 2.4) * 0.2;

  return (
    <div ref={ref}
      style={{ opacity: vis ? 1 : 0, transition: "opacity 1.2s ease", background: "#1a0e28" }}
      className="w-full overflow-hidden"
      aria-label="Worcester County Fair at dusk — ferris wheel, prize livestock tent, midway"
    >
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" preserveAspectRatio="xMidYMid slice" style={{ display: "block" }}>
        <defs>
          <linearGradient id="cf-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#1a0e28" />
            <stop offset="30%"  stopColor="#3a1852" />
            <stop offset="58%"  stopColor="#c04a18" />
            <stop offset="76%"  stopColor="#e08820" />
            <stop offset="100%" stopColor="#f0b840" />
          </linearGradient>
          <linearGradient id="cf-ground" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#4a3c18" />
            <stop offset="100%" stopColor="#2a2010" />
          </linearGradient>
          <linearGradient id="cf-tent" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#f8f0dc" />
            <stop offset="100%" stopColor="#ead8a8" />
          </linearGradient>
          <radialGradient id="cf-fwglow" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="#ffcc60" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#ff8820" stopOpacity="0"  />
          </radialGradient>
        </defs>

        {/* sky */}
        <rect x="0" y="0" width={W} height={H} fill="url(#cf-sky)" />

        {/* horizon sun glow */}
        <ellipse cx="820" cy={HZ + 12} rx="210" ry="62" fill="#f08020" opacity="0.38" />
        <ellipse cx="820" cy={HZ + 12} rx="108" ry="30" fill="#ffc040" opacity="0.48" />

        {/* dusk clouds */}
        {CLOUDS.map(([cx, cy, sc], ci) => (
          <g key={ci}>
            <ellipse cx={cx}           cy={cy}           rx={60 * sc} ry={22 * sc} fill="#2a1444" opacity="0.72" />
            <ellipse cx={cx - 30 * sc} cy={cy + 8 * sc}  rx={36 * sc} ry={16 * sc} fill="#2a1444" opacity="0.72" />
            <ellipse cx={cx + 32 * sc} cy={cy + 9 * sc}  rx={40 * sc} ry={17 * sc} fill="#2a1444" opacity="0.72" />
          </g>
        ))}

        {/* ground */}
        <rect x="0" y={HZ + 28} width={W} height={H - HZ - 28} fill="url(#cf-ground)" />
        {/* worn fairground path */}
        <path d={`M380,${GY} Q640,${GY - 10} 900,${GY}`} fill="none" stroke="#6a5828" strokeWidth="44" opacity="0.38" />

        {/* ── tent walls + roof ── */}
        <path d={`M${T_X1},${T_EAVE} L${T_X1},${GY} L${T_X2},${GY} L${T_X2},${T_EAVE}`}
          fill="#e4d8a0" stroke="#b0a068" strokeWidth="1.5" />
        <path d={`M${T_X1},${T_EAVE} L${T_CX},${T_PEAK} L${T_X2},${T_EAVE} Z`}
          fill="url(#cf-tent)" stroke="#b0a068" strokeWidth="2" />
        {/* red + blue stripe bands on roof */}
        {[0.18, 0.38, 0.58, 0.78].map((t, ti) => {
          const lx = T_X1 + t * (T_CX - T_X1);
          const ly = T_EAVE - t * (T_EAVE - T_PEAK);
          const rx = T_X2 - t * (T_X2 - T_CX);
          const ry = T_EAVE - t * (T_EAVE - T_PEAK);
          const sc = ti % 2 === 0 ? "#e03820" : "#1840a0";
          return (
            <g key={ti}>
              <line x1={lx} y1={ly} x2={T_CX} y2={T_PEAK} stroke={sc} strokeWidth="14" opacity="0.22" />
              <line x1={rx} y1={ry} x2={T_CX} y2={T_PEAK} stroke={sc} strokeWidth="14" opacity="0.22" />
            </g>
          );
        })}
        {/* warm interior glow */}
        <rect x={T_X1 + 4} y={T_EAVE} width={T_X2 - T_X1 - 8} height={GY - T_EAVE}
          fill="#f8d060" opacity="0.1" />
        {/* tent entrance opening */}
        <rect x={T_CX - 50} y={T_EAVE + 6} width="100" height={GY - T_EAVE - 6}
          fill="#c09830" opacity="0.28" />

        {/* scalloped valance */}
        <path d={SCALLOP} fill="#e03820" stroke="#a81c08" strokeWidth="1.5" opacity="0.92" />

        {/* pennants on ridgeline */}
        {PENNANTS.map(([px, py, ci], pi) => {
          const pcs = ["#e03820","#1840a0","#f0c020","#208040","#e08820","#a020a0"] as const;
          const fl  = Math.sin(phase * 2.2 + pi * 0.32) * 9;
          return (
            <path key={pi}
              d={`M${px},${py} L${px + 10 + fl},${py + 17} L${px + 20},${py}`}
              fill={pcs[ci] ?? "#e03820"} opacity="0.95"
            />
          );
        })}

        {/* center pole + finial */}
        <line x1={T_CX} y1={T_PEAK} x2={T_CX} y2={T_PEAK - 40} stroke="#7a6040" strokeWidth="5" />
        <path d={`M${T_CX - 8},${T_PEAK - 40} L${T_CX},${T_PEAK - 58} L${T_CX + 8},${T_PEAK - 40} Z`} fill="#e03820" />
        <circle cx={T_CX} cy={T_PEAK - 58} r="4" fill="#f8e060" />

        {/* prize ribbons hanging inside tent */}
        {RIBBONS.map(([rx, ry, rci], ri) => {
          const rcols = ["#1840b0","#d03020","#e8c030"] as const;
          const rc    = rcols[rci] ?? "#1840b0";
          const sw2   = Math.sin(phase * 1.6 + ri * 0.48) * 5;
          return (
            <g key={ri}>
              <circle cx={rx + sw2 * 0.4} cy={ry}      r="9" fill={rc} />
              <circle cx={rx + sw2 * 0.4} cy={ry}      r="5" fill="white" opacity="0.3" />
              <line   x1={rx + sw2 * 0.4} y1={ry + 9}  x2={rx - 4 + sw2} y2={ry + 30} stroke={rc} strokeWidth="3.5" />
              <line   x1={rx + sw2 * 0.4} y1={ry + 9}  x2={rx + 5 + sw2} y2={ry + 28} stroke={rc} strokeWidth="3.5" />
            </g>
          );
        })}

        {/* judging table */}
        <rect x={TBL_X1} y={TBL_Y} width={TBL_X2 - TBL_X1} height="10" rx="2" fill="#c8a860" stroke="#8a7040" strokeWidth="1.5" />
        {[TBL_X1 + 14, TBL_X1 + 82, TBL_X2 - 82, TBL_X2 - 14].map((lx, li) => (
          <line key={li} x1={lx} y1={TBL_Y + 10} x2={lx} y2={GY} stroke="#8a7040" strokeWidth="4" />
        ))}
        {/* items on table */}
        <rect x={TBL_X1 + 26} y={TBL_Y - 24} width="20" height="24" rx="2" fill="#d4b860" stroke="#a07830" strokeWidth="1" />
        <circle cx={TBL_X1 + 36} cy={TBL_Y - 24} r="9" fill="#1840b0" />
        <ellipse cx={TBL_X1 + 76} cy={TBL_Y - 12} rx="20" ry="13" fill="#e07018" />
        <line x1={TBL_X1 + 76} y1={TBL_Y - 25} x2={TBL_X1 + 80} y2={TBL_Y - 34} stroke="#3a6020" strokeWidth="3" />
        <ellipse cx={TBL_X1 + 124} cy={TBL_Y - 8}  rx="24" ry="9" fill="#e0a868" stroke="#a06028" strokeWidth="1.5" />
        <ellipse cx={TBL_X1 + 124} cy={TBL_Y - 14} rx="22" ry="8" fill="#c8864c" />
        {/* judge figure */}
        {(() => {
          const jx = TBL_X1 + 200, jy = GY;
          return (
            <g>
              <line x1={jx - 6}  y1={jy - 28} x2={jx - 7}  y2={jy} stroke="#2a1c5c" strokeWidth="7" strokeLinecap="round" />
              <line x1={jx + 6}  y1={jy - 28} x2={jx + 7}  y2={jy} stroke="#2a1c5c" strokeWidth="7" strokeLinecap="round" />
              <rect x={jx - 14}  y={jy - 86} width="28" height="58" rx="4" fill="#202060" />
              <ellipse cx={jx} cy={jy - 100} rx="13" ry="15" fill="#c89060" />
              <ellipse cx={jx} cy={jy - 113} rx="14" ry="5.5" fill="#101010" />
              {/* clipboard */}
              <line x1={jx + 14} y1={jy - 72} x2={jx + 34} y2={jy - 58} stroke="#c09060" strokeWidth="6" strokeLinecap="round" />
              <rect x={jx + 26} y={jy - 72} width="20" height="26" rx="2" fill="#e0d090" stroke="#8a7040" strokeWidth="1" />
            </g>
          );
        })()}

        {/* banner over tent entrance */}
        <path d={`M${T_CX - 92},${T_EAVE - 2} Q${T_CX},${T_EAVE + 16} ${T_CX + 92},${T_EAVE - 2}`}
          fill="#e03820" stroke="#a81c08" strokeWidth="2" />
        <text x={T_CX} y={T_EAVE + 10} textAnchor="middle"
          fontFamily="'Georgia', serif" fontSize="10" fontWeight="bold"
          fill="#f8e860" letterSpacing="1.5">
          PRIZE LIVESTOCK · WORCESTER COUNTY FAIR
        </text>

        {/* ── string lights wire + bulbs ── */}
        <path d={`M${T_X2 - 12},${T_EAVE - 16} Q${(T_X2 + FW_CX - 82) / 2},${T_EAVE + 40} ${FW_CX - 82},${T_EAVE - 10}`}
          fill="none" stroke="#3a2a18" strokeWidth="2" opacity="0.65" />
        {SLING.map(([sx, sy, sph], si) => {
          const tw = 0.55 + Math.sin(phase * 3.2 + sph) * 0.42;
          return (
            <g key={si}>
              <circle cx={sx} cy={sy} r="6" fill="#ffcc40" opacity={tw * 0.38} />
              <circle cx={sx} cy={sy} r="3" fill="#ffee80" opacity={tw} />
            </g>
          );
        })}

        {/* ── midway crowd ── */}
        {CROWD.map(([cx, cy, sc, cph], ci) => {
          const sway = Math.sin(phase * 1.4 + cph) * 3;
          const sh   = CSHIRTS[ci % 6] ?? "#d04820";
          const hr   = CHAIRS [ci % 5] ?? "#1a0c08";
          const h    = 58 * sc;
          return (
            <g key={ci} transform={`translate(${sway * sc}, 0)`}>
              <line x1={cx - 5 * sc} y1={cy - h * 0.32} x2={cx - 5 * sc} y2={cy} stroke={sh} strokeWidth={7 * sc} strokeLinecap="round" />
              <line x1={cx + 5 * sc} y1={cy - h * 0.32} x2={cx + 5 * sc} y2={cy} stroke={sh} strokeWidth={7 * sc} strokeLinecap="round" />
              <rect x={cx - 12 * sc} y={cy - h} width={24 * sc} height={h * 0.7} rx={4 * sc} fill={sh} />
              <ellipse cx={cx} cy={cy - h - 12 * sc} rx={10 * sc} ry={12 * sc} fill="#c09060" />
              <ellipse cx={cx} cy={cy - h - 23 * sc} rx={11 * sc} ry={5 * sc}  fill={hr} />
            </g>
          );
        })}

        {/* ── food stand ── */}
        <rect x="680" y={GY - 94} width="86" height="94" fill="#e03820" stroke="#a81c08" strokeWidth="2" />
        <path d={`M672,${GY - 94} L723,${GY - 120} L774,${GY - 94}`} fill="#f8d020" />
        <rect x="692" y={GY - 70} width="30" height="40" fill="#1a0e08" />
        <rect x="732" y={GY - 70} width="26" height="22" fill="#1a0e08" />
        <text x="723" y={GY - 99} textAnchor="middle" fontSize="9" fontFamily="serif" fill="#f8d020" fontWeight="bold">POPCORN</text>

        {/* ── ferris wheel glow halo ── */}
        <circle cx={FW_CX} cy={FW_CY} r={FW_OR + 48} fill="url(#cf-fwglow)" opacity={glowPulse * 0.65} />

        {/* ferris wheel outer rim */}
        <circle cx={FW_CX} cy={FW_CY} r={FW_OR} fill="none" stroke="#1e1232" strokeWidth="7" />
        <circle cx={FW_CX} cy={FW_CY} r={FW_OR} fill="none" stroke="#8050b8" strokeWidth="2.5" opacity="0.55" />
        {/* inner ring */}
        <circle cx={FW_CX} cy={FW_CY} r={FW_IR} fill="none" stroke="#1e1232" strokeWidth="3" />

        {/* spokes + gondolas */}
        {Array.from({ length: FW_N }, (_, i) => {
          const ang  = fwAngle + i * (Math.PI * 2 / FW_N);
          const gx   = FW_CX + Math.cos(ang) * FW_OR;
          const gy2  = FW_CY + Math.sin(ang) * FW_OR;
          const lon  = 0.55 + Math.sin(phase * 2.6 + i * 0.9) * 0.38;
          return (
            <g key={i}>
              <line x1={FW_CX} y1={FW_CY} x2={gx} y2={gy2} stroke="#1e1232" strokeWidth="3" />
              <g transform={`translate(${gx}, ${gy2})`}>
                <rect x="-11" y="-2" width="22" height="15" rx="3" fill="#1e1232" stroke="#8050b8" strokeWidth="1.5" />
                <line x1="0" y1="-2" x2="0" y2="-14" stroke="#5838a0" strokeWidth="2.5" />
              </g>
              <circle cx={gx} cy={gy2 + 7} r="5.5" fill="#ffcc40" opacity={lon * 0.65} />
              <circle cx={gx} cy={gy2 + 7} r="3"   fill="#ffee80" opacity={lon} />
            </g>
          );
        })}

        {/* inner cross-braces */}
        {Array.from({ length: 6 }, (_, i) => {
          const ang = fwAngle + i * (Math.PI / 3);
          const x1  = FW_CX + Math.cos(ang) * FW_IR;
          const y1  = FW_CY + Math.sin(ang) * FW_IR;
          const x2  = FW_CX - Math.cos(ang) * FW_IR;
          const y2  = FW_CY - Math.sin(ang) * FW_IR;
          return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#1e1232" strokeWidth="2" />;
        })}

        {/* hub */}
        <circle cx={FW_CX} cy={FW_CY} r={FW_HUB} fill="#120c24" stroke="#8050b8" strokeWidth="3" />
        <circle cx={FW_CX} cy={FW_CY} r="11"      fill="#ffcc40" opacity={glowPulse * 0.9} />

        {/* support legs */}
        <line x1={FW_CX - FW_OR * 0.68} y1={FW_CY + FW_OR * 0.68} x2={FW_CX - 42} y2={GY}
          stroke="#1e1232" strokeWidth="11" strokeLinecap="round" />
        <line x1={FW_CX + FW_OR * 0.68} y1={FW_CY + FW_OR * 0.68} x2={FW_CX + 42} y2={GY}
          stroke="#1e1232" strokeWidth="11" strokeLinecap="round" />
        {/* anchor base */}
        <rect x={FW_CX - 58} y={GY - 18} width="116" height="20" rx="4" fill="#120c24" stroke="#3a2850" strokeWidth="1.5" />

        {/* ground rim marquee lights */}
        {RIM_LX.map((lx, li) => {
          const ton = 0.5 + Math.sin(phase * 3.8 + li * 0.72) * 0.44;
          return (
            <g key={li}>
              <circle cx={lx} cy={GY - 17} r="5.5" fill="#ffcc40" opacity={ton * 0.55} />
              <circle cx={lx} cy={GY - 17} r="3"   fill="#ffee80" opacity={ton} />
            </g>
          );
        })}

        {/* caption */}
        <text x={W / 2} y={H - 14} textAnchor="middle"
          fontFamily="'Georgia', serif" fontSize="13" letterSpacing="3" fill="#c09040" opacity="0.9">
          WORCESTER COUNTY FAIR · SHREWSBURY, MA · EST. 1856
        </text>
      </svg>
    </div>
  );
}
