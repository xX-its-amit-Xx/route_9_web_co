"use client";

// GasStationPump ──────────────────────────────────────────────────────────────
//
// Vintage Route 9 full-service gas station pump with CSS-animated rolling
// price-digit wheels that spin up on scroll reveal. Two illustrated red pumps
// with chrome globes flank a central price display. Placed before Pricing.

import { useEffect, useRef, useState } from "react";

function DigitWheel({ digit, active, delay }: { digit: number; active: boolean; delay: number }) {
  return (
    <div style={{
      width: "42px", height: "58px",
      overflow: "hidden",
      background: "#080402",
      border: "1.5px solid rgba(148,108,20,.60)",
      borderRadius: "3px",
      position: "relative",
      flexShrink: 0,
    }}>
      <div aria-hidden style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        background: "linear-gradient(180deg,rgba(0,0,0,.82) 0%,transparent 28%,transparent 72%,rgba(0,0,0,.82) 100%)",
        zIndex: 2,
      }}/>
      <div style={{
        display: "flex", flexDirection: "column",
        transform: `translateY(${active ? -digit * 58 : 0}px)`,
        transition: active ? `transform 2.2s cubic-bezier(.22,.88,.36,1.0) ${delay}ms` : "none",
      }}>
        {[0,1,2,3,4,5,6,7,8,9].map(n => (
          <div key={n} style={{
            height: "58px", width: "42px",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: '"Courier New",Courier,monospace',
            fontSize: "34px", fontWeight: "bold",
            color: "#f0d840",
            textShadow: "0 0 8px rgba(240,216,64,.58)",
            userSelect: "none",
          }}>{n}</div>
        ))}
      </div>
    </div>
  );
}

