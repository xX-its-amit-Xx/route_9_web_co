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
            {/* Chrome dome gradient */}
            <linearGradient id="sb-dome" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"   stopColor="#FFE0B0" />
              <stop offset="22%"  stopColor="#E8A050" />
              <stop offset="55%"  stopColor="#A84818" />
              <stop offset="100%" stopColor="#3A1408" />
            </linearGradient>
            {/* Chrome left-rim sheen */}
            <linearGradient id="sb-sheen" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%"   stopColor="rgba(255,255,255,0.65)" />
              <stop offset="40%"  stopColor="rgba(255,200,140,0.18)" />
              <stop offset="100%" stopColor="rgba(255,200,140,0)" />
            </linearGradient>
            {/* Plunger gradient */}
            <radialGradient id="sb-plunger" cx="35%" cy="30%" r="65%">
              <stop offset="0%"   stopColor="#FFE0B0" />
              <stop offset="60%"  stopColor="#A84818" />
              <stop offset="100%" stopColor="#3A1408" />
            </radialGradient>
            {/* Wooden base gradient */}
            <linearGradient id="sb-base" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"   stopColor="#6E3818" />
              <stop offset="40%"  stopColor="#4A220C" />
              <stop offset="100%" stopColor="#2A1008" />
            </linearGradient>
          </defs>

          {/* Drop shadow */}
          <ellipse cx="66" cy="118" rx="42" ry="4" fill="#000" opacity="0.5" />

          {/* Wooden base */}
          <g>
            <rect x="22" y="92" width="88" height="22" rx="4"
              fill="url(#sb-base)" stroke="#1C0E04" strokeWidth="1" />
            {/* Top edge highlight */}
            <line x1="24" y1="94" x2="108" y2="94" stroke="rgba(255,200,140,0.18)" strokeWidth="0.8" />
            {/* Wood grain lines */}
            <path d="M30 102 q15 -1 30 0 q15 1 30 0" stroke="rgba(0,0,0,0.32)" strokeWidth="0.4" fill="none" />
            <path d="M34 108 q12 -1 25 0 q15 1 28 0" stroke="rgba(0,0,0,0.22)" strokeWidth="0.4" fill="none" />
            {/* Tiny brass plate "RING" */}
            <rect x="50" y="100" width="32" height="10" rx="1.5"
              fill="rgba(212,104,42,0.5)" stroke="rgba(28,14,4,0.7)" strokeWidth="0.4" />
            <text x="66" y="107" textAnchor="middle" fontSize="6"
              fontFamily="Georgia, serif" fontStyle="italic" fontWeight="800"
              fill="#1C0E04" letterSpacing="1.5">RING</text>
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
            {/* Dome shadow lip at the bottom */}
            <ellipse cx="66" cy="92" rx="36" ry="3" fill="#1C0E04" opacity="0.4" />
            {/* Reflection ring across the middle */}
            <path
              d="M 36 64 Q 66 56 96 64"
              stroke="rgba(255,225,170,0.45)" strokeWidth="2" fill="none"
              strokeLinecap="round"
            />
          </g>

          {/* Plunger button */}
          <g className="sb-plunger">
            {/* Plunger stem */}
            <rect x="62" y="14" width="8" height="14" rx="1" fill="#2A1008" />
            {/* Plunger top knob */}
            <circle cx="66" cy="12" r="8" fill="url(#sb-plunger)" stroke="#1C0E04" strokeWidth="0.8" />
            {/* Top highlight */}
            <ellipse cx="63" cy="9" rx="3" ry="2" fill="rgba(255,225,170,0.7)" />
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
