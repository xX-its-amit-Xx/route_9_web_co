"use client";

/**
 * Vintage 12-inch vinyl record — black wax with concentric groove tracks,
 * a paper center label carrying the Route 9 Web Co. brand, center spindle
 * hole, and a soft radial sheen catching light from the upper-left.
 *
 * Spins on hover (or continuously, depending on the `spinning` prop) at a
 * vintage 33⅓ RPM-ish pace. Reduced-motion freezes the spin and the
 * record stands as a static illustration.
 *
 * Decorative (aria-hidden). Self-contained — no animations to worry
 * about under prefers-reduced-motion beyond the spin keyframe.
 */
type Props = {
  size?: number;
  /** Always spinning (true) vs spin-on-hover (false). */
  spinning?: boolean;
};

export function VinylRecord({ size = 220, spinning = false }: Props) {
  return (
    <div
      aria-hidden
      className={`vinyl-record ${spinning ? "is-spinning" : "spin-on-hover"} inline-block select-none`}
      style={{
        width: size,
        height: size,
        position: "relative",
        filter:
          "drop-shadow(0 12px 28px rgba(0,0,0,0.45)) drop-shadow(0 4px 8px rgba(0,0,0,0.35))",
      }}
    >
      <svg
        viewBox="0 0 220 220"
        xmlns="http://www.w3.org/2000/svg"
        className="vinyl-spinner"
        style={{ width: "100%", height: "100%", overflow: "visible" }}
      >
        <defs>
          {/* Vinyl body — deep black with a hint of warmth at the rim */}
          <radialGradient id="vinyl-body" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="#181410" />
            <stop offset="60%"  stopColor="#0E0805" />
            <stop offset="100%" stopColor="#1C1209" />
          </radialGradient>

          {/* Soft specular catch — top-left sheen */}
          <radialGradient id="vinyl-sheen" cx="32%" cy="28%" r="55%">
            <stop offset="0%"   stopColor="rgba(255,225,170,0.25)" />
            <stop offset="40%"  stopColor="rgba(255,200,140,0.08)" />
            <stop offset="100%" stopColor="rgba(255,200,140,0)" />
          </radialGradient>

          {/* Label paper — warm cream radial */}
          <radialGradient id="vinyl-label" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="#FBF2DC" />
            <stop offset="80%"  stopColor="#E8C99A" />
            <stop offset="100%" stopColor="#9B6840" />
          </radialGradient>

          {/* Center label text path — top arc */}
          <path id="vinyl-arc-top" d="M 110 110 m -40 0 a 40 40 0 1 1 80 0" fill="none" />
          <path id="vinyl-arc-bot" d="M 110 110 m -36 0 a 36 36 0 1 0 72 0" fill="none" />
        </defs>

        {/* ── Vinyl body ── */}
        <circle cx="110" cy="110" r="108" fill="url(#vinyl-body)" stroke="#000" strokeWidth="0.8" />

        {/* Concentric groove rings — multiple thin near-black circles */}
        {[
          100, 96, 92, 88, 84, 80, 76, 72, 68, 64, 60, 56, 52,
        ].map((r, i) => (
          <circle
            key={r}
            cx="110" cy="110" r={r}
            fill="none"
            stroke="rgba(0,0,0,0.55)"
            strokeWidth={i % 3 === 0 ? 0.45 : 0.25}
            opacity={i % 5 === 0 ? 0.9 : 0.65}
          />
        ))}

        {/* Subtle wider groove "band" at outer edge */}
        <circle cx="110" cy="110" r="103" fill="none" stroke="rgba(0,0,0,0.4)" strokeWidth="2" opacity="0.4" />

        {/* Sheen catch */}
        <circle cx="110" cy="110" r="108" fill="url(#vinyl-sheen)" />

        {/* ── Center paper label ── */}
        <circle cx="110" cy="110" r="42" fill="url(#vinyl-label)" stroke="#A84818" strokeWidth="0.6" />
        <circle cx="110" cy="110" r="38" fill="none" stroke="rgba(168,72,24,0.45)" strokeWidth="0.5" />

        {/* Curved label text — top (arc r=40, ~126 units long) */}
        <text fontFamily="Georgia, serif" fontWeight="700" fontSize="5" letterSpacing="0.3" fill="#A84818">
          <textPath href="#vinyl-arc-top" startOffset="50%" textAnchor="middle">
            ROUTE 9 WEB CO. · RECORDS
          </textPath>
        </text>

        {/* Bottom curved tagline (arc r=36, ~113 units long) */}
        <text fontFamily="monospace" fontWeight="700" fontSize="3.6" letterSpacing="0.4" fill="#A84818" opacity="0.85">
          <textPath href="#vinyl-arc-bot" startOffset="50%" textAnchor="middle">
            SHREWSBURY MA · 33⅓ RPM
          </textPath>
        </text>

        {/* Central wordmark — italic R9 */}
        <text
          x="110" y="106"
          textAnchor="middle"
          fontFamily="Georgia, 'Times New Roman', serif"
          fontStyle="italic"
          fontWeight="900"
          fontSize="22"
          fill="#1C1209"
        >
          R·9
        </text>
        <text
          x="110" y="120"
          textAnchor="middle"
          fontFamily="monospace"
          fontSize="5"
          fontWeight="700"
          fill="#1C1209"
          letterSpacing="0.3em"
          opacity="0.7"
        >
          SIDE A
        </text>

        {/* Small star ornament */}
        <path
          d="M 110 132 l 1.4 -2.5 l 2.7 0 l -2 1.5 l 0.7 2.7 l -2.4 -1.8 l -2.4 1.8 l 0.7 -2.7 l -2 -1.5 l 2.7 0 z"
          fill="#A84818"
        />

        {/* ── Spindle hole ── */}
        <circle cx="110" cy="110" r="4" fill="#0E0805" stroke="#1C1209" strokeWidth="0.5" />
        <circle cx="110" cy="110" r="4" fill="rgba(255,225,170,0.15)" />

        {/* A few faint reflective highlights radiating across the body */}
        <path
          d="M 16 80 q 90 -30 188 30"
          stroke="rgba(255,225,170,0.06)"
          strokeWidth="1.5"
          fill="none"
        />
        <path
          d="M 22 150 q 90 30 180 -20"
          stroke="rgba(255,225,170,0.04)"
          strokeWidth="1.2"
          fill="none"
        />
      </svg>
    </div>
  );
}
