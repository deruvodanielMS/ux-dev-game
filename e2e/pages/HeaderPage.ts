import type { Page } from '@playwright/test';

/**
 * Page Object Model for the Header using data-testid for stable selectors
 */
export class HeaderPage {
  constructor(private page: Page) {}

  // Main header container
  get header() {
    return this.page.getByTestId('header');
  }

  get brandRow() {
    return this.page.getByTestId('header-brand-row');
  }

  get logoButton() {
    return this.page.getByTestId('header-logo-button');
  }

  get brandText() {
    return this.page.getByTestId('header-brand-text');
  }

  // User section (when logged in)
  get userSection() {
    return this.page.getByTestId('header-user-section');
  }

  get avatarWrap() {
    return this.page.getByTestId('header-avatar-wrap');
  }

  get avatarButton() {
    return this.page.getByTestId('header-avatar-button');
  }

  get avatarImage() {
    return this.page.getByTestId('header-avatar-image');
  }

  get avatarPlaceholder() {
    return this.page.getByTestId('header-avatar-placeholder');
  }

  get levelBadge() {
    return this.page.getByTestId('header-level-badge');
  }

  get logoutButton() {
    return this.page.getByTestId('logout-button');
  }

  // Actions
  async clickLogo() {
    await this.logoButton.click();
  }

  async clickAvatar() {
    await this.avatarButton.click();
  }

  async clickLogout() {
    await this.logoutButton.click();
  }

  // Assertions
  async isLoaded() {
    return await this.header.isVisible();
  }

  async hasUserSection() {
    return await this.userSection.isVisible();
  }

  async hasAvatar() {
    return await this.avatarButton.isVisible();
  }

  async hasLogoutButton() {
    return await this.logoutButton.isVisible();
  }

  async getLevelText() {
    return await this.levelBadge.textContent();
  }
}
