Feature:
See the front page

As a user i want to see the front page
when i enter the domain

Scenario: Enter the front page
	Given I have entered "http://localhost:3000/"
	When site has loaded
	Then I see the front page

	
	
