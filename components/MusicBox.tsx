"use client";

// MusicBox ─────────────────────────────────────────────────────────────────────
//
// Full-section animated music box mechanism. Six interlocking brass gears spin
// at physically correct ratio speeds: if G0 has 11s period, adjacent gears use
// T_n = T_driver × (r_n / r_driver) so every tooth meshes smoothly.
// CSS @keyframes mb-cw / mb-ccw drive rotations; transform-origin set per gear.
// Comb tines of varying length, paper roll with punched holes, floating notes.
// IntersectionObserver at 0.15 triggers animation + staggered reveals.
// Placed between RecordCrate and Testimonials.

import { useEffect, useRef, useState } from "react";

// Builds SVG polygon points string for a gear with n teeth.
// rO = outer (tip) radius; rI = inner (valley) radius.
function gearPts(cx: number, cy: number, rO: number, rI: number, n: number): string {
  const out: string[] = [];
  const step = (Math.PI * 2) / n;
  for (let i = 0; i < n; i++) {
    const a0 = i * step - Math.PI / 2;
    const a1 = a0 + step * 0.26;
    const a2 = a0 + step * 0.50;
    const a3 = a0 + step * 0.74;
    const p = (r: number, a: number) =>
      `${(cx + r * Math.cos(a)).toFixed(1)},${(cy + r * Math.sin(a)).toFixed(1)}`;
    out.push(p(rI, a0), p(rO, a1), p(rO, a2), p(rO, a3));
  }
  return out.join(" ");
}

type GearDef = {
  cx: number; cy: number;
  rO: number; rI: number;     // outer/inner pitch radii
  n: number;                  // tooth count
  hubR: number;               // hub circle radius
  spk: number;                // spoke count
  dur: number;                // revolution period (seconds)
  cw: boolean;                // clockwise?
  fill: string;
  edge: string;               // stroke/spoke color
};

// Six gears — center positions chosen so adjacent pairs mesh (dist = rO1 + rO2).
// Durations: T_driven = T_driver × (r_driven / r_driver).
const GEARS: GearDef[] = [
  // G0 — large driver, CW, base period 11s
  { cx: 550, cy: 278, rO: 78, rI: 63, n: 14, hubR: 18, spk: 6, dur: 11.00, cw: true,  fill: "#c89020", edge: "#8a5e10" },
  // G1 — right of G0 (550+78+50=678), CCW, 11×50/78 = 7.05s
  { cx: 678, cy: 278, rO: 50, rI: 40, n:  9, hubR: 12, spk: 4, dur:  7.05, cw: false, fill: "#b88020", edge: "#7a5010" },
  // G2 — above G1 (278-50-34=194), CW, 7.05×34/50 = 4.79s
  { cx: 678, cy: 194, rO: 34, rI: 26, n:  6, hubR:  8, spk: 3, dur:  4.79, cw: true,  fill: "#d4a02a", edge: "#9a7018" },
  // G3 — left of G0 (550-78-58=414), CCW, 11×58/78 = 8.18s
  { cx: 414, cy: 278, rO: 58, rI: 46, n: 10, hubR: 14, spk: 5, dur:  8.18, cw: false, fill: "#c49028", edge: "#8c6418" },
  // G4 — above G3 (278-58-36=184), CW, 8.18×36/58 = 5.08s
  { cx: 414, cy: 184, rO: 36, rI: 28, n:  7, hubR:  9, spk: 4, dur:  5.08, cw: true,  fill: "#b88020", edge: "#846010" },
  // G5 — right of G1 (678+50+24=752), CW, 7.05×24/50 = 3.38s
  { cx: 752, cy: 278, rO: 24, rI: 18, n:  4, hubR:  6, spk: 3, dur:  3.38, cw: true,  fill: "#d4a82a", edge: "#a07818" },
];

