
Template.content.helpers({
	get_information: function() {
		var data = Content.findOne({_id: Router.current().params._id});
		return data;
	},
	get_parent_url: function() {
		var list = [];
		var current = Content.findOne({_id: Router.current().params._id});
		current = {
			_id: current._id, 
			parent_id: current.category_id,
			name: current.title
		}
		while (current) {
			list.push({_id: current._id, name: current.name});
			current = Category.findOne({_id: current.parent_id});
		}
		list.reverse();
		return list;
	},
	getContentText: function(content) {
		return ContentText.find({metacontent: content._id});
	} 
	//get_current_contentText: function()
});


Template.content.events({
    "scroll":function(event, template){
    }
});

Comments.ui.config({
	template: 'semantic-ui'
});
