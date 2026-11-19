import { test } from "node:test";
import assert from "node:assert/strict";
import { clamp, damp, lookTarget } from "../../../src/lib/nova/motion.ts";

const close = (a: number, b: number, eps = 1e-3) =>
  assert.ok(Math.abs(a - b) <= eps, `${a} is not within ${eps} of ${b}`);

test("damp does not move when no time has passed", () => {
  assert.equal(damp(0, 1, 8, 0), 0);
});

test("damp converges on the target given enough time", () => {
  close(damp(0, 1, 8, 10), 1);
});

test("damp covers 1-exp(-lambda*dt) of the gap", () => {
  close(damp(0, 1, 8, 0.1), 1 - Math.exp(-0.8));
});

test("damp is frame-rate independent: two half steps equal one full step", () => {
  const once = damp(0, 1, 6, 0.2);
  const twice = damp(damp(0, 1, 6, 0.1), 1, 6, 0.1);
  close(once, twice, 1e-9);
});

test("damp ignores a non-finite or negative dt instead of producing NaN", () => {
  assert.equal(damp(0.5, 1, 8, NaN), 0.5);
  assert.equal(damp(0.5, 1, 8, -1), 0.5);
});

test("clamp keeps values inside the range", () => {
  assert.equal(clamp(5, -1, 1), 1);
  assert.equal(clamp(-5, -1, 1), -1);
  assert.equal(clamp(0.25, -1, 1), 0.25);
});

test("lookTarget clamps to the maximum yaw and pitch", () => {
  assert.deepEqual(lookTarget(5, -5, 0.5, 0.3), { yaw: 0.5, pitch: -0.3 });
});

test("lookTarget: pointer right turns right (+yaw) and pointer up looks up (+pitch)", () => {
  const right = lookTarget(1, 0, 0.6, 0.4);
  const up = lookTarget(0, 1, 0.6, 0.4);
  assert.ok(right.yaw > 0 && right.pitch === 0);
  assert.ok(up.pitch > 0 && up.yaw === 0);
});

test("lookTarget scales proportionally inside the range", () => {
  const t = lookTarget(0.5, 0.5, 0.6, 0.4);
  close(t.yaw, 0.3);
  close(t.pitch, 0.2);
});

test("lookTarget returns neutral for non-finite pointer values", () => {
  assert.deepEqual(lookTarget(NaN, 0, 0.5, 0.3), { yaw: 0, pitch: 0 });
  assert.deepEqual(lookTarget(0, Infinity, 0.5, 0.3), { yaw: 0, pitch: 0 });
});
