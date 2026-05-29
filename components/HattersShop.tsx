"use client";
import { useEffect, useRef, useState } from "react";

const W = 1280, H = 520;
const GY = 462;
const CEIL = 54;

// Workbench (left)
const WB_X1 = 52, WB_X2 = 468;
const WB_TOP = GY - 152; // 310
const WB_H = 18;
const WB_LEG_W = 14;

// Hat block / wooden form on bench
const HB_CX = 178, HB_TOP = WB_TOP - 74;
const HB_W = 62, HB_H_CROWN = 54, HB_H_BRIM = 8;

// Hat iron (blocking iron) on bench
const HI_CX = WB_X1 + 96, HI_Y = WB_TOP - 8;

// Vat / sizing pot (back left corner)
const VAT_CX = 74, VAT_TOP = GY - 188; // 274
const VAT_W = 118, VAT_H = 74;
const VAT_BOT = VAT_TOP + VAT_H;

// Steam particles — deterministic offsets
type ST3 = [number, number, number]; // xOff, phaseOff, speed
const STEAMS: ST3[] = [
  [-28, 0.0, 1.0],[-14, 0.9, 1.3],[0, 1.8, 0.9],[14, 2.7, 1.2],[28, 3.6, 1.0],
  [-20, 4.5, 0.8],[8, 5.4, 1.4],[-6, 6.3, 1.1],[22, 7.2, 0.9],[-34, 0.4, 1.3],
];

// Hatter figure
const HT_X = 310, HT_Y = GY;
const HT_HIP = HT_Y - 108, HT_SH = HT_Y - 198, HT_HEAD = HT_Y - 234;

// Hat display pegs on wall (center section)
// Each peg: [cx, pegh_y, hat_type]
// hat_type: 0=tricorn, 1=beaver_tall, 2=top_hat, 3=bonnet, 4=stovepipe, 5=round
type PEG3 = [number, number, number];
const PEGS: PEG3[] = [
  [548,  CEIL + 72, 0],
  [664,  CEIL + 56, 1],
  [776,  CEIL + 68, 2],
  [888,  CEIL + 78, 3],
  [996,  CEIL + 60, 4],
  [1108, CEIL + 72, 5],
  [608,  CEIL + 172, 1],
  [728,  CEIL + 160, 0],
  [848,  CEIL + 178, 5],
  [968,  CEIL + 166, 2],
  [1076, CEIL + 174, 3],
];

// Hat box stack (far right)
const HBX_X = 1108, HBX_YS = [GY - 48, GY - 100, GY - 152, GY - 200] as const;
const HBX_W = 128;
type HBX2 = [number, number]; // width, color idx
const HBX_PROPS: HBX2[] = [[128, 0],[118, 1],[108, 2],[98, 3]];
const HBX_COLS = ["#2a3858","#581818","#1a3818","#4a3010"] as const;

// Ceiling beams
const BEAM_XS = [168, 378, 594, 810, 1028] as const;

// Floor boards
const FLR_XS = [0, 124, 248, 372, 496, 620, 744, 868, 992, 1116] as const;

// Window (right wall)
const WIN_X1 = 1166, WIN_X2 = 1246, WIN_TOP = CEIL + 32, WIN_BOT = CEIL + 192;

