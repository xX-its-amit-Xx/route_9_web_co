"use client";

import { useRef, useState, useEffect, useCallback, MouseEvent } from "react";
import { SITE } from "@/lib/content";

/**
 * BusinessCard3D — a physical-feeling, flippable letterpress business card,
 * the kind a shop owner would pin behind the register.
 *
 *   FRONT — brass "R9" mark, "Route 9 Web" in the display face, tagline,
 *           thin orange rule, "Shrewsbury, MA · Route 9" in small caps
 *   BACK  — contact details on aged (slightly darker) cream, plus a small
 *           hand-drawn map hint: a curved road with a "you are here" dot
 *
 * Interactions:
 *   - Click / Enter / Space (it's a real <button>) flips it 180° in 3D
 *     (preserve-3d + backface-visibility, 0.7s cubic-bezier) with a slight
 *     scale-up mid-flip pop on the wrapper.
 *   - On fine pointers, a gentle rAF-throttled rotateX/rotateY follow
 *     (max ~7deg) + lift, matching the TiltCard pattern.
 *   - Reduced motion: tilt is gated off in JS; the flip is state-driven, so
 *     the global transition kill-switch turns it into an instant swap.
 */

const EASE = "cubic-bezier(0.22, 1, 0.36, 1)";
const MAX_TILT = 7;

