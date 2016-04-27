    // Search
SearchSource.defineSource('categorySearch', function(searchText, options) {
    options = options || {};
  var options = {sort: {isoScore: -1}, limit: 20};
  
  if(searchText) {
    var regExp = buildRegExp(searchText);
    var selector = {$or: [
      {name: regExp},
      {description: regExp},
      {title: regExp},
      {community_id: regExp}
    ]};
    // search by commu and lang
    // var selectorTag = {$or: [
    //   {name: regExp},
    // ]};
    // var result_community_id = CommunityTags.find(selectorTag, options).fetch()
    // var com_id = result_community_id[0].name
    // var regExpCom = buildRegExp(com_id)
    // console.log(com_id)
    // console.log(regExpCom)
    // var selector = {$or: [
    //   {name: regExp},
    //   {description: regExp},
    //   {community_id: regExpCom}
    // ]};

    
    //concat two returned collections
    return Category.find(selector, options).fetch();
  } else {
    return Category.find({}, options).fetch();
  }
});

    function buildRegExp(searchText) {
  // this is a dumb implementation
  var parts = searchText.trim().split(/[ \-\:]+/);
  return new RegExp("(" + parts.join('|') + ")", "ig");
}

// content search
SearchSource.defineSource('contentSearch', function(searchText, options) {
    options = options || {};
  var options = {sort: {isoScore: -1}, limit: 20};
  
  if(searchText) {
    var regExp = buildRegExp(searchText);
    var selector = {$or: [
      {name: regExp},
      {description: regExp},
      {title: regExp}
      // {community_id: regExp}
    ]};
    // search by commu and lang
    // var selectorTag = {$or: [
    //   {name: regExp},
    // ]};
    // var result_community_id = CommunityTags.find(selectorTag, options).fetch()
    // var com_id = result_community_id[0].name
    // var regExpCom = buildRegExp(com_id)
    // console.log(com_id)
    // console.log(regExpCom)
    // var selector = {$or: [
    //   {name: regExp},
    //   {description: regExp},
    //   {community_id: regExpCom}
    // ]};
   
    //concat two returned collections
    return ContentText.find(selector, options).fetch();
  } else {
    return Category.find({}, options).fetch();
  }
});

    function buildRegExp(searchText) {
  // this is a dumb implementation
  var parts = searchText.trim().split(/[ \-\:]+/);
  return new RegExp("(" + parts.join('|') + ")", "ig");
}


// End of Search
// Publishes your personal information for use in the profile page
Meteor.publish("personalInfo", function() {
    if (this.userId) {
        return Meteor.users.find({
            _id: this.userId
        });
    }
});


// Publishes all user info to administrators. If the user are not admin, the user cannot access all user information
Meteor.publish("allUsers", function(user) {
    if (this.userId && Roles.userIsInRole(user, ["admin"]) && this.userId === user._id) {
        return Meteor.users.find({});
    }
});

Meteor.publish("content", function(){
	return Content.find({});
});

Meteor.publish("contentText", function() {
    return ContentText.find({});
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
    
    // If no category is found, it will create all the standard categories
    if (!Category.findOne()){
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
        CommunityTags.insert({
            name: "StartUp"
        })
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
            roles: ["admin"],
            createdContents: []
        });
        Accounts.setPassword(userid, defUser.password);
    }

});
