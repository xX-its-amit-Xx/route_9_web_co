"use client";
import { useEffect, useRef, useState } from "react";

const W = 1280, H = 520;
const GY = H - 72;

// ── Clouds ──────────────────────────────────────────────────────────────────
const CLOUDS: [number, number, number][] = [
  [115, 52, 78], [275, 36, 58], [598, 68, 88], [895, 42, 68], [1148, 58, 72],
];

// ── Trees ────────────────────────────────────────────────────────────────────
const TREES = [
  { x: 72,   h: 184, r: 90,  fill: "#266226", light: "#5ab83a" },
  { x: 158,  h: 156, r: 76,  fill: "#3a7a1a", light: "#6acf30" },
  { x: 368,  h: 172, r: 86,  fill: "#1e5c1e", light: "#4aaa28" },
  { x: 510,  h: 162, r: 80,  fill: "#266226", light: "#5ab83a" },
  { x: 1096, h: 166, r: 82,  fill: "#3a7a1a", light: "#6acf30" },
  { x: 1192, h: 152, r: 72,  fill: "#1e5c1e", light: "#4aaa28" },
  { x: 1252, h: 178, r: 88,  fill: "#266226", light: "#5ab83a" },
] as const;

// ── Bandstand ─────────────────────────────────────────────────────────────────
const BS_CX = 240, BS_Y = GY - 148, BS_W = 210, BS_H = 148;

// ── Tables ────────────────────────────────────────────────────────────────────
const TABLES = [
  { x: 676, w: 112, cloth: "#c81818" },
  { x: 820, w: 96,  cloth: "#1a3e8a" },
  { x: 952, w: 108, cloth: "#c81818" },
  { x: 1082, w: 92, cloth: "#1a3e8a" },
] as const;

// ── Ice cream makers ──────────────────────────────────────────────────────────
const MAKERS = [
  { x: 726,  wood: "#6b3a1f" },
  { x: 862,  wood: "#4a2810" },
  { x: 998,  wood: "#6b3a1f" },
] as const;

// ── Parasols ──────────────────────────────────────────────────────────────────
const PARASOLS = [
  { cx: 572,  cy: GY - 162, r: 52, fill: "#f4a0b5", stroke: "#d87898", sp: 0.00 },
  { cx: 756,  cy: GY - 168, r: 46, fill: "#fffff0", stroke: "#c8c8b0", sp: 0.72 },
  { cx: 894,  cy: GY - 154, r: 50, fill: "#f9df7a", stroke: "#d4b840", sp: 1.44 },
  { cx: 1058, cy: GY - 162, r: 48, fill: "#a8d8a8", stroke: "#78b878", sp: 2.16 },
  { cx: 438,  cy: GY - 148, r: 44, fill: "#f4a0b5", stroke: "#d87898", sp: 2.88 },
  { cx: 1185, cy: GY - 158, r: 50, fill: "#fffff0", stroke: "#c8c8b0", sp: 3.60 },
] as const;

// ── Blanket picnic groups ─────────────────────────────────────────────────────
const BLANKETS = [
  { x: 292,  w: 148, fill: "#c81818", people: 3 },
  { x: 455,  w: 120, fill: "#1a3e8a", people: 2 },
  { x: 1118, w: 136, fill: "#c81818", people: 3 },
] as const;

// ── Musicians on bandstand ────────────────────────────────────────────────────
const MUSICIANS = [
  { dx: -76, inst: "tuba"     },
  { dx: -36, inst: "cornet"   },
  { dx:   0, inst: "drum"     },
  { dx:  36, inst: "trombone" },
  { dx:  76, inst: "cornet"   },
] as const;

const BUNTING = ["#c81818", "#fffff0", "#1a3e8a"] as const;
const SHIRT_COLORS  = ["#a8305a", "#2a5e8c", "#5a8a2a"] as const;
const HAT_COLORS    = ["#f4d0a0", "#c8e0f0", "#f4a0b5"] as const;
const SCOOP_COLORS  = ["#f48080", "#f8e080", "#90c890"] as const;
const CLOTH_STRIPES = ["#d42020", "#1a3e8a"] as const;

