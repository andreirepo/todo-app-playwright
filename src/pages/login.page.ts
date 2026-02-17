import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page';
import { LoginSelectors } from '../selectors/login.selectors';
import { CommonSelectors } from '../selectors/common.selectors';

/**
 * Login page object implementation with data-id selectors
 */
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

  private get forgotPasswordLink(): Locator {
    return this.page.locator(LoginSelectors.FORGOT_PASSWORD_LINK);
  }

  private get registerLink(): Locator {
    return this.page.locator(LoginSelectors.REGISTER_LINK);
  }

  private get loginForm(): Locator {
    return this.page.locator(LoginSelectors.LOGIN_FORM);
  }

  private get recaptchaContainer(): Locator {
    return this.page.locator(LoginSelectors.RECAPTCHA_CONTAINER);
  }

  // Common selectors
  private get header(): Locator {
    return this.page.locator(CommonSelectors.HEADER);
  }

  private get logo(): Locator {
    return this.page.locator(CommonSelectors.LOGO);
  }

  constructor(page: Page) {
    super(page);
  }

  /**
   * Perform login with provided credentials
   */
  async login(email: string, password: string): Promise<void> {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.signInButton.click();
  }

  /**
   * Wait for error message to appear
   */
  async waitForErrorMessage(): Promise<void> {
    await this.waitForElementVisible(this.errorMessage);
  }

  /**
   * Check if error message is visible
   */
  async isErrorMessageVisible(): Promise<boolean> {
    return await this.errorMessage.isVisible();
  }

  /**
   * Click forgot password link
   */
  async clickForgotPassword(): Promise<void> {
    await this.forgotPasswordLink.click();
  }

  /**
   * Click register link
   */
  async clickRegister(): Promise<void> {
    await this.registerLink.click();
  }

  /**
   * Check if login form is visible
   */
  async isLoginFormVisible(): Promise<boolean> {
    return await this.loginForm.isVisible();
  }

  /**
   * Check if recaptcha is visible
   */
  async isRecaptchaVisible(): Promise<boolean> {
    return await this.recaptchaContainer.isVisible();
  }

  /**
   * Get error message text
   */
  async getErrorMessageText(): Promise<string> {
    return await this.errorMessage.textContent() || '';
  }

  /**
   * Verify page is loaded correctly
   */
  async verifyPageLoaded(): Promise<void> {
    await this.waitForElementVisible(this.loginForm);
    await this.waitForElementVisible(this.emailInput);
    await this.waitForElementVisible(this.passwordInput);
    await this.waitForElementVisible(this.signInButton);
  }
}