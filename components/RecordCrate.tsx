"use client";

// RecordCrate ────────────────────────────────────────────────────────────────
//
// Vintage vinyl record crate display — 4 illustrated album sleeves
// representing Route 9 shop types, fanned in a wooden crate.
// Placed between LakeScene and Testimonials as a cinematic "hear
// what our neighbors say" lead-in.
//
// Each sleeve has unique hand-drawn SVG cover art + partial vinyl disc.
// Scroll-reveal: crate slides up and records fan out with spring stagger.

import { useEffect, useRef, useState } from "react";

// ── Record data ───────────────────────────────────────────────────────────────

const RECORDS: {
  artist: string;
  album: string;
  subtitle: string;
  side: string;
  bg: string;
  accent: string;
  dark: string;
  labelBg: string;
  labelText: string;
  rot: number;
  zIndex: number;
}[] = [
  {
    artist: "ARTURO'S PIZZERIA",
    album: "FRESH SLICES",
    subtitle: "Hot Takes · Route 9 Sessions",
    side: "Side A",
    bg: "#6a1008",
    accent: "#e04820",
    dark: "#3a0804",
    labelBg: "#ff8030",
    labelText: "#1c0804",
    rot: -18,
    zIndex: 1,
  },
  {
    artist: "MAIN ST. CAFÉ",
    album: "MORNING LIGHT",
    subtitle: "Daily Roast · Shrewsbury Vol. II",
    side: "Side A",
    bg: "#1c3a10",
    accent: "#60a828",
    dark: "#0e2008",
    labelBg: "#90c840",
    labelText: "#0e2008",
    rot: -6,
    zIndex: 2,
  },
  {
    artist: "LAKE SHORE BARBERS",
    album: "CLEAN CUTS",
    subtitle: "Sharp Lines · Lake Quinsigamond EP",
    side: "Side A",
    bg: "#0e2850",
    accent: "#2880c8",
    dark: "#08162e",
    labelBg: "#40a8e8",
    labelText: "#08162e",
    rot: 5,
    zIndex: 3,
  },
  {
    artist: "TOWN COMMON CO.",
    album: "NEIGHBORS FIRST",
    subtitle: "Always On · Shrewsbury Center",
    side: "Side A",
    bg: "#3c1e08",
    accent: "#b86820",
    dark: "#1e0e04",
    labelBg: "#d88838",
    labelText: "#1e0e04",
    rot: 17,
    zIndex: 4,
  },
];

// ── Album cover art SVGs (one per record) ─────────────────────────────────────

function CoverArtPizza({ accent, dark }: { accent: string; dark: string }) {
  return (
    <g>
      {/* Concentric rings */}
      <circle cx="100" cy="100" r="88" fill={dark} opacity="0.4"/>
      <circle cx="100" cy="100" r="68" stroke={accent} strokeWidth="2.5" fill="none" opacity="0.5"/>
      <circle cx="100" cy="100" r="48" stroke={accent} strokeWidth="1.5" fill="none" opacity="0.35"/>
      {/* Pizza slice silhouette */}
      <path d="M 100,100 L 100,22 A 78,78 0 0,1 165,70 Z"
        fill={accent} opacity="0.7"/>
      <path d="M 100,100 L 100,22 A 78,78 0 0,1 165,70 Z"
        fill="none" stroke={dark} strokeWidth="2"/>
      {/* Cheese bubbles */}
      <circle cx="120" cy="60" r="5" fill={dark} opacity="0.6"/>
      <circle cx="135" cy="74" r="4" fill={dark} opacity="0.5"/>
      <circle cx="112" cy="78" r="3.5" fill={dark} opacity="0.55"/>
      {/* Basil leaf */}
      <ellipse cx="128" cy="52" rx="7" ry="4" fill="#208810" opacity="0.7"
        transform="rotate(-30,128,52)"/>
      {/* Corner geometric lines */}
      <line x1="15" y1="15" x2="50" y2="15" stroke={accent} strokeWidth="1.5" opacity="0.35"/>
      <line x1="15" y1="15" x2="15" y2="50" stroke={accent} strokeWidth="1.5" opacity="0.35"/>
      <line x1="185" y1="185" x2="150" y2="185" stroke={accent} strokeWidth="1.5" opacity="0.35"/>
      <line x1="185" y1="185" x2="185" y2="150" stroke={accent} strokeWidth="1.5" opacity="0.35"/>
    </g>
  );
}

