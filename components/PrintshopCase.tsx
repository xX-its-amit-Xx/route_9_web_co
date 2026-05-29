"use client";
import React, { useEffect, useRef, useState } from "react";

const W = 1400, H = 520;

/* ── Press geometry ──────────────────────────────────────── */
const PRE_X1  = 466, PRE_X2  = 894;
const PRE_YT  = 60,  PRE_YB  = 456;
const CHEEK_W = 22;
const SCR_X   = (PRE_X1 + PRE_X2) / 2;   // 680
const SCR_TOP = PRE_YT + 14;              // 74
const BAR_Y   = PRE_YT + 46;             // 106
const PLAT_Y_UP = 150;
const PLAT_Y_DN = 312;
const PLAT_H    = 28;
const PLAT_W    = PRE_X2 - PRE_X1 - 64;  // 364
const PLAT_X1   = PRE_X1 + 32;           // 498
const BED_Y     = 340;
const BED_H     = 48;
const FORM_X1   = PLAT_X1 + 12;          // 510
const FORM_W    = PLAT_W - 24;           // 340
const FORM_Y    = BED_Y + 10;
const FORM_H    = 30;

/* ── Type case (left) ────────────────────────────────────── */
const TC_X1   = 44, TC_Y1 = 108;
const TC_W    = 342, TC_H = 232;
const TC_COLS = 10, TC_ROWS = 7;
const TC_CW   = TC_W / TC_COLS;   // 34.2
const TC_CH   = TC_H / TC_ROWS;   // 33.1

/* ── Compositor figure ───────────────────────────────────── */
const CO_X  = 88, CO_SY = 348, CO_HY = 262;
const CO_SX = CO_X + 18;
const CO_UAL = 38, CO_FAL = 30;

/* ── Pressman figure ─────────────────────────────────────── */
const PM_X  = 968, PM_SY = 282, PM_HY = 196;
const PM_SX = PM_X - 20;
const PM_UAL = 40, PM_FAL = 32;

/* ── Cycle ───────────────────────────────────────────────── */
const PRESS_CYCLE = 248;
const N_THREADS   = 22;

/* ── Letter string for type case ────────────────────────── */
const TC_CHARS = "abcdefghijklmnopqrstuvwxyzfi ffi.,;:!?ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789&@";

/* ── Broadside positions ─────────────────────────────────── */
type BS3 = [number, number, number]; // x, y, tilt
const BSIDES: BS3[] = [
  [1058, 72, -3],
  [1164, 80, 1],
  [1272, 68, -2],
];

/* ── Palette ─────────────────────────────────────────────── */
const OAK  = "#7a5828";
const DOAK = "#4a2e0e";
const IRON = "#4a4a52";
const LEAD = "#707888";
const PAPYR = "#f0e6c8";

