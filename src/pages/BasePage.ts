/**
 * Base class for the Page Object Model.
 * Provides reusable methods with explicit waits
 * for interacting with mobile elements.
 */
export default class BasePage {
  /**
   * Waits for an element to be visible and returns it.
   * @param selector - Element selector (e.g., '~accessibilityId', '-android uiautomator:...', '//xpath')
   * @param timeout - Maximum wait time in ms (default: 15000)
   */
  async waitForElementVisible(selector: string, timeout: number = 15000) {
    const element = $(selector);
    await element.waitForDisplayed({ timeout, reverse: false });
    return element;
  }

  /**
   * Waits for an element to exist in the DOM.
   */
  async waitForElementExist(selector: string, timeout: number = 15000) {
    const element = $(selector);
    await element.waitForExist({ timeout, reverse: false });
    return element;
  }

  /**
   * Waits for an element to no longer be visible.
   */
  async waitForElementHidden(selector: string, timeout: number = 15000): Promise<void> {
    const element = $(selector);
    await element.waitForDisplayed({ timeout, reverse: true });
  }

  /**
   * Clicks an element after ensuring it is visible.
   */
  async clickElement(selector: string, timeout: number = 15000): Promise<void> {
    const element = await this.waitForElementVisible(selector, timeout);
    await element.click();
  }

  /**
   * Sets the value of a text field.
   */
  async setValue(selector: string, value: string, timeout: number = 15000): Promise<void> {
    const element = await this.waitForElementVisible(selector, timeout);
    await element.clearValue();
    await element.setValue(value);
  }

  /**
   * Appends text to a field without clearing the existing value.
   */
  async addValue(selector: string, value: string, timeout: number = 15000): Promise<void> {
    const element = await this.waitForElementVisible(selector, timeout);
    await element.addValue(value);
  }

  /**
   * Gets the text content of an element.
   */
  async getElementText(selector: string, timeout: number = 15000): Promise<string> {
    const element = await this.waitForElementVisible(selector, timeout);
    return element.getText();
  }

  /**
   * Checks whether an element is visible.
   */
  async isElementVisible(selector: string, timeout: number = 15000): Promise<boolean> {
    const element = $(selector);
    try {
      await element.waitForDisplayed({ timeout, reverse: false });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Scrolls until an element with the given text is found.
   * Useful for long lists on Android.
   */
  async scrollToElement(text: string): Promise<void> {
    const selector = `android=new UiScrollable(new UiSelector().scrollable(true)).scrollIntoText("${text}")`;
    const element = $(selector);
    await element.click();
  }

  /**
   * Hides the on-screen keyboard on Android if visible.
   */
  async hideKeyboard(): Promise<void> {
    await browser.hideKeyboard();
  }

  /**
   * Pauses execution for a given duration (use sparingly).
   */
  async pause(ms: number): Promise<void> {
    await browser.pause(ms);
  }

  /**
   * Returns whether an element is enabled.
   */
  async isElementEnabled(selector: string, timeout: number = 15000): Promise<boolean> {
    const element = await this.waitForElementExist(selector, timeout);
    return element.isEnabled();
  }
}
