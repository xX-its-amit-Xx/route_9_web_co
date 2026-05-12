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
      <path d="M13 2L4 14h7l-1 8 10-12h-7z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}

function IconConvert() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" aria-hidden>
      <path d="M10 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M14 7L21 12L14 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M21 12H8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function IconMapPin() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" aria-hidden>
      <path d="M12 2C8.686 2 6 4.686 6 8C6 13 12 22 12 22C12 22 18 13 18 8C18 4.686 15.314 2 12 2Z" stroke="currentColor" strokeWidth="1.5" />
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
      <path d="M8 14.5L11 17.5L16 12.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ══════════════════════════════════════════════
// DEMO INFRASTRUCTURE COMPONENTS
// ══════════════════════════════════════════════

function DemoShell({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="h-full flex flex-col overflow-hidden relative"
      style={{
        background: "linear-gradient(170deg, #181210 0%, #0F0C09 100%)",
      }}
    >
      {/* Subtle horizontal scan-line texture for screen feel */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.06) 2px, rgba(0,0,0,0.06) 3px)",
          zIndex: 0,
        }}
      />
      <div className="relative z-10 flex flex-col h-full">{children}</div>
    </div>
  );
}

function DemoChrome({ url = "yoursite.com" }: { url?: string }) {
  return (
    <div
      className="flex items-center gap-2 px-3 flex-shrink-0"
      style={{
        height: "28px",
        background: "linear-gradient(180deg, #231B14 0%, #1A1410 100%)",
        borderBottom: "1px solid rgba(255,255,255,0.05)",
        boxShadow: "0 1px 0 rgba(0,0,0,0.4)",
      }}
    >
      {/* macOS traffic lights */}
      <div className="flex gap-1.5 flex-shrink-0">
        <div
          className="w-[9px] h-[9px] rounded-full"
          style={{ background: "#FF5F57", boxShadow: "0 0 4px rgba(255,95,87,0.5)" }}
        />
        <div
          className="w-[9px] h-[9px] rounded-full"
          style={{ background: "#FEBC2E", boxShadow: "0 0 4px rgba(254,188,46,0.4)" }}
        />
        <div
          className="w-[9px] h-[9px] rounded-full"
          style={{ background: "#28C840", boxShadow: "0 0 4px rgba(40,200,64,0.4)" }}
        />
      </div>
      {/* URL bar */}
      <div
        className="flex-1 flex items-center justify-center rounded-md overflow-hidden"
        style={{
          height: "16px",
          background: "rgba(255,255,255,0.07)",
          border: "1px solid rgba(255,255,255,0.05)",
        }}
      >
        <span
          className="truncate px-2"
          style={{
            fontSize: "6.5px",
            color: "rgba(255,255,255,0.3)",
            fontFamily: "monospace",
            letterSpacing: "0.02em",
          }}
        >
          {url}
        </span>
      </div>
    </div>
  );
}

function PanelBadge({ bad }: { bad?: boolean }) {
  return (
    <div
      className="absolute top-2 right-2 z-20 flex items-center gap-1 rounded-full px-2 py-[3px]"
      style={{
        background: bad ? "rgba(239,68,68,0.14)" : "rgba(16,185,129,0.14)",
        border: `1px solid ${bad ? "rgba(239,68,68,0.35)" : "rgba(16,185,129,0.35)"}`,
        color: bad ? "#f87171" : "#34d399",
        fontSize: "6px",
        fontWeight: 700,
        letterSpacing: "0.06em",
        backdropFilter: "blur(6px)",
        WebkitBackdropFilter: "blur(6px)",
        boxShadow: bad
          ? "0 2px 8px rgba(239,68,68,0.2), inset 0 1px 0 rgba(255,255,255,0.05)"
          : "0 2px 8px rgba(16,185,129,0.2), inset 0 1px 0 rgba(255,255,255,0.05)",
      }}
    >
      <span>{bad ? "✗" : "✓"}</span>
      <span>{bad ? "Before" : "After"}</span>
    </div>
  );
}

function VSDivider() {
  return (
    <div
      className="flex-shrink-0 relative"
      style={{ width: "1px", background: "rgba(255,255,255,0.05)" }}
    >
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center rounded-full z-10"
        style={{
          width: "16px",
          height: "16px",
          background: "linear-gradient(135deg, #E07838, #C05A20)",
          boxShadow:
            "0 0 12px rgba(212,104,42,0.7), 0 0 0 2px rgba(212,104,42,0.25), inset 0 1px 0 rgba(255,255,255,0.2)",
          fontSize: "5px",
          color: "white",
          fontWeight: 800,
          letterSpacing: "0.04em",
        }}
      >
        VS
      </div>
    </div>
  );
}

