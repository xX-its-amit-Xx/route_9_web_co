"use client";
import { useEffect, useRef, useState } from "react";

const W = 1280, H = 520;
const CEIL_Y  = 58;
const FLOOR_Y = H - 50;

// Overhead line shaft
const SHAFT_Y  = CEIL_Y + 88;
const SHAFT_X1 = 58;
const SHAFT_X2 = 1210;
const SHAFT_R  = 12;

// Ceiling beam positions
const BEAM_XS = [95, 275, 460, 640, 820, 1000, 1160] as const;

// Pulleys aligned to frame centres
const PULLEYS = [
  { x: 268,  r: 22 },
  { x: 526,  r: 20 },
  { x: 779,  r: 18 },
  { x: 1014, r: 16 },
] as const;

// Spinning frames (x, w, h, bobbin columns, gear ratio)
const FRAMES = [
  { x: 190,  w: 155, h: 210, nc: 10, gr: 1.00 },
  { x: 460,  w: 132, h: 178, nc: 9,  gr: 0.86 },
  { x: 722,  w: 114, h: 150, nc: 8,  gr: 0.72 },
  { x: 965,  w: 98,  h: 128, nc: 7,  gr: 0.60 },
] as const;

// Dust motes (golden-angle scatter, biased toward window-light zone)
const MOTES = Array.from({ length: 44 }, (_, i) => {
  const a = i * 137.508 * Math.PI / 180;
  return {
    x:   58  + ((Math.cos(a) + 1) / 2) * 640,
    y:   CEIL_Y + 70 + ((Math.sin(a) + 1) / 2) * 200,
    r:   1.0  + (i % 3) * 0.55,
    ph:  i * 0.44,
    spd: 0.28 + (i % 4) * 0.10,
  };
});

// Left-wall windows
const LW_WIN = [-1, 0, 1] as const;
const LW_W = 72, LW_H_FRAC = 0.65;

// Right-wall windows (receding perspective)
const RW_WINS = [1048, 1138, 1218] as const;
const RW_W = 68;

// Mill workers
const WORKERS = [
  { x: 375,  reach:  1 },
  { x: 648,  reach: -1 },
  { x: 945,  reach:  1 },
] as const;

const DRESS_COLORS = ["#6a4a8a", "#2a4a7a", "#4a6a2a"] as const;

