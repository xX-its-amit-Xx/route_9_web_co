"use client";

/**
 * Vintage stack of manila project folders — a brand artifact suggesting
 * "projects in the queue." Three folders fan out with colored tabs, each
 * carrying a hand-written project label and a small "IN PROGRESS" stamp.
 *
 * Pure SVG, decorative (aria-hidden), no animations.
 */

const FOLDERS = [
  {
    project: "Project: Pizzeria",
    location: "SHREWSBURY",
    tabColor: "#D4682A",
    tilt: -10,
    offsetX: -28,
    offsetY: 18,
    z: 1,
  },
  {
    project: "Project: Bakery",
    location: "WESTBOROUGH",
    tabColor: "#6B8E5A",
    tilt: -3,
    offsetX: 0,
    offsetY: 6,
    z: 2,
  },
  {
    project: "Project: Barber",
    location: "NORTHBORO",
    tabColor: "#A84818",
    tilt: 6,
    offsetX: 26,
    offsetY: 14,
    z: 3,
  },
];

export function ProjectFolders({ size = 260 }: { size?: number }) {
  return (
    <div
      aria-hidden
      className="project-folders relative inline-block select-none"
      style={{
        width: size,
        height: Math.round(size * 0.7),
      }}
    >
      {FOLDERS.map((f, idx) => (
        <div
          key={f.project}
          className="absolute inset-0 flex items-center justify-center"
          style={{
            zIndex: f.z,
            transform: `translate(${f.offsetX}px, ${f.offsetY}px) rotate(${f.tilt}deg)`,
            // Directional cast shadow (light upper-left) — each folder throws
            // a soft shadow down-right onto the folder beneath it
            filter:
              "drop-shadow(5px 9px 14px rgba(28,18,9,0.3)) drop-shadow(2px 3px 4px rgba(28,18,9,0.2))",
          }}
        >
          <svg
            viewBox="0 0 200 140"
            xmlns="http://www.w3.org/2000/svg"
            style={{ width: "82%", height: "auto", overflow: "visible" }}
          >
            <defs>
              <linearGradient id={`pf-paper-${idx}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%"   stopColor="#F0DDA8" />
                <stop offset="100%" stopColor="#D4B675" />
              </linearGradient>
              <linearGradient id={`pf-tab-${idx}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%"   stopColor={f.tabColor} stopOpacity="1" />
                <stop offset="100%" stopColor={f.tabColor} stopOpacity="0.78" />
              </linearGradient>
              <pattern id={`pf-fiber-${idx}`} x="0" y="0" width="3" height="3" patternUnits="userSpaceOnUse">
                <circle cx="0.8" cy="0.8" r="0.28" fill="rgba(74,40,8,0.18)" />
              </pattern>
              {/* Occlusion gradient cast by the tab onto the sheets below */}
              <linearGradient id={`pf-tabshade-${idx}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%"   stopColor="rgba(28,14,4,0.3)" />
                <stop offset="100%" stopColor="rgba(28,14,4,0)" />
              </linearGradient>
            </defs>

            {/* Tab on top */}
            <path
              d="M 38 8 L 58 0 L 102 0 L 122 8 L 122 24 L 38 24 Z"
              fill={`url(#pf-tab-${idx})`}
              stroke="#3A1408"
              strokeWidth="0.8"
            />
            {/* Tab bevel: top-edge highlight catching the light, shaded fold sides */}
            <path d="M 40.5 8.4 L 58.4 1.3 L 101.6 1.3 L 111 5"
              stroke="rgba(255,240,200,0.5)" strokeWidth="0.9" fill="none" strokeLinecap="round" />
            <path d="M 38.8 9 L 38.8 23" stroke="rgba(255,240,200,0.28)" strokeWidth="0.7" />
            <path d="M 121.2 9 L 121.2 23" stroke="rgba(28,14,4,0.3)" strokeWidth="0.8" />
            {/* Tab darker bottom edge for layered feel */}
            <line x1="38" y1="24" x2="122" y2="24" stroke="rgba(28,14,4,0.35)" strokeWidth="0.6" />

            {/* Paper stack inside — sheet edges peeking above the front flap */}
            <rect x="12" y="18.6" width="174" height="6" rx="0.8"
              fill="#FBF2DA" stroke="rgba(120,72,28,0.45)" strokeWidth="0.5" />
            <rect x="9" y="21" width="180" height="4" rx="0.8"
              fill="#F2E3BC" stroke="rgba(120,72,28,0.4)" strokeWidth="0.5" />
            <line x1="13" y1="19.4" x2="185" y2="19.4" stroke="rgba(255,252,242,0.8)" strokeWidth="0.4" />
            {/* Tab's cast shadow falling on the sheets */}
            <rect x="38" y="18.6" width="84" height="5.4" fill={`url(#pf-tabshade-${idx})`} />

            {/* Folder body */}
            <path
              d="M 6 24 L 194 24 L 194 134 L 6 134 Z"
              fill={`url(#pf-paper-${idx})`}
              stroke="#3A1408"
              strokeWidth="0.9"
            />
            <rect x="6" y="24" width="188" height="110" fill={`url(#pf-fiber-${idx})`} opacity="0.45" />
            {/* Front-flap top edge: sheets occlude it slightly, so a thin
                shadow line under the fold + a bright cut edge */}
            <line x1="6" y1="24.8" x2="194" y2="24.8" stroke="rgba(255,248,224,0.55)" strokeWidth="0.7" />
            {/* Manila sheen — light source upper-left grazes the top of the flap */}
            <path d="M 6 25.5 L 194 25.5 L 194 36 Q 100 44 6 36 Z"
              fill="rgba(255,246,220,0.2)" />
            {/* Rim light down the left edge; soft falloff on the right */}
            <line x1="7" y1="26" x2="7" y2="132" stroke="rgba(255,246,220,0.4)" strokeWidth="0.7" />
            <line x1="192.8" y1="26" x2="192.8" y2="132" stroke="rgba(58,20,8,0.22)" strokeWidth="1" />
            {/* Bottom fold crease shading — the flap curls away from the light */}
            <rect x="6" y="125" width="188" height="9" fill="rgba(74,40,8,0.1)" />
            <line x1="6" y1="133" x2="194" y2="133" stroke="rgba(28,14,4,0.28)" strokeWidth="0.7" />

            {/* Subtle ruled lines only in the blank zone — not near text */}
            {[66, 116].map((y) => (
              <line key={y} x1="28" y1={y} x2="184" y2={y}
                stroke="rgba(74,40,8,0.13)" strokeWidth="0.5" />
            ))}

            {/* Hole reinforcement rings down the left edge */}
            {[40, 80, 118].map((y) => (
              <g key={y} transform={`translate(18 ${y})`}>
                <circle r="3.5" fill="#1C0E04" />
                <circle r="2.6" fill={`url(#pf-paper-${idx})`} />
                <circle r="2.6" fill="none" stroke="rgba(28,14,4,0.45)" strokeWidth="0.4" />
              </g>
            ))}

            {/* Hand-written project label — pressed into the manila fiber:
                light relief offset first, ink on top */}
            <text
              x="100.5" y="43.6" textAnchor="middle"
              fontFamily="Georgia, 'Times New Roman', serif"
              fontStyle="italic"
              fontWeight="800"
              fontSize="13"
              fill="rgba(255,248,224,0.55)"
              letterSpacing="0.04em"
            >
              {f.project}
            </text>
            <text
              x="100" y="43" textAnchor="middle"
              fontFamily="Georgia, 'Times New Roman', serif"
              fontStyle="italic"
              fontWeight="800"
              fontSize="13"
              fill="#3A1408"
              letterSpacing="0.04em"
            >
              {f.project}
            </text>

            {/* Underline below project name — hand-drawn */}
            <path
              d="M 52 48 q 16 -2 32 0 q 16 2 32 -1 q 10 -1 20 0"
              stroke="#A84818"
              strokeWidth="0.9"
              fill="none"
              strokeLinecap="round"
              opacity="0.65"
            />

            {/* Location */}
            <text
              x="100" y="59" textAnchor="middle"
              fontFamily="monospace"
              fontWeight="700"
              fontSize="7"
              fill="rgba(58,20,8,0.72)"
              letterSpacing="0.28em"
            >
              {f.location}
            </text>

            {/* Subtle background for info table */}
            <rect x="28" y="68" width="156" height="44" rx="1"
              fill="rgba(212,168,90,0.10)" />

            {/* Mini "project info" rows */}
            <g fontFamily="monospace" fontSize="7" fill="rgba(58,20,8,0.68)" letterSpacing="0.10em">
              {/* Row dividers */}
              <line x1="28" y1="83" x2="184" y2="83" stroke="rgba(74,40,8,0.08)" strokeWidth="0.5" />
              <line x1="28" y1="97" x2="184" y2="97" stroke="rgba(74,40,8,0.08)" strokeWidth="0.5" />

              <text x="36" y="79">STATUS</text>
              <text x="180" y="79" textAnchor="end" fill="#A84818" fontWeight="800">IN PROGRESS</text>

              <text x="36" y="93">SCOPE</text>
              <text x="180" y="93" textAnchor="end" fontWeight="700">5 PG · MOBILE</text>

              <text x="36" y="107">START</text>
              <text x="180" y="107" textAnchor="end" fontWeight="700">SPRING 2026</text>
            </g>

            {/* Tilted "IN PROGRESS" stamp — bottom-right, ink pressed into
                the paper: a light offset relief below-right of every ink
                mark makes the impression read as debossed */}
            <g transform="translate(136 122) rotate(-12)">
              {/* Emboss relief — paper pushed up around the stamped ink */}
              <rect x="-41.5" y="-9.5" width="84" height="20" rx="2"
                fill="none" stroke="rgba(255,248,224,0.55)" strokeWidth="1.4" />
              <text x="0.5" y="4.6" textAnchor="middle"
                fontFamily="Georgia, serif"
                fontStyle="italic"
                fontWeight="900"
                fontSize="8.5"
                fill="rgba(255,248,224,0.5)"
                letterSpacing="0.10em">
                IN PROGRESS
              </text>
              {/* Ink layer */}
              <rect x="-42" y="-10" width="84" height="20" rx="2"
                fill="rgba(248,228,180,0.18)" stroke="#A84818" strokeWidth="1.5" opacity="0.85" />
              <text x="0" y="4" textAnchor="middle"
                fontFamily="Georgia, serif"
                fontStyle="italic"
                fontWeight="900"
                fontSize="8.5"
                fill="#A84818"
                letterSpacing="0.10em"
                opacity="0.9">
                IN PROGRESS
              </text>
              {/* Uneven ink pickup — faint press shadow inside the frame */}
              <rect x="-40.5" y="-8.5" width="81" height="17" rx="1.5"
                fill="rgba(168,72,24,0.05)" />
            </g>

            {/* Coffee ring stain bottom-left (lifestyle authenticity) */}
            <circle cx="44" cy="120" r="9"
              fill="none" stroke="rgba(168,72,24,0.25)" strokeWidth="1.2" />
            <circle cx="44" cy="120" r="9"
              fill="rgba(168,72,24,0.08)" />
          </svg>
        </div>
      ))}
    </div>
  );
}
