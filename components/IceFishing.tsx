"use client";
import { useEffect, useRef, useState } from "react";

const W = 1280, H = 520;
const HORIZON_Y = 182;
const GY = H - 58;
const VP_X = 640;

const SHACKS = [
  { x: 178, y: 344, w: 70, h: 56, col: "#7a6238", roof: "#5a3a1a" },
  { x: 362, y: 276, w: 55, h: 44, col: "#7a5e32", roof: "#5a3818" },
  { x: 596, y: 246, w: 44, h: 36, col: "#686050", roof: "#484028" },
  { x: 822, y: 262, w: 50, h: 40, col: "#7a6040", roof: "#584020" },
] as const;

const HOLES = [
  { x: 432, y: 318, r: 12 },
  { x: 648, y: 296, r:  9 },
  { x: 398, y: 390, r: 13 },
  { x: 764, y: 314, r: 10 },
  { x: 568, y: 370, r: 12 },
  { x: 712, y: 400, r: 11 },
  { x: 290, y: 312, r:  9 },
] as const;

const TIPUPS = [
  { hx: 432, hy: 318, po: 0.00 },
  { hx: 648, hy: 296, po: 1.40 },
  { hx: 764, hy: 314, po: 2.80 },
  { hx: 568, hy: 370, po: 0.70 },
] as const;

const SHORE_TREES = Array.from({ length: 22 }, (_, i) => ({
  x: 20 + i * 60 + (i * 11) % 24,
  h: 28 + (i * 7) % 24,
  w: 10 + (i * 5) % 10,
}));

const ICE_SPARKLES = Array.from({ length: 44 }, (_, i) => ({
  x: 40 + (i * 53 + 7) % 1200,
  y: HORIZON_Y + 25 + (i * 37) % (GY - HORIZON_Y - 25),
  r: 1.2 + (i * 3) % 4 / 4,
}));

const N_ICE_LINES = 14;
const ICE_PERSP = Array.from({ length: N_ICE_LINES }, (_, i) => ({
  bx: (i / (N_ICE_LINES - 1)) * W,
  by: GY,
}));

const ICE_BANDS = Array.from({ length: 10 }, (_, i) => ({
  y: HORIZON_Y + 15 + i * (GY - HORIZON_Y - 15) / 10,
  op: 0.12 + i * 0.02,
}));

const SNOW_DRIFT = Array.from({ length: 28 }, (_, i) => ({
  x: (i * 71 + 30) % W,
  y: HORIZON_Y + 20 + (i * 43) % (GY - HORIZON_Y - 20),
  len: 12 + (i * 9) % 24,
}));

