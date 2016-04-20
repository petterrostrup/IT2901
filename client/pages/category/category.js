Template.registerHelper('last',
    function(list, elem) {
        return _.last(list) === elem;
    }
);

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
	},
	get_content: function() {
		var list = [];
		var current = Category.findOne({_id: Router.current().params._id});
		for (var content in current.content_ids){
			list.push(Content.findOne({_id: current.content_ids[content]}))
		}
		return list;
	}
});


Template.category.events({
    "scroll":function(event, template){

    },
	"click #subCatButton":function(event, template){
		if (template.$("#new_subcategory").hasClass('active')){
			template.$("#new_subcategory").removeClass('active');
			template.$("#new_subcategory").hide();
			template.$("#subCatButton").html("&#xf150; Create Subcategory");
		}
		else{
			template.$("#new_subcategory").addClass('active');
			template.$("#new_subcategory").show();
			template.$("#subCatButton").html("&#xf151; Cancel");
		}
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