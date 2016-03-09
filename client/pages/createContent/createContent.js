// Session.set("tagname", "");


// Meteor.autorun(function() {
// 	Meteor.subscribe("tags", Session.get("tagname"));
// });

Template.createContent.helpers({
	getTag: function() {
		return Tag.find({});
	},
	// getContentCategory: function() {
	// 	return Content.find({}).distinct('category', true);
	// },
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
	get_all_categories: function() {
		return Category.find({});
	}
});

Template.createContent.events({
	"submit form": function (event, template) {
	    // Prevent default browser form submit
	    event.preventDefault();	 

	    var cat_id = Router.current().params._id;
	    if (!cat_id) {
	    	cat_id = event.target.category.options[event.target.category.selectedIndex].id;
	    }
	    // Get value from form element
	 	var content = {
	 		title: $('input#title').val(),
	 		//tags: $('select#tags'),
    		description: $('textarea#description').val(),
    		category_id: cat_id

    	}
	    // Insert content into the collection
	    Meteor.call("submit_content", content, function(error, result) {
	        if (error){
	          	console.log(error);
	          	console.log("u wot mate?");
	        } else {
	          	console.log("Content added.");
				template.$("#createSuccess").show();
	    	}
	    })
	}
});
