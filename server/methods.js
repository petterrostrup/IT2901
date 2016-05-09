

Meteor.methods({

	// Method for creating a new user in the system.
	create_user: function(user, password) {

		// Checks that the input are in the correct format, and that it does not contain database-strings

		console.log(user);
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
		user.profile.languages = [];

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
			community: Array
		});

		check(content, {
			title: String,
			description: String,
			language: String,
			text: String
		});

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

		main.community_id = [];
		if (main.community.length){
			for (var a in main.community) {
				var community_id = CommunityTags.findOne({name: main.community[a]});
				if (community_id){
					main.community_id.push(community_id._id);
				}
				
			}
		}
		// if (!community_id) {
		// 	throw new Meteor.Error(400, "Missing valid community id.");
		// }

		var content_id = Content.insert(main);
		if (!content_id) {
			throw new Meteor.Error(400, "Content not added!");
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
	add_group: function(group) {
		check(group, Object);

		if (!Meteor.userId()) {
			throw new Meteor.Error(530, "You are not logged in!");
		}
		var parent = undefined;
		if (group.parent_id) {
			parent = Groups.findOne({_id: group.parent_id});
			if (!parent)
				throw new Meteor.Error(400, "Parent id not found.");
		}
		else
			throw new Meteor.Error(400, "Parent is required.");

		// If the name of the group already exists, you are not allowed to create one.
		if (Groups.findOne({name: group.name}))
			throw new Meteor.Error(422, "The name already exists.");
		group.children_id = [];
		group.children = [];
		group.content_ids = [];
		var id = Category.insert(group);
		if (parent) {
			parent.children_id.push(id);
			Category.update({_id: parent._id}, {$set: {
				children_id: parent.children_id
			}});
		}
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
	toogleGroup: function(group_id, value){
		console.log(group_id);
		console.log(value);
		if (!Meteor.userId()){
			throw new Meteor.Error(530, "You are not logged in")
		}
		var group = Groups.findOne({
			_id: group_id
		});
		if (value > 0) {
			Groups.update(
				{_id: group_id},
				{
					$push: {members: Meteor.userId()}
			});
		} else {
			Groups.update(
				{_id: group_id},
				{
					$pull: {members: Meteor.userId()}
			});
		}

	},
});
