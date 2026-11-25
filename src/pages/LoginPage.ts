import BasePage from './BasePage';

/**
 * Page Object for the Login screen of the Sauce Labs Mobile Sample App.
 *
 * App: https://github.com/saucelabs/sample-app-mobile
 * Version: 2.7.1
 *
 * Selectors use accessibility IDs prefixed with "test-" as defined
 * in the sample app's source code.
 */
export default class LoginPage extends BasePage {
  // ============================================================
  // Selectors (Accessibility IDs)
  // ============================================================

  // Username text field
  private get usernameInput(): string {
    return '~test-Username';
  }

  // Password text field
  private get passwordInput(): string {
    return '~test-Password';
  }

  // Login button
  private get loginButton(): string {
    return '~test-LOGIN';
  }

  // Error message (shown when credentials are invalid)
  private get errorMessage(): string {
    return '~test-Error message';
  }

  // Product catalog screen header (visible after successful login)
  private get productScreenTitle(): string {
    return '~test-PRODUCTS';
  }

  // ============================================================
  // Action Methods
  // ============================================================

  /**
   * Fills in the login form with the provided credentials.
   */
  async enterCredentials(username: string, password: string): Promise<void> {
    await this.setValue(this.usernameInput, username);
    await this.setValue(this.passwordInput, password);
  }

  /**
   * Taps the login button.
   */
  async tapLoginButton(): Promise<void> {
    await this.clickElement(this.loginButton);
  }

  /**
   * Performs the complete login flow in a single step.
   */
  async performLogin(username: string, password: string): Promise<void> {
    await this.enterCredentials(username, password);
    await this.tapLoginButton();
  }

  /**
   * Dismisses the on-screen keyboard if open.
   */
  async dismissKeyboard(): Promise<void> {
    await this.hideKeyboard();
  }

  // ============================================================
  // Verification Methods
  // ============================================================

  /**
   * Checks whether the login screen is visible.
   */
  async isLoginScreenVisible(): Promise<boolean> {
    return this.isElementVisible(this.usernameInput);
  }

  /**
   * Checks whether the error message is visible.
   */
  async isErrorMessageVisible(): Promise<boolean> {
    return this.isElementVisible(this.errorMessage);
  }

  /**
   * Gets the error message text.
   */
  async getErrorMessageText(): Promise<string> {
    return this.getElementText(this.errorMessage);
  }

  /**
   * Checks whether the product screen is visible (successful login).
   */
  async isProductScreenVisible(): Promise<boolean> {
    return this.isElementVisible(this.productScreenTitle);
  }
}
