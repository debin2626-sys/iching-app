import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface RateLimitEntry {
  timestamps: number[];
}

interface RateLimitConfig {
  windowMs: number;
  max: number;
}

// In-memory store keyed by identifier
const store = new Map<string, RateLimitEntry>();

// Periodic cleanup to prevent memory leaks (every 5 minutes)
const CLEANUP_INTERVAL = 5 * 60 * 1000;
let lastCleanup = Date.now();

function cleanup(windowMs: number) {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL) return;
  lastCleanup = now;

  for (const [key, entry] of store) {
    entry.timestamps = entry.timestamps.filter((t) => now - t < windowMs);
    if (entry.timestamps.length === 0) {
      store.delete(key);
    }
  }
}

/**
 * Check rate limit for a given identifier.
 * Returns { limited: false, remaining } or { limited: true, retryAfter }.
 */
function checkLimit(
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

  // Sliding window: keep only timestamps within the window
  entry.timestamps = entry.timestamps.filter((t) => now - t < config.windowMs);

  if (entry.timestamps.length >= config.max) {
    const oldest = entry.timestamps[0];
    const retryAfter = Math.ceil((oldest + config.windowMs - now) / 1000);
    return { limited: true, retryAfter: Math.max(retryAfter, 1) };
  }

  entry.timestamps.push(now);
  return { limited: false, remaining: config.max - entry.timestamps.length };
}

/**
 * Check if a user has a valid (active, non-expired) subscription.
 */
export async function hasValidSubscription(userId: string): Promise<boolean> {
  const subscription = await prisma.subscription.findFirst({
    where: {
      userId,
      status: 'ACTIVE',
      endDate: { gt: new Date() },
    },
  });
  return !!subscription;
}

/**
 * Check daily divination limit for a given user.
 * Users with an active subscription bypass the daily limit.
 */
export async function checkDailyDivinationLimit(
  userId?: string | null,
  anonymousSessionId?: string | null
): Promise<boolean> {
  // Subscribed users skip the daily limit entirely
  if (userId) {
    const subscribed = await hasValidSubscription(userId);
    if (subscribed) return false;
  }

  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const where: any = {
    createdAt: { gte: startOfDay },
  };

  if (userId) {
    where.userId = userId;
  } else if (anonymousSessionId) {
    where.anonymousSessionId = anonymousSessionId;
  } else {
    return false; // Cannot limit if no identity
  }

  const DAILY_LIMIT = 3;

  const count = await prisma.divination.count({ where });
  return count >= DAILY_LIMIT;
}

/**
 * Extract client IP from request headers (works behind proxies).
 */
function getClientIp(request: NextRequest): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

// ─── Pre-configured rate limiters ───

const RATE_LIMITS = {
  /** AI interpret endpoints: strict per-user + per-IP */
  aiInterpret: {
    perUser: { windowMs: 60_000, max: 5 },
    perIp: { windowMs: 60_000, max: 10 },
  },
  /** Auth endpoints: per-IP only */
  auth: {
    perIp: { windowMs: 60_000, max: 10 },
  },
  /** Divination endpoints: per-user */
  divination: {
    perUser: { windowMs: 60_000, max: 10 },
    perIp: { windowMs: 60_000, max: 20 },
  },
  /** General API: per-IP */
  general: {
    perIp: { windowMs: 60_000, max: 60 },
  },
} as const;

/**
 * Apply rate limiting to an AI interpret request.
 * Checks both per-user and per-IP limits.
 * Returns a 429 Response if limited, or null if allowed.
 */
export function rateLimitAiInterpret(
  request: NextRequest,
  userId?: string | null
): NextResponse | null {
  const ip = getClientIp(request);

  // Per-IP check
  const ipResult = checkLimit(`ai:ip:${ip}`, RATE_LIMITS.aiInterpret.perIp);
  if (ipResult.limited) {
    return NextResponse.json(
      { error: "请求过于频繁，请稍后再试" },
      {
        status: 429,
        headers: { "Retry-After": String(ipResult.retryAfter) },
      }
    );
  }

  // Per-user check (if authenticated)
  if (userId) {
    const userResult = checkLimit(`ai:user:${userId}`, RATE_LIMITS.aiInterpret.perUser);
    if (userResult.limited) {
      return NextResponse.json(
        { error: "请求过于频繁，请稍后再试" },
        {
          status: 429,
          headers: { "Retry-After": String(userResult.retryAfter) },
        }
      );
    }
  }

  return null;
}

/**
 * Apply rate limiting to auth endpoints (login/register).
 * Per-IP only.
 */
export function rateLimitAuth(request: NextRequest): NextResponse | null {
  const ip = getClientIp(request);
  const result = checkLimit(`auth:ip:${ip}`, RATE_LIMITS.auth.perIp);
  if (result.limited) {
    return NextResponse.json(
      { error: "请求过于频繁，请稍后再试" },
      {
        status: 429,
        headers: { "Retry-After": String(result.retryAfter) },
      }
    );
  }
  return null;
}

/**
 * Apply rate limiting to divination endpoints.
 * Checks per-user and per-IP.
 */
export function rateLimitDivination(
  request: NextRequest,
  userId?: string | null
): NextResponse | null {
  const ip = getClientIp(request);

  const ipResult = checkLimit(`div:ip:${ip}`, RATE_LIMITS.divination.perIp);
  if (ipResult.limited) {
    return NextResponse.json(
      { error: "请求过于频繁，请稍后再试" },
      {
        status: 429,
        headers: { "Retry-After": String(ipResult.retryAfter) },
      }
    );
  }

  if (userId) {
    const userResult = checkLimit(`div:user:${userId}`, RATE_LIMITS.divination.perUser);
    if (userResult.limited) {
      return NextResponse.json(
        { error: "请求过于频繁，请稍后再试" },
        {
          status: 429,
          headers: { "Retry-After": String(userResult.retryAfter) },
        }
      );
    }
  }

  return null;
}

/**
 * Apply general rate limiting (per-IP).
 */
export function rateLimitGeneral(request: NextRequest): NextResponse | null {
  const ip = getClientIp(request);
  const result = checkLimit(`gen:ip:${ip}`, RATE_LIMITS.general.perIp);
  if (result.limited) {
    return NextResponse.json(
      { error: "请求过于频繁，请稍后再试" },
      {
        status: 429,
        headers: { "Retry-After": String(result.retryAfter) },
      }
    );
  }
  return null;
}
