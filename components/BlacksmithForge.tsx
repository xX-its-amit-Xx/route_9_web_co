"use client";
import { useEffect, useRef, useState } from "react";

// Pass 56: Blacksmith forge interior — glowing hearth, animated sparks, anvil, bellows, tool pegboard

const W = 1440, H = 580;
const FLOOR_Y = 492;

// ─── Stone wall background ────────────────────────────────────────────────
type Stone = [number, number, number, number, number]; // x,y,w,h,shade
const STONES: Stone[] = [
  // row 1 (top)
  [0,0,148,48,0],[148,0,116,48,4],[264,0,132,48,-3],[396,0,108,48,5],[504,0,140,48,-2],
  [644,0,124,48,3],[768,0,136,48,-4],[904,0,118,48,2],[1022,0,130,48,-1],[1152,0,144,48,4],
  [1296,0,144,48,-3],
  // row 2
  [0,48,124,46,3],[124,48,140,46,-2],[264,48,112,46,4],[376,48,136,46,-1],[512,48,128,46,2],
  [640,48,116,46,-3],[756,48,142,46,1],[898,48,130,46,-2],[1028,48,120,46,5],[1148,48,138,46,-4],
  [1286,48,154,46,2],
  // row 3
  [0,94,136,50,-1],[136,94,118,50,3],[254,94,144,50,-4],[398,94,126,50,2],[524,94,132,50,-2],
  [656,94,114,50,4],[770,94,140,50,-1],[910,94,122,50,3],[1032,94,134,50,-3],[1166,94,128,50,1],
  [1294,94,146,50,-2],
  // row 4
  [0,144,122,48,2],[122,144,138,48,-3],[260,144,130,48,4],[390,144,116,48,-1],[506,144,142,48,3],
  [648,144,120,48,-2],[768,144,136,48,1],[904,144,128,48,-4],[1032,144,126,48,2],[1158,144,140,48,-1],
  [1298,144,142,48,3],
  // rows 5-8 (lower wall, partially hidden by scene)
  [0,192,146,50,-2],[146,192,112,50,3],[258,192,138,50,-4],[396,192,124,50,1],[520,192,130,50,-1],
  [650,192,118,50,2],[768,192,144,50,-3],[912,192,120,50,4],[1032,192,136,50,-2],[1168,192,130,50,1],
  [1298,192,142,50,-3],
  [0,242,132,50,3],[132,242,140,50,-1],[272,242,116,50,2],[388,242,138,50,-4],[526,242,124,50,1],
  [650,242,128,50,-2],[778,242,114,50,3],[892,242,142,50,-1],[1034,242,126,50,4],[1160,242,136,50,-2],
  [1296,242,144,50,1],
];

// ─── Forge hearth ─────────────────────────────────────────────────────────
const HEARTH_X  = 580, HEARTH_W  = 280;
const HEARTH_Y  = 292; // top of hearth structure
const HOOD_Y    = 148; // chimney hood bottom
const FIREBOX_X = HEARTH_X + 32, FIREBOX_W = HEARTH_W - 64;
const FIREBOX_Y = HEARTH_Y + 58, FIREBOX_H = 78;
const FIRE_CX   = FIREBOX_X + FIREBOX_W / 2; // 754
const FIRE_CY   = FIREBOX_Y + FIREBOX_H - 10;

// Coal bed
const COAL_Y = FIREBOX_Y + FIREBOX_H - 18;

// Chimney hood shape
const HOOD_D =
  `M ${HEARTH_X - 24},${HEARTH_Y} ` +
  `L ${HEARTH_X + 32},${HOOD_Y + 12} ` +
  `L ${HEARTH_X + 64},${HOOD_Y} ` +
  `L ${HEARTH_X + HEARTH_W - 64},${HOOD_Y} ` +
  `L ${HEARTH_X + HEARTH_W - 32},${HOOD_Y + 12} ` +
  `L ${HEARTH_X + HEARTH_W + 24},${HEARTH_Y} Z`;

// Chimney flue (vertical rectangle)
const FLUE_X = HEARTH_X + 64, FLUE_W = HEARTH_W - 128;

