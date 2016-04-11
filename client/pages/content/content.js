
Template.content.helpers({
	get_information: function() {
		return Content.findOne({_id: Router.current().params._id});

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
	getContentText: function(contentID) {
		content = Content.findOne({_id: Router.current().params._id});
		return ContentText.find({metacontent: content._id});
	},
	getCurrentLang: function(){
		return Session.get("ContentLang");
	}

});


Template.content.events({
    "scroll":function(event, template){
    },
    'click .lang_button' : function() {
      Session.set('ContentLang', event.target.id);
   }
});

Comments.ui.config({
	template: 'semantic-ui'
});
