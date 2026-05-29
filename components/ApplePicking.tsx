"use client";
import { useEffect, useRef, useState } from "react";

const W = 1280, H = 520;
const GY = H - 60;
const HORIZON_Y = 192;
const WHEEL_R = 36;
const WHEEL_Y = GY - WHEEL_R;
const WHEEL_X1 = 760, WHEEL_X2 = 876;

const TREES = [
  { x: 90,  th: 106, cr: 52, nl: 3, po: 0.00 },
  { x: 292, th: 132, cr: 70, nl: 4, po: 0.42 },
  { x: 592, th: 162, cr: 88, nl: 4, po: 0.88 },
  { x: 886, th: 138, cr: 74, nl: 4, po: 0.27 },
  { x: 1112, th: 112, cr: 58, nl: 3, po: 0.65 },
] as const;

const APPLE_C = ["#cc1818", "#d42222", "#b81010", "#e02a2a", "#c01e1e"] as const;
const LEAF_C  = ["#c8440a", "#d4620e", "#e09010", "#c83010", "#b05008"] as const;
const COAT_C  = ["#2a4a8a", "#8a3a22", "#3a6a2a", "#7a4a10", "#2a2a6a"] as const;

function appleDotsForTree(
  treeIdx: number, tx: number, topY: number, cr: number, nl: number
): { x: number; y: number; c: string }[] {
  const pts: { x: number; y: number; c: string }[] = [];
  for (let li = 0; li < nl; li++) {
    const layerY = topY + li * cr * 0.52;
    const layerW = cr * (0.55 + li * 0.32);
    const n = 4 + li * 3 + treeIdx % 2;
    for (let ai = 0; ai < n; ai++) {
      const a = (ai / n) * Math.PI * 2 + treeIdx * 0.41 + li * 0.7;
      const dr = layerW * (0.35 + (ai * 7 + li * 3 + treeIdx) % 100 / 100 * 0.6);
      pts.push({
        x: tx + Math.cos(a) * dr,
        y: layerY + Math.sin(a) * dr * 0.48,
        c: APPLE_C[(ai + li + treeIdx) % 5] ?? "#cc1818",
      });
    }
  }
  return pts;
}

const FALLEN = Array.from({ length: 26 }, (_, i) => ({
  x: 42 + (i * 53 + 11) % 1196,
  y: GY - 2 - (i * 7) % 18,
  r: 4.5 + (i * 3) % 5,
  c: APPLE_C[i % 5] ?? "#cc1818",
}));

const LEAF_DATA = Array.from({ length: 34 }, (_, i) => ({
  x0: 180 + (i * 37 + 20) % 940,
  startFrac: i / 34,
  spd: 0.28 + (i * 13) % 100 / 100 * 0.32,
  swayAmp: ((i * 7) % 100 / 50 - 1) * 26,
  swayFreq: 1.8 + (i * 5) % 100 / 100 * 1.4,
  rot0: (i * 47) % 360,
  rotSpd: ((i * 11) % 100 / 50 - 1) * 4.5,
  col: LEAF_C[i % 5] ?? "#c8440a",
  sz: 8 + (i * 3) % 7,
}));

const BASKETS = [
  { x: 162, fill: 0.88 },
  { x: 228, fill: 0.55 },
  { x: 378, fill: 1.00 },
  { x: 966, fill: 0.38 },
  { x: 1038, fill: 0.82 },
] as const;

const BG_TREES = Array.from({ length: 20 }, (_, i) => ({
  x: 18 + i * 66 + (i * 13) % 28,
  dy: 8 + (i * 9) % 32,
  r: 11 + (i * 5) % 14,
}));

const WALL_STONES = Array.from({ length: 34 }, (_, i) => ({
  x: i * 40 - (i * 7) % 16,
  row: i % 3,
  w: 28 + (i * 9) % 22,
  h: 11 + (i * 5) % 8,
  light: 42 + (i * 9) % 18,
}));

