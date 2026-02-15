import { test, expect } from '@playwright/test';

test('should load todo homepage', async ({ page }) => {
  await page.goto('/');

  // Simple assertion to check that the page loaded
  const header = page.getByRole('heading', { level: 1 });
  await expect(header).toBeVisible();
  await expect(header).toContainText(/Welcome back/);
});
