Template.profile.events({
});

Template.profile.helpers({
    
    //Meteor.userId() get the current user's id that u r.
    getContents: function() {
        // you need fetch() to get the real data. without it, it just a reference to database.
        var contents = Content.find({createdById: Meteor.userId()}).fetch();
        var contentTitle = [];
        var contentId = [];
        for (content in contents) {
            contentTitle.push({title: contents[content].title, id: contents[content]._id});
        }
        // for (content in contents) {
        //     contentId.push(contents[content]._id);
        // }
        
        // var contentInfo = {
        //     titles: contentTitle,
        //     ids: contentId
        // }

        return contentTitle;
    },

    getUserInfo: function() {
    	var user = Meteor.user();
    	user.createdAt = user.createdAt.toISOString().slice(0, 10);
    	if (user) {
    		return user;
    	} else {
    		console.log("profile cant get user from database.");
    		return null;
    	}
    },

    getUserProfile: function() {
    	var profile = Meteor.user().profile;
    	if (profile) {
    		return profile;
    	} else {
    		console.log("profile cant get profile from database.");
    		return null;
    	}
    }
});