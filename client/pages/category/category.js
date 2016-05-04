Template.registerHelper('last',
    function(list, elem) {
        return _.last(list) === elem;
    }
);

Template.category.helpers({
	//Returns the category you are currently in. 
	data: function() {
		var data = Category.findOne({_id: Router.current().params._id});
		return data;
	},
	//
	timeSince: function(time) {

		return time.toISOString().slice(0,10);
	},
	//Finds the parent of this cateory, (if it has one), and the parent of that parent, and so on. 
	//returns them all as a list where the first element is the oldest parent. 
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
	//Finds all the categories that has this category as their parent.
	get_children: function() {
		var list = [];
		var current = Category.findOne({_id: Router.current().params._id});
		for (var child in current.children_id){
			list.push(Category.findOne({_id: current.children_id[child]}));
		}
		return list;
	},
	//gets the content that is under this category. 
	// Hides all content that is not in the language you are currently using
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
			console.log(content);
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
							title: cont_lang[a].title,
							description: cont_lang[a].description,
							createdBy: content.createdByUsername,
							time: content.timestamp
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
								title: cont_lang[a].title,
								description: cont_lang[a].description,
								createdBy: content.createdByUsername,
								time: content.timestamp
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
						title: cont_lang[0].title,
						description: cont_lang[0].description,
						createdBy: content.createdByUsername,
						time: content.timestamp
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
	},
	/*
	Return content likes based on the contentId provided from category.html
	 */
	getContentLikes: function(_id) {
		if (typeof _id !== undefined) {
			var text = ContentText.findOne({
				metacontent: _id
			});
			return text.upVote.length - text.downVote.length;
		}
	}
});


Template.category.events({
	//Listens to a click. When clicked it will show the "Create new sub category"-form
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
	// Listens to click. When clicked it will create a new sub category 
    "submit #new_subcategory": function(event, template) {
    	event.preventDefault();
    	var cat = {
    		name: event.target.name.value,
    		description: event.target.description.value,
    		url_name: event.target.name.value,
    		parent_id: Router.current().params._id

    	//Calls the method "add_category" in methods.js with this subcategory that it is trying to create

    	};

    	Meteor.call("add_category", cat, function(error, result) {
    		if (error)
    			console.log(error);
    		if (result)
    			console.log(result);
    	});
    },

	"click .clickAble": function(event){
		event.preventDefault();
		Router.go("/content/" + event.target.parentElement.className.split(" ")[1]);

	}
});