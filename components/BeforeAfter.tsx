"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronsLeftRight, Clock, Lock } from "lucide-react";
import { useScrollReveal } from "@/lib/useScrollReveal";

/* ────────────────────────────────────────────────────────────────────────────
   BeforeAfter — draggable "glow-up" comparison
   One browser frame, two complete mini-sites for the same fictional pizzeria:
   a lovingly accurate 2009 disaster on the left, a calm modern slice on the
   right, split by a draggable brass divider (clip-path on the top layer).
   Keyboard accessible via a visually-hidden <input type="range"> whose value
   IS the divider position; the visible grip reflects its focus state.
   ──────────────────────────────────────────────────────────────────────── */

const DEFAULT_POS = 62; // mostly BEFORE, for comedy
const TOUR_MS = 1600;
const TOUR_MIN = 30; // 62 → 30 → 62
const REDUCED_MQ = "(prefers-reduced-motion: reduce)";
const PIZZA_IMG =
  "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&auto=format&fit=crop&q=80";

const SCOPED_CSS = `
/* Blink — slow, steps only, never fully invisible (and never seizure-y) */
@keyframes ba-blink {
  0%, 49%  { opacity: 1; }
  50%, 100% { opacity: 0.3; }
}
.ba-blink { animation: ba-blink 1s steps(1, end) infinite; }

/* Marquee — transform-only scroll; content is duplicated so -50% loops */
@keyframes ba-marquee {
  from { transform: translateX(0); }
  to   { transform: translateX(-50%); }
}
.ba-marquee-inner {
  display: inline-flex;
  white-space: nowrap;
  animation: ba-marquee 14s linear infinite;
  will-change: transform;
}

/* Visually-hidden range: real slider semantics + arrow keys, zero pixels.
   pointer-events off so the custom pointer-drag on the frame owns the mouse. */
.ba-range {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 44px;
  height: 44px;
  transform: translate(-50%, -50%);
  opacity: 0;
  margin: 0;
  pointer-events: none;
}

/* When the hidden range has keyboard focus, ring the visible grip */
.ba-range:focus-visible + .ba-grip {
  outline: 3px solid #FFF8EE;
  outline-offset: 2px;
  box-shadow: 0 0 0 6px rgba(168, 72, 24, 0.95), 0 4px 14px rgba(28, 18, 9, 0.4);
}

@media (prefers-reduced-motion: reduce) {
  .ba-blink { animation: none; }
  .ba-marquee-inner { animation: none; }
}
`;

