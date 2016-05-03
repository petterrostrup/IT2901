
Meteor.subscribe("content");
Meteor.subscribe("personalInfo");
Meteor.subscribe("categories");
Meteor.subscribe("LanguageTags");
Meteor.subscribe("CommunityTags");
Meteor.subscribe("contentText");
Meteor.subscribe("groups");


var supportedLanguages = require("../i18n/supportedLanguages.json");
// console.log(supportedLanguages);
supportedLanguages = $.map(supportedLanguages, function(val, index) { console.log(val +" " + index); return val + " " + index });

if (Meteor.isClient) {
    Meteor.startup(function () {
        Session.set("showLoadingIndicator", true);

        var lang = "en";
        if (Meteor.userId() && Meteor.user().profile.preferred_language){
            lang = Meteor.user().profile.preferred_language;
        }

        TAPi18n.setLanguage(lang)
            .done(function () {
                Session.set("showLoadingIndicator", false);
                Session.set("current_language", lang);
            })
            .fail(function (error_message) {
                // Handle the situation
                console.log(error_message);
            });
    });
}



Template.navigation.rendered = function() {
    $('[data-toggle="popover"]').popover();

    //$("#language").attr("data-content", attribute);


};


Template.navigation.events({
    'click #language': function(event){
        event.preventDefault();
        if(!($('.changeLanguage').length)) { //Check if elements already exists.
            for (var i = 0; i < supportedLanguages.length; i++) {
                for (var j = 0; j < supportedLanguages[i].split(" ").length; j += 2) {
                    var temp = supportedLanguages[i].split(" ");

                    //var html = $("<li id=temp[0] class='link'>" + temp[0] + "</li>");
                    //attribute += html;
                    $('.popover-content').append("<li ><a class='link changeLanguage' id=" + temp[j + 1] + "   href=''>" + temp[j] + "</a></li>");
                }
            }
        }

    }
});
Template.navigation.events({
    'click .changeLanguage': function (event) {
        event.preventDefault();
        var lang = (event.target).id;
        TAPi18n.setLanguage(lang)
            .done(function () {
                Meteor.call("set_preferred_language", lang, function(error, result){
                    if (error) {
                        console.log(error);
                    }else {
                        console.log("Preferred language changed.");
                    }
                    Session.set("showLoadingIndicator", false);
                    Session.set("current_language", lang);
                });
            })
            .fail(function (error_message) {
                // Handle the situation
                console.log(error_message);
            });
    }
});
