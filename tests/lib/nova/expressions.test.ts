import { test } from "node:test";
import assert from "node:assert/strict";
import { EXPRESSIONS } from "../../../src/lib/nova/expressions.ts";

test("every expression is defined with finite numbers", () => {
  for (const key of ["relaxed", "curious", "excited", "happy"] as const) {
    const e = EXPRESSIONS[key];
    assert.ok(e, key);
    for (const v of Object.values(e)) assert.ok(Number.isFinite(v), `${key}`);
  }
});

test("relaxed is the neutral baseline", () => {
  assert.equal(EXPRESSIONS.relaxed.eyeScaleY, 1);
  assert.equal(EXPRESSIONS.relaxed.eyeTilt, 0);
  assert.equal(EXPRESSIONS.relaxed.headTilt, 0);
});

test("excited glows brighter than relaxed, and curious tilts the head", () => {
  assert.ok(EXPRESSIONS.excited.eyeGlow > EXPRESSIONS.relaxed.eyeGlow);
  assert.notEqual(EXPRESSIONS.curious.headTilt, 0);
});
