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
	          token: '#',
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
	data: function() {
		var data = Category.findOne({_id: Router.current().params._id});
		return data;
	},
	get_parent_url: function() {
		var list = [];
		var current = Category.findOne({_id: Router.current().params._id});
		while (current) {
			list.push({_id: current._id, name: current.name});
			current = Category.findOne({_id: current.parent_id});
		}
		list.reverse();
		return list;
	},
	get_children: function() {
		var list = [];
		var current = Category.findOne({_id: Router.current().params._id});
		for (var child in current.children_id){
			list.push(Category.findOne({_id: current.children_id[child]}));
		}
		return list;
	},
	get_content: function() {
		console.log("Init get_content!");
		var list = [];
		var default_language = Session.get("current_language");
		var db_language = LanguageTags.findOne({
			short_form: default_language
		});
		var current = Category.findOne({_id: Router.current().params._id});
		var user_languages = Meteor.user().profile.languages;
		for (var usr_lang in user_languages) {
			user_languages[usr_lang] = LanguageTags.findOne({
				_id: user_languages[usr_lang]
			});
		}
		var hide_other_lang = Session.get("hide_other_languages");
		var all_contents = [];
		console.log("Hide: " + hide_other_lang);
		for (var c in current.content_ids) {
			var content = Content.findOne({
				_id: current.content_ids[c]
			});
			if (content) {
				var cont_lang = ContentText.find({metacontent: content._id}).fetch();
				if (!cont_lang){
					console.log("Found no contenttext for content.");
					continue;
				}
				var found = false;
				for (var a in cont_lang) {
					if (cont_lang[a].language === db_language.name){
						all_contents.push({
							_id: content._id,
							title: cont_lang[a].title
						});
						found = true;
						break;
					}
				}
				if (found) {
					console.log("Found content for default language.");
					continue;
				}
				for (var a in cont_lang) {
					for (var langs in user_languages) {
						if (cont_lang[a].language === user_languages[langs].name){
							all_contents.push({
								_id: content._id,
								title: cont_lang[a].title
							});
							found = true;
							console.log("Content found for user languages.");
							break;
						}
					}
					if (found)
						break;
				}
				if (found)
					continue;
				else if (!hide_other_lang) {
					all_contents.push({
						_id: content._id,
						title: cont_lang[0].title
					});
					console.log("Content not supported found.");
				}
				else{
					console.log("Skipped hided content.");
				}
			}
		}
		console.log(all_contents);
		return all_contents;
	}
});


Template.category.events({
    "scroll":function(event, template){

    },
	"click #subCatButton":function(event, template){
		if (template.$("#new_subcategory").hasClass('active')){
			template.$("#new_subcategory").removeClass('active');
			template.$("#new_subcategory").hide();
			template.$("#subCatButton").html("&#xf150; Create Subcategory");
		}
		else{
			template.$("#new_subcategory").addClass('active');
			template.$("#new_subcategory").show();
			template.$("#subCatButton").html("&#xf151; Cancel");
		}
	},
    "submit #new_subcategory": function(event, template) {
    	event.preventDefault();
    	var language = event.target.language.value
    	var cat = {
    		name: event.target.name.value,
    		description: event.target.description.value,
    		// remove url name in everything 

    		parent_id: Router.current().params._id,
    	}
    	Meteor.call("add_category", cat, language, function(error, result) {
    		if (error)
    			console.log(error);
    		if (result)
    			console.log(result);
    	});
    }
});