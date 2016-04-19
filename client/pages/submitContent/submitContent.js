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

        console.log($('#editor').trumbowyg('html'));


        var temp = html2json($('#editor').trumbowyg('html'));

        console.log(temp)
        var id = Router.current().params._id;

        var contentText = {
            language: "no",
            metacontent: id,
            text: temp,
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


