Template.home.helpers({
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

	getCategory: function(catId) {
		var content = Content.findOne({_id: catId});
		var cat = Category.findOne({_id: content.category_id});
		return cat.name;
	},

	getIcon: function(catId) {
		var content = Content.findOne({_id: catId});
		var cat = Category.findOne({_id: content.category_id});
		return cat.icon;
	},

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
