"use client";
import { useEffect, useRef, useState } from "react";

const W = 1440;
const H = 560;

// ─── Scene geometry ───────────────────────────────────────────────────────────
const HORIZON_Y = 222;
const GROUND_Y  = H;

// Tavern building position
const TAV_X  = 480;
const TAV_W  = 460;
const TAV_H  = 210;
const TAV_Y  = HORIZON_Y - TAV_H + 48;   // top of front wall

// ─── Fieldstone chimney ───────────────────────────────────────────────────────
const CHM_X = TAV_X + TAV_W - 68;
const CHM_Y = TAV_Y - 80;
const CHM_W = 52;
const CHM_H = TAV_H + 80;

type ChimStone = [number, number, number, number, string];
const CHIM_STONES: ChimStone[] = (() => {
  const stones: ChimStone[] = [];
  const stoneW = 24;
  const stoneH = 14;
  const cols = Math.ceil(CHM_W / stoneW) + 1;
  const rows = Math.ceil(CHM_H / stoneH) + 1;
  const shades = ["#7a6a58","#8a7a68","#6a5a48","#9a8a78","#7a7060"];
  for (let r = 0; r < rows; r++) {
    const offset = r % 2 === 0 ? 0 : stoneW * 0.48;
    for (let c = 0; c < cols; c++) {
      const sx = CHM_X + c * stoneW + offset;
      const sy = CHM_Y + r * stoneH;
      if (sx < CHM_X + CHM_W) {
        stones.push([sx, sy, stoneW - 1.5, stoneH - 1.5, shades[(r * 3 + c) % shades.length] ?? "#7a6a58"]);
      }
    }
  }
  return stones;
})();

// ─── Smoke puffs ─────────────────────────────────────────────────────────────
type SmokePuff = { ox: number; delay: number; sway: number };
const SMOKE_PUFFS: SmokePuff[] = [
  { ox:  0, delay: 0,   sway:  8 },
  { ox:  6, delay: 0.6, sway: -6 },
  { ox: -4, delay: 1.2, sway:  5 },
  { ox:  3, delay: 1.8, sway: -8 },
];

// ─── Clapboard siding ─────────────────────────────────────────────────────────
const CLAP_COUNT = 14;
const CLAP_H = TAV_H / CLAP_COUNT;

// ─── Windows ─────────────────────────────────────────────────────────────────
type TavWindow = { x: number; y: number; w: number; h: number; panes: number };
const WINDOWS: TavWindow[] = [
  { x: TAV_X + 28,  y: TAV_Y + 44, w: 64, h: 72, panes: 12 },
  { x: TAV_X + 370, y: TAV_Y + 44, w: 64, h: 72, panes: 12 },
  // upper floor (smaller)
  { x: TAV_X + 80,  y: TAV_Y - 28, w: 44, h: 52, panes: 8 },
  { x: TAV_X + 330, y: TAV_Y - 28, w: 44, h: 52, panes: 8 },
];

// ─── Front door ──────────────────────────────────────────────────────────────
const DOOR_W = 56;
const DOOR_H = 90;
const DOOR_X = TAV_X + TAV_W / 2 - DOOR_W / 2;
const DOOR_Y = HORIZON_Y + 48 - DOOR_H;    // bottom at ground line

// ─── Inn sign bracket ────────────────────────────────────────────────────────
const SIGN_POST_X  = TAV_X - 66;
const SIGN_POST_TOP = HORIZON_Y - 110;
const SIGN_POST_BOT = HORIZON_Y + 48;
const SIGN_ARM_Y    = SIGN_POST_TOP + 42;
const SIGN_ARM_LEN  = 78;
const SIGN_W        = 110;
const SIGN_H        = 68;
const SIGN_CX       = SIGN_POST_X + SIGN_ARM_LEN + SIGN_W / 2;
const SIGN_CY       = SIGN_ARM_Y + 14 + SIGN_H / 2;

// ─── Hitching post ────────────────────────────────────────────────────────────
const HITCH_X  = TAV_X + TAV_W + 48;
const HITCH_Y1 = HORIZON_Y + 40;
const HITCH_Y2 = HORIZON_Y + 48 + 62;

// ─── Lantern above door ───────────────────────────────────────────────────────
const LANTERN_X = DOOR_X + DOOR_W / 2;
const LANTERN_Y = DOOR_Y - 22;

// ─── Roof & dormers ──────────────────────────────────────────────────────────
// Main gambrel (two-pitch) roof
const ROOF_Y1 = TAV_Y - 4;
const ROOF_MID_Y = ROOF_Y1 - 40;
const ROOF_TIP_Y = ROOF_MID_Y - 55;