function CoverArtCafe({ accent, dark }: { accent: string; dark: string }) {
  return (
    <g>
      {/* Diagonal stripe pattern */}
      {[0,1,2,3,4,5,6,7].map(n => (
        <line key={n} x1={n * 30 - 20} y1="0" x2={n * 30 + 180} y2="200"
          stroke={accent} strokeWidth="8" opacity="0.12"/>
      ))}
      {/* Coffee cup silhouette */}
      <rect x="62" y="72" width="76" height="64" rx="4" fill={accent} opacity="0.7"/>
      <path d="M 138,86 Q 158,86 158,104 Q 158,122 138,122" fill="none"
        stroke={accent} strokeWidth="6" opacity="0.7"/>
      <rect x="54" y="134" width="92" height="8" rx="3" fill={accent} opacity="0.5"/>
      {/* Steam lines */}
      <path d="M 80,68 Q 84,58 80,48" stroke={accent} strokeWidth="2.5" fill="none"
        strokeLinecap="round" opacity="0.55"/>
      <path d="M 100,64 Q 104,52 100,40" stroke={accent} strokeWidth="2.5" fill="none"
        strokeLinecap="round" opacity="0.55"/>
      <path d="M 120,68 Q 124,58 120,48" stroke={accent} strokeWidth="2.5" fill="none"
        strokeLinecap="round" opacity="0.55"/>
      {/* Corner badge */}
      <rect x="10" y="10" width="44" height="14" rx="2" fill={accent} opacity="0.5"/>
      <text x="32" y="21" textAnchor="middle" fill={dark}
        fontSize="8" fontFamily="monospace" fontWeight="bold" opacity="0.9">DAILY</text>
    </g>
  );
}

function CoverArtBarber({ accent, dark }: { accent: string; dark: string }) {
  return (
    <g>
      {/* Grid pattern */}
      {[0,1,2,3,4].map(n => (
        <line key={`h${n}`} x1="0" y1={40 * n} x2="200" y2={40 * n}
          stroke={accent} strokeWidth="0.8" opacity="0.15"/>
      ))}
      {[0,1,2,3,4].map(n => (
        <line key={`v${n}`} x1={40 * n} y1="0" x2={40 * n} y2="200"
          stroke={accent} strokeWidth="0.8" opacity="0.15"/>
      ))}
      {/* Scissors silhouette */}
      <circle cx="100" cy="90" r="12" fill="none" stroke={accent} strokeWidth="3" opacity="0.7"/>
      <line x1="100" y1="78" x2="68" y2="40" stroke={accent} strokeWidth="5"
        strokeLinecap="round" opacity="0.7"/>
      <line x1="100" y1="78" x2="132" y2="40" stroke={accent} strokeWidth="5"
        strokeLinecap="round" opacity="0.7"/>
      <line x1="100" y1="102" x2="68" y2="148" stroke={accent} strokeWidth="5"
        strokeLinecap="round" opacity="0.7"/>
      <line x1="100" y1="102" x2="132" y2="148" stroke={accent} strokeWidth="5"
        strokeLinecap="round" opacity="0.7"/>
      {/* Comb */}
      {[0,1,2,3,4,5,6,7].map(n => (
        <line key={n} x1={130 + n * 6} y1="158" x2={130 + n * 6} y2="176"
          stroke={accent} strokeWidth="2" opacity="0.5"/>
      ))}
      <rect x="128" y="154" width="52" height="6" rx="2" fill={accent} opacity="0.5"/>
    </g>
  );
}

