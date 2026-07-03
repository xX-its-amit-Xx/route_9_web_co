"use client";

import { useState } from "react";

/**
 * Vintage chrome service bell — the kind you slap on a diner counter.
 * Click the plunger to "ring" it: the bell squashes briefly, four
 * concentric sound-wave arcs ripple outward, and a small "DING!" speech
 * bubble pops out. A polite "Wave hello" message can be threaded back
 * into the Contact form via the same r9:contact-prefill event the other
 * Pricing CTAs use.
 *
 * Reduced-motion: the ring animation is suppressed, but clicking still
 * fires the prefill event.
 */
export function ServiceBell() {
  const [ringing, setRinging] = useState(false);

  const onRing = () => {
    setRinging(true);
    window.setTimeout(() => setRinging(false), 900);
    window.dispatchEvent(
      new CustomEvent("r9:contact-prefill", {
        detail: { message: "Hi! Just wanted to say hello." },
      })
    );
  };

  return (
    <button
      type="button"
      onClick={onRing}
      aria-label="Ring the service bell — say hello"
      className={`service-bell-button group relative inline-flex flex-col items-center gap-2 ${ringing ? "is-ringing" : ""}`}
      style={{
        background: "transparent",
        border: "none",
        cursor: "pointer",
        padding: "8px 12px",
      }}
    >
      <div
        className="service-bell"
        style={{
          width: 132,
          height: 132,
          position: "relative",
        }}
      >
        {/* Sound-wave ripples — four concentric arcs that scale out on ring */}
        {[0, 1, 2, 3].map((i) => (
          <span
            key={i}
            aria-hidden
            className="bell-wave"
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              width: 70,
              height: 70,
              marginLeft: -35,
              marginTop: -35,
              borderRadius: "50%",
              border: "1.5px solid rgba(212,104,42,0.55)",
              opacity: 0,
              transform: "scale(0.4)",
              ["--bell-wave-delay" as never]: `${i * 0.12}s`,
              pointerEvents: "none",
            }}
          />
        ))}

        <svg viewBox="0 0 132 132" xmlns="http://www.w3.org/2000/svg" aria-hidden style={{ overflow: "visible" }}>
          <defs>
            {/* Polished brass dome — mirror-like banded gradient */}
            <linearGradient id="sb-dome" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"   stopColor="#FFF6DC" />
              <stop offset="9%"   stopColor="#FFE2A6" />
              <stop offset="19%"  stopColor="#E89850" />
              <stop offset="30%"  stopColor="#AE5A20" />
              <stop offset="41%"  stopColor="#E8A860" />
              <stop offset="54%"  stopColor="#8E4218" />
              <stop offset="71%"  stopColor="#57250D" />
              <stop offset="88%"  stopColor="#3A1608" />
              <stop offset="100%" stopColor="#4E2410" />
            </linearGradient>
            {/* Chrome left-rim sheen */}
            <linearGradient id="sb-sheen" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%"   stopColor="rgba(255,255,255,0.70)" />
              <stop offset="40%"  stopColor="rgba(255,200,140,0.16)" />
              <stop offset="100%" stopColor="rgba(255,200,140,0)" />
            </linearGradient>
            {/* Plunger cap — domed metal */}
            <radialGradient id="sb-plunger" cx="34%" cy="26%" r="72%">
              <stop offset="0%"   stopColor="#FFF2CC" />
              <stop offset="38%"  stopColor="#E8A050" />
              <stop offset="68%"  stopColor="#8E4218" />
              <stop offset="100%" stopColor="#2E1206" />
            </radialGradient>
            {/* Plunger stem — horizontal cylinder shading */}
            <linearGradient id="sb-stem" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%"   stopColor="#1A0A04" />
              <stop offset="34%"  stopColor="#6E3A1A" />
              <stop offset="50%"  stopColor="#C88950" />
              <stop offset="70%"  stopColor="#4A2410" />
              <stop offset="100%" stopColor="#140804" />
            </linearGradient>
            {/* Wooden base gradient */}
            <linearGradient id="sb-base" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"   stopColor="#7A3E1A" />
              <stop offset="35%"  stopColor="#4E240D" />
              <stop offset="80%"  stopColor="#2C1108" />
              <stop offset="100%" stopColor="#200C05" />
            </linearGradient>
            {/* Routed top bevel of the base */}
            <linearGradient id="sb-baseTop" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"   stopColor="#9A5526" />
              <stop offset="100%" stopColor="#5A2A10" />
            </linearGradient>
            {/* Brass name plate */}
            <linearGradient id="sb-plate" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"   stopColor="#E8A050" />
              <stop offset="55%"  stopColor="#C06E2E" />
              <stop offset="100%" stopColor="#8E4218" />
            </linearGradient>
            {/* Soft elliptical ground shadow */}
            <radialGradient id="sb-ground" cx="50%" cy="50%" r="50%">
              <stop offset="0%"  stopColor="rgba(0,0,0,0.58)" />
              <stop offset="55%" stopColor="rgba(0,0,0,0.32)" />
              <stop offset="100%" stopColor="rgba(0,0,0,0)" />
            </radialGradient>
          </defs>

          {/* Ground-contact shadow — soft falloff, tight dark core */}
          <ellipse cx="66" cy="117.5" rx="50" ry="6" fill="url(#sb-ground)" />
          <ellipse cx="66" cy="116.5" rx="36" ry="3" fill="rgba(0,0,0,0.35)" />

          {/* Wooden base — beveled, grained */}
          <g>
            <rect x="22" y="92" width="88" height="22" rx="4"
              fill="url(#sb-base)" stroke="#1C0E04" strokeWidth="1" />
            {/* Routed top bevel catching the light */}
            <rect x="23" y="92.8" width="86" height="3.6" rx="1.8" fill="url(#sb-baseTop)" opacity="0.9" />
            <line x1="25" y1="93.4" x2="107" y2="93.4" stroke="rgba(255,214,150,0.35)" strokeWidth="0.7" />
            {/* Side light (left) + rim light (right) on the base */}
            <path d="M23.2 96 v14" stroke="rgba(255,200,140,0.16)" strokeWidth="0.9" strokeLinecap="round" />
            <path d="M108.8 96 v14" stroke="rgba(255,178,102,0.26)" strokeWidth="0.9" strokeLinecap="round" />
            {/* Bottom edge sinks into shadow */}
            <path d="M22 108 v2 a4 4 0 0 0 4 4 h80 a4 4 0 0 0 4 -4 v-2 Z" fill="rgba(0,0,0,0.35)" />
            {/* Wood grain lines + knot */}
            <path d="M30 100 q15 -1.2 30 0 q15 1.2 30 0 q10 -0.8 18 0" stroke="rgba(0,0,0,0.35)" strokeWidth="0.4" fill="none" />
            <path d="M28 104 q18 -1 34 0 q16 1 32 0" stroke="rgba(0,0,0,0.28)" strokeWidth="0.4" fill="none" />
            <path d="M34 108.5 q12 -1 25 0 q15 1 28 0 q8 -0.6 16 0" stroke="rgba(0,0,0,0.22)" strokeWidth="0.4" fill="none" />
            <path d="M31 111 q20 -0.8 38 0" stroke="rgba(255,178,102,0.08)" strokeWidth="0.4" fill="none" />
            <ellipse cx="97" cy="103" rx="2.6" ry="1.3" fill="none" stroke="rgba(0,0,0,0.30)" strokeWidth="0.4" />
            {/* Brass plate "RING" — embossed, screwed on */}
            <rect x="50.5" y="100.6" width="32" height="10" rx="1.5" fill="rgba(0,0,0,0.45)" />
            <rect x="50" y="100" width="32" height="10" rx="1.5"
              fill="url(#sb-plate)" stroke="rgba(28,14,4,0.7)" strokeWidth="0.4" />
            <path d="M51.5 101.2 H80.5" stroke="rgba(255,238,196,0.45)" strokeWidth="0.5" strokeLinecap="round" />
            <circle cx="53" cy="105" r="1" fill="#2E1206" />
            <circle cx="52.7" cy="104.7" r="0.35" fill="rgba(255,224,176,0.7)" />
            <circle cx="79" cy="105" r="1" fill="#2E1206" />
            <circle cx="78.7" cy="104.7" r="0.35" fill="rgba(255,224,176,0.7)" />
            <text x="66" y="107" textAnchor="middle" fontSize="6"
              fontFamily="Georgia, serif" fontStyle="italic" fontWeight="800"
              fill="#1C0E04" letterSpacing="1.5">RING</text>
            {/* Occlusion the dome casts onto the base */}
            <ellipse cx="66" cy="93.6" rx="37" ry="2.6" fill="rgba(0,0,0,0.42)" />
          </g>

          {/* Bell dome */}
          <g className="sb-dome">
            {/* Main dome */}
            <path
              d="M 30 92 C 30 50  46 24  66 24  C 86 24  102 50  102 92 Z"
              fill="url(#sb-dome)" stroke="#1C0E04" strokeWidth="1.2"
            />
            {/* Sheen on the left side — sells the chrome */}
            <path
              d="M 30 92 C 30 50  46 24  66 24 C 60 30  44 60  44 92 Z"
              fill="url(#sb-sheen)"
            />
            {/* Mirror horizon — dark reflected band under the bright one */}
            <path
              d="M 36 64 Q 66 56 96 64"
              stroke="rgba(255,232,184,0.55)" strokeWidth="2.2" fill="none"
              strokeLinecap="round"
            />
            <path
              d="M 35 69.5 Q 66 61.5 97 69.5"
              stroke="rgba(32,12,5,0.45)" strokeWidth="3" fill="none"
              strokeLinecap="round"
            />
            <path
              d="M 34.5 75 Q 66 67.5 97.5 75"
              stroke="rgba(255,200,140,0.14)" strokeWidth="1.4" fill="none"
              strokeLinecap="round"
            />
            {/* Window reflection — two panes, upper-left */}
            <g opacity="0.8">
              <path d="M46 39 L52.5 34.5 L52.5 45.5 L46 50.5 Z" fill="rgba(255,248,228,0.85)" />
              <path d="M55.5 32.8 L60.5 30.4 L60.5 41.6 L55.5 44.4 Z" fill="rgba(255,248,228,0.50)" />
            </g>
            {/* Rim light tracing the dark right contour */}
            <path
              d="M 97.5 52 C 100.5 63 101.6 76 101.6 89"
              stroke="rgba(255,190,120,0.38)" strokeWidth="1.2" fill="none" strokeLinecap="round"
            />
            {/* Lit lip edge, then the shadow tucked under it */}
            <path d="M 33 90.4 H 99" stroke="rgba(255,224,176,0.28)" strokeWidth="0.8" strokeLinecap="round" />
            <ellipse cx="66" cy="92" rx="36" ry="3" fill="#1C0E04" opacity="0.45" />
            {/* Sound hole shadow under the dome skirt */}
            <path d="M 40 91.4 Q 66 89 92 91.4" stroke="rgba(0,0,0,0.5)" strokeWidth="1.2" fill="none" strokeLinecap="round" />
          </g>

          {/* Plunger button */}
          <g className="sb-plunger">
            {/* Stem — cylindrical, with a collar where it meets the dome */}
            <rect x="62" y="14" width="8" height="14" rx="1" fill="url(#sb-stem)" />
            <ellipse cx="66" cy="26.5" rx="6" ry="2" fill="#1C0E04" />
            <path d="M 60.8 25.8 Q 66 24 71.2 25.8" stroke="rgba(255,214,150,0.30)" strokeWidth="0.6" fill="none" strokeLinecap="round" />
            {/* Cap — domed metal with machined ring */}
            <circle cx="66" cy="12" r="8" fill="url(#sb-plunger)" stroke="#1C0E04" strokeWidth="0.8" />
            <circle cx="66" cy="12" r="6.6" fill="none" stroke="rgba(60,22,8,0.45)" strokeWidth="0.5" />
            {/* Window-pane specular + rim light on the dark side */}
            <ellipse cx="63" cy="8.8" rx="3" ry="1.9" fill="rgba(255,244,216,0.85)" transform="rotate(-26 63 8.8)" />
            <ellipse cx="68.5" cy="7.6" rx="1.1" ry="0.7" fill="rgba(255,244,216,0.45)" transform="rotate(-26 68.5 7.6)" />
            <path d="M 72.6 15.2 A 8 8 0 0 1 68.4 19.4" stroke="rgba(255,190,120,0.45)" strokeWidth="0.8" fill="none" strokeLinecap="round" />
          </g>
        </svg>

        {/* "DING!" bubble that pops when ringing */}
        <span
          aria-hidden
          className="bell-ding-bubble"
          style={{
            position: "absolute",
            top: "-6px",
            right: "-28px",
            padding: "5px 12px",
            borderRadius: "999px",
            background: "linear-gradient(145deg, #FFC480, #D4682A)",
            color: "#1C0E04",
            fontFamily: "Georgia, serif",
            fontStyle: "italic",
            fontSize: "13px",
            fontWeight: 900,
            letterSpacing: "0.18em",
            boxShadow: "0 4px 14px rgba(212,104,42,0.6), inset 0 1px 0 rgba(255,255,255,0.35)",
            opacity: 0,
            transform: "scale(0.4) translate(8px, 8px)",
            transition: "opacity 0.12s, transform 0.18s",
            pointerEvents: "none",
            whiteSpace: "nowrap",
          }}
        >
          DING!
        </span>
      </div>

      <span
        style={{
          fontSize: "10px",
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          fontWeight: 700,
          color: "var(--muted)",
          marginTop: "4px",
        }}
      >
        Or just say hi
      </span>
      <span
        style={{
          fontFamily: "var(--font-display)",
          fontStyle: "italic",
          fontSize: "13px",
          color: "var(--muted)",
        }}
      >
        Ring the bell — no obligations.
      </span>
    </button>
  );
}