// Cursor SVG for ConvertDemo
function Cursor({ dark }: { dark?: boolean }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" style={{ width: "100%", height: "100%", filter: dark ? "drop-shadow(0 1px 2px rgba(0,0,0,0.5))" : "none" }}>
      <path
        d="M3 2L3 11.5L5.8 9L7.8 14L9.2 13.4L7.2 8.5L11 8.5Z"
        fill={dark ? "#1C1209" : "#374151"}
        stroke="white"
        strokeWidth="0.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// ══════════════════════════════════════════════
// DEMO 1 — MOBILE FIRST
// ══════════════════════════════════════════════
function MobileFirstDemo() {
  return (
    <DemoShell>
      <DemoChrome url="example-shop.com" />
      <div className="flex flex-1 min-h-0">

        {/* BAD — desktop site crammed onto mobile */}
        <div className="flex-1 relative overflow-hidden" style={{ background: "#F7F5F3" }}>
          <PanelBadge bad />
          <div className="absolute inset-0" style={{ paddingTop: "6px" }}>
            {/* Overflowing nav with horizontal wobble */}
            <div
              style={{
                width: "175%",
                height: "18px",
                background: "#1C1209",
                display: "flex",
                alignItems: "center",
                gap: "3px",
                padding: "0 6px",
                animation: "demo-scroll-bad 5s ease-in-out infinite",
              }}
            >
              <span style={{ fontSize: "5.5px", color: "#FEBC2E", fontWeight: 700, whiteSpace: "nowrap", marginRight: "2px" }}>Shop</span>
              {["Home", "About", "Gallery", "Services", "Menu", "Pricing", "Contact"].map((t) => (
                <span key={t} style={{ fontSize: "4.5px", color: "rgba(255,255,255,0.4)", whiteSpace: "nowrap" }}>{t}</span>
              ))}
            </div>
            {/* Body overflowing */}
            <div
              style={{
                width: "160%",
                padding: "5px 6px 0",
                animation: "demo-scroll-bad 5s ease-in-out infinite 0.08s",
              }}
            >
              <div style={{ height: "6px", background: "#D1D5DB", borderRadius: "2px", marginBottom: "3px" }} />
              <div style={{ height: "4px", background: "#E5E7EB", borderRadius: "2px", width: "90%", marginBottom: "2px" }} />
              <div style={{ height: "4px", background: "#E5E7EB", borderRadius: "2px", width: "75%" }} />
            </div>
            {/* Horizontal scrollbar at bottom */}
            <div
              className="absolute bottom-0 left-0 right-0"
              style={{ height: "5px", background: "#E5E7EB" }}
            >
              <div style={{ height: "100%", width: "30%", marginLeft: "42%", background: "#9CA3AF", borderRadius: "2px" }} />
            </div>
          </div>
          {/* Red tint overlay */}
          <div className="absolute inset-0 pointer-events-none" style={{ background: "rgba(239,68,68,0.04)" }} />
        </div>

        <VSDivider />

        {/* GOOD — mobile-first */}
        <div className="flex-1 relative overflow-hidden" style={{ background: "#F7F5F3" }}>
          <PanelBadge />
          <div className="absolute inset-0 flex flex-col">
            {/* Compact hero image strip */}
            <div
              className="flex-shrink-0 relative overflow-hidden"
              style={{
                height: "36px",
                background: "linear-gradient(135deg, #1C1209 0%, #2A1810 60%, #3A2215 100%)",
              }}
            >
              <div aria-hidden style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg, rgba(212,104,42,0.3) 0%, transparent 65%)", pointerEvents: "none" }} />
              <div
                className="flex items-center justify-between"
                style={{ padding: "4px 6px 0", position: "relative", zIndex: 1 }}
              >
                <span style={{ fontSize: "7px", color: "#FEBC2E", fontWeight: 800 }}>✂ Fresh Cuts</span>
                <div style={{ display: "flex", flexDirection: "column", gap: "1.5px" }}>
                  <div style={{ width: "11px", height: "1.5px", background: "rgba(255,255,255,0.55)", borderRadius: "1px" }} />
                  <div style={{ width: "8px", height: "1.5px", background: "rgba(255,255,255,0.55)", borderRadius: "1px" }} />
                  <div style={{ width: "6px", height: "1.5px", background: "rgba(255,255,255,0.55)", borderRadius: "1px" }} />
                </div>
              </div>
              <div style={{ padding: "2px 6px 0", position: "relative", zIndex: 1, fontSize: "5px", color: "rgba(243,233,213,0.45)" }}>Shrewsbury, MA · Walk-ins welcome</div>
            </div>

            {/* Content */}
            <div className="flex flex-col flex-1" style={{ padding: "5px 7px 6px" }}>
              <div style={{ height: "4px", background: "#D1D5DB", borderRadius: "2px", width: "100%", marginBottom: "2px" }} className="flex-shrink-0" />
              <div style={{ height: "4px", background: "#E5E7EB", borderRadius: "2px", width: "72%" }} className="flex-shrink-0" />
              {/* Big CTA */}
              <div
                className="mt-auto flex items-center justify-center flex-shrink-0"
                style={{
                  height: "22px",
                  background: "linear-gradient(135deg, #E07838 0%, #D4682A 45%, #C05A20 100%)",
                  borderRadius: "5px",
                  fontSize: "7px",
                  color: "white",
                  fontWeight: 700,
                  animation: "demo-btn-pulse 2.2s ease-in-out infinite",
                  boxShadow: "0 3px 10px rgba(212,104,42,0.5), inset 0 1.5px 0 rgba(255,255,255,0.2), inset 0 -1px 0 rgba(0,0,0,0.12)",
                }}
              >
                📅 Book Now →
              </div>
            </div>
          </div>
          <div className="absolute inset-0 pointer-events-none" style={{ background: "rgba(16,185,129,0.02)" }} />
        </div>

      </div>
    </DemoShell>
  );
}

