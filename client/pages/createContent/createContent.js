Session.set("tagname", "");

Meteor.autorun(function() {
	Meteor.subscribe("tags", Session.get("tagname"));
});

Template.createContent.helpers({
	getTags: function() {
		return Tag.find({});
	}
});

Template.createContent.events({
	"submit form": function (event) {
	    // Prevent default browser form submit
	    event.preventDefault();	 
	    // Get value from form element
	 	var content = {
	 		title: event.target.title.value,
	 		tags: ["kult"],
    		description: event.target.description.value
    	}
	    // Insert content into the collection
	    Meteor.call("submit_content", content, function(error, result) {
	        if (error){
	          	console.log(error);
	          	console.log("u wot mate?");
	        } else {
	          	console.log("Content added.");
	          	// Clear form
	          	event.target.title.value = "";
	          	event.target.description.value = "";
	    	}
	    })
	},
	"keypress #lolas": function(event, template) {
		Session.set("tagname", template.find("#lolas").value);
	}
});