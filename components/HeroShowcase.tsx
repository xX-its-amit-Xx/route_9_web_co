"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { Clock, Lock, Phone } from "lucide-react";

/* ────────────────────────────────────────────────────────────────────────────
   HeroShowcase — "you could have a site like this"
   A live-rendered mini website across a three-device family — browser
   (back-center) + tablet (front-left) + phone (front-right) — cycling
   through three example local businesses with a crossfade.
   Desktop: <HeroShowcase />  ·  Mobile: <HeroShowcase variant="phone" />
   ──────────────────────────────────────────────────────────────────────── */

type Business = {
  name: string;
  chip: string;
  accent: string;      // main tint
  accentInk: string;   // darker shade for gradients
  photo: string;       // Unsplash photo id (verified 200)
  alt: string;
  navLinks: [string, string, string];
  headline: string;
  sub: string;
  cta: string;
  menuTitle: string;
  rows: { item: string; note: string; price: string }[];
  phone: string;
  hours: string;
};

const BUSINESSES: Business[] = [
  {
    name: "Arturo's Pizzeria",
    chip: "Arturo's Pizzeria",
    accent: "#D64B2F",
    accentInk: "#A93A22",
    photo: "1513104890138-7c749659a591",
    alt: "Wood-fired margherita pizza — Arturo's Pizzeria example website",
    navLinks: ["Menu", "Story", "Visit"],
    headline: "Wood-fired. Family-run. Since 1987.",
    sub: "Hand-tossed pies, right on Route 9.",
    cta: "Order Online",
    menuTitle: "From the oven",
    rows: [
      { item: "Margherita", note: "San Marzano · basil", price: "$14" },
      { item: "Arturo's Special", note: "soppressata · hot honey", price: "$18" },
      { item: "Garlic Knots", note: "six, parm butter", price: "$6" },
    ],
    phone: "(508) 555-0134",
    hours: "Open till 10pm tonight",
  },
  {
    name: "The Gilded Comb",
    chip: "The Gilded Comb",
    accent: "#B98A3C",
    accentInk: "#8F6A2B",
    photo: "1521590832167-7bcbfaa6381f",
    alt: "Warm modern salon interior — The Gilded Comb example website",
    navLinks: ["Services", "Stylists", "Book"],
    headline: "Walk out feeling brand new.",
    sub: "A neighborhood salon, elevated.",
    cta: "Book Now",
    menuTitle: "Services",
    rows: [
      { item: "Cut & Style", note: "wash · finish included", price: "$45" },
      { item: "Color & Gloss", note: "full or partial", price: "$95+" },
      { item: "Hot Towel Shave", note: "classic straight razor", price: "$30" },
    ],
    phone: "(508) 555-0177",
    hours: "Walk-ins till 6pm",
  },
  {
    name: "Lakeside Roast",
    chip: "Lakeside Roast",
    accent: "#3F7D5C",
    accentInk: "#2E5F45",
    photo: "1554118811-1e0d58224f24",
    alt: "Cozy cafe counter with espresso machine — Lakeside Roast example website",
    navLinks: ["Menu", "Beans", "Hours"],
    headline: "Slow mornings, fast Wi-Fi.",
    sub: "Small-batch roasts by the lake.",
    cta: "Order Ahead",
    menuTitle: "At the counter",
    rows: [
      { item: "Maple Latte", note: "local syrup · oat ok", price: "$5.25" },
      { item: "Cold Brew", note: "18-hr steep", price: "$4.50" },
      { item: "Egg & Cheddar Roll", note: "on a brioche bun", price: "$7" },
    ],
    phone: "(508) 555-0191",
    hours: "Open 6:30am – 4pm",
  },
];

const CYCLE_MS = 4500;
const MANUAL_HOLD_MS = 10000;
const EASE = "cubic-bezier(0.22,1,0.36,1)";

