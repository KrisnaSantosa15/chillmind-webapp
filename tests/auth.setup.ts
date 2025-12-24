import { test as setup, expect } from "@playwright/test";
import path from "path";
import fs from "fs";

const authFile = path.join(__dirname, "../playwright/.auth/user.json");

setup("authenticate", async ({ page }) => {
  console.log("🔐 Starting authentication setup...");

  // Navigate to login page
  await page.goto("/auth/login");
  await page.waitForLoadState("networkidle");

  // Fill in login credentials
  console.log("📝 Filling login credentials...");
  await page.getByLabel(/Email/i).fill("test@gmail.com");
  await page.getByLabel(/Password/i).fill("test123");

  // Click login button
  console.log("🔘 Clicking login button...");
  await page.getByRole("button", { name: /^Sign In$/i }).click();

  // Wait for successful login and redirect to dashboard
  console.log("⏳ Waiting for redirect to dashboard...");
  try {
    await page.waitForURL("**/dashboard", { timeout: 15000 });
    console.log("✅ Redirected to dashboard");
  } catch (error) {
    console.error("❌ Failed to redirect to dashboard");
    console.log("Current URL:", page.url());

    // Check for error messages
    const errorMsg = await page
      .locator("text=/error|invalid|incorrect/i")
      .first()
      .textContent()
      .catch(() => null);
    if (errorMsg) {
      console.error("Error message found:", errorMsg);
    }
    throw error;
  }

  // Wait for Firebase authentication to fully complete
  await page.waitForLoadState("networkidle");
  await page.waitForTimeout(8000); // Give Firebase time to persist to IndexedDB

  // Verify we're actually logged in by checking for dashboard content
  await expect(page.locator("text=/Dashboard|Welcome/i").first()).toBeVisible({
    timeout: 10000,
  });

  // Get all localStorage keys to verify Firebase auth
  const localStorageData = await page.evaluate(() => {
    const data: Record<string, string> = {};
    for (let i = 0; i < window.localStorage.length; i++) {
      const key = window.localStorage.key(i);
      if (key) {
        data[key] = window.localStorage.getItem(key) || "";
      }
    }
    return data;
  });

  const firebaseKeys = Object.keys(localStorageData).filter(
    (key) => key.includes("firebase") || key.includes("auth")
  );
  console.log("🔑 Firebase keys found:", firebaseKeys);

  if (firebaseKeys.length === 0) {
    console.error("⚠️ WARNING: No Firebase auth keys found in localStorage!");
    console.log("All localStorage keys:", Object.keys(localStorageData));
  } else {
    // Show partial token to verify it's there
    const authKey = firebaseKeys.find(
      (k) => k.includes("authUser") || k.includes("user")
    );
    if (authKey) {
      const tokenPreview = localStorageData[authKey].substring(0, 50);
      console.log(`✅ Auth token found (preview): ${tokenPreview}...`);
    }
  }

  // Save signed-in state to 'authFile'
  await page.context().storageState({ path: authFile });

  console.log("✅ Authentication completed and saved to:", authFile);

  // Verify the saved file has the auth data
  const savedState = JSON.parse(fs.readFileSync(authFile, "utf-8"));
  const hasFirebaseData = savedState.origins.some(
    (origin: { localStorage?: Array<{ name: string }> }) =>
      origin.localStorage?.some(
        (item: { name: string }) =>
          item.name.includes("firebase") || item.name.includes("auth")
      )
  );
  console.log("🔍 Saved state contains Firebase data:", hasFirebaseData);
});
