import { test, expect } from "@playwright/test";

test.describe("Onboarding Flow", () => {
  test("should display onboarding introduction page", async ({ page }) => {
    await page.goto("/onboarding");

    // Check main heading
    await expect(
      page.getByRole("heading", { name: /Begin Your Wellness Journey/i })
    ).toBeVisible();

    // Check for assessment information
    await expect(page.getByText("PHQ-9 Assessment")).toBeVisible();
    await expect(page.getByText("GAD-7 Assessment")).toBeVisible();
    await expect(page.getByText("PSS Assessment")).toBeVisible();

    // Check for Begin Assessment button
    await expect(
      page.getByRole("link", { name: /Begin Assessment/i })
    ).toBeVisible();
  });

  test("should navigate to demographics page", async ({ page }) => {
    await page.goto("/onboarding");

    // Click Begin Assessment
    await page.getByRole("link", { name: /Begin Assessment/i }).click();

    // Wait for navigation to demographics
    await page.waitForURL("**/onboarding/demographics");

    // Verify we're on demographics page
    await expect(page).toHaveURL(/.*demographics/);
    await expect(
      page.getByRole("heading", { name: /Tell Us About Yourself/i })
    ).toBeVisible();
  });

  test("should show step progress indicator", async ({ page }) => {
    await page.goto("/onboarding");

    // Check for step indicators (desktop or mobile)
    // Desktop shows full "Introduction" text, mobile may show differently
    const desktopIndicator = page.locator("text=Intro");
    const mobileIndicator = page.locator(
      '[class*="step"], .w-10.h-10.rounded-full'
    );

    // At least one type of indicator should exist
    const desktopCount = await desktopIndicator.count();
    const mobileCount = await mobileIndicator.count();

    expect(desktopCount + mobileCount).toBeGreaterThan(0);
  });

  test("should allow going back to home", async ({ page }) => {
    await page.goto("/onboarding");

    // Click Go Back button
    await page.getByRole("link", { name: /Go Back/i }).click();

    // Verify we're back on home page
    await page.waitForURL("/");
    await expect(page).toHaveURL("/");
  });
});

test.describe("Demographics Form", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/onboarding/demographics");
  });

  test("should display all form fields", async ({ page }) => {
    // Check for form field labels (they are headings/labels but not connected to inputs)
    await expect(page.getByText(/Age Group/i)).toBeVisible();
    await expect(page.getByText(/^Gender$/i)).toBeVisible();
    await expect(page.getByText(/Academic Year/i)).toBeVisible();
    await expect(page.getByText(/Current GPA/i)).toBeVisible();
    await expect(page.getByText(/waiver or scholarship/i)).toBeVisible();
  });

  test("should show validation errors when submitting empty form", async ({
    page,
  }) => {
    // Try to click Continue button without filling the form
    const continueButton = page.getByRole("button", { name: /Continue/i });
    await continueButton.click();

    // Wait a bit for validation to kick in
    await page.waitForTimeout(500);

    // Check if we're still on the demographics page (not navigated)
    await expect(page).toHaveURL(/.*demographics/);

    // Validation errors should appear
    await expect(
      page.getByText(/This field is required/i).first()
    ).toBeVisible();
  });

  test("should allow filling out the form", async ({ page }) => {
    // Fill out demographics form using radio buttons

    // Select age
    await page.locator('label[for="age-below18"]').click();
    await expect(
      page.locator('input[name="age"][value="below18"]')
    ).toBeChecked();

    // Select gender
    await page.locator('label[for="gender-male"]').click();
    await expect(
      page.locator('input[name="gender"][value="male"]')
    ).toBeChecked();

    // Select academic year
    await page.locator('label[for="academicYear-firstYear"]').click();
    await expect(
      page.locator('input[name="academicYear"][value="firstYear"]')
    ).toBeChecked();

    // Select GPA
    await page.locator('label[for="gpa-3.40-3.79"]').click();
    await expect(
      page.locator('input[name="gpa"][value="3.40-3.79"]')
    ).toBeChecked();

    // Select scholarship
    await page.locator('label[for="scholarship-true"]').click();
    await expect(
      page.locator('input[name="scholarship"][value="true"]')
    ).toBeChecked();

    // Verify Continue button is enabled
    const continueButton = page.getByRole("button", { name: /Continue/i });
    await expect(continueButton).toBeEnabled();
  });
});
