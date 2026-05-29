// RoadAtlas ──────────────────────────────────────────────────────────────────
//
// Vintage Route 9 road atlas spread — hand-illustrated cartography of the
// Route 9 corridor, Worcester → Natick, MA. Parchment paper, period typography,
// decorative border, Lake Quinsigamond, Route 9 shields, client pin markers,
// illustrated tree clusters, and a cartouche.
// Pure SVG server component. Placed between ShrewsburyGazette and Process.

// ── Geographic data ───────────────────────────────────────────────────────────

// [cx, cy, name, type, dot-size]
const TOWNS: [number, number, string, string, number][] = [
  [122,  272, "WORCESTER",    "CITY",   8],
  [362,  258, "SHREWSBURY",   "TOWN",   6],
  [562,  248, "NORTHBOROUGH", "TOWN",   5],
  [742,  254, "WESTBOROUGH",  "TOWN",   5],
  [882,  260, "SOUTHBOROUGH", "TOWN",   4.5],
  [1062, 265, "FRAMINGHAM",   "CITY",   7],
  [1242, 271, "NATICK",       "TOWN",   5],
];

// Route 9 shield sign positions
const SHIELDS: [number, number][] = [
  [282, 252], [660, 245], [966, 257], [1158, 265],
];

// Client business pins along route
const PINS: [number, number][] = [
  [202, 257], [292, 260], [436, 252], [502, 250], [622, 246],
  [810, 255], [848, 258], [990, 262], [1108, 265], [1186, 268],
];

// Tree cluster centers and sizes [cx, cy, r]
const TREES: [number, number, number][] = [
  [475, 184, 22], [510, 192, 16], [490, 198, 18],
  [608, 196, 20], [640, 188, 15], [620, 204, 17],
  [992, 177, 24], [1020, 189, 17], [1005, 198, 19],
  [1108, 192, 20], [1130, 182, 14], [1118, 200, 16],
  [1308, 186, 22], [1332, 194, 16], [1318, 204, 18],
  [148,  348, 18], [168,  356, 14],
  [402,  358, 16], [420,  350, 12],
  [718,  344, 20], [740,  354, 15],
];

// Contour lines (faint elevation parallels) [y, x1, x2, opacity]
const CONTOURS: [number, number, number, number][] = [
  [228, 60, 480, 0.06], [220, 60, 400, 0.05],
  [310, 60, 520, 0.06], [318, 60, 440, 0.05],
  [230, 560, 1000, 0.06], [222, 580, 920, 0.05],
  [314, 560, 1060, 0.05],
];

