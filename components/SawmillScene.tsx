"use client";
import { useEffect, useRef, useState } from "react";

const W = 1280, H = 520;
const GY   = 462;
const CEIL = 58;

// ── water wheel (right, overshot) ─────────────────────────────────────────────
const WHL_CX  = 1060;
const WHL_CY  = GY - 88;   // 374
const WHL_OR  = 118;
const WHL_IR  = 48;
const WHL_HUB = 20;
const WHL_N   = 12;         // buckets
const CRANK_R = 54;         // crank pin offset from center

// ── frame saw ─────────────────────────────────────────────────────────────────
const SAW_CX   = 572;
const SAW_MID  = 298;       // midpoint of crosspiece travel
const SAW_AMP  = 52;
// crosspiece: 246 (top) ↔ 350 (bottom)
const BLADE_H  = 114;       // blade below crosspiece
// blade bottom: 360 (at top stroke, above log) ↔ 464 (at bottom, into log)
const FRAME_W  = 128;
const FRAME_L  = SAW_CX - FRAME_W / 2;  // 508
const FRAME_R  = SAW_CX + FRAME_W / 2;  // 636

// ── log on carriage ────────────────────────────────────────────────────────────
const LOG_TOP  = GY - 50;   // 412 — log top surface (blade cuts here)
const LOG_DIA  = 50;        // visible log cross-section
const LOG_BASE = GY - 10;   // 452

// drive shaft horizontal bar connecting wheel to saw
const SHAFT_Y  = CEIL + 72; // 130 — overhead shaft height

// ── sawyer ────────────────────────────────────────────────────────────────────
const SWYR_X = FRAME_R + 74;  // 710
const SWYR_Y = GY;

// ── board stack (left) ────────────────────────────────────────────────────────
const STCK_X  = 80;
const STCK_Y  = GY;
const BOARD_W = 214;
const BOARD_N = 9;

// ── mill race ─────────────────────────────────────────────────────────────────
const RACE_Y = WHL_CY + WHL_OR - 8;  // 484 (below GY=462, sub-floor)

// ── ceiling beams ─────────────────────────────────────────────────────────────
const BEAMS = [210, 398, 578, 760, 940] as const;

// ── saw teeth path (bottom of blade) ─────────────────────────────────────────
const TEETH: string = (() => {
  const tw = 8, th = 12;
  const n  = Math.floor(FRAME_W / tw);
  let d    = `M${FRAME_L},0`;
  for (let i = 0; i < n; i++) {
    const x = FRAME_L + i * tw;
    d += ` L${x + tw / 2},${th} L${x + tw},0`;
  }
  d += ` L${FRAME_R},${th} Z`;
  return d;
})();

// ── sawdust spray points ──────────────────────────────────────────────────────
type SD3 = [number, number, number]; // xOff, phase, speed
const SAWDUST: SD3[] = [];
for (let i = 0; i < 14; i++) {
  SAWDUST.push([(i * 23) % 80 - 40, i * 0.38, 0.6 + (i % 4) * 0.22]);
}

// ── water trickle out of buckets ──────────────────────────────────────────────
// (drawn for bottom half of wheel where water is shed)
type WV2 = [number, number]; // offset x, phase
const WATER_DRIPS: WV2[] = [[0,0],[12,0.6],[24,1.2],[36,1.8],[-12,2.4],[-24,3.0]];

// ── ambient dust motes in shaft light ────────────────────────────────────────
type DM3 = [number, number, number]; // x, y, phase
const DUST_MOTES: DM3[] = [];
for (let i = 0; i < 10; i++) {
  DUST_MOTES.push([850 + (i * 31) % 180, GY - 280 + (i * 17) % 200, i * 0.44]);
}

