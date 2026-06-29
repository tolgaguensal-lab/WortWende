import { prisma } from "../db";
import { CEFRLevel, UserRole } from "@prisma/client";

export type AccessResult = {
  allowed: boolean;
  reason: "GRANTED" | "LOCKED" | "SUBSCRIPTION_REQUIRED" | "FREE_TIER_ONLY";
  level: CEFRLevel;
};

const CEFR_ORDER: CEFRLevel[] = ["A1", "A2", "B1", "B2", "C1"];

export const LEVEL_TIERS: Record<CEFRLevel, { free: boolean; sessionsPerDay: number; price: string }> = {
  A1: { free: true, sessionsPerDay: 10, price: "0 €" },
  A2: { free: false, sessionsPerDay: 100, price: "4,99 €" },
  B1: { free: false, sessionsPerDay: 200, price: "8,99 €" },
  B2: { free: false, sessionsPerDay: 300, price: "12,99 €" },
  C1: { free: false, sessionsPerDay: 500, price: "14,99 €" },
};

export function getLevelConfig(level: CEFRLevel) {
  return LEVEL_TIERS[level];
}

function isLevelHigherOrEqual(target: CEFRLevel, owned: CEFRLevel): boolean {
  return CEFR_ORDER.indexOf(target) <= CEFR_ORDER.indexOf(owned);
}

/**
 * Find the highest CEFR level the user has purchased (or inherited).
 * Checks entitlements and active subscription. Falls back to A1 (free).
 */
export async function getHighestPurchasedLevel(userId: string): Promise<CEFRLevel> {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });

    if (!user) return "A1";
    if (user.role === UserRole.ADMIN) return "C1";

    // Active subscription grants all levels
    const sub = await prisma.subscription.findUnique({
      where: { userId },
      select: { status: true, endDate: true },
    });
    if (sub && sub.status === "active" && sub.endDate > new Date()) {
      return "C1";
    }

    // Find highest non-expired entitlement
    const entitlements = await prisma.entitlement.findMany({
      where: { userId },
      select: { levelCode: true, expiresAt: true },
    });

    let highest: CEFRLevel = "A1";
    for (const ent of entitlements) {
      if (ent.expiresAt && ent.expiresAt <= new Date()) continue;
      // ent.levelCode >= highest in CEFR order → new maximum
      if (CEFR_ORDER.indexOf(ent.levelCode) >= CEFR_ORDER.indexOf(highest)) {
        highest = ent.levelCode;
      }
    }

    return highest;
  } catch {
    return "A1";
  }
}

/**
 * Professional server-side guard to check if a user has access to a specific CEFR level.
 * Logic:
 * 1. Admins always have access.
 * 2. Check if the level is free via LEVEL_TIERS.
 * 3. Check if user has a higher-level entitlement or subscription (higher levels include lower ones).
 */
export async function canAccessLevel(userId: string, level: CEFRLevel): Promise<AccessResult> {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        profile: true,
      },
    });

    if (!user) {
      return { allowed: false, reason: "LOCKED", level };
    }

    // 1. Admins bypass all locks
    if (user.role === UserRole.ADMIN) {
      return { allowed: true, reason: "GRANTED", level };
    }

    // 2. Free tier via LEVEL_TIERS
    if (LEVEL_TIERS[level]?.free) {
      return { allowed: true, reason: "GRANTED", level };
    }

    // 3. Check if user has a sufficiently high-level entitlement (includes lower levels)
    const entitlements = await prisma.entitlement.findMany({
      where: { userId },
      select: { levelCode: true, expiresAt: true },
    });

    for (const ent of entitlements) {
      if (ent.expiresAt && ent.expiresAt <= new Date()) continue;
      if (isLevelHigherOrEqual(level, ent.levelCode)) {
        return { allowed: true, reason: "GRANTED", level };
      }
    }

    // 4. Check for active Premium Subscription
    const subscription = await prisma.subscription.findUnique({
      where: { userId },
    });

    if (subscription && subscription.status === "active" && subscription.endDate > new Date()) {
      return { allowed: true, reason: "GRANTED", level };
    }

    return {
      allowed: false,
      reason: level === "A1" ? "FREE_TIER_ONLY" : "SUBSCRIPTION_REQUIRED",
      level,
    };
  } catch (error) {
    console.error("[ENTITLEMENT_GUARD_ERROR]:", error);
    return { allowed: false, reason: "LOCKED", level };
  }
}
