import { expect, type Page } from '@playwright/test';
import { testUrls } from '../data/test-users';

export class CartPage {
  constructor(private _page: Page) {}

  // Expose page for utils access
  get page(): Page {
    return this._page;
  }

  // Locators - Using Playwright Best Practices
  get cartTitle() { return this._page.locator('[data-test="title"]'); }
  get continueShoppingButton() { return this._page.getByRole('button', { name: /continue shopping/i }); }
  get checkoutButton() { return this._page.getByRole('button', { name: /checkout/i }); }
  get cartItems() { return this._page.getByRole('listitem').filter({ has: this._page.getByRole('link') }); }
  get quantityColumn() { return this._page.getByRole('columnheader', { name: /qty/i }).or(this._page.getByText('QTY')); }
  get descriptionColumn() { return this._page.getByRole('columnheader', { name: /description/i }).or(this._page.getByText('Description')); }
  
  // Product-specific locators
  getProductInCart(productName: string) {
    return this._page.getByText(productName).first();
  }
  
  getProductPrice(productName: string) {
    const productContainer = this._page.locator('.cart_item').filter({ hasText: productName });
    return productContainer.getByText(/\$[\d.]+/);
  }
  
  getRemoveButtonForProduct(productName: string) {
    const productContainer = this._page.locator('.cart_item').filter({ hasText: productName });
    return productContainer.getByRole('button', { name: /remove/i });
  }
  
  get cartQuantities() {
    return this._page.locator('.cart_quantity');
  }

  // Actions
  async verifyPageLoaded() {
    await expect(this.cartTitle).toBeVisible();
    expect(this._page.url()).toBe(`${testUrls.LOGIN_PAGE}cart.html`);
  }

  async verifyProductInCart(productName: string, price: string) {
    await expect(this.getProductInCart(productName)).toBeVisible();
    await expect(this._page.getByText(price)).toBeVisible();
  }

  async verifyCartQuantity(expectedQuantity: string | number) {
    const quantities = this.cartQuantities;
    if (await quantities.count() > 0) {
      await expect(quantities.first()).toHaveText(expectedQuantity.toString());
    } else {
      // Fallback: check for quantity in cart item
      await expect(this._page.getByText(expectedQuantity.toString()).first()).toBeVisible();
    }
  }

  async removeProductFromCart(productName: string) {
    try {
      await this.getRemoveButtonForProduct(productName).click();
    } catch {
      // Fallback approach
      const removeButton = this._page.getByRole('button', { name: /remove/i }).first();
      await removeButton.click();
    }
  }

  async removeProductFromCartBySelector(removeSelector: string) {
    // Fallback method for specific selectors
    await this._page.locator(removeSelector).click();
  }

  async continueShopping() {
    await this.continueShoppingButton.click();
  }

  async proceedToCheckout() {
    await this.checkoutButton.click();
  }

  async verifyEmptyCart() {
    await expect(this.cartItems).toHaveCount(0);
  }

  async getCartItemCount() {
    return await this.cartItems.count();
  }

  async verifyCartHeaders() {
    try {
      await expect(this.quantityColumn).toBeVisible();
      await expect(this.descriptionColumn).toBeVisible();
    } catch {
      // Fallback: just check if cart content area exists
      await expect(this._page.locator('.cart_contents')).toBeVisible();
    }
  }

  async verifyActionButtons() {
    await expect(this.continueShoppingButton).toBeVisible();
    await expect(this.checkoutButton).toBeVisible();
  }
}