// Fire flames (layered ellipses / organic shapes)
type Flame = { cx: number; cy: number; rx: number; ry: number; color: string; delay: string };
const FLAMES: Flame[] = [
  { cx: FIRE_CX - 22, cy: FIRE_CY - 20, rx: 18, ry: 32, color: "#ff8800", delay: "0s"   },
  { cx: FIRE_CX,      cy: FIRE_CY - 32, rx: 24, ry: 44, color: "#ffaa00", delay: "0.3s" },
  { cx: FIRE_CX + 18, cy: FIRE_CY - 18, rx: 16, ry: 28, color: "#ff6600", delay: "0.6s" },
  { cx: FIRE_CX - 8,  cy: FIRE_CY - 44, rx: 14, ry: 26, color: "#ffcc40", delay: "0.15s"},
  { cx: FIRE_CX + 6,  cy: FIRE_CY - 52, rx: 10, ry: 22, color: "#ffee80", delay: "0.45s"},
  // inner bright core
  { cx: FIRE_CX,      cy: FIRE_CY - 20, rx: 12, ry: 18, color: "#ffffff", delay: "0s"   },
];

// Spark positions — deterministic grid offset by prime-step
type Spark = [number, number, number, number, string]; // x, y, vx, vy, delay
const SPARKS: Spark[] = Array.from({ length: 28 }, (_, i) => {
  const angle  = (i * 137.5) % 360;               // golden-angle spread
  const dist   = 24 + (i * 17) % 48;
  const rad    = angle * Math.PI / 180;
  const x = FIRE_CX + Math.round(Math.cos(rad) * dist * 0.6);
  const y = FIRE_CY - 20 + Math.round(Math.sin(rad) * dist * 0.4) - 10;
  const vx = ((i * 23) % 40) - 20;                // -20..+20 drift
  const vy = -((i * 13) % 38) - 18;               // upward
  const delay = `${((i * 0.18) % 1.8).toFixed(2)}s`;
  return [x, y, vx, vy, delay];
});

// ─── Anvil ────────────────────────────────────────────────────────────────
const ANV_CX = 396;
const ANV_BASE_X = ANV_CX - 48, ANV_BASE_W = 96, ANV_BASE_H = 28;
const ANV_WAIST_X = ANV_CX - 28, ANV_WAIST_W = 56, ANV_WAIST_H = 36;
const ANV_TOP_X = ANV_CX - 54, ANV_TOP_W = 108, ANV_TOP_H = 22;
const ANV_HORN_D = `M ${ANV_TOP_X},${FLOOR_Y - ANV_BASE_H - ANV_WAIST_H - ANV_TOP_H + 8} L ${ANV_TOP_X - 36},${FLOOR_Y - ANV_BASE_H - ANV_WAIST_H - 8} L ${ANV_TOP_X},${FLOOR_Y - ANV_BASE_H - ANV_WAIST_H} Z`;
// Anvil stump
const STUMP_X = ANV_CX - 22, STUMP_W = 44, STUMP_H = 48;

// Hammer (resting on anvil)
const HMCX = ANV_TOP_X + ANV_TOP_W - 12;
const HM_Y = FLOOR_Y - ANV_BASE_H - ANV_WAIST_H - ANV_TOP_H - 6;

// ─── Bellows ──────────────────────────────────────────────────────────────
const BLW_CX = HEARTH_X - 72, BLW_CY = HEARTH_Y + 64;
const BLW_W = 72, BLW_H = 42;
// Bellows handle
const BLW_HDL_Y = BLW_CY - BLW_H / 2 - 16;

