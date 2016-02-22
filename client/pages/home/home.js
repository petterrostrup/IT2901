Template.body.helpers({
	getContent: function() {
		return Content.find({});
	}
	getContentByID: function (Content) {
		return Content.find({"_id"})
	}
});