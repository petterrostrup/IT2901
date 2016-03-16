$(function() {
      $('#edit').froalaEditor()
});

Template.submitContent.events({
	"submit form": function (event, template) {
	    // Prevent default browser form submit
	    event.preventDefault();	    

	    var tar = $('#edit').froalaEditor('html.get');

    	Meteor.call("submit_content", content, function(error, result){
    		if (error) {
    			console.log(error);
    		} else {
                console.log("Added contentText")
    		}
    	});

	}
});
