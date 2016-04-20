
Meteor.subscribe("content");
Meteor.subscribe("personalInfo");
Meteor.subscribe("categories");
Meteor.subscribe("LanguageTags");
Meteor.subscribe("CommunityTags");
Meteor.subscribe("contentText");

getUserLanguage = function () {
    // Put logic for determining the user language
    return 'en'
};

if (Meteor.isClient) {
    Meteor.startup(function () {
        Session.set("showLoadingIndicator", true);

        TAPi18n.setLanguage(getUserLanguage())
            .done(function () {
                Session.set("showLoadingIndicator", false);
            })
            .fail(function (error_message) {
                // Handle the situation
                console.log(error_message);
            });
    });
}

Template.navigation.events({
    'click #language': function(event){
        event.preventDefault();
        if(TAPi18n.getLanguage() == 'en'){
            var lang = 'no';
        }
        else{
            var lang = 'en';
        }
        TAPi18n.setLanguage(lang)
            .done(function () {
                Session.set("showLoadingIndicator", false);
            })
            .fail(function (error_message) {
                // Handle the situation
                console.log(error_message);
            });
    }
});

