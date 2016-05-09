
Template.home.helpers({
	getUserLanguages: function() {
		Session.set("home_languages", Methods.get_current_languages());
	},

	//Gets all the content from the database
	//Limits it to 10. 
	//finds the most recent content created. 
	getContent: function() {
		var default_language = Session.get("current_language");
		default_language = LanguageTags.findOne({
			short_form: default_language
		});

		var content = ContentText.find({
			language: default_language.name
		},{
			limit: 10,
			sort: {createdAt: -1}
		});
		return content;

		// if (!Meteor.userId()) {
		// 	var content = Content.find({
		// 		limit: 10
		// 	});
		// 	content.reverse();
		// 	return content;
		// }

		// var user_langs = Meteor.user().profile.languages;
		// var default_language = Session.get("current_language");
		// default_language = LanguageTags.findOne({
		// 	short_form: default_language
		// });
		// var content = [];
		// var found = false;
		// for (var a in user_langs) {
		// 	if (user_langs[a] === default_language._id){
		// 		user_langs[a] = default_language;
		// 		found = true;
		// 	}else {
		// 		user_langs[a] = LanguageTags.findOne({
		// 			_id: user_langs[a]
		// 		});
		// 	}
		// }
		// if (!found) 
		// 	user_langs.push(default_language);
		// var content = [];
	},
	// returns the category of the content we are checking. 
	// gets catId as an argument
	getCategory: function(catId) {
		var content = Content.findOne({_id: catId});
		var cat = Category.findOne({_id: content.category_id});
		var texts = CategoryText.find({
			metacategory: cat._id
		}).fetch();
		var languages = Session.get("home_languages");
		for (var a in texts) {
			var t = texts[a];
			if (t.language === languages.main_lang){
				return t.name;
			}
		}
		if (languages.supported_langs) {
			for (var a in texts) {
				var t = texts[a];
				if (t.language in languages.supported_langs) {
					return t.name;
				}
			}
		}
		if (texts.length)
			return texts[0].name;
		return "Not found";
	},
	//Gets the icon for the category based on the catId
	getIcon: function(catId) {
		var content = Content.findOne({_id: catId});
		var cat = Category.findOne({_id: content.category_id});
		return cat.icon;
	},
	//returns the time difference between the creation of a content and now. 
	timeSince: function(time) {

		then = new Date(time);

		var seconds = Math.floor((new Date() - then) / 1000);

		var interval = Math.floor(seconds / 31536000);

		if (interval > 1) {
			return interval + " years";
		}
		interval = Math.floor(seconds / 2592000);
		if (interval > 1) {
			return interval + " months";
		}
		interval = Math.floor(seconds / 86400);
		if (interval > 1) {
			return interval + " days";
		}
		interval = Math.floor(seconds / 3600);
		if (interval > 1) {
			return interval + " hours";
		}
		interval = Math.floor(seconds / 60);
		if (interval > 1) {
			return interval + " minutes";
		}
		return Math.floor(seconds) + " seconds";
	}

});
