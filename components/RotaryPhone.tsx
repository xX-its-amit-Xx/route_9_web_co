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
            {/* Bakelite body — warm black radial */}
            <radialGradient id="rp-body" cx="35%" cy="30%" r="80%">
              <stop offset="0%"   stopColor="#3A2818" />
              <stop offset="55%"  stopColor="#1A0E08" />
              <stop offset="100%" stopColor="#0E0805" />
            </radialGradient>
            {/* Dial face — metallic warm */}
            <radialGradient id="rp-dial" cx="40%" cy="35%" r="70%">
              <stop offset="0%"   stopColor="#FFE0A0" />
              <stop offset="40%"  stopColor="#D4682A" />
              <stop offset="100%" stopColor="#8E3A0E" />
            </radialGradient>
            {/* Center cap glow */}
            <radialGradient id="rp-cap" cx="40%" cy="35%" r="60%">
              <stop offset="0%"  stopColor="#FFC480" />
              <stop offset="60%" stopColor="#A84818" />
              <stop offset="100%" stopColor="#1A0E08" />
            </radialGradient>
            {/* Handset gradient */}
            <linearGradient id="rp-handset" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"  stopColor="#3A2818" />
              <stop offset="55%" stopColor="#1A0E08" />
              <stop offset="100%" stopColor="#2A1810" />
            </linearGradient>
          </defs>

          {/* Drop shadow behind base */}
          <ellipse cx="66" cy="124" rx="44" ry="5" fill="#000" opacity="0.45" />

          {/* ── Base body — squat rectangle with rounded corners ── */}
          <rect x="12" y="40" width="108" height="78" rx="14"
            fill="url(#rp-body)"
            stroke="#0E0805" strokeWidth="1.2" />
          {/* Inner bevel highlight */}
          <rect x="14" y="42" width="104" height="74" rx="13"
            fill="none" stroke="rgba(212,104,42,0.18)" strokeWidth="0.8" />

          {/* ── Cradle "tongue" cradling the handset on top ── */}
          <rect x="20" y="32" width="92" height="14" rx="6"
            fill="url(#rp-body)"
            stroke="#0E0805" strokeWidth="1" />
          {/* Two cradle hooks */}
          <circle cx="30" cy="33" r="3.5" fill="#0E0805" />
          <circle cx="102" cy="33" r="3.5" fill="#0E0805" />

          {/* ── Handset resting on the cradle ── */}
          <g className="rp-handset" style={{ transformOrigin: "66px 30px" }}>
            {/* Earpiece (left) */}
            <ellipse cx="22" cy="22" rx="11" ry="9" fill="url(#rp-handset)" stroke="#0E0805" strokeWidth="1" />
            <circle cx="22" cy="22" r="5" fill="#0E0805" />
            <circle cx="22" cy="22" r="4" fill="none" stroke="rgba(212,104,42,0.35)" strokeWidth="0.5" />
            {/* Earpiece holes */}
            {[-2.5, 0, 2.5].map((dx) => [-2.5, 0, 2.5].map((dy) => (
              <circle key={`${dx},${dy}`} cx={22 + dx} cy={22 + dy} r="0.55" fill="#1C1209" opacity="0.85" />
            )))}
            {/* Handle (curved bar) */}
            <path d="M28 22 q38 -34 76 0" stroke="url(#rp-handset)" strokeWidth="11" fill="none" strokeLinecap="round" />
            <path d="M28 22 q38 -34 76 0" stroke="#0E0805" strokeWidth="11.5" fill="none" strokeLinecap="round" opacity="0.001" />
            <path d="M28 22 q38 -34 76 0" stroke="rgba(212,104,42,0.12)" strokeWidth="0.8" fill="none" strokeLinecap="round" />
            {/* Mouthpiece (right) */}
            <ellipse cx="110" cy="22" rx="11" ry="9" fill="url(#rp-handset)" stroke="#0E0805" strokeWidth="1" />
            <circle cx="110" cy="22" r="5" fill="#0E0805" />
            {[-2.5, 0, 2.5].map((dx) => [-2.5, 0, 2.5].map((dy) => (
              <circle key={`m${dx},${dy}`} cx={110 + dx} cy={22 + dy} r="0.55" fill="#1C1209" opacity="0.85" />
            )))}
          </g>

          {/* ── Rotary dial ── */}
          <g transform="translate(66 84)">
            {/* Outer ring (fixed) */}
            <circle r="29" fill="#0E0805" stroke="#3A2818" strokeWidth="1" />
            <circle r="28" fill="none" stroke="rgba(212,104,42,0.22)" strokeWidth="0.5" />

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

            {/* Spinning dial — finger holes go around */}
            <g ref={dialRef} className="rp-dial">
              <circle r="20" fill="url(#rp-dial)" stroke="#0E0805" strokeWidth="0.8" />
              {/* Finger holes */}
              {[...Array(10)].map((_, i) => {
                const angle = (-110 + i * 25) * Math.PI / 180;
                const r = 14;
                const x = Math.cos(angle) * r;
                const y = Math.sin(angle) * r;
                return (
                  <circle key={i} cx={x} cy={y} r="2.4" fill="#0E0805" />
                );
              })}
              {/* "Finger stop" — small notch on the side */}
              <path d="M22 -2 L26 -2 L26 4 L22 4 Z" fill="#0E0805" />
            </g>

            {/* Center cap */}
            <circle r="6" fill="url(#rp-cap)" stroke="#0E0805" strokeWidth="0.6" />
            <text x="0" y="2" textAnchor="middle" fontSize="3.5" fontFamily="Georgia, serif" fontStyle="italic" fontWeight="700" fill="#1C1209">R9</text>
          </g>

          {/* Brand plate "BELL" style logo above dial */}
          <rect x="48" y="56" width="36" height="9" rx="2"
            fill="rgba(212,104,42,0.15)" stroke="rgba(212,104,42,0.45)" strokeWidth="0.6" />
          <text x="66" y="62" textAnchor="middle"
            fontSize="5" fontFamily="Georgia, serif" fontWeight="800"
            fill="#D4682A" letterSpacing="2">
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
