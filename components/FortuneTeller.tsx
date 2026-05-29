"use client";

import { useState, useEffect } from "react";

// ── FortuneTeller ──────────────────────────────────────────────────────────
//
// Vintage 1950s arcade fortune-teller cabinet (SVG 420×580, viewBox 0 0 420 580).
// Features: deep-purple velvet cabinet with brass frame, 9 marquee lights with
// staggered SVG animate, "MADAME ROUTE 9" arch textPath, fortune-teller figure
// (head/veil/robes/arms over crystal ball), pulsing crystal ball with radial
// gradient, React-state cycling fortunes with CSS fade, coin slot, card slot.
//
// Placed between MotelSign and Contact as a memorable lead-in to the CTA.

const FORTUNES = [
  "A FAST WEBSITE LIES IN YOUR FUTURE",
  "YOUR CUSTOMERS SEARCH FOR YOU NOW",
  "48 HOURS TO YOUR DESTINY ONLINE",
  "THE SPIRITS SEE GREAT LOCAL TRAFFIC",
  "YOUR COMPETITORS REMAIN IN THE DARK",
] as const;

// Marquee light positions following the brass arch curve
const LIGHTS = [
  { x:  56, y:  97 },
  { x:  88, y:  74 },
  { x: 126, y:  57 },
  { x: 168, y:  48 },
  { x: 210, y:  44 },
  { x: 252, y:  48 },
  { x: 294, y:  57 },
  { x: 332, y:  74 },
  { x: 364, y:  97 },
];

// Star positions inside the glass (decorative background)
const STARS = [
  { x:  96, y: 140, size: 13 },
  { x: 312, y: 155, size: 10 },
  { x:  82, y: 238, size: 10 },
  { x: 326, y: 208, size: 13 },
  { x: 128, y: 360, size: 10 },
  { x: 298, y: 372, size: 13 },
];

