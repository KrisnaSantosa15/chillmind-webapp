import { Page } from "@playwright/test";

export async function loginUser(page: Page, email: string, password: string) {
  await page.goto("/auth/login");
  await page.waitForLoadState("networkidle");

  await page.getByLabel(/Email/i).fill(email);
  await page.getByLabel(/Password/i).fill(password);
  await page.getByRole("button", { name: /^Sign In$/i }).click();

  // Wait for redirect to dashboard
  await page.waitForURL("**/dashboard", { timeout: 15000 });
  await page.waitForLoadState("networkidle");

  // Wait for Firebase to fully initialize
  await page.waitForTimeout(2000);
}

export const TEST_USER = {
  email: "test@gmail.com",
  password: "test123",
};
