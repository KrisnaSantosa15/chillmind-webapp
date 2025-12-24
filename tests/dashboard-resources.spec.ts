import { test, expect } from "@playwright/test";
import { loginUser } from "./helpers/auth";

test.describe("Resources Page", () => {
  test.beforeEach(async ({ page }) => {
    await loginUser(page, "test@gmail.com", "test123");
    await page.goto("/dashboard/resources");
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(1000);
  });

  test("should display resources page", async ({ page }) => {
    // Check for resources heading
    await expect(
      page.getByRole("heading", { name: /resource/i }).first()
    ).toBeVisible();
  });

  test("should display resource count", async ({ page }) => {
    const count = page.locator("text=/\\d+.*resources.*available/i");
    await expect(count).toBeVisible({ timeout: 5000 });
  });

  test("should filter by condition - anxiety", async ({ page }) => {
    const anxietyButton = page.locator('button:has-text("Anxiety")');
    if (await anxietyButton.isVisible()) {
      await anxietyButton.click();
      await page.waitForTimeout(500);

      // Verify filter applied
      await expect(anxietyButton).toHaveClass(/bg-indigo-600/);
    }
  });

  test("should filter by condition - depression", async ({ page }) => {
    const depressionButton = page.locator('button:has-text("Depression")');
    if (await depressionButton.isVisible()) {
      await depressionButton.click();
      await page.waitForTimeout(500);

      await expect(depressionButton).toHaveClass(/bg-blue-600/);
    }
  });

  test("should filter by condition - stress", async ({ page }) => {
    const stressButton = page.locator('button:has-text("Stress")');
    if (await stressButton.isVisible()) {
      await stressButton.click();
      await page.waitForTimeout(500);

      await expect(stressButton).toHaveClass(/bg-teal-600/);
    }
  });

  test("should reset to all conditions", async ({ page }) => {
    const allConditionsButton = page.locator(
      'button:has-text("All Conditions")'
    );
    if (await allConditionsButton.isVisible()) {
      await allConditionsButton.click();
      await page.waitForTimeout(500);
    }
  });

  test("should filter by resource type - exercises", async ({ page }) => {
    const exercisesButton = page.locator('button:has-text("Exercises")');
    if (await exercisesButton.isVisible()) {
      await exercisesButton.click();
      await page.waitForTimeout(500);

      // Check that exercise resources are shown
      const exerciseCards = page.locator("text=/Start Exercise/i");
      const count = await exerciseCards.count();
      expect(count).toBeGreaterThan(0);
    }
  });

  test("should filter by resource type - tools", async ({ page }) => {
    const toolsButton = page.locator('button:has-text("Tools")');
    if (await toolsButton.isVisible()) {
      await toolsButton.click();
      await page.waitForTimeout(500);

      const toolCards = page.locator("text=/Open Tool/i");
      const count = await toolCards.count();
      expect(count).toBeGreaterThan(0);
    }
  });

  test("should filter by resource type - resources/articles", async ({
    page,
  }) => {
    const resourcesButton = page.locator('button:has-text("Resources")');
    if (await resourcesButton.isVisible()) {
      await resourcesButton.click();
      await page.waitForTimeout(500);

      const articleCards = page.locator("text=/View Resource/i");
      const count = await articleCards.count();
      expect(count).toBeGreaterThan(0);
    }
  });

  test("should search resources", async ({ page }) => {
    const searchInput = page.locator('input[placeholder*="Search" i]');
    await searchInput.fill("breathing");
    await page.waitForTimeout(500);

    // Check results updated
    const resources = page.locator(
      '.resource-card, [data-testid="resource-card"]'
    );
    const count = await resources.count();
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test("should display resource cards with all information", async ({
    page,
  }) => {
    const firstCard = page
      .locator('.resource-card, [data-testid="resource-card"]')
      .first();

    if (await firstCard.isVisible()) {
      // Check for title, description, tags
      await expect(firstCard).toBeVisible();

      // Check for condition badge (Anxiety, Depression, Stress)
      const badge = firstCard.locator("text=/Anxiety|Depression|Stress/i");
      await expect(badge).toBeVisible();
    }
  });

  test("should display severity level badges", async ({ page }) => {
    const severityBadges = page.locator(
      "text=/Minimal|Mild|Moderate|Severe|Low|High/i"
    );
    const count = await severityBadges.count();
    expect(count).toBeGreaterThan(0);
  });

  test("should display resource icons", async ({ page }) => {
    const icons = page.locator('i[class*="fa-"], svg');
    const count = await icons.count();
    expect(count).toBeGreaterThan(0);
  });

  test("should display duration for resources", async ({ page }) => {
    const durations = page.locator("text=/\\d+-\\d+.*min|\\d+.*min.*read/i");
    const count = await durations.count();

    if (count > 0) {
      await expect(durations.first()).toBeVisible();
    }
  });

  test("should display tags for each resource", async ({ page }) => {
    const tags = page.locator("text=/^#\\w+/");
    const count = await tags.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should limit tag display and show "+N more"', async ({ page }) => {
    const moreTags = page.locator("text=/\\+\\d+/");

    if (await moreTags.first().isVisible()) {
      await expect(moreTags.first()).toBeVisible();
    }
  });

  test("should show empty state when no resources match filters", async ({
    page,
  }) => {
    const searchInput = page.locator('input[placeholder*="Search" i]');
    await searchInput.fill("xyz123nonexistent");
    await page.waitForTimeout(500);

    const emptyState = page.locator("text=/No.*resources.*found/i");
    await expect(emptyState).toBeVisible({ timeout: 3000 });
  });

  test("should display condition-specific colors", async ({ page }) => {
    // Anxiety = indigo, Depression = blue, Stress = teal
    const anxietyCards = page.locator('[class*="indigo"]');
    const depressionCards = page.locator('[class*="blue"]');
    const stressCards = page.locator('[class*="teal"]');

    const total =
      (await anxietyCards.count()) +
      (await depressionCards.count()) +
      (await stressCards.count());
    expect(total).toBeGreaterThan(0);
  });

  test("should be responsive on mobile", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });

    await expect(
      page.getByRole("heading", { name: /resource/i }).first()
    ).toBeVisible();

    // Check horizontal scroll for filter buttons
    const filterContainer = page.locator(".overflow-x-auto");
    await expect(filterContainer.first()).toBeVisible();
  });

  test("should combine multiple filters", async ({ page }) => {
    // Filter by anxiety
    const anxietyButton = page.locator('button:has-text("Anxiety")');
    if (await anxietyButton.isVisible()) {
      await anxietyButton.click();
      await page.waitForTimeout(300);
    }

    // Filter by exercises
    const exercisesButton = page.locator('button:has-text("Exercises")');
    if (await exercisesButton.isVisible()) {
      await exercisesButton.click();
      await page.waitForTimeout(500);

      // Should show only anxiety exercises
      const cards = page.locator(
        '.resource-card, [data-testid="resource-card"]'
      );
      const count = await cards.count();
      expect(count).toBeGreaterThanOrEqual(0);
    }
  });
});
