import { Page } from '@playwright/test';
import { LoginPage } from './login.page';
import { TodoPage } from './todo.page';

/**
 * Page Factory for creating page objects
 */
export class PageFactory {
  /**
   * Create a LoginPage instance
   */
  static createLoginPage(page: Page): LoginPage {
    return new LoginPage(page);
  }

  /**
   * Create a TodoPage instance
   */
  static createTodoPage(page: Page): TodoPage {
    return new TodoPage(page);
  }
}