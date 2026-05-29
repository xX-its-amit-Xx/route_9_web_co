"use client";
import { useEffect, useRef, useState } from "react";

const W = 1280, H = 520;
const HORIZON_Y = 212;
const WATER_Y   = HORIZON_Y + 10;
const FLAT_Y    = HORIZON_Y + 52;  // where tidal flat starts
const NEAR_Y    = H - 52;          // near foreground

// ── Oyster bed patches ────────────────────────────────────────────────────
const BEDS = [
  { x: 162,  y: NEAR_Y  - 84,  w: 192, h: 58 },
  { x: 402,  y: NEAR_Y  - 100, w: 174, h: 54 },
  { x: 668,  y: NEAR_Y  - 92,  w: 180, h: 56 },
  { x: 888,  y: NEAR_Y  - 80,  w: 158, h: 52 },
  { x: 234,  y: NEAR_Y  - 162, w: 136, h: 40 },
  { x: 506,  y: NEAR_Y  - 172, w: 126, h: 38 },
  { x: 730,  y: NEAR_Y  - 164, w: 124, h: 38 },
] as const;

// ── Workers ───────────────────────────────────────────────────────────────
const WORKERS = [
  { x: 316,  y: NEAR_Y - 46, po: 0.00 },
  { x: 572,  y: NEAR_Y - 54, po: 1.18 },
  { x: 814,  y: NEAR_Y - 48, po: 2.36 },
] as const;

// ── Tide pools (golden-angle scatter) ─────────────────────────────────────
const POOLS = Array.from({ length: 18 }, (_, i) => {
  const a = i * 137.508 * Math.PI / 180;
  return {
    cx: 85 + ((Math.cos(a) + 1) / 2) * 1070,
    cy: NEAR_Y - 28 + ((Math.sin(a) + 1) / 2) * 24,
    rx: 18 + (i % 4) * 11,
    ry: 5  + (i % 3) * 2.5,
    ph: i  * 0.54,
  };
});

// ── Stakes/markers ────────────────────────────────────────────────────────
const STAKES = Array.from({ length: 22 }, (_, i) => {
  const a = i * 137.508 * Math.PI / 180;
  return {
    x: 170 + ((Math.cos(a) + 1) / 2) * 880,
    y: NEAR_Y - 55 + ((Math.sin(a) + 1) / 2) * 48,
    h: 28 + (i % 3) * 10,
  };
});

// ── Birds ─────────────────────────────────────────────────────────────────
const BIRDS = Array.from({ length: 9 }, (_, i) => ({
  ax:  90 + i * 138,
  ay:  HORIZON_Y - 30 - (i % 3) * 18,
  r:   26 + (i % 3) * 12,
  ph:  i  * 0.96,
  spd: 0.44 + (i % 3) * 0.11,
}));

// ── Oyster cages ──────────────────────────────────────────────────────────
const CAGES = [
  { x: 148,  y: NEAR_Y - 20 },
  { x: 484,  y: NEAR_Y - 18 },
  { x: 1018, y: NEAR_Y - 22 },
] as const;

const COAT_COLORS = ["#3a3028", "#2a3848", "#384030"] as const;

