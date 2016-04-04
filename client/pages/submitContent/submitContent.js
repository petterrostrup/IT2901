Template.submitContent.helpers({
    getContent: function() {
        return Content.find({});
    },
    data: function() {
        var data = Content.findOne({_id: Router.current().params._id});
        return data;
    }
});

Template.submitContent.onDestroyed(function () {
    $('#editor').trumbowyg('destroy');
});

Template.submitContent.events({
	"submit": function (event, template) {
	    // Prevent default browser form submit
	    event.preventDefault();	

        var text = $('#editor').trumbowyg('html');    
	    var tar = event.target;
        var id = Router.current().params._id;

        var contentText = {
            lang: tar.lang,
            text: text,
            metacontent: id
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
