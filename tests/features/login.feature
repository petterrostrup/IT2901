Feature:
User Login

  As an existing user
  I want to be able to login
  So that I can access the awesome app

  @dev
  Scenario: Log in
    Given I am an existing user
    And I navigate to "localhost:3000/login"
    When I enter my email "erik" and password "123"
    And I submit the form
    Then I should see the home page