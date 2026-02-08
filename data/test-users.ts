// Test Data Management - User Credentials
export const testUsers = {
  STANDARD: {
    username: 'standard_user',
    password: 'secret_sauce',
    description: 'Standard user with normal functionality'
  },
  LOCKED_OUT: {
    username: 'locked_out_user',
    password: 'secret_sauce',
    description: 'User that has been locked out'
  },
  PROBLEM: {
    username: 'problem_user',
    password: 'secret_sauce',
    description: 'User with inventory image problems'
  },
  PERFORMANCE_GLITCH: {
    username: 'performance_glitch_user',
    password: 'secret_sauce',
    description: 'User with performance delays'
  },
  ERROR: {
    username: 'error_user',
    password: 'secret_sauce',
    description: 'User that experiences errors'
  },
  VISUAL: {
    username: 'visual_user',
    password: 'secret_sauce',
    description: 'User with visual differences'
  },
  INVALID: {
    username: 'invalid_user',
    password: 'wrong_password',
    description: 'Invalid credentials for negative testing'
  }
};

export const errorMessages = {
  LOCKED_OUT: 'Epic sadface: Sorry, this user has been locked out.',
  INVALID_CREDENTIALS: 'Epic sadface: Username and password do not match any user in this service',
  USERNAME_REQUIRED: 'Epic sadface: Username is required',
  PASSWORD_REQUIRED: 'Epic sadface: Password is required'
};

export const testUrls = {
  LOGIN_PAGE: 'https://www.saucedemo.com/',
  INVENTORY_PAGE: 'https://www.saucedemo.com/inventory.html'
};