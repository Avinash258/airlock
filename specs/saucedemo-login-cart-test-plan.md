# SauceDemo Login and Cart Functionality Test Plan

## Application Overview

Comprehensive test plan for SauceDemo (https://www.saucedemo.com/) covering both login authentication and shopping cart functionality. The application provides an e-commerce experience with user authentication, product browsing, cart management, and checkout flow including order completion.

## Test Scenarios

### 1. Login Functionality Tests

**Seed:** `tests/seed.spec.ts`

#### 1.1. Successful Login with Standard User

**File:** `tests/login/successful-login-standard-user.spec.ts`

**Steps:**
  1. Navigate to https://www.saucedemo.com/
  2. Verify the login page is displayed with username field, password field, and login button
  3. Enter 'standard_user' in the username field
  4. Enter 'secret_sauce' in the password field
  5. Click the 'Login' button

**Expected Results:**
  - Login page loads successfully with proper form elements
  - Username is entered without errors
  - Password is entered without errors (masked)
  - User is successfully redirected to inventory page (/inventory.html)
  - Products page displays with menu, product listings, and cart functionality

#### 1.2. Login Failure with Locked Out User

**File:** `tests/login/locked-out-user-login.spec.ts`

**Steps:**
  1. Navigate to https://www.saucedemo.com/
  2. Enter 'locked_out_user' in the username field
  3. Enter 'secret_sauce' in the password field
  4. Click the 'Login' button

**Expected Results:**
  - Login page loads successfully
  - Error message appears: 'Epic sadface: Sorry, this user has been locked out.'
  - User remains on the login page
  - Username and password fields retain entered values
  - Error message is clearly visible and properly styled

#### 1.3. Login Failure with Invalid Credentials

**File:** `tests/login/invalid-credentials-login.spec.ts`

**Steps:**
  1. Navigate to https://www.saucedemo.com/
  2. Enter 'invalid_user' in the username field
  3. Enter 'wrong_password' in the password field
  4. Click the 'Login' button

**Expected Results:**
  - Login page loads successfully
  - Error message appears: 'Epic sadface: Username and password do not match any user in this service'
  - User remains on the login page
  - Username and password fields retain entered values

#### 1.4. Login Validation - Empty Username

**File:** `tests/login/empty-username-validation.spec.ts`

**Steps:**
  1. Navigate to https://www.saucedemo.com/
  2. Leave the username field empty
  3. Leave the password field empty
  4. Click the 'Login' button

**Expected Results:**
  - Error message appears: 'Epic sadface: Username is required'
  - User remains on the login page
  - Form does not submit

#### 1.5. Login Validation - Empty Password

**File:** `tests/login/empty-password-validation.spec.ts`

**Steps:**
  1. Navigate to https://www.saucedemo.com/
  2. Enter 'standard_user' in the username field
  3. Leave the password field empty
  4. Click the 'Login' button

**Expected Results:**
  - Error message appears: 'Epic sadface: Password is required'
  - User remains on the login page
  - Form does not submit

#### 1.6. Logout Functionality

**File:** `tests/login/logout-functionality.spec.ts`

**Steps:**
  1. Navigate to https://www.saucedemo.com/
  2. Login with valid credentials (standard_user/secret_sauce)
  3. Verify successful login to inventory page
  4. Click the hamburger menu (three lines) in the top left
  5. Click the 'Logout' link in the menu

**Expected Results:**
  - Login is successful
  - User is redirected to inventory page
  - Hamburger menu opens and displays navigation options
  - Logout link is visible and clickable
  - User is redirected back to the login page
  - Session is completely cleared

### 2. Shopping Cart Functionality Tests

**Seed:** `tests/seed.spec.ts`

#### 2.1. Add Single Item to Cart

**File:** `tests/cart/add-single-item-to-cart.spec.ts`

**Steps:**
  1. Navigate to https://www.saucedemo.com/
  2. Login with 'standard_user' and 'secret_sauce'
  3. Verify inventory page loads with products
  4. Click 'Add to cart' button for 'Sauce Labs Backpack'
  5. Verify button text changes to 'Remove'
  6. Verify cart badge shows '1'

**Expected Results:**
  - Add to cart button changes to 'Remove' button
  - Cart badge shows count of 1
  - Product is successfully added to cart
  - Inventory page remains accessible

#### 2.2. Add Multiple Items to Cart

**File:** `tests/cart/add-multiple-items-to-cart.spec.ts`

**Steps:**
  1. Navigate to https://www.saucedemo.com/
  2. Login with valid credentials
  3. Add 'Sauce Labs Backpack' to cart
  4. Add 'Sauce Labs Bike Light' to cart
  5. Add 'Sauce Labs Bolt T-Shirt' to cart
  6. Verify cart badge shows '3'
  7. Verify all added items have 'Remove' buttons

**Expected Results:**
  - Multiple items are added to cart successfully
  - Cart badge shows correct total count
  - All Add to cart buttons change to Remove buttons
  - Cart maintains all added items

#### 2.3. Remove Item from Inventory Page

**File:** `tests/cart/remove-item-from-inventory.spec.ts`

**Steps:**
  1. Navigate to https://www.saucedemo.com/
  2. Login with valid credentials
  3. Add 'Sauce Labs Backpack' to cart
  4. Verify cart badge shows '1'
  5. Click 'Remove' button for 'Sauce Labs Backpack'
  6. Verify button text changes back to 'Add to cart'
  7. Verify cart badge shows no count or '0'

**Expected Results:**
  - Remove button changes back to 'Add to cart'
  - Cart badge count decreases by 1
  - Product is successfully removed from cart
  - Inventory page remains functional

#### 2.4. View Cart Page

**File:** `tests/cart/view-cart-page.spec.ts`

**Steps:**
  1. Navigate to https://www.saucedemo.com/
  2. Login with valid credentials
  3. Add 'Sauce Labs Backpack' to cart
  4. Click on cart icon/badge to navigate to cart page
  5. Verify cart page URL is '/cart.html'
  6. Verify product details are displayed correctly

**Expected Results:**
  - Cart page loads successfully
  - Shows 'Your Cart' title
  - Displays added product with correct details
  - Shows quantity, description, and price
  - Continue Shopping and Checkout buttons are visible

#### 2.5. Remove Item from Cart Page

**File:** `tests/cart/remove-item-from-cart-page.spec.ts`

**Steps:**
  1. Navigate to https://www.saucedemo.com/
  2. Login with valid credentials
  3. Add 'Sauce Labs Backpack' to cart
  4. Navigate to cart page
  5. Click 'Remove' button for the product
  6. Verify product is removed from cart
  7. Verify cart page updates correctly

**Expected Results:**
  - Product is removed from cart
  - Cart page updates to reflect removal
  - Continue Shopping and Checkout buttons remain functional
  - Cart badge count decreases appropriately

#### 2.6. Continue Shopping Functionality

**File:** `tests/cart/continue-shopping-functionality.spec.ts`

**Steps:**
  1. Navigate to https://www.saucedemo.com/
  2. Login with valid credentials
  3. Add item to cart
  4. Navigate to cart page
  5. Click 'Continue Shopping' button
  6. Verify navigation back to inventory page
  7. Verify cart badge still shows item count

**Expected Results:**
  - Continue Shopping button navigates back to inventory page
  - Cart contents are preserved
  - User can continue shopping
  - All cart functionality remains intact

#### 2.7. Empty Cart Functionality

**File:** `tests/cart/empty-cart-functionality.spec.ts`

**Steps:**
  1. Navigate to https://www.saucedemo.com/
  2. Login with valid credentials
  3. Add multiple items to cart
  4. Navigate to cart page
  5. Remove all items from cart
  6. Verify cart is empty
  7. Verify appropriate empty cart state is displayed

**Expected Results:**
  - All cart items are removed
  - Cart page shows empty state
  - Cart badge shows no count
  - Checkout button behavior with empty cart

### 3. Checkout Functionality Tests

**Seed:** `tests/seed.spec.ts`

#### 3.1. Checkout Information Form

**File:** `tests/checkout/checkout-information-form.spec.ts`

**Steps:**
  1. Navigate to https://www.saucedemo.com/
  2. Login with valid credentials
  3. Add item to cart
  4. Navigate to cart page
  5. Click 'Checkout' button
  6. Verify checkout step one page loads
  7. Verify all form fields are present and accessible

**Expected Results:**
  - Checkout button navigates to checkout step one
  - Checkout form loads with First Name, Last Name, and Zip Code fields
  - All form fields are properly labeled and accessible
  - Cancel and Continue buttons are visible

#### 3.2. Valid Checkout Information

**File:** `tests/checkout/valid-checkout-information.spec.ts`

**Steps:**
  1. Navigate to checkout step one
  2. Enter 'John' in First Name field
  3. Enter 'Doe' in Last Name field
  4. Enter '12345' in Zip Code field
  5. Click 'Continue' button
  6. Verify navigation to checkout step two

**Expected Results:**
  - Form submits successfully with valid information
  - User is navigated to checkout step two (overview)
  - All entered information is processed
  - Order summary displays correctly

#### 3.3. Checkout Validation - Missing First Name

**File:** `tests/checkout/checkout-validation-first-name.spec.ts`

**Steps:**
  1. Navigate to checkout step one
  2. Leave First Name field empty
  3. Enter 'Doe' in Last Name field
  4. Enter '12345' in Zip Code field
  5. Click 'Continue' button
  6. Verify error message appears
  7. Verify form does not submit

**Expected Results:**
  - Error message appears for missing first name
  - Form does not submit
  - User remains on checkout step one
  - Other fields retain entered values

#### 3.4. Checkout Validation - Missing Last Name

**File:** `tests/checkout/checkout-validation-last-name.spec.ts`

**Steps:**
  1. Navigate to checkout step one
  2. Enter 'John' in First Name field
  3. Leave Last Name field empty
  4. Enter '12345' in Zip Code field
  5. Click 'Continue' button
  6. Verify error message appears

**Expected Results:**
  - Error message appears for missing last name
  - Form does not submit
  - User remains on checkout step one

#### 3.5. Checkout Validation - Missing Zip Code

**File:** `tests/checkout/checkout-validation-zip-code.spec.ts`

**Steps:**
  1. Navigate to checkout step one
  2. Enter 'John' in First Name field
  3. Enter 'Doe' in Last Name field
  4. Leave Zip Code field empty
  5. Click 'Continue' button
  6. Verify error message appears

**Expected Results:**
  - Error message appears for missing zip code
  - Form does not submit
  - User remains on checkout step one

#### 3.6. Checkout Overview Page

**File:** `tests/checkout/checkout-overview-page.spec.ts`

**Steps:**
  1. Navigate through checkout with valid information
  2. Verify checkout overview page displays
  3. Verify order summary is correct
  4. Verify payment and shipping information
  5. Verify price calculations are accurate

**Expected Results:**
  - Checkout overview page loads correctly
  - Shows order summary with item details
  - Displays payment information (SauceCard #31337)
  - Shows shipping information (Free Pony Express Delivery!)
  - Displays price breakdown: Item total, Tax, and Total
  - Cancel and Finish buttons are visible

#### 3.7. Checkout Cancel Functionality

**File:** `tests/checkout/checkout-cancel-functionality.spec.ts`

**Steps:**
  1. Navigate to checkout overview page
  2. Click 'Cancel' button
  3. Verify navigation back to cart page
  4. Verify cart contents are preserved
  5. Verify no order was placed

**Expected Results:**
  - Cancel button navigates back to cart page
  - Order information is preserved
  - User can modify cart or continue checkout
  - No order is placed

#### 3.8. Successful Order Completion

**File:** `tests/checkout/successful-order-completion.spec.ts`

**Steps:**
  1. Navigate through complete checkout flow
  2. Click 'Finish' button on overview page
  3. Verify navigation to checkout complete page
  4. Verify 'Thank you for your order!' message
  5. Verify order completion confirmation

**Expected Results:**
  - Order is successfully completed
  - User is navigated to order confirmation page
  - Thank you message is displayed
  - Order completion details are shown
  - Back Home button is available

#### 3.9. Post Order Navigation

**File:** `tests/checkout/post-order-navigation.spec.ts`

**Steps:**
  1. Complete a successful order
  2. Click 'Back Home' button
  3. Verify navigation to inventory page
  4. Verify cart is empty
  5. Verify new shopping session can begin

**Expected Results:**
  - Back Home button navigates to inventory page
  - Cart is cleared after successful order
  - User can start a new shopping session
  - Order completion flow is complete

### 4. User Experience and Edge Cases

**Seed:** `tests/seed.spec.ts`

#### 4.1. Product Sorting Functionality

**File:** `tests/ux/product-sorting-functionality.spec.ts`

**Steps:**
  1. Login and navigate to inventory page
  2. Verify default sorting is Name (A to Z)
  3. Change sorting to Name (Z to A) and verify order
  4. Change sorting to Price (low to high) and verify order
  5. Change sorting to Price (high to low) and verify order
  6. Add item to cart and verify sorting preserves cart state

**Expected Results:**
  - Products are sorted alphabetically A-Z by default
  - Name (Z to A) sorts products in reverse alphabetical order
  - Price (low to high) sorts products by ascending price
  - Price (high to low) sorts products by descending price
  - Sorting maintains cart state

#### 4.2. Problem User Experience

**File:** `tests/ux/problem-user-experience.spec.ts`

**Steps:**
  1. Login with 'problem_user' credentials
  2. Navigate to inventory page
  3. Observe and document visual issues
  4. Add items to cart despite visual problems
  5. Complete checkout flow
  6. Verify order completion works

**Expected Results:**
  - problem_user experiences visual issues with product images
  - Cart functionality works despite image issues
  - Checkout flow completes successfully
  - Order can be placed despite visual problems

#### 4.3. Performance Glitch User Experience

**File:** `tests/ux/performance-glitch-user-experience.spec.ts`

**Steps:**
  1. Login with 'performance_glitch_user' credentials
  2. Navigate inventory with extended timeouts
  3. Add items to cart with patience for delays
  4. Complete checkout flow with appropriate wait times
  5. Verify all functionality works despite performance issues

**Expected Results:**
  - performance_glitch_user experiences slower page loads
  - All functionality works but with delays
  - Cart operations complete successfully
  - Checkout flow works with extended timeouts

#### 4.4. Cart State Persistence

**File:** `tests/ux/cart-state-persistence.spec.ts`

**Steps:**
  1. Login and add items to cart
  2. Navigate between pages and verify cart persists
  3. Logout and login again, verify cart state
  4. Refresh browser and verify cart maintains items
  5. Test cart persistence across user actions

**Expected Results:**
  - Cart state is preserved across page navigation
  - Login/logout cycles maintain cart before login
  - Browser refresh maintains cart state
  - Cart survives user session management

#### 4.5. URL Access Protection

**File:** `tests/security/url-access-protection.spec.ts`

**Steps:**
  1. Navigate directly to /inventory.html without login
  2. Navigate directly to /cart.html without login
  3. Navigate directly to /checkout-step-one.html without login
  4. Verify all protected pages redirect to login
  5. Verify proper authentication flow is enforced

**Expected Results:**
  - Direct URL access to protected pages redirects to login
  - Cart page requires authentication
  - Checkout pages require authentication
  - Proper error handling for unauthorized access
