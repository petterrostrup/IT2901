
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

Meteor.startup(function(){
    if(!Meteor.users.findOne() && Meteor.settings.DEBUG){
        console.log("Create default user");

        var defUser = Meteor.settings.defaultUser;

        userid = Meteor.users.insert({
            username: defUser.username,
            email: defUser.email,
            profile:{},
            roles: "creator"

        });
        Accounts.setPassword(userid, defUser.password);
    }
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
    if (!Tag.findOne() && Meteor.settings.DEBUG){
        console.log("Default tag totally made");
        Tag.insert({
            name: "Kult",
            taggedContent: []
        });
    }
    if (!Language.findOne() && Meteor.settings.DEBUG){
        console.log("Default language totally made");
        Tag.insert({
            name: "english"
        });
    }

});
