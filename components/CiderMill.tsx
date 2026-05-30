"use client";
import React, { useEffect, useRef, useState } from "react";

const W = 1400, H = 520;

/* ── Mill geometry ───────────────────────────────────────── */
const POST_X   = 298, POST_Y1 = 142, POST_Y2 = 452;
const STONE_CX = 298, STONE_CY = 320;
const STONE_R  = 78;
const TROUGH_X1 = 144, TROUGH_X2 = 452;
const TROUGH_Y  = STONE_CY + STONE_R - 8;   // 390
const TROUGH_H  = 34;

/* ── Sweep arm ───────────────────────────────────────────── */
const SWEEP_PX  = POST_X;
const SWEEP_PY  = 278;
const SWEEP_LEN = 256;

/* ── Press geometry ──────────────────────────────────────── */
const PRE_X1 = 758, PRE_X2 = 1054;
const PRE_YT = 64,  PRE_YB = 452;
const CK_W   = 20;
const SCR_CX = (PRE_X1 + PRE_X2) / 2;   // 906
const SCR_TOP = PRE_YT + 12;             // 76
const PLAT_Y_UP = 144;
const PLAT_Y_DN = 308;
const PLAT_W = PRE_X2 - PRE_X1 - 60;    // 296
const PLAT_X1 = PRE_X1 + 30;            // 788
const PLAT_H  = 26;
const PACK_Y  = 332;
const BED_Y   = 390;

/* ── Press cycle ─────────────────────────────────────────── */
const PRESS_CYCLE = 258;

/* ── Cider drip ──────────────────────────────────────────── */
const DRIP_X     = SCR_CX;
const DRIP_CYCLE = 56;

/* ── Apple pile ──────────────────────────────────────────── */
const PILE_CX = 116, PILE_CY = 434;

/* ── Barrel data ─────────────────────────────────────────── */
type BK2 = [number, number]; // cx, top_y
const BARRELS: BK2[] = [
  [1152, 370],
  [1238, 354],
  [1324, 370],
];
const BRL_TW = 38, BRL_BW = 30, BRL_H = 78;

/* ── Palette ─────────────────────────────────────────────── */
const OAK   = "#8b5e20";
const DOAK  = "#4e2e0a";
const STONE  = "#8a8070";
const STONED = "#6a6050";
const HORSE_C = "#8a4210";
const HORSE_D = "#5e2a08";
const APPLE_R = "#d42c18";
const APPLE_G = "#6a8c14";
const APPLE_Y = "#d09018";

/* ── Stone grain marks (rotates with stoneRot) ───────────── */
function stoneGrains(sr: number): React.ReactNode {
  const marks: React.ReactNode[] = [];
  for (let g = 0; g < 14; g++) {
    const ang = sr + (g * Math.PI) / 7;
    const x1  = STONE_CX + Math.cos(ang) * 22;
    const y1  = STONE_CY + Math.sin(ang) * 22;
    const x2  = STONE_CX + Math.cos(ang) * (STONE_R - 10);
    const y2  = STONE_CY + Math.sin(ang) * (STONE_R - 10);
    marks.push(
      <line key={g} x1={x1} y1={y1} x2={x2} y2={y2}
        stroke={STONED} strokeWidth="2.5" strokeOpacity="0.45" />
    );
  }
  return <>{marks}</>;
}

/* ── Apple cluster ───────────────────────────────────────── */
function appleCluster(): React.ReactNode {
  const apples: React.ReactNode[] = [];
  for (let i = 0; i < 20; i++) {
    const ang = i * Math.PI * 2 / 20 + 0.26;
    const r   = 16 + (i % 4) * 10;
    const ax  = PILE_CX + Math.cos(ang) * r * 1.6;
    const ay  = PILE_CY + Math.sin(ang) * r * 0.52;
    const col = i % 3 === 0 ? APPLE_R : i % 3 === 1 ? APPLE_G : APPLE_Y;
    apples.push(
      <circle key={i} cx={ax} cy={ay} r={11} fill={col} />,
      <ellipse key={`sh${i}`} cx={ax - 2} cy={ay - 4}
        rx={3} ry={2} fill="#ffffff" opacity="0.22" />
    );
  }
  return <>{apples}</>;
}

