"use client";

import { useScrollReveal } from "@/lib/useScrollReveal";
import { SplitTextReveal } from "./SplitTextReveal";
import { BarberPole } from "./BarberPole";
import { VintageStamps } from "./VintageStamps";
import { WHO } from "@/lib/content";

// ── Custom icons for the three reasons ───────────────────────────────────────

function IconSameDay() {
  return (
    <svg viewBox="0 0 22 22" fill="none" className="w-4 h-4" aria-hidden>
      <circle cx="10" cy="11" r="7.5" stroke="currentColor" strokeWidth="1.4" />
      <path d="M10 7.5V11.5L12.5 13" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M16.5 5.5L19 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      <path d="M17 3h2v2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconInPerson() {
  return (
    <svg viewBox="0 0 22 22" fill="none" className="w-4 h-4" aria-hidden>
      {/* Left person */}
      <circle cx="6.5" cy="6" r="2.5" stroke="currentColor" strokeWidth="1.3" />
      <path d="M2.5 16c0-3 1.8-5 4-5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      {/* Right person */}
      <circle cx="15.5" cy="6" r="2.5" stroke="currentColor" strokeWidth="1.3" />
      <path d="M19.5 16c0-3-1.8-5-4-5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      {/* Handshake */}
      <path d="M8 13.5l1.5-1 1 0.5 1-0.5 1.5 1" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
      {/* Location pin above */}
      <path d="M11 2.5c1.1 0 2 .9 2 2 0 1.1-2 3-2 3S9 5.6 9 4.5c0-1.1.9-2 2-2z" stroke="currentColor" strokeWidth="1.2" fill="currentColor" fillOpacity="0.15" />
    </svg>
  );
}

function IconNeighborhood() {
  return (
    <svg viewBox="0 0 22 22" fill="none" className="w-4 h-4" aria-hidden>
      {/* Map outline */}
      <path d="M3 5l5-2 6 2.5 5-2v14l-5 2-6-2.5-5 2V5z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
      <line x1="8" y1="3" x2="8" y2="17" stroke="currentColor" strokeWidth="0.9" strokeDasharray="2 1.5" />
      <line x1="14" y1="5.5" x2="14" y2="19" stroke="currentColor" strokeWidth="0.9" strokeDasharray="2 1.5" />
      {/* Route 9 shield on map */}
      <rect x="8.5" y="7.5" width="5" height="5.5" rx="1" fill="currentColor" fillOpacity="0.18" stroke="currentColor" strokeWidth="0.9" />
      <text x="11" y="12" textAnchor="middle" fontSize="3.5" fill="currentColor" fontWeight="800">9</text>
    </svg>
  );
}

const REASON_ICONS = [IconSameDay, IconInPerson, IconNeighborhood];

// Bento mosaic: first item spans 2 cols × 2 rows, rest fill 3×3 grid
const MOSAIC = [
  { id: "1517248135467-4c7edcad34c4", label: "Restaurants & Pizzerias" },
  { id: "1493857671505-72967e2e2760", label: "Cafes & Coffee" },
  { id: "1509440159596-0249088772ff", label: "Bakeries" },
  { id: "1585747860715-2ba37e788b70", label: "Barbershops" },
  { id: "1522337360788-8b13dee7a37e", label: "Salons & Spas" },
  { id: "1472851294608-062f824d29cc", label: "Specialty Retail" },
];

export function WhoIWorkWith() {
  const leftRef  = useScrollReveal();
  const rightRef = useScrollReveal();

  return (
    <section
      id="who"
      className="py-24 md:py-32 border-t border-border-subtle relative overflow-hidden"
      style={{ background: "var(--section-warm-b)" }}
      aria-labelledby="who-heading"
    >
      {/* Subtle warm glow top-right */}
      <div
        aria-hidden
        className="absolute pointer-events-none"
        style={{
          top: "-80px",
          right: "-80px",
          width: "500px",
          height: "500px",
          background: "radial-gradient(circle, rgba(212,104,42,0.06) 0%, transparent 65%)",
          zIndex: 0,
        }}
      />

      {/* Decorative barber pole "mounted" against the left wall of the
          section. Desktop only — would clutter mobile and overlap text. */}
      <div
        aria-hidden
        className="hidden xl:block absolute pointer-events-none"
        style={{ top: "120px", left: "16px", zIndex: 1 }}
      >
        <BarberPole height={300} />
      </div>
      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <div className="grid lg:grid-cols-2 gap-14 md:gap-20 items-center">

          {/* ── Left: text ── */}
          <div ref={leftRef}>
            <div className="label-pill mb-4 reveal">Who I work with</div>

            <SplitTextReveal
              as="h2"
              id="who-heading"
              className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-fg leading-tight mb-6"
              style={{ fontFamily: "var(--font-display)" }}
              stagger={80}
            >
              {WHO.heading}
            </SplitTextReveal>

            <p
              className="text-muted text-lg leading-relaxed mb-10 reveal max-w-md"
              style={{ transitionDelay: "300ms" }}
            >
              {WHO.subhead}
            </p>

            <div className="space-y-5 mb-10">
              {WHO.reasons.map(({ heading, body }, i) => {
                const Icon = REASON_ICONS[i % REASON_ICONS.length];
                return (
                  <div
                    key={heading}
                    className="flex gap-4 p-4 rounded-2xl reveal group transition-all duration-200 border border-transparent hover:bg-[rgba(212,104,42,0.04)] hover:border-[rgba(212,104,42,0.14)]"
                    style={{ transitionDelay: `${420 + i * 110}ms` }}
                  >
                    <div
                      className="mt-0.5 flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 group-hover:scale-110 group-hover:bg-[#D4682A] group-hover:text-white group-hover:shadow-[0_4px_14px_rgba(212,104,42,0.45)] text-[#D4682A] bg-[rgba(212,104,42,0.1)] border border-[rgba(212,104,42,0.2)] shadow-[inset_0_1px_0_rgba(255,210,140,0.12)]"
                      aria-hidden
                    >
                      <Icon />
                    </div>
                    <div>
                      <h3
                        className="font-semibold text-fg mb-1"
                        style={{ fontFamily: "var(--font-display)" }}
                      >
                        {heading}
                      </h3>
                      <p className="text-muted leading-relaxed text-sm">{body}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="border-t border-border-subtle pt-6 reveal" style={{ transitionDelay: "760ms" }}>
              <p className="text-xs font-semibold tracking-widest uppercase text-muted mb-4">
                Currently serving
              </p>
              {/* Mini Route 9 inline road strip */}
              <div className="relative flex items-center gap-0 mb-3 overflow-hidden">
                {/* Road line */}
                <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 h-px" style={{ background: "repeating-linear-gradient(90deg, rgba(212,104,42,0.3) 0px, rgba(212,104,42,0.3) 6px, transparent 6px, transparent 10px)" }} aria-hidden />
                {/* Traveling car dot */}
                <div
                  aria-hidden
                  className="absolute pointer-events-none"
                  style={{
                    top: "50%",
                    /* Resting state matches keyframe 0% — off-screen left + invisible.
                       Under reduced-motion the animation reverts here instead of
                       left:auto / opacity:1 (visible dot stuck at start of strip). */
                    left: "-2%",
                    opacity: 0,
                    transform: "translateY(-50%)",
                    width: "5px",
                    height: "5px",
                    borderRadius: "50%",
                    background: "#D4682A",
                    boxShadow: "0 0 6px rgba(212,104,42,0.8)",
                    animation: "road-car-travel 8s linear infinite",
                  }}
                />
                <div className="relative flex items-center justify-between w-full py-3">
                  {WHO.towns.map((town, i) => (
                    <div key={town} className="flex flex-col items-center gap-1.5 group cursor-default">
                      <span
                        className="relative flex items-center justify-center rounded-full transition-all duration-200 group-hover:scale-110"
                        style={{
                          width: town === "Shrewsbury" ? "14px" : "10px",
                          height: town === "Shrewsbury" ? "14px" : "10px",
                          background: town === "Shrewsbury" ? "#D4682A" : "var(--surface-raised)",
                          border: town === "Shrewsbury" ? "2px solid rgba(212,104,42,0.4)" : "1.5px solid var(--border)",
                          boxShadow: town === "Shrewsbury" ? "0 0 8px rgba(212,104,42,0.5)" : "0 1px 3px rgba(0,0,0,0.12)",
                          zIndex: 1,
                        }}
                        aria-hidden
                      >
                        {town === "Shrewsbury" && (
                          <span
                            className="dot-ping absolute inset-0 rounded-full"
                            style={{ background: "rgba(212,104,42,0.45)" }}
                            aria-hidden
                          />
                        )}
                      </span>
                      <span
                        className="text-center leading-tight transition-colors duration-200 group-hover:text-accent whitespace-nowrap"
                        style={{
                          fontSize: "9px",
                          fontWeight: town === "Shrewsbury" ? 700 : 500,
                          color: town === "Shrewsbury" ? "#D4682A" : "var(--muted)",
                          letterSpacing: "0.04em",
                        }}
                      >
                        {town}
                        {i < WHO.towns.length - 1 && ""}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <p className="text-[10px] text-muted italic" style={{ fontFamily: "var(--font-display)" }}>
                + anywhere nearby along Route 9 — just ask.
              </p>
            </div>
          </div>

          {/* ── Right: bento photo mosaic ── */}
          <div ref={rightRef} className="reveal" style={{ transitionDelay: "180ms" }}>
            {/* Neighborhood label */}
            <div className="flex items-center gap-2 mb-3">
              <span
                className="text-[9px] font-semibold tracking-[0.18em] uppercase"
                style={{ color: "var(--muted)" }}
              >
                Route 9 shops, Shrewsbury &amp; beyond
              </span>
              <div className="flex-1 h-px" style={{ background: "linear-gradient(90deg, rgba(212,104,42,0.2), transparent)" }} />
            </div>

            <div
              className="grid grid-cols-3 gap-2"
              style={{
                gridTemplateRows: "repeat(3, 1fr)",
                height: "clamp(340px, 55vw, 520px)",
              }}
            >
              {MOSAIC.map(({ id, label }, i) => (
                <div
                  key={label}
                  className={`relative overflow-hidden rounded-2xl group cursor-default${
                    i === 0 ? " col-span-2 row-span-2 shine" : ""
                  }`}
                  onMouseMove={(e) => {
                    const r = e.currentTarget.getBoundingClientRect();
                    e.currentTarget.style.setProperty("--spot-x", `${((e.clientX - r.left) / r.width) * 100}%`);
                    e.currentTarget.style.setProperty("--spot-y", `${((e.clientY - r.top) / r.height) * 100}%`);
                  }}
                >
                  <img
                    src={`https://images.unsplash.com/photo-${id}?w=${i === 0 ? 500 : 280}&auto=format&fit=crop&q=80`}
                    alt={label}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                  />
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                  {/* Cursor spotlight */}
                  <div
                    aria-hidden
                    className="absolute inset-0 pointer-events-none z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-150"
                    style={{
                      background: "radial-gradient(circle at var(--spot-x, 50%) var(--spot-y, 50%), rgba(255,255,255,0.18) 0%, transparent 55%)",
                    }}
                  />
                  {/* Label — slides up from below on hover */}
                  <div className="absolute bottom-0 left-0 right-0 z-20">
                    <div className="overflow-hidden px-2.5 pb-2.5">
                      <span className="block text-[10px] font-semibold text-white tracking-wide leading-tight translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]">
                        {label}
                      </span>
                    </div>
                  </div>
                  {/* Hover accent ring */}
                  <div className="absolute inset-0 ring-2 ring-inset ring-[#D4682A]/0 group-hover:ring-[#D4682A]/40 rounded-2xl transition-all duration-300 z-20" />
                </div>
              ))}
            </div>

            {/* Vintage postage-stamp strip — replaces the emoji strip with
                hand-drawn line-art "stamps" per trade */}
            <VintageStamps />

            <p className="text-xs text-muted mt-2 text-center italic" style={{ fontFamily: "var(--font-display)" }}>
              Not on the list? Every independent shop is welcome.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}
