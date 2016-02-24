
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
});
