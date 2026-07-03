"use client";

import { useEffect, useRef, useState } from "react";

/* ── Napkin-math constants ──────────────────────────────
   A shop that's hard to find / looks closed online quietly
   loses ~5% of its online-first customers.
   Monthly lost revenue =
     customers/day × 30 days × %online-first × 5% × avg sale */
const DAYS_PER_MONTH = 30;
const LEAK_RATE = 0.05;
const PLAN_PRICE = 40; // $/mo care plan

function formatUSD(n: number) {
  return n.toLocaleString("en-US", { maximumFractionDigits: 0 });
}

/** Percent of track filled, for the slider's gradient fill. */
function fillPct(value: number, min: number, max: number) {
  return `${((value - min) / (max - min)) * 100}%`;
}

export function ROICalculator() {
  const [customers, setCustomers] = useState(40);
  const [avgSale, setAvgSale] = useState(18);
  const [pctOnline, setPctOnline] = useState(60);

  const lost = customers * DAYS_PER_MONTH * (pctOnline / 100) * LEAK_RATE * avgSale;
  const lostRounded = Math.round(lost);
  const multiple = lost / PLAN_PRICE;
  const multipleLabel =
    multiple >= 10 ? `${Math.round(multiple)}` : `${Math.round(multiple * 10) / 10}`;

  /* ── Count-up: rAF-interpolate the big figure toward the target.
     The span's text is owned by this effect after mount (its JSX child
     never changes), so React re-renders don't stomp the animation. */
  const figureRef = useRef<HTMLSpanElement>(null);
  const displayedRef = useRef(lostRounded);
  const rafRef = useRef(0);
  // Frozen initial text — deterministic for SSR/hydration.
  const [initialFigure] = useState(() => `$${formatUSD(lostRounded)}`);

  useEffect(() => {
    const el = figureRef.current;
    if (!el) return;
    const target = lostRounded;
    if (displayedRef.current === target) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      displayedRef.current = target;
      el.textContent = `$${formatUSD(target)}`;
      return;
    }

    const from = displayedRef.current;
    const start = performance.now();
    const DURATION = 550;
    cancelAnimationFrame(rafRef.current);
    const tick = (now: number) => {
      const t = Math.min((now - start) / DURATION, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      const v = Math.round(from + (target - from) * eased);
      displayedRef.current = v;
      el.textContent = `$${formatUSD(v)}`;
      if (t < 1) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [lostRounded]);

  const sliders = [
    {
      id: "roi-customers",
      label: "Customers a day",
      min: 5,
      max: 200,
      value: customers,
      set: setCustomers,
      chip: `${customers}`,
      valuetext: `${customers} customers a day`,
      footnote: null as string | null,
    },
    {
      id: "roi-avg-sale",
      label: "Average sale",
      min: 5,
      max: 200,
      value: avgSale,
      set: setAvgSale,
      chip: `$${avgSale}`,
      valuetext: `${avgSale} dollars per sale`,
      footnote: null as string | null,
    },
    {
      id: "roi-pct-online",
      label: "How many check you out online first?",
      min: 10,
      max: 90,
      value: pctOnline,
      set: setPctOnline,
      chip: `${pctOnline}%`,
      valuetext: `${pctOnline} percent check online first`,
      footnote: "76% of people who search local visit a business within a day.",
    },
  ];

  return (
    <div id="roi" style={{ scrollMarginTop: "96px" }}>
      <div
        className="relative overflow-hidden rounded-2xl border border-border bg-surface-raised p-7 md:p-10 shadow-[0_1px_2px_rgba(28,18,9,0.03),0_4px_14px_rgba(28,18,9,0.04),0_24px_48px_rgba(28,18,9,0.05)]"
      >
        <div className="label-pill mb-4">The back-of-the-napkin math</div>
        <h3
          className="text-2xl md:text-3xl font-bold tracking-tight text-fg leading-tight mb-8"
          style={{ fontFamily: "var(--font-display)" }}
        >
          What&apos;s being invisible costing you?
        </h3>

        <div className="grid md:grid-cols-2 gap-10 md:gap-14 items-center">
          {/* ── Sliders ── */}
          <div className="space-y-7">
            {sliders.map((s) => (
              <div key={s.id}>
                <div className="flex items-center justify-between gap-3 mb-2.5">
                  <label htmlFor={s.id} className="text-sm font-medium text-fg">
                    {s.label}
                  </label>
                  <span className="inline-flex min-w-[3.25rem] items-center justify-center rounded-full bg-accent/10 px-2.5 py-0.5 text-sm font-semibold tabular-nums text-accent">
                    {s.chip}
                  </span>
                </div>
                <input
                  id={s.id}
                  type="range"
                  min={s.min}
                  max={s.max}
                  step={1}
                  value={s.value}
                  aria-valuetext={s.valuetext}
                  onChange={(e) => s.set(Number(e.target.value))}
                  className="roi-range"
                  style={{ "--roi-fill": fillPct(s.value, s.min, s.max) } as React.CSSProperties}
                />
                {s.footnote && (
                  <p className="mt-2 text-xs text-muted leading-relaxed">{s.footnote}</p>
                )}
              </div>
            ))}
          </div>

          {/* ── Live output ── */}
          <div className="md:border-l md:border-dashed md:border-border md:pl-14">
            <span
              ref={figureRef}
              aria-hidden
              className="block text-5xl md:text-6xl font-bold tracking-tight text-gradient tabular-nums leading-none"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {initialFigure}
            </span>
            <p className="mt-2 text-muted">left on the counter every month</p>

            {/* Screen-reader-friendly result (the animated figure above is aria-hidden) */}
            <p className="sr-only" aria-live="polite" aria-atomic="true">
              About ${formatUSD(lostRounded)} lost every month — {multipleLabel} times the $
              {PLAN_PRICE} monthly care plan.
            </p>

            <div className="mt-5 inline-flex flex-wrap items-center gap-x-2 gap-y-1 rounded-full border border-border bg-surface px-3.5 py-1.5 text-xs">
              <span className="font-semibold text-fg">The care plan: ${PLAN_PRICE}/mo</span>
              <span aria-hidden className="text-muted-light">·</span>
              <span className="text-accent font-semibold tabular-nums">
                that&apos;s {multipleLabel}&times; the plan
              </span>
            </div>

            <div className="mt-6">
              <a
                href="#contact"
                onClick={() => {
                  window.dispatchEvent(
                    new CustomEvent("r9:contact-prefill", {
                      detail: {
                        message: `Hi! By my napkin math I'm leaving about $${formatUSD(lostRounded)}/mo on the counter. Let's talk.`,
                      },
                    })
                  );
                }}
                className="nav-cta-shimmer inline-flex items-center justify-center h-11 px-6 rounded-xl text-[#1C1209] text-sm font-bold transition-[transform,box-shadow] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5"
                style={{
                  background: "linear-gradient(145deg, #E07838 0%, #D4682A 45%, #B05020 100%)",
                  boxShadow:
                    "0 0 0 1px rgba(212,104,42,0.4), 0 4px 16px rgba(212,104,42,0.35), 0 1px 0 rgba(255,220,160,0.2) inset, 0 -1px 0 rgba(0,0,0,0.15) inset",
                }}
              >
                Stop the leak
              </a>
            </div>

            <p className="mt-4 text-xs italic text-muted">
              Napkin math, not a promise — but the direction is right.
            </p>
          </div>
        </div>
      </div>

      {/* Component-scoped slider styling — premium track/thumb in both themes.
          The site sets a global accent-color; this replaces the native look
          with a brand-matched filled track + ringed thumb. */}
      <style>{`
        .roi-range {
          -webkit-appearance: none;
          appearance: none;
          display: block;
          width: 100%;
          height: 6px;
          border-radius: 9999px;
          background: linear-gradient(
            to right,
            var(--accent) 0%,
            var(--accent) var(--roi-fill, 50%),
            var(--border) var(--roi-fill, 50%),
            var(--border) 100%
          );
          outline: none;
          cursor: pointer;
          transition: box-shadow 0.3s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .roi-range:focus-visible {
          box-shadow: 0 0 0 3px color-mix(in srgb, var(--accent) 22%, transparent);
        }
        .roi-range::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: var(--accent);
          border: 3px solid var(--surface-raised);
          box-shadow:
            0 0 0 1px color-mix(in srgb, var(--accent) 45%, transparent),
            0 2px 6px rgba(28, 18, 9, 0.28);
          transition:
            transform 0.3s cubic-bezier(0.22, 1, 0.36, 1),
            box-shadow 0.3s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .roi-range::-webkit-slider-thumb:hover,
        .roi-range::-webkit-slider-thumb:active {
          transform: scale(1.15);
          box-shadow:
            0 0 0 1px color-mix(in srgb, var(--accent) 55%, transparent),
            0 0 0 6px color-mix(in srgb, var(--accent) 14%, transparent),
            0 2px 8px rgba(28, 18, 9, 0.3);
        }
        .roi-range::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: var(--accent);
          border: 3px solid var(--surface-raised);
          box-shadow:
            0 0 0 1px color-mix(in srgb, var(--accent) 45%, transparent),
            0 2px 6px rgba(28, 18, 9, 0.28);
          transition:
            transform 0.3s cubic-bezier(0.22, 1, 0.36, 1),
            box-shadow 0.3s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .roi-range::-moz-range-thumb:hover,
        .roi-range::-moz-range-thumb:active {
          transform: scale(1.15);
          box-shadow:
            0 0 0 1px color-mix(in srgb, var(--accent) 55%, transparent),
            0 0 0 6px color-mix(in srgb, var(--accent) 14%, transparent),
            0 2px 8px rgba(28, 18, 9, 0.3);
        }
        .roi-range::-moz-range-track {
          background: transparent;
        }
        @media (prefers-reduced-motion: reduce) {
          .roi-range,
          .roi-range::-webkit-slider-thumb,
          .roi-range::-moz-range-thumb {
            transition: none;
          }
        }
      `}</style>
    </div>
  );
}
