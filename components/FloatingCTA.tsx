"use client";

import { useEffect, useState } from "react";
import { MessageCircle } from "lucide-react";

export function FloatingCTA() {
  const [scrolled, setScrolled] = useState(false);
  const [atContact, setAtContact] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > window.innerHeight * 0.6);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Hide the CTA once the user has actually reached the Contact section
  // OR scrolled past it into the footer — at that point the floating
  // "Let's talk" pointing to #contact is just noise.
  useEffect(() => {
    const contact = document.getElementById("contact");
    const footer = document.querySelector("footer");
    if (!contact) return;
    const obs = new IntersectionObserver(
      (entries) => {
        let nearEnd = false;
        for (const entry of entries) {
          if (entry.isIntersecting) nearEnd = true;
        }
        setAtContact(nearEnd);
      },
      { rootMargin: "0px 0px -20% 0px" }
    );
    obs.observe(contact);
    if (footer) obs.observe(footer);
    return () => obs.disconnect();
  }, []);

  const visible = scrolled && !atContact;

  // Fixed-position FloatingCTA must NOT bleed past the viewport on
  // mobile. We wrap it in a fixed container with overflow:hidden + safe
  // bottom-right inset so the pulse ring (which scales outward) is
  // clipped instead of leaking off the page.
  return (
    <div
      aria-hidden={visible ? undefined : true}
      data-floating-cta
      className="fixed z-40 pointer-events-none"
      style={{
        bottom: "max(16px, env(safe-area-inset-bottom, 16px))",
        right: "max(12px, env(safe-area-inset-right, 12px))",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0) scale(1)" : "translateY(16px) scale(0.92)",
        transition: "opacity 0.5s, transform 0.5s",
      }}
    >
      <a
        href="#contact"
        aria-label="Get in touch"
        tabIndex={visible ? undefined : -1}
        className="nav-cta-shimmer relative inline-flex items-center gap-2 rounded-full text-[#1C1209] font-bold"
        style={{
          height: "42px",
          padding: "0 14px 0 12px",
          fontSize: "12px",
          background: "linear-gradient(145deg, #E07838 0%, #D4682A 45%, #B05020 100%)",
          boxShadow: "0 0 0 1px rgba(212,104,42,0.45), 0 8px 24px rgba(212,104,42,0.45), 0 1px 0 rgba(255,220,160,0.2) inset, 0 -1px 0 rgba(0,0,0,0.15) inset",
          pointerEvents: visible ? "auto" : "none",
          // Contain the pulse ring inside the button's pill bounds so it
          // can't reach off-screen
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
            animation: visible ? "cta-ring-ping 2.4s ease-out 1.2s infinite" : "none",
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
