Feature:
  User Login

  As a user
  I want to have access to the navigation bar from everywhere on the website
  So that I can easily navigate the site

  @dev
  Scenario: navigation bar
    Given I am at any subdomain of "localhost:3000"
    And I press home
    Then I should go to localhost:3000
    And I press Browse Content
    Then I should go to localhost:3000/category
    And I press Login
    Then I Should go to localhost:3000/login
