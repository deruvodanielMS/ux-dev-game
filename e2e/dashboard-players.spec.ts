import { expect, test } from '@playwright/test';

import './global.d.ts';

test.describe('Dashboard - Main Flow', () => {
  test('should show login button on welcome page', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('[data-testid="login-button"]')).toBeVisible();
  });

  test('should handle dashboard access without auth', async ({ page }) => {
    // Try to access dashboard directly
    await page.goto('/dashboard');

    // Should redirect to welcome page or show login
    const currentUrl = page.url();

    if (currentUrl.includes('/dashboard')) {
      // If somehow on dashboard, check for login prompt or error state
      const loginButton = page.locator('[data-testid="login-button"]');
      const errorMessage = page.locator('text=/login|sign|auth/i');

      const hasLoginOption = await loginButton.isVisible().catch(() => false);
      const hasErrorMessage = await errorMessage
        .first()
        .isVisible()
        .catch(() => false);

      expect(hasLoginOption || hasErrorMessage).toBeTruthy();
    } else {
      // Redirected to welcome - this is the expected behavior
      await expect(page.locator('[data-testid="login-button"]')).toBeVisible();
    }
  });

  test.skip('should load players list when authenticated', async ({ page }) => {
    // Mock basic auth for testing API calls
    await page.addInitScript(() => {
      localStorage.setItem('auth-test', 'true');
      window.__mockAuth0 = {
        isAuthenticated: true,
        user: {
          sub: 'test-user',
          name: 'Test User',
          email: 'test@example.com',
          picture: 'https://example.com/avatar.jpg',
        },
      };
    });

    await page.goto('/dashboard');

    // Check if players section loads (API call happens)
    const playersSection = page
      .locator('[data-testid="players-list"], .players, text=/players/i')
      .first();
    await expect(playersSection).toBeVisible({ timeout: 10000 });
  });
});
