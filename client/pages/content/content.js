
Template.content.get_content = function() {
	return Session.get("content");
}

Template.content.helpers({
	get_id: function() {
		return Router.current().params._id;
	},
	get_parent_url: function() {
		var list = [];
		var current = Content.findOne({_id: Router.current().params._id});
		current = Category.findOne({_id: current.category_id});
		while (current) {
			list.push({_id: current._id, name: current.name});
			current = Category.findOne({_id: current.parent_id});
		}
		list.reverse();
		return list;
	},
	get_supported_languages: function() {
		var id = Router.current().params._id;
		return ContentText.find({metacontent: id});
	},
	getContentText: function() {
		var content = Content.findOne({_id: Router.current().params._id});	
		var default_language = LanguageTags.findOne({
			short_form: Session.get("current_language")
		});
		if (default_language) {
			var text_default = ContentText.findOne({
				metacontent: content._id,
				language: default_language.name
			});
			if (text_default){
				console.log("Found default language. Render with that.");
				return text_default;
			}
		}
		if (Meteor.user()) {
			var languages = Meteor.user().profile.languages;
			for (var a in languages) {
				var lang = LanguageTags.findOne({
					_id: languages[a]
				});
				if (!lang)
					continue;
				var content_1 = ContentText.findOne({
					metacontent: content._id,
					language: lang.name
				});
				if (content_1){
					console.log("Found content for user language.");
					return content_1;
				}
			}
		}
		console.log("Did not find any cool stuff.");
		var foo = ContentText.findOne({
			metacontent: content._id,
		});
		Session.set("content", foo);
		// return foo;
	},
	get_AllContentTextsForContent: function(){
		return ContentText.find({metacontent: Router.current().params._id});
	}
});


Template.content.events({
    "scroll":function(event, template){
    },
    "click .langButton": function(event, template){
    	var id = event.target.id;
    	// todo: change based on id.
    	console.log(id);
    	var text = ContentText.findOne({_id: id});
    	console.log(text);
    	Session.set("content", text.text);
    }
});

Comments.ui.config({
	template: 'semantic-ui'
});
