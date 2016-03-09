
var selectedCategory = [];
Template.createContent.helpers({


	settings: function() {
	    return {
	      position: Session.get("position"),
	      limit: 30,  // more than 20, to emphasize matches outside strings *starting* with the filter
	      rules: [
	        {
	          token: '#',
	          collection: Category,  // Mongo.Collection object means client-side collection
	          field: 'name',
	          // set to true to search anywhere in the field, which cannot use an index.
	          matchAll: true,  // 'ba' will match 'bar' and 'baz' first, then 'abacus'
	          template: Template.clientCollectionPill
	        }
	      ]
	    }
	  },

	getTag: function() {
		return Tag.find({});
	},
	getContentCategory: function() {
		return Content.find({}).distinct('category', true);
	}
});
Template.createContent.events({
	"autocompleteselect textarea": function(e, t, doc) {
		console.log("selected ", doc);

		// Add all elements that was enter in the field
		selectedCategory.push({"name": doc.name, "_id": doc._id});

	},

	"submit form": function (event, template) {
	    // Prevent default browser form submit
	    event.preventDefault();	 
	    // Get value from form element
//	    alert(selectedCategory[0]._id);
	    // Crate array of category that was summitted
	   	var cats = $("#autocomplete-input-Cat").val().split(" ");
	   	for (var cat in cats) {
	   		cats[cat] = cats[cat].replace("#", "");
	   	}

	   	// To get only id from cat's name that was summitted
	   	var idList = [];
	   	for (var el in cats) {
		   	var name = cats[el];
		   	for (var sel in selectedCategory) {
		   		if (selectedCategory[sel].name === name) {
		   			idList.push(selectedCategory[sel]._id);
		   		}
		   	}
		}

	    var tar = event.target;
	 	var content = {
	 		// Title
	 		title: tar.title.value,
	 		// Description
	 		description: tar.description.value,
	 		// Content
	 		content: $('#text').val(),
	 		// Community or Group of people
//	 		community: $('#autocomplete-input-Com').val()
			// Category
			category_id: idList[0],
			// Language
			//language: tar.language.value
    	};

    	Meteor.call("submit_content", centent, function(error, result){
    		if (error) {
    			console.log(error);
    		} else {
    			template.$("#createSuccess").show();
    		}
    	});
	}
});
