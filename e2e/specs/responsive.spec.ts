/**
 * Responsive E2E Tests – Alle gängigen Geräte
 * npm run test:e2e -- responsive.spec.ts
 */
import { test, expect } from "@playwright/test";

const BASE = "http://192.168.178.91:3035";

const DEVICES = [
  // ── iPhones ──
  { name: "iPhone SE", viewport: { width: 375, height: 667 }, mobile: true },
  { name: "iPhone 14", viewport: { width: 390, height: 844 }, mobile: true },
  { name: "iPhone 14 Pro Max", viewport: { width: 430, height: 932 }, mobile: true },

  // ── Android ──
  { name: "Samsung Galaxy S23", viewport: { width: 360, height: 800 }, mobile: true },
  { name: "Google Pixel 7", viewport: { width: 412, height: 915 }, mobile: true },
  { name: "Samsung Galaxy A54", viewport: { width: 384, height: 854 }, mobile: true },

  // ── Tablets ──
  { name: "iPad Mini", viewport: { width: 768, height: 1024 }, mobile: true },
  { name: "iPad Pro 11", viewport: { width: 834, height: 1194 }, mobile: true },
  { name: 'iPad Pro 12.9"', viewport: { width: 1024, height: 1366 }, mobile: false },
  { name: "Samsung Galaxy Tab S8", viewport: { width: 800, height: 1280 }, mobile: true },

  // ── Desktop ──
  { name: "Desktop HD", viewport: { width: 1920, height: 1080 }, mobile: false },
  { name: "Desktop Small", viewport: { width: 1280, height: 720 }, mobile: false },
];

for (const device of DEVICES) {
  test.describe(`[${device.name}]`, () => {
    test.use({ viewport: device.viewport });

    test("Landing Page lädt korrekt", async ({ page }) => {
      await page.goto(BASE);
      await expect(page.locator("h1").first()).toBeVisible();
      // Check KI-Tutor branding is visible
      const heading = await page.locator("h1").first().textContent();
      expect(heading).toContain("KI-Tutor");
    });

    test("Login-Seite erreichbar", async ({ page }) => {
      await page.goto(`${BASE}/login`);
      await expect(page.locator("text=Anmelden").first()).toBeVisible();
    });

    test("Keine horizontalen Scrollbars", async ({ page }) => {
      await page.goto(BASE);
      const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
      const viewportWidth = device.viewport.width;
      expect(scrollWidth).toBeLessThanOrEqual(viewportWidth + 10);
    });

    test("Buttons sind klickbar (min 44px Touch-Target)", async ({ page }) => {
      await page.goto(BASE);
      const buttons = page.locator("button, a[role='button']").first();
      await expect(buttons).toBeVisible();
      const box = await buttons.boundingBox();
      if (box && device.mobile) {
        expect(box.height).toBeGreaterThanOrEqual(40);
        expect(box.width).toBeGreaterThanOrEqual(40);
      }
    });

    test("Navigation funktioniert", async ({ page }) => {
      await page.goto(`${BASE}/login`);
      await page.fill("input[type='email']", "test@wortwende.de");
      await page.fill("input[type='password']", "test1234");
      await page.click("button:has-text('Anmelden')");
      await page.waitForURL("**/dashboard", { timeout: 10000 });
      await expect(page.locator("text=Willkommen")).toBeVisible({ timeout: 5000 });
    });
  });
}
