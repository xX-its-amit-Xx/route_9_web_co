"use client";

import { SITE, ABOUT } from "@/lib/content";
import { useLenis } from "./SmoothScrollProvider";
import { useVisible } from "@/hooks/useVisible";
import { BrandSeal } from "./BrandSeal";
import { CompassRose } from "./CompassRose";

// ── Route 9 Corridor Map — Framingham → Worcester along MA-9 ─────────────────
function Route9CorridorMap() {
  // SMIL <animate> loops run forever, even with the footer scrolled far off
  // screen — only mount them while the map is actually visible.
  const { ref, visible } = useVisible(0.05);
  const towns = [
    { name: "Framingham", x: 54 },
    { name: "Westborough", x: 190 },
    { name: "Northborough", x: 326 },
    { name: "Shrewsbury", x: 462, home: true },
    { name: "Worcester", x: 598 },
  ];

  return (
    <div className="flex flex-col items-center gap-2">
      <p
        style={{
          fontSize: "10px",
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          color: "rgba(212,104,42,0.45)",
          fontWeight: 600,
        }}
      >
        Serving the Route 9 corridor
      </p>
      <svg
        ref={ref}
        viewBox="0 0 652 48"
        fill="none"
        role="img"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Route 9 corridor from Framingham to Worcester"
        style={{ width: "100%", maxWidth: "560px" }}
      >
        {/* Road surface */}
        <rect x="30" y="17" width="592" height="8" rx="4" fill="rgba(255,255,255,0.03)" />
        {/* Dashed center lane marking */}
        <line
          x1="30" y1="21" x2="622" y2="21"
          stroke="rgba(212,104,42,0.18)" strokeWidth="1.5"
          strokeDasharray="14 10" strokeLinecap="round"
        />
        {/* MA-9 shield badge mid-road */}
        <rect x="309" y="13" width="34" height="16" rx="2.5" fill="rgba(212,104,42,0.12)" stroke="rgba(212,104,42,0.28)" strokeWidth="0.8" />
        <text x="326" y="24" textAnchor="middle" fontSize="7" fill="rgba(212,104,42,0.65)" fontWeight="700" fontFamily="monospace" letterSpacing="0.03em">MA 9</text>

        {/* Traveling car dot — animates along Route 9 (only while visible) */}
        <circle cx="0" cy="21" r="2.5" opacity="0" fill="rgba(212,104,42,0.75)" className="route-map-car">
          {visible && (
            <>
              <animate
                attributeName="cx"
                values="30;622;622;30;30"
                keyTimes="0;0.45;0.5;0.95;1"
                dur="9s"
                repeatCount="indefinite"
                calcMode="linear"
              />
              <animate
                attributeName="opacity"
                values="0.75;0.75;0;0;0.75"
                keyTimes="0;0.45;0.5;0.95;1"
                dur="9s"
                repeatCount="indefinite"
              />
            </>
          )}
        </circle>

        {/* Towns */}
        {towns.map(({ name, x, home }) => (
          <g key={name}>
            {home ? (
              <>
                {/* Pinging outer ring (only animates while visible) */}
                <circle cx={x} cy={21} r="9" fill="rgba(212,104,42,0.08)" stroke="rgba(212,104,42,0.22)" strokeWidth="1" className="route-map-ping">
                  {visible && (
                    <>
                      <animate attributeName="r" values="9;14;9" dur="2.5s" repeatCount="indefinite" />
                      <animate attributeName="opacity" values="1;0;1" dur="2.5s" repeatCount="indefinite" />
                    </>
                  )}
                </circle>
                {/* Static ring */}
                <circle cx={x} cy={21} r="9" fill="none" stroke="rgba(212,104,42,0.25)" strokeWidth="1" />
                {/* Main dot */}
                <circle cx={x} cy={21} r="5" fill="#D4682A" />
                {/* Inner highlight */}
                <circle cx={x - 1.5} cy={19} r="1.5" fill="rgba(255,210,140,0.5)" />
                {/* Name — bright */}
                <text x={x} y={44} textAnchor="middle" fontSize="8" fill="rgba(212,104,42,0.75)" fontWeight="700" fontFamily="monospace" letterSpacing="0.06em">
                  {name.toUpperCase()} ★
                </text>
              </>
            ) : (
              <>
                <circle cx={x} cy={21} r="3.5" fill="rgba(212,104,42,0.3)" />
                <text x={x} y={44} textAnchor="middle" fontSize="7" fill="rgba(255,255,255,0.17)" fontFamily="monospace" letterSpacing="0.05em">
                  {name.toUpperCase()}
                </text>
              </>
            )}
          </g>
        ))}
      </svg>
    </div>
  );
}

