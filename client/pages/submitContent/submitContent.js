Template.submitContent.helpers({
    getContent: function() {
        return Content.find({});
    },
    getLang: function() {
        return Language.find({});
    }
});

Template.submitContent.events({
	"submit": function (event, template) {
	    // Prevent default browser form submit
	    event.preventDefault();	    

	    var tar = $('#edit').froalaEditor('html.get', true);
        console.log(tar);
    	Meteor.call("submit_content", tar, function(error, result){
    		if (error) {
    			console.log(error);
    		} else {
                console.log("Added contentText")
    		}
    	});

	}
});
