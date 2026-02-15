import { test as base } from '@playwright/test';
import { INVALID_CREDENTIALS_TEXT, TODO_INPUT_PLACEHOLDER } from '../locators';

const TEST_USER_EMAIL = process.env.TEST_USER_EMAIL;
const TEST_USER_PASSWORD = process.env.TEST_USER_PASSWORD;

const LOGIN_CREDENTIALS_ERROR =
  'Login failed: app showed "Invalid credentials". Check TEST_USER_EMAIL and TEST_USER_PASSWORD in config/.env.dev and that the user exists at the app.';

/**
 * Signs in with the dedicated test user. Fails immediately if the app shows "Invalid credentials".
 */
export async function signIn(page: import('@playwright/test').Page) {
  await page.goto('/');
  await page.getByLabel(/email/i).fill(TEST_USER_EMAIL!);
  await page.getByRole('textbox', { name: /password/i }).fill(TEST_USER_PASSWORD!);
  await page.getByRole('button', { name: /sign in/i }).click();

  const invalidCreds = page.getByText(INVALID_CREDENTIALS_TEXT);
  const todoInput = page.getByPlaceholder(TODO_INPUT_PLACEHOLDER).first();

  const result = await Promise.race([
    todoInput.waitFor({ state: 'visible', timeout: 15000 }).then(() => 'ok' as const),
    invalidCreds.waitFor({ state: 'visible', timeout: 15000 }).then(() => 'invalid' as const),
  ]).catch(() => 'timeout' as const);

  if (result === 'invalid') {
    throw new Error(LOGIN_CREDENTIALS_ERROR);
  }
  if (result === 'timeout') {
    throw new Error('Login failed: todo app UI did not appear within 15s. Check credentials and app availability.');
  }
}

/**
 * Fixture that provides a page already signed in as the test user.
 * Throws when credentials are missing. For conditional skip (e.g. skip with message when
 * env vars are unset), use `page` + `beforeEach(signIn)` and `testInfo.skip()` in the hook instead.
 */
export const test = base.extend<{ authenticatedPage: import('@playwright/test').Page }>({
  authenticatedPage: async ({ page }, use) => {
    if (!TEST_USER_EMAIL || !TEST_USER_PASSWORD) {
      throw new Error('Set TEST_USER_EMAIL and TEST_USER_PASSWORD in config/.env.dev (see config/.env.example)');
    }
    await signIn(page);
    await use(page);
  },
});
