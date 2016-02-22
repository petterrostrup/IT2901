
Meteor.publish("content", function(){
	return Content.find({});
});

Meteor.startup(function(){
    if(!Meteor.users.findOne()){
        console.log("Create default user");

        userid = Meteor.users.insert({
            username: "erik",
            email: "lol@lol.com",
            profile:{},
            roles: "creator"

        });
        Accounts.setPassword(userid, "123");
    }
});