type SpokePt = { x1: string; y1: string; x2: string; y2: string };
function spokePts(cx: number, cy: number, rI: number, hubR: number, spk: number): SpokePt[] {
  return Array.from({ length: spk }, (_, i) => {
    const a = (i / spk) * Math.PI * 2;
    return {
      x1: (cx + hubR * Math.cos(a)).toFixed(1),
      y1: (cy + hubR * Math.sin(a)).toFixed(1),
      x2: (cx + rI   * Math.cos(a)).toFixed(1),
      y2: (cy + rI   * Math.sin(a)).toFixed(1),
    };
  });
}

// [x, y, delay_s, glyph]
const NOTES: [number, number, number, string][] = [
  [502, 114, 0.0, "♩"], [554, 100, 0.9, "♪"],
  [610, 112, 1.8, "♫"], [664, 96,  2.7, "♪"],
  [716, 108, 0.5, "♩"], [768, 98,  1.4, "♫"],
  [822, 110, 2.2, "♬"], [874, 100, 0.7, "♪"],
];

// Comb tine heights (alternating, 22 tines)
const TINE_HS = [44, 38, 50, 40, 46, 36, 52, 42, 48, 38, 44, 50,
                 36, 46, 40, 52, 38, 44, 48, 36, 50, 42] as const;

// Corner screw positions
const SCREWS: [number, number][] = [
  [244, 64], [1196, 64], [244, 476], [1196, 476],
];

// Decorative wood-grain line Y offsets (inside frame)
const GRAIN_YS = [92, 130, 168, 206, 244, 282, 320, 358, 396, 434] as const;

// Punched-hole grid on paper roll
const HOLE_ROWS = [372, 387, 402] as const;
const HOLE_COLS = [852, 864, 876] as const;
const ACTIVE_HOLES = new Set(["0-0", "0-2", "1-1", "2-0", "2-2"]);

