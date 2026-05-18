"use client";

import { useEffect, useRef } from "react";

export function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const bar = barRef.current;
    if (!bar) return;

    const onScroll = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      const pct = total > 0 ? window.scrollY / total : 0;
      bar.style.transform = `scaleX(${pct})`;
      bar.style.opacity = window.scrollY > 48 && pct > 0.01 ? "1" : "0";
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      aria-hidden
      data-scroll-progress
      className="fixed top-0 left-0 right-0 z-[99997] h-[2px] pointer-events-none overflow-hidden"
    >
      <div
        ref={barRef}
        className="h-full w-full origin-left will-change-transform"
        style={{
          transform: "scaleX(0)",
          opacity: 0,
          transition: "opacity 0.4s ease",
          background: "linear-gradient(90deg, #C05020, #D4682A 40%, #F0A060 75%, #FFD080 100%)",
          boxShadow: "0 0 10px rgba(212,104,42,0.75), 0 0 3px rgba(240,160,64,1)",
        }}
      />
    </div>
  );
}
