// Write your package code here!
Meteor.methods({

    'fixtures/reset': function () {
        Meteor.users.remove({});
    },

    'fixtures/seedData': function () {
        Accounts.createUser({
            username: "erik",
            password: "123"
        });
    }

});