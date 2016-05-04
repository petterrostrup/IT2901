
Template.content.helpers({
	get_content: function() {
		return Session.get("content");
	},
	get_id: function() {
		return Router.current().params._id;
	},
	get_parent_url: function() {
		var current = Content.findOne({_id: Router.current().params._id});
		return Methods.get_parent_url(current.category_id);
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

				console.log(text_default);
				if(typeof text_default !== 'undefined'){
					changeVoteColor(text_default);
					var likesCounter = text_default.upVote.length - text_default.downVote.length;
					text_default.likesCounter = likesCounter;
				}


				Session.set("content", text_default.text);
				Session.set("content_language", default_language.name);
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
					changeVoteColor(content_1);
					var likesCounter = content_1.upVote.length - content_1.downVote.length;
					content_1.likesCounter = likesCounter;

					Session.set("content", content_1.text);
					Session.set("content_language", lang.name);
					return content_1;
				}
			}
		}
		console.log("Did not find any cool stuff.");
		var foo = ContentText.findOne({
			metacontent: content._id
		});

		//change color of voting buttons
		if(foo){
			changeVoteColor(foo);
			var likesCounter = foo.upVote.length - foo.downVote.length;
			foo.likesCounter = likesCounter;
		}


		Session.set("content", foo.text);
		Session.set("content_language", foo.language);
		return foo;
	},
	get_AllContentTextsForContent: function(){
		return ContentText.find({metacontent: Router.current().params._id});
	}
});


var changeVoteColor = function(contentText){

	console.log(contentText.upVote);
	(function rendered() {
		if(contentText.upVote != undefined || contentText.downVote != undefined) {
			console.log("heisann");
		if (!$("#upVote").size() || !$("#downVote").size()) {
			setTimeout(rendered, 100); // give everything some time to render
		}
		if (contentText.upVote.indexOf(Meteor.userId()) != -1) {
			$('#upVote').css('color', 'black');
			$('#downVote').css('color', 'gray');
		}

		else if (contentText.downVote.indexOf(Meteor.userId()) != -1) {
			$('#downVote').css('color', 'black');
			$('#upVote').css('color', 'gray');
		}
		else {
			$('#downVote').css('color', 'gray');
			$('#upVote').css('color', 'gray');
		}
		}
	})();

};


Template.content.events({
    "scroll":function(event, template){
    },
    "click .langButton": function(event, template){
    	var id = event.target.id;
    	var name = event.target.name;
    	// todo: change based on id.
    	// console.log(id);
    	var text = ContentText.findOne({_id: id});
    	// console.log(text);
    	Session.set("content", text.text);
    	Session.set("content_language", name);
    	template.$("#description").text(text.description);
    	template.$("#title").text(text.title);
    	var btns = template.$("#lang-btn-group").children();
    	// console.log(btns.length);
    	for (var a in btns) {
    		if (btns[a].id) {
	    		var b = "#" + btns[a].id;
	    		template.$(b).removeClass("active-lang-btn");
    		}
    	}
    	template.$(("#" + id)).addClass("active-lang-btn");
    }
});

Template.content.events({
	'click .vote':function(event){
		var content = Content.findOne({_id: Router.current().params._id});
		var currentContentText = ContentText.findOne({
			metacontent: content._id
		});
		console.log(event.target.id);
		vote = 0;
		if(event.target.id === 'upVote'){
			vote = 1;

		}
		else{
			vote = -1;

		}

		Meteor.call('vote', currentContentText._id, Meteor.userId(), vote , function(error, result){
			if(error){
				console.log(error);
			}
			else{
				//Toggle like
			}
		});
	}
});




Comments.ui.config({
	template: 'semantic-ui'
});
