
Template.fix_content.events({
	"click #save_btn": function(event, template) {
		event.preventDefault();
		// console.log(template.$("#epicarea0").val());
		obj = {
			text: template.$("#epicarea0").val(),
			language: "no",
			metacontent: Router.current().params._id
		}

		if (!obj.text) {
			console.log("Ingen text funnet.");
			for (var hei = 0; ; hei++) {
				if (template.$("#epicarea" + String(hei)).val()){
					console.log("Value: ", hei);
					break;
				}
			}
		}

		Meteor.call("submit_content", obj, function(error, result) {
			if (result)
				console.log(result);
			if (error)
				console.log(error);
			else
				Router.go("show_content", {_id: Router.current().params._id});
		});
	}
});