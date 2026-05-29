"use client";

import { useEffect, useRef } from "react";

export function HeroNoise() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = 220;
    const H = 220;
    canvas.width = W;
    canvas.height = H;

    const imageData = ctx.createImageData(W, H);
    const data = imageData.data;

    let rafId: number;
    let lastTime = 0;
    const INTERVAL = 1000 / 14; // 14fps — enough grain without thrashing

    const frame = (time: number) => {
      rafId = requestAnimationFrame(frame);
      if (time - lastTime < INTERVAL) return;
      lastTime = time;

      for (let i = 0; i < data.length; i += 4) {
        const v = (Math.random() * 255) | 0;
        data[i]     = v;
        data[i + 1] = v;
        data[i + 2] = v;
        data[i + 3] = (Math.random() * 22) | 0; // very transparent
      }
      ctx.putImageData(imageData, 0, 0);
    };

    rafId = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="absolute inset-0 w-full h-full pointer-events-none select-none"
      style={{
        mixBlendMode: "screen",
        opacity: 0.55,
        imageRendering: "pixelated",
        zIndex: 2,
      }}
    />
  );
}
