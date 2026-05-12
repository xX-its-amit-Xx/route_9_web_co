"use client";

import { useScrollReveal } from "@/lib/useScrollReveal";
import { TiltCard } from "./TiltCard";
import { SplitTextReveal } from "./SplitTextReveal";
import { PILLARS } from "@/lib/content";

// ── Custom artisan SVG icons ──────────────────────────────────────────────────

function IconMobile() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" aria-hidden>
      <rect x="5.5" y="1.5" width="13" height="21" rx="2.5" stroke="currentColor" strokeWidth="1.5" />
      <line x1="5.5" y1="4.5" x2="18.5" y2="4.5" stroke="currentColor" strokeWidth="0.75" />
      <line x1="5.5" y1="19.5" x2="18.5" y2="19.5" stroke="currentColor" strokeWidth="0.75" />
      <rect x="7.5" y="6.5" width="9" height="10.5" rx="0.75" stroke="currentColor" strokeWidth="1" />
      <path d="M7.5 9.5L12 7.5L16.5 9.5" stroke="currentColor" strokeWidth="1" strokeLinejoin="round" />
      <rect x="10" y="12" width="1.75" height="2.75" rx="0.25" stroke="currentColor" strokeWidth="0.75" />
      <rect x="12.5" y="12" width="1.75" height="2.75" rx="0.25" stroke="currentColor" strokeWidth="0.75" />
    </svg>
  );
}

function IconSpeed() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" aria-hidden>
      <path
        d="M13 2L4 14h7l-1 8 10-12h-7z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconConvert() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" aria-hidden>
      <path
        d="M10 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H10"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M14 7L21 12L14 17"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M21 12H8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function IconMapPin() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" aria-hidden>
      <path
        d="M12 2C8.686 2 6 4.686 6 8C6 13 12 22 12 22C12 22 18 13 18 8C18 4.686 15.314 2 12 2Z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <circle cx="12" cy="8" r="2.5" stroke="currentColor" strokeWidth="1.25" />
      <path d="M20.5 4C21.8 5.8 22.5 8 22.5 10.5" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
      <path d="M3.5 4C2.2 5.8 1.5 8 1.5 10.5" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
    </svg>
  );
}

function IconAccessible() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" aria-hidden>
      <circle cx="8" cy="4" r="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8 8V14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M5.5 10.5L4 14.5" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
      <path d="M10.5 10.5L12 14.5" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
      <circle cx="17" cy="5.5" r="1.5" stroke="currentColor" strokeWidth="1.25" />
      <path d="M17 9V13.5" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
      <path d="M15 11L13.5 14.5" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
      <path d="M19 11L20.5 14.5" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
    </svg>
  );
}

function IconMaintain() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" aria-hidden>
      <rect x="3" y="5" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M3 10H21" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8 3V7M16 3V7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path
        d="M8 14.5L11 17.5L16 12.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// ── Demo label badge ──────────────────────────────────────────────────────────
function DemoLabel({ text, bad }: { text: string; bad?: boolean }) {
  return (
    <div
      className="text-[7px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full inline-block mb-1 flex-shrink-0"
      style={{
        color: bad ? "#ef4444" : "#10b981",
        background: bad ? "rgba(239,68,68,0.1)" : "rgba(16,185,129,0.1)",
        border: `1px solid ${bad ? "rgba(239,68,68,0.2)" : "rgba(16,185,129,0.2)"}`,
      }}
    >
      {text}
    </div>
  );
}

// Shared cursor SVG
function CursorSVG() {
  return (
    <svg viewBox="0 0 12 12" fill="none" style={{ width: "100%", height: "100%" }}>
      <path
        d="M1 1L1 9L3.5 7L5 11L6 10.5L4.5 6.5L7.5 6.5Z"
        fill="#374151"
        stroke="white"
        strokeWidth="0.5"
      />
    </svg>
  );
}

