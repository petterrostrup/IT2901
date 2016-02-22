
Template.navigation.events({
  "click #logout": function(event, template){
     Meteor.logout(function(){

     });
  },
});
