"use client";
import { useEffect, useRef, useState } from "react";

const W = 1280, H = 520;
const GY = 462;
const CEIL = 54;

// Work barrel geometry
const BRL_CX  = 504;
const BRL_TOP = GY - 218; // 244
const BRL_BOT = GY - 22;  // 440
const BRL_MID = (BRL_TOP + BRL_BOT) / 2; // 342
const BRL_HW  = 82;  // head half-width
const BRL_BW  = 110; // bilge half-width

// Hoop y-fractions along barrel
const HOOP_TS = [0.06, 0.24, 0.50, 0.76, 0.94] as const;

// Cooper figure
const CP_X    = 662;
const CP_Y    = GY;
const CP_HIP  = CP_Y - 104; // 358
const CP_SH   = CP_Y - 196; // 266
const CP_HEAD = CP_Y - 230; // 232

// Mallet arm pivot (shoulder)
const MA_X = CP_X + 14;  // 676
const MA_Y = CP_SH + 24; // 290
const UA_LEN = 62, FA_LEN = 52;
const MHW = 28, MHH = 36; // mallet head dims

// Shaving horse
const SH_X1 = 58, SH_X2 = 292;
const SH_SEAT_Y = GY - 78; // 384
const SH_PIVOT_X = (SH_X1 + SH_X2) / 2; // 175
const SH_PIVOT_Y = SH_SEAT_Y - 22; // 362

// Stave on horse
const STAVE_X1 = SH_X1 + 18; // 76
const STAVE_X2 = SH_X2 - 18; // 274
const STAVE_Y  = SH_SEAT_Y - 14; // 370

// Bending fire
const BND_CX = 350, BND_Y = GY - 26; // 436

// Stave bundle
const BNDL_X = 104, BNDL_Y = GY - 8; // 454

// Finished barrels (lying on side): [cx, cy, scale]
type BK3 = [number, number, number];
const FIN_BARRELS: BK3[] = [
  [858, GY - 60, 0.74],
  [960, GY - 60, 0.80],
  [862, GY - 144, 0.64],
  [962, GY - 150, 0.68],
];

// Kegs on shelf (right)
const KEGS_XS = [1118, 1172, 1226] as const;
const KEG_SHF = GY - 96; // 366

// Tool rack on back wall
type TL2 = [number, number]; // x, angle°
const TOOLPEGS: TL2[] = [
  [792, -76],[818, -70],[844, -78],[870, -72],[896, -68],[922, -74],
];

// Ceiling beams
const BEAM_XS = [158, 344, 530, 726, 920, 1114] as const;

// Floor boards
const FLR_XS = [0, 108, 216, 324, 432, 540, 648, 756, 864, 972, 1080, 1188] as const;

// Window
const WIN_X1 = 764, WIN_X2 = 840, WIN_TOP = CEIL + 32, WIN_BOT = CEIL + 194;

// Barrel outline path — vertical barrel (bilge wider than heads)
function barrelPath(cx: number, top: number, bot: number, hw: number, bw: number): string {
  const ctrl = (bot - top) * 0.38;
  return (
    `M${cx - hw} ${top} ` +
    `C${cx - bw} ${top + ctrl} ${cx - bw} ${bot - ctrl} ${cx - hw} ${bot} ` +
    `L${cx + hw} ${bot} ` +
    `C${cx + bw} ${bot - ctrl} ${cx + bw} ${top + ctrl} ${cx + hw} ${top} Z`
  );
}

// Single stave line on vertical barrel
function stavePath(cx: number, top: number, bot: number, hw: number, bw: number, f: number): string {
  const ctrl = (bot - top) * 0.38;
  return (
    `M${cx + hw * f} ${top} ` +
    `C${cx + bw * f} ${top + ctrl} ${cx + bw * f} ${bot - ctrl} ${cx + hw * f} ${bot}`
  );
}

