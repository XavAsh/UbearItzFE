// __tests__/e2e/account-edit.test.ts
import { test, expect } from "@playwright/test";

test.describe("Account editing", () => {
  test.beforeEach(async ({ page }) => {
    // Login first
    await page.goto("/login");
    await page.getByLabel("Email").fill("alice@example.com");
    await page.getByLabel("Password").fill("password123");
    await page.getByRole("button", { name: "Log in" }).click();
    await expect(page).toHaveURL(/\/account/);
  });

  test("user can update profile name and email", async ({ page }) => {
    await expect(page.getByRole("heading", { name: "My Account" })).toBeVisible();

    await page.getByLabel("Name").fill("Alice QA");
    await page.getByLabel("Email").fill("alice.qa@example.com");

    await page.getByRole("button", { name: "Save" }).click();

    // Basic UI confirmation: inputs retain updated values
    await expect(page.getByLabel("Name")).toHaveValue("Alice QA");
    await expect(page.getByLabel("Email")).toHaveValue("alice.qa@example.com");
  });
});
