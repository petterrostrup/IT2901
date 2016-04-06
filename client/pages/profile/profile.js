Template.profile.events({
});

Template.profile.helpers({
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