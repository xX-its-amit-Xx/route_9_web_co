"use client";
import { useEffect, useRef, useState } from "react";

export function useAnimation(active: boolean): number {
  const [phase, setPhase] = useState(0);
  const rafRef  = useRef<number>(0);
  const lastRef = useRef(0);

  useEffect(() => {
    if (!active) return;
    const tick = (t: number) => {
      if (t - lastRef.current >= 33) {
        setPhase(p => p + 1);
        lastRef.current = t;
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [active]);

  return phase;
}
