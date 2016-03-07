/**
 * Created by Wiker on 07/03/16.
 */


(function () {

    'use strict';


    module.exports = function () {
        // Recommended filename: Given_I_am_at_any_subdomain_of_#.js
        this.Given(/^I am at any subdomain of "([^"]*)"$/, function (relativePath) {
            // Write the automation code here
            console.log(relativePath);
            this.client.url(relativePath);
            //expect(browser.url().value.substring(0, 22)).toEqual('http://localhost:3000/');
        });


        this.Given(/^I press home$/, function () {
            // Write the automation code here
                browser.click("#home");

        });

        this.Then(/^I should go to localhost:(\d+)$/, function (arg1) {
            // Write the automation code here
            var url = browser.url();
            expect(url.value).toEqual("http://localhost:"+arg1+'/');
        });

        // Recommended filename: Then_I_press_Browse_Content.js

        this.Then(/^I press Browse Content$/, function () {
            // Write the automation code here

            browser.click("#category", function(callback){
                return callback;
            });
        });

        this.Then(/^I should go to localhost:(\d+)\/category$/, function (arg1) {
            // Write the automation code here
            var url = browser.url();
            expect(url.value).toEqual("http://localhost:3000/category");

        });

        this.Then(/^I press Login$/, function () {
            // Write the automation code here
            browser.click("#login", function(callback){
                return callback;
            });
        });

        this.Then(/^I Should go to localhost:(\d+)\/login$/, function (arg1) {
            // Write the automation code here
            var url = browser.url();
            expect(url.value).toEqual("http://localhost:3000/login");
        });
    };
})();