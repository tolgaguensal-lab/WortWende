import { test, expect } from "@playwright/test";
const BASE = "http://192.168.178.91:3035";

test.describe("Quality Gate E2E", () => {
  test("[LANDING] CTA Einstufungstest klickbar", async ({ page }) => {
    await page.goto(BASE);
    const btn = page.locator("text=Einstufungstest machen").first();
    await expect(btn).toBeVisible();
    await btn.click();
    await expect(page).toHaveURL(/placement-test/);
  });
  test("[LANDING] CTA Kostenlos starten existiert", async ({ page }) => {
    await page.goto(BASE);
    await expect(page.locator("text=Kostenlos starten").first()).toBeVisible();
  });
  test("[LANDING] Nav-Anmelden funktioniert", async ({ page }) => {
    await page.goto(BASE);
    await page.click("text=Anmelden");
    await expect(page).toHaveURL(/login/);
  });
  test("[AUTH] Login ladt fehlerfrei", async ({ page }) => {
    const e: string[] = []; page.on("pageerror", err => e.push(err.message));
    await page.goto(`${BASE}/login`);
    await expect(page.locator("text=Willkommen")).toBeVisible();
    expect(e).toHaveLength(0);
  });
  test("[AUTH] Register ladt fehlerfrei", async ({ page }) => {
    const e: string[] = []; page.on("pageerror", err => e.push(err.message));
    await page.goto(`${BASE}/register`);
    await expect(page.locator("text=Konto erstellen")).toBeVisible();
    expect(e).toHaveLength(0);
  });
  test("[ONBOARDING] ladt fehlerfrei", async ({ page }) => {
    const e: string[] = []; page.on("pageerror", err => e.push(err.message));
    await page.goto(`${BASE}/onboarding`);
    await expect(page.locator("text=Willkommen bei Wortwende")).toBeVisible();
    expect(e).toHaveLength(0);
  });
  test("[PLACEMENT] ladt fehlerfrei", async ({ page }) => {
    const e: string[] = []; page.on("pageerror", err => e.push(err.message));
    await page.goto(`${BASE}/placement-test`);
    await expect(page.locator("text=Einstufungstest")).toBeVisible();
    expect(e).toHaveLength(0);
  });
  test("[PRICING] ladt fehlerfrei", async ({ page }) => {
    const e: string[] = []; page.on("pageerror", err => e.push(err.message));
    await page.goto(`${BASE}/pricing`);
    await expect(page.locator("text=Premium starten")).toBeVisible();
    expect(e).toHaveLength(0);
  });

  test.describe("Authenticated", () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`${BASE}/login`);
      await page.fill("#email", "test@user.de");
      await page.fill("#password", "test123456");
      await page.click("button[type=submit]");
      await page.waitForURL(/dashboard/, { timeout: 10000 });
    });
    test("[DASHBOARD] Kern-Elemente sichtbar", async ({ page }) => {
      await expect(page.locator("text=Willkommen")).toBeVisible();
      await expect(page.locator("text=Tagesziel")).toBeVisible();
    });
    test("[LEARN] Kurse sichtbar", async ({ page }) => {
      await page.goto(`${BASE}/learn`);
      await expect(page.locator("text=Lernpfad")).toBeVisible();
    });
    test("[VOCABULARY] keine API-Fehler", async ({ page }) => {
      const e: string[] = []; page.on("pageerror", err => e.push(err.message));
      await page.goto(`${BASE}/vocabulary`);
      expect(e.filter(x => x.includes("500") || x.includes("Select.Item"))).toHaveLength(0);
    });
    test("[GRAMMAR] keine API-Fehler", async ({ page }) => {
      const e: string[] = []; page.on("pageerror", err => e.push(err.message));
      await page.goto(`${BASE}/grammar`);
      expect(e.filter(x => x.includes("500") || x.includes("Select.Item"))).toHaveLength(0);
    });
    test("[REVIEW] ladt fehlerfrei", async ({ page }) => {
      const e: string[] = []; page.on("pageerror", err => e.push(err.message));
      await page.goto(`${BASE}/review`);
      await expect(page.locator("text=Alles geschafft")).toBeVisible();
      expect(e).toHaveLength(0);
    });
  });
  test("[MOBILE] Dashboard responsive", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto(`${BASE}/login`);
    await page.fill("#email", "test@user.de");
    await page.fill("#password", "test123456");
    await page.click("button[type=submit]");
    await page.waitForURL(/dashboard/, { timeout: 10000 });
    await expect(page.locator("text=Willkommen")).toBeVisible();
    await expect(page.locator("nav.fixed.bottom-0")).toBeVisible();
  });
  test("[LEGAL] Impressum erreichbar", async ({ page }) => {
    await page.goto(`${BASE}/impressum`);
    await expect(page).not.toHaveURL(/login/);
  });
  test("[LEGAL] Datenschutz erreichbar", async ({ page }) => {
    await page.goto(`${BASE}/datenschutz`);
    await expect(page).not.toHaveURL(/login/);
  });
});
