
Template.settings.helpers({
  //Settings. Checks if you want to see other langs. 
  lang_check: function() {
  	var hide = Session.get("hide_other_languages");
  	if (hide === undefined){
  		Session.set("hide_other_languages", false);
  		return false;
  	}
  	return hide;
  }
});


Template.settings.events({
  //Toggles between seeing other langs and not. 
  "click #toggle_lang": function(event, template) {
  	Session.set("hide_other_languages", event.target.checked);
  	console.log("Hide: " + event.target.checked);
  }
});