function CoverArtGeneral({ accent, dark }: { accent: string; dark: string }) {
  return (
    <g>
      {/* Diagonal border lines */}
      <polygon points="100,14 186,100 100,186 14,100"
        stroke={accent} strokeWidth="2.5" fill="none" opacity="0.4"/>
      <polygon points="100,28 172,100 100,172 28,100"
        stroke={accent} strokeWidth="1.5" fill="none" opacity="0.3"/>
      {/* Route 9 shield */}
      <path d="M 84,72 L 116,72 L 116,104 Q 116,122 100,130 Q 84,122 84,104 Z"
        fill={accent} opacity="0.65"/>
      <rect x="84" y="72" width="32" height="14" rx="2" fill={dark} opacity="0.7"/>
      <text x="100" y="83" textAnchor="middle" fill={accent}
        fontSize="8" fontFamily="sans-serif" fontWeight="bold" opacity="0.9">US</text>
      <text x="100" y="112" textAnchor="middle" fill={dark}
        fontSize="20" fontFamily="Georgia, serif" fontWeight="bold" opacity="0.9">9</text>
      {/* Stars in corners */}
      {[[26,26],[174,26],[26,174],[174,174]].map(([sx,sy],i) => (
        <text key={i} x={sx} y={sy+4} textAnchor="middle"
          fill={accent} fontSize="12" opacity="0.4">★</text>
      ))}
    </g>
  );
}

const COVER_ART = [CoverArtPizza, CoverArtCafe, CoverArtBarber, CoverArtGeneral];

// ── Component ─────────────────────────────────────────────────────────────────