const SCOPED_CSS = `
@keyframes hs-float {
  0%, 100% { transform: translateY(0); }
  50%      { transform: translateY(-5px); }
}
.hs-float { animation: hs-float 5.5s ease-in-out infinite; }
@keyframes hs-float-tab {
  0%, 100% { transform: translateY(0); }
  50%      { transform: translateY(-4px); }
}
.hs-float-tab { animation: hs-float-tab 6.4s ease-in-out -2.1s infinite; }
@keyframes hs-float-desk {
  0%, 100% { transform: translateY(0); }
  50%      { transform: translateY(-3px); }
}
.hs-float-desk { animation: hs-float-desk 7.6s ease-in-out -3.4s infinite; }
@keyframes hs-dot-pulse {
  0%, 100% { transform: scale(1); opacity: 1; }
  50%      { transform: scale(1.35); opacity: 0.72; }
}
.hs-dot-active { animation: hs-dot-pulse 1.8s ease-in-out infinite; }
@media (prefers-reduced-motion: reduce) {
  .hs-float, .hs-float-tab, .hs-float-desk, .hs-dot-active { animation: none; }
}
`;

/* ── Reduced-motion flag without setState-in-effect ─────────────────────── */
const REDUCED_MQ = "(prefers-reduced-motion: reduce)";
function subscribeReducedMotion(cb: () => void) {
  const mq = window.matchMedia(REDUCED_MQ);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
}
const getReducedMotion = () => window.matchMedia(REDUCED_MQ).matches;
const getReducedMotionServer = () => false;

/* ── Cycle state: auto-advance, pause offscreen, honor reduced motion ──── */
function useShowcaseCycle(rootRef: React.RefObject<HTMLDivElement | null>) {
  const [active, setActive] = useState(0);
  const reduced = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotion,
    getReducedMotionServer,
  );
  const visibleRef = useRef(true);
  const holdUntilRef = useRef(0);

  useEffect(() => {
    if (reduced) return; // show first example statically, no auto-cycle
    let io: IntersectionObserver | undefined;
    const el = rootRef.current;
    if (el && "IntersectionObserver" in window) {
      io = new IntersectionObserver(([entry]) => {
        visibleRef.current = entry.isIntersecting;
      });
      io.observe(el);
    }
    const id = setInterval(() => {
      if (!visibleRef.current) return;                 // hero offscreen → pause
      if (Date.now() < holdUntilRef.current) return;   // manual pick → hold
      setActive((a) => (a + 1) % BUSINESSES.length);
    }, CYCLE_MS);
    return () => {
      clearInterval(id);
      io?.disconnect();
    };
  }, [rootRef, reduced]);

  const pick = useCallback((i: number) => {
    holdUntilRef.current = Date.now() + MANUAL_HOLD_MS;
    setActive(i);
  }, []);

  return { active, pick, reduced };
}

/* ── Crossfade layer: opacity/transform only, never animates layout ────── */
function FadeLayer({
  show,
  reduced,
  children,
}: {
  show: boolean;
  reduced: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      className="absolute inset-0"
      aria-hidden={!show}
      style={{
        opacity: show ? 1 : 0,
        transform: show ? "none" : "scale(0.985)",
        transition: reduced
          ? "none"
          : `opacity 0.65s ease, transform 0.65s ${EASE}`,
        pointerEvents: show ? "auto" : "none",
        willChange: "opacity, transform",
      }}
    >
      {children}
    </div>
  );
}

