
Template.content.helpers({
	get_information: function() {
		return Content.findOne({_id: Router.current().params._id});

	},
	get_parent_url: function() {
		var list = [];
		var current = Content.findOne({_id: Router.current().params._id});
		current = Category.findOne({_id: current.category_id});
		while (current) {
			list.push({_id: current._id, name: current.name});
			current = Category.findOne({_id: current.parent_id});
		}
		list.reverse();
		return list;
	},
	getContentText: function() {
		var content = Content.findOne({_id: Router.current().params._id});	
		var foo = ContentText.find({metacontent: content._id}).fetch();
		// Fortsett med å legge inn språk til content som følger
		// språket til programmet.
		for (var a in foo) {

		}
		return foo[0];
	},

	print_contentText:function(contentJson){
		console.log(contentJson);
		var temp = json2html(contentJson);
		console.log(temp);
		return temp;
	}

});


Template.content.events({
    "scroll":function(event, template){
    }
});

Comments.ui.config({
	template: 'semantic-ui'
});
