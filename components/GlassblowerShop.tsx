"use client";
import React, { useEffect, useRef, useState } from "react";

const W = 1280, H = 520;
const GY = 462;
const CEIL = 52;

// ── Glory hole furnace ────────────────────────────────────────────────────────
const FRN_CX      = 128;
const FRN_DOME_R  = 156;
const FRN_DOME_CY = GY - 206;          // 256
const FRN_ARCH_X1 = FRN_CX - 62;      // 66
const FRN_ARCH_X2 = FRN_CX + 62;      // 190
const FRN_ARCH_TOP = FRN_DOME_CY - 10; // 246
const FRN_ARCH_BOT = GY - 54;         // 408

// ── Blowpipe ──────────────────────────────────────────────────────────────────
const PIPE_GATHER = 294;
const PIPE_MOUTH  = 56;
const HANDS_X = 510;
const HANDS_Y = GY - 166; // 296

// ── Marver (iron rolling table) ───────────────────────────────────────────────
const MRV_X1 = 344, MRV_X2 = 606;
const MRV_TOP = GY - 152; // 310
const MRV_H = 18;

// ── Annealing oven (lehr) ─────────────────────────────────────────────────────
const LHR_X1 = 762, LHR_X2 = 1004;
const LHR_TOP = GY - 214; // 248
const LHR_BOT = GY - 22;  // 440
const LHR_DX1  = LHR_X1 + 18;
const LHR_DX2  = LHR_X1 + 118;
const LHR_DTOP = LHR_BOT - 158;
const LHR_DBOT = LHR_BOT - 6;

// ── Display shelves (right) ───────────────────────────────────────────────────
const SHF_X1 = 1026, SHF_X2 = 1260;
const SHF_YS = [GY - 306, GY - 230, GY - 154, GY - 78] as const;

// glass: [cx, shelfRow, type, colorIdx]
// type: 0=goblet 1=bottle 2=decanter 3=bowl 4=flask
// color: 0=clear 1=green 2=amber 3=cobalt 4=ruby
type GL4 = [number, number, number, number];
const GLASS: GL4[] = [
  [1042, 0, 0, 0],[1082, 0, 1, 1],[1120, 0, 2, 3],[1158, 0, 0, 2],[1198, 0, 3, 4],[1238, 0, 4, 0],
  [1042, 1, 1, 2],[1082, 1, 0, 3],[1120, 1, 3, 0],[1158, 1, 4, 1],[1198, 1, 2, 4],[1238, 1, 0, 2],
  [1042, 2, 2, 1],[1082, 2, 3, 0],[1120, 2, 0, 4],[1158, 2, 1, 3],[1198, 2, 4, 2],[1238, 2, 3, 1],
  [1042, 3, 4, 3],[1082, 3, 0, 1],[1120, 3, 1, 0],[1158, 3, 2, 2],[1198, 3, 3, 4],[1238, 3, 0, 3],
];
const GCOLS    = ["#b8e4f4","#50883a","#d08828","#2860c8","#b81e1e"] as const;
const GCOLS_DK = ["#70b8d8","#2c601a","#986010","#1038a0","#880e0e"] as const;
const GCOLS_LT = ["#ddf4fc","#74aa5a","#f0b840","#5888ec","#e04040"] as const;

// ── Sparks from furnace ────────────────────────────────────────────────────────
type SP4 = [number, number, number, number]; // xOff, phaseOff, speed, xDrift
const SPARKS: SP4[] = [
  [-30, 0.0, 1.1, -5],[-16, 0.8, 1.4,  3],[  0, 1.5, 0.9, -3],[14, 2.2, 1.2,  5],
  [ 26, 3.0, 1.0, -4],[-20, 3.7, 1.3,  2],[  8, 4.5, 1.1, -6],[-8, 5.2, 0.8,  4],
  [ 20, 5.9, 1.2, -2],[-38, 6.6, 0.9,  3],[ 34, 7.3, 1.1, -3],[-12, 0.4, 1.3, 4],
];

