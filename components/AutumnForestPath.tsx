"use client";

// AutumnForestPath ─────────────────────────────────────────────────────────────
//
// Full-width atmospheric perspective scene: Route 9 in peak autumn. A winding
// dirt road tunnels through a cathedral of orange-gold maple canopy, mist at
// the vanishing point, foreground trunks framing the composition, and animated
// leaves spiraling down through amber light.
// Layers (back → front): sky gradient → horizon mist → distant tree line →
// mid-distance canopy masses + trunks → ground plane → road → leaf litter →
// foreground trunks → overhanging crowns → animated falling leaves → caption.
// IntersectionObserver at 0.12 triggers staggered opacity reveals.

import { useEffect, useRef, useState } from "react";

const FAR_BUMPS: [number, number, number, number][] = [
  [80,  332, 48, 28], [168, 324, 56, 34], [264, 328, 44, 26],
  [348, 322, 60, 38], [432, 330, 42, 24], [516, 324, 52, 30],
  [600, 320, 58, 36], [688, 326, 40, 22], [764, 318, 54, 32],
  [844, 324, 46, 28], [924, 320, 62, 40], [1012, 326, 50, 30],
  [1096, 322, 44, 26], [1180, 328, 58, 34], [1272, 324, 48, 28],
  [1364, 320, 56, 32],
];

const MID_TRUNKS_L: [number, number, number, number, number][] = [
  [118, 198, 418, 6, 0.52], [194, 178, 398, 8, 0.62],
  [258, 158, 378, 10, 0.70], [338, 138, 358, 7, 0.58],
  [418, 152, 368,  9, 0.66],
];
const MID_TRUNKS_R: [number, number, number, number, number][] = [
  [1022, 152, 368, 9, 0.66], [1102, 138, 358, 7, 0.58],
  [1182, 158, 378, 10, 0.70], [1246, 178, 398, 8, 0.62],
  [1322, 198, 418, 6, 0.52],
];

const GROUND_LEAVES: [number, number, number, number, number, string][] = [
  [382, 528, 12, 5, -25, "#c8600a"], [432, 546, 10, 4,  40, "#d4780a"],
  [482, 518, 14, 6, -10, "#b84808"], [532, 553, 11, 5,  60, "#e08020"],
  [582, 533,  9, 4, -40, "#c86010"], [622, 546, 13, 5,  25, "#d47820"],
  [662, 520, 10, 4, -55, "#b84808"], [782, 534, 11, 5,  30, "#d4780a"],
  [812, 548,  9, 4, -20, "#c8600a"], [842, 523, 13, 5,  50, "#e08020"],
  [882, 543, 10, 4, -35, "#b84808"], [922, 528, 12, 5,  15, "#c86010"],
  [962, 550,  9, 4, -65, "#d4780a"], [1012, 526, 14, 6, 45, "#c8600a"],
  [1062, 543, 11, 5, -30, "#b84808"],
];

const FALLING_LEAVES: [number, number, number][] = [
  [310,  0.0, 0], [470,  0.9, 1], [610,  1.7, 2],
  [695,  2.5, 0], [738,  0.5, 3], [775,  1.3, 1],
  [818,  2.1, 2], [918,  0.3, 3], [1055, 1.1, 0],
  [1178, 1.9, 1], [1278, 0.7, 2],
];

const BARK_YS = [200, 260, 320, 380, 440, 500] as const;

const LEAF_COLORS = ["#d46010", "#e08828", "#c05008"] as const;
const LEAF_ANIMS  = ["afp-la", "afp-lb", "afp-lc", "afp-ld"] as const;

