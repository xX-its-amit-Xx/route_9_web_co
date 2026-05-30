"use client";
import { useEffect, useRef, useState } from "react";

const W = 1280, H = 520;
const GY = 462;
const CEIL = 58;

// Press beam geometry
const PRS_X1 = 88, PRS_X2 = 362;
const PRS_MID = (PRS_X1 + PRS_X2) / 2; // 225
const PRS_POST_W = 22;
const PRS_LEFT_X = PRS_X1 + PRS_POST_W / 2;  // 99
const PRS_RIGHT_X = PRS_X2 - PRS_POST_W / 2; // 351
const PRS_POST_BOT = GY - 14; // 448
const PRS_TOP_BEAM_Y = GY - 320; // 142
const PRS_BEAM_H = 22;
const SCREW_CX = PRS_MID; // 225
const SCREW_TOP = PRS_TOP_BEAM_Y + PRS_BEAM_H; // 164
const SCREW_BOT_REST = GY - 148; // 314
const SCREW_AMP = 22; // screw descends with press beam
const MOLD_CX = PRS_MID;
const MOLD_TOP_REST = GY - 138; // 324
const MOLD_H = 48, MOLD_W = 136;
const MOLD_BOT = GY - 46; // 416  (cheese form bottom)
const PRESS_BEAM_W = PRS_X2 - PRS_X1; // 274

// Cheese vat
const VAT_X1 = 440, VAT_X2 = 810;
const VAT_TOP = GY - 148; // 314
const VAT_BOT = GY - 28; // 434
const VAT_MID_X = (VAT_X1 + VAT_X2) / 2; // 625
const PADDLE_W = 18, PADDLE_H = 88;

// Aging shelf
const SHF_X1 = 880, SHF_X2 = 1240;
const SHF_YS = [GY - 298, GY - 218, GY - 138, GY - 58] as const;
const SHF_DEPTH = 14;

type WH3 = [number, number, number]; // wheel of cheese: cx, shelfRow, variety
const WHEELS: WH3[] = [
  [916,  0, 0],[974,  0, 1],[1038, 0, 2],[1104, 0, 0],[1168, 0, 1],[1218, 0, 3],
  [916,  1, 2],[974,  1, 0],[1038, 1, 1],[1104, 1, 3],[1168, 1, 2],[1218, 1, 0],
  [916,  2, 1],[974,  2, 3],[1038, 2, 0],[1104, 2, 2],[1168, 2, 1],[1218, 2, 3],
  [916,  3, 0],[974,  3, 2],[1038, 3, 1],[1104, 3, 0],[1168, 3, 3],[1218, 3, 2],
];
// 0=cheddar #d4a038, 1=gouda #c88e28, 2=waxed-red #b82818, 3=blue-veined #e8d4a8
const WCOLS = ["#d4a038","#c88e28","#b82818","#e8d4a8"] as const;
const WRIND = ["#8a6010","#7a5808","#881010","#c4b488"] as const;

// Milk cans left of press
type CAN2 = [number, number]; // cx, height
const CANS: CAN2[] = [[38, 72],[62, 84],[44, 68]];

// Cloths on line
type CLO3 = [number, number, number]; // x, y, width
const CLOTHS: CLO3[] = [[480,CEIL+44,148],[648,CEIL+36,112],[764,CEIL+52,136]];

// Ceiling beams
const BEAMS_X = [160, 400, 640, 880, 1120] as const;

// Window
const WIN_X1 = 526, WIN_X2 = 714, WIN_TOP = CEIL + 38, WIN_BOT = CEIL + 178;

// Floor boards
const BOARD_XS = [0,128,256,384,512,640,768,896,1024,1152] as const;

// Butter churn near left wall
const CHN_CX = 786, CHN_X1 = 754, CHN_X2 = 818;
const CHN_TOP = GY - 172, CHN_BOT = GY - 28;
const CHN_DASHER_TOP = GY - 236;

