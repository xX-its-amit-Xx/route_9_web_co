"use client";

/**
 * Vintage corkboard with five pinned polaroid photos showing scenes
 * from along Route 9. Each polaroid has the classic white border + a
 * piece of masking tape at the top, sits at a slightly different
 * rotation, and has a handwritten Georgia-italic caption underneath.
 *
 * Pure HTML + CSS + real Unsplash photos. Decorative (aria-hidden).
 * No animations — purely a static dressing element.
 */

// Push-pin head tones — [specular, body, shadow core] per pin, cycling
// through burnt orange, brass and dark ember so the set feels hand-picked.
const PIN_TONES = [
  ["#FFC488", "#D4682A", "#7E3810"],
  ["#FFE9B0", "#C89B4A", "#6E4414"],
  ["#C09068", "#5A3A1E", "#241206"],
] as const;

const POLAROIDS = [
  {
    photo: "1517248135467-4c7edcad34c4",
    caption: "Saturday morning",
    tilt: -6,
    tape: -2,
  },
  {
    photo: "1493857671505-72967e2e2760",
    caption: "Coffee on the corner",
    tilt: 4,
    tape: 5,
  },
  {
    photo: "1554118811-1e0d58224f24",
    caption: "9 a.m. opening",
    tilt: -3,
    tape: -8,
  },
  {
    photo: "1509440159596-0249088772ff",
    caption: "Fresh out of the oven",
    tilt: 5,
    tape: 3,
  },
  {
    photo: "1585747860715-2ba37e788b70",
    caption: "Walk-ins welcome",
    tilt: -4,
    tape: 1,
  },
];

