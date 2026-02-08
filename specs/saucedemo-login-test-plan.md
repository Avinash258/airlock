# SauceDemo Login Test Plan

## Application Overview

Test plan for the login functionality of SauceDemo (https://www.saucedemo.com/), an e-commerce demo website. The login system includes username/password authentication with predefined test users that exhibit different behaviors, making it ideal for comprehensive testing scenarios.

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
  - Error message is clearly displayed

#### 1.4. Login Validation - Empty Username

**File:** `tests/login/empty-username-validation.spec.ts`

**Steps:**
  1. Navigate to https://www.saucedemo.com/
  2. Leave the username field empty
  3. Leave the password field empty
  4. Click the 'Login' button

**Expected Results:**
  - Login page loads successfully
  - Error message appears: 'Epic sadface: Username is required'
  - User remains on the login page
  - Form does not submit
  - Username field is highlighted or marked as required

#### 1.5. Login Validation - Empty Password

**File:** `tests/login/empty-password-validation.spec.ts`

**Steps:**
  1. Navigate to https://www.saucedemo.com/
  2. Enter 'standard_user' in the username field
  3. Leave the password field empty
  4. Click the 'Login' button

**Expected Results:**
  - Login page loads successfully
  - Error message appears: 'Epic sadface: Password is required'
  - User remains on the login page
  - Form does not submit
  - Password field is highlighted or marked as required

#### 1.6. Login with Problem User

**File:** `tests/login/problem-user-login.spec.ts`

**Steps:**
  1. Navigate to https://www.saucedemo.com/
  2. Enter 'problem_user' in the username field
  3. Enter 'secret_sauce' in the password field
  4. Click the 'Login' button

**Expected Results:**
  - Login is successful
  - User is redirected to inventory page
  - Note: This user is designed to experience problems with inventory images
  - Login process itself should work normally

#### 1.7. Login with Performance Glitch User

**File:** `tests/login/performance-glitch-user-login.spec.ts`

**Steps:**
  1. Navigate to https://www.saucedemo.com/
  2. Enter 'performance_glitch_user' in the username field
  3. Enter 'secret_sauce' in the password field
  4. Click the 'Login' button

**Expected Results:**
  - Login is successful but may take longer than standard_user
  - User is redirected to inventory page
  - Note: This user simulates performance issues
  - Login process should complete within reasonable timeout

#### 1.8. Login with Error User

**File:** `tests/login/error-user-login.spec.ts`

**Steps:**
  1. Navigate to https://www.saucedemo.com/
  2. Enter 'error_user' in the username field
  3. Enter 'secret_sauce' in the password field
  4. Click the 'Login' button

**Expected Results:**
  - Login is successful
  - User is redirected to inventory page
  - Note: This user is designed to experience various errors in the application
  - Login process itself should work normally

#### 1.9. Login with Visual User

**File:** `tests/login/visual-user-login.spec.ts`

**Steps:**
  1. Navigate to https://www.saucedemo.com/
  2. Enter 'visual_user' in the username field
  3. Enter 'secret_sauce' in the password field
  4. Click the 'Login' button

**Expected Results:**
  - Login is successful
  - User is redirected to inventory page
  - Note: This user is designed to have visual differences in the application
  - Login process itself should work normally

#### 1.10. Logout Functionality

**File:** `tests/login/logout-functionality.spec.ts`

**Steps:**
  1. Navigate to https://www.saucedemo.com/
  2. Login with valid credentials (standard_user/secret_sauce)
  3. Verify successful login to inventory page
  4. Click the hamburger menu (three lines) in the top left
  5. Click the 'Logout' link in the menu

**Expected Results:**
  - Login is successful
  - Inventory page loads properly
  - Hamburger menu opens and displays navigation options
  - Logout link is visible and clickable
  - User is redirected back to the login page
  - Session is completely cleared

#### 1.11. Case Sensitivity Test

**File:** `tests/login/case-sensitivity-test.spec.ts`

**Steps:**
  1. Navigate to https://www.saucedemo.com/
  2. Enter 'STANDARD_USER' (uppercase) in the username field
  3. Enter 'secret_sauce' in the password field
  4. Click the 'Login' button

**Expected Results:**
  - Login fails with invalid credentials error
  - Error message appears: 'Epic sadface: Username and password do not match any user in this service'
  - Username field is case-sensitive
  - User remains on login page

#### 1.12. SQL Injection Attempt

**File:** `tests/login/sql-injection-security-test.spec.ts`

**Steps:**
  1. Navigate to https://www.saucedemo.com/
  2. Enter '; DROP TABLE users; --' in the username field
  3. Enter 'secret_sauce' in the password field
  4. Click the 'Login' button

**Expected Results:**
  - Login fails with invalid credentials error
  - System properly handles SQL injection attempt
  - No database errors or system crashes
  - Appropriate error message is displayed
  - Application remains stable