// Dormer window
const DORM_X  = TAV_X + TAV_W / 2 - 32;
const DORM_Y  = ROOF_MID_Y - 10;
const DORM_W  = 64;
const DORM_H  = 44;

// ─── Autumn trees ────────────────────────────────────────────────────────────
type AutumnTree = { cx: number; baseY: number; trunkH: number; cr: number; shade: string; lean: number };
const AUTUMN_TREES: AutumnTree[] = [
  { cx: 180, baseY: HORIZON_Y + 22, trunkH: 170, cr: 58, shade: "#b84a10", lean: -5 },
  { cx: 280, baseY: HORIZON_Y + 16, trunkH: 150, cr: 50, shade: "#d06820", lean: -4 },
  { cx: 360, baseY: HORIZON_Y + 20, trunkH: 130, cr: 44, shade: "#c05818", lean: -3 },
  { cx: 1050,baseY: HORIZON_Y + 18, trunkH: 138, cr: 46, shade: "#d07830", lean:  4 },
  { cx: 1150,baseY: HORIZON_Y + 14, trunkH: 158, cr: 54, shade: "#b84a10", lean:  5 },
  { cx: 1260,baseY: HORIZON_Y + 20, trunkH: 145, cr: 48, shade: "#c06020", lean:  4 },
  { cx: 1360,baseY: HORIZON_Y + 24, trunkH: 118, cr: 40, shade: "#d07020", lean:  3 },
];

// ─── Autumn leaves (falling + on ground) ─────────────────────────────────────
type Leaf = { x: number; y: number; size: number; color: string; rot: number; delay: number; sway: number; speed: number };
const LEAF_COLORS = ["#c04010","#d06020","#e08810","#b83010","#c85818","#d07828","#a83818"];
const FALLING_LEAVES: Leaf[] = Array.from({ length: 38 }, (_, i) => {
  const ang = i * 137.508 * Math.PI / 180;
  const r = Math.sqrt(i / 38) * W * 0.5;
  return {
    x:     ((W / 2 + Math.cos(ang) * r) + W) % W,
    y:     (i * 29) % (H * 0.7),
    size:  5 + i % 5,
    color: LEAF_COLORS[i % LEAF_COLORS.length] ?? "#c04010",
    rot:   (i * 47) % 360,
    delay: -(i * 0.22) % 4,
    sway:  (i % 2 === 0 ? 1 : -1) * (20 + i % 30),
    speed: 3.5 + (i % 5) * 0.7,
  };
});

// ─── Ground leaves ────────────────────────────────────────────────────────────
type GroundLeaf = { x: number; y: number; size: number; color: string; rot: number };
const GROUND_LEAVES: GroundLeaf[] = Array.from({ length: 55 }, (_, i) => ({
  x:     (i * 113 + 40) % (W - 60) + 30,
  y:     HORIZON_Y + 52 + (i * 37) % (H - HORIZON_Y - 80),
  size:  4 + i % 6,
  color: LEAF_COLORS[i % LEAF_COLORS.length] ?? "#c04010",
  rot:   (i * 61) % 360,
}));

// ─── Far hill silhouette ──────────────────────────────────────────────────────
const FAR_HILLS = `M0,${HORIZON_Y + 8} Q360,${HORIZON_Y - 22} 720,${HORIZON_Y - 8} Q1080,${HORIZON_Y - 26} 1440,${HORIZON_Y + 6} L1440,${HORIZON_Y + 22} L0,${HORIZON_Y + 22} Z`;

// ─── Tethered horse ──────────────────────────────────────────────────────────
const HORSE_X = HITCH_X + 55;
const HORSE_Y = HORIZON_Y + 40;

