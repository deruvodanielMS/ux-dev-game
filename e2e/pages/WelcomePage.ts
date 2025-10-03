import type { Page } from '@playwright/test';

/**
 * Page Object Model for the Welcome Page using data-testid for stable selectors
 */
export class WelcomePage {
  constructor(private page: Page) {}

  // Main welcome container
  get welcomePage() {
    return this.page.getByTestId('welcome-page');
  }

  get heroSection() {
    return this.page.getByTestId('hero-section');
  }

  get title() {
    return this.page.getByTestId('welcome-title');
  }

  get subtitle() {
    return this.page.getByTestId('welcome-subtitle');
  }

  get authButtonContainer() {
    return this.page.getByTestId('auth-button-container');
  }

  get loginButton() {
    // Now there's only one login button on the page (in the welcome page)
    return this.page.getByTestId('login-button');
  }

  get logoutButton() {
    return this.page.getByTestId('logout-button');
  }

  // Actions
  async navigate() {
    await this.page.goto('/');
  }

  async clickLogin() {
    await this.loginButton.click();
  }

  async clickLogout() {
    await this.logoutButton.click();
  }

  async waitForLoad() {
    await this.page.waitForLoadState('networkidle');
    await this.title.waitFor({ state: 'visible' });
  }

  // Assertions
  async isLoaded() {
    return await this.title.isVisible();
  }

  async hasTitle() {
    return await this.title.isVisible();
  }

  async hasSubtitle() {
    return await this.subtitle.isVisible();
  }

  async hasLoginButton() {
    return await this.loginButton.isVisible();
  }

  async hasLogoutButton() {
    return await this.logoutButton.isVisible();
  }

  async hasAuthButton() {
    return await this.authButtonContainer.isVisible();
  }
}
