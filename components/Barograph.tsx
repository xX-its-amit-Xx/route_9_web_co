"use client";

// Barograph ───────────────────────────────────────────────────────────────────
//
// Vintage scientific barograph styled as a "Site Health Monitor" — a brass-
// and-glass recording instrument whose ink arm draws a 90-day uptime trace
// across graph paper on scroll reveal. CSS stroke-dashoffset animates the
// trace; React state triggers it on IntersectionObserver entry.
// Placed between RetroTV and MaintenanceFAQ.

import { useEffect, useRef, useState } from "react";

// The performance trace SVG path (launch → steady → maintenance dip → recovery)
const TRACE =
  "M 218,208 C 242,203 272,194 312,187 " +
  "C 345,182 382,188 422,193 " +
  "C 447,197 458,214 468,256 " +
  "C 478,294 492,290 512,264 " +
  "C 528,244 544,200 562,180 " +
  "C 582,169 614,170 652,173";

// Tick positions on the grid
const H_LINES: number[] = [122, 143, 164, 185, 206, 227, 248, 269, 290, 311, 332];
const V_LINES: number[] = [218, 262, 306, 350, 394, 438, 482, 526, 570, 614, 652];
const V_MAJOR: number[] = [306, 438, 570];  // 30-, 60-, 90-day marks

// Annotation blips on the trace
const ANNOTATIONS: { x: number; y: number; label: string; above: boolean }[] = [
  { x: 242, y: 202, label: "LAUNCH",     above: true  },
  { x: 476, y: 300, label: "TUNE-UP",    above: false },
  { x: 640, y: 162, label: "PEAK FORM",  above: true  },
];

