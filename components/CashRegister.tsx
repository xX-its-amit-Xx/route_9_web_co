"use client";

import { useState, useEffect, useRef } from "react";

// ── CashRegister ───────────────────────────────────────────────────────────
//
// Vintage 1950s brass-and-walnut cash register (SVG viewBox 480×520).
// IntersectionObserver fires a state machine: receipt lines print one by one
// at 850ms intervals, then a CHING! flash + drawer slide-open when the total
// appears. Cycle repeats every ~7 seconds.
//
// Placed between Pricing and NeonSign.

const ITEMS = [
  { label: "DESIGN PREVIEW  ", value: "FREE"         },
  { label: "SITE BUILD      ", value: "$0 UP FRONT"  },
  { label: "LIVE IN         ", value: "48 HOURS"     },
  { label: "CARE PLAN       ", value: "$79/MO"       },
  { label: "YOU OWN IT      ", value: "ALWAYS"       },
] as const;

// Receipt paper geometry (SVG units)
const PX = 168;   // paper left-x
const PW = 144;   // paper width
const PY = 96;    // paper top-y (emerges from slot)
const LH = 15;    // line height per receipt item
const HH = 26;    // receipt header height (logo + rule)

export function CashRegister() {
  const sectionRef  = useRef<HTMLElement>(null);
  const [count,   setCount]   = useState(0);          // items printed so far
  const [flash,   setFlash]   = useState(false);      // CHING! white flash
  const [drawer,  setDrawer]  = useState(false);      // cash drawer open
  const [running, setRunning] = useState(false);      // animation started

  // Start on first scroll into view
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setRunning(true); obs.disconnect(); } },
      { threshold: 0.25 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // State machine: advance count → CHING → reset
  useEffect(() => {
    if (!running) return;

    if (count < ITEMS.length) {
      const t = setTimeout(() => setCount(c => c + 1), 850);
      return () => clearTimeout(t);
    }

    // All items printed — fire CHING after brief pause
    const t1 = setTimeout(() => {
      setFlash(true);
      setDrawer(true);
      setTimeout(() => setFlash(false), 300);
    }, 700);

    // Reset and repeat
    const t2 = setTimeout(() => {
      setCount(0);
      setDrawer(false);
    }, 4800);

    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [running, count]);

  // Paper grows as items are printed
  const paperH = count > 0
    ? HH + count * LH + (count >= ITEMS.length ? LH * 3 + 6 : 0)
    : 2;

  // LCD display text
  const displayText =
    count === 0          ? "ROUTE 9 WEB CO."      :
    count < ITEMS.length ? (ITEMS[count - 1]?.value ?? "") :
                           "TOTAL: PRICELESS";

  const displaySub =
    count >= ITEMS.length ? "** THANK  YOU **"     :
    count > 0             ? ITEMS[count - 1]?.label.trim() ?? "" :
                            "SHREWSBURY  ·  MA";

  return (
    <section
      ref={sectionRef}
      style={{ background: "#060402", padding: "84px 0 76px" }}
      aria-label="Route 9 Web Co. — service value summary"
    >
      <div className="max-w-lg mx-auto px-4">

        {/* Pill label */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "1.75rem" }}>
          <span className="label-pill">Ring It Up</span>
        </div>

        {/* Full-screen CHING flash */}
        {flash && (
          <div style={{
            position: "fixed", inset: 0,
            background: "rgba(255,230,120,0.16)",
            pointerEvents: "none", zIndex: 9999,
            transition: "opacity 0.3s",
          }} aria-hidden="true" />
        )}

        <svg
          viewBox="0 0 480 520"
          preserveAspectRatio="xMidYMid meet"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ display: "block", width: "100%", height: "auto" }}
          role="img"
          aria-label={`Cash register receipt: ${ITEMS.map(i => `${i.label.trim()} ${i.value}`).join(", ")}`}
        >
          <defs>
            {/* Walnut cabinet grain */}
            <pattern id="cr-wood" x="0" y="0" width="10" height="10"
              patternUnits="userSpaceOnUse" patternTransform="rotate(15)">
              <rect width="10" height="10" fill="#4C2606" />
              <rect x="0" y="0" width="1.6" height="10" fill="rgba(0,0,0,0.18)" />
              <rect x="5.5" y="0" width="0.9" height="10" fill="rgba(0,0,0,0.09)" />
              <rect x="8.5" y="0" width="0.4" height="10" fill="rgba(255,255,255,0.04)" />
            </pattern>

            {/* Brass shine */}
            <radialGradient id="cr-brass" cx="32%" cy="28%" r="68%">
              <stop offset="0%"   stopColor="#F0D070" />
              <stop offset="45%"  stopColor="#C8A038" />
              <stop offset="100%" stopColor="#7A5C14" />
            </radialGradient>

            {/* Dark brass (shadow side) */}
            <radialGradient id="cr-brass-dk" cx="70%" cy="70%" r="60%">
              <stop offset="0%"   stopColor="#C8A038" />
              <stop offset="100%" stopColor="#5A3C08" />
            </radialGradient>

            {/* Chrome knob */}
            <radialGradient id="cr-chrome" cx="35%" cy="30%" r="65%">
              <stop offset="0%"   stopColor="#DDD0A8" />
              <stop offset="55%"  stopColor="#9A8450" />
              <stop offset="100%" stopColor="#4A3818" />
            </radialGradient>

            {/* LCD screen glow */}
            <radialGradient id="cr-lcd" cx="50%" cy="50%" r="55%">
              <stop offset="0%"   stopColor="rgba(34,204,68,0.14)" />
              <stop offset="100%" stopColor="transparent" />
            </radialGradient>

            {/* Cabinet drop shadow */}
            <filter id="cr-drop" x="-8%" y="-6%" width="120%" height="122%">
              <feDropShadow dx="0" dy="10" stdDeviation="14"
                floodColor="rgba(0,0,0,0.65)" />
            </filter>

            {/* Receipt paper clip — grows with count */}
            <clipPath id="cr-clip">
              <rect x={PX - 2} y={PY} width={PW + 4} height={paperH} />
            </clipPath>
          </defs>

          {/* ══ TOP FLAG DISPLAY ══ */}
          {/* Left post */}
          <rect x="184" y="10" width="9" height="78" rx="4.5" fill="url(#cr-brass)" />
          <rect x="287" y="10" width="9" height="78" rx="4.5" fill="url(#cr-brass)" />

          {/* Flag panel */}
          <rect x="182" y="10" width="116" height="56" rx="7" fill="#08180A" />
          <rect x="182" y="10" width="116" height="56" rx="7" fill="none"
            stroke="#C8A038" strokeWidth="2.5" />
          {/* Flag LCD text */}
          <text x="240" y="34" textAnchor="middle"
            fill="#22CC44" fontSize="10" letterSpacing="1.5"
            fontFamily="'Courier New', Courier, monospace" fontWeight="700">
            ROUTE 9
          </text>
          <text x="240" y="52" textAnchor="middle"
            fill="#22CC44" fontSize="9" letterSpacing="1"
            fontFamily="'Courier New', Courier, monospace">
            WEB CO.
          </text>

          {/* Post balls */}
          <circle cx="188" cy="86" r="11" fill="url(#cr-brass)" />
          <circle cx="292" cy="86" r="11" fill="url(#cr-brass)" />

          {/* ══ MAIN CABINET ══ */}
          <rect x="20" y="88" width="440" height="386" rx="12"
            fill="url(#cr-wood)" filter="url(#cr-drop)" />
          {/* Outer edge */}
          <rect x="20" y="88" width="440" height="386" rx="12"
            fill="none" stroke="#260E02" strokeWidth="3.5" />
          {/* Inner bevel highlight */}
          <rect x="25" y="92" width="430" height="378" rx="10"
            fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="1.5" />

          {/* ══ RECEIPT SLOT ══ */}
          <rect x={PX} y="88" width={PW} height="16" rx="3" fill="#0A0604" />
          <rect x={PX} y="88" width={PW} height="16" rx="3" fill="none"
            stroke="#7A5C14" strokeWidth="1.2" />

          {/* ══ RECEIPT PAPER (clipped to grow with count) ══ */}
          <g clipPath="url(#cr-clip)">
            {/* Paper body */}
            <rect x={PX} y={PY} width={PW} height={HH + ITEMS.length * LH + LH * 3 + 20}
              fill="#FDFAF3" />
            {/* Left edge shadow strip */}
            <rect x={PX} y={PY} width="4" height={HH + ITEMS.length * LH + LH * 3 + 20}
              fill="rgba(0,0,0,0.07)" />
            {/* Right edge shadow */}
            <rect x={PX + PW - 3} y={PY} width="3"
              height={HH + ITEMS.length * LH + LH * 3 + 20}
              fill="rgba(0,0,0,0.05)" />

            {/* Receipt header */}
            <text x={PX + PW / 2} y={PY + 10} textAnchor="middle"
              fill="#1A1008" fontSize="7" letterSpacing="1.5"
              fontFamily="'Courier New', Courier, monospace" fontWeight="700">
              ROUTE 9 WEB CO.
            </text>
            <line x1={PX + 8} y1={PY + 14} x2={PX + PW - 8} y2={PY + 14}
              stroke="#8A7040" strokeWidth="0.8" strokeDasharray="2,2" />
            <text x={PX + PW / 2} y={PY + 22} textAnchor="middle"
              fill="#8A7040" fontSize="5.5" letterSpacing="1"
              fontFamily="'Courier New', Courier, monospace">
              SHREWSBURY, MA
            </text>

            {/* Line items — revealed one per count increment */}
            {ITEMS.map((item, i) => {
              const y = PY + HH + i * LH + 10;
              return (
                <g key={i} opacity={i < count ? 1 : 0}>
                  <text x={PX + 6} y={y}
                    fill="#1A1008" fontSize="6.5" letterSpacing="0.2"
                    fontFamily="'Courier New', Courier, monospace">
                    {item.label}
                  </text>
                  <text x={PX + PW - 6} y={y} textAnchor="end"
                    fill="#1A1008" fontSize="6.5" letterSpacing="0.2"
                    fontFamily="'Courier New', Courier, monospace" fontWeight="700">
                    {item.value}
                  </text>
                </g>
              );
            })}

            {/* Total section — visible when all items printed */}
            <g opacity={count >= ITEMS.length ? 1 : 0}>
              <line
                x1={PX + 6} y1={PY + HH + ITEMS.length * LH + 4}
                x2={PX + PW - 6} y2={PY + HH + ITEMS.length * LH + 4}
                stroke="#8A7040" strokeWidth="1" />
              <line
                x1={PX + 6} y1={PY + HH + ITEMS.length * LH + 7}
                x2={PX + PW - 6} y2={PY + HH + ITEMS.length * LH + 7}
                stroke="#8A7040" strokeWidth="0.5" />
              <text
                x={PX + 6}
                y={PY + HH + ITEMS.length * LH + 19}
                fill="#1A1008" fontSize="7.5" letterSpacing="0.3"
                fontFamily="'Courier New', Courier, monospace" fontWeight="700">
                TOTAL VALUE
              </text>
              <text
                x={PX + PW - 6}
                y={PY + HH + ITEMS.length * LH + 19}
                textAnchor="end"
                fill="#B83808" fontSize="7.5" letterSpacing="0.3"
                fontFamily="'Courier New', Courier, monospace" fontWeight="700">
                PRICELESS
              </text>
              <text
                x={PX + PW / 2}
                y={PY + HH + ITEMS.length * LH + 33}
                textAnchor="middle"
                fill="#8A7040" fontSize="5.5" letterSpacing="2"
                fontFamily="'Courier New', Courier, monospace">
                * THANK  YOU *
              </text>
            </g>
          </g>

          {/* Paper roll holder (left side of cabinet) */}
          <ellipse cx="50" cy="112" rx="20" ry="20" fill="#2A1204" />
          <ellipse cx="50" cy="112" rx="15" ry="15" fill="#FDFAF3" opacity="0.75" />
          <ellipse cx="50" cy="112" rx="7"  ry="7"  fill="#3A1A08" />

          {/* ══ LCD DISPLAY WINDOW ══ */}
          {/* Bezel */}
          <rect x="68" y="120" width="344" height="60" rx="7" fill="#180E04" />
          <rect x="68" y="120" width="344" height="60" rx="7" fill="none"
            stroke="#C8A038" strokeWidth="2.5" />
          {/* Screen */}
          <rect x="74" y="126" width="332" height="48" rx="5" fill="#080F06" />
          <rect x="74" y="126" width="332" height="48" rx="5" fill="url(#cr-lcd)" />
          {/* Scan lines */}
          {[0,1,2,3,4,5].map(li => (
            <line key={li} x1="75" y1={127 + li * 8} x2="405" y2={127 + li * 8}
              stroke="rgba(0,0,0,0.22)" strokeWidth="1" />
          ))}
          {/* Display text */}
          <text x="240" y="147" textAnchor="middle"
            fill="#22CC44" fontSize="11" letterSpacing="2.5"
            fontFamily="'Courier New', Courier, monospace" fontWeight="700">
            {displayText}
          </text>
          <text x="240" y="163" textAnchor="middle"
            fill="rgba(34,204,68,0.50)" fontSize="9" letterSpacing="1.5"
            fontFamily="'Courier New', Courier, monospace">
            {displaySub}
          </text>

          {/* ══ KEY PANEL ══ */}
          {/* Panel plate */}
          <rect x="44" y="196" width="392" height="184" rx="7" fill="#3A1804" />
          <rect x="44" y="196" width="392" height="184" rx="7" fill="none"
            stroke="#7A5014" strokeWidth="1.5" />

          {/* Row 1: 5 brass service keys */}
          {(["BUILD","DESIGN","LAUNCH","CARE","YOURS"] as const).map((label, ki) => {
            const kx = 56 + ki * 74;
            const ky = 208;
            const lit = ki < count;
            return (
              <g key={ki}>
                {/* Key depth shadow */}
                <rect x={kx + 2} y={ky + 5} width={60} height={30} rx="5"
                  fill="rgba(0,0,0,0.45)" />
                {/* Key face */}
                <rect x={kx} y={ky} width={60} height={30} rx="5"
                  fill={lit ? "#F0D870" : "url(#cr-brass)"} />
                {/* Gloss highlight */}
                <rect x={kx + 4} y={ky + 3} width={52} height={11} rx="3"
                  fill="rgba(255,255,255,0.20)" />
                {/* Key label */}
                <text x={kx + 30} y={ky + 20} textAnchor="middle"
                  fill={lit ? "#1A0A00" : "#2C1604"} fontSize="7.5" letterSpacing="0.5"
                  fontFamily="'Courier New', Courier, monospace" fontWeight="700">
                  {label}
                </text>
              </g>
            );
          })}

          {/* Row 2–4: numeric keys (5 per row × 3 rows) */}
          {(["7","8","9","/","CLR","4","5","6","-","TAB","1","2","3","+","ENT"] as const)
            .map((label, ki) => {
              const col = ki % 5;
              const row = Math.floor(ki / 5);
              const kx  = 56  + col * 74;
              const ky  = 256 + row * 38;
              return (
                <g key={ki}>
                  <rect x={kx + 2} y={ky + 4} width={54} height={26} rx="4"
                    fill="rgba(0,0,0,0.35)" />
                  <rect x={kx} y={ky} width={54} height={26} rx="4"
                    fill="#5E2E08" />
                  <rect x={kx + 3} y={ky + 3} width={48} height={9} rx="2"
                    fill="rgba(255,255,255,0.09)" />
                  <text x={kx + 27} y={ky + 17} textAnchor="middle"
                    fill="rgba(240,190,80,0.65)" fontSize="8.5" letterSpacing="0"
                    fontFamily="'Courier New', Courier, monospace">
                    {label}
                  </text>
                </g>
              );
            })}

          {/* ══ CASH DRAWER (slides open on CHING) ══ */}
          <g style={{
            transform: drawer ? "translateX(18px)" : "translateX(0)",
            transition: "transform 0.45s cubic-bezier(0.34,1.56,0.64,1)",
          }}>
            <rect x="28" y="386" width="424" height="66" rx="7" fill="#3A1804" />
            <rect x="28" y="386" width="424" height="66" rx="7" fill="none"
              stroke="#7A5014" strokeWidth="1.5" />
            {/* Compartment dividers */}
            {[1,2,3,4].map(di => (
              <line key={di}
                x1={28 + di * 84} y1={392}
                x2={28 + di * 84} y2={446}
                stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
            ))}
            {/* Drawer handle — centered chrome bar */}
            <rect x="200" y="409" width="80" height="16" rx="8" fill="url(#cr-chrome)" />
            {/* Handle shadow */}
            <rect x="204" y="415" width="72" height="6" rx="3"
              fill="rgba(0,0,0,0.25)" />
          </g>

          {/* ══ CABINET LEGS ══ */}
          <rect x="54"  y="450" width="26" height="44" rx="5" fill="#280E02" />
          <rect x="400" y="450" width="26" height="44" rx="5" fill="#280E02" />
          {/* Foot pads */}
          <rect x="46"  y="490" width="42" height="7" rx="3.5" fill="#180804" />
          <rect x="392" y="490" width="42" height="7" rx="3.5" fill="#180804" />

          {/* Side trim rings on legs */}
          <rect x="54"  y="462" width="26" height="4" rx="2" fill="url(#cr-brass-dk)" />
          <rect x="400" y="462" width="26" height="4" rx="2" fill="url(#cr-brass-dk)" />

          {/* ══ CHING! TEXT ══ */}
          {flash && (
            <text x="240" y="76" textAnchor="middle"
              fill="#FFD142" fontSize="26" letterSpacing="3"
              fontFamily="Georgia, 'Palatino Linotype', serif" fontWeight="700">
              CHING!
            </text>
          )}

        </svg>

        {/* CTA */}
        <div style={{ display: "flex", justifyContent: "center", marginTop: "2rem" }}>
          <a
            href="#contact"
            style={{
              display: "inline-block",
              padding: "0.7rem 2.25rem",
              border: "2px solid rgba(200,160,56,0.55)",
              color: "#C8A038",
              fontFamily: "'Courier New', Courier, monospace",
              fontSize: "0.8125rem",
              letterSpacing: "0.18em",
              textDecoration: "none",
              textTransform: "uppercase",
              transition: "border-color 0.25s, background 0.25s",
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLAnchorElement).style.background = "rgba(200,160,56,0.10)";
              (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(200,160,56,0.9)";
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLAnchorElement).style.background = "transparent";
              (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(200,160,56,0.55)";
            }}
          >
            Ring Me Up →
          </a>
        </div>
      </div>
    </section>
  );
}