export function OysterBed() {
  const [active, setActive] = useState(false);
  const [phase,  setPhase]  = useState(0);
  const ref = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const io = new IntersectionObserver(
      ([e]) => { if (e?.isIntersecting) setActive(true); },
      { threshold: 0.12 }
    );
    if (ref.current) io.observe(ref.current);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!active) return;
    const id = setInterval(() => setPhase(p => p + 0.016), 16);
    return () => clearInterval(id);
  }, [active]);

  const waveOff = phase * 0.82;
  const heronBob = Math.sin(phase * 0.58) * 3;

  const wavePath = (y: number, off: number, amp: number): string =>
    Array.from({ length: 33 }, (_, i) => {
      const x  = i * (W / 32);
      const wy = y + Math.sin((i / 8) * Math.PI * 2 + waveOff + off) * amp;
      return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${wy.toFixed(1)}`;
    }).join(" ");

  return (
    <section style={{ background: "#8898a8", overflow: "hidden" }}>
      <svg
        ref={ref}
        viewBox={`0 0 ${W} ${H}`}
        style={{ width: "100%", display: "block" }}
        aria-label="New England oyster flat at low tide — workers raking, flat-bottomed dory, great blue heron, overcast October sky"
        role="img"
      >
        <defs>
          <linearGradient id="ob-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#788898" />
            <stop offset="45%"  stopColor="#9aaebb" />
            <stop offset="82%"  stopColor="#bcccd0" />
            <stop offset="100%" stopColor="#ccd8d4" />
          </linearGradient>
          <linearGradient id="ob-water" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#4a6070" />
            <stop offset="100%" stopColor="#5a7080" />
          </linearGradient>
          <linearGradient id="ob-flat" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#888470" />
            <stop offset="100%" stopColor="#9e9880" />
          </linearGradient>
          <radialGradient id="ob-pool" cx="50%" cy="38%" r="50%">
            <stop offset="0%"   stopColor="#6a7888" stopOpacity="0.75" />
            <stop offset="100%" stopColor="#5a6878" stopOpacity="0.42" />
          </radialGradient>
        </defs>

        {/* ── Sky ─────────────────────────────────────────────────────── */}
        <rect width={W} height={HORIZON_Y + 14} fill="url(#ob-sky)" />

        {/* Overcast cloud banks */}
        {Array.from({ length: 7 }, (_, i) => (
          <ellipse key={i}
            cx={110 + i * 192 + Math.sin(phase * 0.04 + i * 1.3) * 9}
            cy={55 + (i % 3) * 28}
            rx={148 + (i % 3) * 54}
            ry={20 + (i % 2) * 10}
            fill="#bcccd0" opacity={0.44 + (i % 3) * 0.07}
          />
        ))}
        {Array.from({ length: 5 }, (_, i) => (
          <ellipse key={i}
            cx={160 + i * 234 + Math.sin(phase * 0.035 + i * 0.88) * 7}
            cy={112 + (i % 2) * 18}
            rx={118 + (i % 4) * 38}
            ry={12 + (i % 3) * 5}
            fill="#c8d4d8" opacity={0.34 + (i % 2) * 0.07}
          />
        ))}

        {/* Pale horizon luminance */}
        <rect x="0" y={HORIZON_Y - 8} width={W} height={22} fill="#ccdcd8" opacity="0.32" />

        {/* ── Distant shore / pine silhouette ──────────────────────────── */}
        <path
          d={`M0,${HORIZON_Y + 2} Q240,${HORIZON_Y - 20} 480,${HORIZON_Y - 5} Q700,${HORIZON_Y + 7} 900,${HORIZON_Y - 14} Q1100,${HORIZON_Y - 24} 1280,${HORIZON_Y - 8} L1280,${HORIZON_Y + 14} L0,${HORIZON_Y + 14} Z`}
          fill="#4a5840" opacity="0.84"
        />
        {Array.from({ length: 24 }, (_, i) => {
          const tx = 22 + i * 54 + (i % 3) * 6;
          const th = 20 + (i % 4) * 9;
          return (
            <polygon key={i}
              points={`${tx},${HORIZON_Y - th - 2} ${tx - 11},${HORIZON_Y - 2} ${tx + 11},${HORIZON_Y - 2}`}
              fill={`hsl(148,${26 + (i % 3) * 5}%,${18 + (i % 4) * 4}%)`}
            />
          );
        })}
        {/* Weathered dock */}
        <rect x="930" y={HORIZON_Y - 5} width="82" height="6" fill="#5a4830" />
        {[938, 966, 995].map((dx, di) => (
          <line key={di} x1={dx} y1={HORIZON_Y - 5} x2={dx} y2={HORIZON_Y + 9}
            stroke="#4a3820" strokeWidth="3" />
        ))}

        {/* ── Water channel ────────────────────────────────────────────── */}
        <rect x="0" y={WATER_Y} width={W} height={FLAT_Y - WATER_Y} fill="url(#ob-water)" />
        {[0, 1.08, 2.16, 3.24].map((wo, wi) => (
          <path key={wi}
            d={wavePath(WATER_Y + 5 + wi * 8, wo, 1.4 + wi * 0.4)}
            fill="none" stroke="#7898a8" strokeWidth="0.8" opacity={0.48 - wi * 0.07}
          />
        ))}
        {/* Sky reflection strip */}
        <rect x="0" y={WATER_Y} width={W} height={Math.round((FLAT_Y - WATER_Y) * 0.38)}
          fill="#a0b8c0" opacity="0.2" />

        {/* ── Tidal flat ───────────────────────────────────────────────── */}
        <rect x="0" y={FLAT_Y} width={W} height={H - FLAT_Y} fill="url(#ob-flat)" />
        {/* Perspective ripple lines */}
        {Array.from({ length: 16 }, (_, i) => (
          <path key={i}
            d={`M${i * 84},${FLAT_Y + 10 + i * 15} Q${i * 84 + 42},${FLAT_Y + 6 + i * 15} ${i * 84 + 84},${FLAT_Y + 12 + i * 15}`}
            fill="none" stroke="#78745e" strokeWidth="0.9" opacity="0.28"
          />
        ))}
        {/* Dark mud edge at water line */}
        <rect x="0" y={FLAT_Y} width={W} height={14} fill="#686450" opacity="0.5" />

        {/* ── Tide pools ───────────────────────────────────────────────── */}
        {POOLS.map((p, pi) => {
          const ripR = 1 + Math.sin(phase * 2.1 + p.ph) * 0.07;
          return (
            <ellipse key={pi}
              cx={p.cx} cy={p.cy}
              rx={p.rx * ripR} ry={p.ry}
              fill="url(#ob-pool)"
              opacity={0.6 + Math.sin(phase * 1.4 + p.ph) * 0.12}
            />
          );
        })}

        {/* ── Oyster bed rows ──────────────────────────────────────────── */}
        {BEDS.map((bed, bi) => (
          <g key={bi}>
            <rect x={bed.x} y={bed.y} width={bed.w} height={bed.h}
              fill="#484030" rx="3" />
            {/* Shell texture — rows of small oyster bumps */}
            {Array.from({ length: Math.ceil(bed.h / 9) }, (_, ri) =>
              Array.from({ length: Math.ceil(bed.w / 12) }, (_, ci) => {
                const ox = bed.x + ci * 12 + (ri % 2) * 6 + 4;
                const oy = bed.y + ri * 9 + 5;
                if (ox > bed.x + bed.w - 5 || oy > bed.y + bed.h - 3) return null;
                return (
                  <ellipse key={`${ri}-${ci}`}
                    cx={ox} cy={oy} rx={3.5} ry={2.2}
                    fill="#5a5240" opacity="0.68"
                  />
                );
              })
            )}
            {/* Corner stakes */}
            {([
              [bed.x + 10,         bed.y + 5        ] as [number, number],
              [bed.x + bed.w - 10, bed.y + 5        ] as [number, number],
              [bed.x + 10,         bed.y + bed.h - 4] as [number, number],
              [bed.x + bed.w - 10, bed.y + bed.h - 4] as [number, number],
            ]).map(([sx, sy], si) => (
              <line key={si} x1={sx} y1={sy} x2={sx} y2={sy - 16}
                stroke="#7a6840" strokeWidth="2.5" />
            ))}
          </g>
        ))}

        {/* ── Scatter stakes / channel markers ─────────────────────────── */}
        {STAKES.map((s, si) => (
          <g key={si}>
            <line x1={s.x} y1={s.y} x2={s.x} y2={s.y - s.h}
              stroke="#7a6840" strokeWidth="2.6" />
            {si % 5 === 0 && (
              <rect x={s.x - 5} y={s.y - s.h - 5} width={10} height={6}
                fill="#c04020" rx="1" />
            )}
          </g>
        ))}

        {/* ── Workers with oyster rakes ─────────────────────────────────── */}
        {WORKERS.map((w, wi) => {
          const swingDeg  = Math.sin(phase * 1.82 + w.po) * 22;
          const lean      = Math.sin(phase * 1.82 + w.po) * 8;
          const rakeAngle = (54 + swingDeg) * Math.PI / 180;
          const rakeLen   = 90;
          const handX     = -4 + lean * 0.6;
          const handY     = -60;
          const rkx       = Math.cos(rakeAngle) * rakeLen;
          const rky       = Math.sin(rakeAngle) * rakeLen;
          const headX     = handX + rkx;
          const headY     = handY + rky;
          const perpCos   = -Math.sin(rakeAngle);
          const perpSin   =  Math.cos(rakeAngle);
          const coat      = COAT_COLORS[wi % 3] ?? "#3a3028";

          return (
            <g key={wi} transform={`translate(${w.x}, ${w.y})`}>
              {/* Rubber boots */}
              <rect x="-9" y="-12" width="8"  height="15" fill="#253028" rx="2" />
              <rect x="2"  y="-12" width="8"  height="15" fill="#253028" rx="2" />
              {/* Legs */}
              <line x1="-5" y1="-12" x2={-6 + lean * 0.3} y2="-46"
                stroke="#3a3228" strokeWidth="6" strokeLinecap="round" />
              <line x1="5"  y1="-12" x2={7  + lean * 0.3} y2="-46"
                stroke="#3a3228" strokeWidth="6" strokeLinecap="round" />
              {/* Torso (bent forward via lean) */}
              <line x1="0" y1="-46" x2={-14 + lean} y2="-82"
                stroke={coat} strokeWidth="18" strokeLinecap="round" />
              {/* Head */}
              <ellipse cx={-16 + lean} cy={-88} rx="10" ry="11" fill="#c8906a" />
              {/* Sou'wester hat */}
              <ellipse cx={-16 + lean} cy={-98}  rx="13" ry="4.5" fill="#c4a820" />
              <rect x={-24 + lean} y={-108} width="18" height="12"
                fill="#c4a820" rx="2" />
              {/* Arm to rake */}
              <line x1={-14 + lean} y1="-76" x2={handX} y2={handY}
                stroke="#d4916a" strokeWidth="5" strokeLinecap="round" />
              {/* Rake handle */}
              <line x1={handX} y1={handY} x2={headX} y2={headY}
                stroke="#8a6030" strokeWidth="4" strokeLinecap="round" />
              {/* Rake crossbar */}
              <line
                x1={headX + perpCos * 18} y1={headY + perpSin * 18}
                x2={headX - perpCos * 18} y2={headY - perpSin * 18}
                stroke="#6a4818" strokeWidth="3.5"
              />
              {/* Rake tines (5, along handle direction from crossbar) */}
              {[-14, -7, 0, 7, 14].map((off, ti) => (
                <line key={ti}
                  x1={headX + perpCos * off} y1={headY + perpSin * off}
                  x2={headX + perpCos * off + Math.cos(rakeAngle) * 13}
                  y2={headY + perpSin * off + Math.sin(rakeAngle) * 13}
                  stroke="#5a3810" strokeWidth="1.8" strokeLinecap="round"
                />
              ))}
            </g>
          );
        })}

        {/* ── Flat-bottomed dory ───────────────────────────────────────── */}
        <g transform={`translate(1048, ${NEAR_Y - 26})`}>
          <path d="M-90,0 Q-94,26 -72,28 L72,28 Q94,26 90,0 Z"
            fill="#5e7858" stroke="#4a5840" strokeWidth="2" />
          <path d="M-74,2 Q-78,20 -58,22 L58,22 Q78,20 74,2 Z" fill="#485840" />
          {/* Thwarts */}
          {[-52, -10, 30].map((tx, ti) => (
            <rect key={ti} x={tx} y="8" width="40" height="5" fill="#7a6840" rx="1" />
          ))}
          {/* Oars */}
          <line x1="-28" y1="8" x2="-18" y2="-56" stroke="#8a6830" strokeWidth="4" />
          <ellipse cx="-18" cy="-56" rx="11" ry="4.5" fill="#7a5820" />
          <line x1="24"  y1="8" x2="30"  y2="-50" stroke="#8a6830" strokeWidth="4" />
          <ellipse cx="30"  cy="-50" rx="9.5"  ry="4"   fill="#7a5820" />
          {/* Mooring rope */}
          <path d="M-90,14 Q-110,22 -122,26" fill="none" stroke="#8a7858" strokeWidth="2" />
          <line x1="-122" y1="4" x2="-122" y2="26" stroke="#8a7040" strokeWidth="3" />
          {/* Oyster haul in boat */}
          {[-44, -22, 0, 22, 44].map((ox, oi) => (
            <ellipse key={oi} cx={ox} cy="14" rx="8" ry="5" fill="#5a5038" opacity="0.8" />
          ))}
        </g>

        {/* ── Oyster cages / wire baskets ───────────────────────────────── */}
        {CAGES.map((cg, ci) => (
          <g key={ci} transform={`translate(${cg.x}, ${cg.y})`}>
            <rect x="0" y="-22" width="54" height="24"
              fill="#5c5a4a" stroke="#7a7858" strokeWidth="1.5" rx="3" />
            {[9, 18, 27, 36, 45].map((ox, gi) => (
              <line key={gi} x1={ox} y1="-22" x2={ox} y2="2"
                stroke="#7a7858" strokeWidth="1" opacity="0.68" />
            ))}
            {[-15, -7].map((oy, gi) => (
              <line key={gi} x1="0" y1={oy} x2="54" y2={oy}
                stroke="#7a7858" strokeWidth="1" opacity="0.68" />
            ))}
            {[8, 18, 28, 38, 48, 13, 23, 33, 43].map((ox, oi) => (
              <ellipse key={oi}
                cx={ox} cy={-12 + (oi % 2) * 5}
                rx={3.5 + (oi % 3)} ry={2.2 + (oi % 2)}
                fill="#524e38" opacity="0.85"
              />
            ))}
            <path d="M8,-22 Q27,-34 46,-22" fill="none" stroke="#8a8068" strokeWidth="2.5" />
          </g>
        ))}

        {/* ── Great blue heron in shallows ─────────────────────────────── */}
        <g transform={`translate(488, ${WATER_Y + 10})`}>
          <line x1="-4" y1="0" x2="-5" y2="40" stroke="#7a8890" strokeWidth="2.5" />
          <line x1="4"  y1="0" x2="6"  y2="40" stroke="#7a8890" strokeWidth="2.5" />
          <path d="M-9,40 Q-4,44 2,40"  fill="none" stroke="#6a7880" strokeWidth="2" />
          <path d="M2,40  Q8,44 12,40"  fill="none" stroke="#6a7880" strokeWidth="2" />
          <ellipse cx="0" cy="-20" rx="12" ry="20" fill="#7a8898" />
          {/* Neck curve animates gently */}
          <path d={`M0,-40 Q${Math.round(heronBob * 1.2)},${-55} ${Math.round(heronBob * 0.8)},-65`}
            fill="none" stroke="#8898b0" strokeWidth="9" strokeLinecap="round" />
          <ellipse cx={Math.round(heronBob * 0.8)} cy={-68} rx="8" ry="7" fill="#8898b0" />
          <path d={`M${Math.round(heronBob * 0.8)},-74 L${Math.round(heronBob * 0.8) + 24},-68`}
            fill="none" stroke="#c8b050" strokeWidth="3" strokeLinecap="round" />
          <line
            x1={Math.round(heronBob * 0.8) - 6}
            y1="-68"
            x2={Math.round(heronBob * 0.8) + 4}
            y2="-66"
            stroke="#181818" strokeWidth="1.5"
          />
          {/* Plume feathers */}
          <path d={`M-10,-30 Q-18,-48 -8,-42`}
            fill="none" stroke="#606878" strokeWidth="2" opacity="0.7" />
          <path d={`M-10,-32 Q-22,-52 -12,-46`}
            fill="none" stroke="#606878" strokeWidth="1.5" opacity="0.55" />
        </g>

        {/* ── Seabirds ─────────────────────────────────────────────────── */}
        {BIRDS.map((b, bi) => {
          const bx  = b.ax + Math.cos(phase * b.spd + b.ph) * b.r;
          const by2 = b.ay + Math.sin(phase * b.spd + b.ph) * b.r * 0.36;
          const wf  = Math.sin(phase * 5.8 + b.ph) * 7;
          return (
            <g key={bi} transform={`translate(${bx}, ${by2})`} opacity="0.7">
              <path d={`M-12,${-wf} Q0,-4 12,${-wf}`}
                fill="none" stroke="#b8c8d0" strokeWidth="1.8" strokeLinecap="round" />
            </g>
          );
        })}

        {/* Caption */}
        <text x={W / 2} y={H - 10}
          textAnchor="middle" fontSize="12"
          fill="#484038" fontFamily="Georgia, serif" opacity="0.65" letterSpacing="0.5">
          New England Oyster Flat · Low Tide · Cape Ann, October
        </text>

        {/* Reveal overlay */}
        <rect width={W} height={H} fill="#8898a8"
          style={{ opacity: active ? 0 : 1, transition: "opacity 1.2s ease", pointerEvents: "none" }}
        />
      </svg>
    </section>
  );
}