// ── 1. MobileFirstDemo ────────────────────────────────────────────────────────
function MobileFirstDemo() {
  return (
    <div className="flex gap-2 p-3 h-full items-stretch">
      {/* Bad */}
      <div className="flex-1 flex flex-col">
        <DemoLabel text="No Mobile" bad />
        <div className="flex-1 relative rounded-xl border-2 border-red-200 bg-white overflow-hidden">
          {/* Overflowing content with horizontal scroll wobble */}
          <div
            className="absolute top-1.5 left-1.5"
            style={{ width: "165%", animation: "demo-scroll-bad 5s ease-in-out infinite" }}
          >
            <div className="h-2 bg-gray-200 rounded mb-1" />
            <div className="h-1.5 bg-gray-100 rounded mb-0.5 w-full" />
            <div className="h-1.5 bg-gray-100 rounded mb-0.5 w-5/6" />
            <div className="flex gap-0.5 mt-1 flex-nowrap">
              {["About", "Gallery", "Services", "Menu", "Contact"].map((t) => (
                <div
                  key={t}
                  className="h-3.5 px-1 rounded bg-gray-100 text-[4.5px] text-gray-400 flex items-center flex-shrink-0"
                >
                  {t}
                </div>
              ))}
            </div>
          </div>
          {/* Horizontal scrollbar */}
          <div className="absolute bottom-1.5 left-1.5 right-1.5 h-1 bg-gray-100 rounded-full">
            <div className="h-full w-1/3 bg-gray-300 rounded-full" style={{ marginLeft: "45%" }} />
          </div>
          {/* Red badge */}
          <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[7px] font-bold flex items-center justify-center flex-shrink-0">
            ✕
          </div>
        </div>
      </div>

      <div className="w-px bg-[#E8D9C4] self-stretch flex-shrink-0" />

      {/* Good */}
      <div className="flex-1 flex flex-col">
        <DemoLabel text="Mobile-First" />
        <div className="flex-1 relative rounded-xl border-2 border-emerald-200 bg-white overflow-hidden">
          <div className="absolute inset-1.5 flex flex-col gap-1">
            {/* Nav bar */}
            <div className="h-2.5 bg-orange-50 border border-orange-100 rounded flex items-center px-1 gap-1">
              <div className="w-3 h-1 bg-orange-300 rounded" />
              <div className="flex-1" />
              <div className="w-2 h-1 bg-orange-200 rounded" />
            </div>
            {/* Headline */}
            <div className="h-3 bg-gray-800 rounded text-[5px] text-white font-bold flex items-center px-1.5 flex-shrink-0">
              Fresh Cuts – Shrewsbury
            </div>
            <div className="h-1.5 bg-gray-100 rounded flex-shrink-0" />
            <div className="h-1.5 bg-gray-100 rounded w-3/4 flex-shrink-0" />
            {/* Big CTA */}
            <div
              className="mt-auto rounded text-[5.5px] text-white font-bold flex items-center justify-center py-2 flex-shrink-0"
              style={{
                background: "linear-gradient(135deg,#D4682A,#C05A20)",
                animation: "demo-btn-pulse 2.2s ease-in-out infinite",
              }}
            >
              📅 Book Now →
            </div>
          </div>
          {/* Green badge */}
          <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-emerald-500 text-white text-[8px] font-bold flex items-center justify-center flex-shrink-0">
            ✓
          </div>
        </div>
      </div>
    </div>
  );
}

