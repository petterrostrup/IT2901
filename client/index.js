
Meteor.subscribe("content");
Meteor.subscribe("personalInfo");
Meteor.subscribe("categories");
Meteor.subscribe("LanguageTags");
Meteor.subscribe("CommunityTags");
Meteor.subscribe("contentText");


var supportedLanguages = require("../i18n/supportedLanguages.json");


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
    'click #language': function(event) {
        event.preventDefault();
        if(!($('.changeLanguage').length)) {
            for(var key in supportedLanguages){
                console.log(key);
                console.log(supportedLanguages[key].language);
                $('.popover-content').append("<li ><a class='link changeLanguage' id=" + key + "   href=''>" + supportedLanguages[key].language + "</a></li>");
            }


        }
    }

});

function disablePopovers() {
    $("a[rel=popover]").popover('hide');
    $("a[rel=popover]").popover('disable');
    // Remove the popover DIV from the DOM
    $(".popover").remove();
    $("#language").click();
}


Template.navigation.events({
    'click .changeLanguage': function (event) {
        event.preventDefault();
        disablePopovers();
        var lang = (event.target).id;
        if(supportedLanguages[(event.target).id].flipped){
            $('#layoutContainer').addClass('reverseSite');
        }
        else{
            $('#layoutContainer').removeClass('reverseSite');
        }


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
