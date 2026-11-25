import BasePage from './BasePage';

/**
 * Page Object for the Cart screen of the SwagLabs demo app.
 */
export default class CartPage extends BasePage {
  // ============================================================
  // Selectors
  // ============================================================

  private get checkoutButton(): string {
    return '~test-CHECKOUT';
  }

  private get removeItemButton(): string {
    return '~test-REMOVE';
  }

  private get continueShoppingButton(): string {
    return '~test-CONTINUE SHOPPING';
  }

  // ============================================================
  // Cart content
  // ============================================================

  /**
   * Gets the number of items currently in the cart.
   * Each cart row has exactly one "test-Amount" quantity badge,
   * making it a reliable 1:1 item counter.
   */
  async getCartItemCount(): Promise<number> {
    const amountBadges = await $$('~test-Amount');
    return amountBadges.length;
  }

  /**
   * Checks whether the checkout button is visible.
   */
  async isCheckoutButtonVisible(): Promise<boolean> {
    return this.isElementVisible(this.checkoutButton);
  }

  /**
   * Checks whether the continue shopping button is visible.
   */
  async isContinueShoppingVisible(): Promise<boolean> {
    return this.isElementVisible(this.continueShoppingButton);
  }

  /**
   * Removes the first item from the cart.
   */
  async removeFirstItem(): Promise<void> {
    await this.clickElement(this.removeItemButton);
  }
}
