
Template.navigation.helpers({
	lang_check: function() {
		if (Session.get("hide_other_languages"))
			return Session.get("hide_other_languages");
		Session.set("hide_other_languages", false);
		return false;
	}
});


Template.navigation.events({
  "click .logout": function(event, template){
     Meteor.logout(function(){

     });
  },
  "click #toggle_lang": function(event, template) {
  	Session.set("hide_other_languages", event.target.checked);
  	console.log("Hide: " + event.target.checked);
  }
});


