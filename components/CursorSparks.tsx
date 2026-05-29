"use client";

import { useEffect, useRef } from "react";

type Spark = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  size: number;
  hue: number;
};

export function CursorSparks() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = window.innerWidth;
    let h = window.innerHeight;
    canvas.width = w;
    canvas.height = h;

    const onResize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w;
      canvas.height = h;
    };
    window.addEventListener("resize", onResize);

    const sparks: Spark[] = [];
    let prevX = -1;
    let prevY = -1;
    let rafId: number;

    const onMove = (e: MouseEvent) => {
      const mx = e.clientX;
      const my = e.clientY;

      if (prevX < 0) {
        prevX = mx;
        prevY = my;
        return;
      }

      const dx = mx - prevX;
      const dy = my - prevY;
      const speed = Math.sqrt(dx * dx + dy * dy);

      if (speed > 14) {
        const count = Math.min(5, Math.floor(speed / 14));
        for (let i = 0; i < count; i++) {
          const spread = 0.9;
          const angle = Math.atan2(dy, dx) + (Math.random() - 0.5) * spread;
          const vel = speed * (0.08 + Math.random() * 0.1);
          sparks.push({
            x: mx + (Math.random() - 0.5) * 8,
            y: my + (Math.random() - 0.5) * 8,
            vx: Math.cos(angle) * vel,
            vy: Math.sin(angle) * vel - 1.2,
            life: 0.9 + Math.random() * 0.1,
            size: 1.2 + Math.random() * 2.2,
            hue: 22 + Math.random() * 18,
          });
        }
      }

      prevX = mx;
      prevY = my;
    };

    document.addEventListener("mousemove", onMove, { passive: true });

    const tick = () => {
      ctx.clearRect(0, 0, w, h);

      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i];
        s.x += s.vx;
        s.y += s.vy;
        s.vy += 0.09;
        s.vx *= 0.95;
        s.life -= 0.045;

        if (s.life <= 0) {
          sparks.splice(i, 1);
          continue;
        }

        ctx.beginPath();
        ctx.arc(s.x, s.y, Math.max(0.1, s.size * s.life), 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${s.hue}, 88%, 60%, ${s.life * 0.7})`;
        ctx.fill();
      }

      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
      document.removeEventListener("mousemove", onMove);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 9996 }}
    />
  );
}
