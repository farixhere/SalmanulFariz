/** Where Nova's face sits on screen, in NDC, for the "cursor is near Nova" check. */
export const NOVA_CENTER = { x: 0, y: 0.12 } as const;
export const NOVA_NEAR_RADIUS = 0.42;

const clampUnit = (v: number) => Math.min(1, Math.max(-1, v));

/** Converts client pixel coordinates to normalised device coordinates (-1..1, y up). */
export function toNdc(
  clientX: number,
  clientY: number,
  width: number,
  height: number,
): { x: number; y: number } {
  if (
    !Number.isFinite(clientX) ||
    !Number.isFinite(clientY) ||
    !Number.isFinite(width) ||
    !Number.isFinite(height) ||
    width <= 0 ||
    height <= 0
  ) {
    return { x: 0, y: 0 };
  }
  return {
    x: clampUnit((clientX / width) * 2 - 1),
    y: clampUnit(1 - (clientY / height) * 2),
  };
}

export function isNear(x: number, y: number, cx: number, cy: number, radius: number): boolean {
  if (![x, y, cx, cy, radius].every(Number.isFinite)) return false;
  return Math.hypot(x - cx, y - cy) <= radius;
}
