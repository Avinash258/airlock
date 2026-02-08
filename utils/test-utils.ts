import type { Page } from '@playwright/test';
import { testUsers } from '../data/test-users';

/**
 * Common utility functions for test automation
 */
export class TestUtils {
  
  /**
   * Navigate to login page and perform authentication
   * @param page - Playwright page object
   * @param userType - Type of user to login with (defaults to STANDARD)
   */
  static async performLogin(page: Page, userType: keyof typeof testUsers = 'STANDARD') {
    const user = testUsers[userType];
    await page.goto('https://www.saucedemo.com/');
    await page.locator('[data-test="username"]').fill(user.username);
    await page.locator('[data-test="password"]').fill(user.password);
    await page.locator('[data-test="login-button"]').click();
  }

  /**
   * Add multiple products to cart using data-test selectors with enhanced reliability
   * @param page - Playwright page object
   * @param productNames - Array of product names to add
   */
  static async addProductsToCart(page: Page, productNames: string[]) {
    for (const productName of productNames) {
      try {
        // Find the product container and locate the add to cart button within it
        const productContainer = page.locator('.inventory_item').filter({ hasText: productName });
        
        // Wait for the product container to be visible
        await productContainer.waitFor({ state: 'visible' });
        
        // Find the add to cart button within the container
        const addButton = productContainer.getByRole('button', { name: /add to cart/i });
        
        // Wait for button to be clickable and click it
        await addButton.waitFor({ state: 'visible' });
        await addButton.click();
        
        // Wait a moment for the cart state to update
        await TestUtils.sleep(100);
        
      } catch (error) {
        throw new Error(`Failed to add product "${productName}" to cart: ${error}`);
      }
    }
  }

  /**
   * Wait for page load and verify URL
   * @param page - Playwright page object
   * @param expectedUrl - Expected URL pattern
   */
  static async waitForPageLoad(page: Page, expectedUrl: string) {
    await page.waitForLoadState('networkidle');
    await page.waitForURL(`**/${expectedUrl}`);
  }

  /**
   * Generate random user data for forms
   */
  static generateRandomUserData() {
    const timestamp = Date.now().toString();
    return {
      firstName: `Test${timestamp}`,
      lastName: `User${timestamp}`,
      zipCode: Math.floor(10000 + Math.random() * 90000).toString(),
    };
  }

  /**
   * Take screenshot with timestamp for debugging
   * @param page - Playwright page object
   * @param testName - Name of the test for screenshot filename
   */
  static async takeScreenshot(page: Page, testName: string) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    await page.screenshot({ 
      path: `test-results/screenshots/${testName}-${timestamp}.png`,
      fullPage: true 
    });
  }

  /**
   * Clear browser storage (localStorage, sessionStorage, cookies)
   * @param page - Playwright page object
   */
  static async clearBrowserStorage(page: Page) {
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });
    await page.context().clearCookies();
  }

  /**
   * Get cart badge count as number
   * @param page - Playwright page object
   * @returns Cart count as number, 0 if badge not visible
   */
  static async getCartCount(page: Page): Promise<number> {
    try {
      const badge = page.locator('[data-test="shopping-cart-badge"]');
      const isVisible = await badge.isVisible();
      if (!isVisible) return 0;
      
      const text = await badge.textContent();
      return text ? parseInt(text, 10) : 0;
    } catch {
      return 0;
    }
  }

  /**
   * Wait for element to be in specific state
   * @param page - Playwright page object
   * @param selector - CSS selector
   * @param expectedText - Expected text content
   * @param timeout - Timeout in milliseconds
   */
  static async waitForElementText(page: Page, selector: string, expectedText: string, timeout = 5000) {
    await page.waitForFunction(
      ({ sel, text }) => {
        const element = document.querySelector(sel);
        return element && element.textContent?.trim() === text;
      },
      { sel: selector, text: expectedText },
      { timeout }
    );
  }

  /**
   * Retry an action with exponential backoff
   * @param action - Async function to retry
   * @param maxRetries - Maximum number of retries
   * @param delay - Initial delay in milliseconds
   */
  static async retryAction<T>(
    action: () => Promise<T>,
    maxRetries = 3,
    delay = 1000
  ): Promise<T> {
    let lastError: Error;
    
    for (let i = 0; i <= maxRetries; i++) {
      try {
        return await action();
      } catch (error) {
        lastError = error as Error;
        if (i === maxRetries) break;
        
        await TestUtils.sleep(delay * Math.pow(2, i));
      }
    }
    
    throw lastError!;
  }

  /**
   * Sleep for specified milliseconds
   * @param ms - Milliseconds to sleep
   */
  static async sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Get all available products from inventory page
   * @param page - Playwright page object
   */
  static async getAllProductNames(page: Page): Promise<string[]> {
    const productElements = page.locator('[data-test="inventory-item-name"]');
    return await productElements.allTextContents();
  }

  /**
   * Verify page accessibility (basic check)
   * @param page - Playwright page object
   */
  static async verifyBasicAccessibility(page: Page) {
    // Check for basic accessibility attributes
    const elementsWithoutAlt = await page.locator('img:not([alt])').count();
    if (elementsWithoutAlt > 0) {
      console.warn(`Found ${elementsWithoutAlt} images without alt attributes`);
    }
    
    // Check for form labels
    const inputsWithoutLabels = await page.locator('input:not([aria-label]):not([aria-labelledby])').count();
    if (inputsWithoutLabels > 0) {
      console.warn(`Found ${inputsWithoutLabels} inputs without proper labels`);
    }
  }
}