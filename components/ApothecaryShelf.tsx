// ApothecaryShelf ─────────────────────────────────────────────────────────────
//
// Pure SVG server component — 6 vintage apothecary jars on a dark walnut shelf,
// one per Route 9 Web Co. quality pillar. Animated bubbles rise through colored
// liquid via SVG <animate>. A secondary upper shelf with small vials adds depth.
// Placed between QualityPillars and PinballMachine.

const SY = 378; // main shelf surface y
const NH = 20;  // neck height
const CH = 14;  // cork height

const JARS: {
  cx: number; w: number; bh: number;
  label: string; sub: string;
  color: string; accent: string; fill: number;
}[] = [
  { cx: 205,  w: 52, bh: 168, label: "FAST",         sub: "Speed & Performance", color: "#b84e0e", accent: "#f07830", fill: 0.70 },
  { cx: 412,  w: 74, bh: 148, label: "CRAFTED",      sub: "Hand-Built Design",   color: "#286018", accent: "#4ea020", fill: 0.65 },
  { cx: 616,  w: 62, bh: 184, label: "RELIABLE",     sub: "Always Online",       color: "#183868", accent: "#2868bc", fill: 0.76 },
  { cx: 818,  w: 84, bh: 202, label: "SUPPORTED",    sub: "Ongoing Care",        color: "#48186a", accent: "#8838bc", fill: 0.82 },
  { cx: 1014, w: 64, bh: 158, label: "LOCAL ROOTS",  sub: "Your Neighbor",       color: "#683010", accent: "#b05820", fill: 0.65 },
  { cx: 1215, w: 52, bh: 174, label: "MOBILE-FIRST", sub: "Any Device",          color: "#0e6858", accent: "#1eb898", fill: 0.73 },
];

// Upper shelf small vials (decorative background layer)
const VIALS: [number, number, string][] = [
  [150, 55, "#6a2010"], [290, 62, "#1a4a28"], [440, 48, "#1a2a58"],
  [620, 58, "#4a1058"], [780, 52, "#0a4838"], [940, 60, "#583010"],
  [1100, 50, "#2a1858"], [1260, 56, "#186040"],
];

