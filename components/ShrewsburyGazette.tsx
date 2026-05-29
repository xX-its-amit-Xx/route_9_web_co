"use client";

import { useRef, useEffect } from "react";

// ── The Shrewsbury Gazette — vintage newspaper front page ────────────────────
//
// A satirical-but-affectionate fake newspaper celebrating Route 9 businesses.
// Aged newsprint texture (SVG fractal noise × multiply over #F0E8CC), masthead
// double-rule ornament, three newspaper columns, serif body copy, drop cap,
// inset sidebar box, and a display advertisement.
//
// Scroll reveal: perspective + rotateX "page unfurl" via IntersectionObserver.
// Date: suppressHydrationWarning on the edition line (decorative only).
// "BREAKING" rubber-stamp badge is purely aria-hidden decoration.

function getGazetteDate(): string {
  try {
    return new Intl.DateTimeFormat("en-US", {
      weekday: "long", year: "numeric", month: "long", day: "numeric",
      timeZone: "America/New_York",
    }).format(new Date()).toUpperCase();
  } catch {
    return new Date()
      .toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })
      .toUpperCase();
  }
}

export function ShrewsburyGazette() {
  const paperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = paperRef.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.classList.add("gazette-visible");
      return;
    }
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { el.classList.add("gazette-visible"); obs.disconnect(); } },
      { threshold: 0.06 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section
      style={{ background: "var(--section-warm-b)", padding: "72px 0 90px" }}
      aria-label="Featured in — The Shrewsbury Gazette"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6">

        {/* Label */}
        <div className="flex justify-center mb-8">
          <span className="label-pill">Featured In</span>
        </div>

        {/* ── Newspaper ── */}
        <div
          ref={paperRef}
          className="gazette-paper"
          role="img"
          aria-label="Satirical newspaper: The Shrewsbury Gazette reports local shop sees surge in customers after new website launch"
        >
          {/* Aged newsprint noise texture */}
          <div
            aria-hidden
            style={{
              position: "absolute", inset: 0, borderRadius: "inherit",
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='gn'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23gn)'/%3E%3C/svg%3E")`,
              backgroundSize: "200px 200px",
              opacity: 0.15,
              mixBlendMode: "multiply",
              pointerEvents: "none",
            }}
          />
          {/* Edge vignette — simulates ageing at the folds */}
          <div
            aria-hidden
            style={{
              position: "absolute", inset: 0, borderRadius: "inherit",
              background: "radial-gradient(ellipse 86% 76% at 50% 50%, transparent 52%, rgba(72,44,8,0.28) 100%)",
              pointerEvents: "none",
            }}
          />

          {/* "BREAKING" rubber-stamp — top-right corner */}
          <div
            aria-hidden
            style={{
              position: "absolute", top: "18px", right: "22px",
              transform: "rotate(12deg)",
              border: "2.5px solid #B91C1C",
              borderRadius: "2px",
              padding: "3px 9px",
              fontFamily: "'Courier New', Courier, monospace",
              fontSize: "10.5px",
              fontWeight: 900,
              letterSpacing: "0.24em",
              color: "#B91C1C",
              textTransform: "uppercase",
              opacity: 0.72,
              lineHeight: 1,
              pointerEvents: "none",
            }}
          >
            BREAKING
          </div>

          {/* ── All editorial content (above noise/vignette overlays) ── */}
          <div style={{ position: "relative" }}>

            {/* ══ Masthead ══ */}
            <div style={{
              textAlign: "center",
              borderTop: "3.5px solid #0E0A04",
              borderBottom: "3.5px solid #0E0A04",
              padding: "2px 0",
              marginBottom: "4px",
            }}>
              <div style={{ borderTop: "1px solid #0E0A04", borderBottom: "1px solid #0E0A04", padding: "10px 0" }}>
                <p style={{
                  fontFamily: "Georgia, 'Times New Roman', serif",
                  fontSize: "9.5px",
                  letterSpacing: "0.30em",
                  textTransform: "uppercase",
                  color: "#2A1C08",
                  margin: "0 0 7px",
                }}>
                  Serving Route 9 Since 1847
                </p>
                <h1 style={{
                  fontFamily: "'Palatino Linotype', 'Palatino', 'Book Antiqua', Georgia, 'Times New Roman', serif",
                  fontSize: "clamp(26px, 6.5vw, 58px)",
                  fontWeight: 900,
                  color: "#0E0A04",
                  letterSpacing: "0.06em",
                  lineHeight: 1,
                  margin: 0,
                  textTransform: "uppercase",
                }}>
                  The Shrewsbury Gazette
                </h1>
              </div>
            </div>

            {/* Edition line */}
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: "4px",
              padding: "5px 0",
              borderBottom: "1.5px solid #0E0A04",
              marginBottom: "16px",
            }}>
              <span style={{ fontFamily: "Georgia, serif", fontSize: "9px", color: "#2A1C08", letterSpacing: "0.05em" }}>
                EST. 1847 · SHREWSBURY, MA
              </span>
              {/* suppressHydrationWarning: date differs between SSR and client — decorative only */}
              <span
                suppressHydrationWarning
                style={{ fontFamily: "Georgia, serif", fontSize: "9px", color: "#2A1C08", fontWeight: 700, letterSpacing: "0.04em" }}
              >
                {getGazetteDate()}
              </span>
              <span style={{ fontFamily: "Georgia, serif", fontSize: "9px", color: "#2A1C08", letterSpacing: "0.05em" }}>
                VOL. CLXXVIII · NO. 12 · PRICE: FREE
              </span>
            </div>

            {/* ══ Main headline ══ */}
            <div style={{
              borderBottom: "1.5px solid #0E0A04",
              paddingBottom: "12px",
              marginBottom: "16px",
              textAlign: "center",
            }}>
              <h2 style={{
                fontFamily: "'Palatino Linotype', 'Palatino', 'Book Antiqua', Georgia, 'Times New Roman', serif",
                fontSize: "clamp(17px, 3.8vw, 31px)",
                fontWeight: 900,
                color: "#0E0A04",
                lineHeight: 1.18,
                margin: "0 0 8px",
                textTransform: "uppercase",
                letterSpacing: "0.02em",
              }}>
                Local Shop&rsquo;s New Website Brings In<br />
                More Customers Than Ever Before
              </h2>
              <p style={{
                fontFamily: "Georgia, 'Times New Roman', serif",
                fontStyle: "italic",
                fontSize: "13px",
                color: "#3A2810",
                margin: 0,
              }}>
                Shrewsbury business owner says phone &lsquo;hasn&rsquo;t stopped ringing&rsquo; since Route 9 Web Co. launch
              </p>
            </div>

            {/* ══ Three-column body ══ */}
            <div className="gazette-columns">

              {/* ── Column 1: Opening article ── */}
              <div className="gazette-col">
                <p className="gazette-dropcap" style={{
                  fontFamily: "Georgia, 'Times New Roman', serif",
                  fontSize: "13px", lineHeight: 1.70,
                  color: "#1A1208", textAlign: "justify", margin: "0 0 10px",
                }}>
                  SHREWSBURY — For years, locals driving down Route 9 knew the shop by its hand-painted sign and the smell of fresh coffee drifting out the door. Ask anyone to find it online, however, and you would get only a shrug.
                </p>
                <p style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontSize: "13px", lineHeight: 1.70, color: "#1A1208", textAlign: "justify", margin: "0 0 10px" }}>
                  &ldquo;We didn&rsquo;t have a website,&rdquo; said the owner, who has operated the Route 9 business for eleven years. &ldquo;People would call just to ask if we were still open. It was embarrassing.&rdquo;
                </p>
                <p style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontSize: "13px", lineHeight: 1.70, color: "#1A1208", textAlign: "justify", margin: 0 }}>
                  That changed when Route 9 Web Co., a Shrewsbury-based design firm, built the shop a mobile-ready website in under 48 hours — and without a single contract.
                </p>
              </div>

              {/* ── Column 2: Continued ── */}
              <div className="gazette-col">
                <p style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontSize: "13px", lineHeight: 1.70, color: "#1A1208", textAlign: "justify", margin: "0 0 10px" }}>
                  &ldquo;The phone rang twice the first morning it went live,&rdquo; the owner said. &ldquo;By Friday we had three walk-ins who found us through a search.&rdquo;
                </p>
                <p style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontSize: "13px", lineHeight: 1.70, color: "#1A1208", textAlign: "justify", margin: "0 0 10px" }}>
                  The new site loads in under two seconds on any device and features the shop&rsquo;s menu, hours, and a one-click contact form designed for mobile visitors.
                </p>
                <p style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontSize: "13px", lineHeight: 1.70, color: "#1A1208", textAlign: "justify", margin: 0, fontStyle: "italic" }}>
                  &ldquo;I didn&rsquo;t realize how many people were searching for us and finding nothing,&rdquo; the owner added. &ldquo;That&rsquo;s just lost business.&rdquo;
                </p>
              </div>

              {/* ── Column 3: Sidebar + advertisement ── */}
              <div className="gazette-col">
                {/* Inset sidebar box */}
                <div style={{ border: "1.5px solid #1A1208", padding: "10px 12px", marginBottom: "14px" }}>
                  <p style={{
                    fontFamily: "'Palatino Linotype', Palatino, 'Book Antiqua', Georgia, serif",
                    fontSize: "11px", fontWeight: 900,
                    textTransform: "uppercase", letterSpacing: "0.07em",
                    color: "#0E0A04",
                    borderBottom: "1px solid #1A1208",
                    paddingBottom: "6px", marginBottom: "8px",
                  }}>
                    Area Designer<br />Offers 48-Hr Guarantee
                  </p>
                  <p style={{ fontFamily: "Georgia, serif", fontSize: "11.5px", lineHeight: 1.62, color: "#1A1208", margin: "0 0 8px" }}>
                    A local web designer is promising fast-turnaround sites for Route 9 businesses — with a no-commitment design preview before any work begins.
                  </p>
                  <p style={{ fontFamily: "Georgia, serif", fontSize: "11.5px", lineHeight: 1.62, color: "#1A1208", margin: 0, fontStyle: "italic" }}>
                    &ldquo;We work with the shops that make this town great,&rdquo; said the designer.
                  </p>
                </div>

                {/* Advertisement box */}
                <div style={{
                  border: "2px solid #0E0A04",
                  padding: "10px 12px",
                  textAlign: "center",
                  background: "rgba(0,0,0,0.034)",
                }}>
                  <p style={{ fontFamily: "Georgia, serif", fontSize: "7.5px", letterSpacing: "0.22em", textTransform: "uppercase", color: "#3A2810", marginBottom: "5px" }}>
                    Advertisement
                  </p>
                  <p style={{
                    fontFamily: "'Palatino Linotype', Palatino, 'Book Antiqua', Georgia, serif",
                    fontSize: "17px", fontWeight: 900, color: "#0E0A04",
                    textTransform: "uppercase", lineHeight: 1.15, marginBottom: "6px",
                  }}>
                    Route 9<br />Web Co.
                  </p>
                  <div style={{ borderTop: "1px solid #0E0A04", borderBottom: "1px solid #0E0A04", padding: "4px 0", margin: "6px 0" }}>
                    <p style={{ fontFamily: "Georgia, serif", fontSize: "10px", fontWeight: 700, color: "#0E0A04", letterSpacing: "0.06em", margin: 0 }}>
                      FREE DESIGN PREVIEW
                    </p>
                  </div>
                  <p style={{ fontFamily: "Georgia, serif", fontSize: "10.5px", color: "#1A1208", lineHeight: 1.5, marginBottom: "8px" }}>
                    No credit card.<br />No contracts. Ever.
                  </p>
                  <a
                    href="#contact"
                    style={{
                      fontFamily: "Georgia, serif",
                      fontSize: "10px", fontWeight: 700,
                      color: "#0E0A04",
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      textDecoration: "underline",
                      textUnderlineOffset: "2px",
                    }}
                  >
                    Speak With Us Today →
                  </a>
                </div>
              </div>
            </div>

            {/* ══ Footer rule ══ */}
            <div style={{ borderTop: "1.5px solid #0E0A04", marginTop: "16px", paddingTop: "8px" }}>
              <p style={{
                fontFamily: "Georgia, 'Times New Roman', serif",
                fontSize: "8.5px", color: "#3A2810",
                letterSpacing: "0.08em", textTransform: "uppercase",
                textAlign: "center", margin: 0,
              }}>
                The Shrewsbury Gazette &nbsp;·&nbsp; Route 9 Corridor &nbsp;·&nbsp; Shrewsbury, Massachusetts &nbsp;·&nbsp; Established 1847
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
