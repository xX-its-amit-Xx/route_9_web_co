"use client";

import { useState, useEffect } from "react";

// ── Retro 1950s Television — Route 9 Web Co. "commercial" broadcast ───────────
//
// A hand-illustrated vintage TV set (viewBox 560×430) that cycles through five
// "broadcast slides" at 4-second intervals. Between slides, the screen briefly
// flashes white (channel-change static) before the new content fades in.
//
// Illustration layers:
//   1. Wood-grain walnut cabinet with round-corner rect
//   2. Curved screen bezel + glass (dark fill + scanline pattern overlay)
//   3. Right-panel controls: three chrome dials, vertical speaker grille slats
//   4. Rabbit-ear antenna (two angled lines + ball joint)
//   5. Four tapered legs
//   6. Brand name embossed on cabinet bottom
//
// Screen content (inside glass area, 318×237 at x=30,y=47):
//   - Channel identifier in courier mono
//   - Large slide-specific icon (route shield, clock, $, eye, checkmark)
//   - Headline in Palatino serif
//   - Two-line body copy
//
// Transitions: React state `fade` drives opacity 0→1 CSS transition.
// No CSS keyframes added — self-contained via inline transition style.
// Static flash: brief white rect over screen glass for 200ms.

type Slide = { ch: string; title: string; body1: string; body2: string };

const SLIDES: Slide[] = [
  { ch: "CHANNEL  9",  title: "ROUTE 9 WEB CO.",  body1: "Websites for the shops",   body2: "that make this town great."    },
  { ch: "48  HOURS",   title: "LIVE BY FRIDAY",    body1: "Your site goes live before", body2: "the weekend is over."         },
  { ch: "$79 / MO",    title: "CARE  PLAN",        body1: "We handle updates.",        body2: "You handle business."         },
  { ch: "FREE",        title: "DESIGN PREVIEW",    body1: "See your new site",         body2: "before spending a cent."      },
  { ch: "YOURS",       title: "YOU  OWN  IT",      body1: "No contracts.",             body2: "Leave anytime. All yours."    },
];

// Screen icon center
const ICX = 189;
const ICY = 138;

// Road-dash rows for the "Channel 9" route-shield slide
const SHIELD_ROAD = [0, 16, 32, 48, 64, 80, 96, 112, 128, 144, 160, 176].map(x => x);

