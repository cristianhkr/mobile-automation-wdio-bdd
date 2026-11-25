import BasePage from './BasePage';

/**
 * Page Object for the Product Catalog screen of the SwagLabs demo app.
 * Covers: add to cart, cart badge, sorting and the side menu.
 */
export default class ProductsPage extends BasePage {
  // ============================================================
  // Selectors
  // ============================================================

  private get productsHeader(): string {
    return '~test-PRODUCTS';
  }

  private get menuButton(): string {
    return '~test-Menu';
  }

  private get cartButton(): string {
    return '~test-Cart';
  }

  private get sortButton(): string {
    return '~test-Modal Selector Button';
  }

  private get logoutButton(): string {
    return '~test-LOGOUT';
  }

  // The badge counter is a TextView nested inside the cart icon container
  private get cartBadge(): string {
    return '//android.view.ViewGroup[@content-desc="test-Cart"]//android.widget.TextView';
  }

  // ============================================================
  // Screen state
  // ============================================================

  /**
   * Checks whether the product catalog is visible.
   * Generous default: the RN app re-renders slowly on CI emulators.
   */
  async isProductsScreenVisible(timeout: number = 30000): Promise<boolean> {
    return this.isElementVisible(this.productsHeader, timeout);
  }

  // ============================================================
  // Product actions
  // ============================================================

  /**
   * Adds the first product shown on screen to the cart.
   */
  async addFirstProductToCart(): Promise<void> {
    const buttons = await $$('~test-ADD TO CART');
    await buttons[0].click();
  }

  /**
   * Checks whether the first product's button switched to "REMOVE"
   * (i.e., the product was added successfully).
   */
  async isFirstProductAdded(): Promise<boolean> {
    return this.isElementVisible('~test-REMOVE');
  }

  /**
   * Gets the cart badge counter text (e.g., "1").
   */
  async getCartBadgeText(): Promise<string> {
    return this.getElementText(this.cartBadge);
  }

  /**
   * Gets the title of the first product on screen.
   */
  async getFirstProductTitle(): Promise<string> {
    const titles = await $$('~test-Item title');
    return titles[0].getText();
  }

  // ============================================================
  // Sorting
  // ============================================================

  /**
   * Opens the sort modal and selects the given option
   * (e.g., "Price (low to high)", "Name (Z to A)").
   */
  async sortBy(option: string): Promise<void> {
    await this.clickElement(this.sortButton);
    const optionSelector = `//android.widget.TextView[@text="${option}"]`;
    await this.clickElement(optionSelector, 10000);
    // Wait until the sort modal is dismissed before continuing
    await this.waitForElementHidden(optionSelector, 10000);
  }

  // ============================================================
  // Navigation
  // ============================================================

  /**
   * Opens the cart screen.
   */
  async openCart(): Promise<void> {
    await this.clickElement(this.cartButton);
  }

  /**
   * Opens the side menu and taps LOGOUT.
   */
  async logout(): Promise<void> {
    await this.clickElement(this.menuButton);
    await this.clickElement(this.logoutButton);
  }

  /**
   * Opens the side menu and taps "RESET APP STATE".
   * Clears the cart (and any other app state) while keeping the session —
   * the fast, in-app way to guarantee a clean cart between scenarios.
   */
  async resetAppState(): Promise<void> {
    await this.clickElement(this.menuButton);
    await this.clickElement('~test-RESET APP STATE');
    // The drawer may stay open after resetting — close it if so
    if (await this.isElementVisible('~test-Close', 3000)) {
      await this.clickElement('~test-Close');
    }
  }
}
