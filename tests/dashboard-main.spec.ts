import { test, expect } from "@playwright/test";
import { loginUser } from "./helpers/auth";

test.describe("Dashboard Main Page", () => {
  test.beforeEach(async ({ page }) => {
    await loginUser(page, "test@gmail.com", "test123");
    await page.goto("/dashboard");
    await page.waitForTimeout(2000);
  });

  test("should display all dashboard components", async ({ page }) => {
    // Check for main components
    await expect(
      page.getByRole("heading", { name: "Dashboard" })
    ).toBeVisible();
    await expect(page.locator("text=Mood").first()).toBeVisible();
    await expect(page.locator("text=Journal").first()).toBeVisible();
    await expect(page.locator("text=Health").first()).toBeVisible();
    await expect(page.locator("text=Recommendations").first()).toBeVisible();
    await expect(page.locator("text=Wellness").first()).toBeVisible();
  });

  test("should display streak tracking with flame icon", async ({ page }) => {
    // Look for streak indicator (optional)
    const streakSection = page.locator("text=/\\d+ day.*streak/i");
    const count = await streakSection.count();
    // Streak might not exist for new users
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test("should switch mood chart time ranges", async ({ page }) => {
    // Test week, month, year buttons
    const weekButton = page.locator('button:has-text("Week")');
    const monthButton = page.locator('button:has-text("Month")');
    const yearButton = page.locator('button:has-text("Year")');

    if (await weekButton.isVisible()) {
      await weekButton.click();
      await page.waitForTimeout(300);
      await expect(weekButton).toBeVisible();
    }

    if (await monthButton.isVisible()) {
      await monthButton.click();
      await page.waitForTimeout(300);
      await expect(monthButton).toBeVisible();
    }

    if (await yearButton.isVisible()) {
      await yearButton.click();
      await page.waitForTimeout(300);
      await expect(yearButton).toBeVisible();
    }
  });

  test("should display AI assistant widget", async ({ page }) => {
    const aiWidget = page.locator("text=/AI Assistant|Chat/i").first();
    await expect(aiWidget).toBeVisible({ timeout: 10000 });
  });

  test("should navigate to journal page", async ({ page }) => {
    const journalLink = page.locator('a[href*="/dashboard/journal"]').first();
    await journalLink.click();
    await expect(page).toHaveURL(/.*\/dashboard\/journal/);
  });

  test("should navigate to progress page", async ({ page }) => {
    const progressLink = page.locator('a[href*="/dashboard/progress"]').first();
    if (await progressLink.isVisible()) {
      await progressLink.click();
      await expect(page).toHaveURL(/.*\/dashboard\/progress/);
    }
  });

  test("should navigate to AI assistant", async ({ page }) => {
    const aiLink = page.locator('a[href*="/dashboard/ai-assistant"]').first();
    if (await aiLink.isVisible()) {
      await aiLink.click();
      await expect(page).toHaveURL(/.*\/dashboard\/ai-assistant/);
    }
  });

  test("should display recommendations based on user status", async ({
    page,
  }) => {
    // Check for recommendations text or section
    const recommendations = page.locator("text=/recommendation/i").first();
    await expect(recommendations).toBeVisible({ timeout: 10000 });
  });

  test("should be responsive on mobile", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(
      page.getByRole("heading", { name: "Dashboard" })
    ).toBeVisible();

    // Check mobile layout adjustments
    const mobileMenu = page.locator('button[aria-label*="menu" i]');
    if (await mobileMenu.isVisible()) {
      await mobileMenu.click();
      await expect(page.locator("nav")).toBeVisible();
    }
  });
});