export function IceFishing() {
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

  const jig1     = Math.sin(phase * 3.2) * 14;
  const jig2     = Math.sin(phase * 2.8 + 1.0) * 12;
  const cloudOff = (phase * 4.5) % 360;
  const smokeP   = (phase * 0.6) % 1;

  const smokePuffs = [0, 1].map(si => {
    const prog = (smokeP + si * 0.5) % 1;
    return { dy: -prog * 40 - 8, r: 3.5 + prog * 4.5, op: Math.max(0, 1 - prog * 1.4) };
  });

  return (
    <section className="w-full overflow-hidden" style={{ background: "#dde8f0" }}>
      <svg
        ref={ref}
        viewBox={`0 0 ${W} ${H}`}
        width="100%"
        style={{ display: "block", opacity: vis ? 1 : 0, transition: "opacity 1s" }}
        aria-label="Ice fishing on Lake Quinsigamond, Shrewsbury winter"
      >
        <defs>
          <linearGradient id="ifSky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#9ab4cc" />
            <stop offset="55%"  stopColor="#bcd0e0" />
            <stop offset="100%" stopColor="#ccd8e4" />
          </linearGradient>
          <linearGradient id="ifIce" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#ccdce8" />
            <stop offset="40%"  stopColor="#bcccd8" />
            <stop offset="100%" stopColor="#a8b8c8" />
          </linearGradient>
          <radialGradient id="ifHole" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="#0a1828" />
            <stop offset="65%"  stopColor="#1a2838" />
            <stop offset="100%" stopColor="#304858" />
          </radialGradient>
        </defs>

        {/* Sky */}
        <rect width={W} height={HORIZON_Y + 12} fill="url(#ifSky)" />

        {/* Thin winter clouds */}
        {[0, 1, 2].map(ci => {
          const cx = ((ci * 400 + cloudOff) % (W + 220)) - 100;
          const cy = 32 + ci * 22;
          return (
            <g key={ci} transform={`translate(${cx},${cy})`} opacity={0.4}>
              <ellipse cx={0}   cy={0} rx={72} ry={12} fill="#d8e4ec" />
              <ellipse cx={-40} cy={4} rx={50} ry={10} fill="#d4e0e8" />
              <ellipse cx={42}  cy={3} rx={54} ry={11} fill="#d8e4ec" />
            </g>
          );
        })}

        {/* Far shore — bare trees + town */}
        {SHORE_TREES.map((t, i) => (
          <g key={i} transform={`translate(${t.x},${HORIZON_Y})`} opacity={0.55}>
            <rect x={-t.w / 4} y={-t.h} width={t.w / 2} height={t.h} fill="#3a4a58" />
            <ellipse cx={0} cy={-t.h} rx={t.w / 2} ry={t.h * 0.45} fill="#2a3a48" />
            <ellipse cx={0} cy={-t.h - t.h * 0.28} rx={t.w * 0.4} ry={t.h * 0.14}
              fill="#dce8f0" opacity={0.72} />
          </g>
        ))}
        {[100, 450, 700, 950, 1100].map((bx, i) => (
          <rect key={i} x={bx} y={HORIZON_Y - 14 - (i * 7) % 10}
            width={30 + (i * 11) % 22} height={14 + (i * 7) % 10}
            fill="#4a5a6a" opacity={0.48} />
        ))}

        {/* Ice surface */}
        <rect x={0} y={HORIZON_Y} width={W} height={H - HORIZON_Y} fill="url(#ifIce)" />

        {/* Perspective convergence lines */}
        {ICE_PERSP.map((lp, i) => (
          <line key={i} x1={VP_X} y1={HORIZON_Y} x2={lp.bx} y2={lp.by}
            stroke="#9aaabb" strokeWidth={0.6} opacity={0.25} />
        ))}

        {/* Horizontal ice grid */}
        {ICE_BANDS.map((b, i) => (
          <line key={i} x1={0} y1={b.y} x2={W} y2={b.y}
            stroke="#8898a8" strokeWidth={0.9} opacity={b.op} />
        ))}

        {/* Snow drifts */}
        {SNOW_DRIFT.map((s, i) => (
          <line key={i} x1={s.x} y1={s.y} x2={s.x + s.len} y2={s.y}
            stroke="#e8f0f8" strokeWidth={2.5} strokeLinecap="round" opacity={0.45} />
        ))}

        {/* Ice sparkles */}
        {ICE_SPARKLES.map((sp, i) => {
          const tw = Math.sin(phase * 2.2 + i * 0.7) * 0.3 + 0.7;
          return <circle key={i} cx={sp.x} cy={sp.y} r={sp.r}
            fill="#e8f4ff" opacity={tw * 0.55} />;
        })}

        {/* Fishing shacks */}
        {SHACKS.map((s, si) => {
          const chimX = s.x + s.w * 0.72;
          const chimY = s.y - s.h;
          return (
            <g key={si}>
              <ellipse cx={s.x + s.w / 2} cy={s.y + 4} rx={s.w * 0.58} ry={5}
                fill="#8898a8" opacity={0.32} />
              <rect x={s.x} y={s.y - s.h} width={s.w} height={s.h} fill={s.col} />
              {/* Planking */}
              {Array.from({ length: 4 }, (_, pi) => (
                <line key={pi} x1={s.x} y1={s.y - s.h + pi * s.h / 4}
                  x2={s.x + s.w} y2={s.y - s.h + pi * s.h / 4}
                  stroke="#4a3010" strokeWidth={0.8} opacity={0.35} />
              ))}
              {/* Door */}
              <rect x={s.x + s.w * 0.34} y={s.y - s.h * 0.55}
                width={s.w * 0.28} height={s.h * 0.55}
                fill="#2a1808" stroke="#3a2008" strokeWidth={1} rx={1} />
              {/* Window */}
              <rect x={s.x + 6} y={s.y - s.h + 7} width={s.w * 0.24} height={s.h * 0.28}
                fill="#f0d870" opacity={0.78} stroke="#3a2008" strokeWidth={1} />
              <line x1={s.x + 6} y1={s.y - s.h + 7 + s.h * 0.14}
                x2={s.x + 6 + s.w * 0.24} y2={s.y - s.h + 7 + s.h * 0.14}
                stroke="#3a2008" strokeWidth={0.8} />
              {/* Roof */}
              <polygon
                points={`${s.x - 3},${s.y - s.h} ${s.x + s.w / 2},${s.y - s.h - s.h * 0.52} ${s.x + s.w + 3},${s.y - s.h}`}
                fill={s.roof} />
              {/* Snow on roof */}
              <path d={`M${s.x - 4},${s.y - s.h - 1} Q${s.x + s.w / 2},${s.y - s.h - s.h * 0.52 + 5} ${s.x + s.w + 4},${s.y - s.h - 1}`}
                fill="#dce8f4" opacity={0.88} />
              {/* Chimney */}
              <rect x={chimX - 4} y={chimY - 13} width={8} height={15} fill="#4a3828" />
              {/* Smoke puffs */}
              {smokePuffs.map((sp, spI) => (
                <circle key={spI}
                  cx={chimX} cy={chimY - 13 + sp.dy}
                  r={sp.r} fill="#c4c0b8" opacity={sp.op * (0.72 - si * 0.1)} />
              ))}
            </g>
          );
        })}

        {/* Ice holes */}
        {HOLES.map((h, i) => (
          <g key={i}>
            <circle cx={h.x} cy={h.y} r={h.r + 5} fill="#b8c8d4" />
            <ellipse cx={h.x} cy={h.y} rx={h.r} ry={h.r * 0.72}
              fill="url(#ifHole)" />
            <ellipse cx={h.x - h.r * 0.3} cy={h.y - h.r * 0.22}
              rx={h.r * 0.55} ry={h.r * 0.26}
              fill="none" stroke="#d8e8f0" strokeWidth={1.5} opacity={0.5} />
          </g>
        ))}

        {/* Tip-ups */}
        {TIPUPS.map((tu, i) => {
          const t = Math.sin(phase * 0.55 + tu.po) * 0.5 + 0.5;
          const flagAng = 80 - t * 150;
          const flagRad = flagAng * Math.PI / 180;
          const armL = 18;
          const ax = Math.cos(flagRad) * armL;
          const ay = -armL + Math.sin(flagRad) * armL;
          const perpA = flagRad + Math.PI / 2;
          const px1 = ax, py1 = ay;
          const px2 = ax + Math.cos(perpA) * 10, py2 = ay + Math.sin(perpA) * 10;
          const px3 = Math.cos(flagRad) * 26, py3 = -armL + Math.sin(flagRad) * 26;
          return (
            <g key={i} transform={`translate(${tu.hx},${tu.hy - 2})`}>
              {/* Cross base */}
              <line x1={-14} y1={0} x2={14} y2={0} stroke="#6a4a20" strokeWidth={3} />
              <line x1={0} y1={-4} x2={0} y2={4}   stroke="#6a4a20" strokeWidth={3} />
              {/* Vertical arm */}
              <line x1={0} y1={0} x2={0} y2={-armL} stroke="#7a5820" strokeWidth={2.5} />
              {/* Pivot arm */}
              <line x1={0} y1={-armL} x2={ax} y2={ay}
                stroke="#6a4810" strokeWidth={2} />
              {/* Flag */}
              <polygon points={`${px1},${py1} ${px2},${py2} ${px3},${py3}`}
                fill="#c82020" />
              {/* Fishing line */}
              <line x1={0} y1={0} x2={0} y2={7}
                stroke="#8898a8" strokeWidth={0.9} opacity={0.7} />
            </g>
          );
        })}

        {/* Fisherman 1 — seated on bucket, jigging (hole x=398, y=390) */}
        {(() => {
          const fx = 398, fy = 390;
          return (
            <g transform={`translate(${fx},${fy})`}>
              {/* Bucket */}
              <path d="M-10,-12 Q-12,-1 -10,1 Q0,4 10,1 Q12,-1 10,-12 Z" fill="#6a7888" />
              <line x1={-10} y1={-12} x2={10} y2={-12} stroke="#4a5868" strokeWidth={1.5} />
              {/* Body (seated) */}
              <rect x={-8} y={-38} width={16} height={26} fill="#2a3a5a" rx={2} />
              {/* Legs bent */}
              <line x1={-5} y1={-12} x2={-14} y2={2} stroke="#1e2e4a" strokeWidth={7} strokeLinecap="round" />
              <line x1={5}  y1={-12} x2={14}  y2={2} stroke="#1e2e4a" strokeWidth={7} strokeLinecap="round" />
              <ellipse cx={-16} cy={3} rx={7} ry={4} fill="#1a1208" />
              <ellipse cx={16}  cy={3} rx={7} ry={4} fill="#1a1208" />
              {/* Head */}
              <circle cx={0} cy={-46} r={10} fill="#d4956a" />
              {/* Red winter hat */}
              <rect x={-9} y={-57} width={18} height={13} fill="#c02020" rx={1} />
              <ellipse cx={0} cy={-57} rx={11} ry={4} fill="#c02020" />
              <circle cx={0} cy={-68} r={4.5} fill="#e8e8e0" />
              {/* Jigging arm + rod */}
              <line x1={7} y1={-34} x2={7} y2={-20 + jig1}
                stroke="#d4956a" strokeWidth={4.5} strokeLinecap="round" />
              <line x1={7} y1={-20 + jig1} x2={7} y2={-8 + jig1}
                stroke="#5a3a10" strokeWidth={2} />
              <line x1={7} y1={-8 + jig1} x2={0} y2={6}
                stroke="#8898a8" strokeWidth={0.9} opacity={0.8} />
              {/* Other arm */}
              <line x1={-7} y1={-32} x2={-14} y2={-22}
                stroke="#d4956a" strokeWidth={4} strokeLinecap="round" />
            </g>
          );
        })()}

        {/* Fisherman 2 — standing, pulling line (hole x=712, y=400) */}
        {(() => {
          const fx = 712, fy = 400;
          return (
            <g transform={`translate(${fx},${fy})`}>
              <rect x={-7} y={-54} width={14} height={36} fill="#3a5a2a" rx={2} />
              <line x1={-4} y1={-18} x2={-5} y2={0} stroke="#2a3a1a" strokeWidth={6} strokeLinecap="round" />
              <line x1={4}  y1={-18} x2={5}  y2={0} stroke="#2a3a1a" strokeWidth={6} strokeLinecap="round" />
              <ellipse cx={-6} cy={2} rx={6} ry={3.5} fill="#1a1208" />
              <ellipse cx={6}  cy={2} rx={6} ry={3.5} fill="#1a1208" />
              <circle cx={0} cy={-62} r={9} fill="#d4956a" />
              <rect x={-8} y={-72} width={16} height={11} fill="#4a3a1a" rx={1} />
              <ellipse cx={0} cy={-72} rx={10} ry={3.5} fill="#4a3a1a" />
              {/* Both arms pulling */}
              <line x1={-6} y1={-48} x2={-12} y2={-32 + jig2}
                stroke="#d4956a" strokeWidth={4.5} strokeLinecap="round" />
              <line x1={6}  y1={-48} x2={12}  y2={-32 + jig2}
                stroke="#d4956a" strokeWidth={4.5} strokeLinecap="round" />
              <line x1={0} y1={-32 + jig2} x2={0} y2={5}
                stroke="#8898a8" strokeWidth={0.9} opacity={0.85} />
            </g>
          );
        })()}

        {/* Distant fisherman (far, small) */}
        <g transform={`translate(512,270)`} opacity={0.75}>
          <circle cx={0} cy={-22} r={5} fill="#3a4a5a" />
          <rect x={-4} y={-20} width={8} height={14} fill="#3a4a5a" />
          <line x1={0} y1={-6} x2={0} y2={4} stroke="#3a4a5a" strokeWidth={4} />
        </g>

        {/* Sled with gear (x=248, y=392) */}
        {(() => {
          const sx = 248, sy = 392;
          return (
            <g transform={`translate(${sx},${sy})`}>
              <line x1={-38} y1={5}  x2={38} y2={5}  stroke="#5a3a10" strokeWidth={4} strokeLinecap="round" />
              <line x1={-38} y1={9}  x2={38} y2={9}  stroke="#5a3a10" strokeWidth={4} strokeLinecap="round" />
              <rect x={-36} y={-8} width={72} height={15} fill="#8a6030" rx={1} />
              <line x1={-36} y1={-3} x2={36} y2={-3} stroke="#6a4820" strokeWidth={1} opacity={0.5} />
              <line x1={-36} y1={2}  x2={36} y2={2}  stroke="#6a4820" strokeWidth={1} opacity={0.5} />
              {/* Ice auger */}
              <rect x={-28} y={-20} width={6} height={18} fill="#4a4848" rx={1} />
              <line x1={-25} y1={-20} x2={-25} y2={-30} stroke="#3a3838" strokeWidth={3} />
              <path d="M-28,-2 Q-22,-2 -25,2 Q-28,6 -22,6" fill="none"
                stroke="#3a3838" strokeWidth={2} />
              {/* Tackle box */}
              <rect x={-6} y={-17} width={24} height={13} fill="#c89030"
                stroke="#8a6020" strokeWidth={1} rx={1} />
              <line x1={-6} y1={-11} x2={18} y2={-11} stroke="#8a6020" strokeWidth={1} />
              {/* Bucket of fish */}
              <path d="M12,-18 Q16,-18 16,-8 Q12,-5 8,-8 Q8,-18 12,-18 Z" fill="#6888a0" />
              <line x1={8} y1={-18} x2={16} y2={-18} stroke="#4a6880" strokeWidth={1.5} />
            </g>
          );
        })()}

        {/* Fish silhouette under ice at hole (712,400) */}
        {(() => {
          const fishBob = Math.sin(phase * 1.8 + 2.2) * 3;
          return (
            <g transform={`translate(712,${406 + fishBob})`} opacity={0.42}>
              <ellipse cx={0} cy={0} rx={12} ry={5} fill="#1a3848" />
              <path d="M12,0 Q18,-4 18,4 Z" fill="#1a3848" />
              <circle cx={-7} cy={-1} r={1.5} fill="#3a5868" />
            </g>
          );
        })()}

        {/* Caption */}
        <text x={W / 2} y={H - 16} textAnchor="middle"
          fontFamily="Georgia, serif" fontSize={12} fill="#2a3a5a"
          letterSpacing={2.5} opacity={0.72}>
          LAKE QUINSIGAMOND · SHREWSBURY · ICE FISHING SEASON
        </text>
      </svg>
    </section>
  );
}
