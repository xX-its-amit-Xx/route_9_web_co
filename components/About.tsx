"use client";

import { useScrollReveal } from "@/lib/useScrollReveal";
import { ABOUT, SITE } from "@/lib/content";

export function About() {
  const headingRef = useScrollReveal();
  const bodyRef = useScrollReveal();

  return (
    <section
      id="about"
      className="py-24 md:py-32 border-t border-border-subtle"
      aria-label="About"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-start">
          {/* Left: heading */}
          <div ref={headingRef} className="reveal">
            <p className="text-xs font-semibold tracking-widest uppercase text-accent mb-3">
              About
            </p>
            <h2
              className="text-3xl md:text-4xl font-bold tracking-tight text-fg leading-tight"
              style={{ fontFamily: "var(--font-syne)" }}
            >
              Local work,<br />done locally.
            </h2>

            {/* Route 9 decorative element */}
            <div className="mt-8 flex items-center gap-3">
              <div
                className="flex items-center justify-center w-12 h-12 rounded-xl border-2 border-accent"
                aria-hidden
              >
                <span
                  className="text-accent font-bold text-sm leading-none"
                  style={{ fontFamily: "var(--font-syne)" }}
                >
                  RT<br />9
                </span>
              </div>
              <div>
                <p className="text-sm font-medium text-fg">{SITE.name}</p>
                <p className="text-xs text-muted">{SITE.location} · Est. {SITE.founded}</p>
              </div>
            </div>
          </div>

          {/* Right: body copy */}
          <div ref={bodyRef} className="reveal space-y-4">
            {ABOUT.paragraphs.map((p, i) => (
              <p key={i} className="text-muted leading-relaxed">
                {p}
              </p>
            ))}

            {/* AI transparency note */}
            <div className="mt-6 p-4 rounded-xl border border-border-subtle bg-surface">
              <p className="text-sm text-muted leading-relaxed italic">
                &ldquo;{ABOUT.aiNote}&rdquo;
              </p>
            </div>

            {/* Personal site link */}
            {SITE.personalSite !== "PLACEHOLDER_PERSONAL_SITE" && (
              <div className="pt-2">
                <a
                  href={SITE.personalSite}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm text-accent hover:text-accent-hover underline underline-offset-4 decoration-accent/40 hover:decoration-accent transition-colors duration-150"
                >
                  {ABOUT.moreLinkText}
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
