// spec: specs/saucedemo-login-cart-test-plan.md
// seed: tests/seed.spec.ts

import { authenticatedTest as test, expect } from '../../fixtures/test-fixtures';
import { TestUtils } from '../../utils/test-utils';
import { testProducts } from '../../data/test-products';

test.describe('Shopping Cart Functionality Tests', () => {
  test('Add Single Item to Cart', async ({ authenticatedPage }) => {
    const { inventoryPage, cartPage } = authenticatedPage;
    
    // Verify inventory page loads with products
    await inventoryPage.verifyProductExists(testProducts.BACKPACK.name);
    
    // Verify initial cart state (empty) using utils
    const initialCartCount = await TestUtils.getCartCount(inventoryPage.page);
    expect(initialCartCount).toBe(0);
    
    // Verify initial button state shows "Add to cart"
    await inventoryPage.verifyAddToCartButtonVisible();
    
    // Click 'Add to cart' button for 'Sauce Labs Backpack' using semantic locator
    await inventoryPage.addProductToCart(testProducts.BACKPACK.name);
    
    // Verify button text changes to 'Remove' with retry logic
    await TestUtils.retryAction(async () => {
      await inventoryPage.verifyProductButtonText(testProducts.BACKPACK.name, 'Remove');
    });
    
    // Verify cart badge shows '1'
    await inventoryPage.verifyCartBadgeCount(1);
    
    // Navigate to cart page for additional verification
    await inventoryPage.navigateToCart();
    await cartPage.verifyPageLoaded();
    
    // Verify cart page shows the added product
    await cartPage.verifyProductInCart(testProducts.BACKPACK.name, testProducts.BACKPACK.price);
    
    // Verify cart shows quantity 1
    await cartPage.verifyCartQuantity(1);
    
    // Verify cart headers are displayed
    await cartPage.verifyCartHeaders();
    
    // Verify action buttons are available
    await cartPage.verifyActionButtons();
    
    // Verify inventory page remains accessible via Continue Shopping
    await cartPage.continueShopping();
    await inventoryPage.verifyPageLoaded();
    
    // Verify cart state is maintained after navigation using utils
    const finalCartCount = await TestUtils.getCartCount(inventoryPage.page);
    expect(finalCartCount).toBe(1);
  });

  test('Add Multiple Items to Cart Using Utils', async ({ authenticatedPage }) => {
    const { inventoryPage, cartPage } = authenticatedPage;
    
    // Add multiple products using semantic locators
    await inventoryPage.addProductToCart(testProducts.BACKPACK.name);
    await inventoryPage.addProductToCart(testProducts.BIKE_LIGHT.name);
    await inventoryPage.addProductToCart(testProducts.BOLT_T_SHIRT.name);
    
    // Verify cart badge shows correct count
    await inventoryPage.verifyCartBadgeCount(3);
    
    // Navigate to cart and verify all products
    await inventoryPage.navigateToCart();
    await cartPage.verifyPageLoaded();
    
    // Verify all added products are in cart using semantic locators
    await cartPage.verifyProductInCart(testProducts.BACKPACK.name, testProducts.BACKPACK.price);
    await cartPage.verifyProductInCart(testProducts.BIKE_LIGHT.name, testProducts.BIKE_LIGHT.price);
    await cartPage.verifyProductInCart(testProducts.BOLT_T_SHIRT.name, testProducts.BOLT_T_SHIRT.price);
  });

  test('Add Multiple Items Using Utility Function', async ({ authenticatedPage }) => {
    const { inventoryPage, cartPage } = authenticatedPage;
    
    // Verify we're on the inventory page
    await inventoryPage.verifyPageLoaded();
    
    // Verify initial cart state is empty
    const initialCartCount = await TestUtils.getCartCount(inventoryPage.page);
    expect(initialCartCount).toBe(0);
    
    // Add multiple products using utility function with explicit products
    const productsToAdd = [testProducts.BACKPACK.name, testProducts.BIKE_LIGHT.name, testProducts.BOLT_T_SHIRT.name];
    await TestUtils.addProductsToCart(inventoryPage.page, productsToAdd);
    
    // Wait for cart updates to complete and verify cart badge shows correct count
    await TestUtils.retryAction(async () => {
      await inventoryPage.verifyCartBadgeCount(3);
    });
    
    // Navigate to cart and verify page loads
    await inventoryPage.navigateToCart();
    await cartPage.verifyPageLoaded();
    
    // Verify all added products are in cart with retry logic for reliability
    await TestUtils.retryAction(async () => {
      await cartPage.verifyProductInCart(testProducts.BACKPACK.name, testProducts.BACKPACK.price);
    });
    await TestUtils.retryAction(async () => {
      await cartPage.verifyProductInCart(testProducts.BIKE_LIGHT.name, testProducts.BIKE_LIGHT.price);
    });
    await TestUtils.retryAction(async () => {
      await cartPage.verifyProductInCart(testProducts.BOLT_T_SHIRT.name, testProducts.BOLT_T_SHIRT.price);
    });
    
    // Final verification that cart count is correct
    const finalCartCount = await TestUtils.getCartCount(inventoryPage.page);
    expect(finalCartCount).toBe(3);
  });

  test('Cart State Persistence', async ({ authenticatedPage }) => {
    const { inventoryPage, cartPage } = authenticatedPage;
    
    // Add item to cart using semantic locator
    await inventoryPage.addProductToCart(testProducts.BACKPACK.name);
    
    // Navigate to cart and back
    await inventoryPage.navigateToCart();
    await cartPage.continueShopping();
    
    // Verify cart state persists
    const cartCount = await TestUtils.getCartCount(inventoryPage.page);
    expect(cartCount).toBe(1);
    
    // Refresh page and verify persistence
    await inventoryPage.page.reload();
    await inventoryPage.verifyPageLoaded();
    
    const cartCountAfterRefresh = await TestUtils.getCartCount(inventoryPage.page);
    expect(cartCountAfterRefresh).toBe(1);
  });
});