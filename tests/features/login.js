/**
 * Created by Wiker on 22/02/16.
 */


(function () {

    'use strict';
// Recommended filename: Given_I_am_an_existing_user.js
    module.exports = function () {
        this.Given(/^I am an existing user$/, function () {
            // Write the automation code here


            server.execute(function(){
               var userid = {
                    username: "erik",
                    email: "lol@l3ol.com",
                    profile:{},
                    roles: "creator"

                };
                if(!Meteor.users.find({user:userid})){
                    Meteor.users.insert({"user":userid});
                    Accounts.setPassword(userid, "123");
                }

            });

        });


// Recommended filename: Given_I_navigate_to_#.js
        this.Given(/^I navigate to "([^"]*)"$/, function (relativePath) {
            // Write the automation code here
            browser.url(relativePath);
/*            console.log(relativePath);
            expect(browser.url).toEqual(relativePath);*/

        });


// Recommended filename: When_I_enter_my_email_#.js

        this.When(/^I enter my email "([^"]*)" and password "([^"]*)"$/, function (username, password) {
            // Write the automation code here
            browser.waitUntil(function(){
                return browser.waitForExist('input');
            });
            browser.setValue("#username1", username);
            browser.setValue("#password1", password);
        });


// Recommended filename: When_I_submit_the_form.js

        this.When(/^I submit the form$/, function () {
            // Write the automation code here
            browser.click("#login-submit");
        });


// Recommended filename: Then_I_should_see_the_home_page.js

        this.Then(/^I should see the home page$/, function () {
            // Write the automation code here
            browser.waitForExist('h1');
        });
    };

})();