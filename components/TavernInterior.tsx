"use client";
import { useEffect, useRef, useState } from "react";

const W = 1280, H = 520;
const FLOOR_Y = H - 45;   // 475
const CEIL_Y  = 54;

// Fireplace (on back wall, left zone)
const FP_OX  = 118;                    // opening left x
const FP_OW  = 168;                    // opening width
const FP_OH  = 192;                    // opening height
const FP_OT  = FLOOR_Y - FP_OH;        // opening top y = 283
const FP_MC  = FP_OX + FP_OW / 2;     // fire center x = 202
const FP_MNT = FP_OT - 22;            // mantel shelf y = 261

// Bar counter (right zone)
const BAR_X = 790, BAR_T = FLOOR_Y - 90;   // counter top y = 385
const BAR_W = 452;

const BEAMS = [
  { y: CEIL_Y + 2,  h: 26 },
  { y: CEIL_Y + 68, h: 21 },
  { y: CEIL_Y + 138, h: 18 },
  { y: CEIL_Y + 208, h: 15 },
] as const;

const LANTERNS = [
  { x: 395, y: 108 },
  { x: 688, y: 96  },
] as const;

const PATRONS = [
  { x: 468, coat: "#2a3858", hat: "#1a2240", po: 0.0 },
  { x: 598, coat: "#5a3820", hat: "#3a2210", po: 1.5 },
] as const;

const N_EMBERS = 22;
const EMBERS = Array.from({ length: N_EMBERS }, (_, i) => ({
  x0: FP_OX + 18 + (i * 7) % (FP_OW - 36),
  spd: 0.28 + (i * 9) % 100 / 100 * 0.42,
  sway: ((i * 13) % 100 / 50 - 1) * 16,
  ph: i / N_EMBERS,
}));

const SHELF_ITEMS = Array.from({ length: 9 }, (_, i) => ({
  x: BAR_X + 24 + i * 44,
  h: 26 + (i * 7) % 14,
  kind: i % 3,
}));

const WALL_PANELS = Array.from({ length: 11 }, (_, i) => ({
  x: i * 116 + 2,
  w: 110,
}));

const FLOOR_BOARDS = Array.from({ length: 12 }, (_, i) => ({
  y: FLOOR_Y - i * 36,
  xoff: (i * 43) % 88,
}));

