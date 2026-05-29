"use client";
import { useEffect, useRef, useState } from "react";

// Pass 55: Victorian paddlewheel steamboat on Lake Quinsigamond — golden-hour, animated wheel + smoke, reflections

const W = 1440, H = 580;
const HORIZON_Y = 252;
const WATER_Y = HORIZON_Y + 2;

// ─── Sky ───────────────────────────────────────────────────────────────────
// Far shoreline silhouette (gentle hills + treeline)
const SHORE_D =
  "M 0,238 " +
  "C 80,228 160,232 230,224 C 300,216 360,228 440,220 C 520,212 580,218 650,214 " +
  "C 720,210 790,218 860,212 C 930,206 1000,216 1080,210 " +
  "C 1160,204 1240,214 1320,208 C 1380,204 1420,210 1440,208 " +
  "L 1440,254 L 0,254 Z";

// Far shore trees (distant silhouette)
type FTree = [number, number, number];
const FAR_TREES: FTree[] = [
  [42,228,14],[88,222,12],[136,226,16],[188,220,13],[238,224,15],[296,218,12],
  [344,222,14],[402,216,13],[458,220,15],[518,214,12],[572,218,14],[632,212,13],
  [688,216,15],[748,210,12],[808,214,14],[868,208,12],[928,212,16],[988,206,13],
  [1048,210,15],[1108,204,12],[1168,208,14],[1228,206,12],[1288,210,15],[1348,206,12],
  [1398,208,13],
];

// ─── Water ────────────────────────────────────────────────────────────────
// Ripple rows
const RIPPLE_YS = [262, 278, 296, 316, 338, 362, 390, 422, 458];

// ─── Steamboat ────────────────────────────────────────────────────────────
const HULL_CX = 660;
const HULL_Y   = 210; // waterline
const HULL_W   = 520;
const HULL_H   = 62;
const HULL_L   = HULL_CX - HULL_W / 2;
const HULL_R   = HULL_CX + HULL_W / 2;

// Hull shape: slightly pointed bow (right), rounded stern (left)
const HULL_D = `M ${HULL_L + 28},${HULL_Y + HULL_H} ` +
  `L ${HULL_L},${HULL_Y + HULL_H - 10} ` +
  `L ${HULL_L + 12},${HULL_Y + 12} ` +
  `L ${HULL_R - 32},${HULL_Y + 12} ` +
  `L ${HULL_R + 12},${HULL_Y + HULL_H / 2} ` +
  `L ${HULL_R},${HULL_Y + HULL_H} Z`;

// Waterline stripe
const WL_Y = HULL_Y + HULL_H - 14;

// Main deck (first superstructure level)
const DECK1_X = HULL_L + 22, DECK1_W = HULL_W - 60;
const DECK1_Y = HULL_Y + 10, DECK1_H = 42;

// Promenade deck (second level)
const DECK2_X = DECK1_X + 28, DECK2_W = DECK1_W - 80;
const DECK2_Y = DECK1_Y - 36, DECK2_H = 38;

// Pilot house
const PILOT_X = DECK2_X + 82, PILOT_W = 84;
const PILOT_Y = DECK2_Y - 40, PILOT_H = 40;

// Smokestack
const STK_CX = HULL_CX - 32;
const STK_X = STK_CX - 11, STK_W = 22;
const STK_Y1 = PILOT_Y - 92, STK_Y2 = PILOT_Y - 12;

// Second (thinner) stack
const STK2_CX = HULL_CX + 16;
const STK2_X = STK2_CX - 7, STK2_W = 14;
const STK2_Y1 = PILOT_Y - 72, STK2_Y2 = PILOT_Y - 4;

// Paddlewheel (starboard side, right of hull)
const PW_CX = HULL_R - 18, PW_CY = HULL_Y + HULL_H - 22;
const PW_R_OUT = 48, PW_R_IN = 14;
const PW_BLADES = 12;
const PW_BLADE_W = 9;

