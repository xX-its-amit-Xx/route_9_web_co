"use client";

import { SplitTextReveal } from "./SplitTextReveal";
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
  return (
    <section
      id="who"
      className="py-24 md:py-32 border-t border-[#E8D9C4]"
      style={{ background: "#FEFBF5" }}
      aria-label="Who I work with"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid lg:grid-cols-2 gap-14 md:gap-20 items-center">

          {/* ── Left: text ── */}
          <div>
            <div className="label-pill mb-4 reveal">Who I work with</div>

            <SplitTextReveal
              as="h2"
              className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-[#1C1209] leading-tight mb-6"
              style={{ fontFamily: "var(--font-display)" }}
              stagger={80}
            >
              {WHO.heading}
            </SplitTextReveal>

            <p
              className="text-[#7A6B5C] text-lg leading-relaxed mb-10 reveal max-w-md"
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
                    className="flex gap-4 p-4 rounded-2xl reveal group transition-all duration-200 hover:bg-[rgba(212,104,42,0.04)]"
                    style={{ transitionDelay: `${420 + i * 110}ms`, border: "1px solid transparent" }}
                  >
                    <div
                      className="mt-0.5 flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 group-hover:scale-110 group-hover:bg-[#D4682A] group-hover:text-white"
                      style={{
                        background: "rgba(212,104,42,0.1)",
                        border: "1px solid rgba(212,104,42,0.2)",
                        color: "#D4682A",
                        boxShadow: "inset 0 1px 0 rgba(255,210,140,0.12)",
                      }}
                      aria-hidden
                    >
                      <Icon />
                    </div>
                    <div>
                      <h3
                        className="font-semibold text-[#1C1209] mb-1"
                        style={{ fontFamily: "var(--font-display)" }}
                      >
                        {heading}
                      </h3>
                      <p className="text-[#7A6B5C] leading-relaxed text-sm">{body}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="border-t border-[#E8D9C4] pt-6 reveal" style={{ transitionDelay: "760ms" }}>
              <p className="text-xs font-semibold tracking-widest uppercase text-[#B0A090] mb-4">
                Currently serving
              </p>
              {/* Mini Route 9 inline road strip */}
              <div className="relative flex items-center gap-0 mb-3 overflow-hidden">
                {/* Road line */}
                <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 h-px" style={{ background: "repeating-linear-gradient(90deg, rgba(212,104,42,0.3) 0px, rgba(212,104,42,0.3) 6px, transparent 6px, transparent 10px)" }} aria-hidden />
                <div className="relative flex items-center justify-between w-full py-3">
                  {WHO.towns.map((town, i) => (
                    <div key={town} className="flex flex-col items-center gap-1.5 group cursor-default">
                      <span
                        className="flex items-center justify-center rounded-full transition-all duration-200 group-hover:scale-110"
                        style={{
                          width: town === "Shrewsbury" ? "14px" : "10px",
                          height: town === "Shrewsbury" ? "14px" : "10px",
                          background: town === "Shrewsbury" ? "#D4682A" : "white",
                          border: town === "Shrewsbury" ? "2px solid rgba(212,104,42,0.4)" : "1.5px solid #E8D9C4",
                          boxShadow: town === "Shrewsbury" ? "0 0 8px rgba(212,104,42,0.5)" : "0 1px 3px rgba(0,0,0,0.08)",
                          zIndex: 1,
                        }}
                        aria-hidden
                      />
                      <span
                        className="text-center leading-tight transition-colors duration-200 group-hover:text-[#D4682A] whitespace-nowrap"
                        style={{
                          fontSize: "9px",
                          fontWeight: town === "Shrewsbury" ? 700 : 500,
                          color: town === "Shrewsbury" ? "#D4682A" : "#9B8C7D",
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
              <p className="text-[10px] text-[#B0A090] italic" style={{ fontFamily: "var(--font-display)" }}>
                + anywhere nearby along Route 9 — just ask.
              </p>
            </div>
          </div>

          {/* ── Right: bento photo mosaic ── */}
          <div className="reveal" style={{ transitionDelay: "180ms" }}>
            {/* Neighborhood label */}
            <div className="flex items-center gap-2 mb-3">
              <span
                className="text-[9px] font-semibold tracking-[0.18em] uppercase"
                style={{ color: "#B0A090" }}
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
                    i === 0 ? " col-span-2 row-span-2" : ""
                  }`}
                >
                  <img
                    src={`https://images.unsplash.com/photo-${id}?w=${i === 0 ? 500 : 280}&auto=format&fit=crop&q=80`}
                    alt={label}
                    loading="eager"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                  />
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                  {/* Label */}
                  <div className="absolute bottom-0 left-0 right-0 p-2.5">
                    <span className="text-[10px] font-semibold text-white/90 tracking-wide leading-tight block">
                      {label}
                    </span>
                  </div>
                  {/* Hover accent */}
                  <div className="absolute inset-0 ring-2 ring-inset ring-[#D4682A]/0 group-hover:ring-[#D4682A]/40 rounded-2xl transition-all duration-300" />
                </div>
              ))}
            </div>

            {/* Shop window strip — hand-drawn ma-and-pa feel */}
            <div
              className="mt-3 flex items-center justify-between px-1"
              aria-hidden
            >
              {[
                { icon: "🍕", label: "Pizzeria" },
                { icon: "✂️", label: "Barber" },
                { icon: "☕", label: "Café" },
                { icon: "🥐", label: "Bakery" },
                { icon: "💅", label: "Salon" },
                { icon: "🔧", label: "Auto" },
              ].map(({ icon, label }) => (
                <div key={label} className="flex flex-col items-center gap-0.5 opacity-50 hover:opacity-80 transition-opacity duration-200">
                  <span className="text-base leading-none">{icon}</span>
                  <span className="text-[8px] text-[#B0A090] font-medium tracking-wide">{label}</span>
                </div>
              ))}
            </div>

            <p className="text-xs text-[#B0A090] mt-2 text-center italic" style={{ fontFamily: "var(--font-display)" }}>
              Not on the list? Every independent shop is welcome.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}
