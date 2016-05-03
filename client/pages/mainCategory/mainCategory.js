// Search function
var options = {
  keepHistory: 1000 * 60 * 5,
  localSearch: true
};
var fields = ['name', 'title', 'description', "_id", "icon"];


PackageSearch = new SearchSource('categorySearch', fields, options);
ContentSearch = new SearchSource('contentSearch', fields, options);

Template.searchResult.helpers({
    all_categories: function() {
        var categories = Category.find({});

        return categories;
    },
  getPackages: function() {
  	// put if here for saperate two collections for two section search result, might need type for content or category
    return PackageSearch.getData({
      transform: function(matchText, regExp) {
        return matchText.replace(regExp, "<b>$&</b>")
      },
      sort: {isoScore: -1}
    });
  },
  
  isLoading: function() {
    return PackageSearch.getStatus().loading;
  },
  
});

Template.searchResultContent.helpers({
  getContents: function() {
        // put if here for saperate two collections for two section search result, might need type for content or category
    // console.log(ContentSearch.getData({
    //   transform: function(matchText, regExp) {
    //     return matchText.replace(regExp, "<b>$&</b>")
    //   },
    //   sort: {isoScore: -1}
    // }))
    return ContentSearch.getData({
      transform: function(matchText, regExp) {
        return matchText.replace(regExp, "<b>$&</b>")
      },
      sort: {isoScore: -1}
    });
  }
});

Template.searchResult.rendered = function() {
  PackageSearch.search('');

};

Template.searchResultContent.rendered = function() {
  ContentSearch.search('');

};

Template.searchBox.events({
  "keyup #search-box": _.throttle(function(e) {
    var text = $(e.target).val().trim();
    PackageSearch.search(text);
    ContentSearch.search(text);
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
	}
});


Template.mainCategory.events({
    "scroll":function(event, template){

    }
});