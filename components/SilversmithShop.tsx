"use client";
import React, { useEffect, useRef, useState } from "react";

const W = 1400, H = 520;

/* ── Workbench ───────────────────────────────────────────── */
const BEN_X1 = 54,  BEN_X2 = 488;
const BEN_Y  = 388, BEN_H  = 24;

/* ── Stake + bowl ────────────────────────────────────────── */
const STK_X   = 284, STK_TOP  = BEN_Y - 66;
const BOWL_CX = 284, BOWL_CY  = STK_TOP - 4;

/* ── Silversmith figure ──────────────────────────────────── */
const SM_X  = 160, SM_SY = 316, SM_HY = 230;
const SM_SX = SM_X + 22;
const UA_L  = 40, FA_L = 32, HM_L = 42;

/* ── Annealing tray ──────────────────────────────────────── */
const ANN_X = 544, ANN_Y = 372;

/* ── Crucible furnace ────────────────────────────────────── */
const CRU_X = 638, CRU_Y = 360;

/* ── Display shelves (right) ─────────────────────────────── */
const SH_X1 = 832;
const SH_YA = 136, SH_YB = 242, SH_YC = 348;

/* ── Hammer cycle ────────────────────────────────────────── */
const HAMM_CYCLE = 112;

/* ── Spark data ──────────────────────────────────────────── */
type SP3 = [number, number, number]; // angle, dist, size
const SPARKS: SP3[] = [
  [0,    28, 3],
  [0.52, 22, 2],
  [1.05, 32, 2.5],
  [1.57, 26, 3],
  [2.09, 30, 2],
  [2.62, 20, 2.5],
  [3.14, 26, 2],
  [3.67, 24, 3],
];

/* ── Silver finished pieces ─────────────────────────────── */
// drawn as helper functions returning ReactNode

/* ── Palette ─────────────────────────────────────────────── */
const DARK  = "#1a1208";
const OAK   = "#7a5820";
const DOAK  = "#4a2e0a";
const SIL   = "#e4e0d8";  // silver base
const SILD  = "#a8a49c";  // silver shadow
const SILH  = "#f8f8f4";  // silver highlight

/* ── Bowl raising path (convex side up on stake) ─────────── */
function bowlPath(cx: number, cy: number): string {
  return `M ${cx - 44} ${cy} `
    + `C ${cx - 40} ${cy - 10} ${cx - 24} ${cy - 24} ${cx} ${cy - 28} `
    + `C ${cx + 24} ${cy - 24} ${cx + 40} ${cy - 10} ${cx + 44} ${cy} Z`;
}

/* ── Teapot on shelf ─────────────────────────────────────── */
function teapot(x: number, y: number): React.ReactNode {
  return (
    <g>
      {/* body */}
      <ellipse cx={x} cy={y} rx={32} ry={26} fill="url(#ss-sil)" />
      <ellipse cx={x - 6} cy={y - 8} rx={14} ry={8}
        fill={SILH} opacity="0.6" />
      {/* lid */}
      <ellipse cx={x} cy={y - 26} rx={18} ry={6} fill="url(#ss-sil)" />
      <circle cx={x} cy={y - 33} r={5} fill={SIL} />
      {/* spout */}
      <path d={`M ${x + 26} ${y - 6} C ${x + 48} ${y - 18} ${x + 54} ${y - 28} ${x + 52} ${y - 36}`}
        fill="none" stroke="url(#ss-sil)" strokeWidth="8" strokeLinecap="round" />
      {/* handle */}
      <path d={`M ${x - 28} ${y - 12} C ${x - 56} ${y - 12} ${x - 56} ${y + 12} ${x - 28} ${y + 12}`}
        fill="none" stroke={SIL} strokeWidth="7" strokeLinecap="round" />
    </g>
  );
}

/* ── Tankard on shelf ────────────────────────────────────── */
function tankard(x: number, y: number): React.ReactNode {
  return (
    <g>
      <rect x={x - 16} y={y - 42} width={32} height={42} fill="url(#ss-sil)" rx="3" />
      <ellipse cx={x} cy={y - 42} rx={16} ry={6} fill={SILH} />
      <ellipse cx={x} cy={y}      rx={16} ry={6} fill={SILD} />
      {/* lid */}
      <ellipse cx={x} cy={y - 44} rx={18} ry={7} fill={SIL} />
      <circle  cx={x} cy={y - 52} r={4}   fill={SIL} />
      {/* handle */}
      <path d={`M ${x + 16} ${y - 36} C ${x + 38} ${y - 36} ${x + 38} ${y - 6} ${x + 16} ${y - 6}`}
        fill="none" stroke={SIL} strokeWidth="6" strokeLinecap="round" />
      {/* highlight */}
      <rect x={x - 10} y={y - 38} width={6} height={30}
        fill={SILH} opacity="0.5" rx="2" />
    </g>
  );
}

