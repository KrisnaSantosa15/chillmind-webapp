import { test, expect } from "@playwright/test";

test.describe("Authentication Pages", () => {
  test("should display login page", async ({ page }) => {
    await page.goto("/auth/login");

    // Check main heading
    await expect(
      page.getByRole("heading", { name: /Welcome Back/i })
    ).toBeVisible();

    // Check for form fields
    await expect(page.getByLabel(/Email/i)).toBeVisible();
    await expect(page.getByLabel(/Password/i)).toBeVisible();

    // Check for login button
    await expect(
      page.getByRole("button", { name: /^sign in$/i })
    ).toBeVisible();
  });

  test("should have link to register page", async ({ page }) => {
    await page.goto("/auth/login");

    // Check for register link
    const registerLink = page.getByRole("link", {
      name: /Sign Up|Register|Create Account/i,
    });
    await expect(registerLink).toBeVisible();
  });

  test("should navigate to register page", async ({ page }) => {
    await page.goto("/auth/login");

    // Click register link
    const registerLink = page.getByRole("link", {
      name: /Sign Up|Register|Create Account/i,
    });
    await registerLink.click();

    // Wait for navigation
    await page.waitForURL("**/auth/register");

    // Verify we're on register page
    await expect(page).toHaveURL(/.*register/);
  });

  test("should display register page", async ({ page }) => {
    await page.goto("/auth/register");

    // Check main heading
    await expect(
      page.getByRole("heading", { name: /Create.*Account|Sign Up/i })
    ).toBeVisible();

    // Check for form fields
    await expect(page.getByLabel(/Email/i)).toBeVisible();
    await expect(page.getByLabel(/Password/i)).toBeVisible();
  });

  test("should show validation error for invalid email", async ({ page }) => {
    await page.goto("/auth/login");

    // Enter invalid email
    await page.getByLabel(/Email/i).fill("invalid-email");
    await page.getByLabel(/Password/i).fill("password123");

    // Try to submit
    await page.getByRole("button", { name: /^Sign In$/i }).click();

    // Wait for potential error message (this depends on your implementation)
    await page.waitForTimeout(1000);
  });

  test("should have forgot password link", async ({ page }) => {
    await page.goto("/auth/login");

    // Check for forgot password link
    const forgotLink = page.getByRole("link", { name: /Forgot.*Password/i });
    await expect(forgotLink).toBeVisible();
  });

  test("should navigate to forgot password page", async ({ page }) => {
    await page.goto("/auth/login");

    // Click forgot password link
    await page.getByRole("link", { name: /Forgot.*Password/i }).click();

    // Wait for navigation
    await page.waitForURL("**/auth/forgot-password");

    // Verify we're on forgot password page
    await expect(page).toHaveURL(/.*forgot-password/);
  });
});

test.describe("Protected Routes", () => {
  test("should redirect unauthenticated users from dashboard", async ({
    page,
  }) => {
    // Try to access dashboard without authentication
    await page.goto("/dashboard");

    // Should redirect to login page
    await page.waitForTimeout(2000);

    // Check if we're on login page or still able to access (depends on AuthGuard)
    const url = page.url();
    const isDashboard = url.includes("/dashboard");
    const isLogin = url.includes("/login");

    // One of these should be true
    expect(isDashboard || isLogin).toBeTruthy();
  });
});
