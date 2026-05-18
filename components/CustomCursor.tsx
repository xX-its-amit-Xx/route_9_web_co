"use client";

import { useEffect, useRef } from "react";

export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    const glow = glowRef.current;
    if (!dot || !ring || !glow) return;

    let cx = -100, cy = -100;
    let fx = -100, fy = -100;   // ring
    let gx = -100, gy = -100;   // ambient glow (very lazy)
    let rafId: number;
    let isHover = false;

    const onMove = (e: MouseEvent) => { cx = e.clientX; cy = e.clientY; };

    const GLOW_R = 280;

    const tick = () => {
      dot.style.transform = `translate(${cx - 3}px, ${cy - 3}px)`;

      fx += (cx - fx) * 0.13;
      fy += (cy - fy) * 0.13;
      const half = isHover ? 22 : 14;
      ring.style.transform = `translate(${fx - half}px, ${fy - half}px)`;
      ring.style.width = isHover ? "44px" : "28px";
      ring.style.height = isHover ? "44px" : "28px";

      // Ambient glow drifts lazily behind cursor
      gx += (cx - gx) * 0.04;
      gy += (cy - gy) * 0.04;
      glow.style.transform = `translate(${gx - GLOW_R}px, ${gy - GLOW_R}px)`;

      rafId = requestAnimationFrame(tick);
    };

    const interactiveEls = "a, button, [role='button'], input, textarea, select, label";

    // Event delegation — one listener for all interactive elements, no MutationObserver needed
    const onOver = (e: MouseEvent) => {
      if ((e.target as Element).closest(interactiveEls)) {
        isHover = true;
        ring.classList.add("cursor-ring-hover");
      }
    };
    const onOut = (e: MouseEvent) => {
      if ((e.target as Element).closest(interactiveEls)) {
        isHover = false;
        ring.classList.remove("cursor-ring-hover");
      }
    };

    document.body.classList.add("cursor-active");
    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseover", onOver);
    document.addEventListener("mouseout", onOut);
    rafId = requestAnimationFrame(tick);

    return () => {
      document.body.classList.remove("cursor-active");
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseout", onOut);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <>
      {/* Lazy ambient glow — large warm orb that drifts behind the cursor */}
      <div ref={glowRef} className="cursor-glow" aria-hidden />
      <div ref={dotRef} className="cursor-dot" aria-hidden />
      <div ref={ringRef} className="cursor-ring" aria-hidden />
    </>
  );
}
