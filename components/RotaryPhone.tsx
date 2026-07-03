"use client";

import { useRef, useState } from "react";

type Props = {
  /** Display-formatted phone string, e.g. "508 864 5532". */
  phone: string;
  /** href for the tel: link. */
  href: string;
};

/**
 * Vintage Bakelite rotary phone — illustrated entirely in SVG.
 * Hovering pulses the cradle, clicking spins the dial a full turn and
 * shows a "RING — RING" speech bubble before chasing the tel: link.
 *
 * Decorative wrapping for an existing tel: link; the surrounding <a>
 * retains the real semantic affordance for AT and right-click. Under
 * prefers-reduced-motion the spin animation is suppressed but the link
 * still works.
 */
export function RotaryPhone({ phone, href }: Props) {
  const [ringing, setRinging] = useState(false);
  const dialRef = useRef<SVGGElement>(null);

  const onClick = () => {
    setRinging(true);
    window.setTimeout(() => setRinging(false), 1100);
  };

  return (
    <a
      href={href}
      onClick={onClick}
      aria-label={`Call ${phone}`}
      className="rotary-phone-link group relative inline-flex items-center gap-4 select-none"
      style={{ textDecoration: "none" }}
    >
      <div
        className={`rotary-phone ${ringing ? "is-ringing" : ""}`}
        style={{
          width: 132,
          height: 132,
          flexShrink: 0,
          position: "relative",
          transformOrigin: "60% 60%",
        }}
      >
        <svg viewBox="0 0 132 132" xmlns="http://www.w3.org/2000/svg" aria-hidden style={{ overflow: "visible" }}>
          <defs>
            {/* Bakelite body — warm black radial, lit from upper-left */}
            <radialGradient id="rp-body" cx="32%" cy="24%" r="90%">
              <stop offset="0%"   stopColor="#4A3320" />
              <stop offset="30%"  stopColor="#2C1A0E" />
              <stop offset="62%"  stopColor="#180C06" />
              <stop offset="100%" stopColor="#0A0503" />
            </radialGradient>
            {/* Long glossy sweep across the body shoulder */}
            <linearGradient id="rp-gloss" x1="0" y1="0" x2="0.25" y2="1">
              <stop offset="0%"   stopColor="rgba(255,232,190,0.32)" />
              <stop offset="45%"  stopColor="rgba(255,210,150,0.10)" />
              <stop offset="100%" stopColor="rgba(255,210,150,0)" />
            </linearGradient>
            {/* Rim light — brightens only the right/dark edge of the body */}
            <linearGradient id="rp-rim" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%"  stopColor="rgba(255,170,90,0)" />
              <stop offset="72%" stopColor="rgba(255,170,90,0)" />
              <stop offset="100%" stopColor="rgba(255,178,102,0.38)" />
            </linearGradient>
            {/* Brass dial plate — machined metal */}
            <radialGradient id="rp-dial" cx="36%" cy="30%" r="78%">
              <stop offset="0%"   stopColor="#FFF0C2" />
              <stop offset="26%"  stopColor="#F0BE68" />
              <stop offset="52%"  stopColor="#D4682A" />
              <stop offset="80%"  stopColor="#A04412" />
              <stop offset="100%" stopColor="#742E0A" />
            </radialGradient>
            {/* Soft occlusion pool the dial sits in */}
            <radialGradient id="rp-occl" cx="50%" cy="50%" r="50%">
              <stop offset="0%"  stopColor="rgba(0,0,0,0.55)" />
              <stop offset="70%" stopColor="rgba(0,0,0,0.28)" />
              <stop offset="100%" stopColor="rgba(0,0,0,0)" />
            </radialGradient>
            {/* Elliptical ground-contact shadow */}
            <radialGradient id="rp-ground" cx="50%" cy="50%" r="50%">
              <stop offset="0%"  stopColor="rgba(0,0,0,0.55)" />
              <stop offset="55%" stopColor="rgba(0,0,0,0.32)" />
              <stop offset="100%" stopColor="rgba(0,0,0,0)" />
            </radialGradient>
            {/* Center cap glow */}
            <radialGradient id="rp-cap" cx="36%" cy="30%" r="65%">
              <stop offset="0%"  stopColor="#FFD79A" />
              <stop offset="55%" stopColor="#B85018" />
              <stop offset="100%" stopColor="#140A05" />
            </radialGradient>
            {/* Handset — cylindrical shading, bright band up top */}
            <linearGradient id="rp-handset" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"   stopColor="#503722" />
              <stop offset="28%"  stopColor="#2C1A0E" />
              <stop offset="62%"  stopColor="#150A05" />
              <stop offset="88%"  stopColor="#231208" />
              <stop offset="100%" stopColor="#301A0E" />
            </linearGradient>
            {/* Ear/mouth cup — domed bakelite */}
            <radialGradient id="rp-cup" cx="34%" cy="28%" r="75%">
              <stop offset="0%"   stopColor="#5A4028" />
              <stop offset="45%"  stopColor="#241208" />
              <stop offset="100%" stopColor="#0A0503" />
            </radialGradient>
          </defs>

          {/* Soft elliptical contact shadow under everything */}
          <ellipse cx="66" cy="123" rx="50" ry="6.5" fill="url(#rp-ground)" />

          {/* ── Coiled cord — loops behind the base, up to the handset ── */}
          <g fill="none" strokeLinecap="round">
            {/* lead-out from the base */}
            <path d="M16 86 C 6 90 4 96 9 100" stroke="#130A05" strokeWidth="2.4" />
            <path d="M15 85 C 8 89 6.5 93 8.5 96" stroke="rgba(255,178,102,0.28)" strokeWidth="0.8" />
            {/* coil loops, each with its own top-light */}
            {[
              { x: 13, y: 102, a: -24 },
              { x: 9,  y: 108, a: -10 },
              { x: 7,  y: 114, a: 6 },
              { x: 10, y: 119, a: 22 },
              { x: 16, y: 122, a: 38 },
              { x: 23, y: 123, a: 50 },
            ].map(({ x, y, a }, i) => (
              <g key={i} transform={`rotate(${a} ${x} ${y})`}>
                <ellipse cx={x} cy={y} rx="4.4" ry="3.2" stroke="#130A05" strokeWidth="2.4" />
                <path
                  d={`M ${x - 3.1} ${y - 1.4} Q ${x} ${y - 4.4} ${x + 3.1} ${y - 1.2}`}
                  stroke={`rgba(255,178,102,${0.42 - i * 0.04})`}
                  strokeWidth="0.9"
                />
                <path
                  d={`M ${x - 2.6} ${y + 2.6} Q ${x} ${y + 3.6} ${x + 2.6} ${y + 2.6}`}
                  stroke="rgba(0,0,0,0.5)"
                  strokeWidth="0.8"
                />
              </g>
            ))}
            {/* rise back up to the earpiece */}
            <path d="M27 122 C 2 116 -2 62 14 30" stroke="#130A05" strokeWidth="2.4" />
            <path d="M27 121 C 4 115 0.5 64 13.5 32" stroke="rgba(255,178,102,0.22)" strokeWidth="0.8" />
          </g>

          {/* Rubber feet peeking out under the base */}
          <ellipse cx="30" cy="118.5" rx="7" ry="2.4" fill="#070302" />
          <ellipse cx="102" cy="118.5" rx="7" ry="2.4" fill="#070302" />

          {/* ── Base body — squat rectangle with rounded corners ── */}
          <rect x="12" y="40" width="108" height="78" rx="14"
            fill="url(#rp-body)"
            stroke="#0E0805" strokeWidth="1.2" />
          {/* Bottom grounding band — body darkens toward the desk */}
          <path d="M12 96 v8 a14 14 0 0 0 14 14 h80 a14 14 0 0 0 14 -14 v-8 Z"
            fill="rgba(0,0,0,0.30)" />
          {/* Long specular sweep across the glossy shoulder */}
          <path d="M20 47 Q66 40 112 47 L112 59 Q66 66 20 73 Z"
            fill="url(#rp-gloss)" />
          {/* Inner bevel highlight (upper-left light) */}
          <rect x="14" y="42" width="104" height="74" rx="13"
            fill="none" stroke="rgba(255,206,150,0.20)" strokeWidth="0.8" />
          {/* Rim light on the dark right edge */}
          <rect x="12.7" y="40.7" width="106.6" height="76.6" rx="13.5"
            fill="none" stroke="url(#rp-rim)" strokeWidth="1.1" />

          {/* ── Cradle "tongue" cradling the handset on top ── */}
          {/* occlusion the cradle casts onto the body shoulder */}
          <ellipse cx="66" cy="47" rx="46" ry="3.5" fill="rgba(0,0,0,0.35)" />
          <rect x="20" y="32" width="92" height="14" rx="6"
            fill="url(#rp-body)"
            stroke="#0E0805" strokeWidth="1" />
          {/* lit top edge of the cradle bar */}
          <path d="M26 33.4 H106" stroke="rgba(255,206,150,0.24)" strokeWidth="0.9" strokeLinecap="round" />
          {/* Two cradle hooks */}
          <circle cx="30" cy="33" r="3.5" fill="#0E0805" />
          <circle cx="102" cy="33" r="3.5" fill="#0E0805" />
          {/* occlusion where the handset cups rest on the cradle */}
          <ellipse cx="22" cy="30.5" rx="10" ry="2.6" fill="rgba(0,0,0,0.38)" />
          <ellipse cx="110" cy="30.5" rx="10" ry="2.6" fill="rgba(0,0,0,0.38)" />

          {/* ── Handset resting on the cradle ── */}
          <g className="rp-handset" style={{ transformOrigin: "66px 30px" }}>
            {/* Handle (curved bar) — cylindrical shading in three passes */}
            <path d="M28 22 q38 -34 76 0" stroke="url(#rp-handset)" strokeWidth="11" fill="none" strokeLinecap="round" />
            {/* core shadow along the underside of the cylinder */}
            <path d="M29 25 q37 -30 74 0" stroke="rgba(0,0,0,0.40)" strokeWidth="2.4" fill="none" strokeLinecap="round" />
            {/* long specular running along the top of the barrel */}
            <path d="M31 18.5 q35 -29 70 0" stroke="rgba(255,208,152,0.30)" strokeWidth="2.2" fill="none" strokeLinecap="round" />
            <path d="M46 9.5 q20 -8.5 40 0" stroke="rgba(255,236,200,0.55)" strokeWidth="1" fill="none" strokeLinecap="round" />
            {/* warm rim light along the lower-right edge */}
            <path d="M96 20 q6 -3.5 8 2" stroke="rgba(255,170,90,0.30)" strokeWidth="0.9" fill="none" strokeLinecap="round" />

            {/* Earpiece (left) */}
            <ellipse cx="22" cy="22" rx="11" ry="9" fill="url(#rp-cup)" stroke="#0E0805" strokeWidth="1" />
            {/* cup specular + rim light */}
            <ellipse cx="18" cy="18" rx="3.6" ry="2.2" fill="rgba(255,224,176,0.38)" transform="rotate(-24 18 18)" />
            <path d="M28 28.5 A 11 9 0 0 0 31.5 21" stroke="rgba(255,170,90,0.28)" strokeWidth="0.8" fill="none" strokeLinecap="round" />
            <circle cx="22" cy="22" r="5" fill="#0A0503" />
            {/* recessed speaker face: dark upper lip + lit lower lip */}
            <path d="M17.4 20.5 A 5 5 0 0 1 26.6 20.5" stroke="rgba(0,0,0,0.7)" strokeWidth="0.9" fill="none" />
            <path d="M17.6 24 A 5 5 0 0 0 26.4 24" stroke="rgba(255,196,128,0.35)" strokeWidth="0.7" fill="none" />
            {/* Earpiece holes */}
            {[-2.5, 0, 2.5].map((dx) => [-2.5, 0, 2.5].map((dy) => (
              <circle key={`${dx},${dy}`} cx={22 + dx} cy={22 + dy} r="0.55" fill="#000" opacity="0.9" />
            )))}

            {/* Mouthpiece (right) */}
            <ellipse cx="110" cy="22" rx="11" ry="9" fill="url(#rp-cup)" stroke="#0E0805" strokeWidth="1" />
            <ellipse cx="106" cy="18" rx="3.6" ry="2.2" fill="rgba(255,224,176,0.32)" transform="rotate(-24 106 18)" />
            <path d="M116 28.5 A 11 9 0 0 0 119.5 21" stroke="rgba(255,170,90,0.30)" strokeWidth="0.8" fill="none" strokeLinecap="round" />
            <circle cx="110" cy="22" r="5" fill="#0A0503" />
            <path d="M105.4 20.5 A 5 5 0 0 1 114.6 20.5" stroke="rgba(0,0,0,0.7)" strokeWidth="0.9" fill="none" />
            <path d="M105.6 24 A 5 5 0 0 0 114.4 24" stroke="rgba(255,196,128,0.35)" strokeWidth="0.7" fill="none" />
            {[-2.5, 0, 2.5].map((dx) => [-2.5, 0, 2.5].map((dy) => (
              <circle key={`m${dx},${dy}`} cx={110 + dx} cy={22 + dy} r="0.55" fill="#000" opacity="0.9" />
            )))}
          </g>

          {/* ── Rotary dial ── */}
          {/* occlusion pool the whole dial assembly sits in */}
          <circle cx="68" cy="86.5" r="34" fill="url(#rp-occl)" />
          <g transform="translate(66 84)">
            {/* Outer ring (fixed) — machined bezel with stacked ring lights */}
            <circle r="29" fill="#0E0805" stroke="#3A2818" strokeWidth="1" />
            <circle r="28.6" fill="none" stroke="rgba(255,206,150,0.30)" strokeWidth="0.6"
              strokeDasharray="60 120" strokeDashoffset="118" strokeLinecap="round" />
            <circle r="27.6" fill="none" stroke="rgba(255,190,120,0.16)" strokeWidth="0.5" />
            <circle r="25.4" fill="none" stroke="rgba(0,0,0,0.55)" strokeWidth="0.7" />
            <circle r="24.6" fill="none" stroke="rgba(255,190,120,0.10)" strokeWidth="0.5" />

            {/* Digit numbers — printed on the fixed outer ring, not the spinning dial */}
            {[...Array(10)].map((_, i) => {
              const num = (i + 1) % 10; // 1,2,3,4,5,6,7,8,9,0
              const angle = (-110 + i * 25) * Math.PI / 180;
              const r = 22;
              const x = Math.cos(angle) * r;
              const y = Math.sin(angle) * r;
              return (
                <text
                  key={i}
                  x={x} y={y + 2}
                  textAnchor="middle"
                  fontSize="6"
                  fontFamily="Georgia, serif"
                  fontWeight="700"
                  fill="#FFC480"
                >
                  {num}
                </text>
              );
            })}

            {/* Spinning dial — brass plate, finger holes go around */}
            <g ref={dialRef} className="rp-dial">
              <circle r="20" fill="url(#rp-dial)" stroke="#5A2408" strokeWidth="0.8" />
              {/* machined concentric ring highlights on the brass */}
              <circle r="18.8" fill="none" stroke="rgba(92,40,10,0.50)" strokeWidth="0.5" />
              <circle r="18" fill="none" stroke="rgba(255,238,196,0.45)" strokeWidth="0.5" />
              <circle r="9.2" fill="none" stroke="rgba(92,40,10,0.42)" strokeWidth="0.5" />
              <circle r="8.4" fill="none" stroke="rgba(255,238,196,0.32)" strokeWidth="0.5" />
              {/* specular sweep on the upper-left of the plate */}
              <path d="M -15 -10.5 A 18.4 18.4 0 0 1 8 -16.4"
                stroke="rgba(255,246,222,0.60)" strokeWidth="1.6" fill="none" strokeLinecap="round" />
              {/* Finger holes — drilled, with a lit lower rim */}
              {[...Array(10)].map((_, i) => {
                const angle = (-110 + i * 25) * Math.PI / 180;
                const r = 14;
                const x = Math.cos(angle) * r;
                const y = Math.sin(angle) * r;
                return (
                  <g key={i}>
                    {/* bright machined edge peeking out below the hole */}
                    <circle cx={x + 0.4} cy={y + 0.6} r="2.55" fill="rgba(255,214,150,0.45)" />
                    {/* the hole itself, shifted toward the light */}
                    <circle cx={x - 0.15} cy={y - 0.2} r="2.5" fill="#0A0503" />
                    {/* inner shadow crescent at the top of the bore */}
                    <path
                      d={`M ${x - 2} ${y - 1.4} A 2.3 2.3 0 0 1 ${x + 1.9} ${y - 1.5}`}
                      stroke="rgba(0,0,0,0.85)" strokeWidth="0.8" fill="none" strokeLinecap="round"
                    />
                  </g>
                );
              })}
              {/* "Finger stop" — chromed notch with its own bevel */}
              <path d="M22 -2 L26 -2 L26 4 L22 4 Z" fill="#140A05" />
              <path d="M22.6 -1.4 L25.4 -1.4" stroke="rgba(255,214,150,0.55)" strokeWidth="0.7" strokeLinecap="round" />
              <path d="M22.6 3.4 L25.4 3.4" stroke="rgba(0,0,0,0.7)" strokeWidth="0.7" strokeLinecap="round" />
            </g>

            {/* Center cap — domed, with occlusion ring + specular dot */}
            <circle r="6.8" fill="rgba(0,0,0,0.45)" />
            <circle r="6" fill="url(#rp-cap)" stroke="#0E0805" strokeWidth="0.6" />
            <circle r="5.5" fill="none" stroke="rgba(0,0,0,0.35)" strokeWidth="0.5" />
            <ellipse cx="-2" cy="-2.4" rx="1.9" ry="1.2" fill="rgba(255,240,208,0.65)" transform="rotate(-28 -2 -2.4)" />
            <text x="0" y="2" textAnchor="middle" fontSize="3.5" fontFamily="Georgia, serif" fontStyle="italic" fontWeight="700" fill="#1C1209">R9</text>
          </g>

          {/* Brand plate "BELL" style logo above dial — embossed brass */}
          <rect x="48.6" y="56.8" width="36" height="9" rx="2" fill="rgba(0,0,0,0.4)" />
          <rect x="48" y="56" width="36" height="9" rx="2"
            fill="rgba(212,104,42,0.18)" stroke="rgba(212,104,42,0.5)" strokeWidth="0.6" />
          <path d="M50 57.2 H82" stroke="rgba(255,214,150,0.30)" strokeWidth="0.5" strokeLinecap="round" />
          <text x="66" y="62" textAnchor="middle"
            fontSize="5" fontFamily="Georgia, serif" fontWeight="800"
            fill="#E8944A" letterSpacing="2">
            R9 · BELL
          </text>
        </svg>

        {/* Ring-ring speech bubble that pops out when clicked */}
        <span
          aria-hidden
          className="rp-ring-bubble"
          style={{
            position: "absolute",
            top: "-12px",
            right: "-18px",
            padding: "4px 10px",
            borderRadius: "16px",
            background: "linear-gradient(145deg, #D4682A, #A84818)",
            color: "#FFF6E2",
            fontFamily: "Georgia, serif",
            fontStyle: "italic",
            fontSize: "11px",
            fontWeight: 800,
            letterSpacing: "0.15em",
            boxShadow: "0 4px 14px rgba(212,104,42,0.6), inset 0 1px 0 rgba(255,255,255,0.25)",
            opacity: 0,
            transform: "scale(0.5) translate(8px, 8px)",
            transition: "opacity 0.15s, transform 0.2s",
            pointerEvents: "none",
            whiteSpace: "nowrap",
          }}
        >
          RING — RING
        </span>
      </div>

      {/* Text label next to the phone */}
      <div className="flex flex-col gap-0.5">
        <span style={{ fontSize: "10px", color: "var(--muted)", letterSpacing: "0.18em", textTransform: "uppercase", fontWeight: 700 }}>
          Or give it a spin
        </span>
        <span style={{ fontFamily: "Georgia, serif", fontWeight: 700, fontSize: "20px", color: "var(--fg)", letterSpacing: "0.04em" }}>
          {phone}
        </span>
        <span style={{ fontSize: "11px", color: "var(--muted)", fontStyle: "italic", fontFamily: "var(--font-display)" }}>
          Tap the dial to call.
        </span>
      </div>
    </a>
  );
}