// ══════════════════════════════════════════════
// DEMO 2 — SPEED
// ══════════════════════════════════════════════
function SpeedDemo() {
  return (
    <DemoShell>
      <DemoChrome url="yoursite.com" />
      <div className="flex flex-1 min-h-0">

        {/* BAD — slow */}
        <div className="flex-1 relative overflow-hidden" style={{ background: "#F9F8F7" }}>
          <PanelBadge bad />
          <div className="absolute inset-0 flex flex-col" style={{ padding: "6px 7px" }}>
            {/* URL bar with spinner */}
            <div
              className="flex items-center gap-1.5 flex-shrink-0"
              style={{ height: "14px", background: "#F3F4F6", borderRadius: "4px", padding: "0 6px", marginBottom: "4px", border: "1px solid #E5E7EB" }}
            >
              <div
                style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  border: "1.5px solid #D1D5DB",
                  borderTopColor: "#9CA3AF",
                  flexShrink: 0,
                  animation: "demo-spinner 0.8s linear infinite",
                }}
              />
              <div style={{ flex: 1, height: "4px", background: "#E5E7EB", borderRadius: "2px" }} />
            </div>
            {/* Progress bar — slow */}
            <div
              className="flex-shrink-0"
              style={{ height: "2px", background: "#F3F4F6", borderRadius: "9999px", overflow: "hidden", marginBottom: "5px" }}
            >
              <div
                style={{
                  height: "100%",
                  background: "linear-gradient(90deg, #f87171, #ef4444)",
                  borderRadius: "9999px",
                  width: "0%",
                  animation: "demo-slow-bar 5s ease-out infinite",
                }}
              />
            </div>
            {/* Skeleton content */}
            {[
              { w: "100%", h: 11 },
              { w: "72%", h: 6 },
              { w: "88%", h: 6 },
              { w: "100%", h: 28 },
            ].map(({ w, h }, i) => (
              <div
                key={i}
                className="flex-shrink-0"
                style={{
                  width: w,
                  height: `${h}px`,
                  background: "#E5E7EB",
                  borderRadius: "3px",
                  marginBottom: "4px",
                  animation: `demo-skeleton-pulse 1.5s ease-in-out infinite ${i * 0.08}s`,
                }}
              />
            ))}
            <div
              className="mt-auto text-center flex-shrink-0"
              style={{ fontSize: "7.5px", fontWeight: 700, color: "#f87171" }}
            >
              4.8s ⏳
            </div>
          </div>
          <div className="absolute inset-0 pointer-events-none" style={{ background: "rgba(239,68,68,0.035)" }} />
        </div>

        <VSDivider />

        {/* GOOD — instant */}
        <div className="flex-1 relative overflow-hidden" style={{ background: "#F9F8F7" }}>
          <PanelBadge />
          <div className="absolute inset-0 flex flex-col" style={{ padding: "6px 7px" }}>
            {/* URL bar loaded */}
            <div
              className="flex items-center gap-1.5 flex-shrink-0"
              style={{ height: "14px", background: "#F3F4F6", borderRadius: "4px", padding: "0 6px", marginBottom: "4px", border: "1px solid #E5E7EB" }}
            >
              <div
                className="flex items-center justify-center flex-shrink-0"
                style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#D1FAE5", fontSize: "5.5px", color: "#10B981", fontWeight: 700 }}
              >
                ✓
              </div>
              <div style={{ flex: 1, height: "4px", background: "#E5E7EB", borderRadius: "2px" }} />
            </div>
            {/* Progress bar — instant */}
            <div
              className="flex-shrink-0"
              style={{ height: "2px", background: "#F3F4F6", borderRadius: "9999px", overflow: "hidden", marginBottom: "5px" }}
            >
              <div
                style={{
                  height: "100%",
                  background: "linear-gradient(90deg, #34d399, #10b981)",
                  borderRadius: "9999px",
                  width: "0%",
                  animation: "demo-fast-bar 5s ease-out infinite",
                }}
              />
            </div>
            {/* Content appears — richer real-site layout */}
            <div style={{ animation: "demo-content-appear 5s ease-out infinite" }}>
              {/* Hero strip */}
              <div
                style={{
                  height: "18px",
                  background: "linear-gradient(135deg, #1C1209 0%, #2E1A0E 60%, #3A2215 100%)",
                  borderRadius: "3px",
                  marginBottom: "3px",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <div aria-hidden style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg, rgba(212,104,42,0.35) 0%, transparent 55%)" }} />
                <div style={{ padding: "4px 5px", position: "relative", fontSize: "7px", fontWeight: 800, color: "#F3E9D5" }}>Fresh Cuts ✂</div>
              </div>
              <div style={{ height: "4px", background: "#D1D5DB", borderRadius: "2px", width: "72%", marginBottom: "3px" }} />
              <div style={{ height: "4px", background: "#E5E7EB", borderRadius: "2px", width: "88%", marginBottom: "4px" }} />
              {/* CTA */}
              <div
                style={{
                  height: "20px",
                  borderRadius: "4px",
                  background: "linear-gradient(135deg, #E07838, #D4682A)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "6.5px",
                  color: "white",
                  fontWeight: 700,
                  boxShadow: "0 2px 8px rgba(212,104,42,0.5), inset 0 1px 0 rgba(255,255,255,0.18)",
                }}
              >
                Book Now →
              </div>
            </div>
            <div
              className="mt-auto text-center flex-shrink-0"
              style={{ fontSize: "7.5px", fontWeight: 700, color: "#10b981" }}
            >
              ⚡ 0.7s
            </div>
          </div>
          <div className="absolute inset-0 pointer-events-none" style={{ background: "rgba(16,185,129,0.02)" }} />
        </div>

      </div>
    </DemoShell>
  );
}

