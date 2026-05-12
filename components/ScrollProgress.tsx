"use client";

import { useEffect, useRef } from "react";

export function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const bar = barRef.current;
    if (!bar) return;

    const onScroll = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      const progress = total > 0 ? (window.scrollY / total) * 100 : 0;
      bar.style.width = `${progress}%`;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      aria-hidden
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        height: "2px",
        zIndex: 100000,
        width: "100%",
        background: "rgba(212,104,42,0.1)",
        pointerEvents: "none",
      }}
    >
      <div
        ref={barRef}
        style={{
          height: "100%",
          width: "0%",
          background: "linear-gradient(90deg, #D4682A, #F0A060)",
          transition: "width 0.1s linear",
          boxShadow: "0 0 8px rgba(212,104,42,0.6)",
        }}
      />
    </div>
  );
}
