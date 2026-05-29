"use client";

import { useScrollReveal } from "@/lib/useScrollReveal";

const ROWS = [
  { label: "WEBSITE FOR YOUR SHOP",  value: "48 HRS BUILD" },
  { label: "MONTHLY CARE PLAN",      value: "FROM $79/MO"  },
  { label: "FREE DESIGN PREVIEW",    value: "ALWAYS"       },
  { label: "LONG-TERM CONTRACTS",    value: "ZERO"         },
];

export function HighwayMileageSign() {
  const ref = useScrollReveal();

  return (
    <div
      ref={ref}
      className="py-10 md:py-14 flex justify-center items-end overflow-hidden reveal"
      aria-hidden
    >
      {/* Outer wrapper — gentle sway on the whole sign + posts */}
      <div
        className="relative"
        style={{
          animation: "sign-sway 11s ease-in-out infinite",
          transformOrigin: "top center",
        }}
      >
        <svg
          viewBox="0 0 700 300"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ width: "min(700px, 94vw)", display: "block" }}
        >
          {/* ── Mounting posts ── */}
          <rect x="162" y="222" width="14" height="78" rx="3.5" fill="#1E160E" />
          <rect x="524" y="222" width="14" height="78" rx="3.5" fill="#1E160E" />
          {/* Post cap bolts */}
          <rect x="155" y="218" width="28" height="9"  rx="2" fill="#2A1C12" />
          <rect x="517" y="218" width="28" height="9"  rx="2" fill="#2A1C12" />

          {/* ── Sign drop shadow ── */}
          <rect x="22" y="24" width="656" height="204" rx="10" fill="rgba(0,0,0,0.38)" />

          {/* ── Main sign face — highway green ── */}
          <rect x="14" y="16" width="672" height="206" rx="10" fill="#1C6438" />

          {/* Subtle aluminium panel lines (horizontal) */}
          <line x1="14" y1="88"  x2="686" y2="88"  stroke="rgba(0,0,0,0.15)" strokeWidth="0.8" />
          <line x1="14" y1="162" x2="686" y2="162" stroke="rgba(0,0,0,0.15)" strokeWidth="0.8" />

          {/* Inner border frame */}
          <rect x="22" y="24" width="656" height="190" rx="7"
            fill="none" stroke="rgba(255,255,255,0.16)" strokeWidth="1.5" />

          {/* Surface sheen — top-left highlight */}
          <rect x="14" y="16" width="672" height="206" rx="10"
            fill="url(#hwsign-sheen)" />

          {/* ── Corner bolt heads ── */}
          {([[36, 44], [664, 44], [36, 200], [664, 200]] as [number, number][]).map(
            ([cx, cy], i) => (
              <g key={i}>
                <circle cx={cx} cy={cy} r="5.5" fill="#154D2B" stroke="rgba(255,255,255,0.14)" strokeWidth="1.2" />
                {/* Hex-bolt detail lines */}
                <circle cx={cx} cy={cy} r="2" fill="rgba(255,255,255,0.12)" />
              </g>
            )
          )}

          {/* ── Header row ── */}
          <text
            x="340" y="57"
            textAnchor="middle"
            fill="rgba(255,255,255,0.88)"
            fontSize="12"
            fontWeight="700"
            fontFamily="'Courier New', Courier, monospace"
            letterSpacing="0.24em"
          >
            ★  ROUTE 9 WEB GUIDE  ·  SHREWSBURY MA  ★
          </text>

          {/* Header rule */}
          <line x1="34" y1="66" x2="666" y2="66" stroke="rgba(255,255,255,0.14)" strokeWidth="1" />

          {/* ── Route 9 shield badge (top-right) ── */}
          <path
            d="M624 34 L658 45 L658 72 Q658 84 641 91 Q624 84 624 72 L624 45 Z"
            fill="rgba(255,255,255,0.07)"
            stroke="rgba(255,255,255,0.20)"
            strokeWidth="1.2"
          />
          <text x="641" y="57" textAnchor="middle" fontSize="5" fill="rgba(255,255,255,0.55)"
            fontWeight="700" fontFamily="monospace" letterSpacing="1.5">ROUTE</text>
          <text x="641" y="76" textAnchor="middle" fontSize="20" fontStyle="italic"
            fill="rgba(255,255,255,0.82)" fontFamily="Georgia, 'Times New Roman', serif">9</text>

          {/* ── Data rows ── */}
          {ROWS.map(({ label, value }, i) => {
            const y = 103 + i * 34;
            return (
              <g key={label}>
                {/* Chevron arrow */}
                <path
                  d={`M44 ${y - 6} L54 ${y + 1} L44 ${y + 8}`}
                  stroke="rgba(255,255,255,0.6)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                {/* Label text */}
                <text
                  x="66"
                  y={y + 6}
                  fill="rgba(255,255,255,0.9)"
                  fontSize="13.5"
                  fontWeight="600"
                  fontFamily="'Courier New', Courier, monospace"
                  letterSpacing="0.06em"
                >
                  {label}
                </text>
                {/* Dot-leader line */}
                <line
                  x1="330" y1={y + 2}
                  x2="500" y2={y + 2}
                  stroke="rgba(255,255,255,0.2)"
                  strokeWidth="1"
                  strokeDasharray="3 6"
                  strokeLinecap="round"
                />
                {/* Value — right-anchored, lit green-white */}
                <text
                  x="652"
                  y={y + 6}
                  textAnchor="end"
                  fill="rgba(195,255,170,0.9)"
                  fontSize="13.5"
                  fontWeight="700"
                  fontFamily="'Courier New', Courier, monospace"
                  letterSpacing="0.06em"
                >
                  {value}
                </text>
              </g>
            );
          })}

          {/* ── Defs ── */}
          <defs>
            <linearGradient id="hwsign-sheen" x1="0" y1="0" x2="1" y2="1"
              gradientUnits="objectBoundingBox">
              <stop offset="0%"   stopColor="rgba(255,255,255,0.09)" />
              <stop offset="40%"  stopColor="rgba(255,255,255,0.02)" />
              <stop offset="100%" stopColor="rgba(0,0,0,0.10)"       />
            </linearGradient>
          </defs>
        </svg>

        {/* Headlight sweep — a bright diagonal band that slides across the sign */}
        <div
          className="absolute pointer-events-none overflow-hidden"
          style={{
            top: "16px",
            left: "14px",
            right: "14px",
            bottom: "78px",
            borderRadius: "10px",
          }}
        >
          <div className="sign-headlight-beam" aria-hidden />
        </div>
      </div>
    </div>
  );
}