/* ── BEFORE: Geno's Pizza, proudly last updated in 2009 ─────────────────── */
function BeforeSite() {
  return (
    <div
      className="absolute inset-0 flex flex-col items-center overflow-hidden text-center select-none"
      style={{
        fontFamily: '"Times New Roman", Times, serif',
        color: "#00008B",
        backgroundColor: "#FFF6F6",
        backgroundImage:
          "repeating-linear-gradient(0deg, rgba(205,35,35,0.30) 0 11px, transparent 11px 22px), repeating-linear-gradient(90deg, rgba(205,35,35,0.30) 0 11px, transparent 11px 22px)",
      }}
    >
      {/* Phone-number marquee strip */}
      <div
        className="w-full overflow-hidden flex-shrink-0"
        style={{ background: "#000080", color: "#FFFF00", padding: "2px 0" }}
      >
        <div className="ba-marquee-inner" style={{ fontSize: "10px", fontWeight: 700 }}>
          {[0, 1].map((i) => (
            <span key={i} style={{ paddingRight: "40px" }} aria-hidden={i === 1}>
              *** CALL NOW: (508) 555-0134 *** FREE DELIVERY (3 MILE RADIUS) ***
              ASK ABOUT OUR CALZONE SPECIAL!!! *** CALL NOW: (508) 555-0134 ***
            </span>
          ))}
        </div>
      </div>

      {/* Blinking welcome */}
      <div
        className="ba-blink"
        style={{
          marginTop: "8px",
          fontFamily: '"Comic Sans MS", "Comic Sans", cursive',
          fontSize: "11px",
          fontWeight: 700,
          color: "#CC0000",
        }}
      >
        ~*~ WELCOME TO GENO&apos;S PIZZA!!! ~*~
      </div>

      {/* Rainbow WordArt heading */}
      <div
        style={{
          fontFamily: '"Comic Sans MS", "Comic Sans", cursive',
          fontSize: "clamp(20px, 3.4vw, 30px)",
          fontWeight: 700,
          fontStyle: "italic",
          lineHeight: 1.05,
          transform: "skewY(-3deg)",
          background:
            "linear-gradient(90deg, #FF0000, #FF9900, #FFEE00, #00CC00, #0066FF, #9900FF)",
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          WebkitTextFillColor: "transparent",
          color: "transparent",
          filter: "drop-shadow(2px 2px 0 rgba(0,0,0,0.35))",
        }}
      >
        GENO&apos;S PIZZA
      </div>

      {/* Cheesy flat pizza clip-art */}
      <svg
        viewBox="0 0 80 80"
        aria-hidden
        style={{ width: "clamp(52px, 9vw, 76px)", marginTop: "4px", imageRendering: "pixelated" }}
      >
        <circle cx="40" cy="40" r="36" fill="#D9A441" stroke="#8B5A18" strokeWidth="3" />
        <circle cx="40" cy="40" r="29" fill="#E23B22" />
        <circle cx="40" cy="40" r="26" fill="#F7C948" />
        <g stroke="#D9A441" strokeWidth="2">
          <line x1="40" y1="14" x2="40" y2="66" />
          <line x1="14" y1="40" x2="66" y2="40" />
          <line x1="22" y1="22" x2="58" y2="58" />
          <line x1="58" y1="22" x2="22" y2="58" />
        </g>
        {[
          [30, 26], [50, 28], [26, 44], [44, 46], [54, 50], [36, 58],
        ].map(([cx, cy]) => (
          <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="4" fill="#B71C1C" stroke="#7A0F0F" strokeWidth="1" />
        ))}
      </svg>

      {/* Beveled "table" with the menu link */}
      <div
        style={{
          marginTop: "6px",
          background: "#FFFFCC",
          border: "3px outset #C0C0C0",
          padding: "4px 10px",
          fontSize: "10.5px",
        }}
      >
        <span style={{ fontWeight: 700 }}>Click </span>
        <span style={{ color: "#0000EE", textDecoration: "underline", fontWeight: 700 }}>
          HERE
        </span>
        <span style={{ fontWeight: 700 }}> for our MENU!!! (opens in new window)</span>
        <br />
        <span style={{ fontSize: "9.5px", color: "#333" }}>
          Large Cheese $9.99 · Toppings 75&cent; each · CASH ONLY
        </span>
      </div>

      {/* Under Construction banner */}
      <div
        style={{
          marginTop: "7px",
          width: "72%",
          padding: "3px 0",
          fontSize: "10px",
          fontWeight: 700,
          letterSpacing: "0.08em",
          color: "#000",
          background:
            "repeating-linear-gradient(45deg, #FFD400 0 10px, #111 10px 20px)",
        }}
      >
        <span style={{ background: "#FFD400", padding: "1px 8px", border: "1px solid #111" }}>
          !! UNDER CONSTRUCTION !!
        </span>
      </div>

      {/* Visitor counter + IE6 badge */}
      <div className="flex items-center justify-center gap-2 flex-wrap" style={{ marginTop: "8px" }}>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "4px",
            background: "#000",
            color: "#39FF14",
            fontFamily: '"Courier New", monospace',
            fontSize: "10px",
            fontWeight: 700,
            padding: "2px 6px",
            border: "2px inset #808080",
          }}
        >
          Visitors: 003847
        </div>
        <div
          style={{
            fontSize: "8.5px",
            background: "#D4D0C8",
            color: "#222",
            border: "2px outset #FFF",
            padding: "2px 6px",
            fontFamily: "Verdana, Geneva, sans-serif",
          }}
        >
          Best viewed in Internet Explorer 6 at 800x600
        </div>
      </div>

      <div
        style={{
          marginTop: "6px",
          fontSize: "9px",
          fontStyle: "italic",
          color: "#8B0000",
          fontFamily: '"Comic Sans MS", "Comic Sans", cursive',
        }}
      >
        (C) 2009 Geno · Site by Geno&apos;s nephew · Sign our guestbook!!!
      </div>
    </div>
  );
}

