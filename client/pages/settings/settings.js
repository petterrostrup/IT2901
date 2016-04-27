
Template.settings.helpers({
  lang_check: function() {
  	var hide = Session.get("hide_other_languages");
  	if (hide === undefined){
  		Session.set("hide_other_languages", false);
  		return false;
  	}
  	return hide;
  }
});