"use client";

import { useEffect, useState } from "react";

// ── Route 9 Motor Inn — retro vacancy sign scene ──────────────────────────────
//
// Full-width dusk SVG scene: motel building silhouettes, star field, road with
// dashes, and a highway-green sign bearing "ROUTE 9 · MOTOR INN".
//
// The VACANCY / NO VACANCY sub-panel toggles based on Eastern business hours:
//   9 AM–5:59 PM ET → green  "VACANCY"     (we're open)
//   all other hours  → red   "NO VACANCY"  (leave a message below ↓)
//
// Uses null-initial-state to avoid SSR hydration mismatch on the time-dependent
// text. The ct-star and neon-flicker CSS classes are already defined in
// globals.css from prior passes.
//
// No new CSS keyframes needed — reuses: ct-star-twinkle, neon-flicker.

function isOpenET(): boolean {
  try {
    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone: "America/New_York",
      hour: "2-digit",
      hourCycle: "h23",
    }).formatToParts(new Date());
    const h = parseInt(parts.find(p => p.type === "hour")?.value ?? "12", 10);
    return h >= 9 && h < 18;
  } catch {
    const h = new Date().getHours();
    return h >= 9 && h < 18;
  }
}

// Deterministic star field (no Math.random)
const STARS = [
  { x:  72, y: 18, r: 0.9, d: "0.2s" }, { x: 188, y: 30, r: 1.1, d: "1.4s" },
  { x: 344, y: 14, r: 0.7, d: "0.6s" }, { x: 462, y: 42, r: 0.8, d: "2.0s" },
  { x: 604, y: 22, r: 1.0, d: "0.9s" }, { x: 760, y:  8, r: 0.7, d: "1.7s" },
  { x: 908, y: 26, r: 1.1, d: "0.4s" }, { x:1048, y: 16, r: 0.8, d: "2.2s" },
  { x:1180, y: 34, r: 0.9, d: "1.1s" }, { x:1310, y: 10, r: 1.0, d: "0.7s" },
  { x:1390, y: 22, r: 0.7, d: "1.8s" }, { x: 152, y: 54, r: 0.6, d: "2.4s" },
  { x: 538, y: 56, r: 0.7, d: "0.3s" }, { x: 840, y: 46, r: 0.6, d: "1.5s" },
  { x:1090, y: 60, r: 0.8, d: "0.8s" }, { x: 280, y: 48, r: 0.7, d: "1.2s" },
];

// Road center-line dash positions
const ROAD_DASHES = [60, 200, 340, 480, 620, 760, 900, 1040, 1180, 1320];

// Left motel unit: room windows + doors
const L_WINDOWS = [
  { x:  22, y: 162, w: 36, h: 30, lit: true  },
  { x:  74, y: 162, w: 36, h: 30, lit: true  },
  { x: 126, y: 162, w: 36, h: 30, lit: false },
  { x: 178, y: 162, w: 36, h: 30, lit: true  },
  { x: 230, y: 162, w: 36, h: 30, lit: false },
  { x: 282, y: 162, w: 36, h: 30, lit: true  },
  { x: 334, y: 162, w: 36, h: 30, lit: false },
];
const L_DOORS = [22, 74, 126, 178, 230, 282, 334].map(x => ({ x, y: 204, w: 36, h: 56 }));

// Right motel block: windows only
const R_WINDOWS = [
  { x:1078, y: 172, w: 38, h: 28, lit: true  },
  { x:1132, y: 172, w: 38, h: 28, lit: false },
  { x:1186, y: 172, w: 38, h: 28, lit: true  },
  { x:1248, y: 172, w: 38, h: 28, lit: true  },
  { x:1308, y: 172, w: 38, h: 28, lit: false },
  { x:1364, y: 172, w: 38, h: 28, lit: true  },
];

