// Search function
var isEmptyField = true;
var options = {
  keepHistory: 1000 * 60 * 5,
  localSearch: true
};
var fields = ['name', 'description', "_id"];

PackageSearch = new SearchSource('categorySearch', fields, options);

Template.searchResult.helpers({
    all_categories: function() {
        var categories = Category.find({});

        return categories;
    },
  getPackages: function() {
    return PackageSearch.getData({
      transform: function(matchText, regExp) {
        return matchText.replace(regExp, "<b>$&</b>")
      },
      sort: {isoScore: -1}
    });
  },
  
  isLoading: function() {
    return PackageSearch.getStatus().loading;
  }
});

Template.searchResult.rendered = function() {
  PackageSearch.search('');
};

Template.searchBox.events({
  "keyup #search-box": _.throttle(function(e) {
    var text = $(e.target).val().trim();
    PackageSearch.search(text);
    isEmptyField = true;
  }, 200)
});

// End of Search function

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
  isEmptyField: function() {
  	return isEmptyField;
  	
  }
});


Template.mainCategory.events({
    "scroll":function(event, template){

    }
});