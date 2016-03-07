
Template.category.helpers({
	data: function() {
		var data = Category.findOne({_id: Router.current().params._id});
		return data;
	},
	get_parent_url: function() {
		var list = [];
		var current = Category.findOne({_id: Router.current().params._id});
		while (current) {
			list.push({_id: current._id, name: current.name});
			current = Category.findOne({_id: current.parent_id});
		}
		list.reverse();
		return list;
	},
	get_children: function() {
		var list = [];
		var current = Category.findOne({_id: Router.current().params._id});
		for (var child in current.children_id){
			list.push(Category.findOne({_id: current.children_id[child]}));
		}
		return list;
	}
});


Template.category.events({
    "scroll":function(event, template){

    },
    "submit #new_subcategory": function(event, template) {
    	event.preventDefault();
    	var cat = {
    		name: event.target.name.value,
    		description: event.target.description.value,
    		url_name: event.target.name.value,
    		parent_id: Router.current().params._id,
    	}
    	Meteor.call("add_category", cat, function(error, result) {
    		if (error)
    			console.log(error);
    		if (result)
    			console.log(result);
    	});
    }
});