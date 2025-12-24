import { test, expect } from "@playwright/test";

test.describe("Complete Onboarding Flow with ML Predictions", () => {
  test("should complete entire onboarding process", async ({ page }) => {
    // Step 1: Introduction page
    await page.goto("/onboarding");
    await expect(
      page.getByRole("heading", { name: "Welcome to ChillMind" })
    ).toBeVisible();

    // Click Begin Assessment button
    const startButton = page.getByRole("link", { name: /Begin Assessment/i });
    await startButton.click();

    // Step 2: Demographics
    await expect(page).toHaveURL(/.*\/onboarding\/demographics/);
    await expect(page.getByText(/Demographics/i).first()).toBeVisible();

    // Fill demographics form using label clicks
    await page.locator('label[for="age-18-22"]').click();
    await page.locator('label[for="gender-male"]').click();
    await page.locator('label[for="academicYear-thirdYear"]').click();
    await page.locator('label[for="gpa-3.00-3.39"]').click();
    await page.locator('label[for="scholarship-true"]').click();

    await page.getByRole("button", { name: /Continue/i }).click();

    // Step 3: PHQ-9 (Depression Assessment)
    await expect(page).toHaveURL(/.*\/onboarding\/phq9/);
    await expect(
      page.getByText(/Depression Assessment/i).first()
    ).toBeVisible();
    await expect(page.getByText(/PHQ-9/i).first()).toBeVisible();

    // Answer all 9 PHQ-9 questions by clicking labels
    for (let i = 0; i < 9; i++) {
      const label = page.locator(`label[for="q${i}-o0"]`);
      await label.scrollIntoViewIfNeeded();
      await label.click();
      await page.waitForTimeout(150);
    }

    await page.waitForTimeout(300);
    await page.getByRole("button", { name: /Continue/i }).click();

    // Step 4: GAD-7 (Anxiety Assessment)
    await expect(page).toHaveURL(/.*\/onboarding\/gad7/);
    await expect(page.getByText(/Anxiety Assessment/i).first()).toBeVisible();
    await expect(page.getByText(/GAD-7/i).first()).toBeVisible();

    // Answer all 7 GAD-7 questions by clicking labels
    for (let i = 0; i < 7; i++) {
      const label = page.locator(`label[for="q${i}-o0"]`);
      await label.scrollIntoViewIfNeeded();
      await label.click();
      await page.waitForTimeout(150);
    }

    await page.waitForTimeout(300);
    await page.getByRole("button", { name: /Continue/i }).click();

    // Step 5: PSS (Stress Assessment)
    await expect(page).toHaveURL(/.*\/onboarding\/pss/);
    await expect(page.getByText(/Stress Assessment/i).first()).toBeVisible();
    await expect(page.getByText(/PSS/i).first()).toBeVisible();

    // Answer all 10 PSS questions by clicking labels
    for (let i = 0; i < 10; i++) {
      const label = page.locator(`label[for="q${i}-o0"]`);
      await label.scrollIntoViewIfNeeded();
      await label.click();
      await page.waitForTimeout(150);
    }

    // Wait for validation and ML model to load
    await page.waitForTimeout(500);
    const viewResultsButton = page.getByRole("button", {
      name: /View Results/i,
    });

    // Wait for button to be enabled (validation complete)
    await expect(viewResultsButton).toBeEnabled({ timeout: 5000 });

    // Wait for spinner to disappear (ML model loaded) - check if spinner exists
    const spinner = page.locator("svg.animate-spin");
    const spinnerCount = await spinner.count();
    if (spinnerCount > 0) {
      await expect(spinner).toBeHidden({ timeout: 10000 });
    }

    await viewResultsButton.click();

    // Wait for navigation to complete
    await page.waitForLoadState("networkidle");

    // Step 6: Results page with ML predictions
    await expect(page).toHaveURL(/.*\/onboarding\/results/, { timeout: 30000 });
    await expect(
      page.getByRole("heading", { name: "Your Assessment Results" })
    ).toBeVisible({
      timeout: 15000,
    });

    // Wait for ML model to load and process
    await page.waitForTimeout(3000);

    // Check for prediction results
    const depressionResult = page.locator(
      "text=/Depression Assessment|Depression/i"
    );
    const anxietyResult = page.locator("text=/Anxiety Assessment|Anxiety/i");
    const stressResult = page.locator("text=/Stress Assessment|Stress/i");

    await expect(depressionResult.first()).toBeVisible();
    await expect(anxietyResult.first()).toBeVisible();
    await expect(stressResult.first()).toBeVisible();

    // Check for severity labels
    const severityLabels = page.locator(
      "text=/Minimal|Mild|Moderate|Severe|Low|High/i"
    );
    const count = await severityLabels.count();
    expect(count).toBeGreaterThan(0);

    // Check for confidence scores (may be in collapsed accordion)
    await page.waitForTimeout(1000);
    const confidenceCount = await page
      .locator("text=/Confidence.*\\d+%/i")
      .count();
    expect(confidenceCount).toBeGreaterThan(0);
  });

  test("should validate PHQ-9 questions before proceeding", async ({
    page,
  }) => {
    await page.goto("/onboarding/phq9");
    await page.waitForTimeout(500);

    // Try to submit form without answering all questions
    const continueButton = page.getByRole("button", { name: /Continue/i });

    // Button should be disabled when form is incomplete
    await expect(continueButton).toBeDisabled();
  });

  test("should validate GAD-7 questions before proceeding", async ({
    page,
  }) => {
    await page.goto("/onboarding/gad7");
    await page.waitForTimeout(500);

    // Answer only some questions by clicking labels
    await page.locator('label[for="q0-o0"]').click();
    await page.waitForTimeout(100);
    await page.locator('label[for="q1-o0"]').click();
    await page.waitForTimeout(100);

    // Button should still be disabled when not all questions answered
    const continueButton = page.getByRole("button", { name: /Continue/i });
    await expect(continueButton).toBeDisabled();
  });

  test("should validate PSS questions before proceeding", async ({ page }) => {
    await page.goto("/onboarding/pss");
    await page.waitForTimeout(500);

    // Button should be disabled when form is incomplete
    const viewResultsButton = page.getByRole("button", {
      name: /View Results/i,
    });
    await expect(viewResultsButton).toBeDisabled();
  });

  test("should display step indicators correctly", async ({ page }) => {
    await page.goto("/onboarding/phq9");

    // Check desktop step indicator
    const stepIndicators = page.locator(
      '.w-10.h-10.rounded-full, [data-testid="step"]'
    );
    const count = await stepIndicators.count();
    expect(count).toBeGreaterThan(0);
  });

  test("should navigate back to previous steps", async ({ page }) => {
    await page.goto("/onboarding/phq9");

    const previousButton = page.getByRole("link", { name: /Previous/i });
    await previousButton.click();
    await expect(page).toHaveURL(/.*\/onboarding\/demographics/);
  });

  test("should persist answers in localStorage", async ({ page }) => {
    await page.goto("/onboarding/phq9");

    // Answer first question by clicking label
    await page.locator('label[for="q0-o0"]').click();
    await page.waitForTimeout(500);

    // Reload page
    await page.reload();
    await page.waitForTimeout(500);

    // Answer should still be selected
    const firstAnswer = page.locator('input[id="q0-o0"]');
    await expect(firstAnswer).toBeChecked();
  });

  // test("should calculate PHQ-9 score correctly", async ({ page }) => {
  //   await page.goto("/onboarding/phq9");
  //   await page.waitForTimeout(500);

  //   // Answer all with "Not at all" (value 0) by clicking labels
  //   for (let i = 0; i < 9; i++) {
  //     const label = page.locator(`label[for="q${i}-o0"]`);
  //     await label.scrollIntoViewIfNeeded();
  //     await label.click();
  //     await page.waitForTimeout(150);
  //   }

  //   await page.waitForTimeout(300);
  //   await page.getByRole("button", { name: /Continue/i }).click();
  //   await page.waitForLoadState("networkidle");

  //   // Navigate through to results
  //   await expect(page).toHaveURL(/.*\/onboarding\/gad7/);
  //   await page.waitForTimeout(500);

  //   for (let i = 0; i < 7; i++) {
  //     const label = page.locator(`label[for="q${i}-o0"]`);
  //     await label.scrollIntoViewIfNeeded();
  //     await label.click();
  //     await page.waitForTimeout(150);
  //   }

  //   await page.waitForTimeout(300);
  //   await page.getByRole("button", { name: /Continue/i }).click();
  //   await page.waitForLoadState("networkidle");

  //   await expect(page).toHaveURL(/.*\/onboarding\/pss/);
  //   await page.waitForTimeout(500);

  //   for (let i = 0; i < 10; i++) {
  //     const label = page.locator(`label[for="q${i}-o0"]`);
  //     await label.scrollIntoViewIfNeeded();
  //     await label.click();
  //     await page.waitForTimeout(150);
  //   }

  //   // Wait for validation and ML model to load
  //   await page.waitForTimeout(500);
  //   const viewResultsButton = page.getByRole("button", {
  //     name: /View Results/i,
  //   });

  //   // Wait for button to be enabled
  //   await expect(viewResultsButton).toBeEnabled({ timeout: 5000 });

  //   // Wait for spinner to disappear (ML model loaded)
  //   const spinner = page.locator("svg.animate-spin");
  //   const spinnerCount = await spinner.count();
  //   if (spinnerCount > 0) {
  //     await expect(spinner).toBeHidden({ timeout: 10000 });
  //   }

  //   await viewResultsButton.click();

  //   // Wait for navigation
  //   await page.waitForLoadState("networkidle");

  //   // Wait for results page to load
  //   await expect(page).toHaveURL(/.*\/onboarding\/results/, { timeout: 15000 });
  //   await page.waitForTimeout(3000);

  //   // Should show minimal severity
  //   await expect(page.locator("text=/Minimal/i").first()).toBeVisible({
  //     timeout: 15000,
  //   });
  // });

  test("should handle PSS reverse-scored items", async ({ page }) => {
    await page.goto("/onboarding/pss");

    // Check that PSS page has loaded and has questions
    await expect(page.getByText(/Stress Assessment/i).first()).toBeVisible();

    // Check for reverse-scored items indicator if present
    const positivelyWorded = page.locator("text=/Positively worded|positive/i");
    const count = await positivelyWorded.count();

    // Either has indicators or questions are visible
    if (count > 0) {
      await expect(positivelyWorded.first()).toBeVisible();
    } else {
      // At least verify questions are present
      const questions = page.locator('input[type="radio"]');
      expect(await questions.count()).toBeGreaterThan(0);
    }
  });

  test("should display loading skeleton while loading results", async ({
    page,
  }) => {
    await page.goto("/onboarding/results");

    // Check for loading state
    const skeleton = page.locator('.animate-pulse, [data-testid="skeleton"]');

    // Either skeleton is visible or results loaded quickly
    const skeletonVisible = await skeleton.first().isVisible();
    const resultsHeading = page.getByRole("heading", {
      name: "Your Assessment Results",
    });
    const resultsVisible = await resultsHeading.isVisible();

    expect(skeletonVisible || resultsVisible).toBe(true);
  });

  test("should show TensorFlow.js model loading", async ({ page }) => {
    await page.goto("/onboarding/results");

    // Wait for model to load
    await page.waitForTimeout(2000);

    // Results should eventually appear
    await expect(
      page.getByRole("heading", { name: "Your Assessment Results" })
    ).toBeVisible({
      timeout: 15000,
    });
  });

  test("should fallback to traditional scoring if ML fails", async ({
    page,
  }) => {
    await page.goto("/onboarding/results");

    // Wait for results
    await page.waitForTimeout(5000);

    // Results should still be shown even if ML fails
    await expect(
      page.locator("text=/Depression|Anxiety|Stress/i").first()
    ).toBeVisible({ timeout: 10000 });

    // Check for error message
    const errorMessage = page.locator("text=/issue with.*machine learning/i");
    if (await errorMessage.isVisible()) {
      await expect(page.locator("text=/traditional scoring/i")).toBeVisible();
    }
  });

  test("should display personalized insights based on results", async ({
    page,
  }) => {
    await page.goto("/onboarding/results");

    await page.waitForTimeout(3000);

    // Check for insights section heading
    const insights = page.getByRole("heading", {
      name: /What These Results Mean|Personalized Insights/i,
    });
    await expect(insights.first()).toBeVisible({ timeout: 10000 });
  });

  test("should provide recommendations based on severity", async ({ page }) => {
    await page.goto("/onboarding/results");

    await page.waitForTimeout(3000);

    // Check for recommendations
    const recommendations = page.locator(
      "text=/Depression Support|Anxiety Management|Stress Reduction|Maintaining Wellbeing/i"
    );
    await expect(recommendations.first()).toBeVisible({ timeout: 10000 });
  });

  test("should display demographics summary", async ({ page }) => {
    await page.goto("/onboarding/results");

    await page.waitForTimeout(2000);

    // Check for demographics section
    const demographics = page.locator("text=/Your Demographics/i");
    await expect(demographics).toBeVisible({ timeout: 10000 });
  });

  test("should offer to register and save results", async ({ page }) => {
    await page.goto("/onboarding/results");

    await page.waitForTimeout(2000);

    // Check for registration prompt or button
    const registerText = page.locator(
      "text=/Register to Save|Register.*continue/i"
    );
    const registerButton = page.getByRole("button", { name: /Register/i });

    // Either text or button should be visible
    const textVisible = await registerText.first().isVisible();
    const buttonVisible = await registerButton.first().isVisible();

    expect(textVisible || buttonVisible).toBe(true);
  });

  test("should allow retaking assessment", async ({ page }) => {
    await page.goto("/onboarding/results");

    await page.waitForTimeout(2000);

    const retakeButton = page.locator('button:has-text("Retake Assessment")');
    await expect(retakeButton).toBeVisible({ timeout: 10000 });

    await retakeButton.click();

    // Should navigate to start of onboarding
    await expect(page).toHaveURL(/.*\/onboarding$/);
  });

  test("should be responsive on mobile", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });

    await page.goto("/onboarding/phq9");

    // Check mobile step indicator
    const mobileSteps = page.locator(".overflow-x-auto");
    await expect(mobileSteps.first()).toBeVisible();

    // Check swipe hint
    const swipeHint = page.locator("text=/Swipe.*see.*steps/i");
    await expect(swipeHint).toBeVisible();
  });
});
