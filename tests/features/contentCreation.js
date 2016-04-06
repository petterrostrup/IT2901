/**
 * Created by Wiker on 04/04/16.
 */

(function () {

    'use strict';


// Recommended filename: Given_I_am_at_#.js
    module.exports = function () {
        this.Given(/^I am at "([^"]*)"$/, function (arg1) {
            // Write the automation code here

            client.url(arg1);

            expect(client.getUrl()).toEqual("http://localhost:3000/createContent");
        });

// Recommended filename: Given_I_Fill_out_the_form_with_the_title_#.js
        this.Given(/^I Fill out the form with the title "([^"]*)"$/, function (title) {
            // Write the automation code here
            browser.waitUntil(function(){
                return browser.waitForExist('#title');
            });
            browser.setValue('#title',title);
            browser.setValue('#description',title);
            browser.setValue('#content',title);
            browser.setValue('#autocomplete-input-Com','#StudentInTrondheim');
            browser.setValue('#autocomplete-input-Cat','#Matematikk');
            browser.setValue('#autocomplete-input-Lang','#Norwegian');

            expect(client.getValue('#title')).toEqual(title);
            expect(client.getValue('#description')).toEqual(title);
            expect(client.getValue('#autocomplete-input-Com')).toEqual('#StudentInTrondheim');
            expect(client.getValue('#autocomplete-input-Cat')).toEqual('#Matematikk');
            expect(client.getValue('#autocomplete-input-Lang')).toEqual('#Norwegian');



        });

// Recommended filename: Given_I_press_submit.js
        this.Given(/^I press submit$/, function () {
            // Write the automation code here
            browser.click("#content-submit");
        });

// Recommended filename: Given_I_go_to_#.js
        this.Given(/^I go to "([^"]*)"$/, function (arg1) {
            // Write the automation code here
            pending();
        });


// Recommended filename: Given_I_press_the_first_category.js

        this.Given(/^I press the first category$/, function () {
            // Write the automation code here
            pending();
        });

// Recommended filename: Then_I_should_see_the_content_#.js

        this.Then(/^I should see the content "([^"]*)"$/, function (arg1) {
            // Write the automation code here
            pending();
        });
    };
})();