export function PrintshopCase() {
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
    const id = setInterval(() => setPhase(p => p + 1), 16);
    return () => clearInterval(id);
  }, [visible]);

  /* ── Animation values ───────────────────────────────────── */
  const pressOsc  = Math.sin(phase * Math.PI * 2 / PRESS_CYCLE);
  const pressDown = Math.max(0, pressOsc);   // 0..1 (only descending half)
  const screwRot  = (phase * 0.09) % (Math.PI * 2);

  const platY = PLAT_Y_UP + pressDown * (PLAT_Y_DN - PLAT_Y_UP);

  const BAR_REST = 44, BAR_PULL = -32;
  const barAng  = BAR_REST + pressDown * (BAR_PULL - BAR_REST);
  const barRad  = barAng * Math.PI / 180;
  const barTipX = SCR_X + Math.cos(barRad) * 228;
  const barTipY = BAR_Y  + Math.sin(barRad) * 228;

  /* pressman arm reaches bar tip */
  const pmDx  = barTipX - PM_SX;
  const pmDy  = barTipY - (PM_SY + 8);
  const pmLen = Math.sqrt(pmDx * pmDx + pmDy * pmDy);
  const pmUAAng = Math.atan2(pmDy, pmDx) * 180 / Math.PI - 22;
  const pmFAAng = pmUAAng + 38;
  const pmUARad = pmUAAng * Math.PI / 180;
  const pmFARad = pmFAAng * Math.PI / 180;
  void pmLen;
  const pmElX = PM_SX + Math.cos(pmUARad) * PM_UAL;
  const pmElY = (PM_SY + 8) + Math.sin(pmUARad) * PM_UAL;
  const pmWrX = pmElX + Math.cos(pmFARad) * PM_FAL;
  const pmWrY = pmElY + Math.sin(pmFARad) * PM_FAL;

  /* compositor arm oscillates across type case */
  const compSwing = Math.sin(phase * 0.031);
  const compDip   = Math.cos(phase * 0.047);
  const coArmTX   = TC_X1 + TC_W * (0.5 + compSwing * 0.38);
  const coArmTY   = TC_Y1 + TC_H * (0.28 + compDip   * 0.22 + 0.22);
  const coDx      = coArmTX - CO_SX;
  const coDy      = coArmTY - (CO_SY + 8);
  const coUAAng   = Math.atan2(coDy, coDx) * 180 / Math.PI - 16;
  const coFAAng   = coUAAng + 32;
  const coUARad   = coUAAng * Math.PI / 180;
  const coFARad   = coFAAng * Math.PI / 180;
  const coElX     = CO_SX + Math.cos(coUARad) * CO_UAL;
  const coElY     = (CO_SY + 8) + Math.sin(coUARad) * CO_UAL;
  const coWrX     = coElX + Math.cos(coFARad) * CO_FAL;
  const coWrY     = coElY + Math.sin(coFARad) * CO_FAL;

  /* ink impression: show when pressed */
  const inkAlpha = pressDown * 0.55;

  /* ── Type case cells ──────────────────────────────────── */
  function typeCase(): React.ReactNode {
    const nodes: React.ReactNode[] = [];
    for (let r = 0; r < TC_ROWS; r++) {
      for (let c = 0; c < TC_COLS; c++) {
        const idx = r * TC_COLS + c;
        const ch  = TC_CHARS[idx] ?? "·";
        const cx  = TC_X1 + (c + 0.5) * TC_CW;
        const cy  = TC_Y1 + (r + 0.5) * TC_CH;
        nodes.push(
          <rect key={idx}
            x={TC_X1 + c * TC_CW + 0.5} y={TC_Y1 + r * TC_CH + 0.5}
            width={TC_CW - 1} height={TC_CH - 1}
            fill={PAPYR} stroke="#b8963a" strokeWidth="0.8" />,
          <text key={`t${idx}`} x={cx} y={cy + 4}
            textAnchor="middle"
            fontFamily="'Times New Roman', serif"
            fontSize="10" fill={DOAK}>
            {ch}
          </text>
        );
      }
    }
    return <>{nodes}</>;
  }

  /* ── Screw thread marks ──────────────────────────────── */
  function screwThreads(): React.ReactNode {
    const nodes: React.ReactNode[] = [];
    const scrLen = platY - SCR_TOP;
    for (let i = 0; i < N_THREADS; i++) {
      const y = SCR_TOP + (scrLen * i) / (N_THREADS - 1);
      const x = SCR_X + Math.sin(i * Math.PI * 0.88 + screwRot) * 7;
      nodes.push(
        <circle key={i} cx={x} cy={y} r={2.2} fill="#c8a44a" opacity="0.9" />
      );
    }
    return <>{nodes}</>;
  }

  /* ── Type form blocks ──────────────────────────────────── */
  function typeForm(): React.ReactNode {
    const nodes: React.ReactNode[] = [];
    const cols = 14, rows = 4;
    const bw   = FORM_W / cols;
    const bh   = FORM_H / rows;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        nodes.push(
          <rect key={r * cols + c}
            x={FORM_X1 + c * bw + 0.5} y={FORM_Y + r * bh + 0.5}
            width={bw - 1} height={bh - 1}
            fill={LEAD} />
        );
      }
    }
    return <>{nodes}</>;
  }

  /* ── Broadside text lines (static helper) ─────────────── */
  function broadsideLines(bx: number, by: number, tilt: number): React.ReactNode {
    const lines = [
      { y: 28, w: 78, h: 5, c: DOAK },   // title rule
      { y: 38, w: 64, h: 3, c: DOAK },
      { y: 50, w: 72, h: 2, c: "#555" },
      { y: 56, w: 70, h: 2, c: "#555" },
      { y: 62, w: 68, h: 2, c: "#555" },
      { y: 68, w: 66, h: 2, c: "#555" },
      { y: 78, w: 72, h: 2, c: "#555" },
      { y: 84, w: 64, h: 2, c: "#555" },
    ];
    return (
      <g transform={`rotate(${tilt}, ${bx + 44}, ${by + 56})`}>
        <rect x={bx} y={by} width={88} height={116}
          fill={PAPYR} stroke="#b8963a" strokeWidth="1.5" />
        {lines.map((l, i) => (
          <rect key={i}
            x={bx + (88 - l.w) / 2} y={by + l.y}
            width={l.w} height={l.h}
            fill={l.c} />
        ))}
      </g>
    );
  }

  return (
    <section style={{ background: "#2a1a08", padding: "2.5rem 0" }}>
      <svg
        ref={ref}
        viewBox={`0 0 ${W} ${H}`}
        style={{ width: "100%", height: "auto", display: "block" }}
        aria-label="Colonial printshop with common press and type case"
      >
        <defs>
          <radialGradient id="ps-candle" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffe8a0" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#ff8820" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="ps-win" cx="50%" cy="40%" r="50%">
            <stop offset="0%" stopColor="#d0e8ff" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#88aad0" stopOpacity="0.1" />
          </radialGradient>
          <filter id="ps-glow" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="6" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {/* background: dark shop walls */}
        <rect width={W} height={H} fill="#1e1208" />
        {/* plank wall boards */}
        {Array.from({ length: 7 }, (_, i) => (
          <rect key={i} x={0} y={i * 66} width={W} height={62}
            fill={i % 2 === 0 ? "#1e1208" : "#231408"} />
        ))}
        {/* floor */}
        <rect x={0} y={440} width={W} height={H - 440} fill="#362010" />
        {Array.from({ length: 10 }, (_, i) => (
          <line key={i} x1={i * 145} y1={440} x2={i * 145 + 90} y2={H}
            stroke="#2e1a0a" strokeWidth="2" />
        ))}
        {/* window (behind press) */}
        <rect x={580} y={68} width={200} height={200} rx="3" fill="url(#ps-win)" opacity="0.5" />
        <rect x={580} y={68} width={200} height={200} rx="3"
          fill="none" stroke={OAK} strokeWidth="5" />
        <line x1={680} y1={68} x2={680} y2={268} stroke={OAK} strokeWidth="3" />
        <line x1={580} y1={168} x2={780} y2={168} stroke={OAK} strokeWidth="3" />

        {/* ── Type case on stand ──────────────────────────── */}
        {/* stand legs */}
        <line x1={TC_X1 + 30} y1={TC_Y1 + TC_H}
          x2={TC_X1 + 20}    y2={PRE_YB - 10}
          stroke={OAK} strokeWidth="10" strokeLinecap="round" />
        <line x1={TC_X1 + TC_W - 30} y1={TC_Y1 + TC_H}
          x2={TC_X1 + TC_W - 20}     y2={PRE_YB - 10}
          stroke={OAK} strokeWidth="10" strokeLinecap="round" />
        {/* case frame */}
        <rect x={TC_X1 - 6} y={TC_Y1 - 6}
          width={TC_W + 12} height={TC_H + 12}
          fill={OAK} rx="3" />
        {/* cells */}
        {typeCase()}
        {/* case title */}
        <text x={TC_X1 + TC_W / 2} y={TC_Y1 - 14}
          textAnchor="middle"
          fontFamily="Georgia, serif"
          fontSize="10" fill="#c8b060" letterSpacing="2">
          UPPER &amp; LOWER CASE
        </text>

        {/* ── Composing stick (left hand of compositor) ──── */}
        <rect x={CO_X - 58} y={CO_SY + 26}
          width={70} height={14}
          fill={IRON} rx="2" />
        {/* set type in stick */}
        {Array.from({ length: 10 }, (_, i) => (
          <rect key={i}
            x={CO_X - 52 + i * 6} y={CO_SY + 28}
            width={5} height={10}
            fill={LEAD} />
        ))}

        {/* ── Compositor Figure ───────────────────────────── */}
        {/* body */}
        <rect x={CO_X - 22} y={CO_SY} width={44} height={70} fill="#3a2a10" rx="8" />
        {/* waistcoat */}
        <rect x={CO_X - 16} y={CO_SY + 8} width={32} height={58} fill="#2a1c08" rx="4" />
        {/* left arm (holds composing stick) */}
        <line x1={CO_X - 20} y1={CO_SY + 14}
          x2={CO_X - 52} y2={CO_SY + 32}
          stroke="#c89050" strokeWidth="11" strokeLinecap="round" />
        <line x1={CO_X - 52} y1={CO_SY + 32}
          x2={CO_X - 62} y2={CO_SY + 33}
          stroke="#c89050" strokeWidth="9" strokeLinecap="round" />
        {/* right arm (animated reaching into case) */}
        <line x1={CO_SX} y1={CO_SY + 10}
          x2={coElX} y2={coElY}
          stroke="#c89050" strokeWidth="11" strokeLinecap="round" />
        <line x1={coElX} y1={coElY}
          x2={coWrX} y2={coWrY}
          stroke="#c89050" strokeWidth="9" strokeLinecap="round" />
        {/* head */}
        <circle cx={CO_X} cy={CO_HY} r={22} fill="#d4a060" />
        {/* wig */}
        <path d={`M ${CO_X - 24} ${CO_HY + 2}`
          + ` C ${CO_X - 28} ${CO_HY - 36} ${CO_X + 28} ${CO_HY - 36} ${CO_X + 24} ${CO_HY + 2}`
          + ` C ${CO_X + 18} ${CO_HY - 14} ${CO_X - 18} ${CO_HY - 14} ${CO_X - 24} ${CO_HY + 2}`}
          fill="#e8e0d0" />
        {/* spectacles */}
        <circle cx={CO_X - 8} cy={CO_HY + 4} r={7} fill="none"
          stroke="#806030" strokeWidth="2" />
        <circle cx={CO_X + 8} cy={CO_HY + 4} r={7} fill="none"
          stroke="#806030" strokeWidth="2" />
        <line x1={CO_X - 1} y1={CO_HY + 4} x2={CO_X + 1} y2={CO_HY + 4}
          stroke="#806030" strokeWidth="2" />

        {/* ── PRINTING PRESS ──────────────────────────────── */}

        {/* Coffin / bed */}
        <rect x={PLAT_X1 - 20} y={BED_Y} width={PLAT_W + 40} height={BED_H}
          fill={OAK} rx="3" />
        <rect x={PLAT_X1 - 14} y={BED_Y + 6} width={PLAT_W + 28} height={BED_H - 12}
          fill={DOAK} rx="2" />

        {/* Type form on bed */}
        {typeForm()}

        {/* Ink impression on paper when pressed */}
        {pressDown > 0.3 && (
          <rect x={FORM_X1} y={FORM_Y}
            width={FORM_W} height={FORM_H}
            fill="#1a0a04" opacity={inkAlpha} />
        )}

        {/* Paper sheet on platen underside */}
        <rect x={PLAT_X1 + 2} y={platY + PLAT_H - 2}
          width={PLAT_W - 4} height={4}
          fill={PAPYR} opacity="0.9" />

        {/* LEFT cheek */}
        <rect x={PRE_X1} y={PRE_YT} width={CHEEK_W} height={PRE_YB - PRE_YT}
          fill={OAK} />
        <rect x={PRE_X1} y={PRE_YT} width={CHEEK_W} height={PRE_YB - PRE_YT}
          fill="none" stroke={DOAK} strokeWidth="2" />
        {/* RIGHT cheek */}
        <rect x={PRE_X2 - CHEEK_W} y={PRE_YT} width={CHEEK_W} height={PRE_YB - PRE_YT}
          fill={OAK} />
        <rect x={PRE_X2 - CHEEK_W} y={PRE_YT} width={CHEEK_W} height={PRE_YB - PRE_YT}
          fill="none" stroke={DOAK} strokeWidth="2" />
        {/* Top cap beam */}
        <rect x={PRE_X1} y={PRE_YT} width={PRE_X2 - PRE_X1} height={16} fill={DOAK} />
        {/* Bottom sill */}
        <rect x={PRE_X1} y={PRE_YB - 16} width={PRE_X2 - PRE_X1} height={16} fill={DOAK} />
        {/* Rounce / side bar (horizontal support mid height) */}
        <rect x={PRE_X1 + CHEEK_W} y={BED_Y - 12}
          width={PRE_X2 - PRE_X1 - CHEEK_W * 2} height={12}
          fill={OAK} />

        {/* Great screw body */}
        <rect x={SCR_X - 11} y={SCR_TOP}
          width={22} height={platY - SCR_TOP}
          fill="#8b6028" />
        {screwThreads()}

        {/* Platen */}
        <rect x={PLAT_X1} y={platY}
          width={PLAT_W} height={PLAT_H}
          fill={DOAK} rx="3" />
        <rect x={PLAT_X1 + 8} y={platY + 5}
          width={PLAT_W - 16} height={PLAT_H - 10}
          fill="#3c2410" rx="2" />
        {/* Platen cap connecting to screw */}
        <rect x={SCR_X - 28} y={platY - 8}
          width={56} height={16}
          fill={OAK} rx="4" />

        {/* Bar (horizontal lever) */}
        <line x1={SCR_X - 228} y1={BAR_Y - Math.sin(barRad) * 228}
          x2={SCR_X + 228}   y2={BAR_Y + Math.sin(barRad) * 228}
          stroke={OAK} strokeWidth="12" strokeLinecap="round" />
        {/* Bar grip sphere */}
        <circle cx={barTipX} cy={barTipY} r={10} fill={DOAK} />
        {/* Bar hinge at screw */}
        <circle cx={SCR_X} cy={BAR_Y} r={13} fill={DOAK} />

        {/* Hose / ink ball table beside press */}
        <rect x={PRE_X2 + 16} y={BED_Y} width={60} height={16} fill={OAK} rx="2" />
        <line x1={PRE_X2 + 26} y1={BED_Y} x2={PRE_X2 + 26} y2={PRE_YB - 10}
          stroke={OAK} strokeWidth="6" strokeLinecap="round" />
        <line x1={PRE_X2 + 56} y1={BED_Y} x2={PRE_X2 + 56} y2={PRE_YB - 10}
          stroke={OAK} strokeWidth="6" strokeLinecap="round" />
        {/* Ink balls (2 leather pads on handles) */}
        <line x1={PRE_X2 + 28} y1={BED_Y - 8}  x2={PRE_X2 + 28} y2={BED_Y - 58}
          stroke={DOAK} strokeWidth="5" />
        <ellipse cx={PRE_X2 + 28} cy={BED_Y - 62} rx={14} ry={10}
          fill="#1a1208" />
        <line x1={PRE_X2 + 52} y1={BED_Y - 8}  x2={PRE_X2 + 52} y2={BED_Y - 58}
          stroke={DOAK} strokeWidth="5" />
        <ellipse cx={PRE_X2 + 52} cy={BED_Y - 62} rx={14} ry={10}
          fill="#1a1208" />
        {/* Ink pot */}
        <rect x={PRE_X2 + 20} y={BED_Y - 36} width={22} height={28} rx="4"
          fill="#1a0a02" stroke={IRON} strokeWidth="2" />
        <ellipse cx={PRE_X2 + 31} cy={BED_Y - 36} rx={11} ry={5}
          fill="#120802" stroke={IRON} strokeWidth="1.5" />

        {/* ── Pressman Figure ─────────────────────────────── */}
        {/* body */}
        <rect x={PM_X - 22} y={PM_SY} width={44} height={72} fill="#3a2a10" rx="8" />
        {/* apron */}
        <rect x={PM_X - 18} y={PM_SY + 18} width={36} height={54}
          fill="#2a1c08" rx="3" />
        {/* left arm bracing on cheek */}
        <line x1={PM_X - 22} y1={PM_SY + 12}
          x2={PRE_X2 - CHEEK_W - 4} y2={PM_SY + 44}
          stroke="#c89050" strokeWidth="11" strokeLinecap="round" />
        {/* right arm reaching for bar */}
        <line x1={PM_SX} y1={PM_SY + 8}
          x2={pmElX} y2={pmElY}
          stroke="#c89050" strokeWidth="11" strokeLinecap="round" />
        <line x1={pmElX} y1={pmElY}
          x2={pmWrX} y2={pmWrY}
          stroke="#c89050" strokeWidth="9" strokeLinecap="round" />
        {/* head */}
        <circle cx={PM_X} cy={PM_HY} r={22} fill="#d4a060" />
        {/* felt hat */}
        <rect x={PM_X - 22} y={PM_HY - 24} width={44} height={12}
          fill="#2a1c08" rx="2" />
        <rect x={PM_X - 18} y={PM_HY - 46} width={36} height={26}
          fill="#2a1c08" rx="3" />
        {/* legs */}
        <line x1={PM_X - 12} y1={PM_SY + 72}
          x2={PM_X - 12}     y2={PRE_YB - 10}
          stroke="#3a2a10" strokeWidth="14" strokeLinecap="round" />
        <line x1={PM_X + 8}  y1={PM_SY + 72}
          x2={PM_X + 8}      y2={PRE_YB - 10}
          stroke="#3a2a10" strokeWidth="14" strokeLinecap="round" />

        {/* ── Hanging broadsides (right) ───────────────────── */}
        {/* string line */}
        <line x1={1040} y1={64} x2={1370} y2={64}
          stroke={DOAK} strokeWidth="2" />
        {BSIDES.map(([bx, by, tilt]: BS3) => (
          <g key={bx}>
            {/* drape string */}
            <line x1={bx + 44} y1={64} x2={bx + 44} y2={by}
              stroke={DOAK} strokeWidth="1.5" />
            {broadsideLines(bx, by, tilt)}
          </g>
        ))}

        {/* Paper stack on shelf */}
        {Array.from({ length: 5 }, (_, i) => (
          <rect key={i}
            x={1052} y={388 - i * 3}
            width={110} height={44}
            fill={PAPYR}
            stroke="#c4a850" strokeWidth="0.8"
            opacity={1 - i * 0.06} />
        ))}
        <rect x={1042} y={434} width={130} height={10} fill={OAK} rx="2" />

        {/* Candle on type-case stand */}
        {(() => {
          const fl1 = Math.sin(phase * 0.18) * 3;
          const fl2 = Math.sin(phase * 0.29 + 1.1) * 2;
          const flH = 20 + fl1 + fl2;
          const candleX = TC_X1 + TC_W + 28;
          const candleY = TC_Y1 - 30;
          return (
            <>
              <ellipse cx={candleX} cy={candleY} rx={28 + fl1}
                ry={24 + fl2}
                fill="url(#ps-candle)" filter="url(#ps-glow)" />
              <path d={`M ${candleX - 5} ${candleY} `
                + `C ${candleX - 6 + fl1} ${candleY - flH * 0.6} `
                + `${candleX + 5 + fl2} ${candleY - flH * 0.7} `
                + `${candleX} ${candleY - flH}`}
                fill="#ffe090" />
              <path d={`M ${candleX - 3} ${candleY} `
                + `C ${candleX - 2 + fl2} ${candleY - flH * 0.5} `
                + `${candleX + 3 + fl1} ${candleY - flH * 0.55} `
                + `${candleX + 1} ${candleY - flH * 0.9}`}
                fill="#fff4c0" opacity="0.8" />
              <rect x={candleX - 6} y={candleY} width={12} height={38}
                fill="#e8e0c4" rx="2" />
            </>
          );
        })()}

        {/* ── Sign ─────────────────────────────────────────── */}
        <rect x={1040} y={390} width={116} height={44} rx="4"
          fill="#2a1a06" stroke="#a08030" strokeWidth="2" />
        <text x={1098} y={408} textAnchor="middle"
          fontFamily="Georgia, serif" fontSize="9"
          fill="#c8a030" letterSpacing="1">SHREWSBURY</text>
        <text x={1098} y={420} textAnchor="middle"
          fontFamily="Georgia, serif" fontSize="9"
          fill="#c8a030" letterSpacing="1">PRINTING OFFICE</text>
        <text x={1098} y={430} textAnchor="middle"
          fontFamily="Georgia, serif" fontSize="7"
          fill="#9a7820">EST. 1776</text>

        {/* ── Caption ──────────────────────────────────────── */}
        <text x={W / 2} y={492}
          textAnchor="middle"
          fontFamily="Georgia, 'Times New Roman', serif"
          fontSize="13" fill="#c8a050" letterSpacing="2.5">
          SHREWSBURY PRINTING OFFICE · COMMON PRESS · EST. 1776
        </text>
      </svg>
    </section>
  );
}
