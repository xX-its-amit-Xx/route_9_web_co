"use client";
import { useEffect, useRef, useState } from "react";

const W = 1440;
const H = 560;

// ─── Scene geometry ───────────────────────────────────────────────────────────
const HORIZON_Y = 230;
const HILL_PEAK  = 195;   // top of the hill crown
const GROUND_Y   = H;

// Church position (centered on hill)
const CH_CX   = 720;
const CH_BASE = 402;      // bottom of church walls
const CH_W    = 210;      // nave width
const CH_H    = 148;      // nave wall height (base to eave)
const CH_X    = CH_CX - CH_W / 2;  // 615

// ─── Steeple geometry ────────────────────────────────────────────────────────
const ST_BASE_Y  = CH_BASE - CH_H;          // 254 — top of nave walls / eave
const ST_BASE_W  = 72;
const ST_BASE_X  = CH_CX - ST_BASE_W / 2;  // steeple base left
const ST_BELFRY_Y = ST_BASE_Y - 90;         // belfry floor
const ST_SPIRE_Y  = ST_BELFRY_Y - 62;       // base of spire
const ST_TIP_Y    = ST_SPIRE_Y - 118;       // tip of spire

// ─── Hill path ────────────────────────────────────────────────────────────────
const HILL_PATH = `
  M0,${HORIZON_Y + 20}
  Q180,${HORIZON_Y + 10} 360,${HORIZON_Y + 5}
  Q500,${HORIZON_Y} 600,${HILL_PEAK + 20}
  Q660,${HILL_PEAK + 8} 720,${HILL_PEAK}
  Q780,${HILL_PEAK + 8} 840,${HILL_PEAK + 20}
  Q940,${HORIZON_Y} 1080,${HORIZON_Y + 5}
  Q1260,${HORIZON_Y + 10} 1440,${HORIZON_Y + 20}
  L1440,${GROUND_Y} L0,${GROUND_Y} Z
`;

// ─── Clapboard siding (horizontal planks) ────────────────────────────────────
const CLAP_COUNT = 18;
const CLAP_H     = CH_H / CLAP_COUNT;

// ─── Stained-glass windows ───────────────────────────────────────────────────
type SWindow = {
  x: number; y: number; w: number; h: number;
  colors: string[];    // top to bottom pane colors
  label: string;
};
// Lancet-arch windows on nave sides
const WINDOWS: SWindow[] = [
  // Left nave
  { x: CH_X + 18,  y: CH_BASE - CH_H + 36, w: 30, h: 68,
    colors: ["#4080c0","#60b040","#e08020","#c03020"], label: "L1" },
  { x: CH_X + 64,  y: CH_BASE - CH_H + 36, w: 30, h: 68,
    colors: ["#8040a0","#60b0d0","#e0c020","#206040"], label: "L2" },
  { x: CH_X + 110, y: CH_BASE - CH_H + 36, w: 30, h: 68,
    colors: ["#c04040","#4090c0","#80b040","#e09020"], label: "L3" },
  { x: CH_X + 156, y: CH_BASE - CH_H + 36, w: 30, h: 68,
    colors: ["#2060a0","#a04080","#c0b020","#408020"], label: "L4" },
  // Rose window on front gable
  { x: CH_CX - 22, y: ST_BASE_Y - 50, w: 44, h: 44,
    colors: ["#e06020","#4080c0","#80c040","#a02060"], label: "ROSE" },
];

// ─── Front door (panelled) ────────────────────────────────────────────────────
const DOOR_W = 44;
const DOOR_H = 72;
const DOOR_X = CH_CX - DOOR_W / 2;
const DOOR_Y = CH_BASE - DOOR_H;

// ─── Porch / portico ──────────────────────────────────────────────────────────
const PORCH_W = 80;
const PORCH_H = 22;
const PORCH_X = CH_CX - PORCH_W / 2;
const PORCH_Y = CH_BASE - DOOR_H - PORCH_H;

