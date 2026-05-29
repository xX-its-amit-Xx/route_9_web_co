"use client";
import { useEffect, useRef, useState } from "react";

// Pass 53: Victorian letterpress print shop — platen press, type trays, ink rollers, broadside
// Route 9 Web Co. local flavor: freshly-printed broadside for a Shrewsbury shop

const W = 1440, H = 580;

// Platen press body — iron frame
const PRS_X = 118, PRS_Y = 148, PRS_W = 280, PRS_H = 340;
const BED_X = PRS_X + 24, BED_Y = PRS_Y + 60, BED_W = 232, BED_H = 160;
const PLT_X = BED_X + 8, PLT_Y = BED_Y + 8, PLT_W = BED_W - 16, PLT_H = BED_H - 16;

// Flywheel
const FW_CX = PRS_X + PRS_W - 28, FW_CY = PRS_Y + 72, FW_R = 44;
const FW_SPOKES = Array.from({ length: 6 }, (_, i) => {
  const a = (i * 60) * Math.PI / 180;
  return {
    x1: Math.round(FW_CX + 8 * Math.cos(a)),
    y1: Math.round(FW_CY + 8 * Math.sin(a)),
    x2: Math.round(FW_CX + (FW_R - 4) * Math.cos(a)),
    y2: Math.round(FW_CY + (FW_R - 4) * Math.sin(a)),
  };
});

// Ink rollers on press bed
const INK_ROLLERS: [number, number, number, number][] = [
  [BED_X + 20, BED_Y - 12, BED_W - 40, 9],
  [BED_X + 20, BED_Y + BED_H + 3, BED_W - 40, 9],
];

// Type trays on shelf
const TRAY_Y = 148;
const TRAYS: [number, number, number, number][] = [
  [476, TRAY_Y, 124, 84],
  [612, TRAY_Y, 124, 84],
  [748, TRAY_Y, 124, 84],
];

// Type tray cells (grid of small rectangles per tray)
type Cell = { x: number; y: number; w: number; h: number };
const TRAY_CELLS: Cell[][] = TRAYS.map(([tx, ty, tw, th]) => {
  const cols = 8, rows = 5;
  const cw = (tw - 6) / cols, ch = (th - 6) / rows;
  return Array.from({ length: rows * cols }, (_, idx) => {
    const col = idx % cols, row = Math.floor(idx / cols);
    return { x: tx + 3 + col * cw, y: ty + 3 + row * ch, w: cw - 1, h: ch - 1 };
  });
});

// Ink cans on shelf
const INK_CANS: [number, number, number, number, string][] = [
  [886, TRAY_Y + 4, 26, 60, "#1a1a1a"],
  [918, TRAY_Y + 8, 22, 56, "#8b1a1a"],
  [946, TRAY_Y + 12, 20, 52, "#1a3a1a"],
];

// Printed broadside hanging to dry — center of scene
const BS_X = 560, BS_Y = 52, BS_W = 320, BS_H = 420;
// Clothesline
const CL_Y = 46;
// Clothespins
const PINS: [number, number][] = [
  [BS_X + 32, CL_Y],
  [BS_X + BS_W - 32, CL_Y],
];