export function RoadAtlas() {
  return (
    <div aria-hidden style={{ lineHeight: 0 }}>
      <svg
        viewBox="0 0 1440 520"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ display: "block", width: "100%", height: "auto" }}
        role="img"
        aria-label="Vintage road atlas of Route 9 corridor from Worcester to Natick Massachusetts"
      >
        <defs>
          <linearGradient id="ra-paper" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#f5ead8" />
            <stop offset="100%" stopColor="#efe0c4" />
          </linearGradient>
          <linearGradient id="ra-water" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#b4d0e4" />
            <stop offset="100%" stopColor="#98bcd6" />
          </linearGradient>
          <linearGradient id="ra-road-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#e8c870" />
            <stop offset="100%" stopColor="#d8b850" />
          </linearGradient>
          <linearGradient id="ra-cartouche" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#ece0c4" />
            <stop offset="100%" stopColor="#ddd0b0" />
          </linearGradient>
          <filter id="ra-grain" x="0" y="0" width="100%" height="100%">
            <feTurbulence type="fractalNoise" baseFrequency="0.72" numOctaves="4"
              stitchTiles="stitch" result="noise"/>
            <feColorMatrix type="saturate" values="0" in="noise" result="grey"/>
            <feBlend in="SourceGraphic" in2="grey" mode="multiply" result="out"/>
            <feComponentTransfer in="out">
              <feFuncA type="linear" slope="1"/>
            </feComponentTransfer>
          </filter>
          <filter id="ra-pin-glow">
            <feGaussianBlur stdDeviation="2" result="blur"/>
            <feComposite in="SourceGraphic" in2="blur" operator="over"/>
          </filter>
        </defs>

        {/* ── PARCHMENT BACKGROUND ── */}
        <rect width="1440" height="520" fill="url(#ra-paper)" />
        {/* Subtle paper grain via thin horizontal bands */}
        {Array.from({ length: 26 }, (_, i) => i * 20).map(y => (
          <rect key={y} x="0" y={y} width="1440" height="1"
            fill="rgba(100,70,20,0.025)" />
        ))}
        {/* Edge vignette */}
        <rect x="0"    y="0" width="60"   height="520" fill="rgba(140,90,20,0.06)" />
        <rect x="1380" y="0" width="60"   height="520" fill="rgba(140,90,20,0.06)" />
        <rect x="0"    y="0" width="1440" height="50"  fill="rgba(140,90,20,0.05)" />
        <rect x="0"    y="470" width="1440" height="50" fill="rgba(140,90,20,0.05)" />

        {/* ── DECORATIVE BORDER ── */}
        {/* Outer frame */}
        <rect x="18" y="18" width="1404" height="484" rx="2"
          fill="none" stroke="#9a6028" strokeWidth="2.2" />
        {/* Inner frame */}
        <rect x="26" y="26" width="1388" height="468" rx="1"
          fill="none" stroke="#9a6028" strokeWidth="0.9" />
        {/* Corner ornament diamonds */}
        {([[18,18],[1422,18],[18,502],[1422,502]] as [number,number][]).map(([ox,oy],i) => (
          <polygon key={i}
            points={`${ox},${oy - 10} ${ox + 10},${oy} ${ox},${oy + 10} ${ox - 10},${oy}`}
            fill="#9a6028" opacity="0.65" />
        ))}
        {/* Mid-side tick marks */}
        {[360,720,1080].map(x => (
          <g key={x}>
            <line x1={x} y1="18" x2={x} y2="28" stroke="#9a6028" strokeWidth="1.2"/>
            <line x1={x} y1="492" x2={x} y2="502" stroke="#9a6028" strokeWidth="1.2"/>
          </g>
        ))}
        {[130,260,390].map(y => (
          <g key={y}>
            <line x1="18" y1={y} x2="28" y2={y} stroke="#9a6028" strokeWidth="1.2"/>
            <line x1="1412" y1={y} x2="1422" y2={y} stroke="#9a6028" strokeWidth="1.2"/>
          </g>
        ))}

        {/* ── MAP TITLE ── */}
        <text x="720" y="62" textAnchor="middle"
          fill="#5a3010" fontSize="22" fontFamily="Georgia, 'Times New Roman', serif"
          fontWeight="bold" letterSpacing="3">
          ROUTE 9 ROAD ATLAS
        </text>
        <text x="720" y="80" textAnchor="middle"
          fill="#7a4818" fontSize="10" fontFamily="Georgia, serif"
          letterSpacing="4">
          WORCESTER TO NATICK · CENTRAL MASSACHUSETTS
        </text>
        <line x1="380" y1="86" x2="1060" y2="86" stroke="#9a6028" strokeWidth="0.8"/>

        {/* ── ELEVATION CONTOURS ── */}
        {CONTOURS.map(([cy, cx1, cx2, op], i) => (
          <path key={i}
            d={`M ${cx1},${cy} C ${(cx1 + cx2) / 2 - 30},${cy - 4} ${(cx1 + cx2) / 2 + 30},${cy + 3} ${cx2},${cy}`}
            stroke="#9a6820" strokeWidth="0.6" fill="none" opacity={op} />
        ))}

        {/* ── TREE CLUSTERS ── */}
        {TREES.map(([tcx, tcy, tr], i) => (
          <g key={i}>
            <circle cx={tcx} cy={tcy} r={tr}
              fill="#8aac60" opacity="0.28" />
            <circle cx={tcx} cy={tcy} r={tr * 0.7}
              fill="#6a9040" opacity="0.22" />
            {/* Tree top suggestion */}
            <polygon
              points={`${tcx},${tcy - tr * 0.9} ${tcx - tr * 0.55},${tcy + tr * 0.3} ${tcx + tr * 0.55},${tcy + tr * 0.3}`}
              fill="#5a8030" opacity="0.30" />
          </g>
        ))}

        {/* ── LAKE QUINSIGAMOND ── */}
        <path
          d="M 196,226 C 212,218 228,216 238,222 C 248,228 252,240 250,255
             C 248,268 244,278 238,285 C 232,292 224,296 216,294
             C 208,292 200,284 196,272 C 192,260 190,244 196,226 Z"
          fill="url(#ra-water)" opacity="0.78" />
        <path
          d="M 196,226 C 212,218 228,216 238,222 C 248,228 252,240 250,255
             C 248,268 244,278 238,285 C 232,292 224,296 216,294
             C 208,292 200,284 196,272 C 192,260 190,244 196,226 Z"
          fill="none" stroke="#6898b8" strokeWidth="0.8" />
        {/* Lake ripple lines */}
        <path d="M 206,250 Q 222,246 238,250" stroke="rgba(80,130,170,0.25)"
          strokeWidth="0.8" fill="none"/>
        <path d="M 202,260 Q 220,256 240,260" stroke="rgba(80,130,170,0.20)"
          strokeWidth="0.7" fill="none"/>
        <text x="218" y="262" textAnchor="middle"
          fill="#4878a0" fontSize="6.5" fontFamily="Georgia, serif" fontStyle="italic">
          Lake
        </text>
        <text x="218" y="272" textAnchor="middle"
          fill="#4878a0" fontSize="6" fontFamily="Georgia, serif" fontStyle="italic">
          Quinsigamond
        </text>

        {/* ── HIGHWAY GRID LINES (minor roads) ── */}
        {/* Route 290 (major cross — Worcester) */}
        <line x1="138" y1="100" x2="130" y2="420"
          stroke="#c8a050" strokeWidth="3.5" opacity="0.55" />
        <line x1="138" y1="100" x2="130" y2="420"
          stroke="#f0d880" strokeWidth="1.5" opacity="0.60" />
        <text x="125" y="115" textAnchor="middle"
          fill="#7a5010" fontSize="8" fontFamily="monospace" fontWeight="bold"
          transform="rotate(-88 125 115)">I-290</text>

        {/* I-495 (major cross — Westborough) */}
        <line x1="818" y1="96" x2="826" y2="420"
          stroke="#c8a050" strokeWidth="3.5" opacity="0.55" />
        <line x1="818" y1="96" x2="826" y2="420"
          stroke="#f0d880" strokeWidth="1.5" opacity="0.60" />
        <text x="812" y="112" textAnchor="middle"
          fill="#7a5010" fontSize="8" fontFamily="monospace" fontWeight="bold"
          transform="rotate(-88 812 112)">I-495</text>

        {/* Route 9 connector spur east side */}
        <path d="M 1242,271 C 1280,270 1320,268 1380,270"
          stroke="#c8a050" strokeWidth="2.8" opacity="0.50" />
        <path d="M 1242,271 C 1280,270 1320,268 1380,270"
          stroke="#f0d880" strokeWidth="1.2" opacity="0.55" />

        {/* ── ROUTE 9 ROAD ── */}
        {/* Road shadow / casing */}
        <path
          d="M 60,275 C 100,272 115,273 122,272
             C 155,270 185,267 220,266
             C 265,264 315,260 362,258
             C 425,255 495,250 562,248
             C 640,248 702,252 742,254
             C 792,257 842,260 882,260
             C 942,262 1012,264 1062,265
             C 1142,268 1204,270 1242,271
             L 1400,273"
          stroke="#9a7820" strokeWidth="11" strokeLinecap="round" opacity="0.4" />
        {/* Road fill */}
        <path
          d="M 60,275 C 100,272 115,273 122,272
             C 155,270 185,267 220,266
             C 265,264 315,260 362,258
             C 425,255 495,250 562,248
             C 640,248 702,252 742,254
             C 792,257 842,260 882,260
             C 942,262 1012,264 1062,265
             C 1142,268 1204,270 1242,271
             L 1400,273"
          stroke="url(#ra-road-fill)" strokeWidth="8" strokeLinecap="round" />
        {/* Road outline top */}
        <path
          d="M 60,275 C 100,272 115,273 122,272
             C 155,270 185,267 220,266
             C 265,264 315,260 362,258
             C 425,255 495,250 562,248
             C 640,248 702,252 742,254
             C 792,257 842,260 882,260
             C 942,262 1012,264 1062,265
             C 1142,268 1204,270 1242,271
             L 1400,273"
          stroke="#9a7820" strokeWidth="8.5" strokeLinecap="round" fill="none" opacity="0.9" />
        {/* Center line dashes */}
        <path
          d="M 60,275 C 100,272 115,273 122,272
             C 155,270 185,267 220,266
             C 265,264 315,260 362,258
             C 425,255 495,250 562,248
             C 640,248 702,252 742,254
             C 792,257 842,260 882,260
             C 942,262 1012,264 1062,265
             C 1142,268 1204,270 1242,271
             L 1400,273"
          stroke="rgba(255,255,255,0.40)" strokeWidth="1.2"
          strokeDasharray="18,14" strokeLinecap="round" fill="none" />

        {/* ── ROUTE 9 SHIELDS ── */}
        {SHIELDS.map(([sx, sy], i) => (
          <g key={i} transform={`translate(${sx},${sy})`}>
            {/* Shield shape */}
            <path d="M -11,0 L 11,0 L 11,14 Q 0,22 -11,14 Z"
              fill="#f5ead8" stroke="#8a6020" strokeWidth="1.2" />
            <rect x="-11" y="0" width="22" height="8" rx="0"
              fill="#1a3878" />
            <text x="0" y="7" textAnchor="middle"
              fill="white" fontSize="5.5" fontFamily="monospace" fontWeight="bold">US</text>
            <text x="0" y="18" textAnchor="middle"
              fill="#2a1808" fontSize="10" fontFamily="Georgia, serif" fontWeight="bold">9</text>
          </g>
        ))}

        {/* ── CLIENT BUSINESS PINS ── */}
        {PINS.map(([px, py], i) => (
          <g key={i}>
            <circle cx={px} cy={py - 2} r="6"
              fill="#c03010" opacity="0.82" />
            <circle cx={px} cy={py - 2} r="3.5"
              fill="#f05030" opacity="0.90" />
            <line x1={px} y1={py - 2} x2={px} y2={py + 4}
              stroke="#8a1808" strokeWidth="1.2" />
            <ellipse cx={px} cy={py + 4} rx="3.5" ry="1.2"
              fill="rgba(0,0,0,0.18)" />
          </g>
        ))}

        {/* ── TOWNS ── */}
        {TOWNS.map(([tcx, tcy, name, type, r], i) => (
          <g key={i}>
            {/* Town dot */}
            <circle cx={tcx} cy={tcy} r={r + 2}
              fill="rgba(160,100,30,0.25)" />
            <circle cx={tcx} cy={tcy} r={r}
              fill="#f5ead8" stroke="#8a5020" strokeWidth={type === "CITY" ? 1.8 : 1.2} />
            <circle cx={tcx} cy={tcy} r={r * 0.45}
              fill="#8a5020" />
            {/* Town label */}
            <text
              x={tcx}
              y={tcy - r - 6}
              textAnchor="middle"
              fill="#3a2010"
              fontSize={type === "CITY" ? 11 : 9.5}
              fontFamily="Georgia, 'Times New Roman', serif"
              fontWeight={type === "CITY" ? "bold" : "normal"}
              letterSpacing="0.5"
            >
              {name}
            </text>
          </g>
        ))}

        {/* Shrewsbury clock tower icon */}
        <g transform="translate(364, 228)">
          <rect x="-5" y="-18" width="10" height="18" fill="#b89060" stroke="#8a5820" strokeWidth="0.8"/>
          <polygon points="-6,-18 6,-18 0,-28" fill="#8a5820"/>
          <circle cx="0" cy="-9" r="4" fill="none" stroke="#8a5820" strokeWidth="0.7"/>
          <line x1="0" y1="-12" x2="0" y2="-9" stroke="#8a5820" strokeWidth="0.6"/>
          <line x1="0" y1="-9" x2="3" y2="-9" stroke="#8a5820" strokeWidth="0.6"/>
        </g>

        {/* ── COMPASS ROSE ── */}
        <g transform="translate(1360, 128)">
          {/* Cardinal points */}
          {[0,90,180,270].map(angle => (
            <polygon key={angle}
              points="0,-28 -6,-6 6,-6"
              fill={angle === 0 ? "#8a1010" : "#6a4820"}
              opacity="0.85"
              transform={`rotate(${angle})`} />
          ))}
          {/* Ordinal points */}
          {[45,135,225,315].map(angle => (
            <polygon key={angle}
              points="0,-20 -4,-5 4,-5"
              fill="#8a7040" opacity="0.60"
              transform={`rotate(${angle})`} />
          ))}
          {/* Center */}
          <circle cx="0" cy="0" r="5" fill="#f5ead8" stroke="#7a5020" strokeWidth="1"/>
          <circle cx="0" cy="0" r="2" fill="#7a5020"/>
          {/* Labels */}
          <text x="0" y="-32" textAnchor="middle"
            fill="#8a1010" fontSize="9" fontFamily="Georgia, serif" fontWeight="bold">N</text>
          <text x="0" y="42" textAnchor="middle"
            fill="#6a4820" fontSize="8" fontFamily="Georgia, serif">S</text>
          <text x="36" y="4" textAnchor="middle"
            fill="#6a4820" fontSize="8" fontFamily="Georgia, serif">E</text>
          <text x="-36" y="4" textAnchor="middle"
            fill="#6a4820" fontSize="8" fontFamily="Georgia, serif">W</text>
        </g>

        {/* ── CARTOUCHE ── */}
        <g transform="translate(80, 390)">
          {/* Frame */}
          <rect x="0" y="0" width="270" height="98" rx="4"
            fill="url(#ra-cartouche)" stroke="#9a6028" strokeWidth="1.5" />
          <rect x="4" y="4" width="262" height="90" rx="3"
            fill="none" stroke="#9a6028" strokeWidth="0.6" opacity="0.6" />
          {/* Corner flourishes */}
          {([[6,6],[268,6],[6,94],[268,94]] as [number,number][]).map(([fx,fy], i) => (
            <circle key={i} cx={fx} cy={fy} r="3.5"
              fill="#9a6028" opacity="0.55" />
          ))}
          {/* Text */}
          <text x="135" y="28" textAnchor="middle"
            fill="#4a2808" fontSize="14" fontFamily="Georgia, serif" fontWeight="bold"
            letterSpacing="2">
            ROUTE 9 WEB CO.
          </text>
          <line x1="18" y1="34" x2="252" y2="34" stroke="#9a6028" strokeWidth="0.7"/>
          <text x="135" y="50" textAnchor="middle"
            fill="#6a3a10" fontSize="9" fontFamily="Georgia, serif" letterSpacing="1.5">
            SERVICE AREA
          </text>
          <text x="135" y="64" textAnchor="middle"
            fill="#7a4a18" fontSize="8" fontFamily="Georgia, serif" letterSpacing="0.8">
            SHREWSBURY · WESTBOROUGH
          </text>
          <text x="135" y="76" textAnchor="middle"
            fill="#7a4a18" fontSize="8" fontFamily="Georgia, serif" letterSpacing="0.8">
            NORTHBOROUGH · WORCESTER
          </text>
          <text x="135" y="88" textAnchor="middle"
            fill="#9a6028" fontSize="7" fontFamily="Georgia, serif" fontStyle="italic">
            Est. Shrewsbury, MA · MMXXIV
          </text>
        </g>

        {/* ── SCALE BAR ── */}
        <g transform="translate(400, 462)">
          <line x1="0" y1="0" x2="120" y2="0" stroke="#7a5020" strokeWidth="1.2"/>
          <line x1="0"   y1="-4" x2="0"   y2="4" stroke="#7a5020" strokeWidth="1"/>
          <line x1="60"  y1="-3" x2="60"  y2="3" stroke="#7a5020" strokeWidth="0.8"/>
          <line x1="120" y1="-4" x2="120" y2="4" stroke="#7a5020" strokeWidth="1"/>
          <rect x="0" y="-3" width="30" height="6" fill="#7a5020" opacity="0.6"/>
          <rect x="60" y="-3" width="30" height="6" fill="#7a5020" opacity="0.6"/>
          <text x="0"   y="-7" textAnchor="middle" fill="#5a3810" fontSize="7" fontFamily="serif">0</text>
          <text x="60"  y="-7" textAnchor="middle" fill="#5a3810" fontSize="7" fontFamily="serif">5</text>
          <text x="120" y="-7" textAnchor="middle" fill="#5a3810" fontSize="7" fontFamily="serif">10 mi</text>
        </g>

        {/* ── LEGEND ── */}
        <g transform="translate(1100, 390)">
          <rect x="0" y="0" width="240" height="98" rx="4"
            fill="url(#ra-cartouche)" stroke="#9a6028" strokeWidth="1.2"/>
          <rect x="4" y="4" width="232" height="90" rx="2"
            fill="none" stroke="#9a6028" strokeWidth="0.5" opacity="0.5"/>
          <text x="120" y="18" textAnchor="middle"
            fill="#4a2808" fontSize="9" fontFamily="Georgia, serif" fontWeight="bold"
            letterSpacing="2">LEGEND</text>
          <line x1="16" y1="22" x2="224" y2="22" stroke="#9a6028" strokeWidth="0.6"/>
          {/* Route 9 road symbol */}
          <line x1="16" y1="36" x2="46" y2="36" stroke="#d8b850" strokeWidth="5"/>
          <line x1="16" y1="36" x2="46" y2="36" stroke="#9a7820" strokeWidth="5.5" opacity="0.5"/>
          <text x="54" y="39.5" fill="#3a2010" fontSize="8" fontFamily="Georgia, serif">US Route 9</text>
          {/* Interstate symbol */}
          <line x1="16" y1="52" x2="46" y2="52" stroke="#d8b850" strokeWidth="3.5" opacity="0.55"/>
          <line x1="16" y1="52" x2="46" y2="52" stroke="#f0d880" strokeWidth="1.8" opacity="0.65"/>
          <text x="54" y="55.5" fill="#3a2010" fontSize="8" fontFamily="Georgia, serif">Interstate Highway</text>
          {/* Client pin */}
          <circle cx="30" cy="68" r="5" fill="#c03010" opacity="0.82"/>
          <circle cx="30" cy="68" r="3" fill="#f05030" opacity="0.90"/>
          <text x="54" y="71.5" fill="#3a2010" fontSize="8" fontFamily="Georgia, serif">Business Served</text>
          {/* Town dot */}
          <circle cx="30" cy="84" r="5.5" fill="#f5ead8" stroke="#8a5020" strokeWidth="1.2"/>
          <circle cx="30" cy="84" r="2.2" fill="#8a5020"/>
          <text x="54" y="87.5" fill="#3a2010" fontSize="8" fontFamily="Georgia, serif">Town / City</text>
        </g>

        {/* ── PIN COUNT LABEL ── */}
        <text x="720" y="476" textAnchor="middle"
          fill="rgba(90,48,16,0.45)" fontSize="8.5"
          fontFamily="Georgia, serif" fontStyle="italic" letterSpacing="1">
          10+ businesses served along the corridor · and growing
        </text>
      </svg>
    </div>
  );
}