// ─── Elm trees ────────────────────────────────────────────────────────────────
type ElmTree = { cx: number; baseY: number; trunkH: number; cr: number; shade: string };
const ELM_TREES: ElmTree[] = [
  { cx: 470,  baseY: HORIZON_Y + 12, trunkH: 82, cr: 52, shade: "#3a5a28" },
  { cx: 536,  baseY: HORIZON_Y + 8,  trunkH: 95, cr: 60, shade: "#2e4e20" },
  { cx: 590,  baseY: HORIZON_Y + 4,  trunkH: 72, cr: 44, shade: "#446630" },
  { cx: 850,  baseY: HORIZON_Y + 4,  trunkH: 76, cr: 46, shade: "#3a5a28" },
  { cx: 908,  baseY: HORIZON_Y + 8,  trunkH: 92, cr: 58, shade: "#2e4e20" },
  { cx: 970,  baseY: HORIZON_Y + 12, trunkH: 80, cr: 50, shade: "#446630" },
  // far background trees
  { cx: 200,  baseY: HORIZON_Y + 18, trunkH: 52, cr: 30, shade: "#4a6a36" },
  { cx: 290,  baseY: HORIZON_Y + 14, trunkH: 58, cr: 35, shade: "#3e5e2a" },
  { cx: 1150, baseY: HORIZON_Y + 16, trunkH: 54, cr: 32, shade: "#4a6a36" },
  { cx: 1240, baseY: HORIZON_Y + 14, trunkH: 60, cr: 37, shade: "#3e5e2a" },
];

// ─── Churchyard iron fence ────────────────────────────────────────────────────
// Runs across the front of the churchyard at hill level
const FENCE_Y   = CH_BASE + 28;
const FENCE_L   = CH_X - 60;
const FENCE_R   = CH_X + CH_W + 60;
const PICKET_W  = 7;
const PICKET_GAP = 14;
const PICKET_COUNT = Math.floor((FENCE_R - FENCE_L) / (PICKET_W + PICKET_GAP));

// ─── Headstones ──────────────────────────────────────────────────────────────
type Headstone = { x: number; y: number; w: number; h: number; shape: "rect" | "arch" | "obelisk" };
const HEADSTONES: Headstone[] = [
  { x: CH_X - 44, y: CH_BASE + 8,  w: 22, h: 34, shape: "arch" },
  { x: CH_X - 18, y: CH_BASE + 12, w: 18, h: 28, shape: "rect" },
  { x: CH_X +  8, y: CH_BASE + 6,  w: 14, h: 38, shape: "obelisk" },
  { x: CH_X + CH_W + 8,  y: CH_BASE + 10, w: 20, h: 30, shape: "arch" },
  { x: CH_X + CH_W + 32, y: CH_BASE + 6,  w: 16, h: 36, shape: "obelisk" },
  { x: CH_X + CH_W + 54, y: CH_BASE + 12, w: 24, h: 26, shape: "rect" },
  { x: CH_X + CH_W + 78, y: CH_BASE + 8,  w: 18, h: 32, shape: "arch" },
];

// ─── Stone path to door ───────────────────────────────────────────────────────
type StepStone = { x: number; y: number; w: number; h: number };
const STEP_STONES: StepStone[] = Array.from({ length: 8 }, (_, i) => ({
  x: CH_CX - 16 - i * 1.5,
  y: CH_BASE + 4 + i * 14,
  w: 32 + i * 3,
  h: 10,
}));

// ─── Bell (in belfry) ─────────────────────────────────────────────────────────
// Belfry opening
const BELFRY_W = 28;
const BELFRY_H = 32;

// ─── Far hillside — additional scenery ────────────────────────────────────────
// Distant rolling hills as layered silhouettes
const FAR_HILLS = [
  `M0,${HORIZON_Y} Q360,${HORIZON_Y - 28} 720,${HORIZON_Y - 12} Q1080,${HORIZON_Y - 30} 1440,${HORIZON_Y - 8} L1440,${HORIZON_Y + 8} L0,${HORIZON_Y + 8} Z`,
  `M0,${HORIZON_Y - 18} Q240,${HORIZON_Y - 42} 480,${HORIZON_Y - 24} Q720,${HORIZON_Y - 8} 960,${HORIZON_Y - 35} Q1200,${HORIZON_Y - 48} 1440,${HORIZON_Y - 22} L1440,${HORIZON_Y} L0,${HORIZON_Y} Z`,
];
const FAR_HILL_COLORS = ["#5a7840","#4a6832"];

// ─── Clouds ───────────────────────────────────────────────────────────────────
type Cloud = { cx: number; cy: number; parts: [number, number, number][]; delay: number };
const CLOUDS: Cloud[] = [
  { cx: 220,  cy: 72,  parts: [[-40,0,28],[0,-14,36],[40,0,26],[-15,14,22],[20,12,20]],  delay: 0 },
  { cx: 1100, cy: 88,  parts: [[-30,0,24],[0,-12,30],[35,0,22],[10,12,18]],               delay: 2.4 },
  { cx: 640,  cy: 52,  parts: [[-22,0,18],[0,-10,24],[28,0,18],[8,10,14]],                delay: 1.2 },
];

