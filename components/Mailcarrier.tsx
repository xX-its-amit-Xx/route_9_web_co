"use client";

/**
 * Otis — a hand-illustrated cartoon mailcarrier serving as a friendly
 * brand mascot. Vintage USPS-style cap with brass badge, walrus mustache,
 * leather mail satchel slung across the chest, and a sealed envelope
 * with the Route 9 wax-seal-style stamp held forward as if delivering it.
 *
 * Subtle idle animation: a gentle two-frame bob (otis-bob) on the whole
 * character + a 4° envelope wiggle (otis-letter) every few seconds.
 *
 * Decorative (aria-hidden). Reduced-motion freezes everything but Otis
 * still renders.
 */
export function Mailcarrier({ size = 200 }: { size?: number }) {
  return (
    <div
      aria-hidden
      className="mailcarrier-root inline-block select-none"
      style={{
        width: size,
        height: Math.round(size * 1.4),
        filter:
          "drop-shadow(0 10px 22px rgba(28,18,9,0.22)) drop-shadow(0 3px 6px rgba(28,18,9,0.18))",
      }}
    >
      <svg
        viewBox="0 0 200 280"
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: "100%", height: "100%", overflow: "visible" }}
      >
        <defs>
          {/* Cap gradient — warm navy-brown */}
          <linearGradient id="oc-cap" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#3A2415" />
            <stop offset="100%" stopColor="#1C1209" />
          </linearGradient>
          {/* Jacket gradient — warm tan */}
          <linearGradient id="oc-jacket" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#A8784A" />
            <stop offset="100%" stopColor="#6E4828" />
          </linearGradient>
          {/* Satchel — saddle brown */}
          <linearGradient id="oc-bag" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#7A4818" />
            <stop offset="100%" stopColor="#4A2808" />
          </linearGradient>
          {/* Skin tone */}
          <linearGradient id="oc-skin" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#F0CDA0" />
            <stop offset="100%" stopColor="#D4A878" />
          </linearGradient>
          {/* Envelope */}
          <linearGradient id="oc-env" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#FBF2DC" />
            <stop offset="100%" stopColor="#E8C99A" />
          </linearGradient>
        </defs>

        {/* Ground shadow */}
        <ellipse cx="100" cy="270" rx="56" ry="5" fill="rgba(0,0,0,0.32)" />

        {/* ── Whole-body container (so we can bob it as one) ── */}
        <g className="otis-body">

          {/* ── Legs ── */}
          <g>
            {/* Left leg */}
            <rect x="78" y="220" width="14" height="42" rx="3" fill="#3A2415" stroke="#1C1209" strokeWidth="1.2" />
            {/* Right leg */}
            <rect x="106" y="220" width="14" height="42" rx="3" fill="#3A2415" stroke="#1C1209" strokeWidth="1.2" />
            {/* Shoes */}
            <ellipse cx="85"  cy="266" rx="11" ry="4" fill="#1C1209" />
            <ellipse cx="113" cy="266" rx="11" ry="4" fill="#1C1209" />
            {/* Pant cuff lines */}
            <line x1="78" y1="216" x2="92" y2="216" stroke="#1C1209" strokeWidth="0.8" />
            <line x1="106" y1="216" x2="120" y2="216" stroke="#1C1209" strokeWidth="0.8" />
          </g>

          {/* ── Torso / jacket ── */}
          <g>
            {/* Jacket main body */}
            <path
              d="M 60 130 Q 60 118 78 116 L 122 116 Q 140 118 140 130 L 140 222 Q 100 230 60 222 Z"
              fill="url(#oc-jacket)"
              stroke="#1C1209"
              strokeWidth="1.4"
            />
            {/* Buttons down the front */}
            {[140, 160, 180, 200].map((y) => (
              <circle key={y} cx="100" cy={y} r="2.4" fill="#FFE0A0" stroke="#3A2415" strokeWidth="0.5" />
            ))}
            {/* Lapel V-line */}
            <path
              d="M 76 124 L 100 152 L 124 124"
              stroke="#1C1209"
              strokeWidth="1"
              fill="none"
              strokeLinecap="round"
            />
            {/* Brass uniform badge on left chest */}
            <g transform="translate(78 142)">
              <path d="M 0 -4 L 4 0 L 0 4 L -4 0 Z" fill="#FFE0A0" stroke="#A84818" strokeWidth="0.6" />
              <circle r="1.2" fill="#A84818" />
            </g>
          </g>

          {/* ── Arms ── */}
          <g>
            {/* Left arm — holding satchel strap (going back behind) */}
            <path
              d="M 60 132 Q 48 156 52 184"
              stroke="url(#oc-jacket)"
              strokeWidth="14"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M 60 132 Q 48 156 52 184"
              stroke="#1C1209"
              strokeWidth="1.4"
              fill="none"
              strokeLinecap="round"
            />
            {/* Left hand (small) */}
            <circle cx="52" cy="188" r="6" fill="url(#oc-skin)" stroke="#1C1209" strokeWidth="1" />

            {/* Right arm — out, holding the letter */}
            <path
              d="M 140 132 Q 156 152 160 178"
              stroke="url(#oc-jacket)"
              strokeWidth="14"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M 140 132 Q 156 152 160 178"
              stroke="#1C1209"
              strokeWidth="1.4"
              fill="none"
              strokeLinecap="round"
            />
            {/* Right hand */}
            <circle cx="160" cy="182" r="6" fill="url(#oc-skin)" stroke="#1C1209" strokeWidth="1" />
          </g>

          {/* ── Satchel slung across body ── */}
          <g>
            {/* Strap going from left shoulder across chest down to right hip */}
            <path
              d="M 70 120 Q 100 160 138 222"
              stroke="url(#oc-bag)"
              strokeWidth="4"
              fill="none"
              strokeLinecap="round"
            />
            <path
              d="M 70 120 Q 100 160 138 222"
              stroke="#1C1209"
              strokeWidth="0.7"
              fill="none"
              strokeLinecap="round"
            />
            {/* Bag itself on right hip */}
            <g transform="translate(138 218) rotate(-8)">
              <path
                d="M -22 0 L 22 0 L 18 38 L -18 38 Z"
                fill="url(#oc-bag)"
                stroke="#1C1209"
                strokeWidth="1.2"
              />
              {/* Bag flap */}
              <path
                d="M -22 0 L 22 0 L 18 16 L -18 16 Z"
                fill="#5E3018"
                stroke="#1C1209"
                strokeWidth="1.2"
              />
              {/* Brass buckle */}
              <rect x="-3" y="12" width="6" height="7" rx="0.8" fill="#FFE0A0" stroke="#A84818" strokeWidth="0.5" />
              <line x1="-3" y1="15.5" x2="3" y2="15.5" stroke="#A84818" strokeWidth="0.6" />
              {/* Stitching */}
              <line x1="-18" y1="3" x2="18" y2="3" stroke="rgba(255,225,170,0.45)" strokeWidth="0.5" strokeDasharray="2 1.5" />
              {/* Letter peeking out the top */}
              <rect x="-10" y="-4" width="20" height="6" fill="#FBF2DC" stroke="#A84818" strokeWidth="0.4" />
              <path d="M -10 -4 L 0 1 L 10 -4" stroke="#A84818" strokeWidth="0.4" fill="none" />
            </g>
          </g>

          {/* ── Head ── */}
          <g>
            {/* Neck shadow */}
            <rect x="92" y="108" width="16" height="14" fill="url(#oc-skin)" stroke="#1C1209" strokeWidth="1" />
            <line x1="92" y1="118" x2="108" y2="118" stroke="rgba(0,0,0,0.18)" strokeWidth="0.6" />

            {/* Face */}
            <ellipse cx="100" cy="92" rx="26" ry="28" fill="url(#oc-skin)" stroke="#1C1209" strokeWidth="1.4" />

            {/* Ears */}
            <ellipse cx="73"  cy="92" rx="4" ry="6" fill="url(#oc-skin)" stroke="#1C1209" strokeWidth="1" />
            <ellipse cx="127" cy="92" rx="4" ry="6" fill="url(#oc-skin)" stroke="#1C1209" strokeWidth="1" />

            {/* Eyes — closed-eye smile crescents */}
            <path d="M 86 86 q 4 -4 8 0" stroke="#1C1209" strokeWidth="1.6" fill="none" strokeLinecap="round" />
            <path d="M 106 86 q 4 -4 8 0" stroke="#1C1209" strokeWidth="1.6" fill="none" strokeLinecap="round" />

            {/* Eyebrows */}
            <path d="M 84 80 q 5 -2 10 0" stroke="#1C1209" strokeWidth="1.3" fill="none" strokeLinecap="round" />
            <path d="M 106 80 q 5 -2 10 0" stroke="#1C1209" strokeWidth="1.3" fill="none" strokeLinecap="round" />

            {/* Nose */}
            <path d="M 100 92 q -3 6 0 9" stroke="#1C1209" strokeWidth="1.2" fill="none" strokeLinecap="round" />

            {/* Walrus mustache — two curves under the nose */}
            <path
              d="M 88 105 q 6 4 12 0 q 6 -4 12 0 q -2 6 -6 5 q -4 -1 -6 -3 q -2 2 -6 3 q -4 1 -6 -5 Z"
              fill="#3A2415"
              stroke="#1C1209"
              strokeWidth="0.8"
            />

            {/* Friendly smile under the mustache */}
            <path d="M 92 113 q 8 5 16 0" stroke="#1C1209" strokeWidth="1.4" fill="none" strokeLinecap="round" />

            {/* Rosy cheeks */}
            <circle cx="80"  cy="100" r="3" fill="rgba(212,104,42,0.35)" />
            <circle cx="120" cy="100" r="3" fill="rgba(212,104,42,0.35)" />
          </g>

          {/* ── Cap ── */}
          <g>
            {/* Crown */}
            <path
              d="M 72 76 Q 72 60 100 58 Q 128 60 128 76 L 124 76 Q 124 64 100 64 Q 76 64 76 76 Z"
              fill="url(#oc-cap)"
              stroke="#1C1209"
              strokeWidth="1.4"
            />
            {/* Band */}
            <rect x="72" y="74" width="56" height="6" fill="#1C1209" />
            {/* Visor */}
            <path
              d="M 68 80 Q 100 90 132 80 L 130 84 Q 100 92 70 84 Z"
              fill="#1C1209"
              stroke="#0E0805"
              strokeWidth="0.8"
            />
            {/* Brass cap badge — front and center */}
            <g transform="translate(100 70)">
              <ellipse rx="9" ry="6" fill="#FFE0A0" stroke="#A84818" strokeWidth="0.6" />
              <text
                x="0" y="2"
                textAnchor="middle"
                fontSize="5.5"
                fontFamily="Georgia, serif"
                fontStyle="italic"
                fontWeight="900"
                fill="#A84818"
                letterSpacing="0.5"
              >
                R9
              </text>
            </g>
          </g>

          {/* ── The letter Otis is holding ── */}
          <g className="otis-letter" style={{ transformOrigin: "160px 182px" }}>
            <g transform="translate(160 182) rotate(-10)">
              {/* Envelope back */}
              <rect x="-26" y="-18" width="52" height="36" rx="2"
                fill="url(#oc-env)" stroke="#A84818" strokeWidth="1" />
              {/* Address lines */}
              <line x1="-20" y1="-10" x2="14" y2="-10" stroke="#A84818" strokeWidth="0.5" />
              <line x1="-20" y1="-5"  x2="10" y2="-5"  stroke="#A84818" strokeWidth="0.5" />
              <line x1="-20" y1="0"   x2="6"  y2="0"   stroke="#A84818" strokeWidth="0.5" />
              {/* Wax-seal in the corner */}
              <circle cx="18" cy="10" r="5" fill="#D4682A" stroke="#5E2208" strokeWidth="0.5" />
              <text x="18" y="12.5" textAnchor="middle" fontSize="5" fontFamily="Georgia, serif" fontStyle="italic" fontWeight="900" fill="#5E2208">R9</text>
              {/* Postmark angular stamp */}
              <rect x="-22" y="-16" width="14" height="9" rx="0.5"
                fill="none" stroke="#A84818" strokeWidth="0.5" />
              <text x="-15" y="-10" textAnchor="middle" fontSize="3" fontFamily="monospace" fontWeight="700" fill="#A84818" letterSpacing="0.5">SHRMA</text>
            </g>
          </g>
        </g>

        {/* "OTIS" name plate under his feet — like a small label */}
        <text
          x="100" y="280" textAnchor="middle"
          fontFamily="Georgia, serif" fontStyle="italic"
          fontWeight="700" fontSize="9"
          fill="rgba(28,18,9,0.55)"
          letterSpacing="0.18em"
        >
          OTIS · POST 9
        </text>
      </svg>
    </div>
  );
}
