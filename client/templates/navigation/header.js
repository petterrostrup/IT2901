
Template.navigation.helpers({
  
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


