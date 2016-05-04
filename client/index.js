
Meteor.subscribe("content");
Meteor.subscribe("personalInfo");
Meteor.subscribe("categories");
Meteor.subscribe("LanguageTags");
Meteor.subscribe("CommunityTags");
Meteor.subscribe("contentText");
Meteor.subscribe("groups");





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



