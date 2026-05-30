"use client";

import { MessageCircle } from "lucide-react";

export function FloatingCTA() {

  // Fixed-position FloatingCTA must NOT bleed past the viewport on
  // mobile. We wrap it in a fixed container with overflow:hidden + safe
  // bottom-right inset so the pulse ring (which scales outward) is
  // clipped instead of leaking off the page.
  return (
    <div
      data-floating-cta
      className="fixed z-40 pointer-events-none"
      style={{
        bottom: "max(16px, env(safe-area-inset-bottom, 16px))",
        right: "max(12px, env(safe-area-inset-right, 12px))",
      }}
    >
      <a
        href="#contact"
        aria-label="Get in touch"
        className="nav-cta-shimmer relative inline-flex items-center gap-2 rounded-full text-[#1C1209] font-bold"
        style={{
          height: "42px",
          padding: "0 14px 0 12px",
          fontSize: "12px",
          background: "linear-gradient(145deg, #E07838 0%, #D4682A 45%, #B05020 100%)",
          boxShadow: "0 0 0 1px rgba(212,104,42,0.45), 0 8px 24px rgba(212,104,42,0.45), 0 1px 0 rgba(255,220,160,0.2) inset, 0 -1px 0 rgba(0,0,0,0.15) inset",
          pointerEvents: "auto",
          overflow: "hidden",
        }}
      >
        {/* Pulse ring — now contained inside the button (overflow:hidden
            above), so it pulses subtly without bleeding off the page */}
        <span
          aria-hidden
          className="cta-pulse-ring absolute inset-0 rounded-full pointer-events-none"
          style={{
            border: "1.5px solid rgba(255,220,160,0.55)",
            animation: "cta-ring-ping 2.4s ease-out 1.2s infinite",
          }}
        />
        <span
          aria-hidden
          className="flex items-center justify-center w-5 h-5 rounded-full flex-shrink-0 relative z-10"
          style={{ background: "rgba(255,255,255,0.18)" }}
        >
          <MessageCircle size={11} strokeWidth={2.5} />
        </span>
        <span className="relative z-10">Let&apos;s talk</span>
        <span
          className="w-1.5 h-1.5 rounded-full flex-shrink-0 animate-pulse relative z-10"
          style={{ background: "rgba(255,220,160,0.9)", boxShadow: "0 0 6px rgba(255,200,100,0.8)" }}
          aria-hidden
        />
      </a>
    </div>
  );
}
