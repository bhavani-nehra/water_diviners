export function displayProgress(real, elapsedMs, minMs) {
  const byTime = Math.min(elapsedMs / minMs, 1);
  const p = Math.min(real, byTime);
  return p >= 1 ? 100 : Math.min(99, Math.floor(p * 100));
}
