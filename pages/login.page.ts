import { expect, type Page } from '@playwright/test';
import { testUrls } from '../data/test-users';

export class LoginPage {
  constructor(private _page: Page) {}

  // Expose page for utils access
  get page(): Page {
    return this._page;
  }

  // Locators - Using Playwright Best Practices
  get usernameInput() { return this._page.getByRole('textbox', { name: /username/i }); }
  get passwordInput() { return this._page.getByRole('textbox', { name: /password/i }); }
  get loginButton() { return this._page.getByRole('button', { name: /login/i }); }
  get errorMessage() { 
    return this._page.getByText(/epic sadface/i).or(
      this._page.locator('[data-test="error"]')
    );
  }
  get swagLabsTitle() { return this._page.getByRole('banner').getByText('Swag Labs').or(this._page.getByText('Swag Labs').first()); }
  get acceptedUsersSection() { return this._page.getByText('Accepted usernames are:'); }
  get passwordSection() { return this._page.getByText('Password for all users:'); }
  
  // Actions
  async navigateTo() {
    await this._page.goto(testUrls.LOGIN_PAGE);
  }

  async verifyPageElements() {
    await expect(this.usernameInput).toBeVisible();
    await expect(this.passwordInput).toBeVisible();
    await expect(this.loginButton).toBeVisible();
    try {
      await expect(this.swagLabsTitle).toBeVisible();
    } catch {
      // Fallback: just check if we're on the login page
      await expect(this._page.getByText('Swag Labs')).toBeVisible();
    }
  }

  async enterCredentials(username: string, password: string) {
    if (username) await this.usernameInput.fill(username);
    if (password) await this.passwordInput.fill(password);
  }

  async clickLogin() {
    await this.loginButton.click();
  }

  async login(username: string, password: string) {
    await this.enterCredentials(username, password);
    await this.clickLogin();
  }

  async verifyErrorMessage(expectedMessage: string) {
    await expect(this.errorMessage).toBeVisible();
    await expect(this.errorMessage).toContainText(expectedMessage);
  }

  async verifyCurrentUrl() {
    expect(this._page.url()).toBe(testUrls.LOGIN_PAGE);
  }
}