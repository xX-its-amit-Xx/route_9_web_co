"use client";

import { useEffect, useState, ReactNode, createContext, useContext } from "react";
import Lenis from "lenis";

const LenisContext = createContext<Lenis | null>(null);

export function useLenis() {
  return useContext(LenisContext);
}

export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  const [lenis, setLenis] = useState<Lenis | null>(null);

  useEffect(() => {
    // Skip Lenis for users who prefer reduced motion — use native scroll instead
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // Skip Lenis on touch/mobile — native scroll is already smooth there,
    // and Lenis's touch interception fights iOS momentum scroll causing snap-back
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const instance = new Lenis({
      duration: 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      infinite: false,
    });

    setLenis(instance);

    // RAF loop — store id so cleanup can cancel it
    let rafId: number;
    function raf(time: number) {
      instance.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    // Smooth anchor navigation — intercept all #hash links
    function handleClick(e: MouseEvent) {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a[href^="#"]') as HTMLAnchorElement | null;
      if (!anchor) return;
      // Skip link must navigate instantly for keyboard accessibility
      if (anchor.classList.contains("skip-link")) return;
      const hash = anchor.getAttribute("href");
      // Bare "#" is not a valid CSS selector — would throw in querySelector.
      // The Nav logo uses href="#" with its own onClick handler; let it pass through.
      if (!hash || hash.length < 2) return;
      const el = document.querySelector(hash);
      if (!el) return;
      e.preventDefault();
      instance.scrollTo(el as HTMLElement, { offset: -72, duration: 1.6 });
    }

    document.addEventListener("click", handleClick);

    return () => {
      cancelAnimationFrame(rafId);
      instance.destroy();
      document.removeEventListener("click", handleClick);
      setLenis(null);
    };
  }, []);

  return (
    <LenisContext.Provider value={lenis}>
      {children}
    </LenisContext.Provider>
  );
}
