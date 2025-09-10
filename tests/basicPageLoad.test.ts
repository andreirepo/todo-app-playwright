import { test, expect } from '@playwright/test';

test('should load todo homepage', async ({ page }) => {
  // Navigate to the base URL defined in environment variables
  await page.goto('/');

  // Simple assertion to check that the page loaded
  const header = page.locator('h1');
  await expect(header).toBeVisible();
  await expect(header).toContainText(/Welcome back/);
});