export function RetroTV() {
  const [slide, setSlide]       = useState(0);
  const [fade, setFade]         = useState(true);
  const [showStatic, setStatic] = useState(false);

  useEffect(() => {
    const id = setInterval(() => {
      setFade(false);
      setStatic(true);
      setTimeout(() => {
        setSlide(s => (s + 1) % SLIDES.length);
        setStatic(false);
        setFade(true);
      }, 210);
    }, 4200);
    return () => clearInterval(id);
  }, []);

  const s = SLIDES[slide] ?? SLIDES[0];

  return (
    <section
      style={{ background: "#060403", padding: "60px 0 68px" }}
      aria-label="Route 9 Web Co. — broadcast highlights"
    >
      <div className="max-w-xl mx-auto px-4">
        {/* Label */}
        <div className="flex justify-center mb-5">
          <span className="label-pill">On The Air</span>
        </div>

        {/* TV */}
        <svg
          viewBox="0 0 560 430"
          preserveAspectRatio="xMidYMid meet"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ display: "block", width: "100%", height: "auto" }}
          role="img"
          aria-label={`Route 9 Web Co. commercial: ${s.title} — ${s.body1} ${s.body2}`}
        >
          <defs>
            {/* Wood grain: warm walnut base + angled fiber lines */}
            <pattern id="tv-wood" x="0" y="0" width="9" height="9"
              patternUnits="userSpaceOnUse" patternTransform="rotate(10)">
              <rect width="9" height="9" fill="#5E3210" />
              <rect x="0" y="0" width="1.2" height="9" fill="rgba(0,0,0,0.10)" />
              <rect x="4" y="0" width="0.6" height="9" fill="rgba(0,0,0,0.06)" />
            </pattern>

            {/* Scan lines: thin horizontal rows */}
            <pattern id="tv-scan" x="0" y="0" width="2" height="5"
              patternUnits="userSpaceOnUse">
              <rect x="0" y="0" width="2" height="2" fill="rgba(0,0,0,0.18)" />
            </pattern>

            {/* Screen curvature vignette */}
            <radialGradient id="tv-vignette" cx="50%" cy="50%" r="58%">
              <stop offset="0%"   stopColor="rgba(0,0,0,0)"    />
              <stop offset="100%" stopColor="rgba(0,0,0,0.55)" />
            </radialGradient>

            {/* Screen phosphor glow */}
            <radialGradient id="tv-phosphor" cx="50%" cy="50%" r="70%">
              <stop offset="0%"   stopColor="rgba(200,240,180,0.06)" />
              <stop offset="100%" stopColor="rgba(0,0,0,0)"          />
            </radialGradient>

            {/* Chrome knob gradient */}
            <radialGradient id="tv-chrome" cx="38%" cy="32%" r="60%">
              <stop offset="0%"   stopColor="#D4C090" />
              <stop offset="55%"  stopColor="#7C6030" />
              <stop offset="100%" stopColor="#3C2C10" />
            </radialGradient>

            {/* Cabinet bevel shadow (top edge lighter) */}
            <linearGradient id="tv-cab-grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"   stopColor="rgba(255,255,255,0.10)" />
              <stop offset="40%"  stopColor="rgba(0,0,0,0)"          />
              <stop offset="100%" stopColor="rgba(0,0,0,0.30)"       />
            </linearGradient>
          </defs>

          {/* ── CABINET BODY ── */}
          <rect x="10" y="22" width="540" height="336" rx="26" fill="url(#tv-wood)" />
          <rect x="10" y="22" width="540" height="336" rx="26" fill="url(#tv-cab-grad)" />
          {/* Cabinet rim highlight */}
          <rect x="10" y="22" width="540" height="336" rx="26"
            fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1.5" />
          {/* Inner shadow recession */}
          <rect x="14" y="26" width="532" height="328" rx="24"
            fill="none" stroke="rgba(0,0,0,0.25)" strokeWidth="2" />

          {/* ── SCREEN BEZEL ── */}
          <rect x="22" y="36" width="332" height="286" rx="16" fill="#3A1E08" />
          {/* Bezel inner lip */}
          <rect x="26" y="40" width="324" height="278" rx="13" fill="#220E04" />

          {/* ── SCREEN GLASS ── */}
          <rect x="30" y="47" width="318" height="237" rx="10" fill="#060403" />

          {/* ── SCREEN CONTENT ── */}
          {/* Phosphor ambient tint */}
          <rect x="30" y="47" width="318" height="237" rx="10" fill="url(#tv-phosphor)" />

          {/* Content — fades on slide transition */}
          <g style={{ opacity: fade ? 1 : 0, transition: "opacity 0.22s ease" }}>

            {/* Channel ID */}
            <text
              x={ICX} y="78"
              textAnchor="middle"
              fontSize="9.5"
              fontFamily="'Courier New',Courier,monospace"
              fontWeight="700"
              letterSpacing="0.28em"
              fill="rgba(200,230,180,0.55)"
            >
              {s.ch}
            </text>

            {/* Horizontal rule */}
            <line x1="70" y1="87" x2="308" y2="87"
              stroke="rgba(180,220,160,0.18)" strokeWidth="0.8" />

            {/* ── Slide-specific icon ── */}

            {/* Slide 0: Route 9 highway shield */}
            {slide === 0 && (
              <g>
                <path
                  d="M189,98 C189,98 161,106 161,122 C161,136 189,152 189,152 C189,152 217,136 217,122 C217,106 189,98 189,98Z"
                  fill="rgba(28,100,56,0.45)" stroke="rgba(100,220,140,0.65)" strokeWidth="1.8"
                />
                <text x={ICX} y="130" textAnchor="middle" fontSize="22" fontWeight="900"
                  fontFamily="Arial,sans-serif" fill="rgba(255,255,255,0.88)">9</text>
                {/* Road below shield */}
                <rect x="60" y="158" width="260" height="8" rx="2" fill="rgba(50,35,15,0.70)" />
                {SHIELD_ROAD.filter((_,i) => i % 2 === 0).map(x => (
                  <rect key={x} x={70 + x} y="160" width="10" height="4" rx="1"
                    fill="rgba(255,220,80,0.50)" />
                ))}
              </g>
            )}

            {/* Slide 1: Clock (48 hrs) */}
            {slide === 1 && (
              <g>
                <circle cx={ICX} cy={ICY} r="30" fill="none"
                  stroke="rgba(255,220,100,0.60)" strokeWidth="2" />
                {/* Tick marks */}
                {[0,30,60,90,120,150,180,210,240,270,300,330].map(deg => {
                  const rad = (deg - 90) * Math.PI / 180;
                  const r1 = 24; const r2 = 28;
                  return (
                    <line key={deg}
                      x1={ICX + r1 * Math.cos(rad)} y1={ICY + r1 * Math.sin(rad)}
                      x2={ICX + r2 * Math.cos(rad)} y2={ICY + r2 * Math.sin(rad)}
                      stroke="rgba(255,220,100,0.35)" strokeWidth={deg % 90 === 0 ? "1.8" : "1"}
                    />
                  );
                })}
                {/* Hour hand → pointing to ~10 o'clock */}
                <line x1={ICX} y1={ICY}
                  x2={ICX - 14} y2={ICY - 18}
                  stroke="rgba(255,220,100,0.85)" strokeWidth="2.5" strokeLinecap="round" />
                {/* Minute hand → pointing to 12 */}
                <line x1={ICX} y1={ICY}
                  x2={ICX} y2={ICY - 24}
                  stroke="rgba(255,220,100,0.85)" strokeWidth="2" strokeLinecap="round" />
                <circle cx={ICX} cy={ICY} r="3" fill="rgba(255,220,100,0.85)" />
                <text x={ICX} y="178" textAnchor="middle" fontSize="8.5"
                  fontFamily="'Courier New',monospace" letterSpacing="0.18em"
                  fill="rgba(255,220,100,0.55)">48 HOURS</text>
              </g>
            )}

            {/* Slide 2: Dollar sign */}
            {slide === 2 && (
              <g>
                <circle cx={ICX} cy={ICY} r="30" fill="rgba(60,160,80,0.12)"
                  stroke="rgba(80,200,100,0.50)" strokeWidth="2" />
                <text x={ICX} y="150" textAnchor="middle" fontSize="38" fontWeight="900"
                  fontFamily="Georgia,'Times New Roman',serif"
                  fill="rgba(100,220,120,0.82)">$</text>
              </g>
            )}

            {/* Slide 3: Eye (free preview) */}
            {slide === 3 && (
              <g>
                {/* Eye whites */}
                <ellipse cx={ICX} cy={ICY} rx="34" ry="22"
                  fill="none" stroke="rgba(255,200,100,0.58)" strokeWidth="2" />
                {/* Iris */}
                <circle cx={ICX} cy={ICY} r="14"
                  fill="rgba(255,200,100,0.15)" stroke="rgba(255,200,100,0.65)" strokeWidth="1.5" />
                {/* Pupil */}
                <circle cx={ICX} cy={ICY} r="7" fill="rgba(255,200,100,0.72)" />
                {/* Specular highlight */}
                <circle cx={ICX - 5} cy={ICY - 5} r="3" fill="rgba(255,255,255,0.55)" />
                {/* Lashes */}
                {[-24,-12,0,12,24].map(dx => (
                  <line key={dx}
                    x1={ICX + dx} y1={ICY - 22}
                    x2={ICX + dx * 0.7} y2={ICY - 28}
                    stroke="rgba(255,200,100,0.40)" strokeWidth="1.2" strokeLinecap="round" />
                ))}
              </g>
            )}

            {/* Slide 4: Checkmark in circle */}
            {slide === 4 && (
              <g>
                <circle cx={ICX} cy={ICY} r="30" fill="rgba(60,160,80,0.12)"
                  stroke="rgba(80,200,100,0.55)" strokeWidth="2" />
                <path
                  d="M170,138 L184,154 L210,118"
                  stroke="rgba(100,220,120,0.88)" strokeWidth="3.5"
                  strokeLinecap="round" strokeLinejoin="round" />
              </g>
            )}

            {/* Slide headline */}
            <text
              x={ICX} y="200"
              textAnchor="middle"
              fontSize="22"
              fontFamily="'Palatino Linotype','Palatino','Book Antiqua',Georgia,serif"
              fontWeight="900"
              letterSpacing="0.04em"
              fill="rgba(255,235,185,0.90)"
            >
              {s.title}
            </text>

            {/* Body line 1 */}
            <text
              x={ICX} y="222"
              textAnchor="middle"
              fontSize="10.5"
              fontFamily="Georgia,'Times New Roman',serif"
              fontStyle="italic"
              fill="rgba(220,200,160,0.65)"
            >
              {s.body1}
            </text>

            {/* Body line 2 */}
            <text
              x={ICX} y="237"
              textAnchor="middle"
              fontSize="10.5"
              fontFamily="Georgia,'Times New Roman',serif"
              fontStyle="italic"
              fill="rgba(220,200,160,0.58)"
            >
              {s.body2}
            </text>

            {/* Slide indicator dots */}
            {SLIDES.map((_, i) => (
              <circle
                key={i}
                cx={ICX - (SLIDES.length - 1) * 7 + i * 14}
                cy="272"
                r="3"
                fill={i === slide ? "rgba(200,220,180,0.70)" : "rgba(200,220,180,0.20)"}
              />
            ))}
          </g>

          {/* Static flash overlay */}
          {showStatic && (
            <rect x="30" y="47" width="318" height="237" rx="10"
              fill="rgba(220,220,200,0.82)" />
          )}

          {/* Scan lines always on top */}
          <rect x="30" y="47" width="318" height="237" rx="10"
            fill="url(#tv-scan)" style={{ pointerEvents: "none" }} />

          {/* Screen vignette */}
          <rect x="30" y="47" width="318" height="237" rx="10"
            fill="url(#tv-vignette)" style={{ pointerEvents: "none" }} />

          {/* ── RIGHT CONTROL PANEL ── */}
          <rect x="360" y="36" width="174" height="286" rx="12" fill="#4A2A0E" />
          <rect x="364" y="40" width="166" height="278" rx="10"
            fill="none" stroke="rgba(0,0,0,0.20)" strokeWidth="1" />

          {/* Panel divider from screen */}
          <line x1="360" y1="40" x2="360" y2="318"
            stroke="rgba(0,0,0,0.35)" strokeWidth="2" />

          {/* "ROUTE 9" brand on panel top */}
          <text x="447" y="64" textAnchor="middle" fontSize="8"
            fontFamily="'Courier New',monospace" fontWeight="700"
            letterSpacing="0.20em" fill="rgba(255,200,100,0.40)">ROUTE 9</text>
          <line x1="375" y1="70" x2="520" y2="70"
            stroke="rgba(255,200,100,0.15)" strokeWidth="0.8" />

          {/* ── Speaker grille ── */}
          <rect x="376" y="78" width="142" height="112" rx="4" fill="rgba(0,0,0,0.22)" />
          {[6,14,22,30,38,46,54,62,70,78,86,94,102,110].map(dy => (
            <line key={dy}
              x1="380" y1={78 + dy}
              x2="514" y2={78 + dy}
              stroke="rgba(0,0,0,0.40)" strokeWidth="1.2" />
          ))}
          {/* Speaker cloth texture */}
          <rect x="376" y="78" width="142" height="112" rx="4"
            fill="rgba(40,22,8,0.55)" />

          {/* ── Channel dial ── */}
          <circle cx="447" cy="228" r="28" fill="#2A1808" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
          <circle cx="447" cy="228" r="22" fill="url(#tv-chrome)" />
          {/* Dial notch marker */}
          <line x1="447" y1="210" x2="447" y2="216"
            stroke="rgba(0,0,0,0.55)" strokeWidth="2.5" strokeLinecap="round" />
          {/* Dial tick marks */}
          {[0,30,60,90,120,150,180,210,240,270,300,330].map(deg => {
            const rad = (deg - 90) * Math.PI / 180;
            return (
              <line key={deg}
                x1={447 + 20 * Math.cos(rad)} y1={228 + 20 * Math.sin(rad)}
                x2={447 + 23 * Math.cos(rad)} y2={228 + 23 * Math.sin(rad)}
                stroke="rgba(0,0,0,0.35)" strokeWidth="1" />
            );
          })}
          <text x="447" y="272" textAnchor="middle" fontSize="7"
            fontFamily="'Courier New',monospace" letterSpacing="0.14em"
            fill="rgba(255,190,80,0.40)">CHANNEL</text>

          {/* ── Volume knob ── */}
          <circle cx="447" cy="306" r="18" fill="#261408" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
          <circle cx="447" cy="306" r="13" fill="url(#tv-chrome)" />
          <line x1="447" y1="296" x2="447" y2="300"
            stroke="rgba(0,0,0,0.55)" strokeWidth="2" strokeLinecap="round" />
          <text x="447" y="330" textAnchor="middle" fontSize="6.5"
            fontFamily="'Courier New',monospace" letterSpacing="0.12em"
            fill="rgba(255,190,80,0.35)">VOL</text>

          {/* ── ANTENNA ── */}
          {/* Base joint */}
          <circle cx="200" cy="22" r="7" fill="#2A1808" stroke="rgba(255,255,255,0.10)" strokeWidth="1" />
          {/* Left antenna */}
          <line x1="200" y1="22" x2="120" y2="-26"
            stroke="#3C2410" strokeWidth="4" strokeLinecap="round" />
          <line x1="200" y1="22" x2="120" y2="-26"
            stroke="rgba(255,255,255,0.08)" strokeWidth="1.5" strokeLinecap="round" />
          {/* Right antenna */}
          <line x1="200" y1="22" x2="302" y2="-20"
            stroke="#3C2410" strokeWidth="4" strokeLinecap="round" />
          <line x1="200" y1="22" x2="302" y2="-20"
            stroke="rgba(255,255,255,0.08)" strokeWidth="1.5" strokeLinecap="round" />
          {/* Antenna tips */}
          <circle cx="118" cy="-27" r="4" fill="#2A1808" />
          <circle cx="304" cy="-21" r="4" fill="#2A1808" />

          {/* ── LEGS ── */}
          {[50,128,398,476].map((lx, i) => (
            <rect key={i} x={lx} y="356" width="14" height="38" rx="4"
              fill={i < 2 ? "#3A1E08" : "#3A1E08"}
              transform={`rotate(${i < 2 ? -3 : 3} ${lx + 7} 356)`} />
          ))}
          {/* Foot braces */}
          {[48,396].map(lx => (
            <rect key={lx} x={lx} y="390" width="96" height="6" rx="3" fill="#2A1408" />
          ))}

          {/* ── BRAND TEXT on cabinet bottom ── */}
          <text x="192" y="349" textAnchor="middle" fontSize="9"
            fontFamily="'Palatino Linotype',Palatino,Georgia,serif" fontWeight="700"
            letterSpacing="0.22em" fill="rgba(200,160,80,0.32)">ROUTE · 9 · WEB · CO.</text>

          {/* Cabinet foot trim */}
          <rect x="10" y="350" width="540" height="8" rx="0"
            fill="rgba(0,0,0,0.18)" />
        </svg>

        {/* Caption */}
        <p style={{
          textAlign: "center",
          marginTop: "16px",
          fontSize: "10.5px",
          color: "rgba(200,200,180,0.30)",
          fontFamily: "'Courier New', monospace",
          letterSpacing: "0.18em",
          textTransform: "uppercase",
        }}>
          Route 9 Web Co. — Broadcasting Since 2024
        </p>
      </div>
    </section>
  );
}
