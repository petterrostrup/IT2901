
// Publishes your personal information for use in the profile page
Meteor.publish("personalInfo", function() {
    if (this.userId) {
        return Meteor.users.find({
            _id: this.userId
        });
    }
});

Meteor.publish("content", function(){
	return Content.find({});
});

Meteor.publish("tags", function(tag_string) {
    console.log(tag_string);
    return Tag.find({
        name: {$regex: tag_string}
    });
    // return Tag.find({});
});

Meteor.publish("categories", function() {
   // return Category.find({});
   return Category.find({});
});

Meteor.publish("LanguageTags", function() {
    return LanguageTags.find({});
});

Meteor.publish("CommunityTags", function() {
    return CommunityTags.find({});
});

Meteor.startup(function(){
    // add something in database for test
    if (!Category.findOne() && Meteor.settings.DEBUG){
        console.log("Default category created.");
        Category.insert({
            name: "Matematikk",
            children: [],
            content_ids: [],
            children_id: [],
            description: "Regning med tall",
            url_name: "mattematikk",
        }); 
    }

    var languageIds = [];
    // add something in database for language test
    if (!LanguageTags.findOne() && Meteor.settings.DEBUG){
        console.log("Default LanguageTags created.");
        languageIds.push(LanguageTags.insert({
            name: "Norsk",
            english_name: "Norwegian",
            short_form: "no"
        })); 
        languageIds.push(LanguageTags.insert({
            name: "English",
            english_name: "English",
            short_form: "en"
        }));
        languageIds.push(LanguageTags.insert({
            name: "Español",
            "english_name": "Spanish",
            short_form: "es"
        }));
    }

    // add something in database for community test
    if (!CommunityTags.findOne() && Meteor.settings.DEBUG){
        console.log("Default CommunityTags created.");
        CommunityTags.insert({
            name: "StudentInTrondheim"
        }); 
    }


    if (!Tag.findOne() && Meteor.settings.DEBUG){
        console.log("Default tag totally made");
        Tag.insert({
            name: "Kult",
            taggedContent: []
        });
    }
    if(!Meteor.users.findOne() && Meteor.settings.DEBUG){
        console.log("Create default user");

        var defUser = Meteor.settings.defaultUser;
        var proflie = {
            first_name: "Ping",
            last_name: "Pong",
            organization: "CC AS",
            languages: languageIds,
            home_adress: "Trondheim"
        }
        userid = Meteor.users.insert({
            username: defUser.username,
            email: defUser.email,
            profile:proflie,
            roles: "creator",
            createdContents: []

        });
        Accounts.setPassword(userid, defUser.password);
    }

});