// Broadside text lines (letterpress typography feel)
type TextLine = { text: string; y: number; size: number; weight: string; spacing: number; color: string };
const BS_LINES: TextLine[] = [
  { text: "ROUTE 9 WEB CO.", y: BS_Y + 54,  size: 28, weight: "700", spacing: 4,   color: "#1a1206" },
  { text: "——————————",      y: BS_Y + 76,  size: 11, weight: "400", spacing: 2,   color: "#6b4c1e" },
  { text: "SHREWSBURY",      y: BS_Y + 100, size: 18, weight: "700", spacing: 6,   color: "#1a1206" },
  { text: "MASSACHUSETTS",   y: BS_Y + 120, size: 11, weight: "600", spacing: 5,   color: "#5a3a10" },
  { text: "——————————",      y: BS_Y + 134, size: 11, weight: "400", spacing: 2,   color: "#6b4c1e" },
  { text: "BESPOKE",         y: BS_Y + 162, size: 22, weight: "700", spacing: 3,   color: "#1a1206" },
  { text: "WEB DESIGN",      y: BS_Y + 186, size: 22, weight: "700", spacing: 3,   color: "#1a1206" },
  { text: "FOR THE LOCAL",   y: BS_Y + 214, size: 12, weight: "400", spacing: 4,   color: "#5a3a10" },
  { text: "CRAFTSMAN",       y: BS_Y + 230, size: 12, weight: "400", spacing: 4,   color: "#5a3a10" },
  { text: "——————————",      y: BS_Y + 246, size: 11, weight: "400", spacing: 2,   color: "#6b4c1e" },
  { text: "ROUTE 9 CORRIDOR",y: BS_Y + 268, size: 11, weight: "600", spacing: 4,   color: "#1a1206" },
  { text: "EST. 2024",       y: BS_Y + 284, size: 10, weight: "400", spacing: 5,   color: "#7a5a28" },
  { text: "——————————",      y: BS_Y + 298, size: 11, weight: "400", spacing: 2,   color: "#6b4c1e" },
  { text: "HAND CRAFTED",    y: BS_Y + 324, size: 13, weight: "700", spacing: 5,   color: "#1a1206" },
  { text: "BY APPOINTMENT",  y: BS_Y + 342, size: 11, weight: "400", spacing: 3,   color: "#5a3a10" },
  { text: "——————————",      y: BS_Y + 356, size: 11, weight: "400", spacing: 2,   color: "#6b4c1e" },
  { text: "★  ★  ★",         y: BS_Y + 378, size: 11, weight: "400", spacing: 8,   color: "#8b6010" },
  { text: "amitshenoy.com",  y: BS_Y + 398, size: 10, weight: "400", spacing: 2,   color: "#7a5a28" },
];

// Ornamental border on broadside
const BS_BORDER_INSET = 8;

// Woodblock ornaments (small decorative squares on broadside)
const WB_ORNAMENTS: [number, number, number][] = [
  [BS_X + BS_BORDER_INSET + 6, BS_Y + BS_BORDER_INSET + 6, 20],
  [BS_X + BS_W - BS_BORDER_INSET - 26, BS_Y + BS_BORDER_INSET + 6, 20],
  [BS_X + BS_BORDER_INSET + 6, BS_Y + BS_H - BS_BORDER_INSET - 26, 20],
  [BS_X + BS_W - BS_BORDER_INSET - 26, BS_Y + BS_H - BS_BORDER_INSET - 26, 20],
];

// Ink smear marks on press bed (letterpress texture)
const INK_SMEARS: [number, number, number, number, number][] = [
  [BED_X + 28, BED_Y + 28, 60, 8, -5],
  [BED_X + 100, BED_Y + 60, 40, 6, 3],
  [BED_X + 52, BED_Y + 104, 80, 5, -2],
  [BED_X + 140, BED_Y + 128, 44, 7, 6],
];

// Paper stack on the press feed table
const STK_X = PRS_X - 68, STK_Y = BED_Y + BED_H - 8;
const PAPER_STACK: [number, number][] = Array.from({ length: 9 }, (_, i) => [
  STK_X + i * 2,
  STK_Y - i * 3,
]);

// Finished prints stacked on side table
const FIN_X = 940, FIN_Y = 352;
const FIN_STACK: [number, number, number][] = [
  [FIN_X, FIN_Y + 24, 2],
  [FIN_X - 3, FIN_Y + 18, 3],
  [FIN_X - 6, FIN_Y + 12, 2],
  [FIN_X - 2, FIN_Y + 6, 2],
  [FIN_X - 4, FIN_Y, 3],
];

// Wooden floor boards
const FLOOR_Y = 488;
const FLOORBOARDS: [number, number, number][] = Array.from({ length: 10 }, (_, i) => [
  i * 154,
  FLOOR_Y,
  140 + (i * 7) % 22,
]);

// Shelving unit behind trays
const SHELF_X = 460, SHELF_Y = 138, SHELF_W = 520, SHELF_H = 120;

// Window with mullions (back wall)
const WIN_X = 1050, WIN_Y = 148, WIN_W = 180, WIN_H = 220;
const WIN_MULLIONS_H = [1, 2, 3].map(r => WIN_Y + r * WIN_H / 4);
const WIN_MULLIONS_V = [1].map(c => WIN_X + c * WIN_W / 2);

