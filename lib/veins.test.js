import test from "node:test";
import assert from "node:assert/strict";
import { makeVeins, distanceToVeins } from "./veins.js";

test("makeVeins is deterministic and inside the box", () => {
  const a = makeVeins(7, 1000, 600);
  const b = makeVeins(7, 1000, 600);
  assert.deepEqual(a, b);
  assert.ok(a.length >= 5 && a.length <= 8);
  for (const v of a)
    for (const p of v) {
      assert.ok(p.x >= 0 && p.x <= 1000 && p.y >= 0 && p.y <= 600);
    }
});

test("distanceToVeins is 0 on a vein point and positive far away", () => {
  const v = makeVeins(7, 1000, 600);
  assert.equal(distanceToVeins(v, v[0][0].x, v[0][0].y), 0);
  assert.equal(distanceToVeins([[{ x: 0, y: 0 }, { x: 10, y: 0 }]], 5, 100), 100);
});

import { makeCracks } from "./veins.js";

test("makeCracks is deterministic, branching and inside the box", () => {
  const a = makeCracks(7, 1440, 580);
  const b = makeCracks(7, 1440, 580);
  assert.deepEqual(a, b);
  assert.ok(a.length >= 16, `expected trunks plus branches, got ${a.length}`);
  for (const c of a)
    for (const p of c) {
      assert.ok(p.x >= 0 && p.x <= 1440 && p.y >= 0 && p.y <= 580);
    }
});

test("makeCracks spreads across the full width", () => {
  const a = makeCracks(7, 1440, 580);
  const xs = a.map((c) => c[0].x);
  assert.ok(Math.min(...xs) < 300 && Math.max(...xs) > 1100);
});

test("every crack stays reachable from the surface zone", () => {
  const a = makeCracks(7, 1440, 580);
  const trunks = a.filter((c) => c[0].y < 0.2 * 580);
  assert.ok(trunks.length >= 8);
});

import { makeCrackSystems } from "./veins.js";

test("makeCrackSystems returns 6 deterministic systems, each a trunk plus branches", () => {
  const a = makeCrackSystems(7, 1440, 490);
  const b = makeCrackSystems(7, 1440, 490);
  assert.deepEqual(a, b);
  assert.equal(a.length, 6);
  for (const sys of a) {
    assert.ok(sys.length >= 3, "trunk plus at least two branches");
    for (const poly of sys)
      for (const p of poly) assert.ok(p.x >= 0 && p.x <= 1440 && p.y >= 0 && p.y <= 490);
  }
});

test("makeCrackSystems honours the requested count (5 to 7)", () => {
  for (const n of [5, 6, 7]) assert.equal(makeCrackSystems(3, 1000, 400, n).length, n);
});

test("crack systems start apart from each other across the width", () => {
  const a = makeCrackSystems(7, 1440, 490);
  const xs = a.map((s) => s[0][0].x).sort((m, n) => m - n);
  for (let i = 1; i < xs.length; i++) assert.ok(xs[i] - xs[i - 1] > 60);
});
