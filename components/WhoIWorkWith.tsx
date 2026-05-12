"use client";

import { SplitTextReveal } from "./SplitTextReveal";
import { WHO } from "@/lib/content";

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

            <div className="space-y-7 mb-10">
              {WHO.reasons.map(({ heading, body }, i) => (
                <div
                  key={heading}
                  className="flex gap-4 reveal"
                  style={{ transitionDelay: `${420 + i * 110}ms` }}
                >
                  <div
                    className="mt-1 flex-shrink-0 w-8 h-8 rounded-xl bg-[rgba(212,104,42,0.1)] border border-[rgba(212,104,42,0.18)] flex items-center justify-center"
                    aria-hidden
                  >
                    <div className="w-2 h-2 rounded-full bg-[#D4682A]" />
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
              ))}
            </div>

            <div className="border-t border-[#E8D9C4] pt-6 reveal" style={{ transitionDelay: "760ms" }}>
              <p className="text-xs font-semibold tracking-widest uppercase text-[#B0A090] mb-3">
                Currently serving
              </p>
              <div className="flex flex-wrap gap-2">
                {WHO.towns.map((town) => (
                  <span
                    key={town}
                    className="px-3 py-1.5 text-xs font-medium rounded-full border border-[#E8D9C4] bg-white text-[#7A6B5C] hover:border-[rgba(212,104,42,0.4)] hover:text-[#D4682A] transition-colors duration-200 shadow-sm"
                  >
                    {town}
                  </span>
                ))}
                <span className="px-3 py-1.5 text-xs font-medium rounded-full border border-[rgba(212,104,42,0.3)] bg-[rgba(212,104,42,0.06)] text-[#D4682A]">
                  + nearby
                </span>
              </div>
            </div>
          </div>

          {/* ── Right: bento photo mosaic ── */}
          <div className="reveal" style={{ transitionDelay: "180ms" }}>
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
                    loading="lazy"
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
            <p className="text-xs text-[#B0A090] mt-3 text-center">
              Not on the list? Independent shop owners are always welcome.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}
