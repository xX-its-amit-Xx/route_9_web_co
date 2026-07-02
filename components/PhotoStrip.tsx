"use client";

import { useScrollReveal } from "@/lib/useScrollReveal";

// ── The neighborhood photo strip ──────────────────────────────────────────────
// A warm, human band of Route 9 shop life: real faces, real counters. Photos
// are hotlinked from Unsplash (all URLs verified 200), staggered and slightly
// tilted like prints laid out on a table. Hovering straightens + lifts a card.

const PHOTOS: {
  id: string;
  alt: string;
  chip: string;
  tilt: string;
  lift: string;
}[] = [
  {
    id: "1747832512459-5566e6d0ee5a",
    alt: "A barber laughing with his client mid-haircut in a bright barbershop",
    chip: "Barbers",
    tilt: "-2.5deg",
    lift: "0px",
  },
  {
    id: "1726749135886-f896fe38df69",
    alt: "A baker in a white shirt shaping fresh bread dough in her bakery",
    chip: "Bakers",
    tilt: "2deg",
    lift: "14px",
  },
  {
    id: "1747835334237-4ab81c9c921a",
    alt: "A flower shop owner smiling while arranging stems at her workbench",
    chip: "Florists",
    tilt: "-2deg",
    lift: "4px",
  },
  {
    id: "1778790624232-b10fec62de1b",
    alt: "A barista handing a fresh coffee across the counter to a smiling customer",
    chip: "Baristas",
    tilt: "2.5deg",
    lift: "18px",
  },
  {
    id: "1632823471725-4004ed0669b1",
    alt: "A mechanic polishing a car in his garage bay",
    chip: "Mechanics",
    tilt: "-2.2deg",
    lift: "2px",
  },
  {
    id: "1647483684830-7ddde27dcf4d",
    alt: "A pizzeria owner proudly holding a fresh pizza in his restaurant",
    chip: "Restaurateurs",
    tilt: "2.2deg",
    lift: "12px",
  },
];

export function PhotoStrip() {
  const headingRef = useScrollReveal();
  const stripRef = useScrollReveal();

  return (
    <section
      className="py-20 border-t border-border-subtle overflow-hidden"
      style={{ background: "var(--section-warm-a)" }}
      aria-labelledby="photostrip-heading"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Heading */}
        <div ref={headingRef} className="mb-12 max-w-2xl">
          <div className="label-pill mb-4 reveal">The neighborhood</div>
          <h2
            id="photostrip-heading"
            className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-fg leading-tight reveal"
            style={{ fontFamily: "var(--font-display)", transitionDelay: "80ms" }}
          >
            Built for the people behind the counter.
          </h2>
          <p
            className="text-muted text-lg leading-relaxed mt-4 reveal"
            style={{ transitionDelay: "180ms" }}
          >
            Every storefront on Route 9 has a face behind it — the barber who
            knows your usual, the baker who opens at five. These are the folks
            I build for.
          </p>
        </div>

        {/* Staggered strip — horizontal scroll-snap on mobile, one row on desktop */}
        <div ref={stripRef}>
          <div
            className="flex gap-4 md:gap-5 overflow-x-auto md:overflow-visible snap-x snap-mandatory md:snap-none pb-6 md:pb-2 pt-2 -mx-6 px-6 md:mx-0 md:px-0"
            style={{ scrollbarWidth: "none" }}
          >
          {PHOTOS.map(({ id, alt, chip, tilt, lift }, i) => (
            <figure
              key={chip}
              className="reveal group flex-shrink-0 w-52 sm:w-56 md:w-auto md:flex-1 md:min-w-0 snap-center m-0"
              style={{ transitionDelay: `${120 + i * 90}ms` }}
            >
              <div
                className="relative aspect-[4/5] rounded-2xl overflow-hidden transition-[transform,box-shadow] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]"
                style={{
                  transform: `rotate(${tilt}) translateY(${lift})`,
                  boxShadow:
                    "0 1px 2px rgba(28,18,9,0.06), 0 8px 24px rgba(28,18,9,0.10), 0 24px 48px rgba(212,104,42,0.08)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = `rotate(0deg) translateY(${lift}) translateY(-8px) scale(1.02)`;
                  e.currentTarget.style.boxShadow =
                    "0 2px 4px rgba(28,18,9,0.06), 0 16px 40px rgba(28,18,9,0.14), 0 40px 80px rgba(212,104,42,0.12)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = `rotate(${tilt}) translateY(${lift})`;
                  e.currentTarget.style.boxShadow =
                    "0 1px 2px rgba(28,18,9,0.06), 0 8px 24px rgba(28,18,9,0.10), 0 24px 48px rgba(212,104,42,0.08)";
                }}
              >
                <img
                  src={`https://images.unsplash.com/photo-${id}?w=600&auto=format&fit=crop&q=80`}
                  alt={alt}
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
                {/* Soft warm bottom gradient so the chip always reads */}
                <div
                  aria-hidden
                  className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#1C1209]/45 to-transparent"
                />
                {/* Caption chip */}
                <figcaption className="absolute bottom-3 left-3">
                  <span
                    className="inline-block px-2.5 py-1 rounded-full text-[10px] font-semibold tracking-[0.1em] uppercase text-[#1C1209]"
                    style={{
                      background: "rgba(254,251,245,0.92)",
                      boxShadow: "0 1px 4px rgba(28,18,9,0.18)",
                      backdropFilter: "blur(4px)",
                    }}
                  >
                    {chip}
                  </span>
                </figcaption>
              </div>
            </figure>
          ))}
          </div>

          {/* Footnote */}
          <p
            className="text-xs text-muted mt-6 text-center italic reveal"
            style={{ fontFamily: "var(--font-display)", transitionDelay: "700ms" }}
          >
            Barbers, bakers, florists, baristas, mechanics, restaurateurs — if
            you keep a light on along Route 9, this is for you.
          </p>
        </div>
      </div>
    </section>
  );
}
