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
            className="flex-shrink-0 inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[rgba(212,104,42,0.25)] bg-[rgba(212,104,42,0.08)] text-[#9B8C7D] text-sm font-medium whitespace-nowrap"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#D4682A] flex-shrink-0" />
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
