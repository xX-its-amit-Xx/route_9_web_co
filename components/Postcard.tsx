"use client";

import { useState } from "react";
import { BrandSeal } from "./BrandSeal";

/**
 * Interactive vintage postcard with two faces:
 *
 *   FRONT — "GREETINGS FROM SHREWSBURY" block letters with masked photos
 *           inside each letter (classic 1950s/60s tourist-postcard style)
 *   BACK  — real postcard layout: POSTCARD header, vertical divider,
 *           handwritten message lines on the left, address block and
 *           postage stamp + postmark on the right
 *
 * Flips in 3D space via CSS preserve-3d + rotateY on click. Auto-flips
 * back after a delay. Disabled under prefers-reduced-motion (renders as
 * a static front face).
 */
export function Postcard() {
  const [flipped, setFlipped] = useState(false);

  const handleFlip = () => setFlipped((f) => !f);
  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleFlip();
    }
  };

  // Letter slots: each big block letter gets a different masked photo from
  // Unsplash so the words read like a vintage tourist postcard.
  const LETTERS = ["G", "R", "E", "E", "T", "I", "N", "G", "S"];
  const PHOTOS = [
    "1517248135467-4c7edcad34c4", // restaurant warm interior
    "1493857671505-72967e2e2760", // coffee shop
    "1509440159596-0249088772ff", // bakery
    "1585747860715-2ba37e788b70", // barber shop
    "1554118811-1e0d58224f24",    // cafe
    "1521590832167-7bcbfaa6381f", // storefront
    "1522337360788-8b13dee7a37e", // florist
    "1472851294608-062f824d29cc", // specialty retail
    "1513104890138-7c749659a591", // restaurant exterior
  ];

  return (
    <div
      className="postcard-stage select-none"
      style={{ perspective: "1600px" }}
    >
      <div
        role="button"
        tabIndex={0}
        onClick={handleFlip}
        onKeyDown={handleKey}
        aria-label={flipped ? "Show postcard front" : "Show postcard back"}
        aria-pressed={flipped}
        className={`postcard ${flipped ? "is-flipped" : ""}`}
        style={{
          position: "relative",
          width: "min(420px, 92vw)",
          aspectRatio: "3 / 2",
          cursor: "pointer",
          transformStyle: "preserve-3d",
          transition: "transform 0.95s cubic-bezier(0.22, 1, 0.36, 1)",
          transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
        }}
      >
        {/* ── FRONT ────────────────────────────────────────────────── */}
        <div
          aria-hidden={flipped}
          className="postcard-face"
          style={{
            position: "absolute",
            inset: 0,
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            background:
              "linear-gradient(135deg, #FAF0DC 0%, #F0DDB8 70%, #E8C99A 100%)",
            borderRadius: "10px",
            boxShadow:
              "0 1px 0 rgba(255,255,255,0.5) inset, 0 18px 36px rgba(28,18,9,0.32), 0 6px 14px rgba(28,18,9,0.18)",
            border: "1px solid rgba(168,72,24,0.25)",
            overflow: "hidden",
            padding: "10px",
          }}
        >
          {/* Sky background with sun glow */}
          <div
            aria-hidden
            className="absolute inset-2 rounded-md overflow-hidden"
            style={{
              background:
                "radial-gradient(ellipse at 50% 130%, #E8923A 0%, #B85040 40%, #5A2440 75%, #2A1432 100%)",
            }}
          >
            <div
              className="absolute"
              style={{
                top: "-30%",
                left: "50%",
                transform: "translateX(-50%)",
                width: "260px",
                height: "260px",
                background:
                  "radial-gradient(circle, rgba(255,220,140,0.65) 0%, rgba(232,146,58,0.25) 35%, transparent 65%)",
              }}
            />
          </div>

          {/* "GREETINGS FROM" mini header */}
          <div
            className="absolute"
            style={{
              top: "14px",
              left: 0,
              right: 0,
              textAlign: "center",
              fontFamily: "Georgia, 'Times New Roman', serif",
              fontStyle: "italic",
              fontSize: "11px",
              fontWeight: 700,
              color: "#FAF0DC",
              letterSpacing: "0.32em",
              textTransform: "uppercase",
              textShadow: "0 1px 2px rgba(0,0,0,0.5)",
            }}
          >
            Greetings from
          </div>

          {/* Big block letters with photos inside */}
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{ paddingTop: "18px" }}
          >
            <svg
              viewBox="0 0 360 96"
              xmlns="http://www.w3.org/2000/svg"
              style={{ width: "92%", maxWidth: "380px" }}
            >
              <defs>
                {LETTERS.map((_, i) => (
                  <pattern
                    key={i}
                    id={`pc-photo-${i}`}
                    x="0" y="0" width="1" height="1"
                    patternContentUnits="objectBoundingBox"
                  >
                    <image
                      href={`https://images.unsplash.com/photo-${PHOTOS[i]}?w=140&auto=format&fit=crop&q=80`}
                      x="0" y="0" width="1" height="1"
                      preserveAspectRatio="xMidYMid slice"
                    />
                  </pattern>
                ))}
              </defs>
              <text
                x="180" y="72"
                textAnchor="middle"
                fontFamily="Georgia, 'Times New Roman', serif"
                fontWeight="900"
                fontSize="64"
                letterSpacing="-3"
                style={{ paintOrder: "stroke fill" }}
                stroke="#1C1209"
                strokeWidth="1.6"
              >
                {LETTERS.map((ch, i) => (
                  <tspan key={i} fill={`url(#pc-photo-${i})`}>{ch}</tspan>
                ))}
              </text>
              {/* White inner bevel on the letterforms */}
              <text
                x="180" y="72"
                textAnchor="middle"
                fontFamily="Georgia, 'Times New Roman', serif"
                fontWeight="900"
                fontSize="64"
                letterSpacing="-3"
                fill="none"
                stroke="rgba(255,255,255,0.45)"
                strokeWidth="0.5"
              >
                GREETINGS
              </text>
            </svg>
          </div>

          {/* "FROM SHREWSBURY" subline */}
          <div
            className="absolute"
            style={{
              left: 0,
              right: 0,
              bottom: "26px",
              textAlign: "center",
              fontFamily: "Georgia, 'Times New Roman', serif",
              fontStyle: "italic",
              fontWeight: 700,
              fontSize: "22px",
              color: "#FAF0DC",
              letterSpacing: "0.06em",
              textShadow: "0 2px 6px rgba(0,0,0,0.55)",
            }}
          >
            from <span style={{ color: "#FFC078" }}>Shrewsbury</span>
          </div>

          {/* Bottom region: state caption */}
          <div
            className="absolute"
            style={{
              left: 0,
              right: 0,
              bottom: "8px",
              textAlign: "center",
              fontFamily: "monospace",
              fontSize: "8px",
              fontWeight: 700,
              color: "#FAF0DC",
              letterSpacing: "0.28em",
              opacity: 0.7,
            }}
          >
            MASSACHUSETTS · ROUTE 9
          </div>

          {/* Tiny "flip me" hint in the corner */}
          <div
            className="absolute"
            aria-hidden
            style={{
              right: "10px",
              top: "10px",
              padding: "2px 6px",
              borderRadius: "4px",
              background: "rgba(28,18,9,0.55)",
              color: "rgba(250,240,220,0.85)",
              fontSize: "8px",
              fontWeight: 700,
              letterSpacing: "0.14em",
              backdropFilter: "blur(4px)",
            }}
          >
            FLIP →
          </div>
        </div>

        {/* ── BACK ─────────────────────────────────────────────────── */}
        <div
          aria-hidden={!flipped}
          className="postcard-face"
          style={{
            position: "absolute",
            inset: 0,
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
            background: "linear-gradient(135deg, #FBF4E2 0%, #F2E3C2 100%)",
            borderRadius: "10px",
            boxShadow:
              "0 1px 0 rgba(255,255,255,0.55) inset, 0 18px 36px rgba(28,18,9,0.32), 0 6px 14px rgba(28,18,9,0.18)",
            border: "1px solid rgba(168,72,24,0.25)",
            overflow: "hidden",
          }}
        >
          {/* Paper grain texture overlay */}
          <div
            aria-hidden
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage:
                "radial-gradient(circle at 1px 1px, rgba(168,72,24,0.10) 1px, transparent 0)",
              backgroundSize: "5px 5px",
              opacity: 0.55,
              mixBlendMode: "multiply",
            }}
          />

          {/* "POSTCARD" header */}
          <div
            className="absolute"
            style={{
              top: "10px",
              left: 0,
              right: 0,
              textAlign: "center",
              fontFamily: "Georgia, serif",
              fontWeight: 700,
              fontSize: "13px",
              color: "#A84818",
              letterSpacing: "0.42em",
            }}
          >
            POST CARD
          </div>
          <div
            className="absolute"
            style={{
              top: "26px",
              left: "16%",
              right: "16%",
              borderBottom: "1px solid rgba(168,72,24,0.45)",
            }}
          />

          {/* Vertical divider down the middle */}
          <div
            className="absolute"
            style={{
              top: "34px",
              bottom: "12px",
              left: "50%",
              transform: "translateX(-50%)",
              width: "1px",
              background:
                "repeating-linear-gradient(180deg, rgba(168,72,24,0.5) 0 4px, transparent 4px 8px)",
            }}
          />

          {/* LEFT: handwritten message */}
          <div
            className="absolute"
            style={{
              top: "42px",
              left: "12px",
              right: "50%",
              bottom: "12px",
              paddingRight: "12px",
            }}
          >
            <div
              style={{
                fontFamily: "Georgia, serif",
                fontStyle: "italic",
                fontSize: "11.5px",
                color: "#3A2415",
                lineHeight: "16px",
                background:
                  "repeating-linear-gradient(180deg, transparent 0 15px, rgba(168,72,24,0.18) 15px 16px)",
              }}
            >
              <p style={{ margin: 0 }}>Dear shop owner,</p>
              <p style={{ margin: 0 }}>&nbsp;</p>
              <p style={{ margin: 0 }}>Just spent the morning on Route&nbsp;9 —</p>
              <p style={{ margin: 0 }}>good coffee at the corner café, the</p>
              <p style={{ margin: 0 }}>bakery line out the door. Folks here</p>
              <p style={{ margin: 0 }}>still go to the shops they trust.</p>
              <p style={{ margin: 0 }}>Let&apos;s make sure they can find yours.</p>
              <p style={{ margin: 0 }}>&nbsp;</p>
              <p style={{ margin: 0 }}>— Amit</p>
            </div>
          </div>

          {/* Postage stamp — stamped in the top-right corner of the
              postcard back (a real postcard's stamp sits at the very
              edge, not nestled inside the right column). */}
          <div
            className="absolute"
            style={{
              top: "8px",
              right: "8px",
              width: "64px",
              height: "76px",
              padding: "3px",
              background: "#FFF6E2",
              border: "1px dashed rgba(168,72,24,0.55)",
              boxShadow: "0 1px 2px rgba(28,18,9,0.18)",
              zIndex: 2,
            }}
          >
            <div className="flex items-center justify-center w-full h-full overflow-hidden">
              <BrandSeal size={68} tilt={0} tagline="MA · 26¢" />
            </div>
          </div>

          {/* Postmark — circular cancellation overlapping the stamp's
              bottom-left, also pulled up to the top-right corner */}
          <svg
            viewBox="0 0 80 80"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden
            className="absolute"
            style={{
              top: "44px",
              right: "44px",
              width: "56px",
              height: "56px",
              transform: "rotate(-12deg)",
              opacity: 0.62,
              pointerEvents: "none",
              zIndex: 3,
            }}
          >
            <circle cx="40" cy="40" r="34" fill="none" stroke="#1C1209" strokeWidth="1.5" />
            <circle cx="40" cy="40" r="29" fill="none" stroke="#1C1209" strokeWidth="0.6" />
            <text x="40" y="32" textAnchor="middle" fontSize="6.5" fontFamily="monospace" fontWeight="700" fill="#1C1209" letterSpacing="0.8">SHREWSBURY</text>
            <text x="40" y="42" textAnchor="middle" fontSize="9" fontFamily="Georgia, serif" fontWeight="700" fill="#1C1209">MAY 2026</text>
            <text x="40" y="52" textAnchor="middle" fontSize="5.5" fontFamily="monospace" fontWeight="700" fill="#1C1209" letterSpacing="0.6">MASS · ROUTE 9</text>
            {/* Cancellation wave lines */}
            <path d="M-10 60 q15 -4 30 0 q15 4 30 0 q15 -4 30 0 q15 4 30 0" stroke="#1C1209" strokeWidth="0.7" fill="none" />
            <path d="M-10 66 q15 -4 30 0 q15 4 30 0 q15 -4 30 0 q15 4 30 0" stroke="#1C1209" strokeWidth="0.7" fill="none" />
            <path d="M-10 72 q15 -4 30 0 q15 4 30 0 q15 -4 30 0 q15 4 30 0" stroke="#1C1209" strokeWidth="0.7" fill="none" />
          </svg>

          {/* RIGHT: address area only (stamp + postmark moved out) */}
          <div
            className="absolute"
            style={{
              top: "94px",
              left: "50%",
              right: "12px",
              bottom: "12px",
              paddingLeft: "14px",
            }}
          >
            {/* Address lines */}
            <div
              className="absolute"
              style={{
                bottom: "10px",
                left: "14px",
                right: "8px",
                fontFamily: "Georgia, serif",
                fontStyle: "italic",
                fontSize: "12px",
                color: "#3A2415",
                lineHeight: "20px",
              }}
            >
              <p style={{ margin: 0 }}>To the shop owner,</p>
              <div style={{ height: "1px", background: "rgba(168,72,24,0.45)", marginTop: "2px" }} />
              <p style={{ margin: "6px 0 0 0" }}>Somewhere along</p>
              <div style={{ height: "1px", background: "rgba(168,72,24,0.45)", marginTop: "2px" }} />
              <p style={{ margin: "6px 0 0 0" }}>Route&nbsp;9, MA</p>
              <div style={{ height: "1px", background: "rgba(168,72,24,0.45)", marginTop: "2px" }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