// ══════════════════════════════════════════════
// DEMO 3 — CONVERT
// ══════════════════════════════════════════════
function ConvertDemo() {
  return (
    <DemoShell>
      <DemoChrome url="shop-site.com/book" />
      <div className="flex flex-1 min-h-0">

        {/* BAD — scattered CTAs, confused visitor */}
        <div className="flex-1 relative overflow-hidden" style={{ background: "#F9F8F7" }}>
          <PanelBadge bad />
          <div className="absolute inset-0" style={{ padding: "7px 7px 5px" }}>
            <div style={{ height: "7px", background: "#374151", borderRadius: "2px", width: "65%", marginBottom: "4px" }} />
            <div style={{ height: "4px", background: "#E5E7EB", borderRadius: "2px", marginBottom: "3px" }} />
            <div style={{ height: "4px", background: "#E5E7EB", borderRadius: "2px", width: "85%", marginBottom: "5px" }} />
            <div style={{ display: "flex", flexWrap: "wrap", gap: "3px" }}>
              {["Call Us", "Menu", "About", "Gallery", "Book", "Info", "Reserve", "Map", "Hours"].map((t) => (
                <div
                  key={t}
                  style={{
                    fontSize: "4.5px",
                    padding: "2px 4px",
                    borderRadius: "2px",
                    background: "#F3F4F6",
                    color: "#6B7280",
                    border: "1px solid #E5E7EB",
                    lineHeight: 1.4,
                    whiteSpace: "nowrap",
                  }}
                >
                  {t}
                </div>
              ))}
            </div>
          </div>
          {/* Wandering cursor */}
          <div
            className="absolute pointer-events-none"
            style={{ width: "14px", height: "14px", animation: "demo-cursor-wander 5.5s linear infinite", top: "10%", left: "15%", zIndex: 10 }}
          >
            <Cursor />
          </div>
          <div className="absolute inset-0 pointer-events-none" style={{ background: "rgba(239,68,68,0.04)" }} />
        </div>

        <VSDivider />

        {/* GOOD — single clear CTA with cursor that clicks */}
        <div className="flex-1 relative overflow-hidden" style={{ background: "#F9F8F7" }}>
          <PanelBadge />
          <div className="absolute inset-0 flex flex-col">

            {/* Mini dark hero header */}
            <div
              className="flex-shrink-0 relative overflow-hidden"
              style={{
                height: "44px",
                background: "linear-gradient(135deg, #1C1209 0%, #2E1A0E 55%, #3D2515 100%)",
              }}
            >
              {/* Warm ambient glow */}
              <div aria-hidden style={{
                position: "absolute",
                bottom: "-16px",
                right: "-4px",
                width: "60px",
                height: "60px",
                borderRadius: "50%",
                background: "radial-gradient(circle, rgba(212,104,42,0.5) 0%, transparent 65%)",
                pointerEvents: "none",
              }} />
              <div style={{ padding: "8px 8px 0", position: "relative", zIndex: 1 }}>
                <div style={{ fontSize: "9px", fontWeight: 800, color: "#F3E9D5", letterSpacing: "0.015em" }}>Fresh Cuts</div>
                <div style={{ fontSize: "5px", color: "rgba(243,233,213,0.5)", marginTop: "2px" }}>Shrewsbury · Walk-ins welcome</div>
              </div>
            </div>

            {/* CTA body */}
            <div style={{ padding: "8px 7px 6px", flex: 1, display: "flex", flexDirection: "column" }}>
              <div style={{ fontSize: "5.5px", color: "#9CA3AF", marginBottom: "6px", fontWeight: 500 }}>
                Ready to book your next visit?
              </div>

              {/* Book Appointment button — reacts to cursor click */}
              <div
                className="relative flex items-center justify-center overflow-hidden flex-shrink-0"
                style={{
                  height: "26px",
                  background: "linear-gradient(135deg, #E07838 0%, #D4682A 45%, #C05A20 100%)",
                  borderRadius: "5px",
                  fontSize: "7.5px",
                  color: "white",
                  fontWeight: 700,
                  letterSpacing: "0.01em",
                  animation: "demo-btn-click 4.5s ease-out infinite",
                }}
              >
                📅 Book Appointment →
                {/* Click ripple */}
                <div
                  aria-hidden
                  style={{
                    position: "absolute",
                    width: "130%",
                    aspectRatio: "1",
                    borderRadius: "50%",
                    background: "rgba(255,255,255,0.45)",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%) scale(0)",
                    animation: "demo-click-ripple 4.5s ease-out infinite",
                    pointerEvents: "none",
                  }}
                />
              </div>

              {/* Social proof micro-line */}
              <div style={{ marginTop: "4px", fontSize: "5px", color: "#9CA3AF", textAlign: "center" }}>
                <span style={{ color: "#D97706" }}>★★★★★</span>
                <span style={{ fontWeight: 600, color: "#6B7280" }}> 4.9</span>
                <span> · 127 reviews</span>
              </div>
            </div>
          </div>

          {/* Cursor moves straight to button and clicks */}
          <div
            className="absolute pointer-events-none"
            style={{ width: "14px", height: "14px", animation: "demo-cursor-direct 4.5s ease-in-out infinite", top: "82%", left: "10%", zIndex: 10 }}
          >
            <Cursor dark />
          </div>
          <div className="absolute inset-0 pointer-events-none" style={{ background: "rgba(16,185,129,0.018)" }} />
        </div>

      </div>
    </DemoShell>
  );
}