export function PolaroidPinboard() {
  return (
    <div
      aria-hidden
      className="polaroid-pinboard relative w-full select-none"
      style={{
        padding: "26px 16px 36px",
        borderRadius: "14px",
        // Cork board base — warm wood-cork radial with darker rim
        background:
          "radial-gradient(ellipse at 50% 30%, #B58050 0%, #8E5A30 55%, #5E3818 100%)",
        boxShadow:
          "0 6px 20px rgba(28,18,9,0.28), 0 2px 4px rgba(28,18,9,0.18), inset 0 0 0 1px rgba(28,18,9,0.35), inset 2px 3px 5px rgba(255,200,140,0.16), inset 0 -4px 10px rgba(28,18,9,0.35)",
      }}
    >
      {/* Cork mottling — large soft light/dark blotches for material depth */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          borderRadius: "14px",
          background:
            "radial-gradient(140px 90px at 18% 30%, rgba(255,205,150,0.14), transparent 70%)," +
            "radial-gradient(180px 110px at 72% 22%, rgba(60,34,14,0.18), transparent 70%)," +
            "radial-gradient(160px 100px at 40% 78%, rgba(255,195,130,0.1), transparent 70%)," +
            "radial-gradient(200px 120px at 88% 70%, rgba(50,28,10,0.16), transparent 70%)," +
            "radial-gradient(90px 60px at 8% 85%, rgba(60,34,14,0.14), transparent 70%)",
        }}
      />

      {/* Cork stipple pattern overlay — radial-gradient dots */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          borderRadius: "14px",
          backgroundImage:
            "radial-gradient(circle at 50% 50%, rgba(28,18,9,0.22) 1.1px, transparent 1.2px)," +
            "radial-gradient(circle at 30% 70%, rgba(255,210,150,0.18) 0.8px, transparent 0.9px)",
          backgroundSize: "5px 5px, 8px 8px",
          opacity: 0.65,
          mixBlendMode: "multiply",
        }}
      />

      {/* Wood frame outline */}
      <div
        aria-hidden
        className="absolute pointer-events-none"
        style={{
          inset: "6px",
          borderRadius: "10px",
          border: "1px dashed rgba(28,18,9,0.3)",
        }}
      />

      {/* Small "ROUTE 9 · SHOTS" header tape strip — anchored top-left */}
      <div
        aria-hidden
        className="absolute"
        style={{
          top: "10px",
          left: "18px",
          padding: "3px 12px",
          background:
            "linear-gradient(180deg, rgba(255,250,230,0.82) 0%, rgba(240,226,190,0.72) 100%)",
          color: "rgba(28,18,9,0.78)",
          fontFamily: "monospace",
          fontWeight: 800,
          fontSize: "9px",
          letterSpacing: "0.24em",
          transform: "rotate(-2deg)",
          boxShadow:
            "0 2px 4px rgba(28,18,9,0.3), inset 0 1px 0 rgba(255,255,255,0.5), inset 0 -1px 0 rgba(120,90,50,0.22)",
          // Tape's rip-edges via clip-path
          clipPath:
            "polygon(0% 30%, 6% 0%, 14% 35%, 22% 5%, 30% 28%, 38% 0%, 50% 32%, 62% 4%, 72% 30%, 82% 0%, 92% 36%, 100% 8%, 100% 70%, 94% 100%, 86% 65%, 76% 100%, 66% 70%, 56% 100%, 46% 70%, 36% 100%, 26% 70%, 16% 100%, 6% 70%, 0% 100%)",
        }}
      >
        ROUTE 9 · SHOTS
      </div>

      <div className="relative flex flex-wrap justify-center items-end gap-6 pt-6">
        {POLAROIDS.map((p, i) => (
          <div
            key={p.photo}
            className="relative flex-shrink-0"
            style={{
              transform: `rotate(${p.tilt}deg)`,
              filter:
                "drop-shadow(0 8px 14px rgba(28,18,9,0.32)) drop-shadow(0 2px 4px rgba(28,18,9,0.22)) drop-shadow(0 1px 1px rgba(28,18,9,0.28))",
            }}
          >
            {/* Masking tape at the top — translucent, lit top edge */}
            <div
              aria-hidden
              className="absolute"
              style={{
                top: "-10px",
                left: "50%",
                transform: `translateX(-50%) rotate(${p.tape}deg)`,
                width: "48px",
                height: "14px",
                background:
                  "linear-gradient(180deg, rgba(243,233,213,0.74) 0%, rgba(220,200,150,0.6) 100%)",
                boxShadow:
                  "0 1px 2px rgba(28,18,9,0.3), inset 0 1px 0 rgba(255,255,255,0.45), inset 0 -1px 0 rgba(120,90,50,0.25)",
                zIndex: 2,
                clipPath:
                  "polygon(2% 0%, 100% 0%, 98% 100%, 0% 100%)",
              }}
            />

            {/* Push-pin — glossy 3D sphere punched through the tape */}
            <div
              aria-hidden
              className="absolute"
              style={{
                top: "-17px",
                left: `${44 + ((i * 7) % 15)}%`,
                width: "13px",
                height: "13px",
                zIndex: 3,
              }}
            >
              {/* Cast shadow on the cork, offset from the key light */}
              <div
                style={{
                  position: "absolute",
                  top: "9px",
                  left: "2px",
                  width: "13px",
                  height: "7px",
                  borderRadius: "50%",
                  background:
                    "radial-gradient(ellipse at 50% 50%, rgba(28,18,9,0.42) 0%, transparent 70%)",
                }}
              />
              {/* Steel needle stub under the head */}
              <div
                style={{
                  position: "absolute",
                  top: "11px",
                  left: "50%",
                  width: "1.5px",
                  height: "5px",
                  transform: "translateX(-50%)",
                  background:
                    "linear-gradient(180deg, rgba(150,130,105,0.95) 0%, rgba(40,25,12,0.9) 100%)",
                }}
              />
              {/* Sphere head */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  borderRadius: "50%",
                  background: `radial-gradient(circle at 34% 28%, ${PIN_TONES[i % PIN_TONES.length][0]} 0%, ${PIN_TONES[i % PIN_TONES.length][1]} 48%, ${PIN_TONES[i % PIN_TONES.length][2]} 100%)`,
                  boxShadow:
                    "inset -1px -1.5px 2px rgba(0,0,0,0.35), inset 1px 1px 1px rgba(255,255,255,0.22), 0 1px 2px rgba(28,18,9,0.4)",
                }}
              />
              {/* Specular glint */}
              <div
                style={{
                  position: "absolute",
                  top: "2px",
                  left: "3px",
                  width: "3px",
                  height: "2px",
                  borderRadius: "50%",
                  background: "rgba(255,255,255,0.75)",
                  transform: "rotate(-25deg)",
                }}
              />
            </div>

            {/* Polaroid white frame — real paper thickness */}
            <div
              style={{
                width: "132px",
                padding: "8px 8px 28px",
                background:
                  "linear-gradient(180deg, #FDF8E9 0%, #F3E9D5 100%)",
                boxShadow:
                  "inset 0 1px 0 rgba(255,255,255,0.9), inset 0 0 0 0.5px rgba(28,18,9,0.18), inset -1.5px -2px 3px rgba(150,120,80,0.28)",
                borderRadius: "1.5px",
              }}
            >
              {/* Photo */}
              <div
                style={{
                  width: "116px",
                  height: "116px",
                  background: "#1C1209",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <img
                  src={`https://images.unsplash.com/photo-${p.photo}?w=200&auto=format&fit=crop&q=80`}
                  alt=""
                  loading="lazy"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block",
                    // Subtle warm sepia for that "old photo" feel
                    filter: "sepia(0.18) saturate(0.85) contrast(1.04)",
                  }}
                />
                {/* Inner shadow + glossy emulsion glare — the photo area reads
                    shiny against the matte paper frame */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background:
                      "linear-gradient(112deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.06) 26%, transparent 42%)",
                    boxShadow:
                      "inset 0 0 24px rgba(28,18,9,0.32), inset 0 0 0 0.5px rgba(28,18,9,0.45), inset 0 1px 1px rgba(28,18,9,0.3)",
                  }}
                />
              </div>

              {/* Caption — handwritten Georgia italic, hand-positioned */}
              <div
                style={{
                  marginTop: "8px",
                  fontFamily: "Georgia, 'Times New Roman', serif",
                  fontStyle: "italic",
                  fontWeight: 600,
                  fontSize: "10.5px",
                  color: "#3A2415",
                  textAlign: "center",
                  letterSpacing: "0.02em",
                  // Slightly off-axis like a real handwritten caption
                  transform: `rotate(${i % 2 === 0 ? -1 : 1}deg)`,
                }}
              >
                {p.caption}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Small handwritten "Route 9, Spring '26" caption at bottom-right */}
      <div
        aria-hidden
        className="absolute"
        style={{
          right: "20px",
          bottom: "12px",
          fontFamily: "Georgia, serif",
          fontStyle: "italic",
          fontSize: "11px",
          fontWeight: 600,
          color: "rgba(255,235,200,0.6)",
          letterSpacing: "0.06em",
          transform: "rotate(-3deg)",
        }}
      >
        — Route 9, Spring &apos;26
      </div>
    </div>
  );
}
