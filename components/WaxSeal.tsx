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
 * (eight cubic-bezier wax-blob lobes), deep crimson/burgundy wax with a
 * translucent subsurface-scatter glow (layered radial gradients), edge
 * thickness modeled by a gradient stroke (light where the blob's rolled
 * lip catches the upper-left light, dark where it turns away), and a
 * stamped "R9" monogram pressed into the center with a true emboss
 * (dark impression + light lower-right anti-emboss kick). Optional silk
 * ribbon tail underneath suggests an "official document" feel.
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
        filter: "drop-shadow(0 6px 16px rgba(116,23,16,0.5)) drop-shadow(0 2px 4px rgba(0,0,0,0.35))",
      }}
    >
      <svg
        viewBox="0 0 120 152"
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: "100%", height: "100%", overflow: "visible" }}
      >
        <defs>
          {/* Reusable wax-blob silhouette — eight irregular bezier lobes */}
          <path
            id={`wax-blob-${uid}`}
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
          />

          {/* Molten wax — deep crimson/burgundy, specular catch top-left */}
          <radialGradient id={`wax-fill-${uid}`} cx="38%" cy="30%" r="80%">
            <stop offset="0%"   stopColor="#F09060" />
            <stop offset="18%"  stopColor="#CC4C24" />
            <stop offset="45%"  stopColor="#9C2C14" />
            <stop offset="72%"  stopColor="#6E160E" />
            <stop offset="100%" stopColor="#380806" />
          </radialGradient>

          {/* Subsurface scatter — warm light bleeding back out of the wax
              body low-center, where the material is thickest */}
          <radialGradient id={`wax-sss-${uid}`} cx="56%" cy="70%" r="62%">
            <stop offset="0%"   stopColor="rgba(255,96,44,0.30)" />
            <stop offset="45%"  stopColor="rgba(216,64,28,0.16)" />
            <stop offset="100%" stopColor="rgba(255,96,44,0)" />
          </radialGradient>

          {/* Inner rim — slightly darker for the impression depth */}
          <radialGradient id={`wax-rim-${uid}`} cx="50%" cy="50%" r="50%">
            <stop offset="80%"  stopColor="rgba(56,8,6,0)" />
            <stop offset="100%" stopColor="rgba(26,4,3,0.85)" />
          </radialGradient>

          {/* Highlight gloss — specular shine top-left */}
          <radialGradient id={`wax-shine-${uid}`} cx="30%" cy="22%" r="35%">
            <stop offset="0%"   stopColor="rgba(255,214,170,0.8)" />
            <stop offset="100%" stopColor="rgba(255,214,170,0)" />
          </radialGradient>

          {/* Edge-thickness stroke — the rolled wax lip: light where it
              faces the upper-left key light, dark where it rolls under */}
          <linearGradient id={`wax-edge-${uid}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%"   stopColor="rgba(255,178,130,0.85)" />
            <stop offset="38%"  stopColor="rgba(255,178,130,0.15)" />
            <stop offset="55%"  stopColor="rgba(0,0,0,0)" />
            <stop offset="100%" stopColor="rgba(30,4,3,0.8)" />
          </linearGradient>

          {/* Pressed-dish emboss ring — dark upper-left inner shadow,
              light lower-right anti-emboss kick */}
          <linearGradient id={`wax-dish-${uid}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%"   stopColor="rgba(30,4,3,0.6)" />
            <stop offset="45%"  stopColor="rgba(30,4,3,0)" />
            <stop offset="60%"  stopColor="rgba(255,170,120,0)" />
            <stop offset="100%" stopColor="rgba(255,170,120,0.38)" />
          </linearGradient>

          {/* Ribbon gradient — silk with a center sheen */}
          <linearGradient id={`wax-ribbon-${uid}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#B03A18" />
            <stop offset="45%"  stopColor="#8E2410" />
            <stop offset="100%" stopColor="#5A100A" />
          </linearGradient>
          <linearGradient id={`wax-ribbon-sheen-${uid}`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%"   stopColor="rgba(255,180,130,0)" />
            <stop offset="50%"  stopColor="rgba(255,180,130,0.28)" />
            <stop offset="100%" stopColor="rgba(255,180,130,0)" />
          </linearGradient>
        </defs>

        {withRibbon && (
          <g>
            {/* Left ribbon tail */}
            <path
              d="M 36 92 L 22 144 L 36 134 L 50 144 Z"
              fill={`url(#wax-ribbon-${uid})`}
              stroke="#2E0A06"
              strokeWidth="0.6"
            />
            <path
              d="M 36 92 L 22 144 L 36 134 L 50 144 Z"
              fill={`url(#wax-ribbon-sheen-${uid})`}
            />
            {/* Right ribbon tail */}
            <path
              d="M 84 92 L 70 144 L 84 134 L 98 144 Z"
              fill={`url(#wax-ribbon-${uid})`}
              stroke="#2E0A06"
              strokeWidth="0.6"
            />
            <path
              d="M 84 92 L 70 144 L 84 134 L 98 144 Z"
              fill={`url(#wax-ribbon-sheen-${uid})`}
            />
            {/* Occlusion shadow the wax casts down onto the ribbon */}
            <ellipse cx="60" cy="93" rx="34" ry="3.4" fill="rgba(0,0,0,0.4)" />
          </g>
        )}

        {/* Soft elliptical contact shadow beneath the blob */}
        <ellipse cx="63" cy="103" rx="42" ry="6" fill="rgba(26,4,3,0.28)" />

        {/* Wax blob — burgundy body */}
        <use
          href={`#wax-blob-${uid}`}
          fill={`url(#wax-fill-${uid})`}
          stroke="#2E0A06"
          strokeWidth="0.6"
        />
        {/* Subsurface glow — translucent wax lit from within */}
        <use href={`#wax-blob-${uid}`} fill={`url(#wax-sss-${uid})`} />
        {/* Edge thickness — rolled lip highlight/shadow riding the outline */}
        <use
          href={`#wax-blob-${uid}`}
          fill="none"
          stroke={`url(#wax-edge-${uid})`}
          strokeWidth="2"
          opacity="0.9"
        />

        {/* Inner rim shadow */}
        <ellipse cx="60" cy="54" rx="50" ry="46" fill={`url(#wax-rim-${uid})`} />

        {/* Specular highlight — sells the molten look */}
        <ellipse cx="42" cy="34" rx="22" ry="14" fill={`url(#wax-shine-${uid})`} />

        {/* Pressed-in impression area — recessed circular dish */}
        <circle cx="60" cy="54" r="32" fill="rgba(26,4,3,0.2)" />
        {/* Dish emboss ring: dark top-left inner wall, light bottom-right lip */}
        <circle cx="60" cy="54" r="32" fill="none" stroke={`url(#wax-dish-${uid})`} strokeWidth="1.6" />
        <circle cx="60" cy="54" r="30.6" fill="none" stroke="rgba(26,4,3,0.3)" strokeWidth="0.5" />

        {/* "R9" monogram — embossed: light anti-emboss under dark impression */}
        <g transform="translate(60 54)">
          {/* Decorative laurel ring inside the impression */}
          <circle r="26" fill="none" stroke="rgba(26,4,3,0.42)" strokeWidth="0.6" strokeDasharray="3 2" />
          <circle r="26" transform="translate(0.5 0.5)" fill="none" stroke="rgba(255,170,120,0.18)" strokeWidth="0.5" strokeDasharray="3 2" />

          {/* Anti-emboss — warm light kicked off the lower-right of each
              recessed glyph (drawn first, offset down-right) */}
          <text
            x="-8.1" y="6.9"
            textAnchor="middle"
            fontFamily="Georgia, 'Times New Roman', serif"
            fontStyle="italic"
            fontWeight="900"
            fontSize="36"
            fill="rgba(255,178,124,0.4)"
          >
            R
          </text>
          <text
            x="11.9" y="6.9"
            textAnchor="middle"
            fontFamily="Georgia, 'Times New Roman', serif"
            fontStyle="italic"
            fontWeight="900"
            fontSize="36"
            fill="rgba(255,178,124,0.4)"
          >
            9
          </text>

          {/* "R" — dark pressed impression */}
          <text
            x="-9" y="6"
            textAnchor="middle"
            fontFamily="Georgia, 'Times New Roman', serif"
            fontStyle="italic"
            fontWeight="900"
            fontSize="36"
            fill="#2E0A06"
            stroke="rgba(255,160,110,0.35)"
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
            fill="#2E0A06"
            stroke="rgba(255,160,110,0.35)"
            strokeWidth="0.4"
            paintOrder="stroke fill"
          >
            9
          </text>
          {/* Tiny dot between letters — pressed, with its own light kick */}
          <circle cx="0.5" cy="-5.5" r="1.4" fill="rgba(255,178,124,0.35)" />
          <circle cx="0" cy="-6" r="1.4" fill="#2E0A06" opacity="0.8" />
        </g>

        {/* Tiny wax gloss dots — hot pinpoint reflections on the lobes */}
        <ellipse cx="47" cy="27" rx="2.4" ry="1.4" fill="rgba(255,232,200,0.85)" transform="rotate(-18 47 27)" />
        <ellipse cx="72" cy="22" rx="1.3" ry="0.8" fill="rgba(255,232,200,0.6)" transform="rotate(-12 72 22)" />
        <ellipse cx="24" cy="52" rx="1.1" ry="0.7" fill="rgba(255,214,170,0.5)" transform="rotate(65 24 52)" />
        <ellipse cx="97" cy="46" rx="1" ry="0.6" fill="rgba(255,214,170,0.4)" transform="rotate(30 97 46)" />

        {/* Tiny wax splatter droplets to break the symmetry — each with a
            micro specular dot so they read as beads, not flat spots */}
        <circle cx="22" cy="68" r="2.2" fill="#8E2410" opacity="0.9" />
        <circle cx="21.4" cy="67.3" r="0.7" fill="rgba(255,200,160,0.7)" />
        <circle cx="18" cy="74" r="1.1" fill="#5A100A" opacity="0.7" />
        <circle cx="100" cy="60" r="1.8" fill="#8E2410" opacity="0.85" />
        <circle cx="99.5" cy="59.4" r="0.55" fill="rgba(255,200,160,0.6)" />
        <circle cx="104" cy="66" r="1.0" fill="#5A100A" opacity="0.6" />
        <circle cx="60" cy="98" r="1.4" fill="#8E2410" opacity="0.75" />
      </svg>
    </div>
  );
}
