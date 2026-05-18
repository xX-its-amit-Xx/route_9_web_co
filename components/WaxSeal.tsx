"use client";

import { useId } from "react";

type Props = {
  /** Pixel size of the seal. */
  size?: number;
  /** Optional tilt in degrees. */
  tilt?: number;
  /** Optional ribbon tail underneath for "official document" feel. */
  withRibbon?: boolean;
  className?: string;
};

/**
 * Hand-pressed wax seal — a SVG circle with deliberately irregular edges
 * (eight cubic-bezier wax-blob lobes), molten 3D highlights, and a
 * stamped "R9" monogram pressed into the center. Optional silk ribbon
 * tail underneath suggests an "official document" / sealed-envelope
 * feel.
 *
 * Every instance gets a unique useId() suffix so multiple seals can
 * appear on the same page without filter/gradient id collisions.
 *
 * Purely decorative (aria-hidden). No animations to worry about under
 * prefers-reduced-motion.
 */
export function WaxSeal({
  size = 110,
  tilt = -8,
  withRibbon = true,
  className = "",
}: Props) {
  const uid = useId().replace(/:/g, "");

  return (
    <div
      aria-hidden
      className={`wax-seal-root inline-block select-none ${className}`}
      style={{
        width: size,
        height: withRibbon ? size + 32 : size,
        transform: `rotate(${tilt}deg)`,
        filter: "drop-shadow(0 6px 16px rgba(168,72,24,0.45)) drop-shadow(0 2px 4px rgba(0,0,0,0.35))",
      }}
    >
      <svg
        viewBox="0 0 120 152"
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: "100%", height: "100%", overflow: "visible" }}
      >
        <defs>
          {/* Molten wax — warm radial with light specular catch top-left */}
          <radialGradient id={`wax-fill-${uid}`} cx="38%" cy="32%" r="78%">
            <stop offset="0%"   stopColor="#FFB870" />
            <stop offset="22%"  stopColor="#E07838" />
            <stop offset="60%"  stopColor="#A84818" />
            <stop offset="100%" stopColor="#5E2208" />
          </radialGradient>

          {/* Inner rim — slightly darker for the impression depth */}
          <radialGradient id={`wax-rim-${uid}`} cx="50%" cy="50%" r="50%">
            <stop offset="80%"  stopColor="rgba(94,34,8,0)" />
            <stop offset="100%" stopColor="rgba(38,14,4,0.85)" />
          </radialGradient>

          {/* Highlight gloss — specular shine top-left */}
          <radialGradient id={`wax-shine-${uid}`} cx="30%" cy="22%" r="35%">
            <stop offset="0%"   stopColor="rgba(255,225,170,0.85)" />
            <stop offset="100%" stopColor="rgba(255,225,170,0)" />
          </radialGradient>

          {/* Ribbon gradient */}
          <linearGradient id={`wax-ribbon-${uid}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"  stopColor="#C05A20" />
            <stop offset="100%" stopColor="#7A2810" />
          </linearGradient>
        </defs>

        {withRibbon && (
          <g>
            {/* Left ribbon tail */}
            <path
              d="M 36 92 L 22 144 L 36 134 L 50 144 Z"
              fill={`url(#wax-ribbon-${uid})`}
              stroke="#3A1408"
              strokeWidth="0.6"
            />
            {/* Right ribbon tail */}
            <path
              d="M 84 92 L 70 144 L 84 134 L 98 144 Z"
              fill={`url(#wax-ribbon-${uid})`}
              stroke="#3A1408"
              strokeWidth="0.6"
            />
            {/* Ribbon shadow under the wax */}
            <ellipse cx="60" cy="92" rx="34" ry="3" fill="rgba(0,0,0,0.35)" />
          </g>
        )}

        {/* Wax blob — eight slightly-irregular bezier lobes around a center */}
        <path
          d="
            M 60 6
            C 75 8  93 18  101 35
            C 109 50 113 60 110 70
            C 117 78 110 92  92 94
            C 87 108 70 109  60 102
            C 52 110  37 110  30 96
            C 12 96  6  82  14 70
            C 4  56  16 38  26 32
            C 32 16 46 6  60 6 Z
          "
          fill={`url(#wax-fill-${uid})`}
          stroke="#3A1408"
          strokeWidth="0.6"
        />

        {/* Inner rim shadow */}
        <ellipse cx="60" cy="54" rx="50" ry="46" fill={`url(#wax-rim-${uid})`} />

        {/* Specular highlight — sells the molten look */}
        <ellipse cx="42" cy="34" rx="22" ry="14" fill={`url(#wax-shine-${uid})`} />

        {/* Pressed-in impression area — slightly darker circular dish */}
        <circle cx="60" cy="54" r="32" fill="rgba(38,14,4,0.18)" />
        <circle cx="60" cy="54" r="32" fill="none" stroke="rgba(38,14,4,0.35)" strokeWidth="0.6" />

        {/* "R9" monogram — embossed: dark stroke + lighter inner cut */}
        <g transform="translate(60 54)">
          {/* Decorative laurel ring inside the impression */}
          <circle r="26" fill="none" stroke="rgba(38,14,4,0.4)" strokeWidth="0.6" strokeDasharray="3 2" />

          {/* "R" */}
          <text
            x="-9" y="6"
            textAnchor="middle"
            fontFamily="Georgia, 'Times New Roman', serif"
            fontStyle="italic"
            fontWeight="900"
            fontSize="36"
            fill="#3A1408"
            stroke="rgba(255,200,140,0.4)"
            strokeWidth="0.4"
            paintOrder="stroke fill"
          >
            R
          </text>
          {/* "9" — italicized */}
          <text
            x="11" y="6"
            textAnchor="middle"
            fontFamily="Georgia, 'Times New Roman', serif"
            fontStyle="italic"
            fontWeight="900"
            fontSize="36"
            fill="#3A1408"
            stroke="rgba(255,200,140,0.4)"
            strokeWidth="0.4"
            paintOrder="stroke fill"
          >
            9
          </text>
          {/* Tiny dot between letters */}
          <circle cx="0" cy="-6" r="1.4" fill="#3A1408" opacity="0.7" />
        </g>

        {/* Tiny wax splatter droplets to break the symmetry */}
        <circle cx="22" cy="68" r="2.2" fill="#A84818" opacity="0.85" />
        <circle cx="18" cy="74" r="1.1" fill="#7A2810" opacity="0.65" />
        <circle cx="100" cy="60" r="1.8" fill="#A84818" opacity="0.8" />
        <circle cx="104" cy="66" r="1.0" fill="#7A2810" opacity="0.6" />
        <circle cx="60" cy="98" r="1.4" fill="#A84818" opacity="0.7" />
      </svg>
    </div>
  );
}
