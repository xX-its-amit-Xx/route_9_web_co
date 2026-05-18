type Props = {
  items: readonly string[];
  className?: string;
};

// Emoji icons that match Route 9 business types
const BUSINESS_ICONS: Record<string, string> = {
  "Restaurants & Pizzerias": "🍕",
  "Cafes & Coffee Shops":    "☕",
  "Barbershops":             "✂️",
  "Salons & Spas":           "💅",
  "Nail Salons":             "✨",
  "Bakeries":                "🥐",
  "Specialty Retail":        "🛍️",
  "Auto Repair":             "🔧",
  "Boutiques":               "👗",
  "Florists":                "🌸",
  "Pet Grooming":            "🐾",
  "Yoga Studios":            "🧘",
  "Dry Cleaners":            "👔",
};

export function Marquee({ items, className = "" }: Props) {
  const doubled = [...items, ...items];

  return (
    <div
      className={`overflow-hidden ${className}`}
      aria-hidden
      style={{
        perspective: "600px",
        WebkitMaskImage: "linear-gradient(90deg, transparent 0%, black 7%, black 93%, transparent 100%)",
        maskImage: "linear-gradient(90deg, transparent 0%, black 7%, black 93%, transparent 100%)",
      }}
    >
      <div className="marquee-track gap-3 py-2.5">
        {doubled.map((item, i) => {
          const emoji = BUSINESS_ICONS[item];
          return (
            <span
              key={i}
              className="marquee-pill flex-shrink-0 inline-flex items-center gap-2.5 whitespace-nowrap select-none"
              style={{
                padding: "9px 18px 9px 14px",
                borderRadius: "9999px",
                fontSize: "12.5px",
                fontWeight: 600,
                letterSpacing: "0.01em",
                color: "rgba(243,233,213,0.82)",
                /* Dark glass base */
                background:
                  "linear-gradient(170deg, rgba(38,20,6,0.92) 0%, rgba(20,10,2,0.96) 55%, rgba(30,15,4,0.9) 100%)",
                border: "1px solid rgba(212,104,42,0.38)",
                /* 3D bevel: top-left highlight + bottom-right depth */
                boxShadow: [
                  /* Top highlight — light from above */
                  "inset 0 1.5px 0 rgba(255,200,100,0.22)",
                  /* Bottom depth edge */
                  "inset 0 -1.5px 0 rgba(0,0,0,0.45)",
                  /* Left rim light */
                  "inset 1px 0 0 rgba(255,180,80,0.08)",
                  /* Right shadow rim */
                  "inset -1px 0 0 rgba(0,0,0,0.2)",
                  /* Outer cast shadow — gives the "raised" feeling */
                  "0 6px 18px rgba(0,0,0,0.55)",
                  "0 2px 6px rgba(0,0,0,0.4)",
                  "0 1px 2px rgba(0,0,0,0.5)",
                  /* Subtle warm aura */
                  "0 0 24px rgba(212,104,42,0.07)",
                ].join(", "),
                backdropFilter: "blur(10px)",
                WebkitBackdropFilter: "blur(10px)",
                transformStyle: "preserve-3d",
              }}
            >
              {/* Emoji icon */}
              {emoji && (
                <span
                  style={{
                    fontSize: "14px",
                    lineHeight: 1,
                    filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.5))",
                  }}
                >
                  {emoji}
                </span>
              )}
              {/* Fallback dot if no emoji */}
              {!emoji && (
                <span
                  style={{
                    width: "5px",
                    height: "5px",
                    borderRadius: "50%",
                    flexShrink: 0,
                    background: "radial-gradient(circle at 40% 35%, #F0A060, #D4682A)",
                    boxShadow: "0 0 8px rgba(212,104,42,0.8), 0 1px 2px rgba(0,0,0,0.4)",
                  }}
                />
              )}
              {item}
            </span>
          );
        })}
      </div>
    </div>
  );
}