/* ── The mini website rendered inside the browser viewport ──────────────── */
function MiniSite({ biz, eager }: { biz: Business; eager: boolean }) {
  return (
    <div className="flex flex-col h-full" style={{ background: "#FBF8F2", color: "#241B12" }}>
      {/* Sticky mini-nav */}
      <div
        className="flex items-center justify-between px-3 flex-shrink-0"
        style={{
          height: "34px",
          position: "sticky",
          top: 0,
          zIndex: 2,
          background: "rgba(253,251,247,0.97)",
          borderBottom: "1px solid rgba(36,27,18,0.08)",
        }}
      >
        <div className="flex items-center gap-1.5 min-w-0">
          <span
            className="flex-shrink-0"
            style={{ width: "8px", height: "8px", borderRadius: "3px", background: biz.accent }}
          />
          <span
            className="truncate"
            style={{ fontFamily: "var(--font-display)", fontSize: "11.5px", fontWeight: 700, letterSpacing: "-0.01em" }}
          >
            {biz.name}
          </span>
        </div>
        <div className="flex items-center gap-2.5 flex-shrink-0">
          {biz.navLinks.map((l) => (
            <span key={l} style={{ fontSize: "8.5px", fontWeight: 600, color: "rgba(36,27,18,0.55)" }}>
              {l}
            </span>
          ))}
          <span
            style={{
              fontSize: "8.5px",
              fontWeight: 700,
              color: "#FFF8EE",
              background: `linear-gradient(150deg, ${biz.accent}, ${biz.accentInk})`,
              padding: "3.5px 9px",
              borderRadius: "6px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.18)",
            }}
          >
            {biz.cta}
          </span>
        </div>
      </div>

      {/* Site hero — headline + sub sit at the TOP of the photo, above the
          region where the overlapping tablet/phone rise over the browser
          (their tops never reach above ~y120 of the browser), so the copy
          is never occluded at any column width */}
      <div className="relative flex-shrink-0 overflow-hidden" style={{ height: "47%" }}>
        <img
          src={`https://images.unsplash.com/photo-${biz.photo}?w=600&auto=format&fit=crop&q=80`}
          alt={biz.alt}
          loading={eager ? "eager" : "lazy"}
          fetchPriority={eager ? "high" : "auto"}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(to bottom, rgba(12,8,4,0.78) 0%, rgba(12,8,4,0.34) 46%, transparent 72%, rgba(12,8,4,0.30) 100%)",
          }}
        />
        <div className="absolute left-3 right-3" style={{ top: "9px" }}>
          <div
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "15px",
              fontWeight: 700,
              lineHeight: 1.15,
              color: "#FFF8EE",
              textShadow: "0 1px 8px rgba(0,0,0,0.4)",
            }}
          >
            {biz.headline}
          </div>
          <div style={{ fontSize: "9px", color: "rgba(255,248,238,0.82)", marginTop: "2px" }}>
            {biz.sub}
          </div>
        </div>
      </div>

      {/* Menu / services slice — lives in the clear center strip between the
          overlapping tablet (front-left, covers ≤ ~38.5% of the browser) and
          phone (front-right, covers from ~66%), so item names, prices, the
          CTA and the phone number all stay fully visible */}
      <div className="flex-1 pt-2 pb-1 overflow-hidden" style={{ paddingLeft: "41%", paddingRight: "35%" }}>
        <div
          style={{
            fontSize: "7.5px",
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            color: biz.accent,
            fontWeight: 700,
            marginBottom: "3px",
          }}
        >
          {biz.menuTitle}
        </div>
        {biz.rows.map((r) => (
          <div
            key={r.item}
            style={{ padding: "3.5px 0", borderBottom: "1px dashed rgba(36,27,18,0.12)" }}
          >
            <div className="truncate" style={{ fontSize: "9.5px", fontWeight: 600 }}>{r.item}</div>
            <div className="flex items-baseline gap-2">
              <span className="truncate flex-1" style={{ fontSize: "7.5px", color: "rgba(36,27,18,0.48)" }}>
                {r.note}
              </span>
              <span className="flex-shrink-0" style={{ fontSize: "9.5px", fontWeight: 700, color: biz.accentInk }}>
                {r.price}
              </span>
            </div>
          </div>
        ))}
        <div
          className="inline-flex items-center gap-1"
          style={{
            marginTop: "8px",
            fontSize: "8.5px",
            fontWeight: 700,
            color: "#FFF8EE",
            background: `linear-gradient(150deg, ${biz.accent}, ${biz.accentInk})`,
            padding: "4px 10px",
            borderRadius: "7px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.3), 0 1px 0 rgba(255,255,255,0.18) inset",
          }}
        >
          {biz.cta} <span aria-hidden>→</span>
        </div>
        <div
          className="flex items-center gap-1"
          style={{ marginTop: "7px", fontSize: "8px", fontWeight: 600, color: "rgba(36,27,18,0.6)" }}
        >
          <Phone size={8} color={biz.accent} aria-hidden /> {biz.phone}
        </div>
      </div>
    </div>
  );
}

