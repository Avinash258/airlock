import { expect, type Page } from '@playwright/test';
import { testUrls } from '../data/test-users';

export class InventoryPage {
  constructor(private _page: Page) {}

  // Expose page for utils access
  get page(): Page {
    return this._page;
  }

  // Locators - Using Playwright Best Practices
  get menuButton() { return this._page.getByRole('button', { name: /open menu/i }); }
  get logoutLink() { return this._page.getByRole('link', { name: /logout/i }); }
  get productsTitle() { return this._page.locator('[data-test="title"]'); }
  get cartBadge() { return this._page.locator('[data-test="shopping-cart-badge"]'); } // Keep as fallback since no semantic alternative
  get cartLink() { return this._page.getByRole('link', { name: /shopping cart/i }).or(this._page.locator('[data-test="shopping-cart-link"]')); }
  get sortingDropdown() { return this._page.getByRole('combobox', { name: /product sort/i }).or(this._page.locator('[data-test="product-sort-container"]')); }
  
  // Product-related locators
  getProductByName(productName: string) {
    return this._page.getByText(productName).first();
  }
  
  getAddToCartButton(productName: string) {
    // Find the product container and locate the add to cart button within it
    const productContainer = this._page.locator('.inventory_item').filter({ hasText: productName });
    return productContainer.getByRole('button', { name: /add to cart/i });
  }
  
  getRemoveButton(productName: string) {
    // Find the product container and locate the remove button within it
    const productContainer = this._page.locator('.inventory_item').filter({ hasText: productName });
    return productContainer.getByRole('button', { name: /remove/i });
  }
  
  get addToCartButtons() {
    return this._page.getByRole('button', { name: /add to cart/i });
  }

  // Actions
  async verifyPageLoaded() {
    await expect(this.productsTitle).toBeVisible();
    expect(this._page.url()).toBe(testUrls.INVENTORY_PAGE);
  }

  async logout() {
    await this.menuButton.click();
    await this.logoutLink.click();
  }

  // Cart-related actions - Using semantic locators where possible
  async addProductToCart(productName: string) {
    try {
      // Try semantic approach first
      const addButton = this.getAddToCartButton(productName);
      await addButton.waitFor({ timeout: 5000 });
      await addButton.click();
    } catch {
      // Fallback to generic add to cart button if semantic fails
      const productElement = this._page.getByText(productName).first();
      const addButton = productElement.locator('..').locator('..').getByRole('button', { name: /add to cart/i });
      await addButton.click();
    }
  }

  async addProductToCartBySelector(addToCartSelector: string) {
    // Fallback method for specific selectors
    await this._page.locator(addToCartSelector).click();
  }

  async removeProductFromCart(productName: string) {
    try {
      const removeButton = this.getRemoveButton(productName);
      await removeButton.waitFor({ timeout: 5000 });
      await removeButton.click();
    } catch {
      // Fallback approach
      const productElement = this._page.getByText(productName).first();
      const removeButton = productElement.locator('..').locator('..').getByRole('button', { name: /remove/i });
      await removeButton.click();
    }
  }

  async removeProductFromCartBySelector(removeSelector: string) {
    // Fallback method for specific selectors
    await this._page.locator(removeSelector).click();
  }

  async verifyCartBadgeCount(expectedCount: string | number) {
    if (expectedCount === 0 || expectedCount === '0') {
      await expect(this.cartBadge).not.toBeVisible();
    } else {
      await expect(this.cartBadge).toBeVisible();
      await expect(this.cartBadge).toHaveText(expectedCount.toString());
    }
  }

  async verifyProductButtonText(productName: string, expectedText: string) {
    try {
      if (expectedText.toLowerCase().includes('remove')) {
        await expect(this.getRemoveButton(productName)).toBeVisible();
        await expect(this.getRemoveButton(productName)).toHaveText(/remove/i);
      } else {
        await expect(this.getAddToCartButton(productName)).toBeVisible();
        await expect(this.getAddToCartButton(productName)).toHaveText(/add to cart/i);
      }
    } catch {
      // Fallback to selector-based approach
      const productContainer = this._page.locator('.inventory_item').filter({ hasText: productName });
      const button = productContainer.locator('button');
      await expect(button).toContainText(expectedText);
    }
  }

  async verifyProductButtonTextBySelector(buttonSelector: string, expectedText: string) {
    // Fallback method for specific selectors
    await expect(this._page.locator(buttonSelector)).toHaveText(expectedText);
  }

  async verifyProductExists(productName: string) {
    await expect(this.getProductByName(productName)).toBeVisible();
  }

  async navigateToCart() {
    try {
      await this.cartLink.click();
    } catch {
      // Fallback to cart badge click
      await this.cartBadge.click();
    }
  }

  async verifyAddToCartButtonVisible() {
    await expect(this.addToCartButtons.first()).toBeVisible();
  }
}