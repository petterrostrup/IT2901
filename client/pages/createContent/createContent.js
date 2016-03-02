Session.set("tagname", "");


Meteor.autorun(function() {
	Meteor.subscribe("tags", Session.get("tagname"));
});

Template.createContent.helpers({
	getTag: function() {
		return Tag.find({});
	},
	getContentCategory: function() {
		return Content.find({}).distinct('category', true);
	}
});
Template.createContent.events({
	"submit form": function (event) {
	    // Prevent default browser form submit
	    event.preventDefault();	 
	    // Get value from form element
	 	var content = {
	 		title: $('input#title').val(),
	 		//tags: $('select#tags'),
    		description: $('textarea#description').val(),
    		category: $('select#category').val()
    	}
	    // Insert content into the collection
	    Meteor.call("submit_content", content, function(error, result) {
	        if (error){
	          	console.log(error);
	          	console.log("u wot mate?");
	        } else {
	          	console.log("Content added.");
	    	}
	    })
	}
});