/* ── Candlestick ─────────────────────────────────────────── */
function candlestick(x: number, y: number): React.ReactNode {
  return (
    <g>
      {/* base */}
      <ellipse cx={x} cy={y}     rx={20} ry={7} fill="url(#ss-sil)" />
      {/* column */}
      <rect x={x - 6} y={y - 38} width={12} height={38} fill="url(#ss-sil)" />
      {/* bobeche (drip cup) */}
      <ellipse cx={x} cy={y - 38} rx={14} ry={5} fill="url(#ss-sil)" />
      {/* socket */}
      <rect x={x - 5} y={y - 48} width={10} height={14} fill={SIL} rx="2" />
      {/* column fluting */}
      {Array.from({ length: 3 }, (_, i) => (
        <line key={i}
          x1={x - 4 + i * 4} y1={y - 4}
          x2={x - 4 + i * 4} y2={y - 36}
          stroke={SILD} strokeWidth="1" strokeOpacity="0.5" />
      ))}
      {/* highlight */}
      <rect x={x - 4} y={y - 36} width={3} height={34}
        fill={SILH} opacity="0.55" rx="1" />
    </g>
  );
}

/* ── Porringer ───────────────────────────────────────────── */
function porringer(x: number, y: number): React.ReactNode {
  return (
    <g>
      {/* body */}
      <path d={`M ${x - 28} ${y} C ${x - 28} ${y - 22} ${x + 28} ${y - 22} ${x + 28} ${y} Z`}
        fill="url(#ss-sil)" />
      {/* rim */}
      <ellipse cx={x} cy={y} rx={28} ry={8} fill={SILD} />
      {/* pierced handle */}
      <rect x={x + 24} y={y - 8} width={36} height={10} fill={SIL} rx="4" />
      {Array.from({ length: 4 }, (_, i) => (
        <ellipse key={i} cx={x + 32 + i * 8} cy={y - 3} rx={2.5} ry={4}
          fill={DARK} />
      ))}
      {/* interior sheen */}
      <ellipse cx={x - 6} cy={y - 12} rx={10} ry={4}
        fill={SILH} opacity="0.5" />
    </g>
  );
}