export function RecordCrate() {
  const [revealed, setRevealed] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setRevealed(true); obs.disconnect(); } },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{
        background: "linear-gradient(180deg, #0e0805 0%, #160c06 100%)",
        padding: "5rem 1.5rem",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* Ambient warm glow */}
      <div aria-hidden style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        background: "radial-gradient(ellipse at 50% 55%, rgba(180,80,20,0.07) 0%, transparent 65%)",
      }}/>

      {/* Label */}
      <p style={{
        textAlign: "center",
        fontSize: "9px", letterSpacing: "0.32em", textTransform: "uppercase",
        color: "rgba(212,104,42,0.40)", fontFamily: "monospace",
        marginBottom: "0.5rem",
        opacity: revealed ? 1 : 0, transition: "opacity 0.5s ease 0.1s",
      }}>
        Route 9 Records · Est. Shrewsbury, MA
      </p>
      <p style={{
        textAlign: "center",
        fontSize: "11px", letterSpacing: "0.06em",
        color: "rgba(243,233,213,0.22)",
        fontFamily: "var(--font-display, Georgia), Georgia, serif",
        fontStyle: "italic",
        marginBottom: "2.5rem",
        opacity: revealed ? 1 : 0, transition: "opacity 0.5s ease 0.2s",
      }}>
        Hear what our neighbors are saying
      </p>

      {/* Crate + records */}
      <div style={{
        maxWidth: "780px", margin: "0 auto", position: "relative",
        opacity: revealed ? 1 : 0,
        transform: revealed ? "translateY(0)" : "translateY(36px)",
        transition: "opacity 0.7s cubic-bezier(0.22,1,0.36,1) 0.2s, transform 0.7s cubic-bezier(0.22,1,0.36,1) 0.2s",
      }}>
        <svg
          viewBox="0 0 780 380"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ display: "block", width: "100%", height: "auto" }}
          role="img"
          aria-label="Vinyl record crate featuring Route 9 local businesses"
        >
          <defs>
            {/* Wood grain */}
            <linearGradient id="rc-crate" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"   stopColor="#3a2010" />
              <stop offset="40%"  stopColor="#2c1808" />
              <stop offset="100%" stopColor="#1e1006" />
            </linearGradient>
            <linearGradient id="rc-crate-side" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%"   stopColor="#1a0e04" />
              <stop offset="100%" stopColor="#2e1a0a" />
            </linearGradient>
            {/* Vinyl gradient */}
            <radialGradient id="rc-vinyl" cx="50%" cy="50%" r="50%">
              <stop offset="0%"   stopColor="#2a2a2a" />
              <stop offset="30%"  stopColor="#181818" />
              <stop offset="60%"  stopColor="#222222" />
              <stop offset="100%" stopColor="#0e0e0e" />
            </radialGradient>
            {/* Vinyl shine */}
            <radialGradient id="rc-vinyl-shine" cx="30%" cy="25%" r="60%">
              <stop offset="0%"   stopColor="rgba(255,255,255,0.08)" />
              <stop offset="100%" stopColor="rgba(255,255,255,0)" />
            </radialGradient>
            {/* Shadow */}
            <filter id="rc-shadow" x="-10%" y="-10%" width="120%" height="140%">
              <feDropShadow dx="0" dy="6" stdDeviation="10"
                floodColor="rgba(0,0,0,0.75)" floodOpacity="1"/>
            </filter>
            <filter id="rc-record-shadow" x="-15%" y="-15%" width="130%" height="150%">
              <feDropShadow dx="2" dy="8" stdDeviation="8"
                floodColor="rgba(0,0,0,0.8)" floodOpacity="1"/>
            </filter>
          </defs>

          {/* ── WOODEN CRATE ── */}
          {/* Crate back wall */}
          <rect x="48" y="42" width="684" height="292" rx="6" fill="url(#rc-crate)" filter="url(#rc-shadow)"/>
          {/* Wood grain lines */}
          {[68,110,155,205,260,320,382,445,510,578,648,714].map(x => (
            <line key={x} x1={x} y1="42" x2={x} y2="334"
              stroke="rgba(0,0,0,0.18)" strokeWidth="1.2"/>
          ))}
          {/* Crate left inner wall */}
          <rect x="48" y="42" width="22" height="292" rx="0" fill="url(#rc-crate-side)"/>
          {/* Crate right inner wall */}
          <rect x="710" y="42" width="22" height="292" rx="0" fill="url(#rc-crate-side)"/>
          {/* Crate rim — top */}
          <rect x="42" y="36" width="696" height="16" rx="5" fill="#4a2a12"
            stroke="#5c3618" strokeWidth="1"/>
          {/* Crate rim — front edge bevel */}
          <rect x="42" y="326" width="696" height="18" rx="4" fill="#3a1e0a"
            stroke="#4a2810" strokeWidth="1"/>
          {/* Rim screws */}
          {[80,200,390,580,700].map(x => (
            <circle key={x} cx={x} cy="44" r="3.5" fill="#3a2010"
              stroke="rgba(255,255,255,0.12)" strokeWidth="0.8"/>
          ))}
          {/* Crate divider post */}
          <rect x="388" y="52" width="10" height="278" fill="#1e1006" opacity="0.6"/>
          {/* Crate bottom strip */}
          <rect x="70" y="310" width="640" height="14" rx="2" fill="#1e1006" opacity="0.5"/>

          {/* ── RECORDS (fan from back to front) ── */}
          {RECORDS.map((rec, i) => {
            const CoverArt = COVER_ART[i] ?? CoverArtPizza;
            // Fan positions: spread across crate
            const baseX = 110 + i * 145;
            const baseY = 58;
            const rot = revealed ? rec.rot : 0;
            const delay = 0.35 + i * 0.12;

            return (
              <g key={i}
                style={{
                  zIndex: rec.zIndex,
                  transform: `translate(${baseX}px, ${baseY}px) rotate(${rot}deg)`,
                  transformOrigin: `${baseX + 95}px ${baseY + 260}px`,
                  transition: `transform 0.7s cubic-bezier(0.34,1.4,0.64,1) ${delay}s`,
                  filter: "url(#rc-record-shadow)",
                }}
              >
                {/* Vinyl disc (partially visible above sleeve) */}
                <g style={{ transform: "translate(8px, -40px)" }}>
                  <circle cx="92" cy="92" r="90" fill="url(#rc-vinyl)"/>
                  <circle cx="92" cy="92" r="90" fill="url(#rc-vinyl-shine)"/>
                  {/* Groove rings */}
                  {[72, 62, 52, 42, 32].map(r => (
                    <circle key={r} cx="92" cy="92" r={r}
                      stroke="rgba(255,255,255,0.04)" strokeWidth="1.5" fill="none"/>
                  ))}
                  {/* Label */}
                  <circle cx="92" cy="92" r="26" fill={rec.labelBg}/>
                  <circle cx="92" cy="92" r="4"  fill={rec.dark}/>
                  <text x="92" y="84" textAnchor="middle" fill={rec.labelText}
                    fontSize="6.5" fontFamily="monospace" fontWeight="bold" letterSpacing="0.5">
                    RTE 9 RECORDS
                  </text>
                  <text x="92" y="96" textAnchor="middle" fill={rec.labelText}
                    fontSize="7.5" fontFamily="monospace" fontWeight="bold">
                    {rec.side}
                  </text>
                  <text x="92" y="106" textAnchor="middle" fill={rec.labelText}
                    fontSize="5.5" fontFamily="monospace" opacity="0.7">
                    33⅓ RPM
                  </text>
                </g>

                {/* Album sleeve */}
                <rect x="0" y="0" width="190" height="190" rx="3" fill={rec.bg}/>

                {/* Cover art */}
                <g style={{ clipPath: "inset(0 0 0 0 round 3px)" }}>
                  <svg viewBox="0 0 200 200" x="0" y="0" width="190" height="190">
                    <CoverArt accent={rec.accent} dark={rec.dark} />
                  </svg>
                </g>

                {/* Title band at bottom of sleeve */}
                <rect x="0" y="154" width="190" height="36" rx="0"
                  fill={rec.dark} opacity="0.82"/>
                <text x="8" y="168" fill={rec.accent}
                  fontSize="8" fontFamily="monospace" fontWeight="bold"
                  letterSpacing="0.8" opacity="0.9">
                  {rec.artist}
                </text>
                <text x="8" y="181" fill="rgba(255,255,255,0.62)"
                  fontSize="7" fontFamily="monospace" letterSpacing="0.4">
                  {rec.album}
                </text>

                {/* Sleeve spine edge highlight */}
                <line x1="0" y1="0" x2="0" y2="190" stroke="rgba(255,255,255,0.06)" strokeWidth="1.5"/>
                <line x1="0" y1="0" x2="190" y2="0" stroke="rgba(255,255,255,0.05)" strokeWidth="1"/>
              </g>
            );
          })}

          {/* ── FRONT CRATE FRAME (overlaps bottom of records) ── */}
          <rect x="42" y="310" width="696" height="32" rx="4" fill="#3a2010"/>
          {/* Front slats */}
          {[0,1,2].map(n => (
            <rect key={n} x="48" y={314 + n * 8} width="684" height="4"
              fill="#2a1608" opacity="0.5"/>
          ))}
          {/* Route 9 Records branding on crate front */}
          <rect x="300" y="316" width="180" height="22" rx="3"
            fill="rgba(0,0,0,0.4)" stroke="rgba(212,104,42,0.22)" strokeWidth="0.8"/>
          <text x="390" y="331" textAnchor="middle"
            fill="rgba(212,104,42,0.65)" fontSize="8"
            fontFamily="monospace" fontWeight="bold" letterSpacing="1.5">
            ROUTE 9 RECORDS · SHREWSBURY
          </text>

          {/* ── CRATE HANDLES ── */}
          <rect x="90"  y="30" width="80" height="12" rx="6" fill="#4a2a12" stroke="#5c3618" strokeWidth="1"/>
          <rect x="610" y="30" width="80" height="12" rx="6" fill="#4a2a12" stroke="#5c3618" strokeWidth="1"/>

          {/* ── SHADOW UNDER CRATE ── */}
          <ellipse cx="390" cy="346" rx="330" ry="14" fill="rgba(0,0,0,0.45)"/>
        </svg>
      </div>

      {/* Caption */}
      <p style={{
        textAlign: "center", marginTop: "1.5rem",
        fontSize: "10px", letterSpacing: "0.14em",
        color: "rgba(243,233,213,0.18)", fontFamily: "monospace",
        opacity: revealed ? 1 : 0,
        transition: "opacity 0.5s ease 0.9s",
      }}>
        Every sleeve tells a story. Read the reviews below.
      </p>
    </div>
  );
}
