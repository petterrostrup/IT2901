Meteor.methods({
	add_user: function(user, password) {

		check(user, Object);

		// Security.can().insert(user).for(Meteor.users).throw();

		if (!!Meteor.users.findOne({username: user.username})){
			console.log(user.username + " was taken.");
			throw new Meteor.Error(400, "Username is taken");
		}

		if (!!Meteor.users.findOne({email: user.email})){
			console.log(user.email + " was taken.");
			throw new Meteor.Error(400, "Email was taken.");
		}

		userId = Meteor.users.insert(user);
		console.log(userId);

		if (userId){
			Accounts.setPassword(userId, password);
		}
		else {
			console.log("The user was not created.");
		}

		if (Meteor.settings.DEBUG) {
			console.log("The user " + user.username + " was added.");
		}

	}
});