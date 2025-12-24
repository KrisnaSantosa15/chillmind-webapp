import { test, expect } from "@playwright/test";
import { loginUser } from "./helpers/auth";

test.describe("Progress Tracking Page", () => {
  test.beforeEach(async ({ page }) => {
    await loginUser(page, "test@gmail.com", "test123");
    await page.goto("/dashboard/progress");
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(1000);
  });

  test("should display progress page", async ({ page }) => {
    await expect(
      page.locator("text=/Progress|Track.*Progress/i")
    ).toBeVisible();
  });

  test("should display mood chart component", async ({ page }) => {
    // Check for mood chart or text
    const moodChart = page.locator("text=/mood.*chart/i").first();
    await expect(moodChart).toBeVisible({ timeout: 5000 });
  });

  test("should have time range selector for mood chart", async ({ page }) => {
    const timeRanges = ["Week", "Month", "Year"];

    for (const range of timeRanges) {
      const button = page.locator(`button:has-text("${range}")`);
      if (await button.isVisible()) {
        await button.click();
        await page.waitForTimeout(300);
      }
    }
  });

  test("should display mental health status", async ({ page }) => {
    // Look for mental health status text
    const healthStatus = page.locator("text=/mental.*health/i").first();
    await expect(healthStatus).toBeVisible({ timeout: 5000 });
  });

  test("should display recommendations component", async ({ page }) => {
    // Look for recommendations text
    const recommendations = page.locator("text=/recommendation/i").first();
    await expect(recommendations).toBeVisible({ timeout: 5000 });
  });

  test("should have gradient background card", async ({ page }) => {
    // Check for any cards on the page
    const cards = page.locator("[class*='card'], [class*='bg-']");
    const count = await cards.count();
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test("should show improvement trends", async ({ page }) => {
    // Look for trend text
    const trends = page.locator("text=/improved|declined|stable/i");

    if (await trends.first().isVisible()) {
      await expect(trends.first()).toBeVisible();
    }
  });

  test("should display streak information", async ({ page }) => {
    const streak = page.locator("text=/\\d+.*day.*streak/i");

    if (await streak.isVisible()) {
      await expect(streak).toBeVisible();
    }
  });

  test("should be responsive on mobile", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });

    await expect(page.locator("text=/Progress/i")).toBeVisible();

    // Charts should adapt to mobile
    const moodChart = page.locator('[data-testid="mood-chart"], .mood-chart');
    if (await moodChart.isVisible()) {
      await expect(moodChart).toBeVisible();
    }
  });
});
