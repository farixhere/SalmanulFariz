import { test } from "node:test";
import assert from "node:assert/strict";
import { blinkScale, nextBlinkDelay } from "../../../src/lib/nova/blink.ts";

const close = (a: number, b: number, eps = 1e-6) =>
  assert.ok(Math.abs(a - b) <= eps, `${a} is not within ${eps} of ${b}`);

test("nextBlinkDelay spans 2.2s to 5.5s", () => {
  assert.equal(nextBlinkDelay(() => 0), 2.2);
  assert.equal(nextBlinkDelay(() => 1), 5.5);
});

test("blinkScale is fully open before and after the blink", () => {
  assert.equal(blinkScale(0), 1);
  assert.equal(blinkScale(0.16), 1);
  assert.equal(blinkScale(0.5), 1);
  assert.equal(blinkScale(-1), 1);
});

test("blinkScale is shut (0.08) at the midpoint", () => {
  close(blinkScale(0.08), 0.08);
});

test("blinkScale closes then reopens linearly", () => {
  close(blinkScale(0.04), 0.54);
  close(blinkScale(0.12), 0.54);
});

test("blinkScale treats NaN as open so a bad clock never freezes the eyes shut", () => {
  assert.equal(blinkScale(NaN), 1);
});
