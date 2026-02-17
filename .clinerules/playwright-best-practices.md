# Playwright Test Development Best Practices

## Table of Contents
1. [Project Structure & Organization](#project-structure--organization)
2. [Page Object Model Implementation](#page-object-model-implementation)
3. [Data-ID Selectors Strategy](#data-id-selectors-strategy)
4. [Configuration & Setup](#configuration--setup)
5. [Test Design & Architecture](#test-design--architecture)
6. [Locator Strategies](#locator-strategies)
7. [Performance & Reliability](#performance--reliability)
8. [Quality Assurance](#quality-assurance)
9. [CI/CD Integration](#cicd-integration)
10. [Advanced Patterns](#advanced-patterns)
11. [Common Pitfalls & Solutions](#common-pitfalls--solutions)
12. [Migration from WebDriver.io to Playwright](#migration-from-webdriverio-to-playwright)

## Project Structure & Organization

### Recommended Directory Structure

```
tests/
├── fixtures/           # Custom fixtures and test setup
├── pages/             # Page Object Model classes
├── selectors/         # Data-id selectors
├── utils/             # Helper functions and utilities
├── data/              # Test data and fixtures
├── tests/             # Test files
└── reports/           # Test reports and artifacts
```

### File Naming Conventions

- **Test files**: `*.e2e.ts`
- **Page objects**: `*.page.ts`
- **Selectors**: `*.selectors.ts`
- **Fixtures**: `*.fixture.ts`
- **Utilities**: `*.utils.ts`
- **Data files**: `*.data.ts`

### Example Structure

```typescript
// src/selectors/common.selectors.ts - Global selectors
// src/selectors/login.selectors.ts - Login page selectors
// src/selectors/dashboard.selectors.ts - Dashboard page selectors
// src/pages/base.page.ts - Base page class
// src/pages/login.page.ts - Login page implementation
// src/pages/dashboard.page.ts - Dashboard page implementation
// tests/fixtures/auth.ts - Authentication fixtures
// tests/utils/helpers.ts - Helper functions
```

## Page Object Model Implementation

### Base Page Class

Create a base page class that provides common functionality:

```typescript
// src/pages/base.page.ts
import { Page, Locator, expect } from '@playwright/test';

export abstract class BasePage {
  protected page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async navigateTo(url: string): Promise<void> {
    await this.page.goto(url);
    await this.waitForPageLoad();
  }

  async waitForPageLoad(): Promise<void> {
    await this.page.waitForLoadState('domcontentloaded');
  }

  async waitForElementVisible(locator: Locator, timeout = 5000): Promise<void> {
    await expect(locator).toBeVisible({ timeout });
  }

  async takeScreenshot(name: string): Promise<void> {
    await this.page.screenshot({ path: `screenshots/${name}.png` });
  }
}
```

### Page Object Implementation with Data-ID Selectors

```typescript
// src/pages/login.page.ts
import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page';
import { LoginSelectors } from '../selectors/login.selectors';

export class LoginPage extends BasePage {
  // Private selectors using getter pattern with data-id selectors
  private get emailInput(): Locator {
    return this.page.locator(LoginSelectors.EMAIL_INPUT);
  }

  private get passwordInput(): Locator {
    return this.page.locator(LoginSelectors.PASSWORD_INPUT);
  }

  private get signInButton(): Locator {
    return this.page.locator(LoginSelectors.SIGN_IN_BUTTON);
  }

  private get errorMessage(): Locator {
    return this.page.locator(LoginSelectors.ERROR_MESSAGE);
  }

  constructor(page: Page) {
    super(page);
  }

  async login(email: string, password: string): Promise<void> {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.signInButton.click();
  }

  async waitForErrorMessage(): Promise<void> {
    await this.waitForElementVisible(this.errorMessage);
  }

  async isErrorMessageVisible(): Promise<boolean> {
    return await this.errorMessage.isVisible();
  }
}
```

### Page Factory Pattern

```typescript
// src/pages/page-factory.ts
import { Page } from '@playwright/test';
import { LoginPage } from './login.page';
import { DashboardPage } from './dashboard.page';

export class PageFactory {
  static createLoginPage(page: Page): LoginPage {
    return new LoginPage(page);
  }

  static createDashboardPage(page: Page): DashboardPage {
    return new DashboardPage(page);
  }
}
```

## Data-ID Selectors Strategy

### Benefits of Separate Selector Files

1. **Centralized Management**: All selectors in one place for easy maintenance
2. **Type Safety**: TypeScript ensures selector names are consistent
3. **Reusability**: Selectors can be shared across multiple page objects
4. **Maintainability**: Changes to data-id attributes only require updates in selector files
5. **Readability**: Clear, descriptive selector names
6. **Flexibility**: Parameterized selectors for dynamic content
7. **Testing**: Easy to validate selector existence and uniqueness

### Common Selectors (Global Elements)

```typescript
// src/selectors/common.selectors.ts
export class CommonSelectors {
  // Header elements
  static readonly HEADER = '[data-id="header"]';
  static readonly LOGO = '[data-id="logo"]';
  static readonly USER_MENU = '[data-id="user-menu"]';
  static readonly NOTIFICATION_ICON = '[data-id="notification-icon"]';

  // Footer elements
  static readonly FOOTER = '[data-id="footer"]';
  static readonly COPYRIGHT_TEXT = '[data-id="copyright"]';

  // Modal elements
  static readonly MODAL_OVERLAY = '[data-id="modal-overlay"]';
  static readonly MODAL_CONTENT = '[data-id="modal-content"]';
  static readonly MODAL_TITLE = '[data-id="modal-title"]';

  // Form elements
  static readonly FORM_FIELD = (fieldName: string) => 
    `[data-id="form-field"][data-name="${fieldName}"]`;
  static readonly FORM_ERROR = (fieldName: string) => 
    `[data-id="form-error"][data-field="${fieldName}"]`;
  static readonly SUBMIT_BUTTON = '[data-id="submit-button"]';
  static readonly CANCEL_BUTTON = '[data-id="cancel-button"]';

  // Loading states
  static readonly SPINNER = '[data-id="spinner"]';
  static readonly PROGRESS_BAR = '[data-id="progress-bar"]';

  // Navigation
  static readonly BREADCRUMB = '[data-id="breadcrumb"]';
  static readonly PAGINATION = '[data-id="pagination"]';
  static readonly SEARCH_INPUT = '[data-id="search-input"]';
}
```

### Login Page Selectors

```typescript
// src/selectors/login.selectors.ts
export class LoginSelectors {
  static readonly EMAIL_INPUT = '[data-id="email-input"]';
  static readonly PASSWORD_INPUT = '[data-id="password-input"]';
  static readonly SIGN_IN_BUTTON = '[data-id="sign-in-button"]';
  static readonly ERROR_MESSAGE = '[data-id="error-message"]';
  static readonly FORGOT_PASSWORD_LINK = '[data-id="forgot-password-link"]';
  static readonly REGISTER_LINK = '[data-id="register-link"]';
  static readonly LOGIN_FORM = '[data-id="login-form"]';
  static readonly RECAPTCHA_CONTAINER = '[data-id="recaptcha-container"]';
}
```

### Dashboard Page Selectors with Parameters

```typescript
// src/selectors/dashboard.selectors.ts
export class DashboardSelectors {
  // Todo items
  static readonly TODO_ITEM = (todoText: string) => 
    `[data-id="todo-item"][data-text="${todoText}"]`;
  
  static readonly TODO_CHECKBOX = (todoText: string) => 
    `[data-id="todo-checkbox"][data-text="${todoText}"]`;
  
  static readonly TODO_DELETE_BUTTON = (todoText: string) => 
    `[data-id="todo-delete"][data-text="${todoText}"]`;
  
  static readonly TODO_EDIT_BUTTON = (todoText: string) => 
    `[data-id="todo-edit"][data-text="${todoText}"]`;

  // Navigation
  static readonly NAVIGATION_LINK = (linkName: string) => 
    `[data-id="nav-link"][data-name="${linkName}"]`;
  
  static readonly ACTIVE_NAVIGATION_LINK = '[data-id="nav-link"].active';

  // Modal elements
  static readonly MODAL_CLOSE_BUTTON = '[data-id="modal-close"]';
  static readonly MODAL_CONFIRM_BUTTON = '[data-id="modal-confirm"]';
  static readonly MODAL_CANCEL_BUTTON = '[data-id="modal-cancel"]';

  // Loading states
  static readonly LOADING_SPINNER = '[data-id="loading-spinner"]';
  static readonly LOADING_OVERLAY = '[data-id="loading-overlay"]';

  // Dashboard sections
  static readonly TODO_LIST = '[data-id="todo-list"]';
  static readonly STATISTICS_WIDGET = '[data-id="statistics-widget"]';
  static readonly ACTIVITY_FEED = '[data-id="activity-feed"]';
}
```

### Page Object Using Parameterized Selectors

```typescript
// src/pages/dashboard.page.ts
import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page';
import { DashboardSelectors } from '../selectors/dashboard.selectors';

export class DashboardPage extends BasePage {
  // Modal elements
  private get modalCloseButton(): Locator {
    return this.page.locator(DashboardSelectors.MODAL_CLOSE_BUTTON);
  }

  private get modalConfirmButton(): Locator {
    return this.page.locator(DashboardSelectors.MODAL_CONFIRM_BUTTON);
  }

  private get modalCancelButton(): Locator {
    return this.page.locator(DashboardSelectors.MODAL_CANCEL_BUTTON);
  }

  // Loading states
  private get loadingSpinner(): Locator {
    return this.page.locator(DashboardSelectors.LOADING_SPINNER);
  }

  private get loadingOverlay(): Locator {
    return this.page.locator(DashboardSelectors.LOADING_OVERLAY);
  }

  // Dashboard sections
  private get todoList(): Locator {
    return this.page.locator(DashboardSelectors.TODO_LIST);
  }

  // Parameterized selectors
  private todoItem(todoText: string): Locator {
    return this.page.locator(DashboardSelectors.TODO_ITEM(todoText));
  }

  private todoCheckbox(todoText: string): Locator {
    return this.page.locator(DashboardSelectors.TODO_CHECKBOX(todoText));
  }

  private todoDeleteButton(todoText: string): Locator {
    return this.page.locator(DashboardSelectors.TODO_DELETE_BUTTON(todoText));
  }

  private todoEditButton(todoText: string): Locator {
    return this.page.locator(DashboardSelectors.TODO_EDIT_BUTTON(todoText));
  }

  private navigationLink(linkName: string): Locator {
    return this.page.locator(DashboardSelectors.NAVIGATION_LINK(linkName));
  }

  constructor(page: Page) {
    super(page);
  }

  // Todo operations
  async addTodo(todoText: string): Promise<void> {
    const input = this.page.getByPlaceholder('What needs to be done?');
    await input.fill(todoText);
    await input.press('Enter');
  }

  async completeTodo(todoText: string): Promise<void> {
    await this.todoCheckbox(todoText).check();
  }

  async deleteTodo(todoText: string): Promise<void> {
    await this.todoDeleteButton(todoText).click();
  }

  async editTodo(todoText: string, newText: string): Promise<void> {
    await this.todoEditButton(todoText).click();
    const editInput = this.todoItem(todoText).locator('input[type="text"]');
    await editInput.fill(newText);
    await editInput.press('Enter');
  }

  // Navigation
  async navigateToSection(sectionName: string): Promise<void> {
    await this.navigationLink(sectionName).click();
  }

  // Modal operations
  async closeModal(): Promise<void> {
    await this.modalCloseButton.click();
  }

  async confirmModal(): Promise<void> {
    await this.modalConfirmButton.click();
  }

  async cancelModal(): Promise<void> {
    await this.modalCancelButton.click();
  }

  // Loading states
  async waitForLoadingToFinish(): Promise<void> {
    await this.loadingSpinner.waitFor({ state: 'hidden', timeout: 10000 });
    await this.loadingOverlay.waitFor({ state: 'hidden', timeout: 10000 });
  }

  // Assertions
  async isTodoVisible(todoText: string): Promise<boolean> {
    return await this.todoItem(todoText).isVisible();
  }

  async isTodoCompleted(todoText: string): Promise<boolean> {
    return await this.todoCheckbox(todoText).isChecked();
  }

  async getTodoText(todoText: string): Promise<string> {
    return await this.todoItem(todoText).textContent();
  }
}
```

## Configuration & Setup

### Playwright Configuration

```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['html'],
    ['json', { outputFile: 'test-results/results.json' }]
  ],
  
  use: {
    baseURL: process.env.BASE_URL || 'https://your-app.com',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'mobile-chrome',
      use: { ...devices['Pixel 5'] },
    },
  ],
});
```

### Environment Configuration

```typescript
// utils/config.ts
export interface Config {
  baseURL: string;
  timeout: number;
  retryAttempts: number;
}

export const config: Config = {
  baseURL: process.env.BASE_URL || 'https://your-app.com',
  timeout: parseInt(process.env.TIMEOUT || '30000'),
  retryAttempts: parseInt(process.env.RETRY_ATTEMPTS || '3'),
};
```

## Test Design & Architecture

### Test Organization

```typescript
// tests/auth/login.test.ts
import { test, expect } from '@playwright/test';
import { LoginPage } from '../../src/pages/login.page';
import { PageFactory } from '../../src/pages/page-factory';

test.describe('Authentication', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = PageFactory.createLoginPage(page);
    await loginPage.navigateTo('/login');
  });

  test('successful login with valid credentials', async () => {
    await loginPage.login('user@example.com', 'password123');
    await expect(page).toHaveURL('/dashboard');
  });

  test('failed login with invalid credentials', async () => {
    await loginPage.login('invalid@example.com', 'wrongpassword');
    await loginPage.waitForErrorMessage();
    expect(await loginPage.isErrorMessageVisible()).toBe(true);
  });
});
```

### Custom Fixtures

```typescript
// tests/fixtures/auth.ts
import { test as base } from '@playwright/test';
import { LoginPage } from '../../src/pages/login.page';
import { PageFactory } from '../../src/pages/page-factory';

const test = base.extend<{
  authenticatedPage: any;
  loginPage: LoginPage;
}>({
  loginPage: async ({ page }, use) => {
    const loginPage = PageFactory.createLoginPage(page);
    await use(loginPage);
  },

  authenticatedPage: async ({ page }, use) => {
    const loginPage = PageFactory.createLoginPage(page);
    await loginPage.navigateTo('/login');
    await loginPage.login(process.env.TEST_USER_EMAIL!, process.env.TEST_USER_PASSWORD!);
    await use(page);
  },
});

export { test };
```

## Locator Strategies

### Best Practices for Locators

1. **Use semantic selectors first**:
```typescript
// Preferred
page.getByRole('button', { name: 'Submit' });
page.getByLabel('Email');
page.getByPlaceholder('Enter your email');

// Avoid when possible
page.locator('#submit-btn');
page.locator('[data-testid="submit-btn"]');
```

2. **Create locator utilities**:
```typescript
// src/utils/locators.ts
export class LocatorUtils {
  static getByTestId(id: string): string {
    return `[data-testid="${id}"]`;
  }

  static getByRoleAndName(role: string, name: string): string {
    return `[role="${role}"][name="${name}"]`;
  }
}
```

3. **Page-specific locators**:
```typescript
// In page object
private get submitButton(): Locator {
  return this.page.getByRole('button', { name: /submit/i });
}
```

### Data-ID Selectors Strategy

For maintainable test automation, organize data-id selectors in separate files using a getter-setter strategy. This approach provides centralized management, type safety, and easy maintenance.

**Key Benefits:**
- Centralized selector management
- Type safety with TypeScript
- Reusable across multiple page objects
- Easy maintenance when UI changes
- Clear, descriptive naming

**Implementation:**
- Create separate selector files for each page/component
- Use static readonly properties for simple selectors
- Use static methods for parameterized selectors
- Implement getter methods in page objects
- Follow consistent naming conventions

For detailed implementation examples and best practices, see the [Data-ID Selectors Strategy Guide](./DATA_ID_SELECTORS_GUIDE.md).

## Performance & Reliability

### Wait Strategies

```typescript
// src/utils/wait-utils.ts
export class WaitUtils {
  static async waitForElementToBeClickable(page: Page, locator: Locator): Promise<void> {
    await expect(locator).toBeEnabled({ timeout: 10000 });
  }

  static async waitForElementToDisappear(page: Page, locator: Locator): Promise<void> {
    await expect(locator).toBeHidden({ timeout: 10000 });
  }

  static async waitForNetworkIdle(page: Page): Promise<void> {
    await page.waitForLoadState('networkidle');
  }
}
```

### Test Isolation

```typescript
// tests/utils/test-isolation.ts
export class TestIsolation {
  static async clearLocalStorage(page: Page): Promise<void> {
    await page.evaluate(() => localStorage.clear());
  }

  static async clearCookies(page: Page): Promise<void> {
    await page.context().clearCookies();
  }

  static async resetDatabase(): Promise<void> {
    // Implementation depends on your database setup
    await fetch('/api/test/reset', { method: 'POST' });
  }
}
```

## Quality Assurance

### Assertions Best Practices

```typescript
// src/utils/assertions.ts
export class CustomAssertions {
  static async expectElementToHaveText(locator: Locator, text: string): Promise<void> {
    await expect(locator).toHaveText(text);
  }

  static async expectElementToContainText(locator: Locator, text: string): Promise<void> {
    await expect(locator).toContainText(text);
  }

  static async expectUrlToContain(page: Page, path: string): Promise<void> {
    await expect(page).toHaveURL(new RegExp(path));
  }
}
```

### Screenshot and Video Management

```typescript
// tests/utils/screenshot-utils.ts
export class ScreenshotUtils {
  static async takeFullPageScreenshot(page: Page, name: string): Promise<void> {
    await page.screenshot({ 
      path: `screenshots/${name}.png`, 
      fullPage: true 
    });
  }

  static async takeElementScreenshot(locator: Locator, name: string): Promise<void> {
    await locator.screenshot({ path: `screenshots/${name}.png` });
  }
}
```

## CI/CD Integration

### Docker Configuration

```dockerfile
# Dockerfile.test
FROM mcr.microsoft.com/playwright:v1.40.0-jammy

WORKDIR /app
COPY package*.json ./
RUN npm ci

COPY . .
RUN npx playwright install

CMD ["npm", "run", "test"]
```

### GitHub Actions Workflow

```yaml
# .github/workflows/test.yml
name: Playwright Tests

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    timeout-minutes: 60
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
      - run: npm ci
      - run: npx playwright install
      - run: npm run test
      - uses: actions/upload-artifact@v4
        if: failure()
        with:
          name: playwright-report
          path: playwright-report/
          retention-days: 30
```

## Advanced Patterns

### API Testing Integration

```typescript
// tests/utils/api-client.ts
export class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  async createUser(userData: any): Promise<any> {
    const response = await fetch(`${this.baseURL}/api/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    return response.json();
  }
}
```

### Data-Driven Testing

```typescript
// tests/data/test-data.ts
export const testData = {
  validUsers: [
    { email: 'user1@example.com', password: 'password123' },
    { email: 'user2@example.com', password: 'password456' },
  ],
  invalidUsers: [
    { email: 'invalid@example.com', password: 'wrongpassword' },
    { email: '', password: 'password123' },
  ],
};
```

### Custom Commands

```typescript
// tests/utils/custom-commands.ts
export class CustomCommands {
  static async fillForm(page: Page, formData: Record<string, string>): Promise<void> {
    for (const [field, value] of Object.entries(formData)) {
      await page.getByLabel(field).fill(value);
    }
  }

  static async submitForm(page: Page, submitButtonText: string): Promise<void> {
    await page.getByRole('button', { name: submitButtonText }).click();
  }
}
```

## Common Pitfalls & Solutions

### 1. Flaky Tests

**Problem**: Tests fail intermittently due to timing issues.

**Solution**: Use proper waiting strategies and avoid hardcoded waits.

```typescript
// ❌ Bad
await page.waitForTimeout(5000);

// ✅ Good
await expect(page.getByText('Success')).toBeVisible();
```

### 2. Brittle Selectors

**Problem**: Tests break when UI changes slightly.

**Solution**: Use semantic selectors and data attributes.

```typescript
// ❌ Bad
page.locator('div > div > button');

// ✅ Good
page.getByRole('button', { name: 'Submit' });
```

### 3. Test Dependencies

**Problem**: Tests depend on each other's state.

**Solution**: Ensure test isolation and proper setup/teardown.

```typescript
// ✅ Good
test.beforeEach(async ({ page }) => {
  await TestIsolation.clearLocalStorage(page);
  await TestIsolation.clearCookies(page);
});
```

### 4. Poor Error Messages

**Problem**: Generic error messages make debugging difficult.

**Solution**: Use descriptive assertions and custom error messages.

```typescript
// ✅ Good
await expect(page.getByText('Welcome')).toBeVisible({
  timeout: 10000,
  message: 'Login failed: Welcome message not displayed'
});
```

### 5. Memory Leaks

**Problem**: Tests consume too much memory over time.

**Solution**: Proper cleanup and context management.

```typescript
// ✅ Good
test.afterEach(async ({ page }) => {
  await page.context().clearCookies();
});
```

## Conclusion

This guide provides comprehensive best practices for Playwright test development with proper Page Object Model implementation. Key takeaways:

1. **Structure matters**: Organize code logically with clear separation of concerns
2. **Page Objects are essential**: Create reusable, maintainable page abstractions
3. **Data-ID selectors strategy**: Use separate selector files with getter-setter pattern for maintainability
4. **Wait properly**: Use Playwright's built-in waiting mechanisms
5. **Test isolation**: Ensure tests don't depend on each other
6. **Handle failures gracefully**: Use proper error handling and debugging tools
7. **Optimize performance**: Use parallel execution and proper resource management

By following these practices, you'll create robust, maintainable, and reliable automated tests that scale with your application.

## Additional Resources

- [Data-ID Selectors Strategy Guide](./DATA_ID_SELECTORS_GUIDE.md) - Detailed implementation guide for data-id selectors
- [Playwright Documentation](https://playwright.dev/docs/intro) - Official Playwright documentation
- [Page Object Model Best Practices](https://playwright.dev/docs/pom) - Playwright POM patterns