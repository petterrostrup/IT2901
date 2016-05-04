
Methods = {
	get_parent_url: function(start_id) {
		var list = [];
		var current = Category.findOne({_id: start_id});
		var lang = Session.get("current_language");
		var db_lang = LanguageTags.findOne({
			short_form: lang
		});
		var supported_langs;
		if (Meteor.user()) {
			supported_langs = [];
			var user_languages = Meteor.user().profile.languages;
			for (var a in user_languages) {
				supported_langs.push(LanguageTags.findOne({
					_id: user_languages[a]
				}).name);
			}
		}

		while (current) {
			var cat_text = CategoryText.find({
				metacategory: current._id
			}).fetch();
			var found = false;
			for (var a in cat_text) {
				var text = cat_text[a];
				if (text.language === db_lang.name){
					list.push({_id: current._id, name: text.name});
					found = true;
					break;
				}
			}
			if (!found && supported_langs) {
				for (var a in cat_text) {
					var text = cat_text[a];
					if (text.language in supported_langs) {
						list.push({_id: current._id, name: text.name});
						break;
					}
				}
			}

			if (!found) {
				list.push({_id: current._id, name: cat_text[0].name});
			}
			current = Category.findOne({_id: current.parent_id});
		}
		list.reverse();
		return list;
	},

	get_current_languages: function() {
		var lang = Session.get("current_language");
		var db_lang = LanguageTags.findOne({
			short_form: lang
		});
		var supported_langs;
		if (Meteor.user()) {
			supported_langs = [];
			var user_languages = Meteor.user().profile.languages;
			for (var a in user_languages) {
				supported_langs.push(LanguageTags.findOne({
					_id: user_languages[a]
				}).name);
			}
		}
		if (!db_lang) {
			return {
				main_lang: "English",
				supported_langs: supported_langs
			}
		}
		return {
			main_lang: db_lang.name,
			supported_langs: supported_langs
		}
	}
}
