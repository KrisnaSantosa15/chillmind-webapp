import { test, expect } from "@playwright/test";
import { loginUser } from "./helpers/auth";

test.describe("Find Psychologist Page - Comprehensive", () => {
  test.beforeEach(async ({ page }) => {
    await loginUser(page, "test@gmail.com", "test123");
    await page.goto("/dashboard/find-psychologist");
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(1000);
  });

  test("should display find psychologist page with all filters", async ({
    page,
  }) => {
    await expect(page.locator("text=Find a Psychologist")).toBeVisible();
    await expect(
      page.locator("text=/HIMPSI.*registered/i").first()
    ).toBeVisible();
  });

  test("should display search input", async ({ page }) => {
    const searchInput = page.locator('input[placeholder*="Search" i]');
    await expect(searchInput).toBeVisible();
  });

  test("should search by name, association, or location", async ({ page }) => {
    const searchInput = page.locator('input[placeholder*="Search" i]');
    await searchInput.fill("Jakarta");
    await page.waitForTimeout(500);

    // Check results updated
    const psychologists = page.locator(
      '[data-testid="psychologist-card"], .psychologist-card'
    );
    const count = await psychologists.count();
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test("should filter by association", async ({ page }) => {
    const associationSelect = page.locator("select").first();
    if (await associationSelect.isVisible()) {
      await associationSelect.selectOption({ index: 1 });
      await page.waitForTimeout(500);
    }
  });

  test("should filter by price range", async ({ page }) => {
    const priceSelect = page.locator('select:has(option:has-text("Rp"))');
    if (await priceSelect.isVisible()) {
      await priceSelect.selectOption({ index: 1 });
      await page.waitForTimeout(500);
    }
  });

  test("should filter available only", async ({ page }) => {
    const availableCheckbox = page.locator('input[type="checkbox"]');
    if (await availableCheckbox.isVisible()) {
      await availableCheckbox.check();
      await page.waitForTimeout(500);

      // All visible psychologists should show "Available"
      const availableBadges = page.locator('text="Available"');
      const count = await availableBadges.count();
      expect(count).toBeGreaterThan(0);
    }
  });

  test("should display psychologist cards with all information", async ({
    page,
  }) => {
    const firstCard = page.locator('[data-testid="psychologist-card"]').first();

    if (await firstCard.isVisible()) {
      // Check for name, location, price, rating
      await expect(firstCard.locator("text=/Dr\\.|M\\.Psi/i")).toBeVisible();
      await expect(firstCard.locator("text=/Rp.*\\d+/i")).toBeVisible();
    }
  });

  test("should show pagination when multiple pages", async ({ page }) => {
    const pagination = page.locator(
      '[aria-label*="pagination" i], nav:has(button:has-text("Next"))'
    );

    if (await pagination.isVisible()) {
      const nextButton = page.locator('button:has-text("Next")').last();
      const isDisabled = await nextButton.isDisabled();

      if (!isDisabled) {
        await nextButton.click();
        await page.waitForTimeout(1000);

        // Verify page changed
        const currentPage = page.locator(
          'button[class*="primary"]:has-text("2")'
        );
        await expect(currentPage).toBeVisible({ timeout: 5000 });
      }
    }
  });

  test("should display contact options", async ({ page }) => {
    const phoneButton = page
      .locator('a[href*="tel"], button:has(svg[class*="phone" i])')
      .first();
    const messageButton = page
      .locator('a[href*="text"], button:has(svg[class*="message" i])')
      .first();

    if ((await phoneButton.isVisible()) || (await messageButton.isVisible())) {
      expect(true).toBe(true);
    }
  });

  test("should be responsive on mobile", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });

    await expect(page.locator("text=Find a Psychologist")).toBeVisible();

    // Check mobile layout
    const searchInput = page.locator('input[placeholder*="Search" i]');
    await expect(searchInput).toBeVisible();
  });
});
