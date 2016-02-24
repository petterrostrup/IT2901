Template.profile.events({
});

Template.profile.helpers({
    getUserInfo: function() {
        return Meteor.user();
    }
});