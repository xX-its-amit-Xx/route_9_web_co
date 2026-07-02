"use client";

import { useEffect, useState, useRef } from "react";

export function IntroSplash() {
  const [phase, setPhase] = useState<"hidden" | "in" | "out" | "done">("hidden");
  const [progress, setProgress] = useState(0);
  const rafRef = useRef<number>(0);

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

    setPhase("in");

    // Animate progress bar 0 → 100% over 1.85s with easeOutCubic
    const start = performance.now();
    const DURATION = 1850;

    const animProgress = (now: number) => {
      const t = Math.min((now - start) / DURATION, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setProgress(eased * 100);
      if (t < 1) rafRef.current = requestAnimationFrame(animProgress);
    };
    rafRef.current = requestAnimationFrame(animProgress);

    const outTimer = setTimeout(() => setPhase("out"), 2100);
    const doneTimer = setTimeout(() => setPhase("done"), 2900);

    return () => {
      cancelAnimationFrame(rafRef.current);
      clearTimeout(outTimer);
      clearTimeout(doneTimer);
    };
  }, []);

  if (phase === "done") return null;

  return (
    <div
      aria-hidden
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center pointer-events-none select-none overflow-hidden"
      style={{
        background: "#09060300",
        backgroundColor: "#09060300",
      }}
    >
      {/* Full black backdrop */}
      <div
        className="absolute inset-0"
        style={{ background: "#0A0603" }}
      />

      {/* Route 9 dashed road line — draws across center */}
      <div
        className="absolute"
        style={{
          left: 0,
          right: 0,
          top: "50%",
          marginTop: "-1px",
          height: "2px",
          overflow: "hidden",
          zIndex: 0,
        }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            background:
              "repeating-linear-gradient(90deg, rgba(212,104,42,0.38) 0px, rgba(212,104,42,0.38) 28px, transparent 28px, transparent 48px)",
            transformOrigin: "left center",
            animation:
              phase === "in"
                ? "splash-road-draw 1.1s cubic-bezier(0.22, 1, 0.36, 1) 0.15s both"
                : "none",
            opacity: phase === "out" ? 0 : 1,
            transition: phase === "out" ? "opacity 0.3s ease" : "none",
          }}
        />
      </div>

      {/* Main logo block */}
      <div
        className="relative flex flex-col items-center gap-4"
        style={{
          zIndex: 1,
          animation:
            phase === "in"
              ? "splash-logo-in 0.6s cubic-bezier(0.22, 1, 0.36, 1) 0.08s both"
              : "none",
          transform: phase === "out" ? "translateY(-20px)" : undefined,
          opacity: phase === "out" ? 0 : undefined,
          transition:
            phase === "out"
              ? "transform 0.45s cubic-bezier(0.76, 0, 0.24, 1), opacity 0.4s ease"
              : "none",
        }}
      >
        {/* R9 mark */}
        <div
          style={{
            width: "80px",
            height: "80px",
            borderRadius: "20px",
            background:
              "linear-gradient(145deg, #E07838 0%, #C05A20 55%, #A04010 100%)",
            boxShadow:
              "0 0 0 1px rgba(212,104,42,0.45), 0 8px 24px rgba(0,0,0,0.5), 0 14px 44px rgba(212,104,42,0.32), inset 0 2px 0 rgba(255,255,255,0.22), inset 0 -2px 0 rgba(0,0,0,0.18)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "var(--font-display)",
            fontStyle: "italic",
            fontWeight: 800,
            fontSize: "30px",
            color: "white",
          }}
        >
          R9
        </div>

        {/* Wordmark */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "3px",
            animation:
              phase === "in"
                ? "splash-logo-in 0.6s cubic-bezier(0.22, 1, 0.36, 1) 0.18s both"
                : "none",
          }}
        >
          <span
            style={{
              fontSize: "10px",
              fontWeight: 700,
              letterSpacing: "0.26em",
              textTransform: "uppercase",
              color: "rgba(212,104,42,0.52)",
            }}
          >
            Route 9
          </span>
          <span
            style={{
              fontFamily: "var(--font-display)",
              fontStyle: "italic",
              fontSize: "38px",
              color: "#F3E9D5",
              letterSpacing: "-0.02em",
              lineHeight: 1,
            }}
          >
            Web Co.
          </span>
        </div>

        {/* Location */}
        <p
          style={{
            fontSize: "11px",
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: "rgba(155,140,125,0.48)",
            fontWeight: 600,
            animation:
              phase === "in"
                ? "splash-logo-in 0.6s cubic-bezier(0.22, 1, 0.36, 1) 0.32s both"
                : "none",
          }}
        >
          Shrewsbury, MA
        </p>
      </div>

      {/* Progress bar */}
      <div
        style={{
          position: "absolute",
          bottom: "52px",
          left: "50%",
          transform: "translateX(-50%)",
          width: "min(180px, 40vw)",
          zIndex: 2,
          animation:
            phase === "in"
              ? "splash-logo-in 0.6s cubic-bezier(0.22, 1, 0.36, 1) 0.42s both"
              : "none",
          opacity: phase === "out" ? 0 : undefined,
          transition: phase === "out" ? "opacity 0.3s ease" : "none",
        }}
      >
        <div
          style={{
            height: "2px",
            borderRadius: "9999px",
            background: "rgba(212,104,42,0.12)",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${progress}%`,
              background: "linear-gradient(90deg, #D4682A, #F09050)",
              borderRadius: "9999px",
              boxShadow: "0 0 8px rgba(212,104,42,0.5)",
            }}
          />
        </div>
        <p
          style={{
            textAlign: "right",
            fontSize: "10px",
            color: "rgba(212,104,42,0.45)",
            marginTop: "6px",
            fontFamily: "monospace",
            letterSpacing: "0.08em",
          }}
        >
          {Math.round(progress)}%
        </p>
      </div>

      {/* Slide-up exit overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "#0A0603",
          zIndex: 10,
          transformOrigin: "top",
          transform: phase === "out" ? "translateY(-100%)" : "translateY(0)",
          transition:
            phase === "out"
              ? "transform 0.7s cubic-bezier(0.76, 0, 0.24, 1) 0.18s"
              : "none",
        }}
      />
    </div>
  );
}