/* ── Mobile version of the same site, shown on the phone screen ─────────── */
function MiniPhoneSite({ biz, eager }: { biz: Business; eager: boolean }) {
  return (
    <div className="flex flex-col h-full" style={{ background: "#FBF8F2", color: "#241B12" }}>
      {/* Photo header */}
      <div className="relative flex-shrink-0 overflow-hidden" style={{ height: "44%" }}>
        <img
          src={`https://images.unsplash.com/photo-${biz.photo}?w=400&auto=format&fit=crop&q=80`}
          alt={biz.alt}
          loading={eager ? "eager" : "lazy"}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(to bottom, rgba(12,8,4,0.22) 0%, transparent 38%, rgba(12,8,4,0.72) 100%)",
          }}
        />
        <div className="absolute left-2 right-2 bottom-1.5">
          <div
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "12px",
              fontWeight: 700,
              lineHeight: 1.15,
              color: "#FFF8EE",
              textShadow: "0 1px 6px rgba(0,0,0,0.45)",
            }}
          >
            {biz.name}
          </div>
          <div style={{ fontSize: "7.5px", color: "rgba(255,248,238,0.8)" }}>{biz.sub}</div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex-1 flex flex-col items-stretch gap-1.5 px-2 pt-2 pb-1.5 overflow-hidden">
        <div
          className="flex items-center justify-center gap-1.5"
          style={{
            fontSize: "9.5px",
            fontWeight: 700,
            color: "#FFF8EE",
            background: `linear-gradient(150deg, ${biz.accent}, ${biz.accentInk})`,
            padding: "7px 6px",
            borderRadius: "9px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.25), 0 1px 0 rgba(255,255,255,0.18) inset",
          }}
        >
          <Phone size={9} strokeWidth={2.5} aria-hidden /> Call {biz.phone}
        </div>
        <div
          className="self-center inline-flex items-center gap-1"
          style={{
            fontSize: "7.5px",
            fontWeight: 600,
            color: "rgba(36,27,18,0.72)",
            border: "1px solid rgba(36,27,18,0.14)",
            background: "rgba(36,27,18,0.03)",
            padding: "3.5px 9px",
            borderRadius: "9999px",
          }}
        >
          <Clock size={8} color={biz.accent} aria-hidden /> {biz.hours}
        </div>
        <div className="flex gap-1.5">
          {[biz.menuTitle, "Directions"].map((label) => (
            <div
              key={label}
              className="flex-1 text-center truncate"
              style={{
                fontSize: "7.5px",
                fontWeight: 600,
                color: "rgba(36,27,18,0.6)",
                border: "1px solid rgba(36,27,18,0.12)",
                padding: "4px 4px",
                borderRadius: "7px",
              }}
            >
              {label}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Tablet version of the same site — mid-size layout: photo header with
      name overlay + a 2-column services grid, visually distinct from both
      the desktop list and the phone action stack ─────────────────────────── */
function MiniTabletSite({ biz, eager }: { biz: Business; eager: boolean }) {
  return (
    <div className="flex flex-col h-full" style={{ background: "#FBF8F2", color: "#241B12" }}>
      {/* Photo header with name overlay */}
      <div className="relative flex-shrink-0 overflow-hidden" style={{ height: "40%" }}>
        <img
          src={`https://images.unsplash.com/photo-${biz.photo}?w=400&auto=format&fit=crop&q=80`}
          alt={biz.alt}
          loading={eager ? "eager" : "lazy"}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(to bottom, rgba(12,8,4,0.18) 0%, transparent 36%, rgba(12,8,4,0.74) 100%)",
          }}
        />
        <div className="absolute left-2.5 right-2.5 bottom-2">
          <div
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "13px",
              fontWeight: 700,
              lineHeight: 1.15,
              color: "#FFF8EE",
              textShadow: "0 1px 7px rgba(0,0,0,0.45)",
            }}
          >
            {biz.name}
          </div>
          <div style={{ fontSize: "8px", color: "rgba(255,248,238,0.82)", marginTop: "1px" }}>
            {biz.sub}
          </div>
        </div>
      </div>

      {/* 2-column services/menu grid + hours footer */}
      <div className="flex-1 flex flex-col px-2.5 pt-2 pb-2 overflow-hidden">
        <div
          style={{
            fontSize: "7px",
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            color: biz.accent,
            fontWeight: 700,
            marginBottom: "4px",
          }}
        >
          {biz.menuTitle}
        </div>
        <div className="grid grid-cols-2 gap-1.5 flex-1 min-h-0">
          {biz.rows.map((r) => (
            <div
              key={r.item}
              className="flex flex-col justify-between min-w-0"
              style={{
                padding: "5px 6px",
                borderRadius: "8px",
                border: "1px solid rgba(36,27,18,0.10)",
                background: "rgba(36,27,18,0.025)",
              }}
            >
              <div className="truncate" style={{ fontSize: "8px", fontWeight: 600 }}>{r.item}</div>
              <div style={{ fontSize: "9px", fontWeight: 700, color: biz.accentInk, marginTop: "2px" }}>
                {r.price}
              </div>
            </div>
          ))}
          <div
            className="flex items-center justify-center gap-1 text-center"
            style={{
              padding: "5px 6px",
              borderRadius: "8px",
              fontSize: "8px",
              fontWeight: 700,
              color: "#FFF8EE",
              background: `linear-gradient(150deg, ${biz.accent}, ${biz.accentInk})`,
              boxShadow: "0 2px 6px rgba(0,0,0,0.22), 0 1px 0 rgba(255,255,255,0.16) inset",
            }}
          >
            {biz.cta} <span aria-hidden>→</span>
          </div>
        </div>
        <div
          className="flex items-center justify-center gap-1 flex-shrink-0"
          style={{ marginTop: "6px", fontSize: "7.5px", fontWeight: 600, color: "rgba(36,27,18,0.62)" }}
        >
          <Clock size={8} color={biz.accent} aria-hidden /> {biz.hours}
        </div>
      </div>
    </div>
  );
}

