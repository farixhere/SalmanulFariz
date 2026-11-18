export function clamp(v: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, v));
}

/** Frame-rate independent exponential smoothing toward `target`. */
export function damp(current: number, target: number, lambda: number, dt: number): number {
  if (!Number.isFinite(dt) || dt <= 0 || !Number.isFinite(target)) return current;
  return current + (target - current) * (1 - Math.exp(-lambda * dt));
}

/**
 * Maps pointer NDC (-1..1) to look angles in radians.
 * Positive yaw = turn toward the viewer's right; positive pitch = look up.
 */
export function lookTarget(
  ndcX: number,
  ndcY: number,
  maxYaw: number,
  maxPitch: number,
): { yaw: number; pitch: number } {
  if (!Number.isFinite(ndcX) || !Number.isFinite(ndcY)) return { yaw: 0, pitch: 0 };
  return {
    yaw: clamp(ndcX, -1, 1) * maxYaw || 0,
    pitch: clamp(ndcY, -1, 1) * maxPitch || 0,
  };
}
