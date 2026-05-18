"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
  const [dark, setDark]       = useState(false);
  const [mounted, setMounted] = useState(false);
  const [spinning, setSpinning] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem("theme");
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const isDark = stored === "dark" || (!stored && mq.matches);
    setDark(isDark);
    document.documentElement.classList.toggle("dark", isDark);

    // Follow OS changes when user hasn't set a manual preference
    const onChange = (e: MediaQueryListEvent) => {
      if (localStorage.getItem("theme")) return;
      setDark(e.matches);
      document.documentElement.classList.toggle("dark", e.matches);
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const toggle = () => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const apply = () => {
      const next = !dark;
      setDark(next);
      document.documentElement.classList.toggle("dark", next);
      localStorage.setItem("theme", next ? "dark" : "light");
      setSpinning(false);
    };
    if (reducedMotion) {
      apply();
    } else {
      setSpinning(true);
      setTimeout(apply, 180);
    }
  };

  if (!mounted) return <div className="w-8 h-8" aria-hidden />;

  return (
    <button
      onClick={toggle}
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      aria-pressed={dark}
      className="relative flex items-center justify-center w-8 h-8 rounded-xl transition-all duration-200 hover:bg-[rgba(212,104,42,0.12)]"
      style={{
        color: dark ? "rgba(212,104,42,0.8)" : "rgba(243,233,213,0.48)",
        boxShadow: spinning ? "0 0 0 2px rgba(212,104,42,0.25)" : "none",
        transition: "box-shadow 0.2s ease, color 0.2s ease",
      }}
    >
      {/* Sun icon — purely decorative, button aria-label carries the meaning */}
      <span
        aria-hidden="true"
        style={{
          position: "absolute",
          display: "flex",
          transition: "transform 0.38s cubic-bezier(0.22,1,0.36,1), opacity 0.22s ease",
          transform: dark ? "rotate(0deg) scale(1)" : "rotate(-45deg) scale(0.5)",
          opacity: dark ? 1 : 0,
        }}
      >
        <Sun size={15} strokeWidth={2} />
      </span>
      {/* Moon icon — purely decorative */}
      <span
        aria-hidden="true"
        style={{
          position: "absolute",
          display: "flex",
          transition: "transform 0.38s cubic-bezier(0.22,1,0.36,1), opacity 0.22s ease",
          transform: dark ? "rotate(45deg) scale(0.5)" : "rotate(0deg) scale(1)",
          opacity: dark ? 0 : 1,
        }}
      >
        <Moon size={15} strokeWidth={2} />
      </span>
      {/* Warm pulse ring on click — 0.18s matches the spinning window */}
      {spinning && (
        <span
          aria-hidden
          className="absolute inset-0 rounded-xl"
          style={{ background: "rgba(212,104,42,0.15)", animation: "ping 0.18s cubic-bezier(0, 0, 0.2, 1) 1 forwards" }}
        />
      )}
    </button>
  );
}
