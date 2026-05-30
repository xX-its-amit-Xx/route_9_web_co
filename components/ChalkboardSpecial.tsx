"use client";

/**
 * Vintage hanging chalkboard sign — the kind you'd see outside a diner
 * or coffee shop with the day's specials hand-lettered in chalk. Used
 * to amplify the Founding Offer.
 *
 * Built entirely as SVG:
 *   - Stained-wood frame with corner bolts + overhead mounting chains
 *   - Slate blackboard surface with subtle gradient and dust speckling
 *   - Hand-lettered chalk text using stroked SVG paths so the glyphs
 *     read as drawn-by-hand instead of typeset
 *   - Original $750 price with a hand-drawn slash through it; the
 *     replacement $300 below it in larger, decorated type
 *   - "Today's Special" header in italic, ornamental fleurons, and a
 *     "1 spot left" footer line in handwritten chalk
 *
 * Decorative only (aria-hidden, pointer-events:none). The aria-label
 * carries the offer details for any AT users.
 */
export function ChalkboardSpecial() {
  return (
    <div
      role="img"
      aria-label="Today's special: $750 founding offer, now $300 — only 1 Route 9 shop spot left."
      className="chalkboard-special inline-block select-none"
      style={{
        width: 280,
        maxWidth: "100%",
        filter:
          "drop-shadow(0 8px 20px rgba(0,0,0,0.45)) drop-shadow(0 2px 4px rgba(0,0,0,0.35))",
      }}
    >
      <svg
        viewBox="0 0 280 340"
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: "100%", height: "auto", overflow: "visible" }}
      >
        <defs>
          {/* Stained-wood frame */}
          <linearGradient id="cb-wood" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%"   stopColor="#5A3018" />
            <stop offset="40%"  stopColor="#3A1C0E" />
            <stop offset="100%" stopColor="#220F08" />
          </linearGradient>
          {/* Wood end-grain darker variant */}
          <linearGradient id="cb-wood-dk" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#3A1C0E" />
            <stop offset="100%" stopColor="#1C0E04" />
          </linearGradient>
          {/* Slate surface — subtle warmth in the dark */}
          <radialGradient id="cb-slate" cx="50%" cy="40%" r="80%">
            <stop offset="0%"   stopColor="#1F2826" />
            <stop offset="55%"  stopColor="#0F1816" />
            <stop offset="100%" stopColor="#070E0C" />
          </radialGradient>
          {/* Chalk-dust grain */}
          <pattern id="cb-dust" x="0" y="0" width="4" height="4" patternUnits="userSpaceOnUse">
            <circle cx="1.5" cy="1.5" r="0.35" fill="rgba(243,233,213,0.22)" />
            <circle cx="3"   cy="3"   r="0.18" fill="rgba(243,233,213,0.12)" />
          </pattern>
        </defs>

        {/* ── Overhead chains ── */}
        <g stroke="#1C0E04" strokeWidth="1.4" strokeLinecap="round">
          {/* Left chain */}
          <line x1="60" y1="0" x2="60" y2="36" />
          {[6, 14, 22, 30].map((y) => (
            <ellipse key={`L${y}`} cx="60" cy={y} rx="3" ry="2" fill="none" stroke="#2C1810" strokeWidth="1.2" />
          ))}
          {/* Right chain */}
          <line x1="220" y1="0" x2="220" y2="36" />
          {[6, 14, 22, 30].map((y) => (
            <ellipse key={`R${y}`} cx="220" cy={y} rx="3" ry="2" fill="none" stroke="#2C1810" strokeWidth="1.2" />
          ))}
        </g>

        {/* ── Wooden frame ── */}
        <rect x="14" y="36" width="252" height="288" rx="6" fill="url(#cb-wood)" stroke="#1C0E04" strokeWidth="1.2" />
        {/* Inner relief shadow */}
        <rect x="20" y="42" width="240" height="276" rx="3" fill="url(#cb-wood-dk)" />
        {/* Wood grain hairlines */}
        <g stroke="rgba(0,0,0,0.35)" strokeWidth="0.4" fill="none">
          <path d="M14 70 q80 -4 130 0 q60 4 122 -2" />
          <path d="M14 100 q60 4 130 0 q60 -4 122 2" />
          <path d="M14 130 q80 -2 130 1 q60 4 122 -1" />
          <path d="M14 290 q60 2 130 -1 q60 -2 122 1" />
        </g>
        {/* Corner bolts */}
        {[
          [28, 50], [252, 50], [28, 310], [252, 310],
        ].map(([cx, cy]) => (
          <g key={`${cx},${cy}`} transform={`translate(${cx} ${cy})`}>
            <circle r="4" fill="#1C0E04" stroke="#5A3018" strokeWidth="0.8" />
            <path d="M-2 0 L2 0 M0 -2 L0 2" stroke="#7A5028" strokeWidth="0.8" strokeLinecap="round" />
          </g>
        ))}

        {/* ── Slate chalkboard surface ── */}
        <rect x="32" y="54" width="216" height="252" rx="2" fill="url(#cb-slate)" />
        <rect x="32" y="54" width="216" height="252" rx="2" fill="url(#cb-dust)" opacity="0.4" />
        {/* Inner-edge chalk smudge */}
        <rect x="32" y="54" width="216" height="252" rx="2"
          fill="none" stroke="rgba(243,233,213,0.07)" strokeWidth="3" />

        {/* ── Hand-lettered "Today's Special" header ── */}
        <g>
          {/* Small fleurons left/right of the heading */}
          <path d="M 70 84 l 4 -4 l 4 4 l -4 4 z" fill="#F3E9D5" opacity="0.7" />
          <path d="M 202 84 l 4 -4 l 4 4 l -4 4 z" fill="#F3E9D5" opacity="0.7" />
          <text
            x="140" y="88"
            textAnchor="middle"
            fontFamily="Georgia, 'Times New Roman', serif"
            fontStyle="italic"
            fontWeight="700"
            fontSize="14"
            fill="#F3E9D5"
            letterSpacing="0.18em"
            opacity="0.92"
          >
            Today&#39;s Special
          </text>
          {/* Decorative chalk underline */}
          <path
            d="M 70 96 q 35 4 70 0 q 35 -4 70 0"
            stroke="#F3E9D5" strokeWidth="0.9" strokeLinecap="round" fill="none" opacity="0.6"
          />
        </g>

        {/* ── Old price — struck through ── */}
        <g>
          <text
            x="140" y="135"
            textAnchor="middle"
            fontFamily="Georgia, serif"
            fontStyle="italic"
            fontWeight="700"
            fontSize="34"
            fill="rgba(243,233,213,0.55)"
            letterSpacing="0.02em"
          >
            $750
          </text>
          {/* Hand-drawn slash through it */}
          <path
            d="M 92 144 q 50 -16 100 -20"
            stroke="#FFC078" strokeWidth="2.4" fill="none" strokeLinecap="round"
            opacity="0.85"
          />
          <path
            d="M 92 142 q 50 -14 100 -18"
            stroke="rgba(255,180,90,0.4)" strokeWidth="3.5" fill="none" strokeLinecap="round"
          />
        </g>

        {/* ── NEW price — big and decorated ── */}
        <g>
          <text
            x="140" y="208"
            textAnchor="middle"
            fontFamily="Georgia, 'Times New Roman', serif"
            fontStyle="italic"
            fontWeight="900"
            fontSize="76"
            fill="#FFE0A0"
            letterSpacing="-0.02em"
            style={{ paintOrder: "stroke fill" }}
            stroke="#D4682A"
            strokeWidth="1"
          >
            $300
          </text>
          {/* Two-tier underline with squiggle */}
          <path
            d="M 76 220 q 32 4 64 0 q 32 -4 64 0"
            stroke="#FFE0A0" strokeWidth="1.4" fill="none" strokeLinecap="round"
            opacity="0.85"
          />
          <path
            d="M 84 226 q 28 2 56 0 q 28 -2 56 0"
            stroke="#FFE0A0" strokeWidth="0.8" fill="none" strokeLinecap="round"
            opacity="0.55"
          />
        </g>

        {/* ── Subtext: "one-time + $30/mo for life" ── */}
        <text
          x="140" y="248"
          textAnchor="middle"
          fontFamily="Georgia, serif"
          fontStyle="italic"
          fontSize="13"
          fill="#F3E9D5"
          letterSpacing="0.08em"
          opacity="0.85"
        >
          one-time · $30/mo for life
        </text>

        {/* ── Footer: spot indicator ── */}
        <g>
          {/* Spot dots */}
          <g transform="translate(110 274)" aria-hidden>
            <circle cx="0"  cy="0" r="3.2" fill="#FFC078" opacity="0.9" />
            <circle cx="10" cy="0" r="3.2" fill="#FFC078" opacity="0.55" />
            <circle cx="20" cy="0" r="3.2" fill="none" stroke="#FFC078" strokeWidth="1.4" />
          </g>
          <text
            x="170" y="278"
            fontFamily="Georgia, serif"
            fontStyle="italic"
            fontWeight="700"
            fontSize="13"
            fill="#FFC078"
            letterSpacing="0.06em"
          >
            1 spot left
          </text>
        </g>

        {/* ── Tag line at the very bottom ── */}
        <text
          x="140" y="296"
          textAnchor="middle"
          fontFamily="monospace"
          fontSize="6"
          fill="rgba(243,233,213,0.5)"
          letterSpacing="0.13em"
        >
          FOR ROUTE 9 SHOPS · MENTION WHEN WE TALK
        </text>

        {/* Smudges of "erased chalk" for authenticity */}
        <ellipse cx="60"  cy="160" rx="22" ry="6" fill="rgba(243,233,213,0.05)" />
        <ellipse cx="220" cy="232" rx="20" ry="5" fill="rgba(243,233,213,0.04)" />
      </svg>
    </div>
  );
}