export function MotelSign() {
  const [open, setOpen] = useState<boolean | null>(null);

  useEffect(() => {
    setOpen(isOpenET());
  }, []);

  const vacancyText  = open === null ? " " : open ? "VACANCY" : "NO VACANCY";
  const vacancyFill  = open === false ? "#FF4B4B" : "#44DD88";
  const vacancyTint  = open === false ? "rgba(180,20,20,0.18)" : "rgba(30,160,70,0.14)";
  const subText      = open === false
    ? "LEAVE A MESSAGE BELOW ↓"
    : "OPEN  ·  MON–FRI  9AM–5PM  ET";

  return (
    <div aria-hidden style={{ width: "100%", overflow: "hidden", lineHeight: 0 }}>
      <svg
        viewBox="0 0 1440 300"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ display: "block", width: "100%", height: "auto", maxHeight: "360px" }}
      >
        <defs>
          {/* Dusk sky */}
          <linearGradient id="ms-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#0C0618" />
            <stop offset="38%"  stopColor="#2A1008" />
            <stop offset="68%"  stopColor="#742E0E" />
            <stop offset="100%" stopColor="#B84E18" />
          </linearGradient>
          {/* Sign face */}
          <linearGradient id="ms-board" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#0F3820" />
            <stop offset="100%" stopColor="#092414" />
          </linearGradient>
          {/* Horizon warmth */}
          <radialGradient id="ms-horizon" cx="50%" cy="100%" r="60%">
            <stop offset="0%"   stopColor="rgba(200,95,28,0.30)" />
            <stop offset="100%" stopColor="rgba(200,95,28,0)" />
          </radialGradient>
          {/* Sign ground-light pool */}
          <radialGradient id="ms-pool" cx="50%" cy="0%" r="100%">
            <stop offset="0%"   stopColor="rgba(212,104,42,0.22)" />
            <stop offset="100%" stopColor="rgba(212,104,42,0)" />
          </radialGradient>
          {/* Window glow softener */}
          <filter id="ms-wglow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2.5" />
          </filter>
          {/* Neon bloom for vacancy text */}
          <filter id="ms-neon" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          {/* Sign corner bolt */}
          <radialGradient id="ms-bolt" cx="40%" cy="35%" r="60%">
            <stop offset="0%" stopColor="#7A5C2A" />
            <stop offset="100%" stopColor="#3C2A0C" />
          </radialGradient>
        </defs>

        {/* ── Sky ── */}
        <rect width="1440" height="300" fill="url(#ms-sky)" />
        <rect width="1440" height="300" fill="url(#ms-horizon)" />

        {/* ── Stars ── */}
        {STARS.map((s, i) => (
          <circle
            key={i}
            cx={s.x} cy={s.y} r={s.r}
            fill="rgba(255,242,210,0.88)"
            className="ct-star"
            style={{ animationDelay: s.d } as React.CSSProperties}
          />
        ))}

        {/* ══ LEFT MOTEL BUILDING ══ */}
        {/* Main block */}
        <rect x="0"   y="152" width="400" height="148" fill="#0C0706" />
        {/* Roofline trim */}
        <rect x="0"   y="144" width="400" height="10"  fill="#161008" />
        <rect x="0"   y="140" width="400" height="6"   fill="#1E140A" />
        {/* Room divider lines */}
        {[50,100,150,200,250,300,350].map(x => (
          <line key={x} x1={x} y1="152" x2={x} y2="300" stroke="rgba(0,0,0,0.45)" strokeWidth="1" />
        ))}
        {/* Window glow (soft halo behind) */}
        {L_WINDOWS.filter(w => w.lit).map((w, i) => (
          <rect key={`lg${i}`} x={w.x - 4} y={w.y - 4} width={w.w + 8} height={w.h + 8}
            fill="rgba(255,180,60,0.18)" filter="url(#ms-wglow)" />
        ))}
        {/* Windows */}
        {L_WINDOWS.map((w, i) => (
          <g key={i}>
            <rect x={w.x} y={w.y} width={w.w} height={w.h} rx="2"
              fill={w.lit ? "rgba(255,190,70,0.58)" : "rgba(30,20,10,0.80)"} />
            <rect x={w.x} y={w.y} width={w.w} height={w.h} rx="2"
              fill="none" stroke="rgba(255,255,255,0.10)" strokeWidth="0.8" />
            {/* Curtain */}
            {w.lit && (
              <rect x={w.x} y={w.y} width={w.w * 0.42} height={w.h} rx="1"
                fill="rgba(160,88,30,0.30)" />
            )}
          </g>
        ))}
        {/* Doors */}
        {L_DOORS.map((d, i) => (
          <g key={i}>
            <rect x={d.x} y={d.y} width={d.w} height={d.h} rx="2" fill="rgba(60,38,14,0.90)" />
            <circle cx={d.x + d.w - 6} cy={d.y + d.h * 0.5} r="2.5" fill="rgba(255,190,60,0.80)" />
          </g>
        ))}
        {/* "OFFICE" sign */}
        <rect x="16" y="142" width="54" height="13" rx="2" fill="#1C6438" />
        <text x="43" y="151.5" textAnchor="middle" fontSize="6.5" fontWeight="800"
          fontFamily="'Courier New',monospace" letterSpacing="0.14em" fill="white">OFFICE</text>

        {/* ══ RIGHT BUILDING ══ */}
        <rect x="1040" y="162" width="400" height="138" fill="#0A0504" />
        <rect x="1040" y="154" width="400" height="10"  fill="#131008" />
        {[1090,1140,1196,1256,1316,1376].map(x => (
          <line key={x} x1={x} y1="162" x2={x} y2="300" stroke="rgba(0,0,0,0.38)" strokeWidth="1" />
        ))}
        {R_WINDOWS.filter(w => w.lit).map((w, i) => (
          <rect key={`rg${i}`} x={w.x - 4} y={w.y - 4} width={w.w + 8} height={w.h + 8}
            fill="rgba(255,170,50,0.16)" filter="url(#ms-wglow)" />
        ))}
        {R_WINDOWS.map((w, i) => (
          <g key={i}>
            <rect x={w.x} y={w.y} width={w.w} height={w.h} rx="2"
              fill={w.lit ? "rgba(255,186,65,0.52)" : "rgba(24,16,8,0.85)"} />
            <rect x={w.x} y={w.y} width={w.w} height={w.h} rx="2"
              fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="0.8" />
          </g>
        ))}

        {/* ══ ROAD ══ */}
        <rect x="0" y="256" width="1440" height="44" fill="#120E08" />
        <line x1="0" y1="257" x2="1440" y2="257" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
        {ROAD_DASHES.map(x => (
          <rect key={x} x={x} y="275" width="74" height="5" rx="2"
            fill="rgba(255,218,70,0.52)" />
        ))}

        {/* ══ SIGN GROUND LIGHT POOL ══ */}
        <ellipse cx="720" cy="258" rx="200" ry="32" fill="url(#ms-pool)" />

        {/* ══ SIGN POSTS ══ */}
        <rect x="630" y="214" width="13" height="88" rx="4" fill="#221408" />
        <rect x="797" y="214" width="13" height="88" rx="4" fill="#221408" />
        {/* Base feet */}
        <rect x="618" y="298" width="37" height="7" rx="2" fill="#2E1C0A" />
        <rect x="785" y="298" width="37" height="7" rx="2" fill="#2E1C0A" />
        {/* Cross-arm (top of posts) */}
        <rect x="625" y="210" width="190" height="7" rx="3" fill="#2A1A0A" />

        {/* ══ MAIN SIGN BOARD ══ */}
        {/* Drop shadow */}
        <rect x="518" y="58" width="404" height="122" rx="6" fill="rgba(0,0,0,0.45)" />
        {/* Board body */}
        <rect x="514" y="52" width="412" height="122" rx="5" fill="url(#ms-board)"
          stroke="#1C6438" strokeWidth="1.8" />
        {/* Inner border frame */}
        <rect x="520" y="58" width="400" height="110" rx="4" fill="none"
          stroke="rgba(44,180,100,0.28)" strokeWidth="0.8" />

        {/* Top rule lines */}
        <line x1="534" y1="82" x2="906" y2="82" stroke="rgba(255,255,255,0.18)" strokeWidth="0.8" />
        <line x1="534" y1="85" x2="906" y2="85" stroke="rgba(255,255,255,0.09)" strokeWidth="0.5" />

        {/* "ROUTE 9" overline */}
        <text x="720" y="78" textAnchor="middle" fontSize="12"
          fontFamily="'Courier New',Courier,monospace" fontWeight="700"
          letterSpacing="0.34em" fill="rgba(200,170,90,0.82)">
          ROUTE  9
        </text>

        {/* Main name */}
        <text x="720" y="120" textAnchor="middle" fontSize="38"
          fontFamily="'Palatino Linotype','Palatino','Book Antiqua',Georgia,serif"
          fontWeight="900" letterSpacing="0.05em" fill="#FFFFFF">
          MOTOR  INN
        </text>

        {/* Tagline */}
        <text x="720" y="143" textAnchor="middle" fontSize="9"
          fontFamily="'Courier New',Courier,monospace" letterSpacing="0.24em"
          fill="rgba(160,240,190,0.50)">
          SHREWSBURY,  MASSACHUSETTS
        </text>

        {/* Corner bolts */}
        {[[528,62],[884,62],[528,162],[884,162]].map(([bx,by], i) => (
          <circle key={i} cx={bx} cy={by} r="5" fill="url(#ms-bolt)" stroke="rgba(255,255,255,0.12)" strokeWidth="0.8"/>
        ))}

        {/* Mounting bracket arms */}
        <rect x="608" y="170" width="30" height="8" rx="2" fill="#2E1C0A" />
        <rect x="802" y="170" width="30" height="8" rx="2" fill="#2E1C0A" />

        {/* ══ VACANCY PANEL ══ */}
        {/* Panel background */}
        <rect x="572" y="182" width="296" height="62" rx="4"
          fill="#080406" stroke="rgba(255,255,255,0.07)" strokeWidth="1" />
        {/* Vacancy color tint */}
        {open !== null && (
          <rect x="572" y="182" width="296" height="62" rx="4" fill={vacancyTint} />
        )}
        {/* Vacancy text — neon-flicker reused from globals.css */}
        {open !== null && (
          <text
            x="720" y="215"
            textAnchor="middle"
            fontSize="28"
            fontFamily="'Courier New',Courier,monospace"
            fontWeight="900"
            letterSpacing={open ? "0.24em" : "0.14em"}
            fill={vacancyFill}
            className="neon-flicker"
            filter="url(#ms-neon)"
          >
            {vacancyText}
          </text>
        )}
        {/* Hours / message sub-text */}
        {open !== null && (
          <text
            x="720" y="235"
            textAnchor="middle"
            fontSize="7.5"
            fontFamily="'Courier New',Courier,monospace"
            letterSpacing="0.15em"
            fill="rgba(255,255,255,0.34)"
          >
            {subText}
          </text>
        )}

        {/* ══ AMENITIES STRIP ══ */}
        <rect x="514" y="252" width="412" height="22" rx="3"
          fill="#050303" stroke="rgba(212,104,42,0.24)" strokeWidth="1" />
        <text x="720" y="265" textAnchor="middle" fontSize="7.5"
          fontFamily="'Courier New',Courier,monospace" fontWeight="700"
          letterSpacing="0.17em" fill="rgba(212,104,42,0.68)">
          FREE PREVIEW  ·  48 HR BUILD  ·  NO CONTRACTS  ·  YOU OWN IT
        </text>

        {/* ── Suspension wires from sign to posts ── */}
        <path d="M636,52 Q650,48 638,212" stroke="rgba(60,44,20,0.40)" strokeWidth="1" fill="none"/>
        <path d="M804,52 Q792,48 804,212" stroke="rgba(60,44,20,0.35)" strokeWidth="1" fill="none"/>
      </svg>
    </div>
  );
}
