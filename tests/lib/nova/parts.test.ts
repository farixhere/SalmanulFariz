import { test } from "node:test";
import assert from "node:assert/strict";
import { classifyPart } from "../../../src/lib/nova/parts.ts";

test("helmet shell, ears, rim and status lights belong to the head", () => {
  for (const name of [
    "Helmet outer shell",
    "Black glass face display",
    "Visor upper sheen",
    "Helmet luminous face rim",
    "Ear outer glowing disc 1",
    "Ear cyan core -1",
    "Helmet crown crest",
    "Helmet status light_1",
  ]) {
    assert.equal(classifyPart(name), "head", name);
  }
});

test("smiling eye segments on both sides belong to the eyes", () => {
  assert.equal(classifyPart("Cyan smiling eye -1_seg3"), "eyes");
  assert.equal(classifyPart("Cyan smiling eye 1_node0"), "eyes");
});

test("curved mouth pieces belong to the mouth", () => {
  assert.equal(classifyPart("Happy curved mouth_node4"), "mouth");
  assert.equal(classifyPart("Happy curved mouth_seg16"), "mouth");
});

test("the -1 suffix is the viewer's left arm (x<0) and the 1 suffix is the right arm", () => {
  assert.equal(classifyPart("Shoulder joint -1"), "armL");
  assert.equal(classifyPart("Shoulder joint 1"), "armR");
  assert.equal(classifyPart("Open palm 1"), "armR");
  assert.equal(classifyPart("Finger 1 2"), "armR");
  assert.equal(classifyPart("Fingertip -1 0"), "armL");
  assert.equal(classifyPart("Thumb tip -1"), "armL");
  assert.equal(classifyPart("Wrist cuff 1"), "armR");
});

test("shoulder light strips follow their side's arm", () => {
  assert.equal(classifyPart("Shoulder light strip -1_node0"), "armL");
  assert.equal(classifyPart("Shoulder light strip 1_seg1"), "armR");
});

test("torso, legs, feet and unknown names stay in the body", () => {
  for (const name of [
    "Chest main armor",
    "Chest emblem cyan face",
    "Neck",
    "Neck collar",
    "Backpack",
    "Foot sole -1",
    "Knee cap 1",
    "Something not in the model",
  ]) {
    assert.equal(classifyPart(name), "body", name);
  }
});
