Session.set("tagname", "");
// client-only collection to demo interoperability with server-side one
Fruits = new Mongo.Collection(null);

['Apple', 'Banana', 'Cherry', 'Date', 'Fig', 'Lemon', 'Melon', 'Prune', 'Raspberry', 'Strawberry', 'Blueberry', 'Blackberry', 'Boysenberry', 'Licorice', 'Watermelon', 'Tomato', 'Jackfruit', 'Kiwi', 'Lime', 'Clementine', 'Tangerine', 'Orange', 'Grape'].forEach(function (fruit) {
  Fruits.insert({type: fruit})
});

Meteor.autorun(function() {
	Meteor.subscribe("tags", Session.get("tagname"));
});

Template.createContent.helpers({
settings: function() {
    return {
      position: Session.get("position"),
      limit: 30,  // more than 20, to emphasize matches outside strings *starting* with the filter
      rules: [
        {
          token: '@',
          // string means a server-side collection; otherwise, assume a client-side collection
          collection: 'BigCollection',
          field: 'name',
          options: '', // Use case-sensitive match to take advantage of server index.
          template: Template.serverCollectionPill,
          noMatchTemplate: Template.serverNoMatch
        },
        {
          token: '!',
          collection: Fruits,  // Mongo.Collection object means client-side collection
          field: 'type',
          // set to true to search anywhere in the field, which cannot use an index.
          matchAll: true,  // 'ba' will match 'bar' and 'baz' first, then 'abacus'
          template: Template.clientCollectionPill
        }
      ]
    }
  },

	getTag: function() {
		console.log(Tag.find({}))
		return Tag.find({});
	},
	getContentCategory: function() {
		return Content.find({}).distinct('category', true);
	}
});
Template.createContent.events({
  "autocompleteselect textarea": function(e, t, doc) {
    console.log("selected ", doc);
  },

'keyup #community': function (event) {
	var url = event.currentTarget.value;
	//get values from database
//	template.$("#idforcommunitybox").value = databasestuff
    console.log(url);
  },

	"submit form": function (event) {
	    // Prevent default browser form submit
	    event.preventDefault();	 
	    // Get value from form element
	    alert($('#autocomplete-input-Com').val());
	    alert($('#title').val());

	 	var content = {
/* fix it later
	 		// Title
	 		title: $('#title').val(),
	 		// Content
	 		text: $('#text').val(),

	 		community: $('#autocomplete-input-Com').val()
    	};
    	alert(content.community);
*/
	 		title: $('input#title').val(),
	 		//tags: $('select#tags'),
    		description: $('textarea#description').val(),
    		category: $('select#category').val()
    	}
	    // Insert content into the collection
	    Meteor.call("submit_content", content, function(error, result) {
	        if (error){
	          	console.log(error);
	          	console.log("u wot mate?");
	        } else {
	          	console.log("Content added.");
	    	}
	    });
	    Meteor.call("tag_content", content, $("select#tag"), function(error, result) {
	        if (error){
	          	console.log(error);
	          	console.log("u wot mate?");
	        } else {
	          	console.log("Tagged.");
	    	}
	    });
	}
});