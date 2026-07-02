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
        className="nav-cta-shimmer relative inline-flex items-center gap-2 rounded-full text-[#1C1209] font-bold transition-[transform,box-shadow] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 shadow-[0_0_0_1px_rgba(212,104,42,0.4),0_6px_20px_rgba(212,104,42,0.32),inset_0_1px_0_rgba(255,220,160,0.2),inset_0_-1px_0_rgba(0,0,0,0.15)] hover:shadow-[0_0_0_1px_rgba(212,104,42,0.45),0_10px_28px_rgba(212,104,42,0.4),inset_0_1px_0_rgba(255,220,160,0.25),inset_0_-1px_0_rgba(0,0,0,0.15)]"
        style={{
          height: "42px",
          padding: "0 14px 0 12px",
          fontSize: "12px",
          letterSpacing: "0.01em",
          background: "linear-gradient(145deg, #E07838 0%, #D4682A 45%, #B05020 100%)",
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
            border: "1px solid rgba(255,220,160,0.4)",
            animation: "cta-ring-ping 3.6s ease-out 1.6s infinite",
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
          className="w-1.5 h-1.5 rounded-full flex-shrink-0 relative z-10"
          style={{ background: "rgba(255,220,160,0.9)", boxShadow: "0 0 5px rgba(255,200,100,0.6)" }}
          aria-hidden
        />
      </a>
    </div>
  );
}
