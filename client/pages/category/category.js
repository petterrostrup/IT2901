
Template.registerHelper('last',
    function(list, elem) {
        return _.last(list) === elem;
    }
);

Template.category.helpers({
	// Language Search
	settingsLang: function() {
	    return {
	      position: Session.get("position"),
	      limit: 30,  // more than 20, to emphasize matches outside strings *starting* with the filter
	      rules: [
	        {
	          token: '',
	          collection: LanguageTags,  // Mongo.Collection object means client-side collection
	          field: 'name',
	          // set to true to search anywhere in the field, which cannot use an index.
	          matchAll: true,  // 'ba' will match 'bar' and 'baz' first, then 'abacus'
	          template: Template.clientCollectionPillCategory
	        }
	      ]
	    }
	},
	// End of language search

	//Returns the category you are currently in. 
	load_category: function() {
		// var data = Category.findOne({_id: Router.current().params._id});
		// var language = Methods.get_current_language();
		// console.log("LOLASKIS");
		var lang = TAPi18next.lng();
		var language = LanguageTags.findOne({
			short_form: lang
		});
		var data = CategoryText.findOne({
			metacategory: Router.current().params._id,
			language: language.name
		});
		if (!data) {
			data = CategoryText.findOne({
				metacategory: Router.current().params._id
			});
		}
		return data;
	},

	//
	timeSince: function(time) {

		return time.toISOString().slice(0,10);
	},
	//Finds the parent of this cateory, (if it has one), and the parent of that parent, and so on. 
	//returns them all as a list where the first element is the oldest parent. 
	get_parent_url: function() {
		return Methods.get_parent_url(Router.current().params._id);
	},
	//Finds all the categories that has this category as their parent.
	get_children: function() {
		return Session.get("content_children_list");
	},
	load_children: function() {
		var list = [];
		var current = Category.findOne({_id: Router.current().params._id});
		if (!current){
			console.log("ERROR");
			return;
		}
		var lang = TAPi18next.lng();
		var db_lang = LanguageTags.findOne({
			short_form: lang
		});
		var supported_langs;
		if (Meteor.user()) {
			supported_langs = [];
			var user_languages = Meteor.user().profile.languages;
			for (var a in user_languages) {
				var l = LanguageTags.findOne({
					_id: user_languages[a]
				});
				if (l){
					supported_langs.push(l.name);
				}
				// supported_langs.push(LanguageTags.findOne({
				// 	_id: user_languages[a]
				// }).name);
			}
		}

		var children = Category.find({
			parent_id: current._id
		}).fetch();
		for (var c in children) {
			var child = children[c];
			var texts = CategoryText.find({
				metacategory: child._id
			}).fetch();

			var found = false;

			for (var t in texts) {
				var text = texts[t];
				if (text.language === db_lang.name) {
					found = true;
					list.push({
						_id: child._id,
						name: text.name
					});
					break;
				}
			}
			if (!found) {
				if (supported_langs) {
					for (var b in texts) {
						var text = texts[b];
						if (supported_langs.indexOf(text.language) > -1) {
							list.push({
								_id: child._id,
								name: text.name
							});
							break;
						}
					}
				}
				else {
					list.push({
						_id: child._id,
						name: texts[0].name
					});
				}
			}
		}
		Session.set("content_children_list", list);
	},
	//gets the content that is under this category. 
	// Hides all content that is not in the language you are currently using
	get_content: function() {
		// console.log("Init get_content!");
		var list = [];
		var default_language = TAPi18next.lng();
		var db_language = LanguageTags.findOne({
			short_form: default_language
		});
		var current = Category.findOne({_id: Router.current().params._id});
		var user_languages = [];
		if (Meteor.user()) {
			var user_languages = Meteor.user().profile.languages;
			for (var usr_lang in user_languages) {
				user_languages[usr_lang] = LanguageTags.findOne({
					_id: user_languages[usr_lang]
				});
			}
		}
		var hide_other_lang = Session.get("hide_other_languages");
		var all_contents = [];
		// console.log("Hide: " + hide_other_lang);
		for (var c in current.content_ids) {
			var content = Content.findOne({
				_id: current.content_ids[c]
			});
			// console.log(content);
			if (content) {
				var cont_lang = ContentText.find({metacontent: content._id}).fetch();
				if (!cont_lang){
					// console.log("Found no contenttext for content.");
					continue;
				}
				var found = false;
				for (var a in cont_lang) {
					if (cont_lang[a].language === db_language.name){
						all_contents.push({
							_id: content._id,
							title: cont_lang[a].title,
							description: cont_lang[a].description,
							createdBy: content.createdByUsername,
							time: content.timestamp,
							rating: cont_lang[a].upVote.length - cont_lang[a].downVote.length,
							seals: cont_lang[a].seals.length
						});
						found = true;
						break;
					}
				}
				if (found) {
					// console.log("Found content for default language.");
					continue;
				}
				for (var a in cont_lang) {
					for (var langs in user_languages) {
						if (cont_lang[a].language === user_languages[langs].name){
							all_contents.push({
								_id: content._id,
								title: cont_lang[a].title,
								description: cont_lang[a].description,
								createdBy: content.createdByUsername,
								time: content.timestamp,
								rating: cont_lang[a].upVote.length - cont_lang[a].downVote.length,
								seals: cont_lang[a].seals.length								
							});
							found = true;
							// console.log("Content found for user languages.");
							break;
						}
					}
					if (found)
						break;
				}
				if (found || !cont_lang.length)
					continue;
				else if (!hide_other_lang) {
					all_contents.push({
						_id: content._id,
						title: cont_lang[0].title,
						description: cont_lang[0].description,
						createdBy: content.createdByUsername,
						time: content.timestamp,
						rating: cont_lang[0].upVote.length - cont_lang[0].downVote.length,
						seals: cont_lang[0].seals.length
					});
					// console.log("Content not supported found.");
				}
				else{
					// console.log("Skipped hided content.");
				}
			}
		}
		// console.log(all_contents);
		return all_contents;
	},
	/*
	Return content likes based on the contentId provided from category.html
	 */
	getContentLikes: function(id) {
		// console.log("Dette er noe annet.");
		if (id) {
			var text = ContentText.findOne({
				metacontent: id
			});
			return text.upVote.length - text.downVote.length;
		}
	}
});


