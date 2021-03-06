
Template.translateContent.helpers({
	//Returns the id of the current content that the user is on based on the url. 
	get_id: function() {
		return Router.current().params._id;
	},
	//Sets the content that you are trying to translate in the session
	getContentText: function() {
		var content = Content.findOne({_id: Router.current().params._id});	
		var foo = ContentText.find({metacontent: content._id}).fetch();
		var language = Session.get("content_language");
		for (var a in foo) {
			if (foo[a].language === language) {
				Session.set("trans_content", foo[a]);
				return;
			}
		}
		Session.set("trans_content", foo[0]);
	},
	//Gets all the different translations of the content
	get_supported_languages: function() {
		var id = Router.current().params._id;
		return ContentText.find({metacontent: id});
	},
	//
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
	          template: Template.clientCollectionPill
	        }
	      ]
	    }
	},
	//returns the content that you are trying to translate
	get_content: function() {
		return Session.get("trans_content");
	},
	//returns the current language the user are using. 
	current_language: function() {
		return Session.get("content_language");
	}
});

Template.translateContent.events({
	//Toggles between sourcecode of markdown and markdown
	"click #toggle_markdown": function(event, template) {
		var checked = event.target.checked;
		if (checked) {
			template.$("#html_content").hide();
			template.$("#markdown_content").show();
		} else {
			template.$("#html_content").show();
			template.$("#markdown_content").hide();
		}
	},

	//Submits the translated content
	"click #content-submit": function(event, template) {
		event.preventDefault();
		// console.log(template.$("#epicarea0").val());
		//check category
		var cont_id = Router.current().params._id;

		var cont = Content.findOne({_id: cont_id});


		if (simplemde.value() == "") {
			console.log("Ingen text funnet.");
			return;
		}
		if (Session.get("transelate_content")){
			var langs = $("#autocomplete-input-Lang").val().split(" ");
		   	for (var lang in langs) {
		   		langs[lang] = langs[lang].replace("#", "");
		   	}

		   	if (!langs){
		   		console.log("Why no language?");
		   		return;
		   	}
		}
		content = {
			title: template.$("#title").val(),
			description: template.$("#description").val(),
			text: simplemde.value(),
			metacontent: cont_id
		}

		if (Session.get("transelate_content")) {
			content.language = langs[0];
		}
		else if (Session.get("content_language")) {
			content.language = Session.get("content_language");
		} 
		else {
			conent.language = "undefined";
		}

		//calls the method "transelate_content" in methods.js
		Meteor.call("transelate_content", content, function(error, result) {
			if (result)
				console.log(result);
			if (error){
				console.log(error);
				template.$("#logErrorText").text(error);
				template.$("#logError").show();
				setTimeout(function() {
					template.$("#logError").hide();
				}, 4000);
			}
			else
				Router.go("show_content", {_id: result});
		});
	},
	//Changes the language of the content that is being translated 
	"click .langButton": function(event, template){
    	var id = event.target.id;
    	// todo: change based on id.
    	var text = ContentText.findOne({_id: id});
    	Session.set("trans_content", text);
    	var btns = template.$("#lang-btn-group").children();
    	for (var a in btns) {
    		if (btns[a].id) {
	    		var b = "#" + btns[a].id;
	    		template.$(b).removeClass("active-lang-btn");
    		}
    	}
    	template.$(("#" + id)).addClass("active-lang-btn");
    }
})
