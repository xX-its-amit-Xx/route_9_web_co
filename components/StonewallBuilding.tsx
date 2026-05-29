"use client";
import { useEffect, useRef, useState } from "react";

const W = 1280, H = 520;
const GY = 462;
const HZ = 284;

const WL_X1 = 72;
const WL_X2 = 614;
const WL_TOP = GY - 84;   // 378
const WL_BOT = GY - 8;    // 454

const OX_SH  = GY - 122;  // 340 — shoulder height
const OX_BCY = GY - 68;   // 394 — body center y
const OX_BRX = 64;
const OX_BRY = 30;
const OX1_CX = 784;
const OX2_CX = 928;

const SB_X1 = 1024;
const SB_X2 = 1186;
const SB_Y  = GY - 8;

const TM_CX = 706;

const FH1_X = 328;
const FH2_X = 514;

const SCOLS = ["#8a8278","#9a9288","#7a7068","#a8a098","#6e6860"] as const;

interface WStone { x: number; y: number; w: number; h: number; ci: number; }
const WALL_STONES: WStone[] = (() => {
  const arr: WStone[] = [];
  let row = 0;
  let rowY = WL_BOT;
  while (rowY > WL_TOP) {
    const rh = 14 + (row % 3) * 4;
    let rx = WL_X1 + (row % 2) * 18;
    while (rx < WL_X2 - 8) {
      const sw = 28 + ((rx * 7 + row * 11) % 28);
      arr.push({ x: rx, y: rowY - rh, w: sw, h: rh, ci: (rx * 3 + row * 7) % 5 });
      rx += sw + 3;
    }
    rowY -= rh + 2;
    row++;
  }
  return arr;
})();

type GS3 = [number, number, number];
const GSTONES: GS3[] = [];
for (let i = 0; i < 14; i++) {
  GSTONES.push([WL_X2 + 22 + (i * 47) % 300, GY - 8 - (i * 13) % 20, 10 + (i * 6) % 18]);
}

type CL3 = [number, number, number];
const CLOUDS: CL3[] = [[210,58,1.3],[560,44,0.9],[870,68,1.5],[1140,52,1.1]];

const FPOSTS: number[] = [];
for (let px = 650; px < 1240; px += 72) FPOSTS.push(px);

type GT2 = [number, number];
const GTUFTS: GT2[] = [];
for (let i = 0; i < 26; i++) GTUFTS.push([82 + (i * 46) % 1100, i * 0.38]);

type BD3 = [number, number, number];
const BIRDS: BD3[] = [[322,104,0],[352,92,1.1],[378,108,2.0],[764,80,2.9]];

const CAPSTONES: number[] = [];
for (let cx = WL_X1 + 22; cx < WL_X2 - 10; cx += 44) CAPSTONES.push(cx);

