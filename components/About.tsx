"use client";

import { useScrollReveal } from "@/lib/useScrollReveal";
import { SplitTextReveal } from "./SplitTextReveal";
import { ABOUT, SITE } from "@/lib/content";

export function About() {
  const bodyRef = useScrollReveal();

  return (
    <section
      id="about"
      className="py-24 md:py-32 border-t border-border-subtle"
      aria-label="About"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-start">
          {/* Left */}
          <div>
            <p className="text-xs font-semibold tracking-widest uppercase text-accent mb-3 reveal">
              About
            </p>
            <SplitTextReveal
              as="h2"
              className="text-3xl md:text-4xl font-bold tracking-tight text-fg leading-tight mb-8"
              style={{ fontFamily: "var(--font-display)" }}
              stagger={80}
            >
              Local work, done locally.
            </SplitTextReveal>

            {/* Route 9 sign element */}
            <div className="inline-flex items-center gap-4 p-4 rounded-2xl border border-border bg-surface reveal" style={{ transitionDelay: "300ms" }}>
              <div
                className="flex items-center justify-center w-14 h-14 rounded-xl bg-[#110B07] flex-shrink-0"
                aria-hidden
              >
                <div className="text-center">
                  <div className="text-[9px] font-bold text-[#D4682A] tracking-widest leading-tight">MA</div>
                  <div
                    className="text-2xl font-bold text-[#F3E9D5] italic leading-none"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    9
                  </div>
                </div>
              </div>
              <div>
                <p className="text-sm font-bold text-fg" style={{ fontFamily: "var(--font-display)" }}>{SITE.name}</p>
                <p className="text-xs text-muted">{SITE.location} · Est. {SITE.founded}</p>
                <p className="text-xs text-muted mt-0.5">Serving Route 9 since day one</p>
              </div>
            </div>
          </div>

          {/* Right: body */}
          <div ref={bodyRef} className="reveal space-y-5">
            {ABOUT.paragraphs.map((p, i) => (
              <p key={i} className="text-muted leading-relaxed">
                {p}
              </p>
            ))}

            {/* AI transparency */}
            <div className="mt-6 p-5 rounded-2xl border border-border-subtle bg-surface">
              <p className="text-sm text-muted leading-relaxed italic" style={{ fontFamily: "var(--font-display)" }}>
                &ldquo;{ABOUT.aiNote}&rdquo;
              </p>
            </div>

            {SITE.personalSite !== "PLACEHOLDER_PERSONAL_SITE" && (
              <a
                href={SITE.personalSite}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-sm text-accent hover:text-accent-hover underline-grow underline-offset-4 transition-colors duration-150"
              >
                {ABOUT.moreLinkText}
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
