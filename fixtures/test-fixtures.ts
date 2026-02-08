import { test as base, expect } from '@playwright/test';
import { LoginPage } from '../pages/login.page';
import { InventoryPage } from '../pages/inventory.page';
import { CartPage } from '../pages/cart.page';
import { testUsers } from '../data/test-users';

// Define the types for our fixtures
type PageFixtures = {
  loginPage: LoginPage;
  inventoryPage: InventoryPage;
  cartPage: CartPage;
};

type AuthFixtures = {
  authenticatedPage: {
    loginPage: LoginPage;
    inventoryPage: InventoryPage;
    cartPage: CartPage;
  };
};

// Extend the base test to include our page object fixtures
export const test = base.extend<PageFixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },

  inventoryPage: async ({ page }, use) => {
    await use(new InventoryPage(page));
  },

  cartPage: async ({ page }, use) => {
    await use(new CartPage(page));
  },
});

// Create authenticated fixture for tests that need logged-in user
export const authenticatedTest = test.extend<AuthFixtures>({
  authenticatedPage: async ({ page, loginPage, inventoryPage, cartPage }, use) => {
    try {
      // Perform login before test
      await loginPage.navigateTo();
      await page.waitForLoadState('domcontentloaded');
      
      // Wait for login form to be ready
      await loginPage.usernameInput.waitFor();
      await loginPage.passwordInput.waitFor();
      await loginPage.loginButton.waitFor();
      
      await loginPage.login(testUsers.STANDARD.username, testUsers.STANDARD.password);
      
      // Wait for inventory page to load completely
      await page.waitForURL('**/inventory.html');
      await page.waitForLoadState('networkidle');
      
      // Wait for the title element specifically before verifying
      await page.locator('[data-test="title"]').waitFor();
      await inventoryPage.verifyPageLoaded();

      // Provide all page objects to the test
      await use({
        loginPage,
        inventoryPage,
        cartPage,
      });
    } catch (error) {
      console.error('Authentication setup failed:', error);
      throw error;
    }
  },
});

// Re-export expect for convenience
export { expect };