export function StonewallBuilding() {
  const ref = useRef<HTMLDivElement>(null);
  const [vis, setVis] = useState(false);
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e?.isIntersecting) setVis(true); }, { threshold: 0.12 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!vis) return;
    const id = setInterval(() => setPhase(p => p + 0.016), 16);
    return () => clearInterval(id);
  }, [vis]);

  const chainSway = Math.sin(phase * 1.3) * 5;
  const sbBob     = Math.sin(phase * 2.6) * 2.5;
  const fh1Lift   = Math.sin(phase * 1.2) * 28 - 10;
  const fh2Place  = Math.sin(phase * 0.9 + 1.4) * 20;
  const tmStep    = Math.sin(phase * 2.6 + 0.6) * 12;

  const renderOx = (bcx: number, legOff: number) => {
    const blegY = OX_BCY + OX_BRY;
    const legA  = Math.sin(phase * 2.6 + legOff) * 18;
    const legB  = Math.sin(phase * 2.6 + legOff + Math.PI) * 18;
    const legC  = Math.sin(phase * 2.6 + legOff + Math.PI * 0.5) * 18;
    const legD  = Math.sin(phase * 2.6 + legOff + Math.PI * 1.5) * 18;
    const hb    = Math.sin(phase * 2.6 + legOff) * 3;
    const ts    = Math.sin(phase * 1.7 + legOff * 0.5) * 16;
    const hcx   = bcx - OX_BRX - 28;
    const hcy   = OX_SH + 22 + hb;
    return (
      <g key={bcx}>
        <ellipse cx={bcx} cy={GY + 4} rx={OX_BRX * 0.7} ry="8" fill="#1a3008" opacity="0.3" />
        <line x1={bcx + 24} y1={blegY} x2={bcx + 24 + legC * 0.5} y2={GY} stroke="#4a3820" strokeWidth="10" strokeLinecap="round" />
        <line x1={bcx + 40} y1={blegY} x2={bcx + 40 + legD * 0.5} y2={GY} stroke="#4a3820" strokeWidth="10" strokeLinecap="round" />
        <ellipse cx={bcx} cy={OX_BCY} rx={OX_BRX} ry={OX_BRY} fill="#5c4a30" stroke="#3c2c18" strokeWidth="2" />
        <ellipse cx={bcx - 12} cy={OX_BCY - 10} rx={OX_BRX * 0.65} ry={OX_BRY * 0.58} fill="#6c5a3c" opacity="0.45" />
        <path d={`M${bcx - OX_BRX + 8},${OX_BCY - OX_BRY + 8} Q${bcx - OX_BRX - 14},${OX_SH + 14} ${hcx + 14},${hcy - 6}`}
          fill="none" stroke="#5c4a30" strokeWidth="22" strokeLinecap="round" />
        <line x1={bcx - 20} y1={blegY} x2={bcx - 20 + legA * 0.55} y2={GY} stroke="#5c4a30" strokeWidth="10" strokeLinecap="round" />
        <line x1={bcx -  4} y1={blegY} x2={bcx -  4 + legB * 0.55} y2={GY} stroke="#5c4a30" strokeWidth="10" strokeLinecap="round" />
        <ellipse cx={hcx} cy={hcy} rx="20" ry="15" fill="#5c4a30" stroke="#3c2c18" strokeWidth="1.5" />
        <path d={`M${hcx + 10},${hcy - 14} Q${hcx},${hcy - 32} ${hcx - 12},${hcy - 18}`}
          fill="none" stroke="#c4a870" strokeWidth="4.5" strokeLinecap="round" />
        <path d={`M${hcx + 8},${hcy - 12} Q${hcx + 18},${hcy - 26} ${hcx + 24},${hcy - 14}`}
          fill="none" stroke="#c4a870" strokeWidth="4.5" strokeLinecap="round" />
        <circle cx={hcx - 8} cy={hcy - 3} r="3.5" fill="#1a1008" />
        <circle cx={hcx - 7} cy={hcy - 4} r="1.2" fill="white" opacity="0.7" />
        <ellipse cx={hcx - 16} cy={hcy + 8} rx="7" ry="5" fill="#4a3820" />
        <circle cx={hcx - 22} cy={hcy + 10} r="4" fill="none" stroke="#c89040" strokeWidth="2.5" />
        <path d={`M${bcx + OX_BRX - 6},${OX_BCY - 8} Q${bcx + OX_BRX + 18},${OX_BCY + 8} ${bcx + OX_BRX + 10 + ts * 0.6},${GY - 24}`}
          fill="none" stroke="#4a3820" strokeWidth="5" strokeLinecap="round" />
        <ellipse cx={bcx + OX_BRX + 10 + ts * 0.6} cy={GY - 18} rx="6" ry="8" fill="#7a6040" />
      </g>
    );
  };

  return (
    <div ref={ref} style={{ opacity: vis ? 1 : 0, transition: "opacity 1.2s ease", background: "#5080c0" }}
      className="w-full overflow-hidden" aria-label="New England dry-stone wall with ox team, Shrewsbury c.1840">
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" preserveAspectRatio="xMidYMid slice" style={{ display: "block" }}>
        <defs>
          <linearGradient id="sw-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3870b8" />
            <stop offset="55%" stopColor="#6098d8" />
            <stop offset="100%" stopColor="#a8cef0" />
          </linearGradient>
          <linearGradient id="sw-ground" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#72a030" />
            <stop offset="100%" stopColor="#4a7018" />
          </linearGradient>
          <linearGradient id="sw-hill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#508028" />
            <stop offset="100%" stopColor="#3a6018" />
          </linearGradient>
        </defs>

        <rect x="0" y="0" width={W} height={HZ + 40} fill="url(#sw-sky)" />

        <path d={`M0,${HZ + 22} Q180,${HZ - 18} 360,${HZ + 12} Q540,${HZ + 38} 720,${HZ + 4} Q900,${HZ - 28} 1080,${HZ + 10} Q1200,${HZ + 30} ${W},${HZ + 8} L${W},${H} L0,${H} Z`}
          fill="url(#sw-hill)" />
        <rect x="0" y={GY - 14} width={W} height={H - GY + 14} fill="url(#sw-ground)" />
        <rect x="0" y={GY + 4} width={W} height={H - GY - 4} fill="#3a5c14" opacity="0.5" />

        {CLOUDS.map(([cx, cy, sc], ci) => {
          const drift = (phase * 4) % W;
          const ox = ((cx - drift) % W + W) % W;
          return (
            <g key={ci}>
              <ellipse cx={ox} cy={cy} rx={54 * sc} ry={18 * sc} fill="white" opacity="0.92" />
              <ellipse cx={ox - 26 * sc} cy={cy + 6 * sc} rx={34 * sc} ry={14 * sc} fill="white" opacity="0.92" />
              <ellipse cx={ox + 30 * sc} cy={cy + 7 * sc} rx={38 * sc} ry={15 * sc} fill="white" opacity="0.92" />
            </g>
          );
        })}

        {/* distant farmhouse + barn */}
        <g opacity="0.85">
          <rect x="988" y={HZ + 2} width="52" height="38" fill="#d8c898" stroke="#a09060" strokeWidth="1" />
          <path d={`M984,${HZ + 2} L1014,${HZ - 26} L1044,${HZ + 2}`} fill="#8a4820" />
          <rect x="1038" y={HZ - 14} width="10" height="18" fill="#a06040" />
          <rect x="996"  y={HZ + 12} width="12" height="14" fill="#88aacc" stroke="#8a6040" strokeWidth="1" />
          <rect x="1022" y={HZ + 12} width="12" height="14" fill="#88aacc" stroke="#8a6040" strokeWidth="1" />
          <rect x="1054" y={HZ - 14} width="70" height="54" fill="#a02c10" />
          <path d={`M1050,${HZ - 14} L1089,${HZ - 46} L1128,${HZ - 14}`} fill="#6a1808" />
          <rect x="1072" y={HZ + 8} width="28" height="32" fill="#2a1408" />
        </g>

        {/* split-rail fence */}
        {FPOSTS.map((fx, fi) => {
          const nfx = FPOSTS[fi + 1] ?? (fx + 72);
          return (
            <g key={fi}>
              <line x1={fx} y1={HZ + 32} x2={fx} y2={HZ + 64} stroke="#7a5828" strokeWidth="4" strokeLinecap="round" />
              <line x1={fx} y1={HZ + 43} x2={nfx} y2={HZ + 45} stroke="#7a5828" strokeWidth="3" />
              <line x1={fx} y1={HZ + 56} x2={nfx} y2={HZ + 58} stroke="#7a5828" strokeWidth="3" />
            </g>
          );
        })}

        {/* grass tufts */}
        {GTUFTS.map(([gx, gph], gi) => {
          const sw = Math.sin(phase * 1.8 + gph) * 3;
          const gy2 = GY - 2 - (gi * 5) % 10;
          return (
            <g key={gi}>
              <line x1={gx}   y1={gy2} x2={gx + sw}           y2={gy2 - 12} stroke="#5a9020" strokeWidth="1.5" strokeLinecap="round" />
              <line x1={gx+5} y1={gy2} x2={gx + 5 + sw * 0.8} y2={gy2 - 10} stroke="#4a8018" strokeWidth="1.5" strokeLinecap="round" />
              <line x1={gx-3} y1={gy2} x2={gx - 3 + sw * 0.6} y2={gy2 - 8}  stroke="#6aa028" strokeWidth="1.5" strokeLinecap="round" />
            </g>
          );
        })}

        {/* dry-stone wall foundation */}
        <rect x={WL_X1 - 10} y={WL_BOT - 6} width={WL_X2 - WL_X1 + 20} height="14" rx="2" fill="#7a7068" />
        {WALL_STONES.map((s, si) => (
          <rect key={si} x={s.x} y={s.y} width={s.w} height={s.h} rx="2"
            fill={SCOLS[s.ci] ?? "#8a8278"} stroke="#5a5248" strokeWidth="0.8" />
        ))}
        {CAPSTONES.map((csx, csi) => (
          <ellipse key={csi} cx={csx} cy={WL_TOP + 4} rx="18" ry="5.5" fill="#9a9288" stroke="#6a6258" strokeWidth="1" />
        ))}
        <rect x={WL_X1} y={WL_BOT + 7} width={WL_X2 - WL_X1} height="7" rx="2" fill="#1a2808" opacity="0.22" />

        {/* loose ground stones near wall */}
        {GSTONES.map(([gsx, gsy, grx], gsi) => (
          <ellipse key={gsi} cx={gsx} cy={gsy} rx={grx} ry={grx * 0.6}
            fill={SCOLS[gsi % 5] ?? "#8a8278"} stroke="#5a5248" strokeWidth="0.8" />
        ))}

        {/* farmhand 1 — bending, lifting stone */}
        {(() => {
          const fx = FH1_X, fy = GY;
          const shX = fx + 32 + fh1Lift * 0.35;
          const shY = fy - 68;
          return (
            <g>
              <line x1={fx - 8} y1={fy - 28} x2={fx - 10} y2={fy} stroke="#2c2060" strokeWidth="8" strokeLinecap="round" />
              <line x1={fx + 8} y1={fy - 28} x2={fx +  8} y2={fy} stroke="#2c2060" strokeWidth="8" strokeLinecap="round" />
              <line x1={fx} y1={fy - 30} x2={shX} y2={shY} stroke="#8c3c1c" strokeWidth="12" strokeLinecap="round" />
              <line x1={shX} y1={shY} x2={fx + 18} y2={fy - 14} stroke="#c09060" strokeWidth="7" strokeLinecap="round" />
              <line x1={shX} y1={shY} x2={fx +  4} y2={fy - 12} stroke="#c09060" strokeWidth="7" strokeLinecap="round" />
              <ellipse cx={fx + 10} cy={fy - 11} rx="23" ry="12" fill="#8a8278" stroke="#5a5248" strokeWidth="1.5" />
              <ellipse cx={fx + 6}  cy={fy - 19} rx="15" ry="8"  fill="#9c9a90" opacity="0.5" />
              <ellipse cx={shX + 7} cy={shY - 16} rx="13" ry="15" fill="#c09060" />
              <ellipse cx={shX + 7} cy={shY - 30} rx="16" ry="6"  fill="#d4a840" stroke="#a07820" strokeWidth="1" />
              <rect x={shX - 3} y={shY - 47} width="21" height="18" rx="2" fill="#c89828" />
            </g>
          );
        })()}

        {/* farmhand 2 — placing stone on wall top */}
        {(() => {
          const fx = FH2_X, fy = GY;
          return (
            <g>
              <line x1={fx - 8} y1={fy - 56} x2={fx - 6} y2={fy} stroke="#2a4030" strokeWidth="8" strokeLinecap="round" />
              <line x1={fx + 8} y1={fy - 56} x2={fx + 8} y2={fy} stroke="#2a4030" strokeWidth="8" strokeLinecap="round" />
              <rect x={fx - 14} y={fy - 112} width="28" height="56" rx="5" fill="#3a7040" />
              <line x1={fx + 14} y1={fy - 100} x2={fx + 30 + fh2Place * 0.3} y2={WL_TOP}     stroke="#c09060" strokeWidth="7" strokeLinecap="round" />
              <line x1={fx - 14} y1={fy - 100} x2={fx - 26}                   y2={WL_TOP + 2} stroke="#c09060" strokeWidth="7" strokeLinecap="round" />
              <rect x={fx - 3} y={WL_TOP - 20} width="46" height="20" rx="3" fill="#8a8278" stroke="#5a5248" strokeWidth="1.5" />
              <ellipse cx={fx} cy={fy - 128} rx="14" ry="16" fill="#b87850" />
              <ellipse cx={fx} cy={fy - 143} rx="16" ry="5.5" fill="#1c3010" />
              <rect x={fx - 11} y={fy - 158} width="22" height="18" rx="3" fill="#1c3010" />
            </g>
          );
        })()}

        {/* yoke + chain */}
        {(() => {
          const yk1X = OX1_CX - OX_BRX - 22;
          const yk2X = OX2_CX - OX_BRX - 22;
          const yk1Y = OX_SH + 22 + Math.sin(phase * 2.6) * 3;
          const yk2Y = OX_SH + 22 + Math.sin(phase * 2.6 + Math.PI) * 3;
          const ykMX = (yk1X + yk2X) / 2;
          const ykMY = (yk1Y + yk2Y) / 2;
          return (
            <g>
              <line x1={yk1X} y1={yk1Y} x2={yk2X} y2={yk2Y} stroke="#7a5818" strokeWidth="11" strokeLinecap="round" />
              <line x1={yk1X} y1={yk1Y} x2={yk2X} y2={yk2Y} stroke="#c4902a" strokeWidth="7"  strokeLinecap="round" />
              <circle cx={yk1X + 8} cy={yk1Y} r="5" fill="#5a4010" stroke="#3a2808" strokeWidth="1" />
              <circle cx={yk2X + 8} cy={yk2Y} r="5" fill="#5a4010" stroke="#3a2808" strokeWidth="1" />
              <path d={`M${ykMX + 4},${ykMY} Q${SB_X1 - 80},${GY - 34 + chainSway} ${SB_X1 + 6},${SB_Y - 8}`}
                fill="none" stroke="#6a6060" strokeWidth="4" strokeDasharray="7 4" />
            </g>
          );
        })()}

        {renderOx(OX1_CX, 0)}
        {renderOx(OX2_CX, Math.PI)}

        {/* stone boat */}
        <g transform={`translate(0, ${sbBob})`}>
          <path d={`M${SB_X1},${SB_Y + 2} Q${SB_X1 + 10},${SB_Y + 14} ${SB_X2},${SB_Y + 10}`}
            fill="none" stroke="#5a3810" strokeWidth="7" strokeLinecap="round" />
          <path d={`M${SB_X1 + 10},${SB_Y + 6} Q${SB_X1 + 18},${SB_Y + 16} ${SB_X2 - 8},${SB_Y + 12}`}
            fill="none" stroke="#5a3810" strokeWidth="7" strokeLinecap="round" />
          <rect x={SB_X1 + 6} y={SB_Y - 10} width={SB_X2 - SB_X1 - 12} height="14" rx="2" fill="#7a5828" stroke="#5a4018" strokeWidth="1.5" />
          {[22, 56, 90, 122].map(px => (
            <line key={px} x1={SB_X1 + px} y1={SB_Y - 10} x2={SB_X1 + px} y2={SB_Y + 4} stroke="#5a4018" strokeWidth="1" opacity="0.5" />
          ))}
          <ellipse cx={SB_X1 + 68} cy={SB_Y - 32} rx="52" ry="30" fill="#8a8278" stroke="#5a5248" strokeWidth="2" />
          <ellipse cx={SB_X1 + 58} cy={SB_Y - 44} rx="34" ry="18" fill="#9c9a90" opacity="0.5" />
          <line x1={SB_X1 + 50} y1={SB_Y - 36} x2={SB_X1 + 70} y2={SB_Y - 22} stroke="#5a5248" strokeWidth="1" opacity="0.6" />
          <line x1={SB_X1 + 68} y1={SB_Y - 54} x2={SB_X1 + 84} y2={SB_Y - 36} stroke="#5a5248" strokeWidth="1" opacity="0.6" />
        </g>

        {/* teamster */}
        {(() => {
          const tx = TM_CX, ty = GY;
          return (
            <g>
              <line x1={tx - 6} y1={ty - 52} x2={tx - 6 + tmStep} y2={ty} stroke="#1a1868" strokeWidth="9" strokeLinecap="round" />
              <line x1={tx + 6} y1={ty - 52} x2={tx + 6 - tmStep} y2={ty} stroke="#1a1868" strokeWidth="9" strokeLinecap="round" />
              <rect x={tx - 14} y={ty - 110} width="28" height="60" rx="5" fill="#7c3c1c" />
              <line x1={tx + 14} y1={ty - 94} x2={tx + 56} y2={ty - 68} stroke="#c09060" strokeWidth="7" strokeLinecap="round" />
              <line x1={tx + 56} y1={ty - 68} x2={tx + 104} y2={ty - 44} stroke="#7a5020" strokeWidth="4.5" strokeLinecap="round" />
              <line x1={tx - 14} y1={ty - 96} x2={tx - 24} y2={ty - 70} stroke="#c09060" strokeWidth="7" strokeLinecap="round" />
              <ellipse cx={tx + 2} cy={ty - 124} rx="14" ry="16" fill="#c09060" />
              <ellipse cx={tx + 2} cy={ty - 138} rx="18" ry="6.5" fill="#2a1808" />
              <rect x={tx - 10} y={ty - 158} width="24" height="22" rx="3" fill="#2a1808" />
              <path d={`M${tx - 8},${ty - 110} Q${tx + 2},${ty - 102} ${tx + 10},${ty - 110}`}
                fill="#6a4820" stroke="#4a2c10" strokeWidth="1" />
            </g>
          );
        })()}

        {BIRDS.map(([bx, by, bph], bi) => {
          const fl = Math.sin(phase * 3.4 + bph) * 6;
          return (
            <g key={bi}>
              <path d={`M${bx},${by} Q${bx - 9},${by - fl} ${bx - 18},${by}`} fill="none" stroke="#2a4060" strokeWidth="1.5" />
              <path d={`M${bx},${by} Q${bx + 9},${by - fl} ${bx + 18},${by}`} fill="none" stroke="#2a4060" strokeWidth="1.5" />
            </g>
          );
        })}

        <text x={W / 2} y={H - 14} textAnchor="middle"
          fontFamily="'Georgia', serif" fontSize="13" letterSpacing="3" fill="#1e3810" opacity="0.85">
          SHREWSBURY · NEW ENGLAND DRY-STONE WALL · OXEN TEAM · c. 1840
        </text>
      </svg>
    </div>
  );
}
