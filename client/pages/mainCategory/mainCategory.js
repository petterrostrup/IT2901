
var options = {
  keepHistory: 1000 * 60 * 5,
  localSearch: true
};
var fields = ['name', 'description', "_id"];

CategorySearch = new SearchSource('categorySearch', fields, options);

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
	},
	getCategories: function() {
	    return CategorySearch.getData({
	      transform: function(matchText, regExp) {
	        return matchText.replace(regExp, "<b>$&</b>")
	      },
	      sort: {isoScore: -1}
	    });
	},
	  
	isLoading: function() {
		return CategorySearch.getStatus().loading;
	}
});


Template.mainCategory.events({
    "scroll":function(event, template){

    },
    "keyup #search-box": _.throttle(function(e) {
	    var text = $(e.target).val().trim();
	    CategorySearch.search(text);
	}, 200)
});