// ══════════════════════════════════════════════
// DEMO 4 — LOCAL SEO
// ══════════════════════════════════════════════
function LocalSEODemo() {
  return (
    <DemoShell>
      <DemoChrome url="google.com/search" />
      <div className="flex flex-1 min-h-0">

        {/* BAD — buried */}
        <div className="flex-1 relative overflow-hidden" style={{ background: "#FFFFFF" }}>
          <PanelBadge bad />
          <div className="absolute inset-0 flex flex-col" style={{ padding: "6px 6px 5px" }}>
            {/* Mini search bar */}
            <div
              className="flex items-center flex-shrink-0"
              style={{ height: "13px", border: "1px solid #E5E7EB", borderRadius: "8px", padding: "0 7px", marginBottom: "5px" }}
            >
              <span style={{ fontSize: "4.5px", color: "#6B7280" }}>barber shop Shrewsbury MA</span>
            </div>
            {/* Competitor results */}
            {[
              { name: "City Cuts", addr: "Worcester" },
              { name: "Elite Hair Co.", addr: "Northboro" },
              { name: "Pro Style Salon", addr: "Westboro" },
              { name: "Modern Cuts", addr: "Marlboro" },
            ].map((r, i) => (
              <div key={r.name} className="flex-shrink-0" style={{ marginBottom: "4px" }}>
                <div style={{ fontSize: "6.5px", color: "#1a0dab", lineHeight: 1.2 }}>{r.name}</div>
                <div style={{ fontSize: "5px", color: "#188038", lineHeight: 1.2 }}>{r.addr} · #{i + 1}</div>
              </div>
            ))}
            <div
              className="mt-auto text-center flex-shrink-0"
              style={{ fontSize: "5.5px", color: "#9CA3AF" }}
            >
              Your shop → Page 2
            </div>
          </div>
          <div className="absolute inset-0 pointer-events-none" style={{ background: "rgba(239,68,68,0.04)" }} />
        </div>

        <VSDivider />

        {/* GOOD — #1 ranking */}
        <div className="flex-1 relative overflow-hidden" style={{ background: "#FFFFFF" }}>
          <PanelBadge />
          <div className="absolute inset-0 flex flex-col" style={{ padding: "6px 6px 5px" }}>
            {/* Mini search bar */}
            <div
              className="flex items-center flex-shrink-0"
              style={{ height: "13px", border: "1px solid #E5E7EB", borderRadius: "8px", padding: "0 7px", marginBottom: "5px" }}
            >
              <span style={{ fontSize: "4.5px", color: "#6B7280" }}>barber shop Shrewsbury MA</span>
            </div>
            {/* YOUR shop at #1 */}
            <div
              className="flex-shrink-0"
              style={{
                borderRadius: "5px",
                padding: "4px 5px",
                marginBottom: "3px",
                border: "1.5px solid rgba(212,104,42,0.3)",
                background: "rgba(212,104,42,0.05)",
                animation: "demo-result-glow 3s ease-in-out infinite",
              }}
            >
              <div className="flex items-center gap-1">
                <div
                  className="flex items-center justify-center flex-shrink-0"
                  style={{ width: "11px", height: "11px", borderRadius: "50%", background: "#D4682A", fontSize: "5.5px", color: "white", fontWeight: 800 }}
                >
                  1
                </div>
                <div style={{ fontSize: "7px", color: "#1a0dab", fontWeight: 700, lineHeight: 1.2 }}>Dave&apos;s Barbershop</div>
              </div>
              <div style={{ fontSize: "6px", color: "#D97706", paddingLeft: "13px", marginTop: "1px" }}>★★★★★ 4.9</div>
              <div style={{ fontSize: "5.5px", color: "#166534", paddingLeft: "13px", fontWeight: 700, display: "flex", alignItems: "center", gap: "2px" }}>
                <span style={{ width: "4px", height: "4px", borderRadius: "50%", background: "#16a34a", flexShrink: 0, display: "inline-block", animation: "demo-skeleton-pulse 1.3s ease-in-out infinite" }} />
                Open Now · Shrewsbury
              </div>
            </div>
            {[
              { name: "City Cuts", addr: "Worcester" },
              { name: "Elite Hair Co.", addr: "Northboro" },
            ].map((r) => (
              <div key={r.name} className="flex-shrink-0" style={{ marginBottom: "3px" }}>
                <div style={{ fontSize: "6px", color: "#1a0dab" }}>{r.name}</div>
                <div style={{ fontSize: "4.5px", color: "#188038" }}>{r.addr}</div>
              </div>
            ))}
          </div>
          <div className="absolute inset-0 pointer-events-none" style={{ background: "rgba(16,185,129,0.025)" }} />
        </div>

      </div>
    </DemoShell>
  );
}

