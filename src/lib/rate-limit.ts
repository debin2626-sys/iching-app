import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// ─── Upstash Redis rate limiting (shared across instances) ───────────────────
// Falls back to in-memory when Upstash is not configured.

function getUpstashLimiter(windowMs: number, max: number) {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (
    !url ||
    !token ||
    url.includes("placeholder") ||
    token.includes("placeholder")
  ) {
    return null;
  }
  // Lazy import to avoid errors when env vars are missing
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { Ratelimit } = require("@upstash/ratelimit");
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { Redis } = require("@upstash/redis");
    const redis = new Redis({ url, token });
    return new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(max, `${windowMs / 1000} s`),
      analytics: false,
    });
  } catch {
    return null;
  }
}

// ─── In-memory fallback ───────────────────────────────────────────────────────

interface RateLimitEntry {
  timestamps: number[];
}

interface RateLimitConfig {
  windowMs: number;
  max: number;
}

const store = new Map<string, RateLimitEntry>();
const CLEANUP_INTERVAL = 5 * 60 * 1000;
let lastCleanup = Date.now();

function cleanup(windowMs: number) {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL) return;
  lastCleanup = now;
  for (const [key, entry] of store) {
    entry.timestamps = entry.timestamps.filter((t) => now - t < windowMs);
    if (entry.timestamps.length === 0) store.delete(key);
  }
}

function checkLimitMemory(
  identifier: string,
  config: RateLimitConfig
): { limited: false; remaining: number } | { limited: true; retryAfter: number } {
  const now = Date.now();
  cleanup(config.windowMs);
  let entry = store.get(identifier);
  if (!entry) {
    entry = { timestamps: [] };
    store.set(identifier, entry);
  }
  entry.timestamps = entry.timestamps.filter((t) => now - t < config.windowMs);
  if (entry.timestamps.length >= config.max) {
    const oldest = entry.timestamps[0];
    const retryAfter = Math.ceil((oldest + config.windowMs - now) / 1000);
    return { limited: true, retryAfter: Math.max(retryAfter, 1) };
  }
  entry.timestamps.push(now);
  return { limited: false, remaining: config.max - entry.timestamps.length };
}

// ─── Unified check (Upstash → memory fallback) ───────────────────────────────

async function checkLimit(
  identifier: string,
  config: RateLimitConfig
): Promise<{ limited: false; remaining: number } | { limited: true; retryAfter: number }> {
  const limiter = getUpstashLimiter(config.windowMs, config.max);
  if (limiter) {
    try {
      const result = await limiter.limit(identifier);
      if (!result.success) {
        const retryAfter = Math.max(
          Math.ceil((result.reset - Date.now()) / 1000),
          1
        );
        return { limited: true, retryAfter };
      }
      return { limited: false, remaining: 0 };
    } catch {
      // Upstash error — fall through to memory
    }
  }
  return checkLimitMemory(identifier, config);
}

// ─── Subscription / daily limit helpers ──────────────────────────────────────

export async function hasValidSubscription(userId: string): Promise<boolean> {
  const subscription = await prisma.subscription.findFirst({
    where: {
      userId,
      status: "ACTIVE",
      endDate: { gt: new Date() },
    },
  });
  return !!subscription;
}

export async function checkDailyDivinationLimit(
  userId?: string | null,
  anonymousSessionId?: string | null
): Promise<boolean> {
  if (userId) {
    const subscribed = await hasValidSubscription(userId);
    if (subscribed) return false;
  }

  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const where: Record<string, unknown> = { createdAt: { gte: startOfDay } };
  if (userId) {
    where.userId = userId;
  } else if (anonymousSessionId) {
    where.anonymousSessionId = anonymousSessionId;
  } else {
    return false;
  }

  const DAILY_LIMIT = 3;
  const count = await prisma.divination.count({ where });
  return count >= DAILY_LIMIT;
}

// ─── IP extraction ────────────────────────────────────────────────────────────

function getClientIp(request: NextRequest): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

// ─── Pre-configured rate limiters ────────────────────────────────────────────

const RATE_LIMITS = {
  aiInterpret: {
    perUser: { windowMs: 60_000, max: 5 },
    perIp: { windowMs: 60_000, max: 10 },
  },
  auth: {
    perIp: { windowMs: 60_000, max: 10 },
  },
  divination: {
    perUser: { windowMs: 60_000, max: 10 },
    perIp: { windowMs: 60_000, max: 20 },
  },
  general: {
    perIp: { windowMs: 60_000, max: 60 },
  },
} as const;

function limitedResponse(retryAfter: number): NextResponse {
  return NextResponse.json(
    { error: "请求过于频繁，请稍后再试" },
    { status: 429, headers: { "Retry-After": String(retryAfter) } }
  );
}

export async function rateLimitAiInterpret(
  request: NextRequest,
  userId?: string | null
): Promise<NextResponse | null> {
  const ip = getClientIp(request);
  const ipResult = await checkLimit(`ai:ip:${ip}`, RATE_LIMITS.aiInterpret.perIp);
  if (ipResult.limited) return limitedResponse(ipResult.retryAfter);
  if (userId) {
    const userResult = await checkLimit(`ai:user:${userId}`, RATE_LIMITS.aiInterpret.perUser);
    if (userResult.limited) return limitedResponse(userResult.retryAfter);
  }
  return null;
}

export async function rateLimitAuth(request: NextRequest): Promise<NextResponse | null> {
  const ip = getClientIp(request);
  const result = await checkLimit(`auth:ip:${ip}`, RATE_LIMITS.auth.perIp);
  if (result.limited) return limitedResponse(result.retryAfter);
  return null;
}

export async function rateLimitDivination(
  request: NextRequest,
  userId?: string | null
): Promise<NextResponse | null> {
  const ip = getClientIp(request);
  const ipResult = await checkLimit(`div:ip:${ip}`, RATE_LIMITS.divination.perIp);
  if (ipResult.limited) return limitedResponse(ipResult.retryAfter);
  if (userId) {
    const userResult = await checkLimit(`div:user:${userId}`, RATE_LIMITS.divination.perUser);
    if (userResult.limited) return limitedResponse(userResult.retryAfter);
  }
  return null;
}

export async function rateLimitGeneral(request: NextRequest): Promise<NextResponse | null> {
  const ip = getClientIp(request);
  const result = await checkLimit(`gen:ip:${ip}`, RATE_LIMITS.general.perIp);
  if (result.limited) return limitedResponse(result.retryAfter);
  return null;
}
