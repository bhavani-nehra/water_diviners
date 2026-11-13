function rng(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function makeVeins(seed, w, h) {
  const r = rng(seed);
  const n = 5 + Math.floor(r() * 4);
  const veins = [];
  for (let i = 0; i < n; i++) {
    let x = r() * w;
    let y = h * (0.25 + r() * 0.1);
    let ang = Math.PI / 2 + (r() - 0.5) * 1.2;
    const pts = [{ x, y }];
    while (y < h * 0.98) {
      ang += (r() - 0.5) * 0.7;
      ang = Math.min(Math.max(ang, 0.5), Math.PI - 0.5);
      x += Math.cos(ang) * 28;
      y += Math.sin(ang) * 28;
      x = Math.min(Math.max(x, 0), w);
      y = Math.min(y, h);
      pts.push({ x, y });
    }
    veins.push(pts);
  }
  return veins;
}

const segDist = (px, py, a, b) => {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const l2 = dx * dx + dy * dy;
  const t = l2
    ? Math.max(0, Math.min(1, ((px - a.x) * dx + (py - a.y) * dy) / l2))
    : 0;
  return Math.hypot(px - (a.x + t * dx), py - (a.y + t * dy));
};

export function distanceToVeins(veins, x, y) {
  let best = Infinity;
  for (const v of veins)
    for (let i = 1; i < v.length; i++)
      best = Math.min(best, segDist(x, y, v[i - 1], v[i]));
  return best;
}

// Fracture network: jagged trunks from the surface zone with side branches, lightning-like.
// Used for both the always-faint cracks and the veins the scanner lights up.
export function makeCracks(seed, w, h) {
  const r = rng(seed + 101);
  const clamp = (v, lo, hi) => Math.min(Math.max(v, lo), hi);
  const trunks = Math.max(8, Math.round(w / 130));
  const out = [];
  for (let i = 0; i < trunks; i++) {
    let x = ((i + 0.15 + r() * 0.7) / trunks) * w;
    let y = h * (0.02 + r() * 0.1);
    let ang = Math.PI / 2 + (r() - 0.5) * 0.5;
    const pts = [{ x, y }];
    const angs = [ang];
    while (y < h * 0.97) {
      ang += (r() - 0.5) * 1.1;
      ang = clamp(ang, 0.75, Math.PI - 0.75);
      x = clamp(x + Math.cos(ang) * 20, 0, w);
      y = Math.min(y + Math.sin(ang) * 20, h);
      pts.push({ x, y });
      angs.push(ang);
    }
    out.push(pts);
    for (let k = 3; k < pts.length - 2; k++) {
      if (r() > 0.2) continue;
      const side = r() < 0.5 ? -1 : 1;
      let a = angs[k] + side * (0.55 + r() * 0.6);
      let bx = pts[k].x;
      let by = pts[k].y;
      const len = 3 + Math.floor(r() * 6);
      const br = [{ x: bx, y: by }];
      for (let s = 0; s < len; s++) {
        a += (r() - 0.5) * 1.3;
        a = clamp(a, 0.2, Math.PI - 0.2);
        bx = clamp(bx + Math.cos(a) * 16, 0, w);
        by = Math.min(by + Math.sin(a) * 16, h);
        br.push({ x: bx, y: by });
      }
      out.push(br);
    }
  }
  return out;
}

// Five to seven crack systems (one trunk plus its branches each), so the scanner can light a whole
// system at once when the pointer comes near any part of it.
export function makeCrackSystems(seed, w, h, count = 6) {
  const r = rng(seed + 303);
  const clamp = (v, lo, hi) => Math.min(Math.max(v, lo), hi);
  const systems = [];
  for (let i = 0; i < count; i++) {
    let x = ((i + 0.2 + r() * 0.6) / count) * w;
    let y = h * (0.02 + r() * 0.05);
    let ang = Math.PI / 2 + (r() - 0.5) * 0.5;
    const trunk = [{ x, y }];
    const angs = [ang];
    while (y < h * 0.97) {
      ang += (r() - 0.5) * 1.0;
      ang = clamp(ang, 0.8, Math.PI - 0.8);
      x = clamp(x + Math.cos(ang) * 18, 0, w);
      y = Math.min(y + Math.sin(ang) * 18, h);
      trunk.push({ x, y });
      angs.push(ang);
    }
    const sys = [trunk];
    for (let k = 3; k < trunk.length - 2; k++) {
      if (r() > 0.3) continue;
      const side = r() < 0.5 ? -1 : 1;
      let a = angs[k] + side * (0.5 + r() * 0.7);
      let bx = trunk[k].x;
      let by = trunk[k].y;
      const len = 4 + Math.floor(r() * 6);
      const br = [{ x: bx, y: by }];
      for (let s = 0; s < len; s++) {
        a += (r() - 0.5) * 1.3;
        a = clamp(a, 0.2, Math.PI - 0.2);
        bx = clamp(bx + Math.cos(a) * 15, 0, w);
        by = Math.min(by + Math.sin(a) * 15, h);
        br.push({ x: bx, y: by });
      }
      sys.push(br);
    }
    systems.push(sys);
  }
  return systems;
}
