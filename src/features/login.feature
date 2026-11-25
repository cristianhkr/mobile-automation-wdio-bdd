@smoke @login
Feature: MyDemoApp Login

  As an app user
  I want to log in with my credentials
  So that I can access the app's features

  @successful @regression
  Scenario: Successful login with valid credentials
    Given the user is on the login screen
    When they enter username "standard_user" and password "secret_sauce"
    And they tap the "Login" button
    Then they should see the product catalog screen

  @invalid @regression
  Scenario Outline: Failed login with invalid credentials
    Given the user is on the login screen
    When they enter username "<username>" and password "<password>"
    And they tap the "Login" button
    Then they should see an error message

    Examples: Invalid credentials
      | username        | password      |
      | invalid_user    | wrongpass     |
      | standard_user   | wrongpass     |
      | invalid_user    | secret_sauce  |
