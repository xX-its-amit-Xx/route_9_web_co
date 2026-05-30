"use client";
import { useEffect, useRef, useState } from "react";

const W = 1280, H = 520;
const WATER_Y = 246;
const DOCK_Y = H - 56;
const HORIZON_Y = 210;
const HGX = 800, HGY = 410, HROT = 190;

const TOWN_BLDGS = [
  { x: 55,  h: 68, w: 58 },
  { x: 122, h: 94, w: 44 },
  { x: 175, h: 52, w: 62 },
  { x: 248, h: 76, w: 38 },
  { x: 295, h: 44, w: 70 },
  { x: 374, h: 62, w: 48 },
  { x: 432, h: 42, w: 55 },
] as const;

const CROWD = [
  { x: 892,  h: 52, coat: "#2a3a5a", hat: "#1a2a3a", po: 0.6 },
  { x: 924,  h: 60, coat: "#5a2a2a", hat: "#3a1818", po: 1.2 },
  { x: 957,  h: 56, coat: "#2a4a2a", hat: "#0a2a0a", po: 0.2 },
  { x: 988,  h: 64, coat: "#3a3a2a", hat: "#28280a", po: 0.9 },
  { x: 1020, h: 54, coat: "#4a2a4a", hat: "#2a1828", po: 0.4 },
  { x: 1052, h: 62, coat: "#2a3a5a", hat: "#1a2232", po: 1.5 },
  { x: 1084, h: 58, coat: "#5a3a2a", hat: "#3a2010", po: 0.7 },
  { x: 1116, h: 50, coat: "#2a4a3a", hat: "#182a22", po: 1.1 },
  { x: 1148, h: 56, coat: "#4a3a2a", hat: "#2a2210", po: 0.3 },
  { x: 1182, h: 60, coat: "#3a2a4a", hat: "#1e1830", po: 0.8 },
] as const;

const PENNANT_C = ["#c81818", "#f8f0d0", "#1a3a8a", "#228822"] as const;

const RIGGING: [number, number, number, number][] = [
  [619, 78, 92, 220],
  [619, 78, 403, 72],
  [403, 72, 818, 320],
  [619, 126, 403, 118],
  [570, 130, 403, 148],
];