/* ── Screw thread marks ──────────────────────────────────── */
function screwMarks(platY: number, off: number): React.ReactNode {
  const marks: React.ReactNode[] = [];
  const len = platY - SCR_TOP;
  for (let i = 0; i < 18; i++) {
    const y = SCR_TOP + (len * i) / 17;
    const x = SCR_CX + Math.sin(i * Math.PI * 0.88 + off) * 7;
    marks.push(
      <circle key={i} cx={x} cy={y} r={2} fill="#c8a040" opacity="0.9" />
    );
  }
  return <>{marks}</>;
}

/* ── Pomace packs in press ───────────────────────────────── */
function pomacePacks(): React.ReactNode {
  const packs: React.ReactNode[] = [];
  for (let p = 0; p < 5; p++) {
    const py = PACK_Y + p * 11;
    packs.push(
      <rect key={p}
        x={PLAT_X1 + 14} y={py}
        width={PLAT_W - 28} height={12}
        fill={p % 2 === 0 ? "#c8b87a" : "#b8a868"} rx="2" />,
      <line key={`l${p}`}
        x1={PLAT_X1 + 22} y1={py + 6}
        x2={PLAT_X1 + PLAT_W - 36} y2={py + 6}
        stroke="#8a7028" strokeWidth="1" strokeOpacity="0.6" />
    );
  }
  return <>{packs}</>;
}

/* ── Barrel path ─────────────────────────────────────────── */
function barrelPath(cx: number, ty: number): string {
  const by = ty + BRL_H;
  const mid = (ty + by) / 2;
  return `M ${cx - BRL_TW} ${ty} `
    + `C ${cx - BRL_TW - 8} ${ty + 20} ${cx - BRL_TW - 8} ${by - 20} ${cx - BRL_TW} ${by} `
    + `L ${cx + BRL_TW} ${by} `
    + `C ${cx + BRL_TW + 8} ${by - 20} ${cx + BRL_TW + 8} ${ty + 20} ${cx + BRL_TW} ${ty} Z`;
  void mid;
}

