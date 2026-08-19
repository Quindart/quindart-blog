import { test, expect } from "@playwright/test";

test.describe("Admin login flow", () => {
  test("allows admin to login and reach dashboard", async ({ page }) => {
    await page.goto("/admin/dashboard/login");
    await page.fill('input[type="text"]', "test@admin.local");
    await page.fill('input[type="password"]', "TestPass123!");
    await Promise.all([
      page.waitForNavigation(),
      page.click('button:has-text("Sign in")'),
    ]);

    await expect(page).toHaveURL(/\/admin\/dashboard/);
    await expect(page.locator("text=Dashboard")).toBeVisible();
  });
});
