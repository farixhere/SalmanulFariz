export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  /** Seconds left; the particle is removed at 0. */
  life: number;
  maxLife: number;
  size: number;
  /** 0 = cyan, 1 = violet; blended by the renderer. */
  tint: number;
}

const MAX_DT = 0.05;

/** A radial burst of `count` particles from (cx, cy), in pixels. `rand` returns [0, 1). */
export function spawnBurst(count: number, cx: number, cy: number, rand: () => number): Particle[] {
  const out: Particle[] = [];
  for (let i = 0; i < count; i++) {
    const angle = rand() * Math.PI * 2;
    const speed = 90 + rand() * 520;
    const life = 0.9 + rand() * 0.7;
    out.push({
      x: cx,
      y: cy,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life,
      maxLife: life,
      size: 1 + rand() * 2.4,
      tint: rand(),
    });
  }
  return out;
}

/** Advances the burst by `dt` seconds with a sideways swirl; returns the survivors. Bad deltas change nothing. */
export function stepParticles(particles: Particle[], dt: number, swirl: number): Particle[] {
  if (!Number.isFinite(dt) || dt <= 0) return particles;
  const d = Math.min(dt, MAX_DT);
  const next: Particle[] = [];
  for (const p of particles) {
    const life = p.life - d;
    if (life <= 0) continue;
    // sideways pull (perpendicular to velocity) makes the burst curl like a vortex
    const vx = p.vx - p.vy * swirl * d;
    const vy = p.vy + p.vx * swirl * d;
    next.push({ ...p, x: p.x + vx * d, y: p.y + vy * d, vx: vx * 0.992, vy: vy * 0.992, life });
  }
  return next;
}

export function particleAlpha(p: Particle): number {
  if (!(p.life > 0) || !(p.maxLife > 0)) return 0;
  return Math.max(0, Math.min(1, p.life / p.maxLife));
}
