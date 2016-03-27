Template.submitContent.helpers({
    getContent: function() {
        return Content.find({});
    }
});

Template.submitContent.events({
	"submit": function (event, template) {
	    // Prevent default browser form submit
	    event.preventDefault();	    

	    var tar = event.target;
        var text = $('#edit').froalaEditor('html.get', true);
        console.log(text);
        var contentText = {
            lang: tar.lang,
            text: text,
            metacontent: tar.content
        }

    	Meteor.call("submit_content", contentText, function(error, result){
    		if (error) {
    			console.log(error);
    		} else {
                console.log("Added contentText")
    		}
    	});

	}
});
