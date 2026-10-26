import { createHmac } from "node:crypto";
import { neon } from "@neondatabase/serverless";

type RateLimitOptions = {
  request: Request;
  namespace: string;
  limit: number;
  windowSeconds: number;
};

/** Persistent fixed-window limiter. Only keyed IP hashes are stored. */
export async function enforceRateLimit({
  request,
  namespace,
  limit,
  windowSeconds,
}: RateLimitOptions): Promise<boolean> {
  const databaseUrl = process.env.DATABASE_URL;
  const secret = process.env.AUTH_SECRET || databaseUrl;
  if (!databaseUrl || !secret) throw new Error("Rate limiting is not configured.");

  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const clientIp = request.headers.get("x-real-ip")?.trim() || forwarded;
  if (!clientIp) throw new Error("Client IP is unavailable.");

  const key = createHmac("sha256", secret).update(`${namespace}:${clientIp}`).digest("hex");
  const sql = neon(databaseUrl);
  await sql`CREATE TABLE IF NOT EXISTS portfolio_rate_limits (
    rate_key VARCHAR(64) PRIMARY KEY,
    window_started_at TIMESTAMPTZ NOT NULL,
    request_count INTEGER NOT NULL
  )`;
  const rows = await sql`
    INSERT INTO portfolio_rate_limits (rate_key, window_started_at, request_count)
    VALUES (${key}, NOW(), 1)
    ON CONFLICT (rate_key) DO UPDATE SET
      request_count = CASE
        WHEN portfolio_rate_limits.window_started_at <= NOW() - (${windowSeconds} * INTERVAL '1 second') THEN 1
        ELSE portfolio_rate_limits.request_count + 1
      END,
      window_started_at = CASE
        WHEN portfolio_rate_limits.window_started_at <= NOW() - (${windowSeconds} * INTERVAL '1 second') THEN NOW()
        ELSE portfolio_rate_limits.window_started_at
      END
    RETURNING request_count
  `;
  return Number(rows[0]?.request_count ?? limit + 1) > limit;
}
