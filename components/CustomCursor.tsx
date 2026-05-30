"use client";

import { useEffect, useRef } from "react";

export function CustomCursor() {
  const dotRef  = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const dot  = dotRef.current;
    const glow = glowRef.current;
    if (!dot || !glow) return;

    let cx = -100, cy = -100;
    let gx = -100, gy = -100;
    let rafId: number;

    const GLOW_R  = 280;
    const DOT_HALF = 6; // half of 12px dot

    const onMove = (e: MouseEvent) => { cx = e.clientX; cy = e.clientY; };

    const tick = () => {
      dot.style.transform = `translate(${cx - DOT_HALF}px, ${cy - DOT_HALF}px)`;

      gx += (cx - gx) * 0.04;
      gy += (cy - gy) * 0.04;
      glow.style.transform = `translate(${gx - GLOW_R}px, ${gy - GLOW_R}px)`;

      rafId = requestAnimationFrame(tick);
    };

    document.body.classList.add("cursor-active");
    document.addEventListener("mousemove", onMove);
    rafId = requestAnimationFrame(tick);

    return () => {
      document.body.classList.remove("cursor-active");
      document.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <>
      <div ref={glowRef} className="cursor-glow" aria-hidden />
      <div ref={dotRef}  className="cursor-dot"  aria-hidden />
    </>
  );
}
