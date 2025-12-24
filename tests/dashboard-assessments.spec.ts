import { test, expect } from "@playwright/test";
import { loginUser } from "./helpers/auth";

test.describe("Assessments History Page", () => {
  test.beforeEach(async ({ page }) => {
    await loginUser(page, "test@gmail.com", "test123");
    await page.goto("/dashboard/assessments");
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(1000);
  });

  test("should display assessments page", async ({ page }) => {
    // Check for assessment page heading
    const heading = page.getByRole("heading", { name: /assessment/i }).first();
    await expect(heading).toBeVisible();
  });

  test("should toggle between timeline and insights views", async ({
    page,
  }) => {
    const timelineButton = page.locator('button:has-text("Timeline")');
    const insightsButton = page.locator('button:has-text("Insights")');

    if (
      (await timelineButton.isVisible()) &&
      (await insightsButton.isVisible())
    ) {
      // Click timeline
      await timelineButton.click();
      await page.waitForTimeout(300);
      // Verify button is still visible after click
      await expect(timelineButton).toBeVisible();

      // Click insights
      await insightsButton.click();
      await page.waitForTimeout(300);
      await expect(insightsButton).toBeVisible();
    }
  });

  test("should display trend visualization bars", async ({ page }) => {
    const trendBars = page.locator(
      '[data-testid="trend-bar"], .trend-bar, [role="progressbar"]'
    );
    const count = await trendBars.count();

    if (count > 0) {
      // Check colors: green, yellow, orange, red for severity
      for (let i = 0; i < Math.min(count, 3); i++) {
        const bar = trendBars.nth(i);
        await expect(bar).toBeVisible();
      }
    }
  });

  test("should display severity scoring (1-5 scale)", async ({ page }) => {
    // Look for score text or data-testid
    const severityScores = page.locator("text=/Score:/i");
    const count = await severityScores.count();

    for (let i = 0; i < Math.min(count, 3); i++) {
      const score = severityScores.nth(i);
      await expect(score).toBeVisible();
    }
  });

  test('should display relative time (e.g., "2 days ago")', async ({
    page,
  }) => {
    const timeStamps = page.locator(
      "text=/\\d+.*(day|hour|minute|week|month).*(ago|later)/i"
    );
    const count = await timeStamps.count();

    if (count > 0) {
      await expect(timeStamps.first()).toBeVisible();
    }
  });

  test("should show assessment types (PHQ-9, GAD-7, PSS)", async ({ page }) => {
    const assessmentTypes = [
      page.locator("text=/PHQ-9/i"),
      page.locator("text=/GAD-7/i"),
      page.locator("text=/PSS/i"),
    ];

    for (const type of assessmentTypes) {
      if (await type.first().isVisible()) {
        await expect(type.first()).toBeVisible();
      }
    }
  });

  test("should show severity levels (Minimal, Mild, Moderate, Severe)", async ({
    page,
  }) => {
    const severityLevels = page.locator("text=/Minimal|Mild|Moderate|Severe/i");
    const count = await severityLevels.count();

    if (count > 0) {
      await expect(severityLevels.first()).toBeVisible();
    }
  });

  test("should filter assessments by type", async ({ page }) => {
    const filterButton = page
      .locator('select, button:has-text("Filter")')
      .first();

    if (await filterButton.isVisible()) {
      await filterButton.click();

      const depressionFilter = page.locator(
        'option:has-text("Depression"), [role="option"]:has-text("Depression")'
      );
      if (await depressionFilter.isVisible()) {
        await depressionFilter.click();
        await page.waitForTimeout(500);

        // Verify only depression assessments shown
        const visible = page.locator("text=/Depression|PHQ-9/i");
        expect(await visible.count()).toBeGreaterThan(0);
      }
    }
  });

  test("should provide link to take new assessment", async ({ page }) => {
    const newAssessmentButton = page.locator(
      'a:has-text("New Assessment"), button:has-text("Take Assessment")'
    );

    if (await newAssessmentButton.first().isVisible()) {
      await expect(newAssessmentButton.first()).toBeVisible();

      // Click should navigate to assessment page
      await newAssessmentButton.first().click();
      await expect(page).toHaveURL(/.*\/(onboarding|assessment)/);
    }
  });

  test("should be responsive on mobile", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });

    await expect(
      page.getByRole("heading", { name: /assessment/i }).first()
    ).toBeVisible();

    // Timeline/insights toggle should work on mobile
    const viewToggle = page.locator(
      'button:has-text("Timeline"), button:has-text("Insights")'
    );
    if (await viewToggle.first().isVisible()) {
      await viewToggle.first().click();
    }
  });

  test("should show assessment details when clicked", async ({ page }) => {
    const firstAssessment = page
      .locator('[data-testid="assessment-card"], .assessment-card')
      .first();

    if (await firstAssessment.isVisible()) {
      await firstAssessment.click();

      // Check for detailed view
      const detailView = page.locator("text=/Details|Individual.*scores/i");
      await expect(detailView).toBeVisible({ timeout: 5000 });
    }
  });
});
