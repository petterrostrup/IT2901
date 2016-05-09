
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
				last_name: String
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

	submit_content: function(main, content) {

		if (!Meteor.userId()) {
			throw new Meteor.Error(530, "You are not logged in!");
		}
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

		// console.log(main);

		main.tags = [];
		main.contents = [];
		// Adds the id of the user in the main
		main.createdById = Meteor.userId();
		content.createdById = Meteor.userId();
		main.createdByUsername = Meteor.user().username;
		content.upVote = [];
		content.downVote = [];

		var category = Category.findOne({_id: main.category_id});
		if (!category) {
			throw new Meteor.Error(400, "Missing valid category");
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

		var language_id = LanguageTags.findOne({name: content.language});
		if (!language_id) {
			throw new Meteor.Error(400, "Missing valid language.");
		}
		var groups = [];
		// main.groups = [];
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
				// main.groups.push(group.name);
				groups.push(group);
			}
		}
		// if (!community_id) {
		// 	throw new Meteor.Error(400, "Missing valid community id.");
		// }

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


	transelate_content: function(content) {

		if (!Meteor.userId()) {
			throw new Meteor.Error(530, "You are not logged in.");
		}
		// console.log(content);
		check(content, {
			title: String,
			description: String,
			language: String,
			text: String,
			metacontent: String
		});

		content.createdById = Meteor.userId();
		content.upVote = [];
		content.downVote = [];

		var father = Content.findOne({_id: content.metacontent});
		
		if (!father) 
			throw new Meteor.Error(404, "Content not found.");

		var self = ContentText.findOne({
			metacontent: content.metacontent,
			language: content.language
		});
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
		} else {
			ContentText.update({
				_id: self._id
			},{
				$set: content
			});
		}

		if (Meteor.settings.DEBUG){
			log_text("Content translated with id='" + content_id + "'", Meteor.user());
		}
		
		return content.metacontent;
	},


	translate_category: function(cat_text) {

		if (!Meteor.userId()) {
			throw new Meteor.Error(530, "You are not logged in.");
		}

		check(cat_text, {
			name: String,
			description: String,
			metacategory: String,
			language: String
		});

		var category_father = Category.findOne({
			_id: cat_text.metacategory
		});

		if (!category_father) {
			throw new Meteor.Error(404, "Could not find category.");
		}

		var language = LanguageTags.findOne({
			name: cat_text.language
		});

		if (!language) {
			throw new Meteor.Error(404, "Could not find language.");
		}

		var check_cat = CategoryText.findOne({
			language: language.name,
			metacategory: category_father._id
		});

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
			if (Meteor.settings.DEBUG){
			log_text("Removed language from profile", Meteor.user());
		}
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
		if (Meteor.settings.DEBUG){
			log_text("Added language to profile", Meteor.user());
		}
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

		if (Meteor.settings.DEBUG){
			log_text("The language " + language.english_name + " was added to the system", Meteor.user());
		}
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

		if (Meteor.settings.DEBUG){
			log_text("Language deleted", Meteor.user());
		}
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

		if (Meteor.settings.DEBUG){
			log_text("The user " + obj.user_id + " got " + obj.role + " priveliges.", Meteor.user());
		}

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

		if (Meteor.settings.DEBUG){
			log_text("The user " + obj.user_id + " was removed from " + obj.role, Meteor.user());
		}
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

	add_group_content: function(obj) {
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
	}
});
