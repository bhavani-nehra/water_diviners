import test from "node:test";
import assert from "node:assert/strict";
import { displayProgress } from "./loaderProgress.js";

test("never hits 100 before min time", () => {
  assert.ok(displayProgress(1, 500, 3000) < 100);
  assert.equal(displayProgress(1, 3000, 3000), 100);
});
test("never hits 100 before real load finishes", () => {
  assert.ok(displayProgress(0.5, 9000, 3000) < 100);
});
test("monotonic", () => {
  let prev = 0;
  for (let t = 0; t <= 4000; t += 100) {
    const p = displayProgress(Math.min(1, t / 2500), t, 3000);
    assert.ok(p >= prev);
    prev = p;
  }
});