// ─── Tool pegboard (right wall) ───────────────────────────────────────────
const PEG_X = 960, PEG_Y = 68, PEG_W = 360, PEG_H = 320;
// Pegs
const PEGS: [number, number][] = [
  [PEG_X + 32,  PEG_Y + 42],  [PEG_X + 88,  PEG_Y + 42],  [PEG_X + 148, PEG_Y + 42],
  [PEG_X + 208, PEG_Y + 42],  [PEG_X + 268, PEG_Y + 42],  [PEG_X + 328, PEG_Y + 42],
  [PEG_X + 32,  PEG_Y + 112], [PEG_X + 88,  PEG_Y + 112], [PEG_X + 148, PEG_Y + 112],
  [PEG_X + 208, PEG_Y + 112], [PEG_X + 268, PEG_Y + 112], [PEG_X + 328, PEG_Y + 112],
  [PEG_X + 32,  PEG_Y + 182], [PEG_X + 88,  PEG_Y + 182], [PEG_X + 148, PEG_Y + 182],
  [PEG_X + 208, PEG_Y + 182], [PEG_X + 268, PEG_Y + 182], [PEG_X + 328, PEG_Y + 182],
];

// Tool shapes — various iron implements
type Tool = { d: string; label: string };
const TOOLS: Tool[] = [
  // row 1
  { label: "tongs",   d: `M ${PEG_X+32},${PEG_Y+48} L ${PEG_X+24},${PEG_Y+96} M ${PEG_X+32},${PEG_Y+48} L ${PEG_X+40},${PEG_Y+96}` },
  { label: "hammer",  d: `M ${PEG_X+88},${PEG_Y+54} L ${PEG_X+88},${PEG_Y+98} M ${PEG_X+76},${PEG_Y+54} L ${PEG_X+100},${PEG_Y+54} L ${PEG_X+100},${PEG_Y+66} L ${PEG_X+76},${PEG_Y+66} Z` },
  { label: "poker",   d: `M ${PEG_X+148},${PEG_Y+48} L ${PEG_X+148},${PEG_Y+100} L ${PEG_X+144},${PEG_Y+104}` },
  { label: "chisel",  d: `M ${PEG_X+208},${PEG_Y+48} L ${PEG_X+208},${PEG_Y+88} L ${PEG_X+202},${PEG_Y+96} L ${PEG_X+214},${PEG_Y+96} Z` },
  { label: "file",    d: `M ${PEG_X+258},${PEG_Y+48} L ${PEG_X+278},${PEG_Y+100}` },
  { label: "swage",   d: `M ${PEG_X+316},${PEG_Y+48} L ${PEG_X+340},${PEG_Y+48} L ${PEG_X+340},${PEG_Y+78} L ${PEG_X+316},${PEG_Y+78} Z` },
  // row 2
  { label: "punch",   d: `M ${PEG_X+32},${PEG_Y+118} L ${PEG_X+32},${PEG_Y+174} L ${PEG_X+28},${PEG_Y+178}` },
  { label: "sledge",  d: `M ${PEG_X+88},${PEG_Y+124} L ${PEG_X+88},${PEG_Y+172} M ${PEG_X+72},${PEG_Y+124} L ${PEG_X+104},${PEG_Y+124} L ${PEG_X+104},${PEG_Y+142} L ${PEG_X+72},${PEG_Y+142} Z` },
  { label: "spring",  d: `M ${PEG_X+148},${PEG_Y+118} C ${PEG_X+136},${PEG_Y+138} ${PEG_X+160},${PEG_Y+150} ${PEG_X+148},${PEG_Y+172}` },
  { label: "hardy",   d: `M ${PEG_X+196},${PEG_Y+118} L ${PEG_X+220},${PEG_Y+118} L ${PEG_X+220},${PEG_Y+148} L ${PEG_X+196},${PEG_Y+148} Z M ${PEG_X+208},${PEG_Y+148} L ${PEG_X+208},${PEG_Y+178}` },
  { label: "shovel",  d: `M ${PEG_X+268},${PEG_Y+118} L ${PEG_X+268},${PEG_Y+160} L ${PEG_X+256},${PEG_Y+178} L ${PEG_X+280},${PEG_Y+178} Z` },
  { label: "drift",   d: `M ${PEG_X+316},${PEG_Y+118} L ${PEG_X+340},${PEG_Y+178} M ${PEG_X+340},${PEG_Y+118} L ${PEG_X+316},${PEG_Y+178}` },
];