export function WoolMill() {
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

  const shaftAngle = phase * 6.28; // ~1 rev/s

  // Helix marker on shaft showing rotation
  const helixD = Array.from({ length: 33 }, (_, i) => {
    const t = i / 32;
    const x = SHAFT_X1 + t * (SHAFT_X2 - SHAFT_X1);
    const y = SHAFT_Y + Math.sin(t * 20 * Math.PI + shaftAngle) * (SHAFT_R - 4);
    return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(" ");

  return (
    <section style={{ background: "#120a04", overflow: "hidden" }}>
      <svg
        ref={ref}
        viewBox={`0 0 ${W} ${H}`}
        style={{ width: "100%", display: "block" }}
        aria-label="19th-century New England wool mill — spinning frames, overhead line shafting, mill girls, and afternoon light"
        role="img"
      >
        <defs>
          <linearGradient id="wm-bg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#1c0e06" />
            <stop offset="50%"  stopColor="#2e1a0a" />
            <stop offset="100%" stopColor="#3c2012" />
          </linearGradient>
          <radialGradient id="wm-winlight" cx="15%" cy="48%" r="42%">
            <stop offset="0%"   stopColor="#fff0a0" stopOpacity="0.32" />
            <stop offset="100%" stopColor="#fff0a0" stopOpacity="0"    />
          </radialGradient>
          <radialGradient id="wm-farlight" cx="84%" cy="42%" r="30%">
            <stop offset="0%"   stopColor="#c8e8f8" stopOpacity="0.28" />
            <stop offset="100%" stopColor="#c8e8f8" stopOpacity="0"    />
          </radialGradient>
          <linearGradient id="wm-floor" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#5e3a1a" />
            <stop offset="100%" stopColor="#3a2010" />
          </linearGradient>
          <linearGradient id="wm-shaft" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#999" />
            <stop offset="40%"  stopColor="#ccc" />
            <stop offset="100%" stopColor="#555" />
          </linearGradient>
          <filter id="wm-glow">
            <feGaussianBlur stdDeviation="5" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {/* ── Room background ─────────────────────────────────────────── */}
        <rect width={W} height={H} fill="url(#wm-bg)" />
        <rect width={W} height={H} fill="url(#wm-winlight)" />
        <rect width={W} height={H} fill="url(#wm-farlight)" />

        {/* ── Ceiling ──────────────────────────────────────────────────── */}
        <rect x="0" y="0" width={W} height={CEIL_Y + 14} fill="#120804" />
        {BEAM_XS.map((bx, bi) => (
          <g key={bi}>
            <rect x={bx - 14} y="0" width="28" height={CEIL_Y + 10} fill="#2a1408" />
            <rect x={bx - 11} y="0" width="22" height={CEIL_Y + 10} fill="#361a0c" />
            <path d={`M${bx - 22},${CEIL_Y + 10} L${bx - 14},${CEIL_Y + 48} L${bx + 14},${CEIL_Y + 48} L${bx + 22},${CEIL_Y + 10}`}
              fill="#2a1408" />
          </g>
        ))}

        {/* ── Floor ────────────────────────────────────────────────────── */}
        <rect x="0" y={FLOOR_Y} width={W} height={H - FLOOR_Y} fill="url(#wm-floor)" />
        {Array.from({ length: 22 }, (_, i) => (
          <line key={i}
            x1={i * (W / 21)} y1={FLOOR_Y} x2={i * (W / 21)} y2={H}
            stroke="#2e1808" strokeWidth="2" opacity="0.52" />
        ))}
        {Array.from({ length: 5 }, (_, i) => (
          <line key={i}
            x1="0" y1={FLOOR_Y + 10 + i * 8} x2={W} y2={FLOOR_Y + 10 + i * 8}
            stroke="#6a4022" strokeWidth="0.8" opacity="0.28" />
        ))}

        {/* ── Left-wall windows ────────────────────────────────────────── */}
        {LW_WIN.map((wi) => {
          const wx  = 26 + (wi + 1) * 96;
          const wy  = CEIL_Y + 16;
          const wh  = Math.round((FLOOR_Y - CEIL_Y) * LW_H_FRAC);
          return (
            <g key={wi}>
              {/* Sky outside */}
              <rect x={wx} y={wy} width={LW_W} height={Math.round(wh * 0.42)} fill="#87ceeb" />
              {/* Green hills */}
              <rect x={wx} y={wy + Math.round(wh * 0.38)} width={LW_W} height={wh - Math.round(wh * 0.38)} fill="#6a9a58" />
              <ellipse cx={wx + LW_W * 0.4} cy={wy + wh * 0.54} rx={LW_W * 0.6} ry={wh * 0.26} fill="#4e8a3a" />
              <ellipse cx={wx + LW_W * 0.75} cy={wy + wh * 0.58} rx={LW_W * 0.46} ry={wh * 0.20} fill="#5a9844" />
              {/* River glint */}
              <rect x={wx + 10} y={wy + Math.round(wh * 0.60)} width={LW_W - 20} height={Math.round(wh * 0.07)}
                fill="#90c8e8" opacity="0.82" />
              {/* Pane grid */}
              <line x1={wx + LW_W / 2} y1={wy} x2={wx + LW_W / 2} y2={wy + wh} stroke="#4a2e12" strokeWidth="3" />
              <line x1={wx} y1={wy + wh / 3} x2={wx + LW_W} y2={wy + wh / 3} stroke="#4a2e12" strokeWidth="2.5" />
              <line x1={wx} y1={wy + wh * 2 / 3} x2={wx + LW_W} y2={wy + wh * 2 / 3} stroke="#4a2e12" strokeWidth="2.5" />
              {/* Frame */}
              <rect x={wx - 5} y={wy - 5} width={LW_W + 10} height={wh + 10}
                fill="none" stroke="#3a2010" strokeWidth="7" />
              {/* Glass glint */}
              <rect x={wx + 4} y={wy + 5} width={16} height={4} fill="white" opacity="0.18" rx="1" />
              {/* Light shaft */}
              <polygon
                points={`${wx},${wy + wh * 0.08} ${wx + LW_W},${wy + wh * 0.18} ${wx + LW_W + 95},${FLOOR_Y} ${wx - 52},${FLOOR_Y}`}
                fill="#f8d888" opacity="0.055"
              />
            </g>
          );
        })}

        {/* ── Right-wall windows (receding) ────────────────────────────── */}
        {RW_WINS.map((wx, wi) => {
          const ww  = RW_W - wi * 8;
          const wh  = Math.round((FLOOR_Y - CEIL_Y) * (0.62 - wi * 0.06));
          const wy  = CEIL_Y + 18;
          return (
            <g key={wi}>
              <rect x={wx} y={wy} width={ww} height={wh} fill="#90c8f0" opacity="0.72" />
              <rect x={wx} y={wy} width={ww} height={wh} fill="#fff8c0" opacity="0.18" />
              <line x1={wx + ww / 2} y1={wy} x2={wx + ww / 2} y2={wy + wh} stroke="#3a2010" strokeWidth="3" />
              <line x1={wx} y1={wy + wh / 3} x2={wx + ww} y2={wy + wh / 3} stroke="#3a2010" strokeWidth="2.5" />
              <line x1={wx} y1={wy + wh * 2 / 3} x2={wx + ww} y2={wy + wh * 2 / 3} stroke="#3a2010" strokeWidth="2.5" />
              <rect x={wx - 4} y={wy - 4} width={ww + 8} height={wh + 8}
                fill="none" stroke="#3a2010" strokeWidth="5" />
            </g>
          );
        })}

        {/* ── Line shaft ───────────────────────────────────────────────── */}
        {/* Drop-arm brackets from each beam */}
        {BEAM_XS.map((bx, bi) => (
          <g key={bi}>
            <rect x={bx - 3} y={CEIL_Y + 46} width={6} height={SHAFT_Y - CEIL_Y - 46} fill="#666" />
            <ellipse cx={bx} cy={SHAFT_Y} rx={SHAFT_R + 5} ry={Math.round((SHAFT_R + 5) * 0.58)}
              fill="#444" stroke="#222" strokeWidth="1.5" />
          </g>
        ))}
        {/* Shaft body */}
        <rect x={SHAFT_X1} y={SHAFT_Y - SHAFT_R} width={SHAFT_X2 - SHAFT_X1} height={SHAFT_R * 2}
          fill="url(#wm-shaft)" />
        {/* Rotating helix mark */}
        <path d={helixD} fill="none" stroke="#c0b8a8" strokeWidth="2.5" opacity="0.62" />
        {/* End caps */}
        <ellipse cx={SHAFT_X1} cy={SHAFT_Y} rx={SHAFT_R} ry={Math.round(SHAFT_R * 0.5)} fill="#888" />
        <ellipse cx={SHAFT_X2} cy={SHAFT_Y} rx={SHAFT_R} ry={Math.round(SHAFT_R * 0.5)} fill="#888" />

        {/* ── Pulleys ──────────────────────────────────────────────────── */}
        {PULLEYS.map((p, pi) => {
          const pAngle = shaftAngle + pi * 0.8;
          const sx1 = Math.cos(pAngle) * p.r * 0.68;
          const sy1 = Math.sin(pAngle) * p.r * 0.42;
          return (
            <g key={pi}>
              <ellipse cx={p.x} cy={SHAFT_Y} rx={p.r} ry={Math.round(p.r * 0.58)}
                fill="#555" stroke="#888" strokeWidth="3" />
              <ellipse cx={p.x} cy={SHAFT_Y} rx={Math.round(p.r * 0.78)} ry={Math.round(p.r * 0.46)}
                fill="none" stroke="#333" strokeWidth="2" />
              <line
                x1={p.x - sx1} y1={SHAFT_Y - sy1}
                x2={p.x + sx1} y2={SHAFT_Y + sy1}
                stroke="#777" strokeWidth="3" />
            </g>
          );
        })}

        {/* ── Leather belts (shaft → frame) ────────────────────────────── */}
        {PULLEYS.map((p, pi) => {
          const frame = FRAMES[pi];
          if (!frame) return null;
          const frameTopY = FLOOR_Y - frame.h + 30;
          const fmx = frame.x + Math.round(frame.w / 2);
          const flutter = Math.sin(phase * 9.2 + pi * 1.5) * 2.2;
          return (
            <g key={pi}>
              <line x1={p.x + 9}  y1={SHAFT_Y + 11} x2={fmx + 10 + flutter} y2={frameTopY}
                stroke="#5a3010" strokeWidth="4.5" opacity="0.88" />
              <line x1={p.x - 9}  y1={SHAFT_Y + 11} x2={fmx - 10 + flutter} y2={frameTopY}
                stroke="#4a2808" strokeWidth="4.5" opacity="0.88" />
              {/* Belt surface stitches */}
              {Array.from({ length: 6 }, (_, bi2) => {
                const t = (bi2 + 0.5) / 6;
                const bx2 = p.x + (fmx - p.x) * t + flutter * t;
                const by2 = SHAFT_Y + 11 + (frameTopY - SHAFT_Y - 11) * t;
                const ang = Math.atan2(frameTopY - SHAFT_Y - 11, fmx - p.x) * 180 / Math.PI;
                return (
                  <rect key={bi2} x={bx2 - 4} y={by2 - 1.5} width={8} height={3}
                    fill="#7a4a18" opacity="0.45"
                    transform={`rotate(${ang}, ${bx2}, ${by2})`} />
                );
              })}
            </g>
          );
        })}

        {/* ── Spinning frames ──────────────────────────────────────────── */}
        {FRAMES.map((fr, fi) => {
          const frameY  = FLOOR_Y - fr.h;
          const bobbinh = Math.round(fr.h * 0.19);
          const bobR    = Math.round(fr.w / (fr.nc * 2.2));

          return (
            <g key={fi}>
              {/* Main frame body */}
              <rect x={fr.x} y={frameY} width={fr.w} height={fr.h}
                fill="#2c1806" stroke="#4a2810" strokeWidth="2" rx="2" />
              {/* Horizontal brace mid-way */}
              <rect x={fr.x} y={frameY + Math.round(fr.h * 0.44)} width={fr.w} height={5}
                fill="#5a3a18" />
              {/* Vertical uprights */}
              <rect x={fr.x + Math.round(fr.w * 0.20) - 3} y={frameY} width={6} height={fr.h} fill="#5a3a18" />
              <rect x={fr.x + Math.round(fr.w * 0.80) - 3} y={frameY} width={6} height={fr.h} fill="#5a3a18" />

              {/* Guide rod (top) */}
              <rect x={fr.x + 4} y={frameY + 8} width={fr.w - 8} height={3} fill="#999" rx="1" />
              {/* Guide rod (mid) */}
              <rect x={fr.x + 4} y={frameY + Math.round(fr.h * 0.43)} width={fr.w - 8} height={3} fill="#999" rx="1" />

              {/* Top bobbin tier */}
              {Array.from({ length: fr.nc }, (_, ci) => {
                const bx  = fr.x + Math.round(fr.w * (ci + 0.5) / fr.nc);
                const by  = frameY + Math.round(fr.h * 0.22);
                const ang = shaftAngle * fr.gr + ci * 0.36;
                const dx1 = Math.cos(ang) * (bobR - 2);
                const dy1 = Math.sin(ang) * (bobR - 2) * 0.48;
                return (
                  <g key={ci}>
                    <rect x={bx - bobR} y={by - bobbinh / 2} width={bobR * 2} height={bobbinh}
                      fill="#d4b880" rx="2" />
                    <line x1={bx - dx1} y1={by - dy1} x2={bx + dx1} y2={by + dy1}
                      stroke="#f0e8d0" strokeWidth="1.6" opacity="0.82" />
                    <line x1={bx - dy1 * 2.2} y1={by + dx1 * 0.48} x2={bx + dy1 * 2.2} y2={by - dx1 * 0.48}
                      stroke="#e0d0b8" strokeWidth="1.1" opacity="0.52" />
                    <ellipse cx={bx} cy={by - Math.round(bobbinh / 2)} rx={bobR} ry={Math.round(bobR * 0.42)}
                      fill="#c8a868" />
                    {/* Thread rising to guide rod */}
                    <line x1={bx} y1={by - Math.round(bobbinh / 2)}
                      x2={bx + Math.round(Math.sin(ang) * 4)} y2={frameY + 9}
                      stroke="#e8e0c8" strokeWidth="0.7" opacity="0.44" />
                  </g>
                );
              })}

              {/* Bottom bobbin tier */}
              {Array.from({ length: fr.nc }, (_, ci) => {
                const bx  = fr.x + Math.round(fr.w * (ci + 0.5) / fr.nc);
                const by  = frameY + Math.round(fr.h * 0.65);
                const ang = shaftAngle * fr.gr * 1.12 + ci * 0.36 + 0.95;
                const dx1 = Math.cos(ang) * (bobR - 2);
                const dy1 = Math.sin(ang) * (bobR - 2) * 0.48;
                return (
                  <g key={ci}>
                    <rect x={bx - bobR} y={by - bobbinh / 2} width={bobR * 2} height={bobbinh}
                      fill="#d4b880" rx="2" />
                    <line x1={bx - dx1} y1={by - dy1} x2={bx + dx1} y2={by + dy1}
                      stroke="#f0e8d0" strokeWidth="1.6" opacity="0.82" />
                    <line x1={bx - dy1 * 2.2} y1={by + dx1 * 0.48} x2={bx + dy1 * 2.2} y2={by - dx1 * 0.48}
                      stroke="#e0d0b8" strokeWidth="1.1" opacity="0.52" />
                    <ellipse cx={bx} cy={by - Math.round(bobbinh / 2)} rx={bobR} ry={Math.round(bobR * 0.42)}
                      fill="#c8a868" />
                  </g>
                );
              })}

              {/* Frame-top pulley (small, where belt attaches) */}
              <ellipse cx={fr.x + Math.round(fr.w / 2)} cy={frameY + 22}
                rx={14} ry={6} fill="#555" stroke="#888" strokeWidth="2" />
            </g>
          );
        })}

        {/* ── Dust motes in light shafts ───────────────────────────────── */}
        {MOTES.map((m, mi) => {
          const mx = m.x + Math.sin(phase * m.spd * 1.3 + m.ph) * 6;
          const rawY = m.y + Math.sin(phase * m.spd + m.ph * 0.7) * 8
            - ((phase * m.spd * 12 + m.ph * 20) % 190);
          const roomH = FLOOR_Y - CEIL_Y;
          const moteY = ((rawY - CEIL_Y) % roomH + roomH) % roomH + CEIL_Y;
          return (
            <circle key={mi} cx={mx} cy={moteY} r={m.r}
              fill="#f8e890"
              opacity={0.24 + Math.sin(phase * 2.2 + m.ph) * 0.12} />
          );
        })}

        {/* ── Mill workers ─────────────────────────────────────────────── */}
        {WORKERS.map((w, wi) => {
          const armSw = Math.sin(phase * 1.4 + wi * 1.1) * 16 * w.reach;
          const bob   = Math.sin(phase * 1.4 + wi * 1.1) * 2;
          const sc    = 1.0 - wi * 0.08;
          const dress = DRESS_COLORS[wi % 3] ?? "#6a4a8a";
          return (
            <g key={wi} transform={`translate(${w.x}, ${FLOOR_Y}) scale(${sc}, ${sc})`}>
              {/* Skirt */}
              <path d="M-16,0 L-22,-56 L22,-56 L16,0 Z" fill={dress} />
              {/* White apron */}
              <path d="M-10,0 L-13,-52 L13,-52 L10,0 Z" fill="#e8e0d2" opacity="0.68" />
              {/* Blouse */}
              <rect x="-12" y="-88" width="24" height="34" fill="#d0c8ba" rx="3" />
              {/* Head */}
              <ellipse cx={0} cy={-96 + bob} rx="11" ry="12" fill="#d4916a" />
              {/* Hair bun */}
              <ellipse cx={0} cy={-107 + bob} rx="10" ry="6" fill="#5a3a10" />
              {/* Arms */}
              <line x1="-12" y1="-80"
                x2={-30 + armSw * 0.4} y2={-64}
                stroke="#d4916a" strokeWidth="5" strokeLinecap="round" />
              <line x1="12"  y1="-80"
                x2={30 - armSw * 0.4}  y2={-64}
                stroke="#d4916a" strokeWidth="5" strokeLinecap="round" />
              <circle cx={-30 + armSw * 0.4} cy={-64} r="4" fill="#d4916a" />
              <circle cx={ 30 - armSw * 0.4} cy={-64} r="4" fill="#d4916a" />
            </g>
          );
        })}

        {/* Bobbin basket on floor */}
        <g transform={`translate(125, ${FLOOR_Y})`}>
          <path d="M-24,0 L-26,-30 L26,-30 L24,0 Z" fill="#a07840" />
          <ellipse cx="0" cy="-30" rx="26" ry="8" fill="#b08848" />
          {[-14, -5, 5, 14].map((ox, bi) => (
            <g key={bi} transform={`translate(${ox}, -34)`}>
              <rect x="-4" y="-10" width="8" height="10" fill="#d4b880" rx="1" />
              <ellipse cx="0" cy="-10" rx="4" ry="1.5" fill="#c8a868" />
            </g>
          ))}
          {[-16, -6, 4, 14].map((ox, bi) => (
            <line key={bi}
              x1={ox} y1={-29} x2={ox - 2} y2={0}
              stroke="#8a6028" strokeWidth="1.2" opacity="0.48" />
          ))}
        </g>

        {/* Raw wool pile on floor */}
        <g transform={`translate(1090, ${FLOOR_Y})`}>
          <ellipse cx="0"   cy="-13" rx="44" ry="18" fill="#e8e0d0" opacity="0.68" />
          <ellipse cx="-18" cy="-20" rx="24" ry="13" fill="#f0e8d8" opacity="0.68" />
          <ellipse cx="20"  cy="-15" rx="22" ry="11" fill="#e8e0d0" opacity="0.64" />
          {Array.from({ length: 9 }, (_, i) => {
            const a = i * 137.508 * Math.PI / 180;
            return (
              <ellipse key={i}
                cx={Math.round(Math.cos(a) * 20)} cy={-13 + Math.round(Math.sin(a) * 8)}
                rx={5 + (i % 3) * 2} ry={3 + (i % 2)}
                fill="#f8f0e0" opacity="0.58" />
            );
          })}
        </g>

        {/* Mill identification plate */}
        <g transform={`translate(${W / 2 + 90}, ${CEIL_Y + 22})`}>
          <rect x="-138" y="0" width="276" height="38" fill="#1a0c04" rx="3" />
          <rect x="-134" y="3" width="268" height="32" fill="#0e0804"
            stroke="#8a6030" strokeWidth="1" rx="2" />
          <text x="0" y="23"
            textAnchor="middle" fontSize="13.5"
            fill="#c8a040" fontFamily="Georgia, serif" letterSpacing="2">
            SHREWSBURY WORSTED CO. · EST. 1848
          </text>
        </g>

        {/* Caption */}
        <text x={W / 2} y={H - 10}
          textAnchor="middle" fontSize="12"
          fill="#c8a868" fontFamily="Georgia, serif" opacity="0.6" letterSpacing="0.5">
          Shrewsbury Worsted Co. · Ring-Spinning Floor · 1876
        </text>

        {/* Entrance reveal */}
        <rect width={W} height={H} fill="#120a04"
          style={{ opacity: active ? 0 : 1, transition: "opacity 1.3s ease", pointerEvents: "none" }}
        />
      </svg>
    </section>
  );
}
