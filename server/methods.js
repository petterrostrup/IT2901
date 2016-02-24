Meteor.methods({
	add_user: function(user, password) {

		// Checks that the input are in the correct format, and that it does not contain database-strings
		check(user, Object);
		check(password, String);

		// Security.can().insert(user).for(Meteor.users).throw();

		// Checks if the username chosen is taken
		if (!!Meteor.users.findOne({username: user.username})){
			if (Meteor.settings.DEBUG)
				console.log(user.username + " was taken.");
			throw new Meteor.Error(400, "Username is taken");
		}

		// Checks if the email chosen is taken.
		if (!!Meteor.users.findOne({email: user.email})){
			if (Meteor.settings.DEBUG)
				console.log(user.email + " was taken.");
			throw new Meteor.Error(400, "Email was taken.");
		}

		// Inserts the user into the database and returns the user id.
		userId = Meteor.users.insert(user);

		if (userId){
			// Sets the password to the user Id
			Accounts.setPassword(userId, password);
			if (Meteor.settings.DEBUG) {
				console.log("The user " + user.username + " was added.");
			}
		}
	},
	submit_content: function(post) {
		Content.insert(post);
	}
});
