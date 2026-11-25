import { Given, When, Then } from '@wdio/cucumber-framework';
import LoginPage from '../pages/LoginPage';

const loginPage = new LoginPage();

// ============================================================
// Given
// ============================================================

Given('the user is on the login screen', async function () {
  const isVisible = await loginPage.isLoginScreenVisible();
  expect(isVisible).toBe(true);
});

// ============================================================
// When
// ============================================================

When(
  'they enter username {string} and password {string}',
  async function (username: string, password: string) {
    await loginPage.enterCredentials(username, password);
  },
);

When('they tap the {string} button', async function (_buttonName: string) {
  await loginPage.tapLoginButton();
});

// ============================================================
// Then
// ============================================================

Then('they should see the product catalog screen', async function () {
  const isProductVisible = await loginPage.isProductScreenVisible();
  if (!isProductVisible) {
    throw new Error('Product catalog screen was not displayed after login');
  }
  expect(isProductVisible).toBe(true);
});

Then('they should see an error message', async function () {
  const isErrorVisible = await loginPage.isErrorMessageVisible();
  if (!isErrorVisible) {
    throw new Error('Error message was not displayed');
  }
  expect(isErrorVisible).toBe(true);

  // Optional: log the error message for debugging
  const errorText = await loginPage.getErrorMessageText();
  console.log(`  🔴 Error message displayed: "${errorText}"`);
});