// ── Tool rack wall pegs above marver ─────────────────────────────────────────
type TL2 = [number, number]; // x, angle°
const TOOLPEGS: TL2[] = [
  [370,-72],[392,-68],[416,-75],[440,-70],[464,-66],[488,-72],[512,-68],[536,-74],
];

// ── Blowpipe rack on wall ─────────────────────────────────────────────────────
const RACK_XS = [262, 290, 318, 346] as const;

// ── Ceiling beams ─────────────────────────────────────────────────────────────
const BEAM_XS = [240, 456, 672, 894, 1112] as const;

// ── Floor boards ─────────────────────────────────────────────────────────────
const FLR_XS = [0, 118, 236, 354, 472, 590, 708, 826, 944, 1062, 1180] as const;

// ── Glassblower figure ────────────────────────────────────────────────────────
const GB_X    = 546;
const GB_Y    = GY;
const GB_HIP  = GB_Y - 112; // 350
const GB_SH   = GB_Y - 208; // 254
const GB_HEAD = GB_Y - 244; // 218

// ── Window ────────────────────────────────────────────────────────────────────
const WIN_CX  = 688;
const WIN_W   = 72;
const WIN_TOP = CEIL + 32;
const WIN_BOT = CEIL + 196;

// ── Glass piece shape helper ──────────────────────────────────────────────────
function glassShape(
  type: number, cx: number, sy: number,
  col: string, dk: string, lt: string
): React.ReactNode {
  switch (type) {
    case 0: return ( // goblet
      <g>
        <ellipse cx={cx} cy={sy} rx={12} ry={4} fill={dk} />
        <rect x={cx - 3} y={sy - 26} width={6} height={26} fill={col} rx="1" />
        <path d={`M${cx-14} ${sy-28} Q${cx-17} ${sy-58} ${cx} ${sy-66} Q${cx+17} ${sy-58} ${cx+14} ${sy-28}`}
          fill={col} stroke={dk} strokeWidth="1" />
        <ellipse cx={cx} cy={sy - 66} rx={14} ry={4} fill={lt} opacity="0.55" />
        <path d={`M${cx-10} ${sy-32} Q${cx-14} ${sy-54} ${cx-7} ${sy-64}`}
          fill="none" stroke={lt} strokeWidth="2" opacity="0.42" />
      </g>
    );
    case 1: return ( // bottle
      <g>
        <path d={`M${cx-12} ${sy} L${cx-12} ${sy-40} Q${cx-12} ${sy-56} ${cx-5} ${sy-62} L${cx-5} ${sy-80} L${cx+5} ${sy-80} L${cx+5} ${sy-62} Q${cx+12} ${sy-56} ${cx+12} ${sy-40} L${cx+12} ${sy} Z`}
          fill={col} stroke={dk} strokeWidth="1" />
        <rect x={cx - 6} y={sy - 84} width={12} height={5} fill={dk} rx="1" />
        <rect x={cx - 8} y={sy - 54} width={4} height={32} fill={lt} opacity="0.28" rx="1" />
      </g>
    );
    case 2: return ( // decanter
      <g>
        <path d={`M${cx-16} ${sy} Q${cx-19} ${sy-36} ${cx-8} ${sy-56} L${cx-5} ${sy-66} L${cx+5} ${sy-66} L${cx+8} ${sy-56} Q${cx+19} ${sy-36} ${cx+16} ${sy} Z`}
          fill={col} stroke={dk} strokeWidth="1" />
        <rect x={cx - 5} y={sy - 76} width={10} height={12} fill={col} />
        <ellipse cx={cx} cy={sy - 78} rx={7} ry={3} fill={dk} />
        <circle cx={cx} cy={sy - 84} r={5} fill={col} stroke={dk} strokeWidth="1" />
        <path d={`M${cx-12} ${sy-6} Q${cx-17} ${sy-30} ${cx-7} ${sy-54}`}
          fill="none" stroke={lt} strokeWidth="2" opacity="0.36" />
      </g>
    );
    case 3: return ( // bowl
      <g>
        <path d={`M${cx-18} ${sy-8} Q${cx-22} ${sy-46} ${cx} ${sy-52} Q${cx+22} ${sy-46} ${cx+18} ${sy-8} Z`}
          fill={col} stroke={dk} strokeWidth="1" />
        <ellipse cx={cx} cy={sy - 8} rx={16} ry={5} fill={dk} />
        <ellipse cx={cx} cy={sy - 52} rx={19} ry={5} fill="none" stroke={lt} strokeWidth="1.5" opacity="0.5" />
      </g>
    );
    default: return ( // flask
      <g>
        <ellipse cx={cx} cy={sy - 22} rx={15} ry={20} fill={col} stroke={dk} strokeWidth="1" />
        <rect x={cx - 4} y={sy - 58} width={8} height={20} fill={col} />
        <rect x={cx - 5} y={sy - 62} width={10} height={5} fill={dk} rx="1" />
        <ellipse cx={cx - 6} cy={sy - 28} rx={5} ry={9} fill={lt} opacity="0.3" />
      </g>
    );
  }
}