/* ── Tablet hardware frame (camera dot, glare, ground shadow) ───────────── */
function TabletMock({
  active,
  reduced,
  float,
}: {
  active: number;
  reduced: boolean;
  float?: boolean;
}) {
  return (
    <div className="relative">
      <div
        className={`relative ${float ? "hs-float-tab" : ""}`}
        style={{
          borderRadius: "20px",
          padding: "9px",
          aspectRatio: "10 / 16.6",
          background: "linear-gradient(155deg, #3A3A3E 0%, #18181B 30%, #0B0B0D 100%)",
          boxShadow:
            "0 0 0 1px rgba(255,255,255,0.09), 0 2px 5px rgba(0,0,0,0.45), 0 14px 36px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.10)",
        }}
      >
        {/* Front camera dot, centered in the top bezel */}
        <div
          aria-hidden
          className="absolute left-1/2 -translate-x-1/2"
          style={{
            top: "3px",
            width: "4px",
            height: "4px",
            borderRadius: "9999px",
            background: "#050507",
            boxShadow: "inset 0 0 1.5px rgba(130,160,255,0.7), 0 0 0 1px rgba(255,255,255,0.06)",
          }}
        />
        <div
          className="relative overflow-hidden h-full"
          style={{ borderRadius: "12px", background: "#FBF8F2" }}
        >
          {BUSINESSES.map((b, i) => (
            <FadeLayer key={b.name} show={i === active} reduced={reduced}>
              <MiniTabletSite biz={b} eager={i === 0} />
            </FadeLayer>
          ))}
          {/* Glare */}
          <div
            aria-hidden
            className="absolute inset-0 pointer-events-none"
            style={{
              zIndex: 30,
              borderRadius: "12px",
              background:
                "linear-gradient(100deg, rgba(255,255,255,0.14) 0%, rgba(255,255,255,0.04) 24%, transparent 38%)",
            }}
          />
        </div>
      </div>
      {/* Ground shadow */}
      <div
        aria-hidden
        className="absolute pointer-events-none"
        style={{
          left: "7%",
          right: "7%",
          bottom: "-14px",
          height: "20px",
          background: "radial-gradient(ellipse at center, rgba(0,0,0,0.5) 0%, transparent 70%)",
          filter: "blur(7px)",
          zIndex: -1,
        }}
      />
    </div>
  );
}