export function ApothecaryShelf() {
  return (
    <div aria-hidden style={{ lineHeight: 0 }}>
      <svg
        viewBox="0 0 1440 468"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ display: "block", width: "100%", height: "auto" }}
        role="img"
        aria-label="Vintage apothecary shelf with six quality jars representing Route 9 Web Co. pillars"
      >
        <defs>
          <linearGradient id="as-wall" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#070402" />
            <stop offset="100%" stopColor="#0f0805" />
          </linearGradient>
          <linearGradient id="as-shelf" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#4a2c10" />
            <stop offset="60%"  stopColor="#3a2008" />
            <stop offset="100%" stopColor="#261408" />
          </linearGradient>
          <linearGradient id="as-shelf-top" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#5a3818" />
            <stop offset="100%" stopColor="#3e2410" />
          </linearGradient>
          <radialGradient id="as-glow" cx="50%" cy="75%" r="55%">
            <stop offset="0%"   stopColor="rgba(200,90,20,0.07)" />
            <stop offset="100%" stopColor="rgba(200,90,20,0)" />
          </radialGradient>
          <radialGradient id="as-candle" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="rgba(255,200,80,0.55)" />
            <stop offset="100%" stopColor="rgba(255,160,40,0)" />
          </radialGradient>
        </defs>

        {/* ── WALL ── */}
        <rect width="1440" height="468" fill="url(#as-wall)" />
        <rect width="1440" height="468" fill="url(#as-glow)" />

        {/* Wood panel lines */}
        {[160, 360, 560, 760, 960, 1160, 1360].map(x => (
          <line key={x} x1={x} y1="0" x2={x} y2="468"
            stroke="rgba(0,0,0,0.25)" strokeWidth="1.2" />
        ))}

        {/* ── WALL SIGN ── */}
        <rect x="540" y="28" width="360" height="40" rx="4"
          fill="rgba(255,255,255,0.025)" stroke="rgba(212,104,42,0.18)" strokeWidth="0.8" />
        <text x="720" y="44" textAnchor="middle"
          fill="rgba(212,104,42,0.48)" fontSize="8.5"
          fontFamily="monospace" letterSpacing="0.34em" fontWeight="bold">
          ROUTE 9 QUALITY STANDARDS
        </text>
        <text x="720" y="58" textAnchor="middle"
          fill="rgba(212,104,42,0.28)" fontSize="7"
          fontFamily="monospace" letterSpacing="0.22em">
          SHREWSBURY APPROVED · EST. MMXXIV
        </text>

        {/* ── UPPER SHELF ── */}
        <rect x="0" y="187" width="1440" height="12" fill="url(#as-shelf)" />
        <rect x="0" y="187" width="1440" height="4"  fill="url(#as-shelf-top)" />
        {/* Shadow above upper shelf */}
        <rect x="0" y="199" width="1440" height="8"
          fill="rgba(0,0,0,0.35)" />

        {/* Small background vials on upper shelf */}
        {VIALS.map(([vx, vh, vc], i) => (
          <g key={i}>
            {/* Vial body */}
            <rect x={vx - 9} y={187 - vh} width="18" height={vh}
              rx="3" fill="rgba(14,10,6,0.72)" />
            {/* Liquid */}
            <rect x={vx - 8} y={187 - Math.round(vh * 0.65)} width="16"
              height={Math.round(vh * 0.65) - 1} fill={vc} opacity="0.7" />
            {/* Glass outline */}
            <rect x={vx - 9} y={187 - vh} width="18" height={vh}
              rx="3" fill="none" stroke="rgba(200,180,150,0.22)" strokeWidth="1" />
            {/* Cork */}
            <rect x={vx - 6} y={184 - vh} width="12" height="8"
              rx="2" fill="#6a4010" />
            {/* Single rising bubble */}
            <circle cx={vx} cy={187 - 10} r="1.5" fill="rgba(255,255,255,0.18)">
              <animate attributeName="cy"
                values={`${187 - 10};${187 - Math.round(vh * 0.62)}`}
                dur={`${2.4 + (i % 3) * 0.6}s`}
                begin={`${(i * 0.55) % 2.4}s`}
                repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.18;0"
                dur={`${2.4 + (i % 3) * 0.6}s`}
                begin={`${(i * 0.55) % 2.4}s`}
                repeatCount="indefinite" />
            </circle>
          </g>
        ))}

        {/* ── MAIN SHELF ── */}
        <rect x="0" y={SY} width="1440" height="20" fill="url(#as-shelf)" />
        <rect x="0" y={SY} width="1440" height="5"  fill="url(#as-shelf-top)" />
        {/* Drop shadow from shelf */}
        <rect x="0" y={SY + 20} width="1440" height="12" fill="rgba(0,0,0,0.4)" />

        {/* ── CANDLE (between jars 4 and 5) ── */}
        <rect x="912" y={SY - 48} width="16" height="48" rx="2" fill="#e8d8b0" />
        <rect x="914" y={SY - 48} width="4" height="48" fill="rgba(0,0,0,0.06)" />
        {/* Wick */}
        <line x1="920" y1={SY - 48} x2="920" y2={SY - 55}
          stroke="#3a2010" strokeWidth="1.5" strokeLinecap="round" />
        {/* Flame */}
        <ellipse cx="920" cy={SY - 60} rx="4" ry="7" fill="rgba(255,200,60,0.9)">
          <animate attributeName="ry" values="7;8;6;7" dur="0.8s" repeatCount="indefinite" />
          <animate attributeName="cy" values={`${SY - 60};${SY - 62};${SY - 59};${SY - 60}`}
            dur="0.8s" repeatCount="indefinite" />
        </ellipse>
        <ellipse cx="920" cy={SY - 62} rx="2" ry="4" fill="rgba(255,240,180,0.95)">
          <animate attributeName="ry" values="4;5;3;4" dur="0.8s" repeatCount="indefinite" />
        </ellipse>
        {/* Candle glow */}
        <circle cx="920" cy={SY - 58} r="38" fill="url(#as-candle)" />

        {/* ── MAIN JARS ── */}
        {JARS.map((jar, i) => {
          const bx      = jar.cx - jar.w / 2;
          const bodyTop = SY - jar.bh;
          const neckW   = jar.w - 14;
          const neckX   = jar.cx - neckW / 2;
          const neckTop = bodyTop - NH;
          const corkW   = jar.w - 20;
          const corkX   = jar.cx - corkW / 2;
          const corkTop = neckTop - CH;
          const liqH    = Math.round(jar.fill * jar.bh);
          const liqTop  = SY - liqH;
          const lblW    = jar.w - 10;
          const lblH    = 36;
          const lblY    = liqTop + Math.round((liqH - lblH) * 0.42);

          return (
            <g key={i}>
              {/* Jar shadow on shelf */}
              <ellipse cx={jar.cx} cy={SY + 2} rx={jar.w / 2 - 2} ry="5"
                fill="rgba(0,0,0,0.45)" />

              {/* Body background (dark glass) */}
              <rect x={bx} y={bodyTop} width={jar.w} height={jar.bh}
                rx="5" fill="rgba(10,7,4,0.80)" />

              {/* Liquid fill */}
              <rect x={bx + 1} y={liqTop} width={jar.w - 2} height={liqH - 2}
                rx="1" fill={jar.color} opacity="0.84" />

              {/* Liquid surface meniscus */}
              <ellipse cx={jar.cx} cy={liqTop + 2.5} rx={(jar.w - 6) / 2} ry="3.5"
                fill={jar.accent} opacity="0.28" />

              {/* Animated bubbles (3 per jar) */}
              {[0, 1, 2].map(b => {
                const bcx   = bx + 9 + b * Math.round((jar.w - 18) / 2);
                const bsy   = SY - 14 - b * 16;
                const bey   = liqTop + 18 + b * 9;
                const bdur  = 2.3 + b * 0.65;
                const bdel  = (b * 1.05 + i * 0.28) % 2.8;
                const br    = 1.5 + b * 0.55;
                return (
                  <circle key={b} cx={bcx} cy={bsy} r={br}
                    fill="rgba(255,255,255,0.20)">
                    <animate attributeName="cy"
                      values={`${bsy};${bey}`}
                      dur={`${bdur}s`} begin={`${bdel}s`}
                      repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.20;0"
                      dur={`${bdur}s`} begin={`${bdel}s`}
                      repeatCount="indefinite" />
                  </circle>
                );
              })}

              {/* Glass body outline */}
              <rect x={bx} y={bodyTop} width={jar.w} height={jar.bh}
                rx="5" fill="none"
                stroke="rgba(215,200,172,0.32)" strokeWidth="1.4" />

              {/* Left-edge glass sheen */}
              <line x1={bx + 4} y1={bodyTop + 8} x2={bx + 4} y2={SY - 10}
                stroke="rgba(255,255,255,0.10)" strokeWidth="2" />

              {/* Neck */}
              <rect x={neckX} y={neckTop} width={neckW} height={NH}
                rx="3" fill="rgba(10,7,4,0.72)"
                stroke="rgba(215,200,172,0.26)" strokeWidth="1.2" />

              {/* Cork */}
              <rect x={corkX} y={corkTop} width={corkW} height={CH}
                rx="2.5" fill="#7a521e" />
              <line x1={corkX + 1} y1={corkTop + 5} x2={corkX + corkW - 1} y2={corkTop + 5}
                stroke="rgba(0,0,0,0.20)" strokeWidth="0.8" />
              <line x1={corkX + 1} y1={corkTop + 9} x2={corkX + corkW - 1} y2={corkTop + 9}
                stroke="rgba(0,0,0,0.16)" strokeWidth="0.8" />
              {/* Cork cap knob */}
              <rect x={corkX + 4} y={corkTop - 5} width={corkW - 8} height="7"
                rx="2" fill="#8a6028" />

              {/* Wax seal drip */}
              <path
                d={`M ${neckX + 4},${neckTop + NH} Q ${neckX},${neckTop + NH + 6} ${neckX + 3},${neckTop + NH + 12}`}
                stroke={jar.accent} strokeWidth="3" strokeLinecap="round"
                fill="none" opacity="0.48" />

              {/* Label paper */}
              <rect x={jar.cx - lblW / 2} y={lblY} width={lblW} height={lblH}
                rx="2.5" fill="rgba(248,240,220,0.90)" />
              {/* Label inner border */}
              <rect x={jar.cx - lblW / 2 + 2.5} y={lblY + 2.5}
                width={lblW - 5} height={lblH - 5}
                rx="1.5" fill="none"
                stroke="rgba(80,48,16,0.20)" strokeWidth="0.6" />
              {/* Label text */}
              <text x={jar.cx} y={lblY + 15} textAnchor="middle"
                fill="#2a1608" fontSize="7.5" fontFamily="monospace"
                fontWeight="bold" letterSpacing="0.6">
                {jar.label}
              </text>
              <text x={jar.cx} y={lblY + 27} textAnchor="middle"
                fill="rgba(60,34,10,0.65)" fontSize="5.5"
                fontFamily="Georgia, serif" fontStyle="italic">
                {jar.sub}
              </text>
            </g>
          );
        })}

        {/* ── SHELF FRONT EDGE BEVEL ── */}
        <rect x="0" y={SY + 4} width="1440" height="3"
          fill="rgba(255,255,255,0.04)" />

        {/* ── BOTTOM CAPTION ── */}
        <text x="720" y="455" textAnchor="middle"
          fill="rgba(243,233,213,0.15)" fontSize="9.5"
          fontFamily="monospace" letterSpacing="0.14em">
          Every batch hand-crafted. Every shelf stocked fresh.
        </text>
      </svg>
    </div>
  );
}