export function CiderMill() {
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
  const stoneRot  = (phase * 0.042) % (Math.PI * 2);
  const legPhase  = phase * 0.058;
  const screwOff  = (phase * 0.082) % (Math.PI * 2);
  const pressOsc  = Math.sin(phase * Math.PI * 2 / PRESS_CYCLE);
  const pressDown = Math.max(0, pressOsc);
  const platY     = PLAT_Y_UP + pressDown * (PLAT_Y_DN - PLAT_Y_UP);

  /* press bar */
  const barAng = (38 + pressDown * -68) * Math.PI / 180;
  const barTipX = SCR_CX + Math.cos(barAng) * 208;
  const barTipY = PRE_YT + 44 + Math.sin(barAng) * 208;

  /* sweep arm — very slow rotation */
  const sweepOsc = Math.sin(phase * 0.0055) * 0.16;
  const armEndX  = SWEEP_PX + Math.cos(sweepOsc) * SWEEP_LEN;
  const armEndY  = SWEEP_PY + Math.sin(sweepOsc) * SWEEP_LEN;

  /* horse body follows sweep arm end */
  const HX = armEndX + 30;
  const HY = armEndY + 56;

  /* horse legs (horse faces left, front = left side of horse) */
  const LEG1 = 32, LEG2 = 28;
  const mkLeg = (bx: number, by: number, uAng: number, lAng: number) => {
    const ur = uAng * Math.PI / 180;
    const lr = lAng * Math.PI / 180;
    const kx = bx + Math.cos(ur) * LEG1;
    const ky = by + Math.sin(ur) * LEG1;
    const hx = kx + Math.cos(lr) * LEG2;
    const hy = ky + Math.sin(lr) * LEG2;
    return { kx, ky, hx, hy };
  };

  const flSwing = Math.sin(legPhase) * 22;
  const frSwing = Math.sin(legPhase + Math.PI) * 22;
  const blSwing = Math.sin(legPhase + Math.PI) * 18;
  const brSwing = Math.sin(legPhase) * 18;

  const flL = mkLeg(HX - 36, HY + 22, -82 + flSwing, -78 + flSwing + 10);
  const frL = mkLeg(HX - 28, HY + 24, -82 + frSwing, -78 + frSwing + 10);
  const blL = mkLeg(HX + 32, HY + 22, -82 + blSwing, -76 + blSwing + 8);
  const brL = mkLeg(HX + 24, HY + 24, -82 + brSwing, -76 + brSwing + 8);

  /* pressman figure reaching bar */
  const PM_SX = PRE_X2 + 38, PM_SY = 276;
  const pmDx  = barTipX - PM_SX;
  const pmDy  = barTipY - (PM_SY + 6);
  const pmUAA = Math.atan2(pmDy, pmDx) * 180 / Math.PI - 18;
  const pmFAA = pmUAA + 36;
  const pmUR  = pmUAA * Math.PI / 180;
  const pmFR  = pmFAA * Math.PI / 180;
  const pmElX = PM_SX + Math.cos(pmUR) * 38;
  const pmElY = PM_SY + 6 + Math.sin(pmUR) * 38;
  const pmWrX = pmElX + Math.cos(pmFR) * 30;
  const pmWrY = pmElY + Math.sin(pmFR) * 30;

  /* cider drip */
  const dripT  = (phase % DRIP_CYCLE) / DRIP_CYCLE;
  const dripY  = BED_Y + 28 + dripT * 28;
  const showDrip = pressDown > 0.18;

  return (
    <section style={{ background: "#f0d890", padding: "2.5rem 0" }}>
      <svg
        ref={ref}
        viewBox={`0 0 ${W} ${H}`}
        style={{ width: "100%", height: "auto", display: "block" }}
        aria-label="Colonial cider mill with horse-powered grinding stone and screw press"
      >
        <defs>
          <linearGradient id="cm-wall" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#f0d080" />
            <stop offset="100%" stopColor="#d4a840" />
          </linearGradient>
          <radialGradient id="cm-stone" cx="45%" cy="45%" r="55%">
            <stop offset="0%" stopColor="#a09880" />
            <stop offset="100%" stopColor="#6a6252" />
          </radialGradient>
          <radialGradient id="cm-cider" cx="50%" cy="30%" r="60%">
            <stop offset="0%" stopColor="#d49020" />
            <stop offset="100%" stopColor="#8a5808" />
          </radialGradient>
          <filter id="cm-sd" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="2" dy="3" stdDeviation="4" floodOpacity="0.2" />
          </filter>
        </defs>

        {/* ── Background ──────────────────────────────────── */}
        <rect width={W} height={H} fill="url(#cm-wall)" />
        {/* Barn board siding */}
        {Array.from({ length: 8 }, (_, i) => (
          <rect key={i} x={0} y={i * 58} width={W} height={54}
            fill={i % 2 === 0 ? "transparent" : "#d8c07830"} />
        ))}
        {/* Floor / packed earth */}
        <rect x={0} y={452} width={W} height={H - 452} fill="#b08840" />
        {Array.from({ length: 10 }, (_, i) => (
          <line key={i} x1={i * 145} y1={452}
            x2={i * 145 + 100} y2={H}
            stroke="#9a7030" strokeWidth="1.5" />
        ))}
        {/* Autumn light slant from high window */}
        <rect x={820} y={0} width={160} height={180} rx="4"
          fill="#ffe8a0" opacity="0.25" />
        <rect x={820} y={0} width={160} height={180} rx="4"
          fill="none" stroke={OAK} strokeWidth="5" />
        <line x1={900} y1={0} x2={900} y2={180} stroke={OAK} strokeWidth="3" />
        <line x1={820} y1={90} x2={980} y2={90} stroke={OAK} strokeWidth="3" />

        {/* ── Apple pile ──────────────────────────────────── */}
        {appleCluster()}
        <text x={PILE_CX} y={460}
          textAnchor="middle" fontFamily="Georgia, serif"
          fontSize="9" fill={DOAK} letterSpacing="1">FRESHLY PRESSED</text>

        {/* ── Grinding stone mill ─────────────────────────── */}
        {/* Center post */}
        <rect x={POST_X - 10} y={POST_Y1} width={20} height={POST_Y2 - POST_Y1}
          fill={DOAK} filter="url(#cm-sd)" />
        <ellipse cx={POST_X} cy={POST_Y1} rx={12} ry={6} fill={OAK} />

        {/* Apple trough (stone/wooden base) */}
        <rect x={TROUGH_X1} y={TROUGH_Y}
          width={TROUGH_X2 - TROUGH_X1} height={TROUGH_H}
          fill="#9a7840" rx="3" />
        {/* Pomace in trough */}
        <rect x={TROUGH_X1 + 6} y={TROUGH_Y + 4}
          width={TROUGH_X2 - TROUGH_X1 - 12} height={TROUGH_H - 8}
          fill="#c8a050" rx="2" />
        {/* Crushed apple bits in trough */}
        {Array.from({ length: 14 }, (_, i) => (
          <circle key={i}
            cx={TROUGH_X1 + 16 + i * 22}
            cy={TROUGH_Y + 10 + (i % 3) * 5}
            r={5} fill={i % 2 === 0 ? "#d44020" : "#c89020"}
            opacity="0.7" />
        ))}

        {/* Grinding stone */}
        <circle cx={STONE_CX} cy={STONE_CY} r={STONE_R}
          fill="url(#cm-stone)" filter="url(#cm-sd)" />
        {/* Grain marks rotating */}
        {stoneGrains(stoneRot)}
        {/* Center hub */}
        <circle cx={STONE_CX} cy={STONE_CY} r={14} fill={DOAK} />
        <circle cx={STONE_CX} cy={STONE_CY} r={7}  fill={OAK} />
        {/* Stone axle to center post */}
        <line x1={STONE_CX} y1={STONE_CY}
          x2={POST_X} y2={STONE_CY}
          stroke={DOAK} strokeWidth="10" strokeLinecap="round" />
        {/* Stone rim banding */}
        <circle cx={STONE_CX} cy={STONE_CY} r={STONE_R}
          fill="none" stroke="#4a3a2a" strokeWidth="6" />
        <circle cx={STONE_CX} cy={STONE_CY} r={STONE_R - 14}
          fill="none" stroke="#6a5a48" strokeWidth="2" strokeOpacity="0.4" />

        {/* Cider runoff from trough into bucket */}
        <rect x={TROUGH_X1 - 6} y={TROUGH_Y + TROUGH_H - 4}
          width={20} height={6} fill={OAK} rx="1" />
        <path d={`M ${TROUGH_X1 - 4} ${TROUGH_Y + TROUGH_H + 2} `
          + `L ${TROUGH_X1 - 4} ${TROUGH_Y + TROUGH_H + 30}`}
          stroke="#c89020" strokeWidth="3" strokeOpacity="0.7" />
        {/* Bucket below */}
        <path d={`M ${TROUGH_X1 - 24} ${TROUGH_Y + TROUGH_H + 30} `
          + `L ${TROUGH_X1 + 18} ${TROUGH_Y + TROUGH_H + 30} `
          + `L ${TROUGH_X1 + 14} ${TROUGH_Y + TROUGH_H + 60} `
          + `L ${TROUGH_X1 - 20} ${TROUGH_Y + TROUGH_H + 60} Z`}
          fill={OAK} />
        <ellipse cx={TROUGH_X1 - 3} cy={TROUGH_Y + TROUGH_H + 30}
          rx={21} ry={7} fill={DOAK} />
        {/* Cider in bucket */}
        <ellipse cx={TROUGH_X1 - 3} cy={TROUGH_Y + TROUGH_H + 52}
          rx={14} ry={5} fill="url(#cm-cider)" />

        {/* Hopper above stone */}
        <path d={`M ${STONE_CX - 40} ${POST_Y1 + 60} `
          + `L ${STONE_CX + 40} ${POST_Y1 + 60} `
          + `L ${STONE_CX + 16} ${STONE_CY - STONE_R + 8} `
          + `L ${STONE_CX - 16} ${STONE_CY - STONE_R + 8} Z`}
          fill={OAK} />
        {/* Apples in hopper */}
        {Array.from({ length: 5 }, (_, i) => (
          <circle key={i}
            cx={STONE_CX - 18 + i * 10}
            cy={POST_Y1 + 78}
            r={9}
            fill={i % 2 === 0 ? APPLE_R : APPLE_G} />
        ))}

        {/* ── Sweep arm ───────────────────────────────────── */}
        <line x1={SWEEP_PX} y1={SWEEP_PY}
          x2={armEndX}    y2={armEndY}
          stroke={DOAK} strokeWidth="14" strokeLinecap="round" />
        <circle cx={SWEEP_PX} cy={SWEEP_PY} r={12} fill={OAK} />
        {/* Harness collar connection */}
        <circle cx={armEndX} cy={armEndY} r={8} fill={DOAK} />

        {/* ── Horse (facing left) ──────────────────────────── */}
        {/* Tail */}
        <path d={`M ${HX + 58} ${HY - 10} `
          + `C ${HX + 76} ${HY + 10} ${HX + 90} ${HY + 40} ${HX + 80} ${HY + 64}`}
          fill="none" stroke={HORSE_D} strokeWidth="8" strokeLinecap="round" />
        {/* Back legs (behind body — draw first) */}
        <line x1={HX + 32} y1={HY + 22} x2={blL.kx} y2={blL.ky}
          stroke={HORSE_D} strokeWidth="9" strokeLinecap="round" />
        <line x1={blL.kx} y1={blL.ky} x2={blL.hx} y2={blL.hy}
          stroke={HORSE_D} strokeWidth="7" strokeLinecap="round" />
        <line x1={HX + 24} y1={HY + 24} x2={brL.kx} y2={brL.ky}
          stroke={HORSE_D} strokeWidth="7" strokeLinecap="round" />
        <line x1={brL.kx} y1={brL.ky} x2={brL.hx} y2={brL.hy}
          stroke={HORSE_D} strokeWidth="6" strokeLinecap="round" />
        {/* Body */}
        <ellipse cx={HX} cy={HY} rx={62} ry={26} fill={HORSE_C}
          filter="url(#cm-sd)" />
        {/* Belly shading */}
        <ellipse cx={HX} cy={HY + 14} rx={42} ry={10}
          fill={HORSE_D} opacity="0.35" />
        {/* Neck */}
        <path d={`M ${HX - 46} ${HY - 14} `
          + `C ${HX - 52} ${HY - 48} ${HX - 38} ${HY - 62} ${HX - 28} ${HY - 72}`}
          fill="none" stroke={HORSE_C} strokeWidth="28"
          strokeLinecap="round" />
        {/* Mane */}
        <path d={`M ${HX - 46} ${HY - 18} `
          + `C ${HX - 52} ${HY - 52} ${HX - 38} ${HY - 66} ${HX - 28} ${HY - 76}`}
          fill="none" stroke={HORSE_D} strokeWidth="10"
          strokeLinecap="round" />
        {/* Head */}
        <ellipse cx={HX - 38} cy={HY - 78} rx={22} ry={14}
          fill={HORSE_C} transform={`rotate(-30, ${HX - 38}, ${HY - 78})`} />
        {/* Eye */}
        <circle cx={HX - 30} cy={HY - 84} r={3} fill="#1a0a04" />
        {/* Nostril */}
        <ellipse cx={HX - 54} cy={HY - 72} rx={4} ry={3}
          fill={HORSE_D} />
        {/* Ear */}
        <path d={`M ${HX - 22} ${HY - 90} L ${HX - 14} ${HY - 102} L ${HX - 10} ${HY - 88}`}
          fill={HORSE_C} stroke={HORSE_D} strokeWidth="1" />
        {/* Collar/harness */}
        <ellipse cx={HX - 42} cy={HY - 22} rx={12} ry={8}
          fill="none" stroke="#c8a040" strokeWidth="5" />
        {/* Trace line to sweep arm */}
        <line x1={HX - 42} y1={HY - 18}
          x2={armEndX}    y2={armEndY + 4}
          stroke="#c8a040" strokeWidth="3" strokeDasharray="6 3" />
        {/* Front legs (near side — draw last, in front) */}
        <line x1={HX - 36} y1={HY + 22} x2={flL.kx} y2={flL.ky}
          stroke={HORSE_C} strokeWidth="9" strokeLinecap="round" />
        <line x1={flL.kx} y1={flL.ky} x2={flL.hx} y2={flL.hy}
          stroke={HORSE_C} strokeWidth="7" strokeLinecap="round" />
        <line x1={HX - 26} y1={HY + 24} x2={frL.kx} y2={frL.ky}
          stroke={HORSE_C} strokeWidth="7" strokeLinecap="round" />
        <line x1={frL.kx} y1={frL.ky} x2={frL.hx} y2={frL.hy}
          stroke={HORSE_C} strokeWidth="6" strokeLinecap="round" />

        {/* ── CIDER PRESS ────────────────────────────────── */}
        {/* Bed / coffin */}
        <rect x={PLAT_X1 - 18} y={BED_Y} width={PLAT_W + 36} height={44}
          fill={OAK} rx="3" />
        <rect x={PLAT_X1 - 10} y={BED_Y + 6} width={PLAT_W + 20} height={32}
          fill={DOAK} rx="2" />
        {/* Pomace packs */}
        {pomacePacks()}
        {/* Cider seeping from packs */}
        {Array.from({ length: 5 }, (_, i) => (
          <ellipse key={i}
            cx={PLAT_X1 + 40 + i * 44} cy={BED_Y + 2}
            rx={4} ry={3}
            fill="#c89020" opacity={pressDown * 0.7} />
        ))}
        {/* Cider drip stream */}
        {showDrip && (
          <ellipse cx={DRIP_X} cy={dripY}
            rx={3} ry={5}
            fill="#c89820" opacity="0.75" />
        )}
        {/* Cider bucket under press */}
        <path d={`M ${SCR_CX - 30} ${BED_Y + 44} `
          + `L ${SCR_CX + 30} ${BED_Y + 44} `
          + `L ${SCR_CX + 26} ${BED_Y + 82} `
          + `L ${SCR_CX - 26} ${BED_Y + 82} Z`}
          fill={OAK} />
        <ellipse cx={SCR_CX} cy={BED_Y + 44} rx={30} ry={9} fill={DOAK} />
        <ellipse cx={SCR_CX} cy={BED_Y + 74} rx={22} ry={7}
          fill="url(#cm-cider)" opacity={0.5 + pressDown * 0.4} />

        {/* Left cheek */}
        <rect x={PRE_X1} y={PRE_YT} width={CK_W} height={PRE_YB - PRE_YT}
          fill={OAK} filter="url(#cm-sd)" />
        {/* Right cheek */}
        <rect x={PRE_X2 - CK_W} y={PRE_YT} width={CK_W} height={PRE_YB - PRE_YT}
          fill={OAK} filter="url(#cm-sd)" />
        {/* Cap beam */}
        <rect x={PRE_X1} y={PRE_YT} width={PRE_X2 - PRE_X1} height={14} fill={DOAK} />
        {/* Sill */}
        <rect x={PRE_X1} y={PRE_YB - 14} width={PRE_X2 - PRE_X1} height={14} fill={DOAK} />

        {/* Screw body */}
        <rect x={SCR_CX - 11} y={SCR_TOP} width={22}
          height={platY - SCR_TOP} fill="#8a6028" />
        {screwMarks(platY, screwOff)}

        {/* Platen */}
        <rect x={PLAT_X1} y={platY} width={PLAT_W} height={PLAT_H}
          fill={DOAK} rx="3" />
        <rect x={SCR_CX - 28} y={platY - 8} width={56} height={16}
          fill={OAK} rx="4" />

        {/* Bar */}
        <line x1={SCR_CX - 208} y1={PRE_YT + 44 - Math.sin(barAng) * 208}
          x2={SCR_CX + 208}    y2={PRE_YT + 44 + Math.sin(barAng) * 208}
          stroke={OAK} strokeWidth="12" strokeLinecap="round" />
        <circle cx={barTipX} cy={barTipY} r={10} fill={DOAK} />
        <circle cx={SCR_CX}  cy={PRE_YT + 44} r={13} fill={DOAK} />

        {/* ── Press worker figure ─────────────────────────── */}
        <rect x={PM_SX - 22} y={PM_SY}      width={44} height={70}
          fill="#4a3818" rx="8" />
        <rect x={PM_SX - 16} y={PM_SY + 20} width={32} height={50}
          fill="#c8a040" opacity="0.3" rx="3" />
        {/* left arm bracing */}
        <line x1={PM_SX - 22} y1={PM_SY + 12}
          x2={PRE_X2 - CK_W}   y2={PM_SY + 40}
          stroke="#c89050" strokeWidth="11" strokeLinecap="round" />
        {/* right arm to bar */}
        <line x1={PM_SX} y1={PM_SY + 6}
          x2={pmElX}     y2={pmElY}
          stroke="#c89050" strokeWidth="11" strokeLinecap="round" />
        <line x1={pmElX} y1={pmElY}
          x2={pmWrX}     y2={pmWrY}
          stroke="#c89050" strokeWidth="9" strokeLinecap="round" />
        {/* head */}
        <circle cx={PM_SX} cy={PM_SY - 18} r={22} fill="#d4a060" />
        <rect x={PM_SX - 22} y={PM_SY - 40} width={44} height={12}
          fill="#3a2810" rx="2" />
        <rect x={PM_SX - 18} y={PM_SY - 62} width={36} height={26}
          fill="#3a2810" rx="3" />
        {/* legs */}
        <line x1={PM_SX - 10} y1={PM_SY + 70}
          x2={PM_SX - 10}     y2={PRE_YB - 6}
          stroke="#4a3818" strokeWidth="14" strokeLinecap="round" />
        <line x1={PM_SX + 8}  y1={PM_SY + 70}
          x2={PM_SX + 8}      y2={PRE_YB - 6}
          stroke="#4a3818" strokeWidth="14" strokeLinecap="round" />

        {/* ── Cider barrels (right) ────────────────────────── */}
        {BARRELS.map(([bcx, bty]: BK2) => (
          <g key={bcx}>
            <path d={barrelPath(bcx, bty)} fill={OAK} />
            {/* Stave lines */}
            {Array.from({ length: 5 }, (_, s) => {
              const bby = bty + BRL_H;
              const t   = (s + 1) / 6;
              const tx  = bcx - BRL_TW + t * BRL_TW * 2;
              const bx2 = bcx - BRL_BW + t * BRL_BW * 2;
              return (
                <line key={s} x1={tx} y1={bty} x2={bx2} y2={bby}
                  stroke={DOAK} strokeWidth="1.2" strokeOpacity="0.4" />
              );
            })}
            {/* Hoops */}
            {[0.14, 0.5, 0.86].map((ht, hi) => {
              const hy  = bty + ht * BRL_H;
              const hhw = BRL_BW + (BRL_TW - BRL_BW) * (1 - ht);
              return <ellipse key={hi} cx={bcx} cy={hy} rx={hhw} ry={6}
                fill="none" stroke="#3a3a42" strokeWidth="5" />;
            })}
            {/* Cider label */}
            <rect x={bcx - 22} y={bty + BRL_H / 2 - 10}
              width={44} height={20} rx="3"
              fill="#f0e8c8" stroke="#c8a028" strokeWidth="1" />
            <text x={bcx} y={bty + BRL_H / 2 + 3}
              textAnchor="middle" fontFamily="Georgia, serif"
              fontSize="7" fill={DOAK} letterSpacing="0.5">CIDER</text>
          </g>
        ))}

        {/* ── Sign ─────────────────────────────────────────── */}
        <rect x={582} y={66} width={236} height={38} rx="4"
          fill="#f0e4c0" stroke={OAK} strokeWidth="3" />
        <text x={700} y={82} textAnchor="middle"
          fontFamily="Georgia, serif" fontSize="10"
          fill={DOAK} letterSpacing="2">SHREWSBURY CIDER MILL</text>
        <text x={700} y={97} textAnchor="middle"
          fontFamily="Georgia, serif" fontSize="8"
          fill="#7a5018" letterSpacing="1">ESTABLISHED 1789</text>

        {/* ── Caption ──────────────────────────────────────── */}
        <text x={W / 2} y={494}
          textAnchor="middle"
          fontFamily="Georgia, 'Times New Roman', serif"
          fontSize="13" fill={DOAK} letterSpacing="2.5">
          SHREWSBURY CIDER MILL · HORSE-POWERED STONE PRESS · EST. 1789
        </text>
      </svg>
    </section>
  );
}
