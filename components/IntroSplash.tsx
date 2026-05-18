"use client";

import { useEffect, useState } from "react";

export function IntroSplash() {
  const [phase, setPhase] = useState<"hidden" | "visible" | "fading" | "done">("hidden");

  useEffect(() => {
    if (sessionStorage.getItem("r9_splash_seen")) {
      setPhase("done");
      return;
    }
    sessionStorage.setItem("r9_splash_seen", "1");

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setPhase("done");
      return;
    }

    setPhase("visible");

    const fadeTimer = setTimeout(() => setPhase("fading"), 900);
    const doneTimer = setTimeout(() => setPhase("done"), 1500);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(doneTimer);
    };
  }, []);

  if (phase === "done") return null;

  return (
    <div
      aria-hidden
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center pointer-events-none select-none"
      style={{
        background: "#0B0705",
        opacity: phase === "visible" ? 1 : 0,
        transition: phase === "fading" ? "opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1)" : "none",
      }}
    >
      {/* R9 logo mark */}
      <div
        style={{
          animation: phase === "visible" ? "splash-logo-in 0.55s cubic-bezier(0.22, 1, 0.36, 1) both" : "none",
        }}
      >
        <div
          className="flex items-center justify-center w-16 h-16 rounded-2xl mb-5"
          style={{
            fontFamily: "var(--font-display)",
            fontStyle: "italic",
            fontWeight: 800,
            fontSize: "22px",
            color: "white",
            background: "linear-gradient(145deg, #E07838 0%, #C05A20 55%, #A04010 100%)",
            boxShadow:
              "0 0 0 1px rgba(212,104,42,0.45), 0 8px 32px rgba(212,104,42,0.45), inset 0 1px 0 rgba(255,255,255,0.2)",
          }}
        >
          R9
        </div>
      </div>

      {/* Wordmark */}
      <div
        style={{
          animation: phase === "visible" ? "splash-logo-in 0.55s cubic-bezier(0.22, 1, 0.36, 1) 0.1s both" : "none",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "2px",
        }}
      >
        <span
          style={{
            fontSize: "9px",
            fontWeight: 700,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: "rgba(212,104,42,0.55)",
          }}
        >
          Route 9
        </span>
        <span
          style={{
            fontFamily: "var(--font-display)",
            fontStyle: "italic",
            fontSize: "28px",
            color: "#F3E9D5",
            letterSpacing: "-0.02em",
            lineHeight: 1,
          }}
        >
          Web Co.
        </span>
      </div>

      {/* Subtle tagline */}
      <div
        style={{
          animation: phase === "visible" ? "splash-logo-in 0.55s cubic-bezier(0.22, 1, 0.36, 1) 0.22s both" : "none",
          marginTop: "20px",
        }}
      >
        <p
          style={{
            fontSize: "10px",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "rgba(155,140,125,0.5)",
            fontWeight: 600,
          }}
        >
          Shrewsbury, MA
        </p>
      </div>

      {/* Animated road line */}
      <div
        style={{
          animation: phase === "visible" ? "splash-logo-in 0.55s cubic-bezier(0.22, 1, 0.36, 1) 0.3s both" : "none",
          marginTop: "32px",
          width: "80px",
          height: "2px",
          borderRadius: "9999px",
          overflow: "hidden",
          background: "rgba(212,104,42,0.15)",
        }}
      >
        <div
          style={{
            height: "100%",
            width: "30px",
            borderRadius: "9999px",
            background: "rgba(212,104,42,0.7)",
            animation: "splash-car-slide 0.9s cubic-bezier(0.4, 0, 0.6, 1) 0.35s both",
          }}
        />
      </div>
    </div>
  );
}
