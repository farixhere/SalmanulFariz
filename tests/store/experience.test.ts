import { test } from "node:test";
import assert from "node:assert/strict";
import { createExperienceStore } from "../../src/store/createExperienceStore.ts";

test("starts idle, relaxed, not entered, with no target", () => {
  const s = createExperienceStore().getState();
  assert.equal(s.phase, "idle");
  assert.equal(s.mood, "relaxed");
  assert.equal(s.entered, false);
  assert.equal(s.target, null);
});

test("explore twice fires onExplore once and leaves Nova happy and reacting", () => {
  let calls = 0;
  const store = createExperienceStore({ onExplore: () => void calls++ });
  store.getState().explore();
  store.getState().explore();
  assert.equal(calls, 1);
  assert.equal(store.getState().phase, "reacting");
  assert.equal(store.getState().mood, "happy");
});

test("explore works again after reset", () => {
  let calls = 0;
  const store = createExperienceStore({ onExplore: () => void calls++ });
  store.getState().explore();
  store.getState().reset();
  store.getState().explore();
  assert.equal(calls, 2);
});

test("hoverExplore excites Nova and relaxes her when the hover ends", () => {
  const store = createExperienceStore();
  store.getState().hoverExplore(true);
  assert.equal(store.getState().mood, "excited");
  store.getState().hoverExplore(false);
  assert.equal(store.getState().mood, "relaxed");
});

test("hover changes do not override the happy reaction mid-explore", () => {
  const store = createExperienceStore();
  store.getState().explore();
  store.getState().hoverExplore(true);
  store.getState().hoverExplore(false);
  assert.equal(store.getState().mood, "happy");
});

test("openSection records the target and reset clears it", () => {
  const store = createExperienceStore();
  store.getState().openSection("faq");
  assert.equal(store.getState().target, "faq");
  store.getState().reset();
  assert.equal(store.getState().target, null);
});

test("enter marks the experience entered and reset returns to the landing", () => {
  const store = createExperienceStore();
  store.getState().enter();
  assert.equal(store.getState().entered, true);
  store.getState().reset();
  assert.equal(store.getState().entered, false);
});

test("subscribers are notified on change, not on ignored calls, and can unsubscribe", () => {
  const store = createExperienceStore();
  let n = 0;
  const off = store.subscribe(() => void n++);
  store.getState().explore();
  assert.equal(n, 1);
  store.getState().explore(); // ignored while reacting
  assert.equal(n, 1);
  off();
  store.getState().reset();
  assert.equal(n, 1);
});

test("getState returns a stable snapshot until something changes", () => {
  const store = createExperienceStore();
  assert.equal(store.getState(), store.getState());
  const before = store.getState();
  store.getState().openSection("blog");
  assert.notEqual(store.getState(), before);
});

test("beginTransition only starts from the reacting phase", () => {
  const store = createExperienceStore();
  store.getState().beginTransition();
  assert.equal(store.getState().phase, "idle");
  store.getState().explore();
  store.getState().beginTransition();
  assert.equal(store.getState().phase, "transitioning");
});

test("while transitioning, explore and hover are ignored and Nova stays happy", () => {
  let calls = 0;
  const store = createExperienceStore({ onExplore: () => void calls++ });
  store.getState().explore();
  store.getState().beginTransition();
  store.getState().explore();
  store.getState().hoverExplore(true);
  assert.equal(calls, 1);
  assert.equal(store.getState().mood, "happy");
});

test("enter after a transition lands on State B with a calm Nova and an idle phase", () => {
  const store = createExperienceStore();
  store.getState().explore();
  store.getState().beginTransition();
  store.getState().enter();
  const s = store.getState();
  assert.equal(s.entered, true);
  assert.equal(s.phase, "idle");
  assert.equal(s.mood, "relaxed");
});

test("skip jumps straight to State B from idle or mid-reaction", () => {
  const a = createExperienceStore();
  a.getState().skip();
  assert.equal(a.getState().entered, true);
  const b = createExperienceStore();
  b.getState().explore();
  b.getState().skip();
  assert.equal(b.getState().entered, true);
  assert.equal(b.getState().phase, "idle");
});

test("reset during a transition returns to the untouched landing", () => {
  const store = createExperienceStore();
  store.getState().explore();
  store.getState().beginTransition();
  store.getState().reset();
  assert.deepEqual(
    [store.getState().phase, store.getState().entered, store.getState().mood],
    ["idle", false, "relaxed"],
  );
});