export function GasStationPump() {
  const [active, setActive] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e?.isIntersecting) { setActive(true); obs.disconnect(); } },
      { threshold: 0.18 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const PW = 88;   // pump body width
  const PH = 252;  // pump body height
  const BY = 124;  // body top y
  const LX = 195;  // left pump center x
  const RX = 705;  // right pump center x

  return (
    <div
      ref={ref}
      style={{
        background: "linear-gradient(180deg,#0a0503 0%,#0e0704 100%)",
        padding: "4.5rem 1.5rem 3rem",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* Ambient glow */}
      <div aria-hidden style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        background: "radial-gradient(ellipse at 50% 84%,rgba(190,50,12,.055) 0%,transparent 56%)",
      }}/>

      {/* Section label */}
      <p style={{
        textAlign: "center", fontSize: "9px", letterSpacing: "0.32em",
        textTransform: "uppercase", color: "rgba(212,104,42,0.38)", fontFamily: "monospace",
        marginBottom: "0.4rem", opacity: active ? 1 : 0, transition: "opacity .5s ease .1s",
      }}>
        Route 9 Web Co. · Full Service · Shrewsbury, MA
      </p>
      <p style={{
        textAlign: "center", marginBottom: "2rem", fontSize: "11px", letterSpacing: "0.06em",
        color: "rgba(243,233,213,0.2)", fontFamily: "var(--font-display,Georgia),Georgia,serif",
        fontStyle: "italic", opacity: active ? 1 : 0, transition: "opacity .5s ease .18s",
      }}>
        Pull in. We&apos;ll take it from here.
      </p>

      {/* Stage */}
      <div style={{ position: "relative", maxWidth: "900px", margin: "0 auto", height: "480px" }}>

        {/* Pump illustration */}
        <svg
          viewBox="0 0 900 480"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
          role="img"
          aria-label="Vintage Route 9 gas station pump illustration"
        >
          <defs>
            <linearGradient id="gsp-body-l" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%"   stopColor="#6c1008"/>
              <stop offset="55%"  stopColor="#c42018"/>
              <stop offset="100%" stopColor="#8c1410"/>
            </linearGradient>
            <linearGradient id="gsp-body-r" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%"   stopColor="#8c1410"/>
              <stop offset="45%"  stopColor="#c42018"/>
              <stop offset="100%" stopColor="#6c1008"/>
            </linearGradient>
            <linearGradient id="gsp-chrome" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"   stopColor="#d8d2b8"/>
              <stop offset="48%"  stopColor="#f0ecd8"/>
              <stop offset="100%" stopColor="#a8a090"/>
            </linearGradient>
            <radialGradient id="gsp-globe-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%"   stopColor="rgba(255,242,140,0.42)"/>
              <stop offset="100%" stopColor="rgba(255,242,140,0)"/>
            </radialGradient>
            <radialGradient id="gsp-globe-shine" cx="34%" cy="28%" r="64%">
              <stop offset="0%"   stopColor="rgba(255,255,255,0.72)"/>
              <stop offset="100%" stopColor="rgba(255,255,255,0)"/>
            </radialGradient>
          </defs>

          {/* Asphalt ground */}
          <rect x="0" y="452" width="900" height="28" fill="#0c0906"/>
          <line x1="0" y1="452" x2="900" y2="452" stroke="rgba(160,90,20,.18)" strokeWidth="1"/>
          {[375, 415, 455, 495].map(lx => (
            <line key={lx} x1={lx} y1="456" x2={lx} y2="476"
              stroke="rgba(240,200,60,.10)" strokeWidth="1.5"/>
          ))}

          {/* Canopy posts */}
          <rect x="285" y="28" width="10" height="426" rx="5" fill="#1e1a12"/>
          <rect x="605" y="28" width="10" height="426" rx="5" fill="#1e1a12"/>
          {/* Canopy beam */}
          <rect x="152" y="26" width="596" height="22" rx="4" fill="#1a1710"/>
          <rect x="152" y="26" width="596" height="5"  rx="3" fill="#2e2a1a"/>
          <rect x="152" y="43" width="596" height="5"  rx="3" fill="#2e2a1a"/>
          {/* Sign */}
          <rect x="314" y="1" width="272" height="28" rx="5"
            fill="#120808" stroke="rgba(200,60,20,.42)" strokeWidth="1"/>
          <text x="450" y="19" textAnchor="middle"
            fill="rgba(240,80,30,.84)" fontSize="11"
            fontFamily="monospace" fontWeight="bold" letterSpacing="2.2">
            FULL SERVICE WEB
          </text>
          <text x="450" y="26" textAnchor="middle"
            fill="rgba(240,80,30,.38)" fontSize="5.5"
            fontFamily="monospace" letterSpacing="1.6">
            ROUTE 9 · SHREWSBURY · MA
          </text>

          {/* ── LEFT PUMP ── */}
          <circle cx={LX} cy="74" r="44" fill="url(#gsp-globe-glow)"/>
          <circle cx={LX} cy="74" r="30" fill="#faf2cc"/>
          <circle cx={LX} cy="74" r="30" fill="url(#gsp-globe-shine)"/>
          <circle cx={LX} cy="74" r="30" stroke="url(#gsp-chrome)" strokeWidth="3.5"/>
          <text x={LX} y="70" textAnchor="middle" fill="#8c1a10"
            fontSize="7.5" fontFamily="monospace" fontWeight="bold" letterSpacing="0.5">ROUTE 9</text>
          <text x={LX} y="81" textAnchor="middle" fill="#8c1a10"
            fontSize="6" fontFamily="monospace" letterSpacing="0.4">PREMIUM</text>
          <rect x={LX-7} y="103" width="14" height="22" rx="3" fill="url(#gsp-chrome)"/>

          {/* Body */}
          <rect x={LX-PW/2} y={BY}      width={PW}    height={PH}  rx="5" fill="url(#gsp-body-l)"/>
          <rect x={LX-PW/2+5} y={BY+15} width="10"    height={PH-22} rx="2" fill="rgba(255,255,255,0.055)"/>
          <rect x={LX-PW/2} y={BY}      width={PW}    height="13"  rx="4" fill="url(#gsp-chrome)"/>
          <rect x={LX-PW/2} y={BY+112}  width={PW}    height="7"         fill="url(#gsp-chrome)"/>
          <rect x={LX-PW/2} y={BY+208}  width={PW}    height="5"         fill="url(#gsp-chrome)"/>

          {/* Price window */}
          <rect x={LX-26} y={BY+19} width="52" height="78" rx="3"
            fill="#080402" stroke="url(#gsp-chrome)" strokeWidth="1.2"/>
          <text x={LX} y={BY+31} textAnchor="middle"
            fill="rgba(240,190,50,.44)" fontSize="5" fontFamily="monospace" letterSpacing="0.5">PRICE PER SITE</text>
          <rect x={LX-22} y={BY+35} width="44" height="50" rx="2" fill="#040201"/>

          {/* Brand plate */}
          <rect x={LX-27} y={BY+127} width="54" height="30" rx="2" fill="rgba(0,0,0,.35)"/>
          <text x={LX} y={BY+140} textAnchor="middle"
            fill="rgba(255,240,200,.82)" fontSize="7" fontFamily="monospace" fontWeight="bold" letterSpacing="0.8">FULL</text>
          <text x={LX} y={BY+151} textAnchor="middle"
            fill="rgba(255,240,200,.82)" fontSize="7" fontFamily="monospace" fontWeight="bold" letterSpacing="0.8">SERVICE</text>

          {/* Hose */}
          <rect x={LX+PW/2} y={BY+165} width="16" height="7" rx="3.5" fill="url(#gsp-chrome)"/>
          <path d={`M ${LX+PW/2+12},${BY+168} C ${LX+PW/2+34},${BY+196} ${LX+PW/2+38},${BY+238} ${LX+PW/2+22},${BY+272} Q ${LX+PW/2+8},${BY+290} ${LX+PW/2-8},${BY+295}`}
            stroke="#1e1810" strokeWidth="8" strokeLinecap="round" fill="none"/>
          <path d={`M ${LX+PW/2+12},${BY+168} C ${LX+PW/2+34},${BY+196} ${LX+PW/2+38},${BY+238} ${LX+PW/2+22},${BY+272} Q ${LX+PW/2+8},${BY+290} ${LX+PW/2-8},${BY+295}`}
            stroke="#2e2818" strokeWidth="4.5" strokeLinecap="round" fill="none"/>
          <rect x={LX+PW/2-18} y={BY+291} width="20" height="9" rx="4.5" fill="url(#gsp-chrome)"/>

          {/* Base */}
          <rect x={LX-PW/2-14} y={BY+PH}    width={PW+28} height="20" rx="5" fill="#201c10"/>
          <rect x={LX-PW/2-14} y={BY+PH}    width={PW+28} height="5"  rx="3" fill="url(#gsp-chrome)"/>
          <rect x={LX-PW/2-20} y={BY+PH+20} width={PW+40} height="10" rx="4" fill="#181408"/>

          {/* ── RIGHT PUMP ── */}
          <circle cx={RX} cy="74" r="44" fill="url(#gsp-globe-glow)"/>
          <circle cx={RX} cy="74" r="30" fill="#faf2cc"/>
          <circle cx={RX} cy="74" r="30" fill="url(#gsp-globe-shine)"/>
          <circle cx={RX} cy="74" r="30" stroke="url(#gsp-chrome)" strokeWidth="3.5"/>
          <text x={RX} y="70" textAnchor="middle" fill="#8c1a10"
            fontSize="7.5" fontFamily="monospace" fontWeight="bold" letterSpacing="0.5">ROUTE 9</text>
          <text x={RX} y="81" textAnchor="middle" fill="#8c1a10"
            fontSize="6" fontFamily="monospace" letterSpacing="0.4">PREMIUM</text>
          <rect x={RX-7} y="103" width="14" height="22" rx="3" fill="url(#gsp-chrome)"/>

          <rect x={RX-PW/2} y={BY}       width={PW}    height={PH}  rx="5" fill="url(#gsp-body-r)"/>
          <rect x={RX+PW/2-15} y={BY+15} width="10"    height={PH-22} rx="2" fill="rgba(255,255,255,0.055)"/>
          <rect x={RX-PW/2} y={BY}       width={PW}    height="13"  rx="4" fill="url(#gsp-chrome)"/>
          <rect x={RX-PW/2} y={BY+112}   width={PW}    height="7"         fill="url(#gsp-chrome)"/>
          <rect x={RX-PW/2} y={BY+208}   width={PW}    height="5"         fill="url(#gsp-chrome)"/>

          <rect x={RX-26} y={BY+19} width="52" height="78" rx="3"
            fill="#080402" stroke="url(#gsp-chrome)" strokeWidth="1.2"/>
          <text x={RX} y={BY+31} textAnchor="middle"
            fill="rgba(240,190,50,.44)" fontSize="5" fontFamily="monospace" letterSpacing="0.5">PRICE PER SITE</text>
          <rect x={RX-22} y={BY+35} width="44" height="50" rx="2" fill="#040201"/>

          <rect x={RX-27} y={BY+127} width="54" height="30" rx="2" fill="rgba(0,0,0,.35)"/>
          <text x={RX} y={BY+140} textAnchor="middle"
            fill="rgba(255,240,200,.82)" fontSize="7" fontFamily="monospace" fontWeight="bold" letterSpacing="0.8">FULL</text>
          <text x={RX} y={BY+151} textAnchor="middle"
            fill="rgba(255,240,200,.82)" fontSize="7" fontFamily="monospace" fontWeight="bold" letterSpacing="0.8">SERVICE</text>

          {/* Hose on left side of right pump */}
          <rect x={RX-PW/2-16} y={BY+165} width="16" height="7" rx="3.5" fill="url(#gsp-chrome)"/>
          <path d={`M ${RX-PW/2-12},${BY+168} C ${RX-PW/2-34},${BY+196} ${RX-PW/2-38},${BY+238} ${RX-PW/2-22},${BY+272} Q ${RX-PW/2-8},${BY+290} ${RX-PW/2+8},${BY+295}`}
            stroke="#1e1810" strokeWidth="8" strokeLinecap="round" fill="none"/>
          <path d={`M ${RX-PW/2-12},${BY+168} C ${RX-PW/2-34},${BY+196} ${RX-PW/2-38},${BY+238} ${RX-PW/2-22},${BY+272} Q ${RX-PW/2-8},${BY+290} ${RX-PW/2+8},${BY+295}`}
            stroke="#2e2818" strokeWidth="4.5" strokeLinecap="round" fill="none"/>
          <rect x={RX-PW/2+2} y={BY+291} width="20" height="9" rx="4.5" fill="url(#gsp-chrome)"/>

          <rect x={RX-PW/2-14} y={BY+PH}    width={PW+28} height="20" rx="5" fill="#201c10"/>
          <rect x={RX-PW/2-14} y={BY+PH}    width={PW+28} height="5"  rx="3" fill="url(#gsp-chrome)"/>
          <rect x={RX-PW/2-20} y={BY+PH+20} width={PW+40} height="10" rx="4" fill="#181408"/>
        </svg>

        {/* ── Price display (HTML for CSS digit animation) ── */}
        <div style={{
          position: "absolute",
          top: "148px",
          left: "50%",
          transform: "translateX(-50%)",
          opacity: active ? 1 : 0,
          transition: "opacity .6s ease .3s",
          zIndex: 10,
          pointerEvents: "none",
        }}>
          <div style={{
            background: "#0e0804",
            border: "2px solid rgba(148,108,20,.58)",
            borderRadius: "8px",
            padding: "14px 22px 12px",
            boxShadow: "0 0 40px rgba(0,0,0,.85), inset 0 0 28px rgba(0,0,0,.55)",
          }}>
            <p style={{
              textAlign: "center", margin: "0 0 6px",
              fontSize: "7px", letterSpacing: "0.28em", textTransform: "uppercase",
              color: "rgba(240,180,60,.52)", fontFamily: "monospace",
            }}>sites from</p>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "4px" }}>
              <span style={{
                color: "#f0d840",
                fontFamily: '"Courier New",Courier,monospace',
                fontSize: "38px", fontWeight: "bold",
                paddingRight: "2px",
                textShadow: "0 0 10px rgba(240,216,64,.52)",
                lineHeight: "58px",
                userSelect: "none",
              }}>$</span>
              <DigitWheel digit={5} active={active} delay={220}/>
              <DigitWheel digit={9} active={active} delay={400}/>
              <DigitWheel digit={9} active={active} delay={580}/>
            </div>
            <p style={{
              textAlign: "center", margin: "6px 0 0",
              fontSize: "7px", letterSpacing: "0.22em", textTransform: "uppercase",
              color: "rgba(240,180,60,.40)", fontFamily: "monospace",
            }}>shrewsbury · ma</p>
          </div>
        </div>
      </div>

      {/* Bottom caption */}
      <p style={{
        textAlign: "center", marginTop: ".5rem",
        fontSize: "10px", letterSpacing: "0.14em",
        color: "rgba(243,233,213,.16)", fontFamily: "monospace",
        opacity: active ? 1 : 0,
        transition: "opacity .5s ease 2.8s",
      }}>
        No appointment necessary. No upsells. Just clean, fast websites.
      </p>
    </div>
  );
}