const LEG_OFFSETS: [number, number][] = [[-42, 0], [-20, 5], [4, 0], [22, -4]];

// Ladder helper: foot → head geometry
function ladGeom(fx: number, fy: number, hx: number, hy: number, nRungs: number) {
  const dx = hx - fx, dy = hy - fy;
  const len = Math.sqrt(dx * dx + dy * dy);
  const ux = dx / len, uy = dy / len;
  const px = -uy, py = ux; // perp
  return { fx, fy, hx, hy, ux, uy, px, py, nRungs, len };
}

export function ApplePicking() {
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

  const tailSw1  = Math.sin(phase * 2.3) * 24;
  const tailSw2  = Math.sin(phase * 2.3 + 0.9) * 17;
  const reach1   = Math.sin(phase * 1.8) * 18;
  const reach2   = Math.sin(phase * 2.1 + 1.1) * 15;
  const cloudOff = (phase * 7) % 380;
  const roomH    = GY - 62;

  const lad1 = ladGeom(348, GY - 2, 272, GY - 218, 10);
  const lad2 = ladGeom(834, GY - 2, 912, GY - 210, 10);

  return (
    <section className="w-full overflow-hidden" style={{ background: "#f0e8d4" }}>
      <svg
        ref={ref}
        viewBox={`0 0 ${W} ${H}`}
        width="100%"
        style={{ display: "block", opacity: vis ? 1 : 0, transition: "opacity 1s" }}
        aria-label="Autumn apple picking at Shrewsbury Orchards, Route 9, circa 1895"
      >
        <defs>
          <linearGradient id="apSky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#b0cce0" />
            <stop offset="52%"  stopColor="#cee0d0" />
            <stop offset="100%" stopColor="#bcd0a0" />
          </linearGradient>
          <linearGradient id="apGnd" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#9aaa68" />
            <stop offset="100%" stopColor="#7a8848" />
          </linearGradient>
          <linearGradient id="apHill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#88a860" />
            <stop offset="100%" stopColor="#9aaa68" />
          </linearGradient>
        </defs>

        {/* Sky */}
        <rect width={W} height={HORIZON_Y + 22} fill="url(#apSky)" />

        {/* Clouds */}
        {[0, 1, 2].map(ci => {
          const cx = ((ci * 360 + cloudOff) % (W + 200)) - 90;
          const cy = 38 + ci * 30;
          const sc = 0.82 + ci * 0.16;
          return (
            <g key={ci} transform={`translate(${cx},${cy}) scale(${sc})`} opacity={0.65}>
              <ellipse cx={0}   cy={0}  rx={58} ry={20} fill="#eef3f8" />
              <ellipse cx={-30} cy={5}  rx={40} ry={16} fill="#ecf1f6" />
              <ellipse cx={32}  cy={4}  rx={44} ry={18} fill="#eef3f8" />
              <ellipse cx={8}   cy={-9} rx={32} ry={15} fill="#f2f6fa" />
            </g>
          );
        })}

        {/* Rolling hill */}
        <path d={`M0,${HORIZON_Y+8} Q240,${HORIZON_Y-28} 480,${HORIZON_Y+6} Q700,${HORIZON_Y+22} 960,${HORIZON_Y-22} Q1120,${HORIZON_Y-38} 1280,${HORIZON_Y+6} L1280,${HORIZON_Y+44} L0,${HORIZON_Y+44} Z`}
          fill="url(#apHill)" />

        {/* Distant orchard on hillside */}
        {BG_TREES.map((t, i) => (
          <g key={i} transform={`translate(${t.x},${HORIZON_Y - 4})`} opacity={0.5}>
            <rect x={-2.5} y={-t.dy * 0.48} width={5} height={t.dy * 0.48} fill="#5a3e22" />
            <ellipse cx={0} cy={-t.dy * 0.48} rx={t.r} ry={t.r * 0.88}
              fill={`hsl(${16 + i * 8},${38 + i % 15}%,${32 + i % 12}%)`} />
          </g>
        ))}

        {/* Stone wall */}
        <g transform={`translate(0,${HORIZON_Y + 30})`}>
          <rect x={0} y={0} width={W} height={22} fill="#a09070" />
          {WALL_STONES.map((s, i) => (
            <rect key={i} x={s.x} y={s.row * 7} width={s.w} height={s.h}
              fill={`hsl(28,${15 + i % 10}%,${s.light}%)`}
              stroke="#908060" strokeWidth={0.6} rx={1} />
          ))}
          <line x1={0} y1={-0.5} x2={W} y2={-0.5} stroke="#c0b090" strokeWidth={1.5} />
        </g>

        {/* Ground */}
        <rect y={HORIZON_Y + 52} width={W} height={H - HORIZON_Y - 52} fill="url(#apGnd)" />
        {Array.from({ length: 9 }, (_, i) => (
          <line key={i} x1={0} y1={HORIZON_Y + 60 + i * 28} x2={W} y2={HORIZON_Y + 64 + i * 28}
            stroke="#8a9858" strokeWidth={1} opacity={0.28} />
        ))}

        {/* Fallen apples */}
        {FALLEN.map((a, i) => (
          <ellipse key={i} cx={a.x} cy={a.y} rx={a.r} ry={a.r * 0.78} fill={a.c} />
        ))}

        {/* Apple trees */}
        {TREES.map((tr, ti) => {
          const topY = GY - tr.th;
          const dots = appleDotsForTree(ti, tr.x, topY - tr.cr * 0.28, tr.cr, tr.nl);
          const sway = Math.sin(phase * 0.52 + tr.po * 6.28) * 2.0;
          return (
            <g key={ti} transform={`translate(${tr.x},${GY})`}>
              {/* Trunk */}
              <rect x={-9} y={-tr.th} width={18} height={tr.th} fill="#5a3e28" rx={2} />
              <line x1={-3} y1={-tr.th + 8} x2={-4} y2={-12} stroke="#4a3018" strokeWidth={1.2} opacity={0.45} />
              <line x1={3}  y1={-tr.th + 12} x2={4}  y2={-16} stroke="#4a3018" strokeWidth={1.0} opacity={0.4} />
              {/* Branch splits */}
              <line x1={0} y1={-tr.th + 22} x2={-tr.cr * 0.44} y2={-tr.th - tr.cr * 0.1}
                stroke="#5a3e28" strokeWidth={8} strokeLinecap="round" />
              <line x1={0} y1={-tr.th + 22} x2={tr.cr * 0.4}   y2={-tr.th - tr.cr * 0.08}
                stroke="#5a3e28" strokeWidth={7} strokeLinecap="round" />
              {/* Canopy layers */}
              {Array.from({ length: tr.nl }, (_, li) => {
                const cy = -(tr.th + tr.cr * 0.3 + li * tr.cr * 0.5);
                const rx_ = tr.cr * (0.58 + li * 0.26);
                const ry_ = tr.cr * 0.60;
                const swX = sway * (li + 1) * 0.55;
                return (
                  <ellipse key={li} cx={swX} cy={cy} rx={rx_} ry={ry_}
                    fill={`hsl(${18 + ti * 5 + li * 7},${52 + li * 9}%,${30 + li * 6}%)`} />
                );
              })}
              {/* Apple dots */}
              {dots.map((a, ai) => (
                <circle key={ai} cx={a.x - tr.x} cy={a.y - GY} r={4.2} fill={a.c} />
              ))}
            </g>
          );
        })}

        {/* Ladder 1 — leans on tree[1] x=292 */}
        {(() => {
          const { fx, fy, ux, uy, px, py, nRungs, len } = lad1;
          const rw = 7;
          return (
            <g>
              <line x1={fx - px * rw} y1={fy - py * rw} x2={fx + ux * len - px * rw} y2={fy + uy * len - py * rw}
                stroke="#9a7040" strokeWidth={5.5} strokeLinecap="round" />
              <line x1={fx + px * rw} y1={fy + py * rw} x2={fx + ux * len + px * rw} y2={fy + uy * len + py * rw}
                stroke="#9a7040" strokeWidth={5.5} strokeLinecap="round" />
              {Array.from({ length: nRungs }, (_, ri) => {
                const t = (ri + 1) / (nRungs + 1);
                const rx_ = fx + ux * len * t, ry_ = fy + uy * len * t;
                return (
                  <line key={ri}
                    x1={rx_ - px * (rw + 1)} y1={ry_ - py * (rw + 1)}
                    x2={rx_ + px * (rw + 1)} y2={ry_ + py * (rw + 1)}
                    stroke="#7a5030" strokeWidth={4} strokeLinecap="round" />
                );
              })}
            </g>
          );
        })()}

        {/* Ladder 2 — leans on tree[3] x=886 */}
        {(() => {
          const { fx, fy, ux, uy, px, py, nRungs, len } = lad2;
          const rw = 7;
          return (
            <g>
              <line x1={fx - px * rw} y1={fy - py * rw} x2={fx + ux * len - px * rw} y2={fy + uy * len - py * rw}
                stroke="#9a7040" strokeWidth={5.5} strokeLinecap="round" />
              <line x1={fx + px * rw} y1={fy + py * rw} x2={fx + ux * len + px * rw} y2={fy + uy * len + py * rw}
                stroke="#9a7040" strokeWidth={5.5} strokeLinecap="round" />
              {Array.from({ length: nRungs }, (_, ri) => {
                const t = (ri + 1) / (nRungs + 1);
                const rx_ = fx + ux * len * t, ry_ = fy + uy * len * t;
                return (
                  <line key={ri}
                    x1={rx_ - px * (rw + 1)} y1={ry_ - py * (rw + 1)}
                    x2={rx_ + px * (rw + 1)} y2={ry_ + py * (rw + 1)}
                    stroke="#7a5030" strokeWidth={4} strokeLinecap="round" />
                );
              })}
            </g>
          );
        })()}

        {/* Picker 1 — high on ladder 1 */}
        {(() => {
          const t = 0.78;
          const { fx, fy, ux, uy, px, py, len } = lad1;
          const bx = fx + ux * len * t + px * 5;
          const by = fy + uy * len * t + py * 5;
          const armA = (-108 + reach1) * Math.PI / 180;
          const ahX = bx + Math.cos(armA) * 28, ahY = by + Math.sin(armA) * 28;
          return (
            <g>
              <rect x={bx - 6} y={by - 42} width={12} height={28}
                fill={COAT_C[0] ?? "#2a4a8a"} rx={2} />
              <line x1={bx - 3} y1={by - 14} x2={bx - 5} y2={by + 2}
                stroke="#1a2a5a" strokeWidth={5} />
              <line x1={bx + 3} y1={by - 14} x2={bx + 5} y2={by + 2}
                stroke="#1a2a5a" strokeWidth={5} />
              <circle cx={bx} cy={by - 50} r={9} fill="#d4956a" />
              <ellipse cx={bx} cy={by - 57} rx={13} ry={4} fill="#7a5e28" />
              <rect x={bx - 7} y={by - 64} width={14} height={10} fill="#7a5e28" rx={1} />
              <line x1={bx + 5} y1={by - 38} x2={ahX} y2={ahY}
                stroke="#d4956a" strokeWidth={4} strokeLinecap="round" />
              <line x1={bx - 5} y1={by - 36} x2={bx - 18} y2={by - 26}
                stroke="#d4956a" strokeWidth={4} strokeLinecap="round" />
              <circle cx={ahX} cy={ahY} r={5.5} fill="#cc1818" />
            </g>
          );
        })()}

        {/* Picker 2 — high on ladder 2, woman with apron */}
        {(() => {
          const t = 0.76;
          const { fx, fy, ux, uy, px, py, len } = lad2;
          const bx = fx + ux * len * t - px * 5;
          const by = fy + uy * len * t - py * 5;
          const armA = (-95 + reach2) * Math.PI / 180;
          const ahX = bx + Math.cos(armA) * 26, ahY = by + Math.sin(armA) * 26;
          return (
            <g>
              <rect x={bx - 6} y={by - 38} width={12} height={24}
                fill={COAT_C[1] ?? "#8a3a22"} rx={2} />
              <path d={`M${bx - 8},${by - 14} Q${bx - 11},${by + 2} ${bx - 9},${by + 14} Q${bx},${by + 20} ${bx + 9},${by + 14} Q${bx + 11},${by + 2} ${bx + 8},${by - 14} Z`}
                fill={COAT_C[1] ?? "#8a3a22"} />
              <path d={`M${bx - 5},${by - 14} Q${bx - 7},${by + 2} ${bx - 5},${by + 12} Q${bx},${by + 16} ${bx + 5},${by + 12} Q${bx + 7},${by + 2} ${bx + 5},${by - 14} Z`}
                fill="#e8d8a0" opacity={0.85} />
              <circle cx={bx} cy={by - 46} r={9} fill="#c4855a" />
              <circle cx={bx} cy={by - 53} r={6} fill="#2a1808" />
              <line x1={bx - 5} y1={by - 34} x2={ahX} y2={ahY}
                stroke="#c4855a" strokeWidth={4} strokeLinecap="round" />
              <line x1={bx + 5} y1={by - 32} x2={bx + 14} y2={by - 16}
                stroke="#c4855a" strokeWidth={4} strokeLinecap="round" />
              <path d={`M${bx + 8},${by - 18} Q${bx + 8},${by - 10} ${bx + 22},${by - 10} Q${bx + 22},${by - 18} Z`}
                fill="#c8a068" />
              <circle cx={bx + 13} cy={by - 14} r={4} fill="#cc1818" />
              <circle cx={bx + 19} cy={by - 14} r={4} fill="#d42222" />
            </g>
          );
        })()}

        {/* Cart wheels */}
        {([[WHEEL_X1, WHEEL_Y], [WHEEL_X2, WHEEL_Y]] as [number, number][]).map(([wx, wy], wi) => (
          <g key={wi} transform={`translate(${wx},${wy})`}>
            <circle cx={0} cy={0} r={WHEEL_R} fill="none" stroke="#5a3818" strokeWidth={5.5} />
            <circle cx={0} cy={0} r={8} fill="#7a5030" stroke="#4a2808" strokeWidth={2} />
            {Array.from({ length: 8 }, (_, si) => {
              const sa = (si / 8) * Math.PI * 2 + wi * 0.39;
              return (
                <line key={si}
                  x1={Math.cos(sa) * 8}  y1={Math.sin(sa) * 8}
                  x2={Math.cos(sa) * (WHEEL_R - 3)} y2={Math.sin(sa) * (WHEEL_R - 3)}
                  stroke="#5a3818" strokeWidth={2.5} />
              );
            })}
          </g>
        ))}

        {/* Cart body */}
        <rect x={WHEEL_X1 - 22} y={WHEEL_Y - 50}
          width={WHEEL_X2 - WHEEL_X1 + 44} height={50}
          fill="#b87838" stroke="#7a4818" strokeWidth={2} rx={2} />
        {Array.from({ length: 8 }, (_, pi) => (
          <line key={pi}
            x1={WHEEL_X1 - 22} y1={WHEEL_Y - 50 + 6 + pi * 6}
            x2={WHEEL_X2 + 22}  y2={WHEEL_Y - 50 + 6 + pi * 6}
            stroke="#7a4818" strokeWidth={1} opacity={0.4} />
        ))}
        {/* Side boards */}
        <rect x={WHEEL_X1 - 22} y={WHEEL_Y - 50} width={8}  height={50} fill="#9a6828" />
        <rect x={WHEEL_X2 + 14}  y={WHEEL_Y - 50} width={8}  height={50} fill="#9a6828" />

        {/* Barrels of apples in cart */}
        {[0, 1, 2].map(bi => {
          const bx = WHEEL_X1 + 8 + bi * 52;
          const by = WHEEL_Y - 54;
          return (
            <g key={bi}>
              <ellipse cx={bx} cy={by}      rx={20} ry={13} fill="#a06228" />
              <rect x={bx - 20} y={by - 22} width={40} height={24} fill="#b07038" />
              <ellipse cx={bx} cy={by - 22} rx={20} ry={13} fill="#a06228" />
              <ellipse cx={bx} cy={by - 14} rx={20} ry={5}  fill="none" stroke="#5a2e10" strokeWidth={2} />
              <ellipse cx={bx} cy={by - 7}  rx={20} ry={5}  fill="none" stroke="#5a2e10" strokeWidth={2} />
              {[0, 1, 2].map(ai => (
                <circle key={ai} cx={bx - 8 + ai * 8} cy={by - 24} r={5}
                  fill={APPLE_C[ai % 5] ?? "#cc1818"} />
              ))}
            </g>
          );
        })}

        {/* Cart tongue */}
        <line x1={WHEEL_X1 - 22} y1={WHEEL_Y - 14}
          x2={WHEEL_X1 - 90}  y2={WHEEL_Y - 26}
          stroke="#7a5030" strokeWidth={8} strokeLinecap="round" />

        {/* Horse */}
        {(() => {
          const hx = WHEEL_X1 - 112;
          const hy = GY;
          const tc1x = 18 - Math.sin(tailSw1 * Math.PI / 180) * 28;
          const tc1y = -Math.sin(tailSw2 * Math.PI / 180) * 20;
          const tc2x = 28 - Math.sin(tailSw1 * Math.PI / 180) * 22;
          const tc2y = 12 - Math.sin(tailSw2 * Math.PI / 180) * 14;
          return (
            <g transform={`translate(${hx},${hy})`}>
              <ellipse cx={-8} cy={-68} rx={68} ry={36} fill="#6a4a28" />
              <path d="M-58,-80 Q-76,-106 -64,-122" fill="none"
                stroke="#6a4a28" strokeWidth={24} strokeLinecap="round" />
              <ellipse cx={-66} cy={-126} rx={18} ry={13} fill="#6a4a28"
                transform="rotate(-28,-66,-126)" />
              <path d="M-74,-134 L-70,-144 L-65,-134" fill="#5a3a18" />
              <circle cx={-72} cy={-128} r={3} fill="#1a0e00" />
              <circle cx={-71} cy={-127} r={1} fill="#fff" opacity={0.5} />
              <ellipse cx={-79} cy={-122} rx={3} ry={2} fill="#4a2a10" />
              <path d="M-60,-122 Q-72,-110 -70,-94" fill="none"
                stroke="#3a2408" strokeWidth={9} strokeLinecap="round" />
              {/* Collar */}
              <ellipse cx={-52} cy={-92} rx={10} ry={14}
                fill="none" stroke="#2a1808" strokeWidth={5} />
              {/* Tail */}
              <path d={`M32,-52 Q${tc1x},${-18 + tc1y} ${tc2x},${12 + tc2y}`}
                fill="none" stroke="#3a2408" strokeWidth={11} strokeLinecap="round" />
              <path d={`M${tc1x},${-18 + tc1y} Q${tc2x + 10},${5 + tc2y * 0.8} ${tc2x + 5},${20 + tc2y * 0.5}`}
                fill="none" stroke="#4a3010" strokeWidth={7} strokeLinecap="round" />
              {/* Legs */}
              {LEG_OFFSETS.map(([lx, lo], li) => (
                <g key={li}>
                  <line x1={lx} y1={-34} x2={lx + lo} y2={0}
                    stroke="#5a3a18" strokeWidth={10} strokeLinecap="round" />
                  <ellipse cx={lx + lo} cy={-2} rx={7} ry={4} fill="#2a1a08" />
                </g>
              ))}
              <path d="M-55,-88 Q-18,-78 22,-70"
                fill="none" stroke="#1a0e04" strokeWidth={3.5} opacity={0.85} />
              <line x1={-22} y1={-74} x2={-24} y2={-92} stroke="#1a0e04" strokeWidth={3} />
            </g>
          );
        })()}

        {/* Bushel baskets */}
        {BASKETS.map((b, bi) => {
          const bw = 32, bh = 28;
          return (
            <g key={bi} transform={`translate(${b.x},${GY})`}>
              <path d={`M${-bw / 2 - 2},0 Q${-bw / 2 - 4},${-bh / 2} ${-bw / 2},${-bh} Q0,${-bh - 3} ${bw / 2},${-bh} Q${bw / 2 + 4},${-bh / 2} ${bw / 2 + 2},0 Z`}
                fill="#d09848" />
              {Array.from({ length: 5 }, (_, wi) => {
                const wy = -(bh * (wi + 1) / 6);
                const wx = bw / 2 * (1 - wi * 0.04);
                return <line key={wi} x1={-wx} y1={wy} x2={wx} y2={wy}
                  stroke="#a07828" strokeWidth={1.2} opacity={0.5} />;
              })}
              {Array.from({ length: Math.max(0, Math.floor(b.fill * 7)) }, (_, ai) => (
                <circle key={ai}
                  cx={-10 + (ai % 4) * 7 + (ai > 3 ? 3.5 : 0)}
                  cy={-bh + 9 + (ai > 3 ? 7 : 0)}
                  r={5} fill={APPLE_C[ai % 5] ?? "#cc1818"} />
              ))}
              <path d={`M${-bw / 2},${-bh} Q0,${-bh - 18} ${bw / 2},${-bh}`}
                fill="none" stroke="#8a5e28" strokeWidth={3} strokeLinecap="round" />
            </g>
          );
        })}

        {/* Falling leaves */}
        {LEAF_DATA.map((ld, li) => {
          const raw = phase * ld.spd * roomH + ld.startFrac * roomH;
          const lx = ld.x0 + Math.sin(phase * ld.swayFreq + ld.startFrac * 6.28) * ld.swayAmp * 0.4;
          const ly = ((raw % roomH) + roomH) % roomH + 62;
          const lr = ld.rot0 + phase * ld.spd * ld.rotSpd * 180;
          const s  = ld.sz;
          return (
            <g key={li} transform={`translate(${lx},${ly}) rotate(${lr})`} opacity={0.9}>
              <path
                d={`M0,${-s} Q${s * 0.55},${-s * 0.28} ${s * 0.82},${s * 0.22} Q${s * 0.28},${s * 0.72} 0,${s} Q${-s * 0.28},${s * 0.72} ${-s * 0.82},${s * 0.22} Q${-s * 0.55},${-s * 0.28} 0,${-s} Z`}
                fill={ld.col}
              />
              <line x1={0} y1={-s * 0.78} x2={0} y2={s * 0.78}
                stroke="#7a4a10" strokeWidth={0.8} opacity={0.45} />
            </g>
          );
        })}

        {/* Caption */}
        <text x={W / 2} y={H - 16} textAnchor="middle"
          fontFamily="Georgia, serif" fontSize={12} fill="#5a3a18"
          letterSpacing={2.5} opacity={0.75}>
          SHREWSBURY ORCHARDS · ROUTE 9 CORRIDOR · AUTUMN HARVEST · EST. 1848
        </text>
      </svg>
    </section>
  );
}
