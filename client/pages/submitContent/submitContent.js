Template.submit_content.helpers({
    getContent: function() {
        return Content.find({});
    },
    getContentId: function () {
        return {_id: Router.current().params._id};
    },
    data: function() {
        var data = Content.findOne({_id: Router.current().params._id});
        return data;
    }
});

Template.submit_content.onDestroyed(function () {
    $('#editor').trumbowyg('destroy');
});

Template.submit_content.events({
	"submit": function (event, template) {
	    // Prevent default browser form submit
	    event.preventDefault();	

        var text = $('#editor').trumbowyg('html');    
	    var tar = event.target;
        var id = Router.current().params._id;

        var contentText = {
            // lang: tar.lang,
            language: "no",
            text: text,
            metacontent: id
        }

    	Meteor.call("submit_content", contentText, function(error, result){
    		if (error) {
    			console.log(error);
    		} else {
                console.log("Added contentText");
                Router.go("show_content", {_id: id});
    		}
    	});

	}
});