export function AutumnForestPath() {
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

  const tr = (d: number) => active ? `opacity 0.65s ease ${d}s` : "none";

  return (
    <div ref={ref} style={{ position: "relative", overflow: "hidden" }}>
      <style>{`
        @keyframes afp-la {
          0%   { transform:translate(0,-28px) rotate(0deg);   opacity:0 }
          9%   { opacity:.84 }
          50%  { transform:translate(-30px,130px) rotate(118deg) }
          91%  { opacity:.58 }
          100% { transform:translate(20px,275px) rotate(215deg); opacity:0 }
        }
        @keyframes afp-lb {
          0%   { transform:translate(0,-18px) rotate(28deg);  opacity:0 }
          11%  { opacity:.78 }
          48%  { transform:translate(36px,115px) rotate(158deg) }
          87%  { opacity:.52 }
          100% { transform:translate(-24px,265px) rotate(295deg); opacity:0 }
        }
        @keyframes afp-lc {
          0%   { transform:translate(0,-38px) rotate(-18deg); opacity:0 }
          13%  { opacity:.72 }
          52%  { transform:translate(-42px,155px) rotate(88deg) }
          89%  { opacity:.48 }
          100% { transform:translate(28px,295px) rotate(244deg); opacity:0 }
        }
        @keyframes afp-ld {
          0%   { transform:translate(0,-8px) rotate(44deg);   opacity:0 }
          9%   { opacity:.88 }
          46%  { transform:translate(22px,98px) rotate(198deg) }
          84%  { opacity:.62 }
          100% { transform:translate(-32px,255px) rotate(375deg); opacity:0 }
        }
      `}</style>
      <svg
        viewBox="0 0 1440 640"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ display: "block", width: "100%", height: "auto" }}
        role="img"
        aria-label="Autumn forest path along Route 9 — orange maple canopy arching overhead, winding dirt road leading into golden mist"
      >
        <defs>
          <linearGradient id="afp-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#f2e2c2"/>
            <stop offset="50%"  stopColor="#e8c878"/>
            <stop offset="100%" stopColor="#d4a042"/>
          </linearGradient>
          <radialGradient id="afp-mist" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="rgba(255,248,230,.75)"/>
            <stop offset="100%" stopColor="rgba(255,248,230,0)"/>
          </radialGradient>
          <linearGradient id="afp-ground" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#a08058"/>
            <stop offset="100%" stopColor="#c8a878"/>
          </linearGradient>
          <linearGradient id="afp-road" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#b49068"/>
            <stop offset="100%" stopColor="#d6bc8e"/>
          </linearGradient>
          <radialGradient id="afp-cl" cx="82%" cy="95%" r="95%">
            <stop offset="0%"   stopColor="#dc6c08"/>
            <stop offset="48%"  stopColor="#c05808"/>
            <stop offset="100%" stopColor="#7e3210"/>
          </radialGradient>
          <radialGradient id="afp-cr" cx="18%" cy="95%" r="95%">
            <stop offset="0%"   stopColor="#d87c0a"/>
            <stop offset="48%"  stopColor="#c06212"/>
            <stop offset="100%" stopColor="#8c3c10"/>
          </radialGradient>
          <radialGradient id="afp-ctl" cx="72%" cy="82%" r="88%">
            <stop offset="0%"   stopColor="#e88c22"/>
            <stop offset="52%"  stopColor="#c86212"/>
            <stop offset="100%" stopColor="#8c3c0a"/>
          </radialGradient>
          <radialGradient id="afp-ctr" cx="28%" cy="82%" r="88%">
            <stop offset="0%"   stopColor="#dc8222"/>
            <stop offset="52%"  stopColor="#c05c0a"/>
            <stop offset="100%" stopColor="#843210"/>
          </radialGradient>
          <filter id="afp-blur-sm"><feGaussianBlur stdDeviation="2.4"/></filter>
          <filter id="afp-blur-lg"><feGaussianBlur stdDeviation="9"/></filter>
        </defs>

        {/* SKY */}
        <rect x="0" y="0" width="1440" height="640" fill="url(#afp-sky)"
          style={{ opacity: active ? 1 : 0, transition: tr(0) }}/>

        {/* HORIZON MIST */}
        <ellipse cx="720" cy="312" rx="820" ry="95"
          fill="url(#afp-mist)" filter="url(#afp-blur-lg)"
          style={{ opacity: active ? 1 : 0, transition: tr(0.04) }}/>

        {/* DISTANT BUMP SILHOUETTES */}
        <g filter="url(#afp-blur-sm)"
          style={{ opacity: active ? 1 : 0, transition: tr(0.07) }}>
          {FAR_BUMPS.map(([cx, cy, rx, ry], i) => (
            <ellipse key={i} cx={cx} cy={cy} rx={rx} ry={ry}
              fill="#c88030" opacity="0.20"/>
          ))}
        </g>

        {/* MID LEFT CANOPY MASS */}
        <path d="M -70 0 C 80 -22,290 55,370 135 C 425 195,510 258,546 318
                  C 516 355,445 374,362 394 C 258 412,118 402,0 420 Z"
          fill="url(#afp-cl)"
          style={{ opacity: active ? 0.86 : 0, transition: tr(0.09) }}/>
        <path d="M -70 0 C 55 -32,198 38,278 108 C 338 168,398 228,430 288
                  L 352 288 C 320 238,268 178,208 128 C 148 78,58 28,-70 0 Z"
          fill="rgba(236,152,42,.22)"
          style={{ opacity: active ? 1 : 0, transition: tr(0.11) }}/>

        {/* MID RIGHT CANOPY MASS */}
        <path d="M 1510 0 C 1360 -22,1150 55,1070 135 C 1015 195,930 258,894 318
                  C 924 355,995 374,1078 394 C 1182 412,1322 402,1440 420 L 1510 420 Z"
          fill="url(#afp-cr)"
          style={{ opacity: active ? 0.86 : 0, transition: tr(0.09) }}/>
        <path d="M 1510 0 C 1385 -32,1242 38,1162 108 C 1102 168,1042 228,1010 288
                  L 1088 288 C 1120 238,1172 178,1232 128 C 1292 78,1382 28,1510 0 Z"
          fill="rgba(222,138,36,.22)"
          style={{ opacity: active ? 1 : 0, transition: tr(0.11) }}/>

        {/* MID TRUNKS LEFT */}
        <g style={{ opacity: active ? 1 : 0, transition: tr(0.14) }}>
          {MID_TRUNKS_L.map(([x, yt, yb, sw, op], i) => (
            <line key={i} x1={x} y1={yt} x2={x} y2={yb}
              stroke="#5c2a0a" strokeWidth={sw} opacity={op} strokeLinecap="round"/>
          ))}
        </g>

        {/* MID TRUNKS RIGHT */}
        <g style={{ opacity: active ? 1 : 0, transition: tr(0.14) }}>
          {MID_TRUNKS_R.map(([x, yt, yb, sw, op], i) => (
            <line key={i} x1={x} y1={yt} x2={x} y2={yb}
              stroke="#5c2a0a" strokeWidth={sw} opacity={op} strokeLinecap="round"/>
          ))}
        </g>

        {/* GROUND PLANE */}
        <path d="M 0 375 L 1440 375 L 1440 640 L 0 640 Z"
          fill="url(#afp-ground)"
          style={{ opacity: active ? 1 : 0, transition: tr(0.07) }}/>

        {/* ROAD (perspective trapezoid — VP at ~720,310) */}
        <path d="M 700 310 L 740 310 L 1065 640 L 375 640 Z"
          fill="url(#afp-road)"
          style={{ opacity: active ? 1 : 0, transition: tr(0.11) }}/>
        {/* Tire tracks */}
        <line x1="714" y1="314" x2="524" y2="640"
          stroke="rgba(136,96,52,.38)" strokeWidth="3" strokeDasharray="22,32"
          style={{ opacity: active ? 1 : 0, transition: tr(0.17) }}/>
        <line x1="726" y1="314" x2="916" y2="640"
          stroke="rgba(136,96,52,.38)" strokeWidth="3" strokeDasharray="22,32"
          style={{ opacity: active ? 1 : 0, transition: tr(0.17) }}/>
        {/* Road edges */}
        <line x1="702" y1="312" x2="377" y2="638"
          stroke="rgba(176,126,72,.22)" strokeWidth="1.2"
          style={{ opacity: active ? 1 : 0, transition: tr(0.19) }}/>
        <line x1="738" y1="312" x2="1063" y2="638"
          stroke="rgba(176,126,72,.22)" strokeWidth="1.2"
          style={{ opacity: active ? 1 : 0, transition: tr(0.19) }}/>

        {/* LEAF LITTER ON GROUND */}
        <g style={{ opacity: active ? 1 : 0, transition: tr(0.21) }}>
          {GROUND_LEAVES.map(([cx, cy, rx, ry, rot, fill], i) => (
            <ellipse key={i} cx={cx} cy={cy} rx={rx} ry={ry}
              transform={`rotate(${rot},${cx},${cy})`}
              fill={fill} opacity="0.68"/>
          ))}
        </g>

        {/* FOREGROUND LEFT TRUNK */}
        <g style={{ opacity: active ? 1 : 0, transition: tr(0.13) }}>
          <path d="M -22 640 C 2 505,22 402,62 302 C 82 248,112 218,132 178
                    L 182 178 C 162 208,142 242,132 302 C 112 402,102 505,122 640 Z"
            fill="#4c2208"/>
          <path d="M -22 640 C 22 598,62 578,102 578 C 82 598,52 618,-22 640 Z"
            fill="#3c1808"/>
          <path d="M 122 640 C 102 610,112 590,142 584 C 162 598,172 618,162 640 Z"
            fill="#3c1808"/>
          {BARK_YS.map((y, i) => (
            <line key={i} x1={22 + i * 2} y1={y} x2={102 - i * 2} y2={y + 28}
              stroke="rgba(0,0,0,.16)" strokeWidth="0.7"/>
          ))}
        </g>

        {/* FOREGROUND RIGHT TRUNK */}
        <g style={{ opacity: active ? 1 : 0, transition: tr(0.13) }}>
          <path d="M 1462 640 C 1438 505,1418 402,1378 302 C 1358 248,1328 218,1308 178
                    L 1258 178 C 1278 208,1298 242,1308 302 C 1328 402,1338 505,1318 640 Z"
            fill="#4c2208"/>
          <path d="M 1462 640 C 1418 598,1378 578,1338 578 C 1358 598,1388 618,1462 640 Z"
            fill="#3c1808"/>
          <path d="M 1318 640 C 1338 610,1328 590,1298 584 C 1278 598,1268 618,1278 640 Z"
            fill="#3c1808"/>
          {BARK_YS.map((y, i) => (
            <line key={i} x1={1418 - i * 2} y1={y} x2={1338 + i * 2} y2={y + 28}
              stroke="rgba(0,0,0,.16)" strokeWidth="0.7"/>
          ))}
        </g>

        {/* OVERHANGING LEFT CANOPY */}
        <path d="M -82 -32 C 96 -52,302 18,424 78 C 524 128,604 188,642 248
                  C 582 258,502 238,422 198 C 342 158,222 98,80 58
                  C 22 38,-42 18,-82 -32 Z"
          fill="url(#afp-ctl)"
          style={{ opacity: active ? 0.91 : 0, transition: tr(0.04) }}/>
        <path d="M -82 -32 C 58 -42,198 8,318 68 C 258 48,158 18,-82 -32 Z"
          fill="rgba(255,178,58,.17)"
          style={{ opacity: active ? 1 : 0, transition: tr(0.06) }}/>

        {/* OVERHANGING RIGHT CANOPY */}
        <path d="M 1522 -32 C 1344 -52,1138 18,1016 78 C 916 128,836 188,798 248
                  C 858 258,938 238,1018 198 C 1098 158,1218 98,1360 58
                  C 1418 38,1482 18,1522 -32 Z"
          fill="url(#afp-ctr)"
          style={{ opacity: active ? 0.91 : 0, transition: tr(0.04) }}/>
        <path d="M 1522 -32 C 1382 -42,1242 8,1122 68 C 1182 48,1282 18,1522 -32 Z"
          fill="rgba(245,168,48,.17)"
          style={{ opacity: active ? 1 : 0, transition: tr(0.06) }}/>

        {/* ANIMATED FALLING LEAVES */}
        {active && FALLING_LEAVES.map(([x, delay, variant], i) => {
          const anim  = LEAF_ANIMS[variant] ?? "afp-la";
          const color = LEAF_COLORS[i % 3] ?? "#d46010";
          return (
            <g key={i} style={{
              animation: `${anim} 4.4s ease-in ${delay}s infinite`,
            }}>
              <ellipse cx={x} cy="78" rx="8" ry="4"
                transform={`rotate(${28 + i * 17}, ${x}, 78)`}
                fill={color} opacity="0.80"/>
              <line x1={x} y1={74} x2={x} y2={83}
                stroke="rgba(116,48,8,.45)" strokeWidth="0.8"/>
            </g>
          );
        })}

        {/* CAPTION */}
        <g style={{ opacity: active ? 1 : 0, transition: tr(0.82) }}>
          <text x="720" y="606" textAnchor="middle"
            fill="rgba(82,42,10,.50)" fontSize="11.5"
            fontFamily="Georgia,'Times New Roman',serif"
            fontStyle="italic" letterSpacing="1.4">
            Every journey down Route 9 leads to something worth building
          </text>
          <text x="720" y="626" textAnchor="middle"
            fill="rgba(82,42,10,.28)" fontSize="8.5"
            fontFamily="monospace" letterSpacing="3.2">
            SHREWSBURY · MASSACHUSETTS · ROUTE 9 WEB CO.
          </text>
        </g>
      </svg>
    </div>
  );
}
