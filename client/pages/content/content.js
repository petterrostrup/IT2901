
Template.content.helpers({
	get_created_info: function() {
		var content = Content.findOne({
			_id: Router.current().params._id
		});
		return content.createdByUsername;
	},

	isOwner: function() {
		var user = Meteor.user();
		if (!user)
			return false;
		var content = Content.findOne({
			_id: Router.current().params._id
		});
		return user.username === content.createdByUsername;
	},

	get_seals: function() {
		var seals = Session.get("content").seals;
		if (seals.length) {
			return {
				found: true,
				seals: seals
			}
		}
		return {found: false}
	},

	is_organization: function() {
		var user = Meteor.user();
		if (!user) 
			return {found: false};
		if (!user.profile.organization) {
			return {found: false};
		}
		var content = Session.get("content");
		var text = ContentText.findOne({_id: content._id});
		return {
			found: true,
			crossed: text.seals.indexOf(user.profile.organization) > -1
		}
	},

	timeSince: function(time) {
		return time.toISOString().slice(0,10);
	},

	settingsCom: function() {
	    return {
	      position: Session.get("position"),
	      limit: 30,  // more than 20, to emphasize matches outside strings *starting* with the filter
	      rules: [
	        {
	          token: '',
	          collection: Groups,  // Mongo.Collection object means client-side collection
	          field: 'name',
	          // set to true to search anywhere in the field, which cannot use an index.
	          matchAll: true,  // 'ba' will match 'bar' and 'baz' first, then 'abacus'
	          template: Template.clientCollectionPill
	        }
	      ]
	    }
	},

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
		var groups = [];
		for (var a in content.groups) {
			var group = Groups.findOne({name: content.groups[a]});
			if (group) {
				groups.push(group);
			}
		}
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
				text_default.groups = groups;
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
					content_1.groups = groups;
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
		foo.groups = groups;

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

var logSuc = function() {
	$("#logSuccess").show();
	setTimeout(function() {
		$("#logSuccess").hide();
	}, 4000);
}

var logErr = function(error) {
	$("#logError").show();
	$("#logErrorText").text(error);
	setTimeout(function() {
		$("#logError").hide();
	}, 4000);
}


Template.content.events({
	"click #give_seal": function(event, template) {
		Meteor.call("give_seal_of_approval", Session.get("content")._id, function(error, result) {
			if (error) {
				console.log(error);
			} else {
				// console.log("Seal given!");
			}
		});
	},
	"click #remove_seal": function(event, template) {
		Meteor.call("remove_seal_of_approval", Session.get("content")._id, function(error, result) {
			if (error) {
				console.log(error);
			} else {
				// console.log("Seal removed!");
			}
		});
	},
	"click #del_content": function(event, template) {
		Meteor.call("delete_content", Router.current().params._id, function(error) {
			if (error) {
				logErr(error);
			}
			else {
				Router.go("home");
			}
		});
	},
	"keyup #autocomplete-input-Com": function(event, template, doc) {
		if (event.keyCode == 13) {
			var text = template.$("#autocomplete-input-Com").val();
			var group = Groups.findOne({name: text});
			if (group) {
				Meteor.call("add_group_content", {
					content_id: Router.current().params._id,
					name: text
				}, function(error, result) {
					if (error){
						console.log(error);
						logErr(error);
					}
					else {
						logSuc();
					}
				});
			} else {
				Meteor.call("add_group", {name: text}, function(error, result) {
					if (error){
						logErr(error);
						console.log(error);
					}
					else {
						Meteor.call("add_group_content", {
							content_id: Router.current().params._id,
							name: text
						}, function(error, result) {
							if (error) {
								console.log(error);
								logErr(error);
							}
							else {
								logSuc();
							}
						});
					}
				});
			}
			template.$("#autocomplete-input-Com").val("");
			template.$("#new_groups").hide();
			template.$("#open_groups").removeClass("active");
		}
	},
	"click #open_groups": function(event, template) {
		// console.log("LKJLKSFJLK");
		if (!template.$("#open_groups").hasClass('active')) {
			template.$("#new_groups").show();
			template.$("#autocomplete-input-Com").focus();
		}else {
			template.$("#new_groups").hide();
		}
	},
	//changes the language for the content. 
    "click .langButton": function(event, template){
    	var id = event.target.id;
    	var name = event.target.name;
    	// console.log(id);
    	var text = ContentText.findOne({_id: id});
    	// console.log(text);

    	text.likesCounter = text.upVote.length - text.downVote.length;
    	var content = Content.findOne({_id: Router.current().params._id});
    	var groups = [];
		for (var a in content.groups) {
			var group = Groups.findOne({name: content.groups[a]});
			if (group) {
				groups.push(group);
			}
		}
		text.groups = groups;

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