export function TavernInterior() {
  const ref = useRef<SVGSVGElement>(null);
  const [vis, setVis] = useState(false);
  const [phase, setPhase] = useState(0);

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
    const id = setInterval(() => setPhase(p => p + 0.016), 16);
    return () => clearInterval(id);
  }, [vis]);

  const flameSway     = Math.sin(phase * 5.1) * 8;
  const flameH        = 58 + Math.sin(phase * 6.9) * 14 + Math.sin(phase * 11.5) * 9;
  const fireFlicker   = 0.86 + Math.sin(phase * 7.3) * 0.11 + Math.sin(phase * 12.8) * 0.05;
  const lanternFlick  = 0.76 + Math.sin(phase * 8.6) * 0.15;
  const polishArm     = Math.sin(phase * 3.5) * 18;

  const FIRE_BASE = FLOOR_Y - 10;  // base of flames

  // Flame path helper: teardrop shape from base up
  const flamePath = (hw: number, fh: number, sw: number) =>
    `M${FP_MC - hw},${FIRE_BASE} Q${FP_MC + sw - hw * 0.45},${FIRE_BASE - fh * 0.52} ${FP_MC + sw},${FIRE_BASE - fh} Q${FP_MC + sw + hw * 0.45},${FIRE_BASE - fh * 0.52} ${FP_MC + hw},${FIRE_BASE} Z`;

  return (
    <section className="w-full overflow-hidden" style={{ background: "#0e0a04" }}>
      <svg
        ref={ref}
        viewBox={`0 0 ${W} ${H}`}
        width="100%"
        style={{ display: "block", opacity: vis ? 1 : 0, transition: "opacity 1.1s" }}
        aria-label="The Shrewsbury Arms colonial tavern interior, circa 1780"
      >
        <defs>
          <linearGradient id="tiRoom" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#1a1208" />
            <stop offset="100%" stopColor="#261808" />
          </linearGradient>
          <linearGradient id="tiFloor" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#5a3e20" />
            <stop offset="100%" stopColor="#3e2810" />
          </linearGradient>
          <linearGradient id="tiBar" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#7a5028" />
            <stop offset="100%" stopColor="#5a3818" />
          </linearGradient>
          <linearGradient id="tiStone" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%"   stopColor="#4a3a28" />
            <stop offset="50%"  stopColor="#5a4a38" />
            <stop offset="100%" stopColor="#4a3a28" />
          </linearGradient>
        </defs>

        {/* Room background */}
        <rect width={W} height={H} fill="url(#tiRoom)" />

        {/* Fire glow on room walls */}
        <ellipse cx={FP_MC} cy={FLOOR_Y - 160}
          rx={580} ry={360}
          fill="#f06820" opacity={0.10 * fireFlicker} />
        <ellipse cx={FP_MC} cy={FLOOR_Y - 40}
          rx={200} ry={90}
          fill="#f89030" opacity={0.22 * fireFlicker} />

        {/* Ceiling */}
        <rect x={0} y={0} width={W} height={CEIL_Y + 4} fill="#1e1408" />

        {/* Ceiling beams */}
        {BEAMS.map((b, i) => (
          <g key={i}>
            <rect x={0} y={b.y} width={W} height={b.h} fill="#2e1e0a" />
            {/* Beam grain */}
            <line x1={0} y1={b.y + b.h * 0.35} x2={W} y2={b.y + b.h * 0.35}
              stroke="#1e1206" strokeWidth={1} opacity={0.5} />
            {/* Beam shadow */}
            <rect x={0} y={b.y + b.h} width={W} height={4}
              fill="#000" opacity={0.25} />
          </g>
        ))}

        {/* Back wall paneling */}
        {WALL_PANELS.map((p, i) => (
          <rect key={i} x={p.x} y={CEIL_Y + 4} width={p.w} height={FLOOR_Y - CEIL_Y - 4}
            fill={i % 2 === 0 ? "#221508" : "#281a0a"} stroke="#3a2810" strokeWidth={1} />
        ))}
        {/* Chair rail molding */}
        <rect x={0} y={CEIL_Y + 165} width={W} height={8} fill="#3a2810" />
        <rect x={0} y={CEIL_Y + 162} width={W} height={4} fill="#4a3818" />

        {/* Floor */}
        <rect x={0} y={FLOOR_Y} width={W} height={H - FLOOR_Y} fill="url(#tiFloor)" />
        {FLOOR_BOARDS.map((fb, i) => (
          <line key={i} x1={fb.xoff} y1={fb.y} x2={W - (fb.xoff * 0.4)} y2={fb.y}
            stroke="#2e1a08" strokeWidth={1.5} opacity={0.55} />
        ))}
        {/* Floor wax shine near fire */}
        <ellipse cx={FP_MC} cy={FLOOR_Y + 2}
          rx={160} ry={14}
          fill="#f07020" opacity={0.12 * fireFlicker} />

        {/* === FIREPLACE === */}
        {/* Stone chimney breast */}
        <rect x={78} y={CEIL_Y + 4} width={248} height={FLOOR_Y - CEIL_Y - 4}
          fill="url(#tiStone)" />
        {/* Stone blocks on chimney breast */}
        {Array.from({ length: 18 }, (_, i) => {
          const row = Math.floor(i / 3);
          const col = i % 3;
          const stx = 80 + col * 82 + (row % 2) * 22;
          const sty = CEIL_Y + 10 + row * 42;
          return (
            <rect key={i} x={stx} y={sty} width={76} height={38}
              fill={`hsl(28,${20 + i % 12}%,${24 + i % 8}%)`}
              stroke="#2a1e10" strokeWidth={0.8} rx={1} />
          );
        })}
        {/* Outer fireplace surround */}
        <rect x={84} y={FP_OT - 42} width={236} height={FP_OH + 42}
          fill="#4a3828" stroke="#3a2818" strokeWidth={2} />
        {/* Fireplace lintel */}
        <rect x={100} y={FP_OT - 12} width={FP_OW + 20} height={18}
          fill="#5a4030" stroke="#3a2818" strokeWidth={1} />
        {/* Fire opening (dark interior) */}
        <rect x={FP_OX} y={FP_OT} width={FP_OW} height={FP_OH}
          fill="#0a0604" />
        {/* Fireback (cast iron, dark grey) */}
        <rect x={FP_OX + 6} y={FP_OT + 8} width={FP_OW - 12} height={FP_OH - 30}
          fill="#1a1818" />

        {/* Logs in fire */}
        {[0, 1].map(li => (
          <g key={li}>
            <rect x={FP_OX + 12 + li * 52} y={FIRE_BASE - 14}
              width={FP_OW - 24 - li * 52} height={12}
              fill={li === 0 ? "#6a3010" : "#5a2808"} rx={4} />
            {/* Log grain */}
            <ellipse cx={FP_OX + 14 + li * 52 + (FP_OW - 28 - li * 52) / 2}
              cy={FIRE_BASE - 8} rx={8} ry={6}
              fill="#4a2208" />
          </g>
        ))}
        {/* Coal glow */}
        <ellipse cx={FP_MC} cy={FIRE_BASE - 4}
          rx={60} ry={10}
          fill="#ff4400" opacity={0.55 * fireFlicker} />

        {/* === FLAMES (4 layers) === */}
        <path d={flamePath(52, flameH, flameSway * 0.35)}
          fill="#c83808" opacity={fireFlicker} />
        <path d={flamePath(36, flameH * 0.83, flameSway * 0.55)}
          fill="#ee6018" opacity={fireFlicker} />
        <path d={flamePath(24, flameH * 0.65, flameSway * 0.78)}
          fill="#f89820" opacity={fireFlicker} />
        <path d={flamePath(12, flameH * 0.46, flameSway)}
          fill="#fff0a8" opacity={0.88 * fireFlicker} />

        {/* Ember sparks */}
        {EMBERS.map((e, i) => {
          const prog = ((phase * e.spd * 1.8 + e.ph) % 1 + 1) % 1;
          const ex = e.x0 + Math.sin(phase * e.spd * 2.8 + e.ph * 6.28) * e.sway;
          const ey = FP_OT + (1 - prog) * (FP_OH - 12);
          const eOp = (1 - prog) * 0.85;
          return (
            <circle key={i} cx={ex} cy={ey} r={1.4}
              fill="#ff8820" opacity={eOp} />
          );
        })}

        {/* Mantelpiece shelf */}
        <rect x={78} y={FP_MNT} width={248} height={14} fill="#5a3c1e" />
        <rect x={76} y={FP_MNT + 14} width={252} height={6} fill="#3a2410" />
        {/* Items on mantel: small clock, candle, pipe */}
        <rect x={186} y={FP_MNT - 28} width={32} height={28} fill="#3a2e18" stroke="#5a4828" strokeWidth={1} rx={2} />
        <circle cx={202} cy={FP_MNT - 18} r={9} fill="none" stroke="#a88828" strokeWidth={1.5} />
        <line x1={202} y1={FP_MNT - 18} x2={202} y2={FP_MNT - 10} stroke="#a88828" strokeWidth={1.5} />
        <line x1={202} y1={FP_MNT - 18} x2={209} y2={FP_MNT - 14} stroke="#a88828" strokeWidth={1.5} />
        {/* Candle */}
        <rect x={110} y={FP_MNT - 22} width={8} height={22} fill="#e8e0c0" rx={1} />
        <path d={`M114,${FP_MNT - 22} Q${116 + Math.sin(phase * 4.2) * 2},${FP_MNT - 32} ${112 + Math.sin(phase * 4.2) * 1.5},${FP_MNT - 30}`}
          fill="#f8a020" opacity={0.9} />
        {/* Hearthstone */}
        <rect x={FP_OX - 12} y={FLOOR_Y - 12} width={FP_OW + 24} height={14}
          fill="#6a5838" stroke="#4a3818" strokeWidth={1} />

        {/* Barrels left of fireplace */}
        {[0, 1].map(bi => {
          const bx = 18 + bi * 44, by = FLOOR_Y - 4;
          const bh = 56 + bi * 10, bw = 34 + bi * 6;
          return (
            <g key={bi}>
              <ellipse cx={bx + bw / 2} cy={by} rx={bw / 2} ry={7} fill="#4a2e10" />
              <rect x={bx} y={by - bh} width={bw} height={bh} fill="#5a3818" />
              <ellipse cx={bx + bw / 2} cy={by - bh} rx={bw / 2} ry={7} fill="#4a2e10" />
              {/* Hoops */}
              {[0.25, 0.55, 0.78].map((t, hi) => (
                <ellipse key={hi} cx={bx + bw / 2} cy={by - bh * t}
                  rx={bw / 2 + 2} ry={5} fill="none" stroke="#2a1808" strokeWidth={2.5} />
              ))}
            </g>
          );
        })}

        {/* === PATRON TABLE (center) === */}
        {/* Table */}
        <ellipse cx={532} cy={FLOOR_Y - 4} rx={72} ry={18} fill="#3a2410" stroke="#2a1808" strokeWidth={2} />
        <rect x={524} y={FLOOR_Y - 68} width={16} height={66} fill="#3a2410" rx={2} />
        <ellipse cx={532} cy={FLOOR_Y - 68} rx={72} ry={14} fill="#5a3818" stroke="#3a2410" strokeWidth={2} />
        {/* Pewter mugs on table */}
        {[492, 558].map((mx, mi) => (
          <g key={mi}>
            <rect x={mx - 7} y={FLOOR_Y - 84} width={14} height={16}
              fill="#8a9090" stroke="#6a7070" strokeWidth={1} rx={1} />
            <ellipse cx={mx} cy={FLOOR_Y - 84} rx={7} ry={3.5} fill="#9aa0a0" />
            <line x1={mx + 7} y1={FLOOR_Y - 82} x2={mx + 13} y2={FLOOR_Y - 76}
              stroke="#7a8080" strokeWidth={1.5} />
          </g>
        ))}
        {/* Candle on table */}
        <rect x={528} y={FLOOR_Y - 92} width={8} height={22} fill="#e8e0c0" rx={1} />
        <circle cx={532} cy={FLOOR_Y - 92} r={3} fill="#f8a020" opacity={0.85} />

        {/* Patrons seated at table */}
        {PATRONS.map((p, i) => {
          const mugLift = Math.max(0, Math.sin(phase * 1.2 + p.po));
          const armA = (-48 - mugLift * 48) * Math.PI / 180;
          const side = i === 0 ? 1 : -1;
          const py = FLOOR_Y - 6;
          return (
            <g key={i} transform={`translate(${p.x},${py})`}>
              {/* Chair back */}
              <rect x={side * -24} y={-88} width={20} height={52}
                fill="#3a2010" rx={2} />
              {/* Seat */}
              <rect x={side * -26} y={-44} width={24} height={8}
                fill="#4a2818" rx={1} />
              {/* Body */}
              <rect x={-8} y={-72} width={16} height={30} fill={p.coat} rx={2} />
              {/* Legs */}
              <line x1={-4} y1={-42} x2={-5} y2={-14} stroke={p.coat} strokeWidth={6} strokeLinecap="round" />
              <line x1={4}  y1={-42} x2={5}  y2={-14} stroke={p.coat} strokeWidth={6} strokeLinecap="round" />
              <ellipse cx={-6}  cy={-12} rx={5} ry={3} fill="#1a1208" />
              <ellipse cx={6}   cy={-12} rx={5} ry={3} fill="#1a1208" />
              {/* Head */}
              <circle cx={0} cy={-80} r={9} fill="#c4856a" />
              {/* Tricorn hat */}
              <ellipse cx={0} cy={-87} rx={12} ry={4} fill={p.hat} />
              <rect x={-7} y={-96} width={14} height={10} fill={p.hat} rx={1} />
              {/* Lifting arm with mug */}
              <line x1={side * 6} y1={-66}
                x2={side * 6 + Math.cos(armA) * 24}
                y2={-66 + Math.sin(armA) * 24}
                stroke="#c4856a" strokeWidth={4.5} strokeLinecap="round" />
              {mugLift > 0.2 && (
                <rect
                  x={side * 6 + Math.cos(armA) * 24 - 5}
                  y={-66 + Math.sin(armA) * 24 - 8}
                  width={10} height={12}
                  fill="#8a9090" rx={1} />
              )}
              {/* Other arm on table */}
              <line x1={side * -5} y1={-64}
                x2={side * -18} y2={-62}
                stroke="#c4856a" strokeWidth={4} strokeLinecap="round" />
            </g>
          );
        })}

        {/* === DARTBOARD on back wall (center) === */}
        {(() => {
          const dx = 688, dy = CEIL_Y + 136;
          const r = 42;
          return (
            <g>
              {/* Mount */}
              <circle cx={dx} cy={dy} r={r + 8} fill="#2a1e10" />
              {/* Rings */}
              {[r, r * 0.78, r * 0.58, r * 0.38, r * 0.18].map((cr, ci) => (
                <circle key={ci} cx={dx} cy={dy} r={cr}
                  fill={["#1a1a18", "#e0e0d8", "#c82020", "#1a8a28", "#c82020"][ci] ?? "#1a1a18"}
                  stroke="#1a1208" strokeWidth={0.8} />
              ))}
              {/* Radial section lines (20 sections) */}
              {Array.from({ length: 20 }, (_, si) => {
                const a = (si / 20) * Math.PI * 2;
                return (
                  <line key={si}
                    x1={dx + Math.cos(a) * r * 0.18} y1={dy + Math.sin(a) * r * 0.18}
                    x2={dx + Math.cos(a) * r}         y2={dy + Math.sin(a) * r}
                    stroke="#1a1208" strokeWidth={0.7} />
                );
              })}
              {/* Bull's-eye */}
              <circle cx={dx} cy={dy} r={r * 0.1} fill="#c82020" />
              {/* Dart stuck in double-18 zone */}
              <line x1={dx + 24} y1={dy - 28}
                x2={dx + 30} y2={dy - 35}
                stroke="#8a8888" strokeWidth={1.8} />
              <polygon
                points={`${dx + 30},${dy - 35} ${dx + 34},${dy - 32} ${dx + 28},${dy - 40}`}
                fill="#6a6868" />
            </g>
          );
        })()}

        {/* === BAR COUNTER (right zone) === */}
        {/* Back shelf unit */}
        <rect x={BAR_X + 12} y={CEIL_Y + 4} width={BAR_W - 12} height={FLOOR_Y - CEIL_Y - 4}
          fill="#2e1e0c" />
        {/* Shelf boards (3 shelves) */}
        {[0.28, 0.52, 0.72].map((t, si) => (
          <rect key={si}
            x={BAR_X + 12} y={CEIL_Y + 4 + t * (BAR_T - CEIL_Y - 4) - 6}
            width={BAR_W - 12} height={10}
            fill="#5a3818" />
        ))}
        {/* Mirror above bar */}
        <rect x={BAR_X + 48} y={CEIL_Y + 10} width={BAR_W - 96} height={85}
          fill="#d0b870" opacity={0.12} stroke="#7a5828" strokeWidth={3} rx={2} />
        <rect x={BAR_X + 52} y={CEIL_Y + 14} width={BAR_W - 104} height={77}
          fill="#c8a858" opacity={0.08} />
        {/* Bottles/mugs on shelves */}
        {SHELF_ITEMS.map((item, i) => {
          const sy = BAR_T - 38 - (item.kind === 0 ? 28 : item.kind === 1 ? 18 : 20);
          const iw = item.kind === 2 ? 14 : 9;
          const ic = item.kind === 0
            ? `hsl(${140 + i * 22},${35 + i % 20}%,${18 + i % 12}%)`
            : item.kind === 1
            ? `hsl(${28 + i * 18},${45 + i % 20}%,${22 + i % 10}%)`
            : "#8a9090";
          return (
            <g key={i}>
              <rect x={item.x - iw / 2} y={sy} width={iw} height={item.h}
                fill={ic} rx={item.kind === 2 ? 1 : 3} />
              {item.kind === 0 && (
                <rect x={item.x - 3} y={sy - 8} width={6} height={10}
                  fill={ic} rx={2} />
              )}
              {item.kind === 2 && (
                <ellipse cx={item.x} cy={sy} rx={7} ry={3} fill="#9aa0a0" />
              )}
            </g>
          );
        })}
        {/* Counter surface */}
        <rect x={BAR_X} y={BAR_T - 8} width={BAR_W} height={8} fill="#6a4820" />
        <rect x={BAR_X} y={BAR_T} width={BAR_W} height={FLOOR_Y - BAR_T} fill="url(#tiBar)" />
        <rect x={BAR_X} y={BAR_T} width={BAR_W} height={4} fill="#8a5c28" />

        {/* Barkeep */}
        {(() => {
          const bkx = 920, bky = FLOOR_Y - 4;
          const armEndX = bkx + 18 + Math.cos((polishArm - 60) * Math.PI / 180) * 20;
          const armEndY = bky - 68 + Math.sin((polishArm - 60) * Math.PI / 180) * 20;
          return (
            <g transform={`translate(${bkx},${bky})`}>
              {/* Body / apron */}
              <rect x={-8} y={-72} width={16} height={40} fill="#d0c898" rx={2} />
              <rect x={-10} y={-58} width={20} height={28} fill="#e8e0b8" rx={1} />
              {/* Waistcoat */}
              <rect x={-8} y={-72} width={16} height={20} fill="#2a3818" rx={2} />
              {/* Legs */}
              <line x1={-4} y1={-32} x2={-5} y2={0} stroke="#1a1208" strokeWidth={7} strokeLinecap="round" />
              <line x1={4}  y1={-32} x2={5}  y2={0} stroke="#1a1208" strokeWidth={7} strokeLinecap="round" />
              <ellipse cx={-6} cy={2} rx={6} ry={3.5} fill="#1a1208" />
              <ellipse cx={6}  cy={2} rx={6} ry={3.5} fill="#1a1208" />
              {/* Head */}
              <circle cx={0} cy={-80} r={10} fill="#d4956a" />
              {/* Hair */}
              <ellipse cx={0} cy={-88} rx={10} ry={5} fill="#3a2010" />
              {/* Polishing arm */}
              <line x1={8} y1={-66} x2={armEndX - bkx} y2={armEndY - bky}
                stroke="#d4956a" strokeWidth={4.5} strokeLinecap="round" />
              {/* Mug being polished */}
              <rect x={armEndX - bkx - 6} y={armEndY - bky - 14}
                width={12} height={14}
                fill="#8a9090" rx={1} />
              {/* Other arm on counter */}
              <line x1={-8} y1={-64} x2={-22} y2={-56}
                stroke="#d4956a" strokeWidth={4} strokeLinecap="round" />
            </g>
          );
        })()}

        {/* Window (right wall, dark outside) */}
        {(() => {
          const wx = 1100, wy = CEIL_Y + 170, ww = 90, wh = 120;
          return (
            <g>
              <rect x={wx} y={wy} width={ww} height={wh} fill="#090e18" stroke="#5a3818" strokeWidth={4} />
              {/* Window panes (2x3) */}
              {[0, 1].map(col => [0, 1, 2].map(row => (
                <rect key={`${col}-${row}`}
                  x={wx + 6 + col * (ww / 2 - 3)} y={wy + 6 + row * (wh / 3 - 2)}
                  width={ww / 2 - 8} height={wh / 3 - 6}
                  fill="#0e1622" stroke="#3a2810" strokeWidth={1.5} />
              )))}
              {/* Moon outside */}
              <circle cx={wx + 44} cy={wy + 28} r={14}
                fill="#d8d4c0" opacity={0.5} />
              {/* Warm light reflection on sill */}
              <rect x={wx - 2} y={wy + wh - 2} width={ww + 4} height={8}
                fill="#5a3818" />
            </g>
          );
        })()}

        {/* === HANGING LANTERNS === */}
        {LANTERNS.map((ln, i) => {
          const gr = 32 + Math.sin(phase * 2.2 + i * 1.4) * 2;
          const glowR = 40 + Math.sin(phase * 4.8 + i) * 6;
          return (
            <g key={i}>
              {/* Lantern glow on ceiling/wall */}
              <ellipse cx={ln.x} cy={ln.y + 10}
                rx={glowR} ry={glowR * 0.6}
                fill="#f0a030" opacity={0.14 * lanternFlick} />
              {/* Chain */}
              <line x1={ln.x} y1={CEIL_Y + 4} x2={ln.x} y2={ln.y - gr / 2}
                stroke="#4a3820" strokeWidth={1.5} />
              {/* Lantern frame — diamond/hexagonal */}
              <polygon
                points={`${ln.x},${ln.y - gr / 2} ${ln.x + gr * 0.45},${ln.y} ${ln.x},${ln.y + gr / 2} ${ln.x - gr * 0.45},${ln.y}`}
                fill="none" stroke="#3a2a10" strokeWidth={2} />
              {/* Glass panes (warm glow inside) */}
              <polygon
                points={`${ln.x},${ln.y - gr / 2} ${ln.x + gr * 0.45},${ln.y} ${ln.x},${ln.y + gr / 2} ${ln.x - gr * 0.45},${ln.y}`}
                fill="#f0a030" opacity={0.35 * lanternFlick} />
              {/* Frame cross */}
              <line x1={ln.x - gr * 0.45} y1={ln.y} x2={ln.x + gr * 0.45} y2={ln.y}
                stroke="#3a2a10" strokeWidth={1.5} />
              <line x1={ln.x} y1={ln.y - gr / 2} x2={ln.x} y2={ln.y + gr / 2}
                stroke="#3a2a10" strokeWidth={1.5} />
              {/* Candle flame inside */}
              <ellipse cx={ln.x} cy={ln.y} rx={5} ry={7}
                fill="#fff8a0" opacity={0.7 * lanternFlick} />
            </g>
          );
        })}

        {/* Sign above bar: THE SHREWSBURY ARMS */}
        <rect x={814} y={CEIL_Y + 88} width={400} height={36}
          fill="#1e1208" stroke="#7a5820" strokeWidth={2} rx={3} />
        <text x={1014} y={CEIL_Y + 112} textAnchor="middle"
          fontFamily="Georgia, serif" fontSize={14} fill="#c8a840" letterSpacing={2}>
          THE SHREWSBURY ARMS · EST. 1732
        </text>

        {/* Framed notice by door */}
        <rect x={760} y={CEIL_Y + 175} width={28} height={36}
          fill="#e0d8b0" stroke="#5a3818" strokeWidth={1.5} rx={1} />
        <text x={774} y={CEIL_Y + 188} textAnchor="middle"
          fontFamily="Georgia, serif" fontSize={5} fill="#3a2408">
          GOOD ALE
        </text>
        <text x={774} y={CEIL_Y + 196} textAnchor="middle"
          fontFamily="Georgia, serif" fontSize={5} fill="#3a2408">
          LODGING
        </text>
        <text x={774} y={CEIL_Y + 204} textAnchor="middle"
          fontFamily="Georgia, serif" fontSize={5} fill="#3a2408">
          STABLING
        </text>

        {/* Caption */}
        <text x={W / 2} y={H - 16} textAnchor="middle"
          fontFamily="Georgia, serif" fontSize={12} fill="#c8a840"
          letterSpacing={2.5} opacity={0.72}>
          THE SHREWSBURY ARMS · SHREWSBURY, MASSACHUSETTS · EST. 1732
        </text>
      </svg>
    </section>
  );
}
