"use client";

/**
 * Vintage newspaper clipping — a torn-out section of a fictional local
 * paper covering Route 9 Web Co. Used as a decorative "press" artifact
 * in the About section.
 *
 * Pure SVG (paper, torn edges, body text shapes) + HTML overlay so the
 * masthead and body text are real selectable text. The HTML text sits
 * inside a clipped region that matches the torn-edge SVG silhouette.
 *
 * Decorative (aria-hidden). The whole article is "fictional press" so
 * AT can safely skip it.
 */
export function NewspaperClipping() {
  // The torn-edge path data — used both for the SVG outline and the
  // clip-path on the HTML content layer so the content is silhouetted
  // to the same torn shape.
  const TORN =
    "M 0 14 L 8 6 L 18 14 L 28 4 L 40 12 L 54 6 L 68 14 L 84 8 L 98 14 L 114 6 L 126 12 L 138 4 L 152 14 L 166 6 L 180 12 L 196 4 L 210 14 L 226 6 L 240 12 L 256 4 L 270 12 L 286 6 L 298 14 L 310 4 L 320 12 L 320 268 L 314 276 L 304 268 L 290 274 L 278 268 L 264 276 L 252 270 L 238 276 L 224 270 L 210 276 L 198 270 L 184 276 L 170 270 L 156 274 L 142 268 L 128 274 L 114 268 L 100 276 L 86 270 L 72 274 L 58 268 L 46 274 L 32 268 L 18 274 L 6 268 L 0 274 Z";

  return (
    <div
      aria-hidden
      className="newspaper-clipping inline-block select-none relative"
      style={{
        width: 320,
        maxWidth: "100%",
        transform: "rotate(-1.5deg)",
        filter:
          "drop-shadow(0 6px 14px rgba(28,18,9,0.22)) drop-shadow(0 2px 4px rgba(28,18,9,0.18))",
      }}
    >
      {/* Background SVG — torn paper silhouette with grain and stains */}
      <svg
        viewBox="0 0 320 280"
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: "100%", height: "auto", display: "block" }}
      >
        <defs>
          <linearGradient id="np-paper" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#F8E9C0" />
            <stop offset="100%" stopColor="#DDB87A" />
          </linearGradient>
          <pattern id="np-fiber" x="0" y="0" width="2.4" height="2.4" patternUnits="userSpaceOnUse">
            <circle cx="0.7" cy="0.7" r="0.28" fill="rgba(168,72,24,0.16)" />
          </pattern>
          <radialGradient id="np-coffee" cx="20%" cy="78%" r="22%">
            <stop offset="0%"   stopColor="rgba(168,72,24,0.32)" />
            <stop offset="70%"  stopColor="rgba(168,72,24,0.08)" />
            <stop offset="100%" stopColor="rgba(168,72,24,0)" />
          </radialGradient>
          <clipPath id="np-torn-clip" clipPathUnits="userSpaceOnUse">
            <path d={TORN} />
          </clipPath>
        </defs>

        {/* Torn paper body */}
        <path d={TORN} fill="url(#np-paper)" stroke="rgba(168,72,24,0.45)" strokeWidth="0.6" />
        {/* Fiber grain over the paper, clipped to the torn shape */}
        <g clipPath="url(#np-torn-clip)">
          <rect x="0" y="0" width="320" height="280" fill="url(#np-fiber)" opacity="0.55" />
          {/* Coffee-ring stain */}
          <rect x="0" y="0" width="320" height="280" fill="url(#np-coffee)" />
          {/* A faint horizontal fold crease */}
          <line x1="0" y1="148" x2="320" y2="148" stroke="rgba(168,72,24,0.18)" strokeWidth="0.5" />
          <line x1="0" y1="149" x2="320" y2="149" stroke="rgba(255,240,200,0.4)" strokeWidth="0.5" />
        </g>
      </svg>

      {/* HTML content overlaid on top, clipped to the same torn silhouette
          so any text that lands near the edge gets cut by the rip line. */}
      <div
        className="absolute inset-0"
        style={{
          padding: "26px 22px 30px",
          color: "#1C1209",
          fontFamily: "Georgia, 'Times New Roman', serif",
          clipPath: "url(#np-torn-clip)",
          WebkitClipPath: "url(#np-torn-clip)",
        }}
      >
        {/* Masthead */}
        <div
          style={{
            fontFamily: "'Old English Text MT', 'UnifrakturCook', Georgia, serif",
            fontSize: "14px",
            fontWeight: 900,
            textAlign: "center",
            letterSpacing: "0.04em",
            color: "#1C1209",
            borderBottom: "2px solid #1C1209",
            paddingBottom: "2px",
            marginBottom: "3px",
          }}
        >
          The Shrewsbury Herald
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontFamily: "monospace",
            fontSize: "6.5px",
            color: "rgba(28,18,9,0.7)",
            letterSpacing: "0.16em",
            paddingBottom: "10px",
            marginBottom: "8px",
            borderBottom: "0.5px solid rgba(168,72,24,0.5)",
          }}
        >
          <span>VOL. CXXVII · NO. 412</span>
          <span>MAY 17, 2026</span>
          <span>FIVE CENTS</span>
        </div>

        {/* Headline */}
        <h4
          style={{
            margin: "0 0 4px 0",
            fontFamily: "Georgia, 'Times New Roman', serif",
            fontWeight: 900,
            fontSize: "17px",
            lineHeight: "20px",
            letterSpacing: "-0.01em",
            textAlign: "center",
          }}
        >
          Local Shops Find Friend in Route 9 Web Co.
        </h4>
        <div
          style={{
            fontFamily: "Georgia, serif",
            fontStyle: "italic",
            fontSize: "10px",
            color: "rgba(28,18,9,0.7)",
            textAlign: "center",
            marginBottom: "8px",
            letterSpacing: "0.04em",
          }}
        >
          Hand-built websites for the barbers, bakers,<br /> and family restaurants of Shrewsbury.
        </div>

        {/* Two-column body */}
        <div
          style={{
            columnCount: 2,
            columnGap: "10px",
            columnRule: "0.5px solid rgba(168,72,24,0.45)",
            fontSize: "9px",
            lineHeight: "12px",
            color: "rgba(28,18,9,0.88)",
            textAlign: "justify",
            hyphens: "auto",
          }}
        >
          <p style={{ margin: "0 0 4px 0" }}>
            <span style={{
              fontFamily: "Georgia, serif",
              fontWeight: 900,
              fontSize: "18px",
              float: "left",
              lineHeight: "16px",
              paddingRight: "3px",
              paddingTop: "1px",
              color: "#A84818",
            }}>S</span>
            HREWSBURY — A new outfit on the Route 9 corridor is building modern websites for the kind of shops that still answer the phone themselves. Run by a longtime developer who lives in town, the practice offers a free preview before a dollar changes hands.
          </p>
          <p style={{ margin: "0 0 0 0" }}>
            &quot;The big agency model isn&apos;t right for a barbershop,&quot; the proprietor said this week. &quot;Around here, the owner is usually behind the counter. The website should match.&quot; First clients are being onboarded now — appointments by text, in person, or just stopping in.
          </p>
        </div>
      </div>
    </div>
  );
}