/* ── AFTER: the same shop, calm and premium ─────────────────────────────── */
const AFTER_ACCENT = "#D4682A";
const AFTER_INK = "#A84818";

function AfterSite() {
  return (
    <div
      className="absolute inset-0 flex flex-col overflow-hidden select-none"
      style={{ background: "#FBF8F2", color: "#241B12" }}
    >
      {/* Mini-nav */}
      <div
        className="flex items-center justify-between px-3 flex-shrink-0"
        style={{
          height: "34px",
          background: "rgba(253,251,247,0.97)",
          borderBottom: "1px solid rgba(36,27,18,0.08)",
        }}
      >
        <div className="flex items-center gap-1.5 min-w-0">
          <span
            className="flex-shrink-0"
            style={{ width: "8px", height: "8px", borderRadius: "3px", background: AFTER_ACCENT }}
          />
          <span
            className="truncate"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "11.5px",
              fontWeight: 700,
              letterSpacing: "-0.01em",
            }}
          >
            Geno&apos;s Pizza
          </span>
        </div>
        <div className="flex items-center gap-2.5 flex-shrink-0">
          {["Menu", "Story", "Visit"].map((l) => (
            <span
              key={l}
              className="hidden sm:inline"
              style={{ fontSize: "8.5px", fontWeight: 600, color: "rgba(36,27,18,0.55)" }}
            >
              {l}
            </span>
          ))}
          <span
            style={{
              fontSize: "8.5px",
              fontWeight: 700,
              color: "#FFF8EE",
              background: `linear-gradient(150deg, ${AFTER_ACCENT}, ${AFTER_INK})`,
              padding: "3.5px 9px",
              borderRadius: "6px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.18)",
            }}
          >
            Order Online
          </span>
        </div>
      </div>

      {/* Photo hero */}
      <div className="relative flex-shrink-0 overflow-hidden" style={{ height: "46%" }}>
        <img
          src={PIZZA_IMG}
          alt=""
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover"
          draggable={false}
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(to bottom, rgba(12,8,4,0.22) 0%, transparent 40%, rgba(12,8,4,0.76) 100%)",
          }}
        />
        <div className="absolute left-3 right-3 bottom-2.5">
          <div
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(14px, 2vw, 17px)",
              fontWeight: 700,
              lineHeight: 1.1,
              color: "#FFF8EE",
              textShadow: "0 1px 8px rgba(0,0,0,0.45)",
            }}
          >
            Geno&apos;s Pizza
          </div>
          <div style={{ fontSize: "9px", color: "rgba(255,248,238,0.85)", marginTop: "2px" }}>
            Wood-fired pies on Route 9 · since 1987
          </div>
        </div>
      </div>

      {/* Menu slice with dotted leaders */}
      <div className="flex-1 min-h-0 px-4 pt-2.5 pb-2 overflow-hidden">
        <div
          style={{
            fontSize: "7.5px",
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            color: AFTER_ACCENT,
            fontWeight: 700,
            marginBottom: "4px",
          }}
        >
          From the oven
        </div>
        {[
          { item: "Margherita", price: "$14" },
          { item: "Geno's Special", price: "$18" },
        ].map((r) => (
          <div key={r.item} className="flex items-baseline gap-1.5" style={{ padding: "4px 0" }}>
            <span className="flex-shrink-0" style={{ fontSize: "10px", fontWeight: 600 }}>
              {r.item}
            </span>
            <span
              aria-hidden
              className="flex-1"
              style={{ borderBottom: "1.5px dotted rgba(36,27,18,0.28)", transform: "translateY(-2px)" }}
            />
            <span className="flex-shrink-0" style={{ fontSize: "10px", fontWeight: 700, color: AFTER_INK }}>
              {r.price}
            </span>
          </div>
        ))}
        <div className="flex items-center gap-2 flex-wrap" style={{ marginTop: "9px" }}>
          <span
            className="inline-flex items-center gap-1"
            style={{
              fontSize: "8.5px",
              fontWeight: 700,
              color: "#FFF8EE",
              background: `linear-gradient(150deg, ${AFTER_ACCENT}, ${AFTER_INK})`,
              padding: "4px 10px",
              borderRadius: "7px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.25), 0 1px 0 rgba(255,255,255,0.18) inset",
            }}
          >
            Order Online <span aria-hidden>&rarr;</span>
          </span>
          <span
            className="inline-flex items-center gap-1"
            style={{
              fontSize: "7.5px",
              fontWeight: 600,
              color: "rgba(36,27,18,0.72)",
              border: "1px solid rgba(36,27,18,0.14)",
              background: "rgba(36,27,18,0.03)",
              padding: "3.5px 9px",
              borderRadius: "9999px",
            }}
          >
            <Clock size={8} color={AFTER_ACCENT} aria-hidden /> Open till 10pm tonight
          </span>
        </div>
      </div>
    </div>
  );
}