/* ── Phone hardware frame (notch, glare, ground shadow) ─────────────────── */
function PhoneMock({
  active,
  reduced,
  float,
}: {
  active: number;
  reduced: boolean;
  float?: boolean;
}) {
  return (
    <div className="relative">
      <div
        className={float ? "hs-float" : undefined}
        style={{
          borderRadius: "30px",
          padding: "6px",
          aspectRatio: "9 / 18.5",
          background: "linear-gradient(160deg, #3C3C40 0%, #17171A 28%, #0A0A0C 100%)",
          boxShadow:
            "0 0 0 1px rgba(255,255,255,0.10), 0 2px 6px rgba(0,0,0,0.5), 0 18px 44px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.12)",
        }}
      >
        <div
          className="relative overflow-hidden h-full"
          style={{ borderRadius: "24px", background: "#FBF8F2" }}
        >
          {BUSINESSES.map((b, i) => (
            <FadeLayer key={b.name} show={i === active} reduced={reduced}>
              <MiniPhoneSite biz={b} eager={i === 0} />
            </FadeLayer>
          ))}
          {/* Notch */}
          <div
            aria-hidden
            className="absolute top-0 left-1/2 -translate-x-1/2"
            style={{
              width: "38%",
              height: "11px",
              background: "#0A0A0C",
              borderRadius: "0 0 8px 8px",
              zIndex: 20,
            }}
          />
          {/* Glare */}
          <div
            aria-hidden
            className="absolute inset-0 pointer-events-none"
            style={{
              zIndex: 30,
              borderRadius: "24px",
              background:
                "linear-gradient(115deg, rgba(255,255,255,0.16) 0%, rgba(255,255,255,0.05) 20%, transparent 34%)",
            }}
          />
        </div>
      </div>
      {/* Ground shadow */}
      <div
        aria-hidden
        className="absolute pointer-events-none"
        style={{
          left: "6%",
          right: "6%",
          bottom: "-16px",
          height: "22px",
          background: "radial-gradient(ellipse at center, rgba(0,0,0,0.55) 0%, transparent 70%)",
          filter: "blur(7px)",
          zIndex: -1,
        }}
      />
    </div>
  );
}

/* ── Chips + caption ────────────────────────────────────────────────────── */
function ShowcaseChips({
  active,
  pick,
  align,
}: {
  active: number;
  pick: (i: number) => void;
  align: "start" | "center" | "end";
}) {
  const justify =
    align === "end" ? "justify-end" : align === "center" ? "justify-center" : "justify-start";
  return (
    <>
      <div
        className={`flex items-center gap-2 flex-wrap ${justify}`}
        role="group"
        aria-label="Example website picker"
      >
        {BUSINESSES.map((b, i) => {
          const on = i === active;
          return (
            <button
              key={b.name}
              type="button"
              onClick={() => pick(i)}
              aria-pressed={on}
              className="inline-flex items-center gap-1.5 rounded-full cursor-pointer"
              style={{
                padding: "5px 11px",
                fontSize: "10px",
                fontWeight: 600,
                letterSpacing: "0.03em",
                color: on ? "#F3E9D5" : "rgba(243,233,213,0.5)",
                background: on ? "rgba(212,104,42,0.13)" : "rgba(243,233,213,0.04)",
                border: `1px solid ${on ? "rgba(212,104,42,0.55)" : "rgba(243,233,213,0.13)"}`,
                transition: "color 0.3s ease, background 0.3s ease, border-color 0.3s ease",
              }}
            >
              <span
                aria-hidden
                className={on ? "hs-dot-active" : undefined}
                style={{
                  width: "5px",
                  height: "5px",
                  borderRadius: "9999px",
                  background: b.accent,
                  boxShadow: on ? `0 0 6px ${b.accent}` : "none",
                }}
              />
              {b.chip}
            </button>
          );
        })}
      </div>
      <p
        className={align === "end" ? "text-right" : align === "center" ? "text-center" : "text-left"}
        style={{
          marginTop: "8px",
          fontSize: "10.5px",
          fontStyle: "italic",
          fontFamily: "var(--font-display)",
          color: "rgba(243,233,213,0.38)",
        }}
      >
        Built in 48 hours · yours could be next
      </p>
    </>
  );
}

