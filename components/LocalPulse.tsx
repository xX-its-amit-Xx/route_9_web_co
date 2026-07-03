"use client";

import { useEffect, useState } from "react";

/* ── "Route 9 right now" — live local-awareness chip ──────────────
   Fetches current Shrewsbury weather from Open-Meteo (no key),
   caches it in sessionStorage for 30 min, and renders a compact
   glass chip under the hero CTAs. If the fetch fails or times out
   it degrades to a time-of-day-only greeting — never an error.
   Renders nothing (zero space) until one of those states resolves,
   then fades in. */

const CACHE_KEY = "r9-pulse";
const CACHE_TTL_MS = 30 * 60 * 1000;
const FETCH_TIMEOUT_MS = 4000;
const API_URL =
  "https://api.open-meteo.com/v1/forecast?latitude=42.2959&longitude=-71.7126&current=temperature_2m,weather_code&temperature_unit=fahrenheit&timezone=America%2FNew_York";

type Bucket =
  | "sun"
  | "partly"
  | "overcast"
  | "fog"
  | "drizzle"
  | "rain"
  | "snow"
  | "thunder";

const BUCKET_WORD: Record<Bucket, string> = {
  sun: "clear",
  partly: "partly cloudy",
  overcast: "overcast",
  fog: "foggy",
  drizzle: "drizzling",
  rain: "raining",
  snow: "snowing",
  thunder: "thundering",
};

/** Precipitation buckets earn the italic sales nudge. */
const WET_BUCKETS: ReadonlySet<Bucket> = new Set([
  "drizzle",
  "rain",
  "snow",
  "thunder",
]);

function bucketFor(code: number): Bucket {
  if (code <= 1) return "sun";
  if (code === 2) return "partly";
  if (code === 3) return "overcast";
  if (code === 45 || code === 48) return "fog";
  if (code >= 51 && code <= 57) return "drizzle";
  if ((code >= 61 && code <= 67) || (code >= 80 && code <= 82)) return "rain";
  if ((code >= 71 && code <= 77) || code === 85 || code === 86) return "snow";
  if (code >= 95) return "thunder";
  return "overcast";
}

/** Greeting computed in America/New_York regardless of visitor clock. */
function computeGreeting(): string {
  const hour = Number(
    new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      hourCycle: "h23",
      timeZone: "America/New_York",
    }).format(new Date()),
  );
  if (hour >= 5 && hour < 11) return "Good morning, Shrewsbury";
  if (hour >= 11 && hour < 17) return "Good afternoon, Shrewsbury";
  if (hour >= 17 && hour < 22) return "Good evening, Shrewsbury";
  return "Burning the midnight oil?";
}

interface CachedPulse {
  t: number;
  tempF: number;
  code: number;
}

function readCache(): CachedPulse | null {
  try {
    const raw = sessionStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<CachedPulse>;
    if (
      typeof parsed.t !== "number" ||
      typeof parsed.tempF !== "number" ||
      typeof parsed.code !== "number" ||
      Date.now() - parsed.t > CACHE_TTL_MS
    ) {
      return null;
    }
    return parsed as CachedPulse;
  } catch {
    return null;
  }
}

function writeCache(tempF: number, code: number) {
  try {
    sessionStorage.setItem(
      CACHE_KEY,
      JSON.stringify({ t: Date.now(), tempF, code }),
    );
  } catch {
    /* storage unavailable — fine, we just refetch next navigation */
  }
}

/* ── Tiny hand-drawn weather glyphs (12px, warm strokes) ── */

const STROKE = "#D98B4E";

