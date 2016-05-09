
Meteor.subscribe("content");
Meteor.subscribe("personalInfo");
Meteor.subscribe("categories");
Meteor.subscribe("LanguageTags");
Meteor.subscribe("CommunityTags");
Meteor.subscribe("contentText");
Meteor.subscribe("categoryText");
Meteor.subscribe("groups");
Meteor.subscribe("groupsText");


Meteor.startup(function () {
    Session.set("showLoadingIndicator", true);

    var lang = "en";
    console.log(Meteor.user());
    if (Meteor.user() && Meteor.user().profile.preferred_language){
        lang = Meteor.user().profile.preferred_language;
    }

    TAPi18n.setLanguage(lang)
        .done(function () {
            Session.set("showLoadingIndicator", false);
        })
        .fail(function (error_message) {
            // Handle the situation
            console.log(error_message);
        });
});


Template.navigation.rendered = function() {
    $('[data-toggle="popover"]').popover();

    //$("#language").attr("data-content", attribute);


};



// function disablePopovers() {
//     $("a[rel=popover]").popover('hide');
//     $("a[rel=popover]").popover('disable');
//     // Remove the popover DIV from the DOM
//     $(".popover").remove();
//     $("#language").click();
// }


// Template.navigation.events({
//     'click .changeLanguage': function (event) {
//         event.preventDefault();
//         disablePopovers();
//         var lang = (event.target).id;
//         if(supportedLanguages[(event.target).id].flipped){
//             $('#layoutContainer').addClass('reverseSite');
//         }
//         else{
//             $('#layoutContainer').removeClass('reverseSite');
//         }
//     }
// });
