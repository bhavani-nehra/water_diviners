import test from "node:test";
import assert from "node:assert/strict";
import { readoutAt } from "./readout.js";

test("deeper click gives deeper reading, within 60-220 ft", () => {
  const top = readoutAt(0, 600, 0);
  const bottom = readoutAt(0, 600, 600);
  assert.ok(top.depthFt >= 60 && bottom.depthFt <= 220);
  assert.ok(bottom.depthFt > top.depthFt);
});

test("tier follows distance", () => {
  assert.equal(readoutAt(0, 600, 300).tier, "strong");
  assert.equal(readoutAt(40, 600, 300).tier, "moderate");
  assert.equal(readoutAt(300, 600, 300).tier, "weak");
});