// ── 2. SpeedDemo ──────────────────────────────────────────────────────────────
function SpeedDemo() {
  return (
    <div className="flex gap-2 p-3 h-full items-stretch">
      {/* Bad: slow */}
      <div className="flex-1 flex flex-col">
        <DemoLabel text="4.8s load" bad />
        <div className="flex-1 rounded-xl border border-red-200 bg-white overflow-hidden p-1.5 flex flex-col gap-1">
          <div className="h-3 bg-gray-100 rounded flex items-center px-1.5 gap-1 flex-shrink-0">
            <div className="w-1.5 h-1.5 rounded-full bg-gray-300 flex-shrink-0" />
            <div className="flex-1 h-1 bg-gray-200 rounded" />
          </div>
          <div className="h-0.5 bg-gray-100 rounded overflow-hidden flex-shrink-0">
            <div
              className="h-full bg-red-400 rounded"
              style={{ animation: "demo-slow-bar 4s ease-out infinite", width: "0%" }}
            />
          </div>
          <div
            className="h-3 bg-gray-100 rounded flex-shrink-0"
            style={{ animation: "demo-skeleton-pulse 1.5s ease-in-out infinite" }}
          />
          <div
            className="h-1.5 bg-gray-100 rounded w-5/6 flex-shrink-0"
            style={{ animation: "demo-skeleton-pulse 1.5s ease-in-out infinite 0.1s" }}
          />
          <div
            className="h-1.5 bg-gray-100 rounded w-4/6 flex-shrink-0"
            style={{ animation: "demo-skeleton-pulse 1.5s ease-in-out infinite 0.2s" }}
          />
          <div
            className="flex-1 bg-gray-50 rounded min-h-0"
            style={{ animation: "demo-skeleton-pulse 1.5s ease-in-out infinite 0.3s" }}
          />
          <div className="text-[5px] text-red-400 text-center flex-shrink-0">Loading…</div>
        </div>
      </div>

      <div className="w-px bg-[#E8D9C4] self-stretch flex-shrink-0" />

      {/* Good: fast */}
      <div className="flex-1 flex flex-col">
        <DemoLabel text="0.7s load" />
        <div className="flex-1 rounded-xl border border-emerald-200 bg-white overflow-hidden p-1.5 flex flex-col gap-1">
          <div className="h-3 bg-gray-100 rounded flex items-center px-1.5 gap-1 flex-shrink-0">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-300 flex-shrink-0" />
            <div className="flex-1 h-1 bg-gray-200 rounded" />
          </div>
          <div className="h-0.5 bg-gray-100 rounded overflow-hidden flex-shrink-0">
            <div
              className="h-full bg-emerald-400 rounded"
              style={{ animation: "demo-fast-bar 4s ease-out infinite", width: "0%" }}
            />
          </div>
          <div style={{ animation: "demo-content-appear 4s ease-out infinite" }}>
            <div className="h-3 bg-gray-800 rounded" />
            <div className="h-1.5 bg-gray-200 rounded w-5/6 mt-1" />
            <div className="h-1.5 bg-gray-200 rounded w-4/6 mt-0.5" />
            <div className="h-6 rounded mt-1" style={{ background: "rgba(212,104,42,0.12)" }} />
          </div>
          <div className="text-[5px] text-emerald-600 text-center mt-auto flex-shrink-0">⚡ Instant</div>
        </div>
      </div>
    </div>
  );
}

// ── 3. ConvertDemo ────────────────────────────────────────────────────────────
function ConvertDemo() {
  return (
    <div className="flex gap-2 p-3 h-full items-stretch">
      {/* Bad: scattered buttons, lost cursor */}
      <div className="flex-1 flex flex-col">
        <DemoLabel text="No Direction" bad />
        <div className="flex-1 rounded-xl border border-red-200 bg-white overflow-hidden p-1.5 relative">
          <div className="h-2 bg-gray-800 rounded w-2/3 mb-1" />
          <div className="h-1 bg-gray-100 rounded mb-0.5" />
          <div className="h-1 bg-gray-100 rounded w-5/6 mb-1" />
          <div className="flex flex-wrap gap-0.5">
            {["Call Us", "Learn More", "Menu", "Gallery", "Book", "Reserve", "Info"].map((t) => (
              <div
                key={t}
                className="text-[4px] px-1 py-0.5 rounded bg-gray-100 text-gray-400 border border-gray-200 leading-tight"
              >
                {t}
              </div>
            ))}
          </div>
          {/* Wandering cursor */}
          <div
            className="absolute w-3 h-3 pointer-events-none"
            style={{ animation: "demo-cursor-wander 5s linear infinite" }}
          >
            <CursorSVG />
          </div>
        </div>
      </div>

      <div className="w-px bg-[#E8D9C4] self-stretch flex-shrink-0" />

      {/* Good: one clear CTA */}
      <div className="flex-1 flex flex-col">
        <DemoLabel text="Clear CTA" />
        <div className="flex-1 rounded-xl border border-emerald-200 bg-white overflow-hidden p-1.5 relative">
          <div className="h-2 bg-gray-800 rounded w-2/3 mb-0.5" />
          <div className="h-1 bg-gray-100 rounded mb-0.5" />
          <div className="h-1 bg-gray-100 rounded w-4/5 mb-2" />
          <div
            className="rounded text-[5px] text-white font-bold flex items-center justify-center py-2.5"
            style={{
              background: "linear-gradient(135deg,#D4682A,#C05A20)",
              animation: "demo-btn-pulse 2.2s ease-in-out infinite",
            }}
          >
            📅 Book Your Appointment →
          </div>
          {/* Direct cursor */}
          <div
            className="absolute w-3 h-3 pointer-events-none"
            style={{ animation: "demo-cursor-direct 4s ease-in-out infinite" }}
          >
            <CursorSVG />
          </div>
        </div>
      </div>
    </div>
  );
}

