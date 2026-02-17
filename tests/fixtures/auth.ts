import { test as base } from '@playwright/test';
import { LoginPage } from '../../src/pages/login.page';
import { PageFactory } from '../../src/pages/page-factory';

const TEST_USER_EMAIL = process.env.TEST_USER_EMAIL;
const TEST_USER_PASSWORD = process.env.TEST_USER_PASSWORD;

const LOGIN_CREDENTIALS_ERROR =
  'Login failed: app showed "Invalid credentials". Check TEST_USER_EMAIL and TEST_USER_PASSWORD in config/.env.dev and that the user exists at the app.';

/**
 * Signs in with the dedicated test user. Fails immediately if the app shows "Invalid credentials".
 */
export async function signIn(page: import('@playwright/test').Page): Promise<void> {
  const loginPage = PageFactory.createLoginPage(page);
  
  await loginPage.navigateTo('/');
  await loginPage.verifyPageLoaded();
  
  await loginPage.login(TEST_USER_EMAIL!, TEST_USER_PASSWORD!);
  
  // Verify login was successful by checking for todo app elements
  const todoPage = PageFactory.createTodoPage(page);
  await todoPage.verifyTodoListLoaded();
}

/**
 * Fixture that provides a page already signed in as the test user.
 * Throws when credentials are missing. For conditional skip (e.g. skip with message when
 * env vars are unset), use `page` + `beforeEach(signIn)` and `testInfo.skip()` in the hook instead.
 */
export const test = base.extend<{
  authenticatedPage: import('@playwright/test').Page;
  loginPage: LoginPage;
  todoPage: import('../../src/pages/todo.page').TodoPage;
}>({
  loginPage: async ({ page }, use) => {
    const loginPage = PageFactory.createLoginPage(page);
    await use(loginPage);
  },

  todoPage: async ({ page }, use) => {
    const todoPage = PageFactory.createTodoPage(page);
    await use(todoPage);
  },

  authenticatedPage: async ({ page }, use) => {
    if (!TEST_USER_EMAIL || !TEST_USER_PASSWORD) {
      throw new Error('Set TEST_USER_EMAIL and TEST_USER_PASSWORD in config/.env.dev (see config/.env.example)');
    }
    
    const loginPage = PageFactory.createLoginPage(page);
    await loginPage.navigateTo('/');
    await loginPage.verifyPageLoaded();
    await loginPage.login(TEST_USER_EMAIL!, TEST_USER_PASSWORD!);
    
    const todoPage = PageFactory.createTodoPage(page);
    await todoPage.verifyTodoListLoaded();
    
    await use(page);
  },
});