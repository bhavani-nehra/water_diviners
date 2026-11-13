export function readoutAt(distance, h, y) {
  const depthFt = Math.round(60 + 160 * Math.min(Math.max(y / h, 0), 1));
  const tier =
    distance < 0.04 * h ? "strong" : distance < 0.12 * h ? "moderate" : "weak";
  return { depthFt, tier };
}
