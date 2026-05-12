type Props = {
  items: readonly string[];
  className?: string;
};

export function Marquee({ items, className = "" }: Props) {
  const doubled = [...items, ...items];

  return (
    <div
      className={`overflow-hidden ${className}`}
      aria-hidden
    >
      <div className="marquee-track gap-3 py-1">
        {doubled.map((item, i) => (
          <span
            key={i}
            className="flex-shrink-0 inline-flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium"
            style={{
              background: "linear-gradient(160deg, rgba(212,104,42,0.16) 0%, rgba(150,60,10,0.09) 100%)",
              border: "1px solid rgba(212,104,42,0.28)",
              color: "#B09070",
              backdropFilter: "blur(6px)",
              WebkitBackdropFilter: "blur(6px)",
              boxShadow:
                "0 2px 8px rgba(0,0,0,0.14), inset 0 1px 0 rgba(255,210,140,0.14), inset 0 -1px 0 rgba(0,0,0,0.08)",
            }}
          >
            <span
              className="flex-shrink-0"
              style={{
                width: "5px",
                height: "5px",
                borderRadius: "50%",
                background: "#D4682A",
                boxShadow: "0 0 7px rgba(212,104,42,0.9), 0 0 0 2px rgba(212,104,42,0.18)",
              }}
            />
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