export function Barograph() {
  const [active, setActive] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e?.isIntersecting) { setActive(true); obs.disconnect(); } },
      { threshold: 0.20 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{
        background: "linear-gradient(180deg, #080503 0%, #0e0804 100%)",
        padding: "5rem 1.5rem 4rem",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* Warm glow */}
      <div aria-hidden style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        background: "radial-gradient(ellipse at 50% 60%, rgba(160,90,16,0.06) 0%, transparent 62%)",
      }}/>

      {/* Label */}
      <p style={{
        textAlign: "center",
        fontSize: "9px", letterSpacing: "0.32em", textTransform: "uppercase",
        color: "rgba(212,104,42,0.38)", fontFamily: "monospace",
        marginBottom: "0.4rem",
        opacity: active ? 1 : 0, transition: "opacity 0.5s ease 0.1s",
      }}>
        Route 9 Web Co. · Site Health Monitor · Model IX
      </p>
      <p style={{
        textAlign: "center", marginBottom: "2rem",
        fontSize: "11px", letterSpacing: "0.06em",
        color: "rgba(243,233,213,0.22)",
        fontFamily: "var(--font-display, Georgia), Georgia, serif", fontStyle: "italic",
        opacity: active ? 1 : 0, transition: "opacity 0.5s ease 0.18s",
      }}>
        90-day uptime record — always watching, always on
      </p>

      {/* Instrument */}
      <div style={{
        maxWidth: "880px", margin: "0 auto",
        opacity: active ? 1 : 0,
        transform: active ? "translateY(0)" : "translateY(24px)",
        transition: "opacity 0.7s cubic-bezier(0.22,1,0.36,1) 0.2s, transform 0.7s cubic-bezier(0.22,1,0.36,1) 0.2s",
      }}>
        <svg
          viewBox="0 0 880 440"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ display: "block", width: "100%", height: "auto" }}
          role="img"
          aria-label="Vintage barograph showing Route 9 website uptime over 90 days"
        >
          <defs>
            <linearGradient id="bg-housing" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"   stopColor="#2e1e0a" />
              <stop offset="100%" stopColor="#1e1206" />
            </linearGradient>
            <linearGradient id="bg-base" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"   stopColor="#3e2810" />
              <stop offset="100%" stopColor="#2a1808" />
            </linearGradient>
            <linearGradient id="bg-paper" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"   stopColor="#f4e8c8" />
              <stop offset="100%" stopColor="#ede0b8" />
            </linearGradient>
            <linearGradient id="bg-drum-left" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%"   stopColor="#1a1006" />
              <stop offset="100%" stopColor="#c8a050" />
            </linearGradient>
            <linearGradient id="bg-drum-right" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%"   stopColor="#c8a050" />
              <stop offset="100%" stopColor="#1a1006" />
            </linearGradient>
            <linearGradient id="bg-arm" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%"   stopColor="#c8a050" />
              <stop offset="60%"  stopColor="#e0bc70" />
              <stop offset="100%" stopColor="#b89040" />
            </linearGradient>
            <radialGradient id="bg-glass" cx="40%" cy="30%" r="70%">
              <stop offset="0%"   stopColor="rgba(255,255,255,0.06)" />
              <stop offset="100%" stopColor="rgba(255,255,255,0)" />
            </radialGradient>
            <filter id="bg-shadow" x="-6%" y="-6%" width="112%" height="128%">
              <feDropShadow dx="0" dy="12" stdDeviation="18"
                floodColor="rgba(0,0,0,0.85)" floodOpacity="1"/>
            </filter>
            <clipPath id="bg-paper-clip">
              <rect x="208" y="112" width="454" height="230" rx="0"/>
            </clipPath>
          </defs>

          {/* ── WOODEN BASE ── */}
          <rect x="60" y="378" width="760" height="48" rx="8"
            fill="url(#bg-base)" filter="url(#bg-shadow)"/>
          {/* Base grain lines */}
          {[100, 200, 340, 500, 660, 760].map(bx => (
            <line key={bx} x1={bx} y1="378" x2={bx} y2="426"
              stroke="rgba(0,0,0,0.20)" strokeWidth="1"/>
          ))}
          {/* Base top bevel */}
          <rect x="60" y="378" width="760" height="5" rx="3"
            fill="rgba(255,255,255,0.05)"/>
          {/* Base front bevel */}
          <rect x="60" y="421" width="760" height="5" rx="2"
            fill="rgba(0,0,0,0.25)"/>
          {/* Rubber feet */}
          {[110, 440, 770].map(fx => (
            <ellipse key={fx} cx={fx} cy="428" rx="18" ry="5" fill="#0c0804"/>
          ))}

          {/* ── HOUSING BODY ── */}
          <rect x="72" y="90" width="736" height="292" rx="12"
            fill="url(#bg-housing)" filter="url(#bg-shadow)"/>
          {/* Housing top rail */}
          <rect x="72" y="90" width="736" height="10" rx="6"
            fill="rgba(200,160,80,0.18)"/>

          {/* ── DRUM (paper cylinder) ── */}
          {/* Left drum cap */}
          <ellipse cx="208" cy="227" rx="18" ry="115"
            fill="url(#bg-drum-left)" opacity="0.9"/>
          {/* Right drum cap */}
          <ellipse cx="662" cy="227" rx="18" ry="115"
            fill="url(#bg-drum-right)" opacity="0.9"/>
          {/* Drum axle LEFT */}
          <ellipse cx="208" cy="227" rx="6" ry="6" fill="#c8a050"/>
          <ellipse cx="208" cy="227" rx="3" ry="3" fill="#8a6820"/>
          {/* Drum axle RIGHT */}
          <ellipse cx="662" cy="227" rx="6" ry="6" fill="#c8a050"/>
          <ellipse cx="662" cy="227" rx="3" ry="3" fill="#8a6820"/>

          {/* ── GRAPH PAPER (drum surface) ── */}
          <rect x="208" y="112" width="454" height="230"
            fill="url(#bg-paper)"/>

          {/* Horizontal grid lines */}
          {H_LINES.map(hy => (
            <line key={hy} x1="208" y1={hy} x2="662" y2={hy}
              stroke="rgba(100,140,180,0.25)" strokeWidth="0.6"/>
          ))}
          {/* Minor vertical lines */}
          {V_LINES.filter(vx => !V_MAJOR.includes(vx)).map(vx => (
            <line key={vx} x1={vx} y1="112" x2={vx} y2="342"
              stroke="rgba(100,140,180,0.18)" strokeWidth="0.5"/>
          ))}
          {/* Major time-division lines */}
          {V_MAJOR.map(vx => (
            <line key={vx} x1={vx} y1="112" x2={vx} y2="342"
              stroke="rgba(100,140,180,0.45)" strokeWidth="0.9"/>
          ))}

          {/* Y-axis labels */}
          {[
            [112, "100%"], [164, "75%"], [227, "50%"], [290, "25%"], [342, "0%"],
          ].map(([y, label]) => (
            <text key={label} x="202" y={Number(y) + 3.5} textAnchor="end"
              fill="rgba(60,40,10,0.40)" fontSize="7.5" fontFamily="monospace">
              {label}
            </text>
          ))}

          {/* X-axis time labels */}
          {[[306, "30 DAYS"], [438, "60 DAYS"], [570, "90 DAYS"]].map(([x, label]) => (
            <text key={label} x={Number(x)} y="352" textAnchor="middle"
              fill="rgba(60,40,10,0.38)" fontSize="7.5" fontFamily="monospace">
              {label}
            </text>
          ))}

          {/* "UPTIME" Y-axis label */}
          <text x="196" y="232" textAnchor="middle"
            fill="rgba(60,40,10,0.30)" fontSize="7" fontFamily="monospace"
            transform="rotate(-90 196 232)" letterSpacing="1">
            UPTIME %
          </text>

          {/* ── ANIMATED INK TRACE ── */}
          <g clipPath="url(#bg-paper-clip)">
            {/* Trace glow (subtle) */}
            <path
              d={TRACE}
              stroke="rgba(30,90,20,0.22)"
              strokeWidth="6"
              strokeLinecap="round"
              fill="none"
              style={{
                strokeDasharray: 1600,
                strokeDashoffset: active ? 0 : 1600,
                transition: active ? "stroke-dashoffset 5.0s ease-out 0.5s" : "none",
              }}
            />
            {/* Trace main line */}
            <path
              d={TRACE}
              stroke="#1a6010"
              strokeWidth="2.2"
              strokeLinecap="round"
              fill="none"
              style={{
                strokeDasharray: 1600,
                strokeDashoffset: active ? 0 : 1600,
                transition: active ? "stroke-dashoffset 5.0s ease-out 0.5s" : "none",
              }}
            />
          </g>

          {/* ── TRACE ANNOTATIONS ── */}
          {ANNOTATIONS.map(({ x, y, label, above }) => (
            <g key={label} style={{
              opacity: active ? 1 : 0,
              transition: active ? "opacity 0.4s ease 5.2s" : "none",
            }}>
              <circle cx={x} cy={y} r="3.5" fill="#1a6010" opacity="0.8"/>
              <line x1={x} y1={above ? y - 4 : y + 4}
                x2={x} y2={above ? y - 16 : y + 16}
                stroke="#1a6010" strokeWidth="0.8" opacity="0.6"/>
              <text x={x} y={above ? y - 20 : y + 24} textAnchor="middle"
                fill="#2a6818" fontSize="7" fontFamily="monospace"
                fontWeight="bold" letterSpacing="0.5">
                {label}
              </text>
            </g>
          ))}

          {/* ── BRASS RECORDER ARM ── */}
          {/* Pivot mount on left housing wall */}
          <rect x="78" y="218" width="20" height="18" rx="3"
            fill="#c8a050" stroke="#a08030" strokeWidth="0.8"/>
          <circle cx="88" cy="227" r="4" fill="#8a6020"/>
          {/* Arm — extends to trace endpoint */}
          <path d="M 88,227 C 200,220 430,202 652,173"
            stroke="url(#bg-arm)" strokeWidth="4.5" strokeLinecap="round" fill="none"/>
          <path d="M 88,227 C 200,220 430,202 652,173"
            stroke="rgba(255,220,120,0.20)" strokeWidth="2" strokeLinecap="round" fill="none"/>
          {/* Pen nib at tip */}
          <polygon points="652,173 648,170 648,176"
            fill="#1a6010" opacity="0.9"/>
          <polygon points="652,173 659,172 659,174"
            fill="#c8a050"/>

          {/* ── CLOCK MECHANISM (decorative, lower-left) ── */}
          <g transform="translate(130, 330)">
            <circle cx="0" cy="0" r="28" fill="#1a1006"
              stroke="#c8a050" strokeWidth="1.5"/>
            <circle cx="0" cy="0" r="24" fill="none"
              stroke="rgba(200,160,80,0.15)" strokeWidth="0.8"/>
            {/* Hour markers */}
            {[0,30,60,90,120,150,180,210,240,270,300,330].map(a => (
              <line key={a}
                x1={0 + 19 * Math.sin(a * Math.PI / 180)}
                y1={0 - 19 * Math.cos(a * Math.PI / 180)}
                x2={0 + 23 * Math.sin(a * Math.PI / 180)}
                y2={0 - 23 * Math.cos(a * Math.PI / 180)}
                stroke="rgba(200,160,80,0.4)" strokeWidth={a % 90 === 0 ? 1.2 : 0.7}/>
            ))}
            {/* Clock hands */}
            <line x1="0" y1="0" x2="0" y2="-16" stroke="#c8a050" strokeWidth="1.8" strokeLinecap="round"/>
            <line x1="0" y1="0" x2="11" y2="-7" stroke="#c8a050" strokeWidth="1.2" strokeLinecap="round"/>
            <circle cx="0" cy="0" r="2" fill="#c8a050"/>
            {/* "ROUTE 9" on clock face */}
            <text x="0" y="9" textAnchor="middle"
              fill="rgba(200,160,80,0.35)" fontSize="4.5" fontFamily="monospace" letterSpacing="0.4">
              RTE 9
            </text>
          </g>

          {/* ── PRESSURE BELLOWS (decorative, right side) ── */}
          <g transform="translate(754, 240)">
            {[0,1,2,3,4,5].map(n => (
              <ellipse key={n} cx="0" cy={n * 16 - 40} rx="24" ry="7"
                fill="none" stroke="#c8a050" strokeWidth="1.2" opacity="0.35"/>
            ))}
            <rect x="-16" y="-48" width="32" height="6" rx="2"
              fill="#c8a050" opacity="0.4"/>
            <rect x="-16" y="38" width="32" height="6" rx="2"
              fill="#c8a050" opacity="0.4"/>
          </g>

          {/* ── GLASS DOME SHEEN ── */}
          <ellipse cx="435" cy="227" rx="232" ry="122"
            fill="url(#bg-glass)" stroke="rgba(255,255,255,0.05)" strokeWidth="1"/>

          {/* ── BRASS CORNER MOUNTS ── */}
          {[[72,90],[796,90],[72,378],[796,378]].map(([mx,my],i) => (
            <circle key={i} cx={mx} cy={my} r="6.5"
              fill="#c8a050" stroke="#a08030" strokeWidth="0.8" opacity="0.8"/>
          ))}

          {/* ── BRASS BRAND PLATE on base ── */}
          <rect x="310" y="388" width="260" height="26" rx="3"
            fill="rgba(200,160,60,0.14)" stroke="rgba(200,160,60,0.35)" strokeWidth="0.8"/>
          <text x="440" y="398.5" textAnchor="middle"
            fill="rgba(200,160,60,0.72)" fontSize="7.5" fontFamily="monospace"
            fontWeight="bold" letterSpacing="1.4">
            ROUTE 9 WEB CO.
          </text>
          <text x="440" y="409" textAnchor="middle"
            fill="rgba(200,160,60,0.50)" fontSize="6" fontFamily="monospace"
            letterSpacing="1.2">
            SITE HEALTH MONITOR · MODEL IX
          </text>

          {/* ── UPTIME BADGE (top-right of paper) ── */}
          <g style={{
            opacity: active ? 1 : 0,
            transition: active ? "opacity 0.5s ease 5.5s" : "none",
          }}>
            <rect x="584" y="118" width="72" height="30" rx="3"
              fill="rgba(30,90,20,0.20)" stroke="rgba(30,150,20,0.35)" strokeWidth="0.8"/>
            <text x="620" y="130" textAnchor="middle"
              fill="#2a8018" fontSize="9" fontFamily="monospace" fontWeight="bold">
              99.9%
            </text>
            <text x="620" y="142" textAnchor="middle"
              fill="rgba(30,120,20,0.65)" fontSize="6" fontFamily="monospace">
              UPTIME
            </text>
          </g>
        </svg>
      </div>

      {/* Caption */}
      <p style={{
        textAlign: "center", marginTop: "1.2rem",
        fontSize: "10px", letterSpacing: "0.14em",
        color: "rgba(243,233,213,0.18)", fontFamily: "monospace",
        opacity: active ? 1 : 0,
        transition: "opacity 0.5s ease 1.2s",
      }}>
        We don&apos;t just launch it. We watch it. Every day.
      </p>
    </div>
  );
}
