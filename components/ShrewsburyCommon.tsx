"use client";

// ShrewsburyCommon ─────────────────────────────────────────────────────────────
//
// Hand-illustrated scene: Shrewsbury Town Common in late-afternoon autumn light.
// White Congregational church with tall steeple (right), Victorian cast-iron
// gazebo (center), old elm trees with amber canopy, iron fence foreground,
// stone walk, flagpole, park bench. Staggered IntersectionObserver reveal.
// Placed between About and WorkbenchTools.

import { useEffect, useRef, useState } from "react";

// Ground horizon Y
const HORIZON = 346;

// Elm tree definitions: [trunkCenterX, trunkW, trunkTop, trunkBase, cRadius, c1, c2]
type ElmDef = [number, number, number, number, number, string, string];
const ELMS: ElmDef[] = [
  [196,  26, 254, 398, 130, "#d07010", "#8c3c08"],   // large left
  [476,  20, 282, 386, 104, "#c46808", "#844008"],   // center-left
  [824,  22, 274, 382,  98, "#cc700a", "#8c4408"],   // center-right
  [1276, 28, 244, 396, 126, "#d07818", "#8a4808"],   // large right
];

// Church geometry
const CH_X = 896;   // nave left
const CH_W = 196;   // nave width
const CH_FLOOR = 398;
const CH_ROOF  = 264;   // nave wall top (where gabled roof starts)
const TW_X = 952;   // tower left
const TW_W = 68;    // tower width
const TW_BOT = 264; // tower base (= nave wall top)
const TW_TOP = 148; // tower/belfry base
const SP_TIP = 58;  // spire tip Y

// Gazebo geometry
const GX  = 628;
const GY  = 356; // eave level
const GH  = 58;  // post height below eave
const GR  = 88;  // half-span of eave

// Fence
const FY1 = 416; // top rail
const FY2 = 426; // bottom rail
const FX1 = 248;
const FX2 = 1228;
const GATE_X1 = 638;  // gate opening
const GATE_X2 = 672;

// Park bench center
const BX = 342;
const BY = 396;

// Flagpole
const FPX = 682;

// Far tree bumps at horizon
const HORIZON_BUMPS: [number, number, number, number][] = [
  [72,  335, 52, 22], [164, 328, 44, 18], [248, 332, 56, 24],
  [336, 326, 40, 16], [414, 330, 50, 20], [512, 324, 46, 18],
  [586, 328, 52, 22], [784, 326, 44, 18], [856, 330, 48, 20],
  [944, 325, 54, 22], [1022, 329, 42, 16], [1096, 325, 50, 20],
  [1168, 328, 46, 18], [1252, 324, 56, 24], [1342, 328, 44, 18],
];

// Fence picket X positions (skip gate)
const PICKET_XS = Array.from({ length: Math.floor((FX2 - FX1) / 18) }, (_, i) => {
  const x = FX1 + i * 18;
  return (x < GATE_X1 || x > GATE_X2) ? x : null;
}).filter((x): x is number => x !== null);

// Ground scattered leaf dots [x, y, r, fill]
const LEAVES: [number, number, number, string][] = [
  [310, 424, 5, "#c86010"], [354, 438, 4, "#d4780a"], [400, 420, 6, "#b84808"],
  [450, 432, 4, "#e08020"], [510, 426, 5, "#c86010"], [560, 440, 4, "#d4780a"],
  [720, 428, 5, "#b84808"], [768, 436, 4, "#e08020"], [820, 422, 6, "#c86010"],
  [880, 434, 4, "#d4780a"], [940, 428, 5, "#b84808"], [1000, 438, 4, "#c86010"],
  [1060, 424, 6, "#d4780a"], [1120, 432, 4, "#e08020"], [1180, 426, 5, "#b84808"],
];

// Small birds in sky [x, y]
const BIRDS: [number, number][] = [
  [340, 112], [360, 104], [440, 88], [520, 118], [1060, 96], [1090, 108],
];

