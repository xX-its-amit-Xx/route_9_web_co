"use client";

/**
 * Vintage maintenance log card — the kind of paper service log a mechanic
 * or building super would clip into a binder. Used as a decorative
 * companion to the MaintenanceFAQ section so the section reads more like
 * a real "service department" than a generic FAQ.
 *
 * Built as a single SVG:
 *   - Paper card with subtle aged-paper texture + horizontal rule lines
 *   - Three binder holes punched down the left edge
 *   - Header band: "MAINTENANCE LOG / ROUTE 9 WEB CO." in vintage type
 *   - Service-record rows: date · task · status check
 *   - "ALL CLEAR" rubber stamp tilted across the bottom
 *   - Slight tilt overall so it reads as a real artifact, not a layout box
 *
 * Decorative (aria-hidden). No animations to worry about under
 * prefers-reduced-motion.
 */
export function MaintenanceLog() {
  const ROWS = [
    { date: "MAY 17",  task: "Uptime monitoring",       status: "OK" },
    { date: "MAY 16",  task: "Security patches",        status: "DONE" },
    { date: "MAY 12",  task: "Daily backup",            status: "OK" },
    { date: "MAY 10",  task: "Menu update — pizzeria",  status: "SHIPPED" },
    { date: "MAY 08",  task: "Holiday hours change",    status: "LIVE" },
    { date: "MAY 03",  task: "SSL cert renewal",        status: "OK" },
  ];

  return (
    <div
      aria-hidden
      className="maintenance-log inline-block select-none"
      style={{
        width: 320,
        maxWidth: "100%",
        transform: "rotate(-1.5deg)",
        filter:
          "drop-shadow(0 8px 18px rgba(28,18,9,0.22)) drop-shadow(0 2px 4px rgba(28,18,9,0.18))",
      }}
    >
      <svg
        viewBox="0 0 320 380"
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: "100%", height: "auto", overflow: "visible" }}
      >
        <defs>
          {/* Aged paper gradient */}
          <linearGradient id="ml-paper" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%"   stopColor="#FBF2DC" />
            <stop offset="100%" stopColor="#E8D5A8" />
          </linearGradient>
          {/* Faint coffee-ring vignette */}
          <radialGradient id="ml-vignette" cx="78%" cy="22%" r="35%">
            <stop offset="0%"   stopColor="rgba(168,72,24,0.18)" />
            <stop offset="60%"  stopColor="rgba(168,72,24,0.05)" />
            <stop offset="100%" stopColor="rgba(168,72,24,0)" />
          </radialGradient>
          {/* Halftone fiber texture */}
          <pattern id="ml-fiber" x="0" y="0" width="3" height="3" patternUnits="userSpaceOnUse">
            <circle cx="1" cy="1" r="0.32" fill="rgba(168,72,24,0.15)" />
          </pattern>
        </defs>

        {/* ── Paper body ── */}
        <rect x="6" y="6" width="308" height="368" rx="3"
          fill="url(#ml-paper)" stroke="rgba(168,72,24,0.35)" strokeWidth="0.8" />
        <rect x="6" y="6" width="308" height="368" rx="3" fill="url(#ml-fiber)" opacity="0.6" />
        <rect x="6" y="6" width="308" height="368" rx="3" fill="url(#ml-vignette)" />

        {/* Folded-corner top-right */}
        <path d="M 304 6 L 314 6 L 314 16 Z" fill="rgba(168,72,24,0.18)" stroke="rgba(168,72,24,0.35)" strokeWidth="0.5" />

        {/* ── Three binder holes down the left edge ── */}
        {[60, 190, 320].map((y) => (
          <g key={y} transform={`translate(20 ${y})`}>
            <circle r="7" fill="rgba(0,0,0,0.6)" />
            <circle r="6" fill="#FBF2DC" />
            <circle r="6" fill="none" stroke="rgba(168,72,24,0.5)" strokeWidth="0.5" />
            {/* Reinforcement ring */}
            <circle r="9.5" fill="none" stroke="rgba(168,72,24,0.18)" strokeWidth="0.5" />
          </g>
        ))}

        {/* Vertical margin rule line down the left side */}
        <line x1="40" y1="14" x2="40" y2="366"
          stroke="rgba(168,72,24,0.45)" strokeWidth="0.7" strokeDasharray="2 2" />

        {/* ── Header band ── */}
        <g>
          <rect x="40" y="20" width="270" height="50" rx="1"
            fill="rgba(28,18,9,0.06)" stroke="rgba(168,72,24,0.35)" strokeWidth="0.5" />

          {/* Tiny eyebrow */}
          <text x="175" y="34" textAnchor="middle"
            fontFamily="monospace" fontSize="6.5"
            fontWeight="700" fill="rgba(168,72,24,0.7)"
            letterSpacing="0.32em">
            FORM R9-14B
          </text>
          {/* Title */}
          <text x="175" y="50" textAnchor="middle"
            fontFamily="Georgia, 'Times New Roman', serif"
            fontStyle="italic"
            fontWeight="900"
            fontSize="17"
            fill="#1C1209"
            letterSpacing="0.06em">
            Maintenance Log
          </text>
          {/* Subtitle */}
          <text x="175" y="63" textAnchor="middle"
            fontFamily="monospace" fontSize="7"
            fill="rgba(28,18,9,0.7)"
            letterSpacing="0.28em">
            ROUTE 9 WEB CO. · DEPT. UPKEEP
          </text>
        </g>

        {/* ── Column headers ── */}
        <g
          fontFamily="monospace" fontSize="6.5"
          fontWeight="800"
          fill="rgba(168,72,24,0.85)"
          letterSpacing="0.18em"
        >
          <text x="50"  y="88">DATE</text>
          <text x="120" y="88">TASK</text>
          <text x="278" y="88" textAnchor="end">STATUS</text>
        </g>
        <line x1="48" y1="92" x2="304" y2="92"
          stroke="rgba(168,72,24,0.55)" strokeWidth="0.6" />

        {/* ── Rows ── */}
        {ROWS.map((row, i) => {
          const y = 110 + i * 30;
          return (
            <g key={row.date}>
              {/* Row baseline (faint) */}
              <line x1="48" y1={y + 6} x2="304" y2={y + 6}
                stroke="rgba(168,72,24,0.22)" strokeWidth="0.5" />
              {/* Date */}
              <text x="50" y={y}
                fontFamily="monospace" fontSize="9"
                fontWeight="700" fill="#1C1209"
                letterSpacing="0.1em">
                {row.date}
              </text>
              {/* Task */}
              <text x="120" y={y}
                fontFamily="Georgia, serif"
                fontStyle="italic"
                fontSize="11"
                fill="#3A2415">
                {row.task}
              </text>
              {/* Status pill */}
              <g transform={`translate(278 ${y - 8})`}>
                {/* Hand-checked checkmark to the right of the pill */}
                <path d="M 12 0 L 18 8 L 32 -10"
                  stroke="#A84818" strokeWidth="2.2" fill="none"
                  strokeLinecap="round" strokeLinejoin="round"
                  opacity="0.9"
                />
              </g>
              <text x="276" y={y}
                fontFamily="monospace" fontSize="7.5"
                fontWeight="800" fill="#A84818"
                textAnchor="end"
                letterSpacing="0.16em">
                {row.status}
              </text>
            </g>
          );
        })}

        {/* ── "ALL CLEAR" rubber stamp across the bottom ── */}
        <g transform="translate(190 320) rotate(-8)">
          {/* Outer rounded rect */}
          <rect x="-72" y="-22" width="144" height="44" rx="3"
            fill="none"
            stroke="#A84818"
            strokeWidth="2.4"
            opacity="0.7" />
          {/* Inner ring */}
          <rect x="-67" y="-17" width="134" height="34" rx="2"
            fill="none"
            stroke="#A84818"
            strokeWidth="0.6"
            opacity="0.6" />
          {/* Stamp text */}
          <text x="0" y="-2" textAnchor="middle"
            fontFamily="Georgia, serif"
            fontStyle="italic"
            fontWeight="900"
            fontSize="18"
            fill="#A84818"
            letterSpacing="0.2em"
            opacity="0.82">
            ALL CLEAR
          </text>
          {/* Date underneath */}
          <text x="0" y="14" textAnchor="middle"
            fontFamily="monospace" fontSize="7"
            fontWeight="700"
            fill="#A84818"
            letterSpacing="0.28em"
            opacity="0.7">
            INSPECTED · MAY 2026
          </text>
        </g>

        {/* ── Inspector signature line at the very bottom ── */}
        <line x1="48" y1="355" x2="170" y2="355"
          stroke="rgba(168,72,24,0.7)" strokeWidth="0.6" />
        <text x="48" y="368"
          fontFamily="monospace" fontSize="6.5"
          fill="rgba(28,18,9,0.55)"
          letterSpacing="0.22em">
          INSPECTOR SIGNATURE
        </text>
        {/* Curly mini-signature on the signature line */}
        <path d="M 60 352 q 6 -6 12 -2 q 6 4 14 -2 q 8 -6 18 2 q 6 6 14 -4"
          stroke="#A84818" strokeWidth="1.4" fill="none" strokeLinecap="round" opacity="0.8" />
      </svg>
    </div>
  );
}
