
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
    if(!Meteor.users.findOne() && Meteor.settings.DEBUG){
        console.log("Create default user");

        var defUser = Meteor.settings.defaultUser;
        var proflie = {
            first_name: "Ping",
            last_name: "Pong",
            organization: "CC AS",
            languages: ["en", "no"],
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
    // add something in database for test
    if (!Category.findOne() && Meteor.settings.DEBUG){
        console.log("Default category created.");
        Category.insert({
            name: "By",
            children: [],
            content_ids: [],
            children_id: [],
            description: "Informasjon anngående byen",
            icon: "city2",
            url_name: "city"
        });
        Category.insert({
            name: "Samfunn",
            children: [],
            content_ids: [],
            children_id: [],
            description: "Informasjon anngående samfunnet",
            icon: "community2",
            url_name: "community"
        });
        Category.insert({
            name: "Økonomi",
            children: [],
            content_ids: [],
            children_id: [],
            description: "Informasjon anngående økonomi",
            icon: "economy2",
            url_name: "economy"
        });
        Category.insert({
            name: "Utdanning",
            children: [],
            content_ids: [],
            children_id: [],
            description: "Informasjon anngående utdanning og skolering",
            icon: "education2",
            url_name: "education"
        });
        Category.insert({
            name: "Food",
            children: [],
            content_ids: [],
            children_id: [],
            description: "Informasjon anngående skaffing av mat, forberedelse, oppskrifter etc.",
            icon: "food2",
            url_name: "food"
        });
        Category.insert({
            name: "Helse",
            children: [],
            content_ids: [],
            children_id: [],
            description: "Informasjon anngående helse og hvor man kan få hjelp",
            icon: "health2",
            url_name: "health"
        });
        Category.insert({
            name: "Hjelp",
            children: [],
            content_ids: [],
            children_id: [],
            description: "Hvor hjelp er å finne og hvem man kan be om hjelp",
            icon: "help2",
            url_name: "help"
        });
        Category.insert({
            name: "Bolig",
            children: [],
            content_ids: [],
            children_id: [],
            description: "Hvordan å få tak i bolig og annet relevant informasjon",
            icon: "housing2",
            url_name: "housing"
        });
        Category.insert({
            name: "Jobb",
            children: [],
            content_ids: [],
            children_id: [],
            description: "Jobbrelatert informasjon. Hvordan å skaffe jobb etc.",
            icon: "jobs2",
            url_name: "jobs"
        });
        Category.insert({
            name: "Språk",
            children: [],
            content_ids: [],
            children_id: [],
            description: "Informasjon anngående språk. Hvordan å lære nye språk etc.",
            icon: "language2",
            url_name: "language"
        });
        Category.insert({
            name: "Rettshjelp",
            children: [],
            content_ids: [],
            children_id: [],
            description: "Rettshjelp, lover etc.",
            icon: "legal2",
            url_name: "legal"
        });
        Category.insert({
            name: "Transport",
            children: [],
            content_ids: [],
            children_id: [],
            description: "Informasjon anngående transport",
            icon: "transport2",
            url_name: "transport"
        });
    }

    // add something in database for language test
    if (!LanguageTags.findOne() && Meteor.settings.DEBUG){
        console.log("Default LanguageTags created.");
        LanguageTags.insert({
            name: "Norwegian",
            children: [],
            content_ids: [],
            children_id: [],
            description: "Regning med tall",
            url_name: "norwegian",
        }); 
    }

    // add something in database for community test
    if (!CommunityTags.findOne() && Meteor.settings.DEBUG){
        console.log("Default CommunityTags created.");
        CommunityTags.insert({
            name: "StudentInTrondheim",
            children: [],
            content_ids: [],
            children_id: [],
            description: "Regning med tall",
            url_name: "sit",
        }); 
    }


    if (!Tag.findOne() && Meteor.settings.DEBUG){
        console.log("Default tag totally made");
        Tag.insert({
            name: "Kult",
            taggedContent: []
        });
    }

});
