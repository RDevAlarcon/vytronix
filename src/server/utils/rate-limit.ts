type Bucket = { timestamps: number[] };

const store = new Map<string, Bucket>();

export function rateLimit(key: string, windowMs: number, max: number) {
  const now = Date.now();
  const bucket = store.get(key) ?? { timestamps: [] };
  // remove old
  bucket.timestamps = bucket.timestamps.filter((t) => now - t <= windowMs);
  if (bucket.timestamps.length >= max) {
    const earliest = bucket.timestamps[0];
    const retryAfterMs = windowMs - (now - earliest);
    return { ok: false, retryAfterMs } as const;
  }
  bucket.timestamps.push(now);
  store.set(key, bucket);
  return { ok: true } as const;
}

