"use client";

import { useState, useEffect } from "react";

// Deterministic star field — no random at render time (avoids SSR hydration mismatch)
const STARS = [
  { x: 16,  y: 14,  r: 0.9,  d: 0.0  },
  { x: 52,  y: 8,   r: 1.25, d: 1.2  },
  { x: 87,  y: 22,  r: 0.7,  d: 0.6  },
  { x: 126, y: 9,   r: 1.1,  d: 2.0  },
  { x: 160, y: 17,  r: 0.8,  d: 0.4  },
  { x: 196, y: 7,   r: 1.0,  d: 1.7  },
  { x: 228, y: 28,  r: 0.65, d: 0.9  },
  { x: 270, y: 11,  r: 1.2,  d: 2.4  },
  { x: 299, y: 23,  r: 0.75, d: 0.5  },
  { x: 334, y: 8,   r: 1.1,  d: 1.1  },
  { x: 366, y: 19,  r: 0.85, d: 1.8  },
  { x: 402, y: 10,  r: 1.3,  d: 0.4  },
  { x: 438, y: 21,  r: 0.6,  d: 2.2  },
  { x: 462, y: 13,  r: 1.05, d: 0.8  },
  { x: 37,  y: 44,  r: 0.7,  d: 1.5  },
  { x: 76,  y: 52,  r: 1.0,  d: 0.2  },
  { x: 144, y: 46,  r: 0.8,  d: 2.8  },
  { x: 312, y: 38,  r: 1.0,  d: 1.3  },
  { x: 422, y: 48,  r: 0.7,  d: 0.7  },
  { x: 456, y: 34,  r: 1.15, d: 2.1  },
];

// Roman numerals, 0 = 12 o'clock position
const NUMERALS = [
  "XII","I","II","III","IV","V","VI","VII","VIII","IX","X","XI",
] as const;

// Clock face geometry
const CX = 240;
const CY = 130;
const R  = 35; // clock face radius

function getEasternTime(): { h: number; m: number; s: number } {
  try {
    const now   = new Date();
    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone : "America/New_York",
      hour     : "2-digit",
      minute   : "2-digit",
      second   : "2-digit",
      hour12   : false,
    }).formatToParts(now);
    const n = (t: string) =>
      parseInt(parts.find((p) => p.type === t)?.value ?? "0", 10);
    const h = n("hour");
    return { h: h >= 24 ? 0 : h, m: n("minute"), s: n("second") };
  } catch {
    const d = new Date();
    return { h: d.getHours(), m: d.getMinutes(), s: d.getSeconds() };
  }
}

