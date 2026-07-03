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
          {/* Vinyl body — deep black wax with tonal bands (dead wax, groove
              area, raised outer bead) modeled by the radial stops */}
          <radialGradient id="vinyl-body" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="#1A1410" />
            <stop offset="22%"  stopColor="#100A06" />
            <stop offset="55%"  stopColor="#0C0704" />
            <stop offset="82%"  stopColor="#150E08" />
            <stop offset="95%"  stopColor="#221610" />
            <stop offset="100%" stopColor="#080401" />
          </radialGradient>

          {/* Label paper — warm cream radial */}
          <radialGradient id="vinyl-label" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="#FBF2DC" />
            <stop offset="80%"  stopColor="#E8C99A" />
            <stop offset="100%" stopColor="#9B6840" />
          </radialGradient>

          {/* Label paper grain — fine two-tone stipple */}
          <pattern id="vinyl-paper" width="3" height="3" patternUnits="userSpaceOnUse">
            <circle cx="0.8" cy="0.8" r="0.35" fill="rgba(155,104,64,0.1)" />
            <circle cx="2.2" cy="2.1" r="0.28" fill="rgba(255,250,235,0.16)" />
          </pattern>

          {/* Center label text path — top arc */}
          <path id="vinyl-arc-top" d="M 110 110 m -40 0 a 40 40 0 1 1 80 0" fill="none" />
          <path id="vinyl-arc-bot" d="M 110 110 m -36 0 a 36 36 0 1 0 72 0" fill="none" />
        </defs>

        {/* ── Vinyl body ── */}
        <circle cx="110" cy="110" r="108" fill="url(#vinyl-body)" stroke="#000" strokeWidth="0.8" />
        {/* Machined edge — thin ambient ring right at the rim */}
        <circle cx="110" cy="110" r="107.3" fill="none" stroke="rgba(255,240,205,0.07)" strokeWidth="0.7" />
        <circle cx="110" cy="110" r="106.2" fill="none" stroke="rgba(0,0,0,0.6)" strokeWidth="0.8" />

        {/* Concentric groove rings — multiple thin near-black circles */}
        {[
          104, 102, 100, 98, 96, 94, 92, 90, 88, 86, 84, 82, 80, 78,
          76, 74, 72, 70, 68, 66, 64, 62, 60, 58, 56, 54, 52, 50, 48,
        ].map((r, i) => (
          <circle
            key={r}
            cx="110" cy="110" r={r}
            fill="none"
            stroke={i % 2 === 0 ? "rgba(0,0,0,0.55)" : "rgba(255,235,195,0.028)"}
            strokeWidth={i % 3 === 0 ? 0.45 : 0.25}
            opacity={i % 5 === 0 ? 0.9 : 0.65}
          />
        ))}

        {/* Subtle wider groove "band" at outer edge + track separations */}
        <circle cx="110" cy="110" r="103" fill="none" stroke="rgba(0,0,0,0.4)" strokeWidth="2" opacity="0.4" />
        <circle cx="110" cy="110" r="87" fill="none" stroke="rgba(0,0,0,0.5)" strokeWidth="1.4" opacity="0.5" />
        <circle cx="110" cy="110" r="67" fill="none" stroke="rgba(0,0,0,0.5)" strokeWidth="1.4" opacity="0.5" />

        {/* ── Center paper label ── */}
        {/* Occlusion trench where the wax meets the label edge */}
        <circle cx="110" cy="110" r="43.8" fill="none" stroke="rgba(0,0,0,0.55)" strokeWidth="1.8" opacity="0.7" />
        <circle cx="110" cy="110" r="42" fill="url(#vinyl-label)" stroke="#A84818" strokeWidth="0.6" />
        {/* Paper grain texture (spins with the label — physically correct) */}
        <circle cx="110" cy="110" r="41.7" fill="url(#vinyl-paper)" opacity="0.8" />
        {/* Label edge catching light — raised paper lip */}
        <circle cx="110" cy="110" r="42.6" fill="none" stroke="rgba(255,235,195,0.14)" strokeWidth="0.5" />
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

        {/* ── Spindle hole — punched through with real depth ── */}
        {/* Pressed-paper occlusion around the hole */}
        <circle cx="110" cy="110" r="4.7" fill="none" stroke="rgba(90,50,20,0.3)" strokeWidth="1.3" />
        <circle cx="110" cy="110" r="4" fill="#070402" />
        {/* Inner-bore shadow at the top, light catch on the lower lip */}
        <path d="M 106.8 108.2 A 4 4 0 0 1 113.2 108.2" stroke="rgba(0,0,0,0.8)" strokeWidth="0.7" fill="none" />
        <path d="M 106.6 111.6 A 4 4 0 0 0 113.4 111.6" stroke="rgba(255,235,200,0.4)" strokeWidth="0.5" fill="none" />
      </svg>

      {/* ── Fixed lighting rig — sits OUTSIDE .vinyl-spinner so the light
             stays anchored to the room while the record spins under it ── */}
      {/* Key-light bloom from the upper-left */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "50%",
          pointerEvents: "none",
          background:
            "radial-gradient(circle at 32% 28%, rgba(255,225,170,0.2) 0%, rgba(255,200,140,0.06) 34%, rgba(255,200,140,0) 62%)",
        }}
      />
      {/* Anisotropic groove sheen — the classic twin light bands across the
          groove area (10:30 / 4:30), masked to a donut so the label stays matte */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "50%",
          pointerEvents: "none",
          background:
            "conic-gradient(from 0deg at 50% 50%, transparent 0deg, transparent 116deg, rgba(255,225,175,0.045) 127deg, rgba(255,230,185,0.12) 136deg, rgba(255,225,175,0.045) 145deg, transparent 156deg, transparent 294deg, rgba(255,240,205,0.06) 305deg, rgba(255,244,214,0.2) 315deg, rgba(255,240,205,0.06) 325deg, transparent 336deg, transparent 360deg)",
          WebkitMaskImage:
            "radial-gradient(circle at 50% 50%, transparent 0%, transparent 20%, black 22%, black 48%, transparent 49.5%)",
          maskImage:
            "radial-gradient(circle at 50% 50%, transparent 0%, transparent 20%, black 22%, black 48%, transparent 49.5%)",
        }}
      />
      {/* Rim light (upper-left crescent) + edge occlusion (lower-right) */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "50%",
          pointerEvents: "none",
          boxShadow:
            "inset 1.5px 2px 2px rgba(255,235,195,0.16), inset -2px -2.5px 3px rgba(0,0,0,0.55)",
        }}
      />
    </div>
  );
}
