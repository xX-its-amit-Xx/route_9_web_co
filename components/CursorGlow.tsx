"use client";

import { useEffect, useRef } from "react";

export function CursorGlow() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Only on desktop with a fine pointer (mouse)
    const mq = window.matchMedia("(pointer: fine)");
    if (!mq.matches) return;

    const el = ref.current;
    if (!el) return;
    el.style.opacity = "1";

    const onMove = (e: MouseEvent) => {
      el.style.left = `${e.clientX}px`;
      el.style.top = `${e.clientY}px`;
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <div
      ref={ref}
      className="cursor-glow"
      style={{ opacity: 0 }}
      aria-hidden
    />
  );
}
