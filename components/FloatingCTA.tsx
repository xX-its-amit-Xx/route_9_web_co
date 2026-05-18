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

  return (
    <a
      href="#contact"
      aria-label="Get in touch"
      data-floating-cta
      aria-hidden={visible ? undefined : true}
      tabIndex={visible ? undefined : -1}
      className="nav-cta-shimmer fixed z-40 flex items-center gap-2.5 rounded-full text-[#1C1209] text-xs font-bold transition-all duration-500"
      style={{
        bottom: "28px",
        right: "24px",
        height: "44px",
        padding: "0 18px 0 14px",
        background: "linear-gradient(145deg, #E07838 0%, #D4682A 45%, #B05020 100%)",
        boxShadow: "0 0 0 1px rgba(212,104,42,0.45), 0 8px 28px rgba(212,104,42,0.5), 0 1px 0 rgba(255,220,160,0.2) inset, 0 -1px 0 rgba(0,0,0,0.15) inset",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0) scale(1)" : "translateY(16px) scale(0.92)",
        pointerEvents: visible ? "auto" : "none",
      }}
    >
      {/* Pulse ring — expands outward every 2.4s */}
      <span
        aria-hidden
        className="cta-pulse-ring absolute inset-0 rounded-full pointer-events-none"
        style={{
          border: "1.5px solid rgba(212,104,42,0.6)",
          animation: visible ? "cta-ring-ping 2.4s ease-out 1.2s infinite" : "none",
        }}
      />
      <span
        aria-hidden
        className="flex items-center justify-center w-5 h-5 rounded-full flex-shrink-0"
        style={{ background: "rgba(255,255,255,0.18)" }}
      >
        <MessageCircle size={11} strokeWidth={2.5} />
      </span>
      <span>Let&apos;s talk</span>
      <span
        className="w-1.5 h-1.5 rounded-full flex-shrink-0 animate-pulse"
        style={{ background: "rgba(255,220,160,0.9)", boxShadow: "0 0 6px rgba(255,200,100,0.8)" }}
        aria-hidden
      />
    </a>
  );
}
