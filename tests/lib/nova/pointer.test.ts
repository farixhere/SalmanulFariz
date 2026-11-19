import { test } from "node:test";
import assert from "node:assert/strict";
import { isNear, toNdc } from "../../../src/lib/nova/pointer.ts";

test("toNdc maps the viewport centre to (0,0)", () => {
  assert.deepEqual(toNdc(500, 400, 1000, 800), { x: 0, y: 0 });
});

test("toNdc maps top-left to (-1, 1) and bottom-right to (1, -1)", () => {
  assert.deepEqual(toNdc(0, 0, 1000, 800), { x: -1, y: 1 });
  assert.deepEqual(toNdc(1000, 800, 1000, 800), { x: 1, y: -1 });
});

test("toNdc clamps pointers outside the viewport", () => {
  assert.deepEqual(toNdc(5000, -300, 1000, 800), { x: 1, y: 1 });
});

test("toNdc returns neutral for a zero-sized viewport or non-finite input", () => {
  assert.deepEqual(toNdc(10, 10, 0, 0), { x: 0, y: 0 });
  assert.deepEqual(toNdc(NaN, 10, 1000, 800), { x: 0, y: 0 });
});

test("isNear is true inside the radius and false outside", () => {
  assert.equal(isNear(0.1, 0.1, 0, 0, 0.3), true);
  assert.equal(isNear(0.5, 0.5, 0, 0, 0.3), false);
});

test("isNear is false for non-finite values", () => {
  assert.equal(isNear(NaN, 0, 0, 0, 0.3), false);
});
