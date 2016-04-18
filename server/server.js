    // Search
SearchSource.defineSource('categorySearch', function(searchText, options) {
    options = options || {};
  var options = {sort: {isoScore: -1}, limit: 20};
  
  if(searchText) {
    var regExp = buildRegExp(searchText);
    var selector = {$or: [
      {name: regExp},
      {description: regExp}
    ]};

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


// End of Search
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
            roles: "creator"

        });
        Accounts.setPassword(userid, defUser.password);
    }
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