export function ShrewsburyClockTower() {
  // null on server → no hydration mismatch; populated after mount
  const [time, setTime] = useState<{ h: number; m: number; s: number } | null>(
    null
  );

  useEffect(() => {
    setTime(getEasternTime());
    const id = setInterval(() => setTime(getEasternTime()), 1000);
    return () => clearInterval(id);
  }, []);

  const hourDeg   = time
    ? ((time.h % 12) / 12) * 360 + (time.m / 60) * 30
    : 0;
  const minuteDeg = time ? (time.m / 60) * 360 + (time.s / 60) * 6 : 0;
  const secondDeg = time ? (time.s / 60) * 360 : 0;

  const displayTime = time
    ? (() => {
        const h12  = time.h % 12 || 12;
        const ampm = time.h >= 12 ? "PM" : "AM";
        return `${String(h12).padStart(2, "0")}:${String(time.m).padStart(2, "0")} ${ampm}`;
      })()
    : "";

  return (
    <div
      className="relative overflow-hidden select-none pointer-events-none"
      aria-label={
        displayTime
          ? `Current time in Shrewsbury, MA: ${displayTime}`
          : "Shrewsbury, MA clock tower"
      }
      style={{
        background   : "linear-gradient(180deg, #05060E 0%, #080A14 55%, #0B0D18 100%)",
        borderTop    : "1px solid rgba(255,255,255,0.04)",
        borderBottom : "1px solid rgba(212,104,42,0.09)",
      }}
    >
      <svg
        viewBox="0 0 480 295"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: "100%", display: "block" }}
        aria-hidden
      >

        {/* ── Background sky ── */}
        <rect x="0" y="0" width="480" height="295" fill="url(#tower-sky)" />

        {/* ── Stars ── */}
        {STARS.map((s, i) => (
          <circle
            key={i}
            cx={s.x}
            cy={s.y}
            r={s.r}
            fill="rgba(255,248,220,0.88)"
            className="ct-star"
            style={{ animationDelay: `${s.d}s` } as React.CSSProperties}
          />
        ))}

        {/* ── Crescent moon ── */}
        <circle cx="398" cy="40" r="22" fill="rgba(255,242,195,0.15)" />
        {/* occlusion circle shifts right+up to carve the crescent */}
        <circle cx="407" cy="35" r="20" fill="#060810" />
        {/* soft halo */}
        <circle cx="398" cy="40" r="28" fill="rgba(255,230,140,0.04)" />

        {/* ── Ambient clock glow (behind clock face) ── */}
        <circle cx={CX} cy={CY} r="62" fill="rgba(212,104,42,0.06)" />
        <circle cx={CX} cy={CY} r="48" fill="rgba(255,210,100,0.055)" />

        {/* ══════════════════════════════════════════════
            TOWER STRUCTURE (bottom → top)
            ══════════════════════════════════════════ */}

        {/* Ground line */}
        <rect x="0" y="260" width="480" height="35"
          fill="rgba(12,10,7,0.9)" />
        <line x1="0" y1="260" x2="480" y2="260"
          stroke="rgba(212,104,42,0.08)" strokeWidth="0.75" />

        {/* Broad stone platform / plinth */}
        <rect x="164" y="248" width="152" height="14" rx="2"
          fill="rgba(160,138,108,0.28)"
          stroke="rgba(255,255,255,0.05)" strokeWidth="0.8" />
        <rect x="164" y="248" width="152" height="14" rx="2"
          fill="url(#stone-hatch)" />
        {/* Cap shadow */}
        <rect x="160" y="246" width="160" height="4" rx="1.5"
          fill="rgba(0,0,0,0.32)" />

        {/* Main tower body */}
        <rect x="196" y="160" width="88" height="90"
          fill="rgba(136,114,88,0.30)"
          stroke="rgba(255,255,255,0.055)" strokeWidth="0.8" />
        <rect x="196" y="160" width="88" height="90"
          fill="url(#stone-hatch)" />

        {/* Tower body: horizontal floor lines (masonry courses) */}
        {[180, 200, 220, 238].map((ly) => (
          <line key={ly}
            x1="196" y1={ly} x2="284" y2={ly}
            stroke="rgba(255,255,255,0.03)" strokeWidth="0.6" />
        ))}

        {/* Lit windows on main body */}
        {[215, 253].map((wx) => (
          <g key={wx}>
            <rect x={wx} y="172" width="14" height="20" rx="3"
              fill="rgba(255,185,70,0.20)"
              stroke="rgba(255,200,100,0.16)" strokeWidth="0.5" />
            {/* Cross bar */}
            <line x1={wx}    y1="182" x2={wx+14} y2="182"
              stroke="rgba(200,160,60,0.18)" strokeWidth="0.7" />
            <line x1={wx+7}  y1="172" x2={wx+7}  y2="192"
              stroke="rgba(200,160,60,0.18)" strokeWidth="0.7" />
            {/* Warm glow bleed */}
            <rect x={wx-4} y="168" width="22" height="28" rx="3"
              fill="rgba(255,170,50,0.05)" />
          </g>
        ))}

        {/* Belfry (narrower) */}
        <rect x="208" y="98" width="64" height="64"
          fill="rgba(122,102,78,0.28)"
          stroke="rgba(255,255,255,0.055)" strokeWidth="0.8" />
        <rect x="208" y="98" width="64" height="64"
          fill="url(#stone-hatch)" />

        {/* Belfry narrow arched openings */}
        {[220, 248].map((bx) => (
          <g key={bx}>
            {/* Rect with top arc */}
            <rect x={bx} y="108" width="12" height="22" rx="5"
              fill="rgba(15,12,8,0.88)"
              stroke="rgba(255,255,255,0.04)" strokeWidth="0.5" />
          </g>
        ))}

        {/* String course between belfry bottom and clock */}
        <rect x="204" y="96" width="72" height="4" rx="1"
          fill="rgba(175,150,118,0.28)"
          stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" />

        {/* Clock face surround (stone collar) */}
        <circle cx={CX} cy={CY} r={R + 6}
          fill="rgba(95,78,58,0.32)"
          stroke="rgba(200,170,120,0.13)" strokeWidth="1" />

        {/* Clock face */}
        <circle cx={CX} cy={CY} r={R}
          fill="rgba(252,245,215,0.90)"
          stroke="rgba(212,104,42,0.65)" strokeWidth="1.6" />

        {/* Inner decorative ring */}
        <circle cx={CX} cy={CY} r={R - 4}
          fill="none"
          stroke="rgba(160,120,70,0.22)" strokeWidth="0.75" />

        {/* 60 tick marks */}
        {Array.from({ length: 60 }).map((_, i) => {
          const angle   = (i / 60) * Math.PI * 2 - Math.PI / 2;
          const isHour  = i % 5 === 0;
          const isQuart = i % 15 === 0;
          const r1 = R - (isQuart ? 7 : isHour ? 5 : 2);
          const r2 = R - 1;
          return (
            <line
              key={i}
              x1={CX + r1 * Math.cos(angle)}
              y1={CY + r1 * Math.sin(angle)}
              x2={CX + r2 * Math.cos(angle)}
              y2={CY + r2 * Math.sin(angle)}
              stroke={isHour ? "rgba(70,48,28,0.72)" : "rgba(140,115,85,0.32)"}
              strokeWidth={isQuart ? 1.4 : isHour ? 1.0 : 0.6}
              strokeLinecap="round"
            />
          );
        })}

        {/* Roman numerals */}
        {NUMERALS.map((num, i) => {
          const angle = (i / 12) * Math.PI * 2 - Math.PI / 2;
          const nr    = R - 12;
          return (
            <text
              key={num}
              x={CX + nr * Math.cos(angle)}
              y={CY + nr * Math.sin(angle) + 2.5}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize={num.length > 3 ? "4.5" : "5.5"}
              fontWeight="600"
              fontFamily="'Times New Roman', Georgia, serif"
              fill="rgba(55,36,18,0.84)"
            >
              {num}
            </text>
          );
        })}

        {/* ── Clock hands ── */}

        {/* Hour hand */}
        <line
          x1={CX} y1={CY + 5}
          x2={CX} y2={CY - 21}
          stroke="rgba(38,24,10,0.94)"
          strokeWidth="3.2"
          strokeLinecap="round"
          transform={`rotate(${hourDeg}, ${CX}, ${CY})`}
        />

        {/* Minute hand */}
        <line
          x1={CX} y1={CY + 7}
          x2={CX} y2={CY - 29}
          stroke="rgba(38,24,10,0.90)"
          strokeWidth="2.0"
          strokeLinecap="round"
          transform={`rotate(${minuteDeg}, ${CX}, ${CY})`}
        />

        {/* Second hand — only after hydration to avoid flash */}
        {time && (
          <line
            x1={CX} y1={CY + 9}
            x2={CX} y2={CY - 32}
            stroke="rgba(212,104,42,0.90)"
            strokeWidth="1.0"
            strokeLinecap="round"
            transform={`rotate(${secondDeg}, ${CX}, ${CY})`}
          />
        )}

        {/* Center pivot caps */}
        <circle cx={CX} cy={CY} r="4"   fill="rgba(38,24,10,0.92)" />
        <circle cx={CX} cy={CY} r="1.8" fill="rgba(212,104,42,0.82)" />

        {/* ══ CUPOLA & SPIRE ═══════════════════════════ */}

        {/* Cupola trapezoid */}
        <path d="M208 98 L228 76 L252 76 L272 98 Z"
          fill="rgba(108,88,66,0.38)"
          stroke="rgba(255,255,255,0.065)" strokeWidth="0.8" />

        {/* Dome arc */}
        <path d="M228 76 Q240 60 252 76 Z"
          fill="rgba(95,78,58,0.42)"
          stroke="rgba(255,255,255,0.065)" strokeWidth="0.8" />

        {/* Spire */}
        <polygon
          points={`${CX-3},60 ${CX},18 ${CX+3},60`}
          fill="rgba(178,152,118,0.52)"
          stroke="rgba(255,255,255,0.09)" strokeWidth="0.6"
        />

        {/* Finial ball */}
        <circle cx={CX} cy="18" r="3"
          fill="rgba(212,104,42,0.55)"
          stroke="rgba(255,220,130,0.2)" strokeWidth="0.8" />

        {/* Weather vane arms */}
        <line x1={CX-12} y1="18" x2={CX+14} y2="18"
          stroke="rgba(212,104,42,0.40)" strokeWidth="0.9" strokeLinecap="round" />
        <polygon points={`${CX+14},14 ${CX+20},18 ${CX+14},22`}
          fill="rgba(212,104,42,0.38)" />

        {/* ══ WATER LINE & REFLECTION ══════════════════ */}

        {/* Faint distant tree line */}
        {[45,80,115,150,185,330,365,395].map((tx, ti) => (
          <polygon key={ti}
            points={`${tx},260 ${tx+7},245 ${tx+14},260`}
            fill={`rgba(20,32,18,${0.55 - (ti % 3) * 0.08})`}
          />
        ))}

        {/* Water shimmer lines */}
        {([0,8,16,24] as const).map((offset, wi) => (
          <line
            key={wi}
            x1="60" y1={264 + offset}
            x2="420" y2={264 + offset}
            stroke={`rgba(212,104,42,${0.07 - wi * 0.012})`}
            strokeWidth="0.8"
            strokeDasharray={`${16 + wi * 7} ${14 + wi * 5}`}
            strokeLinecap="round"
            className="ct-water"
            style={{ animationDelay: `${wi * 0.35}s` } as React.CSSProperties}
          />
        ))}

        {/* ══ LABELS ═══════════════════════════════════ */}

        {/* "SHREWSBURY · MA" over the tower */}
        <text x={CX} y="68"
          textAnchor="middle"
          fontSize="7" fontWeight="700"
          fontFamily="'Courier New', Courier, monospace"
          fill="rgba(212,104,42,0.42)"
          letterSpacing="0.24em"
        >
          SHREWSBURY · MA
        </text>

        {/* Live time */}
        {displayTime && (
          <text
            x={CX} y="280"
            textAnchor="middle"
            fontSize="12.5" fontWeight="700"
            fontFamily="'Courier New', Courier, monospace"
            fill="rgba(255,218,130,0.72)"
            letterSpacing="0.14em"
          >
            {displayTime}
          </text>
        )}
        <text x={CX} y="292"
          textAnchor="middle"
          fontSize="6" fontFamily="monospace"
          fill="rgba(212,104,42,0.32)"
          letterSpacing="0.22em"
        >
          LOCAL TIME · EASTERN
        </text>

        {/* Italic tagline — bottom left */}
        <text x="26" y="289"
          fontSize="7.5"
          fontFamily="Georgia, 'Times New Roman', serif"
          fontStyle="italic"
          fill="rgba(243,233,213,0.18)"
          letterSpacing="0.03em"
        >
          It&apos;s always a good time to get started.
        </text>

        {/* ── Defs ── */}
        <defs>
          <linearGradient id="tower-sky" x1="0" y1="0" x2="0" y2="1"
            gradientUnits="objectBoundingBox">
            <stop offset="0%"   stopColor="#030508" />
            <stop offset="60%"  stopColor="#080A13" />
            <stop offset="100%" stopColor="#0C0F1A" />
          </linearGradient>

          {/* Diagonal hatching for stone texture */}
          <pattern id="stone-hatch"
            patternUnits="userSpaceOnUse" width="8" height="8">
            <path d="M0 8 L8 0"
              stroke="rgba(255,255,255,0.025)" strokeWidth="0.5" />
          </pattern>
        </defs>
      </svg>
    </div>
  );
}
