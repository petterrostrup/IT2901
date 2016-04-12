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

		user.createdContents = [];

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
	create_content: function(post) {

		// Simple check that the input are valid
		check(post, Object);

		// If you are not logged in, you are not allowed to create content
		if (!Meteor.userId()) {
			throw new Meteor.Error(530, "You are not logged in.");
		}
		post.tags = [];
		// Adds the id of the user in the post
		post.createdById = Meteor.userId();

		// Category id
		if (!post.category_id){
			throw new Meteor.Error(400, "Missing category id.");
		}

		var category = Category.findOne({_id: post.category_id});
		if (!category) {
			throw new Meteor.Error(400, "Missing valid category id.");
		}

		// Community id
		if (!post.community){
			throw new Meteor.Error(400, "Missing community.");
		}

		var community_id = CommunityTags.findOne({name: post.community})._id;
		if (!community_id) {
			throw new Meteor.Error(400, "Missing valid community id.");
		}
		post.community_id = community_id;

		// Language id
		if (!post.language){
			throw new Meteor.Error(400, "Missing language.");
		}

		var language_id = LanguageTags.findOne({name: post.language})._id;
		if (!language_id) {
			throw new Meteor.Error(400, "Missing valid language id.");
		}
		post.language_id = language_id;

		post.contents = [];

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
		
		return content_id;
	},

	submit_content: function(content) {
		check(content, Object);

		if (!Meteor.userId()) {
			throw new Meteor.Error(530, "You are not logged in!");
		}
		console.log(content);
		ContentText.insert(content);
	},


	// Method for adding a new category
	add_category: function(category) {

		check(category, Object);
		console.log(category);
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
		else
			throw new Meteor.Error(400, "Parent category is required.");

		// If the name of the category already exists, you are not allowed to create one.
		if (Category.findOne({name: category.name}))
			throw new Meteor.Error(422, "The category name already exists.");
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
	},

	// edit_profile with first_name, last_name, language, email
	edit_profile: function(userInfo, newEmail) {
		check(userInfo, Object);
		check(newEmail, String);

		if (!Meteor.userId()) {
			throw new Meteor.Error(530, "You are not logged in.");
		}
		userInfo.languages = Meteor.user().profile.languages;
		userInfo.organization = "Company AS";
		Meteor.users.update({_id: Meteor.userId()}, {$set: {profile: userInfo}});
		Meteor.users.update({_id: Meteor.userId()}, {$set: {email: newEmail}});
	},

	tag_content: function(content, tagID) {

		//check that input is valid
		check(content, Object);
		check(tag, Object);
		tag = Tag.findOne({_id: tagID})
		content = Content.findOne({name: content.name})
		// If you are not logged in, you are not allowed to create content
		if (!Meteor.userId()) {
			throw new Meteor.Error(530, "You are not logged in.");
		}
		if(content._id && tag._id){
			content.tags.push(tag);
			Content.update(
				{_id: content._id, tags: content.tags});
			Tag.taggedContent.push(content._id);
			Tag.update(
				{_id: tag._id, taggedContent: Tag.taggedContent})
		}
	},

	remove_language_profile: function(lang_id) {
		check(lang_id, String);

		if (!Meteor.userId()) {
			throw new Meteor.Error(530, "You are not logged in.");
		}

		var languages = Meteor.user().profile.languages;
		var index = languages.indexOf(lang_id);
		if (index > -1) {
			languages.splice(index, 1);
			Meteor.users.update({_id: Meteor.userId()}, {$set: {"profile.languages": languages}});
		}else {
			throw new Meteor.Error(400, "Language not found.");
		}
	},


	add_language_profile: function(languageId) {
		check(languageId, String);

		if (!Meteor.userId()) 
			throw new Meteor.Error(530, "You are not logged in.");

		if (!LanguageTags.findOne({_id: languageId})) 
			throw new Meteor.Error(400, "Language not found.");

		var languages = Meteor.user().profile.languages;
		for (var a in languages) {
			if (languages[a] === languageId) 
				throw new Meteor.Error(400, "Language already exist.");
		}
		languages.push(languageId);
		Meteor.users.update({_id: Meteor.userId()}, {$set: {"profile.languages": languages}});
	}
});
