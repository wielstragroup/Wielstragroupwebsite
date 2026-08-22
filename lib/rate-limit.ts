/**
 * Eenvoudige in-memory rate limiter.
 *
 * Let op: dit werkt per server-instantie. Op Vercel met meerdere
 * lambda-instanties is dit dus geen harde garantie, maar het stopt
 * wel de meest voorkomende bulk-spam. Voor een harde limiet is een
 * gedeelde store (Upstash/Redis) of Supabase-tabel nodig.
 */

type Bucket = {
  count: number;
  resetAt: number;
};

const buckets = new Map<string, Bucket>();

/** Ruim verlopen buckets op zodat de map niet oneindig groeit. */
function sweep(now: number) {
  if (buckets.size < 500) {
    return;
  }

  for (const [key, bucket] of buckets) {
    if (bucket.resetAt <= now) {
      buckets.delete(key);
    }
  }
}

export type RateLimitResult = {
  allowed: boolean;
  remaining: number;
  retryAfterSeconds: number;
};

/**
 * Registreert een poging en geeft terug of die toegestaan is.
 *
 * @param key       Unieke sleutel, bijvoorbeeld "contact:<ip>"
 * @param limit     Maximaal aantal pogingen binnen het venster
 * @param windowMs  Venster in milliseconden
 */
export function checkRateLimit(
  key: string,
  limit: number,
  windowMs: number,
): RateLimitResult {
  const now = Date.now();
  sweep(now);

  const existing = buckets.get(key);

  if (!existing || existing.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: limit - 1, retryAfterSeconds: 0 };
  }

  if (existing.count >= limit) {
    return {
      allowed: false,
      remaining: 0,
      retryAfterSeconds: Math.ceil((existing.resetAt - now) / 1000),
    };
  }

  existing.count += 1;

  return {
    allowed: true,
    remaining: limit - existing.count,
    retryAfterSeconds: 0,
  };
}
