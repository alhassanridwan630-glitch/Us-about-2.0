// Best-effort, per-instance limiter (serverless instances don't share memory). Stops casual abuse only.
const hits = new Map<string, number[]>();
export function limited(key: string, max = 10, windowMs = 3600e3) {
  const now = Date.now(); const arr = (hits.get(key) || []).filter((t) => now - t < windowMs);
  if (arr.length >= max) { hits.set(key, arr); return true; }
  arr.push(now); hits.set(key, arr); return false;
}
