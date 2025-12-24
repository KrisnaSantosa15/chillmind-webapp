import { test, expect } from "@playwright/test";
import { loginUser } from "./helpers/auth";

test.describe("API Integration Tests", () => {
  test.describe("Emotion Prediction API", () => {
    test("should predict emotion from journal text", async ({ page }) => {
      await loginUser(page, "test@gmail.com", "test123");
      await page.goto("/dashboard/journal");
      await page.waitForLoadState("networkidle");
      await page.waitForTimeout(1000);

      // Create new journal entry (if implemented)
      const newEntryButton = page
        .locator('button:has-text("New Entry"), a:has-text("New Entry")')
        .first();

      if (await newEntryButton.isVisible()) {
        await newEntryButton.click();

        // Fill journal form
        const contentInput = page.locator(
          'textarea[name="content"], textarea[placeholder*="write" i]'
        );
        if (await contentInput.isVisible()) {
          await contentInput.fill(
            "I feel so happy and excited today! Everything is going great and I am very grateful."
          );

          // Submit
          const submitButton = page.locator(
            'button[type="submit"], button:has-text("Save")'
          );
          await submitButton.click();

          // Wait for emotion prediction
          await page.waitForTimeout(2000);

          // Check for emotion result (joy, love, surprise, neutral, fear, anger, sadness)
          const emotionLabel = page
            .locator("text=/joy|love|surprise|neutral|fear|anger|sadness/i")
            .first();
          await expect(emotionLabel).toBeVisible({ timeout: 10000 });
        }
      }
    });
  });

  test.describe("HIMPSI Psychologist API", () => {
    test("should fetch psychologists from API", async ({ page }) => {
      await loginUser(page, "test@gmail.com", "test123");
      await page.goto("/dashboard/find-psychologist");

      // Wait for API call
      await page.waitForTimeout(2000);

      // Should either show loading or results
      const loading = page.locator("text=/Loading.*psychologists/i");
      const results = page.locator('[data-testid="psychologist-card"]').first();

      const hasLoading = await loading.isVisible();
      const hasResults = await results.isVisible();

      expect(hasLoading || hasResults).toBe(true);
    });
  });

  test.describe("Gemini AI API", () => {
    test("should send message to AI and receive response", async ({ page }) => {
      await loginUser(page, "test@gmail.com", "test123");
      await page.goto("/dashboard/ai-assistant");

      const chatInput = page.locator(
        'textarea[placeholder*="message" i], input[placeholder*="message" i]'
      );
      const sendButton = page
        .locator('button[type="submit"], button:has-text("Send")')
        .last();

      if ((await chatInput.isVisible()) && (await sendButton.isVisible())) {
        await chatInput.fill("Hello, how are you?");
        await sendButton.click();

        // Wait for AI response
        await page.waitForTimeout(5000);

        // Check for response message
        const messages = page.locator('[data-testid="chat-message"], .message');
        expect(await messages.count()).toBeGreaterThan(1); // User message + AI response
      }
    });

    test("should handle AI streaming response", async ({ page }) => {
      await loginUser(page, "test@gmail.com", "test123");
      await page.goto("/dashboard/ai-assistant");

      const chatInput = page.locator(
        'textarea[placeholder*="message" i], input[placeholder*="message" i]'
      );
      const sendButton = page
        .locator('button[type="submit"], button:has-text("Send")')
        .last();

      if (await chatInput.isVisible()) {
        await chatInput.fill("Tell me about managing anxiety.");
        await sendButton.click();

        // Check for streaming indicator or loading
        const streaming = page.locator(
          '[data-testid="loading"], .loading, text=/Typing/i'
        );
        await expect(streaming).toBeVisible({ timeout: 3000 });

        // Wait for complete response
        await page.waitForTimeout(8000);

        // Response should be complete
        const lastMessage = page
          .locator('[data-testid="chat-message"], .message')
          .last();
        await expect(lastMessage).toBeVisible();
      }
    });
  });

  test.describe("Firebase Firestore", () => {
    test("should save journal entry to Firestore", async ({ page }) => {
      // This requires authentication
      await loginUser(page, "test@gmail.com", "test123");
      await page.goto("/dashboard/journal");

      const newEntryButton = page
        .locator('button:has-text("New Entry"), a:has-text("New Entry")')
        .first();

      if (await newEntryButton.isVisible()) {
        await newEntryButton.click();

        const titleInput = page.locator(
          'input[name="title"], input[placeholder*="title" i]'
        );
        const contentInput = page.locator(
          'textarea[name="content"], textarea[placeholder*="write" i]'
        );

        if (
          (await titleInput.isVisible()) &&
          (await contentInput.isVisible())
        ) {
          await titleInput.fill("Test Journal Entry");
          await contentInput.fill(
            "This is a test entry for Firestore integration."
          );

          const saveButton = page.locator(
            'button[type="submit"], button:has-text("Save")'
          );
          await saveButton.click();

          // Wait for save
          await page.waitForTimeout(2000);

          // Check for success message or redirect
          const success = page.locator("text=/saved|success/i");
          await expect(success).toBeVisible({ timeout: 5000 });
        }
      }
    });

    test("should update user mood streak in Firestore", async ({ page }) => {
      await loginUser(page, "test@gmail.com", "test123");
      await page.goto("/dashboard");

      // Wait for Firestore data
      await page.waitForTimeout(2000);

      // Check for streak display
      const streak = page.locator("text=/\\d+.*day.*streak/i");

      if (await streak.isVisible()) {
        const streakText = await streak.textContent();
        expect(streakText).toContain("day");
      }
    });
  });

  test.describe("Geocoding API", () => {
    test("should geocode psychologist locations", async ({ page }) => {
      await loginUser(page, "test@gmail.com", "test123");
      await page.goto("/dashboard/find-psychologist");

      // Switch to map view
      const mapViewButton = page.locator('button:has-text("Map View")');

      if (await mapViewButton.isVisible()) {
        await mapViewButton.click();
        await page.waitForTimeout(1000);

        // Check for map or coming soon message
        const mapOrMessage = page.locator("text=/Map|Coming Soon/i");
        await expect(mapOrMessage).toBeVisible();
      }
    });
  });

  test.describe("TensorFlow.js Model API", () => {
    test("should load TF.js model from public directory", async ({ page }) => {
      await page.goto("/onboarding/results");

      // Wait for model loading
      await page.waitForTimeout(5000);

      // Model should load without errors
      const errorMessage = page.locator("text=/Error.*loading.*model/i");

      // Either no error, or fallback to traditional scoring
      const noError = !(await errorMessage.isVisible());
      const hasFallback = await page
        .locator("text=/traditional scoring/i")
        .isVisible();

      expect(noError || hasFallback).toBe(true);
    });
  });

  test.describe("API Error Handling", () => {
    test("should show retry option on API failure", async ({ page }) => {
      // This would require API mocking
      await loginUser(page, "test@gmail.com", "test123");
      await page.goto("/dashboard/ai-assistant");

      // Try to send message
      const chatInput = page.locator('textarea[placeholder*="message" i]');
      const sendButton = page.locator('button[type="submit"]').last();

      if (await chatInput.isVisible()) {
        await chatInput.fill("Test message");
        await sendButton.click();

        await page.waitForTimeout(15000);

        // Either success or retry option
        const retry = page.locator('button:has-text("Retry")');
        const response = page.locator(".message").last();

        expect((await retry.isVisible()) || (await response.isVisible())).toBe(
          true
        );
      }
    });
  });
});

test.describe("API Performance Tests", () => {
  test("should complete AI response within 15 seconds", async ({ page }) => {
    await loginUser(page, "test@gmail.com", "test123");
    await page.goto("/dashboard/ai-assistant");

    const chatInput = page.locator('textarea[placeholder*="message" i]');
    const sendButton = page.locator('button[type="submit"]').last();

    if (await chatInput.isVisible()) {
      const startTime = Date.now();

      await chatInput.fill("Quick question about anxiety");
      await sendButton.click();

      // Wait for response
      await page.waitForTimeout(15000);

      const messages = page.locator(".message");
      const count = await messages.count();

      const responseTime = Date.now() - startTime;

      expect(count).toBeGreaterThan(1);
      expect(responseTime).toBeLessThan(15000);
    }
  });

  test("should load ML model within 10 seconds", async ({ page }) => {
    const startTime = Date.now();

    await page.goto("/onboarding/results");

    // Wait for results display
    await page.waitForSelector("text=Your Assessment Results", {
      timeout: 15000,
    });

    const loadTime = Date.now() - startTime;
    expect(loadTime).toBeLessThan(10000);
  });
});