export function TavernSign() {
  const ref = useRef<SVGSVGElement>(null);
  const [active, setActive] = useState(false);
  const [signAngle, setSignAngle] = useState(0);
  const [leafPhase, setLeafPhase] = useState(0);

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

  useEffect(() => {
    if (!active) return;
    let t = 0;
    const tick = setInterval(() => {
      t += 0.028;
      setSignAngle(Math.sin(t) * 9 + Math.sin(t * 1.7) * 3);
      setLeafPhase(t);
    }, 16);
    return () => clearInterval(tick);
  }, [active]);

  const tr = (d: number) =>
    active ? `opacity 0.7s ease ${d}s, transform 0.7s ease ${d}s` : "none";

  return (
    <section style={{ background: "#c87830", overflow: "hidden", position: "relative" }}>
      <style>{`
        @keyframes ts-smoke {
          0%   { transform: translateY(0) translateX(0) scale(1); opacity: 0.55; }
          50%  { transform: translateY(-35px) translateX(var(--sway)) scale(1.3); opacity: 0.35; }
          100% { transform: translateY(-70px) translateX(calc(var(--sway) * 1.6)) scale(1.8); opacity: 0; }
        }
        @keyframes ts-leaf-fall {
          0%   { transform: translateY(0) translateX(0) rotate(var(--lr)); opacity: 0.9; }
          100% { transform: translateY(${H + 40}px) translateX(var(--ls)) rotate(calc(var(--lr) + 540deg)); opacity: 0.4; }
        }
        @keyframes ts-lantern-glow {
          0%,100% { opacity: 0.7; }
          50%     { opacity: 0.9; }
        }
        @keyframes ts-horse-tail {
          0%,100% { d: path("M0,0 Q12,-8 10,-18 Q8,-28 14,-36"); }
          50%     { d: path("M0,0 Q14,-6 16,-16 Q18,-26 12,-35"); }
        }
        @keyframes ts-wind-gust {
          0%,100% { transform: scaleX(1); }
          50%     { transform: scaleX(1.08) translateX(4px); }
        }
        .ts-smoke  { animation: ts-smoke 3s ease-out infinite; }
        .ts-lantern{ animation: ts-lantern-glow 2.2s ease-in-out infinite; }
        .ts-gust   { animation: ts-wind-gust 5s ease-in-out infinite; }
      `}</style>
      <svg
        ref={ref}
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="xMidYMid slice"
        style={{ display: "block", width: "100%", height: "auto", minHeight: 320 }}
        aria-label="Colonial-era roadside tavern with swaying inn sign, chimney smoke, and autumn leaves"
        role="img"
      >
        <defs>
          <linearGradient id="ts-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#4a3020" />
            <stop offset="30%"  stopColor="#8a5028" />
            <stop offset="65%"  stopColor="#c87830" />
            <stop offset="100%" stopColor="#e09848" />
          </linearGradient>
          <linearGradient id="ts-ground" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#6a5830" />
            <stop offset="40%"  stopColor="#5a4820" />
            <stop offset="100%" stopColor="#3a3018" />
          </linearGradient>
          <linearGradient id="ts-clap" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%"   stopColor="#c8a870" />
            <stop offset="30%"  stopColor="#d8b880" />
            <stop offset="100%" stopColor="#c0a068" />
          </linearGradient>
          <linearGradient id="ts-clap-shadow" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%"   stopColor="#a88850" />
            <stop offset="100%" stopColor="#b89860" />
          </linearGradient>
          <linearGradient id="ts-roof" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#2a2018" />
            <stop offset="100%" stopColor="#1a1410" />
          </linearGradient>
          <radialGradient id="ts-lantern-halo" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="#f8d060" stopOpacity="0.7" />
            <stop offset="50%"  stopColor="#f0a020" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#e07010" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="ts-win-glow" cx="50%" cy="50%" r="60%">
            <stop offset="0%"   stopColor="#f8d060" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#f0a020" stopOpacity="0" />
          </radialGradient>
          <clipPath id="ts-clip">
            <rect x="0" y="0" width={W} height={H} />
          </clipPath>
        </defs>

        {/* ── Autumn sunset sky ── */}
        <rect x="0" y="0" width={W} height={H} fill="url(#ts-sky)" />

        {/* ── Sun on horizon ── */}
        <ellipse cx={820} cy={HORIZON_Y + 4} rx={260} ry={55}
          fill="#f8b040" opacity="0.35" />
        <circle cx={820} cy={HORIZON_Y + 2} r={32} fill="#fff0a0" opacity="0.88" />
        <circle cx={820} cy={HORIZON_Y + 2} r={24} fill="#fff8c0" opacity="0.96" />

        {/* ── Far hills (autumn purple-grey) ── */}
        <path d={FAR_HILLS} fill="#5a3828" opacity="0.55" />

        {/* ── Autumn trees ── */}
        {AUTUMN_TREES.map((at, i) => (
          <g key={i} className="ts-gust" style={{ animationDelay: `${i * 0.4}s` }}>
            {/* Trunk */}
            <line x1={at.cx} y1={at.baseY}
              x2={at.cx + at.lean} y2={at.baseY - at.trunkH}
              stroke="#2a1a0e" strokeWidth={at.trunkH > 155 ? 11 : 9} strokeLinecap="round" />
            {/* Canopy (layered, slightly wind-leaned) */}
            <ellipse cx={at.cx + at.lean * 1.2} cy={at.baseY - at.trunkH - at.cr * 0.45}
              rx={at.cr} ry={at.cr * 0.65} fill={at.shade} />
            <ellipse cx={at.cx + at.lean * 1.4 - at.cr * 0.3} cy={at.baseY - at.trunkH - at.cr * 0.18}
              rx={at.cr * 0.7} ry={at.cr * 0.5} fill={at.shade} opacity="0.85" />
            <ellipse cx={at.cx + at.lean * 1.4 + at.cr * 0.32} cy={at.baseY - at.trunkH - at.cr * 0.15}
              rx={at.cr * 0.68} ry={at.cr * 0.48} fill={at.shade} opacity="0.85" />
            {/* Highlight */}
            <ellipse cx={at.cx + at.lean - at.cr * 0.15} cy={at.baseY - at.trunkH - at.cr * 0.68}
              rx={at.cr * 0.32} ry={at.cr * 0.18}
              fill="#e09040" opacity="0.35" />
          </g>
        ))}

        {/* ── Ground ── */}
        <rect x="0" y={HORIZON_Y + 22} width={W} height={H - HORIZON_Y - 22}
          fill="url(#ts-ground)" />

        {/* ── Ground leaf litter ── */}
        {GROUND_LEAVES.map((gl, i) => (
          <ellipse key={i}
            cx={gl.x} cy={gl.y}
            rx={gl.size} ry={gl.size * 0.45}
            fill={gl.color} opacity="0.7"
            style={{ transform: `rotate(${gl.rot}deg)`, transformOrigin: `${gl.x}px ${gl.y}px` }}
          />
        ))}

        {/* ── Fieldstone chimney ── */}
        {CHIM_STONES.map(([sx, sy, sw, sh, fill], i) => (
          <rect key={i} x={sx} y={sy} width={sw} height={sh}
            fill={fill} stroke="#3a2a18" strokeWidth="0.5" />
        ))}
        {/* Chimney cap */}
        <rect x={CHM_X - 4} y={CHM_Y - 6} width={CHM_W + 8} height={10}
          rx="2" fill="#5a4a38" stroke="#3a2a18" strokeWidth="1" />

        {/* ── Smoke puffs ── */}
        {SMOKE_PUFFS.map((sp, i) => (
          <ellipse key={i} className="ts-smoke"
            cx={CHM_X + CHM_W / 2 + sp.ox} cy={CHM_Y - 8}
            rx={10 + i * 3} ry={8 + i * 2}
            fill="#a09080" opacity="0.55"
            style={{ "--sway": `${sp.sway}px`, animationDelay: `${sp.delay}s` } as React.CSSProperties} />
        ))}

        {/* ── Tavern building ── */}
        <g style={{
          opacity: active ? 1 : 0,
          transform: active ? "translateY(0)" : "translateY(16px)",
          transition: tr(0.15),
        }}>
          {/* Clapboard siding (warm aged yellow) */}
          {Array.from({ length: CLAP_COUNT }, (_, i) => (
            <rect key={i}
              x={TAV_X} y={TAV_Y + i * CLAP_H}
              width={TAV_W} height={CLAP_H}
              fill={i % 2 === 0 ? "#d8b880" : "#c8a870"}
              stroke="#a88850" strokeWidth="0.6" />
          ))}
          {/* Shadow on right side */}
          <rect x={TAV_X + TAV_W - 30} y={TAV_Y} width={30} height={TAV_H}
            fill="#8a6840" opacity="0.28" />

          {/* Cornerboards */}
          {[TAV_X - 4, TAV_X + TAV_W - 8].map((cx, i) => (
            <rect key={i} x={cx} y={TAV_Y - 4} width={12} height={TAV_H + 4}
              fill="#b89860" stroke="#9a7840" strokeWidth="0.8" />
          ))}

          {/* Frieze board */}
          <rect x={TAV_X - 4} y={TAV_Y - 12} width={TAV_W + 8} height={14}
            fill="#c0a070" stroke="#9a7840" strokeWidth="0.8" />

          {/* ── Gambrel roof ── */}
          {/* Lower pitch */}
          <polygon
            points={`${TAV_X - 10},${ROOF_Y1} ${TAV_X + TAV_W / 2},${ROOF_MID_Y} ${TAV_X + TAV_W + 10},${ROOF_Y1}`}
            fill="url(#ts-roof)" />
          {/* Upper pitch */}
          <polygon
            points={`${TAV_X + 30},${ROOF_MID_Y} ${TAV_X + TAV_W / 2},${ROOF_TIP_Y} ${TAV_X + TAV_W - 30},${ROOF_MID_Y}`}
            fill="#221810" />
          {/* Roof shingles */}
          {Array.from({ length: 7 }, (_, i) => {
            const t = (i + 1) / 8;
            const ry = ROOF_Y1 + (ROOF_MID_Y - ROOF_Y1) * t;
            const hw = (TAV_W / 2 + 10) * (1 - t);
            return (
              <line key={i} x1={TAV_X + TAV_W / 2 - hw} y1={ry}
                x2={TAV_X + TAV_W / 2 + hw} y2={ry}
                stroke="#0a0806" strokeWidth="1.2" opacity="0.4" />
            );
          })}
          {Array.from({ length: 5 }, (_, i) => {
            const t = (i + 1) / 6;
            const ry = ROOF_MID_Y + (ROOF_TIP_Y - ROOF_MID_Y) * t;
            const hw = (TAV_W / 2 - 30) * (1 - t);
            return (
              <line key={i} x1={TAV_X + TAV_W / 2 - hw} y1={ry}
                x2={TAV_X + TAV_W / 2 + hw} y2={ry}
                stroke="#0a0806" strokeWidth="1" opacity="0.35" />
            );
          })}

          {/* ── Dormer ── */}
          <rect x={DORM_X} y={DORM_Y} width={DORM_W} height={DORM_H}
            fill="#d8b880" stroke="#a88850" strokeWidth="1" />
          <polygon
            points={`${DORM_X - 4},${DORM_Y} ${DORM_X + DORM_W / 2},${DORM_Y - 22} ${DORM_X + DORM_W + 4},${DORM_Y}`}
            fill="#221810" />
          <rect x={DORM_X + 12} y={DORM_Y + 8} width={DORM_W - 24} height={DORM_H - 18}
            rx="1" fill="#f0c860" opacity="0.85" className="ts-lantern" />

          {/* ── Windows (12-pane colonial) ── */}
          {WINDOWS.map((win, wi) => (
            <g key={wi}>
              {/* Glow */}
              <ellipse cx={win.x + win.w / 2} cy={win.y + win.h / 2}
                rx={win.w} ry={win.h * 0.7}
                fill="url(#ts-win-glow)" className="ts-lantern"
                style={{ animationDelay: `${wi * 0.3}s` }} />
              {/* Window frame */}
              <rect x={win.x - 4} y={win.y - 4} width={win.w + 8} height={win.h + 8}
                rx="1" fill="#5a4020" />
              {/* Pane fill */}
              <rect x={win.x} y={win.y} width={win.w} height={win.h}
                fill="#f0c860" opacity="0.88" />
              {/* Muntin grid */}
              {[0.33, 0.67].map((fx, mi) => (
                <line key={mi}
                  x1={win.x + win.w * fx} y1={win.y}
                  x2={win.x + win.w * fx} y2={win.y + win.h}
                  stroke="#5a4020" strokeWidth="2.5" />
              ))}
              {Array.from({ length: win.panes / 3 - 1 }, (_, ri) => (
                <line key={ri}
                  x1={win.x} y1={win.y + win.h * ((ri + 1) / (win.panes / 3))}
                  x2={win.x + win.w} y2={win.y + win.h * ((ri + 1) / (win.panes / 3))}
                  stroke="#5a4020" strokeWidth="2" />
              ))}
              {/* Shutter (left) */}
              <rect x={win.x - 4 - 14} y={win.y - 4} width={14} height={win.h + 8}
                rx="1" fill="#2a5020" stroke="#1a3814" strokeWidth="0.8" />
              {/* Shutter (right) */}
              <rect x={win.x + win.w + 4} y={win.y - 4} width={14} height={win.h + 8}
                rx="1" fill="#2a5020" stroke="#1a3814" strokeWidth="0.8" />
            </g>
          ))}

          {/* ── Front door ── */}
          <rect x={DOOR_X - 6} y={DOOR_Y - 8} width={DOOR_W + 12} height={DOOR_H + 8}
            rx="2" fill="#5a4020" />
          <rect x={DOOR_X} y={DOOR_Y} width={DOOR_W} height={DOOR_H}
            rx="2" fill="#3a2810" />
          {/* Door arch transom */}
          <path d={`M${DOOR_X},${DOOR_Y} A${DOOR_W / 2},${DOOR_W / 2} 0 0,1 ${DOOR_X + DOOR_W},${DOOR_Y}`}
            fill="#f0c860" opacity="0.7" />
          {/* Door panels */}
          {[[5, 8], [5, 42]].map(([px, py], i) => (
            <g key={i}>
              <rect x={DOOR_X + px} y={DOOR_Y + py} width={20} height={28}
                rx="2" fill="#2a1a08" stroke="#4a3018" strokeWidth="1" />
              <rect x={DOOR_X + DOOR_W - px - 20} y={DOOR_Y + py} width={20} height={28}
                rx="2" fill="#2a1a08" stroke="#4a3018" strokeWidth="1" />
            </g>
          ))}
          {/* Door knocker */}
          <circle cx={DOOR_X + DOOR_W / 2} cy={DOOR_Y + 38} r={5}
            fill="#c8a030" stroke="#8a6818" strokeWidth="1" />
          {/* Door step */}
          {[0, 1, 2].map(i => (
            <rect key={i}
              x={DOOR_X - 10 - i * 8} y={HORIZON_Y + 48 - 6 + i * 6}
              width={DOOR_W + 20 + i * 16} height={7}
              rx="1" fill={["#b0a888","#a09878","#909068"][i] ?? "#a09878"} />
          ))}

          {/* ── Porch overhang ── */}
          <rect x={DOOR_X - 30} y={DOOR_Y - 30} width={DOOR_W + 60} height={10}
            fill="#a88850" />
          <polygon
            points={`${DOOR_X - 34},${DOOR_Y - 30} ${DOOR_X + DOOR_W / 2},${DOOR_Y - 54} ${DOOR_X + DOOR_W + 34},${DOOR_Y - 30}`}
            fill="#8a7040" />
          {/* Porch columns */}
          {[DOOR_X - 20, DOOR_X + DOOR_W + 6].map((cx, i) => (
            <rect key={i} x={cx} y={DOOR_Y - 30} width={10} height={92}
              rx="4" fill="#c0a870" stroke="#9a8050" strokeWidth="0.8" />
          ))}
        </g>

        {/* ── Lantern above door ── */}
        <g style={{
          opacity: active ? 1 : 0,
          transition: tr(0.4),
        }}>
          {/* Halo */}
          <circle cx={LANTERN_X} cy={LANTERN_Y} r={60}
            fill="url(#ts-lantern-halo)" className="ts-lantern" />
          {/* Wall bracket */}
          <path d={`M${LANTERN_X},${DOOR_Y - 36} Q${LANTERN_X + 12},${DOOR_Y - 44} ${LANTERN_X + 2},${LANTERN_Y + 8}`}
            fill="none" stroke="#5a4020" strokeWidth="3" />
          {/* Lantern box */}
          <rect x={LANTERN_X - 10} y={LANTERN_Y - 14} width={20} height={24}
            rx="2" fill="#f8d060" stroke="#5a4020" strokeWidth="1.5"
            className="ts-lantern" />
          <polygon
            points={`${LANTERN_X - 12},${LANTERN_Y - 14} ${LANTERN_X},${LANTERN_Y - 26} ${LANTERN_X + 12},${LANTERN_Y - 14}`}
            fill="#3a2810" />
          {/* Candle flame */}
          <ellipse cx={LANTERN_X} cy={LANTERN_Y - 2} rx={3} ry={5}
            fill="#fff8a0" className="ts-lantern" />
        </g>

        {/* ── Inn sign (swaying) ── */}
        <g style={{
          opacity: active ? 1 : 0,
          transform: active ? "translateY(0)" : "translateY(-10px)",
          transition: tr(0.2),
        }}>
          {/* Post */}
          <line x1={SIGN_POST_X} y1={SIGN_POST_BOT}
            x2={SIGN_POST_X} y2={SIGN_POST_TOP}
            stroke="#3a2810" strokeWidth="9" strokeLinecap="round" />
          {/* Post cap with acorn finial */}
          <circle cx={SIGN_POST_X} cy={SIGN_POST_TOP} r={7} fill="#5a3820" />
          <circle cx={SIGN_POST_X} cy={SIGN_POST_TOP - 8} r={4.5} fill="#8a6030" />
          {/* Arm bracket */}
          <line x1={SIGN_POST_X} y1={SIGN_ARM_Y}
            x2={SIGN_POST_X + SIGN_ARM_LEN + 4} y2={SIGN_ARM_Y}
            stroke="#3a2810" strokeWidth="7" strokeLinecap="round" />
          {/* Decorative scroll on arm */}
          <path d={`M${SIGN_POST_X + 4},${SIGN_ARM_Y} Q${SIGN_POST_X + 24},${SIGN_ARM_Y - 16} ${SIGN_POST_X + 36},${SIGN_ARM_Y}`}
            fill="none" stroke="#5a3820" strokeWidth="3.5" />
          {/* Hanging chains */}
          {[-SIGN_W / 2 + 8, SIGN_W / 2 - 8].map((ox, i) => (
            <line key={i}
              x1={SIGN_CX + ox} y1={SIGN_ARM_Y + 2}
              x2={SIGN_CX + ox + signAngle * 0.8} y2={SIGN_CY - SIGN_H / 2 - 2}
              stroke="#5a4820" strokeWidth="1.8" />
          ))}
          {/* Sign board (swinging) */}
          <g style={{
            transform: `rotate(${signAngle}deg)`,
            transformOrigin: `${SIGN_CX}px ${SIGN_ARM_Y + 2}px`,
            transition: "none",
          }}>
            {/* Shadow */}
            <rect x={SIGN_CX - SIGN_W / 2 + 4} y={SIGN_CY - SIGN_H / 2 + 4}
              width={SIGN_W} height={SIGN_H} rx="4" fill="#2a1808" opacity="0.2" />
            {/* Board */}
            <rect x={SIGN_CX - SIGN_W / 2} y={SIGN_CY - SIGN_H / 2}
              width={SIGN_W} height={SIGN_H} rx="4"
              fill="#3a2810" stroke="#5a3820" strokeWidth="2.5" />
            {/* Inner border */}
            <rect x={SIGN_CX - SIGN_W / 2 + 6} y={SIGN_CY - SIGN_H / 2 + 6}
              width={SIGN_W - 12} height={SIGN_H - 12} rx="2"
              fill="none" stroke="#c8a040" strokeWidth="1.5" />
            {/* Sign text */}
            <text x={SIGN_CX} y={SIGN_CY - 10}
              textAnchor="middle" fontFamily="'Georgia', serif"
              fontSize="16" fontWeight="bold" fill="#c8a040" letterSpacing="1">
              YE OLDE
            </text>
            <text x={SIGN_CX} y={SIGN_CY + 6}
              textAnchor="middle" fontFamily="'Georgia', serif"
              fontSize="13" fill="#e8c060" letterSpacing="0.5">
              ROUTE 9
            </text>
            <text x={SIGN_CX} y={SIGN_CY + 22}
              textAnchor="middle" fontFamily="'Georgia', serif"
              fontSize="12" fill="#c8a040" letterSpacing="0.5">
              TAVERN
            </text>
            {/* Decorative stars */}
            {[-38, 38].map((ox, i) => (
              <text key={i} x={SIGN_CX + ox} y={SIGN_CY + 6}
                textAnchor="middle" fontFamily="serif" fontSize="12" fill="#c8a040">
                ✦
              </text>
            ))}
          </g>
        </g>

        {/* ── Hitching post ── */}
        <g style={{
          opacity: active ? 1 : 0,
          transform: active ? "translateY(0)" : "translateY(8px)",
          transition: tr(0.45),
        }}>
          {/* Post */}
          <rect x={HITCH_X - 4} y={HITCH_Y1} width={8} height={HITCH_Y2 - HITCH_Y1}
            rx="2" fill="#4a3018" stroke="#2a1808" strokeWidth="1" />
          {/* Post cap */}
          <rect x={HITCH_X - 7} y={HITCH_Y1 - 5} width={14} height={7}
            rx="2" fill="#3a2010" />
          <circle cx={HITCH_X} cy={HITCH_Y1 - 9} r={5} fill="#3a2010" />
          {/* Tether ring */}
          <circle cx={HITCH_X} cy={HITCH_Y1 + 18} r={7}
            fill="none" stroke="#6a5020" strokeWidth="3" />
          {/* Cross bar */}
          <rect x={HITCH_X - 22} y={HITCH_Y1 + 8} width={44} height={6}
            rx="2" fill="#5a3820" />
        </g>

        {/* ── Tethered horse ── */}
        <g style={{
          opacity: active ? 1 : 0,
          transform: active ? "translateY(0)" : "translateY(10px)",
          transition: tr(0.5),
        }}>
          {/* Body */}
          <ellipse cx={HORSE_X + 40} cy={HORSE_Y - 22} rx={52} ry={18}
            fill="#2a1a0a" />
          {/* Neck */}
          <path d={`M${HORSE_X + 84},${HORSE_Y - 22} Q${HORSE_X + 98},${HORSE_Y - 40} ${HORSE_X + 102},${HORSE_Y - 52}`}
            fill="none" stroke="#2a1a0a" strokeWidth="14" strokeLinecap="round" />
          {/* Head */}
          <ellipse cx={HORSE_X + 106} cy={HORSE_Y - 58} rx={18} ry={11}
            fill="#2a1a0a" />
          {/* Ear */}
          <polygon points={`${HORSE_X + 112},${HORSE_Y - 68} ${HORSE_X + 118},${HORSE_Y - 76} ${HORSE_X + 120},${HORSE_Y - 66}`}
            fill="#2a1a0a" />
          {/* Nostril */}
          <ellipse cx={HORSE_X + 120} cy={HORSE_Y - 54} rx={3} ry={2}
            fill="#1a0e06" />
          {/* Eye */}
          <circle cx={HORSE_X + 112} cy={HORSE_Y - 61} r={2.5} fill="#f0c030" opacity="0.7" />
          {/* Mane */}
          {[0, 1, 2, 3].map(mi => (
            <path key={mi}
              d={`M${HORSE_X + 98 - mi * 4},${HORSE_Y - 46 - mi * 2} Q${HORSE_X + 94 - mi * 4},${HORSE_Y - 38 - mi * 2} ${HORSE_X + 90 - mi * 4},${HORSE_Y - 42 - mi * 2}`}
              fill="#1a0a04" stroke="#1a0a04" strokeWidth="2.5" />
          ))}
          {/* Legs */}
          {[
            [HORSE_X + 22, HORSE_Y - 6, HORSE_X + 18, HORSE_Y + 30],
            [HORSE_X + 36, HORSE_Y - 6, HORSE_X + 34, HORSE_Y + 30],
            [HORSE_X + 56, HORSE_Y - 6, HORSE_X + 60, HORSE_Y + 30],
            [HORSE_X + 70, HORSE_Y - 6, HORSE_X + 72, HORSE_Y + 30],
          ].map(([x1, y1, x2, y2], li) => (
            <line key={li} x1={x1} y1={y1} x2={x2} y2={y2}
              stroke="#1a0e06" strokeWidth="7" strokeLinecap="round" />
          ))}
          {/* Tail */}
          <path d={`M${HORSE_X - 10},${HORSE_Y - 20} Q${HORSE_X - 26},${HORSE_Y - 10} ${HORSE_X - 22},${HORSE_Y + 14} Q${HORSE_X - 18},${HORSE_Y + 26} ${HORSE_X - 10},${HORSE_Y + 22}`}
            fill="none" stroke="#1a0e06" strokeWidth="5" strokeLinecap="round" />
          {/* Saddle blanket */}
          <ellipse cx={HORSE_X + 46} cy={HORSE_Y - 36} rx={22} ry={9}
            fill="#8a1818" opacity="0.7" />
          {/* Tether rope from post to bridle */}
          <path d={`M${HITCH_X + 7},${HITCH_Y1 + 18} Q${HITCH_X + 40},${HORSE_Y - 44} ${HORSE_X + 96},${HORSE_Y - 56}`}
            fill="none" stroke="#8a6830" strokeWidth="2" strokeDasharray="4,3" />
        </g>

        {/* ── Falling leaves (animated) ── */}
        {FALLING_LEAVES.map((fl, i) => (
          <ellipse key={i}
            cx={fl.x} cy={fl.y}
            rx={fl.size} ry={fl.size * 0.45}
            fill={fl.color} opacity="0.85"
            style={{
              animation: active
                ? `ts-leaf-fall ${fl.speed}s ease-in ${fl.delay}s infinite`
                : "none",
              "--lr": `${fl.rot}deg`,
              "--ls": `${fl.sway}px`,
            } as React.CSSProperties}
          />
        ))}

        {/* ── Road (dirt lane) ── */}
        <path
          d={`M${460},${HORIZON_Y + 22} L${980},${HORIZON_Y + 22} L${W},${H} L0,${H} Z`}
          fill="#6a5030" opacity="0.55"
        />
        {/* Road ruts */}
        {[560, 620, 820, 880].map((rx, i) => (
          <line key={i}
            x1={rx} y1={HORIZON_Y + 24}
            x2={rx + (i < 2 ? -140 : 140)} y2={H}
            stroke="#3a2810" strokeWidth="2.5" opacity="0.3" />
        ))}

        {/* ── Label ── */}
        <g style={{
          opacity: active ? 1 : 0,
          transform: active ? "translateY(0)" : "translateY(-8px)",
          transition: tr(0.12),
        }}>
          <text x={W / 2} y={H - 18} textAnchor="middle"
            fontFamily="'Georgia', serif" fontSize="11" fill="#c8a040"
            letterSpacing="3" opacity="0.65">
            YE OLDE ROUTE 9 TAVERN · EST. 1742 · SHREWSBURY, MA
          </text>
        </g>
      </svg>
    </section>
  );
}