export function CountryChurch() {
  const ref = useRef<SVGSVGElement>(null);
  const [active, setActive] = useState(false);
  const [bellAngle, setBellAngle] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setActive(true); },
      { threshold: 0.12 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // Oscillate bell
  useEffect(() => {
    if (!active) return;
    let t = 0;
    const tick = setInterval(() => {
      t += 0.124;
      const phase = (t % (Math.PI * 4)) - Math.PI * 2;
      setBellAngle(Math.sin(t) * 18 * Math.exp(-(phase * phase) / 8));
    }, 33);
    return () => clearInterval(tick);
  }, [active]);

  const tr = (d: number) =>
    active ? `opacity 0.7s ease ${d}s, transform 0.7s ease ${d}s` : "none";

  const toRad = (deg: number) => deg * Math.PI / 180;

  return (
    <section style={{ background: "#6a9ac4", overflow: "hidden", position: "relative" }}>
      <style>{`
        @keyframes cc-cloud-drift {
          from { transform: translateX(0); }
          to   { transform: translateX(60px); }
        }
        @keyframes cc-glow-pulse {
          0%,100% { opacity: 0.82; }
          50%     { opacity: 0.96; }
        }
        @keyframes cc-leaf-sway {
          0%,100% { transform: rotate(-2deg); }
          50%     { transform: rotate(2.5deg); }
        }
        @keyframes cc-shadow-shift {
          0%,100% { opacity: 0.12; }
          50%     { opacity: 0.18; }
        }
        .cc-cloud { animation: cc-cloud-drift 28s linear infinite; }
        .cc-glow  { animation: cc-glow-pulse 3.5s ease-in-out infinite; }
        .cc-leaf  { animation: cc-leaf-sway 4s ease-in-out infinite; transform-origin: bottom center; }
        .cc-shadow{ animation: cc-shadow-shift 5s ease-in-out infinite; }
      `}</style>
      <svg
        ref={ref}
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="xMidYMid slice"
        style={{ display: "block", width: "100%", height: "auto", minHeight: 320 }}
        aria-label="1840s white clapboard church on a New England hill with stained glass and elm trees"
        role="img"
      >
        <defs>
          <linearGradient id="cc-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#3a6898" />
            <stop offset="40%"  stopColor="#5a88b8" />
            <stop offset="80%"  stopColor="#7aaad0" />
            <stop offset="100%" stopColor="#9abce0" />
          </linearGradient>
          <linearGradient id="cc-hill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#6a8a48" />
            <stop offset="40%"  stopColor="#5a7838" />
            <stop offset="100%" stopColor="#3e5828" />
          </linearGradient>
          <linearGradient id="cc-hill2" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#7a9a54" />
            <stop offset="100%" stopColor="#5a7838" />
          </linearGradient>
          {/* Clapboard white with slight shadow */}
          <linearGradient id="cc-clap-l" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%"   stopColor="#d8dde0" />
            <stop offset="30%"  stopColor="#f0f4f6" />
            <stop offset="100%" stopColor="#e8ecee" />
          </linearGradient>
          <linearGradient id="cc-clap-r" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%"   stopColor="#c0c8cc" />
            <stop offset="100%" stopColor="#d8dde0" />
          </linearGradient>
          {/* Stained glass glow per window */}
          {WINDOWS.map((w, i) => (
            <radialGradient key={i} id={`cc-win-glow-${i}`} cx="50%" cy="50%" r="60%">
              <stop offset="0%"   stopColor={w.colors[0] ?? "#f8d070"} stopOpacity="0.55" />
              <stop offset="100%" stopColor={w.colors[0] ?? "#f8d070"} stopOpacity="0" />
            </radialGradient>
          ))}
          {/* Roof shingle */}
          <linearGradient id="cc-roof" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#4a4840" />
            <stop offset="100%" stopColor="#2a2820" />
          </linearGradient>
          {/* Steeple shingle */}
          <linearGradient id="cc-steeple-roof" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#3a3830" />
            <stop offset="100%" stopColor="#1e1c18" />
          </linearGradient>
          <clipPath id="cc-clip">
            <rect x="0" y="0" width={W} height={H} />
          </clipPath>
        </defs>

        {/* ── Sky ── */}
        <rect x="0" y="0" width={W} height={H} fill="url(#cc-sky)" />

        {/* ── Clouds ── */}
        {CLOUDS.map((cl, i) => (
          <g key={i} className="cc-cloud"
             style={{ animationDelay: `${cl.delay}s`, animationDuration: `${22 + i * 6}s` }}>
            {cl.parts.map(([dx, dy, r], pi) => (
              <ellipse key={pi} cx={cl.cx + dx} cy={cl.cy + dy} rx={r} ry={r * 0.56}
                fill="#ffffff" opacity="0.82" />
            ))}
          </g>
        ))}

        {/* ── Far hill silhouettes ── */}
        {FAR_HILLS.map((path, i) => (
          <path key={i} d={path} fill={FAR_HILL_COLORS[i] ?? "#4a6832"} opacity="0.65" />
        ))}

        {/* ── Main hill ── */}
        <path d={HILL_PATH} fill="url(#cc-hill)" />
        {/* Hill highlight (lighter top band) */}
        <path
          d={`M580,${HILL_PEAK + 15} Q660,${HILL_PEAK - 2} 720,${HILL_PEAK} Q780,${HILL_PEAK - 2} 860,${HILL_PEAK + 15} Q720,${HILL_PEAK - 18} 580,${HILL_PEAK + 15} Z`}
          fill="#8aaa60" opacity="0.35"
        />

        {/* ── Elm trees ── */}
        {ELM_TREES.map((et, i) => (
          <g key={i}
             className="cc-leaf"
             style={{ transformOrigin: `${et.cx}px ${et.baseY}px`, animationDelay: `${i * 0.35}s` }}>
            {/* Trunk */}
            <line x1={et.cx} y1={et.baseY} x2={et.cx} y2={et.baseY - et.trunkH}
              stroke="#3a2a18" strokeWidth={et.trunkH > 80 ? 9 : 6} strokeLinecap="round" />
            {/* Fork branch (elm characteristic vase shape) */}
            <line x1={et.cx} y1={et.baseY - et.trunkH * 0.65}
              x2={et.cx - et.cr * 0.55} y2={et.baseY - et.trunkH * 0.9}
              stroke="#3a2a18" strokeWidth="5" strokeLinecap="round" />
            <line x1={et.cx} y1={et.baseY - et.trunkH * 0.65}
              x2={et.cx + et.cr * 0.5}  y2={et.baseY - et.trunkH * 0.88}
              stroke="#3a2a18" strokeWidth="5" strokeLinecap="round" />
            {/* Main canopy ellipses (layered for elm umbrella shape) */}
            <ellipse cx={et.cx} cy={et.baseY - et.trunkH - et.cr * 0.5}
              rx={et.cr} ry={et.cr * 0.62} fill={et.shade} />
            <ellipse cx={et.cx - et.cr * 0.4} cy={et.baseY - et.trunkH - et.cr * 0.2}
              rx={et.cr * 0.7} ry={et.cr * 0.45} fill={et.shade} opacity="0.85" />
            <ellipse cx={et.cx + et.cr * 0.38} cy={et.baseY - et.trunkH - et.cr * 0.18}
              rx={et.cr * 0.68} ry={et.cr * 0.42} fill={et.shade} opacity="0.85" />
            {/* Light highlight on canopy */}
            <ellipse cx={et.cx - et.cr * 0.2} cy={et.baseY - et.trunkH - et.cr * 0.72}
              rx={et.cr * 0.35} ry={et.cr * 0.2}
              fill="#88b050" opacity="0.45" />
          </g>
        ))}

        {/* ── Church building ── */}
        <g style={{
          opacity: active ? 1 : 0,
          transform: active ? "translateY(0)" : "translateY(18px)",
          transition: tr(0.18),
        }}>
          {/* ── NAVE: left face (shadow) ── */}
          <rect x={CH_X} y={CH_BASE - CH_H} width={CH_W * 0.1} height={CH_H}
            fill="url(#cc-clap-r)" />

          {/* ── NAVE: front clapboard siding ── */}
          {Array.from({ length: CLAP_COUNT }, (_, i) => {
            const cy = CH_BASE - CH_H + i * CLAP_H;
            const isEven = i % 2 === 0;
            return (
              <rect key={i} x={CH_X} y={cy} width={CH_W} height={CLAP_H}
                fill={isEven ? "#f0f4f6" : "#e4e8ea"}
                stroke="#c8ccd0" strokeWidth="0.5" />
            );
          })}

          {/* ── NAVE: front gable ── */}
          <polygon
            points={`${CH_X - 6},${CH_BASE - CH_H} ${CH_CX},${CH_BASE - CH_H - 55} ${CH_X + CH_W + 6},${CH_BASE - CH_H}`}
            fill="#e8ecee" stroke="#b8bcc0" strokeWidth="1" />

          {/* ── NAVE: roof ── */}
          <polygon
            points={`${CH_X - 8},${CH_BASE - CH_H} ${CH_CX},${CH_BASE - CH_H - 58} ${CH_X + CH_W + 8},${CH_BASE - CH_H}`}
            fill="url(#cc-roof)" />
          {/* Roof shingle lines */}
          {Array.from({ length: 8 }, (_, i) => {
            const t = (i + 1) / 9;
            const lx1 = CH_X - 8 + (CH_CX - (CH_X - 8)) * t;
            const lx2 = CH_CX + ((CH_X + CH_W + 8) - CH_CX) * t;
            const ly = (CH_BASE - CH_H) + ((CH_BASE - CH_H - 58) - (CH_BASE - CH_H)) * t;
            // Incorrect — redo as symmetric from ridge
            const lry = (CH_BASE - CH_H - 58) + ((CH_BASE - CH_H) - (CH_BASE - CH_H - 58)) * t;
            return (
              <line key={i}
                x1={CH_X - 8 + (CH_W + 16) * (1 - t) / 2} y1={lry}
                x2={CH_X - 8 + CH_W + 16 - (CH_W + 16) * (1 - t) / 2} y2={lry}
                stroke="#1e1c18" strokeWidth="1.2" opacity="0.35" />
            );
          })}

          {/* ── Cornerboards (vertical trim) ── */}
          {[CH_X - 4, CH_X + CH_W - 8].map((cx, i) => (
            <rect key={i} x={cx} y={CH_BASE - CH_H - 4} width={12} height={CH_H + 4}
              fill="#d8dcde" stroke="#b0b4b8" strokeWidth="0.8" />
          ))}

          {/* ── Frieze board ── */}
          <rect x={CH_X - 4} y={CH_BASE - CH_H - 10} width={CH_W + 8} height={12}
            fill="#e0e4e6" stroke="#b0b4b8" strokeWidth="0.8" />

          {/* ── Stained-glass windows ── */}
          {WINDOWS.map((win, wi) => (
            <g key={wi}>
              {/* Glow halo on wall */}
              <ellipse cx={win.x + win.w / 2} cy={win.y + win.h / 2}
                rx={win.w * 1.6} ry={win.h * 0.9}
                fill={`url(#cc-win-glow-${wi})`} className="cc-glow"
                style={{ animationDelay: `${wi * 0.45}s` }} />
              {/* Window frame */}
              <rect x={win.x - 3} y={win.y - 3} width={win.w + 6}
                height={win.h + (win.label === "ROSE" ? 0 : win.w / 2) + 6}
                rx="2" fill="#3a2a18" />
              {win.label === "ROSE" ? (
                // Rose window (circular)
                <g>
                  <circle cx={win.x + win.w / 2} cy={win.y + win.h / 2} r={win.w / 2}
                    fill="#1a1008" />
                  {/* Petals of rose window */}
                  {Array.from({ length: 8 }, (_, p) => {
                    const pa = toRad(p * 45);
                    const pr = win.w * 0.28;
                    const pcx = win.x + win.w / 2 + Math.cos(pa) * pr;
                    const pcy = win.y + win.h / 2 + Math.sin(pa) * pr;
                    return (
                      <ellipse key={p} cx={pcx} cy={pcy} rx={win.w * 0.16} ry={win.w * 0.16}
                        fill={win.colors[p % win.colors.length] ?? "#f0a020"}
                        opacity="0.88" className="cc-glow"
                        style={{ animationDelay: `${p * 0.2}s` }} />
                    );
                  })}
                  {/* Center circle */}
                  <circle cx={win.x + win.w / 2} cy={win.y + win.h / 2} r={win.w * 0.14}
                    fill="#f8d060" className="cc-glow" />
                  {/* Tracery spokes */}
                  {Array.from({ length: 8 }, (_, p) => {
                    const pa = toRad(p * 45);
                    return (
                      <line key={p}
                        x1={win.x + win.w / 2} y1={win.y + win.h / 2}
                        x2={win.x + win.w / 2 + Math.cos(pa) * win.w / 2}
                        y2={win.y + win.h / 2 + Math.sin(pa) * win.h / 2}
                        stroke="#2a1a08" strokeWidth="1.5" opacity="0.6" />
                    );
                  })}
                </g>
              ) : (
                // Lancet window with panes
                <g>
                  {/* Lancet arch body */}
                  <rect x={win.x} y={win.y + win.w / 2} width={win.w} height={win.h - win.w / 2}
                    fill="#1a1008" />
                  <path d={`M${win.x},${win.y + win.w / 2} A${win.w / 2},${win.w / 2} 0 0,1 ${win.x + win.w},${win.y + win.w / 2}`}
                    fill="#1a1008" />
                  {/* Colored panes (4 horizontal bands) */}
                  {win.colors.map((col, ci) => {
                    const paneH = (win.h - win.w * 0.25) / win.colors.length;
                    const paneY = win.y + win.w * 0.22 + ci * paneH;
                    return (
                      <rect key={ci} x={win.x + 2} y={paneY} width={win.w - 4} height={paneH - 2}
                        fill={col} opacity="0.88" className="cc-glow"
                        style={{ animationDelay: `${ci * 0.15}s` }} />
                    );
                  })}
                  {/* Lead muntins */}
                  <line x1={win.x + win.w / 2} y1={win.y} x2={win.x + win.w / 2} y2={win.y + win.h}
                    stroke="#2a1a08" strokeWidth="2.5" />
                  {win.colors.map((_, ci) => {
                    const paneH = (win.h - win.w * 0.22) / win.colors.length;
                    const lineY = win.y + win.w * 0.22 + (ci + 1) * paneH;
                    return (
                      <line key={ci} x1={win.x} y1={lineY} x2={win.x + win.w} y2={lineY}
                        stroke="#2a1a08" strokeWidth="2" opacity="0.7" />
                    );
                  })}
                </g>
              )}
            </g>
          ))}

          {/* ── Front door ── */}
          <rect x={DOOR_X} y={DOOR_Y} width={DOOR_W} height={DOOR_H}
            rx="2" fill="#3a2a18" stroke="#2a1a08" strokeWidth="2" />
          {/* Door arch */}
          <path d={`M${DOOR_X},${DOOR_Y + DOOR_W / 2} A${DOOR_W / 2},${DOOR_W / 2} 0 0,1 ${DOOR_X + DOOR_W},${DOOR_Y + DOOR_W / 2}`}
            fill="#2a1a08" />
          {/* Door panels */}
          {[[DOOR_X + 5, DOOR_Y + DOOR_W / 2 + 4], [DOOR_X + 5, DOOR_Y + DOOR_W / 2 + 26]].map(([px, py], i) => (
            <g key={i}>
              <rect x={px} y={py} width={16} height={16} rx="1" fill="#2a1a08" stroke="#4a3020" strokeWidth="1" />
              <rect x={px + DOOR_W / 2 - 5} y={py} width={16} height={16} rx="1" fill="#2a1a08" stroke="#4a3020" strokeWidth="1" />
            </g>
          ))}
          {/* Door knob */}
          <circle cx={DOOR_X + DOOR_W - 8} cy={DOOR_Y + DOOR_H * 0.6} r={4}
            fill="#c8a040" />

          {/* ── Portico ── */}
          <rect x={PORCH_X} y={PORCH_Y} width={PORCH_W} height={PORCH_H + 4}
            fill="#d8dcde" stroke="#b0b4b8" strokeWidth="1" />
          {/* Portico pediment */}
          <polygon
            points={`${PORCH_X - 4},${PORCH_Y} ${PORCH_X + PORCH_W / 2},${PORCH_Y - 18} ${PORCH_X + PORCH_W + 4},${PORCH_Y}`}
            fill="#e4e8ea" stroke="#b0b4b8" strokeWidth="1" />
          {/* Portico columns */}
          {[PORCH_X + 8, PORCH_X + PORCH_W - 12].map((cx, i) => (
            <rect key={i} x={cx} y={PORCH_Y} width={8} height={PORCH_H + 4}
              rx="3" fill="#e8ecee" stroke="#c0c4c8" strokeWidth="0.8" />
          ))}

          {/* ── Steps ── */}
          {Array.from({ length: 4 }, (_, i) => (
            <rect key={i} x={DOOR_X - 6 - i * 6} y={CH_BASE - 4 + i * 6}
              width={DOOR_W + 12 + i * 12} height={7}
              rx="1" fill="#c8ccce" stroke="#a0a4a8" strokeWidth="0.8" />
          ))}

          {/* ── STEEPLE ── */}
          {/* Steeple base (tower) */}
          {Array.from({ length: 6 }, (_, i) => (
            <rect key={i}
              x={ST_BASE_X} y={ST_BASE_Y - 90 + i * 15} width={ST_BASE_W} height={15}
              fill={i % 2 === 0 ? "#e8ecee" : "#dde1e4"}
              stroke="#c0c4c8" strokeWidth="0.5" />
          ))}
          {/* Steeple cornerboards */}
          {[ST_BASE_X - 3, ST_BASE_X + ST_BASE_W - 7].map((sx, i) => (
            <rect key={i} x={sx} y={ST_BELFRY_Y} width={10} height={ST_BASE_Y - ST_BELFRY_Y}
              fill="#d0d4d8" />
          ))}
          {/* Belfry louver openings */}
          {[ST_BASE_X + 8, ST_BASE_X + ST_BASE_W - 8 - BELFRY_W].map((bx, i) => (
            <g key={i}>
              <rect x={bx} y={ST_BELFRY_Y + 6} width={BELFRY_W} height={BELFRY_H}
                rx="1" fill="#1a1a1a" />
              {/* Louver slats */}
              {Array.from({ length: 5 }, (_, s) => (
                <rect key={s} x={bx + 2} y={ST_BELFRY_Y + 10 + s * 5} width={BELFRY_W - 4} height={3}
                  fill="#2a2a2a" stroke="#3a3a3a" strokeWidth="0.5" />
              ))}
            </g>
          ))}
          {/* Belfry trim */}
          <rect x={ST_BASE_X - 5} y={ST_BELFRY_Y} width={ST_BASE_W + 10} height={8}
            fill="#c8ccce" />
          <rect x={ST_BASE_X - 5} y={ST_BELFRY_Y + BELFRY_H + 8} width={ST_BASE_W + 10} height={6}
            fill="#c8ccce" />

          {/* Bell inside belfry */}
          <g style={{
            transform: `translateX(${CH_CX}px) translateY(${ST_BELFRY_Y + 18}px) rotate(${bellAngle}deg)`,
            transition: "none",
          }}>
            {/* Bell shape */}
            <path d="M-12,0 Q-14,14 -10,22 Q0,28 10,22 Q14,14 12,0 Q0,-8 -12,0 Z"
              fill="#c8a020" stroke="#8a6810" strokeWidth="1.5" />
            {/* Clapper */}
            <line x1="0" y1="18" x2="0" y2="26"
              stroke="#6a5010" strokeWidth="2.5" />
            <circle cx="0" cy="27" r="4" fill="#6a5010" />
          </g>

          {/* Spire */}
          <polygon
            points={`${ST_BASE_X - 4},${ST_SPIRE_Y} ${CH_CX},${ST_TIP_Y} ${ST_BASE_X + ST_BASE_W + 4},${ST_SPIRE_Y}`}
            fill="url(#cc-steeple-roof)" />
          {/* Spire shingle lines */}
          {Array.from({ length: 8 }, (_, i) => {
            const t = (i + 1) / 9;
            const sy = ST_TIP_Y + (ST_SPIRE_Y - ST_TIP_Y) * t;
            const hw = (ST_BASE_W / 2 + 4) * t;
            return (
              <line key={i} x1={CH_CX - hw} y1={sy} x2={CH_CX + hw} y2={sy}
                stroke="#121010" strokeWidth="1" opacity="0.4" />
            );
          })}
          {/* Weathervane at tip */}
          <line x1={CH_CX} y1={ST_TIP_Y} x2={CH_CX} y2={ST_TIP_Y - 28}
            stroke="#6a5a30" strokeWidth="2.5" />
          {/* Rooster weathervane */}
          <path d={`M${CH_CX},${ST_TIP_Y - 28} L${CH_CX + 18},${ST_TIP_Y - 34} L${CH_CX + 8},${ST_TIP_Y - 38} L${CH_CX + 14},${ST_TIP_Y - 44} L${CH_CX + 4},${ST_TIP_Y - 40} L${CH_CX - 10},${ST_TIP_Y - 32} Z`}
            fill="#8a7030" />
          {/* Cross below weathervane */}
          <line x1={CH_CX} y1={ST_TIP_Y - 14} x2={CH_CX} y2={ST_TIP_Y}
            stroke="#6a5a30" strokeWidth="3" />
          <line x1={CH_CX - 10} y1={ST_TIP_Y - 10} x2={CH_CX + 10} y2={ST_TIP_Y - 10}
            stroke="#6a5a30" strokeWidth="3" />
        </g>

        {/* ── Headstones ── */}
        <g style={{
          opacity: active ? 1 : 0,
          transform: active ? "translateY(0)" : "translateY(10px)",
          transition: tr(0.4),
        }}>
          {HEADSTONES.map((hs, i) => (
            <g key={i}>
              {hs.shape === "arch" && (
                <g>
                  <rect x={hs.x} y={hs.y + hs.w / 2} width={hs.w} height={hs.h - hs.w / 2}
                    fill="#9a9890" stroke="#7a7870" strokeWidth="1" />
                  <path d={`M${hs.x},${hs.y + hs.w / 2} A${hs.w / 2},${hs.w / 2} 0 0,1 ${hs.x + hs.w},${hs.y + hs.w / 2}`}
                    fill="#9a9890" stroke="#7a7870" strokeWidth="1" />
                </g>
              )}
              {hs.shape === "rect" && (
                <rect x={hs.x} y={hs.y} width={hs.w} height={hs.h}
                  rx="1" fill="#8a8880" stroke="#6a6860" strokeWidth="1" />
              )}
              {hs.shape === "obelisk" && (
                <polygon
                  points={`${hs.x + hs.w / 2},${hs.y} ${hs.x + hs.w},${hs.y + hs.h * 0.2} ${hs.x + hs.w * 0.9},${hs.y + hs.h} ${hs.x + hs.w * 0.1},${hs.y + hs.h} ${hs.x},${hs.y + hs.h * 0.2}`}
                  fill="#9a9890" stroke="#7a7870" strokeWidth="1" />
              )}
              {/* Moss on headstone base */}
              <rect x={hs.x} y={hs.y + hs.h - 6} width={hs.w} height={6}
                rx="1" fill="#5a7838" opacity="0.4" />
            </g>
          ))}
        </g>

        {/* ── Iron fence ── */}
        <g style={{
          opacity: active ? 1 : 0,
          transform: active ? "translateY(0)" : "translateY(6px)",
          transition: tr(0.5),
        }}>
          {/* Top rail */}
          <rect x={FENCE_L} y={FENCE_Y - 4} width={FENCE_R - FENCE_L} height={5}
            rx="2" fill="#2a2820" />
          {/* Bottom rail */}
          <rect x={FENCE_L} y={FENCE_Y + 26} width={FENCE_R - FENCE_L} height={4}
            rx="2" fill="#2a2820" />
          {/* Pickets */}
          {Array.from({ length: PICKET_COUNT }, (_, i) => {
            const px = FENCE_L + i * (PICKET_W + PICKET_GAP);
            return (
              <g key={i}>
                <rect x={px} y={FENCE_Y - 14} width={PICKET_W} height={44}
                  rx="1" fill="#1e1c18" />
                {/* Spear point */}
                <polygon
                  points={`${px + PICKET_W / 2},${FENCE_Y - 22} ${px},${FENCE_Y - 14} ${px + PICKET_W},${FENCE_Y - 14}`}
                  fill="#1e1c18" />
              </g>
            );
          })}
          {/* Gate posts */}
          {[FENCE_L - 6, FENCE_R + 0].map((gx, i) => (
            <g key={i}>
              <rect x={gx} y={FENCE_Y - 20} width={12} height={60}
                rx="2" fill="#1e1c18" />
              {/* Post cap */}
              <rect x={gx - 4} y={FENCE_Y - 26} width={20} height={8}
                rx="2" fill="#1e1c18" />
              <circle cx={gx + 6} cy={FENCE_Y - 30} r={6} fill="#2a2820" />
            </g>
          ))}
        </g>

        {/* ── Stone path to door ── */}
        {STEP_STONES.map((ss, i) => (
          <rect key={i} x={ss.x} y={ss.y} width={ss.w} height={ss.h}
            rx="3" fill="#8a8878" stroke="#6a6860" strokeWidth="0.8" opacity="0.8" />
        ))}

        {/* ── Church building shadow on hill ── */}
        <ellipse cx={CH_CX + 30} cy={CH_BASE + 12} rx={CH_W * 0.62} ry={18}
          fill="#000000" className="cc-shadow" />

        {/* ── Label ── */}
        <g style={{
          opacity: active ? 1 : 0,
          transform: active ? "translateY(0)" : "translateY(-8px)",
          transition: tr(0.12),
        }}>
          <text x={W / 2} y={H - 22} textAnchor="middle"
            fontFamily="'Georgia', serif" fontSize="11" fill="#3a4a30"
            letterSpacing="3" opacity="0.6">
            CONGREGATIONAL CHURCH · SHREWSBURY, MA · EST. 1723
          </text>
        </g>
      </svg>
    </section>
  );
}
