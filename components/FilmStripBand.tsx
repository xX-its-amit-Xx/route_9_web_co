"use client";

// Six real Unsplash photos — same set used in Portfolio cards + Hero collage.
// Doubled so the CSS translateX(-50%) loop is seamless.
const FRAMES = [
  { id: "1513104890138-7c749659a591", label: "PIZZERIA" },
  { id: "1554118811-1e0d58224f24",   label: "CAFÉ"     },
  { id: "1521590832167-7bcbfaa6381f", label: "BARBER"   },
  { id: "1517248135467-4c7edcad34c4", label: "DINING"   },
  { id: "1585747860715-2ba37e788b70", label: "SHOPS"    },
  { id: "1441986300917-64674bd600d8", label: "STORES"   },
];

const STRIP = [...FRAMES, ...FRAMES]; // double → seamless 50% loop

const RAIL_H   = 14;   // px — sprocket rail height top & bottom
const FRAME_W  = 128;  // px — width of each frame cell
const TOTAL_H  = 110;  // px — full strip height
const PHOTO_H  = TOTAL_H - RAIL_H * 2;

// Three sprocket holes per frame width, matching 35mm aesthetics
const SPROCKETS = [0, 1, 2] as const;

function SprocketRail() {
  return (
    <div
      className="flex-shrink-0 flex items-center justify-around px-3"
      style={{ height: `${RAIL_H}px`, background: "#0C0806" }}
    >
      {SPROCKETS.map((i) => (
        <div
          key={i}
          style={{
            width: "11px",
            height: "7px",
            borderRadius: "1.5px",
            background: "#060402",
            border: "0.5px solid rgba(255,255,255,0.03)",
            boxShadow:
              "inset 0 0.5px 0 rgba(0,0,0,0.9), 0 0.5px 0 rgba(255,255,255,0.025)",
          }}
        />
      ))}
    </div>
  );
}

export function FilmStripBand() {
  return (
    <div
      className="relative overflow-hidden select-none"
      style={{
        background: "#080503",
        height: `${TOTAL_H}px`,
        borderTop:    "1px solid rgba(212,104,42,0.07)",
        borderBottom: "1px solid rgba(212,104,42,0.07)",
      }}
      aria-hidden
    >
      {/* ── Edge fade masks ── */}
      <div
        className="absolute left-0 top-0 bottom-0 w-24 pointer-events-none z-10"
        style={{ background: "linear-gradient(90deg, #080503 0%, transparent 100%)" }}
      />
      <div
        className="absolute right-0 top-0 bottom-0 w-24 pointer-events-none z-10"
        style={{ background: "linear-gradient(270deg, #080503 0%, transparent 100%)" }}
      />

      {/* ── Scrolling film track ── */}
      <div
        className="film-strip-advance flex"
        style={{ width: "max-content", height: "100%" }}
      >
        {STRIP.map(({ id, label }, i) => (
          <div
            key={i}
            className="relative flex-shrink-0 flex flex-col"
            style={{ width: `${FRAME_W}px` }}
          >
            {/* Top rail */}
            <SprocketRail />

            {/* Photo frame */}
            <div
              className="relative overflow-hidden"
              style={{
                height: `${PHOTO_H}px`,
                borderLeft:  "2px solid #0C0806",
                borderRight: "2px solid #0C0806",
              }}
            >
              <img
                src={`https://images.unsplash.com/photo-${id}?w=200&auto=format&fit=crop&q=70`}
                alt=""
                loading="lazy"
                className="w-full h-full object-cover"
                style={{
                  filter:
                    "sepia(0.30) saturate(0.75) brightness(0.80) contrast(1.10)",
                }}
              />

              {/* Frame number — top-right corner */}
              <span
                style={{
                  position: "absolute",
                  top: "3px",
                  right: "4px",
                  fontSize: "6px",
                  fontFamily: "'Courier New', Courier, monospace",
                  fontWeight: 700,
                  color: "rgba(255,215,130,0.55)",
                  letterSpacing: "0.06em",
                  lineHeight: 1,
                  userSelect: "none",
                }}
              >
                {String((i % FRAMES.length) + 1).padStart(2, "0")}A
              </span>

              {/* Business-type label — bottom-left */}
              <span
                style={{
                  position: "absolute",
                  bottom: "3px",
                  left: "4px",
                  fontSize: "5.5px",
                  fontFamily: "'Courier New', Courier, monospace",
                  fontWeight: 700,
                  color: "rgba(255,215,130,0.35)",
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  lineHeight: 1,
                  userSelect: "none",
                }}
              >
                {label}
              </span>

              {/* Lens vignette */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.52) 100%)",
                  pointerEvents: "none",
                }}
              />

              {/* Film-scratch highlight — thin diagonal scratch line */}
              {i % 3 === 1 && (
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    bottom: 0,
                    left: "38%",
                    width: "0.5px",
                    background:
                      "linear-gradient(180deg, transparent 0%, rgba(255,255,255,0.08) 30%, rgba(255,255,255,0.12) 50%, rgba(255,255,255,0.06) 70%, transparent 100%)",
                    pointerEvents: "none",
                  }}
                />
              )}
            </div>

            {/* Bottom rail */}
            <SprocketRail />
          </div>
        ))}
      </div>

      {/* ── Film data strip — manufacturer / exposure text, scrolls slower ── */}
      <div
        className="absolute left-0 right-0 overflow-hidden pointer-events-none"
        style={{ bottom: 0, height: "6px", zIndex: 2 }}
      >
        <div
          className="film-data-scroll whitespace-nowrap"
          style={{
            fontSize: "4.5px",
            fontFamily: "'Courier New', Courier, monospace",
            fontWeight: 700,
            letterSpacing: "0.28em",
            color: "rgba(212,104,42,0.22)",
            textTransform: "uppercase",
            lineHeight: "6px",
            display: "inline-block",
          }}
        >
          {Array.from({ length: 10 }).map((_, i) => (
            <span key={i}>
              {"  "}ROUTE 9 FILMS · SHREWSBURY MA · 35mm SAFETY FILM ·
              ISO 400 · KODACHROME · EST. {new Date().getFullYear()}
              {"  "}&nbsp;
            </span>
          ))}
        </div>
      </div>

      {/* ── Projector-gate flicker — brief brightness pulse every ~5s ── */}
      <div
        className="absolute inset-0 pointer-events-none film-gate-flicker"
        style={{ zIndex: 3, background: "rgba(255,240,200,0)" }}
      />
    </div>
  );
}