export function GlassblowerShop() {
  const ref = useRef<SVGSVGElement>(null);
  const [vis, setVis] = useState(false);
  const [phase, setPhase] = useState(0);
  const iRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e?.isIntersecting) setVis(true); },
      { threshold: 0.12 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!vis) return;
    let _raf: number = 0, _last = 0;
    const _tick = (ts: number) => { if (ts - _last >= 33) { setPhase(p => p + 0.033); _last = ts; } _raf = requestAnimationFrame(_tick); };
    _raf = requestAnimationFrame(_tick);
    return () => cancelAnimationFrame(_raf);
  }, [vis]);

  // Furnace flame layers
  const flm1 = Math.sin(phase * 6.8) * 9;
  const flm2 = Math.sin(phase * 10.4 + 1.3) * 6;
  const flm3 = Math.sin(phase * 14.2 + 2.6) * 4;
  const flmH = 52 + Math.sin(phase * 5.1) * 14;

  // Furnace glow intensity
  const frnGlow = 0.72 + Math.sin(phase * 4.8) * 0.12;

  // Blowpipe slow pendulum tilt
  const pipeAngDeg = -5 + Math.sin(phase * 0.74) * 11;
  const pipeAngRad = (pipeAngDeg * Math.PI) / 180;

  // Gather glow world position (for bloom behind pipe group)
  const gatherX = HANDS_X - PIPE_GATHER * Math.cos(pipeAngRad);
  const gatherY = HANDS_Y - PIPE_GATHER * Math.sin(pipeAngRad);

  // Gather pulse
  const gatherR    = 26 + Math.sin(phase * 3.2) * 5;
  const gatherHeat = 0.62 + Math.sin(phase * 2.7) * 0.2;

  // Lehr door glow
  const lehrGlow = 0.5 + Math.sin(phase * 3.8) * 0.1;

  // Cheek puff
  const cheekPuff = 8 + Math.max(0, Math.sin(phase * 2.4)) * 5;

  // Sparks
  const sparkElems: React.ReactNode[] = [];
  for (let i = 0; i < SPARKS.length; i++) {
    const sp = SPARKS[i];
    if (!sp) continue;
    const [xOff, phOff, spd, drift] = sp;
    const t = ((phase * spd + phOff) % (Math.PI * 2)) / (Math.PI * 2);
    const sx = FRN_CX + xOff + drift * t * 1.5;
    const sy = FRN_ARCH_BOT - 10 - t * 72;
    const op = t < 0.18 ? t / 0.18 : t > 0.65 ? (1 - t) / 0.35 : 1;
    const r = 2.5 - t * 1.8;
    sparkElems.push(
      <circle key={i} cx={sx} cy={sy} r={Math.max(0.4, r)}
        fill={t < 0.28 ? "#fff8a0" : "#f87020"} opacity={op * 0.92} />
    );
  }

  return (
    <section aria-label="Colonial glassblower's shop scene" style={{ background: "#1a0e06" }}>
      <svg
        ref={ref}
        viewBox={`0 0 ${W} ${H}`}
        width="100%"
        style={{ display: "block", maxHeight: 520 }}
        aria-hidden="true"
      >
        <defs>
          <radialGradient id="gs-frn" cx="50%" cy="65%" r="55%">
            <stop offset="0%"   stopColor="#ffffff"  stopOpacity="1" />
            <stop offset="15%"  stopColor="#fff870"  stopOpacity="0.96" />
            <stop offset="40%"  stopColor="#f87020"  stopOpacity="0.85" />
            <stop offset="68%"  stopColor="#c83010"  stopOpacity="0.55" />
            <stop offset="100%" stopColor="#880808"  stopOpacity="0" />
          </radialGradient>
          <radialGradient id="gs-amb" cx="12%" cy="62%" r="38%">
            <stop offset="0%"   stopColor="#f84010" stopOpacity="0.26" />
            <stop offset="100%" stopColor="#1a0e06" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="gs-lehr" cx="50%" cy="72%" r="55%">
            <stop offset="0%"  stopColor="#f87020" stopOpacity="0.72" />
            <stop offset="100%" stopColor="#881808" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="gs-gather" cx="40%" cy="38%" r="58%">
            <stop offset="0%"   stopColor="#ffffff"  stopOpacity="1" />
            <stop offset="22%"  stopColor="#fff060"  stopOpacity="0.96" />
            <stop offset="52%"  stopColor="#f87020"  stopOpacity="0.85" />
            <stop offset="100%" stopColor="#c83010"  stopOpacity="0" />
          </radialGradient>
          <linearGradient id="gs-wall" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1e1208" />
            <stop offset="100%" stopColor="#140c04" />
          </linearGradient>
          <filter id="gs-bloom">
            <feGaussianBlur stdDeviation="6" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="gs-glow">
            <feGaussianBlur stdDeviation="3" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <clipPath id="gs-arch">
            <path d={`M${FRN_ARCH_X1} ${FRN_ARCH_BOT} L${FRN_ARCH_X1} ${FRN_ARCH_TOP} Q${FRN_CX} ${FRN_ARCH_TOP - 44} ${FRN_ARCH_X2} ${FRN_ARCH_TOP} L${FRN_ARCH_X2} ${FRN_ARCH_BOT} Z`} />
          </clipPath>
        </defs>

        {/* Background wall */}
        <rect x="0" y="0" width={W} height={GY} fill="url(#gs-wall)" />
        {/* Ambient fire glow wash */}
        <rect x="0" y="0" width={W} height={GY} fill="url(#gs-amb)" />

        {/* Ceiling */}
        <rect x="0" y="0" width={W} height={CEIL + 4} fill="#120a02" />
        <rect x="0" y={CEIL} width={W} height={4} fill="#1e1208" />

        {/* Ceiling beams */}
        {BEAM_XS.map((bx, i) => (
          <rect key={i} x={bx - 18} y={0} width={36} height={CEIL + 22} fill="#0e0804" rx="2" />
        ))}

        {/* Blowpipe rack on wall */}
        <rect x={254} y={CEIL + 48} width={308} height={6} fill="#3a2006" rx="2" />
        {RACK_XS.map((rx, i) => (
          <g key={i}>
            <line x1={rx + 14} y1={CEIL + 54} x2={rx + 14} y2={CEIL + 76}
              stroke="#3a2006" strokeWidth="3" />
            <rect x={rx} y={CEIL + 70} width={84} height={5} fill="#5a4010" rx="2" opacity="0.65" />
          </g>
        ))}

        {/* Floor */}
        <rect x="0" y={GY} width={W} height={H - GY} fill="#280e02" />
        {FLR_XS.map((fx, i) => (
          <line key={i} x1={fx} y1={GY} x2={fx} y2={H} stroke="#1a0c02" strokeWidth="1.5" opacity="0.5" />
        ))}
        <rect x="0" y={GY} width={W} height={3} fill="#1a0a02" />

        {/* Floor glow pool under furnace */}
        <ellipse cx={FRN_CX + 72} cy={GY - 2} rx={194} ry={28}
          fill="#f86010" opacity={frnGlow * 0.18} />

        {/* ══ GLORY HOLE FURNACE ══════════════════════════════════════════════ */}
        {/* Dome brick fill */}
        <path d={`M0 ${GY} L0 ${FRN_DOME_CY} Q0 ${FRN_DOME_CY - FRN_DOME_R - 10} ${FRN_CX} ${FRN_DOME_CY - FRN_DOME_R - 10} Q${FRN_CX + FRN_DOME_R + 10} ${FRN_DOME_CY - FRN_DOME_R - 10} ${FRN_CX + FRN_DOME_R + 10} ${FRN_DOME_CY} L${FRN_CX + FRN_DOME_R + 10} ${GY} Z`}
          fill="#5a2808" />
        {/* Brick horizontal courses */}
        {Array.from({ length: 8 }, (_, bi) => {
          const by2 = FRN_DOME_CY + bi * 26 - 12;
          return (
            <line key={bi} x1={0} y1={by2} x2={FRN_CX + FRN_DOME_R + 10} y2={by2}
              stroke="#7a3808" strokeWidth="1.5" opacity="0.45" />
          );
        })}
        {/* Brick vertical joints */}
        {Array.from({ length: 7 }, (_, bi) => {
          const vx2 = 32 + bi * 42;
          return (
            <line key={bi} x1={vx2} y1={FRN_DOME_CY} x2={vx2} y2={GY}
              stroke="#7a3808" strokeWidth="1" opacity="0.28" />
          );
        })}
        {/* Dome outer arc (mortar stroke) */}
        <path d={`M0 ${FRN_DOME_CY} Q${FRN_CX} ${FRN_DOME_CY - FRN_DOME_R * 1.06} ${FRN_CX + FRN_DOME_R + 10} ${FRN_DOME_CY}`}
          fill="none" stroke="#8a4020" strokeWidth="22" />

        {/* Arch interior glow */}
        <path d={`M${FRN_ARCH_X1} ${FRN_ARCH_BOT} L${FRN_ARCH_X1} ${FRN_ARCH_TOP} Q${FRN_CX} ${FRN_ARCH_TOP - 44} ${FRN_ARCH_X2} ${FRN_ARCH_TOP} L${FRN_ARCH_X2} ${FRN_ARCH_BOT} Z`}
          fill="url(#gs-frn)" opacity={frnGlow} />

        {/* Flame layers (clipped to arch) */}
        <g clipPath="url(#gs-arch)">
          <ellipse cx={FRN_CX + flm1 * 0.5} cy={FRN_ARCH_BOT - 22}
            rx={50 + Math.abs(flm2)} ry={flmH * 0.68}
            fill="#f87020" opacity="0.88" />
          <ellipse cx={FRN_CX + flm2 * 0.6} cy={FRN_ARCH_BOT - 44}
            rx={36 + Math.abs(flm1) * 0.4} ry={flmH * 0.52}
            fill="#ffc800" opacity="0.82" />
          <ellipse cx={FRN_CX + flm3} cy={FRN_ARCH_BOT - flmH * 0.52}
            rx={22} ry={flmH * 0.38}
            fill="#fff8a0" opacity="0.9" />
          <ellipse cx={FRN_CX} cy={FRN_ARCH_BOT - flmH * 0.66}
            rx={10} ry={flmH * 0.2}
            fill="#ffffff" opacity="0.96" />
        </g>

        {/* Arch surround brickwork */}
        <path d={`M${FRN_ARCH_X1 - 14} ${FRN_ARCH_BOT} L${FRN_ARCH_X1 - 14} ${FRN_ARCH_TOP - 6} Q${FRN_CX} ${FRN_ARCH_TOP - 54} ${FRN_ARCH_X2 + 14} ${FRN_ARCH_TOP - 6} L${FRN_ARCH_X2 + 14} ${FRN_ARCH_BOT}`}
          fill="none" stroke="#8a4020" strokeWidth="14" />
        {/* Keystone */}
        <path d={`M${FRN_CX - 14} ${FRN_ARCH_TOP - 46} Q${FRN_CX} ${FRN_ARCH_TOP - 56} ${FRN_CX + 14} ${FRN_ARCH_TOP - 46}`}
          fill="none" stroke="#6a2808" strokeWidth="10" />

        {/* Sparks */}
        {sparkElems}

        {/* Furnace bloom glow on surroundings */}
        <ellipse cx={FRN_CX + 52} cy={FRN_ARCH_BOT - 70} rx={152} ry={130}
          fill="#f86010" opacity={frnGlow * 0.11} filter="url(#gs-bloom)" />

        {/* ══ TOOL RACK ON WALL ════════════════════════════════════════════════ */}
        <rect x={360} y={CEIL + 72} width={264} height={7} fill="#2a1806" rx="2" />
        {TOOLPEGS.map(([tx, tang], i) => {
          const tr = (tang * Math.PI) / 180;
          const tx2 = tx + Math.cos(tr) * 62;
          const ty2 = CEIL + 76 + Math.sin(tr) * 62;
          return (
            <g key={i}>
              <circle cx={tx} cy={CEIL + 76} r={4} fill="#2a1806" />
              <line x1={tx} y1={CEIL + 76} x2={tx2} y2={ty2}
                stroke="#6a5020" strokeWidth="3.5" strokeLinecap="round" />
              {/* Jacks / shear head */}
              <circle cx={tx2} cy={ty2} r={5} fill="#5a5858" />
            </g>
          );
        })}

        {/* Window */}
        <rect x={WIN_CX - WIN_W / 2} y={WIN_TOP} width={WIN_W} height={WIN_BOT - WIN_TOP}
          fill="#6898c8" stroke="#3a2006" strokeWidth="3" rx="1" />
        <line x1={WIN_CX} y1={WIN_TOP} x2={WIN_CX} y2={WIN_BOT} stroke="#3a2006" strokeWidth="2" />
        <line x1={WIN_CX - WIN_W / 2} y1={(WIN_TOP + WIN_BOT) / 2}
          x2={WIN_CX + WIN_W / 2} y2={(WIN_TOP + WIN_BOT) / 2}
          stroke="#3a2006" strokeWidth="2" />
        <rect x={WIN_CX - WIN_W / 2 - 5} y={WIN_BOT} width={WIN_W + 10} height={9}
          fill="#3a2006" rx="1" />

        {/* ══ MARVER TABLE (iron-top) ═══════════════════════════════════════════ */}
        <rect x={MRV_X1 - 8} y={MRV_TOP - 8} width={MRV_X2 - MRV_X1 + 16} height={MRV_H + 8}
          fill="#4a3008" rx="3" />
        <rect x={MRV_X1} y={MRV_TOP} width={MRV_X2 - MRV_X1} height={MRV_H}
          fill="#585858" rx="2" />
        <rect x={MRV_X1} y={MRV_TOP} width={MRV_X2 - MRV_X1} height={3} fill="#787878" />
        {[MRV_X1 + 18, MRV_X2 - 34].map((lx, i) => (
          <rect key={i} x={lx} y={MRV_TOP + MRV_H} width={16} height={GY - MRV_TOP - MRV_H}
            fill="#3a2006" rx="2" />
        ))}

        {/* ══ BLOWPIPE + MOLTEN GATHER ════════════════════════════════════════ */}
        {/* Gather bloom (behind pipe group) */}
        <ellipse cx={gatherX} cy={gatherY} rx={gatherR * 3} ry={gatherR * 2.4}
          fill="#f87020" opacity={gatherHeat * 0.22} filter="url(#gs-bloom)" />

        {/* Pipe group rotates around grip point */}
        <g transform={`rotate(${pipeAngDeg}, ${HANDS_X}, ${HANDS_Y})`}>
          {/* Main shaft */}
          <rect x={HANDS_X - PIPE_GATHER} y={HANDS_Y - 4}
            width={PIPE_GATHER + PIPE_MOUTH} height={8} fill="#5a5050" rx="3" />
          {/* Sheen */}
          <rect x={HANDS_X - PIPE_GATHER + 10} y={HANDS_Y - 4}
            width={PIPE_GATHER + PIPE_MOUTH - 20} height={2.5} fill="#8a7878" opacity="0.45" />
          {/* Gather-end collar */}
          <rect x={HANDS_X - PIPE_GATHER} y={HANDS_Y - 7} width={16} height={14}
            fill="#4a4040" rx="2" />
          {/* Mouthpiece */}
          <rect x={HANDS_X + PIPE_MOUTH - 10} y={HANDS_Y - 7} width={18} height={14}
            fill="#3a2808" rx="3" />
          {/* Molten gather blob */}
          <ellipse cx={HANDS_X - PIPE_GATHER - 8} cy={HANDS_Y}
            rx={gatherR * 0.74} ry={gatherR * 0.62}
            fill="url(#gs-gather)" opacity={gatherHeat} filter="url(#gs-glow)" />
          {/* Gather specular */}
          <ellipse cx={HANDS_X - PIPE_GATHER - 8} cy={HANDS_Y - gatherR * 0.2}
            rx={gatherR * 0.22} ry={gatherR * 0.16}
            fill="#ffffff" opacity="0.92" />
        </g>

        {/* ══ GLASSBLOWER FIGURE ══════════════════════════════════════════════ */}
        {/* Legs */}
        <rect x={GB_X - 13} y={GB_HIP} width={11} height={GY - GB_HIP} fill="#1c1606" rx="3" />
        <rect x={GB_X + 2}  y={GB_HIP} width={11} height={GY - GB_HIP} fill="#1c1606" rx="3" />
        {/* Leather apron */}
        <path d={`M${GB_X - 20} ${GB_HIP - 4} L${GB_X - 24} ${GY - 4} L${GB_X + 24} ${GY - 4} L${GB_X + 20} ${GB_HIP - 4} Z`}
          fill="#583010" stroke="#381e08" strokeWidth="1" />
        {/* Torso */}
        <rect x={GB_X - 18} y={GB_SH} width={36} height={GB_HIP - GB_SH + 12}
          fill="#28203e" rx="4" />
        {/* Right arm extending to grip pipe */}
        <line x1={GB_X + 16} y1={GB_SH + 20} x2={HANDS_X + 14} y2={HANDS_Y}
          stroke="#28203e" strokeWidth="12" strokeLinecap="round" />
        {/* Left arm further back on pipe */}
        <line x1={GB_X - 16} y1={GB_SH + 24} x2={HANDS_X - 42} y2={HANDS_Y + 4}
          stroke="#28203e" strokeWidth="12" strokeLinecap="round" />
        {/* Head */}
        <circle cx={GB_X} cy={GB_HEAD} r={21} fill="#c4885a" />
        {/* Heat goggles */}
        <rect x={GB_X - 18} y={GB_HEAD - 6} width={14} height={10} fill="#1a1008" rx="4" opacity="0.88" />
        <rect x={GB_X + 4}  y={GB_HEAD - 6} width={14} height={10} fill="#1a1008" rx="4" opacity="0.88" />
        <line x1={GB_X - 4} y1={GB_HEAD - 1} x2={GB_X + 4} y2={GB_HEAD - 1}
          stroke="#3a2808" strokeWidth="2" />
        {/* Goggle straps */}
        <path d={`M${GB_X - 18} ${GB_HEAD - 1} Q${GB_X - 27} ${GB_HEAD - 18} ${GB_X - 13} ${GB_HEAD - 23}`}
          fill="none" stroke="#3a2808" strokeWidth="2" />
        <path d={`M${GB_X + 18} ${GB_HEAD - 1} Q${GB_X + 27} ${GB_HEAD - 18} ${GB_X + 13} ${GB_HEAD - 23}`}
          fill="none" stroke="#3a2808" strokeWidth="2" />
        {/* Puffed cheeks */}
        <circle cx={GB_X - 14} cy={GB_HEAD + 10} r={cheekPuff * 0.72} fill="#d4986a" opacity="0.68" />
        <circle cx={GB_X + 14} cy={GB_HEAD + 10} r={cheekPuff * 0.66} fill="#d4986a" opacity="0.68" />
        {/* Mouth pursed */}
        <ellipse cx={GB_X} cy={GB_HEAD + 12} rx={4} ry={2.5} fill="#6a3010" />
        {/* Hair */}
        <path d={`M${GB_X - 21} ${GB_HEAD - 10} Q${GB_X} ${GB_HEAD - 38} ${GB_X + 21} ${GB_HEAD - 10}`}
          fill="#2a1a08" />

        {/* ══ ANNEALING OVEN (LEHR) ═══════════════════════════════════════════ */}
        {/* Brick body */}
        <rect x={LHR_X1} y={LHR_TOP} width={LHR_X2 - LHR_X1} height={LHR_BOT - LHR_TOP}
          fill="#6a3010" stroke="#4a1e06" strokeWidth="2" rx="4" />
        {/* Brick courses */}
        {Array.from({ length: 8 }, (_, bri) => {
          const lby = LHR_TOP + bri * 26 + 6;
          return (
            <line key={bri} x1={LHR_X1 + 2} y1={lby} x2={LHR_X2 - 2} y2={lby}
              stroke="#4a1e06" strokeWidth="1" opacity="0.38" />
          );
        })}
        {/* Door frame + interior glow */}
        <rect x={LHR_DX1 - 6} y={LHR_DTOP - 8} width={LHR_DX2 - LHR_DX1 + 12} height={LHR_DBOT - LHR_DTOP + 12}
          fill="#3a1806" rx="3" />
        <rect x={LHR_DX1} y={LHR_DTOP} width={LHR_DX2 - LHR_DX1} height={LHR_DBOT - LHR_DTOP}
          fill="url(#gs-lehr)" opacity={lehrGlow} rx="2" />
        {/* Chimney */}
        <rect x={(LHR_X1 + LHR_X2) / 2 - 18} y={LHR_TOP - 50} width={36} height={54}
          fill="#5a2808" rx="3" />
        <rect x={(LHR_X1 + LHR_X2) / 2 - 22} y={LHR_TOP - 54} width={44} height={8}
          fill="#3a1806" rx="2" />
        {/* Cooling pieces on lehr top */}
        {[LHR_X1 + 130, LHR_X1 + 172, LHR_X1 + 210].map((px, i) => {
          const gcol = GCOLS[(i + 1) % 5] ?? "#b8e4f4";
          return (
            <ellipse key={i} cx={px} cy={LHR_TOP - 4} rx={10 + i * 2} ry={6}
              fill={gcol} opacity="0.82" />
          );
        })}

        {/* ══ GLASS DISPLAY SHELVES ═══════════════════════════════════════════ */}
        {/* Back wall */}
        <rect x={SHF_X1 - 18} y={CEIL + 4} width={W - SHF_X1 + 18} height={GY - CEIL - 4}
          fill="#1a1006" />
        {/* Shelf boards */}
        {SHF_YS.map((sy, ri) => (
          <rect key={ri}
            x={SHF_X1 - 16} y={sy - 4} width={SHF_X2 - SHF_X1 + 32} height={16}
            fill="#2a1806" rx="2" />
        ))}
        {/* Glass pieces */}
        {GLASS.map(([cx, ri, type, ci], gi) => {
          const sy  = SHF_YS[ri]    ?? (GY - 78);
          const col = GCOLS[ci]     ?? "#b8e4f4";
          const dk  = GCOLS_DK[ci]  ?? "#70b8d8";
          const lt  = GCOLS_LT[ci]  ?? "#ddf4fc";
          return (
            <g key={gi}>
              <ellipse cx={cx} cy={sy} rx={13} ry={3} fill="#000000" opacity="0.28" />
              {glassShape(type, cx, sy, col, dk, lt)}
            </g>
          );
        })}

        {/* Sign plaque */}
        <rect x={268} y={CEIL + 14} width={330} height={40}
          fill="#120802" stroke="#c89030" strokeWidth="2" rx="3" />
        <text x={433} y={CEIL + 41} textAnchor="middle"
          fontFamily="Georgia, serif" fontSize="14" fontWeight="bold"
          fill="#c89030" letterSpacing="2">
          SHREWSBURY GLASSWORKS
        </text>

        {/* Caption */}
        <text x={W / 2} y={H - 10} textAnchor="middle"
          fontFamily="Georgia, serif" fontSize="13" fill="#c87030" letterSpacing="3" opacity="0.8">
          SHREWSBURY GLASSWORKS · HAND-BLOWN GLASS · EST. 1798
        </text>
      </svg>
    </section>
  );
}