// ══════════════════════════════════════════════
// DEMO 5 — ACCESSIBLE
// ══════════════════════════════════════════════
function AccessibleDemo() {
  return (
    <DemoShell>
      <DemoChrome url="book-appointment.com" />
      <div className="flex flex-1 min-h-0">

        {/* BAD — no focus indicators */}
        <div className="flex-1 relative overflow-hidden" style={{ background: "#F9F8F7" }}>
          <PanelBadge bad />
          <div className="absolute inset-0 flex flex-col" style={{ padding: "6px 7px 5px" }}>
            <div style={{ fontSize: "9px", fontWeight: 700, color: "#374151", marginBottom: "6px" }} className="flex-shrink-0">
              Book Appointment
            </div>
            {["Name", "Email", "Phone"].map((label) => (
              <div key={label} className="flex-shrink-0" style={{ marginBottom: "5px" }}>
                <div style={{ fontSize: "5.5px", color: "#9CA3AF", marginBottom: "2px" }}>{label}</div>
                <div
                  style={{
                    height: "12px",
                    borderRadius: "3px",
                    border: "1px solid #E5E7EB",
                    background: "#FFFFFF",
                  }}
                />
              </div>
            ))}
            <div
              className="mt-auto flex items-center justify-center flex-shrink-0"
              style={{ height: "15px", borderRadius: "4px", background: "#D4682A", fontSize: "7px", color: "white", fontWeight: 700 }}
            >
              Send
            </div>
          </div>
          {/* Tab = nothing indicator */}
          <div
            className="absolute bottom-2 right-1.5 flex items-center gap-0.5 rounded"
            style={{ padding: "2px 4px", background: "#FEF2F2", border: "1px solid #FECACA" }}
          >
            <span style={{ fontSize: "5px", color: "#EF4444", fontWeight: 700 }}>⇥ Tab = nothing</span>
          </div>
          <div className="absolute inset-0 pointer-events-none" style={{ background: "rgba(239,68,68,0.04)" }} />
        </div>

        <VSDivider />

        {/* GOOD — animated focus rings */}
        <div className="flex-1 relative overflow-hidden" style={{ background: "#F9F8F7" }}>
          <PanelBadge />
          <div className="absolute inset-0 flex flex-col" style={{ padding: "6px 7px 5px" }}>
            <div style={{ fontSize: "9px", fontWeight: 700, color: "#374151", marginBottom: "6px" }} className="flex-shrink-0">
              Book Appointment
            </div>
            {(["Name", "Email", "Phone"] as const).map((label, i) => (
              <div key={label} className="flex-shrink-0" style={{ marginBottom: "5px" }}>
                <div style={{ fontSize: "5.5px", color: "#9CA3AF", marginBottom: "2px" }}>{label}</div>
                <div
                  style={{
                    height: "12px",
                    borderRadius: "3px",
                    border: "1px solid #E5E7EB",
                    background: "#FFFFFF",
                    animation: `demo-focus-el${i + 1} 4.2s ease-in-out infinite`,
                  }}
                />
              </div>
            ))}
            <div
              className="mt-auto flex items-center justify-center flex-shrink-0"
              style={{ height: "15px", borderRadius: "4px", background: "#D4682A", fontSize: "7px", color: "white", fontWeight: 700 }}
            >
              Send
            </div>
          </div>
          {/* Tab works indicator */}
          <div
            className="absolute bottom-2 right-1.5 flex items-center gap-0.5 rounded"
            style={{ padding: "2px 4px", background: "#EFF6FF", border: "1px solid #BFDBFE" }}
          >
            <span style={{ fontSize: "5px", color: "#3B82F6", fontWeight: 700 }}>⇥ Tab ✓ works</span>
          </div>
          <div className="absolute inset-0 pointer-events-none" style={{ background: "rgba(16,185,129,0.025)" }} />
        </div>

      </div>
    </DemoShell>
  );
}

