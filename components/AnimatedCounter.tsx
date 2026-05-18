"use client";

import { useEffect, useRef } from "react";

type Props = {
  to: number;
  suffix?: string;
  duration?: number;
  decimals?: number;
};

export function AnimatedCounter({ to, suffix = "", duration = 1800, decimals = 0 }: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);
  const rafRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Skip counting animation for motion-sensitive users — show final value immediately
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const final = decimals > 0
        ? to.toFixed(decimals)
        : String(to);
      el.textContent = final + suffix;
      el.style.opacity = "1";
      return;
    }

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          obs.disconnect();
          el.className = "count-pop";
          const startTime = Date.now();
          const tick = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const raw = eased * to;
            const formatted = decimals > 0
              ? (Math.round(raw * 10 ** decimals) / 10 ** decimals).toFixed(decimals)
              : String(Math.round(raw));
            el.textContent = formatted + suffix;
            if (progress < 1) rafRef.current = requestAnimationFrame(tick);
          };
          rafRef.current = requestAnimationFrame(tick);
        }
      },
      { threshold: 0.5 }
    );

    obs.observe(el);
    return () => {
      obs.disconnect();
      if (rafRef.current !== undefined) cancelAnimationFrame(rafRef.current);
    };
  }, [to, duration, decimals, suffix]);

  return (
    <span ref={ref} className="opacity-0">
      0{suffix}
    </span>
  );
}
