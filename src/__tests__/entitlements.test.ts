import { describe, it, expect, vi, beforeEach } from "vitest";
import { canAccessLevel, getLevelConfig, LEVEL_TIERS, getHighestPurchasedLevel } from "@/lib/auth/entitlements";
import { CEFRLevel } from "@prisma/client";

vi.mock("@/lib/db", () => ({
  prisma: {
    user: { findUnique: vi.fn() },
    entitlement: { findUnique: vi.fn(), findMany: vi.fn() },
    subscription: { findUnique: vi.fn() },
  },
}));

import { prisma } from "@/lib/db";

const mockUser = {
  id: "user-1", email: "test@test.com", name: "Test User",
  role: "USER", image: null, emailVerified: null,
  hashedPassword: null, createdAt: new Date(), updatedAt: new Date(),
};

const mockAdminUser = { ...mockUser, id: "admin-1", email: "admin@test.com", name: "Admin", role: "ADMIN" };

const futureDate = new Date();
futureDate.setFullYear(futureDate.getFullYear() + 1);

const pastDate = new Date("2024-06-01");

describe("LEVEL_TIERS", () => {
  it("A1 should be free with 10 sessions", () => {
    expect(LEVEL_TIERS["A1" as CEFRLevel]).toEqual({ free: true, sessionsPerDay: 10, price: "0 €" });
  });

  it("A2 price should be 4,99 €", () => {
    expect(LEVEL_TIERS["A2" as CEFRLevel].price).toBe("4,99 €");
  });

  it("B1 should have 200 sessions", () => {
    expect(LEVEL_TIERS["B1" as CEFRLevel].sessionsPerDay).toBe(200);
  });

  it("B2 should have 300 sessions", () => {
    expect(LEVEL_TIERS["B2" as CEFRLevel].sessionsPerDay).toBe(300);
  });

  it("C1 should have 500 sessions and cost 14,99 €", () => {
    expect(LEVEL_TIERS["C1" as CEFRLevel]).toEqual({ free: false, sessionsPerDay: 500, price: "14,99 €" });
  });

  it("getLevelConfig returns the correct config", () => {
    const cfg = getLevelConfig("B1" as CEFRLevel);
    expect(cfg).toEqual({ free: false, sessionsPerDay: 200, price: "8,99 €" });
  });
});

describe("getHighestPurchasedLevel()", () => {
  beforeEach(() => vi.clearAllMocks());

  it("should return C1 for admin users", async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue({ role: "ADMIN" } as any);
    const level = await getHighestPurchasedLevel("admin-1");
    expect(level).toBe("C1");
  });

  it("should return C1 for active subscription", async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue({ role: "USER" } as any);
    vi.mocked(prisma.subscription.findUnique).mockResolvedValue({ status: "active", endDate: futureDate } as any);
    const level = await getHighestPurchasedLevel("user-1");
    expect(level).toBe("C1");
  });

  it("should return B1 if user has B1 entitlement", async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue({ role: "USER" } as any);
    vi.mocked(prisma.subscription.findUnique).mockResolvedValue(null);
    vi.mocked(prisma.entitlement.findMany).mockResolvedValue([
      { levelCode: "A1", expiresAt: null },
      { levelCode: "B1", expiresAt: null },
    ] as any);
    const level = await getHighestPurchasedLevel("user-1");
    expect(level).toBe("B1");
  });

  it("should skip expired entitlements", async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue({ role: "USER" } as any);
    vi.mocked(prisma.subscription.findUnique).mockResolvedValue(null);
    vi.mocked(prisma.entitlement.findMany).mockResolvedValue([
      { levelCode: "B2", expiresAt: pastDate },
      { levelCode: "A2", expiresAt: null },
    ] as any);
    const level = await getHighestPurchasedLevel("user-1");
    expect(level).toBe("A2");
  });

  it("should fall back to A1 for users without entitlements", async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue({ role: "USER" } as any);
    vi.mocked(prisma.subscription.findUnique).mockResolvedValue(null);
    vi.mocked(prisma.entitlement.findMany).mockResolvedValue([]);
    const level = await getHighestPurchasedLevel("user-1");
    expect(level).toBe("A1");
  });
});

describe("canAccessLevel()", () => {
  beforeEach(() => vi.clearAllMocks());

  it("should grant access to any level for admin users", async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue(mockAdminUser as any);
    const result = await canAccessLevel("admin-1", "C1" as any);
    expect(result.allowed).toBe(true);
    expect(result.reason).toBe("GRANTED");
  });

  it("should grant access to A1 (free tier) for all users", async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue(mockUser as any);
    const result = await canAccessLevel("user-1", "A1" as any);
    expect(result.allowed).toBe(true);
  });

  it("should deny access to C1 for users without entitlements", async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue(mockUser as any);
    vi.mocked(prisma.entitlement.findMany).mockResolvedValue([]);
    vi.mocked(prisma.subscription.findUnique).mockResolvedValue(null);
    const result = await canAccessLevel("user-1", "C1" as any);
    expect(result.allowed).toBe(false);
  });

  it("should grant access to A2 if user has B1 entitlement (includes lower levels)", async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue(mockUser as any);
    vi.mocked(prisma.entitlement.findMany).mockResolvedValue([
      { levelCode: "B1", expiresAt: null },
    ] as any);
    vi.mocked(prisma.subscription.findUnique).mockResolvedValue(null);
    const result = await canAccessLevel("user-1", "A2" as any);
    expect(result.allowed).toBe(true);
  });

  it("should grant access if user has active subscription", async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue(mockUser as any);
    vi.mocked(prisma.entitlement.findMany).mockResolvedValue([]);
    vi.mocked(prisma.subscription.findUnique).mockResolvedValue({ id: "sub-1", userId: "user-1", planId: "premium_monthly", status: "active", startDate: new Date(), endDate: futureDate, revenueCatId: null, createdAt: new Date(), updatedAt: new Date() } as any);
    const result = await canAccessLevel("user-1", "C1" as any);
    expect(result.allowed).toBe(true);
  });

  it("should deny access if subscription is expired", async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue(mockUser as any);
    vi.mocked(prisma.entitlement.findMany).mockResolvedValue([]);
    vi.mocked(prisma.subscription.findUnique).mockResolvedValue({ id: "sub-exp", userId: "user-1", planId: "premium_monthly", status: "active", startDate: new Date("2024-01-01"), endDate: pastDate, revenueCatId: null, createdAt: new Date(), updatedAt: new Date() } as any);
    const result = await canAccessLevel("user-1", "C1" as any);
    expect(result.allowed).toBe(false);
  });

  it("should return LOCKED if user does not exist", async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue(null);
    const result = await canAccessLevel("ghost-user", "A1" as any);
    expect(result.allowed).toBe(false);
    expect(result.reason).toBe("LOCKED");
  });
});
