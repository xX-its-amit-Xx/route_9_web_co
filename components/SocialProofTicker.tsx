// Thin rotating strip of local proof items — sits between sections

const ITEMS = [
  { text: "5-star reviews from Route 9 shops" },
  { text: "Sites built in 48 hours" },
  { text: "Shrewsbury, MA · locally owned & operated" },
  { text: "Replies within 2 hours · usually less" },
  { text: "You own your site · no lock-in contracts" },
  { text: "Mobile-first · loads under 2 seconds" },
  { text: "Meet in person at your shop on Route 9" },
  { text: "Free preview before you pay anything" },
];

function AccentDot() {
  return (
    <span
      aria-hidden
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        width: "14px",
        height: "14px",
      }}
    >
      <svg viewBox="0 0 14 14" fill="none" width="14" height="14" aria-hidden>
        <path
          d="M7 2L8.2 5.8H12.2L9 8.1L10.2 11.9L7 9.6L3.8 11.9L5 8.1L1.8 5.8H5.8Z"
          fill="rgba(212,104,42,0.55)"
        />
      </svg>
    </span>
  );
}

export function SocialProofTicker() {
  const doubled = [...ITEMS, ...ITEMS];

  return (
    <div
      className="overflow-hidden py-2.5 border-y relative"
      style={{
        background: "linear-gradient(90deg, rgba(212,104,42,0.04) 0%, rgba(212,104,42,0.07) 50%, rgba(212,104,42,0.04) 100%)",
        borderColor: "rgba(212,104,42,0.1)",
      }}
      aria-hidden
    >
      {/* Left fade mask */}
      <div
        className="absolute left-0 top-0 bottom-0 w-20 pointer-events-none z-10"
        style={{ background: "linear-gradient(90deg, var(--bg) 0%, transparent 100%)" }}
      />
      {/* Right fade mask */}
      <div
        className="absolute right-0 top-0 bottom-0 w-20 pointer-events-none z-10"
        style={{ background: "linear-gradient(270deg, var(--bg) 0%, transparent 100%)" }}
      />
      <div className="social-proof-track flex items-center gap-0">
        {doubled.map((item, i) => (
          <span key={i} className="flex items-center gap-2.5 flex-shrink-0 px-5">
            <AccentDot />
            <span
              style={{
                fontSize: "11px",
                fontWeight: 500,
                color: "var(--muted)",
                whiteSpace: "nowrap",
                letterSpacing: "0.02em",
              }}
            >
              {item.text}
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}