// Gas lamp on press (Victorian era lighting)
const LAMP_X = PRS_X + PRS_W + 22, LAMP_Y = PRS_Y + 40;
const LAMP_POLE_X1 = LAMP_X, LAMP_POLE_Y1 = FLOOR_Y;
const LAMP_POLE_X2 = LAMP_X, LAMP_POLE_Y2 = LAMP_Y + 32;
const LAMP_ARM_D = `M ${LAMP_POLE_X2},${LAMP_POLE_Y2} C ${LAMP_POLE_X2+16},${LAMP_POLE_Y2-24} ${LAMP_X+28},${LAMP_Y+8} ${LAMP_X+32},${LAMP_Y}`;

export function PrintshopBroadside() {
  const ref = useRef<SVGSVGElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setActive(true); obs.disconnect(); } },
      { threshold: 0.12 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const tr = (d: number) =>
    active ? `opacity 0.65s ease ${d}s, transform 0.65s ease ${d}s` : "none";

  return (
    <section
      aria-label="Vintage letterpress printshop broadside"
      style={{ background: "#2a1f0e", overflow: "hidden", position: "relative" }}
    >
      <style>{`
        @keyframes psb-flywheel {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes psb-roller {
          0%   { transform: translateX(0px); }
          50%  { transform: translateX(${BED_W - 44}px); }
          100% { transform: translateX(0px); }
        }
        @keyframes psb-sway {
          0%,100% { transform: rotate(-1.2deg) translateX(0px); }
          50%      { transform: rotate(1.2deg) translateX(2px); }
        }
        @keyframes psb-flicker {
          0%,100% { opacity: 0.82; }
          40%      { opacity: 0.96; }
          70%      { opacity: 0.74; }
        }
        .psb-wheel {
          animation: ${active ? "psb-flywheel 3.2s linear infinite" : "none"};
          transform-origin: ${FW_CX}px ${FW_CY}px;
        }
        .psb-roller-anim {
          animation: ${active ? "psb-roller 4.8s ease-in-out infinite" : "none"};
        }
        .psb-broadside {
          animation: ${active ? "psb-sway 5s ease-in-out infinite" : "none"};
          transform-origin: ${BS_X + BS_W / 2}px ${CL_Y}px;
        }
        .psb-lamp-glow {
          animation: ${active ? "psb-flicker 2.4s ease-in-out infinite" : "none"};
        }
      `}</style>

      <svg
        ref={ref}
        viewBox={`0 0 ${W} ${H}`}
        width="100%"
        preserveAspectRatio="xMidYMid meet"
        aria-hidden="true"
        style={{ display: "block", maxHeight: 580 }}
      >
        <defs>
          {/* Aged paper texture for broadside */}
          <filter id="psb-paper" x="-2%" y="-2%" width="104%" height="104%">
            <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" seed="12" result="noise" />
            <feColorMatrix type="saturate" values="0" in="noise" result="gray" />
            <feBlend in="SourceGraphic" in2="gray" mode="multiply" result="blend" />
            <feComposite in="blend" in2="SourceGraphic" operator="in" />
          </filter>
          {/* Ink smear texture */}
          <filter id="psb-ink" x="-5%" y="-5%" width="110%" height="110%">
            <feTurbulence type="turbulence" baseFrequency="0.4 0.8" numOctaves="2" seed="7" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="2.5" xChannelSelector="R" yChannelSelector="G" />
          </filter>
          {/* Warm lamp glow */}
          <radialGradient id="psb-lamp-gradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="#f5c842" stopOpacity="0.55" />
            <stop offset="40%"  stopColor="#e8973a" stopOpacity="0.28" />
            <stop offset="100%" stopColor="#c04a00" stopOpacity="0" />
          </radialGradient>
          {/* Window light */}
          <linearGradient id="psb-window-light" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#d4e8f0" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#a8c8d8" stopOpacity="0.3" />
          </linearGradient>
          {/* Room ambient light from window */}
          <radialGradient id="psb-room-light" cx="73%" cy="25%" r="55%">
            <stop offset="0%"   stopColor="#c8e0ec" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#1a0e04" stopOpacity="0" />
          </radialGradient>
          {/* Press iron gradient */}
          <linearGradient id="psb-iron" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%"   stopColor="#7a7670" />
            <stop offset="50%"  stopColor="#5a5650" />
            <stop offset="100%" stopColor="#3a3630" />
          </linearGradient>
          {/* Broadside paper */}
          <linearGradient id="psb-bspaper" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%"   stopColor="#f2e8cc" />
            <stop offset="100%" stopColor="#e8d8a8" />
          </linearGradient>
          {/* Floor gradient */}
          <linearGradient id="psb-floor" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#4a3018" />
            <stop offset="100%" stopColor="#2a180a" />
          </linearGradient>
          {/* Wall */}
          <linearGradient id="psb-wall" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#3a2c18" />
            <stop offset="100%" stopColor="#2e2210" />
          </linearGradient>
        </defs>

        {/* Back wall */}
        <rect x={0} y={0} width={W} height={FLOOR_Y} fill="url(#psb-wall)" />

        {/* Room ambient light overlay */}
        <rect x={0} y={0} width={W} height={FLOOR_Y} fill="url(#psb-room-light)" />

        {/* Floor */}
        <rect x={0} y={FLOOR_Y} width={W} height={H - FLOOR_Y} fill="url(#psb-floor)" />
        {FLOORBOARDS.map(([fx, fy, fw], i) => (
          <line
            key={i}
            x1={fx} y1={fy} x2={fx + fw} y2={fy}
            stroke="#3a2810" strokeWidth="1.5" opacity={0.6}
          />
        ))}
        {/* Floor highlight */}
        <line x1={0} y1={FLOOR_Y} x2={W} y2={FLOOR_Y} stroke="#7a5a2a" strokeWidth="2" opacity={0.5} />

        {/* Wainscoting */}
        <rect x={0} y={FLOOR_Y - 48} width={W} height={48} fill="#3a2810" opacity={0.7} />
        <line x1={0} y1={FLOOR_Y - 48} x2={W} y2={FLOOR_Y - 48} stroke="#5a4020" strokeWidth="1.5" />
        <line x1={0} y1={FLOOR_Y - 24} x2={W} y2={FLOOR_Y - 24} stroke="#5a4020" strokeWidth="0.75" opacity={0.5} />

        {/* Window */}
        <rect
          x={WIN_X} y={WIN_Y} width={WIN_W} height={WIN_H}
          fill="url(#psb-window-light)" rx={2}
          style={{
            opacity: active ? 1 : 0,
            transition: tr(0.2),
          }}
        />
        {/* Window frame */}
        <rect x={WIN_X - 6} y={WIN_Y - 6} width={WIN_W + 12} height={WIN_H + 12}
          fill="none" stroke="#5a4020" strokeWidth={7} rx={3} />
        {/* Mullions */}
        {WIN_MULLIONS_H.map((wy, i) => (
          <line key={`wh${i}`} x1={WIN_X} y1={wy} x2={WIN_X + WIN_W} y2={wy}
            stroke="#5a4020" strokeWidth={4} />
        ))}
        {WIN_MULLIONS_V.map((wx, i) => (
          <line key={`wv${i}`} x1={wx} y1={WIN_Y} x2={wx} y2={WIN_Y + WIN_H}
            stroke="#5a4020" strokeWidth={4} />
        ))}

        {/* Clothesline */}
        <line
          x1={460} y1={CL_Y + 2} x2={940} y2={CL_Y + 6}
          stroke="#5a4020" strokeWidth="2.5" opacity={0.8}
          style={{ opacity: active ? 0.8 : 0, transition: tr(0.1) }}
        />

        {/* Broadside hanging */}
        <g
          className="psb-broadside"
          style={{ opacity: active ? 1 : 0, transition: tr(0.4) }}
        >
          {/* Shadow */}
          <rect
            x={BS_X + 6} y={BS_Y + 8} width={BS_W} height={BS_H}
            fill="#0a0602" opacity={0.35} rx={1}
          />
          {/* Paper */}
          <rect
            x={BS_X} y={BS_Y} width={BS_W} height={BS_H}
            fill="url(#psb-bspaper)" rx={1}
            filter="url(#psb-paper)"
          />
          {/* Outer border */}
          <rect
            x={BS_X + BS_BORDER_INSET} y={BS_Y + BS_BORDER_INSET}
            width={BS_W - BS_BORDER_INSET * 2} height={BS_H - BS_BORDER_INSET * 2}
            fill="none" stroke="#5a3810" strokeWidth="2" rx={1}
          />
          {/* Inner border (double-rule) */}
          <rect
            x={BS_X + BS_BORDER_INSET + 4} y={BS_Y + BS_BORDER_INSET + 4}
            width={BS_W - (BS_BORDER_INSET + 4) * 2} height={BS_H - (BS_BORDER_INSET + 4) * 2}
            fill="none" stroke="#7a5818" strokeWidth="1" rx={1}
          />
          {/* Woodblock corner ornaments */}
          {WB_ORNAMENTS.map(([ox, oy, os], i) => (
            <g key={i}>
              <rect x={ox} y={oy} width={os} height={os} fill="#5a3810" opacity={0.7} />
              <line x1={ox + 4} y1={oy + os / 2} x2={ox + os - 4} y2={oy + os / 2}
                stroke="#c8901a" strokeWidth="1" opacity={0.6} />
              <line x1={ox + os / 2} y1={oy + 4} x2={ox + os / 2} y2={oy + os - 4}
                stroke="#c8901a" strokeWidth="1" opacity={0.6} />
            </g>
          ))}
          {/* Text lines */}
          {BS_LINES.map((line, i) => (
            <text
              key={i}
              x={BS_X + BS_W / 2}
              y={line.y}
              textAnchor="middle"
              fontFamily="'Georgia', 'Times New Roman', serif"
              fontSize={line.size}
              fontWeight={line.weight}
              letterSpacing={line.spacing}
              fill={line.color}
              style={{ filter: "url(#psb-ink)" }}
            >
              {line.text}
            </text>
          ))}
        </g>

        {/* Clothespins */}
        {PINS.map(([px, py], i) => (
          <g key={i}>
            <rect x={px - 4} y={py - 2} width={8} height={16} fill="#8b6030" rx={1} />
            <line x1={px} y1={py + 8} x2={px} y2={py + 14} stroke="#5a3810" strokeWidth={1.5} />
          </g>
        ))}

        {/* Shelving unit */}
        <rect
          x={SHELF_X} y={SHELF_Y - 12} width={SHELF_W} height={SHELF_H + 20}
          fill="#3a2410" stroke="#5a3818" strokeWidth={1.5}
        />
        {/* Shelf surface */}
        <rect
          x={SHELF_X} y={SHELF_Y - 12} width={SHELF_W} height={12}
          fill="#4a3018" stroke="#6a4820" strokeWidth={1}
        />

        {/* Type trays */}
        {TRAYS.map(([tx, ty, tw, th], ti) => (
          <g
            key={ti}
            style={{ opacity: active ? 1 : 0, transition: tr(0.3 + ti * 0.1) }}
          >
            <rect x={tx} y={ty} width={tw} height={th} fill="#5a3c18" rx={1} />
            {(TRAY_CELLS[ti] ?? []).map((cell, ci) => (
              <rect
                key={ci}
                x={cell.x} y={cell.y}
                width={cell.w} height={cell.h}
                fill={ci % 7 === 0 ? "#2a1a08" : "#4a3010"}
                stroke="#3a2408" strokeWidth={0.4}
              />
            ))}
            {/* Tray label */}
            <text
              x={tx + tw / 2} y={ty + th + 14}
              textAnchor="middle"
              fontFamily="'Georgia', serif"
              fontSize={9} fill="#8a6a38" letterSpacing={2}
            >
              {ti === 0 ? "CAPS" : ti === 1 ? "LOWER" : "ORNMT"}
            </text>
          </g>
        ))}

        {/* Ink cans */}
        {INK_CANS.map(([ix, iy, iw, ih, ic], i) => (
          <g key={i} style={{ opacity: active ? 1 : 0, transition: tr(0.4 + i * 0.08) }}>
            {/* Can body */}
            <rect x={ix} y={iy} width={iw} height={ih} fill={ic} rx={2} />
            {/* Can lid */}
            <rect x={ix - 1} y={iy - 4} width={iw + 2} height={7} fill="#3a3a3a" rx={2} />
            {/* Ink label */}
            <rect x={ix + 2} y={iy + ih / 2 - 8} width={iw - 4} height={16}
              fill="#f0e8c0" opacity={0.7} />
            <text
              x={ix + iw / 2} y={iy + ih / 2 + 1}
              textAnchor="middle"
              fontFamily="'Georgia', serif"
              fontSize={6} fill="#1a1206"
            >
              INK
            </text>
          </g>
        ))}

        {/* ======= PLATEN PRESS ======= */}
        <g style={{ opacity: active ? 1 : 0, transition: tr(0.15) }}>

          {/* Press legs */}
          {[PRS_X + 16, PRS_X + PRS_W - 32].map((lx, i) => (
            <rect key={i} x={lx} y={PRS_Y + PRS_H - 20} width={16} height={FLOOR_Y - (PRS_Y + PRS_H - 20)}
              fill="url(#psb-iron)" />
          ))}

          {/* Press main frame */}
          <rect x={PRS_X} y={PRS_Y} width={PRS_W} height={PRS_H}
            fill="url(#psb-iron)" rx={4} />

          {/* Press bed (type form chase) */}
          <rect x={BED_X} y={BED_Y} width={BED_W} height={BED_H}
            fill="#2a2820" rx={2} />

          {/* Platen (printing plate) */}
          <rect x={PLT_X} y={PLT_Y} width={PLT_W} height={PLT_H}
            fill="#3a3628" rx={1} opacity={0.9} />

          {/* Ink smears on bed */}
          {INK_SMEARS.map(([sx, sy, sw, sh, sr], i) => (
            <rect
              key={i} x={sx} y={sy} width={sw} height={sh}
              fill="#0a0a0a" opacity={0.6} rx={2}
              transform={`rotate(${sr}, ${sx + sw / 2}, ${sy + sh / 2})`}
              filter="url(#psb-ink)"
            />
          ))}

          {/* Type form text impression (visible on platen) */}
          <text x={PLT_X + PLT_W / 2} y={PLT_Y + PLT_H / 2 - 10}
            textAnchor="middle"
            fontFamily="'Georgia', serif" fontSize={10} fill="#6a5a30"
            letterSpacing={3} opacity={0.7}
          >ROUTE 9 WEB CO.</text>
          <text x={PLT_X + PLT_W / 2} y={PLT_Y + PLT_H / 2 + 6}
            textAnchor="middle"
            fontFamily="'Georgia', serif" fontSize={8} fill="#5a4a28"
            letterSpacing={2} opacity={0.5}
          >SHREWSBURY · MA</text>

          {/* Roller tracks */}
          <line x1={BED_X + 4} y1={BED_Y - 8} x2={BED_X + BED_W - 4} y2={BED_Y - 8}
            stroke="#5a5650" strokeWidth={3} />
          <line x1={BED_X + 4} y1={BED_Y + BED_H + 8} x2={BED_X + BED_W - 4} y2={BED_Y + BED_H + 8}
            stroke="#5a5650" strokeWidth={3} />

          {/* Ink rollers (animated) */}
          <g className="psb-roller-anim">
            {INK_ROLLERS.map(([rx2, ry2, rw, rh], i) => (
              <g key={i}>
                <rect x={rx2} y={ry2} width={rw} height={rh} fill="#0a0a0a" rx={4} />
                <line x1={rx2 + 6} y1={ry2 + rh / 2} x2={rx2 + rw - 6} y2={ry2 + rh / 2}
                  stroke="#1a1a1a" strokeWidth={1} />
              </g>
            ))}
          </g>

          {/* Flywheel */}
          <g className="psb-wheel">
            <circle cx={FW_CX} cy={FW_CY} r={FW_R} fill="none" stroke="#6a6660" strokeWidth={5} />
            <circle cx={FW_CX} cy={FW_CY} r={8} fill="#5a5650" />
            {FW_SPOKES.map((sp, i) => (
              <line key={i}
                x1={sp.x1} y1={sp.y1} x2={sp.x2} y2={sp.y2}
                stroke="#6a6660" strokeWidth={3}
              />
            ))}
            {/* Flywheel rim detail */}
            <circle cx={FW_CX} cy={FW_CY} r={FW_R - 6} fill="none" stroke="#4a4640" strokeWidth={1} opacity={0.5} />
          </g>

          {/* Drive belt from flywheel to roller mechanism */}
          <line
            x1={FW_CX - 4} y1={FW_CY + FW_R}
            x2={BED_X + BED_W - 8} y2={BED_Y - 12}
            stroke="#3a3028" strokeWidth={2} opacity={0.5}
          />

          {/* Press lever / handle */}
          <path
            d={`M ${PRS_X + PRS_W - 18},${PRS_Y + PRS_H - 60} C ${PRS_X + PRS_W + 12},${PRS_Y + PRS_H - 80} ${PRS_X + PRS_W + 24},${PRS_Y + PRS_H - 48} ${PRS_X + PRS_W + 16},${PRS_Y + PRS_H - 28}`}
            fill="none" stroke="#7a7060" strokeWidth={6} strokeLinecap="round"
          />

          {/* Press nameplate */}
          <rect x={PRS_X + 24} y={PRS_Y + PRS_H - 52} width={PRS_W - 52} height={28}
            fill="#3a3028" rx={2} />
          <text
            x={PRS_X + PRS_W / 2} y={PRS_Y + PRS_H - 34}
            textAnchor="middle"
            fontFamily="'Georgia', serif" fontSize={9} fill="#c8a050"
            letterSpacing={3}
          >CHANDLER & PRICE</text>
        </g>

        {/* Paper stack (feed) */}
        {PAPER_STACK.map(([px2, py2], i) => (
          <rect key={i}
            x={px2} y={py2} width={72} height={3 + (i % 3) * 0.5}
            fill={`rgb(${232 - i * 3}, ${220 - i * 3}, ${190 - i * 2})`}
            stroke="#9a8048" strokeWidth={0.3}
            style={{ opacity: active ? 1 : 0, transition: tr(0.25 + i * 0.02) }}
          />
        ))}

        {/* Finished prints stack on side table */}
        <g style={{ opacity: active ? 1 : 0, transition: tr(0.5) }}>
          {/* Table surface */}
          <rect x={FIN_X - 12} y={FIN_Y + 28} width={116} height={8}
            fill="#4a3018" rx={2} />
          <rect x={FIN_X - 18} y={FIN_Y + 36} width={16} height={FLOOR_Y - (FIN_Y + 36)}
            fill="#3a2810" />
          <rect x={FIN_X + 84} y={FIN_Y + 36} width={16} height={FLOOR_Y - (FIN_Y + 36)}
            fill="#3a2810" />
          {FIN_STACK.map(([fx, fy, fw], i) => (
            <rect key={i}
              x={fx} y={fy} width={84 + fw} height={28}
              fill={`rgb(${234 - i * 4},${218 - i * 4},${182 - i * 3})`}
              stroke="#8a6830" strokeWidth={0.5}
            />
          ))}
          <text x={FIN_X + 42} y={FIN_Y + 16} textAnchor="middle"
            fontFamily="'Georgia', serif" fontSize={8} fill="#8a6838"
            letterSpacing={2}
          >PRINTED</text>
        </g>

        {/* Lamp pole */}
        <line
          x1={LAMP_POLE_X1} y1={LAMP_POLE_Y1}
          x2={LAMP_POLE_X2} y2={LAMP_POLE_Y2}
          stroke="#4a3818" strokeWidth={4}
          style={{ opacity: active ? 1 : 0, transition: tr(0.2) }}
        />
        {/* Lamp arm */}
        <path
          d={LAMP_ARM_D}
          fill="none" stroke="#5a4828" strokeWidth={3}
          style={{ opacity: active ? 1 : 0, transition: tr(0.22) }}
        />
        {/* Lamp glow */}
        <ellipse
          cx={LAMP_X + 32} cy={LAMP_Y - 12}
          rx={72} ry={56}
          fill="url(#psb-lamp-gradient)"
          className="psb-lamp-glow"
          style={{ opacity: active ? 1 : 0, transition: tr(0.25) }}
        />
        {/* Lamp body */}
        <ellipse cx={LAMP_X + 32} cy={LAMP_Y - 4} rx={11} ry={16}
          fill="#f0b830" opacity={0.9}
          className="psb-lamp-glow"
          style={{ opacity: active ? 0.9 : 0, transition: tr(0.26) }}
        />
        {/* Lamp shade */}
        <path
          d={`M ${LAMP_X + 20},${LAMP_Y - 6} L ${LAMP_X + 16},${LAMP_Y - 22} L ${LAMP_X + 48},${LAMP_Y - 22} L ${LAMP_X + 44},${LAMP_Y - 6} Z`}
          fill="#3a2818" stroke="#5a4020" strokeWidth={1}
          style={{ opacity: active ? 1 : 0, transition: tr(0.27) }}
        />

        {/* Caption */}
        <text
          x={W / 2} y={H - 18}
          textAnchor="middle"
          fontFamily="'Georgia', 'Times New Roman', serif"
          fontSize={12} fill="#8a7050"
          letterSpacing={5}
          style={{ opacity: active ? 0.7 : 0, transition: tr(0.9) }}
        >
          PRINTED BY HAND · SHREWSBURY · ROUTE 9 CORRIDOR · EST. 2024
        </text>
      </svg>
    </section>
  );
}