// ─── Water trough ─────────────────────────────────────────────────────────
const TR_X = 116, TR_W = 164, TR_H = 54;
const TR_Y = FLOOR_Y - TR_H;

// ─── Workbench (left) ─────────────────────────────────────────────────────
const WB_X = 48, WB_W = 284, WB_H = 14;
const WB_Y = FLOOR_Y - 98;
const WB_LEG1_X = WB_X + 16, WB_LEG2_X = WB_X + WB_W - 32;

// ─── Firelight glow overlay ───────────────────────────────────────────────
// Will be rendered as radialGradient ellipse over the whole scene

export function BlacksmithForge() {
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
      aria-label="Blacksmith forge interior with glowing hearth and iron tools"
      style={{ background: "#0e0a06", overflow: "hidden" }}
    >
      <style>{`
        @keyframes bsf-flicker {
          0%,100% { opacity: 0.88; transform: scaleY(1);    }
          20%      { opacity: 1;    transform: scaleY(1.06); }
          45%      { opacity: 0.78; transform: scaleY(0.94); }
          70%      { opacity: 0.96; transform: scaleY(1.04); }
        }
        @keyframes bsf-glow {
          0%,100% { opacity: 0.62; }
          33%      { opacity: 0.82; }
          66%      { opacity: 0.54; }
        }
        @keyframes bsf-spark {
          0%   { opacity: 1;   transform: translate(0px, 0px)    scale(1); }
          60%  { opacity: 0.7; transform: translate(var(--svx), var(--svy)) scale(0.7); }
          100% { opacity: 0;   transform: translate(var(--svx2), var(--svy2)) scale(0.2); }
        }
        @keyframes bsf-bellows {
          0%,100% { transform: scaleY(1);   }
          50%      { transform: scaleY(0.62); }
        }
        .bsf-flame {
          animation: ${active ? "bsf-flicker 1.1s ease-in-out infinite" : "none"};
        }
        .bsf-glow {
          animation: ${active ? "bsf-glow 2.4s ease-in-out infinite" : "none"};
        }
        .bsf-bellows-body {
          animation: ${active ? "bsf-bellows 2.2s ease-in-out infinite" : "none"};
          transform-origin: ${BLW_CX}px ${BLW_CY + BLW_H / 2}px;
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
          {/* Stone wall */}
          <linearGradient id="bsf-wall" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#2a2018" />
            <stop offset="100%" stopColor="#1a1410" />
          </linearGradient>
          {/* Iron / dark metal */}
          <linearGradient id="bsf-iron" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%"   stopColor="#4a4640" />
            <stop offset="100%" stopColor="#2a2620" />
          </linearGradient>
          {/* Anvil */}
          <linearGradient id="bsf-anvil" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#5a5650" />
            <stop offset="100%" stopColor="#2e2c28" />
          </linearGradient>
          {/* Wood */}
          <linearGradient id="bsf-wood" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#6a4820" />
            <stop offset="100%" stopColor="#3a2810" />
          </linearGradient>
          {/* Floor */}
          <linearGradient id="bsf-floor" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#3a2c1c" />
            <stop offset="100%" stopColor="#1e1810" />
          </linearGradient>
          {/* Firelight glow (radial from hearth) */}
          <radialGradient id="bsf-firelight" cx="52%" cy="62%" r="55%">
            <stop offset="0%"   stopColor="#ff8800" stopOpacity="0.38" />
            <stop offset="30%"  stopColor="#e05010" stopOpacity="0.22" />
            <stop offset="65%"  stopColor="#8a3000" stopOpacity="0.10" />
            <stop offset="100%" stopColor="#200800" stopOpacity="0"    />
          </radialGradient>
          {/* Coal bed */}
          <radialGradient id="bsf-coal" cx="50%" cy="80%" r="50%">
            <stop offset="0%"   stopColor="#ff6600" stopOpacity="0.9" />
            <stop offset="40%"  stopColor="#cc3300" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#1a0800" stopOpacity="1"   />
          </radialGradient>
          {/* Water in trough */}
          <linearGradient id="bsf-water" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#4a5c6a" />
            <stop offset="100%" stopColor="#1a2c36" />
          </linearGradient>
          {/* Pegboard */}
          <linearGradient id="bsf-peg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#4a3a20" />
            <stop offset="100%" stopColor="#2a2010" />
          </linearGradient>
        </defs>

        {/* ─── Background wall ─── */}
        <rect x={0} y={0} width={W} height={H} fill="url(#bsf-wall)" />

        {/* Stone blocks */}
        {STONES.map(([sx, sy, sw, sh, shade], i) => (
          <rect key={i}
            x={sx + 1} y={sy + 1} width={sw - 2} height={sh - 2}
            fill={`rgb(${38 + shade * 3},${30 + shade * 2},${22 + shade})`}
            rx={1}
            style={{ opacity: active ? 1 : 0, transition: tr(0.02 + (i % 12) * 0.01) }}
          />
        ))}

        {/* Mortar lines */}
        {STONES.map(([sx, sy, sw, sh], i) => (
          <rect key={`m${i}`}
            x={sx} y={sy} width={sw} height={sh}
            fill="none" stroke="#0e0c08" strokeWidth={2}
            style={{ opacity: active ? 0.7 : 0, transition: tr(0.05) }}
          />
        ))}

        {/* ─── Firelight glow overlay ─── */}
        <rect x={0} y={0} width={W} height={H}
          fill="url(#bsf-firelight)"
          className="bsf-glow"
          style={{ opacity: active ? 1 : 0, transition: tr(0.1) }}
        />

        {/* ─── Floor ─── */}
        <rect x={0} y={FLOOR_Y} width={W} height={H - FLOOR_Y} fill="url(#bsf-floor)" />
        {/* Floor flag stones */}
        {Array.from({ length: 8 }, (_, i) => (
          <rect key={i}
            x={i * 182 + 4} y={FLOOR_Y + 2} width={174} height={H - FLOOR_Y - 4}
            fill={`rgb(${42 + (i % 3) * 4},${34 + (i % 3) * 3},${22 + (i % 3) * 2})`}
            rx={1}
            style={{ opacity: active ? 0.85 : 0, transition: tr(0.08) }}
          />
        ))}
        {/* Floor highlight at base */}
        <line x1={0} y1={FLOOR_Y} x2={W} y2={FLOOR_Y} stroke="#6a4818" strokeWidth={2} opacity={0.4} />

        {/* ─── PEGBOARD ─── */}
        <g style={{ opacity: active ? 1 : 0, transition: tr(0.2) }}>
          <rect x={PEG_X - 8} y={PEG_Y - 8} width={PEG_W + 16} height={PEG_H + 16}
            fill="url(#bsf-peg)" rx={2} />
          {/* Pegboard holes grid */}
          {Array.from({ length: 10 }, (_, row) =>
            Array.from({ length: 20 }, (__, col) => (
              <circle key={`ph${row}-${col}`}
                cx={PEG_X + 12 + col * 17} cy={PEG_Y + 12 + row * 30}
                r={2} fill="#1a1208" opacity={0.6}
              />
            ))
          )}
          {/* Pegs */}
          {PEGS.map(([px2, py2], i) => (
            <rect key={i} x={px2 - 3} y={py2 - 2} width={18} height={5}
              fill="#5a4828" rx={1} />
          ))}
          {/* Tools on pegs */}
          {TOOLS.map((tool, i) => (
            <path key={i} d={tool.d}
              fill={tool.d.includes("Z") ? "#3a3830" : "none"}
              stroke="#5a5650" strokeWidth={tool.label === "file" ? 1.5 : 2.5}
              strokeLinecap="round" strokeLinejoin="round"
            />
          ))}
          {/* Pegboard label */}
          <text x={PEG_X + PEG_W / 2} y={PEG_Y + PEG_H + 20}
            textAnchor="middle"
            fontFamily="'Georgia', serif" fontSize={10}
            fill="#8a6838" letterSpacing={4}
            style={{ opacity: active ? 0.6 : 0, transition: tr(0.6) }}
          >TOOLS OF THE TRADE</text>
        </g>

        {/* ─── FORGE HEARTH ─── */}
        <g style={{ opacity: active ? 1 : 0, transition: tr(0.15) }}>

          {/* Chimney flue */}
          <rect x={FLUE_X} y={0} width={FLUE_W} height={HOOD_Y + 4}
            fill="#1a1410" />

          {/* Hood */}
          <path d={HOOD_D} fill="#3a2e24" />
          <path d={HOOD_D} fill="none" stroke="#2a2018" strokeWidth={3} />

          {/* Hearth body */}
          <rect x={HEARTH_X} y={HEARTH_Y} width={HEARTH_W} height={FLOOR_Y - HEARTH_Y}
            fill="#2e2418" />

          {/* Firebox opening */}
          <rect x={FIREBOX_X} y={FIREBOX_Y} width={FIREBOX_W} height={FIREBOX_H}
            fill="#0a0604" rx={4} />

          {/* Coal bed */}
          <ellipse cx={FIRE_CX} cy={COAL_Y}
            rx={FIREBOX_W / 2 - 8} ry={10}
            fill="url(#bsf-coal)"
          />
          {/* Individual coals */}
          {Array.from({ length: 12 }, (_, i) => {
            const cx2 = FIREBOX_X + 16 + i * (FIREBOX_W - 32) / 11;
            const cy2 = COAL_Y + ((i % 3) - 1) * 3;
            const r = 4 + (i % 3);
            return (
              <ellipse key={i} cx={cx2} cy={cy2} rx={r} ry={r * 0.55}
                fill={i % 4 === 0 ? "#ff4400" : i % 4 === 1 ? "#cc2200" : i % 4 === 2 ? "#882200" : "#551100"}
              />
            );
          })}

          {/* Flames */}
          {FLAMES.map((fl, i) => (
            <ellipse key={i}
              cx={fl.cx} cy={fl.cy} rx={fl.rx} ry={fl.ry}
              fill={fl.color}
              className="bsf-flame"
              style={{
                transformOrigin: `${fl.cx}px ${fl.cy + fl.ry}px`,
                animationDelay: fl.delay,
                opacity: active ? (i < 3 ? 0.92 : i < 5 ? 0.78 : 0.6) : 0,
                transition: tr(0.2),
              }}
            />
          ))}

          {/* Firebox glow halo */}
          <ellipse cx={FIRE_CX} cy={FIRE_CY - 10}
            rx={FIREBOX_W / 2 + 12} ry={FIREBOX_H / 2 + 8}
            fill="#ff6600" opacity={0.08}
            className="bsf-glow"
          />

          {/* Hearth shelf / mantle */}
          <rect x={HEARTH_X - 12} y={HEARTH_Y - 10} width={HEARTH_W + 24} height={14}
            fill="#3a2c1c" rx={2} />

          {/* Tuyere nozzle (air blast pipe) */}
          <rect x={FIREBOX_X + FIREBOX_W - 16} y={FIREBOX_Y + FIREBOX_H / 2 - 5}
            width={20} height={10} fill="#4a4440" rx={2} />

          {/* Spark guard grate */}
          {Array.from({ length: 5 }, (_, i) => (
            <line key={i}
              x1={FIREBOX_X + 6 + i * (FIREBOX_W - 12) / 4}
              y1={FIREBOX_Y + FIREBOX_H - 14}
              x2={FIREBOX_X + 6 + i * (FIREBOX_W - 12) / 4}
              y2={FIREBOX_Y + FIREBOX_H + 4}
              stroke="#3a3430" strokeWidth={3}
            />
          ))}
        </g>

        {/* ─── SPARK SHOWER ─── */}
        {active && SPARKS.map(([sx, sy, vx, vy, delay], i) => (
          <circle key={i}
            cx={sx} cy={sy} r={i % 3 === 0 ? 2.5 : 1.8}
            fill={i % 5 === 0 ? "#ffee80" : i % 3 === 0 ? "#ffaa20" : "#ff7700"}
            style={{
              ["--svx" as string]: `${vx}px`,
              ["--svy" as string]: `${vy}px`,
              ["--svx2" as string]: `${vx * 2.2}px`,
              ["--svy2" as string]: `${vy * 2.4 - 12}px`,
              animation: `bsf-spark ${0.9 + (i % 5) * 0.22}s ease-out ${delay} infinite`,
            }}
          />
        ))}

        {/* ─── BELLOWS ─── */}
        <g style={{ opacity: active ? 1 : 0, transition: tr(0.25) }}>
          {/* Handle */}
          <line x1={BLW_CX} y1={BLW_HDL_Y} x2={BLW_CX} y2={BLW_CY - BLW_H / 2}
            stroke="#8a6030" strokeWidth={7} strokeLinecap="round" />
          {/* Bellows body */}
          <g className="bsf-bellows-body">
            <ellipse cx={BLW_CX} cy={BLW_CY} rx={BLW_W / 2} ry={BLW_H / 2}
              fill="#5a3c1a" stroke="#3a2808" strokeWidth={2} />
            {/* Accordion pleats */}
            {[-18, -6, 6, 18].map((ox, i) => (
              <line key={i}
                x1={BLW_CX + ox} y1={BLW_CY - BLW_H / 2 + 3}
                x2={BLW_CX + ox} y2={BLW_CY + BLW_H / 2 - 3}
                stroke="#3a2808" strokeWidth={2} opacity={0.6}
              />
            ))}
            {/* Nose nozzle */}
            <rect x={BLW_CX + BLW_W / 2 - 2} y={BLW_CY - 5}
              width={18} height={10} fill="#4a3818" rx={3} />
          </g>
          {/* Pipe to tuyere */}
          <path
            d={`M ${BLW_CX + BLW_W / 2 + 16},${BLW_CY} C ${BLW_CX + BLW_W / 2 + 48},${BLW_CY + 20} ${FIREBOX_X - 20},${FIREBOX_Y + FIREBOX_H / 2} ${FIREBOX_X - 2},${FIREBOX_Y + FIREBOX_H / 2}`}
            fill="none" stroke="#5a4020" strokeWidth={6} strokeLinecap="round"
          />
        </g>

        {/* ─── ANVIL ─── */}
        <g style={{ opacity: active ? 1 : 0, transition: tr(0.2) }}>
          {/* Stump */}
          <rect x={STUMP_X} y={FLOOR_Y - STUMP_H} width={STUMP_W} height={STUMP_H}
            fill="url(#bsf-wood)" rx={3} />
          {/* Stump rings */}
          {[8, 18, 28].map((oy, i) => (
            <line key={i}
              x1={STUMP_X + 4} y1={FLOOR_Y - STUMP_H + oy}
              x2={STUMP_X + STUMP_W - 4} y2={FLOOR_Y - STUMP_H + oy + 2}
              stroke="#2a1808" strokeWidth={1} opacity={0.4}
            />
          ))}
          {/* Base */}
          <rect x={ANV_BASE_X} y={FLOOR_Y - ANV_BASE_H}
            width={ANV_BASE_W} height={ANV_BASE_H}
            fill="url(#bsf-anvil)" rx={2} />
          {/* Waist */}
          <rect x={ANV_WAIST_X} y={FLOOR_Y - ANV_BASE_H - ANV_WAIST_H}
            width={ANV_WAIST_W} height={ANV_WAIST_H}
            fill="url(#bsf-anvil)" />
          {/* Top face */}
          <rect x={ANV_TOP_X} y={FLOOR_Y - ANV_BASE_H - ANV_WAIST_H - ANV_TOP_H}
            width={ANV_TOP_W} height={ANV_TOP_H}
            fill="#6a6660" rx={1} />
          {/* Horn */}
          <path d={ANV_HORN_D} fill="#5a5650" />
          {/* Top face highlight */}
          <rect x={ANV_TOP_X + 6}
            y={FLOOR_Y - ANV_BASE_H - ANV_WAIST_H - ANV_TOP_H + 2}
            width={ANV_TOP_W - 12} height={4}
            fill="#8a8880" opacity={0.5} rx={1}
          />
          {/* Resting hammer */}
          <g transform={`rotate(-28, ${HMCX}, ${HM_Y})`}>
            <rect x={HMCX - 3} y={HM_Y} width={6} height={36}
              fill="#6a4820" rx={2} />
            <rect x={HMCX - 10} y={HM_Y - 10} width={20} height={14}
              fill="#4a4640" rx={2} />
          </g>
        </g>

        {/* ─── WATER TROUGH ─── */}
        <g style={{ opacity: active ? 1 : 0, transition: tr(0.28) }}>
          <rect x={TR_X} y={TR_Y} width={TR_W} height={TR_H}
            fill="#3a2c1c" rx={3} stroke="#2a1e10" strokeWidth={2} />
          {/* Stave lines */}
          {Array.from({ length: 6 }, (_, i) => (
            <line key={i}
              x1={TR_X + 12 + i * (TR_W - 24) / 5} y1={TR_Y + 3}
              x2={TR_X + 12 + i * (TR_W - 24) / 5} y2={TR_Y + TR_H - 3}
              stroke="#2a1c0e" strokeWidth={1.5} opacity={0.5}
            />
          ))}
          {/* Water surface */}
          <rect x={TR_X + 4} y={TR_Y + 12} width={TR_W - 8} height={TR_H - 14}
            fill="url(#bsf-water)" rx={2} />
          {/* Water highlight */}
          <ellipse cx={TR_X + TR_W / 2} cy={TR_Y + 16}
            rx={TR_W / 2 - 12} ry={4}
            fill="#7aa0b8" opacity={0.18}
          />
          {/* Orange reflection from forge */}
          <ellipse cx={TR_X + TR_W / 2} cy={TR_Y + TR_H / 2}
            rx={TR_W / 2 - 8} ry={8}
            fill="#ff6600" opacity={0.08}
            className="bsf-glow"
          />
          {/* Iron stock soaking in trough */}
          <rect x={TR_X + 22} y={TR_Y + 8} width={8} height={TR_H - 12}
            fill="#3a3830" rx={1} />
          <rect x={TR_X + 42} y={TR_Y + 6} width={6} height={TR_H - 10}
            fill="#4a4840" rx={1} />
        </g>

        {/* ─── WORKBENCH ─── */}
        <g style={{ opacity: active ? 1 : 0, transition: tr(0.22) }}>
          <rect x={WB_X} y={WB_Y} width={WB_W} height={WB_H}
            fill="url(#bsf-wood)" rx={2} />
          <rect x={WB_LEG1_X} y={WB_Y + WB_H} width={16} height={FLOOR_Y - WB_Y - WB_H}
            fill="#4a3010" />
          <rect x={WB_LEG2_X} y={WB_Y + WB_H} width={16} height={FLOOR_Y - WB_Y - WB_H}
            fill="#4a3010" />
          {/* Items on bench */}
          {/* Rod of glowing iron */}
          <rect x={WB_X + 32} y={WB_Y - 8} width={88} height={7}
            fill="#ff6600" opacity={0.85} rx={3}
            style={{ filter: "drop-shadow(0 0 4px #ff8800)" }}
          />
          {/* File on bench */}
          <rect x={WB_X + 148} y={WB_Y - 5} width={52} height={4}
            fill="#5a5650" rx={1} />
          {/* Horseshoe blank */}
          <path
            d={`M ${WB_X + 224},${WB_Y - 6} C ${WB_X + 210},${WB_Y - 20} ${WB_X + 232},${WB_Y - 24} ${WB_X + 244},${WB_Y - 6}`}
            fill="none" stroke="#4a4840" strokeWidth={5} strokeLinecap="round"
          />
        </g>

        {/* ─── Caption ─── */}
        <text
          x={W / 2} y={H - 14}
          textAnchor="middle"
          fontFamily="'Georgia', 'Times New Roman', serif"
          fontSize={11} fill="#c87030"
          letterSpacing={5}
          style={{ opacity: active ? 0.65 : 0, transition: tr(1.0) }}
        >
          FORGED WITH INTENTION · SHREWSBURY, MA · ROUTE 9 CORRIDOR
        </text>
      </svg>
    </section>
  );
}
