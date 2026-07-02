"use client";

/**
 * LandmarkBadge — a small circular photo keepsake in a layered "brass
 * porthole" frame: warm gradient outer ring, hairline inner ring, warm
 * saturated photo, and a cream caption chip hanging off the bottom edge.
 * Rests at a slight tilt; on hover it straightens and lifts 2px
 * (transform/box-shadow only — no layout work).
 *
 * Decorative by design: the wrapper is aria-hidden because the caption
 * text is ornamental place-name flavor, not content.
 */

const BADGE_CSS = `
.landmark-tilt {
  transform: rotate(var(--lb-tilt, -3deg));
  transition: transform 0.3s cubic-bezier(0.22, 1, 0.36, 1);
}
.landmark-badge:hover .landmark-tilt {
  transform: rotate(0deg) translateY(-2px);
}
.landmark-ring {
  box-shadow:
    0 1px 2px rgba(28, 18, 9, 0.1),
    0 6px 14px rgba(28, 18, 9, 0.12),
    0 14px 30px rgba(212, 104, 42, 0.14);
  transition: box-shadow 0.3s cubic-bezier(0.22, 1, 0.36, 1);
}
.landmark-badge:hover .landmark-ring {
  box-shadow:
    0 2px 4px rgba(28, 18, 9, 0.12),
    0 10px 22px rgba(28, 18, 9, 0.16),
    0 22px 44px rgba(212, 104, 42, 0.2);
}
@media (prefers-reduced-motion: reduce) {
  .landmark-tilt,
  .landmark-ring {
    transition: none;
  }
  .landmark-badge:hover .landmark-tilt {
    transform: rotate(var(--lb-tilt, -3deg));
  }
}
`;

export function LandmarkBadge({
  src,
  alt,
  caption,
  size = 84,
  tilt = -3,
  delay = 0,
  className = "",
}: {
  src: string;
  alt: string;
  caption: string;
  size?: number;
  tilt?: number;
  delay?: number;
  className?: string;
}) {
  return (
    <figure
      aria-hidden
      className={`landmark-badge reveal m-0 inline-block select-none ${className}`}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      <style>{BADGE_CSS}</style>
      <div
        className="landmark-tilt relative inline-flex flex-col items-center"
        style={{ "--lb-tilt": `${tilt}deg`, paddingBottom: "10px" } as React.CSSProperties}
      >
        {/* Outer brass ring — warm gradient border */}
        <div
          className="landmark-ring rounded-full p-[3px]"
          style={{
            background: "linear-gradient(145deg, #EFB07A 0%, #D4682A 42%, #9C4A1C 100%)",
          }}
        >
          {/* Inner hairline ring on a cream bezel */}
          <div
            className="rounded-full p-[2px]"
            style={{
              background: "#FBF3E7",
              boxShadow: "inset 0 0 0 1px rgba(156, 74, 28, 0.4)",
            }}
          >
            <img
              src={src}
              alt={alt}
              loading="lazy"
              width={size}
              height={size}
              className="block rounded-full object-cover"
              style={{
                width: `${size}px`,
                height: `${size}px`,
                filter: "saturate(1.12) sepia(0.08) contrast(1.02)",
              }}
            />
          </div>
        </div>
        {/* Caption chip — cream pill overlapping the circle's bottom edge */}
        <figcaption
          className="absolute bottom-0 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full px-2.5 py-[3px] font-bold uppercase"
          style={{
            fontSize: "9px",
            letterSpacing: "0.14em",
            fontFamily: "var(--font-display)",
            color: "#B05020",
            background: "linear-gradient(180deg, #FFFDF8 0%, #F5E9D7 100%)",
            border: "1px solid rgba(212, 104, 42, 0.3)",
            boxShadow: "0 1px 2px rgba(28, 18, 9, 0.08), 0 3px 8px rgba(28, 18, 9, 0.1)",
          }}
        >
          {caption}
        </figcaption>
      </div>
    </figure>
  );
}
