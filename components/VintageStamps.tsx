"use client";

import { useId } from "react";

/**
 * Vintage postage-stamp strip — six hand-drawn stamps representing
 * Route 9 business archetypes. Each stamp has:
 *   - True die-cut perforated edges (SVG mask of half-punched holes)
 *     with a die-cut shadow layer offset beneath the paper so the
 *     scalloped silhouette reads as physically cut
 *   - Paper-curl shading (light catch top-left, warm shade falling off
 *     to the lower-right corner) so each stamp sits slightly bowed
 *   - Engraved-print texture: fine horizontal intaglio hairlines
 *     clipped inside the frame line
 *   - Inner illustration (line-art) for the trade
 *   - "ROUTE 9 MASS" curved-feel banner + "9¢" denomination
 *   - Small "POST CARD" cancellation marks
 *   - Staggered stacked tilts (alternating drop + rotation per stamp)
 *     with layered inter-stamp shadows so the strip reads as pasted by
 *     hand, one stamp after another
 *
 * Pure SVG. Decorative (aria-hidden). No animations to worry about
 * under prefers-reduced-motion.
 */

type Stamp = {
  label: string;
  /** Single-color line-art glyph for the stamp's center. */
  glyph: React.ReactNode;
  /** Tilt in degrees so they're not all parallel. */
  tilt: number;
};

// Stamp-glyph helpers — all line art so they read as engraved illustrations
const Pizzeria = (
  <g stroke="#1C1209" strokeWidth="1.2" fill="none" strokeLinecap="round">
    {/* Oven outline */}
    <rect x="6" y="14" width="32" height="20" rx="2" />
    <path d="M6 22h32" />
    {/* Oven door arch */}
    <path d="M14 30 q8 -6 16 0" />
    {/* Smokestack */}
    <line x1="32" y1="14" x2="32" y2="8" />
    <path d="M30 8 q2 -3 4 0" />
    {/* Brick texture */}
    <line x1="10" y1="18" x2="14" y2="18" />
    <line x1="18" y1="18" x2="22" y2="18" />
    <line x1="26" y1="18" x2="30" y2="18" />
  </g>
);

const Barber = (
  <g stroke="#1C1209" strokeWidth="1.2" fill="none" strokeLinecap="round">
    {/* Pole */}
    <rect x="14" y="8"  width="16" height="28" rx="2" />
    {/* Spiral stripes — three pairs */}
    <path d="M14 12 L30 18 M14 18 L30 24 M14 24 L30 30 M14 30 L30 34" />
    {/* Top finial */}
    <line x1="22" y1="4" x2="22" y2="8" />
    <circle cx="22" cy="3" r="1.6" fill="#1C1209" />
    {/* Base */}
    <rect x="11" y="36" width="22" height="3" rx="1" />
  </g>
);

const Cafe = (
  <g stroke="#1C1209" strokeWidth="1.2" fill="none" strokeLinecap="round">
    {/* Coffee cup */}
    <rect x="10" y="16" width="20" height="16" rx="2" />
    {/* Saucer */}
    <ellipse cx="22" cy="34" rx="14" ry="2" />
    {/* Handle */}
    <path d="M30 20 q5 0 5 4 q0 4 -5 4" />
    {/* Steam */}
    <path d="M16 12 q-1 -3 1 -5 q-1 -3 1 -5" />
    <path d="M22 12 q-1 -3 1 -5 q-1 -3 1 -5" />
    <path d="M28 12 q-1 -3 1 -5 q-1 -3 1 -5" />
  </g>
);

const Bakery = (
  <g stroke="#1C1209" strokeWidth="1.2" fill="none" strokeLinecap="round">
    {/* Bread loaf */}
    <path d="M8 30 q4 -16 14 -16 q10 0 14 16 z" />
    {/* Scoring slashes */}
    <line x1="14" y1="22" x2="18" y2="18" />
    <line x1="20" y1="22" x2="24" y2="18" />
    <line x1="26" y1="22" x2="30" y2="18" />
    {/* Counter */}
    <line x1="6" y1="32" x2="38" y2="32" />
    {/* Steam */}
    <path d="M22 12 q-1 -3 1 -5" />
  </g>
);

const Salon = (
  <g stroke="#1C1209" strokeWidth="1.2" fill="none" strokeLinecap="round">
    {/* Scissors — two looped handles + cross blades */}
    <circle cx="14" cy="14" r="4" />
    <circle cx="14" cy="28" r="4" />
    {/* Blades crossing */}
    <line x1="17" y1="16" x2="36" y2="30" />
    <line x1="17" y1="26" x2="36" y2="12" />
    {/* Pivot */}
    <circle cx="22" cy="21" r="0.9" fill="#1C1209" />
  </g>
);

