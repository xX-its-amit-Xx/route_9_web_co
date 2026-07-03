"use client";

/**
 * Ambient falling maple leaves — small SVG leaves drift down inside the
 * parent container with per-leaf sway + rotation timings. Suitable as a
 * decorative backdrop layer inside a relatively-positioned section.
 *
 * Each leaf gets:
 *   - A random horizontal start position
 *   - A random fall duration (16s – 28s) so they desync
 *   - A random delay (0s – 18s) so leaves are mid-flight on first paint
 *   - One of three brand-matched warm autumn fills
 *   - Three different leaf SVG silhouettes for visual variety
 *
 * Decorative (aria-hidden, pointer-events:none). Hidden entirely under
 * prefers-reduced-motion via the .maple-leaf CSS class.
 */

const LEAVES = [
  { left: "6%",  scale: 0.7, dur: 22, delay: -2,  variant: 0, fill: "#D4682A" },
  { left: "14%", scale: 0.9, dur: 18, delay: -9,  variant: 1, fill: "#A84818" },
  { left: "26%", scale: 0.6, dur: 26, delay: -14, variant: 2, fill: "#E07838" },
  { left: "38%", scale: 0.8, dur: 20, delay: -5,  variant: 0, fill: "#C05A20" },
  { left: "52%", scale: 1.0, dur: 28, delay: -18, variant: 1, fill: "#D4682A" },
  { left: "63%", scale: 0.7, dur: 17, delay: -1,  variant: 2, fill: "#8E3A0E" },
  { left: "74%", scale: 0.85, dur: 24, delay: -11, variant: 0, fill: "#E07838" },
  { left: "86%", scale: 0.65, dur: 19, delay: -6,  variant: 1, fill: "#A84818" },
  { left: "94%", scale: 0.75, dur: 23, delay: -16, variant: 2, fill: "#D4682A" },
];

// Two-tone autumn shading per brand fill — [sunlit face, shadowed underside].
// The gradient models a leaf tilted toward the light; the dark stop doubles
// as the curled-under edge so each leaf reads as a 3D flake, not a cutout.
const TONES: Record<string, [string, string]> = {
  "#D4682A": ["#EE8B45", "#A84818"],
  "#A84818": ["#C86228", "#7E3210"],
  "#E07838": ["#F49B58", "#B85520"],
  "#C05A20": ["#DE7836", "#94420F"],
  "#8E3A0E": ["#B25522", "#67280A"],
};

// Three hand-drawn maple leaf silhouettes — five-lobed, ribbed
const VARIANTS = [
  // Classic five-lobe symmetric
  "M 0 -14 Q 4 -10 7 -11 Q 10 -8 9 -3 Q 12 -2 12 1 Q 10 5 6 6 Q 7 10 5 12 Q 2 11 0 8 Q -2 11 -5 12 Q -7 10 -6 6 Q -10 5 -12 1 Q -12 -2 -9 -3 Q -10 -8 -7 -11 Q -4 -10 0 -14 Z",
  // Slightly tilted, more angular
  "M 0 -13 Q 5 -8 8 -9 Q 11 -6 8 -2 Q 13 -1 11 3 Q 8 6 4 5 Q 6 10 3 12 Q 0 10 -1 7 Q -3 11 -6 11 Q -8 8 -5 5 Q -10 4 -11 0 Q -10 -4 -7 -4 Q -8 -8 -4 -10 Q 0 -13 0 -13 Z",
  // Smaller / rounder
  "M 0 -11 Q 3 -8 6 -8 Q 8 -5 6 -2 Q 10 0 8 4 Q 5 5 2 4 Q 4 8 1 9 Q -2 9 -3 6 Q -5 9 -7 6 Q -8 3 -5 2 Q -9 0 -8 -3 Q -6 -6 -3 -6 Q -2 -9 0 -11 Z",
];

export function MapleLeafFall() {
  return (
    <div
      aria-hidden
      className="absolute inset-0 pointer-events-none overflow-hidden"
      style={{ zIndex: 0 }}
    >
      {LEAVES.map((l, i) => {
        const [lit, shade] = TONES[l.fill] ?? [l.fill, l.fill];
        // Vary the light angle per leaf so each one reads as tilted at a
        // slightly different attitude while it flutters
        const lightAngle = (i * 47) % 360;
        return (
        <span
          key={i}
          className="maple-leaf"
          style={{
            position: "absolute",
            top: 0,
            left: l.left,
            // Custom properties consumed by the CSS keyframe definitions
            ["--leaf-dur" as never]: `${l.dur}s`,
            ["--leaf-delay" as never]: `${l.delay}s`,
            ["--leaf-scale" as never]: l.scale,
          }}
        >
          <svg
            viewBox="-14 -14 28 28"
            xmlns="http://www.w3.org/2000/svg"
            width="22"
            height="22"
            style={{ overflow: "visible" }}
          >
            <defs>
              {/* Two-tone autumn gradient — sunlit face into shadowed edge */}
              <linearGradient
                id={`mlf-g-${i}`}
                x1="0" y1="0" x2="1" y2="1"
                gradientTransform={`rotate(${lightAngle} 0.5 0.5)`}
              >
                <stop offset="0%" stopColor={lit} />
                <stop offset="55%" stopColor={l.fill} />
                <stop offset="100%" stopColor={shade} />
              </linearGradient>
              <clipPath id={`mlf-c-${i}`}>
                <path d={VARIANTS[l.variant]} />
              </clipPath>
            </defs>
            {/* Curled-under edge — a dark duplicate peeking below-right
                gives the flake physical thickness */}
            <path
              d={VARIANTS[l.variant]}
              fill={shade}
              opacity="0.5"
              transform="translate(0.5 0.7)"
            />
            {/* Leaf body */}
            <path d={VARIANTS[l.variant]} fill={`url(#mlf-g-${i})`} opacity="0.9" />
            {/* Sheen — soft light pooling on the lobe facing the sun,
                clipped to the silhouette */}
            <g clipPath={`url(#mlf-c-${i})`}>
              <ellipse
                cx="-3.5" cy="-5" rx="4.5" ry="5.5"
                fill="rgba(255,236,190,0.28)"
                transform={`rotate(${-24 + ((i * 31) % 20)} -3.5 -5)`}
              />
            </g>
            {/* Subtle inner rib */}
            <path
              d="M 0 -12 L 0 9"
              stroke="#1C1209"
              strokeWidth="0.45"
              strokeLinecap="round"
              opacity="0.55"
            />
            <path
              d="M 0 -6 L -5 -1 M 0 -6 L 5 -1 M 0 -1 L -6 3 M 0 -1 L 6 3 M 0 4 L -4 7 M 0 4 L 4 7"
              stroke="#1C1209"
              strokeWidth="0.3"
              strokeLinecap="round"
              opacity="0.4"
            />
            {/* Vein relief — hairline light echo beside the main rib */}
            <path
              d="M 0.5 -11.5 L 0.5 8.5"
              stroke="rgba(255,236,190,0.35)"
              strokeWidth="0.3"
              strokeLinecap="round"
            />
            {/* Stem — shaded round twig */}
            <line x1="0" y1="9" x2="0" y2="13" stroke="#3A1C0A" strokeWidth="0.9" strokeLinecap="round" />
            <line x1="-0.2" y1="9" x2="-0.2" y2="12.6" stroke="#8E5A30" strokeWidth="0.35" strokeLinecap="round" />
          </svg>
        </span>
        );
      })}
    </div>
  );
}
