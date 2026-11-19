const MIN_DELAY = 2.2;
const MAX_DELAY = 5.5;
const BLINK_DURATION = 0.16;
const SHUT_SCALE = 0.08;

/** Seconds until the next blink. */
export function nextBlinkDelay(rand: () => number): number {
  return MIN_DELAY + rand() * (MAX_DELAY - MIN_DELAY);
}

/** Vertical eye scale `t` seconds into a blink: 1 open, 0.08 shut at the midpoint. */
export function blinkScale(t: number): number {
  if (!Number.isFinite(t) || t <= 0 || t >= BLINK_DURATION) return 1;
  const half = BLINK_DURATION / 2;
  if (t < half) return 1 - (1 - SHUT_SCALE) * (t / half);
  return SHUT_SCALE + (1 - SHUT_SCALE) * ((t - half) / half);
}
