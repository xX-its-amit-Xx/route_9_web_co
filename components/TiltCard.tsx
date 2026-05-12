"use client";

import { useRef, MouseEvent } from "react";

type Props = {
  children: React.ReactNode;
  className?: string;
  intensity?: number;
};

export function TiltCard({ children, className = "", intensity = 8 }: Props) {
  const ref     = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  const handleMove = (e: MouseEvent<HTMLDivElement>) => {
    const card = ref.current;
    if (!card) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;

    const rect = card.getBoundingClientRect();
    const x    = (e.clientX - rect.left) / rect.width  - 0.5;
    const y    = (e.clientY - rect.top)  / rect.height - 0.5;

    card.style.transform =
      `perspective(900px) rotateX(${-y * intensity}deg) rotateY(${x * intensity}deg) scale3d(1.035,1.035,1.035) translateZ(16px)`;

    // Shadow shifts directionally opposite to tilt — simulates overhead light source
    const sx = x * -18;
    const sy = y * -12;
    card.style.boxShadow = [
      `${sx}px ${sy + 28}px 56px rgba(0,0,0,0.22)`,
      `${sx * 0.4}px ${sy * 0.4 + 10}px 22px rgba(0,0,0,0.13)`,
      "0 0 0 1px rgba(212,104,42,0.12)",
      "0 6px 80px rgba(212,104,42,0.07)",
    ].join(", ");

    const glow = glowRef.current;
    if (glow) {
      const lx = e.clientX - rect.left;
      const ly = e.clientY - rect.top;
      glow.style.background =
        `radial-gradient(320px circle at ${lx}px ${ly}px, rgba(255,175,90,0.16), transparent 58%)`;
      glow.style.opacity = "1";
    }
  };

  const handleLeave = () => {
    const card = ref.current;
    if (card) {
      card.style.transform =
        "perspective(900px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1) translateZ(0)";
      card.style.boxShadow = "";
    }
    const glow = glowRef.current;
    if (glow) glow.style.opacity = "0";
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className={`relative ${className}`}
      style={{
        transition: "transform 0.28s cubic-bezier(0.22,1,0.36,1), box-shadow 0.32s cubic-bezier(0.22,1,0.36,1)",
        transformStyle: "preserve-3d",
        willChange: "transform",
      }}
    >
      {/* Specular warm-light orb that follows the mouse */}
      <div
        ref={glowRef}
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "1.25rem",
          pointerEvents: "none",
          zIndex: 20,
          opacity: 0,
          transition: "opacity 0.3s ease",
        }}
      />
      {children}
    </div>
  );
}
