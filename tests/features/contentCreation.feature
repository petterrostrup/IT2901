Feature: Content Creation

  As an existing user
  I want to be able to create content for others to see.

  Scenario: Log in
    Given I am an existing user
    And I navigate to "localhost:3000/login"
    When I enter my email "erik" and password "1"
    And I submit the form
    Then I should see the home page

  @dev
  Scenario: Create Content
    Given I am at "http://localhost:3000/createContent"
    And I Fill out the form with the title "Test"
    And I press submit
    And I go to "http://localhost:3000/category"
    And I press the first category
    Then I should see the content "Test"

