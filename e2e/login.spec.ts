import { expect, test } from '@playwright/test';

import { WelcomePage } from './pages/WelcomePage';

test.describe('Login Flow - Simplified', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display login button', async ({ page }) => {
    const welcomePage = new WelcomePage(page);
    await expect(welcomePage.loginButton).toBeVisible();
  });

  test('should show welcome content', async ({ page }) => {
    await expect(page.locator('h1')).toContainText(
      /code duel|duelo|código|robot/i,
    );
  });

  test('should handle login click', async ({ page }) => {
    const welcomePage = new WelcomePage(page);
    await welcomePage.clickLogin();
    // Should remain on same page without Auth0 configured
    await expect(page).toHaveURL('/');
  });

  test('should redirect protected routes to welcome', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page).toHaveURL('/');
  });
});