// ── 4. LocalSEODemo ───────────────────────────────────────────────────────────
function LocalSEODemo() {
  return (
    <div className="flex gap-2 p-3 h-full items-stretch">
      {/* Bad: buried */}
      <div className="flex-1 flex flex-col">
        <DemoLabel text="Page 2" bad />
        <div className="flex-1 rounded-xl border border-red-200 bg-white overflow-hidden p-1.5 flex flex-col gap-0.5">
          <div className="h-3 bg-gray-100 rounded flex items-center px-1.5 mb-0.5 flex-shrink-0">
            <div className="text-[4.5px] text-gray-400 truncate">barber Shrewsbury MA</div>
          </div>
          {["City Cuts", "Elite Hair", "Pro Salon", "Style Co."].map((n, i) => (
            <div
              key={n}
              className="h-4 rounded border border-gray-100 p-0.5 flex items-center gap-1 flex-shrink-0"
              style={{ background: "rgba(249,250,251,1)" }}
            >
              <div className="w-2.5 h-2.5 rounded bg-gray-100 flex items-center justify-center text-[4px] text-gray-400 flex-shrink-0">
                {i + 1}
              </div>
              <div className="text-[4.5px] text-blue-500 truncate">{n}</div>
            </div>
          ))}
          <div className="text-[4.5px] text-gray-300 text-center mt-auto flex-shrink-0">
            → Your shop: Page 2
          </div>
        </div>
      </div>

      <div className="w-px bg-[#E8D9C4] self-stretch flex-shrink-0" />

      {/* Good: #1 result */}
      <div className="flex-1 flex flex-col">
        <DemoLabel text="You're #1" />
        <div className="flex-1 rounded-xl border border-emerald-200 bg-white overflow-hidden p-1.5 flex flex-col gap-0.5">
          <div className="h-3 bg-gray-100 rounded flex items-center px-1.5 mb-0.5 flex-shrink-0">
            <div className="text-[4.5px] text-gray-400 truncate">barber Shrewsbury MA</div>
          </div>
          {/* #1 highlighted */}
          <div
            className="rounded border border-emerald-200 p-0.5 flex flex-col gap-0.5 flex-shrink-0"
            style={{ animation: "demo-result-glow 3s ease-in-out infinite" }}
          >
            <div className="flex items-center gap-0.5">
              <div
                className="w-2.5 h-2.5 rounded text-[4px] font-bold text-emerald-600 flex items-center justify-center flex-shrink-0"
                style={{ background: "rgba(16,185,129,0.15)" }}
              >
                1
              </div>
              <div className="text-[4.5px] font-bold text-blue-600">Dave&apos;s Barbershop</div>
            </div>
            <div className="text-[4px] text-amber-500 ml-3">★★★★★ 4.9</div>
            <div className="text-[4px] text-emerald-600 ml-3 font-bold">● Open Now</div>
          </div>
          {["City Cuts", "Elite Hair"].map((n) => (
            <div
              key={n}
              className="h-4 rounded border border-gray-100 p-0.5 flex items-center gap-1 flex-shrink-0"
              style={{ background: "rgba(249,250,251,1)" }}
            >
              <div className="text-[4.5px] text-blue-400 truncate">{n}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── 5. AccessibleDemo ─────────────────────────────────────────────────────────
function AccessibleDemo() {
  const fields = ["Name", "Email", "Phone"] as const;
  return (
    <div className="flex gap-2 p-3 h-full items-stretch">
      {/* Bad: no focus indication */}
      <div className="flex-1 flex flex-col">
        <DemoLabel text="No Keyboard" bad />
        <div className="flex-1 rounded-xl border border-red-200 bg-white overflow-hidden p-1.5 flex flex-col gap-1">
          <div className="text-[5px] text-gray-500 font-semibold flex-shrink-0">Book Appointment</div>
          {fields.map((label) => (
            <div key={label} className="flex-shrink-0">
              <div className="text-[4px] text-gray-400 mb-0.5">{label}</div>
              <div className="h-4 border border-gray-200 rounded bg-gray-50" />
            </div>
          ))}
          <div
            className="h-4 rounded text-[5px] font-bold text-white flex items-center justify-center mt-auto flex-shrink-0"
            style={{ background: "#D4682A" }}
          >
            Send
          </div>
        </div>
      </div>

      <div className="w-px bg-[#E8D9C4] self-stretch flex-shrink-0" />

      {/* Good: animated focus rings cycle through fields */}
      <div className="flex-1 flex flex-col">
        <DemoLabel text="Accessible" />
        <div className="flex-1 rounded-xl border border-emerald-200 bg-white overflow-hidden p-1.5 flex flex-col gap-1">
          <div className="text-[5px] text-gray-500 font-semibold flex-shrink-0">Book Appointment</div>
          {fields.map((label, i) => (
            <div key={label} className="flex-shrink-0">
              <div className="text-[4px] text-gray-400 mb-0.5">{label}</div>
              <div
                className="h-4 border border-gray-200 rounded bg-gray-50"
                style={{ animation: `demo-focus-el${i + 1} 4.2s ease-in-out infinite` }}
              />
            </div>
          ))}
          <div
            className="h-4 rounded text-[5px] font-bold text-white flex items-center justify-center mt-auto flex-shrink-0"
            style={{ background: "#D4682A" }}
          >
            Send
          </div>
        </div>
      </div>
    </div>
  );
}

// ── 6. MaintainableDemo ───────────────────────────────────────────────────────
function MaintainableDemo() {
  return (
    <div className="flex gap-2 p-3 h-full items-stretch">
      {/* Bad: stale content */}
      <div className="flex-1 flex flex-col">
        <DemoLabel text="Outdated" bad />
        <div className="flex-1 rounded-xl border border-red-200 bg-white overflow-hidden p-1.5 flex flex-col gap-0.5">
          <div className="text-[5px] text-gray-600 font-semibold flex-shrink-0">Tony&apos;s Auto</div>
          <div className="text-[4px] text-gray-300 font-medium flex-shrink-0">Hours:</div>
          <div className="text-[4.5px] text-gray-400 flex-shrink-0">Mon–Fri: 9am–5pm</div>
          <div className="text-[4px] text-gray-300 flex-shrink-0">
            Menu: <span className="text-blue-300 underline">menu2019.pdf</span>
          </div>
          <div className="h-px bg-gray-100 my-0.5 flex-shrink-0" />
          <div className="text-[4px] text-red-400 flex-shrink-0">&quot;Call to confirm hours&quot;</div>
          <div className="text-[4px] text-gray-300 mt-auto flex-shrink-0">
            Last updated: 3 years ago
          </div>
        </div>
      </div>

      <div className="w-px bg-[#E8D9C4] self-stretch flex-shrink-0" />

      {/* Good: live update animation */}
      <div className="flex-1 flex flex-col">
        <DemoLabel text="Always Fresh" />
        <div className="flex-1 rounded-xl border border-emerald-200 bg-white overflow-hidden p-1.5 flex flex-col gap-0.5">
          <div className="text-[5px] text-gray-600 font-semibold flex-shrink-0">Tony&apos;s Auto</div>
          <div className="text-[4px] text-gray-300 font-medium flex-shrink-0">Hours:</div>
          {/* Old line struck through */}
          <div
            className="text-[4.5px] flex-shrink-0"
            style={{ animation: "demo-text-strike 5s ease-in-out infinite" }}
          >
            Mon–Fri: 9am–5pm
          </div>
          {/* New text reveals */}
          <div
            className="text-[4.5px] text-emerald-600 font-medium flex-shrink-0 overflow-hidden"
            style={{ animation: "demo-text-reveal 5s ease-in-out infinite" }}
          >
            Mon–Sat: 8am–6pm ✓
          </div>
          <div className="h-px bg-gray-100 my-0.5 flex-shrink-0" />
          <div className="text-[4px] text-gray-300 flex-shrink-0">
            Specials: <span className="text-orange-400">Oil Change $39</span>
          </div>
          <div className="flex items-center gap-0.5 mt-auto flex-shrink-0">
            <div
              className="w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0"
              style={{ animation: "demo-skeleton-pulse 1.5s ease-in-out infinite" }}
            />
            <div className="text-[4px] text-emerald-500">Live · Updated today</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Icon + Demo maps ──────────────────────────────────────────────────────────

type IconKey = (typeof PILLARS)[number]["icon"];

const ICON_MAP: Record<IconKey, React.FC> = {
  Smartphone:         IconMobile,
  Zap:                IconSpeed,
  MousePointerClick:  IconConvert,
  MapPin:             IconMapPin,
  Accessibility:      IconAccessible,
  Wrench:             IconMaintain,
};

const DEMO_MAP: Record<IconKey, React.FC> = {
  Smartphone:         MobileFirstDemo,
  Zap:                SpeedDemo,
  MousePointerClick:  ConvertDemo,
  MapPin:             LocalSEODemo,
  Accessibility:      AccessibleDemo,
  Wrench:             MaintainableDemo,
};

// ── Section ───────────────────────────────────────────────────────────────────

export function QualityPillars() {
  const gridRef = useScrollReveal(0.05);

  return (
    <section
      id="pillars"
      className="py-24 md:py-32 border-t border-[#E8D9C4]"
      style={{ background: "#FFF8F3" }}
      aria-label="How I build"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12">

        {/* Heading */}
        <div className="mb-14">
          <div className="label-pill mb-4 reveal">How I build</div>
          <SplitTextReveal
            as="h2"
            className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-[#1C1209] leading-tight"
            style={{ fontFamily: "var(--font-display)" }}
            delay={0}
            stagger={70}
          >
            Six things every site gets right.
          </SplitTextReveal>
          <p
            className="mt-4 max-w-xl text-[#7A6B5C] text-lg reveal"
            style={{ transitionDelay: "400ms" }}
          >
            These aren&apos;t upsells. They&apos;re the baseline.
          </p>
        </div>

        {/* Grid */}
        <div
          ref={gridRef}
          className="reveal reveal-stagger grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {PILLARS.map((pillar) => {
            const Icon = ICON_MAP[pillar.icon];
            const DemoComp = DEMO_MAP[pillar.icon];
            return (
              <TiltCard key={pillar.heading}>
                <article className="group card-light h-full flex flex-col cursor-default overflow-hidden">

                  {/* ── Animated demo area ── */}
                  <div
                    className="h-44 overflow-hidden relative flex-shrink-0"
                    style={{
                      background:
                        "linear-gradient(180deg, #F8F0E8 0%, #FFF8F3 100%)",
                      borderBottom: "1px solid #E8D9C4",
                    }}
                  >
                    <DemoComp />
                  </div>

                  {/* ── Card content ── */}
                  <div className="flex flex-col gap-3 p-5 flex-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-[rgba(212,104,42,0.1)] text-[#D4682A] group-hover:bg-[#D4682A] group-hover:text-white transition-all duration-200">
                        <Icon />
                      </div>
                      <div className="w-5 h-5 rounded-full border border-[rgba(212,104,42,0.3)] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#D4682A]" />
                      </div>
                    </div>
                    <div>
                      <h3
                        className="font-bold text-[#1C1209] mb-1.5"
                        style={{ fontFamily: "var(--font-display)" }}
                      >
                        {pillar.heading}
                      </h3>
                      <p className="text-sm text-[#7A6B5C] leading-relaxed">{pillar.body}</p>
                    </div>
                  </div>

                </article>
              </TiltCard>
            );
          })}
        </div>
      </div>
    </section>
  );
}
