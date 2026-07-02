"use client";

// FooterStreetscape ──────────────────────────────────────────────────────────
//
// Full-width golden-hour Route 9 streetscape (SVG viewBox 1440×320).
// Purely decorative — aria-hidden. Placed between Contact and Footer
// as a cinematic send-off scene: eleven New England storefronts at dusk,
// street lamps glowing warm, the Route 9 shield on its post.
//
// Layers (back to front):
//   1. Deep dusk sky gradient + sun-glow radial
//   2. Faint stars in the darkening sky
//   3. Distant hill silhouette
//   4. Eleven building facades with brick/wood/glass detail
//   5. Street trees (dark silhouettes between buildings)
//   6. Sidewalk + Route 9 asphalt road with center-line dashes
//   7. Seven street lamps with static warm glow halos
//   8. US Route 9 shield sign on post
//   9. Warm window lights (a third of them twinkle via SVG animate opacity)
//
// All positions are deterministic (no Math.random).
// No new CSS classes — all animation via SVG-native <animate>.
//
// PERF: SMIL <animate> loops tick forever — even when the scene is scrolled
// far off screen, and they ignore prefers-reduced-motion. So the <animate>
// nodes are only mounted while the SVG is intersecting the viewport (and
// motion is allowed), and the number of concurrently animating elements is
// cut down: ~1/3 of the windows twinkle, ~1/2 of the stars, and the seven
// lamp glows are fully static.

import { useSyncExternalStore } from "react";
import { useVisible } from "@/hooks/useVisible";

// prefers-reduced-motion as an external-store subscription (SSR-safe:
// server snapshot reports motion NOT ok, so no <animate> nodes are
// serialized; the client corrects after hydration if motion is allowed).
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";
function subscribeMotion(onChange: () => void) {
  const mq = window.matchMedia(REDUCED_MOTION_QUERY);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}
const getMotionOK = () => !window.matchMedia(REDUCED_MOTION_QUERY).matches;
const getMotionOKServer = () => false;

const LAMP_X: number[] = [110, 310, 510, 715, 910, 1110, 1330];

// [x, y, w, h, animDur]
const WINDOWS: [number, number, number, number, string][] = [
  // Apartment block
  [14,  76, 22, 16, "4.2s"], [44,  76, 22, 16, "5.1s"], [78,  76, 22, 16, "3.8s"],
  [14, 106, 22, 16, "6.0s"], [44, 106, 22, 16, "4.5s"], [78, 106, 22, 16, "5.3s"],
  [14, 136, 22, 16, "3.9s"], [44, 136, 22, 16, "4.8s"],
  // Corner shop
  [152, 124, 26, 20, "4.7s"], [186, 124, 26, 20, "5.5s"],
  // Pizza
  [270, 108, 30, 24, "5.5s"], [310, 108, 30, 24, "4.3s"],
  // Hardware
  [396, 128, 26, 20, "3.7s"], [430, 128, 26, 20, "5.8s"],
  // Barber
  [682, 130, 20, 18, "3.5s"],
  // Church arch glow
  [790, 146, 32, 34, "6.1s"],
  // Boutique display
  [882, 128, 92, 68, "5.0s"],
  // Old Inn
  [1008, 106, 24, 18, "4.6s"], [1040, 106, 24, 18, "5.4s"],
  [1008, 136, 24, 18, "3.6s"], [1040, 136, 24, 18, "4.9s"],
  // Corner right
  [1152, 126, 28, 20, "5.7s"], [1188, 126, 28, 20, "4.1s"],
  // Right building
  [1316, 144, 24, 18, "5.3s"], [1356, 144, 24, 18, "4.0s"], [1396, 144, 24, 18, "6.2s"],
];

const ROAD_DASHES: number[] = Array.from({ length: 18 }, (_, i) => i * 85);

const STARS: [number, number][] = [
  [120, 28], [285, 52], [440, 20], [602, 44], [755, 15],
  [920, 36], [1102, 22], [1265, 48], [1382, 32], [1420, 12],
  [58, 46], [352, 28], [818, 50], [1052, 38], [1322, 20],
];