export function FortuneTeller() {
  const [fortune, setFortune] = useState(0);
  const [fade, setFade]       = useState(true);

  useEffect(() => {
    const id = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setFortune(f => (f + 1) % FORTUNES.length);
        setFade(true);
      }, 320);
    }, 3800);
    return () => clearInterval(id);
  }, []);

  const f = FORTUNES[fortune] ?? FORTUNES[0];

  return (
    <section
      style={{ background: "#060208", padding: "84px 0 72px" }}
      aria-label="Madame Route 9 — fortune teller machine"
    >
      <div className="max-w-sm mx-auto px-4">
        {/* Pill label */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "1.75rem" }}>
          <span className="label-pill">Your Fortune Awaits</span>
        </div>

        <svg
          viewBox="0 0 420 580"
          preserveAspectRatio="xMidYMid meet"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ display: "block", width: "100%", height: "auto" }}
          role="img"
          aria-label={`Fortune teller machine — "${f}" — click Claim Your Fortune to reach out`}
        >
          <defs>
            {/* Deep velvet cabinet grain */}
            <pattern id="ft-velvet" x="0" y="0" width="8" height="8"
              patternUnits="userSpaceOnUse">
              <rect width="8" height="8" fill="#1A0626" />
              <rect x="0" y="0" width="1.2" height="8" fill="rgba(255,255,255,0.025)" />
              <rect x="4.5" y="0" width="0.6" height="8" fill="rgba(255,255,255,0.015)" />
            </pattern>

            {/* Crystal ball radial gradient */}
            <radialGradient id="ft-ball" cx="34%" cy="30%" r="66%">
              <stop offset="0%"   stopColor="#C880FF" stopOpacity="0.95" />
              <stop offset="38%"  stopColor="#7830C8" stopOpacity="0.85" />
              <stop offset="72%"  stopColor="#300870" stopOpacity="0.90" />
              <stop offset="100%" stopColor="#0E0220" stopOpacity="0.96" />
            </radialGradient>

            {/* Ball soft bloom */}
            <radialGradient id="ft-bloom" cx="50%" cy="50%" r="50%">
              <stop offset="0%"   stopColor="rgba(168,80,255,0.45)" />
              <stop offset="100%" stopColor="transparent" />
            </radialGradient>

            {/* Cabinet outer glow filter */}
            <filter id="ft-shadow" x="-10%" y="-5%" width="124%" height="118%">
              <feDropShadow dx="0" dy="14" stdDeviation="18"
                floodColor="rgba(60,0,100,0.60)" />
            </filter>

            {/* Crystal ball outer glow */}
            <filter id="ft-ball-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* Arch text path */}
            <path id="ft-arch" d="M 74,112 Q 210,32 346,112" />
          </defs>

          {/* ══ CABINET BODY ══ */}
          <path
            d="M 26,545 L 26,106 Q 26,26 210,26 Q 394,26 394,106 L 394,545 Z"
            fill="url(#ft-velvet)" filter="url(#ft-shadow)" />
          {/* Cabinet outer edge */}
          <path
            d="M 26,545 L 26,106 Q 26,26 210,26 Q 394,26 394,106 L 394,545 Z"
            fill="none" stroke="#3C1448" strokeWidth="2.5" />
          {/* Inner bevel sheen */}
          <path
            d="M 32,542 L 32,108 Q 32,32 210,32 Q 388,32 388,108 L 388,542 Z"
            fill="none" stroke="rgba(255,255,255,0.055)" strokeWidth="1.5" />

          {/* ══ BRASS FRAME ══ */}
          {/* Top arch */}
          <path d="M 44,103 Q 44,44 210,44 Q 376,44 376,103"
            stroke="#C8A038" strokeWidth="5" strokeLinecap="round" />
          {/* Side verticals */}
          <line x1="44"  y1="103" x2="44"  y2="542" stroke="#C8A038" strokeWidth="5" />
          <line x1="376" y1="103" x2="376" y2="542" stroke="#C8A038" strokeWidth="5" />
          {/* Bottom horizontal */}
          <line x1="44" y1="542" x2="376" y2="542" stroke="#C8A038" strokeWidth="5" />
          {/* Brass highlight stripe */}
          <path d="M 48,102 Q 48,50 210,50 Q 372,50 372,102"
            stroke="rgba(255,224,120,0.28)" strokeWidth="2" strokeLinecap="round" />

          {/* ══ MARQUEE LIGHTS ══ */}
          {LIGHTS.map(({ x, y }, i) => (
            <g key={i}>
              {/* Bulb socket */}
              <circle cx={x} cy={y} r="7" fill="#2A0C3A" stroke="#8A6818" strokeWidth="1" />
              {/* Bulb */}
              <circle cx={x} cy={y} r="5" fill="#FFD142" stroke="#AA8820" strokeWidth="0.8">
                <animate
                  attributeName="opacity"
                  values={i % 2 === 0 ? "0.22;1;0.22" : "1;0.22;1"}
                  dur="1.4s"
                  begin={`${(i * 0.155).toFixed(2)}s`}
                  repeatCount="indefinite"
                />
              </circle>
              {/* Bulb highlight */}
              <circle cx={x - 1.5} cy={y - 1.5} r="1.5" fill="rgba(255,255,255,0.55)" />
            </g>
          ))}

          {/* ══ ARCH TEXT ══ */}
          <text fill="#FFD142" fontSize="13.5" letterSpacing="2.5"
            fontFamily="'Palatino Linotype', Palatino, Georgia, serif"
            fontWeight="700">
            <textPath href="#ft-arch" startOffset="50%" textAnchor="middle">
              MADAME  ROUTE  9
            </textPath>
          </text>

          {/* ══ GLASS DISPLAY WINDOW ══ */}
          {/* Bezel */}
          <rect x="54" y="112" width="312" height="304" rx="8"
            fill="#0A0218" stroke="#C8A038" strokeWidth="3.5" />
          {/* Screen surface */}
          <rect x="59" y="117" width="302" height="294" rx="6" fill="#08011A" />
          {/* Screen edge glow */}
          <rect x="59" y="117" width="302" height="294" rx="6"
            fill="none" stroke="rgba(160,60,255,0.18)" strokeWidth="4" />

          {/* Decorative background stars */}
          {STARS.map(({ x, y, size }, i) => (
            <text key={i} x={x} y={y} textAnchor="middle"
              fill="rgba(160,80,255,0.20)" fontSize={size}
              fontFamily="'Palatino Linotype', Georgia, serif">
              {i % 2 === 0 ? "✦" : "✧"}
            </text>
          ))}

          {/* ══ FORTUNE TELLER FIGURE ══ */}
          {/* Robes/body */}
          <path
            d="M 182,192 Q 166,244 158,312 L 262,312 Q 254,244 238,192 Q 224,198 210,198 Q 196,198 182,192 Z"
            fill="#500EA0" />
          {/* Robe fabric highlight */}
          <path d="M 194,194 Q 186,244 182,304"
            stroke="rgba(180,100,255,0.22)" strokeWidth="2" fill="none" />
          <path d="M 226,194 Q 234,244 238,304"
            stroke="rgba(180,100,255,0.14)" strokeWidth="1.5" fill="none" />
          {/* Robe hem */}
          <path d="M 158,312 Q 180,320 210,318 Q 240,320 262,312"
            stroke="rgba(200,160,56,0.40)" strokeWidth="1" fill="none" />

          {/* Left arm reaching to ball */}
          <path d="M 176,244 Q 152,272 168,300 Q 182,318 198,308"
            stroke="#C8907A" strokeWidth="9" strokeLinecap="round" fill="none" />
          {/* Right arm */}
          <path d="M 244,244 Q 268,272 252,300 Q 238,318 222,308"
            stroke="#C8907A" strokeWidth="9" strokeLinecap="round" fill="none" />

          {/* Head */}
          <ellipse cx="210" cy="164" rx="28" ry="30"
            fill="#C8907A" stroke="rgba(255,200,160,0.25)" strokeWidth="1" />
          {/* Veil/turban */}
          <path
            d="M 182,152 Q 210,118 238,152 Q 232,164 210,162 Q 188,164 182,152 Z"
            fill="#6010A8" />
          <path d="M 178,157 Q 210,122 242,157"
            stroke="#C8A038" strokeWidth="1.8" fill="none" />
          {/* Turban gem */}
          <circle cx="210" cy="145" r="5" fill="#FFD142" />
          <circle cx="210" cy="145" r="3" fill="#FF8820" />
          <circle cx="208" cy="143" r="1.2" fill="rgba(255,255,255,0.60)" />

          {/* Eyes (glowing) */}
          <ellipse cx="199" cy="168" rx="5" ry="4" fill="#080012" />
          <ellipse cx="221" cy="168" rx="5" ry="4" fill="#080012" />
          <ellipse cx="199" cy="168" rx="2.5" ry="2.5" fill="#A040FF">
            <animate attributeName="opacity" values="0.8;1;0.8"
              dur="2.8s" repeatCount="indefinite" />
          </ellipse>
          <ellipse cx="221" cy="168" rx="2.5" ry="2.5" fill="#A040FF">
            <animate attributeName="opacity" values="1;0.8;1"
              dur="2.8s" repeatCount="indefinite" />
          </ellipse>

          {/* Sleeve cuffs */}
          <ellipse cx="168" cy="300" rx="12" ry="7" fill="#6010A8"
            transform="rotate(-30,168,300)" />
          <ellipse cx="252" cy="300" rx="12" ry="7" fill="#6010A8"
            transform="rotate(30,252,300)" />

          {/* ══ CRYSTAL BALL ══ */}
          {/* Pedestal base */}
          <ellipse cx="210" cy="366" rx="44" ry="11"
            fill="#2C0848" stroke="#C8A038" strokeWidth="1.5" />
          <rect x="198" y="354" width="24" height="18" rx="3" fill="#420C78" />

          {/* Outer bloom (glow halo) */}
          <circle cx="210" cy="322" r="88" fill="rgba(140,40,255,0.08)"
            filter="url(#ft-ball-glow)">
            <animate attributeName="opacity" values="0.5;0.9;0.5"
              dur="2.5s" repeatCount="indefinite" />
          </circle>

          {/* Ball surface */}
          <circle cx="210" cy="322" r="72" fill="url(#ft-ball)"
            stroke="rgba(160,80,255,0.45)" strokeWidth="2.5">
            <animate attributeName="r" values="72;74;72"
              dur="3.2s" repeatCount="indefinite" />
          </circle>

          {/* Ball inner bloom */}
          <circle cx="210" cy="322" r="60" fill="url(#ft-bloom)">
            <animate attributeName="opacity" values="0.45;1;0.45"
              dur="2.5s" repeatCount="indefinite" />
          </circle>

          {/* Specular highlights */}
          <ellipse cx="186" cy="298" rx="20" ry="13"
            fill="rgba(255,255,255,0.14)" transform="rotate(-22,186,298)" />
          <ellipse cx="180" cy="292" rx="9" ry="5.5"
            fill="rgba(255,255,255,0.22)" transform="rotate(-22,180,292)" />

          {/* ══ LOWER BODY PANEL ══ */}
          <rect x="54" y="428" width="312" height="102" rx="5"
            fill="#140422" stroke="rgba(200,160,56,0.35)" strokeWidth="1.5" />

          {/* "KNOWS ALL · SEES ALL" */}
          <text x="210" y="450" textAnchor="middle"
            fill="rgba(200,160,56,0.55)" fontSize="9" letterSpacing="4"
            fontFamily="'Palatino Linotype', Palatino, Georgia, serif">
            KNOWS ALL  ·  SEES ALL
          </text>

          {/* ── Fortune text (React-cycled, CSS fade) ── */}
          <text
            x="210" y="474" textAnchor="middle"
            fill="#DCA8FF" fontSize="10.5" letterSpacing="0.4"
            fontFamily="'Palatino Linotype', Palatino, Georgia, serif"
            fontWeight="700"
            style={{ opacity: fade ? 1 : 0, transition: "opacity 0.32s ease" }}
          >
            {f}
          </text>

          {/* Coin slot */}
          <rect x="160" y="492" width="100" height="13" rx="3"
            fill="#080012" stroke="#C8A038" strokeWidth="1.2" />
          <text x="210" y="502" textAnchor="middle"
            fill="rgba(200,160,56,0.52)" fontSize="7.5" letterSpacing="1.5"
            fontFamily="'Courier New', Courier, monospace">
            INSERT  25¢
          </text>

          {/* Fortune card slot */}
          <rect x="145" y="516" width="130" height="16" rx="2"
            fill="#080012" stroke="#C8A038" strokeWidth="1.2" />
          <text x="210" y="527.5" textAnchor="middle"
            fill="rgba(200,160,56,0.42)" fontSize="7" letterSpacing="1.5"
            fontFamily="'Courier New', Courier, monospace">
            YOUR  FORTUNE
          </text>

          {/* ══ BASE / FEET ══ */}
          <rect x="38" y="544" width="344" height="14" rx="5" fill="#2A0640" />
          <rect x="54" y="554" width="66" height="22" rx="4" fill="#180328" />
          <rect x="300" y="554" width="66" height="22" rx="4" fill="#180328" />
          {/* Foot highlight */}
          <line x1="58" y1="557" x2="116" y2="557"
            stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
          <line x1="304" y1="557" x2="362" y2="557"
            stroke="rgba(255,255,255,0.06)" strokeWidth="1" />

        </svg>

        {/* CTA button */}
        <div style={{ display: "flex", justifyContent: "center", marginTop: "2rem" }}>
          <a
            href="#contact"
            style={{
              display: "inline-block",
              padding: "0.75rem 2.5rem",
              border: "2px solid rgba(160,80,255,0.55)",
              color: "#C080FF",
              fontFamily: "'Palatino Linotype', Palatino, Georgia, serif",
              fontSize: "0.9375rem",
              letterSpacing: "0.08em",
              textDecoration: "none",
              fontStyle: "italic",
              transition: "border-color 0.25s, background 0.25s, color 0.25s",
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLAnchorElement).style.background = "rgba(160,80,255,0.10)";
              (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(160,80,255,0.9)";
              (e.currentTarget as HTMLAnchorElement).style.color = "#E0B0FF";
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLAnchorElement).style.background = "transparent";
              (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(160,80,255,0.55)";
              (e.currentTarget as HTMLAnchorElement).style.color = "#C080FF";
            }}
          >
            Claim Your Fortune →
          </a>
        </div>
      </div>
    </section>
  );
}
