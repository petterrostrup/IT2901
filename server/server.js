
Meteor.publish("content", function(){
	return Content.find({});
});