import { expect, test } from '@playwright/test';
import { signIn } from './fixtures/auth';
import { TODO_INPUT_PLACEHOLDER } from './locators';

const skipWithoutCredentials = () =>
  !process.env.TEST_USER_EMAIL || !process.env.TEST_USER_PASSWORD;

test.describe('Todo app – critical flows', () => {
  test.beforeEach(async ({ page }, testInfo) => {
    if (skipWithoutCredentials()) {
      testInfo.skip(true, 'Requires TEST_USER_EMAIL and TEST_USER_PASSWORD in config/.env.dev');
      return;
    }
    await signIn(page);
  });

  test('user can sign in and sees the todo app', async ({ page }) => {
    const todoInput = page.getByPlaceholder(TODO_INPUT_PLACEHOLDER).first();
    await expect(todoInput).toBeVisible({ timeout: 5000 });
  });

  test('user can add a new todo and it appears in the list', async ({ page }) => {
    const newTodoText = `E2E test todo ${Date.now()}`;
    const input = page.getByPlaceholder(TODO_INPUT_PLACEHOLDER).first();
    await expect(input).toBeVisible({ timeout: 5000 });
    await input.fill(newTodoText);
    await input.press('Enter');
    await expect(page.getByText(newTodoText)).toBeVisible({ timeout: 5000 });
  });

  test('user can complete a todo', async ({ page }) => {
    const newTodoText = `Complete me ${Date.now()}`;
    const input = page.getByPlaceholder(TODO_INPUT_PLACEHOLDER).first();
    await expect(input).toBeVisible({ timeout: 5000 });
    await input.fill(newTodoText);
    await input.press('Enter');
    await expect(page.getByText(newTodoText)).toBeVisible({ timeout: 5000 });

    const todoRow = page.getByRole('heading', { name: newTodoText }).locator('..').locator('..');
    const completeButton = todoRow.getByRole('button').nth(1);
    await completeButton.click();
    await expect(page.getByText(newTodoText)).toBeHidden({ timeout: 5000 });
  });
});
