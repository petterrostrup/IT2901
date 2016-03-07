/**
 * Created by Wiker on 22/02/16.
 */

(function () {

    'use strict';

    module.exports = function () {

        this.Given(/^I have entered "([^"]*)"$/, function (relativePath) {

            // Write the automation code here
            browser.url(relativePath);
        });

        this.When(/^site has loaded$/, function () {
            // Write the automation code here
            browser.waitForExist("ul");
        });

        this.Then(/^I see the front page$/, function () {
            // Write the automation code here
            expect(browser.getText('ul')).toEqual("Press me Press med hello");
        });

    }
})();