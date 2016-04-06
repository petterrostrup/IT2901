Template.home.helpers({
	getContent: function() {
		return Content.find({});
	},

	getCategory: function(catId) {

		var cat = Category.findOne({_id: catId});
		return cat.name;
	}
});
