// Logging text to the console
var log_text = function(text, user) {
	if (user) {
		console.log(new Date().toLocaleString() + "@" + user.username + "\t\t" + text);
	} else {
		console.log(new Date().toLocaleString() + " (no user)" + "\t\t" + text);
	}
}

Meteor.methods({

	// Method for creating a new user in the system.
	create_user: function(user, password) {

		// Checks that the input are in the correct format, and that it does not contain database-strings

		// console.log(user);
		check(user, {
			username: String,
			email: String,
			profile: {
				preferred_language: String,
				first_name: String,
				last_name: String,
				organization: Match.Maybe(String)
			}
		});
		check(password, String);

		// Security.can().insert(user).for(Meteor.users).throw();

		// Checks if the username chosen is taken
		if (!!Meteor.users.findOne({username: user.username})){
			throw new Meteor.Error(400, "Username is taken");
		}

		// Checks if the email chosen is taken.
		if (!!Meteor.users.findOne({email: user.email})){
			throw new Meteor.Error(400, "Email was taken.");
		}

		user.createdContents = [];
		user.roles = ["standard", "creator"];
		user.profile.languages = [];
		user.profile.groups = [];
		if (user.profile.organization) {
			user.roles.push("organization");
			if (!!Meteor.users.findOne({
				"profile.organization": user.profile.organization 
			})) {
				throw new Meteor.Error(400, "Organization is already taken.");
			}
		}
		// Inserts the user into the database and returns the user id.
		userId = Meteor.users.insert(user);

		if (userId){
			// Sets the password to the user Id
			Accounts.setPassword(userId, password);
			if (Meteor.settings.DEBUG) {
				log_text("The user " + user.username + " was added.");
			}
		}
	},

	// This method will give a seal of approval to a content
	// To be able to give a seal, you have to have an organization account
	give_seal_of_approval: function(content_text_id) {
		if (!Meteor.userId()) {
			throw new Meteor.Error(530, "You are not logged in!");
		}

		if (!Meteor.user().profile.organization) 
			throw new Meteor.Error(400, "You are not connected to a organization.");

		var content = ContentText.findOne({
			_id: content_text_id
		});

		if (!content) 
			throw new Meteor.Error(404, "Did not find content.");
		if (content.seals.indexOf(Meteor.user().profile.organization) < 0) {
			ContentText.update({_id: content_text_id}, {
				$push: {seals: Meteor.user().profile.organization}
			});
		}
	},

	// Will remove a given seal of approval if a organization already have given it
	remove_seal_of_approval: function(content_text_id) {
		if (!Meteor.userId()) {
			throw new Meteor.Error(530, "You are not logged in!");
		}

		if (!Meteor.user().profile.organization) 
			throw new Meteor.Error(400, "You are not connected to a organization.");

		var content = ContentText.findOne({
			_id: content_text_id
		});

		if (!content) 
			throw new Meteor.Error(404, "Did not find content.");

		ContentText.update({_id: content_text_id}, {
			$pull: {seals: Meteor.user().profile.organization}
		});

	},

	// Method for creating content
	submit_content: function(main, content) {

		// Needs to be logged in to create content
		if (!Meteor.userId()) {
			throw new Meteor.Error(530, "You are not logged in!");
		}

		// Checks if the arguments are in the right form
		check(main, {
			category_id: String,
			groups: Array
		});

		check(content, {
			title: String,
			description: String,
			language: String,
			text: String
		});

		// Initializes the content and contentText with empty arrays
		main.tags = [];
		main.contents = [];
		main.createdById = Meteor.userId();
		main.createdByUsername = Meteor.user().username;

		content.createdById = Meteor.userId();
		content.upVote = [];
		content.downVote = [];
		content.seals = [];

		// If the category does not exist, we cannot create content
		var category = Category.findOne({_id: main.category_id});
		if (!category) {
			throw new Meteor.Error(400, "Missing valid category");
		}

		// Needs a language supported by the system
		var language_id = LanguageTags.findOne({name: content.language});
		if (!language_id) {
			throw new Meteor.Error(400, "Missing valid language.");
		}
		var groups = [];

		// If the content is connected with groups, it will create this group if it does not exist
		// and join those groups
		if (main.groups.length){
			for (var a in main.groups) {
				if (!main.groups[a])
					continue;
				var group = Groups.findOne({name: main.groups[a]});
				if (!group){
					group = Groups.insert({
						name: main.groups[a],
						members: [],
						content_ids: []
					});
					group = {
						name: main.groups[a],
						_id: group
					}
				}
				groups.push(group);
			}
		}

		// Rest of the code creates the content, and inserts ids in groups, content, category and contentText
		var content_id = Content.insert(main);
		if (!content_id) {
			throw new Meteor.Error(400, "Content not added!");
		}
		if (groups.length) {
			for (var g in groups) {
				if (!groups[g])
					continue;
				var hade = Groups.update({_id: groups[g]._id}, {
					$push: {content_ids: content_id}
				});
			}
		}
		category.content_ids.push(content_id);

		Category.update({_id: category._id}, {"$set": {
			content_ids: category.content_ids
		}});

		content.metacontent = content_id;

		var text_id = ContentText.insert(content);

		Content.update({
			_id: content_id
		}, {
			$push: {"contents": text_id}
		});

		Meteor.users.update({_id: Meteor.userId()}, {
			$push: {"createdContents": text_id}
		});

		if (Meteor.settings.DEBUG){
			log_text("New content submited with id='" + content_id + "'", Meteor.user());
		}
		
		return content_id;
	},

	// Method for transelating and editing content
	transelate_content: function(content) {

		// Needs to be logged in for transelating content
		if (!Meteor.userId()) {
			throw new Meteor.Error(530, "You are not logged in.");
		}

		// Checks if the parameters are in the right form
		check(content, {
			title: String,
			description: String,
			language: String,
			text: String,
			metacontent: String
		});

		// Initializes the new ContentText
		content.createdById = Meteor.userId();
		content.upVote = [];
		content.downVote = [];
		content.seals = [];

		// Finds the "father" content
		var father = Content.findOne({_id: content.metacontent});
		
		if (!father) 
			throw new Meteor.Error(404, "Content not found.");

		var self = ContentText.findOne({
			metacontent: content.metacontent,
			language: content.language
		});

		// If not found, it means that there are new content to be transelated to
		if (!self) {
			var language = LanguageTags.findOne({
				name: content.language
			});
			if (!language) {
				throw new Meteor.Error(404, "Language not found.");
			}
			var content_id = ContentText.insert(content);
			Content.update({_id: content.metacontent}, {
				$push: {contents: content_id}
			});
		}
		// Content is edited
		else {
			ContentText.update({
				_id: self._id
			},{
				$set: content
			});
		}

		if (Meteor.settings.DEBUG){
			log_text("Content translated with id='" + content_id + "'", Meteor.user());
		}
		
		// Returns the id for father content
		return content.metacontent;
	},

	// Function for transelating category
	translate_category: function(cat_text) {

		// Needs to be logged in for transelating category
		if (!Meteor.userId()) {
			throw new Meteor.Error(530, "You are not logged in.");
		}

		// Checks that the input is in the right form
		check(cat_text, {
			name: String,
			description: String,
			metacategory: String,
			language: String
		});

		var category_father = Category.findOne({
			_id: cat_text.metacategory
		});

		// If no category found, cannot create new transelation
		if (!category_father) {
			throw new Meteor.Error(404, "Could not find category.");
		}

		var language = LanguageTags.findOne({
			name: cat_text.language
		});

		// Needs a supported language
		if (!language) {
			throw new Meteor.Error(404, "Could not find language.");
		}

		var check_cat = CategoryText.findOne({
			language: language.name,
			metacategory: category_father._id
		});

		// Will either update an existing transelation or create a new one
		if (check_cat) {
			CategoryText.update({
				_id: check_cat._id
			}, {$set: cat_text});
		}
		else {
			var id = CategoryText.insert(cat_text);
			if (!id) {
				throw new Meteor.Error(500, "Category not created.");
			}
			Category.update({
				_id: cat_text.metacategory
			}, {
				$push: {categories: id}
			});
		}
		if (Meteor.settings.DEBUG){
			log_text("Category translated with id='" + category_father._id + "'", Meteor.user());
		}
	},


	// Method for adding a new category
	add_category: function(category, language) {

		check(category, Object);

		check(language, String);
		console.log(category);

		if (!Meteor.userId()) {
			throw new Meteor.Error(530, "You are not logged in!");
		}


		// below need to decide what to keep

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



		// create category and send _id to metecategory
		var cat = {
			parent_id: parent._id,
			children_id: [],
			content_ids: [],
			categories: [],
			icon: parent.icon
		}
		var category_id = Category.insert(cat)
		if (!category_id) {
			throw new Meteor.Error(400, "Category not added!");
		}

		if (parent) {
			parent.children_id.push(category_id);
			Category.update({_id: parent._id}, {$set: {
				children_id: parent.children_id
			}});
		}

		// create categoryText
		var categoryText = {
			name: category.name,
			description: category.description,
			metacategory: category_id,
			language: language
		}

		var categoryText_id = CategoryText.insert(categoryText)

		cat.categories.push(categoryText_id)

		Category.update({_id: cat._id}, {"$set": {
			categories: cat.categories
		}});

		if (Meteor.settings.DEBUG){
			log_text("New category added with id='" + category_id + "'", Meteor.user());
		}

		return category_id;		
	},

	// edit_profile with first_name, last_name, language, email
	edit_profile: function(userInfo, newEmail) {
		check(userInfo, {
			first_name: String,
			last_name: String
		});
		check(newEmail, String);

		if (!Meteor.userId()) {
			throw new Meteor.Error(530, "You are not logged in.");
		}
		userInfo.languages = Meteor.user().profile.languages;
		userInfo.organization = "Company AS";
		userInfo.preferred_language = Meteor.user().profile.preferred_language;
		userInfo.groups = Meteor.user().profile.groups;
		Meteor.users.update({_id: Meteor.userId()}, {$set: {profile: userInfo}});
		Meteor.users.update({_id: Meteor.userId()}, {$set: {email: newEmail}});

		if (Meteor.settings.DEBUG){
			log_text("Updated profile", Meteor.user());
		}
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

	// Method for removing a language from a user profile
	remove_language_profile: function(lang_id) {

		// Checks if the id is a String
		check(lang_id, String);

		// Needs to be logged in
		if (!Meteor.userId()) {
			throw new Meteor.Error(530, "You are not logged in.");
		}

		// Finds the language and removes it from the user profile
		var languages = Meteor.user().profile.languages;
		var index = languages.indexOf(lang_id);
		if (index > -1) {
			languages.splice(index, 1);
			Meteor.users.update({_id: Meteor.userId()}, {$set: {"profile.languages": languages}});
			if (Meteor.settings.DEBUG){
			log_text("Removed language from profile", Meteor.user());
		}
		}else {
			throw new Meteor.Error(400, "Language not found.");
		}
	},

	// Function for adding a language to a user profile
	add_language_profile: function(languageId) {
		// Checks the id and if the user is logged in and that the language exists
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
		// Adds the language to the user profile
		languages.push(languageId);
		Meteor.users.update({_id: Meteor.userId()}, {$set: {"profile.languages": languages}});
		if (Meteor.settings.DEBUG){
			log_text("Added language to profile", Meteor.user());
		}
	},

	// Method for setting your preferred language
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

	// Method for adding content to a group
	add_group_content: function(obj) {

		// Checks right input, that the user is logged in, and that the content and group exists
		check(obj, {
			content_id: String,
			name: String 
		});

		if (!Meteor.userId()) {
			throw new Meteor.Error(530, "You are not logged in!");
		}

		var content = Content.findOne({_id: obj.content_id});
		if (!content) {
			throw new Meteor.Error(404, "Did not find content.");
		}

		var group = Groups.findOne({name: obj.name});
		if (!group) {
			throw new Meteor.Error(404, "Did not find group.");
		}

		if (group.content_ids.indexOf(content._id) > -1) {
			throw new Meteor.Error(400, "Content already in group.");
		}

		Content.update({_id: obj.content_id}, {
			$push: {groups: obj.name}
		});

		Groups.update({_id: group._id}, {
			$push: {content_ids: content._id}
		});
	},

	// Function for deleting content
	// Needs to be logged in and you have to be the creator for this content
	delete_content: function(content_id) {

		check(content_id, String);

		var user = Meteor.user();
		if (!user) {
			throw new Meteor.Error(530, "You are not logged in.");
		}

		var content = Content.findOne({
			_id: content_id
		});
		if (!content) {
			throw new Meteor.Error(404, "Did not find content.");
		}

		if (content.createdById !== user._id) {
			throw new Meteor.Error(400, "You cannot delete this content.");
		}

		Meteor.users.update({_id: user._id}, {
			$pull: {createdContents: content._id}
		});

		Category.update({_id: content.category_id}, {
			$pull: {content_ids: content._id}
		});

		ContentText.remove({
			metacontent: content._id
		}, {
			justOne: false
		});

		for (var a in content.groups) {
			var name = content.groups[a];
			Groups.update({
				name: name
			}, {
				$pull: {content_ids: content._id}
			});
		}

		Content.remove({_id: content._id});
	},

	// Creating a new group to the system
	add_group: function(group) {
		check(group, {
			name: String
			// description: String
		});

		if (group.name.trim().split(" ").length > 1) {
			throw new Meteor.Error(400, "String cannot contain whitespace.");
		}

		if (!Meteor.userId()) {
			throw new Meteor.Error(530, "You are not logged in!");
		}

		if (Groups.findOne({name: group.name})) {
			throw new Meteor.Error(400, "Group already exists");
		}

		group.members = [];
		group.content_ids = [];
		var id = Groups.insert(group);

		if (Meteor.settings.DEBUG){
			log_text("The group " + group.name + " was added.", Meteor.user());
		}

		return id;
	},

	// Function for giving a vote to a ContentText
	vote: function(content_id, vote){

		if (!Meteor.userId())
			throw new Meteor.Error(530, "You are not logged in.");

		check(content_id, String);

		var user_id = Meteor.userId();

		var upvoteArray = ContentText.findOne({_id: content_id}).upVote;
		var downVoteArray = ContentText.findOne({_id: content_id}).downVote;

		if(vote == 1){ //upvote
			ContentText.update(
				content_id,
				{
					$pull: {downVote: user_id}
				});
			if(upvoteArray.indexOf(user_id) === -1){
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
			if(downVoteArray.indexOf(user_id) === -1){

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
		var content = ContentText.findOne({
			_id: content_id
		});

		return content.upVote.length - content.downVote.length;
	},

	// Function for joining or leaving a group
	// Needs to be logged in
	toggle_group: function(obj){

		check(obj, {
			group_id: String,
			join: Boolean
		});
		var join = obj.join;
		var group_id = obj.group_id;

		if (!Meteor.userId()){
			throw new Meteor.Error(530, "You are not logged in")
		}

		var group = Groups.findOne({
			_id: group_id
		});

		if (!group) {
			throw new Meteor.Error(404, "Group not found.");
		}

		if (join) {
			if (group.members.indexOf(Meteor.user().username) > -1) {
				throw new Meteor.Error(400, "Already in group.");
			}
			Groups.update({
				_id: group_id
			}, {
				$push: {members: Meteor.user().username}
			});
			Meteor.users.update({
				_id: Meteor.userId()
			}, {
				$push: {"profile.groups": group_id}
			});
		} else {
			Groups.update({
				_id: group_id
			}, {
				$pull: {members: Meteor.user().username}
			});
			Meteor.users.update({
				_id: Meteor.userId()
			}, {
				$pull: {"profile.groups": group_id}
			});
		}
	},


	// Administrator methods
	// All functions here require that a user is logged in and that the user is an administrator

	// Function for adding a new language to the system
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

		// Checks if the language exists
		if (LanguageTags.findOne({name: language.name})) 
			throw new Meteor.Error(400, "Language already exist.");

		if (LanguageTags.findOne({english_name: language.english_name}))
			throw new Meteor.Error(400, "Language already exist.");

		if (LanguageTags.findOne({short_form: language.short_form}))
			throw new Meteor.Error(400, "Language already exist.");

		LanguageTags.insert(language);

		if (Meteor.settings.DEBUG){
			log_text("The language " + language.english_name + " was added to the system", Meteor.user());
		}
	},

	// Function for removing a language from the system
	remove_language_system: function(lang_id) {

		if (!Meteor.userId()) 
			throw new Meteor.Error(530, "You are not logged in.");

		if (!Roles.userIsInRole(Meteor.user(), ["admin"]))
			throw new Meteor.Error(403, "You do not have access.");

		check(lang_id, String);
		var is_deleted = LanguageTags.remove({_id: lang_id});
		if (!is_deleted)
			throw new Meteor.Error(404, "Language does not exist");

		if (Meteor.settings.DEBUG){
			log_text("Language deleted", Meteor.user());
		}
	},

	// Function for removing a user from the system
	remove_user_system: function(user_id) {
		if (!Meteor.userId()) 
			throw new Meteor.Error(530, "You are not logged in.");

		if (!Roles.userIsInRole(Meteor.user(), ["admin"]))
			throw new Meteor.Error(430, "You do not have access.");

		check(user_id, String);

		// Cannot delete your own user
		if (user_id === Meteor.userId()) 
			throw new Meteor.Error(430, "Cannot delete your self.");

		var is_deleted = Meteor.users.remove({_id: user_id});
		if (!is_deleted)
			throw new Meteor.Error(404, "User not found.");
	},

	// Add a user to a desired role
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

		if (Meteor.settings.DEBUG){
			log_text("The user " + obj.user_id + " got " + obj.role + " priveliges.", Meteor.user());
		}

	},

	// Removes a user from a desired role
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

		if (Meteor.settings.DEBUG){
			log_text("The user " + obj.user_id + " was removed from " + obj.role, Meteor.user());
		}
	}
});
