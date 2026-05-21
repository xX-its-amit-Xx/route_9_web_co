"use client";

import { useEffect, useRef } from "react";

/**
 * Hand-illustrated Route 9 storefront parade — six independent businesses
 * bathed in golden afternoon light. Multi-layer scroll parallax (sky,
 * buildings, foreground). Purely decorative; aria-hidden.
 *
 * Shops: Dave's Barbershop · Town Common Bakery · Corner Café ·
 *        Fresh Bloom Florist · Tony's Auto · Arturo's Pizzeria
 */
export function StorefrontParade() {
  const rootRef   = useRef<HTMLDivElement>(null);
  const skyRef    = useRef<SVGGElement>(null);
  const cloudsRef = useRef<SVGGElement>(null);
  const bldgRef   = useRef<SVGGElement>(null);
  const fgRef     = useRef<SVGGElement>(null);

  useEffect(() => {
    if (!window.matchMedia("(prefers-reduced-motion: no-preference)").matches) return;
    const el = rootRef.current;
    if (!el) return;
    let raf = false;
    const onScroll = () => {
      if (raf) return;
      raf = true;
      requestAnimationFrame(() => {
        raf = false;
        const rect = el.getBoundingClientRect();
        const p = Math.max(-1.4, Math.min(1.4,
          (rect.top + rect.height / 2 - window.innerHeight / 2) / window.innerHeight
        ));
        if (skyRef.current)    skyRef.current.style.transform    = `translate3d(${p * -6}px,0,0)`;
        if (cloudsRef.current) cloudsRef.current.style.transform = `translate3d(${p * -24}px,0,0)`;
        if (bldgRef.current)   bldgRef.current.style.transform   = `translate3d(${p * -16}px,0,0)`;
        if (fgRef.current)     fgRef.current.style.transform     = `translate3d(${p * -56}px,0,0)`;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      ref={rootRef}
      aria-hidden
      className="relative w-full overflow-hidden select-none pointer-events-none"
      style={{
        height: "clamp(230px, 30vw, 400px)",
        borderTop:    "1px solid rgba(212,104,42,0.10)",
        borderBottom: "1px solid rgba(212,104,42,0.10)",
      }}
    >
      <svg
        viewBox="0 0 1440 340"
        preserveAspectRatio="xMidYMax slice"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute inset-0 w-full h-full"
        style={{ overflow: "visible" }}
      >
        <defs>
          {/* Warm golden-hour sky */}
          <linearGradient id="sp-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#2A1432" />
            <stop offset="28%"  stopColor="#6A2840" />
            <stop offset="58%"  stopColor="#C86040" />
            <stop offset="82%"  stopColor="#E8923A" />
            <stop offset="100%" stopColor="#FFC078" />
          </linearGradient>
          {/* Water/road */}
          <linearGradient id="sp-road" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#3A3228" />
            <stop offset="100%" stopColor="#2A2418" />
          </linearGradient>
          {/* Warm window glow */}
          <linearGradient id="sp-glass-warm" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%"   stopColor="rgba(255,220,160,0.78)" />
            <stop offset="100%" stopColor="rgba(255,180,80,0.55)" />
          </linearGradient>
          {/* Cool glass */}
          <linearGradient id="sp-glass-cool" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%"   stopColor="rgba(200,230,255,0.55)" />
            <stop offset="100%" stopColor="rgba(160,200,240,0.35)" />
          </linearGradient>
          {/* Brick pattern — red */}
          <pattern id="sp-brick-r" x="0" y="0" width="28" height="14" patternUnits="userSpaceOnUse">
            <rect width="28" height="14" fill="#B85A40" />
            <rect x="1" y="1"  width="12" height="6" rx="0.5" fill="#A84A32" />
            <rect x="15" y="1" width="12" height="6" rx="0.5" fill="#A84A32" />
            <rect x="-5" y="8" width="12" height="6" rx="0.5" fill="#A84A32" />
            <rect x="9"  y="8" width="12" height="6" rx="0.5" fill="#A84A32" />
            <rect x="23" y="8" width="12" height="6" rx="0.5" fill="#A84A32" />
          </pattern>
          {/* Brick pattern — warm ochre */}
          <pattern id="sp-brick-o" x="0" y="0" width="28" height="14" patternUnits="userSpaceOnUse">
            <rect width="28" height="14" fill="#C87A44" />
            <rect x="1" y="1"  width="12" height="6" rx="0.5" fill="#B86832" />
            <rect x="15" y="1" width="12" height="6" rx="0.5" fill="#B86832" />
            <rect x="-5" y="8" width="12" height="6" rx="0.5" fill="#B86832" />
            <rect x="9"  y="8" width="12" height="6" rx="0.5" fill="#B86832" />
            <rect x="23" y="8" width="12" height="6" rx="0.5" fill="#B86832" />
          </pattern>
          {/* Sidewalk pattern */}
          <pattern id="sp-sidewalk" x="0" y="0" width="64" height="32" patternUnits="userSpaceOnUse">
            <rect width="64" height="32" fill="#C8B898" />
            <rect x="0" y="0" width="64" height="0.5" fill="rgba(0,0,0,0.10)" />
            <rect x="0" y="0" width="0.5" height="32" fill="rgba(0,0,0,0.07)" />
          </pattern>
          {/* Left / right / top fades */}
          <linearGradient id="sp-fade-l" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%"   stopColor="var(--bg)" stopOpacity="0.92" />
            <stop offset="10%"  stopColor="var(--bg)" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="sp-fade-r" x1="1" y1="0" x2="0" y2="0">
            <stop offset="0%"   stopColor="var(--bg)" stopOpacity="0.92" />
            <stop offset="10%"  stopColor="var(--bg)" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="sp-fade-t" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="var(--bg)" stopOpacity="0.72" />
            <stop offset="22%"  stopColor="var(--bg)" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="sp-fade-b" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%"   stopColor="var(--bg)" stopOpacity="0.65" />
            <stop offset="18%"  stopColor="var(--bg)" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* ── SKY ── */}
        <g ref={skyRef} style={{ willChange: "transform" }}>
          <rect x="-240" y="0" width="1920" height="230" fill="url(#sp-sky)" />
          {/* Stars in upper sky */}
          {[
            [130,18],[290,10],[460,28],[740,14],[960,22],[1180,16],[1340,26],
          ].map(([x,y],i) => (
            <circle key={i} cx={x} cy={y} r="0.9" fill="#FFE0A0" opacity="0.85" />
          ))}
          {/* Wispy clouds near horizon */}
          <path d="M120 140 q55-12 130 0 q50 8 110-4" stroke="rgba(255,200,140,0.18)" strokeWidth="4" fill="none" strokeLinecap="round" />
          <path d="M900 155 q70-10 170 0 q60 6 130-6" stroke="rgba(255,200,140,0.13)" strokeWidth="3" fill="none" strokeLinecap="round" />
        </g>

        {/* ── CLOUDS ── */}
        <g ref={cloudsRef} style={{ willChange: "transform" }}>
          <g transform="translate(200,62)">
            <ellipse cx="0"   cy="0" rx="48" ry="18" fill="rgba(255,220,170,0.30)" />
            <ellipse cx="-28" cy="5" rx="30" ry="12" fill="rgba(255,220,170,0.25)" />
            <ellipse cx="30"  cy="7" rx="24" ry="10" fill="rgba(255,220,170,0.22)" />
          </g>
          <g transform="translate(820,48)">
            <ellipse cx="0"   cy="0" rx="62" ry="22" fill="rgba(255,210,150,0.25)" />
            <ellipse cx="-38" cy="6" rx="38" ry="14" fill="rgba(255,210,150,0.20)" />
            <ellipse cx="40"  cy="9" rx="28" ry="12" fill="rgba(255,210,150,0.18)" />
          </g>
          <g transform="translate(1280,68)">
            <ellipse cx="0"   cy="0" rx="42" ry="16" fill="rgba(255,210,150,0.22)" />
            <ellipse cx="-24" cy="5" rx="24" ry="10" fill="rgba(255,210,150,0.18)" />
          </g>
        </g>

        {/* ── BUILDINGS ── */}
        <g ref={bldgRef} style={{ willChange: "transform" }}>

          {/* ━━━ 1 · Dave's Barbershop (x=30, w=195) ━━━ */}
          <rect x="30"  y="108" width="195" height="192" fill="url(#sp-brick-r)" />
          {/* Cornice strip */}
          <rect x="26"  y="104" width="203" height="8" fill="#8A3A28" />
          <rect x="24"  y="100" width="207" height="6" fill="#A84A34" />
          {/* Facade band */}
          <rect x="30"  y="152" width="195" height="3" fill="rgba(255,255,255,0.22)" />
          {/* Sign board */}
          <rect x="52"  y="108" width="152" height="20" fill="#1C0A06" rx="2" />
          <text x="128" y="121" textAnchor="middle" fontSize="9.5" fontWeight="700"
            fontFamily="Georgia, serif" fill="#FFD080" letterSpacing="0.08em">Dave&apos;s</text>
          <text x="128" y="131" textAnchor="middle" fontSize="5.5" fontFamily="monospace"
            fill="rgba(255,208,128,0.55)" letterSpacing="0.22em">BARBERSHOP</text>
          {/* Awning – red/white */}
          <path d="M28 152 L42 128 L214 128 L228 152 Z" fill="#C83028" />
          {[0,1,2,3,4,5,6,7].map(i => (
            <line key={i} x1={42+i*22} y1="128" x2={36+i*22} y2="152"
              stroke="rgba(255,255,255,0.50)" strokeWidth="2.5" />
          ))}
          <path d="M28 152 Q48 160 68 152 Q88 144 108 152 Q128 160 148 152 Q168 144 188 152 Q208 160 228 152"
            fill="none" stroke="#A82020" strokeWidth="1.5" />
          {/* Left window */}
          <rect x="42"  y="162" width="60" height="55" fill="#180A06" rx="1" />
          <rect x="44"  y="164" width="56" height="51" fill="url(#sp-glass-warm)" rx="1" />
          <line x1="72" y1="164" x2="72" y2="215" stroke="#180A06" strokeWidth="1.5" />
          <line x1="44" y1="189" x2="100" y2="189" stroke="#180A06" strokeWidth="1.5" />
          <line x1="47" y1="167" x2="53" y2="178" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" strokeLinecap="round" />
          {/* Star rating */}
          <text x="72" y="232" textAnchor="middle" fontSize="7" fill="rgba(255,220,100,0.65)">★★★★★</text>
          {/* Right window */}
          <rect x="114" y="162" width="60" height="55" fill="#180A06" rx="1" />
          <rect x="116" y="164" width="56" height="51" fill="url(#sp-glass-warm)" rx="1" />
          <line x1="144" y1="164" x2="144" y2="215" stroke="#180A06" strokeWidth="1.5" />
          <line x1="116" y1="189" x2="172" y2="189" stroke="#180A06" strokeWidth="1.5" />
          <line x1="119" y1="167" x2="125" y2="178" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" strokeLinecap="round" />
          {/* Door */}
          <rect x="98"  y="240" width="60" height="60" fill="#4A1E14" rx="1" />
          <rect x="101" y="243" width="54" height="53" fill="#3A1610" rx="1" />
          <rect x="104" y="246" width="48" height="30" fill="url(#sp-glass-warm)" rx="1" />
          <circle cx="146" cy="274" r="2.5" fill="#C8A040" />
          {/* Barber pole */}
          <line x1="24" y1="215" x2="24" y2="295" stroke="#E8E8E8" strokeWidth="7" strokeLinecap="round" />
          {[0,1,2,3,4,5,6].map(i => (
            <rect key={i} x="21" y={215+i*12} width="6" height="6"
              fill={i%2===0 ? "#C82820" : "#2050A8"} opacity="0.85" />
          ))}
          <circle cx="24" cy="213" r="5.5" fill="#E8E8E8" stroke="#CCCCCC" strokeWidth="0.8" />
          {/* Address */}
          <text x="128" y="294" textAnchor="middle" fontSize="7.5" fontFamily="monospace"
            fill="rgba(255,255,255,0.20)">142</text>

          {/* ━━━ 2 · Town Common Bakery (x=245, w=210) ━━━ */}
          {/* Gable / pitched roof */}
          <path d="M240 120 L350 96 L460 120 Z" fill="#D4C090" stroke="#C0A870" strokeWidth="1" />
          <path d="M245 120 L350 99 L455 120 Z" fill="#C8B480" />
          {/* Facade – painted siding */}
          <rect x="245" y="120" width="210" height="180" fill="#E8DABA" />
          {Array.from({length: 22}).map((_,i) => (
            <line key={i} x1="245" y1={123+i*8} x2="455" y2={123+i*8}
              stroke="rgba(180,160,110,0.28)" strokeWidth="0.8" />
          ))}
          {/* Cornice */}
          <rect x="241" y="118" width="218" height="5" fill="#C4A86A" />
          {/* Sign */}
          <rect x="265" y="122" width="170" height="20" fill="#3A2010" rx="2" />
          <text x="350" y="135" textAnchor="middle" fontSize="9" fontWeight="700"
            fontFamily="Georgia, serif" fill="#F5DDA0" letterSpacing="0.07em">Town Common</text>
          <text x="350" y="145" textAnchor="middle" fontSize="5.5" fontFamily="monospace"
            fill="rgba(245,221,160,0.55)" letterSpacing="0.20em">BAKERY · EST. 1978</text>
          {/* Brown awning */}
          <path d="M243 155 L258 134 L442 134 L457 155 Z" fill="#6A4020" />
          {[0,1,2,3,4,5,6,7].map(i => (
            <line key={i} x1={258+i*24} y1="134" x2={252+i*24} y2="155"
              stroke="rgba(220,180,110,0.30)" strokeWidth="2.5" />
          ))}
          <path d="M243 155 Q261 163 279 155 Q297 147 315 155 Q333 163 351 155 Q369 147 387 155 Q405 163 423 155 Q441 147 455 155"
            fill="none" stroke="#5A3010" strokeWidth="1.5" />
          {/* Bay window */}
          <rect x="256" y="164" width="74" height="72" fill="#180A06" rx="1" />
          <rect x="258" y="166" width="70" height="68" fill="url(#sp-glass-warm)" rx="1" />
          <line x1="293" y1="166" x2="293" y2="234" stroke="#180A06" strokeWidth="1.5" />
          <line x1="258" y1="196" x2="328" y2="196" stroke="#180A06" strokeWidth="1.5" />
          {/* Bread in window */}
          <ellipse cx="272" cy="222" rx="10" ry="5"  fill="rgba(180,120,55,0.75)" />
          <ellipse cx="294" cy="224" rx="8"  ry="4"  fill="rgba(200,140,70,0.70)" />
          <ellipse cx="313" cy="222" rx="9"  ry="4.5" fill="rgba(180,120,55,0.70)" />
          <line x1="261" y1="169" x2="267" y2="181" stroke="rgba(255,255,255,0.55)" strokeWidth="1.5" strokeLinecap="round" />
          {/* Right window */}
          <rect x="380" y="170" width="58" height="62" fill="#180A06" rx="1" />
          <rect x="382" y="172" width="54" height="58" fill="url(#sp-glass-cool)" rx="1" />
          <line x1="409" y1="172" x2="409" y2="230" stroke="#180A06" strokeWidth="1.5" />
          <line x1="382" y1="201" x2="436" y2="201" stroke="#180A06" strokeWidth="1.5" />
          {/* Flower box */}
          <rect x="256" y="236" width="74" height="11" fill="#6A3820" rx="2" />
          {[265,279,293,307,321].map((x,i) => (
            <g key={i}>
              <line x1={x} y1="236" x2={x} y2="230" stroke="#4A7A30" strokeWidth="1.5" />
              <circle cx={x} cy="229" r={4+i%2} fill={["#E05060","#FFB060","#E05060","#FF80A0","#FFB060"][i]} opacity="0.9" />
            </g>
          ))}
          {/* Door */}
          <rect x="308" y="244" width="84" height="56" fill="#4A2E10" rx="1" />
          <rect x="311" y="247" width="78" height="49" fill="#381E0A" rx="1" />
          <path d="M315 261 L315 247 Q350 240 385 247 L385 261 Z" fill="url(#sp-glass-warm)" />
          {/* Hanging pretzel sign */}
          <line x1="350" y1="99" x2="350" y2="124" stroke="#8A6030" strokeWidth="1.5" />
          <path d="M335 112 Q345 102 355 112 Q345 122 335 112" fill="none" stroke="#C87820" strokeWidth="3" strokeLinecap="round" />
          <circle cx="337" cy="112" r="2.5" fill="#C87820" />
          <circle cx="353" cy="112" r="2.5" fill="#C87820" />

          {/* ━━━ 3 · Corner Café (x=475, w=178) ━━━ */}
          <rect x="475" y="116" width="178" height="184" fill="url(#sp-brick-r)" opacity="0.9" />
          <rect x="475" y="116" width="178" height="184" fill="rgba(180,100,60,0.18)" />
          <rect x="471" y="112" width="186" height="7" fill="#8A3A28" rx="1" />
          {/* Sign */}
          <rect x="493" y="116" width="142" height="20" fill="#1C0A06" rx="2" />
          <text x="564" y="129" textAnchor="middle" fontSize="10" fontWeight="700"
            fontFamily="Georgia, serif" fill="#FFC878" letterSpacing="0.10em" fontStyle="italic">Corner Café</text>
          <text x="564" y="139" textAnchor="middle" fontSize="4.8" fontFamily="monospace"
            fill="rgba(255,200,120,0.50)" letterSpacing="0.26em">SHREWSBURY · ROUTE 9</text>
          {/* Green awning */}
          <path d="M473 148 L488 124 L640 124 L655 148 Z" fill="#2A6A30" />
          {[0,1,2,3,4,5,6].map(i => (
            <line key={i} x1={488+i*23} y1="124" x2={482+i*23} y2="148"
              stroke="rgba(255,255,255,0.22)" strokeWidth="2.5" />
          ))}
          <path d="M473 148 Q491 156 509 148 Q527 140 545 148 Q563 156 581 148 Q599 140 617 148 Q635 156 655 148"
            fill="none" stroke="#1A4A20" strokeWidth="1.5" />
          {/* Big window */}
          <rect x="486" y="158" width="152" height="80" fill="#180A06" rx="2" />
          <rect x="489" y="161" width="146" height="74" fill="url(#sp-glass-warm)" rx="1" />
          <line x1="537" y1="161" x2="537" y2="235" stroke="#180A06" strokeWidth="1.5" />
          <line x1="585" y1="161" x2="585" y2="235" stroke="#180A06" strokeWidth="1.5" />
          <line x1="633" y1="161" x2="633" y2="235" stroke="#180A06" strokeWidth="1.5" />
          {/* Interior silhouettes */}
          <ellipse cx="513" cy="224" rx="11" ry="4" fill="rgba(90,50,18,0.45)" />
          <circle  cx="508" cy="214" r="4"         fill="rgba(90,50,18,0.40)" />
          <circle  cx="519" cy="215" r="3.5"       fill="rgba(90,50,18,0.35)" />
          <ellipse cx="559" cy="226" rx="10" ry="3.5" fill="rgba(90,50,18,0.40)" />
          <circle  cx="554" cy="217" r="3.5"       fill="rgba(90,50,18,0.32)" />
          <ellipse cx="513" cy="220" rx="2.5" ry="1.5" fill="rgba(255,210,150,0.65)" />
          <ellipse cx="559" cy="222" rx="2"   ry="1.2" fill="rgba(255,210,150,0.60)" />
          <line x1="492" y1="164" x2="499" y2="176" stroke="rgba(255,255,255,0.48)" strokeWidth="1.5" strokeLinecap="round" />
          {/* OPEN sign on door */}
          <rect x="520" y="244" width="68" height="56" fill="#3A1A0A" rx="1" />
          <rect x="523" y="247" width="62" height="49" fill="#2A100A" rx="1" />
          <rect x="526" y="250" width="56" height="30" fill="url(#sp-glass-warm)" rx="1" />
          <text x="554" y="269" textAnchor="middle" fontSize="6.5" fontWeight="700"
            fontFamily="monospace" fill="rgba(255,220,120,0.85)">OPEN</text>
          {/* Chalkboard outside */}
          <rect x="654" y="254" width="44" height="42" fill="#2A2A24" rx="2" />
          <rect x="656" y="256" width="40" height="38" fill="#1A221A" rx="1" />
          <text x="676" y="269" textAnchor="middle" fontSize="6"
            fontFamily="Georgia, serif" fontStyle="italic" fill="rgba(255,255,255,0.65)">Today&apos;s</text>
          <text x="676" y="278" textAnchor="middle" fontSize="6"
            fontFamily="Georgia, serif" fontStyle="italic" fill="rgba(255,255,255,0.65)">Special:</text>
          <text x="676" y="288" textAnchor="middle" fontSize="5.5"
            fontFamily="Georgia, serif" fill="rgba(255,220,140,0.85)">Maple Latte</text>

          {/* ━━━ 4 · Fresh Bloom Florist (x=718, w=184) ━━━ */}
          <rect x="718" y="122" width="184" height="178" fill="#C8A8CC" />
          {Array.from({length:22}).map((_,i) => (
            <line key={i} x1="718" y1={125+i*8} x2="902" y2={125+i*8}
              stroke="rgba(160,120,180,0.30)" strokeWidth="0.8" />
          ))}
          <rect x="714" y="118" width="192" height="7" fill="#8A5898" rx="1" />
          {/* Sign */}
          <rect x="736" y="122" width="148" height="20" fill="#2A0A2A" rx="2" />
          <text x="810" y="135" textAnchor="middle" fontSize="9.5" fontWeight="700"
            fontFamily="Georgia, serif" fill="#F0C0E0" letterSpacing="0.08em">Fresh Bloom</text>
          <text x="810" y="145" textAnchor="middle" fontSize="5" fontFamily="monospace"
            fill="rgba(240,192,224,0.50)" letterSpacing="0.22em">FLORIST</text>
          {/* Purple awning */}
          <path d="M716 152 L730 130 L888 130 L902 152 Z" fill="#6A3880" />
          {[0,1,2,3,4,5,6].map(i => (
            <line key={i} x1={730+i*24} y1="130" x2={724+i*24} y2="152"
              stroke="rgba(255,200,220,0.28)" strokeWidth="2.5" />
          ))}
          <path d="M716 152 Q733 160 750 152 Q767 144 784 152 Q801 160 818 152 Q835 144 852 152 Q869 160 886 152 Q900 145 902 152"
            fill="none" stroke="#5A2870" strokeWidth="1.5" />
          {/* Showroom window */}
          <rect x="728" y="162" width="150" height="80" fill="#180A06" rx="2" />
          <rect x="730" y="164" width="146" height="76" fill="url(#sp-glass-cool)" rx="1" />
          {/* Flowers in window */}
          {[
            {x:748,c:"#E05080",r:7},{x:768,c:"#FF80A0",r:6},{x:788,c:"#FFB040",r:8},
            {x:806,c:"#E05080",r:6},{x:824,c:"#80C840",r:5},{x:842,c:"#FF80A0",r:7},{x:860,c:"#FFB040",r:6},
          ].map(({x,c,r},i) => (
            <g key={i}>
              <line x1={x} y1={174+(i%3)*5} x2={x} y2="235" stroke="#4A7A30" strokeWidth="1.2" />
              <circle cx={x} cy={171+(i%3)*5} r={r}   fill={c} opacity="0.88" />
              <circle cx={x} cy={171+(i%3)*5} r={r*0.35} fill="rgba(255,240,100,0.75)" />
            </g>
          ))}
          <line x1="733" y1="167" x2="740" y2="179" stroke="rgba(255,255,255,0.52)" strokeWidth="1.5" strokeLinecap="round" />
          {/* Door */}
          <rect x="776" y="248" width="68" height="52" fill="#5A2870" rx="1" />
          <rect x="779" y="251" width="62" height="45" fill="#481C60" rx="1" />
          <rect x="783" y="255" width="54" height="28" fill="url(#sp-glass-cool)" rx="1" />
          {/* Flower buckets outside */}
          <rect x="900" y="264" width="22" height="30" fill="#484440" rx="1" />
          <ellipse cx="911" cy="263" rx="13" ry="4" fill="#484440" />
          {[{x:904,c:"#E05080"},{x:912,c:"#FF80A0"},{x:920,c:"#FF8040"}].map(({x,c},i) => (
            <g key={i}>
              <line x1={x} y1="263" x2={x} y2="252" stroke="#4A7A30" strokeWidth="1.5" />
              <circle cx={x} cy="250" r="4.5" fill={c} opacity="0.90" />
            </g>
          ))}

          {/* ━━━ 5 · Tony's Auto (x=942, w=200) ━━━ */}
          <rect x="942" y="112" width="200" height="188" fill="#8A8874" />
          {Array.from({length:28}).map((_,i) => (
            <line key={i} x1="942" y1={115+i*7} x2="1142" y2={115+i*7}
              stroke="rgba(255,255,255,0.07)" strokeWidth="1" />
          ))}
          <rect x="938" y="108" width="208" height="7" fill="#585640" rx="1" />
          {/* Sign */}
          <rect x="958" y="112" width="168" height="20" fill="#1C1A12" rx="2" />
          <text x="1042" y="125" textAnchor="middle" fontSize="9.5" fontWeight="700"
            fontFamily="Georgia, serif" fill="#FFA040" letterSpacing="0.05em">Tony&apos;s Auto</text>
          <text x="1042" y="135" textAnchor="middle" fontSize="4.8" fontFamily="monospace"
            fill="rgba(255,160,64,0.48)" letterSpacing="0.22em">ROUTE 9 · SERVICE &amp; REPAIR</text>
          {/* Office window */}
          <rect x="952" y="138" width="132" height="58" fill="#1C1810" rx="1" />
          <rect x="955" y="141" width="126" height="52" fill="url(#sp-glass-warm)" rx="1" />
          <line x1="1005" y1="141" x2="1005" y2="193" stroke="#1C1810" strokeWidth="1.5" />
          <line x1="1031" y1="141" x2="1031" y2="193" stroke="#1C1810" strokeWidth="1.5" />
          <line x1="1057" y1="141" x2="1057" y2="193" stroke="#1C1810" strokeWidth="1.5" />
          <line x1="955"  y1="167" x2="1081" y2="167" stroke="#1C1810" strokeWidth="1.5" />
          {/* Garage door */}
          <rect x="952" y="204" width="132" height="96" fill="#3A3828" rx="1" />
          {[0,1,2,3].map(i => (
            <rect key={i} x="954" y={207+i*23} width="128" height="21" fill="#2A2818"
              stroke="rgba(255,255,255,0.07)" strokeWidth="0.8" rx="0.5" />
          ))}
          <rect x="958" y="209" width="120" height="8" fill="url(#sp-glass-warm)" opacity="0.55" rx="0.5" />
          {/* Side door */}
          <rect x="1096" y="248" width="38" height="52" fill="#2E2A1C" rx="1" />
          <rect x="1099" y="251" width="32" height="45" fill="#221E14" rx="1" />
          <circle cx="1124" cy="276" r="2.5" fill="#C8A040" />
          {/* Oil stain */}
          <ellipse cx="1018" cy="302" rx="10" ry="2.5" fill="rgba(15,12,8,0.38)" />

          {/* ━━━ 6 · Arturo's Pizzeria (x=1162, w=260) ━━━ */}
          <rect x="1162" y="100" width="260" height="200" fill="url(#sp-brick-o)" />
          {/* Upper cornice decorative band */}
          <rect x="1158" y="96"  width="268" height="8" fill="#8A4820" rx="1" />
          <rect x="1162" y="100" width="260" height="5"  fill="rgba(255,255,255,0.08)" />
          {/* Sign */}
          <rect x="1178" y="100" width="228" height="24" fill="#1C0A04" rx="2" />
          <text x="1292" y="115" textAnchor="middle" fontSize="12" fontWeight="700"
            fontFamily="Georgia, serif" fontStyle="italic" fill="#FFD878" letterSpacing="0.08em">Arturo&apos;s</text>
          <text x="1292" y="127" textAnchor="middle" fontSize="5.5" fontFamily="monospace"
            fill="rgba(255,216,120,0.50)" letterSpacing="0.22em">PIZZERIA · EST. 1962</text>
          {/* Upper windows – arched */}
          {[1182,1245,1308,1371].map((x,i) => (
            <g key={i}>
              <rect x={x}   y="132" width="52" height="55" fill="#1C0E08" rx="1" />
              <path d={`M${x+2} 151 L${x+2} 134 Q${x+28} 126 ${x+54} 134 L${x+54} 151 Z`}
                fill="url(#sp-glass-warm)" />
              <rect x={x+2} y="151" width="50" height="34" fill="url(#sp-glass-warm)" rx="0.5" />
              <line x1={x+5}  y1="154" x2={x+13} y2="168"
                stroke="rgba(255,255,255,0.40)" strokeWidth="1.5" strokeLinecap="round" />
            </g>
          ))}
          {/* Red/white awning */}
          <path d="M1160 198 L1176 174 L1420 174 L1436 198 Z" fill="#C83028" />
          {[0,1,2,3,4,5,6,7,8,9,10].map(i => (
            <line key={i} x1={1176+i*24} y1="174" x2={1170+i*24} y2="198"
              stroke="rgba(255,255,255,0.45)" strokeWidth="2.5" />
          ))}
          <path d="M1160 198 Q1179 206 1198 198 Q1217 190 1236 198 Q1255 206 1274 198 Q1293 190 1312 198 Q1331 206 1350 198 Q1369 190 1388 198 Q1407 206 1420 198"
            fill="none" stroke="#A82020" strokeWidth="1.5" />
          {/* Ground-floor windows */}
          {[1168, 1252, 1336].map((x,i) => (
            <g key={i}>
              <rect x={x}   y="208" width="72" height="92" fill="#1C0E08" rx="1" />
              <rect x={x+2} y="210" width="68" height="88" fill="url(#sp-glass-warm)" rx="1" />
              <line x1={x+36} y1="210" x2={x+36} y2="298" stroke="#1C0E08" strokeWidth="1.5" />
              {/* Candle / menu silhouette */}
              <rect x={x+25} y="224" width="20" height="28" fill="rgba(255,240,200,0.55)" rx="0.5" />
              <line x1={x+5} y1="213" x2={x+13} y2="226"
                stroke="rgba(255,255,255,0.38)" strokeWidth="1.5" strokeLinecap="round" />
            </g>
          ))}
          {/* Center door – arched */}
          <rect x="1247" y="244" width="90" height="56" fill="#3A1A08" rx="1" />
          <rect x="1250" y="247" width="84" height="49" fill="#2A1006" rx="1" />
          <path d="M1252 264 L1252 249 Q1292 240 1332 249 L1332 264 Z" fill="url(#sp-glass-warm)" />
          {/* String lights */}
          <path d="M1162 202 Q1200 210 1240 202 Q1278 194 1318 202 Q1358 210 1420 202"
            fill="none" stroke="#7A6028" strokeWidth="0.8" />
          {[1170,1198,1226,1254,1282,1310,1338,1366,1394,1416].map((x,i) => (
            <circle key={i} cx={x} cy={203+(i%2)*7} r="2.8"
              fill="#FFE040" opacity="0.88" />
          ))}

        </g>

        {/* ── FOREGROUND (sidewalk, road, props) ── */}
        <g ref={fgRef} style={{ willChange: "transform" }}>
          {/* Sidewalk */}
          <rect x="-240" y="300" width="1920" height="28" fill="url(#sp-sidewalk)" />
          <rect x="-240" y="300" width="1920" height="28" fill="rgba(185,170,145,0.65)" />
          {/* Road */}
          <rect x="-240" y="326" width="1920" height="18" fill="url(#sp-road)" />
          <line x1="-240" y1="335" x2="1680" y2="335"
            stroke="rgba(255,255,200,0.28)" strokeWidth="2" strokeDasharray="32 22" />

          {/* Parked car – red, near barbershop */}
          <rect x="40"  y="302" width="96" height="30" fill="#C83028" rx="4" />
          <path d="M52 302 L68 290 L118 290 L132 302 Z" fill="#C83028" />
          <rect x="64"  y="292" width="56" height="10" fill="url(#sp-glass-cool)" rx="1" />
          <circle cx="62"  cy="324" r="7" fill="#1A1A1A" stroke="#383838" strokeWidth="1" />
          <circle cx="62"  cy="324" r="3.5" fill="#282828" />
          <circle cx="118" cy="324" r="7" fill="#1A1A1A" stroke="#383838" strokeWidth="1" />
          <circle cx="118" cy="324" r="3.5" fill="#282828" />
          <rect x="132" y="306" width="6" height="8" fill="rgba(255,255,200,0.72)" rx="1" />
          <rect x="40"  y="306" width="6" height="8" fill="rgba(255,80,60,0.72)"  rx="1" />

          {/* Parked car – navy, near florist */}
          <rect x="738" y="299" width="100" height="32" fill="#285298" rx="4" />
          <path d="M752 299 L768 286 L818 286 L832 299 Z" fill="#285298" />
          <rect x="764" y="288" width="54" height="11" fill="url(#sp-glass-cool)" rx="1" />
          <circle cx="758" cy="323" r="7" fill="#1A1A1A" stroke="#383838" strokeWidth="1" />
          <circle cx="758" cy="323" r="3.5" fill="#282828" />
          <circle cx="820" cy="323" r="7" fill="#1A1A1A" stroke="#383838" strokeWidth="1" />
          <circle cx="820" cy="323" r="3.5" fill="#282828" />

          {/* Fire hydrant */}
          <rect x="244" y="283" width="13" height="20" fill="#E82818" rx="2" />
          <rect x="241" y="283" width="19" height="5"  fill="#C81808" rx="1" />
          <rect x="242" y="299" width="17" height="4"  fill="#C81808" rx="1" />
          <rect x="244" y="289" width="5"  height="7"  fill="#C81808" />
          <rect x="252" y="289" width="5"  height="7"  fill="#C81808" />

          {/* Route 9 highway sign */}
          <line x1="937" y1="266" x2="937" y2="302" stroke="#5A5840" strokeWidth="3" />
          <rect x="913" y="258" width="48" height="26" fill="#1B6B3E" rx="2" />
          <text x="937" y="268" textAnchor="middle" fontSize="6.5" fontWeight="700"
            fontFamily="monospace" fill="white" letterSpacing="0.06em">ROUTE</text>
          <text x="937" y="280" textAnchor="middle" fontSize="11" fontWeight="700"
            fontFamily="monospace" fill="white">9</text>

          {/* Pedestrian 1 */}
          <g transform="translate(444,271)">
            <ellipse cx="0" cy="0" rx="5" ry="8" fill="#3A2818" opacity="0.72" />
            <circle  cx="0" cy="-12" r="5" fill="#3A2818" opacity="0.72" />
            <line x1="-5" y1="-3" x2="-11" y2="5"  stroke="#3A2818" strokeWidth="2" strokeLinecap="round" opacity="0.72" />
            <line x1="5"  y1="-3" x2="10"  y2="3"  stroke="#3A2818" strokeWidth="2" strokeLinecap="round" opacity="0.72" />
            <line x1="-3" y1="8"  x2="-7"  y2="22" stroke="#3A2818" strokeWidth="2.5" strokeLinecap="round" opacity="0.72" />
            <line x1="3"  y1="8"  x2="7"   y2="20" stroke="#3A2818" strokeWidth="2.5" strokeLinecap="round" opacity="0.72" />
          </g>

          {/* Pedestrian 2 with shopping bag */}
          <g transform="translate(1112,268)">
            <ellipse cx="0" cy="0" rx="5" ry="8" fill="#2A1810" opacity="0.68" />
            <circle  cx="0" cy="-12" r="5.5" fill="#2A1810" opacity="0.68" />
            <line x1="-5" y1="-3" x2="-14" y2="3"  stroke="#2A1810" strokeWidth="2" strokeLinecap="round" opacity="0.68" />
            <rect x="-20" y="-2" width="9" height="11" fill="#D4682A" rx="1" opacity="0.68" />
            <line x1="5"  y1="-3" x2="9"   y2="5"  stroke="#2A1810" strokeWidth="2" strokeLinecap="round" opacity="0.68" />
            <line x1="-3" y1="8"  x2="-7"  y2="22" stroke="#2A1810" strokeWidth="2.5" strokeLinecap="round" opacity="0.68" />
            <line x1="3"  y1="8"  x2="7"   y2="20" stroke="#2A1810" strokeWidth="2.5" strokeLinecap="round" opacity="0.68" />
          </g>

          {/* Lamp posts */}
          {[374, 1490].map((x,i) => (
            <g key={i}>
              <line x1={x} y1="278" x2={x} y2="304" stroke="#5A5638" strokeWidth="3" />
              <path d={`M${x} 278 Q${x+16} 272 ${x+22} 264`} fill="none" stroke="#5A5638" strokeWidth="2.5" />
              <ellipse cx={x+22} cy="261" rx="9" ry="5.5" fill="#FFF8C0" opacity="0.88" />
              <ellipse cx={x+22} cy="264" rx="9" ry="5"   fill="rgba(255,248,192,0.42)" />
              <ellipse cx={x+22} cy="296" rx="22" ry="3"  fill="rgba(255,248,192,0.07)" />
            </g>
          ))}

        </g>

        {/* Distant hill silhouette above buildings */}
        <path d="M-240 220 Q120 208 380 215 Q620 222 780 210 Q940 198 1160 212 Q1340 222 1680 215 L1680 230 L-240 230 Z"
          fill="rgba(30,18,10,0.22)" />

        {/* Edge + top/bottom fades */}
        <rect x="0"    y="0"   width="140"  height="340" fill="url(#sp-fade-l)" />
        <rect x="1300" y="0"   width="140"  height="340" fill="url(#sp-fade-r)" />
        <rect x="0"    y="0"   width="1440" height="72"  fill="url(#sp-fade-t)" />
        <rect x="0"    y="268" width="1440" height="72"  fill="url(#sp-fade-b)" />

        {/* Caption */}
        <text x="720" y="26" textAnchor="middle" fontSize="8.5" fontFamily="monospace"
          fontWeight="700" fill="rgba(212,104,42,0.42)" letterSpacing="2.4">
          ROUTE 9 · SHREWSBURY MA · INDEPENDENT SHOPS
        </text>
      </svg>
    </div>
  );
}
