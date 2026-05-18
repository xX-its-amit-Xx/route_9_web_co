"use client";

import { useEffect, useId, useRef } from "react";

/**
 * Hand-drawn cursive ink-pen signature that draws itself on when scrolled
 * into view. Uses SVG path stroke-dasharray to simulate the pen tracing
 * each letter in sequence. Three layered paths render at different
 * thicknesses + opacities so the ink reads as real fountain-pen pressure
 * variation rather than a uniform CSS stroke.
 *
 * Under prefers-reduced-motion the signature renders fully drawn
 * immediately.
 */
export function HandwrittenSignature() {
  const ref = useRef<HTMLDivElement>(null);
  const uid = useId().replace(/:/g, "");
  const inkClass = `ink-${uid}`;
  const startedRef = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Reduced-motion: skip the draw animation, show the finished signature.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.classList.add("signed");
      return;
    }

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !startedRef.current) {
          startedRef.current = true;
          el.classList.add("signing");
          obs.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // The signature path — an "A m i t" gesture in cursive script, plus a
  // long flourish underline. Drawn left → right so dasharray animation
  // reads as natural pen movement.
  const sigPath =
    // dash before
    "M 8 50 q 6 -2 12 0 " +
    // A — bottom-left, up to apex, back down with right curl
    "M 30 64 q 6 -32 14 -32 q 8 0 14 32 " +
    // A crossbar
    "M 36 50 q 6 -4 16 0 " +
    // m — two soft humps
    "M 64 56 q 0 -16 8 -16 q 6 0 7 14 q -1 -14 7 -14 q 8 0 8 18 " +
    // i — vertical with dot
    "M 100 40 q 2 16 0 22 " +
    "M 101 31 q 0.5 0 0.5 1 q -0.5 1 -0.5 -1 " +
    // t — vertical + crossbar
    "M 110 22 q 0 30 4 38 " +
    "M 105 35 q 8 -2 12 0 " +
    // flourish — long underline sweeping out with a final loop
    "M 4 78 q 60 -8 120 0 q 60 8 130 -2 q 20 -2 30 6 q 10 8 -8 14 q -10 4 -14 -2";

  return (
    <div
      ref={ref}
      aria-label="— Amit, your Route 9 neighbor"
      role="img"
      className={`signature-root ${inkClass} relative inline-block`}
      style={{ lineHeight: 0 }}
    >
      <svg
        viewBox="0 0 280 96"
        xmlns="http://www.w3.org/2000/svg"
        width="280"
        height="96"
        style={{ overflow: "visible" }}
      >
        <defs>
          {/* Slight ink-on-paper bleed: a tiny blur on a duplicate stroke */}
          <filter id={`ink-bleed-${uid}`} x="-10%" y="-10%" width="120%" height="120%">
            <feGaussianBlur stdDeviation="0.4" />
          </filter>
        </defs>

        {/* Bottom ink-bleed shadow */}
        <path
          d={sigPath}
          fill="none"
          stroke="#D4682A"
          strokeOpacity="0.22"
          strokeWidth="3.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter={`url(#ink-bleed-${uid})`}
          className="sig-path sig-bleed"
        />

        {/* Mid stroke — main ink weight */}
        <path
          d={sigPath}
          fill="none"
          stroke="#A84818"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="sig-path sig-mid"
        />

        {/* Top stroke — thin pen tip highlight, slightly inset */}
        <path
          d={sigPath}
          fill="none"
          stroke="#D4682A"
          strokeWidth="0.7"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.9"
          className="sig-path sig-top"
        />

        {/* Trailing pen-tip dot — the moment the pen lifts */}
        <circle
          cx="248" cy="86" r="1.2"
          fill="#A84818"
          className="sig-tip"
        />
      </svg>

      {/* Tagline under the signature, styled like a printed line on stationery */}
      <p
        className="sig-tagline"
        style={{
          fontFamily: "var(--font-display)",
          fontStyle: "italic",
          fontSize: "13px",
          color: "var(--muted)",
          letterSpacing: "0.02em",
          marginTop: "-4px",
          paddingLeft: "12px",
          opacity: 0,
        }}
      >
        — your Route 9 neighbor
      </p>
    </div>
  );
}
