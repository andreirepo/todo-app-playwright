import { Page, Locator, expect } from '@playwright/test';

/**
 * Base page class that provides common functionality for all page objects
 */
export abstract class BasePage {
  protected page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Navigate to a specific URL
   */
  async navigateTo(url: string): Promise<void> {
    await this.page.goto(url);
    await this.waitForPageLoad();
  }

  /**
   * Wait for the page to be fully loaded
   */
  async waitForPageLoad(): Promise<void> {
    await this.page.waitForLoadState('domcontentloaded');
  }

  /**
   * Wait for an element to be visible
   */
  async waitForElementVisible(locator: Locator, timeout = 5000): Promise<void> {
    await expect(locator).toBeVisible({ timeout });
  }

  /**
   * Wait for an element to be hidden
   */
  async waitForElementHidden(locator: Locator, timeout = 5000): Promise<void> {
    await expect(locator).toBeHidden({ timeout });
  }

  /**
   * Wait for an element to be enabled
   */
  async waitForElementEnabled(locator: Locator, timeout = 5000): Promise<void> {
    await expect(locator).toBeEnabled({ timeout });
  }

  /**
   * Take a screenshot with a descriptive name
   */
  async takeScreenshot(name: string): Promise<void> {
    await this.page.screenshot({ 
      path: `screenshots/${name}.png`,
      fullPage: true 
    });
  }

  /**
   * Wait for network to be idle
   */
  async waitForNetworkIdle(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Clear local storage
   */
  async clearLocalStorage(): Promise<void> {
    await this.page.evaluate(() => localStorage.clear());
  }

  /**
   * Clear cookies
   */
  async clearCookies(): Promise<void> {
    await this.page.context().clearCookies();
  }
}