Template.home.helpers({
	getContent: function() {
		return Content.find({});
	},

	getCategory: function(catId) {

		var cat = Category.findOne({_id: catId});
		return cat.name;
	},

	getIcon: function(catId) {

		var cat = Category.findOne({_id: catId});
		return cat.icon;
	},

	timeSince: function(time) {

		then = new Date(time);

		var seconds = Math.floor((new Date() - then) / 1000);

		var interval = Math.floor(seconds / 31536000);

		if (interval > 1) {
			return interval + " years";
		}
		interval = Math.floor(seconds / 2592000);
		if (interval > 1) {
			return interval + " months";
		}
		interval = Math.floor(seconds / 86400);
		if (interval > 1) {
			return interval + " days";
		}
		interval = Math.floor(seconds / 3600);
		if (interval > 1) {
			return interval + " hours";
		}
		interval = Math.floor(seconds / 60);
		if (interval > 1) {
			return interval + " minutes";
		}
		return Math.floor(seconds) + " seconds";
	}

});