// Paddlewheel blades
type Blade = { d: string };
const BLADES: Blade[] = Array.from({ length: PW_BLADES }, (_, i) => {
  const a = (i * 360 / PW_BLADES) * Math.PI / 180;
  const a2 = ((i * 360 / PW_BLADES) + 6) * Math.PI / 180;
  const s1 = Math.sin(a), c1 = Math.cos(a);
  const s2 = Math.sin(a2), c2 = Math.cos(a2);
  const hw = PW_BLADE_W / 2;
  const ox1 = (PW_R_OUT * c1 - hw * s1).toFixed(1);
  const oy1 = (PW_R_OUT * s1 + hw * c1).toFixed(1);
  const ox2 = (PW_R_OUT * c2 + hw * s2).toFixed(1);
  const oy2 = (PW_R_OUT * s2 - hw * c2).toFixed(1);
  const ix1 = (PW_R_IN  * c1 - hw * s1).toFixed(1);
  const iy1 = (PW_R_IN  * s1 + hw * c1).toFixed(1);
  const ix2 = (PW_R_IN  * c2 + hw * s2).toFixed(1);
  const iy2 = (PW_R_IN  * s2 - hw * c2).toFixed(1);
  return {
    d: `M ${PW_CX + parseFloat(ox1)},${PW_CY + parseFloat(oy1)} ` +
       `L ${PW_CX + parseFloat(ox2)},${PW_CY + parseFloat(oy2)} ` +
       `L ${PW_CX + parseFloat(ix2)},${PW_CY + parseFloat(iy2)} ` +
       `L ${PW_CX + parseFloat(ix1)},${PW_CY + parseFloat(iy1)} Z`,
  };
});

// Wheel housing (box over the paddlewheel)
const WH_X = PW_CX - PW_R_OUT - 6, WH_W = (PW_R_OUT + 6) * 2;
const WH_Y = HULL_Y + HULL_H - 48, WH_H = 30;

// Porthole windows on hull
type Port = [number, number];
const PORTHOLES: Port[] = [
  [HULL_L + 56, HULL_Y + 32],
  [HULL_L + 96, HULL_Y + 32],
  [HULL_L + 136, HULL_Y + 32],
  [HULL_L + 180, HULL_Y + 32],
  [HULL_L + 224, HULL_Y + 32],
  [HULL_L + 268, HULL_Y + 32],
  [HULL_L + 312, HULL_Y + 32],
  [HULL_L + 356, HULL_Y + 32],
];

// Deck railings (vertical stanchions on each deck)
const RAIL1_POSTS = Array.from({ length: 20 }, (_, i) =>
  Math.round(DECK1_X + 8 + i * (DECK1_W - 16) / 19)
);
const RAIL2_POSTS = Array.from({ length: 14 }, (_, i) =>
  Math.round(DECK2_X + 6 + i * (DECK2_W - 12) / 13)
);

// Bunting flags (festive triangular pennants)
type Flag = [number, number, number, number, string]; // x1,y1 x2,y2 color
const FLAGS: Flag[] = [
  [DECK2_X + 8,  DECK2_Y,     DECK2_X + 32, DECK2_Y, "#e03020"],
  [DECK2_X + 32, DECK2_Y,     DECK2_X + 56, DECK2_Y, "#2050c8"],
  [DECK2_X + 56, DECK2_Y,     DECK2_X + 80, DECK2_Y, "#f0c020"],
  [DECK2_X + 80, DECK2_Y,     DECK2_X + 104,DECK2_Y, "#e03020"],
  [DECK2_X + 104,DECK2_Y,     DECK2_X + 128,DECK2_Y, "#2050c8"],
  [DECK2_X + 128,DECK2_Y,     DECK2_X + 152,DECK2_Y, "#f0c020"],
  [DECK2_X + 152,DECK2_Y,     DECK2_X + 176,DECK2_Y, "#e03020"],
  [DECK2_X + 176,DECK2_Y,     DECK2_X + 200,DECK2_Y, "#2050c8"],
  [DECK2_X + 200,DECK2_Y,     DECK2_X + 224,DECK2_Y, "#f0c020"],
  [DECK2_X + 224,DECK2_Y,     DECK2_X + DECK2_W - 8, DECK2_Y, "#e03020"],
];

// Mast and flag pennant
const MAST_X = PILOT_X + PILOT_W / 2;
const MAST_Y1 = PILOT_Y - 56, MAST_Y2 = PILOT_Y;