export function ShrewsburyCommon() {
  const [active, setActive] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e?.isIntersecting) { setActive(true); obs.disconnect(); } },
      { threshold: 0.12 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const tr = (d: number) => active ? `opacity 0.68s ease ${d}s` : "none";

  return (
    <div ref={ref} style={{ position: "relative", overflow: "hidden" }}>
      <svg
        viewBox="0 0 1440 560"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ display: "block", width: "100%", height: "auto" }}
        role="img"
        aria-label="Shrewsbury Town Common — white Congregational church, Victorian gazebo, autumn elm trees"
      >
        <defs>
          <linearGradient id="sc-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#f4e8d0"/>
            <stop offset="55%"  stopColor="#f0d890"/>
            <stop offset="100%" stopColor="#e8c060"/>
          </linearGradient>
          <linearGradient id="sc-ground" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#9ab870"/>
            <stop offset="100%" stopColor="#7a9850"/>
          </linearGradient>
          <radialGradient id="sc-sun-glow" cx="80%" cy="30%" r="60%">
            <stop offset="0%"   stopColor="rgba(255,220,100,.28)"/>
            <stop offset="100%" stopColor="rgba(255,220,100,0)"/>
          </radialGradient>
          <linearGradient id="sc-white-wall" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#f8f4ee"/>
            <stop offset="100%" stopColor="#ece8e0"/>
          </linearGradient>
          <linearGradient id="sc-steeple" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#f0ecE4"/>
            <stop offset="100%" stopColor="#dcdad0"/>
          </linearGradient>
          <filter id="sc-blur-sm"><feGaussianBlur stdDeviation="2"/></filter>
        </defs>

        {/* ── SKY ── */}
        <rect x="0" y="0" width="1440" height="560" fill="url(#sc-sky)"
          style={{ opacity: active ? 1 : 0, transition: tr(0) }}/>
        {/* Sun-glow from upper right */}
        <rect x="0" y="0" width="1440" height="560" fill="url(#sc-sun-glow)"
          style={{ opacity: active ? 1 : 0, transition: tr(0.02) }}/>

        {/* ── WISPY CLOUDS ── */}
        <g filter="url(#sc-blur-sm)"
          style={{ opacity: active ? 0.65 : 0, transition: tr(0.05) }}>
          <ellipse cx="280"  cy="80"  rx="120" ry="22" fill="rgba(255,255,255,.70)"/>
          <ellipse cx="360"  cy="72"  rx="80"  ry="16" fill="rgba(255,255,255,.50)"/>
          <ellipse cx="820"  cy="60"  rx="140" ry="20" fill="rgba(255,255,255,.65)"/>
          <ellipse cx="920"  cy="52"  rx="90"  ry="14" fill="rgba(255,255,255,.45)"/>
          <ellipse cx="1140" cy="78"  rx="100" ry="18" fill="rgba(255,255,255,.55)"/>
        </g>

        {/* ── SMALL BIRDS ── */}
        <g fill="none" stroke="rgba(80,50,20,.40)" strokeWidth="1.2" strokeLinecap="round"
          style={{ opacity: active ? 1 : 0, transition: tr(0.07) }}>
          {BIRDS.map(([x, y], i) => (
            <g key={i}>
              <path d={`M ${x-5} ${y} Q ${x} ${y-4} ${x+5} ${y}`}/>
            </g>
          ))}
        </g>

        {/* ── FAR HORIZON TREE LINE ── */}
        <g filter="url(#sc-blur-sm)"
          style={{ opacity: active ? 1 : 0, transition: tr(0.06) }}>
          {HORIZON_BUMPS.map(([cx, cy, rx, ry], i) => (
            <ellipse key={i} cx={cx} cy={cy} rx={rx} ry={ry}
              fill="#9aac68" opacity="0.38"/>
          ))}
        </g>

        {/* ── GROUND PLANE ── */}
        <path d={`M 0 ${HORIZON} Q 360 ${HORIZON-10}, 720 ${HORIZON+4} Q 1080 ${HORIZON+10}, 1440 ${HORIZON-6} L 1440 560 L 0 560 Z`}
          fill="url(#sc-ground)"
          style={{ opacity: active ? 1 : 0, transition: tr(0.04) }}/>
        {/* Ground highlight near horizon */}
        <path d={`M 0 ${HORIZON} Q 720 ${HORIZON-16}, 1440 ${HORIZON} L 1440 ${HORIZON+30} L 0 ${HORIZON+30} Z`}
          fill="rgba(168,210,110,.30)"
          style={{ opacity: active ? 1 : 0, transition: tr(0.04) }}/>

        {/* ── STONE PATH TO GAZEBO ── */}
        <path d={`M 580 560 Q 600 480, 618 ${GY + GH + 10}`}
          stroke="rgba(190,180,160,.52)" strokeWidth="26"
          strokeLinecap="round"
          style={{ opacity: active ? 1 : 0, transition: tr(0.12) }}/>
        {/* Path stones */}
        {[540, 510, 478, 448, 420, 396].map((y, i) => (
          <ellipse key={i}
            cx={602 - i * 2} cy={y} rx={10} ry={4}
            fill="rgba(190,178,155,.60)"
            style={{ opacity: active ? 1 : 0, transition: tr(0.14) }}/>
        ))}

        {/* ── ELM TREES ── */}
        {ELMS.map(([tx, tw, tt, tb, cr, c1, c2], i) => (
          <g key={i} style={{ opacity: active ? 1 : 0, transition: tr(0.10 + i * 0.04) }}>
            {/* Shadow mass */}
            <ellipse cx={tx - 20} cy={tt + (tb - tt) * 0.28 + 22} rx={cr * 0.72} ry={cr * 0.44}
              fill={c2} opacity="0.66"/>
            {/* Secondary mass */}
            <ellipse cx={tx + 14} cy={tt + (tb - tt) * 0.28 + 10} rx={cr * 0.68} ry={cr * 0.42}
              fill={c2} opacity="0.50"/>
            {/* Main canopy */}
            <ellipse cx={tx} cy={tt + (tb - tt) * 0.28} rx={cr} ry={cr * 0.62}
              fill={c1}/>
            {/* Sunlight highlight (upper right) */}
            <ellipse cx={tx + 24} cy={tt + (tb - tt) * 0.28 - 18} rx={cr * 0.54} ry={cr * 0.32}
              fill="rgba(235,178,60,.34)"/>
            {/* Trunk */}
            <rect x={tx - tw / 2} y={tt + (tb - tt) * 0.52} width={tw} height={tb - tt - (tb - tt) * 0.52} rx="3"
              fill="#5c2c0a"/>
            {/* Root spread */}
            <ellipse cx={tx} cy={tb} rx={tw * 1.9} ry="5" fill="#4a2208" opacity="0.55"/>
          </g>
        ))}

        {/* ── CHURCH ── */}
        <g style={{ opacity: active ? 1 : 0, transition: tr(0.10) }}>
          {/* Nave shadow (right) */}
          <rect x={CH_X + CH_W - 14} y={CH_ROOF} width="14" height={CH_FLOOR - CH_ROOF}
            fill="rgba(0,0,0,.12)"/>
          {/* Nave body */}
          <rect x={CH_X} y={CH_ROOF} width={CH_W} height={CH_FLOOR - CH_ROOF}
            fill="url(#sc-white-wall)"/>
          {/* Nave gabled roof */}
          <polygon
            points={`${CH_X},${CH_ROOF} ${CH_X + CH_W / 2},${CH_ROOF - 44} ${CH_X + CH_W},${CH_ROOF}`}
            fill="#8a9080"/>
          <polygon
            points={`${CH_X},${CH_ROOF} ${CH_X + CH_W / 2},${CH_ROOF - 44} ${CH_X + CH_W},${CH_ROOF}`}
            fill="none" stroke="rgba(255,255,255,.30)" strokeWidth="1"/>
          {/* Nave arched windows (2) */}
          {[CH_X + 28, CH_X + 120].map((wx, i) => (
            <g key={i}>
              <rect x={wx} y={CH_ROOF + 28} width="32" height="44" rx="16"
                fill="rgba(180,210,240,.50)" stroke="rgba(200,195,188,.70)" strokeWidth="1.5"/>
              <line x1={wx + 16} y1={CH_ROOF + 28} x2={wx + 16} y2={CH_ROOF + 72}
                stroke="rgba(200,195,188,.50)" strokeWidth="0.8"/>
            </g>
          ))}
          {/* Nave entrance door (arched) */}
          <rect x={CH_X + CH_W / 2 - 16} y={CH_FLOOR - 54} width="32" height="54" rx="16"
            fill="rgba(60,35,15,.65)"/>
          {/* Entry steps */}
          <rect x={CH_X + CH_W / 2 - 26} y={CH_FLOOR}     width="52" height="6" rx="1" fill="rgba(220,214,200,.80)"/>
          <rect x={CH_X + CH_W / 2 - 22} y={CH_FLOOR + 6} width="44" height="5" rx="1" fill="rgba(210,204,190,.70)"/>

          {/* Tower body */}
          <rect x={TW_X} y={TW_TOP} width={TW_W} height={TW_BOT - TW_TOP}
            fill="url(#sc-white-wall)"/>
          {/* Tower shadow side */}
          <rect x={TW_X + TW_W - 10} y={TW_TOP} width="10" height={TW_BOT - TW_TOP}
            fill="rgba(0,0,0,.10)"/>
          {/* Tower louver slats (belfry openings) */}
          {[TW_TOP + 14, TW_TOP + 22, TW_TOP + 30].map((sy, i) => (
            <rect key={i} x={TW_X + 10} y={sy} width={TW_W - 20} height="5" rx="2"
              fill="rgba(100,110,100,.30)"/>
          ))}
          {/* Tower cap molding */}
          <rect x={TW_X - 6} y={TW_TOP - 6} width={TW_W + 12} height="10" rx="2"
            fill="#dddbd2"/>
          {/* Octagonal belfry transition */}
          <polygon
            points={`
              ${TW_X + 8},${TW_TOP - 6}
              ${TW_X + TW_W - 8},${TW_TOP - 6}
              ${TW_X + TW_W + 10},${TW_TOP - 26}
              ${TW_X + TW_W + 10},${TW_TOP - 52}
              ${TW_X - 10},${TW_TOP - 52}
              ${TW_X - 10},${TW_TOP - 26}
            `}
            fill="url(#sc-steeple)"/>
          {/* Spire */}
          <polygon
            points={`
              ${TW_X - 10},${TW_TOP - 52}
              ${TW_X + TW_W + 10},${TW_TOP - 52}
              ${TW_X + TW_W / 2},${SP_TIP + 10}
            `}
            fill="url(#sc-steeple)"/>
          {/* Spire shadow edge */}
          <line
            x1={TW_X + TW_W + 10} y1={TW_TOP - 52}
            x2={TW_X + TW_W / 2} y2={SP_TIP + 10}
            stroke="rgba(0,0,0,.14)" strokeWidth="1"/>
          {/* Finial cross */}
          <line x1={TW_X + TW_W / 2} y1={SP_TIP - 2}  x2={TW_X + TW_W / 2} y2={SP_TIP + 14}
            stroke="rgba(200,195,188,.90)" strokeWidth="2.5" strokeLinecap="round"/>
          <line x1={TW_X + TW_W / 2 - 7} y1={SP_TIP + 4} x2={TW_X + TW_W / 2 + 7} y2={SP_TIP + 4}
            stroke="rgba(200,195,188,.90)" strokeWidth="2.5" strokeLinecap="round"/>
        </g>

        {/* ── GAZEBO ── */}
        <g style={{ opacity: active ? 1 : 0, transition: tr(0.13) }}>
          {/* Posts (5 visible) */}
          {[-GR, -GR / 2, 0, GR / 2, GR].map((dx, i) => (
            <line key={i}
              x1={GX + dx} y1={GY}
              x2={GX + dx} y2={GY + GH}
              stroke="#2a2e24" strokeWidth="5" strokeLinecap="round"/>
          ))}
          {/* Railing upper */}
          <line x1={GX - GR} y1={GY + 20} x2={GX + GR} y2={GY + 20}
            stroke="#2a2e24" strokeWidth="2.5"/>
          {/* Railing lower */}
          <line x1={GX - GR} y1={GY + 42} x2={GX + GR} y2={GY + 42}
            stroke="#2a2e24" strokeWidth="2.5"/>
          {/* Railing spindles */}
          {Array.from({ length: 9 }, (_, i) => {
            const sx = GX - GR + 20 + i * 18;
            return (
              <line key={i}
                x1={sx} y1={GY + 20} x2={sx} y2={GY + 42}
                stroke="#2a2e24" strokeWidth="1.5"/>
            );
          })}
          {/* Hip roof */}
          <polygon
            points={`${GX - GR},${GY} ${GX - GR / 2},${GY - 22} ${GX},${GY - 48} ${GX + GR / 2},${GY - 22} ${GX + GR},${GY}`}
            fill="#3a3e30"/>
          {/* Roof highlight */}
          <polygon
            points={`${GX - GR},${GY} ${GX - GR / 2},${GY - 22} ${GX},${GY - 48} ${GX + GR / 2},${GY - 22} ${GX + GR},${GY}`}
            fill="none" stroke="rgba(255,255,255,.12)" strokeWidth="1"/>
          {/* Roof ridge drip-edge */}
          <line x1={GX - GR - 4} y1={GY + 2} x2={GX + GR + 4} y2={GY + 2}
            stroke="#2a2e24" strokeWidth="3" strokeLinecap="round"/>
          {/* Cupola */}
          <rect x={GX - 10} y={GY - 62} width="20" height="16" rx="2"
            fill="#3a3e30"/>
          <polygon
            points={`${GX - 14},${GY - 62} ${GX},${GY - 80} ${GX + 14},${GY - 62}`}
            fill="#3a3e30"/>
          {/* Finial ball */}
          <circle cx={GX} cy={GY - 83} r="4" fill="#2a2e24"/>
          {/* Floor */}
          <line x1={GX - GR} y1={GY + GH} x2={GX + GR} y2={GY + GH}
            stroke="#3a3224" strokeWidth="4" strokeLinecap="round"/>
        </g>

        {/* ── FLAGPOLE ── */}
        <g style={{ opacity: active ? 1 : 0, transition: tr(0.14) }}>
          <line x1={FPX} y1={130} x2={FPX} y2={400}
            stroke="rgba(160,150,130,.80)" strokeWidth="2.5" strokeLinecap="round"/>
          {/* Flag */}
          <rect x={FPX + 2} y={130} width={44} height={28} rx="1"
            fill="#c8281a"/>
          <rect x={FPX + 2} y={130} width={44} height={10} rx="1"
            fill="#c8281a"/>
          <rect x={FPX + 2} y={140} width={44} height={8}
            fill="rgba(255,255,255,.85)"/>
          <rect x={FPX + 2} y={148} width={44} height={10}
            fill="#c8281a"/>
          {/* Canton (blue field) */}
          <rect x={FPX + 2} y={130} width={18} height={16}
            fill="#1a2a6c" opacity="0.85"/>
          {/* Halyard */}
          <line x1={FPX} y1={130} x2={FPX + 2} y2={130}
            stroke="rgba(160,150,130,.60)" strokeWidth="1"/>
          {/* Base cleat */}
          <circle cx={FPX} cy={398} r="5" fill="rgba(160,150,130,.50)"/>
        </g>

        {/* ── PARK BENCH ── */}
        <g style={{ opacity: active ? 1 : 0, transition: tr(0.15) }}>
          {/* Seat */}
          <rect x={BX - 40} y={BY} width="80" height="6" rx="2" fill="#7a4818"/>
          {/* Back */}
          <rect x={BX - 38} y={BY - 22} width="76" height="5" rx="2" fill="#7a4818"/>
          <rect x={BX - 36} y={BY - 10} width="72" height="4" rx="2" fill="#7a4818"/>
          {/* Legs */}
          <line x1={BX - 28} y1={BY + 6} x2={BX - 28} y2={BY + 28}
            stroke="#6a3c14" strokeWidth="4" strokeLinecap="round"/>
          <line x1={BX + 28} y1={BY + 6} x2={BX + 28} y2={BY + 28}
            stroke="#6a3c14" strokeWidth="4" strokeLinecap="round"/>
          {/* Back posts */}
          <line x1={BX - 28} y1={BY + 6} x2={BX - 30} y2={BY - 28}
            stroke="#6a3c14" strokeWidth="3.5" strokeLinecap="round"/>
          <line x1={BX + 28} y1={BY + 6} x2={BX + 30} y2={BY - 28}
            stroke="#6a3c14" strokeWidth="3.5" strokeLinecap="round"/>
          {/* Ground shadow */}
          <ellipse cx={BX} cy={BY + 28} rx="46" ry="5" fill="rgba(0,0,0,.10)"/>
        </g>

        {/* ── IRON FENCE ── */}
        <g style={{ opacity: active ? 1 : 0, transition: tr(0.16) }}>
          <line x1={FX1} y1={FY1} x2={GATE_X1} y2={FY1}
            stroke="#2a2820" strokeWidth="2.5"/>
          <line x1={GATE_X2} y1={FY1} x2={FX2} y2={FY1}
            stroke="#2a2820" strokeWidth="2.5"/>
          <line x1={FX1} y1={FY2} x2={GATE_X1} y2={FY2}
            stroke="#2a2820" strokeWidth="2.5"/>
          <line x1={GATE_X2} y1={FY2} x2={FX2} y2={FY2}
            stroke="#2a2820" strokeWidth="2.5"/>
          {PICKET_XS.map((x, i) => (
            <g key={i}>
              <line x1={x} y1={FY1 - 10} x2={x} y2={FY2 + 6}
                stroke="#2a2820" strokeWidth="1.8"/>
              <circle cx={x} cy={FY1 - 12} r="2.5" fill="#2a2820"/>
            </g>
          ))}
          {/* Gate post piers */}
          <rect x={GATE_X1 - 6} y={FY1 - 18} width="12" height={FY2 - FY1 + 28} rx="2"
            fill="#3a3830"/>
          <rect x={GATE_X2 - 6} y={FY1 - 18} width="12" height={FY2 - FY1 + 28} rx="2"
            fill="#3a3830"/>
        </g>

        {/* ── GROUND LEAVES ── */}
        <g style={{ opacity: active ? 1 : 0, transition: tr(0.18) }}>
          {LEAVES.map(([x, y, r, fill], i) => (
            <ellipse key={i} cx={x} cy={y} rx={r} ry={r * 0.45}
              transform={`rotate(${(i * 37) % 90 - 45},${x},${y})`}
              fill={fill} opacity="0.65"/>
          ))}
        </g>

        {/* ── HEADER ── */}
        <text x="720" y="36" textAnchor="middle"
          fill="rgba(80,50,12,.35)" fontSize="9"
          fontFamily="monospace" letterSpacing="5"
          style={{ opacity: active ? 1 : 0, transition: tr(0.04) }}>
          SHREWSBURY TOWN COMMON
        </text>

        {/* ── CAPTION ── */}
        <g style={{ opacity: active ? 1 : 0, transition: tr(0.84) }}>
          <text x="720" y="530" textAnchor="middle"
            fill="rgba(70,45,10,.42)" fontSize="11.5"
            fontFamily="Georgia,'Times New Roman',serif"
            fontStyle="italic" letterSpacing="1.2">
            Where Shrewsbury gathers — where Route 9 Web Co. is rooted
          </text>
          <text x="720" y="549" textAnchor="middle"
            fill="rgba(60,38,8,.24)" fontSize="8.5"
            fontFamily="monospace" letterSpacing="3.2">
            ESTABLISHED 1727 · WORCESTER COUNTY · MASSACHUSETTS
          </text>
        </g>
      </svg>
    </div>
  );
}
