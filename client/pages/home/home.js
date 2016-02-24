Template.home.helpers({
	getContent: function() {
		return Content.find({});
	}
});
Template.home.events({
	"submit form": function (event) {
	    // Prevent default browser form submit
	    event.preventDefault();	 
	    // Get value from form element
	    var title = event.target.title.value;
	 	var description = event.target.description.value;
	 	var content = {
	 		title: title,
	 		category: "Job",
	 		tags: ["kult"],
    		description: description
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
	}
});