const Auto = (
  <g stroke="#1C1209" strokeWidth="1.2" fill="none" strokeLinecap="round">
    {/* Wrench */}
    <path d="M10 30 L24 16 M28 12 q3 -5 8 -3 q-3 3 -1 6 q3 2 6 -1 q2 5 -3 8 q-5 1 -8 -2 L20 32 q-3 3 -6 0 q-3 -3 0 -6 z" />
    {/* Wheel hub */}
    <circle cx="32" cy="22" r="3" />
  </g>
);

const STAMPS: Stamp[] = [
  { label: "PIZZA",   glyph: Pizzeria, tilt:  2 },
  { label: "BARBER",  glyph: Barber,   tilt: -3 },
  { label: "CAFÉ",    glyph: Cafe,     tilt:  3 },
  { label: "BAKERY",  glyph: Bakery,   tilt: -2 },
  { label: "SALON",   glyph: Salon,    tilt:  3 },
  { label: "AUTO",    glyph: Auto,     tilt: -3 },
];

// Perforation-hole centers, half-punched along each edge (60 × 76 stamp,
// hole r = 2). Eight across, ten down — classic line-perf gauge.
const PERF_X = Array.from({ length: 8 }, (_, k) => 3.75 + k * 7.5);
const PERF_Y = Array.from({ length: 10 }, (_, k) => 3.8 + k * 7.6);