export function SawmillScene() {
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
    let _raf: number = 0, _last = 0;
    const _tick = (ts: number) => { if (ts - _last >= 33) { setPhase(p => p + 0.033); _last = ts; } _raf = requestAnimationFrame(_tick); };
    _raf = requestAnimationFrame(_tick);
    return () => cancelAnimationFrame(_raf);
  }, [vis]);

  const whlAngle  = (phase * 0.38) % (Math.PI * 2);
  const sawY      = SAW_MID + Math.sin(whlAngle) * SAW_AMP;       // 246–350
  const crankPinX = WHL_CX + Math.sin(whlAngle) * CRANK_R;
  const crankPinY = WHL_CY - Math.cos(whlAngle) * CRANK_R;
  const logX      = 820 - ((phase * 0.9) % 260);                   // log advances left
  const dustOn    = sawY > SAW_MID;                                  // bottom half of stroke
  const swyrLean  = Math.sin(phase * 0.38) * 4;                    // subtle lean

  return (
    <div ref={ref}
      style={{ opacity: vis ? 1 : 0, transition: "opacity 1.2s ease", background: "#2a1c0c" }}
      className="w-full overflow-hidden"
      aria-label="Water-powered sawmill — Route 9 Shrewsbury c.1790"
    >
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" preserveAspectRatio="xMidYMid slice" style={{ display: "block" }}>
        <defs>
          <linearGradient id="sm-wall" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#2e2010" />
            <stop offset="100%" stopColor="#1a1008" />
          </linearGradient>
          <linearGradient id="sm-floor" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#3e2c14" />
            <stop offset="100%" stopColor="#2a1c08" />
          </linearGradient>
          <linearGradient id="sm-log" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%"   stopColor="#8a5c28" />
            <stop offset="100%" stopColor="#6a4018" />
          </linearGradient>
          <linearGradient id="sm-water" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#4090c0" />
            <stop offset="100%" stopColor="#2060a0" />
          </linearGradient>
          <linearGradient id="sm-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#5090c8" />
            <stop offset="100%" stopColor="#80b8e0" />
          </linearGradient>
          <radialGradient id="sm-shaft" cx="50%" cy="0%" r="80%">
            <stop offset="0%"   stopColor="#e8d890" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#e8d890" stopOpacity="0"   />
          </radialGradient>
        </defs>

        {/* ── back wall ── */}
        <rect x="0" y={CEIL} width={W} height={GY - CEIL} fill="url(#sm-wall)" />
        {[0,1,2,3,4,5,6,7,8,9].map(i => (
          <line key={i} x1={i * 130} y1={CEIL} x2={i * 130} y2={GY} stroke="#2e2010" strokeWidth="2" opacity="0.5" />
        ))}

        {/* ── floor ── */}
        <rect x="0" y={GY} width={W} height={H - GY} fill="url(#sm-floor)" />
        {[0, 120, 240, 360, 480, 600, 720, 840, 960, 1080, 1200].map((fx, fi) => (
          <line key={fi} x1={fx} y1={GY} x2={fx} y2={H} stroke="#2a1c08" strokeWidth="2" opacity="0.45" />
        ))}
        {/* sawdust on floor around saw */}
        <ellipse cx={SAW_CX} cy={GY + 6} rx="80" ry="14" fill="#c8a040" opacity="0.35" />
        <ellipse cx={SAW_CX} cy={GY + 8} rx="48" ry="9"  fill="#e0b848" opacity="0.3" />

        {/* ── ceiling + beams ── */}
        <rect x="0" y={CEIL - 10} width={W} height="16" fill="#1e1408" />
        {BEAMS.map((bx, bi) => (
          <g key={bi}>
            <rect x={bx - 14} y={CEIL} width="28" height={GY - CEIL} fill="#241808" opacity="0.45" />
            <rect x={bx - 14} y={CEIL} width="28" height="14" fill="#3a2810" />
          </g>
        ))}

        {/* ── exterior sky visible through wheel opening ── */}
        <rect x={WHL_CX - WHL_OR - 28} y={CEIL} width={WHL_OR * 2 + 56} height={GY - CEIL}
          fill="url(#sm-sky)" opacity="0.4" />

        {/* ── daylight shaft through wall opening ── */}
        <path
          d={`M${WHL_CX - WHL_OR - 20},${CEIL + 20} L${WHL_CX + WHL_OR + 20},${CEIL + 20} L${WHL_CX + WHL_OR + 60},${GY} L${WHL_CX - WHL_OR - 60},${GY} Z`}
          fill="url(#sm-shaft)" opacity="0.28"
        />

        {/* ── dust motes in shaft light ── */}
        {DUST_MOTES.map(([dmx, dmy, dph], dmi) => {
          const drift = Math.sin(phase * 0.6 + dph) * 8;
          const op    = 0.3 + Math.sin(phase * 1.2 + dph) * 0.2;
          return <circle key={dmi} cx={dmx + drift} cy={dmy} r="1.5" fill="#e8d890" opacity={op} />;
        })}

        {/* ── mill race (sub-floor channel) ── */}
        <rect x={WHL_CX - WHL_OR - 24} y={GY} width={WHL_OR * 2 + 48} height={H - GY}
          fill="url(#sm-water)" opacity="0.9" />
        {/* animated water ripples in race */}
        {[0, 1, 2, 3].map(ri => {
          const wx = WHL_CX - WHL_OR + ri * 60 - (phase * 30) % 60;
          return (
            <path key={ri}
              d={`M${wx},${GY + 4} Q${wx + 12},${GY + 1} ${wx + 24},${GY + 4}`}
              fill="none" stroke="#70b8e0" strokeWidth="1.5" opacity="0.5"
            />
          );
        })}

        {/* ── water wheel ── */}
        {/* wheel shadow on wall */}
        <circle cx={WHL_CX} cy={WHL_CY} r={WHL_OR + 6} fill="#1a1008" opacity="0.4" />
        {/* buckets / paddles */}
        {Array.from({ length: WHL_N }, (_, i) => {
          const ang  = whlAngle + i * (Math.PI * 2 / WHL_N);
          const bx1  = WHL_CX + Math.cos(ang) * WHL_IR;
          const by1  = WHL_CY + Math.sin(ang) * WHL_IR;
          const bx2  = WHL_CX + Math.cos(ang) * WHL_OR;
          const by2  = WHL_CY + Math.sin(ang) * WHL_OR;
          // bucket width (perpendicular)
          const px   = -Math.sin(ang) * 12;
          const py   = Math.cos(ang) * 12;
          // water fill in bucket (bottom half of wheel, when bucket holds water)
          const bucketAng = (ang + Math.PI * 2) % (Math.PI * 2);
          const hasWater  = bucketAng > Math.PI * 0.1 && bucketAng < Math.PI * 1.1;
          return (
            <g key={i}>
              {/* spoke */}
              <line x1={WHL_CX} y1={WHL_CY} x2={bx2} y2={by2} stroke="#5a3c18" strokeWidth="5" />
              {/* bucket */}
              <path d={`M${bx1 - px},${by1 - py} L${bx2 - px},${by2 - py} L${bx2 + px},${by2 + py} L${bx1 + px},${by1 + py} Z`}
                fill="#5a4020" stroke="#3a2808" strokeWidth="1" />
              {hasWater && (
                <path d={`M${bx1 - px * 0.7},${by1 - py * 0.7} L${bx2 - px * 0.7},${by2 - py * 0.7} L${bx2 + px * 0.7},${by2 + py * 0.7} L${bx1 + px * 0.7},${by1 + py * 0.7} Z`}
                  fill="#4098c8" opacity="0.7" />
              )}
            </g>
          );
        })}
        {/* outer rim */}
        <circle cx={WHL_CX} cy={WHL_CY} r={WHL_OR} fill="none" stroke="#4a3010" strokeWidth="8" />
        <circle cx={WHL_CX} cy={WHL_CY} r={WHL_OR} fill="none" stroke="#6a4c20" strokeWidth="3" />
        {/* inner ring */}
        <circle cx={WHL_CX} cy={WHL_CY} r={WHL_IR} fill="none" stroke="#4a3010" strokeWidth="6" />
        {/* hub */}
        <circle cx={WHL_CX} cy={WHL_CY} r={WHL_HUB} fill="#2a1c08" stroke="#6a4c20" strokeWidth="4" />
        {/* axle box */}
        <rect x={WHL_CX - 10} y={WHL_CY - 10} width="20" height="20" rx="4"
          fill="#3a2810" stroke="#6a4c20" strokeWidth="2" />

        {/* flume (water trough feeding wheel top) */}
        <rect x={WHL_CX + WHL_OR - 10} y={CEIL + 20} width="56" height="14" rx="3"
          fill="#5a4020" stroke="#3a2808" strokeWidth="1.5" />
        <rect x={WHL_CX + WHL_OR - 8} y={CEIL + 24} width="52" height="6" rx="2"
          fill="#3888c0" opacity="0.8" />
        {/* water pouring from flume */}
        {[0, 1, 2].map(wi => {
          const t   = ((phase * 1.8 + wi * 0.6) % 1.0);
          const wy  = CEIL + 34 + t * (WHL_CY - WHL_OR - CEIL - 34);
          const wop = (1 - t) * 0.7;
          return (
            <line key={wi} x1={WHL_CX + WHL_OR + 18 + wi * 8} y1={CEIL + 34}
              x2={WHL_CX + WHL_OR + 18 + wi * 8} y2={wy}
              stroke="#4898c8" strokeWidth="3" opacity={wop} strokeLinecap="round" />
          );
        })}

        {/* ── overhead drive shaft ── */}
        <rect x={crankPinX - 6} y={SHAFT_Y} width="12" height={WHL_CY - WHL_OR * 0.3 - SHAFT_Y}
          fill="#4a3010" opacity="0.5" />
        {/* crank arm on wheel axle */}
        <line x1={WHL_CX} y1={WHL_CY} x2={crankPinX} y2={crankPinY}
          stroke="#6a4820" strokeWidth="7" strokeLinecap="round" />
        {/* crank pin */}
        <circle cx={crankPinX} cy={crankPinY} r="7" fill="#8a6030" stroke="#5a3810" strokeWidth="2" />
        {/* pitman rod (crank pin → saw crosspiece) */}
        <line x1={crankPinX} y1={crankPinY} x2={SAW_CX} y2={sawY}
          stroke="#5a3810" strokeWidth="5" strokeLinecap="round" opacity="0.85" />

        {/* ── saw frame guides ── */}
        {/* left and right vertical guide rails */}
        <rect x={FRAME_L - 10} y={CEIL + 18} width="10" height={GY - CEIL - 18} fill="#4a3010" />
        <rect x={FRAME_R}      y={CEIL + 18} width="10" height={GY - CEIL - 18} fill="#4a3010" />
        {/* guide shoes (crosspiece slides along these) */}
        <rect x={FRAME_L - 14} y={sawY - 10} width="14" height="20" rx="2" fill="#7a5828" stroke="#5a3810" strokeWidth="1" />
        <rect x={FRAME_R}      y={sawY - 10} width="14" height="20" rx="2" fill="#7a5828" stroke="#5a3810" strokeWidth="1" />

        {/* crosspiece (moves up/down) */}
        <rect x={FRAME_L - 4} y={sawY - 8} width={FRAME_W + 8} height="16" rx="3"
          fill="#6a4820" stroke="#4a3010" strokeWidth="2" />

        {/* blade (hanging from crosspiece, moves with it) */}
        <rect x={FRAME_L + 4} y={sawY + 8} width={FRAME_W - 8} height={BLADE_H - 12}
          fill="#b8c0cc" stroke="#8090a0" strokeWidth="1" />
        {/* saw teeth */}
        <g transform={`translate(0, ${sawY + BLADE_H})`}>
          <path d={TEETH} fill="#90a0ac" stroke="#6878a0" strokeWidth="0.8" />
        </g>
        {/* blade tension rods */}
        {[FRAME_L + 20, SAW_CX, FRAME_R - 20].map((tx, ti) => (
          <line key={ti} x1={tx} y1={sawY + 8} x2={tx} y2={sawY + BLADE_H - 12}
            stroke="#7080a0" strokeWidth="1.5" opacity="0.5" />
        ))}

        {/* ── log on carriage ── */}
        {/* carriage platform */}
        <rect x={logX - 20} y={LOG_BASE - 14} width={280} height="14" rx="2" fill="#5a3c14" />
        {/* carriage wheels */}
        {[logX, logX + 90, logX + 180, logX + 240].map((wx, wi) => (
          <circle key={wi} cx={wx} cy={LOG_BASE + 4} r="10" fill="#3a2808" stroke="#5a3c14" strokeWidth="2" />
        ))}
        {/* log body */}
        <rect x={logX} y={LOG_TOP} width="250" height={LOG_DIA} fill="url(#sm-log)" rx="4" />
        {/* log end grain (left end) */}
        <ellipse cx={logX} cy={LOG_TOP + LOG_DIA / 2} rx="8" ry={LOG_DIA / 2}
          fill="#c89050" stroke="#8a5820" strokeWidth="1.5" />
        {/* annual rings on end */}
        {[14, 22, 30].map((r, ri) => (
          <ellipse key={ri} cx={logX} cy={LOG_TOP + LOG_DIA / 2} rx={r * 0.4} ry={r * LOG_DIA / 60}
            fill="none" stroke="#a06030" strokeWidth="0.8" opacity="0.5" />
        ))}
        {/* dog (iron spike holding log to carriage) */}
        <rect x={logX + 60} y={LOG_TOP - 6} width="6" height="14" fill="#5a5860" />
        <rect x={logX + 60 - 10} y={LOG_TOP - 8} width="26" height="6" rx="1" fill="#6a6870" />
        {/* cut kerf line in log (where blade has been cutting) */}
        <line x1={SAW_CX} y1={LOG_TOP} x2={SAW_CX} y2={LOG_TOP + LOG_DIA}
          stroke="#e8d890" strokeWidth="1.5" opacity="0.6" />

        {/* ── sawdust spray at cut ── */}
        {vis && dustOn && SAWDUST.map(([xo, sph, sp], si) => {
          const t   = ((phase * sp + sph) % 1.0);
          const sx  = SAW_CX + xo + Math.sin(t * Math.PI * 3) * 6;
          const sy2 = LOG_TOP + t * 48;
          const sop = (1 - t) * 0.85;
          return <circle key={si} cx={sx} cy={sy2} r="1.8" fill="#e0b848" opacity={sop} />;
        })}

        {/* ── board stack (left) ── */}
        {Array.from({ length: BOARD_N }, (_, bi) => {
          const by = STCK_Y - bi * 8 - 6;
          const bw = BOARD_W - bi * 4;
          return (
            <g key={bi}>
              <rect x={STCK_X + bi * 2} y={by - 6} width={bw} height="7" rx="1"
                fill={bi % 2 === 0 ? "#c89840" : "#b88030"} stroke="#8a5820" strokeWidth="0.8" />
              {/* plank lines */}
              {[60, 120, 160].map((px, pi) => (
                <line key={pi} x1={STCK_X + bi * 2 + px} y1={by - 6}
                  x2={STCK_X + bi * 2 + px} y2={by + 1} stroke="#8a5820" strokeWidth="0.6" opacity="0.5" />
              ))}
            </g>
          );
        })}
        {/* stickers (spacer sticks between board layers for drying) */}
        {[2, 5, 8].map(si => (
          <rect key={si} x={STCK_X + 40} y={STCK_Y - si * 8 - 6} width={10} height={8 * (si % 2 + 1)}
            fill="#6a4820" />
        ))}

        {/* ── sawyer figure ── */}
        {(() => {
          const sx = SWYR_X, sy = SWYR_Y;
          const lean = swyrLean;
          return (
            <g>
              {/* legs */}
              <line x1={sx - 7} y1={sy - 54} x2={sx - 8 + lean} y2={sy} stroke="#1a1840" strokeWidth="8" strokeLinecap="round" />
              <line x1={sx + 7} y1={sy - 54} x2={sx + 8 + lean} y2={sy} stroke="#1a1840" strokeWidth="8" strokeLinecap="round" />
              {/* body */}
              <rect x={sx - 15 + lean * 0.5} y={sy - 112} width="30" height="60" rx="5" fill="#7a3c18" />
              {/* apron */}
              <rect x={sx - 12 + lean * 0.5} y={sy - 106} width="24" height="52" rx="3" fill="#5a3010" opacity="0.85" />
              {/* left arm forward on log guide */}
              <line x1={sx - 15 + lean * 0.5} y1={sy - 96}
                x2={sx - 52} y2={LOG_TOP - 8} stroke="#c09060" strokeWidth="7" strokeLinecap="round" />
              {/* right arm resting on frame */}
              <line x1={sx + 15 + lean * 0.5} y1={sy - 96}
                x2={FRAME_R + 18} y2={sy - 82} stroke="#c09060" strokeWidth="7" strokeLinecap="round" />
              {/* head */}
              <ellipse cx={sx + lean * 0.4} cy={sy - 128} rx="13" ry="15" fill="#c09060" />
              {/* wide-brim hat */}
              <ellipse cx={sx + lean * 0.4} cy={sy - 141} rx="18" ry="6.5" fill="#4a3010" />
              <rect x={sx - 10 + lean * 0.4} y={sy - 160} width="24" height="22" rx="3" fill="#4a3010" />
            </g>
          );
        })()}

        {/* ── wall framing (timber posts visible) ── */}
        {[160, 760, 920].map((px, pi) => (
          <rect key={pi} x={px - 12} y={CEIL} width="24" height={GY - CEIL} fill="#2a1c08" opacity="0.6" />
        ))}

        {/* caption */}
        <text x={W / 2} y={H - 14} textAnchor="middle"
          fontFamily="'Georgia', serif" fontSize="13" letterSpacing="3"
          fill="#8a6030" opacity="0.88">
          SHREWSBURY SAWMILL · WATER-POWERED FRAME SAW · c. 1790
        </text>
      </svg>
    </div>
  );
}
