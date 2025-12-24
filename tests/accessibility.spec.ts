import { test, expect } from "@playwright/test";

test.describe("Accessibility", () => {
  test("landing page should have proper heading hierarchy", async ({
    page,
  }) => {
    await page.goto("/");

    // Check for h1
    const h1 = page.locator("h1").first();
    await expect(h1).toBeVisible();

    // Check for multiple h2 headings
    const h2Count = await page.locator("h2").count();
    expect(h2Count).toBeGreaterThan(0);
  });

  test("images should have alt text", async ({ page }) => {
    await page.goto("/");

    // Get all images
    const images = page.locator("img");
    const count = await images.count();

    for (let i = 0; i < count; i++) {
      const img = images.nth(i);
      const alt = await img.getAttribute("alt");
      // Alt text should exist (can be empty for decorative images)
      expect(alt).not.toBeNull();
    }
  });

  test("buttons should have accessible names", async ({ page }) => {
    await page.goto("/");

    // Get all buttons
    const buttons = page.locator('button, a[role="button"]');
    const count = await buttons.count();

    for (let i = 0; i < count; i++) {
      const button = buttons.nth(i);
      const text = await button.textContent();
      const ariaLabel = await button.getAttribute("aria-label");

      // Button should have either text content or aria-label
      const hasAccessibleName = (text && text.trim().length > 0) || ariaLabel;
      expect(hasAccessibleName).toBeTruthy();
    }
  });

  test("form inputs should have labels", async ({ page }) => {
    await page.goto("/auth/login");

    // Check email input
    const emailInput = page.getByLabel(/Email/i);
    await expect(emailInput).toBeVisible();

    // Check password input
    const passwordInput = page.getByLabel(/Password/i);
    await expect(passwordInput).toBeVisible();
  });

  test("page should have proper document title", async ({ page }) => {
    await page.goto("/");

    // Check if title exists and is not empty
    const title = await page.title();
    expect(title).not.toBe("");
    expect(title.length).toBeGreaterThan(0);
  });

  test("links should have descriptive text", async ({ page }) => {
    await page.goto("/");

    // Get all links
    const links = page.locator("a");
    const count = await links.count();

    for (let i = 0; i < count; i++) {
      const link = links.nth(i);
      const text = await link.textContent();
      const ariaLabel = await link.getAttribute("aria-label");

      // Skip if it's an icon-only link with aria-label
      if (ariaLabel) continue;

      // Link should have text content
      if (text) {
        // For this test, we just ensure it has some text
        expect(text.trim().length).toBeGreaterThan(0);
      }
    }
  });

  test("keyboard navigation should work on landing page", async ({ page }) => {
    await page.goto("/");

    // Focus on the first CTA button
    const ctaButton = page
      .getByRole("link", { name: /Begin Your Journey/i })
      .first();
    await ctaButton.focus();

    // Check if the button is focused
    await expect(ctaButton).toBeFocused();

    // Press Tab to move focus
    await page.keyboard.press("Tab");

    // Something else should be focused now
    const focusedElement = page.locator(":focus");
    await expect(focusedElement).not.toHaveAttribute("href", "/onboarding");
  });
});
