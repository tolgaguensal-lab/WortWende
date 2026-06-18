import { prisma } from "../db";
import { CEFRLevel, UserRole } from "@prisma/client";

export type AccessResult = {
  allowed: boolean;
  reason: "GRANTED" | "LOCKED" | "SUBSCRIPTION_REQUIRED" | "FREE_TIER_ONLY";
  level: CEFRLevel;
};

/**
 * Professional server-side guard to check if a user has access to a specific CEFR level.
 * Logic:
 * 1. Admins always have access.
 * 2. Check if the level is designated as "Free Tier" (to be defined in curriculum standards).
 * 3. Check if the user has a specific Entitlement for this level.
 * 4. Check if the user has an active Premium Subscription.
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

    // 2. Define Free Tier Levels
    // In a production app, this would be in a config file or DB.
    // For now, PRE_A1 and part of A1 are considered "Free Entry".
    const freeTierLevels: CEFRLevel[] = ["A1"]; // Simplified: A1 is free entry.
    if (freeTierLevels.includes(level)) {
      return { allowed: true, reason: "GRANTED", level };
    }

    // 3. Check for specific Entitlement (Individual Purchase)
    const entitlement = await prisma.entitlement.findUnique({
      where: {
        userId_levelCode: {
          userId,
          levelCode: level,
        },
      },
    });

    if (entitlement) {
      if (!entitlement.expiresAt || entitlement.expiresAt > new Date()) {
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
      level 
    };
  } catch (error) {
    console.error("[ENTITLEMENT_GUARD_ERROR]:", error);
    return { allowed: false, reason: "LOCKED", level };
  }
}
