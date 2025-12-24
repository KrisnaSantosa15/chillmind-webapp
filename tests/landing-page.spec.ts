import { test, expect } from "@playwright/test";

test.describe("Landing Page", () => {
  test("should display the main heading and CTA button", async ({ page }) => {
    await page.goto("/");

    // Check if the main heading is visible
    await expect(
      page.getByRole("heading", {
        name: /Your Mental Wellness.*Journey Starts Here/i,
      })
    ).toBeVisible();

    // Check if the CTA button is visible
    const ctaButton = page
      .getByRole("link", { name: /Begin Your Journey/i })
      .first();
    await expect(ctaButton).toBeVisible();
  });

  test("should navigate to onboarding when clicking CTA", async ({ page }) => {
    await page.goto("/");

    // Click the CTA button
    const ctaButton = page
      .getByRole("link", { name: /Begin Your Journey/i })
      .first();
    await ctaButton.click();

    // Wait for navigation
    await page.waitForURL("**/onboarding");

    // Verify we're on the onboarding page
    await expect(page).toHaveURL(/.*onboarding/);
    await expect(
      page.getByRole("heading", { name: /Begin Your Wellness Journey/i })
    ).toBeVisible();
  });

  test("should display all feature sections", async ({ page }) => {
    await page.goto("/");

    // Check if features section is visible
    await expect(
      page.getByRole("heading", { name: /How.*ChillMind.*Helps You/i })
    ).toBeVisible();

    // Check for key features
    await expect(
      page.getByRole("heading", { name: "Smart Assessment" })
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Journaling with Insights" })
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Personalized Activities" })
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Progress Tracking" })
    ).toBeVisible();
  });

  test("should display statistics section", async ({ page }) => {
    await page.goto("/");

    // Check for statistics
    await expect(page.getByText("75%")).toBeVisible();
    await expect(page.getByText("85%")).toBeVisible();
    await expect(page.getByText("60%")).toBeVisible();
  });

  test("should display testimonials", async ({ page }) => {
    await page.goto("/");

    // Scroll to testimonials section
    await page
      .getByRole("heading", { name: /What.*Students.*Say/i })
      .scrollIntoViewIfNeeded();

    // Check for testimonials
    await expect(
      page.getByRole("heading", { name: /What.*Students.*Say/i })
    ).toBeVisible();
    await expect(page.getByText(/Krisna S./i)).toBeVisible();
  });

  test("should display FAQ section with accordion", async ({ page }) => {
    await page.goto("/");

    // Scroll to FAQ section
    await page
      .getByRole("heading", { name: /Frequently Asked.*Questions/i })
      .scrollIntoViewIfNeeded();

    // Check if FAQ section is visible
    await expect(
      page.getByRole("heading", { name: /Frequently Asked.*Questions/i })
    ).toBeVisible();

    // Check for FAQ items
    await expect(
      page.getByText("Is my data private and secure?")
    ).toBeVisible();
  });

  test("should be responsive on mobile", async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/");

    // Check if main elements are visible on mobile
    await expect(
      page.getByRole("heading", {
        name: /Your Mental Wellness.*Journey Starts Here/i,
      })
    ).toBeVisible();

    // Check if mobile menu or navigation is accessible
    await expect(
      page.getByRole("link", { name: /Begin Your Journey/i }).first()
    ).toBeVisible();
  });
});
