"use client";
import { useEffect, useRef, useState } from "react";

const W = 1280, H = 520;
const GY   = 462;
const HALL_T = 66;   // ceiling at near end

// ── one-point perspective ─────────────────────────────────────────────────────
const VP_X  = 1082;
const VP_Y  = 262;
const HL_L  = 244;   // left wall of hall at near
const HL_R  = 1036;  // right wall of hall at near

// perspective helpers
const perspX = (wallX: number, t: number) => wallX + (VP_X - wallX) * t;
const perspY = (nearY: number, t: number) => nearY + (VP_Y - nearY) * t;

// ── register wheel (near left wall) ──────────────────────────────────────────
const REG_CX = 138;
const REG_CY = GY - 148;  // 314
const REG_R  = 108;
const HOOK_R = 70;
const HOOK_N = 3;

// ── operator at register ──────────────────────────────────────────────────────
const OP_X = 248;
const OP_Y = GY;

// ── ropemaker cycles from t=0.14 to t=0.62 depth, then resets ───────────────
// at t=0: near (big), at t=1: VP (invisible)
// rmX = perspX(HL_L midpoint, t)  — midpoint of hall
const HALL_MID = (HL_L + HL_R) / 2;  // 640

// ── rope coils at near floor ──────────────────────────────────────────────────
const COIL1 = { cx: 114, cy: GY - 4, rx: 52, ry: 16 } as const;
const COIL2 = { cx: 292, cy: GY - 4, rx: 44, ry: 14 } as const;

// ── hemp bundles on near-left wall ────────────────────────────────────────────
type HB2 = [number, number];
const HEMP: HB2[] = [[68, HALL_T + 60],[128, HALL_T + 52],[194, HALL_T + 62]];

// ── cross-beams overhead (perspective) ───────────────────────────────────────
const BEAM_DEPTHS = [0.08, 0.20, 0.36, 0.54, 0.72] as const;

// ── floor board lines (perspective, along length of hall) ────────────────────
const FLOOR_LINE_XS: number[] = [];
for (let i = 0; i <= 12; i++) FLOOR_LINE_XS.push(HL_L + (HL_R - HL_L) * i / 12);

// ── cross-floor lines (perspective intervals) ────────────────────────────────
const CROSS_TS = [0.08, 0.18, 0.30, 0.44, 0.58, 0.74, 0.88] as const;

// ── windows on left wall (left wall triangle goes from near to VP) ───────────
// Left wall: M(HL_L, HALL_T) L(VP_X, VP_Y) L(HL_L, GY) — near end at HL_L
// Windows appear at intermediate depths on this wall
type WIN3 = [number, number, number]; // t_depth, relative_height (0=floor, 1=ceil), scale
const WINS: WIN3[] = [[0.15, 0.38, 0.88],[0.34, 0.42, 0.72],[0.56, 0.44, 0.56]];

// ── far-end reel post ─────────────────────────────────────────────────────────
const REEL_T = 0.88; // depth
const REEL_X = perspX(HALL_MID, REEL_T);
const REEL_Y = perspY(GY, REEL_T);

// ── strand path builder (computed dynamically with phase) ────────────────────
const STRAND_N = 28;  // points per strand

