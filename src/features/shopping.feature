@shopping
Feature: Shopping cart and product catalog

  As a logged-in user
  I want to browse products and manage my cart
  So that I can shop through the app

  Background:
    Given the user is logged in
    And the user's cart is empty

  @cart @smoke
  Scenario: Add a product to the cart
    When the user adds the first product to the cart
    Then the cart badge shows "1"
    And the product button changes to "REMOVE"

  @cart
  Scenario: Inspect the cart contents
    Given the user has a product in the cart
    When the user opens the cart
    Then the cart shows 1 item
    And the checkout button is visible

  @catalog
  Scenario: Sort products by price ascending
    When the user sorts products by "Price (low to high)"
    Then the first product should be "Sauce Labs Onesie"

  @menu
  Scenario: Logout via the side menu
    When the user opens the menu and logs out
    Then the login screen is visible again
