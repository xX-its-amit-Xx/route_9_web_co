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

  // rAF-throttled: findActive does 9× getElementById + getBoundingClientRect,
  // so running it on every raw scroll event (which can fire faster than the
  // frame rate) hammered layout reads. One pending frame max.
  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        findActive();
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    findActive();
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
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
            className="group-hover:scale-125"
            style={{
              width: i === activeIdx ? "7px" : "5px",
              height: i === activeIdx ? "7px" : "5px",
              borderRadius: "50%",
              background: i === activeIdx
                ? "#D4682A"
                : "rgba(212,104,42,0.3)",
              boxShadow: i === activeIdx
                ? "0 0 0 3px rgba(212,104,42,0.14), 0 0 10px rgba(212,104,42,0.45)"
                : "none",
              transition: "transform 0.3s cubic-bezier(0.22,1,0.36,1), width 0.3s cubic-bezier(0.22,1,0.36,1), height 0.3s cubic-bezier(0.22,1,0.36,1), background 0.3s cubic-bezier(0.22,1,0.36,1), box-shadow 0.3s cubic-bezier(0.22,1,0.36,1)",
            }}
          />
          {/* Tooltip */}
          <span
            className="absolute right-6 whitespace-nowrap opacity-0 translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 pointer-events-none transition-[opacity,transform] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)]"
            style={{
              fontSize: "9px",
              fontWeight: 600,
              color: "rgba(212,104,42,0.85)",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              background: "rgba(14,9,5,0.92)",
              border: "1px solid rgba(212,104,42,0.2)",
              padding: "4px 9px",
              borderRadius: "6px",
              backdropFilter: "blur(8px)",
              boxShadow: "0 4px 14px rgba(0,0,0,0.35)",
            }}
          >
            {s.label}
          </span>
        </a>
      ))}
    </nav>
  );
}