export function FooterStreetscape() {
  const { ref, visible } = useVisible(0.05);
  const motionOK = useSyncExternalStore(subscribeMotion, getMotionOK, getMotionOKServer);

  const animate = visible && motionOK;

  return (
    <div aria-hidden="true" style={{ lineHeight: 0, overflow: "hidden" }}>
      <svg
        ref={ref}
        viewBox="0 0 1440 320"
        preserveAspectRatio="xMidYMax slice"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ display: "block", width: "100%", height: "auto" }}
      >
        <defs>
          <linearGradient id="fs-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#060218" />
            <stop offset="32%"  stopColor="#160840" />
            <stop offset="60%"  stopColor="#6a2600" />
            <stop offset="80%"  stopColor="#c05800" />
            <stop offset="100%" stopColor="#e8820c" />
          </linearGradient>

          <radialGradient id="fs-sun" cx="50%" cy="110%" r="52%">
            <stop offset="0%"   stopColor="rgba(255,178,55,0.64)" />
            <stop offset="38%"  stopColor="rgba(215,95,15,0.30)" />
            <stop offset="100%" stopColor="rgba(180,55,0,0)" />
          </radialGradient>

          <radialGradient id="fs-lamp-halo" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="rgba(255,214,96,0.9)" />
            <stop offset="100%" stopColor="rgba(255,162,38,0)" />
          </radialGradient>

          <linearGradient id="fs-vignette" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="rgba(0,0,0,0)" />
            <stop offset="100%" stopColor="rgba(0,0,14,0.75)" />
          </linearGradient>

          <filter id="fs-glow" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="4" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <filter id="fs-wglow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="1.8" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <pattern id="fs-brick" x="0" y="0" width="24" height="12" patternUnits="userSpaceOnUse">
            <rect x="0"  y="0" width="11" height="5" fill="rgba(0,0,0,0.12)" rx="0.5" />
            <rect x="13" y="0" width="11" height="5" fill="rgba(0,0,0,0.08)" rx="0.5" />
            <rect x="6"  y="7" width="11" height="5" fill="rgba(0,0,0,0.10)" rx="0.5" />
          </pattern>
        </defs>

        {/* ── SKY ── */}
        <rect x="0" y="0" width="1440" height="320" fill="url(#fs-sky)" />
        <rect x="0" y="0" width="1440" height="320" fill="url(#fs-sun)" />

        {/* ── DUSK STARS — every other one twinkles, only while visible ── */}
        {STARS.map(([sx, sy], i) => {
          const op = 0.34 + (i % 5) * 0.10;
          return (
            <circle key={i} cx={sx} cy={sy}
              r={i % 3 === 0 ? 1.2 : 0.85}
              fill={`rgba(220,232,255,${op.toFixed(2)})`}>
              {animate && i % 2 === 0 && (
                <animate attributeName="opacity"
                  values={`${op.toFixed(2)};${Math.min(0.88, op + 0.30).toFixed(2)};${op.toFixed(2)}`}
                  dur={`${3.2 + (i % 7) * 0.44}s`}
                  begin={`${((i * 0.43) % 2.8).toFixed(1)}s`}
                  repeatCount="indefinite" />
              )}
            </circle>
          );
        })}

        {/* ── DISTANT HILLS ── */}
        <path
          d="M 0,216 Q 150,190 300,204 Q 460,220 612,188 Q 762,156 912,176 Q 1062,196 1202,164 Q 1342,134 1440,170 L 1440,244 L 0,244 Z"
          fill="#08031e" opacity="0.88" />

        {/* ════════════════ BUILDINGS ════════════════ */}

        {/* Apartment block */}
        <rect x="0"   y="38"  width="144" height="202" fill="#0e0620" />
        <rect x="0"   y="38"  width="144" height="202" fill="url(#fs-brick)" opacity="0.45" />
        <rect x="0"   y="35"  width="146" height="7"   fill="#180a4c" />
        {/* water tower */}
        <polygon points="60,26 78,26 82,38 56,38" fill="#0a0418" />
        <rect x="66" y="13" width="5" height="15" fill="#08031a" />
        <ellipse cx="68" cy="15" rx="10" ry="5.5" fill="#0b0520" />
        <rect x="61" y="36" width="20" height="4" fill="#090318" />

        {/* Corner shop */}
        <rect x="144" y="96"  width="96" height="144" fill="#0c051c" />
        <path d="M 140,96 L 242,96 L 236,118 L 146,118 Z" fill="#8a1818" />
        {[0,1,2,3,4].map(n => (
          <line key={n} x1={148 + n * 19} y1="96" x2={145 + n * 19} y2="118"
            stroke="rgba(255,255,255,0.11)" strokeWidth="8" />
        ))}
        <line x1="144" y1="118" x2="242" y2="118" stroke="#660c0c" strokeWidth="2" />
        <rect x="150" y="98" width="86" height="16" rx="2" fill="#140830" />
        <text x="193" y="110" textAnchor="middle" fill="#e8c060"
          fontSize="7.5" fontFamily="Georgia, serif">CORNER SHOP</text>

        {/* Pizza place */}
        <rect x="258" y="76"  width="128" height="164" fill="#120828" />
        <rect x="258" y="76"  width="128" height="164" fill="url(#fs-brick)" opacity="0.5" />
        <path d="M 252,102 L 390,102 L 384,128 L 258,128 Z" fill="#ab1818" />
        {[0,1,2,3,4,5,6].map(n => (
          <line key={n} x1={260 + n * 20} y1="102" x2={257 + n * 20} y2="128"
            stroke="rgba(255,255,255,0.11)" strokeWidth="8" />
        ))}
        <line x1="258" y1="128" x2="390" y2="128" stroke="#7a0808" strokeWidth="2" />
        <rect x="263" y="78" width="118" height="20" rx="2" fill="#1c0808" />
        <text x="322" y="92" textAnchor="middle" fill="#ff6b35"
          fontSize="11" fontFamily="Georgia, serif" letterSpacing="1">TONY&apos;S PIZZA</text>

        {/* Hardware store */}
        <rect x="390" y="114" width="106" height="126" fill="#0a1a0a" />
        {[0,1,2,3,4,5,6,7,8].map(n => (
          <line key={n} x1="390" y1={126 + n * 12} x2="496" y2={126 + n * 12}
            stroke="rgba(255,255,255,0.032)" strokeWidth="1.5" />
        ))}
        <rect x="390" y="114" width="106" height="26" fill="#183818" />
        <text x="443" y="131" textAnchor="middle" fill="#8ed040"
          fontSize="10" fontFamily="Georgia, serif" letterSpacing="1.5">HARDWARE</text>

        {/* Diner */}
        <rect x="520" y="124" width="148" height="116" fill="#081220" />
        <rect x="516" y="122" width="156" height="5"   fill="#284862" />
        <rect x="516" y="236" width="156" height="5"   fill="#284862" />
        <rect x="544" y="128" width="100" height="20" rx="3" fill="#030610" />
        <text x="594" y="142" textAnchor="middle"
          fill="rgba(72,200,255,0.8)" fontSize="11" fontFamily="monospace" letterSpacing="2.5">DINER</text>

        {/* Barber shop */}
        <rect x="672" y="104" width="78" height="136" fill="#150826" />
        {/* Barber pole */}
        <rect x="668" y="93"  width="8"  height="147" rx="4" fill="#dcdce4" />
        {[0,1,2,3,4,5,6].map(n => (
          <rect key={n} x="668" y={93 + n * 20} width="8" height="10"
            fill={n % 2 === 0 ? "#c01010" : "#1038b8"} />
        ))}
        <ellipse cx="672" cy="92" rx="6.5" ry="3.5" fill="#c0c0c8" />
        <rect x="678" y="106" width="68" height="20" rx="2" fill="#0d0420" />
        <text x="712" y="120" textAnchor="middle" fill="#d4a0ff"
          fontSize="8.5" fontFamily="Georgia, serif">BARBER SHOP</text>

        {/* Church / Town Hall with steeple */}
        <rect x="754" y="76"  width="116" height="164" fill="#090720" />
        <polygon points="812,16 842,76 782,76" fill="#0b091e" />
        <rect x="809"  y="26"  width="6"  height="24" fill="#1e1a40" />
        <rect x="804"  y="36"  width="16" height="5"  fill="#1e1a40" />
        <circle cx="812" cy="84" r="14" fill="#0a081e" />
        <circle cx="812" cy="84" r="10" fill="rgba(200,175,255,0.10)" />
        <path d="M 782,108 A 24,24 0 0,1 826,108 L 826,154 L 782,154 Z" fill="#0c0a22" />
        <path d="M 785,108 A 20,20 0 0,1 823,108 L 823,152 L 785,152 Z" fill="rgba(255,196,80,0.10)" />
        <rect x="762" y="168" width="14" height="72" fill="#09071e" />
        <rect x="836" y="168" width="14" height="72" fill="#09071e" />
        <rect x="756" y="235" width="106" height="6" fill="#0e0c28" />
        <rect x="760" y="229" width="98"  height="6" fill="#0c0a24" />

        {/* Boutique */}
        <rect x="876" y="114" width="120" height="126" fill="#1a0828" />
        <rect x="882" y="128" width="104" height="76" rx="2" fill="#050312" stroke="#27134a" strokeWidth="1" />
        <rect x="884" y="130" width="100" height="72" rx="1" fill="rgba(255,188,68,0.07)" />
        <line x1="934" y1="130" x2="934" y2="202" stroke="#27134a" strokeWidth="1.5" />
        <rect x="882" y="114" width="114" height="20" rx="1" fill="#0a0420" />
        <text x="939" y="128" textAnchor="middle" fill="#d4a070"
          fontSize="9.5" fontFamily="Georgia, serif" letterSpacing="2.5">BOUTIQUE</text>

        {/* Old Inn */}
        <rect x="1000" y="84"  width="140" height="156" fill="#0f0720" />
        <rect x="1000" y="84"  width="140" height="156" fill="url(#fs-brick)" opacity="0.42" />
        <polygon points="993,86 1070,54 1144,86" fill="#09051e" />
        <polygon points="1046,68 1070,54 1094,68" fill="#070418" />
        <rect x="1008" y="88"  width="128" height="20" rx="2" fill="#07041c" />
        <text x="1072" y="102" textAnchor="middle" fill="#c8a040"
          fontSize="10" fontFamily="Georgia, serif" letterSpacing="1">ROUTE 9 INN</text>
        <rect x="1048" y="186" width="32"  height="54" rx="3" fill="#07031a" />
        <path d="M 1048,186 A 16,16 0 0,1 1080,186" fill="#09051e" />

        {/* Corner building right */}
        <rect x="1144" y="104" width="128" height="136" fill="#0d061c" />
        <rect x="1141" y="102" width="132" height="8"   fill="#160940" />
        {/* Fire escape */}
        <g stroke="#17092e" strokeWidth="1.5" fill="none">
          <rect x="1152" y="120" width="26" height="22" />
          <rect x="1152" y="156" width="26" height="22" />
          <line x1="1152" y1="142" x2="1178" y2="142" />
          <line x1="1152" y1="178" x2="1178" y2="178" />
          <line x1="1156" y1="142" x2="1152" y2="156" />
        </g>

        {/* Right glass building */}
        <rect x="1302" y="124" width="138" height="116" fill="#100828" />
        {[0,1,2].map(n => (
          <rect key={n} x={1310 + n * 40} y="134" width="28" height="58" rx="1"
            fill="rgba(90,130,230,0.06)" stroke="rgba(140,175,255,0.13)" strokeWidth="0.5" />
        ))}

        {/* ════════════════ TREES ════════════════ */}
        <ellipse cx="246" cy="184" rx="22" ry="42" fill="#030316" opacity="0.92" />
        <rect x="243" y="226" width="6" height="14" fill="#030215" />

        <ellipse cx="505" cy="177" rx="24" ry="46" fill="#030316" opacity="0.92" />
        <rect x="502" y="223" width="6" height="17" fill="#030215" />

        <ellipse cx="750" cy="192" rx="16" ry="36" fill="#030316" opacity="0.88" />
        <rect x="747" y="228" width="5" height="12" fill="#030215" />

        <ellipse cx="985" cy="181" rx="22" ry="44" fill="#030318" opacity="0.92" />
        <rect x="982" y="225" width="6" height="15" fill="#030216" />

        <ellipse cx="1298" cy="186" rx="18" ry="38" fill="#030318" opacity="0.92" />
        <rect x="1295" y="224" width="6" height="16" fill="#030216" />

        {/* ════════════════ SIDEWALK ════════════════ */}
        <rect x="0" y="240" width="1440" height="30" fill="#0b0824" />
        {[160,320,480,640,800,960,1120,1280].map(cx => (
          <line key={cx} x1={cx} y1="240" x2={cx} y2="270"
            stroke="rgba(0,0,0,0.20)" strokeWidth="1" />
        ))}
        <rect x="0" y="268" width="1440" height="4" fill="#07051c" />

        {/* ════════════════ ROAD ════════════════ */}
        <rect x="0" y="272" width="1440" height="48" fill="#040310" />
        {ROAD_DASHES.map((dx, i) => (
          <rect key={i} x={dx} y="292" width="52" height="3" rx="1"
            fill="rgba(255,215,48,0.20)" />
        ))}
        <line x1="0" y1="274" x2="1440" y2="274"
          stroke="rgba(255,255,255,0.055)" strokeWidth="1.5" />
        <rect x="0" y="256" width="1440" height="64" fill="url(#fs-vignette)" />
        <rect x="0" y="316" width="1440" height="4" fill="#030210" />

        {/* ════════════════ STREET LAMPS — static warm glow ════════════════
            (was: 14 indefinite SMIL opacity loops; the flicker also re-ran the
            fs-glow blur filter every frame) */}
        {LAMP_X.map((lx, i) => (
          <g key={i}>
            <line x1={lx} y1="242" x2={lx} y2="158" stroke="#13103a" strokeWidth="3.5" />
            <path d={`M ${lx},160 Q ${lx + 20},152 ${lx + 20},144`}
              stroke="#13103a" strokeWidth="2.5" fill="none" />
            {/* Cap */}
            <rect x={lx + 10} y="138" width="20" height="8" rx="3" fill="#1c1644" />
            {/* Halo */}
            <circle cx={lx + 20} cy="142" r="36" fill="url(#fs-lamp-halo)" opacity="0.36" />
            {/* Bulb */}
            <circle cx={lx + 20} cy="142" r="5.5"
              fill="rgba(255,219,98,0.96)" filter="url(#fs-glow)" opacity="0.93" />
          </g>
        ))}

        {/* ════════════════ ROUTE 9 SHIELD ════════════════ */}
        <g transform="translate(693,170)">
          <line x1="16" y1="76" x2="16" y2="2" stroke="rgba(20,16,58,0.9)" strokeWidth="3.5" />
          <path d="M 1,0 L 31,0 L 31,44 Q 31,65 16,76 Q 1,65 1,44 Z"
            fill="#07041c" stroke="#201840" strokeWidth="1.5" />
          <path d="M 4,3 L 28,3 L 28,44 Q 28,63 16,72 Q 4,63 4,44 Z"
            fill="#150e3c" />
          <rect x="1" y="0" width="30" height="14" rx="2" fill="#07041c" />
          <text x="16" y="11.5" textAnchor="middle" fill="rgba(255,255,255,0.88)"
            fontSize="7.5" fontFamily="sans-serif" fontWeight="bold">US</text>
          <text x="16" y="48" textAnchor="middle" fill="rgba(255,255,255,0.93)"
            fontSize="26" fontFamily="Georgia, serif" fontWeight="bold">9</text>
        </g>

        {/* ════════════════ WINDOW LIGHTS ════════════════
            Every window stays lit; only a third of them twinkle, and only
            while the scene is on screen (was: 26 indefinite SMIL loops, each
            re-running the fs-wglow blur filter every frame). */}
        {WINDOWS.map(([wx, wy, ww, wh, wdur], i) => (
          <rect key={i} x={wx} y={wy} width={ww} height={wh} rx="1"
            fill="rgba(255,208,76,0.50)" filter="url(#fs-wglow)"
            opacity="0.52">
            {animate && i % 3 === 0 && (
              <animate attributeName="opacity"
                values="0.40;0.63;0.40"
                dur={wdur}
                begin={`${((i * 0.38) % 3.1).toFixed(1)}s`}
                repeatCount="indefinite" />
            )}
          </rect>
        ))}
      </svg>
    </div>
  );
}