const FOOTER_NAV = [
  { label: "How I Build",        href: "#pillars"  },
  { label: "Services & Pricing", href: "#pricing"  },
  { label: "Process",            href: "#process"  },
  { label: "About",              href: "#about"    },
  { label: "Contact",            href: "#contact"  },
];

export function Footer() {
  const lenis = useLenis();

  const scrollToTop = () => {
    if (lenis) lenis.scrollTo(0, { duration: 1.4 });
    else window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer style={{ background: "#0B0705" }}>

      {/* ── Route 9 corridor map strip ── */}
      <div className="border-t border-[rgba(212,104,42,0.1)] py-8">
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center justify-center gap-10 md:gap-16">
          <CompassRose size={220} />
          <Route9CorridorMap />
        </div>
      </div>

      {/* ── Main footer body ── */}
      <div className="border-t border-[rgba(255,255,255,0.04)] pt-10 pb-8">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-10 mb-10">

            {/* Brand column */}
            <div>
              <div className="flex items-start gap-4 mb-3">
                <BrandSeal size={92} tilt={-7} className="flex-shrink-0 mt-1" />
                <div className="flex flex-col leading-none gap-[1px] mt-2">
                  <span style={{ fontSize: "8px", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(243,233,213,0.35)" }}>Route 9</span>
                  <span style={{ fontSize: "20px", fontFamily: "var(--font-display)", fontStyle: "italic", color: "#F3E9D5", letterSpacing: "-0.01em" }}>Web Co.</span>
                  <span style={{ fontSize: "9px", color: "rgba(155,140,125,0.6)", marginTop: "4px", letterSpacing: "0.08em" }}>SHREWSBURY · ROUTE 9</span>
                </div>
              </div>
              <p className="text-xs leading-relaxed max-w-[230px]" style={{ color: "rgba(155,140,125,0.88)" }}>
                Custom websites for independent shops along Route 9. Mobile-first, fast, and maintained by someone who actually answers.
              </p>
              <div className="flex flex-col items-start gap-1.5 mt-4">
                <a
                  href={`mailto:${SITE.email}`}
                  className="underline-grow text-xs text-[rgba(155,140,125,0.85)] transition-colors duration-200 hover:text-[#D4682A]"
                >
                  {SITE.email}
                </a>
                {(SITE.phone as string) !== "PLACEHOLDER_PHONE" && (
                  <a
                    href={`tel:+1${SITE.phone.replace(/\D/g, "")}`}
                    className="underline-grow text-xs text-[rgba(155,140,125,0.85)] transition-colors duration-200 hover:text-[#D4682A]"
                  >
                    {SITE.phone}
                  </a>
                )}
              </div>
            </div>

            {/* Navigation column */}
            <div>
              <p
                className="mb-4 font-semibold"
                style={{ fontSize: "10px", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(155,140,125,0.85)" }}
              >
                Navigation
              </p>
              <nav aria-label="Footer navigation">
              <ul role="list" className="space-y-2.5">
                {FOOTER_NAV.map(({ label, href }) => (
                  <li key={href}>
                    <a
                      href={href}
                      className="underline-grow inline-block text-xs text-[rgba(155,140,125,0.85)] transition-colors duration-200 hover:text-[#F3E9D5]"
                    >
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
              </nav>
            </div>

            {/* Contact / quick info column */}
            <div>
              <p
                className="mb-4 font-semibold"
                style={{ fontSize: "10px", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(155,140,125,0.85)" }}
              >
                Get in touch
              </p>
              <a
                href="#contact"
                className="nav-cta-shimmer inline-flex items-center h-9 px-5 rounded-xl text-xs font-semibold text-[#1C1209] transition-[transform,box-shadow] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 shadow-[0_4px_14px_rgba(212,104,42,0.28),inset_0_1px_0_rgba(255,255,255,0.18)] hover:shadow-[0_8px_24px_rgba(212,104,42,0.4),inset_0_1px_0_rgba(255,255,255,0.18)] mb-5"
                style={{
                  background: "linear-gradient(135deg, #D4682A 0%, #C05A20 100%)",
                }}
              >
                Start a conversation
              </a>
              <div
                className="rounded-xl px-4 py-3 mt-1"
                style={{
                  background: "rgba(212,104,42,0.06)",
                  border: "1px solid rgba(212,104,42,0.12)",
                }}
              >
                <p style={{ fontSize: "10px", color: "rgba(212,104,42,0.65)", fontFamily: "var(--font-display)", fontStyle: "italic", lineHeight: 1.6 }}>
                  &ldquo;Replies within 2 hours, usually a lot less. Or just text — faster than email.&rdquo;
                </p>
              </div>
            </div>
          </div>

          {/* ── Bottom bar ── */}
          <div
            className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-6"
            style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}
          >
            <div className="flex flex-col gap-1">
              <p style={{ fontSize: "11px", color: "rgba(155,140,125,0.88)" }}>
                © {new Date().getFullYear()} {SITE.name} · Shrewsbury, MA · Est. {SITE.founded}
              </p>
              <p
                style={{
                  fontSize: "10px",
                  color: "rgba(212,104,42,0.45)",
                  fontFamily: "var(--font-display)",
                  fontStyle: "italic",
                  letterSpacing: "0.03em",
                }}
              >
                Built by a neighbor. Maintained by the same one.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2" style={{ fontSize: "11px", color: "rgba(155,140,125,0.88)" }}>
              {(SITE.personalSite as string) !== "PLACEHOLDER_PERSONAL_SITE" && (
                <a
                  href={SITE.personalSite}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline-grow transition-colors duration-200 hover:text-[#F3E9D5]"
                >
                  {ABOUT.moreLinkText}
                </a>
              )}
              {(SITE.github as string) !== "PLACEHOLDER_GITHUB_REPO" && (
                <a
                  href={`https://github.com/${SITE.github}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline-grow transition-colors duration-200 hover:text-[#F3E9D5]"
                >
                  GitHub →
                </a>
              )}
              <span>MIT License</span>
              {/* Morse code easter egg — hover to decode */}
              <span className="group relative cursor-default select-none" aria-hidden>
                <span
                  className="font-mono text-[9px] tracking-widest"
                  style={{ color: "rgba(212,104,42,0.22)", animation: "morse-blink 3.2s step-end infinite" }}
                >
                  ·&nbsp;·&nbsp;·
                </span>
                <span
                  className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2.5 py-1.5 rounded-lg text-[9px] font-mono whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"
                  style={{
                    background: "rgba(14,9,5,0.97)",
                    border: "1px solid rgba(212,104,42,0.35)",
                    color: "rgba(212,104,42,0.88)",
                    boxShadow: "0 4px 16px rgba(0,0,0,0.5), 0 0 12px rgba(212,104,42,0.1)",
                    letterSpacing: "0.15em",
                  }}
                >
                  ·–&nbsp;·–·&nbsp;––&nbsp;···&nbsp;–&nbsp;&nbsp;·–&nbsp;···&nbsp;·
                  <span className="block text-center mt-0.5" style={{ fontSize: "7px", color: "rgba(212,104,42,0.45)", letterSpacing: "0.06em" }}>ROUTE 9 · MORSE</span>
                </span>
              </span>
              <button
                onClick={scrollToTop}
                aria-label="Back to top"
                className="flex items-center gap-1.5 transition-colors duration-200 hover:text-[#D4682A] group"
                style={{ color: "rgba(90,75,60,0.5)" }}
              >
                <span
                  className="inline-flex items-center justify-center w-5 h-5 rounded-full transition-transform duration-200 group-hover:-translate-y-0.5"
                  style={{ border: "1px solid rgba(212,104,42,0.2)", background: "rgba(212,104,42,0.06)" }}
                  aria-hidden
                >
                  <svg viewBox="0 0 10 10" fill="none" className="w-2.5 h-2.5">
                    <path d="M2 7L5 3L8 7" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
                Top
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
