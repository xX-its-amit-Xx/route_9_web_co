"use client";

/**
 * Vintage open-faced pocket watch with chain — a small decorative
 * artifact emphasizing the "fast response time" promise wherever it
 * sits.
 *
 * Built as a single SVG:
 *   - Brass case with concentric beveled rings and a textured outer rim
 *   - Crown winder at the top + chain links rising up to a T-bar fob
 *   - Cream watch face with Roman numerals at the hour positions, plus
 *     fine minute ticks, a small "subseconds" dial at 6 o'clock, and
 *     a maker's signature
 *   - Three hands (hour, minute, second) positioned at the classic
 *     "10:10:32" photographer's pose so the brand looks alert
 *   - Center pivot rivet + a subtle warm glow over the dial for the
 *     hand-rubbed brass feel
 *
 * The second hand sweeps continuously under normal motion. Reduced-
 * motion locks it at its resting position (12 o'clock) so the watch
 * still reads as a static illustration.
 */
export function PocketWatch({ size = 160 }: { size?: number }) {
  // viewBox is 200 × 280 so there's room for the chain above the case.
  return (
    <div
      aria-hidden
      className="pocket-watch inline-block select-none"
      style={{
        width: Math.round(size * (200 / 280)),
        height: size,
        transform: "rotate(-4deg)",
        filter:
          "drop-shadow(0 6px 14px rgba(28,18,9,0.32)) drop-shadow(0 2px 4px rgba(28,18,9,0.22))",
      }}
    >
      <svg
        viewBox="0 0 200 280"
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: "100%", height: "100%", overflow: "visible" }}
      >
        <defs>
          {/* Brass case gradient — warm gold/copper */}
          <radialGradient id="pw-case" cx="40%" cy="35%" r="65%">
            <stop offset="0%"   stopColor="#FFE0A0" />
            <stop offset="40%"  stopColor="#D4A050" />
            <stop offset="100%" stopColor="#7E5018" />
          </radialGradient>
          {/* Inner bezel — slightly darker brass */}
          <radialGradient id="pw-bezel" cx="50%" cy="50%" r="50%">
            <stop offset="80%"  stopColor="rgba(168,72,24,0)" />
            <stop offset="100%" stopColor="rgba(94,34,8,0.55)" />
          </radialGradient>
          {/* Watch face — vintage cream */}
          <radialGradient id="pw-face" cx="50%" cy="40%" r="70%">
            <stop offset="0%"   stopColor="#FDF5DE" />
            <stop offset="85%"  stopColor="#EFD9A6" />
            <stop offset="100%" stopColor="#C99860" />
          </radialGradient>
          {/* Chain link gradient */}
          <linearGradient id="pw-chain" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%"   stopColor="#7E5018" />
            <stop offset="40%"  stopColor="#D4A050" />
            <stop offset="60%"  stopColor="#FFE0A0" />
            <stop offset="100%" stopColor="#7E5018" />
          </linearGradient>
        </defs>

        {/* ── Chain hanging up to T-bar fob ── */}
        <g>
          {/* Chain segments — alternating ellipses to suggest oval links */}
          {[
            { cx: 100, cy: 12,  rx: 5, ry: 3 },
            { cx: 100, cy: 24,  rx: 3, ry: 5 },
            { cx: 100, cy: 36,  rx: 5, ry: 3 },
            { cx: 100, cy: 48,  rx: 3, ry: 5 },
            { cx: 100, cy: 60,  rx: 5, ry: 3 },
            { cx: 100, cy: 72,  rx: 3, ry: 5 },
            { cx: 100, cy: 84,  rx: 5, ry: 3 },
          ].map((l, i) => (
            <ellipse
              key={i}
              cx={l.cx} cy={l.cy} rx={l.rx} ry={l.ry}
              fill="url(#pw-chain)"
              stroke="#3A1408"
              strokeWidth="0.5"
            />
          ))}
          {/* T-bar fob at top */}
          <rect x="84" y="2" width="32" height="6" rx="2" fill="url(#pw-case)" stroke="#3A1408" strokeWidth="0.6" />
          <circle cx="84" cy="5" r="3" fill="#FFE0A0" stroke="#3A1408" strokeWidth="0.6" />
          <circle cx="116" cy="5" r="3" fill="#FFE0A0" stroke="#3A1408" strokeWidth="0.6" />
        </g>

        {/* ── Crown winder (top of case) ── */}
        <g>
          <rect x="92" y="86" width="16" height="10" rx="2" fill="url(#pw-case)" stroke="#3A1408" strokeWidth="0.8" />
          {/* Knurled texture on the crown */}
          {[94, 97, 100, 103, 106].map((x) => (
            <line key={x} x1={x} y1="87" x2={x} y2="95" stroke="#3A1408" strokeWidth="0.4" />
          ))}
          {/* Bow that connects to chain */}
          <path d="M 92 90 q -6 -2 -6 -8 q 0 -8 14 -6" stroke="url(#pw-case)" strokeWidth="3.5" fill="none" />
          <path d="M 92 90 q -6 -2 -6 -8 q 0 -8 14 -6" stroke="#3A1408" strokeWidth="0.6" fill="none" />
        </g>

        {/* ── Case body — concentric brass rings ── */}
        <g transform="translate(100 178)">
          {/* Outer rim */}
          <circle r="78" fill="url(#pw-case)" stroke="#3A1408" strokeWidth="1.4" />
          {/* Textured outer rim — knurling around the edge */}
          {[...Array(60)].map((_, i) => {
            const a = (i * 6 * Math.PI) / 180;
            const x1 = Math.cos(a) * 75;
            const y1 = Math.sin(a) * 75;
            const x2 = Math.cos(a) * 78;
            const y2 = Math.sin(a) * 78;
            return (
              <line key={i}
                x1={x1} y1={y1} x2={x2} y2={y2}
                stroke="#3A1408" strokeWidth="0.5" opacity="0.6"
              />
            );
          })}
          {/* Inner bezel ring */}
          <circle r="70" fill="url(#pw-case)" stroke="#3A1408" strokeWidth="0.8" />
          <circle r="66" fill="url(#pw-case)" stroke="rgba(168,72,24,0.45)" strokeWidth="0.5" />
          {/* Face well */}
          <circle r="62" fill="url(#pw-face)" stroke="#3A1408" strokeWidth="0.9" />
          {/* Inner shadow on face */}
          <circle r="62" fill="url(#pw-bezel)" />

          {/* Roman numerals at the 12 hour positions */}
          {[
            { n: "XII", a: 270 }, { n: "I",   a: 300 },
            { n: "II",  a: 330 }, { n: "III", a:   0 },
            { n: "IV",  a:  30 }, { n: "V",   a:  60 },
            { n: "VI",  a:  90 }, { n: "VII", a: 120 },
            { n: "VIII",a: 150 }, { n: "IX",  a: 180 },
            { n: "X",   a: 210 }, { n: "XI",  a: 240 },
          ].map(({ n, a }) => {
            const r = 52;
            const rad = (a * Math.PI) / 180;
            const x = Math.cos(rad) * r;
            const y = Math.sin(rad) * r + 2.5;
            return (
              <text
                key={n}
                x={x} y={y}
                textAnchor="middle"
                fontFamily="Georgia, 'Times New Roman', serif"
                fontWeight="700"
                fontSize="8.5"
                fill="#3A1408"
              >
                {n}
              </text>
            );
          })}

          {/* Fine minute ticks — 60 around the rim */}
          {[...Array(60)].map((_, i) => {
            const a = (i * 6 * Math.PI) / 180;
            const r1 = i % 5 === 0 ? 58 : 60;
            const r2 = 62;
            const x1 = Math.cos(a) * r1;
            const y1 = Math.sin(a) * r1;
            const x2 = Math.cos(a) * r2;
            const y2 = Math.sin(a) * r2;
            return (
              <line key={i}
                x1={x1} y1={y1} x2={x2} y2={y2}
                stroke="#3A1408"
                strokeWidth={i % 5 === 0 ? 1.2 : 0.4}
              />
            );
          })}

          {/* Maker's signature, top under XII */}
          <text x="0" y="-30" textAnchor="middle"
            fontFamily="Georgia, serif" fontStyle="italic"
            fontWeight="700" fontSize="6"
            fill="rgba(58,20,8,0.78)" letterSpacing="0.18em">
            R · 9 · MASS
          </text>

          {/* Subseconds dial at 6 o'clock */}
          <g transform="translate(0 28)">
            <circle r="11" fill="url(#pw-face)" stroke="#3A1408" strokeWidth="0.7" />
            <circle r="11" fill="url(#pw-bezel)" />
            {/* Ticks */}
            {[...Array(12)].map((_, i) => {
              const a = (i * 30 * Math.PI) / 180;
              const x1 = Math.cos(a) * 8;
              const y1 = Math.sin(a) * 8;
              const x2 = Math.cos(a) * 10;
              const y2 = Math.sin(a) * 10;
              return (
                <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
                  stroke="#3A1408" strokeWidth={i % 3 === 0 ? 0.7 : 0.3} />
              );
            })}
            {/* Mini second hand pointing at 4 */}
            <line x1="0" y1="0" x2="6" y2="3" stroke="#3A1408" strokeWidth="0.7" strokeLinecap="round" />
            <circle r="1" fill="#3A1408" />
            <text x="0" y="-4" textAnchor="middle"
              fontFamily="monospace" fontSize="3.5"
              fontWeight="700" fill="rgba(58,20,8,0.55)" letterSpacing="0.3">
              SEC
            </text>
          </g>

          {/* ── Hour hand — short + thick, pointing at 10 ── */}
          <g transform="rotate(-60)">
            <path d="M -2 4 L 0 -32 L 2 4 Z"
              fill="#1C0E04"
              stroke="#3A1408" strokeWidth="0.4"
            />
          </g>

          {/* ── Minute hand — long + thin, pointing at 2 ── */}
          <g transform="rotate(60)">
            <path d="M -1.4 4 L 0 -48 L 1.4 4 Z"
              fill="#1C0E04"
              stroke="#3A1408" strokeWidth="0.3"
            />
          </g>

          {/* ── Sweeping second hand — thin orange, continuously rotating ── */}
          <g className="pw-second" style={{ transformOrigin: "center" }}>
            <line x1="0" y1="6" x2="0" y2="-54"
              stroke="#A84818" strokeWidth="0.8" strokeLinecap="round" />
            {/* Counterweight tail + tip ball */}
            <circle cx="0" cy="6" r="1.6" fill="#A84818" />
            <circle cx="0" cy="-54" r="0.9" fill="#A84818" />
          </g>

          {/* Center pivot rivet */}
          <circle r="3" fill="#3A1408" />
          <circle r="2" fill="#D4A050" />
          <circle cx="-0.6" cy="-0.6" r="0.6" fill="rgba(255,225,170,0.8)" />
        </g>
      </svg>
    </div>
  );
}
