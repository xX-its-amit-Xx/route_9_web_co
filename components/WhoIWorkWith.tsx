"use client";

import { useScrollReveal } from "@/lib/useScrollReveal";
import { WHO } from "@/lib/content";

export function WhoIWorkWith() {
  const headingRef = useScrollReveal();
  const reasonsRef = useScrollReveal();
  const typesRef = useScrollReveal();

  return (
    <section
      id="who"
      className="py-24 md:py-32 border-t border-border-subtle"
      aria-label="Who I work with"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Section label */}
        <div ref={headingRef} className="reveal mb-12">
          <p className="text-xs font-semibold tracking-widest uppercase text-accent mb-3">
            Who I work with
          </p>
          <h2
            className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-fg leading-tight mb-4"
            style={{ fontFamily: "var(--font-syne)" }}
          >
            {WHO.heading}
          </h2>
          <p className="max-w-2xl text-lg text-muted leading-relaxed">
            {WHO.subhead}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-start">
          {/* Left: reasons */}
          <div ref={reasonsRef} className="reveal reveal-stagger space-y-8">
            {WHO.reasons.map(({ heading, body }) => (
              <div key={heading} className="flex gap-4">
                <div
                  className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-full border-2 border-accent flex items-center justify-center"
                  aria-hidden
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                </div>
                <div>
                  <h3 className="font-semibold text-fg mb-1">{heading}</h3>
                  <p className="text-muted leading-relaxed text-sm">{body}</p>
                </div>
              </div>
            ))}

            {/* Towns */}
            <div className="pt-4 border-t border-border-subtle">
              <p className="text-xs font-semibold tracking-widest uppercase text-muted mb-3">
                Currently serving
              </p>
              <div className="flex flex-wrap gap-2">
                {WHO.towns.map((town) => (
                  <span
                    key={town}
                    className="px-3 py-1 text-xs font-medium rounded-full border border-border bg-surface text-muted"
                  >
                    {town}
                  </span>
                ))}
                <span className="px-3 py-1 text-xs font-medium rounded-full border border-accent/30 bg-accent-light text-accent">
                  and nearby
                </span>
              </div>
            </div>
          </div>

          {/* Right: business types grid */}
          <div ref={typesRef} className="reveal">
            <p className="text-xs font-semibold tracking-widest uppercase text-muted mb-4">
              Types of businesses
            </p>
            <ul className="grid grid-cols-2 gap-2">
              {WHO.businessTypes.map((type) => (
                <li
                  key={type}
                  className="flex items-center gap-2.5 px-4 py-3 rounded-xl border border-border bg-surface text-sm text-fg hover:border-accent/40 hover:bg-accent-light transition-colors duration-150"
                >
                  <span
                    className="w-1.5 h-1.5 rounded-full bg-accent flex-shrink-0"
                    aria-hidden
                  />
                  {type}
                </li>
              ))}
            </ul>

            <p className="mt-4 text-xs text-muted-light">
              Not on the list? If you&apos;re an independent shop, we should still talk.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
