Template.profile.events({
});

Template.profile.helpers({
    getUserInfo: function() {
        console.log(Meteor.user());
    }
});