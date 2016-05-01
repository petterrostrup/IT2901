
Template.translateContent.helpers({
	get_id: function() {
		return Router.current().params._id;
	},
	getContentText: function() {
		var content = Content.findOne({_id: Router.current().params._id});	
		var foo = ContentText.find({metacontent: content._id}).fetch();
		Session.set("trans_content", foo[0].text);
		return foo[0];
	},
	get_supported_languages: function() {
		var id = Router.current().params._id;
		return ContentText.find({metacontent: id});
	},
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
	          template: Template.clientCollectionPill
	        }
	      ]
	    }
	},
	get_content: function() {
		return Session.get("trans_content");
	}
});

Template.translateContent.events({
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

		var langs = $("#autocomplete-input-Lang").val().split(" ");
	   	for (var lang in langs) {
	   		langs[lang] = langs[lang].replace("#", "");
	   	}

	   	if (!langs){
	   		console.log("Why no language?");
	   		return;
	   	}
		content = {
			title: template.$("#title").val(),
			description: template.$("#description").val(),
			text: simplemde.value(),
			language: langs[0],
			metacontent: cont_id
		}


		Meteor.call("transelate_content", content, function(error, result) {
			if (result)
				console.log(result);
			if (error)
				console.log(error);
			else
				Router.go("show_content", {_id: result});
		});
	},
	"click .langButton": function(event, template){
    	var id = event.target.id;
    	// todo: change based on id.
    	var text = ContentText.findOne({_id: id});
    	Session.set("trans_content", text.text);
    	template.$("#description_prew").text(text.description);
    	template.$("#title_prew").text(text.title);
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
