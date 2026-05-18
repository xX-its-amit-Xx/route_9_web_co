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
            filter:
              "drop-shadow(0 6px 14px rgba(28,18,9,0.28)) drop-shadow(0 2px 4px rgba(28,18,9,0.18))",
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
            </defs>

            {/* Tab on top */}
            <path
              d="M 38 8 L 58 0 L 102 0 L 122 8 L 122 24 L 38 24 Z"
              fill={`url(#pf-tab-${idx})`}
              stroke="#3A1408"
              strokeWidth="0.8"
            />
            {/* Tab darker bottom edge for layered feel */}
            <line x1="38" y1="24" x2="122" y2="24" stroke="rgba(28,14,4,0.35)" strokeWidth="0.6" />

            {/* Folder body */}
            <path
              d="M 6 24 L 194 24 L 194 134 L 6 134 Z"
              fill={`url(#pf-paper-${idx})`}
              stroke="#3A1408"
              strokeWidth="0.9"
            />
            <rect x="6" y="24" width="188" height="110" fill={`url(#pf-fiber-${idx})`} opacity="0.45" />

            {/* Subtle horizontal rule lines like ruled paper */}
            {[42, 56, 70, 84, 98, 112].map((y) => (
              <line key={y} x1="14" y1={y} x2="186" y2={y}
                stroke="rgba(74,40,8,0.16)" strokeWidth="0.5" />
            ))}

            {/* Hole reinforcement rings down the left edge */}
            {[42, 76, 110].map((y) => (
              <g key={y} transform={`translate(18 ${y})`}>
                <circle r="3.5" fill="#1C0E04" />
                <circle r="2.6" fill={`url(#pf-paper-${idx})`} />
                <circle r="2.6" fill="none" stroke="rgba(28,14,4,0.45)" strokeWidth="0.4" />
              </g>
            ))}

            {/* Hand-written project label */}
            <text
              x="80" y="44" textAnchor="middle"
              fontFamily="Georgia, 'Times New Roman', serif"
              fontStyle="italic"
              fontWeight="800"
              fontSize="14"
              fill="#3A1408"
              letterSpacing="0.04em"
            >
              {f.project}
            </text>
            {/* Location */}
            <text
              x="80" y="60" textAnchor="middle"
              fontFamily="monospace"
              fontWeight="700"
              fontSize="8"
              fill="rgba(58,20,8,0.78)"
              letterSpacing="0.32em"
            >
              {f.location}
            </text>

            {/* Underline below project name — hand-drawn */}
            <path
              d="M 42 50 q 18 -2 38 0 q 18 2 38 -1"
              stroke="#A84818"
              strokeWidth="1"
              fill="none"
              strokeLinecap="round"
              opacity="0.7"
            />

            {/* Mini "project info" lines — like form fields filled in */}
            <g fontFamily="monospace" fontSize="6.5" fill="rgba(58,20,8,0.7)" letterSpacing="0.12em">
              <text x="40" y="76">STATUS</text>
              <text x="186" y="76" textAnchor="end" fill="#A84818" fontWeight="800">IN PROGRESS</text>
              <text x="40" y="90">SCOPE</text>
              <text x="186" y="90" textAnchor="end" fontWeight="700">5 PAGES · MOBILE-FIRST</text>
              <text x="40" y="104">START</text>
              <text x="186" y="104" textAnchor="end" fontWeight="700">SPRING 2026</text>
            </g>

            {/* Tilted "IN PROGRESS" stamp — bottom-right */}
            <g transform="translate(140 122) rotate(-12)">
              <rect x="-30" y="-9" width="60" height="18" rx="1"
                fill="none" stroke="#A84818" strokeWidth="1.4" opacity="0.75" />
              <text x="0" y="3" textAnchor="middle"
                fontFamily="Georgia, serif"
                fontStyle="italic"
                fontWeight="900"
                fontSize="9"
                fill="#A84818"
                letterSpacing="0.18em"
                opacity="0.85">
                IN PROGRESS
              </text>
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
