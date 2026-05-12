"use client";

import { useRef, MouseEvent } from "react";

type Props = {
  children: React.ReactNode;
  className?: string;
  intensity?: number;
};

export function TiltCard({ children, className = "", intensity = 8 }: Props) {
  const ref    = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  const handleMove = (e: MouseEvent<HTMLDivElement>) => {
    const card = ref.current;
    if (!card) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;

    const rect = card.getBoundingClientRect();
    const x    = (e.clientX - rect.left) / rect.width  - 0.5;
    const y    = (e.clientY - rect.top)  / rect.height - 0.5;

    card.style.transform =
      `perspective(1100px) rotateX(${-y * intensity}deg) rotateY(${x * intensity}deg) scale3d(1.03,1.03,1.03)`;

    const glow = glowRef.current;
    if (glow) {
      const lx = e.clientX - rect.left;
      const ly = e.clientY - rect.top;
      glow.style.background =
        `radial-gradient(240px circle at ${lx}px ${ly}px, rgba(255,175,90,0.09), transparent 65%)`;
      glow.style.opacity = "1";
    }
  };

  const handleLeave = () => {
    const card = ref.current;
    if (card) {
      card.style.transform =
        "perspective(1100px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)";
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
        transition: "transform 0.22s cubic-bezier(0.22,1,0.36,1)",
        transformStyle: "preserve-3d",
        willChange: "transform",
      }}
    >
      {/* Specular warm-light orb that follows the mouse — sits above card content */}
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
          transition: "opacity 0.35s ease",
        }}
      />
      {children}
    </div>
  );
}
