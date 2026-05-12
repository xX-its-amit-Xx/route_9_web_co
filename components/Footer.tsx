import { SITE, ABOUT } from "@/lib/content";

// ── Route 9 Corridor Map — Framingham → Worcester along MA-9 ─────────────────
function Route9CorridorMap() {
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
          fontSize: "8.5px",
          letterSpacing: "0.22em",
          textTransform: "uppercase",
          color: "rgba(212,104,42,0.4)",
          fontWeight: 600,
        }}
      >
        Serving the Route 9 corridor
      </p>
      <svg
        viewBox="0 0 652 48"
        fill="none"
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

        {/* Towns */}
        {towns.map(({ name, x, home }) => (
          <g key={name}>
            {home ? (
              <>
                {/* Outer glow ring */}
                <circle cx={x} cy={21} r="9" fill="rgba(212,104,42,0.08)" stroke="rgba(212,104,42,0.22)" strokeWidth="1" />
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
  return (
    <footer style={{ background: "#0B0705" }}>

      {/* ── Route 9 corridor map strip ── */}
      <div className="border-t border-[rgba(212,104,42,0.1)] py-8">
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex justify-center">
          <Route9CorridorMap />
        </div>
      </div>

      {/* ── Main footer body ── */}
      <div className="border-t border-[rgba(255,255,255,0.04)] pt-10 pb-8">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-10 mb-10">

            {/* Brand column */}
            <div>
              <div className="flex items-center gap-2.5 mb-3">
                <span
                  className="flex items-center justify-center w-9 h-9 rounded-xl text-white font-extrabold select-none flex-shrink-0"
                  style={{
                    fontFamily: "var(--font-display)",
                    fontStyle: "italic",
                    fontSize: "13px",
                    background: "linear-gradient(145deg, #E07838 0%, #C05A20 55%, #A04010 100%)",
                    boxShadow:
                      "0 0 0 1px rgba(212,104,42,0.45), 0 2px 8px rgba(212,104,42,0.3), inset 0 1px 0 rgba(255,255,255,0.2)",
                  }}
                >
                  R9
                </span>
                <div className="flex flex-col leading-none gap-[1px]">
                  <span style={{ fontSize: "8px", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(243,233,213,0.35)" }}>Route 9</span>
                  <span style={{ fontSize: "14px", fontFamily: "var(--font-display)", fontStyle: "italic", color: "#F3E9D5", letterSpacing: "-0.01em" }}>Web</span>
                </div>
              </div>
              <p className="text-xs leading-relaxed max-w-[230px]" style={{ color: "rgba(155,140,125,0.7)" }}>
                Custom websites for independent shops along Route 9. Mobile-first, fast, and maintained by someone who actually answers.
              </p>
              <div className="flex flex-col gap-1.5 mt-4">
                <a
                  href={`mailto:${SITE.email}`}
                  className="text-xs transition-colors duration-150 hover:text-[#D4682A]"
                  style={{ color: "rgba(155,140,125,0.6)" }}
                >
                  {SITE.email}
                </a>
                {(SITE.phone as string) !== "PLACEHOLDER_PHONE" && (
                  <a
                    href={`tel:${SITE.phone}`}
                    className="text-xs transition-colors duration-150 hover:text-[#D4682A]"
                    style={{ color: "rgba(155,140,125,0.6)" }}
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
                style={{ fontSize: "8.5px", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(155,140,125,0.5)" }}
              >
                Navigation
              </p>
              <ul className="space-y-2.5">
                {FOOTER_NAV.map(({ label, href }) => (
                  <li key={href}>
                    <a
                      href={href}
                      className="group text-xs flex items-center gap-1.5 transition-colors duration-150 hover:text-[#F3E9D5]"
                      style={{ color: "rgba(155,140,125,0.6)" }}
                    >
                      <span
                        className="block h-px rounded-full transition-all duration-200"
                        style={{ width: "0px", background: "#D4682A" }}
                        aria-hidden
                      />
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact / quick info column */}
            <div>
              <p
                className="mb-4 font-semibold"
                style={{ fontSize: "8.5px", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(155,140,125,0.5)" }}
              >
                Get in touch
              </p>
              <a
                href="#contact"
                className="inline-flex items-center h-9 px-5 rounded-xl text-xs font-semibold text-white transition-all duration-150 hover:-translate-y-0.5 mb-5"
                style={{
                  background: "linear-gradient(135deg, #D4682A 0%, #C05A20 100%)",
                  boxShadow: "0 4px 16px rgba(212,104,42,0.3), inset 0 1px 0 rgba(255,255,255,0.18)",
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
            <p style={{ fontSize: "11px", color: "rgba(90,75,60,0.8)" }}>
              © {SITE.founded} {SITE.name} · Shrewsbury, MA · Est. {SITE.founded}
            </p>
            <div className="flex items-center gap-5" style={{ fontSize: "11px", color: "rgba(90,75,60,0.8)" }}>
              {(SITE.personalSite as string) !== "PLACEHOLDER_PERSONAL_SITE" && (
                <a
                  href={SITE.personalSite}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#9B8C7D] transition-colors duration-150"
                >
                  {ABOUT.moreLinkText}
                </a>
              )}
              {(SITE.github as string) !== "PLACEHOLDER_GITHUB_REPO" && (
                <a
                  href={`https://github.com/${SITE.github}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#9B8C7D] transition-colors duration-150"
                >
                  GitHub →
                </a>
              )}
              <span>MIT License</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
