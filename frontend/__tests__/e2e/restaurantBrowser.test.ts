import { test, expect } from "@playwright/test";

test.describe("Restaurant browsing experience", () => {
  test("user can filter restaurants and switch languages", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByRole("heading", { name: "Restaurants near you" })).toBeVisible();

    const searchInput = page.getByRole("textbox", { name: "Search" });
    await searchInput.fill("Sushi");
    await expect(page.getByText("Sushi Annecy")).toBeVisible();
    await expect(page.getByText("Le Bearitz")).not.toBeVisible();

    await searchInput.fill("");
    await expect(page.getByText("Le Bearitz")).toBeVisible();

    await page.getByRole("button", { name: "Français" }).click();
    await expect(page.getByRole("heading", { name: "Restaurants près de chez vous" })).toBeVisible();
  });
});


