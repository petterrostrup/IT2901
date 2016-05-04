Template.createContent.rendered = function() {
	$('[data-toggle="popover"]').popover();
};

var selectedCategory = [];
var selectedCommunity = [];
var selectedLanguage = [];
Template.createContent.helpers({
	settingsCat: function() {
	    return {
	      position: Session.get("position"),
	      limit: 30,  // more than 20, to emphasize matches outside strings *starting* with the filter
	      rules: [
	        {
	          token: '#',
	          collection: CategoryText,  // Mongo.Collection object means client-side collection
	          field: 'name',
	          // set to true to search anywhere in the field, which cannot use an index.
	          matchAll: true,  // 'ba' will match 'bar' and 'baz' first, then 'abacus'
	          template: Template.clientCollectionPill
	        }
	      ]
	    }
	},

	settingsCom: function() {
	    return {
	      position: Session.get("position"),
	      limit: 30,  // more than 20, to emphasize matches outside strings *starting* with the filter
	      rules: [
	        {
	          token: '#',
	          collection: CommunityTags,  // Mongo.Collection object means client-side collection
	          field: 'name',
	          // set to true to search anywhere in the field, which cannot use an index.
	          matchAll: true,  // 'ba' will match 'bar' and 'baz' first, then 'abacus'
	          template: Template.clientCollectionPill
	        }
	      ]
	    }
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


	getTag: function() {
		console.log(Tag.find({}))
		return Tag.find({});
	},

	get_current_category: function() {
        var cat_id = Router.current().params._id;
        if (!cat_id){
            return null;
        }
        var category = Category.findOne({_id: cat_id});
        if (!category)
            return null;
        return category;    
    },

	getContentCategory: function() {
		return Content.find({}).distinct('category', true);
	}
});
Template.createContent.events({
	"autocompleteselect input": function(e, t, doc) {
		// console.log("selected ", doc);

		// if (e.target.id === "autocomplete-input-Com") {
		// 	// Add all elements that was enter in the field
		// 	selectedCommunity.push({"name": doc.name, "_id": doc._id});
		// }
		
		// //if (t.$("#autocomplete-input-Cat")) same as e.target.id

		// if (e.target.id === "autocomplete-input-Cat") {
		// 	// Add all elements that was enter in the field
		// 	selectedCategory.push({"name": doc.name, "_id": doc._id});
		// }
		
		// if (e.target.id === "autocomplete-input-Lang") {
		// 	// Add all elements that was enter in the field
		// 	selectedLanguage.push({"name": doc.name, "_id": doc._id});
		// }

	},

	"submit form": function (event, template) {
	    // Prevent default browser form submit
	    event.preventDefault();

		

    	Meteor.call("create_content", content, function(error, result){
    		if (error) {
    			console.log(error);
    		} else {
    			console.log("created");
    			template.$("#createSuccess").show();
    		}
    		if (result) {
    			console.log(result);
    			Router.go("submit_content", {_id: result});
    		}
    	});

	},
	"click #content-submit": function(event, template) {
		event.preventDefault();
		// console.log(template.$("#epicarea0").val());
		//check category
		var cat_id = Router.current().params._id;

		if (!cat_id) {
			// Crate array of category that was summitted
		   	var cats = $("#autocomplete-input-Cat").val().split(" ");
		   	for (var cat in cats) {
		   		cats[cat] = cats[cat].replace("#", "");
		   	}
			cat_id = cats[0];
			cat_id = Category.findOne({categories: CategoryText.findOne({name: cat_id})._id})._id;
			console.log(cat_id)
		}
		// check community
	   	var coms = $("#autocomplete-input-Com").val().split(" ");
	   	for (var com in coms) {
	   		coms[com] = coms[com].replace("#", "");
	   	}
		// check language
		// Crate array of category that was summitted
	   	var langs = $("#autocomplete-input-Lang").val().split(" ");
	   	for (var lang in langs) {
	   		langs[lang] = langs[lang].replace("#", "");
	   	}

		var tar = event.target;
	 	var main = {
			category_id: cat_id
    	};
    	console.log(coms)

    	if (coms) {
    		main.community = coms[0];
    	}

    	if (!langs) {
    		console.log("Need languages!!!");
    		return;
    	}
		content = {
			title: template.$("#title").val(),
			description: template.$("#description").val(),
			text: simplemde.value(),
			language: langs[0]
		}

		if (!content.text) {
			console.log("Ingen text funnet.");
			return;
		}

		Meteor.call("submit_content", main, content, function(error, result) {
			if (result)
				console.log(result);
			if (error)
				console.log(error);
			else
				Router.go("show_content", {_id: result});
		});
	}
});