export function MusicBox() {
  const [active, setActive] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e?.isIntersecting) { setActive(true); obs.disconnect(); } },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const tr = (d: number) => active ? `opacity 0.65s ease ${d}s` : "none";

  return (
    <div ref={ref} style={{
      background: "linear-gradient(180deg,#100804 0%,#0c0602 100%)",
      position: "relative",
      overflow: "hidden",
    }}>
      <style>{`
        @keyframes mb-cw  { from { transform:rotate(0deg)   } to { transform:rotate(360deg)  } }
        @keyframes mb-ccw { from { transform:rotate(0deg)   } to { transform:rotate(-360deg) } }
        @keyframes mb-note {
          0%   { transform:translateY(0px);   opacity:0    }
          12%  { opacity:.70 }
          82%  { opacity:.54 }
          100% { transform:translateY(-88px); opacity:0    }
        }
      `}</style>
      <svg
        viewBox="0 0 1440 540"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ display: "block", width: "100%", height: "auto" }}
        role="img"
        aria-label="Vintage music box with interlocking brass gear mechanism and floating musical notes"
      >
        <defs>
          <linearGradient id="mb-frame" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#3c1e0a"/>
            <stop offset="50%"  stopColor="#2a1406"/>
            <stop offset="100%" stopColor="#1e0e04"/>
          </linearGradient>
          <linearGradient id="mb-inner" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#2c1608"/>
            <stop offset="100%" stopColor="#1a0c04"/>
          </linearGradient>
          <linearGradient id="mb-brass-h" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%"   stopColor="#e0b038"/>
            <stop offset="50%"  stopColor="#c49020"/>
            <stop offset="100%" stopColor="#a07018"/>
          </linearGradient>
          <radialGradient id="mb-gear-gloss" cx="30%" cy="25%" r="68%">
            <stop offset="0%"   stopColor="rgba(255,230,120,.26)"/>
            <stop offset="100%" stopColor="rgba(0,0,0,0)"/>
          </radialGradient>
          <radialGradient id="mb-ambient" cx="48%" cy="50%" r="52%">
            <stop offset="0%"   stopColor="rgba(196,140,20,.24)"/>
            <stop offset="100%" stopColor="rgba(0,0,0,0)"/>
          </radialGradient>
          <filter id="mb-drop">
            <feDropShadow dx="2" dy="3" stdDeviation="5" floodColor="rgba(0,0,0,.50)"/>
          </filter>
        </defs>

        {/* ── OUTER WOODEN FRAME ── */}
        <rect x="228" y="48" width="984" height="444" rx="8"
          fill="url(#mb-frame)" filter="url(#mb-drop)"
          style={{ opacity: active ? 1 : 0, transition: tr(0.04) }}/>

        {/* Wood grain overlay */}
        <g style={{ opacity: active ? 0.20 : 0, transition: tr(0.04) }}>
          {GRAIN_YS.map((y, i) => (
            <line key={i} x1="238" y1={y} x2="1202" y2={y + 3}
              stroke="rgba(255,180,80,.55)" strokeWidth="0.5"/>
          ))}
        </g>

        {/* Brass inlay border */}
        <rect x="228" y="48" width="984" height="444" rx="8"
          fill="none" stroke="url(#mb-brass-h)" strokeWidth="3.5"
          style={{ opacity: active ? 1 : 0, transition: tr(0.05) }}/>
        <rect x="244" y="64" width="952" height="412" rx="5"
          fill="none" stroke="rgba(196,144,32,.20)" strokeWidth="1.2"
          style={{ opacity: active ? 1 : 0, transition: tr(0.05) }}/>

        {/* Inner viewing panel */}
        <rect x="262" y="80" width="916" height="380" rx="4"
          fill="url(#mb-inner)"
          style={{ opacity: active ? 1 : 0, transition: tr(0.06) }}/>

        {/* Ambient glow behind gears */}
        <ellipse cx="580" cy="268" rx="340" ry="210"
          fill="url(#mb-ambient)"
          style={{ opacity: active ? 1 : 0, transition: tr(0.07) }}/>

        {/* ══ GEAR MECHANISM ══ */}
        {GEARS.map((g, gi) => {
          const pts  = gearPts(g.cx, g.cy, g.rO, g.rI, g.n);
          const spks = spokePts(g.cx, g.cy, g.rI, g.hubR, g.spk);
          const anim = g.cw ? "mb-cw" : "mb-ccw";
          return (
            <g key={gi} style={{
              transformOrigin: `${g.cx}px ${g.cy}px`,
              animation: active ? `${anim} ${g.dur}s linear infinite` : "none",
              opacity: active ? 1 : 0,
              transition: tr(0.14 + gi * 0.04),
            }}>
              {/* Gear body */}
              <polygon points={pts} fill={g.fill} stroke={g.edge} strokeWidth="1.2"/>
              {/* Gloss highlight */}
              <polygon points={pts} fill="url(#mb-gear-gloss)" stroke="none"/>
              {/* Spokes */}
              {spks.map((sp, si) => (
                <line key={si}
                  x1={sp.x1} y1={sp.y1} x2={sp.x2} y2={sp.y2}
                  stroke={g.edge} strokeWidth="3.5" strokeLinecap="round"/>
              ))}
              {/* Hub */}
              <circle cx={g.cx} cy={g.cy} r={g.hubR}
                fill="#0c0602" stroke={g.edge} strokeWidth="1.8"/>
              <circle cx={g.cx} cy={g.cy} r="3.5"
                fill="rgba(196,148,32,.65)"/>
            </g>
          );
        })}

        {/* ── COMB TINES (below gears) ── */}
        <g style={{ opacity: active ? 1 : 0, transition: tr(0.20) }}>
          {TINE_HS.map((h, i) => (
            <rect key={i}
              x={472 + i * 18} y={370} width={3} height={h} rx="1.5"
              fill="rgba(204,192,164,.72)"
              stroke="rgba(140,120,78,.30)" strokeWidth="0.5"/>
          ))}
          {/* Comb base plate */}
          <rect x="468" y="408" width="400" height="10" rx="2"
            fill="rgba(184,144,60,.38)"/>
        </g>

        {/* ── PAPER ROLL ── */}
        <g style={{ opacity: active ? 1 : 0, transition: tr(0.18) }}>
          <rect x="828" y="178" width="80" height="180" rx="4"
            fill="#2a1806" stroke="rgba(180,140,48,.28)" strokeWidth="1.2"/>
          {/* Paper strip */}
          <rect x="846" y="358" width="44" height="52" rx="2"
            fill="rgba(242,230,198,.84)" stroke="rgba(180,140,58,.22)" strokeWidth="0.8"/>
          {/* Punched holes */}
          {HOLE_ROWS.map((py, ri) =>
            HOLE_COLS.map((px, ci) => (
              <circle key={`${ri}-${ci}`}
                cx={px} cy={py} r="2.4"
                fill={ACTIVE_HOLES.has(`${ri}-${ci}`) ? "#2a1806" : "transparent"}/>
            ))
          )}
          {/* Spool ends */}
          <ellipse cx="868" cy="188" rx="22" ry="7"
            fill="rgba(184,144,48,.42)" stroke="rgba(140,98,28,.25)" strokeWidth="1"/>
          <ellipse cx="868" cy="356" rx="22" ry="7"
            fill="rgba(184,144,48,.36)" stroke="rgba(140,98,28,.25)" strokeWidth="1"/>
        </g>

        {/* ── FLOATING MUSICAL NOTES ── */}
        {active && NOTES.map(([x, y, delay, ch], i) => (
          <text key={i}
            x={x} y={y}
            fill="rgba(224,180,44,.70)"
            fontSize="19"
            fontFamily="'Times New Roman',serif"
            style={{ animation: `mb-note 3.4s ease-out ${delay}s infinite` }}>
            {ch}
          </text>
        ))}

        {/* ── CORNER SCREWS ── */}
        {SCREWS.map(([cx, cy], i) => (
          <g key={i} style={{ opacity: active ? 1 : 0, transition: tr(0.06) }}>
            <circle cx={cx} cy={cy} r="7" fill="#1c0e06" stroke="rgba(196,152,42,.56)" strokeWidth="1.5"/>
            <line x1={cx - 4} y1={cy}     x2={cx + 4} y2={cy}     stroke="rgba(196,152,42,.40)" strokeWidth="1.2"/>
            <line x1={cx}     y1={cy - 4} x2={cx}     y2={cy + 4} stroke="rgba(196,152,42,.40)" strokeWidth="1.2"/>
          </g>
        ))}

        {/* ── HEADER ── */}
        <text x="720" y="40" textAnchor="middle"
          fill="rgba(196,152,42,.34)" fontSize="9"
          fontFamily="monospace" letterSpacing="5"
          style={{ opacity: active ? 1 : 0, transition: tr(0.04) }}>
          ROUTE 9 WEB CO. · THE MECHANISM
        </text>

        {/* ── CAPTION ── */}
        <g style={{ opacity: active ? 1 : 0, transition: tr(0.86) }}>
          <text x="720" y="506" textAnchor="middle"
            fill="rgba(196,160,62,.40)" fontSize="12"
            fontFamily="Georgia,'Times New Roman',serif"
            fontWeight="bold" letterSpacing="3.5">
            EVERY SITE WE BUILD IS A FINELY TUNED MECHANISM
          </text>
          <text x="720" y="524" textAnchor="middle"
            fill="rgba(180,140,50,.22)" fontSize="8.5"
            fontFamily="monospace" letterSpacing="2.5">
            DESIGN · DEVELOP · MAINTAIN · OPTIMIZE
          </text>
        </g>
      </svg>
    </div>
  );
}
