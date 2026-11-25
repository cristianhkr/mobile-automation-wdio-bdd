import { Given, When, Then } from '@wdio/cucumber-framework';
import LoginPage from '../pages/LoginPage';
import ProductsPage from '../pages/ProductsPage';
import CartPage from '../pages/CartPage';

const loginPage = new LoginPage();
const productsPage = new ProductsPage();
const cartPage = new CartPage();

// ============================================================
// Given
// ============================================================

Given('the user is logged in', async function () {
  await loginPage.performLogin('standard_user', 'secret_sauce');
  const isProductsVisible = await productsPage.isProductsScreenVisible();
  if (!isProductsVisible) {
    throw new Error('Product catalog was not displayed after login');
  }
});

Given("the user's cart is empty", async function () {
  // In-app reset: fast and keeps the session alive
  await productsPage.resetAppState();
});

Given('the user has a product in the cart', async function () {
  await productsPage.addFirstProductToCart();
  // A Given must guarantee state, not just perform an action: verify the
  // add actually registered (the first product's button switched to REMOVE)
  if (!(await productsPage.isFirstProductAdded())) {
    throw new Error('Product was not added to the cart');
  }
});

// ============================================================
// When
// ============================================================

When('the user adds the first product to the cart', async function () {
  await productsPage.addFirstProductToCart();
});

When('the user opens the cart', async function () {
  await productsPage.openCart();
  // Completing "open the cart" means the cart screen is actually rendered —
  // otherwise a subsequent count would run on a half-drawn screen (CI slowness)
  await cartPage.waitForCartScreen();
});

When('the user sorts products by {string}', async function (option: string) {
  await productsPage.sortBy(option);
});

When('the user opens the menu and logs out', async function () {
  await productsPage.logout();
});

// ============================================================
// Then
// ============================================================

Then('the cart badge shows {string}', async function (expectedBadge: string) {
  const badgeText = await productsPage.getCartBadgeText();
  expect(badgeText).toBe(expectedBadge);
});

Then('the product button changes to {string}', async function (expectedLabel: string) {
  if (expectedLabel !== 'REMOVE') {
    throw new Error(`Unexpected button label expectation: ${expectedLabel}`);
  }
  const isAdded = await productsPage.isFirstProductAdded();
  if (!isAdded) {
    throw new Error('The product button did not change to REMOVE');
  }
  expect(isAdded).toBe(true);
});

Then('the cart shows {int} item', async function (expectedCount: number) {
  const itemCount = await cartPage.getCartItemCount();
  expect(itemCount).toBe(expectedCount);
});

Then('the checkout button is visible', async function () {
  const isVisible = await cartPage.isCheckoutButtonVisible();
  if (!isVisible) {
    throw new Error('Checkout button was not displayed in the cart');
  }
  expect(isVisible).toBe(true);
});

Then('the first product should be {string}', async function (expectedTitle: string) {
  const firstTitle = await productsPage.getFirstProductTitle();
  expect(firstTitle).toBe(expectedTitle);
});

Then('the login screen is visible again', async function () {
  const isVisible = await loginPage.isLoginScreenVisible();
  if (!isVisible) {
    throw new Error('Login screen was not displayed after logout');
  }
  expect(isVisible).toBe(true);
});