export function VintageStamps() {
  const uid = useId().replace(/:/g, "");

  return (
    <div
      aria-hidden
      className="flex items-end justify-between gap-2 mt-3 px-1"
    >
      {STAMPS.map(({ label, glyph, tilt }, i) => (
        <div
          key={label}
          className="relative flex-shrink-0"
          style={{
            width: 60,
            height: 76,
            // Staggered stack: alternating drop + tilt, later stamps layer
            // slightly under earlier ones so the shadows fall between them.
            transform: `translateY(${i % 2 === 0 ? 0 : 3}px) rotate(${tilt}deg)`,
            zIndex: STAMPS.length - i,
            filter:
              "drop-shadow(1.5px 2.5px 1.5px rgba(28,18,9,0.22)) drop-shadow(0 6px 9px rgba(28,18,9,0.14))",
          }}
        >
          {/* Stamp paper — SVG with a true perforated (die-cut) silhouette */}
          <svg
            viewBox="0 0 60 76"
            xmlns="http://www.w3.org/2000/svg"
            className="absolute inset-0"
            style={{ overflow: "visible" }}
          >
            <defs>
              {/* Die-cut mask: paper rect minus half-punched perf holes */}
              <mask
                id={`stamp-perf-${uid}-${i}`}
                maskUnits="userSpaceOnUse"
                x="-4" y="-4" width="68" height="84"
              >
                <rect x="0" y="0" width="60" height="76" rx="1" fill="white" />
                {PERF_X.map((x) => (
                  <g key={`px${x}`}>
                    <circle cx={x} cy="0" r="2" fill="black" />
                    <circle cx={x} cy="76" r="2" fill="black" />
                  </g>
                ))}
                {PERF_Y.map((y) => (
                  <g key={`py${y}`}>
                    <circle cx="0" cy={y} r="2" fill="black" />
                    <circle cx="60" cy={y} r="2" fill="black" />
                  </g>
                ))}
              </mask>
              {/* Aged-paper base, lit from the upper-left */}
              <linearGradient id={`stamp-paper-${uid}-${i}`} x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%"   stopColor="#FEFAEE" />
                <stop offset="40%"  stopColor="#FBF4E2" />
                <stop offset="100%" stopColor="#EBD9B2" />
              </linearGradient>
              {/* Paper-curl shading — bright catch top-left corner, warm
                  occluded shade rolling under the bottom-right */}
              <linearGradient id={`stamp-curl-${uid}-${i}`} x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%"   stopColor="rgba(255,255,255,0.6)" />
                <stop offset="20%"  stopColor="rgba(255,255,255,0)" />
                <stop offset="72%"  stopColor="rgba(122,84,40,0)" />
                <stop offset="100%" stopColor="rgba(122,84,40,0.24)" />
              </linearGradient>
              {/* Engraved-print texture — fine intaglio hairlines */}
              <pattern id={`stamp-etch-${uid}-${i}`} width="2" height="2" patternUnits="userSpaceOnUse">
                <path d="M0 0.5 H2" stroke="rgba(122,84,40,0.09)" strokeWidth="0.4" />
              </pattern>
            </defs>

            {/* Die-cut shadow — the scalloped silhouette repeated, offset
                to the lower-right, so the perf edge itself casts depth */}
            <g transform="translate(1.1 1.6)">
              <rect width="60" height="76" fill="rgba(58,36,16,0.30)" mask={`url(#stamp-perf-${uid}-${i})`} />
            </g>

            {/* Paper body, punched by the perforation mask */}
            <rect width="60" height="76" fill={`url(#stamp-paper-${uid}-${i})`} mask={`url(#stamp-perf-${uid}-${i})`} />

            {/* Perf-edge definition — hugs the outline AND each hole rim,
                selling the die-cut depth */}
            <rect x="0.35" y="0.35" width="59.3" height="75.3" fill="none"
              stroke="rgba(28,18,9,0.18)" strokeWidth="0.7"
              mask={`url(#stamp-perf-${uid}-${i})`} />

            {/* Engraved texture field inside the frame line */}
            <rect x="4" y="4" width="52" height="68" fill={`url(#stamp-etch-${uid}-${i})`} />
            {/* Frame line */}
            <rect x="4.5" y="4.5" width="51" height="67" fill="none" stroke="rgba(28,18,9,0.26)" strokeWidth="0.6" />

            {/* Paper-curl light/shade overlay */}
            <rect width="60" height="76" fill={`url(#stamp-curl-${uid}-${i})`} mask={`url(#stamp-perf-${uid}-${i})`} />
          </svg>

          {/* Glyph illustration */}
          <svg
            viewBox="0 0 44 44"
            xmlns="http://www.w3.org/2000/svg"
            className="absolute"
            style={{ top: 8, left: 8, width: 44, height: 36 }}
          >
            {glyph}
          </svg>

          {/* Cancellation arc — three faded wave lines */}
          <svg
            viewBox="0 0 60 76"
            xmlns="http://www.w3.org/2000/svg"
            className="absolute inset-0 pointer-events-none"
            style={{ opacity: 0.32 }}
          >
            <path
              d="M-2 18 q15 -4 30 0 q15 4 30 0 q15 -4 30 0"
              stroke="#1C1209" strokeWidth="0.5" fill="none"
            />
            <path
              d="M-2 24 q15 -4 30 0 q15 4 30 0 q15 -4 30 0"
              stroke="#1C1209" strokeWidth="0.5" fill="none"
            />
          </svg>

          {/* Bottom label band */}
          <div
            className="absolute left-0 right-0 bottom-0 text-center pb-1"
            style={{ paddingTop: 2 }}
          >
            <div
              style={{
                fontFamily: "monospace",
                fontSize: "6px",
                fontWeight: 800,
                color: "#1C1209",
                letterSpacing: "0.18em",
                lineHeight: 1,
              }}
            >
              ROUTE 9 MASS
            </div>
            <div
              style={{
                fontFamily: "Georgia, serif",
                fontStyle: "italic",
                fontSize: "11px",
                fontWeight: 800,
                color: "#A84818",
                lineHeight: 1.15,
              }}
            >
              {label}
            </div>
            <div
              style={{
                fontFamily: "Georgia, serif",
                fontSize: "8px",
                fontWeight: 800,
                color: "#1C1209",
                letterSpacing: "0.12em",
                marginTop: "1px",
              }}
            >
              9¢
            </div>
          </div>

          {/* Small corner cancellation circle */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            aria-hidden
            className="absolute"
            style={{
              top: -3,
              right: -3,
              width: 18,
              height: 18,
              opacity: 0.45,
              transform: `rotate(${(i * 12) - 8}deg)`,
            }}
          >
            <circle cx="10" cy="10" r="8" fill="none" stroke="#1C1209" strokeWidth="0.7" />
            <circle cx="10" cy="10" r="6" fill="none" stroke="#1C1209" strokeWidth="0.4" />
            <text x="10" y="9" textAnchor="middle" fontSize="3" fontFamily="monospace" fontWeight="700" fill="#1C1209" letterSpacing="0.3">SHR</text>
            <text x="10" y="13" textAnchor="middle" fontSize="3" fontFamily="monospace" fontWeight="700" fill="#1C1209">MA</text>
          </svg>
        </div>
      ))}
    </div>
  );
}
