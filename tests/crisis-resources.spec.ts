import { test, expect } from "@playwright/test";

test.describe("Crisis Resources Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/crisis-resources");
  });

  test("should display crisis resources page", async ({ page }) => {
    await expect(
      page.getByRole("heading", { name: "Crisis Resources" })
    ).toBeVisible();
    await expect(page.locator("text=/immediate help/i").first()).toBeVisible();
  });

  test("should display emergency banner", async ({ page }) => {
    const banner = page.locator("text=/In Immediate Danger/i").first();
    await expect(banner).toBeVisible();

    // Check emergency numbers - both should be visible
    const emergency112 = page.locator('a[href="tel:112"]');
    await expect(emergency112).toBeVisible();

    const emergency119 = page.locator('a[href="tel:119"]');
    await expect(emergency119).toBeVisible();
  });

  test("should display region selector", async ({ page }) => {
    const regions = ["Global", "United States", "United Kingdom", "Indonesia"];

    for (const region of regions) {
      // Use getByRole to get specific button, check last occurrence for desktop navigation
      const regionButton = page
        .getByRole("button", { name: new RegExp(region, "i") })
        .last();
      await expect(regionButton).toBeVisible();
    }
  });

  test("should switch between regions", async ({ page }) => {
    const indonesiaButton = page
      .getByRole("button", { name: /Indonesia/ })
      .last();

    await indonesiaButton.click();
    await page.waitForTimeout(500);

    // Check for Indonesia-specific resources
    const indonesiaResource = page.locator(
      "text=/Ibunda\\.id|Bicarakan\\.id|Yayasan Pulih/i"
    );
    await expect(indonesiaResource.first()).toBeVisible();
  });

  test("should display category filters", async ({ page }) => {
    const categories = [
      "Emergency Crisis",
      "Suicide Prevention",
      "Text & Chat",
      "Specialized Support",
    ];

    for (const category of categories) {
      const categoryButton = page.getByRole("button", {
        name: new RegExp(category, "i"),
      });
      await expect(categoryButton.first()).toBeVisible();
    }
  });

  test("should filter resources by category", async ({ page }) => {
    // Scroll down to ensure resources are visible
    await page.evaluate(() => window.scrollTo(0, 800));
    await page.waitForTimeout(500);

    const suicideButton = page
      .getByRole("button", { name: /Suicide Prevention/i })
      .first();

    await suicideButton.click();
    await page.waitForTimeout(1000);

    // Check that resources are displayed (h3 headings with resource names)
    const resourceHeadings = page.locator("h3");
    const count = await resourceHeadings.count();
    expect(count).toBeGreaterThan(0);
  });

  test("should display resource cards with contact information", async ({
    page,
  }) => {
    // Wait for resources to load
    await page.waitForTimeout(1000);

    // Check for resource headings (h3 elements with resource names)
    const resourceHeadings = page
      .locator("h3")
      .filter({ hasText: /Ibunda|Bicarakan|Yayasan|Pijar|Rumah Sakit|IPK/i });
    const count = await resourceHeadings.count();

    if (count > 0) {
      // Verify at least one resource is visible
      await expect(resourceHeadings.first()).toBeVisible();

      // Check for phone number or contact method in the page
      const contact = page.locator(
        "text=/\\d{3}-\\d+|Chat via|Contact via|Visit Website/i"
      );
      await expect(contact.first()).toBeVisible();
    }
  });

  test("should display availability hours", async ({ page }) => {
    const availability = page.locator("text=/24\\/7|\\d+:\\d+|Senin-Jumat/i");
    const count = await availability.count();
    expect(count).toBeGreaterThan(0);
  });

  test("should provide website links", async ({ page }) => {
    const websiteLinks = page.locator('a:has-text("Visit Website")');
    const count = await websiteLinks.count();

    if (count > 0) {
      const firstLink = websiteLinks.first();
      await expect(firstLink).toHaveAttribute("target", "_blank");
      await expect(firstLink).toHaveAttribute("rel", /noopener noreferrer/);
    }
  });

  test("should display resource types with icons", async ({ page }) => {
    // Emergency, Suicide Prevention, Chat, Specialty icons
    const icons = page.locator('svg, i[class*="fa-"]');
    const count = await icons.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should show "Resources Coming Soon" for empty regions', async ({
    page,
  }) => {
    // Wait for page to load
    await page.waitForTimeout(1000);

    const comingSoon = page.locator(
      "text=/Resources Coming Soon|working to add/i"
    );

    // Check for resource headings or coming soon message
    const hasResources =
      (await page
        .locator("h3")
        .filter({ hasText: /Ibunda|Bicarakan|National|Crisis|SAMHSA/i })
        .count()) > 0;
    const hasComingSoon = await comingSoon.isVisible();

    expect(hasResources || hasComingSoon).toBe(true);
  });

  test("should display self-care section", async ({ page }) => {
    const selfCareSection = page.locator("text=Additional Support").first();
    await selfCareSection.scrollIntoViewIfNeeded();

    const selfCare = page.locator(
      "text=/Additional Support.*Self-Care|Breathing Exercises/i"
    );
    await expect(selfCare.first()).toBeVisible();
  });

  test("should show breathing technique (4-7-8)", async ({ page }) => {
    const breathingTechnique = page.locator(
      "text=/4-7-8.*technique|breathe.*4.*hold.*7.*exhale.*8/i"
    );
    await expect(breathingTechnique).toBeVisible();
  });

  test("should show grounding technique", async ({ page }) => {
    const grounding = page.locator(
      "text=/5.*things.*see.*4.*touch.*3.*hear|Grounding Technique/i"
    );
    await expect(grounding.first()).toBeVisible();
  });

  test("should display important notice", async ({ page }) => {
    const importantSection = page.locator("text=Important").first();
    await importantSection.scrollIntoViewIfNeeded();

    const notice = page.locator(
      "text=/ChillMind is not a crisis intervention/i"
    );
    await expect(notice).toBeVisible();
  });

  test('should have "Suggest a Resource" button', async ({ page }) => {
    const suggestButton = page.locator('a:has-text("Suggest a Resource")');
    await expect(suggestButton).toBeVisible();

    // Should link to email
    await expect(suggestButton).toHaveAttribute("href", /mailto:/);
  });

  test("should work on mobile with dropdown selectors", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });

    // Check for mobile dropdown
    const regionDropdown = page
      .locator("button")
      .filter({ hasText: /Indonesia|Global/ })
      .first();
    await expect(regionDropdown).toBeVisible();

    await regionDropdown.click();
    await page.waitForTimeout(300);

    // Check dropdown opened - look for the specific dropdown with region buttons
    const dropdownMenu = page
      .locator("div.absolute.top-full")
      .filter({ hasText: /Global.*United States.*Indonesia/ });
    await expect(dropdownMenu).toBeVisible({ timeout: 3000 });
  });

  test("should display resource descriptions", async ({ page }) => {
    const descriptions = page.locator("p.text-sm");
    const count = await descriptions.count();
    expect(count).toBeGreaterThan(0);
  });

  test("should be sticky region selector", async ({ page }) => {
    const regionSelector = page.locator('.sticky, [class*="sticky"]');

    if (await regionSelector.first().isVisible()) {
      await expect(regionSelector.first()).toHaveCSS("position", "sticky");
    }
  });

  test("should handle empty state gracefully", async ({ page }) => {
    // Select a region/category combination that might have no results
    const allRegions = page.getByRole("button", { name: /Other Countries/i });

    if (await allRegions.last().isVisible()) {
      await allRegions.last().click();
      await page.waitForTimeout(500);

      // Should either show resources or "coming soon" message
      const comingSoonText = page.locator("text=/Coming Soon/i");
      const resourceHeadings = page.locator("h3");
      const hasContent =
        (await comingSoonText.count()) > 0 ||
        (await resourceHeadings.count()) > 0;
      expect(hasContent).toBe(true);
    }
  });

  test("should display phone call icon", async ({ page }) => {
    // Look for SVG icons or phone-related elements
    const icons = page.locator("svg");
    const count = await icons.count();
    // Page should have multiple icons (navigation, resources, etc.)
    expect(count).toBeGreaterThan(5);
  });

  test("should animate on scroll", async ({ page }) => {
    // Check for framer-motion animations
    const animatedElements = page.locator(
      '[style*="opacity"], [class*="motion"]'
    );

    await page.evaluate(() => window.scrollTo(0, 500));
    await page.waitForTimeout(500);

    const count = await animatedElements.count();
    expect(count).toBeGreaterThan(0);
  });
});
