"use client";

import { useEffect, useRef } from "react";
import { particleAlpha, spawnBurst, stepParticles, type Particle } from "@/lib/nova/particles";

interface Props {
  /** Skip the particles and just cross-fade (reduced motion or a weak device). */
  simple: boolean;
  coarse: boolean;
  onDone: () => void;
}

const SIMPLE_MS = 450;
const FAILSAFE_MS = 2600;

/**
 * Full-screen 2D canvas burst that plays while the landing dissolves. It starts at Nova and ends in State B.
 * Plain 2D canvas, so it needs no WebGL and stays light on phones.
 */
export function Dissolve({ simple, coarse, onDone }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const doneRef = useRef(onDone);
  doneRef.current = onDone;

  useEffect(() => {
    let finished = false;
    const finish = () => {
      if (finished) return;
      finished = true;
      doneRef.current();
    };

    if (simple) {
      const id = setTimeout(finish, SIMPLE_MS);
      return () => clearTimeout(id);
    }

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) {
      const id = setTimeout(finish, SIMPLE_MS);
      return () => clearTimeout(id);
    }

    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const w = window.innerWidth;
    const h = window.innerHeight;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // Start at Nova's centre (fall back to the screen centre).
    const box = document.querySelector(".nova-box")?.getBoundingClientRect();
    const cx = box ? box.left + box.width / 2 : w / 2;
    const cy = box ? box.top + box.height * 0.5 : h * 0.45;
    const total = coarse ? 240 : 560;
    const swirl = 1.6;

    let particles: Particle[] = [];
    let spawned = 0;
    let t = 0;
    let last = performance.now();
    let raf = 0;
    const waves = [0, 0.12, 0.26];

    const frame = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      t += dt;

      while (spawned < waves.length && t >= waves[spawned]) {
        particles = particles.concat(spawnBurst(Math.round(total / waves.length), cx, cy, Math.random));
        spawned++;
      }
      particles = stepParticles(particles, dt, swirl);

      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = "lighter";

      // shockwave ring
      const ringR = t * Math.max(w, h) * 0.75;
      const ringA = Math.max(0, 0.5 - t * 0.5);
      if (ringA > 0) {
        ctx.strokeStyle = `rgba(120, 170, 255, ${ringA})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(cx, cy, ringR, 0, Math.PI * 2);
        ctx.stroke();
      }

      for (const p of particles) {
        const a = particleAlpha(p);
        const r = Math.round(34 + (139 - 34) * p.tint);
        const g = Math.round(211 + (92 - 211) * p.tint);
        const b = Math.round(255 + (246 - 255) * p.tint);
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${a * 0.9})`;
        ctx.fillRect(p.x, p.y, p.size, p.size);
      }

      if (spawned >= waves.length && particles.length === 0) return finish();
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    const failsafe = setTimeout(finish, FAILSAFE_MS); // e.g. a hidden tab pauses rAF

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(failsafe);
    };
  }, [simple, coarse]);

  return <canvas ref={canvasRef} className="dissolve" aria-hidden="true" />;
}
