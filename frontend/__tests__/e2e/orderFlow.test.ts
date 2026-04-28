// __tests__/e2e/happy-path.test.ts
import { test, expect } from "@playwright/test";

test.describe("Happy path: login → browse → add to cart → checkout", () => {
  test("user can login, add a dish to cart, and checkout", async ({ page }) => {
    // Login
    await page.goto("/login");
    await page.getByLabel("Email").fill("alice@example.com");
    await page.getByLabel("Password").fill("password123");
    await page.getByRole("button", { name: "Log in" }).click();
    await expect(page).toHaveURL(/\/account/);
    await expect(page.getByText("Logged in as")).toBeVisible();

    // Browse restaurants (home renders restaurants list SSR)
    await page.goto("/");
    await page.getByRole("link", { name: /Restaurants near you|UbearItz/ }).isVisible();
    // Click first restaurant card (Card wraps a link)
    const firstRestaurant = page.locator('a[href^="/restaurants/"]').first();
    await firstRestaurant.click();
    await expect(page).toHaveURL(/\/restaurants\/.+/);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible(); // restaurant name

    // Open first dish
    const firstDish = page.locator('a[href^="/dishes/"]').first();
    await firstDish.click();
    await expect(page).toHaveURL(/\/dishes\/.+/);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible(); // dish name

    // Add to cart (link navigates to /cart)
    await page.getByRole("link", { name: "Add to Cart" }).click();
    await expect(page).toHaveURL("/cart");

    // Cart assertions
    await expect(page.getByRole("heading", { name: "Cart" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Checkout" })).toBeVisible();

    // Checkout redirects to orders
    await page.getByRole("button", { name: "Checkout" }).click();
    await expect(page).toHaveURL("/orders");
    await expect(page.getByRole("heading", { name: "My Orders" })).toBeVisible();
    // At least one order visible
    await expect(page.locator("li >> text=Total:")).toHaveCount(1);
  });
});
