type Bucket = { timestamps: number[] };

const store = new Map<string, Bucket>();
const MAX_BUCKETS = 2000;

export function rateLimit(key: string, windowMs: number, max: number) {
  const now = Date.now();
  const bucket = store.get(key) ?? { timestamps: [] };
  bucket.timestamps = bucket.timestamps.filter((t) => now - t <= windowMs);
  if (bucket.timestamps.length >= max) {
    const earliest = bucket.timestamps[0];
    const retryAfterMs = windowMs - (now - earliest);
    return { ok: false, retryAfterMs } as const;
  }
  bucket.timestamps.push(now);
  store.set(key, bucket);
  if (store.size > MAX_BUCKETS) {
    for (const [storeKey, storeBucket] of store) {
      storeBucket.timestamps = storeBucket.timestamps.filter((t) => now - t <= windowMs);
      if (storeBucket.timestamps.length === 0) store.delete(storeKey);
      if (store.size <= MAX_BUCKETS) break;
    }
  }
  return { ok: true } as const;
}

export function getClientIp(headers: Headers) {
  return (
    headers.get("cf-connecting-ip") ||
    headers.get("x-real-ip") ||
    headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    "unknown"
  );
}