// Helper: draw a hat on a peg
function hatPath(type: number, cx: number, peghY: number, sway: number): React.ReactNode {
  const sx = cx + sway;
  switch (type) {
    case 0: { // tricorn
      const brimY = peghY + 26;
      return (
        <g>
          {/* Crown */}
          <path d={`M${sx - 24} ${brimY} Q${sx} ${brimY - 38} ${sx + 24} ${brimY}`}
            fill="#1a1408" />
          {/* Brim with three cocked sides */}
          <path d={`M${sx - 42} ${brimY + 6} Q${sx - 28} ${brimY - 4} ${sx - 18} ${brimY}`}
            fill="none" stroke="#1a1408" strokeWidth="7" strokeLinecap="round" />
          <path d={`M${sx + 18} ${brimY} Q${sx + 28} ${brimY - 4} ${sx + 42} ${brimY + 6}`}
            fill="none" stroke="#1a1408" strokeWidth="7" strokeLinecap="round" />
          <path d={`M${sx - 42} ${brimY + 6} Q${sx} ${brimY + 18} ${sx + 42} ${brimY + 6}`}
            fill="none" stroke="#1a1408" strokeWidth="7" strokeLinecap="round" />
          {/* Cockade */}
          <circle cx={sx + 18} cy={brimY - 2} r={5} fill="#8a1818" />
        </g>
      );
    }
    case 1: { // beaver tall hat
      const brimY = peghY + 42;
      return (
        <g>
          <rect x={sx - 18} y={peghY} width={36} height={40} fill="#5a3010" rx="2" />
          <ellipse cx={sx} cy={brimY} rx={30} ry={9} fill="#4a2808" />
          <ellipse cx={sx} cy={peghY} rx={20} ry={6} fill="#6a3818" />
          {/* Fur texture lines */}
          {[0.2, 0.45, 0.7].map((t, i) => (
            <line key={i} x1={sx - 17} y1={peghY + t * 40} x2={sx + 17} y2={peghY + t * 40}
              stroke="#3a1808" strokeWidth="1" opacity="0.4" />
          ))}
        </g>
      );
    }
    case 2: { // top hat
      const brimY = peghY + 46;
      return (
        <g>
          <rect x={sx - 16} y={peghY} width={32} height={44} fill="#1a1820" rx="2" />
          <ellipse cx={sx} cy={brimY} rx={28} ry={8} fill="#141018" />
          <ellipse cx={sx} cy={peghY} rx={18} ry={5} fill="#242028" />
          {/* Silk sheen */}
          <rect x={sx - 12} y={peghY + 6} width={6} height={30} fill="#2a2830" rx="2" opacity="0.5" />
        </g>
      );
    }
    case 3: { // bonnet
      const brimY = peghY + 18;
      return (
        <g>
          <path d={`M${sx - 32} ${brimY} Q${sx - 18} ${brimY - 28} ${sx + 12} ${brimY - 32} Q${sx + 28} ${brimY - 14} ${sx + 22} ${brimY}`}
            fill="#d4a8c8" stroke="#b888a8" strokeWidth="1.5" />
          {/* Brim */}
          <path d={`M${sx - 32} ${brimY} Q${sx - 12} ${brimY + 18} ${sx + 22} ${brimY}`}
            fill="#e8cce0" stroke="#b888a8" strokeWidth="1.5" />
          {/* Ribbon ties */}
          <path d={`M${sx - 32} ${brimY + 4} Q${sx - 48} ${brimY + 22} ${sx - 38} ${brimY + 38}`}
            fill="none" stroke="#8a1818" strokeWidth="3" strokeLinecap="round" />
          <path d={`M${sx + 22} ${brimY + 4} Q${sx + 38} ${brimY + 22} ${sx + 28} ${brimY + 38}`}
            fill="none" stroke="#8a1818" strokeWidth="3" strokeLinecap="round" />
        </g>
      );
    }
    case 4: { // stovepipe
      const brimY = peghY + 54;
      return (
        <g>
          <rect x={sx - 15} y={peghY} width={30} height={52} fill="#0e0e10" rx="1" />
          <ellipse cx={sx} cy={brimY} rx={26} ry={7} fill="#0a0a0c" />
          <ellipse cx={sx} cy={peghY} rx={16} ry={4} fill="#181820" />
          {/* Band */}
          <rect x={sx - 15} y={brimY - 12} width={30} height={5} fill="#1a1820" />
        </g>
      );
    }
    default: { // round felt hat
      const brimY = peghY + 28;
      return (
        <g>
          <path d={`M${sx - 20} ${brimY} Q${sx} ${brimY - 34} ${sx + 20} ${brimY}`}
            fill="#4a5028" />
          <ellipse cx={sx} cy={brimY} rx={28} ry={8} fill="#3a4020" />
          {/* Band */}
          <path d={`M${sx - 20} ${brimY - 2} L${sx + 20} ${brimY - 2}`}
            stroke="#c89030" strokeWidth="3" />
        </g>
      );
    }
  }
}

