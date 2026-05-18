"use client";

import { useId } from "react";

type Props = {
  size?: number;
  /** Subtle rotation so it reads as a hand-stamped impression (deg) */
  tilt?: number;
  /** Optional override for the curved tagline */
  tagline?: string;
  className?: string;
};

/**
 * Vintage circular brand stamp / seal — a hand-drawn-feel impression
 * featuring "ROUTE 9 WEB CO." curved around the top, a tagline curved
 * around the bottom, a stylized MA highway shield in the center, and a
 * pair of ornamental flourishes on the sides.
 *
 * Rendered entirely as SVG (no font files needed) using <textPath> on
 * invisible circular paths. Each instance gets a unique id via useId()
 * so multiple seals on the same page don't collide.
 */
export function BrandSeal({
  size = 160,
  tilt = -6,
  tagline = "EST · SHREWSBURY MA · 2026",
  className = "",
}: Props) {
  const uid = useId().replace(/:/g, "");
  const topPathId = `seal-top-${uid}`;
  const bottomPathId = `seal-bottom-${uid}`;

  return (
    <svg
      viewBox="0 0 200 200"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      className={`seal-stamp select-none ${className}`}
      style={{
        width: size,
        height: size,
        transform: `rotate(${tilt}deg)`,
        display: "inline-block",
        filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.2))",
      }}
    >
      <defs>
        {/* Curved baselines for text — never rendered as visible lines */}
        <path
          id={topPathId}
          d="M 100,100 m -76,0 a 76,76 0 1 1 152,0"
          fill="none"
        />
        <path
          id={bottomPathId}
          d="M 100,100 m -68,0 a 68,68 0 1 0 136,0"
          fill="none"
        />

        {/* Tiny halftone grain for the "stamped ink" feel */}
        <pattern id={`grain-${uid}`} width="3" height="3" patternUnits="userSpaceOnUse">
          <rect width="3" height="3" fill="transparent" />
          <circle cx="1" cy="1" r="0.45" fill="rgba(212,104,42,0.35)" />
        </pattern>

        {/* Mask so the grain only shows over the ring area */}
        <mask id={`ring-mask-${uid}`}>
          <rect width="200" height="200" fill="black" />
          <circle cx="100" cy="100" r="92" fill="white" />
          <circle cx="100" cy="100" r="64" fill="black" />
        </mask>
      </defs>

      {/* Outer ink ring — slightly broken for authenticity */}
      <circle cx="100" cy="100" r="92"
        fill="none" stroke="#D4682A" strokeWidth="1.4"
        strokeDasharray="380 12 250 8" />

      {/* Inner double-line ring */}
      <circle cx="100" cy="100" r="86"
        fill="none" stroke="#D4682A" strokeWidth="0.7" opacity="0.7" />
      <circle cx="100" cy="100" r="64"
        fill="none" stroke="#D4682A" strokeWidth="1.1" />
      <circle cx="100" cy="100" r="60"
        fill="none" stroke="#D4682A" strokeWidth="0.6" opacity="0.55" />

      {/* Halftone grain over the text ring — sells the "stamped" feel */}
      <rect width="200" height="200" fill={`url(#grain-${uid})`} mask={`url(#ring-mask-${uid})`} />

      {/* Curved text — top */}
      <text
        fontSize="13"
        fontFamily="Georgia, 'Times New Roman', serif"
        fontWeight="700"
        letterSpacing="3.5"
        fill="#D4682A"
      >
        <textPath href={`#${topPathId}`} startOffset="50%" textAnchor="middle">
          ROUTE 9 · WEB CO.
        </textPath>
      </text>

      {/* Curved text — bottom (reads left-to-right along the lower arc) */}
      <text
        fontSize="8.5"
        fontFamily="monospace"
        fontWeight="700"
        letterSpacing="2.4"
        fill="#D4682A"
        opacity="0.85"
      >
        <textPath href={`#${bottomPathId}`} startOffset="50%" textAnchor="middle">
          {tagline}
        </textPath>
      </text>

      {/* Side flourishes — small five-pointed stars on east/west */}
      {[
        { cx: 18,  cy: 100 },
        { cx: 182, cy: 100 },
      ].map(({ cx, cy }) => (
        <g key={cx} transform={`translate(${cx} ${cy})`}>
          <path
            d="M0 -4.5 L1.3 -1.4 L4.5 -1.4 L1.9 0.6 L2.9 3.7 L0 1.8 L-2.9 3.7 L-1.9 0.6 L-4.5 -1.4 L-1.3 -1.4 Z"
            fill="#D4682A"
          />
        </g>
      ))}

      {/* Center: MA highway shield (vintage US-route shape) */}
      <g transform="translate(100 100)">
        {/* Shield body */}
        <path
          d="M0 -28 L22 -20 L22 8 Q22 22 0 30 Q-22 22 -22 8 L-22 -20 Z"
          fill="none" stroke="#D4682A" strokeWidth="1.6" strokeLinejoin="round"
        />
        {/* Inner shield gloss */}
        <path
          d="M0 -24 L18 -17 L18 6 Q18 18 0 25 Q-18 18 -18 6 L-18 -17 Z"
          fill="rgba(212,104,42,0.06)" stroke="#D4682A" strokeWidth="0.6"
          strokeOpacity="0.65"
        />
        {/* "MA" small caps */}
        <text
          x="0" y="-8"
          textAnchor="middle"
          fontSize="7"
          fontFamily="monospace"
          fontWeight="700"
          fill="#D4682A"
          letterSpacing="1.5"
        >
          MA
        </text>
        {/* The big 9 */}
        <text
          x="0" y="16"
          textAnchor="middle"
          fontSize="28"
          fontFamily="Georgia, 'Times New Roman', serif"
          fontStyle="italic"
          fontWeight="700"
          fill="#D4682A"
        >
          9
        </text>
      </g>

      {/* A few "ink splatter" specks to break the geometric perfection */}
      <circle cx="60"  cy="42"  r="0.7" fill="#D4682A" opacity="0.45" />
      <circle cx="146" cy="58"  r="0.5" fill="#D4682A" opacity="0.4"  />
      <circle cx="42"  cy="152" r="0.6" fill="#D4682A" opacity="0.5"  />
      <circle cx="158" cy="148" r="0.45" fill="#D4682A" opacity="0.35" />
    </svg>
  );
}
