import { test } from "node:test";
import assert from "node:assert/strict";
import { particleAlpha, spawnBurst, stepParticles } from "../../../src/lib/nova/particles.ts";

const seeded = (seed = 7) => () => {
  seed = (seed * 16807) % 2147483647;
  return (seed - 1) / 2147483646;
};

test("spawnBurst makes the requested number of live particles at the origin", () => {
  const ps = spawnBurst(50, 100, 200, seeded());
  assert.equal(ps.length, 50);
  for (const p of ps) {
    assert.equal(p.x, 100);
    assert.equal(p.y, 200);
    assert.ok(p.life > 0 && p.life === p.maxLife);
  }
});

test("stepParticles pushes the burst outward and removes particles whose life ran out", () => {
  const ps = spawnBurst(80, 0, 0, seeded());
  const later = stepParticles(ps, 0.2, 1.5);
  const avg = (arr: typeof ps) => arr.reduce((n, p) => n + Math.hypot(p.x, p.y), 0) / arr.length;
  assert.ok(avg(later) > 10);
  let rest = later;
  for (let i = 0; i < 60; i++) rest = stepParticles(rest, 0.05, 1.5);
  assert.equal(rest.length, 0);
});

test("stepParticles ignores bad deltas and caps a huge one (hidden tab)", () => {
  const ps = spawnBurst(10, 0, 0, seeded());
  assert.deepEqual(stepParticles(ps, NaN, 1).map((p) => [p.x, p.y]), ps.map((p) => [p.x, p.y]));
  assert.deepEqual(stepParticles(ps, -1, 1).map((p) => [p.x, p.y]), ps.map((p) => [p.x, p.y]));
  const capped = stepParticles(spawnBurst(10, 0, 0, seeded()), 5, 1);
  const normal = stepParticles(spawnBurst(10, 0, 0, seeded()), 0.05, 1);
  assert.deepEqual(capped.map((p) => [p.x, p.y]), normal.map((p) => [p.x, p.y]));
});

test("particleAlpha stays within 0..1 and is 0 for a dead particle", () => {
  const [p] = spawnBurst(1, 0, 0, seeded());
  assert.ok(particleAlpha(p) >= 0 && particleAlpha(p) <= 1);
  assert.equal(particleAlpha({ ...p, life: 0 }), 0);
  assert.equal(particleAlpha({ ...p, life: -3 }), 0);
});