// Pennant flag at mast tip
const PEN_D = `M ${MAST_X},${MAST_Y1} L ${MAST_X + 32},${MAST_Y1 + 10} L ${MAST_X},${MAST_Y1 + 20} Z`;

// ─── Smoke puffs ──────────────────────────────────────────────────────────
type Puff = { cx: number; cy: number; r: number; delay: number };
const SMOKE_PUFFS: Puff[] = [
  { cx: STK_CX - 4,  cy: STK_Y1 - 12, r: 14, delay: 0    },
  { cx: STK_CX + 8,  cy: STK_Y1 - 32, r: 20, delay: 0.5  },
  { cx: STK_CX - 6,  cy: STK_Y1 - 54, r: 26, delay: 1.0  },
  { cx: STK_CX + 14, cy: STK_Y1 - 80, r: 32, delay: 1.5  },
  { cx: STK_CX - 2,  cy: STK_Y1 - 110,r: 38, delay: 2.0  },
  { cx: STK2_CX + 4, cy: STK2_Y1 - 10,r: 10, delay: 0.3  },
  { cx: STK2_CX - 6, cy: STK2_Y1 - 26,r: 15, delay: 0.9  },
  { cx: STK2_CX + 8, cy: STK2_Y1 - 46,r: 20, delay: 1.6  },
];

// ─── Water reflection ─────────────────────────────────────────────────────
// Mirror of hull bottom half, flipped at waterline, with wavy distortion
const REFL_HULL_D = `M ${HULL_L + 28},${HULL_Y + HULL_H + 4} ` +
  `L ${HULL_L},${HULL_Y + HULL_H + 14} ` +
  `L ${HULL_L + 12},${HULL_Y + HULL_H + 52} ` +
  `L ${HULL_R - 32},${HULL_Y + HULL_H + 52} ` +
  `L ${HULL_R + 12},${HULL_Y + HULL_H + 30} ` +
  `L ${HULL_R},${HULL_Y + HULL_H + 4} Z`;

// Reflection shimmer lines
type Shimmer = [number, number, number, number];
const REFL_SHIMMER: Shimmer[] = [
  [HULL_L + 40,  WATER_Y + 28, HULL_R - 40,  WATER_Y + 28],
  [HULL_L + 60,  WATER_Y + 44, HULL_R - 50,  WATER_Y + 44],
  [HULL_L + 80,  WATER_Y + 62, HULL_R - 70,  WATER_Y + 62],
  [HULL_L + 50,  WATER_Y + 80, HULL_R - 60,  WATER_Y + 80],
  [HULL_L + 30,  WATER_Y + 100,HULL_R - 30,  WATER_Y + 100],
];

// Wake ripples (V-shape emanating from bow)
const BOW_X = HULL_R + 12, BOW_Y = HULL_Y + HULL_H / 2;
type Wake = { d: string; opacity: number };
const WAKES: Wake[] = Array.from({ length: 5 }, (_, i) => ({
  d: `M ${BOW_X + i * 18},${BOW_Y - 2} ` +
     `Q ${BOW_X + 60 + i * 36},${BOW_Y + 14 + i * 6} ` +
     `${BOW_X + 120 + i * 54},${BOW_Y + 8 + i * 4}`,
  opacity: 0.7 - i * 0.12,
}));

// ─── Rowing boat (foreground) ─────────────────────────────────────────────
const ROW_X = 180, ROW_Y = WATER_Y + 82;
const ROWBOAT_D = `M ${ROW_X - 34},${ROW_Y + 12} C ${ROW_X - 40},${ROW_Y + 4} ${ROW_X + 30},${ROW_Y + 2} ${ROW_X + 44},${ROW_Y + 12} L ${ROW_X + 38},${ROW_Y + 22} L ${ROW_X - 28},${ROW_Y + 22} Z`;
// Oar
const OAR_D = `M ${ROW_X - 12},${ROW_Y + 14} L ${ROW_X - 54},${ROW_Y + 38}`;

// ─── Lily pads (foreground water feature) ─────────────────────────────────
type Lily = [number, number, number];
const LILIES: Lily[] = [
  [124, WATER_Y + 140, 10],
  [148, WATER_Y + 152, 8],
  [108, WATER_Y + 162, 9],
  [1280, WATER_Y + 118, 9],
  [1308, WATER_Y + 130, 11],
  [1294, WATER_Y + 148, 8],
];

