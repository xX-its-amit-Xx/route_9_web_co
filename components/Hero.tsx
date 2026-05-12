"use client";

import { useEffect, useRef } from "react";
import { ArrowRight, MapPin } from "lucide-react";
import { HERO, WHO } from "@/lib/content";
import { Marquee } from "./Marquee";
import { MagneticButton } from "./MagneticButton";

// ── Real shop photo collage — editorial right column ──────────────────────────
// Three Unsplash photos stitched into a magazine-style grid.
// Left column: one tall restaurant/shop photo.
// Right column: barbershop (top) + cafe (bottom).
function HeroPhotoCollage() {
  const photos = [
    {
      id: "1517248135467-4c7edcad34c4",
      label: "Restaurants",
      col: "1",
      row: "1 / -1",
      w: 600,
    },
    {
      id: "1585747860715-2ba37e788b70",
      label: "Barbershops",
      col: "2",
      row: "1",
      w: 400,
    },
    {
      id: "1554118811-1e0d58224f24",
      label: "Cafes & Bakeries",
      col: "2",
      row: "2",
      w: 400,
    },
  ];

  return (
    <div className="relative" aria-hidden>
      {/* Warm ambient light from behind the photos */}
      <div
        className="absolute pointer-events-none"
        style={{
          inset: "-40px",
          background:
            "radial-gradient(ellipse at 55% 45%, rgba(160,70,15,0.22) 0%, rgba(100,40,8,0.08) 45%, transparent 68%)",
          zIndex: 0,
        }}
      />

      {/* Photo grid */}
      <div
        className="relative"
        style={{
          display: "grid",
          gridTemplateColumns: "1.45fr 1fr",
          gridTemplateRows: "1fr 1fr",
          gap: "10px",
          height: "clamp(380px, 48vw, 540px)",
          zIndex: 1,
        }}
      >
        {photos.map(({ id, label, col, row, w }) => (
          <div
            key={id}
            className="relative overflow-hidden group"
            style={{
              gridColumn: col,
              gridRow: row,
              borderRadius: "16px",
              boxShadow:
                "0 24px 64px rgba(0,0,0,0.6), 0 4px 16px rgba(0,0,0,0.4), inset 0 0 0 1px rgba(255,255,255,0.07)",
            }}
          >
            <img
              src={`https://images.unsplash.com/photo-${id}?w=${w}&auto=format&fit=crop&q=80`}
              alt={label}
              loading="eager"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            {/* Bottom vignette */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "linear-gradient(to bottom, rgba(14,9,5,0.1) 0%, transparent 35%, rgba(14,9,5,0.72) 100%)",
              }}
            />
            {/* Category label */}
            <div className="absolute bottom-0 left-0 right-0 p-3">
              <span
                style={{
                  fontSize: "9.5px",
                  fontWeight: 700,
                  color: "rgba(243,233,213,0.75)",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                }}
              >
                {label}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Route 9 pill badge — top right of the collage */}
      <div
        className="absolute"
        style={{
          top: "14px",
          right: "14px",
          zIndex: 10,
          display: "inline-flex",
          alignItems: "center",
          gap: "5px",
          padding: "5px 10px 5px 8px",
          borderRadius: "9999px",
          background: "rgba(14,9,5,0.88)",
          border: "1px solid rgba(212,104,42,0.45)",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
          boxShadow: "0 2px 12px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,180,80,0.1)",
        }}
      >
        <MapPin size={9} color="#D4682A" />
        <span
          style={{
            fontSize: "9px",
            fontWeight: 700,
            color: "rgba(212,104,42,0.9)",
            letterSpacing: "0.12em",
          }}
        >
          ROUTE 9
        </span>
        <span
          style={{
            fontSize: "8px",
            color: "rgba(243,233,213,0.35)",
            fontFamily: "monospace",
          }}
        >
          MA
        </span>
      </div>

      {/* "Independent shops" floating label — bottom left overlap */}
      <div
        className="absolute"
        style={{
          bottom: "18%",
          left: "-14px",
          zIndex: 10,
          padding: "7px 13px",
          borderRadius: "10px",
          background: "linear-gradient(145deg, #E07838 0%, #D4682A 50%, #C05A20 100%)",
          boxShadow:
            "0 6px 24px rgba(212,104,42,0.55), 0 1px 0 rgba(255,220,140,0.25) inset",
          color: "white",
          fontSize: "9.5px",
          fontWeight: 700,
          letterSpacing: "0.04em",
          whiteSpace: "nowrap",
        }}
      >
        Independent shops · Shrewsbury &amp; beyond
      </div>
    </div>
  );
}

export function Hero() {
  const contentRef = useRef<HTMLDivElement>(null);

  // Subtle parallax on content only (photos stay static)
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: no-preference)");
    if (!mq.matches) return;
    const onScroll = () => {
      if (contentRef.current)
        contentRef.current.style.transform = `translateY(${window.scrollY * 0.03}px)`;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section
      id="hero"
      className="relative min-h-[100svh] flex flex-col justify-center overflow-hidden"
      style={{ background: "#0E0905" }}
      aria-label="Hero"
    >
      {/* Single static ambient warm glow — no pulsing, no blobs */}
      <div
        aria-hidden
        className="absolute pointer-events-none"
        style={{
          top: "30%",
          right: "-8%",
          width: "min(72vw, 720px)",
          height: "min(72vw, 720px)",
          background:
            "radial-gradient(ellipse at 65% 40%, rgba(140,60,12,0.16) 0%, rgba(80,32,6,0.07) 45%, transparent 70%)",
          borderRadius: "50%",
          zIndex: 0,
        }}
      />

      {/* Fine dot grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(243,233,213,0.55) 1px, transparent 1px)",
          backgroundSize: "38px 38px",
          opacity: 0.027,
        }}
      />

      {/* Subtle background shop photo texture */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{ zIndex: 0 }}
      >
        <img
          src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600&auto=format&fit=crop&q=60"
          alt=""
          className="w-full h-full object-cover"
          style={{ opacity: 0.04, mixBlendMode: "luminosity" }}
          loading="eager"
        />
      </div>

      {/* ── Main content ── */}
      <div
        ref={contentRef}
        className="relative max-w-7xl mx-auto px-6 md:px-12 pt-28 pb-8 w-full will-change-transform"
        style={{ zIndex: 3 }}
      >
        <div className="grid lg:grid-cols-[1fr_0.88fr] gap-10 xl:gap-20 items-center">

          {/* ── Left: copy ── */}
          <div>

            {/* Location eyebrow — clean pill, no neon */}
            <div
              className="inline-flex items-center gap-2 mb-9"
              style={{
                padding: "6px 14px",
                borderRadius: "9999px",
                background: "rgba(255,255,255,0.055)",
                border: "1px solid rgba(255,255,255,0.1)",
                backdropFilter: "blur(8px)",
                WebkitBackdropFilter: "blur(8px)",
                animation: "hero-line-up 0.8s cubic-bezier(0.22,1,0.36,1) 0.05s both",
              }}
            >
              <MapPin size={10} color="#D4682A" />
              <span
                style={{
                  fontSize: "11px",
                  fontWeight: 600,
                  color: "rgba(243,233,213,0.55)",
                  letterSpacing: "0.08em",
                }}
              >
                {HERO.label}
              </span>
              <span
                className="w-1.5 h-1.5 rounded-full flex-shrink-0 animate-pulse"
                style={{ background: "#D4682A", boxShadow: "0 0 5px rgba(212,104,42,0.8)" }}
                aria-hidden
              />
            </div>

            {/* ── Headline ──
                CSS animation: no word-clip / overflow:hidden → zero clipping.
                lineHeight 1.0 gives all glyphs room to breathe.               */}
            <h1
              className="text-5xl sm:text-6xl md:text-[5.5rem] lg:text-[6rem] xl:text-[6.5rem] tracking-tight mb-7"
              style={{ fontFamily: "var(--font-display)", lineHeight: 1.0 }}
            >
              <span
                className="block text-[#F3E9D5]"
                style={{
                  animation:
                    "hero-line-up 1s cubic-bezier(0.22,1,0.36,1) 0.12s both",
                }}
              >
                {HERO.headlineA}
              </span>
              <span
                className="block text-gradient italic"
                style={{
                  animation:
                    "hero-line-up 1s cubic-bezier(0.22,1,0.36,1) 0.3s both",
                }}
              >
                {HERO.headlineB}
              </span>
            </h1>

            {/* Subhead */}
            <p
              className="max-w-xl text-lg md:text-xl leading-relaxed mb-10"
              style={{
                color: "rgba(243,233,213,0.58)",
                animation:
                  "hero-line-up 1s cubic-bezier(0.22,1,0.36,1) 0.48s both",
              }}
            >
              {HERO.subhead}
            </p>

            {/* CTAs */}
            <div
              className="flex flex-col sm:flex-row gap-3 mb-10"
              style={{
                animation:
                  "hero-line-up 1s cubic-bezier(0.22,1,0.36,1) 0.62s both",
              }}
            >
              <MagneticButton>
                <a
                  href={HERO.ctaPrimary.href}
                  className="glow-btn inline-flex items-center justify-center gap-2.5 px-8 rounded-xl text-white font-semibold text-sm transition-all duration-200 hover:-translate-y-0.5 tracking-wide"
                  style={{
                    height: "52px",
                    background:
                      "linear-gradient(145deg, #E07838 0%, #D4682A 40%, #B04C18 100%)",
                    boxShadow:
                      "0 0 0 1px rgba(212,104,42,0.5), 0 4px 16px rgba(212,104,42,0.5), 0 12px 40px rgba(212,104,42,0.18), inset 0 1.5px 0 rgba(255,220,160,0.22), inset 0 -1.5px 0 rgba(0,0,0,0.2)",
                  }}
                >
                  {HERO.ctaPrimary.text}
                  <ArrowRight size={14} strokeWidth={2.5} />
                </a>
              </MagneticButton>
              <MagneticButton>
                <a
                  href={HERO.ctaSecondary.href}
                  className="inline-flex items-center justify-center px-8 rounded-xl font-medium text-sm tracking-wide transition-all duration-200 hover:-translate-y-0.5"
                  style={{
                    height: "52px",
                    color: "#F3E9D5",
                    background:
                      "linear-gradient(145deg, rgba(243,233,213,0.09) 0%, rgba(243,233,213,0.04) 100%)",
                    border: "1px solid rgba(243,233,213,0.18)",
                    boxShadow:
                      "0 2px 12px rgba(0,0,0,0.25), inset 0 1px 0 rgba(243,233,213,0.1)",
                    backdropFilter: "blur(8px)",
                    WebkitBackdropFilter: "blur(8px)",
                  }}
                >
                  {HERO.ctaSecondary.text}
                </a>
              </MagneticButton>
            </div>

            {/* Shop proof strip */}
            <div
              className="flex items-center gap-3 mb-3"
              style={{
                animation:
                  "hero-line-up 1s cubic-bezier(0.22,1,0.36,1) 0.78s both",
              }}
            >
              <div className="flex -space-x-2.5">
                {[
                  "1517248135467-4c7edcad34c4",
                  "1493857671505-72967e2e2760",
                  "1585747860715-2ba37e788b70",
                  "1509440159596-0249088772ff",
                  "1472851294608-062f824d29cc",
                ].map((id, i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0"
                    style={{
                      border: "2px solid #1C1209",
                      zIndex: 5 - i,
                    }}
                  >
                    <img
                      src={`https://images.unsplash.com/photo-${id}?w=80&auto=format&fit=crop&q=80`}
                      alt=""
                      aria-hidden
                      loading="lazy"
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
              <p
                className="text-xs"
                style={{ color: "rgba(243,233,213,0.38)" }}
              >
                Restaurants, cafes, salons &amp; more along Route 9
              </p>
            </div>

            {/* Trust line */}
            <p
              className="text-xs tracking-wide"
              style={{
                color: "rgba(243,233,213,0.28)",
                animation:
                  "hero-line-up 1s cubic-bezier(0.22,1,0.36,1) 0.92s both",
              }}
            >
              No contracts · No lock-in · Free preview before you pay anything
            </p>
          </div>

          {/* ── Right: photo collage (desktop only) ── */}
          <div
            className="hidden lg:block"
            style={{
              animation:
                "hero-line-up 1.2s cubic-bezier(0.22,1,0.36,1) 0.2s both",
            }}
          >
            <HeroPhotoCollage />
          </div>

        </div>
      </div>

      {/* Scroll indicator */}
      <div
        className="absolute bottom-20 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        style={{
          zIndex: 3,
          animation:
            "hero-line-up 1s cubic-bezier(0.22,1,0.36,1) 1.1s both",
        }}
        aria-hidden
      >
        <span
          className="text-[10px] tracking-[0.2em] uppercase"
          style={{ color: "rgba(243,233,213,0.22)" }}
        >
          Scroll
        </span>
        <div className="w-px h-10 bg-gradient-to-b from-[rgba(212,104,42,0.45)] to-transparent" />
      </div>

      {/* ── Marquee ticker ── */}
      <div
        className="relative mt-8 border-t border-[rgba(212,104,42,0.08)] pt-5 pb-5"
        style={{ zIndex: 3 }}
      >
        <Marquee items={WHO.businessTypes} />
      </div>
    </section>
  );
}