export function SilversmithShop() {
  const [phase, setPhase]     = useState(0);
  const [visible, setVisible] = useState(false);
  const ref = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e?.isIntersecting) setVisible(true); },
      { threshold: 0.12 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!visible) return;
    let _raf: number = 0, _last = 0;
    const _tick = (ts: number) => { if (ts - _last >= 33) { setPhase(p => p + 1); _last = ts; } _raf = requestAnimationFrame(_tick); };
    _raf = requestAnimationFrame(_tick);
    return () => cancelAnimationFrame(_raf);
  }, [visible]);

  /* ── Animation ─────────────────────────────────────────── */
  const hammOsc    = Math.sin(phase * Math.PI * 2 / HAMM_CYCLE);
  const onStrike   = hammOsc < -0.78;
  const strikeAmt  = Math.max(0, -hammOsc - 0.78) / 0.22;

  /* hammer arm IK */
  const uaAng = -108 + hammOsc * 52;
  const faAng = uaAng + 46 + hammOsc * 26;
  const uaRad = uaAng * Math.PI / 180;
  const faRad = faAng * Math.PI / 180;
  const elX   = SM_SX + Math.cos(uaRad) * UA_L;
  const elY   = SM_SY + 8 + Math.sin(uaRad) * UA_L;
  const wrX   = elX + Math.cos(faRad) * FA_L;
  const wrY   = elY + Math.sin(faRad) * FA_L;
  const hmX   = wrX + Math.cos(faRad) * HM_L;
  const hmY   = wrY + Math.sin(faRad) * HM_L;

  /* candle flame */
  const fl1 = Math.sin(phase * 0.19) * 3;
  const fl2 = Math.sin(phase * 0.31 + 1.2) * 2;
  const flH = 22 + fl1 + fl2;

  /* annealing glow pulse */
  const annGlow = 0.5 + Math.sin(phase * 0.07) * 0.16;

  /* crucible flame */
  const cfl = Math.sin(phase * 0.22 + 0.5) * 5;
  const cflH = 28 + cfl;

  return (
    <section style={{ background: DARK, padding: "2.5rem 0" }}>
      <svg
        ref={ref}
        viewBox={`0 0 ${W} ${H}`}
        style={{ width: "100%", height: "auto", display: "block" }}
        aria-label="Colonial silversmith shop with hammer-raising and display of finished pieces"
      >
        <defs>
          <linearGradient id="ss-sil" x1="20%" y1="10%" x2="80%" y2="90%">
            <stop offset="0%"   stopColor={SILH} />
            <stop offset="35%"  stopColor={SIL}  />
            <stop offset="70%"  stopColor={SILD} />
            <stop offset="100%" stopColor="#888480" />
          </linearGradient>
          <radialGradient id="ss-anneal" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="#ff9830" stopOpacity="0.95" />
            <stop offset="60%"  stopColor="#ff5010" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#cc2800" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="ss-candle" cx="50%" cy="80%" r="60%">
            <stop offset="0%"   stopColor="#ffe8a0" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#ff8820" stopOpacity="0" />
          </radialGradient>
          <filter id="ss-glow" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="5" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="ss-sd" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="1" dy="2" stdDeviation="3" floodOpacity="0.3" />
          </filter>
        </defs>

        {/* ── Dark workshop walls ──────────────────────────── */}
        <rect width={W} height={H} fill="#1a1208" />
        {Array.from({ length: 7 }, (_, i) => (
          <rect key={i} x={0} y={i * 66} width={W} height={62}
            fill={i % 2 === 0 ? "#1a1208" : "#1e1608"} />
        ))}
        {/* Floor */}
        <rect x={0} y={452} width={W} height={H - 452} fill="#241808" />

        {/* Window (upper right, daylight) */}
        <rect x={992} y={64} width={182} height={228} rx="3"
          fill="#b8d4f0" opacity="0.25" />
        <rect x={992} y={64} width={182} height={228} rx="3"
          fill="none" stroke={OAK} strokeWidth="5" />
        <line x1={1083} y1={64} x2={1083} y2={292} stroke={OAK} strokeWidth="3" />
        <line x1={992}  y1={178} x2={1174} y2={178} stroke={OAK} strokeWidth="3" />
        {/* Light shaft */}
        <path d={`M 992 64 L 1174 64 L 1100 452 L 920 452 Z`}
          fill="#ffe8b0" opacity="0.04" />

        {/* ── Tool rack on wall above bench ───────────────── */}
        <rect x={BEN_X1 + 8} y={116} width={BEN_X2 - BEN_X1 - 16} height={10}
          fill={DOAK} rx="2" />
        {/* Hanging tools */}
        {[
          [88,  "#5a5a60", 48, 4, "planishing"],
          [134, "#6a5a40", 56, 5, "raising"],
          [180, "#5a5a60", 44, 4, "chasing"],
          [226, "#5a5a60", 52, 4, "rivet"],
          [272, "#6a6a70", 62, 6, "swage"],
          [318, "#5a5050", 50, 5, "burnisher"],
          [364, "#5a5a60", 38, 4, "scribe"],
          [410, "#5a5a60", 54, 5, "file"],
        ].map(([tx, tc, tlen, tw, _], ti) => (
          <g key={ti}>
            <line x1={tx as number} y1={126}
              x2={tx as number} y2={126 + (tlen as number)}
              stroke={tc as string} strokeWidth={tw as number}
              strokeLinecap="round" />
            <ellipse cx={tx as number} cy={126 + (tlen as number) + 6}
              rx={8} ry={5}
              fill={tc as string} />
          </g>
        ))}

        {/* ── Workbench ────────────────────────────────────── */}
        <rect x={BEN_X1} y={BEN_Y} width={BEN_X2 - BEN_X1} height={BEN_H}
          fill={OAK} filter="url(#ss-sd)" />
        <rect x={BEN_X1} y={BEN_Y} width={BEN_X2 - BEN_X1} height={6}
          fill="#9a7838" />
        {/* Bench legs */}
        <rect x={BEN_X1 + 18} y={BEN_Y + BEN_H} width={14} height={H - BEN_Y - BEN_H - 52}
          fill={DOAK} />
        <rect x={BEN_X2 - 32} y={BEN_Y + BEN_H} width={14} height={H - BEN_Y - BEN_H - 52}
          fill={DOAK} />
        {/* Bench vise on right end */}
        <rect x={BEN_X2 - 44} y={BEN_Y - 14} width={48} height={14} fill="#4a4a52" rx="2" />
        <rect x={BEN_X2 + 6}  y={BEN_Y - 20} width={8}  height={26} fill="#5a5a62" />

        {/* ── Raising stake ────────────────────────────────── */}
        <rect x={STK_X - 18} y={BEN_Y - 12} width={36} height={16}
          fill="#5a5a62" rx="3" />
        <rect x={STK_X - 5}  y={STK_TOP}    width={10} height={BEN_Y - STK_TOP - 12}
          fill="#6a6a70" />
        {/* Mushroom stake head */}
        <ellipse cx={STK_X} cy={STK_TOP} rx={18} ry={10}
          fill="#7a7880" />
        <ellipse cx={STK_X - 4} cy={STK_TOP - 3} rx={6} ry={3}
          fill="#aaa8b0" opacity="0.6" />

        {/* ── Silver bowl being raised ─────────────────────── */}
        <path d={bowlPath(BOWL_CX, BOWL_CY)} fill="url(#ss-sil)" />
        <ellipse cx={BOWL_CX} cy={BOWL_CY} rx={44} ry={10}
          fill={SILD} opacity="0.6" />
        {/* Bowl specular */}
        <ellipse cx={BOWL_CX - 10} cy={BOWL_CY - 18} rx={12} ry={5}
          fill={SILH} opacity="0.7" />

        {/* ── Impact sparks ─────────────────────────────────── */}
        {SPARKS.map(([ang, dist, sz]: SP3, si) => {
          if (!onStrike) return null;
          const sx = BOWL_CX + Math.cos(ang) * dist * strikeAmt;
          const sy = BOWL_CY + Math.sin(ang) * dist * strikeAmt * 0.5 - 8;
          return (
            <circle key={si} cx={sx} cy={sy} r={sz}
              fill="#ffcc40" opacity={strikeAmt * 0.9}
              filter="url(#ss-glow)" />
          );
        })}

        {/* ── Silversmith Figure ───────────────────────────── */}
        {/* stool */}
        <rect x={SM_X - 36} y={SM_SY + 72} width={72} height={10}
          fill={OAK} rx="2" />
        <line x1={SM_X - 26} y1={SM_SY + 82} x2={SM_X - 26} y2={BEN_Y + BEN_H}
          stroke={DOAK} strokeWidth="8" strokeLinecap="round" />
        <line x1={SM_X + 18} y1={SM_SY + 82} x2={SM_X + 18} y2={BEN_Y + BEN_H}
          stroke={DOAK} strokeWidth="8" strokeLinecap="round" />
        {/* body */}
        <rect x={SM_X - 22} y={SM_SY} width={44} height={74}
          fill="#3a2818" rx="8" />
        {/* apron (work apron — dark leather) */}
        <rect x={SM_X - 16} y={SM_SY + 22} width={32} height={50}
          fill="#2a1e10" rx="3" />
        {/* left arm (holds bowl with tongs) */}
        <line x1={SM_X - 20} y1={SM_SY + 12}
          x2={BOWL_CX - 34}  y2={BOWL_CY + 2}
          stroke="#c89050" strokeWidth="10" strokeLinecap="round" />
        <line x1={BOWL_CX - 34} y1={BOWL_CY + 2}
          x2={BOWL_CX - 42}    y2={BOWL_CY + 2}
          stroke="#5a5a62" strokeWidth="5" strokeLinecap="round" />
        {/* right arm — animated hammer */}
        <line x1={SM_SX}  y1={SM_SY + 10} x2={elX}  y2={elY}
          stroke="#c89050" strokeWidth="11" strokeLinecap="round" />
        <line x1={elX}    y1={elY}         x2={wrX}  y2={wrY}
          stroke="#c89050" strokeWidth="9"  strokeLinecap="round" />
        {/* hammer handle */}
        <line x1={wrX}    y1={wrY}         x2={hmX}  y2={hmY}
          stroke="#8b6028" strokeWidth="7"  strokeLinecap="round" />
        {/* hammer head */}
        <rect
          x={hmX - 6} y={hmY - 14}
          width={12} height={18}
          fill="#5a5a62" rx="2"
          transform={`rotate(${faAng + 90}, ${hmX}, ${hmY})`} />
        {/* head (looking down at work) */}
        <circle cx={SM_X + 4} cy={SM_HY} r={22} fill="#d4a060" />
        {/* leather cap */}
        <path d={`M ${SM_X - 18} ${SM_HY - 6}`
          + ` C ${SM_X - 20} ${SM_HY - 38} ${SM_X + 32} ${SM_HY - 38} ${SM_X + 30} ${SM_HY - 6}`
          + ` C ${SM_X + 22} ${SM_HY - 18} ${SM_X - 10} ${SM_HY - 18} ${SM_X - 18} ${SM_HY - 6}`}
          fill="#3a2810" />

        {/* ── Annealing tray ───────────────────────────────── */}
        <rect x={ANN_X - 48} y={ANN_Y} width={96} height={18}
          fill="#4a4848" rx="3" />
        {/* glowing silver piece in tray */}
        <ellipse cx={ANN_X} cy={ANN_Y - 4}
          rx={54} ry={18}
          fill="url(#ss-anneal)" opacity={annGlow}
          filter="url(#ss-glow)" />
        <path d={`M ${ANN_X - 32} ${ANN_Y - 2} `
          + `C ${ANN_X - 28} ${ANN_Y - 14} ${ANN_X + 28} ${ANN_Y - 14} ${ANN_X + 32} ${ANN_Y - 2} Z`}
          fill="#ff8820" opacity={annGlow * 0.7} />
        <text x={ANN_X} y={ANN_Y + 32}
          textAnchor="middle" fontFamily="Georgia, serif"
          fontSize="8" fill="#8a6828" letterSpacing="1">ANNEALING TRAY</text>

        {/* ── Crucible furnace ─────────────────────────────── */}
        <rect x={CRU_X - 28} y={CRU_Y} width={56} height={62} fill="#4a3818" rx="4" />
        {/* Arch opening */}
        <path d={`M ${CRU_X - 18} ${CRU_Y + 62} L ${CRU_X - 18} ${CRU_Y + 30} `
          + `Q ${CRU_X} ${CRU_Y + 14} ${CRU_X + 18} ${CRU_Y + 30} `
          + `L ${CRU_X + 18} ${CRU_Y + 62} Z`}
          fill="#1a0a02" />
        {/* Flame in furnace */}
        <path d={`M ${CRU_X - 12} ${CRU_Y + 60} `
          + `C ${CRU_X - 14} ${CRU_Y + 60 - cflH * 0.5} `
          + `${CRU_X + 12} ${CRU_Y + 60 - cflH * 0.6} `
          + `${CRU_X} ${CRU_Y + 60 - cflH}`}
          fill="#ff8020" opacity="0.9" />
        <path d={`M ${CRU_X - 7} ${CRU_Y + 60} `
          + `C ${CRU_X - 6} ${CRU_Y + 60 - cflH * 0.4} `
          + `${CRU_X + 8} ${CRU_Y + 60 - cflH * 0.5} `
          + `${CRU_X + 3} ${CRU_Y + 60 - cflH * 0.8}`}
          fill="#ffe060" opacity="0.8" />
        {/* Crucible pot on top */}
        <path d={`M ${CRU_X - 14} ${CRU_Y} L ${CRU_X + 14} ${CRU_Y} `
          + `L ${CRU_X + 10} ${CRU_Y - 24} L ${CRU_X - 10} ${CRU_Y - 24} Z`}
          fill="#3a3028" />
        <ellipse cx={CRU_X} cy={CRU_Y - 24} rx={10} ry={4}
          fill="#c89020" opacity="0.8" />

        {/* ── Candle on bench ──────────────────────────────── */}
        {(() => {
          const cx = BEN_X2 - 18, cy = BEN_Y - 12;
          return (
            <>
              <ellipse cx={cx} cy={cy - 8} rx={22 + fl1}
                ry={18 + fl2}
                fill="url(#ss-candle)" filter="url(#ss-glow)" />
              <path d={`M ${cx - 5} ${cy} `
                + `C ${cx - 6 + fl1} ${cy - flH * 0.6} `
                + `${cx + 5 + fl2} ${cy - flH * 0.7} `
                + `${cx} ${cy - flH}`}
                fill="#ffe090" />
              <path d={`M ${cx - 3} ${cy} `
                + `C ${cx - 2 + fl2} ${cy - flH * 0.45} `
                + `${cx + 3} ${cy - flH * 0.5} `
                + `${cx + 1} ${cy - flH * 0.85}`}
                fill="#fff4c0" opacity="0.8" />
              <rect x={cx - 6} y={cy} width={12} height={34}
                fill="#e8e0c8" rx="2" />
              <rect x={cx - 12} y={cy + 30} width={24} height={6}
                fill={DOAK} rx="1" />
            </>
          );
        })()}

        {/* ── Acid pickle pot ──────────────────────────────── */}
        <rect x={ANN_X + 64} y={ANN_Y - 22} width={34} height={40} rx="4"
          fill="#3a4820" stroke="#4a5a28" strokeWidth="2" />
        <ellipse cx={ANN_X + 81} cy={ANN_Y - 22} rx={17} ry={6}
          fill="#5a7028" />
        <text x={ANN_X + 81} y={ANN_Y + 10}
          textAnchor="middle" fontFamily="Georgia, serif"
          fontSize="7" fill="#8a9860">PICKLE</text>

        {/* ── Display shelves (right) ──────────────────────── */}
        {[SH_YA, SH_YB, SH_YC].map((sy, si) => (
          <g key={si}>
            <rect x={SH_X1} y={sy} width={W - SH_X1 - 20} height={12}
              fill={OAK} rx="2" />
            <rect x={SH_X1}     y={sy + 12} width={8} height={82} fill={DOAK} />
            <rect x={W - 28}    y={sy + 12} width={8} height={82} fill={DOAK} />
          </g>
        ))}

        {/* ── Finished silver pieces ───────────────────────── */}
        {/* Top shelf: teapot, cream jug, sugar bowl */}
        {teapot(910, SH_YA + 42)}
        {tankard(1040, SH_YA + 46)}
        {porringer(1156, SH_YA + 20)}
        {teapot(1284, SH_YA + 42)}

        {/* Middle shelf: candlestick pair + porringer */}
        {candlestick(868, SH_YB + 12)}
        {candlestick(926, SH_YB + 12)}
        {porringer(1040, SH_YB + 22)}
        {tankard(1152, SH_YB + 46)}
        {candlestick(1272, SH_YB + 12)}
        {candlestick(1330, SH_YB + 12)}

        {/* Bottom shelf: spoons */}
        {Array.from({ length: 8 }, (_, i) => {
          const sx = SH_X1 + 50 + i * 52;
          const sy2 = SH_YC + 14;
          return (
            <g key={i}>
              {/* spoon bowl */}
              <ellipse cx={sx} cy={sy2 + 46} rx={8} ry={6}
                fill="url(#ss-sil)" />
              {/* spoon handle */}
              <line x1={sx} y1={sy2 + 40} x2={sx + 4} y2={sy2}
                stroke={SIL} strokeWidth="4" strokeLinecap="round" />
              <ellipse cx={sx + 1} cy={sy2 + 22} rx={2} ry={14}
                fill={SILH} opacity="0.4" />
            </g>
          );
        })}

        {/* ── Trade sign ───────────────────────────────────── */}
        <rect x={700} y={66} width={244} height={42} rx="4"
          fill="#1a1208" stroke="#c8a828" strokeWidth="2.5" />
        <text x={822} y={84} textAnchor="middle"
          fontFamily="Georgia, serif" fontSize="10"
          fill="#c8a828" letterSpacing="2">SHREWSBURY SILVERSMITH</text>
        <text x={822} y={99} textAnchor="middle"
          fontFamily="Georgia, serif" fontSize="8"
          fill="#9a7820" letterSpacing="1">FINE SILVER · ESTABLISHED 1782</text>

        {/* ── Caption ──────────────────────────────────────── */}
        <text x={W / 2} y={494}
          textAnchor="middle"
          fontFamily="Georgia, 'Times New Roman', serif"
          fontSize="13" fill="#c8a848" letterSpacing="2.5">
          SHREWSBURY SILVERSMITH · HAMMER-RAISING · FINE COLONIAL SILVER · EST. 1782
        </text>
      </svg>
    </section>
  );
}