export function BusinessCard3D() {
  const tiltRef = useRef<HTMLDivElement>(null);
  const allowTilt = useRef(false);
  const rafId = useRef(0);
  const pointer = useRef({ x: 0, y: 0 });

  const [flipped, setFlipped] = useState(false);
  const [flipCount, setFlipCount] = useState(0);

  useEffect(() => {
    allowTilt.current =
      window.matchMedia("(pointer: fine)").matches &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    return () => cancelAnimationFrame(rafId.current);
  }, []);

  // rAF-throttled tilt — at most one style write per frame
  const applyTilt = useCallback(() => {
    rafId.current = 0;
    const el = tiltRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (pointer.current.x - rect.left) / rect.width - 0.5;
    const y = (pointer.current.y - rect.top) / rect.height - 0.5;
    el.style.transition = `transform 0.18s ${EASE}`;
    el.style.transform =
      `rotateX(${(-y * MAX_TILT).toFixed(2)}deg) ` +
      `rotateY(${(x * MAX_TILT).toFixed(2)}deg) translateZ(12px)`;
  }, []);

  const handleMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!allowTilt.current) return;
    pointer.current = { x: e.clientX, y: e.clientY };
    if (!rafId.current) rafId.current = requestAnimationFrame(applyTilt);
  };

  const handleLeave = () => {
    if (rafId.current) {
      cancelAnimationFrame(rafId.current);
      rafId.current = 0;
    }
    const el = tiltRef.current;
    if (!el || !allowTilt.current) return;
    el.style.transition = `transform 0.55s ${EASE}`;
    el.style.transform = "rotateX(0deg) rotateY(0deg) translateZ(0)";
  };

  const handleFlip = () => {
    setFlipped((f) => !f);
    setFlipCount((c) => c + 1);
  };

  // Two identical keyframe names, alternated per flip, so the mid-flip
  // scale pop restarts every time without remounting (which would snap
  // the in-progress rotateY transition).
  const popName =
    flipCount === 0 ? null : flipCount % 2 ? "bc3d-pop-a" : "bc3d-pop-b";

  const faceBase: React.CSSProperties = {
    position: "absolute",
    inset: 0,
    borderRadius: "12px",
    backfaceVisibility: "hidden",
    WebkitBackfaceVisibility: "hidden",
    overflow: "hidden",
  };

  return (
    <div className="inline-block w-fit">
      {/* Stage — perspective container + hover target for the ground shadow */}
      <div
        className="bc3d-stage relative"
        style={{ perspective: "1100px", width: "fit-content" }}
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
      >
        {/* Ground shadow — deepens when the card lifts */}
        <div
          aria-hidden
          className="bc3d-ground absolute"
          style={{
            left: "8%",
            right: "8%",
            bottom: "-8px",
            height: "16px",
            borderRadius: "50%",
            boxShadow:
              "0 12px 26px rgba(28,18,9,0.36), 0 4px 12px rgba(28,18,9,0.22)",
            opacity: 0.5,
          }}
        />

        {/* Tilt + mid-flip pop wrapper */}
        <div
          ref={tiltRef}
          className="relative"
          style={{
            transformStyle: "preserve-3d",
            willChange: "transform",
            animation: popName ? `${popName} 0.7s ${EASE}` : undefined,
          }}
        >
          {/* Flipper — a real button: Enter/Space work natively */}
          <button
            type="button"
            onClick={handleFlip}
            aria-pressed={flipped}
            aria-label="Flip the business card"
            className="bc3d-btn relative block select-none"
            style={{
              width: "clamp(280px, 86vw, 340px)",
              aspectRatio: "340 / 195",
              padding: 0,
              border: "none",
              background: "transparent",
              cursor: "pointer",
              borderRadius: "12px",
              transformStyle: "preserve-3d",
              transition: `transform 0.7s ${EASE}`,
              transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
            }}
          >
            {/* ── FRONT ─────────────────────────────────────────── */}
            <div
              aria-hidden={flipped}
              style={{
                ...faceBase,
                background:
                  "linear-gradient(140deg, #FBF4E2 0%, #F3E9D5 55%, #EDDFC2 100%)",
                border: "1px solid rgba(168,72,24,0.24)",
                // Letterpress paper: top-edge light, faint pressed vignette,
                // layered drop shadow underneath
                boxShadow: [
                  "inset 0 1px 0 rgba(255,255,255,0.65)",
                  "inset 0 -1px 0 rgba(168,72,24,0.10)",
                  "inset 0 0 22px rgba(168,72,24,0.07)",
                  "0 10px 24px rgba(28,18,9,0.26)",
                  "0 3px 8px rgba(28,18,9,0.14)",
                ].join(", "),
              }}
            >
              {/* Paper grain */}
              <div
                aria-hidden
                className="absolute inset-0 pointer-events-none"
                style={{
                  backgroundImage:
                    "radial-gradient(circle at 1px 1px, rgba(168,72,24,0.09) 1px, transparent 0)",
                  backgroundSize: "5px 5px",
                  opacity: 0.5,
                  mixBlendMode: "multiply",
                }}
              />
              {/* Deckled inner frame */}
              <div
                aria-hidden
                className="absolute pointer-events-none"
                style={{
                  inset: "6px",
                  borderRadius: "8px",
                  border: "1px solid rgba(168,72,24,0.16)",
                  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.35)",
                }}
              />

              <div
                className="relative flex h-full flex-col items-center justify-center text-center"
                style={{ padding: "16px 20px 26px" }}
              >
                {/* Brass square mark */}
                <span
                  aria-hidden
                  className="flex items-center justify-center"
                  style={{
                    width: "30px",
                    height: "30px",
                    borderRadius: "6px",
                    background:
                      "linear-gradient(150deg, #E8C578 0%, #C89B4E 42%, #9A7130 78%, #7E5A24 100%)",
                    boxShadow:
                      "inset 0 1px 0 rgba(255,244,214,0.65), inset 0 -1px 0 rgba(60,38,10,0.4), 0 1px 3px rgba(28,18,9,0.3)",
                    color: "#2A1608",
                    fontFamily: "var(--font-display)",
                    fontStyle: "italic",
                    fontWeight: 800,
                    fontSize: "12px",
                    letterSpacing: "0.02em",
                  }}
                >
                  R9
                </span>

                <span
                  style={{
                    marginTop: "8px",
                    fontFamily: "var(--font-display)",
                    fontWeight: 700,
                    fontSize: "21px",
                    lineHeight: 1.15,
                    color: "#2A1810",
                    letterSpacing: "0.01em",
                    textShadow: "0 1px 0 rgba(255,255,255,0.55)",
                  }}
                >
                  Route 9 Web
                </span>

                <span
                  style={{
                    marginTop: "3px",
                    fontFamily: "Georgia, 'Times New Roman', serif",
                    fontStyle: "italic",
                    fontSize: "10px",
                    color: "#7A6852",
                    letterSpacing: "0.02em",
                    textShadow: "0 1px 0 rgba(255,255,255,0.45)",
                  }}
                >
                  Websites for the shops of Shrewsbury
                </span>

                {/* Thin orange rule */}
                <span
                  aria-hidden
                  style={{
                    marginTop: "9px",
                    width: "44px",
                    height: "2px",
                    borderRadius: "1px",
                    background: "#D4682A",
                    boxShadow: "0 1px 0 rgba(255,255,255,0.5)",
                  }}
                />

                {/* Small caps locality line */}
                <span
                  className="absolute"
                  style={{
                    left: 0,
                    right: 0,
                    bottom: "13px",
                    fontSize: "8.5px",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.22em",
                    color: "#8A7660",
                  }}
                >
                  Shrewsbury, MA · Route 9
                </span>
              </div>
            </div>

            {/* ── BACK ──────────────────────────────────────────── */}
            <div
              aria-hidden={!flipped}
              style={{
                ...faceBase,
                transform: "rotateY(180deg)",
                background:
                  "linear-gradient(140deg, #F0E1BE 0%, #EAD7AE 60%, #E3CC9E 100%)",
                border: "1px solid rgba(168,72,24,0.28)",
                boxShadow: [
                  "inset 0 1px 0 rgba(255,255,255,0.5)",
                  "inset 0 -1px 0 rgba(168,72,24,0.12)",
                  "inset 0 0 26px rgba(140,84,30,0.10)",
                  "0 10px 24px rgba(28,18,9,0.26)",
                  "0 3px 8px rgba(28,18,9,0.14)",
                ].join(", "),
              }}
            >
              {/* Aged-paper grain */}
              <div
                aria-hidden
                className="absolute inset-0 pointer-events-none"
                style={{
                  backgroundImage:
                    "radial-gradient(circle at 1px 1px, rgba(140,84,30,0.12) 1px, transparent 0)",
                  backgroundSize: "5px 5px",
                  opacity: 0.55,
                  mixBlendMode: "multiply",
                }}
              />

              <div
                className="relative flex h-full items-stretch gap-2 text-left"
                style={{ padding: "14px 16px" }}
              >
                {/* Contact stack */}
                <div className="flex min-w-0 flex-1 flex-col justify-center">
                  <span
                    style={{
                      fontSize: "8px",
                      fontWeight: 700,
                      letterSpacing: "0.3em",
                      textTransform: "uppercase",
                      color: "#A84818",
                      marginBottom: "8px",
                    }}
                  >
                    Route 9 Web
                  </span>

                  <span
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "13px",
                      fontWeight: 600,
                      color: "#2A1810",
                      textShadow: "0 1px 0 rgba(255,255,255,0.4)",
                    }}
                  >
                    {SITE.email}
                  </span>

                  <span
                    aria-hidden
                    style={{
                      margin: "6px 0",
                      width: "30px",
                      height: "1px",
                      background: "rgba(168,72,24,0.45)",
                    }}
                  />

                  <span
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "13px",
                      fontWeight: 600,
                      color: "#2A1810",
                      letterSpacing: "0.03em",
                      textShadow: "0 1px 0 rgba(255,255,255,0.4)",
                    }}
                  >
                    {SITE.phone}
                  </span>

                  <span
                    style={{
                      marginTop: "5px",
                      fontFamily: "Georgia, 'Times New Roman', serif",
                      fontStyle: "italic",
                      fontSize: "10px",
                      color: "#8A6A45",
                    }}
                  >
                    Text first — fastest
                  </span>
                </div>

                {/* Hand-drawn map hint: curved road + "you are here" dot */}
                <svg
                  viewBox="0 0 110 96"
                  aria-hidden
                  className="self-center flex-shrink-0"
                  style={{ width: "104px", opacity: 0.92 }}
                >
                  {/* Road bed */}
                  <path
                    d="M8 88 C36 70 22 42 52 32 C80 22 88 36 104 12"
                    fill="none"
                    stroke="#8A6A45"
                    strokeWidth="7"
                    strokeLinecap="round"
                    opacity="0.8"
                  />
                  {/* Dashed centerline */}
                  <path
                    d="M8 88 C36 70 22 42 52 32 C80 22 88 36 104 12"
                    fill="none"
                    stroke="#F6EBD2"
                    strokeWidth="1.2"
                    strokeDasharray="5 6"
                    strokeLinecap="round"
                  />
                  {/* You-are-here dot */}
                  <circle
                    cx="52"
                    cy="32"
                    r="8"
                    fill="none"
                    stroke="#D4682A"
                    strokeWidth="1"
                    opacity="0.45"
                  />
                  <circle
                    cx="52"
                    cy="32"
                    r="3.8"
                    fill="#D4682A"
                    stroke="#F6EBD2"
                    strokeWidth="1.4"
                  />
                  <text
                    x="58"
                    y="52"
                    fontFamily="Georgia, serif"
                    fontStyle="italic"
                    fontSize="8.5"
                    fill="#8A6A45"
                  >
                    you are here
                  </text>
                  <text
                    x="12"
                    y="78"
                    fontFamily="monospace"
                    fontWeight="700"
                    fontSize="6"
                    letterSpacing="0.16em"
                    fill="#A84818"
                  >
                    RT 9
                  </text>
                </svg>
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Caption */}
      <p
        className="mt-3 w-full text-center text-xs italic text-muted"
        style={{ fontFamily: "var(--font-display)" }}
      >
        Flip it — everything&apos;s on the back.
      </p>

      {/* Component-scoped keyframes + hover shadow behavior */}
      <style>{`
        @keyframes bc3d-pop-a {
          0%, 100% { transform: scale3d(1, 1, 1); }
          45%      { transform: scale3d(1.05, 1.05, 1.05); }
        }
        @keyframes bc3d-pop-b {
          0%, 100% { transform: scale3d(1, 1, 1); }
          45%      { transform: scale3d(1.05, 1.05, 1.05); }
        }
        .bc3d-ground {
          transition:
            opacity   0.45s cubic-bezier(0.22, 1, 0.36, 1),
            transform 0.45s cubic-bezier(0.22, 1, 0.36, 1);
        }
        @media (hover: hover) and (pointer: fine) {
          .bc3d-stage:hover .bc3d-ground {
            opacity: 0.85;
            transform: translateY(5px) scaleX(1.05);
          }
        }
        .bc3d-btn:focus-visible {
          outline: 2px solid #D4682A;
          outline-offset: 5px;
        }
      `}</style>
    </div>
  );
}
