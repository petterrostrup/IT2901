

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
		user.roles = ["standard", "creator"];

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
	// create_content: function(post) {

	// 	// Simple check that the input are valid
	// 	check(post, Object);

	// 	// If you are not logged in, you are not allowed to create content
	// 	if (!Meteor.userId()) {
	// 		throw new Meteor.Error(530, "You are not logged in.");
	// 	}
	// 	post.tags = [];
	// 	// Adds the id of the user in the post
	// 	post.createdById = Meteor.userId();

	// 	// Category id
	// 	if (!post.category_id){
	// 		throw new Meteor.Error(400, "Missing category id.");
	// 	}

	// 	var category = Category.findOne({_id: post.category_id});
	// 	if (!category) {
	// 		throw new Meteor.Error(400, "Missing valid category id.");
	// 	}

	// 	// Community id
	// 	if (!post.community){
	// 		throw new Meteor.Error(400, "Missing community.");
	// 	}

	// 	var community_id = CommunityTags.findOne({name: post.community})._id;
	// 	if (!community_id) {
	// 		throw new Meteor.Error(400, "Missing valid community id.");
	// 	}
	// 	post.community_id = community_id;

	// 	// Language id
	// 	// if (!post.language){
	// 	// 	throw new Meteor.Error(400, "Missing language.");
	// 	// }

	// 	// var language_id = LanguageTags.findOne({name: post.language})._id;
	// 	// if (!language_id) {
	// 	// 	throw new Meteor.Error(400, "Missing valid language id.");
	// 	// }
	// 	// post.language_id = language_id;

	// 	post.contents = [];

	// 	var content_id = Content.insert(post);
	// 	if (!content_id) {
	// 		throw new Meteor.Error(400, "Content not added!");
	// 	}
	// 	category.content_ids.push(content_id);

	// 	Category.update({_id: category._id}, {"$set": {
	// 		content_ids: category.content_ids
	// 	}});

	// 	// Check if a user can insert a post in Content.
	// 	// If not, it will throw an error.
	// 	// Commenting this out so people not will hate me
	// 	// Security.can(this.userId).insert(post).for(Content).throw(); 
		
	// 	return content_id;
	// },

	submit_content: function(main, content) {

		if (!Meteor.userId()) {
			throw new Meteor.Error(530, "You are not logged in!");
		}

		check(main, {
			category_id: String,
			community: String
		});

		check(content, {
			title: String,
			description: String,
			language: String,
			text: String,
			upVote: Array,
			downVote: Array
		});

		main.tags = [];
		main.contents = [];
		// Adds the id of the user in the main
		main.createdById = Meteor.userId();

		var category = Category.findOne({_id: main.category_id});
		if (!category) {
			throw new Meteor.Error(400, "Missing valid category id.");
		}

		// Community id
		// if (!post.community){
		// 	post.community = [];
		// 	throw new Meteor.Error(400, "Missing community.");
		// }

		// var community_id = []
		// for (com in post.community) {
		// 	community_id.push(CommunityTags.findOne({name: post.community[com]})._id)
		// }
		
		var community_id = CommunityTags.findOne({name: main.community})._id;
		if (!community_id) {
			throw new Meteor.Error(400, "Missing valid community id.");
		}

		main.community_id = community_id;

		var content_id = Content.insert(main);
		if (!content_id) {
			throw new Meteor.Error(400, "Content not added!");
		}
		category.content_ids.push(content_id);

		Category.update({_id: category._id}, {"$set": {
			content_ids: category.content_ids
		}});

		content.metacontent = content_id;

				// Language id
		var language_id = LanguageTags.findOne({name: content.language})._id;
		if (!language_id) {
			throw new Meteor.Error(400, "Missing valid language id.");
		}

		var text_id = ContentText.insert(content);

		Content.update({
			_id: content_id
		}, {
			$push: {"contents": text_id}
		});
		
		return content_id;
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
	},


	// Administrator methods
	add_language_system: function(language) {

		if (!Meteor.userId()) 
			throw new Meteor.Error(530, "You are not logged in.");

		if (!Roles.userIsInRole(Meteor.user(), ["admin"]))
			throw new Meteor.Error(403, "You do not have access.");

		check(language, {
			"name": String,
			"english_name": String,
			"short_form": String
		});

		if (LanguageTags.findOne({name: language.name})) 
			throw new Meteor.Error(400, "Language already exist.");

		if (LanguageTags.findOne({english_name: language.english_name}))
			throw new Meteor.Error(400, "Language already exist.");

		if (LanguageTags.findOne({short_form: language.short_form}))
			throw new Meteor.Error(400, "Language already exist.");

		LanguageTags.insert(language);
	},


	remove_language_system: function(lang_id) {

		if (!Meteor.userId()) 
			throw new Meteor.Error(530, "You are not logged in.");

		if (!Roles.userIsInRole(Meteor.user(), ["admin"]))
			throw new Meteor.Error(403, "You do not have access.");

		check(lang_id, String);
		var is_deleted = LanguageTags.remove({_id: lang_id});
		if (!is_deleted)
			throw new Meteor.Error(404, "Language does not exist");
	},


	remove_user_system: function(user_id) {
		if (!Meteor.userId()) 
			throw new Meteor.Error(530, "You are not logged in.");

		if (!Roles.userIsInRole(Meteor.user(), ["admin"]))
			throw new Meteor.Error(430, "You do not have access.");

		check(user_id, String);

		if (user_id === Meteor.userId()) 
			throw new Meteor.Error(430, "Cannot delete your self.");

		var is_deleted = Meteor.users.remove({_id: user_id});
		if (!is_deleted)
			throw new Meteor.Error(404, "User not found.");
	},


	add_user_to_role: function(obj) {
		check(obj, {
			user_id: String,
			role: String
		});

		if (!Meteor.userId()) {
			throw new Meteor.Error(530, "You are not logged in.");
		}

		if (!Roles.userIsInRole(Meteor.user(), ["admin"])) {
			throw new Meteor.Error(430, "You do not have access.");
		}

		if (!Meteor.users.findOne({_id: obj.user_id}))
			throw new Meteor.Error(404, "User not found.");

		Roles.addUsersToRoles(obj.user_id, obj.role);

	},


	remove_user_from_role: function(obj) {
		check(obj, {
			user_id: String,
			role: String
		});

		if (!Meteor.userId()) {
			throw new Meteor.Error(530, "You are not logged in.");
		}

		if (!Roles.userIsInRole(Meteor.user(), ["admin"])) {
			throw new Meteor.Error(430, "You do not have access.");
		}

		if (!Meteor.users.findOne({_id: obj.user_id}))
			throw new Meteor.Error(404, "User not found.");

		if (obj.user_id === Meteor.userId() && obj.role === "admin")
			throw new Meteor.Error(430, "You cannot remove admin from your self.");

		Roles.removeUsersFromRoles(obj.user_id, obj.role);
	},


	set_preferred_language: function(lang) {
		check(lang, String);

		if (!Meteor.userId())
			throw new Meteor.Error(530, "You are not logged in.");


		Meteor.users.update({
			_id: Meteor.userId()
		},{
			$set: {"profile.preferred_language": lang}
		});
	},

	vote: function(content_id, user_id, vote){
		check(user_id, String);
		check(content_id, String);
		var upvoteArray = ContentText.findOne({_id: content_id}).upVote;
		var downVoteArray = ContentText.findOne({_id: content_id}).downVote;
		if(vote == 1){ //upvote
			ContentText.update(
				content_id,
				{
					$pull: {downVote: user_id}
				});
			if(typeof upvoteArray === 'undefined' || upvoteArray.indexOf(user_id) === -1){
				ContentText.update(
				content_id,
				{
					$push: {upVote: user_id}
				});
			}
			else{
				ContentText.update(
					content_id,
					{
						$pull: {upVote: user_id}
					});
			}
		}

		else{//downvote
			ContentText.update(
				content_id,
				{
					$pull: {upVote: user_id}
				});
			if(typeof downVoteArray === 'undefined' || downVoteArray.indexOf(user_id) === -1){

				ContentText.update(
				content_id,
				{
					$push: {downVote: user_id}
				});
			}
			else{
				ContentText.update(
					content_id,
					{
						$pull: {downVote: user_id}
					});
			}
		}
	}
	
});
