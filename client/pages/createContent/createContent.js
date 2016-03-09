
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

		var cat_id = Router.current().params._id;

		if (!cat_id) {
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
			   			console.log(selectedCategory[sel]);
			   			idList.push(selectedCategory[sel]._id);
			   		}
			   	}
			}
			cat_id = idList[0];
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
			category_id: cat_id,
			// Language
			//language: tar.language.value
    	};

    	Meteor.call("submit_content", content, function(error, result){
    		if (error) {
    			console.log(error);
    		} else {
    			template.$("#createSuccess").show();
    		}
    	});
	}
});