Template.category.events({
	//Listens to a click. When clicked it will show the "Create new sub category"-form
	// Listens to click. When clicked it will create a new sub category 
    "submit #new_subcategory": function(event, template) {
		console.log(event.target.id );
		if(event.target.id === "new_subcategory") {
			event.preventDefault();
			var langs = $("#autocomplete-input-Lang").val().split(" ");
			for (var lang in langs) {
				langs[lang] = langs[lang].replace("#", "");
			}
			// console.log(langs)
			var cat = {
				name: event.target.name.value,
				description: event.target.description.value,
				parent_id: Router.current().params._id,
			}
			Meteor.call("add_category", cat, langs[0], function (error, result) {
				if (error) {
					console.log(error);
					template.$("#logErrorText").text(error);
					template.$("#logError").show();
					setTimeout(function () {
						template.$("#logError").hide();
					}, 5000);
				}

				else {
					template.$("#logSuccess").show();
					setTimeout(function () {
						template.$("#logSuccess").hide();
					}, 5000);
					// console.log(event.target.name);
					event.target.name.value = "";
					event.target.description.value = "";
					template.$("#autocomplete-input-Lang").val("");
					$('.cancelModalCategory').click();
				}
				if (result) {
					Router.go("show_category", {_id: result});
				}

			});
		}
    },

    "submit #translate_category": function(event, template) {

		if(event.target.id === "translate_category") {

			event.preventDefault();
			var name = event.target.name_trans.value;
			var desc = event.target.desc_trans.value;
			var langs = $("#autocomplete-input-Lang-trans").val().split(" ");
			for (var lang in langs) {
				langs[lang] = langs[lang].replace("#", "");
			}
			var language = langs[0];
			var text = {
				name: name,
				description: desc,
				language: language,
				metacategory: Router.current().params._id
			};
			Meteor.call("translate_category", text, function (error, result) {
				if (error) {
					console.log(error);
					template.$("#logErrorText").text(error);
					template.$("#logError").show();
					setTimeout(function () {
						template.$("#logError").hide();
					}, 5000);
				}
				else {

					template.$("#logSuccess").show();
					setTimeout(function () {
						template.$("#logSuccess").hide();
					}, 5000);
					event.target.name_trans.value = "";
					event.target.desc_trans.value = "";
					template.$("#autocomplete-input-Lang-trans").val("");
					$('.cancelModalTranslate').click();
				}
			});
		}
    },

	"click .clickAble": function(event){
		// event.preventDefault();
		Router.go("show_content", {_id: event.target.parentElement.className.split(" ")[1]});

	}
});