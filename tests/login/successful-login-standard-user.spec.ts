// spec: specs/saucedemo-login-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '../../fixtures/test-fixtures';
import { TestUtils } from '../../utils/test-utils';
import { testUsers } from '../../data/test-users';

test.describe('Login Functionality Tests', () => {
  test('Successful Login with Standard User', async ({ loginPage, inventoryPage }) => {
    // 1. Navigate to https://www.saucedemo.com/
    await loginPage.navigateTo();
    
    // Wait for page to load
    await loginPage.page.waitForLoadState('domcontentloaded');

    // 2. Verify the login page is displayed with username field, password field, and login button
    await loginPage.verifyPageElements();

    // 3. Enter 'standard_user' in the username field
    // 4. Enter 'secret_sauce' in the password field
    // 5. Click the 'Login' button
    await loginPage.login(testUsers.STANDARD.username, testUsers.STANDARD.password);

    // Wait for navigation to complete
    await loginPage.page.waitForURL('**/inventory.html');

    // Verify successful login by checking inventory page is displayed
    await inventoryPage.verifyPageLoaded();
  });

  test('Login Page Accessibility Check', async ({ loginPage }) => {
    await loginPage.navigateTo();
    await TestUtils.verifyBasicAccessibility(loginPage.page);
  });

  test('Login with Different User Types', async ({ loginPage, inventoryPage }) => {
    // Test with problem user
    await loginPage.navigateTo();
    await loginPage.login(testUsers.PROBLEM.username, testUsers.PROBLEM.password);
    await loginPage.page.waitForURL('**/inventory.html');
    await inventoryPage.verifyPageLoaded();
    
    // Clear session and test with performance glitch user
    await TestUtils.clearBrowserStorage(loginPage.page);
    await loginPage.navigateTo();
    await loginPage.login(testUsers.PERFORMANCE_GLITCH.username, testUsers.PERFORMANCE_GLITCH.password);
    await loginPage.page.waitForURL('**/inventory.html');
    await inventoryPage.verifyPageLoaded();
  });
});