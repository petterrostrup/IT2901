
Template.content.helpers({

	/*	Gets the current content for the user. 
	* 	The content stored in session is markdown
	*/
	get_content: function() {
		return Session.get("content");
	},
	/* 	Gets the id from the url	
	*/
	get_id: function() {
		return Router.current().params._id;
	},
	/*	Gets the parent for this content
		Gets the parent for the parent and so on
		Returns the whole "family" as a list where the 
		first parent is the first element in the list. 
	*/
	get_parent_url: function() {
		var current = Content.findOne({_id: Router.current().params._id});
		return Methods.get_parent_url(current.category_id);

	},
	/*	Returns all the different texts that is under this content
		All texts are in different languages, therefore it will only return 
		texts that are of the supportet languages. 
	*/
	get_supported_languages: function() {
		var id = Router.current().params._id;
		return ContentText.find({metacontent: id});
	},
	/*	Gets the contenttext of your current language. 
	*/
	load_content: function() {
		var content = Content.findOne({_id: Router.current().params._id});
		var default_language = LanguageTags.findOne({
			short_form: Session.get("current_language")
		});
		//Checks if the there is a content with the lanugage the user is using currently. 
		if (default_language) {
			var text_default = ContentText.findOne({
				metacontent: content._id,
				language: default_language.name
			});
			if (text_default){
				// console.log("Found default language. Render with that.");

				// console.log(text_default);
				changeVoteColor(text_default);
				var likesCounter = text_default.upVote.length - text_default.downVote.length;
				text_default.likesCounter = likesCounter;

				Session.set("content", text_default);
				Session.set("content_language", default_language.name);
				return ;
			}
		}
		//Checks if the user is logged on, and tries to find contet from the users preffered languages
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
					// console.log("Found content for user language.");
					changeVoteColor(content_1);
					var likesCounter = content_1.upVote.length - content_1.downVote.length;
					content_1.likesCounter = likesCounter;

					Session.set("content", content_1);
					Session.set("content_language", lang.name);
					return;
				}
			}
		}
		// console.log("Did not find any cool stuff.");
		var foo = ContentText.findOne({
			metacontent: content._id
		});

		//change color of voting buttons
		if(foo){
			changeVoteColor(foo);
			var likesCounter = foo.upVote.length - foo.downVote.length;
			foo.likesCounter = likesCounter;
		}

		Session.set("content", foo);
		Session.set("content_language", foo.language);
		// return foo;
	},
	//Finds all texts fro the content you are currently looking at. 
	get_AllContentTextsForContent: function(){
		return ContentText.find({metacontent: Router.current().params._id});
	}
});


var changeVoteColor = function(contentText){
	(function rendered() {
		if(contentText.upVote != undefined || contentText.downVote != undefined) {
			// console.log("heisann");
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
	//changes the language for the content. 
    "click .langButton": function(event, template){
    	var id = event.target.id;
    	var name = event.target.name;
    	// console.log(id);
    	var text = ContentText.findOne({_id: id});
    	// console.log(text);

    	text.likesCounter = text.upVote.length - text.downVote.length;

    	Session.set("content", text);
    	Session.set("content_language", name);
    	// template.$("#description").text(text.description);
    	// template.$("#title").text(text.title);
    	var btns = template.$("#lang-btn-group").children();
    	// console.log(btns.length);
    	for (var a in btns) {
    		if (btns[a].id) {
	    		var b = "#" + btns[a].id;
	    		template.$(b).removeClass("active-lang-btn");
    		}
    	}
    	template.$(("#" + id)).addClass("active-lang-btn");
    },
    //Voting logic. Checks if you upVote or downVote content. 
	'click .vote':function(event){
		// var content = Content.findOne({_id: Router.current().params._id});
		// var currentContentText = ContentText.findOne({
		// 	metacontent: content._id
		// });
		// console.log(event.target.id);
		var vote;
		if(event.target.id === 'upVote'){
			vote = 1;
		}
		else{
			vote = -1;
		}
		//Call a function in methods.js.
		Meteor.call('vote', Session.get("content")._id, vote, function(error, result){
			if(error){
				console.log(error);
			}
			else {
				var obj = Session.get("content");
				obj.likesCounter = result;
				Session.set("content", obj);
			}
		});
	}
});




Comments.ui.config({
	template: 'semantic-ui'
});