// Cheesemonger figure
const CM_X = 580, CM_Y = GY - 2;
const CM_HIP = CM_Y - 110, CM_SH = CM_Y - 196, CM_HEAD = CM_Y - 232;

export function CheesePress() {
  const ref = useRef<SVGSVGElement>(null);
  const [vis, setVis] = useState(false);
  const [phase, setPhase] = useState(0);
  const rafRef = useRef<ReturnType<typeof setInterval> | null>(null);

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

  // Animated press beam descends slowly (screw turning)
  const screwRot = (phase * 28) % 360;
  const pressDescend = Math.sin(phase * 0.18) * SCREW_AMP; // -22 to +22
  const beamY = PRS_TOP_BEAM_Y + PRS_BEAM_H + 32 + pressDescend; // press follower beam Y
  const screwLen = beamY - SCREW_TOP;

  // Vat paddle stir
  const paddleAng = Math.sin(phase * 0.82) * 28; // -28 to +28 deg
  const paddleTopX = VAT_MID_X + Math.sin((paddleAng * Math.PI) / 180) * 12;

  // Dasher bob (churn)
  const dasherY = CHN_DASHER_TOP + Math.sin(phase * 2.1) * 18;

  // Cheesemonger torso lean (stirring motion)
  const torsoLean = Math.sin(phase * 0.82) * 8;

  // Cloth drape wave
  const clothWave = Math.sin(phase * 1.1) * 4;

  // Mold and whey drip
  const moldY = MOLD_TOP_REST + pressDescend * 0.5;
  const drip1Y = moldY + MOLD_H + 8 + ((phase * 18) % 38);
  const drip2Y = moldY + MOLD_H + 4 + ((phase * 14 + 2) % 42);

  return (
    <section aria-label="Colonial dairy and cheese press scene" style={{ background: "#fdf6e8" }}>
      <svg
        ref={ref}
        viewBox={`0 0 ${W} ${H}`}
        width="100%"
        style={{ display: "block", maxHeight: 520 }}
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="cp-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f0e6c8" />
            <stop offset="100%" stopColor="#e8d4a0" />
          </linearGradient>
          <linearGradient id="cp-floor" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#c8a850" />
            <stop offset="100%" stopColor="#a88430" />
          </linearGradient>
          <linearGradient id="cp-vat" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#d4b870" />
            <stop offset="100%" stopColor="#b89448" />
          </linearGradient>
          <linearGradient id="cp-curd" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f8f0d4" />
            <stop offset="100%" stopColor="#f0e4b8" />
          </linearGradient>
          <radialGradient id="cp-win-light" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fff8e8" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#f0d898" stopOpacity="0" />
          </radialGradient>
          <clipPath id="cp-vat-clip">
            <rect x={VAT_X1} y={VAT_TOP} width={VAT_X2 - VAT_X1} height={VAT_BOT - VAT_TOP} rx="4" />
          </clipPath>
        </defs>

        {/* Background wall */}
        <rect x="0" y="0" width={W} height={GY} fill="url(#cp-sky)" />

        {/* Wainscot / plaster wall texture bands */}
        <rect x="0" y={CEIL + 8} width={W} height={14} fill="#dcc880" opacity="0.35" />
        {[0.15,0.3,0.45,0.6,0.75,0.9].map((t, i) => (
          <line key={i} x1="0" y1={CEIL + 8 + t * (GY - CEIL - 8)} x2={W} y2={CEIL + 8 + t * (GY - CEIL - 8)}
            stroke="#d4b858" strokeWidth="0.5" opacity="0.18" />
        ))}

        {/* Ceiling */}
        <rect x="0" y="0" width={W} height={CEIL + 8} fill="#c8a840" />
        <rect x="0" y={CEIL} width={W} height={8} fill="#b89030" />

        {/* Ceiling beams */}
        {BEAMS_X.map((bx, i) => (
          <rect key={i} x={bx - 18} y={0} width={36} height={CEIL + 24}
            fill="#8a6820" rx="2" />
        ))}

        {/* Floor */}
        <rect x="0" y={GY} width={W} height={H - GY} fill="url(#cp-floor)" />
        {BOARD_XS.map((bx, i) => (
          <line key={i} x1={bx} y1={GY} x2={bx} y2={H} stroke="#907028" strokeWidth="1.5" opacity="0.5" />
        ))}
        <rect x="0" y={GY} width={W} height={4} fill="#806018" />

        {/* Window light spill */}
        <ellipse cx={(WIN_X1 + WIN_X2) / 2} cy={(WIN_TOP + WIN_BOT) / 2 + 40}
          rx="180" ry="200" fill="url(#cp-win-light)" />

        {/* Window */}
        <rect x={WIN_X1} y={WIN_TOP} width={WIN_X2 - WIN_X1} height={WIN_BOT - WIN_TOP}
          fill="#d4ecf8" stroke="#8a6820" strokeWidth="3" rx="2" />
        <line x1={(WIN_X1 + WIN_X2) / 2} y1={WIN_TOP} x2={(WIN_X1 + WIN_X2) / 2} y2={WIN_BOT}
          stroke="#8a6820" strokeWidth="2.5" />
        <line x1={WIN_X1} y1={(WIN_TOP + WIN_BOT) / 2} x2={WIN_X2} y2={(WIN_TOP + WIN_BOT) / 2}
          stroke="#8a6820" strokeWidth="2.5" />
        {/* Window sill */}
        <rect x={WIN_X1 - 8} y={WIN_BOT} width={WIN_X2 - WIN_X1 + 16} height={10}
          fill="#8a6820" rx="1" />

        {/* Cloths drying on line (ceiling to wall pegs) */}
        <line x1={PRS_X2 + 40} y1={CEIL + 10} x2={VAT_X2 - 20} y2={CEIL + 10}
          stroke="#7a5818" strokeWidth="1.5" />
        {CLOTHS.map(([cx, cy, cw], i) => {
          const sag = clothWave + 8 + i * 3;
          return (
            <path key={i}
              d={`M${cx} ${cy} Q${cx + cw * 0.5} ${cy + sag} ${cx + cw} ${cy}`}
              fill="none" stroke="#f8f0d8" strokeWidth={12 - i * 2} strokeLinecap="round"
              opacity="0.82" />
          );
        })}

        {/* === CHEESE PRESS (left section) === */}
        {/* Left post */}
        <rect x={PRS_X1} y={PRS_POST_BOT - 360} width={PRS_POST_W} height={360}
          fill="#6a4810" rx="2" />
        {/* Right post */}
        <rect x={PRS_X2 - PRS_POST_W} y={PRS_POST_BOT - 360} width={PRS_POST_W} height={360}
          fill="#6a4810" rx="2" />
        {/* Cross-brace at bottom of posts */}
        <rect x={PRS_X1} y={PRS_POST_BOT - 42} width={PRESS_BEAM_W} height={16}
          fill="#8a6028" rx="2" />
        {/* Top beam */}
        <rect x={PRS_X1 - 8} y={PRS_TOP_BEAM_Y} width={PRESS_BEAM_W + 16} height={PRS_BEAM_H}
          fill="#5a3808" rx="3" />
        {/* Screw shaft */}
        {(() => {
          const segs: React.ReactNode[] = [];
          const segH = 12;
          const n = Math.floor(screwLen / segH);
          for (let i = 0; i < n; i++) {
            const sy = SCREW_TOP + i * segH;
            const shade = i % 2 === 0 ? "#c89840" : "#a87828";
            segs.push(
              <rect key={i} x={SCREW_CX - 9} y={sy} width={18} height={segH}
                fill={shade} />
            );
          }
          return segs;
        })()}
        {/* Screw handle crossbar (rotates) */}
        <g transform={`rotate(${screwRot}, ${SCREW_CX}, ${SCREW_TOP + 14})`}>
          <rect x={SCREW_CX - 52} y={SCREW_TOP + 8} width={104} height={12}
            fill="#5a3808" rx="4" />
          <circle cx={SCREW_CX - 52} cy={SCREW_TOP + 14} r={7} fill="#4a2808" />
          <circle cx={SCREW_CX + 52} cy={SCREW_TOP + 14} r={7} fill="#4a2808" />
        </g>
        {/* Follower beam (descends with screw) */}
        <rect x={PRS_X1 + 8} y={beamY} width={PRESS_BEAM_W - 16} height={18}
          fill="#7a5020" rx="2" />
        {/* Follower piston connecting screw to beam */}
        <rect x={SCREW_CX - 7} y={SCREW_TOP + screwLen - 8} width={14} height={beamY - (SCREW_TOP + screwLen - 8) + 18}
          fill="#a87828" />

        {/* Cheese mold (wooden hoop) */}
        <rect x={MOLD_CX - MOLD_W / 2} y={moldY} width={MOLD_W} height={MOLD_H}
          fill="#c89840" stroke="#8a5818" strokeWidth="3" rx="4" />
        {/* Hoop bands */}
        <rect x={MOLD_CX - MOLD_W / 2 - 4} y={moldY + 8} width={MOLD_W + 8} height={6}
          fill="#6a3808" rx="2" />
        <rect x={MOLD_CX - MOLD_W / 2 - 4} y={moldY + MOLD_H - 14} width={MOLD_W + 8} height={6}
          fill="#6a3808" rx="2" />
        {/* Cheese curds inside mold (top view hint) */}
        <ellipse cx={MOLD_CX} cy={moldY + 4} rx={MOLD_W / 2 - 8} ry={10}
          fill="url(#cp-curd)" />
        {/* Cheesecloth wrapping */}
        <path d={`M${MOLD_CX - MOLD_W/2 - 4} ${moldY + 2} Q${MOLD_CX} ${moldY - 10} ${MOLD_CX + MOLD_W/2 + 4} ${moldY + 2}`}
          fill="none" stroke="#f4ecd4" strokeWidth="4" strokeLinecap="round" />

        {/* Draining table under mold */}
        <rect x={PRS_X1 - 14} y={MOLD_BOT + 2} width={PRESS_BEAM_W + 28} height={14}
          fill="#7a5820" rx="2" />
        {/* Drip tray */}
        <path d={`M${PRS_X1 - 14} ${MOLD_BOT + 16} L${PRS_X1 - 22} ${MOLD_BOT + 38} L${PRS_X2 + 22} ${MOLD_BOT + 38} L${PRS_X2 + 14} ${MOLD_BOT + 16} Z`}
          fill="#d4b060" stroke="#8a5818" strokeWidth="2" />
        {/* Whey drips */}
        <ellipse cx={MOLD_CX - 18} cy={drip1Y}
          rx={2.5} ry={Math.min(5, ((phase * 18) % 38) * 0.18 + 2)}
          fill="#e8d898" opacity="0.9" />
        <ellipse cx={MOLD_CX + 14} cy={drip2Y}
          rx={2} ry={Math.min(4, ((phase * 14 + 2) % 42) * 0.15 + 2)}
          fill="#e8d898" opacity="0.85" />

        {/* Milk cans */}
        {CANS.map(([cx, canH], i) => (
          <g key={i}>
            <rect x={cx - 13} y={GY - canH} width={26} height={canH}
              fill="#d4d0c0" stroke="#a8a498" strokeWidth="1.5" rx="3" />
            {/* Lid */}
            <ellipse cx={cx} cy={GY - canH} rx={14} ry={5} fill="#c8c4b4" stroke="#a8a498" strokeWidth="1.5" />
            {/* Handle */}
            <path d={`M${cx - 8} ${GY - canH + 4} Q${cx} ${GY - canH - 10} ${cx + 8} ${GY - canH + 4}`}
              fill="none" stroke="#888880" strokeWidth="2" />
            {/* Band */}
            <rect x={cx - 13} y={GY - canH + canH * 0.4} width={26} height={5}
              fill="#b8b4a4" />
          </g>
        ))}

        {/* === CHEESE VAT === */}
        {/* Vat outer */}
        <rect x={VAT_X1 - 8} y={VAT_TOP - 14} width={VAT_X2 - VAT_X1 + 16} height={VAT_BOT - VAT_TOP + 18}
          fill="url(#cp-vat)" stroke="#8a6028" strokeWidth="3" rx="6" />
        {/* Vat staves (barrel effect) */}
        {Array.from({ length: 8 }, (_, i) => {
          const sx = VAT_X1 + (i / 7) * (VAT_X2 - VAT_X1);
          return (
            <line key={i} x1={sx} y1={VAT_TOP - 10} x2={sx} y2={VAT_BOT + 4}
              stroke="#7a5018" strokeWidth="1" opacity="0.4" />
          );
        })}
        {/* Vat hoops */}
        {[0.15, 0.55, 0.88].map((t, i) => (
          <rect key={i}
            x={VAT_X1 - 10} y={VAT_TOP - 14 + t * (VAT_BOT - VAT_TOP + 20)}
            width={VAT_X2 - VAT_X1 + 20} height={8}
            fill="#6a4010" rx="2" />
        ))}
        {/* Curd inside vat */}
        <rect x={VAT_X1} y={VAT_TOP + 18} width={VAT_X2 - VAT_X1} height={VAT_BOT - VAT_TOP - 20}
          fill="url(#cp-curd)" clipPath="url(#cp-vat-clip)" />
        {/* Paddle / stirrer */}
        <g transform={`rotate(${paddleAng}, ${paddleTopX}, ${VAT_TOP - 14})`}>
          <rect x={VAT_MID_X - PADDLE_W / 2} y={VAT_TOP - 60} width={PADDLE_W} height={PADDLE_H + 60}
            fill="#8a5818" rx="3" />
          {/* Paddle head */}
          <rect x={VAT_MID_X - 32} y={VAT_TOP - 4} width={64} height={24}
            fill="#7a4808" rx="3" />
          {/* Holes in paddle */}
          {[VAT_MID_X - 20, VAT_MID_X, VAT_MID_X + 20].map((hx, i) => (
            <ellipse key={i} cx={hx} cy={VAT_TOP + 8} rx={5} ry={8} fill="#d4b060" />
          ))}
        </g>
        {/* Vat legs */}
        {[VAT_X1 + 24, VAT_X2 - 24].map((lx, i) => (
          <rect key={i} x={lx - 8} y={VAT_BOT + 4} width={16} height={GY - VAT_BOT - 2}
            fill="#6a4010" rx="2" />
        ))}

        {/* Butter churn */}
        <rect x={CHN_X1} y={CHN_TOP} width={CHN_X2 - CHN_X1} height={CHN_BOT - CHN_TOP}
          fill="#c89840" stroke="#8a5818" strokeWidth="2" rx="4" />
        {[0.25, 0.5, 0.75].map((t, i) => (
          <rect key={i} x={CHN_X1 - 3} y={CHN_TOP + t * (CHN_BOT - CHN_TOP)}
            width={CHN_X2 - CHN_X1 + 6} height={6} fill="#6a3808" rx="2" />
        ))}
        {/* Churn lid + dasher hole */}
        <rect x={CHN_X1 - 4} y={CHN_TOP - 8} width={CHN_X2 - CHN_X1 + 8} height={12}
          fill="#7a5020" rx="3" />
        {/* Dasher rod */}
        <line x1={CHN_CX} y1={dasherY} x2={CHN_CX} y2={CHN_TOP - 2}
          stroke="#5a3808" strokeWidth="5" strokeLinecap="round" />
        {/* Dasher handle T-bar */}
        <line x1={CHN_CX - 24} y1={dasherY} x2={CHN_CX + 24} y2={dasherY}
          stroke="#5a3808" strokeWidth="6" strokeLinecap="round" />
        {/* Churn feet */}
        {[CHN_X1 + 10, CHN_X2 - 10].map((fx, i) => (
          <rect key={i} x={fx - 6} y={CHN_BOT} width={12} height={12}
            fill="#5a3808" rx="1" />
        ))}

        {/* === AGING SHELVES (right wall) === */}
        {/* Wall */}
        <rect x={SHF_X1 - 20} y={CEIL + 8} width={W - SHF_X1 + 20} height={GY - CEIL - 8}
          fill="#d4b868" opacity="0.25" />
        {/* Shelf brackets + boards */}
        {SHF_YS.map((sy, ri) => (
          <g key={ri}>
            {/* Bracket left */}
            <path d={`M${SHF_X1 - 12} ${sy} L${SHF_X1 - 12} ${sy + 18} L${SHF_X1 + 20} ${sy + 18}`}
              fill="none" stroke="#6a4010" strokeWidth="3" />
            {/* Bracket right */}
            <path d={`M${SHF_X2 + 12} ${sy} L${SHF_X2 + 12} ${sy + 18} L${SHF_X2 - 20} ${sy + 18}`}
              fill="none" stroke="#6a4010" strokeWidth="3" />
            {/* Shelf board */}
            <rect x={SHF_X1 - 16} y={sy} width={SHF_X2 - SHF_X1 + 32} height={SHF_DEPTH}
              fill="#8a6020" rx="2" />
          </g>
        ))}
        {/* Cheese wheels on shelves */}
        {WHEELS.map(([cx, ri, variety], wi) => {
          const sy = SHF_YS[ri] ?? (GY - 58);
          const topColor = WCOLS[variety] ?? "#d4a038";
          const rindColor = WRIND[variety] ?? "#8a6010";
          const wR = 28 - (ri as number) * 2;
          const wheelH = 16 - (ri as number);
          return (
            <g key={wi}>
              {/* Side rind */}
              <rect x={cx - wR} y={sy - wheelH} width={wR * 2} height={wheelH}
                fill={rindColor} rx="3" />
              {/* Top face */}
              <ellipse cx={cx} cy={sy - wheelH} rx={wR} ry={wR * 0.35}
                fill={topColor} stroke={rindColor} strokeWidth="1.5" />
              {/* Blue-veined marbling */}
              {variety === 3 && (
                <path d={`M${cx - 12} ${sy - wheelH} Q${cx} ${sy - wheelH - 6} ${cx + 10} ${sy - wheelH}`}
                  fill="none" stroke="#8090a0" strokeWidth="1" opacity="0.6" />
              )}
              {/* Wax sheen on red wax */}
              {variety === 2 && (
                <ellipse cx={cx - 6} cy={sy - wheelH - 2} rx={5} ry={3}
                  fill="#e04828" opacity="0.4" />
              )}
            </g>
          );
        })}

        {/* === CHEESEMONGER FIGURE === */}
        {/* Apron */}
        <rect x={CM_X - 20} y={CM_HIP - 4} width={40} height={CM_HIP - GY + 134}
          fill="#f4ecd4" stroke="#d4c898" strokeWidth="1.5" rx="4" />
        {/* Torso */}
        <g transform={`rotate(${torsoLean}, ${CM_X}, ${CM_HIP})`}>
          <rect x={CM_X - 17} y={CM_SH} width={34} height={CM_HIP - CM_SH + 10}
            fill="#5a3028" rx="4" />
          {/* Left arm reaching into vat */}
          <line x1={CM_X - 17} y1={CM_SH + 18}
            x2={CM_X - 54 - torsoLean * 1.2} y2={CM_SH + 68}
            stroke="#5a3028" strokeWidth="10" strokeLinecap="round" />
          {/* Right arm down */}
          <line x1={CM_X + 17} y1={CM_SH + 18}
            x2={CM_X + 20} y2={CM_SH + 74}
            stroke="#5a3028" strokeWidth="10" strokeLinecap="round" />
        </g>
        {/* Legs */}
        <rect x={CM_X - 14} y={CM_HIP} width={12} height={GY - CM_HIP}
          fill="#3a2018" rx="3" />
        <rect x={CM_X + 2} y={CM_HIP} width={12} height={GY - CM_HIP}
          fill="#3a2018" rx="3" />
        {/* Head */}
        <circle cx={CM_X} cy={CM_HEAD} r={20} fill="#d4a870" />
        {/* Hair */}
        <path d={`M${CM_X - 20} ${CM_HEAD} Q${CM_X} ${CM_HEAD - 30} ${CM_X + 20} ${CM_HEAD}`}
          fill="#3a2010" />
        {/* Mob cap */}
        <ellipse cx={CM_X} cy={CM_HEAD - 12} rx={22} ry={14} fill="#f8f0e0" stroke="#d4c898" strokeWidth="1.5" />
        {/* Face */}
        <circle cx={CM_X - 6} cy={CM_HEAD} r={2.5} fill="#6a3818" />
        <circle cx={CM_X + 6} cy={CM_HEAD} r={2.5} fill="#6a3818" />
        <path d={`M${CM_X - 6} ${CM_HEAD + 7} Q${CM_X} ${CM_HEAD + 12} ${CM_X + 6} ${CM_HEAD + 7}`}
          fill="none" stroke="#6a3818" strokeWidth="1.5" />

        {/* Ladle on table edge */}
        <line x1={VAT_X1 + 30} y1={VAT_TOP - 14} x2={VAT_X1 + 30} y2={VAT_TOP + 10}
          stroke="#7a5020" strokeWidth="4" strokeLinecap="round" />
        <ellipse cx={VAT_X1 + 30} cy={VAT_TOP + 18} rx={10} ry={7} fill="none"
          stroke="#7a5020" strokeWidth="3" />

        {/* Cheese forms stacked on table left of vat */}
        {[0,1,2].map(i => (
          <rect key={i}
            x={PRS_X2 + 38} y={GY - 48 - i * 20} width={62} height={18}
            fill="#c89040" stroke="#8a5818" strokeWidth="1.5" rx="3"
          />
        ))}

        {/* Salt box on shelf */}
        <rect x={VAT_X2 + 18} y={GY - 98} width={52} height={52}
          fill="#e8e0c8" stroke="#b8a878" strokeWidth="2" rx="3" />
        <rect x={VAT_X2 + 18} y={GY - 98} width={52} height={14}
          fill="#d4c8a8" rx="3" />
        {/* Label */}
        <rect x={VAT_X2 + 26} y={GY - 76} width={36} height={22}
          fill="#f4edd4" stroke="#c4b888" strokeWidth="1" rx="2" />
        <line x1={VAT_X2 + 30} y1={GY - 68} x2={VAT_X2 + 56} y2={GY - 68}
          stroke="#a89050" strokeWidth="1.5" />
        <line x1={VAT_X2 + 30} y1={GY - 62} x2={VAT_X2 + 52} y2={GY - 62}
          stroke="#a89050" strokeWidth="1" />

        {/* Sign banner */}
        <rect x={242} y={CEIL + 18} width={244} height={42}
          fill="#6a4010" stroke="#4a2808" strokeWidth="2" rx="3" />
        <text x={364} y={CEIL + 46} textAnchor="middle" fontFamily="Georgia, serif"
          fontSize="14" fontWeight="bold" fill="#f4d870" letterSpacing="2">
          DAIRY &amp; CHEESE HOUSE
        </text>

        {/* Caption */}
        <text x={W / 2} y={H - 10} textAnchor="middle"
          fontFamily="Georgia, serif" fontSize="13" fill="#7a5818" letterSpacing="3" opacity="0.8">
          SHREWSBURY CREAMERY · CHEESE PRESS · EST. 1794
        </text>
      </svg>
    </section>
  );
}