/* ── Main section ───────────────────────────────────────────────────────── */
export function BeforeAfter() {
  const sectionRef = useScrollReveal<HTMLElement>();
  const frameRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState(DEFAULT_POS);

  const draggingRef = useRef(false);
  const pendingXRef = useRef(0);
  const moveRafRef = useRef<number | null>(null);
  const tourRafRef = useRef<number | null>(null);
  const tourDoneRef = useRef(false);
  const interactedRef = useRef(false);

  const stopTour = useCallback(() => {
    interactedRef.current = true;
    if (tourRafRef.current !== null) {
      cancelAnimationFrame(tourRafRef.current);
      tourRafRef.current = null;
    }
  }, []);

  const applyFromClientX = useCallback((clientX: number) => {
    const el = frameRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    if (r.width === 0) return;
    const pct = ((clientX - r.left) / r.width) * 100;
    setPos(Math.min(100, Math.max(0, pct)));
  }, []);

  /* Pointer drag — capture on down, rAF-throttle moves */
  const onPointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (e.button !== 0 && e.pointerType === "mouse") return;
      stopTour();
      draggingRef.current = true;
      e.currentTarget.setPointerCapture(e.pointerId);
      applyFromClientX(e.clientX);
    },
    [applyFromClientX, stopTour],
  );

  const onPointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!draggingRef.current) return;
      pendingXRef.current = e.clientX;
      if (moveRafRef.current === null) {
        moveRafRef.current = requestAnimationFrame(() => {
          moveRafRef.current = null;
          if (draggingRef.current) applyFromClientX(pendingXRef.current);
        });
      }
    },
    [applyFromClientX],
  );

  const endDrag = useCallback(() => {
    draggingRef.current = false;
  }, []);

  /* First-view tour: 62 → 30 → 62 over 1.6s (skipped under reduced motion,
     cancelled instantly by any interaction) */
  useEffect(() => {
    const el = frameRef.current;
    if (!el) return;
    if (window.matchMedia(REDUCED_MQ).matches) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || tourDoneRef.current) return;
        tourDoneRef.current = true;
        io.disconnect();
        if (interactedRef.current) return;
        const amp = DEFAULT_POS - TOUR_MIN;
        const t0 = performance.now();
        const tick = (now: number) => {
          if (interactedRef.current) return;
          const p = Math.min(1, (now - t0) / TOUR_MS);
          // cosine dip: 62 → 30 → 62, smooth in and out
          setPos(DEFAULT_POS - amp * 0.5 * (1 - Math.cos(2 * Math.PI * p)));
          if (p < 1) tourRafRef.current = requestAnimationFrame(tick);
          else tourRafRef.current = null;
        };
        tourRafRef.current = requestAnimationFrame(tick);
      },
      { threshold: 0.45 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      if (tourRafRef.current !== null) cancelAnimationFrame(tourRafRef.current);
      if (moveRafRef.current !== null) cancelAnimationFrame(moveRafRef.current);
    };
  }, []);

  const beforeLabelOpacity = Math.min(1, Math.max(0, (pos - 8) / 12));
  const afterLabelOpacity = Math.min(1, Math.max(0, (92 - pos) / 12));

  return (
    <section
      ref={sectionRef}
      id="before-after"
      aria-labelledby="before-after-heading"
      className="py-24 md:py-32"
      style={{ background: "var(--section-warm-a)" }}
    >
      <style>{SCOPED_CSS}</style>
      <div className="max-w-7xl mx-auto px-6">
        {/* Heading block */}
        <div className="max-w-2xl mx-auto text-center mb-12 md:mb-16">
          <div className="label-pill mb-4 reveal">The glow-up</div>
          <h2
            id="before-after-heading"
            className="reveal text-3xl md:text-4xl lg:text-5xl font-bold text-fg leading-tight"
            style={{ fontFamily: "var(--font-display)", transitionDelay: "80ms" }}
          >
            Drag yourself out of 2009.
          </h2>
          <p
            className="reveal mt-4 text-base md:text-lg text-muted"
            style={{ transitionDelay: "160ms" }}
          >
            Same pizzeria, same menu, same phone number — the only thing that
            changed is whether people trust it enough to order.
          </p>
        </div>

        {/* Browser frame */}
        <div className="reveal max-w-4xl mx-auto" style={{ transitionDelay: "240ms" }}>
          <div
            className="overflow-hidden rounded-2xl"
            style={{
              background: "#14100B",
              boxShadow:
                "0 0 0 1px rgba(28,18,9,0.10), inset 0 1px 0 rgba(255,255,255,0.08), 0 2px 6px rgba(28,18,9,0.12), 0 24px 60px rgba(28,18,9,0.18)",
            }}
          >
            {/* Chrome bar */}
            <div
              className="flex items-center gap-3 px-3.5 flex-shrink-0"
              style={{
                height: "36px",
                background: "linear-gradient(to bottom, #2A2018, #1C140D)",
                borderBottom: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              <div className="flex items-center gap-1.5" aria-hidden>
                {["#FF5F57", "#FEBC2E", "#28C840"].map((c) => (
                  <span
                    key={c}
                    style={{
                      width: "9px",
                      height: "9px",
                      borderRadius: "9999px",
                      background: c,
                      boxShadow: "inset 0 -1px 1px rgba(0,0,0,0.25)",
                    }}
                  />
                ))}
              </div>
              <div
                className="flex items-center gap-1.5 flex-1 justify-center"
                style={{
                  maxWidth: "240px",
                  margin: "0 auto",
                  height: "22px",
                  borderRadius: "9999px",
                  background: "rgba(0,0,0,0.35)",
                  border: "1px solid rgba(255,255,255,0.05)",
                }}
              >
                <Lock size={8} color="rgba(134,239,172,0.75)" aria-hidden />
                <span
                  style={{ fontSize: "10px", color: "rgba(243,233,213,0.55)", fontFamily: "monospace" }}
                >
                  genos-pizza.com
                </span>
              </div>
              <div style={{ width: "42px" }} aria-hidden />
            </div>

            {/* Comparison viewport */}
            <div
              ref={frameRef}
              className="relative"
              style={{
                height: "clamp(360px, 46vw, 500px)",
                touchAction: "pan-y",
                cursor: "ew-resize",
                userSelect: "none",
                WebkitUserSelect: "none",
              }}
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={endDrag}
              onPointerCancel={endDrag}
              onLostPointerCapture={endDrag}
            >
              {/* Both fake sites are decorative demos; the slider + caption
                  carry the meaning for assistive tech */}
              <div aria-hidden="true">
                {/* AFTER underneath, full-bleed */}
                <AfterSite />
                {/* BEFORE on top, clipped to the divider */}
                <div
                  className="absolute inset-0"
                  style={{
                    clipPath: `inset(0 ${100 - pos}% 0 0)`,
                    willChange: "clip-path",
                  }}
                >
                  <BeforeSite />
                </div>

                {/* Corner era labels, fading with position */}
                <div
                  className="absolute top-2.5 left-2.5 pointer-events-none"
                  style={{
                    opacity: beforeLabelOpacity,
                    transition: "opacity 0.2s ease",
                    fontSize: "9.5px",
                    fontWeight: 700,
                    letterSpacing: "0.1em",
                    color: "#FFF8EE",
                    background: "rgba(28,18,9,0.72)",
                    padding: "3px 9px",
                    borderRadius: "9999px",
                  }}
                >
                  2009
                </div>
                <div
                  className="absolute top-2.5 right-2.5 pointer-events-none"
                  style={{
                    opacity: afterLabelOpacity,
                    transition: "opacity 0.2s ease",
                    fontSize: "9.5px",
                    fontWeight: 700,
                    letterSpacing: "0.1em",
                    color: "#FFF8EE",
                    background: `linear-gradient(150deg, ${AFTER_ACCENT}, ${AFTER_INK})`,
                    padding: "3px 9px",
                    borderRadius: "9999px",
                  }}
                >
                  2026
                </div>
              </div>

              {/* Divider — transform-only positioning: the holder is as wide
                  as the viewport, so translateX(pos%) lands on the split */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{ transform: `translateX(${pos}%)`, willChange: "transform" }}
              >
                <div className="absolute inset-y-0 left-0 -translate-x-1/2" style={{ width: "44px" }}>
                  {/* Brass line */}
                  <div
                    aria-hidden
                    className="absolute inset-y-0 left-1/2 -translate-x-1/2"
                    style={{
                      width: "3px",
                      background: `linear-gradient(to bottom, ${AFTER_ACCENT}, ${AFTER_INK})`,
                      boxShadow: "0 0 0 1px rgba(255,248,238,0.55), 0 0 12px rgba(28,18,9,0.35)",
                    }}
                  />
                  {/* Hidden-but-real slider (keyboard: arrows, Home/End) */}
                  <input
                    type="range"
                    className="ba-range"
                    min={0}
                    max={100}
                    step={1}
                    value={Math.round(pos)}
                    onChange={(e) => {
                      stopTour();
                      setPos(Number(e.target.value));
                    }}
                    aria-label="Website comparison slider — drag or use arrow keys to reveal the old 2009 site versus the new design"
                    aria-valuetext={`${Math.round(pos)}% old site showing`}
                  />
                  {/* Visible grip (ringed when the slider has focus) */}
                  <div
                    aria-hidden
                    className="ba-grip absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center rounded-full"
                    style={{
                      width: "40px",
                      height: "40px",
                      background: `linear-gradient(150deg, ${AFTER_ACCENT}, ${AFTER_INK})`,
                      boxShadow:
                        "0 0 0 2px rgba(255,248,238,0.85), 0 4px 14px rgba(28,18,9,0.4), inset 0 1px 0 rgba(255,255,255,0.35)",
                    }}
                  >
                    <ChevronsLeftRight size={18} color="#FFF8EE" strokeWidth={2.5} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Caption */}
          <p
            className="reveal text-center mt-5 italic text-muted"
            style={{
              transitionDelay: "320ms",
              fontFamily: "var(--font-display)",
              fontSize: "13.5px",
            }}
          >
            Both of these are real HTML. Only one of them is embarrassing.
          </p>
        </div>
      </div>
    </section>
  );
}