function Glyph({ bucket }: { bucket: Bucket }) {
  const common = {
    width: 12,
    height: 12,
    viewBox: "0 0 12 12",
    fill: "none",
    stroke: STROKE,
    strokeWidth: 1.1,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };
  // A slightly lopsided cloud, reused so the set feels like one hand drew it
  const cloud =
    "M3.1 6.5h5.3c.9 0 1.6-.7 1.6-1.5 0-.9-.8-1.5-1.6-1.5h-.1C8 2.5 7.1 1.8 6.1 1.8c-1.1 0-2 .8-2.2 1.9-.8 0-1.5.7-1.5 1.4 0 .8.7 1.4 1.5 1.4z";
  switch (bucket) {
    case "sun":
      return (
        <svg {...common}>
          <circle cx="6" cy="6" r="2.1" />
          <path d="M6 1.1v1.2M6 9.7v1.1M1.1 6h1.2M9.7 6h1.2M2.6 2.7l.9.8M8.5 8.5l.8.8M9.4 2.6l-.9.9M3.4 8.5l-.8.9" />
        </svg>
      );
    case "partly":
      return (
        <svg {...common}>
          <circle cx="3.9" cy="4" r="1.6" />
          <path d="M3.9 1.1v.8M1.1 4h.8M1.9 1.9l.6.6" />
          <path d="M5.2 10h3.9c.9 0 1.6-.7 1.6-1.5S10 7.1 9.2 7.1c-.2-1-1.1-1.7-2.1-1.7s-1.9.8-2.1 1.8c-.7.1-1.2.7-1.2 1.3 0 .8.6 1.5 1.4 1.5z" />
        </svg>
      );
    case "overcast":
      return (
        <svg {...common}>
          <path d="M3 8h5.7c1 0 1.8-.8 1.8-1.7S9.7 4.6 8.7 4.6h-.1C8.3 3.5 7.3 2.7 6.2 2.7 5 2.7 4 3.5 3.8 4.7c-.9.1-1.6.8-1.6 1.6C2.2 7.2 2.9 8 3 8z" />
          <path d="M3.9 10h4.4" />
        </svg>
      );
    case "fog":
      return (
        <svg {...common}>
          <path d="M2 3.6c1.3-.4 2.7.4 4 0s2.7.3 4 0" />
          <path d="M1.6 6c1.5-.4 2.9.4 4.4 0s2.9.3 4.4 0" />
          <path d="M2.4 8.4c1.2-.4 2.4.4 3.6 0s2.4.3 3.6 0" />
        </svg>
      );
    case "drizzle":
      return (
        <svg {...common}>
          <path d={cloud} />
          <path d="M4.5 8.2l-.4 1.1M7.5 8.2l-.4 1.1" />
        </svg>
      );
    case "rain":
      return (
        <svg {...common}>
          <path d={cloud} />
          <path d="M3.9 8l-.6 1.7M6.1 8l-.6 1.7M8.3 8l-.6 1.7" />
        </svg>
      );
    case "snow":
      return (
        <svg {...common}>
          <path d={cloud} />
          <path d="M4.3 8.2v1.5M3.6 9h1.5M7.7 8.2v1.5M7 9h1.5" />
        </svg>
      );
    case "thunder":
      return (
        <svg {...common}>
          <path d={cloud} />
          <path d="M6.7 7.2L5.3 9.1h1.6l-1.1 2" />
        </svg>
      );
  }
}

/* ── Component ── */

interface Pulse {
  greeting: string;
  weather: { tempF: number; bucket: Bucket } | null;
}

export function LocalPulse() {
  const [pulse, setPulse] = useState<Pulse | null>(null);

  useEffect(() => {
    let cancelled = false;
    const greeting = computeGreeting();

    const cached = readCache();
    if (cached) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time sessionStorage hydration on mount
      setPulse({
        greeting,
        weather: { tempF: cached.tempF, bucket: bucketFor(cached.code) },
      });
      return;
    }

    const ctrl = new AbortController();
    const timeoutId = setTimeout(() => ctrl.abort(), FETCH_TIMEOUT_MS);

    fetch(API_URL, { signal: ctrl.signal })
      .then((res) => {
        if (!res.ok) throw new Error("bad status");
        return res.json();
      })
      .then((json: { current?: { temperature_2m?: number; weather_code?: number } }) => {
        const tempF = Math.round(json?.current?.temperature_2m ?? NaN);
        const code = json?.current?.weather_code;
        if (!Number.isFinite(tempF) || typeof code !== "number") {
          throw new Error("bad payload");
        }
        writeCache(tempF, code);
        if (!cancelled) {
          setPulse({ greeting, weather: { tempF, bucket: bucketFor(code) } });
        }
      })
      .catch(() => {
        // Fetch failed or timed out — degrade to time-only, never an error
        if (!cancelled) setPulse({ greeting, weather: null });
      })
      .finally(() => clearTimeout(timeoutId));

    return () => {
      cancelled = true;
      ctrl.abort();
      clearTimeout(timeoutId);
    };
  }, []);

  // Nothing resolved yet (or SSR) — reserve no space
  if (!pulse) return null;

  const { greeting, weather } = pulse;
  const wet = weather !== null && WET_BUCKETS.has(weather.bucket);
  const conditions = weather
    ? `${weather.tempF}° and ${BUCKET_WORD[weather.bucket]} on Route 9 · ${greeting}`
    : greeting;
  const nudge = " — good day to fix your website.";

  return (
    <div style={{ animation: "r9-pulse-in 0.9s ease both", marginBottom: "28px" }}>
      <div
        role="note"
        aria-label={`Local conditions right now: ${conditions}${wet ? nudge : ""}`}
        className="inline-flex items-center gap-2 rounded-full"
        style={{
          padding: "7px 14px",
          background:
            "linear-gradient(145deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.03) 100%)",
          border: "1px solid rgba(255,255,255,0.11)",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
          fontSize: "11px",
          fontWeight: 500,
          color: "rgba(243,233,213,0.62)",
          letterSpacing: "0.02em",
          lineHeight: 1.4,
        }}
      >
        {weather && (
          <span aria-hidden style={{ display: "inline-flex", flexShrink: 0 }}>
            <Glyph bucket={weather.bucket} />
          </span>
        )}
        <span aria-hidden>
          {conditions}
          {wet && (
            <em style={{ color: "rgba(243,233,213,0.38)", fontStyle: "italic" }}>
              {nudge}
            </em>
          )}
        </span>
      </div>
      <style>{`@keyframes r9-pulse-in { from { opacity: 0; } to { opacity: 1; } }`}</style>
    </div>
  );
}
