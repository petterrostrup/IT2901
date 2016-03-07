Feature:
  User Login

  As a user
  I want to be able to route to all the different pages
  So that I can access all the content on the site


  Scenario: Log in
    Given I am an existing user
    And I navigate to "localhost:3000/login"
    When I enter my email "erik" and password "123"
    And I submit the form
    Then I should see the home page