export function RopewalkScene() {
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

  const whlAngle = (phase * 1.4) % (Math.PI * 2);
  // ropemaker depth cycles 0.14 → 0.62
  const rmT     = 0.14 + ((phase * 0.018) % 0.48);
  const rmX     = perspX(HALL_MID, rmT);
  const rmFloor = perspY(GY, rmT);
  const rmScale = 1 - rmT * 0.88;

  // hook positions on register wheel face
  const hooks = Array.from({ length: HOOK_N }, (_, i) => {
    const ang = whlAngle + i * (Math.PI * 2 / HOOK_N);
    return {
      hx: REG_CX + Math.cos(ang) * HOOK_R,
      hy: REG_CY + Math.sin(ang) * HOOK_R,
      ang,
    };
  });

  // build strand path from hook to top (ropemaker)
  const strandPath = (hx: number, hy: number, strandIdx: number): string => {
    let d = "";
    for (let i = 0; i < STRAND_N; i++) {
      const t    = i / (STRAND_N - 1);
      // lerp from hook to just before ropemaker top position
      const topX = perspX(HALL_MID, rmT - 0.01);
      const topY = perspY(VP_Y, rmT - 0.01);
      const rx   = hx + (topX - hx) * t;
      const ry   = hy + (topY - hy) * t;
      // twist amplitude: large near hooks, fades toward top
      const scale = (VP_X - rx) / (VP_X - hx + 1);
      const amp   = 16 * scale * (1 - t * 0.6);
      const twist = Math.sin(phase * 3.6 - t * 14 + strandIdx * Math.PI * 2 / 3) * amp;
      if (i === 0) d = `M${rx},${ry + twist}`;
      else         d += ` L${rx},${ry + twist}`;
    }
    return d;
  };

  // formed rope behind ropemaker (single twisted rope to far end)
  const formedRopePath = (): string => {
    let d = "";
    for (let i = 0; i < 20; i++) {
      const t   = rmT + (i / 19) * (REEL_T - rmT);
      const rx  = perspX(HALL_MID, t);
      const ry  = perspY(VP_Y, t);
      const amp = 5 * (1 - i / 19);
      const tw  = Math.sin(phase * 4.2 - t * 22) * amp;
      if (i === 0) d = `M${rx},${ry + tw}`;
      else         d += ` L${rx},${ry + tw}`;
    }
    return d;
  };

  return (
    <div ref={ref}
      style={{ opacity: vis ? 1 : 0, transition: "opacity 1.2s ease", background: "#c8b860" }}
      className="w-full overflow-hidden"
      aria-label="Colonial ropewalk — Shrewsbury Cordage Works c.1782"
    >
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" preserveAspectRatio="xMidYMid slice" style={{ display: "block" }}>
        <defs>
          <linearGradient id="rw-floor" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#b8a448" />
            <stop offset="100%" stopColor="#8a7828" />
          </linearGradient>
          <linearGradient id="rw-lwall" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%"   stopColor="#c8b858" />
            <stop offset="100%" stopColor="#a89840" />
          </linearGradient>
          <linearGradient id="rw-rwall" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%"   stopColor="#907828" />
            <stop offset="100%" stopColor="#b89838" />
          </linearGradient>
          <linearGradient id="rw-ceil" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#d8cc78" />
            <stop offset="100%" stopColor="#c0b060" />
          </linearGradient>
          <radialGradient id="rw-haze" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#f0e8b0" stopOpacity="0" />
            <stop offset="100%" stopColor="#f0e8b0" stopOpacity="0.5" />
          </radialGradient>
        </defs>

        {/* ── near-end walls (outside hall opening) ── */}
        {/* left near wall */}
        <rect x="0"     y={HALL_T} width={HL_L}      height={GY - HALL_T} fill="#c4b058" />
        {/* right near wall */}
        <rect x={HL_R} y={HALL_T} width={W - HL_R}   height={GY - HALL_T} fill="#b89840" />
        {/* ceiling near */}
        <rect x="0" y="0" width={W} height={HALL_T} fill="url(#rw-ceil)" />

        {/* ── hall floor (perspective trapezoid) ── */}
        <path d={`M${HL_L},${GY} L${HL_R},${GY} L${VP_X},${VP_Y} Z`}
          fill="url(#rw-floor)" />

        {/* ── floor board lines (length-wise, converging) ── */}
        {FLOOR_LINE_XS.map((fx, fi) => (
          <line key={fi} x1={fx} y1={GY} x2={VP_X} y2={VP_Y}
            stroke="#a09028" strokeWidth="1.2" opacity="0.55" />
        ))}

        {/* ── cross-floor lines (depth spacing) ── */}
        {CROSS_TS.map((t, ti) => {
          const y2  = perspY(GY, t);
          const xl2 = perspX(HL_L, t);
          const xr2 = perspX(HL_R, t);
          return (
            <line key={ti} x1={xl2} y1={y2} x2={xr2} y2={y2}
              stroke="#a09028" strokeWidth={1.4 * (1 - t)} opacity="0.45" />
          );
        })}

        {/* ── left wall (perspective triangle) ── */}
        <path d={`M${HL_L},${HALL_T} L${VP_X},${VP_Y} L${HL_L},${GY} Z`}
          fill="url(#rw-lwall)" />
        {/* left wall vertical board lines */}
        {[0.12, 0.28, 0.46, 0.65, 0.82].map((t, ti) => {
          const wx = perspX(HL_L, t);
          const wy_top = perspY(HALL_T, t);
          const wy_bot = perspY(GY, t);
          return (
            <line key={ti} x1={wx} y1={wy_top} x2={wx} y2={wy_bot}
              stroke="#907828" strokeWidth={1.8 * (1 - t)} opacity="0.4" />
          );
        })}

        {/* ── right wall (perspective triangle) ── */}
        <path d={`M${HL_R},${HALL_T} L${VP_X},${VP_Y} L${HL_R},${GY} Z`}
          fill="url(#rw-rwall)" />

        {/* ── ceiling (perspective trapezoid) ── */}
        <path d={`M${HL_L},${HALL_T} L${HL_R},${HALL_T} L${VP_X},${VP_Y} Z`}
          fill="url(#rw-ceil)" />
        {/* ceiling board lines */}
        {FLOOR_LINE_XS.map((fx, fi) => (
          <line key={fi} x1={fx} y1={HALL_T} x2={VP_X} y2={VP_Y}
            stroke="#b0a038" strokeWidth="1" opacity="0.4" />
        ))}

        {/* ── overhead beams (across hall width at depth intervals) ── */}
        {BEAM_DEPTHS.map((t, ti) => {
          const bxl = perspX(HL_L, t) - 2;
          const bxr = perspX(HL_R, t) + 2;
          const by  = perspY(HALL_T, t) + 4;
          const bh  = 10 * (1 - t);
          return (
            <rect key={ti} x={bxl} y={by} width={bxr - bxl} height={bh}
              fill="#5a4010" opacity={0.8 * (1 - t * 0.5)} />
          );
        })}

        {/* ── windows on left wall ── */}
        {WINS.map(([wt, wrel, wsc], wi) => {
          const wx   = perspX(HL_L, wt);
          const wy_t = perspY(HALL_T, wt);
          const wy_b = perspY(GY, wt);
          const wspan = wy_b - wy_t;
          const whh  = wspan * 0.28 * wsc;
          const wcy  = wy_t + wspan * wrel;
          return (
            <g key={wi}>
              <rect x={wx - 14 * wsc} y={wcy - whh} width={28 * wsc} height={whh * 2}
                rx={2 * wsc} fill="#d8e8f0" stroke="#7a6030" strokeWidth={2 * wsc} />
              <rect x={wx - 14 * wsc} y={wcy - whh} width={28 * wsc} height={whh * 2}
                fill="#f0e8c0" opacity="0.3" />
              {/* cross */}
              <line x1={wx} y1={wcy - whh} x2={wx} y2={wcy + whh} stroke="#7a6030" strokeWidth={1.5 * wsc} />
              <line x1={wx - 14 * wsc} y1={wcy} x2={wx + 14 * wsc} y2={wcy} stroke="#7a6030" strokeWidth={1.5 * wsc} />
            </g>
          );
        })}

        {/* ── distance haze (atmosphere at far end) ── */}
        <circle cx={VP_X} cy={VP_Y} r="180" fill="url(#rw-haze)" />

        {/* ── far-end reel post ── */}
        <line x1={REEL_X} y1={REEL_Y} x2={REEL_X} y2={perspY(HALL_T, REEL_T) + 4}
          stroke="#5a4010" strokeWidth="4" opacity="0.7" />
        <ellipse cx={REEL_X} cy={REEL_Y - 8} rx="14" ry="5" fill="#6a5018" opacity="0.6" />

        {/* ── formed rope (behind ropemaker, single twisted strand) ── */}
        <path d={formedRopePath()} fill="none" stroke="#b08030" strokeWidth="5" opacity="0.8" />
        <path d={formedRopePath()} fill="none" stroke="#d4a848" strokeWidth="2.5" opacity="0.6" />

        {/* ── hemp strands (3 sinusoidal, from hooks to ropemaker top) ── */}
        {hooks.map((h, hi) => (
          <path key={hi}
            d={strandPath(h.hx, h.hy, hi)}
            fill="none"
            stroke={["#c89840","#b07828","#d4aa50"][hi] ?? "#c89840"}
            strokeWidth="2.5"
            opacity="0.9"
          />
        ))}

        {/* ── ropemaker figure (walking backward, perspective-scaled) ── */}
        {(() => {
          const rx = rmX, ry = rmFloor, sc = rmScale;
          const walkSway = Math.sin(phase * 2.2) * 4 * sc;
          const h = 88 * sc;
          return (
            <g>
              {/* legs */}
              <line x1={rx - 5 * sc} y1={ry - h * 0.38} x2={rx - 6 * sc + walkSway} y2={ry}
                stroke="#1a1838" strokeWidth={7 * sc} strokeLinecap="round" />
              <line x1={rx + 5 * sc} y1={ry - h * 0.38} x2={rx + 5 * sc - walkSway} y2={ry}
                stroke="#1a1838" strokeWidth={7 * sc} strokeLinecap="round" />
              {/* body */}
              <rect x={rx - 12 * sc} y={ry - h} width={24 * sc} height={h * 0.65} rx={4 * sc}
                fill="#6a3418" />
              {/* arms holding top */}
              <line x1={rx - 12 * sc} y1={ry - h * 0.8}
                    x2={rx - 28 * sc} y2={ry - h * 0.6}
                stroke="#c09060" strokeWidth={6 * sc} strokeLinecap="round" />
              <line x1={rx + 12 * sc} y1={ry - h * 0.8}
                    x2={rx + 14 * sc} y2={ry - h * 0.55}
                stroke="#c09060" strokeWidth={6 * sc} strokeLinecap="round" />
              {/* rope top / separator (torpedo shape) */}
              <ellipse cx={rx - 22 * sc} cy={ry - h * 0.6} rx={16 * sc} ry={5 * sc}
                fill="#8a6020" stroke="#5a3c10" strokeWidth={1.5 * sc} />
              {/* head */}
              <ellipse cx={rx} cy={ry - h - 12 * sc} rx={10 * sc} ry={12 * sc} fill="#c09060" />
              {/* cap */}
              <ellipse cx={rx} cy={ry - h - 22 * sc} rx={12 * sc} ry={5 * sc} fill="#3a2010" />
            </g>
          );
        })()}

        {/* ── register wheel (near left) ── */}
        {/* wheel shadow */}
        <ellipse cx={REG_CX} cy={REG_CY + 4} rx={REG_R + 4} ry="12" fill="#5a4010" opacity="0.25" />
        {/* spokes */}
        {Array.from({ length: 8 }, (_, si) => {
          const sang = whlAngle + si * (Math.PI / 4);
          return (
            <line key={si}
              x1={REG_CX} y1={REG_CY}
              x2={REG_CX + Math.cos(sang) * (REG_R - 8)}
              y2={REG_CY + Math.sin(sang) * (REG_R - 8)}
              stroke="#7a5820" strokeWidth="6" />
          );
        })}
        {/* rim */}
        <circle cx={REG_CX} cy={REG_CY} r={REG_R} fill="none" stroke="#5a3c10" strokeWidth="10" />
        <circle cx={REG_CX} cy={REG_CY} r={REG_R} fill="none" stroke="#a07830" strokeWidth="4" />
        {/* hub */}
        <circle cx={REG_CX} cy={REG_CY} r="18" fill="#3a2808" stroke="#7a5820" strokeWidth="5" />
        {/* axle */}
        <rect x={REG_CX + REG_R - 8} y={REG_CY - 8} width="32" height="16" rx="4"
          fill="#3a2808" stroke="#6a4820" strokeWidth="2" />
        {/* 3 hooks (rotating) */}
        {hooks.map((h, hi) => (
          <g key={hi}>
            <circle cx={h.hx} cy={h.hy} r="8" fill="#6a6870" stroke="#4a4858" strokeWidth="1.5" />
            {/* hook shape */}
            <path d={`M${h.hx},${h.hy + 8} Q${h.hx + 12},${h.hy + 14} ${h.hx + 10},${h.hy + 6}`}
              fill="none" stroke="#808890" strokeWidth="3" strokeLinecap="round" />
          </g>
        ))}

        {/* ── wheel operator figure ── */}
        {(() => {
          const ox = OP_X, oy = OP_Y;
          const crank = Math.sin(whlAngle) * 12;
          return (
            <g>
              <line x1={ox - 6} y1={oy - 54} x2={ox - 7} y2={oy} stroke="#1a1848" strokeWidth="8" strokeLinecap="round" />
              <line x1={ox + 6} y1={oy - 54} x2={ox + 7} y2={oy} stroke="#1a1848" strokeWidth="8" strokeLinecap="round" />
              <rect x={ox - 14} y={oy - 112} width="28" height="58" rx="5" fill="#3c6028" />
              {/* crank handle arm (pumping) */}
              <line x1={ox - 14} y1={oy - 94} x2={REG_CX + REG_R + 6} y2={REG_CY - 20 + crank}
                stroke="#c09060" strokeWidth="7" strokeLinecap="round" />
              <circle cx={REG_CX + REG_R + 6} cy={REG_CY - 20 + crank} r="5"
                fill="#8a6020" stroke="#5a3c10" strokeWidth="1.5" />
              <line x1={ox + 14} y1={oy - 96} x2={ox + 24} y2={oy - 70}
                stroke="#c09060" strokeWidth="7" strokeLinecap="round" />
              <ellipse cx={ox} cy={oy - 128} rx="13" ry="15" fill="#c09060" />
              <ellipse cx={ox} cy={oy - 142} rx="16" ry="6" fill="#3a2010" />
              <rect x={ox - 10} y={oy - 158} width="22" height="20" rx="3" fill="#3a2010" />
            </g>
          );
        })()}

        {/* ── rope coils (near floor) ── */}
        {[COIL1, COIL2].map((c, ci) => (
          <g key={ci}>
            {[0, 1, 2, 3].map(ring => (
              <ellipse key={ring}
                cx={c.cx} cy={c.cy - ring * 5}
                rx={c.rx - ring * 7} ry={c.ry - ring * 2}
                fill="none" stroke="#c09030" strokeWidth="5" opacity={0.7 - ring * 0.1} />
            ))}
            <ellipse cx={c.cx} cy={c.cy} rx={c.rx} ry={c.ry} fill="#7a5018" opacity="0.25" />
          </g>
        ))}

        {/* ── hemp bundles on left wall ── */}
        {HEMP.map(([hx, hy], hi) => (
          <g key={hi}>
            {/* bundle shape: tied sheaf */}
            <ellipse cx={hx} cy={hy} rx="18" ry="34" fill="#d4a848" stroke="#a07828" strokeWidth="1.5" />
            <ellipse cx={hx} cy={hy + 8} rx="18" ry="10" fill="#b88830" opacity="0.6" />
            {/* tie band */}
            <rect x={hx - 20} y={hy - 4} width="40" height="9" rx="2" fill="#8a6018" />
            {/* hanging rope */}
            <line x1={hx} y1={hy - 34} x2={hx} y2={HALL_T + 6} stroke="#8a6018" strokeWidth="3" />
            <circle cx={hx} cy={HALL_T + 6} r="4" fill="#5a3c10" />
          </g>
        ))}

        {/* caption */}
        <text x={W / 2} y={H - 14} textAnchor="middle"
          fontFamily="'Georgia', serif" fontSize="13" letterSpacing="3"
          fill="#5a3c10" opacity="0.85">
          SHREWSBURY CORDAGE WORKS · ROPEWALK · EST. 1782
        </text>
      </svg>
    </div>
  );
}