// ── Component ─────────────────────────────────────────────────────────────────
export function IceCreamSocial() {
  const [active, setActive] = useState(false);
  const [phase, setPhase] = useState(0);
  const ref = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const io = new IntersectionObserver(([e]) => { if (e?.isIntersecting) setActive(true); }, { threshold: 0.12 });
    if (ref.current) io.observe(ref.current);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!active) return;
    let _raf: number = 0, _last = 0;
    const _tick = (ts: number) => { if (ts - _last >= 33) { setPhase(p => p + 0.033); _last = ts; } _raf = requestAnimationFrame(_tick); };
    _raf = requestAnimationFrame(_tick);
    return () => cancelAnimationFrame(_raf);
  }, [active]);

  const crankAngle  = (phase * 200) % 360;
  const musicBob    = Math.sin(phase * 3.8) * 2.5;
  const treeWave    = Math.sin(phase * 1.1) * 1.8;
  const bannerSway  = Math.sin(phase * 0.55) * 0.6;
  const runCycle    = Math.sin(phase * 4.2);

  return (
    <section style={{ background: "linear-gradient(to bottom, #e4f4fc, #eef8e4)", overflow: "hidden" }}>
      <style>{`
        @keyframes ics-dapple { 0%,100%{opacity:.14} 50%{opacity:.22} }
      `}</style>
      <svg
        ref={ref}
        viewBox={`0 0 ${W} ${H}`}
        style={{ width: "100%", display: "block" }}
        aria-label="Shrewsbury Town Common Ice Cream Social, circa 1912"
        role="img"
      >
        <defs>
          <linearGradient id="ics-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#7ec8e8" />
            <stop offset="55%"  stopColor="#c4e8f8" />
            <stop offset="100%" stopColor="#d4f0c0" />
          </linearGradient>
          <radialGradient id="ics-sun" cx="78%" cy="14%" r="28%">
            <stop offset="0%"   stopColor="#fff6a0" stopOpacity="0.65" />
            <stop offset="100%" stopColor="#fff6a0" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="ics-grass" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#48982a" />
            <stop offset="100%" stopColor="#2c680e" />
          </linearGradient>
          <filter id="ics-drop">
            <feDropShadow dx="2" dy="3" stdDeviation="3" floodOpacity="0.22" />
          </filter>
        </defs>

        {/* ── Sky ──────────────────────────────────────────────────────── */}
        <rect width={W} height={H} fill="url(#ics-sky)" />
        <rect width={W} height={H} fill="url(#ics-sun)" />

        {/* ── Clouds ───────────────────────────────────────────────────── */}
        {CLOUDS.map(([cx, cy, r], i) => (
          <g key={i} transform={`translate(${Math.sin(phase * 0.07 + i * 1.2) * 5}, 0)`} opacity="0.92">
            <ellipse cx={cx} cy={cy} rx={r} ry={r * 0.44} fill="#fff" />
            <ellipse cx={cx - r * 0.3} cy={cy + 5} rx={r * 0.6} ry={r * 0.37} fill="#f6f6f6" />
            <ellipse cx={cx + r * 0.34} cy={cy + 4} rx={r * 0.54} ry={r * 0.34} fill="#efefef" />
          </g>
        ))}

        {/* ── Distant hills ────────────────────────────────────────────── */}
        <path
          d={`M0,${GY - 82} Q200,${GY - 134} 400,${GY - 92} Q600,${GY - 52} 800,${GY - 114} Q1000,${GY - 154} 1280,${GY - 82} L1280,${H} L0,${H} Z`}
          fill="#5a9a30" opacity="0.38"
        />

        {/* ── Ground ───────────────────────────────────────────────────── */}
        <rect x="0" y={GY} width={W} height={H - GY} fill="url(#ics-grass)" />
        {Array.from({ length: 20 }, (_, i) => (
          <ellipse key={i}
            cx={60 + i * 62 + Math.sin(i * 2.3) * 18}
            cy={GY + 12 + (i % 3) * 10}
            rx={22 + (i % 4) * 7}
            ry={5 + (i % 3) * 3}
            fill="#265810"
            style={{ animation: "ics-dapple 3s ease infinite", animationDelay: `${i * 0.18}s` }}
          />
        ))}

        {/* ── Trees ────────────────────────────────────────────────────── */}
        {TREES.map((t, i) => {
          const sw = Math.sin(phase * 1.1 + i * 0.55) * 1.6;
          const tw = treeWave;
          return (
            <g key={i} transform={`translate(${t.x}, 0)`}>
              <rect x="-9" y={GY - t.h + 38} width="18" height={Math.round(t.h * 0.44)}
                fill="#5a3a1a" rx="4" />
              <ellipse cx="0" cy={GY - t.h + tw}
                rx={t.r} ry={t.r * 0.72}
                fill={t.fill} transform={`rotate(${sw})`} />
              <ellipse cx={Math.round(-t.r * 0.28)} cy={GY - t.h + 24 + tw}
                rx={Math.round(t.r * 0.68)} ry={Math.round(t.r * 0.54)}
                fill={t.fill} opacity="0.82" />
              <ellipse cx={Math.round(t.r * 0.26)} cy={GY - t.h + 20 + tw}
                rx={Math.round(t.r * 0.62)} ry={Math.round(t.r * 0.5)}
                fill={t.fill} opacity="0.78" />
              <ellipse cx={Math.round(-t.r * 0.22)} cy={GY - t.h - 6 + tw}
                rx={Math.round(t.r * 0.34)} ry={Math.round(t.r * 0.27)}
                fill={t.light} opacity="0.48" />
            </g>
          );
        })}

        {/* ── Bandstand ────────────────────────────────────────────────── */}
        <g transform={`translate(${BS_CX - BS_W / 2}, 0)`}>
          {/* Platform */}
          <rect x="0" y={BS_Y + BS_H - 20} width={BS_W} height={20}
            fill="#c8a060" rx="3" filter="url(#ics-drop)" />
          <rect x="22" y={BS_Y + BS_H - 8} width={BS_W - 44} height={14}
            fill="#d4b070" rx="2" />
          {/* Back wall */}
          <rect x="12" y={BS_Y + 40} width={BS_W - 24} height={BS_H - 60}
            fill="#f0e0c0" stroke="#c8a060" strokeWidth="2" />
          {/* Roof */}
          <polygon
            points={`-12,${BS_Y + 42} ${BS_W / 2},${BS_Y - 12} ${BS_W + 12},${BS_Y + 42}`}
            fill="#8B1a1a"
          />
          <polygon
            points={`2,${BS_Y + 42} ${BS_W / 2},${BS_Y - 2} ${BS_W - 2},${BS_Y + 42}`}
            fill="#a82020"
          />
          {/* Roof ridge cap */}
          <line x1={BS_W / 2} y1={BS_Y - 12} x2={BS_W / 2} y2={BS_Y - 18}
            stroke="#c8a060" strokeWidth="3" />
          <circle cx={BS_W / 2} cy={BS_Y - 20} r="4" fill="#d4a820" />
          {/* Columns */}
          {[0, 1, 2, 3].map(ci => (
            <rect key={ci}
              x={18 + ci * Math.round((BS_W - 36) / 3) - 5}
              y={BS_Y + 40}
              width="10"
              height={BS_H - 60}
              fill="#e8d8b0" rx="5"
            />
          ))}
          {/* Bunting flags */}
          {Array.from({ length: 11 }, (_, bi) => {
            const bx1 = bi * (BS_W / 10);
            const bx2 = (bi + 1) * (BS_W / 10);
            const bmx = (bx1 + bx2) / 2;
            const bdy = Math.sin(phase * 3.2 + bi * 0.85) * 3;
            const bColor = BUNTING[bi % 3] ?? "#c81818";
            return (
              <g key={bi}>
                <line x1={bx1} y1={BS_Y + 42} x2={bx2} y2={BS_Y + 42}
                  stroke="#777" strokeWidth="0.8" />
                <polygon
                  points={`${bmx - 7},${BS_Y + 42 + bdy} ${bmx + 7},${BS_Y + 42 + bdy} ${bmx},${BS_Y + 56 + bdy}`}
                  fill={bColor}
                />
              </g>
            );
          })}
          {/* Sign */}
          <rect x="26" y={BS_Y + 48} width={BS_W - 52} height="19"
            fill="#1a2a6a" rx="3" />
          <text x={BS_W / 2} y={BS_Y + 61}
            textAnchor="middle" fontSize="9.5" fill="#f0d060"
            fontFamily="Georgia, serif" letterSpacing="1.8">
            SHREWSBURY BAND
          </text>
          {/* Musicians */}
          {MUSICIANS.map((m, mi) => {
            const mx = BS_W / 2 + m.dx;
            const my = BS_Y + BS_H - 24 + Math.sin(phase * 3.8 + mi * 0.65) * 2;
            return (
              <g key={mi} transform={`translate(${mx}, ${my})`}>
                <rect x="-7" y="-38" width="14" height="26" fill="#1a2a6a" rx="3" />
                <ellipse cx="0" cy="-44" rx="8" ry="9" fill="#d4916a" />
                <rect x="-8" y="-56" width="16" height="10" fill="#1a2a6a" rx="2" />
                <rect x="-10" y="-48" width="20" height="3" fill="#1a2a6a" />
                {m.inst === "drum" && (
                  <ellipse cx="0" cy="-24" rx="10" ry="6"
                    fill="#8B4513" stroke="#c8a060" strokeWidth="1.5" />
                )}
                {(m.inst === "cornet" || m.inst === "trombone") && (
                  <path
                    d={`M0,-30 Q${m.inst === "trombone" ? 20 : 13},-20 ${m.inst === "trombone" ? 24 : 16},-32`}
                    fill="none" stroke="#c8a020" strokeWidth="3.5" strokeLinecap="round"
                  />
                )}
                {m.inst === "tuba" && (
                  <ellipse cx="10" cy="-26" rx="10" ry="8"
                    fill="none" stroke="#8B6914" strokeWidth="3" />
                )}
              </g>
            );
          })}
        </g>

        {/* ── Tables with checkered cloth ───────────────────────────────── */}
        {TABLES.map((t, ti) => {
          const ty = GY - 54;
          const stripeColor = CLOTH_STRIPES[ti % 2] ?? "#c81818";
          return (
            <g key={ti}>
              {/* Cloth base */}
              <rect x={t.x} y={ty} width={t.w} height={30}
                fill={t.cloth} rx="2" filter="url(#ics-drop)" />
              {/* Checker white squares */}
              {Array.from({ length: Math.ceil(t.w / 14) * 2 }, (_, k) => {
                const xi = k % Math.ceil(t.w / 14);
                const yi = Math.floor(k / Math.ceil(t.w / 14));
                if ((xi + yi) % 2 !== 0) return null;
                return (
                  <rect key={k}
                    x={t.x + xi * 14}
                    y={ty + yi * 14}
                    width={7} height={7}
                    fill="white" opacity={0.3}
                  />
                );
              })}
              {/* Cloth overhang */}
              <rect x={t.x - 5} y={ty + 28} width={t.w + 10} height={9}
                fill={stripeColor} opacity="0.75" rx="1" />
              {/* Legs */}
              <line x1={t.x + 12} y1={ty + 37} x2={t.x + 8} y2={GY}
                stroke="#5a3a1a" strokeWidth="3" />
              <line x1={t.x + t.w - 12} y1={ty + 37} x2={t.x + t.w - 8} y2={GY}
                stroke="#5a3a1a" strokeWidth="3" />
              {/* Ice cream bowls */}
              {[0.22, 0.5, 0.78].map((frac, bi) => {
                const bx = t.x + Math.round(t.w * frac);
                const scoopColor = SCOOP_COLORS[bi % 3] ?? "#f48080";
                return (
                  <g key={bi} transform={`translate(${bx}, ${ty + 4})`}>
                    <path d="M-8,0 L8,0 L5,13 Q0,17 -5,13 Z"
                      fill="#f0e0c0" stroke="#c8a868" strokeWidth="1" />
                    <ellipse cx="0" cy="-1" rx="8" ry="4" fill={scoopColor} />
                    <ellipse cx="-2" cy="-3" rx="5" ry="3"
                      fill={scoopColor} opacity="0.7" />
                  </g>
                );
              })}
            </g>
          );
        })}

        {/* ── Ice cream makers with spinning cranks ─────────────────────── */}
        {MAKERS.map((mk, mi) => {
          const my = GY - 50;
          const caRad = ((crankAngle + mi * 45) * Math.PI) / 180;
          const pivX = mk.x + 24;
          const pivY = my - 66;
          const handleX = pivX + Math.cos(caRad) * 22;
          const handleY = pivY + Math.sin(caRad) * 13;
          return (
            <g key={mi}>
              {/* Barrel */}
              <rect x={mk.x} y={my - 54} width={48} height={54}
                fill={mk.wood} rx="6" filter="url(#ics-drop)" />
              {/* Barrel staves (vertical lines) */}
              {[-12, 0, 12].map(dx => (
                <line key={dx}
                  x1={mk.x + 24 + dx} y1={my - 54}
                  x2={mk.x + 24 + dx} y2={my}
                  stroke="#3a1808" strokeWidth="1.2" opacity="0.5"
                />
              ))}
              {/* Metal hoops */}
              {[0.18, 0.52, 0.84].map((f, hi) => (
                <rect key={hi}
                  x={mk.x - 2} y={my - 54 + Math.round(f * 54)}
                  width={52} height={5}
                  fill="#c8a060" rx="2"
                />
              ))}
              {/* Lid */}
              <ellipse cx={mk.x + 24} cy={my - 54} rx="26" ry="6"
                fill="#d4b880" stroke="#a08040" strokeWidth="1.5" />
              {/* Dasher shaft */}
              <rect x={mk.x + 22} y={my - 74} width={4} height={24}
                fill="#a08040" rx="1" />
              {/* Crank pivot */}
              <circle cx={pivX} cy={pivY} r="5" fill="#808080" />
              {/* Crank arm */}
              <line x1={pivX} y1={pivY} x2={handleX} y2={handleY}
                stroke="#c8a060" strokeWidth="5" strokeLinecap="round" />
              {/* Crank handle */}
              <circle cx={handleX} cy={handleY} r="5.5" fill="#5a3a1a" />
              {/* Person cranking */}
              <g transform={`translate(${mk.x + 62}, ${my - 4})`}>
                <rect x="-8" y="-42" width="16" height="28" fill="#4a6a2a" rx="3" />
                <ellipse cx="0" cy="-48" rx="9" ry="10" fill="#d4916a" />
                {/* Straw hat */}
                <ellipse cx="0" cy="-59" rx="13" ry="4" fill="#d4c060" />
                <rect x="-7" y="-68" width="14" height="11" fill="#d4c060" rx="2" />
                <rect x="-6" y="-59" width="12" height="2" fill="#a09020" />
                {/* Suspenders */}
                <line x1="-3" y1="-42" x2="-3" y2="-14" stroke="#8B3a10" strokeWidth="2" />
                <line x1="3" y1="-42" x2="3" y2="-14" stroke="#8B3a10" strokeWidth="2" />
                {/* Arm cranking */}
                <line x1="-8" y1="-36"
                  x2={-8 - Math.cos(caRad) * 13} y2={-36 + Math.sin(caRad) * 8}
                  stroke="#d4916a" strokeWidth="4.5" strokeLinecap="round" />
              </g>
              {/* Steam wisps from barrel */}
              {[0, 1, 2].map(si => {
                const age = ((phase * 0.72 + si * 0.76 + mi * 0.32) % 2.28);
                const ops = age < 0.28 ? (age / 0.28) * 0.45 :
                            age > 1.72 ? ((2.28 - age) / 0.56) * 0.45 : 0.45;
                const sy = my - 58 - age * 16;
                const sxv = mk.x + 14 + si * 9 + Math.sin(age * 2.8 + si) * 4;
                return (
                  <ellipse key={si}
                    cx={sxv} cy={sy}
                    rx={3 + age * 3} ry={2 + age * 2}
                    fill="white" opacity={ops * 0.65}
                  />
                );
              })}
            </g>
          );
        })}

        {/* ── Parasols ──────────────────────────────────────────────────── */}
        {PARASOLS.map((p, pi) => {
          const sway = Math.sin(phase * 1.35 + p.sp) * 5.5;
          const pivX = p.cx;
          const pivY = p.cy + Math.round(p.r * 1.55);
          return (
            <g key={pi} transform={`rotate(${sway}, ${pivX}, ${pivY})`}>
              {/* Handle */}
              <line x1={p.cx} y1={p.cy} x2={p.cx + 4} y2={pivY}
                stroke="#8B6914" strokeWidth="2.5" />
              <circle cx={p.cx + 4} cy={pivY + 4} r="4" fill="#6a4a0a" />
              {/* Canopy ribs */}
              {Array.from({ length: 8 }, (_, ri) => {
                const ang = (ri / 8) * Math.PI * 2;
                return (
                  <line key={ri}
                    x1={p.cx} y1={p.cy}
                    x2={p.cx + Math.round(Math.cos(ang) * p.r)}
                    y2={p.cy + Math.round(Math.sin(ang) * p.r * 0.34)}
                    stroke={p.stroke} strokeWidth="0.9" opacity="0.6"
                  />
                );
              })}
              {/* Canopy main */}
              <ellipse cx={p.cx} cy={p.cy} rx={p.r} ry={Math.round(p.r * 0.34)}
                fill={p.fill} stroke={p.stroke} strokeWidth="1.5" opacity="0.92" />
              {/* Scalloped edge */}
              {Array.from({ length: 8 }, (_, si) => {
                const a1 = (si / 8) * Math.PI * 2;
                const a2 = ((si + 1) / 8) * Math.PI * 2;
                const amx = (a1 + a2) / 2;
                return (
                  <circle key={si}
                    cx={p.cx + Math.round(Math.cos(amx) * (p.r + 6))}
                    cy={p.cy + Math.round(Math.sin(amx) * (p.r * 0.34 + 4))}
                    r="5"
                    fill={p.fill} stroke={p.stroke} strokeWidth="1"
                  />
                );
              })}
              {/* Center cap */}
              <circle cx={p.cx} cy={p.cy} r="5" fill={p.stroke} />
            </g>
          );
        })}

        {/* ── Blanket groups ────────────────────────────────────────────── */}
        {BLANKETS.map((b, bi) => (
          <g key={bi}>
            <rect x={b.x} y={GY - 9} width={b.w} height={13}
              fill={b.fill} opacity="0.87" rx="3" />
            {/* White check overlay */}
            {Array.from({ length: Math.ceil(b.w / 20) }, (_, xi) => (
              <rect key={xi}
                x={b.x + xi * 20}
                y={xi % 2 === 0 ? GY - 9 : GY - 2}
                width={10} height={7}
                fill="white" opacity="0.28"
              />
            ))}
            {/* People sitting */}
            {Array.from({ length: b.people }, (_, pi) => {
              const px = b.x + 22 + pi * Math.round(b.w / (b.people + 0.5));
              const py = GY - 32;
              const headBob = Math.sin(phase * 1.7 + bi * 1.3 + pi * 0.95) * 1.5;
              const shirtC = SHIRT_COLORS[pi % 3] ?? "#a8305a";
              const hatC   = HAT_COLORS[(bi + pi) % 3] ?? "#f4d0a0";
              return (
                <g key={pi} transform={`translate(${px}, ${py + headBob})`}>
                  <rect x="-7" y="-22" width="14" height="18" fill={shirtC} rx="4" />
                  <ellipse cx="0" cy="-28" rx="8" ry="9" fill="#d4916a" />
                  <ellipse cx="0" cy="-37" rx="10" ry="3.5" fill={hatC} />
                  <rect x="-7" y="-45" width="14" height="10" fill={hatC} rx="2" />
                </g>
              );
            })}
          </g>
        ))}

        {/* ── Running children ──────────────────────────────────────────── */}
        {[0, 1].map(di => {
          const dir = di === 0 ? 1 : -1;
          const rx2 = 574 + di * 362 + Math.sin(phase * 1.6 + di) * 28;
          const ry2 = GY - 44;
          const legSwing = runCycle * dir;
          return (
            <g key={di} transform={`translate(${rx2}, ${ry2}) scale(${dir}, 1)`}>
              <rect x="-6" y="-30" width="12" height="20" fill="#d42020" rx="3" />
              <ellipse cx="0" cy="-36" rx="7" ry="8" fill="#d4916a" />
              {/* Hair / hat */}
              <ellipse cx="0" cy="-43" rx="8" ry="5" fill="#5a3010" />
              {/* Running legs */}
              <line x1="-4" y1="-10"
                x2={-4 + legSwing * 11} y2={2}
                stroke="#1a3a8a" strokeWidth="3.5" strokeLinecap="round" />
              <line x1="4" y1="-10"
                x2={4 - legSwing * 11} y2={2}
                stroke="#1a3a8a" strokeWidth="3.5" strokeLinecap="round" />
              {/* Arms */}
              <line x1="-6" y1="-24"
                x2={-6 - legSwing * 9} y2={-16}
                stroke="#d4916a" strokeWidth="3" strokeLinecap="round" />
              <line x1="6" y1="-24"
                x2={6 + legSwing * 9} y2={-16}
                stroke="#d4916a" strokeWidth="3" strokeLinecap="round" />
              {/* Ice cream cone for child 0 */}
              {di === 0 && (
                <g transform="translate(-13, -32)">
                  <polygon points="-5,0 5,0 0,15" fill="#c8a050" />
                  <circle cx="0" cy="-5" r="6.5" fill="#f48080" />
                  <circle cx="-2" cy="-8" r="3" fill="#f8a0a0" opacity="0.6" />
                </g>
              )}
            </g>
          );
        })}

        {/* ── SHREWSBURY SUMMER SOCIAL banner ──────────────────────────── */}
        <g transform={`translate(${W / 2}, 152) rotate(${bannerSway})`}>
          {/* Rope ties */}
          <line x1="-200" y1="-24" x2="-224" y2="-58" stroke="#8B6914" strokeWidth="2.5" />
          <line x1="200"  y1="-24" x2="224"  y2="-58" stroke="#8B6914" strokeWidth="2.5" />
          <circle cx="-224" cy="-58" r="4" fill="#6a4a0a" />
          <circle cx="224"  cy="-58" r="4" fill="#6a4a0a" />
          {/* Banner body */}
          <rect x="-200" y="-24" width="400" height="50"
            fill="#1a2a6a" rx="4" filter="url(#ics-drop)" />
          {/* Decorative gold border */}
          <rect x="-196" y="-20" width="392" height="42"
            fill="none" stroke="#c8a020" strokeWidth="1.5" rx="2" />
          <text x="0" y="-2" textAnchor="middle"
            fontSize="14" fill="#f0d060"
            fontFamily="Georgia, serif" letterSpacing="2.5" fontWeight="bold">
            SHREWSBURY SUMMER SOCIAL
          </text>
          <text x="0" y="14" textAnchor="middle"
            fontSize="9.5" fill="#c0c8f0"
            fontFamily="Georgia, serif" letterSpacing="2">
            JULY 4TH, 1912 · TOWN COMMON
          </text>
        </g>

        {/* ── Caption ───────────────────────────────────────────────────── */}
        <text x={W / 2} y={H - 10}
          textAnchor="middle" fontSize="12"
          fill="#2a5a10" fontFamily="Georgia, serif" opacity="0.65" letterSpacing="0.5">
          Shrewsbury Town Common · Ice Cream Social · Summer 1912
        </text>

        {/* ── Entrance reveal ───────────────────────────────────────────── */}
        <rect width={W} height={H} fill="white"
          style={{ opacity: active ? 0 : 1, transition: "opacity 1.2s ease", pointerEvents: "none" }}
        />
      </svg>
    </section>
  );
}