// ══════════════════════════════════════════════
// DEMO 6 — MAINTAINABLE
// ══════════════════════════════════════════════
function MaintainableDemo() {
  return (
    <DemoShell>
      <DemoChrome url="tonysauto.com" />
      <div className="flex flex-1 min-h-0">

        {/* BAD — stale content */}
        <div className="flex-1 relative overflow-hidden" style={{ background: "#F9F8F7" }}>
          <PanelBadge bad />
          <div className="absolute inset-0 flex flex-col" style={{ padding: "6px 7px 5px" }}>
            {/* Stale warning */}
            <div
              className="flex items-center gap-1 flex-shrink-0"
              style={{
                height: "13px",
                borderRadius: "3px",
                padding: "0 5px",
                background: "rgba(239,68,68,0.08)",
                border: "1px solid rgba(239,68,68,0.2)",
                marginBottom: "5px",
              }}
            >
              <span style={{ fontSize: "5.5px", color: "#EF4444" }}>⚠ Last updated: 2019</span>
            </div>
            <div style={{ fontSize: "9px", fontWeight: 800, color: "#1C1209" }} className="flex-shrink-0">Tony&apos;s Auto</div>
            <div style={{ fontSize: "5.5px", color: "#9CA3AF", marginTop: "3px" }} className="flex-shrink-0">Hours:</div>
            <div style={{ fontSize: "6px", color: "#6B7280", marginTop: "1px" }} className="flex-shrink-0">Mon–Fri: 9am–5pm</div>
            <div style={{ fontSize: "5.5px", color: "#9CA3AF", marginTop: "3px" }} className="flex-shrink-0">
              Specials: <span style={{ color: "#60A5FA", textDecoration: "underline" }}>specials2019.pdf</span>
            </div>
            <div
              className="mt-auto flex items-center justify-center flex-shrink-0"
              style={{
                height: "12px",
                background: "#F3F4F6",
                border: "1px solid #E5E7EB",
                borderRadius: "3px",
              }}
            >
              <span style={{ fontSize: "5px", color: "#9CA3AF" }}>&quot;Call to confirm hours&quot;</span>
            </div>
          </div>
          <div className="absolute inset-0 pointer-events-none" style={{ background: "rgba(239,68,68,0.04)" }} />
        </div>

        <VSDivider />

        {/* GOOD — live update */}
        <div className="flex-1 relative overflow-hidden" style={{ background: "#F9F8F7" }}>
          <PanelBadge />
          <div className="absolute inset-0 flex flex-col" style={{ padding: "6px 7px 5px" }}>
            {/* Live indicator */}
            <div
              className="flex items-center gap-1 flex-shrink-0"
              style={{
                height: "13px",
                borderRadius: "3px",
                padding: "0 5px",
                background: "rgba(16,185,129,0.08)",
                border: "1px solid rgba(16,185,129,0.25)",
                marginBottom: "5px",
              }}
            >
              <div
                style={{
                  width: "5px",
                  height: "5px",
                  borderRadius: "50%",
                  background: "#10B981",
                  flexShrink: 0,
                  animation: "demo-skeleton-pulse 1.4s ease-in-out infinite",
                }}
              />
              <span style={{ fontSize: "5.5px", color: "#10B981", fontWeight: 700 }}>Live · Updated today</span>
            </div>
            <div style={{ fontSize: "9px", fontWeight: 800, color: "#1C1209" }} className="flex-shrink-0">Tony&apos;s Auto</div>
            <div style={{ fontSize: "5.5px", color: "#9CA3AF", marginTop: "3px" }} className="flex-shrink-0">Hours:</div>
            {/* Old text struck through */}
            <div
              className="flex-shrink-0"
              style={{ fontSize: "6px", marginTop: "1px", animation: "demo-text-strike 5s ease-in-out infinite" }}
            >
              Mon–Fri: 9am–5pm
            </div>
            {/* New text appears */}
            <div
              className="flex-shrink-0 overflow-hidden"
              style={{
                fontSize: "6px",
                color: "#10B981",
                fontWeight: 700,
                animation: "demo-text-reveal 5s ease-in-out infinite",
                clipPath: "inset(0 100% 0 0)",
              }}
            >
              Mon–Sat: 8am–6pm ✓
            </div>
            <div style={{ fontSize: "5.5px", color: "#9CA3AF", marginTop: "3px" }} className="flex-shrink-0">
              Specials: <span style={{ color: "#D4682A", fontWeight: 700 }}>Oil Change $39 🔧</span>
            </div>
            <div
              className="mt-auto flex items-center justify-center flex-shrink-0"
              style={{
                height: "12px",
                background: "linear-gradient(135deg, rgba(212,104,42,0.12), rgba(212,104,42,0.06))",
                border: "1px solid rgba(212,104,42,0.2)",
                borderRadius: "3px",
              }}
            >
              <span style={{ fontSize: "5.5px", color: "#D4682A", fontWeight: 700 }}>Book online — no calls needed</span>
            </div>
          </div>
          <div className="absolute inset-0 pointer-events-none" style={{ background: "rgba(16,185,129,0.025)" }} />
        </div>

      </div>
    </DemoShell>
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
          className="reveal reveal-stagger grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {PILLARS.map((pillar) => {
            const Icon = ICON_MAP[pillar.icon];
            const DemoComp = DEMO_MAP[pillar.icon];
            return (
              <TiltCard key={pillar.heading}>
                <article className="group card-light h-full flex flex-col cursor-default overflow-hidden">

                  {/* ── Animated demo area ── */}
                  <div
                    className="h-[182px] overflow-hidden flex-shrink-0"
                    style={{ borderBottom: "1px solid rgba(0,0,0,0.06)" }}
                  >
                    <DemoComp />
                  </div>

                  {/* ── Card content ── */}
                  <div className="flex flex-col gap-3 p-5 flex-1">
                    <div className="flex items-center justify-between">
                      <div
                        className="flex items-center justify-center w-10 h-10 rounded-xl text-[#D4682A] group-hover:text-white transition-all duration-300"
                        style={{
                          background: "rgba(212,104,42,0.1)",
                        }}
                      >
                        <Icon />
                      </div>
                      <div
                        className="w-5 h-5 rounded-full border border-[rgba(212,104,42,0.3)] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                      >
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