export function ShipLaunch() {
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
    let _raf: number = 0, _last = 0;
    const _tick = (ts: number) => { if (ts - _last >= 33) { setPhase(p => p + 0.033); _last = ts; } _raf = requestAnimationFrame(_tick); };
    _raf = requestAnimationFrame(_tick);
    return () => cancelAnimationFrame(_raf);
  }, [vis]);

  const flagWave1  = Math.sin(phase * 3.2) * 8;
  const flagWave2  = Math.sin(phase * 3.2 + 0.4) * 8;
  const bottleSwing = Math.sin(phase * 1.6) * 25 - 10;
  const hullBob    = Math.sin(phase * 0.85) * 2;
  const cloudOff   = (phase * 5.5) % 420;
  const ripR       = (phase * 22) % 55;

  return (
    <section className="w-full overflow-hidden" style={{ background: "#e8f0f4" }}>
      <svg
        ref={ref}
        viewBox={`0 0 ${W} ${H}`}
        width="100%"
        style={{ display: "block", opacity: vis ? 1 : 0, transition: "opacity 1s" }}
        aria-label="Launch of the barque Shrewsbury at a New England shipyard, 1883"
      >
        <defs>
          <linearGradient id="slSky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#b8cce0" />
            <stop offset="60%"  stopColor="#d0dff0" />
            <stop offset="100%" stopColor="#d8e8e0" />
          </linearGradient>
          <linearGradient id="slWater" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#6888a0" />
            <stop offset="100%" stopColor="#486078" />
          </linearGradient>
          <linearGradient id="slDock" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#9a8060" />
            <stop offset="100%" stopColor="#7a6040" />
          </linearGradient>
          <linearGradient id="slHull" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%"   stopColor="#2a1608" />
            <stop offset="55%"  stopColor="#3e2210" />
            <stop offset="100%" stopColor="#4a2a14" />
          </linearGradient>
        </defs>

        {/* Sky */}
        <rect width={W} height={HORIZON_Y + 30} fill="url(#slSky)" />

        {/* Clouds */}
        {[0, 1, 2].map(ci => {
          const cx = ((ci * 390 + cloudOff) % (W + 200)) - 90;
          const cy = 35 + ci * 30;
          return (
            <g key={ci} transform={`translate(${cx},${cy})`} opacity={0.6}>
              <ellipse cx={0}   cy={0}   rx={62} ry={22} fill="#f0f4f8" />
              <ellipse cx={-32} cy={6}   rx={42} ry={17} fill="#eef2f6" />
              <ellipse cx={34}  cy={5}   rx={46} ry={19} fill="#f0f4f8" />
              <ellipse cx={8}   cy={-10} rx={34} ry={16} fill="#f4f8fc" />
            </g>
          );
        })}

        {/* Far shore */}
        <rect x={0} y={HORIZON_Y + 8} width={W} height={18} fill="#a0b4c0" opacity={0.5} />
        {TOWN_BLDGS.map((b, i) => (
          <g key={i} transform={`translate(${b.x},${HORIZON_Y + 8})`} opacity={0.62}>
            <rect x={0} y={-b.h} width={b.w} height={b.h} fill="#7a8898" />
            {i === 1 && (
              <>
                <rect x={18} y={-b.h - 42} width={8}  height={42} fill="#6a7a88" />
                <polygon points={`18,${-b.h - 42} 26,${-b.h - 42} 22,${-b.h - 68}`} fill="#6a7a88" />
                <line x1={10} y1={-b.h - 30} x2={36} y2={-b.h - 30} stroke="#5a6a78" strokeWidth={1.5} />
                <line x1={22} y1={-b.h - 22} x2={22} y2={-b.h - 38} stroke="#5a6a78" strokeWidth={1.5} />
              </>
            )}
            {Array.from({ length: Math.floor(b.w / 14) }, (_, wi) => (
              <rect key={wi} x={wi * 14 + 4} y={-b.h + 6} width={6} height={9}
                fill="#d8c89a" opacity={0.65} />
            ))}
          </g>
        ))}

        {/* Water */}
        <rect x={0} y={WATER_Y} width={W} height={H - WATER_Y} fill="url(#slWater)" />
        {Array.from({ length: 8 }, (_, i) => (
          <path key={i}
            d={`M0,${WATER_Y + 14 + i * 22} Q320,${WATER_Y + 12 + i * 22} 640,${WATER_Y + 16 + i * 22} Q960,${WATER_Y + 12 + i * 22} ${W},${WATER_Y + 14 + i * 22}`}
            fill="none" stroke="#88a8c0" strokeWidth={0.8} opacity={0.32} />
        ))}

        {/* Distant ships at anchor */}
        <g opacity={0.5}>
          <rect x={48}  y={WATER_Y - 22} width={65} height={16} fill="#5a4030" rx={3} />
          <line x1={68}  y1={WATER_Y - 22} x2={64}  y2={WATER_Y - 72} stroke="#3a2818" strokeWidth={2} />
          <line x1={94}  y1={WATER_Y - 22} x2={91}  y2={WATER_Y - 58} stroke="#3a2818" strokeWidth={2} />
          <path d={`M64,${WATER_Y - 72} L94,${WATER_Y - 52} L64,${WATER_Y - 32}`} fill="#e0d8c0" opacity={0.7} />
          <rect x={312} y={WATER_Y - 18} width={55} height={13} fill="#5a4030" rx={2} />
          <line x1={326} y1={WATER_Y - 18} x2={323} y2={WATER_Y - 58} stroke="#3a2818" strokeWidth={2} />
          <path d={`M323,${WATER_Y - 58} L350,${WATER_Y - 42} L323,${WATER_Y - 24}`} fill="#e0d8c0" opacity={0.6} />
        </g>

        {/* Slipway rails */}
        <line x1={90}  y1={WATER_Y + 10} x2={868} y2={DOCK_Y - 2} stroke="#6a5030" strokeWidth={7} />
        <line x1={120} y1={WATER_Y + 16} x2={898} y2={DOCK_Y - 2} stroke="#6a5030" strokeWidth={7} />
        {Array.from({ length: 14 }, (_, i) => {
          const t = i / 14;
          const sx = 90  + t * (868 - 90);
          const sy = WATER_Y + 10 + t * (DOCK_Y - 2 - WATER_Y - 10);
          return (
            <line key={i} x1={sx - 5} y1={sy - 2} x2={sx + 38} y2={sy + 6}
              stroke="#4a3820" strokeWidth={4} strokeLinecap="round" />
          );
        })}

        {/* Hull — rotated group */}
        <g transform={`translate(${HGX},${HGY + hullBob}) rotate(${HROT})`}>
          {/* Hull body */}
          <path d="M0,82 Q320,95 635,90 Q642,75 650,45 Q648,20 638,4 Q480,-8 320,-10 Q160,-8 0,0 Z"
            fill="url(#slHull)" />
          {/* Keel */}
          <path d="M0,0 Q160,-12 320,-14 Q480,-12 638,2"
            fill="none" stroke="#1a0c04" strokeWidth={6} strokeLinecap="round" />
          {/* Planking lines */}
          {Array.from({ length: 9 }, (_, pi) => (
            <path key={pi}
              d={`M0,${10 + pi * 8} Q320,${13 + pi * 8} 630,${8 + pi * 8}`}
              fill="none" stroke="#2a1406" strokeWidth={1.2} opacity={0.45} />
          ))}
          {/* Anti-fouling paint band */}
          <path d="M0,16 Q320,20 635,14 Q640,26 635,30 Q320,34 0,28 Z"
            fill="#7a2a18" opacity={0.72} />
          {/* Gun / cargo ports */}
          {[140, 240, 340, 440, 530].map((px, i) => (
            <rect key={i} x={px - 10} y={48} width={20} height={14}
              fill="#1a0c04" stroke="#5a3a1a" strokeWidth={1.5} rx={2} />
          ))}
          {/* Decorative molding */}
          <path d="M5,78 Q320,90 628,84"
            fill="none" stroke="#8a5a28" strokeWidth={2} opacity={0.55} />
          {/* Stern lettering panel */}
          <rect x={5} y={58} width={62} height={20} fill="#3a1e08" rx={2} />
        </g>

        {/* Cradle blocks under hull */}
        {Array.from({ length: 7 }, (_, i) => {
          const t = 0.08 + i * 0.13;
          const sx = 868 - t * (868 - 92);
          const sy = DOCK_Y - 2 - t * (DOCK_Y - 2 - WATER_Y - 10);
          return (
            <rect key={i} x={sx - 9} y={sy - 14} width={18} height={16}
              fill="#6a5020" stroke="#4a3810" strokeWidth={1} />
          );
        })}

        {/* Masts */}
        <line x1={619} y1={285} x2={619} y2={76}  stroke="#3a2810" strokeWidth={8}  strokeLinecap="round" />
        <line x1={619} y1={76}  x2={619} y2={66}  stroke="#3a2810" strokeWidth={5} />
        <line x1={403} y1={248} x2={403} y2={70}  stroke="#3a2810" strokeWidth={10} strokeLinecap="round" />
        <line x1={403} y1={70}  x2={403} y2={56}  stroke="#3a2810" strokeWidth={6} />
        {/* Yards */}
        <line x1={568} y1={130} x2={670} y2={126} stroke="#3a2810" strokeWidth={5} />
        <line x1={338} y1={118} x2={468} y2={112} stroke="#3a2810" strokeWidth={7} />
        <line x1={340} y1={154} x2={466} y2={150} stroke="#3a2810" strokeWidth={5} />
        {/* Bowsprit */}
        <line x1={210} y1={250} x2={90}  y2={218} stroke="#3a2810" strokeWidth={7} strokeLinecap="round" />

        {/* Rigging */}
        {RIGGING.map(([x1, y1, x2, y2], i) => (
          <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
            stroke="#3a2810" strokeWidth={1.5} opacity={0.55} />
        ))}

        {/* American flag at mainmast */}
        {(() => {
          const fx = 403, fy = 56, fw = 44, fh = 30;
          return (
            <g>
              {[0, 1, 2, 3, 4, 5, 6].map(si => (
                <path key={si}
                  d={`M${fx},${fy + si * fh / 7} Q${fx + fw / 2},${fy + si * fh / 7 + flagWave1 * 0.6} ${fx + fw},${fy + si * fh / 7 + flagWave1}`}
                  fill="none"
                  stroke={si % 2 === 0 ? "#c81818" : "#f8f0e0"}
                  strokeWidth={fh / 7} />
              ))}
              <path
                d={`M${fx},${fy} Q${fx + fw * 0.46},${fy + flagWave1 * 0.28} ${fx + fw * 0.48},${fy + fh * 0.55} L${fx},${fy + fh * 0.55} Z`}
                fill="#1a3a8a" />
            </g>
          );
        })()}

        {/* Pennant at foremast */}
        <path d={`M619,66 Q634,${70 + flagWave2} 647,${74 + flagWave2} Q634,${78 + flagWave2} 619,82`}
          fill="#c81818" />

        {/* Launch pennants along forestay */}
        {Array.from({ length: 12 }, (_, i) => {
          const t = i / 12;
          const px = 90  + t * (619 - 90);
          const py = 220 + t * (76  - 220);
          const col = PENNANT_C[i % 4] ?? "#c81818";
          const sy = Math.sin(phase * 2.8 + i * 0.6) * 4;
          return (
            <polygon key={i}
              points={`${px - 6},${py + sy} ${px + 6},${py + sy} ${px},${py + 14 + sy}`}
              fill={col} opacity={0.9} />
          );
        })}

        {/* Pennants along backstay */}
        {Array.from({ length: 9 }, (_, i) => {
          const t = i / 9;
          const px = 403 + t * (818 - 403);
          const py = 72  + t * (320 - 72);
          const col = PENNANT_C[(i + 2) % 4] ?? "#1a3a8a";
          const sy = Math.sin(phase * 2.8 + i * 0.7 + 3.0) * 4;
          return (
            <polygon key={i}
              points={`${px - 5},${py + sy} ${px + 5},${py + sy} ${px},${py + 12 + sy}`}
              fill={col} opacity={0.85} />
          );
        })}

        {/* Dock platform */}
        <rect x={840} y={DOCK_Y} width={W - 840} height={H - DOCK_Y} fill="url(#slDock)" />
        {Array.from({ length: 10 }, (_, i) => (
          <line key={i} x1={840} y1={DOCK_Y + i * 6} x2={W} y2={DOCK_Y + i * 6}
            stroke="#6a4e2e" strokeWidth={1} opacity={0.38} />
        ))}
        <line x1={840} y1={DOCK_Y} x2={W} y2={DOCK_Y} stroke="#5a3a1a" strokeWidth={3} />
        {[860, 914, 968, 1022].map((px, i) => (
          <rect key={i} x={px - 6} y={DOCK_Y - 22} width={12} height={H - DOCK_Y + 22}
            fill="#4a3010" />
        ))}

        {/* Shore fill (slipway base) */}
        <path d={`M840,${DOCK_Y} L820,${DOCK_Y} L800,${H} L${W},${H} L${W},${DOCK_Y} Z`}
          fill="#9a8060" />

        {/* Crowd */}
        {CROWD.map((p, i) => {
          const armLift = Math.sin(phase * 2.2 + p.po);
          const armTipX = 6 + 14;
          const armTipY = -p.h + 8 - armLift * 18;
          return (
            <g key={i} transform={`translate(${p.x},${DOCK_Y})`}>
              <rect x={-7} y={-p.h}      width={14} height={p.h - 18} fill={p.coat} rx={2} />
              <line x1={-3} y1={-18} x2={-4} y2={0} stroke={p.coat} strokeWidth={5} />
              <line x1={3}  y1={-18} x2={4}  y2={0} stroke={p.coat} strokeWidth={5} />
              <circle cx={0} cy={-p.h - 8} r={8} fill="#d4956a" />
              <ellipse cx={0} cy={-p.h - 14} rx={10} ry={3.5} fill={p.hat} />
              <rect x={-6} y={-p.h - 22}  width={12} height={10} fill={p.hat} rx={1} />
              <line x1={6} y1={-p.h + 10} x2={armTipX} y2={armTipY}
                stroke="#d4956a" strokeWidth={4} strokeLinecap="round" />
              <line x1={-6} y1={-p.h + 12} x2={-14} y2={-p.h + 24}
                stroke="#d4956a" strokeWidth={4} strokeLinecap="round" />
            </g>
          );
        })}

        {/* Timber stacks on dock */}
        {[862, 882, 904].map((lx, i) => (
          <g key={i} transform={`translate(${lx},${DOCK_Y - 2})`}>
            {Array.from({ length: 4 }, (_, ri) => (
              <rect key={ri} x={0} y={-ri * 8 - 8} width={50 - i * 5} height={7}
                fill="#b08040" stroke="#8a5e28" strokeWidth={0.8} />
            ))}
          </g>
        ))}

        {/* Champagne woman at bow */}
        {(() => {
          const bx = 190, by = 262;
          const bAngle = (-30 + bottleSwing) * Math.PI / 180;
          const btx = bx + Math.cos(bAngle) * 24;
          const bty = by + Math.sin(bAngle) * 24;
          const splash = bottleSwing > 8;
          return (
            <g>
              <rect x={bx - 18} y={by + 2} width={36} height={6} fill="#7a5030" rx={1} />
              <rect x={bx - 5}  y={by - 42} width={10} height={26} fill="#8a2a60" rx={2} />
              <path d={`M${bx - 7},${by - 16} Q${bx - 10},${by + 2} ${bx},${by + 2} Q${bx + 10},${by + 2} ${bx + 7},${by - 16} Z`}
                fill="#8a2a60" />
              <circle cx={bx} cy={by - 50} r={8} fill="#d4956a" />
              <ellipse cx={bx} cy={by - 57} rx={7} ry={5} fill="#3a2010" />
              <line x1={bx + 4} y1={by - 36} x2={btx} y2={bty}
                stroke="#d4956a" strokeWidth={4} strokeLinecap="round" />
              <rect x={btx - 3} y={bty - 14} width={6} height={14}
                fill="#4a7828" stroke="#3a5818" strokeWidth={1} rx={2} />
              <rect x={btx - 2} y={bty - 18} width={4} height={6}
                fill="#9a8828" rx={1} />
              <line x1={bx - 4} y1={by - 34} x2={bx - 14} y2={by - 22}
                stroke="#d4956a" strokeWidth={4} strokeLinecap="round" />
              {splash && (
                <>
                  <circle cx={btx + 5} cy={bty - 12} r={3}   fill="#f8f8d0" opacity={0.85} />
                  <circle cx={btx + 9} cy={bty - 8}  r={2}   fill="#f8f8d0" opacity={0.65} />
                  <circle cx={btx + 3} cy={bty - 5}  r={1.5} fill="#f8f8d0" opacity={0.75} />
                </>
              )}
            </g>
          );
        })()}

        {/* Bow ripples */}
        <circle cx={172} cy={270} r={ripR}
          fill="none" stroke="#a8c8d8" strokeWidth={1.5}
          opacity={Math.max(0, 1 - ripR / 55)} />
        <circle cx={172} cy={270} r={ripR * 0.55}
          fill="none" stroke="#b8d8e8" strokeWidth={1.5}
          opacity={Math.max(0, 1 - ripR * 0.55 / 55)} />

        {/* Launch banner */}
        <rect x={352} y={266} width={278} height={26} fill="#f0e8c0" stroke="#c8a830" strokeWidth={1.5} rx={3} />
        <text x={491} y={283} textAnchor="middle"
          fontFamily="Georgia, serif" fontSize={12} fill="#3a2808" letterSpacing={1.2}>
          BARQUE SHREWSBURY · LAUNCHED 1883
        </text>

        {/* Caption */}
        <text x={W / 2} y={H - 16} textAnchor="middle"
          fontFamily="Georgia, serif" fontSize={12} fill="#2a3a5a"
          letterSpacing={2.5} opacity={0.75}>
          LAUNCH OF THE BARQUE SHREWSBURY · NEW ENGLAND SHIPYARD · 1883
        </text>
      </svg>
    </section>
  );
}