export function SteamboatScene() {
  const ref = useRef<SVGSVGElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setActive(true); obs.disconnect(); } },
      { threshold: 0.12 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const tr = (d: number) =>
    active ? `opacity 0.7s ease ${d}s, transform 0.7s ease ${d}s` : "none";

  return (
    <section
      aria-label="Victorian paddlewheel steamboat on Lake Quinsigamond at golden hour"
      style={{ background: "#0a1828", overflow: "hidden" }}
    >
      <style>{`
        @keyframes sbs-wheel {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes sbs-smoke {
          0%   { transform: translateY(0px) scale(1);   opacity: 0.72; }
          60%  { transform: translateY(-28px) scale(1.18); opacity: 0.42; }
          100% { transform: translateY(-52px) scale(1.4);  opacity: 0; }
        }
        @keyframes sbs-ripple {
          0%,100% { transform: scaleX(1);    opacity: 0.4; }
          50%      { transform: scaleX(1.04); opacity: 0.6; }
        }
        @keyframes sbs-flag {
          0%,100% { transform: skewX(0deg);  }
          50%      { transform: skewX(-8deg); }
        }
        @keyframes sbs-bob {
          0%,100% { transform: translateY(0px); }
          50%      { transform: translateY(3px); }
        }
        .sbs-wheel {
          animation: ${active ? "sbs-wheel 2.8s linear infinite" : "none"};
          transform-origin: ${PW_CX}px ${PW_CY}px;
        }
        .sbs-bob {
          animation: ${active ? "sbs-bob 4s ease-in-out infinite" : "none"};
        }
        .sbs-pen {
          animation: ${active ? "sbs-flag 1.8s ease-in-out infinite" : "none"};
          transform-origin: ${MAST_X}px ${MAST_Y1}px;
        }
      `}</style>

      <svg
        ref={ref}
        viewBox={`0 0 ${W} ${H}`}
        width="100%"
        preserveAspectRatio="xMidYMid meet"
        aria-hidden="true"
        style={{ display: "block", maxHeight: 580 }}
      >
        <defs>
          {/* Golden-hour sky */}
          <linearGradient id="sbs-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#1a2a4a" />
            <stop offset="28%"  stopColor="#6a3a18" />
            <stop offset="58%"  stopColor="#e87820" />
            <stop offset="82%"  stopColor="#f0a830" />
            <stop offset="100%" stopColor="#e89030" />
          </linearGradient>
          {/* Sun glow */}
          <radialGradient id="sbs-sun" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="#fff8c0" stopOpacity="1" />
            <stop offset="30%"  stopColor="#f8d040" stopOpacity="0.8" />
            <stop offset="70%"  stopColor="#f08820" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#e06010" stopOpacity="0" />
          </radialGradient>
          {/* Lake water */}
          <linearGradient id="sbs-water" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#c87820" />
            <stop offset="20%"  stopColor="#7a4810" />
            <stop offset="60%"  stopColor="#2a1c0c" />
            <stop offset="100%" stopColor="#0e1018" />
          </linearGradient>
          {/* Hull (white with dark stripe) */}
          <linearGradient id="sbs-hull" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#f8f0e0" />
            <stop offset="60%"  stopColor="#e8d8b8" />
            <stop offset="100%" stopColor="#c8b890" />
          </linearGradient>
          {/* Superstructure */}
          <linearGradient id="sbs-deck" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#f8f4e8" />
            <stop offset="100%" stopColor="#e8e0c8" />
          </linearGradient>
          {/* Paddlewheel */}
          <linearGradient id="sbs-wheel-grad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%"   stopColor="#8a5020" />
            <stop offset="100%" stopColor="#5a2e0c" />
          </linearGradient>
          {/* Smoke */}
          <radialGradient id="sbs-smoke-g" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="#c8b8a0" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#a08870" stopOpacity="0" />
          </radialGradient>
          {/* Reflection gradient */}
          <linearGradient id="sbs-refl" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#f8d060" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#c87820" stopOpacity="0.05" />
          </linearGradient>
          {/* Water shimmer */}
          <filter id="sbs-wavy" x="-5%" y="-5%" width="110%" height="110%">
            <feTurbulence type="turbulence" baseFrequency="0.02 0.08" numOctaves="2" seed="5" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="4" xChannelSelector="R" yChannelSelector="G" />
          </filter>
          {/* Soft blur for reflection */}
          <filter id="sbs-blur">
            <feGaussianBlur in="SourceGraphic" stdDeviation="2.5" />
          </filter>
        </defs>

        {/* Sky */}
        <rect x={0} y={0} width={W} height={HORIZON_Y + 4} fill="url(#sbs-sky)" />

        {/* Sun disc */}
        <circle cx={820} cy={182} r={38} fill="url(#sbs-sun)" opacity={0.92} />
        <circle cx={820} cy={182} r={22} fill="#fff8a0" opacity={0.85} />

        {/* Sun path on water */}
        <ellipse cx={820} cy={WATER_Y + 60} rx={96} ry={220}
          fill="#f0a020" opacity={0.14} filter="url(#sbs-blur)"
          style={{ opacity: active ? 0.14 : 0, transition: tr(0.2) }}
        />

        {/* Horizon glow */}
        <ellipse cx={W / 2} cy={HORIZON_Y} rx={W * 0.48} ry={40}
          fill="#f09020" opacity={0.22} filter="url(#sbs-blur)" />

        {/* Far shoreline silhouette */}
        <path d={SHORE_D} fill="#1a2c18" opacity={0.88}
          style={{ opacity: active ? 0.88 : 0, transition: tr(0.1) }}
        />
        {/* Far treeline dots */}
        {FAR_TREES.map(([tx, ty, tr2], i) => (
          <ellipse key={i} cx={tx} cy={ty} rx={tr2} ry={tr2 * 0.7}
            fill="#1a2c18"
            style={{ opacity: active ? 0.82 : 0, transition: tr(0.05 + i * 0.01) }}
          />
        ))}

        {/* Lake water */}
        <rect x={0} y={WATER_Y} width={W} height={H - WATER_Y} fill="url(#sbs-water)" />

        {/* Ripple rows */}
        {RIPPLE_YS.map((ry, i) => (
          <line key={i}
            x1={12 + i * 8} y1={ry} x2={W - 12 - i * 8} y2={ry}
            stroke="#c87820" strokeWidth={1 + (i % 3) * 0.3}
            opacity={0.18 - i * 0.01}
            style={{
              animation: active ? `sbs-ripple ${3 + i * 0.4}s ease-in-out ${i * 0.18}s infinite` : "none",
              opacity: active ? 0.18 - i * 0.01 : 0,
              transition: tr(0.15),
            }}
          />
        ))}

        {/* ─── Steamboat (bobbing) ─── */}
        <g className="sbs-bob"
          style={{ opacity: active ? 1 : 0, transition: tr(0.3) }}
        >
          {/* Hull water reflection (blurred, wavy) */}
          <path d={REFL_HULL_D}
            fill="#e8c060" opacity={0.12} filter="url(#sbs-wavy)"
          />
          {REFL_SHIMMER.map(([x1, y1, x2, y2], i) => (
            <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
              stroke="#f0c040" strokeWidth={1.5 + (i % 2) * 0.5}
              opacity={0.12 - i * 0.015}
              filter="url(#sbs-wavy)"
            />
          ))}

          {/* Paddlewheel housing */}
          <rect x={WH_X} y={WH_Y} width={WH_W} height={WH_H}
            fill="#c8a060" rx={2}
          />

          {/* Hull */}
          <path d={HULL_D} fill="url(#sbs-hull)" />
          {/* Hull dark boot stripe */}
          <rect x={HULL_L + 14} y={WL_Y} width={HULL_W - 32} height={8}
            fill="#2a1808" rx={1} />
          {/* Hull shadow underside */}
          <path d={`M ${HULL_L + 28},${HULL_Y + HULL_H} L ${HULL_L},${HULL_Y + HULL_H - 10} L ${HULL_R + 12},${HULL_Y + HULL_H / 2} L ${HULL_R},${HULL_Y + HULL_H} Z`}
            fill="#8a6030" opacity={0.4} />

          {/* Portholes */}
          {PORTHOLES.map(([px, py], i) => (
            <g key={i}>
              <circle cx={px} cy={py} r={7} fill="#f0c040" opacity={0.75} />
              <circle cx={px} cy={py} r={7} fill="none" stroke="#8a6820" strokeWidth={2} />
            </g>
          ))}

          {/* Deck 1 */}
          <rect x={DECK1_X} y={DECK1_Y} width={DECK1_W} height={DECK1_H}
            fill="url(#sbs-deck)" />
          {/* Deck 1 rail posts */}
          {RAIL1_POSTS.map((rx2, i) => (
            <line key={i} x1={rx2} y1={DECK1_Y} x2={rx2} y2={DECK1_Y - 14}
              stroke="#8a7050" strokeWidth={2} />
          ))}
          <line x1={DECK1_X + 4} y1={DECK1_Y - 14} x2={DECK1_X + DECK1_W - 4} y2={DECK1_Y - 14}
            stroke="#8a7050" strokeWidth={2.5} />

          {/* Deck 2 */}
          <rect x={DECK2_X} y={DECK2_Y} width={DECK2_W} height={DECK2_H}
            fill="url(#sbs-deck)" />
          {/* Deck 2 rail posts */}
          {RAIL2_POSTS.map((rx2, i) => (
            <line key={i} x1={rx2} y1={DECK2_Y} x2={rx2} y2={DECK2_Y - 12}
              stroke="#8a7050" strokeWidth={1.5} />
          ))}
          <line x1={DECK2_X + 4} y1={DECK2_Y - 12} x2={DECK2_X + DECK2_W - 4} y2={DECK2_Y - 12}
            stroke="#8a7050" strokeWidth={2} />

          {/* Bunting flags */}
          {FLAGS.map(([x1, y1, x2, , fc], i) => (
            <polygon key={i}
              points={`${x1},${y1} ${(x1 + x2) / 2},${y1 + 16} ${x2},${y1}`}
              fill={fc}
              style={{
                animation: active ? `sbs-flag ${1.4 + (i % 3) * 0.3}s ease-in-out ${i * 0.1}s infinite` : "none",
                transformOrigin: `${x1}px ${y1}px`,
              }}
            />
          ))}
          {/* Bunting string */}
          <line x1={DECK2_X + 8} y1={DECK2_Y} x2={DECK2_X + DECK2_W - 8} y2={DECK2_Y}
            stroke="#8a7040" strokeWidth={1.5} opacity={0.6} />

          {/* Pilot house */}
          <rect x={PILOT_X} y={PILOT_Y} width={PILOT_W} height={PILOT_H}
            fill="url(#sbs-deck)" />
          {/* Pilot house windows */}
          {[18, 44].map((ox, i) => (
            <rect key={i}
              x={PILOT_X + ox} y={PILOT_Y + 8} width={20} height={22}
              fill="#c8e0f0" opacity={0.65} rx={1}
            />
          ))}
          {/* Pilot house roof */}
          <rect x={PILOT_X - 4} y={PILOT_Y - 8} width={PILOT_W + 8} height={10}
            fill="#c8a060" rx={1} />

          {/* Smokestacks */}
          {[
            { x: STK_X,  y1: STK_Y1,  y2: STK_Y2,  w: STK_W },
            { x: STK2_X, y1: STK2_Y1, y2: STK2_Y2, w: STK2_W },
          ].map((stk, i) => (
            <g key={i}>
              {/* Stack body */}
              <rect x={stk.x} y={stk.y1} width={stk.w} height={stk.y2 - stk.y1}
                fill="#2a1e14" rx={stk.w / 2} />
              {/* Stack cap ring */}
              <rect x={stk.x - 3} y={stk.y1 - 4} width={stk.w + 6} height={8}
                fill="#1a1408" rx={stk.w / 2} />
              {/* Stack gold band */}
              <rect x={stk.x + 1} y={stk.y1 + 14} width={stk.w - 2} height={6}
                fill="#c89030" opacity={0.8} />
            </g>
          ))}

          {/* Mast */}
          <line x1={MAST_X} y1={PILOT_Y} x2={MAST_X} y2={MAST_Y1}
            stroke="#5a4020" strokeWidth={3} />
          {/* Masthead pennant */}
          <path d={PEN_D} fill="#e03020" className="sbs-pen" />

          {/* Paddlewheel (animated) */}
          <g className="sbs-wheel">
            {/* Wheel rim */}
            <circle cx={PW_CX} cy={PW_CY} r={PW_R_OUT}
              fill="none" stroke="url(#sbs-wheel-grad)" strokeWidth={5} />
            <circle cx={PW_CX} cy={PW_CY} r={PW_R_IN}
              fill="#6a3c18" />
            {/* Spokes */}
            {Array.from({ length: 6 }, (_, i) => {
              const a = (i * 60) * Math.PI / 180;
              return (
                <line key={i}
                  x1={Math.round(PW_CX + PW_R_IN * Math.cos(a))}
                  y1={Math.round(PW_CY + PW_R_IN * Math.sin(a))}
                  x2={Math.round(PW_CX + PW_R_OUT * Math.cos(a))}
                  y2={Math.round(PW_CY + PW_R_OUT * Math.sin(a))}
                  stroke="#8a5020" strokeWidth={3}
                />
              );
            })}
            {/* Blades */}
            {BLADES.map((blade, i) => (
              <path key={i} d={blade.d}
                fill="#7a4818" stroke="#5a3010" strokeWidth={0.8} />
            ))}
          </g>

          {/* Splash at paddlewheel base */}
          {[0, 1, 2, 3].map(i => (
            <ellipse key={i}
              cx={PW_CX + (i - 1.5) * 14}
              cy={PW_CY + PW_R_OUT - 4 + (i % 2) * 5}
              rx={6 + i} ry={3}
              fill="#c8d8e8" opacity={0.3}
            />
          ))}
        </g>

        {/* ─── Smoke puffs ─── */}
        {SMOKE_PUFFS.map((p, i) => (
          <circle key={i}
            cx={p.cx} cy={p.cy} r={p.r}
            fill="url(#sbs-smoke-g)"
            style={{
              animation: active ? `sbs-smoke ${3.2 + (i % 3) * 0.8}s ease-out ${p.delay}s infinite` : "none",
              opacity: active ? 0.72 : 0,
              transition: tr(0.4),
            }}
          />
        ))}

        {/* ─── Wake V-lines ─── */}
        {WAKES.map((wk, i) => (
          <path key={i} d={wk.d}
            fill="none" stroke="#e8c880" strokeWidth={1.5 - i * 0.2}
            opacity={active ? wk.opacity : 0}
            style={{ transition: tr(0.5 + i * 0.05) }}
          />
        ))}

        {/* ─── Rowboat (foreground) ─── */}
        <g style={{ opacity: active ? 0.88 : 0, transition: tr(0.6) }}>
          <path d={ROWBOAT_D} fill="#5a3818" stroke="#3a2008" strokeWidth={2} />
          <path d={OAR_D} stroke="#8a6030" strokeWidth={3} fill="none" strokeLinecap="round" />
          {/* Person silhouette */}
          <ellipse cx={ROW_X + 8} cy={ROW_Y + 6} rx={7} ry={10} fill="#1a1008" />
        </g>

        {/* ─── Lily pads ─── */}
        {LILIES.map(([lx, ly, lr], i) => (
          <g key={i} style={{ opacity: active ? 0.75 : 0, transition: tr(0.4 + i * 0.04) }}>
            <ellipse cx={lx} cy={ly} rx={lr} ry={lr * 0.55} fill="#1a4810" />
            <path d={`M ${lx},${ly - lr * 0.5} L ${lx},${ly} L ${lx + lr * 0.6},${ly}`}
              fill="none" stroke="#2a6018" strokeWidth={0.8} opacity={0.6} />
          </g>
        ))}

        {/* Caption */}
        <text
          x={W / 2} y={H - 16}
          textAnchor="middle"
          fontFamily="'Georgia', 'Times New Roman', serif"
          fontSize={11} fill="#c8a040"
          letterSpacing={5}
          style={{ opacity: active ? 0.65 : 0, transition: tr(1.0) }}
        >
          LAKE QUINSIGAMOND · SHREWSBURY, MA · GOLDEN HOUR
        </text>
      </svg>
    </section>
  );
}
