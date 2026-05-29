"use client";

import { useEffect, useState, useCallback } from "react";

const SECTIONS = [
  { id: "hero",         label: "Home" },
  { id: "who",          label: "Who I Work With" },
  { id: "pillars",      label: "How I Build" },
  { id: "pricing",      label: "Pricing" },
  { id: "portfolio",    label: "Portfolio" },
  { id: "testimonials", label: "Stories" },
  { id: "process",      label: "Process" },
  { id: "about",        label: "About" },
  { id: "contact",      label: "Contact" },
];

export function SectionProgress() {
  const [activeIdx, setActiveIdx] = useState(0);

  const findActive = useCallback(() => {
    const mid = window.innerHeight / 2;
    let best = 0;
    let bestDist = Infinity;

    SECTIONS.forEach(({ id }, i) => {
      const el = document.getElementById(id);
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const dist = Math.abs(rect.top + rect.height / 2 - mid);
      if (dist < bestDist) {
        bestDist = dist;
        best = i;
      }
    });

    setActiveIdx(best);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", findActive, { passive: true });
    findActive();
    return () => window.removeEventListener("scroll", findActive);
  }, [findActive]);

  return (
    <nav
      aria-label="Page sections"
      className="fixed right-5 top-1/2 -translate-y-1/2 z-[9980] hidden xl:flex flex-col items-center gap-3"
    >
      {SECTIONS.map((s, i) => (
        <a
          key={s.id}
          href={`#${s.id}`}
          aria-label={`Go to ${s.label}`}
          className="group relative flex items-center justify-center"
          style={{ width: "20px", height: "16px" }}
        >
          {/* Dot */}
          <div
            style={{
              width: i === activeIdx ? "8px" : "5px",
              height: i === activeIdx ? "8px" : "5px",
              borderRadius: "50%",
              background: i === activeIdx
                ? "#D4682A"
                : "rgba(212,104,42,0.28)",
              boxShadow: i === activeIdx
                ? "0 0 8px rgba(212,104,42,0.75), 0 0 16px rgba(212,104,42,0.35)"
                : "none",
              transition: "all 0.3s cubic-bezier(0.22,1,0.36,1)",
            }}
          />
          {/* Tooltip */}
          <span
            className="absolute right-6 whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-150"
            style={{
              fontSize: "9px",
              fontWeight: 700,
              color: "rgba(212,104,42,0.8)",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              background: "rgba(14,9,5,0.88)",
              border: "1px solid rgba(212,104,42,0.18)",
              padding: "3px 8px",
              borderRadius: "4px",
              backdropFilter: "blur(8px)",
            }}
          >
            {s.label}
          </span>
        </a>
      ))}
    </nav>
  );
}
