"use client";
import { useEffect, useRef, useState } from "react";

const W = 1280, H = 520;
const GY = 462;
const CEIL = 52;

// Desk geometry (left)
const DSK_X1 = 62, DSK_X2 = 498;
const DSK_TOP = GY - 148; // 314
const DSK_H = 18;
const DSK_LEG_W = 16;

// Ledger on desk
const LDG_X1 = DSK_X1 + 28, LDG_X2 = DSK_X1 + 248;
const LDG_TOP = DSK_TOP - 64;
const LDG_H = 64;

// Quill + inkwell
const INK_CX = LDG_X2 + 38, INK_CY = DSK_TOP - 12;
const QUILL_BASE_X = INK_CX + 4, QUILL_BASE_Y = INK_CY - 8;

// Clerk figure
const CLK_X = 312, CLK_Y = GY;
const CLK_HIP = CLK_Y - 96, CLK_SH = CLK_Y - 188, CLK_HEAD = CLK_Y - 222;

// Abacus on desk right
const ABX_X1 = DSK_X2 - 148, ABX_X2 = DSK_X2 - 12;
const ABX_TOP = DSK_TOP - 88, ABX_BOT = DSK_TOP - 12;
const AB_ROWS = 7;
const AB_BEADS = 9;
const ABX_MID = (ABX_X1 + ABX_X2) / 2;

// Candle
const CND_CX = DSK_X1 + 18, CND_CY = DSK_TOP - 2;
const CND_W = 14, CND_H = 48;

// Bookshelf (right side)
const BSH_X1 = 548, BSH_X2 = 1240;
const BSH_YS = [GY - 322, GY - 242, GY - 162, GY - 82] as const;
const BSH_DEPTH = 16;

// Book colors (spine)
type BK4 = [number, string, string, number]; // x, spine, title color, shelf
const BOOKS: BK4[] = [
  [556,  "#7a2818","#f4d870",0],[580,  "#1a3a58","#f4d870",0],[602,  "#3a5820","#f4d870",0],
  [622,  "#582818","#f4d870",0],[648,  "#1a2848","#e8d060",0],[672,  "#4a1818","#f4d870",0],
  [692,  "#283818","#f4d870",0],[716,  "#5a3808","#f4d870",0],[738,  "#1a3828","#f0e060",0],
  [758,  "#482808","#f4d870",0],[780,  "#2a1848","#f4d870",0],[802,  "#3a2808","#f4d870",0],
  [826,  "#1a3848","#f4d870",0],[848,  "#5a1818","#e8d060",0],[868,  "#284818","#f4d870",0],
  [892,  "#481818","#f4d870",0],[912,  "#1a2858","#f4d870",0],[934,  "#3a4818","#f4d870",0],
  [954,  "#5a2808","#e8d060",0],[978,  "#1a3818","#f4d870",0],[998,  "#482818","#f4d870",0],
  [1018, "#283848","#f4d870",0],[1042, "#3a1828","#f4d870",0],[1062, "#1a4828","#f0e060",0],
  [1082, "#5a1808","#f4d870",0],[1104, "#284828","#f4d870",0],[1124, "#1a2838","#f4d870",0],
  [1148, "#4a2808","#f4d870",0],[1168, "#3a1848","#e8d060",0],[1188, "#1a3828","#f4d870",0],
  [556,  "#8a3828","#f4d870",1],[578,  "#1a4858","#f4d870",1],[600,  "#4a5828","#f4d870",1],
  [624,  "#5a2818","#f4d870",1],[648,  "#2a3858","#e8d060",1],[670,  "#4a1828","#f4d870",1],
  [694,  "#183828","#f4d870",1],[716,  "#5a4808","#f4d870",1],[738,  "#2a3828","#f0e060",1],
  [760,  "#481808","#f4d870",1],[782,  "#1a2858","#f4d870",1],[804,  "#4a2808","#f4d870",1],
  [556,  "#6a2818","#f4d870",2],[578,  "#2a4858","#f4d870",2],[600,  "#3a5818","#f4d870",2],
  [624,  "#5a3808","#f4d870",2],[648,  "#1a2858","#e8d060",2],[670,  "#482818","#f4d870",2],
  [694,  "#284828","#f4d870",2],[716,  "#5a2808","#f4d870",2],
  [556,  "#7a3818","#f4d870",3],[578,  "#1a3858","#f4d870",3],[600,  "#3a4818","#f4d870",3],
  [624,  "#5a1818","#e8d060",3],[648,  "#284838","#f4d870",3],[670,  "#4a2818","#f4d870",3],
];

