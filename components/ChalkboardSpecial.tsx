"use client";

/**
 * Vintage hanging chalkboard sign — the kind you'd see outside a diner
 * or coffee shop with the day's specials hand-lettered in chalk. Used
 * to amplify the Founding Offer.
 *
 * Built entirely as SVG:
 *   - Stained-wood frame with mitered corners, grain hairlines, bevel
 *     highlights (light top/left, occluded bottom/right) + corner bolts
 *   - Overhead mounting chains hung from two brass nail heads, each with
 *     a small cast shadow
 *   - Slate blackboard surface with mottled depth (layered soft blotches
 *     over the base radial), dust speckling, and an inner occlusion
 *     shadow where the slate sits recessed behind the frame
 *   - Hand-lettered chalk text with a soft dust-glow halo behind the
 *     price so the chalk reads freshly drawn
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
            <stop offset="0%"   stopColor="#6B3A1E" />
            <stop offset="35%"  stopColor="#4A2412" />
            <stop offset="75%"  stopColor="#2E150A" />
            <stop offset="100%" stopColor="#1E0D06" />
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
          {/* Slate top-edge occlusion — the frame shades the recessed board */}
          <linearGradient id="cb-slate-occ" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="rgba(0,0,0,0.55)" />
            <stop offset="100%" stopColor="rgba(0,0,0,0)" />
          </linearGradient>
          <linearGradient id="cb-slate-occ-l" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%"   stopColor="rgba(0,0,0,0.4)" />
            <stop offset="100%" stopColor="rgba(0,0,0,0)" />
          </linearGradient>
          {/* Brass nail head */}
          <radialGradient id="cb-nail" cx="35%" cy="30%" r="70%">
            <stop offset="0%"   stopColor="#F0D8A8" />
            <stop offset="45%"  stopColor="#B08040" />
            <stop offset="100%" stopColor="#4A2E10" />
          </radialGradient>
          {/* Chalk-dust grain */}
          <pattern id="cb-dust" x="0" y="0" width="4" height="4" patternUnits="userSpaceOnUse">
            <circle cx="1.5" cy="1.5" r="0.35" fill="rgba(243,233,213,0.22)" />
            <circle cx="3"   cy="3"   r="0.18" fill="rgba(243,233,213,0.12)" />
          </pattern>
        </defs>

        {/* ── Brass mounting nails ── */}
        {[60, 220].map((cx) => (
          <g key={cx}>
            {/* Cast shadow behind/below the nail head */}
            <ellipse cx={cx + 1.4} cy="4.6" rx="3.4" ry="2.6" fill="rgba(0,0,0,0.35)" />
            <circle cx={cx} cy="3" r="3" fill="url(#cb-nail)" stroke="#2A1608" strokeWidth="0.6" />
            <circle cx={cx - 1} cy="2" r="0.8" fill="rgba(255,244,220,0.85)" />
          </g>
        ))}

        {/* ── Overhead chains ── */}
        <g stroke="#1C0E04" strokeWidth="1.4" strokeLinecap="round">
          {/* Soft cast shadow each chain throws to its lower-right */}
          <g stroke="rgba(0,0,0,0.22)" strokeWidth="1.6">
            <line x1="61.8" y1="4" x2="61.8" y2="36" />
            <line x1="221.8" y1="4" x2="221.8" y2="36" />
          </g>
          {/* Left chain */}
          <line x1="60" y1="0" x2="60" y2="36" />
          {[6, 14, 22, 30].map((y) => (
            <ellipse key={`L${y}`} cx="60" cy={y} rx="3" ry="2" fill="none" stroke="#2C1810" strokeWidth="1.2" />
          ))}
          {/* Link glints — light catching the top of each link */}
          {[6, 14, 22, 30].map((y) => (
            <path key={`Lg${y}`} d={`M 58 ${y - 1.2} q 2 -1 4 0`} fill="none" stroke="rgba(240,216,168,0.4)" strokeWidth="0.6" />
          ))}
          {/* Right chain */}
          <line x1="220" y1="0" x2="220" y2="36" />
          {[6, 14, 22, 30].map((y) => (
            <ellipse key={`R${y}`} cx="220" cy={y} rx="3" ry="2" fill="none" stroke="#2C1810" strokeWidth="1.2" />
          ))}
          {[6, 14, 22, 30].map((y) => (
            <path key={`Rg${y}`} d={`M 218 ${y - 1.2} q 2 -1 4 0`} fill="none" stroke="rgba(240,216,168,0.4)" strokeWidth="0.6" />
          ))}
        </g>

        {/* ── Wooden frame ── */}
        <rect x="14" y="36" width="252" height="288" rx="6" fill="url(#cb-wood)" stroke="#1C0E04" strokeWidth="1.2" />
        {/* Inner relief shadow */}
        <rect x="20" y="42" width="240" height="276" rx="3" fill="url(#cb-wood-dk)" />
        {/* Frame bevel — light catches the top + left outer edges */}
        <path d="M 17 320 L 17 42 Q 17 39 20 39 L 262 39" fill="none" stroke="rgba(200,140,80,0.35)" strokeWidth="1.2" strokeLinecap="round" />
        {/* Frame bevel — bottom + right edges fall into shade */}
        <path d="M 263 42 L 263 318 Q 263 321 260 321 L 18 321" fill="none" stroke="rgba(0,0,0,0.45)" strokeWidth="1.4" strokeLinecap="round" />
        {/* Mitered corner joints — 45° seams from outer to inner corner */}
        <g stroke="rgba(0,0,0,0.42)" strokeWidth="0.8">
          <line x1="15" y1="37" x2="32" y2="54" />
          <line x1="265" y1="37" x2="248" y2="54" />
          <line x1="15" y1="323" x2="32" y2="306" />
          <line x1="265" y1="323" x2="248" y2="306" />
        </g>
        {/* Light kick along each miter seam (lower side) */}
        <g stroke="rgba(200,140,80,0.16)" strokeWidth="0.6">
          <line x1="15.8" y1="37.8" x2="32.8" y2="54.8" />
          <line x1="264.2" y1="37.8" x2="247.2" y2="54.8" />
        </g>
        {/* Wood grain hairlines */}
        <g stroke="rgba(0,0,0,0.35)" strokeWidth="0.4" fill="none">
          <path d="M14 70 q80 -4 130 0 q60 4 122 -2" />
          <path d="M14 100 q60 4 130 0 q60 -4 122 2" />
          <path d="M14 130 q80 -2 130 1 q60 4 122 -1" />
          <path d="M14 290 q60 2 130 -1 q60 -2 122 1" />
        </g>
        {/* Lighter grain streaks — figure in the stain */}
        <g stroke="rgba(200,140,80,0.12)" strokeWidth="0.5" fill="none">
          <path d="M14 58 q90 3 140 0 q60 -3 112 1" />
          <path d="M14 310 q70 -3 130 0 q64 3 122 -1" />
          <path d="M25 44 q0 90 1 140 q-1 70 0 136" />
          <path d="M255 44 q1 90 0 140 q1 70 0 136" />
        </g>
        {/* Corner bolts — each with a specular catch + occlusion ring */}
        {[
          [28, 50], [252, 50], [28, 310], [252, 310],
        ].map(([cx, cy]) => (
          <g key={`${cx},${cy}`} transform={`translate(${cx} ${cy})`}>
            <circle r="4.8" fill="rgba(0,0,0,0.35)" />
            <circle r="4" fill="#1C0E04" stroke="#5A3018" strokeWidth="0.8" />
            <path d="M-2 0 L2 0 M0 -2 L0 2" stroke="#7A5028" strokeWidth="0.8" strokeLinecap="round" />
            <circle cx="-1.3" cy="-1.3" r="0.7" fill="rgba(240,216,168,0.55)" />
          </g>
        ))}

        {/* ── Slate chalkboard surface ── */}
        <rect x="32" y="54" width="216" height="252" rx="2" fill="url(#cb-slate)" />
        {/* Mottled slate depth — broad soft mineral blotches */}
        <g>
          <ellipse cx="90"  cy="120" rx="55" ry="38" fill="rgba(46,60,56,0.16)" />
          <ellipse cx="195" cy="90"  rx="45" ry="30" fill="rgba(30,42,38,0.2)" />
          <ellipse cx="160" cy="250" rx="70" ry="42" fill="rgba(24,34,30,0.22)" />
          <ellipse cx="70"  cy="220" rx="38" ry="28" fill="rgba(52,66,60,0.1)" />
          <ellipse cx="215" cy="180" rx="30" ry="45" fill="rgba(40,54,48,0.12)" />
        </g>
        <rect x="32" y="54" width="216" height="252" rx="2" fill="url(#cb-dust)" opacity="0.4" />
        {/* Recess occlusion — frame shadows falling onto the slate */}
        <rect x="32" y="54" width="216" height="12" fill="url(#cb-slate-occ)" />
        <rect x="32" y="54" width="10" height="252" fill="url(#cb-slate-occ-l)" />
        {/* Inner-edge chalk smudge */}
        <rect x="32" y="54" width="216" height="252" rx="2"
          fill="none" stroke="rgba(243,233,213,0.07)" strokeWidth="3" />
        {/* Slate lower-edge light — thin cool reflection where it meets the frame */}
        <line x1="36" y1="304.6" x2="244" y2="304.6" stroke="rgba(243,233,213,0.08)" strokeWidth="0.8" />

        {/* ── Hand-lettered "Today's Special" header ── */}
        <g>
          {/* Small fleurons left/right of the heading */}
          <path d="M 70 84 l 4 -4 l 4 4 l -4 4 z" fill="#F3E9D5" opacity="0.7" />
          <path d="M 202 84 l 4 -4 l 4 4 l -4 4 z" fill="#F3E9D5" opacity="0.7" />
          {/* Dust-glow halo behind the header */}
          <text
            x="140" y="88"
            textAnchor="middle"
            fontFamily="Georgia, 'Times New Roman', serif"
            fontStyle="italic"
            fontWeight="700"
            fontSize="14"
            fill="none"
            stroke="rgba(243,233,213,0.14)"
            strokeWidth="2.6"
            letterSpacing="0.18em"
          >
            Today&#39;s Special
          </text>
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
          {/* Chalk-dust glow halo — wide, faint stroke copy behind */}
          <text
            x="140" y="208"
            textAnchor="middle"
            fontFamily="Georgia, 'Times New Roman', serif"
            fontStyle="italic"
            fontWeight="900"
            fontSize="76"
            fill="rgba(255,224,160,0.07)"
            stroke="rgba(255,224,160,0.13)"
            strokeWidth="5"
            letterSpacing="-0.02em"
          >
            $300
          </text>
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