export function HattersShop() {
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
    iRef.current = setInterval(() => setPhase(p => p + 0.016), 16);
    return () => { if (iRef.current) clearInterval(iRef.current); };
  }, [vis]);

  // Hatter arm pressing/blocking cycle
  const pressAng = -54 + Math.sin(phase * 1.6) * 28;
  const foreAng  = pressAng + 22 + Math.cos(phase * 1.6) * 18;
  const uaRad = (pressAng * Math.PI) / 180;
  const uaEndX = HT_SH + Math.cos(uaRad) * 58 + 14;
  const uaEndY = HT_SH + Math.sin(uaRad) * 58 + 140;
  const faRad = (foreAng * Math.PI) / 180;
  const faEndX = uaEndX + Math.cos(faRad) * 48;
  const faEndY = uaEndY + Math.sin(faRad) * 48;

  // Steam particles
  const steamElems: React.ReactNode[] = [];
  for (let i = 0; i < STEAMS.length; i++) {
    const st = STEAMS[i];
    if (!st) continue;
    const [xOff, phOff, spd] = st;
    const t = ((phase * spd + phOff) % (Math.PI * 2)) / (Math.PI * 2);
    const sy = VAT_TOP - 8 - t * 52;
    const sx2 = VAT_CX + xOff + Math.sin(phase * 2.1 + phOff) * 6;
    const op = t < 0.3 ? t / 0.3 : t > 0.7 ? (1 - t) / 0.3 : 1;
    steamElems.push(
      <ellipse key={i} cx={sx2} cy={sy} rx={7 + t * 8} ry={5 + t * 5}
        fill="#e8e0d4" opacity={op * 0.4} />
    );
  }

  // Hat sway on pegs
  const hatSway = Math.sin(phase * 0.6) * 2.5;

  // Iron glow pulse
  const ironGlow = 0.5 + Math.sin(phase * 3.2) * 0.15;

  return (
    <section aria-label="Colonial hatter's shop scene" style={{ background: "#f8f0dc" }}>
      <svg
        ref={ref}
        viewBox={`0 0 ${W} ${H}`}
        width="100%"
        style={{ display: "block", maxHeight: 520 }}
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="hs-wall" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#e8d8a8" />
            <stop offset="100%" stopColor="#d4c090" />
          </linearGradient>
          <linearGradient id="hs-floor" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#c8a840" />
            <stop offset="100%" stopColor="#a88428" />
          </linearGradient>
          <linearGradient id="hs-bench" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#8a6020" />
            <stop offset="100%" stopColor="#5a3c0c" />
          </linearGradient>
          <radialGradient id="hs-iron-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#f8a020" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#e06010" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="hs-vat" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#5a3808" />
            <stop offset="100%" stopColor="#3a2206" />
          </linearGradient>
        </defs>

        {/* Wall */}
        <rect x="0" y="0" width={W} height={GY} fill="url(#hs-wall)" />
        {/* Wainscot band */}
        <rect x="0" y={GY - 148} width={W} height={148} fill="#c8a838" opacity="0.18" />
        <line x1="0" y1={GY - 148} x2={W} y2={GY - 148} stroke="#b89028" strokeWidth="2" opacity="0.4" />

        {/* Ceiling */}
        <rect x="0" y="0" width={W} height={CEIL + 6} fill="#c8a030" opacity="0.7" />
        <rect x="0" y={CEIL} width={W} height={6} fill="#9a7818" />

        {/* Ceiling beams */}
        {BEAM_XS.map((bx, i) => (
          <rect key={i} x={bx - 18} y={0} width={36} height={CEIL + 22}
            fill="#6a4810" rx="2" />
        ))}

        {/* Floor */}
        <rect x="0" y={GY} width={W} height={H - GY} fill="url(#hs-floor)" />
        {FLR_XS.map((fx, i) => (
          <line key={i} x1={fx} y1={GY} x2={fx} y2={H} stroke="#907028" strokeWidth="1.5" opacity="0.5" />
        ))}
        <rect x="0" y={GY} width={W} height={3} fill="#806018" />

        {/* Window */}
        <rect x={WIN_X1} y={WIN_TOP} width={WIN_X2 - WIN_X1} height={WIN_BOT - WIN_TOP}
          fill="#d4ecf8" stroke="#7a5818" strokeWidth="3" rx="1" />
        <line x1={(WIN_X1 + WIN_X2) / 2} y1={WIN_TOP} x2={(WIN_X1 + WIN_X2) / 2} y2={WIN_BOT}
          stroke="#7a5818" strokeWidth="2" />
        <line x1={WIN_X1} y1={(WIN_TOP + WIN_BOT) / 2} x2={WIN_X2} y2={(WIN_TOP + WIN_BOT) / 2}
          stroke="#7a5818" strokeWidth="2" />
        <rect x={WIN_X1 - 6} y={WIN_BOT} width={WIN_X2 - WIN_X1 + 12} height={9}
          fill="#7a5818" rx="1" />

        {/* === SIZING VAT === */}
        {/* Brick surround */}
        <rect x={VAT_CX - VAT_W / 2 - 18} y={VAT_TOP - 8} width={VAT_W + 36} height={VAT_H + 20}
          fill="#a85830" rx="4" />
        {/* Brick courses */}
        {Array.from({ length: 5 }, (_, ri) => {
          const by = VAT_TOP - 8 + ri * 18;
          return (
            <rect key={ri}
              x={VAT_CX - VAT_W / 2 - 18 + (ri % 2) * 12}
              y={by} width={VAT_W + 36 - (ri % 2) * 24} height={1}
              fill="#8a3818" opacity="0.4" />
          );
        })}
        {/* Vat body */}
        <rect x={VAT_CX - VAT_W / 2} y={VAT_TOP} width={VAT_W} height={VAT_H}
          fill="url(#hs-vat)" stroke="#2a1606" strokeWidth="2" rx="4" />
        {/* Sizing liquid inside */}
        <rect x={VAT_CX - VAT_W / 2 + 4} y={VAT_TOP + 12} width={VAT_W - 8} height={VAT_H - 14}
          fill="#5a7830" opacity="0.7" rx="2" />
        {/* Surface sheen */}
        <ellipse cx={VAT_CX} cy={VAT_TOP + 12} rx={VAT_W / 2 - 4} ry={6}
          fill="#7a9848" opacity="0.5" />
        {/* Steam */}
        {steamElems}
        {/* Iron hoops */}
        {[0.2, 0.55, 0.85].map((t, i) => (
          <rect key={i}
            x={VAT_CX - VAT_W / 2 - 3}
            y={VAT_TOP + t * VAT_H}
            width={VAT_W + 6} height={6}
            fill="#3a2208" rx="2" />
        ))}
        {/* Ladle handle leaning on vat */}
        <line x1={VAT_CX + VAT_W / 2 - 8} y1={VAT_TOP - 22}
          x2={VAT_CX + VAT_W / 2 + 28} y2={VAT_TOP + VAT_H - 18}
          stroke="#5a3808" strokeWidth="5" strokeLinecap="round" />
        <ellipse cx={VAT_CX + VAT_W / 2 - 8} cy={VAT_TOP - 18}
          rx={9} ry={6} fill="none" stroke="#5a3808" strokeWidth="3" />

        {/* === WORKBENCH === */}
        <rect x={WB_X1} y={WB_TOP} width={WB_X2 - WB_X1} height={WB_H}
          fill="url(#hs-bench)" rx="2" />
        <rect x={WB_X1} y={WB_TOP} width={WB_X2 - WB_X1} height={3} fill="#a87030" />
        {[WB_X1 + WB_LEG_W, WB_X2 - WB_LEG_W * 2].map((lx, i) => (
          <rect key={i} x={lx} y={WB_TOP + WB_H} width={WB_LEG_W} height={GY - WB_TOP - WB_H}
            fill="#4a2808" rx="2" />
        ))}
        <rect x={WB_X1 + 24} y={GY - 54} width={WB_X2 - WB_X1 - 48} height={8}
          fill="#3a2006" rx="2" />

        {/* Hat block on bench */}
        {/* Neck post */}
        <rect x={HB_CX - 9} y={WB_TOP - 24} width={18} height={24}
          fill="#7a5020" rx="2" />
        {/* Crown */}
        <path d={`M${HB_CX - HB_W / 2} ${HB_TOP + HB_H_CROWN} Q${HB_CX} ${HB_TOP - 8} ${HB_CX + HB_W / 2} ${HB_TOP + HB_H_CROWN}`}
          fill="#6a3808" />
        <rect x={HB_CX - HB_W / 2} y={HB_TOP + HB_H_CROWN - 4} width={HB_W} height={8}
          fill="#5a2806" />
        {/* Work-in-progress felt on block — grey-brown felt */}
        <path d={`M${HB_CX - HB_W / 2 - 6} ${HB_TOP + HB_H_CROWN + 4} Q${HB_CX} ${HB_TOP - 16} ${HB_CX + HB_W / 2 + 6} ${HB_TOP + HB_H_CROWN + 4}`}
          fill="#7a6848" opacity="0.85" />
        <ellipse cx={HB_CX} cy={HB_TOP + HB_H_CROWN + 6} rx={HB_W / 2 + 10} ry={HB_H_BRIM}
          fill="#6a5838" />

        {/* Hat iron on bench */}
        <ellipse cx={HI_CX} cy={HI_Y} rx={16} ry={6}
          fill="#8a9030" opacity={ironGlow} />
        <rect x={HI_CX - 10} y={HI_Y - 18} width={20} height={18} fill="#8a8888" rx="3" />
        <rect x={HI_CX - 4} y={HI_Y - 38} width={8} height={22} fill="#6a6868" rx="2" />
        {/* Iron handle */}
        <path d={`M${HI_CX - 4} ${HI_Y - 38} Q${HI_CX - 18} ${HI_Y - 54} ${HI_CX - 8} ${HI_Y - 58}`}
          fill="none" stroke="#5a3808" strokeWidth="6" strokeLinecap="round" />

        {/* Shears on bench */}
        <line x1={WB_X1 + 238} y1={WB_TOP - 2} x2={WB_X1 + 288} y2={WB_TOP - 24}
          stroke="#7a7878" strokeWidth="3" strokeLinecap="round" />
        <line x1={WB_X1 + 252} y1={WB_TOP - 2} x2={WB_X1 + 298} y2={WB_TOP - 22}
          stroke="#7a7878" strokeWidth="3" strokeLinecap="round" />
        <circle cx={WB_X1 + 245} cy={WB_TOP - 2} r={6} fill="#5a5858" />

        {/* Felt scraps on bench */}
        {[[WB_X1 + 184, WB_TOP - 4, "#7a6848", 32, 12],
          [WB_X1 + 216, WB_TOP - 6, "#5a4828", 24, 10]].map(([fx, fy, fc, fw, fh], i) => (
          <rect key={i} x={fx} y={fy} width={fw} height={fh}
            fill={fc as string} rx="3" opacity="0.8" />
        ))}

        {/* === HAT PEG DISPLAY === */}
        {/* Horizontal peg rails */}
        <rect x={510} y={CEIL + 28} width={680} height={8} fill="#7a5018" rx="2" />
        <rect x={510} y={CEIL + 128} width={680} height={8} fill="#7a5018" rx="2" />

        {/* Hat pegs and hats */}
        {PEGS.map(([cx, peghY, type], pi) => {
          const railY = pi < 6 ? CEIL + 32 : CEIL + 132;
          const sway = Math.sin(phase * 0.6 + pi * 0.8) * 2.5;
          return (
            <g key={pi}>
              {/* Peg */}
              <rect x={cx - 3} y={railY} width={6} height={peghY - railY}
                fill="#5a3808" rx="1" />
              <circle cx={cx} cy={peghY} r={5} fill="#4a2806" />
              {/* Hat */}
              {hatPath(type, cx, peghY + 4, sway)}
            </g>
          );
        })}

        {/* === HAT BOX STACK === */}
        {HBX_PROPS.map(([bw, ci], i) => {
          const by = HBX_YS[i] ?? (GY - 48);
          const bx = HBX_X + (HBX_W - bw) / 2;
          const col = HBX_COLS[ci] ?? "#2a3858";
          return (
            <g key={i}>
              <rect x={bx} y={by - 48} width={bw} height={50}
                fill={col} stroke="#1a1008" strokeWidth="1.5" rx="3" />
              {/* Lid */}
              <rect x={bx - 3} y={by - 52} width={bw + 6} height={8}
                fill={col} stroke="#1a1008" strokeWidth="1.5" rx="2" />
              {/* Band */}
              <rect x={bx} y={by - 34} width={bw} height={4} fill="#c89030" opacity="0.6" />
              {/* Label */}
              <rect x={bx + 8} y={by - 42} width={bw - 16} height={22}
                fill="#f8f0e0" opacity="0.35" rx="2" />
            </g>
          );
        })}

        {/* === HATTER FIGURE === */}
        {/* Apron */}
        <path d={`M${HT_X - 18} ${HT_HIP - 4} L${HT_X - 22} ${GY - 4} L${HT_X + 22} ${GY - 4} L${HT_X + 18} ${HT_HIP - 4} Z`}
          fill="#d4c898" />
        {/* Legs */}
        <rect x={HT_X - 14} y={HT_HIP} width={12} height={GY - HT_HIP}
          fill="#2a1808" rx="3" />
        <rect x={HT_X + 2} y={HT_HIP} width={12} height={GY - HT_HIP}
          fill="#2a1808" rx="3" />
        {/* Torso */}
        <rect x={HT_X - 17} y={HT_SH} width={34} height={HT_HIP - HT_SH + 12}
          fill="#3a2858" rx="4" />
        {/* Right arm (pressing) */}
        <line x1={HT_X + 16} y1={HT_SH + 18}
          x2={uaEndX} y2={uaEndY}
          stroke="#3a2858" strokeWidth="11" strokeLinecap="round" />
        <line x1={uaEndX} y1={uaEndY}
          x2={faEndX} y2={faEndY}
          stroke="#3a2858" strokeWidth="9" strokeLinecap="round" />
        {/* Left arm bracing on bench */}
        <line x1={HT_X - 16} y1={HT_SH + 20}
          x2={HT_X - 52} y2={WB_TOP - 2}
          stroke="#3a2858" strokeWidth="11" strokeLinecap="round" />
        {/* Head */}
        <circle cx={HT_X} cy={HT_HEAD} r={20} fill="#c4905a" />
        {/* Tricorn hat on hatter */}
        <path d={`M${HT_X - 26} ${HT_HEAD - 14} Q${HT_X} ${HT_HEAD - 48} ${HT_X + 26} ${HT_HEAD - 14}`}
          fill="#1a1408" />
        <path d={`M${HT_X - 44} ${HT_HEAD - 8} Q${HT_X - 30} ${HT_HEAD - 16} ${HT_X - 20} ${HT_HEAD - 14}`}
          fill="none" stroke="#1a1408" strokeWidth="8" strokeLinecap="round" />
        <path d={`M${HT_X + 20} ${HT_HEAD - 14} Q${HT_X + 30} ${HT_HEAD - 16} ${HT_X + 44} ${HT_HEAD - 8}`}
          fill="none" stroke="#1a1408" strokeWidth="8" strokeLinecap="round" />
        <path d={`M${HT_X - 44} ${HT_HEAD - 8} Q${HT_X} ${HT_HEAD + 4} ${HT_X + 44} ${HT_HEAD - 8}`}
          fill="none" stroke="#1a1408" strokeWidth="8" strokeLinecap="round" />
        {/* Face */}
        <circle cx={HT_X - 7} cy={HT_HEAD + 2} r={2.5} fill="#5a2c10" />
        <circle cx={HT_X + 7} cy={HT_HEAD + 2} r={2.5} fill="#5a2c10" />
        <path d={`M${HT_X - 6} ${HT_HEAD + 9} Q${HT_X} ${HT_HEAD + 14} ${HT_X + 6} ${HT_HEAD + 9}`}
          fill="none" stroke="#5a2c10" strokeWidth="1.5" />

        {/* Sign over bench */}
        <rect x={70} y={CEIL + 14} width={278} height={40}
          fill="#2a1808" stroke="#c89030" strokeWidth="2" rx="3" />
        <text x={209} y={CEIL + 41} textAnchor="middle"
          fontFamily="Georgia, serif" fontSize="14" fontWeight="bold"
          fill="#c89030" letterSpacing="2">
          J. WILLARD · HATTER
        </text>

        {/* Caption */}
        <text x={W / 2} y={H - 10} textAnchor="middle"
          fontFamily="Georgia, serif" fontSize="13" fill="#7a5018" letterSpacing="3" opacity="0.8">
          SHREWSBURY HATMAKING TRADE · EST. 1778
        </text>
      </svg>
    </section>
  );
}