// Ledger line positions
const LDG_LINES = [0.22, 0.38, 0.54, 0.70, 0.86] as const;

// Window (upper right wall)
const WIN_X1 = 434, WIN_X2 = 534, WIN_TOP = CEIL + 28, WIN_BOT = CEIL + 178;

// Cash box on shelf
const CBX_X = 548, CBX_Y = GY - 82;
const CBX_W = 72, CBX_H = 44;

// Ceiling beams
const BEAM_XS = [148, 360, 576, 792, 1008] as const;

// Floor boards
const FLR_XS = [0,116,232,348,464,580,696,812,928,1044,1160] as const;

// Candle flame flicker offsets (deterministic, no Math.random)
const FLICKER = [0, 0.8, 1.6, 2.4, 3.2, 4.0, 4.8, 5.6] as const;

export function CountingHouse() {
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

  // Quill writing sweep
  const quillAng = -38 + Math.sin(phase * 1.4) * 18;
  const quillTipX = QUILL_BASE_X + Math.cos((quillAng * Math.PI) / 180) * 68;
  const quillTipY = QUILL_BASE_Y + Math.sin((quillAng * Math.PI) / 180) * 68;
  const quillBarbX = QUILL_BASE_X - Math.cos((quillAng * Math.PI) / 180) * 42;
  const quillBarbY = QUILL_BASE_Y - Math.sin((quillAng * Math.PI) / 180) * 42;

  // Flame flicker
  const fl1 = Math.sin(phase * 7.2) * 3;
  const fl2 = Math.sin(phase * 11.4 + 1.1) * 2;
  const flH = 22 + Math.sin(phase * 5.8) * 4;

  // Clerk writing arm
  const armAng = Math.sin(phase * 1.4) * 14;
  const armEndX = CLK_SH + Math.cos(((armAng - 62) * Math.PI) / 180) * 72;
  const armEndY = CLK_SH + Math.sin(((armAng - 62) * Math.PI) / 180) * 72 + 128;

  // Abacus bead positions (deterministic by row+col)
  // Rows have varying number of beads pushed left
  const abRowCounts = [5, 3, 7, 2, 6, 4, 5] as const;

  // Candle light radius pulse
  const lightR = 148 + Math.sin(phase * 5.8) * 8;

  // Ink scratch marks appearing on ledger (cycle through 4 positions)
  const scratchPhase = (phase * 0.4) % (Math.PI * 2);
  const scratchX = LDG_X1 + 42 + Math.sin(scratchPhase) * 28;

  return (
    <section aria-label="Colonial counting house scene" style={{ background: "#2a1a08" }}>
      <svg
        ref={ref}
        viewBox={`0 0 ${W} ${H}`}
        width="100%"
        style={{ display: "block", maxHeight: 520 }}
        aria-hidden="true"
      >
        <defs>
          <radialGradient id="ch-candlelight" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#f8c840" stopOpacity="0.38" />
            <stop offset="60%" stopColor="#c87820" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#8a4808" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="ch-wall" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2a1c0c" />
            <stop offset="100%" stopColor="#1a1008" />
          </linearGradient>
          <linearGradient id="ch-desk" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#5a3808" />
            <stop offset="100%" stopColor="#3a2206" />
          </linearGradient>
          <linearGradient id="ch-floor" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3a2608" />
            <stop offset="100%" stopColor="#2a1a06" />
          </linearGradient>
          <linearGradient id="ch-ledger" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f4eddc" />
            <stop offset="100%" stopColor="#e8dfc8" />
          </linearGradient>
          <radialGradient id="ch-win" cx="50%" cy="30%" r="60%">
            <stop offset="0%" stopColor="#b8d4e8" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#6898b8" stopOpacity="0.4" />
          </radialGradient>
          <filter id="ch-glow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {/* Background wall — dark panelled */}
        <rect x="0" y="0" width={W} height={GY} fill="url(#ch-wall)" />

        {/* Wainscot panelling lines */}
        {[0.18, 0.36, 0.54, 0.72, 0.9].map((t, i) => (
          <line key={i} x1="0" y1={CEIL + t * (GY - CEIL)} x2={W} y2={CEIL + t * (GY - CEIL)}
            stroke="#3a2808" strokeWidth="1" opacity="0.5" />
        ))}
        {[180, 360, 540, 720, 900, 1080].map((px, i) => (
          <line key={i} x1={px} y1={CEIL} x2={px} y2={GY}
            stroke="#3a2808" strokeWidth="0.8" opacity="0.4" />
        ))}

        {/* Ceiling */}
        <rect x="0" y="0" width={W} height={CEIL + 6} fill="#1e1208" />
        <rect x="0" y={CEIL} width={W} height={6} fill="#2a1a08" />

        {/* Ceiling beams */}
        {BEAM_XS.map((bx, i) => (
          <rect key={i} x={bx - 16} y={0} width={32} height={CEIL + 20}
            fill="#150e04" rx="2" />
        ))}

        {/* Floor */}
        <rect x="0" y={GY} width={W} height={H - GY} fill="url(#ch-floor)" />
        {FLR_XS.map((fx, i) => (
          <line key={i} x1={fx} y1={GY} x2={fx} y2={H}
            stroke="#1e1206" strokeWidth="1.5" opacity="0.6" />
        ))}
        <rect x="0" y={GY} width={W} height={3} fill="#1a1004" />

        {/* Candle warm light pool */}
        <ellipse cx={CND_CX} cy={DSK_TOP - 10} rx={lightR} ry={lightR * 0.55}
          fill="url(#ch-candlelight)" />

        {/* Window */}
        <rect x={WIN_X1} y={WIN_TOP} width={WIN_X2 - WIN_X1} height={WIN_BOT - WIN_TOP}
          fill="url(#ch-win)" stroke="#2a1808" strokeWidth="3" rx="1" />
        <line x1={(WIN_X1 + WIN_X2) / 2} y1={WIN_TOP} x2={(WIN_X1 + WIN_X2) / 2} y2={WIN_BOT}
          stroke="#2a1808" strokeWidth="2" />
        <line x1={WIN_X1} y1={(WIN_TOP + WIN_BOT) / 2} x2={WIN_X2} y2={(WIN_TOP + WIN_BOT) / 2}
          stroke="#2a1808" strokeWidth="2" />
        <rect x={WIN_X1 - 6} y={WIN_BOT} width={WIN_X2 - WIN_X1 + 12} height={9}
          fill="#2a1808" rx="1" />
        {/* Cool window light shaft */}
        <path d={`M${WIN_X1 + 4} ${WIN_BOT} L${WIN_X1 - 38} ${GY} L${WIN_X2 + 28} ${GY} L${WIN_X2 - 4} ${WIN_BOT} Z`}
          fill="#7ab8d8" opacity="0.04" />

        {/* === BOOKSHELF === */}
        {BSH_YS.map((sy, ri) => (
          <g key={ri}>
            <rect x={BSH_X1 - 14} y={sy - 4} width={BSH_X2 - BSH_X1 + 28} height={BSH_DEPTH + 4}
              fill="#2a1808" rx="2" />
          </g>
        ))}
        {/* Back wall of shelf */}
        <rect x={BSH_X1 - 14} y={BSH_YS[0] ?? (GY - 322)} width={BSH_X2 - BSH_X1 + 28}
          height={GY - (BSH_YS[0] ?? (GY - 322))} fill="#1e1206" />
        {/* Book spines */}
        {BOOKS.map(([bx, spine, _tc, ri], bi) => {
          const sy = BSH_YS[ri] ?? (GY - 82);
          const bw = 18 + (bi % 3) * 4;
          const bh = 62 - (ri as number) * 4;
          return (
            <g key={bi}>
              <rect x={bx} y={sy - bh} width={bw} height={bh}
                fill={spine} rx="1" />
              {/* Spine highlight */}
              <rect x={bx + 2} y={sy - bh + 4} width={3} height={bh - 8}
                fill="#ffffff" opacity="0.07" rx="1" />
              {/* Gold title line */}
              <line x1={bx + 3} y1={sy - bh + bh * 0.3} x2={bx + bw - 3} y2={sy - bh + bh * 0.3}
                stroke="#c8a030" strokeWidth="1" opacity="0.6" />
            </g>
          );
        })}

        {/* Cash box on bottom shelf */}
        <rect x={CBX_X} y={CBX_Y - CBX_H} width={CBX_W} height={CBX_H}
          fill="#4a2808" stroke="#2a1406" strokeWidth="2" rx="3" />
        {/* Iron bands */}
        <rect x={CBX_X - 2} y={CBX_Y - CBX_H + 8} width={CBX_W + 4} height={5}
          fill="#1a1008" rx="1" />
        <rect x={CBX_X - 2} y={CBX_Y - CBX_H + CBX_H - 13} width={CBX_W + 4} height={5}
          fill="#1a1008" rx="1" />
        {/* Hasp */}
        <rect x={CBX_X + CBX_W / 2 - 8} y={CBX_Y - CBX_H - 4} width={16} height={8}
          fill="#8a7028" rx="2" />
        <circle cx={CBX_X + CBX_W / 2} cy={CBX_Y - CBX_H + 2} r={4} fill="#6a5020" />

        {/* === WRITING DESK === */}
        {/* Desk surface */}
        <rect x={DSK_X1} y={DSK_TOP} width={DSK_X2 - DSK_X1} height={DSK_H}
          fill="url(#ch-desk)" rx="2" />
        {/* Desk edge highlight */}
        <rect x={DSK_X1} y={DSK_TOP} width={DSK_X2 - DSK_X1} height={3}
          fill="#7a5020" />
        {/* Desk legs */}
        {[DSK_X1 + DSK_LEG_W, DSK_X2 - DSK_LEG_W * 2].map((lx, i) => (
          <rect key={i} x={lx} y={DSK_TOP + DSK_H} width={DSK_LEG_W} height={GY - DSK_TOP - DSK_H}
            fill="#3a2006" rx="2" />
        ))}
        {/* Stretcher */}
        <rect x={DSK_X1 + 24} y={GY - 62} width={DSK_X2 - DSK_X1 - 48} height={10}
          fill="#2a1806" rx="2" />

        {/* Ledger book */}
        <rect x={LDG_X1} y={LDG_TOP} width={LDG_X2 - LDG_X1} height={LDG_H}
          fill="url(#ch-ledger)" stroke="#8a6028" strokeWidth="2" rx="2" />
        {/* Ledger spine */}
        <rect x={LDG_X1} y={LDG_TOP} width={14} height={LDG_H}
          fill="#6a2010" rx="1" />
        {/* Ledger ruled lines */}
        {LDG_LINES.map((t, i) => (
          <line key={i}
            x1={LDG_X1 + 18} y1={LDG_TOP + t * LDG_H}
            x2={LDG_X2 - 8} y2={LDG_TOP + t * LDG_H}
            stroke="#8a7840" strokeWidth="0.8" opacity="0.7" />
        ))}
        {/* Column divider */}
        <line x1={LDG_X1 + 140} y1={LDG_TOP + 4} x2={LDG_X1 + 140} y2={LDG_TOP + LDG_H - 4}
          stroke="#8a7840" strokeWidth="0.8" opacity="0.5" />
        {/* Ink entries (animated scratch) */}
        <line x1={scratchX - 18} y1={LDG_TOP + 20}
          x2={scratchX + 22} y2={LDG_TOP + 20}
          stroke="#1a1408" strokeWidth="1" opacity="0.7" />
        <line x1={scratchX - 24} y1={LDG_TOP + 36}
          x2={scratchX + 14} y2={LDG_TOP + 36}
          stroke="#1a1408" strokeWidth="1" opacity="0.7" />
        <line x1={LDG_X1 + 148} y1={LDG_TOP + 20}
          x2={LDG_X2 - 18} y2={LDG_TOP + 20}
          stroke="#1a1408" strokeWidth="1" opacity="0.5" />
        <line x1={LDG_X1 + 148} y1={LDG_TOP + 36}
          x2={LDG_X2 - 28} y2={LDG_TOP + 36}
          stroke="#1a1408" strokeWidth="1" opacity="0.5" />
        {/* Totals line */}
        <line x1={LDG_X1 + 18} y1={LDG_TOP + LDG_H - 12}
          x2={LDG_X2 - 8} y2={LDG_TOP + LDG_H - 12}
          stroke="#8a2010" strokeWidth="1.5" opacity="0.7" />

        {/* Inkwell */}
        <ellipse cx={INK_CX} cy={INK_CY} rx={16} ry={10} fill="#1a0e08" stroke="#3a2808" strokeWidth="2" />
        <ellipse cx={INK_CX} cy={INK_CY - 2} rx={12} ry={7} fill="#08080c" />
        {/* Quill */}
        <line x1={QUILL_BASE_X} y1={QUILL_BASE_Y}
          x2={quillBarbX} y2={quillBarbY}
          stroke="#e8d898" strokeWidth="3" strokeLinecap="round" />
        <line x1={QUILL_BASE_X} y1={QUILL_BASE_Y}
          x2={quillTipX} y2={quillTipY}
          stroke="#d4c070" strokeWidth="2" strokeLinecap="round" />
        {/* Quill barbs */}
        <path d={`M${QUILL_BASE_X} ${QUILL_BASE_Y} Q${quillBarbX - 12} ${quillBarbY - 10} ${quillBarbX - 6} ${quillBarbY + 8}`}
          fill="none" stroke="#e8d898" strokeWidth="1.5" opacity="0.6" />
        <path d={`M${QUILL_BASE_X} ${QUILL_BASE_Y} Q${quillBarbX + 14} ${quillBarbY - 8} ${quillBarbX + 8} ${quillBarbY + 10}`}
          fill="none" stroke="#e8d898" strokeWidth="1.5" opacity="0.6" />

        {/* === CANDLE === */}
        <rect x={CND_CX - CND_W / 2} y={CND_CY - CND_H} width={CND_W} height={CND_H}
          fill="#f4eed8" stroke="#d4c8a0" strokeWidth="1" rx="2" />
        {/* Wax drips */}
        <path d={`M${CND_CX - 4} ${CND_CY - CND_H} Q${CND_CX - 6} ${CND_CY - CND_H + 12} ${CND_CX - 7} ${CND_CY - CND_H + 22}`}
          fill="none" stroke="#f4eed8" strokeWidth="4" strokeLinecap="round" opacity="0.7" />
        {/* Flame */}
        <ellipse cx={CND_CX + fl1} cy={CND_CY - CND_H - flH * 0.4}
          rx={5 + fl2} ry={flH * 0.55}
          fill="#f8c040" filter="url(#ch-glow)" opacity="0.9" />
        <ellipse cx={CND_CX + fl1 * 0.4} cy={CND_CY - CND_H - flH * 0.6}
          rx={3} ry={flH * 0.35}
          fill="#fff8c0" opacity="0.95" />
        {/* Wick */}
        <line x1={CND_CX} y1={CND_CY - CND_H} x2={CND_CX + fl1 * 0.2} y2={CND_CY - CND_H - 8}
          stroke="#2a1808" strokeWidth="1.5" />
        {/* Candlestick holder */}
        <ellipse cx={CND_CX} cy={CND_CY} rx={18} ry={6} fill="#8a7028" stroke="#6a5018" strokeWidth="1.5" />

        {/* === ABACUS === */}
        {/* Frame */}
        <rect x={ABX_X1} y={ABX_TOP} width={ABX_X2 - ABX_X1} height={ABX_BOT - ABX_TOP}
          fill="#4a2806" stroke="#2a1604" strokeWidth="2" rx="3" />
        {/* Center divider bar */}
        <rect x={ABX_X1 + 4} y={ABX_TOP + (ABX_BOT - ABX_TOP) * 0.38}
          width={ABX_X2 - ABX_X1 - 8} height={6}
          fill="#3a1e04" />
        {/* Rods and beads */}
        {Array.from({ length: AB_ROWS }, (_, ri) => {
          const rodX = ABX_X1 + 14 + ri * ((ABX_X2 - ABX_X1 - 28) / (AB_ROWS - 1));
          const beadCount = abRowCounts[ri] ?? 5;
          const rowH = ABX_BOT - ABX_TOP - 12;
          const beadH = rowH / (AB_BEADS + 1);
          const nodes: React.ReactNode[] = [];
          // Rod
          nodes.push(
            <line key="rod" x1={rodX} y1={ABX_TOP + 4} x2={rodX} y2={ABX_BOT - 4}
              stroke="#5a3808" strokeWidth="2" />
          );
          // Beads — left (pushed) vs right (idle)
          for (let bi = 0; bi < AB_BEADS; bi++) {
            const pushed = bi < beadCount;
            const by = ABX_TOP + 8 + bi * beadH;
            nodes.push(
              <ellipse key={`b${bi}`}
                cx={rodX} cy={by} rx={8} ry={5}
                fill={pushed ? "#c88030" : "#8a5818"}
                stroke={pushed ? "#8a5010" : "#5a3008"} strokeWidth="1" />
            );
          }
          return <g key={ri}>{nodes}</g>;
        })}

        {/* === CLERK FIGURE === */}
        {/* Stool */}
        <rect x={CLK_X - 18} y={CLK_HIP + 12} width={36} height={8}
          fill="#3a2006" rx="2" />
        <line x1={CLK_X - 14} y1={CLK_HIP + 20} x2={CLK_X - 14} y2={GY}
          stroke="#3a2006" strokeWidth="5" strokeLinecap="round" />
        <line x1={CLK_X + 14} y1={CLK_HIP + 20} x2={CLK_X + 14} y2={GY}
          stroke="#3a2006" strokeWidth="5" strokeLinecap="round" />
        {/* Legs */}
        <rect x={CLK_X - 14} y={CLK_HIP} width={11} height={CLK_HIP - GY + 104}
          fill="#1a1008" rx="3" />
        <rect x={CLK_X + 3} y={CLK_HIP} width={11} height={CLK_HIP - GY + 104}
          fill="#1a1008" rx="3" />
        {/* Torso */}
        <rect x={CLK_X - 16} y={CLK_SH} width={32} height={CLK_HIP - CLK_SH + 14}
          fill="#1e1a3a" rx="4" />
        {/* Waistcoat */}
        <rect x={CLK_X - 10} y={CLK_SH + 8} width={20} height={CLK_HIP - CLK_SH}
          fill="#3a3028" rx="2" />
        {/* Writing arm */}
        <line x1={CLK_X + 14} y1={CLK_SH + 22}
          x2={armEndX} y2={armEndY}
          stroke="#1e1a3a" strokeWidth="10" strokeLinecap="round" />
        {/* Left arm on desk */}
        <line x1={CLK_X - 14} y1={CLK_SH + 22}
          x2={CLK_X - 48} y2={DSK_TOP - 4}
          stroke="#1e1a3a" strokeWidth="10" strokeLinecap="round" />
        {/* Head */}
        <circle cx={CLK_X} cy={CLK_HEAD} r={19} fill="#c4945c" />
        {/* Wig / hair */}
        <path d={`M${CLK_X - 19} ${CLK_HEAD + 4} Q${CLK_X - 26} ${CLK_HEAD - 28} ${CLK_X} ${CLK_HEAD - 32} Q${CLK_X + 26} ${CLK_HEAD - 28} ${CLK_X + 19} ${CLK_HEAD + 4}`}
          fill="#e8e0d0" />
        {/* Wig queue/tail suggestion */}
        <path d={`M${CLK_X + 18} ${CLK_HEAD + 2} Q${CLK_X + 28} ${CLK_HEAD + 18} ${CLK_X + 20} ${CLK_HEAD + 38}`}
          fill="none" stroke="#d8d0c0" strokeWidth="6" strokeLinecap="round" />
        {/* Face features */}
        <circle cx={CLK_X - 6} cy={CLK_HEAD + 1} r={2} fill="#6a3818" />
        <circle cx={CLK_X + 6} cy={CLK_HEAD + 1} r={2} fill="#6a3818" />
        <path d={`M${CLK_X - 5} ${CLK_HEAD + 8} Q${CLK_X} ${CLK_HEAD + 12} ${CLK_X + 5} ${CLK_HEAD + 8}`}
          fill="none" stroke="#6a3818" strokeWidth="1.5" />
        {/* Stock/cravat */}
        <rect x={CLK_X - 8} y={CLK_HEAD + 15} width={16} height={10}
          fill="#f4f0e8" rx="2" />

        {/* Second quill on desk (spare) */}
        <line x1={DSK_X1 + 64} y1={DSK_TOP - 2}
          x2={DSK_X1 + 96} y2={DSK_TOP - 38}
          stroke="#d4c070" strokeWidth="2" strokeLinecap="round" opacity="0.7" />

        {/* Sand shaker (blotter) */}
        <ellipse cx={LDG_X2 + 88} cy={DSK_TOP - 4} rx={9} ry={14}
          fill="#c8b870" stroke="#8a7040" strokeWidth="1.5" />
        <ellipse cx={LDG_X2 + 88} cy={DSK_TOP - 16} rx={7} ry={4}
          fill="#e8d898" />

        {/* Rolled document tied with ribbon */}
        <rect x={DSK_X1 + 284} y={DSK_TOP - 32} width={52} height={30}
          fill="#f0e8cc" stroke="#c4b478" strokeWidth="1.5" rx="12" />
        <line x1={DSK_X1 + 308} y1={DSK_TOP - 38} x2={DSK_X1 + 312} y2={DSK_TOP - 2}
          stroke="#8a1818" strokeWidth="2" />

        {/* Seal press on desk corner */}
        <rect x={DSK_X2 - 48} y={DSK_TOP - 42} width={28} height={40}
          fill="#4a3008" stroke="#2a1806" strokeWidth="1.5" rx="3" />
        <circle cx={DSK_X2 - 34} cy={DSK_TOP - 42} r={12}
          fill="#3a2006" stroke="#2a1006" strokeWidth="2" />
        <circle cx={DSK_X2 - 34} cy={DSK_TOP - 42} r={7}
          fill="#c89030" />

        {/* Sign / plaque over bookshelf */}
        <rect x={628} y={CEIL + 14} width={312} height={38}
          fill="#2a1808" stroke="#c89030" strokeWidth="2" rx="3" />
        <text x={784} y={CEIL + 39} textAnchor="middle"
          fontFamily="Georgia, serif" fontSize="15" fontWeight="bold"
          fill="#c89030" letterSpacing="3">
          SHREWSBURY COUNTING HOUSE
        </text>

        {/* Caption */}
        <text x={W / 2} y={H - 10} textAnchor="middle"
          fontFamily="Georgia, serif" fontSize="13" fill="#8a6030" letterSpacing="3" opacity="0.7">
          ROUTE 9 MERCHANT LEDGERS · EST. 1786
        </text>
      </svg>
    </section>
  );
}
