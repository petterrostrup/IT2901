Meteor.methods({

	// Method for creating a new user in the system.
	create_user: function(user, password) {

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

	// Method for insert new content to the database.
	submit_content: function(post) {

		// Simple check that the input are valid
		check(post, Object);

		// If you are not logged in, you are not allowed to create content
		if (!Meteor.userId()) {
			throw new Meteor.Error(530, "You are not logged in.");
		}
		post.tags = [];
		// Adds the id of the user in the post
		post.createdById = Meteor.userId();

		if (!post.category_id){
			throw new Meteor.Error(400, "Missing category id.");
		}

		var category = Category.find({_id: post.category_id});
		if (!category) {
			throw new Meteor.Error(400, "Missing valid category id.");
		}

		var content_id = Content.insert(post);
		if (!content_id) {
			throw new Meteor.Error(400, "Content not added!");
		}
		category.content_ids.push(content_id);

		Category.update({_id: category._id}, {"$set": {
			content_ids: category.content_ids
		}});

		// Check if a user can insert a post in Content.
		// If not, it will throw an error.
		// Commenting this out so people not will hate me
		// Security.can(this.userId).insert(post).for(Content).throw(); 
	},


	// Method for adding a new category
	add_category: function(category) {

		check(category, Object);

		if (!Meteor.userId()) {
			throw new Meteor.Error(530, "You are not logged in!");
		}
		// console.log(category.parent);
		var parent = undefined;
		if (category.parent_id) {
			parent = Category.findOne({_id: category.parent_id});
			if (!parent)
				throw new Meteor.Error(400, "Parent category id not found.");
		}
		category.children_id = [];
		category.children = [];
		category.content_ids = [];
		var id = Category.insert(category);
		if (parent) {
			parent.children_id.push(id);
			Category.update({_id: parent._id}, {$set: {
				children_id: parent.children_id
			}});
		}
	}
});