// Horizontal barrel (lying on side) outline
function hbarrelPath(cx: number, cy: number, hw: number, bw: number, len: number): string {
  const ctrl = len * 0.36;
  return (
    `M${cx - len / 2} ${cy - hw} ` +
    `C${cx - len / 2 + ctrl} ${cy - bw} ${cx + len / 2 - ctrl} ${cy - bw} ${cx + len / 2} ${cy - hw} ` +
    `L${cx + len / 2} ${cy + hw} ` +
    `C${cx + len / 2 - ctrl} ${cy + bw} ${cx - len / 2 + ctrl} ${cy + bw} ${cx - len / 2} ${cy + hw} Z`
  );
}

export function CooperShop() {
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

  // Mallet swing (fast down, slow raise)
  const cycle = (phase * 2.6) % (Math.PI * 2);
  const malletAng = -62 + Math.cos(cycle) * 54; // -116° to -8°
  const foreAng   = malletAng + 26 + Math.sin(cycle) * 20;
  const uaRad = (malletAng * Math.PI) / 180;
  const faRad = (foreAng   * Math.PI) / 180;
  const elbowX = MA_X + Math.cos(uaRad) * UA_LEN;
  const elbowY = MA_Y + Math.sin(uaRad) * UA_LEN;
  const wristX = elbowX + Math.cos(faRad) * FA_LEN;
  const wristY = elbowY + Math.sin(faRad) * FA_LEN;
  // Mallet head (attached at wrist, oriented perp to forearm)
  const mhX = wristX + Math.cos(faRad) * 10;
  const mhY = wristY + Math.sin(faRad) * 10;

  const onImpact = malletAng > -22; // near bottom of swing

  // Driving hoop descends slowly, resets
  const hoopY = BRL_TOP + 28 + ((phase * 4.8) % 54);

  // Hoop width at hoopY
  const hoopDist = Math.abs(hoopY - BRL_MID) / ((BRL_BOT - BRL_TOP) / 2);
  const hoopHW   = BRL_HW + (BRL_BW - BRL_HW) * (1 - hoopDist * hoopDist);

  // Chip sparks on impact (deterministic offsets)
  const chipT  = (phase * 2.6) % (Math.PI * 2);
  const chip1X = BRL_CX + BRL_BW + 8 + Math.cos(chipT * 2.1) * 10;
  const chip1Y = hoopY + Math.sin(chipT * 1.7) * 8;

  // Bending fire flicker
  const ffl1 = Math.sin(phase * 8.6)  * 5;
  const ffl2 = Math.sin(phase * 13.2 + 1.4) * 3;
  const ffH  = 14 + Math.sin(phase * 5.8) * 4;

  // Shaving arm draw stroke
  const shaveAng = Math.sin(phase * 1.1) * 14;

  return (
    <section aria-label="Colonial cooper's shop scene" style={{ background: "#f2e8cc" }}>
      <svg
        ref={ref}
        viewBox={`0 0 ${W} ${H}`}
        width="100%"
        style={{ display: "block", maxHeight: 520 }}
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="cs-wall" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#e8d8a8" />
            <stop offset="100%" stopColor="#d4c088" />
          </linearGradient>
          <linearGradient id="cs-floor" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#c8a440" />
            <stop offset="100%" stopColor="#a88228" />
          </linearGradient>
          <linearGradient id="cs-brl" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%"   stopColor="#7a4c10" />
            <stop offset="35%"  stopColor="#c8883a" />
            <stop offset="62%"  stopColor="#e8b060" />
            <stop offset="100%" stopColor="#8a5618" />
          </linearGradient>
          <linearGradient id="cs-brl2" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%"   stopColor="#6a3c08" />
            <stop offset="40%"  stopColor="#b87028" />
            <stop offset="60%"  stopColor="#d09040" />
            <stop offset="100%" stopColor="#7a4c10" />
          </linearGradient>
        </defs>

        {/* Wall */}
        <rect x="0" y="0" width={W} height={GY} fill="url(#cs-wall)" />
        {[0.22, 0.44, 0.66, 0.88].map((t, i) => (
          <line key={i} x1="0" y1={CEIL + t * (GY - CEIL)} x2={W} y2={CEIL + t * (GY - CEIL)}
            stroke="#c8a830" strokeWidth="0.8" opacity="0.15" />
        ))}

        {/* Ceiling */}
        <rect x="0" y="0" width={W} height={CEIL + 6} fill="#b89030" opacity="0.65" />
        <rect x="0" y={CEIL} width={W} height={6} fill="#9a7018" />
        {BEAM_XS.map((bx, i) => (
          <rect key={i} x={bx - 18} y={0} width={36} height={CEIL + 22} fill="#6a4810" rx="2" />
        ))}

        {/* Floor */}
        <rect x="0" y={GY} width={W} height={H - GY} fill="url(#cs-floor)" />
        {FLR_XS.map((fx, i) => (
          <line key={i} x1={fx} y1={GY} x2={fx} y2={H} stroke="#907028" strokeWidth="1.5" opacity="0.48" />
        ))}
        <rect x="0" y={GY} width={W} height={3} fill="#806018" />

        {/* Wood shavings on floor */}
        {[82, 148, 214, 318, 382, 428].map((sx, i) => (
          <ellipse key={i} cx={sx} cy={GY - 3} rx={12 + i} ry={3.5}
            fill="#c89840" opacity="0.32" />
        ))}

        {/* Window */}
        <rect x={WIN_X1} y={WIN_TOP} width={WIN_X2 - WIN_X1} height={WIN_BOT - WIN_TOP}
          fill="#c8e4f4" stroke="#7a5018" strokeWidth="3" rx="1" />
        <line x1={(WIN_X1 + WIN_X2) / 2} y1={WIN_TOP} x2={(WIN_X1 + WIN_X2) / 2} y2={WIN_BOT}
          stroke="#7a5018" strokeWidth="2" />
        <line x1={WIN_X1} y1={(WIN_TOP + WIN_BOT) / 2} x2={WIN_X2} y2={(WIN_TOP + WIN_BOT) / 2}
          stroke="#7a5018" strokeWidth="2" />
        <rect x={WIN_X1 - 6} y={WIN_BOT} width={WIN_X2 - WIN_X1 + 12} height={9}
          fill="#7a5018" rx="1" />

        {/* ══ SHAVING HORSE ════════════════════════════════════════════════════ */}
        {/* Bench top */}
        <rect x={SH_X1} y={SH_SEAT_Y} width={SH_X2 - SH_X1} height={16} fill="#8a5c18" rx="3" />
        {/* Legs (angled outward) */}
        {[SH_X1 + 22, SH_X1 + 68, SH_X2 - 68, SH_X2 - 22].map((lx, i) => {
          const lean = (i < 2 ? -1 : 1) * 9;
          return (
            <line key={i} x1={lx} y1={SH_SEAT_Y + 16} x2={lx + lean} y2={GY}
              stroke="#6a4010" strokeWidth="8" strokeLinecap="round" />
          );
        })}
        {/* Dumbhead post */}
        <rect x={SH_PIVOT_X - 6} y={SH_PIVOT_Y - 42} width={12} height={62}
          fill="#5a3808" rx="3" />
        {/* Foot-clamp arm (animated) */}
        <g transform={`rotate(${shaveAng}, ${SH_PIVOT_X}, ${SH_PIVOT_Y})`}>
          <rect x={SH_PIVOT_X - 4} y={SH_PIVOT_Y} width={8} height={54}
            fill="#4a2808" rx="2" />
          {/* Clamp jaw */}
          <rect x={SH_PIVOT_X - 18} y={SH_PIVOT_Y + 44} width={36} height={12}
            fill="#3a1e06" rx="3" />
        </g>
        {/* Stave clamped on horse */}
        <rect x={STAVE_X1} y={STAVE_Y - 7} width={STAVE_X2 - STAVE_X1} height={13}
          fill="#c89040" stroke="#8a5818" strokeWidth="1" rx="2" />

        {/* ── Shaver figure (seated) ── */}
        {/* Seated legs straddle bench */}
        <rect x={SH_PIVOT_X - 18} y={SH_SEAT_Y - 50} width={14} height={52}
          fill="#2a1808" rx="3" />
        <rect x={SH_PIVOT_X + 4}  y={SH_SEAT_Y - 50} width={14} height={52}
          fill="#2a1808" rx="3" />
        {/* Torso */}
        <rect x={SH_PIVOT_X - 15} y={SH_SEAT_Y - 116} width={30} height={70}
          fill="#3a2040" rx="4" />
        {/* Arms holding drawknife across stave */}
        <line x1={SH_PIVOT_X - 15} y1={SH_SEAT_Y - 92}
          x2={STAVE_X1 + 20} y2={STAVE_Y - 5}
          stroke="#3a2040" strokeWidth="9" strokeLinecap="round" />
        <line x1={SH_PIVOT_X + 15} y1={SH_SEAT_Y - 92}
          x2={STAVE_X2 - 24} y2={STAVE_Y - 5}
          stroke="#3a2040" strokeWidth="9" strokeLinecap="round" />
        {/* Drawknife blade between hands */}
        <line x1={STAVE_X1 + 22} y1={STAVE_Y - 7}
          x2={STAVE_X2 - 26} y2={STAVE_Y - 7}
          stroke="#7a7878" strokeWidth="5" strokeLinecap="round" />
        {/* Head */}
        <circle cx={SH_PIVOT_X} cy={SH_SEAT_Y - 134} r={18} fill="#c4885a" />
        {/* Broad-brim hat */}
        <rect x={SH_PIVOT_X - 13} y={SH_SEAT_Y - 162} width={26} height={22}
          fill="#2a1808" rx="3" />
        <rect x={SH_PIVOT_X - 28} y={SH_SEAT_Y - 142} width={56} height={8}
          fill="#1a1008" rx="2" />
        <circle cx={SH_PIVOT_X - 5} cy={SH_SEAT_Y - 132} r={2} fill="#5a2c10" />
        <circle cx={SH_PIVOT_X + 5} cy={SH_SEAT_Y - 132} r={2} fill="#5a2c10" />

        {/* Stave bundle leaning on wall */}
        {Array.from({ length: 9 }, (_, i) => (
          <rect key={i} x={BNDL_X + i * 5} y={BNDL_Y - 58 + i * 3} width={6} height={56 - i * 3}
            fill="#c89040" stroke="#8a5818" strokeWidth="0.5" rx="1" />
        ))}
        {/* Bundle iron hoop */}
        <rect x={BNDL_X - 2} y={BNDL_Y - 30} width={52} height={6}
          fill="#4a2808" rx="2" />

        {/* ══ BENDING FIRE ═════════════════════════════════════════════════════ */}
        {/* Fire bed */}
        <ellipse cx={BND_CX} cy={BND_Y} rx={30} ry={8} fill="#3a2006" />
        <ellipse cx={BND_CX} cy={BND_Y - 3} rx={22} ry={5} fill="#c84010" opacity="0.65" />
        {/* Flames */}
        <ellipse cx={BND_CX + ffl1} cy={BND_Y - 3 - ffH * 0.5}
          rx={12 + Math.abs(ffl2)} ry={ffH * 0.7}
          fill="#f87020" opacity="0.85" />
        <ellipse cx={BND_CX + ffl2} cy={BND_Y - 3 - ffH * 0.72}
          rx={7} ry={ffH * 0.48}
          fill="#ffc820" opacity="0.88" />
        {/* Stave arching over fire (being bent by heat) */}
        <path d={`M${BND_CX - 52} ${BND_Y - 26} Q${BND_CX} ${BND_Y - 46} ${BND_CX + 52} ${BND_Y - 26}`}
          fill="none" stroke="#c89040" strokeWidth="9" strokeLinecap="round" />
        {/* Iron ring holding stave cluster */}
        <ellipse cx={BND_CX} cy={BND_Y - 8} rx={34} ry={10}
          fill="none" stroke="#4a3008" strokeWidth="4" />

        {/* ══ WORK BARREL ══════════════════════════════════════════════════════ */}
        {/* Shadow */}
        <ellipse cx={BRL_CX} cy={GY - 2} rx={BRL_BW + 16} ry={13}
          fill="#8a5810" opacity="0.22" />

        {/* Barrel body */}
        <path d={barrelPath(BRL_CX, BRL_TOP, BRL_BOT, BRL_HW, BRL_BW)}
          fill="url(#cs-brl)" />

        {/* Stave lines */}
        {[-0.74, -0.5, -0.26, 0, 0.26, 0.5, 0.74].map((f, i) => (
          <path key={i}
            d={stavePath(BRL_CX, BRL_TOP, BRL_BOT, BRL_HW, BRL_BW, f)}
            fill="none" stroke="#8a5018" strokeWidth="1.5" opacity="0.42" />
        ))}

        {/* Static hoops */}
        {HOOP_TS.map((t, i) => {
          const hy = BRL_TOP + t * (BRL_BOT - BRL_TOP);
          const dist2 = Math.abs(hy - BRL_MID) / ((BRL_BOT - BRL_TOP) / 2);
          const hw2 = BRL_HW + (BRL_BW - BRL_HW) * (1 - dist2 * dist2);
          return (
            <ellipse key={i} cx={BRL_CX} cy={hy} rx={hw2} ry={hw2 * 0.22}
              fill="none" stroke="#3a2008" strokeWidth={i === 2 ? 4 : 3} />
          );
        })}

        {/* Top head */}
        <ellipse cx={BRL_CX} cy={BRL_TOP} rx={BRL_HW} ry={BRL_HW * 0.28}
          fill="#c88838" stroke="#7a4c10" strokeWidth="2" />

        {/* Driving hoop (animated descent) */}
        <ellipse cx={BRL_CX} cy={hoopY} rx={hoopHW + 4} ry={(hoopHW + 4) * 0.22}
          fill="none" stroke="#6a3808" strokeWidth="5" />
        {/* Hoop wedge markers (iron dogs) */}
        <rect x={BRL_CX + hoopHW - 2} y={hoopY - 6} width={8} height={12}
          fill="#3a2008" rx="1" />
        <rect x={BRL_CX - hoopHW - 6} y={hoopY - 6} width={8} height={12}
          fill="#3a2008" rx="1" />

        {/* Wood chip sparks on hoop impact */}
        {onImpact && (
          <>
            <circle cx={chip1X} cy={chip1Y} r={3} fill="#c89040" opacity="0.85" />
            <circle cx={chip1X + 8} cy={chip1Y - 5} r={2} fill="#e8c060" opacity="0.7" />
            <line x1={BRL_CX + hoopHW + 4} y1={hoopY}
              x2={BRL_CX + hoopHW + 16} y2={hoopY - 8}
              stroke="#c89040" strokeWidth="2" strokeLinecap="round" opacity="0.8" />
          </>
        )}

        {/* ══ COOPER FIGURE ════════════════════════════════════════════════════ */}
        {/* Legs */}
        <rect x={CP_X - 13} y={CP_HIP} width={11} height={GY - CP_HIP} fill="#2a1808" rx="3" />
        <rect x={CP_X + 2}  y={CP_HIP} width={11} height={GY - CP_HIP} fill="#2a1808" rx="3" />
        {/* Leather apron */}
        <path d={`M${CP_X - 20} ${CP_HIP - 4} L${CP_X - 24} ${GY - 4} L${CP_X + 24} ${GY - 4} L${CP_X + 20} ${CP_HIP - 4} Z`}
          fill="#7a4810" stroke="#5a3208" strokeWidth="1" />
        {/* Torso */}
        <rect x={CP_X - 18} y={CP_SH} width={36} height={CP_HIP - CP_SH + 12}
          fill="#383028" rx="4" />
        {/* Left arm — bracing barrel top */}
        <line x1={CP_X - 16} y1={CP_SH + 22}
          x2={BRL_CX + BRL_HW - 18} y2={BRL_TOP + 6}
          stroke="#383028" strokeWidth="11" strokeLinecap="round" />
        {/* Right arm — mallet (upper arm) */}
        <line x1={MA_X} y1={MA_Y} x2={elbowX} y2={elbowY}
          stroke="#383028" strokeWidth="11" strokeLinecap="round" />
        {/* Right arm — mallet (forearm) */}
        <line x1={elbowX} y1={elbowY} x2={wristX} y2={wristY}
          stroke="#383028" strokeWidth="9" strokeLinecap="round" />
        {/* Mallet head (rotated to forearm angle) */}
        <g transform={`rotate(${foreAng + 90}, ${mhX}, ${mhY})`}>
          <rect x={mhX - MHW / 2} y={mhY - MHH / 2} width={MHW} height={MHH}
            fill="#5a3808" rx="4" />
          <ellipse cx={mhX} cy={mhY - MHH / 2} rx={MHW / 2 - 2} ry={4} fill="#7a5020" />
          <ellipse cx={mhX} cy={mhY + MHH / 2} rx={MHW / 2 - 2} ry={4} fill="#7a5020" />
        </g>
        {/* Head */}
        <circle cx={CP_X} cy={CP_HEAD} r={20} fill="#c4905a" />
        {/* Cloth cap */}
        <path d={`M${CP_X - 20} ${CP_HEAD - 4} Q${CP_X} ${CP_HEAD - 32} ${CP_X + 20} ${CP_HEAD - 4}`}
          fill="#3a2828" />
        <ellipse cx={CP_X} cy={CP_HEAD - 4} rx={22} ry={6} fill="#2a1e1e" />
        {/* Face */}
        <circle cx={CP_X - 6} cy={CP_HEAD + 2} r={2.5} fill="#5a2c10" />
        <circle cx={CP_X + 6} cy={CP_HEAD + 2} r={2.5} fill="#5a2c10" />
        <path d={`M${CP_X - 5} ${CP_HEAD + 10} Q${CP_X} ${CP_HEAD + 14} ${CP_X + 5} ${CP_HEAD + 10}`}
          fill="none" stroke="#5a2c10" strokeWidth="1.5" />

        {/* ══ FINISHED BARRELS (lying on side) ═════════════════════════════════ */}
        {FIN_BARRELS.map(([bcx, bcy, sc], bi) => {
          const blen = 88 * sc;
          const bbw  = 52 * sc;
          const bhw  = 38 * sc;
          return (
            <g key={bi}>
              <path d={hbarrelPath(bcx, bcy, bhw, bbw, blen)} fill="url(#cs-brl2)" />
              {/* Stave lines */}
              {[-0.55, -0.18, 0.18, 0.55].map((f, si) => {
                const lx = bcx + f * blen * 0.5;
                return (
                  <line key={si} x1={lx} y1={bcy - bhw} x2={lx} y2={bcy + bhw}
                    stroke="#7a4010" strokeWidth="1" opacity="0.32" />
                );
              })}
              {/* Hoops */}
              {[0.18, 0.5, 0.82].map((t, hi) => {
                const hx = bcx - blen / 2 + t * blen;
                const dist3 = Math.abs(t - 0.5) * 2;
                const hw3 = bhw + (bbw - bhw) * (1 - dist3 * dist3);
                return (
                  <line key={hi} x1={hx} y1={bcy - hw3} x2={hx} y2={bcy + hw3}
                    stroke="#3a2008" strokeWidth="3" />
                );
              })}
              {/* End face ellipse */}
              <ellipse cx={bcx - blen / 2} cy={bcy} rx={bhw * 0.36} ry={bhw}
                fill="#c88838" stroke="#7a4c10" strokeWidth="1.5" />
              {/* Ground shadow */}
              <ellipse cx={bcx} cy={GY - 2} rx={blen / 2 + 4} ry={6}
                fill="#8a5010" opacity="0.18" />
            </g>
          );
        })}

        {/* ══ KEGS ON SHELF ════════════════════════════════════════════════════ */}
        {/* Shelf board */}
        <rect x={KEGS_XS[0] - 24} y={KEG_SHF} width={180} height={12}
          fill="#6a4010" rx="2" />
        {/* Shelf brackets */}
        {[KEGS_XS[0] - 22, KEGS_XS[2] + 22].map((bx, i) => (
          <path key={i} d={`M${bx} ${KEG_SHF} L${bx} ${KEG_SHF + 28} L${bx + (i === 0 ? 24 : -24)} ${KEG_SHF + 28}`}
            fill="none" stroke="#5a3008" strokeWidth="4" />
        ))}
        {KEGS_XS.map((kx, ki) => {
          const kh = 56, kbw = 22, khw = 16;
          const kt = KEG_SHF - kh;
          return (
            <g key={ki}>
              <path d={barrelPath(kx, kt, KEG_SHF, khw, kbw)} fill="url(#cs-brl)" />
              {[-0.55, 0, 0.55].map((f, si) => (
                <path key={si}
                  d={stavePath(kx, kt, KEG_SHF, khw, kbw, f)}
                  fill="none" stroke="#8a5018" strokeWidth="1" opacity="0.32" />
              ))}
              {[0.18, 0.5, 0.82].map((t, hi) => {
                const hy2 = kt + t * kh;
                const dist4 = Math.abs(hy2 - (kt + kh / 2)) / (kh / 2);
                const kw2 = khw + (kbw - khw) * (1 - dist4 * dist4);
                return (
                  <ellipse key={hi} cx={kx} cy={hy2} rx={kw2} ry={kw2 * 0.26}
                    fill="none" stroke="#3a2008" strokeWidth="2" />
                );
              })}
              <ellipse cx={kx} cy={kt} rx={khw} ry={khw * 0.32}
                fill="#c88838" stroke="#7a4c10" strokeWidth="1.5" />
            </g>
          );
        })}

        {/* Barrel heads leaning on back wall */}
        {[818, 860, 898].map((hx, i) => (
          <ellipse key={i} cx={hx} cy={GY - 46 - i * 6} rx={28 - i * 3} ry={9 - i}
            fill="#c88838" stroke="#7a4c10" strokeWidth="1.5"
            transform={`rotate(-9, ${hx}, ${GY - 46 - i * 6})`} />
        ))}

        {/* ══ TOOL RACK ════════════════════════════════════════════════════════ */}
        <rect x={780} y={CEIL + 70} width={230} height={7} fill="#6a4010" rx="2" />
        {TOOLPEGS.map(([tx, tang], ti) => {
          const tr = (tang * Math.PI) / 180;
          return (
            <g key={ti}>
              <circle cx={tx} cy={CEIL + 74} r={4} fill="#4a2808" />
              <line x1={tx} y1={CEIL + 74}
                x2={tx + Math.cos(tr) * 56} y2={CEIL + 74 + Math.sin(tr) * 56}
                stroke="#8a6830" strokeWidth="4" strokeLinecap="round" />
              <rect x={tx + Math.cos(tr) * 46 - 6} y={CEIL + 74 + Math.sin(tr) * 46 - 5}
                width={12} height={10} fill="#686060" rx="2" />
            </g>
          );
        })}

        {/* Truss hoop hanging on wall */}
        <ellipse cx={1086} cy={CEIL + 88} rx={38} ry={40}
          fill="none" stroke="#4a2808" strokeWidth="6" />
        <ellipse cx={1086} cy={CEIL + 88} rx={28} ry={30}
          fill="none" stroke="#6a3808" strokeWidth="3" opacity="0.5" />

        {/* Sign */}
        <rect x={54} y={CEIL + 14} width={246} height={40}
          fill="#3a2006" stroke="#c89030" strokeWidth="2" rx="3" />
        <text x={177} y={CEIL + 41} textAnchor="middle"
          fontFamily="Georgia, serif" fontSize="14" fontWeight="bold"
          fill="#c89030" letterSpacing="2">
          E. MORSE · COOPER
        </text>

        {/* Caption */}
        <text x={W / 2} y={H - 10} textAnchor="middle"
          fontFamily="Georgia, serif" fontSize="13" fill="#7a5018" letterSpacing="3" opacity="0.8">
          SHREWSBURY COOPERAGE · BARRELS &amp; CASKS · EST. 1771
        </text>
      </svg>
    </section>
  );
}
