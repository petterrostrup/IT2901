
Template.mainCategory.helpers({
	all_categories: function() {
		var categories = Category.find({});
		// var list = [];
		// for (var cat in categories) {
		// 	console.log(categories[cat].parent_id);
		// 	if (!categories[cat].parent_id)
		// 		list.push(categories[cat]);
		// }
		// console.log(list);
		// return list;
		return categories;
	}
});


Template.mainCategory.events({
    "scroll":function(event, template){

    }
});