/* ── Main export ────────────────────────────────────────────────────────── */
export function HeroShowcase({ variant = "desktop" }: { variant?: "desktop" | "phone" }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const tiltRef = useRef<HTMLDivElement>(null);
  const { active, pick, reduced } = useShowcaseCycle(rootRef);

  /* Mouse-tilt parallax — same pattern the hero photo collage used:
     listen on #hero, lerp with rAF, transform the wrapper only. */
  useEffect(() => {
    if (variant === "phone") return;
    if (!window.matchMedia("(prefers-reduced-motion: no-preference)").matches) return;
    const el = tiltRef.current;
    if (!el) return;
    const hero = document.getElementById("hero");
    if (!hero) return;

    let tx = 0, ty = 0, cx = 0, cy = 0, rafId: number;

    const onMove = (e: MouseEvent) => {
      const r = hero.getBoundingClientRect();
      cx = ((e.clientX - r.left) / r.width - 0.5) * 2;
      cy = ((e.clientY - r.top) / r.height - 0.5) * 2;
    };
    const onLeave = () => { cx = 0; cy = 0; };

    const tick = () => {
      tx += (cx - tx) * 0.055;
      ty += (cy - ty) * 0.055;
      el.style.transform = `perspective(920px) rotateY(${tx * 7}deg) rotateX(${-ty * 4}deg)`;
      rafId = requestAnimationFrame(tick);
    };

    hero.addEventListener("mousemove", onMove);
    hero.addEventListener("mouseleave", onLeave);
    rafId = requestAnimationFrame(tick);
    return () => {
      hero.removeEventListener("mousemove", onMove);
      hero.removeEventListener("mouseleave", onLeave);
      cancelAnimationFrame(rafId);
    };
  }, [variant]);

  /* ── Compact mobile variant: just the phone + chips ── */
  if (variant === "phone") {
    return (
      <div ref={rootRef} className="flex flex-col items-start">
        <style>{SCOPED_CSS}</style>
        <div style={{ width: "200px", marginBottom: "22px" }}>
          <PhoneMock active={active} reduced={reduced} />
        </div>
        <ShowcaseChips active={active} pick={pick} align="start" />
      </div>
    );
  }

  /* ── Desktop: browser + overlapping tablet + phone + chips ── */
  return (
    <div ref={rootRef} className="relative">
      <style>{SCOPED_CSS}</style>

      {/* Deep ambient glow behind the mockups */}
      <div
        aria-hidden
        className="absolute pointer-events-none"
        style={{
          inset: "-60px",
          background:
            "radial-gradient(ellipse at 55% 45%, rgba(180,80,18,0.28) 0%, rgba(100,40,8,0.10) 40%, transparent 65%)",
          zIndex: 0,
        }}
      />

      {/* Tilt wrapper — parallax transform target; preserve-3d lets the
          tablet/phone hold their own translateZ so mouse tilt gives the
          family a real depth hierarchy */}
      <div
        ref={tiltRef}
        className="relative"
        style={{ zIndex: 1, willChange: "transform", transformStyle: "preserve-3d" }}
      >

        {/* Browser mockup — back-center of the device family */}
        <div style={{ animation: `hero-line-up 1s ${EASE} 0.25s both` }}>
          <div
            className="overflow-hidden hs-float-desk"
            style={{
              borderRadius: "16px",
              background: "#14100B",
              boxShadow:
                "0 0 0 1px rgba(255,255,255,0.09), inset 0 1px 0 rgba(255,255,255,0.08), 0 2px 6px rgba(0,0,0,0.45), 0 20px 50px rgba(0,0,0,0.55), 0 48px 110px rgba(0,0,0,0.5)",
            }}
          >
            {/* Chrome bar */}
            <div
              className="flex items-center gap-3 px-3.5 flex-shrink-0"
              style={{
                height: "36px",
                background: "linear-gradient(to bottom, #2A2018, #1C140D)",
                borderBottom: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              <div className="flex items-center gap-1.5" aria-hidden>
                {["#FF5F57", "#FEBC2E", "#28C840"].map((c) => (
                  <span
                    key={c}
                    style={{
                      width: "9px",
                      height: "9px",
                      borderRadius: "9999px",
                      background: c,
                      boxShadow: "inset 0 -1px 1px rgba(0,0,0,0.25)",
                    }}
                  />
                ))}
              </div>
              <div
                className="flex items-center gap-1.5 flex-1 justify-center"
                style={{
                  maxWidth: "260px",
                  margin: "0 auto",
                  height: "22px",
                  borderRadius: "9999px",
                  background: "rgba(0,0,0,0.35)",
                  border: "1px solid rgba(255,255,255,0.05)",
                }}
              >
                <Lock size={8} color="rgba(134,239,172,0.75)" aria-hidden />
                <span style={{ fontSize: "10px", color: "rgba(243,233,213,0.55)", fontFamily: "monospace" }}>
                  yourshop.route9web.com
                </span>
              </div>
              <div style={{ width: "42px" }} aria-hidden />
            </div>

            {/* Site viewport — stacked crossfading examples */}
            <div className="relative" style={{ height: "clamp(350px, 42vw, 440px)" }}>
              {BUSINESSES.map((b, i) => (
                <FadeLayer key={b.name} show={i === active} reduced={reduced}>
                  <MiniSite biz={b} eager={i === 0} />
                </FadeLayer>
              ))}
            </div>
          </div>
        </div>

        {/* Tablet — overlapping front-left, mid depth; lands after the
            browser. 42% wide at left:-20px → covers at most ~38.5% of the
            browser's width, so the menu strip (padded to 41%) stays clear */}
        <div
          className="absolute"
          style={{
            left: "-20px",
            bottom: "-24px",
            width: "42%",
            zIndex: 5,
            animation: `hero-line-up 0.95s ${EASE} 0.5s both`,
            transformStyle: "preserve-3d",
          }}
        >
          <div style={{ transform: "translateZ(22px)" }}>
            <TabletMock active={active} reduced={reduced} float />
          </div>
        </div>

        {/* Phone — overlapping front-right, closest to the viewer; lands
            last. 36% wide at right:-12px → covers from ~66% of the browser's
            width, clear of the menu strip (right-padded to 35%) */}
        <div
          className="absolute"
          style={{
            right: "-12px",
            bottom: "-40px",
            width: "36%",
            zIndex: 6,
            animation: `hero-line-up 0.9s ${EASE} 0.7s both`,
            transformStyle: "preserve-3d",
          }}
        >
          <div style={{ transform: "translateZ(38px) scale(1.02)" }}>
            <PhoneMock active={active} reduced={reduced} float />
          </div>
        </div>
      </div>

      {/* Chips + caption — centered below, clear of both overhanging devices */}
      <div
        className="relative"
        style={{
          zIndex: 2,
          marginTop: "56px",
          animation: `hero-line-up 0.9s ${EASE} 0.9s both`,
        }}
      >
        <ShowcaseChips active={active} pick={pick} align="center" />
      </div>
    </div>
  );
}
