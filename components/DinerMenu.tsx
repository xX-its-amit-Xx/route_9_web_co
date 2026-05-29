"use client";

import { useEffect, useRef } from "react";

// ── Route 9 Diner Chalkboard Menu ──────────────────────────────────────────
//
// Full SVG vintage chalkboard (900×520) mounted in a walnut-grain wooden frame.
// Lists three pricing "specials" with chalk texture, corner ornaments,
// decorative icons, and double-rule separators.
//
// Placed above the Pricing section as a visual teaser / scene-setter.
// IntersectionObserver triggers a smooth slide-up entrance on scroll.

export function DinerMenu() {
  const boardRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const el = boardRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("menu-visible");
          obs.disconnect();
        }
      },
      { threshold: 0.12 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section
      style={{ background: "#090E09", padding: "80px 0 60px" }}
      aria-label="Route 9 Diner — Today's Specials"
    >
      <div className="max-w-5xl mx-auto px-4">
        {/* Pill label */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "1.75rem" }}>
          <span className="label-pill">Today&rsquo;s Specials</span>
        </div>

        {/* Hanging nails above the board */}
        <div style={{ display: "flex", justifyContent: "space-between", padding: "0 8%", marginBottom: "-2px" }}>
          {[0, 1].map(i => (
            <svg key={i} width="14" height="22" viewBox="0 0 14 22" fill="none"
              aria-hidden="true">
              <circle cx="7" cy="5" r="5" fill="#C8A84B" stroke="#8A7030" strokeWidth="1.2" />
              <rect x="6" y="9" width="2" height="13" rx="1" fill="#8A7030" />
            </svg>
          ))}
        </div>

        {/* Chalkboard SVG */}
        <svg
          ref={boardRef}
          viewBox="0 0 900 520"
          preserveAspectRatio="xMidYMid meet"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ display: "block", width: "100%", height: "auto" }}
          role="img"
          aria-label="Route 9 Diner chalkboard showing three pricing specials"
          className="diner-board"
        >
          <defs>
            {/* Walnut wood grain for frame */}
            <pattern id="dm-wood" x="0" y="0" width="10" height="10"
              patternUnits="userSpaceOnUse" patternTransform="rotate(14)">
              <rect width="10" height="10" fill="#5A2E0C" />
              <rect x="0" y="0" width="1.5" height="10" fill="rgba(0,0,0,0.15)" />
              <rect x="5.5" y="0" width="0.8" height="10" fill="rgba(0,0,0,0.08)" />
              <rect x="8.5" y="0" width="0.4" height="10" fill="rgba(255,255,255,0.04)" />
            </pattern>

            {/* Board edge vignette */}
            <radialGradient id="dm-vig" cx="50%" cy="50%" r="65%">
              <stop offset="0%" stopColor="transparent" />
              <stop offset="100%" stopColor="rgba(0,0,0,0.50)" />
            </radialGradient>

            {/* Chalk displacement — gives text that hand-written wobble */}
            <filter id="dm-chalk" x="-2%" y="-10%" width="104%" height="120%">
              <feTurbulence type="fractalNoise" baseFrequency="0.03 0.06"
                numOctaves="3" seed="5" result="noise" />
              <feDisplacementMap in="SourceGraphic" in2="noise"
                scale="1.4" xChannelSelector="R" yChannelSelector="G" />
            </filter>

            {/* Subtle chalk dust on board surface */}
            <filter id="dm-dust" x="0" y="0" width="100%" height="100%">
              <feTurbulence type="fractalNoise" baseFrequency="0.7" numOctaves="2" result="n" />
              <feColorMatrix type="saturate" values="0" in="n" result="gray" />
              <feBlend in="SourceGraphic" in2="gray" mode="screen" result="b" />
              <feComposite in="b" in2="SourceGraphic" operator="in" />
            </filter>
          </defs>

          {/* ── WOODEN FRAME ── */}
          <rect x="0" y="0" width="900" height="520" rx="10" fill="url(#dm-wood)" />
          {/* Outer edge shadow */}
          <rect x="0" y="0" width="900" height="520" rx="10" fill="none"
            stroke="#2A1004" strokeWidth="4" />
          {/* Inner frame bevel highlight */}
          <rect x="5" y="5" width="890" height="510" rx="7" fill="none"
            stroke="rgba(255,255,255,0.07)" strokeWidth="1.5" />
          {/* Frame inset shadow strip */}
          <rect x="5" y="5" width="890" height="510" rx="7" fill="none"
            stroke="rgba(0,0,0,0.35)" strokeWidth="3" />

          {/* ── CHALKBOARD SURFACE ── */}
          <rect x="26" y="26" width="848" height="468" rx="3" fill="#1C3D1C" />
          {/* Chalk dust texture overlay */}
          <rect x="26" y="26" width="848" height="468" rx="3"
            fill="rgba(255,255,255,0.028)" filter="url(#dm-dust)" />
          {/* Board vignette */}
          <rect x="26" y="26" width="848" height="468" rx="3"
            fill="url(#dm-vig)" />

          {/* Chalk smudge marks — erased previous specials */}
          <ellipse cx="100" cy="280" rx="28" ry="16" fill="rgba(255,255,255,0.025)" transform="rotate(-8,100,280)" />
          <ellipse cx="820" cy="350" rx="22" ry="12" fill="rgba(255,255,255,0.020)" transform="rotate(5,820,350)" />
          <ellipse cx="450" cy="494" rx="80" ry="7" fill="rgba(255,255,255,0.018)" />

          {/* ── CORNER ORNAMENTS ── */}
          {/* Top-left */}
          <g stroke="rgba(255,255,255,0.30)" strokeWidth="1.5" fill="none" strokeLinecap="round">
            <path d="M42,38 L108,38 M42,38 L42,84" />
            <path d="M52,48 L92,48 M52,48 L52,72" />
            <circle cx="58" cy="54" r="2.5" fill="rgba(255,255,255,0.28)" stroke="none" />
          </g>
          {/* Top-right */}
          <g stroke="rgba(255,255,255,0.30)" strokeWidth="1.5" fill="none" strokeLinecap="round">
            <path d="M858,38 L792,38 M858,38 L858,84" />
            <path d="M848,48 L808,48 M848,48 L848,72" />
            <circle cx="842" cy="54" r="2.5" fill="rgba(255,255,255,0.28)" stroke="none" />
          </g>
          {/* Bottom-left */}
          <g stroke="rgba(255,255,255,0.30)" strokeWidth="1.5" fill="none" strokeLinecap="round">
            <path d="M42,482 L108,482 M42,482 L42,436" />
            <path d="M52,472 L92,472 M52,472 L52,448" />
          </g>
          {/* Bottom-right */}
          <g stroke="rgba(255,255,255,0.30)" strokeWidth="1.5" fill="none" strokeLinecap="round">
            <path d="M858,482 L792,482 M858,482 L858,436" />
            <path d="M848,472 L808,472 M848,472 L848,448" />
          </g>

          {/* ── HEADER ── */}
          {/* Venue line */}
          <text x="450" y="56" textAnchor="middle"
            fill="rgba(255,255,255,0.36)" fontSize="11" letterSpacing="7"
            fontFamily="'Courier New', Courier, monospace">
            ROUTE 9 · SHREWSBURY, MASSACHUSETTS
          </text>

          {/* Main headline */}
          <text x="450" y="110" textAnchor="middle"
            fill="#FFFAEA" fontSize="52" letterSpacing="3"
            fontFamily="Georgia, 'Palatino Linotype', 'Book Antiqua', serif"
            fontWeight="700" filter="url(#dm-chalk)">
            TODAY&apos;S SPECIALS
          </text>

          {/* Double chalk rule */}
          <line x1="88" y1="122" x2="812" y2="122"
            stroke="rgba(255,255,255,0.55)" strokeWidth="2.5" />
          <line x1="88" y1="129" x2="812" y2="129"
            stroke="rgba(255,255,255,0.18)" strokeWidth="1" />

          {/* Sub-tagline */}
          <text x="450" y="155" textAnchor="middle"
            fill="rgba(255,255,255,0.40)" fontSize="13.5" letterSpacing="2"
            fontFamily="Georgia, 'Palatino Linotype', serif" fontStyle="italic">
            Freshly built. No grease traps. Satisfaction guaranteed.
          </text>

          {/* ── COLUMN DIVIDERS ── */}
          {/* Col 1 | x=26..320  center=173  */}
          {/* Col 2 | x=320..580 center=450  */}
          {/* Col 3 | x=580..874 center=727  */}
          <line x1="320" y1="174" x2="320" y2="426"
            stroke="rgba(255,255,255,0.13)" strokeWidth="1" strokeDasharray="5,5" />
          <line x1="580" y1="174" x2="580" y2="426"
            stroke="rgba(255,255,255,0.13)" strokeWidth="1" strokeDasharray="5,5" />

          {/* ══════════════════════════════════
              SPECIAL № 01 — The Starter
              Center x = 173
          ══════════════════════════════════ */}

          {/* Plate-and-utensils icon */}
          <g transform="translate(173, 218)"
            stroke="rgba(255,255,255,0.30)" strokeWidth="1.5" fill="none" strokeLinecap="round">
            <circle cx="0" cy="0" r="30" />
            <circle cx="0" cy="0" r="21" />
            {/* Fork */}
            <line x1="-10" y1="-15" x2="-10" y2="15" />
            <line x1="-13" y1="-15" x2="-13" y2="-5" />
            <line x1="-7" y1="-15" x2="-7" y2="-5" />
            <path d="M-13,-5 Q-10,-2 -7,-5" />
            {/* Knife */}
            <line x1="10" y1="-15" x2="10" y2="15" />
            <path d="M10,-15 Q17,-9 10,-3" strokeWidth="1.2" />
          </g>

          <text x="173" y="264" textAnchor="middle"
            fill="rgba(255,209,66,0.65)" fontSize="11" letterSpacing="5"
            fontFamily="'Courier New', Courier, monospace">№ 01</text>

          <text x="173" y="297" textAnchor="middle"
            fill="#FFFAEA" fontSize="24" letterSpacing="1"
            fontFamily="Georgia, 'Palatino Linotype', serif" fontWeight="700"
            filter="url(#dm-chalk)">
            The Starter
          </text>

          <text x="173" y="340" textAnchor="middle"
            fill="#FFD142" fontSize="42"
            fontFamily="Georgia, 'Palatino Linotype', serif" fontWeight="700">
            $49<tspan fontSize="19" fill="rgba(255,209,66,0.65)">/mo</tspan>
          </text>

          <text x="173" y="370" textAnchor="middle"
            fill="rgba(255,255,255,0.52)" fontSize="12.5"
            fontFamily="'Courier New', Courier, monospace">1-page site, live in 48 hrs</text>
          <text x="173" y="388" textAnchor="middle"
            fill="rgba(255,255,255,0.52)" fontSize="12.5"
            fontFamily="'Courier New', Courier, monospace">Mobile-ready</text>
          <text x="173" y="406" textAnchor="middle"
            fill="rgba(255,255,255,0.52)" fontSize="12.5"
            fontFamily="'Courier New', Courier, monospace">Google-indexed</text>

          {/* ══════════════════════════════════
              SPECIAL № 02 — The Full Stack  (CHEF'S PICK)
              Center x = 450
          ══════════════════════════════════ */}

          {/* Star badge */}
          <g transform="translate(450, 218)">
            <circle cx="0" cy="0" r="32"
              stroke="#FFD142" strokeWidth="2.5" fill="rgba(255,209,66,0.06)" />
            <circle cx="0" cy="0" r="24"
              stroke="rgba(255,209,66,0.45)" strokeWidth="1.2"
              fill="none" strokeDasharray="3.5,3.5" />
            {/* 6-point star */}
            <polygon
              points="0,-19 4.8,-7 18,-7 7.5,1.5 11.5,15 0,7.5 -11.5,15 -7.5,1.5 -18,-7 -4.8,-7"
              fill="#FFD142" opacity="0.88" />
          </g>

          <text x="450" y="260" textAnchor="middle"
            fill="#FFD142" fontSize="11" letterSpacing="5"
            fontFamily="'Courier New', Courier, monospace" fontWeight="700">
            ★  CHEF&apos;S PICK  ★
          </text>

          <text x="450" y="297" textAnchor="middle"
            fill="#FFFAEA" fontSize="24" letterSpacing="1"
            fontFamily="Georgia, 'Palatino Linotype', serif" fontWeight="700"
            filter="url(#dm-chalk)">
            The Full Stack
          </text>

          <text x="450" y="340" textAnchor="middle"
            fill="#FFD142" fontSize="42"
            fontFamily="Georgia, 'Palatino Linotype', serif" fontWeight="700">
            $99<tspan fontSize="19" fill="rgba(255,209,66,0.65)">/mo</tspan>
          </text>

          <text x="450" y="370" textAnchor="middle"
            fill="rgba(255,255,255,0.52)" fontSize="12.5"
            fontFamily="'Courier New', Courier, monospace">Custom multi-page site</text>
          <text x="450" y="388" textAnchor="middle"
            fill="rgba(255,255,255,0.52)" fontSize="12.5"
            fontFamily="'Courier New', Courier, monospace">All the fixings</text>
          <text x="450" y="406" textAnchor="middle"
            fill="rgba(255,255,255,0.52)" fontSize="12.5"
            fontFamily="'Courier New', Courier, monospace">Ongoing tweaks included</text>

          {/* ══════════════════════════════════
              SPECIAL № 03 — The Care Plan
              Center x = 727
          ══════════════════════════════════ */}

          {/* Coffee cup icon */}
          <g transform="translate(727, 218)"
            stroke="rgba(255,255,255,0.30)" strokeWidth="1.5" fill="none" strokeLinecap="round">
            {/* Cup body */}
            <rect x="-20" y="-14" width="40" height="30" rx="4" />
            {/* Handle */}
            <path d="M20,-7 Q33,-7 33,1 Q33,9 20,9" strokeWidth="1.8" />
            {/* Saucer */}
            <rect x="-22" y="16" width="44" height="5" rx="2"
              fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.22)" />
            {/* Steam */}
            <path d="M-7,-22 Q-4,-30 -7,-37" strokeLinecap="round" />
            <path d="M7,-22 Q10,-30 7,-37" strokeLinecap="round" />
          </g>

          <text x="727" y="264" textAnchor="middle"
            fill="rgba(255,209,66,0.65)" fontSize="11" letterSpacing="5"
            fontFamily="'Courier New', Courier, monospace">№ 03</text>

          <text x="727" y="297" textAnchor="middle"
            fill="#FFFAEA" fontSize="24" letterSpacing="1"
            fontFamily="Georgia, 'Palatino Linotype', serif" fontWeight="700"
            filter="url(#dm-chalk)">
            The Care Plan
          </text>

          <text x="727" y="340" textAnchor="middle"
            fill="#FFD142" fontSize="42"
            fontFamily="Georgia, 'Palatino Linotype', serif" fontWeight="700">
            $79<tspan fontSize="19" fill="rgba(255,209,66,0.65)">/mo</tspan>
          </text>

          <text x="727" y="370" textAnchor="middle"
            fill="rgba(255,255,255,0.52)" fontSize="12.5"
            fontFamily="'Courier New', Courier, monospace">We handle updates</text>
          <text x="727" y="388" textAnchor="middle"
            fill="rgba(255,255,255,0.52)" fontSize="12.5"
            fontFamily="'Courier New', Courier, monospace">You handle business</text>
          <text x="727" y="406" textAnchor="middle"
            fill="rgba(255,255,255,0.52)" fontSize="12.5"
            fontFamily="'Courier New', Courier, monospace">Cancel anytime</text>

          {/* ── BOTTOM RULE ── */}
          <line x1="88" y1="432" x2="812" y2="432"
            stroke="rgba(255,255,255,0.42)" strokeWidth="2" />
          <line x1="88" y1="438" x2="812" y2="438"
            stroke="rgba(255,255,255,0.14)" strokeWidth="1" />

          {/* Bottom guarantees row */}
          <text x="450" y="460" textAnchor="middle"
            fill="rgba(255,255,255,0.32)" fontSize="12" letterSpacing="3"
            fontFamily="'Courier New', Courier, monospace">
            ✓ Mix &amp; match  ✓ No contracts  ✓ You own your site
          </text>

          {/* Bottom italic CTA */}
          <text x="450" y="481" textAnchor="middle"
            fill="rgba(255,209,66,0.38)" fontSize="12.5" letterSpacing="0.5"
            fontFamily="Georgia, 'Palatino Linotype', serif" fontStyle="italic">
            Ask about custom orders — scroll down for the full menu
          </text>
        </svg>

        {/* "See Full Menu" CTA button */}
        <div style={{ display: "flex", justifyContent: "center", marginTop: "2rem" }}>
          <a
            href="#pricing"
            style={{
              display: "inline-block",
              padding: "0.7rem 2.25rem",
              border: "2px solid rgba(255,209,66,0.55)",
              color: "#FFD142",
              fontFamily: "'Courier New', Courier, monospace",
              fontSize: "0.8125rem",
              letterSpacing: "0.18em",
              textDecoration: "none",
              textTransform: "uppercase",
              transition: "border-color 0.25s, color 0.25s, background 0.25s",
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLAnchorElement).style.background = "rgba(255,209,66,0.10)";
              (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(255,209,66,0.9)";
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLAnchorElement).style.background = "transparent";
              (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(255,209,66,0.55)";
            }}
          >
            See Full Menu ↓
          </a>
        </div>
      </div>
    </section>
  );
}
